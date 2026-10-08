import { expect, test, type Page } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'
import lesson from '../src/content/lessons/m13'

const hw = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

async function pad(page: Page, mods: string[], key: string) {
  for (const m of mods) await hw(page, `pad-${m}`).click()
  await hw(page, `pad-key-${key}`).click()
}

async function typeAddress(page: Page, text: string) {
  const a = coach(page, 'browser-address')
  await a.click()
  await a.fill(text)
  await page.keyboard.press('Enter')
}

async function walk(page: Page, os: 'windows' | 'mac') {
  const win = os === 'windows'
  // 1 folder
  await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, win ? 'fm-new' : 'fm-new-folder').click()
  if (win) await coach(page, 'ctx-new-folder').click()
  const rename = coach(page, 'rename-input')
  await rename.fill('MyWork')
  await page.keyboard.press('Enter')
  // 2 note
  if (win) {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
  } else {
    await coach(page, 'menubar-search').click()
    await coach(page, 'spotlight-input').fill('TextEdit')
    await coach(page, 'spotlight-result-0').click()
  }
  await coach(page, 'editor-text').fill('My favourite food is khichuri.')
  if (win) await coach(page, 'editor-menu-file').click()
  await coach(page, 'editor-save-as').click()
  await coach(page, 'save-dialog-folder-MyWork').click()
  await coach(page, 'save-dialog-name').fill('note')
  await coach(page, 'save-dialog-save').click()
  // 3 search
  if (win) {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
  } else await coach(page, 'dock-browser').click()
  await typeAddress(page, 'dal recipe')
  await coach(page, 'search-result-1').click()
  // 4 screenshot
  if (win) await pad(page, ['cmd'], 'prtscn')
  else await pad(page, ['shift', 'cmd'], '3')
  // 5 mail
  if (win) {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-mail').click()
  } else await coach(page, 'dock-mail').click()
  await coach(page, 'mail-compose').click()
  await coach(page, 'mail-to').fill('friend@mail.example')
  await coach(page, 'mail-subject').fill('My note')
  await coach(page, 'mail-attach').click()
  await coach(page, 'mail-picker-folder-MyWork').click()
  await coach(page, 'mail-picker-file-note.txt').click()
  await coach(page, 'mail-picker-attach').click()
  await coach(page, 'mail-send').click()
}

async function quiz(page: Page) {
  await page.getByRole('button', { name: /৪ কুইজ/ }).click()
  // q1 ordering
  const want = ['Notepad বা TextEdit খুলি', 'লেখাটি লিখি', 'Save As বেছে নিই', 'নিজের ফোল্ডার বেছে']
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
  // q2 drag-match (tap, tap)
  for (const [chip, slot] of [['কপি', 'C'], ['পেস্ট', 'V'], ['ভুল ফিরিয়ে নেওয়া', 'Z'], ['সেভ', 'S']]) {
    await page.getByRole('button', { name: chip, exact: true }).click()
    await page.getByRole('button', { name: new RegExp(`^${esc(`Ctrl/Command + ${slot}`)} — এখানে বসান`) }).click()
  }
  await page.getByRole('button', { name: 'যাচাই করুন' }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  // q3 click target (wrong first)
  await page.getByRole('button', { name: /MyWork/ }).click()
  await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
  await page.getByRole('button', { name: /\.txt/ }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  // q4, q5
  await page.getByLabel(/ক্লিক করব না, ওটিপি কাউকে দেব না/).check()
  await page.getByRole('button', { name: 'উত্তর দিন' }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  await page.getByLabel(/কিছুক্ষণ অপেক্ষা করব/).check()
  await page.getByRole('button', { name: 'উত্তর দিন' }).click()
  await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 13 capstone, quiz, completion and certificate (${os})`, async ({ page }) => {
    await seedProfile(page, os, { settings: { numerals: 'western', unlockAll: true } })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await startGuided(page, 13)
    await walk(page, os)
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    await expect(page.getByLabel('কাজের তালিকা').getByText('(বাকি)')).toHaveCount(0)
    const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['13'].stepsDone[o].length, os)
    expect(saved).toBe(lesson.steps.filter((s) => s.osVariant === os || s.osVariant === 'both').length)

    await quiz(page)
    const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['13'].quiz)
    expect(q.total).toBe(5)
    expect(q.score).toBe(4)

    await page.getByRole('button', { name: /৭ শেষ/ }).click()
    await page.getByRole('button', { name: /পাঠ সম্পন্ন করি/ }).click()
    await page.getByRole('link', { name: /সনদ.*দেখুন/ }).click()
    await expect(page).toHaveURL(/#\/certificate\/1/)
    await expect(page.getByLabel('সনদপত্র')).toContainText('রুমা')
    expect(errors).toEqual([])
  })
}
