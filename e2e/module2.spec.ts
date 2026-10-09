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

/** Module 2 (the reference lesson in the cards format): two units, each hook → cards → practice → 3 questions → celebration. */

/** Unit 1 practice, Windows + mouse (7 steps). */
async function unit1PracticeWindows(page: Page) {
  await coach(page, 'icon-Welcome.txt').click()
  await coach(page, 'icon-Welcome.txt').dblclick()
  await coach(page, 'win-editor-close').click()
  await coach(page, 'desktop').click({ button: 'right', position: { x: 600, y: 250 } })
  await coach(page, 'ctx-new').click()
  await coach(page, 'ctx-folder').click()
  await page.locator('[data-coach="rename-input"]').fill('Photos')
  await page.keyboard.press('Enter')
}

/** Unit 1 practice, Mac + mouse (6 steps). */
async function unit1PracticeMac(page: Page) {
  await coach(page, 'icon-Welcome.txt').click()
  await coach(page, 'icon-Welcome.txt').dblclick()
  await coach(page, 'win-editor-close').click()
  await coach(page, 'desktop').click({ button: 'right', position: { x: 300, y: 300 } })
  await coach(page, 'ctx-new-folder').click()
  await page.locator('[data-coach="rename-input"]').fill('Photos')
  await page.keyboard.press('Enter')
}

