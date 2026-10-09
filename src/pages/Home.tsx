import { Link } from 'react-router-dom'
import { MODULES, PARTS } from '../content/modules'
import { moduleArt } from '../content/moduleArt'
import { completedCount, moduleState, todaysModule, type ModuleState } from '../engine/roadmap'
import type { ProgressData } from '../state/progress'
import { dayKey, streakAlive } from '../state/gamification'
import { useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'
import { ArtView } from '../ui/illustrations/ArtView'
import { dailyRing, ringOffset } from '../lib/dailyGoal'
import type { ModuleMeta } from '../engine/types'

/** Where to continue: the module she touched most recently that isn't finished, otherwise the first open one. */
export function continueModule(data: ProgressData): ModuleMeta | undefined {
  const open = MODULES.filter((m) => moduleState(m, data) === 'unlocked')
  const visited = open
    .filter((m) => data.modules[m.module]?.lastVisitedAt)
    .sort((a, b) => (data.modules[b.module]!.lastVisitedAt! > data.modules[a.module]!.lastVisitedAt! ? 1 : -1))
  return visited[0] ?? todaysModule(data)
}

const NODE_X = [0, 44, 88, 44, 0, 44, 88, 44] // px offset of the node centre pattern: a gentle S-curve
const NODE = 96
const ROW = 132

function PathNode({ m, state, offset }: { m: ModuleMeta; state: ModuleState; offset: number }) {
  const { n } = useFmt()
  const clickable = state === 'unlocked' || state === 'completed'
  const stateLabel = { completed: 'সম্পন্ন', unlocked: 'এখন করুন', locked: 'তালা দেওয়া', soon: 'শীঘ্রই আসছে' }[state]
  const node = (
    <>
      <span className="node-art"><ArtView name={moduleArt(m.module)} size={62} tile={false} /></span>
      {state === 'completed' && <span className="node-badge" aria-hidden="true">✓</span>}
      {(state === 'locked' || state === 'soon') && <span className="node-badge" data-kind="lock" aria-hidden="true">{state === 'soon' ? '⏳' : '🔒'}</span>}
    </>
  )
  const aria = `পাঠ ${n(m.module)}: ${m.titleBn}, ${stateLabel}`
  return (
    <div className="path-row" style={{ minHeight: ROW, paddingLeft: offset }} data-testid={`path-row-${m.module}`}>
      {clickable ? (
        <Link to={`/module/${m.module}`} className="path-node" data-state={state} aria-label={aria} style={{ width: NODE, height: NODE }}>
          {node}
        </Link>
      ) : (
        <div className="path-node" data-state={state} role="img" aria-label={aria} style={{ width: NODE, height: NODE }}>
          {node}
        </div>
      )}
      <div className="path-label" aria-hidden="true">
        <p className="text-sm font-medium text-muted">পাঠ {n(m.module)}</p>
        <p className={`line-clamp-3 font-bold leading-snug ${clickable ? '' : 'text-muted'}`}>{m.titleBn}</p>
      </div>
    </div>
  )
}

function Connector({ from, to, done }: { from: number; to: number; done: boolean }) {
  const x1 = from + NODE / 2
  const x2 = to + NODE / 2
  const left = Math.min(x1, x2) - 4
  const w = Math.abs(x2 - x1) + 8
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute" style={{ left, top: '50%', width: w, height: '100%', zIndex: 0 }} viewBox={`0 0 ${w} 100`} preserveAspectRatio="none">
      <path d={`M ${x1 - left} 0 C ${x1 - left} 55, ${x2 - left} 45, ${x2 - left} 100`} fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 14" vectorEffect="non-scaling-stroke" stroke={done ? 'var(--c-ok)' : 'var(--c-line)'} />
    </svg>
  )
}

