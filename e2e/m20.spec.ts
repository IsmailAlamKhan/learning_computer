import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  expectNoScroll,
  expectPracticeDone,
  expectRight,
  nextCard,
  openModule,
  orderItems,
  predict as predictQuiz,
  primary,
  savedProgress,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'
import lesson from '../src/content/lessons/m20'

/**
 * Module 20 (প্রথম কোড, the finale): eight units. Each unit: cards (code visuals, widgets) → practice in the Code Editor
 * (HTML/CSS/Python, real Pyodide) → three quiz questions → celebration. The last unit finishes the module:
 * certificate 2 and the /next-steps roadmap.
 */

const SIM = '[data-sim-root]'
const hw = (page: Page, id: string) => page.locator(`${SIM} [data-coach="${id}"]`).first()
const cm = (page: Page) => page.locator(`${SIM} .cm-content`)
const frame = (page: Page) => page.frameLocator(`${SIM} [data-coach="code-preview"]`)
const unitSteps = (unitId: string) => lesson.units.find((u) => u.id === unitId)!.steps.map((s) => s.id)
const UNIT_IDS = lesson.units.map((u) => u.id)

const openFile = (page: Page, name: string) => hw(page, `code-explorer-${name}`).click()

/** Put the cursor at the end of line `n` (1-based) of the open file. */
async function endOfLine(page: Page, n: number) {
  await cm(page).click()
  await page.keyboard.press('ControlOrMeta+Home')
  for (let i = 1; i < n; i++) await page.keyboard.press('ArrowDown')
  await page.keyboard.press('End')
}
async function endOfDoc(page: Page) {
  await cm(page).click()
  await page.keyboard.press('ControlOrMeta+End')
}
/** Type like a learner, then let the debounced preview/edit events fire. */
async function typeText(page: Page, text: string) {
  await page.keyboard.type(text)
  await page.waitForTimeout(600)
}
async function save(page: Page, os: 'windows' | 'mac') {
  await page.keyboard.press(os === 'mac' ? 'Meta+s' : 'Control+s')
  await page.waitForTimeout(300)
}
/** the coach bubble's "what will be printed?" box */
const predictStep = async (page: Page, answer: string) => {
  await page.getByLabel(/আপনার মনে হয় কী ছাপা হবে/).fill(answer)
  await page.getByRole('button', { name: 'উত্তর দিন' }).click()
}
const run = (page: Page) => hw(page, 'code-run').click()
const output = (page: Page) => hw(page, 'code-output')
async function answerPrompt(page: Page, value: string) {
  const box = hw(page, 'code-input')
  await expect(box).toBeVisible({ timeout: 20000 })
  await box.fill(value)
  await hw(page, 'code-input-send').click()
}

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** dragMatch by tap-then-tap; the labels are matched literally (some are code like "*" or "**") */
async function match(page: Page, pairs: [string, string][]) {
  for (const [left, right] of pairs) {
    await page.getByTestId('match-chip').filter({ hasText: new RegExp(`^${esc(right)}$`) }).click()
    await page.getByTestId('match-slot').and(page.getByRole('button', { name: new RegExp(`^${esc(left)} — এখানে বসান`) })).click()
  }
}
const finish = async (page: Page) => {
  await expectRight(page)
  await nextCard(page)
}

type Walk = (page: Page, os: 'windows' | 'mac') => Promise<void>

