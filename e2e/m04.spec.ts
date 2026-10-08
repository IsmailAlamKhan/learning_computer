import { expect, test, type Page } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

/** Module 4 may be locked until earlier modules are done, so unlock everything in the seeded profile. */
const UNLOCK = { settings: { numerals: 'western', unlockAll: true } }

/** Let the sim hand keyboard focus back to itself after a control disappears (a human is never this fast). */
const settle = (page: Page) => page.waitForTimeout(700)

async function renameTo(page: Page, name: string) {
  await page.locator('[data-coach="rename-input"]').fill(name)
  await page.keyboard.press('Enter')
}

/** Steps that are identical on both OSes once the OS-specific entry points have been used. */
async function copyDeleteRestore(page: Page, os: 'windows' | 'mac') {
  const win = os === 'windows'
  await coach(page, 'fm-item-Recipe.txt').click()
  await page.keyboard.press(win ? 'Control+c' : 'Meta+c')
  await coach(page, 'fm-item-MyWork').dblclick()
  await coach(page, 'fm-content').click({ button: 'right', position: { x: 500, y: 250 } })
  await coach(page, 'ctx-paste').click()
  await coach(page, 'fm-delete').click()
  await coach(page, win ? 'fm-sidebar-Recycle Bin' : 'fm-sidebar-Trash').click()
  await coach(page, 'fm-item-Recipe.txt').click()
  await coach(page, 'fm-restore').click()
  await coach(page, 'win-bin-close').click()
}

test.describe('Module 4 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows', UNLOCK)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 4)
    await coach(page, 'fm-sidebar-Documents').click()
    await cont(page)
    await coach(page, 'fm-view').click()
    await coach(page, 'ctx-show').click()
    await coach(page, 'ctx-show-ext').click()
    await coach(page, 'fm-new').click()
    await coach(page, 'ctx-new-folder').click()
    await renameTo(page, 'MyWork')
    await coach(page, 'fm-new').click()
    await coach(page, 'ctx-new-text').click()
    await renameTo(page, 'notes.txt')
    await settle(page)
    await page.keyboard.press('F2')
    await renameTo(page, 'ideas.txt')
    await coach(page, 'fm-item-ideas.txt').dragTo(coach(page, 'fm-item-MyWork'))
    await copyDeleteRestore(page, 'windows')
    await page.keyboard.press('Control+l')
    await page.locator('[data-coach="fm-address-input"]').fill('C:\\Users\\Anika\\Documents')
    await page.keyboard.press('Enter')
    await page.locator('[data-coach="fm-search"]').fill('Birthdays')
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['4'].stepsDone.windows.length)
    expect(saved).toBe(27)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac', UNLOCK)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 4)
    await coach(page, 'fm-sidebar-Documents').click()
    await cont(page)
    await coach(page, 'fm-view-options').click()
    await coach(page, 'ctx-show-ext').click()
    await coach(page, 'fm-new-folder').click()
    await renameTo(page, 'MyWork')
    await coach(page, 'fm-item-notes.txt').click()
    await settle(page)
    await page.keyboard.press('Enter')
    await renameTo(page, 'ideas.txt')
    await coach(page, 'fm-item-ideas.txt').dragTo(coach(page, 'fm-item-MyWork'))
    await copyDeleteRestore(page, 'mac')
    await page.keyboard.press('Shift+Meta+g')
    await page.locator('[data-coach="goto-input"]').fill('/Users/anika/Documents')
    await coach(page, 'dialog-go').click()
    await page.locator('[data-coach="fm-search"]').fill('Birthdays')
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['4'].stepsDone.mac.length)
    expect(saved).toBe(23)
  })
})

for (const os of ['windows', 'mac'] as const) {
  test(`Module 4 quiz and path-explorer widget (${os})`, async ({ page }) => {
    await seedProfile(page, os, UNLOCK)
    await page.goto('/#/module/4')
    // the path-explorer widget: build the challenge path
    const w = page.locator('[data-widget="path-explorer"]')
    await expect(w).toBeVisible()
    await w.locator('[data-node="Family"]').click()
    await w.locator('[data-node="Birthdays.txt"]').click()
    await expect(w.getByTestId('abs-text')).toHaveText('C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt')
    await expect(w.getByTestId('challenge')).toContainText('চমৎকার')
    await w.locator('[data-style="mac"]').click()
    await expect(w.getByTestId('abs-text')).toHaveText('/Users/anika/Documents/Family/Birthdays.txt')

    await page.getByRole('button', { name: /কুইজ/ }).first().click()
    // q1 absolute path (wrong first)
    await page.getByLabel(/^Documents\\Family/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
    await page.getByLabel(/^C:\\Users\\Anika\\Documents\\Recipe\.txt$/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q2 drag-match by tap-then-tap
    for (const [chip, slot] of [['সাধারণ লেখার ফাইল', '.txt'], ['ছবি', '.jpg'], ['পড়ার মতো ডকুমেন্ট', '.pdf'], ['ওয়েবপেজ', '.html'], ['পাইথন প্রোগ্রাম', '.py']]) {
      await page.getByRole('button', { name: chip, exact: true }).click()
      await page.getByRole('button', { name: new RegExp(`^\\${slot} — এখানে বসান`) }).click()
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q3 click the file name part of the path
    await page.getByRole('button', { name: /Birthdays\.txt/ }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q4 ordering
    const want = ['ফাইলটি বেছে মুছে', 'রিসাইকেল বিন (Mac-এ ট্র্যাশ) খুলি', 'মোছা ফাইলটি বেছে', 'Restore (Mac-এ']
    for (let i = 0; i < want.length; i++) {
      for (let guard = 0; guard < 6; guard++) {
        const items = await page.locator('ol > li').allInnerTexts()
        const cur = items.findIndex((t) => t.includes(want[i]))
        if (cur <= i) break
        await page.locator('ol > li').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
      }
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q5 extension MC
    await page.getByLabel(/ঠিকমতো খুলবে না/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
    const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['4'].quiz)
    expect(q.total).toBe(5)
    expect(q.score).toBe(4)
  })
}
