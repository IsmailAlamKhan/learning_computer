import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  continueStep,
  expectNoScroll,
  expectPracticeDone,
  expectRight,
  matchPairs,
  nextCard,
  openModule,
  orderItems,
  primary,
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'

/** Module 18 (programming tools setup): five units in the cards format. */

const SIM = '[data-sim-root]'
const input = (page: Page) => page.locator(`${SIM} [data-coach="terminal-input"]`)
type Os = 'windows' | 'mac'

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

async function unit1Practice(page: Page, os: Os) {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
  } else await coach(page, 'dock-browser').click()
  await typeAddress(page, 'code editor download')
  await expect(coach(page, 'search-ad-1')).toBeVisible()
  await coach(page, 'search-result-1').click()
  await continueStep(page) // read the address
  await continueStep(page) // the ad box
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
}

async function unit2Practice(page: Page, os: Os) {
  await coach(page, 'fm-sidebar-Downloads').click()
  if (os === 'windows') {
    await coach(page, 'fm-item-practice-python-3.12.4-amd64.exe').dblclick()
    await coach(page, 'setup-path').click()
    await expect(coach(page, 'setup-path')).toHaveAttribute('aria-checked', 'true')
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-finish').click()
  } else {
    await coach(page, 'fm-item-practice-python-3.12.4-macos.pkg').dblclick()
    for (let i = 0; i < 3; i++) await coach(page, 'setup-next').click()
    await coach(page, 'setup-agree').click()
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-password').fill('practice123')
    await coach(page, 'setup-password-ok').click()
    await coach(page, 'setup-finish').click()
  }
}

async function unit3Practice(page: Page, os: Os) {
  await coach(page, 'fm-sidebar-Downloads').click()
  if (os === 'windows') {
    await coach(page, 'fm-item-practice-node-v22.12.0-x64.msi').dblclick()
    await coach(page, 'setup-next').click()
    await coach(page, 'setup-accept').click()
    await expect(coach(page, 'setup-accept')).toHaveAttribute('aria-checked', 'true')
    for (let i = 0; i < 3; i++) await coach(page, 'setup-next').click()
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-uac-yes').click()
    await coach(page, 'setup-finish').click()
  } else {
    await coach(page, 'fm-item-practice-node-v22.12.0.pkg').dblclick()
    for (let i = 0; i < 2; i++) await coach(page, 'setup-next').click()
    await coach(page, 'setup-agree').click()
    await coach(page, 'setup-next').click()
    await coach(page, 'setup-install').click()
    await coach(page, 'setup-password').fill('practice123')
    await coach(page, 'setup-password-ok').click()
    await coach(page, 'setup-finish').click()
  }
}

async function unit4Practice(page: Page, os: Os) {
  const out = page.locator(`${SIM} [data-coach="terminal-output"]`)
  await run(page, os === 'windows' ? 'python --version' : 'python3 --version')
  await expect(out).toContainText('Python 3.12.4')
  await run(page, 'node --version')
  await expect(out).toContainText('v22.12.0')
  await run(page, 'git --version')
  await expect(out).toContainText(os === 'windows' ? "'git' is not recognized" : 'xcode-select')
  await continueStep(page)
}

async function unit5Practice(page: Page, os: Os) {
  for (const c of ['cd Documents', 'mkdir coding', 'cd coding', 'mkdir html-css', 'mkdir python', 'mkdir javascript', 'mkdir projects', 'code .']) await run(page, c)
  await expect(coach(page, 'code-explorer')).toBeVisible()
  await continueStep(page)
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-search').fill('extensions')
    await coach(page, 'start-app-extensions').click()
  } else {
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-extensions').click()
  }
  await continueStep(page)
  await coach(page, 'ext-install-python-support').click()
}

