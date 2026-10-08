import { useState } from 'react'
import { IF_SCENARIOS, evaluateScenario, initialValues } from './lib/m16Logic'

/** “যদি… তবে… নইলে…” — flip the switches and watch which branch the decision takes. */
export default function IfElseExplorer() {
  const [sid, setSid] = useState(IF_SCENARIOS[0].id)
  const scenario = IF_SCENARIOS.find((s) => s.id === sid)!
  const [values, setValues] = useState<Record<string, boolean>>(() => initialValues(IF_SCENARIOS[0]))
  const result = evaluateScenario(scenario, values)

  const choose = (id: string) => {
    setSid(id)
    setValues(initialValues(IF_SCENARIOS.find((s) => s.id === id)!))
  }
  const mark = { fired: '✅ মিলেছে', failed: '✖ মেলেনি', skipped: '— দেখাই হয়নি' } as const

  return (
    <div className="card space-y-3 p-4" data-testid="if-else-explorer">
      <p className="font-semibold">সিদ্ধান্ত নিয়ে খেলুন</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="পরিস্থিতি বাছুন">
        {IF_SCENARIOS.map((s) => (
          <button key={s.id} type="button" aria-pressed={s.id === sid} data-testid={`ie-scenario-${s.id}`} className="btn btn-outline aria-pressed:border-brand aria-pressed:bg-brand-soft" onClick={() => choose(s.id)}>
            <span aria-hidden="true">{s.icon}</span> {s.titleBn}
          </button>
        ))}
      </div>
      <p>{scenario.introBn}</p>

      <div className="space-y-2">
        {scenario.toggles.map((t) => {
          const on = values[t.id]
          return (
            <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-xl border-2 p-2" style={{ borderColor: 'var(--c-line)' }}>
              <span className="flex-1 font-medium">{t.questionBn}</span>
              <button type="button" role="switch" aria-checked={on} data-testid={`ie-toggle-${t.id}`} className="btn btn-outline aria-checked:border-brand aria-checked:bg-brand-soft" onClick={() => setValues((v) => ({ ...v, [t.id]: !v[t.id] }))}>
                {on ? `✔ ${t.yesBn}` : `✖ ${t.noBn}`}
              </button>
            </div>
          )
        })}
      </div>

      <ol className="space-y-1" aria-label="নিয়মগুলো">
        {scenario.rules.map((r, i) => (
          <li
            key={r.ifBn}
            data-testid={`ie-rule-${i}`}
            data-state={result.lines[i]}
            className="rounded-lg border-2 px-3 py-2"
            style={{ borderColor: result.lines[i] === 'fired' ? 'var(--c-ok)' : 'var(--c-line)', background: result.lines[i] === 'fired' ? 'var(--c-ok-soft)' : 'transparent', borderStyle: result.lines[i] === 'skipped' ? 'dashed' : 'solid', color: result.lines[i] === 'skipped' ? 'var(--c-muted)' : undefined }}
          >
            <span className="font-medium">{r.ifBn}</span> → {r.thenBn}
            <span className="ml-2 text-sm" style={{ color: 'var(--c-muted)' }}>{mark[result.lines[i]]}</span>
          </li>
        ))}
        <li
          data-testid="ie-else"
          data-state={result.elseState}
          className="rounded-lg border-2 px-3 py-2"
          style={{ borderColor: result.elseState === 'fired' ? 'var(--c-ok)' : 'var(--c-line)', background: result.elseState === 'fired' ? 'var(--c-ok-soft)' : 'transparent', borderStyle: result.elseState === 'skipped' ? 'dashed' : 'solid', color: result.elseState === 'skipped' ? 'var(--c-muted)' : undefined }}
        >
          {scenario.elseBn}
          <span className="ml-2 text-sm" style={{ color: 'var(--c-muted)' }}>{result.elseState === 'fired' ? '✅ কোনো শর্তই মেলেনি, তাই এটি' : '— দেখাই হয়নি'}</span>
        </li>
      </ol>

      <p role="status" data-testid="ie-outcome" className="rounded-xl p-3 text-lg font-semibold" style={{ background: 'var(--c-brand-soft)' }}>
        ফল: {result.outcomeBn}
      </p>
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>সুইচ বদলান — একটি শর্ত মিলে গেলে কম্পিউটার বাকিগুলো আর দেখে না।</p>
    </div>
  )
}
