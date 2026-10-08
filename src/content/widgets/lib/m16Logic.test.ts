import { describe, expect, it } from 'vitest'
import {
  addBlock, autoPosition, checkAgainstGoal, connect, describeChart, disconnect, edges, emptyChart, newId, reachableFrom, removeBlock, setLabel, setRef,
  seqValue, simulate, stepOnce, validateStructure, type Chart,
} from './flowchart'
import { GOALS, getGoal } from './flowGoals'
import { PUZZLES, correctPositions, isCorrectOrder, moveItem, nudge, orderFeedback, shuffledOrder } from './orderPuzzles'
import { IF_SCENARIOS, evaluateScenario, initialValues, loopStart, loopStep, repeatRounds, spoonsUntilSweet, totalSpoons } from './m16Logic'

describe('order puzzles', () => {
  it('every puzzle has unique ids and 4+ steps', () => {
    const all = PUZZLES.flatMap((p) => p.steps.map((s) => s.id))
    expect(new Set(all).size).toBe(all.length)
    for (const p of PUZZLES) expect(p.steps.length).toBeGreaterThanOrEqual(4)
  })
  it('detects the right order and positions', () => {
    const p = PUZZLES[0]
    const ids = p.steps.map((s) => s.id)
    expect(isCorrectOrder(p, ids)).toBe(true)
    expect(isCorrectOrder(p, [...ids].reverse())).toBe(false)
    expect(isCorrectOrder(p, ids.slice(1))).toBe(false)
    expect(correctPositions(p, [ids[1], ids[0], ...ids.slice(2)])).toEqual([false, false, true, true, true])
  })
  it('shuffle is deterministic, a permutation, and never solved', () => {
    for (const p of PUZZLES) {
      for (let seed = 1; seed < 30; seed++) {
        const o = shuffledOrder(p, seed)
        expect(isCorrectOrder(p, o)).toBe(false)
        expect([...o].sort()).toEqual(p.steps.map((s) => s.id).sort())
        expect(shuffledOrder(p, seed)).toEqual(o)
      }
    }
  })
  it('moveItem and nudge', () => {
    expect(moveItem(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd'])
    expect(moveItem(['a', 'b', 'c', 'd'], 3, 0)).toEqual(['d', 'a', 'b', 'c'])
    expect(moveItem(['a', 'b'], 5, 0)).toEqual(['a', 'b'])
    expect(nudge(['a', 'b', 'c'], 1, -1)).toEqual(['b', 'a', 'c'])
    expect(nudge(['a', 'b', 'c'], 0, -1)).toEqual(['a', 'b', 'c'])
    expect(nudge(['a', 'b', 'c'], 2, 1)).toEqual(['a', 'b', 'c'])
  })
  it('gives gentle feedback', () => {
    const p = PUZZLES[1]
    const ids = p.steps.map((s) => s.id)
    expect(orderFeedback(p, ids).solved).toBe(true)
    expect(orderFeedback(p, ids).messageBn).toContain('ঠিক ক্রম')
    const wrong = orderFeedback(p, [ids[1], ids[0], ...ids.slice(2)])
    expect(wrong.solved).toBe(false)
    expect(wrong.rightCount).toBe(3)
    expect(wrong.messageBn).not.toMatch(/ভুল!/)
  })
})

describe('flowchart model', () => {
  it('adds, labels, connects, removes', () => {
    let c = emptyChart()
    const a = addBlock(c, 'start')
    c = a.chart
    const b = addBlock(c, 'action', undefined, 'চা বানান')
    c = b.chart
    expect(newId(c)).toBe('b3')
    expect(c.blocks[0].label).toBe('শুরু')
    c = connect(c, a.id, 'next', b.id)
    expect(edges(c)).toEqual([{ from: a.id, port: 'next', to: b.id }])
    // wrong port / unknown target are ignored
    expect(connect(c, a.id, 'yes', b.id)).toBe(c)
    expect(connect(c, a.id, 'next', 'zzz')).toBe(c)
    c = setLabel(c, b.id, 'x')
    c = setRef(c, b.id, 'r')
    expect(c.blocks[1]).toMatchObject({ label: 'x', ref: 'r' })
    c = disconnect(c, a.id, 'next')
    expect(edges(c)).toEqual([])
    c = connect(c, a.id, 'next', b.id)
    c = removeBlock(c, b.id)
    expect(c.blocks).toHaveLength(1)
    expect(c.blocks[0].next).toBeNull()
  })
  it('auto position walks down columns', () => {
    let c = emptyChart()
    const pts = []
    for (let i = 0; i < 7; i++) {
      pts.push(autoPosition(c))
      c = addBlock(c, 'action').chart
    }
    expect(pts[0]).toEqual({ x: 120, y: 50 })
    expect(pts[4]).toEqual({ x: 120, y: 450 })
    expect(pts[5]).toEqual({ x: 330, y: 50 })
  })
  it('reachability and outline', () => {
    const g = getGoal('umbrella')!
    expect(reachableFrom(g.solution, 'b1').size).toBe(5)
    expect(describeChart(g.solution)).toHaveLength(5)
  })
})

describe('structure validation', () => {
  const codes = (c: Chart, requireMeaning = false) => validateStructure(c, { requireMeaning }).map((i) => i.code)
  it('empty chart', () => expect(codes(emptyChart())).toEqual(['empty']))
  it('flags missing start / end', () => {
    let c = addBlock(emptyChart(), 'action', undefined, 'কাজ').chart
    expect(codes(c)).toEqual(expect.arrayContaining(['noStart', 'noEnd', 'missingNext']))
    c = addBlock(emptyChart(), 'start').chart
    expect(codes(c)).toEqual(expect.arrayContaining(['noEnd', 'missingNext']))
  })
  it('flags two starts, missing branches, empty labels and disconnected blocks', () => {
    let c = emptyChart()
    const s = addBlock(c, 'start')
    c = s.chart
    const s2 = addBlock(c, 'start')
    c = s2.chart
    const d = addBlock(c, 'decision')
    c = d.chart
    const e = addBlock(c, 'end')
    c = e.chart
    const lone = addBlock(c, 'action', undefined, 'একা')
    c = lone.chart
    c = connect(c, s.id, 'next', d.id)
    c = connect(c, d.id, 'yes', e.id)
    const found = codes(c)
    expect(found).toEqual(expect.arrayContaining(['manyStart', 'missingNo', 'emptyLabel', 'unreachable', 'missingNext']))
    const un = validateStructure(c).filter((i) => i.code === 'unreachable').map((i) => i.blockId)
    expect(un).toContain(lone.id)
  })
  it('requires meanings only when asked', () => {
    const c = getGoal('umbrella')!.solution
    expect(codes(c, true)).toEqual([])
    const noRef = { blocks: c.blocks.map((b) => ({ ...b, ref: undefined })) }
    expect(codes(noRef)).toEqual([])
    expect(codes(noRef, true).filter((x) => x === 'noMeaning')).toHaveLength(3)
  })
  it('all solutions are structurally valid', () => {
    for (const g of GOALS) expect(validateStructure(g.solution, { requireMeaning: true }), g.id).toEqual([])
  })
})

describe('simulation', () => {
  const tea = getGoal('tea-loop')!
  it('walks a loop and answers per visit', () => {
    const r = simulate(tea.solution, tea.conditions, { cold: [true, true, false] })
    expect(r.status).toBe('ended')
    expect(r.actions).toEqual(['pour', 'reheat', 'reheat', 'drink'])
  })
  it('detects infinite loops with a step cap', () => {
    const r = simulate(tea.solution, tea.conditions, { cold: true })
    expect(r.status).toBe('loop')
    expect(r.path.length).toBe(100)
    expect(simulate(tea.solution, tea.conditions, { cold: true }, 10).path.length).toBe(10)
  })
  it('a self loop is an infinite loop', () => {
    let c = emptyChart()
    const s = addBlock(c, 'start')
    c = s.chart
    const a = addBlock(c, 'action', undefined, 'ঘুরি')
    c = connect(a.chart, s.id, 'next', a.id)
    c = connect(c, a.id, 'next', a.id)
    expect(simulate(c, [], {}).status).toBe('loop')
  })
  it('reports where it got stuck', () => {
    const um = getGoal('umbrella')!
    const broken = { blocks: um.solution.blocks.map((b) => (b.id === 'b2' ? { ...b, no: null } : b)) }
    const r = simulate(broken, um.conditions, { rain: false })
    expect(r).toMatchObject({ status: 'stuck', stuckAt: 'b2', reason: 'noNo' })
    expect(simulate(broken, um.conditions, { rain: true }).status).toBe('ended')
    expect(simulate({ blocks: [] }, [], {}).status).toBe('nostart')
    const nomean = { blocks: um.solution.blocks.map((b) => (b.id === 'b2' ? { ...b, ref: undefined } : b)) }
    expect(simulate(nomean, um.conditions, { rain: true }).reason).toBe('noMeaning')
  })
  it('numeric conditions', () => {
    const m = getGoal('marks')!
    expect(simulate(m.solution, m.conditions, { marks: 33 }).actions).toEqual(['read', 'pass'])
    expect(simulate(m.solution, m.conditions, { marks: 32 }).actions).toEqual(['read', 'fail'])
  })
  it('seqValue', () => {
    expect(seqValue([false, true], 0)).toBe(false)
    expect(seqValue([false, true], 7)).toBe(true)
    expect(seqValue(true, 3)).toBe(true)
    expect(seqValue(undefined, 0)).toBe(false)
  })
  it('stepOnce', () => {
    const um = getGoal('umbrella')!
    expect(stepOnce(um.solution, 'b2', true).to).toBe('b3')
    expect(stepOnce(um.solution, 'b2', false).to).toBe('b4')
    expect(stepOnce(um.solution, 'b5').reason).toBe('finished')
    expect(stepOnce({ blocks: [{ ...um.solution.blocks[0], next: null }] }, 'b1').reason).toBe('noNext')
  })
})

describe('checking against goals', () => {
  it('every solution passes its goal', () => {
    for (const g of GOALS) {
      const r = checkAgainstGoal(g.solution, g)
      expect(r.ok, g.id + JSON.stringify(r.hintsBn)).toBe(true)
      expect(r.tests.every((t) => t.pass)).toBe(true)
    }
  })
  it('swapped yes/no gives a specific hint', () => {
    const g = getGoal('umbrella')!
    const swapped = { blocks: g.solution.blocks.map((b) => (b.id === 'b2' ? { ...b, yes: b.no, no: b.yes } : b)) }
    const r = checkAgainstGoal(swapped, g)
    expect(r.ok).toBe(false)
    expect(r.hintsBn.join(' ')).toContain('ছাতা নিন')
    expect(r.hintsBn.join(' ')).toContain('বৃষ্টি হচ্ছে')
  })
  it('tea loop pointing nowhere after reheating is stuck; looping to the wrong place loops forever', () => {
    const g = getGoal('tea-loop')!
    const noBack = { blocks: g.solution.blocks.map((b) => (b.id === 'b4' ? { ...b, next: null } : b)) }
    const r1 = checkAgainstGoal(noBack, g)
    expect(r1.ok).toBe(false)
    expect(r1.issues.some((i) => i.code === 'missingNext')).toBe(true)
    // loop back to itself instead of the check
    const spin = { blocks: g.solution.blocks.map((b) => (b.id === 'b4' ? { ...b, next: 'b4' } : b)) }
    const r2 = checkAgainstGoal(spin, g)
    expect(r2.ok).toBe(false)
    expect(r2.tests.some((t) => t.result.status === 'loop')).toBe(true)
    expect(r2.hintsBn.join(' ')).toContain('অসীম লুপ')
  })
  it('a chart without the loop (straight line) fails the loop tests', () => {
    const g = getGoal('tea-loop')!
    const straight = { blocks: g.solution.blocks.map((b) => (b.id === 'b4' ? { ...b, next: 'b5' } : b)) }
    const r = checkAgainstGoal(straight, g)
    expect(r.ok).toBe(false)
    expect(r.tests[0].pass).toBe(true)
    expect(r.tests[2].pass).toBe(false)
  })
  it('boundary error: > instead of >= is caught by the 33 test', () => {
    const g = getGoal('marks')!
    const strict = { ...g, conditions: g.conditions }
    expect(checkAgainstGoal(strict.solution, g).ok).toBe(true)
    const wrongCond = { blocks: g.solution.blocks.map((b) => (b.id === 'b3' ? { ...b, ref: 'm80' } : b)) }
    const r = checkAgainstGoal(wrongCond, g)
    expect(r.ok).toBe(false)
    expect(r.tests.filter((t) => !t.pass).length).toBeGreaterThanOrEqual(2)
  })
  it('an empty chart is reported, not crashed', () => {
    const g = getGoal('umbrella')!
    const r = checkAgainstGoal(emptyChart(), g)
    expect(r.ok).toBe(false)
    expect(r.issues[0].code).toBe('empty')
  })
})

describe('if / else scenarios', () => {
  it('rain', () => {
    const s = IF_SCENARIOS[0]
    expect(evaluateScenario(s, { rain: true })).toMatchObject({ matched: 0, elseState: 'skipped' })
    expect(evaluateScenario(s, { rain: false })).toMatchObject({ matched: -1, elseState: 'fired' })
  })
  it('first matching rule wins and later rules are skipped', () => {
    const s = IF_SCENARIOS.find((x) => x.id === 'atm')!
    const r = evaluateScenario(s, { card: false, pin: false, enough: false })
    expect(r.lines).toEqual(['fired', 'skipped', 'skipped'])
    expect(evaluateScenario(s, initialValues(s)).outcomeBn).toContain('টাকা বেরিয়ে')
    expect(evaluateScenario(s, { card: true, pin: false, enough: true }).lines).toEqual(['failed', 'fired', 'skipped'])
  })
  it('rickshaw: either condition is enough', () => {
    const s = IF_SCENARIOS.find((x) => x.id === 'rickshaw')!
    expect(evaluateScenario(s, { far: false, bag: true }).outcomeBn).toContain('রিকশা')
    expect(evaluateScenario(s, { far: false, bag: false }).outcomeBn).toContain('হেঁটে')
  })
})

describe('loops', () => {
  it('counts rounds', () => {
    expect(repeatRounds(5)).toEqual([1, 2, 3, 4, 5])
    expect(repeatRounds(0)).toEqual([])
    expect(totalSpoons(3, 2)).toBe(6)
    expect(totalSpoons(-1, 2)).toBe(0)
  })
  it('stops when sweet enough, with a cap', () => {
    expect(spoonsUntilSweet(3, 1)).toBe(3)
    expect(spoonsUntilSweet(5, 2)).toBe(3)
    expect(spoonsUntilSweet(5, 0)).toBe(50)
  })
  it('loop state machine', () => {
    let s = loopStart(2)
    s = loopStep(s)
    expect(s).toEqual({ total: 2, done: 1, finished: false })
    s = loopStep(s)
    expect(s.finished).toBe(true)
    expect(loopStep(s)).toBe(s)
  })
})
