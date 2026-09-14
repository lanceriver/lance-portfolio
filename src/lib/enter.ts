import type { Target, TargetAndTransition, Transition } from 'motion/react'

type Viewport = { once?: boolean; amount?: number | 'some' | 'all'; margin?: string }

/**
 * Dev affordance: `?settled=1` renders every arrival at its final composed
 * state, skipping the in-view entrance. Composition can then be reviewed
 * without waiting on scroll, and it is how the reduced-motion end state is
 * checked too. No query parameter means normal behaviour.
 */
export const SETTLED =
  typeof location !== 'undefined' && new URLSearchParams(location.search).has('settled')

/**
 * Motion props for an object that ARRIVES — see MOTION_DIRECTION §2.1 "LAY DOWN".
 * Reduced motion and the settled flag both resolve straight to the end state,
 * so nothing that only existed as an animation can go missing.
 */
export function arrive(
  from: Target,
  to: TargetAndTransition,
  transition: Transition,
  reduced: boolean,
  viewport: Viewport = { once: true, amount: 0.2 }
) {
  if (reduced || SETTLED) return { initial: false as const, animate: to }
  return { initial: from, whileInView: to, viewport, transition }
}
