import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { clamp } from '../lib/math'
import { arrive } from '../lib/enter'
import './fieldnotes.css'

/**
 * Field Notes — an art-directed editorial surface.
 *
 * Six objects, six genuinely different entrances, with timing authored by hand
 * rather than by index. Objects overlap intentionally and pass behind the
 * section title. MOTION_DIRECTION §3.4.
 *
 * HARD RULE: no atmospheric haze over this section. No fog, no washed overlay,
 * no blur, no cloudy transparency. DESIGN_DIRECTION §6.4.
 */

type Enter = { x?: number; y?: number; rotate?: number; scale?: number }

type Obj = {
  id: string
  kind: 'print' | 'type' | 'quote' | 'palette' | 'hand' | 'detail' | 'colophon' | 'band' | 'glyph' | 'slip'
  className: string
  depth: number            // cursor-drift multiplier
  rest: number             // resting rotation, degrees
  from: Enter
  delay: number            // hand-authored — a cluster, a gap, a late arrival
  stiffness: number
  damping: number
  src?: string
  alt?: string
  caption?: string
}

const OBJECTS: Obj[] = [
  {
    id: 'terrace',
    kind: 'print',
    className: 'obj obj--terrace',
    depth: 1,
    rest: -1.8,
    from: { x: -120, y: 70, rotate: -7.5, scale: 0.93 },
    delay: 0,
    stiffness: 130,
    damping: 17,
    src: '/plates/lake-terrace-1200.webp',
    alt: 'A painted café terrace above a lake, striped awning and geraniums.',
    caption: 'Colour, borrowed',
  },
  {
    id: 'type',
    kind: 'type',
    className: 'obj obj--type',
    depth: 1.7,
    rest: 2.6,
    from: { x: 140, y: -46, rotate: 9, scale: 0.9 },
    delay: 0.06,          // arrives almost with the first — a cluster
    stiffness: 160,
    damping: 19,
  },
  {
    id: 'quote',
    kind: 'quote',
    className: 'obj obj--quote',
    depth: 0.6,
    rest: -0.8,
    from: { x: -70, y: 120, rotate: 3.4, scale: 0.95 },
    delay: 0.34,          // then a gap
    stiffness: 110,
    damping: 20,
  },
  {
    id: 'path',
    kind: 'print',
    className: 'obj obj--path',
    depth: 2.2,
    rest: 3.2,
    from: { x: 90, y: 150, rotate: -5, scale: 0.88 },
    delay: 0.2,
    stiffness: 145,
    damping: 16,
    src: '/plates/hill-path-1200.webp',
    alt: 'A painted snowy village path with a walker in a red coat.',
    caption: 'A different cover',
  },
  {
    id: 'palette',
    kind: 'palette',
    className: 'obj obj--palette',
    depth: 2.8,
    rest: -4.2,
    from: { x: 40, y: -110, rotate: -11, scale: 0.86 },
    delay: 0.52,
    stiffness: 175,
    damping: 15,          // the loosest — it swings past furthest
  },
  {
    id: 'glyph',
    kind: 'glyph',
    className: 'obj obj--glyph',
    depth: 2.4,
    rest: -3.4,
    from: { x: 62, y: -84, rotate: 8, scale: 0.88 },
    delay: 0.14,
    stiffness: 168,
    damping: 16,
  },
  {
    id: 'band',
    kind: 'band',
    className: 'obj obj--band',
    depth: 1.5,
    rest: 1.4,
    from: { x: -110, y: 46, rotate: -4.5, scale: 0.92 },
    delay: 0.62,
    stiffness: 132,
    damping: 18,
    src: '/plates/alpine-village-1200.webp',
    alt: 'A wide crop of the alpine high street plate, taken as a panoramic band.',
    caption: 'A long look down the street',
  },
  {
    id: 'slip',
    kind: 'slip',
    className: 'obj obj--slip',
    depth: 3.1,
    rest: 4.6,
    from: { x: 34, y: 78, rotate: -9, scale: 0.9 },
    delay: 1.04,          // the very last thing to land
    stiffness: 190,
    damping: 15,
  },
  {
    id: 'detail',
    kind: 'detail',
    className: 'obj obj--detail',
    depth: 1.9,
    rest: 2.2,
    from: { x: -96, y: 60, rotate: -6, scale: 0.9 },
    delay: 0.44,
    stiffness: 138,
    damping: 17,
    src: '/plates/coastal-road-1200.webp',
    alt: 'A detail from the coast road plate: sailboats moored inside the harbour wall.',
    caption: 'Detail — the harbour',
  },
  {
    id: 'colophon',
    kind: 'colophon',
    className: 'obj obj--colophon',
    depth: 0.9,
    rest: -2.4,
    from: { x: -58, y: 104, rotate: 5.5, scale: 0.93 },
    delay: 0.92,          // the last thing to land
    stiffness: 115,
    damping: 19,
  },
  {
    id: 'hand',
    kind: 'hand',
    className: 'obj obj--hand',
    depth: 1.3,
    rest: 1.9,
    from: { x: -40, y: 96, rotate: 6, scale: 0.92 },
    delay: 0.78,          // the late arrival
    stiffness: 120,
    damping: 18,
  },
]

