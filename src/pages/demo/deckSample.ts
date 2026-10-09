import type { Card, Lesson, QuizQuestion, Step, Unit } from '../../engine/types'

/** A lesson that uses every card kind and every quiz type — for the /demo/deck gallery and for screenshots. Not part of the course. */
const step = (id: string, over: Partial<Step> = {}): Step => ({
  id,
  osVariant: 'both',
  titleBn: 'আইকনে ক্লিক',
  target: 'icon-Welcome.txt',
  expectedAction: { type: 'click', target: 'icon-Welcome.txt' },
  explanationBn: '“Welcome.txt” আইকনে একবার ক্লিক করুন।',
  hintBn: 'আইকনের ওপর একবার চাপুন।',
  ...over,
})
const hook = (id: string, textBn: string, visual: Card['visual']): Card => ({ id, type: 'hook', textBn, visual })

const mc: QuizQuestion = {
  id: 'demo-mc-multi',
  type: 'multipleChoice',
  questionBn: 'কোনগুলো ইনপুট ডিভাইস? (একাধিক ঠিক)',
  options: [
    { id: 'a', textBn: 'কিবোর্ড' },
    { id: 'b', textBn: 'মনিটর' },
    { id: 'c', textBn: 'মাউস' },
    { id: 'd', textBn: 'স্পিকার' },
  ],
  correct: ['a', 'c'],
  hintBn: 'যা দিয়ে কম্পিউটারকে কিছু বলি, সেগুলো।',
  explanationBn: 'কিবোর্ড আর মাউস দিয়ে আমরা কম্পিউটারকে বলি।',
}
const unitA: Unit = {
  id: 'demo-a',
  titleBn: 'নমুনা: সব রকম কার্ড',
  hook: hook('demo-hook', 'কোড মানে কম্পিউটারকে দেওয়া **ছোট্ট নির্দেশ** — রান্নার রেসিপির মতো!', { kind: 'art', name: 'recipe-card' }),
  cards: [
    { id: 'demo-flow', type: 'visual', textBn: 'ইনপুট যায় **প্রসেসিংয়ে**, তারপর আউটপুট আসে।', visual: { kind: 'flow', items: [{ art: 'keyboard', labelBn: 'ইনপুট' }, { art: 'chip', labelBn: 'প্রসেস' }, { art: 'monitor', labelBn: 'আউটপুট' }] }, chipsBn: ['বলি', 'ভাবে', 'দেখায়'], learnMoreBn: 'আরও জানুনের ভেতরের লেখা যত লম্বাই হোক, নিজের প্যানেলের ভেতরে স্ক্রল হয়।' },
    {
      id: 'demo-code',
      type: 'code',
      textBn: 'এই কোডটা চালালে পর্দায় **স্বাগতম, রুমা** ছাপা হবে।',
      visual: { kind: 'code', lang: 'python', lines: [{ code: 'name = "রুমা"', noteBn: 'নামটা মনে রাখি' }, { code: 'print("স্বাগতম, " + name)', noteBn: 'পর্দায় দেখাই' }], output: ['স্বাগতম, রুমা'] },
    },
    { id: 'demo-widget', type: 'visual', textBn: 'নিজে করে দেখুন — সুইচ টিপলেই বদলে যাবে।', visual: { kind: 'widget', widget: 'toggle-bits' } },
    { id: 'demo-art', type: 'visual', textBn: 'একটা ছবি, একটা লাইন — এই হলো **এক কার্ডে এক ধারণা**।', visual: { kind: 'art', name: 'lightbulb', captionBn: 'এক কার্ড, এক ধারণা' } },
  ],
  steps: [step('demo-s1'), step('demo-s2', { titleBn: 'ডাবল ক্লিক', expectedAction: { type: 'doubleClick', target: 'icon-Welcome.txt' }, explanationBn: 'একই আইকনে দুবার ক্লিক করুন।' })],
  checklist: [
    { id: 'k1', textBn: 'ক্লিক করলাম', stepIds: ['demo-s1'] },
    { id: 'k2', textBn: 'ডাবল ক্লিক করলাম', stepIds: ['demo-s2'] },
  ],
  quiz: [
    mc,
    {
      id: 'demo-match',
      type: 'dragMatch',
      questionBn: 'যন্ত্রের সাথে কাজ মিলিয়ে দিন।',
      pairs: [
        { id: 'k', leftBn: 'কিবোর্ড', rightBn: 'লেখা' },
        { id: 'm', leftBn: 'মনিটর', rightBn: 'দেখা' },
        { id: 's', leftBn: 'স্পিকার', rightBn: 'শোনা' },
      ],
      hintBn: 'মনিটরে দেখি, স্পিকারে শুনি।',
      explanationBn: 'মিলে গেছে — সবগুলো ঠিক!',
    },
    {
      id: 'demo-order',
      type: 'ordering',
      questionBn: 'ছবি তুলে ফেসবুকে দেওয়ার ধাপগুলো সাজান।',
      items: [
        { id: '1', textBn: 'ছবি তুলি' },
        { id: '2', textBn: 'ফেসবুক খুলি' },
        { id: '3', textBn: 'ছবি বেছে নিই' },
        { id: '4', textBn: 'পোস্ট চাপি' },
      ],
      hintBn: 'আগে ছবি, শেষে পোস্ট।',
      explanationBn: 'এই ক্রমেই ছবি পোস্ট হয়।',
    },
  ],
  recapBn: ['ইনপুট → প্রসেস → আউটপুট', 'কোড = নির্দেশ', 'এক কার্ডে এক ধারণা'],
}
const unitB: Unit = {
  id: 'demo-b',
  titleBn: 'নমুনা: তুলনা, ডেমো, কুইজ',
  hook: hook('demo-hook-b', 'দুটো কম্পিউটার, কিন্তু কাজ **একই**!', { kind: 'compare', left: { visual: { kind: 'mock', name: 'win-desktop', os: 'windows', highlight: 'taskbar' }, labelBn: 'Windows' }, right: { visual: { kind: 'mock', name: 'mac-desktop', os: 'mac', highlight: 'dock' }, labelBn: 'Mac' }, vs: 'আর' }),
  cards: [
    { id: 'demo-keys', type: 'visual', textBn: 'কপি করতে **Ctrl + C** চাপুন।', visual: { kind: 'demo', gesture: 'keys', keys: 'Ctrl+C' } },
    { id: 'demo-mock', type: 'visual', textBn: 'নিচের বারটা **টাস্কবার**।', visual: { kind: 'mock', name: 'win-desktop', os: 'windows', highlight: 'taskbar' } },
    { id: 'demo-type', type: 'visual', textBn: 'কিবোর্ডে লিখলে লেখা **ফুটে ওঠে**।', visual: { kind: 'demo', gesture: 'type', textBn: 'আমার নাম রুমা' } },
  ],
  steps: [step('demo-s3')],
  quiz: [
    { id: 'demo-predict', type: 'predictOutput', questionBn: 'এই কোড চালালে কী ছাপা হবে?', code: 'print(2 + 3)', language: 'python', acceptedAnswers: ['5'], hintBn: 'দুই আর তিন যোগ করুন।', explanationBn: '২ + ৩ = ৫, তাই ৫ ছাপা হয়।' },
    { id: 'demo-click', type: 'clickTarget', questionBn: 'কোনটি মাউস?', items: [{ id: 'k', labelBn: 'কিবোর্ড', icon: '⌨️' }, { id: 'm', labelBn: 'মাউস', icon: '🖱️' }, { id: 'p', labelBn: 'প্রিন্টার', icon: '🖨️' }], correct: 'm', hintBn: 'যেটা দিয়ে তীর নাড়ানো হয়।', explanationBn: 'মাউস দিয়ে তীর নাড়ানো হয়।' },
    { id: 'demo-mc', type: 'multipleChoice', questionBn: 'ছবি পোস্ট করতে কোন বোতাম চাপবেন?', options: [{ id: 'a', textBn: 'পোস্ট' }, { id: 'b', textBn: 'বন্ধ' }, { id: 'c', textBn: 'মুছুন' }], correct: ['a'], hintBn: 'পাঠানোর বোতামটা খুঁজুন।', explanationBn: '“পোস্ট” চাপলে ছবি পাঠানো হয়।' },
  ],
  recapBn: ['দুই কম্পিউটার, একই কাজ', 'Ctrl + C = কপি'],
}

const lesson: Lesson = {
  module: 99,
  part: 1,
  id: 'demo',
  titleBn: 'কার্ড গ্যালারি (নমুনা)',
  oneLineBn: 'সব রকম কার্ড আর কুইজ এক জায়গায় — শুধু দেখার জন্য।',
  minutes: 5,
  glossaryIds: [],
  units: [unitA, unitB],
  realWorld: { titleBn: 'আসল কম্পিউটারে', tasksBn: ['একটি ফাইল খুলুন।', 'ফোল্ডার বানান।'] },
  teacherTipBn: 'এটি শুধু নমুনা পাতা — পাঠের অংশ নয়।',
}
export default lesson
