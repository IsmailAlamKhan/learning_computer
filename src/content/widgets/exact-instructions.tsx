import { useEffect, useRef, useState } from 'react'
import { DIR_NAME_BN, INSTR_LABEL_BN, LEVELS, runInstructions, type Dir, type Instr, type Pos, type RunResult } from './lib/exactInstructions'

const ARROW: Record<Dir, string> = { 0: '▲', 1: '▶', 2: '▼', 3: '◀' }
const STEP_MS = 550

/** “আক্ষরিক রোবট” — the robot does exactly what the list says, nothing more. No code, just clicking. */
export default function ExactInstructions() {
  const [levelIdx, setLevelIdx] = useState(0)
  const level = LEVELS[levelIdx]
  const [list, setList] = useState<Instr[]>([])
  const [result, setResult] = useState<RunResult | null>(null)
  const [shown, setShown] = useState(-1) // how many trace steps are already shown
  const [showSolution, setShowSolution] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }
  useEffect(() => stop, [])

  const reset = () => {
    stop()
    setResult(null)
    setShown(-1)
  }
  const edit = (next: Instr[]) => {
    reset()
    setList(next)
  }
  const chooseLevel = (i: number) => {
    reset()
    setList([])
    setShowSolution(false)
    setLevelIdx(i)
  }
  const run = () => {
    stop()
    const r = runInstructions(level, list)
    setResult(r)
    setShown(0)
    let n = 0
    timer.current = setInterval(() => {
      n += 1
      setShown(n)
      if (n >= r.trace.length) stop()
    }, STEP_MS)
    if (r.trace.length === 0) stop()
  }

  const finished = result !== null && shown >= result.trace.length
  const current = result && shown > 0 ? result.trace[Math.min(shown, result.trace.length) - 1] : null
  const pos: Pos = current ? current.pos : level.start
  const dir: Dir = current ? current.dir : level.startDir

  return (
    <div className="card space-y-3 p-4" data-testid="exact-instructions">
      <p className="font-semibold">🤖 আক্ষরিক রোবট — যা বলবেন, ঠিক তাই করবে</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="স্তর বেছে নিন">
        {LEVELS.map((l, i) => (
          <button key={l.id} type="button" className={`btn ${i === levelIdx ? '' : 'btn-outline'}`} aria-pressed={i === levelIdx} data-testid={`level-${i}`} onClick={() => chooseLevel(i)}>
            {i + 1}. {l.titleBn}
          </button>
        ))}
      </div>
      <p>{level.taskBn} রোবটটি এখন <strong>{DIR_NAME_BN[dir]}</strong> দিকে তাকিয়ে আছে (ছোট তিরচিহ্নে দেখুন)।</p>

      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 44px))` }}
        role="img"
        aria-label={`ছক। রোবট এখন ${pos.x + 1} নম্বর কলাম ও ${pos.y + 1} নম্বর সারিতে। পতাকা ${level.goal.x + 1} নম্বর কলাম ও ${level.goal.y + 1} নম্বর সারিতে।`}
        data-testid="robot-grid"
      >
        {Array.from({ length: level.size * level.size }, (_, i) => {
          const x = i % level.size
          const y = Math.floor(i / level.size)
          const isRobot = pos.x === x && pos.y === y
          const isGoal = level.goal.x === x && level.goal.y === y
          const isRock = level.rocks.some((r) => r.x === x && r.y === y)
          return (
            <div key={i} className="flex aspect-square items-center justify-center rounded border text-xl" style={{ borderColor: 'var(--c-border, #cbd5e1)', background: isGoal ? '#fef3c7' : isRock ? '#e5e7eb' : 'transparent' }}>
              {isRobot ? (
                <span data-testid="robot" data-x={x} data-y={y} data-dir={dir}>
                  🤖<span className="text-xs">{ARROW[dir]}</span>
                </span>
              ) : isGoal ? (
                '🚩'
              ) : isRock ? (
                '🪨'
              ) : null}
            </div>
          )
        })}
      </div>

      <div>
        <p className="mb-1 text-sm" style={{ color: 'var(--c-muted)' }}>নির্দেশ যোগ করুন (ওপর থেকে নিচে একটার পর একটা চলবে):</p>
        <div className="flex flex-wrap gap-2">
          {(['F', 'L', 'R', 'VAGUE'] as Instr[]).map((k) => (
            <button key={k} type="button" className="btn btn-outline" data-testid={`add-${k}`} onClick={() => edit([...list, k])}>
              {k === 'F' ? '⬆️ ' : k === 'L' ? '↰ ' : k === 'R' ? '↱ ' : '🤷 '}
              {INSTR_LABEL_BN[k]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 font-semibold">আপনার নির্দেশের তালিকা ({list.length}টি)</p>
        {list.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--c-muted)' }}>এখনো ফাঁকা। ওপরের বোতাম চেপে নির্দেশ যোগ করুন।</p>
        ) : (
          <ol className="space-y-1" data-testid="instr-list">
            {list.map((k, i) => {
              const t = result && i < shown ? result.trace[i] : null
              return (
                <li key={i} className="flex items-center gap-2 rounded border px-2 py-1" style={{ borderColor: t ? (t.problem ? '#dc2626' : '#16a34a') : 'var(--c-border, #cbd5e1)' }}>
                  <span className="w-6 text-right">{i + 1}.</span>
                  <span className="flex-1">{INSTR_LABEL_BN[k]}</span>
                  {t && <span className="text-sm" data-testid={`note-${i}`}>{t.noteBn}</span>}
                  <button type="button" className="btn btn-outline" aria-label={`${i + 1} নম্বর নির্দেশ মুছুন`} onClick={() => edit(list.filter((_, j) => j !== i))}>
                    ✕
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" data-testid="robot-run" onClick={run}>▶ চালাও</button>
        <button type="button" className="btn btn-outline" data-testid="robot-clear" onClick={() => edit([])}>সব মুছুন</button>
        <button type="button" className="btn btn-outline" data-testid="robot-solution-toggle" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? 'উত্তর লুকান' : 'আটকে গেলে: একটি সমাধান দেখুন'}
        </button>
      </div>

      {finished && result && (
        <div className="rounded-xl border-2 p-3" style={{ borderColor: result.outcome === 'reached' ? '#16a34a' : '#d97706' }} role="status" data-testid="robot-result" data-outcome={result.outcome}>
          {result.outcome === 'reached' ? '🎉 ' : '🤔 '}
          {result.messageBn}
        </div>
      )}
      {showSolution && (
        <p className="text-sm" data-testid="robot-solution">
          একটি সমাধান: {level.solution.map((k) => INSTR_LABEL_BN[k]).join(' → ')}
        </p>
      )}
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
        “🤷 ওই দিকে একটু যাও” বোতামটি চেপে দেখুন — মানুষ এমন কথা বুঝে নেয়, কম্পিউটার বোঝে না। প্রোগ্রামিং মানে এই “কত ঘর, কোন দিকে” পরিষ্কার করে বলতে শেখা।
      </p>
    </div>
  )
}
