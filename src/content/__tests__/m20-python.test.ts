// @vitest-environment node
import { loadPyodide } from 'pyodide'
import { createPythonRunner } from '../../sim/runner/pythonCore'
import lesson, { PY_ASK, PY_CALC, PY_CHECK, PY_GREET, PY_HELLO, PY_LOOP, PY_NEXT, PY_OOPS, PY_PROJECT_MODEL } from '../lessons/m20'
import type { ExpectedAction } from '../../engine/types'

let run: ReturnType<typeof createPythonRunner>
beforeAll(async () => {
  run = createPythonRunner(await loadPyodide())
}, 120_000)

/** expected outputs declared by the lesson's codeOutputEquals steps, by step id */
const declared = (id: string): string[] => {
  const s = lesson.units.flatMap((u) => u.steps).find((x) => x.id === id)!
  const a = s.expectedAction as Extract<ExpectedAction, { type: 'codeOutputEquals' }>
  return Array.isArray(a.output) ? a.output : [a.output]
}
const out = (code: string, inputs: string[] = []) => {
  const r = run(code, inputs)
  expect(r.ok, JSON.stringify(r)).toBe(true)
  return r.output.trim()
}

describe('module 20 Python expectations match what the real interpreter prints', () => {
  it('py-print unit', () => {
    expect(declared('p1-run')).toContain(out(PY_HELLO))
    expect(declared('p1-line2')).toContain(out(PY_HELLO + 'print("My name is Rumi")\n'))
    expect(out(PY_GREET)).toBe('Hello, Rumi')
    expect(declared('p1-run2')).toContain(out(PY_GREET.replace('Rumi', 'Anika')))
    const bad = run(PY_OOPS, [])
    expect(bad.ok).toBe(false)
    expect(bad.error?.name).toBe('NameError')
    expect(declared('p4-fix')).toContain(out(PY_OOPS.replace('prnt', 'print')))
  })
  it('py-input unit', () => {
    expect(declared('p2-run-ask')).toContain(out(PY_ASK, ['Anika']))
    expect(out(PY_CALC).split('\n')[0]).toBe('100')
    expect(declared('p2-run-calc')).toContain(out(PY_CALC))
    expect(out(PY_NEXT, ['30'])).toBe('31')
    expect(declared('p2-run-next')).toContain('31')
  })
  it('py-logic unit', () => {
    expect(declared('p3-run')).toContain(out(PY_CHECK))
    expect(declared('p3-change')).toContain(out(PY_CHECK.replace('20', '15')))
    expect(declared('p3-edit')).toEqual(expect.arrayContaining([out(PY_CHECK.replace('20', '18')), out(PY_CHECK.replace('20', '3'))]))
    expect(declared('p4-run')).toContain(out(PY_LOOP))
    expect(out(PY_LOOP).split('\n')[0]).toBe('Hello 0')
    expect(declared('p4-five')).toContain(out(PY_LOOP.replace('range(3)', 'range(5)')))
  })
  it('proj-py model program runs for an adult and a minor', () => {
    expect(out(PY_PROJECT_MODEL, ['Anika', '30'])).toBe('Hello, Anika\nNext year you will be 31\nYou are an adult.')
    expect(out(PY_PROJECT_MODEL, ['Anika', '12'])).toBe('Hello, Anika\nNext year you will be 13\nYou are not an adult yet.')
  })
})

describe('every Python example the cards show, and every Python quiz answer, is what the interpreter prints', () => {
  it('code cards with python output', () => {
    // cards that need typed answers or an earlier line to be runnable on their own
    const extra: Record<string, { pre?: string; inputs?: string[] }> = {
      'c-in-input': { inputs: ['Anika'] },
      'c-in-int': { inputs: ['30'] },
      'c-pp-ask': { inputs: ['Anika', '30'] },
      'c-pp-if': { pre: 'age = 30\n' },
    }
    let checked = 0
    for (const c of lesson.units.flatMap((u) => u.cards)) {
      const v = c.visual
      if (v.kind !== 'code' || v.lang !== 'python' || !v.output) continue
      if (c.id === 'c-py-error') continue // shows a translated message, not output
      const ex = extra[c.id] ?? {}
      const code = (ex.pre ?? '') + v.lines.map((l) => l.code).join('\n') + '\n'
      const r = run(code, ex.inputs ?? [])
      expect(r.ok, c.id + JSON.stringify(r)).toBe(true)
      const printed = r.output.trim().split('\n')
      // the card's output lines may start with the question text of an input(); compare only the printed lines
      const shown = v.output.filter((o) => !/\?\s\S+$/.test(o))
      expect(printed.slice(-shown.length), c.id).toEqual(shown)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(10)
  })
  it('predictOutput quiz questions', () => {
    for (const q of lesson.units.flatMap((u) => u.quiz)) {
      if (q.type !== 'predictOutput') continue
      expect(q.acceptedAnswers, q.id).toContain(out(q.code))
    }
  })
})
