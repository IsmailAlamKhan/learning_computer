import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import TechWords from '../tech-words'
import ErrorReader from '../error-reader'
import QuestionBuilder from '../question-builder'
import {
  ERROR_SAMPLES, TECH_WORDS, buildQuestion, cleanErrorForSearch, emptyParts, filterWords, findPrivateInfo, keyLine, makeDrill, makeMatchQuestion, missingParts, parseLocation, pythonKeyLine, questionTitle, rng, WORD_CATEGORIES,
} from '../lib/m19Logic'

describe('m19 logic', () => {
  it('has ~40 unique words in all five categories', () => {
    expect(TECH_WORDS.length).toBeGreaterThanOrEqual(38)
    expect(new Set(TECH_WORDS.map((w) => w.id)).size).toBe(TECH_WORDS.length)
    for (const c of WORD_CATEGORIES) expect(TECH_WORDS.some((w) => w.cat === c.id)).toBe(true)
  })
  it('filters by query (English or Bengali) and category', () => {
    expect(filterWords(TECH_WORDS, 'PERMISSION', 'all').map((w) => w.id)).toContain('permission-denied')
    expect(filterWords(TECH_WORDS, 'সময় শেষ', 'all').map((w) => w.id)).toContain('timeout')
    expect(filterWords(TECH_WORDS, '', 'web').every((w) => w.cat === 'web')).toBe(true)
    expect(filterWords(TECH_WORDS, 'zzzz', 'all')).toEqual([])
  })
  it('drill questions have one correct unique option, deterministic by seed', () => {
    const d = makeDrill(TECH_WORDS, 6, 42)
    expect(d).toHaveLength(6)
    for (const q of d) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options.filter((o) => o === q.answer)).toHaveLength(1)
    }
    expect(makeDrill(TECH_WORDS, 6, 42).map((q) => q.word.id)).toEqual(d.map((q) => q.word.id))
    expect(makeMatchQuestion(TECH_WORDS[0], TECH_WORDS, rng(1)).answer).toBe(TECH_WORDS[0].bn)
  })
  it('error samples have exactly one key line; the python key line is the last unindented one', () => {
    for (const s of ERROR_SAMPLES) expect(s.lines.filter((l) => l.role === 'key')).toHaveLength(1)
    const py = ERROR_SAMPLES[0]
    expect(pythonKeyLine(py.lines.map((l) => l.text))).toBe(keyLine(py).text)
    expect(pythonKeyLine([])).toBeUndefined()
  })
  it('parses locations from python and js lines', () => {
    expect(parseLocation('  File "shop.py", line 7, in <module>')).toEqual({ file: 'shop.py', line: 7 })
    expect(parseLocation('    at calculate (app.js:12:5)')).toEqual({ file: 'app.js', line: 12 })
    expect(parseLocation('NameError: x')).toBeNull()
  })
  it('cleans an error for searching', () => {
    expect(cleanErrorForSearch("NameError: name 'mesage' is not defined", 'python')).toBe('NameError: name is not defined python')
    expect(cleanErrorForSearch("FileNotFoundError: 'C:\\Users\\Ruma\\a.txt'")).toBe('FileNotFoundError:')
  })
  it('builds the question and detects missing parts / private info', () => {
    const p = emptyParts()
    expect(missingParts(p)).toEqual(['want', 'did', 'happened'])
    expect(buildQuestion(p)).toBe('')
    p.want = 'Print a message'
    p.did = 'Wrote print(mesage)'
    p.happened = 'An error'
    p.error = "NameError: name 'mesage' is not defined"
    expect(missingParts(p)).toEqual([])
    const t = buildQuestion(p)
    expect(t).toContain('What I want to do:\nPrint a message')
    expect(t).toContain('Exact error message:')
    expect(t).not.toContain('What I already tried')
    expect(questionTitle(p)).toContain('NameError')
    expect(findPrivateInfo('mail me ruma@example.com')).toContain('ইমেইল ঠিকানা')
    expect(findPrivateInfo('password: hunter2')).toContain('পাসওয়ার্ড')
    expect(findPrivateInfo('C:\\Users\\Ruma\\a.py')).toHaveLength(1)
    expect(findPrivateInfo('print(1)')).toEqual([])
  })
})

describe('TechWords widget', () => {
  it('flips a card and filters', () => {
    render(<TechWords />)
    fireEvent.click(screen.getByTestId('tw-card-timeout'))
    expect(screen.getByTestId('tw-bn').textContent).toBe('সময় শেষ')
    fireEvent.change(screen.getByTestId('tw-search'), { target: { value: 'syntax' } })
    expect(screen.queryByTestId('tw-card-timeout')).toBeNull()
    expect(screen.getByTestId('tw-card-syntax')).toBeTruthy()
  })
  it('drill: wrong then right, finishes with a score', () => {
    render(<TechWords />)
    fireEvent.click(screen.getByTestId('tw-mode-drill'))
    for (let i = 0; i < 5; i++) {
      if (i === 0) fireEvent.click(screen.getAllByTestId('tw-opt')[0])
      fireEvent.click(screen.getByTestId('tw-opt-correct'))
      fireEvent.click(screen.getByTestId('tw-next'))
    }
    expect(screen.getByTestId('tw-done').textContent).toMatch(/[5৫]টির মধ্যে [4৪]টি/)
  })
})

describe('ErrorReader widget', () => {
  it('explains clicked lines in both samples', () => {
    render(<ErrorReader />)
    expect(screen.getByTestId('er-hint')).toBeTruthy()
    fireEvent.click(screen.getByTestId('er-line-p4'))
    expect(screen.getByTestId('er-note').textContent).toContain('আসল লাইন')
    fireEvent.click(screen.getByTestId('er-tab-javascript'))
    fireEvent.click(screen.getByTestId('er-line-j2'))
    expect(screen.getByTestId('er-note').textContent).toContain('app.js')
  })
})

describe('QuestionBuilder widget', () => {
  it('shows output after the required fields and warns about private data', () => {
    render(<QuestionBuilder />)
    expect(screen.queryByTestId('qb-output')).toBeNull()
    fireEvent.change(screen.getByTestId('qb-want'), { target: { value: 'Add two numbers' } })
    fireEvent.change(screen.getByTestId('qb-did'), { target: { value: 'wrote code, email ruma@example.com' } })
    fireEvent.change(screen.getByTestId('qb-happened'), { target: { value: 'error' } })
    expect(screen.getByTestId('qb-output').textContent).toContain('What I want to do:')
    expect(screen.getByTestId('qb-private')).toBeTruthy()
  })
})