/** practice walks, by unit id */
const PRACTICE: Record<string, Walk> = {
  'html-basics': async (page, os) => {
    await openFile(page, 'index.html')
    await expect(hw(page, 'code-preview')).toBeVisible()
    await endOfLine(page, 8)
    await typeText(page, '<h1>Hello, world</h1>')
    await expect(frame(page).locator('h1')).toHaveText('Hello, world')
    await typeText(page, '\n<p>I am learning to code.</p>')
    await typeText(page, '\n<h2>About me</h2>')
    await typeText(page, '\n<ul>\n<li>Rice</li>')
    await typeText(page, '\n<li>Dal</li>')
    await typeText(page, '\n</ul>')
    await expect(frame(page).locator('li')).toHaveCount(2)
    await typeText(page, '\n<a href="https://example.com">My link</a>')
    await save(page, os)
  },
  'html-extras': async (page, os) => {
    await openFile(page, 'index.html')
    await expect(frame(page).locator('p')).toContainText('ক্ষ, স্ত, ন্দ')
    await endOfLine(page, 5)
    await typeText(page, '<meta charset="utf-8">')
    await endOfLine(page, 10)
    await typeText(page, '<img src="photo.jpg" alt="My photo">')
    await typeText(page, '\n<!-- my first image -->')
    await save(page, os)
  },
  css: async (page, os) => {
    await openFile(page, 'index.html')
    await endOfLine(page, 6)
    await typeText(page, '<link rel="stylesheet" href="style.css">')
    await save(page, os)
    await openFile(page, 'style.css')
    await endOfLine(page, 3)
    await typeText(page, 'color: teal;')
    await expect.poll(() => frame(page).locator('h1').evaluate((e) => getComputedStyle(e).color)).toBe('rgb(0, 128, 128)')
    await typeText(page, '\nfont-size: 48px;')
    await typeText(page, '\ntext-align: center;')
    await expect.poll(() => frame(page).locator('h1').evaluate((e) => getComputedStyle(e).textAlign)).toBe('center')
    // h1 now spans lines 2-6, so the body rule's empty line is 9
    await endOfLine(page, 9)
    await typeText(page, 'background-color: lightyellow;')
    await typeText(page, '\nmargin: 40px;')
    // body spans 8-11, p's empty line is 14
    await endOfLine(page, 14)
    await typeText(page, 'background-color: white;')
    await typeText(page, '\npadding: 16px;')
    await save(page, os)
  },
  'py-print': async (page) => {
    await openFile(page, 'hello.py')
    await predictStep(page, 'Hello, Python!')
    await run(page)
    await expect(output(page)).toContainText('Hello, Python!', { timeout: 30000 })
    await endOfDoc(page)
    await typeText(page, 'print("My name is Rumi")')
    await run(page)
    await expect(output(page)).toContainText('My name is Rumi', { timeout: 30000 })
    await openFile(page, 'greet.py')
    await predictStep(page, 'hello, rumi') // wrong first (gentle nudge) ...
    await expect(page.getByText(/প্রায় হয়েছে/)).toBeVisible()
    await predictStep(page, 'Hello, Rumi')
    await cm(page).click()
    await page.getByText('"Rumi"').first().dblclick() // select the name only
    await page.keyboard.type('Anika')
    await run(page)
    await expect(output(page)).toContainText('Hello, Anika', { timeout: 30000 })
    // the deliberate typo: friendly Bengali error, then fix
    await openFile(page, 'oops.py')
    await run(page)
    await expect(hw(page, 'code-error')).toBeVisible({ timeout: 30000 })
    await expect(hw(page, 'code-error')).toContainText('NameError')
    await expect(hw(page, 'code-error')).toContainText('prnt')
    await endOfLine(page, 1)
    await page.keyboard.press('Shift+Home')
    await page.keyboard.type('print("Hello")')
    await run(page)
    await expect(output(page)).toContainText('Hello', { timeout: 30000 })
  },
  'py-input': async (page) => {
    await openFile(page, 'ask.py')
    await run(page)
    await answerPrompt(page, 'Anika')
    await openFile(page, 'calc.py')
    await predictStep(page, '100')
    await run(page)
    await expect(output(page)).toContainText('3.5', { timeout: 30000 })
    await openFile(page, 'next.py')
    await predictStep(page, '31')
    await run(page)
    await answerPrompt(page, '30')
  },
  'py-logic': async (page) => {
    await openFile(page, 'check.py')
    await predictStep(page, 'Adult')
    await run(page)
    await expect(output(page)).toContainText('Adult', { timeout: 30000 })
    await endOfLine(page, 1)
    await page.keyboard.press('Shift+Home')
    await page.keyboard.type('age = 15')
    await run(page)
    await expect(output(page)).toContainText('Not yet an adult', { timeout: 30000 })
    await endOfLine(page, 1)
    await page.keyboard.press('Shift+Home')
    await page.keyboard.type('age = 18')
    await run(page)
    await expect(output(page)).toContainText('Adult', { timeout: 30000 })
    await openFile(page, 'loop.py')
    await predictStep(page, 'Hello 0')
    await run(page)
    await expect(output(page)).toContainText('Hello 2', { timeout: 30000 })
    await endOfLine(page, 1)
    await page.keyboard.press('Shift+Home')
    await page.keyboard.type('for i in range(5):')
    await run(page)
    await expect(output(page)).toContainText('Hello 4', { timeout: 30000 })
  },
  'proj-web': async (page, os) => {
    await openFile(page, 'index.html')
    await endOfLine(page, 8)
    await typeText(page, '<h1>Rumi page</h1>')
    await typeText(page, '\n<p>I love tea and learning.</p>')
    await typeText(page, '\n<ul>\n<li>Tea</li>\n<li>Rice</li>\n<li>Music</li>\n</ul>')
    await typeText(page, '\n<a href="https://example.com">My site</a>')
    await save(page, os)
    await openFile(page, 'style.css')
    await endOfDoc(page)
    await typeText(page, '\nh1 {\n')
    await typeText(page, 'color: teal;')
    await typeText(page, '\nfont-size: 44px;')
    await typeText(page, '\ntext-align: center;')
    await expect.poll(() => frame(page).locator('h1').evaluate((e) => getComputedStyle(e).textAlign)).toBe('center')
    // leave the auto-closed "}" where it is, then add a second rule below it
    await page.keyboard.press('ControlOrMeta+End')
    await typeText(page, '\np {\n')
    await typeText(page, 'padding: 16px;')
    await save(page, os)
  },
  'proj-py': async (page, os) => {
    await openFile(page, 'greeting.py')
    await endOfDoc(page)
    await typeText(page, 'name = input("What is your name? ")')
    await save(page, os)
    await typeText(page, '\nage = int(input("How old are you? "))')
    await save(page, os)
    await typeText(page, '\nprint("Hello, " + name)')
    await save(page, os)
    await typeText(page, '\nprint("Next year you will be", age + 1)')
    await save(page, os)
    await typeText(page, '\nif age >= 18:\nprint("You are an adult.")')
    await save(page, os)
    await typeText(page, '\nelse:\nprint("You are not an adult yet.")')
    await save(page, os)
    await run(page)
    await answerPrompt(page, 'Anika')
    await answerPrompt(page, '30')
    await expect(output(page)).toContainText('You are an adult.', { timeout: 30000 })
    await expect(output(page)).toContainText('Next year you will be 31')
  },
}

