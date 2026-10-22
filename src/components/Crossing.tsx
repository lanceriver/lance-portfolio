import { useEffect, useRef } from 'react'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, mixHex } from '../lib/math'
import './crossing.css'

/**
 * The Crossing — rest, immediately after the Hero's spectacle.
 *
 * It used to carry the List of Plates as well, which cost about a screen and a
 * half before a reader reached a project. That list is summoned from the nav
 * now (see `PlateIndex`), and this section keeps only the two jobs nothing else
 * can do:
 *
 *  (a) the ground warms  hero-exit → snow-lit  across the
 *      section. It is the slowest thing on the site: imperceptible while it
 *      happens, obvious in retrospect. DECISIONS D3.
 *  (b) it is the About anchor, and the one place the page says who this is.
 *
 * Deliberately short — one breath between the painting and the work.
 */
export function Crossing() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const exitColor = useRef('')

  useEffect(() => {
    exitColor.current = getComputedStyle(document.documentElement)
      .getPropertyValue('--hero-exit').trim()
  }, [])

  /**
   * With motion reduced the scroll driver never runs, so the ground would stay
   * at its hero-exit value for the whole page. Resolve it to the settled warm
   * value instead; the Crossing paints its own static exit→lit gradient so the
   * join and warm-up both survive without animation.
   */
  useEffect(() => {
    if (!reduced) return
    const root = document.documentElement
    root.style.setProperty('--page-ground', '#f0eae0')
    return () => { root.style.removeProperty('--page-ground') }
  }, [reduced])

  useScrollDriver(() => {
    const el = ref.current
    if (!el || !exitColor.current) return
    // Spread the warm-up over the section PLUS a viewport. The section is
    // short now, and D3 wants this to be the slowest thing on the site —
    // imperceptible while it happens. Tying it to the section height alone
    // would make the colour shift visible.
    const span = el.offsetHeight + innerHeight
    const p = clamp((innerHeight * 0.62 - el.getBoundingClientRect().top) / span)
    const hex = exitColor.current
    const red = Number.parseInt(hex.slice(1, 3), 16)
    const blue = Number.parseInt(hex.slice(5, 7), 16)
    // A cool grey midpoint would make two warm grounds dip; the sampled cream
    // exit therefore goes straight to snow-lit. Cool plates keep the old path.
    const ground = red >= blue
      ? mixHex(hex, '#f0eae0', p)
      : p < 0.5
        ? mixHex(hex, '#d7dbe0', p / 0.5)
        : mixHex('#d7dbe0', '#f0eae0', (p - 0.5) / 0.5)
    return () => document.documentElement.style.setProperty('--page-ground', ground)
  }, !reduced)

  return (
    <section className="crossing" ref={ref} id="about" data-tone="dark" data-ground="page">
      <div className="shell crossing__inner">
        <div className="crossing__identity">
          <h2 className="display-r crossing__title">About.</h2>
          <p className="crossing__route">Singapore <span aria-hidden="true">→</span><span className="vh">to</span> Sydney</p>
        </div>
        <div className="crossing__bio">
          <p className="body">I’m a final-year computer science student in Sydney, and a Junior Systems Engineer at Pool Safety Solutions.</p>
          <p className="body">My eye for aesthetics carries into the software I build, especially Worn’s design language.</p>
        </div>
        <dl className="crossing__interests" aria-label="A few things I enjoy">
          <div>
            <dt>On foot</dt>
            <dd>Going for walks.</dd>
          </div>
          <div>
            <dt>At the keys</dt>
            <dd>Learning to play piano.</dd>
          </div>
          <div>
            <dt>Out and about</dt>
            <dd>Cafés and places with character.</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
