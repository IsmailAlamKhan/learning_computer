import { capOutput, createReplay, lockdownGlobals, parseJsStackLine, parsePythonTraceback } from '../helpers'

describe('capOutput', () => {
  it('keeps short text', () => expect(capOutput('abc', 10)).toEqual({ text: 'abc', truncated: false }))
  it('cuts long text', () => expect(capOutput('abcdef', 3)).toEqual({ text: 'abc', truncated: true }))
  it('exact length is not truncated', () => expect(capOutput('abc', 3).truncated).toBe(false))
})

describe('createReplay', () => {
  it('hands out answers in order then reports exhaustion', () => {
    const r = createReplay(['a', 'b'])
    expect(r.exhausted).toBe(false)
    expect(r.next()).toBe('a')
    expect(r.next()).toBe('b')
    expect(r.exhausted).toBe(true)
    expect(r.next()).toBeUndefined()
    expect(r.consumed).toBe(2)
  })
  it('no inputs means immediately exhausted', () => expect(createReplay().next()).toBeUndefined())
})

describe('parsePythonTraceback', () => {
  it('runtime error: last learner frame line, name, message', () => {
    const raw = 'Traceback (most recent call last):\n  File "<exec>", line 4, in <module>\n    print(y)\nNameError: name \'y\' is not defined\n'
    expect(parsePythonTraceback(raw)).toMatchObject({ name: 'NameError', message: "name 'y' is not defined", line: 4 })
  })
  it('nested frames: innermost learner frame wins', () => {
    const raw = 'Traceback (most recent call last):\n  File "<exec>", line 5, in <module>\n    f()\n  File "<exec>", line 2, in f\n    1/0\nZeroDivisionError: division by zero\n'
    expect(parsePythonTraceback(raw)).toMatchObject({ name: 'ZeroDivisionError', line: 2 })
  })
  it('syntax error with caret lines', () => {
    const raw = '  File "<exec>", line 3\n    print("a"\n         ^\nSyntaxError: \'(\' was never closed\n'
    expect(parsePythonTraceback(raw)).toMatchObject({ name: 'SyntaxError', message: "'(' was never closed", line: 3 })
  })
  it('dotted exception names keep the last part', () => {
    expect(parsePythonTraceback('json.decoder.JSONDecodeError: Expecting value').name).toBe('JSONDecodeError')
  })
  it('message-less exceptions', () => expect(parsePythonTraceback('Traceback (most recent call last):\n  File "<exec>", line 1, in <module>\nKeyboardInterrupt\n')).toMatchObject({ name: 'KeyboardInterrupt', message: '', line: 1 }))
})

describe('parseJsStackLine', () => {
  it('reads learner.js frames', () => expect(parseJsStackLine('ReferenceError: b\n    at learner.js:7:13\n    at x')).toBe(7))
  it('undefined when absent', () => expect(parseJsStackLine('Error: x\n at foo.js:1:1')).toBeUndefined())
})

describe('lockdownGlobals', () => {
  it('shadows network globals', () => {
    const scope: Record<string, unknown> = { fetch: () => 1, XMLHttpRequest: class {}, navigator: { sendBeacon: () => true } }
    lockdownGlobals(scope)
    expect(scope.fetch).toBeUndefined()
    expect(scope.XMLHttpRequest).toBeUndefined()
    expect((scope.navigator as { sendBeacon?: unknown }).sendBeacon).toBeUndefined()
  })
})
