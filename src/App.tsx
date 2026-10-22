import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Nav, type IndexMode } from './components/Nav'
import { PlateIndex } from './components/PlateIndex'
import { Hero } from './components/Hero'
import { Crossing } from './components/Crossing'
import { Work } from './components/Work'
import { FieldNotes } from './components/FieldNotes'
import { Writing } from './components/Writing'
import { BackCover } from './components/BackCover'
import { Post } from './components/Post'
import { entryScroll, useRoute } from './lib/router'

/**
 * Dev affordance: `?only=<section>` renders a single section at the top of the
 * document, so scroll-linked and pinned scenes can be inspected at scroll 0.
 * Motion-heavy pinned sections are otherwise painful to verify. Takes a
 * comma-separated list so a JOIN between two sections can be inspected too —
 * `?only=notes,writing`. No query parameter means the whole page, so production
 * is unaffected.
 */
const only =
  typeof location !== 'undefined'
    ? new URLSearchParams(location.search).get('only')
    : null

const wanted = only ? only.split(',').map((s) => s.trim()) : null

const show = (name: string) => !wanted || wanted.includes(name)

export function App() {
  const [index, setIndex] = useState<IndexMode | null>(null)
  const route = useRoute()
  const closeIndex = useCallback(() => setIndex(null), [])

  /**
   * Scroll across the one route change this site has.
   *
   * Going out to a post starts at the top, which is obvious. Coming back is
   * not: the reader was most of the way down a very long page, and dropping
   * them at the top of it — or at the anchor, which lands on the section
   * heading rather than the row they clicked — both read as having lost their
   * place. The remembered offset is preferred over the hash for exactly that
   * reason; the hash is the fallback for someone who arrived on a post cold and
   * has no offset to return to.
   */
  const was = useRef(route.name)

  /**
   * Restoring an offset on a freshly mounted page is not one call. `scrollTo`
   * clamps against whatever `scrollHeight` is at that instant, and the instant
   * the book remounts that is a fraction of its real height. So ask again over
   * the next few frames until it takes, recomputing the target each time — a
   * target measured off a half-built layout is as wrong as a clamped scroll.
   */
  const restore = useRef((target: () => number) => {
    let n = 0
    const tick = () => {
      const root = document.documentElement
      const prev = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'     // never animate a page-length jump
      const y = target()
      scrollTo(0, y)
      root.style.scrollBehavior = prev
      if (Math.abs(scrollY - y) > 2 && n < 14) setTimeout(tick, n++ < 4 ? 0 : 32)
    }
    tick()
  }).current

  useLayoutEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = 'manual'
    // a reload lands on an entry that may already carry an offset
    if (entryScroll() > 0) restore(entryScroll)
  }, [restore])

  useLayoutEffect(() => {
    const from = was.current
    was.current = route.name
    if (from === route.name) return

    if (entryScroll() > 0) { restore(entryScroll); return }

    // no offset: either a fresh entry, or a link that named a section
    const hash = location.hash
    if (hash && route.name === 'home') {
      restore(() => {
        const el = document.querySelector(hash) as HTMLElement | null
        return el ? el.getBoundingClientRect().top + scrollY : 0
      })
      return
    }
    restore(() => 0)
  }, [route, restore])

  if (route.name === 'post') return <Post slug={route.slug} />

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <Nav onOpenIndex={setIndex} />
      <PlateIndex open={index} onClose={closeIndex} />
      <main id="content" tabIndex={-1}>
        {show('hero') && <Hero />}
        {show('crossing') && <Crossing />}
        {show('work') && <Work />}
        {show('notes') && <FieldNotes />}
        {show('writing') && <Writing />}
        {show('contact') && <BackCover />}
      </main>
    </>
  )
}
