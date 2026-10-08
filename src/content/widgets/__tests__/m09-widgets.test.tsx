import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PasswordStrength from '../password-strength'
import PhishingLinkCheck from '../phishing-link-check'
import SpotTheScam from '../spot-the-scam'
import { CARDS } from '../lib/scamCards'

describe('password-strength widget', () => {
  it('warns that real passwords must not be typed and gives live feedback', () => {
    render(<PasswordStrength />)
    expect(screen.getByRole('note').textContent).toContain('আসল পাসওয়ার্ড লিখবেন না')
    fireEvent.change(screen.getByTestId('pw-input'), { target: { value: '123456' } })
    expect(screen.getByTestId('pw-label').getAttribute('data-level')).toBe('veryWeak')
    fireEvent.change(screen.getByTestId('pw-input'), { target: { value: 'blue tea river chair' } })
    expect(screen.getByTestId('pw-label').getAttribute('data-level')).toBe('strong')
  })
})

describe('phishing-link-check widget', () => {
  it('shows the real address on hover and judges it', () => {
    render(<PhishingLinkCheck />)
    fireEvent.mouseEnter(screen.getByTestId('link-b'))
    expect(screen.getByTestId('status-bar').textContent).toContain('takapay-verify.example')
    fireEvent.click(screen.getByTestId('reveal-b'))
    expect(screen.getByTestId('result-b').getAttribute('data-bad')).toBe('yes')
    fireEvent.click(screen.getByTestId('reveal-a'))
    expect(screen.getByTestId('result-a').getAttribute('data-bad')).toBe('no')
  })
})

describe('spot-the-scam widget', () => {
  it('plays all cards and shows a score', () => {
    render(<SpotTheScam />)
    CARDS.forEach((c) => {
      fireEvent.click(screen.getByTestId(c.isScam ? 'verdict-scam' : 'verdict-safe'))
      expect(screen.getByTestId('scam-feedback').getAttribute('data-correct')).toBe('yes')
      fireEvent.click(screen.getByTestId('scam-next'))
    })
    expect(screen.getByTestId('scam-result').textContent).toContain(`${CARDS.length} / ${CARDS.length}`)
  })
  it('wrong answers get a gentle message, not an error', () => {
    render(<SpotTheScam />)
    fireEvent.click(screen.getByTestId('verdict-safe'))
    expect(screen.getByTestId('scam-feedback').getAttribute('data-correct')).toBe('no')
    expect(screen.getByTestId('scam-feedback').textContent).toContain('শেখা')
  })
})
