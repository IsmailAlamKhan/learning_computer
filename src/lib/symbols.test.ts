import { describe, expect, it } from 'vitest'
import { howToType, judgeKey, SYMBOLS, whereBn } from './symbols'
import { keyboardRows, locateChar, isSpacer } from './keyboardLayout'

describe('symbol data', () => {
  it('lists every symbol from the brief, each with a Bengali name', () => {
    const want = '{}[]()<>/\\|_-=+"\'`;:#@$%^&*~'.split('')
    expect(SYMBOLS.map((s) => s.char).sort()).toEqual([...want].sort())
    for (const s of SYMBOLS) expect(s.nameBn).toMatch(/[ঀ-৿]/)
    expect(SYMBOLS.find((s) => s.char === '{')?.nameBn).toContain('কার্লি ব্র্যাকেট')
  })
  it('every symbol can be located on the US keyboard', () => {
    for (const s of SYMBOLS) expect(howToType(s.char), s.char).not.toBeNull()
  })
})

describe('where / how to type (US layout)', () => {
  it.each([
    ['{', true, '['],
    ['}', true, ']'],
    ['[', false, '['],
    ['(', true, '9'],
    [')', true, '0'],
    ['<', true, ','],
    ['>', true, '.'],
    ['/', false, '/'],
    ['\\', false, '\\'],
    ['|', true, '\\'],
    ['_', true, '-'],
    ['-', false, '-'],
    ['=', false, '='],
    ['+', true, '='],
    ['"', true, "'"],
    ["'", false, "'"],
    ['`', false, '`'],
    ['~', true, '`'],
    [';', false, ';'],
    [':', true, ';'],
    ['#', true, '3'],
    ['@', true, '2'],
    ['$', true, '4'],
    ['%', true, '5'],
    ['^', true, '6'],
    ['&', true, '7'],
    ['*', true, '8'],
  ])('%s needs shift=%s on key %s', (c, shift, key) => {
    const h = howToType(c)!
    expect(h.needsShift).toBe(shift)
    expect(h.baseChar).toBe(key)
    expect(h.keys).toEqual(shift ? ['Shift', key] : [key])
  })
  it('gives a Bengali place description', () => {
    expect(whereBn('{')).toContain('“[”')
  })
  it('letters can be located too, and unknown characters cannot', () => {
    expect(locateChar('A')).toMatchObject({ keyId: 'a', shift: true })
    expect(locateChar('é')).toBeNull()
  })
})

describe('keyboard layout rows', () => {
  it('each main row is 15 units wide on both layouts', () => {
    for (const os of ['windows', 'mac'] as const) {
      const rows = keyboardRows(os).slice(1)
      for (const r of rows) expect(r.reduce((w, i) => w + (isSpacer(i) ? i.gap : i.w), 0)).toBeCloseTo(15, 5)
    }
  })
})

describe('judgeKey (uses KeyboardEvent.key)', () => {
  it('accepts the exact character', () => {
    expect(judgeKey('{', '{')).toEqual({ kind: 'correct' })
    expect(judgeKey('_', '_')).toEqual({ kind: 'correct' })
  })
  it('ignores modifier and control keys', () => {
    for (const k of ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Enter', 'Backspace', 'Tab', 'Dead', 'F5', 'ArrowLeft']) expect(judgeKey('{', k)).toEqual({ kind: 'ignore' })
  })
  it('explains a missing Shift and too much Shift', () => {
    expect(judgeKey('{', '[')).toEqual({ kind: 'needs-shift' })
    expect(judgeKey('_', '-')).toEqual({ kind: 'needs-shift' })
    expect(judgeKey('[', '{')).toEqual({ kind: 'too-much-shift' })
    expect(judgeKey('-', '_')).toEqual({ kind: 'too-much-shift' })
  })
  it('detects a Bangla keyboard and plain wrong keys', () => {
    expect(judgeKey('{', 'ক')).toEqual({ kind: 'non-latin' })
    expect(judgeKey('{', 'a')).toEqual({ kind: 'wrong' })
    expect(judgeKey('(', ')')).toEqual({ kind: 'wrong' })
  })
})
