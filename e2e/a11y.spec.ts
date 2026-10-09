import { expect, test, type Page } from '@playwright/test'
import lesson from '../src/content/lessons/m01'
import { buildSlides } from '../src/engine/deck'
import type { Lesson, QuizQuestion, Unit } from '../src/engine/types'
import { openModule, startUnit, skipToPractice, quizOption } from './helpers'
import { mockPlatform } from './platform'
import { axeScan, fmtViolations, seedA11y, type TextSize, type Theme } from './a11y-util'

const PAGES = [
  '/', '/settings', '/glossary', '/notebook', '/cheatsheets', '/cheatsheet/keyboard-shortcuts', '/cheatsheet/safety-checklist',
  '/cheatsheet/terminal-commands', '/cheatsheet/setup-checklist', '/cheatsheet/html-basics', '/cheatsheet/python-basics',
  '/certificate/1', '/certificate/2', '/next-steps', '/teacher', '/demo/tools',
]
const COMBOS: [Theme, TextSize][] = [['light', 'normal'], ['dark', 'normal'], ['light', 'xxlarge'], ['dark', 'xxlarge']]

const loadLesson = async (m: number): Promise<Lesson> => (await import(`../src/content/lessons/m${String(m).padStart(2, '0')}`)).default

/** Open a unit of a module at a given slide: writes the saved deck position, reloads and "continues where she left off". */
async function openAt(page: Page, m: number, unitIdx: number, unit: Unit, index: number) {
  await page.evaluate(
    ([key, idx]) => {
      const d = JSON.parse(localStorage.getItem('computer-shikhi:v1') ?? '{}')
      d.extras = { ...(d.extras ?? {}), [key]: { index: idx } }
      localStorage.setItem('computer-shikhi:v1', JSON.stringify(d))
    },
    [`deck:${m}:${unit.id}`, index] as const,
  )
  await page.goto(`/#/module/${m}`)
  await page.reload()
  await startUnit(page, unitIdx, index > 0 ? 'continue' : 'restart')
}

for (const [theme, size] of COMBOS) {
  test.describe(`axe ${theme} / ${size}`, () => {
    test('app pages have no serious or critical violations', async ({ page }) => {
      test.setTimeout(240_000)
      await seedA11y(page, { theme, textSize: size })
      const bad: string[] = []
      for (const p of PAGES) {
        await page.goto('/#' + p)
        await expect(page.locator('main h1, main h2').first()).toBeVisible()
        const v = await axeScan(page)
        if (v.length) bad.push(`${p}\n${fmtViolations(v)}`)
      }
      expect(bad.join('\n\n')).toBe('')
    })

    test('module decks (units overview, hook, widget cards, practice, quiz, celebration) are clean', async ({ page }) => {
      test.setTimeout(900_000)
      await page.emulateMedia({ reducedMotion: 'reduce' }) // no mid-transition colours while axe measures contrast
      await seedA11y(page, { theme, textSize: size })
      const bad: string[] = []
      const scan = async (label: string) => {
        const v = await axeScan(page)
        if (v.length) bad.push(`${label}\n${fmtViolations(v)}`)
      }
      // a spread of modules covering most widgets and every quiz type
      const mods = size === 'normal' ? [1, 2, 5, 9, 14, 16, 19] : [3, 4, 8, 12, 15, 17, 20]
      for (const m of mods) {
        await openModule(page, m)
        const l = await loadLesson(m)
        if (l.units.length > 1) await scan(`module ${m} units overview`)
        for (const [ui, unit] of l.units.entries()) {
          const slides = buildSlides(unit, { os: 'windows', input: 'mouse' })
          // hook, every widget card, the practice (simulated computer excluded from axe), the first quiz question and the celebration
          const at = (pred: (s: (typeof slides)[number]) => boolean) => slides.map((x, i) => (pred(x) ? i : -1)).filter((i) => i >= 0)
          const wanted = [0, ...at((x) => x.kind === 'card' && x.card.visual.kind === 'widget'), ...at((x) => x.kind === 'practice').slice(0, 1), ...at((x) => x.kind === 'quiz').slice(0, 1), slides.length - 1]
          for (const idx of [...new Set(wanted)]) {
            await openAt(page, m, ui, unit, idx)
            await page.waitForTimeout(idx === 0 ? 100 : 500)
            await scan(`module ${m} / unit ${unit.id} / slide ${idx} (${slides[idx].kind})`)
          }
        }
      }
      expect(bad.join('\n\n')).toBe('')
    })

    test('onboarding, help dialog and locked roadmap are clean', async ({ page }) => {
      await seedA11y(page, { theme, textSize: size, onboarded: false })
      await page.addInitScript(([t, s]) => {
        // theme / text size also apply before onboarding (stored settings only; profile stays un-onboarded)
        document.documentElement.dataset.theme = t
        document.documentElement.dataset.text = s
      }, [theme, size] as const)
      await page.goto('/#/welcome')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(fmtViolations(await axeScan(page))).toBe('')
      await page.getByRole('textbox').fill('রুমা')
      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: /পরের ধাপ/ }).click()
        expect(fmtViolations(await axeScan(page))).toBe('')
      }
      await page.getByRole('button', { name: /শুরু করি/ }).click()
      await expect(page).toHaveURL(/#\/$/)
      // roadmap with locked modules (unlockAll off)
      expect(fmtViolations(await axeScan(page))).toBe('')
      await page.getByRole('button', { name: /সাহায্য/ }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      expect(fmtViolations(await axeScan(page))).toBe('')
    })
  })
}

