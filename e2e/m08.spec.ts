import { expect, test } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'

const SETTINGS = { settings: { numerals: 'western', unlockAll: true } }

/** Everything after Mail is open is identical on both systems. */
async function mailFlow(page: import('@playwright/test').Page) {
  await coach(page, 'mail-msg-Class notes for Saturday').click()
  await coach(page, 'mail-save-attachment-Class-Notes.txt').click()
  await coach(page, 'mail-compose').click()
  await coach(page, 'mail-to').fill('friend@mail.example')
  await coach(page, 'mail-subject').fill('Hello')
  await coach(page, 'mail-body').fill('Hello! আপনি কেমন আছেন?')
  await coach(page, 'mail-attach').click()
  await coach(page, 'mail-picker-file-Recipe.txt').click()
  await coach(page, 'mail-picker-attach').click()
  await expect(coach(page, 'mail-chip-Recipe.txt')).toBeVisible()
  await coach(page, 'mail-send').click()
  await coach(page, 'mail-msg-Re: Hello').click()
  await coach(page, 'mail-reply').click()
  await coach(page, 'mail-msg-Claim your free gift now').click()
  await coach(page, 'mail-spam').click()
  await coach(page, 'mail-folder-Spam').click()
  await coach(page, 'mail-msg-Please verify your LearnCode email').click()
  await coach(page, 'mail-notspam').click()
  await coach(page, 'mail-folder-Sent').click()
  await expect(coach(page, 'mail-msg-Hello')).toBeVisible()
  await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
}

test.describe('Module 8 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 8)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-mail').click()
    await mailFlow(page)
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['8'].stepsDone.windows.length)
    expect(saved).toBe(20)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 8)
    await coach(page, 'dock-mail').click()
    await mailFlow(page)
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['8'].stepsDone.mac.length)
    expect(saved).toBe(19)
    // the saved attachment really is in Downloads
    await coach(page, 'dock-files').click()
    await coach(page, 'fm-sidebar-Downloads').click()
    await expect(coach(page, 'fm-item-Class-Notes.txt')).toBeVisible()
  })

  test('explanation widgets render and the sign-up form works', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await page.goto('/#/module/8')
    await expect(page.getByTestId('email-parts')).toBeVisible()
    await expect(page.getByTestId('signup-form')).toBeVisible()
    await page.getByTestId('signup-submit').click()
    await expect(page.getByRole('alert').first()).toBeVisible()
    await page.getByTestId('signup-name').fill('Anika Rahman')
    await page.getByTestId('signup-email').fill('anika@mail.example')
    await page.getByTestId('signup-username').fill('anika_r')
    await page.getByTestId('signup-password').fill('rice2024bhat')
    await page.getByTestId('signup-submit').click()
    await page.getByTestId('signup-verify').click()
    await expect(page.getByTestId('signup-done')).toBeVisible()
  })
})
