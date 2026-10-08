import { expect, test, type Page } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

async function dragBy(page: Page, id: string, dx: number, dy: number) {
  await coach(page, id).scrollIntoViewIfNeeded()
  const box = (await coach(page, id).boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 4 })
  await page.mouse.move(x + dx, y + dy, { steps: 4 })
  await page.mouse.up()
}

const pad = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()

async function common(page: Page, os: 'windows' | 'mac') {
  const win = os === 'windows'
  await cont(page)
  await coach(page, 'win-files-titlebar').click({ position: { x: 150, y: 8 } })
  await dragBy(page, 'win-files-titlebar', 30, 12)
  await dragBy(page, 'win-files-resize-se', -40, -30)
  await coach(page, 'win-files-maximize').click()
  await coach(page, 'win-files-maximize').click()
  await coach(page, 'win-files-titlebar').dblclick({ position: { x: 250, y: 8 } })
  await coach(page, 'win-files-titlebar').dblclick({ position: { x: 250, y: 8 } })
  await coach(page, 'win-files-minimize').click()
  await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
  // switch with the on-screen shortcut pad (pad must be visible by default)
  await expect(page.getByTestId('shortcut-pad')).toBeVisible()
  await pad(page, win ? 'pad-alt' : 'pad-cmd').click()
  await pad(page, 'pad-key-tab').click()
  await pad(page, win ? 'pad-alt' : 'pad-cmd').click()
  await pad(page, 'pad-key-tab').click()
  await coach(page, win ? 'taskbar-app-editor' : 'dock-editor').click()
  await page.locator('[data-coach="editor-text"]').fill('hello')
  await coach(page, 'win-editor-close').click()
  await coach(page, 'dialog-dont-save').click()
  await coach(page, 'win-files-close').click()
  await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
}

test.describe('Module 3 guided practice', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`${os} flow completes end to end`, async ({ page }) => {
      await seedProfile(page, os, { settings: { numerals: 'western', unlockAll: true } })
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(String(e)))
      await startGuided(page, 3)
      await common(page, os)
      expect(errors).toEqual([])
      const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['3'].stepsDone[o].length, os)
      expect(saved).toBe(17)
    })
  }
})
