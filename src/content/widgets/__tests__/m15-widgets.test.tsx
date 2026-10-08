import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import ExactInstructions from '../exact-instructions'
import LanguageCards from '../language-cards'
import PathChooser from '../path-chooser'
import { QUESTIONS } from '../lib/pathChooser'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('exact-instructions widget', () => {
  it('runs a precise list and reaches the flag; vague one fails', () => {
    vi.useFakeTimers()
    render(<ExactInstructions />)
    fireEvent.click(screen.getByTestId('add-VAGUE'))
    fireEvent.click(screen.getByTestId('robot-run'))
    act(() => void vi.advanceTimersByTime(3000))
    expect(screen.getByTestId('robot-result').getAttribute('data-outcome')).toBe('confused')
    fireEvent.click(screen.getByTestId('robot-clear'))
    expect(screen.queryByTestId('robot-result')).toBeNull()
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByTestId('add-F'))
    fireEvent.click(screen.getByTestId('robot-run'))
    act(() => void vi.advanceTimersByTime(3000))
    expect(screen.getByTestId('robot-result').getAttribute('data-outcome')).toBe('reached')
    expect(screen.getByTestId('robot').getAttribute('data-x')).toBe('3')
  })
  it('shows a solution on request and switches levels', () => {
    render(<ExactInstructions />)
    fireEvent.click(screen.getByTestId('level-1'))
    fireEvent.click(screen.getByTestId('robot-solution-toggle'))
    expect(screen.getByTestId('robot-solution').textContent).toContain('ডানে ঘোরো')
  })
})

describe('language-cards widget', () => {
  it('expands a card to show code and the good-for list', () => {
    render(<LanguageCards />)
    expect(screen.queryByTestId('lang-code-python')).toBeNull()
    fireEvent.click(screen.getByTestId('lang-toggle-python'))
    expect(screen.getByTestId('lang-code-python').textContent).toContain('print(')
    expect(screen.getByText('ভালো কাজে লাগে')).toBeTruthy()
    fireEvent.click(screen.getByTestId('lang-toggle-css'))
    expect(screen.queryByTestId('lang-code-python')).toBeNull()
  })
})

describe('path-chooser widget', () => {
  it('always shows the roadmap and a recommendation after all answers', () => {
    render(<PathChooser />)
    expect(screen.getByTestId('roadmap').textContent).toContain('HTML ও CSS')
    expect(screen.queryByTestId('pc-result')).toBeNull()
    const choose = ['tool', 'data', 'read', 'career']
    QUESTIONS.forEach((q, i) => fireEvent.click(screen.getByTestId(`pc-${q.id}-${choose[i]}`)))
    expect(screen.getByTestId('pc-result').getAttribute('data-second')).toBe('python')
    expect(screen.getByTestId('roadmap').textContent).toContain('HTML ও CSS')
  })
})
