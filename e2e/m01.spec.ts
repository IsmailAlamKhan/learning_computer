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

/** Module 1: three units — parts (wifi step), mouse/touchpad, power (sleep / restart / shut down). */

async function unit1Practice(page: Page, os: 'windows' | 'mac') {
  await coach(page, os === 'windows' ? 'tray-wifi' : 'control-center').click()
  await coach(page, 'desktop').click({ position: { x: 300, y: 300 } })
}

async function unit1Quiz(page: Page) {
  await answerClick(page, 'কিবোর্ড')
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['পর্দা', 'ছবি দেখায়'], ['ব্যাটারি', 'বিদ্যুৎ জমায়'], ['সিপিইউ', 'ভেবে হিসাব করে'], ['ওয়াই-ফাই', 'তার ছাড়া ইন্টারনেট']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /হাতে ছোঁয়া যায়/)
  await expectRight(page)
  await nextCard(page)
}

async function unit2Practice(page: Page, os: 'windows' | 'mac', input: 'mouse' | 'touchpad') {
  await coach(page, 'desktop').click({ button: 'right', position: { x: 300, y: 300 } }) // right click (mouse button or two-finger tap)
  await coach(page, 'desktop').click({ position: { x: 600, y: 200 } })
  await coach(page, 'icon-Welcome.txt').dblclick()
  await coach(page, 'win-editor-close').click()
  void os
  void input
}

async function unit2Quiz(page: Page) {
  await answerChoice(page, /ডাবল ক্লিক/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['ক্লিক', 'বেছে নেওয়া'], ['ডাবল ক্লিক', 'খোলা'], ['রাইট ক্লিক', 'মেনু আনা'], ['স্ক্রল', 'পাতা সরানো']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /কাজের একটি ছোট মেনু/)
  await expectRight(page)
  await nextCard(page)
}

async function unit3Practice(page: Page, os: 'windows' | 'mac') {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-power').click()
    await coach(page, 'power-sleep').click()
    await coach(page, 'wake-button').click()
    await coach(page, 'start-button').click()
    await coach(page, 'start-power').click()
    await coach(page, 'power-restart').click()
    await expect(coach(page, 'power-restarting')).toBeVisible()
    await expect(coach(page, 'power-restarting')).toHaveCount(0, { timeout: 8_000 })
    await coach(page, 'start-button').click()
    await coach(page, 'start-power').click()
    await coach(page, 'power-shut-down').click()
    await coach(page, 'power-on-button').click()
  } else {
    await coach(page, 'menu-system').click()
    await coach(page, 'menu-item-sleep').click()
    await coach(page, 'wake-button').click()
    await coach(page, 'menu-system').click()
    await coach(page, 'menu-item-restart').click()
    await expect(coach(page, 'power-restarting')).toBeVisible()
    await expect(coach(page, 'power-restarting')).toHaveCount(0, { timeout: 8_000 })
    await coach(page, 'menu-system').click()
    await coach(page, 'menu-item-shutdown').click()
    await coach(page, 'power-on-button').click()
  }
}

async function unit3Quiz(page: Page) {
  await orderItems(page, ['কাজ সেভ', 'খোলা প্রোগ্রামগুলো', 'স্টার্ট বা সিস্টেম মেনু', 'Shut down বেছে', 'পর্দা পুরো কালো'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /সেভ না করা কাজ হারাতে/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Sleep/)
  await expectRight(page)
  await nextCard(page)
}

for (const os of ['windows', 'mac'] as const) {
  for (const input of ['mouse', 'touchpad'] as const) {
    test(`Module 1, ${os} + ${input}: all three units end to end`, async ({ page }) => {
      await seedProfile(page, os, { input })
      const problems = watchProblems(page)
      await openModule(page, 1)
      await expect(page.getByTestId('units-overview')).toBeVisible()

      // ---- unit 1: parts (the widget is a quick win in the first cards)
      await startUnit(page, 0)
      await expect(page.getByTestId('deck-text')).toContainText('সহকারী')
      await nextCard(page)
      await expect(page.getByTestId('parts-progress')).toBeVisible() // computer-parts widget
      await nextCard(page, 5) // hardware, in-out, laptop/desktop, battery/charger, wifi
      await skipToPractice(page)
      await expect(primary(page)).toBeDisabled()
      await unit1Practice(page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      await unit1Quiz(page)
      expect(await slideKind(page)).toBe('celebrate')

      // ---- unit 2: mouse / touchpad
      await primary(page).click()
      await expect(page.getByTestId('deck-hook')).toBeVisible()
      await nextCard(page) // double click
      await nextCard(page) // right click (device specific)
      if (input === 'touchpad') {
        await expect(page.getByTestId('deck-text')).toContainText('দুই আঙুলে')
        await nextCard(page, 2) // scroll, widget
        await expect(page.getByTestId('tp-checklist')).toBeVisible() // touchpad-practice widget, touchpad users only
      } else {
        await expect(page.getByTestId('deck-text')).toContainText('ডান বোতাম')
        await nextCard(page) // wheel scroll + the mouse recap
        await expect(page.getByTestId('deck-text')).toContainText('চাকা')
        await expect(page.getByTestId('tp-checklist')).toHaveCount(0)
      }
      await skipToPractice(page)
      await unit2Practice(page, os, input)
      await expectPracticeDone(page)
      await nextCard(page)
      await unit2Quiz(page)

      // ---- unit 3: power
      await primary(page).click()
      await expect(page.getByTestId('deck-hook')).toBeVisible()
      await nextCard(page, 5) // menu, sleep/restart, shut down, order, never unplug
      await expect(page.getByTestId('deck-text')).toContainText('কাজ হারাতে')
      await skipToPractice(page)
      await unit3Practice(page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      await unit3Quiz(page)
      expect(await slideKind(page)).toBe('celebrate')

      const done = await savedProgress(page)
      expect(done.modules['1'].unitsDone).toEqual(['parts', 'mouse-touchpad', 'power'])
      expect(done.modules['1'].completed).toBe(true)
      expect(done.modules['1'].stepsDone[os]).toHaveLength(os === 'windows' ? 2 + 4 + 11 : 2 + 4 + 8)
      await page.getByTestId('real-world-toggle').click()
      await expect(page.getByRole('region', { name: 'এবার আসল কম্পিউটারে' })).toBeVisible()
      expect(problems).toEqual([])
    })
  }
}

test('Module 1 cards fit without scrolling (first unit, mouse)', async ({ page }) => {
  await seedProfile(page, 'windows')
  await openModule(page, 1)
  await startUnit(page, 0)
  for (let i = 0; i < 7; i++) {
    if ((await slideKind(page)) === 'practice') break
    await expectNoScroll(page)
    await nextCard(page)
  }
})
