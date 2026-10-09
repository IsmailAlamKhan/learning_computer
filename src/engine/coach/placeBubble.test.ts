import { describe, expect, it } from 'vitest'
import { placeBubble } from './CoachOverlay'

const inter = (a: { left: number; top: number }, bw: number, bh: number, t: { x: number; y: number; w: number; h: number }) =>
  a.left < t.x + t.w && a.left + bw > t.x && a.top < t.y + t.h && a.top + bh > t.y

describe('placeBubble', () => {
  const W = 900, H = 600, bw = 300, bh = 120
  it('goes below a small target without covering it', () => {
    const t = { x: 100, y: 100, w: 80, h: 40 }
    const p = placeBubble(t, W, H, bw, bh)
    expect(inter(p, bw, bh, t)).toBe(false)
    expect(p.top).toBeGreaterThanOrEqual(t.y + t.h + 12)
  })
  it('goes above when there is no room below', () => {
    const t = { x: 300, y: 520, w: 80, h: 40 }
    const p = placeBubble(t, W, H, bw, bh)
    expect(p.top + bh).toBeLessThanOrEqual(t.y - 12)
  })
  it('stays inside the wrapper and clear of the target for many positions', () => {
    for (let x = 0; x < W - 60; x += 97)
      for (let y = 0; y < H - 40; y += 83) {
        const t = { x, y, w: 60, h: 40 }
        const p = placeBubble(t, W, H, bw, bh)
        expect(p.left).toBeGreaterThanOrEqual(8)
        expect(p.top).toBeGreaterThanOrEqual(8)
        expect(p.left + bw).toBeLessThanOrEqual(W - 8)
        expect(p.top + bh).toBeLessThanOrEqual(H - 8)
        expect(inter(p, bw, bh, t)).toBe(false)
      }
  })
  it('docks to a corner for a huge target', () => {
    const p = placeBubble({ x: 0, y: 0, w: W, h: H }, W, H, bw, bh)
    expect([8, W - bw - 8]).toContain(p.left)
    expect([8, H - bh - 8]).toContain(p.top)
  })
  it('docks a slim bar to the bottom on narrow wrappers, or the top when the target is there', () => {
    expect(placeBubble({ x: 20, y: 40, w: 60, h: 30 }, 390, 700, 374, 90)).toMatchObject({ bar: true, top: 700 - 90 - 8 })
    expect(placeBubble({ x: 20, y: 640, w: 60, h: 30 }, 390, 700, 374, 90)).toMatchObject({ bar: true, top: 8 })
  })
  it('centres at the top without a target', () => {
    expect(placeBubble(null, W, H, bw, bh).top).toBe(8)
  })
})
