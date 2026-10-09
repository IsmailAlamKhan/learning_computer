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

/** Module 19: three units (tech-words, read-errors, find-and-ask), each hook → cards → practice → 3 questions → celebration. */

const SETTINGS = { settings: { numerals: 'western', unlockAll: true } }
const SIM = '[data-sim-root]'

async function openBrowser(page: Page, os: 'windows' | 'mac') {
  await coach(page, os === 'windows' ? 'taskbar-app-browser' : 'dock-browser').click()
}

async function unit1(page: Page, os: 'windows' | 'mac') {
  await startUnit(page, 0)
  await expect(page.getByTestId('deck-text')).toContainText('অল্প কয়েকটা শব্দ')
  await nextCard(page, 2) // warning vs error, the words widget
  await expect(page.getByTestId('tech-words')).toBeVisible()
  await page.getByTestId('tw-search').fill('timeout')
  await expect(page.getByTestId('tw-card-timeout')).toBeVisible()
  await page.getByTestId('tw-card-timeout').click()
  await expect(page.getByTestId('tw-bn')).toContainText('সময় শেষ')
  await page.getByTestId('tw-mode-drill').click()
  await expect(page.getByTestId('tw-q')).toBeVisible()
  await skipToPractice(page)
  await expect(primary(page)).toBeDisabled()
  await openBrowser(page, os)
  await coach(page, 'browser-address').fill('wrong-address.example')
  await coach(page, 'browser-address').press('Enter')
  await expect(coach(page, 'browser-error')).toContainText('can’t be reached')
  await coach(page, 'browser-error-home').click()
  await expectPracticeDone(page)
  await nextCard(page)
  await matchPairs(page, [['permission denied', 'অনুমতি নেই'], ['not found', 'খুঁজে পাওয়া যায়নি'], ['invalid', 'ঠিক নয় \\(নিয়ম মেলেনি\\)'], ['timeout', 'সময় শেষ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /বড় ভুল করেছেন/)
  await expectWrong(page)
  await answerChoice(page, /কাজ থামেনি/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /পাসওয়ার্ডটি মেলেনি/)
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit2(page: Page) {
  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 4) // clue, three questions, traceback code, the error-reader widget
  await expect(page.getByTestId('error-reader')).toBeVisible()
  await page.getByTestId('er-line-p4').click()
  await expect(page.getByTestId('er-note')).toContainText('NameError')
  await page.getByTestId('er-tab-javascript').click()
  await page.getByTestId('er-line-j1').click()
  await expect(page.getByTestId('er-note')).toContainText('ReferenceError')
  await skipToPractice(page)
  await coach(page, 'code-explorer-broken.py').click()
  await coach(page, 'code-run').click()
  await expect(coach(page, 'code-error-original')).toContainText("NameError: name 'mesage' is not defined", { timeout: 30000 })
  // fix the typo on line 2 and save
  await page.locator(`${SIM} .cm-content`).click()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.insertText('message = "Hello, friend"\nprint(message)\n')
  await coach(page, 'code-save').click()
  await coach(page, 'code-run').click()
  await expect(coach(page, 'code-output-text')).toContainText('Hello, friend', { timeout: 30000 })
  await expectPracticeDone(page)
  await nextCard(page)
  await answerClick(page, 'Traceback')
  await expectWrong(page)
  await answerClick(page, "NameError: name 'total_price'")
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /নামটি আগে তৈরি করা হয়নি/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['থামুন, শান্ত হয়ে', 'শেষ লাইনে ভুলের নাম', 'লাইন নম্বর দেখুন', 'ঠিক করুন'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit3(page: Page, os: 'windows' | 'mac') {
  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 4) // exact search, trust, one thing at a time, the question-builder widget
  await expect(page.getByTestId('question-builder')).toBeVisible()
  await page.getByTestId('qb-want').fill('দুটি সংখ্যা যোগ করতে চাই')
  await page.getByTestId('qb-did').fill('Python-এ print লিখেছি')
  await page.getByTestId('qb-happened').fill('NameError এসেছে')
  await expect(page.getByTestId('qb-output')).toContainText('NameError')
  await skipToPractice(page)
  await openBrowser(page, os)
  await coach(page, 'browser-address').fill('NameError: name is not defined python')
  await coach(page, 'browser-address').press('Enter')
  await coach(page, 'search-result-1').click()
  await expect(coach(page, 'm19-qa-accepted')).toBeVisible()
  await coach(page, 'm19-docs-link').click()
  await expect(coach(page, 'm19-docs')).toBeVisible()
  await expectPracticeDone(page)
  await nextCard(page)
  await orderItems(page, ['শান্ত হয়ে পুরো মেসেজ', 'শেষ লাইন আর লাইন নম্বর', 'হুবহু মেসেজ ভাষার নামসহ', 'অফিসিয়াল বা Accepted', 'নোটবুকে এরর আর সমাধান'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /কপি করে জমা দেব/)
  await expectWrong(page)
  await answerChoice(page, /ব্যাখ্যা চাইব/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /চালাব না/)
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

test.describe('Module 19 cards flow', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`${os}: all three units end to end, progress saved`, async ({ page }) => {
      await seedProfile(page, os, SETTINGS)
      const problems = watchProblems(page)
      await openModule(page, 19)
      await expect(page.getByTestId('units-overview')).toBeVisible()
      await unit1(page, os)
      await unit2(page)
      await unit3(page, os)
      await expect(page.getByTestId('deck-celebrate')).toBeVisible()
      const saved = await savedProgress(page)
      expect(saved.modules['19']).toBeTruthy()
      expect(problems).toEqual([])
    })
  }

  test('cards need no scrolling', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await openModule(page, 19)
    await startUnit(page, 1)
    for (let i = 0; i < 5; i++) {
      if (i !== 4) await expectNoScroll(page)
      await nextCard(page)
    }
  })
})

test.describe('Notebook', () => {
  test('create, edit, search, export, delete', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await page.goto('/#/')
    await page.getByRole('link', { name: 'নোটবুক', exact: true }).click()
    await expect(page).toHaveURL(/#\/notebook/)
    await expect(page.getByTestId('note-empty')).toBeVisible()

    await page.getByTestId('note-template-new-word').click()
    await page.getByTestId('note-body').fill('শব্দ: timeout\nঅর্থ: সময় শেষ')
    await expect(page.getByTestId('note-save-status')).toContainText('সেভ হয়েছে')
    await page.getByTestId('note-done').click()

    await page.getByTestId('note-new').click()
    await page.getByTestId('note-title').fill('Second note')
    await page.getByTestId('note-mono').check()
    await page.getByTestId('note-body').fill('print(mesage)')
    await expect(page.getByTestId('note-save-status')).toContainText('সেভ হয়েছে')
    await page.getByTestId('note-done').click()
    await expect(page.getByTestId('note-item')).toHaveCount(2)
    await expect(page.getByTestId('note-item').first()).toContainText('Second note')

    // persists across reload
    await page.reload()
    await expect(page.getByTestId('note-item')).toHaveCount(2)

    await page.getByTestId('note-search').fill('timeout')
    await expect(page.getByTestId('note-item')).toHaveCount(1)
    await page.getByTestId('note-open').click()
    await page.getByTestId('note-body').fill('শব্দ: timeout (edited)')
    await expect(page.getByTestId('note-save-status')).toContainText('সেভ হয়েছে')
    await page.getByTestId('note-done').click()
    await expect(page.getByTestId('note-item')).toContainText('edited')
    await page.getByTestId('note-search').fill('')

    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('note-export-md').click()])
    expect(dl.suggestedFilename()).toBe('my-programming-notebook.md')

    await page.getByTestId('note-delete').first().click()
    await page.getByTestId('note-delete-yes').click()
    await expect(page.getByTestId('note-item')).toHaveCount(1)
  })

  test('add to notebook from a lesson summary', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await openModule(page, 19)
    await startUnit(page, 0)
    await nextCard(page, 2) // warning vs error, then the words widget
    await expect(page.getByTestId('tech-words')).toBeVisible()
    await skipToPractice(page)
    await coach(page, 'taskbar-app-browser').click()
    await coach(page, 'browser-address').fill('wrong-address.example')
    await coach(page, 'browser-address').press('Enter')
    await coach(page, 'browser-error-home').click()
    await expectPracticeDone(page)
    await nextCard(page)
    await matchPairs(page, [['permission denied', 'অনুমতি নেই'], ['not found', 'খুঁজে পাওয়া যায়নি'], ['invalid', 'ঠিক নয় \\(নিয়ম মেলেনি\\)'], ['timeout', 'সময় শেষ']])
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)
    await answerChoice(page, /কাজ থামেনি/)
    await nextCard(page)
    await answerChoice(page, /পাসওয়ার্ডটি মেলেনি/)
    await nextCard(page)
    expect(await slideKind(page)).toBe('celebrate')
    await page.getByTestId('add-to-notebook').click()
    await page.getByRole('link', { name: 'নোটবুক খুলুন' }).click()
    await expect(page.getByTestId('note-item')).toContainText('টেক ইংরেজি')
  })
})
