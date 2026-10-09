import { defineConfig } from '@playwright/test'

/**
 * Uses the Chrome installed on the machine (no browser download). Set PW_CHANNEL= to use bundled Chromium.
 * PW_PORT / PW_OUTDIR let several runs use separate preview servers + build folders in parallel.
 */
const port = Number(process.env.PW_PORT ?? 4173)
const outDir = process.env.PW_OUTDIR ?? 'dist'
export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  retries: 2,
  workers: 2,
  use: { baseURL: `http://localhost:${port}`, channel: process.env.PW_CHANNEL ?? 'chrome', viewport: { width: 1280, height: 900 } },
  webServer: {
    command: `npx vite build --outDir ${outDir} --emptyOutDir && npx vite preview --outDir ${outDir} --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.PW_OUTDIR,
    timeout: 180_000,
  },
  outputDir: process.env.PW_OUTDIR ? `${outDir}-results` : 'test-results',
})
