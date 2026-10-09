import { lazy, Suspense, useCallback, useMemo, useRef, useState, type ComponentProps } from 'react'
import type { Chapter, LegacyLesson as Lesson, OsFlavor, Step } from '../../engine/types'
import { stepsFor } from '../../engine/runner'
import { useGuidedRun } from '../../engine/coach/useGuidedRun'
import { CoachOverlay } from '../../engine/coach/CoachOverlay'
import { SimBus } from '../../sim/bus'
import { store, useProgress } from '../../state/store'
import { useFmt } from '../../ui/useFmt'
import { SmallScreenNote } from '../../ui/SmallScreenNote'

// The simulator (desktops, apps, runner glue) is loaded only when a practice section is opened.
const SimStageLazy = lazy(() => import('../../sim/SimStage').then((m) => ({ default: m.SimStage })))
function SimStage(props: ComponentProps<typeof SimStageLazy>) {
  return (
    <div className="space-y-3">
      <SmallScreenNote />
      <Suspense fallback={<p role="status" className="card text-muted">কম্পিউটারটি সাজানো হচ্ছে… একটু অপেক্ষা করুন।</p>}>
        <SimStageLazy {...props} />
      </Suspense>
    </div>
  )
}

/** Guided practice: the simulator with the coach pointing at each step. */
export function GuidedPractice({ lesson, os, alreadyDone, onFinished }: { lesson: Lesson; os: OsFlavor; alreadyDone: boolean; onFinished: () => void }) {
  const chapters = lesson.chapters?.filter((c) => stepsFor(c.steps, os).length > 0)
  const [chapterId, setChapterId] = useState<string | null>(null)
  const progress = useProgress().modules[lesson.module]
  if (chapters && chapters.length > 0) {
    const chapter = chapters.find((c) => c.id === chapterId)
    if (!chapter) {
      return (
        <div className="space-y-3">
          <p>এই পাঠে কয়েকটি ছোট অংশ আছে। একটি একটি করে করুন — যেকোনো ক্রমে করা যায়, তবে ওপর থেকে নিচে করাই ভালো।</p>
          <ol className="space-y-3">
            {chapters.map((c, i) => {
              const cs = stepsFor(c.steps, os)
              const done = cs.every((s) => progress?.stepsDone[os].includes(s.id))
              return (
                <li key={c.id} className="card flex flex-wrap items-center gap-3">
                  <span aria-hidden="true" className="text-2xl">{done ? '✅' : '▶️'}</span>
                  <span className="flex-1">
                    <span className="block font-bold">
                      অংশ {i + 1}: {c.titleBn}
                    </span>
                    {c.introBn && <span className="block text-sm text-muted">{c.introBn}</span>}
                  </span>
                  <button className="btn" onClick={() => setChapterId(c.id)}>
                    {done ? 'আবার করি' : 'শুরু করি'}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )
    }
    return (
      <div className="space-y-3">
        <button className="btn btn-outline" onClick={() => setChapterId(null)}>
          ← সব অংশ
        </button>
        <h3 className="text-lg font-bold">{chapter.titleBn}</h3>
        <GuidedRunner key={`${chapter.id}-${os}`} lesson={lesson} os={os} steps={chapter.steps} chapter={chapter} alreadyDone={chapter.steps.length > 0 && stepsFor(chapter.steps, os).every((s) => progress?.stepsDone[os].includes(s.id))} onFinished={() => {}} />
      </div>
    )
  }
  return <GuidedRunner lesson={lesson} os={os} steps={lesson.steps} alreadyDone={alreadyDone} onFinished={onFinished} />
}

function GuidedRunner({ lesson, os, steps: allSteps, chapter, alreadyDone, onFinished }: { lesson: Lesson; os: OsFlavor; steps: Step[]; chapter?: Chapter; alreadyDone: boolean; onFinished: () => void }) {
  const bus = useMemo(() => new SimBus(), [lesson.module, os, chapter?.id])
  const steps = useMemo(() => stepsFor(allSteps, os), [allSteps, os])
  const setup = chapter?.setup ?? lesson.setup
  const checklist = chapter?.checklist ?? (chapter ? undefined : lesson.checklist)
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
          <div className="flex items-center gap-3">
            <div role="progressbar" aria-label="ধাপের অগ্রগতি" aria-valuetext={`${n(run.state.done.length)} / ${n(steps.length)} ধাপ শেষ`} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={run.state.done.length} className="h-3 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--c-sunken)' }}>
              <div className="h-full" style={{ width: `${(run.state.done.length / steps.length) * 100}%`, background: 'var(--c-brand)' }} />
            </div>
            <span className="text-sm">
              {n(run.state.done.length)} / {n(steps.length)}
            </span>
          </div>
          {checklist && (
            <ul className="card space-y-1" aria-label="কাজের তালিকা">
              {checklist.map((c) => {
                const done = c.stepIds.every((id) => run.state.done.includes(id) || steps.every((s) => s.id !== id))
                return (
                  <li key={c.id} className="flex items-start gap-2">
                    <span aria-hidden="true">{done ? '✅' : '⬜'}</span>
                    <span className={done ? 'text-muted line-through' : ''}>{c.textBn}</span>
                    <span className="sr-only">{done ? '(হয়ে গেছে)' : '(বাকি)'}</span>
                  </li>
                )
              })}
            </ul>
          )}
          {finished && (
            <div className="card space-y-2" role="status" style={{ background: 'var(--c-ok-soft)' }}>
              <p className="text-lg font-bold">🎉 সব ধাপ শেষ! খুব ভালো করেছেন।</p>
              <p>এবার ওপরের “নিজে করুন” অংশে গিয়ে নিজের মতো চেষ্টা করতে পারেন।</p>
            </div>
          )}
          <div ref={wrapperRef} className="relative">
            <SimStage key={`${os}`} os={os} bus={bus} onReset={onReset} setup={setup} defaultPadOpen={steps.some((s) => s.expectedAction.type === 'keyCombo')} />
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
      <SimStage key={os} os={os} bus={bus} setup={lesson.setup} />
    </div>
  )
}
