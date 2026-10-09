import { expect, test, type Page } from '@playwright/test'
import {
  answerChoice,
  answerClick,
  checkAnswer,
  coach,
  expectNoScroll,
  expectPracticeDone,
  expectRight,
  expectWrong,
  goBack,
  matchPairs,
  nextCard,
  orderItems,
  predict,
  primary,
  seedProfile,
  skipToPractice,
  slideKind,
  startUnit,
  watchProblems,
} from './helpers'

/** The deck UI itself (navigation, keyboard, swipe, sheets, every card kind and quiz type) on the sample lesson at /#/demo/deck. */
const GALLERY = '/#/demo/deck'
const slideId = (page: Page) => page.getByTestId('deck-slide').getAttribute('data-slide-id')

async function openGallery(page: Page, unit = 0) {
  await page.goto(GALLERY)
  await startUnit(page, unit)
}

test.describe('deck navigation', () => {
  test('button, keyboard (Space / Enter / arrows / Esc) and focus management', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openGallery(page)
    expect(await slideId(page)).toBe('hook')
    await page.keyboard.press('ArrowRight')
    expect(await slideId(page)).toBe('demo-flow')
    await expect(page.getByTestId('deck-text')).toBeFocused() // focus moved to the new card's text
    await page.keyboard.press('ArrowLeft')
    expect(await slideId(page)).toBe('hook')
    await page.keyboard.press('Space')
    expect(await slideId(page)).toBe('demo-flow')
    await page.keyboard.press('Enter')
    expect(await slideId(page)).toBe('demo-code')
    await goBack(page)
    expect(await slideId(page)).toBe('demo-flow')
    // the card region announces itself politely
    await expect(page.locator('.deck-stage')).toHaveAttribute('aria-live', 'polite')
    // the segmented progress bar has one segment per slide
    await expect(page.getByTestId('deck-progress').locator('.deck-seg')).toHaveCount(10)
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('units-overview')).toBeVisible() // closes to the module's unit list
  })

  test('swipe left/right on touch moves between cards; a short or vertical swipe does not', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.setViewportSize({ width: 390, height: 844 })
    await openGallery(page)
    const swipe = async (dx: number, dy = 0) => {
      await page.evaluate(([x, y]) => {
        const el = document.querySelector('.deck-stage') as HTMLElement
        const fire = (type: string, cx: number, cy: number) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'touch', clientX: cx, clientY: cy, isPrimary: true }))
        fire('pointerdown', 200, 400)
        fire('pointerup', 200 + x, 400 + y)
      }, [dx, dy])
    }
    await swipe(-90)
    expect(await slideId(page)).toBe('demo-flow')
    await swipe(-40)
    expect(await slideId(page)).toBe('demo-flow')
    await swipe(-90, 120)
    expect(await slideId(page)).toBe('demo-flow')
    await swipe(90)
    expect(await slideId(page)).toBe('hook')
  })

  test('"আরও জানুন" opens a sheet; Esc closes only the sheet; the practice and quiz cannot be skipped', async ({ page }) => {
    await seedProfile(page, 'windows')
    await openGallery(page)
    await nextCard(page) // flow card with learn-more
    const more = page.getByRole('button', { name: /আরও জানুন/ })
    await expect(more).toHaveAttribute('aria-expanded', 'false')
    await more.click()
    const sheet = page.getByRole('region', { name: 'আরও জানুন' })
    await expect(sheet).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
    expect(await slideId(page)).toBe('demo-flow') // still on the card
    await skipToPractice(page)
    await expect(primary(page)).toBeDisabled()
    await page.keyboard.press('ArrowRight') // keys belong to the simulator on the practice slide
    expect(await slideKind(page)).toBe('practice')
    await goBack(page) // going back is always allowed
    expect(await slideKind(page)).toBe('card')
  })

  test('the OS chip switches the content to the other computer', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.goto('/#/module/2')
    await startUnit(page, 0)
    await nextCard(page)
    await expect(page.getByTestId('deck-slide')).toHaveAttribute('data-slide-id', 'c-desktop-win')
    await page.getByTestId('deck-os').click()
    await expect(page.getByTestId('deck-slide')).toHaveAttribute('data-slide-id', 'c-desktop-mac')
    await expect(page.getByTestId('deck-os')).toContainText('Mac')
  })

  test('reduced motion: slides do not animate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await seedProfile(page, 'windows')
    await openGallery(page)
    const dur = await page.getByTestId('deck-slide').evaluate((el) => parseFloat(getComputedStyle(el).animationDuration))
    expect(dur).toBeLessThan(0.01)
  })
})

test.describe('every card kind fits without scrolling', () => {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    test(`sample lesson at ${w}x${h}`, async ({ page }) => {
      await seedProfile(page, 'windows')
      await page.setViewportSize({ width: w, height: h })
      for (const unit of [0, 1]) {
        await openGallery(page, unit)
        for (let guard = 0; guard < 12; guard++) {
          const kind = await slideKind(page)
          if (kind === 'practice' || kind === 'quiz' || kind === 'celebrate') break
          const id = await slideId(page)
          if (id !== 'demo-widget') await expectNoScroll(page) // widgets scroll inside their own area
          await nextCard(page)
        }
        await page.goto('/#/')
      }
    })
  }
})

