import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PromptAnatomy from '../prompt-anatomy'
import { folderPath, promptParts, promptText } from '../lib/promptAnatomy'

describe('promptAnatomy logic', () => {
  it('matches the practice terminal prompts', () => {
    expect(promptText('windows', 'Documents')).toBe('PS C:\\Users\\Anika\\Documents >')
    expect(promptText('mac', 'coding')).toBe('anika@Mac coding %')
    expect(promptText('mac', 'home')).toBe('anika@Mac ~ %')
  })
  it('builds absolute paths for both systems', () => {
    expect(folderPath('windows', 'home')).toBe('C:\\Users\\Anika')
    expect(folderPath('mac', 'Documents')).toBe('/Users/anika/Documents')
  })
  it('always has shell, folder and symbol parts', () => {
    for (const os of ['windows', 'mac'] as const) expect(promptParts(os, 'home').map((p) => p.id)).toEqual(['shell', 'folder', 'symbol'])
  })
})

describe('prompt-anatomy widget', () => {
  it('shows the folder explanation and updates when the folder or OS changes', () => {
    render(<PromptAnatomy />)
    expect(screen.getByTestId('prompt-info').textContent).toContain('এখনকার ফোল্ডার')
    fireEvent.click(document.querySelector('[data-os="mac"]')!)
    fireEvent.click(document.querySelector('[data-folder="coding"]')!)
    expect(screen.getByTestId('prompt-line').textContent).toContain('coding')
    fireEvent.click(document.querySelector('[data-part="symbol"]')!)
    expect(screen.getByTestId('prompt-info').textContent).toContain('%')
  })
})
