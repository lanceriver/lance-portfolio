import { useEffect, useRef, useState } from 'react'
import { getVisitCount } from '../lib/visits'
import { contactLinks, email } from '../data'
import { ContactLink } from './Link'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, lerp, range } from '../lib/math'
import './backcover.css'

/**
 * The Back Cover — the reverse of the Hero.
 *
 *   FLAT PAGE → SKY COLOUR → ACTUAL SKY → FULL COASTAL PLATE
 *
 * A field of the plate's sampled sky extends above the artwork, and its top
 * edge keeps a small feather as the plate settles so the join stays soft.
 * The plate is never faded, filtered, or distorted.
 * DECISIONS D18.
 *
 * Composition deliberately differs from the Hero: type sits left-of-centre in
 * the open sky above the plate, in cream, with no scrim. DECISIONS D10.
 *
 * No fake sailboat. No CSS-generated object over any illustration.
 */
export function BackCover() {
  const reduced = useReducedMotion()
  const [visitCount, setVisitCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    void getVisitCount().then((count) => {
      if (active) setVisitCount(count)
    })
    return () => { active = false }
  }, [])
  const wrapRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useScrollDriver(() => {
    const wrap = wrapRef.current
    const scene = sceneRef.current
    if (!wrap || !scene) return

    const travel = wrap.offsetHeight - innerHeight
    const t = clamp(-wrap.getBoundingClientRect().top / Math.max(1, travel))

    const feather = `${lerp(22, 8, range(t, 0, 0.55)).toFixed(2)}vh`
    const scale = lerp(1.06, 1, range(t, 0, 0.72)).toFixed(4)
    const copyIn = range(t, 0.12, 0.4).toFixed(3)

    return () => {
      // the plate's top edge settles into a soft feather as it climbs into view
      scene.style.setProperty('--feather', feather)
      // a gentle uniform settle — inside the stated scale range, never a zoom
      scene.style.setProperty('--plate-scale', scale)
      scene.style.setProperty('--copy-in', copyIn)
    }
  }, !reduced)

  return (
    <section className="cover" id="contact" data-tone="light" data-rule="off">
      {/* the page becomes the plate's own sky — one colour, no gradient stack */}
      <div className="cover__bridge" aria-hidden="true" />

      <div className="cover__wrap" ref={wrapRef}>
        <div className="cover__scene" ref={sceneRef}>
          <div
            className="cover__plate"
            role="img"
            aria-label="A painted coast road above a harbour: lemons overhead, bougainvillea on the wall, sailboats on a deep blue sea, and a cream car on the bend."
          />
          <div className="cover__grain" aria-hidden="true" />

          <div className="cover__copy">
            <p className="eyebrow eyebrow--rule">Contact</p>
            <h2 className="display-r cover__title">Thanks for stopping by.</h2>
            <p className="cover__lede">
              Work, projects, or a good conversation.
            </p>
            <a className="cover__mail" href={`mailto:${email}`}>{email}</a>
            <ul className="cover__links">
              {contactLinks.map((l) => (
                <li key={l.label}><ContactLink link={l} /></li>
              ))}
            </ul>
            <p className="caption cover__visits">{visitCount === null ? null : `Visitor No. ${visitCount.toLocaleString('en-AU')}`}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
