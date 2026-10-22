import { useRef } from 'react'
import { Atmosphere } from './Atmosphere'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, range } from '../lib/math'
import './hero.css'

/**
 * The Hero. Composition preserved from the approved prototype.
 *
 * The painting is STATIC — no parallax, no scale, no drift, no layer splitting,
 * no filters. The only things that move are the flock, the copy on
 * exit, and the dissolve. DECISIONS D5.
 *
 * The dissolve resolves to the sampled cream cloud sea along the plate's bottom
 * edge, so no hue boundary is crossed at the join. DECISIONS D3/D17.
 */
/** One line of the name, split into per-letter spans for the hover lift. */
function Line({ word }: { word: string }) {
  return (
    <span className="line" aria-hidden="true">
      <span>
        {[...word].map((ch, i) => (
          <span className="hero__letter" key={`${ch}-${i}`}>{ch}</span>
        ))}
      </span>
    </span>
  )
}

export function Hero() {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useScrollDriver(() => {
    const wrap = wrapRef.current
    const hero = heroRef.current
    const copy = copyRef.current
    if (!wrap || !hero || !copy) return

    const travel = wrap.offsetHeight - innerHeight
    const p = clamp(-wrap.getBoundingClientRect().top / Math.max(1, travel))

    // The dissolve completes at .88, comfortably before the pin releases at 1.0,
    // so the page ground is already solid when the next section meets it.
    // Slow start, decisive finish — keeps the painting readable and shortens
    // the veiled band. DECISIONS D17.
    const fade = range(p, 0.44, 0.88)
    const out = range(p, 0.52, 0.84)

    return () => {
      hero.style.setProperty('--fade', fade.toFixed(4))
      copy.style.opacity = String(1 - out)
      copy.style.transform = `translate3d(0, ${-24 * out}px, 0)`
    }
  }, !reduced)

  return (
    <section className="hero-wrap" ref={wrapRef} id="top" data-tone="light" data-rule="off">
      <div className="hero" ref={heroRef}>
        <div className="hero__plate" role="img" aria-label="A painted travel poster of Zhangjiajie: sandstone pillars crowned with pines under a cobalt sky, a red-eaved pavilion on a cliff to the right, and a sea of cloud below." />

        <Atmosphere reduced={reduced} />

        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__dissolve" data-tone="dark" data-ground="page" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />

        <div className="hero__copy" ref={copyRef}>
          <div className="eyebrow eyebrow--rule hero__eyebrow">Software Engineer · Sydney</div>
          <h1 className="display-i hero__name">
            <Line word="Lance" />
            <Line word="Rivera" />
            {/* The visible name is split per letter for the hover, so the real
                string is kept for anyone not looking at it. It sits last so it
                cannot shift the :nth-child indices the line animations use. */}
            <span className="vh">Lance Rivera</span>
          </h1>
          <p className="hero__lede">I build production software.</p>
          <div className="hero__cue">Scroll to explore ↓</div>
        </div>
      </div>
    </section>
  )
}
