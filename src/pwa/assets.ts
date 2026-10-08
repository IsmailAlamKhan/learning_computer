/** Files of the self-hosted Pyodide runtime (copied to `<base>/pyodide/`, see vite.config.ts and docs/RUNNER.md). Pure data: also imported by vite.config.ts. */
export const PYODIDE_FILES = ['pyodide.asm.wasm', 'pyodide.asm.mjs', 'python_stdlib.zip', 'pyodide-lock.json', 'pyodide.mjs', 'package.json'] as const
