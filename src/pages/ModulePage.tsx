import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getModule } from '../content/modules'
import { hasLesson, loadLesson } from '../content/lessons'
import { moduleState } from '../engine/roadmap'
import { stepsFor } from '../engine/runner'
import type { Lesson, OsFlavor } from '../engine/types'
import { store, useProgress } from '../state/store'
import { QuizRunner } from '../ui/quiz/QuizRunner'
import { useFmt } from '../ui/useFmt'
import { ExplanationSection, RealWorldSection, SummarySection, TeacherTip, osQuiz } from './lesson/Sections'
import { FreePracticeSection, GuidedPractice } from './lesson/Practice'

type SectionId = 'learn' | 'guided' | 'free' | 'quiz' | 'summary' | 'real' | 'finish'
const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'learn', label: '১ জানুন' },
  { id: 'guided', label: '২ হাতে-কলমে' },
  { id: 'free', label: '৩ নিজে করুন' },
  { id: 'quiz', label: '৪ কুইজ' },
  { id: 'summary', label: '৫ মনে রাখুন' },
  { id: 'real', label: '৬ আসল কম্পিউটারে' },
  { id: 'finish', label: '৭ শেষ' },
]

function Soon({ n }: { n: number }) {
  const m = getModule(n)!
  const { n: f } = useFmt()
  const data = useProgress()
  const locked = moduleState(m, data) === 'locked'
  return (
    <div className="card space-y-4">
      <p className="text-muted">পাঠ {f(m.module)}</p>
      <h1 className="text-2xl font-bold">
        {m.icon} {m.titleBn}
      </h1>
      <p>{m.oneLineBn}</p>
      <p className="rounded-xl p-4" style={{ background: 'var(--c-accent-soft)' }}>
        {locked ? 'আগের পাঠটি শেষ করলে এটি খুলবে।' : 'এই পাঠটি শীঘ্রই আসছে।'}
      </p>
      <Link to="/" className="btn btn-outline">
        ← হোমে ফিরুন
      </Link>
    </div>
  )
}

export default function ModulePage() {
  const { id } = useParams()
  const n = Number(id)
  const m = getModule(n)
  const data = useProgress()
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined)

  useEffect(() => {
    setLesson(undefined)
    if (!m || !hasLesson(n)) return setLesson(null)
    let alive = true
    loadLesson(n).then((l) => alive && setLesson(l))
    return () => {
      alive = false
    }
  }, [n, m])

  useEffect(() => {
    if (m && hasLesson(n)) store.visitModule(n)
  }, [n, m])

  if (!m) {
    return (
      <div className="card space-y-3">
        <h1 className="text-xl font-bold">এই পাঠটি খুঁজে পাওয়া যায়নি</h1>
        <Link to="/" className="btn">
          ← হোমে ফিরুন
        </Link>
      </div>
    )
  }
  const state = moduleState(m, data)
  if (lesson === undefined) return <p>পাঠ লোড হচ্ছে…</p>
  if (lesson === null || state === 'locked' || state === 'soon') return <Soon n={n} />
  return <LessonView key={n} lesson={lesson} />
}

