import { expect, test, type Page } from '@playwright/test'

const KEY = 'computer-shikhi:v1'
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY)
const rootFont = (page: Page) => page.evaluate(() => getComputedStyle(document.documentElement).fontSize)

test.describe('onboarding (fresh profile)', () => {
  test('welcome -> name -> OS -> text size -> motivation -> Home greeting; reload keeps state', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))

    // a fresh visitor is sent to the welcome flow
    await page.goto('/')
    await expect(page).toHaveURL(/#\/welcome/)
    await expect(page.getByText(/ধাপ ১ \/ ৪/)).toBeVisible()
    await expect(page.getByRole('heading', { name: /স্বাগতম!/ })).toBeVisible()

    // step 1: the name is required before continuing
    const next = page.getByRole('button', { name: /পরের ধাপ/ })
    await expect(next).toBeDisabled()
    await page.getByLabel(/আপনার নাম কী/).fill('রুমা')
    await expect(next).toBeEnabled()
    await next.click()

    // step 2: OS choice
    await expect(page.getByText(/ধাপ ২ \/ ৪/)).toBeVisible()
    await page.getByRole('radio', { name: /^Mac/ }).check()
    await next.click()

    // step 3: text size changes the page immediately
    await expect(page.getByText(/ধাপ ৩ \/ ৪/)).toBeVisible()
    expect(await rootFont(page)).toBe('18px')
    await page.getByRole('radio', { name: 'বড়', exact: true }).check()
    await expect(page.locator('html')).toHaveAttribute('data-text', 'large')
    expect(await rootFont(page)).toBe('20px')
    await page.getByRole('radio', { name: 'সবচেয়ে বড়' }).check()
    expect(await rootFont(page)).toBe('26px')
    await page.getByRole('radio', { name: 'বড়', exact: true }).check()
    await next.click()

    // step 4: motivation note, then finish
    await expect(page.getByText(/ধাপ ৪ \/ ৪/)).toBeVisible()
    await page.getByRole('textbox').fill('আমি নিজে একটি ওয়েবসাইট বানাতে চাই।')
    await page.getByRole('button', { name: /শুরু করি/ }).click()

    // Home: greeting and the motivation quote
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByRole('heading', { name: /স্বাগতম, রুমা/ })).toBeVisible()
    await expect(page.locator('q')).toHaveText('আমি নিজে একটি ওয়েবসাইট বানাতে চাই।')

    // saved
    const d = await stored(page)
    expect(d.profile).toMatchObject({ name: 'রুমা', os: 'mac', onboarded: true, motivation: 'আমি নিজে একটি ওয়েবসাইট বানাতে চাই।' })
    expect(d.settings.textSize).toBe('large')

    // reload keeps everything (no onboarding again, text size still applied)
    await page.reload()
    await expect(page.getByRole('heading', { name: /স্বাগতম, রুমা/ })).toBeVisible()
    await expect(page.locator('q')).toHaveText('আমি নিজে একটি ওয়েবসাইট বানাতে চাই।')
    expect(await rootFont(page)).toBe('20px')
    expect(errors).toEqual([])
  })

  test('the motivation note is optional', async ({ page }) => {
    await page.goto('/#/welcome')
    await page.getByLabel(/আপনার নাম কী/).fill('মালা')
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
    await expect(page.getByRole('heading', { name: /স্বাগতম, মালা/ })).toBeVisible()
    await expect(page.locator('q')).toHaveCount(0)
  })

  test('settings changes persist across reloads', async ({ page }) => {
    await page.goto('/#/welcome')
    await page.getByLabel(/আপনার নাম কী/).fill('রুমা')
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
    await expect(page.getByRole('heading', { name: /স্বাগতম, রুমা/ })).toBeVisible()

    await page.goto('/#/settings')
    await page.getByLabel('নাম', { exact: true }).fill('রুমা আক্তার')
    await page.getByRole('radio', { name: /গাঢ়/ }).check()
    await page.getByRole('radio', { name: 'আরও বড়' }).check()
    await page.getByRole('radio', { name: /ইংরেজি সংখ্যা/ }).check()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await rootFont(page)).toBe('23px')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('html')).toHaveAttribute('data-text', 'xlarge')
    expect(await rootFont(page)).toBe('23px')
    await expect(page.getByLabel('নাম', { exact: true })).toHaveValue('রুমা আক্তার')
    await expect(page.getByRole('radio', { name: /গাঢ়/ })).toBeChecked()

    await page.goto('/#/')
    await expect(page.getByRole('heading', { name: /স্বাগতম, রুমা আক্তার/ })).toBeVisible()
    await expect(page.getByText(/0 \/ 20 পাঠ সম্পন্ন/)).toBeVisible()
  })
})
