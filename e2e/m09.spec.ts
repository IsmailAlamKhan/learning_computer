import { expect, test } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

const SETTINGS = { settings: { numerals: 'western', unlockAll: true } }
const pad = (page: import('@playwright/test').Page, id: string) => page.locator(`[data-coach="${id}"]`).first()

async function network(page: import('@playwright/test').Page, closeId = 'win-settings-close') {
  await coach(page, 'settings-nav-network').click()
  await coach(page, 'settings-network-CafeGuest').click()
  await coach(page, 'settings-network-HomeWiFi').click()
  await coach(page, closeId).click()
  await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
}

test.describe('Module 9 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 9)
    await cont(page)
    await expect(page.getByTestId('shortcut-pad')).toBeVisible()
    await pad(page, 'pad-cmd').click()
    await pad(page, 'pad-key-l').click()
    await coach(page, 'unlock-button').click()
    await coach(page, 'taskbar-app-settings').click()
    await network(page)
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['9'].stepsDone.windows.length)
    expect(saved).toBe(8)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 9)
    await cont(page)
    await expect(page.getByTestId('shortcut-pad')).toBeVisible()
    await pad(page, 'pad-ctrl').click()
    await pad(page, 'pad-cmd').click()
    await pad(page, 'pad-key-q').click()
    await coach(page, 'unlock-button').click()
    await coach(page, 'dock-settings').click()
    await network(page)
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['9'].stepsDone.mac.length)
    expect(saved).toBe(8)
  })
})

test.describe('Module 9 interactive widgets', () => {
  test('spot-the-scam, link check and password widgets work in the lesson', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await page.goto('/#/module/9')
    await page.getByTestId('pw-input').fill('blue tea river chair')
    await expect(page.getByTestId('pw-label')).toHaveAttribute('data-level', 'strong')
    await page.getByTestId('link-b').hover()
    await expect(page.getByTestId('status-bar')).toContainText('takapay-verify.example')
    await page.getByTestId('verdict-scam').click()
    await expect(page.getByTestId('scam-feedback')).toHaveAttribute('data-correct', 'yes')
  })
})