function DailyGoalCard() {
  const { daily, settings, streak } = useProgress()
  const { n } = useFmt()
  const r = dailyRing(daily, settings.dailyGoal)
  const alive = streakAlive(streak, dayKey())
  const R = 38
  const C = 2 * Math.PI * R
  return (
    <section className="card flex items-center gap-5" aria-labelledby="daily-h" data-testid="daily-goal">
      <div className="relative h-24 w-24 flex-none">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90" role="progressbar" aria-label="আজকের লক্ষ্য" aria-valuemin={0} aria-valuemax={r.goal} aria-valuenow={Math.min(r.done, r.goal)}>
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="10" className="ring-track" />
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="10" strokeLinecap="round" className="ring-bar" strokeDasharray={C} strokeDashoffset={ringOffset(r.fraction, R)} style={r.reached ? { stroke: 'var(--c-ok)' } : undefined} />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xl font-extrabold">
          {r.reached ? '✓' : `${n(r.done)}/${n(r.goal)}`}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h2 id="daily-h" className="t-heading">আজকের লক্ষ্য</h2>
        <p className="text-muted">
          {r.reached ? 'আজকের লক্ষ্য পূর্ণ! দারুণ 🎉' : r.done === 0 ? `আজ ${n(r.goal)}টি ছোট পাঠ — পারবেন!` : `আর ${n(r.remaining)}টি বাকি, এগিয়ে যান!`}
        </p>
      </div>
      <div role="img" className="flex flex-none flex-col items-center leading-tight" aria-label={`টানা ${n(alive ? streak.count : 0)} দিন`}>
        <span aria-hidden="true" className="flame text-3xl" data-alive={alive}>🔥</span>
        <span aria-hidden="true" className="text-lg font-extrabold">{n(alive ? streak.count : 0)}</span>
      </div>
    </section>
  )
}

export default function Home() {
  const data = useProgress()
  const { n } = useFmt()
  const cont = continueModule(data)
  const done = completedCount(data)
  const firstTime = done === 0 && !MODULES.some((m) => data.modules[m.module]?.lastVisitedAt)
  const rows = MODULES.map((m, i) => ({ m, state: moduleState(m, data), offset: NODE_X[i % NODE_X.length] }))

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="t-title">স্বাগতম{data.profile.name ? `, ${data.profile.name}` : ''}! 🌸</h1>
        {data.profile.motivation && (
          <p className="text-muted">
            <q className="font-medium">{data.profile.motivation}</q>
          </p>
        )}
      </div>

      {cont ? (
        <section className="card flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left" style={{ background: 'var(--c-brand-soft)' }} aria-labelledby="cont-h" data-testid="continue-card">
          <div className="flex-none"><ArtView name={moduleArt(cont.module)} size={132} /></div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="font-bold" style={{ color: 'var(--c-brand)' }}>{firstTime ? 'শুরু করুন' : 'যেখানে ছিলেন'} · পাঠ {n(cont.module)}</p>
            <h2 id="cont-h" className="t-heading">{cont.titleBn}</h2>
            <Link to={`/module/${cont.module}`} className="btn btn-lg w-full sm:w-auto">
              {firstTime ? 'শুরু করি' : 'চালিয়ে যান'} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="card flex flex-col items-center gap-4 text-center" style={{ background: 'var(--c-brand-soft)' }}>
          <ArtView name="didi-cheer" size={120} />
          <h2 className="t-heading">সব চালু পাঠ শেষ!</h2>
          <Link to="/next-steps" className="btn btn-lg">এরপর কী? <span aria-hidden="true">→</span></Link>
        </section>
      )}

      <DailyGoalCard />

      {data.modules[20]?.completed && (
        <Link to="/next-steps" className="card card-flat flex items-center gap-4 hover:border-brand" data-testid="home-next-steps">
          <span aria-hidden="true" className="text-3xl">🚀</span>
          <span className="t-heading flex-1">এরপর কোথায় যাব</span>
          <span aria-hidden="true" className="text-2xl">→</span>
        </Link>
      )}

      <section aria-label="পাঠের পথ" className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="t-heading">আপনার পথ</h2>
          <span className="chip chip-brand" data-testid="home-progress">{n(done)} / {n(MODULES.length)} পাঠ</span>
        </div>
        <ol className="path-wrap list-none p-0">
          {rows.map(({ m, state, offset }, i) => {
            const next = rows[i + 1]
            const banner = i === 0 || rows[i - 1].m.part !== m.part
            return (
              <li key={m.module}>
                {banner && (
                  <div className="flex justify-center py-4">
                    <span className="part-banner" data-testid={`part-${m.part}`}>{PARTS[m.part].titleBn}</span>
                  </div>
                )}
                <div className="relative">
                  {next && next.m.part === m.part && <Connector from={offset} to={next.offset} done={state === 'completed'} />}
                  <PathNode m={m} state={state} offset={offset} />
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
