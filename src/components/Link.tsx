import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../lib/router'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  /**
   * Return false to stay put. One caller needs it: an article row's click has a
   * second job on a touch device, where the first tap loads a plate onto the
   * stack and only the second opens the post. Everything else wants the
   * default, which is to go.
   */
  shouldNavigate?: () => boolean
}

/**
 * An internal link. A real anchor, so cmd-click, middle-click, "open in new
 * tab" and crawlers all behave; intercepted on a plain left click so the router
 * can handle it without a page load.
 *
 * This exists because the same eight lines were written twice — once for the
 * post page's own links and once for the article rows — which is exactly the
 * duplication `react-router`'s `<Link>` would have saved. It is cheaper to
 * write it once than to take the dependency for it. DECISIONS D45.
 */
export function Link({ to, shouldNavigate, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    // let the browser own every click that means something other than "go here"
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    if (shouldNavigate && !shouldNavigate()) return
    navigate(to)
  }

  return <a href={to} onClick={handle} {...rest} />
}

type Contact = { label: string; href: string; external?: boolean; download?: string }

/** One of the contact links — shared by the Back Cover and the Contents page. */
export function ContactLink({ link, className }: { link: Contact; className?: string }) {
  return link.external
    ? <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span className="vh"> (opens in a new tab)</span></a>
    : <a className={className} href={link.href} download={link.download}>{link.label}</a>
}
