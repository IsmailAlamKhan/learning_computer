import { describe, expect, it } from 'vitest'
import { ALL_ROWS, EDIT_ROWS, formatAlternatives, formatCombo } from './shortcutData'

describe('shortcut data', () => {
  it('has the requested edit shortcuts', () => {
    for (const id of ['copy', 'paste', 'cut', 'undo', 'redo', 'select-all', 'save', 'find', 'open', 'new', 'print']) expect(EDIT_ROWS.some((r) => r.id === id)).toBe(true)
  })
  it('uses Ctrl on Windows and Command on Mac', () => {
    const copy = EDIT_ROWS.find((r) => r.id === 'copy')!
    expect(formatCombo(copy.win[0], 'windows')).toBe('Ctrl + C')
    expect(formatCombo(copy.mac[0], 'mac')).toBe('⌘ Command + C')
  })
  it('redo has two Windows forms and one Mac form', () => {
    const redo = EDIT_ROWS.find((r) => r.id === 'redo')!
    expect(formatAlternatives(redo.win, 'windows')).toContain('Ctrl + Y')
    expect(formatAlternatives(redo.win, 'windows')).toContain('Ctrl + Shift + Z')
    expect(formatAlternatives(redo.mac, 'mac')).toBe('⌘ Command + ⇧ Shift + Z')
  })
  it('ids are unique', () => {
    expect(new Set(ALL_ROWS.map((r) => r.id)).size).toBe(ALL_ROWS.length)
  })
})
