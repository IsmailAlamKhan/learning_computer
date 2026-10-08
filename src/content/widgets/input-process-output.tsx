import { useState } from 'react'
import { SCENARIOS, STAGES } from './lib/ioFlow'

export default function InputProcessOutput() {
  const [id, setId] = useState(SCENARIOS[0].id)
  const sc = SCENARIOS.find((s) => s.id === id)!
  return (
    <div className="card space-y-3 p-4" data-testid="io-flow">
      <p className="font-semibold">একটি কাজ বেছে নিন — দেখুন কোন ধাপে কী হয়</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a task">
        {SCENARIOS.map((s) => (
          <button key={s.id} type="button" className={`btn ${s.id === id ? '' : 'btn-outline'}`} aria-pressed={s.id === id} data-testid={`io-scenario-${s.id}`} onClick={() => setId(s.id)}>
            <span aria-hidden="true">{s.icon} </span>
            {s.titleBn}
          </button>
        ))}
      </div>
      <ol className="space-y-2">
        {STAGES.map((st, i) => {
          const text = sc.stages[st.id]
          const used = text !== null
          return (
            <li
              key={st.id}
              data-testid={`io-stage-${st.id}`}
              data-used={used ? 'yes' : 'no'}
              className="flex items-start gap-3 rounded-xl border-2 p-3"
              style={{ borderColor: used ? 'var(--c-brand)' : 'var(--c-line)', background: used ? 'var(--c-brand-soft)' : 'var(--c-sunken)', opacity: used ? 1 : 0.65 }}
            >
              <span className="text-2xl" aria-hidden="true">{st.icon}</span>
              <div>
                <div className="font-semibold">
                  {i + 1}. {st.bn} ({st.en})
                </div>
                <div className="text-sm">{used ? text : 'এই কাজে এই ধাপটি তেমন লাগে না।'}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
