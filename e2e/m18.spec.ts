import { expect, test, type Page } from '@playwright/test'
import { coach, cont, seedProfile } from './helpers'

const SIM = '[data-sim-root]'
const input = (page: Page) => page.locator(`${SIM} [data-coach="terminal-input"]`)

async function typeAddress(page: Page, text: string) {
  const a = page.locator(`${SIM} [data-coach="browser-address"]`).first()
  await a.click()
  await a.fill(text)
  await page.keyboard.press('Enter')
}

async function run(page: Page, cmd: string) {
  await input(page).focus()
  await input(page).fill(cmd)
  await input(page).press('Enter')
}

/** Open the guided section, start chapter `i` (1-based) and press the coach's start button. */
async function openChapter(page: Page, i: number) {
  await page.goto('/#/module/18')
  await page.reload()
  await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
  await page.locator('li', { hasText: `অংশ ${i}:` }).getByRole('button').click()
  await page.getByRole('button', { name: /শুরু করি/ }).click()
}
const finished = (page: Page) => expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()

async function chapter1(page: Page, os: 'windows' | 'mac') {
  await openChapter(page, 1)
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
  } else await coach(page, 'dock-browser').click()
  await typeAddress(page, 'code editor download')
  await expect(coach(page, 'search-ad-1')).toBeVisible()
  await cont(page)
  await coach(page, 'search-result-1').click()
  await cont(page)
  await cont(page)
  await coach(page, 'm18-download-editor').click()
  await page.waitForTimeout(1700)
  await typeAddress(page, 'python-official.example/downloads')
  await coach(page, 'm18-download-python').click()
  await page.waitForTimeout(1700)
  await typeAddress(page, 'node-official.example')
  await coach(page, 'm18-download-node-current').click()
  await expect(coach(page, 'm18-current-note')).toBeVisible()
  await coach(page, 'm18-download-node-lts').click()
  await page.waitForTimeout(1700)
  await finished(page)
}

async function chapter2(page: Page, os: 'windows' | 'mac') {
  await openChapter(page, 2)
  await coach(page, 'fm-sidebar-Downloads').click()
  if (os === 'windows') {
    await coach(page, 'fm-item-practice-python-3.12.4-amd64.exe').dblclick()
    await coach(page, 'setup-path').click()
    await expect(coach(page, 'setup-path')).toHaveAttribute('aria-checked', 'true')
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-finish').click()
    await coach(page, 'fm-item-practice-node-v22.12.0-x64.msi').dblclick()
    await coach(page, 'setup-next').click()
    await coach(page, 'setup-accept').click()
    await expect(coach(page, 'setup-accept')).toHaveAttribute('aria-checked', 'true')
    for (let i = 0; i < 3; i++) await coach(page, 'setup-next').click()
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-uac-yes').click()
    await coach(page, 'setup-finish').click()
  } else {
    await coach(page, 'fm-item-practice-python-3.12.4-macos.pkg').dblclick()
    for (let i = 0; i < 3; i++) await coach(page, 'setup-next').click()
    await coach(page, 'setup-agree').click()
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-password').fill('practice123')
    await coach(page, 'setup-password-ok').click()
    await coach(page, 'setup-finish').click()
    await coach(page, 'fm-item-practice-node-v22.12.0.pkg').dblclick()
    for (let i = 0; i < 2; i++) await coach(page, 'setup-next').click()
    await coach(page, 'setup-agree').click()
    await coach(page, 'setup-next').click()
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-password').fill('practice123')
    await coach(page, 'setup-password-ok').click()
    await coach(page, 'setup-finish').click()
  }
  await finished(page)
}

async function chapter3(page: Page, os: 'windows' | 'mac') {
  await openChapter(page, 3)
  const out = page.locator(`${SIM} [data-coach="terminal-output"]`)
  await run(page, os === 'windows' ? 'python --version' : 'python3 --version')
  await expect(out).toContainText('Python 3.12.4')
  await run(page, 'node --version')
  await expect(out).toContainText('v22.12.0')
  await run(page, 'git --version')
  await expect(out).toContainText(os === 'windows' ? "'git' is not recognized" : 'xcode-select')
  await cont(page)
  await finished(page)
}

async function chapter4(page: Page, os: 'windows' | 'mac') {
  await openChapter(page, 4)
  for (const c of ['cd Documents', 'mkdir coding', 'cd coding', 'mkdir html-css', 'mkdir python', 'mkdir javascript', 'mkdir projects', 'code .']) await run(page, c)
  await expect(coach(page, 'code-explorer')).toBeVisible()
  await cont(page)
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-search').fill('extensions')
    await coach(page, 'start-app-extensions').click()
  } else {
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-extensions').click()
  }
  await cont(page)
  await coach(page, 'ext-install-python-support').click()
  await finished(page)
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 18 guided practice (${os}) completes all four chapters`, async ({ page }) => {
    await seedProfile(page, os)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await chapter1(page, os)
    await chapter2(page, os)
    await chapter3(page, os)
    await chapter4(page, os)
    expect(errors).toEqual([])
    const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['18'].stepsDone[o].length, os)
    expect(saved).toBe(os === 'windows' ? 48 : 51)
  })
}

test('the ad button is a trap that leads to the look-alike page', async ({ page }) => {
  await seedProfile(page, 'windows')
  await openChapter(page, 1)
  await coach(page, 'start-button').click()
  await coach(page, 'start-app-browser').click()
  await typeAddress(page, 'editor-official.example/download')
  await coach(page, 'm18-ad-trap').click()
  await coach(page, 'm18-decoy-download').click()
  await expect(coach(page, 'm18-decoy-gotcha')).toBeVisible()
  await expect(page.locator(`${SIM} [data-coach="browser-address"]`).first()).toHaveValue(/d0wnload/)
})

test('chapter 2 (windows): python installed without the PATH tick shows the note', async ({ page }) => {
  await seedProfile(page, 'windows')
  await openChapter(page, 2)
  await coach(page, 'fm-sidebar-Downloads').click()
  await coach(page, 'fm-item-practice-python-3.12.4-amd64.exe').dblclick()
  await coach(page, 'setup-install').click()
  await expect(coach(page, 'setup-nopath-note')).toBeVisible()
})

test('widgets render', async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/module/18')
  await expect(page.getByTestId('tool-map')).toBeVisible()
  await expect(page.getByTestId('tool-address-check')).toBeVisible()
})

test('setup checklist cheat sheet renders', async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/cheatsheet/setup-checklist')
  await expect(page.getByText('code.visualstudio.com').first()).toBeVisible()
  await expect(page.getByText('nodejs.org').first()).toBeVisible()
})
