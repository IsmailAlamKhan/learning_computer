/** Pure state helpers for the glossary flashcard mode (kept out of the component so they are easy to test). */
export const FLASH_KEY = 'flashKnown'

export const readKnown = (extras: Record<string, unknown>): string[] => {
  const v = extras[FLASH_KEY]
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

export function shuffle<T>(items: readonly T[], rnd: () => number = Math.random): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface FlashState {
  /** ids still to learn, in the order they are shown */
  order: string[]
  index: number
  flipped: boolean
}

export const startDeck = (ids: readonly string[], known: readonly string[], rnd?: () => number): FlashState => ({
  order: shuffle(ids.filter((id) => !known.includes(id)), rnd),
  index: 0,
  flipped: false,
})

export const flip = (s: FlashState): FlashState => ({ ...s, flipped: !s.flipped })

/** "জানতাম ✓": drop the card from this round (the next one slides into its place). */
export function markKnown(s: FlashState): FlashState {
  const order = s.order.filter((_, i) => i !== s.index)
  return { order, index: order.length ? s.index % order.length : 0, flipped: false }
}

/** "আবার দেখব ↺": the card goes to the back of the deck. */
export function markAgain(s: FlashState): FlashState {
  if (s.order.length < 2) return { ...s, flipped: false }
  const card = s.order[s.index]
  const order = [...s.order.filter((_, i) => i !== s.index), card]
  return { order, index: s.index % order.length, flipped: false }
}

export function move(s: FlashState, delta: 1 | -1): FlashState {
  if (!s.order.length) return s
  return { ...s, index: (s.index + delta + s.order.length) % s.order.length, flipped: false }
}
