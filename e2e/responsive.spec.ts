import { expect, test, type Page } from '@playwright/test'
import { seedA11y, type TextSize } from './a11y-util'

const SIZES = [
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'small-laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
]
const PAGES = ['/', '/settings', '/glossary', '/notebook', '/cheatsheets', '/cheatsheet/keyboard-shortcuts', '/cheatsheet/terminal-commands', '/certificate/1', '/certificate/2', '/next-steps', '/teacher']
const SECTIONS = ['১ জানুন', '২ হাতে-কলমে', '৩ নিজে করুন', '৪ কুইজ', '৫ মনে রাখুন', '৬ আসল কম্পিউটারে', '৭ শেষ']
// modules with the widest widgets (computer parts, keyboard, path explorer, spot-the-scam, flowchart builder, terminal / editor)
const MODULES = [1, 4, 5, 9, 16, 17, 20]
const SHOTS = process.env.SHOTS ? '/tmp/s7b-shots' : ''

const overflow = (page: Page) => page.evaluate(() => ({ sw: document.scrollingElement!.scrollWidth, iw: window.innerWidth }))
const sectionBtn = (page: Page, label: string) => page.getByRole('navigation', { name: 'পাঠের অংশ' }).getByRole('button', { name: label })

/** Widest elements that stick out of the viewport (helps debugging an overflow failure). */
async function offenders(page: Page) {
  return page.evaluate(() => {
    const iw = window.innerWidth
    return [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => el.getBoundingClientRect().right > iw + 1 && !el.closest('[data-allow-scroll], .overflow-x-auto, .overflow-auto, .teacher-scroll, [data-sim-root], pre'))
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(el.getBoundingClientRect().right)}`)
  })
}

async function check(page: Page, label: string) {
  const o = await overflow(page)
  expect.soft(o.sw, `${label}: page scrolls horizontally (${o.sw} > ${o.iw}); ${(await offenders(page)).join(' | ')}`).toBeLessThanOrEqual(o.iw + 1)
}

for (const size of SIZES) {
  for (const text of ['normal', 'xxlarge'] as TextSize[]) {
    test.describe(`${size.name} ${size.width}x${size.height} / text ${text}`, () => {
      test.use({ viewport: { width: size.width, height: size.height } })

      test('onboarding and main pages do not overflow horizontally', async ({ page }) => {
        test.setTimeout(180_000)
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await seedA11y(page, { textSize: text, onboarded: false })
        await page.addInitScript((t) => void (document.documentElement.dataset.text = t), text)
        await page.goto('/#/welcome')
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await check(page, 'onboarding 1')
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/${size.name}-${text}-onboarding.png` })
        await page.evaluate(() => {
          localStorage.setItem('computer-shikhi:v1', JSON.stringify({ version: 1, profile: { name: 'রুমা', os: 'windows', motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { numerals: 'bengali', unlockAll: true, theme: 'light', textSize: document.documentElement.dataset.text }, modules: {} }))
        })
        for (const p of PAGES) {
          await page.goto('/#' + p)
          await page.reload()
          await expect(page.locator('main h1, main h2').first()).toBeVisible()
          await check(page, p)
          if (SHOTS) await page.screenshot({ path: `${SHOTS}/${size.name}-${text}${p.replace(/\//g, '_')}.png`, fullPage: size.name === 'phone' || p.startsWith('/cert') })
        }
      })

      test('module page sections (incl. widgets and simulator) do not overflow', async ({ page }) => {
        test.setTimeout(300_000)
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await seedA11y(page, { textSize: text })
        for (const m of MODULES) {
          await page.goto(`/#/module/${m}`)
          await expect(page.getByRole('navigation', { name: 'পাঠের অংশ' })).toBeVisible()
          for (const label of SECTIONS) {
            await sectionBtn(page, label).click()
            if (label.startsWith('২')) {
              const start = page.getByRole('button', { name: /শুরু করি/ }).first()
              if (await start.count()) await start.click()
              await page.waitForTimeout(400)
            }
            await check(page, `module ${m} / ${label}`)
            if (SHOTS && ['normal'].includes(text) && [1, 5].includes(m) && ['১', '২', '৪'].includes(label[0])) {
              await page.screenshot({ path: `${SHOTS}/${size.name}-${text}-m${m}-${label[0]}.png`, fullPage: size.name === 'phone' })
            }
          }
        }
      })
    })
  }
}

test.describe('small screen note', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('is shown on phones for simulator sections, can be dismissed and stays dismissed for the session', async ({ page }) => {
    await seedA11y(page)
    await page.goto('/#/module/1')
    await sectionBtn(page, '৩ নিজে করুন').click()
    const note = page.getByTestId('small-screen-note')
    await expect(note).toBeVisible()
    await expect(note).toContainText('ল্যাপটপে করলে সবচেয়ে ভালো লাগে')
    await note.getByRole('button', { name: /বন্ধ/ }).click()
    await expect(note).toHaveCount(0)
    await sectionBtn(page, '২ হাতে-কলমে').click()
    await expect(page.getByTestId('small-screen-note')).toHaveCount(0)
  })

  test('is not shown on laptops', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await seedA11y(page)
    await page.goto('/#/module/1')
    await sectionBtn(page, '৩ নিজে করুন').click()
    await expect(page.locator('[data-sim-root]')).toBeVisible()
    await expect(page.getByTestId('small-screen-note')).toHaveCount(0)
  })

  test('coach bubble does not cover the whole simulator on a phone', async ({ page }) => {
    await seedA11y(page)
    await page.goto('/#/module/1')
    await sectionBtn(page, '২ হাতে-কলমে').click()
    await page.getByRole('button', { name: /শুরু করি/ }).first().click()
    const bubble = page.getByTestId('coach-overlay').getByRole('status')
    await expect(bubble).toBeVisible()
    const [b, s] = await Promise.all([bubble.boundingBox(), page.locator('[data-sim-root]').boundingBox()])
    expect(b!.height).toBeLessThan(s!.height * 0.75)
    expect(b!.width).toBeLessThanOrEqual(s!.width)
  })
})
