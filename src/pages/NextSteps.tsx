import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'
import { DAILY_PLAN, dailyTotal, encouragement, RESOURCES, RESOURCE_WARNING, ROADMAP, STUCK_STEPS, weekGrid } from '../lib/nextSteps'

/** “এরপর কোথায় যাব”: the roadmap after the course, free-resource types, a printable daily-habit sheet, and a personal closing message. */
export default function NextSteps() {
  const data = useProgress()
  const { n } = useFmt()
  const [printOnly, setPrintOnly] = useState(false)
  const done20 = !!data.modules[20]?.completed
  const msg = encouragement(data.profile.name, data.profile.motivation)

  useEffect(() => {
    const reset = () => setPrintOnly(false)
    window.addEventListener('afterprint', reset)
    return () => window.removeEventListener('afterprint', reset)
  }, [])

  const printHabit = () => {
    setPrintOnly(true)
    window.setTimeout(() => window.print(), 50)
  }

  return (
    <div className="space-y-8">
      {/* when only the habit sheet is wanted on paper, hide everything else while printing */}
      {printOnly && <style>{'@media print { .ns-hide-when-habit { display: none !important; } }'}</style>}

      <div className="no-print flex flex-wrap gap-3">
        <Link to="/" className="btn btn-outline">← হোম</Link>
        {done20 && <Link to="/certificate/2" className="btn btn-outline">🏆 পর্ব ২-এর সনদ</Link>}
      </div>

      <section className="ns-hide-when-habit card space-y-3" style={{ background: 'var(--c-brand-soft)' }} aria-labelledby="ns-title" data-testid="ns-message">
        <h1 id="ns-title" className="text-2xl font-bold">🚀 এরপর কোথায় যাব</h1>
        <h2 className="text-xl font-bold">{msg.titleBn}</h2>
        {msg.linesBn.map((l) => <p key={l}>{l}</p>)}
      </section>

      <section className="ns-hide-when-habit space-y-3" aria-labelledby="ns-road">
        <h2 id="ns-road" className="text-xl font-bold">চারটি ধাপের পথ</h2>
        <ol className="space-y-3">
          {ROADMAP.map((s) => (
            <li key={s.id} className="card space-y-2" data-testid={`road-${s.id}`}>
              <h3 className="text-lg font-bold">{s.titleBn}</h3>
              <p>{s.whyBn}</p>
              <ul className="list-disc space-y-1 pl-6">{s.itemsBn.map((i) => <li key={i}>{i}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="ns-hide-when-habit space-y-3" aria-labelledby="ns-res">
        <h2 id="ns-res" className="text-xl font-bold">কোথায় বিনামূল্যে শিখবেন (কোন ধরনের উৎস খুঁজবেন)</h2>
        <ul className="space-y-3">
          {RESOURCES.map((r) => (
            <li key={r.id} className="card space-y-1">
              <h3 className="font-bold">{r.titleBn}</h3>
              <p>{r.textBn}</p>
            </li>
          ))}
        </ul>
        <p className="rounded-xl p-4" style={{ background: 'var(--c-accent-soft)' }}>ℹ️ {RESOURCE_WARNING}</p>
      </section>

      <section className="ns-hide-when-habit card space-y-2" aria-labelledby="ns-stuck">
        <h2 id="ns-stuck" className="text-xl font-bold">আটকে গেলে কী করবেন</h2>
        <ol className="list-decimal space-y-1 pl-6">{STUCK_STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
      </section>

      <section aria-labelledby="ns-habit" className="space-y-4" data-testid="habit-sheet">
        <div className="no-print flex flex-wrap items-center gap-3">
          <h2 id="ns-habit" className="text-xl font-bold">প্রতিদিনের অভ্যাস-ছক</h2>
          <button className="btn" onClick={printHabit}>🖨️ শুধু অভ্যাস-ছক ছাপুন (A4)</button>
        </div>
        <div className="habit-sheet space-y-4 rounded-xl border-2 p-4" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
          <h2 className="hidden text-xl font-bold print:block">আমার প্রতিদিনের কোডিং-অভ্যাস{data.profile.name ? ` — ${data.profile.name}` : ''}</h2>
          <p className="m-0 font-semibold">রোজ মাত্র {n(dailyTotal())} মিনিট:</p>
          <ul className="m-0 grid gap-2 sm:grid-cols-3">
            {DAILY_PLAN.map((b) => (
              <li key={b.id} className="rounded-lg border p-2" style={{ borderColor: 'var(--c-line)' }}>
                <strong>{n(b.minutes)} মিনিট: {b.titleBn}</strong>
                <br />
                <span className="text-sm">{b.textBn}</span>
              </li>
            ))}
          </ul>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center" aria-label="সাপ্তাহিক অভ্যাসের ছক">
              <thead>
                <tr>
                  <th scope="col" className="border p-1 text-left" style={{ borderColor: 'var(--c-line)' }}>সপ্তাহ</th>
                  {weekGrid(1)[0].days.map((d) => <th key={d} scope="col" className="border p-1" style={{ borderColor: 'var(--c-line)' }}>{d}</th>)}
                  <th scope="col" className="border p-1 text-left" style={{ borderColor: 'var(--c-line)' }}>এই সপ্তাহের ছোট প্রকল্প</th>
                </tr>
              </thead>
              <tbody>
                {weekGrid(4).map((w) => (
                  <tr key={w.week}>
                    <th scope="row" className="border p-1 text-left" style={{ borderColor: 'var(--c-line)' }}>{n(w.week)}</th>
                    {w.days.map((d) => (
                      <td key={d} className="border p-1" style={{ borderColor: 'var(--c-line)' }}>
                        <input type="checkbox" className="h-6 w-6 accent-[var(--c-brand)]" aria-label={`সপ্তাহ ${n(w.week)}, ${d}`} />
                      </td>
                    ))}
                    <td className="border p-1" style={{ borderColor: 'var(--c-line)', minWidth: '10rem' }}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            {['এই সপ্তাহে কী বানালাম / শিখলাম:', 'কোথায় আটকালাম আর কীভাবে বের হলাম:', 'আগামী সপ্তাহে কী করব:'].map((t) => (
              <div key={t} className="rounded-lg border p-2" style={{ borderColor: 'var(--c-line)', minHeight: '5rem' }}>{t}</div>
            ))}
          </div>
          <p className="m-0 text-sm">সপ্তাহে একটি ছোট প্রকল্প। কোনো দিন বাদ গেলে ঘাবড়াবেন না; পরদিন আবার শুরু করুন।</p>
        </div>
      </section>

      <section className="ns-hide-when-habit card space-y-2" style={{ background: 'var(--c-ok-soft)' }}>
        <h2 className="text-xl font-bold">শেষ কথা</h2>
        <p>এই পথচলায় আপনি একা নন: আপনার নোটবুক, শব্দকোষ আর ছাপিয়ে নেওয়ার মতো চিট শিট সবসময় আপনার সাথে আছে। যখনই মনে হবে “আমি পারব না”, পেছনে তাকিয়ে দেখুন আজ কতটা এসেছেন।</p>
        <p className="no-print"><Link to="/cheatsheets" className="underline">HTML ও পাইথনের চিট শিটগুলো ছাপুন</Link></p>
      </section>
    </div>
  )
}
