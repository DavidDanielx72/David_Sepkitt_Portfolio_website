import { useEffect, useRef, useState } from 'react'
import CursorGlow from './components/CursorGlow'
import AmbientParticles from './components/AmbientParticles'
import ContactForm from './components/ContactForm'
import TechCarousel from './components/TechCarousel'
import {
  ArrowUpRight, Mail, Github, Linkedin, Code, Layers, Database, Brain,
  Sparkles, Cpu, Globe, GraduationCap, MapPin, Languages, ArrowRight,
} from './components/Icons'
import { useReveal } from './hooks/useReveal'
import { projects, skills, experience, education, personal, links } from './data/portfolio'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  code: Code, layers: Layers, database: Database, brain: Brain,
  sparkles: Sparkles, cpu: Cpu, globe: Globe,
}

const NAV_ITEMS = ['about', 'projects', 'experience', 'contact']

export default function App() {
  useReveal()
  // scroll spy — only highlight when scrolled past hero
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [active, setActive] = useState('')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setPastHero(y > window.innerHeight * 0.5)
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
    ;['about', 'projects', 'experience', 'contact'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

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

  const onProjectMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)
    const rx = ((y - 50) / 50) * -4
    const ry = ((x - 50) / 50) * 4
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`
  }
  const onProjectLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  }

  const navClass = ['nav', scrolled && 'scrolled'].filter(Boolean).join(' ')

  return (
    <>
      <div className="bg-canvas" />
      <div className="bg-aurora" />
      <div className="bg-grid" />
      <div className="bg-blobs">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <CursorGlow />
      <AmbientParticles />

      <nav className={navClass}>
        <a href="#home" className="nav-brand"><span className="dot" /> David Sepkitt</a>
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
            <span className="section-tag">About & Skills</span>
            <h2 className="section-title">A developer who turns ideas into <span className="accent-text">working software</span></h2>
            <p className="section-sub">
              Application Development student at CPUT with a passion for practical, user-focused solutions,
              a strong work ethic, and the ability to collaborate while writing clean, efficient code.
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
                <span className="chip">Artificial Intelligence</span>
                <span className="chip">Music</span>
                <span className="chip">Technology</span>
              </div>
            </div>

            <div className="skills-stack">
              {skills.map((s, i) => {
                const Ico = iconMap[s.icon] ?? Code
                return (
                  <div className="skill-card reveal" key={s.title} style={{ ['--i' as string]: i }}>
                    <div className="sk-head">
                      <div className="ico"><Ico size={18} /></div>
                      <h4>{s.title}</h4>
                    </div>
                    <p>{s.desc}</p>
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
            <p className="section-sub">From AI assistants to IoT hardware — each project links to its source on GitHub.</p>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => {
              const Ico = iconMap[p.icon] ?? Code
              return (
                <article
                  className="project-card reveal"
                  key={p.id}
                  style={{ ['--i' as string]: i }}
                  onMouseMove={onProjectMove}
                  onMouseLeave={onProjectLeave}
                >
                  <div className="pc-head">
                    <div className="pc-icon"><Ico size={20} /></div>
                    <span className="pc-tag">{p.tag}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="pc-desc">{p.desc}</p>
                  <div className="pc-stack">
                    {p.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
                  </div>
                  <a href={p.link} target="_blank" rel="noreferrer" className="pc-link">
                    {p.id === 'rietfontein' ? 'Visit site' : 'View on GitHub'}
                    <ArrowUpRight size={13} />
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
            <span className="section-tag">Experience & Education</span>
            <h2 className="section-title">Where I’ve <span className="accent-text">contributed & studied</span></h2>
            <p className="section-sub">Roles across web, retail, and events — each one sharpening communication, teamwork, and calm-under-pressure delivery.</p>
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
            <p className="section-sub">Open to junior developer roles, internships, and freelance web work. Send a message below — it lands directly in my inbox.</p>
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

            <div className="reveal">
              <ContactForm />
            </div>
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
