import { dayKey, type DailyProgress } from '../state/gamification'

export interface DailyRing {
  done: number
  goal: number
  /** 0..1, capped */
  fraction: number
  remaining: number
  reached: boolean
}

/** Daily-goal ring maths. Lessons counted for an earlier day do not count today. */
export function dailyRing(daily: DailyProgress, goal: number, today = dayKey()): DailyRing {
  const g = Math.max(1, Math.round(goal) || 1)
  const done = daily.day === today ? Math.max(0, daily.lessons) : 0
  return { done, goal: g, fraction: Math.min(1, done / g), remaining: Math.max(0, g - done), reached: done >= g }
}

/** SVG stroke-dashoffset for a ring of the given radius. */
export const ringOffset = (fraction: number, radius: number) => 2 * Math.PI * radius * (1 - fraction)
