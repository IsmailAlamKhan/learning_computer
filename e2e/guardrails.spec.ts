/**
 * Visual guardrails for the readability overhaul (PROJECT_BRIEF "UX RULES", docs/UX_CONTRACT.md).
 *   PW_CHANNEL=chrome PW_PORT=4602 PW_OUTDIR=/tmp/dist-guard npx playwright test e2e/guardrails.spec.ts
 *
 * Every unit of every module is opened with seeded progress and stepped through with the big "পরের ধাপ →" button.
 * On every hook / explanation card, at every sampled width:
 *   - no horizontal page scroll; no vertical scroll in the card area (widget cards scroll inside their own panel: exempt);
 *   - exactly ONE primary button on the screen;
 *   - body text >= 18 px, chips / captions / any other text >= 14 px (effective size: CSS scale transforms included; 13 is tolerated: FitBox scaling rounds).
 * On the practice slide: the coach bubble never overlaps the highlighted target (first 3 steps, as far as clicking / "বুঝেছি"
 * advances them), and on narrow screens the taskbar / Dock and all their buttons are fully inside the simulated computer.
 *
 * Sampling keeps the run short: modules 2, 5, 9, 17, 20 are checked completely (all cards + practice) at 390, 768 and 1440 wide;
 * every other unit: hook + first card at 390 and 1440.
 */
import { expect, test, type Page } from '@playwright/test'
import { openModule, seedProfile, skipToPractice, slideKind, startUnit, nextCard } from './helpers'

const FULL = [2, 5, 9, 17, 20]
const SIZES = { 390: 844, 768: 1024, 1440: 900 } as const
type Width = keyof typeof SIZES

async function setSize(page: Page, w: Width) {
  await page.setViewportSize({ width: w, height: SIZES[w] })
}

/** Number of units of a module (1 for modules that open straight into the deck). */
async function unitCount(page: Page, module: number): Promise<number> {
  await openModule(page, module)
  return page.getByTestId('units-overview').isVisible().then((v) => (v ? page.locator('[data-testid^="unit-card-"]').count() : 1))
}

interface CardReport {
  hScroll: number
  bodyScroll: number
  slideScroll: number
  widget: boolean
  primaries: number
  bodyFont: number
  small: { text: string; px: number }[]
}

async function measureCard(page: Page): Promise<CardReport> {
  return page.evaluate(() => {
    const slide = document.querySelector<HTMLElement>('[data-testid="deck-slide"]')!
    const body = slide.querySelector<HTMLElement>('.deck-body')
    const widget = !!slide.querySelector('[data-testid="deck-widget"]')
    const se = document.scrollingElement as HTMLElement
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
    }
    // interactive widgets (inside [data-testid=deck-widget]) have their own buttons: not counted
    const primaries = [...document.querySelectorAll('.deck-root .btn:not(.btn-outline):not(.btn-ghost)')].filter((b) => visible(b) && !b.closest('[data-testid="deck-widget"]')).length
    const main = slide.querySelector('.deck-text-main')
    // effective font size: computed size x the scale of any CSS transform (FitBox shrinks big visuals)
    const effective = (el: HTMLElement) => {
      const fs = parseFloat(getComputedStyle(el).fontSize)
      const sc = el.offsetWidth > 0 ? el.getBoundingClientRect().width / el.offsetWidth : 1
      return fs * (sc > 0 && sc <= 1.01 ? sc : 1)
    }
    const small: { text: string; px: number }[] = []
    if (!widget) {
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT)
      const seen = new Set<Element>()
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement
        if (!el || seen.has(el) || !(n.textContent ?? '').trim() || el.closest('svg') || !visible(el)) continue
        seen.add(el)
        const px = effective(el)
        if (px < 13) small.push({ text: (n.textContent ?? '').trim().slice(0, 30), px: Math.round(px * 10) / 10 })
      }
    }
    return {
      hScroll: se.scrollWidth - window.innerWidth,
      bodyScroll: body ? body.scrollHeight - body.clientHeight : 0,
      slideScroll: slide.scrollHeight - slide.clientHeight,
      widget,
      primaries,
      bodyFont: main ? parseFloat(getComputedStyle(main).fontSize) : 99,
      small,
    }
  })
}

async function checkCard(page: Page, label: string) {
  const r = await measureCard(page)
  expect.soft(r.hScroll, `${label}: horizontal page scroll`).toBeLessThanOrEqual(1)
  if (!r.widget) {
    expect.soft(r.bodyScroll, `${label}: card body needs vertical scroll`).toBeLessThanOrEqual(1)
    expect.soft(r.slideScroll, `${label}: slide needs vertical scroll`).toBeLessThanOrEqual(1)
  }
  expect.soft(r.primaries, `${label}: primary buttons on screen`).toBe(1)
  expect.soft(r.bodyFont, `${label}: body text size`).toBeGreaterThanOrEqual(18)
  expect.soft(r.small, `${label}: text smaller than 14px`).toEqual([])
}

const intersects = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

