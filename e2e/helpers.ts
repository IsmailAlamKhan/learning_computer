/**
 * E2E helpers. Two groups:
 *
 * A) Cards-format lessons (the new one-card-at-a-time deck; module 2 is the reference, see e2e/module2*.spec.ts)
 *    seedProfile(page, os, extra?)   seeds a finished onboarding; `extra.input` = 'mouse' (default) | 'touchpad', other keys (modules, settings…) are merged
 *    openModule(page, n)             opens /#/module/n and waits for the deck (units overview or the first card)
 *    startUnit(page, i = 0, resume?) from the units overview start unit i (does nothing for single-unit modules); a half-finished unit shows "continue where you left off": resume = 'restart' (default) | 'continue' | 'show'
 *    slideKind(page)                 'hook' | 'card' | 'practice' | 'quiz' | 'celebrate' — what is on screen now
 *    nextCard(page, times = 1)       press the big primary button "পরের ধাপ →" (also works on practice once finished, and after a right quiz answer)
 *    goBack(page)                    press the small ← button
 *    skipToPractice(page)            press next until the practice slide (alias startPractice)
 *    expectNoScroll(page)            asserts the current card needs no vertical scrolling (the deck's #1 rule)
 *    coach(page, id)                 an element of the simulated computer by its data-coach id (click it, dblclick it, dragTo it …)
 *    continueStep(page)              press "বুঝেছি →" in the coach bubble (steps of type `continue`)
 *    expectPracticeDone(page)        waits for the green "সব ধাপ শেষ" banner
 *    finishQuiz-helpers (one question per screen; a question is "done" when the green feedback shows):
 *      answerChoice(page, text|RegExp)      multipleChoice (single or multi: tap an option; for multi call it for every option, then checkAnswer)
 *      answerClick(page, text|RegExp)       clickTarget (tap the item)
 *      matchPairs(page, [[leftLabel, rightLabel], …])   dragMatch via tap-then-tap; then checkAnswer
 *      orderItems(page, [text, …])          ordering: moves items with the ↑ buttons into this order; then checkAnswer
 *      predict(page, text)                  predictOutput: types the answer; then checkAnswer
 *      checkAnswer(page)                    the primary button "যাচাই করুন"
 *      expectWrong(page) / expectRight(page)  the gentle hint box / the green ✓ box
 *    savedProgress(page)             the parsed progress JSON from localStorage
 *
 * B) Legacy lessons (old sectioned page; removed with the migration): startGuided, cont.
 *
 * Both: watchProblems(page) collects page errors / console errors / CSP violations; runDemoCode(page) for /#/demo/tools.
 * Text matching tip: the deck shows numbers per the learner's numeral setting; seedProfile uses western digits ("3 / 17").
 */
import { expect, type Locator, type Page } from '@playwright/test'

