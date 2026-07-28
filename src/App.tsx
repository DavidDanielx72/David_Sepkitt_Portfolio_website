import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import CursorGlow from './components/CursorGlow'
import AmbientParticles from './components/AmbientParticles'
import TechCarousel from './components/TechCarousel'
import {
  ArrowUpRight, Mail, Github, Linkedin, Code, Layers, Database, Brain,
  Sparkles, Cpu, Globe, MapPin, Languages, GraduationCap, ArrowRight,
} from './components/Icons'
import { useReveal } from './hooks/useReveal'
import { projects, skills, experience, education, personal, interests, links } from './data/portfolio'

const ContactForm = lazy(() => import('./components/ContactForm'))

const NAV_ITEMS = ['about', 'projects', 'experience', 'contact']
const ICONS: Record<string, (p: { size?: number }) => JSX.Element> = {
  code: Code, layers: Layers, database: Database, brain: Brain,
  sparkles: Sparkles, cpu: Cpu, globe: Globe,
}

export default function App() {
  useReveal()

  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState('')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  useEffect(() => {
    const indicator = indicatorRef.current
    const show = scrolled && active
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
  }, [active, scrolled])

  const navClass = ['nav', scrolled && 'scrolled', hovered && 'hovered'].filter(Boolean).join(' ')

  const onCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * 100
    const my = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${mx}%`)
    el.style.setProperty('--my', `${my}%`)
  }
  const onCardLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--mx', '50%')
    e.currentTarget.style.setProperty('--my', '0%')
  }

  return (
    <>
      <CursorGlow />
      <AmbientParticles />
      <div className="bg-canvas" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <nav
        className={navClass}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <a href="#home" className="nav-brand">
          <span className="dot" /> David Sepkitt
        </a>
        <div className="nav-links">
          <div className="nav-indicator" ref={indicatorRef} />
          {NAV_ITEMS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => { linksRef.current[id] = el }}
              className={`link${id === 'contact' ? ' nav-cta' : ''}${scrolled && active === id ? ' active' : ''}`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>
      </nav>

      <header className="hero" id="home">
        <div className="container">
          <div className="hero-inner reveal">
            <span className="hero-eyebrow"><span className="pulse" /> ICT Application Development Student</span>
            <h1>
              Hi, I’m David Sepkitt.
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

      <section id="about">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">About &amp; Skills</span>
            <h2 className="section-title">A developer who turns ideas into <span className="accent-text">working software</span></h2>
            <p className="section-sub">
              Application Development student at CPUT with a passion for practical, user-focused
              solutions, a strong work ethic, and the ability to collaborate while writing clean,
              efficient code.
            </p>
          </div>

          <div className="split-grid">
            <div className="about-card reveal">
              <h3>Personal details</h3>
              <div className="meta">
                <span className="chip"><MapPin size={12} /> {personal.location}</span>
                <span className="chip">Age: {personal.age}</span>
                <span className="chip"><Languages size={12} /> {personal.languages}</span>
                <span className="chip">{personal.license}</span>
              </div>
              <h3 style={{ marginTop: 22 }}>Interests</h3>
              <p>Exploring emerging technologies — particularly Artificial Intelligence — and the intersection of music and technology.</p>
              <div className="meta">
                {interests.map((i) => <span className="chip" key={i}>{i}</span>)}
              </div>
            </div>

            <div className="skills-stack">
              {skills.map((s, i) => {
                const Icon = ICONS[s.icon]
                return (
                  <div className="skill-card reveal" key={s.title} style={{ '--i': i } as React.CSSProperties}>
                    <div className="sk-head">
                      {Icon && <div className="ico"><Icon size={18} /></div>}
                      <h4>{s.title}</h4>
                    </div>
                    {s.desc && <p>{s.desc}</p>}
                    <div className="skill-tags">
                      {s.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">Selected work</span>
            <h2 className="section-title">Projects I’ve <span className="accent-text">built</span></h2>
            <p className="section-sub">
              From AI assistants to IoT hardware — each project links to its source on GitHub.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((p, i) => {
              const Icon = ICONS[p.icon]
              return (
                <article
                  className="project-card reveal"
                  key={p.id}
                  style={{ '--i': i } as React.CSSProperties}
                  onMouseMove={onCardMove}
                  onMouseLeave={onCardLeave}
                >
                  <div className="pc-head">
                    <div className="pc-icon">{Icon && <Icon size={20} />}</div>
                    <span className="pc-tag">{p.tag}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="pc-desc">{p.desc}</p>
                  <div className="pc-stack">
                    {p.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
                  </div>
                  <a href={p.link} target="_blank" rel="noreferrer" className="pc-link">
                    {p.id === 'rietfontein' ? 'Visit site' : 'View on GitHub'} <ArrowUpRight size={13} />
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

      <section id="experience">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">Experience &amp; Education</span>
            <h2 className="section-title">Where I’ve <span className="accent-text">contributed &amp; studied</span></h2>
            <p className="section-sub">
              Roles across web, retail, and events — each one sharpening communication, teamwork,
              and calm-under-pressure delivery.
            </p>
          </div>

          <div className="explore-grid">
            <div className="timeline reveal">
              {experience.map((e) => (
                <div className="tl-item" key={e.role}>
                  <div className="tl-date">{e.date}</div>
                  <h4>{e.role}</h4>
                  <div className="tl-org">{e.org}</div>
                  <ul>
                    {e.points.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="reveal">
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

      <section id="contact">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">Contact</span>
            <h2 className="section-title">Let’s build something <span className="accent-text">together</span></h2>
            <p className="section-sub">
              Open to junior developer roles, internships, and freelance web work. Send a message
              below — it lands directly in my inbox.
            </p>
          </div>

          <div className="contact-wrap">
            <div className="contact-info reveal">
              <div>
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
            </div>

            <Suspense fallback={<div className="contact-form reveal"><div className="skeleton" style={{ height: 300 }} /></div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} David Sepkitt — Aspiring Full Stack Software Developer · Cape Town, South Africa
        </div>
      </footer>
    </>
  )
}
