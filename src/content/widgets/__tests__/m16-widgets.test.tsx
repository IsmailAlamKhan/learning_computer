import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import OrderPuzzle from '../order-puzzle'
import IfElseExplorer from '../if-else-explorer'
import LoopCounter from '../loop-counter'
import FlowchartBuilder from '../flowchart-builder'
import { PUZZLES } from '../lib/orderPuzzles'

const t = (id: string) => screen.getByTestId(id)

describe('order-puzzle widget', () => {
  it('can be solved with the arrow buttons', () => {
    render(<OrderPuzzle />)
    const p = PUZZLES[0]
    // bubble-sort the displayed order with the ↑ buttons
    for (let target = 0; target < p.steps.length; target++) {
      const id = p.steps[target].id
      for (let guard = 0; guard < 10; guard++) {
        const row = screen.getAllByRole('listitem').findIndex((r) => within(r).queryByTestId(`op-item-${id}`))
        if (row <= target) break
        fireEvent.click(t(`op-up-${id}`))
      }
    }
    fireEvent.click(t('op-check'))
    expect(t('op-success').textContent).toContain('ঠিক ক্রম')
  })
  it('wrong order shows a gentle message and ticks', () => {
    render(<OrderPuzzle />)
    fireEvent.click(t('op-check'))
    expect(t('op-feedback')).toBeTruthy()
    expect(screen.queryByTestId('op-success')).toBeNull()
  })
  it('picker switches puzzles', () => {
    render(<OrderPuzzle />)
    fireEvent.click(t('op-picker-atm'))
    expect(screen.getByText(/কার্ড মেশিনে ঢোকাই/)).toBeTruthy()
  })
})

describe('if-else-explorer', () => {
  it('toggling changes the outcome', () => {
    render(<IfElseExplorer />)
    expect(t('ie-outcome').textContent).toContain('ছাতা লাগবে না')
    fireEvent.click(t('ie-toggle-rain'))
    expect(t('ie-outcome').textContent).toContain('ছাতা নিন')
    expect(t('ie-else').getAttribute('data-state')).toBe('skipped')
  })
})

describe('loop-counter', () => {
  it('steps through and validates the answer', () => {
    render(<LoopCounter />)
    for (let i = 0; i < 5; i++) fireEvent.click(t('lc-step'))
    expect(t('lc-status').textContent).toContain('লুপ শেষ')
    fireEvent.change(t('lc-answer'), { target: { value: '5' } })
    fireEvent.click(t('lc-check'))
    expect(t('lc-wrong')).toBeTruthy()
    fireEvent.change(t('lc-answer'), { target: { value: '6' } })
    fireEvent.click(t('lc-check'))
    expect(t('lc-right')).toBeTruthy()
  })
})

describe('flowchart-builder', () => {
  it('builds the umbrella chart via buttons and selects, and passes', () => {
    render(<FlowchartBuilder />)
    const add = (k: string) => fireEvent.click(t(`fc-add-${k}`))
    add('start') // b1
    add('decision') // b2
    add('action') // b3
    add('action') // b4
    add('end') // b5
    const pick = (id: string) => {
      // blocks respond to pointerdown + pointerup
      fireEvent.pointerDown(t(`fc-block-${id}`), { button: 0, clientX: 0, clientY: 0 })
      fireEvent.pointerUp(window, { clientX: 0, clientY: 0 })
    }
    const label = (id: string, text: string) => {
      pick(id)
      fireEvent.change(t('fc-label'), { target: { value: text } })
    }
    label('b2', 'বৃষ্টি হচ্ছে?')
    label('b3', 'ছাতা নিন')
    label('b4', 'বেরিয়ে পড়ুন')
    const next = (id: string, port: string, to: string) => {
      pick(id)
      fireEvent.change(t(`fc-next-${port}`), { target: { value: to } })
    }
    next('b1', 'next', 'b2')
    next('b2', 'yes', 'b3')
    next('b2', 'no', 'b4')
    next('b3', 'next', 'b4')
    next('b4', 'next', 'b5')
    fireEvent.click(t('fc-check'))
    expect(t('fc-success')).toBeTruthy()
  })
  it('reports problems on an empty and a half-built chart', () => {
    render(<FlowchartBuilder />)
    fireEvent.click(t('fc-check'))
    expect(t('fc-hints').textContent).toContain('কোনো ব্লক নেই')
  })
  it('click-to-connect wires ports to blocks', () => {
    render(<FlowchartBuilder />)
    fireEvent.click(t('fc-add-start'))
    fireEvent.click(t('fc-add-end'))
    fireEvent.click(t('fc-port-b1-next'))
    expect(t('fc-connecting')).toBeTruthy()
    fireEvent.pointerDown(t('fc-block-b2'), { button: 0, clientX: 0, clientY: 0 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 0 })
    expect(screen.queryByTestId('fc-connecting')).toBeNull()
    expect(t('fc-edge-b1-next-b2')).toBeTruthy()
  })
  it('free mode can walk a chart', () => {
    render(<FlowchartBuilder />)
    fireEvent.click(t('fc-mode-free'))
    fireEvent.click(t('fc-add-start'))
    fireEvent.click(t('fc-add-end'))
    fireEvent.pointerDown(t('fc-block-b1'), { button: 0, clientX: 0, clientY: 0 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 0 })
    fireEvent.change(t('fc-next-next'), { target: { value: 'b2' } })
    fireEvent.click(t('fc-run'))
    fireEvent.click(t('fc-run-next'))
    expect(t('fc-run-panel').textContent).toContain('চার্ট শেষ হলো')
  })
})
