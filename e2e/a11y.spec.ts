import { expect, test, type Page } from '@playwright/test'
import lesson from '../src/content/lessons/m01'
import type { QuizQuestion } from '../src/engine/types'
import { axeScan, fmtViolations, seedA11y, type TextSize, type Theme } from './a11y-util'

const PAGES = [
  '/', '/settings', '/glossary', '/notebook', '/cheatsheets', '/cheatsheet/keyboard-shortcuts', '/cheatsheet/safety-checklist',
  '/cheatsheet/terminal-commands', '/cheatsheet/setup-checklist', '/cheatsheet/html-basics', '/cheatsheet/python-basics',
  '/certificate/1', '/certificate/2', '/next-steps', '/teacher', '/demo/tools',
]
const SECTIONS = ['১ জানুন', '২ হাতে-কলমে', '৩ নিজে করুন', '৪ কুইজ', '৫ মনে রাখুন', '৬ আসল কম্পিউটারে', '৭ শেষ']
const COMBOS: [Theme, TextSize][] = [['light', 'normal'], ['dark', 'normal'], ['light', 'xxlarge'], ['dark', 'xxlarge']]

const sectionBtn = (page: Page, label: string) => page.getByRole('navigation', { name: 'পাঠের অংশ' }).getByRole('button', { name: label })

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

    test('module sections (incl. widgets, quiz, started guided practice) are clean', async ({ page }) => {
      test.setTimeout(480_000)
      await page.emulateMedia({ reducedMotion: 'reduce' }) // no mid-transition colours while axe measures contrast
      await seedA11y(page, { theme, textSize: size })
      const bad: string[] = []
      // a spread of modules covering most widgets and every quiz type
      const mods = size === 'normal' ? [1, 2, 5, 9, 14, 16, 19] : [3, 4, 8, 12, 15, 17, 20]
      for (const m of mods) {
        await page.goto(`/#/module/${m}`)
        await expect(page.getByRole('navigation', { name: 'পাঠের অংশ' })).toBeVisible()
        for (const label of SECTIONS) {
          await sectionBtn(page, label).click()
          if (label.startsWith('২')) {
            const start = page.getByRole('button', { name: /শুরু করি/ }).first()
            if (await start.count()) await start.click()
            await page.waitForTimeout(500)
          }
          const v = await axeScan(page)
          if (v.length) bad.push(`module ${m} / ${label}\n${fmtViolations(v)}`)
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
    await page.goto('/#/module/2')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(1)
  })

  test('onboarding -> home -> module -> quiz using the keyboard only', async ({ page }) => {
    test.setTimeout(120_000)
    await seedA11y(page, { onboarded: false })
    await page.goto('/#/welcome')
    // name field is focused first; type, then Tab to the next button
    await expect(page.getByRole('textbox')).toBeFocused()
    await page.keyboard.type('রুমা')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /পরের ধাপ/ })).toBeFocused()
    await page.keyboard.press('Enter') // -> OS step
    await expect(page.getByRole('heading', { name: /কোনটি চলে/ })).toBeVisible()
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
    await page.getByRole('link', { name: /আজকের পাঠ|শুরু করুন|পাঠ ১/ }).first().focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#\/module\/1$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    // section navigation by keyboard
    await sectionBtn(page, '৪ কুইজ').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { level: 2, name: /কুইজ/ })).toBeFocused()
    // answer every question with the keyboard only (the first answer of each question is deliberately wrong)
    const first = lesson.quiz[0]
    await answerByKeyboard(page, first, false)
    await expect(page.getByText('একটু আবার ভেবে দেখি')).toBeVisible()
    await expect(page.getByText('একটু আবার ভেবে দেখি').locator('..')).toBeFocused() // hint gets focus after a wrong answer
    for (const q of lesson.quiz) {
      await answerByKeyboard(page, q, true)
      const next = page.getByRole('button', { name: /পরের প্রশ্ন|কুইজ শেষ করি/ })
      await expect(next).toBeFocused() // focus moves to the continue button
      await page.keyboard.press('Enter')
    }
    await expect(page.getByRole('button', { name: /আবার করি/ })).toBeVisible()
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

