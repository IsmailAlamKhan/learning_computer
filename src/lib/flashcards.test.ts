import { describe, expect, it } from 'vitest'
import { flip, markAgain, markKnown, move, readKnown, startDeck } from './flashcards'

const ids = ['a', 'b', 'c', 'd']
const noShuffle = () => 0.999999 // Fisher–Yates with j = i keeps the order

describe('flashcards', () => {
  it('skips known cards and keeps order with a stable rnd', () => {
    expect(startDeck(ids, ['b'], noShuffle).order).toEqual(['a', 'c', 'd'])
  })
  it('shuffles', () => {
    const d = startDeck(ids, [], () => 0)
    expect([...d.order].sort()).toEqual(ids)
    expect(d.order).not.toEqual(ids)
  })
  it('flip toggles', () => {
    const s = startDeck(ids, [], noShuffle)
    expect(flip(s).flipped).toBe(true)
    expect(flip(flip(s)).flipped).toBe(false)
  })
  it('known removes the card and unflips', () => {
    const s = flip(startDeck(ids, [], noShuffle))
    const n = markKnown(s)
    expect(n.order).toEqual(['b', 'c', 'd'])
    expect(n.flipped).toBe(false)
    expect(markKnown({ ...s, index: 3 }).index).toBe(0)
  })
  it('again sends the card to the back', () => {
    const n = markAgain(startDeck(ids, [], noShuffle))
    expect(n.order).toEqual(['b', 'c', 'd', 'a'])
    expect(n.index).toBe(0)
  })
  it('move wraps around', () => {
    const s = startDeck(ids, [], noShuffle)
    expect(move(s, -1).index).toBe(3)
    expect(move({ ...s, index: 3 }, 1).index).toBe(0)
  })
  it('empty deck is safe', () => {
    expect(markKnown({ order: ['a'], index: 0, flipped: true }).order).toEqual([])
    expect(move({ order: [], index: 0, flipped: false }, 1).order).toEqual([])
  })
  it('readKnown tolerates junk', () => {
    expect(readKnown({ flashKnown: ['x', 3] })).toEqual(['x'])
    expect(readKnown({})).toEqual([])
  })
})
