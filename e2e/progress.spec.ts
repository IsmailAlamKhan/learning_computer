import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { coach, openModule, seedProfile, skipToPractice, startGuided, startUnit } from './helpers'
import m02 from '../src/content/lessons/m02'
import { lessonSteps } from '../src/engine/lessonSteps'
import { stepsFor } from '../src/engine/runner'

const KEY = 'computer-shikhi:v1'
const stored = (page: Page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY)
const tmp = (name: string) => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cs-e2e-')), name)

const quizOfM02 = m02.units.flatMap((u) => u.quiz)
const stepsOfM02 = (os: 'windows' | 'mac') => stepsFor(lessonSteps(m02), os, 'mouse')

/** Module 2 on Windows: open the first unit, go to the practice and select the icon (the first step). */
async function doFirstSteps(page: Page) {
  await openModule(page, 2)
  await startUnit(page, 0)
  await skipToPractice(page)
  await coach(page, 'icon-Welcome.txt').click()
  await expect(page.getByRole('progressbar', { name: 'ধাপের অগ্রগতি' })).toHaveAttribute('aria-valuenow', '1')
}

test.describe('step progress', () => {
  test('completed steps are remembered after reload (and shown on the teacher page)', async ({ page }) => {
    await seedProfile(page, 'windows')
    await doFirstSteps(page)
    const before = await stored(page)
    expect(before.modules['2'].stepsDone.windows).toEqual(['select'])
    expect(before.modules['2'].stepsDone.mac).toEqual([])

    await page.reload()
    const after = await stored(page)
    expect(after.modules['2'].stepsDone.windows).toEqual(['select'])

    // the teacher dashboard shows 1 of the Windows steps and none for Mac
    await page.goto('/#/teacher')
    const row = page.getByTestId('module-table').locator('tbody tr').nth(1)
    await expect(row).toContainText('চলছে')
    const wTotal = stepsOfM02('windows').length
    const mTotal = stepsOfM02('mac').length
    await expect(row.locator('td').nth(3)).toHaveText(`1/${wTotal}`)
    await expect(row.locator('td').nth(4)).toHaveText(`0/${mTotal}`)
  })

  test('a finished unit is announced on the overview and when replaying its practice', async ({ page }) => {
    const ids = stepsOfM02('windows').map((s) => s.id)
    await seedProfile(page, 'windows', {
      modules: { 2: { stepsDone: { windows: ids, mac: [] }, explanationRead: true, unitsDone: ['desktop-click'], unitQuiz: {}, freePracticeDone: false, completed: false, realWorldChecked: [] } },
    })
    await openModule(page, 2)
    await expect(page.getByTestId('unit-card-0')).toHaveAttribute('data-state', 'done')
    await expect(page.getByTestId('unit-card-0')).toContainText('আবার করি')
    await expect(page.getByTestId('unit-card-1')).toHaveAttribute('data-current', 'true')
    await startUnit(page, 0)
    await skipToPractice(page)
    await expect(page.getByTestId('practice-success')).toContainText('আগেই করেছেন')
    await expect(page.getByTestId('deck-primary')).toBeEnabled()
  })

  test('a half-finished unit says "continue" on the overview and resumes at the same card', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openModule(page, 2)
    await startUnit(page, 0)
    await page.getByTestId('deck-primary').click()
    await page.getByTestId('deck-primary').click()
    const at = await page.getByTestId('deck-slide').getAttribute('data-slide-id')
    await page.reload()
    await expect(page.getByTestId('unit-card-0')).toContainText('চালিয়ে যান')
    await startUnit(page, 0, 'show')
    await expect(page.getByTestId('deck-resume')).toBeVisible()
    await page.getByTestId('deck-primary').click()
    await expect(page.getByTestId('deck-slide')).toHaveAttribute('data-slide-id', at ?? '')
  })
})

