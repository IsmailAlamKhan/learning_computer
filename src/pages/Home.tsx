import { Link } from 'react-router-dom'
import { MODULES, PARTS } from '../content/modules'
import { completedCount, moduleState, todaysModule, type ModuleState } from '../engine/roadmap'
import { useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'
import type { ModuleMeta } from '../engine/types'

const STATE_LABEL: Record<ModuleState, string> = {
  completed: '✓ সম্পন্ন',
  unlocked: 'শুরু করুন',
  locked: '🔒 তালা দেওয়া',
  soon: 'শীঘ্রই আসছে',
}

function ModuleCard({ m, state }: { m: ModuleMeta; state: ModuleState }) {
  const { n } = useFmt()
  const clickable = state === 'unlocked' || state === 'completed'
  const body = (
    <>
      <span aria-hidden="true" className="text-3xl">{m.icon}</span>
      <span className="flex-1">
        <span className="block text-sm text-muted">পাঠ {n(m.module)}</span>
        <span className="block text-lg font-bold">{m.titleBn}</span>
        <span className="block text-sm text-muted">{m.oneLineBn}</span>
      </span>
      <span
        className={`chip ${state === 'completed' ? 'bg-ok-soft text-ok' : state === 'unlocked' ? 'bg-brand-soft text-ink' : 'bg-sunken text-muted'}`}
      >
        {STATE_LABEL[state]}
      </span>
    </>
  )
  const cls = `card flex flex-wrap items-center gap-4 ${clickable ? 'hover:border-brand' : 'border-dashed'}`
  return clickable ? (
    <Link to={`/module/${m.module}`} className={cls}>{body}</Link>
  ) : (
    <div className={cls} aria-disabled="true">{body}</div>
  )
}

export default function Home() {
  const data = useProgress()
  const { n } = useFmt()
  const today = todaysModule(data)
  const done = completedCount(data)
  const pct = Math.round((done / MODULES.length) * 100)

  return (
    <div className="space-y-8">
      <section className="card space-y-4" style={{ background: 'var(--c-brand-soft)' }}>
        <h1 className="text-2xl font-bold">স্বাগতম{data.profile.name ? `, ${data.profile.name}` : ''}! 🌸</h1>
        {data.profile.motivation && (
          <p>
            <span className="text-muted">আপনার লক্ষ্য: </span>
            <q className="font-medium">{data.profile.motivation}</q>
          </p>
        )}
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>আপনার অগ্রগতি</span>
            <span>{n(done)} / {n(MODULES.length)} পাঠ সম্পন্ন</span>
          </div>
          <div
            role="progressbar"
            aria-label="মোট অগ্রগতি"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className="h-4 overflow-hidden rounded-full bg-surface"
          >
            <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {today ? (
          <Link to={`/module/${today.module}`} className="btn btn-lg w-full sm:w-auto">
            ▶ আজকের পাঠ: {today.titleBn}
          </Link>
        ) : (
          <p className="rounded-xl bg-surface p-4">
            এই মুহূর্তে সব চালু পাঠ শেষ হয়ে গেছে। নতুন পাঠ শীঘ্রই আসছে — ততক্ষণ পুরোনো পাঠ আবার ঘুরে দেখতে পারেন।
          </p>
        )}
      </section>

      {data.modules[20]?.completed && (
        <Link to="/next-steps" className="card flex items-center gap-4 hover:border-brand" data-testid="home-next-steps">
          <span aria-hidden="true" className="text-3xl">🚀</span>
          <span className="flex-1">
            <span className="block text-lg font-bold">এরপর কোথায় যাব</span>
            <span className="block text-sm text-muted">কোর্স শেষ করেছেন! এবার পরের পথ, বিনামূল্যের উৎস আর রোজকার অভ্যাস-ছক দেখুন।</span>
          </span>
        </Link>
      )}

      {([1, 2] as const).map((p) => (
        <section key={p} aria-labelledby={`part-${p}`} className="space-y-3">
          <div>
            <h2 id={`part-${p}`} className="text-xl font-bold">{PARTS[p].titleBn}</h2>
            <p className="text-muted">{PARTS[p].subtitleBn}</p>
          </div>
          <ol className="space-y-3">
            {PARTS[p].modules.map((m) => (
              <li key={m.module}>
                <ModuleCard m={m} state={moduleState(m, data)} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
