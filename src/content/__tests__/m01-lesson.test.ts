import { describe, expect, it } from 'vitest'
import lesson from '../lessons/m01'
import glossary from '../glossary/m01'

describe('module 1 lesson (cards format)', () => {
  it('has three units with three quiz questions each', () => {
    expect(lesson.units.map((u) => u.id)).toEqual(['parts', 'mouse-touchpad', 'power'])
    for (const u of lesson.units) expect(u.quiz).toHaveLength(3)
  })

  it('keeps the power steps and their events', () => {
    const steps = lesson.units[2].steps
    const events = steps.flatMap((s) => (s.expectedAction.type === 'custom' ? [s.expectedAction.event] : []))
    expect(events.filter((e) => e === 'power-sleep')).toHaveLength(2)
    for (const e of ['power-wake', 'power-restart', 'power-shutdown', 'power-on']) expect(events).toContain(e)
    expect(steps.some((s) => s.target === 'start-power')).toBe(true)
    expect(steps.some((s) => s.target === 'menu-system')).toBe(true)
  })

  it('step ids are unique and the widgets are on cards (touchpad one only for touchpad users)', () => {
    const ids = lesson.units.flatMap((u) => u.steps.map((s) => s.id))
    expect(new Set(ids).size).toBe(ids.length)
    const cards = lesson.units.flatMap((u) => u.cards)
    expect(cards.find((c) => c.visual.kind === 'widget' && c.visual.widget === 'computer-parts')).toBeTruthy()
    const tp = cards.find((c) => c.visual.kind === 'widget' && c.visual.widget === 'touchpad-practice')
    expect(tp?.inputVariant).toBe('touchpad')
  })

  it('every glossary id used by the lesson exists', () => {
    const have = new Set(glossary.map((g) => g.id))
    for (const id of lesson.glossaryIds) expect(have.has(id)).toBe(true)
  })
})
