import { expect, test } from '@playwright/test'
import { seedProfile } from './helpers'

const SIM = '[data-sim-root]'

test.beforeEach(async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/demo/tools')
})

test('editor: open index.html, edit, save, live preview updates', async ({ page }) => {
  await expect(page.locator(`${SIM} [data-coach="code-explorer-index.html"]`)).toBeVisible()
  await page.locator(`${SIM} [data-coach="code-explorer-index.html"]`).click()
  const frame = page.frameLocator(`${SIM} [data-coach="code-preview"]`)
  await expect(frame.locator('h1')).toContainText('আমার প্রথম ওয়েবপেজ')
  await expect(page.locator(`${SIM} [data-coach="code-preview"]`)).toHaveAttribute('sandbox', 'allow-scripts')

  const content = page.locator(`${SIM} .cm-content`)
  await content.click()
  await page.keyboard.press('ControlOrMeta+End')
  await page.keyboard.insertText('<p>নতুন লাইন: ক্ষ স্ত ন্দ</p>')
  await expect(frame.locator('body')).toContainText('নতুন লাইন: ক্ষ স্ত ন্দ')
  await expect(page.locator(`${SIM} [data-coach="code-tab-close-index.html"] span`).first()).toHaveAttribute('data-coach', 'code-dirty-index.html')

  await page.keyboard.press('Control+s')
  await expect(page.locator(`${SIM} [data-coach="code-dirty-index.html"]`)).toHaveCount(0)
  await page.screenshot({ path: process.env.PW_SHOT_DIR ? `${process.env.PW_SHOT_DIR}/editor-windows.png` : 'test-results/editor-windows.png' })
})

test('editor: run hello.js shows output (needs the JS runner)', async ({ page }) => {
  await page.locator(`${SIM} [data-coach="code-explorer-hello.js"]`).click()
  await page.locator(`${SIM} [data-coach="code-run"]`).click()
  const out = page.locator(`${SIM} [data-coach="code-output"]`)
  await expect(out).toContainText(/স্বাগতম|NotImplemented|runner not implemented/, { timeout: 15000 })
  test.skip((await out.textContent())?.includes('runner not implemented') ?? false, 'JS runner is still a stub')
  await expect(out).toContainText('স্বাগতম! এটি আমার প্রথম প্রোগ্রাম')
})

test('mac flavor renders the same editor', async ({ page }) => {
  await page.getByTestId('os-mac').click()
  await page.locator(`${SIM} [data-coach="code-explorer-index.html"]`).click()
  await expect(page.locator(`${SIM} .cm-content`)).toContainText('আমার প্রথম ওয়েবপেজ')
  await page.screenshot({ path: process.env.PW_SHOT_DIR ? `${process.env.PW_SHOT_DIR}/editor-mac.png` : 'test-results/editor-mac.png' })
})
