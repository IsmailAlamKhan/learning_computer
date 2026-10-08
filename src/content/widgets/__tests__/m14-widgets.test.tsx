import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ToggleBits from '../toggle-bits'
import InputProcessOutput from '../input-process-output'
import KitchenAnalogy from '../kitchen-analogy'

describe('toggle-bits widget', () => {
  it('shows value and letter, and checks the challenge', () => {
    render(<ToggleBits />)
    fireEvent.click(screen.getByTestId('bit-1'))
    fireEvent.click(screen.getByTestId('bit-7'))
    expect(screen.getByTestId('bits-value').textContent).toBe('65')
    expect(screen.getByTestId('bits-char').textContent).toBe('A')
    fireEvent.click(screen.getByTestId('challenge-5'))
    expect(screen.getByTestId('bits-value').textContent).toBe('0')
    fireEvent.click(screen.getByTestId('bit-7'))
    expect(screen.getByTestId('challenge-feedback').getAttribute('data-ok')).toBe('no')
    fireEvent.click(screen.getByTestId('bit-5'))
    expect(screen.getByTestId('challenge-feedback').getAttribute('data-ok')).toBe('yes')
    expect(screen.getByTestId('unicode-2437').textContent).toContain('0985')
  })
})

describe('input-process-output widget', () => {
  it('dims stages a task does not need', () => {
    render(<InputProcessOutput />)
    expect(screen.getByTestId('io-stage-storage').getAttribute('data-used')).toBe('no')
    fireEvent.click(screen.getByTestId('io-scenario-photo'))
    expect(screen.getByTestId('io-stage-storage').getAttribute('data-used')).toBe('yes')
  })
})

describe('kitchen-analogy widget', () => {
  it('reveals the roles', () => {
    render(<KitchenAnalogy />)
    fireEvent.click(screen.getByTestId('kitchen-ram'))
    expect(screen.getByTestId('kitchen-detail').textContent).toContain('কাউন্টার')
  })
})
