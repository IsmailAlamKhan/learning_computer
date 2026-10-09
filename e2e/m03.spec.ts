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

/** Module 3 (Window): three units — buttons, move/resize, switching windows. */

async function dragBy(page: Page, id: string, dx: number, dy: number) {
  await coach(page, id).scrollIntoViewIfNeeded()
  const box = (await coach(page, id).boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 4 })
  await page.mouse.move(x + dx, y + dy, { steps: 4 })
  await page.mouse.up()
}

const pad = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()
const titlebar = 'win-files-titlebar'

async function unit1Practice(page: Page, win: boolean) {
  await coach(page, titlebar).click({ position: { x: 150, y: 8 } })
  await coach(page, 'win-files-maximize').click()
  await coach(page, 'win-files-maximize').click()
  await coach(page, 'win-files-minimize').click()
  await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
  await coach(page, win ? 'taskbar-app-editor' : 'dock-editor').click()
  await page.locator('[data-coach="editor-text"]').fill('hello')
  await coach(page, 'win-editor-close').click()
  await coach(page, 'dialog-dont-save').click()
  await coach(page, 'win-files-close').click()
}

async function unit1Quiz(page: Page) {
  expect(await slideKind(page)).toBe('quiz')
  await answerClick(page, 'নামানো (')
  await expectWrong(page)
  await answerClick(page, 'বন্ধ (')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /নিচে নেমে থাকে/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /খোলাই থাকে/)
  await expectRight(page)
  await nextCard(page)
}

async function unit2Practice(page: Page) {
  await coach(page, titlebar).click({ position: { x: 150, y: 8 } })
  await dragBy(page, titlebar, 30, -10)
  await dragBy(page, 'win-files-resize-se', -40, -30)
  await coach(page, titlebar).dblclick({ position: { x: 250, y: 8 } })
  await coach(page, titlebar).dblclick({ position: { x: 250, y: 8 } })
}

async function unit2Quiz(page: Page) {
  await matchPairs(page, [['টাইটেল বার ধরে টানা', 'উইন্ডো সরে যায়'], ['কোণা ধরে টানা', 'মাপ বদলায়'], ['নামিয়ে রাখা', 'প্রোগ্রাম চালু থাকে'], ['বন্ধ করা', 'উইন্ডো বন্ধ হয়']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['টাইটেল বারে তীর', 'চেপে ধরি', 'টেনে নিয়ে', 'ছেড়ে দিই'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /কোণা বা কিনারা/)
  await expectRight(page)
  await nextCard(page)
}

async function unit3Practice(page: Page, win: boolean) {
  // the shortcut pad must be open by default because the practice has keyCombo steps
  await expect(page.getByTestId('shortcut-pad')).toBeVisible()
  const mod = win ? 'pad-alt' : 'pad-cmd'
  await pad(page, mod).click()
  await pad(page, 'pad-key-tab').click()
  await pad(page, mod).click()
  await pad(page, 'pad-key-tab').click()
  await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
}

async function unit3Quiz(page: Page) {
  await answerChoice(page, /Alt \+ Tab \(Windows\)/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'টাস্কবার বা ডকের আইকন')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /সক্রিয় উইন্ডোতে/)
  await expectRight(page)
  await nextCard(page)
}

async function walk(page: Page, win: boolean) {
  await openModule(page, 3)
  await expect(page.getByTestId('units-overview')).toBeVisible()

  // unit 1
  await startUnit(page, 0)
  await expect(page.getByTestId('deck-text')).toContainText('জানালা')
  await nextCard(page, 2) // window, buttons compare
  await expect(page.getByTestId('deck-text')).toContainText('বন্ধ করার')
  await skipToPractice(page)
  await expect(primary(page)).toBeDisabled()
  await unit1Practice(page, win)
  await expectPracticeDone(page)
  await nextCard(page)
  await unit1Quiz(page)
  expect(await slideKind(page)).toBe('celebrate')

  // unit 2
  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await skipToPractice(page)
  await unit2Practice(page)
  await expectPracticeDone(page)
  await nextCard(page)
  await unit2Quiz(page)
  expect(await slideKind(page)).toBe('celebrate')

  // unit 3
  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await skipToPractice(page)
  await unit3Practice(page, win)
  await expectPracticeDone(page)
  await nextCard(page)
  await unit3Quiz(page)
  expect(await slideKind(page)).toBe('celebrate')
}

test.describe('Module 3 cards flow', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`${os} + mouse: all three units end to end, progress saved`, async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await walk(page, os === 'windows')
      const done = await savedProgress(page)
      expect(done.modules['3'].unitsDone).toEqual(['open-close', 'move-resize', 'switch-windows'])
      expect(done.modules['3'].completed).toBe(true)
      expect(done.modules['3'].stepsDone[os]).toHaveLength(18)
      expect(problems).toEqual([])
    })
  }

  test('touchpad learners see the touchpad drag card, mouse learners the mouse one', async ({ page }) => {
    await seedProfile(page, 'windows', { input: 'touchpad' })
    await openModule(page, 3)
    await startUnit(page, 1)
    await nextCard(page, 2)
    await expect(page.getByTestId('deck-text')).toContainText('টাচপ্যাডে')
    await expect(page.getByTestId('deck-text')).not.toContainText('বাঁ বোতাম চেপে')
  })

  test('mac learners see the Cmd+Tab card and the shortcut pad', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 3)
    await startUnit(page, 2)
    await nextCard(page, 2)
    await expect(page.getByTestId('deck-text')).toContainText('Cmd + Tab')
    await skipToPractice(page)
    await expect(page.getByTestId('shortcut-pad')).toBeVisible()
    await expect(page.getByTestId('coach-bubble')).toContainText('Command')
  })

  test('every card fits without scrolling (desktop and phone)', async ({ page }) => {
    await seedProfile(page, 'windows')
    for (const [w, h] of [[1440, 900], [390, 844]] as const) {
      await page.setViewportSize({ width: w, height: h })
      for (const unit of [0, 1, 2]) {
        await openModule(page, 3)
        await startUnit(page, unit, 'restart')
        for (let i = 0; i < 4; i++) {
          await expectNoScroll(page)
          await nextCard(page)
        }
        await page.goto('/#/')
      }
    }
  })
})
