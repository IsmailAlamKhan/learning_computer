import { describe, expect, it } from 'vitest'
import { DAILY_PLAN, dailyTotal, encouragement, RESOURCES, ROADMAP, STUCK_STEPS, WEEK_DAYS, weekGrid } from './nextSteps'

describe('next steps content', () => {
  it('the daily plan is 5 + 20 + 5 = 30 minutes', () => {
    expect(DAILY_PLAN.map((b) => b.minutes)).toEqual([5, 20, 5])
    expect(dailyTotal()).toBe(30)
  })
  it('weekly grid has seven days per week and at least one week', () => {
    expect(WEEK_DAYS).toHaveLength(7)
    expect(weekGrid(4)).toHaveLength(4)
    expect(weekGrid(0)).toHaveLength(1)
    expect(weekGrid(2)[1]).toEqual({ week: 2, days: WEEK_DAYS })
  })
  it('the roadmap has the four recommended stages in order', () => {
    expect(ROADMAP.map((s) => s.id)).toEqual(['basics', 'projects', 'git', 'portfolio'])
    expect(ROADMAP[1].itemsBn.length).toBeGreaterThanOrEqual(4)
  })
  it('does not name commercial learning sites (only official docs are named)', () => {
    const all = JSON.stringify({ ROADMAP, RESOURCES, STUCK_STEPS })
    expect(all).not.toMatch(/udemy|coursera|youtube|w3schools|stack ?overflow|freecodecamp|khan ?academy|codecademy|edx/i)
    expect(all).toMatch(/MDN Web Docs/)
    expect(all).toMatch(/python\.org/)
  })
  it('is religion-neutral', () => {
    expect(JSON.stringify({ ROADMAP, RESOURCES, STUCK_STEPS, DAILY_PLAN })).not.toMatch(/নমস্কার|আদাব|সালাম|প্রণাম|ইনশাআল্লাহ|মাশাআল্লাহ/)
  })
})

describe('encouragement', () => {
  it('uses her name and original motivation', () => {
    const e = encouragement('রুমা', 'ওয়েবসাইট বানাতে চাই')
    expect(e.titleBn).toContain('রুমা')
    expect(e.linesBn.join(' ')).toContain('ওয়েবসাইট বানাতে চাই')
  })
  it('degrades gracefully when name or motivation is missing', () => {
    const e = encouragement('  ', undefined)
    expect(e.titleBn).toBe('অভিনন্দন!')
    expect(e.linesBn.join(' ')).not.toMatch(/undefined|“”/)
  })
})
