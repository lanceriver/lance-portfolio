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
 *  (a) the ground warms  snow-shadow → snow-drift → snow-lit  across the
 *      section. It is the slowest thing on the site: imperceptible while it
 *      happens, obvious in retrospect. DECISIONS D3.
 *  (b) it is the About anchor, and the one place the page says who this is.
 *
 * Deliberately short — one breath between the painting and the work.
 */
export function Crossing() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  /**
   * With motion reduced the scroll driver never runs, so the ground would stay
   * at its cool starting value for the whole page. Resolve it to the settled
   * warm value instead; the Crossing paints its own static shadow→lit gradient
   * so the hero's join and the warm-up both survive without animation.
   */
  useEffect(() => {
    if (!reduced) return
    const root = document.documentElement
    root.style.setProperty('--page-ground', '#f0eae0')
    return () => { root.style.removeProperty('--page-ground') }
  }, [reduced])

  useScrollDriver(() => {
    const el = ref.current
    if (!el) return
    // Spread the warm-up over the section PLUS a viewport. The section is
    // short now, and D3 wants this to be the slowest thing on the site —
    // imperceptible while it happens. Tying it to the section height alone
    // would make the colour shift visible.
    const span = el.offsetHeight + innerHeight
    const p = clamp((innerHeight * 0.62 - el.getBoundingClientRect().top) / span)
    const ground =
      p < 0.5
        ? mixHex('#b3c0d8', '#d7dbe0', p / 0.5)
        : mixHex('#d7dbe0', '#f0eae0', (p - 0.5) / 0.5)
    return () => document.documentElement.style.setProperty('--page-ground', ground)
  }, !reduced)

  return (
    <section className="crossing" ref={ref} id="about" data-tone="dark">
      <div className="shell crossing__inner">
        <p className="eyebrow eyebrow--rule">Sydney</p>
        <h2 className="display-r crossing__title">
          I build things<br />that feel like <em>somewhere.</em>
        </h2>
        <p className="body crossing__note">
          Lance Rivera, software engineer at Pool Safety Solutions in Sydney. What follows is a short book of work: three plates,
          each with room around it, and a few things from the side of the desk.
        </p>
      </div>
    </section>
  )
}
