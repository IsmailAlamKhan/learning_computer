import { expect, test, type Page } from '@playwright/test'
import { answerChoice, answerClick, checkAnswer, coach, expectPracticeDone, expectRight, expectWrong, matchPairs, nextCard, openModule, orderItems, primary, savedProgress, seedProfile, skipToPractice, slideKind, startUnit, watchProblems } from './helpers'
import lesson from '../src/content/lessons/m13'

/** Module 13 (capstone): three units, then the module celebration with the certificate link. */

const hw = (page: Page, id: string) => page.locator(`[data-coach="${id}"]`).first()

async function pad(page: Page, mods: string[], key: string) {
  for (const m of mods) await hw(page, `pad-${m}`).click()
  await hw(page, `pad-key-${key}`).click()
}

async function unit1(page: Page, win: boolean) {
  await coach(page, win ? 'taskbar-app-files' : 'dock-files').click()
  await coach(page, 'fm-sidebar-Documents').click()
  await coach(page, win ? 'fm-new' : 'fm-new-folder').click()
  if (win) await coach(page, 'ctx-new-folder').click()
  await coach(page, 'rename-input').fill('MyWork')
  await page.keyboard.press('Enter')
  if (win) {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-editor').click()
  } else {
    await coach(page, 'menubar-search').click()
    await coach(page, 'spotlight-input').fill('TextEdit')
    await coach(page, 'spotlight-result-0').click()
  }
  await coach(page, 'editor-text').fill('My favourite food is khichuri.')
  if (win) await coach(page, 'editor-menu-file').click()
  await coach(page, 'editor-save-as').click()
  await coach(page, 'save-dialog-folder-MyWork').click()
  await coach(page, 'save-dialog-name').fill('note')
  await coach(page, 'save-dialog-save').click()
}

async function unit2(page: Page, win: boolean) {
  if (win) {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-browser').click()
  } else await coach(page, 'dock-browser').click()
  const a = coach(page, 'browser-address')
  await a.click()
  await a.fill('dal recipe')
  await page.keyboard.press('Enter')
  await coach(page, 'search-result-1').click()
  if (win) await pad(page, ['cmd'], 'prtscn')
  else await pad(page, ['shift', 'cmd'], '3')
}

async function unit3(page: Page, win: boolean) {
  if (win) {
    await coach(page, 'start-button').click()
    await coach(page, 'start-app-mail').click()
  } else await coach(page, 'dock-mail').click()
  await coach(page, 'mail-compose').click()
  await coach(page, 'mail-to').fill('friend@mail.example')
  await coach(page, 'mail-subject').fill('My note')
  await coach(page, 'mail-attach').click()
  await coach(page, 'mail-picker-folder-MyWork').click()
  await coach(page, 'mail-picker-file-note.txt').click()
  await coach(page, 'mail-picker-attach').click()
  await coach(page, 'mail-send').click()
}

async function quiz1(page: Page) {
  await answerClick(page, 'MyWork')
  await expectWrong(page)
  await answerClick(page, '.txt')
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Notepad বা TextEdit খুলি', 'লেখাটি লিখি', 'Save As বেছে নিই', 'নিজের ফোল্ডার বেছে'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await matchPairs(page, [['Ctrl/Command \\+ C', 'কপি'], ['Ctrl/Command \\+ V', 'পেস্ট'], ['Ctrl/Command \\+ Z', 'ভুল ফিরিয়ে নেওয়া'], ['Ctrl/Command \\+ S', 'সেভ']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
}

async function quiz2(page: Page) {
  await answerChoice(page, /এটা বিজ্ঞাপন/)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /আসল অ্যাপে নিজে যাব/)
  await expectRight(page)
  await nextCard(page)
  await answerClick(page, 'স্ক্রিনশট')
  await expectRight(page)
  await nextCard(page)
}

async function quiz3(page: Page) {
  await answerChoice(page, /ক্লিপ \(Attach\)/)
  await expectRight(page)
  await nextCard(page)
  await orderItems(page, ['Compose চাপি', 'To আর Subject', 'ফাইল Attach', 'Send চাপি'])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /একটু অপেক্ষা/)
  await expectRight(page)
  await nextCard(page)
}

for (const os of ['windows', 'mac'] as const) {
  test(`Module 13 capstone: three units, completion and certificate (${os})`, async ({ page }) => {
    const win = os === 'windows'
    await seedProfile(page, os)
    const problems = watchProblems(page)
    await openModule(page, 13)
    const units: [(p: Page, w: boolean) => Promise<void>, (p: Page) => Promise<void>][] = [[unit1, quiz1], [unit2, quiz2], [unit3, quiz3]]
    for (let i = 0; i < 3; i++) {
      await startUnit(page, i)
      await skipToPractice(page)
      await expect(page.getByLabel('কাজের তালিকা')).toBeVisible()
      await units[i][0](page, win)
      await expectPracticeDone(page)
      await expect(page.getByLabel('কাজের তালিকা').getByText('(বাকি)')).toHaveCount(0)
      await nextCard(page)
      expect(await slideKind(page)).toBe('quiz')
      await units[i][1](page)
      expect(await slideKind(page)).toBe('celebrate')
      if (i < 2) await primary(page).click()
    }
    const saved = await savedProgress(page)
    expect(saved.modules['13'].stepsDone[os]).toHaveLength(lesson.units.flatMap((u) => u.steps).filter((s) => s.osVariant === os || s.osVariant === 'both').length)
    expect(saved.modules['13'].completed).toBe(true)
    expect(saved.modules['13'].unitsDone).toEqual(['folder-note', 'search-shot', 'mail-certificate'])
    expect(saved.badges).toContain('part1')
    await page.getByRole('link', { name: /সনদ.*দেখুন/ }).click()
    await expect(page).toHaveURL(/#\/certificate\/1/)
    await expect(page.getByLabel('সনদপত্র')).toContainText('রুমা')
    expect(problems).toEqual([])
  })
}

test('unit 3 starts with the saved note already in the folder (fresh sim)', async ({ page }) => {
  await seedProfile(page, 'windows')
  await openModule(page, 13)
  await startUnit(page, 2)
  await skipToPractice(page)
  await unit3(page, true)
  await expectPracticeDone(page)
})
