import type { Page } from '@playwright/test'

export async function seedProfile(page: Page, os: 'windows' | 'mac', extra: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([o, ex]) => {
      try {
        if (localStorage.getItem('computer-shikhi:v1')) return
      } catch {
        return // sandboxed preview iframes have no localStorage
      }
      localStorage.setItem(
        'computer-shikhi:v1',
        JSON.stringify({ version: 1, profile: { name: 'রুমা', os: o, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { numerals: 'western', unlockAll: true }, modules: {}, ...(ex as object) }),
      )
    },
    [os, extra] as const,
  )
}

export const coach = (page: Page, id: string) => page.locator(`[data-sim-root] [data-coach="${id}"]`).first()

export async function startGuided(page: Page, module: number) {
  await page.goto(`/#/module/${module}`)
  await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
  await page.getByRole('button', { name: /শুরু করি/ }).click()
}

export async function cont(page: Page) {
  await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
}

/** Collects uncaught page errors, console errors and CSP violations; assert `expect(problems).toEqual([])` at the end of a flow. */
export function watchProblems(page: Page): string[] {
  const problems: string[] = []
  page.on('pageerror', (e) => problems.push(`pageerror: ${e}`))
  page.on('console', (m) => {
    if (m.type() === 'error' || /Content[- ]Security[- ]Policy|Refused to/i.test(m.text())) problems.push(`console.${m.type()}: ${m.text()}`)
  })
  return problems
}

/** Run the demo editor's `hello.js` and `hello.py` (the page /#/demo/tools must be open). */
export async function runDemoCode(page: Page) {
  const sim = '[data-sim-root]'
  await page.locator(`${sim} [data-coach="code-explorer-hello.js"]`).click()
  await page.locator(`${sim} [data-coach="code-run"]`).click()
  const out = page.locator(`${sim} [data-coach="code-output"]`)
  await page.waitForFunction(() => document.querySelector('[data-coach="code-output"]')?.textContent?.includes('এটি আমার প্রথম প্রোগ্রাম'), null, { timeout: 15_000 })
  await page.locator(`${sim} [data-coach="code-explorer-hello.py"]`).click()
  await page.locator(`${sim} [data-coach="code-run"]`).click()
  const box = page.locator(`${sim} [data-coach="code-input"]`)
  await box.waitFor({ timeout: 90_000 }) // first Python run loads the runtime
  await box.fill('রিনা')
  await page.locator(`${sim} [data-coach="code-input-send"]`).click()
  await page.waitForFunction(() => document.querySelector('[data-coach="code-output"]')?.textContent?.includes('স্বাগতম, রিনা'), null, { timeout: 90_000 })
  return out
}
