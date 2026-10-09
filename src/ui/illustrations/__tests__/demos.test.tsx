import { act, fireEvent, render, screen } from '@testing-library/react'
import { DemoView, keyLabels } from '../demos'

const gestures = ['click', 'double-click', 'right-click', 'drag', 'scroll', 'type', 'keys', 'two-finger-tap', 'two-finger-scroll'] as const

describe('DemoView', () => {
  it('renders every gesture with controls and no console errors', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    for (const g of gestures) {
      const v = render(<DemoView visual={{ kind: 'demo', gesture: g, keys: 'mod+c', textBn: 'আমার লেখা' }} />)
      expect(v.getAllByRole('img')[0].getAttribute('aria-label')).toMatch(/[ঀ-৿]/)
      expect(screen.getByRole('button', { name: 'আবার দেখুন' })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'থামান' }))
      expect(screen.getByRole('button', { name: 'চালান' })).toBeInTheDocument()
      v.unmount()
    }
    expect(err).not.toHaveBeenCalled()
    err.mockRestore()
  })
  it('formats keys by os', () => {
    expect(keyLabels('mod+c', 'windows')).toEqual(['Ctrl', 'C'])
    expect(keyLabels('mod+shift+4', 'mac')).toEqual(['⌘ Cmd', 'Shift', '4'])
    expect(keyLabels('alt+tab', 'mac')).toEqual(['⌥ Option', 'Tab'])
  })
  it('types text char by char', () => {
    vi.useFakeTimers()
    render(<DemoView visual={{ kind: 'demo', gesture: 'type', textBn: 'abc' }} />)
    expect(screen.getByTestId('typed').textContent).toBe('')
    act(() => { vi.advanceTimersByTime(190) })
    expect(screen.getByTestId('typed').textContent).toBe('ab')
    vi.useRealTimers()
  })
  it('shows a static final frame with arrows and no controls under reduced motion', () => {
    const mm = vi.fn().mockImplementation((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} }))
    vi.stubGlobal('matchMedia', mm)
    window.matchMedia = mm as unknown as typeof window.matchMedia
    const v = render(<DemoView visual={{ kind: 'demo', gesture: 'drag' }} />)
    expect(v.container.querySelector('[data-static="true"]')).not.toBeNull()
    expect(v.container.querySelector('[data-static-arrow]')).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'আবার দেখুন' })).toBeNull()
    v.unmount()
    render(<DemoView visual={{ kind: 'demo', gesture: 'type', textBn: 'পুরো লেখা' }} />)
    expect(screen.getByTestId('typed').textContent).toBe('পুরো লেখা')
    vi.unstubAllGlobals()
    // @ts-expect-error cleanup
    delete window.matchMedia
  })
})
