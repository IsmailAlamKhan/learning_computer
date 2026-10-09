import type { Lesson, Step } from '../../engine/types'

/**
 * Module 16 — computational thinking without code, in four units:
 * (1) sequence (tea, order-puzzle), (2) decisions (if-else-explorer), (3) loops (loop-counter),
 * (4) decomposition + flowchart + debugging (flowchart-builder).
 * Each unit starts a fresh simulated computer, so every unit's practice is self-contained.
 */

const SAVE_NOTE = '(ফাইলে 1. না থাকলে ফিরে গিয়ে ঠিক করুন।)'

/** Windows: Start → Notepad (2 steps). */
function winOpen(p: string): Step[] {
  return [
    {
      id: `${p}-w-start`, osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'টাস্কবারের স্টার্ট বোতামে ক্লিক করুন।',
      hintBn: 'টাস্কবারের চারকোনা আইকনটি স্টার্ট বোতাম।',
    },
    {
      id: `${p}-w-open-notepad`, osVariant: 'windows', titleBn: 'নোটপ্যাড (Notepad) খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
      explanationBn: 'মেনুতে “Notepad”-এ ক্লিক করুন।',
      hintBn: 'মেনুর “Pinned” অংশে Notepad আইকনটি খুঁজুন, বা সার্চ বক্সে Notepad লিখুন।',
      simplerBn: 'স্টার্ট মেনুতে হলুদ-সাদা একটি খাতার ছবি আছে, তার নিচে Notepad লেখা। সেটির ওপর একবার ক্লিক করুন।',
    },
  ]
}

/** Mac: Spotlight → TextEdit (3 steps). */
function macOpen(p: string): Step[] {
  return [
    {
      id: `${p}-m-spotlight`, osVariant: 'mac', titleBn: 'স্পটলাইট (Spotlight) খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
      explanationBn: 'ওপরের মেনু বারের ডান দিকের ম্যাগনিফাইং গ্লাসে (🔍) ক্লিক করুন।',
      hintBn: 'পর্দার একদম ওপরের সারির ডান দিকে ছোট ম্যাগনিফাইং গ্লাস।',
    },
    {
      id: `${p}-m-search-textedit`, osVariant: 'mac', titleBn: 'নাম লিখুন', target: 'spotlight-input', expectedAction: { type: 'type', target: 'spotlight-input', text: 'TextEdit', ignoreCase: true },
      explanationBn: 'সার্চ বক্সে লিখুন: TextEdit',
      hintBn: 'ইংরেজিতে TextEdit লিখুন।',
    },
    {
      id: `${p}-m-open-textedit`, osVariant: 'mac', titleBn: 'টেক্সটএডিট (TextEdit) খুলুন', target: 'spotlight-result-0', expectedAction: { type: 'openApp', app: 'editor' },
      explanationBn: 'ফলাফলের প্রথম লাইন TextEdit — তাতে ক্লিক করুন।',
      hintBn: 'নিচের তালিকার একদম ওপরের লাইনে ক্লিক করুন।',
    },
  ]
}

interface WriteOpts {
  instrBn: string
  hintBn: string
  simplerWinBn: string
  simplerMacBn: string
  successBn: string
}

/** Type into the editor (both OS: same target, one custom event). */
function write(p: string, os: 'windows' | 'mac', o: WriteOpts): Step[] {
  return [os].map((os) => ({
    id: `${p}-${os === 'windows' ? 'w' : 'm'}-write`,
    osVariant: os,
    titleBn: 'লিখে ফেলুন',
    target: 'editor-text',
    expectedAction: { type: 'custom' as const, event: 'editor-dirty' },
    explanationBn: o.instrBn,
    hintBn: o.hintBn,
    simplerBn: os === 'windows' ? o.simplerWinBn : o.simplerMacBn,
    successMessageBn: o.successBn,
  }))
}

interface SaveOpts {
  file: string
  /** the final step's expected action (state-based or event-based) */
  done: Step['expectedAction']
  successBn: string
  extraHint?: string
}

/** Windows: File → Save → name → Save → close (5 steps). */
function winSave(p: string, o: SaveOpts): Step[] {
  return [
    {
      id: `${p}-w-file-menu`, osVariant: 'windows', titleBn: 'File মেনু খুলুন', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
      explanationBn: 'ওপরে বাঁ দিকের “File” লেখায় ক্লিক করুন।',
      hintBn: 'Notepad উইন্ডোর ওপরের সারিতে সবচেয়ে বাঁ দিকের শব্দটি File।',
    },
    {
      id: `${p}-w-save`, osVariant: 'windows', titleBn: 'Save বেছে নিন', target: 'editor-save', expectedAction: { type: 'click', target: 'editor-save' },
      explanationBn: 'মেনু থেকে “Save” বেছে নিন।',
      hintBn: 'Save আর Save As দুটি আছে — এখন শুধু “Save”।',
    },
    {
      id: `${p}-w-name`, osVariant: 'windows', titleBn: `ফাইলের নাম: ${o.file}`, target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: o.file, ignoreCase: true },
      explanationBn: `“File name” ঘরের নাম মুছে লিখুন: ${o.file}`,
      hintBn: `ঘরের লেখাটি মুছে লিখুন: ${o.file} (ছোট হাতের অক্ষর, মাঝে একটি ডট)।`,
      simplerBn: 'ঘরের ভেতরে ক্লিক করে সব লেখা মুছে ফেলুন, তারপর নামটি অক্ষরে অক্ষরে টাইপ করুন।',
    },
    {
      id: `${p}-w-save-btn`, osVariant: 'windows', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: o.done,
      explanationBn: 'নিচের ডান দিকের নীল “Save” বোতামে চাপুন।',
      hintBn: `নিচের ডানে নীল Save বোতাম।${o.extraHint ? ' ' + o.extraHint : ''}`,
      successMessageBn: o.successBn,
    },
    {
      id: `${p}-w-close-notepad`, osVariant: 'windows', titleBn: 'নোটপ্যাড বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
      explanationBn: 'ডান ওপরের ✕ বোতামে ক্লিক করুন।',
      hintBn: 'উইন্ডোর একদম ডান ওপরের কোণে ✕ চিহ্ন।',
    },
  ]
}

