import type { Chapter, LegacyLesson as Lesson, SimSetup, Step } from '../../engine/types'

/* ------------------------------------------------------------------ *
 * Module 20 — প্রথম কোড (the finale of the course).
 * Eleven micro-lessons (chapters); each starts a fresh simulated computer with the Code Editor open and a few seeded
 * files in ~/coding. Almost every step is the same on Windows and Mac (`both`); only the save shortcut label differs and
 * both labels are mentioned in the text.
 * ------------------------------------------------------------------ */

const FOLDER = '~/coding'
const SAVE = 'Windows-এ Ctrl+S, Mac-এ Cmd+S'

/** Seed files into ~/coding (the Code Editor's default folder). Never overwrites existing files. */
export const seed =
  (files: Record<string, string>): NonNullable<SimSetup['vfs']> =>
  (vfs) => {
    const folder = vfs.child(vfs.home, 'coding') ?? vfs.mkdir(vfs.home, 'coding')
    for (const [name, content] of Object.entries(files)) if (!vfs.child(folder, name)) vfs.createFile(folder, name, content)
  }

const setupFor = (files: Record<string, string>): SimSetup => ({ openApps: ['code'], vfs: seed(files) })

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

export const HTML2 = page({
  head: '  <title>My first page</title>',
  body: '  <h1>Hello, world</h1>\n  <p>I am learning to code.</p>\n  ',
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

export const CSS_INDEX2 = page({
  head: '  <meta charset="utf-8">\n  <title>My page</title>\n  <link rel="stylesheet" href="style.css">',
  body: '  <h1>Hello, world</h1>\n  <p>I am learning to code.</p>\n  <p>Rice, dal and a cup of tea.</p>',
})

export const CSS1 = '/* style.css: পাতার সাজসজ্জা এখানে লিখি */\nh1 {\n  \n}\n'
export const CSS2 = '/* style.css: পাতার সাজসজ্জা এখানে লিখি */\nbody {\n  \n}\n\np {\n  \n}\n'

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

/* ---------------- chapters ---------------- */

const htmlOne: Chapter = {
  id: 'html-1',
  titleBn: 'HTML ১: শিরোনাম ও অনুচ্ছেদ',
  introBn: 'প্রথম ওয়েবপেজে একটি শিরোনাম (Heading) আর একটি অনুচ্ছেদ (Paragraph) লিখি — ডান পাশে সাথে সাথে ফল দেখুন।',
  setup: setupFor({ 'index.html': HTML1 }),
  steps: [
    both({
      id: 'h1-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
      explanationBn: 'বাঁ পাশের ফাইল-তালিকায় index.html-এ ক্লিক করুন। ওয়েবপেজের লেখা HTML ফাইলে থাকে।',
      hintBn: 'বাঁ দিকের তালিকায় index.html নামটি আছে।',
    }),
    both({
      id: 'h1-look', titleBn: 'কোড আর প্রিভিউ', target: 'code-editor', expectedAction: { type: 'continue' },
      explanationBn: 'একদিকে কোড, অন্যদিকে প্রিভিউ (Preview)। কোড বদলালেই প্রিভিউ বদলে যায়। এখন প্রিভিউ ফাঁকা, কারণ <body>-র ভেতরে (যেখানে চোখে দেখা জিনিস থাকে) এখনো কিছু লেখা নেই। ওই ফাঁকা লাইনটিতেই আমরা লিখব।',
      hintBn: 'পড়া হলে “বুঝেছি, পরের ধাপ” বোতাম চাপুন।',
    }),
    both({
      id: 'h1-heading', titleBn: 'প্রথম শিরোনাম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<h1>Hello, world</h1>' },
      explanationBn: 'লাইন ৮-এ (<body>-র নিচের ফাঁকা লাইনে) ক্লিক করে ঠিক এটি লিখুন: <h1>Hello, world</h1>। খোলার ট্যাগ <h1>, মাঝে লেখা, শেষে বন্ধের ট্যাগ </h1> (এতে একটি / থাকে)।',
      hintBn: 'ফাঁকা লাইনটি ৮ নম্বর। ট্যাগে কোনো ফাঁক নেই: <h1> — আর শেষেরটি </h1>।',
      simplerBn: '< চিহ্ন Shift + কমা (,) চেপে আর > চিহ্ন Shift + দাঁড়ি (.) চেপে হয়। একে একে লিখুন: <h1> তারপর Hello, world তারপর </h1>।',
      successMessageBn: 'দেখুন, প্রিভিউতে আপনার লেখা বড় অক্ষরে! এটাই আপনার প্রথম ওয়েবপেজের প্রথম লাইন।',
    }),
    both({
      id: 'h1-para', titleBn: 'একটি অনুচ্ছেদ', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<p>I am learning to code.</p>' },
      explanationBn: 'শেষে Enter চেপে নতুন লাইনে লিখুন: <p>I am learning to code.</p>। <p> মানে অনুচ্ছেদ (Paragraph)।',
      hintBn: 'আগের লাইনের শেষে কার্সার রেখে Enter চাপুন, তারপর টাইপ করুন।',
      simplerBn: 'ঠিক এই লেখাটি: <p>I am learning to code.</p> — বড়-ছোট হাতের অক্ষর হুবহু মিলতে হবে।',
    }),
    both({
      id: 'h1-sub', titleBn: 'ছোট শিরোনাম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<h2>About me</h2>' },
      explanationBn: 'আবার Enter চেপে লিখুন: <h2>About me</h2>। h1 সবচেয়ে বড় শিরোনাম, h2 তার চেয়ে ছোট। h6 পর্যন্ত আছে।',
      hintBn: 'এবার h-এর পরে ২ — <h2>…</h2>।',
    }),
    both({
      id: 'h1-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '<h2>About me</h2>' },
      explanationBn: `ফাইলটি সেভ করুন (${SAVE}, অথবা ওপরের Save বোতাম)। সেভ না করলে বদলগুলো শুধু পর্দায় থাকে, ফাইলে যায় না।`,
      hintBn: 'ওপরের বাঁ দিকের “💾 Save” বোতামটি চাপুন।',
    }),
  ],
  checklist: [
    { id: 'c-h1', textBn: '<h1> দিয়ে শিরোনাম লিখেছি', stepIds: ['h1-heading'] },
    { id: 'c-p', textBn: '<p> দিয়ে অনুচ্ছেদ লিখেছি', stepIds: ['h1-para'] },
    { id: 'c-save', textBn: 'ফাইল সেভ করেছি', stepIds: ['h1-save'] },
  ],
}

const htmlTwo: Chapter = {
  id: 'html-2',
  titleBn: 'HTML ২: তালিকা ও লিংক',
  introBn: 'বুলেট-তালিকা (<ul>, <li>) আর লিংক (<a href>) বানাই।',
  setup: setupFor({ 'index.html': HTML2 }),
  steps: [
    both({
      id: 'h2-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
      explanationBn: 'index.html খুলুন। এতে আগের অংশের শিরোনাম আর অনুচ্ছেদ আছে। ফাঁকা লাইনটি এবার ৯ নম্বর।',
      hintBn: 'বাঁ দিকের তালিকায় index.html।',
    }),
    both({
      id: 'h2-li1', titleBn: 'তালিকা শুরু', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<li>Rice</li>' },
      explanationBn: 'লাইন ৯-এ ক্লিক করে লিখুন <ul> — Enter — তারপর <li>Rice</li>। <ul> পুরো তালিকা, প্রতিটি <li> তালিকার একেকটি আইটেম।',
      hintBn: 'দুটি লাইন লিখতে হবে: প্রথমে <ul>, Enter চেপে পরের লাইনে <li>Rice</li>।',
      simplerBn: 'লাইন ৯: <ul> লিখে Enter। লাইন ১০: <li>Rice</li>।',
      successMessageBn: 'প্রথম আইটেম বসে গেছে! প্রিভিউতে একটি বুলেট দেখুন।',
    }),
    both({
      id: 'h2-li2', titleBn: 'আরেকটি আইটেম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<li>Dal</li>' },
      explanationBn: 'Enter চেপে লিখুন: <li>Dal</li>।',
      hintBn: 'আগের লাইনের শেষে Enter, তারপর <li>Dal</li>।',
    }),
    both({
      id: 'h2-ul-end', titleBn: 'তালিকা বন্ধ করুন', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</ul>' },
      explanationBn: 'Enter চেপে তালিকার বন্ধের ট্যাগ লিখুন: </ul>। যা খুলেছি তা বন্ধ করা HTML-এর ভালো অভ্যাস।',
      hintBn: 'খুলেছিলাম <ul>, তাই বন্ধ হবে </ul> — সামনে একটি /।',
    }),
    both({
      id: 'h2-link', titleBn: 'একটি লিংক', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<a href="https://example.com">My link</a>' },
      explanationBn: 'Enter চেপে লিখুন: <a href="https://example.com">My link</a>। href মানে যেখানে যাবে সেই ঠিকানা, আর মাঝের লেখাটিই দেখা যায়। (প্রিভিউ একটি সুরক্ষিত বাক্স, তাই লিংকে ক্লিক করলে কিছু খুলবে না — আসল ব্রাউজারে খুলবে।)',
      hintBn: 'ঠিকানা কোটেশন চিহ্নের (") ভেতরে থাকে, আর a-এর পর একটি ফাঁক, তারপর href।',
      simplerBn: 'এই চারটি অংশ একসাথে: <a href="ঠিকানা"> + লেখা + </a>। ঠিকানার জায়গায় https://example.com, লেখার জায়গায় My link।',
    }),
    both({
      id: 'h2-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '</ul>' },
      explanationBn: `সেভ করুন (${SAVE})।`,
      hintBn: 'ওপরের “💾 Save” বোতাম।',
    }),
  ],
  checklist: [
    { id: 'c-list', textBn: 'তালিকা (<ul> ও <li>) বানিয়েছি', stepIds: ['h2-li1', 'h2-li2', 'h2-ul-end'] },
    { id: 'c-link', textBn: 'লিংক (<a href>) বানিয়েছি', stepIds: ['h2-link'] },
    { id: 'c-save', textBn: 'সেভ করেছি', stepIds: ['h2-save'] },
  ],
}

