import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ToolAddressCheck from '../tool-address-check'
import ToolMap from '../tool-map'
import { diffPositions, OFFICIAL, PYTHON_CASES, TOOL_CARDS } from '../lib/m18Logic'

describe('m18 logic', () => {
  it('lists exactly the three official addresses and one real Python case', () => {
    expect(OFFICIAL).toEqual(['code.visualstudio.com', 'www.python.org', 'nodejs.org'])
    expect(PYTHON_CASES.filter((c) => c.official).map((c) => c.address)).toEqual(['www.python.org'])
  })
  it('finds the changed characters', () => {
    expect(diffPositions('www.python.org', 'www.pyth0n.org')).toEqual([8])
    expect(diffPositions('abc', 'abc')).toEqual([])
    expect(diffPositions('abc', 'abcd')).toEqual([3])
  })
  it('marks only git and GitHub as "not now"', () => {
    expect(TOOL_CARDS.filter((c) => !c.needNow).map((c) => c.id)).toEqual(['git', 'github'])
  })
})

describe('m18 widgets', () => {
  it('address check: wrong pick shows a gentle note, right pick praises', () => {
    render(<ToolAddressCheck />)
    fireEvent.click(screen.getByTestId('addr-zero'))
    expect(screen.getByTestId('addr-note-zero').textContent).toContain('শূন্য')
    expect(screen.getByTestId('addr-result').textContent).toContain('নয়')
    fireEvent.click(screen.getByTestId('addr-real'))
    expect(screen.getByTestId('addr-result').textContent).toContain('ঠিক')
  })
  it('tool map switches cards', () => {
    render(<ToolMap />)
    fireEvent.click(screen.getByTestId('tool-git'))
    expect(screen.getByTestId('tool-now').textContent).toContain('পরে')
  })
})
