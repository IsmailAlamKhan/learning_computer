import type { Lesson, SimSetup, Step } from '../../engine/types'

/**
 * Module 19 — টেক ইংরেজি পড়া ও আটকে গেলে করণীয় (cards format).
 * Three units: (1) ইংরেজি শব্দ চেনা (widget-only, no simulator); (2) এরর পড়া (broken.py: read, fix, re-run);
 * (3) সমাধান খোঁজা ও প্রশ্ন করা (search the exact error, fake Q&A site, docs; asking well; AI as a learning aid; the notebook habit).
 * Step targets and expected actions are the same as in the old guided practice; the `continue`-only reading steps became cards.
 */

const BROKEN = 'message = "Hello, friend"\nprint(mesage)\n'

const brokenSetup: SimSetup = {
  openApps: ['code'],
  vfs: (vfs) => {
    const coding = vfs.child(vfs.home, 'coding') ?? vfs.mkdir(vfs.home, 'coding')
    if (!vfs.child(coding, 'broken.py')) vfs.createFile(coding, 'broken.py', BROKEN)
  },
}

const unit1Steps: Step[] = [
  {
    id: 'w-words-browser',
    osVariant: 'windows',
    titleBn: 'ব্রাউজার খুলুন',
    target: 'taskbar-app-browser',
    expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'টাস্কবারের ব্রাউজার আইকনে ক্লিক করুন।',
    hintBn: 'টাস্কবারে গোল পৃথিবীর মতো আইকনটি।',
  },
  {
    id: 'm-words-browser',
    osVariant: 'mac',
    titleBn: 'ব্রাউজার খুলুন',
    target: 'dock-browser',
    expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'ডকের ব্রাউজার আইকনে ক্লিক করুন।',
    hintBn: 'ডকে গোল পৃথিবীর মতো আইকনটি।',
  },
  {
    id: 'words-wrong-address',
    osVariant: 'both',
    titleBn: 'ইচ্ছে করে ভুল ঠিকানা দিন',
    target: 'browser-address',
    expectedAction: { type: 'navigate', path: 'https://wrong-address.example/' },
    explanationBn: 'ঘরে লিখুন: wrong-address.example — তারপর Enter।',
    hintBn: 'ওপরের ঠিকানার ঘরে ক্লিক করে ওই লেখাটি লিখুন, তারপর Enter/Return।',
    successMessageBn: 'ইংরেজি বার্তা এসেছে — পড়ে দেখুন!',
  },
  {
    id: 'words-read-error',
    osVariant: 'both',
    titleBn: 'বার্তাটি পড়ে ফিরে যান',
    target: 'browser-error-home',
    expectedAction: { type: 'click', target: 'browser-error-home' },
    explanationBn: '“can’t be reached” মানে পৌঁছানো যায়নি। এবার নিচের নীল বোতামে ক্লিক করুন।',
    hintBn: 'বার্তার নিচের নীল বোতাম “Go to the search page”।',
    successMessageBn: 'ভুল ঠিকানা, তাই পাতা নেই — বুঝে গেলেন!',
  },
]

