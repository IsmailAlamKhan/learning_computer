import { expect, test, type Page } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

const SETTINGS = { settings: { numerals: 'western', unlockAll: true } }
const SIM = '[data-sim-root]'

async function flow(page: Page, os: 'windows' | 'mac') {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await startGuided(page, 19)
  await coach(page, 'code-explorer-broken.py').click()
  await coach(page, 'code-run').click()
  await expect(coach(page, 'code-error-original')).toContainText("NameError: name 'mesage' is not defined", { timeout: 30000 })
  await cont(page) // read original
  await cont(page) // read Bengali
  // fix the typo on line 2 and save
  const content = page.locator(`${SIM} .cm-content`)
  await content.click()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.insertText('message = "Hello, friend"\nprint(message)\n')
  await coach(page, 'code-save').click()
  await coach(page, 'code-run').click()
  await expect(coach(page, 'code-output-text')).toContainText('Hello, friend', { timeout: 30000 })
  // browser
  await coach(page, os === 'windows' ? 'taskbar-app-browser' : 'dock-browser').click()
  await coach(page, 'browser-address').fill('NameError: name is not defined python')
  await coach(page, 'browser-address').press('Enter')
  await coach(page, 'search-result-1').click()
  await expect(coach(page, 'm19-qa-accepted')).toBeVisible()
  await cont(page)
  await coach(page, 'm19-docs-link').click()
  await expect(coach(page, 'm19-docs')).toBeVisible()
  await cont(page)
  await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
  expect(errors).toEqual([])
}

test.describe('Module 19 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await flow(page, 'windows')
  })
  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac', SETTINGS)
    await flow(page, 'mac')
  })
})

test.describe('Notebook', () => {
  test('create, edit, search, export, delete', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await page.goto('/#/')
    await page.getByRole('link', { name: 'নোটবুক', exact: true }).click()
    await expect(page).toHaveURL(/#\/notebook/)
    await expect(page.getByTestId('note-empty')).toBeVisible()

    await page.getByTestId('note-template-new-word').click()
    await page.getByTestId('note-body').fill('শব্দ: timeout\nঅর্থ: সময় শেষ')
    await expect(page.getByTestId('note-save-status')).toContainText('সেভ হয়েছে')
    await page.getByTestId('note-done').click()

    await page.getByTestId('note-new').click()
    await page.getByTestId('note-title').fill('Second note')
    await page.getByTestId('note-mono').check()
    await page.getByTestId('note-body').fill('print(mesage)')
    await expect(page.getByTestId('note-save-status')).toContainText('সেভ হয়েছে')
    await page.getByTestId('note-done').click()
    await expect(page.getByTestId('note-item')).toHaveCount(2)
    await expect(page.getByTestId('note-item').first()).toContainText('Second note')

    // persists across reload
    await page.reload()
    await expect(page.getByTestId('note-item')).toHaveCount(2)

    await page.getByTestId('note-search').fill('timeout')
    await expect(page.getByTestId('note-item')).toHaveCount(1)
    await page.getByTestId('note-open').click()
    await page.getByTestId('note-body').fill('শব্দ: timeout (edited)')
    await expect(page.getByTestId('note-save-status')).toContainText('সেভ হয়েছে')
    await page.getByTestId('note-done').click()
    await expect(page.getByTestId('note-item')).toContainText('edited')
    await page.getByTestId('note-search').fill('')

    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('note-export-md').click()])
    expect(dl.suggestedFilename()).toBe('my-programming-notebook.md')

    await page.getByTestId('note-delete').first().click()
    await page.getByTestId('note-delete-yes').click()
    await expect(page.getByTestId('note-item')).toHaveCount(1)
  })

  test('add to notebook from a lesson summary', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    await page.goto('/#/module/19')
    await page.getByRole('button', { name: /মনে রাখুন/ }).click()
    await page.getByTestId('add-to-notebook').click()
    await page.getByRole('link', { name: 'নোটবুক খুলুন' }).click()
    await expect(page.getByTestId('note-item')).toContainText('টেক ইংরেজি')
  })
})
