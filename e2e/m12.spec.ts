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

/** Module 12 (সমস্যায় পড়লে কী করবেন): four units — frozen program, deleted by mistake, no internet / sound, search the error. */

const pad = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()
// the coach's 1.4 s "well done" pause ignores actions meant for steps two ahead — pause between rapid steps
const pause = (page: Page) => page.waitForTimeout(1600)

async function toCelebrate(page: Page, quiz: () => Promise<void>) {
  await expectPracticeDone(page)
  await nextCard(page)
  await quiz()
  expect(await slideKind(page)).toBe('celebrate')
}

async function unit1Practice(page: Page, win: boolean) {
  await coach(page, 'stuckapp-album').click()
  if (win) await expect(page.getByText('Photo Album (Not Responding)').first()).toBeVisible()
  else await expect(coach(page, 'stuckapp-spinner')).toBeVisible()
  await coach(page, 'stuckapp-content').click({ position: { x: 8, y: 8 } })
  await pause(page)
  if (win) {
    await pad(page, 'pad-ctrl').click()
    await pad(page, 'pad-shift').click()
    await pad(page, 'pad-key-esc').click()
    await expect(coach(page, 'taskmgr-row-stuckapp')).toContainText('Not responding')
    await coach(page, 'taskmgr-row-stuckapp').click()
    await coach(page, 'taskmgr-end-task').click()
    await expect(coach(page, 'taskmgr-row-stuckapp')).toHaveCount(0)
    await coach(page, 'win-taskmgr-close').click()
  } else {
    await pad(page, 'pad-alt').click()
    await pad(page, 'pad-cmd').click()
    await pad(page, 'pad-key-esc').click()
    await expect(coach(page, 'forcequit-row-stuckapp')).toContainText('not responding')
    await coach(page, 'forcequit-row-stuckapp').click()
    await coach(page, 'forcequit-button').click()
    await coach(page, 'forcequit-confirm').click()
    await expect(coach(page, 'forcequit-row-stuckapp')).toHaveCount(0)
    await coach(page, 'win-forcequit-close').click()
  }
}

async function unit1Quiz(page: Page) {
  await orderItems(page, ['আধ মিনিট অপেক্ষা', 'অন্য কাজ সেভ', 'প্রোগ্রাম বন্ধ', 'রিস্টার্ট'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আধ মিনিট অপেক্ষা করব/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /সেভ না করা কাজ হারাতে পারে/)
  await expectRight(page)
  await nextCard(page)
}

async function unit2Practice(page: Page, win: boolean) {
  await coach(page, win ? 'icon-Recycle Bin' : 'dock-trash').dblclick()
  await coach(page, 'fm-item-Important.txt').click()
  await coach(page, 'fm-restore').click()
  await coach(page, 'win-bin-close').click()
}

async function unit2Quiz(page: Page) {
  await answerChoice(page, /Ctrl \+ Z \(Windows\)/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'রিসাইকেল বিন / ট্র্যাশ')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আর সহজে ফেরানো যায় না/)
  await expectRight(page)
  await nextCard(page)
}

async function unit3Practice(page: Page, win: boolean) {
  await coach(page, win ? 'taskbar-app-browser' : 'dock-browser').click()
  await coach(page, 'browser-address').fill('search.example')
  await page.waitForTimeout(300) // 'type' events are emitted asynchronously
  await coach(page, 'browser-address').press('Enter')
  await expect(coach(page, 'browser-offline')).toBeVisible()
  await pause(page)
  await coach(page, win ? 'tray-wifi' : 'control-center').click()
  await coach(page, win ? 'qs-wifi' : 'cc-wifi').click()
  await coach(page, 'browser-reload').click()
  await expect(coach(page, 'browser-offline')).toHaveCount(0)
  await pause(page)
  await coach(page, win ? 'tray-volume' : 'menubar-volume').click()
  await page.waitForTimeout(500)
  if (win) await coach(page, 'qs-mute').click()
  else await coach(page, 'cc-volume').fill('60')
}

async function unit3Quiz(page: Page) {
  await matchPairs(page, [
    ['প্রোগ্রাম আটকে গেছে', 'Task Manager / Force Quit'],
    ['ইন্টারনেট নেই', 'Wi-Fi চালু আছে কি না'],
    ['আওয়াজ আসছে না', 'মিউট বা ভলিউম'],
    ['ফাইল মুছে গেছে', 'রিসাইকেল বিন / ট্র্যাশ'],
  ])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Wi-Fi চালু আছে কি না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /মিউট করা আছে কি না/)
  await expectRight(page)
  await nextCard(page)
}

