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

/** Module 10 (Settings): four units, each hook → cards → practice → 3 questions → celebration. Windows 32 steps, Mac 26 steps. */

const pause = (page: Page) => page.waitForTimeout(400)

// ---------------- unit 1: look ----------------
async function look(page: Page, mac: boolean) {
  const bg = page.locator('[data-sim-root] [data-wallpaper]').first()
  if (mac) {
    await coach(page, 'settings-nav-personalization').click()
    await coach(page, 'settings-wallpaper-2').click()
    await expect(bg).toHaveAttribute('data-wallpaper', '2')
    await coach(page, 'settings-nav-appearance').click()
    await coach(page, 'settings-darkMode').click()
    await expect(coach(page, 'win-settings-content')).toHaveAttribute('data-dark', 'true')
    await coach(page, 'settings-darkMode').click()
    await expect(coach(page, 'win-settings-content')).not.toHaveAttribute('data-dark', 'true')
  } else {
    await coach(page, 'settings-nav-personalization').click()
    await coach(page, 'settings-link-background').click()
    await coach(page, 'settings-wallpaper-2').click()
    await coach(page, 'settings-nav-personalization').click()
    await coach(page, 'settings-link-colors').click()
    await coach(page, 'settings-mode').selectOption('Dark')
    await expect(coach(page, 'win-settings-content')).toHaveAttribute('data-dark', 'true')
    await coach(page, 'settings-mode').selectOption('Light')
  }
  await coach(page, 'settings-nav-display').click()
  await coach(page, 'settings-zoom').selectOption('150')
  await expect(coach(page, 'win-settings-content')).toHaveAttribute('data-zoom', '150')
  await coach(page, 'settings-zoom').selectOption('100')
  await expect(coach(page, 'win-settings-content')).not.toHaveAttribute('data-zoom', /.+/)
}

