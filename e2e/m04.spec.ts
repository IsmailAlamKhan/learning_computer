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
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'

/** Module 4 (cards format): four units — files & folders, copy/delete/restore, extensions, paths. */

type OS = 'windows' | 'mac'

/** Let the sim hand keyboard focus back to itself after a control disappears (a human is never this fast). */
const settle = (page: Page) => page.waitForTimeout(700)

async function renameTo(page: Page, name: string) {
  await page.locator('[data-coach="rename-input"]').fill(name)
  await page.keyboard.press('Enter')
}

// ---------------------------------------------------------------------------------------------
// practice of each unit
// ---------------------------------------------------------------------------------------------

async function unit1Practice(page: Page, os: OS) {
  await coach(page, 'fm-sidebar-Documents').click()
  if (os === 'windows') {
    await coach(page, 'fm-new').click()
    await coach(page, 'ctx-new-folder').click()
    await renameTo(page, 'MyWork')
    await coach(page, 'fm-new').click()
    await coach(page, 'ctx-new-text').click()
    await renameTo(page, 'notes')
    await settle(page)
    await page.keyboard.press('F2')
  } else {
    await coach(page, 'fm-new-folder').click()
    await renameTo(page, 'MyWork')
    await coach(page, 'fm-item-notes.txt').click()
    await settle(page)
    await page.keyboard.press('Enter')
  }
  await renameTo(page, 'ideas')
  await coach(page, 'fm-item-ideas.txt').dragTo(coach(page, 'fm-item-MyWork'))
}

async function unit2Practice(page: Page, os: OS) {
  const win = os === 'windows'
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, 'fm-item-Recipe.txt').click()
  await page.keyboard.press(win ? 'Control+c' : 'Meta+c')
  await coach(page, 'fm-item-MyWork').dblclick()
  await coach(page, 'fm-content').click({ button: 'right' })
  await coach(page, 'ctx-paste').click()
  await coach(page, 'fm-delete').click()
  await coach(page, win ? 'fm-sidebar-Recycle Bin' : 'fm-sidebar-Trash').click()
  await coach(page, 'fm-item-Recipe.txt').click()
  await coach(page, 'fm-restore').click()
  await coach(page, 'win-bin-close').click()
}

async function unit3Practice(page: Page, os: OS) {
  await coach(page, 'fm-sidebar-Downloads').click()
  if (os === 'windows') {
    await coach(page, 'fm-view').click()
    await coach(page, 'ctx-show').click()
  } else {
    await coach(page, 'fm-view-options').click()
  }
  await coach(page, 'ctx-show-ext').click()
}

async function unit4Practice(page: Page, os: OS) {
  await coach(page, 'fm-sidebar-Documents').click()
  await page.getByTestId('coach-bubble').getByRole('button', { name: /বুঝেছি/ }).click()
  await settle(page)
  await coach(page, 'fm-content').click() // keyboard focus back into the simulated window
  if (os === 'windows') {
    await page.keyboard.press('Control+l')
    await page.locator('[data-coach="fm-address-input"]').fill('C:\\Users\\Anika\\Documents')
    await page.keyboard.press('Enter')
  } else {
    await page.keyboard.press('Shift+Meta+g')
    await page.locator('[data-coach="goto-input"]').fill('/Users/anika/Documents')
    await coach(page, 'dialog-go').click()
  }
  await page.locator('[data-coach="fm-search"]').fill('Birthdays')
}

// ---------------------------------------------------------------------------------------------
// quizzes (3 questions per unit); `wrongFirst` makes the first question miss once
// ---------------------------------------------------------------------------------------------