const htmlThree: Chapter = {
  id: 'html-3',
  titleBn: 'HTML ৩: ছবি, বাংলা লেখা ও UTF-8',
  introBn: 'ছবির ট্যাগ (<img>) ও alt টেক্সট, মন্তব্য (Comment), আর বাংলা লেখা ঠিকঠাক দেখানোর জন্য UTF-8।',
  setup: setupFor({ 'index.html': HTML3 }),
  steps: [
    both({
      id: 'h3-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
      explanationBn: 'index.html খুলুন। এই পাতার অনুচ্ছেদে বাংলা লেখা আছে — প্রিভিউতে যুক্তাক্ষরসহ দেখুন।',
      hintBn: 'বাঁ দিকের তালিকায় index.html।',
    }),
    both({
      id: 'h3-bangla', titleBn: 'কোডে বাংলা', target: 'code-editor', expectedAction: { type: 'continue' },
      explanationBn: 'কোডের লেখা-অংশে বাংলা লেখা চলে। (আপনার কিবোর্ডে বাংলা চালু থাকলে নিজেও কিছু বাংলা লিখে দেখতে পারেন; না থাকলে অসুবিধা নেই।) তবে ট্যাগের নামগুলো সবসময় ইংরেজিতে: <p>, <h1>, <a>।',
      hintBn: 'পড়া হলে “বুঝেছি, পরের ধাপ” চাপুন।',
    }),
    both({
      id: 'h3-meta', titleBn: 'UTF-8 ঘোষণা', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<meta charset="utf-8">' },
      explanationBn: 'লাইন ৫-এর ফাঁকা জায়গায় (<title>-এর নিচে, <head>-এর ভেতরে) লিখুন: <meta charset="utf-8">। এটি ব্রাউজারকে বলে ফাইলটি UTF-8 নিয়মে পড়তে, যাতে বাংলা অক্ষর ভেঙে না যায়। এটি প্রতিটি পাতার <head>-এ রাখা ভালো।',
      hintBn: 'চার ভাগ: <meta, ফাঁক, charset="utf-8", আর >। utf-8 লিখতে মাঝখানে হাইফেন (-)।',
      simplerBn: 'ঠিক এভাবে: <meta charset="utf-8">',
    }),
    both({
      id: 'h3-img', titleBn: 'ছবির ট্যাগ ও alt', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<img src="photo.jpg" alt="My photo">' },
      explanationBn: 'লাইন ১০-এর ফাঁকা জায়গায় (অনুচ্ছেদের নিচে) লিখুন: <img src="photo.jpg" alt="My photo">। src = ছবির ফাইল, alt = ছবির বর্ণনা। এই প্রিভিউতে আসল ছবি আসে না, তাই ছবির জায়গায় alt-এর লেখাটি দেখা যাবে — ছবি না এলে বা চোখে না দেখলে এই লেখাই কাজে লাগে।',
      hintBn: 'বন্ধের ট্যাগ লাগে না। শুধু src আর alt — দুটো অ্যাট্রিবিউট।',
      simplerBn: 'এই লাইনটি হুবহু: <img src="photo.jpg" alt="My photo">',
      successMessageBn: 'দেখুন, ছবির জায়গায় আপনার alt লেখাটি! এই জন্যই alt টেক্সট জরুরি।',
    }),
    both({
      id: 'h3-comment', titleBn: 'একটি মন্তব্য', target: 'code-editor', expectedAction: { type: 'previewContains', text: '<!-- my first image -->' },
      explanationBn: 'Enter চেপে লিখুন: <!-- my first image -->। <!-- আর --> চিহ্নের মাঝের লেখা মন্তব্য (Comment) — নিজের নোট। ব্রাউজার একে দেখায় না।',
      hintBn: 'শুরুতে <!-- (একটি বিস্ময়চিহ্ন আর দুটি হাইফেন), শেষে -->।',
    }),
    both({
      id: 'h3-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '<!-- my first image -->' },
      explanationBn: `সেভ করুন (${SAVE})।`,
      hintBn: 'ওপরের “💾 Save” বোতাম।',
    }),
  ],
  checklist: [
    { id: 'c-utf', textBn: 'UTF-8 ঘোষণা (<meta charset>) দিয়েছি', stepIds: ['h3-meta'] },
    { id: 'c-img', textBn: 'alt-সহ ছবির ট্যাগ লিখেছি', stepIds: ['h3-img'] },
    { id: 'c-cm', textBn: 'মন্তব্য লিখেছি আর সেভ করেছি', stepIds: ['h3-comment', 'h3-save'] },
  ],
}

const cssOne: Chapter = {
  id: 'css-1',
  titleBn: 'CSS ১: রং, আকার ও লেখার সারি',
  introBn: 'style.css ফাইল পাতার সাথে জুড়ি, তারপর শিরোনামের রং, আকার আর সারি বদলাই।',
  setup: setupFor({ 'index.html': CSS_INDEX1, 'style.css': CSS1 }),
  steps: [
    both({
      id: 'c1-open-html', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
      explanationBn: 'প্রথমে index.html খুলুন। এখানে HTML আছে, কিন্তু সাজসজ্জার ফাইল style.css এখনো এর সাথে জোড়া নেই।',
      hintBn: 'বাঁ দিকের তালিকায় index.html।',
    }),
    both({
      id: 'c1-link', titleBn: 'style.css জুড়ুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: 'href="style.css"' },
      explanationBn: `লাইন ৬-এর ফাঁকা জায়গায় (<head>-এর ভেতরে) লিখুন: <link rel="stylesheet" href="style.css"> — তারপর সেভ করুন (${SAVE})। এই লাইনটিই বলে দেয় সাজসজ্জা কোন ফাইলে আছে।`,
      hintBn: 'লাইন ৬ ফাঁকা। লিখে ওপরের “💾 Save” চাপুন; সেভ হলে তবেই ধাপ শেষ হবে।',
      simplerBn: 'হুবহু: <link rel="stylesheet" href="style.css">। তারপর Save।',
    }),
    both({
      id: 'c1-open-css', titleBn: 'style.css খুলুন', target: 'code-explorer-style.css', expectedAction: { type: 'click', target: 'code-explorer-style.css' },
      explanationBn: 'এবার তালিকা থেকে style.css খুলুন। এখানে h1-এর জন্য একটি ফাঁকা ঘর তৈরি আছে।',
      hintBn: 'বাঁ দিকের তালিকায় style.css।',
    }),
    both({
      id: 'c1-color', titleBn: 'লেখার রং', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'color: teal' },
      explanationBn: 'লাইন ৩-এ (h1 { আর } চিহ্নের মাঝের ফাঁকা লাইনে) ক্লিক করে লিখুন: color: teal; — color হলো প্রপার্টি (কী বদলাব), teal হলো ভ্যালু (কীভাবে)। শেষে সেমিকোলন (;)।',
      hintBn: 'color, কোলন (:), ফাঁক, teal, সেমিকোলন (;)।',
      simplerBn: 'হুবহু: color: teal;',
      successMessageBn: 'শিরোনামটি সবুজ-নীল রঙে বদলে গেছে! আপনি পাতাকে সাজিয়েছেন।',
    }),
    both({
      id: 'c1-size', titleBn: 'লেখার আকার', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'font-size: 48px' },
      explanationBn: 'Enter চেপে পরের লাইনে লিখুন: font-size: 48px; — px হলো পর্দার ছোট বিন্দু (pixel); সংখ্যা বাড়ালে লেখা বড় হয়।',
      hintBn: 'font আর size-এর মাঝে হাইফেন (-)।',
    }),
    both({
      id: 'c1-align', titleBn: 'লেখা মাঝখানে', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'text-align: center' },
      explanationBn: 'Enter চেপে লিখুন: text-align: center; — লেখাটি পর্দার মাঝখানে চলে আসবে। left (বাঁয়ে) আর right (ডানে)ও দিতে পারেন।',
      hintBn: 'text-align: center; — হাইফেন আর কোলনের ফাঁক খেয়াল করুন।',
    }),
    both({
      id: 'c1-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/style.css`, text: 'text-align: center' },
      explanationBn: `style.css সেভ করুন (${SAVE})।`,
      hintBn: 'ওপরের “💾 Save” বোতাম।',
    }),
  ],
  checklist: [
    { id: 'c-link', textBn: 'style.css-কে পাতার সাথে জুড়েছি', stepIds: ['c1-link'] },
    { id: 'c-color', textBn: 'রং আর আকার বদলেছি', stepIds: ['c1-color', 'c1-size'] },
    { id: 'c-align', textBn: 'লেখা মাঝে এনেছি ও সেভ করেছি', stepIds: ['c1-align', 'c1-save'] },
  ],
}

