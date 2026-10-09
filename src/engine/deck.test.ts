import { describe, expect, it } from 'vitest'
import type { Card, Step, Unit } from './types'
import {
  SWIPE_THRESHOLD,
  buildSlides,
  canGoNext,
  deckKey,
  deckReducer,
  initDeckState,
  isGated,
  keyIntent,
  readSavedIndex,
  readSavedWrong,
  splitWarnings,
  resumeIndex,
  saveIndex,
  splitIfLong,
  swipeIntent,
  unitDeckSize,
  type DeckAction,
  type DeckState,
  type Slide,
} from './deck'
import { stepsFor } from './runner'
import { ProgressStore } from '../state/progress'

const card = (id: string, extra: Partial<Card> = {}): Card => ({ id, type: 'visual', textBn: id, visual: { kind: 'big', emoji: '🙂' }, ...extra })
const step = (id: string, extra: Partial<Step> = {}): Step => ({ id, titleBn: id, explanationBn: id, hintBn: id, expectedAction: { type: 'continue' }, osVariant: 'both', ...extra })
const q = (id: string, extra: object = {}) => ({ id, type: 'multipleChoice' as const, questionBn: id, hintBn: 'h', explanationBn: 'e', options: [{ id: 'a', textBn: 'a' }], correct: ['a'], ...extra })

const unit = (over: Partial<Unit> = {}): Unit => ({
  id: 'u1',
  titleBn: 'u',
  hook: card('hook', { type: 'hook' }),
  cards: [card('c1'), card('c2'), card('c3')],
  steps: [step('s1'), step('s2')],
  quiz: [q('q1'), q('q2'), q('q3')],
  recapBn: ['x'],
  ...over,
})
const ctx = { os: 'windows', input: 'mouse' } as const

describe('buildSlides', () => {
  it('orders hook, cards, practice, one slide per question, celebration', () => {
    const s = buildSlides(unit(), ctx)
    expect(s.map((x) => x.kind)).toEqual(['hook', 'card', 'card', 'card', 'practice', 'quiz', 'quiz', 'quiz', 'celebrate'])
    expect(s.filter((x) => x.kind === 'quiz').map((x) => (x as Extract<Slide, { kind: 'quiz' }>).position)).toEqual([1, 2, 3])
  })
  it('filters cards by OS and by pointing device; touch counts as touchpad', () => {
    const u = unit({
      cards: [
        card('both'),
        card('win', { osVariant: 'windows' }),
        card('mac', { osVariant: 'mac' }),
        card('mouse', { inputVariant: 'mouse' }),
        card('pad', { inputVariant: 'touchpad' }),
      ],
    })
    const ids = (c: Parameters<typeof buildSlides>[1]) => buildSlides(u, c).filter((x) => x.kind === 'card').map((x) => x.id)
    expect(ids({ os: 'windows', input: 'mouse' })).toEqual(['both', 'win', 'mouse'])
    expect(ids({ os: 'mac', input: 'touchpad' })).toEqual(['both', 'mac', 'pad'])
    expect(ids({ os: 'mac', input: 'touch' })).toEqual(['both', 'mac', 'pad'])
  })
  it('stepsFor filters by input and stays backward compatible', () => {
    const steps = [step('a'), step('m', { inputVariant: 'mouse' }), step('t', { inputVariant: 'touchpad' }), step('w', { osVariant: 'windows' })]
    expect(stepsFor(steps, 'windows').map((s) => s.id)).toEqual(['a', 'm', 't', 'w'])
    expect(stepsFor(steps, 'windows', 'mouse').map((s) => s.id)).toEqual(['a', 'm', 'w'])
    expect(stepsFor(steps, 'mac', 'touch').map((s) => s.id)).toEqual(['a', 't'])
  })
  it('skips the practice slide when no step applies and drops OS-specific questions', () => {
    const u = unit({ steps: [step('only-mac', { osVariant: 'mac' })], quiz: [q('q1'), q('q2'), q('q3', { osVariant: 'mac' })] })
    const s = buildSlides(u, ctx)
    expect(s.some((x) => x.kind === 'practice')).toBe(false)
    expect(s.filter((x) => x.kind === 'quiz')).toHaveLength(2)
  })
})

