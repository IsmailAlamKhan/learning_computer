import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  checkAnswer,
  coach,
  expectNoScroll,
  expectPracticeDone,
  expectRight,
  expectWrong,
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
import lesson from '../src/content/lessons/m16'

/** Module 16 (computational thinking, no code): four units, each hook -> cards -> practice -> 3 questions -> celebration. */

type OS = 'windows' | 'mac'

const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** like helpers.matchPairs, but safe for labels containing ? ( ) */
async function matchPairsEsc(page: Page, pairs: [string, string][]) {
  for (const [left, right] of pairs) {
    await page.getByTestId('match-chip').filter({ hasText: new RegExp(`^${esc(right)}$`) }).click()
    await page.getByTestId('match-slot').and(page.getByRole('button', { name: new RegExp(`^${esc(left)}[^—]* — এখানে বসান`) })).click()
  }
}

/** open the editor (Notepad / TextEdit), write, save as `file`, close */
async function editorFlow(page: Page, os: OS, text: string, file: string) {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
  } else {
    await coach(page, 'menubar-search').click()
    await coach(page, 'spotlight-input').fill('TextEdit')
    await coach(page, 'spotlight-result-0').click()
  }
  await coach(page, 'editor-text').fill(text)
  if (os === 'windows') await coach(page, 'editor-menu-file').click()
  await coach(page, 'editor-save').click()
  await coach(page, 'save-dialog-name').fill(file)
  await coach(page, 'save-dialog-save').click()
  await coach(page, 'win-editor-close').click()
}

async function unit1Practice(page: Page, os: OS) {
  await editorFlow(page, os, '1. Boil water\n2. Add tea leaves\n3. Wait 3 minutes\n4. Pour into a cup', 'tea.txt')
}
async function unit2Practice(page: Page, os: OS) {
  await editorFlow(page, os, 'If it rains, take an umbrella', 'rule.txt')
}
async function unit3Practice(page: Page, os: OS) {
  if (os === 'windows') {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-files').click()
  } else {
    await coach(page, 'dock-launchpad').click()
    await coach(page, 'launchpad-app-files').click()
  }
  await coach(page, 'fm-sidebar-Documents').click()
  for (const n of [1, 2, 3]) await coach(page, `fm-item-cup${n}.txt`).click()
  await coach(page, 'win-files-close').click()
}
async function unit4Practice(page: Page, os: OS) {
  await editorFlow(page, os, 'Rice\nDal\nCurry', 'lunch.txt')
}