export async function seedProfile(page: Page, os: 'windows' | 'mac', extra: Record<string, unknown> = {}) {
  const { input = 'mouse', extras = {}, ...others } = extra as { input?: 'mouse' | 'touchpad'; extras?: Record<string, unknown> } & Record<string, unknown>
  // pin the pointing device: otherwise the app's automatic mouse/touchpad detection may switch it while the test clicks
  const rest = { ...others, extras: { inputManual: true, ...extras } }
  await page.addInitScript(
    ([o, ex, inp]) => {
      try {
        if (localStorage.getItem('computer-shikhi:v1')) return
      } catch {
        return // sandboxed preview iframes have no localStorage
      }
      localStorage.setItem(
        'computer-shikhi:v1',
        JSON.stringify({ version: 1, profile: { name: 'রুমা', os: o, input: inp, autoDetected: true, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { numerals: 'western', unlockAll: true }, modules: {}, ...(ex as object) }),
      )
    },
    [os, rest, input] as const,
  )
}

export const coach = (page: Page, id: string) => page.locator(`[data-sim-root] [data-coach="${id}"]`).first()

// ---------------------------------------------------------------------------------------------
// cards format
// ---------------------------------------------------------------------------------------------

export const primary = (page: Page) => page.getByTestId('deck-primary')

export async function openModule(page: Page, module: number) {
  await page.goto(`/#/module/${module}`)
  await expect(page.getByTestId('units-overview').or(page.getByTestId('deck-root'))).toBeVisible({ timeout: 20_000 })
}

/**
 * `resume`: what to do when the unit was left half-way ("continue where you left off" screen):
 * 'restart' (default: start from the first card), 'continue' (carry on), 'show' (leave the screen for the test to look at).
 */
export async function startUnit(page: Page, unit = 0, resume: 'restart' | 'continue' | 'show' = 'restart') {
  const overview = page.getByTestId('units-overview')
  const prompt = page.getByTestId('deck-resume')
  await expect(overview.or(prompt).or(page.getByTestId('deck-root'))).toBeVisible({ timeout: 20_000 }) // the lesson loads lazily
  if (await overview.isVisible()) await page.getByTestId(`unit-card-${unit}`).click()
  await expect(page.getByTestId('deck-hook').or(prompt)).toBeVisible()
  if (await prompt.isVisible()) {
    if (resume === 'restart') await page.getByTestId('deck-restart').click()
    if (resume === 'continue') await primary(page).click()
  }
  if (resume !== 'show') await expect(page.getByTestId('deck-slide')).toBeVisible()
}

export const slideKind = async (page: Page) => (await page.getByTestId('deck-slide').getAttribute('data-kind')) ?? ''

export async function nextCard(page: Page, times = 1) {
  for (let i = 0; i < times; i++) {
    await expect(primary(page)).toBeEnabled()
    const before = await page.getByTestId('deck-slide').getAttribute('data-slide-id')
    await primary(page).click()
    await expect(page.getByTestId('deck-slide')).not.toHaveAttribute('data-slide-id', before ?? '')
  }
}

export async function goBack(page: Page) {
  await page.getByTestId('deck-back').click()
}

/** Press next until the practice slide (the simulated computer) is on screen. */
export async function skipToPractice(page: Page) {
  for (let i = 0; i < 12 && (await slideKind(page)) !== 'practice'; i++) await nextCard(page)
  await expect(page.getByTestId('deck-practice')).toBeVisible()
  await expect(page.locator('[data-sim-root]')).toBeVisible({ timeout: 20_000 })
}
export const startPractice = skipToPractice

export async function expectPracticeDone(page: Page) {
  await expect(page.getByTestId('practice-success')).toBeVisible({ timeout: 15_000 })
}

export async function continueStep(page: Page) {
  await page.getByTestId('coach-bubble').getByRole('button', { name: /বুঝেছি/ }).click()
}

/** The card area must not need vertical scrolling (no scrollbar inside the slide) — except inside an "আরও জানুন" sheet or a widget. */
export async function expectNoScroll(page: Page) {
  const r = await page.evaluate(() => {
    const body = document.querySelector<HTMLElement>('[data-testid="deck-slide"] .deck-body')
    const slide = document.querySelector<HTMLElement>('[data-testid="deck-slide"]')
    return { body: body ? body.scrollHeight - body.clientHeight : 0, slide: slide ? slide.scrollHeight - slide.clientHeight : 0 }
  })
  expect(r.body, 'card body scrolls').toBeLessThanOrEqual(1)
  expect(r.slide, 'slide scrolls').toBeLessThanOrEqual(1)
}

// ----- quiz (one question per screen) -----

const named = (t: string | RegExp) => (typeof t === 'string' ? new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : t)
export const quizOption = (page: Page, text: string | RegExp): Locator => page.getByTestId('quiz-option').filter({ hasText: named(text) })

export async function answerChoice(page: Page, text: string | RegExp) {
  await quizOption(page, text).click()
}
export const answerClick = answerChoice

export async function matchPairs(page: Page, pairs: [string, string][]) {
  for (const [left, right] of pairs) {
    await page.getByTestId('match-chip').filter({ hasText: new RegExp(`^${right}$`) }).click()
    await page.getByTestId('match-slot').and(page.getByRole('button', { name: new RegExp(`^${left} — এখানে বসান`) })).click()
  }
}

export async function orderItems(page: Page, want: string[]) {
  for (let i = 0; i < want.length; i++) {
    for (let guard = 0; guard < want.length + 2; guard++) {
      const items = await page.getByTestId('order-item').allInnerTexts()
      const cur = items.findIndex((t) => t.includes(want[i]))
      if (cur <= i) break
      await page.getByTestId('order-item').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
    }
  }
}

export async function predict(page: Page, text: string) {
  await page.getByTestId('predict-input').fill(text)
}

export async function checkAnswer(page: Page) {
  await primary(page).filter({ hasText: /যাচাই করুন/ }).click()
}

export const expectWrong = (page: Page) => expect(page.getByTestId('quiz-wrong')).toBeVisible()
export const expectRight = (page: Page) => expect(page.getByTestId('quiz-right')).toBeVisible()

export const savedProgress = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1') ?? 'null'))

// ---------------------------------------------------------------------------------------------
// legacy lessons (old sectioned page) — removed once every module is migrated
// ---------------------------------------------------------------------------------------------

export async function startGuided(page: Page, module: number) {
  await page.goto(`/#/module/${module}`)
  await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
  await page.getByRole('button', { name: /শুরু করি/ }).click()
}

export async function cont(page: Page) {
  await page.getByRole('button', { name: /বুঝেছি/ }).click()
}

/** Collects uncaught page errors, console errors and CSP violations; assert `expect(problems).toEqual([])` at the end of a flow. */
export function watchProblems(page: Page): string[] {
  const problems: string[] = []
  page.on('pageerror', (e) => problems.push(`pageerror: ${e}`))
  page.on('console', (m) => {
    if (m.type() === 'error' || /Content[- ]Security[- ]Policy|Refused to/i.test(m.text())) problems.push(`console.${m.type()}: ${m.text()}`)
  })
  return problems
}

/** Run the demo editor's `hello.js` and `hello.py` (the page /#/demo/tools must be open). */
export async function runDemoCode(page: Page) {
  const sim = '[data-sim-root]'
  await page.locator(`${sim} [data-coach="code-explorer-hello.js"]`).click()
  await page.locator(`${sim} [data-coach="code-run"]`).click()
  const out = page.locator(`${sim} [data-coach="code-output"]`)
  await page.waitForFunction(() => document.querySelector('[data-coach="code-output"]')?.textContent?.includes('এটি আমার প্রথম প্রোগ্রাম'), null, { timeout: 15_000 })
  await page.locator(`${sim} [data-coach="code-explorer-hello.py"]`).click()
  await page.locator(`${sim} [data-coach="code-run"]`).click()
  const box = page.locator(`${sim} [data-coach="code-input"]`)
  await box.waitFor({ timeout: 90_000 }) // first Python run loads the runtime
  await box.fill('রিনা')
  await page.locator(`${sim} [data-coach="code-input-send"]`).click()
  await page.waitForFunction(() => document.querySelector('[data-coach="code-output"]')?.textContent?.includes('স্বাগতম, রিনা'), null, { timeout: 90_000 })
  return out
}
