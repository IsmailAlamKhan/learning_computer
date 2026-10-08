import { useState } from 'react'
import { DEFAULT_ROADMAP, QUESTIONS, answeredCount, isComplete, nameBn, recommend, type Answers, type Roadmap } from './lib/pathChooser'

function RoadmapList({ roadmap, personal }: { roadmap: Roadmap; personal: boolean }) {
  const items = [
    { n: 1, name: nameBn(roadmap.first), note: 'প্রথমে — চোখের সামনে ফল দেখা যায়' },
    { n: 2, name: nameBn(roadmap.second), note: personal ? 'তারপর — আপনার উত্তর অনুযায়ী' : 'তারপর — সাধারণ প্রস্তাব' },
    { n: 3, name: nameBn(roadmap.third), note: 'এরপর — যখন ইচ্ছে হবে' },
  ]
  return (
    <ol className="space-y-2" data-testid="roadmap" aria-label="শেখার পথ">
      {items.map((it) => (
        <li key={it.n} className="flex items-center gap-3 rounded-lg border p-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full font-bold" style={{ background: 'var(--c-brand)', color: '#fff' }}>{it.n}</span>
          <span>
            <strong>{it.name}</strong> <span className="text-sm" style={{ color: 'var(--c-muted)' }}>— {it.note}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/** “কোন পথে আগে?” — a few friendly questions; the main roadmap is always visible. */
export default function PathChooser() {
  const [answers, setAnswers] = useState<Answers>({})
  const done = isComplete(answers)
  const rec = done ? recommend(answers) : null
  return (
    <div className="card space-y-4 p-4" data-testid="path-chooser">
      <p className="font-semibold">🧭 কোন পথে আগে যাবেন? — {answeredCount(answers)}/{QUESTIONS.length} প্রশ্নের উত্তর দিয়েছেন</p>
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>সঠিক-ভুল উত্তর নেই। যেটা মনে আসে সেটাই বেছে নিন।</p>
      {QUESTIONS.map((q, qi) => (
        <fieldset key={q.id} className="space-y-1">
          <legend className="font-semibold">{qi + 1}. {q.textBn}</legend>
          <div className="flex flex-col gap-1">
            {q.options.map((o) => (
              <button key={o.id} type="button" className={`btn justify-start text-left ${answers[q.id] === o.id ? '' : 'btn-outline'}`} aria-pressed={answers[q.id] === o.id} data-testid={`pc-${q.id}-${o.id}`} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}>
                {o.textBn}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      {rec ? (
        <div className="space-y-2 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-brand)' }} role="status" data-testid="pc-result" data-second={rec.roadmap.second}>
          <p className="text-lg font-bold">✅ {rec.headlineBn}</p>
          <ul className="list-disc space-y-1 pl-5">
            {rec.whyBn.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>সব প্রশ্নের উত্তর দিলে আপনার জন্য একটি প্রস্তাব দেখাব। তার আগে সাধারণ পথটি নিচে দেখুন।</p>
      )}

      <div>
        <p className="mb-1 font-semibold">মূল পথ (সবার জন্য একই শুরু)</p>
        <RoadmapList roadmap={rec ? rec.roadmap : DEFAULT_ROADMAP} personal={!!rec} />
      </div>
      {rec && (
        <button type="button" className="btn btn-outline" onClick={() => setAnswers({})}>↺ আবার উত্তর দিই</button>
      )}
    </div>
  )
}
