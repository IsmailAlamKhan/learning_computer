import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import HtmlAnatomy from '../html-anatomy'
import CodeTrace from '../code-trace'
import { CSS_PARTS, HTML_PARTS, nextFrame, prevFrame, TRACE_FRAMES } from '../lib/m20Logic'

describe('m20 logic', () => {
  it('html parts rebuild the sample line, css parts rebuild the rule', () => {
    expect(HTML_PARTS.map((p) => p.text).join('')).toBe('<a href="https://example.com">Click me</a>')
    expect(CSS_PARTS.map((p) => p.text).join('')).toBe('h1 { color: teal; }')
  })
  it('frame navigation is clamped', () => {
    expect(prevFrame(0)).toBe(0)
    expect(nextFrame(TRACE_FRAMES.length - 1)).toBe(TRACE_FRAMES.length - 1)
    expect(nextFrame(0)).toBe(1)
  })
  it('the trace ends with the printed output Rumi / adult', () => {
    expect(TRACE_FRAMES[TRACE_FRAMES.length - 1].output).toEqual(['Rumi', 'adult'])
  })
})

describe('html-anatomy', () => {
  it('shows details of the clicked part', () => {
    const { container } = render(<HtmlAnatomy mode="html" />)
    fireEvent.click(container.querySelector('[data-part="end"]')!)
    expect(screen.getByTestId('html-anatomy-info').textContent).toContain('বন্ধের ট্যাগ')
  })
  it('css mode lists selector/property/value', () => {
    const { container } = render(<HtmlAnatomy mode="css" />)
    fireEvent.click(container.querySelector('[data-part="property"]')!)
    expect(screen.getByTestId('html-anatomy-info').textContent).toContain('প্রপার্টি')
  })
})

describe('code-trace', () => {
  it('steps through lines and fills variables and output', () => {
    render(<CodeTrace />)
    expect(screen.getByTestId('trace-vars').textContent).toContain('এখনো কিছু নেই')
    fireEvent.click(screen.getByTestId('trace-next'))
    expect(screen.getByTestId('trace-vars').textContent).toContain('name = "Rumi"')
    for (let k = 0; k < 4; k++) fireEvent.click(screen.getByTestId('trace-next'))
    expect(screen.getByTestId('trace-output').textContent).toBe('Rumi\nadult')
  })
})
