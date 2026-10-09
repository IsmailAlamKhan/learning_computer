import { render } from '@testing-library/react'
import { MOCKS, regionBoxes } from '../mocks'
import { H, RING_STROKE, ringBox, W } from '../mocks/kit'
import { MOCK_NAMES, MOCK_REGIONS } from '../names'

describe('MOCKS', () => {
  it('has a component for every mock name, and boxes for every region', () => {
    for (const n of MOCK_NAMES) {
      expect(MOCKS[n]).toBeTypeOf('function')
      for (const os of ['windows', 'mac'] as const) expect(Object.keys(regionBoxes(n, os)).sort()).toEqual([...MOCK_REGIONS[n]].sort())
    }
  })
  it('renders plain and every highlighted region with a Bengali aria-label and no console errors', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    for (const n of MOCK_NAMES) {
      const M = MOCKS[n]
      const plain = render(<M />)
      const base = plain.getByRole('img').getAttribute('aria-label')!
      expect(base).toMatch(/[ঀ-৿]/)
      expect(plain.container.querySelector('[data-ring]')).toBeNull()
      plain.unmount()
      for (const r of MOCK_REGIONS[n]) {
        const v = render(<M highlight={r} />)
        const label = v.getByRole('img').getAttribute('aria-label')!
        expect(label).toContain('চিহ্নিত')
        expect(label).not.toBe(base)
        expect(v.container.querySelector(`[data-ring="${r}"]`)).not.toBeNull()
        v.unmount()
      }
    }
    expect(err).not.toHaveBeenCalled()
    err.mockRestore()
  })
  it('ignores an unknown highlight', () => {
    const M = MOCKS['win-desktop']
    const v = render(<M highlight="nope" />)
    expect(v.container.querySelector('[data-ring]')).toBeNull()
  })
  it('switches style with os for shared names', () => {
    const M = MOCKS['context-menu']
    const w = render(<M os="windows" />).container.textContent
    const m = render(<M os="mac" />).container.textContent
    expect(w).toContain('Delete')
    expect(m).toContain('Move to Trash')
  })
})

describe('highlight ring stays inside the drawing', () => {
  it('region boxes and the ring (with its thick glow stroke) fit the 480×300 viewBox for every mock, region and OS', () => {
    for (const n of MOCK_NAMES)
      for (const os of ['windows', 'mac'] as const)
        for (const [name, b] of Object.entries(regionBoxes(n, os))) {
          const where = `${n}/${os}/${name}`
          expect(b.x, where).toBeGreaterThanOrEqual(0)
          expect(b.y, where).toBeGreaterThanOrEqual(0)
          expect(b.x + b.w, where).toBeLessThanOrEqual(W)
          expect(b.y + b.h, where).toBeLessThanOrEqual(H)
          const r = ringBox(b)
          const half = RING_STROKE / 2
          expect(r.x - half, where).toBeGreaterThanOrEqual(0)
          expect(r.y - half, where).toBeGreaterThanOrEqual(0)
          expect(r.x + r.w + half, where).toBeLessThanOrEqual(W)
          expect(r.y + r.h + half, where).toBeLessThanOrEqual(H)
          expect(r.w, where).toBeGreaterThan(0)
          expect(r.x, where).toBeLessThanOrEqual(b.x + half + 1) // still surrounds the region (up to the edge inset)
          expect(r.x + r.w, where).toBeGreaterThanOrEqual(b.x + b.w - half - 1)
        }
  })
})
