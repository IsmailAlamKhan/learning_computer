import { afterEach, describe, expect, it } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'
import { getApp } from './registry'
import { CALC_FILE, CALC_ID, isInstalled, resetInstalls } from './extra/installState'
import { nextStage } from './extra/installer'
import { compute } from './extra/calcplus'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))
const wait = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)))

afterEach(() => resetInstalls())

describe('installer logic', () => {
  it('walks the stages in order', () => {
    expect(nextStage('store')).toBe('downloading')
    expect(nextStage('downloading')).toBe('welcome')
    expect(nextStage('welcome')).toBe('ready')
    expect(nextStage('ready')).toBe('installing')
    expect(nextStage('installing')).toBe('done')
    expect(nextStage('done')).toBe('done')
  })
  it('calculator maths', () => {
    expect(compute(2, '+', 3)).toBe(5)
    expect(compute(9, '÷', 0)).toBeNaN()
  })
})

describe('installer app', () => {
  it('download → Next → Install → Finish registers the app, then uninstall removes it', async () => {
    const rig = renderApp('windows', 'installer')
    expect(getApp(CALC_ID)).toBeUndefined()
    fireEvent.click(rig.q('installer-download'))
    await wait(1500)
    fireEvent.click(rig.q('installer-next'))
    fireEvent.click(rig.q('installer-install'))
    await wait(1500)
    expect(isInstalled()).toBe(true)
    expect(getApp(CALC_ID)).toBeDefined()
    fireEvent.click(rig.q('installer-finish'))
    expect(has(rig.events(), { type: 'custom', event: 'installer-finished' })).toBe(true)
    expect(rig.has('installer-finish')).toBe(false) // window closed itself
    // uninstall through Settings → Apps
    rig.open('settings')
    fireEvent.click(rig.q('settings-nav-apps'))
    fireEvent.click(rig.q('settings-app-menu-Calculator Plus'))
    fireEvent.click(rig.q('settings-app-uninstall-Calculator Plus'))
    fireEvent.click(rig.q('settings-uninstall-confirm'))
    expect(isInstalled()).toBe(false)
    expect(getApp(CALC_ID)).toBeUndefined()
    expect(has(rig.events(), { type: 'custom', event: 'app-uninstalled' })).toBe(true)
  })

  it('Mac: install adds the .app to Applications; moving it to the Trash uninstalls', async () => {
    const rig = renderApp('mac', 'installer')
    fireEvent.click(rig.q('installer-download'))
    await wait(1500)
    fireEvent.click(rig.q('installer-next'))
    fireEvent.click(rig.q('installer-install'))
    await wait(1500)
    const vfs = rig.d().vfs
    const apps = vfs.child(vfs.root, 'Applications')!
    const file = vfs.child(apps, CALC_FILE)!
    expect(file).toBeTruthy()
    act(() => void vfs.delete(file))
    expect(isInstalled()).toBe(false)
    expect(getApp(CALC_ID)).toBeUndefined()
  })

  it('Settings → Apps exists on Windows only', () => {
    const win = renderApp('windows', 'settings')
    expect(win.has('settings-nav-apps')).toBe(true)
    fireEvent.click(win.q('settings-nav-apps'))
    expect(win.has('settings-apps-empty')).toBe(true)
  })
})
