import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  expectPracticeDone,
  expectRight,
  expectWrong,
  matchPairs,
  nextCard,
  openModule,
  orderItems,
  predict,
  primary,
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'

/** Module 14: three units (input-output, ram-storage, bits-bytes), each hook → cards → practice → 3 questions → celebration. */

async function props(page: Page, file: string) {
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, `fm-item-${file}`).click({ button: 'right' })
  await coach(page, 'ctx-properties').click()
  await expect(coach(page, 'properties')).toContainText(/MB|KB|GB/)
  await coach(page, 'dialog-ok').click()
}

async function unit1(page: Page) {
  await startUnit(page, 0)
  await nextCard(page, 2) // flow, kitchen widget
  await page.getByTestId('kitchen-ram').click()
  await expect(page.getByTestId('kitchen-detail')).toContainText('কাউন্টার')
  await nextCard(page) // input-process-output widget
  await page.getByTestId('io-scenario-atm').click()
  await expect(page.getByTestId('io-stage-storage')).toHaveAttribute('data-used', 'yes')
  await skipToPractice(page)
  await expect(primary(page)).toBeDisabled()
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, 'fm-item-Photo.jpg').click()
  await expectPracticeDone(page)
  await nextCard(page)
  await matchPairs(page, [['ইনপুট', 'উপকরণ'], ['প্রসেসর \\(CPU\\)', 'রাঁধুনি'], ['মেমোরি \\(RAM\\)', 'কাউন্টার'], ['স্টোরেজ', 'ফ্রিজ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['ইনপুট: আমি', 'প্রসেসর (CPU) কাজ', 'মেমোরি (RAM)-এ', 'আউটপুট: পর্দায়'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'কিবোর্ড')
  await expectWrong(page)
  await answerChoice(page, 'Windows বা macOS')
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit2(page: Page, os: 'windows' | 'mac') {
  await primary(page).click() // from celebration to the next unit
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 4)
  await skipToPractice(page)
  await props(page, 'Photo.jpg')
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
  } else {
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-editor').click()
  }
  await coach(page, 'editor-text').fill('remember to buy rice')
  await coach(page, 'win-editor-close').click()
  await coach(page, 'dialog-dont-save').click()
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
  } else {
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-editor').click()
  }
  await expect(coach(page, 'editor-text')).toHaveValue('') // the unsaved text is gone
  await expectPracticeDone(page)
  await nextCard(page)
}

async function unit2Quiz(page: Page) {
  await answerClick(page, 'কিবোর্ড')
  await expectWrong(page)
  await answerClick(page, 'SSD')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /শুধু RAM-এ ছিল/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'মাঝে মাঝে সেভ করব')
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit3(page: Page) {
  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 2) // bit/byte, toggle-bits widget
  await page.getByTestId('bit-1').click()
  await page.getByTestId('bit-7').click()
  await expect(page.getByTestId('bits-value')).toHaveText('65')
  await expect(page.getByTestId('bits-char')).toHaveText('A')
  await page.getByTestId('challenge-10').click()
  await page.getByTestId('bit-4').click()
  await page.getByTestId('bit-6').click()
  await expect(page.getByTestId('challenge-feedback')).toContainText('চমৎকার')
  await nextCard(page, 4) // unicode, units, client/server, app vs website
  await skipToPractice(page)
  await props(page, 'Movie.mp4')
  await expectPracticeDone(page)
  await nextCard(page)
}

async function unit3Quiz(page: Page, digits: string) {
  await predict(page, digits)
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['বাইট (Byte)', 'কেবি (KB)', 'এমবি (MB)', 'জিবি (GB)'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'দূরের সার্ভার')
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

for (const [os, digits] of [['windows', '5'], ['mac', '৫']] as const) {
  test(`Module 14 ${os}: all three units end to end`, async ({ page }) => {
    await seedProfile(page, os)
    const problems = watchProblems(page)
    await openModule(page, 14)
    await unit1(page)
    await unit2(page, os)
    await unit2Quiz(page)
    await unit3(page)
    await unit3Quiz(page, digits)
    const done = await savedProgress(page)
    expect(done.modules['14'].unitsDone).toEqual(['input-output', 'ram-storage', 'bits-bytes'])
    expect(done.modules['14'].completed).toBe(true)
    expect(done.modules['14'].stepsDone[os]).toHaveLength(2 + 11 + 4)
    expect(problems).toEqual([])
  })
}
