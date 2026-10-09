// Screenshots of the new deck UI (module 2 pilot + the /demo/deck sample) at 1440x900 and 390x844.
//   BASE=http://localhost:4406 node scripts/shots-after-pilot.mjs [docs/screenshots/after-pilot]
import { chromium } from '@playwright/test'
const base = process.env.BASE ?? 'http://localhost:4406'
const out = process.argv[2] ?? 'docs/screenshots/after-pilot'
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' })
const seed = (os, extras = {}) => ({ version: 1, profile: { name: 'রুমা', os, input: 'mouse', autoDetected: true, motivation: 'x', onboarded: true }, settings: { unlockAll: true }, modules: {}, extras: { inputManual: true, ...extras } })

for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('pageerror', String(e)))
  await page.addInitScript((s) => { if (!localStorage.getItem('computer-shikhi:v1')) localStorage.setItem('computer-shikhi:v1', JSON.stringify(s)) }, seed('windows'))
  const shot = async (name) => { await page.waitForTimeout(550); await page.screenshot({ path: `${out}/${name}-${w}.png` }) }
  const next = () => page.getByTestId('deck-primary').click()
  const c = (id) => page.locator(`[data-sim-root] [data-coach="${id}"]`).first()

  // ----- module 2, unit 1 -----
  await page.goto(`${base}/#/module/2`)
  await shot('01-units-overview')
  await page.getByTestId('unit-card-0').click()
  await shot('02-hook-compare')
  await next(); await shot('03-visual-card-mock')
  await next(); await shot('04-demo-click')
  await next(); await next()
  await shot('05-demo-right-click')
  await next()
  await page.waitForTimeout(1200)
  await shot('06-practice-coach')
  await c('icon-Welcome.txt').click(); await page.waitForTimeout(1500)
  await c('icon-Welcome.txt').dblclick(); await page.waitForTimeout(1500)
  await c('win-editor-close').click(); await page.waitForTimeout(1500)
  await c('desktop').click({ button: 'right', position: { x: w > 600 ? 600 : 230, y: 250 } }); await page.waitForTimeout(1500)
  await c('ctx-new').click(); await page.waitForTimeout(1500)
  await c('ctx-folder').click(); await page.waitForTimeout(1500)
  await page.locator('[data-coach="rename-input"]').fill('Photos'); await page.keyboard.press('Enter')
  await page.waitForTimeout(2000)
  await shot('07-practice-done')
  await next()
  await shot('08-quiz-click-target')
  await page.getByTestId('quiz-option').filter({ hasText: 'ছবি' }).click()
  await shot('09-quiz-wrong-gentle-hint')
  await page.getByTestId('quiz-option').filter({ hasText: 'ফোল্ডার' }).click()
  await shot('10-quiz-right')
  await next()
  await page.getByTestId('quiz-option').filter({ hasText: /ডাবল ক্লিক/ }).click()
  await shot('11-quiz-multiple-choice')
  await next()
  await shot('12-quiz-ordering')
  // ----- module 2, unit 2: compare card -----
  await page.getByTestId('deck-close').click() // back to the units overview
  await page.getByTestId('unit-card-1').click()
  for (let i = 0; i < 4; i++) await next()
  await shot('13-compare-card')

  // ----- sample lesson: code card, widget, remaining quiz types, celebration -----
  await page.goto(`${base}/#/demo/deck`)
  await page.getByTestId('unit-card-0').click()
  await next(); await next(); await shot('14-code-card')
  await next(); await shot('15-widget-card')
  await next(); await next(); await page.waitForTimeout(1200)
  await c('icon-Welcome.txt').click(); await page.waitForTimeout(1500)
  await c('icon-Welcome.txt').dblclick(); await page.waitForTimeout(2000)
  await next()
  await page.getByTestId('quiz-option').filter({ hasText: 'কিবোর্ড' }).click()
  await page.getByTestId('quiz-option').filter({ hasText: 'মনিটর' }).click()
  await shot('16-quiz-multi-select')
  await next()
  await page.getByTestId('quiz-option').filter({ hasText: 'মনিটর' }).click()
  await page.getByTestId('quiz-option').filter({ hasText: 'মাউস' }).click()
  await next(); await next()
  await shot('17-quiz-drag-match')
  for (const [l, r] of [['কিবোর্ড', 'দেখা'], ['মনিটর', 'লেখা'], ['স্পিকার', 'শোনা']]) {
    await page.getByTestId('match-chip').filter({ hasText: new RegExp(`^${r}$`) }).click()
    await page.getByRole('button', { name: new RegExp(`^${l} — এখানে বসান`) }).click()
  }
  await next()
  await shot('18-quiz-drag-match-wrong')
  for (const [l, r] of [['কিবোর্ড', 'লেখা'], ['মনিটর', 'দেখা']]) {
    await page.getByTestId('match-chip').filter({ hasText: new RegExp(`^${r}$`) }).click()
    await page.getByRole('button', { name: new RegExp(`^${l} — এখানে বসান`) }).click()
  }
  await next(); await next()
  await next()
  await shot('19-quiz-ordering-wrong')
  const want = ['ছবি তুলি', 'ফেসবুক খুলি', 'ছবি বেছে নিই', 'পোস্ট চাপি']
  for (let i = 0; i < want.length; i++) for (let g = 0; g < 6; g++) {
    const items = await page.getByTestId('order-item').allInnerTexts()
    const cur = items.findIndex((t) => t.includes(want[i]))
    if (cur <= i) break
    await page.getByTestId('order-item').nth(cur).getByRole('button', { name: 'ওপরে সরান' }).click()
  }
  await next(); await next()
  await shot('20-celebrate-unit')
  await next()
  for (let i = 0; i < 4; i++) await next()
  await page.waitForTimeout(1200)
  await c('icon-Welcome.txt').click(); await page.waitForTimeout(2000)
  await next()
  await shot('21-quiz-predict-output')
  await page.getByTestId('predict-input').fill('7'); await next()
  await shot('22-quiz-predict-wrong')
  await page.getByTestId('predict-input').fill('5'); await next(); await next()
  await shot('23-quiz-click-target-icons')
  await page.getByTestId('quiz-option').filter({ hasText: 'মাউস' }).click(); await next()
  await page.getByTestId('quiz-option').filter({ hasText: 'পোস্ট' }).click(); await next()
  await shot('24-celebrate-module')
  await ctx.close()
}
await browser.close()
