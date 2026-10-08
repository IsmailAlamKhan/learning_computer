import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PlainVsRich, { RICH_MARKUP } from '../plain-vs-rich'
import SaveVsSaveAs, { saveScene } from '../save-vs-saveas'

describe('saveScene', () => {
  it('Save keeps one file, Save As makes two', () => {
    expect(saveScene('save', 2).files.map((f) => f.name)).toEqual(['hello.txt'])
    expect(saveScene('save', 2).files[0].text).toBe('Hello Ruma')
    expect(saveScene('saveAs', 2).files.map((f) => f.name)).toEqual(['hello.txt', 'hello-copy.txt'])
    expect(saveScene('saveAs', 2).files[0].text).toBe('Hello')
  })
  it('steps before saving are identical and clamp', () => {
    expect(saveScene('save', 1)).toEqual(saveScene('saveAs', 1))
    expect(saveScene('save', 99)).toEqual(saveScene('save', 2))
    expect(saveScene('save', -3)).toEqual(saveScene('save', 0))
  })
})

describe('widgets', () => {
  it('SaveVsSaveAs steps through and switches mode', () => {
    render(<SaveVsSaveAs />)
    fireEvent.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
    fireEvent.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
    expect(screen.getAllByText('hello.txt')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /Save As/ }))
    fireEvent.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
    fireEvent.click(screen.getByRole('button', { name: /পরের ধাপ/ }))
    expect(screen.getByText('hello-copy.txt')).toBeInTheDocument()
  })
  it('PlainVsRich reveals the hidden markup', () => {
    render(<PlainVsRich />)
    expect(screen.queryByText(RICH_MARKUP)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /লুকানো নির্দেশ দেখান/ }))
    expect(screen.getByText(RICH_MARKUP)).toBeInTheDocument()
  })
})
