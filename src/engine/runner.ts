import type { ExpectedAction, InputKind, MatchContext, OsFlavor, Step } from './types'
import { matchAction } from './actions'
import type { SimEvent } from '../sim/bus'
import { filterByInput, filterByOs } from './filter'

export interface RunnerState {
  index: number
  /** ids of steps completed in this run */
  done: string[]
  finished: boolean
}

export const initialRunner = (): RunnerState => ({ index: 0, done: [], finished: false })

/** Steps for this OS and (when given) this pointing device ('touch' counts as 'touchpad'). Without `input` nothing is filtered by device. */
export const stepsFor = (steps: Step[], os: OsFlavor, input?: InputKind | 'touch'): Step[] => filterByInput(filterByOs(steps, os), input)

/** Result of feeding an event to the runner: did the current step complete? */
export function feed(state: RunnerState, steps: Step[], ev: SimEvent, os: OsFlavor, ctx: MatchContext = {}): { matched: boolean } {
  if (state.finished) return { matched: false }
  const step = steps[state.index]
  if (!step) return { matched: false }
  return { matched: matchAction(step.expectedAction, ev, os, ctx) }
}

/** Mark the current step done and move to the next (or finish). */
export function advance(state: RunnerState, steps: Step[]): RunnerState {
  if (state.finished) return state
  const step = steps[state.index]
  if (!step) return { ...state, finished: true }
  const done = state.done.includes(step.id) ? state.done : [...state.done, step.id]
  const index = state.index + 1
  return { index, done, finished: index >= steps.length }
}

/** For the coach "দেখিয়ে দিন" demo: what should be animated? */
export type DemoPlan =
  | { kind: 'click' | 'doubleClick' | 'rightClick'; target?: string }
  | { kind: 'drag'; target?: string; dropTarget?: string }
  | { kind: 'type'; target?: string; text: string }
  | { kind: 'keys'; keys: string }
  | { kind: 'command'; command: string }
  | { kind: 'none' }

export function demoPlan(a: ExpectedAction): DemoPlan {
  switch (a.type) {
    case 'click':
    case 'doubleClick':
    case 'rightClick':
      return { kind: a.type, target: a.target }
    case 'drag':
      return { kind: 'drag', target: a.target, dropTarget: a.dropTarget }
    case 'type':
      return { kind: 'type', target: a.target, text: a.text }
    case 'keyCombo':
      return { kind: 'keys', keys: a.keys }
    case 'typeCommand':
      return { kind: 'command', command: Array.isArray(a.command) ? a.command[0] : a.command }
    default:
      return { kind: 'none' }
  }
}

export const PRAISE = [
  'চমৎকার! ঠিক হয়েছে।',
  'বাহ, খুব ভালো!',
  'দারুণ করেছেন!',
  'ঠিক এভাবেই!',
  'সুন্দর! আপনি পারছেন।',
  'একদম ঠিক!',
  'খুব ভালো এগোচ্ছেন।',
  'বেশ হয়েছে! পরেরটায় যাই।',
  'অসাধারণ! এভাবেই চালিয়ে যান।',
  'চমৎকার, আপনার হাত বেশ ভালো চলছে।',
]

/** Pick a praise line that differs from the previous one. */
export function pickPraise(seed: number, previous?: string): string {
  let i = Math.abs(seed) % PRAISE.length
  if (PRAISE[i] === previous) i = (i + 1) % PRAISE.length
  return PRAISE[i]
}
