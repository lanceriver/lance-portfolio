import { useEffect, useRef } from 'react'
import './atmosphere.css'

/**
 * The Hero's atmosphere: snowfall is paused for Zhangjiajie; the bird flock stays active.
 *
 * Both run off a single requestAnimationFrame loop, which is the only rAF on the
 * page (MOTION_DIRECTION §5). It pauses when the Hero leaves the viewport and
 * when the tab is hidden.
 *
 * Nothing here touches the painting. DECISIONS D5.
 */

/** Loose, roughly stable offsets. Not a flocking simulation — a drawn formation. */
const FORMATION = [
  { x: 0, y: 0, s: 0.96 },
  { x: -44, y: 18, s: 0.88 },
  { x: -88, y: -14, s: 0.8 },
  { x: -132, y: 30, s: 0.84 },
  { x: -176, y: -26, s: 0.72 },
  { x: -218, y: 10, s: 0.76 },
  { x: -262, y: -4, s: 0.68 },
]

type Bird = {
  el: HTMLDivElement
  left: SVGGElement
  right: SVGGElement
  ox: number
  oy: number
  scale: number
  phase: number
  flap: number
}

export function Atmosphere({ reduced }: { reduced: boolean }) {
  const snowRef = useRef<HTMLDivElement>(null)
  const birdsRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    const snowRoot = snowRef.current
    const birdRoot = birdsRef.current
    const host = hostRef.current
    if (!snowRoot || !birdRoot || !host) return

    let w = innerWidth
    let h = innerHeight

    // TODO: re-enable when the hero has a mist treatment designed for Zhangjiajie (snow is wrong for this plate)
    /*
    const FLAKES = 70
    type Flake = { el: HTMLSpanElement; x: number; y: number; vy: number; drift: number; phase: number; size: number }
    const flakes: Flake[] = []
    for (let i = 0; i < FLAKES; i++) {
      const el = document.createElement('span')
      el.className = 'flake'
      const size = 1.4 + Math.random() * 3.2
      el.style.width = el.style.height = `${size}px`
      snowRoot.appendChild(el)
      flakes.push({
        el,
        x: Math.random() * w,
        y: Math.random() * h,          // the field is already full on load
        vy: 26 + (size / 4.6) * 64,    // bigger flakes read as nearer, so they fall faster
        drift: (Math.random() - 0.5) * 26,
        phase: Math.random() * Math.PI * 2,
        size,
      })
    }
    */

    // ── the flock ──────────────────────────────────────────
    const birds: Bird[] = FORMATION.map((pos) => {
      const el = document.createElement('div')
      el.className = 'bird'
      el.innerHTML = `
        <svg viewBox="0 0 80 40" aria-hidden="true">
          <g class="wing wing--l"><path d="M40 22 C31 16, 22 13, 11 14" /></g>
          <g class="wing wing--r"><path d="M40 22 C49 16, 58 13, 69 14" /></g>
          <path class="tail" d="M40 22 C40 25, 40 27, 41 30" />
        </svg>`
      birdRoot.appendChild(el)
      return {
        el,
        left: el.querySelector('.wing--l') as SVGGElement,
        right: el.querySelector('.wing--r') as SVGGElement,
        ox: pos.x,
        oy: pos.y,
        scale: pos.s,
        phase: Math.random() * Math.PI * 2,
        flap: 4.8 + Math.random() * 1.3,   // slightly different speed per bird
      }
    })

    const flockSpan = 300
    let flockX = -flockSpan
    const speed = 62                        // px/s — straight, constant, no gliding

    let raf = 0
    let last = performance.now()
    let visible = true

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // TODO: re-enable when the hero has a mist treatment designed for Zhangjiajie (snow is wrong for this plate)
      /*
      for (const f of flakes) {
        f.y += f.vy * dt
        f.phase += dt * 0.6
        const x = f.x + Math.sin(f.phase) * f.drift
        if (f.y > h + 12) {
          f.y = -12
          f.x = Math.random() * w
        }
        f.el.style.transform = `translate3d(${x}px, ${f.y}px, 0)`
      }
      */

      flockX += speed * dt
      // reset only once the entire flock has left the viewport
      if (flockX + FORMATION[FORMATION.length - 1].x > w + 60) flockX = -flockSpan
      const baseY = Math.max(54, Math.min(h * 0.105, 112))

      for (const b of birds) {
        const wing = -10 + Math.sin(now / 1000 * b.flap + b.phase) * 12
        b.left.style.transform = `rotate(${wing}deg)`
        b.right.style.transform = `rotate(${-wing}deg)`
        b.el.style.transform = `translate3d(${flockX + b.ox}px, ${baseY + b.oy}px, 0) scale(${b.scale})`
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf || !visible) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    io.observe(host)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    const onResize = () => { w = innerWidth; h = innerHeight }
    addEventListener('resize', onResize)

    start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      removeEventListener('resize', onResize)
      snowRoot.replaceChildren()
      birdRoot.replaceChildren()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={hostRef} className="atmosphere" aria-hidden="true">
      {/* TODO: re-enable when the hero has a mist treatment designed for Zhangjiajie (snow is wrong for this plate) */}
      <div ref={snowRef} className="snow" />
      <div ref={birdsRef} className="birds" />
    </div>
  )
}
