import type { Lesson, SimSetup } from '../../engine/types'

/**
 * Module 15 — প্রোগ্রামিং কী ও কেন (cards format). The emotional hook of Part 2.
 * Three units: (1) কম্পিউটারকে নির্দেশ দেওয়া (robot widget, behind-the-screen flow, what programmers do);
 * (2) কোন ভাষা কীসের জন্য (HTML/CSS/JS/Python, path chooser); (3) কোডিং কেমন লাগে — প্রথম ঝলক (real guided run, myths, honest encouragement).
 * Step targets and expected actions are the same as in the old guided practice; the 10 old steps are spread over the units
 * (every unit needs at least one guided step): look-files → unit 1, open-js/read-js → unit 2, the rest → unit 3.
 */

const HELLO_PY = `# এটি Python-এ লেখা একটি ছোট প্রোগ্রাম
print("স্বাগতম! আমি প্রোগ্রামিং শিখছি")
print(2 + 3)
`
const HELLO_JS = `// এটি JavaScript-এ লেখা একটি ছোট প্রোগ্রাম
console.log("স্বাগতম! আমি প্রোগ্রামিং শিখছি")
console.log(2 + 3)
`
const HELLO_HTML = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>আমার প্রথম পাতা</title>
  <style>
    h1 { color: green; }
  </style>
</head>
<body>
  <h1>স্বাগতম!</h1>
  <p>আমি প্রোগ্রামিং শিখছি।</p>
