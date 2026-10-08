import { expect, test, type Page } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

const input = (page: Page) => page.locator('[data-sim-root] [data-coach="terminal-input"]')
const output = (page: Page) => page.locator('[data-sim-root] [data-coach="terminal-output"]')

async function run(page: Page, cmd: string) {
  await input(page).focus()
  await input(page).fill(cmd)
  await input(page).press('Enter')
}

for (const os of ['windows', 'mac'] as const) {
  const win = os === 'windows'
  test(`Module 17 guided practice completes (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 17)
    await expect(input(page)).toBeVisible()

    await run(page, 'pwd')
    await run(page, win ? 'dir' : 'ls')
    await run(page, 'cd Documents')
    await run(page, 'pwd')
    await expect(output(page)).toContainText(win ? 'C:\\Users\\Anika\\Documents' : '/Users/anika/Documents')
    await run(page, 'cd ..')
    await run(page, 'mkdir coding')
    // Tab-completion
    await input(page).focus()
    await input(page).pressSequentially('cd cod')
    await input(page).press('Tab')
    await expect(input(page)).toHaveValue(win ? 'cd coding\\' : 'cd coding/')
    await input(page).press('Enter')
    await run(page, win ? 'ni notes.txt' : 'touch notes.txt')
    await run(page, 'echo "hello" > notes.txt')
    await run(page, win ? 'type notes.txt' : 'cat notes.txt')
    await expect(output(page)).toContainText('hello')
    // history step (continue)
    await input(page).press('ArrowUp')
    await expect(input(page)).toHaveValue(win ? 'type notes.txt' : 'cat notes.txt')
    await input(page).press('Control+c')
    await cont(page)
    await run(page, win ? 'cls' : 'clear')
    await run(page, win ? 'del notes.txt' : 'rm notes.txt')
    await expect(output(page)).toContainText('এই অনুশীলন-টার্মিনালে এই কমান্ডটি')
    await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
    await cont(page)
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
    const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['17'].stepsDone[o].length, os)
    expect(saved).toBe(15)
  })

  test(`Module 17 quiz and prompt widget (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    await page.goto('/#/module/17')
    const w = page.getByTestId('prompt-anatomy')
    await expect(w).toBeVisible()
    await w.locator('[data-folder="coding"]').click()
    await expect(w.getByTestId('prompt-line')).toContainText('coding')

    await page.getByRole('button', { name: /কুইজ/ }).first().click()
    // q1 click the folder part of the prompt (wrong first)
    const quizGroup = page.getByRole('group', { name: /এই প্রম্পটে এখন কোন ফোল্ডারে/ })
    await quizGroup.getByRole('button', { name: win ? /^PS$/ : /anika@Mac/ }).click()
    await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
    await quizGroup.getByRole('button', { name: win ? /C:\\Users\\Anika\\Documents/ : /^Documents$/ }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q2 ordering
    const want = ['হোম ফোল্ডারে আছি কি না', 'mkdir coding লিখে', 'cd coding লিখে', 'ফাইল বানানোর কমান্ড']
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
    // q3 drag-match (tap, then tap)
    const pairs = win
      ? [['mkdir coding', 'নতুন ফোল্ডার বানানো'], ['ni notes.txt', 'নতুন খালি ফাইল বানানো'], ['type notes.txt', 'ফাইলের লেখা দেখা'], ['cls', 'পর্দা পরিষ্কার করা']]
      : [['mkdir coding', 'নতুন ফোল্ডার বানানো'], ['touch notes.txt', 'নতুন খালি ফাইল বানানো'], ['cat notes.txt', 'ফাইলের লেখা দেখা'], ['clear', 'পর্দা পরিষ্কার করা']]
    for (const [chip, slot] of pairs) {
      await page.getByRole('button', { name: chip, exact: true }).click()
      await page.getByRole('button', { name: new RegExp(`^${slot} — এখানে বসান`) }).click()
    }
    await page.getByRole('button', { name: 'যাচাই করুন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q4 predict output
    await page.getByLabel(/আপনার মনে হয় কী ছাপা হবে/).fill(win ? 'C:\\Users\\Anika\\Documents' : '/Users/anika/Documents')
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
    // q5 safety
    await page.getByLabel(/চালাব না/).check()
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
    const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['17'].quiz)
    expect(q.total).toBe(5)
    expect(q.score).toBe(4)
  })
}
