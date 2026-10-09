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

/** Module 9 (safety & scams): four units. Each: hook → cards → practice → 3 questions → celebration. */

const pad = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()

async function openBrowser(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
  } else await coach(page, 'dock-browser').click()
}

async function openSettings(page: Page, os: 'windows' | 'mac') {
  await coach(page, os === 'windows' ? 'taskbar-app-settings' : 'dock-settings').click()
}

async function lockAndNetwork(page: Page, os: 'windows' | 'mac') {
  await expect(page.getByTestId('shortcut-pad')).toBeVisible()
  if (os === 'windows') {
    await pad(page, 'pad-cmd').click()
    await pad(page, 'pad-key-l').click()
  } else {
    await pad(page, 'pad-ctrl').click()
    await pad(page, 'pad-cmd').click()
    await pad(page, 'pad-key-q').click()
  }
  await coach(page, 'unlock-button').click()
  await openSettings(page, os)
  await coach(page, 'settings-nav-network').click()
  await coach(page, 'settings-network-CafeGuest').click()
  await coach(page, 'settings-network-HomeWiFi').click()
  await coach(page, 'win-settings-close').click()
  await expectPracticeDone(page)
}

async function quiz1(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await answerClick(page, 'নদী-চা-জানালা-মেঘ')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /একটি ফাঁস হলে সব অ্যাকাউন্ট/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /শুধু একটি মূল পাসওয়ার্ড/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz2(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await answerClick(page, 'লিংকে গিয়ে PIN দিন')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /দ্বিতীয় প্রমাণ ছাড়া/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['কেউ ফোনে OTP চাইল', 'কাউকে বলব না'], ['ফোন হারিয়ে গেল', 'ব্যাকআপ কোড ব্যবহার'], ['নিজে না চাইতেই OTP এল', 'পাসওয়ার্ড বদলে নিই'], ['২-ধাপ যাচাই', 'দ্বিতীয় তালা']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function quiz3(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await answerChoice(page, /তার পরিচিত নম্বরে ফোন/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['কোড বা PIN বলবেন না', 'কল কেটে দিন', 'অফিসিয়াল নম্বরে নিজে', 'পরিবারকে জানান'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /নিজে অ্যাপ বা ওয়েবসাইট খুলে/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz4(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await matchPairs(page, [['ক্যাফের খোলা ওয়াই-ফাই', 'ব্যাংকিং এড়িয়ে চলুন'], ['আপডেট', 'নিরাপত্তার ফাঁক বন্ধ'], ['উঠে যাওয়ার আগে', 'স্ক্রিন লক করুন'], ['NID-এর ছবি', 'অনলাইনে দেবেন না']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /বন্ধ করব/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'বিড়ালের মজার ছবি')
  await expectRight(page)
  await nextCard(page)
}

for (const os of ['windows', 'mac'] as const) {
  test.describe(`Module 9 cards flow (${os})`, () => {
    test(`${os}: all four units end to end, widgets work, progress saved`, async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await openModule(page, 9)
      await expect(page.getByTestId('units-overview')).toBeVisible()

      // unit 1: passwords (widget card = 2nd card)
      await startUnit(page, 0)
      await nextCard(page, 2) // -> long vs short, -> password widget
      await expect(page.getByTestId('password-strength')).toBeVisible()
      await page.getByTestId('pw-input').fill('blue tea river chair')
      await expect(page.getByTestId('pw-label')).toHaveAttribute('data-level', 'strong')
      await skipToPractice(page)
      await openBrowser(page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      await quiz1(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 2: OTP / PIN / 2FA
      await page.goto('/#/')
      await openModule(page, 9)
      await startUnit(page, 1)
      await skipToPractice(page)
      await openSettings(page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      await quiz2(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 3: phishing (two widget cards)
      await page.goto('/#/')
      await openModule(page, 9)
      await startUnit(page, 2)
      await nextCard(page, 3) // phish, sms, link widget
      await expect(page.getByTestId('phishing-link-check')).toBeVisible()
      await page.getByTestId('link-b').hover()
      await expect(page.getByTestId('status-bar')).toContainText('takapay-verify.example')
      await nextCard(page, 2) // call flow, scam widget
      await expect(page.getByTestId('spot-the-scam')).toBeVisible()
      await page.getByTestId('verdict-scam').click()
      await expect(page.getByTestId('scam-feedback')).toHaveAttribute('data-correct', 'yes')
      await skipToPractice(page)
      await openBrowser(page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      await quiz3(page)
      expect(await slideKind(page)).toBe('celebrate')

      // unit 4: safe habits (lock screen + Wi-Fi)
      await page.goto('/#/')
      await openModule(page, 9)
      await startUnit(page, 3)
      await skipToPractice(page)
      await lockAndNetwork(page, os)
      await nextCard(page)
      await quiz4(page)
      expect(await slideKind(page)).toBe('celebrate')

      expect(problems).toEqual([])
      const saved = await savedProgress(page)
      const done = saved.modules['9'].stepsDone[os].length
      expect(done).toBe(os === 'windows' ? 2 + 1 + 2 + 7 : 1 + 1 + 1 + 7)
    })
  })
}
