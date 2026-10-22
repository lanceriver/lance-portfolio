import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useNowPlaying } from '../hooks/useNowPlaying'
import { arrive, clampTravel, isPhone } from '../lib/enter'
import './fieldnotes.css'

/**
 * Field Notes — an art-directed editorial surface.
 *
 * Desk objects use distinct entrances, with timing authored by hand rather
 * than by index. Objects overlap intentionally and pass behind the
 * section title. MOTION_DIRECTION §3.4.
 *
 * HARD RULE: no atmospheric haze over this section. No fog, no washed overlay,
 * no blur, no cloudy transparency. DESIGN_DIRECTION §6.4.
 */

type Enter = { x?: number; y?: number; rotate?: number; scale?: number }

type Obj = {
  id: string
  kind: 'print' | 'colophon' | 'turntable'
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
    src: '/plates/zhangjiajie-1200.webp',
    alt: 'Sandstone pillars in mist at Zhangjiajie, seen from a viewing platform.',
    caption: 'Zhangjiajie · May 2026',
  },
  {
    id: 'night',
    kind: 'print',
    className: 'obj obj--night',
    depth: 2.2,
    rest: 3.2,
    from: { x: 90, y: 150, rotate: -5, scale: 0.88 },
    delay: 0.2,
    stiffness: 145,
    damping: 16,
    src: '/plates/furong-1200.webp',
    alt: 'Furong Ancient Town after dark: tiers of stilt houses lit above the floodlit waterfall it is built over.',
    caption: 'Furong Ancient Town · May 2026',
  },
  {
    id: 'mountain-road',
    kind: 'print',
    className: 'obj obj--mountain-road',
    depth: 2.6,
    rest: -2.7,
    from: { x: -86, y: 104, rotate: 7, scale: 0.9 },
    delay: 0.7,
    stiffness: 150,
    damping: 17,
    src: '/plates/mountain-road-1200.webp',
    alt: 'A winding road disappearing into mist between steep mountain peaks.',
    caption: 'Mountain road · May 2026',
  },
  {
    id: 'coastal-train',
    kind: 'print',
    className: 'obj obj--coastal-train',
    depth: 2.1,
    rest: 2.1,
    from: { x: 112, y: 94, rotate: -6, scale: 0.91 },
    delay: 0.82,
    stiffness: 142,
    damping: 18,
    src: '/plates/coastal-train-1200.webp',
    alt: 'A green train passing through a lush coastal landscape.',
    caption: 'Coastal train · September 2025',
  },
  {
    id: 'torii-corridor',
    kind: 'print',
    className: 'obj obj--torii',
    depth: 1.8,
    rest: -1.6,
    from: { x: -104, y: 70, rotate: -7, scale: 0.92 },
    delay: 0.9,
    stiffness: 156,
    damping: 17,
    src: '/plates/torii-corridor-1200.webp',
    alt: 'A symmetrical corridor of red torii gates receding into the distance.',
    caption: 'Torii corridor · February 2024',
  },
  {
    id: 'bamboo-canopy',
    kind: 'print',
    className: 'obj obj--bamboo',
    depth: 2.9,
    rest: 2.8,
    from: { x: 78, y: 116, rotate: 8, scale: 0.89 },
    delay: 1.12,
    stiffness: 166,
    damping: 16,
    src: '/plates/bamboo-canopy-1200.webp',
    alt: 'Looking up through a dense canopy of bamboo.',
    caption: 'Bamboo canopy · February 2024',
  },
  {
    id: 'army',
    kind: 'print',
    className: 'obj obj--army',
    depth: 1.9,
    rest: 2.2,
    from: { x: -96, y: 60, rotate: -6, scale: 0.9 },
    delay: 0.44,
    stiffness: 138,
    damping: 17,
    src: '/plates/terracotta-army-1200.webp',
    alt: 'Ranks of the Terracotta Army in their excavated pit, every face different.',
    caption: "Xi'an · May 2026",
  },
  {
    id: 'colophon',
    kind: 'colophon',
    className: 'obj obj--colophon',
    depth: 0.9,
    rest: -2.4,
    from: { x: -58, y: 104, rotate: 5.5, scale: 0.93 },
    delay: 0.92,
    stiffness: 115,
    damping: 19,
  },
  {
    id: 'turntable',
    kind: 'turntable',
    className: 'obj obj--turntable',
    depth: 1.4,
    rest: 1.4,
    from: { x: 96, y: 54, rotate: 6.5, scale: 0.9 },
    delay: 0.5,
    stiffness: 140,
    damping: 18,
  },
]

/** Where the pile starts, above every authored z-index on the desk. */
const LIFT_BASE = 40

/**
 * The desk keeps the order you left it in.
 *
 * Not "the hovered object is on top" — that is a spotlight, and it snaps back
 * the moment you look away. This is a pile of photographs on a table: the one
 * you last picked up is lying on top of the others, and it stays there after
 * you have put it down. The object lies flat again — the lift and the
 * straighten both revert — but its place in the stack is now earned.
 *
 * A photograph can be picked up without changing the arrangement permanently:
 * the latest one stays at the top after the pointer moves away.
 *
 * Implemented as an order rather than an ever-climbing counter, so the numbers
 * stay small and mean something: index in the pile. Objects never touched keep
 * the authored z-order they were composed with.
 */
