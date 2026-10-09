import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  expectPracticeDone,
  expectRight,
  matchPairs,
  nextCard,
  openModule,
  orderItems,
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'

/** Module 8: three units. Each: hook → cards → practice → 3 questions → celebration. */

async function openMail(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-mail').click()
  } else {
    await coach(page, 'dock-mail').click()
  }
}

async function unit1Practice(page: Page, os: 'windows' | 'mac') {
  await openMail(page, os)
  await coach(page, 'mail-msg-Class notes for Saturday').click()
  await coach(page, 'mail-save-attachment-Class-Notes.txt').click()
  await expectPracticeDone(page)
}

async function unit2Practice(page: Page) {
  await coach(page, 'mail-compose').click()
  await coach(page, 'mail-to').fill('friend@mail.example')
  await coach(page, 'mail-subject').fill('Hello')
  await coach(page, 'mail-body').fill('Hello! আপনি কেমন আছেন?')
  await coach(page, 'mail-attach').click()
  await coach(page, 'mail-picker-file-Recipe.txt').click()
  await coach(page, 'mail-picker-attach').click()
  await expect(coach(page, 'mail-chip-Recipe.txt')).toBeVisible()
  await coach(page, 'mail-send').click()
  // the app replies after ~1.5 s: tolerant wait
  await expect(coach(page, 'mail-msg-Re: Hello')).toBeVisible({ timeout: 15_000 })
  await coach(page, 'mail-msg-Re: Hello').click()
  await coach(page, 'mail-reply').click()
  await expectPracticeDone(page)
}

async function unit3Practice(page: Page) {
  await coach(page, 'mail-msg-Claim your free gift now').click()
  await coach(page, 'mail-spam').click()
  await coach(page, 'mail-folder-Spam').click()
  await coach(page, 'mail-msg-Please verify your LearnCode email').click()
  await coach(page, 'mail-notspam').click()
  await coach(page, 'mail-folder-Sent').click()
  await expectPracticeDone(page)
}

async function quiz1(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await answerClick(page, 'mail.example')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /যাচাই করতে/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /অ্যাকাউন্টের ইমেইল ঠিকানায়/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz2(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await orderItems(page, ['Compose চাপি', 'To ঘরে', 'Subject আর মূল লেখা', 'Send চাপি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /^anika@mail\.example$/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /^Forward$/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz3(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await matchPairs(page, [['Inbox', 'আসা চিঠি'], ['Sent', 'পাঠানো চিঠির কপি'], ['Drafts', 'না-পাঠানো খসড়া'], ['Spam', 'সন্দেহজনক চিঠি']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /উত্তর দেব না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Not spam চাপব/)
  await expectRight(page)
  await nextCard(page)
}

for (const os of ['windows', 'mac'] as const) {
  test.describe(`Module 8 cards flow (${os})`, () => {
    test(`${os}: all three units end to end, progress saved`, async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await openModule(page, 8)
      await expect(page.getByTestId('units-overview')).toBeVisible()

      // unit 1: account + email address (widgets as cards)
      await startUnit(page, 0)
      await expect(page.getByTestId('deck-text')).toContainText('ফেসবুক')
      await nextCard(page, 3) // account, why email, email-parts widget
      await expect(page.getByTestId('email-parts')).toBeVisible()
      await nextCard(page) // signup form
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
      await skipToPractice(page)
      await unit1Practice(page, os)
      await nextCard(page)
      await quiz1(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 2: sending (Mail already open)
      await page.goto('/#/')
      await openModule(page, 8)
      await startUnit(page, 1)
      await skipToPractice(page)
      await unit2Practice(page)
      await nextCard(page)
      await quiz2(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 3: spam + habits
      await page.goto('/#/')
      await openModule(page, 8)
      await startUnit(page, 2)
      await skipToPractice(page)
      await unit3Practice(page)
      await nextCard(page)
      await quiz3(page)
      expect(await slideKind(page)).toBe('celebrate')

      const p = await savedProgress(page)
      const done = p.modules['8'].stepsDone[os].length
      expect(done).toBe(os === 'windows' ? 20 : 19)
      expect(problems).toEqual([])
    })
  })
}

test('the saved attachment lands in Downloads (Mac)', async ({ page }) => {
  await seedProfile(page, 'mac')
  await openModule(page, 8)
  await startUnit(page, 0)
  await skipToPractice(page)
  await unit1Practice(page, 'mac')
  await coach(page, 'dock-files').click()
  await coach(page, 'fm-sidebar-Downloads').click()
  await expect(coach(page, 'fm-item-Class-Notes.txt')).toBeVisible()
})
