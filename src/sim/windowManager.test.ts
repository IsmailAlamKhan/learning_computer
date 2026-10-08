import { describe, expect, it } from 'vitest'
import { activeWindow, initialWm, wmReducer, MIN_W, type WmAction, type WmState } from './windowManager'
import { comboFromEvent, normalizeCombo, systemAction } from './shortcuts'

const B = { w: 1000, h: 600, top: 0, bottom: 48 }
const run = (actions: WmAction[], s: WmState = initialWm(B)) => actions.reduce(wmReducer, s)
const open = (id: string): WmAction => ({ type: 'open', id, app: id, title: id })

describe('window manager', () => {
  it('opens windows and focuses the newest', () => {
    const s = run([open('a'), open('b')])
    expect(activeWindow(s)?.id).toBe('b')
    expect(s.windows).toHaveLength(2)
  })

  it('re-opening an existing window focuses and restores it', () => {
    let s = run([open('a'), open('b'), { type: 'minimize', id: 'a' }])
    expect(activeWindow(s)?.id).toBe('b')
    s = wmReducer(s, open('a'))
    expect(activeWindow(s)?.id).toBe('a')
    expect(s.windows.filter((w) => w.id === 'a')).toHaveLength(1)
  })

  it('minimizing the active window activates the next one', () => {
    const s = run([open('a'), open('b'), { type: 'minimize', id: 'b' }])
    expect(activeWindow(s)?.id).toBe('a')
  })

  it('closing removes a window and its focus record', () => {
    const s = run([open('a'), open('b'), { type: 'close', id: 'b' }])
    expect(s.windows.map((w) => w.id)).toEqual(['a'])
    expect(activeWindow(s)?.id).toBe('a')
  })

  it('raises z-order on focus', () => {
    const s = run([open('a'), open('b'), { type: 'focus', id: 'a' }])
    const z = Object.fromEntries(s.windows.map((w) => [w.id, w.z]))
    expect(z.a).toBeGreaterThan(z.b)
  })

  it('maximizes to the free area and restores the old rectangle', () => {
    let s = run([{ type: 'open', id: 'a', app: 'a', title: 'a', x: 100, y: 80, w: 500, h: 300 }])
    s = wmReducer(s, { type: 'toggleMaximize', id: 'a' })
    const m = s.windows[0]
    expect(m).toMatchObject({ maximized: true, x: 0, y: 0, w: 1000, h: 552 })
    s = wmReducer(s, { type: 'toggleMaximize', id: 'a' })
    expect(s.windows[0]).toMatchObject({ maximized: false, x: 100, y: 80, w: 500, h: 300 })
  })

  it('respects top inset (Mac menu bar) when maximizing', () => {
    let s = run([open('a')], initialWm({ w: 1000, h: 600, top: 28, bottom: 0 }))
    s = wmReducer(s, { type: 'toggleMaximize', id: 'a' })
    expect(s.windows[0]).toMatchObject({ y: 28, h: 572 })
  })

  it('enforces a minimum size and ignores moves of maximized windows', () => {
    let s = run([open('a')])
    s = wmReducer(s, { type: 'resize', id: 'a', x: 10, y: 10, w: 50, h: 50 })
    expect(s.windows[0].w).toBe(MIN_W)
    s = wmReducer(s, { type: 'toggleMaximize', id: 'a' })
    s = wmReducer(s, { type: 'move', id: 'a', x: 300, y: 300 })
    expect(s.windows[0].x).toBe(0)
  })

  it('keeps moved windows reachable', () => {
    let s = run([open('a')])
    s = wmReducer(s, { type: 'move', id: 'a', x: -5000, y: 9000 })
    const w = s.windows[0]
    expect(w.x + w.w).toBeGreaterThanOrEqual(80)
    expect(w.y).toBeLessThan(600)
  })

  it('cycles to the previously used window (Alt+Tab)', () => {
    let s = run([open('a'), open('b'), open('c')])
    s = wmReducer(s, { type: 'cycle' })
    expect(activeWindow(s)?.id).toBe('b')
    s = wmReducer(s, { type: 'cycle' })
    expect(activeWindow(s)?.id).toBe('c')
  })

  it('clicking the desktop leaves no active window until one is focused again', () => {
    let s = run([open('a'), { type: 'focusDesktop' }])
    expect(activeWindow(s)).toBeUndefined()
    s = wmReducer(s, { type: 'focus', id: 'a' })
    expect(activeWindow(s)?.id).toBe('a')
  })

  it('cycle with a single window changes nothing', () => {
    const s = run([open('a')])
    expect(wmReducer(s, { type: 'cycle' })).toBe(s)
  })

  it('cycle brings a minimized window back', () => {
    let s = run([open('a'), open('b'), { type: 'minimize', id: 'a' }])
    s = wmReducer(s, { type: 'cycle' })
    expect(activeWindow(s)?.id).toBe('a')
  })
})

describe('shortcuts', () => {
  it('maps mod to Ctrl on Windows and Cmd on Mac', () => {
    expect(normalizeCombo('mod+c', 'windows')).toBe('ctrl+c')
    expect(normalizeCombo('mod+c', 'mac')).toBe('cmd+c')
  })
  it('normalizes order and aliases', () => {
    expect(normalizeCombo('Shift+Control+Esc', 'windows')).toBe('ctrl+shift+esc')
    expect(normalizeCombo('cmd+option+esc', 'mac')).toBe('alt+cmd+esc')
    expect(normalizeCombo('win+d', 'windows')).toBe('cmd+d')
  })
  it('reads DOM events', () => {
    expect(comboFromEvent({ key: 'c', ctrlKey: true, altKey: false, shiftKey: false, metaKey: false })).toBe('ctrl+c')
    expect(comboFromEvent({ key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true, metaKey: false })).toBeNull()
    expect(comboFromEvent({ key: 'Tab', ctrlKey: false, altKey: true, shiftKey: false, metaKey: false })).toBe('alt+tab')
  })
  it('knows OS-specific system shortcuts', () => {
    expect(systemAction('alt+tab', 'windows')).toBe('switchWindow')
    expect(systemAction('cmd+tab', 'mac')).toBe('switchWindow')
    expect(systemAction('alt+tab', 'mac')).toBeUndefined()
    expect(systemAction('ctrl+cmd+q', 'mac')).toBe('lockScreen')
  })
})