describe('navigation', () => {
  const slides = buildSlides(unit(), ctx)
  const run = (actions: DeckAction[], s: DeckState = initDeckState(slides)) => actions.reduce((st, a) => deckReducer(st, a, slides), s)
  const at = (i: number) => slides[i].id

  it('next / back move one slide and never leave the range', () => {
    expect(run([{ type: 'next' }, { type: 'next' }]).index).toBe(2)
    expect(run([{ type: 'back' }]).index).toBe(0)
    expect(run([{ type: 'next' }, { type: 'back' }]).index).toBe(0)
    expect(run([{ type: 'next' }]).dir).toBe(1)
    expect(run([{ type: 'next' }, { type: 'back' }]).dir).toBe(-1)
  })
  it('cannot skip the practice until it is done, but can go back from it', () => {
    const practice = slides.findIndex((s) => s.kind === 'practice')
    const st = run(Array(practice + 3).fill({ type: 'next' }))
    expect(st.index).toBe(practice)
    expect(canGoNext(slides, st)).toBe(false)
    expect(run([{ type: 'back' }], st).index).toBe(practice - 1)
    const done = run([{ type: 'complete', id: at(practice) }, { type: 'next' }], st)
    expect(done.index).toBe(practice + 1)
  })
  it('gates every quiz question and stops on the celebration', () => {
    let st = initDeckState(slides, slides.length - 4) // first quiz slide
    expect(slides[st.index].kind).toBe('quiz')
    expect(deckReducer(st, { type: 'next' }, slides).index).toBe(st.index)
    for (let i = 0; i < 3; i++) {
      st = deckReducer(deckReducer(st, { type: 'complete', id: slides[st.index].id }, slides), { type: 'next' }, slides)
    }
    expect(slides[st.index].kind).toBe('celebrate')
    expect(deckReducer(st, { type: 'next' }, slides)).toBe(st)
  })
  it('goto: backwards always, forwards only up to the first unfinished gate', () => {
    const practice = slides.findIndex((s) => s.kind === 'practice')
    const st = run([{ type: 'goto', index: 99 }])
    expect(st.index).toBe(practice)
    expect(run([{ type: 'goto', index: 1 }], st).index).toBe(1)
    expect(run([{ type: 'goto', index: -5 }], st).index).toBe(0)
    expect(isGated(slides[practice])).toBe(true)
  })
  it('replaying a finished unit has no gates', () => {
    const st = initDeckState(slides, 5, true)
    expect(st.index).toBe(0)
    expect(run(Array(slides.length).fill({ type: 'next' }), st).index).toBe(slides.length - 1)
  })
  it('clamp keeps the index valid after the slide list shrinks', () => {
    const st: DeckState = { index: 20, done: [], dir: 1 }
    expect(deckReducer(st, { type: 'clamp' }, slides).index).toBeLessThan(slides.length)
  })
})

describe('keyboard and swipe mapping', () => {
  it('Space / Enter / → next, ← back, Esc close on card slides', () => {
    const c = { focus: 'none', slide: 'card' } as const
    expect(keyIntent(' ', c)).toBe('next')
    expect(keyIntent('Enter', c)).toBe('next')
    expect(keyIntent('ArrowRight', c)).toBe('next')
    expect(keyIntent('ArrowLeft', c)).toBe('back')
    expect(keyIntent('Escape', c)).toBe('close')
    expect(keyIntent('a', c)).toBeNull()
  })
  it('leaves keys alone inside the simulator, text fields and on buttons', () => {
    expect(keyIntent(' ', { focus: 'sim', slide: 'practice' })).toBeNull()
    expect(keyIntent('Escape', { focus: 'sim', slide: 'practice' })).toBeNull()
    expect(keyIntent('Enter', { focus: 'text', slide: 'quiz' })).toBeNull()
    expect(keyIntent('Enter', { focus: 'control', slide: 'card' })).toBeNull()
    expect(keyIntent('ArrowRight', { focus: 'control', slide: 'card' })).toBe('next')
  })
  it('only Esc is a shortcut on practice and quiz slides; an open sheet swallows arrows', () => {
    expect(keyIntent('ArrowRight', { focus: 'none', slide: 'quiz' })).toBeNull()
    expect(keyIntent('Escape', { focus: 'none', slide: 'quiz' })).toBe('close')
    expect(keyIntent('ArrowRight', { focus: 'none', slide: 'card', sheetOpen: true })).toBeNull()
  })
  it('swipe needs 60px and a mostly horizontal move', () => {
    expect(SWIPE_THRESHOLD).toBe(60)
    expect(swipeIntent(-80, 5)).toBe('next')
    expect(swipeIntent(80, -10)).toBe('back')
    expect(swipeIntent(-59, 0)).toBeNull()
    expect(swipeIntent(-90, 80)).toBeNull()
    expect(swipeIntent(0, 200)).toBeNull()
  })
})

