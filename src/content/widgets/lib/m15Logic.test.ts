import { describe, expect, it } from 'vitest'
import { LEVELS, runInstructions, solves, type Instr } from './exactInstructions'
import { LANGUAGE_CARDS } from './languageCards'
import { DEFAULT_ROADMAP, QUESTIONS, answeredCount, isComplete, recommend, tally } from './pathChooser'

describe('literal robot', () => {
  it('every level has a working solution', () => {
    for (const l of LEVELS) expect(solves(l, l.solution)).toBe(true)
  })
  it('does exactly what it is told, nothing more', () => {
    const r = runInstructions(LEVELS[0], ['F', 'F'])
    expect(r.final.pos).toEqual({ x: 2, y: 0 })
    expect(r.outcome).toBe('short')
  })
  it('an empty list does nothing', () => {
    expect(runInstructions(LEVELS[0], []).outcome).toBe('empty')
  })
  it('vague instructions are not guessed', () => {
    const r = runInstructions(LEVELS[0], ['VAGUE'])
    expect(r.final.pos).toEqual(LEVELS[0].start)
    expect(r.outcome).toBe('confused')
    expect(r.trace[0].problem).toBe(true)
  })
  it('a vague step does not stop the other steps', () => {
    const r = runInstructions(LEVELS[0], ['F', 'VAGUE', 'F', 'F'])
    expect(r.outcome).toBe('reached')
    expect(r.messageBn).toContain('পরিষ্কার')
  })
  it('walls and rocks stop the robot but the list continues', () => {
    const wall = runInstructions(LEVELS[0], ['L', 'F'])
    expect(wall.final.pos).toEqual({ x: 0, y: 0 })
    expect(wall.final.dir).toBe(0)
    expect(wall.trace[1].problem).toBe(true)
    const rock = runInstructions(LEVELS[2], ['F', 'F'])
    expect(rock.final.pos).toEqual({ x: 1, y: 0 })
    expect(rock.outcome).toBe('bumped')
  })
  it('turns wrap around', () => {
    const l: Instr[] = ['R', 'R', 'R', 'R']
    expect(runInstructions(LEVELS[0], l).final.dir).toBe(1)
    expect(runInstructions(LEVELS[0], ['L']).final.dir).toBe(0)
  })
})

describe('language cards', () => {
  it('four languages, 3-line examples and goodFor lists', () => {
    expect(LANGUAGE_CARDS.map((c) => c.id)).toEqual(['html', 'css', 'javascript', 'python'])
    for (const c of LANGUAGE_CARDS) {
      expect(c.code.split('\n').length).toBeLessThanOrEqual(3)
      expect(c.goodForBn.length).toBeGreaterThanOrEqual(3)
    }
    expect(LANGUAGE_CARDS.find((c) => c.id === 'python')!.code).toContain('রুমা')
  })
})

describe('path chooser', () => {
  const pick = (ids: string[]) => Object.fromEntries(QUESTIONS.map((q, i) => [q.id, ids[i]]))
  it('needs all questions answered', () => {
    expect(isComplete({})).toBe(false)
    expect(answeredCount({ make: 'page' })).toBe(1)
    expect(isComplete(pick(['page', 'design', 'see', 'hobby']))).toBe(true)
  })
  it('always starts with HTML/CSS', () => {
    for (const a of [['tool', 'data', 'read', 'career'], ['play', 'apps', 'see', 'business'], ['unsure', 'all', 'logic', 'hobby']]) {
      expect(recommend(pick(a)).roadmap.first).toBe('html-css')
    }
    expect(DEFAULT_ROADMAP.first).toBe('html-css')
  })
  it('data/automation interests lead to Python second, web/behaviour to JavaScript', () => {
    expect(recommend(pick(['tool', 'data', 'read', 'understand'])).roadmap.second).toBe('python')
    expect(recommend(pick(['play', 'apps', 'see', 'business'])).roadmap.second).toBe('javascript')
  })
  it('ties and unsure answers fall back to Python and still explain why', () => {
    const r = recommend(pick(['unsure', 'all', 'logic', 'hobby']))
    expect(tally(pick(['unsure', 'all', 'logic', 'hobby']))).toEqual({ web: 2, js: 1, python: 1 })
    expect(r.roadmap.second).toBe('python')
    expect(r.whyBn.length).toBeGreaterThanOrEqual(3)
  })
})
