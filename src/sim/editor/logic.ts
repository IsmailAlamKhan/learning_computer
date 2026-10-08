/** Pure helpers of the Code Editor app (no React, no CodeMirror): easy to unit-test. */
import type { CodeLanguage, RunRequest, RunResult } from '../runner/types'

export type FileKind = 'html' | 'css' | 'javascript' | 'python' | 'text'

export function fileKindOf(name: string): FileKind {
  const i = name.lastIndexOf('.')
  const ext = i > 0 ? name.slice(i + 1).toLowerCase() : ''
  if (ext === 'html' || ext === 'htm') return 'html'
  if (ext === 'css') return 'css'
  if (ext === 'js' || ext === 'mjs') return 'javascript'
  if (ext === 'py') return 'python'
  return 'text'
}

/** The runnable language of a file, or null for files that cannot be run. */
export function runnableLanguage(name: string): CodeLanguage | null {
  const k = fileKindOf(name)
  return k === 'python' || k === 'javascript' ? k : null
}

// ---------- tabs ----------
export interface TabsState {
  /** node ids, in tab order */
  tabs: string[]
  active: string | null
}
export const emptyTabs: TabsState = { tabs: [], active: null }

export function openTab(s: TabsState, id: string): TabsState {
  return { tabs: s.tabs.includes(id) ? s.tabs : [...s.tabs, id], active: id }
}
export function activateTab(s: TabsState, id: string): TabsState {
  return s.tabs.includes(id) ? { ...s, active: id } : s
}
/** Close a tab; the neighbour on the left (or the first one) becomes active when the active tab is closed. */
export function closeTab(s: TabsState, id: string): TabsState {
  const i = s.tabs.indexOf(id)
  if (i < 0) return s
  const tabs = s.tabs.filter((t) => t !== id)
  if (s.active !== id) return { tabs, active: s.active }
  return { tabs, active: tabs.length ? tabs[Math.max(0, i - 1)] : null }
}
export function isDirty(draft: string | undefined, saved: string): boolean {
  return draft !== undefined && draft !== saved
}

// ---------- preview ----------
const isExternal = (ref: string) => /^([a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(ref.trim())

function lookup(files: Record<string, string>, ref: string): string | undefined {
  if (isExternal(ref)) return undefined
  const clean = ref.trim().replace(/[?#].*$/, '').replace(/^(\.\/)+/, '')
  return Object.prototype.hasOwnProperty.call(files, clean) ? files[clean] : undefined
}
const attr = (tag: string, name: string): string | undefined => {
  const m = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag)
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined
}

export const PREVIEW_CSP =
  `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:">`

/**
 * Build the document shown in the sandboxed preview: inlines `<link rel="stylesheet" href>` and `<script src>` that
 * resolve to `files` (paths relative to the entry's folder), leaves unknown references alone, and adds a CSP that blocks
 * all network access.
 */
export function buildPreviewDocument(files: Record<string, string>, entry: string): string {
  let html = files[entry] ?? ''
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag
    const href = attr(tag, 'href')
    const css = href === undefined ? undefined : lookup(files, href)
    return css === undefined ? tag : `<style>\n${css.replace(/<\/style/gi, '<\\/style')}\n</style>`
  })
  html = html.replace(/<script\b([^>]*)>\s*<\/script\s*>/gi, (whole, attrs: string) => {
    const src = attr(`<script ${attrs}>`, 'src')
    const js = src === undefined ? undefined : lookup(files, src)
    return js === undefined ? whole : `<script>\n${js.replace(/<\/script/gi, '<\\/script')}\n</script>`
  })
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (m) => `${m}\n${PREVIEW_CSP}`)
  if (/<html\b[^>]*>/i.test(html)) return html.replace(/<html\b[^>]*>/i, (m) => `${m}\n<head>${PREVIEW_CSP}</head>`)
  return `<head>${PREVIEW_CSP}</head>\n${html}`
}

/** The text a person sees in the page (body text, scripts/styles excluded), whitespace collapsed. */
export function extractVisibleText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script,style,template,noscript').forEach((n) => n.remove())
  const raw = doc.body?.textContent ?? ''
  return raw.replace(/\s+/g, ' ').trim()
}

// ---------- run with input replay ----------
export type RunFn = (req: RunRequest) => Promise<RunResult>

/**
 * "Replay" strategy (see runner/types.ts): run; while the program asks for more input, ask the person (via `ask`) and
 * run again from the start with the answers appended. Only the final run's result is returned.
 * `ask` may reject (e.g. the person pressed Stop) which aborts the loop.
 */
export async function runWithReplay(
  run: RunFn,
  req: Omit<RunRequest, 'inputs'>,
  ask: (prompt: string) => Promise<string>,
  maxRounds = 50,
): Promise<{ result: RunResult; inputs: string[] }> {
  const inputs: string[] = []
  for (let i = 0; i < maxRounds; i++) {
    const result = await run({ ...req, inputs: [...inputs] })
    if (!result.needInput) return { result, inputs }
    inputs.push(await ask(result.needInput.prompt))
  }
  throw new Error('too many input requests')
}

/** One-line text of a run error for the `codeRun` event. */
export function describeError(e: { name: string; message: string }): string {
  return `${e.name}: ${e.message}`
}
