/**
 * Emits real HTML for every post and gives the home page useful text for
 * crawlers that do not run JavaScript. It also writes the sitemap when the
 * production site URL is known.
 *
 *     dist/writing/<slug>/index.html
 *
 * Why, rather than an SPA fallback rewrite: link-preview crawlers — Slack,
 * iMessage, LinkedIn — do not run JavaScript. Under a fallback they fetch any
 * post URL, receive the home page's shell, and every piece you share shows the
 * same title and the same description. For a page whose whole purpose is to be
 * shared, that is the one thing you would most want working.
 *
 * The prerendered body is replaced by React's createRoot on mount, so readers
 * with JavaScript see the app as usual. DECISIONS D44.
 *
 * Set SITE_URL at build time (e.g. SITE_URL=https://example.com npm run build)
 * to emit absolute canonical and og:image URLs. Without it they stay relative,
 * which most crawlers resolve but none promise to.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { transform } from 'esbuild'
import path from 'node:path'

const DIST = 'dist'
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '')
const DESCRIPTION = 'Lance Rivera is a software engineer in Sydney: Junior Systems Engineer at Pool Safety Solutions and final-year computer science student at UNSW.'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

/** Load the real content rather than a copy, so the prerender cannot drift. */
async function loadData() {
  const src = await readFile('src/data.ts', 'utf8')
  const { code } = await transform(src, { loader: 'ts', format: 'esm' })
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
}

const prerenderStyle = `<style>
.prerender { max-width: 40rem; margin: 0 auto; padding: 14vh 24px 96px; color: #1b2a33; font: 17px/1.6 Georgia, serif; }
.prerender h1 { font-style: italic; font-weight: 400; font-size: clamp(48px, 9vw, 88px); line-height: .9; letter-spacing: -.04em; margin: 0 0 18px; }
.prerender h2 { font-weight: 400; font-size: 28px; margin: 48px 0 12px; }
.prerender h3 { font-weight: 400; font-size: 21px; margin: 20px 0 4px; }
.prerender p, .prerender li { margin: 0 0 12px; }
.prerender ul { list-style: none; padding: 0; margin: 0; }
.prerender a { color: inherit; text-underline-offset: 3px; }
.prerender time { font-family: system-ui, sans-serif; font-size: 13px; color: #5c6b73; }
.prerender blockquote { margin: 24px 0; padding-left: 18px; border-left: 1px solid rgba(27, 42, 51, .3); font-style: italic; }
</style>`

const shell = await readFile(path.join(DIST, 'index.html'), 'utf8')
const { articles, projects, email, contactLinks } = await loadData()

const postShell = shell
  .replace(/\s*<link rel="canonical"[^>]*>/g, '')
  .replace(/\s*<meta property="og:[^"]*"[^>]*>/g, '')
  .replace(/\s*<meta name="twitter:[^"]*"[^>]*>/g, '')
  .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')

