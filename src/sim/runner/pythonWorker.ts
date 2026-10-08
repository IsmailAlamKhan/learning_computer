/// <reference lib="webworker" />
// Module worker that hosts Pyodide. Bundled by Vite (`new Worker(new URL('./pythonWorker.ts', import.meta.url))`).
// Pyodide itself is NOT bundled: it is imported at run time from the same-origin copy under <base>/pyodide/.
import { lockdownGlobals } from './helpers'
import { createPythonRunner, type PyodideLike } from './pythonCore'

type Run = (code: string, inputs: string[], cap?: number) => ReturnType<ReturnType<typeof createPythonRunner>>
let run: Run | null = null
const scope = self as unknown as DedicatedWorkerGlobalScope

scope.onmessage = async (e: MessageEvent) => {
  const m = e.data as
    | { type: 'init'; indexURL: string }
    | { type: 'run'; id: number; code: string; inputs: string[]; cap: number }
  if (m.type === 'init') {
    try {
      const mod = (await import(/* @vite-ignore */ m.indexURL + 'pyodide.mjs')) as {
        loadPyodide(o: { indexURL: string }): Promise<PyodideLike>
      }
      const pyodide = await mod.loadPyodide({ indexURL: m.indexURL })
      run = createPythonRunner(pyodide)
      // Pyodide only needs the network while loading its own files; from here on nothing in the sandbox can use it.
      lockdownGlobals(self as unknown as Record<string, unknown>)
      scope.postMessage({ type: 'ready' })
    } catch (err) {
      scope.postMessage({ type: 'initError', message: String((err as Error)?.message ?? err) })
    }
  } else if (m.type === 'run') {
    try {
      if (!run) throw new Error('Pyodide is not loaded')
      scope.postMessage({ type: 'result', id: m.id, outcome: run(m.code, m.inputs, m.cap) })
    } catch (err) {
      scope.postMessage({
        type: 'result',
        id: m.id,
        outcome: { ok: false, output: '', error: { name: 'RunnerError', message: String((err as Error)?.message ?? err), raw: '' } },
      })
    }
  }
}
