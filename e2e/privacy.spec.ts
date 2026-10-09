import { expect, test } from '@playwright/test'
import { coach, openModule, runDemoCode, seedProfile, skipToPractice, startUnit, watchProblems } from './helpers'

/** Every request the app makes (page, workers, service worker) must stay on its own origin (or be data:/blob:). See docs/PRIVACY.md. */
test('privacy: no request ever leaves the app origin; no CSP violations', async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL!).origin
  const seen: string[] = []
  context.on('request', (r) => seen.push(r.url()))
  const problems = watchProblems(page)

  // 1. onboarding
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /স্বাগতম/ })).toBeVisible()
  await page.getByPlaceholder('যেমন: রুমা').fill('রুমা')
  await page.getByRole('button', { name: /পরের ধাপ/ }).first().click()

  // 2. home (seeded profile)
  await seedProfile(page, 'windows')
  await page.goto('/#/')
  await page.reload()
  await expect(page.getByRole('link', { name: /হোম/ }).first()).toBeVisible()

  // 3. a lesson with the simulator, then the browser module
  await openModule(page, 2)
  await startUnit(page, 0)
  await skipToPractice(page)
  await expect(coach(page, 'desktop')).toBeVisible()
  await openModule(page, 7)
  await startUnit(page, 0)
  await skipToPractice(page)
  await coach(page, 'start-button').click()
  await coach(page, 'start-app-browser').click()
  const addr = page.locator('[data-sim-root] [data-coach="browser-address"]').first()
  await addr.click()
  await addr.fill('free-prize-claim.example')
  await page.keyboard.press('Enter')
  await expect(coach(page, 'scam-popup-close')).toBeVisible()
  await addr.fill('https://www.example.org/')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(500)

  // 4. JavaScript + Python runs
  await page.goto('/#/demo/tools')
  await runDemoCode(page)

  // 5. settings export
  await page.goto('/#/settings')
  const dl = page.waitForEvent('download')
  await page.getByRole('button', { name: /ব্যাকআপ নামান/ }).click()
  await dl
  await page.waitForTimeout(500)

  const foreign = seen.filter((u) => !(u.startsWith(origin + '/') || u.startsWith('data:') || u.startsWith('blob:')))
  expect(seen.length).toBeGreaterThan(10)
  expect(foreign, `requests outside ${origin}`).toEqual([])
  expect(problems).toEqual([])
})

test('privacy: the Content-Security-Policy really blocks foreign connections and frames', async ({ page }) => {
  await page.goto('/')
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')
  expect(csp).toContain("connect-src 'self'")
  const result = await page.evaluate(async () => {
    const out: Record<string, string> = {}
    try {
      await fetch('https://example.org/')
      out.fetch = 'allowed'
    } catch {
      out.fetch = 'blocked'
    }
    out.image = await new Promise((res) => {
      const i = new Image()
      i.onload = () => res('allowed')
      i.onerror = () => res('blocked')
      i.src = 'https://example.org/x.png'
    })
    return out
  })
  expect(result).toEqual({ fetch: 'blocked', image: 'blocked' })
})