/** The coach bubble must not cover the highlighted target; walk up to `steps` steps when clicking / "বুঝেছি" advances them. */
async function checkCoach(page: Page, label: string, steps = 3) {
  for (let i = 0; i < steps; i++) {
    const bubble = page.getByTestId('coach-bubble')
    if (!(await bubble.isVisible())) return
    await page.waitForTimeout(450) // the bubble re-places itself after the target moves / animates
    const ring = page.getByTestId('coach-ring')
    const before = await bubble.innerText()
    const rb = (await ring.count()) ? await ring.boundingBox() : null
    const bb = await bubble.boundingBox()
    // a target that fills most of the simulated computer (a text area, a whole window) cannot be left uncovered: the bubble then docks in the emptiest corner (see placeBubble)
    const sim = await page.locator('[data-sim-root]').boundingBox()
    const huge = !!rb && !!sim && rb.width * rb.height > 0.45 * sim.width * sim.height
    if (rb && bb && !huge) expect.soft(intersects(bb, rb), `${label} step ${i + 1}: coach bubble covers the target ${JSON.stringify({ bubble: bb, ring: rb })}`).toBe(false)
    if (i === steps - 1) return
    // advance
    const cont = bubble.getByRole('button', { name: /বুঝেছি/ })
    if (await cont.count()) await cont.click()
    else if (rb) await page.mouse.click(rb.x + rb.width / 2, rb.y + rb.height / 2)
    else return
    await page.waitForTimeout(500)
    if (await page.getByTestId('practice-success').isVisible()) return
    await expect.poll(async () => ((await bubble.isVisible()) ? await bubble.innerText() : ''), { timeout: 2500 }).not.toBe(before).catch(() => undefined)
    if ((await bubble.isVisible().catch(() => false)) && (await bubble.innerText()) === before) return // that step needs another gesture
  }
}

/** The simulated taskbar / Dock and every button of it sit fully inside the simulated computer (nothing clipped). */
async function checkShellFits(page: Page, label: string) {
  const r = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('[data-sim-root]')!
    const rr = root.getBoundingClientRect()
    const bar = root.querySelector<HTMLElement>('[data-coach="taskbar"],[data-coach="dock"]')
    if (!bar) return { problems: ['no taskbar / dock found'] }
    const problems: string[] = []
    const inside = (el: Element, name: string, within: DOMRect) => {
      const b = el.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) return
      if (b.left < within.left - 1 || b.right > within.right + 1 || b.top < within.top - 1 || b.bottom > within.bottom + 1) problems.push(`${name} ${Math.round(b.left)}-${Math.round(b.right)} outside ${Math.round(within.left)}-${Math.round(within.right)}`)
    }
    inside(bar, 'bar', rr)
    const br = bar.getBoundingClientRect()
    bar.querySelectorAll('button,[role="button"]').forEach((b, i) => inside(b, `button#${i}(${b.getAttribute('data-coach')})`, br))
    return { problems }
  })
  expect.soft(r.problems, `${label}: taskbar / Dock clipped`).toEqual([])
}

test.describe.configure({ mode: 'parallel' })

for (let module = 1; module <= 20; module++) {
  const full = FULL.includes(module)
  test(`module ${module} ${full ? '(all cards, 3 widths)' : '(hook + first card, 2 widths)'}`, async ({ page }) => {
    test.setTimeout(full ? 360_000 : 150_000)
    await seedProfile(page, module % 2 === 0 ? 'mac' : 'windows')
    await setSize(page, 1440)
    const units = await unitCount(page, module)
    const widths: Width[] = full ? [390, 768, 1440] : [390, 1440]
    for (const w of widths) {
      await setSize(page, w)
      for (let u = 0; u < units; u++) {
        const label = `M${module} unit ${u + 1} @${w}`
        await page.goto('/#/') // leave the deck first: the same hash would not reload it
        await openModule(page, module)
        await startUnit(page, u)
        expect(await slideKind(page)).toBe('hook')
        await checkCard(page, `${label} hook`)
        if (!full) {
          await nextCard(page)
          if ((await slideKind(page)) === 'card') await checkCard(page, `${label} card 1`)
          continue
        }
        let n = 0
        while ((await slideKind(page)) !== 'practice') {
          await nextCard(page)
          const kind = await slideKind(page)
          if (kind === 'card') await checkCard(page, `${label} card ${++n}`)
          else if (kind !== 'practice') throw new Error(`${label}: unexpected ${kind} before practice`)
        }
        await expect(page.locator('[data-sim-root]')).toBeVisible({ timeout: 20_000 })
        await checkCoach(page, `${label} practice`)
        await checkShellFits(page, `${label} practice`)
      }
    }
  })
}

test.describe('lesson chrome', () => {
  test('coach buttons keep keyboard focus inside the simulated computer', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 2)
    await startUnit(page, 0)
    await skipToPractice(page)
    const sim = page.locator('[data-sim-root]')
    await sim.click({ position: { x: 300, y: 120 } }) // focus the sim
    for (const name of [/হিন্ট/, /দেখিয়ে দিন/]) {
      await page.getByTestId('coach-bubble').getByRole('button', { name }).click()
      const inSim = await page.evaluate(() => !!document.activeElement?.closest('[data-sim-root]'))
      expect(inSim, `focus after pressing ${name}`).toBe(true)
    }
    // still keyboard-operable
    const hint = page.getByTestId('coach-bubble').getByRole('button', { name: /হিন্ট/ })
    await hint.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('coach-hint')).toBeVisible()
  })

  test('the deck header has a help button that opens the help dialog (Esc closes only the dialog)', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 2)
    await startUnit(page, 0)
    const help = page.getByTestId('deck-help')
    await expect(help).toBeVisible()
    await help.focus()
    await page.keyboard.press('Enter')
    const dlg = page.getByRole('dialog', { name: 'সাহায্য' })
    await expect(dlg).toBeVisible()
    await expect(dlg).toContainText('আটকে গেলে')
    await page.keyboard.press('Escape')
    await expect(dlg).toBeHidden()
    await expect(page.getByTestId('deck-slide')).toBeVisible() // the lesson is still open
  })
})
