import { access, readFile } from 'node:fs/promises'
import { languages, translations } from '../src/i18n.js'

const codes = languages.map(([code]) => code)
if (codes.join(',') !== 'en,es,de,it,fr') throw new Error('Expected exactly en, es, de, it and fr')

const shape = (value) => {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
  return typeof value
}
const baseline = JSON.stringify(shape(translations.en))
for (const code of codes) {
  if (JSON.stringify(shape(translations[code])) !== baseline) throw new Error(`${code} translation shape differs from English`)
  const text = JSON.stringify(translations[code])
  if (text.includes('undefined')) throw new Error(`${code} contains missing copy`)
  await access(`dist/${code}/index.html`)
  await access(`dist/cv/oumar-camara-${code}.html`)
  const page = await readFile(`dist/${code}/index.html`, 'utf8')
  if (!page.includes(`<html lang="${code}">`) || !page.includes(`/${code}/`)) throw new Error(`${code} static metadata is invalid`)
}
const app = await readFile('src/App.jsx', 'utf8')
for (const requirement of ['aria-expanded', 'aria-controls', 'menuitemradio', 'aria-checked', 'rel="noopener noreferrer"', 'skip-link']) {
  if (!app.includes(requirement)) throw new Error(`Accessibility/security requirement missing: ${requirement}`)
}
console.log('Locale, metadata, résumé and accessibility checks passed for en, es, de, it and fr.')
