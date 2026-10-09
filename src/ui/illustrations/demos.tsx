import type { Visual } from '../../engine/types'

export type DemoVisual = Extract<Visual, { kind: 'demo' }>

/** Looping 3–4 s animated-cursor demos (implemented by the MOCKS task). Static when prefers-reduced-motion. */
export function DemoView({ visual }: { visual: DemoVisual }) {
  return <div role="img" aria-label={`demo ${visual.gesture}`} style={{ padding: 16, border: '2px dashed currentColor', borderRadius: 16 }}>demo: {visual.gesture}</div>
}
