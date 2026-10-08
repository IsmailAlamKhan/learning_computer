import { expect, test, type Page } from '@playwright/test'
import { coach, seedProfile, startGuided } from './helpers'

const SETTINGS = { settings: { numerals: 'western', unlockAll: true } }
const TEA = '1. Boil water\n2. Add tea leaves\n3. Wait 3 minutes\n4. Pour into a cup'

async function saveFlow(page: Page, os: 'windows' | 'mac') {
  await coach(page, 'editor-text').fill(TEA)
  if (os === 'windows') await coach(page, 'editor-menu-file').click()
  await coach(page, 'editor-save').click()
  await coach(page, 'save-dialog-name').fill('tea.txt')
  await coach(page, 'save-dialog-save').click()
  await coach(page, 'win-editor-close').click()
  await expect(page.getByText(/সব ধাপ শেষ/)).toBeVisible()
}

test.describe('Module 16 guided practice', () => {
  test('Windows flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 16)
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
    await saveFlow(page, 'windows')
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['16'].stepsDone.windows.length)
    expect(saved).toBe(8)
  })

  test('Mac flow completes end to end', async ({ page }) => {
    await seedProfile(page, 'mac', SETTINGS)
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await startGuided(page, 16)
    await coach(page, 'menubar-search').click()
    await coach(page, 'spotlight-input').fill('TextEdit')
    await coach(page, 'spotlight-result-0').click()
    await saveFlow(page, 'mac')
    expect(errors).toEqual([])
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['16'].stepsDone.mac.length)
    expect(saved).toBe(8)
  })
})