for (const a of articles) {
  const url = `/writing/${a.slug}/`
  const abs = SITE ? SITE + url : url
  const img = SITE ? SITE + a.src : a.src
  const title = `${a.title} — Lance Rivera`
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.standfirst,
    datePublished: a.iso,
    image: img,
    url: abs,
    author: { '@type': 'Person', name: 'Lance Rivera', url: SITE ? SITE + '/' : '/' },
  }

  const head = [
    `<link rel="canonical" href="${esc(abs)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${esc(a.title)}" />`,
    `<meta property="og:description" content="${esc(a.standfirst)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:url" content="${esc(abs)}" />`,
    `<meta property="article:published_time" content="${esc(a.iso)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${json(articleJsonLd)}</script>`,
  ].join('\n')

  const body = `<article class="prerender">
<p><a href="/">${esc('Lance Rivera')}</a></p>
<h1>${esc(a.title)}</h1>
<p><time datetime="${esc(a.iso)}">${esc(a.date)}</time> · ${esc(a.minutes)} min read</p>
<p>${esc(a.standfirst)}</p>
${a.body.map((block) => {
    if (block.t === 'p') return `<p>${esc(block.text)}</p>`
    if (block.t === 'h2') return `<h2>${esc(block.text)}</h2>`
    if (block.t === 'quote') return `<blockquote><p>${esc(block.text)}</p></blockquote>`
    return ''
  }).join('\n')}
</article>`

  const html = postShell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(a.standfirst)}" />`)
    // The home page preloads both Zhangjiajie painting sizes; a post preloads only its own image.
    .replace(/\s*<link rel="preload" as="image"[^>]*>/g, '')
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace('</head>', `<link rel="preload" as="image" href="${esc(a.src)}" />\n${prerenderStyle}\n${head}\n</head>`)

  const dir = path.join(DIST, 'writing', a.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html)
  console.log(`  ${url.padEnd(42)} ${a.title}`)
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lance Rivera',
  url: SITE ? SITE + '/' : '/',
  // Role, employer and university come from the résumé.
  jobTitle: 'Junior Systems Engineer',
  worksFor: { '@type': 'Organization', name: 'Pool Safety Solutions' },
  affiliation: { '@type': 'CollegeOrUniversity', name: 'UNSW Sydney' },
  address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressCountry: 'AU' },
  sameAs: contactLinks.filter((link) => link.external).map((link) => link.href),
}

const projectHtml = projects.map((project) => {
  const links = [
    project.href && `<a href="${esc(project.href)}">${esc('Live demo')}</a>`,
    project.repo && `<a href="${esc(project.repo)}">${esc('Code')}</a>`,
  ].filter(Boolean)
  return `<section>
<h3>${esc(project.name)}</h3>
<p>${esc(`${project.tagline}. ${project.blurb}`)}</p>
${links.length ? `<p>${links.join(' · ')}</p>` : ''}
</section>`
}).join('\n')

const writingHtml = articles.map((a) => `<section>
<p><a href="/writing/${esc(a.slug)}/">${esc(a.title)}</a></p>
<p><time datetime="${esc(a.iso)}">${esc(a.date)}</time></p>
<p>${esc(a.standfirst)}</p>
</section>`).join('\n')
const contactHtml = [
  `<a href="mailto:${esc(email)}">${esc(email)}</a>`,
  ...contactLinks.map((link) => `<a href="${esc(link.href)}">${esc(link.label)}</a>`),
].join(' · ')
const homeBody = `<div class="prerender">
<h1>${esc('Lance Rivera')}</h1>
<p>${esc('Software Engineer · Sydney')}</p>
<p>${esc(DESCRIPTION)}</p>
<h2>${esc('Work')}</h2>
${projectHtml}
<h2>${esc('Writing')}</h2>
${writingHtml}
<h2>${esc('Contact')}</h2>
<p>${contactHtml}</p>
</div>`

const homeHtml = shell
  .replace('<div id="root"></div>', `<div id="root">${homeBody}</div>`)
  .replace('</head>', `${prerenderStyle}\n<script type="application/ld+json">${json(personJsonLd)}</script>\n</head>`)
await writeFile(path.join(DIST, 'index.html'), homeHtml)

if (SITE) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    `<url><loc>${esc(SITE + '/')}</loc><lastmod>${today}</lastmod></url>`,
    ...articles.map((a) => `<url><loc>${esc(SITE + `/writing/${a.slug}/`)}</loc><lastmod>${esc(a.iso)}</lastmod></url>`),
  ].join('\n  ')
  await writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>\n`)
} else {
  console.log('  sitemap skipped (set SITE_URL to write sitemap.xml)')
}

console.log(
  `\nprerendered ${articles.length} posts and home page` +
  (SITE ? ` against ${SITE}; sitemap written` : ' with relative URLs (set SITE_URL for absolute og:image and sitemap)')
)
