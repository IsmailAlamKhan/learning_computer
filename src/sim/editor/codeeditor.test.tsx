import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { EditorView } from '@codemirror/view'
import { renderApp } from '../apps/testUtils'

vi.mock('../runner', () => ({
  runCode: vi.fn(async (req: { code: string; inputs?: string[] }) => {
    if (req.code.includes('input(') && !(req.inputs?.length)) return { ok: false, output: '', needInput: { prompt: 'নাম? ' }, durationMs: 1 }
    if (req.code.includes('boom')) return { ok: false, output: '', error: { name: 'NameError', message: "name 'boom' is not defined", line: 1, raw: '' }, durationMs: 1 }
    return { ok: true, output: req.inputs?.length ? `স্বাগতম, ${req.inputs[0]}` : 'hi', durationMs: 1 }
  }),
  warmUp: () => {},
}))
vi.mock('../runner/errors', () => ({ translateError: () => ({ titleBn: 'নাম পাওয়া যাচ্ছে না', explanationBn: 'ব্যাখ্যা', tryBn: 'বানান দেখুন' }) }))

function setup(files: Record<string, string>, props: Record<string, unknown> = {}) {
  const rig = renderApp('windows')
  const vfs = rig.d().vfs
  let folder!: ReturnType<typeof vfs.mkdir>
  act(() => {
    folder = vfs.mkdir(vfs.home, 'coding')
    for (const [n, c] of Object.entries(files)) vfs.createFile(folder, n, c)
  })
  rig.open('code', { file: '~/coding/' + Object.keys(files)[0], ...props })
  return { rig, vfs }
}
const view = () => EditorView.findFromDOM(document.querySelector('.cm-editor') as HTMLElement)!
const typeAtEnd = (text: string) => act(() => view().dispatch({ changes: { from: view().state.doc.length, insert: text } }))

