import type { Lesson, SimSetup, Step } from '../../engine/types'

/**
 * Module 14 — কম্পিউটার আসলে কীভাবে কাজ করে (cards format).
 * Three units: (1) ইনপুট থেকে আউটপুট (+ OS vs program, hardware vs software);
 * (2) RAM বনাম স্টোরেজ (unsaved work is lost; file sizes via Properties / Get Info);
 * (3) বিট, বাইট ও ইউনিকোড (+ KB/MB/GB, client/server, app vs website).
 * Step targets and expected actions are the same as in the old guided practice.
 */

const setup: SimSetup = {
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
}

const openDocs = (id: string, hintBn: string): Step => ({
  id,
  osVariant: 'both',
  titleBn: 'Documents ফোল্ডার খুলুন',
  target: 'fm-sidebar-Documents',
  expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
  explanationBn: 'বাঁ পাশের তালিকা থেকে Documents-এ ক্লিক করুন।',
  hintBn,
  successMessageBn: 'ফোল্ডার খুলেছে!',
})

const propsSteps = (prefix: string, file: string): Step[] => [
  {
    id: `${prefix}-rc`,
    osVariant: 'both',
    titleBn: 'ফাইলে রাইট ক্লিক করুন',
    target: `fm-item-${file}`,
    expectedAction: { type: 'rightClick', target: `fm-item-${file}` },
    explanationBn: `${file}-এর ওপর রাইট ক্লিক করুন (টাচপ্যাডে দুই আঙুলে ট্যাপ)।`,
    hintBn: `তালিকায় ${file} লাইনটির ওপর ডান বোতাম চাপুন।`,
    simplerBn: 'রাইট ক্লিক মানে মাউসের ডান বোতাম। একটি ছোট মেনু আসবে।',
    successMessageBn: 'মেনু এসেছে!',
  },
  {
    id: `${prefix}-w-props`,
    osVariant: 'windows',
    titleBn: 'Properties বেছে নিন',
    target: 'ctx-properties',
    expectedAction: { type: 'click', target: 'ctx-properties' },
    explanationBn: 'মেনু থেকে Properties বেছে নিন।',
    hintBn: 'মেনুর নিচের দিকে Properties লেখাটি আছে।',
    successMessageBn: 'তথ্য এসেছে!',
  },
  {
    id: `${prefix}-m-props`,
    osVariant: 'mac',
    titleBn: 'Get Info বেছে নিন',
    target: 'ctx-properties',
    expectedAction: { type: 'click', target: 'ctx-properties' },
    explanationBn: 'মেনু থেকে Get Info বেছে নিন।',
    hintBn: 'মেনুতে Get Info লেখাটি খুঁজুন।',
    successMessageBn: 'তথ্য এসেছে!',
  },
  {
    id: `${prefix}-size`,
    osVariant: 'both',
    titleBn: 'আকার দেখে বন্ধ করুন',
    target: 'dialog-ok',
    expectedAction: { type: 'click', target: 'dialog-ok' },
    explanationBn: 'Size লাইনটি দেখুন, তারপর OK (Mac-এ Close) চাপুন।',
    hintBn: 'ছোট বক্সের নিচের নীল বোতামটি চাপুন।',
    simplerBn: 'Windows কেবি (KB) সংখ্যায় দেখাতে পারে — ১০০০ কেবি মোটামুটি ১ এমবি।',
    successMessageBn: 'দেখা হলো!',
  },
]