async function unit1Quiz(page: Page, firstTryWrong: boolean) {
  await orderItems(page, ['কার্ড মেশিনে', 'গোপন পিন', 'কত টাকা', 'মেশিন থেকে টাকা', 'কার্ড ফেরত'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  if (firstTryWrong) {
    await answerChoice(page, 'মেশিনের রং')
    await expectWrong(page)
  }
  await answerChoice(page, /কার্ড, পিন ও টাকার পরিমাণ/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /কতটুকু, তা বলা নেই/)
  await expectRight(page)
  await nextCard(page)
}
async function unit2Quiz(page: Page) {
  await answerChoice(page, /যদি বৃষ্টি হয় তবেই ছাতা/)
  await expectRight(page)
  await nextCard(page)
  await matchPairsEsc(page, [['“বৃষ্টি হচ্ছে?”', 'শর্ত'], ['উত্তর “হ্যাঁ”', 'সত্য (True)'], ['উত্তর “না”', 'মিথ্যা (False)']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /পিন কি ঠিক আছে/)
  await expectRight(page)
  await nextCard(page)
}
async function unit3Quiz(page: Page) {
  await answerChoice(page, /যতক্ষণ না ভাত নরম হয়/)
  await expectRight(page)
  await nextCard(page)
  await matchPairsEsc(page, [['“৫ বার চামচ নাড়ুন”', 'নির্দিষ্ট বার'], ['“যতক্ষণ না ভাত নরম হয়”', 'শর্ত না মেলা পর্যন্ত'], ['বেরোনোর শর্ত কখনো মেলে না', 'অসীম লুপ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /বেরোনোর শর্ত কখনো মেলে না/)
  await expectRight(page)
  await nextCard(page)
}
async function unit4Quiz(page: Page) {
  await matchPairsEsc(page, [['“আগে পানি ফোটান', 'ক্রম'], ['“যদি বৃষ্টি হয়', 'সিদ্ধান্ত'], ['“প্রতিটি কাপে', 'লুপ'], ['“অতিথির খাবার', 'ছোট ধাপে ভাগ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['কড়াইয়ে তেল', 'ডিম ফেটিয়ে', 'তেল গরম হলে', 'এক পাশ হলে', 'সোনালি হলে'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, 'হীরা')
  await expectRight(page)
  await nextCard(page)
}

const practice = [unit1Practice, unit2Practice, unit3Practice, unit4Practice] as const
const quiz = [unit1Quiz, unit2Quiz, unit3Quiz, unit4Quiz] as const
/** slide index of the widget card inside each unit (hook = 0) */
const WIDGET_AT = [2, 2, 2, 3]
const WIDGET_IDS = ['order-puzzle', 'if-else-explorer', 'loop-counter', 'flowchart-builder']

/** open unit `i` and move onto its widget card */
async function toWidget(page: Page, i: number) {
  await openModule(page, 16)
  await startUnit(page, i)
  await nextCard(page, WIDGET_AT[i])
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 16: all four units end to end (${os})`, async ({ page }) => {
    await seedProfile(page, os)
    const problems = watchProblems(page)
    await openModule(page, 16)
    await expect(page.getByTestId('units-overview')).toBeVisible()
    const ids = lesson.units.map((u) => u.id)
    for (let i = 0; i < 4; i++) {
      if (i === 0) await startUnit(page, 0)
      else {
        await primary(page).click() // from the previous celebration to the next unit
        await expect(page.getByTestId('deck-hook')).toBeVisible()
      }
      await nextCard(page, WIDGET_AT[i])
      await expect(page.getByTestId(WIDGET_IDS[i])).toBeVisible({ timeout: 15_000 })
      await skipToPractice(page)
      await expect(primary(page)).toBeDisabled() // cannot skip the practice
      await practice[i](page, os)
      await expectPracticeDone(page)
      await nextCard(page)
      expect(await slideKind(page)).toBe('quiz')
      await quiz[i](page, i === 0)
      expect(await slideKind(page)).toBe('celebrate')
      const saved = await savedProgress(page)
      expect(saved.modules['16'].unitsDone).toEqual(ids.slice(0, i + 1))
      if (i === 0) expect(saved.modules['16'].unitQuiz.sequence).toMatchObject({ score: 2, total: 3 })
    }
    const done = await savedProgress(page)
    expect(done.modules['16'].completed).toBe(true)
    const want = lesson.units.flatMap((u) => u.steps).filter((s) => s.osVariant === os).map((s) => s.id)
    expect(done.modules['16'].stepsDone[os]).toEqual(want)
    expect(problems).toEqual([])
  })
}

test('Module 16 content: four units, three questions each, steps within budget', () => {
  expect(lesson.units.map((u) => u.id)).toEqual(['sequence', 'decision', 'loop', 'decompose'])
  for (const u of lesson.units) {
    expect(u.quiz).toHaveLength(3)
    for (const os of ['windows', 'mac']) expect(u.steps.filter((s) => s.osVariant === os || s.osVariant === 'both').length).toBeLessThanOrEqual(15)
  }
})

test('every non-widget card of module 16 fits without scrolling (desktop and phone)', async ({ page }) => {
  await seedProfile(page, 'windows')
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    await page.setViewportSize({ width: w, height: h })
    for (let u = 0; u < 4; u++) {
      await openModule(page, 16)
      await startUnit(page, u)
      for (let i = 0; i <= lesson.units[u].cards.length; i++) {
        if (i !== WIDGET_AT[u]) await expectNoScroll(page)
        if (i < lesson.units[u].cards.length) await nextCard(page)
      }
      await page.goto('/#/')
    }
  }
})

test.describe('Module 16 widgets', () => {
  test.beforeEach(async ({ page }) => {
    // tall viewport: the drag tests need the whole widget on screen
    await page.setViewportSize({ width: 1280, height: 1500 })
    await seedProfile(page, 'windows')
  })

  test('order puzzle: drag and drop, buttons, and gentle feedback', async ({ page }) => {
    await toWidget(page, 0)
    const w = page.getByTestId('order-puzzle')
    await expect(w).toBeVisible()
    await w.scrollIntoViewIfNeeded()
    // initially wrong -> gentle message, no success
    await w.getByTestId('op-check').click()
    await expect(w.getByTestId('op-feedback')).toBeVisible()
    await expect(w.getByTestId('op-success')).toHaveCount(0)

    const rowOf = async (id: string) => {
      const items = await w.locator('[data-step]').evaluateAll((els) => els.map((e) => e.getAttribute('data-step')))
      return items.indexOf(id)
    }
    const ids = ['tea1', 'tea2', 'tea3', 'tea4', 'tea5']
    // solve with real pointer drags: put each step on the row of its target index
    for (let target = 0; target < ids.length; target++) {
      if ((await rowOf(ids[target])) === target) continue
      const src = await w.getByTestId(`op-item-${ids[target]}`).boundingBox()
      const dst = await w.getByTestId(`op-row-${target}`).boundingBox()
      await page.mouse.move(src!.x + 80, src!.y + src!.height / 2)
      await page.mouse.down()
      await page.mouse.move(src!.x + 90, src!.y + src!.height / 2 + 10, { steps: 3 })
      await page.mouse.move(dst!.x + 120, dst!.y + dst!.height / 2, { steps: 8 })
      await page.mouse.up()
    }
    await w.getByTestId('op-check').click()
    await expect(w.getByTestId('op-success')).toContainText('ঠিক ক্রম')

    // another puzzle, solved with the arrow buttons only
    await w.getByTestId('op-picker-teeth').click()
    const t = ['teeth1', 'teeth2', 'teeth3', 'teeth4']
    for (let target = 0; target < t.length; target++) {
      for (let guard = 0; guard < 6; guard++) {
        const items = await w.locator('[data-step]').evaluateAll((els) => els.map((e) => e.getAttribute('data-step')))
        if (items.indexOf(t[target]) <= target) break
        await w.getByTestId(`op-up-${t[target]}`).click()
      }
    }
    await w.getByTestId('op-check').click()
    await expect(w.getByTestId('op-success')).toBeVisible()
  })

  test('if-else explorer and loop counter', async ({ page }) => {
    await toWidget(page, 1)
    const ie = page.getByTestId('if-else-explorer')
    await ie.scrollIntoViewIfNeeded()
    await expect(ie.getByTestId('ie-outcome')).toContainText('ছাতা লাগবে না')
    await ie.getByTestId('ie-toggle-rain').click()
    await expect(ie.getByTestId('ie-outcome')).toContainText('ছাতা নিন')
    await ie.getByTestId('ie-scenario-atm').click()
    await ie.getByTestId('ie-toggle-pin').click()
    await expect(ie.getByTestId('ie-outcome')).toContainText('পিন ভুল')

    await page.goto('/#/')
    await toWidget(page, 2)
    const lc = page.getByTestId('loop-counter')
    await lc.scrollIntoViewIfNeeded()
    await lc.getByTestId('lc-step').click()
    await lc.getByTestId('lc-step').click()
    await expect(lc.getByTestId('lc-status')).toContainText('আরও 3 বার বাকি')
    await lc.getByTestId('lc-play').click()
    await expect(lc.getByTestId('lc-status')).toContainText('লুপ শেষ', { timeout: 6000 })
    await lc.getByTestId('lc-answer').fill('5')
    await lc.getByTestId('lc-check').click()
    await expect(lc.getByTestId('lc-wrong')).toBeVisible()
    await lc.getByTestId('lc-answer').fill('6')
    await lc.getByTestId('lc-check').click()
    await expect(lc.getByTestId('lc-right')).toBeVisible()
  })

  test('flowchart builder: drag blocks, click-to-connect, check challenge 1', async ({ page }) => {
    await toWidget(page, 3)
    const fc = page.getByTestId('flowchart-builder')
    await fc.scrollIntoViewIfNeeded()
    const canvas = fc.getByTestId('fc-canvas')

    // start by dragging a block from the palette onto the canvas
    const pal = await fc.getByTestId('fc-add-start').boundingBox()
    const cv = await canvas.boundingBox()
    await page.mouse.move(pal!.x + 20, pal!.y + 20)
    await page.mouse.down()
    await page.mouse.move(pal!.x + 40, pal!.y + 30, { steps: 3 })
    await page.mouse.move(cv!.x + 200, cv!.y + 60, { steps: 8 })
    await page.mouse.up()
    await expect(fc.getByTestId('fc-block-b1')).toHaveAttribute('data-kind', 'start')

    // the rest: tapping the palette appends
    for (const k of ['decision', 'action', 'action', 'end']) await fc.getByTestId(`fc-add-${k}`).click()
    const label = async (id: string, text: string) => {
      await fc.getByTestId(`fc-block-${id}`).click()
      await fc.getByTestId('fc-label').fill(text)
    }
    await label('b2', 'বৃষ্টি হচ্ছে?')
    await label('b3', 'ছাতা নিন')
    await label('b4', 'রওনা দিন') // a label that is not one of the standard names

    // the first time: leave a branch out -> specific hint
    const connectPorts = async (from: string, port: string, to: string) => {
      await fc.getByTestId(`fc-port-${from}-${port}`).click()
      await expect(fc.getByTestId('fc-connecting')).toBeVisible()
      await fc.getByTestId(`fc-block-${to}`).click()
    }
    await connectPorts('b1', 'next', 'b2')
    await connectPorts('b2', 'yes', 'b3')
    await connectPorts('b3', 'next', 'b4')
    await connectPorts('b4', 'next', 'b5')
    await expect(fc.getByTestId('fc-edge-b1-next-b2')).toBeVisible()
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-hints')).toContainText('“না” দিকটি')

    // finish: the "no" exit goes straight to "go"
    await fc.getByTestId('fc-block-b2').click()
    await fc.getByTestId('fc-next-no').selectOption('b4')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-hints')).toContainText('অর্থ')
    await fc.getByTestId('fc-block-b2').click()
    // set the meanings
    // standard labels got their meaning automatically; the custom one needs it chosen
    await fc.getByTestId('fc-block-b4').click()
    await fc.getByTestId('fc-ref').selectOption('go')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-success')).toContainText('দারুণ')
    await expect(fc.getByTestId('fc-outline')).toContainText('সিদ্ধান্ত')
  })

  test('flowchart builder: loop challenge shows an infinite-loop hint, solution fixes it; free mode run', async ({ page }) => {
    await toWidget(page, 3)
    const fc = page.getByTestId('flowchart-builder')
    await fc.scrollIntoViewIfNeeded()
    await fc.getByTestId('fc-mode-tea-loop').click()
    // two failed checks reveal the solution button
    await fc.getByTestId('fc-check').click()
    await fc.getByTestId('fc-check').click()
    await fc.getByTestId('fc-solution').click()
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-success')).toBeVisible()
    // break the loop: make "reheat" point at itself
    await fc.getByTestId('fc-block-b4').click()
    await fc.getByTestId('fc-next-next').selectOption('b4')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-hints')).toContainText('অসীম লুপ')

    // free mode: build Start -> End and walk it
    await fc.getByTestId('fc-mode-free').click()
    await fc.getByTestId('fc-add-start').click()
    await fc.getByTestId('fc-add-end').click()
    await fc.getByTestId('fc-block-b1').click()
    await fc.getByTestId('fc-next-next').selectOption('b2')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-free-feedback')).toContainText('ঠিক আছে')
    await fc.getByTestId('fc-run').click()
    await fc.getByTestId('fc-run-next').click()
    await expect(fc.getByTestId('fc-run-panel')).toContainText('শেষ হলো')
  })
})
