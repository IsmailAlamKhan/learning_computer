import { describe, expect, it } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'
import { getApp } from './registry'
import { buildRows, fakeUsage } from './extra/procLogic'
import { isFrozen } from './extra/stuckState'
import { getSystemShortcut } from '../systemActions'
import { resolveSite } from './browser/sites'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))

describe('procLogic', () => {
  it('builds one row per window, keys extra windows by id, flags frozen ones', () => {
    const rows = buildRows(
      [
        { id: 'editor', app: 'editor', title: 'A' },
        { id: 'editor#2', app: 'editor', title: 'B' },
        { id: 'stuckapp', app: 'stuckapp', title: 'C' },
      ],
      new Set(['stuckapp']),
      (a) => a.toUpperCase(),
    )
    expect(rows.map((r) => r.key)).toEqual(['editor', 'editor#2', 'stuckapp'])
    expect(rows[2].notResponding).toBe(true)
    expect(rows[0].name).toBe('EDITOR')
  })
  it('fake numbers are stable', () => {
    expect(fakeUsage('x', false)).toEqual(fakeUsage('x', false))
    expect(fakeUsage('x', true).cpu).toBe('24.8%')
  })
})

describe('registration', () => {
  it('apps and shortcuts exist', () => {
    renderApp('windows')
    expect(getApp('taskmgr')?.os).toBe('windows')
    expect(getApp('forcequit')?.os).toBe('mac')
    expect(getApp('stuckapp')).toBeDefined()
    expect(getSystemShortcut('windows', 'ctrl+shift+esc')).toBeDefined()
    expect(getSystemShortcut('mac', 'alt+cmd+esc')).toBeDefined()
  })
  it('the forum site matches only the PA-1042 question', () => {
    renderApp('windows')
    expect(resolveSite('https://answers.example/q/photo-album-could-not-open-error-code-pa-1042')).toBeDefined()
    expect(resolveSite('https://answers.example/q/something-else')).toBeUndefined()
  })
})

describe('Photo Album freezes; Windows Task Manager ends it', () => {
  it('click freezes, extra clicks are ignored, End task closes it', () => {
    const rig = renderApp('windows', 'stuckapp')
    expect(isFrozen('stuckapp')).toBe(false)
    fireEvent.click(rig.q('stuckapp-album'))
    expect(isFrozen('stuckapp')).toBe(true)
    expect(has(rig.events(), { type: 'custom', event: 'stuckapp-frozen' })).toBe(true)
    expect(rig.d().wm.windows[0].title).toBe('Photo Album (Not Responding)')
    fireEvent.click(rig.q('stuckapp-content'))
    expect(has(rig.events(), { type: 'custom', event: 'stuckapp-ignored' })).toBe(true)
    expect(rig.key('ctrl+shift+esc')).toBe(true)
    expect(rig.q('taskmgr-row-stuckapp').textContent).toContain('Not responding')
    expect((rig.q('taskmgr-end-task') as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(rig.q('taskmgr-row-stuckapp'))
    fireEvent.click(rig.q('taskmgr-end-task'))
    expect(rig.d().wm.windows.map((w) => w.app)).toEqual(['taskmgr'])
    expect(has(rig.events(), { type: 'closeApp', app: 'stuckapp' })).toBe(true)
    expect(isFrozen('stuckapp')).toBe(false)
  })
})

describe('Mac Force Quit', () => {
  it('shows a spinner, Force Quit needs confirmation, Cancel keeps the app', () => {
    const rig = renderApp('mac', 'stuckapp')
    fireEvent.click(rig.q('stuckapp-album'))
    expect(rig.has('stuckapp-spinner')).toBe(true)
    act(() => {
      rig.key('alt+cmd+esc')
    })
    expect(rig.q('forcequit-row-stuckapp').textContent).toContain('not responding')
    expect((rig.q('forcequit-button') as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(rig.q('forcequit-row-stuckapp'))
    fireEvent.click(rig.q('forcequit-button'))
    fireEvent.click(rig.q('forcequit-cancel'))
    expect(rig.d().wm.windows.some((w) => w.app === 'stuckapp')).toBe(true)
    fireEvent.click(rig.q('forcequit-button'))
    fireEvent.click(rig.q('forcequit-confirm'))
    expect(rig.d().wm.windows.some((w) => w.app === 'stuckapp')).toBe(false)
    expect(has(rig.events(), { type: 'closeApp', app: 'stuckapp' })).toBe(true)
  })
})
