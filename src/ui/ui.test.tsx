import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SpeakButton, pickBengaliVoice, speechText } from './SpeakButton'
import { Celebration } from './Celebration'
import { store } from '../state/store'

const setMotion = (reduce: boolean) =>
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (q: string) => ({ matches: reduce && q.includes('reduce'), addEventListener() {}, removeEventListener() {} }) })

beforeEach(() => store.resetAll())
afterEach(() => {
  delete (window as unknown as Record<string, unknown>).speechSynthesis
  vi.restoreAllMocks()
})

describe('SpeakButton', () => {
  it('strips markup and picks bn-BD first', () => {
    expect(speechText('এটি **ফোল্ডার**  বলে')).toBe('এটি ফোল্ডার বলে')
    expect(pickBengaliVoice([{ lang: 'en-US' }, { lang: 'bn-IN' }, { lang: 'bn_BD' }])).toEqual({ lang: 'bn_BD' })
    expect(pickBengaliVoice([{ lang: 'en-US' }])).toBeUndefined()
  })
  it('renders nothing without speechSynthesis', () => {
    const { container } = render(<SpeakButton text="হ্যালো" />)
    expect(container).toBeEmptyDOMElement()
  })
  it('renders nothing without a Bengali voice', () => {
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [{ lang: 'en-US' }], cancel() {}, speak() {}, addEventListener() {}, removeEventListener() {} } })
    const { container } = render(<SpeakButton text="হ্যালো" />)
    expect(container).toBeEmptyDOMElement()
  })
  it('shows a button that speaks, toggles and cancels on unmount', () => {
    const speak = vi.fn()
    const cancel = vi.fn()
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => [{ lang: 'bn-BD' }], cancel, speak, addEventListener() {}, removeEventListener() {} } })
    vi.stubGlobal('SpeechSynthesisUtterance', class { text: string; lang = ''; constructor(t: string) { this.text = t } })
    const { unmount } = render(<SpeakButton text="এটি **ফোল্ডার**" />)
    const btn = screen.getByRole('button', { name: 'শুনুন' })
    act(() => btn.click())
    expect(speak).toHaveBeenCalledTimes(1)
    expect(speak.mock.calls[0][0].text).toBe('এটি ফোল্ডার')
    expect(btn.getAttribute('aria-pressed')).toBe('true')
    act(() => btn.click())
    expect(btn.getAttribute('aria-pressed')).toBe('false')
    cancel.mockClear()
    unmount()
    expect(cancel).toHaveBeenCalled()
  })
})

describe('Celebration', () => {
  it('shows XP, streak and badge medals', () => {
    setMotion(true)
    render(<Celebration xp={30} streak={3} badges={['first-lesson', 'nope']} title="শাবাশ!" />)
    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.getByTestId('celebration-xp').textContent).toContain('৩০')
    expect(screen.getByTestId('celebration-streak').textContent).toContain('৩')
    expect(screen.getAllByTestId('badge')).toHaveLength(1)
  })
  it('reduced motion: no confetti canvas, static sparkles, XP shown at once', () => {
    setMotion(true)
    render(<Celebration xp={40} />)
    expect(screen.queryByTestId('confetti')).toBeNull()
    expect(screen.getAllByTestId('sparkle').length).toBeGreaterThan(0)
    expect(screen.getByTestId('celebration-xp').textContent).toContain('৪০')
  })
  it('normal motion draws the confetti canvas', () => {
    setMotion(false)
    render(<Celebration xp={40} />)
    expect(screen.getByTestId('confetti')).toBeTruthy()
  })
})
