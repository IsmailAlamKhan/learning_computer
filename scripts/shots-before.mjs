// Before-screenshots of the OLD lesson UI (run against a build of the commit before the overhaul).
import { chromium } from '@playwright/test'
const base = process.env.BASE ?? 'http://localhost:4300'
const out = process.argv[2] ?? 'docs/screenshots/before'
const browser = await chromium.launch({ channel: 'chrome' })
const seed = (os) => ({ version: 1, profile: { name: 'রুমা', os, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { unlockAll: true }, modules: {} })
async function shot(page, name, width, fn) {
  await fn()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true })
}
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  const page = await ctx.newPage()
  await page.addInitScript((s) => { if (!localStorage.getItem('computer-shikhi:v1')) localStorage.setItem('computer-shikhi:v1', JSON.stringify(s)) }, seed('windows'))
  await shot(page, '1-home', width, () => page.goto(`${base}/#/`))
  await shot(page, '2-lesson-explanation-m4', width, () => page.goto(`${base}/#/module/4`))
  await shot(page, '3-guided-step-m2', width, async () => {
    await page.goto(`${base}/#/module/2`)
    await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
    await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
    await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
  })
  await shot(page, '4-quiz-m2', width, async () => {
    await page.goto(`${base}/#/module/2`)
    await page.getByRole('button', { name: /কুইজ/ }).first().click()
  })
  await shot(page, '5-terminal-step-m17', width, async () => {
    await page.goto(`${base}/#/module/17`)
    await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
  })
  await shot(page, '6-glossary', width, () => page.goto(`${base}/#/glossary`))
  await shot(page, '7-lesson-explanation-m15', width, () => page.goto(`${base}/#/module/15`))
  await ctx.close()
}
await browser.close()
