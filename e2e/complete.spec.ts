import { expect, test } from '@playwright/test'
import { answerChoice, checkAnswer, expectRight, matchPairs, nextCard, openModule, primary, savedProgress, seedProfile, slideKind, startUnit } from './helpers'

test('finishing the last unit completes the module, shows it on the overview and home, and persists', async ({ page }) => {
  // unit 1 finished earlier; she stopped unit 2 at its first quiz question
  await seedProfile(page, 'windows', {
    modules: { 2: { stepsDone: { windows: [], mac: [] }, explanationRead: false, unitsDone: ['desktop-click'], unitQuiz: {}, freePracticeDone: false, completed: false, realWorldChecked: [] } },
    extras: { 'deck:2:taskbar-dock': { index: 6 } },
  })
  await openModule(page, 2)
  await expect(page.getByTestId('unit-card-0')).toHaveAttribute('data-state', 'done')
  await expect(page.getByTestId('unit-card-1')).toHaveAttribute('data-current', 'true')
  await expect(page.getByTestId('unit-card-1')).toContainText('চালিয়ে যান')
  await startUnit(page, 1, 'continue')
  await matchPairs(page, [['একবার ক্লিক', 'বেছে নেওয়া'], ['ডাবল ক্লিক', 'খোলা'], ['রাইট ক্লিক', 'মেনু দেখা'], ['ড্র্যাগ অ্যান্ড ড্রপ', 'ধরে টেনে সরানো']])
  await checkAnswer(page)
  await expectRight(page)
  await nextCard(page)
  await answerChoice(page, /স্টার্ট \(Windows\)/)
  await nextCard(page)
  await answerChoice(page, /নিচের বারে নেমে থাকে/)
  await nextCard(page)
  expect(await slideKind(page)).toBe('celebrate')
  await expect(page.getByTestId('deck-celebrate')).toContainText('পুরো পাঠ সম্পন্ন')
  const p = await savedProgress(page)
  expect(p.modules['2'].completed).toBe(true)
  await page.reload()
  expect((await savedProgress(page)).modules['2'].completed).toBe(true)
  await page.goto('/#/')
  await expect(page.getByRole('link', { name: /ডেস্কটপ ও স্ক্রিন, সম্পন্ন/ })).toBeVisible()
})