test.describe('practice slide', () => {
  test('checklist, success banner, free practice, and the SmallScreenNote on phones', async ({ page }) => {
    await seedProfile(page, 'windows')
    await page.setViewportSize({ width: 390, height: 844 })
    await openGallery(page)
    await skipToPractice(page)
    await expect(page.getByTestId('small-screen-note')).toBeVisible()
    await expect(page.getByRole('list', { name: 'কাজের তালিকা' })).toContainText('ক্লিক করলাম')
    await coach(page, 'icon-Welcome.txt').click()
    await coach(page, 'icon-Welcome.txt').dblclick()
    await expectPracticeDone(page)
    await expect(page.getByRole('list', { name: 'কাজের তালিকা' }).getByText('(হয়ে গেছে)')).toHaveCount(2)
    await page.getByTestId('free-practice').click()
    await expect(page.getByTestId('coach-bubble')).toHaveCount(0) // sandbox: no coach
    await expect(page.locator('[data-sim-root]')).toBeVisible()
    await page.getByRole('button', { name: /ফিরি/ }).click()
    await expect(primary(page)).toBeEnabled()
  })
})

test.describe('all five quiz types', () => {
  test('multi-choice, drag-match, ordering (unit A) then predict, click-target, choice (unit B), celebrations', async ({ page }) => {
    await seedProfile(page, 'windows')
    const problems = watchProblems(page)
    await openGallery(page, 0)
    await skipToPractice(page)
    await coach(page, 'icon-Welcome.txt').click()
    await coach(page, 'icon-Welcome.txt').dblclick()
    await expectPracticeDone(page)
    await nextCard(page)

    // multipleChoice with several right answers: needs the check button; a wrong try keeps what she chose
    await expect(primary(page)).toBeDisabled()
    await answerChoice(page, 'কিবোর্ড')
    await answerChoice(page, 'মনিটর')
    await checkAnswer(page)
    await expectWrong(page)
    await expect(page.getByTestId('quiz-wrong')).toContainText('যা দিয়ে কম্পিউটারকে কিছু বলি')
    await answerChoice(page, 'মনিটর') // un-pick
    await answerChoice(page, 'মাউস')
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)

    // dragMatch via tap-then-tap; after a wrong check only the wrong ones go back
    await matchPairs(page, [['কিবোর্ড', 'দেখা'], ['মনিটর', 'লেখা'], ['স্পিকার', 'শোনা']])
    await checkAnswer(page)
    await expectWrong(page)
    await expect(page.getByTestId('match-chip')).toHaveCount(2)
    await matchPairs(page, [['কিবোর্ড', 'লেখা'], ['মনিটর', 'দেখা']])
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)

    // ordering with the arrow buttons
    await orderItems(page, ['ছবি তুলি', 'ফেসবুক খুলি', 'ছবি বেছে নিই', 'পোস্ট চাপি'])
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)
    expect(await slideKind(page)).toBe('celebrate')
    const celebrate = page.getByTestId('deck-celebrate')
    await expect(celebrate).toContainText('ইনপুট → প্রসেস → আউটপুট') // the three recap chips
    await expect(page.getByTestId('real-world-toggle')).toHaveCount(0) // only on the last unit
    await primary(page).click() // next unit

    // unit B
    await skipToPractice(page)
    await coach(page, 'icon-Welcome.txt').click()
    await expectPracticeDone(page)
    await nextCard(page)
    await predict(page, '7')
    await checkAnswer(page)
    await expectWrong(page)
    await predict(page, '5')
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)
    await answerClick(page, 'কিবোর্ড')
    await expectWrong(page)
    await answerClick(page, 'মাউস')
    await expectRight(page)
    await nextCard(page)
    await answerChoice(page, 'পোস্ট')
    await expectRight(page)
    await nextCard(page)
    await expect(page.getByTestId('deck-celebrate')).toContainText('পুরো পাঠ সম্পন্ন')
    await page.getByTestId('teacher-toggle').click()
    await expect(page.getByRole('region', { name: 'শিক্ষকের জন্য' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('region', { name: 'শিক্ষকের জন্য' })).toBeHidden()
    await page.getByTestId('real-world-toggle').click()
    await page.getByRole('checkbox').first().check()
    expect((await page.evaluate(() => JSON.parse(localStorage.getItem('computer-shikhi:v1')!).modules['99'].realWorldChecked))).toEqual([0])
    expect(problems).toEqual([])
  })

  test('every quiz screen fits without scrolling on a phone', async ({ page }) => {
    await seedProfile(page, 'windows', { extras: { 'deck:99:demo-a': { index: 6 }, 'deck:99:demo-b': { index: 5 } } })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(GALLERY)
    await startUnit(page, 0, 'continue')
    await expectNoScroll(page) // multipleChoice
    await answerChoice(page, 'কিবোর্ড')
    await answerChoice(page, 'মাউস')
    await checkAnswer(page)
    await expectRight(page)
    await expectNoScroll(page) // with the green explanation showing
    await nextCard(page)
    await expectNoScroll(page) // dragMatch
    await expect(primary(page)).toBeDisabled() // until every slot is filled
    await matchPairs(page, [['কিবোর্ড', 'দেখা'], ['মনিটর', 'লেখা'], ['স্পিকার', 'শোনা']])
    await checkAnswer(page)
    await expectWrong(page)
    await expectNoScroll(page) // with the gentle hint showing
  })
})
