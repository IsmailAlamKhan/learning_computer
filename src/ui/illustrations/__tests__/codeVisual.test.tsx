import { act, fireEvent, render, screen } from '@testing-library/react'
import { CodeVisualView, sanitizeHtml, tokenizeLines } from '../codeVisual'

const kinds = (line: string, lang: Parameters<typeof tokenizeLines>[1]) => tokenizeLines([line], lang)[0].filter((t) => t.k !== 'plain').map((t) => `${t.k}:${t.t}`)

describe('tokenizer', () => {
  it('python', () => {
    expect(kinds('if x == 3: print("hi")  # note', 'python')).toEqual(['kw:if', 'punct:==', 'num:3', 'punct::', 'fn:print', 'punct:(', 'str:"hi"', 'punct:)', 'com:# note'])
  })
  it('html', () => {
    expect(kinds('<a href="x">Hi</a>', 'html')).toEqual(['tag:<a', 'attr:href', 'punct:=', 'str:"x"', 'tag:>', 'tag:</a', 'tag:>'])
  })
  it('css carries state across lines', () => {
    const t = tokenizeLines(['h1 {', '  color: #e8505b;', '  margin: 4px', '}'], 'css').map((l) => l.filter((x) => x.k !== 'plain').map((x) => `${x.k}:${x.t}`))
    expect(t[0]).toEqual(['tag:h1', 'punct:{'])
    expect(t[1]).toEqual(['prop:color', 'punct::', 'num:#e8505b', 'punct:;'])
    expect(t[2][2]).toBe('num:4px')
  })
  it('javascript and shell', () => {
    expect(kinds('const a = `x`; // c', 'javascript')).toEqual(['kw:const', 'punct:=', 'str:`x`', 'punct:;', 'com:// c'])
    expect(kinds('ls -l $HOME', 'shell')).toEqual(['kw:ls', 'attr:-l', 'var:$HOME'])
  })
  it('keeps Bengali inside strings', () => {
    expect(kinds('print("স্বাগতম")', 'python')).toContain('str:"স্বাগতম"')
  })
})

it('sanitizes scripts and handlers', () => {
  const s = sanitizeHtml('<p onclick="x()">a</p><script>alert(1)</script><iframe src=x></iframe>')
  expect(s).not.toMatch(/script|onclick|iframe/i)
})

const visual = { kind: 'code' as const, lang: 'python' as const, lines: [{ code: 'a = 1', noteBn: 'এক' }, { code: 'print(a)', noteBn: 'দেখাও' }], output: ['1'] }

describe('CodeVisualView', () => {
  it('runs line by line then shows output', () => {
    vi.useFakeTimers()
    render(<CodeVisualView visual={visual} />)
    const fig = screen.getByTestId('code-visual')
    act(() => { vi.advanceTimersByTime(1) })
    expect(fig.getAttribute('data-step')).toBe('0')
    expect(document.querySelector('[data-line="1"]')!.getAttribute('data-state')).toBe('active')
    expect(document.querySelector('[data-note="1"]')).not.toBeNull()
    expect(document.querySelector('[data-note="2"]')).toBeNull()
    expect(screen.queryByTestId('code-output')).toBeNull()
    act(() => { vi.advanceTimersByTime(600) })
    expect(fig.getAttribute('data-step')).toBe('1')
    expect(document.querySelector('[data-line="2"]')!.getAttribute('data-state')).toBe('active')
    act(() => { vi.advanceTimersByTime(600) })
    expect(fig.getAttribute('data-done')).toBe('true')
    expect(screen.getByTestId('code-output').textContent).toContain('1')
    fireEvent.click(screen.getByRole('button', { name: 'আবার চালান' }))
    act(() => { vi.advanceTimersByTime(1) })
    expect(fig.getAttribute('data-done')).toBe('false')
    vi.useRealTimers()
  })
  it('uses a sandboxed iframe for browser previews', () => {
    vi.useFakeTimers()
    render(<CodeVisualView visual={{ kind: 'code', lang: 'html', browserPreview: true, lines: [{ code: '<h1>Hi</h1>' }] }} />)
    act(() => { vi.advanceTimersByTime(700) })
    const f = document.querySelector('iframe')!
    expect(f.getAttribute('sandbox')).toBe('')
    expect(f.getAttribute('srcdoc')).toContain('<h1>Hi</h1>')
    vi.useRealTimers()
  })
  it('shows everything at once under reduced motion', () => {
    const mm = vi.fn().mockImplementation((q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} }))
    window.matchMedia = mm as unknown as typeof window.matchMedia
    render(<CodeVisualView visual={visual} />)
    expect(document.querySelector('[data-note="1"]')).not.toBeNull()
    expect(document.querySelector('[data-note="2"]')).not.toBeNull()
    expect(screen.getByTestId('code-output')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'চালান' })).toBeNull()
    // @ts-expect-error cleanup
    delete window.matchMedia
  })
})
