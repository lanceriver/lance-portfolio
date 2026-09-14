/**
 * Emits one real HTML file per post, after `vite build`.
 *
 *     dist/writing/<slug>/index.html
 *
 * Why, rather than an SPA fallback rewrite: link-preview crawlers — Slack,
 * iMessage, LinkedIn — do not run JavaScript. Under a fallback they fetch any
 * post URL, receive the home page's shell, and every piece you share shows the
 * same title and the same description. For a page whose whole purpose is to be
 * shared, that is the one thing you would most want working.
 *
 * These files are not server-rendered: the body stays the empty root div and
 * the app boots and routes as usual. Only the head differs, which is all a
 * crawler reads — and it means every static host serves them with no
 * configuration at all, GitHub Pages included. DECISIONS D44.
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

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Load the real article data rather than a copy of it, so the two cannot drift. */
async function loadArticles() {
  const src = await readFile('src/data.ts', 'utf8')
  const { code } = await transform(src, { loader: 'ts', format: 'esm' })
  const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
  return mod.articles
}

const shell = await readFile(path.join(DIST, 'index.html'), 'utf8')
const articles = await loadArticles()

for (const a of articles) {
  const url = `/writing/${a.slug}/`
  const abs = SITE ? SITE + url : url
  const img = SITE ? SITE + a.src : a.src
  const title = `${a.title} — Lance Rivera`

  const head = [
    `<link rel="canonical" href="${esc(abs)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${esc(a.title)}" />`,
    `<meta property="og:description" content="${esc(a.standfirst)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:url" content="${esc(abs)}" />`,
    `<meta property="article:published_time" content="${esc(a.iso)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n')

  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${esc(a.standfirst)}" />`
    )
    // the home page preloads the alpine plate; a post wants its own
    .replace(/<link rel="preload" as="image"[^>]*>/, `<link rel="preload" as="image" href="${esc(a.src)}" />`)
    .replace('</head>', head + '\n</head>')

  const dir = path.join(DIST, 'writing', a.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html)
  console.log(`  ${url.padEnd(42)} ${a.title}`)
}

console.log(
  `\nprerendered ${articles.length} posts` +
  (SITE ? ` against ${SITE}` : ' with relative URLs (set SITE_URL for absolute og:image)')
)
