import { expect, test, type Page } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'

const SETTINGS = { settings: { numerals: 'western', unlockAll: true } }
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const pause = (page: Page) => page.waitForTimeout(1600)

/** wallpaper, dark mode and zoom: check the real effect on the sim after each change */
async function effects(page: Page, mac: boolean) {
  const bg = page.locator('[data-sim-root] [data-wallpaper]').first()
  if (mac) {
    await coach(page, 'settings-nav-personalization').click()
    await coach(page, 'settings-wallpaper-2').click()
    await expect(bg).toHaveAttribute('data-wallpaper', '2')
    await pause(page)
    await coach(page, 'settings-nav-appearance').click()
    await coach(page, 'settings-darkMode').click()
    await expect(coach(page, 'win-settings-content')).toHaveAttribute('data-dark', 'true')
    await pause(page)
    await coach(page, 'settings-darkMode').click()
    await expect(coach(page, 'win-settings-content')).not.toHaveAttribute('data-dark', 'true')
    await pause(page)
  } else {
    await coach(page, 'settings-nav-personalization').click()
    await coach(page, 'settings-link-background').click()
    await coach(page, 'settings-wallpaper-2').click()
    await pause(page)
    await coach(page, 'settings-nav-personalization').click()
    await coach(page, 'settings-link-colors').click()
    await coach(page, 'settings-mode').selectOption('Dark')
    await expect(coach(page, 'win-settings-content')).toHaveAttribute('data-dark', 'true')
    await pause(page)
    await coach(page, 'settings-mode').selectOption('Light')
    await pause(page)
  }
  await coach(page, 'settings-nav-display').click()
  await coach(page, 'settings-zoom').selectOption('150')
  await expect(coach(page, 'win-settings-content')).toHaveAttribute('data-zoom', '150')
  await pause(page)
  await coach(page, 'settings-zoom').selectOption('100')
  await expect(coach(page, 'win-settings-content')).not.toHaveAttribute('data-zoom', /.+/)
  await pause(page)
  await coach(page, 'settings-nav-sound').click()
  await coach(page, 'settings-volume').fill('90')
  await pause(page)
}

test.describe('Module 10 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 10)
    await effects(page, false)
    // mute from the tray's quick settings
    await coach(page, 'tray-wifi').click()
    await coach(page, 'qs-mute').click()
    await expect(coach(page, 'qs-mute')).toHaveAttribute('aria-checked', 'true')
    await pause(page)
    await coach(page, 'qs-mute').click()
    await pause(page)
    // Wi-Fi with the practice password (wrong first, gently)
    await coach(page, 'settings-nav-network').click()
    await coach(page, 'settings-network-PracticeNet').click()
    await coach(page, 'settings-wifi-connect').click()
    await coach(page, 'settings-wifi-password').fill('wrong')
    await coach(page, 'settings-wifi-next').click()
    await expect(coach(page, 'settings-wifi-error')).toContainText('isn’t right')
    await coach(page, 'settings-wifi-password').fill('practice123')
    await coach(page, 'settings-wifi-next').click()
    await expect(coach(page, 'settings-network-PracticeNet')).toContainText('Connected')
    await pause(page)
    // timezone starts in New York, change to Dhaka
    await coach(page, 'settings-nav-time').click()
    await expect(coach(page, 'settings-timezone')).toHaveValue('America/New_York')
    await coach(page, 'settings-timezone').selectOption('Asia/Dhaka')
    await pause(page)
    // Bluetooth + printer
    await coach(page, 'settings-nav-bluetooth').click()
    await coach(page, 'settings-bluetoothOn').click()
    await coach(page, 'settings-bt-add').click()
    await coach(page, 'settings-bt-kind').click()
    await coach(page, 'settings-bt-device-Practice Speaker').click()
    await coach(page, 'settings-bt-done').click()
    await coach(page, 'settings-link-printers').click()
    await coach(page, 'settings-printer-add').click()
    await coach(page, 'settings-printer-found-Practice Inkjet').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['10'].stepsDone.windows.length)
    expect(saved).toBe(31)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 10)
    await effects(page, true)
    await coach(page, 'control-center').click()
    await coach(page, 'cc-volume').fill('0')
    await pause(page)
    await coach(page, 'cc-volume').fill('50')
    await pause(page)
    await coach(page, 'settings-nav-network').click()
    await coach(page, 'settings-network-PracticeNet').click()
    await coach(page, 'settings-wifi-password').fill('wrong')
    await coach(page, 'settings-wifi-join').click()
    await expect(coach(page, 'settings-wifi-error')).toBeVisible()
    await coach(page, 'settings-wifi-password').fill('practice123')
    await coach(page, 'settings-wifi-join').click()
    await pause(page)
    await coach(page, 'settings-nav-time').click()
    await coach(page, 'settings-timezone').selectOption('Asia/Dhaka')
    await pause(page)
    await coach(page, 'settings-nav-bluetooth').click()
    await coach(page, 'settings-bluetoothOn').click()
    await coach(page, 'settings-bt-connect-Practice Speaker').click()
    await coach(page, 'settings-nav-printers').click()
    await coach(page, 'settings-printer-add').click()
    await coach(page, 'settings-printer-pick-Practice Inkjet').click()
    await coach(page, 'settings-printer-confirm').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['10'].stepsDone.mac.length)
    expect(saved).toBe(26)
  })
})

