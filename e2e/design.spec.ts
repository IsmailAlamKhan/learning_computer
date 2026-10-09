import { expect, test, type Page } from '@playwright/test'
import { mockPlatform } from './platform'

const KEY = 'computer-shikhi:v1'
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY)

const seed = (page: Page, extra: Record<string, unknown> = {}) =>
  page.addInitScript(
    ([k, ex]) => {
      if (localStorage.getItem(k as string)) return
      localStorage.setItem(k as string, JSON.stringify({ version: 1, profile: { name: 'রুমা', os: 'windows', input: 'mouse', autoDetected: true, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { dailyGoal: 2 }, modules: {}, ...(ex as object) }))
    },
    [KEY, extra] as const,
  )

const noHScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)

test.describe('onboarding auto-detection', () => {
  test('Windows PC: confirms the OS, never asks about touchpad or mouse', async ({ page }) => {
    await mockPlatform(page, 'Windows')
    await page.goto('/#/welcome')
    await page.getByLabel(/আপনার নাম কী/).fill('রুমা')
    await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    await expect(page.getByTestId('detected-os')).toContainText('Windows')
    await expect(page.getByRole('radio')).toHaveCount(0)
    for (let i = 0; i < 3; i++) {
      await expect(page.locator('body')).not.toContainText(/টাচপ্যাড|মাউস/)
      if (i < 2) await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    }
    await page.getByRole('button', { name: 'ওয়েবসাইট বানাতে' }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
    await expect(page).toHaveURL(/#\/$/)
    const d = await stored(page)
    expect(d.profile).toMatchObject({ os: 'windows', input: 'mouse', autoDetected: true, onboarded: true, motivation: 'ওয়েবসাইট বানাতে' })
  })

  test('unknown OS (Linux): asks with two big cards', async ({ page }) => {
    await mockPlatform(page, 'Linux')
    await page.goto('/#/welcome')
    await page.getByLabel(/আপনার নাম কী/).fill('মালা')
    await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    await expect(page.getByRole('radio')).toHaveCount(2)
    await page.getByRole('radio', { name: 'Mac' }).check()
    for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
    expect((await stored(page)).profile.os).toBe('mac')
  })

  test('wheel events from a touchpad switch the pointing device automatically; manual choice sticks', async ({ page }) => {
    await seed(page)
    await page.goto('/#/')
    await expect(page.getByTestId('continue-card')).toBeVisible()
    await page.evaluate(() => {
      for (let i = 0; i < 12; i++) window.dispatchEvent(new WheelEvent('wheel', { deltaY: 2.5 + i * 1.3, deltaX: 0.7, deltaMode: 0 }))
    })
    await expect.poll(async () => (await stored(page)).profile.input).toBe('touchpad')
    await page.goto('/#/settings')
    await page.getByRole('radio', { name: /মাউস/ }).check()
    await page.evaluate(() => {
      for (let i = 0; i < 12; i++) window.dispatchEvent(new WheelEvent('wheel', { deltaY: 2.5 + i * 1.3, deltaX: 0.7 }))
    })
    expect((await stored(page)).profile.input).toBe('mouse')
  })
})

for (const [w, h] of [[390, 844], [1440, 900]] as const) {
  test(`home path renders and the continue card works at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h })
    const done = { completed: true, stepsDone: { windows: [], mac: [] }, unitsDone: [], unitQuiz: {}, realWorldChecked: [], explanationRead: true, freePracticeDone: true }
    await seed(page, { modules: { 1: done }, xp: 50 })
    await page.goto('/#/')
    await expect(page.getByRole('heading', { name: /স্বাগতম, রুমা/ })).toBeVisible()
    await expect(page.getByTestId('daily-goal')).toBeVisible()
    await expect(page.getByTestId('part-1')).toBeVisible()
    await expect(page.getByTestId('path-row-20')).toBeAttached()
    await expect(page.getByRole('link', { name: /পাঠ ২:.*এখন করুন/ })).toBeVisible()
    await expect(page.getByRole('img', { name: /পাঠ ৩:.*তালা/ })).toBeAttached()
    expect(await noHScroll(page)).toBe(true)
    await page.getByTestId('continue-card').getByRole('link', { name: /চালিয়ে যান|শুরু করি/ }).click()
    await expect(page).toHaveURL(/#\/module\/2/)
  })
}

test('glossary: card flip, search and flashcards', async ({ page }) => {
  await seed(page)
  await page.goto('/#/glossary')
  const first = page.getByTestId('glossary-card').first().locator('.flip')
  await expect(first).toHaveAttribute('data-flipped', 'false')
  await first.getByRole('button').click()
  await expect(first).toHaveAttribute('data-flipped', 'true')
  await page.getByRole('searchbox').fill('zzzzzz')
  await expect(page.getByTestId('glossary-card')).toHaveCount(0)
  await page.getByRole('button', { name: 'শব্দ ফ্ল্যাশকার্ড' }).click()
  const card = page.getByTestId('flashcards').locator('.flip')
  await expect(card).toHaveAttribute('data-flipped', 'false')
  await page.keyboard.press('Space')
  await expect(card).toHaveAttribute('data-flipped', 'true')
  await page.getByRole('button', { name: /জানতাম/ }).click()
  await expect(card).toHaveAttribute('data-flipped', 'false')
  await expect.poll(async () => (await stored(page)).extras.flashKnown?.length).toBe(1)
  await page.reload()
  await page.getByRole('button', { name: 'শব্দ ফ্ল্যাশকার্ড' }).click()
  await expect(page.getByText(/১ জানা/)).toBeVisible()
})

test('settings: my computer section and daily goal', async ({ page }) => {
  await seed(page)
  await page.goto('/#/settings')
  await expect(page.getByTestId('auto-note')).toBeVisible()
  await page.getByRole('radio', { name: /৩টি/ }).check()
  expect((await stored(page)).settings.dailyGoal).toBe(3)
})
