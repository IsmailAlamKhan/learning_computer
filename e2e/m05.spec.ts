import { expect, test, type Page } from '@playwright/test'
import { coach, seedProfile as seed, startGuided } from './helpers'
const seedProfile = (page: Page, os: 'windows' | 'mac') => seed(page, os, { settings: { numerals: 'western', unlockAll: true } })

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Steps 1–6: type with Shift, then Select All / Copy / click / Paste / Undo with the real keys. */
async function shortcutsPart(page: Page, mod: 'Control' | 'Meta') {
  // the coach shows a short "well done" pause (1.4s) after every step; wait it out so each key press is seen by the right step
  const pause = () => page.waitForTimeout(1600)
  await coach(page, 'editor-text').click()
  await page.keyboard.type('Hello World')
  await pause()
  await page.keyboard.press(`${mod}+a`)
  await pause()
  await page.keyboard.press(`${mod}+c`)
  await pause()
  await coach(page, 'editor-text').click()
  await pause()
  await page.keyboard.press(`${mod}+v`)
  await pause()
  await page.keyboard.press(`${mod}+z`)
  await pause()
}

test.describe('Module 5 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 5)
    await shortcutsPart(page, 'Control')
    await coach(page, 'taskbar-app-settings').click()
    await coach(page, 'settings-nav-time').click()
    await coach(page, 'settings-time-tab-language').click()
    await coach(page, 'settings-add-language').click()
    await coach(page, 'settings-lang-choice-bn').click()
    await coach(page, 'settings-lang-next').click()
    await coach(page, 'settings-lang-install').click()
    await expect(coach(page, 'tray-input')).toHaveText('ENG')
    await coach(page, 'tray-input').click()
    await coach(page, 'tray-input-bn').click()
    await expect(coach(page, 'tray-input')).toHaveText('BEN')
    await coach(page, 'tray-input').click()
    await coach(page, 'tray-input-en').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['5'].stepsDone.windows.length)
    expect(saved).toBe(17)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 5)
    await shortcutsPart(page, 'Meta')
    await coach(page, 'dock-settings').click()
    await coach(page, 'settings-nav-keyboard').click()
    await coach(page, 'settings-input-edit').click()
    await coach(page, 'settings-input-add').click()
    await coach(page, 'settings-input-lang-bn').click()
    await coach(page, 'settings-input-add-confirm').click()
    await coach(page, 'settings-input-done').click()
    await expect(coach(page, 'menubar-input')).toHaveText('ABC')
    await coach(page, 'menubar-input').click()
    await coach(page, 'menubar-input-bn').click()
    await coach(page, 'menubar-input').click()
    await coach(page, 'menubar-input-en').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['5'].stepsDone.mac.length)
    expect(saved).toBe(17)
  })
})

test.describe('Module 5 widgets', () => {
  test('typing practice gives gentle live feedback and finishes', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/module/5')
    const input = page.getByTestId('typing-input')
    await input.scrollIntoViewIfNeeded()
    await input.click()
    await page.keyboard.type('asx')
    await expect(page.getByTestId('typing-target').locator('[data-state="wrong"]')).toHaveCount(1)
    await expect(page.getByTestId('typing-message')).toContainText('Backspace')
    await page.keyboard.press('Backspace')
    await page.keyboard.type('df jkl')
    await expect(page.getByTestId('typing-target').locator('[data-state="wrong"]')).toHaveCount(0)
    await expect(page.getByTestId('typing-accuracy')).toContainText('%')
    await expect(page.getByRole('button', { name: /পরের অনুশীলন/ })).toBeVisible()
    await page.getByRole('tab', { name: /কোডের মতো লেখা/ }).click()
    await page.getByTestId('typing-input').click()
    await page.keyboard.type('print("Hello")')
    await expect(page.getByRole('button', { name: /পরের অনুশীলন/ })).toBeVisible()
  })

  test('symbol drill detects the physical key via KeyboardEvent.key', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/module/5')
    await page.locator('[data-symbol="{"]').click()
    await expect(page.getByTestId('symbol-name')).toContainText('কার্লি ব্র্যাকেট')
    const input = page.getByTestId('symbol-input')
    await input.click()
    await page.keyboard.press('BracketLeft')
    await expect(page.getByTestId('symbol-feedback')).toContainText('Shift')
    await page.keyboard.press('Shift+BracketLeft')
    await expect(page.getByTestId('symbol-feedback')).toContainText('ঠিক হয়েছে')
    await expect(page.getByTestId('symbol-progress')).toContainText('1')
    await page.keyboard.press('KeyA')
    await expect(page.getByTestId('symbol-feedback')).not.toContainText('ঠিক হয়েছে')
  })

  test('shortcut table highlights the learner’s own OS and keyboard widget renders', async ({ page }) => {
    await seedProfile(page, 'mac')
    await page.goto('/#/module/5')
    await expect(page.getByTestId('shortcut-table').first().locator('th', { hasText: 'আপনার' })).toHaveCount(1)
    await expect(page.getByTestId('shortcut-table').first().locator('th', { hasText: 'আপনার' })).toContainText('Mac')
    await page.getByRole('button', { name: /কী: Enter|কী: return/ }).first().click()
    await expect(page.getByText(/Return/).first()).toBeVisible()
  })
})

test.describe('Module 5 quiz', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`quiz completes (${os})`, async ({ page }) => {
      await seedProfile(page, os)
      await page.goto('/#/module/5')
      await page.getByRole('button', { name: /কুইজ/ }).first().click()
      // q1 drag-match (tap, then tap the slot)
      for (const [slot, chip] of [['Ctrl / ⌘ + C', 'কপি (নকল করা)'], ['Ctrl / ⌘ + V', 'পেস্ট (বসানো)'], ['Ctrl / ⌘ + Z', 'আনডু (ফিরে যাওয়া)'], ['Ctrl / ⌘ + A', 'সব বেছে নেওয়া'], ['Ctrl / ⌘ + S', 'সেভ (জমিয়ে রাখা)']]) {
        await page.getByRole('button', { name: chip, exact: true }).click()
        await page.getByRole('button', { name: new RegExp(`^${esc(slot)} — এখানে বসান`) }).click()
      }
      await page.getByRole('button', { name: 'যাচাই করুন' }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      // q2 click the right key (wrong first)
      await page.getByRole('button', { name: /Enter \/ Return/ }).click()
      await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
      await page.getByRole('button', { name: /Backspace \/ delete/ }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      // q3 multiple choice
      await page.getByLabel(/Shift চেপে ধরে \[ কী চাপব/).check()
      await page.getByRole('button', { name: 'উত্তর দিন' }).click()
      await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
      // q4 ordering
      const want = ['যে লেখা নেবেন', 'Ctrl + C', 'যেখানে বসাবেন', 'Ctrl + V']
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
      // q5 multiple choice
      await page.getByLabel(/ইংরেজি কিবোর্ড \(Windows-এ ENG/).check()
      await page.getByRole('button', { name: 'উত্তর দিন' }).click()
      await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
      const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['5'].quiz)
      expect(q.total).toBe(5)
      expect(q.score).toBe(4)
    })
  }
})
