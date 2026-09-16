import { useRef } from 'react'
import { motion } from 'motion/react'
import { projects } from '../data'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, range } from '../lib/math'
import './work.css'

/**
 * Selected Work — four scenes, four compositional logics.
 *
 * The reference prototype alternated image-left / copy-right four times. That
 * mechanical mirroring is the thing this section exists to avoid. DECISIONS D6.
 *
 *   I   Worn        ARRIVAL     the plate lays down large — the physical moment
 *   II  Tableline   APERTURE    a slot widens across the title, ink flipping to cream
 *   III Fieldguide  HORIZONTAL  a pinned rail of crops travelling sideways
 *   IV  Daybook     REST        a small plate, an enormous numeral, silence
 *
 * Sequence: spectacle → precision → travel → stillness.
 */
export function Work() {
  return (
    <section className="work" id="work" data-tone="dark">
      <div className="shell work__head">
        <p className="eyebrow eyebrow--rule">Selected Work</p>
        <h2 className="display-r work__title">Four projects.<br /><em>Room to breathe.</em></h2>
      </div>

      <SceneArrival />
      <SceneAperture />
      <SceneHorizontal />
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
        <a className="scene__link" href="#work">Open project <span aria-hidden="true">↗</span></a>
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
          <a className="scene__link" href="#work">Open project <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </article>
  )
}

/* ── III · HORIZONTAL ────────────────────────────────────
   The scene pins and a rail of crops travels sideways — three windows onto one
   painting, passing like a train window. A change of axis after two vertical
   scenes. */
function SceneHorizontal() {
  const p = projects[2]
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useScrollDriver(() => {
    const el = ref.current
    const rail = railRef.current
    if (!el || !rail) return
    const travel = el.offsetHeight - innerHeight
    const t = clamp(-el.getBoundingClientRect().top / Math.max(1, travel))
    const distance = Math.max(0, rail.scrollWidth - innerWidth)
    const eased = range(t, 0.08, 0.92)
    return () => { rail.style.transform = `translate3d(${-distance * eased}px, 0, 0)` }
  }, !reduced)

  // three windows onto the same plate — different regions of one continuous scene
  const windows = [
    { pos: '2% 62%', label: 'The path' },
    { pos: '48% 34%', label: 'The spire' },
    { pos: '99% 48%', label: 'The lake beyond' },
  ]

  return (
    <article className="scene scene--horizontal" id="plate-iii" ref={ref}>
      <div className="scene__pin">
        <div className="rail__head">
          <span className="numeral scene__num scene__num--iii" aria-hidden="true">{p.numeral}</span>
          <p className="scene__disc eyebrow">{p.discipline}</p>
          <h3 className="display-r scene__name">{p.name}</h3>
          <p className="scene__tag">{p.tagline}</p>
          <p className="body scene__blurb">{p.blurb}</p>
          <a className="scene__link" href="#work">Open project <span aria-hidden="true">↗</span></a>
        </div>

        <div className="rail" ref={railRef}>
          {windows.map((w) => (
            <figure className="rail__window plate-sheet" key={w.label}>
              <span
                className="rail__crop"
                role="img"
                aria-label={`${p.alt} — ${w.label}`}
                style={{ backgroundImage: `url(${p.src})`, backgroundPosition: w.pos }}
              />
              <figcaption className="plate-sheet__cap caption">{w.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </article>
  )
}

/* ── IV · REST ───────────────────────────────────────────
   The quiet beat before Field Notes — but quiet is not the same as dead.

   This scene first had only a one-shot entrance spring while the other three
   ran on continuous scroll-linked motion, so it read as a page that had stopped
   rather than one holding its breath. It now drifts: the numeral, the plate and
   the copy all travel, very slowly and at different rates, for as long as you
   are inside it. Nothing overshoots, nothing is clever — it simply breathes.
   DECISIONS D35. */
function SceneRest() {
  const p = projects[3]
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
    <article className="scene scene--rest" id="plate-iv" ref={ref}>
      <span className="numeral scene__num scene__num--iv" aria-hidden="true" ref={numRef}>{p.numeral}</span>

      <div className="rest__inner">
        <div className="rest__copy" ref={copyRef}>
          <p className="scene__disc eyebrow">{p.discipline}</p>
          <h3 className="display-r scene__name">{p.name}</h3>
          <p className="scene__tag">{p.tagline}</p>
          <p className="body scene__blurb">{p.blurb}</p>
          <a className="scene__link" href="#work">Open project <span aria-hidden="true">↗</span></a>
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
