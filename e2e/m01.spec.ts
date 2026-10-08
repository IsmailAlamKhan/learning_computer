import { expect, test } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'

test.describe('Module 1 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 1)
    await coach(page, 'desktop').click({ button: 'right', position: { x: 900, y: 80 } })
    await coach(page, 'desktop').click({ position: { x: 700, y: 70 } })
    await coach(page, 'icon-Welcome.txt').dblclick()
    await coach(page, 'win-editor-close').click()
    // sleep
    await coach(page, 'start-button').click()
    await coach(page, 'start-power').click()
    await coach(page, 'power-sleep').click()
    await coach(page, 'wake-button').click()
    // restart
    await coach(page, 'start-button').click()
    await coach(page, 'start-power').click()
    await coach(page, 'power-restart').click()
    await expect(coach(page, 'power-restarting')).toBeVisible()
    await expect(coach(page, 'power-restarting')).toHaveCount(0, { timeout: 8_000 })
    // shut down + turn on
    await coach(page, 'start-button').click()
    await coach(page, 'start-power').click()
    await coach(page, 'power-shut-down').click()
    await coach(page, 'power-on-button').click()
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['1'].stepsDone.windows.length)
    expect(saved).toBe(15)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 1)
    await coach(page, 'desktop').click({ button: 'right', position: { x: 900, y: 80 } })
    await coach(page, 'desktop').click({ position: { x: 700, y: 70 } })
    await coach(page, 'icon-Welcome.txt').dblclick()
    await coach(page, 'win-editor-close').click()
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
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['1'].stepsDone.mac.length)
    expect(saved).toBe(12)
  })

  test('explanation widgets work', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/module/1')
    const parts = page.locator('[data-widget="computer-parts"]')
    await expect(parts).toBeVisible()
    await expect(page.getByTestId('parts-progress')).toContainText('0/13')
    await parts.locator('[data-part="keyboard"]').click()
    await expect(page.getByTestId('parts-detail')).toContainText('Keyboard')
    await parts.locator('[data-part="usb-port"]').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('parts-detail')).toContainText('USB')
    await expect(page.getByTestId('parts-progress')).toContainText('2/13')
    await page.getByTestId('parts-start-quiz').click()
    await expect(page.getByTestId('parts-quiz')).toContainText('কিবোর্ড')
    for (const id of ['keyboard', 'mouse', 'power-button', 'charger']) await parts.locator(`[data-part="${id}"]`).click()
    await expect(page.getByTestId('parts-quiz-done')).toBeVisible()

    const tp = page.locator('[data-widget="touchpad-practice"]')
    const done = (g: string) => tp.locator(`[data-gesture="${g}"]`)
    await page.getByTestId('tp-tap-box').dblclick()
    await expect(done('tap')).toHaveAttribute('data-done', 'yes')
    await expect(done('doubleTap')).toHaveAttribute('data-done', 'yes')
    await page.getByTestId('tp-right-box').click({ button: 'right' })
    await expect(done('rightTap')).toHaveAttribute('data-done', 'yes')
    await page.getByTestId('tp-scroll-list').hover()
    await page.mouse.wheel(0, 300)
    await expect(done('scroll')).toHaveAttribute('data-done', 'yes')
    await page.getByTestId('tp-zoom-in').click()
    await page.getByTestId('tp-zoom-in').click()
    await expect(done('zoom')).toHaveAttribute('data-done', 'yes')
    await page.getByTestId('tp-drag-token').dragTo(page.getByTestId('tp-drag-box'))
    await expect(done('drag')).toHaveAttribute('data-done', 'yes')
    await expect(page.getByTestId('tp-all-done')).toBeVisible()
  })
})

for (const os of ['windows', 'mac'] as const) {
  test(`Module 1 quiz completes (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    await page.goto('/#/module/1')
    await page.getByRole('button', { name: /কুইজ/ }).first().click()
    // q1 click the right thing: wrong first, then right
    await page.getByRole('button', { name: /মাউস/ }).click()
    await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
    await page.getByRole('button', { name: /কিবোর্ড/ }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q2 ordering (safe shutdown)
    const want = ['কাজ সেভ', 'খোলা প্রোগ্রামগুলো', 'স্টার্ট বা সিস্টেম মেনু', 'Shut down বেছে', 'পর্দা পুরো কালো']
    for (let i = 0; i < want.length; i++) {
      for (let guard = 0; guard < 8; guard++) {
        const items = await page.locator('ol > li').allInnerTexts()
        const cur = items.findIndex((t) => t.includes(want[i]))
        if (cur <= i) break
        await page.locator('ol > li').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
      }
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q3 why not pull the plug
    await page.getByLabel(/সেভ না করা কাজ হারিয়ে/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q4 gesture matching
    for (const [chip, slot] of [['ক্লিক', 'এক আঙুলে একবার ট্যাপ'], ['রাইট ক্লিক (মেনু)', 'দুই আঙুলে একবার ট্যাপ'], ['স্ক্রল (পাতা সরানো)', 'দুই আঙুলে ওপর-নিচ টানা'], ['জুম ইন (বড় করা)', 'দুই আঙুল ফাঁক করা']]) {
      await page.getByRole('button', { name: chip, exact: true }).click()
      await page.getByRole('button', { name: new RegExp(`^${slot} — এখানে বসান`) }).click()
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q5 sleep
    await page.getByLabel(/Sleep \(স্লিপ\)/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
    const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['1'].quiz)
    expect(q.total).toBe(5)
    expect(q.score).toBe(4)
  })
}
