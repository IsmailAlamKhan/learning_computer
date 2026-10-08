import type { Lesson, Step } from '../../engine/types'

const steps: Step[] = [
  {
    id: 'intro', osVariant: 'both', titleBn: 'আজকের ছোট পরীক্ষা', expectedAction: { type: 'continue' },
    explanationBn: 'এই অনুশীলনে দুটি জিনিস নিজের চোখে দেখবেন: (১) ছবি, গান আর লেখার ফাইলের আকার কত আলাদা, (২) সেভ না করলে কেন লেখা হারিয়ে যায়।',
    hintBn: '“বুঝেছি, পরের ধাপ” বোতামে ক্লিক করুন।',
  },
  {
    id: 'docs', osVariant: 'both', titleBn: 'Documents ফোল্ডার খুলুন', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
    explanationBn: 'ফাইল ম্যানেজারের বাঁ পাশের তালিকা থেকে Documents-এ ক্লিক করুন। এই ফোল্ডারে আমরা কয়েকটি নমুনা ফাইল রেখেছি।',
    hintBn: 'বাঁ দিকের লম্বা তালিকায় Documents লেখাটি খুঁজুন।',
  },
  {
    id: 'rc-photo', osVariant: 'both', titleBn: 'ছবির ফাইলে রাইট ক্লিক করুন', target: 'fm-item-Photo.jpg', expectedAction: { type: 'rightClick', target: 'fm-item-Photo.jpg' },
    explanationBn: 'Photo.jpg ফাইলটির ওপর রাইট ক্লিক করুন (টাচপ্যাডে দুই আঙুলে ট্যাপ)।',
    hintBn: 'তালিকায় Photo.jpg নামের লাইনটির ওপর মাউস রেখে ডান বোতাম চাপুন।',
    simplerBn: 'রাইট ক্লিক মানে মাউসের ডান বোতাম। আগের মডিউলে করেছেন — একটি ছোট মেনু আসবে।',
  },
  {
    id: 'w-props', osVariant: 'windows', titleBn: 'Properties বেছে নিন', target: 'ctx-properties', expectedAction: { type: 'click', target: 'ctx-properties' },
    explanationBn: 'মেনু থেকে Properties বেছে নিন। এতে ফাইলের তথ্য দেখা যায়, যার মধ্যে আছে আকার (Size)।',
    hintBn: 'মেনুর নিচের দিকে Properties লেখাটি আছে।',
  },
  {
    id: 'm-props', osVariant: 'mac', titleBn: 'Get Info বেছে নিন', target: 'ctx-properties', expectedAction: { type: 'click', target: 'ctx-properties' },
    explanationBn: 'মেনু থেকে Get Info বেছে নিন। এতে ফাইলের তথ্য দেখা যায়, যার মধ্যে আছে আকার (Size)।',
    hintBn: 'মেনুতে Get Info লেখাটি খুঁজুন।',
  },
  {
    id: 'see-size', osVariant: 'both', titleBn: 'আকার দেখে নিন, তারপর বন্ধ করুন', target: 'dialog-ok', expectedAction: { type: 'click', target: 'dialog-ok' },
    explanationBn: 'Size লাইনটি দেখুন: ছবিটি প্রায় ৩ মেগাবাইট (MB)। Windows-এ কেবি (KB) সংখ্যায় দেখাতে পারে — ১০০০ কেবি মোটামুটি ১ এমবি। দেখা হলে নিচের OK (Mac-এ Close) চাপুন।',
    hintBn: 'ছোট বক্সের নিচের নীল বোতামটি চাপুন।',
  },
  {
    id: 'compare', osVariant: 'both', titleBn: 'ফাইলগুলোর আকার মিলিয়ে দেখুন', target: 'fm-content', expectedAction: { type: 'continue' },
    explanationBn: 'এবার তালিকার ডান দিকের Size কলামটি দেখুন। ছোট একটি টেক্সট বার্তা প্রায় কিছুই নয়; ছবি কয়েক এমবি; গান তার চেয়ে একটু বেশি; আর সিনেমা (Movie.mp4) শয়ে শয়ে এমবি — প্রায় ৭০০ এমবি, মানে এক জিবির কাছাকাছি! যত বড় ফাইল, স্টোরেজে তত বেশি জায়গা লাগে।',
    hintBn: 'পড়া শেষ হলে “বুঝেছি, পরের ধাপ” চাপুন।',
  },
  // ---- RAM vs storage ----
  {
    id: 'w-open-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'এবার দেখব লেখা কোথায় থাকে। আগে স্টার্ট বোতামে ক্লিক করে Notepad খুলতে হবে।',
    hintBn: 'পর্দার নিচের বাঁ দিক বা মাঝের চারকোনা বোতামটি চাপুন।',
  },
  {
    id: 'w-open-editor', osVariant: 'windows', titleBn: 'Notepad খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
    explanationBn: 'তালিকা থেকে Notepad-এ ক্লিক করুন।',
    hintBn: 'খাতার ছবির পাশে Notepad লেখা আছে।',
  },
  {
    id: 'm-open-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
    explanationBn: 'এবার দেখব লেখা কোথায় থাকে। আগে ডকের লঞ্চপ্যাডে ক্লিক করে TextEdit খুলতে হবে।',
    hintBn: 'নিচের ডকে ছোট রঙিন চৌকো ঘরের আইকনটি দেখুন।',
  },
  {
    id: 'm-open-editor', osVariant: 'mac', titleBn: 'TextEdit খুলুন', target: 'launchpad-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
    explanationBn: 'তালিকা থেকে TextEdit-এ ক্লিক করুন।',
    hintBn: 'TextEdit নামটি খুঁজুন।',
  },
  {
    id: 'write', osVariant: 'both', titleBn: 'কিছু লিখুন (সেভ করবেন না)', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
    explanationBn: 'সাদা জায়গায় ক্লিক করে ইংরেজিতে কিছু লিখুন, যেমন: remember to buy rice। এখনও সেভ করবেন না! এই লেখাটি এখন শুধু মেমোরিতে (RAM) আছে, স্টোরেজে নয়।',
    hintBn: 'সাদা জায়গার ভেতরে ক্লিক করে কিবোর্ডে টাইপ করুন।',
  },
  {
    id: 'close', osVariant: 'both', titleBn: 'সেভ না করে বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
    explanationBn: 'এবার উইন্ডোর বন্ধ করার (✕ বা লাল) বোতাম চাপুন। দেখুন, কম্পিউটার জানতে চাইছে সেভ করবেন কি না।',
    hintBn: 'Windows-এ উইন্ডোর ডান ওপরে, Mac-এ বাঁ ওপরে।',
  },
  {
    id: 'dont-save', osVariant: 'both', titleBn: 'Don’t save বেছে নিন', target: 'dialog-dont-save', expectedAction: { type: 'click', target: 'dialog-dont-save' },
    explanationBn: 'এবার ইচ্ছে করে Don’t save (Mac-এ Don’t Save) চাপুন — লেখা ফেলে দিতে। যেন হঠাৎ বিদ্যুৎ চলে গেল!',
    hintBn: 'তিনটি বোতামের মাঝেরটি।',
  },
  {
    id: 'w-reopen-start', osVariant: 'windows', titleBn: 'আবার স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'এবার Notepad আবার খুলে দেখি লেখাটি আছে কি না।',
    hintBn: 'আবার স্টার্ট বোতামে ক্লিক করুন।',
  },
  {
    id: 'w-reopen-editor', osVariant: 'windows', titleBn: 'Notepad আবার খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
    explanationBn: 'Notepad-এ ক্লিক করুন।',
    hintBn: 'খাতার ছবির পাশে Notepad।',
  },
  {
    id: 'm-reopen-launchpad', osVariant: 'mac', titleBn: 'আবার লঞ্চপ্যাড খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
    explanationBn: 'এবার TextEdit আবার খুলে দেখি লেখাটি আছে কি না।',
    hintBn: 'ডকের লঞ্চপ্যাড আইকনে ক্লিক করুন।',
  },
  {
    id: 'm-reopen-editor', osVariant: 'mac', titleBn: 'TextEdit আবার খুলুন', target: 'launchpad-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
    explanationBn: 'TextEdit-এ ক্লিক করুন।',
    hintBn: 'TextEdit নামটি খুঁজুন।',
  },
  {
    id: 'forgot', osVariant: 'both', titleBn: 'লেখাটি কোথায় গেল?', target: 'editor-text', expectedAction: { type: 'continue' },
    explanationBn: 'পাতা একদম ফাঁকা! লেখাটি শুধু মেমোরিতে (RAM) ছিল, স্টোরেজে (Storage) যায়নি, তাই হারিয়ে গেছে। সেভ করলে লেখাটি ফাইল হয়ে স্টোরেজে চলে যেত। তাই কাজের মাঝে মাঝে সেভ করার অভ্যাস করুন।',
    hintBn: 'বুঝে থাকলে “বুঝেছি, পরের ধাপ” চাপুন।',
  },
]

