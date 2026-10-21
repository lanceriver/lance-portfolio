import { useRef, useState } from 'react'
import { navLinks } from '../data'
import { useScrollDriver } from '../hooks/useScrollDriver'
import './nav.css'

type Tone = 'light' | 'dark'
export type IndexMode = 'plates' | 'contents'

/** Scrolled this far past the top before the nav may tuck away on a phone. */
const TUCK_AFTER = 120
/** Ignore scroll jitter smaller than this when deciding direction. */
const TUCK_SLOP = 6

/**
 * Minimal navigation on a hairline. Never a floating pill, never a container.
 * `tone` describes the ink, not the ground: 'light' = cream ink over a painting
 * or the slate section; 'dark' = ink over the snow page.
 *
 * On a phone five words do not fit beside `LR`, so the links give way to a
 * menu mark that opens the book's contents page — the List of Plates with the
 * chapters and the back cover beneath it. The mark is two hairlines, the same
 * rule the eyebrows draw, the lower one shorter and hung right: a hamburger
 * a reader recognises, drawn in the site's own line. The nav also tucks away
 * while the reader scrolls down and returns the moment they scroll up, so its
 * ink never sits on top of the type it would otherwise collide with — and it
 * does that without a scrim or a ground.
 */
export function Nav({ onOpenIndex }: { onOpenIndex: (mode: IndexMode) => void }) {
  const [tone, setTone] = useState<Tone>('light')
  // The hairline is an editorial rule on paper. Over a painting it is just a
  // line drawn across the artwork, so sections carrying a plate opt out.
  const [rule, setRule] = useState(false)
  const [tucked, setTucked] = useState(false)
  const lastY = useRef(0)
  const ref = useRef<HTMLElement>(null)

  useScrollDriver(() => {
    // The nav takes its tone from whatever section sits under it right now —
    // sampled at the height the INK actually sits at, not at the top edge.
    // Probing at y=8 flipped the tone about 50px of scroll after the new
    // section had already arrived behind the type, which put dark ink on a dark
    // ground at every join on the page. Worst at the ridge, where the slate
    // reaches the links first. DECISIONS D41.
    // Measured from the nav's resting place, not its live box: while tucked the
    // box is above the viewport, and the tone must already be right when it
    // slides back in.
    const h = ref.current?.offsetHeight
    const y = h ? h * 0.58 : 8
    const probe = (document.elementsFromPoint(innerWidth / 2, y) as HTMLElement[])
      .find((el) => el.dataset && el.dataset.tone)
    const next = (probe?.dataset.tone as Tone) ?? 'light'
    const nextRule = probe?.dataset.rule !== 'off'
    setTone((cur) => (cur === next ? cur : next))
    setRule((cur) => (cur === nextRule ? cur : nextRule))

    // Direction, not position: down tucks, up returns. Only a phone acts on
    // it (nav.css); the class is harmless everywhere else.
    const delta = scrollY - lastY.current
    if (Math.abs(delta) < TUCK_SLOP) return
    lastY.current = scrollY
    const nextTucked = delta > 0 && scrollY > TUCK_AFTER
    setTucked((cur) => (cur === nextTucked ? cur : nextTucked))
  })

  return (
    <nav
      className={`nav nav--${tone}${rule ? '' : ' nav--norule'}${tucked ? ' nav--tucked' : ''}`}
      ref={ref}
    >
      <div className="nav__inner">
        <a className="nav__brand" href="#top" aria-label="Lance Rivera — back to top">LR</a>
        <ul className="nav__links">
          {navLinks.map((l) =>
            l.label === 'Work' ? (
              /* Work opens the List of Plates — the index is more use here than
                 a jump to a section heading. */
              <li key={l.label}>
                <button onClick={() => onOpenIndex('plates')} aria-haspopup="dialog">{l.label}</button>
              </li>
            ) : (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            )
          )}
        </ul>
        <button className="nav__menu" onClick={() => onOpenIndex('contents')} aria-haspopup="dialog" aria-label="Menu">
          <span className="nav__burger" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
