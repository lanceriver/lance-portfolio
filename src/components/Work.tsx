import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion } from 'motion/react'
import { projects, type Screen } from '../data'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp, range } from '../lib/math'
import './work.css'

// Screens sit at three different depths.
const DRIFT = [160, 40, 100]

function useScreenCapabilities() {
  const [mobile, setMobile] = useState(() => typeof matchMedia === 'function' && matchMedia('(max-width: 900px)').matches)
  const [finePointer, setFinePointer] = useState(() => typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches)

  useEffect(() => {
    const mobileQuery = matchMedia('(max-width: 900px)')
    const finePointerQuery = matchMedia('(hover: hover) and (pointer: fine)')
    const onMobileChange = () => setMobile(mobileQuery.matches)
    const onFinePointerChange = () => setFinePointer(finePointerQuery.matches)
    mobileQuery.addEventListener('change', onMobileChange)
    finePointerQuery.addEventListener('change', onFinePointerChange)
    return () => {
      mobileQuery.removeEventListener('change', onMobileChange)
      finePointerQuery.removeEventListener('change', onFinePointerChange)
    }
  }, [])

  return { mobile, finePointer }
}

/**
 * Selected Work: two scenes with distinct compositional logics.
 */
export function Work() {
  return (
    <section className="work" id="work" data-tone="dark">
      <div className="shell work__head">
        <p className="eyebrow eyebrow--rule">Selected Work</p>
        <h2 className="display-r work__title">Projects.</h2>
      </div>

      <SceneAperture />
      <SceneRest />
    </section>
  )
}

/** The plate-book caption: the plate number in condensed caps, the descriptor
    in italic beneath it — the way an illustrated travel book actually sets it. */
function PlateCaption({ label, text }: { label?: string; text?: string }) {
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
      <a className="scene__link" href={p.href} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span><span className="vh"> (opens in a new tab)</span></a>
      {p.repo && <a className="scene__link" href={p.repo} target="_blank" rel="noopener noreferrer">Code <span aria-hidden="true">↗</span><span className="vh"> (opens in a new tab)</span></a>}
    </div>
  )
}

/* ── I · APERTURE ─────────────────────────────────────────
   A vertical slot widens across an enormous title. The app's table slides up
   through it, and the clipped copy of the title stamps the table in rust.
   Type-led, mechanical, exact. No springs in this scene. DECISIONS D57. */