test.describe('keyboard', () => {
  test('skip link moves focus to main content (no route change)', async ({ page }) => {
    await seedA11y(page)
    await page.goto('/#/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'মূল অংশে যান' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/$/)
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main')
  })

  test('landmarks, language and heading structure', async ({ page }) => {
    await seedA11y(page)
    await page.goto('/#/')
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('bn')
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'প্রধান মেনু' })).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    // module 2 is a card deck: the units overview has one h1; inside a unit the lesson title is the (visually hidden) h1
    await page.goto('/#/module/2')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await page.getByTestId('unit-card-0').click()
    await expect(page.getByTestId('deck-slide')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    // the page behind the full-screen deck takes no focus (header, skip link, help button are inert)
    expect(await page.evaluate(() => (document.querySelector('header') as HTMLElement).inert)).toBe(true)
  })

  test('onboarding -> home -> module -> quiz using the keyboard only', async ({ page }) => {
    test.setTimeout(120_000)
    await mockPlatform(page, 'Linux') // unknown OS -> the app asks
    await seedA11y(page, { onboarded: false })
    await page.goto('/#/welcome')
    // name field is focused first; type, then Tab to the next button
    await expect(page.getByRole('textbox')).toBeFocused()
    await page.keyboard.type('রুমা')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /পরের ধাপ/ })).toBeFocused()
    await page.keyboard.press('Enter') // -> OS step
    await expect(page.getByRole('heading', { name: /কম্পিউটার কোনটি/ })).toBeVisible()
    // radio group: arrow keys change the choice
    await page.getByRole('radio', { name: /Windows/ }).focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('radio', { name: /Mac/ })).toBeChecked()
    await page.getByRole('button', { name: /পরের ধাপ/ }).focus()
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: /পরের ধাপ/ }).focus()
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: /শুরু করি/ }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { level: 1, name: /স্বাগতম/ })).toBeVisible()
    // Tab from the top reaches the lesson card link and Enter opens it
    await page.getByRole('link', { name: /চালিয়ে যান|শুরু করি|পাঠ ১/ }).first().focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/module\/1$/)
    await expect(page.getByTestId('units-overview')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    // unit cards are real buttons: Enter starts the first unit and the hook card is on screen (Mac was chosen above)
    await page.getByTestId('unit-card-0').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('deck-hook')).toBeVisible()
    // go straight to the first quiz question (saved position), then answer every question with the keyboard only
    const unit = lesson.units[0]
    const slides = buildSlides(unit, { os: 'mac', input: 'mouse' })
    await openAt(page, 1, 0, unit, slides.findIndex((x) => x.kind === 'quiz'))
    await expect(page.getByTestId('deck-quiz')).toBeVisible()
    const qs = slides.flatMap((x) => (x.kind === 'quiz' ? [x.question] : []))
    // the first answer of the first question is deliberately wrong
    await expect(page.getByTestId('deck-question')).toHaveText(qs[0].questionBn)
    await answerByKeyboard(page, qs[0], false)
    await expect(page.getByTestId('quiz-wrong')).toBeVisible()
    for (const q of qs) {
      await expect(page.getByTestId('deck-question')).toHaveText(q.questionBn) // the slide transition is over
      await answerByKeyboard(page, q, true)
      await expect(page.getByTestId('quiz-right')).toBeVisible()
      const next = page.getByTestId('deck-primary')
      await expect(next).toBeFocused() // focus moves to the continue button
      await page.keyboard.press('Enter')
    }
    await expect(page.getByTestId('deck-celebrate')).toBeVisible()
  })

  test('dialog: focus moves in, Esc closes, focus returns to the opener', async ({ page }) => {
    await seedA11y(page)
    await page.goto('/#/')
    const help = page.getByRole('button', { name: /সাহায্য/ })
    await help.focus()
    await page.keyboard.press('Enter')
    const dlg = page.getByRole('dialog')
    await expect(dlg).toBeVisible()
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true)
    // Tab never reaches the inert page behind the modal (it cycles inside the dialog / browser UI)
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      expect(await page.evaluate(() => !!document.activeElement?.closest('main, header'))).toBe(false)
    }
    await page.keyboard.press('Escape')
    await expect(dlg).toBeHidden()
    await expect(help).toBeFocused()
  })

  test('every interactive element on key pages shows a visible focus ring', async ({ page }) => {
    test.setTimeout(120_000)
    for (const theme of ['light', 'dark'] as const) {
      await seedA11y(page, { theme })
      for (const p of ['/', '/settings', '/glossary', '/module/2', '/cheatsheets']) {
        await page.goto('/#' + p)
        await expect(page.locator('main h1').first()).toBeVisible()
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
        const missing: string[] = []
        for (let i = 0; i < 40; i++) {
          await page.keyboard.press('Tab')
          const r = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null
            if (!el || el === document.body) return null
            const cs = getComputedStyle(el)
            return { tag: el.tagName + (el.textContent ?? '').trim().slice(0, 20), w: parseFloat(cs.outlineWidth), style: cs.outlineStyle, shadow: cs.boxShadow !== 'none' }
          })
          if (!r) break
          if (!((r.style !== 'none' && r.w >= 2) || r.shadow)) missing.push(`${p} ${r.tag}`)
        }
        expect(missing, `no focus ring on: ${missing.join(', ')}`).toEqual([])
      }
    }
  })
})