describe('progress save / restore', () => {
  const mem = () => {
    const m = new Map<string, string>()
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }
  }
  it('saves the slide index under deck:<module>:<unit> and reads it back', () => {
    const store = new ProgressStore(mem())
    saveIndex(store, 2, 'u1', 4)
    expect(deckKey(2, 'u1')).toBe('deck:2:u1')
    expect(store.getSnapshot().extras['deck:2:u1']).toEqual({ index: 4 })
    expect(readSavedIndex(store.getSnapshot().extras, 2, 'u1')).toBe(4)
    expect(readSavedIndex(store.getSnapshot().extras, 2, 'zzz')).toBeUndefined()
    store.setExtra('deck:2:bad', { index: 'x' })
    expect(readSavedIndex(store.getSnapshot().extras, 2, 'bad')).toBeUndefined()
  })
  it('survives a reload (new store over the same storage)', () => {
    const storage = mem()
    saveIndex(new ProgressStore(storage), 5, 'a', 3)
    expect(readSavedIndex(new ProgressStore(storage).getSnapshot().extras, 5, 'a')).toBe(3)
  })
  it('offers a resume only mid-unit; restored state treats earlier gates as done', () => {
    const slides = buildSlides(unit(), ctx)
    expect(resumeIndex(slides, undefined, false)).toBeUndefined()
    expect(resumeIndex(slides, 0, false)).toBeUndefined()
    expect(resumeIndex(slides, 6, true)).toBeUndefined()
    expect(resumeIndex(slides, slides.length - 1, false)).toBeUndefined()
    expect(resumeIndex(slides, 6, false)).toBe(6)
    const st = initDeckState(slides, 6)
    expect(st.index).toBe(6)
    expect(st.done).toEqual(['practice-windows', 'q1'])
    expect(canGoNext(slides, st)).toBe(false)
  })
})

describe('splitIfLong', () => {
  it('is quiet for 6 cards, warns when the deck is longer than 12', () => {
    const six = unit({ cards: Array.from({ length: 6 }, (_, i) => card(`c${i}`)) })
    expect(unitDeckSize(six)).toBe(12)
    expect(splitIfLong(six)).toBeNull()
    const seven = unit({ cards: Array.from({ length: 7 }, (_, i) => card(`c${i}`)) })
    expect(splitIfLong(seven)).toMatch(/split/)
  })
})

describe('back from a quiz, resume with wrong tries, split guidance', () => {
  const slides = buildSlides(unit(), ctx)
  const q1 = slides.findIndex((s) => s.kind === 'quiz')
  it('going back from a quiz is always allowed and keeps finished gates finished', () => {
    let st = initDeckState(slides, q1)
    st = deckReducer(st, { type: 'complete', id: slides[q1].id }, slides)
    st = deckReducer(st, { type: 'next' }, slides) // on q2, unfinished
    expect(canGoNext(slides, st)).toBe(false)
    const back = deckReducer(st, { type: 'back' }, slides)
    expect(back.index).toBe(q1)
    expect(canGoNext(slides, back)).toBe(true) // q1 stays done
    expect(deckReducer(back, { type: 'next' }, slides).index).toBe(q1 + 1)
    // all the way back to the hook, then forward again: still gated at q2
    const start = deckReducer(back, { type: 'goto', index: 0 }, slides)
    expect(start.index).toBe(0)
    expect(deckReducer(start, { type: 'goto', index: 99 }, slides).index).toBe(q1 + 1)
  })
  it('a finished practice stays finished after going back to cards', () => {
    const practice = slides.findIndex((s) => s.kind === 'practice')
    let st = initDeckState(slides, practice)
    st = deckReducer(st, { type: 'complete', id: slides[practice].id }, slides)
    st = deckReducer(deckReducer(st, { type: 'back' }, slides), { type: 'next' }, slides)
    expect(st.index).toBe(practice)
    expect(canGoNext(slides, st)).toBe(true)
  })
  it('the quiz slide cannot be left via goto while unanswered, even from the start', () => {
    const st = deckReducer(initDeckState(slides, 0, false), { type: 'goto', index: slides.length - 1 }, slides)
    expect(slides[st.index].kind).toBe('practice')
  })
  it('wrong tries are saved with the index and restored; malformed values are ignored', () => {
    const m = new Map<string, string>()
    const store = new ProgressStore({ getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) })
    saveIndex(store, 3, 'u', 7, { q1: 2 })
    expect(store.getSnapshot().extras['deck:3:u']).toEqual({ index: 7, wrong: { q1: 2 } })
    expect(readSavedWrong(store.getSnapshot().extras, 3, 'u')).toEqual({ q1: 2 })
    saveIndex(store, 3, 'u', 8, {})
    expect(store.getSnapshot().extras['deck:3:u']).toEqual({ index: 8 })
    store.setExtra('deck:3:x', { index: 1, wrong: { a: 'x', b: 0, c: 3 } })
    expect(readSavedWrong(store.getSnapshot().extras, 3, 'x')).toEqual({ c: 3 })
    expect(readSavedWrong(store.getSnapshot().extras, 3, 'none')).toEqual({})
  })
  it('splitWarnings lists every long unit of a lesson', () => {
    const long = unit({ id: 'long', cards: Array.from({ length: 7 }, (_, i) => card(`c${i}`)) })
    const w = splitWarnings({ units: [unit(), long] } as never)
    expect(w).toHaveLength(1)
    expect(w[0]).toContain('long')
  })
  it('resume mid-unit restores earlier gates; a replay of a done unit never offers resume', () => {
    const at = slides.length - 3
    const st = initDeckState(slides, at)
    expect(st.done).toContain('practice-windows')
    expect(st.done).not.toContain(slides[at].id)
    expect(resumeIndex(slides, at, true)).toBeUndefined()
  })
})
