import { ArtView } from '../illustrations/ArtView'
import { MOCKS } from '../illustrations/mocks'
import type { CompareSide, MiniVisual, Visual } from '../../engine/types'

function Mini({ v }: { v: MiniVisual }) {
  if (v.kind === 'art') return <ArtView name={v.name} size={128} tile={false} />
  if (v.kind === 'mock') {
    const M = MOCKS[v.name]
    return <M os={v.os} highlight={v.highlight} />
  }
  return (
    <div className="text-7xl" aria-hidden="true">
      {v.emoji}
    </div>
  )
}

function Side({ side }: { side: CompareSide }) {
  return (
    <div className="deck-compare-side">
      <Mini v={side.visual} />
      <span className="text-lg font-bold leading-tight">{side.labelBn}</span>
      {side.captionBn && <span className="text-sm text-muted leading-snug">{side.captionBn}</span>}
    </div>
  )
}

/** Two pictures side by side (stacked below 520 px). */
export function CompareVisual({ visual }: { visual: Extract<Visual, { kind: 'compare' }> }) {
  return (
    <div className="deck-compare">
      <Side side={visual.left} />
      <span className="deck-compare-vs" aria-hidden="true">
        {visual.vs ?? 'বনাম'}
      </span>
      <Side side={visual.right} />
    </div>
  )
}
