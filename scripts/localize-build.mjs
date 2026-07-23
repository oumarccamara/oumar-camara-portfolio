import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { translations } from '../src/i18n.js'

const rootUrl = 'https://oumarccamara.github.io/oumar-camara-portfolio'
const localeCodes = Object.keys(translations)
const localeTags = { en: 'en_US', es: 'es_ES', de: 'de_DE', it: 'it_IT', fr: 'fr_FR' }
const countryLabels = { en: 'Switzerland', es: 'Suiza', de: 'Schweiz', it: 'Svizzera', fr: 'Suisse' }
const imageAlt = {
  en: 'Oumar Camara, full-stack product engineer',
  es: 'Oumar Camara, ingeniero de producto full-stack',
  de: 'Oumar Camara, Full-Stack Product Engineer',
  it: 'Oumar Camara, ingegnere di prodotto full-stack',
  fr: 'Oumar Camara, ingénieur produit full-stack',
}
const resumeLabels = {
  en: ['Full-stack Product Engineer', 'Profile', 'Product-minded engineer turning complex rules into intuitive interfaces and reliable systems.', 'Selected work', 'Creator and engineer of Facturo, a production SaaS for Swiss freelancers and SMEs.', 'Ownership', 'Product experience, data model, PostgreSQL RLS, Supabase, Stripe billing, security boundaries and deployment.', 'Capabilities', 'React · TypeScript · PostgreSQL · Supabase · Stripe · Accessibility · Product systems', 'Contact'],
  es: ['Ingeniero de producto full-stack', 'Perfil', 'Ingeniero orientado al producto que convierte reglas complejas en interfaces intuitivas y sistemas fiables.', 'Proyecto seleccionado', 'Creador e ingeniero de Facturo, un SaaS en producción para autónomos y pymes suizas.', 'Responsabilidad', 'Experiencia de producto, modelo de datos, RLS de PostgreSQL, Supabase, pagos con Stripe, seguridad y despliegue.', 'Competencias', 'React · TypeScript · PostgreSQL · Supabase · Stripe · Accesibilidad · Sistemas de producto', 'Contacto'],
  de: ['Full-Stack Product Engineer', 'Profil', 'Produktorientierter Entwickler, der komplexe Regeln in intuitive Oberflächen und verlässliche Systeme übersetzt.', 'Ausgewähltes Projekt', 'Gründer und Entwickler von Facturo, einer produktiven SaaS für Schweizer Selbstständige und KMU.', 'Verantwortung', 'Produkterlebnis, Datenmodell, PostgreSQL RLS, Supabase, Stripe-Abrechnung, Sicherheitsgrenzen und Deployment.', 'Kompetenzen', 'React · TypeScript · PostgreSQL · Supabase · Stripe · Barrierefreiheit · Produktsysteme', 'Kontakt'],
  it: ['Ingegnere di prodotto full-stack', 'Profilo', 'Ingegnere orientato al prodotto che trasforma regole complesse in interfacce intuitive e sistemi affidabili.', 'Progetto selezionato', 'Creatore e ingegnere di Facturo, un SaaS in produzione per freelance e PMI svizzere.', 'Responsabilità', 'Esperienza di prodotto, modello dati, RLS PostgreSQL, Supabase, pagamenti Stripe, sicurezza e deployment.', 'Competenze', 'React · TypeScript · PostgreSQL · Supabase · Stripe · Accessibilità · Sistemi di prodotto', 'Contatti'],
  fr: ['Ingénieur produit full-stack', 'Profil', 'Ingénieur orienté produit, je transforme des règles complexes en interfaces intuitives et en systèmes fiables.', 'Projet sélectionné', 'Créateur et ingénieur de Facturo, un SaaS en production pour les indépendants et PME suisses.', 'Responsabilité', 'Expérience produit, modèle de données, RLS PostgreSQL, Supabase, paiements Stripe, sécurité et déploiement.', 'Compétences', 'React · TypeScript · PostgreSQL · Supabase · Stripe · Accessibilité · Systèmes produit', 'Contact'],
}