</body>
</html>
`

const setup: SimSetup = {
  openApps: ['code'],
  vfs: (vfs) => {
    const folder = vfs.child(vfs.home, 'coding') ?? vfs.mkdir(vfs.home, 'coding')
    const files: Record<string, string> = { 'hello.html': HELLO_HTML, 'hello.py': HELLO_PY, 'hello.js': HELLO_JS }
    for (const [n, c] of Object.entries(files)) if (!vfs.child(folder, n)) vfs.createFile(folder, n, c)
  },
}

const lesson: Lesson = {
  module: 15,
  part: 2,
  id: 'm15',
  titleBn: 'প্রোগ্রামিং কী ও কেন',
  oneLineBn: 'প্রোগ্রামিং কী, প্রোগ্রামাররা কী করেন, আর কোন পথে শুরু করবেন — একদম সহজ ভাষায়।',
  minutes: 8,
  glossaryIds: ['prog-programming', 'program', 'prog-code', 'prog-instruction', 'prog-programmer', 'prog-algorithm', 'prog-html', 'prog-css', 'prog-javascript', 'prog-python', 'prog-webpage', 'website', 'app', 'prog-bug', 'prog-debug', 'prog-language', 'prog-syntax', 'prog-open-source'],

  units: [
    // =====================================================================================================
    {
      id: 'instructions',
      titleBn: 'কম্পিউটারকে নির্দেশ দেওয়া',
      setup,
      hook: {
        id: 'h-obedient',
        type: 'hook',
        textBn: 'কম্পিউটার খুব বাধ্য — কিন্তু একটুও আন্দাজ করে না!',
        visual: { kind: 'art', name: 'robot' },
      },
      cards: [
        {
          id: 'c-robot',
          type: 'visual',
          textBn: 'রোবটকে ঘরের শেষ প্রান্তে পৌঁছে দিন। সে ঠিক যা বলবেন, তাই করবে।',
          visual: { kind: 'widget', widget: 'exact-instructions', captionBn: 'পারেন? রোবটকে চালান' },
          learnMoreBn: 'আগে একটি অস্পষ্ট নির্দেশ (“এগিয়ে যাও”) দিয়ে দেখুন রোবট কেন থমকে যায়। তারপর “এক ঘর এগোও” পরপর সাজান। পরিষ্কার করে ভাবতে শেখাই প্রোগ্রামিংয়ের আসল অর্ধেক।',
        },
        {
          id: 'c-jhalmuri',
          type: 'visual',
          textBn: 'ঝালমুড়ি বানাতে বললেন “একটু ঝাল দাও”। কম্পিউটার আটকে যাবে — “একটু” মানে কতটুকু, সে জানে না।',
          visual: { kind: 'art', name: 'recipe-card' },
          chipsBn: ['“একটু” বোঝে না', 'পরিমাণ বলতে হয়'],
          learnMoreBn: 'কম্পিউটারকে বলতে হয়: “বাটিতে দুই মুঠো মুড়ি নাও। একটি কাঁচা মরিচ কুচি করো। মুড়ির ওপর ছড়িয়ে দাও।” সে যা বলবেন তাই করবে, তার বেশি কিছু না।',
        },
        {
          id: 'c-what',
          type: 'visual',
          textBn: '**প্রোগ্রামিং** মানে এমন পরিষ্কার নির্দেশ ধাপে ধাপে লিখে দেওয়া। নির্দেশের তালিকাই **প্রোগ্রাম**।',
          visual: { kind: 'art', name: 'tea-cup', captionBn: 'চা বানানোর রেসিপির মতো' },
          chipsBn: ['নির্দেশ', 'প্রোগ্রাম', 'কোড'],
          learnMoreBn: 'নির্দেশগুলো যে ভাষায় লেখা হয়, তার নাম কোড (Code)। যিনি লেখেন, তিনি প্রোগ্রামার। কোড লেখার আগে কাজটা ধাপে ভেবে নেওয়াকে বলে অ্যালগরিদম (Algorithm) — ঠিক যেন রেসিপি।',
        },
        {
          id: 'c-behind',
          type: 'visual',
          textBn: 'বিকাশের মতো অ্যাপে “পাঠান” চাপলে পেছনে ছোট ছোট ধাপ চলে। প্রতিটি ধাপ কারও লেখা নির্দেশ।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'phone', labelBn: 'আপনার ফোন' },
              { art: 'server', labelBn: 'সার্ভার' },
              { art: 'bank', labelBn: 'ব্যাংক' },
              { art: 'check', labelBn: 'টাকা পৌঁছাল' },
            ],
          },
          learnMoreBn: 'আরও উদাহরণ। ক্যালকুলেটর: সংখ্যা মনে রাখে, “=” চাপলে হিসাব করে দেখায়। ATM: কার্ড পড়ে, পিন চায়, মিললে টাকা দেয়। ফেসবুক-পোস্ট: ফোন ছবি পাঠায়, সার্ভার জমা রাখে, বন্ধুদের ফিডে দেখায়। সব কাজই ছোট ধাপে ভাঙা।',
        },
        {
          id: 'c-daily',
          type: 'visual',
          textBn: 'প্রোগ্রামাররা সারাদিন টাইপ করেন না। বেশিরভাগ সময় পড়েন, ভাবেন আর ভুল খোঁজেন।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'book', labelBn: 'পড়েন' },
              { art: 'brain', labelBn: 'ভাবেন' },
              { art: 'code-brackets', labelBn: 'লেখেন' },
              { art: 'bug', labelBn: 'ভুল ঠিক করেন' },
            ],
          },
          chipsBn: ['বাগ রোজকার ব্যাপার', 'খুঁজে দেখা লজ্জার নয়'],
          learnMoreBn: 'ভুলকে বলে বাগ (Bug), ভুল খুঁজে ঠিক করাকে ডিবাগ (Debug)। অভিজ্ঞরাও রোজ বাগ পান। কীভাবে করতে হয় তা ইন্টারনেটে খোঁজা, প্রশ্ন করা আর দলে কাজ করা — সবই স্বাভাবিক।',
        },
      ],
      steps: [
        {
          id: 'look-files',
          osVariant: 'both',
          titleBn: 'কোড এডিটর দেখুন',
          target: 'code-explorer',
          expectedAction: { type: 'continue' },
          explanationBn: 'এটি কোড এডিটর — প্রোগ্রামারের লেখার খাতা। বাঁ দিকে তিনটি ফাইল।',
          hintBn: 'নিচের “বুঝেছি” বোতামে চাপুন।',
        },
      ],
      quiz: [
        {
          id: 'q-order',
          type: 'ordering',
          questionBn: 'চা বানানোর ধাপগুলো ঠিক ক্রমে সাজান। কম্পিউটারকেও ক্রম বলতে হয়।',
          items: [
            { id: '1', textBn: 'কেটলিতে পানি নিয়ে চুলায় বসান' },
            { id: '2', textBn: 'পানি ফুটলে চা-পাতা দিন' },
            { id: '3', textBn: 'দুই মিনিট ফুটতে দিন' },
            { id: '4', textBn: 'ছেঁকে কাপে ঢালুন' },
            { id: '5', textBn: 'চিনি-দুধ মেশান' },
          ],
          hintBn: 'আগে পানি গরম, শেষে মেশানো।',
          explanationBn: 'ক্রম উল্টে গেলে ফল অন্যরকম হয়।',
        },
        {
          id: 'q-literal',
          type: 'multipleChoice',
          questionBn: 'কম্পিউটারকে “একটু ঝাল দাও” বললে কী হয়?',
          options: [
            { id: 'a', textBn: 'সে আন্দাজ করে ঠিক পরিমাণ দেয়' },
            { id: 'b', textBn: 'সে বোঝে না, পরিমাণ বলে দিতে হয়' },
            { id: 'c', textBn: 'সে নিজেই রেসিপি বানিয়ে নেয়' },
          ],
          correct: ['b'],
          hintBn: 'কম্পিউটার আন্দাজ করতে পারে না।',
          explanationBn: 'ঠিক। যা বলবেন তাই করে, তার বেশি নয়।',
        },
        {
          id: 'q-clear',
          type: 'clickTarget',
          questionBn: 'কোনটি কম্পিউটারের জন্য পরিষ্কার নির্দেশ?',
          items: [
            { id: 'clear', labelBn: 'বাটিতে দুই মুঠো মুড়ি নাও', icon: '🥣' },
            { id: 'vague1', labelBn: 'একটু ঝাল দাও', icon: '🌶️' },
            { id: 'vague2', labelBn: 'যা ভালো মনে হয় করো', icon: '🤷' },
            { id: 'vague3', labelBn: 'তাড়াতাড়ি বানাও', icon: '⏱️' },
          ],
          correct: 'clear',
          hintBn: 'যেটিতে ঠিক পরিমাণ আর কাজ বলা আছে।',
          explanationBn: 'সংখ্যা আর কাজ পরিষ্কার — আন্দাজের জায়গা নেই।',
        },
      ],
      recapBn: ['প্রোগ্রামিং = পরিষ্কার নির্দেশ', 'কম্পিউটার আন্দাজ করে না', 'বাগ রোজকার ব্যাপার'],
      freeTryBn: 'কাগজে চায়ের ৫টি নির্দেশ লিখুন, কোনো আন্দাজ ছাড়া।',
    },

    // =====================================================================================================
    {
      id: 'languages',
      titleBn: 'কোন ভাষা কীসের জন্য',
      setup,
      hook: {
        id: 'h-four',
        type: 'hook',
        textBn: 'বাড়ি বানাতে দেয়াল, রং আর সুইচ — আলাদা আলাদা কারিগর!',
        visual: {
          kind: 'flow',
          items: [
            { art: 'html-tag', labelBn: 'HTML: দেয়াল' },
            { art: 'css-brush', labelBn: 'CSS: রং' },
            { art: 'braces', labelBn: 'JS: সুইচ' },
            { art: 'python-snake', labelBn: 'Python: সব কাজ' },
          ],
        },
      },
      cards: [
        {
          id: 'c-html',
          type: 'code',
          textBn: '**HTML** ওয়েবপেজের কাঠামো বানায় — কোথায় শিরোনাম, কোথায় লেখা।',
          visual: {
            kind: 'code',
            lang: 'html',
            browserPreview: true,
            lines: [
              { code: '<h1>স্বাগতম!</h1>', noteBn: 'বড় শিরোনাম' },
              { code: '<p>আমি প্রোগ্রামিং শিখছি।</p>', noteBn: 'একটি লেখা' },
            ],
          },
          learnMoreBn: '<h1> মানে বড় শিরোনাম, <p> মানে অনুচ্ছেদ। ওয়েবপেজ (Web page) মানে ব্রাউজারে দেখা একটি পাতা। অনেক পাতা মিলে একটি ওয়েবসাইট।',
        },
        {
          id: 'c-css',
          type: 'code',
          textBn: '**CSS** সাজায় — রং, অক্ষরের আকার, ফাঁকা জায়গা।',
          visual: {
            kind: 'code',
            lang: 'css',
            browserPreview: true,
            lines: [{ code: 'h1 {', noteBn: 'শিরোনামের জন্য' }, { code: '  color: green;', noteBn: 'সবুজ রং' }, { code: '}' }],
          },
          learnMoreBn: 'HTML আর CSS একসাথে কাজ করে: একটি কাঠামো দেয়, অন্যটি সাজ।',
        },
        {
          id: 'c-js',
          type: 'visual',
          textBn: '**JavaScript** পেজকে সচল করে — বোতাম চাপলে কিছু ঘটে, হিসাব হয়।',
          visual: { kind: 'art', name: 'braces', captionBn: 'পেজের আচরণ' },
          chipsBn: ['প্রায় সব ওয়েবসাইটে', 'বোতাম, হিসাব, নড়াচড়া'],
          learnMoreBn: 'JavaScript-এ পর্দায় দেখাতে লেখা হয় console.log(...)। দেখতে Python-এর কাছাকাছি, শুধু লেখার ধরন একটু আলাদা।',
        },
        {
          id: 'c-python',
          type: 'code',
          textBn: '**Python** সাধারণ কাজের ভাষা — হিসাব, ডেটা, অটোমেশন, AI। কোডে বাংলাও চলে।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'print("স্বাগতম!")', noteBn: 'লেখা দেখাও' },
              { code: 'print(2 + 3)', noteBn: 'হিসাব করে দেখাও' },
            ],
            output: ['স্বাগতম!', '5'],
          },
          learnMoreBn: 'Python-সহ অনেক ভাষা ও টুল ওপেন সোর্স (Open source) — তাদের কোড সবাই দেখতে ও কাজে লাগাতে পারে। তাই এগুলো বিনা পয়সায় পাওয়া যায়।',
        },
        {
          id: 'c-lang-cards',
          type: 'visual',
          textBn: 'চারটি ভাষার কার্ড খুলে দেখুন — কে কী করে।',
          visual: { kind: 'widget', widget: 'language-cards', captionBn: 'পারেন? কার্ড খুলুন' },
          learnMoreBn: 'কোডে বাংলা লেখা চলে: দুই উদ্ধৃতিচিহ্নের (“ ”) ভেতরের বাংলা লেখা পর্দায় ঠিকঠাক দেখা যায়।',
        },
        {
          id: 'c-path',
          type: 'visual',
          textBn: 'কোন পথে আগে যাবেন? চারটি প্রশ্নের উত্তর দিন, আমি প্রস্তাব দেব।',
          visual: { kind: 'widget', widget: 'path-chooser', captionBn: 'পারেন? পথ বেছে নিন' },
          learnMoreBn: 'সাধারণ প্রস্তাব: আগে HTML ও CSS — লাইন লিখলেই পর্দায় ফল দেখা যায়, তাই উৎসাহ থাকে। তারপর Python বা JavaScript।',
        },
      ],
      steps: [
        {
          id: 'open-js',
          osVariant: 'both',
          titleBn: 'hello.js খুলুন',
          target: 'code-explorer-hello.js',
          expectedAction: { type: 'click', target: 'code-explorer-hello.js' },
          explanationBn: 'তালিকা থেকে hello.js-এ ক্লিক করুন।',
          hintBn: 'তালিকার দ্বিতীয় নাম — hello.js।',
        },
        {
          id: 'read-js',
          osVariant: 'both',
          titleBn: 'এটি JavaScript',
          target: 'code-editor',
          expectedAction: { type: 'continue' },
          explanationBn: 'এটি JavaScript। print-এর জায়গায় console.log, কাজ একই — পর্দায় দেখানো।',
          hintBn: 'নিচের “বুঝেছি” বোতামে চাপুন।',
        },
      ],
      quiz: [
        {
          id: 'q-match',
          type: 'dragMatch',
          questionBn: 'প্রতিটি ভাষাকে তার কাজের সাথে মিলিয়ে দিন।',
          pairs: [
            { id: 'html', leftBn: 'HTML', rightBn: 'পেজের কাঠামো' },
            { id: 'css', leftBn: 'CSS', rightBn: 'রং আর সাজ' },
            { id: 'js', leftBn: 'JavaScript', rightBn: 'বোতাম চাপলে কিছু ঘটা' },
            { id: 'py', leftBn: 'Python', rightBn: 'হিসাব আর ডেটার কাজ' },
          ],
          hintBn: 'দেয়াল (কাঠামো), রং (সাজ), সুইচ (আচরণ)।',
          explanationBn: 'কাঠামো, সাজ, আচরণ আর সাধারণ কাজ।',
        },
        {
          id: 'q-code',
          type: 'clickTarget',
          questionBn: 'এগুলোর মধ্যে কোনটি কোড?',
          items: [
            { id: 'code', labelBn: 'print("হ্যালো")', icon: '💻' },
            { id: 'note', labelBn: 'আজ বাজারে যেতে হবে', icon: '📝' },
            { id: 'wish', labelBn: 'পরীক্ষার ফল ভালো হোক', icon: '🌟' },
            { id: 'batt', labelBn: 'ফোনের ব্যাটারি ৫০%', icon: '🔋' },
          ],
          correct: 'code',
          hintBn: 'যেটিতে print আর বন্ধনী ( ) আছে।',
          explanationBn: 'print("হ্যালো") Python-এর নির্দেশ।',
        },
        {
          id: 'q-predict',
          type: 'predictOutput',
          questionBn: 'এই কোড চালালে পর্দায় কী দেখাবে? শুধু উত্তরটি লিখুন।',
          code: 'print(2 + 3)',
          language: 'python',
          acceptedAnswers: ['5', '৫'],
          hintBn: 'print মানে দেখাও। ২ আর ৩ যোগ করুন।',
          explanationBn: 'আগে ২ + ৩ হিসাব, তারপর ৫ দেখায়।',
        },
      ],
      recapBn: ['HTML = কাঠামো, CSS = সাজ', 'JavaScript = আচরণ', 'Python = সাধারণ কাজ'],
      freeTryBn: 'কোনো ওয়েবসাইট খুলে ট্যাবের লেখা (title) দেখুন।',
    },

    // =====================================================================================================
    {
      id: 'first-run',
      titleBn: 'কোডিং কেমন লাগে — প্রথম ঝলক',
      setup,
      hook: {
        id: 'h-first',
        type: 'hook',
        textBn: 'এবার সত্যি সত্যি একটা প্রোগ্রাম চালিয়ে দেখুন!',
        visual: { kind: 'art', name: 'rocket' },
      },
      cards: [
        {
          id: 'c-editor',
          type: 'visual',
          textBn: 'কোড চালানোর জায়গার নাম **কোড এডিটর**। বাঁয়ে ফাইলের তালিকা, মাঝে কোড, নিচে ফল।',
          visual: { kind: 'mock', name: 'code-editor', highlight: 'explorer' },
          chipsBn: ['.py = Python', '.js = JavaScript', '.html = ওয়েবপেজ'],
          learnMoreBn: 'ফাইলের নামের শেষ অংশ (.py, .js, .html) বলে দেয় সেটি কোন ভাষায় লেখা।',
        },
        {
          id: 'c-myth-math',
          type: 'compare',
          textBn: 'ভুল ধারণা বনাম সত্যি: অঙ্ক।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'cross' }, labelBn: 'ভুল ধারণা', captionBn: 'অঙ্কে পাকা হতে হবে' },
            right: { visual: { kind: 'art', name: 'check' }, labelBn: 'সত্যি', captionBn: 'যোগ-বিয়োগই শুরুর জন্য যথেষ্ট' },
            vs: 'বনাম',
          },
          learnMoreBn: 'শুরুতে সাধারণ যোগ-বিয়োগ-গুণ-ভাগ জানলেই হয়। অঙ্কের চেয়ে যুক্তি আর ধৈর্য বেশি কাজে লাগে।',
        },
        {
          id: 'c-myth-age',
          type: 'compare',
          textBn: 'ভুল ধারণা বনাম সত্যি: বয়স।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'cross' }, labelBn: 'ভুল ধারণা', captionBn: 'আমার বয়স বেশি হয়ে গেছে' },
            right: { visual: { kind: 'art', name: 'check' }, labelBn: 'সত্যি', captionBn: 'শেখার কোনো বয়স নেই' },
            vs: 'বনাম',
          },
          learnMoreBn: 'অনেকে প্রাপ্তবয়সে প্রথম প্রোগ্রামিং শিখে ভালো কাজ করছেন। আপনিও পারবেন।',
        },
        {
          id: 'c-myth-english',
          type: 'compare',
          textBn: 'ভুল ধারণা বনাম সত্যি: ইংরেজি।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'cross' }, labelBn: 'ভুল ধারণা', captionBn: 'নিখুঁত ইংরেজি লাগবে' },
            right: { visual: { kind: 'art', name: 'check' }, labelBn: 'সত্যি', captionBn: 'কিছু কাজের শব্দই যথেষ্ট' },
            vs: 'বনাম',
          },
          learnMoreBn: 'print-এর মতো কয়েকশো কাজের শব্দ শিখলেই চলে। আর মুখস্থও লাগে না — প্রোগ্রামাররা রোজ খুঁজে দেখেন।',
        },
        {
          id: 'c-honest',
          type: 'visual',
          textBn: 'সৎ কথা: সময় লাগে। রোজ ৩০ মিনিট, সপ্তাহে একদিন ৫ ঘণ্টার চেয়ে ভালো।',
          visual: { kind: 'art', name: 'stairs', captionBn: 'এক ধাপ, তারপর আরেক ধাপ' },
          chipsBn: ['আটকে যাওয়া = শিখছেন', 'ভুলের বার্তা বন্ধু', 'ছোট জয় উদযাপন'],
          learnMoreBn: 'কঠিন লাগলে বিরতি নিন, পরদিন আবার দেখুন — অনেক সমস্যা ঘুমের পর সহজ লাগে। ভুল কোড চালালে কম্পিউটার নষ্ট হয় না, শুধু ভুলের বার্তা আসে। আর প্রশ্ন করাও শেখার অংশ।',
        },
      ],
      steps: [
        {
          id: 'open-py',
          osVariant: 'both',
          titleBn: 'hello.py খুলুন',
          target: 'code-explorer-hello.py',
          expectedAction: { type: 'click', target: 'code-explorer-hello.py' },
          explanationBn: 'বাঁ দিকের তালিকায় hello.py-তে ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকায় “hello.py” লেখা নামটি।',
          simplerBn: 'তালিকার তৃতীয় নাম hello.py। তার ওপর একবার ক্লিক করুন।',
        },
        {
          id: 'read-py',
          osVariant: 'both',
          titleBn: 'এটি Python',
          target: 'code-editor',
          expectedAction: { type: 'continue' },
          explanationBn: 'এটি Python। দুটি print — একটি বাংলা লেখা, একটি ২ + ৩ দেখাবে।',
          hintBn: 'নিচের “বুঝেছি” বোতামে চাপুন।',
        },
        {
          id: 'run-py',
          osVariant: 'both',
          titleBn: 'Run চাপুন',
          target: 'code-run',
          expectedAction: { type: 'codeOutputEquals', output: 'স্বাগতম! আমি প্রোগ্রামিং শিখছি\n5', language: 'python' },
          explanationBn: 'ওপরের সবুজ “Run” বোতামে ক্লিক করুন।',
          hintBn: 'Python প্রথমবার চালু হতে ১–২ সেকেন্ড লাগে — একটু অপেক্ষা করুন।',
          simplerBn: 'এডিটরের ওপরে সবুজ “Run” বোতামে ক্লিক করে একটু অপেক্ষা করুন।',
        },
        {
          id: 'see-output',
          osVariant: 'both',
          titleBn: 'ফল দেখুন',
          target: 'code-output',
          expectedAction: { type: 'continue' },
          explanationBn: 'আউটপুটে আপনার বাংলা বাক্য আর ৫ দেখুন। আপনি প্রোগ্রাম চালালেন!',
          hintBn: 'নিচের “বুঝেছি” বোতামে চাপুন।',
          successMessageBn: 'প্রথম প্রোগ্রাম চালানো হলো!',
        },
        {
          id: 'open-html',
          osVariant: 'both',
          titleBn: 'hello.html খুলুন',
          target: 'code-explorer-hello.html',
          expectedAction: { type: 'previewContains', text: 'আমি প্রোগ্রামিং শিখছি' },
          explanationBn: 'hello.html-এ ক্লিক করুন — ডানে প্রিভিউ আসবে।',
          hintBn: 'তালিকার প্রথম নাম — hello.html।',
          simplerBn: 'তালিকার একদম ওপরের নাম hello.html। তার ওপর একবার ক্লিক করুন।',
        },
        {
          id: 'see-html',
          osVariant: 'both',
          titleBn: 'এটি HTML ও CSS',
          target: 'code-preview',
          expectedAction: { type: 'continue' },
          explanationBn: 'বাঁয়ে কোড, ডানে ফল। <h1> বড় শিরোনাম, color: green সবুজ রং।',
          hintBn: 'নিচের “বুঝেছি” বোতামে চাপুন।',
        },
        {
          id: 'finish',
          osVariant: 'both',
          titleBn: 'আপনি পারছেন',
          expectedAction: { type: 'continue' },
          explanationBn: 'তিন ধরনের ফাইল দেখলেন, একটি প্রোগ্রাম চালালেন। আপনি পারছেন!',
          hintBn: 'নিচের “বুঝেছি” বোতামে চাপুন।',
          successMessageBn: 'পথের প্রথম ধাপ পার!',
        },
      ],
      quiz: [
        {
          id: 'q-myth',
          type: 'multipleChoice',
          questionBn: 'প্রোগ্রামিং শেখা নিয়ে কোন কথাটি সত্যি?',
          options: [
            { id: 'a', textBn: 'খুব ভালো অঙ্ক না জানলে শেখা যায় না' },
            { id: 'b', textBn: 'সাধারণ যোগ-বিয়োগ, যুক্তি আর ধৈর্য থাকলে শুরু করা যায়' },
            { id: 'c', textBn: 'ত্রিশ পার হলে আর শেখা যায় না' },
            { id: 'd', textBn: 'সব কোড মুখস্থ রাখতে হয়' },
          ],
          correct: ['b'],
          hintBn: 'তিনটি প্রচলিত ভুল ধারণা। সত্যিটা কোনটি?',
          explanationBn: 'শুরুতে সাধারণ অঙ্ক, যুক্তি আর ধৈর্যই যথেষ্ট।',
        },
        {
          id: 'q-bug',
          type: 'multipleChoice',
          questionBn: 'কোডে ভুল থাকলে সাধারণত কী হয়?',
          options: [
            { id: 'a', textBn: 'কম্পিউটার নষ্ট হয়ে যায়' },
            { id: 'b', textBn: 'ভুলের বার্তা আসে, পড়ে ঠিক করা যায়' },
            { id: 'c', textBn: 'সব ফাইল মুছে যায়' },
          ],
          correct: ['b'],
          hintBn: 'ভুলের বার্তা শত্রু নয়, বন্ধু।',
          explanationBn: 'বার্তা বলে দেয় কোথায় দেখতে হবে।',
        },
        {
          id: 'q-habit',
          type: 'multipleChoice',
          questionBn: 'শেখার জন্য কোন অভ্যাসটি সবচেয়ে ভালো?',
          options: [
            { id: 'a', textBn: 'রোজ ৩০ মিনিট' },
            { id: 'b', textBn: 'মাসে একদিন সারাদিন' },
            { id: 'c', textBn: 'আটকে গেলে একেবারে ছেড়ে দেওয়া' },
          ],
          correct: ['a'],
          hintBn: 'ছোট ছোট নিয়মিত বিরতিতে মস্তিষ্ক ভালো শেখে।',
          explanationBn: 'নিয়মিত অল্প সময়ই সবচেয়ে কাজের।',
        },
      ],
      recapBn: ['অঙ্ক, বয়স, ইংরেজি — বাধা নয়', 'রোজ ৩০ মিনিট যথেষ্ট', 'ভুলের বার্তা বন্ধু'],
      freeTryBn: 'আবার hello.py চালান। এবার Run চাপার আগে ফল আন্দাজ করুন।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল জীবনে চেষ্টা করুন। সবগুলো নিরাপদ।',
    tasksBn: [
      'কাগজে ঝালমুড়ির ৫টি নির্দেশ লিখুন, তারপর কাউকে আক্ষরিকভাবে পালন করতে বলুন।',
      'ব্রাউজারে কোনো ওয়েবপেজ খুলে ট্যাবের লেখা (title) আর URL দেখুন।',
      'লিখুন: “আমি যে ৩টি জিনিস বানাতে চাই”। কয়েক মাস পর আবার পড়ুন।',
    ],
  },

  teacherTipBn:
    'লক্ষ্য একটাই: ভয় কমানো আর কৌতূহল বাড়ানো। কোনো কোড মুখস্থ করাবেন না। “আক্ষরিক নির্দেশ” খেলাটি সত্যি খেলুন: তিনি কাগজে ঝালমুড়ি বা চা বানানোর ৫টি নির্দেশ লিখুন, আপনি ঠিক যা লেখা আছে তার বেশি কিছু করবেন না — যেমন “মরিচ দাও” লেখা থাকলে আস্ত মরিচ বাটিতে ফেলবেন। হাসতে হাসতে তিনি বুঝে যাবেন কেন কম্পিউটারকে পরিষ্কার বলতে হয়। আর শেখার সময় বারবার মনে করিয়ে দিন: আটকে যাওয়া মানে শেখা চলছে।',
}

export default lesson
