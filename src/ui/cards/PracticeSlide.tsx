import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react'
import type { InputKind, Lesson, OsFlavor, Step, Unit } from '../../engine/types'
import { useGuidedRun } from '../../engine/coach/useGuidedRun'
import { CoachOverlay } from '../../engine/coach/CoachOverlay'
import { SimBus } from '../../sim/bus'
import { XP } from '../../state/gamification'
import { store } from '../../state/store'
import { useFmt } from '../useFmt'
import { SmallScreenNote } from '../SmallScreenNote'

// The simulator (desktops, apps, runner glue) is loaded only when a practice slide is opened.
const SimStageLazy = lazy(() => import('../../sim/SimStage').then((m) => ({ default: m.SimStage })))
export function SimStage(props: ComponentProps<typeof SimStageLazy>) {
  return (
    <Suspense fallback={<p role="status" className="card text-muted">কম্পিউটারটি সাজানো হচ্ছে… একটু অপেক্ষা করুন।</p>}>
      <SimStageLazy {...props} />
    </Suspense>
  )
}

interface Props {
  lesson: Lesson
  unit: Unit
  steps: Step[]
  os: OsFlavor
  input: InputKind
  /** the practice was finished earlier (replaying a finished unit) */
  alreadyDone: boolean
  /** every step is done: enables the deck's primary button */
  onFinished: () => void
}

/** Guided practice: a short step bar + the simulated computer with the coach pointing at each step. Then a quiet "ফ্রি প্র্যাকটিস" sandbox. */
export function PracticeSlide({ lesson, unit, steps, os, alreadyDone, onFinished }: Props) {
  const { n } = useFmt()
  const module = lesson.module
  const [free, setFree] = useState(false)
  const bus = useMemo(() => new SimBus(), [module, unit.id, os, free])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const run = useGuidedRun({
    steps,
    bus,
    os,
    enabled: !free,
    onStepDone: (s) => {
      const known = store.getSnapshot().modules[module]?.stepsDone[os].includes(s.id)
      store.markStepDone(module, os, s.id)
      if (!known) store.addXp(XP.step)
    },
    onFinished,
  })
  const finished = run.state.finished
  const onReset = useCallback(() => run.reset(), [run])
  useEffect(() => {
    if (free) store.markFreePracticeDone(module)
  }, [free, module])

  const doneCount = run.state.done.length
  const checklist = unit.checklist

  return (
    <div className="deck-practice" data-testid="deck-practice">
      <div className="flex flex-none items-center gap-3">
        <h2 className="m-0 text-base font-bold" data-deck-focus="" tabIndex={-1}>
          {free ? 'ফ্রি প্র্যাকটিস' : 'হাতে-কলমে'}
        </h2>
        {!free && (
          <>
            <div
              className="deck-steps"
              role="progressbar"
              aria-label="ধাপের অগ্রগতি"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={doneCount}
              aria-valuetext={`${n(doneCount)} / ${n(steps.length)} ধাপ শেষ`}
            >
              {steps.map((s, i) => (
                <span key={s.id} data-done={run.state.done.includes(s.id)} data-current={!finished && i === run.state.index} />
              ))}
            </div>
            <span className="text-sm font-semibold" aria-hidden="true">
              {n(doneCount)}/{n(steps.length)}
            </span>
          </>
        )}
        {free && (
          <>
            <p className="m-0 flex-1 text-sm text-muted">{unit.freeTryBn ?? 'যা খুশি করে দেখুন — কিছুই নষ্ট হবে না।'}</p>
            <button type="button" className="btn btn-outline" onClick={() => {
                if (!finished) run.reset()
                setFree(false)
              }}>
              ← ফিরি
            </button>
          </>
        )}
      </div>

      {!free && checklist && checklist.length > 0 && (
        <ul className="m-0 flex flex-none list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm" aria-label="কাজের তালিকা">
          {checklist.map((c) => {
            const done = c.stepIds.every((id) => run.state.done.includes(id) || steps.every((s) => s.id !== id))
            return (
              <li key={c.id} className={done ? 'text-muted line-through' : ''}>
                <span aria-hidden="true">{done ? '✅' : '⬜'}</span> {c.textBn}
                <span className="sr-only">{done ? ' (হয়ে গেছে)' : ' (বাকি)'}</span>
              </li>
            )
          })}
        </ul>
      )}

      <SmallScreenNote />

      {!free && (finished || alreadyDone) && (
        <div className="deck-success" role="status" data-testid="practice-success">
          <span className="text-lg font-bold" style={{ color: 'var(--c-ok)' }}>
            {finished ? '🎉 সব ধাপ শেষ! দারুণ।' : '✓ এটা আগেই করেছেন।'}
          </span>
          <span className="flex-1" />
          <button type="button" className="btn btn-outline" data-testid="free-practice" onClick={() => setFree(true)}>
            ফ্রি প্র্যাকটিস
          </button>
        </div>
      )}

      <div ref={wrapperRef} className="deck-sim">
        <SimStage key={`${os}-${free}`} os={os} bus={bus} onReset={onReset} setup={unit.setup} defaultPadOpen={steps.some((s) => s.expectedAction.type === 'keyCombo')} />
        {!free && !finished && <CoachOverlay run={run} os={os} wrapperRef={wrapperRef} />}
      </div>
    </div>
  )
}
