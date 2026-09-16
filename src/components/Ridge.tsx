import { useRef } from 'react'
import { useScrollDriver } from '../hooks/useScrollDriver'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { clamp } from '../lib/math'
import './ridge.css'

/**
 * The ridge — the join between Field Notes and Writing.
 *
 * Every other colour change on this page is either a painting dissolving into
 * the page or the page warming by a few degrees. This one is a genuine cut:
 * snow-lit cream meets slate-deep with nothing in between. So the edge stops
 * being an edge and becomes a landform — the range returns as a flat graphic,
 * a screen-printed reduction of the painted one the page opened on.
 *
 * Three rules govern the shape:
 *
 *  1. FACETS, NOT WAVES. Straight segments and a few hard breaks in slope. A
 *     soft organic wobble here would read as a torn paper edge, which is an
 *     anti-pattern (DESIGN_DIRECTION §7, Metaphor).
 *  2. LOW GROUND UNDER THE NAV'S INK. The nav is fixed, and it takes its tone
 *     from the section BOX beneath it — which means it holds dark ink for the
 *     whole crossing, until the flat slate base finally reaches it. Any summit
 *     standing under `LR` or the links therefore puts dark ink on dark slate.
 *     The relief is confined to x 120–1000: outside that the range runs down
 *     almost to the base, leaving ~13px of slate under the type instead of
 *     110px. Measured, the illegible window shrinks from ~127px of scroll to
 *     ~32px. It is the same geography as the Hero anyway — a flat valley floor
 *     with the mountains rising off to one side.
 *  3. ASYMMETRY. A dominant peak with a lower twin beside it, mass gathered
 *     left of centre, running out to a plain. Never a repeating wave.
 *
 * The only thing that moves is the light. The landform is still — a mountain
 * that drifts is a mountain nobody believes — but a band of snow-lit crest
 * travels the ridge as the join crosses the viewport, which is the same logic
 * as the page's ground warming (D3): on this site, light is what moves.
 */

/**
 * Ridgeline, left to right, on a 1440 × 200 field; the base closes at y=200.
 *
 * A sharp peak with a steep face, a lower twin beside it, then a shoulder and a
 * long descent onto the valley floor. Every summit is a different shape —
 * a range of interchangeable triangles reads as a graphic, not as ground.
 */
const RIDGE =
  'M0 184 L104 180 L168 138 L228 104 L286 128 L398 22 L472 74 L548 54 ' +
  'L622 100 L706 80 L790 126 L872 150 L956 172 L1048 182 L1180 186 ' +
  'L1300 181 L1440 187'

const MASS = `${RIDGE} L1440 201 L0 201 Z`

/** Width of the travelling highlight, in viewBox units. */
const BAND = 560
/** Where the highlight rests when motion is reduced — across the main peak. */
const PARKED = 120

export function Ridge() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const grad = useRef<SVGLinearGradientElement>(null)

  useScrollDriver(() => {
    const el = ref.current
    const g = grad.current
    if (!el || !g) return
    // 0 when the slate base is at the bottom of the viewport, 1 when it reaches
    // the top: the light crosses the ridge exactly once per pass.
    const p = clamp(1 - el.getBoundingClientRect().bottom / innerHeight)
    const x1 = -BAND + p * (1440 + BAND)
    return () => {
      g.setAttribute('x1', String(x1.toFixed(1)))
      g.setAttribute('x2', String((x1 + BAND).toFixed(1)))
    }
  }, !reduced)

  return (
    <div className="ridge" ref={ref} aria-hidden="true">
      <svg className="ridge__svg" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <defs>
          <linearGradient
            id="ridge-light"
            ref={grad}
            gradientUnits="userSpaceOnUse"
            x1={reduced ? PARKED : -BAND}
            y1="0"
            x2={reduced ? PARKED + BAND : 0}
            y2="0"
          >
            <stop offset="0" stopColor="var(--paper)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--paper)" stopOpacity="0.92" />
            <stop offset="1" stopColor="var(--paper)" stopOpacity="0" />
          </linearGradient>
          {/* The crest is stroked and then clipped to the mass, so only the
              inside half survives: snow sitting on the ridge, not an outline
              drawn around a shape. */}
          <clipPath id="ridge-clip">
            <path d={MASS} />
          </clipPath>
        </defs>

        <path className="ridge__mass" d={MASS} />
        <g clipPath="url(#ridge-clip)">
          <path className="ridge__crest" d={RIDGE} />
        </g>
      </svg>
    </div>
  )
}
