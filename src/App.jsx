import { useEffect, useRef, useState } from 'react'
import { languages, translations } from './i18n'

const Arrow = () => <span aria-hidden="true">↗</span>
const frameLinks = ['https://facturo.ch', 'https://facturo.ch/pricing', 'https://facturo.ch/referral-program']
const frameImages = ['facturo-home.png', 'facturo-pricing.png', 'facturo-referral.png']

function useMotionSystem() {
  useEffect(() => {
    const root = document.documentElement
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const reveals = [...document.querySelectorAll('[data-reveal]')]
    root.classList.add('motion-ready')
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < innerHeight && rect.bottom > 0) el.classList.add('is-visible')
    })
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.13, rootMargin: '0px 0px -6% 0px' })
    reveals.forEach((el) => observer.observe(el))
    let frame
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      root.style.setProperty('--scroll', max > 0 ? scrollY / max : 0)
      frame = null
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { root.classList.remove('motion-ready'); observer.disconnect(); removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])
}

function LanguageSwitcher({ lang, setLang, label }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.type === 'pointerdown' && !root.current?.contains(event.target)) setOpen(false)
    }
    addEventListener('keydown', close)
    addEventListener('pointerdown', close)
    return () => { removeEventListener('keydown', close); removeEventListener('pointerdown', close) }
  }, [])
  return <div className="language-switcher" ref={root}>
    <button type="button" className="language-button" aria-label={`${label}: ${languages.find(([code]) => code === lang)[2]}`} aria-expanded={open} aria-controls="language-menu" onClick={() => setOpen(!open)}>
      <span>{lang.toUpperCase()}</span><i aria-hidden="true">⌄</i>
    </button>
    <div className={`language-menu ${open ? 'open' : ''}`} id="language-menu" role="menu" aria-label={label}>
      {languages.map(([code, short, name]) => <button type="button" role="menuitemradio" aria-checked={lang === code} className={lang === code ? 'active' : ''} key={code} onClick={() => { setLang(code); setOpen(false) }}><span>{short}</span>{name}<i aria-hidden="true">✓</i></button>)}
    </div>
  </div>
}

function Header({ t, lang, setLang }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const close = (event) => event.key === 'Escape' && setOpen(false)
    addEventListener('keydown', close)
    return () => { document.body.classList.remove('menu-open'); removeEventListener('keydown', close) }
  }, [open])
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label={t.home}><b>Oumar</b> Camara</a>
      <div className="header-center"><span>{t.role}</span><span>{t.location}</span></div>
      <div className="header-actions"><LanguageSwitcher lang={lang} setLang={setLang} label={t.language}/><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu"><span>{open ? t.close : t.menu}</span><i /></button></div>
    </header>
    <div className={`menu-panel ${open ? 'open' : ''}`} id="menu" aria-hidden={!open}>
      <nav>{t.nav.map((label, i) => <a key={label} href={['#work','#decisions','#about'][i]} onClick={() => setOpen(false)}><small>0{i + 1}</small>{label}<Arrow /></a>)}</nav>
      <div className="menu-contact"><a href="mailto:omarcamaraq@gmail.com">{t.email}</a><a href="https://www.linkedin.com/in/oumar-c-204b21295/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/oumarccamara" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a></div>
    </div>
    <div className="progress" aria-hidden="true"><i /></div>
  </>
}

function Hero({ t }) {
  return <section className="hero" id="top">
    <div className="hero-status" data-reveal><i />{t.available}</div>
    <h1 aria-label={t.heroLabel}>{t.hero.map((line, i) => <span className={`hero-line line-${'abcde'[i]}`} key={line}><i>{line}</i></span>)}</h1>
    <div className="hero-foot" data-reveal>
      <div className="hero-intro"><p>{t.intro}</p><div className="hero-socials"><a href="https://www.linkedin.com/in/oumar-c-204b21295/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/oumarccamara" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a><a href="mailto:omarcamaraq@gmail.com?subject=Portfolio%20conversation">{t.email} <Arrow /></a></div></div>
      <a className="round-link" href="#work"><span>{t.explore[0]}<br/>{t.explore[1]}</span><b>↓</b></a>
      <p className="hero-index">React · TypeScript · Supabase · Stripe</p>
    </div>
    <div className="hero-proof" data-reveal aria-label={t.factsLabel}>{t.facts.map(([value, label]) => <span key={label}><strong>{value}</strong>{label}</span>)}</div>
    <span className="hero-orbit" aria-hidden="true">BUILD · SHIP · LEARN ·</span>
  </section>
}

function Statement({ t }) {
  return <section className="statement"><p className="eyebrow" data-reveal>{t.statementLabel}</p><p className="statement-copy" data-reveal>{t.statement[0]}<span>{t.statement[1]}</span>{t.statement[2]}</p><div className="velocity" aria-hidden="true"><div>{`${t.marquee} · `.repeat(6)}</div></div></section>
}

