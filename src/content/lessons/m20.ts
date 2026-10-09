import type { Lesson, SimSetup, Step } from '../../engine/types'

/* ------------------------------------------------------------------ *
 * Module 20 — প্রথম কোড (the finale of the course), cards format.
 * Eight units; each starts a fresh simulated computer with the Code Editor open and a few seeded files in ~/coding.
 * Almost every step is the same on Windows and Mac (`both`). The exact code to type is shown on the card before the
 * practice (animated `code` visuals); the coach line only says what to do.
 * Step ids, targets and expectedAction semantics are unchanged from the old chapters.
 * ------------------------------------------------------------------ */

const FOLDER = '~/coding'

/** Seed files into ~/coding (the Code Editor's default folder). Never overwrites existing files. */
export const seed =
  (files: Record<string, string>): NonNullable<SimSetup['vfs']> =>
  (vfs) => {
    const folder = vfs.child(vfs.home, 'coding') ?? vfs.mkdir(vfs.home, 'coding')
    for (const [name, content] of Object.entries(files)) if (!vfs.child(folder, name)) vfs.createFile(folder, name, content)
  }

export const setupFor = (files: Record<string, string>): SimSetup => ({ openApps: ['code'], vfs: seed(files) })

const both = (s: Omit<Step, 'osVariant'>): Step => ({ ...s, osVariant: 'both' })

/** HTML page skeleton used by the seeds. */
const page = (o: { lang?: string; head?: string; body: string }) => `<!DOCTYPE html>
<html lang="${o.lang ?? 'en'}">
<head>
${o.head ?? '  <meta charset="utf-8">\n  <title>My page</title>'}
</head>
<body>
${o.body}
</body>
</html>
`

/* ---------------- seed files ---------------- */

export const HTML1 = page({
  head: '  <title>My first page</title>',
  body: '  <!-- Start typing below this line -->\n  ',
})

export const HTML3 = page({
  lang: 'bn',
  head: '  <title>My page</title>\n  ',
  body: '  <h1>Hello, world</h1>\n  <p>আমি কোড শিখছি। ক্ষ, স্ত, ন্দ — যুক্তাক্ষরও ঠিকঠাক!</p>\n  ',
})

export const CSS_INDEX1 = page({
  head: '  <meta charset="utf-8">\n  <title>My page</title>\n  ',
  body: '  <h1>Hello, world</h1>\n  <p>I am learning to code.</p>\n  <ul>\n    <li>Rice</li>\n    <li>Dal</li>\n  </ul>',
})

/** style.css with three empty rules: h1 (line 2-4), body (6-8), p (10-12). */
export const CSS_ALL = '/* style.css: পাতার সাজসজ্জা এখানে লিখি */\nh1 {\n  \n}\n\nbody {\n  \n}\n\np {\n  \n}\n'

export const PROJECT_HTML = page({
  head: '  <meta charset="utf-8">\n  <title>About me</title>\n  <link rel="stylesheet" href="style.css">',
  body: '  <!-- h1: আপনার নাম | p: নিজের সম্পর্কে দু-এক লাইন | ul: তিনটি পছন্দ | a: একটি লিংক -->\n  ',
})
export const PROJECT_CSS = '/* style.css: নিজের মতো সাজান */\n'

export const PY_HELLO = 'print("Hello, Python!")\n'
export const PY_GREET = 'name = "Rumi"\nprint("Hello, " + name)\n'
export const PY_ASK = 'name = input("What is your name? ")\nprint("Hello, " + name)\n'
export const PY_CALC = 'price = 25\ncount = 4\nprint(price * count)\nprint(2 ** 3)\nprint(7 / 2)\n'
export const PY_NEXT = 'age = int(input("How old are you? "))\nprint(age + 1)\n'
export const PY_CHECK = 'age = 20\nif age >= 18:\n    print("Adult")\nelse:\n    print("Not yet an adult")\n'
export const PY_LOOP = 'for i in range(3):\n    print("Hello", i)\n'
export const PY_OOPS = 'prnt("Hello")\n'
export const PY_PROJECT = '# নাম-আর-বয়স শুভেচ্ছা (greeting)\n# এখানে লিখুন: নাম ও বয়স জিজ্ঞেস, শুভেচ্ছা, আর প্রাপ্তবয়স্ক কি না\n\n'

/** The model program of the second mini-project (tests check that it satisfies every step and runs). */
export const PY_PROJECT_MODEL = `${PY_PROJECT}name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint("Hello, " + name)\nprint("Next year you will be", age + 1)\nif age >= 18:\n    print("You are an adult.")\nelse:\n    print("You are not an adult yet.")\n`

