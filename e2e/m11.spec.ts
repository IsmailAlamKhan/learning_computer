import { expect, test, type Page } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'
import lesson from '../src/content/lessons/m11'

const UNLOCK = { settings: { numerals: 'western', unlockAll: true } }
const hw = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()

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

async function photosAndMedia(page: Page) {
  await coach(page, 'icon-Flower.png').dblclick()
  await coach(page, 'photos-next').click()
  await coach(page, 'win-photos-close').click()
  await coach(page, 'icon-Song.mp3').dblclick()
  await coach(page, 'media-play').click()
  await coach(page, 'media-mute').click()
  await coach(page, 'win-media-close').click()
}

async function printFlow(page: Page, os: 'windows' | 'mac') {
  await coach(page, os === 'windows' ? 'taskbar-app-editor' : 'dock-editor').click()
  await coach(page, 'editor-text').click()
  await page.keyboard.press(os === 'windows' ? 'Control+p' : 'Meta+p')
  await coach(page, 'print-go').click()
  await coach(page, os === 'windows' ? 'tray-printer' : 'dock-printer').click()
  await coach(page, 'pq-cancel-Untitled').click()
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 11 guided practice (${os})`, async ({ page }) => {
    await seedProfile(page, os, UNLOCK)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 11)
    await photosAndMedia(page)

    if (os === 'windows') {
      await pad(page, ['cmd', 'shift'], 's')
      await coach(page, 'snip-overlay').waitFor()
      await dragRect(page)
      await coach(page, 'snip-notification').click()
      await coach(page, 'snip-save').click()
      await hw(page, 'hw-usb-insert').click()
      await coach(page, 'taskbar-app-files').click()
      await coach(page, 'fm-sidebar-USB DRIVE (D:)').click()
      await coach(page, 'fm-item-Project Notes.txt').dragTo(coach(page, 'fm-sidebar-Documents'))
      await coach(page, 'tray-usb').click()
      await coach(page, 'tray-eject').click()
      await hw(page, 'hw-usb-pull').click()
    } else {
      await pad(page, ['shift', 'cmd'], '3')
      await pad(page, ['shift', 'cmd'], '4')
      await coach(page, 'snip-overlay').waitFor()
      await dragRect(page)
      await pad(page, ['shift', 'cmd'], '5')
      await coach(page, 'shot-close').click()
      await hw(page, 'hw-usb-insert').click()
      await coach(page, 'dock-files').click()
      await coach(page, 'fm-sidebar-USB DRIVE').click()
      await coach(page, 'fm-item-Project Notes.txt').dragTo(coach(page, 'fm-sidebar-Documents'))
      await coach(page, 'fm-eject-USB DRIVE').click()
      await hw(page, 'hw-usb-pull').click()
    }
    await hw(page, 'hw-phone-connect').click()
    await hw(page, 'hw-phone-allow').click()
    await coach(page, 'fm-sidebar-Phone').click()
    await printFlow(page, os)

    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['11'].stepsDone[o].length, os)
    expect(saved).toBe(lesson.steps.filter((s) => s.osVariant === os).length)
  })

  test(`Module 11 quiz (${os})`, async ({ page }) => {
    await seedProfile(page, os, UNLOCK)
    await page.goto('/#/module/11')
    await expect(page.locator('[data-widget="screenshot-keys"]')).toBeVisible()
    await page.getByRole('button', { name: /কুইজ/ }).first().click()
    // q1 screenshot shortcut (wrong first)
    await page.getByRole('button', { name: os === 'windows' ? /Ctrl \+ P/ : /Command \+ P/ }).click()
    await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
    await page.getByRole('button', { name: os === 'windows' ? /Win \+ Shift \+ S/ : /Shift \+ Command \+ 4/ }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q2 safe-eject ordering
    const want = ['ফাইল কপি করা শেষ', 'Eject করি', 'কম্পিউটার জানায়', 'পেনড্রাইভ টেনে বের']
    for (let i = 0; i < want.length; i++) {
      for (let guard = 0; guard < 6; guard++) {
        const items = await page.locator('ol > li').allInnerTexts()
        const cur = items.findIndex((t) => t.includes(want[i]))
        if (cur <= i) break
        await page.locator('ol > li').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
      }
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q3 drag-match (tap then tap)
    for (const [chip, slot] of [['.jpg', 'ছবি'], ['.mp3', 'গান'], ['.mp4', 'ভিডিও'], ['.png', 'স্ক্রিনশট']]) {
      await page.getByRole('button', { name: chip, exact: true }).click()
      await page.getByRole('button', { name: new RegExp(`^${slot} — এখানে বসান`) }).click()
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q4 print cancel, q5 phone permission
    await page.getByLabel(/প্রিন্ট কিউ খুলে/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    await page.getByLabel(/ফোনের পর্দায় ফাইল আদান-প্রদানের অনুমতি/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
    const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['11'].quiz)
    expect(q.total).toBe(5)
    expect(q.score).toBe(4)
  })
}
