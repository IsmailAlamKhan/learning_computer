import { expect, test, type Page } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'

async function typeAddress(page: Page, text: string) {
  const a = page.locator('[data-sim-root] [data-coach="browser-address"]').first()
  await a.click()
  await a.fill(text)
  await page.keyboard.press('Enter')
}

/** Everything after opening the browser is identical on both OSes until the Files part. */
async function browserPart(page: Page) {
  await typeAddress(page, 'dal recipe')
  await coach(page, 'search-result-1').click()
  await coach(page, 'browser-back').click()
  await coach(page, 'browser-forward').click()
  await coach(page, 'browser-new-tab').click()
  await typeAddress(page, 'khobor.example')
  await coach(page, 'browser-tab-1').click()
  await coach(page, 'browser-bookmark').click()
  await typeAddress(page, 'free-prize-claim.example')
  await coach(page, 'scam-popup-close').click()
  await coach(page, 'scam-urgent').click()
  await coach(page, 'scam-otp').click()
  await coach(page, 'browser-back').click()
  await typeAddress(page, 'download.official-editor.example')
  await coach(page, 'download-official').click()
  await expect(page.locator('[data-sim-root] [data-coach="browser-download-show"]').first()).toBeVisible({ timeout: 10_000 })
}

test.describe('Module 7 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 7)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
    await browserPart(page)
    await coach(page, 'taskbar-app-files').click()
    await coach(page, 'fm-sidebar-Downloads').click()
    await coach(page, 'fm-item-OfficialEditor-setup.exe').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['7'].stepsDone.windows.length)
    expect(saved).toBe(20)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac')
    await startGuided(page, 7)
    await coach(page, 'dock-browser').click()
    await browserPart(page)
    await coach(page, 'dock-files').click()
    await coach(page, 'fm-sidebar-Downloads').click()
    await coach(page, 'fm-item-OfficialEditor.dmg').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
  })

  test('the ad button is a trap and downloads nothing', async ({ page }) => {
    await seedProfile(page, 'windows')
    await startGuided(page, 7)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
    await typeAddress(page, 'download.official-editor.example')
    await coach(page, 'download-ad-trap').click()
    await expect(page.getByText(/Fast Editor PRO/).first()).toBeVisible()
    await coach(page, 'fakesite-download').click()
    await expect(page.getByText(/বিজ্ঞাপনের পাতা/)).toBeVisible()
    await expect(page.locator('[data-sim-root] [data-coach="browser-download-progress"]')).toHaveCount(0)
  })
})