/** quiz walks (three questions each), by unit id */
const QUIZ: Record<string, (page: Page) => Promise<void>> = {
  'html-basics': async (page) => {
    await match(page, [['<h1>', 'বড় শিরোনাম'], ['<p>', 'অনুচ্ছেদ'], ['<ul>', 'বুলেট-তালিকা'], ['<a href>', 'লিংক']])
    await checkAnswer(page)
    await finish(page)
    await answerChoice(page, '</p>')
    await finish(page)
    await orderItems(page, ['<ul> দিয়ে শুরু', '<li>Rice</li>', '<li>Dal</li>', '</ul> দিয়ে শেষ'])
    await checkAnswer(page)
    await finish(page)
  },
  'html-extras': async (page) => {
    await answerChoice(page, '<meta charset="utf-8">')
    await finish(page)
    await answerClick(page, 'alt="Tea"')
    await finish(page)
    await match(page, [['alt', 'ছবির বর্ণনা'], ['src', 'ছবির ফাইল'], ['<!-- -->', 'নিজের নোট'], ['utf-8', 'বাংলা ঠিক রাখে']])
    await checkAnswer(page)
    await finish(page)
  },
  css: async (page) => {
    await answerChoice(page, 'color: red;')
    await finish(page)
    await answerClick(page, 'font-size: 48px')
    await finish(page)
    await match(page, [['color', 'লেখার রং'], ['font-size', 'লেখার আকার'], ['margin', 'বাইরের ফাঁক'], ['padding', 'ভেতরের ফাঁক']])
    await checkAnswer(page)
    await finish(page)
  },
  'py-print': async (page) => {
    await predictQuiz(page, '12')
    await checkAnswer(page)
    await finish(page)
    await answerClick(page, 'prnt("Hi")')
    await finish(page)
    await answerChoice(page, 'Anika')
    await finish(page)
  },
  'py-input': async (page) => {
    await predictQuiz(page, '42')
    await checkAnswer(page)
    await finish(page)
    await answerChoice(page, 'লেখা (স্ট্রিং)')
    await finish(page)
    await match(page, [['+', 'যোগ'], ['*', 'গুণ'], ['/', 'ভাগ'], ['**', 'ঘাত']])
    await checkAnswer(page)
    await finish(page)
  },
  'py-logic': async (page) => {
    await answerChoice(page, 'if-এর ভেতরের লাইন চলে')
    await finish(page)
    await answerClick(page, 'if name ==')
    await finish(page)
    await predictQuiz(page, 'small')
    await checkAnswer(page)
    await finish(page)
  },
  'proj-web': async (page) => {
    await orderItems(page, ['index.html ফাইল খুলি', 'ট্যাগ দিয়ে লেখা লিখি', 'ফাইল সেভ করি', 'প্রিভিউ দেখে ঠিক করি'])
    await checkAnswer(page)
    await finish(page)
    await answerChoice(page, /<link rel="stylesheet"/)
    await finish(page)
    await answerClick(page, 'h1 { color: teal; }')
    await finish(page)
  },
  'proj-py': async (page) => {
    await predictQuiz(page, '18')
    await checkAnswer(page)
    await finish(page)
    await orderItems(page, ['নাম জিজ্ঞেস করি', 'বয়স জিজ্ঞেস করি', 'শুভেচ্ছা ছাপি', 'if / else দিয়ে সিদ্ধান্ত'])
    await checkAnswer(page)
    await finish(page)
    await match(page, [['input()', 'প্রশ্ন করে'], ['print()', 'পর্দায় ছাপে'], ['if / else', 'সিদ্ধান্ত নেয়'], ['int()', 'লেখা থেকে সংখ্যা']])
    await checkAnswer(page)
    await finish(page)
  },
}