const lesson: Lesson = {
  module: 20,
  part: 2,
  id: 'm20',
  titleBn: 'প্রথম কোড',
  oneLineBn: 'HTML, CSS ও প্রথম প্রোগ্রাম লিখে ফল দেখি — এবং পর্ব ২-এর সনদপত্র।',
  minutes: 30,
  certificatePart: 2,
  glossaryIds: [
    'code-tag', 'code-element', 'code-attribute', 'code-heading', 'code-paragraph', 'code-list', 'code-link', 'code-image', 'code-alt',
    'code-utf8', 'code-css', 'code-selector', 'code-property', 'code-value', 'code-variable', 'code-string', 'code-integer', 'code-input',
    'code-print', 'code-operator', 'code-condition', 'code-loop', 'code-indentation', 'code-comment', 'code-run', 'code-output', 'code-error', 'code-bug',
  ],

  units: [
    // =====================================================================================================
    // 1. HTML: heading, paragraph, list, link
    // =====================================================================================================
    {
      id: 'html-basics',
      titleBn: 'HTML: শিরোনাম, তালিকা, লিংক',
      hook: {
        id: 'h-html',
        type: 'hook',
        textBn: 'ফেসবুকের পোস্টও কোডে লেখা। চলুন, নিজের হাতে প্রথম **ওয়েবপেজ** বানাই!',
        visual: { kind: 'art', name: 'html-tag', captionBn: 'ট্যাগ দিয়ে লেখা পাতা' },
      },
      cards: [
        {
          id: 'c-html-editor',
          type: 'visual',
          textBn: 'বাঁয়ে কোড, ডানে **প্রিভিউ**। কোড বদলালেই প্রিভিউ সাথে সাথে বদলায়।',
          visual: { kind: 'mock', name: 'code-editor', highlight: 'preview' },
          chipsBn: ['কোড = লেখা', 'প্রিভিউ = ফল'],
          learnMoreBn: 'কোড এডিটর হলো কোড লেখার জন্য বানানো লেখার প্রোগ্রাম। আসল ব্রাউজারে ফাইলটি খুললেও একই পাতা দেখা যায়। এই প্রিভিউ একটি সুরক্ষিত বাক্স, তাই লিংকে ক্লিক করলে কিছু খুলবে না।',
        },
        {
          id: 'c-html-tag',
          type: 'visual',
          textBn: 'HTML-এ সবকিছু **ট্যাগ** দিয়ে লেখা: খুলি, লিখি, বন্ধ করি। লিংকের অংশে ক্লিক করুন।',
          visual: { kind: 'widget', widget: 'html-anatomy', props: { mode: 'html' } },
          learnMoreBn: 'বেশিরভাগ ট্যাগ জোড়ায় আসে: খোলার ট্যাগ <p> আর বন্ধের ট্যাগ </p> (এতে একটি / থাকে)। দুটির মাঝের লেখাসহ পুরোটাকে বলে এলিমেন্ট। href, src, alt-কে বলে অ্যাট্রিবিউট: ট্যাগের অতিরিক্ত তথ্য।',
        },
        {
          id: 'c-html-heading',
          type: 'code',
          textBn: 'এই তিন লাইনই আপনি লিখবেন: **শিরোনাম**, অনুচ্ছেদ, আর ছোট শিরোনাম।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [
              { code: '<h1>Hello, world</h1>', noteBn: 'সবচেয়ে বড় শিরোনাম' },
              { code: '<p>I am learning to code.</p>', noteBn: 'p = অনুচ্ছেদ' },
              { code: '<h2>About me</h2>', noteBn: 'h2 ছোট, h6 পর্যন্ত আছে' },
            ],
            browserPreview: true,
          },
          chipsBn: ['h1 বড়', 'p লেখা'],
        },
        {
          id: 'c-html-list',
          type: 'code',
          textBn: '**ul** পুরো তালিকা, প্রতিটি **li** একটি বুলেট। যা খুলি, তা বন্ধ করি।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [
              { code: '<ul>', noteBn: 'তালিকা শুরু' },
              { code: '  <li>Rice</li>', noteBn: 'একটি আইটেম' },
              { code: '  <li>Dal</li>', noteBn: 'আরেকটি' },
              { code: '</ul>', noteBn: 'তালিকা শেষ' },
            ],
            browserPreview: true,
          },
        },
        {
          id: 'c-html-link',
          type: 'code',
          textBn: 'লিংকে ঠিকানা থাকে **href**-এ, আর মাঝের লেখাটাই চোখে পড়ে। শেষে সেভ করবেন।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [{ code: '<a href="https://example.com">My link</a>', noteBn: 'ঠিকানা + দেখার লেখা' }],
            browserPreview: true,
          },
          learnMoreBn: 'সেভ: Windows-এ Ctrl+S, Mac-এ Cmd+S, অথবা ওপরের Save বোতাম। সেভ না করলে বদলগুলো শুধু পর্দায় থাকে, ফাইলে যায় না।',
        },
      ],
      steps: [
        both({
          id: 'h1-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
          explanationBn: 'বাঁ পাশের তালিকা থেকে index.html খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় index.html নামটি আছে।',
        }),
        both({
          id: 'h1-heading', titleBn: 'প্রথম শিরোনাম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<h1>Hello, world</h1>' },
          explanationBn: '৮ নম্বর ফাঁকা লাইনে লিখুন: <h1>Hello, world</h1>',
          hintBn: '<body>-র নিচের ফাঁকা লাইনে ক্লিক করুন। ট্যাগের ভেতরে ফাঁক নেই।',
          simplerBn: '< হয় Shift + কমা (,), আর > হয় Shift + দাঁড়ি (.)।',
          successMessageBn: 'প্রিভিউতে বড় অক্ষর!',
        }),
        both({
          id: 'h1-para', titleBn: 'একটি অনুচ্ছেদ', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<p>I am learning to code.</p>' },
          explanationBn: 'Enter চেপে লিখুন: <p>I am learning to code.</p>',
          hintBn: 'আগের লাইনের শেষে কার্সার রেখে Enter চাপুন, তারপর টাইপ করুন।',
          simplerBn: 'বড়-ছোট হাতের অক্ষর হুবহু মিলতে হবে।',
        }),
        both({
          id: 'h1-sub', titleBn: 'ছোট শিরোনাম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<h2>About me</h2>' },
          explanationBn: 'আবার Enter চেপে লিখুন: <h2>About me</h2>',
          hintBn: 'এবার h-এর পরে ২।',
        }),
        both({
          id: 'h2-li1', titleBn: 'তালিকা শুরু', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<li>Rice</li>' },
          explanationBn: 'Enter চেপে দুই লাইনে লিখুন: <ul> আর <li>Rice</li>',
          hintBn: 'প্রথম লাইনে <ul>, Enter, পরের লাইনে <li>Rice</li>।',
          simplerBn: 'আগে <ul> লিখে Enter চাপুন, তারপর <li>Rice</li>।',
          successMessageBn: 'প্রিভিউতে একটি বুলেট!',
        }),
        both({
          id: 'h2-li2', titleBn: 'আরেকটি আইটেম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<li>Dal</li>' },
          explanationBn: 'Enter চেপে লিখুন: <li>Dal</li>',
          hintBn: 'আগের লাইনের শেষে Enter, তারপর লিখুন।',
        }),
        both({
          id: 'h2-ul-end', titleBn: 'তালিকা বন্ধ করুন', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</ul>' },
          explanationBn: 'Enter চেপে তালিকা বন্ধ করুন: </ul>',
          hintBn: 'খুলেছিলাম <ul>, তাই বন্ধ হবে </ul>।',
        }),
        both({
          id: 'h2-link', titleBn: 'একটি লিংক', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<a href="https://example.com">My link</a>' },
          explanationBn: 'Enter চেপে লিংকটি লিখুন: <a href="https://example.com">My link</a>',
          hintBn: 'ঠিকানা কোটেশনের (") ভেতরে। a আর href-এর মাঝে একটি ফাঁক।',
          simplerBn: 'চার অংশ: <a href="ঠিকানা"> + লেখা + </a>।',
        }),
        both({
          id: 'h2-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '</ul>' },
          explanationBn: 'ফাইল সেভ করুন: Ctrl+S (Mac-এ Cmd+S)।',
          hintBn: 'অথবা ওপরের “💾 Save” বোতাম চাপুন।',
          successMessageBn: 'সেভ হয়েছে!',
        }),
      ],
      checklist: [
        { id: 'c-h1', textBn: 'শিরোনাম আর অনুচ্ছেদ লিখেছি', stepIds: ['h1-heading', 'h1-para'] },
        { id: 'c-list', textBn: 'তালিকা (ul, li) বানিয়েছি', stepIds: ['h2-li1', 'h2-li2', 'h2-ul-end'] },
        { id: 'c-link', textBn: 'লিংক বানিয়ে সেভ করেছি', stepIds: ['h2-link', 'h2-save'] },
      ],
      setup: setupFor({ 'index.html': HTML1 }),
      quiz: [
        {
          id: 'q-tags', type: 'dragMatch',
          questionBn: 'HTML ট্যাগের সাথে তার কাজ মেলান।',
          pairs: [
            { id: 'h1', leftBn: '<h1>', rightBn: 'বড় শিরোনাম' },
            { id: 'p', leftBn: '<p>', rightBn: 'অনুচ্ছেদ' },
            { id: 'ul', leftBn: '<ul>', rightBn: 'বুলেট-তালিকা' },
            { id: 'a', leftBn: '<a href>', rightBn: 'লিংক' },
          ],
          hintBn: 'h = heading, p = paragraph, ul = তালিকা, a = লিংক।',
          explanationBn: 'ট্যাগের নামগুলো ইংরেজি শব্দের সংক্ষেপ।',
        },
        {
          id: 'q-close', type: 'multipleChoice',
          questionBn: 'অনুচ্ছেদের বন্ধের ট্যাগ কোনটি?',
          options: [
            { id: 'a', textBn: '</p>' },
            { id: 'b', textBn: '<p>' },
            { id: 'c', textBn: '<end p>' },
          ],
          correct: ['a'],
          hintBn: 'বন্ধের ট্যাগে সামনে একটি / থাকে।',
          explanationBn: 'খোলার ট্যাগ <p>, বন্ধের ট্যাগ </p>।',
        },
        {
          id: 'q-list-order', type: 'ordering',
          questionBn: 'তালিকা বানানোর লাইনগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: '<ul> দিয়ে শুরু' },
            { id: '2', textBn: '<li>Rice</li>' },
            { id: '3', textBn: '<li>Dal</li>' },
            { id: '4', textBn: '</ul> দিয়ে শেষ' },
          ],
          hintBn: 'আগে তালিকা খুলি, আইটেম বসাই, শেষে বন্ধ করি।',
          explanationBn: 'যা খুলি, তা বন্ধ করি।',
        },
      ],
      recapBn: ['ট্যাগ খুলি, লিখি, বন্ধ করি', 'h1 শিরোনাম, p লেখা, ul/li তালিকা', 'কোড বদলালে প্রিভিউ বদলায়'],
      freeTryBn: 'তালিকায় আরেকটি পছন্দের খাবার যোগ করুন।',
    },

    // =====================================================================================================
    // 2. HTML: UTF-8 / Bengali, image + alt, comment
    // =====================================================================================================
    {
      id: 'html-extras',
      titleBn: 'বাংলা লেখা, ছবি ও alt',
      hook: {
        id: 'h-utf',
        type: 'hook',
        textBn: 'ফেসবুকে বাংলায় লেখা যায়। ওয়েবপেজেও যায়, শুধু ব্রাউজারকে একটা কথা বলে দিতে হয়।',
        visual: { kind: 'art', name: 'language', captionBn: 'বাংলা + ইংরেজি' },
      },
      cards: [
        {
          id: 'c-utf-bn',
          type: 'code',
          textBn: 'লেখার জায়গায় বাংলা চলে। কিন্তু ট্যাগের নাম **সবসময় ইংরেজি**।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [
              { code: '<h1>স্বাগতম</h1>', noteBn: 'বাংলা লেখা ঠিক আছে' },
              { code: '<p>ক্ষ, স্ত, ন্দ — যুক্তাক্ষরও ঠিকঠাক!</p>', noteBn: 'ট্যাগ p ইংরেজিতেই' },
            ],
            browserPreview: true,
          },
          chipsBn: ['লেখা বাংলা', 'ট্যাগ ইংরেজি'],
        },
        {
          id: 'c-utf8',
          type: 'code',
          textBn: 'এই এক লাইনে ব্রাউজার জানে লেখাটি **UTF-8** — তাই বাংলা অক্ষর ভাঙে না।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [
              { code: '<head>' },
              { code: '  <meta charset="utf-8">', noteBn: 'বাংলা ঠিক রাখার লাইন' },
              { code: '  <title>আমার পাতা</title>' },
              { code: '</head>' },
            ],
          },
          learnMoreBn: 'UTF-8 এমন একটি ব্যবস্থা, যাতে বাংলাসহ পৃথিবীর প্রায় সব ভাষার অক্ষর ঠিকঠাক সেভ ও দেখা যায়। এই লাইনটি প্রতিটি পাতার <head>-এ রাখা ভালো। <head>-এর জিনিস পাতায় দেখা যায় না; <body>-র জিনিসই পর্দায় দেখা যায়।',
        },
        {
          id: 'c-img',
          type: 'code',
          textBn: 'ছবির ট্যাগে **src** ফাইলের নাম, আর **alt** ছবির বর্ণনা। বন্ধের ট্যাগ লাগে না।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [{ code: '<img src="photo.jpg" alt="My photo">', noteBn: 'ছবি না এলে alt দেখা যায়' }],
            browserPreview: true,
          },
          learnMoreBn: 'এই প্রিভিউতে আসল ছবি আসে না, তাই ছবির জায়গায় alt-এর লেখাটি দেখা যায়। যাঁরা চোখে দেখেন না, তাঁদের স্ক্রিন-রিডারও alt পড়ে শোনায় — তাই alt জরুরি।',
        },
        {
          id: 'c-comment',
          type: 'code',
          textBn: '**মন্তব্য** আপনার নিজের নোট। ব্রাউজার একে দেখায়ই না।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [
              { code: '<!-- my first image -->', noteBn: 'শুধু নোট, পাতায় নেই' },
              { code: '<p>Hello</p>', noteBn: 'শুধু এটি দেখা যায়' },
            ],
            browserPreview: true,
          },
        },
      ],
      steps: [
        both({
          id: 'h3-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
          explanationBn: 'index.html খুলুন; প্রিভিউতে বাংলা লেখা দেখুন।',
          hintBn: 'বাঁ দিকের তালিকায় index.html।',
        }),
        both({
          id: 'h3-meta', titleBn: 'UTF-8 ঘোষণা', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<meta charset="utf-8">' },
          explanationBn: '৫ নম্বর ফাঁকা লাইনে লিখুন: <meta charset="utf-8">',
          hintBn: '<title>-এর নিচের ফাঁকা লাইন। utf-8 লিখতে মাঝে হাইফেন (-)।',
          simplerBn: 'চার ভাগ: <meta, ফাঁক, charset="utf-8", আর >।',
        }),
        both({
          id: 'h3-img', titleBn: 'ছবির ট্যাগ ও alt', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<img src="photo.jpg" alt="My photo">' },
          explanationBn: '১০ নম্বর ফাঁকা লাইনে লিখুন: <img src="photo.jpg" alt="My photo">',
          hintBn: 'অনুচ্ছেদের নিচের ফাঁকা লাইন। শুধু src আর alt লাগে।',
          simplerBn: 'এই লাইনটি হুবহু টাইপ করুন।',
          successMessageBn: 'ছবির জায়গায় alt লেখা!',
        }),
        both({
          id: 'h3-comment', titleBn: 'একটি মন্তব্য', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<!-- my first image -->' },
          explanationBn: 'Enter চেপে লিখুন: <!-- my first image -->',
          hintBn: 'শুরুতে <!-- (বিস্ময়চিহ্ন, দুই হাইফেন), শেষে -->।',
        }),
        both({
          id: 'h3-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '<!-- my first image -->' },
          explanationBn: 'ফাইল সেভ করুন: Ctrl+S (Mac-এ Cmd+S)।',
          hintBn: 'অথবা ওপরের “💾 Save” বোতাম।',
        }),
      ],
      checklist: [
        { id: 'c-utf', textBn: 'UTF-8 লাইন দিয়েছি', stepIds: ['h3-meta'] },
        { id: 'c-img', textBn: 'alt-সহ ছবির ট্যাগ লিখেছি', stepIds: ['h3-img'] },
        { id: 'c-cm', textBn: 'মন্তব্য লিখে সেভ করেছি', stepIds: ['h3-comment', 'h3-save'] },
      ],
      setup: setupFor({ 'index.html': HTML3 }),
      quiz: [
        {
          id: 'q-utf', type: 'multipleChoice',
          questionBn: 'বাংলা ঠিকঠাক দেখাতে <head>-এ কোন লাইন দিই?',
          options: [
            { id: 'a', textBn: '<meta charset="utf-8">' },
            { id: 'b', textBn: '<bangla on>' },
            { id: 'c', textBn: '<title>বাংলা</title>' },
          ],
          correct: ['a'],
          hintBn: 'ব্রাউজারকে অক্ষরের নিয়ম জানাতে হয়।',
          explanationBn: 'UTF-8 থাকলে বাংলা অক্ষর ভাঙে না।',
        },
        {
          id: 'q-img', type: 'clickTarget',
          questionBn: 'কোনটি alt-সহ ঠিক ছবির ট্যাগ?',
          items: [
            { id: 'ok', labelBn: '<img src="a.jpg" alt="Tea">', icon: '🖼️' },
            { id: 'noalt', labelBn: '<img src="a.jpg">', icon: '🙈' },
            { id: 'a', labelBn: '<a src="a.jpg">', icon: '🔗' },
          ],
          correct: 'ok',
          hintBn: 'ছবির বর্ণনা alt-এ থাকে।',
          explanationBn: 'img ট্যাগে src আর alt দুটোই লাগে।',
        },
        {
          id: 'q-attrs', type: 'dragMatch',
          questionBn: 'শব্দের সাথে কাজ মেলান।',
          pairs: [
            { id: 'alt', leftBn: 'alt', rightBn: 'ছবির বর্ণনা' },
            { id: 'src', leftBn: 'src', rightBn: 'ছবির ফাইল' },
            { id: 'cm', leftBn: '<!-- -->', rightBn: 'নিজের নোট' },
            { id: 'utf', leftBn: 'utf-8', rightBn: 'বাংলা ঠিক রাখে' },
          ],
          hintBn: 'src = source (উৎস), alt = বিকল্প লেখা।',
          explanationBn: 'চারটিই ছোট কিন্তু জরুরি।',
        },
      ],
      recapBn: ['লেখা বাংলা, ট্যাগ ইংরেজি', 'meta charset বাংলা ঠিক রাখে', 'ছবিতে alt দিন'],
    },

    // =====================================================================================================
    // 3. CSS
    // =====================================================================================================
    {
      id: 'css',
      titleBn: 'CSS: রং, আকার, ফাঁক',
      hook: {
        id: 'h-css',
        type: 'hook',
        textBn: 'HTML ঘরের দেয়াল। **CSS** হলো রং আর পর্দা — ঘরটাকে সুন্দর করে।',
        visual: { kind: 'art', name: 'css-brush', captionBn: 'সাজসজ্জা' },
      },
      cards: [
        {
          id: 'c-css-anatomy',
          type: 'visual',
          textBn: 'CSS-এর নিয়মের তিন অংশ: কাকে, কী, কীভাবে। অংশগুলোতে ক্লিক করে দেখুন।',
          visual: { kind: 'widget', widget: 'html-anatomy', props: { mode: 'css' } },
          learnMoreBn: 'সিলেক্টর (কাকে সাজাব), প্রপার্টি (কী বদলাব) আর ভ্যালু (কীভাবে)। প্রতিটি নিয়মের শেষে সেমিকোলন (;), আর সব নিয়ম { } বন্ধনীর ভেতরে।',
        },
        {
          id: 'c-css-color',
          type: 'code',
          textBn: 'শিরোনামের **রং** বদলাতে এই নিয়ম। শেষে সেমিকোলন (;) ভুলবেন না।',
          visual: {
            kind: 'code',
            lang: 'css',
            lines: [
              { code: 'h1 {', noteBn: 'কাকে সাজাব: শিরোনামকে' },
              { code: '  color: teal;', noteBn: 'কী : কীভাবে' },
              { code: '}' },
            ],
            browserPreview: true,
          },
        },
        {
          id: 'c-css-link',
          type: 'code',
          textBn: 'CSS থাকে আলাদা **ফাইলে**। এই লাইনটি সেই ফাইলকে পাতার সাথে জোড়ে।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [{ code: '<link rel="stylesheet" href="style.css">', noteBn: '<head>-এর ভেতরে বসে' }],
          },
          learnMoreBn: 'এই লাইনটিই বলে দেয় সাজসজ্জা কোন ফাইলে আছে। লিখে ফাইলটি সেভ করা চাই, নইলে বদল ধরা পড়বে না।',
        },
        {
          id: 'c-css-size',
          type: 'code',
          textBn: 'লেখার **আকার** আর **সারি**। px মানে পর্দার ছোট বিন্দু — সংখ্যা বাড়লে লেখা বড়।',
          visual: {
            kind: 'code',
            lang: 'css',
            lines: [
              { code: 'h1 {' },
              { code: '  font-size: 48px;', noteBn: 'আকার' },
              { code: '  text-align: center;', noteBn: 'মাঝখানে (left / right-ও হয়)' },
              { code: '}' },
            ],
            browserPreview: true,
          },
        },
        {
          id: 'c-css-bg',
          type: 'code',
          textBn: 'পুরো পাতার পেছনের **রং** আর চারপাশের বাইরের ফাঁক (**margin**)।',
          visual: {
            kind: 'code',
            lang: 'css',
            lines: [
              { code: 'body {', noteBn: 'body = পুরো পাতা' },
              { code: '  background-color: lightyellow;', noteBn: 'পেছনের রং' },
              { code: '  margin: 40px;', noteBn: 'বাইরের ফাঁক' },
              { code: '}' },
            ],
            browserPreview: true,
          },
        },
        {
          id: 'c-css-pad',
          type: 'code',
          textBn: '**padding** হলো ভেতরের ফাঁক: ছবি আর ফ্রেমের মাঝের অংশ। margin বাইরের।',
          visual: {
            kind: 'code',
            lang: 'css',
            lines: [
              { code: 'p {' },
              { code: '  background-color: white;', noteBn: 'সাদা বাক্স' },
              { code: '  padding: 16px;', noteBn: 'বাক্সের ভেতরের ফাঁক' },
              { code: '}' },
            ],
            browserPreview: true,
          },
          chipsBn: ['margin = বাইরে', 'padding = ভেতরে'],
          learnMoreBn: 'ছবির ফ্রেমের কথা ভাবুন। দেয়ালে এক ফ্রেম থেকে আরেক ফ্রেমের দূরত্ব margin। ফ্রেমের ভেতরে ছবি আর কিনারার মাঝের সাদা অংশ padding।',
        },
      ],
      steps: [
        both({
          id: 'c1-open-html', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
          explanationBn: 'আগে index.html খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় index.html।',
        }),
        both({
          id: 'c1-link', titleBn: 'style.css জুড়ুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: 'href="style.css"' },
          explanationBn: '৬ নম্বর ফাঁকা লাইনে কার্ডের link লাইনটি লিখে সেভ করুন।',
          hintBn: 'লিখুন: <link rel="stylesheet" href="style.css"> — তারপর Ctrl/Cmd+S।',
          simplerBn: 'সেভ হলে তবেই ধাপ শেষ হবে।',
        }),
        both({
          id: 'c1-open-css', titleBn: 'style.css খুলুন', target: 'code-explorer-style.css', expectedAction: { type: 'click', target: 'code-explorer-style.css' },
          explanationBn: 'এবার তালিকা থেকে style.css খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় style.css।',
        }),
        both({
          id: 'c1-color', titleBn: 'লেখার রং', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'color: teal' },
          explanationBn: '৩ নম্বর লাইনে (h1-এর ভেতরে) লিখুন: color: teal;',
          hintBn: 'color, কোলন (:), ফাঁক, teal, সেমিকোলন (;)।',
          successMessageBn: 'শিরোনাম সবুজ-নীল হলো!',
        }),
        both({
          id: 'c1-size', titleBn: 'লেখার আকার', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'font-size: 48px' },
          explanationBn: 'Enter চেপে লিখুন: font-size: 48px;',
          hintBn: 'font আর size-এর মাঝে হাইফেন (-)।',
        }),
        both({
          id: 'c1-align', titleBn: 'লেখা মাঝখানে', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'text-align: center' },
          explanationBn: 'Enter চেপে লিখুন: text-align: center;',
          hintBn: 'text-align: center; — হাইফেন আর কোলন খেয়াল করুন।',
        }),
        both({
          id: 'c2-bg', titleBn: 'পাতার পেছনের রং', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'background-color: lightyellow' },
          explanationBn: 'body-র ভেতরের ফাঁকা লাইনে লিখুন: background-color: lightyellow;',
          hintBn: 'h1-এর নিচে body { আর } চিহ্নের মাঝের ফাঁকা লাইন।',
          successMessageBn: 'পাতার পেছনে হালকা হলুদ!',
        }),
        both({
          id: 'c2-margin', titleBn: 'বাইরের ফাঁক (margin)', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'margin: 40px' },
          explanationBn: 'Enter চেপে লিখুন: margin: 40px;',
          hintBn: 'সংখ্যার পরে px।',
        }),
        both({
          id: 'c2-p-bg', titleBn: 'অনুচ্ছেদের ব্যাকগ্রাউন্ড', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'background-color: white' },
          explanationBn: 'p-র ভেতরের ফাঁকা লাইনে লিখুন: background-color: white;',
          hintBn: 'ফাইলের শেষের দিকে p { আর } চিহ্নের মাঝের ফাঁকা লাইন।',
        }),
        both({
          id: 'c2-padding', titleBn: 'ভেতরের ফাঁক (padding)', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'padding: 16px' },
          explanationBn: 'Enter চেপে লিখুন: padding: 16px;',
          hintBn: 'সাদা বাক্সের ভেতরে লেখা কিনারা থেকে সরে এসেছে কি?',
          successMessageBn: 'margin আর padding চোখে দেখলেন!',
        }),
        both({
          id: 'c2-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/style.css`, text: 'padding: 16px' },
          explanationBn: 'style.css সেভ করুন: Ctrl+S (Mac-এ Cmd+S)।',
          hintBn: 'অথবা ওপরের “💾 Save” বোতাম।',
        }),
      ],
      checklist: [
        { id: 'c-link', textBn: 'style.css-কে পাতার সাথে জুড়েছি', stepIds: ['c1-link'] },
        { id: 'c-color', textBn: 'রং, আকার আর সারি বদলেছি', stepIds: ['c1-color', 'c1-size', 'c1-align'] },
        { id: 'c-space', textBn: 'margin আর padding দিয়ে সেভ করেছি', stepIds: ['c2-margin', 'c2-padding', 'c2-save'] },
      ],
      setup: setupFor({ 'index.html': CSS_INDEX1, 'style.css': CSS_ALL }),
      quiz: [
        {
          id: 'q-css', type: 'multipleChoice',
          questionBn: 'CSS-এ লেখার রং লাল করতে কোন লাইনটি লিখবেন?',
          options: [
            { id: 'a', textBn: 'color: red;' },
            { id: 'b', textBn: 'text = red' },
            { id: 'c', textBn: '<red>লেখা</red>' },
          ],
          correct: ['a'],
          hintBn: 'নিয়ম: প্রপার্টি, কোলন (:), ভ্যালু, সেমিকোলন (;)।',
          explanationBn: 'color প্রপার্টি, red ভ্যালু, শেষে সেমিকোলন।',
        },
        {
          id: 'q-semi', type: 'clickTarget',
          questionBn: 'কোন লাইনে সেমিকোলন (;) বাদ পড়েছে?',
          items: [
            { id: 'l1', labelBn: 'color: teal;', icon: '1️⃣' },
            { id: 'l2', labelBn: 'font-size: 48px', icon: '2️⃣' },
            { id: 'l3', labelBn: 'text-align: center;', icon: '3️⃣' },
          ],
          correct: 'l2',
          hintBn: 'প্রতিটি নিয়মের শেষে ; থাকে।',
          explanationBn: 'দ্বিতীয় লাইনের শেষে ; নেই।',
        },
        {
          id: 'q-props', type: 'dragMatch',
          questionBn: 'প্রপার্টির সাথে কাজ মেলান।',
          pairs: [
            { id: 'color', leftBn: 'color', rightBn: 'লেখার রং' },
            { id: 'fs', leftBn: 'font-size', rightBn: 'লেখার আকার' },
            { id: 'margin', leftBn: 'margin', rightBn: 'বাইরের ফাঁক' },
            { id: 'padding', leftBn: 'padding', rightBn: 'ভেতরের ফাঁক' },
          ],
          hintBn: 'margin ফ্রেমের বাইরে, padding ফ্রেমের ভেতরে।',
          explanationBn: 'রং, আকার আর ফাঁক — সাজসজ্জার তিন সঙ্গী।',
        },
      ],
      recapBn: ['সিলেক্টর { প্রপার্টি: ভ্যালু; }', 'link দিয়ে style.css জোড়ি', 'margin বাইরে, padding ভেতরে'],
      freeTryBn: 'teal বদলে অন্য রঙের নাম লিখে দেখুন।',
    },

    // =====================================================================================================
    // 4. Python: print, variables, the friendly error
    // =====================================================================================================
    {
      id: 'py-print',
      titleBn: 'পাইথন: print, ভেরিয়েবল, ভুল',
      hook: {
        id: 'h-py',
        type: 'hook',
        textBn: 'রেসিপি লিখে দিলে রাঁধুনি ঠিক সেভাবে রান্না করে। কম্পিউটারও — এটাই **প্রোগ্রাম**।',
        visual: { kind: 'art', name: 'recipe-card', captionBn: 'ধাপে ধাপে নির্দেশ' },
      },
      cards: [
        {
          id: 'c-py-print',
          type: 'code',
          textBn: '**print** মানে পর্দায় ছাপা। চালালে আউটপুট আসে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [{ code: 'print("Hello, Python!")', noteBn: 'কোটেশনের ভেতরের লেখা ছাপে' }],
            output: ['Hello, Python!'],
          },
          learnMoreBn: 'পাইথন এমন একটি প্রোগ্রামিং ভাষা, যার কোড ইংরেজি বাক্যের মতো পড়া যায়। .py ফাইল মানে পাইথনের প্রোগ্রাম। কোটেশনের ভেতরের লেখাকে বলে স্ট্রিং; বাংলা লেখাও স্ট্রিং হতে পারে।',
        },
        {
          id: 'c-py-var',
          type: 'code',
          textBn: '**ভেরিয়েবল** একটি নাম-লেখা বাক্স। + দিয়ে দুটি লেখা জোড়া যায়।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'name = "Rumi"', noteBn: 'name বাক্সে Rumi রাখা' },
              { code: 'print("Hello, " + name)', noteBn: 'লেখা + বাক্সের লেখা' },
            ],
            output: ['Hello, Rumi'],
          },
          chipsBn: ['ভেরিয়েবল = বাক্স'],
        },
        {
          id: 'c-py-predict',
          type: 'visual',
          textBn: 'আগে **আন্দাজ**, তারপর চালান। আন্দাজ ভুল হলেও ক্ষতি নেই — ভুল আন্দাজই বেশি শেখায়।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'brain', labelBn: 'আন্দাজ' },
              { art: 'terminal', labelBn: 'চালান' },
              { art: 'check', labelBn: 'মিলান' },
            ],
          },
          learnMoreBn: 'পাইথন প্রথমবার চালু হতে এক-দুই সেকেন্ড সময় নেয়, তাই ▶ Run চেপে একটু অপেক্ষা করুন। শুধু name বদলালেই পুরো শুভেচ্ছা বদলায় — এটাই ভেরিয়েবলের শক্তি।',
        },
        {
          id: 'c-py-error',
          type: 'code',
          textBn: 'বানান ভুল হলে **এরর** আসে। ভয় নেই — এডিটর বাংলায় বলে দেবে কী হয়েছে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [{ code: 'prnt("Hello")', noteBn: 'print-এর i বাদ পড়েছে!' }],
            output: ["'prnt' নামটি খুঁজে পাওয়া যাচ্ছে না"],
          },
          chipsBn: ['এরর = বন্ধুর ইশারা', 'বাগ = কোডের ভুল'],
          learnMoreBn: 'এরর হলো কম্পিউটারের বলা “এই লাইনে আমি বুঝতে পারছি না”। বাগ হলো কোডের ভুল। প্রোগ্রামাররা রোজ বাগ খুঁজে সারান, এটাই কাজের স্বাভাবিক অংশ। এডিটর বাংলায় বোঝাবে, নিচে আসল ইংরেজি বার্তাও দেখাবে।',
        },
      ],
      steps: [
        both({
          id: 'p1-open', titleBn: 'hello.py খুলুন', target: 'code-explorer-hello.py', expectedAction: { type: 'click', target: 'code-explorer-hello.py' },
          explanationBn: 'বাঁ পাশের তালিকা থেকে hello.py খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় hello.py।',
        }),
        both({
          id: 'p1-predict', titleBn: 'আগে আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Hello, Python!'] },
          explanationBn: 'চালালে কী ছাপা হবে? নিচের ঘরে লিখুন।',
          hintBn: 'কোটেশনের ভেতরের লেখাটিই ছাপা হয়, কোটেশন ছাড়া।',
          simplerBn: 'উত্তর: Hello, Python!',
        }),
        both({
          id: 'p1-run', titleBn: 'চালান (Run)', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Python!', language: 'python' },
          explanationBn: 'সবুজ ▶ Run বোতাম চাপুন।',
          hintBn: 'প্রথমবার পাইথন চালু হতে ১–২ সেকেন্ড লাগে। একটু অপেক্ষা করুন।',
          successMessageBn: 'আপনার প্রথম প্রোগ্রাম চলল!',
        }),
        both({
          id: 'p1-line2', titleBn: 'নিজের লাইন যোগ করুন', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Python!\nMy name is Rumi', language: 'python' },
          explanationBn: 'শেষে নতুন লাইনে লিখে ▶ Run চাপুন: print("My name is Rumi")',
          hintBn: 'ফাইলের শেষে ক্লিক করে Enter চাপুন। বন্ধনী এডিটর নিজেই বসায়।',
          simplerBn: 'চালানোর আগে ফাইল নিজে নিজে সেভ হয়ে যায়।',
        }),
        both({
          id: 'p1-open2', titleBn: 'greet.py খুলুন', target: 'code-explorer-greet.py', expectedAction: { type: 'click', target: 'code-explorer-greet.py' },
          explanationBn: 'এবার greet.py খুলুন; এতে ভেরিয়েবল আছে।',
          hintBn: 'বাঁ দিকের তালিকায় greet.py।',
        }),
        both({
          id: 'p1-predict2', titleBn: 'আবার আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Hello, Rumi'] },
          explanationBn: 'কী ছাপা হবে? ঘরে লিখুন।',
          hintBn: '"Hello, " আর name-এর লেখা পাশাপাশি বসবে। কমার পরে ফাঁক আছে।',
          simplerBn: 'উত্তর: Hello, Rumi',
        }),
        both({
          id: 'p1-run2', titleBn: 'নামটি বদলে চালান', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Anika', language: 'python' },
          explanationBn: 'Rumi বদলে Anika লিখুন, তারপর ▶ Run চাপুন।',
          hintBn: 'প্রথম লাইন হবে: name = "Anika"। কোটেশন মুছবেন না।',
          simplerBn: 'Rumi-তে ডাবল ক্লিক করে বেছে লিখুন। ভুলে Ctrl/Cmd+Z।',
          successMessageBn: 'এক জায়গায় বদল, সব জায়গায় বদল!',
        }),
        both({
          id: 'p4-open-oops', titleBn: 'oops.py খুলুন', target: 'code-explorer-oops.py', expectedAction: { type: 'click', target: 'code-explorer-oops.py' },
          explanationBn: 'oops.py খুলুন; এতে ইচ্ছাকৃত একটি ভুল আছে।',
          hintBn: 'বাঁ দিকের তালিকায় oops.py।',
        }),
        both({
          id: 'p4-run-error', titleBn: 'ভুলসহ চালান', target: 'code-run', expectedAction: { type: 'custom', event: 'code-run-error' },
          explanationBn: '▶ Run চাপুন — এরর আসাই এই ধাপের লক্ষ্য!',
          hintBn: 'কমলা বাক্সে বাংলায় বলা থাকবে কী হয়েছে।',
        }),
        both({
          id: 'p4-fix', titleBn: 'ভুল সারান', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello', language: 'python' },
          explanationBn: 'prnt-কে print করে ▶ Run চাপুন।',
          hintBn: 'p আর r-এর পরে i বসান। বাকিটা যেমন আছে।',
          simplerBn: 'পুরো লাইন হবে: print("Hello")',
          successMessageBn: 'বাগ ধরে সারালেন!',
        }),
      ],
      checklist: [
        { id: 'c-print', textBn: 'print দিয়ে লেখা ছাপিয়েছি', stepIds: ['p1-run', 'p1-line2'] },
        { id: 'c-var', textBn: 'ভেরিয়েবল বদলে ফল বদলেছি', stepIds: ['p1-run2'] },
        { id: 'c-bug', textBn: 'একটি বাগ খুঁজে সারিয়েছি', stepIds: ['p4-run-error', 'p4-fix'] },
      ],
      setup: setupFor({ 'hello.py': PY_HELLO, 'greet.py': PY_GREET, 'oops.py': PY_OOPS }),
      quiz: [
        {
          id: 'q-predict', type: 'predictOutput', language: 'python',
          questionBn: 'এই প্রোগ্রাম চালালে কী ছাপা হবে? শুধু ফলটি লিখুন।',
          code: 'x = 4\nprint(x * 3)',
          acceptedAnswers: ['12'],
          hintBn: 'x-এ আছে ৪। ৪-কে ৩ দিয়ে গুণ করুন।',
          explanationBn: 'x * 3 = 4 × 3 = 12।',
        },
        {
          id: 'q-typo', type: 'clickTarget',
          questionBn: 'কোন লাইনে বানান ভুল আছে?',
          items: [
            { id: 'l1', labelBn: 'print("Hi")', icon: '1️⃣' },
            { id: 'l2', labelBn: 'prnt("Hi")', icon: '2️⃣' },
            { id: 'l3', labelBn: 'print("Bye")', icon: '3️⃣' },
          ],
          correct: 'l2',
          hintBn: 'print শব্দটি মিলিয়ে দেখুন।',
          explanationBn: 'prnt-এ i নেই — এরর আসবে।',
        },
        {
          id: 'q-var', type: 'multipleChoice',
          questionBn: 'name = "Anika" লিখলে name বাক্সে কী থাকে?',
          options: [
            { id: 'a', textBn: 'Anika' },
            { id: 'b', textBn: 'শব্দ name' },
            { id: 'c', textBn: 'কিছুই না' },
          ],
          correct: ['a'],
          hintBn: '= চিহ্ন বাক্সে জিনিস রাখে।',
          explanationBn: 'বাক্সের নাম name, ভেতরে Anika।',
        },
      ],
      recapBn: ['print পর্দায় ছাপে', 'ভেরিয়েবল = নাম-লেখা বাক্স', 'এরর পড়ুন, বাগ সারুন'],
      freeTryBn: 'hello.py-তে নিজের নাম ছাপান।',
    },

    // =====================================================================================================
    // 5. Python: input and arithmetic
    // =====================================================================================================
    {
      id: 'py-input',
      titleBn: 'পাইথন: input ও অঙ্ক',
      hook: {
        id: 'h-input',
        type: 'hook',
        textBn: 'চায়ের দোকানি জিজ্ঞেস করেন “কয় চামচ চিনি?” — প্রোগ্রামও **প্রশ্ন** করতে পারে।',
        visual: { kind: 'art', name: 'tea-cup', captionBn: 'প্রশ্ন, উত্তর, কাজ' },
      },
      cards: [
        {
          id: 'c-in-input',
          type: 'code',
          textBn: '**input** প্রশ্ন করে উত্তর নেয়। উত্তর লিখবেন একটি নীল বাক্সে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'name = input("What is your name? ")', noteBn: 'প্রশ্ন, উত্তর name-এ' },
              { code: 'print("Hello, " + name)', noteBn: 'উত্তর দিয়ে শুভেচ্ছা' },
            ],
            output: ['What is your name? Anika', 'Hello, Anika'],
          },
          learnMoreBn: '▶ Run চাপলে আউটপুটের জায়গায় একটি নীল বাক্স আসবে। সেখানে উত্তর লিখে “পাঠান” (বা Enter) চাপুন।',
        },
        {
          id: 'c-in-math',
          type: 'code',
          textBn: 'যোগ **+**, বিয়োগ -, গুণ *, ভাগ /। ঘাত দুটি তারা-চিহ্ন; ভাগে দশমিকও আসে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'price = 25' },
              { code: 'count = 4' },
              { code: 'print(price * count)', noteBn: '২৫ × ৪' },
              { code: 'print(2 ** 3)', noteBn: '২×২×২' },
              { code: 'print(7 / 2)', noteBn: '৭ ÷ ২' },
            ],
            output: ['100', '8', '3.5'],
          },
        },
        {
          id: 'c-in-int',
          type: 'code',
          textBn: 'input-এর উত্তর আসে **লেখা** হয়ে। হিসাব করতে int(…) দিয়ে সংখ্যা বানান।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'age = int(input("How old are you? "))', noteBn: 'লেখা → পূর্ণসংখ্যা' },
              { code: 'print(age + 1)', noteBn: 'এখন যোগ করা যায়' },
            ],
            output: ['How old are you? 30', '31'],
          },
          learnMoreBn: 'input() সবসময় লেখা (স্ট্রিং) ফেরত দেয়, সংখ্যা নয়। তাই int(…) দিয়ে সেটিকে পূর্ণসংখ্যায় (Integer) বদলে নেওয়া হয়েছে, নইলে ১ যোগ করা যেত না।',
        },
        {
          id: 'c-in-trace',
          type: 'visual',
          textBn: 'এক লাইন করে চলতে দেখুন: বাক্সে কী জমছে, কী ছাপা হচ্ছে।',
          visual: { kind: 'widget', widget: 'code-trace' },
        },
      ],
      steps: [
        both({
          id: 'p2-open-ask', titleBn: 'ask.py খুলুন', target: 'code-explorer-ask.py', expectedAction: { type: 'click', target: 'code-explorer-ask.py' },
          explanationBn: 'বাঁ পাশের তালিকা থেকে ask.py খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় ask.py।',
        }),
        both({
          id: 'p2-run-ask', titleBn: 'চালিয়ে উত্তর দিন', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Anika', language: 'python' },
          explanationBn: '▶ Run চাপুন, নীল বাক্সে Anika লিখে পাঠান।',
          hintBn: 'বাক্সটি আউটপুটের জায়গায় আসে। প্রথমবার ১–২ সেকেন্ড লাগতে পারে।',
          simplerBn: 'Run, তারপর বাক্সে Anika, তারপর পাঠান।',
          successMessageBn: 'এটাই input!',
        }),
        both({
          id: 'p2-open-calc', titleBn: 'calc.py খুলুন', target: 'code-explorer-calc.py', expectedAction: { type: 'click', target: 'code-explorer-calc.py' },
          explanationBn: 'calc.py খুলুন; এতে হিসাবের চিহ্ন আছে।',
          hintBn: 'বাঁ দিকের তালিকায় calc.py।',
        }),
        both({
          id: 'p2-predict', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['100'] },
          explanationBn: 'প্রথম print কত ছাপবে? শুধু ফল লিখুন।',
          hintBn: 'price আর count গুণ করুন।',
          simplerBn: '২৫ × ৪ = ১০০। ঘরে লিখুন: 100',
        }),
        both({
          id: 'p2-run-calc', titleBn: 'চালান', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: '100\n8\n3.5', language: 'python' },
          explanationBn: '▶ Run চাপুন; তিনটি ফল আসবে।',
          hintBn: 'লক্ষ করুন, ভাগে দশমিক সংখ্যা আসে।',
        }),
        both({
          id: 'p2-open-next', titleBn: 'next.py খুলুন', target: 'code-explorer-next.py', expectedAction: { type: 'click', target: 'code-explorer-next.py' },
          explanationBn: 'next.py খুলুন; এতে int(…) আছে।',
          hintBn: 'বাঁ দিকের তালিকায় next.py।',
        }),
        both({
          id: 'p2-predict2', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['31'] },
          explanationBn: 'কেউ বয়স 30 লিখলে কী ছাপা হবে?',
          hintBn: '৩০ + ১ কত?',
        }),
        both({
          id: 'p2-run-next', titleBn: 'চালিয়ে মিলিয়ে দেখুন', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: '31', language: 'python' },
          explanationBn: '▶ Run চাপুন, নীল বাক্সে 30 লিখে পাঠান।',
          hintBn: 'ইংরেজি অঙ্কে লিখুন: 30',
          successMessageBn: 'প্রোগ্রাম হিসাবও করল!',
        }),
      ],
      checklist: [
        { id: 'c-input', textBn: 'input দিয়ে উত্তর নিয়েছি', stepIds: ['p2-run-ask'] },
        { id: 'c-math', textBn: '+ - * / ** দিয়ে হিসাব দেখেছি', stepIds: ['p2-run-calc'] },
        { id: 'c-int', textBn: 'int() দিয়ে লেখাকে সংখ্যা বানিয়েছি', stepIds: ['p2-run-next'] },
      ],
      setup: setupFor({ 'ask.py': PY_ASK, 'calc.py': PY_CALC, 'next.py': PY_NEXT }),
      quiz: [
        {
          id: 'q-mul', type: 'predictOutput', language: 'python',
          questionBn: 'এই প্রোগ্রামের আউটপুট কী? শুধু ফলটি লিখুন।',
          code: 'a = 6\nb = 7\nprint(a * b)',
          acceptedAnswers: ['42'],
          hintBn: '৬ গুণ ৭।',
          explanationBn: 'a * b = 6 × 7 = 42।',
        },
        {
          id: 'q-input-type', type: 'multipleChoice',
          questionBn: 'input() থেকে পাওয়া উত্তর কী ধরনের?',
          options: [
            { id: 'a', textBn: 'লেখা (স্ট্রিং)' },
            { id: 'b', textBn: 'সরাসরি সংখ্যা' },
            { id: 'c', textBn: 'কিছুই না' },
          ],
          correct: ['a'],
          hintBn: 'সংখ্যা চাইলে একটি ফাংশন লাগে।',
          explanationBn: 'সংখ্যা চাইলে int(…) দিয়ে বদলাতে হয়।',
        },
        {
          id: 'q-ops', type: 'dragMatch',
          questionBn: 'চিহ্নের সাথে কাজ মেলান।',
          pairs: [
            { id: 'plus', leftBn: '+', rightBn: 'যোগ' },
            { id: 'mul', leftBn: '*', rightBn: 'গুণ' },
            { id: 'div', leftBn: '/', rightBn: 'ভাগ' },
            { id: 'pow', leftBn: '**', rightBn: 'ঘাত' },
          ],
          hintBn: '** মানে ঘাত: 2 ** 3 = 8।',
          explanationBn: 'পাইথনে গুণ * আর ঘাত **।',
        },
      ],
      recapBn: ['input প্রশ্ন করে', 'উত্তর লেখা — সংখ্যায় int()', '+ - * / ** দিয়ে হিসাব'],
      freeTryBn: 'calc.py-তে price বদলে ফল দেখুন।',
    },

    // =====================================================================================================
    // 6. Python: if / else and for loop
    // =====================================================================================================
    {
      id: 'py-logic',
      titleBn: 'পাইথন: if / else ও লুপ',
      hook: {
        id: 'h-logic',
        type: 'hook',
        textBn: '“বয়স ১৮ হলে ভোটার” — এমন **যদি-নইলে** সিদ্ধান্ত আপনি রোজই নেন।',
        visual: { kind: 'art', name: 'branch', captionBn: 'যদি — নইলে' },
      },
      cards: [
        {
          id: 'c-lg-if',
          type: 'code',
          textBn: '**if** মানে যদি, **else** মানে নইলে। শর্ত সত্য হলে একটি কাজ, না হলে আরেকটি।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'age = 20' },
              { code: 'if age >= 18:', noteBn: 'বয়স ১৮ বা বেশি?' },
              { code: '    print("Adult")', noteBn: 'হ্যাঁ হলে এটি' },
              { code: 'else:' },
              { code: '    print("Not yet an adult")', noteBn: 'নইলে এটি' },
            ],
            output: ['Adult'],
          },
        },
        {
          id: 'c-lg-indent',
          type: 'code',
          textBn: 'ডান দিকে সরানো লাইনগুলো ভেতরের কাজ। একে বলে **ইন্ডেন্টেশন**; কোলন (:) ভুলবেন না।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'age = 20' },
              { code: 'if age >= 18:', noteBn: 'শেষে কোলন (:)' },
              { code: '    print("Adult")', noteBn: '৪ ঘর সরানো = ভেতরে' },
              { code: 'print("Done")', noteBn: 'সরানো নয় = বাইরে, সবসময় চলে' },
            ],
            output: ['Adult', 'Done'],
          },
          learnMoreBn: 'পাইথনে ইন্ডেন্টেশন শুধু সাজ নয়, নিয়মের অংশ। এডিটরে Enter চাপলে লাইন নিজে ভেতরে সরে, আবার else: লিখলে নিজে বাইরে আসে।',
        },
        {
          id: 'c-lg-widget',
          type: 'visual',
          textBn: 'সুইচ ঘুরিয়ে দেখুন কোন পথে সিদ্ধান্ত যায়।',
          visual: { kind: 'widget', widget: 'if-else-explorer' },
        },
        {
          id: 'c-lg-loop',
          type: 'code',
          textBn: '**for** লুপ একই কাজ বারবার করায়। i-এর মান হয় 0, 1, 2 — গোনা শুরু ০ থেকে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'for i in range(3):', noteBn: 'তিনবার চলবে' },
              { code: '    print("Hello", i)', noteBn: 'কমা = মাঝে একটি ফাঁক' },
            ],
            output: ['Hello 0', 'Hello 1', 'Hello 2'],
          },
          chipsBn: ['গোনা শুরু ০ থেকে'],
        },
      ],
      steps: [
        both({
          id: 'p3-open', titleBn: 'check.py খুলুন', target: 'code-explorer-check.py', expectedAction: { type: 'click', target: 'code-explorer-check.py' },
          explanationBn: 'বাঁ পাশের তালিকা থেকে check.py খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় check.py।',
        }),
        both({
          id: 'p3-predict', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Adult'] },
          explanationBn: 'age = 20 হলে কী ছাপা হবে? হুবহু লিখুন।',
          hintBn: '২০ কি ১৮-এর সমান বা বেশি? হ্যাঁ হলে if-এর ভেতরের লাইন চলে।',
          simplerBn: 'উত্তর: Adult',
        }),
        both({
          id: 'p3-run', titleBn: 'চালান', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Adult', language: 'python' },
          explanationBn: 'সবুজ ▶ Run বোতাম চাপুন।',
          hintBn: 'প্রথমবার পাইথন চালু হতে ১–২ সেকেন্ড লাগে।',
        }),
        both({
          id: 'p3-change', titleBn: 'বয়স বদলে দেখুন', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Not yet an adult', language: 'python' },
          explanationBn: '20 বদলে 15 লিখে ▶ Run চাপুন।',
          hintBn: 'প্রথম লাইন হবে: age = 15',
          simplerBn: '20-তে ডাবল ক্লিক করলে সংখ্যাটি নীল হয়ে বাছা হয়; তখন 15 লিখুন।',
          successMessageBn: 'এবার else চলল!',
        }),
        both({
          id: 'p3-edit', titleBn: 'নিজের মতো বদলান', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: ['Adult', 'Not yet an adult'], language: 'python' },
          explanationBn: 'age-এ যেকোনো সংখ্যা দিয়ে ▶ Run চাপুন। ১৮ দিলে কী হয়?',
          hintBn: 'age = 18 দিলে Adult আসে, কারণ >= মানে বড় বা সমান।',
        }),
        both({
          id: 'p4-open', titleBn: 'loop.py খুলুন', target: 'code-explorer-loop.py', expectedAction: { type: 'click', target: 'code-explorer-loop.py' },
          explanationBn: 'এবার loop.py খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় loop.py।',
        }),
        both({
          id: 'p4-predict', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Hello 0'] },
          explanationBn: 'প্রথমবারে (i = 0) কী ছাপা হবে?',
          hintBn: 'Hello, একটি ফাঁক, তারপর i-এর মান ০।',
        }),
        both({
          id: 'p4-run', titleBn: 'চালান', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Hello 0\nHello 1\nHello 2', language: 'python' },
          explanationBn: '▶ Run চাপুন; তিন লাইন ছাপা হবে।',
          hintBn: 'ওপরের সবুজ “▶ Run” বোতাম।',
        }),
        both({
          id: 'p4-five', titleBn: 'পাঁচবার করুন', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello 0\nHello 1\nHello 2\nHello 3\nHello 4', language: 'python' },
          explanationBn: '৩ বদলে 5 লিখে ▶ Run চাপুন।',
          hintBn: 'প্রথম লাইন হবে: for i in range(5):',
          simplerBn: 'range(3)-এর ৩-এ ডাবল ক্লিক করে 5 লিখুন।',
          successMessageBn: 'কম্পিউটার ক্লান্ত হয় না!',
        }),
      ],
      checklist: [
        { id: 'c-if', textBn: 'if আর else দিয়ে দুই রকম ফল দেখেছি', stepIds: ['p3-run', 'p3-change'] },
        { id: 'c-loop', textBn: 'for লুপ চালিয়ে ৫ বার করিয়েছি', stepIds: ['p4-run', 'p4-five'] },
      ],
      setup: setupFor({ 'check.py': PY_CHECK, 'loop.py': PY_LOOP }),
      quiz: [
        {
          id: 'q-if', type: 'multipleChoice',
          questionBn: 'age = 18 হলে if age >= 18: শর্তে কী ঘটে?',
          options: [
            { id: 'a', textBn: 'if-এর ভেতরের লাইন চলে' },
            { id: 'b', textBn: 'else-এর লাইন চলে' },
            { id: 'c', textBn: 'এরর আসে' },
          ],
          correct: ['a'],
          hintBn: '>= মানে বড় বা সমান।',
          explanationBn: '১৮ সমান, তাই শর্ত সত্য।',
        },
        {
          id: 'q-mistake', type: 'clickTarget',
          questionBn: 'কোন লাইনে কোলন (:) বাদ পড়েছে?',
          items: [
            { id: 'l1', labelBn: 'name = "Rumi"', icon: '1️⃣' },
            { id: 'l2', labelBn: 'if name == "Rumi"', icon: '2️⃣' },
            { id: 'l3', labelBn: '    print("Hello")', icon: '3️⃣' },
          ],
          correct: 'l2',
          hintBn: 'if লাইনের শেষে একটি চিহ্ন লাগে।',
          explanationBn: 'if লাইনের শেষে কোলন (:) নেই।',
        },
        {
          id: 'q-small', type: 'predictOutput', language: 'python',
          questionBn: 'কী ছাপা হবে? হুবহু লিখুন।',
          code: 'x = 3\nif x > 5:\n    print("big")\nelse:\n    print("small")',
          acceptedAnswers: ['small'],
          hintBn: '৩ কি ৫-এর চেয়ে বড়?',
          explanationBn: 'শর্ত মেলেনি, তাই else চলল।',
        },
      ],
      recapBn: ['if / else = যদি / নইলে', 'ভেতরের লাইন ডানে সরানো', 'for লুপ বারবার চালায়'],
      freeTryBn: 'age-এ ১৮-র কম, ১৮, আর বেশি দিয়ে দেখুন।',
    },

    // =====================================================================================================
    // 7. Mini project 1: my first web page
    // =====================================================================================================
    {
      id: 'proj-web',
      titleBn: 'প্রকল্প: আমার প্রথম ওয়েবপেজ',
      hook: {
        id: 'h-pw',
        type: 'hook',
        textBn: 'এবার আপনার পালা! নিজের সম্পর্কে একটি **ওয়েবপেজ** — লেখা সব আপনার নিজের।',
        visual: { kind: 'art', name: 'rocket', captionBn: 'শেখা সব একসাথে' },
      },
      cards: [
        {
          id: 'c-pw-plan',
          type: 'code',
          textBn: 'পরিকল্পনা: নাম, দু-লাইন পরিচয়, তিনটি পছন্দ আর একটি লিংক। লেখা আপনার মতো।',
          visual: {
            kind: 'code',
            lang: 'html',
            lines: [
              { code: '<h1>আপনার নাম</h1>', noteBn: 'শিরোনাম' },
              { code: '<p>নিজের সম্পর্কে দু-এক লাইন</p>', noteBn: 'অনুচ্ছেদ' },
              { code: '<ul><li>এক</li><li>দুই</li><li>তিন</li></ul>', noteBn: 'তিন পছন্দের তালিকা' },
              { code: '<a href="https://example.com">লেখা</a>', noteBn: 'একটি লিংক' },
            ],
            browserPreview: true,
          },
          learnMoreBn: 'আপনি আলাদা আলাদা লাইনে লিখবেন, যেমন আগে শিখেছেন। এখানে তালিকাটি এক লাইনে শুধু জায়গা বাঁচানোর জন্য দেখানো হয়েছে।',
        },
        {
          id: 'c-pw-css',
          type: 'code',
          textBn: 'তারপর সাজসজ্জা: রং, আকার আর সারি। teal বদলে red, tomato — যা খুশি।',
          visual: {
            kind: 'code',
            lang: 'css',
            lines: [
              { code: 'h1 {' },
              { code: '  color: teal;', noteBn: 'রং' },
              { code: '  font-size: 44px;', noteBn: 'আকার' },
              { code: '  text-align: center;', noteBn: 'মাঝখানে' },
              { code: '}' },
            ],
            browserPreview: true,
          },
        },
        {
          id: 'c-pw-pad',
          type: 'code',
          textBn: 'শেষে অনুচ্ছেদে **padding**। এই নতুন নিয়মটি h1-এর } চিহ্নের নিচে লিখবেন।',
          visual: {
            kind: 'code',
            lang: 'css',
            lines: [{ code: 'p {' }, { code: '  padding: 16px;', noteBn: 'ভেতরের ফাঁক' }, { code: '}' }],
            browserPreview: true,
          },
        },
        {
          id: 'c-pw-brace',
          type: 'visual',
          textBn: '{ লিখে Enter চাপলে এডিটর নিজেই } বসিয়ে দেয়। ওটি যেখানে আছে, থাকতে দিন।',
          visual: { kind: 'mock', name: 'code-editor', highlight: 'editor' },
          learnMoreBn: '( [ { " লিখলে এডিটর অনেক সময় নিজেই বন্ধের চিহ্নটি বসিয়ে দেয় (আসল VS Code-ও দেয়)। এডিটর থেকে কার্সার বের করতে Esc চেপে Tab চাপুন।',
        },
      ],
      steps: [
        both({
          id: 'pw-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
          explanationBn: 'index.html খুলুন; ওপরে ছোট পরিকল্পনা আছে।',
          hintBn: 'বাঁ দিকের তালিকায় index.html।',
        }),
        both({
          id: 'pw-h1', titleBn: 'শিরোনাম: আপনার নাম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</h1>' },
          explanationBn: 'ফাঁকা লাইনে <h1> দিয়ে নিজের নাম লিখে বন্ধ করুন।',
          hintBn: 'যেমন: <h1>Rumi’s page</h1> — নিজের মতো করে।',
          simplerBn: 'খোলা ট্যাগ, আপনার লেখা, বন্ধ ট্যাগ।',
        }),
        both({
          id: 'pw-p', titleBn: 'অনুচ্ছেদ: নিজের সম্পর্কে', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</p>' },
          explanationBn: 'Enter চেপে <p> দিয়ে নিজের সম্পর্কে দু-এক লাইন লিখুন।',
          hintBn: '<p> আপনার লেখা </p>',
        }),
        both({
          id: 'pw-ul', titleBn: 'তালিকা: তিনটি পছন্দ', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</ul>' },
          explanationBn: '<ul> দিয়ে শুরু করে তিনটি <li>…</li> লিখুন, শেষে </ul>।',
          hintBn: 'প্রতিটি লাইন আলাদা। পছন্দ হতে পারে খাবার, গান বা জায়গা।',
        }),
        both({
          id: 'pw-a', titleBn: 'একটি লিংক', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</a>' },
          explanationBn: 'একটি লিংক দিন: <a href="ঠিকানা">লেখা</a>',
          hintBn: 'ঠিকানা আর লেখা আপনার পছন্দমতো।',
        }),
        both({
          id: 'pw-save-html', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '</a>' },
          explanationBn: 'index.html সেভ করুন: Ctrl+S (Mac-এ Cmd+S)।',
          hintBn: 'অথবা ওপরের “💾 Save” বোতাম।',
        }),
        both({
          id: 'pw-open-css', titleBn: 'style.css খুলুন', target: 'code-explorer-style.css', expectedAction: { type: 'click', target: 'code-explorer-style.css' },
          explanationBn: 'এবার সাজসজ্জা। style.css খুলুন।',
          hintBn: 'ফাইলটি index.html-এর সাথে আগে থেকেই জোড়া আছে।',
        }),
        both({
          id: 'pw-color', titleBn: 'রং দিন', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'color:' },
          explanationBn: 'লিখুন h1 { — Enter — color: teal;',
          hintBn: 'h1, ফাঁক, {। Enter চাপলে মাঝে নতুন লাইন আসবে।',
          simplerBn: 'এডিটর নিজে } বসাবে। মাঝের লাইনে color: teal; লিখুন।',
        }),
        both({
          id: 'pw-size', titleBn: 'আকার দিন', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'font-size:' },
          explanationBn: 'Enter চেপে লিখুন: font-size: 44px;',
          hintBn: 'সংখ্যা বদলে দেখতে পারেন।',
        }),
        both({
          id: 'pw-align', titleBn: 'লেখা মাঝে আনুন', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'text-align:' },
          explanationBn: 'Enter চেপে লিখুন: text-align: center;',
          hintBn: 'text-align: center;',
        }),
        both({
          id: 'pw-padding', titleBn: 'ফাঁকা জায়গা দিয়ে সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/style.css`, text: 'padding:' },
          explanationBn: 'নিচে লিখে সেভ করুন: p { — Enter — padding: 16px;',
          hintBn: 'সেভ: Ctrl/Cmd+S। সেভ হলে তবেই ধাপ শেষ হবে।',
          simplerBn: 'h1-এর ঘর শেষ হলে নতুন একটি ঘর শুরু করুন।',
          successMessageBn: 'আপনার প্রথম ওয়েবপেজ তৈরি!',
        }),
      ],
      checklist: [
        { id: 'c-h1', textBn: 'শিরোনাম আর অনুচ্ছেদ আছে', stepIds: ['pw-h1', 'pw-p'] },
        { id: 'c-ul', textBn: 'তিন পছন্দের তালিকা আছে', stepIds: ['pw-ul'] },
        { id: 'c-a', textBn: 'একটি লিংক আছে', stepIds: ['pw-a'] },
        { id: 'c-css', textBn: 'CSS: রং, আকার, সারি দিয়েছি', stepIds: ['pw-color', 'pw-size', 'pw-align'] },
        { id: 'c-save', textBn: 'দুটি ফাইলই সেভ করেছি', stepIds: ['pw-save-html', 'pw-padding'] },
      ],
      setup: setupFor({ 'index.html': PROJECT_HTML, 'style.css': PROJECT_CSS }),
      quiz: [
        {
          id: 'q-order', type: 'ordering',
          questionBn: 'ওয়েবপেজ বানানোর ধাপগুলো সঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'index.html ফাইল খুলি' },
            { id: '2', textBn: 'ট্যাগ দিয়ে লেখা লিখি' },
            { id: '3', textBn: 'ফাইল সেভ করি' },
            { id: '4', textBn: 'প্রিভিউ দেখে ঠিক করি' },
          ],
          hintBn: 'আগে ফাইল, তারপর লেখা, তারপর সেভ, শেষে ফল।',
          explanationBn: 'লিখি, সেভ করি, দেখি, আবার বদলাই।',
        },
        {
          id: 'q-link', type: 'multipleChoice',
          questionBn: 'পাতার সাথে style.css জুড়তে কোন লাইন লিখি?',
          options: [
            { id: 'a', textBn: '<link rel="stylesheet" href="style.css">' },
            { id: 'b', textBn: '<css>style.css</css>' },
            { id: 'c', textBn: 'import style.css' },
          ],
          correct: ['a'],
          hintBn: 'লাইনটি <head>-এর ভেতরে বসে।',
          explanationBn: 'link লাইনটিই ফাইল দুটিকে জোড়ে।',
        },
        {
          id: 'q-h1-color', type: 'clickTarget',
          questionBn: 'কোনটি শিরোনামকে সবুজ-নীল (teal) করবে?',
          items: [
            { id: 'ok', labelBn: 'h1 { color: teal; }', icon: '✅' },
            { id: 'p', labelBn: 'p { color: teal; }', icon: '📄' },
            { id: 'rev', labelBn: 'h1 { teal: color; }', icon: '🔀' },
          ],
          correct: 'ok',
          hintBn: 'কাকে সাজাব, তারপর প্রপার্টি: ভ্যালু।',
          explanationBn: 'h1 শিরোনাম, color প্রপার্টি, teal ভ্যালু।',
        },
      ],
      recapBn: ['HTML কাঠামো, CSS সাজ', 'দুটি ফাইলই সেভ করি', 'আপনার নিজের ওয়েবপেজ তৈরি'],
    },

    // =====================================================================================================
    // 8. Mini project 2: name-and-age greeting program (finale)
    // =====================================================================================================
    {
      id: 'proj-py',
      titleBn: 'প্রকল্প: নাম-আর-বয়সের শুভেচ্ছা',
      hook: {
        id: 'h-pp',
        type: 'hook',
        textBn: 'শেষ ধাপ! আপনার নিজের লেখা প্রোগ্রাম আপনাকে নাম ধরে **শুভেচ্ছা** জানাবে।',
        visual: { kind: 'art', name: 'trophy', captionBn: 'শেষ প্রকল্প' },
      },
      cards: [
        {
          id: 'c-pp-plan',
          type: 'visual',
          textBn: 'প্রোগ্রাম নাম আর বয়স জানতে চাইবে, শুভেচ্ছা জানাবে, আর বলবে প্রাপ্তবয়স্ক কি না।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'question', labelBn: 'প্রশ্ন' },
              { art: 'chip', labelBn: 'হিসাব' },
              { art: 'branch', labelBn: 'সিদ্ধান্ত' },
              { art: 'chat-bubble', labelBn: 'শুভেচ্ছা' },
            ],
          },
          learnMoreBn: 'greeting.py ফাইলের ওপরে # দিয়ে শুরু হওয়া লাইনগুলো মন্তব্য (Comment): নিজের নোট, পাইথন এগুলো চালায় না। আপনি নিচে লাইনের পর লাইন লিখে প্রোগ্রাম বানাবেন।',
        },
        {
          id: 'c-pp-ask',
          type: 'code',
          textBn: 'আগে দুটি প্রশ্ন, তারপর শুভেচ্ছা। প্রতিটি লাইন লিখে **সেভ** করবেন।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'name = input("What is your name? ")', noteBn: 'নাম জিজ্ঞেস' },
              { code: 'age = int(input("How old are you? "))', noteBn: 'বয়স, সংখ্যা হয়ে' },
              { code: 'print("Hello, " + name)', noteBn: 'শুভেচ্ছা' },
            ],
            output: ['What is your name? Anika', 'How old are you? 30', 'Hello, Anika'],
          },
          learnMoreBn: 'সেভ: Windows-এ Ctrl+S, Mac-এ Cmd+S। এই প্রকল্পে প্রতিটি ধাপ সেভের পরে শেষ হয়।',
        },
        {
          id: 'c-pp-if',
          type: 'code',
          textBn: 'এবার আগামী বছরের বয়স আর **if / else**। else: লিখলে লাইন নিজে বাইরে আসে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'print("Next year you will be", age + 1)', noteBn: 'কমা দিয়ে লেখা + হিসাব' },
              { code: 'if age >= 18:' },
              { code: '    print("You are an adult.")', noteBn: 'এডিটর নিজে ভেতরে সরায়' },
              { code: 'else:', noteBn: 'if-এর সোজাসুজি নিচে' },
              { code: '    print("You are not an adult yet.")' },
            ],
            output: ['Next year you will be 31', 'You are an adult.'],
          },
        },
        {
          id: 'c-pp-stuck',
          type: 'visual',
          textBn: 'এরর এলে ঘাবড়াবেন না। কোটেশন, বন্ধনী আর কোলন (:) মিলিয়ে নিন।',
          visual: { kind: 'art', name: 'bug', captionBn: 'বাগ = শেখার সুযোগ' },
          chipsBn: ['বার্তা পড়ুন', 'লাইন মিলান'],
          learnMoreBn: 'এরর বার্তায় কোন লাইনে কী হয়েছে তা বলা থাকে; এটি শত্রু নয়, বন্ধু। আটকে গেলে Ctrl/Cmd+Z দিয়ে ফিরে যান — নষ্ট করার কিছু নেই।',
        },
      ],
      steps: [
        both({
          id: 'pp-open', titleBn: 'greeting.py খুলুন', target: 'code-explorer-greeting.py', expectedAction: { type: 'click', target: 'code-explorer-greeting.py' },
          explanationBn: 'greeting.py খুলুন।',
          hintBn: 'বাঁ দিকের তালিকায় greeting.py।',
        }),
        both({
          id: 'pp-name', titleBn: 'নাম জিজ্ঞেস করুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'name = input(' },
          explanationBn: 'ফাইলের শেষে লিখে সেভ করুন: name = input("What is your name? ")',
          hintBn: 'কোটেশনের ভেতরে প্রশ্ন। সেভের পরে ধাপ শেষ হবে।',
        }),
        both({
          id: 'pp-age', titleBn: 'বয়স জিজ্ঞেস করুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'age = int(input(' },
          explanationBn: 'নতুন লাইনে লিখে সেভ করুন: age = int(input("How old are you? "))',
          hintBn: 'শেষে দুটি ) বন্ধনী আসে।',
        }),
        both({
          id: 'pp-greet', titleBn: 'শুভেচ্ছা ছাপুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'print("Hello, " + name)' },
          explanationBn: 'নতুন লাইনে লিখে সেভ করুন: print("Hello, " + name)',
          hintBn: 'greet.py-র মতোই। কমার পরে ফাঁক রাখুন।',
        }),
        both({
          id: 'pp-next', titleBn: 'আগামী বছরের বয়স', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'age + 1' },
          explanationBn: 'লিখে সেভ করুন: print("Next year you will be", age + 1)',
          hintBn: 'কমা দিয়ে একটি লেখা আর একটি হিসাব ছাপানো যায়।',
        }),
        both({
          id: 'pp-if', titleBn: 'শর্ত লিখুন (if)', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'if age >= 18:' },
          explanationBn: 'লিখে সেভ করুন: if age >= 18: Enter print("You are an adult.")',
          hintBn: 'if লাইনের শেষে কোলন (:)। print লাইনটি ভেতরে সরানো থাকবে।',
          simplerBn: 'Enter চাপলে এডিটর নিজেই লাইনটি ভেতরে সরিয়ে দেয়।',
        }),
        both({
          id: 'pp-else', titleBn: 'নইলে (else)', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'else:' },
          explanationBn: 'লিখে সেভ করুন: else: Enter print("You are not an adult yet.")',
          hintBn: 'else: if-এর সোজাসুজি নিচে থাকবে, সরানো নয়।',
          simplerBn: 'else: সরে থাকলে Backspace চেপে এক ধাপ বাঁয়ে আনুন।',
        }),
        both({
          id: 'pp-run', titleBn: 'চালিয়ে দেখুন', target: 'code-run', expectedAction: { type: 'custom', event: 'code-run-ok' },
          explanationBn: '▶ Run চাপুন; নীল বাক্সে নাম আর বয়স দিন।',
          hintBn: 'এরর এলে বার্তা পড়ুন — কোন লাইনে ভুল তা বলা থাকে।',
          simplerBn: 'কোটেশন, বন্ধনী আর কোলন (:) আবার মিলিয়ে নিন।',
          successMessageBn: 'আপনার প্রোগ্রাম আপনার সাথে কথা বলল!',
        }),
      ],
      checklist: [
        { id: 'c-in', textBn: 'নাম আর বয়স জিজ্ঞেস করেছি', stepIds: ['pp-name', 'pp-age'] },
        { id: 'c-out', textBn: 'শুভেচ্ছা আর আগামী বছরের বয়স ছেপেছি', stepIds: ['pp-greet', 'pp-next'] },
        { id: 'c-cond', textBn: 'if / else দিয়ে সিদ্ধান্ত নিয়েছি', stepIds: ['pp-if', 'pp-else'] },
        { id: 'c-run', textBn: 'প্রোগ্রাম চালিয়ে দেখেছি', stepIds: ['pp-run'] },
      ],
      setup: setupFor({ 'greeting.py': PY_PROJECT }),
      quiz: [
        {
          id: 'q-age', type: 'predictOutput', language: 'python',
          questionBn: 'এই প্রোগ্রামের আউটপুট কী? শুধু ফলটি লিখুন।',
          code: 'age = 17\nprint(age + 1)',
          acceptedAnswers: ['18'],
          hintBn: '১৭ + ১।',
          explanationBn: 'age + 1 = 18।',
        },
        {
          id: 'q-prog-order', type: 'ordering',
          questionBn: 'প্রোগ্রামের লাইনগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'নাম জিজ্ঞেস করি' },
            { id: '2', textBn: 'বয়স জিজ্ঞেস করি' },
            { id: '3', textBn: 'শুভেচ্ছা ছাপি' },
            { id: '4', textBn: 'if / else দিয়ে সিদ্ধান্ত নিই' },
          ],
          hintBn: 'আগে প্রশ্ন, শেষে সিদ্ধান্ত।',
          explanationBn: 'আগে তথ্য নিই, তারপর কাজ করি।',
        },
        {
          id: 'q-tools', type: 'dragMatch',
          questionBn: 'পাইথনের অংশের সাথে কাজ মেলান।',
          pairs: [
            { id: 'input', leftBn: 'input()', rightBn: 'প্রশ্ন করে' },
            { id: 'print', leftBn: 'print()', rightBn: 'পর্দায় ছাপে' },
            { id: 'if', leftBn: 'if / else', rightBn: 'সিদ্ধান্ত নেয়' },
            { id: 'int', leftBn: 'int()', rightBn: 'লেখা থেকে সংখ্যা' },
          ],
          hintBn: 'প্রকল্পের প্রতিটি লাইনে এদের দেখেছেন।',
          explanationBn: 'এই চারটি দিয়েই আপনার প্রোগ্রাম।',
        },
      ],
      recapBn: ['input, print, if / else একসাথে', 'নিজের প্রোগ্রাম নিজে চালালেন', 'এখন শুরু, শেষ নয়'],
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'VS Code (মডিউল ১৮) খুলে coding/html-css ফোল্ডারে index.html ও style.css বানিয়ে আজকের পাতাটি আবার লিখুন।',
      'index.html-এ ডাবল ক্লিক করে ব্রাউজারে খুলুন; পরিবারের কাউকে দেখান।',
      '“এরপর কোথায় যাব” পাতা খুলে অভ্যাস-ছক ছাপিয়ে এই সপ্তাহের ছোট প্রকল্প ঠিক করুন।',
    ],
    windowsTasksBn: ['টার্মিনালে hello.py-এর ফোল্ডারে গিয়ে লিখুন: python hello.py (না চললে py hello.py)।'],
    macTasksBn: ['টার্মিনালে hello.py-এর ফোল্ডারে গিয়ে লিখুন: python3 hello.py।'],
  },

  teacherTipBn:
    'এটি কোর্সের শেষ পাঠ, তাই তাড়াহুড়ো করবেন না। প্রতিটি অংশ আলাদা দিনেও করা যায়। জোড়ায় প্রোগ্রামিং (Pair Programming) ভালো কাজ করে: শিক্ষার্থী কিবোর্ড ধরেন, আপনি শুধু প্রশ্ন করেন: “এই লাইনটা কী করবে বলে মনে হয়?”, “আগে আন্দাজ করুন, তারপর চালান”। সমাধান বলে দেবেন না; এরর বার্তা একসাথে পড়ুন (মডিউল ১৯-এর অভ্যাস)। প্রতিটি ছোট সফলতায় (প্রথম শিরোনাম, প্রথম রং, প্রথম বাগ সারানো) আন্তরিক উৎসাহ দিন। কুইজে কোথায় বেশি ভুল হয় তা শিক্ষক-পাতায় দেখে সেই অংশ আবার করান। শেষে সনদপত্র ছাপিয়ে আর “এরপর কোথায় যাব” পাতার অভ্যাস-ছক ধরিয়ে দিয়ে আগামী সপ্তাহের একটি ছোট প্রকল্প একসাথে ঠিক করুন।',
}

export default lesson