const lesson: Lesson = {
  module: 14,
  part: 2,
  id: 'm14',
  titleBn: 'কম্পিউটার আসলে কীভাবে কাজ করে',
  oneLineBn: 'ইনপুট, প্রসেসিং, মেমোরি, স্টোরেজ ও আউটপুট কী — রান্নাঘরের উদাহরণে; আর বিট-বাইটের সহজ ধারণা।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: [
    'hw-input', 'hw-processing', 'hw-output', 'hw-cpu', 'hw-memory', 'hw-storage', 'hw-os', 'hw-program', 'hw-hardware',
    'hw-software', 'hw-bit', 'hw-byte', 'hw-binary', 'hw-units', 'hw-unicode', 'hw-server', 'hw-client', 'hw-website-vs-app',
  ],

  setup: {
    openApps: ['files'],
    vfs: (vfs) => {
      const docs = vfs.child(vfs.home, 'Documents')
      if (!docs) return
      vfs.createFile(docs, 'Message.txt', 'Hello, see you at 5.')
      const mk = (name: string, bytes: number) => {
        const f = vfs.createFile(docs, name, '')
        f.sizeBytes = bytes
      }
      mk('Photo.jpg', 3_400_000)
      mk('Song.mp3', 4_800_000)
      mk('Movie.mp4', 700_000_000)
    },
  },

  explanation: [
    { kind: 'p', textBn: 'কম্পিউটার যতই জটিল দেখাক, ভেতরে সে একই পাঁচ ধাপে কাজ করে: কিছু নেয় (ইনপুট – Input), ভাবে ও হিসাব করে (প্রসেসিং – Processing), হাতের কাছে সাময়িকভাবে রাখে (মেমোরি – Memory/RAM), দীর্ঘদিনের জন্য জমা রাখে (স্টোরেজ – Storage), আর শেষে ফল দেখায় (আউটপুট – Output)।' },
    { kind: 'analogy', textBn: 'রান্নাঘরের কথা ভাবুন। উপকরণ (চাল, ডাল) হলো ইনপুট। রাঁধুনি হলো প্রসেসর (CPU) — আসল কাজটা সে-ই করে। রান্নার কাউন্টার বা কাজের টেবিল হলো মেমোরি (RAM) — এখন যা লাগছে তা হাতের কাছে থাকে। ফ্রিজ আর ভাঁড়ার হলো স্টোরেজ — অনেক জিনিস অনেকদিন রাখা থাকে। আর পরিবেশন করা খাবার হলো আউটপুট।' },
    { kind: 'widget', widget: 'kitchen-analogy' },
    { kind: 'p', textBn: 'আরেকটি উদাহরণ লাইব্রেরি। বইয়ের তাকে সব বই থাকে — সেটি স্টোরেজ। যে বইটি এখন পড়ছেন তা পড়ার টেবিলে খোলা — সেটি RAM। আর কে কোন বই কখন পাবে তা দেখেন লাইব্রেরিয়ান — সেটি অপারেটিং সিস্টেম।' },
    { kind: 'widget', widget: 'input-process-output' },
    { kind: 'p', textBn: 'অপারেটিং সিস্টেম (Operating System) হলো কম্পিউটারের “বাড়ির ব্যবস্থাপক”। Windows, macOS আর Linux — এগুলো একেকটি অপারেটিং সিস্টেম। এটিই সব অংশকে মিলিয়ে চালায়, আর আপনার ডেস্কটপ, ফাইল ও প্রোগ্রাম চালানোর ব্যবস্থা করে দেয়। প্রোগ্রাম বা অ্যাপ (Program/App) হলো নির্দিষ্ট কাজের সফটওয়্যার, যেমন লেখার প্রোগ্রাম বা ক্যালকুলেটর।' },
    { kind: 'p', textBn: 'যা ছোঁয়া যায় — পর্দা, কিবোর্ড, প্রসেসর — তা হার্ডওয়্যার (Hardware)। যা ছোঁয়া যায় না, শুধু নির্দেশ হয়ে কাজ করে — অপারেটিং সিস্টেম, প্রোগ্রাম — তা সফটওয়্যার (Software)। হার্ডওয়্যার যেন শরীর, সফটওয়্যার যেন সেই শরীরকে কাজ শেখানো।' },
    { kind: 'note', textBn: 'কেন বিদ্যুৎ চলে গেলে সেভ-না-করা লেখা হারিয়ে যায়? কারণ লেখা টাইপ করার সময় তা থাকে মেমোরিতে (RAM)। RAM খুব দ্রুত, কিন্তু বিদ্যুৎ গেলে একদম সাফ হয়ে যায়, ঠিক কাউন্টারের জিনিস শেষে সরিয়ে ফেলার মতো। “সেভ” করলে লেখাটি ফাইল হয়ে স্টোরেজে (SSD বা HDD) চলে যায়, যা বন্ধ করলেও থাকে — ফ্রিজের মতো।' },
    { kind: 'p', textBn: 'এবার বিট আর বাইট (Bit, Byte)। কম্পিউটারের ভেতরটা অসংখ্য ছোট সুইচের মতো — প্রতিটি হয় চালু (1), নয় বন্ধ (0)। একটি সুইচের নাম বিট। আট সুইচ একসাথে হলে ১ বাইট। শুধু 0 আর 1 দিয়ে সংখ্যা লেখাকে বাইনারি (Binary) বলে। নিচে সুইচ চালু-বন্ধ করে দেখুন — মুখস্থ করার দরকার নেই, শুধু অনুভব করুন।' },
    { kind: 'widget', widget: 'toggle-bits' },
    { kind: 'p', textBn: 'অক্ষরও কম্পিউটারের কাছে সংখ্যা। ইংরেজি A হলো 65, a হলো 97। বাংলা “অ”-এর সংখ্যা 2437। ইউনিকোড (Unicode) নামের নিয়মে পৃথিবীর প্রায় সব ভাষার প্রতিটি অক্ষর এমনকি ইমোজিরও একটি করে নম্বর আছে। তাই আপনি বাংলা বা ইংরেজি যাই লিখুন, কম্পিউটার সেটি সংখ্যা হিসেবে মনে রাখে।' },
    {
      kind: 'list',
      itemsBn: [
        'কেবি (KB): প্রায় এক হাজার বাইট। একটি ছোট টেক্সট বার্তা বা সাধারণ লেখার ফাইল কয়েক কেবির।',
        'এমবি (MB): প্রায় এক হাজার কেবি। ফোনে তোলা একটি ছবি মোটামুটি কয়েক এমবি; একটি গান কয়েক এমবি।',
        'জিবি (GB): প্রায় এক হাজার এমবি। একটি সিনেমা সাধারণত কয়েক শ এমবি থেকে কয়েক জিবি।',
        'যেমন “আমার ফোনে ৬৪ জিবি” মানে ফোনের স্টোরেজে প্রায় ৬৪ জিবির জায়গা আছে — তবে অপারেটিং সিস্টেম আর অ্যাপও কিছুটা জায়গা নেয়। মনে রাখবেন, সংখ্যাগুলো মোটামুটি হিসাব।',
      ],
    },
    { kind: 'p', textBn: 'কম্পিউটারের গতি নিয়ে এক কথায়: প্রসেসর যত দ্রুত আর তার “কোর” (Core, মানে একসাথে কাজ করা ছোট রাঁধুনির সংখ্যা) যত বেশি, কম্পিউটার তত একসাথে অনেক কাজ সামলায়।' },
    { kind: 'p', textBn: 'শেষে ইন্টারনেটের কথা। আপনি যখন ফোনে বা কম্পিউটারে কোনো ওয়েবসাইট খোলেন, তখন আপনার ফোন (ক্লায়েন্ট – Client) অনেক দূরের একটি শক্তিশালী কম্পিউটারকে (সার্ভার – Server) বলে “পাতাটি পাঠাও”, আর সার্ভার তা পাঠিয়ে দেয়। ওয়েবসাইট ব্রাউজারে খুলে দেখা হয়। অ্যাপ ফোনে বা কম্পিউটারে ইনস্টল করা থাকে; তবে বেশিরভাগ অ্যাপও দরকার মতো সার্ভারের সাথে কথা বলে।' },
  ],

  steps,

  freePractice: {
    titleBn: 'নিজে খুঁজে দেখুন',
    instructionBn: 'এই কম্পিউটারে Pictures আর Music ফোল্ডারেও ঘুরে দেখুন। কোনো ফাইলে রাইট ক্লিক করে Properties (Mac-এ Get Info) দেখুন। আরেকবার Notepad/TextEdit খুলে লিখে সেভ করে দেখুন — ফাইলটি Documents-এ আসে আর বন্ধ করে আবার খুললেও লেখা থাকে।',
    checklistBn: [
      'একটি ছবির ফাইলের আকার দেখলাম',
      'একটি লেখা সেভ করে আবার খুলে পেলাম',
      'সেভ না করা লেখা হারিয়ে যেতে দেখলাম',
    ],
  },

  quiz: [
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'কম্পিউটারের অংশের সাথে রান্নাঘরের ভূমিকা মিলিয়ে দিন।',
      pairs: [
        { id: 'input', leftBn: 'ইনপুট', rightBn: 'উপকরণ (চাল, ডাল)' },
        { id: 'cpu', leftBn: 'প্রসেসর (CPU)', rightBn: 'রাঁধুনি' },
        { id: 'ram', leftBn: 'মেমোরি (RAM)', rightBn: 'রান্নার কাউন্টার' },
        { id: 'storage', leftBn: 'স্টোরেজ', rightBn: 'ফ্রিজ / ভাঁড়ার' },
      ],
      hintBn: 'কে রান্না করে আর কোথায় জিনিস অনেকদিন রাখা থাকে — এই দুটি আগে ভাবুন।',
      explanationBn: 'চারটিই মিলেছে! উপকরণ ঢোকে, রাঁধুনি কাজ করে, কাউন্টারে এখনকার জিনিস থাকে, আর ফ্রিজে দীর্ঘদিনের।',
    },
    {
      id: 'q-flow', type: 'ordering', questionBn: 'তথ্য কম্পিউটারের ভেতর দিয়ে যে ক্রমে চলে, ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'ইনপুট: আমি কিবোর্ডে লিখলাম' },
        { id: '2', textBn: 'প্রসেসর (CPU) তা নিয়ে কাজ করল' },
        { id: '3', textBn: 'মেমোরি (RAM)-এ সাময়িকভাবে রাখা হলো' },
        { id: '4', textBn: 'আউটপুট: পর্দায় দেখা গেল' },
      ],
      hintBn: 'আগে কিছু ঢুকতে হবে, শেষে ফল দেখাতে হবে। মাঝের দুটি: কাজ আর রাখা।',
      explanationBn: 'ঠিক! ইনপুট → প্রসেসিং → মেমোরি → আউটপুট। দীর্ঘদিন রাখতে চাইলে এর সাথে স্টোরেজে সেভ করা যোগ হয়।',
    },
    {
      id: 'q-storage', type: 'clickTarget', questionBn: 'কোনটি স্টোরেজ — যেখানে ফাইল বন্ধ করার পরেও জমা থাকে?',
      items: [
        { id: 'keyboard', labelBn: 'কিবোর্ড', icon: '⌨️' },
        { id: 'screen', labelBn: 'পর্দা', icon: '🖥️' },
        { id: 'ssd', labelBn: 'SSD / হার্ড ডিস্ক', icon: '💾' },
        { id: 'speaker', labelBn: 'স্পিকার', icon: '🔊' },
      ],
      correct: 'ssd',
      hintBn: 'যেখানে ছবি, গান আর ফাইল জমিয়ে রাখা হয় — ফ্রিজের মতো জিনিস।',
      explanationBn: 'ঠিক! SSD বা হার্ড ডিস্কই স্টোরেজ। বাকিগুলো ইনপুট বা আউটপুটের যন্ত্র।',
    },
    {
      id: 'q-ram', type: 'multipleChoice', questionBn: 'লেখা সেভ না করে বিদ্যুৎ চলে গেলে লেখা হারিয়ে যায় কেন?',
      options: [
        { id: 'a', textBn: 'লেখাটি তখনও শুধু মেমোরিতে (RAM) ছিল, যা বিদ্যুৎ গেলে সাফ হয়ে যায়' },
        { id: 'b', textBn: 'কিবোর্ড খারাপ হয়ে যায়' },
        { id: 'c', textBn: 'স্টোরেজ সবসময় নিজে নিজে মুছে যায়' },
      ],
      correct: ['a'],
      hintBn: 'কাউন্টারের জিনিস আর ফ্রিজের জিনিসের পার্থক্যটা মনে করুন।',
      explanationBn: 'ঠিক! RAM সাময়িক, স্টোরেজ দীর্ঘস্থায়ী। সেভ করলে লেখা স্টোরেজে যায়।',
    },
    {
      id: 'q-binary', type: 'predictOutput', questionBn: 'বাইনারি সংখ্যাটি দশমিকে কত? (ডান থেকে মান: 1, 2, 4, 8…)',
      code: '00000101', language: 'shell', acceptedAnswers: ['5', '৫'],
      hintBn: 'চালু (1) সুইচগুলোর মান যোগ করুন। ডান থেকে প্রথম আর তৃতীয় সুইচ চালু আছে।',
      explanationBn: 'ঠিক! 1 আর 4 যোগ করলে হয় 5। কম্পিউটার এভাবেই সংখ্যা মনে রাখে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'কম্পিউটারের কাজের পাঁচ ধাপ: ইনপুট → প্রসেসিং → মেমোরি (RAM) → স্টোরেজ → আউটপুট।',
      'রাঁধুনি = প্রসেসর, কাউন্টার = RAM, ফ্রিজ = স্টোরেজ। RAM সাময়িক, স্টোরেজ দীর্ঘদিনের।',
      'সেভ না করলে লেখা RAM-এ থেকে যায়, বিদ্যুৎ গেলে হারায়। তাই সেভ করুন।',
      'অপারেটিং সিস্টেম (Windows, macOS, Linux) কম্পিউটারের ব্যবস্থাপক। হার্ডওয়্যার ছোঁয়া যায়, সফটওয়্যার যায় না।',
      'বিট = 0 বা 1; ৮ বিট = ১ বাইট। অক্ষরও সংখ্যা, ইউনিকোডে সব ভাষার অক্ষরের নম্বর আছে।',
      'KB < MB < GB, প্রতিটি আগেরটির প্রায় হাজার গুণ। ওয়েবসাইট খুললে আপনার ফোন (ক্লায়েন্ট) দূরের সার্ভারের কাছে পাতা চায়।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ — শুধু দেখা।',
    tasksBn: [
      'নিজের কম্পিউটারের কোনো ছবির ফাইলে রাইট ক্লিক করে আকার দেখুন। এক এমবির বেশি কি না?',
      'Notepad বা TextEdit-এ একটি বাক্য লিখে সেভ করুন, বন্ধ করুন, আবার খুলে দেখুন লেখাটি আছে কি না।',
      'নিজের ফোনের সেটিংসে দেখুন মোট স্টোরেজ কত আর কতটা ভরা।',
    ],
    windowsTasksBn: ['Settings → System → Storage খুলে দেখুন কতটা জায়গা ভরা আছে আর কতটা ফাঁকা। (আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে)'],
    macTasksBn: ['System Settings → General → Storage খুলে দেখুন কতটা জায়গা ভরা আছে আর কতটা ফাঁকা। (আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে)'],
  },

  teacherTipBn:
    'এই মডিউলে মুখস্থ নয়, ধারণা গুরুত্বপূর্ণ। রান্নাঘরের উপমাটি ওঁর নিজের রান্নাঘরের উদাহরণ দিয়ে বলুন। “সেভ না করলে হারায়” অভিজ্ঞতাটি নিজে ঘটতে দিন — সেটিই সবচেয়ে ভালো শেখা। বিট-বাইটে চাপ দেবেন না; সুইচগুলো নিয়ে খেলতে দিন, তারপর প্রশ্ন করুন: “৫ বানাতে কোন কোন সুইচ লাগল?”',
}

export default lesson
