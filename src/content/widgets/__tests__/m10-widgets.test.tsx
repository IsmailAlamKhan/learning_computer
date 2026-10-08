import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import SettingsMap from '../settings-map'
import { SETTING_ROWS } from '../lib/settingsMap'

describe('settings-map widget', () => {
  it('shows Windows and Mac paths for the chosen setting', () => {
    render(<SettingsMap />)
    const result = screen.getByTestId('settings-map-result')
    expect(result.querySelector('[data-os="windows"]')?.textContent).toContain('Personalization')
    expect(result.querySelector('[data-os="mac"]')?.textContent).toContain('Wallpaper')
    fireEvent.click(document.querySelector('[data-setting="printer"]')!)
    expect(result.querySelector('[data-os="windows"]')?.textContent).toContain('Printers & scanners')
    expect(result.querySelector('[data-os="mac"]')?.textContent).toContain('Add Printer')
  })

  it('every row names both operating systems', () => {
    for (const r of SETTING_ROWS) {
      expect(r.win.length).toBeGreaterThan(5)
      expect(r.mac.length).toBeGreaterThan(5)
    }
  })
})
