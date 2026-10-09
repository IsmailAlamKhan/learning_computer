import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  expectNoScroll,
  expectPracticeDone,
  expectRight,
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

/** Module 6 (programs and apps): four units, each hook → cards → practice → 3 questions → celebration. */

// ----- practice, unit by unit -----

async function u1(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
  } else {
    await coach(page, 'menubar-search').click()
    await coach(page, 'spotlight-input').fill('TextEdit')
    await coach(page, 'spotlight-result-0').click()
  }
  await coach(page, 'editor-text').fill('Hello, this is my first file.')
}

async function u2(page: Page, os: 'windows' | 'mac') {
  await coach(page, 'editor-text').fill('Hello, this is my first file.')
  if (os === 'windows') {
    await coach(page, 'editor-menu-file').click()
    await coach(page, 'editor-save').click()
  } else {
    await coach(page, 'editor-save').click()
  }
  await coach(page, 'save-dialog-name').fill('hello.txt')
  await coach(page, 'save-dialog-save').click()
  await coach(page, 'win-editor-close').click()
  await coach(page, os === 'windows' ? 'taskbar-app-files' : 'dock-files').click()
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, 'fm-item-hello.txt').dblclick()
}

async function u3(page: Page, os: 'windows' | 'mac') {
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, 'fm-item-hello.txt').dblclick()
  await coach(page, 'editor-text').fill('Hello, this is my first file.\nA second line.')
  await coach(page, 'win-editor-close').click()
  await coach(page, 'dialog-cancel').click()
  if (os === 'windows') await coach(page, 'editor-menu-file').click()
  await coach(page, 'editor-save').click() // Save in place: no name asked
  if (os === 'windows') await coach(page, 'editor-menu-file').click()
  await coach(page, 'editor-save-as').click()
  await coach(page, 'save-dialog-name').fill('hello-copy.txt')
  await coach(page, 'save-dialog-save').click()
  await coach(page, 'win-editor-close').click()
  await expect(coach(page, 'fm-item-hello.txt')).toBeVisible()
  await expect(coach(page, 'fm-item-hello-copy.txt')).toBeVisible()
}

async function u4(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-search').fill('installer')
    await coach(page, 'start-app-installer').click()
  } else {
    await coach(page, 'menubar-search').click()
    await coach(page, 'spotlight-input').fill('installer')
    await coach(page, 'spotlight-result-0').click()
  }
  await coach(page, 'installer-download').click()
  await coach(page, 'installer-next').click()
  await coach(page, 'installer-install').click()
  await coach(page, 'installer-finish').click()
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-search').fill('calculator')
    await coach(page, 'start-app-calcplus').click()
  } else {
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-calcplus').click()
  }
  await coach(page, 'win-calcplus-close').click()
  if (os === 'windows') {
    await coach(page, 'taskbar-app-settings').click()
    await coach(page, 'settings-nav-apps').click()
    await coach(page, 'settings-app-menu-Calculator Plus').click()
    await coach(page, 'settings-app-uninstall-Calculator Plus').click()
    await coach(page, 'settings-uninstall-confirm').click()
  } else {
    await coach(page, 'dock-files').click()
    await coach(page, 'fm-sidebar-Applications').click()
    await coach(page, 'fm-item-Calculator Plus.app').dragTo(coach(page, 'dock-trash'))
  }
}

// ----- quizzes -----

async function quiz1(page: Page) {
  await answerClick(page, 'Calculator')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /স্টার্ট বা স্পটলাইটে/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['অ্যাপ', 'কাজের হাতিয়ার'], ['ফাইল', 'অ্যাপে বানানো জিনিস'], ['ওয়েবসাইট', 'ইন্টারনেটে থাকে']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}
async function quiz2(page: Page) {
  await orderItems(page, ['লেখাটি লিখি', 'Save বেছে নিই', 'ফাইলের নাম লিখি', 'ডায়ালগের Save-এ চাপি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ফাইলের নাম আর কোথায়/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Documents-এ গিয়ে/)
  await expectRight(page)
  await nextCard(page)
}
async function quiz3(page: Page) {
  await answerChoice(page, /Save As — নতুন নামে/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['Save', 'একই ফাইল বদলায়'], ['Save As', 'নতুন নামে আরেকটি ফাইল'], ['Don’t save', 'নতুন লেখা ফেলে দেয়'], ['Cancel', 'বন্ধ না করে ফিরে যাওয়া']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'note.txt')
  await expectRight(page)
  await nextCard(page)
}
async function quiz4(page: Page) {
  await answerChoice(page, /প্রস্তুতকারকের সাইট/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Download', 'সেটআপে Next চাপি', 'Install চাপি', 'Finish চাপি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Settings → Apps/)
  await expectRight(page)
  await nextCard(page)
}

const UNITS = [
  { id: 'open-write', practice: u1, quiz: quiz1, steps: { windows: 3, mac: 4 } },
  { id: 'save-first', practice: u2, quiz: quiz2, steps: { windows: 9, mac: 8 } },
  { id: 'save-vs-saveas', practice: u3, quiz: quiz3, steps: { windows: 12, mac: 10 } },
  { id: 'install', practice: u4, quiz: quiz4, steps: { windows: 16, mac: 13 } },
] as const

async function runModule(page: Page, os: 'windows' | 'mac') {
  const problems = watchProblems(page)
  await seedProfile(page, os)
  await openModule(page, 6)
  await expect(page.getByTestId('units-overview')).toBeVisible()
  let total = 0
  for (let i = 0; i < UNITS.length; i++) {
    const u = UNITS[i]
    if (i === 0) await startUnit(page, 0)
    else {
      await primary(page).click() // celebration → next unit
      await expect(page.getByTestId('deck-hook')).toBeVisible()
    }
    await expectNoScroll(page)
    await skipToPractice(page)
    await expect(primary(page)).toBeDisabled() // cannot skip the practice
    await u.practice(page, os)
    await expectPracticeDone(page)
    total += u.steps[os]
    const p = await savedProgress(page)
    expect(p.modules['6'].stepsDone[os]).toHaveLength(total)
    await nextCard(page)
    expect(await slideKind(page)).toBe('quiz')
    await u.quiz(page)
    expect(await slideKind(page)).toBe('celebrate')
  }
  const done = await savedProgress(page)
  expect(done.modules['6'].unitsDone).toEqual(UNITS.map((u) => u.id))
  expect(done.modules['6'].completed).toBe(true)
  await page.getByTestId('real-world-toggle').click()
  await expect(page.getByRole('region', { name: /এবার আসল কম্পিউটারে/ })).toBeVisible()
  expect(problems).toEqual([])
}

test.describe('Module 6 cards flow', () => {
  test('Windows: all four units end to end', async ({ page }) => {
    await runModule(page, 'windows')
  })

  test('Mac: all four units end to end', async ({ page }) => {
    await runModule(page, 'mac')
  })

  test('cards fit without scrolling and the two widgets render', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 6)
    await startUnit(page, 1)
    for (let i = 0; i < 4; i++) {
      await expectNoScroll(page)
      await nextCard(page)
    }
    await expect(page.getByTestId('save-vs-saveas')).toBeVisible() // card 5 of unit 2
    await page.goto('/#/')
    await openModule(page, 6)
    await startUnit(page, 2, 'restart')
    await nextCard(page, 4)
    await expect(page.getByTestId('plain-vs-rich')).toBeVisible() // card 4 of unit 3
  })
})