/** a card the walk visits before the practice (checks the visuals render) */
const CARD_CHECKS: Record<string, (page: Page) => Promise<void>> = {
  'html-basics': async (page) => {
    await nextCard(page) // editor mock
    await expectNoScroll(page)
    await nextCard(page) // html-anatomy widget
    await expect(page.getByTestId('html-anatomy')).toBeVisible()
    await nextCard(page) // code: h1 / p / h2 with a live preview
    await expect(page.getByTestId('code-visual')).toBeVisible()
    await expect(page.getByTestId('code-output')).toBeVisible({ timeout: 8000 })
    await expectNoScroll(page)
  },
  css: async (page) => {
    await nextCard(page)
    await expect(page.getByTestId('html-anatomy')).toBeVisible()
  },
  'py-print': async (page) => {
    await nextCard(page) // print card
    await expect(page.getByTestId('code-visual')).toBeVisible()
    await expect(page.getByTestId('code-output')).toContainText('Hello, Python!', { timeout: 8000 })
    await expectNoScroll(page)
  },
  'py-input': async (page) => {
    await nextCard(page, 4) // code-trace widget
    await expect(page.getByTestId('code-trace')).toBeVisible()
  },
  'py-logic': async (page) => {
    await nextCard(page, 3) // if-else explorer
    await expect(page.getByTestId('if-else-explorer')).toBeVisible()
  },
}

