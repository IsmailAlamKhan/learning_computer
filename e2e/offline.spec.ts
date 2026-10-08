import { expect, test } from '@playwright/test'
import { coach, cont, runDemoCode, seedProfile, startGuided, watchProblems } from './helpers'

/** After one online visit (service worker + background Python download) the whole app works with the network cut. See docs/OFFLINE.md. */
test('offline: lessons, simulator, JavaScript and Python all work without a network', async ({ page, context }) => {
  test.setTimeout(240_000)
  const problems = watchProblems(page)
  await seedProfile(page, 'windows')

  // first, online visit: the service worker installs and the Python runtime is fetched in the background
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await expect(page.getByTestId('offline-chip')).toContainText('✓ অফলাইনে ব্যবহার করা যাবে', { timeout: 120_000 })
  const cached = await page.evaluate(async () => {
    const names = await caches.keys()
    const out: Record<string, string[]> = {}
    for (const n of names) out[n] = (await (await caches.open(n)).keys()).map((r) => new URL(r.url).pathname)
    return out
  })
  const pyodideCache = Object.entries(cached).find(([n]) => n.startsWith('pyodide-'))
  expect(pyodideCache?.[1].length).toBe(6)
  const precache = Object.entries(cached).find(([n]) => n.includes('precache'))![1]
  expect(precache.some((p) => /assets\/pythonWorker-.*\.js$/.test(p))).toBe(true)
  expect(precache.some((p) => /assets\/CodeEditor-.*\.js$/.test(p))).toBe(true)
  expect(precache.some((p) => /\.woff2$/.test(p))).toBe(true)
  // make sure the page is controlled by the worker (it claims clients on first install)
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)

  // now cut the network
  await context.setOffline(true)
  const failed: string[] = []
  page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`))
  page.on('response', (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`)
  })

  await page.reload()
  await expect(page.getByRole('link', { name: /হোম/ }).first()).toBeVisible()

  // a lesson + a guided step in the simulator
  await startGuided(page, 2)
  await cont(page)
  await cont(page)
  await coach(page, 'icon-Welcome.txt').click()
  await coach(page, 'icon-Welcome.txt').dblclick()
  await expect(page.locator('[data-sim-root] [data-coach="win-editor-close"]')).toBeVisible()

  // code editor: JavaScript and Python
  await page.goto('/#/demo/tools')
  await page.reload()
  await runDemoCode(page)

  expect(failed).toEqual([])
  expect(problems).toEqual([])
})
