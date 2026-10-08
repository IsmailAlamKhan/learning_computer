import { useEffect, useMemo, useRef, useState } from 'react'
import type { OsFlavor, QuizQuestion } from '../../engine/types'
import { filterByOs } from '../../engine/filter'
import { scoreQuiz, type QuizScore } from '../../engine/quiz'
import { ClickTargetView, DragMatchView, MultipleChoiceView, OrderingView, PredictOutputView } from './QuestionViews'
import { useFmt } from '../useFmt'

interface Props {
  questions: QuizQuestion[]
  os: OsFlavor
  onFinish: (score: QuizScore) => void
  /** if she has taken it before, show the earlier result */
  previous?: { score: number; total: number }
}

const CLOSERS = [
  'খুব ভালো করেছেন!',
  'কুইজ শেষ — দারুণ চেষ্টা!',
  'চমৎকার, শেষ পর্যন্ত গেছেন!',
]

/** Runs a quiz: one question at a time, gentle hints on a wrong answer, explanation after the right one. */
export function QuizRunner({ questions, os, onFinish, previous }: Props) {
  const qs = useMemo(() => filterByOs(questions, os), [questions, os])
  const [i, setI] = useState(0)
  const [wrong, setWrong] = useState<Record<string, number>>({})
  const [state, setState] = useState<'asking' | 'wrong' | 'right'>('asking')
  const [done, setDone] = useState<QuizScore | null>(null)
  const { n } = useFmt()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const moved = useRef(false)

  // Keyboard users: after the answer is checked or the question changes the old control is gone, so move focus somewhere sensible.
  useEffect(() => {
    if (!moved.current) return
    if (state === 'wrong') feedbackRef.current?.focus({ preventScroll: false })
    if (state === 'right') nextRef.current?.focus({ preventScroll: false })
  }, [state, wrong])
  useEffect(() => {
    if (!moved.current) return
    headingRef.current?.focus()
  }, [i])

  useEffect(() => {
    setI(0)
    setWrong({})
    setState('asking')
    setDone(null)
  }, [qs])

  if (qs.length === 0) return <p>এই পাঠে কোনো কুইজ নেই।</p>

  if (done) {
    return (
      <div className="card space-y-3" role="status">
        <h3 className="text-xl font-bold">{CLOSERS[done.score % CLOSERS.length]}</h3>
        <p>
          আপনি {n(done.total)}টির মধ্যে {n(done.score)}টি প্রথমবারেই ঠিক করেছেন।
          {done.score < done.total && ' যেগুলো একটু আটকেছিল, সেগুলো আবার দেখলে আরও পাকা হবে — এটাই শেখার নিয়ম।'}
        </p>
        <button
          className="btn btn-outline"
          onClick={() => {
            setI(0)
            setWrong({})
            setState('asking')
            setDone(null)
          }}
        >
          ↺ আবার করি
        </button>
      </div>
    )
  }

  const q = qs[i]
  const answer = (correct: boolean) => {
    moved.current = true
    if (correct) setState('right')
    else {
      setWrong((w) => ({ ...w, [q.id]: (w[q.id] ?? 0) + 1 }))
      setState('wrong')
    }
  }
  const next = () => {
    if (i + 1 >= qs.length) {
      const s = scoreQuiz(qs.map((x) => x.id), wrong)
      setDone(s)
      onFinish(s)
    } else {
      setI(i + 1)
      setState('asking')
    }
  }
  const locked = state === 'right'
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted" aria-live="polite">
        প্রশ্ন {n(i + 1)} / {n(qs.length)}
        {previous ? ` · আগের বার: ${n(previous.score)}/${n(previous.total)}` : ''}
      </p>
      <h3 ref={headingRef} tabIndex={-1} className="text-xl font-bold">{q.questionBn}</h3>
      <div key={`${q.id}-${wrong[q.id] ?? 0}`}>
        {q.type === 'multipleChoice' && <MultipleChoiceView q={q} onAnswer={answer} locked={locked} />}
        {q.type === 'clickTarget' && <ClickTargetView q={q} onAnswer={answer} locked={locked} />}
        {q.type === 'dragMatch' && <DragMatchView q={q} onAnswer={answer} locked={locked} />}
        {q.type === 'ordering' && <OrderingView q={q} onAnswer={answer} locked={locked} />}
        {q.type === 'predictOutput' && <PredictOutputView q={q} onAnswer={answer} locked={locked} />}
      </div>
      <div aria-live="polite" aria-atomic="true">
        {state === 'wrong' && (
          <div ref={feedbackRef} tabIndex={-1} className="rounded-xl p-4" style={{ background: 'var(--c-accent-soft)' }}>
            <p className="font-bold">একটু আবার ভেবে দেখি 🙂</p>
            <p>{q.hintBn}</p>
            <p className="text-sm text-muted">ভুল হওয়া খুবই স্বাভাবিক। আবার চেষ্টা করুন।</p>
          </div>
        )}
        {state === 'right' && (
          <div className="space-y-3 rounded-xl p-4" style={{ background: 'var(--c-ok-soft)' }}>
            <p className="font-bold" style={{ color: 'var(--c-ok)' }}>✓ ঠিক উত্তর!</p>
            <p>{q.explanationBn}</p>
            <button ref={nextRef} className="btn" onClick={next}>
              {i + 1 >= qs.length ? 'কুইজ শেষ করি' : 'পরের প্রশ্ন →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
