import { expect, test, type Page } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { seedA11y } from './a11y-util'

const OUT = process.env.PRINT_OUT ?? '/tmp/s7b-print'
const SHEETS = ['keyboard-shortcuts', 'safety-checklist', 'terminal-commands', 'setup-checklist', 'html-basics', 'python-basics']

const done = { stepsDone: { windows: [], mac: [] }, explanationRead: true, freePracticeDone: true, completed: true, completedAt: '2026-10-09T10:00:00.000Z', realWorldChecked: [] }

async function seedEarned(page: Page) {
  await seedA11y(page, { onboarded: false })
  await page.addInitScript((d) => {
    localStorage.setItem(
      'computer-shikhi:v1',
      JSON.stringify({ version: 1, profile: { name: 'রুমা', os: 'windows', motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { numerals: 'bengali', unlockAll: true }, modules: { 13: d, 20: d } }),
    )
  }, done)
}

const pageCount = (pdf: Buffer) => (pdf.toString('latin1').match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length

/** Elements wider than the printable area (A4 portrait 182 mm ≈ 688 px, landscape 281 mm ≈ 1062 px), ignoring scrollers. */
async function printOverflow(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ media: 'print' })
  return page.evaluate(() => {
    const iw = window.innerWidth
    const sw = document.scrollingElement!.scrollWidth
    const bad = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => el.getBoundingClientRect().width > 0 && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().right > iw + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`)
    return { sw, iw, bad }
  })
}

async function pdfOf(page: Page, name: string, landscape = false) {
  mkdirSync(OUT, { recursive: true })
  const pdf = await page.pdf({ format: 'A4', printBackground: true, landscape, preferCSSPageSize: true })
  writeFileSync(`${OUT}/${name}.pdf`, pdf)
  return pdf
}

test.describe('printing (A4)', () => {
  for (const id of SHEETS) {
    test(`cheat sheet ${id}: at most 2 pages, nothing wider than the page, no app chrome`, async ({ page }) => {
      await seedEarned(page)
      await page.goto(`/#/cheatsheet/${id}`)
      await expect(page.locator('.cheatsheet h1')).toBeVisible()
      const o = await printOverflow(page, 688)
      expect(o.sw, `overflowing: ${o.bad.join(', ')}`).toBeLessThanOrEqual(o.iw + 1)
      expect(o.bad).toEqual([])
      await expect(page.locator('header')).toBeHidden()
      await expect(page.getByRole('button', { name: /সাহায্য/ })).toBeHidden()
      await expect(page.getByRole('button', { name: /ছাপুন/ })).toBeHidden()
      const n = pageCount(await pdfOf(page, id))
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(2)
    })
  }

  for (const part of [1, 2]) {
    test(`certificate ${part}: exactly one landscape page`, async ({ page }) => {
      await seedEarned(page)
      await page.goto(`/#/certificate/${part}`)
      await expect(page.locator('.certificate')).toBeVisible()
      const o = await printOverflow(page, 1062)
      expect(o.sw, `overflowing: ${o.bad.join(', ')}`).toBeLessThanOrEqual(o.iw + 1)
      await expect(page.locator('header')).toBeHidden()
      await expect(page.getByRole('button', { name: /সাহায্য/ })).toBeHidden()
      const pdf = await pdfOf(page, `certificate-${part}`, true)
      expect(pageCount(pdf)).toBe(1)
    })
  }

  test('next-steps habit sheet prints on one page when only the sheet is printed', async ({ page }) => {
    await seedEarned(page)
    await page.goto('/#/next-steps')
    await page.getByRole('button', { name: /শুধু অভ্যাস-ছক ছাপুন/ }).evaluate((b) => {
      // same state as the button, without opening the real print dialog
      window.print = () => {}
      ;(b as HTMLButtonElement).click()
    })
    await page.waitForTimeout(200)
    await page.emulateMedia({ media: 'print' })
    const o = await printOverflow(page, 688)
    expect(o.bad).toEqual([])
    const n = pageCount(await pdfOf(page, 'next-steps-habit'))
    expect(n).toBe(1)
  })

  test('next-steps full page prints without overflow', async ({ page }) => {
    await seedEarned(page)
    await page.goto('/#/next-steps')
    await expect(page.getByTestId('ns-message')).toBeVisible()
    const o = await printOverflow(page, 688)
    expect(o.bad).toEqual([])
    await pdfOf(page, 'next-steps-full')
  })

  test('notebook prints its notes without app chrome', async ({ page }) => {
    await seedEarned(page)
    await page.goto('/#/notebook')
    await expect(page.locator('main h1')).toBeVisible()
    const o = await printOverflow(page, 688)
    expect(o.bad).toEqual([])
    await expect(page.locator('header')).toBeHidden()
    await pdfOf(page, 'notebook')
  })
})
