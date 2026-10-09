/**
 * Deck engine (pure, no React): turns a `Unit` into the list of slides of the one-card-at-a-time flow,
 * and holds the navigation rules (next / back / goto, practice + quiz gates), key and swipe mapping,
 * progress save / restore keys, and the "split long units" guidance.
 *
 * UI: src/pages/DeckPage.tsx and src/ui/cards/*. Documented in docs/UX_CONTRACT.md.
 */
import type { Card, InputKind, Lesson, OsFlavor, QuizQuestion, Step, Unit } from './types'
import { filterByInput, filterByOs, normalizeInput } from './filter'
import { stepsFor } from './runner'

export interface DeckCtx {
  os: OsFlavor
  /** 'touch' (a touchscreen) counts as 'touchpad' */
  input: InputKind | 'touch'
}

export type Slide =
  | { kind: 'hook'; id: string; card: Card }
  | { kind: 'card'; id: string; card: Card }
  | { kind: 'practice'; id: string; steps: Step[] }
  | { kind: 'quiz'; id: string; question: QuizQuestion; position: number; total: number }
  | { kind: 'celebrate'; id: string }

export type SlideKind = Slide['kind']

/** Cards of a unit that this learner sees (filtered by OS and by pointing device). */
export const cardsFor = (unit: Unit, ctx: DeckCtx): Card[] => filterByInput(filterByOs(unit.cards, ctx.os), normalizeInput(ctx.input))

/** Quiz questions this learner sees. */
export const questionsFor = (unit: Unit, ctx: DeckCtx): QuizQuestion[] => filterByOs(unit.quiz, ctx.os)

/** hook → cards → practice (only if there are steps) → one slide per quiz question → celebrate. */
export function buildSlides(unit: Unit, ctx: DeckCtx): Slide[] {
  const slides: Slide[] = [{ kind: 'hook', id: 'hook', card: unit.hook }]
  for (const c of cardsFor(unit, ctx)) slides.push({ kind: 'card', id: c.id, card: c })
  const steps = stepsFor(unit.steps, ctx.os, normalizeInput(ctx.input))
  if (steps.length > 0) slides.push({ kind: 'practice', id: `practice-${ctx.os}`, steps })
  const qs = questionsFor(unit, ctx)
  qs.forEach((q, i) => slides.push({ kind: 'quiz', id: q.id, question: q, position: i + 1, total: qs.length }))
  slides.push({ kind: 'celebrate', id: 'celebrate' })
  return slides
}

/** Practice and quiz slides must be finished before moving forward (going back is always allowed). */
export const isGated = (s: Slide): boolean => s.kind === 'practice' || s.kind === 'quiz'

// ---------------------------------------------------------------------------------------------
// Navigation state
// ---------------------------------------------------------------------------------------------

export interface DeckState {
  index: number
  /** ids of gated slides (practice / quiz) that are finished */
  done: string[]
  /** direction of the last move, for the slide animation */
  dir: 1 | -1
}

export type DeckAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; index: number }
  | { type: 'complete'; id: string }
  /** replace the whole state (restore after "continue where you left off") */
  | { type: 'set'; state: DeckState }
  /** the slide list changed (OS toggle): keep the position as well as possible */
  | { type: 'clamp' }

const clamp = (i: number, slides: Slide[]) => Math.max(0, Math.min(slides.length - 1, i))

/** `savedIndex`: where she stopped last time. `unitDone`: replaying a finished unit — nothing is gated. */
export function initDeckState(slides: Slide[], savedIndex = 0, unitDone = false): DeckState {
  const index = clamp(unitDone ? 0 : savedIndex, slides)
  const done = slides.filter((s, i) => isGated(s) && (unitDone || i < index)).map((s) => s.id)
  return { index, done, dir: 1 }
}

export function isDone(state: DeckState, slide: Slide | undefined): boolean {
  return !slide || !isGated(slide) || state.done.includes(slide.id)
}

export const canGoBack = (state: DeckState): boolean => state.index > 0
export const canGoNext = (slides: Slide[], state: DeckState): boolean => state.index < slides.length - 1 && isDone(state, slides[state.index])

/** First index in [from, to) holding an unfinished gated slide, or -1. */
function firstBlocked(slides: Slide[], state: DeckState, from: number, to: number): number {
  for (let i = from; i < to; i++) if (!isDone(state, slides[i])) return i
  return -1
}

export function deckReducer(state: DeckState, action: DeckAction, slides: Slide[]): DeckState {
  switch (action.type) {
    case 'next':
      return canGoNext(slides, state) ? { ...state, index: state.index + 1, dir: 1 } : state
    case 'back':
      return state.index > 0 ? { ...state, index: state.index - 1, dir: -1 } : state
    case 'goto': {
      const target = clamp(action.index, slides)
      if (target === state.index) return state
      if (target < state.index) return { ...state, index: target, dir: -1 }
      const blocked = firstBlocked(slides, state, state.index, target)
      const index = blocked === -1 ? target : blocked
      return index === state.index ? state : { ...state, index, dir: 1 }
    }
    case 'set':
      return action.state
    case 'complete':
      return state.done.includes(action.id) ? state : { ...state, done: [...state.done, action.id] }
    case 'clamp': {
      const index = clamp(state.index, slides)
      // never land beyond an unfinished gate after the list changed
      const blocked = firstBlocked(slides, state, 0, index)
      return { ...state, index: blocked === -1 ? index : blocked }
    }
  }
}