/** Answer one quiz question (deck quiz slide) using only keyboard interaction. `right=false` submits something wrong first-try. */
async function answerByKeyboard(page: Page, q: QuizQuestion, right: boolean) {
  const press = async (loc: ReturnType<Page['locator']>, key = 'Enter') => {
    await loc.focus()
    await page.keyboard.press(key)
  }
  const check = () => press(page.getByTestId('deck-primary').filter({ hasText: /যাচাই করুন/ }))
  if (q.type === 'ordering') {
    const order = right ? q.items.map((i) => i.textBn) : [...q.items.map((i) => i.textBn)].reverse()
    for (let pos = 0; pos < order.length; pos++) {
      // bring the wanted item up to position `pos` with the "move up" button
      for (let guard = 0; guard < 10; guard++) {
        const rows = await page.getByTestId('order-item').allInnerTexts()
        const at = rows.findIndex((t) => t.includes(order[pos]))
        if (at <= pos) break
        await press(page.getByTestId('order-item').nth(at).getByRole('button', { name: 'ওপরে সরান' }))
      }
    }
    await check()
  } else if (q.type === 'dragMatch') {
    const order = right ? q.pairs : [...q.pairs].reverse()
    for (const p of order) {
      // right=false: place chips in reverse so everything is mismatched at once
      const want = (right ? p : q.pairs[q.pairs.length - 1 - q.pairs.indexOf(p)]).rightBn
      const chip = page.locator('[data-chip]:not(:disabled)').filter({ hasText: new RegExp('^\\s*' + want.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).first()
      await press(chip)
      await expect(page.locator('[data-slot]:not(:disabled)').first()).toBeFocused() // focus jumps to the first free slot
      await page.keyboard.press('Enter')
    }
    await check()
  } else if (q.type === 'multipleChoice') {
    const ids = right ? q.correct : [q.options.find((o) => !q.correct.includes(o.id))!.id]
    for (const id of ids) await press(quizOption(page, q.options.find((o) => o.id === id)!.textBn), 'Space')
    if (q.correct.length > 1 || q.multi) await check() // single-answer questions answer instantly
  } else if (q.type === 'clickTarget') {
    const id = right ? q.correct : q.items.find((i) => i.id !== q.correct)!.id
    await press(quizOption(page, q.items.find((i) => i.id === id)!.labelBn))
  } else {
    await page.getByTestId('predict-input').fill(right ? q.acceptedAnswers[0] : 'zzz-wrong')
    await page.keyboard.press('Enter')
  }
}

test.describe('motion and text size', () => {
  test('reduced motion: coach ring + bubble still communicate the target without animation', async ({ page }) => {
    test.setTimeout(90_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seedA11y(page)
    await openModule(page, 1)
    await startUnit(page, 0)
    await skipToPractice(page)
    const ring = page.getByTestId('coach-ring')
    const bubble = page.getByTestId('coach-overlay').getByRole('status')
    await expect(bubble).toBeVisible()
    // the first step may be a plain "continue" step; advance until a target ring shows
    for (let i = 0; i < 6 && !(await ring.count()); i++) {
      const c = page.getByRole('button', { name: /বুঝেছি/ })
      if (await c.count()) await c.click()
      await page.waitForTimeout(300)
    }
    if (await ring.count()) {
      const anim = await ring.evaluate((el) => getComputedStyle(el).animationDuration)
      expect(parseFloat(anim)).toBeLessThan(0.01)
      const box = await ring.boundingBox()
      expect(box && box.width > 10 && box.height > 10).toBe(true)
      // static border is the non-motion cue
      expect(await ring.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('4px')
    }
  })

  test('largest text size: no horizontal overflow on pages (1280 px)', async ({ page }) => {
    test.setTimeout(120_000)
    await seedA11y(page, { textSize: 'xxlarge' })
    for (const p of ['/', '/settings', '/glossary', '/module/2', '/cheatsheets', '/next-steps']) {
      await page.goto('/#' + p)
      await expect(page.locator('main h1').first()).toBeVisible()
      const o = await page.evaluate(() => ({ sw: document.scrollingElement!.scrollWidth, iw: window.innerWidth }))
      expect(o.sw, p).toBeLessThanOrEqual(o.iw + 1)
    }
  })

  test('simulator container has an accessible name and instructions', async ({ page }) => {
    await seedA11y(page)
    await openModule(page, 1)
    await startUnit(page, 0)
    await skipToPractice(page)
    const sim = page.locator('[data-sim-root]')
    await expect(sim).toBeVisible()
    await expect(sim).toHaveAttribute('aria-label', /কম্পিউটার/)
    const descId = await sim.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    await expect(page.locator(`[id="${descId}"]`)).toContainText('Tab')
  })
})
