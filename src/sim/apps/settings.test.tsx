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
    fireEvent.click(rig.q('settings-wifi-connect')) // open network: Connect, no password
    expect(rig.d().sim.wifiNetwork).toBe('CafeGuest')
  })

  it('changes brightness, wallpaper, dark mode and language', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.change(rig.q('settings-brightness'), { target: { value: '30' } })
    expect(rig.d().sim.brightness).toBe(30)
    fireEvent.click(rig.q('settings-nav-personalization'))
    fireEvent.click(rig.q('settings-link-background'))
    fireEvent.click(rig.q('settings-wallpaper-2'))
    expect(rig.d().sim.wallpaper).toBe(2)
    fireEvent.click(rig.q('settings-crumb'))
    fireEvent.click(rig.q('settings-link-colors'))
    fireEvent.change(rig.q('settings-mode'), { target: { value: 'Dark' } })
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

  it('secured Wi-Fi asks for the practice password: wrong is gentle, right connects (Windows)', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.click(rig.q('settings-nav-network'))
    fireEvent.click(rig.q('settings-network-PracticeNet'))
    fireEvent.click(rig.q('settings-wifi-connect'))
    fireEvent.change(rig.q('settings-wifi-password'), { target: { value: 'nope' } })
    fireEvent.click(rig.q('settings-wifi-next'))
    expect(rig.q('settings-wifi-error').textContent).toMatch(/isn’t right/)
    expect(rig.d().sim.wifiNetwork).toBe('HomeWiFi')
    fireEvent.change(rig.q('settings-wifi-password'), { target: { value: 'practice123' } })
    fireEvent.click(rig.q('settings-wifi-next'))
    expect(rig.d().sim.wifiNetwork).toBe('PracticeNet')
    expect(has(rig.events(), { type: 'custom', event: 'wifi-connected' })).toBe(true)
    expect(rig.q('settings-network-PracticeNet').textContent).toContain('Connected')
  })

  it('Mac shows a password sheet with Join', () => {
    const rig = renderApp('mac', 'settings')
    fireEvent.click(rig.q('settings-nav-network'))
    fireEvent.click(rig.q('settings-network-PracticeNet'))
    expect(rig.has('settings-wifi-dialog')).toBe(true)
    fireEvent.click(rig.q('settings-wifi-join'))
    expect(rig.q('settings-wifi-error').textContent).toMatch(/password/)
    fireEvent.change(rig.q('settings-wifi-password'), { target: { value: 'practice123' } })
    fireEvent.click(rig.q('settings-wifi-join'))
    expect(rig.d().sim.wifiNetwork).toBe('PracticeNet')
    expect(rig.has('settings-wifi-dialog')).toBe(false)
  })

  it('volume slider: 0 mutes, high value emits volume-high', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.click(rig.q('settings-nav-sound'))
    fireEvent.change(rig.q('settings-volume'), { target: { value: '90' } })
    expect(rig.d().sim.volume).toBe(90)
    expect(has(rig.events(), { type: 'custom', event: 'volume-high' })).toBe(true)
    fireEvent.change(rig.q('settings-volume'), { target: { value: '0' } })
    expect(rig.d().sim.muted).toBe(true)
  })

  it('zoom is applied to window contents and restored at 100%', () => {
    const rig = renderApp('windows', 'settings')
    const content = () => rig.q('win-settings-content')
    expect(content().style.zoom).toBe('')
    fireEvent.change(rig.q('settings-zoom'), { target: { value: '150' } })
    expect(rig.d().sim.zoom).toBe(150)
    expect(content().style.zoom).toBe('1.5')
    fireEvent.change(rig.q('settings-zoom'), { target: { value: '100' } })
    expect(content().style.zoom).toBe('')
  })

  it('dark mode darkens window contents', () => {
    const rig = renderApp('mac', 'settings')
    fireEvent.click(rig.q('settings-nav-appearance'))
    fireEvent.click(rig.q('settings-darkMode'))
    expect(rig.q('win-settings-content').getAttribute('data-dark')).toBe('true')
  })

  it('Windows: pair a Bluetooth speaker through Add a device', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.click(rig.q('settings-nav-bluetooth'))
    fireEvent.click(rig.q('settings-bluetoothOn'))
    fireEvent.click(rig.q('settings-bt-add'))
    fireEvent.click(rig.q('settings-bt-kind'))
    fireEvent.click(rig.q('settings-bt-device-Practice Speaker'))
    expect(rig.q('settings-bt-ready').textContent).toContain('ready')
    fireEvent.click(rig.q('settings-bt-done'))
    expect(rig.d().sim.pairedDevices).toEqual(['Practice Speaker'])
    expect(rig.has('settings-bt-paired-Practice Speaker')).toBe(true)
  })

  it('Mac: Connect a nearby Bluetooth device', () => {
    const rig = renderApp('mac', 'settings')
    fireEvent.click(rig.q('settings-nav-bluetooth'))
    fireEvent.click(rig.q('settings-bluetoothOn'))
    fireEvent.click(rig.q('settings-bt-connect-Practice Speaker'))
    expect(rig.d().sim.pairedDevices).toEqual(['Practice Speaker'])
  })

  it('Windows: add a printer via Bluetooth & devices → Printers & scanners', () => {
    const rig = renderApp('windows', 'settings')
    expect(rig.d().sim.printers).toEqual([])
    fireEvent.click(rig.q('settings-nav-bluetooth'))
    fireEvent.click(rig.q('settings-link-printers'))
    fireEvent.click(rig.q('settings-printer-add'))
    fireEvent.click(rig.q('settings-printer-found-Practice Inkjet'))
    expect(rig.d().sim.printers).toEqual(['Practice Inkjet'])
    expect(rig.has('settings-printer-Practice Inkjet')).toBe(true)
  })

  it('Mac: Add Printer sheet needs a choice before Add works', () => {
    const rig = renderApp('mac', 'settings')
    fireEvent.click(rig.q('settings-nav-printers'))
    fireEvent.click(rig.q('settings-printer-add'))
    fireEvent.click(rig.q('settings-printer-confirm'))
    expect(rig.d().sim.printers).toEqual([])
    fireEvent.click(rig.q('settings-printer-pick-Practice Inkjet'))
    fireEvent.click(rig.q('settings-printer-confirm'))
    expect(rig.d().sim.printers).toEqual(['Practice Inkjet'])
  })

  it('timezone and 24-hour time', () => {
    const rig = renderApp('mac', 'settings')
    fireEvent.click(rig.q('settings-nav-time'))
    fireEvent.change(rig.q('settings-timezone'), { target: { value: 'America/New_York' } })
    expect(rig.d().sim.timezone).toBe('America/New_York')
    fireEvent.click(rig.q('settings-clock24'))
    expect(rig.d().sim.clock24).toBe(true)
  })

  it('Windows: 24-hour time lives in Language & region', () => {
    const w = renderApp('windows', 'settings')
    fireEvent.click(w.q('settings-nav-time'))
    fireEvent.click(w.q('settings-time-tab-language'))
    fireEvent.change(w.q('settings-timeformat'), { target: { value: '24' } })
    expect(w.d().sim.clock24).toBe(true)
  })
})
