import { useEffect, useRef } from 'react'

/**
 * One scroll loop for the whole page.
 *
 * Every scroll-linked section registers a callback here rather than adding its
 * own listener. Callbacks run at most once per frame, and they run in
 * registration order so reads and writes stay batched together instead of
 * interleaving into layout thrash. MOTION_DIRECTION §5.
 */
type Driver = () => void

const drivers = new Set<Driver>()
let frame = 0

function run() {
  frame = 0
  for (const d of drivers) d()
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
