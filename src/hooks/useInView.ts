import { useEffect, useRef, useState } from 'react'

/** Fires once, when the element first crosses the threshold. */
export function useInView<T extends HTMLElement>(threshold = 0.25, rootMargin = '0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, seen])

  return [ref, seen] as const
}
