import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import TypingPractice from '../typing-practice'
import SymbolDrill from '../symbol-drill'
import ShortcutTable from '../shortcut-table'
import KeyboardLayoutWidget from '../keyboard-layout'

describe('typing-practice widget', () => {
  it('marks a wrong character gently and finishes the exercise', () => {
    render(<TypingPractice />)
    const input = screen.getByTestId('typing-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'ax' } })
    const target = screen.getByTestId('typing-target')
    expect(target.querySelectorAll('[data-state="wrong"]').length).toBe(1)
    expect(screen.getByTestId('typing-message').textContent).toContain('Backspace')
    fireEvent.change(input, { target: { value: 'asdf jkl' } })
    expect(target.querySelectorAll('[data-state="wrong"]').length).toBe(0)
    expect(screen.getByRole('button', { name: /পরের অনুশীলন/ })).toBeTruthy()
    expect(screen.getByTestId('typing-accuracy').textContent).toMatch(/%/)
  })
  it('has the four levels', () => {
    render(<TypingPractice />)
    expect(screen.getAllByRole('tab')).toHaveLength(4)
  })
})

describe('symbol-drill widget', () => {
  it('detects the pressed character, with a hint for a missing Shift', () => {
    render(<SymbolDrill />)
    fireEvent.click(document.querySelector('[data-symbol="{"]')!)
    expect(screen.getByTestId('symbol-name').textContent).toContain('কার্লি ব্র্যাকেট')
    expect(screen.getByTestId('symbol-how').textContent).toContain('Shift')
    const input = screen.getByTestId('symbol-input')
    fireEvent.keyDown(input, { key: '[' })
    expect(screen.getByTestId('symbol-feedback').textContent).toContain('Shift')
    fireEvent.keyDown(input, { key: '{', shiftKey: true })
    expect(screen.getByTestId('symbol-feedback').textContent).toContain('ঠিক হয়েছে')
    expect(screen.getByTestId('symbol-progress').textContent).toMatch(/[1১] \//)
    fireEvent.keyDown(input, { key: 'Shift' }) // modifier alone is ignored
    expect(screen.getByTestId('symbol-feedback').textContent).toContain('ঠিক হয়েছে')
  })
  it('notices a Bangla keyboard', () => {
    render(<SymbolDrill />)
    fireEvent.keyDown(screen.getByTestId('symbol-input'), { key: 'ক' })
    expect(screen.getByTestId('symbol-feedback').textContent).toContain('বাংলা')
  })
})

describe('shortcut-table and keyboard-layout widgets', () => {
  it('render both OS columns', () => {
    render(<ShortcutTable />)
    const t = screen.getAllByTestId('shortcut-table')[0]
    expect(t.textContent).toContain('Ctrl+Y')
    expect(t.textContent).toContain('⌘ Command')
  })
  it('keyboard layout shows a key description on click', () => {
    const { container } = render(<KeyboardLayoutWidget />)
    fireEvent.click(container.querySelector('[data-key="caps"]')!)
    expect(container.textContent).toContain('Caps Lock: চালু থাকলে')
  })
})
