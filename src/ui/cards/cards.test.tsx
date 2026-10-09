import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import type { QuizQuestion } from '../../engine/types'
import { Markup, plain } from './markup'
import { FooterSlotContext } from './DeckFooter'
import { QuizSlide } from './QuizSlide'

describe('Markup', () => {
  it('turns **word** into <strong> and leaves everything else as text (never raw HTML)', () => {
    const { container } = render(
      <p>
        <Markup text={'ওই নাম **ডেস্কটপ** আর **আইকন** — <img src=x onerror=alert(1)> **'} />
      </p>,
    )
    expect(container.querySelectorAll('strong.deck-em')).toHaveLength(2)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>')
    expect(plain('**ক** খ **গ**')).toBe('ক খ গ')
  })
})

const mc: QuizQuestion = {
  id: 'q',
  type: 'multipleChoice',
  questionBn: 'কোনটি ঠিক?',
  options: [
    { id: 'a', textBn: 'ভুল' },
    { id: 'b', textBn: 'ঠিক' },
  ],
  correct: ['b'],
  hintBn: 'আবার ভাবুন',
  explanationBn: 'ঠিক ধরেছেন',
}

function Harness(props: Partial<Parameters<typeof QuizSlide>[0]> & { onNext?: () => void }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null)
  return (
    <FooterSlotContext.Provider value={el}>
      <div id="footer" ref={setEl} />
      <QuizSlide question={mc} position={1} total={3} wrongBefore={0} done={false} onCorrect={() => {}} onWrong={() => {}} onNext={() => {}} {...props} />
    </FooterSlotContext.Provider>
  )
}

describe('QuizSlide', () => {
  it('a wrong tap shows the gentle hint and allows a retry; a right tap shows the explanation and the next button', () => {
    const onCorrect = vi.fn()
    const onWrong = vi.fn()
    const onNext = vi.fn()
    render(<Harness onCorrect={onCorrect} onWrong={onWrong} onNext={onNext} />)
    const primary = () => screen.getByTestId('deck-primary') as HTMLButtonElement
    expect(primary().disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /ভুল/ }))
    expect(screen.getByTestId('quiz-wrong').textContent).toContain('আবার ভাবুন')
    expect(onWrong).toHaveBeenCalledWith(1)
    expect(onCorrect).not.toHaveBeenCalled()
    expect(primary().disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /^ঠিক$/ }))
    expect(screen.getByTestId('quiz-right').textContent).toContain('ঠিক ধরেছেন')
    expect(onCorrect).toHaveBeenCalledWith(1) // one wrong try before the right one
    expect(primary().disabled).toBe(false)
    fireEvent.click(primary())
    expect(onNext).toHaveBeenCalled()
  })

  it('a finished question comes back already answered', () => {
    render(<Harness done />)
    expect(screen.getByTestId('quiz-right')).toBeTruthy()
    expect((screen.getByTestId('deck-primary') as HTMLButtonElement).disabled).toBe(false)
  })

  it('multi-answer questions need the check button', () => {
    const q: QuizQuestion = { ...mc, correct: ['a', 'b'] }
    const onCorrect = vi.fn()
    render(<Harness question={q} onCorrect={onCorrect} />)
    fireEvent.click(screen.getByRole('button', { name: /ভুল/ }))
    expect(onCorrect).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /^ঠিক$/ }))
    fireEvent.click(screen.getByRole('button', { name: 'যাচাই করুন' }))
    expect(onCorrect).toHaveBeenCalledWith(0)
  })
})