test.describe('backup: export, reset, import', () => {
  test('export JSON -> reset progress -> import the file restores progress', async ({ page }) => {
    await seedProfile(page, 'windows')
    await doFirstSteps(page)

    await page.goto('/#/settings')
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /ব্যাকআপ নামান/ }).click()])
    expect(download.suggestedFilename()).toMatch(/^computer-shikhi-backup-\d{4}-\d{2}-\d{2}\.json$/)
    const file = tmp('backup.json')
    await download.saveAs(file)
    const exported = JSON.parse(fs.readFileSync(file, 'utf8'))
    expect(exported.app).toBe('computer-shikhi')
    expect(exported.profile.name).toBe('রুমা')
    expect(exported.modules['2'].stepsDone.windows).toHaveLength(1)
    await expect(page.locator('p[role="status"]')).toContainText('ব্যাকআপ ফাইলটি আপনার কম্পিউটারে সেভ হয়েছে')

    // reset progress (confirm dialog), name and settings stay
    await page.getByRole('button', { name: /অগ্রগতি মুছে নতুন করে শুরু/ }).click()
    await page.getByRole('button', { name: /হ্যাঁ, মুছে ফেলুন/ }).click()
    await expect.poll(async () => Object.keys((await stored(page)).modules).length).toBe(0)
    expect((await stored(page)).profile.name).toBe('রুমা')

    // import it back
    await page.locator('input[type="file"]').setInputFiles(file)
    await expect(page.locator('p[role="status"]')).toContainText('আগের অগ্রগতি ফিরে এসেছে')
    const restored = await stored(page)
    expect(restored.modules['2'].stepsDone.windows).toEqual(['select'])

    // still there after a reload
    await page.reload()
    expect((await stored(page)).modules['2'].stepsDone.windows).toHaveLength(1)
  })

  test('the cancel button of the reset dialog keeps progress', async ({ page }) => {
    await seedProfile(page, 'windows', { modules: { 2: { stepsDone: { windows: ['select'], mac: [] }, explanationRead: true, freePracticeDone: false, completed: false, realWorldChecked: [] } } })
    await page.goto('/#/settings')
    await page.getByRole('button', { name: /অগ্রগতি মুছে নতুন করে শুরু/ }).click()
    await page.getByRole('button', { name: /না, থাক/ }).click()
    expect(Object.keys((await stored(page)).modules)).toEqual(['2'])
  })

  test('an invalid import shows a gentle message and changes nothing', async ({ page }) => {
    await seedProfile(page, 'windows', { modules: { 2: { stepsDone: { windows: ['select'], mac: [] }, explanationRead: true, freePracticeDone: false, completed: false, realWorldChecked: [] } } })
    await page.goto('/#/settings')
    const input = page.locator('input[type="file"]')
    for (const [name, text] of [
      ['notes.json', 'এটি কোনো ব্যাকআপ নয়'],
      ['array.json', '[1,2,3]'],
      ['future.json', JSON.stringify({ version: 99, profile: {} })],
    ] as const) {
      await input.setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(text, 'utf8') })
      await expect(page.locator('p[role="status"]')).toContainText('ফাইলটি পড়া গেল না')
      await expect(page.locator('p[role="status"]')).not.toContainText(/error|Error|ব্যর্থ/)
    }
    const d = await stored(page)
    expect(d.profile.name).toBe('রুমা')
    expect(d.modules['2'].stepsDone.windows).toEqual(['select'])
  })
})

test.describe('localStorage unavailable', () => {
  test('the app still works in memory and warns gently', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new DOMException('blocked', 'SecurityError')
        },
      })
    })
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('/')
    await expect(page).toHaveURL(/#\/welcome/)
    await page.getByLabel(/আপনার নাম কী/).fill('রুমা')
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /পরের ধাপ/ }).click()
    await page.getByRole('button', { name: /শুরু করি/ }).click()
    await expect(page.getByRole('heading', { name: /স্বাগতম, রুমা/ })).toBeVisible()

    // a lesson opens and a step can be done without crashing
    await page.getByRole('link', { name: /চালিয়ে যান|শুরু করি/ }).click()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.goto('/#/settings')
    await expect(page.getByText(/সেভ করা যাচ্ছে না/)).toBeVisible()
    await page.goto('/#/teacher')
    await expect(page.getByRole('heading', { name: 'শিক্ষকের পাতা' })).toBeVisible()
    expect(errors).toEqual([])
  })
})

