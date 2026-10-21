const SESSION_KEY = 'lr-visited'
const REQUEST_TIMEOUT_MS = 2500

let pendingVisit: Promise<number | null> | null = null

function apiUrl(): string | null {
  const value = import.meta.env.VITE_VISITS_API
  return value ? value.replace(/\/$/, '') : null
}

async function requestCount(url: string, method: 'GET' | 'POST'): Promise<number | null> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, { method, signal: controller.signal })
    if (!response.ok) return null
    const payload: unknown = await response.json()
    if (typeof payload === 'object' && payload !== null && 'count' in payload && typeof payload.count === 'number') {
      return payload.count
    }
    return null
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

export function getVisitCount(): Promise<number | null> {
  if (pendingVisit) return pendingVisit
  const url = apiUrl()
  if (!url) return Promise.resolve(null)

  pendingVisit = (async () => {
    let visited = false
    try {
      visited = window.sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      // Storage can be disabled; count this page view without persisting state.
    }

    if (visited) return requestCount(url, 'GET')
    const count = await requestCount(url, 'POST')
    if (count !== null) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // The counter result remains useful when storage is unavailable.
      }
    }
    return count
  })().finally(() => {
    pendingVisit = null
  })

  return pendingVisit
}