async function unit1Quiz(page: Page, wrongFirst: boolean) {
  expect(await slideKind(page)).toBe('quiz')
  if (wrongFirst) {
    await answerChoice(page, 'আলমারির চাবি')
    await expectWrong(page)
  }
  await answerChoice(page, 'কাগজ রাখার কভার')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ধরে টেনে ফোল্ডারের ওপর ছাড়ব/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['ফাইল বানাই', 'নাম দিয়ে', 'ধরে টেনে ফোল্ডারের ওপর ছাড়ি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function unit2Quiz(page: Page) {
  await answerChoice(page, /আসল ফাইল আগের জায়গাতেই থাকে/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /রিসাইকেল বিন বা ট্র্যাশে/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['ফাইলটি বেছে মুছে', 'রিসাইকেল বিন', 'মোছা ফাইলটি বেছে', 'Restore'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function unit3Quiz(page: Page) {
  await matchPairs(page, [['.txt', 'সাধারণ লেখা'], ['.jpg', 'ছবি'], ['.html', 'ওয়েবপেজ'], ['.py', 'পাইথন প্রোগ্রাম']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আর ঠিকমতো খুলবে না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /^hello\.py$/)
  await expectRight(page)
  await nextCard(page)
}

async function unit4Quiz(page: Page) {
  await answerChoice(page, 'C:\\Users\\Anika\\Documents\\Recipe.txt')
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'Birthdays.txt')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /দুই ডট/)
  await expectRight(page)
  await nextCard(page)
}

/** Runs one unit from its overview card to the celebration. */
async function runUnit(page: Page, os: OS, unit: number, practice: (p: Page, os: OS) => Promise<void>, quiz: () => Promise<void>) {
  await startUnit(page, unit)
  await skipToPractice(page)
  await practice(page, os)
  await expectPracticeDone(page)
  await nextCard(page)
  await quiz()
  expect(await slideKind(page)).toBe('celebrate')
}

const UNIT_IDS = ['files-folders', 'copy-delete', 'extensions', 'paths']
const STEPS = { windows: 30, mac: 26 }

test.describe('Module 4 cards flow', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`all four units end to end, progress saved (${os})`, async ({ page }) => {
      test.setTimeout(240_000)
      const problems = watchProblems(page)
      await seedProfile(page, os)
      await openModule(page, 4)

      await runUnit(page, os, 0, unit1Practice, () => unit1Quiz(page, true))
      const q1 = (await savedProgress(page)).modules['4'].unitQuiz['files-folders']
      expect(q1.total).toBe(3)
      expect(q1.score).toBe(2)
      expect(q1.wrongByQuestion['q-almirah']).toBe(1)

      // the celebration button leads back to the units overview
      await nextCard(page)
      await runUnit(page, os, 1, unit2Practice, () => unit2Quiz(page))
      await nextCard(page)
      await runUnit(page, os, 2, unit3Practice, () => unit3Quiz(page))
      await nextCard(page)
      await runUnit(page, os, 3, unit4Practice, () => unit4Quiz(page))

      const done = await savedProgress(page)
      expect(done.modules['4'].completed).toBe(true)
      expect(done.modules['4'].unitsDone).toEqual(UNIT_IDS)
      expect(done.modules['4'].stepsDone[os]).toHaveLength(STEPS[os])
      expect(problems).toEqual([])
    })
  }

  test('the path-explorer widget card builds the challenge path', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 4)
    await startUnit(page, 3)
    await nextCard(page, 2)
    const w = page.locator('[data-widget="path-explorer"]')
    await expect(w).toBeVisible()
    await w.locator('[data-node="Family"]').click()
    await w.locator('[data-node="Birthdays.txt"]').click()
    await expect(w.getByTestId('abs-text')).toHaveText('C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt')
    await expect(w.getByTestId('challenge')).toContainText('চমৎকার')
    await w.locator('[data-style="mac"]').click()
    await expect(w.getByTestId('abs-text')).toHaveText('/Users/anika/Documents/Family/Birthdays.txt')
  })

  test('Mac learners see the Finder extension card, not the Windows one', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 4)
    await startUnit(page, 2)
    await nextCard(page, 4)
    await expect(page.getByTestId('deck-text')).toContainText('Finder → Settings → Advanced')
  })

  test('every card fits without scrolling (desktop and phone)', async ({ page }) => {
    await seedProfile(page, 'windows')
    const cards = [5, 4, 4, 6] // authored cards per unit shown to a Windows learner (the hook is extra)
    for (const [w, h] of [[1440, 900], [390, 844]] as const) {
      await page.setViewportSize({ width: w, height: h })
      for (let u = 0; u < 4; u++) {
        await openModule(page, 4)
        await startUnit(page, u)
        for (let i = 0; i <= cards[u]; i++) {
          // the widget card scrolls inside its own area
          if (!(u === 3 && i === 2)) await expectNoScroll(page)
          if (i < cards[u]) await nextCard(page)
        }
        await page.goto('/#/')
      }
    }
  })
})
