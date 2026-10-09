import type { Visual } from '../../engine/types'

export type CodeVisual = Extract<Visual, { kind: 'code' }>

/** Annotated code with an animated line-by-line run (implemented by the MOCKS task). */
export function CodeVisualView({ visual }: { visual: CodeVisual }) {
  return (
    <pre style={{ padding: 16, borderRadius: 16 }}>
      <code>{visual.lines.map((l) => l.code).join('\n')}</code>
    </pre>
  )
}
