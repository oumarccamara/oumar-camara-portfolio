import { useEffect, useState } from 'react'

const Arrow = () => <span aria-hidden="true">↗</span>

const frames = [
  { src: '/images/facturo-home.png', label: 'Product experience', title: 'Swiss invoicing, made legible', text: 'A clear entry point for QR-Bill invoicing, VAT, clients, and cash flow.', href: 'https://facturo.ch' },
  { src: '/images/facturo-pricing.png', label: 'Revenue system', title: 'Plans connected to real access', text: 'Four subscription levels, server-owned plan logic, and Stripe-backed state.', href: 'https://facturo.ch/pricing' },
  { src: '/images/facturo-referral.png', label: 'Growth system', title: 'Nine tiers, exact outcomes', text: 'Threshold-driven commissions with predictable monthly payouts.', href: 'https://facturo.ch/referral-program' },
]

const decisions = [
  ['01', 'Correctness before convenience', 'Invoice totals, VAT, PDF output, and QR payment data all derive from one typed model. No duplicated business logic across screens.'],
  ['02', 'Failure is a normal state', 'Stripe events may be late or repeated. Verified, idempotent webhooks keep subscription access correct when the network is not.'],
  ['03', 'Privacy at the data boundary', 'Supabase identifies the user; PostgreSQL Row-Level Security decides what they can read and write. UI filters are never treated as authorization.'],
  ['04', 'Five languages, one product', 'Locale is part of the domain model, from interface copy and formatting to the final customer-facing invoice.'],
]

function useMotionSystem() {
  useEffect(() => {
    const root = document.documentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const reveals = [...document.querySelectorAll('[data-reveal]')]
    root.classList.add('motion-ready')
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < innerHeight && rect.bottom > 0) el.classList.add('is-visible')
    })
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
    }, { threshold: 0.13, rootMargin: '0px 0px -6% 0px' })
    reveals.forEach((el) => observer.observe(el))

    let frame
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      root.style.setProperty('--scroll', max > 0 ? scrollY / max : 0)
      root.style.setProperty('--scroll-px', `${scrollY}px`)
      frame = null
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { root.classList.remove('motion-ready'); observer.disconnect(); removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])
}

function Header() {
  const [open, setOpen] = useState(false)
  return <>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Oumar Camara, home"><b>Oumar</b> Camara</a>
      <div className="header-center"><span>Full-stack product engineer</span><span>Switzerland · CET</span></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu"><span>{open ? 'Close' : 'Menu'}</span><i /></button>
    </header>
    <div className={`menu-panel ${open ? 'open' : ''}`} id="menu" aria-hidden={!open}>
      <nav>{[['01','Work','#work'],['02','Decisions','#decisions'],['03','About','#about']].map(([n,l,h]) => <a key={l} href={h} onClick={() => setOpen(false)}><small>{n}</small>{l}<Arrow /></a>)}</nav>
      <div className="menu-contact"><a href="mailto:omarcamaraq@gmail.com">Email</a><a href="https://www.linkedin.com/in/oumar-c-204b21295/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/oumarccamara" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a></div>
    </div>
    <div className="progress" aria-hidden="true"><i /></div>
  </>
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-status" data-reveal><i /> Available for selected frontend &amp; full-stack roles</div>
    <h1 aria-label="I engineer the parts users should never have to think about">
      <span className="hero-line line-a"><i>I engineer</i></span>
      <span className="hero-line line-b"><i>the parts users</i></span>
      <span className="hero-line line-c"><i>should never have to</i></span>
      <span className="hero-line line-d"><i>think about.</i></span>
    </h1>
    <div className="hero-foot" data-reveal>
      <div className="hero-intro"><p>Product-minded engineer turning complex rules into interfaces that feel obvious and systems that stay correct.</p><div className="hero-socials"><a href="https://www.linkedin.com/in/oumar-c-204b21295/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/oumarccamara" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a></div></div>
      <a className="round-link" href="#work"><span>Explore<br/>selected work</span><b>↓</b></a>
      <p className="hero-index">React · TypeScript · Supabase · Stripe</p>
    </div>
    <span className="hero-orbit" aria-hidden="true">BUILD · SHIP · LEARN ·</span>
  </section>
}

function Statement() {
  return <section className="statement">
    <p className="eyebrow" data-reveal>What I do</p>
    <p className="statement-copy" data-reveal>I work across the product, <span>from the first interaction to the last database policy.</span> My job is to reduce complexity without hiding the truth of the system.</p>
    <div className="velocity" aria-hidden="true"><div>PRODUCT ENGINEERING · PRODUCT ENGINEERING · PRODUCT ENGINEERING ·</div></div>
  </section>
}

