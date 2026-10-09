import { Suspense } from 'react'
import { ArtView } from './ArtView'
import { CodeVisualView } from './codeVisual'
import { DemoView } from './demos'
import { MOCKS } from './mocks'
import { WIDGETS } from '../../content/widgets'
import type { MiniVisual, Visual } from '../../engine/types'
import { ART } from './art'


function Mini({ v }: { v: MiniVisual }) {
  if (v.kind === 'art') return <ArtView name={v.name} size={120} />
  if (v.kind === 'mock') {
    const M = MOCKS[v.name]
    return <M os={v.os} highlight={v.highlight} />
  }
  return <div className="text-7xl" aria-hidden="true">{v.emoji}</div>
}

/** Renders any card visual. */
export function VisualView({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case 'art':
      return <ArtView name={visual.name} caption={visual.captionBn} size={200} />
    case 'big':
      return (
        <figure className="flex flex-col items-center gap-2">
          <div className="text-8xl" aria-hidden="true">{visual.emoji}</div>
          {visual.captionBn && <figcaption className="text-muted">{visual.captionBn}</figcaption>}
        </figure>
      )
    case 'flow':
      return (
        <ol className="flex flex-wrap items-center justify-center gap-3" aria-label="ধাপগুলো">
          {visual.items.map((it, i) => {
            const Art = ART[it.art]
            return (
              <li key={i} className="flex items-center gap-3">
                <span className="flex flex-col items-center gap-1">
                  <span className="rounded-[24px] p-2" style={{ background: 'linear-gradient(145deg,#f5f0ff,#e9f7f4)' }}>
                    <Art size={96} title={it.labelBn} />
                  </span>
                  <span className="text-base font-semibold">{it.labelBn}</span>
                </span>
                {i < visual.items.length - 1 && <span aria-hidden="true" className="text-3xl text-brand">→</span>}
              </li>
            )
          })}
        </ol>
      )
    case 'compare':
      return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {[visual.left, visual.right].map((side, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 text-center ${i === 1 ? 'col-start-3' : ''}`}>
              <Mini v={side.visual} />
              <span className="text-lg font-bold">{side.labelBn}</span>
              {side.captionBn && <span className="text-base text-muted">{side.captionBn}</span>}
            </div>
          ))}
          <span className="col-start-2 row-start-1 text-xl font-bold text-muted" aria-hidden="true">{visual.vs ?? 'বনাম'}</span>
        </div>
      )
    case 'mock': {
      const M = MOCKS[visual.name]
      return (
        <figure className="flex flex-col items-center gap-2">
          <M os={visual.os} highlight={visual.highlight} />
          {visual.captionBn && <figcaption className="text-center text-muted">{visual.captionBn}</figcaption>}
        </figure>
      )
    }
    case 'demo':
      return <DemoView visual={visual} />
    case 'code':
      return <CodeVisualView visual={visual} />
    case 'widget': {
      const W = WIDGETS[visual.widget]
      return W ? (
        <Suspense fallback={<p>লোড হচ্ছে…</p>}>
          <W {...(visual.props ?? {})} />
        </Suspense>
      ) : null
    }
  }
}
