import { useEffect, useRef } from 'react'

/**
 * One scroll loop for the whole page.
 *
 * Every scroll-linked section registers a callback here rather than adding its
 * own listener, and callbacks run at most once per frame. MOTION_DIRECTION §5.
 *
 * READS AND WRITES ARE SEPARATED, and this is the whole point rather than a
 * tidiness preference. A callback measures, then returns a closure that draws.
 * All the measuring happens first, then all the drawing.
 *
 * The previous version claimed to batch them and did not: eight callbacks each
 * measured and then drew, in sequence, so every draw invalidated layout for the
 * next measurement and the browser was forced to lay the page out again — up to
 * eight synchronous reflows per frame. With the heaviest read of the lot
 * (`elementsFromPoint`, in the nav) running fifth, after four writes, the cost
 * landed hardest exactly where the page is busiest. It scrolled in jerks.
 *
 * A callback that returns nothing still works and simply draws during the read
 * phase; that is correct for anything which only touches React state.
 */
type Writer = () => void
type Driver = () => Writer | void

const drivers = new Set<Driver>()
let frame = 0

function run() {
  frame = 0
  const writes: Writer[] = []
  for (const d of drivers) {
    const w = d()
    if (w) writes.push(w)
  }
  for (const w of writes) w()
}

function schedule() {
  if (frame) return
  frame = requestAnimationFrame(run)
}

let bound = false
function bind() {
  if (bound) return
  bound = true
  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule)
}

function unbindIfIdle() {
  if (drivers.size || !bound) return
  bound = false
  removeEventListener('scroll', schedule)
  removeEventListener('resize', schedule)
  if (frame) { cancelAnimationFrame(frame); frame = 0 }
}

export function useScrollDriver(fn: Driver, enabled = true) {
  const ref = useRef(fn)
  ref.current = fn

  useEffect(() => {
    if (!enabled) return
    const driver: Driver = () => ref.current()
    drivers.add(driver)
    bind()
    schedule()
    return () => {
      drivers.delete(driver)
      unbindIfIdle()
    }
  }, [enabled])
}

/** Nudge every driver — for use after fonts load or layout otherwise shifts. */
export const refreshScrollDrivers = schedule
