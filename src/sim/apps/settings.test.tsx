import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))

describe('settings', () => {
  it('toggles Wi-Fi and emits selectOption', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.click(rig.q('settings-nav-network'))
    fireEvent.click(rig.q('settings-wifiOn'))
    expect(rig.d().sim.wifiOn).toBe(false)
    expect(has(rig.events(), { type: 'selectOption', target: 'setting-wifiOn', value: 'false' })).toBe(true)
    fireEvent.click(rig.q('settings-wifiOn'))
    fireEvent.click(rig.q('settings-network-CafeGuest'))
    expect(rig.d().sim.wifiNetwork).toBe('CafeGuest')
  })

  it('changes brightness, wallpaper, dark mode and language', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.change(rig.q('settings-brightness'), { target: { value: '30' } })
    expect(rig.d().sim.brightness).toBe(30)
    fireEvent.click(rig.q('settings-nav-personalization'))
    fireEvent.click(rig.q('settings-wallpaper-2'))
    expect(rig.d().sim.wallpaper).toBe(2)
    fireEvent.click(rig.q('settings-darkMode'))
    expect(rig.d().sim.darkMode).toBe(true)
    fireEvent.click(rig.q('settings-nav-time'))
    fireEvent.change(rig.q('settings-language'), { target: { value: 'বাংলা' } })
    expect(rig.d().sim.language).toBe('বাংলা')
  })

  it('Mac has a separate Appearance pane and System Settings title', () => {
    const rig = renderApp('mac', 'settings')
    expect(rig.d().wm.windows[0].title).toBe('System Settings')
    fireEvent.click(rig.q('settings-nav-appearance'))
    fireEvent.click(rig.q('settings-darkMode'))
    expect(rig.d().sim.darkMode).toBe(true)
    fireEvent.click(rig.q('settings-nav-about'))
    expect(rig.q('settings-about').textContent).toContain('Practice computer')
  })
})