const lesson: Lesson = {
  module: 14,
  part: 2,
  id: 'm14',
  titleBn: 'কম্পিউটার আসলে কীভাবে কাজ করে',
  oneLineBn: 'ইনপুট, প্রসেসিং, মেমোরি, স্টোরেজ ও আউটপুট — রান্নাঘরের উদাহরণে; আর বিট-বাইটের সহজ ধারণা।',
  minutes: 9,
  glossaryIds: [
    'hw-input', 'hw-processing', 'hw-output', 'hw-cpu', 'hw-memory', 'hw-storage', 'hw-os', 'hw-program', 'hw-hardware',
    'hw-software', 'hw-bit', 'hw-byte', 'hw-binary', 'hw-units', 'hw-unicode', 'hw-server', 'hw-client', 'hw-website-vs-app',
  ],

  units: [
    // =====================================================================================================
    {
      id: 'input-output',
      titleBn: 'ইনপুট থেকে আউটপুট',
      setup,
      hook: {
        id: 'h-flow',
        type: 'hook',
        textBn: 'কম্পিউটার ভেতরে ভেতরে কী করে? **একটা রান্নাঘরের** মতোই কাজ করে!',
        visual: { kind: 'flow', items: [{ art: 'keyboard', labelBn: 'ইনপুট' }, { art: 'chip', labelBn: 'প্রসেসিং' }, { art: 'monitor', labelBn: 'আউটপুট' }] },
      },
      cards: [
        {
          id: 'c-flow',
          type: 'visual',
          textBn: 'প্রথমে কিছু **ঢোকে** (ইনপুট), ভেতরে কাজ হয় (প্রসেসিং), শেষে ফল **বেরোয়** (আউটপুট)।',
          visual: { kind: 'flow', items: [{ art: 'keyboard', labelBn: 'টাইপ করলাম' }, { art: 'chip', labelBn: 'প্রসেসর কাজ করল' }, { art: 'monitor', labelBn: 'পর্দায় দেখা গেল' }] },
          chipsBn: ['ইনপুট = ঢোকে', 'প্রসেসিং = কাজ', 'আউটপুট = বেরোয়'],
          learnMoreBn: 'কম্পিউটারের কাজ পাঁচ ধাপে: ইনপুট (Input), প্রসেসিং (Processing), মেমোরি (RAM) — সাময়িকভাবে হাতের কাছে রাখা, স্টোরেজ (Storage) — দীর্ঘদিন জমানো, আর আউটপুট (Output)। কিবোর্ড, মাউস, ক্যামেরা ইনপুটের যন্ত্র; পর্দা, স্পিকার, প্রিন্টার আউটপুটের।',
        },
        {
          id: 'c-kitchen',
          type: 'visual',
          textBn: 'রান্নাঘর ভাবুন: উপকরণ, রাঁধুনি, কাউন্টার, ফ্রিজ। একেকটিতে ক্লিক করে দেখুন কে কোনটা।',
          visual: { kind: 'widget', widget: 'kitchen-analogy' },
          chipsBn: ['রাঁধুনি = প্রসেসর', 'কাউন্টার = RAM', 'ফ্রিজ = স্টোরেজ'],
          learnMoreBn: 'লাইব্রেরির উদাহরণেও একই: বইয়ের তাক হলো স্টোরেজ, পড়ার টেবিলে খোলা বইটি RAM, আর কে কোন বই পাবে তা দেখেন লাইব্রেরিয়ান — অপারেটিং সিস্টেম।',
        },
        {
          id: 'c-io',
          type: 'visual',
          textBn: 'এবার নিজে দেখুন — ATM বা ছবি তোলার মতো কাজে কোন ধাপ ব্যবহার হয়?',
          visual: { kind: 'widget', widget: 'input-process-output' },
          chipsBn: ['পারেন? বেছে দেখুন'],
        },
        {
          id: 'c-os',
          type: 'visual',
          textBn: '**অপারেটিং সিস্টেম** (Windows, macOS) বাড়ির ম্যানেজার। আর প্রোগ্রাম হলো একেকটি নির্দিষ্ট কাজের অ্যাপ।',
          visual: { kind: 'compare', left: { visual: { kind: 'art', name: 'desktop' }, labelBn: 'অপারেটিং সিস্টেম', captionBn: 'সবাইকে চালায়' }, right: { visual: { kind: 'art', name: 'notebook' }, labelBn: 'প্রোগ্রাম', captionBn: 'একটা কাজ করে' }, vs: 'আর' },
          chipsBn: ['OS = ম্যানেজার', 'প্রোগ্রাম = কাজের অ্যাপ'],
          learnMoreBn: 'অপারেটিং সিস্টেম (Operating System) সব অংশকে মিলিয়ে চালায় এবং আপনার ডেস্কটপ, ফাইল ও প্রোগ্রাম চালানোর ব্যবস্থা করে দেয়। Windows, macOS আর Linux — তিনটিই একেকটি অপারেটিং সিস্টেম। প্রোগ্রাম বা অ্যাপ (Application) যেমন লেখার প্রোগ্রাম, ক্যালকুলেটর, ব্রাউজার।',
        },
        {
          id: 'c-hwsw',
          type: 'compare',
          textBn: 'যা **ছোঁয়া যায়** তা হার্ডওয়্যার। যা ছোঁয়া যায় না, শুধু নির্দেশ হয়ে কাজ করে — **সফটওয়্যার**।',
          visual: { kind: 'compare', left: { visual: { kind: 'art', name: 'laptop' }, labelBn: 'হার্ডওয়্যার', captionBn: 'শরীর' }, right: { visual: { kind: 'art', name: 'code-brackets' }, labelBn: 'সফটওয়্যার', captionBn: 'শেখানো কাজ' }, vs: 'আর' },
          chipsBn: ['পর্দা, কিবোর্ড = হার্ডওয়্যার', 'অ্যাপ, OS = সফটওয়্যার'],
        },
      ],
      steps: [
        openDocs('io-docs', 'বাঁ দিকের লম্বা তালিকায় Documents লেখাটি খুঁজুন।'),
        {
          id: 'io-photo',
          osVariant: 'both',
          titleBn: 'একটি ফাইল বেছে নিন',
          target: 'fm-item-Photo.jpg',
          expectedAction: { type: 'click', target: 'fm-item-Photo.jpg' },
          explanationBn: 'Photo.jpg-তে একবার ক্লিক করুন। ফাইলটি স্টোরেজ নামের ফ্রিজে রাখা।',
          hintBn: 'তালিকায় Photo.jpg নামের লাইনে একবার চাপুন।',
          successMessageBn: 'বেছে নেওয়া হলো!',
        },
      ],
      quiz: [
        {
          id: 'q-match',
          type: 'dragMatch',
          questionBn: 'কম্পিউটারের অংশের সাথে রান্নাঘরের ভূমিকা মিলিয়ে দিন।',
          pairs: [
            { id: 'input', leftBn: 'ইনপুট', rightBn: 'উপকরণ' },
            { id: 'cpu', leftBn: 'প্রসেসর (CPU)', rightBn: 'রাঁধুনি' },
            { id: 'ram', leftBn: 'মেমোরি (RAM)', rightBn: 'কাউন্টার' },
            { id: 'storage', leftBn: 'স্টোরেজ', rightBn: 'ফ্রিজ' },
          ],
          hintBn: 'কে রান্না করে আর কোথায় জিনিস অনেকদিন থাকে — আগে এ দুটো ভাবুন।',
          explanationBn: 'উপকরণ ঢোকে, রাঁধুনি রাঁধে, কাউন্টারে এখনকার জিনিস, ফ্রিজে দীর্ঘদিনের।',
        },
        {
          id: 'q-flow',
          type: 'ordering',
          questionBn: 'তথ্য কম্পিউটারের ভেতর দিয়ে যে ক্রমে চলে, সাজান।',
          items: [
            { id: '1', textBn: 'ইনপুট: আমি কিবোর্ডে লিখলাম' },
            { id: '2', textBn: 'প্রসেসর (CPU) কাজ করল' },
            { id: '3', textBn: 'মেমোরি (RAM)-এ সাময়িক রাখা হলো' },
            { id: '4', textBn: 'আউটপুট: পর্দায় দেখা গেল' },
          ],
          hintBn: 'আগে কিছু ঢুকবে, শেষে ফল দেখাবে। মাঝের দুটি: কাজ আর রাখা।',
          explanationBn: 'ইনপুট → প্রসেসিং → মেমোরি → আউটপুট। দীর্ঘদিন রাখতে স্টোরেজে সেভ লাগে।',
        },
        {
          id: 'q-os',
          type: 'multipleChoice',
          questionBn: 'নিচের কোনটি অপারেটিং সিস্টেম?',
          options: [
            { id: 'a', textBn: 'Windows বা macOS' },
            { id: 'b', textBn: 'কিবোর্ড' },
            { id: 'c', textBn: 'পর্দা (মনিটর)' },
          ],
          correct: ['a'],
          hintBn: 'যেটি কম্পিউটারের “বাড়ির ম্যানেজার” আর ছোঁয়া যায় না।',
          explanationBn: 'Windows, macOS, Linux — সব অংশ চালায় যে সফটওয়্যার।',
        },
      ],
      recapBn: ['ইনপুট → প্রসেসিং → আউটপুট', 'রাঁধুনি = প্রসেসর, ফ্রিজ = স্টোরেজ', 'OS = ম্যানেজার'],
      freeTryBn: 'আপনার ফোনে ছবি তুললে কোনটি ইনপুট আর কোনটি আউটপুট?',
    },

    // =====================================================================================================
    {
      id: 'ram-storage',
      titleBn: 'RAM বনাম স্টোরেজ',
      setup,
      hook: {
        id: 'h-ram',
        type: 'hook',
        textBn: 'অনেকক্ষণ টাইপ করলেন, হঠাৎ কারেন্ট গেল — লেখা **কোথায়** গেল?',
        visual: { kind: 'art', name: 'power' },
      },
      cards: [
        {
          id: 'c-ram',
          type: 'visual',
          textBn: '**RAM** হলো কাউন্টার: এখন যা লাগছে হাতের কাছে। খুব দ্রুত, কিন্তু কারেন্ট গেলে সাফ।',
          visual: { kind: 'art', name: 'ram-stick', captionBn: 'RAM (মেমোরি)' },
          chipsBn: ['খুব দ্রুত', 'কারেন্ট গেলে সাফ'],
        },
        {
          id: 'c-storage',
          type: 'visual',
          textBn: '**স্টোরেজ** হলো ফ্রিজ: ফাইল সেখানে বন্ধ করলেও থাকে। জায়গা বেশি, একটু ধীর।',
          visual: { kind: 'art', name: 'hard-drive', captionBn: 'স্টোরেজ (SSD / HDD)' },
          chipsBn: ['অনেক জায়গা', 'বন্ধ করলেও থাকে'],
          learnMoreBn: 'স্টোরেজ দুই রকম: SSD (দ্রুত, নতুন কম্পিউটারে) আর HDD (পুরোনো, ঘুরন্ত চাকতির)। ফোনেও “৬৪ জিবি স্টোরেজ” বলতে এটিই বোঝায় — তবে অপারেটিং সিস্টেম আর অ্যাপও কিছুটা জায়গা নেয়।',
        },
        {
          id: 'c-cmp',
          type: 'compare',
          textBn: 'টাইপ করার সময় লেখা থাকে RAM-এ। **সেভ** করলে তবেই স্টোরেজে যায়।',
          visual: { kind: 'compare', left: { visual: { kind: 'art', name: 'ram-stick' }, labelBn: 'RAM', captionBn: 'সাময়িক' }, right: { visual: { kind: 'art', name: 'hard-drive' }, labelBn: 'স্টোরেজ', captionBn: 'স্থায়ী' }, vs: 'বনাম' },
          chipsBn: ['সেভ করলে স্টোরেজে'],
        },
        {
          id: 'c-save',
          type: 'visual',
          textBn: 'চলুন নিজে দেখি: লিখব, **সেভ না করে** বন্ধ করব, আবার খুলব।',
          visual: { kind: 'art', name: 'save-disk', captionBn: 'সেভ = স্টোরেজে পাঠানো' },
          chipsBn: ['কাজের মাঝে সেভ করুন'],
        },
      ],
      steps: [
        openDocs('rs-docs', 'বাঁ দিকের লম্বা তালিকায় Documents লেখাটি খুঁজুন।'),
        ...propsSteps('rs', 'Photo.jpg'),
        {
          id: 'w-open-start',
          osVariant: 'windows',
          titleBn: 'স্টার্ট মেনু খুলুন',
          target: 'start-button',
          expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'স্টার্ট বোতামে ক্লিক করুন। এবার Notepad খুলব।',
          hintBn: 'পর্দার নিচের চারকোনা বোতামটি চাপুন।',
          successMessageBn: 'মেনু খুলেছে!',
        },
        {
          id: 'w-open-editor',
          osVariant: 'windows',
          titleBn: 'Notepad খুলুন',
          target: 'start-app-editor',
          expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'তালিকা থেকে Notepad-এ ক্লিক করুন।',
          hintBn: 'খাতার ছবির পাশে Notepad লেখা আছে।',
          successMessageBn: 'Notepad খুলেছে!',
        },
        {
          id: 'm-open-launchpad',
          osVariant: 'mac',
          titleBn: 'লঞ্চপ্যাড খুলুন',
          target: 'dock-launchpad',
          expectedAction: { type: 'click', target: 'dock-launchpad' },
          explanationBn: 'ডকের লঞ্চপ্যাডে ক্লিক করুন। এবার TextEdit খুলব।',
          hintBn: 'নিচের ডকে রঙিন চৌকো ঘরের আইকনটি দেখুন।',
          successMessageBn: 'লঞ্চপ্যাড খুলেছে!',
        },
        {
          id: 'm-open-editor',
          osVariant: 'mac',
          titleBn: 'TextEdit খুলুন',
          target: 'launchpad-app-editor',
          expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'তালিকা থেকে TextEdit-এ ক্লিক করুন।',
          hintBn: 'TextEdit নামটি খুঁজুন।',
          successMessageBn: 'TextEdit খুলেছে!',
        },
        {
          id: 'write',
          osVariant: 'both',
          titleBn: 'লিখুন, সেভ করবেন না',
          target: 'editor-text',
          expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'সাদা জায়গায় ইংরেজিতে লিখুন: remember to buy rice। সেভ করবেন না!',
          hintBn: 'সাদা জায়গায় ক্লিক করে কিবোর্ডে টাইপ করুন।',
          successMessageBn: 'লেখা এখন RAM-এ!',
        },
        {
          id: 'close',
          osVariant: 'both',
          titleBn: 'সেভ না করে বন্ধ করুন',
          target: 'win-editor-close',
          expectedAction: { type: 'click', target: 'win-editor-close' },
          explanationBn: 'উইন্ডোর বন্ধ করার বোতাম (✕ বা লাল) চাপুন।',
          hintBn: 'Windows-এ ডান ওপরে, Mac-এ বাঁ ওপরে।',
          successMessageBn: 'কম্পিউটার জানতে চাইছে!',
        },
        {
          id: 'dont-save',
          osVariant: 'both',
          titleBn: 'Don’t save বেছে নিন',
          target: 'dialog-dont-save',
          expectedAction: { type: 'click', target: 'dialog-dont-save' },
          explanationBn: 'Don’t save চাপুন — যেন হঠাৎ কারেন্ট চলে গেল!',
          hintBn: 'তিনটি বোতামের মাঝেরটি।',
          successMessageBn: 'লেখা ফেলে দেওয়া হলো!',
        },
        {
          id: 'w-reopen-start',
          osVariant: 'windows',
          titleBn: 'আবার স্টার্ট মেনু খুলুন',
          target: 'start-button',
          expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'আবার স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'পর্দার নিচের চারকোনা বোতামটি।',
          successMessageBn: 'মেনু খুলেছে!',
        },
        {
          id: 'w-reopen-editor',
          osVariant: 'windows',
          titleBn: 'Notepad আবার খুলুন',
          target: 'start-app-editor',
          expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'Notepad-এ ক্লিক করে দেখুন লেখাটি আছে কি না।',
          hintBn: 'খাতার ছবির পাশে Notepad।',
          successMessageBn: 'পাতা ফাঁকা — লেখা হারিয়েছে!',
        },
        {
          id: 'm-reopen-launchpad',
          osVariant: 'mac',
          titleBn: 'আবার লঞ্চপ্যাড খুলুন',
          target: 'dock-launchpad',
          expectedAction: { type: 'click', target: 'dock-launchpad' },
          explanationBn: 'আবার ডকের লঞ্চপ্যাডে ক্লিক করুন।',
          hintBn: 'ডকের রঙিন চৌকো ঘরের আইকন।',
          successMessageBn: 'লঞ্চপ্যাড খুলেছে!',
        },
        {
          id: 'm-reopen-editor',
          osVariant: 'mac',
          titleBn: 'TextEdit আবার খুলুন',
          target: 'launchpad-app-editor',
          expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'TextEdit-এ ক্লিক করে দেখুন লেখাটি আছে কি না।',
          hintBn: 'TextEdit নামটি খুঁজুন।',
          successMessageBn: 'পাতা ফাঁকা — লেখা হারিয়েছে!',
        },
      ],
      quiz: [
        {
          id: 'q-storage',
          type: 'clickTarget',
          questionBn: 'কোনটি স্টোরেজ — বন্ধ করার পরেও ফাইল যেখানে থাকে?',
          items: [
            { id: 'keyboard', labelBn: 'কিবোর্ড', icon: '⌨️' },
            { id: 'screen', labelBn: 'পর্দা', icon: '🖥️' },
            { id: 'ssd', labelBn: 'SSD / হার্ড ডিস্ক', icon: '💾' },
            { id: 'speaker', labelBn: 'স্পিকার', icon: '🔊' },
          ],
          correct: 'ssd',
          hintBn: 'যেখানে ছবি, গান আর ফাইল জমানো থাকে — ফ্রিজের মতো।',
          explanationBn: 'SSD বা হার্ড ডিস্কই স্টোরেজ। বাকিগুলো ইনপুট-আউটপুট।',
        },
        {
          id: 'q-ram',
          type: 'multipleChoice',
          questionBn: 'সেভ না করে কারেন্ট গেলে লেখা হারায় কেন?',
          options: [
            { id: 'a', textBn: 'লেখা তখনও শুধু RAM-এ ছিল, যা কারেন্ট গেলে সাফ হয়' },
            { id: 'b', textBn: 'কিবোর্ড খারাপ হয়ে যায়' },
            { id: 'c', textBn: 'স্টোরেজ নিজে নিজে মুছে যায়' },
          ],
          correct: ['a'],
          hintBn: 'কাউন্টারের জিনিস আর ফ্রিজের জিনিসের তফাত মনে করুন।',
          explanationBn: 'RAM সাময়িক, স্টোরেজ স্থায়ী। সেভ করলে লেখা স্টোরেজে যায়।',
        },
        {
          id: 'q-save',
          type: 'multipleChoice',
          questionBn: 'কাজের লেখা নিরাপদ রাখতে কী করবেন?',
          options: [
            { id: 'a', textBn: 'মাঝে মাঝে সেভ করব' },
            { id: 'b', textBn: 'শুধু RAM-এর ভরসায় থাকব' },
            { id: 'c', textBn: 'কিবোর্ড জোরে চাপব' },
          ],
          correct: ['a'],
          hintBn: 'কাউন্টার থেকে ফ্রিজে রাখার কাজটি কোনটি?',
          explanationBn: 'সেভ মানে লেখাকে স্টোরেজে পাঠানো — তাই অভ্যাস করুন।',
        },
      ],
      recapBn: ['RAM = সাময়িক কাউন্টার', 'স্টোরেজ = স্থায়ী ফ্রিজ', 'সেভ না করলে হারায়'],
      freeTryBn: 'এবার Notepad-এ লিখে সেভ করুন, বন্ধ করে আবার খুলুন — লেখা থাকে?',
    },

    // =====================================================================================================
    {
      id: 'bits-bytes',
      titleBn: 'বিট, বাইট ও ইউনিকোড',
      setup,
      hook: {
        id: 'h-bits',
        type: 'hook',
        textBn: 'ছবি, গান, বাংলা লেখা — কম্পিউটার সবই মনে রাখে শুধু **০ আর ১** দিয়ে!',
        visual: { kind: 'art', name: 'binary' },
      },
      cards: [
        {
          id: 'c-bit',
          type: 'visual',
          textBn: 'একটি সুইচ চালু (1) বা বন্ধ (0) — এটি **১ বিট**। আট সুইচ মিলে **১ বাইট**।',
          visual: { kind: 'art', name: 'binary', captionBn: '0 আর 1' },
          chipsBn: ['বিট: ০ বা ১', '৮ বিট: ১ বাইট'],
          learnMoreBn: 'শুধু 0 আর 1 দিয়ে সংখ্যা লেখার নিয়মকে বাইনারি (Binary) বলে। ডান থেকে সুইচের মান 1, 2, 4, 8… — যেমন 00000101 মানে 1 + 4 = 5।',
        },
        {
          id: 'c-toggle',
          type: 'visual',
          textBn: 'সুইচ চালু-বন্ধ করে দেখুন কী সংখ্যা হয়। পারেন 10 বানাতে?',
          visual: { kind: 'widget', widget: 'toggle-bits' },
          chipsBn: ['পারেন? সংখ্যা বানান'],
        },
        {
          id: 'c-unicode',
          type: 'visual',
          textBn: 'অক্ষরও সংখ্যা। A হলো 65, বাংলা “অ” হলো 2437 — এই নম্বরের নিয়মের নাম **ইউনিকোড**।',
          visual: { kind: 'big', emoji: '🔤', captionBn: 'A = 65 · অ = 2437' },
          chipsBn: ['সব ভাষার নম্বর আছে', 'ইমোজিরও!'],
          learnMoreBn: 'ইউনিকোড (Unicode) পৃথিবীর প্রায় সব ভাষার প্রতিটি অক্ষর এমনকি ইমোজিরও একটি করে নম্বর দেয়। তাই বাংলা বা ইংরেজি যাই লিখুন, কম্পিউটার তা নম্বর হিসেবে মনে রাখে আর পর্দায় অক্ষর করে দেখায়।',
        },
        {
          id: 'c-units',
          type: 'visual',
          textBn: 'ফাইলের মাপ: KB ছোট লেখা, **MB** ছবি-গান, **GB** সিনেমা। প্রতিটি আগেরটির প্রায় হাজার গুণ।',
          visual: { kind: 'flow', items: [{ art: 'file', labelBn: 'KB: লেখা' }, { art: 'image', labelBn: 'MB: ছবি' }, { art: 'video', labelBn: 'GB: সিনেমা' }] },
          chipsBn: ['ছোট থেকে বড়', 'মোটামুটি হিসাব'],
          learnMoreBn: 'কেবি (KB) প্রায় এক হাজার বাইট, এমবি (MB) প্রায় এক হাজার কেবি, জিবি (GB) প্রায় এক হাজার এমবি। যেমন “ফোনে ৬৪ জিবি” মানে ফোনের স্টোরেজে প্রায় ৬৪ জিবি জায়গা — তবে অপারেটিং সিস্টেম আর অ্যাপও কিছুটা নেয়।',
        },
        {
          id: 'c-server',
          type: 'compare',
          textBn: 'ওয়েবসাইট খুললে আপনার ফোন (**ক্লায়েন্ট**) দূরের কম্পিউটারকে (**সার্ভার**) বলে “পাতা পাঠাও”।',
          visual: { kind: 'compare', left: { visual: { kind: 'art', name: 'phone' }, labelBn: 'ক্লায়েন্ট', captionBn: 'চায়' }, right: { visual: { kind: 'art', name: 'server' }, labelBn: 'সার্ভার', captionBn: 'পাঠায়' }, vs: '→' },
          chipsBn: ['ফোন = ক্লায়েন্ট', 'সার্ভার = দূরের কম্পিউটার'],
        },
        {
          id: 'c-app',
          type: 'compare',
          textBn: '**ওয়েবসাইট** খোলে ব্রাউজারে, **অ্যাপ** থাকে ফোনে ইনস্টল করা — দুটোই সার্ভারের সাথে কথা বলে।',
          visual: { kind: 'compare', left: { visual: { kind: 'art', name: 'browser' }, labelBn: 'ওয়েবসাইট', captionBn: 'ব্রাউজারে' }, right: { visual: { kind: 'art', name: 'cloud' }, labelBn: 'সার্ভার', captionBn: 'ক্লাউডে' }, vs: 'আর' },
          chipsBn: ['ওয়েবসাইট = ব্রাউজার', 'অ্যাপ = ইনস্টল'],
        },
      ],
      steps: [
        openDocs('bb-docs', 'বাঁ দিকের লম্বা তালিকায় Documents লেখাটি খুঁজুন।'),
        ...propsSteps('bb', 'Movie.mp4'),
      ],
      quiz: [
        {
          id: 'q-binary',
          type: 'predictOutput',
          questionBn: 'বাইনারি সংখ্যাটি দশমিকে কত? (ডান থেকে মান: 1, 2, 4, 8…)',
          code: '00000101',
          language: 'shell',
          acceptedAnswers: ['5', '৫'],
          hintBn: 'চালু (1) সুইচগুলোর মান যোগ করুন — ডান থেকে প্রথম আর তৃতীয়।',
          explanationBn: '1 আর 4 যোগ করলে 5। কম্পিউটার এভাবেই সংখ্যা মনে রাখে।',
        },
        {
          id: 'q-units',
          type: 'ordering',
          questionBn: 'ছোট থেকে বড় মাপ অনুযায়ী সাজান।',
          items: [
            { id: '1', textBn: 'বাইট (Byte)' },
            { id: '2', textBn: 'কেবি (KB)' },
            { id: '3', textBn: 'এমবি (MB)' },
            { id: '4', textBn: 'জিবি (GB)' },
          ],
          hintBn: 'প্রতিটি ধাপ আগেরটির প্রায় হাজার গুণ।',
          explanationBn: 'বাইট < KB < MB < GB — সিনেমা সাধারণত জিবির কাছাকাছি।',
        },
        {
          id: 'q-server',
          type: 'multipleChoice',
          questionBn: 'ওয়েবসাইট খুললে পাতা কে পাঠিয়ে দেয়?',
          options: [
            { id: 'a', textBn: 'দূরের সার্ভার' },
            { id: 'b', textBn: 'আপনার কিবোর্ড' },
            { id: 'c', textBn: 'আপনার পর্দা' },
          ],
          correct: ['a'],
          hintBn: 'আপনার ফোন তো ক্লায়েন্ট — সে চায়, অন্যজন পাঠায়।',
          explanationBn: 'ক্লায়েন্ট চায়, সার্ভার পাঠায়।',
        },
      ],
      recapBn: ['বিট ০ বা ১; ৮ বিটে বাইট', 'অক্ষরও নম্বর (ইউনিকোড)', 'KB, MB, GB: হাজার গুণ'],
      freeTryBn: 'নিজের নামের প্রথম অক্ষরের নম্বর কত — অনুমান করতে পারেন?',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবই সম্পূর্ণ নিরাপদ — শুধু দেখা।',
    tasksBn: [
      'নিজের কম্পিউটারের কোনো ছবির ফাইলে রাইট ক্লিক করে আকার দেখুন।',
      'Notepad বা TextEdit-এ একটি বাক্য লিখে সেভ করুন, বন্ধ করে আবার খুলুন।',
      'ফোনের সেটিংসে দেখুন মোট স্টোরেজ কত আর কতটা ভরা।',
    ],
    windowsTasksBn: ['Settings → System → Storage খুলে ভরা আর ফাঁকা জায়গা দেখুন।'],
    macTasksBn: ['System Settings → General → Storage খুলে ভরা আর ফাঁকা জায়গা দেখুন।'],
  },

  teacherTipBn:
    'এই মডিউলে মুখস্থ নয়, ধারণা গুরুত্বপূর্ণ। রান্নাঘরের উপমাটি শিক্ষার্থীর নিজের রান্নাঘরের উদাহরণ দিয়ে বলুন। “সেভ না করলে হারায়” অভিজ্ঞতাটি নিজে ঘটতে দিন — সেটিই সবচেয়ে ভালো শেখা। বিট-বাইটে চাপ দেবেন না; সুইচগুলো নিয়ে খেলতে দিন, তাতেই ধারণা তৈরি হবে। মনে রাখবেন, KB/MB/GB-এর সংখ্যাগুলো মোটামুটি হিসাব।',
}

export default lesson
