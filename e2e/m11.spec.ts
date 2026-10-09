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
  primary,
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'
import lesson from '../src/content/lessons/m11'

/** Module 11 — four units: photos + media, screenshots, USB drive + phone (hardware panel), print + cancel. */

const hw = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()
// the coach shows a short "well done" pause after each step; wait it out between two key combos in a row
const pause = (page: Page) => page.waitForTimeout(1600)

/** press a key combo on the on-screen shortcut pad (real Win/Cmd+Shift combos are swallowed by the browser/OS) */
async function pad(page: Page, mods: string[], key: string) {
  for (const m of mods) await hw(page, `pad-${m}`).click()
  await hw(page, `pad-key-${key}`).click()
}

/** drag a rectangle over the simulated screen (the screenshot overlay) */
async function dragRect(page: Page) {
  const box = (await page.locator('[data-sim-root]').boundingBox())!
  await page.mouse.move(box.x + 200, box.y + 150)
  await page.mouse.down()
  await page.mouse.move(box.x + 320, box.y + 220, { steps: 5 })
  await page.mouse.move(box.x + 420, box.y + 300, { steps: 5 })
  await page.mouse.up()
}

async function unit1Practice(page: Page) {
  await coach(page, 'icon-Flower.png').dblclick()
  await coach(page, 'photos-next').click()
  await coach(page, 'win-photos-close').click()
  await coach(page, 'icon-Song.mp3').dblclick()
  await coach(page, 'media-play').click()
  await coach(page, 'media-mute').click()
  await coach(page, 'win-media-close').click()
}

async function unit2Practice(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await pad(page, ['cmd', 'shift'], 's')
    await coach(page, 'snip-overlay').waitFor()
    await dragRect(page)
    await coach(page, 'snip-notification').click()
    await coach(page, 'snip-save').click()
  } else {
    await pad(page, ['shift', 'cmd'], '3')
    await pause(page)
    await pad(page, ['shift', 'cmd'], '4')
    await coach(page, 'snip-overlay').waitFor()
    await dragRect(page)
    await pause(page)
    await pad(page, ['shift', 'cmd'], '5')
    await coach(page, 'shot-close').click()
  }
}

async function unit3Practice(page: Page, os: 'windows' | 'mac') {
  await hw(page, 'hw-usb-insert').click()
  if (os === 'windows') {
    await coach(page, 'taskbar-app-files').click()
    await coach(page, 'fm-sidebar-USB DRIVE (D:)').click()
    await coach(page, 'fm-item-Project Notes.txt').dragTo(coach(page, 'fm-sidebar-Documents'))
    await coach(page, 'tray-usb').click()
    await coach(page, 'tray-eject').click()
  } else {
    await coach(page, 'dock-files').click()
    await coach(page, 'fm-sidebar-USB DRIVE').click()
    await coach(page, 'fm-item-Project Notes.txt').dragTo(coach(page, 'fm-sidebar-Documents'))
    await coach(page, 'fm-eject-USB DRIVE').click()
  }
  await hw(page, 'hw-usb-pull').click()
  await hw(page, 'hw-phone-connect').click()
  await hw(page, 'hw-phone-allow').click()
  await coach(page, 'fm-sidebar-Phone').click()
}

async function unit4Practice(page: Page, os: 'windows' | 'mac') {
  await coach(page, os === 'windows' ? 'taskbar-app-editor' : 'dock-editor').click()
  await coach(page, 'editor-text').click()
  await page.keyboard.press(os === 'windows' ? 'Control+p' : 'Meta+p')
  await coach(page, 'print-go').click()
  await coach(page, os === 'windows' ? 'tray-printer' : 'dock-printer').click()
  await coach(page, 'pq-cancel-Untitled').click()
}

async function unit1Quiz(page: Page) {
  await matchPairs(page, [['ছবি', 'jpg'], ['গান', 'mp3'], ['ভিডিও', 'mp4']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'ফাইলটি মুছে ফেলা')
  await expectWrong(page)
  await answerChoice(page, 'ফাইলে ডাবল ক্লিক')
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'স্পিকার')
  await expectRight(page)
  await nextCard(page)
}

async function unit2Quiz(page: Page) {
  await answerChoice(page, /Win\+Shift\+S/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'পর্দায় এই মুহূর্তে')
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['শর্টকাট চাপি', 'টেনে অংশ বেছে', 'ফাইল হয়ে যায়', 'ফাইলটি খুঁজে'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function unit3Quiz(page: Page) {
  await orderItems(page, ['কপি শেষ হয়েছে', 'Eject করি', 'কম্পিউটার জানায়', 'পেনড্রাইভ টেনে'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'থেকে যায়, কপি হয়')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'File transfer-এর অনুমতি')
  await expectRight(page)
  await nextCard(page)
}

async function unit4Quiz(page: Page) {
  await answerChoice(page, 'Ctrl + S')
  await expectWrong(page)
  await answerChoice(page, 'Ctrl + P (Mac-এ')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'প্রিন্ট কিউ খুলে Cancel')
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Ctrl/Command + P', 'Print বোতামে', 'কিউ খুলি', 'Cancel চাপি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 11: all four units end to end (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    const problems = watchProblems(page)
    await openModule(page, 11)
    await expect(page.getByTestId('units-overview')).toBeVisible()
    const practice = [unit1Practice, unit2Practice, unit3Practice, unit4Practice] as const
    const quiz = [unit1Quiz, unit2Quiz, unit3Quiz, unit4Quiz] as const
    const ids = lesson.units.map((u) => u.id)

    for (let i = 0; i < 4; i++) {
      if (i === 0) await startUnit(page, 0)
      else {
        await primary(page).click() // from the previous celebration to the next unit
        await expect(page.getByTestId('deck-hook')).toBeVisible()
      }
      if (i === 1) {
        // the widget card renders
        await nextCard(page, 2)
        await expect(page.locator('[data-widget="screenshot-keys"]')).toBeVisible({ timeout: 15_000 })
      }
      await skipToPractice(page)
      await expect(primary(page)).toBeDisabled() // cannot skip the practice
      if (i === 2) await expect(hw(page, 'hw-usb-insert')).toBeVisible() // the hardware panel is there
      await practice[i](page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      expect(await slideKind(page)).toBe('quiz')
      await quiz[i](page)
      expect(await slideKind(page)).toBe('celebrate')
      const saved = await savedProgress(page)
      expect(saved.modules['11'].unitsDone).toEqual(ids.slice(0, i + 1))
    }

    const done = await savedProgress(page)
    expect(done.modules['11'].completed).toBe(true)
    const want = lesson.units.flatMap((u) => u.steps).filter((s) => s.osVariant === os).map((s) => s.id)
    expect(done.modules['11'].stepsDone[os]).toEqual(want)
    expect(problems).toEqual([])
  })
}

test('Module 11 content: four units, three questions each, hardware only where needed', () => {
  expect(lesson.units.map((u) => u.id)).toEqual(['photos-media', 'screenshot', 'usb-phone', 'print'])
  for (const u of lesson.units) expect(u.quiz).toHaveLength(3)
  expect(lesson.units.map((u) => !!u.setup?.hardware)).toEqual([false, false, true, false])
})
