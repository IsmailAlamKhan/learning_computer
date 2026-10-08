import { describe, expect, it } from 'vitest'
import { formatDateBn, num, toAscii } from './numerals'

describe('numerals', () => {
  it('converts to Bengali digits', () => expect(num(2025, 'bengali')).toBe('২০২৫'))
  it('keeps western digits', () => expect(num('12 জন', 'western')).toBe('12 জন'))
  it('round-trips to ascii', () => expect(toAscii('১২৩')).toBe('123'))
  it('formats dates', () => expect(formatDateBn(new Date(2026, 0, 5), 'bengali')).toBe('৫ জানুয়ারি ২০২৬'))
})