/** Mac: Save → name → Save → close (4 steps). */
function macSave(p: string, o: SaveOpts): Step[] {
  return [
    {
      id: `${p}-m-save`, osVariant: 'mac', titleBn: 'Save চাপুন', target: 'editor-save', expectedAction: { type: 'click', target: 'editor-save' },
      explanationBn: 'ওপরের “Save” বোতামে ক্লিক করুন।',
      hintBn: 'টুলবারের Save বোতাম (Save As… নয়)। আসল Mac-এ Cmd + S-ও একই কাজ করে।',
    },
    {
      id: `${p}-m-name`, osVariant: 'mac', titleBn: `ফাইলের নাম: ${o.file}`, target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: o.file, ignoreCase: true },
      explanationBn: `“Save As” ঘরের নাম মুছে লিখুন: ${o.file}`,
      hintBn: `ঘরের লেখাটি মুছে লিখুন: ${o.file} (ছোট হাতের অক্ষর, মাঝে একটি ডট)।`,
      simplerBn: 'ঘরের ভেতরে ক্লিক করে সব লেখা মুছে ফেলুন, তারপর নামটি অক্ষরে অক্ষরে টাইপ করুন।',
    },
    {
      id: `${p}-m-save-btn`, osVariant: 'mac', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: o.done,
      explanationBn: 'নিচের ডান দিকের নীল “Save” বোতামে চাপুন।',
      hintBn: `নিচের ডানে নীল Save বোতাম।${o.extraHint ? ' ' + o.extraHint : ''}`,
      successMessageBn: o.successBn,
    },
    {
      id: `${p}-m-close-textedit`, osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
      explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করুন।',
      hintBn: 'উইন্ডোর বাঁ ওপরের কোণে তিনটি রঙিন বোতামের প্রথমটি — লাল।',
    },
  ]
}