test.describe('Module 16 widgets', () => {
  test.beforeEach(async ({ page }) => {
    await seedProfile(page, 'windows', SETTINGS)
  })

  test('order puzzle: drag and drop, buttons, and gentle feedback', async ({ page }) => {
    await page.goto('/#/module/16')
    const w = page.getByTestId('order-puzzle')
    await expect(w).toBeVisible()
    await w.scrollIntoViewIfNeeded()
    // initially wrong -> gentle message, no success
    await w.getByTestId('op-check').click()
    await expect(w.getByTestId('op-feedback')).toBeVisible()
    await expect(w.getByTestId('op-success')).toHaveCount(0)

    const rowOf = async (id: string) => {
      const items = await w.locator('[data-step]').evaluateAll((els) => els.map((e) => e.getAttribute('data-step')))
      return items.indexOf(id)
    }
    const ids = ['tea1', 'tea2', 'tea3', 'tea4', 'tea5']
    // solve with real pointer drags: put each step on the row of its target index
    for (let target = 0; target < ids.length; target++) {
      if ((await rowOf(ids[target])) === target) continue
      const src = await w.getByTestId(`op-item-${ids[target]}`).boundingBox()
      const dst = await w.getByTestId(`op-row-${target}`).boundingBox()
      await page.mouse.move(src!.x + 80, src!.y + src!.height / 2)
      await page.mouse.down()
      await page.mouse.move(src!.x + 90, src!.y + src!.height / 2 + 10, { steps: 3 })
      await page.mouse.move(dst!.x + 120, dst!.y + dst!.height / 2, { steps: 8 })
      await page.mouse.up()
    }
    await w.getByTestId('op-check').click()
    await expect(w.getByTestId('op-success')).toContainText('ঠিক ক্রম')

    // another puzzle, solved with the arrow buttons only
    await w.getByTestId('op-picker-teeth').click()
    const t = ['teeth1', 'teeth2', 'teeth3', 'teeth4']
    for (let target = 0; target < t.length; target++) {
      for (let guard = 0; guard < 6; guard++) {
        const items = await w.locator('[data-step]').evaluateAll((els) => els.map((e) => e.getAttribute('data-step')))
        if (items.indexOf(t[target]) <= target) break
        await w.getByTestId(`op-up-${t[target]}`).click()
      }
    }
    await w.getByTestId('op-check').click()
    await expect(w.getByTestId('op-success')).toBeVisible()
  })

  test('if-else explorer and loop counter', async ({ page }) => {
    await page.goto('/#/module/16')
    const ie = page.getByTestId('if-else-explorer')
    await ie.scrollIntoViewIfNeeded()
    await expect(ie.getByTestId('ie-outcome')).toContainText('ছাতা লাগবে না')
    await ie.getByTestId('ie-toggle-rain').click()
    await expect(ie.getByTestId('ie-outcome')).toContainText('ছাতা নিন')
    await ie.getByTestId('ie-scenario-atm').click()
    await ie.getByTestId('ie-toggle-pin').click()
    await expect(ie.getByTestId('ie-outcome')).toContainText('পিন ভুল')

    const lc = page.getByTestId('loop-counter')
    await lc.scrollIntoViewIfNeeded()
    await lc.getByTestId('lc-step').click()
    await lc.getByTestId('lc-step').click()
    await expect(lc.getByTestId('lc-status')).toContainText('আরও 3 বার বাকি')
    await lc.getByTestId('lc-play').click()
    await expect(lc.getByTestId('lc-status')).toContainText('লুপ শেষ', { timeout: 6000 })
    await lc.getByTestId('lc-answer').fill('5')
    await lc.getByTestId('lc-check').click()
    await expect(lc.getByTestId('lc-wrong')).toBeVisible()
    await lc.getByTestId('lc-answer').fill('6')
    await lc.getByTestId('lc-check').click()
    await expect(lc.getByTestId('lc-right')).toBeVisible()
  })

  test('flowchart builder: drag blocks, click-to-connect, check challenge 1', async ({ page }) => {
    await page.goto('/#/module/16')
    const fc = page.getByTestId('flowchart-builder')
    await fc.scrollIntoViewIfNeeded()
    const canvas = fc.getByTestId('fc-canvas')

    // start by dragging a block from the palette onto the canvas
    const pal = await fc.getByTestId('fc-add-start').boundingBox()
    const cv = await canvas.boundingBox()
    await page.mouse.move(pal!.x + 20, pal!.y + 20)
    await page.mouse.down()
    await page.mouse.move(pal!.x + 40, pal!.y + 30, { steps: 3 })
    await page.mouse.move(cv!.x + 200, cv!.y + 60, { steps: 8 })
    await page.mouse.up()
    await expect(fc.getByTestId('fc-block-b1')).toHaveAttribute('data-kind', 'start')

    // the rest: tapping the palette appends
    for (const k of ['decision', 'action', 'action', 'end']) await fc.getByTestId(`fc-add-${k}`).click()
    const label = async (id: string, text: string) => {
      await fc.getByTestId(`fc-block-${id}`).click()
      await fc.getByTestId('fc-label').fill(text)
    }
    await label('b2', 'বৃষ্টি হচ্ছে?')
    await label('b3', 'ছাতা নিন')
    await label('b4', 'রওনা দিন') // a label that is not one of the standard names

    // the first time: leave a branch out -> specific hint
    const connectPorts = async (from: string, port: string, to: string) => {
      await fc.getByTestId(`fc-port-${from}-${port}`).click()
      await expect(fc.getByTestId('fc-connecting')).toBeVisible()
      await fc.getByTestId(`fc-block-${to}`).click()
    }
    await connectPorts('b1', 'next', 'b2')
    await connectPorts('b2', 'yes', 'b3')
    await connectPorts('b3', 'next', 'b4')
    await connectPorts('b4', 'next', 'b5')
    await expect(fc.getByTestId('fc-edge-b1-next-b2')).toBeVisible()
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-hints')).toContainText('“না” দিকটি')

    // finish: the "no" exit goes straight to "go"
    await fc.getByTestId('fc-block-b2').click()
    await fc.getByTestId('fc-next-no').selectOption('b4')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-hints')).toContainText('অর্থ')
    await fc.getByTestId('fc-block-b2').click()
    // set the meanings
    // standard labels got their meaning automatically; the custom one needs it chosen
    await fc.getByTestId('fc-block-b4').click()
    await fc.getByTestId('fc-ref').selectOption('go')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-success')).toContainText('দারুণ')
    await expect(fc.getByTestId('fc-outline')).toContainText('সিদ্ধান্ত')
  })

  test('flowchart builder: loop challenge shows an infinite-loop hint, solution fixes it; free mode run', async ({ page }) => {
    await page.goto('/#/module/16')
    const fc = page.getByTestId('flowchart-builder')
    await fc.scrollIntoViewIfNeeded()
    await fc.getByTestId('fc-mode-tea-loop').click()
    // two failed checks reveal the solution button
    await fc.getByTestId('fc-check').click()
    await fc.getByTestId('fc-check').click()
    await fc.getByTestId('fc-solution').click()
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-success')).toBeVisible()
    // break the loop: make "reheat" point at itself
    await fc.getByTestId('fc-block-b4').click()
    await fc.getByTestId('fc-next-next').selectOption('b4')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-hints')).toContainText('অসীম লুপ')

    // free mode: build Start -> End and walk it
    await fc.getByTestId('fc-mode-free').click()
    await fc.getByTestId('fc-add-start').click()
    await fc.getByTestId('fc-add-end').click()
    await fc.getByTestId('fc-block-b1').click()
    await fc.getByTestId('fc-next-next').selectOption('b2')
    await fc.getByTestId('fc-check').click()
    await expect(fc.getByTestId('fc-free-feedback')).toContainText('ঠিক আছে')
    await fc.getByTestId('fc-run').click()
    await fc.getByTestId('fc-run-next').click()
    await expect(fc.getByTestId('fc-run-panel')).toContainText('শেষ হলো')
  })
})