const cssTwo: Chapter = {
  id: 'css-2',
  titleBn: 'CSS ২: ব্যাকগ্রাউন্ড, মার্জিন ও প্যাডিং',
  introBn: 'পাতার পেছনের রং আর ফাঁকা জায়গা (margin ও padding) বদলাই।',
  setup: setupFor({ 'index.html': CSS_INDEX2, 'style.css': CSS2 }),
  steps: [
    both({
      id: 'c2-open', titleBn: 'style.css খুলুন', target: 'code-explorer-style.css', expectedAction: { type: 'click', target: 'code-explorer-style.css' },
      explanationBn: 'style.css খুলুন। এতে body আর p-এর জন্য দুটি ফাঁকা ঘর আছে। body মানে পুরো পাতা।',
      hintBn: 'বাঁ দিকের তালিকায় style.css।',
    }),
    both({
      id: 'c2-bg', titleBn: 'পাতার পেছনের রং', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'background-color: lightyellow' },
      explanationBn: 'লাইন ৩-এ (body-র ঘরে) লিখুন: background-color: lightyellow;',
      hintBn: 'background আর color-এর মাঝে হাইফেন; শেষে সেমিকোলন।',
      simplerBn: 'হুবহু: background-color: lightyellow;',
      successMessageBn: 'পুরো পাতার পেছনে হালকা হলুদ রং! চাইলে lightyellow বদলে অন্য রং লিখে দেখুন।',
    }),
    both({
      id: 'c2-margin', titleBn: 'বাইরের ফাঁক (margin)', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'margin: 40px' },
      explanationBn: 'Enter চেপে লিখুন: margin: 40px; — margin হলো লেখার চারপাশের বাইরের ফাঁকা জায়গা। ছবির ফ্রেমের কথা ভাবুন: দেয়ালে এক ফ্রেম থেকে আরেক ফ্রেমের দূরত্বই margin।',
      hintBn: 'margin: 40px; — সংখ্যার পরে px।',
    }),
    both({
      id: 'c2-p-bg', titleBn: 'অনুচ্ছেদের ব্যাকগ্রাউন্ড', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'background-color: white' },
      explanationBn: 'এবার p-র ঘরে (লাইন ৭) লিখুন: background-color: white; — অনুচ্ছেদগুলো সাদা বাক্সের মতো দেখাবে।',
      hintBn: 'p { আর } চিহ্নের মাঝের ফাঁকা লাইন, লাইন ৭।',
      simplerBn: 'হুবহু: background-color: white;',
    }),
    both({
      id: 'c2-padding', titleBn: 'ভেতরের ফাঁক (padding)', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'padding: 16px' },
      explanationBn: 'Enter চেপে লিখুন: padding: 16px; — padding হলো বাক্সের ভেতরে লেখা আর কিনারার মাঝের ফাঁক। ফ্রেমের উপমায়: ছবি আর ফ্রেমের মাঝের সাদা অংশ।',
      hintBn: 'padding: 16px; — প্রিভিউতে সাদা বাক্সের ভেতরে লেখা কিনারা থেকে সরে এসেছে কি?',
      successMessageBn: 'চমৎকার! এখন margin আর padding-এর পার্থক্য আপনি চোখে দেখতে পাচ্ছেন।',
    }),
    both({
      id: 'c2-save', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/style.css`, text: 'padding: 16px' },
      explanationBn: `সেভ করুন (${SAVE})।`,
      hintBn: 'ওপরের “💾 Save” বোতাম।',
    }),
  ],
  checklist: [
    { id: 'c-bg', textBn: 'ব্যাকগ্রাউন্ডের রং দিয়েছি', stepIds: ['c2-bg', 'c2-p-bg'] },
    { id: 'c-space', textBn: 'margin আর padding দিয়েছি', stepIds: ['c2-margin', 'c2-padding'] },
    { id: 'c-save', textBn: 'সেভ করেছি', stepIds: ['c2-save'] },
  ],
}

const pyOne: Chapter = {
  id: 'py-1',
  titleBn: 'পাইথন ১: print ও ভেরিয়েবল',
  introBn: 'প্রথম পাইথন প্রোগ্রাম: আগে আন্দাজ করি কী ছাপা হবে, তারপর চালিয়ে মিলিয়ে দেখি।',
  setup: setupFor({ 'hello.py': PY_HELLO, 'greet.py': PY_GREET }),
  steps: [
    both({
      id: 'p1-open', titleBn: 'hello.py খুলুন', target: 'code-explorer-hello.py', expectedAction: { type: 'click', target: 'code-explorer-hello.py' },
      explanationBn: 'hello.py খুলুন। .py ফাইল মানে পাইথনের প্রোগ্রাম।',
      hintBn: 'বাঁ দিকের তালিকায় hello.py।',
    }),
    both({
      id: 'p1-predict', titleBn: 'আগে আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Hello, Python!'] },
      explanationBn: 'ফাইলে একটি লাইন: print("Hello, Python!")। print মানে পর্দায় ছাপা (Print)। ভাবুন, চালালে ঠিক কী ছাপা হবে? নিচের ঘরে লিখুন।',
      hintBn: 'print-এর বন্ধনীর ভেতরে কোটেশন চিহ্নের মধ্যের লেখাটিই ছাপা হয়, কোটেশন চিহ্ন ছাড়া।',
      simplerBn: 'কোটেশন চিহ্নের (“ ”) ভেতরের লেখাটি: Hello, Python!',
    }),
    both({
      id: 'p1-run', titleBn: 'চালান (Run)', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Python!', language: 'python' },
      explanationBn: 'এবার সবুজ ▶ Run বোতাম চাপুন। পাইথন প্রথমবার চালু হতে এক-দুই সেকেন্ড সময় নিতে পারে। আউটপুট (Output) নিচে দেখা যাবে।',
      hintBn: 'ওপরের সবুজ “▶ Run” বোতাম।',
      successMessageBn: 'আপনার আন্দাজ মিলেছে তো? আপনি প্রথম প্রোগ্রাম চালিয়ে ফেললেন!',
    }),
    both({
      id: 'p1-line2', titleBn: 'নিজের লাইন যোগ করুন', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Python!\nMy name is Rumi', language: 'python' },
      explanationBn: 'ফাইলের শেষে নতুন লাইনে লিখুন: print("My name is Rumi") — তারপর ▶ Run চাপুন (চালানোর আগে নিজে নিজে সেভও হয়ে যায়)। দুই লাইন ছাপা হবে।',
      hintBn: 'কোটেশন আর বন্ধনী ঠিক আছে তো? লিখতে ( টাইপ করলেই এডিটর ) বসিয়ে দেয়, আপনি শুধু লিখে যান।',
      simplerBn: 'ফাইলের একদম শেষে ক্লিক করে Enter চাপুন, তারপর এই লাইন: print("My name is Rumi")। শেষে ▶ Run।',
    }),
    both({
      id: 'p1-open2', titleBn: 'greet.py খুলুন', target: 'code-explorer-greet.py', expectedAction: { type: 'click', target: 'code-explorer-greet.py' },
      explanationBn: 'এবার greet.py খুলুন। এতে ভেরিয়েবল (Variable) আছে — একটি নাম-লেখা বাক্স, যেখানে কিছু রাখা যায়।',
      hintBn: 'বাঁ দিকের তালিকায় greet.py।',
    }),
    both({
      id: 'p1-predict2', titleBn: 'আবার আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Hello, Rumi'] },
      explanationBn: 'কোড: name = "Rumi" (name বাক্সে "Rumi" রাখা হলো) আর print("Hello, " + name) (+ দিয়ে দুটি লেখা জোড়া লাগে)। কী ছাপা হবে?',
      hintBn: '"Hello, " আর name-এর ভেতরের লেখা পাশাপাশি বসবে। কমার পরে একটি ফাঁক আছে।',
      simplerBn: 'Hello, আর তার পরে Rumi — মাঝে একটি ফাঁক। উত্তর: Hello, Rumi',
    }),
    both({
      id: 'p1-run2', titleBn: 'নামটি বদলে চালান', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Anika', language: 'python' },
      explanationBn: 'প্রথম লাইনে Rumi শব্দটিতে ডাবল ক্লিক করে বেছে নিন (কোটেশন নয়, শুধু নামটি), লিখে দিন: Anika — তারপর ▶ Run। শুধু name বদলালেই পুরো শুভেচ্ছা বদলে গেল — এটাই ভেরিয়েবলের শক্তি।',
      hintBn: 'ফল হবে: Hello, Anika। কোটেশন চিহ্ন যেন মুছে না যায়।',
      simplerBn: 'ভুল হলে Ctrl/Cmd+Z দিয়ে ফিরে যান। প্রথম লাইনটি এমন হবে: name = "Anika"',
      successMessageBn: 'একটি জায়গায় নাম বদলালেই সব জায়গায় বদলে গেল — চমৎকার!',
    }),
  ],
  checklist: [
    { id: 'c-print', textBn: 'print দিয়ে লেখা ছাপিয়েছি', stepIds: ['p1-run', 'p1-line2'] },
    { id: 'c-var', textBn: 'ভেরিয়েবল বদলে ফল বদলেছি', stepIds: ['p1-run2'] },
  ],
}

const pyTwo: Chapter = {
  id: 'py-2',
  titleBn: 'পাইথন ২: input ও অঙ্ক',
  introBn: 'প্রোগ্রামকে প্রশ্ন করতে দিই (input), আর + - * / ** দিয়ে হিসাব করি।',
  setup: setupFor({ 'ask.py': PY_ASK, 'calc.py': PY_CALC, 'next.py': PY_NEXT }),
  steps: [
    both({
      id: 'p2-open-ask', titleBn: 'ask.py খুলুন', target: 'code-explorer-ask.py', expectedAction: { type: 'click', target: 'code-explorer-ask.py' },
      explanationBn: 'ask.py খুলুন। এতে input("…") আছে — প্রোগ্রাম আপনার কাছে কিছু জানতে চাইবে, আর আপনার উত্তরটি name-এ জমা হবে।',
      hintBn: 'বাঁ দিকের তালিকায় ask.py।',
    }),
    both({
      id: 'p2-run-ask', titleBn: 'চালিয়ে উত্তর দিন', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Hello, Anika', language: 'python' },
      explanationBn: '▶ Run চাপুন। একটি নীল বাক্স এসে নাম জানতে চাইবে। সেখানে Anika লিখে “পাঠান” (বা Enter) চাপুন।',
      hintBn: 'নীল বাক্সটি আউটপুটের জায়গায় আসে। ওখানে Anika লিখুন, ঠিক এই বানানে।',
      simplerBn: 'Run → নীল বাক্সে Anika → পাঠান।',
      successMessageBn: 'প্রোগ্রাম আপনার উত্তর পড়ে শুভেচ্ছা জানাল — এটাই input।',
    }),
    both({
      id: 'p2-open-calc', titleBn: 'calc.py খুলুন', target: 'code-explorer-calc.py', expectedAction: { type: 'click', target: 'code-explorer-calc.py' },
      explanationBn: 'calc.py খুলুন। এখানে হিসাবের চিহ্নগুলো (অপারেটর, Operator) আছে: * গুণ, ** ঘাত, / ভাগ।',
      hintBn: 'বাঁ দিকের তালিকায় calc.py।',
    }),
    both({
      id: 'p2-predict', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['100'] },
      explanationBn: 'price = 25, count = 4। প্রথম print(price * count) কত ছাপবে? (শুধু প্রথম লাইনের ফল লিখুন।)',
      hintBn: '২৫-কে ৪ দিয়ে গুণ করুন।',
      simplerBn: '২৫ × ৪ = ১০০। উত্তর ঘরে ইংরেজি অঙ্কে লিখুন: 100',
    }),
    both({
      id: 'p2-run-calc', titleBn: 'চালান', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: '100\n8\n3.5', language: 'python' },
      explanationBn: '▶ Run চাপুন। তিনটি ফল আসবে: 100, 8 (২-এর ঘাত ৩, অর্থাৎ ২×২×২), আর 3.5 (৭ ÷ ২)। লক্ষ করুন, ভাগে দশমিক সংখ্যাও আসে।',
      hintBn: 'ওপরের সবুজ “▶ Run” বোতাম।',
    }),
    both({
      id: 'p2-open-next', titleBn: 'next.py খুলুন', target: 'code-explorer-next.py', expectedAction: { type: 'click', target: 'code-explorer-next.py' },
      explanationBn: 'next.py খুলুন। input() সবসময় লেখা (স্ট্রিং, String) ফেরত দেয়, সংখ্যা নয়। তাই int(…) দিয়ে সেটিকে পূর্ণসংখ্যায় (Integer) বদলে নেওয়া হয়েছে, নইলে ১ যোগ করা যেত না।',
      hintBn: 'বাঁ দিকের তালিকায় next.py।',
    }),
    both({
      id: 'p2-predict2', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['31'] },
      explanationBn: 'কেউ যদি বয়স লেখে 30, তাহলে print(age + 1) কী ছাপবে?',
      hintBn: '৩০ + ১ কত?',
    }),
    both({
      id: 'p2-run-next', titleBn: 'চালিয়ে মিলিয়ে দেখুন', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: '31', language: 'python' },
      explanationBn: '▶ Run চাপুন, নীল বাক্সে 30 লিখে পাঠান।',
      hintBn: 'বাক্সে ইংরেজি অঙ্কে ৩০ লিখুন: 30',
      successMessageBn: 'ঠিক! প্রোগ্রাম এবার হিসাবও করতে পারছে।',
    }),
  ],
  checklist: [
    { id: 'c-input', textBn: 'input দিয়ে উত্তর নিয়েছি', stepIds: ['p2-run-ask'] },
    { id: 'c-math', textBn: '+ - * / ** দিয়ে হিসাব দেখেছি', stepIds: ['p2-run-calc'] },
    { id: 'c-int', textBn: 'int() দিয়ে লেখাকে সংখ্যা বানানো দেখেছি', stepIds: ['p2-run-next'] },
  ],
}

const pyThree: Chapter = {
  id: 'py-3',
  titleBn: 'পাইথন ৩: if ও else',
  introBn: 'প্রোগ্রাম সিদ্ধান্ত নেয়: শর্ত সত্য হলে একটি কাজ, নইলে আরেকটি।',
  setup: setupFor({ 'check.py': PY_CHECK }),
  steps: [
    both({
      id: 'p3-open', titleBn: 'check.py খুলুন', target: 'code-explorer-check.py', expectedAction: { type: 'click', target: 'code-explorer-check.py' },
      explanationBn: 'check.py খুলুন। if মানে “যদি”, else মানে “নইলে”। if age >= 18: লাইনটি প্রশ্ন করছে — বয়স কি ১৮ বা তার বেশি? (>= মানে “বড় বা সমান”)।',
      hintBn: 'বাঁ দিকের তালিকায় check.py।',
    }),
    both({
      id: 'p3-indent', titleBn: 'ভেতরের সরানো লাইন', target: 'code-editor', expectedAction: { type: 'continue' },
      explanationBn: 'লক্ষ করুন, print লাইনগুলো ডান দিকে একটু সরানো (৪টি ফাঁক)। একে ইন্ডেন্টেশন (Indentation) বলে। পাইথন সরানো লাইনগুলোকে ওপরের if বা else-এর “ভেতরের” কাজ মনে করে। এখানে কোলন (:) ভুলবেন না।',
      hintBn: 'পড়া হলে “বুঝেছি, পরের ধাপ” চাপুন।',
    }),
    both({
      id: 'p3-predict', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Adult'] },
      explanationBn: 'age = 20 হলে কোন লাইনটি ছাপা হবে? (ছাপা লেখাটি হুবহু লিখুন।)',
      hintBn: '২০ কি ১৮-এর সমান বা বেশি? হ্যাঁ হলে if-এর ভেতরের লাইন চলে।',
      simplerBn: '২০ ≥ ১৮ সত্য, তাই ছাপা হবে: Adult',
    }),
    both({
      id: 'p3-run', titleBn: 'চালান', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Adult', language: 'python' },
      explanationBn: '▶ Run চাপুন।',
      hintBn: 'ওপরের সবুজ “▶ Run” বোতাম।',
    }),
    both({
      id: 'p3-change', titleBn: 'বয়স বদলে দেখুন', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Not yet an adult', language: 'python' },
      explanationBn: 'প্রথম লাইনে 20-তে ডাবল ক্লিক করে বেছে নিন, লিখুন 15 — তারপর ▶ Run। এবার else-এর ভেতরের লাইন চলবে।',
      hintBn: 'প্রথম লাইনটি হবে: age = 15',
      simplerBn: '20 লেখাটিতে দুবার দ্রুত ক্লিক করলে সেটি নীল হয়ে বাছা হবে। তখন 15 লিখলে ওটির জায়গায় বসবে।',
      successMessageBn: 'একই প্রোগ্রাম, আলাদা সিদ্ধান্ত। প্রোগ্রাম এভাবেই “ভাবে”।',
    }),
    both({
      id: 'p3-edit', titleBn: 'নিজের মতো বদলান', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: ['Adult', 'Not yet an adult'], language: 'python' },
      explanationBn: 'এবার age-এর জায়গায় আপনার পছন্দের যেকোনো সংখ্যা লিখে ▶ Run চাপুন — ১৮-র কম, ১৮, আর বেশি; তিনটিই দেখুন। ১৮ হলে কী হয়?',
      hintBn: 'age = 18 দিলে Adult আসে, কারণ >= মানে “বড় বা সমান”।',
    }),
  ],
  checklist: [
    { id: 'c-if', textBn: 'if আর else দিয়ে দুই রকম ফল দেখেছি', stepIds: ['p3-run', 'p3-change'] },
    { id: 'c-indent', textBn: 'ইন্ডেন্টেশন চিনেছি', stepIds: ['p3-indent'] },
  ],
}

const pyFour: Chapter = {
  id: 'py-4',
  titleBn: 'পাইথন ৪: লুপ ও ভুল শোধরানো',
  introBn: 'একই কাজ বারবার করানো (for লুপ), আর ভুল (error) হলে শান্তভাবে সারানো।',
  setup: setupFor({ 'loop.py': PY_LOOP, 'oops.py': PY_OOPS }),
  steps: [
    both({
      id: 'p4-open', titleBn: 'loop.py খুলুন', target: 'code-explorer-loop.py', expectedAction: { type: 'click', target: 'code-explorer-loop.py' },
      explanationBn: 'loop.py খুলুন। for i in range(3): মানে লুপ (Loop) — ভেতরের কাজ তিনবার চলবে; i-এর মান হবে 0, 1, 2 (পাইথন গোনা শুরু করে ০ থেকে)।',
      hintBn: 'বাঁ দিকের তালিকায় loop.py।',
    }),
    both({
      id: 'p4-predict', titleBn: 'আন্দাজ করুন', target: 'code-editor', expectedAction: { type: 'predictOutput', acceptedAnswers: ['Hello 0'] },
      explanationBn: 'print("Hello", i) কমা দিলে দুটি জিনিস মাঝে একটি ফাঁক দিয়ে ছাপা হয়। প্রথমবারে (i = 0) কী ছাপা হবে?',
      hintBn: 'Hello, একটি ফাঁক, তারপর i-এর মান ০।',
    }),
    both({
      id: 'p4-run', titleBn: 'চালান', target: 'code-run', expectedAction: { type: 'codeOutputEquals', output: 'Hello 0\nHello 1\nHello 2', language: 'python' },
      explanationBn: '▶ Run চাপুন। তিন লাইন ছাপা হবে।',
      hintBn: 'ওপরের সবুজ “▶ Run” বোতাম।',
    }),
    both({
      id: 'p4-five', titleBn: 'পাঁচবার করুন', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello 0\nHello 1\nHello 2\nHello 3\nHello 4', language: 'python' },
      explanationBn: '৩-এ ডাবল ক্লিক করে বেছে নিন, লিখুন 5 — তারপর ▶ Run। এবার পাঁচ লাইন ছাপা হবে। একটি সংখ্যা বদলেই কাজ পাঁচগুণ!',
      hintBn: 'প্রথম লাইনটি হবে: for i in range(5):',
      simplerBn: 'range(3)-এর ৩ লেখাটি ডাবল ক্লিক করে বেছে 5 লিখুন।',
      successMessageBn: 'কম্পিউটার ক্লান্ত হয় না — একই কাজ হাজারবারও করে দেয়!',
    }),
    both({
      id: 'p4-open-oops', titleBn: 'oops.py খুলুন', target: 'code-explorer-oops.py', expectedAction: { type: 'click', target: 'code-explorer-oops.py' },
      explanationBn: 'এই ফাইলে একটি ইচ্ছাকৃত ভুল (বাগ, Bug) রাখা আছে। ভুল হওয়া খারাপ কিছু নয় — প্রোগ্রামাররাও রোজ ভুল করেন আর সারান।',
      hintBn: 'বাঁ দিকের তালিকায় oops.py।',
    }),
    both({
      id: 'p4-run-error', titleBn: 'ভুলসহ চালান', target: 'code-run', expectedAction: { type: 'custom', event: 'code-run-error' },
      explanationBn: '▶ Run চাপুন। কমলা রঙের বাক্সে বাংলায় বোঝানো থাকবে কী হয়েছে, আর নিচে আসল ইংরেজি এরর (Error) বার্তা — মডিউল ১৯-এর মতো শান্তভাবে পড়ুন।',
      hintBn: 'ওপরের সবুজ “▶ Run” বোতাম। এরর আসাটাই এই ধাপের লক্ষ্য!',
    }),
    both({
      id: 'p4-fix', titleBn: 'ভুল সারান', target: 'code-editor', expectedAction: { type: 'codeOutputEquals', output: 'Hello', language: 'python' },
      explanationBn: 'এরর বার্তায় prnt নামটি চেনা যাচ্ছে না বলা হয়েছে। প্রথম শব্দটি prnt-এর জায়গায় print করে দিন (একটি i বাদ পড়েছিল), তারপর ▶ Run।',
      hintBn: 'prnt → print। বাকিটা যেমন আছে তেমন।',
      simplerBn: 'prnt-এর p আর r-এর পরে i বসান: print("Hello")',
      successMessageBn: 'বাগ ধরে সারিয়ে ফেললেন — এটাই আসল প্রোগ্রামারের কাজ!',
    }),
  ],
  checklist: [
    { id: 'c-loop', textBn: 'for লুপ চালিয়ে দেখেছি', stepIds: ['p4-run', 'p4-five'] },
    { id: 'c-bug', textBn: 'একটি বাগ খুঁজে সারিয়েছি', stepIds: ['p4-run-error', 'p4-fix'] },
  ],
}

const projWeb: Chapter = {
  id: 'proj-web',
  titleBn: 'মিনি প্রকল্প ১: আমার প্রথম ওয়েবপেজ',
  introBn: 'শেখা সব মিলিয়ে নিজের সম্পর্কে একটি ওয়েবপেজ: শিরোনাম, অনুচ্ছেদ, তালিকা, লিংক আর CSS — লেখাগুলো আপনার নিজের।',
  setup: setupFor({ 'index.html': PROJECT_HTML, 'style.css': PROJECT_CSS }),
  steps: [
    both({
      id: 'pw-open', titleBn: 'index.html খুলুন', target: 'code-explorer-index.html', expectedAction: { type: 'click', target: 'code-explorer-index.html' },
      explanationBn: 'এবার আপনি নিজে। ধাপগুলো সংক্ষেপে বলা আছে, লেখা আপনার নিজের। index.html খুলুন; ওপরের মন্তব্য-লাইনে ছোট একটি পরিকল্পনা দেওয়া আছে। নিচের ফাঁকা লাইনে লিখবেন।',
      hintBn: 'বাঁ দিকের তালিকায় index.html।',
    }),
    both({
      id: 'pw-h1', titleBn: 'শিরোনাম: আপনার নাম', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</h1>' },
      explanationBn: 'ফাঁকা লাইনে <h1> দিয়ে নিজের নাম বা পাতার নাম লিখুন, শেষে </h1> বন্ধ করুন। বাংলা বা ইংরেজি যা খুশি।',
      hintBn: 'যেমন: <h1>Rumi’s page</h1> — তবে নিজের মতো করে।',
      simplerBn: 'খোলা ট্যাগ <h1>, মাঝে আপনার লেখা, বন্ধ ট্যাগ </h1>।',
    }),
    both({
      id: 'pw-p', titleBn: 'অনুচ্ছেদ: নিজের সম্পর্কে', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</p>' },
      explanationBn: 'Enter চেপে <p> দিয়ে নিজের সম্পর্কে দু-এক লাইন লিখুন, শেষে </p>।',
      hintBn: '<p> আপনার লেখা </p>',
    }),
    both({
      id: 'pw-ul', titleBn: 'তালিকা: তিনটি পছন্দ', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</ul>' },
      explanationBn: 'এবার <ul> দিয়ে শুরু করে তিনটি <li>…</li> লিখুন (যেমন প্রিয় তিনটি খাবার, গান বা জায়গা), শেষে </ul>।',
      hintBn: 'ক্রম: <ul>, তিনটি <li>…</li>, </ul>। প্রতিটি আলাদা লাইনে।',
    }),
    both({
      id: 'pw-a', titleBn: 'একটি লিংক', target: 'code-editor', expectedAction: { type: 'previewContains', text: '</a>' },
      explanationBn: 'একটি লিংক দিন: <a href="https://example.com">লেখা</a> — ঠিকানা আর লেখা আপনার পছন্দমতো।',
      hintBn: '<a href="ঠিকানা">লেখা</a>',
    }),
    both({
      id: 'pw-save-html', titleBn: 'সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/index.html`, text: '</a>' },
      explanationBn: `index.html সেভ করুন (${SAVE})।`,
      hintBn: 'ওপরের “💾 Save” বোতাম।',
    }),
    both({
      id: 'pw-open-css', titleBn: 'style.css খুলুন', target: 'code-explorer-style.css', expectedAction: { type: 'click', target: 'code-explorer-style.css' },
      explanationBn: 'এবার সাজসজ্জা। style.css খুলুন (index.html-এর সাথে এটি আগে থেকেই জোড়া আছে)। প্রিভিউ চোখে রাখুন।',
      hintBn: 'বাঁ দিকের তালিকায় style.css।',
    }),
    both({
      id: 'pw-color', titleBn: 'রং দিন', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'color:' },
      explanationBn: 'লিখুন: h1 { — Enter — color: teal; (এডিটর নিজেই } বসিয়ে দেবে; ওটি যেখানে আছে সেখানেই থাকতে দিন)। রং বদলে যেকোনো রঙের নাম (red, blue, tomato …) দিতে পারেন।',
      hintBn: 'h1 লিখে ফাঁক, তারপর { চিহ্ন। Enter চাপলে মাঝে নতুন লাইন আসবে। সেখানে color: teal;',
      simplerBn: 'প্রথমে h1 { লিখুন, Enter চাপুন। এডিটর নিচে } বসিয়ে দেবে, মাঝের লাইনে color: teal; লিখুন।',
    }),
    both({
      id: 'pw-size', titleBn: 'আকার দিন', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'font-size:' },
      explanationBn: 'একই ঘরে Enter চেপে লিখুন: font-size: 44px; (সংখ্যা বদলে দেখতে পারেন)।',
      hintBn: 'font-size: 44px;',
    }),
    both({
      id: 'pw-align', titleBn: 'লেখা মাঝে আনুন', target: 'code-editor', expectedAction: { type: 'previewContains', text: 'text-align:' },
      explanationBn: 'Enter চেপে লিখুন: text-align: center;',
      hintBn: 'text-align: center;',
    }),
    both({
      id: 'pw-padding', titleBn: 'ফাঁকা জায়গা দিয়ে সেভ করুন', target: 'code-save', expectedAction: { type: 'fileContains', path: `${FOLDER}/style.css`, text: 'padding:' },
      explanationBn: `এবার } চিহ্নের পরের নতুন লাইনে লিখুন: p { — Enter — padding: 16px; — তারপর সেভ করুন (${SAVE})।`,
      hintBn: 'p { Enter padding: 16px; তারপর Save। সেভ হলে তবেই ধাপ শেষ হবে।',
      simplerBn: 'h1-এর ঘর শেষ হলে (} -এর নিচে) নতুন একটি ঘর শুরু করুন: p { … } — তার ভেতরে padding: 16px;',
      successMessageBn: 'আপনার প্রথম ওয়েবপেজ তৈরি! সুন্দর হয়েছে।',
    }),
  ],
  checklist: [
    { id: 'c-h1', textBn: 'শিরোনাম (<h1>) আছে', stepIds: ['pw-h1'] },
    { id: 'c-p', textBn: 'নিজের সম্পর্কে অনুচ্ছেদ (<p>) আছে', stepIds: ['pw-p'] },
    { id: 'c-ul', textBn: 'তিনটি পছন্দের তালিকা (<ul>, <li>) আছে', stepIds: ['pw-ul'] },
    { id: 'c-a', textBn: 'একটি লিংক (<a href>) আছে', stepIds: ['pw-a'] },
    { id: 'c-css', textBn: 'CSS: রং আর আকার দিয়েছি', stepIds: ['pw-color', 'pw-size'] },
    { id: 'c-css2', textBn: 'CSS: লেখা মাঝে আর padding দিয়েছি', stepIds: ['pw-align', 'pw-padding'] },
    { id: 'c-save', textBn: 'দুটি ফাইলই সেভ করেছি', stepIds: ['pw-save-html', 'pw-padding'] },
  ],
}

