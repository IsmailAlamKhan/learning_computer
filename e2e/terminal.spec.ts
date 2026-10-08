import { expect, test } from '@playwright/test'
import { seedProfile } from './helpers'

const SIM = '[data-sim-root]'
const input = (page: import('@playwright/test').Page) => page.locator(`${SIM} [data-coach="terminal-input"]`)
const output = (page: import('@playwright/test').Page) => page.locator(`${SIM} [data-coach="terminal-output"]`)

async function run(page: import('@playwright/test').Page, cmd: string) {
  await input(page).fill(cmd)
  await input(page).press('Enter')
}

for (const os of ['windows', 'mac'] as const) {
  test(`terminal (${os}): navigate, tab-complete, create, history, blocked rm`, async ({ page }) => {
    await seedProfile(page, os)
    await page.goto('/#/demo/tools')
    if (os === 'mac') await page.getByTestId('os-mac').click()
    await expect(input(page)).toBeVisible()
    await expect(output(page)).toContainText('help লিখে Enter চাপুন')

    await input(page).focus()
    await input(page).pressSequentially('cd cod')
    await input(page).press('Tab')
    await expect(input(page)).toHaveValue(os === 'windows' ? 'cd coding\\' : 'cd coding/')
    await input(page).press('Enter')
    await expect(page.locator(`${SIM} label:has([data-coach="terminal-input"])`)).toContainText(os === 'windows' ? 'PS C:\\Users\\Anika\\coding>' : 'anika@Mac coding %')

    await run(page, os === 'windows' ? 'dir' : 'ls')
    await expect(output(page)).toContainText('hello.py')

    await run(page, 'echo "আমার প্রথম লাইন" > notes.txt')
    await run(page, os === 'windows' ? 'type notes.txt' : 'cat notes.txt')
    await expect(output(page)).toContainText('আমার প্রথম লাইন')

    await input(page).press('ArrowUp')
    await expect(input(page)).toHaveValue(os === 'windows' ? 'type notes.txt' : 'cat notes.txt')
    await input(page).press('Control+c')
    await expect(input(page)).toHaveValue('')

    await run(page, 'rm notes.txt')
    await expect(output(page)).toContainText('এই অনুশীলন-টার্মিনালে এই কমান্ডটি')
    await run(page, os === 'windows' ? 'python --version' : 'python3 --version')
    await expect(output(page)).toContainText('Python 3.12')
    await page.screenshot({ path: process.env.PW_SHOT_DIR ? `${process.env.PW_SHOT_DIR}/terminal-${os}.png` : `test-results/terminal-${os}.png` })
  })
}
