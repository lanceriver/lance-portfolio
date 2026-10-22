import { useEffect, useState, type RefObject } from 'react'

type NowPlayingRecord = {
  playing: boolean
  title: string | null
  artist: string | null
  url: string | null
  art: string | null
}

export type NowPlayingState = NowPlayingRecord & {
  available: boolean
}

const STOPPED: NowPlayingRecord = {
  playing: false,
  title: null,
  artist: null,
  url: null,
  art: null,
}

const INITIAL: NowPlayingState = { ...STOPPED, available: false }
const POLL_MS = 30_000
const REQUEST_TIMEOUT_MS = 8_000

function isRecord(value: unknown): value is Omit<NowPlayingRecord, 'art'> & { art?: unknown } {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return typeof record.playing === 'boolean'
    && (typeof record.title === 'string' || record.title === null)
    && (typeof record.artist === 'string' || record.artist === null)
    && (typeof record.url === 'string' || record.url === null)
    && (!('art' in record) || typeof record.art === 'string' || record.art === null)
}

function spotifyTrackUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && url.hostname === 'open.spotify.com'
      && /^\/track\/[A-Za-z0-9]+\/?$/.test(url.pathname)
      ? url.href
      : null
  } catch {
    return null
  }
}

function spotifyArtworkUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
      && url.hostname === 'i.scdn.co'
      && !url.username
      && !url.password
      && !url.port
      && /^\/image\/[A-Za-z0-9]+$/.test(url.pathname)
      && !url.search
      && !url.hash
      ? url.href
      : null
  } catch {
    return null
  }
}

export function useNowPlaying(targetRef: RefObject<HTMLElement>): NowPlayingState {
  const [state, setState] = useState(INITIAL)
  const [inView, setInView] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'visible',
  )

  useEffect(() => {
    const target = targetRef.current
    if (!target || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '80px',
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetRef])

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState === 'visible')
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    const endpoint = import.meta.env.VITE_NOW_PLAYING_API
    if (!endpoint || !inView || !documentVisible) return

    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let controller: AbortController | undefined

    const poll = async () => {
      controller = new AbortController()
      const timeout = setTimeout(() => controller?.abort(), REQUEST_TIMEOUT_MS)
      try {
        const response = await fetch(endpoint, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Now-playing request returned ${response.status}`)
        const body: unknown = await response.json()
        if (!isRecord(body)) throw new Error('Invalid now-playing response')

        const title = body.title?.trim() || null
        const artist = body.artist?.trim() || null
        const url = spotifyTrackUrl(body.url)
        const art = spotifyArtworkUrl(body.art)
        if (stopped) return

        setState({
          playing: body.playing && Boolean(title && artist && url),
          title,
          artist,
          url,
          art,
          available: true,
        })
      } catch {
        if (!stopped) {
          setState((previous) => ({
            ...previous,
            playing: false,
            available: false,
          }))
        }
      } finally {
        clearTimeout(timeout)
        if (!stopped) timer = setTimeout(poll, POLL_MS)
      }
    }

    void poll()
    return () => {
      stopped = true
      if (timer) clearTimeout(timer)
      controller?.abort()
    }
  }, [documentVisible, inView])

  return state
}