async function playUnit(page: Page, os: 'windows' | 'mac', unitId: string, expectedStepsSoFar?: number) {
  const idx = UNIT_IDS.indexOf(unitId)
  await startUnit(page, idx)
  await expect(page.getByTestId('deck-hook')).toBeVisible()
  await CARD_CHECKS[unitId]?.(page)
  await skipToPractice(page)
  await expect(hw(page, 'code-editor')).toBeVisible({ timeout: 20000 })
  await expect(primary(page)).toBeDisabled()
  await PRACTICE[unitId](page, os)
  await expectPracticeDone(page)
  const saved = await savedProgress(page)
  for (const id of unitSteps(unitId)) expect(saved.modules['20'].stepsDone[os], id).toContain(id)
  if (expectedStepsSoFar !== undefined) expect(saved.modules['20'].stepsDone[os]).toHaveLength(expectedStepsSoFar)
  await nextCard(page) // to the quiz
  await QUIZ[unitId](page)
  expect(await slideKind(page)).toBe('celebrate')
}

const WIN_UNITS = UNIT_IDS.slice(0, 7) // the finale unit has its own test below
// Mac runs the units whose Mac-specific behaviour matters (saving with Cmd+S, typing, Python)
const MAC_UNITS = ['html-basics', 'css', 'py-print', 'proj-web']

for (const os of ['windows', 'mac'] as const) {
  for (const unitId of os === 'windows' ? WIN_UNITS : MAC_UNITS) {
    test(`Module 20 unit ${unitId} end to end (${os})`, async ({ page }) => {
      await seedProfile(page, os)
      // (the seed init-script also runs inside the sandboxed preview iframe, where localStorage is blocked: not an app error)
      const problems = watchProblems(page)
      await openModule(page, 20)
      await playUnit(page, os, unitId)
      expect(problems.filter((p) => !/sandboxed|img-src data:/.test(p))).toEqual([])
    })
  }
}

test('Module 20: the finale unit, module celebration, certificate 2 and the next-steps page', async ({ page }) => {
  const others = UNIT_IDS.slice(0, 7)
  const doneSteps = lesson.units.slice(0, 7).flatMap((u) => u.steps.map((s) => s.id))
  await seedProfile(page, 'windows', {
    modules: { 20: { stepsDone: { windows: doneSteps, mac: doneSteps }, explanationRead: true, unitsDone: others, unitQuiz: {}, freePracticeDone: true, realWorldChecked: [], completed: false } },
  })
  const problems = watchProblems(page)
  await openModule(page, 20)
  await playUnit(page, 'windows', 'proj-py')
  // module celebration
  await expect(page.getByTestId('deck-celebrate')).toContainText('পুরো পাঠ সম্পন্ন')
  const done = await savedProgress(page)
  expect(done.modules['20'].unitsDone).toEqual([...others, 'proj-py'])
  expect(done.modules['20'].completed).toBe(true)
  // real-world tasks sheet, certificate link and the roadmap link
  await page.getByTestId('real-world-toggle').click()
  await expect(page.getByText('python hello.py')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('link', { name: /পরের ধাপের পথ/ })).toBeVisible()
  await page.getByRole('link', { name: /সনদ.*দেখুন/ }).click()
  await expect(page).toHaveURL(/#\/certificate\/2/)
  await expect(page.getByLabel('সনদপত্র')).toContainText('রুমা')
  await expect(page.getByLabel('সনদপত্র')).toContainText('পর্ব ২')
  await page.getByRole('link', { name: /এরপর কোথায় যাব/ }).click()
  await expect(page).toHaveURL(/#\/next-steps/)
  await expect(page.getByTestId('ns-message')).toContainText('রুমা')
  await expect(page.getByTestId('ns-message')).toContainText('ওয়েবসাইট বানাতে চাই')
  await expect(page.getByTestId('habit-sheet').getByRole('checkbox')).toHaveCount(28)
  await expect(page.getByTestId('road-git')).toContainText('GitHub')
  // the home page now offers the card
  await page.goto('/#/')
  await expect(page.getByTestId('home-next-steps')).toBeVisible()
  expect(problems.filter((p) => !/sandboxed|img-src data:/.test(p))).toEqual([])
})

test('cheat sheets for HTML and Python render', async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/cheatsheet/html-basics')
  await expect(page.getByRole('heading', { name: 'প্রধান ট্যাগ' })).toBeVisible()
  await page.goto('/#/cheatsheet/python-basics')
  await expect(page.getByRole('heading', { name: 'শর্ত (if / else)' })).toBeVisible()
})
