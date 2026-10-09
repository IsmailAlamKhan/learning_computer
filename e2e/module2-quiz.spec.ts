import { expect, test } from '@playwright/test'
import { answerChoice, answerClick, checkAnswer, expectRight, expectWrong, matchPairs, nextCard, openModule, orderItems, primary, savedProgress, seedProfile, slideKind, startUnit } from './helpers'

/**
 * Module 2 quizzes, reached with "continue where you left off": the saved deck position is the first quiz slide
 * (hook + 4 cards + practice = 6 slides before it), so these tests do not repeat the practice.
 */
const AT_QUIZ = { 'deck:2:desktop-click': { index: 6 }, 'deck:2:taskbar-dock': { index: 6 } }

for (const os of ['windows', 'mac'] as const) {
  test(`Module 2 quizzes score first-try answers and complete the module (${os})`, async ({ page }) => {
    await seedProfile(page, os, { extras: AT_QUIZ })
    await openModule(page, 2)
    await startUnit(page, 0, 'show')
    // "continue where you left off"
    await expect(page.getByTestId('deck-resume')).toBeVisible()
    await primary(page).click()
    expect(await slideKind(page)).toBe('quiz')
    await expect(page.getByTestId('deck-question')).toHaveText('নিচের কোনটি ফোল্ডারের আইকন?')

    // q1 clickTarget: a wrong pick (gentle hint, can retry), then right
    await answerClick(page, 'ছবি')
    await expectWrong(page)
    await expect(page.getByTestId('quiz-wrong')).toContainText('আলমারির তাকের মতো')
    await expect(primary(page)).toBeDisabled()
    await answerClick(page, 'ফোল্ডার')
    await expectRight(page)
    await expect(page.getByTestId('quiz-right')).toContainText('ফোল্ডারে ফাইল সাজিয়ে রাখা হয়')
    await nextCard(page)
    // q2 multiple choice, right first time
    await answerChoice(page, /ডাবল ক্লিক/)
    await expectRight(page)
    await nextCard(page)
    // q3 ordering, wrong once (not sorted), then sorted
    await checkAnswer(page)
    await expectWrong(page)
    await orderItems(page, ['ফাঁকা জায়গায় রাইট ক্লিক', 'নতুন ফোল্ডার বেছে', 'ফোল্ডারের নাম লিখি', 'Enter'])
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)
    expect(await slideKind(page)).toBe('celebrate')
    const q = (await savedProgress(page)).modules['2'].unitQuiz['desktop-click']
    expect(q.total).toBe(3)
    expect(q.score).toBe(1)
    expect(q.wrongByQuestion['q-folder']).toBe(1)
    expect(q.wrongByQuestion['q-order']).toBe(1)

    // unit 2: also resumes at its quiz; drag-match with tap-then-tap
    await primary(page).click()
    await primary(page).click()
    await matchPairs(page, [['একবার ক্লিক', 'বেছে নেওয়া'], ['ডাবল ক্লিক', 'খোলা'], ['রাইট ক্লিক', 'মেনু দেখা'], ['ড্র্যাগ অ্যান্ড ড্রপ', 'ধরে টেনে সরানো']])
    await checkAnswer(page)
    await expectRight(page)
    await nextCard(page)
    await answerChoice(page, /স্টার্ট \(Windows\)/)
    await expectRight(page)
    await nextCard(page)
    await answerChoice(page, 'ফাইলটা মুছে যায়')
    await expectWrong(page)
    await answerChoice(page, /নিচের বারে নেমে থাকে/)
    await expectRight(page)
    await nextCard(page)
    const d = await savedProgress(page)
    expect(d.modules['2'].unitQuiz['taskbar-dock']).toMatchObject({ score: 2, total: 3 })
    expect(d.modules['2'].completed).toBe(true)
    expect(d.modules['2'].unitsDone).toEqual(['desktop-click', 'taskbar-dock'])
  })
}
