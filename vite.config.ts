import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // Self-hosted Pyodide (Python in the browser), pinned to the npm version; served at <base>/pyodide/ in dev and build.
    // Only fetched when a Python lesson runs (see docs/RUNNER.md).
    ...(process.env.VITEST
      ? []
      : [
          viteStaticCopy({
            targets: [
              {
                src: [
                  'node_modules/pyodide/pyodide.asm.wasm',
                  'node_modules/pyodide/pyodide.asm.mjs',
                  'node_modules/pyodide/python_stdlib.zip',
                  'node_modules/pyodide/pyodide-lock.json',
                  'node_modules/pyodide/pyodide.mjs',
                  'node_modules/pyodide/package.json',
                ],
                dest: 'pyodide',
                rename: { stripBase: true },
              },
            ],
          }),
        ]),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
})
