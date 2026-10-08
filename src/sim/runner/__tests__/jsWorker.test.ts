// @vitest-environment node
/// <reference types="node" />
import vm from 'node:vm'
import { JS_WORKER_SOURCE } from '../jsWorkerSource'

interface Reply {
  type: string
  output: string
  error?: { name: string; message: string; line?: number }
  needInput?: { prompt: string }
}

/** Evaluate the real worker script against a fake worker scope and run one message through it. */
function run(code: string, inputs: string[] = [], cap = 100000): Promise<Reply> {
  return new Promise((resolve) => {
    const scope: Record<string, unknown> = { postMessage: (m: Reply) => resolve(m), fetch: () => 'net', XMLHttpRequest: class {}, Promise, Map, Set, Date, Error, Object }
    scope.self = scope
    vm.runInNewContext(JS_WORKER_SOURCE, scope)
    ;(scope.onmessage as (e: unknown) => void)({ data: { code, inputs, cap } })
  })
}

describe('JS worker script', () => {
  it('console.log joins args like node', async () => {
    const r = await run(`console.log('a', 1, true, null, undefined)\nconsole.log([1,'x'], {k: 'v', n: 2})\nconsole.error('bad')\nconsole.warn('w')`)
    expect(r.output).toBe("a 1 true null undefined\n[ 1, 'x' ] { k: 'v', n: 2 }\nbad\nw")
    expect(r.error).toBeUndefined()
  })
  it('Bengali strings stay raw', async () => expect((await run(`console.log('হ্যালো')`)).output).toBe('হ্যালো'))
  it('alert prints', async () => expect((await run(`alert('hey')`)).output).toBe('hey'))
  it('prompt replays inputs in order', async () => {
    const r = await run(`const a = prompt('a?'); const b = prompt('b?'); console.log(a + b)`, ['x', 'y'])
    expect(r.output).toBe('xy')
  })
  it('exhausted prompt -> needInput and earlier output discarded', async () => {
    const r = await run(`console.log('before'); const a = prompt('first?'); console.log(a); prompt('second?')`, ['one'])
    expect(r.needInput).toEqual({ prompt: 'second?' })
    expect(r.output).toBe('')
  })
  it('needInput wins even if the program swallows the abort', async () => {
    const r = await run(`try { prompt('q') } catch (e) {} console.log('after')`)
    expect(r.needInput).toEqual({ prompt: 'q' })
  })
  it('top-level await works', async () => expect((await run(`const v = await Promise.resolve(5); console.log(v)`)).output).toBe('5'))
  it('runtime error maps to the learner line', async () => {
    const r = await run(`let a = 1\nlet b = 2\nconsole.log(c)`)
    expect(r.error).toMatchObject({ name: 'ReferenceError', message: 'c is not defined', line: 3 })
  })
  it('error inside a function maps to the innermost learner line', async () => {
    const r = await run(`function f() {\n  null.x\n}\nf()`)
    expect(r.error).toMatchObject({ name: 'TypeError', line: 2 })
  })
  it('syntax error: unclosed call points at the opening line', async () => {
    const r = await run(`let a = 1\nconsole.log("x"\nlet b = 2`)
    expect(r.error).toMatchObject({ name: 'SyntaxError', line: 2 })
  })
  it('syntax error: unexpected end of input points at the last line', async () => {
    const r = await run(`function f() {\n  return 1\n`)
    expect(r.error).toMatchObject({ name: 'SyntaxError', line: 2 })
  })
  it('output cap stops the program', async () => {
    const r = await run(`while (true) console.log('x'.repeat(100))`, [], 1000)
    expect(r.error?.name).toBe('OutputLimitExceeded')
    expect(r.output.length).toBeLessThanOrEqual(1000)
  })
  it('network and postMessage are not reachable from user code', async () => {
    const r = await run(`console.log(typeof fetch, typeof XMLHttpRequest, typeof postMessage, typeof self.postMessage)`)
    expect(r.output).toBe('undefined undefined undefined undefined')
  })
  it('thrown non-Error values are reported', async () => {
    expect((await run(`throw 'oops'`)).error).toMatchObject({ name: 'Error', message: 'oops' })
  })
})
