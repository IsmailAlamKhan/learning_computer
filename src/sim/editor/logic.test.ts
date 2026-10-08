import { describe, expect, it, vi } from 'vitest'
import { activateTab, buildPreviewDocument, closeTab, emptyTabs, extractVisibleText, fileKindOf, isDirty, openTab, runnableLanguage, runWithReplay } from './logic'
import type { RunRequest, RunResult } from '../runner/types'

describe('language detection', () => {
  it('maps extensions', () => {
    expect(fileKindOf('index.html')).toBe('html')
    expect(fileKindOf('A.HTM')).toBe('html')
    expect(fileKindOf('style.css')).toBe('css')
    expect(fileKindOf('app.js')).toBe('javascript')
    expect(fileKindOf('hello.py')).toBe('python')
    expect(fileKindOf('notes.txt')).toBe('text')
    expect(fileKindOf('Makefile')).toBe('text')
    expect(fileKindOf('.py')).toBe('text')
  })
  it('only py/js are runnable', () => {
    expect(runnableLanguage('a.py')).toBe('python')
    expect(runnableLanguage('a.js')).toBe('javascript')
    expect(runnableLanguage('a.html')).toBeNull()
  })
})

describe('buildPreviewDocument', () => {
  const files = {
    'index.html': '<!DOCTYPE html><html><head><title>t</title><link rel="stylesheet" href="style.css"></head><body><h1>স্বাগতম</h1><script src="./app.js"></script><script src="missing.js"></script><link rel="stylesheet" href="https://x.test/a.css"></body></html>',
    'style.css': 'h1{color:red}',
    'app.js': 'document.title="x"</script>',
  }
  const doc = buildPreviewDocument(files, 'index.html')
  it('inlines local css and js, keeps unknown references', () => {
    expect(doc).toContain('<style>\nh1{color:red}\n</style>')
    expect(doc).toContain('<script>\ndocument.title="x"<\\/script>\n</script>')
    expect(doc).toContain('<script src="missing.js"></script>')
    expect(doc).toContain('href="https://x.test/a.css"')
    expect(doc).not.toContain('href="style.css"')
  })
  it('adds the blocking CSP right after <head>', () => {
    expect(doc).toMatch(/<head>\s*<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:">/)
  })
  it('adds a head when there is none', () => {
    expect(buildPreviewDocument({ 'a.html': '<p>hi</p>' }, 'a.html')).toMatch(/^<head><meta http-equiv="Content-Security-Policy"/)
    expect(buildPreviewDocument({ 'a.html': '<html><body>x</body></html>' }, 'a.html')).toMatch(/<html>\s*<head><meta http-equiv/)
  })
  it('supports sub-folder references', () => {
    const d = buildPreviewDocument({ 'i.html': '<head><link href="css/s.css" rel="stylesheet"></head>', 'css/s.css': 'p{}' }, 'i.html')
    expect(d).toContain('<style>\np{}\n</style>')
  })
})

describe('extractVisibleText', () => {
  it('returns body text without scripts/styles and collapses whitespace', () => {
    const t = extractVisibleText('<html><head><title>No</title><style>h1{}</style></head><body><h1>আমার   পাতা</h1>\n<p>লাইন <b>দুই</b></p><script>var x="hidden"</script></body></html>')
    expect(t).toBe('আমার পাতা লাইন দুই')
  })
})

describe('tab state', () => {
  it('opens, activates, closes', () => {
    let s = openTab(emptyTabs, 'a')
    s = openTab(s, 'b')
    s = openTab(s, 'c')
    expect(s).toEqual({ tabs: ['a', 'b', 'c'], active: 'c' })
    s = openTab(s, 'a')
    expect(s.tabs).toEqual(['a', 'b', 'c'])
    expect(s.active).toBe('a')
    s = activateTab(s, 'b')
    expect(closeTab(s, 'b')).toEqual({ tabs: ['a', 'c'], active: 'a' })
    expect(closeTab(s, 'c')).toEqual({ tabs: ['a', 'b'], active: 'b' })
    expect(closeTab(closeTab(closeTab(s, 'a'), 'b'), 'c').active).toBeNull()
    expect(closeTab(s, 'zzz')).toBe(s)
  })
  it('dirty means a draft that differs from the saved text', () => {
    expect(isDirty(undefined, 'x')).toBe(false)
    expect(isDirty('x', 'x')).toBe(false)
    expect(isDirty('y', 'x')).toBe(true)
  })
})

describe('input replay', () => {
  const ok = (output: string): RunResult => ({ ok: true, output, durationMs: 1 })
  it('re-runs with the answers appended and returns only the final result', async () => {
    const run = vi.fn(async (req: RunRequest): Promise<RunResult> => {
      const i = req.inputs ?? []
      if (i.length < 1) return { ok: false, output: 'partial', needInput: { prompt: 'নাম? ' }, durationMs: 1 }
      if (i.length < 2) return { ok: false, output: 'partial2', needInput: { prompt: 'বয়স? ' }, durationMs: 1 }
      return ok(`হ্যালো ${i[0]} ${i[1]}`)
    })
    const prompts: string[] = []
    const answers = ['রুমা', '30']
    const { result, inputs } = await runWithReplay(run, { language: 'python', code: 'x' }, async (p) => (prompts.push(p), answers.shift()!))
    expect(prompts).toEqual(['নাম? ', 'বয়স? '])
    expect(inputs).toEqual(['রুমা', '30'])
    expect(result.output).toBe('হ্যালো রুমা 30')
    expect(run.mock.calls.map((c) => c[0].inputs)).toEqual([[], ['রুমা'], ['রুমা', '30']])
  })
  it('stops when asking is rejected (Stop pressed)', async () => {
    const run = async (): Promise<RunResult> => ({ ok: false, output: '', needInput: { prompt: '?' }, durationMs: 0 })
    await expect(runWithReplay(run, { language: 'python', code: '' }, () => Promise.reject(new Error('stopped')))).rejects.toThrow('stopped')
  })
  it('gives up after too many rounds', async () => {
    const run = async (): Promise<RunResult> => ({ ok: false, output: '', needInput: { prompt: '?' }, durationMs: 0 })
    await expect(runWithReplay(run, { language: 'python', code: '' }, async () => 'a', 3)).rejects.toThrow()
  })
})
