import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ComputerParts from '../computer-parts'
import TouchpadPractice from '../touchpad-practice'

describe('computer-parts widget', () => {
  it('shows description and progress when a part is clicked', () => {
    const { container } = render(<ComputerParts />)
    expect(screen.getByTestId('parts-progress').textContent).toContain('0/13')
    fireEvent.click(container.querySelector('[data-part="keyboard"]')!)
    expect(screen.getByTestId('parts-detail').textContent).toContain('Keyboard')
    expect(screen.getByTestId('parts-progress').textContent).toContain('1/13')
  })
  it('works from the keyboard', () => {
    const { container } = render(<ComputerParts />)
    fireEvent.keyDown(container.querySelector('[data-part="wifi"]')!, { key: 'Enter' })
    expect(screen.getByTestId('parts-detail').textContent).toContain('Wi')
  })
  it('runs the mini challenge with gentle feedback', () => {
    const { container } = render(<ComputerParts />)
    fireEvent.click(screen.getByTestId('parts-start-quiz'))
    expect(screen.getByTestId('parts-quiz').textContent).toContain('কিবোর্ড')
    fireEvent.click(container.querySelector('[data-part="monitor"]')!)
    expect(screen.getByTestId('parts-quiz').textContent).toContain('আবার চেষ্টা')
    for (const id of ['keyboard', 'mouse', 'power-button', 'charger']) fireEvent.click(container.querySelector(`[data-part="${id}"]`)!)
    expect(screen.getByTestId('parts-quiz-done')).toBeTruthy()
  })
})

describe('touchpad-practice widget', () => {
  it('ticks tap, double tap, right click, zoom buttons and scroll', () => {
    const { container } = render(<TouchpadPractice />)
    const done = (g: string) => container.querySelector(`[data-gesture="${g}"]`)!.getAttribute('data-done')
    const tap = screen.getByTestId('tp-tap-box')
    fireEvent.click(tap)
    expect(done('tap')).toBe('yes')
    fireEvent.doubleClick(tap)
    expect(done('doubleTap')).toBe('yes')
    fireEvent.contextMenu(screen.getByTestId('tp-right-box'))
    expect(done('rightTap')).toBe('yes')
    fireEvent.click(screen.getByTestId('tp-zoom-in'))
    expect(done('zoom')).toBe('no')
    fireEvent.click(screen.getByTestId('tp-zoom-in'))
    expect(done('zoom')).toBe('yes')
    const list = screen.getByTestId('tp-scroll-list')
    list.scrollTop = 120
    fireEvent.scroll(list)
    expect(done('scroll')).toBe('yes')
  })
  it('ctrl+wheel zooms but plain wheel does not', () => {
    render(<TouchpadPractice />)
    const photo = screen.getByTestId('tp-photo')
    fireEvent.wheel(photo, { deltaY: -100 })
    expect(screen.getByTestId('tp-zoom-value').textContent).toBe('100%')
    fireEvent.wheel(photo, { deltaY: -100, ctrlKey: true })
    expect(screen.getByTestId('tp-zoom-value').textContent).toBe('200%')
  })
})
