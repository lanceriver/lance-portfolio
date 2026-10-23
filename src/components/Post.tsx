import { useEffect } from 'react'
import { articles } from '../data'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { postHref } from '../lib/router'
import { Link } from './Link'
import './post.css'

/**
 * One article. The only page on the site that is not the book.
 *
 * It is a route rather than an overlay because the Writing section's own
 * standfirst promises it — "the only part of this book that leaves the
 * one-page world" — and because a post nobody can link to is not a post. The
 * overlay idiom is already spent twice here, on the Field Notes lightbox and
 * the List of Plates, and both are momentary: look, dismiss. A long read in the
 * same container would flatten a distinction that is doing work. DECISIONS D44.
 *
 * Motion is deliberately almost absent. Every other section on this site has an
 * entrance; this one has a reader. The plate lifts, the head arrives, and the
 * body is simply there — MOTION_DIRECTION §8 forbids effects that make someone
 * wait before they can read, and an article is nothing but reading.
 */

export function Post({ slug }: { slug: string }) {
  const reduced = useReducedMotion()
  const i = articles.findIndex((a) => a.slug === slug)
  const a = articles[i]
  const next = articles[(i + 1) % articles.length]

  /**
   * The page ground is driven by the Crossing, which does not exist on this
   * route — left alone it stays at its cold starting value and shows through
   * wherever the article does not reach: under a short post, and on overscroll
   * at either end. Resolve it to the ground the book settles on.
   */
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--page-ground', '#f0eae0')
    return () => { root.style.removeProperty('--page-ground') }
  }, [])

  useEffect(() => {
    if (!a) return
    // The pre-rendered file already carries these; this is for the in-app
    // navigation case, where the served document was the home page.
    const prevTitle = document.title
    const m = document.querySelector('meta[name="description"]')
    const prevDesc = m?.getAttribute('content') ?? ''
    document.title = `${a.title} — Lance Rivera`
    m?.setAttribute('content', a.standfirst)
    return () => {
      document.title = prevTitle
      m?.setAttribute('content', prevDesc)
    }
  }, [a])

  if (!a) return <NotFound />

  return (
    <main id="main-content" tabIndex={-1}>
    <article className={`post${reduced ? ' post--still' : ''}`}>
      <Masthead />

      <div className="shell post__head">
        <p className="eyebrow eyebrow--rule post__meta">
          <time dateTime={a.iso}>{a.date}</time>
          <span aria-hidden="true"> · </span>
          {a.minutes} min read
        </p>
        <h1 className="display-r post__title">{a.title}</h1>
        <p className="post__standfirst">{a.standfirst}</p>
      </div>

      <figure className="shell post__plate">
        <img src={a.src} alt={a.alt} width={1200} height={675} />
        <figcaption className="caption">{a.caption}</figcaption>
      </figure>

      <div className="shell post__body">
        {a.body.map((b, k) =>
          b.t === 'h2' ? (
            <h2 key={k} className="post__h2">{b.text}</h2>
          ) : b.t === 'quote' ? (
            <blockquote key={k} className="post__quote"><p>{b.text}</p></blockquote>
          ) : (
            <p key={k}>{b.text}</p>
          )
        )}
      </div>

      <div className="shell post__foot">
        <Link to="/#writing" className="post__back">
          <span aria-hidden="true">←&nbsp;</span>Notes from the margins
        </Link>
        <Link to={postHref(next.slug)} className="post__next">
          <span className="post__next-label eyebrow">Next</span>
          <span className="subhead">{next.title}</span>
        </Link>
      </div>
    </article>
    </main>
  )
}

/** Two items, and it scrolls away. You have left the book; say so quietly. */
function Masthead() {
  return (
    <div className="shell post__masthead">
      <Link to="/" className="post__brand">LR</Link>
      <Link to="/#writing" className="post__back">Writing</Link>
    </div>
  )
}

function NotFound() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Not found — Lance Rivera'
    return () => { document.title = prev }
  }, [])

  return (
    <main id="main-content" tabIndex={-1}>
    <article className="post post--missing post--still">
      <Masthead />

      <div className="shell post__head">
        <p className="eyebrow eyebrow--rule">Not found</p>
        <h1 className="display-r post__title">That page isn’t&nbsp;here.</h1>
        <p className="post__standfirst">
          The link may be old, or the piece may have been renamed.
        </p>
      </div>
      <div className="shell post__foot">
        <Link to="/#writing" className="post__back">
          <span aria-hidden="true">←&nbsp;</span>Notes from the margins
        </Link>
      </div>
    </article>
    </main>
  )
}
