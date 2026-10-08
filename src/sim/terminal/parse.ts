/** Command-line parser for the practice terminal: quoting, `>`/`>>`, `;` and `&&` chaining. Pure, no React. */
import type { OsFlavor } from '../../engine/types'

export interface Segment {
  /** the segment text as typed (trimmed) — used as the `command` of the emitted SimEvent */
  raw: string
  words: string[]
  redirect?: { mode: '>' | '>>'; target: string }
  /** how this segment is connected to the previous one */
  join: ';' | '&&' | null
}

export type ParseResult = { ok: true; segments: Segment[] } | { ok: false; error: 'unterminatedQuote' | 'missingRedirectTarget' | 'emptyAfterAnd' }

interface Tok {
  kind: 'word' | 'op'
  text: string
  start: number
  end: number
}

/** Splits a line into words and operators. On Windows a backslash is a path character (no escapes); on Mac it escapes the next character. */
export function tokenize(line: string, flavor: OsFlavor): Tok[] | null {
  const toks: Tok[] = []
  let i = 0
  const n = line.length
  while (i < n) {
    const ch = line[i]
    if (/\s/.test(ch)) {
      i++
      continue
    }
    if (ch === ';') {
      toks.push({ kind: 'op', text: ';', start: i, end: i + 1 })
      i++
      continue
    }
    if (ch === '&' && line[i + 1] === '&') {
      toks.push({ kind: 'op', text: '&&', start: i, end: i + 2 })
      i += 2
      continue
    }
    if (ch === '>') {
      const dbl = line[i + 1] === '>'
      toks.push({ kind: 'op', text: dbl ? '>>' : '>', start: i, end: i + (dbl ? 2 : 1) })
      i += dbl ? 2 : 1
      continue
    }
    // a word
    const start = i
    let text = ''
    while (i < n) {
      const c = line[i]
      if (/\s/.test(c) || c === ';' || c === '>' || (c === '&' && line[i + 1] === '&')) break
      if (c === '"' || c === "'") {
        const q = c
        i++
        let closed = false
        while (i < n) {
          if (line[i] === q) {
            closed = true
            i++
            break
          }
          if (q === '"' && flavor === 'mac' && line[i] === '\\' && (line[i + 1] === '"' || line[i + 1] === '\\')) {
            text += line[i + 1]
            i += 2
            continue
          }
          if (q === '"' && flavor === 'windows' && line[i] === '`' && i + 1 < n) {
            text += line[i + 1]
            i += 2
            continue
          }
          text += line[i++]
        }
        if (!closed) return null
        continue
      }
      if (flavor === 'mac' && c === '\\' && i + 1 < n) {
        text += line[i + 1]
        i += 2
        continue
      }
      if (flavor === 'windows' && c === '`' && i + 1 < n) {
        text += line[i + 1]
        i += 2
        continue
      }
      text += c
      i++
    }
    toks.push({ kind: 'word', text, start, end: i })
  }
  return toks
}

export function parseLine(line: string, flavor: OsFlavor): ParseResult {
  const toks = tokenize(line, flavor)
  if (!toks) return { ok: false, error: 'unterminatedQuote' }
  const segments: Segment[] = []
  let words: string[] = []
  let redirect: Segment['redirect']
  let start = -1
  let end = -1
  let pendingJoin: Segment['join'] = null
  let waiting: '>' | '>>' | null = null
  const flush = (next: Segment['join']) => {
    if (words.length || redirect) segments.push({ raw: line.slice(start, end).trim(), words, redirect, join: pendingJoin })
    pendingJoin = next ?? pendingJoin
    words = []
    redirect = undefined
    start = -1
    end = -1
  }
  for (const t of toks) {
    if (t.kind === 'op' && (t.text === ';' || t.text === '&&')) {
      if (waiting) return { ok: false, error: 'missingRedirectTarget' }
      if (t.text === '&&' && !words.length && !redirect) return { ok: false, error: 'emptyAfterAnd' }
      flush(t.text as ';' | '&&')
      continue
    }
    if (start < 0) start = t.start
    end = t.end
    if (t.kind === 'op') {
      if (waiting) return { ok: false, error: 'missingRedirectTarget' }
      waiting = t.text as '>' | '>>'
    } else if (waiting) {
      redirect = { mode: waiting, target: t.text }
      waiting = null
    } else words.push(t.text)
  }
  if (waiting) return { ok: false, error: 'missingRedirectTarget' }
  flush(null)
  return { ok: true, segments }
}