const unit2Steps: Step[] = [
  {
    id: 'open-broken',
    osVariant: 'both',
    titleBn: 'ভাঙা প্রোগ্রামটি খুলুন',
    target: 'code-explorer-broken.py',
    expectedAction: { type: 'click', target: 'code-explorer-broken.py' },
    explanationBn: 'বাঁ দিকের তালিকায় broken.py-তে ক্লিক করুন।',
    hintBn: 'বাঁ দিকের তালিকায় “broken.py” লেখা নামটি।',
  },
  {
    id: 'run-broken',
    osVariant: 'both',
    titleBn: 'প্রোগ্রামটি চালান (Run)',
    target: 'code-run',
    expectedAction: { type: 'click', target: 'code-run' },
    explanationBn: 'সবুজ “Run” চাপুন। নিচে এরর এলে ঠিক আছে!',
    hintBn: 'ওপরের সবুজ “Run” বোতাম। প্রথমবারে এক-দুই সেকেন্ড লাগে, অপেক্ষা করুন।',
    successMessageBn: 'এরর এসেছে — এবার পড়ি!',
  },
  {
    id: 'fix-typo',
    osVariant: 'both',
    titleBn: 'বানান ঠিক করে সেভ করুন',
    target: 'code-editor',
    expectedAction: { type: 'fileContains', path: '~/coding/broken.py', text: 'print(message)' },
    explanationBn: '২ নম্বর লাইনে লিখুন print(message), তারপর Save চাপুন।',
    hintBn: '“mesage”-এ একটি s কম। mes-এর পর আরেকটি s বসান, তারপর Save।',
    simplerBn: 'শেষে ক্লিক করে অক্ষর মুছে পুরো লাইনটি আবার লিখুন: print(message)। শেষে ওপরের “Save” চাপুন।',
    successMessageBn: 'বানান ঠিক হলো!',
  },
  {
    id: 'run-fixed',
    osVariant: 'both',
    titleBn: 'আবার চালান',
    target: 'code-run',
    expectedAction: { type: 'codeOutputEquals', output: 'Hello, friend', language: 'python' },
    explanationBn: 'আবার “Run” চাপুন। “Hello, friend” এলে সফল।',
    hintBn: 'Save করা না থাকলে আগে Save, তারপর Run। একটু অপেক্ষা করুন।',
    successMessageBn: 'এরর পড়ে নিজেই ঠিক করলেন!',
  },
]

const unit3Steps: Step[] = [
  {
    id: 'w-open-browser',
    osVariant: 'windows',
    titleBn: 'ব্রাউজার খুলুন',
    target: 'taskbar-app-browser',
    expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'টাস্কবারের ব্রাউজার আইকনে ক্লিক করুন।',
    hintBn: 'টাস্কবারে গোল পৃথিবীর মতো আইকনটি।',
  },
  {
    id: 'm-open-browser',
    osVariant: 'mac',
    titleBn: 'ব্রাউজার খুলুন',
    target: 'dock-browser',
    expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'ডকের ব্রাউজার আইকনে ক্লিক করুন।',
    hintBn: 'ডকে গোল পৃথিবীর মতো আইকনটি।',
  },
  {
    id: 'search-error',
    osVariant: 'both',
    titleBn: 'হুবহু এরর লিখে খুঁজুন',
    target: 'browser-address',
    expectedAction: { type: 'custom', event: 'browser-search' },
    explanationBn: 'ঘরে লিখুন: NameError: name is not defined python — তারপর Enter।',
    hintBn: 'ঘরে ক্লিক করে ওই লেখাটি লিখে Enter/Return চাপুন।',
    simplerBn: 'এরর থেকে নিজের লেখা নাম (mesage) বাদ দিন, শেষে python যোগ করুন, তারপর Enter।',
  },
  {
    id: 'open-qa',
    osVariant: 'both',
    titleBn: 'প্রথম ফলাফলটি খুলুন',
    target: 'search-result-1',
    expectedAction: { type: 'click', target: 'search-result-1' },
    explanationBn: 'প্রথম নীল শিরোনামে ক্লিক করুন।',
    hintBn: '“NameError: name is not defined (Python)” লেখা নীল শিরোনাম।',
    successMessageBn: 'সবুজ ঘেরা “Accepted answer” দেখুন!',
  },
  {
    id: 'open-docs',
    osVariant: 'both',
    titleBn: 'অফিসিয়াল ডকুমেন্টেশন দেখুন',
    target: 'm19-docs-link',
    expectedAction: { type: 'click', target: 'm19-docs-link' },
    explanationBn: 'সবুজ বাক্সের নিচের নীল লিংকে ক্লিক করুন।',
    hintBn: 'সবুজ বাক্সের একদম নিচের নীল লিংক।',
    successMessageBn: 'অফিসিয়াল পাতা — সবচেয়ে ভরসাযোগ্য!',
  },
]