const projPy: Chapter = {
  id: 'proj-py',
  titleBn: 'মিনি প্রকল্প ২: নাম-আর-বয়সের শুভেচ্ছা',
  introBn: 'প্রোগ্রাম নাম আর বয়স জানতে চাইবে, শুভেচ্ছা জানাবে, আর বলবে আপনি প্রাপ্তবয়স্ক কি না এবং আগামী বছর কত বছর হবে।',
  setup: setupFor({ 'greeting.py': PY_PROJECT }),
  steps: [
    both({
      id: 'pp-open', titleBn: 'greeting.py খুলুন', target: 'code-explorer-greeting.py', expectedAction: { type: 'click', target: 'code-explorer-greeting.py' },
      explanationBn: 'greeting.py খুলুন। ওপরে # দিয়ে শুরু হওয়া লাইনগুলো মন্তব্য (Comment): নিজের নোট, পাইথন এগুলো চালায় না। আপনি নিচে লাইনের পর লাইন লিখে প্রোগ্রাম বানাবেন। প্রতিটি ধাপে ঠিক কী লিখবেন তা বলা আছে, তাই আটকে যাওয়ার ভয় নেই।',
      hintBn: 'বাঁ দিকের তালিকায় greeting.py।',
    }),
    both({
      id: 'pp-name', titleBn: 'নাম জিজ্ঞেস করুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'name = input(' },
      explanationBn: `ফাইলের শেষে ক্লিক করে লিখুন: name = input("What is your name? ") — তারপর সেভ করুন (${SAVE})।`,
      hintBn: 'name, ফাঁক, =, ফাঁক, input( কোটেশনের ভেতরে প্রশ্ন ) — তারপর Save। সেভের পরে ধাপ শেষ হবে।',
      simplerBn: 'ঠিক এই লাইনটি: name = input("What is your name? ")',
    }),
    both({
      id: 'pp-age', titleBn: 'বয়স জিজ্ঞেস করুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'age = int(input(' },
      explanationBn: `নতুন লাইনে লিখুন: age = int(input("How old are you? ")) — int() দিয়ে লেখাকে সংখ্যা বানানো হলো। তারপর সেভ করুন।`,
      hintBn: 'বন্ধনী দুবার বন্ধ হয়: ")) — শেষে দুটি )।',
      simplerBn: 'ঠিক এই লাইনটি: age = int(input("How old are you? "))',
    }),
    both({
      id: 'pp-greet', titleBn: 'শুভেচ্ছা ছাপুন', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'print("Hello, " + name)' },
      explanationBn: 'নতুন লাইনে লিখুন: print("Hello, " + name) — তারপর সেভ করুন।',
      hintBn: 'আগের পাঠের greet.py-র মতোই। কমার পরে ফাঁক রাখুন।',
    }),
    both({
      id: 'pp-next', titleBn: 'আগামী বছরের বয়স', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'age + 1' },
      explanationBn: 'নতুন লাইনে লিখুন: print("Next year you will be", age + 1) — তারপর সেভ করুন।',
      hintBn: 'কমা দিয়ে দুটি জিনিস ছাপানো যায়: একটি লেখা, একটি হিসাব।',
      simplerBn: 'ঠিক এই লাইনটি: print("Next year you will be", age + 1)',
    }),
    both({
      id: 'pp-if', titleBn: 'শর্ত লিখুন (if)', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'if age >= 18:' },
      explanationBn: 'নতুন লাইনে লিখুন: if age >= 18: — Enter চাপলে এডিটর নিজে ভেতরে সরিয়ে (ইন্ডেন্ট করে) দেবে। সেখানে লিখুন: print("You are an adult.") — তারপর সেভ করুন।',
      hintBn: 'if লাইনের শেষে কোলন (:) — আর print লাইনটি ভেতরে সরানো থাকতে হবে।',
      simplerBn: 'দুটি লাইন: if age >= 18: (Enter) তারপর print("You are an adult.") — দ্বিতীয়টি নিজে সরে থাকবে।',
    }),
    both({
      id: 'pp-else', titleBn: 'নইলে (else)', target: 'code-editor', expectedAction: { type: 'fileContains', path: `${FOLDER}/greeting.py`, text: 'else:' },
      explanationBn: 'Enter চেপে লিখুন: else: — লেখার সাথে সাথে এটি বাইরে চলে আসবে। Enter চাপলে আবার ভেতরে সরবে; সেখানে লিখুন: print("You are not an adult yet.") — তারপর সেভ করুন।',
      hintBn: 'else: লাইনটি if-এর সোজাসুজি নিচে (একই সারিতে) থাকবে, সরানো থাকবে না।',
      simplerBn: 'যদি else: ভেতরে সরে থাকে, Backspace চেপে এক ধাপ বাঁয়ে আনুন।',
    }),
    both({
      id: 'pp-run', titleBn: 'চালিয়ে দেখুন', target: 'code-run', expectedAction: { type: 'custom', event: 'code-run-ok' },
      explanationBn: '▶ Run চাপুন। প্রথমে নাম, তারপর বয়স জিজ্ঞেস করবে — নীল বাক্সে লিখে পাঠান। এবার আপনার নিজের প্রোগ্রাম চলছে! চাইলে ১৮-র কম আর বেশি, দুই রকম বয়সই দিয়ে দেখুন।',
      hintBn: 'ওপরের সবুজ “▶ Run”। এরর এলে বার্তা পড়ে দেখুন — কোন লাইনে ভুল তা বলা থাকে।',
      simplerBn: 'এরর এলে লাইনটি আবার মিলিয়ে নিন: কোটেশন, বন্ধনী আর কোলন (:) — এগুলোই সবচেয়ে বেশি ভুল হয়।',
      successMessageBn: 'আপনার নিজের লেখা প্রোগ্রাম আপনার সাথে কথা বলল! এটাই প্রোগ্রামিং।',
    }),
  ],
  checklist: [
    { id: 'c-in', textBn: 'নাম আর বয়স জিজ্ঞেস করেছি (input)', stepIds: ['pp-name', 'pp-age'] },
    { id: 'c-out', textBn: 'শুভেচ্ছা আর আগামী বছরের বয়স ছেপেছি (print)', stepIds: ['pp-greet', 'pp-next'] },
    { id: 'c-cond', textBn: 'if / else দিয়ে প্রাপ্তবয়স্ক কি না দেখিয়েছি', stepIds: ['pp-if', 'pp-else'] },
    { id: 'c-run', textBn: 'প্রোগ্রাম চালিয়ে দেখেছি', stepIds: ['pp-run'] },
  ],
}