const lesson: Lesson = {
  module: 16,
  part: 2,
  id: 'm16',
  titleBn: 'কম্পিউটারের মতো ভাবা',
  oneLineBn: 'চা, ভাত আর রাস্তার ঠিকানা দিয়ে শিখি ক্রম, সিদ্ধান্ত আর লুপ — কোড ছাড়াই।',
  minutes: 12,
  glossaryIds: ['ct-algorithm', 'ct-sequence', 'ct-decision', 'ct-condition', 'ct-loop', 'ct-flowchart', 'ct-step', 'ct-input-output', 'ct-decomposition', 'ct-pattern', 'ct-bug', 'ct-true-false'],

  units: [
    // =====================================================================================================
    {
      id: 'sequence',
      titleBn: 'ক্রম: আগে-পরে',
      hook: {
        id: 'h-tea',
        type: 'hook',
        textBn: 'রোজ চা বানান? তাহলে আপনি আগেই একটা **অ্যালগরিদম** চালান!',
        visual: { kind: 'art', name: 'tea-cup', captionBn: 'ধাপে ধাপে নির্দেশ' },
      },
      cards: [
        {
          id: 'c-algo',
          type: 'visual',
          textBn: 'ধাপে ধাপে নির্দেশের নাম **অ্যালগরিদম**। কম্পিউটার ঠিক যা বলা হয়, তা-ই করে।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'cooking-pot', labelBn: 'পানি ফোটাই' },
              { art: 'clock', labelBn: '৩ মিনিট' },
              { art: 'tea-cup', labelBn: 'কাপে ঢালি' },
            ],
          },
          chipsBn: ['অ্যালগরিদম = রেসিপি', 'ধাপ = ছোট কাজ'],
          learnMoreBn: 'রান্নার রেসিপি হলো অ্যালগরিদমের সবচেয়ে চেনা উদাহরণ। কম্পিউটার একজন বাধ্য কিন্তু একদম নতুন সহকারীর মতো — “একটু চা বানিয়ে দাও” বললে সে বোঝে না, প্রতিটি ধাপ বলে দিতে হয়।',
        },
        {
          id: 'c-order-widget',
          type: 'visual',
          textBn: 'চায়ের ধাপগুলো ঠিক ক্রমে সাজাতে পারেন? টেনে বা ↑ ↓ বোতামে সাজান।',
          visual: { kind: 'widget', widget: 'order-puzzle' },
          learnMoreBn: 'চা পাতা দেওয়ার আগেই চা ছেঁকে ফেললে কাপে শুধু গরম পানি থাকবে! তাই ক্রম বদলালে ফলও বদলে যায়।',
        },
        {
          id: 'c-seq',
          type: 'visual',
          textBn: '**ক্রম** মানে কোন ধাপ আগে, কোনটি পরে। এক ধাপ বাদ দিলেই পুরো কাজ গোলমাল।',
          visual: { kind: 'art', name: 'stairs', captionBn: 'এক ধাপ বাদ দেওয়া যায় না' },
          chipsBn: ['আগে-পরে গুরুত্বপূর্ণ'],
        },
        {
          id: 'c-literal',
          type: 'visual',
          textBn: 'কম্পিউটার যা শোনে, হুবহু তা-ই করে। “একটু দুধ” নয়, বলুন “আধা কাপ দুধ”।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'cross' }, labelBn: 'অস্পষ্ট', captionBn: '“একটু চিনি”' },
            right: { visual: { kind: 'art', name: 'check' }, labelBn: 'স্পষ্ট', captionBn: '“এক চামচ চিনি”' },
            vs: 'বনাম',
          },
          learnMoreBn: 'নির্দেশ যত স্পষ্ট, ভুল তত কম। এই কারণেই অ্যালগরিদমে “একটু” বা “মোটামুটি” চলে না।',
        },
        {
          id: 'c-io',
          type: 'visual',
          textBn: 'প্রতিটি কাজে কিছু **ইনপুট** (যা দিই) আর **আউটপুট** (যা পাই) থাকে — যেমন এটিএম।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'id-card', labelBn: 'কার্ড ও পিন' },
              { art: 'bank', labelBn: 'এটিএম' },
              { art: 'wallet', labelBn: 'টাকা' },
            ],
          },
          chipsBn: ['ইনপুট = যা দিই', 'আউটপুট = যা পাই'],
        },
      ],
      steps: [
        ...winOpen('s'),
        ...write('s', 'windows', {
          instrBn: 'চা বানানোর ধাপগুলো নম্বর দিয়ে লিখুন — প্রতি লাইনে একটি।',
          hintBn: 'লিখুন: 1. Boil water, Enter, 2. Add tea leaves, 3. Wait 3 minutes…',
          simplerWinBn: 'লিখুন: 1. Boil water। Enter চেপে লিখুন: 2. Add tea leaves। এভাবে চার-পাঁচ লাইন।',
          simplerMacBn: 'লিখুন: 1. Boil water। Return চেপে লিখুন: 2. Add tea leaves। এভাবে চার-পাঁচ লাইন।',
          successBn: 'দারুণ! নম্বর মানেই “আগে এটি, পরে ওটি”।',
        }),
        ...winSave('s', { file: 'tea.txt', done: { type: 'fileContains', path: '~/Documents/tea.txt', text: '1' }, successBn: 'tea.txt সেভ হয়েছে!', extraHint: SAVE_NOTE }),
        ...macOpen('s'),
        ...write('s', 'mac', {
          instrBn: 'চা বানানোর ধাপগুলো নম্বর দিয়ে লিখুন — প্রতি লাইনে একটি।',
          hintBn: 'লিখুন: 1. Boil water, Enter, 2. Add tea leaves, 3. Wait 3 minutes…',
          simplerWinBn: 'লিখুন: 1. Boil water। Enter চেপে লিখুন: 2. Add tea leaves। এভাবে চার-পাঁচ লাইন।',
          simplerMacBn: 'লিখুন: 1. Boil water। Return চেপে লিখুন: 2. Add tea leaves। এভাবে চার-পাঁচ লাইন।',
          successBn: 'দারুণ! নম্বর মানেই “আগে এটি, পরে ওটি”।',
        }),
        ...macSave('s', { file: 'tea.txt', done: { type: 'fileContains', path: '~/Documents/tea.txt', text: '1' }, successBn: 'tea.txt সেভ হয়েছে!', extraHint: SAVE_NOTE }),
      ],
      quiz: [
        {
          id: 'q-order-atm',
          type: 'ordering',
          questionBn: 'এটিএম থেকে টাকা তোলার ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: 'a1', textBn: 'কার্ড মেশিনে ঢোকাই' },
            { id: 'a2', textBn: 'গোপন পিন দিই' },
            { id: 'a3', textBn: 'কত টাকা, তা লিখি' },
            { id: 'a4', textBn: 'মেশিন থেকে টাকা নিই' },
            { id: 'a5', textBn: 'কার্ড ফেরত নিই' },
          ],
          hintBn: 'কার্ড ছাড়া মেশিন চিনবে না; টাকা নেওয়ার পরে কার্ড ফেরত।',
          explanationBn: 'কার্ড, পিন, পরিমাণ, টাকা, কার্ড ফেরত — এটিই ক্রম।',
        },
        {
          id: 'q-input',
          type: 'multipleChoice',
          questionBn: 'এটিএমে টাকা তোলার সময় ইনপুট কোনটি?',
          options: [
            { id: 'a', textBn: 'কার্ড, পিন ও টাকার পরিমাণ' },
            { id: 'b', textBn: 'মেশিন থেকে বেরোনো টাকা' },
            { id: 'c', textBn: 'মেশিনের রং' },
          ],
          correct: ['a'],
          hintBn: 'ইনপুট হলো যা আপনি মেশিনকে দেন।',
          explanationBn: 'আপনি যা দেন তা ইনপুট; যা পান তা আউটপুট।',
        },
        {
          id: 'q-literal',
          type: 'multipleChoice',
          questionBn: 'কম্পিউটারকে বলা হলো “একটু চিনি দাও”। সমস্যা কোথায়?',
          options: [
            { id: 'a', textBn: 'কতটুকু, তা বলা নেই' },
            { id: 'b', textBn: 'কম্পিউটার চিনি পছন্দ করে না' },
            { id: 'c', textBn: 'চিনি শব্দটি ভুল' },
          ],
          correct: ['a'],
          hintBn: '“একটু” কতটা — কম্পিউটার তা আন্দাজ করতে পারে না।',
          explanationBn: 'কম্পিউটারের দরকার স্পষ্ট নির্দেশ, যেমন “এক চামচ”।',
        },
      ],
      recapBn: ['অ্যালগরিদম = ধাপে ধাপে নির্দেশ', 'ক্রম বদলালে ফল বদলায়', 'নির্দেশ হোক স্পষ্ট'],
      freeTryBn: 'ভাত রান্নার ধাপ নম্বর দিয়ে লিখে rice.txt সেভ করুন।',
    },

    // =====================================================================================================
    {
      id: 'decision',
      titleBn: 'সিদ্ধান্ত: যদি… তবে…',
      hook: {
        id: 'h-rain',
        type: 'hook',
        textBn: '“যদি বৃষ্টি হয়, ছাতা নাও।” এই এক লাইনই একটা **সিদ্ধান্ত**!',
        visual: { kind: 'art', name: 'branch', captionBn: 'দুই পথ' },
      },
      cards: [
        {
          id: 'c-if',
          type: 'visual',
          textBn: 'প্রশ্নের উত্তর (হ্যাঁ/না) দেখে পথ বাছা হয়। প্রশ্নটির নাম **শর্ত**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'question', labelBn: 'বৃষ্টি হচ্ছে?' },
              { art: 'check', labelBn: 'হ্যাঁ: ছাতা নিন' },
              { art: 'cross', labelBn: 'না: ছাতা ছাড়া' },
            ],
          },
          chipsBn: ['যদি… তবে… নইলে…'],
        },
        {
          id: 'c-ifelse-widget',
          type: 'visual',
          textBn: 'সুইচ বদলে দেখুন কোন পথ বাছা হয় — পারেন?',
          visual: { kind: 'widget', widget: 'if-else-explorer' },
        },
        {
          id: 'c-tf',
          type: 'compare',
          textBn: 'কম্পিউটারের ভাষায় হ্যাঁ হলো **সত্য**, না হলো **মিথ্যা**।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'সত্য', captionBn: 'True = হ্যাঁ' },
            right: { visual: { kind: 'art', name: 'cross' }, labelBn: 'মিথ্যা', captionBn: 'False = না' },
            vs: 'বা',
          },
          learnMoreBn: 'শর্তের উত্তর সব সময় হ্যাঁ বা না — মাঝামাঝি কিছু নেই। যেমন “বৃষ্টি হচ্ছে?”, “পিন ঠিক?”।',
        },
        {
          id: 'c-first-match',
          type: 'visual',
          textBn: 'একটি শর্ত মিললে কম্পিউটার বাকিগুলো আর দেখে না। তাই শর্তের সাজানোর ক্রমও জরুরি।',
          visual: { kind: 'art', name: 'lightbulb', captionBn: 'প্রথম মিল, সেখানেই শেষ' },
        },
      ],
      steps: [
        ...winOpen('d'),
        ...write('d', 'windows', {
          instrBn: 'একটি নিয়ম লিখুন: যদি বৃষ্টি হয়, ছাতা নিন।',
          hintBn: 'ইংরেজিতে লিখুন: If it rains, take an umbrella. বাংলাতেও লিখতে পারেন।',
          simplerWinBn: 'সাদা জায়গায় ক্লিক করে লিখুন: If it rains, take an umbrella',
          simplerMacBn: 'সাদা জায়গায় ক্লিক করে লিখুন: If it rains, take an umbrella',
          successBn: 'এই এক লাইনই একটি সিদ্ধান্ত!',
        }),
        ...winSave('d', { file: 'rule.txt', done: { type: 'saveFile', name: 'rule.txt' }, successBn: 'rule.txt সেভ হয়েছে!' }),
        ...macOpen('d'),
        ...write('d', 'mac', {
          instrBn: 'একটি নিয়ম লিখুন: যদি বৃষ্টি হয়, ছাতা নিন।',
          hintBn: 'ইংরেজিতে লিখুন: If it rains, take an umbrella. বাংলাতেও লিখতে পারেন।',
          simplerWinBn: 'সাদা জায়গায় ক্লিক করে লিখুন: If it rains, take an umbrella',
          simplerMacBn: 'সাদা জায়গায় ক্লিক করে লিখুন: If it rains, take an umbrella',
          successBn: 'এই এক লাইনই একটি সিদ্ধান্ত!',
        }),
        ...macSave('d', { file: 'rule.txt', done: { type: 'saveFile', name: 'rule.txt' }, successBn: 'rule.txt সেভ হয়েছে!' }),
      ],
      quiz: [
        {
          id: 'q-missing-decision',
          type: 'multipleChoice',
          questionBn: '“বের হই, ছাতা ধরি, স্কুলে যাই” — রোদের দিনেও ছাতা! কী বাদ পড়েছে?',
          options: [
            { id: 'a', textBn: 'যদি বৃষ্টি হয় তবেই ছাতা ধরব' },
            { id: 'b', textBn: 'স্কুলে পৌঁছে আবার বাড়ি ফিরব' },
            { id: 'c', textBn: 'ছাতা ছাড়া কখনো বের হব না' },
          ],
          correct: ['a'],
          hintBn: 'কোন কাজ সব দিন নয়, কিছু দিনই করার কথা?',
          explanationBn: 'ছাতা ধরার আগে “বৃষ্টি হচ্ছে?” সিদ্ধান্তটি দরকার।',
        },
        {
          id: 'q-match-decision',
          type: 'dragMatch',
          questionBn: 'সিদ্ধান্তের অংশগুলো মিলিয়ে দিন।',
          pairs: [
            { id: 'p1', leftBn: '“বৃষ্টি হচ্ছে?”', rightBn: 'শর্ত' },
            { id: 'p2', leftBn: 'উত্তর “হ্যাঁ”', rightBn: 'সত্য (True)' },
            { id: 'p3', leftBn: 'উত্তর “না”', rightBn: 'মিথ্যা (False)' },
          ],
          hintBn: 'প্রশ্নটি শর্ত। হ্যাঁ সত্য, না মিথ্যা।',
          explanationBn: 'শর্তের উত্তর দেখেই পথ বাছা হয়।',
        },
        {
          id: 'q-condition',
          type: 'multipleChoice',
          questionBn: 'নিচের কোনটি শর্ত হতে পারে, যার উত্তর হ্যাঁ বা না?',
          options: [
            { id: 'a', textBn: 'পিন কি ঠিক আছে?' },
            { id: 'b', textBn: 'চা বানাও' },
            { id: 'c', textBn: 'কাপে ঢালো' },
          ],
          correct: ['a'],
          hintBn: 'প্রশ্ন, যার উত্তর শুধু হ্যাঁ অথবা না।',
          explanationBn: 'বাকি দুটি নির্দেশ, প্রশ্ন নয়।',
        },
      ],
      recapBn: ['শর্ত = হ্যাঁ/না প্রশ্ন', 'যদি… তবে… নইলে…', 'হ্যাঁ = সত্য, না = মিথ্যা'],
      freeTryBn: 'নিজের একটি “যদি… তবে… নইলে…” নিয়ম বানান।',
    },

    // =====================================================================================================
    {
      id: 'loop',
      titleBn: 'পুনরাবৃত্তি: লুপ',
      hook: {
        id: 'h-loop',
        type: 'hook',
        textBn: 'পাঁচ কাপ চায়ে পাঁচ চামচ চিনি — পাঁচবার লিখব না। আছে **লুপ**!',
        visual: { kind: 'art', name: 'loop', captionBn: 'একবার লিখি, বারবার চলে' },
      },
      cards: [
        {
          id: 'c-loop',
          type: 'visual',
          textBn: 'একই কাজ অনেকবার হলে একবার লিখে বলুন “এতবার করো”। এর নাম **লুপ**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'tea-cup', labelBn: 'কাপ ১' },
              { art: 'tea-cup', labelBn: 'কাপ ২' },
              { art: 'loop', labelBn: 'আবার…' },
            ],
          },
          chipsBn: ['একবার লিখি', 'বারবার চলে'],
        },
        {
          id: 'c-loop-widget',
          type: 'visual',
          textBn: 'লুপটি চালিয়ে দেখুন, তারপর উত্তর বলুন — পারেন?',
          visual: { kind: 'widget', widget: 'loop-counter' },
        },
        {
          id: 'c-two-loops',
          type: 'compare',
          textBn: 'লুপ দুই রকম: নির্দিষ্ট কয়েকবার, অথবা **যতক্ষণ না** শর্ত মেলে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'tea-cup' }, labelBn: '৫ বার', captionBn: '৫ কাপে চিনি' },
            right: { visual: { kind: 'art', name: 'cooking-pot' }, labelBn: 'যতক্ষণ না…', captionBn: 'ভাত নরম হোক' },
            vs: 'বা',
          },
          learnMoreBn: '“যতক্ষণ না ভাত নরম হয়, ফুটতে দিন” — কতবার লাগবে আগে জানা নেই। প্রতিবার দেখে নিই ভাত নরম হলো কি না।',
        },
        {
          id: 'c-infinite',
          type: 'visual',
          textBn: 'বেরোনোর শর্ত না থাকলে লুপ থামে না — একে বলে **অসীম লুপ**।',
          visual: { kind: 'art', name: 'warning', captionBn: 'ভাত নরম না হলে?' },
          learnMoreBn: '“যতক্ষণ না ভাত নরম হয়” — কিন্তু ভাত যদি কখনোই নরম না হয়, হাঁড়ি চুলায় বসেই থাকবে!',
        },
      ],
      setup: {
        vfs: (vfs) => {
          const docs = vfs.child(vfs.home, 'Documents')
          if (!docs) return
          for (const n of ['cup1.txt', 'cup2.txt', 'cup3.txt']) if (!vfs.child(docs, n)) vfs.createFile(docs, n, 'চা')
        },
      },
      steps: [
        {
          id: 'l-w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'টাস্কবারের স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চারকোনা আইকনটি স্টার্ট বোতাম।',
        },
        {
          id: 'l-w-files', osVariant: 'windows', titleBn: 'ফাইলস (Files) খুলুন', target: 'start-app-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'মেনুতে “Files”-এ ক্লিক করুন।',
          hintBn: 'ফোল্ডারের ছবির পাশে Files বা File Explorer লেখা।',
        },
        {
          id: 'l-m-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
          explanationBn: 'ডকের লঞ্চপ্যাড আইকনে ক্লিক করুন।',
          hintBn: 'ডকের ছোট ঘরের সারির মতো আইকনটি।',
        },
        {
          id: 'l-m-files', osVariant: 'mac', titleBn: 'ফাইন্ডার (Finder) খুলুন', target: 'launchpad-app-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'তালিকা থেকে “Finder”-এ ক্লিক করুন।',
          hintBn: 'নীল-সাদা মুখের মতো আইকন, নিচে “Finder” লেখা।',
        },
        {
          id: 'l-w-docs', osVariant: 'windows', titleBn: 'Documents-এ যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বাঁ পাশের “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকায় Documents লেখাটি খুঁজুন।',
        },
        {
          id: 'l-m-docs', osVariant: 'mac', titleBn: 'Documents-এ যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বাঁ পাশের “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকায় Documents লেখাটি খুঁজুন।',
        },
        ...(['windows', 'mac'] as const).flatMap((os) =>
          [1, 2, 3].map((n): Step => ({
            id: `l-${os === 'windows' ? 'w' : 'm'}-cup${n}`, osVariant: os, titleBn: `cup${n}.txt বাছুন`, target: `fm-item-cup${n}.txt`, expectedAction: { type: 'click', target: `fm-item-cup${n}.txt` },
            explanationBn: `“cup${n}.txt” ফাইলে একবার ক্লিক করুন।`,
            hintBn: `ফাইলের তালিকায় cup${n}.txt খুঁজুন।`,
            successMessageBn: n === 3 ? 'তিনবার একই কাজ — এটাই লুপ!' : undefined,
          })),
        ),
        {
          id: 'l-w-close', osVariant: 'windows', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-files-close', expectedAction: { type: 'click', target: 'win-files-close' },
          explanationBn: 'ডান ওপরের ✕ বোতামে ক্লিক করুন।',
          hintBn: 'উইন্ডোর একদম ডান ওপরের কোণে ✕ চিহ্ন।',
        },
        {
          id: 'l-m-close', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-files-close', expectedAction: { type: 'click', target: 'win-files-close' },
          explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করুন।',
          hintBn: 'উইন্ডোর বাঁ ওপরের কোণে তিনটি রঙিন বোতামের প্রথমটি — লাল।',
        },
      ],
      quiz: [
        {
          id: 'q-find-loop',
          type: 'multipleChoice',
          questionBn: 'ভাত রান্নার কোন নির্দেশটি লুপ?',
          options: [
            { id: 'a', textBn: 'চাল মেপে নিই' },
            { id: 'b', textBn: 'যতক্ষণ না ভাত নরম হয়, ফুটতে দিই' },
            { id: 'c', textBn: 'নামিয়ে পরিবেশন করি' },
          ],
          correct: ['b'],
          hintBn: 'কোন ধাপ শর্ত না মেলা পর্যন্ত চলতেই থাকে?',
          explanationBn: '“যতক্ষণ না…” মানে শর্ত মেলা পর্যন্ত বারবার।',
        },
        {
          id: 'q-match-loops',
          type: 'dragMatch',
          questionBn: 'লুপের কথাগুলো তার ধরনের সাথে মিলিয়ে দিন।',
          pairs: [
            { id: 'p1', leftBn: '“৫ বার চামচ নাড়ুন”', rightBn: 'নির্দিষ্ট বার' },
            { id: 'p2', leftBn: '“যতক্ষণ না ভাত নরম হয়”', rightBn: 'শর্ত না মেলা পর্যন্ত' },
            { id: 'p3', leftBn: 'বেরোনোর শর্ত কখনো মেলে না', rightBn: 'অসীম লুপ' },
          ],
          hintBn: 'সংখ্যা থাকলে নির্দিষ্ট বার; “যতক্ষণ না” থাকলে শর্ত।',
          explanationBn: 'লুপ দুই রকম; থামার পথ না থাকলে অসীম।',
        },
        {
          id: 'q-infinite',
          type: 'multipleChoice',
          questionBn: 'কখন একটি লুপ আর শেষই হয় না?',
          options: [
            { id: 'a', textBn: 'যখন বেরোনোর শর্ত কখনো মেলে না' },
            { id: 'b', textBn: 'যখন লুপ ৫ বার চলে' },
            { id: 'c', textBn: 'যখন কাজ একবারই করা হয়' },
          ],
          correct: ['a'],
          hintBn: 'থামার শর্তটি মিলতেই হবে।',
          explanationBn: 'বেরোনোর পথ না থাকলে সেটাই অসীম লুপ।',
        },
      ],
      recapBn: ['লুপ = একই কাজ বারবার', 'নির্দিষ্ট বার বা “যতক্ষণ না…”', 'থামার পথ না থাকলে অসীম'],
      freeTryBn: 'কাগজে “যতক্ষণ না…” দিয়ে একটি লুপ লিখুন।',
    },

    // =====================================================================================================
    {
      id: 'decompose',
      titleBn: 'ভাগ করা, ফ্লোচার্ট ও ভুল ধরা',
      hook: {
        id: 'h-lunch',
        type: 'hook',
        textBn: 'অতিথির জন্য পুরো দুপুরের খাবার? ঘাবড়াবেন না, শুধু **ভাগ** করুন।',
        visual: { kind: 'art', name: 'puzzle', captionBn: 'বড় সমস্যা, ছোট টুকরো' },
      },
      cards: [
        {
          id: 'c-decomp',
          type: 'visual',
          textBn: 'বড় কাজকে ভেঙে ছোট টুকরো করুন: ভাত, ডাল, তরকারি, টেবিল সাজানো। এর নাম **ভাগ করা**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'cooking-pot', labelBn: 'ভাত' },
              { art: 'recipe-card', labelBn: 'ডাল' },
              { art: 'tea-cup', labelBn: 'টেবিল সাজানো' },
            ],
          },
          chipsBn: ['বড় কাজ, ছোট ধাপ'],
          learnMoreBn: '“ভাত রান্না”-ও আবার ভাঙা যায়: চাল মাপা, ধোয়া, বসানো… যতক্ষণ না প্রতিটি টুকরো এক কথায় বলা যায়। মিল খুঁজে পেলে (প্যাটার্ন) একই সমাধান বহুবার কাজে লাগে — যেমন রিকশাওয়ালাকে ঠিকানা বলার ছাঁচ।',
        },
        {
          id: 'c-flowchart',
          type: 'visual',
          textBn: 'অ্যালগরিদম আঁকলে **ফ্লোচার্ট**: গোল = শুরু/শেষ, আয়তক্ষেত্র = কাজ, হীরা = সিদ্ধান্ত।',
          visual: { kind: 'art', name: 'flowchart', captionBn: 'তীর দেখায় এরপর কোথায়' },
          chipsBn: ['হীরা = হ্যাঁ/না', 'তীর = পরের ধাপ'],
        },
        {
          id: 'c-flow-widget',
          type: 'visual',
          textBn: 'বাক্স জুড়ে ফ্লোচার্ট বানাতে পারেন? তিনটি চ্যালেঞ্জ আছে।',
          visual: { kind: 'widget', widget: 'flowchart-builder' },
          learnMoreBn: 'বাক্সের গায়ের “+” বিন্দুতে ক্লিক করে পরের বাক্সে ক্লিক করলে তীর জোড়ে। নিজের মতো করেও বানাতে পারবেন, যেমন সকালে স্কুলে যাওয়ার চার্ট।',
        },
        {
          id: 'c-debug',
          type: 'visual',
          textBn: 'রেসিপিতে ভুল থাকলে এক ধাপ করে চালিয়ে দেখুন। ভুলের নাম **বাগ**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'recipe-card', labelBn: 'ধাপ চালাই' },
              { art: 'bug', labelBn: 'এখানে গড়বড়' },
              { art: 'check', labelBn: 'ঠিক করে আবার' },
            ],
          },
          chipsBn: ['ডিবাগ = ভুল সারানো'],
          learnMoreBn: 'নিজে আঙুল রেখে একটি একটি ধাপ চালান, যেন আপনি কম্পিউটার। যেখানে প্রথম অদ্ভুত কিছু ঘটে, ভুল সাধারণত সেখানেই। পেশাদার প্রোগ্রামাররাও রোজ বাগ ধরেন — লজ্জার কিছু নেই।',
        },
      ],
      steps: [
        ...winOpen('f'),
        ...write('f', 'windows', {
          instrBn: 'অতিথির খাবার ভাগ করুন: ভাত, ডাল, তরকারি — প্রতি লাইনে একটি।',
          hintBn: 'ইংরেজিতে লিখুন: Rice, Dal, Curry — প্রতিটির পর Enter। বাংলাতেও চলবে।',
          simplerWinBn: 'সাদা জায়গায় ক্লিক করে লিখুন: Rice, তারপর Enter, তারপর Dal, Enter, Curry।',
          simplerMacBn: 'সাদা জায়গায় ক্লিক করে লিখুন: Rice, তারপর Return, তারপর Dal, Return, Curry।',
          successBn: 'বড় কাজ ভেঙে ছোট হয়ে গেল!',
        }),
        ...winSave('f', { file: 'lunch.txt', done: { type: 'saveFile', name: 'lunch.txt' }, successBn: 'lunch.txt সেভ হয়েছে!' }),
        ...macOpen('f'),
        ...write('f', 'mac', {
          instrBn: 'অতিথির খাবার ভাগ করুন: ভাত, ডাল, তরকারি — প্রতি লাইনে একটি।',
          hintBn: 'ইংরেজিতে লিখুন: Rice, Dal, Curry — প্রতিটির পর Enter। বাংলাতেও চলবে।',
          simplerWinBn: 'সাদা জায়গায় ক্লিক করে লিখুন: Rice, তারপর Enter, তারপর Dal, Enter, Curry।',
          simplerMacBn: 'সাদা জায়গায় ক্লিক করে লিখুন: Rice, তারপর Return, তারপর Dal, Return, Curry।',
          successBn: 'বড় কাজ ভেঙে ছোট হয়ে গেল!',
        }),
        ...macSave('f', { file: 'lunch.txt', done: { type: 'saveFile', name: 'lunch.txt' }, successBn: 'lunch.txt সেভ হয়েছে!' }),
      ],
      quiz: [
        {
          id: 'q-match-ideas',
          type: 'dragMatch',
          questionBn: 'রোজকার কথার সাথে ধারণা মিলিয়ে দিন।',
          pairs: [
            { id: 'p1', leftBn: '“আগে পানি ফোটান, তারপর চা পাতা”', rightBn: 'ক্রম' },
            { id: 'p2', leftBn: '“যদি বৃষ্টি হয়, ছাতা নিন”', rightBn: 'সিদ্ধান্ত' },
            { id: 'p3', leftBn: '“প্রতিটি কাপে এক চামচ চিনি”', rightBn: 'লুপ' },
            { id: 'p4', leftBn: '“অতিথির খাবার” ভেঙে ভাত, ডাল', rightBn: 'ছোট ধাপে ভাগ' },
          ],
          hintBn: '“যদি” সিদ্ধান্ত; “প্রতিটি” লুপ; শুধু একের পর এক হলে ক্রম।',
          explanationBn: 'এই চার ধারণাতেই সব অ্যালগরিদম গড়া।',
        },
        {
          id: 'q-debug-egg',
          type: 'ordering',
          questionBn: 'ডিম ভাজির ধাপগুলো এলোমেলো (বাগ)! ঠিক ক্রমে সাজান।',
          items: [
            { id: 'e1', textBn: 'কড়াইয়ে তেল দিই' },
            { id: 'e2', textBn: 'ডিম ফেটিয়ে লবণ মেশাই' },
            { id: 'e3', textBn: 'তেল গরম হলে ডিম ঢালি' },
            { id: 'e4', textBn: 'এক পাশ হলে উল্টে দিই' },
            { id: 'e5', textBn: 'সোনালি হলে নামিয়ে পরিবেশন' },
          ],
          hintBn: 'ডিম ঢালার আগে তেল গরম; পরিবেশন সবার শেষে।',
          explanationBn: 'এক ধাপ করে চালালেই ভুল ক্রম ধরা পড়ে।',
        },
        {
          id: 'q-flow-shape',
          type: 'multipleChoice',
          questionBn: 'ফ্লোচার্টে সিদ্ধান্ত (হ্যাঁ/না) কোন আকারে আঁকা হয়?',
          options: [
            { id: 'a', textBn: 'হীরা' },
            { id: 'b', textBn: 'গোল (শুরু ও শেষ)' },
            { id: 'c', textBn: 'আয়তক্ষেত্র (কাজ)' },
          ],
          correct: ['a'],
          hintBn: 'দুটি তীর বেরোয়: হ্যাঁ আর না।',
          explanationBn: 'হীরায় সিদ্ধান্ত, আয়তক্ষেত্রে কাজ, গোলে শুরু/শেষ।',
        },
      ],
      recapBn: ['বড় কাজ ভেঙে ছোট করুন', 'ফ্লোচার্ট: হীরা = সিদ্ধান্ত', 'ধাপ চালিয়ে বাগ ধরুন'],
      freeTryBn: 'সকালে স্কুলে যাওয়ার একটি ফ্লোচার্ট বানান।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল জীবনে চেষ্টা করুন। সবই নিরাপদ।',
    tasksBn: [
      'রোজকার একটি কাজ (চা বা ব্যাগ গোছানো) নম্বর দিয়ে কাগজে লিখুন, একটি “যদি… তবে” সহ।',
      'লেখাটি আক্ষরিকভাবে চালান: শুধু কাগজে যা আছে, ঠিক তা-ই করুন। কোথায় আটকাল?',
      'একটি রেসিপিতে ভুল ধাপ (বাগ) খুঁজে ঠিক করে লিখুন।',
    ],
  },

  teacherTipBn:
    '“আক্ষরিক নির্দেশ” খেলুন: আপনি কম্পিউটার সাজুন, তিনি নির্দেশ দিন — “একটি জুস বানিয়ে দাও।” “গ্লাস নাও” না বললে গ্লাস ধরবেন না। হাসাহাসির মধ্য দিয়ে নির্দেশ কতটা স্পষ্ট হতে হয় টের পাওয়া যায়। ভুল ধরা পড়লে বলুন “এটাই বাগ, চলুন ডিবাগ করি” — ভুল পাওয়াকে আনন্দের খেলা বানান, যাতে কোড লেখার সময় ভুলকে ভয় না লাগে।',
}

export default lesson