describe('Code Editor app', () => {
  it('opens a file, edits, Ctrl+S saves to the vfs and emits saveFile', async () => {
    const { rig, vfs } = setup({ 'hello.py': 'print("hi")\n' })
    expect(view().state.doc.toString()).toBe('print("hi")\n')
    expect(rig.has('code-tab-hello.py')).toBe(true)
    typeAtEnd('# মন্তব্য ক্ষ\n')
    expect(rig.d().wm.windows[0].title).toContain('●')
    expect(vfs.resolve('~/coding/hello.py')!.content).toBe('print("hi")\n')
    expect(rig.key('ctrl+s')).toBe(true)
    expect(vfs.resolve('~/coding/hello.py')!.content).toBe('print("hi")\n# মন্তব্য ক্ষ\n')
    expect(rig.events().some((e) => e.includes('"saveFile"') && e.includes('hello.py'))).toBe(true)
    expect(rig.d().wm.windows[0].title).not.toContain('●')
    // debounced typing events for lessons
    await waitFor(() => expect(rig.bus.log.some((e) => e.type === 'type' && e.target === 'code-editor' && e.value.includes('মন্তব্য'))).toBe(true))
    expect(rig.bus.log.some((e) => e.type === 'custom' && e.event === 'code-edited')).toBe(true)
  })

  it('keeps unsaved text per tab and creates the project folder when missing', () => {
    const rig = renderApp('mac')
    rig.open('code', { folder: '~/newproj' })
    expect(rig.d().vfs.resolve('~/newproj')?.kind).toBe('folder')
    const vfs = rig.d().vfs
    const f = vfs.resolve('~/newproj')!
    act(() => {
      vfs.createFile(f, 'a.js', 'a')
      vfs.createFile(f, 'b.css', 'b')
    })
    fireEvent.click(rig.q('code-explorer-a.js'))
    typeAtEnd('1')
    fireEvent.click(rig.q('code-explorer-b.css'))
    expect(view().state.doc.toString()).toBe('b')
    fireEvent.click(rig.q('code-tab-a.js'))
    expect(view().state.doc.toString()).toBe('a1')
    expect(rig.has('code-dirty-a.js')).toBe(true)
    expect(vfs.resolve('~/newproj/a.js')!.content).toBe('a')
    rig.key('cmd+s')
    expect(vfs.resolve('~/newproj/a.js')!.content).toBe('a1')
  })

  it('Python: Enter after a colon indents', () => {
    setup({ 'x.py': 'if True:' })
    act(() => view().dispatch({ selection: { anchor: 8 } }))
    const content = document.querySelector('.cm-content') as HTMLElement
    content.focus()
    // run the real Enter command
    return import('@codemirror/commands').then(({ insertNewlineAndIndent }) => {
      act(() => void insertNewlineAndIndent(view()))
      expect(view().state.doc.toString()).toBe('if True:\n    ')
    })
  })

  it('HTML: live preview is a sandboxed iframe without same-origin and emits `preview`', async () => {
    const { rig } = setup({ 'index.html': '<head><link rel="stylesheet" href="style.css"></head><body><h1>শিরোনাম</h1></body>', 'style.css': 'h1{color:red}' })
    const frame = rig.q<HTMLIFrameElement>('code-preview')
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts')
    expect(frame.getAttribute('srcdoc')).toContain('h1{color:red}')
    expect(frame.getAttribute('srcdoc')).toContain('Content-Security-Policy')
    typeAtEnd('<p>নতুন লেখা</p>')
    await waitFor(() => expect(rig.bus.lastPreview?.text).toContain('নতুন লেখা'), { timeout: 2000 })
    expect(rig.bus.lastPreview?.html).toContain('<style>')
    fireEvent.click(rig.q('code-preview-toggle'))
    expect(rig.has('code-preview')).toBe(false)
  })

  it('CSS file shows the preview of index.html', () => {
    const { rig } = setup({ 'style.css': 'p{}', 'index.html': '<p>x</p>' })
    expect(rig.has('code-preview')).toBe(true)
  })

  it('Run: replays with the typed answer and emits codeRun', async () => {
    const { rig } = setup({ 'hello.py': 'name = input("نام")' })
    fireEvent.click(rig.q('code-run'))
    const box = await screen.findByText(/প্রোগ্রাম আপনার কাছে কিছু জানতে চাইছে/)
    expect(box).toBeInTheDocument()
    fireEvent.change(rig.q('code-input'), { target: { value: 'রুমা' } })
    fireEvent.click(rig.q('code-input-send'))
    await waitFor(() => expect(rig.q('code-output').textContent).toContain('স্বাগতম, রুমা'))
    const ev = rig.bus.log.filter((e) => e.type === 'codeRun')
    expect(ev).toHaveLength(1)
    expect(ev[0]).toMatchObject({ type: 'codeRun', language: 'python', ok: true, output: 'স্বাগতম, রুমা' })
  })

  it('Run: shows the Bengali card plus the original English message for errors', async () => {
    const { rig } = setup({ 'broken.py': 'boom' })
    fireEvent.click(rig.q('code-run'))
    await waitFor(() => expect(rig.has('code-error')).toBe(true))
    expect(rig.q('code-error').textContent).toContain('নাম পাওয়া যাচ্ছে না')
    expect(rig.q('code-error-original').textContent).toBe("NameError: name 'boom' is not defined")
    expect(document.querySelector('.cm-errorLine')).not.toBeNull()
    expect(rig.bus.log.find((e) => e.type === 'codeRun')).toMatchObject({ ok: false })
  })

  it('new file button creates and opens a file', () => {
    const { rig, vfs } = setup({ 'a.js': '' })
    fireEvent.click(rig.q('code-new-file'))
    const input = rig.q<HTMLInputElement>('code-new-name')
    fireEvent.change(input, { target: { value: 'new.py' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(vfs.resolve('~/coding/new.py')).not.toBeNull()
    expect(rig.has('code-tab-new.py')).toBe(true)
  })
})