async function quiz1(page: Page) {
  await answerClick(page, /^nodejs\.org$/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /নিজের কম্পিউটারের ধরন লেখা বোতাম/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /বন্ধ করব; দরকারে/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz2(page: Page) {
  await answerChoice(page, /python কমান্ড চিনতে পারে না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /^নিজে ইনস্টল শুরু করলে/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Downloads-এ ইনস্টলার খুলি', 'PATH বা শর্তে সম্মতি দিই', 'Install চাপি', 'শেষে Close চাপি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function quiz3(page: Page) {
  await answerChoice(page, /স্থিতিশীল আর অনেক দিন সাহায্য পায়/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['কোড এডিটর', 'কোড লেখার গোছানো খাতা'], ['Python', 'পাইথন কোড চালায়'], ['Node.js', 'কম্পিউটারে জাভাস্ক্রিপ্ট চালায়']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Windows-এ \.msi, Mac-এ \.pkg/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz4(page: Page) {
  await answerChoice(page, /কম্পিউটার কমান্ডটি খুঁজে পায়নি/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, /^python3 --version$/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /টার্মিনাল বন্ধ করে নতুন করে খুলব/)
  await expectRight(page)
  await nextCard(page)
}

async function quiz5(page: Page) {
  await answerClick(page, /^Documents\/coding\/python$/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /প্রকাশক verified কি না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /Git = সেভ পয়েন্ট/)
  await expectRight(page)
  await nextCard(page)
}

async function runUnit(page: Page, unit: number, practice: () => Promise<void>, quiz: () => Promise<void>) {
  if (unit === 0) await startUnit(page, 0)
  else {
    await primary(page).click() // celebration -> next unit
    await expect(page.getByTestId('deck-hook')).toBeVisible()
  }
  expect(await slideKind(page)).toBe('hook')
  await expectNoScroll(page)
  await skipToPractice(page)
  await practice()
  await expectPracticeDone(page)
  await nextCard(page)
  await quiz()
  expect(await slideKind(page)).toBe('celebrate')
}

for (const os of ['windows', 'mac'] as const) {
  test.describe(`Module 18 cards flow (${os})`, () => {
    test('all five units end to end', async ({ page }) => {
      await seedProfile(page, os)
      const problems = watchProblems(page)
      await openModule(page, 18)
      await runUnit(page, 0, () => unit1Practice(page, os), () => quiz1(page))
      await runUnit(page, 1, () => unit2Practice(page, os), () => quiz2(page))
      await runUnit(page, 2, () => unit3Practice(page, os), () => quiz3(page))
      await runUnit(page, 3, () => unit4Practice(page, os), () => quiz4(page))
      await runUnit(page, 4, () => unit5Practice(page, os), () => quiz5(page))
      const saved = await savedProgress(page)
      const m = saved.modules['18']
      // unit 1: 15 / 14, python: 5 / 10, node: 10 / 10, check: 4 / 4, folders: 14 / 13
      expect(m.stepsDone[os].length).toBe(os === 'windows' ? 15 + 5 + 10 + 4 + 14 : 14 + 10 + 10 + 4 + 13)
      expect(Object.keys(m.unitQuiz ?? {})).toHaveLength(5)
      expect(problems).toEqual([])
    })
  })
}

test.describe('Module 18 details', () => {
  test('the ad button is a trap that leads to the look-alike page', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 18)
    await startUnit(page, 0)
    await skipToPractice(page)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
    await typeAddress(page, 'editor-official.example/download')
    await coach(page, 'm18-ad-trap').click()
    await coach(page, 'm18-decoy-download').click()
    await expect(coach(page, 'm18-decoy-gotcha')).toBeVisible()
    await expect(page.locator(`${SIM} [data-coach="browser-address"]`).first()).toHaveValue(/d0wnload/)
  })

  test('python installed without the PATH tick shows the note (windows)', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 18)
    await startUnit(page, 1)
    await skipToPractice(page)
    await coach(page, 'fm-sidebar-Downloads').click()
    await coach(page, 'fm-item-practice-python-3.12.4-amd64.exe').dblclick()
    await coach(page, 'setup-install').click()
    await expect(coach(page, 'setup-nopath-note')).toBeVisible()
  })

  test('widget cards render inside the deck', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 18)
    await startUnit(page, 0)
    await nextCard(page, 2) // editor compare, tool-map widget
    await expect(page.getByTestId('tool-map')).toBeVisible()
    await nextCard(page, 2) // official, address-check widget
    await expect(page.getByTestId('tool-address-check')).toBeVisible()
  })

  test('setup checklist cheat sheet renders', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/cheatsheet/setup-checklist')
    await expect(page.getByText('code.visualstudio.com').first()).toBeVisible()
    await expect(page.getByText('nodejs.org').first()).toBeVisible()
  })
})
