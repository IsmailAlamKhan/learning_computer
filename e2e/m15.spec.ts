import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  continueStep,
  expectNoScroll,
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

/** Module 15 (প্রোগ্রামিং কী ও কেন): three units, 10 guided steps in total (1 + 2 + 7), the same on Windows and Mac. */

async function unit1(page: Page) {
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page) // robot widget
  // robot: vague fails, precise works
  await page.getByTestId('add-VAGUE').click()
  await page.getByTestId('robot-run').click()
  await expect(page.getByTestId('robot-result')).toHaveAttribute('data-outcome', 'confused', { timeout: 5000 })
  await page.getByTestId('robot-clear').click()
  for (let i = 0; i < 3; i++) await page.getByTestId('add-F').click()
  await page.getByTestId('robot-run').click()
  await expect(page.getByTestId('robot-result')).toHaveAttribute('data-outcome', 'reached', { timeout: 8000 })
  await nextCard(page)
  await expect(page.getByTestId('deck-text')).toContainText('ঝাল')
  await expectNoScroll(page)
  await nextCard(page, 3)
  await skipToPractice(page)
  await expect(primary(page)).toBeDisabled()
  await expect(coach(page, 'code-explorer-hello.py')).toBeVisible()
  await continueStep(page) // look-files
  await expectPracticeDone(page)
  await nextCard(page)
  // quiz: ordering, multiple choice, click target
  await orderItems(page, ['কেটলিতে পানি', 'চা-পাতা দিন', 'দুই মিনিট', 'ছেঁকে', 'চিনি-দুধ'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আন্দাজ করে/)
  await expectWrong(page)
  await answerChoice(page, /বোঝে না/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'দুই মুঠো মুড়ি')
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit2(page: Page) {
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 4) // html, css, js, python
  await expect(page.getByTestId('deck-text')).toContainText('Python')
  await nextCard(page)
  // language cards
  await page.getByTestId('lang-toggle-python').click()
  await expect(page.getByTestId('lang-code-python')).toContainText('print(')
  await nextCard(page)
  // path chooser
  for (const id of ['pc-make-tool', 'pc-curious-data', 'pc-style-read', 'pc-goal-career']) await page.getByTestId(id).click()
  await expect(page.getByTestId('pc-result')).toHaveAttribute('data-second', 'python')
  await expect(page.getByTestId('roadmap')).toContainText('HTML ও CSS')
  await skipToPractice(page)
  await coach(page, 'code-explorer-hello.js').click()
  await continueStep(page) // read-js
  await expectPracticeDone(page)
  await nextCard(page)
  await matchPairs(page, [['HTML', 'পেজের কাঠামো'], ['CSS', 'রং আর সাজ'], ['JavaScript', 'বোতাম চাপলে কিছু ঘটা'], ['Python', 'হিসাব আর ডেটার কাজ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'print')
  await expectRight(page)
  await nextCard(page)
  await predict(page, '5')
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit3(page: Page) {
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 5) // editor, 3 myth compares, honest encouragement
  await expect(page.getByTestId('deck-text')).toContainText('সময় লাগে')
  await skipToPractice(page)
  await coach(page, 'code-explorer-hello.py').click()
  await continueStep(page) // read-py
  await coach(page, 'code-run').click() // Python's first run takes 1-2 s
  await expect(coach(page, 'code-output')).toContainText('স্বাগতম! আমি প্রোগ্রামিং শিখছি', { timeout: 60_000 })
  await continueStep(page) // see-output
  await coach(page, 'code-explorer-hello.html').click()
  await continueStep(page) // see-html
  await continueStep(page) // finish
  await expectPracticeDone(page)
  await nextCard(page)
  await answerChoice(page, /যোগ-বিয়োগ, যুক্তি/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ভুলের বার্তা/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /রোজ ৩০ মিনিট/)
  await expectRight(page)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 15 cards flow completes on ${os}`, async ({ page }) => {
    await seedProfile(page, os)
    const problems = watchProblems(page)
    await openModule(page, 15)
    await startUnit(page, 0)
    await unit1(page)
    await primary(page).click() // on to unit 2
    await unit2(page)
    await primary(page).click() // on to unit 3
    await unit3(page)
    const done = await savedProgress(page)
    expect(done.modules['15'].unitsDone).toEqual(['instructions', 'languages', 'first-run'])
    expect(done.modules['15'].completed).toBe(true)
    expect(done.modules['15'].stepsDone[os]).toHaveLength(10)
    // the sandboxed preview iframe cannot read localStorage (seedProfile's init script runs there too) — not an app error
    expect(problems.filter((p) => !/sandboxed|localStorage/.test(p))).toEqual([])
  })
}