async function unit4Practice(page: Page) {
  await coach(page, 'browser-address').fill('Photo Album PA-1042 damaged')
  await page.waitForTimeout(300)
  await coach(page, 'browser-address').press('Enter')
  await pause(page)
  await coach(page, 'search-result-4').click()
  await pause(page)
  await coach(page, 'm12-forum-accepted').click()
}

async function unit4Quiz(page: Page) {
  await answerChoice(page, /হুবহু কপি করে সার্চ করব/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'প্রোগ্রামটির নিজস্ব সাহায্যের পাতা')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আমি কী করছিলাম/)
  await answerChoice(page, /কী আশা করেছিলাম/)
  await answerChoice(page, /এরর হুবহু, বা স্ক্রিনশট/)
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function walk(page: Page, win: boolean) {
  await openModule(page, 12)
  await expect(page.getByTestId('units-overview')).toBeVisible()

  await startUnit(page, 0)
  await skipToPractice(page)
  await expect(page.getByTestId('shortcut-pad')).toBeVisible()
  await expect(primary(page)).toBeDisabled()
  await unit1Practice(page, win)
  await toCelebrate(page, () => unit1Quiz(page))

  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await skipToPractice(page)
  await unit2Practice(page, win)
  await toCelebrate(page, () => unit2Quiz(page))

  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await skipToPractice(page)
  await unit3Practice(page, win)
  await toCelebrate(page, () => unit3Quiz(page))

  await primary(page).click()
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await nextCard(page, 2)
  // the widget card: copy → paste → search → pick the trustworthy result
  const w = page.getByTestId('error-copy-search')
  await expect(w).toBeVisible()
  await w.getByRole('button', { name: /পুরো মেসেজটি বেছে দিন/ }).click()
  await page.keyboard.press('ControlOrMeta+C')
  await w.getByTestId('ecs-input').fill('Photo Album could not open "holiday.album". Error code PA-1042: the file is damaged or in a newer format.')
  await w.getByTestId('ecs-search').click()
  await w.getByTestId('ecs-result-old').click()
  await expect(w.getByTestId('ecs-why')).toContainText('কখনো চালাবেন না')
  await w.getByTestId('ecs-result-official').click()
  await expect(w).toContainText('দারুণ')
  await skipToPractice(page)
  await unit4Practice(page)
  await toCelebrate(page, () => unit4Quiz(page))
}

test.describe('Module 12 cards flow', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`${os}: all four units end to end, progress saved`, async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await walk(page, os === 'windows')
      const done = await savedProgress(page)
      expect(done.modules['12'].unitsDone).toEqual(['frozen', 'deleted', 'net-sound', 'search-error'])
      expect(done.modules['12'].completed).toBe(true)
      expect(done.modules['12'].stepsDone[os]).toHaveLength(os === 'windows' ? 21 : 22)
      expect(problems).toEqual([])
    })
  }

  test('Mac: Force Quit is also in the system menu', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 12)
    await startUnit(page, 0)
    await skipToPractice(page)
    await coach(page, 'menu-system').click()
    await coach(page, 'menu-item-force-quit').click()
    await expect(coach(page, 'forcequit-content')).toBeVisible()
  })

  test('troubleshoot-flow widget: pick a symptom, get the next thing to try', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 12)
    await startUnit(page, 3)
    await nextCard(page, 5)
    const flow = page.getByTestId('troubleshoot-flow')
    await flow.getByRole('button', { name: 'ইন্টারনেট নেই' }).click()
    await flow.getByRole('button', { name: /হ্যাঁ, বন্ধ/ }).click()
    await expect(flow.getByTestId('flow-answer')).toContainText('Wi-Fi চালু করুন')
  })

  test('every card fits without scrolling (desktop and phone)', async ({ page }) => {
    await seedProfile(page, 'windows')
    for (const [w, h] of [[1440, 900], [390, 844]] as const) {
      await page.setViewportSize({ width: w, height: h })
      for (const unit of [0, 1, 2]) {
        await openModule(page, 12)
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