test.describe('certificates', () => {
  const allDone = () => {
    const modules: Record<number, unknown> = {}
    for (let i = 1; i <= 20; i++) {
      modules[i] = { stepsDone: { windows: [], mac: [] }, explanationRead: true, freePracticeDone: true, completed: true, completedAt: '2026-03-15T06:00:00.000Z', realWorldChecked: [] }
    }
    return modules
  }
  const bn = { settings: { numerals: 'bengali', unlockAll: true } }

  test('part 1 certificate shows her name and the Bengali date', async ({ page }) => {
    await seedProfile(page, 'windows', { ...bn, modules: allDone(), certificates: [{ part: 1, issuedAt: '2026-03-15T06:00:00.000Z', name: 'রুমা' }] })
    await page.goto('/#/certificate/1')
    const cert = page.getByRole('region', { name: 'সনদপত্র' })
    await expect(cert).toContainText('রুমা')
    await expect(cert).toContainText('পর্ব ১: কম্পিউটারের ভিত্তি')
    await expect(cert).toContainText('১৫ মার্চ ২০২৬')
    await expect(page.getByRole('button', { name: /ছাপুন/ })).toBeVisible()
  })

  test('part 2 certificate is generated and stored when the last module is complete', async ({ page }) => {
    await seedProfile(page, 'windows', { ...bn, modules: allDone() })
    await page.goto('/#/certificate/2')
    const cert = page.getByRole('region', { name: 'সনদপত্র' })
    await expect(cert).toContainText('রুমা')
    await expect(cert).toContainText('পর্ব ২: প্রোগ্রামিংয়ের প্রস্তুতি')
    await expect(cert).toContainText(/তারিখ: [০-৯]{1,2} \S+ ২০[০-৯]{2}/)
    await expect.poll(async () => (await stored(page)).certificates.map((c: { part: number }) => c.part)).toEqual([2])
    expect((await stored(page)).certificates[0].name).toBe('রুমা')
    await expect(page.getByRole('link', { name: /এরপর কোথায় যাব/ })).toBeVisible()
    // and the teacher dashboard lists it
    await page.goto('/#/teacher')
    await expect(page.getByText(/পর্ব ২-এর সনদ — রুমা/)).toBeVisible()
  })

  test('without finishing the part there is a polite "not yet" page', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/certificate/1')
    await expect(page.getByRole('heading', { name: /সনদ এখনো পাওয়া যায়নি/ })).toBeVisible()
    await expect(page.getByRole('region', { name: 'সনদপত্র' })).toHaveCount(0)
  })

  test('A4 landscape print rules exist for the certificate', async ({ page }) => {
    await seedProfile(page, 'windows', { ...bn, modules: allDone(), certificates: [{ part: 1, issuedAt: '2026-03-15T06:00:00.000Z', name: 'রুমা' }] })
    await page.goto('/#/certificate/1')
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('.no-print').first()).toBeHidden()
    await expect(page.getByRole('region', { name: 'সনদপত্র' })).toBeVisible()
  })
})

