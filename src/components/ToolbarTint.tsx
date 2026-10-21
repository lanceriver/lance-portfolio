import { useRef } from 'react'
import { useScrollDriver } from '../hooks/useScrollDriver'
import './toolbartint.css'

/**
 * Safari 26 on iOS ignores `theme-color`. It tints its toolbars from fixed or
 * sticky elements touching the top and bottom edges (near-full width, at least
 * 3px tall), and failing that from the body. The hero and the back cover are
 * full-width sticky scenes with solid blue grounds, so Safari took their blue
 * and kept it down the whole cream page.
 *
 * Two hairline strips, one at each edge, give it the right answer instead:
 * each takes the ground of whatever sits under it, read from `data-tint`,
 * `data-tint-top` or `data-tint-bottom` on the nearest section (a token name),
 * falling back to the page ground. Only iOS gets them (toolbartint.css); under
 * the toolbar they read as the bar itself. DECISIONS D55.
 */
const IOS =
  typeof CSS !== 'undefined' && CSS.supports('-webkit-touch-callout', 'none')

function tintAt(y: number, edge: 'tintTop' | 'tintBottom') {
  for (const el of document.elementsFromPoint(innerWidth / 2, y) as HTMLElement[]) {
    const v = el.dataset?.[edge] ?? el.dataset?.tint
    if (v) return v
  }
  return 'page-ground'
}

export function ToolbarTint() {
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const last = useRef('')

  useScrollDriver(() => {
    const t = tintAt(1, 'tintTop')
    const b = tintAt(innerHeight - 1, 'tintBottom')
    if (t + b === last.current) return
    last.current = t + b
    return () => {
      if (top.current) top.current.style.backgroundColor = `var(--${t})`
      if (bottom.current) bottom.current.style.backgroundColor = `var(--${b})`
    }
  }, IOS)

  if (!IOS) return null
  return (
    <>
      <div className="tint tint--top" ref={top} aria-hidden="true" />
      <div className="tint tint--bottom" ref={bottom} aria-hidden="true" />
    </>
  )
}