function Work() {
  return <section className="work" id="work">
    <div className="section-top" data-reveal><span>01 / Selected work</span><span>One product · Full ownership · Live</span></div>
    <div className="work-title" data-reveal><p>Case study</p><h2>Facturo<span>®</span></h2><a href="https://facturo.ch" target="_blank" rel="noopener noreferrer">Live product <Arrow /></a></div>
    <div className="case-overview" data-reveal><p>A production SaaS for Swiss freelancers and SMEs. I owned the experience, data model, payment infrastructure, security boundaries, and deployment.</p><div><span>Role</span><b>Founder / Engineer</b><span>Stack</span><b>React / TS / Supabase / Stripe</b></div></div>
    <div className="project-rows">
      {frames.map((frame, index) => <article className="project-row" data-reveal key={frame.title}>
        <a className="project-media" href={frame.href} target="_blank" rel="noopener noreferrer">
          <div className="browser-chrome"><i/><i/><i/><span>facturo.ch</span></div>
          <img src={frame.src} alt={`${frame.title} in the live Facturo product`} />
          <b>Open live experience <Arrow /></b>
        </a>
        <div className="project-copy"><span>0{index + 1}</span><small>{frame.label}</small><h3>{frame.title}</h3><p>{frame.text}</p><a href={frame.href} target="_blank" rel="noopener noreferrer">View live <Arrow /></a></div>
      </article>)}
    </div>
  </section>
}

function Decisions() {
  return <section className="decisions" id="decisions">
    <div className="section-top inverse" data-reveal><span>02 / Engineering decisions</span><span>Under the interface</span></div>
    <div className="decision-heading" data-reveal><h2>Pretty isn’t enough.<br/><em>It has to hold.</em></h2><p>The most important work happens where product behavior meets unreliable networks, sensitive data, and rules that cannot be approximate.</p></div>
    <div className="decision-list">{decisions.map(([n,title,text]) => <article key={n} data-reveal><span>{n}</span><h3>{title}</h3><p>{text}</p><i>↗</i></article>)}</div>
  </section>
}

function HiringSignal() {
  return <section className="hiring-signal">
    <div className="section-top" data-reveal><span>Why Oumar</span><span>What I bring to a product team</span></div>
    <div className="hiring-head" data-reveal><p>The short version</p><h2>Someone who can see the <em>whole system</em> and still care about the last pixel.</h2></div>
    <div className="hiring-grid">
      <article data-reveal><span>01</span><h3>Product ownership</h3><p>I turn unclear requirements into a shippable scope, make trade-offs visible, and stay responsible for the result after release.</p></article>
      <article data-reveal><span>02</span><h3>Frontend craft</h3><p>I build responsive, accessible interfaces with a strong visual standard without letting polish weaken performance or maintainability.</p></article>
      <article data-reveal><span>03</span><h3>Backend judgment</h3><p>I understand the trust boundaries behind the UI: data ownership, migrations, payment state, retries, and production failure modes.</p></article>
    </div>
  </section>
}

function About() {
  return <section className="about" id="about">
    <div className="section-top" data-reveal><span>03 / About</span><span>Engineer · Builder · Owner</span></div>
    <div className="about-main">
      <h2 data-reveal>I build like an <em>owner,</em> think like a user, and execute like an engineer.</h2>
      <div className="about-copy" data-reveal><p>I’m Oumar, a full-stack product engineer based in Switzerland. Give me an unclear, high-responsibility problem and I’ll turn it into a system the team can understand, ship, and trust.</p><p>I don’t stop at the edge of the frontend. I follow the outcome through data design, authorization, payments, failure states, deployment, and the details users feel but never see.</p><p>I’m looking for a frontend or full-stack product role where judgment matters as much as implementation. I want to work where engineers are trusted to improve the product, not only complete tickets.</p><a href="mailto:omarcamaraq@gmail.com">Let’s work together <Arrow /></a></div>
    </div>
    <div className="about-proof" data-reveal>
      <article><span>Proof of execution</span><strong>Built Facturo from zero to a live production SaaS.</strong></article>
      <article><span>Depth of ownership</span><strong>Interface, database, security, billing, and deployment.</strong></article>
      <article><span>Product judgment</span><strong>Complex Swiss rules translated into straightforward workflows.</strong></article>
    </div>
    <blockquote data-reveal>“The best engineering work makes complexity disappear for the user, not for the system.”</blockquote>
    <div className="stack-rail" data-reveal>{['React','TypeScript','Product systems','PostgreSQL','Supabase','Stripe','RLS','Edge Functions','Vercel','Accessibility'].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,'0')}</small>{x}</span>)}</div>
  </section>
}

function Footer() {
  return <footer><div className="footer-light"><p data-reveal>Have a hard problem?</p><a data-reveal href="mailto:omarcamaraq@gmail.com">Let’s solve it.<Arrow /></a><div className="contact-row" data-reveal><a href="mailto:omarcamaraq@gmail.com">Email</a><a href="https://www.linkedin.com/in/oumar-c-204b21295/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a><a href="https://github.com/oumarccamara" target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a><a href="https://facturo.ch" target="_blank" rel="noopener noreferrer">Facturo <Arrow /></a></div></div><div className="footer-dark"><span>Oumar Camara © 2026</span><span>Switzerland / Remote Europe</span><a href="#top">Back to the top ↑</a></div></footer>
}

export default function App() {
  useMotionSystem()
  return <><Header/><main><Hero/><Statement/><Work/><Decisions/><HiringSignal/><About/></main><Footer/></>
}