const lesson: Lesson = {
  module: 19,
  part: 2,
  id: 'm19',
  titleBn: 'টেক ইংরেজি পড়া ও আটকে গেলে করণীয়',
  oneLineBn: 'পর্দার ইংরেজি শব্দ চিনি, এরর শান্তভাবে পড়ি, খুঁজে সমাধান পাই, ভালো প্রশ্ন করি — আর নিজের নোটবুক বানাই।',
  minutes: 8,
  glossaryIds: [
    'tech-error', 'tech-warning', 'tech-failed', 'tech-invalid', 'tech-missing', 'tech-not-found', 'tech-permission-denied', 'tech-timeout', 'tech-deprecated', 'tech-syntax', 'tech-undefined', 'tech-expected', 'tech-unexpected', 'tech-line', 'tech-traceback', 'tech-console', 'tech-install', 'tech-update', 'tech-submit', 'tech-cancel', 'tech-settings', 'tech-login', 'tech-server', 'tech-request', 'tech-connection', 'tech-accepted-answer', 'tech-ai-assistant', 'tech-notebook',
  ],

  units: [
    // =====================================================================================================
    {
      id: 'tech-words',
      titleBn: 'ইংরেজি শব্দ চেনা',
      hook: {
        id: 'h-words',
        type: 'hook',
        textBn: 'পর্দার ইংরেজি দেখে ঘাবড়ে যান? আসলে **অল্প কয়েকটা শব্দ** বারবার ঘুরে আসে!',
        visual: { kind: 'art', name: 'language', captionBn: 'শব্দ চিনলেই ভয় শেষ' },
      },
      cards: [
        {
          id: 'c-warn-err',
          type: 'compare',
          textBn: '**Warning** মানে “সাবধান, কাজ চলছে”। **Error** মানে “কাজ থেমে গেছে”।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'warning' }, labelBn: 'Warning', captionBn: 'সাবধান' },
            right: { visual: { kind: 'art', name: 'cross' }, labelBn: 'Error', captionBn: 'কাজ থেমেছে' },
            vs: 'আর',
          },
          chipsBn: ['Warning = সাবধান', 'Error = থেমে গেছে'],
          learnMoreBn: 'Warning-এ কাজ সাধারণত চলতে থাকে, শুধু একটা বিষয় খেয়াল রাখতে বলা হয় — যেমন “Unsaved changes”। Error-এ কাজটি শেষ করা যায়নি, কারণ লেখা থাকে।',
        },
        {
          id: 'c-widget-words',
          type: 'visual',
          textBn: 'কার্ডে ক্লিক করে বাংলা অর্থ দেখুন, তারপর “শব্দ মেলান”-এ নিজেকে পরীক্ষা করুন।',
          visual: { kind: 'widget', widget: 'tech-words' },
          chipsBn: ['পারেন? শব্দ মেলান'],
        },
        {
          id: 'c-buttons',
          type: 'visual',
          textBn: 'বোতামের ইংরেজিও চেনা: **Submit** জমা দেয়, **Cancel** বাতিল করে।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'upload', labelBn: 'Submit = জমা' },
              { art: 'cross', labelBn: 'Cancel = বাতিল' },
              { art: 'gear', labelBn: 'Settings = সেটিংস' },
              { art: 'key', labelBn: 'Login = ঢোকা' },
            ],
          },
          chipsBn: ['না জানলে Cancel নিরাপদ'],
          learnMoreBn: 'Submit চাপার আগে ফর্মের তথ্য ঠিক আছে কি না দেখে নিন। Login মানে অ্যাকাউন্টে ঢোকা, Logout মানে বেরিয়ে আসা — অন্যের কম্পিউটারে কাজ শেষে Logout করতে ভুলবেন না।',
        },
        {
          id: 'c-denied-notfound',
          type: 'compare',
          textBn: '**Permission denied** = ঢোকার অনুমতি নেই। **Not found** = জিনিসটাই ওই ঠিকানায় নেই।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'lock' }, labelBn: 'Permission denied', captionBn: 'অনুমতি নেই' },
            right: { visual: { kind: 'art', name: 'magnifier' }, labelBn: 'Not found', captionBn: 'খুঁজে পেলাম না' },
            vs: 'আর',
          },
          chipsBn: ['Denied = তালা', 'Not found = নেই'],
          learnMoreBn: 'Not found এলে ফাইল বা ঠিকানার বানান আর জায়গা আবার দেখুন। Permission denied এলে কেন অনুমতি নেই না বুঝে অনুমতি জোর করে বদলাবেন না।',
        },
        {
          id: 'c-wrong-address',
          type: 'visual',
          textBn: 'ভুল ঠিকানা দিলে ব্রাউজারও ইংরেজিতে বলে। চলুন, ইচ্ছে করে একবার দেখি!',
          visual: { kind: 'mock', name: 'browser', highlight: 'address-bar', captionBn: 'ঠিকানার ঘর' },
          chipsBn: ['ভুল ঠিকানা = এরর'],
          learnMoreBn: '“This site can’t be reached” মানে সাইটটিতে পৌঁছানো যায়নি — ঠিকানার বানান ভুল, অথবা ইন্টারনেট নেই। এমন পাতা দেখলে ঘাবড়াবেন না, বানান আর Wi-Fi দেখুন।',
        },
      ],
      setup: { openApps: [] },
      steps: unit1Steps,
      quiz: [
        {
          id: 'q-words',
          type: 'dragMatch',
          questionBn: 'ইংরেজি শব্দগুলো তার বাংলা অর্থের সাথে মেলান।',
          pairs: [
            { id: 'a', leftBn: 'permission denied', rightBn: 'অনুমতি নেই' },
            { id: 'b', leftBn: 'not found', rightBn: 'খুঁজে পাওয়া যায়নি' },
            { id: 'c', leftBn: 'invalid', rightBn: 'ঠিক নয় (নিয়ম মেলেনি)' },
            { id: 'd', leftBn: 'timeout', rightBn: 'সময় শেষ' },
          ],
          hintBn: '“denied” মানে অস্বীকার করা, “found” মানে পাওয়া।',
          explanationBn: 'এই শব্দগুলো এরর বার্তায় বারবার আসে।',
        },
        {
          id: 'q-warning',
          type: 'multipleChoice',
          questionBn: 'পর্দায় লেখা: “Warning: unsaved changes”। এর মানে কী?',
          options: [
            { id: 'a', textBn: 'কাজ থামেনি, কিন্তু সেভ করা হয়নি — সাবধান' },
            { id: 'b', textBn: 'কম্পিউটার নষ্ট হয়ে গেছে' },
            { id: 'c', textBn: 'আপনি বড় ভুল করেছেন' },
          ],
          correct: ['a'],
          hintBn: 'Warning = সতর্কবার্তা, Unsaved = সেভ করা হয়নি।',
          explanationBn: 'Warning মানে খেয়াল রাখার কথা, বিপদ নয়।',
        },
        {
          id: 'q-invalid',
          type: 'multipleChoice',
          questionBn: '“Invalid password” দেখলে কী বুঝবেন?',
          options: [
            { id: 'a', textBn: 'পাসওয়ার্ডটি মেলেনি বা নিয়ম মানেনি' },
            { id: 'b', textBn: 'ইন্টারনেট নেই' },
            { id: 'c', textBn: 'ফাইলটি মুছে গেছে' },
          ],
          correct: ['a'],
          hintBn: 'Invalid মানে “ঠিক নয়”।',
          explanationBn: 'Invalid = নিয়ম মেলেনি; আবার ধীরে লিখে দেখুন।',
        },
      ],
      recapBn: ['Error = কাজ থেমেছে', 'Warning = সাবধান', 'শব্দ চিনলে ভয় কমে'],
    },

    // =====================================================================================================
    {
      id: 'read-errors',
      titleBn: 'এরর পড়া',
      setup: brokenSetup,
      hook: {
        id: 'h-error',
        type: 'hook',
        textBn: 'লাল এরর দেখলে বুক ধড়ফড়? এটা আসলে কম্পিউটারের **একটা চিরকুট**!',
        visual: { kind: 'art', name: 'bug', captionBn: 'ভুল ধরা পড়েছে!' },
      },
      cards: [
        {
          id: 'c-clue',
          type: 'visual',
          textBn: 'এরর আপনার ব্যর্থতা নয় — কম্পিউটারের দেওয়া একটা **সূত্র**। শান্তভাবে পড়ুন।',
          visual: { kind: 'art', name: 'chat-bubble', captionBn: 'এরর = সূত্র' },
          chipsBn: ['এরর = সূত্র', 'শান্তভাবে পড়ুন'],
          learnMoreBn: 'প্রোগ্রামাররাও রোজ এরর পান — কেউ বাদ যান না। পার্থক্য শুধু এটুকু: তাঁরা এরর পড়তে শিখে নিয়েছেন।',
        },
        {
          id: 'c-three-q',
          type: 'visual',
          textBn: 'এক লাইন করে পড়ুন, তিনটি প্রশ্নের উত্তর খুঁজুন: কী ঘটল, কোথায়, আর কী আশা ছিল।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'question', labelBn: 'কী ঘটল?' },
              { art: 'magnifier', labelBn: 'কোথায়?' },
              { art: 'lightbulb', labelBn: 'কী আশা ছিল?' },
            ],
          },
          chipsBn: ['কী', 'কোথায়', 'কী আশা ছিল'],
          learnMoreBn: '“কী” = ভুলের নাম আর বর্ণনা। “কোথায়” = ফাইলের নাম আর লাইন নম্বর। “কী আশা ছিল” = expected / unexpected / not defined-এর মতো শব্দ।',
        },
        {
          id: 'c-traceback',
          type: 'code',
          textBn: 'পাইথনের এরর লম্বা দেখালেও **শেষ লাইন** আগে পড়ুন — আসল কথা সাধারণত ওখানেই।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [
              { code: 'Traceback (most recent call last):', noteBn: 'শিরোনাম — ভয়ের কিছু নেই' },
              { code: '  File "shop.py", line 7, in <module>', noteBn: 'কোথায়: ৭ নম্বর লাইন' },
              { code: '    print(total_price)', noteBn: 'ওই লাইনের কোড' },
              { code: "NameError: name 'total_price' is not defined", noteBn: 'আসল কথা: নামটি তৈরি করা হয়নি' },
            ],
          },
          chipsBn: ['শেষ লাইন আগে', 'line = সারি নম্বর'],
          learnMoreBn: 'NameError মানে একটি নামের সমস্যা। “is not defined” মানে নামটি আগে তৈরি (define) করা হয়নি — বানান ভুল হলে প্রায়ই এটা হয়। ওপরের “line 7” মানে ৭ নম্বর লাইন।',
        },
        {
          id: 'c-error-reader',
          type: 'visual',
          textBn: 'এবার নিজে দেখুন — যেকোনো লাইনে ক্লিক করলে জানা যায় সেটি কী বলছে।',
          visual: { kind: 'widget', widget: 'error-reader' },
          chipsBn: ['পারেন? লাইনে ক্লিক'],
        },
        {
          id: 'c-where-output',
          type: 'visual',
          textBn: 'Run চাপলে এরর **নিচের ঘরে** আসে। সেখানকার ইংরেজি বার্তাটাই আসল।',
          visual: { kind: 'mock', name: 'code-editor', highlight: 'output', captionBn: 'এরর আসে নিচে' },
          chipsBn: ['বাংলা অনুবাদ = সহায়ক', 'ইংরেজিটাই আসল'],
          learnMoreBn: 'এডিটরে বাংলা অনুবাদ থাকলে সেটি শুরুতে সাহস দেয়, কিন্তু বদলি নয়। ইন্টারনেটে খুঁজতে গেলে ইংরেজি বার্তাটাই লাগে — তাই ধীরে ধীরে সেটি পড়তে শিখুন। প্রথমবারে পাইথন চালু হতে এক-দুই সেকেন্ড লাগে।',
        },
      ],
      steps: unit2Steps,
      quiz: [
        {
          id: 'q-traceback',
          type: 'clickTarget',
          questionBn: 'কোন লাইনটি বলছে আসলে কী ভুল হয়েছে? সেটিতে ক্লিক করুন।',
          items: [
            { id: 'l1', labelBn: 'Traceback (most recent call last):' },
            { id: 'l2', labelBn: '  File "shop.py", line 7, in <module>' },
            { id: 'l3', labelBn: '    print(total_price)' },
            { id: 'l4', labelBn: "NameError: name 'total_price' is not defined" },
          ],
          correct: 'l4',
          hintBn: 'শেষ লাইনে ভুলের ধরন আর কারণ দুটোই থাকে।',
          explanationBn: 'শেষ লাইনে ভুলের নাম আর কারণ। ওপরেরগুলো বলে কোথায়: ৭ নম্বর লাইনে।',
        },
        {
          id: 'q-nameerror',
          type: 'multipleChoice',
          questionBn: "“NameError: name 'x' is not defined” — সাধারণত কী হয়েছে?",
          options: [
            { id: 'a', textBn: 'x নামটি আগে তৈরি করা হয়নি, বা বানান ভুল' },
            { id: 'b', textBn: 'কম্পিউটারের ইন্টারনেট নেই' },
            { id: 'c', textBn: 'ফাইলটি সেভ হয়নি' },
          ],
          correct: ['a'],
          hintBn: '“not defined” মানে আগে তৈরি করা হয়নি।',
          explanationBn: 'নামের বানান মিলিয়ে দেখলেই প্রায়ই সমাধান মেলে।',
        },
        {
          id: 'q-order-read',
          type: 'ordering',
          questionBn: 'এরর পড়ার সঠিক ক্রম সাজান।',
          items: [
            { id: '1', textBn: 'থামুন, শান্ত হয়ে পুরো মেসেজ দেখুন' },
            { id: '2', textBn: 'শেষ লাইনে ভুলের নাম পড়ুন' },
            { id: '3', textBn: 'ওপরে গিয়ে লাইন নম্বর দেখুন' },
            { id: '4', textBn: 'ওই লাইনে গিয়ে ভুল ঠিক করুন' },
          ],
          hintBn: 'আগে বুঝুন কী ঘটল, তারপর কোথায়।',
          explanationBn: 'আগে বোঝা, পরে ঠিক করা — এটাই শান্ত পদ্ধতি।',
        },
      ],
      recapBn: ['শেষ লাইন আগে পড়ুন', 'কী, কোথায়, কী আশা ছিল', 'বানান মিলিয়ে দেখুন'],
      freeTryBn: 'print(Message) লিখে চালান — বড় হাতের M কেন সমস্যা করে?',
    },

    // =====================================================================================================
    {
      id: 'find-and-ask',
      titleBn: 'সমাধান খোঁজা ও প্রশ্ন করা',
      setup: { openApps: ['code'], vfs: brokenSetup.vfs },
      hook: {
        id: 'h-search',
        type: 'hook',
        textBn: 'আপনার আগে হাজার মানুষ এই এরর পেয়েছে — **উত্তর আগেই লেখা আছে**!',
        visual: { kind: 'art', name: 'globe', captionBn: 'খুঁজলেই মেলে' },
      },
      cards: [
        {
          id: 'c-search-exact',
          type: 'visual',
          textBn: 'এরর **হুবহু** খুঁজুন, তবে নিজের নাম আর ফাইলের পথ বাদ দিন; শেষে ভাষার নাম দিন।',
          visual: { kind: 'mock', name: 'browser', highlight: 'search-box', captionBn: 'NameError: name is not defined python' },
          chipsBn: ['হুবহু এরর', 'নিজের নাম বাদ', 'শেষে ভাষার নাম'],
          learnMoreBn: 'নিজের ফাইলের পথ, নাম বা ব্যক্তিগত তথ্য সার্চে দেবেন না। আসল কাজে এরর থেকে আপনার নিজের লেখা নামটি (যেমন mesage) বাদ দিয়ে ভাষার নাম যোগ করতে হয়।',
        },
        {
          id: 'c-trust',
          type: 'compare',
          textBn: 'অফিসিয়াল ডকুমেন্টেশন আর সবুজ টিকের **Accepted answer** সাধারণত ভরসাযোগ্য। অচেনা সাইট নয়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'ভরসাযোগ্য', captionBn: 'Docs, Accepted' },
            right: { visual: { kind: 'art', name: 'warning' }, labelBn: 'সাবধান', captionBn: 'অচেনা সাইট' },
            vs: 'আর',
          },
          chipsBn: ['Docs আগে', 'তারিখ দেখুন'],
          learnMoreBn: 'অনেক পুরোনো উত্তর এখন কাজ নাও করতে পারে — তাই তারিখ আর ভার্সন (version) মিলিয়ে নিন। বেশি ভোট পাওয়া উত্তর আগে পড়ুন।',
        },
        {
          id: 'c-one-thing',
          type: 'visual',
          textBn: 'একবারে **একটা** জিনিস বদলে চালান। যে কমান্ড বোঝেন না, তা কখনো চালাবেন না।',
          visual: { kind: 'art', name: 'shield', captionBn: 'বুঝে, তারপর চালাই' },
          chipsBn: ['এক এক করে', 'না বুঝে পেস্ট নয়'],
          learnMoreBn: 'একসাথে অনেক কিছু বদলালে বোঝা যায় না কোনটি কাজ করল। না-বোঝা কমান্ড ফাইল মুছে ফেলতে পারে — আগে অর্থ বুঝুন (মডিউল ৯ আর ১৭-তে যেমন শিখেছেন)।',
        },
        {
          id: 'c-question-builder',
          type: 'visual',
          textBn: 'না মিললে মানুষকে জিজ্ঞেস করুন। ফর্ম ভরলেই সাজানো প্রশ্ন তৈরি।',
          visual: { kind: 'widget', widget: 'question-builder' },
          chipsBn: ['পারেন? প্রশ্ন সাজান'],
        },
        {
          id: 'c-ai',
          type: 'compare',
          textBn: 'এআই সহকারী শেখার সঙ্গী — কিন্তু আত্মবিশ্বাসের সাথে ভুলও বলে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'robot' }, labelBn: 'বুঝে নিন', captionBn: 'ব্যাখ্যা চাই, যাচাই করি' },
            right: { visual: { kind: 'art', name: 'copy' }, labelBn: 'শুধু কপি নয়', captionBn: 'না বুঝে নয়' },
            vs: 'আর',
          },
          chipsBn: ['ব্যাখ্যা চান', 'যাচাই করুন', 'গোপন তথ্য নয়'],
          learnMoreBn: '“ঠিক করে দাও” নয়, বরং “এই এরর মানে কী?” — আগে ইঙ্গিত চান। যা বলল তা ডকুমেন্টেশনে মিলিয়ে নিন বা কোড চালিয়ে দেখুন। পাসওয়ার্ড, ব্যাংকের তথ্য, ফোন নম্বর বা অন্যের ব্যক্তিগত তথ্য কখনো লিখবেন না। (এখানে সিমুলেশনে কোনো এআই চলছে না।)',
        },
        {
          id: 'c-notebook',
          type: 'visual',
          textBn: 'আজকের এরর আর সমাধান **নোটবুকে** লিখে রাখুন। ওপরের মেনুতে “নোটবুক” আছে।',
          visual: { kind: 'art', name: 'notebook', captionBn: 'আমার প্রোগ্রামিং নোটবুক' },
          chipsBn: ['নতুন শব্দ', 'এরর আর সমাধান'],
          learnMoreBn: 'নোটবুক শুধু এই ব্রাউজারে থাকে এবং এক ক্লিকে একটি ফাইল হিসেবে ডাউনলোড করা যায়। প্রতিটি অংশের শেষে “নোটবুকে যোগ করুন” বোতামে সারকথা রাখতে পারেন।',
        },
      ],
      steps: unit3Steps,
      quiz: [
        {
          id: 'q-order',
          type: 'ordering',
          questionBn: 'এরর দেখলে কী কী করবেন? সঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'শান্ত হয়ে পুরো মেসেজটি পড়ুন' },
            { id: '2', textBn: 'শেষ লাইন আর লাইন নম্বর খুঁজুন' },
            { id: '3', textBn: 'হুবহু মেসেজ ভাষার নামসহ খুঁজুন' },
            { id: '4', textBn: 'অফিসিয়াল বা Accepted উত্তর পড়ে একটি জিনিস চেষ্টা করুন' },
            { id: '5', textBn: 'নোটবুকে এরর আর সমাধান লিখে রাখুন' },
          ],
          hintBn: 'আগে পড়া, তারপর খোঁজা, শেষে চেষ্টা আর লিখে রাখা।',
          explanationBn: 'আগে বোঝা, তারপর খোঁজা, তারপর চেষ্টা, শেষে লিখে রাখা।',
        },
        {
          id: 'q-ai',
          type: 'multipleChoice',
          questionBn: 'এআই সহকারীকে শেখার কাজে সবচেয়ে ভালো কীভাবে ব্যবহার করবেন?',
          options: [
            { id: 'a', textBn: 'পুরো উত্তর চেয়ে সরাসরি কপি করে জমা দেব' },
            { id: 'b', textBn: 'ব্যাখ্যা চাইব, তারপর ডকুমেন্টেশনে মিলিয়ে যাচাই করব' },
            { id: 'c', textBn: 'পাসওয়ার্ড আর ব্যক্তিগত তথ্য দিয়ে সমস্যা বোঝাব' },
            { id: 'd', textBn: 'এআই ভুল বলে না, তাই যাচাই লাগে না' },
          ],
          correct: ['b'],
          hintBn: 'এআই ভুল করতে পারে, আর ব্যক্তিগত তথ্য গোপন রাখতে হয়।',
          explanationBn: 'ব্যাখ্যা চাইলে শেখা হয়, যাচাই করলে ভুল ধরা পড়ে।',
        },
        {
          id: 'q-paste',
          type: 'multipleChoice',
          questionBn: 'ফোরামের উত্তরে এমন একটি কমান্ড পেলেন, যা আপনি বোঝেন না। কী করবেন?',
          options: [
            { id: 'a', textBn: 'সাথে সাথে চালিয়ে দেখব' },
            { id: 'b', textBn: 'চালাব না; আগে অর্থ বুঝে অফিসিয়াল উৎসে মেলাব' },
            { id: 'c', textBn: 'অর্ধেকটা চালাব' },
          ],
          correct: ['b'],
          hintBn: 'না-বোঝা কমান্ড ফাইল মুছে ফেলতে পারে।',
          explanationBn: 'না বুঝে চালালে ক্ষতি হতে পারে। আগে বুঝুন, তারপর চালান।',
        },
      ],
      recapBn: ['হুবহু এরর খুঁজুন', 'এআই: বুঝে নিন, যাচাই করুন', 'নোটবুকে লিখে রাখুন'],
      freeTryBn: 'ভালো প্রশ্ন বানানোর ফর্মে নিজের একটি আটকে-যাওয়া সমস্যা সাজান।',
    },
  ],

  realWorld: {
    titleBn: 'আসল কম্পিউটারে এই কাজগুলো করে দেখুন — সব নিরাপদ:',
    tasksBn: [
      'নিজের এডিটরে ইচ্ছে করে print(mesage) চালান, এরর পড়ুন, তারপর ব্রাউজারে হুবহু এরর খুঁজুন।',
      'অ্যাপের “নোটবুক”-এ প্রথম এন্ট্রিটি লিখুন — “এরর যা পেলাম আর সমাধান”।',
      'প্রশ্ন-বানানোর ফর্মে ব্যক্তিগত তথ্য ছাড়া একটি প্রশ্ন সাজান।',
    ],
  },

  teacherTipBn:
    'এই পাঠের মূল লক্ষ্য ভয় কাটানো। এরর দেখলে শান্ত থেকে ধাপে ধাপে পড়ার অভ্যাস করান: কী, কোথায়, কী আশা করা হয়েছিল। এআই সহকারীর ক্ষেত্রে জোর দিন যাচাই করা আর ব্যক্তিগত তথ্য না দেওয়ার ওপর। নোটবুকে শিক্ষার্থীর প্রথম এন্ট্রিটি লেখা হলে তাঁকে উৎসাহ দিন — এটা তাঁর নিজের শেখার সংগ্রহ।',
}

export default lesson
