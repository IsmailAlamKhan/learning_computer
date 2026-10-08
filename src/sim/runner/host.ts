import { JS_WORKER_SOURCE } from './jsWorkerSource'
import { DEFAULT_TIMEOUT_MS, OUTPUT_CAP, timeoutResult, unavailableResult } from './helpers'
import type { CodeLanguage, RunError, RunRequest, RunResult } from './types'

/** The slice of the Web Worker API the host uses (lets tests inject a fake). */
export interface WorkerLike {
  postMessage(message: unknown): void
  terminate(): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onmessage: ((ev: { data: any }) => void) | null
  onerror: ((ev: { message?: string }) => void) | null
}
export type WorkerFactory = () => WorkerLike

const overrides: Partial<Record<CodeLanguage, WorkerFactory>> = {}

/** Replace the worker factory of a language (tests); pass `null` to restore the default. Also drops a live Python worker. */
export function registerWorkerFactory(language: CodeLanguage, factory: WorkerFactory | null): void {
  if (factory) overrides[language] = factory
  else delete overrides[language]
  if (language === 'python') resetPythonSession()
}

function defaultJsFactory(): WorkerLike {
  const url = URL.createObjectURL(new Blob([JS_WORKER_SOURCE], { type: 'text/javascript' }))
  const w = new Worker(url)
  const origTerminate = w.terminate.bind(w)
  const wrapped = w as unknown as WorkerLike
  wrapped.terminate = () => {
    origTerminate()
    URL.revokeObjectURL(url)
  }
  return wrapped
}

function defaultPythonFactory(): WorkerLike {
  return new Worker(new URL('./pythonWorker.ts', import.meta.url), { type: 'module' }) as unknown as WorkerLike
}

function makeWorker(language: CodeLanguage): WorkerLike {
  const f = overrides[language] ?? (language === 'javascript' ? defaultJsFactory : defaultPythonFactory)
  return f()
}

/** Where the self-hosted Pyodide files live (same origin, relative to the document: works in dev, build and any sub-folder). */
export function pyodideIndexURL(): string {
  const base = typeof document !== 'undefined' ? document.baseURI : self.location.href
  return new URL('pyodide/', base).href
}

interface Outcome {
  output: string
  error?: RunError
  needInput?: { prompt: string }
}

/** Wait for one message matching `pick` from the worker, with a timeout. */
function waitFor<T>(
  worker: WorkerLike,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pick: (data: any) => T | undefined,
  timeoutMs: number,
): Promise<{ value: T } | 'timeout' | { crash: string }> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve('timeout'), timeoutMs)
    worker.onmessage = (ev) => {
      const v = pick(ev.data)
      if (v !== undefined) {
        clearTimeout(timer)
        resolve({ value: v })
      }
    }
    worker.onerror = (ev) => {
      clearTimeout(timer)
      resolve({ crash: ev?.message ?? 'worker error' })
    }
  })
}

function crashResult(detail: string, durationMs: number): RunResult {
  return { ok: false, output: '', error: { name: 'RunnerError', message: detail, raw: detail }, durationMs }
}

function toResult(o: Outcome, durationMs: number): RunResult {
  if (o.needInput) return { ok: false, output: '', needInput: o.needInput, durationMs }
  return { ok: !o.error, output: o.output, error: o.error, durationMs }
}

export async function runJavaScript(req: RunRequest): Promise<RunResult> {
  const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const t0 = Date.now()
  let worker: WorkerLike
  try {
    worker = makeWorker('javascript')
  } catch (err) {
    return unavailableResult(`Could not start a Web Worker: ${(err as Error)?.message ?? err}`)
  }
  try {
    const p = waitFor<Outcome>(worker, (d) => (d && d.type === 'result' ? (d as Outcome) : undefined), timeoutMs)
    worker.postMessage({ code: req.code, inputs: req.inputs ?? [], cap: OUTPUT_CAP })
    const r = await p
    const dt = Date.now() - t0
    if (r === 'timeout') return timeoutResult(timeoutMs, dt)
    if ('crash' in r) return crashResult(r.crash, dt)
    return toResult(r.value, dt)
  } finally {
    worker.terminate()
  }
}

// ---- Python: one long-lived worker (Pyodide is ~10 MB, loaded lazily), terminated on timeout and re-created on demand ----

const PYTHON_LOAD_TIMEOUT_MS = 120_000
let pythonSession: Promise<WorkerLike> | null = null
let pythonQueue: Promise<unknown> = Promise.resolve()
let pythonRunId = 0

function resetPythonSession(): void {
  const s = pythonSession
  pythonSession = null
  s?.then((w) => w.terminate()).catch(() => {})
}

function getPythonSession(): Promise<WorkerLike> {
  if (pythonSession) return pythonSession
  const session = (async () => {
    const worker = makeWorker('python')
    const ready = waitFor<{ ok: boolean; message?: string }>(
      worker,
      (d) => (d && d.type === 'ready' ? { ok: true } : d && d.type === 'initError' ? { ok: false, message: String(d.message) } : undefined),
      PYTHON_LOAD_TIMEOUT_MS,
    )
    worker.postMessage({ type: 'init', indexURL: pyodideIndexURL() })
    const r = await ready
    if (r === 'timeout') {
      worker.terminate()
      throw new Error('Loading Python took too long')
    }
    if ('crash' in r) {
      worker.terminate()
      throw new Error(r.crash)
    }
    if (!r.value.ok) {
      worker.terminate()
      throw new Error(r.value.message)
    }
    return worker
  })()
  pythonSession = session
  session.catch(() => {
    if (pythonSession === session) pythonSession = null
  })
  return session
}

/** Begin loading Pyodide in the background (errors are swallowed; the next run reports them). */
export function warmUpPython(): void {
  try {
    getPythonSession().catch(() => {})
  } catch {
    /* ignore */
  }
}

export function runPython(req: RunRequest): Promise<RunResult> {
  const job = pythonQueue.then(() => runPythonNow(req))
  pythonQueue = job.catch(() => {})
  return job
}

async function runPythonNow(req: RunRequest): Promise<RunResult> {
  const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS
  let worker: WorkerLike
  try {
    worker = await getPythonSession()
  } catch (err) {
    return unavailableResult(`Python could not be loaded: ${(err as Error)?.message ?? err}`)
  }
  const t0 = Date.now()
  const id = ++pythonRunId
  const p = waitFor<{ outcome: Outcome }>(worker, (d) => (d && d.type === 'result' && d.id === id ? { outcome: d.outcome } : undefined), timeoutMs)
  worker.postMessage({ type: 'run', id, code: req.code, inputs: req.inputs ?? [], cap: OUTPUT_CAP })
  const r = await p
  const dt = Date.now() - t0
  if (r === 'timeout') {
    resetPythonSession() // a stuck interpreter can only be killed; a fresh one is created lazily by the next run
    return timeoutResult(timeoutMs, dt)
  }
  if ('crash' in r) {
    resetPythonSession()
    return crashResult(r.crash, dt)
  }
  return toResult(r.value.outcome, dt)
}
