import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ART_PART1 } from '../art/part1'
import type { ArtName } from '../names'

const NAMES = `laptop desktop-pc monitor keyboard mouse touchpad speaker webcam battery charger usb-stick power-button plug headphones printer phone tablet camera microphone router hard-drive chip ram-stick
desktop window folder folder-open file document image music video zip trash almirah path-map magnifier bookmark clipboard copy scissors paste undo save-disk pencil notebook taskbar dock start-button cursor-arrow hand-click
gear sun moon volume bluetooth clock calendar language paint-palette text-size
bug wrench refresh power freeze lightbulb question check cross sos`.split(/\s+/) as ArtName[]

describe('ART_PART1', () => {
  it('covers every assigned name', () => {
    expect(NAMES.length).toBe(71)
    for (const n of NAMES) expect(ART_PART1[n], n).toBeTypeOf('function')
  })
  it.each(NAMES)('%s renders an accessible 200x200 svg', (n) => {
    const A = ART_PART1[n]!
    const { container } = render(<A />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('role')).toBe('img')
    expect(svg.getAttribute('viewBox')).toBe('0 0 200 200')
    expect((svg.getAttribute('aria-label') ?? '').trim().length).toBeGreaterThan(0)
    expect(svg.querySelector('[id]')).toBeNull()
  })
})
