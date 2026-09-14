export const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Progress of `t` across [a, b], clamped to 0..1. */
export const range = (t: number, a: number, b: number) => clamp((t - a) / (b - a))

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]

/** Mix two hex colours in sRGB and return a css rgb() string. */
export const mixHex = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  return `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`
}
