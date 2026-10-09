import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  checkAnswer,
  continueStep,
  coach,
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

/** Module 17 (terminal, first lesson): three units — আমি কোথায়? / ফোল্ডার ও ফাইল বানানো / নিরাপদ থাকা. */

const input = (page: Page) => page.locator('[data-sim-root] [data-coach="terminal-input"]')
const output = (page: Page) => page.locator('[data-sim-root] [data-coach="terminal-output"]')

async function run(page: Page, cmd: string) {
  await input(page).focus()
  await input(page).fill(cmd)
  await input(page).press('Enter')
}

async function unit1Practice(page: Page, win: boolean) {
  await run(page, 'pwd')
  await run(page, win ? 'dir' : 'ls')
  await run(page, 'cd Documents')
  await run(page, 'pwd')
  await expect(output(page)).toContainText(win ? 'C:\\Users\\Anika\\Documents' : '/Users/anika/Documents')
  await run(page, 'cd ..')
}

async function unit2Practice(page: Page, win: boolean) {
  await run(page, 'mkdir coding')
  // Tab-completion (the completed line keeps a trailing separator)
  await input(page).focus()
  await input(page).pressSequentially('cd cod')
  await input(page).press('Tab')
  await expect(input(page)).toHaveValue(win ? 'cd coding\\' : 'cd coding/')
  await input(page).press('Enter')
  await run(page, win ? 'ni notes.txt' : 'touch notes.txt')
  await run(page, 'echo "hello" > notes.txt')
  await run(page, win ? 'type notes.txt' : 'cat notes.txt')
  await expect(output(page)).toContainText('hello')
  await run(page, win ? 'cls' : 'clear')
}

async function unit3Practice(page: Page, win: boolean) {
  await run(page, 'cd coding')
  await run(page, win ? 'type notes.txt' : 'cat notes.txt')
  await expect(output(page)).toContainText('hello')
  await input(page).press('ArrowUp')
  await expect(input(page)).toHaveValue(win ? 'type notes.txt' : 'cat notes.txt')
  await input(page).press('Control+c')
  await continueStep(page)
  await run(page, win ? 'del notes.txt' : 'rm notes.txt')
  await expect(output(page)).toContainText('এই অনুশীলন-টার্মিনালে এই কমান্ডটি')
  await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
  await continueStep(page)
}

async function unit1Quiz(page: Page) {
  await answerChoice(page, /এখন কোন ফোল্ডারে আছি/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /ওপরের ফোল্ডারে/)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['কোথায় আছি দেখা', 'pwd'], ['এখানে কী আছে দেখা', 'ls / dir'], ['অন্য ফোল্ডারে যাওয়া', 'cd Documents'], ['ওপরে ফেরা', 'cd ..']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function unit2Quiz(page: Page) {
  await orderItems(page, ['হোমে আছি কি না', 'mkdir coding', 'cd coding', 'ফাইল বানানোর কমান্ড'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['নতুন ফোল্ডার', 'mkdir coding'], ['ফাইলে লেখা ঢোকানো', 'echo "hi" > a.txt'], ['নাম নিজে পূর্ণ করা', 'Tab চাপা'], ['পর্দা পরিষ্কার', 'clear / cls']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /touch \(Mac\)/)
  await expectRight(page)
  await nextCard(page)
}

async function unit3Quiz(page: Page) {
  await answerChoice(page, /↑/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /চালাব না/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /একই ফোল্ডার/)
  await expectRight(page)
  await nextCard(page)
}

for (const os of ['windows', 'mac'] as const) {
  const win = os === 'windows'

  test(`Module 17 all three units end to end (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    const problems = watchProblems(page)
    await openModule(page, 17)
    await expect(page.getByTestId('units-overview')).toBeVisible()

    // ----- unit 1 -----
    await startUnit(page, 0)
    await expect(page.getByTestId('deck-text')).toContainText('টার্মিনাল')
    await nextCard(page) // prompt card (per OS)
    await expect(page.getByTestId('deck-text')).toContainText('প্রম্পট')
    await expectNoScroll(page)
    await nextCard(page) // prompt-anatomy widget
    const w = page.getByTestId('prompt-anatomy')
    await expect(w).toBeVisible()
    await w.locator('[data-folder="coding"]').click()
    await expect(w.getByTestId('prompt-line')).toContainText('coding')
    await nextCard(page) // dir vs ls compare
    await expect(page.getByTestId('deck-text')).toContainText('dir')
    await skipToPractice(page)
    await expect(input(page)).toBeVisible()
    await expect(primary(page)).toBeDisabled()
    await unit1Practice(page, win)
    await expectPracticeDone(page)
    const mid = await savedProgress(page)
    expect(mid.modules['17'].stepsDone[os]).toHaveLength(5)
    await nextCard(page)
    await unit1Quiz(page)
    expect(await slideKind(page)).toBe('celebrate')

    // ----- unit 2 -----
    await primary(page).click()
    await expect(page.getByTestId('deck-hook')).toBeVisible()
    await nextCard(page, 3) // mkdir, Tab, compare
    await expect(page.getByTestId('deck-text')).toContainText(win ? 'ni' : 'touch')
    await skipToPractice(page)
    await unit2Practice(page, win)
    await expectPracticeDone(page)
    expect((await savedProgress(page)).modules['17'].stepsDone[os]).toHaveLength(11)
    await nextCard(page)
    await unit2Quiz(page)
    expect(await slideKind(page)).toBe('celebrate')

    // ----- unit 3 -----
    await primary(page).click()
    await expect(page.getByTestId('deck-hook')).toBeVisible()
    await skipToPractice(page)
    await unit3Practice(page, win)
    await expectPracticeDone(page)
    const done3 = await savedProgress(page)
    expect(done3.modules['17'].stepsDone[os]).toHaveLength(17)
    await nextCard(page)
    await unit3Quiz(page)
    expect(await slideKind(page)).toBe('celebrate')
    const done = await savedProgress(page)
    expect(done.modules['17'].unitsDone).toEqual(['where-am-i', 'make-things', 'stay-safe'])
    expect(done.modules['17'].completed).toBe(true)
    expect(problems).toEqual([])
  })
}
