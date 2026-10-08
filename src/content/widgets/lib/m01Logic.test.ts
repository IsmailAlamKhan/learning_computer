import { describe, expect, it } from 'vitest'
import { CHALLENGE_IDS, PARTS, allSeen, challengeQuestion, checkChallenge, markSeen, seenLabel } from './computerParts'
import { GESTURES, allDone, buttonZoom, gestureToZoom, isInside, scrollReached, tick, wheelToZoom, zoomReached } from './touchpad'

describe('computerParts logic', () => {
  it('has the required parts', () => {
    for (const id of ['monitor', 'keyboard', 'mouse', 'touchpad', 'cpu', 'speakers', 'webcam', 'charger', 'charging-port', 'power-button', 'usb-port', 'wifi', 'battery']) {
      expect(PARTS.some((p) => p.id === id)).toBe(true)
    }
  })
  it('tracks seen parts without duplicates or unknown ids', () => {
    let s: string[] = []
    s = markSeen(s, 'mouse')
    s = markSeen(s, 'mouse')
    s = markSeen(s, 'nope')
    expect(s).toEqual(['mouse'])
    expect(seenLabel(s)).toBe(`1/${PARTS.length}`)
    expect(allSeen(s)).toBe(false)
    expect(allSeen(PARTS.map((p) => p.id))).toBe(true)
  })
  it('challenge questions and answers', () => {
    expect(challengeQuestion(0)).toContain('কিবোর্ড')
    expect(challengeQuestion(CHALLENGE_IDS.length)).toBeNull()
    expect(checkChallenge(0, 'keyboard')).toBe(true)
    expect(checkChallenge(0, 'mouse')).toBe(false)
  })
})

describe('touchpad logic', () => {
  it('ticks gestures once, in order', () => {
    let d = tick([], 'scroll')
    d = tick(d, 'tap')
    d = tick(d, 'tap')
    expect(d).toEqual(['tap', 'scroll'])
    expect(allDone(d)).toBe(false)
    expect(allDone(GESTURES)).toBe(true)
  })
  it('zoom math clamps', () => {
    expect(wheelToZoom(1, -100)).toBe(2)
    expect(wheelToZoom(1, 100)).toBe(1)
    expect(wheelToZoom(2.9, -500)).toBe(3)
    expect(buttonZoom(1, 1)).toBe(1.25)
    expect(buttonZoom(1, -1)).toBe(1)
    expect(gestureToZoom(1, 1.7)).toBe(1.7)
    expect(gestureToZoom(2, 5)).toBe(3)
    expect(zoomReached(1.25)).toBe(false)
    expect(zoomReached(1.5)).toBe(true)
  })
  it('scroll and hit-test', () => {
    expect(scrollReached(10)).toBe(false)
    expect(scrollReached(80)).toBe(true)
    const r = { left: 0, top: 0, right: 10, bottom: 10 }
    expect(isInside(5, 5, r)).toBe(true)
    expect(isInside(11, 5, r)).toBe(false)
  })
})
