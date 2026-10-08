import { toBengaliDigits, translateError } from '../errors'
import type { RunError } from '../types'

const e = (name: string, message: string, line?: number): RunError => ({ name, message, line, raw: `${name}: ${message}` })

const PY: [string, string][] = [
  ['SyntaxError', 'unterminated string literal (detected at line 1)'],
  ['SyntaxError', 'unterminated triple-quoted string literal (detected at line 4)'],
  ['SyntaxError', "'(' was never closed"],
  ['SyntaxError', "unmatched ')'"],
  ['SyntaxError', "closing parenthesis ']' does not match opening parenthesis '('"],
  ['SyntaxError', "expected ':'"],
  ['SyntaxError', 'invalid decimal literal'],
  ['SyntaxError', 'invalid syntax'],
  ['SyntaxError', 'invalid syntax. Perhaps you forgot a comma?'],
  ['IndentationError', "expected an indented block after 'if' statement on line 1"],
  ['IndentationError', 'unexpected indent'],
  ['IndentationError', 'unindent does not match any outer indentation level'],
  ['NameError', "name 'naam' is not defined"],
  ['TypeError', 'can only concatenate str (not "int") to str'],
  ['TypeError', "unsupported operand type(s) for +: 'int' and 'str'"],
  ['TypeError', "unsupported operand type(s) for -: 'str' and 'int'"],
  ['TypeError', "'int' object is not callable"],
  ['TypeError', 'f() missing 1 required positional argument: \'x\''],
  ['TypeError', 'f() takes 1 positional argument but 2 were given'],
  ['ZeroDivisionError', 'division by zero'],
  ['ValueError', "invalid literal for int() with base 10: 'abc'"],
  ['ValueError', 'could not convert string to float: \'x\''],
  ['IndexError', 'list index out of range'],
  ['KeyError', "'name'"],
  ['AttributeError', "'str' object has no attribute 'push'"],
  ['ModuleNotFoundError', "No module named 'numpyy'"],
  ['FileNotFoundError', "[Errno 44] No such file or directory: 'a.txt'"],
  ['EOFError', 'EOF when reading a line'],
  ['RecursionError', 'maximum recursion depth exceeded'],
  ['TimeoutError', 'ran too long'],
  ['OutputLimitExceeded', 'too much'],
  ['RunnerUnavailable', 'x'],
]
const JS: [string, string][] = [
  ['SyntaxError', 'Unexpected end of input'],
  ['SyntaxError', 'Invalid or unexpected token'],
  ['SyntaxError', 'missing ) after argument list'],
  ['SyntaxError', 'Unexpected identifier \'x\''],
  ['SyntaxError', "Unexpected token '}'"],
  ['ReferenceError', 'x is not defined'],
  ['TypeError', 'x is not a function'],
  ['TypeError', "Cannot read properties of undefined (reading 'length')"],
  ['TypeError', "Cannot read properties of null (reading 'y')"],
  ['TypeError', 'Assignment to constant variable.'],
  ['RangeError', 'Maximum call stack size exceeded'],
  ['TimeoutError', 'ran too long'],
]

const BENGALI = /[ঀ-৿]/
const FORBIDDEN = ['আপনি ভুল করেছেন', 'আপনার ভুল']

function check(lang: 'python' | 'javascript', name: string, msg: string) {
  const f = translateError(lang, e(name, msg, 3))
  expect(f.titleBn).toMatch(BENGALI)
  expect(f.explanationBn).toMatch(BENGALI)
  expect(f.tryBn).toMatch(BENGALI)
  for (const bad of FORBIDDEN) expect(f.explanationBn + f.titleBn + f.tryBn).not.toContain(bad)
  return f
}

describe('translateError', () => {
  it.each(PY)('python %s: %s', (n, m) => {
    const f = check('python', n, m)
    expect(f.titleBn).not.toBe('একটি সমস্যা হয়েছে') // a specific rule matched, not the generic fallback
    if (n !== 'TimeoutError' && n !== 'OutputLimitExceeded' && n !== 'RunnerUnavailable' && n !== 'EOFError') expect(f.explanationBn).toContain('লাইন ৩-এ')
  })
  it.each(JS)('javascript %s: %s', (n, m) => {
    const f = check('javascript', n, m)
    expect(f.titleBn).not.toBe('একটি সমস্যা হয়েছে')
  })
  it('names the missing identifier', () => {
    expect(translateError('python', e('NameError', "name 'colour' is not defined", 2)).titleBn).toContain("'colour'")
    expect(translateError('javascript', e('ReferenceError', 'total is not defined')).titleBn).toContain("'total'")
  })
  it('timeout wording', () => {
    expect(translateError('javascript', e('TimeoutError', 'x')).titleBn).toBe('প্রোগ্রামটি অনেকক্ষণ ধরে চলছে…')
  })
  it('falls back to a generic friendly message for unknown errors, without a line when unknown', () => {
    const f = translateError('python', e('WeirdError', 'boom'))
    expect(f.titleBn).toBe('একটি সমস্যা হয়েছে')
    expect(f.explanationBn).not.toContain('লাইন')
    expect(f.explanationBn).toContain('WeirdError')
  })
  it('does not mix languages', () => {
    expect(translateError('javascript', e('NameError', "name 'x' is not defined")).titleBn).toBe('একটি সমস্যা হয়েছে')
  })
  it('Bengali digits', () => {
    expect(toBengaliDigits(120)).toBe('১২০')
    expect(translateError('python', e('ZeroDivisionError', 'division by zero', 12)).explanationBn).toContain('লাইন ১২-এ')
  })
})
