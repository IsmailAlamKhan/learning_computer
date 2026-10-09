import { describe, expect, it } from 'vitest'
import { classifyEvents, detectInputCapabilities, detectOs, initialInput, InputDetector, isNotch, type DetectEvent } from './device'

const wheel = (deltaY: number, t: number, o: Partial<DetectEvent & { type: 'wheel' }> = {}): DetectEvent => ({ type: 'wheel', deltaX: 0, deltaY, deltaMode: 0, ctrlKey: false, t, ...o }) as DetectEvent

describe('detectOs', () => {
  it('uses userAgentData first', () => {
    expect(detectOs({ userAgentData: { platform: 'Windows' }, platform: 'MacIntel' })).toBe('windows')
    expect(detectOs({ userAgentData: { platform: 'macOS' } })).toBe('mac')
  })
  it('falls back to navigator.platform, then the user agent', () => {
    expect(detectOs({ platform: 'Win32' })).toBe('windows')
    expect(detectOs({ platform: 'MacIntel', maxTouchPoints: 0 })).toBe('mac')
    expect(detectOs({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' })).toBe('windows')
    expect(detectOs({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari' })).toBe('mac')
  })
  it('returns null for phones, tablets, Linux and ChromeOS', () => {
    expect(detectOs({ platform: 'Linux x86_64' })).toBeNull()
    expect(detectOs({ userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)' })).toBeNull()
    expect(detectOs({ userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile' })).toBeNull()
    expect(detectOs({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' })).toBeNull()
    expect(detectOs({ platform: 'MacIntel', maxTouchPoints: 5, userAgent: 'Macintosh' })).toBeNull() // iPad desktop mode
    expect(detectOs({})).toBeNull()
  })
})

describe('capabilities', () => {
  const mm = (on: string[]) => (q: string) => ({ matches: on.includes(q) })
  it('desktop with a mouse', () => {
    const c = detectInputCapabilities(mm(['(pointer: fine)', '(hover: hover)']), 0)
    expect(c.touchOnly).toBe(false)
    expect(initialInput(c)).toBe('mouse')
  })
  it('phone / tablet is touch-only and treated as touchpad', () => {
    const c = detectInputCapabilities(mm(['(any-pointer: coarse)']), 5)
    expect(c.touchOnly).toBe(true)
    expect(initialInput(c)).toBe('touchpad')
  })
  it('no matchMedia → conservative mouse', () => {
    expect(initialInput(detectInputCapabilities(undefined, 0))).toBe('mouse')
  })
})

describe('wheel classifier', () => {
  it('knows notches', () => {
    expect(isNotch(100)).toBe(true)
    expect(isNotch(-120)).toBe(true)
    expect(isNotch(53)).toBe(true)
    expect(isNotch(3.5)).toBe(false)
    expect(isNotch(7)).toBe(false)
  })
  it('mouse notches → mouse', () => {
    const ev = Array.from({ length: 6 }, (_, i) => wheel(100, i * 400))
    expect(classifyEvents(ev).kind).toBe('mouse')
  })
  it('a fast-spun mouse wheel (identical steps, dense) is not a touchpad', () => {
    const ev = Array.from({ length: 12 }, (_, i) => wheel(120, i * 25))
    expect(classifyEvents(ev).kind).toBe('mouse')
  })
  it('line-mode wheel (Firefox) → mouse', () => {
    const ev = Array.from({ length: 4 }, (_, i) => wheel(3, i * 300, { deltaMode: 1 }))
    expect(classifyEvents(ev).kind).toBe('mouse')
  })
  it('smooth fractional scrolling → touchpad', () => {
    const ev = Array.from({ length: 10 }, (_, i) => wheel(2.5 + i * 1.7, i * 16))
    expect(classifyEvents(ev).kind).toBe('touchpad')
  })
  it('dense integer burst with varying deltas (inertia) → touchpad', () => {
    const ev = [4, 9, 16, 22, 25, 21, 15, 9, 5, 2].map((d, i) => wheel(d, i * 16))
    expect(classifyEvents(ev).kind).toBe('touchpad')
  })
  it('horizontal components → touchpad', () => {
    const ev = Array.from({ length: 4 }, (_, i) => wheel(6, i * 16, { deltaX: 3 }))
    expect(classifyEvents(ev).kind).toBe('touchpad')
  })
  it('pinch (ctrl+wheel, small deltas) → touchpad', () => {
    expect(classifyEvents([wheel(-2.3, 0, { ctrlKey: true }), wheel(-1.9, 16, { ctrlKey: true })]).kind).toBe('touchpad')
  })
  it('ctrl + mouse notch does not count as pinch', () => {
    expect(classifyEvents([wheel(100, 0, { ctrlKey: true }), wheel(100, 300, { ctrlKey: true })]).kind).toBeNull()
  })
  it('touch pointer → touchpad (no mouse)', () => {
    expect(classifyEvents([{ type: 'pointer', pointerType: 'touch', t: 0 }, { type: 'pointer', pointerType: 'touch', t: 500 }]).kind).toBe('touchpad')
  })
  it('mouse pointer events alone prove nothing', () => {
    expect(classifyEvents([{ type: 'pointer', pointerType: 'mouse', t: 0 }]).kind).toBeNull()
  })
  it('detector can flip back to mouse after reset', () => {
    const d = new InputDetector()
    for (let i = 0; i < 6; i++) d.feed(wheel(2.5 + i, i * 16))
    expect(d.verdict().kind).toBe('touchpad')
    d.reset()
    let v = d.verdict()
    for (let i = 0; i < 5; i++) v = d.feed(wheel(100, 5000 + i * 500))
    expect(v.kind).toBe('mouse')
  })
})
