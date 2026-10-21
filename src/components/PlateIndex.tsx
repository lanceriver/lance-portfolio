import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { projects } from '../data'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './plateindex.css'

/**
 * The List of Plates, summoned rather than scrolled past.
 *
 * It began as an inline section between the Hero and Work, which cost about a
 * screen and a half before a reader saw a single project. As an overlay it does
 * the same job — the plate book's contents page — but costs nothing, and it
 * gains the thing an inline list never had: you can jump straight to a plate.
 * DECISIONS D34.
 */
export function PlateIndex({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement as HTMLElement

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      // keep focus inside while it is open
      const items = panelRef.current?.querySelectorAll<HTMLElement>('button, [href]')
      if (!items || !items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()

    return () => {
      removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      restoreTo.current?.focus?.()
    }
  }, [open, onClose])

  const go = (id: string) => {
    const target = document.getElementById(id)
    // Release the scroll lock before moving, and defer with a timeout rather
    // than requestAnimationFrame: rAF is throttled to a standstill in a
    // backgrounded or hidden tab, which would strand the reader on a closing
    // overlay that never went anywhere.
    document.body.style.overflow = ''
    onClose()
    setTimeout(() => {
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="plateindex"
          role="dialog"
          aria-modal="true"
          aria-label="List of plates"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 0.84, 0.24, 1] }}
        >
          <div className="plateindex__panel shell" ref={panelRef}>
            <header className="plateindex__head">
              <p className="eyebrow eyebrow--rule">List of Plates</p>
              <button className="plateindex__close" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
            </header>

            <ol className="plateindex__list">
              {projects.map((p, i) => (
                <li key={p.numeral}>
                  <motion.button
                    className="plateindex__row"
                    onClick={() => go(`plate-${p.numeral.toLowerCase()}`)}
                    initial={reduced ? false : { opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: reduced ? 0 : 0.06 + i * 0.055, ease: [0.16, 0.84, 0.24, 1] }}
                  >
                    <span className="plateindex__num numeral">{p.numeral}</span>
                    <span className="plateindex__name">{p.name}</span>
                    <span className="plateindex__tag">{p.tagline}</span>
                    <span className="plateindex__disc">{p.discipline}</span>
                  </motion.button>
                </li>
              ))}
            </ol>

            <p className="plateindex__foot caption">
              Three plates. Pick one, or keep scrolling.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
