import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ErrorCopySearch from '../error-copy-search'
import TroubleshootFlow from '../troubleshoot-flow'
import { ERROR_MESSAGE, FLOW, RESULTS, flowNode, isFullMessage, normalizeMessage, searchQuality, validateFlow } from '../lib/m12Logic'

describe('m12 logic', () => {
  it('normalizes whitespace and curly quotes', () => {
    expect(normalizeMessage('  a\n  “b”   c ')).toBe('a "b" c')
  })
  it('only the whole message counts as copied', () => {
    expect(isFullMessage(ERROR_MESSAGE)).toBe(true)
    expect(isFullMessage(`  ${ERROR_MESSAGE}\n`)).toBe(true)
    expect(isFullMessage('Error code PA-1042')).toBe(false)
  })
  it('rates the search text', () => {
    expect(searchQuality(ERROR_MESSAGE)).toBe('exact')
    expect(searchQuality('photo album error PA-1042')).toBe('partial')
    expect(searchQuality('my computer is broken')).toBe('weak')
  })
  it('exactly one risky result and the rest trustworthy', () => {
    expect(RESULTS.filter((r) => !r.trustworthy)).toHaveLength(1)
    expect(RESULTS.some((r) => r.official)).toBe(true)
    expect(RESULTS.some((r) => r.accepted)).toBe(true)
  })
  it('decision tree is closed and fully reachable', () => {
    expect(validateFlow()).toEqual([])
    expect(validateFlow([{ id: 'start', kind: 'question', textBn: 'x', options: [{ labelBn: 'y', next: 'nope' }] }])).toContain('start → nope missing')
    expect(flowNode('a-forcequit')?.kind).toBe('answer')
    expect(FLOW.filter((n) => n.kind === 'answer').length).toBeGreaterThan(8)
  })
})

describe('ErrorCopySearch', () => {
  it('goes copy → paste → results and judges the answers', () => {
    render(<ErrorCopySearch />)
    expect(screen.queryByTestId('ecs-input')).toBeNull()
    // simulate a full selection + copy event
    const msg = screen.getByTestId('ecs-message')
    const range = document.createRange()
    range.selectNodeContents(msg)
    const sel = window.getSelection()!
    sel.removeAllRanges()
    sel.addRange(range)
    fireEvent.copy(document)
    const input = screen.getByTestId('ecs-input')
    fireEvent.change(input, { target: { value: 'why is my computer slow' } })
    expect(screen.getByRole('status')).toHaveTextContent('গুরুত্বপূর্ণ অংশ')
    fireEvent.change(input, { target: { value: ERROR_MESSAGE } })
    fireEvent.click(screen.getByTestId('ecs-search'))
    fireEvent.click(screen.getByTestId('ecs-result-old'))
    expect(screen.getByTestId('ecs-why')).toHaveTextContent('কখনো চালাবেন না')
    fireEvent.click(screen.getByTestId('ecs-result-accepted'))
    expect(screen.getByText(/দারুণ/)).toBeInTheDocument()
  })
  it('a partial copy does not advance', () => {
    render(<ErrorCopySearch />)
    const range = document.createRange()
    const node = screen.getByTestId('ecs-message').firstChild!
    range.setStart(node, 0)
    range.setEnd(node, 10)
    const sel = window.getSelection()!
    sel.removeAllRanges()
    sel.addRange(range)
    fireEvent.copy(document)
    expect(screen.getByTestId('ecs-copy-note')).toBeInTheDocument()
    expect(screen.queryByTestId('ecs-input')).toBeNull()
  })
})

describe('TroubleshootFlow', () => {
  it('walks to an answer and back', () => {
    render(<TroubleshootFlow />)
    fireEvent.click(screen.getByRole('button', { name: 'আওয়াজ আসছে না' }))
    fireEvent.click(screen.getByRole('button', { name: /হ্যাঁ, মিউট বা কম/ }))
    expect(screen.getByTestId('flow-answer')).toHaveTextContent('মিউট খুলুন')
    fireEvent.click(screen.getByRole('button', { name: /নতুন করে শুরু/ }))
    expect(screen.getByTestId('flow-question')).toBeInTheDocument()
  })
})