function Work({ t }) {
  return <section className="work" id="work">
    <div className="section-top" data-reveal><span>{t.workTop[0]}</span><span>{t.workTop[1]}</span></div>
    <div className="work-title" data-reveal><p>{t.caseStudy}</p><h2>Facturo<span>®</span></h2><a href="https://facturo.ch" target="_blank" rel="noopener noreferrer">{t.liveProduct} <Arrow /></a></div>
    <div className="case-overview" data-reveal><p>{t.overview}</p><div><span>{t.roleLabel}</span><b>{t.roleValue}</b><span>{t.stack}</span><b>React / TS / Supabase / Stripe</b></div></div>
    <div className="case-brief" data-reveal>{t.briefs.map(([title, text]) => <article key={title}><span>{title}</span><p>{text}</p></article>)}</div>
    <div className="project-rows">{t.frames.map(([label, title, text], index) => <article className="project-row" data-reveal key={title}>
      <a className="project-media" href={frameLinks[index]} target="_blank" rel="noopener noreferrer"><div className="browser-chrome"><i/><i/><i/><span>facturo.ch</span></div><img src={`${import.meta.env.BASE_URL}images/${frameImages[index]}`} alt={`${title} ${t.imageAlt}`} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" /><b>{t.openLive} <Arrow /></b></a>
      <div className="project-copy"><span>0{index + 1}</span><small>{label}</small><h3>{title}</h3><p>{text}</p><a href={frameLinks[index]} target="_blank" rel="noopener noreferrer">{t.viewLive} <Arrow /></a></div>
    </article>)}</div>
  </section>
}

function Decisions({ t }) {
  return <section className="decisions" id="decisions"><div className="section-top inverse" data-reveal><span>{t.decisionsTop[0]}</span><span>{t.decisionsTop[1]}</span></div><div className="decision-heading" data-reveal><h2>{t.decisionsHeading[0]}<br/><em>{t.decisionsHeading[1]}</em></h2><p>{t.decisionsIntro}</p></div><div className="decision-list">{t.decisions.map(([title,text], i) => <article key={title} data-reveal><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p><i>↗</i></article>)}</div></section>
}

function HiringSignal({ t }) {
  return <section className="hiring-signal"><div className="section-top" data-reveal><span>{t.whyTop[0]}</span><span>{t.whyTop[1]}</span></div><div className="hiring-head" data-reveal><p>{t.short}</p><h2>{t.whyHeading[0]}<em>{t.whyHeading[1]}</em>{t.whyHeading[2]}</h2></div><div className="hiring-grid">{t.strengths.map(([title,text], i) => <article data-reveal key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}

function About({ t }) {
  return <section className="about" id="about"><div className="section-top" data-reveal><span>{t.aboutTop[0]}</span><span>{t.aboutTop[1]}</span></div><div className="about-main"><h2 data-reveal>{t.aboutHeading[0]}<em>{t.aboutHeading[1]}</em>{t.aboutHeading[2]}</h2><div className="about-copy" data-reveal>{t.about.map((p) => <p key={p}>{p}</p>)}<a href="mailto:omarcamaraq@gmail.com">{t.together} <Arrow /></a></div></div><div className="about-proof" data-reveal>{t.proof.map(([label,text]) => <article key={label}><span>{label}</span><strong>{text}</strong></article>)}</div><blockquote data-reveal>{t.quote}</blockquote><div className="stack-rail" data-reveal>{['React','TypeScript','Product systems','PostgreSQL','Supabase','Stripe','RLS','Edge Functions','Vercel','Accessibility'].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,'0')}</small>{x}</span>)}</div></section>
}

function Footer({ t }) {
  return <footer><div className="footer-light"><p data-reveal>{t.hardProblem}</p><a data-reveal href="mailto:omarcamaraq@gmail.com">{t.solve}<Arrow /></a><div className="contact-row" data-reveal><a href="mailto:omarcamaraq@gmail.com">{t.email}</a><a href="https://www.linkedin.com/in/oumar-c-204b21295/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/oumarccamara" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a><a href="https://facturo.ch" target="_blank" rel="noopener noreferrer">Facturo <Arrow /></a></div></div><div className="footer-dark"><span>Oumar Camara © 2026</span><span>{t.remote}</span><a href="#top">{t.back} ↑</a></div></footer>
}

function getInitialLanguage() {
  const saved = localStorage.getItem('portfolio-language')
  if (translations[saved]) return saved
  const browser = navigator.language?.slice(0, 2).toLowerCase()
  return translations[browser] ? browser : 'en'
}

export default function App() {
  useMotionSystem()
  const [lang, setLang] = useState(getInitialLanguage)
  const t = translations[lang]
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta[0]
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta[1])
    localStorage.setItem('portfolio-language', lang)
  }, [lang, t])
  return <><Header t={t} lang={lang} setLang={setLang}/><main id="main"><Hero t={t}/><Statement t={t}/><Work t={t}/><Decisions t={t}/><HiringSignal t={t}/><About t={t}/></main><Footer t={t}/></>
}
