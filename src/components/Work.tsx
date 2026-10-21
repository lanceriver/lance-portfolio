import { useRef } from 'react'
import { motion } from 'motion/react'
import { projects } from '../data'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, range } from '../lib/math'
import './work.css'

/**
 * Selected Work: three scenes with three compositional logics.
 */
export function Work() {
  return (
    <section className="work" id="work" data-tone="dark">
      <div className="shell work__head">
        <p className="eyebrow eyebrow--rule">Selected Work</p>
        <h2 className="display-r work__title">Three projects.<br /><em>Room to breathe.</em></h2>
      </div>

      <SceneArrival />
      <SceneAperture />
      <SceneRest />
    </section>
  )
}

/** The plate-book caption: the plate number in condensed caps, the descriptor
    in italic beneath it — the way an illustrated travel book actually sets it. */
function PlateCaption({ label, text }: { label: string; text: string }) {
  return (
    <figcaption className="plate-sheet__cap plate-cap">
      <span className="plate-cap__label">{label}</span>
      <span className="plate-cap__text">{text}</span>
    </figcaption>
  )
}

function projectMeta(p: (typeof projects)[number]) {
  if (p.status) return <p className="caption scene__status">{p.status}</p>
  if (!p.href) return null
  return (
    <div className="scene__links">
      <a className="scene__link" href={p.href} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>
      {p.repo && <a className="scene__link" href={p.repo} target="_blank" rel="noopener noreferrer">Code <span aria-hidden="true">↗</span></a>}
    </div>
  )
}

/* ── I · ARRIVAL ─────────────────────────────────────────
   The most physical moment on the site. A spring, not a scroll-link — it should
   feel like a real object landing, with mass and a settle. */
function SceneArrival() {
  const p = projects[0]
  const reduced = useReducedMotion()

  return (
    <article className="scene scene--arrival" id="plate-i">
      <span className="numeral scene__num scene__num--i" aria-hidden="true">{p.numeral}</span>

      <motion.figure
        className="scene__plate plate-sheet"
        initial={reduced ? false : { x: -54, y: 92, rotate: -2.8, scale: 0.94 }}
        whileInView={{ x: 0, y: 0, rotate: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18, mass: 1.1 }}
      >
        <img src={p.src} alt={p.alt} width={1672} height={941} />
        <PlateCaption label={p.plateLabel} text={p.caption} />
      </motion.figure>

      <div className="scene__caption-block">
        <p className="scene__disc eyebrow">{p.discipline}</p>
        <h3 className="display-r scene__name">{p.name}</h3>
        <p className="scene__tag">{p.tagline}</p>
        <p className="body scene__blurb">{p.blurb}</p>
        {p.points && <ul className="body scene__points">{p.points.map((point) => <li key={point}>{point}</li>)}</ul>}
        {projectMeta(p)}
      </div>
    </article>
  )
}

/* ── II · APERTURE ───────────────────────────────────────
   A vertical slot widens across an enormous title. Where the slot passes over
   the letterforms they flip from ink to cream, because a second copy of the
   title is clipped to the slot and sits over the plate.
   Type-led, mechanical, exact. No springs in this scene. */
function SceneAperture() {
  const p = projects[1]
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useScrollDriver(() => {
    const el = ref.current
    const scene = sceneRef.current
    if (!el || !scene) return
    const travel = el.offsetHeight - innerHeight
    const t = clamp(-el.getBoundingClientRect().top / Math.max(1, travel))
    // slot half-width, 9% → 42% of the frame. Linear: bound to the hand, not eased.
    const open = range(t, 0.12, 0.78)
    return () => scene.style.setProperty('--slot', String(41 - 32 * open))
  }, !reduced)

  return (
    <article className="scene scene--aperture" id="plate-ii" ref={ref}>
      <div className="scene__pin" ref={sceneRef}>
        <span className="numeral scene__num scene__num--ii" aria-hidden="true">{p.numeral}</span>

        <div className="aperture">
          <h3 className="aperture__title display-r" aria-hidden="true">{p.name}</h3>

          <div className="aperture__slot">
            <img className="aperture__img" src={p.src} alt={p.alt} width={1672} height={941} />
            <h3 className="aperture__title aperture__title--lit display-r" aria-hidden="true">{p.name}</h3>
          </div>

          <h3 className="vh">{p.name}</h3>
        </div>

        <div className="aperture__meta">
          <div>
            <p className="scene__disc eyebrow">{p.discipline}</p>
            <p className="scene__tag">{p.tagline}</p>
          </div>
          <p className="body scene__blurb">{p.blurb}</p>
          {p.points && <ul className="body scene__points">{p.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          {projectMeta(p)}
        </div>
      </div>
    </article>
  )
}

/* ── III · REST ───────────────────────────────────────────
   The quiet beat before Field Notes — but quiet is not the same as dead.

   This scene first had only a one-shot entrance spring while the other two
   ran on continuous scroll-linked motion, so it read as a page that had stopped
   rather than one holding its breath. It now drifts: the numeral, the plate and
   the copy all travel, very slowly and at different rates, for as long as you
   are inside it. Nothing overshoots, nothing is clever — it simply breathes.
   DECISIONS D35. */
function SceneRest() {
  const p = projects[2]
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useScrollDriver(() => {
    const el = ref.current
    if (!el || !numRef.current || !plateRef.current || !copyRef.current) return
    const r = el.getBoundingClientRect()
    const t = clamp((innerHeight - r.top) / (innerHeight + r.height))
    // three rates, all slow. The numeral is the slowest thing in the section.
    const num = numRef.current, plate = plateRef.current, copy = copyRef.current
    return () => {
      num.style.transform = `translate3d(0, ${(0.5 - t) * 130}px, 0)`
      plate.style.transform = `translate3d(0, ${(0.5 - t) * 62}px, 0)`
      copy.style.transform = `translate3d(0, ${(0.5 - t) * 26}px, 0)`
    }
  }, !reduced)

  return (
    <article className="scene scene--rest" id="plate-iii" ref={ref}>
      <span className="numeral scene__num scene__num--iii" aria-hidden="true" ref={numRef}>{p.numeral}</span>

      <div className="rest__inner">
        <div className="rest__copy" ref={copyRef}>
          <p className="scene__disc eyebrow">{p.discipline}</p>
          <h3 className="display-r scene__name">{p.name}</h3>
          <p className="scene__tag">{p.tagline}</p>
          <p className="body scene__blurb">{p.blurb}</p>
          {p.points && <ul className="body scene__points">{p.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          {projectMeta(p)}
        </div>

        {/* drift on the wrapper, the arrival on the sheet — so the two
            transforms never fight for the same property */}
        <div className="rest__plate-drift" ref={plateRef}>
          <motion.figure
            className="rest__plate plate-sheet"
            initial={reduced ? false : { y: 44, rotate: 1.8, scale: 0.96 }}
            whileInView={{ y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1 }}
          >
            <img src={p.srcSmall} alt={p.alt} width={1200} height={675} />
            <PlateCaption label={p.plateLabel} text={p.caption} />
          </motion.figure>
        </div>
      </div>
    </article>
  )
}