function useLift() {
  const pile = useRef<HTMLElement[]>([])
  const raise = (el: HTMLElement) => {
    const p = pile.current
    const at = p.indexOf(el)
    if (at !== -1 && at === p.length - 1) return
    if (at !== -1) p.splice(at, 1)
    p.push(el)
    p.forEach((o, i) => { o.style.zIndex = String(LIFT_BASE + i) })
  }

  return {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => raise(e.currentTarget),
    onFocus: (e: React.FocusEvent<HTMLElement>) => raise(e.currentTarget),
  }
}

export function FieldNotes() {
  const reduced = useReducedMotion()
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Obj | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const lift = useLift()
  const [phone] = useState(isPhone)

  /**
   * The pin has to be a NEGATIVE `top`, not `bottom: 0`.
   *
   * `bottom: 0` is the obvious way to say "hold when the foot reaches the
   * floor", and it silently does nothing here: a sticky box taller than the
   * viewport is never shifted by a bottom inset. This section is ~1900px
   * against a ~780px viewport. It computed as `position: sticky`, it had its
   * travel, every geometry check passed — and it simply scrolled away, which is
   * exactly how it reached Lance.
   *
   * `top: viewportHeight - ownHeight` says the same thing in the form the
   * engine acts on: stick once the top would rise past that line, which is the
   * moment the foot would rise past the floor.
   *
   * That needs the height, so it is measured rather than declared — but only on
   * mount and on resize. Nothing here is coupled to scroll, which is the whole
   * point: the compositor keeps doing the holding. DECISIONS D50.
   */
  useEffect(() => {
    const el = sectionRef.current
    if (!el || reduced) return
    const place = () => { el.style.top = `${innerHeight - el.offsetHeight}px` }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    addEventListener('resize', place)
    return () => {
      ro.disconnect()
      removeEventListener('resize', place)
      el.style.top = ''
    }
  }, [reduced])

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
          <div className={o.className} key={o.id} style={{ ['--depth' as string]: o.depth }} {...lift}>
            <motion.div
              className="obj__inner"
              {...arrive(
                phone
                  ? { ...o.from, x: clampTravel(o.from.x), y: clampTravel(o.from.y), opacity: 0 }
                  : { ...o.from, opacity: 0 },
                { x: 0, y: 0, rotate: o.rest, scale: 1, opacity: 1 },
                { type: 'spring', stiffness: o.stiffness, damping: o.damping, mass: 1.05, delay: o.delay },
                reduced
              )}
              whileHover={reduced ? undefined : { rotate: 0, y: -14, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 26 } }}
            >
              <ObjectBody o={o} onOpen={() => o.kind === 'print' && setOpen(o)} />
            </motion.div>
          </div>
        ))}
      </div>

      </section>

      {/* The ascent. An empty block, and the only thing holding the desk still:
          a sticky box can travel no further than its containing block, so this
          spacer's height IS the length of the hold. Writing pulls itself back
          up by the same amount, so nothing in the layout moves and the document
          does not grow. DECISIONS D50. */}
      <div className="notes-pin__ascent" aria-hidden="true" />

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

/**
 * The turntable is a flat drawing in the same printed language as the desk,
 * with one soft sheen and no 3D rendering.
 *
 * The record turns at a true 33⅓ rpm and ONLY while something is playing. That
 * is the whole reason it escapes MOTION_DIRECTION §8's ban on things that never
 * settle: the rotation is a status, not decoration. When the music stops the
 * record stops and the arm returns to its rest.
 */
function Turntable() {
  const turntableRef = useRef<HTMLElement>(null)
  const { playing, title, artist, url, available } = useNowPlaying(turntableRef)
  const hasTrack = Boolean(title && artist)
  const status = playing
    ? 'On the turntable'
    : !available
      ? 'Listening status unavailable'
      : hasTrack
        ? 'Last played'
        : 'Between records'

  return (
    <figure className="turntable" ref={turntableRef} data-playing={playing || undefined}>
      <div className="turntable__deck">
        <div className="turntable__platter">
          <div className="turntable__record">
            <span className="turntable__label" aria-hidden="true" />
            <span className="turntable__spindle" />
          </div>
        </div>
        <div className="turntable__arm">
          <span className="turntable__pivot" />
          <span className="turntable__wand" />
        </div>
      </div>
      <figcaption className="turntable__cap">
        <span className="turntable__status" aria-live="polite">{status}</span>
        {hasTrack && (
          <>
            {url
              ? <a className="turntable__title" href={url} target="_blank" rel="noreferrer" aria-label={`${title} by ${artist} on Spotify`}>{title}</a>
              : <span className="turntable__title">{title}</span>}
            <span className="turntable__artist">{artist}</span>
          </>
        )}
        <a className="turntable__spotify" href="https://open.spotify.com" target="_blank" rel="noreferrer" aria-label="Spotify">
          <img src="/spotify-logo.svg" alt="Spotify" />
        </a>
      </figcaption>
    </figure>
  )
}

function ObjectBody({ o, onOpen }: { o: Obj; onOpen: () => void }) {
  if (o.kind === 'turntable') return <Turntable />

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

  if (o.kind === 'colophon') {
    return (
      <div className="colophon">
        <p className="colophon__label eyebrow">Colophon</p>
        <p className="colophon__text">
          Set in <em>Georgia</em>. The photographs are mine. Every
          colour on this site was lifted out of one of the paintings.
        </p>
      </div>
    )
  }

  return null
}
