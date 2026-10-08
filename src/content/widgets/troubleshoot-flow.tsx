import { useState } from 'react'
import { FLOW_START, flowNode } from './lib/m12Logic'

/** “কী করবেন?” — a clickable decision tree: pick the symptom, answer the questions, get the next thing to try. */
export default function TroubleshootFlow() {
  const [path, setPath] = useState<string[]>([FLOW_START])
  const current = flowNode(path[path.length - 1]) ?? flowNode(FLOW_START)!
  return (
    <div className="card space-y-3 p-4" data-testid="troubleshoot-flow">
      <p className="font-semibold">কী করবেন? — প্রশ্নের উত্তর দিয়ে এগোন</p>
      {path.length > 1 && (
        <ol className="flex flex-wrap gap-1 text-sm" style={{ color: 'var(--c-muted)' }} aria-label="আপনি যে পথে এসেছেন">
          {path.slice(0, -1).map((id, i) => {
            const n = flowNode(id)
            return (
              <li key={`${id}-${i}`}>
                {n?.kind === 'question' ? n.textBn : n?.titleBn} →
              </li>
            )
          })}
        </ol>
      )}
      {current.kind === 'question' ? (
        <div className="space-y-2" data-testid="flow-question">
          <p className="text-lg">{current.textBn}</p>
          <div className="flex flex-col gap-2">
            {current.options.map((o) => (
              <button key={o.labelBn} type="button" className="btn btn-outline justify-start text-left" onClick={() => setPath((p) => [...p, o.next])}>
                {o.labelBn}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-brand)' }} data-testid="flow-answer">
          <p className="font-semibold">✅ {current.titleBn}</p>
          <ul className="list-disc space-y-1 pl-5">
            {current.stepsBn.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex gap-2">
        {path.length > 1 && (
          <button type="button" className="btn btn-outline" onClick={() => setPath((p) => p.slice(0, -1))}>
            ← আগের প্রশ্ন
          </button>
        )}
        {path.length > 1 && (
          <button type="button" className="btn btn-outline" onClick={() => setPath([FLOW_START])}>
            ↺ নতুন করে শুরু
          </button>
        )}
      </div>
    </div>
  )
}
