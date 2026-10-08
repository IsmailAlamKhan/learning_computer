import { useCallback, useMemo, useRef, useState } from 'react'
import type { Lesson, OsFlavor } from '../../engine/types'
import { stepsFor } from '../../engine/runner'
import { useGuidedRun } from '../../engine/coach/useGuidedRun'
import { CoachOverlay } from '../../engine/coach/CoachOverlay'
import { SimStage } from '../../sim/SimStage'
import { SimBus } from '../../sim/bus'
import { store } from '../../state/store'
import { useFmt } from '../../ui/useFmt'

/** Guided practice: the simulator with the coach pointing at each step. */
export function GuidedPractice({ lesson, os, alreadyDone, onFinished }: { lesson: Lesson; os: OsFlavor; alreadyDone: boolean; onFinished: () => void }) {
  const bus = useMemo(() => new SimBus(), [lesson.module, os])
  const steps = useMemo(() => stepsFor(lesson.steps, os), [lesson, os])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { n } = useFmt()
  const [started, setStarted] = useState(false)
  const run = useGuidedRun({
    steps,
    bus,
    os,
    enabled: started,
    onStepDone: (s) => store.markStepDone(lesson.module, os, s.id),
    onFinished,
  })
  const finished = run.state.finished
  const onReset = useCallback(() => run.reset(), [run])

  if (steps.length === 0) return <p>এই পাঠে ধাপে ধাপে অনুশীলন নেই।</p>

  return (
    <div className="space-y-3">
      {!started ? (
        <div className="card space-y-3">
          <p>
            এবার নকল কম্পিউটারে হাতে-কলমে করব। মোট {n(steps.length)}টি ধাপ। প্রতিটি ধাপে একটি চিহ্ন দেখাবে কোথায় করতে হবে — সঠিক কাজটি করলে তবেই পরের ধাপে যাবে।
          </p>
          {alreadyDone && <p className="rounded-xl p-3" style={{ background: 'var(--c-ok-soft)' }}>✓ আপনি আগেই এই অংশ শেষ করেছেন। চাইলে আবার অনুশীলন করতে পারেন।</p>}
          <button className="btn btn-lg" onClick={() => setStarted(true)}>
            ▶ শুরু করি
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3" aria-label="ধাপের অগ্রগতি">
            <div role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={run.state.done.length} className="h-3 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--c-sunken)' }}>
              <div className="h-full" style={{ width: `${(run.state.done.length / steps.length) * 100}%`, background: 'var(--c-brand)' }} />
            </div>
            <span className="text-sm">
              {n(run.state.done.length)} / {n(steps.length)}
            </span>
          </div>
          {finished && (
            <div className="card space-y-2" role="status" style={{ background: 'var(--c-ok-soft)' }}>
              <p className="text-lg font-bold">🎉 সব ধাপ শেষ! খুব ভালো করেছেন।</p>
              <p>এবার ওপরের “নিজে করুন” অংশে গিয়ে নিজের মতো চেষ্টা করতে পারেন।</p>
            </div>
          )}
          <div ref={wrapperRef} className="relative">
            <SimStage key={`${os}`} os={os} bus={bus} onReset={onReset} />
            {!finished && <CoachOverlay run={run} os={os} wrapperRef={wrapperRef} />}
          </div>
        </>
      )}
    </div>
  )
}

/** Free sandbox: no instructions, just a safe computer and a self-tick checklist. */
export function FreePracticeSection({ lesson, os, onDone, done }: { lesson: Lesson; os: OsFlavor; onDone: () => void; done: boolean }) {
  const bus = useMemo(() => new SimBus(), [lesson.module, os])
  const fp = lesson.freePractice
  const [ticks, setTicks] = useState<boolean[]>([])
  if (!fp) return <p>এই পাঠে আলাদা মুক্ত অনুশীলন নেই।</p>
  return (
    <div className="space-y-3">
      <div className="card space-y-3">
        <h3 className="text-lg font-bold">{fp.titleBn}</h3>
        <p>{fp.instructionBn}</p>
        {fp.checklistBn && (
          <ul className="space-y-1">
            {fp.checklistBn.map((t, i) => (
              <li key={i}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3">
                  <input type="checkbox" className="h-6 w-6 accent-[var(--c-brand)]" checked={!!ticks[i]} onChange={(e) => setTicks((x) => Object.assign([...x], { [i]: e.target.checked }))} />
                  <span>{t}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <button className="btn" disabled={done} onClick={onDone}>
          {done ? '✓ করা হয়েছে' : 'আমার অনুশীলন হয়েছে'}
        </button>
      </div>
      <SimStage key={os} os={os} bus={bus} />
    </div>
  )
}
