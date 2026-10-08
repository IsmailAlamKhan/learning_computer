// @vitest-environment node
import { loadPyodide } from 'pyodide'
import { createPythonRunner } from '../../sim/runner/pythonCore'
import lesson, { PY_ASK, PY_CALC, PY_CHECK, PY_GREET, PY_HELLO, PY_LOOP, PY_NEXT, PY_OOPS, PY_PROJECT } from '../lessons/m20'
import type { ExpectedAction } from '../../engine/types'

let run: ReturnType<typeof createPythonRunner>
beforeAll(async () => {
  run = createPythonRunner(await loadPyodide())
}, 120_000)

/** expected outputs declared by the lesson's codeOutputEquals steps, by step id */
const declared = (id: string): string[] => {
  const s = lesson.chapters!.flatMap((c) => c.steps).find((x) => x.id === id)!
  const a = s.expectedAction as Extract<ExpectedAction, { type: 'codeOutputEquals' }>
  return Array.isArray(a.output) ? a.output : [a.output]
}
const out = (code: string, inputs: string[] = []) => {
  const r = run(code, inputs)
  expect(r.ok, JSON.stringify(r)).toBe(true)
  return r.output.trim()
}

describe('module 20 Python expectations match what the real interpreter prints', () => {
  it('py-1', () => {
    expect(declared('p1-run')).toContain(out(PY_HELLO))
    expect(declared('p1-line2')).toContain(out(PY_HELLO + 'print("My name is Rumi")\n'))
    expect(out(PY_GREET)).toBe('Hello, Rumi')
    expect(declared('p1-run2')).toContain(out(PY_GREET.replace('Rumi', 'Anika')))
  })
  it('py-2', () => {
    expect(declared('p2-run-ask')).toContain(out(PY_ASK, ['Anika']))
    expect(out(PY_CALC).split('\n')[0]).toBe('100')
    expect(declared('p2-run-calc')).toContain(out(PY_CALC))
    expect(out(PY_NEXT, ['30'])).toBe('31')
    expect(declared('p2-run-next')).toContain('31')
  })
  it('py-3', () => {
    expect(declared('p3-run')).toContain(out(PY_CHECK))
    expect(declared('p3-change')).toContain(out(PY_CHECK.replace('20', '15')))
    expect(declared('p3-edit')).toEqual(expect.arrayContaining([out(PY_CHECK.replace('20', '18')), out(PY_CHECK.replace('20', '3'))]))
  })
  it('py-4', () => {
    expect(declared('p4-run')).toContain(out(PY_LOOP))
    expect(out(PY_LOOP).split('\n')[0]).toBe('Hello 0')
    expect(declared('p4-five')).toContain(out(PY_LOOP.replace('range(3)', 'range(5)')))
    const bad = run(PY_OOPS, [])
    expect(bad.ok).toBe(false)
    expect(bad.error?.name).toBe('NameError')
    expect(declared('p4-fix')).toContain(out(PY_OOPS.replace('prnt', 'print')))
  })
  it('proj-py model program runs for an adult and a minor', () => {
    const program = `${PY_PROJECT}name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint("Hello, " + name)\nprint("Next year you will be", age + 1)\nif age >= 18:\n    print("You are an adult.")\nelse:\n    print("You are not an adult yet.")\n`
    expect(out(program, ['Anika', '30'])).toBe('Hello, Anika\nNext year you will be 31\nYou are an adult.')
    expect(out(program, ['Anika', '12'])).toBe('Hello, Anika\nNext year you will be 13\nYou are not an adult yet.')
  })
  it('quiz predict answer', () => {
    expect(out('x = 4\nprint(x * 3)')).toBe('12')
  })
})
