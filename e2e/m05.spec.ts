import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  expectNoScroll,
  expectPracticeDone,
  expectRight,
  expectWrong,
  matchPairs,
  nextCard,
  openModule,
  orderItems,
  primary,
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'

/** Module 5 — four units: keys, shortcuts, typing + symbols, Bangla keyboard (19 guided steps per OS). */

// the coach shows a short "well done" pause (1.4 s) after every step; wait it out so each key press is seen by the right step
const pause = (page: Page) => page.waitForTimeout(1600)

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Unit 1 practice: type with Shift. */
async function unit1Practice(page: Page) {
  await coach(page, 'editor-text').click()
  await page.keyboard.type('Hello World')
}

/** Unit 3 practice: code symbols (Shift for ( ) and "). */
async function unit3Practice(page: Page) {
  await coach(page, 'editor-text').click()
  await page.keyboard.type('print("Hello")')
}

/** press next until the first quiz question */
async function toQuiz(page: Page) {
  for (let i = 0; i < 12 && (await slideKind(page)) !== 'quiz'; i++) {
    if ((await slideKind(page)) === 'practice') throw new Error('unexpected practice slide')
    await nextCard(page)
  }
  expect(await slideKind(page)).toBe('quiz')
}

/** go to card number n of the unit (hook = 0); the widget on it renders lazily, so wait for its test id */
async function toCardWith(page: Page, n: number, testId: string) {
  await nextCard(page, n)
  await expect(page.getByTestId(testId).first()).toBeVisible({ timeout: 15_000 })
}

async function unit1Quiz(page: Page) {
  await answerClick(page, 'Enter / Return')
  await expectWrong(page)
  await answerClick(page, 'Backspace / delete')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'Tab')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'বাক্সটি বন্ধ হবে')
  await expectRight(page)
  await nextCard(page)
}

/** Unit 2 practice (6 steps): type, then Select All / Copy / click / Paste / Undo. The coach pauses 1.4 s after each step. */
async function unit2Practice(page: Page, mod: 'Control' | 'Meta') {
  const pause = () => page.waitForTimeout(1600)
  await coach(page, 'editor-text').click()
  await page.keyboard.type('Hello')
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

async function unit2Quiz(page: Page) {
  const pairs = [['Ctrl / ⌘ + C', 'কপি (নকল করা)'], ['Ctrl / ⌘ + V', 'পেস্ট (বসানো)'], ['Ctrl / ⌘ + Z', 'আনডু (ফিরে যাওয়া)'], ['Ctrl / ⌘ + A', 'সব বেছে নেওয়া'], ['Ctrl / ⌘ + S', 'সেভ (জমিয়ে রাখা)']]
  await matchPairs(page, pairs.map(([l, r]) => [esc(l), esc(r)]))
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['যে লেখা নেবেন', 'Ctrl + C', 'যেখানে বসাবেন', 'Ctrl + V'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'Windows-এ Ctrl, Mac-এ ⌘')
  await expectRight(page)
  await nextCard(page)
}

async function unit3Quiz(page: Page) {
  await answerChoice(page, 'Shift চেপে ধরে [ চাপব')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'F আর J')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, '(')
  await expectRight(page)
  await nextCard(page)
}

async function unit4Quiz(page: Page) {
  await answerChoice(page, 'ইংরেজি (Windows-এ ENG')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Win \+ Space/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Settings খুলি', 'ভাষা বা কিবোর্ডের অংশে', 'বাংলা বেছে যোগ', 'বোতাম বা মেনু থেকে'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function unit4PracticeWindows(page: Page) {
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
}

async function unit4PracticeMac(page: Page) {
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
}

