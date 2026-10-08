import { useState } from 'react'
import { nextFrame, prevFrame, TRACE_FRAMES, TRACE_PROGRAM } from './lib/m20Logic'

/** Steps through a small Python program one line at a time, showing the variable boxes and the printed output. */
export default function CodeTrace() {
  const [i, setI] = useState(0)
  const f = TRACE_FRAMES[i]
  const vars = Object.entries(f.vars)
  return (
    <div className="card space-y-3 p-4" data-testid="code-trace">
      <p className="font-semibold">পাইথন একটি একটি লাইন করে কীভাবে চলে, দেখুন</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <pre className="m-0 overflow-auto rounded-xl p-3 font-mono text-sm" style={{ background: 'var(--c-sunken)' }} aria-label="প্রোগ্রাম">
          {TRACE_PROGRAM.map((l, n) => (
            <div key={n} data-line={n + 1} data-active={f.line === n + 1 ? 'yes' : 'no'} style={f.line === n + 1 ? { background: 'var(--c-accent-soft)', fontWeight: 700 } : undefined}>
              <span className="mr-3 text-muted">{n + 1}</span>
              {l}
            </div>
          ))}
        </pre>
        <div className="space-y-2">
          <div className="rounded-xl border-2 p-2" style={{ borderColor: 'var(--c-line)' }}>
            <p className="text-sm font-semibold">ভেরিয়েবলের বাক্স</p>
            <p className="m-0 font-mono text-sm" data-testid="trace-vars">{vars.length === 0 ? '(এখনো কিছু নেই)' : vars.map(([k, v]) => `${k} = ${v}`).join('   ')}</p>
          </div>
          <div className="rounded-xl border-2 p-2" style={{ borderColor: 'var(--c-line)' }}>
            <p className="text-sm font-semibold">আউটপুট (পর্দায় যা ছাপা হলো)</p>
            <pre className="m-0 font-mono text-sm" data-testid="trace-output">{f.output.length === 0 ? '(এখনো কিছু নেই)' : f.output.join('\n')}</pre>
          </div>
        </div>
      </div>
      <p className="rounded-xl p-3" style={{ background: 'var(--c-brand-soft)' }} aria-live="polite" data-testid="trace-note">{f.noteBn}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline" disabled={i === 0} onClick={() => setI(prevFrame(i))}>← আগের লাইন</button>
        <button type="button" className="btn" disabled={i === TRACE_FRAMES.length - 1} onClick={() => setI(nextFrame(i))} data-testid="trace-next">পরের লাইন →</button>
        <button type="button" className="btn btn-outline" onClick={() => setI(0)}>আবার শুরু</button>
      </div>
    </div>
  )
}
