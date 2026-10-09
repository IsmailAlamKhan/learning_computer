import { describe, expect, it } from 'vitest'
import { dailyRing, ringOffset } from './dailyGoal'

describe('dailyRing', () => {
  it('counts today only', () => {
    expect(dailyRing({ day: '2026-01-02', lessons: 2, xp: 0 }, 3, '2026-01-02')).toMatchObject({ done: 2, remaining: 1, reached: false })
    expect(dailyRing({ day: '2026-01-01', lessons: 2, xp: 0 }, 3, '2026-01-02')).toMatchObject({ done: 0, remaining: 3, fraction: 0 })
  })
  it('caps at 1 and flags the goal as reached', () => {
    const r = dailyRing({ day: 'd', lessons: 5, xp: 0 }, 2, 'd')
    expect(r.fraction).toBe(1)
    expect(r.reached).toBe(true)
    expect(r.remaining).toBe(0)
  })
  it('treats a bad goal as 1', () => {
    expect(dailyRing({ day: 'd', lessons: 0, xp: 0 }, 0, 'd').goal).toBe(1)
  })
  it('ring offset', () => {
    expect(ringOffset(1, 40)).toBeCloseTo(0)
    expect(ringOffset(0, 40)).toBeCloseTo(2 * Math.PI * 40)
  })
})
