import { expect, test, type Page } from '@playwright/test'
import { seedProfile } from './helpers'
import lesson from '../src/content/lessons/m20'

const SIM = '[data-sim-root]'
const hw = (page: Page, id: string) => page.locator(`${SIM} [data-coach="${id}"]`).first()
const cm = (page: Page) => page.locator(`${SIM} .cm-content`)
const frame = (page: Page) => page.frameLocator(`${SIM} [data-coach="code-preview"]`)
const ids = (chId: string, os: 'windows' | 'mac') => lesson.chapters!.find((c) => c.id === chId)!.steps.filter((s) => s.osVariant === os || s.osVariant === 'both').map((s) => s.id)

async function openChapter(page: Page, chapterId: string) {
  const ch = lesson.chapters!.find((c) => c.id === chapterId)!
  await page.goto('/#/module/20')
  await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
  await page.locator('li', { hasText: ch.titleBn }).getByRole('button', { name: /শুরু করি|আবার করি/ }).click()
  await page.getByRole('button', { name: /▶ শুরু করি/ }).click()
  await expect(hw(page, 'code-editor')).toBeVisible()
}

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
const predict = async (page: Page, answer: string) => {
  await page.getByLabel(/আপনার মনে হয় কী ছাপা হবে/).fill(answer)
  await page.getByRole('button', { name: 'উত্তর দিন' }).click()
}
const run = (page: Page) => hw(page, 'code-run').click()
const output = (page: Page) => hw(page, 'code-output')

async function expectChapterDone(page: Page, os: 'windows' | 'mac', chapterId: string) {
  await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible({ timeout: 20000 })
  const saved = await page.evaluate((o) => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['20'].stepsDone[o] as string[], os)
  for (const id of ids(chapterId, os)) expect(saved, id).toContain(id)
}

async function answerPrompt(page: Page, value: string) {
  const box = hw(page, 'code-input')
  await expect(box).toBeVisible({ timeout: 20000 })
  await box.fill(value)
  await hw(page, 'code-input-send').click()
}

type Walk = (page: Page, os: 'windows' | 'mac') => Promise<void>

