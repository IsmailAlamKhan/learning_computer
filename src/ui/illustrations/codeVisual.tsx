import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Visual } from '../../engine/types'
import { useReducedMotion } from './useReducedMotion'

export type CodeVisual = Extract<Visual, { kind: 'code' }>
type Lang = CodeVisual['lang']

/* ---------------------------------------------------------------- tokenizer ---------------------------------------------------------------- */
export type TokenKind = 'kw' | 'str' | 'num' | 'com' | 'tag' | 'attr' | 'prop' | 'fn' | 'punct' | 'var' | 'plain'
export interface Token { t: string; k: TokenKind }

const KW: Record<Lang, Set<string>> = {
  python: new Set('def class if elif else for while in return import from as and or not is None True False pass break continue try except with lambda'.split(' ')),
  javascript: new Set('const let var function return if else for while of in new class import from export true false null undefined this async await break continue'.split(' ')),
  shell: new Set('if then else fi for do done while in echo cd ls pwd mkdir cat rm cp mv touch python python3 node npm git'.split(' ')),
  html: new Set(),
  css: new Set(),
}
const BUILTIN = new Set(['print', 'input', 'len', 'range', 'int', 'str', 'float', 'list', 'console', 'log', 'document', 'alert'])

interface Rule { re: RegExp; k: TokenKind | ((m: string) => TokenKind) }
const rulesFor = (lang: Lang): Rule[] => {
  const str: Rule = { re: /"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?/y, k: 'str' }
  const num: Rule = { re: /\b\d+(?:\.\d+)?\b/y, k: 'num' }
  const word = (kw: Set<string>): Rule => ({ re: /[A-Za-z_][A-Za-z0-9_]*/y, k: (m) => (kw.has(m) ? 'kw' : BUILTIN.has(m) ? 'fn' : 'plain') })
  const call: Rule = { re: /[A-Za-z_][A-Za-z0-9_]*(?=\()/y, k: (m) => (KW[lang].has(m) ? 'kw' : 'fn') }
  const punct: Rule = { re: /[()[\]{}.,:;=+\-*/%<>!&|]+/y, k: 'punct' }
  switch (lang) {
    case 'python':
      return [{ re: /#.*/y, k: 'com' }, { re: /[fFrRbB]?(?:"""|'''|"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)/y, k: 'str' }, num, call, word(KW.python), punct]
    case 'javascript':
      return [{ re: /\/\/.*/y, k: 'com' }, { re: /`(?:[^`\\]|\\.)*`?/y, k: 'str' }, str, num, call, word(KW.javascript), punct]
    case 'shell':
      return [{ re: /#.*/y, k: 'com' }, str, { re: /\$[A-Za-z_][A-Za-z0-9_]*/y, k: 'var' }, { re: /--?[A-Za-z][\w-]*/y, k: 'attr' }, num, word(KW.shell), punct]
    default:
      return []
  }
}

/** Tokenise every line of a snippet (state such as "inside a tag" or "inside { }" carries over between lines). */
export function tokenizeLines(lines: string[], lang: Lang): Token[][] {
  if (lang === 'html') return htmlLines(lines)
  if (lang === 'css') return cssLines(lines)
  const rules = rulesFor(lang)
  return lines.map((line) => {
    const out: Token[] = []
    let i = 0
    let plain = ''
    const flush = () => { if (plain) { out.push({ t: plain, k: 'plain' }); plain = '' } }
    outer: while (i < line.length) {
      for (const r of rules) {
        r.re.lastIndex = i
        const m = r.re.exec(line)
        if (m && m.index === i && m[0].length > 0) {
          const k = typeof r.k === 'function' ? r.k(m[0]) : r.k
          if (k === 'plain') plain += m[0]
          else { flush(); out.push({ t: m[0], k }) }
          i += m[0].length
          continue outer
        }
      }
      plain += line[i++]
    }
    flush()
    return out
  })
}

function htmlLines(lines: string[]): Token[][] {
  let inTag = false
  let inCom = false
  return lines.map((line) => {
    const out: Token[] = []
    let i = 0
    let plain = ''
    const flush = () => { if (plain) { out.push({ t: plain, k: 'plain' }); plain = '' } }
    const push = (t: string, k: TokenKind) => { flush(); out.push({ t, k }) }
    while (i < line.length) {
      const rest = line.slice(i)
      let m: RegExpExecArray | null
      if (inCom) {
        const e = rest.indexOf('-->')
        const len = e < 0 ? rest.length : e + 3
        push(rest.slice(0, len), 'com'); i += len
        if (e >= 0) inCom = false
      } else if (!inTag && rest.startsWith('<!--')) { inCom = true; push('<!--', 'com'); i += 4 }
      else if (!inTag && (m = /^<\/?[A-Za-z!][\w-]*/.exec(rest))) { push(m[0], 'tag'); i += m[0].length; inTag = true }
      else if (inTag && (m = /^\/?>/.exec(rest))) { push(m[0], 'tag'); i += m[0].length; inTag = false }
      else if (inTag && (m = /^"[^"]*"?|^'[^']*'?/.exec(rest))) { push(m[0], 'str'); i += m[0].length }
      else if (inTag && (m = /^[A-Za-z_:][\w:.-]*/.exec(rest))) { push(m[0], 'attr'); i += m[0].length }
      else if (inTag && rest[0] === '=') { push('=', 'punct'); i++ }
      else plain += line[i++]
    }
    flush()
    return out
  })
}

function cssLines(lines: string[]): Token[][] {
  let depth = 0
  let inCom = false
  let inValue = false
  return lines.map((line) => {
    const out: Token[] = []
    let i = 0
    let plain = ''
    const flush = () => { if (plain) { out.push({ t: plain, k: 'plain' }); plain = '' } }
    const push = (t: string, k: TokenKind) => { flush(); out.push({ t, k }) }
    while (i < line.length) {
      const rest = line.slice(i)
      let m: RegExpExecArray | null
      if (inCom) {
        const e = rest.indexOf('*/')
        const len = e < 0 ? rest.length : e + 2
        push(rest.slice(0, len), 'com'); i += len
        if (e >= 0) inCom = false
      } else if (rest.startsWith('/*')) { inCom = true; push('/*', 'com'); i += 2 }
      else if ((m = /^"[^"]*"?|^'[^']*'?/.exec(rest))) { push(m[0], 'str'); i += m[0].length }
      else if (rest[0] === '{') { depth++; inValue = false; push('{', 'punct'); i++ }
      else if (rest[0] === '}') { depth = Math.max(0, depth - 1); inValue = false; push('}', 'punct'); i++ }
      else if (depth > 0 && !inValue && (m = /^[a-z-]+(?=\s*:)/.exec(rest))) { push(m[0], 'prop'); i += m[0].length }
      else if (depth > 0 && rest[0] === ':') { inValue = true; push(':', 'punct'); i++ }
      else if (depth > 0 && rest[0] === ';') { inValue = false; push(';', 'punct'); i++ }
      else if (depth > 0 && (m = /^#[0-9a-fA-F]{3,8}\b/.exec(rest))) { push(m[0], 'num'); i += m[0].length }
      else if (depth > 0 && (m = /^-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg)?/.exec(rest))) { push(m[0], 'num'); i += m[0].length }
      else if (depth > 0 && inValue && (m = /^[a-z-]+(?=\()/.exec(rest))) { push(m[0], 'fn'); i += m[0].length }
      else if (depth === 0 && (m = /^[.#]?[A-Za-z_*][\w-]*|^:{1,2}[\w-]+|^@[\w-]+/.exec(rest))) { push(m[0], 'tag'); i += m[0].length }
      else plain += line[i++]
    }
    flush()
    return out
  })
}

/* ---------------------------------------------------------------- rendering ---------------------------------------------------------------- */
const COLORS: Record<TokenKind, string> = {
  kw: '#c4b5fd', str: '#99e6da', num: '#f5b82e', com: '#a3a9c4', tag: '#fda4af', attr: '#fcd34d', prop: '#7dd3fc', fn: '#93c5fd', punct: '#cbd5e1', var: '#f9a8d4', plain: '#f1f0ff',
}
const NOTE_BG = ['#99e6da', '#c4b5fd', '#fda4af', '#fcd34d']
const STEP_MS = 600
const MONO_STACK = "Menlo, Consolas, 'DejaVu Sans Mono', var(--font-mono, monospace)"

/** neutralise anything executable before the HTML goes into the sandboxed preview frame */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|iframe|object|embed|link|meta|base|form)\b[\s\S]*?(<\s*\/\s*\1\s*>|$)/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src|action|formaction)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '')
}
export function previewDoc(lang: Lang, lines: string[]): string {
  const code = lines.join('\n')
  const body = lang === 'css'
    ? `<style>${code.replace(/<\/style/gi, '')}</style><h1>স্বাগতম</h1><p>এটি একটি নমুনা লেখা।</p><button>বোতাম</button>`
    : sanitizeHtml(code)
  return `<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,'Noto Sans Bengali',sans-serif;margin:10px;color:#1e1b3a}</style>${body}`
}

const run = 'inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold'

export function CodeVisualView({ visual }: { visual: CodeVisual }) {
  const reduced = useReducedMotion()
  const n = visual.lines.length
  const tokens = useMemo(() => tokenizeLines(visual.lines.map((l) => l.code), visual.lang), [visual.lines, visual.lang])
  const hasResult = (visual.output?.length ?? 0) > 0 || !!visual.browserPreview
  // step: -1 idle, 0..n-1 running that line, n = finished
  const [step, setStep] = useState<number>(reduced ? n : -1)
  const [runId, setRunId] = useState(reduced ? 0 : 1)

  useEffect(() => {
    if (reduced) { setStep(n); return }
    if (runId === 0) return
    setStep(0)
    let s = 0
    const t = setInterval(() => {
      s += 1
      setStep(s)
      if (s >= n) clearInterval(t)
    }, STEP_MS)
    return () => clearInterval(t)
  }, [runId, reduced, n])

  const start = useCallback(() => setRunId((r) => r + 1), [])
  const running = step >= 0 && step < n
  const done = step >= n
  const srcDoc = useMemo(() => (visual.browserPreview ? previewDoc(visual.lang, visual.lines.map((l) => l.code)) : ''), [visual])

  return (
    <figure
      data-testid="code-visual"
      data-lang={visual.lang}
      data-step={step}
      data-done={done ? 'true' : 'false'}
      aria-label="কোডের উদাহরণ, লাইন ধরে ধরে চালিয়ে দেখানো হচ্ছে"
      className="mx-auto w-full max-w-[640px] overflow-hidden rounded-[20px] shadow-card"
      style={{ background: '#17142e', color: '#f1f0ff', margin: 0 }}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ background: '#241f45' }}>
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide" style={{ color: '#c4b5fd' }}>
          <span aria-hidden="true" className="flex gap-1"><i className="block h-2.5 w-2.5 rounded-full" style={{ background: '#fda4af' }} /><i className="block h-2.5 w-2.5 rounded-full" style={{ background: '#fcd34d' }} /><i className="block h-2.5 w-2.5 rounded-full" style={{ background: '#99e6da' }} /></span>
          {visual.lang}
        </span>
        {!reduced && (
          <span className="flex items-center gap-2">
            <button type="button" aria-label="চালান" disabled={running} onClick={start} className={run} style={{ background: running ? '#4c4777' : '#6d28d9', color: '#fff', opacity: running ? 0.7 : 1 }}>
              <span aria-hidden="true">▶</span> চালান
            </button>
            <button type="button" aria-label="আবার চালান" onClick={start} className={run} style={{ background: 'transparent', color: '#e9e7ff', border: '1.5px solid #6b6595' }}>
              <span aria-hidden="true">↻</span>
            </button>
          </span>
        )}
      </div>
      <ol className="m-0 list-none p-0 py-2" style={{ fontFamily: MONO_STACK, fontSize: 14.5, lineHeight: 1.6 }}>
        {visual.lines.map((l, i) => {
          const active = step === i
          const noteVisible = !!l.noteBn && (active || done)
          return (
            <li key={i} data-line={i + 1} data-state={active ? 'active' : step > i ? 'done' : 'idle'} className="px-3" style={{ background: active ? 'rgba(124,92,255,.28)' : 'transparent', borderLeft: `3px solid ${active ? '#fcd34d' : 'transparent'}`, transition: 'background .15s' }}>
              <div className="flex gap-3">
                <span aria-hidden="true" className="w-4 shrink-0 select-none text-right" style={{ color: active ? '#fcd34d' : '#6b6595' }}>{i + 1}</span>
                <code className="min-w-0 flex-1" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'inherit' }}>
                  {tokens[i].length === 0 ? ' ' : tokens[i].map((tk, j) => <span key={j} data-k={tk.k} style={{ color: COLORS[tk.k], fontStyle: tk.k === 'com' ? 'italic' : undefined }}>{tk.t}</span>)}
                </code>
              </div>
              {noteVisible && (
                <p data-note={i + 1} className="my-1 ml-7 w-fit max-w-full rounded-2xl px-3 py-1 text-[15px] font-semibold" style={{ background: NOTE_BG[i % NOTE_BG.length], color: '#1e1b3a', fontFamily: "'Noto Sans Bengali', system-ui, sans-serif", lineHeight: 1.5 }}>
                  <span aria-hidden="true">👉 </span>{l.noteBn}
                </p>
              )}
            </li>
          )
        })}
      </ol>
      {hasResult && done && (
        <div data-testid="code-output" className="px-3 pb-3">
          {visual.browserPreview ? (
            <div className="overflow-hidden rounded-xl" style={{ background: '#fff', border: '2px solid #6b6595' }}>
              <div className="flex items-center gap-2 px-2 py-1" style={{ background: '#e9e7f5' }}>
                <span aria-hidden="true" className="flex gap-1"><i className="block h-2 w-2 rounded-full bg-[#fda4af]" /><i className="block h-2 w-2 rounded-full bg-[#fcd34d]" /><i className="block h-2 w-2 rounded-full bg-[#99e6da]" /></span>
                <span className="flex-1 truncate rounded-full px-2 text-xs" style={{ background: '#fff', color: '#4b5563' }}>preview</span>
              </div>
              <iframe title="প্রিভিউ" sandbox="" srcDoc={srcDoc} className="block h-40 w-full border-0" style={{ background: '#fff' }} />
            </div>
          ) : (
            <div className="rounded-xl px-3 py-2" style={{ background: '#0b0a1a', border: '1.5px solid #3b3566', fontFamily: MONO_STACK, fontSize: 14.5 }}>
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#99e6da' }}>output</div>
              {visual.output!.map((o, i) => (
                <div key={i} data-output={i} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#d9fff8' }}>{o}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </figure>
  )
}
