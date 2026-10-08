import { expect, test } from '@playwright/test'
import { seedProfile } from './helpers'

test('finishing requires steps + quiz, then completes and persists', async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/module/2')
  await page.getByRole('button', { name: /শেষ/ }).last().click()
  await expect(page.getByRole('button', { name: /পাঠ সম্পন্ন করি/ })).toBeDisabled()
  await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('computer-shikhi:v1')!)
    d.modules['2'] = { stepsDone: { windows: ['w-tour-desktop','w-tour-taskbar','w-select','w-open','w-close','w-rightclick','w-new','w-folder','w-name','w-drag','w-start','w-start-app','w-minimize','w-taskbar-back','w-close-files','w-tray','w-tray-close'], mac: [] }, quiz: { score: 5, total: 5, wrongByQuestion: {}, at: '' }, explanationRead: true, freePracticeDone: false, completed: false, realWorldChecked: [] }
    localStorage.setItem('computer-shikhi:v1', JSON.stringify(d))
  })
  await page.reload()
  await page.getByRole('button', { name: /শেষ/ }).last().click()
  await page.getByRole('button', { name: /পাঠ সম্পন্ন করি/ }).click()
  await expect(page.getByText(/এই পাঠ সম্পন্ন হয়েছে/)).toBeVisible()
  await page.goto('/#/')
  await expect(page.getByText('✓ সম্পন্ন').first()).toBeVisible()
})