function LessonView({ lesson }: { lesson: Lesson }) {
  const data = useProgress()
  const { n } = useFmt()
  const mod = lesson.module
  const prog = data.modules[mod]
  const [os, setOs] = useState<OsFlavor>(data.profile.os)
  const [sec, setSec] = useState<SectionId>('learn')
  const steps = stepsFor(lesson.steps, os)
  const stepsDone = steps.length === 0 || steps.every((s) => prog?.stepsDone[os].includes(s.id))
  const quizDone = osQuiz(lesson, os).length === 0 || !!prog?.quiz
  const canComplete = stepsDone && quizDone
  const idx = SECTIONS.findIndex((s) => s.id === sec)
  const doneMap: Record<SectionId, boolean> = {
    learn: !!prog?.explanationRead,
    guided: stepsDone && steps.length > 0,
    free: !!prog?.freePracticeDone,
    quiz: !!prog?.quiz,
    summary: false,
    real: (prog?.realWorldChecked.length ?? 0) > 0,
    finish: !!prog?.completed,
  }
  const go = (s: SectionId) => {
    setSec(s)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/" className="text-sm underline">
          ← হোম
        </Link>
        <p className="mt-2 text-muted">
          পাঠ {n(mod)} · প্রায় {n(lesson.minutes)} মিনিট
        </p>
        <h1 className="text-2xl font-bold">{lesson.titleBn}</h1>
        <p className="text-muted">{lesson.oneLineBn}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">কোন কম্পিউটারে দেখতে চান</legend>
          <span className="text-sm text-muted">দেখুন:</span>
          {(['windows', 'mac'] as const).map((o) => (
            <button key={o} className={`btn ${os === o ? '' : 'btn-outline'}`} aria-pressed={os === o} onClick={() => setOs(o)}>
              {o === 'windows' ? 'Windows' : 'Mac'}
            </button>
          ))}
        </fieldset>
      </div>

      <nav aria-label="পাঠের অংশ" className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button key={s.id} aria-current={s.id === sec ? 'step' : undefined} onClick={() => go(s.id)} className={`btn ${s.id === sec ? '' : 'btn-outline'}`}>
            {doneMap[s.id] && <span aria-label="সম্পন্ন">✓</span>} {s.label}
          </button>
        ))}
      </nav>

      <section aria-label={SECTIONS[idx].label} className="space-y-4">
        {sec === 'learn' && <ExplanationSection lesson={lesson} module={mod} />}
        {sec === 'guided' && <GuidedPractice key={os} lesson={lesson} os={os} alreadyDone={stepsDone && steps.length > 0} onFinished={() => {}} />}
        {sec === 'free' && <FreePracticeSection key={os} lesson={lesson} os={os} done={!!prog?.freePracticeDone} onDone={() => store.markFreePracticeDone(mod)} />}
        {sec === 'quiz' && (
          <QuizRunner
            questions={lesson.quiz}
            os={os}
            previous={prog?.quiz ? { score: prog.quiz.score, total: prog.quiz.total } : undefined}
            onFinish={(s) => store.recordQuiz(mod, s)}
          />
        )}
        {sec === 'summary' && <SummarySection lesson={lesson} />}
        {sec === 'real' && <RealWorldSection lesson={lesson} os={os} progress={prog} module={mod} />}
        {sec === 'finish' && (
          <div className="space-y-4">
            <TeacherTip text={lesson.teacherTipBn} />
            {prog?.completed ? (
              <div className="card space-y-2" style={{ background: 'var(--c-ok-soft)' }}>
                <p className="text-lg font-bold">🎉 এই পাঠ সম্পন্ন হয়েছে!</p>
                {lesson.certificatePart && (
                  <Link to={`/certificate/${lesson.certificatePart}`} className="btn btn-lg">
                    🏆 আপনার সনদপত্র দেখুন ও ছাপুন
                  </Link>
                )}
                <Link to="/" className="btn btn-outline">
                  হোমে ফিরে পরের পাঠ দেখুন
                </Link>
              </div>
            ) : (
              <div className="card space-y-3">
                {canComplete ? (
                  <p>সবকিছু হয়ে গেছে। এবার পাঠটি সম্পন্ন করুন।</p>
                ) : (
                  <p>
                    পাঠটি সম্পন্ন করতে বাকি আছে:
                    {!stepsDone && ' “২ হাতে-কলমে” অংশের সব ধাপ।'}
                    {!quizDone && ' “৪ কুইজ” অংশটি একবার শেষ করা।'}
                  </p>
                )}
                <button
                  className="btn btn-lg"
                  disabled={!canComplete}
                  onClick={() => {
                    store.completeModule(mod)
                    if (lesson.certificatePart) store.addCertificate(lesson.certificatePart)
                  }}
                >
                  ✓ পাঠ সম্পন্ন করি
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="flex justify-between gap-3">
        <button className="btn btn-outline" disabled={idx === 0} onClick={() => go(SECTIONS[idx - 1].id)}>
          ← আগের অংশ
        </button>
        <button className="btn" disabled={idx === SECTIONS.length - 1} onClick={() => go(SECTIONS[idx + 1].id)}>
          পরের অংশ →
        </button>
      </div>
    </div>
  )
}