test.describe('teacher dashboard', () => {
  test('shows progress, weak topics and exports a report and a backup', async ({ page }) => {
    const q = quizOfM02
    await seedProfile(page, 'windows', {
      modules: {
        1: { stepsDone: { windows: [], mac: [] }, explanationRead: true, freePracticeDone: true, completed: true, completedAt: '2026-03-10T06:00:00.000Z', lastVisitedAt: '2026-03-10T06:00:00.000Z', realWorldChecked: [0] },
        2: {
          stepsDone: { windows: ['select'], mac: [] }, explanationRead: true, freePracticeDone: false, completed: false, realWorldChecked: [],
          lastVisitedAt: new Date().toISOString(),
          unitsDone: ['desktop-click'], unitQuiz: { 'desktop-click': { score: 1, total: 3, wrongByQuestion: { [q[0].id]: 2 }, at: new Date().toISOString() } },
        },
      },
    })
    await page.goto('/#/teacher')
    await expect(page.getByRole('heading', { name: /1\/20 পাঠ সম্পন্ন/ })).toBeVisible()
    await expect(page.getByText(q[0].questionBn).first()).toBeVisible()
    await expect(page.getByText('এই পাঠটি আবার দেখুন').first()).toBeVisible()
    await expect(page.getByText(/১০ মার্চ ২০২৬|10 মার্চ 2026/).first()).toBeVisible()

    const [report] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /রিপোর্ট নামান/ }).click()])
    expect(report.suggestedFilename()).toMatch(/\.html$/)
    const html = fs.readFileSync((await report.path())!, 'utf8')
    expect(html).toContain('শেখার অগ্রগতির রিপোর্ট')
    expect(html).toContain('রুমা')
    expect(html).toContain(q[0].questionBn)

    const [backup] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /ব্যাকআপ নামান/ }).click()])
    expect(backup.suggestedFilename()).toMatch(/\.json$/)
    expect(JSON.parse(fs.readFileSync((await backup.path())!, 'utf8')).modules['2'].unitQuiz['desktop-click'].score).toBe(1)
  })
})

// ---- terminal and coding lesson smoke tests (patterns from m17.spec.ts / m20.spec.ts) ----

const SIM = '[data-sim-root]'
const hw = (page: Page, id: string) => page.locator(`${SIM} [data-coach="${id}"]`).first()

for (const osName of ['windows', 'mac'] as const) {
  test(`smoke: Module 17 terminal, first 3 steps (${osName})`, async ({ page }) => {
    await seedProfile(page, osName)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await openModule(page, 17)
    await startUnit(page, 0)
    await skipToPractice(page)
    const input = hw(page, 'terminal-input')
    await expect(input).toBeVisible()
    for (const cmd of ['pwd', osName === 'windows' ? 'dir' : 'ls', 'cd Documents', 'pwd']) {
      // the practice computer may still be settling right after it opens: retry until the text sticks
      await expect(async () => {
        await input.focus()
        await input.fill(cmd)
        await expect(input).toHaveValue(cmd, { timeout: 500 })
      }).toPass({ timeout: 10000 })
      await input.press('Enter')
      await expect(input).toHaveValue('')
    }
    await expect(hw(page, 'terminal-output')).toContainText(osName === 'windows' ? 'C:\\Users\\Anika\\Documents' : '/Users/anika/Documents')
    await expect.poll(async () => (await stored(page)).modules['17'].stepsDone[osName].length).toBeGreaterThanOrEqual(3)
    expect(errors).toEqual([])
  })

  test(`smoke: Module 20 HTML unit 1, first steps (${osName})`, async ({ page }) => {
    await seedProfile(page, osName)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await openModule(page, 20)
    await startUnit(page, 0)
    await skipToPractice(page)
    await expect(hw(page, 'code-editor')).toBeVisible()
    await hw(page, 'code-explorer-index.html').click()
    await expect(hw(page, 'code-preview')).toBeVisible()
    // type the first heading at the end of line 8, like the full walkthrough
    await page.locator(`${SIM} .cm-content`).click()
    await page.keyboard.press('ControlOrMeta+Home')
    for (let i = 1; i < 8; i++) await page.keyboard.press('ArrowDown')
    await page.keyboard.press('End')
    await page.keyboard.type('<h1>Hello, world</h1>')
    await expect(page.frameLocator(`${SIM} [data-coach="code-preview"]`).locator('h1')).toHaveText('Hello, world')
    await expect.poll(async () => (await stored(page)).modules['20'].stepsDone[osName]).toContain('h1-heading')
    expect(errors).toEqual([])
  })
}
