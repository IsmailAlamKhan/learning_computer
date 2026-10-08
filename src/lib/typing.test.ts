import { describe, expect, it } from 'vitest'
import { accuracy, applyInput, countCorrect, diffChars, encouragementBn, LEVELS, liveWpm, newSession, wpm } from './typing'

describe('diffChars', () => {
  it('marks correct, wrong, current and pending', () => {
    const d = diffChars('cat', 'cx')
    expect(d.map((c) => c.state)).toEqual(['correct', 'wrong', 'current'])
    expect(diffChars('cat', '').map((c) => c.state)).toEqual(['current', 'pending', 'pending'])
    expect(diffChars('cat', 'cat').every((c) => c.state === 'correct')).toBe(true)
  })
  it('handles case and symbols exactly', () => {
    expect(countCorrect('Hi', 'hi')).toBe(1)
    expect(countCorrect('{ }', '{ }')).toBe(3)
  })
})

describe('session scoring', () => {
  it('counts mistakes only for added characters and keeps accuracy gentle', () => {
    let s = newSession()
    expect(accuracy(s)).toBe(100)
    s = applyInput(s, 'cat', 'c', 1000)
    s = applyInput(s, 'cat', 'cx', 1500)
    expect(s.mistakes).toBe(1)
    s = applyInput(s, 'cat', 'c', 1800) // Backspace: no penalty
    expect(s.keystrokes).toBe(2)
    s = applyInput(s, 'cat', 'ca', 2000)
    s = applyInput(s, 'cat', 'cat', 2500)
    expect(s.finishedAt).toBe(2500)
    expect(s.keystrokes).toBe(4)
    expect(accuracy(s)).toBe(75)
  })
  it('perfect typing gives 100 and ignores extra characters', () => {
    let s = newSession()
    s = applyInput(s, 'ab', 'abcd', 0)
    expect(s.typed).toBe('ab')
    expect(accuracy(s)).toBe(100)
    expect(s.finishedAt).toBe(0)
  })
  it('stops changing after finishing', () => {
    let s = applyInput(newSession(), 'a', 'a', 10)
    const again = applyInput(s, 'a', '', 20)
    expect(again).toBe(s)
  })
})

describe('wpm', () => {
  it('uses 5 characters per word', () => {
    expect(wpm(50, 60_000)).toBe(10)
    expect(wpm(25, 30_000)).toBe(10)
    expect(wpm(0, 1000)).toBe(0)
    expect(wpm(10, 0)).toBe(0)
  })
  it('liveWpm waits for enough typing', () => {
    let s = newSession()
    expect(liveWpm(s, 'hello world', 100)).toBeNull()
    s = applyInput(s, 'hello world', 'hello', 0)
    expect(liveWpm(s, 'hello world', 1000)).toBeNull()
    expect(liveWpm(s, 'hello world', 6000)).toBe(10)
  })
})

describe('messages and levels', () => {
  it('always returns Bengali text and varies with the seed', () => {
    const s = applyInput(newSession(), 'ab', 'ab', 5)
    const m = new Set([0, 1, 2].map((i) => encouragementBn(s, 'ab', i)))
    expect(m.size).toBeGreaterThan(1)
    for (const x of m) expect(x).toMatch(/[ঀ-৿]/)
    const wrong = applyInput(newSession(), 'ab', 'x', 5)
    expect(encouragementBn(wrong, 'ab')).toContain('Backspace')
  })
  it('has the four levels with code-like snippets in the last', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['home', 'words', 'sentences', 'code'])
    expect(LEVELS[3].texts).toContain('print("Hello")')
    expect(LEVELS[0].texts.every((t) => /^[asdfghjkl ]+$/.test(t))).toBe(true)
  })
})