const template = await readFile('dist/index.html', 'utf8')
const replaceMeta = (html, language) => {
  const t = translations[language]
  const pageUrl = `${rootUrl}/${language}/`
  return html
    .replace('<html lang="en">', `<html lang="${language}">`)
    .replace(/<title>.*?<\/title>/, `<title>${t.meta[0]}</title>`)
    .replace(/(<meta name="description" content=").*?(" \/>)/, `$1${t.meta[1]}$2`)
    .replace(/(<link rel="canonical" href=").*?(" \/>)/, `$1${pageUrl}$2`)
    .replace(/(<meta property="og:title" content=").*?(" \/>)/, `$1${t.meta[0]}$2`)
    .replace(/(<meta property="og:description" content=").*?(" \/>)/, `$1${t.meta[1]}$2`)
    .replace(/(<meta property="og:locale" content=").*?(" \/>)/, `$1${localeTags[language]}$2`)
    .replace(/(<meta property="og:url" content=").*?(" \/>)/, `$1${pageUrl}$2`)
    .replace(/(<meta property="og:image:alt" content=").*?(" \/>)/, `$1${imageAlt[language]}$2`)
    .replace('"inLanguage":"en"', `"inLanguage":"${language}"`)
    .replace(`${rootUrl}/en/","sameAs"`, `${pageUrl}","sameAs"`)
}

await copyFile('public/images/portfolio-social-card.png', 'dist/images/portfolio-social-card.png')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${localeCodes.map((code) => `  <url><loc>${rootUrl}/${code}/</loc>${localeCodes.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate}" href="${rootUrl}/${alternate}/"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${rootUrl}/"/></url>`).join('\n')}\n</urlset>\n`
await writeFile('dist/sitemap.xml', sitemap)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${rootUrl}/sitemap.xml\n`)

for (const language of localeCodes) {
  await mkdir(`dist/${language}`, { recursive: true })
  await writeFile(`dist/${language}/index.html`, replaceMeta(template, language))
}

await mkdir('dist/cv', { recursive: true })
for (const language of localeCodes) {
  const [role, profile, profileText, work, workText, ownership, ownershipText, skills, skillsText, contact] = resumeLabels[language]
  const resume = `<!doctype html><html lang="${language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Oumar Camara — ${role}</title><style>*{box-sizing:border-box}body{margin:0;background:#ebe9e2;color:#11120f;font:15px/1.55 Arial,sans-serif}.page{width:min(820px,100%);min-height:100vh;margin:auto;padding:64px;background:#fff}h1{margin:0;font:56px/1 Georgia,serif}header p{font-size:20px}h2{margin:36px 0 8px;border-top:1px solid #bbb;padding-top:14px;font-size:12px;text-transform:uppercase;letter-spacing:.12em}a{color:inherit}@media(max-width:600px){.page{padding:30px 22px}h1{font-size:42px}}@media print{body{background:#fff}.page{padding:0;width:auto;min-height:0}}</style></head><body><main class="page"><header><h1>Oumar Camara</h1><p>${role} · ${countryLabels[language]}</p></header><h2>${profile}</h2><p>${profileText}</p><h2>${work}</h2><p><strong>Facturo®</strong><br>${workText}</p><h2>${ownership}</h2><p>${ownershipText}</p><h2>${skills}</h2><p>${skillsText}</p><h2>${contact}</h2><p><a href="mailto:omarcamaraq@gmail.com">omarcamaraq@gmail.com</a><br><a href="https://www.linkedin.com/in/oumar-c-204b21295/">LinkedIn</a> · <a href="https://github.com/oumarccamara">GitHub</a> · <a href="https://facturo.ch">Facturo</a></p></main></body></html>`
  await writeFile(`dist/cv/oumar-camara-${language}.html`, resume)
}
