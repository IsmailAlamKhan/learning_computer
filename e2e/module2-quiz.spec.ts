import { expect, test } from '@playwright/test'
import { seedProfile } from './helpers'

for (const os of ['windows', 'mac'] as const) {
  test(`Module 2 quiz scores and completes (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    await page.goto('/#/module/2')
    await page.getByRole('button', { name: /কুইজ/ }).first().click()
    // q1 click the right thing — first a wrong pick, then right
    await page.getByRole('button', { name: /ছবি/ }).click()
    await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
    await page.getByRole('button', { name: /ফোল্ডার/ }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q2 multiple choice
    await page.getByLabel(/ডাবল ক্লিক \(পরপর/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q3 drag-match using tap-then-tap
    for (const [chip, slot] of [['বেছে নেওয়া', 'একবার ক্লিক'], ['খোলা', 'ডাবল ক্লিক'], ['অপশনের মেনু দেখা', 'রাইট ক্লিক'], ['ধরে টেনে সরানো', 'ড্র্যাগ অ্যান্ড ড্রপ']]) {
      await page.getByRole('button', { name: chip, exact: true }).click()
      await page.getByRole('button', { name: new RegExp(`^${slot} — এখানে বসান`) }).click()
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q4 OS-specific
    await page.getByLabel(os === 'windows' ? /টাস্কবারে/ : /ডক \(Dock\)/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q5 ordering
    const want = ['ফাঁকা জায়গায় রাইট ক্লিক', 'নতুন ফোল্ডার (New Folder) বেছে', 'ফোল্ডারের নাম লিখি', 'Enter চাপি']
    for (let i = 0; i < want.length; i++) {
      for (let guard = 0; guard < 6; guard++) {
        const items = await page.locator('ol > li').allInnerTexts()
        const cur = items.findIndex((t) => t.includes(want[i]))
        if (cur <= i) break
        await page.locator('ol > li').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
      }
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
    await expect(page.getByText(/আপনি 5টির মধ্যে 4টি প্রথমবারেই/)).toBeVisible()
    const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['2'].quiz)
    expect(q.total).toBe(5)
    expect(q.score).toBe(4)
  })
}