/* ---------------- the lesson ---------------- */

const lesson: Lesson = {
  module: 20,
  part: 2,
  id: 'm20',
  titleBn: 'প্রথম কোড',
  oneLineBn: 'HTML, CSS ও প্রথম প্রোগ্রাম লিখে ফল দেখি — এবং পর্ব ২-এর সনদপত্র।',
  minutes: 7,
  simulation: 'editor',
  certificatePart: 2,
  setup: setupFor({ 'index.html': CSS_INDEX2, 'style.css': CSS2, 'play.py': 'print("Hello, Python!")\n' }),
  glossaryIds: [
    'code-tag', 'code-element', 'code-attribute', 'code-heading', 'code-paragraph', 'code-list', 'code-link', 'code-image', 'code-alt',
    'code-utf8', 'code-css', 'code-selector', 'code-property', 'code-value', 'code-variable', 'code-string', 'code-integer', 'code-input',
    'code-print', 'code-operator', 'code-condition', 'code-loop', 'code-indentation', 'code-comment', 'code-run', 'code-output', 'code-error', 'code-bug',
  ],

  explanation: [
    { kind: 'p', textBn: 'অভিনন্দন! কোর্সের শেষ পাঠে আপনাকে স্বাগতম। আজ আপনি প্রথমবার নিজের হাতে কোড লিখবেন, আর সাথে সাথে চোখের সামনে ফল দেখবেন। আগের পাঠগুলোর সবকিছু এখানে কাজে লাগবে: ফাইল সেভ করা, টার্মিনাল চেনা, এরর পড়া, আটকে গেলে করণীয়।' },
    { kind: 'p', textBn: 'পাঠটিতে ১১টি ছোট অংশ (Chapter) আছে: HTML ৩টি, CSS ২টি, পাইথন ৪টি আর ২টি মিনি প্রকল্প। প্রতিটি অংশ আলাদা নতুন নকল কম্পিউটারে চলে, যেখানে কোড এডিটর (Code Editor) আগে থেকেই খোলা আর দরকারি ফাইল তৈরি। একদিনে সব শেষ করতে হবে না; আজ দুটি, কাল দুটি — নিজের গতিতে।' },
    { kind: 'analogy', textBn: 'ওয়েবপেজকে একটি ঘরের মতো ভাবুন। HTML হলো ঘরের কাঠামো: কোথায় দেয়াল, কোথায় দরজা। CSS হলো রং, পর্দা আর সাজসজ্জা: দেখতে কেমন হবে। আর পাইথন (Python) হলো রেসিপি পড়ে রান্না করা রাঁধুনির মতো: আপনি ধাপে ধাপে লিখে দিলে সে ঠিক সেভাবেই কাজ করে।' },

    { kind: 'p', textBn: '১) HTML: পাতার কাঠামো। HTML-এ সবকিছু ট্যাগ (Tag) দিয়ে লেখা হয়। ট্যাগ থাকে < আর > চিহ্নের ভেতরে। বেশিরভাগ ট্যাগ জোড়ায় আসে: খোলার ট্যাগ <p> আর বন্ধের ট্যাগ </p> (এতে একটি / থাকে)। দুটির মাঝের লেখাসহ পুরোটাকে বলে এলিমেন্ট (Element)। নিচের ছবিতে একটি লিংকের অংশগুলোতে ক্লিক করে দেখুন।' },
    { kind: 'widget', widget: 'html-anatomy', props: { mode: 'html' } },
    {
      kind: 'list',
      itemsBn: [
        '<h1>…</h1> সবচেয়ে বড় শিরোনাম (Heading); <h2>, <h3> ক্রমে ছোট, h6 পর্যন্ত।',
        '<p>…</p> অনুচ্ছেদ (Paragraph)।',
        '<ul> আর <li>: বুলেট-তালিকা (List)। <ul> পুরো তালিকা, প্রতিটি <li> তালিকার একেকটি আইটেম।',
        '<a href="…">…</a>: লিংক (Link)। href মানে যেখানে যাবে সেই ঠিকানা।',
        '<img src="…" alt="…">: ছবি (Image)। alt হলো ছবির বর্ণনা: alt টেক্সট (Alt text); ছবি না এলে বা চোখে না দেখলে এই লেখাই কাজে লাগে। <img>-এর বন্ধের ট্যাগ লাগে না।',
      ],
    },
    { kind: 'p', textBn: 'href, src, alt এগুলোকে বলে অ্যাট্রিবিউট (Attribute): ট্যাগের অতিরিক্ত তথ্য, name="value" আকারে লেখা হয়। একটি পুরো পাতা এমন দেখতে:' },
    {
      kind: 'code', language: 'html',
      code: '<!DOCTYPE html>\n<html lang="bn">\n<head>\n  <meta charset="utf-8">\n  <title>আমার পাতা</title>\n</head>\n<body>\n  <h1>স্বাগতম</h1>\n  <p>এটি আমার প্রথম ওয়েবপেজ।</p>\n</body>\n</html>',
    },
    { kind: 'note', textBn: '<head>-এর ভেতরের জিনিস পাতায় দেখা যায় না (পাতার নাম, নিয়ম); <body>-র ভেতরের জিনিসই পর্দায় দেখা যায়। <meta charset="utf-8"> লাইনটি ব্রাউজারকে বলে ফাইলটি UTF-8 নিয়মে পড়তে: UTF-8 হলো এমন একটি ব্যবস্থা, যাতে বাংলাসহ পৃথিবীর প্রায় সব ভাষার অক্ষর (ক্ষ, স্ত, ন্দ-র মতো যুক্তাক্ষরও) ঠিকঠাক সেভ ও দেখা যায়। তাই কোডের লেখার অংশে সরাসরি বাংলা লিখলেও চলে। তবে ট্যাগের নাম (p, h1, a) সবসময় ইংরেজি।' },

    { kind: 'p', textBn: '২) CSS: সাজসজ্জা। CSS একটি নিয়ম লিখে বলে দেয় কোন জিনিস কেমন দেখাবে। নিয়মের তিন ভাগ: সিলেক্টর (Selector, কাকে সাজাব), প্রপার্টি (Property, কী বদলাব) আর ভ্যালু (Value, কীভাবে)।' },
    { kind: 'widget', widget: 'html-anatomy', props: { mode: 'css' } },
    { kind: 'code', language: 'css', code: 'h1 {\n  color: teal;\n  font-size: 40px;\n  text-align: center;\n}' },
    {
      kind: 'list',
      itemsBn: [
        'color: রং। font-size: লেখার আকার। text-align: লেখা বাঁয়ে, মাঝে বা ডানে।',
        'প্রতিটি নিয়মের শেষে সেমিকোলন (;), আর সব নিয়ম { } বন্ধনীর ভেতরে।',
        'margin হলো জিনিসটির বাইরের ফাঁকা জায়গা; padding হলো ভেতরের ফাঁকা জায়গা। ছবির ফ্রেমের কথা ভাবুন: ছবি আর ফ্রেমের মাঝের অংশ padding, দেয়ালে এক ফ্রেম থেকে আরেক ফ্রেমের দূরত্ব margin।',
      ],
    },
    { kind: 'p', textBn: 'CSS আলাদা style.css ফাইলে রাখা হয় আর HTML-এর <head>-এ এই লাইনটি দিয়ে জুড়ে দেওয়া হয়:' },
    { kind: 'code', language: 'html', code: '<link rel="stylesheet" href="style.css">' },

    { kind: 'p', textBn: '৩) পাইথন (Python): প্রথম প্রোগ্রামিং ভাষা। কেন পাইথন? এর কোড ইংরেজি বাক্যের মতো পড়া যায়, নতুনদের জন্য সহজ, আর বাংলা ও ইংরেজিতে শেখার প্রচুর উপকরণ আছে। ওয়েবপেজকে “সজীব” করতে (বোতাম চাপলে কিছু ঘটা) আরেকটি ভাষা লাগে: জাভাস্ক্রিপ্ট (JavaScript), পাইথনের একটি ভাইয়ের মতো। পাইথনের ধারণাগুলো (ভেরিয়েবল, if, লুপ) সেখানেও প্রায় একই, তাই আগে একটিতে ভালো হয়ে নিন।' },
    { kind: 'widget', widget: 'code-trace' },
    {
      kind: 'code', language: 'python',
      code: 'print("স্বাগতম")             # লেখা ছাপা\nname = "Rumi"                # ভেরিয়েবল: নাম দেওয়া বাক্স\nage = int(input("Age? "))    # প্রশ্ন করে উত্তর সংখ্যায় নেওয়া\nprint(age + 1)               # হিসাব: + - * / **\nif age >= 18:                # শর্ত\n    print("adult")           # ভেতরে ৪টি ফাঁক সরানো\nelse:\n    print("not yet")\nfor i in range(3):           # লুপ: তিনবার\n    print(i)',
    },
    {
      kind: 'list',
      itemsBn: [
        'print(…): ভেতরের জিনিস পর্দায় ছাপে। ছাপা ফলকে বলে আউটপুট (Output)।',
        'ভেরিয়েবল (Variable): নাম দেওয়া বাক্স। name = "Rumi" মানে name বাক্সে Rumi রাখা হলো।',
        'কোটেশনের ভেতরের লেখা হলো স্ট্রিং (String); সংখ্যা হলো পূর্ণসংখ্যা (Integer)। বাংলা লেখাও স্ট্রিং হতে পারে: print("স্বাগতম")।',
        'input(…): ব্যবহারকারীর কাছে উত্তর চায়, উত্তর লেখা (স্ট্রিং) হয়ে আসে। সংখ্যা চাইলে int(…) দিয়ে বদলে নিতে হয়।',
        'অপারেটর (Operator): + যোগ, - বিয়োগ, * গুণ, / ভাগ, ** ঘাত। তুলনার জন্য >=, ==, < ইত্যাদি।',
        'if / else (শর্ত, Condition): শর্ত সত্য হলে একটি কাজ, নইলে আরেকটি।',
        'for (লুপ, Loop): একই কাজ বারবার। range(3) মানে ০, ১, ২।',
        'ইন্ডেন্টেশন (Indentation): ভেতরের লাইনগুলো ৪ ঘর সরিয়ে লেখা। পাইথনে এটা শুধু সাজ নয়, নিয়মের অংশ।',
        'মন্তব্য (Comment): # দিয়ে শুরু করা নিজের নোট, পাইথন এটি চালায় না।',
      ],
    },
    { kind: 'note', textBn: 'প্রতিটি পাইথন অংশে আগে আন্দাজ করুন কী ছাপা হবে (Predict), তারপর চালান (Run)। আন্দাজ ভুল হলেও ক্ষতি নেই; ভুল আন্দাজই সবচেয়ে ভালো শেখায়।' },
    { kind: 'p', textBn: 'ভুল হলে ঘাবড়াবেন না। এরর (Error) হলো কম্পিউটারের বলা “এই লাইনে আমি বুঝতে পারছি না”; বাগ (Bug) হলো কোডের ভুল। মডিউল ১৯-এ শিখেছেন: এরর বার্তা শত্রু নয়, বন্ধু; কোন লাইনে কী হয়েছে সেটিই সে বলে দেয়। এখানকার এডিটর বাংলায় সহজ করে বোঝাবে, নিচে আসল ইংরেজি বার্তাও দেখাবে। প্রোগ্রামাররা রোজ বাগ খুঁজে সারান; এটাই কাজের স্বাভাবিক অংশ।' },
    { kind: 'note', textBn: 'এডিটরে কয়েকটি ছোট কথা: (১) সেভ: Windows-এ Ctrl+S, Mac-এ Cmd+S। (২) পাইথনে Enter চাপলে লাইন নিজে ভেতরে সরে, আবার else: লিখলে নিজে বাইরে আসে। (৩) ( [ { " লিখলে এডিটর অনেক সময় নিজেই বন্ধের চিহ্নটি বসিয়ে দেয় (আসল VS Code-ও দেয়), আপনি শুধু লিখে যান। (৪) এডিটর থেকে কার্সার বের করতে Esc চেপে Tab চাপুন। আপনার কম্পিউটারে আসল VS Code একটু আলাদা দেখাতে পারে।' },
    { kind: 'p', textBn: 'পাঠের শেষে আপনি পর্ব ২-এর সনদপত্র পাবেন, আর দেখতে পাবেন “এরপর কোথায় যাব” পথনির্দেশ: ছোট ছোট প্রকল্প, বিনামূল্যের শেখার উৎস আর প্রতিদিনের ৩০ মিনিটের অভ্যাস-ছক, যা ছাপিয়ে রাখা যায়।' },
  ],

  steps: [],
  chapters: [htmlOne, htmlTwo, htmlThree, cssOne, cssTwo, pyOne, pyTwo, pyThree, pyFour, projWeb, projPy],

  freePractice: {
    titleBn: 'নিজে নিজে চেষ্টা করুন',
    instructionBn: 'নকল কম্পিউটারে index.html, style.css আর play.py আছে। যা খুশি বদলান: HTML-এ নতুন একটি শিরোনাম বা তালিকা, CSS-এ নতুন রং, play.py-তে নিজের নাম ছাপানো। ভুল হলে Ctrl/Cmd+Z দিয়ে ফিরে যান; নষ্ট করার কিছু নেই।',
    checklistBn: [
      'index.html-এ নিজের একটি নতুন লাইন লিখেছি',
      'style.css-এ একটি রং বদলে প্রিভিউতে দেখেছি',
      'play.py-তে print বদলে নিজের নাম ছেপেছি',
      'একটি ভুল ঘটিয়ে এরর বার্তা পড়েছি আর সারিয়েছি',
    ],
  },

  quiz: [
    {
      id: 'q-predict', type: 'predictOutput', language: 'python',
      questionBn: 'এই প্রোগ্রাম চালালে কী ছাপা হবে? শুধু ফলটি লিখুন।',
      code: 'x = 4\nprint(x * 3)',
      acceptedAnswers: ['12'],
      hintBn: 'x-এ আছে ৪। ৪-কে ৩ দিয়ে গুণ করলে কত হয়?',
      explanationBn: 'ঠিক! x * 3 = 4 × 3 = 12। ভেরিয়েবলের মান বসিয়ে হিসাব করলেই হয়।',
    },
    {
      id: 'q-tags', type: 'dragMatch',
      questionBn: 'HTML ট্যাগের সাথে তার কাজ মেলান।',
      pairs: [
        { id: 'h1', leftBn: '<h1>', rightBn: 'বড় শিরোনাম' },
        { id: 'p', leftBn: '<p>', rightBn: 'অনুচ্ছেদ' },
        { id: 'ul', leftBn: '<ul>', rightBn: 'বুলেট-তালিকা' },
        { id: 'a', leftBn: '<a href="…">', rightBn: 'লিংক' },
        { id: 'img', leftBn: '<img alt="…">', rightBn: 'ছবি' },
      ],
      hintBn: 'h = heading (শিরোনাম), p = paragraph, ul = unordered list, a = anchor (লিংক), img = image (ছবি)।',
      explanationBn: 'ঠিক! ট্যাগের নামগুলো ইংরেজি শব্দের সংক্ষেপ, তাই মনে রাখা সহজ।',
    },
    {
      id: 'q-css', type: 'multipleChoice',
      questionBn: 'CSS-এ লেখার রং লাল করতে কোন লাইনটি লিখবেন?',
      options: [
        { id: 'a', textBn: 'color: red;' },
        { id: 'b', textBn: 'text = red' },
        { id: 'c', textBn: '<red>লেখা</red>' },
      ],
      correct: ['a'],
      hintBn: 'CSS-এর নিয়ম: প্রপার্টি, কোলন (:), ভ্যালু, সেমিকোলন (;)।',
      explanationBn: 'ঠিক! color হলো প্রপার্টি, red ভ্যালু, আর শেষে সেমিকোলন। বাকি দুটি CSS-এর নিয়ম নয়।',
    },
    {
      id: 'q-order', type: 'ordering',
      questionBn: 'ওয়েবপেজ বানানোর ধাপগুলো সঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'index.html ফাইল খুলি বা বানাই' },
        { id: '2', textBn: 'ট্যাগ দিয়ে শিরোনাম ও অনুচ্ছেদ লিখি' },
        { id: '3', textBn: 'ফাইলটি সেভ করি' },
        { id: '4', textBn: 'প্রিভিউতে ফল দেখে আরও ঠিক করি' },
      ],
      hintBn: 'আগে ফাইল, তারপর লেখা, তারপর সেভ, শেষে ফল দেখা।',
      explanationBn: 'ঠিক! লিখি, সেভ করি, দেখি, আবার বদলাই — প্রোগ্রামাররা সারাক্ষণ এই চক্রেই কাজ করেন।',
    },
    {
      id: 'q-mistake', type: 'clickTarget',
      questionBn: 'নিচের তিন লাইনের পাইথন কোডে কোন লাইনে ভুল আছে?',
      items: [
        { id: 'l1', labelBn: 'লাইন ১: name = "Rumi"', icon: '1️⃣' },
        { id: 'l2', labelBn: 'লাইন ২: if name == "Rumi"', icon: '2️⃣' },
        { id: 'l3', labelBn: 'লাইন ৩:     print("Hello")', icon: '3️⃣' },
      ],
      correct: 'l2',
      hintBn: 'if লাইনের শেষে কিছু একটা থাকার কথা, যা ভেতরের কাজ শুরুর ইশারা দেয়।',
      explanationBn: 'ঠিক! if লাইনের শেষে কোলন (:) নেই। এটি সবচেয়ে সাধারণ ভুলগুলোর একটি; এরর বার্তা লাইন নম্বর বলে দেয়।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'HTML ট্যাগ দিয়ে পাতার কাঠামো লেখে: <h1>, <p>, <ul> ও <li>, <a href>, <img alt>। যা খুলি, তা বন্ধ করি।',
      '<meta charset="utf-8"> থাকলে বাংলা লেখা ঠিকঠাক দেখায়; alt টেক্সটে ছবির বর্ণনা দিন।',
      'CSS-এর নিয়ম: সিলেক্টর { প্রপার্টি: ভ্যালু; }। রং, আকার, লেখার সারি, margin আর padding।',
      'পাইথনে: print, ভেরিয়েবল, input (আর int), + - * / **, if / else, for লুপ। ইন্ডেন্টেশন নিয়মের অংশ।',
      'আগে আন্দাজ, তারপর চালানো। ভুল (বাগ) স্বাভাবিক: এরর বার্তা পড়ুন, লাইন মিলান, সারান।',
    ],
    extraBn: 'আপনি শুরু করেছিলেন কম্পিউটারের সামনে বসে মাউস ধরা শিখে। আজ নিজের হাতে ওয়েবপেজ আর প্রোগ্রাম লিখলেন। এটি শেষ নয়, শুরু: পাঠ শেষ করলে পর্ব ২-এর সনদপত্র আর “এরপর কোথায় যাব” পথনির্দেশ পাবেন।',
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'আসল কম্পিউটারে VS Code (মডিউল ১৮) খুলে Documents/coding/html-css নামে ফোল্ডার বানান। তার ভেতরে index.html আর style.css বানিয়ে আজকের ওয়েবপেজটি আবার লিখুন। তারপর index.html ফাইলে ডাবল ক্লিক করে ব্রাউজারে খুলে দেখুন।',
      'চাইলে পরিবারের কাউকে পাশে বসিয়ে করুন: আপনি কিবোর্ড ধরুন, তিনি শুধু প্রশ্ন করুন (“এই লাইনটি কী করে?”)। ছোট সাফল্যে হাসুন।',
      'Chrome বা Edge ব্রাউজারে কোনো সাধারণ ওয়েবসাইটে মাউসের ডান বোতাম চেপে “View page source” বেছে নিয়ে দেখুন HTML কেমন। না বুঝলেও ক্ষতি নেই, শুধু দেখা।',
      'নিজের নোটবুকে (মডিউল ১৯) আজকের তিনটি নতুন জিনিস লিখে রাখুন।',
      '“এরপর কোথায় যাব” পাতাটি খুলে অভ্যাস-ছকটি ছাপিয়ে নিন আর এই সপ্তাহের ছোট প্রকল্প ঠিক করুন।',
    ],
    windowsTasksBn: [
      'Windows-এ টার্মিনাল (PowerShell) খুলে hello.py ফাইলের ফোল্ডারে গিয়ে লিখুন: python hello.py (না চললে py hello.py)। ফাইলে লিখে নিন: print("স্বাগতম")।',
    ],
    macTasksBn: [
      'Mac-এ টার্মিনাল খুলে hello.py ফাইলের ফোল্ডারে গিয়ে লিখুন: python3 hello.py। ফাইলে লিখে নিন: print("স্বাগতম")।',
    ],
  },

  teacherTipBn:
    'এটি কোর্সের শেষ পাঠ, তাই তাড়াহুড়ো করবেন না। প্রতিটি ছোট অংশ আলাদা দিনেও করা যায়। জোড়ায় প্রোগ্রামিং (Pair Programming) পদ্ধতিটি ভালো কাজ করে: শিক্ষার্থী কিবোর্ড ধরেন, আপনি পাশে বসে শুধু প্রশ্ন করেন: “এই লাইনটা কী করবে বলে মনে হয়?”, “আগে আন্দাজ করুন, তারপর চালান”। সমাধান বলে দেবেন না; এরর বার্তা একসাথে পড়ুন (মডিউল ১৯-এর অভ্যাস)। প্রতিটি ছোট সফলতায় (প্রথম শিরোনাম, প্রথম রং, প্রথম বাগ সারানো) আন্তরিকভাবে উৎসাহ দিন। কুইজে কোথায় বেশি ভুল হয় তা শিক্ষক-পাতায় দেখে সেই অংশ আবার করান। শেষে সনদপত্র ছাপিয়ে আর “এরপর কোথায় যাব” পাতার অভ্যাস-ছক ধরিয়ে দিয়ে আগামী সপ্তাহের একটি ছোট প্রকল্প একসাথে ঠিক করুন।',
}

export default lesson
