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

/** Module 7 (internet & browser): four units in the cards format. */

async function typeAddress(page: Page, text: string) {
  const a = page.locator('[data-sim-root] [data-coach="browser-address"]').first()
  await a.click()
  await a.fill(text)
  await page.keyboard.press('Enter')
}

async function unit1Practice(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
  } else await coach(page, 'dock-browser').click()
}

async function unit2Practice(page: Page) {
  await typeAddress(page, 'dal recipe')
  await coach(page, 'search-result-1').click()
  await coach(page, 'browser-back').click()
  await coach(page, 'browser-forward').click()
  await coach(page, 'browser-new-tab').click()
  await typeAddress(page, 'khobor.example')
  await coach(page, 'browser-tab-1').click()
  await coach(page, 'browser-bookmark').click()
}

async function unit3Practice(page: Page) {
  await typeAddress(page, 'free-prize-claim.example')
  await coach(page, 'scam-popup-close').click()
  await coach(page, 'scam-urgent').click()
  await coach(page, 'scam-otp').click()
  await coach(page, 'browser-back').click()
}

async function unit4Practice(page: Page, os: 'windows' | 'mac') {
  await typeAddress(page, 'download.official-editor.example')
  await coach(page, 'download-official').click()
  await expect(page.locator('[data-sim-root] [data-coach="browser-download-show"]').first()).toBeVisible({ timeout: 10_000 })
  if (os === 'windows') {
    await coach(page, 'taskbar-app-files').click()
    await coach(page, 'fm-sidebar-Downloads').click()
    await coach(page, 'fm-item-OfficialEditor-setup.exe').click()
  } else {
    await coach(page, 'dock-files').click()
    await coach(page, 'fm-sidebar-Downloads').click()
    await coach(page, 'fm-item-OfficialEditor.dmg').click()
  }
}

async function quiz1(page: Page, firstTryWrong: boolean) {
  expect(await slideKind(page)).toBe('quiz')
  if (firstTryWrong) {
    await answerChoice(page, /ফোন নষ্ট/)
    await expectWrong(page)
  }
  await answerChoice(page, /রাউটারের নিজের ইন্টারনেট লাইন নেই/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'Chrome')
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['ইন্টারনেট', 'রাস্তার জাল'], ['ওয়েবসাইট', 'দোকান'], ['ব্রাউজার', 'রিকশা'], ['রাউটার', 'বাড়ির প্রবেশপথ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function quiz2(page: Page) {
  await answerClick(page, 'www.example.com')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /^ডাল রেসিপি$/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['অ্যাড্রেস বার', 'ঠিকানা লেখা বা খোঁজা'], ['পিছনের তীর', 'আগের পাতায় ফেরা'], ['ট্যাব', 'আলাদা ঘরে পাতা খোলা'], ['তারা চিহ্ন', 'পাতা বুকমার্ক করা']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function quiz3(page: Page) {
  await answerClick(page, 'paypocket-secure1ogin')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /তালা থাকলেও|তবু সাইটটি ঠকবাজ/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /কিছু না লিখে পাতাটি বন্ধ করব/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz4(page: Page) {
  await orderItems(page, ['প্রোগ্রামটির আসল সাইটে', 'আসল ডাউনলোড বোতামে', 'নামার লাইন ভরা', 'Downloads ফোল্ডারে ফাইলটি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আসল বোতাম খুঁজব/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Downloads ফোল্ডারে$/)
  await expectRight(page)
  await nextCard(page)
}

async function runUnit(page: Page, unit: number, practice: () => Promise<void>, quiz: () => Promise<void>) {
  if (unit === 0) await startUnit(page, 0)
  else {
    await primary(page).click() // celebration -> next unit
    await expect(page.getByTestId('deck-hook')).toBeVisible()
  }
  expect(await slideKind(page)).toBe('hook')
  await expectNoScroll(page)
  await skipToPractice(page)
  await practice()
  await expectPracticeDone(page)
  await nextCard(page)
  await quiz()
  expect(await slideKind(page)).toBe('celebrate')
}

for (const os of ['windows', 'mac'] as const) {
  test.describe(`Module 7 cards flow (${os})`, () => {
    test('all four units end to end', async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await openModule(page, 7)
      await runUnit(page, 0, () => unit1Practice(page, os), () => quiz1(page, true))
      await runUnit(page, 1, () => unit2Practice(page), () => quiz2(page))
      await runUnit(page, 2, () => unit3Practice(page), () => quiz3(page))
      await runUnit(page, 3, () => unit4Practice(page, os), () => quiz4(page))
      const saved = await savedProgress(page)
      const m = saved.modules['7']
      expect(m.stepsDone[os].length).toBe(os === 'windows' ? 2 + 8 + 5 + 5 : 1 + 8 + 5 + 5)
      expect(Object.keys(m.unitQuiz ?? {})).toHaveLength(4)
      expect(problems).toEqual([])
    })
  })
}

test.describe('Module 7 details', () => {
  test('cards need no scrolling and the widgets render', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 7)
    await startUnit(page, 0)
    await nextCard(page, 2) // flow, widget card
    await expect(page.getByTestId('wifi-vs-mobile')).toBeVisible()
    await page.goto('/#/')
    await openModule(page, 7)
    await startUnit(page, 1, 'restart')
    await nextCard(page, 3) // address, domain, url-anatomy widget card
    await expect(page.getByTestId('url-anatomy')).toBeVisible()
  })

  test('the ad button is a trap and downloads nothing', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 7)
    await startUnit(page, 3)
    await skipToPractice(page)
    await typeAddress(page, 'download.official-editor.example')
    await coach(page, 'download-ad-trap').click()
    await expect(page.getByText(/Fast Editor PRO/).first()).toBeVisible()
    await coach(page, 'fakesite-download').click()
    await expect(page.getByText(/বিজ্ঞাপনের পাতা/)).toBeVisible()
    await expect(page.locator('[data-sim-root] [data-coach="browser-download-progress"]')).toHaveCount(0)
  })
})