/** Answer one quiz question using only keyboard interaction. `right=false` submits something wrong first-try. */
async function answerByKeyboard(page: Page, q: QuizQuestion, right: boolean) {
  const submit = async (name: string) => {
    await page.getByRole('button', { name }).focus()
    await page.keyboard.press('Enter')
  }
  if (q.type === 'ordering') {
    const order = right ? q.items.map((i) => i.textBn) : [...q.items.map((i) => i.textBn)].reverse()
    for (let pos = 0; pos < order.length; pos++) {
      // bring the wanted item up to position `pos` with the "move up" button
      for (let guard = 0; guard < 10; guard++) {
        const rows = await page.locator('ol > li').allInnerTexts()
        const at = rows.findIndex((t) => t.includes(order[pos]))
        if (at <= pos) break
        const up = page.locator('ol > li').nth(at).getByRole('button', { name: 'ওপরে সরান' })
        await up.focus()
        await page.keyboard.press('Enter')
      }
    }
    await submit('যাচাই করুন')
  } else if (q.type === 'dragMatch') {
    const order = right ? q.pairs : [...q.pairs].reverse()
    for (const p of order) {
      // right=false: place chips in reverse so everything is mismatched at once
      const want = (right ? p : q.pairs[q.pairs.length - 1 - q.pairs.indexOf(p)]).rightBn
      const chip = page.locator('[data-chip]:not(:disabled)').filter({ hasText: new RegExp('^\\s*' + want.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).first()
      await chip.focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('[data-slot]:not(:disabled)').first()).toBeFocused() // focus jumps to the first free slot
      await page.keyboard.press('Enter')
    }
    await submit('যাচাই করুন')
  } else if (q.type === 'multipleChoice') {
    const ids = right ? q.correct : [q.options.find((o) => !q.correct.includes(o.id))!.id]
    for (const id of ids) {
      const opt = q.options.find((o) => o.id === id)!
      const el = page.getByRole(q.correct.length > 1 || q.multi ? 'checkbox' : 'radio', { name: opt.textBn })
      await el.focus()
      await page.keyboard.press('Space')
    }
    await submit('উত্তর দিন')
  } else if (q.type === 'clickTarget') {
    const id = right ? q.correct : q.items.find((i) => i.id !== q.correct)!.id
    const item = q.items.find((i) => i.id === id)!
    const btn = page.getByRole('group', { name: q.questionBn }).getByRole('button', { name: new RegExp(item.labelBn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })
    await btn.focus()
    await page.keyboard.press('Enter')
  } else {
    const ans = right ? q.acceptedAnswers[0] : 'zzz-wrong'
    await page.getByRole('textbox').fill(ans)
    await page.keyboard.press('Enter')
  }
}

test.describe('motion and text size', () => {
  test('reduced motion: coach ring + bubble still communicate the target without animation', async ({ page }) => {
    test.setTimeout(90_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seedA11y(page)
    await page.goto('/#/module/1')
    await sectionBtn(page, '২ হাতে-কলমে').click()
    await page.getByRole('button', { name: /শুরু করি/ }).first().click()
    const ring = page.getByTestId('coach-ring')
    const bubble = page.getByTestId('coach-overlay').getByRole('status')
    await expect(bubble).toBeVisible()
    // the first step may be a plain "continue" step; advance until a target ring shows
    for (let i = 0; i < 6 && !(await ring.count()); i++) {
      const c = page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ })
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
    await page.goto('/#/module/1')
    await sectionBtn(page, '৩ নিজে করুন').click()
    const sim = page.locator('[data-sim-root]')
    await expect(sim).toBeVisible()
    await expect(sim).toHaveAttribute('aria-label', /কম্পিউটার/)
    const descId = await sim.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    await expect(page.locator(`[id="${descId}"]`)).toContainText('Tab')
  })
})
