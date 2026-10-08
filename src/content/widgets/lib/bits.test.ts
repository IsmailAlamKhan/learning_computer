import { describe, expect, it } from 'vitest'
import { bitsToString, bitsToValue, charFor, checkChallenge, codeOf, toggleBit, valueToBits } from './bits'

describe('bits logic', () => {
  it('converts value <-> bits', () => {
    expect(bitsToValue(valueToBits(5))).toBe(5)
    expect(bitsToString(valueToBits(5))).toBe('00000101')
    expect(bitsToString(valueToBits(65))).toBe('01000001')
    expect(bitsToValue(Array(8).fill(true))).toBe(255)
    for (let n = 0; n < 256; n++) expect(bitsToValue(valueToBits(n))).toBe(n)
  })
  it('toggles one bit', () => {
    expect(bitsToValue(toggleBit(valueToBits(0), 7))).toBe(1)
    expect(bitsToValue(toggleBit(valueToBits(1), 7))).toBe(0)
  })
  it('looks up characters', () => {
    expect(charFor(65).char).toBe('A')
    expect(charFor(97).char).toBe('a')
    expect(charFor(5).char).toBeNull()
  })
  it('knows unicode code points', () => {
    expect(codeOf('অ')).toBe(2437)
    expect(codeOf('😀')).toBe(0x1f600)
  })
  it('gives gentle challenge feedback', () => {
    expect(checkChallenge(10, valueToBits(10)).ok).toBe(true)
    expect(checkChallenge(10, valueToBits(8)).messageBn).toContain('আরও 2')
    expect(checkChallenge(10, valueToBits(16)).ok).toBe(false)
  })
})
