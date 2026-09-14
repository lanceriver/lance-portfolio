import { useRef, useState } from 'react'
import { navLinks } from '../data'
import { useScrollDriver } from '../hooks/useScrollDriver'
import './nav.css'

type Tone = 'light' | 'dark'

/**
 * Minimal navigation on a hairline. Never a floating pill, never a container.
 * `tone` describes the ink, not the ground: 'light' = cream ink over a painting
 * or the slate section; 'dark' = ink over the snow page.
 */
export function Nav({ onOpenIndex }: { onOpenIndex: () => void }) {
  const [tone, setTone] = useState<Tone>('light')
  // The hairline is an editorial rule on paper. Over a painting it is just a
  // line drawn across the artwork, so sections carrying a plate opt out.
  const [rule, setRule] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useScrollDriver(() => {
    // The nav takes its tone from whatever section sits under it right now —
    // sampled at the height the INK actually sits at, not at the top edge.
    // Probing at y=8 flipped the tone about 50px of scroll after the new
    // section had already arrived behind the type, which put dark ink on a dark
    // ground at every join on the page. Worst at the ridge, where the slate
    // reaches the links first. DECISIONS D41.
    const row = ref.current?.getBoundingClientRect()
    const y = row ? row.top + row.height * 0.58 : 8
    const probe = (document.elementsFromPoint(innerWidth / 2, y) as HTMLElement[])
      .find((el) => el.dataset && el.dataset.tone)
    const next = (probe?.dataset.tone as Tone) ?? 'light'
    const nextRule = probe?.dataset.rule !== 'off'
    setTone((cur) => (cur === next ? cur : next))
    setRule((cur) => (cur === nextRule ? cur : nextRule))
  })

  return (
    <nav className={`nav nav--${tone}${rule ? '' : ' nav--norule'}`} ref={ref}>
      <div className="nav__inner">
        <a className="nav__brand" href="#top" aria-label="Lance Rivera — back to top">LR</a>
        <ul className="nav__links">
          {navLinks.map((l) =>
            l.label === 'Work' ? (
              /* Work opens the List of Plates — the index is more use here than
                 a jump to a section heading. */
              <li key={l.label}>
                <button onClick={onOpenIndex} aria-haspopup="dialog">{l.label}</button>
              </li>
            ) : (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            )
          )}
        </ul>
      </div>
    </nav>
  )
}