for (const os of ['windows', 'mac'] as const) {
  test.describe(`Module 5 cards flow (${os})`, () => {
    test(`all four units end to end, progress saved`, async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await openModule(page, 5)
      await expect(page.getByTestId('units-overview')).toBeVisible()

      // unit 1 — the keys (hook, cards, Shift typing step, quiz)
      await startUnit(page, 0)
      await expect(page.getByTestId('deck-text')).toContainText('কিবোর্ড')
      await nextCard(page) // keyboard-layout widget card (quick win)
      await skipToPractice(page)
      await unit1Practice(page)
      await expectPracticeDone(page)
      await nextCard(page)
      await unit1Quiz(page)
      expect(await slideKind(page)).toBe('celebrate')
      const a = await savedProgress(page)
      expect(a.modules['5'].unitsDone).toEqual(['keys'])
      expect(a.modules['5'].unitQuiz['keys']).toMatchObject({ score: 2, total: 3 })

      // unit 2 — shortcuts + practice
      await primary(page).click()
      await expect(page.getByTestId('deck-hook')).toBeVisible()
      await nextCard(page)
      await expect(page.getByTestId('deck-text')).toContainText(os === 'mac' ? '⌘' : 'Ctrl')
      await skipToPractice(page)
      await expect(primary(page)).toBeDisabled()
      await unit2Practice(page, os === 'mac' ? 'Meta' : 'Control')
      await expectPracticeDone(page)
      await nextCard(page)
      await unit2Quiz(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 3 — typing and symbols (widgets, one typing step)
      await primary(page).click()
      await expect(page.getByTestId('deck-hook')).toBeVisible()
      await skipToPractice(page)
      await unit3Practice(page)
      await expectPracticeDone(page)
      await nextCard(page)
      await unit3Quiz(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 4 — the Bangla keyboard
      await primary(page).click()
      await expect(page.getByTestId('deck-hook')).toBeVisible()
      await nextCard(page, 1)
      await skipToPractice(page)
      if (os === 'windows') await unit4PracticeWindows(page)
      else await unit4PracticeMac(page)
      await expectPracticeDone(page)
      await nextCard(page)
      await unit4Quiz(page)
      expect(await slideKind(page)).toBe('celebrate')

      const done = await savedProgress(page)
      expect(done.modules['5'].unitsDone).toEqual(['keys', 'shortcuts', 'typing-symbols', 'bangla-keyboard'])
      expect(done.modules['5'].completed).toBe(true)
      expect(done.modules['5'].stepsDone[os]).toHaveLength(19)
      await page.getByTestId('real-world-toggle').click()
      await expect(page.getByRole('region', { name: 'এবার আসল কম্পিউটারে' })).toBeVisible()
      expect(problems).toEqual([])
    })
  })
}

test.describe('Module 5 widgets and cards', () => {
  test('keyboard layout widget card renders (unit 1)', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 5)
    await startUnit(page, 0)
    await nextCard(page)
    await page.getByRole('button', { name: /কী: Enter|কী: return/ }).first().click()
    await expect(page.getByText(/Return/).first()).toBeVisible()
  })

  test('shortcut table highlights the learner’s own OS (unit 2)', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 5)
    await startUnit(page, 1)
    await toCardWith(page, 5, 'shortcut-table')
    await expect(page.getByTestId('shortcut-table').first().locator('th', { hasText: 'আপনার' })).toContainText('Mac')
  })

  test('typing practice gives gentle live feedback and finishes (unit 3)', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 5)
    await startUnit(page, 2)
    await toCardWith(page, 2, 'typing-input')
    await page.getByTestId('typing-input').click()
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

  test('symbol drill detects the physical key via KeyboardEvent.key (unit 3)', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 5)
    await startUnit(page, 2)
    await toCardWith(page, 5, 'symbol-input')
    await page.locator('[data-symbol="{"]').click()
    await expect(page.getByTestId('symbol-name')).toContainText('কার্লি ব্র্যাকেট')
    await page.getByTestId('symbol-input').click()
    await page.keyboard.press('BracketLeft')
    await expect(page.getByTestId('symbol-feedback')).toContainText('Shift')
    await page.keyboard.press('Shift+BracketLeft')
    await expect(page.getByTestId('symbol-feedback')).toContainText('ঠিক হয়েছে')
    await expect(page.getByTestId('symbol-progress')).toContainText('1')
  })

  test('the Bangla keyboard unit shows the learner’s own shortcut (Win + Space / Control + Space)', async ({ page }) => {
    for (const [os, label] of [['windows', 'Win'], ['mac', 'Control']] as const) {
      await seedProfile(page, os)
      await openModule(page, 5)
      await startUnit(page, 3)
      await nextCard(page, 3)
      await expect(page.getByTestId('deck-text')).toContainText(label)
      break
    }
  })
})