async function unit1Quiz(page: Page, firstTryWrong: boolean) {
  expect(await slideKind(page)).toBe('quiz')
  if (firstTryWrong) {
    await answerClick(page, 'ছবি')
    await expectWrong(page)
  }
  await answerClick(page, 'ফোল্ডার')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ডাবল ক্লিক/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['ফাঁকা জায়গায় রাইট ক্লিক', 'নতুন ফোল্ডার বেছে', 'ফোল্ডারের নাম লিখি', 'Enter'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function unit2Quiz(page: Page) {
  await matchPairs(page, [['একবার ক্লিক', 'বেছে নেওয়া'], ['ডাবল ক্লিক', 'খোলা'], ['রাইট ক্লিক', 'মেনু দেখা'], ['ড্র্যাগ অ্যান্ড ড্রপ', 'ধরে টেনে সরানো']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /স্টার্ট \(Windows\)/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /নিচের বারে নেমে থাকে/)
  await expectRight(page)
  await nextCard(page)
}

test.describe('Module 2 cards flow', () => {
  test('Windows + mouse: both units end to end, progress saved', async ({ page }) => {
    await seedProfile(page, 'windows')
    const problems = watchProblems(page)
    await openModule(page, 2)
    await expect(page.getByTestId('units-overview')).toBeVisible()
    await startUnit(page, 0)
    await expect(page.getByTestId('deck-text')).toContainText('হোম স্ক্রিন')
    await nextCard(page) // desktop + icons (Windows)
    await expect(page.getByTestId('deck-text')).toContainText('ডেস্কটপ')
    await nextCard(page, 3) // click, double click, right click (mouse)
    await expect(page.getByTestId('deck-text')).toContainText('ডান বোতাম')
    await skipToPractice(page)
    await expect(primary(page)).toBeDisabled() // cannot skip the practice
    await unit1PracticeWindows(page)
    await expectPracticeDone(page)
    const mid = await savedProgress(page)
    expect(mid.modules['2'].stepsDone.windows).toEqual(['select', 'open', 'w-close', 'rc-mouse', 'w-new', 'w-folder', 'name'])
    expect(mid.modules['2'].stepsDone.mac).toEqual([])
    await nextCard(page)
    await unit1Quiz(page, true)
    expect(await slideKind(page)).toBe('celebrate')
    await expect(page.getByTestId('deck-celebrate')).toBeVisible()
    const after1 = await savedProgress(page)
    expect(after1.modules['2'].unitsDone).toEqual(['desktop-click'])
    expect(after1.modules['2'].unitQuiz['desktop-click']).toMatchObject({ score: 2, total: 3, wrongByQuestion: { 'q-folder': 1 } })
    expect(after1.modules['2'].completed).toBe(false)
    expect(after1.xp).toBeGreaterThan(0)

    // unit 2
    await primary(page).click()
    await expect(page.getByTestId('deck-resume')).toHaveCount(0)
    await expect(page.getByTestId('deck-hook')).toBeVisible()
    await nextCard(page, 4) // drag, taskbar, start, minimize
    await skipToPractice(page)
    await coach(page, 'icon-Welcome.txt').dragTo(coach(page, 'icon-Practice'))
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-files').click()
    await coach(page, 'win-files-minimize').click()
    await coach(page, 'taskbar-app-files').click()
    await coach(page, 'win-files-close').click()
    await coach(page, 'tray-wifi').click()
    await coach(page, 'desktop').click({ position: { x: 600, y: 200 } })
    await expectPracticeDone(page)
    await nextCard(page)
    await unit2Quiz(page)
    expect(await slideKind(page)).toBe('celebrate')
    const done = await savedProgress(page)
    expect(done.modules['2'].unitsDone).toEqual(['desktop-click', 'taskbar-dock'])
    expect(done.modules['2'].completed).toBe(true)
    expect(done.modules['2'].stepsDone.windows).toHaveLength(15)
    expect(done.badges).toContain('first-lesson')
    await page.getByTestId('real-world-toggle').click()
    await expect(page.getByRole('region', { name: 'এবার আসল কম্পিউটারে' })).toBeVisible()
    expect(problems).toEqual([])
  })

  test('Mac + mouse: both units end to end', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 2)
    await startUnit(page, 0)
    await nextCard(page)
    await expect(page.getByTestId('deck-text')).toContainText('ডেস্কটপ')
    await skipToPractice(page)
    await unit1PracticeMac(page)
    await expectPracticeDone(page)
    await nextCard(page)
    await unit1Quiz(page, false)
    await primary(page).click()
    await expect(page.getByTestId('deck-hook')).toBeVisible()
    await skipToPractice(page)
    await coach(page, 'icon-Welcome.txt').dragTo(coach(page, 'icon-Practice'))
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-files').click()
    await coach(page, 'win-files-minimize').click()
    await coach(page, 'dock-files').click()
    await coach(page, 'win-files-close').click()
    await coach(page, 'control-center').click()
    await coach(page, 'desktop').click({ position: { x: 300, y: 300 } })
    await expectPracticeDone(page)
    await nextCard(page)
    await unit2Quiz(page)
    const done = await savedProgress(page)
    expect(done.modules['2'].completed).toBe(true)
    expect(done.modules['2'].stepsDone.mac).toHaveLength(14)
    expect(done.badges).toContain('perfect-quiz')
  })

  test('touchpad learners see the two-finger cards and steps instead of the mouse ones', async ({ page }) => {
    await seedProfile(page, 'windows', { input: 'touchpad' })
    await openModule(page, 2)
    await startUnit(page, 0)
    await nextCard(page, 4)
    await expect(page.getByTestId('deck-text')).toContainText('দুই আঙুলে')
    await expect(page.getByTestId('deck-text')).not.toContainText('ডান বোতাম')
    await skipToPractice(page)
    await coach(page, 'icon-Welcome.txt').click()
    await coach(page, 'icon-Welcome.txt').dblclick()
    await coach(page, 'win-editor-close').click()
    await expect(page.getByTestId('coach-bubble')).toContainText('দুই আঙুলে একবার ট্যাপ')
    await coach(page, 'desktop').click({ button: 'right', position: { x: 600, y: 250 } })
    await coach(page, 'ctx-new').click()
    await coach(page, 'ctx-folder').click()
    await page.locator('[data-coach="rename-input"]').fill('Photos')
    await page.keyboard.press('Enter')
    await expectPracticeDone(page)
    expect((await savedProgress(page)).modules['2'].stepsDone.windows).toContain('rc-pad')
  })

  test('a wrong action does not advance; hint and demo are one tap away', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 2)
    await startUnit(page, 0)
    await skipToPractice(page)
    const bubble = page.getByTestId('coach-bubble')
    await expect(bubble).toContainText('Welcome.txt')
    await coach(page, 'start-button').click()
    await expect(bubble).toContainText('Welcome.txt')
    await expect(bubble.getByLabel(/ধাপ 1 এর মধ্যে 7/)).toBeVisible()
    await bubble.getByRole('button', { name: /হিন্ট/ }).click()
    await expect(page.getByTestId('coach-hint')).toContainText('একবার চাপুন')
    await expect(bubble.getByRole('button', { name: /দেখিয়ে দিন/ })).toBeVisible()
  })

  test('every card fits without scrolling (desktop and phone)', async ({ page }) => {
    await seedProfile(page, 'windows')
    for (const [w, h] of [[1440, 900], [390, 844]] as const) {
      await page.setViewportSize({ width: w, height: h })
      await openModule(page, 2)
      await startUnit(page, 0)
      for (let i = 0; i < 5; i++) {
        await expectNoScroll(page)
        if (i < 4) await nextCard(page)
      }
      await page.goto('/#/')
    }
  })
})
