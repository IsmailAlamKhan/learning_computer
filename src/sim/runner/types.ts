/** Contract of the sandboxed code runner (JavaScript in a Web Worker, Python via self-hosted Pyodide in a Web Worker). */
export type CodeLanguage = 'python' | 'javascript'

export interface RunRequest {
  language: CodeLanguage
  code: string
  /**
   * Answers for `input()` (Python) / `prompt()` (JavaScript), consumed in order. When the program asks for more
   * answers than given, the runner stops and returns `needInput` — the UI shows a friendly prompt box, appends the
   * answer and calls `runCode` again with the same code (the program is re-run from the start: "replay" strategy,
   * which needs no SharedArrayBuffer and so works on any static host).
   */
  inputs?: string[]
  /** hard limit; the worker is terminated on timeout (default 5000 ms; Python gets +load time on first run) */
  timeoutMs?: number
}

export interface RunError {
  /** e.g. 'SyntaxError', 'NameError', 'IndentationError', 'ReferenceError', 'TypeError', 'ZeroDivisionError' */
  name: string
  /** original English message, exactly as the language printed it */
  message: string
  /** 1-based line in the learner's code, if known */
  line?: number
  /** full traceback / stack for "show details" */
  raw: string
}

export interface RunResult {
  ok: boolean
  /** everything printed, as the program wrote it (print / console.log), newline separated */
  output: string
  error?: RunError
  /** the program asked for input beyond `inputs` */
  needInput?: { prompt: string }
  timedOut?: boolean
  durationMs: number
}

export interface FriendlyError {
  /** short Bengali title, calm and blame-free: 'একটি নাম খুঁজে পাওয়া যাচ্ছে না' */
  titleBn: string
  /** 1–3 sentences in simple Bengali on what usually causes it */
  explanationBn: string
  /** what to try next */
  tryBn: string
}