function SceneAperture() {
  const p = projects[0]
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const apertureRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLImageElement>(null)

  useScrollDriver(() => {
    const el = ref.current
    const scene = sceneRef.current
    const aperture = apertureRef.current
    const rows = rowsRef.current
    if (!el || !scene || !aperture || !rows) return
    const pinTravel = el.offsetHeight - innerHeight
    const t = clamp(-el.getBoundingClientRect().top / Math.max(1, pinTravel))
    const frame = aperture.clientHeight
    const rowsH = rows.offsetHeight
    const travel = Math.max(0, rowsH - frame * 0.76)
    const run = range(t, 0, 0.78)
    // slot half-width, 9% → 42% of the frame. Linear: bound to the hand, not eased.
    const open = range(t, 0.12, 0.78)
    return () => {
      scene.style.setProperty('--slot', String(41 - 32 * open))
      rows.style.transform = `translate3d(0, ${-travel * run}px, 0)`
    }
  }, !reduced)

  return (
    <>
      <article className="scene scene--aperture" id="plate-i" ref={ref}>
        <div className="scene__pin" ref={sceneRef}>
          <span className="numeral scene__num scene__num--i" aria-hidden="true">{p.numeral}</span>

          <div className="aperture" ref={apertureRef}>
            <h3 className="aperture__title display-r" aria-hidden="true">{p.name}</h3>

            <div className="aperture__slot">
              {p.table && (
                <div className="aperture__table">
                  <img
                    ref={rowsRef}
                    className="aperture__rows"
                    src={p.table.src}
                    srcSet={`${p.table.srcSmall} 1000w, ${p.table.src} 1572w`}
                    sizes="(max-width: 900px) 240vw, 80vw"
                    alt={p.table.alt}
                    width={p.table.width}
                    height={p.table.height}
                    decoding="async"
                  />
                </div>
              )}
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

      {p.ledger && (
        <ol className="ledger" aria-label="Details from the Airtable Clone">
          {p.ledger.map((d, i) => (
            <li className="ledger__row" key={d.src}>
              <span className="plate-cap__label ledger__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="ledger__copy">
                <span className="plate-cap__text ledger__label">{d.label}</span>
                <p className="body ledger__text">{d.text}</p>
              </div>
              <img
                className="ledger__img"
                src={d.src}
                srcSet={`${d.src} 840w, ${d.src2x} 1680w`}
                sizes="(max-width: 900px) calc(100vw - 40px), 620px"
                alt={d.alt}
                width={1680}
                height={720}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

/* ── II · REST ────────────────────────────────────────────
   The quiet beat before Field Notes — but quiet is not the same as dead.

   An earlier version gave this scene only a one-shot entrance spring while
   the Airtable scene ran on continuous scroll-linked motion, so it read as a
   page that had stopped rather than one holding its breath. It drifts: the
   numeral and the copy travel, very slowly and at different rates, for as long as you are inside
   it. Nothing overshoots, nothing is clever — it simply breathes. DECISIONS D35.

   It has no painted plate. Worn is the one project with a product to show, so
   its screens are the picture. DECISIONS D54. */
function SceneRest() {
  const p = projects[1]
  const reduced = useReducedMotion()
  const { mobile, finePointer } = useScreenCapabilities()
  const ref = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useScrollDriver(() => {
    const el = ref.current
    if (!el || !numRef.current || !copyRef.current || !listRef.current) return
    const r = el.getBoundingClientRect()
    const t = clamp((innerHeight - r.top) / (innerHeight + r.height))
    const screens = Array.from(listRef.current.children) as HTMLDivElement[]
    const mobile = matchMedia('(max-width: 900px)').matches
    // two rates, both slow. The numeral is the slowest thing in the section.
    const num = numRef.current, copy = copyRef.current
    return () => {
      num.style.transform = `translate3d(0, ${(0.5 - t) * 130}px, 0)`
      copy.style.transform = `translate3d(0, ${(0.5 - t) * 26}px, 0)`
      screens.forEach((child, i) => {
        if (mobile) child.style.transform = ''
        else child.style.transform = `translate3d(0, ${(0.5 - t) * DRIFT[i % DRIFT.length]}px, 0)`
      })
    }
  }, !reduced)

  return (
    <article className="scene scene--rest" id="plate-ii" ref={ref}>
      <span className="numeral scene__num scene__num--ii" aria-hidden="true" ref={numRef}>{p.numeral}</span>

      <div className="rest__inner">
        <div className="rest__copy" ref={copyRef}>
          {/* the introduction and its status in one column, the detail beside
              it from the same top line, so the two end near each other */}
          <div className="rest__lead">
            <p className="scene__disc eyebrow">{p.discipline}</p>
            <h3 className="display-r scene__name">{p.name}</h3>
            <p className="scene__tag">{p.tagline}</p>
            <p className="body scene__blurb">{p.blurb}</p>
            {projectMeta(p)}
          </div>
          <div className="rest__detail">
            {p.points && <ul className="body scene__points">{p.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          </div>
        </div>

        {p.screens && <Screens screens={p.screens} reduced={reduced} mobile={mobile} finePointer={finePointer} listRef={listRef} />}
      </div>
    </article>
  )
}

/* The app itself. Figures rather than plates: a plate book prints its
   photographs as numbered figures on the same stock, square to the page like
   every Work plate, so they keep the rule a collage would break. They rise in
   one after another, then drift at three depths. On a phone they become a row
   you swipe. DECISIONS D54. */
function Screens({ screens, reduced, mobile, finePointer, listRef }: { screens: Screen[]; reduced: boolean; mobile: boolean; finePointer: boolean; listRef: RefObject<HTMLDivElement> }) {
  const settled = reduced || mobile

  return (
    <div className="rest__screens" role="list" aria-label="Screens from Worn" ref={listRef}>
      {screens.map((s, i) => (
        <div key={s.src} role="listitem" className="rest__screen">
          <motion.figure
            className="rest__fig plate-sheet"
            initial={settled ? false : { y: 96, opacity: 0, scale: 0.96 }}
            animate={settled ? { y: 0, opacity: 1, scale: 1 } : undefined}
            whileInView={settled ? undefined : { y: 0, opacity: 1, scale: 1 }}
            whileHover={!reduced && !mobile && finePointer ? { y: -10 } : undefined}
            viewport={{ once: true, amount: 0.2 }}
            transition={settled
              ? { duration: 0 }
              : { type: 'spring', stiffness: 110, damping: 20, mass: 1, delay: i * 0.14 }}
          >
            <img
              src={s.src}
              srcSet={`${s.src} 480w, ${s.src2x} 960w`}
              sizes="(max-width: 900px) 62vw, 340px"
              alt={s.alt}
              width={480}
              height={969}
              loading="lazy"
              decoding="async"
            />
            <PlateCaption label={`Fig. ${i + 1}`} text={s.caption} />
          </motion.figure>
        </div>
      ))}
    </div>
  )
}
