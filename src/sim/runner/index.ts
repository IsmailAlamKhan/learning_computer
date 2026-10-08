import { runJavaScript, runPython, warmUpPython } from './host'
import type { CodeLanguage, RunRequest, RunResult } from './types'

export * from './types'
export { translateError } from './errors'
export { registerWorkerFactory, pyodideIndexURL } from './host'
export type { WorkerLike, WorkerFactory } from './host'

/**
 * Run learner code in a sandbox (Web Worker; Python via self-hosted Pyodide). Never throws: failures come back as
 * `{ok:false, error}`; `needInput` means "ask the learner and call again with the answer appended to `inputs`".
 */
export async function runCode(req: RunRequest): Promise<RunResult> {
  const t0 = Date.now()
  try {
    return req.language === 'python' ? await runPython(req) : await runJavaScript(req)
  } catch (err) {
    const message = String((err as Error)?.message ?? err)
    return { ok: false, output: '', error: { name: 'RunnerError', message, raw: message }, durationMs: Date.now() - t0 }
  }
}

/** Start loading the language runtime early (Pyodide is ~13 MB) so the first Run feels instant. */
export function warmUp(language: CodeLanguage): void {
  if (language === 'python') warmUpPython()
}
