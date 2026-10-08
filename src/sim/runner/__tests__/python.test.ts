// @vitest-environment node
import { loadPyodide } from 'pyodide'
import { createPythonRunner } from '../pythonCore'

let run: ReturnType<typeof createPythonRunner>
const t0 = Date.now()

beforeAll(async () => {
  const py = await loadPyodide()
  run = createPythonRunner(py)
  console.log(`[runner] Pyodide loaded in Node in ${Date.now() - t0} ms`)
}, 120_000)

describe('real Pyodide', () => {
  it('print', () => expect(run('print("hello")\nprint(1 + 2)', [])).toEqual({ ok: true, output: 'hello\n3\n' }))
  it('Bengali output', () => expect(run('print("হ্যালো দুনিয়া")', []).output).toBe('হ্যালো দুনিয়া\n'))
  it('input replay: needInput then second run', () => {
    const code = 'name = input("নাম কী? ")\nage = input("বয়স?")\nprint(name, age)'
    const first = run(code, [])
    expect(first).toMatchObject({ ok: false, needInput: { prompt: 'নাম কী? ' }, output: '' })
    const second = run(code, ['রিনা'])
    expect(second.needInput).toEqual({ prompt: 'বয়স?' })
    expect(run(code, ['রিনা', '১২'])).toEqual({ ok: true, output: 'রিনা ১২\n' })
  })
  it('SyntaxError with line', () => {
    const r = run('x = 1\nprint("a"\n', [])
    expect(r.ok).toBe(false)
    expect(r.error).toMatchObject({ name: 'SyntaxError', line: 2 })
    expect(r.error?.message).toContain('never closed')
  })
  it('unterminated string', () => {
    expect(run('print("abc)', []).error).toMatchObject({ name: 'SyntaxError', line: 1 })
  })
  it('NameError with line, internal frames hidden', () => {
    const r = run('a = 1\nb = 2\nprint(c)', [])
    expect(r.error).toMatchObject({ name: 'NameError', line: 3, message: expect.stringContaining("'c'") })
    expect(r.error?.raw).not.toContain('_learner_run')
    expect(r.error?.raw).not.toContain('<learner-runner>')
  })
  it('IndentationError', () => {
    const r = run('if True:\nprint(1)', [])
    expect(r.error).toMatchObject({ name: 'IndentationError', line: 2 })
    expect(r.error?.message).toContain('expected an indented block')
  })
  it('ZeroDivisionError inside a function reports the learner line', () => {
    const r = run('def f(x):\n    return 1 / x\n\nprint("start")\nf(0)', [])
    expect(r.error).toMatchObject({ name: 'ZeroDivisionError', line: 2 })
    expect(r.output).toBe('start\n')
  })
  it('state does not leak between runs', () => {
    run('leaked = 42\nimport math', [])
    expect(run('print(leaked)', []).error?.name).toBe('NameError')
    expect(run('print(math.pi)', []).error?.name).toBe('NameError')
  })
  it('stdout is restored after errors and input is not left patched', () => {
    run('1/0', [])
    expect(run('print("ok")', []).output).toBe('ok\n')
    expect(run('input()', []).needInput).toBeDefined()
  })
  it('js / pyodide / micropip imports are blocked', () => {
    for (const mod of ['js', 'pyodide.http', 'micropip', 'pyodide_js']) {
      const r = run(`import ${mod}`, [])
      expect(r.error?.name).toBe('ModuleNotFoundError')
      expect(r.error?.line).toBe(1)
    }
    expect(run('__import__("js")', []).error?.name).toBe('ModuleNotFoundError')
  })
  it('output cap aborts the program', () => {
    const r = run('while True:\n    print("x" * 500)', [], 5000)
    expect(r.error?.name).toBe('OutputLimitExceeded')
    expect(r.output.length).toBeLessThanOrEqual(5000)
  })
  it('a bare except cannot swallow the input request', () => {
    expect(run('try:\n    input("q")\nexcept Exception:\n    print("swallowed")', []).needInput).toEqual({ prompt: 'q' })
  })
  it('sys.exit ends quietly', () => expect(run('print(1)\nimport sys\nsys.exit()\nprint(2)', [])).toEqual({ ok: true, output: '1\n' }))
  it('RecursionError is reported', () => {
    expect(run('def f():\n    f()\nf()', []).error?.name).toBe('RecursionError')
  })
})
