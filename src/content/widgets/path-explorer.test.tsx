import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PathExplorer from './path-explorer'

const node = (c: HTMLElement, name: string) => c.querySelector(`[data-node="${name}"]`) as HTMLElement

describe('path-explorer widget', () => {
  it('builds absolute and relative paths as folders are clicked, and flips style', () => {
    const { container } = render(<PathExplorer />)
    expect(screen.getByTestId('abs-text').textContent).toBe('C:\\Users\\Anika\\Documents')
    expect(screen.getByTestId('rel-path').textContent).toBe('.')
    fireEvent.click(node(container, 'Family'))
    fireEvent.click(node(container, 'Birthdays.txt'))
    expect(screen.getByTestId('abs-text').textContent).toBe('C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt')
    expect(screen.getByTestId('rel-path').textContent).toBe('Family\\Birthdays.txt')
    expect(screen.getByTestId('challenge').textContent).toContain('চমৎকার')
    fireEvent.click(container.querySelector('[data-style="mac"]')!)
    expect(screen.getByTestId('abs-text').textContent).toBe('/Users/anika/Documents/Family/Birthdays.txt')
    expect(screen.getByTestId('home-path').textContent).toBe('~/Documents/Family/Birthdays.txt')
  })

  it('changes the current folder and shows .. paths', () => {
    const { container } = render(<PathExplorer />)
    fireEvent.click(container.querySelector('[data-style="mac"]')!)
    fireEvent.click(node(container, 'Pictures'))
    expect(screen.getByTestId('rel-path').textContent).toBe('../Pictures')
    fireEvent.click(container.querySelector('[data-action="set-current"]')!)
    fireEvent.click(node(container, 'Flower.png'))
    expect(screen.getByTestId('rel-path').textContent).toBe('Flower.png')
  })
})
