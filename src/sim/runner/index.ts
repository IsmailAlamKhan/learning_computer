import type { RunRequest, RunResult } from './types'

export * from './types'

/** Run learner code in a sandbox. IMPLEMENTATION IS PROVIDED BY THE RUNNER MODULE (replace this stub). */
export async function runCode(_req: RunRequest): Promise<RunResult> {
  return { ok: false, output: '', error: { name: 'NotImplemented', message: 'runner not implemented yet', raw: '' }, durationMs: 0 }
}

/** Start loading the language runtime early (Pyodide is ~10 MB) so the first Run feels instant. */
export function warmUp(_language: 'python' | 'javascript'): void {}
