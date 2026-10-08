import { expect, test } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

for (const os of ['windows', 'mac'] as const) {
  test(`Module 15 guided practice completes on ${os}`, async ({ page }) => {
    await seedProfile(page, os)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 15)
    await expect(coach(page, 'code-explorer-hello.py')).toBeVisible()
    await cont(page) // look-files
    await coach(page, 'code-explorer-hello.py').click()
    await cont(page) // read-py
    await coach(page, 'code-run').click()
    await expect(coach(page, 'code-output')).toContainText('স্বাগতম! আমি প্রোগ্রামিং শিখছি', { timeout: 30000 })
    await cont(page) // see-output
    await coach(page, 'code-explorer-hello.js').click()
    await cont(page) // read-js
    await coach(page, 'code-explorer-hello.html').click()
    await cont(page) // see-html
    await cont(page) // finish
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    // the sandboxed preview iframe cannot read localStorage (seedProfile's init script runs there too) — not an app error
    expect(errors.filter((e) => !/sandboxed/.test(e))).toEqual([])
    const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['15'].stepsDone[o].length, os)
    expect(saved).toBe(10)
  })
}

test('Module 15 widgets and quiz basics work in the lesson', async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/module/15')
  // robot: vague fails, precise works
  await page.getByTestId('add-VAGUE').click()
  await page.getByTestId('robot-run').click()
  await expect(page.getByTestId('robot-result')).toHaveAttribute('data-outcome', 'confused', { timeout: 5000 })
  await page.getByTestId('robot-clear').click()
  for (let i = 0; i < 3; i++) await page.getByTestId('add-F').click()
  await page.getByTestId('robot-run').click()
  await expect(page.getByTestId('robot-result')).toHaveAttribute('data-outcome', 'reached', { timeout: 8000 })
  // language cards
  await page.getByTestId('lang-toggle-python').click()
  await expect(page.getByTestId('lang-code-python')).toContainText('print(')
  // path chooser
  for (const id of ['pc-make-tool', 'pc-curious-data', 'pc-style-read', 'pc-goal-career']) await page.getByTestId(id).click()
  await expect(page.getByTestId('pc-result')).toHaveAttribute('data-second', 'python')
  await expect(page.getByTestId('roadmap')).toContainText('HTML ও CSS')
})
