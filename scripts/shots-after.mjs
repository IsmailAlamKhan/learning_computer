// After-screenshots of the new cards UI: the same screens as docs/screenshots/before + more.
//   npx vite build --outDir /tmp/dist-after && npx vite preview --outDir /tmp/dist-after --port 4640 &
//   BASE=http://localhost:4640 node scripts/shots-after.mjs docs/screenshots/after-overhaul
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
const base = process.env.BASE ?? 'http://localhost:4640'
const out = process.argv[2] ?? 'docs/screenshots/after-overhaul'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const profile = (os, input = 'mouse') => ({ version: 1, profile: { name: 'রুমা', os, input, autoDetected: true, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { unlockAll: true }, modules: {}, extras: { inputManual: true } })

async function session(width, height, os, input, fn, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  const page = await ctx.newPage()
  const seed = { ...profile(os, input), ...extra }
  await page.addInitScript((s) => { if (!localStorage.getItem('computer-shikhi:v1')) localStorage.setItem('computer-shikhi:v1', JSON.stringify(s)) }, seed)
  const shot = async (name) => { await page.waitForTimeout(650); await page.screenshot({ path: `${out}/${name}-${width}.png` }) }
  const next = async (n = 1) => { for (let i = 0; i < n; i++) { await page.getByTestId('deck-primary').click(); await page.waitForTimeout(350) } }
  const open = async (m, unit = 0) => {
    await page.goto(`${base}/#/module/${m}`)
    await page.getByTestId('units-overview').or(page.getByTestId('deck-hook')).first().waitFor({ timeout: 20000 })
    if (await page.getByTestId('units-overview').isVisible()) await page.getByTestId(`unit-card-${unit}`).click()
    await page.getByTestId('deck-hook').waitFor()
  }
  const toPractice = async () => { for (let i = 0; i < 14; i++) { if ((await page.getByTestId('deck-slide').getAttribute('data-kind')) === 'practice') break; await next() } await page.locator('[data-sim-root]').waitFor({ timeout: 20000 }) }
  await fn({ page, shot, next, open, toPractice })
  await ctx.close()
}

for (const [w, h] of [[1440, 900], [390, 844]]) {
  await session(w, h, 'windows', 'mouse', async ({ page, shot }) => { await page.goto(`${base}/#/`); await shot('01-home-fresh') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot }) => { await page.goto(`${base}/#/`); await shot('01b-home-progress') }, { modules: { 1: { completed: true, stepsDone: { windows: [], mac: [] }, unitsDone: [], unitQuiz: {}, realWorldChecked: [] }, 2: { completed: true, stepsDone: { windows: [], mac: [] }, unitsDone: [], unitQuiz: {}, realWorldChecked: [] } }, xp: 240, streak: { count: 4, best: 4, lastDay: new Date().toISOString().slice(0, 10) }, daily: { day: new Date().toISOString().slice(0, 10), lessons: 1, xp: 60 } })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, next, open }) => { await open(4, 3); await next(1); await shot('02-lesson-card-m4-paths') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, next, toPractice }) => { await open(2, 0); await toPractice(); await shot('03-guided-step-m2') })
  await session(w, h, 'mac', 'touchpad', async ({ page, shot, open, next }) => { await open(1, 1); await next(2); await shot('03b-m1-touchpad-demo-mac') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, next }) => {
    await open(2, 0)
    for (let i = 0; i < 14; i++) { if ((await page.getByTestId('deck-slide').getAttribute('data-kind')) === 'practice') break; await next() }
    const idx = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('computer-shikhi:v1')); return d.extras['deck:2:desktop-click']?.index ?? 0 })
    await page.evaluate((i) => { const d = JSON.parse(localStorage.getItem('computer-shikhi:v1')); d.extras['deck:2:desktop-click'] = { index: i + 1 }; localStorage.setItem('computer-shikhi:v1', JSON.stringify(d)) }, idx)
    await page.goto(`${base}/#/`)
    await page.goto(`${base}/#/module/2`)
    await page.getByTestId('units-overview').waitFor()
    await page.getByTestId('unit-card-0').click()
    if (await page.getByTestId('deck-resume').isVisible().catch(() => false)) await page.getByTestId('deck-primary').click()
    await shot('04-quiz-m2')
  })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, toPractice }) => { await open(17, 0); await toPractice(); await shot('05-terminal-step-m17') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot }) => { await page.goto(`${base}/#/glossary`); await shot('06-glossary') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, next }) => { await open(15, 1); await next(2); await shot('07-m15-code-card') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, next }) => { await open(20, 3); await next(1); await shot('08-m20-python-code-card') })
  await session(w, h, 'mac', 'mouse', async ({ page, shot, open, next }) => { await open(3, 0); await next(2); await shot('09-m3-compare-mac') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, next }) => { await open(9, 2); await next(3); await shot('10-m9-scam-widget') })
  await session(w, h, 'mac', 'mouse', async ({ page, shot, open, toPractice }) => { await open(12, 0); await toPractice(); await shot('11-m12-force-quit-practice-mac') })
  await session(w, h, 'windows', 'mouse', async ({ page, shot, open, next }) => { await open(14, 2); await next(1); await shot('12-m14-bits-widget') })
}
await browser.close()
