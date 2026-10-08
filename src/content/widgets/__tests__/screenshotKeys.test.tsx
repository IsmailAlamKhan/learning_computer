import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScreenshotKeys from '../screenshot-keys'
import { SHOT_ROWS } from '../lib/screenshotKeys'

describe('screenshot-keys widget', () => {
  it('lists both operating systems', () => {
    render(<ScreenshotKeys />)
    expect(screen.getAllByText('PrtScn').length).toBe(2)
    expect(document.querySelector('[data-row="cmd-shift-4"]')).toBeTruthy()
    expect(document.querySelector('[data-row="win-shift-s"]')).toBeTruthy()
  })
  it('data is complete', () => {
    expect(SHOT_ROWS.windows.map((r) => r.id)).toEqual(['prtscn', 'win-prtscn', 'win-shift-s'])
    expect(SHOT_ROWS.mac).toHaveLength(3)
  })
})
