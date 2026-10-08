import { expect, test } from '@playwright/test'
import { coach, cont, seedProfile, startGuided } from './helpers'

async function commonStart(page: import('@playwright/test').Page) {
  await cont(page)
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, 'fm-item-Photo.jpg').click({ button: 'right' })
  await coach(page, 'ctx-properties').click()
  await expect(coach(page, 'properties')).toContainText(/MB|KB/)
  await coach(page, 'dialog-ok').click()
  await cont(page)
}
async function commonEnd(page: import('@playwright/test').Page) {
  await coach(page, 'editor-text').fill('remember to buy rice')
  await coach(page, 'win-editor-close').click()
  await coach(page, 'dialog-dont-save').click()
}

test.describe('Module 14 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 14)
    await commonStart(page)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
    await commonEnd(page)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
    await expect(coach(page, 'editor-text')).toHaveValue('')
    await cont(page)
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 14)
    await commonStart(page)
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-editor').click()
    await commonEnd(page)
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-editor').click()
    await expect(coach(page, 'editor-text')).toHaveValue('')
    await cont(page)
    await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
    expect(errors).toEqual([])
  })

  test('toggle-bits widget and quiz predict question', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/module/14')
    await page.getByTestId('bit-1').click()
    await page.getByTestId('bit-7').click()
    await expect(page.getByTestId('bits-value')).toHaveText('65')
    await expect(page.getByTestId('bits-char')).toHaveText('A')
    await page.getByTestId('challenge-10').click()
    await page.getByTestId('bit-4').click()
    await page.getByTestId('bit-6').click()
    await expect(page.getByTestId('challenge-feedback')).toContainText('চমৎকার')
    await page.getByTestId('io-scenario-atm').click()
    await expect(page.getByTestId('io-stage-storage')).toHaveAttribute('data-used', 'yes')
    await page.getByTestId('kitchen-ram').click()
    await expect(page.getByTestId('kitchen-detail')).toContainText('কাউন্টার')
  })
})
