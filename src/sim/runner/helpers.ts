import type { RunError, RunResult } from './types'

/** Maximum number of characters of program output we keep (the rest is dropped and the run stops). */
export const OUTPUT_CAP = 100_000
export const DEFAULT_TIMEOUT_MS = 5000
export const OUTPUT_TRUNCATED_NOTE = '\n… (আউটপুট অনেক বড় হয়ে গেছে, বাকিটুকু দেখানো হচ্ছে না)'

/** Cut `text` to `cap` characters; reports whether anything was dropped. */
export function capOutput(text: string, cap: number = OUTPUT_CAP): { text: string; truncated: boolean } {
  if (text.length <= cap) return { text, truncated: false }
  return { text: text.slice(0, cap), truncated: true }
}

/** Bookkeeping for the "replay" input strategy: answers are consumed in order, running dry means "ask the learner". */
export function createReplay(inputs: readonly string[] = []) {
  let index = 0
  return {
    /** next answer or `undefined` when the answers are exhausted */
    next(): string | undefined {
      if (index >= inputs.length) return undefined
      return inputs[index++]
    },
    get consumed() {
      return index
    },
    get exhausted() {
      return index >= inputs.length
    },
  }
}

/**
 * Parse a Python traceback (as formatted by `traceback.format_exception`, restricted to the learner's `<exec>` frames).
 * Line = the last frame that belongs to the learner's code (for SyntaxError: the reported line).
 */
export function parsePythonTraceback(raw: string): RunError {
  const lines = raw.replace(/\r/g, '').split('\n').filter((l) => l.trim() !== '')
  let line: number | undefined
  const re = /File "<exec>", line (\d+)/g
  for (const m of raw.matchAll(re)) line = Number(m[1])
  // the last line that looks like "Name: message" (or just "Name")
  let name = 'Error'
  let message = ''
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = /^([A-Za-z_][\w.]*)(?:: ?([\s\S]*))?$/.exec(lines[i])
    if (m && !/^\s/.test(lines[i]) && !/^(Traceback|File)\b/.test(lines[i])) {
      name = m[1].split('.').pop() ?? m[1]
      message = (m[2] ?? '').trim()
      // multi-line messages: join following lines
      if (i < lines.length - 1) message = [message, ...lines.slice(i + 1)].join('\n').trim()
      break
    }
  }
  return { name, message, line, raw }
}

/** Find the learner-code line in a JS stack (`learner.js:LINE:COL` frames, V8/SpiderMonkey/JSC all keep the sourceURL). */
export function parseJsStackLine(stack: string | undefined): number | undefined {
  if (!stack) return undefined
  const m = /learner\.js:(\d+)(?::\d+)?/.exec(stack)
  return m ? Number(m[1]) : undefined
}

export function timeoutResult(timeoutMs: number, durationMs: number): RunResult {
  return {
    ok: false,
    output: '',
    timedOut: true,
    error: {
      name: 'TimeoutError',
      message: `The program ran for more than ${Math.round(timeoutMs / 100) / 10} seconds and was stopped (possibly an infinite loop).`,
      raw: '',
    },
    durationMs,
  }
}

export function unavailableResult(detail: string, durationMs = 0): RunResult {
  return { ok: false, output: '', error: { name: 'RunnerUnavailable', message: detail, raw: detail }, durationMs }
}

/** Names that must not give network / storage / thread escape hatches inside a worker. */
export const BLOCKED_GLOBALS = [
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'EventSource',
  'importScripts',
  'indexedDB',
  'caches',
  'BroadcastChannel',
  'Worker',
  'SharedWorker',
  'WebTransport',
] as const

/** Shadow the blocked globals (works for properties inherited from the worker scope prototype too). */
export function lockdownGlobals(scope: Record<string, unknown>): void {
  for (const name of BLOCKED_GLOBALS) {
    try {
      Object.defineProperty(scope, name, { value: undefined, writable: false, configurable: false })
    } catch {
      /* already locked */
    }
  }
  try {
    const nav = scope.navigator as Record<string, unknown> | undefined
    if (nav) Object.defineProperty(nav, 'sendBeacon', { value: undefined, configurable: true })
  } catch {
    /* ignore */
  }
}
