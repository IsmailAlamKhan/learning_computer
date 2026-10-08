import { describe, expect, it } from 'vitest'
import { decodeShot, encodeShot, macShotName, rectFromDrag, screenshotName, winSnipName } from './screenshots'
import { countPages, parsePageRange } from './printing'

const d = new Date(2026, 9, 9, 15, 4, 7) // 9 Oct 2026, 3:04:07 PM

describe('screenshot names', () => {
  it('macOS style', () => {
    expect(macShotName(d)).toBe('Screenshot 2026-10-09 at 3.04.07 PM.png')
    expect(macShotName(new Date(2026, 0, 2, 0, 5, 9))).toBe('Screenshot 2026-01-02 at 12.05.09 AM.png')
  })
  it('Windows Snipping Tool style', () => {
    expect(winSnipName(d)).toBe('Screenshot 2026-10-09 150407.png')
  })
  it('Win+PrtScn numbers the files', () => {
    expect(screenshotName('windows', 'win-prtscn-file', d, [])).toBe('Screenshot (1).png')
    expect(screenshotName('windows', 'win-prtscn-file', d, ['Screenshot (1).png', 'Screenshot (2).png'])).toBe('Screenshot (3).png')
  })
  it('avoids clashes', () => {
    expect(screenshotName('mac', 'mac', d, ['Screenshot 2026-10-09 at 3.04.07 PM.png'])).toBe('Screenshot 2026-10-09 at 3.04.07 PM (2).png')
  })
})

describe('snapshot format and selection', () => {
  it('round-trips', () => {
    const s = { os: 'mac' as const, w: 900, h: 600, at: 1, wins: [{ title: 'Finder', x: 1, y: 2, w: 3, h: 4 }] }
    expect(decodeShot(encodeShot(s))).toEqual(s)
    expect(decodeShot('hello')).toBeNull()
    expect(decodeShot('shot:{bad')).toBeNull()
  })
  it('turns a drag into a clamped rectangle', () => {
    expect(rectFromDrag(100, 80, 40, 20, { w: 900, h: 600 })).toEqual({ x: 40, y: 20, w: 60, h: 60 })
    expect(rectFromDrag(850, 550, 1000, 700, { w: 900, h: 600 })).toEqual({ x: 850, y: 550, w: 50, h: 50 })
    expect(rectFromDrag(10, 10, 12, 12, { w: 900, h: 600 })).toBeNull()
  })
})

describe('print helpers', () => {
  it('counts pages', () => {
    expect(countPages('')).toBe(1)
    expect(countPages('a\n'.repeat(100))).toBe(3)
  })
  it('parses page ranges', () => {
    expect(parsePageRange('1', 3)).toBe(1)
    expect(parsePageRange('1-3', 3)).toBe(3)
    expect(parsePageRange('1,3', 3)).toBe(2)
    expect(parsePageRange('2-5', 3)).toBeNull()
    expect(parsePageRange('abc', 3)).toBeNull()
    expect(parsePageRange('0', 3)).toBeNull()
  })
})