const SWATCHES = [
  { hex: '#0D7EE6', name: 'Zenith' },
  { hex: '#2F8CE2', name: 'Azure' },
  { hex: '#B3C0D8', name: 'Snow shadow' },
  { hex: '#F0EAE0', name: 'Snow, lit' },
  { hex: '#C79969', name: 'Ochre' },
  { hex: '#8C3F3E', name: 'Rust' },
  { hex: '#656B59', name: 'Olive' },
]

/** Extra hold past a full viewport, so the cover completes before the release. */
const ASCENT_SLACK = 40

export function FieldNotes() {
  const reduced = useReducedMotion()
  const surfaceRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const shift = useRef(0)
  const [open, setOpen] = useState<Obj | null>(null)

  /**
   * THE ASCENT — the desk stops and the Writing section climbs over it.
   *
   * Once this section's foot reaches the bottom of the viewport it is pushed
   * back down by exactly as much as the page has scrolled, so it holds still
   * while the slate rises and covers it. Held for one viewport plus a little,
   * which is the distance the Writing section needs to reach the top edge —
   * after that the hold is released, but by then it is behind a solid section
   * and nothing can be seen to snap.
   *
   * `rect.bottom` already includes the shift we applied last frame, so it is
   * subtracted back out before measuring; reading the flow position off the
   * element's own offsets instead would break the moment anything above it
   * became a positioned ancestor. DECISIONS D42.
   */
  useScrollDriver(() => {
    const el = sectionRef.current
    if (!el) return
    const flowBottom = el.getBoundingClientRect().bottom - shift.current
    const ascent = innerHeight + ASCENT_SLACK
    const next = clamp(innerHeight - flowBottom, 0, ascent)
    if (next === shift.current) return
    shift.current = next
    el.style.transform = next ? `translate3d(0, ${next.toFixed(1)}px, 0)` : ''
  }, !reduced)

  // Cursor drift — barely noticeable by design. Pointer-fine only.
  useEffect(() => {
    if (reduced) return
    const el = surfaceRef.current
    if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, active = false

    const loop = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      el.style.setProperty('--px', cx.toFixed(4))
      el.style.setProperty('--py', cy.toFixed(4))
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      active = true
      kick()
    }
    const onLeave = () => { if (active) { tx = 0; ty = 0; kick() } }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Escape closes the expanded print
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="notes-pin">
      <section className="notes" id="notes" data-tone="dark" ref={sectionRef}>
      <div className="shell notes__head">
        <p className="eyebrow eyebrow--rule">Field Notes</p>
        <h2 className="display-r notes__title">Things worth<br /><em>coming back to.</em></h2>
        <p className="body notes__note">
          A looser archive — travel, colour, type, and whatever else earns a place on the desk.
        </p>
      </div>

      <div className="notes__surface" ref={surfaceRef}>
        {OBJECTS.map((o) => (
          <div className={o.className} key={o.id} style={{ ['--depth' as string]: o.depth }}>
            <motion.div
              className="obj__inner"
              {...arrive(
                { ...o.from, opacity: 0 },
                { x: 0, y: 0, rotate: o.rest, scale: 1, opacity: 1 },
                { type: 'spring', stiffness: o.stiffness, damping: o.damping, mass: 1.05, delay: o.delay },
                reduced
              )}
              whileHover={reduced ? undefined : { rotate: 0, y: -10, transition: { type: 'spring', stiffness: 300, damping: 26 } }}
            >
              <ObjectBody o={o} onOpen={() => (o.kind === 'print' || o.kind === 'detail' || o.kind === 'band') && setOpen(o)} />
            </motion.div>
          </div>
        ))}
      </div>

      </section>

      {/* Outside `.notes`, deliberately. Pinning makes that section a stacking
          context, which would trap this fixed overlay's z-index inside it and
          let the rising Writing section paint straight over the lightbox. */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              layoutId={`print-${open.id}`}
              src={open.src}
              alt={open.alt}
              className="lightbox__img"
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
            />
            <button className="lightbox__close" onClick={() => setOpen(null)}>Close ×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ObjectBody({ o, onOpen }: { o: Obj; onOpen: () => void }) {
  if (o.kind === 'print') {
    return (
      <figure className="plate-sheet obj__print">
        <button className="obj__expand" onClick={onOpen} aria-label={`Expand: ${o.caption}`}>
          <motion.img layoutId={`print-${o.id}`} src={o.src} alt={o.alt} />
        </button>
        <figcaption className="plate-sheet__cap caption">{o.caption}</figcaption>
      </figure>
    )
  }

  if (o.kind === 'type') {
    return (
      <div className="specimen">
        <div className="specimen__aa">Aa</div>
        <div className="specimen__set">Bb Cc Dd Ee Ff</div>
        <div className="specimen__word">Rivera</div>
        <div className="specimen__meta">Georgia · display italic</div>
      </div>
    )
  }

  if (o.kind === 'quote') {
    return (
      <blockquote className="quote">
        <span className="quote__wipe" aria-hidden="true" />
        <p>“Also, linked lists are cool.”</p>
        <cite>From a demo journal note · December 2023</cite>
      </blockquote>
    )
  }

  if (o.kind === 'detail') {
    return (
      <figure className="plate-sheet obj__print obj__detail">
        <button className="obj__expand" onClick={onOpen} aria-label={`Expand: ${o.caption}`}>
          <motion.img layoutId={`print-${o.id}`} src={o.src} alt={o.alt} />
        </button>
        <figcaption className="plate-sheet__cap caption">{o.caption}</figcaption>
      </figure>
    )
  }

  if (o.kind === 'band') {
    return (
      <figure className="plate-sheet obj__print obj__band">
        <button className="obj__expand" onClick={onOpen} aria-label={`Expand: ${o.caption}`}>
          <motion.img layoutId={`print-${o.id}`} src={o.src} alt={o.alt} />
        </button>
        <figcaption className="plate-sheet__cap caption">{o.caption}</figcaption>
      </figure>
    )
  }

  if (o.kind === 'glyph') {
    return (
      <div className="glyph">
        <div className="glyph__mark">&amp;</div>
        <p className="glyph__meta">Ampersand · Georgia italic</p>
      </div>
    )
  }

  if (o.kind === 'slip') {
    return (
      <div className="slip">
        <p>Kept because the blue was right.</p>
      </div>
    )
  }

  if (o.kind === 'colophon') {
    return (
      <div className="colophon">
        <p className="colophon__label eyebrow">Colophon</p>
        <p className="colophon__text">
          Set in <em>Georgia</em>. The plates are painted, not photographed — every colour
          on this site was lifted out of one of them.
        </p>
      </div>
    )
  }

  if (o.kind === 'palette') {
    return (
      <div className="palette">
        <p className="palette__label eyebrow">Sampled from the plates</p>
        <ul className="palette__strip">
          {SWATCHES.map((s) => (
            <li key={s.hex} style={{ background: s.hex }}>
              <span className="vh">{s.name}</span>
            </li>
          ))}
        </ul>
        <p className="caption palette__cap">Every colour on this site was lifted from a painting.</p>
      </div>
    )
  }

  return (
    <div className="hand">
      <div className="hand__box">Something<br />made by hand</div>
      <p className="caption">Demo placeholder — an original painting belongs here.</p>
    </div>
  )
}
