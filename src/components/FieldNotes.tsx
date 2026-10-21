import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { swatches } from '../data'
import { useReducedMotion } from '../hooks/useReducedMotion'
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
  kind: 'print' | 'type' | 'palette' | 'detail' | 'colophon' | 'band' | 'glyph' | 'slip' | 'turntable'
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
    id: 'army',
    kind: 'detail',
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
    delay: 0.92,          // the last thing to land
    stiffness: 115,
    damping: 19,
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
 * Which also means the caption problem never comes back: once you have touched
 * the Zhangjiajie print, nothing is covering its date again.
 *
 * Implemented as an order rather than an ever-climbing counter, so the numbers
 * stay small and mean something: index in the pile. Objects never touched keep
 * the authored z-order they were composed with.
 */
function useLift() {
  const pile = useRef<HTMLElement[]>([])

  return {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      const el = e.currentTarget
      const p = pile.current
      const at = p.indexOf(el)
      // `at !== -1` matters: on an empty pile indexOf is -1 and so is
      // length - 1, so the guard fired on the very first hover and nothing was
      // ever added.
      if (at !== -1 && at === p.length - 1) return   // already on top
      if (at !== -1) p.splice(at, 1)
      p.push(el)
      p.forEach((o, i) => { o.style.zIndex = String(LIFT_BASE + i) })
    },
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
              <ObjectBody o={o} onOpen={() => (o.kind === 'print' || o.kind === 'detail' || o.kind === 'band') && setOpen(o)} />
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
 * PROTOTYPE DATA — stands in for the Spotify `currently-playing` response until
 * the function that fetches it exists. The shape is deliberately the shape the
 * real endpoint will return, including the case that happens most of the time:
 * nothing is playing, and the object falls back to the last track instead of
 * going blank. DECISIONS D48.
 */
const NOW_PLAYING = {
  playing: true,
  title: 'Harvest Moon',
  artist: 'Neil Young',
  art: '/plates/lake-terrace-800.webp',   // TODO: album art from the API
}

/**
 * The turntable. A painted object, not a rendering: flat fills, one soft sheen,
 * no 3D and no engine — the page's whole argument is that the paintings and the
 * page are the same object, and a rendered deck would be the one imported thing
 * on it. DESIGN_DIRECTION §7 rejects "WebGL with no purpose"; this is what the
 * idea looks like when it obeys that.
 *
 * The record turns at a true 33⅓ rpm and ONLY while something is playing. That
 * is the whole reason it escapes MOTION_DIRECTION §8's ban on things that never
 * settle: the rotation is a status, not decoration. When the music stops the
 * record stops and the arm returns to its rest.
 */
function Turntable() {
  const { playing, title, artist, art } = NOW_PLAYING
  return (
    <figure className="turntable" data-playing={playing || undefined}>
      <div className="turntable__deck">
        <div className="turntable__platter">
          <div className="turntable__record">
            <span className="turntable__label" style={{ backgroundImage: `url(${art})` }} />
            <span className="turntable__spindle" />
          </div>
        </div>
        <div className="turntable__arm">
          <span className="turntable__pivot" />
          <span className="turntable__wand" />
        </div>
      </div>
      <figcaption className="turntable__cap">
        <span className="turntable__status">
          {playing ? 'On the turntable' : 'Last played'}
        </span>
        <span className="turntable__title">{title}</span>
        <span className="turntable__artist">{artist}</span>
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
          Set in <em>Georgia</em>. The photographs are mine. Every
          colour on this site was lifted out of one of the paintings.
        </p>
      </div>
    )
  }

  if (o.kind === 'palette') {
    return (
      <div className="palette">
        <p className="palette__label eyebrow">Sampled from the plates</p>
        <ul className="palette__strip">
          {swatches.map((s) => (
            <li key={s.hex} style={{ background: s.hex }}>
              <span className="vh">{s.name}</span>
            </li>
          ))}
        </ul>
        <p className="caption palette__cap">Every colour on this site was lifted from a painting.</p>
      </div>
    )
  }

  return null
}
