import { describe, expect, it } from 'vitest'
// @ts-expect-error plain .mjs script without types
import { scanProject, scanText } from '../scripts/check-privacy.mjs'

type Hit = { why: string }
describe('privacy guard (scripts/check-privacy.mjs)', () => {
  it('finds nothing forbidden in src/ and index.html', () => {
    expect(scanProject()).toEqual([])
  })
  it('flags network APIs, trackers and third-party URLs', () => {
    const bad = (code: string) => scanText('src/x.ts', code) as Hit[]
    expect(bad("await fetch('/a')").length).toBeGreaterThan(0)
    expect(bad('new XMLHttpRequest()').length).toBeGreaterThan(0)
    expect(bad("new WebSocket('wss://x')").length).toBeGreaterThan(0)
    expect(bad('navigator.sendBeacon(u)').length).toBeGreaterThan(0)
    expect(bad("gtag('config')").length).toBeGreaterThan(0)
    expect(bad('<script src="https://cdn.example.net/a.js">').length).toBeGreaterThan(0)
    expect(bad("const u = 'https://evil.com/x'").length).toBeGreaterThan(0)
  })
  it('allows fictional / reserved example hosts and plain scheme text', () => {
    const ok = (code: string) => scanText('src/x.ts', code)
    expect(ok("go('https://khobor.example/')")).toEqual([])
    expect(ok("href='https://example.com'")).toEqual([])
    expect(ok("startsWith('https://')")).toEqual([])
    expect(scanText('src/pwa/offline.ts', 'await fetch(u)')).toEqual([])
  })
})
