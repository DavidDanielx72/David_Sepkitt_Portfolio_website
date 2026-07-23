import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CursorGlow from './components/CursorGlow'
import AmbientParticles from './components/AmbientParticles'
import TechCarousel from './components/TechCarousel'
import {
  ArrowUpRight, Mail, Github, Linkedin, Code, Layers, Database, Brain,
  Sparkles, Cpu, Globe, GraduationCap, MapPin, ArrowRight,
} from './components/Icons'
import { useReveal } from './hooks/useReveal'
import { projects, skills, experience, education, personal, links } from './data/portfolio'

const ContactForm = lazy(() => import('./components/ContactForm'))

const NAV_ITEMS = ['about', 'projects', 'experience', 'contact']
const ICONS: Record<string, (p: { size?: number }) => JSX.Element> = {
  Code, Layers, Database, Brain, Cpu, Sparkles, Globe,
}

export default function App() {
  useReveal()

  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [active, setActive] = useState('')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<Record<string, HTMLAnchorElement | null>>({})

  // single scroll listener — passive, batched state
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 40)
        setPastHero(y > window.innerHeight * 0.45)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll spy — only observe sections below hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    NAV_ITEMS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // position the animated underline indicator
  useEffect(() => {
    const indicator = indicatorRef.current
    const show = pastHero && active
    if (!show) {
      if (indicator) indicator.classList.remove('visible')
      return
    }
    const el = linksRef.current[active]
    if (!indicator || !el) return
    const parent = el.parentElement
    if (!parent) return
    const pr = parent.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    indicator.style.width = `${er.width}px`
    indicator.style.transform = `translateX(${er.left - pr.left}px)`
    indicator.classList.add('visible')
  }, [active, pastHero])

  const navClass = ['nav', scrolled && 'scrolled'].filter(Boolean).join(' ')

  return (
    <>
      <CursorGlow />
      <AmbientParticles />
      <div className="bg-aurora" aria-hidden="true" />

      <nav className={navClass}>
        <a href="#top" className="nav-brand">DS.</a>
        <div className="nav-links">
          <div className="nav-indicator" ref={indicatorRef} />
          {NAV_ITEMS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => { linksRef.current[id] = el }}
              className={`link${id === 'contact' ? ' nav-cta' : ''}${pastHero && active === id ? ' active' : ''}`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="container">
          <div className="hero-inner reveal">
            <span className="hero-eyebrow"><span className="pulse" /> ICT Application Development Student</span>
            <h1>
              Hi, I'm David Sepkitt.
              <span className="accent">Aspiring Full Stack Developer</span>
            </h1>
            <p className="hero-lead">
              I build practical, user-focused solutions and write clean, efficient code.
              Driven by curiosity and a strong work ethic — ready to grow into a
              full-time Full Stack Software Developer and help build the technologies of the future.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View my work <ArrowUpRight size={15} /></a>
              <a href="#contact" className="btn btn-ghost"><Mail size={15} /> Get in touch</a>
            </div>
            <div className="hero-socials">
              <a href={links.github} target="_blank" rel="noreferrer" className="social-btn" aria-label="GitHub"><Github size={16} /></a>
              <a href={links.linkedin} target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a href={links.email} className="social-btn" aria-label="Email"><Mail size={16} /></a>
            </div>
          </div>
          <TechCarousel />
        </div>
      </header>

      {/* ---------- About & Skills ---------- */}
      <section id="about">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-label">01 — About &amp; Skills</span>
            <h2 className="section-title">A developer who turns ideas into working software</h2>
            <p className="section-sub">
              Application Development student at CPUT with a passion for practical, user-focused
              solutions, a strong work ethic, and the ability to collaborate while writing clean,
              efficient code.
            </p>
          </div>

          <div className="split-grid">
            <div className="about-card reveal">
              <h3 className="card-title">Who I am</h3>
              <p>
                I'm {personal.age}, based in {personal.location}, and currently studying for a
                Diploma in ICT: Application Development at CPUT. I'm passionate about building
                software that solves real problems — whether that's a responsive web app, a Java
                desktop tool, or a database-backed service.
              </p>
              <p>
                I believe great software comes from curiosity, discipline, and a willingness to
                learn. I'm looking for my first full-time role as a Full Stack Developer where I
                can contribute, grow, and help build the technologies of the future.
              </p>
              <div className="about-meta">
                <span><MapPin size={13} /> {personal.location}</span>
                <span>Languages: {personal.languages}</span>
                <span>{personal.license}</span>
              </div>
            </div>

            <div className="skills-grid reveal">
              {skills.map((s) => {
                const Icon = ICONS[s.icon]
                return (
                  <div className="skill-card" key={s.title}>
                    <div className="skill-ico">{Icon && <Icon size={18} />}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      <section id="projects">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-label">02 — Selected Work</span>
            <h2 className="section-title">Projects I've built</h2>
            <p className="section-sub">
              A selection of work spanning web development, Java applications, WordPress, and
              UI/UX design — each chosen to show a different facet of my skill set.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((p) => {
              const Icon = ICONS[p.icon]
              return (
                <article className="project-card reveal" key={p.title}>
                  <div className="pc-icon">{Icon && <Icon size={20} />}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="pc-tags">
                    {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                  <a href={p.link} target="_blank" rel="noreferrer" className="pc-link">
                    View on GitHub <ArrowUpRight size={13} />
                  </a>
                </article>
              )
            })}
          </div>

          <a href={links.github} target="_blank" rel="noreferrer" className="projects-cta reveal">
            <Github size={18} />
            <span>Explore more of my projects on GitHub</span>
            <ArrowRight size={16} className="cta-arrow" />
          </a>
        </div>
      </section>

      {/* ---------- Experience & Education ---------- */}
      <section id="experience">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-label">03 — Experience &amp; Education</span>
            <h2 className="section-title">Where I've worked and studied</h2>
            <p className="section-sub">
              A combination of hands-on work experience and formal education that has shaped
              my approach to software development.
            </p>
          </div>

          <div className="explore-grid">
            <div className="reveal">
              <h3 className="col-title">Experience</h3>
              <div className="exp-stack">
                {experience.map((e) => (
                  <div className="exp-card" key={e.role}>
                    <div className="yr">{e.period}</div>
                    <h4>{e.role}</h4>
                    <div className="org">{e.org}</div>
                    <p>{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal">
              <h3 className="col-title">Education</h3>
              <div className="edu-stack">
                {education.map((e) => (
                  <div className="edu-card" key={e.title}>
                    <div className="yr"><GraduationCap size={13} /> {e.year}</div>
                    <h4>{e.title}</h4>
                    <div className="org">{e.org}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-label">04 — Contact</span>
            <h2 className="section-title">Let's build something together</h2>
            <p className="section-sub">
              I'm actively looking for full-time Full Stack Developer roles and open to freelance
              work. Whether you have a role, a project, or just want to connect — I'd love to hear
              from you.
            </p>
          </div>

          <div className="contact-wrap">
            <div className="contact-info reveal">
              <h2>Get in touch</h2>
              <p>Prefer email or socials? Reach me directly through any of these.</p>
              <div className="ci-rows">
                <a href={links.email} className="ci-row ci-cta">
                  <div className="ico"><Mail size={16} /></div>
                  <span>Email Me</span>
                </a>
                <a href={links.github} target="_blank" rel="noreferrer" className="ci-row ci-cta">
                  <div className="ico"><Github size={16} /></div>
                  <span>Check Out My GitHub</span>
                </a>
                <a href={links.linkedin} target="_blank" rel="noreferrer" className="ci-row ci-cta">
                  <div className="ico"><Linkedin size={16} /></div>
                  <span>Connect With Me on LinkedIn</span>
                </a>
                <div className="ci-row">
                  <div className="ico"><MapPin size={16} /></div>
                  <span>Cape Town, Western Cape</span>
                </div>
              </div>
            </div>

            <Suspense fallback={<div className="contact-form reveal"><p>Loading form…</p></div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-inner">
            <span>© {new Date().getFullYear()} David Sepkitt</span>
            <span className="footer-links">
              <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={links.email}>Email</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
