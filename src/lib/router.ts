import { useEffect, useState } from 'react'

/**
 * Two URL shapes, so two routes — and about forty lines rather than a
 * dependency. `/` is the book; `/writing/<slug>/` is one post.
 *
 * The trailing slash is deliberate and matters at deploy time: the build emits
 * `dist/writing/<slug>/index.html`, and a directory URL maps to that file on
 * every static host without configuration. DECISIONS D44.
 */

export type Route = { name: 'home' } | { name: 'post'; slug: string }

/** Accepts the slash-less form too — hosts redirect to it, people paste it. */
const POST = /^\/writing\/([a-z0-9-]+)\/?$/i

export const parseRoute = (path: string): Route => {
  const m = POST.exec(path)
  return m ? { name: 'post', slug: m[1].toLowerCase() } : { name: 'home' }
}

export const postHref = (slug: string) => `/writing/${slug}/`

/** Subscribers are module-level so `navigate` can reach them from anywhere. */
const listeners = new Set<() => void>()

/**
 * Stamp the outgoing scroll offset onto the entry being left, then push.
 *
 * This has to happen here and not on the route change, because by then React
 * has already committed the new tree: the old page is unmounted, the document
 * has collapsed to a fraction of its height, and the browser has clamped the
 * scroll to fit. Measured on this site, a reader 12177px down was recorded at
 * 1560 — the position was destroyed before anything could read it. History
 * state is the right place for it anyway: it belongs to the entry, so it
 * survives further navigation and a reload. DECISIONS D44.
 */
export function navigate(path: string) {
  if (path === location.pathname + location.hash) return
  history.replaceState({ ...(history.state as object), y: scrollY }, '')
  history.pushState({ y: 0 }, '', path)
  listeners.forEach((f) => f())
}

/** Offset recorded for the entry now showing, if any. */
export const entryScroll = (): number => {
  const y = (history.state as { y?: unknown } | null)?.y
  return typeof y === 'number' ? y : 0
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof location === 'undefined' ? { name: 'home' } : parseRoute(location.pathname)
  )

  useEffect(() => {
    const sync = () => setRoute(parseRoute(location.pathname))
    listeners.add(sync)
    addEventListener('popstate', sync)
    return () => {
      listeners.delete(sync)
      removeEventListener('popstate', sync)
    }
  }, [])

  return route
}