async function lookQuiz(page: Page) {
  await matchPairs(page, [['Wallpaper', 'পেছনের ছবি বদলায়'], ['Dark mode', 'সাদা জায়গা কালচে হয়'], ['Scale', 'সবকিছু বড় বা ছোট হয়']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /কিছুই হয় না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ওয়ালপেপার বদলাব/) // wrong first
  await expectWrong(page)
  await answerChoice(page, /Scale বা Display size/)
  await expectRight(page)
  await nextCard(page)
}

// ---------------- unit 2: sound & brightness ----------------
async function sound(page: Page, mac: boolean) {
  await coach(page, 'settings-nav-sound').click()
  await coach(page, 'settings-volume').fill('90')
  if (mac) {
    await coach(page, 'control-center').click()
    await coach(page, 'cc-volume').fill('0')
    await pause(page)
    await coach(page, 'cc-volume').fill('50')
  } else {
    await coach(page, 'tray-wifi').click()
    await coach(page, 'qs-mute').click()
    await expect(coach(page, 'qs-mute')).toHaveAttribute('aria-checked', 'true')
    await coach(page, 'qs-mute').click()
  }
}

async function soundQuiz(page: Page) {
  await answerClick(page, 'স্পিকার') // wrong first
  await expectWrong(page)
  await answerClick(page, 'সূর্য')
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /মিউট চালু আছে/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['Brightness', 'পর্দার আলো'], ['Volume', 'শব্দের জোর'], ['Mute', 'শব্দ একদম বন্ধ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

// ---------------- unit 3: Wi-Fi & Bluetooth ----------------
async function wifiBluetooth(page: Page, mac: boolean) {
  await coach(page, 'settings-nav-network').click()
  await coach(page, 'settings-network-PracticeNet').click()
  if (!mac) await coach(page, 'settings-wifi-connect').click()
  await expect(coach(page, 'settings-wifi-practice')).toContainText('practice123')
  await coach(page, 'settings-wifi-password').fill('wrong')
  await coach(page, mac ? 'settings-wifi-join' : 'settings-wifi-next').click()
  await expect(coach(page, 'settings-wifi-error')).toBeVisible() // wrong password: gentle error, step does not advance
  await coach(page, 'settings-wifi-password').fill('practice123')
  await coach(page, mac ? 'settings-wifi-join' : 'settings-wifi-next').click()
  await expect(coach(page, 'settings-network-PracticeNet')).toContainText('Connected')
  await coach(page, 'settings-nav-bluetooth').click()
  await coach(page, 'settings-bluetoothOn').click()
  if (mac) {
    await coach(page, 'settings-bt-connect-Practice Speaker').click()
  } else {
    await coach(page, 'settings-bt-add').click()
    await coach(page, 'settings-bt-kind').click()
    await coach(page, 'settings-bt-device-Practice Speaker').click()
    await coach(page, 'settings-bt-done').click()
  }
}

async function wifiQuiz(page: Page) {
  await answerClick(page, 'স্পিকারের ছবি') // wrong first
  await expectWrong(page)
  await answerClick(page, 'তরঙ্গের ছবি')
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Settings খুলি', 'ওয়াই-ফাইয়ের বিভাগে', 'নেটওয়ার্কের নাম', 'পাসওয়ার্ড লিখে', '“Connected”'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ধীরে আবার লিখব/)
  await expectRight(page)
  await nextCard(page)
}

// ---------------- unit 4: time, printer, language ----------------
async function timePrinter(page: Page, mac: boolean) {
  await coach(page, 'settings-nav-time').click()
  await expect(coach(page, 'settings-timezone')).toHaveValue('America/New_York') // the lesson starts in New York on purpose
  await coach(page, 'settings-timezone').selectOption('Asia/Dhaka')
  if (mac) {
    await coach(page, 'settings-nav-printers').click()
    await coach(page, 'settings-printer-add').click()
    await coach(page, 'settings-printer-pick-Practice Inkjet').click()
    await coach(page, 'settings-printer-confirm').click()
  } else {
    await coach(page, 'settings-nav-bluetooth').click()
    await coach(page, 'settings-link-printers').click()
    await coach(page, 'settings-printer-add').click()
    await coach(page, 'settings-printer-found-Practice Inkjet').click()
  }
}

async function timeQuiz(page: Page) {
  await matchPairs(page, [['Time zone', 'কোন অঞ্চলের সময় দেখাবে'], ['Bluetooth', 'তার ছাড়া স্পিকার জোড়া'], ['Printer', 'কাগজে ছাপা'], ['Language', 'মেনু কোন ভাষায় দেখাবে']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /New York/) // wrong first
  await expectWrong(page)
  await answerChoice(page, /Dhaka \(UTC\+6\)/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /প্রিন্টার চালু আর একই ওয়াই-ফাইয়ে/)
  await expectRight(page)
  await nextCard(page)
}

const UNITS = [
  { id: 'look', cards: { windows: 5, mac: 5 }, practice: look, quiz: lookQuiz, steps: { windows: 10, mac: 8 } },
  { id: 'sound-light', cards: { windows: 4, mac: 4 }, practice: sound, quiz: soundQuiz, steps: { windows: 5, mac: 5 } },
  { id: 'wifi-bluetooth', cards: { windows: 4, mac: 4 }, practice: wifiBluetooth, quiz: wifiQuiz, steps: { windows: 11, mac: 7 } },
  { id: 'time-printer', cards: { windows: 5, mac: 5 }, practice: timePrinter, quiz: timeQuiz, steps: { windows: 6, mac: 6 } },
] as const

test.describe('Module 10 cards flow', () => {
  for (const os of ['windows', 'mac'] as const) {
    test(`${os}: all four units end to end, progress saved`, async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await openModule(page, 10)
      await expect(page.getByTestId('units-overview')).toBeVisible()
      for (let i = 0; i < UNITS.length; i++) {
        const u = UNITS[i]
        if (i === 0) await startUnit(page, 0)
        else {
          await primary(page).click() // from the previous celebration to the next unit
          await expect(page.getByTestId('deck-hook')).toBeVisible()
        }
        // every card must fit without scrolling (the widget card scrolls inside itself)
        for (let c = 0; c < u.cards[os]; c++) {
          await nextCard(page)
          if (u.id !== 'look' || c !== 1) await expectNoScroll(page)
        }
        await skipToPractice(page)
        await expect(primary(page)).toBeDisabled() // practice cannot be skipped
        await u.practice(page, os === 'mac')
        await expectPracticeDone(page)
        await nextCard(page)
        expect(await slideKind(page)).toBe('quiz')
        await u.quiz(page)
        expect(await slideKind(page)).toBe('celebrate')
      }
      const done = await savedProgress(page)
      expect(done.modules['10'].unitsDone).toEqual(UNITS.map((u) => u.id))
      expect(done.modules['10'].completed).toBe(true)
      expect(done.modules['10'].stepsDone[os]).toHaveLength(UNITS.reduce((n, u) => n + u.steps[os], 0)) // 32 / 26
      expect(done.modules['10'].stepsDone[os === 'mac' ? 'windows' : 'mac']).toEqual([])
      for (const u of UNITS) expect(done.modules['10'].unitQuiz[u.id].total).toBe(3)
      await page.getByTestId('real-world-toggle').click()
      await expect(page.getByRole('region', { name: 'এবার আসল কম্পিউটারে' })).toBeVisible()
      expect(problems).toEqual([])
    })
  }

  test('the settings-map widget card works and shows both systems', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 10)
    await startUnit(page, 0)
    await nextCard(page, 2) // compare card, then the widget card
    await page.locator('[data-setting="printer"]').click()
    await expect(page.getByTestId('settings-map-result')).toContainText('Printers & Scanners')
    await expect(page.getByTestId('settings-map-result').locator('[data-os="mac"]')).toContainText('আপনার')
    await expect(page.getByTestId('settings-map-result').locator('[data-os="windows"]')).toContainText('Printers & scanners')
  })

  test('unit 4 starts the clock in New York and the Wi-Fi password is shown on screen (Windows)', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 10)
    await startUnit(page, 3)
    await skipToPractice(page)
    await expect(page.getByTestId('coach-bubble')).toContainText('Time & language')
    await coach(page, 'settings-nav-time').click()
    await expect(coach(page, 'settings-timezone')).toHaveValue('America/New_York')
  })

  test('a wrong action does not advance the practice; hint is one tap away', async ({ page }) => {
    await seedProfile(page, 'mac')
    await openModule(page, 10)
    await startUnit(page, 1)
    await skipToPractice(page)
    const bubble = page.getByTestId('coach-bubble')
    await expect(bubble).toContainText('Sound')
    await coach(page, 'settings-nav-network').click()
    await expect(bubble).toContainText('Sound')
    await bubble.getByRole('button', { name: /হিন্ট/ }).click()
    await expect(page.getByTestId('coach-hint')).toContainText('Displays')
  })
})
