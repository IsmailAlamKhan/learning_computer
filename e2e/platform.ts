import type { Page } from '@playwright/test'

/** Pretend to be a Windows PC (userAgent, platform and userAgentData) before any script runs. */
export async function mockPlatform(page: Page, platform: 'Windows' | 'macOS' | 'Linux' = 'Windows') {
  await page.addInitScript((p) => {
    const ua = { Windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36', macOS: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36', Linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }[p]
    const plat = { Windows: 'Win32', macOS: 'MacIntel', Linux: 'Linux x86_64' }[p]
    Object.defineProperty(navigator, 'userAgent', { get: () => ua })
    Object.defineProperty(navigator, 'platform', { get: () => plat })
    Object.defineProperty(navigator, 'userAgentData', { get: () => ({ platform: p, mobile: false }) })
  }, platform)
}

