import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MODULES } from '../content/modules'
import { hasLesson, loadLesson } from '../content/lessons'
import { downloadText } from '../lib/download'
import {
  REASON_LABEL,
  STATUS_LABEL,
  STATUS_MARK,
  SUGGESTION_BN,
  buildReportHtml,
  lessonMetaOf,
  relativeDayBn,
  reportFilename,
  summarize,
  type LessonMeta,
  type ModuleSummary,
  type StepCount,
} from '../lib/teacher'
import { store, useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'

/** Loads the small metadata (step counts, quiz question texts) of every lesson, lazily and once. */
function useLessonMetas() {
  const [metas, setMetas] = useState<Record<number, LessonMeta | undefined>>({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    Promise.all(
      MODULES.filter((m) => hasLesson(m.module)).map(async (m) => {
        try {
          const l = await loadLesson(m.module)
          return l ? lessonMetaOf(l) : undefined
        } catch {
          return undefined
        }
      }),
    ).then((list) => {
      if (!alive) return
      const out: Record<number, LessonMeta | undefined> = {}
      for (const lm of list) if (lm) out[lm.module] = lm
      setMetas(out)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])
  return { metas, loading }
}

function Bar({ label, done, total, pct }: { label: string; done: number; total: number; pct: number }) {
  const { n } = useFmt()
  return (
    <div>
      <div className="mb-1 flex justify-between gap-2 text-sm">
        <span>{label}</span>
        <span>
          {n(done)} / {n(total)} পাঠ ({n(pct)}%)
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${n(done)}/${n(total)} পাঠ সম্পন্ন`}
        className="h-4 overflow-hidden rounded-full bg-sunken"
        style={{ border: '1px solid var(--c-line)' }}
      >
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Steps({ c }: { c: StepCount }) {
  const { n } = useFmt()
  if (c.total > 0) return <span>{n(c.done)}/{n(c.total)}</span>
  return <span>{c.done > 0 ? n(c.done) : '—'}</span>
}

function ModuleRow({ m, now }: { m: ModuleSummary; now: Date }) {
  const { n, date } = useFmt()
  return (
    <tr>
      <th scope="row" className="font-medium">
        <Link to={`/module/${m.module}`} className="underline">
          {n(m.module)}. {m.titleBn}
        </Link>
        {!m.playable && <span className="block text-sm text-muted">শীঘ্রই আসছে</span>}
      </th>
      <td>
        <span className="whitespace-nowrap">
          <span aria-hidden="true">{STATUS_MARK[m.status]}</span> {STATUS_LABEL[m.status]}
        </span>
        {m.stalled && <span className="block text-sm">⚠ মাঝপথে থেমে আছে</span>}
      </td>
      <td>{m.completedAt ? date(m.completedAt) : '—'}</td>
      <td>
        {m.lastVisitedAt ? (
          <>
            {date(m.lastVisitedAt)}
            <span className="block text-sm text-muted">{relativeDayBn(m.lastVisitedAt, now, { n })}</span>
          </>
        ) : (
          '—'
        )}
      </td>
      <td><Steps c={m.steps.windows} /></td>
      <td><Steps c={m.steps.mac} /></td>
      <td>
        {m.quiz ? (
          <>
            <span>সেরা {n(m.quiz.best)}/{n(m.quiz.total)}</span>
            <span className="block text-sm text-muted">
              শেষবার {n(m.quiz.last)}/{n(m.quiz.total)} · ভুল চেষ্টা {n(m.quiz.retries)}
            </span>
            {m.lowScore && <span className="block text-sm">⚠ ৬০%-এর কম</span>}
          </>
        ) : (
          '—'
        )}
      </td>
      <td>{m.freePracticeDone ? '✓ হয়েছে' : 'না'}</td>
      <td>{m.realWorld.total > 0 ? `${n(m.realWorld.ticked)}/${n(m.realWorld.total)}` : n(m.realWorld.ticked)}</td>
    </tr>
  )
}

const PRINT_CSS = `
.teacher-table { border-collapse: collapse; width: 100%; }
.teacher-table caption { text-align: left; font-weight: 700; padding: 0 0 .5rem; }
.teacher-table th, .teacher-table td { border: 1px solid var(--c-line); padding: .4rem .6rem; text-align: left; vertical-align: top; }
.teacher-table thead th { background: var(--c-sunken); }
.teacher-scroll { overflow-x: auto; }
@page teacher { size: A4 landscape; margin: 10mm; }
@media print {
  .teacher-print { page: teacher; font-size: 10pt; line-height: 1.4; }
  .teacher-print .card { border: 1px solid #999 !important; background: #fff !important; padding: .6rem !important; break-inside: avoid; }
  .teacher-print h1 { font-size: 16pt; }
  .teacher-print h2 { font-size: 12pt; }
  .teacher-print .teacher-table { font-size: 8.5pt; }
  .teacher-print .teacher-table tr { break-inside: avoid; }
  .teacher-print .teacher-scroll { overflow: visible; }
  .teacher-print .text-muted { color: #333 !important; }
  .teacher-print [role='progressbar'] { border: 1px solid #000 !important; background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .teacher-print [role='progressbar'] > div { background: #444 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`

/** Local-only dashboard for the teacher (husband). Nothing here is sent anywhere. */
export default function Teacher() {
  const data = useProgress()
  const { n, date } = useFmt()
  const { metas, loading } = useLessonMetas()
  const [msg, setMsg] = useState('')
  const [now] = useState(() => new Date())
  const s = useMemo(() => summarize(data, metas, now), [data, metas, now])
  const name = s.learnerName || 'শিক্ষার্থী'

  const exportBackup = () => {
    downloadText(reportFilename(s, 'json'), store.exportJson())
    setMsg('✓ ব্যাকআপ ফাইলটি (JSON) কম্পিউটারে সেভ হয়েছে। এটি সেটিংস পাতা থেকে আবার ফিরিয়ে আনা যায়।')
  }
  const exportReport = () => {
    downloadText(reportFilename(s, 'html'), buildReportHtml(s, { n, date }), 'text/html')
    setMsg('✓ রিপোর্টটি (HTML) সেভ হয়েছে। ফাইলটি ব্রাউজারে খুলে দেখতে বা ছাপতে পারবেন।')
  }

  return (
    <div className="teacher-print space-y-6">
      <style>{PRINT_CSS}</style>
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">শিক্ষকের পাতা</h1>
        <p>
          <strong>{name}</strong>-এর শেখার অগ্রগতির সারসংক্ষেপ · কম্পিউটার: {s.os === 'mac' ? 'Mac' : 'Windows'} · আজ: {date(now)}
        </p>
        {s.motivation && (
          <p className="text-muted">
            তাঁর লক্ষ্য: <q>{s.motivation}</q>
          </p>
        )}
      </header>

      <section className="card space-y-3" aria-labelledby="t-data">
        <h2 id="t-data" className="text-xl font-bold">এই তথ্য কোথায় থাকে</h2>
        <p>
          এখানকার সব তথ্য শুধু এই কম্পিউটারের এই ব্রাউজারেই জমা আছে — কোথাও পাঠানো হয় না। ব্রাউজারের তথ্য মুছলে বা অন্য কম্পিউটারে গেলে তা হারিয়ে যেতে পারে।
          তাই মাঝে মাঝে নিচের “ব্যাকআপ নামান” বোতামে চেপে ফাইলটি সযত্নে রেখে দিন (যেমন পেনড্রাইভে বা ইমেইলে নিজেকে পাঠিয়ে)। পরে <Link to="/settings" className="underline">সেটিংস</Link> পাতার “ব্যাকআপ ফিরিয়ে আনুন” দিয়ে ফেরত আনা যাবে।
        </p>
        <div className="no-print flex flex-wrap gap-3">
          <button className="btn" onClick={exportBackup}>⬇ ব্যাকআপ নামান (JSON)</button>
          <button className="btn btn-outline" onClick={exportReport}>⬇ রিপোর্ট নামান (HTML)</button>
          <button className="btn btn-outline" onClick={() => window.print()}>🖨️ ছাপুন (A4)</button>
        </div>
        {msg && <p role="status" className="no-print rounded-xl bg-brand-soft p-3">{msg}</p>}
      </section>

      <section className="card space-y-4" aria-labelledby="t-overall">
        <h2 id="t-overall" className="text-xl font-bold">
          মোট অগ্রগতি: {n(s.overall.done)}/{n(s.overall.total)} পাঠ সম্পন্ন
        </h2>
        <Bar label="সব পাঠ" done={s.overall.done} total={s.overall.total} pct={s.overall.pct} />
        {s.parts.map((p) => (
          <Bar key={p.part} label={p.part === 1 ? 'পর্ব ১: কম্পিউটারের ভিত্তি' : 'পর্ব ২: প্রোগ্রামিংয়ের প্রস্তুতি'} done={p.done} total={p.total} pct={p.pct} />
        ))}
        <p className="text-muted">
          চলছে: {n(s.inProgressCount)}টি পাঠ · এখনো শুরু হয়নি: {n(s.notStartedCount)}টি · নোটবুকে নোট: {n(s.noteCount)}টি
        </p>
      </section>

      <section className="card space-y-3" aria-labelledby="t-weak">
        <h2 id="t-weak" className="text-xl font-bold">যেখানে একটু সাহায্য দরকার হতে পারে</h2>
        {loading && <p className="text-muted" role="status">পাঠের তথ্য লোড হচ্ছে…</p>}
        {s.weakModules.length === 0 && s.weakQuestions.length === 0 ? (
          <p>এখনো কোনো পাঠে বিশেষ সমস্যা ধরা পড়েনি। এটি ভালো লক্ষণ।</p>
        ) : (
          <>
            {s.weakModules.length > 0 && (
              <div>
                <h3 className="font-bold">যে পাঠগুলো আবার দেখা ভালো</h3>
                <ul className="mt-1 list-disc space-y-1 pl-6">
                  {s.weakModules.map((w) => (
                    <li key={w.module}>
                      <Link to={`/module/${w.module}`} className="underline">
                        পাঠ {n(w.module)}: {w.titleBn}
                      </Link>{' '}
                      — {w.reasons.map((r) => REASON_LABEL[r]).join('; ')}
                      {w.ratio !== undefined && ` (সেরা কুইজ ${n(Math.round(w.ratio * 100))}%)`}। {SUGGESTION_BN}।
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.weakQuestions.length > 0 && (
              <div className="teacher-scroll">
                <table className="teacher-table">
                  <caption>যেসব কুইজ-প্রশ্নে সবচেয়ে বেশি ভুল হয়েছে (শেষ কুইজে)</caption>
                  <thead>
                    <tr>
                      <th scope="col">প্রশ্ন</th>
                      <th scope="col">পাঠ</th>
                      <th scope="col">ভুল চেষ্টা</th>
                      <th scope="col">পরামর্শ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.weakQuestions.map((q) => (
                      <tr key={`${q.module}-${q.questionId}`}>
                        <th scope="row" className="font-medium">
                          {q.questionBn ?? 'একটি প্রশ্ন (এখন আর পাঠে নেই)'}
                          {q.hintBn && <span className="block text-sm font-normal text-muted">ইঙ্গিত: {q.hintBn}</span>}
                        </th>
                        <td>
                          <Link to={`/module/${q.module}`} className="underline">
                            {n(q.module)}. {q.moduleTitleBn}
                          </Link>
                        </td>
                        <td>{n(q.misses)} বার</td>
                        <td>{SUGGESTION_BN}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      <section className="card space-y-3" aria-labelledby="t-modules">
        <h2 id="t-modules" className="text-xl font-bold">পাঠ অনুযায়ী বিস্তারিত</h2>
        <p className="text-sm text-muted">“ধাপ” মানে হাতে-কলমে অংশের সম্পন্ন ধাপ। Windows ও Mac-এর অগ্রগতি আলাদা করে গোনা হয়। “ভুল চেষ্টা” মানে শেষ কুইজে মোট কতবার ভুল উত্তর দেওয়া হয়েছে।</p>
        <div className="teacher-scroll" tabIndex={0} role="region" aria-label="পাঠ অনুযায়ী অগ্রগতির টেবিল">
          <table className="teacher-table" data-testid="module-table">
            <caption>প্রতিটি পাঠের অবস্থা, কুইজ ও হাতে-কলমে ধাপ</caption>
            <thead>
              <tr>
                <th scope="col">পাঠ</th>
                <th scope="col">অবস্থা</th>
                <th scope="col">সম্পন্নের তারিখ</th>
                <th scope="col">শেষ দেখা</th>
                <th scope="col">Windows ধাপ</th>
                <th scope="col">Mac ধাপ</th>
                <th scope="col">কুইজ</th>
                <th scope="col">নিজে করুন</th>
                <th scope="col">আসল কাজ (টিক)</th>
              </tr>
            </thead>
            <tbody>
              {s.modules.map((m) => (
                <ModuleRow key={m.module} m={m} now={now} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card space-y-2" aria-labelledby="t-recent">
          <h2 id="t-recent" className="text-xl font-bold">সাম্প্রতিক কাজ</h2>
          {s.recent.length === 0 ? (
            <p>এখনো কোনো পাঠ খোলা হয়নি।</p>
          ) : (
            <ol className="list-decimal space-y-1 pl-6">
              {s.recent.map((m) => (
                <li key={m.module}>
                  <Link to={`/module/${m.module}`} className="underline">
                    {n(m.module)}. {m.titleBn}
                  </Link>{' '}
                  — {relativeDayBn(m.lastVisitedAt, now, { n })} ({date(m.lastVisitedAt as string)})
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="card space-y-2" aria-labelledby="t-certs">
          <h2 id="t-certs" className="text-xl font-bold">সনদ ও নোটবুক</h2>
          {s.certificates.length === 0 ? (
            <p>এখনো কোনো সনদ পাওয়া হয়নি। পাঠ ১৩ ও ২০ শেষ করলে সনদ মিলবে।</p>
          ) : (
            <ul className="list-disc space-y-1 pl-6">
              {s.certificates.map((c) => (
                <li key={c.part}>
                  পর্ব {n(c.part)}-এর সনদ — {c.name || name}, {date(c.issuedAt)}{' '}
                  <Link to={`/certificate/${c.part}`} className="no-print underline">দেখুন</Link>
                </li>
              ))}
            </ul>
          )}
          <p>
            নোটবুকে নোট: {n(s.noteCount)}টি <Link to="/notebook" className="no-print underline">(নোটবুক খুলুন)</Link>
          </p>
        </section>
      </div>

      <p className="no-print">
        <Link to="/settings" className="btn btn-outline">সেটিংসে যান (ব্যাকআপ ফিরিয়ে আনা, সব পাঠ খুলে দেওয়া)</Link>{' '}
        <Link to="/demo/tools" className="underline">টুলস ডেমো</Link>
      </p>
    </div>
  )
}
