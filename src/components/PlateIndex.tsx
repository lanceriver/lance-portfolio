import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { contactLinks, email, navLinks, projects } from '../data'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { refreshScrollDrivers } from '../hooks/useScrollDriver'
import { ContactLink } from './Link'
import type { IndexMode } from './Nav'
import './plateindex.css'

/** The chapters after the plates — every nav destination but Work itself. */
const chapters = navLinks.filter((l) => l.label !== 'Work')

/**
 * The List of Plates, summoned rather than scrolled past.
 *
 * It began as an inline section between the Hero and Work, which cost about a
 * screen and a half before a reader saw a single project. As an overlay it does
 * the same job — the plate book's contents page — but costs nothing, and it
 * gains the thing an inline list never had: you can jump straight to a plate.
 * DECISIONS D34.
 *
 * In `contents` mode — the phone's only navigation — the same page carries the
 * rest of the book beneath the plates: the chapters, then the back cover's
 * address and links. A contents page, not a drawer; the phone's menu is the
 * book's own front matter. DECISIONS D53.
 */
export function PlateIndex({ open, onClose }: { open: IndexMode | null; onClose: () => void }) {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)
  const contents = open === 'contents'

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
    // Opening and closing do not scroll, so nudge the toolbar tint (D55) —
    // on close, once the fade-out has taken the page off the screen.
    refreshScrollDrivers()

    return () => {
      removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      restoreTo.current?.focus?.()
      setTimeout(refreshScrollDrivers, 340)
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

  const rowIn = (i: number) => ({
    initial: reduced ? false as const : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduced ? 0 : 0.06 + i * 0.055, ease: [0.16, 0.84, 0.24, 1] },
  })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`plateindex${contents ? ' plateindex--contents' : ''}`}
          data-tint="snow-lit"
          role="dialog"
          aria-modal="true"
          aria-label={contents ? 'Contents' : 'List of plates'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 0.84, 0.24, 1] }}
        >
          <div className="plateindex__panel shell" ref={panelRef}>
            <header className="plateindex__head">
              <p className="eyebrow eyebrow--rule">{contents ? 'Contents' : 'List of Plates'}</p>
              <button className="plateindex__close" onClick={onClose}>Close <span aria-hidden="true">×</span></button>
            </header>

            {contents && <p className="plateindex__group eyebrow">Plates</p>}
            <ol className="plateindex__list">
              {projects.map((p, i) => (
                <li key={p.numeral}>
                  <motion.button
                    className="plateindex__row"
                    onClick={() => go(`plate-${p.numeral.toLowerCase()}`)}
                    {...rowIn(i)}
                  >
                    <span className="plateindex__num numeral">{p.numeral}</span>
                    <span className="plateindex__name">{p.name}</span>
                    <span className="plateindex__tag">{p.tagline}</span>
                    <span className="plateindex__disc">{p.discipline}</span>
                  </motion.button>
                </li>
              ))}
            </ol>

            {contents ? (
              <>
                <p className="plateindex__group eyebrow">Also in this book</p>
                <ol className="plateindex__chapters">
                  {chapters.map((c, i) => (
                    <li key={c.label}>
                      <motion.button
                        className="plateindex__chapter"
                        onClick={() => go(c.href.slice(1))}
                        {...rowIn(projects.length + i)}
                      >
                        {c.label}
                      </motion.button>
                    </li>
                  ))}
                </ol>
                <div className="plateindex__colophon">
                  <a className="plateindex__mail" href={`mailto:${email}`}>{email}</a>
                  <ul className="plateindex__links">
                    {contactLinks.map((l) => (
                      <li key={l.label}><ContactLink link={l} /></li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="plateindex__foot caption">
                Three plates. Pick one, or keep scrolling.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
