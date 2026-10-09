import { useState } from 'react'
import type { QuizQuestion } from '../../engine/types'
import { useFmt } from '../useFmt'
import { ClickTargetView, DragMatchView, MultipleChoiceView, OrderingView, PredictOutputView } from '../quiz/DeckQuestions'
import { InFooter, PrimaryButton } from './DeckFooter'

const CHEERS = ['ঠিক ধরেছেন!', 'দারুণ!', 'একদম ঠিক!', 'বাহ, ঠিক!', 'চমৎকার!']

interface Props {
  question: QuizQuestion
  position: number
  total: number
  /** wrong attempts she already made on this question (restored progress) */
  wrongBefore: number
  /** answered correctly before (going back to a finished question) */
  done: boolean
  /** correct answer: `wrong` = wrong tries before it */
  onCorrect: (wrong: number) => void
  onWrong: (wrong: number) => void
  onNext: () => void
}

/** One question per screen: big answer cards, instant gentle feedback, retry on a wrong answer (never a harsh red). */
export function QuizSlide({ question: q, position, total, wrongBefore, done, onCorrect, onWrong, onNext }: Props) {
  const { n } = useFmt()
  const [wrong, setWrong] = useState(wrongBefore)
  const [state, setState] = useState<'asking' | 'wrong' | 'right'>(done ? 'right' : 'asking')
  const answer = (correct: boolean) => {
    if (correct) {
      setState('right')
      onCorrect(wrong)
    } else {
      const w = wrong + 1
      setWrong(w)
      setState('wrong')
      onWrong(w)
    }
  }
  const locked = state === 'right'
  const common = { locked, onAnswer: answer }
  return (
    <>
      <div className="deck-body" data-testid="deck-quiz" data-qtype={q.type}>
        <span className="deck-qcount">
          প্রশ্ন {n(position)} / {n(total)}
        </span>
        <h2 className="deck-question" data-deck-focus="" tabIndex={-1} data-testid="deck-question">
          {q.questionBn}
        </h2>
        {q.type === 'multipleChoice' && <MultipleChoiceView q={q} {...common} />}
        {q.type === 'clickTarget' && <ClickTargetView q={q} {...common} />}
        {q.type === 'dragMatch' && <DragMatchView q={q} {...common} />}
        {q.type === 'ordering' && <OrderingView q={q} {...common} />}
        {q.type === 'predictOutput' && <PredictOutputView q={q} {...common} />}
        <div aria-live="polite" aria-atomic="true">
          {state === 'wrong' && (
            <div className="deck-feedback" data-kind="wrong" data-testid="quiz-wrong">
              <p className="font-bold">একটু আবার ভেবে দেখি 🙂</p>
              <p>{q.hintBn}</p>
            </div>
          )}
          {state === 'right' && (
            <div className="deck-feedback" data-kind="right" data-testid="quiz-right">
              <p className="font-bold" style={{ color: 'var(--c-ok)' }}>
                ✓ {CHEERS[(position + wrong) % CHEERS.length]}
              </p>
              <p>{q.explanationBn}</p>
            </div>
          )}
        </div>
      </div>
      {state === 'right' && (
        <InFooter>
          <PrimaryButton label="পরের ধাপ →" onClick={onNext} autoFocus />
        </InFooter>
      )}
    </>
  )
}