const WALKS: Record<string, Walk> = {
  'html-1': async (page, os) => {
    await openFile(page, 'index.html')
    await expect(hw(page, 'code-preview')).toBeVisible()
    await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
    await endOfLine(page, 8)
    await typeText(page, '<h1>Hello, world</h1>')
    await expect(frame(page).locator('h1')).toHaveText('Hello, world')
    await typeText(page, '\n<p>I am learning to code.</p>')
    await typeText(page, '\n<h2>About me</h2>')
    await save(page, os)
  },
  'html-2': async (page, os) => {
    await openFile(page, 'index.html')
    await endOfLine(page, 9)
    await typeText(page, '<ul>\n<li>Rice</li>')
    await typeText(page, '\n<li>Dal</li>')
    await typeText(page, '\n</ul>')
    await expect(frame(page).locator('li')).toHaveCount(2)
    await typeText(page, '\n<a href="https://example.com">My link</a>')
    await save(page, os)
  },
  'html-3': async (page, os) => {
    await openFile(page, 'index.html')
    await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
    await expect(frame(page).locator('p')).toContainText('ক্ষ, স্ত, ন্দ')
    await endOfLine(page, 5)
    await typeText(page, '<meta charset="utf-8">')
    await endOfLine(page, 10)
    await typeText(page, '<img src="photo.jpg" alt="My photo">')
    await typeText(page, '\n<!-- my first image -->')
    await save(page, os)
  },
  'css-1': async (page, os) => {
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
    await save(page, os)
  },
  'css-2': async (page, os) => {
    await openFile(page, 'style.css')
    await endOfLine(page, 3)
    await typeText(page, 'background-color: lightyellow;')
    await typeText(page, '\nmargin: 40px;')
    await endOfLine(page, 8)
    await page.keyboard.press('ArrowUp') // the blank line inside p { }
    await page.keyboard.press('End')
    await typeText(page, 'background-color: white;')
    await typeText(page, '\npadding: 16px;')
    await save(page, os)
  },
  'py-1': async (page) => {
    await openFile(page, 'hello.py')
    await predict(page, 'Hello, Python!')
    await run(page)
    await expect(output(page)).toContainText('Hello, Python!', { timeout: 30000 })
    await endOfDoc(page)
    await typeText(page, 'print("My name is Rumi")')
    await run(page)
    await expect(output(page)).toContainText('My name is Rumi', { timeout: 30000 })
    await openFile(page, 'greet.py')
    await predict(page, 'hello, rumi') // wrong first (gentle nudge) ...
    await expect(page.getByText(/প্রায় হয়েছে/)).toBeVisible()
    await page.getByLabel(/আপনার মনে হয় কী ছাপা হবে/).fill('Hello, Rumi')
    await page.getByRole('button', { name: 'উত্তর দিন' }).click()
    await cm(page).click()
    await page.getByText('"Rumi"').first().dblclick() // select the name only
    await page.keyboard.type('Anika')
    await run(page)
    await expect(output(page)).toContainText('Hello, Anika', { timeout: 30000 })
  },
  'py-2': async (page) => {
    await openFile(page, 'ask.py')
    await run(page)
    await answerPrompt(page, 'Anika')
    await openFile(page, 'calc.py')
    await predict(page, '100')
    await run(page)
    await expect(output(page)).toContainText('3.5', { timeout: 30000 })
    await openFile(page, 'next.py')
    await predict(page, '31')
    await run(page)
    await answerPrompt(page, '30')
  },
  'py-3': async (page) => {
    await openFile(page, 'check.py')
    await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
    await predict(page, 'Adult')
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
  },
  'py-4': async (page) => {
    await openFile(page, 'loop.py')
    await predict(page, 'Hello 0')
    await run(page)
    await expect(output(page)).toContainText('Hello 2', { timeout: 30000 })
    await endOfLine(page, 1)
    await page.keyboard.press('Shift+Home')
    await page.keyboard.type('for i in range(5):')
    await run(page)
    await expect(output(page)).toContainText('Hello 4', { timeout: 30000 })
    await openFile(page, 'oops.py')
    await run(page)
    await expect(hw(page, 'code-error')).toBeVisible({ timeout: 30000 })
    await expect(hw(page, 'code-error')).toContainText('NameError')
    await endOfLine(page, 1)
    await page.keyboard.press('Shift+Home')
    await page.keyboard.type('print("Hello")')
    await run(page)
    await expect(output(page)).toContainText('Hello', { timeout: 30000 })
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

const FULL = ['html-1', 'html-2', 'html-3', 'css-1', 'css-2', 'py-1', 'py-2', 'py-3', 'py-4', 'proj-web', 'proj-py']
// Mac runs the chapters whose Mac-specific behaviour matters (saving with Cmd+S, typing, Python)
const MAC = ['html-1', 'css-1', 'py-1', 'proj-py']

for (const os of ['windows', 'mac'] as const) {
  for (const id of os === 'windows' ? FULL : MAC) {
    test(`Module 20 chapter ${id} walkthrough (${os})`, async ({ page }) => {
      await seedProfile(page, os)
      const errors: string[] = []
      // (the seed init-script also runs inside the sandboxed preview iframe, where localStorage is blocked: not an app error)
      page.on('pageerror', (e) => !/sandboxed/.test(String(e)) && errors.push(String(e)))
      await openChapter(page, id)
      await WALKS[id](page, os)
      await expectChapterDone(page, os, id)
      expect(errors).toEqual([])
    })
  }
}

test('Module 20: quiz, completion, certificate 2 and the next-steps page', async ({ page }) => {
  const all = lesson.chapters!.flatMap((c) => c.steps.map((s) => s.id))
  await seedProfile(page, 'windows', {
    modules: { 20: { stepsDone: { windows: all, mac: all }, explanationRead: true, freePracticeDone: true, realWorldChecked: [], completed: false } },
  })
  await page.goto('/#/module/20')
  await expect(page.getByRole('heading', { name: 'প্রথম কোড' })).toBeVisible()
  // explanation widgets render
  await expect(page.getByTestId('html-anatomy').first()).toBeVisible()
  await expect(page.getByTestId('code-trace')).toBeVisible()
  await page.getByRole('button', { name: /৪ কুইজ/ }).click()
  // q1 predict
  await page.getByRole('textbox').fill('12')
  await page.getByRole('button', { name: /যাচাই করুন|উত্তর দিন/ }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  // q2 drag-match (tap, tap)
  for (const [chip, slot] of [['বড় শিরোনাম', '<h1>'], ['অনুচ্ছেদ', '<p>'], ['বুলেট-তালিকা', '<ul>'], ['লিংক', '<a href="…">'], ['ছবি', '<img alt="…">']]) {
    await page.getByRole('button', { name: chip, exact: true }).click()
    await page.getByRole('button', { name: new RegExp(`^${slot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} — এখানে বসান`) }).click()
  }
  await page.getByRole('button', { name: 'যাচাই করুন' }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  // q3 multiple choice
  await page.getByLabel('color: red;').check()
  await page.getByRole('button', { name: 'উত্তর দিন' }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  // q4 ordering
  const want = ['index.html ফাইল খুলি', 'ট্যাগ দিয়ে শিরোনাম', 'ফাইলটি সেভ করি', 'প্রিভিউতে ফল']
  for (let i = 0; i < want.length; i++) {
    for (let guard = 0; guard < 6; guard++) {
      const items = await page.locator('ol > li').allInnerTexts()
      const cur = items.findIndex((t) => t.includes(want[i]))
      if (cur <= i) break
      await page.locator('ol > li').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
    }
  }
  await page.getByRole('button', { name: 'যাচাই করুন' }).click()
  await page.getByRole('button', { name: /পরের প্রশ্ন/ }).click()
  // q5 click the mistake (wrong first)
  await page.getByRole('button', { name: /লাইন ১/ }).click()
  await expect(page.getByText(/একটু আবার ভেবে দেখি/)).toBeVisible()
  await page.getByRole('button', { name: /লাইন ২/ }).click()
  await page.getByRole('button', { name: /কুইজ শেষ করি/ }).click()
  const q = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['20'].quiz)
  expect(q.total).toBe(5)
  expect(q.score).toBe(4)

  await page.getByRole('button', { name: /৭ শেষ/ }).click()
  await page.getByRole('button', { name: /পাঠ সম্পন্ন করি/ }).click()
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
})

test('cheat sheets for HTML and Python render', async ({ page }) => {
  await seedProfile(page, 'windows')
  await page.goto('/#/cheatsheet/html-basics')
  await expect(page.getByRole('heading', { name: 'প্রধান ট্যাগ' })).toBeVisible()
  await page.goto('/#/cheatsheet/python-basics')
  await expect(page.getByRole('heading', { name: 'শর্ত (if / else)' })).toBeVisible()
})
