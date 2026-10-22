import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import { articles } from '../data'
import { postHref } from '../lib/router'
import { Link } from './Link'
import { clampTravel, isPhone } from '../lib/enter'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Ridge } from './Ridge'
import './writing.css'

/**
 * Writing — Notes from the Margins.
 *
 * The stack is the site's best interaction and its behaviour is fixed:
 * a new plate FLIES onto the pile. Never a crossfade. MOTION_DIRECTION §3.5.
 *
 * Entrance direction is mapped per row, not by a parity counter, so returning to
 * a row reproduces that row's own gesture — which is what makes cycling through
 * the list feel authored rather than random.
 */

const VECTORS = [
  { x: 148, y: -74, rotate: 7.5, rest: -1.4 },   // from the upper right
  { x: -152, y: 92, rotate: -8, rest: 1.2 },     // from the lower left
  { x: 168, y: 24, rotate: 6, rest: -0.8 },      // from the right edge
  { x: -46, y: 158, rotate: -6.5, rest: 1.6 },   // from below
]

const MAX_SHEETS = 3
const EXIT_MS = 320

type Sheet = { uid: number; index: number; leaving?: boolean }

export function Writing() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  // mirrors `active` for the click handler, which must not close over a stale
  // index or the second tap on a touch device would open the wrong post
  const activeRef = useRef(0)
  activeRef.current = active
  const [sheets, setSheets] = useState<Sheet[]>([{ uid: 0, index: 0 }])
  const uid = useRef(0)
  // bumped on every arrival so the resting sheets can react to the impact
  const [impact, setImpact] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = [] }, [])

  /**
   * The pile is bounded explicitly rather than by waiting on an exit animation
   * to finish: a throttled or backgrounded tab would otherwise let sheets
   * accumulate, and z-order would start repeating. At most MAX_SHEETS live
   * sheets plus one on its way out.
   */
  const activate = useCallback((index: number) => {
    setActive((cur) => {
      if (cur === index) return cur
      uid.current += 1
      const incoming: Sheet = { uid: uid.current, index }

      setSheets((prev) => {
        const live = prev.filter((s) => !s.leaving)
        const next = [...live, incoming]
        if (next.length <= MAX_SHEETS) return next

        const oldest = next[0]
        const id = window.setTimeout(() => {
          setSheets((cur2) => cur2.filter((s) => s.uid !== oldest.uid))
        }, EXIT_MS)
        timers.current.push(id)
        return [{ ...oldest, leaving: true }, ...next.slice(1)]
      })

      setImpact((i) => i + 1)
      return index
    })
  }, [])

  /**
   * A row is a link, but its click has a second job. With a fine pointer, hover
   * has already flown the plate onto the stack and the click opens the post.
   * With a coarse one, tapping is the ONLY way to load a plate — so the first
   * tap loads and the second opens. MOTION_DIRECTION §3.5 keeps the stack on
   * mobile; this keeps the link as well.
   */
  const shouldOpen = useCallback((i: number) => {
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) return true
    if (i === activeRef.current) return true
    activate(i)
    return false
  }, [activate])

  return (
    <section className="writing" id="writing" data-tone="light">
      <Ridge />
      <div className="shell">
        <header className="writing__head">
          <p className="eyebrow eyebrow--rule">Writing</p>
          <h2 className="display-r writing__title">Notes from<br /><em>the margins.</em></h2>
          <p className="body writing__note">
            On National Service and learning to build software.
          </p>
        </header>

        <div className="writing__layout">
          <div className="stack" aria-hidden="true">
            {sheets.map((s, i) => (
              <StackSheet
                key={s.uid}
                sheet={s}
                depth={sheets.length - 1 - i}
                isTop={i === sheets.length - 1}
                impact={impact}
                reduced={reduced}
              />
            ))}
          </div>

          <ol className="articles">
            {articles.map((a, i) => (
              <li key={a.slug}>
                <Link
                  to={postHref(a.slug)}
                  className={`article ${i === active ? 'article--active' : ''}`}
                  onMouseEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                  shouldNavigate={() => shouldOpen(i)}
                >
                  <span className="article__date">{a.date}</span>
                  <span className="article__title subhead" data-title={a.title}>
                    <span>{a.title}</span>
                  </span>
                  <span className="article__standfirst">{a.standfirst}</span>
                  <span className="article__read" aria-hidden="true">Read<span className="article__arrow"> →</span></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function StackSheet({
  sheet,
  depth,
  isTop,
  impact,
  reduced,
}: {
  sheet: Sheet
  depth: number
  isTop: boolean
  impact: number
  reduced: boolean
}) {
  const a = articles[sheet.index]
  const v = VECTORS[sheet.index % VECTORS.length]
  const controls = useAnimationControls()
  const landed = useRef(false)

  // Arrival — LAY DOWN. Cancels and re-targets cleanly on rapid switching
  // because each sheet owns its own controls.
  useEffect(() => {
    if (reduced) {
      controls.set({ x: 0, y: 0, rotate: v.rest, scale: 1, opacity: 1 })
      landed.current = true
      return
    }
    const phone = isPhone()
    controls.set({
      x: phone ? clampTravel(v.x) : v.x,
      y: phone ? clampTravel(v.y) : v.y,
      rotate: v.rotate,
      scale: 0.88,
      opacity: 0,
    })
    controls
      .start({
        x: 0,
        y: 0,
        rotate: v.rest,
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 150, damping: 17, mass: 1.1 },
      })
      .then(() => { landed.current = true })
      .catch(() => { /* superseded by a newer target — expected */ })
  }, [controls, reduced, v.rest, v.rotate, v.x, v.y])

  // Impact — the sheets already on the pile nudge when a new one lands.
  const firstImpact = useRef(impact)
  useEffect(() => {
    if (reduced || isTop || !landed.current) return
    if (impact === firstImpact.current) return
    const dir = depth % 2 === 0 ? 1 : -1
    controls.start({
      x: [0, dir * 3, 0],
      y: [0, 2.5, 0],
      rotate: [v.rest, v.rest + dir * 0.4, v.rest],
      transition: { duration: 0.38, ease: [0.16, 0.84, 0.24, 1] },
    }).catch(() => {})
  }, [impact, controls, depth, isTop, reduced, v.rest])

  return (
    <motion.figure
      className={`stack__sheet plate-sheet${sheet.leaving ? ' stack__sheet--leaving' : ''}`}
      /* z from the monotonic uid, never from array position — the newest sheet
         is always on top and a departing sheet can never leapfrog it */
      style={{ zIndex: sheet.uid + 1 }}
      animate={controls}
    >
      {/* Decorative: the stack duplicates the article list, which already carries
          every title. The pile is aria-hidden, so alt text here would be
          unreachable anyway — and announcing three painting descriptions that
          repeat the list would be noise, not information. */}
      <img src={a.src} alt="" />
      <figcaption className="plate-sheet__cap caption">{a.title}</figcaption>
    </motion.figure>
  )
}