/** 0..1 for progress bars. */
export const progressFraction = (slides: Slide[], state: DeckState): number => (slides.length <= 1 ? 1 : state.index / (slides.length - 1))

// ---------------------------------------------------------------------------------------------
// Keyboard + swipe mapping
// ---------------------------------------------------------------------------------------------

export type NavIntent = 'next' | 'back' | 'close'

/** What is focused: nothing special, a button/link/summary, a text field, or the simulated computer. */
export type FocusKind = 'none' | 'control' | 'text' | 'sim'

/**
 * Space / Enter / → = next, ← = back, Esc = close.
 * - inside the simulated computer or a text field the keys belong to that widget (nothing happens);
 * - on a button, Space/Enter keep their normal "press" meaning;
 * - on practice/quiz slides only Esc is a shortcut (arrow keys move options, Space/Enter press buttons).
 */
export function keyIntent(key: string, ctx: { focus: FocusKind; slide: SlideKind; sheetOpen?: boolean }): NavIntent | null {
  if (ctx.focus === 'sim' || ctx.focus === 'text') return null
  if (key === 'Escape' || key === 'Esc') return 'close'
  if (ctx.slide === 'practice' || ctx.slide === 'quiz') return null
  if (ctx.sheetOpen) return null
  if (key === 'ArrowRight') return 'next'
  if (key === 'ArrowLeft') return 'back'
  if (ctx.focus === 'control') return null
  if (key === ' ' || key === 'Spacebar' || key === 'Enter') return 'next'
  return null
}

export const SWIPE_THRESHOLD = 60

/** Swipe left = next, swipe right = back. Mostly-vertical drags (scrolling) never count. */
export function swipeIntent(dx: number, dy: number, threshold = SWIPE_THRESHOLD): 'next' | 'back' | null {
  if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return null
  return dx < 0 ? 'next' : 'back'
}

// ---------------------------------------------------------------------------------------------
// Progress save / restore ("continue where you left off")
// ---------------------------------------------------------------------------------------------

export const deckKey = (module: number, unitId: string) => `deck:${module}:${unitId}`

/** Read the saved slide index from `ProgressData.extras` (anything malformed counts as "nothing saved"). */
export function readSavedIndex(extras: Record<string, unknown>, module: number, unitId: string): number | undefined {
  const v = extras[deckKey(module, unitId)]
  if (typeof v !== 'object' || v === null) return undefined
  const i = (v as { index?: unknown }).index
  return typeof i === 'number' && Number.isInteger(i) && i >= 0 ? i : undefined
}

export interface ExtraSink {
  setExtra(key: string, value: unknown): void
}
/** `wrong`: wrong attempts per quiz question so far, so a resumed quiz still scores first-try answers correctly. */
export function saveIndex(store: ExtraSink, module: number, unitId: string, index: number, wrong?: Record<string, number>) {
  const hasWrong = !!wrong && Object.keys(wrong).length > 0
  store.setExtra(deckKey(module, unitId), hasWrong ? { index, wrong } : { index })
}

export function readSavedWrong(extras: Record<string, unknown>, module: number, unitId: string): Record<string, number> {
  const v = extras[deckKey(module, unitId)]
  const w = typeof v === 'object' && v !== null ? (v as { wrong?: unknown }).wrong : undefined
  if (typeof w !== 'object' || w === null) return {}
  return Object.fromEntries(Object.entries(w).filter(([, n]) => typeof n === 'number' && n > 0)) as Record<string, number>
}

/** Offer "continue where you left off" only when she is in the middle of an unfinished unit. */
export function resumeIndex(slides: Slide[], saved: number | undefined, unitDone: boolean): number | undefined {
  if (unitDone || saved === undefined || saved <= 0 || saved >= slides.length - 1) return undefined
  return saved
}

// ---------------------------------------------------------------------------------------------
// Authoring guidance
// ---------------------------------------------------------------------------------------------

/** Longest deck this unit can produce for any OS / pointing device (hook + cards + practice + quiz + celebration). */
export function unitDeckSize(unit: Unit): number {
  let max = 0
  for (const os of ['windows', 'mac'] as const)
    for (const input of ['mouse', 'touchpad'] as const) max = Math.max(max, buildSlides(unit, { os, input }).length)
  return max
}

/** Over ~12 deck items a unit should be authored as two units. */
export const MAX_DECK_ITEMS = 12

/** A warning text for the audit, or null when the unit is fine. */
export function splitIfLong(unit: Unit): string | null {
  const n = unitDeckSize(unit)
  return n > MAX_DECK_ITEMS ? `unit "${unit.id}" has ${n} deck items (> ${MAX_DECK_ITEMS}): split it into two units` : null
}

export const splitWarnings = (lesson: Lesson): string[] => lesson.units.map(splitIfLong).filter((w): w is string => !!w)
