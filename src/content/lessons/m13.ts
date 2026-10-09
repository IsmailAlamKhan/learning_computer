import type { Lesson, SimSetup } from '../../engine/types'

/**
 * Module 13 — the Part 1 capstone, in the cards format. Three short units (the learner does the whole project herself,
 * so the coach lines are short and hints come on request):
 *  (1) folder + note (checklist 1–2); (2) recipe search + screenshot (3–4); (3) email with attachment (5) → module celebration → certificate 1.
 * Every unit runs on a fresh practice computer, so units 2 and 3 start from the work of the earlier units (see `afterNote`).
 * Step ids, targets and expectedActions are the same as in the old guided practice; only the words changed.
 */

/** The state after unit 1: Documents/MyWork/note.txt exists (units 2 and 3 start here). */
const afterNote: SimSetup = {
  vfs: (vfs) => {
    const docs = vfs.child(vfs.home, 'Documents')
    if (!docs) return
    const dir = vfs.child(docs, 'MyWork') ?? vfs.mkdir(docs, 'MyWork')
    if (!vfs.child(dir, 'note.txt')) vfs.createFile(dir, 'note.txt', 'My favourite food is khichuri.')
  },
}

const lesson: Lesson = {
  module: 13,
  part: 1,
  id: 'm13',
  titleBn: 'পর্ব ১-এর চূড়ান্ত প্রজেক্ট',
  oneLineBn: 'যা শিখেছেন তা দিয়ে নিজে একটা পুরো কাজ: ফোল্ডার, লেখা, সার্চ, স্ক্রিনশট আর ইমেইল।',
  minutes: 8,
  glossaryIds: ['cap-capstone', 'cap-checklist'],
  certificatePart: 1,

  units: [
    // =====================================================================================================
    {
      id: 'folder-note',
      titleBn: 'ফোল্ডার ও নোট',
      hook: {
        id: 'h-final',
        type: 'hook',
        textBn: 'আজ নতুন কিছু শেখা নেই — আজ আপনার **নিজের প্রজেক্ট**!',
        visual: { kind: 'art', name: 'trophy' },
      },
      cards: [
        {
          id: 'c-plan',
          type: 'visual',
          textBn: 'পাঁচ কাজ: **ফোল্ডার**, লেখা, রেসিপি খোঁজা, স্ক্রিনশট, ইমেইল। সব আপনি নিজে করবেন।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'folder', labelBn: 'ফোল্ডার' },
              { art: 'pencil', labelBn: 'লেখা' },
              { art: 'globe', labelBn: 'খোঁজা' },
              { art: 'envelope', labelBn: 'ইমেইল' },
            ],
          },
          chipsBn: ['তিন ভাগে', 'প্রতি ভাগ ছোট'],
          learnMoreBn: 'কাজগুলো তিন ভাগে ভাগ করা: (১) ফোল্ডার ও লেখা, (২) রেসিপি খোঁজা ও স্ক্রিনশট, (৩) ইমেইলে পাঠানো। প্রতিটি ভাগ নতুন করে শুরু হয়, তবে আগের ভাগের কাজ (ফোল্ডার আর লেখা) আগে থেকেই সাজানো থাকে।',
        },
        {
          id: 'c-less',
          type: 'visual',
          textBn: 'এবার কম কথা, সংক্ষেপে কাজ লেখা থাকবে। আটকে গেলে **হিন্ট** চাপুন।',
          visual: { kind: 'art', name: 'didi-point' },
          chipsBn: ['নিজে চেষ্টা', 'আটকালে হিন্ট'],
        },
        {
          id: 'c-name',
          type: 'visual',
          textBn: 'ফোল্ডারের নাম যা খুশি — যেমন **MyWork**। নামটা মনে রাখুন, একটু পরে লাগবে।',
          visual: { kind: 'art', name: 'folder' },
          chipsBn: ['যেকোনো নাম', 'মনে রাখুন'],
          learnMoreBn: 'বাংলা কিবোর্ড চালু থাকলে আমার-কাজ নামও চলবে। সহজ রাখতে চাইলে ইংরেজিতে MyWork লিখুন। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।',
        },
        {
          id: 'c-saveas',
          type: 'visual',
          textBn: 'লেখাটা **Save As** দিয়ে নিজের ফোল্ডারে রাখবেন। নাম দেবেন note।',
          visual: { kind: 'mock', name: 'save-dialog', highlight: 'folder', captionBn: 'আগে ফোল্ডার বাছুন' },
          chipsBn: ['ফোল্ডারে ঢুকুন', 'নাম: note'],
          learnMoreBn: 'শেষে নামটি হবে note.txt। Windows-এর ডায়ালগে .txt যেমন আছে তেমনই থাকবে, Mac-এ নিজে থেকেই যুক্ত হবে।',
        },
      ],
      steps: [
        // ---------- 1. folder ----------
        {
          id: 'w-files', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'টাস্কবার থেকে ফাইল এক্সপ্লোরার খুলুন।',
          hintBn: 'টাস্কবারের হলুদ ফোল্ডারের মতো আইকন।',
        },
        {
          id: 'w-docs', osVariant: 'windows', titleBn: 'Documents-এ যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ তালিকা থেকে Documents-এ যান।',
          hintBn: 'বাঁ পাশের তালিকায় Documents লেখা জায়গা।',
        },
        {
          id: 'w-new', osVariant: 'windows', titleBn: 'New চাপুন', target: 'fm-new', expectedAction: { type: 'click', target: 'fm-new' },
          explanationBn: 'ওপরের “New” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের বাঁ দিকে “+ New ▾”।',
        },
        {
          id: 'w-new-folder', osVariant: 'windows', titleBn: 'Folder বেছে নিন', target: 'ctx-new-folder', expectedAction: { type: 'createFolder' },
          explanationBn: 'তালিকা থেকে “Folder” বেছে নিন।',
          hintBn: 'মেনুর প্রথম লাইন Folder।',
        },
        {
          id: 'w-name', osVariant: 'windows', titleBn: 'ফোল্ডারের নাম দিন', target: 'rename-input', expectedAction: { type: 'rename' },
          explanationBn: 'নাম লিখে Enter চাপুন, যেমন MyWork।',
          hintBn: 'নীল ঘরে ইংরেজিতে নাম লিখুন, শেষে Enter।',
          simplerBn: 'পুরোনো নাম মুছে যাবে। M-y-W-o-r-k লিখে Enter চাপুন।',
          successMessageBn: 'ফোল্ডার তৈরি!',
        },
        {
          id: 'm-files', osVariant: 'mac', titleBn: 'ফাইন্ডার খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'ডক থেকে ফাইন্ডার খুলুন।',
          hintBn: 'ডকের একদম বাঁ দিকের নীল-সাদা মুখের আইকন।',
        },
        {
          id: 'm-docs', osVariant: 'mac', titleBn: 'Documents-এ যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ তালিকা থেকে Documents-এ যান।',
          hintBn: 'বাঁ পাশের তালিকায় Documents লেখা জায়গা।',
        },
        {
          id: 'm-new-folder', osVariant: 'mac', titleBn: 'New Folder চাপুন', target: 'fm-new-folder', expectedAction: { type: 'createFolder' },
          explanationBn: 'ওপরের “New Folder” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে “+ New Folder”।',
        },
        {
          id: 'm-name', osVariant: 'mac', titleBn: 'ফোল্ডারের নাম দিন', target: 'rename-input', expectedAction: { type: 'rename' },
          explanationBn: 'নাম লিখে Return চাপুন, যেমন MyWork।',
          hintBn: 'নীল ঘরে ইংরেজিতে নাম লিখুন, শেষে Return।',
          simplerBn: 'পুরোনো নাম মুছে যাবে। M-y-W-o-r-k লিখে Return চাপুন।',
          successMessageBn: 'ফোল্ডার তৈরি!',
        },

        // ---------- 2. note ----------
        {
          id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'এবার লেখার প্রোগ্রাম। স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চারকোনা আইকন।',
        },
        {
          id: 'w-notepad', osVariant: 'windows', titleBn: 'Notepad খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'তালিকা থেকে Notepad বেছে নিন।',
          hintBn: 'হলুদ-সাদা খাতার আইকন, নিচে Notepad লেখা।',
        },
        {
          id: 'w-write', osVariant: 'windows', titleBn: 'ছোট একটা লেখা লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'এক-দুই লাইন লিখুন, যেমন প্রিয় রান্নার নাম।',
          hintBn: 'সাদা জায়গায় ক্লিক করে টাইপ করুন, যেমন: My favourite food is khichuri.',
        },
        {
          id: 'w-file-menu', osVariant: 'windows', titleBn: 'File মেনু', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
          explanationBn: 'ওপরের “File” মেনু খুলুন।',
          hintBn: 'উইন্ডোর ওপরের বাঁ দিকের শব্দ File।',
        },
        {
          id: 'w-save-as', osVariant: 'windows', titleBn: 'Save As বেছে নিন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
          explanationBn: '“Save As…” বেছে নিন।',
          hintBn: 'মেনুতে Save-এর নিচে Save As… আছে।',
        },
        {
          id: 'w-save', osVariant: 'windows', titleBn: 'নিজের ফোল্ডারে সেভ করুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile' },
          explanationBn: 'নিজের ফোল্ডারে ঢুকুন, নাম দিন note, Save চাপুন।',
          hintBn: 'তালিকায় নিজের ফোল্ডারে ক্লিক করুন, ওপরের পথে নাম দেখালে ঠিক জায়গায় আছেন। তারপর নীল Save।',
          simplerBn: 'ধাপগুলো: ১) তালিকায় নিজের ফোল্ডারে ক্লিক। ২) নামের ঘরে note লেখা। ৩) নীল Save বোতাম।',
          successMessageBn: 'নোট সেভ হয়েছে!',
        },
        {
          id: 'm-spot', osVariant: 'mac', titleBn: 'স্পটলাইট খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
          explanationBn: 'এবার লেখার প্রোগ্রাম। ওপরের 🔍 চিহ্নে ক্লিক করুন।',
          hintBn: 'পর্দার ওপরের সারির ডান দিকের ম্যাগনিফাইং গ্লাস।',
        },
        {
          id: 'm-spot-type', osVariant: 'mac', titleBn: 'TextEdit লিখুন', target: 'spotlight-input', expectedAction: { type: 'type', target: 'spotlight-input', text: 'TextEdit', ignoreCase: true },
          explanationBn: 'সার্চ বক্সে লিখুন: TextEdit',
          hintBn: 'ইংরেজিতে TextEdit লিখুন।',
        },
        {
          id: 'm-textedit', osVariant: 'mac', titleBn: 'TextEdit খুলুন', target: 'spotlight-result-0', expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'তালিকার প্রথম লাইনে ক্লিক করুন।',
          hintBn: 'নিচের তালিকার একদম ওপরের লাইন।',
        },
        {
          id: 'm-write', osVariant: 'mac', titleBn: 'ছোট একটা লেখা লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'এক-দুই লাইন লিখুন, যেমন প্রিয় রান্নার নাম।',
          hintBn: 'সাদা জায়গায় ক্লিক করে টাইপ করুন, যেমন: My favourite food is khichuri.',
        },
        {
          id: 'm-save-as', osVariant: 'mac', titleBn: 'Save As চাপুন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
          explanationBn: 'ওপরের “Save As…” বোতাম চাপুন।',
          hintBn: 'টুলবারে Save-এর পাশের Save As…।',
        },
        {
          id: 'm-save', osVariant: 'mac', titleBn: 'নিজের ফোল্ডারে সেভ করুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile' },
          explanationBn: 'নিজের ফোল্ডারে ঢুকুন, নাম দিন note, Save চাপুন।',
          hintBn: 'তালিকায় নিজের ফোল্ডারে ক্লিক করুন, “Where” লেখায় নাম দেখালে ঠিক জায়গায় আছেন। তারপর নীল Save।',
          simplerBn: 'ধাপগুলো: ১) তালিকায় নিজের ফোল্ডারে ক্লিক। ২) নামের ঘরে note লেখা। ৩) নীল Save বোতাম।',
          successMessageBn: 'নোট সেভ হয়েছে!',
        },
      ],
      checklist: [
        { id: 'c-folder', textBn: '১. নিজের ফোল্ডার', stepIds: ['w-files', 'w-docs', 'w-new', 'w-new-folder', 'w-name', 'm-files', 'm-docs', 'm-new-folder', 'm-name'] },
        { id: 'c-note', textBn: '২. note.txt সেভ', stepIds: ['w-start', 'w-notepad', 'w-write', 'w-file-menu', 'w-save-as', 'w-save', 'm-spot', 'm-spot-type', 'm-textedit', 'm-write', 'm-save-as', 'm-save'] },
      ],
      quiz: [
        {
          id: 'q-extension',
          type: 'clickTarget',
          questionBn: 'Documents/MyWork/note.txt — ফাইলের ধরন বোঝায় কোন অংশ?',
          items: [
            { id: 'folder', labelBn: 'MyWork', icon: '📁' },
            { id: 'name', labelBn: 'note', icon: '📝' },
            { id: 'ext', labelBn: '.txt', icon: '🏷️' },
          ],
          correct: 'ext',
          hintBn: 'নামের শেষে ডটের পরের অংশ।',
          explanationBn: '.txt মানে লেখার ফাইল। একে এক্সটেনশন বলে।',
        },
        {
          id: 'q-save-order',
          type: 'ordering',
          questionBn: 'নতুন লেখা সেভ করার ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'Notepad বা TextEdit খুলি' },
            { id: '2', textBn: 'লেখাটি লিখি' },
            { id: '3', textBn: 'Save As বেছে নিই' },
            { id: '4', textBn: 'নিজের ফোল্ডার বেছে নাম লিখে Save চাপি' },
          ],
          hintBn: 'আগে প্রোগ্রাম, তারপর লেখা, শেষে সেভ।',
          explanationBn: 'এই ক্রম যেকোনো প্রোগ্রামে কাজ করে।',
        },
        {
          id: 'q-shortcuts',
          type: 'dragMatch',
          questionBn: 'শর্টকাটের সাথে কাজ মেলান। (Windows-এ Ctrl, Mac-এ Command)',
          pairs: [
            { id: 'c', leftBn: 'Ctrl/Command + C', rightBn: 'কপি' },
            { id: 'v', leftBn: 'Ctrl/Command + V', rightBn: 'পেস্ট' },
            { id: 'z', leftBn: 'Ctrl/Command + Z', rightBn: 'ভুল ফিরিয়ে নেওয়া' },
            { id: 's', leftBn: 'Ctrl/Command + S', rightBn: 'সেভ' },
          ],
          hintBn: 'C = Copy, V = Paste, Z = Undo, S = Save।',
          explanationBn: 'অভ্যাস করলেই হাতে বসে যায়।',
        },
      ],
      recapBn: ['ফোল্ডারে নোট সেভ করলাম', 'Save As = নাম ও জায়গা বাছা', '.txt = লেখার ফাইল'],
      freeTryBn: 'আরেকটা লেখা লিখে একই ফোল্ডারে সেভ করুন।',
    },

    // =====================================================================================================
    {
      id: 'search-shot',
      titleBn: 'রেসিপি খোঁজা ও স্ক্রিনশট',
      setup: afterNote,
      hook: {
        id: 'h-search',
        type: 'hook',
        textBn: 'ফোল্ডার আর নোট তৈরি। এবার ইন্টারনেটে **রেসিপি** খুঁজি!',
        visual: { kind: 'art', name: 'recipe-card' },
      },
      cards: [
        {
          id: 'c-search',
          type: 'visual',
          textBn: 'অ্যাড্রেস বারে **dal recipe** লিখে Enter। ফলাফলে “Ad” লেখাগুলো এড়িয়ে যাবেন।',
          visual: { kind: 'mock', name: 'browser', highlight: 'address-bar', captionBn: 'এখানে লিখুন' },
          chipsBn: ['dal recipe', 'Ad এড়ান'],
          learnMoreBn: 'সার্চ ফলাফলের ওপরে বা নিচে মাঝে মাঝে বিজ্ঞাপন (Ad) থাকে। আসল ফলাফল চিনতে “Ad” লেখাটি খুঁজুন।',
        },
        {
          id: 'c-shot-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'পুরো পর্দার ছবি তুলতে **Win + PrtScn** চাপুন। ছবি Pictures › Screenshots-এ জমা হয়।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'win+prtscn', os: 'windows', captionBn: 'পুরো পর্দা' },
          chipsBn: ['Win + PrtScn'],
          learnMoreBn: 'কিবোর্ডে না হলে পর্দার নিচের শর্টকাট প্যাড ব্যবহার করুন: আগে Win বেছে নিন, তারপর PrtScn-এ ক্লিক করুন।',
        },
        {
          id: 'c-shot-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'পুরো পর্দার ছবি তুলতে **Shift + Command + 3** চাপুন। ছবি ডেস্কটপে জমা হয়।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'shift+cmd+3', os: 'mac', captionBn: 'পুরো পর্দা' },
          chipsBn: ['Shift+Cmd+3'],
          learnMoreBn: 'কিবোর্ডে না হলে পর্দার নিচের শর্টকাট প্যাড ব্যবহার করুন: আগে Shift ও Command বেছে নিন, তারপর 3-এ ক্লিক করুন।',
        },
        {
          id: 'c-safe',
          type: 'visual',
          textBn: 'সার্চের সময়ও সাবধান: “এখনই ওটিপি দিন” লেখা কিছু দেখলে **থামুন**।',
          visual: { kind: 'art', name: 'shield' },
          chipsBn: ['ওটিপি কাউকে নয়', 'তাড়া = সন্দেহ'],
        },
      ],
      steps: [
        // ---------- 3. search ----------
        {
          id: 'w-browser-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'এবার রেসিপি খুঁজব। স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চারকোনা আইকন।',
        },
        {
          id: 'w-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'তালিকা থেকে Web Browser খুলুন।',
          hintBn: 'গোলকের মতো আইকন, পাশে Web Browser।',
        },
        {
          id: 'm-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'এবার রেসিপি খুঁজব। ডক থেকে ব্রাউজার খুলুন।',
          hintBn: 'ডকের গোলকের মতো আইকন।',
        },
        {
          id: 'search', osVariant: 'both', titleBn: 'রেসিপি খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search' },
          explanationBn: 'অ্যাড্রেস বারে dal recipe লিখে Enter চাপুন।',
          hintBn: 'ওপরের লম্বা বক্সে ক্লিক করে dal recipe লিখুন, তারপর Enter।',
          simplerBn: 'সাদা লম্বা বক্সে d-a-l, ফাঁকা, r-e-c-i-p-e লিখে বড় Enter চাপুন।',
        },
        {
          id: 'result', osVariant: 'both', titleBn: 'আসল ফলাফলে ক্লিক করুন', target: 'search-result-1', expectedAction: { type: 'click', target: 'search-result-1' },
          explanationBn: 'বিজ্ঞাপন এড়িয়ে প্রথম সাধারণ ফলাফল খুলুন।',
          hintBn: '“মসুর ডালের সহজ রেসিপি” লেখা নীল শিরোনাম, “Ad” বাক্স নয়।',
          successMessageBn: 'রেসিপি পাওয়া গেছে!',
        },

        // ---------- 4. screenshot ----------
        {
          id: 'w-shot', osVariant: 'windows', titleBn: 'স্ক্রিনশট নিন', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'win+prtscn' },
          explanationBn: 'Win + PrtScn চাপুন (শর্টকাট প্যাডেও চলবে)।',
          hintBn: 'প্যাডে আগে Win বেছে নিন, তারপর PrtScn-এ ক্লিক করুন।',
          successMessageBn: 'স্ক্রিনশট নেওয়া হয়েছে!',
        },
        {
          id: 'm-shot', osVariant: 'mac', titleBn: 'স্ক্রিনশট নিন', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'shift+cmd+3' },
          explanationBn: 'Shift + Command + 3 চাপুন (শর্টকাট প্যাডেও চলবে)।',
          hintBn: 'প্যাডে আগে Shift ও Command বেছে নিন, তারপর 3-এ ক্লিক করুন।',
          successMessageBn: 'স্ক্রিনশট নেওয়া হয়েছে!',
        },
      ],
      checklist: [
        { id: 'c-search', textBn: '৩. রেসিপি খোঁজা', stepIds: ['w-browser-start', 'w-browser', 'm-browser', 'search', 'result'] },
        { id: 'c-shot', textBn: '৪. স্ক্রিনশট', stepIds: ['w-shot', 'm-shot'] },
      ],
      quiz: [
        {
          id: 'q-ad',
          type: 'multipleChoice',
          questionBn: 'সার্চ ফলাফলে “Ad” লেখা বাক্স দেখলে কী বুঝবেন?',
          options: [
            { id: 'a', textBn: 'এটা বিজ্ঞাপন, আসল ফলাফল নয়' },
            { id: 'b', textBn: 'এটাই সবচেয়ে নিরাপদ সাইট' },
            { id: 'c', textBn: 'কম্পিউটারে ভাইরাস ঢুকেছে' },
          ],
          correct: ['a'],
          hintBn: 'Ad মানে Advertisement।',
          explanationBn: 'বিজ্ঞাপন চিনে আসল ফলাফল বেছে নিন।',
        },
        {
          id: 'q-scam',
          type: 'multipleChoice',
          questionBn: 'মেসেজ এল: “অ্যাকাউন্ট বন্ধ হবে! লিংকে ক্লিক করে ওটিপি পাঠান।” কী করবেন?',
          options: [
            { id: 'a', textBn: 'তাড়াতাড়ি ওটিপি পাঠাব' },
            { id: 'b', textBn: 'ক্লিক করব না; আসল অ্যাপে নিজে যাব' },
            { id: 'c', textBn: 'বন্ধুদের ফরোয়ার্ড করব' },
          ],
          correct: ['b'],
          hintBn: 'তাড়া দেওয়া আর ওটিপি চাওয়া, দুটোই প্রতারণার লক্ষণ।',
          explanationBn: 'ওটিপি কাউকে দেবেন না; নিজে আসল অ্যাপে যান।',
        },
        {
          id: 'q-shot',
          type: 'clickTarget',
          questionBn: 'পর্দার ছবি তুলে রাখাকে কী বলে?',
          items: [
            { id: 'shot', labelBn: 'স্ক্রিনশট', icon: '📸' },
            { id: 'download', labelBn: 'ডাউনলোড', icon: '⬇️' },
            { id: 'install', labelBn: 'ইনস্টল', icon: '📦' },
          ],
          correct: 'shot',
          hintBn: 'পর্দার (Screen) ছবি (Shot)।',
          explanationBn: 'স্ক্রিনশট ছবি হিসেবে জমা হয়।',
        },
      ],
      recapBn: ['Ad এড়িয়ে আসল ফলাফল', 'স্ক্রিনশট = পর্দার ছবি', 'ওটিপি কাউকে নয়'],
    },

    // =====================================================================================================
    {
      id: 'mail-certificate',
      titleBn: 'ইমেইলে পাঠানো ও সনদ',
      setup: afterNote,
      hook: {
        id: 'h-mail',
        type: 'hook',
        textBn: 'শেষ কাজ: নোটটা **ইমেইলে** পাঠিয়ে দিন। তারপর সনদ!',
        visual: { kind: 'art', name: 'envelope' },
      },
      cards: [
        {
          id: 'c-attach',
          type: 'visual',
          textBn: 'ফাইল পাঠাতে ইমেইলে **ক্লিপ** (Attach) চাপুন, তারপর ফাইল বেছে নিন।',
          visual: { kind: 'mock', name: 'mail', highlight: 'attach', captionBn: 'ক্লিপ = ফাইল জোড়া' },
          chipsBn: ['ক্লিপ = Attach', 'পাঠানোর আগে দেখুন'],
          learnMoreBn: 'Send চাপার আগে ফাইলের ট্যাগ দেখা যাচ্ছে কিনা মিলিয়ে নিন। ফাইল জুড়তে ভুলে গেলে চিঠি ফাঁকা যায়।',
        },
        {
          id: 'c-fields',
          type: 'visual',
          textBn: '**To** ঘরে ঠিকানা, **Subject**-এ বিষয়, তারপর ফাইল জুড়ে Send।',
          visual: { kind: 'mock', name: 'mail', highlight: 'to', captionBn: 'ঠিকানা আগে' },
          chipsBn: ['To = কাকে', 'Subject = বিষয়'],
        },
        {
          id: 'c-last',
          type: 'visual',
          textBn: 'এটাই শেষ ধাপ! পাঠানো হলে পর্ব ১-এর **সনদ** আপনার।',
          visual: { kind: 'art', name: 'medal' },
          chipsBn: ['পর্ব ১ শেষ', 'নিজের নামে সনদ'],
        },
      ],
      steps: [
        // ---------- 5. mail ----------
        {
          id: 'w-mail-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'শেষ কাজ: ইমেইল। স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চারকোনা আইকন।',
        },
        {
          id: 'w-mail', osVariant: 'windows', titleBn: 'Mail খুলুন', target: 'start-app-mail', expectedAction: { type: 'openApp', app: 'mail' },
          explanationBn: 'তালিকা থেকে Mail খুলুন।',
          hintBn: 'খামের আইকন, নিচে Mail।',
        },
        {
          id: 'm-mail', osVariant: 'mac', titleBn: 'Mail খুলুন', target: 'dock-mail', expectedAction: { type: 'openApp', app: 'mail' },
          explanationBn: 'শেষ কাজ: ইমেইল। ডক থেকে Mail খুলুন।',
          hintBn: 'ডকের খামের আইকন।',
        },
        {
          id: 'compose', osVariant: 'both', titleBn: 'Compose', target: 'mail-compose', expectedAction: { type: 'click', target: 'mail-compose' },
          explanationBn: 'Compose চাপুন।',
          hintBn: 'বাঁ ওপরের নীল বোতাম।',
        },
        {
          id: 'to', osVariant: 'both', titleBn: 'প্রাপকের ঠিকানা', target: 'mail-to', expectedAction: { type: 'type', target: 'mail-to', text: 'friend@mail.example', ignoreCase: true },
          explanationBn: 'To ঘরে লিখুন: friend@mail.example',
          hintBn: 'To ঘরে ক্লিক করে ঠিকানাটি টাইপ করুন। মাঝে @ চিহ্ন আছে।',
        },
        {
          id: 'subject', osVariant: 'both', titleBn: 'বিষয়', target: 'mail-subject', expectedAction: { type: 'type', target: 'mail-subject', text: 'My note', ignoreCase: true },
          explanationBn: 'Subject ঘরে লিখুন: My note',
          hintBn: 'To-এর নিচের ঘরে My note লিখুন।',
        },
        {
          id: 'attach', osVariant: 'both', titleBn: 'ফাইল জুড়ুন', target: 'mail-attach', expectedAction: { type: 'click', target: 'mail-attach' },
          explanationBn: 'Attach file বোতাম চাপুন।',
          hintBn: 'Send-এর পাশের ক্লিপ চিহ্ন।',
        },
        {
          id: 'pick', osVariant: 'both', titleBn: 'নিজের ফোল্ডার থেকে ফাইল বাছুন', target: 'mail-picker-attach', expectedAction: { type: 'click', target: 'mail-picker-attach' },
          explanationBn: 'নিজের ফোল্ডারে ঢুকে note.txt বেছে Attach চাপুন।',
          hintBn: 'ফোল্ডারের নামে ক্লিক করুন, তারপর note.txt-তে, তারপর নীল Attach।',
          simplerBn: 'ধাপগুলো: ১) নিজের ফোল্ডারে ক্লিক। ২) note.txt-তে ক্লিক। ৩) নীল Attach।',
        },
        {
          id: 'send', osVariant: 'both', titleBn: 'পাঠিয়ে দিন', target: 'mail-send', expectedAction: { type: 'custom', event: 'mail-sent' },
          explanationBn: 'ফাইলের ট্যাগ দেখা যাচ্ছে? এবার Send চাপুন।',
          hintBn: 'চিঠির নিচের বাঁ দিকের নীল Send।',
          successMessageBn: 'পুরো প্রজেক্ট শেষ!',
        },
      ],
      checklist: [{ id: 'c-mail', textBn: '৫. ফাইলসহ ইমেইল', stepIds: ['w-mail-start', 'w-mail', 'm-mail', 'compose', 'to', 'subject', 'attach', 'pick', 'send'] }],
      quiz: [
        {
          id: 'q-attach',
          type: 'multipleChoice',
          questionBn: 'ইমেইলে একটা ফাইল পাঠাতে চান। কোনটা ঠিক?',
          options: [
            { id: 'a', textBn: 'ক্লিপ (Attach) চেপে ফাইল বেছে নেব' },
            { id: 'b', textBn: 'ফাইলের নাম লিখে দিলেই হবে' },
            { id: 'c', textBn: 'ফাইলটা ডিলিট করে দেব' },
          ],
          correct: ['a'],
          hintBn: 'ক্লিপ চিহ্নটা মনে করুন।',
          explanationBn: 'ক্লিপ দিয়ে ফাইল জুড়ে Send চাপুন।',
        },
        {
          id: 'q-mail-order',
          type: 'ordering',
          questionBn: 'ইমেইল পাঠানোর ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'Compose চাপি' },
            { id: '2', textBn: 'To আর Subject লিখি' },
            { id: '3', textBn: 'ফাইল Attach করি' },
            { id: '4', textBn: 'Send চাপি' },
          ],
          hintBn: 'আগে চিঠি খুলুন, শেষে পাঠান।',
          explanationBn: 'পাঠানোর আগে ফাইলের ট্যাগ দেখে নিন।',
        },
        {
          id: 'q-freeze',
          type: 'multipleChoice',
          questionBn: 'একটা প্রোগ্রাম আটকে গেছে। প্রথমে কী করা ভালো?',
          options: [
            { id: 'a', textBn: 'একটু অপেক্ষা; না হলে শুধু ওই প্রোগ্রাম বন্ধ করব' },
            { id: 'b', textBn: 'বিদ্যুতের তার খুলে দেব' },
            { id: 'c', textBn: 'সব বোতাম জোরে চাপব' },
          ],
          correct: ['a'],
          hintBn: 'আগে ধৈর্য, তারপর শুধু আটকানো প্রোগ্রাম।',
          explanationBn: 'এতে বাকি কাজ নিরাপদ থাকে। মাঝে মাঝে সেভ করুন।',
        },
      ],
      recapBn: ['ক্লিপ = ফাইল জোড়া', 'পাঠানোর আগে ট্যাগ দেখুন', 'আটকালে আগে অপেক্ষা'],
    },
  ],

  realWorld: {
    titleBn: 'আসল কম্পিউটারে চেষ্টা করুন। সবই নিরাপদ।',
    tasksBn: [
      'Documents-এ নিজের ফোল্ডার বানিয়ে একটা লেখা .txt হিসেবে সেভ করুন।',
      'একটা স্ক্রিনশট নিয়ে খুঁজে বের করুন সেটা কোথায় জমা হলো।',
      'চেনা কাউকে ফাইলসহ একটা ইমেইল পাঠান।',
    ],
  },

  teacherTipBn:
    'এই পাঠে বেশি বোঝাবেন না, আগে নিজে চেষ্টা করতে দিন। কোথায় আটকাচ্ছেন লক্ষ করুন: ফোল্ডার খুঁজে পাওয়া, Save As ডায়ালগে সঠিক ফোল্ডারে যাওয়া, নাকি ইমেইলে ফাইল জোড়া। শিক্ষক-পাতার “দুর্বল বিষয়” দেখে বুঝে নিন কোন পাঠ আবার অনুশীলন করাবেন: ফাইল ও পথ হলে মডিউল ৪, শর্টকাট হলে মডিউল ৫, প্রতারণা হলে মডিউল ৭ ও ৯, ইমেইল হলে মডিউল ৮, সমস্যা সমাধান হলে মডিউল ১২। আসল কম্পিউটারে একই প্রজেক্ট করালে আত্মবিশ্বাস সবচেয়ে বাড়ে।',
}

export default lesson