test.describe('Module 10 widget', () => {
  test('settings map shows both systems', async ({ page }) => {
    await seedProfile(page, 'mac', SETTINGS)
    await page.goto('/#/module/10')
    await page.locator('[data-setting="printer"]').click()
    await expect(page.getByTestId('settings-map-result')).toContainText('Printers & Scanners')
    await expect(page.getByTestId('settings-map-result').locator('[data-os="mac"]')).toContainText('আপনার')
  })
})

test.describe('Module 10 quiz', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`quiz completes (${os})`, async ({ page }) => {
      await seedProfile(page, os, SETTINGS)
      await page.goto('/#/module/10')
      await page.getByRole('button', { name: /কুইজ/ }).first().click()
      // q1 click the Wi-Fi icon (wrong first)
      await page.getByRole('button', { name: /স্পিকারের ছবি/ }).click()
      await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
      await page.getByRole('button', { name: /তরঙ্গের ছবি/ }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      // q2 ordering
      const want = ['Settings খুলুন', 'Network & internet', 'নেটওয়ার্কের নামটি', 'পাসওয়ার্ড লিখে', '“Connected”']
      for (let i = 0; i < want.length; i++) {
        for (let guard = 0; guard < 8; guard++) {
          const items = await page.locator('ol > li').allInnerTexts()
          const cur = items.findIndex((t) => t.includes(want[i]))
          if (cur <= i) break
          await page.locator('ol > li').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
        }
      }
      await page.getByRole('button', { name: 'যাচাই করুন' }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      // q3 drag-match
      for (const [slot, chip] of [
        ['Brightness (উজ্জ্বলতা)', 'পর্দার আলো কম-বেশি করা'],
        ['Volume (আওয়াজ)', 'স্পিকারের শব্দ জোরে বা আস্তে করা'],
        ['Wallpaper', 'ডেস্কটপের পেছনের ছবি বদলানো'],
        ['Time zone', 'ঘড়িতে কোন অঞ্চলের সময় দেখাবে'],
        ['Bluetooth', 'তার ছাড়া স্পিকার বা হেডফোন জোড়া'],
      ]) {
        await page.getByRole('button', { name: chip, exact: true }).click()
        await page.getByRole('button', { name: new RegExp(`^${esc(slot)} — এখানে বসান`) }).click()
      }
      await page.getByRole('button', { name: 'যাচাই করুন' }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      // q4, q5 multiple choice
      await page.getByLabel(/Display সেটিংসে Scale/).check()
      await page.getByRole('button', { name: 'উত্তর দিন' }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      await page.getByLabel(/ধীরে আবার লিখব/).check()
      await page.getByRole('button', { name: 'উত্তর দিন' }).click()
      await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
      const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['10'].quiz)
      expect(q.total).toBe(5)
      expect(q.score).toBe(4)
    })
  }
})
