import { defineConfig } from '@playwright/test'

/** Uses the Chrome already installed on the machine (no browser download). Set PW_CHANNEL= to use bundled Chromium. */
export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  use: { baseURL: 'http://localhost:4173', channel: process.env.PW_CHANNEL ?? 'chrome', viewport: { width: 1280, height: 900 } },
  webServer: { command: 'npm run build && npm run preview -- --port 4173', port: 4173, reuseExistingServer: true, timeout: 120_000 },
})
