import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 13,
  part: 1,
  id: 'm13',
  titleBn: 'পর্ব ১-এর সমাপনী প্রকল্প',
  oneLineBn: 'এ পর্যন্ত যা শিখেছেন, তা দিয়ে নিজে নিজে একটি পুরো কাজ শেষ করি: ফোল্ডার, লেখা, সার্চ, স্ক্রিনশট আর ইমেইল।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['cap-capstone', 'cap-checklist'],
  certificatePart: 1,

  explanation: [
    { kind: 'p', textBn: 'অভিনন্দন, আপনি পর্ব ১-এর শেষ পাঠে পৌঁছে গেছেন! আজ নতুন কিছু শেখার নেই। আজ আপনি যা শিখেছেন তা দিয়েই নিজে নিজে একটি সমাপনী প্রকল্প (Capstone Project) করবেন।' },
    { kind: 'p', textBn: 'কাজটি এই পাঁচ ধাপের:' },
    {
      kind: 'list',
      itemsBn: [
        'Documents-এ নিজের একটি ফোল্ডার (Folder) বানান।',
        'Notepad বা TextEdit-এ একটি ছোট লেখা (যেমন প্রিয় রান্নার নাম) লিখে .txt ফাইল হিসেবে ওই ফোল্ডারে সেভ করুন।',
        'ব্রাউজারে একটি রান্নার রেসিপি খুঁজুন।',
        'পর্দার একটি স্ক্রিনশট নিন।',
        'বন্ধুকে ইমেইল পাঠান, সাথে আপনার লেখা ফাইলটি জুড়ে দিন।',
      ],
    },
    { kind: 'note', textBn: 'এবার ধাপে ধাপে বেশি বুঝিয়ে দেওয়া হবে না। কী করতে হবে তা সংক্ষেপে লেখা থাকবে, আটকে গেলে কিছুক্ষণ পর নিজে থেকেই ইশারা আসবে। ফোল্ডারের নাম MyWork বা আপনার পছন্দের যেকোনো নাম দিতে পারেন (বাংলা কিবোর্ড চালু থাকলে আমার-কাজও চলবে)। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।' },
  ],

  checklist: [
    { id: 'c-folder', textBn: '১. Documents-এ নিজের ফোল্ডার বানানো', stepIds: ['w-files', 'w-docs', 'w-new', 'w-new-folder', 'w-name', 'm-files', 'm-docs', 'm-new-folder', 'm-name'] },
    { id: 'c-note', textBn: '২. লেখা লিখে ফোল্ডারে .txt ফাইল সেভ করা', stepIds: ['w-write', 'w-save-as', 'w-save', 'm-write', 'm-save-as', 'm-save'] },
    { id: 'c-search', textBn: '৩. ব্রাউজারে রেসিপি খোঁজা', stepIds: ['w-browser', 'm-browser', 'search', 'result'] },
    { id: 'c-shot', textBn: '৪. স্ক্রিনশট নেওয়া', stepIds: ['w-shot', 'm-shot'] },
    { id: 'c-mail', textBn: '৫. ফাইল জুড়ে ইমেইল পাঠানো', stepIds: ['w-mail', 'm-mail', 'compose', 'to', 'subject', 'attach', 'pick', 'send'] },
  ],

  steps: [
    // ---------- 1. folder ----------
    {
      id: 'w-files', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'প্রথম কাজ: নিজের ফোল্ডার। টাস্কবার থেকে ফাইল এক্সপ্লোরার (File Explorer) খুলুন।',
      hintBn: 'টাস্কবারে হলুদ ফোল্ডারের মতো আইকনটি।',
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
      explanationBn: 'নিজের পছন্দের নাম লিখে Enter চাপুন, যেমন MyWork। এই নামটি মনে রাখুন, একটু পরে লাগবে।',
      hintBn: 'নীল ঘরে ইংরেজিতে নাম লিখুন, শেষে Enter।',
      simplerBn: 'পুরোনো নাম মুছে যাবে। M-y-W-o-r-k লিখে Enter চাপুন।',
    },
    {
      id: 'm-files', osVariant: 'mac', titleBn: 'ফাইন্ডার খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'প্রথম কাজ: নিজের ফোল্ডার। ডক থেকে ফাইন্ডার (Finder) খুলুন।',
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
      explanationBn: 'নিজের পছন্দের নাম লিখে Return চাপুন, যেমন MyWork। এই নামটি মনে রাখুন, একটু পরে লাগবে।',
      hintBn: 'নীল ঘরে ইংরেজিতে নাম লিখুন, শেষে Return।',
      simplerBn: 'পুরোনো নাম মুছে যাবে। M-y-W-o-r-k লিখে Return চাপুন।',
    },

    // ---------- 2. note ----------
    {
      id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'এবার লেখার প্রোগ্রাম খুলব। স্টার্ট বোতামে ক্লিক করুন।',
      hintBn: 'টাস্কবারের চারকোনা আইকন।',
    },
    {
      id: 'w-notepad', osVariant: 'windows', titleBn: 'Notepad খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
      explanationBn: 'তালিকা থেকে Notepad বেছে নিন।',
      hintBn: 'হলুদ-সাদা খাতার আইকন, নিচে Notepad লেখা।',
    },
    {
      id: 'w-write', osVariant: 'windows', titleBn: 'একটি ছোট লেখা লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
      explanationBn: 'সাদা জায়গায় আপনার প্রিয় রান্নার নাম বা যেকোনো এক-দুই লাইন লিখুন।',
      hintBn: 'সাদা জায়গায় ক্লিক করে টাইপ করুন, যেমন: My favourite food is khichuri.',
    },
    {
      id: 'w-file-menu', osVariant: 'windows', titleBn: 'File মেনু', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
      explanationBn: 'ওপরের “File” মেনু খুলুন।',
      hintBn: 'উইন্ডোর ওপরের বাঁ দিকের শব্দ File।',
    },
    {
      id: 'w-save-as', osVariant: 'windows', titleBn: 'Save As বেছে নিন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
      explanationBn: 'নতুন নাম আর জায়গা ঠিক করতে “Save As…” বেছে নিন।',
      hintBn: 'মেনুতে Save-এর নিচে Save As… আছে।',
    },
    {
      id: 'w-save', osVariant: 'windows', titleBn: 'নিজের ফোল্ডারে সেভ করুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile' },
      explanationBn: 'ডায়ালগে আপনার ফোল্ডারটিতে ক্লিক করে ভেতরে যান, “File name” ঘরে নামের শুধু প্রথম অংশ বদলে note করুন (শেষের .txt যেমন আছে তেমনই থাকবে, ফলে নাম হবে note.txt), তারপর Save চাপুন।',
      hintBn: 'তালিকা থেকে নিজের ফোল্ডারের নামে ক্লিক করুন। ওপরের পথে ফোল্ডারের নাম দেখালে ঠিক জায়গায় আছেন। তারপর নাম লিখে নীল Save।',
      simplerBn: 'ধাপগুলো: ১) তালিকায় নিজের ফোল্ডারে ক্লিক। ২) নামের ঘরে note লেখা। ৩) নীল Save বোতাম।',
    },
    {
      id: 'm-spot', osVariant: 'mac', titleBn: 'স্পটলাইট খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
      explanationBn: 'এবার লেখার প্রোগ্রাম খুলব। ওপরের মেনু বারের 🔍 চিহ্নে ক্লিক করুন।',
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
      id: 'm-write', osVariant: 'mac', titleBn: 'একটি ছোট লেখা লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
      explanationBn: 'সাদা জায়গায় আপনার প্রিয় রান্নার নাম বা যেকোনো এক-দুই লাইন লিখুন।',
      hintBn: 'সাদা জায়গায় ক্লিক করে টাইপ করুন, যেমন: My favourite food is khichuri.',
    },
    {
      id: 'm-save-as', osVariant: 'mac', titleBn: 'Save As চাপুন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
      explanationBn: 'নতুন নাম আর জায়গা ঠিক করতে ওপরের “Save As…” বোতাম চাপুন।',
      hintBn: 'টুলবারে Save-এর পাশের Save As…।',
    },
    {
      id: 'm-save', osVariant: 'mac', titleBn: 'নিজের ফোল্ডারে সেভ করুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile' },
      explanationBn: 'ডায়ালগে আপনার ফোল্ডারটিতে ক্লিক করে ভেতরে যান, “Save As” ঘরে note লিখুন (.txt নিজে থেকেই যুক্ত হবে, ফলে নাম হবে note.txt), তারপর Save চাপুন।',
      hintBn: 'তালিকা থেকে নিজের ফোল্ডারের নামে ক্লিক করুন। “Where” লেখায় ফোল্ডারের নাম দেখালে ঠিক জায়গায় আছেন। তারপর নাম লিখে নীল Save।',
      simplerBn: 'ধাপগুলো: ১) তালিকায় নিজের ফোল্ডারে ক্লিক। ২) নামের ঘরে note লেখা। ৩) নীল Save বোতাম।',
    },

    // ---------- 3. search ----------
    {
      id: 'w-browser-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'এবার ইন্টারনেটে রেসিপি খুঁজব। স্টার্ট বোতামে ক্লিক করুন।',
      hintBn: 'টাস্কবারের চারকোনা আইকন।',
    },
    {
      id: 'w-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
      explanationBn: 'তালিকা থেকে Web Browser খুলুন।',
      hintBn: 'গোলকের মতো আইকন, পাশে Web Browser।',
    },
    {
      id: 'm-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
      explanationBn: 'এবার ইন্টারনেটে রেসিপি খুঁজব। ডক থেকে ব্রাউজার খুলুন।',
      hintBn: 'ডকের গোলকের মতো আইকন।',
    },
    {
      id: 'search', osVariant: 'both', titleBn: 'রেসিপি খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search' },
      explanationBn: 'অ্যাড্রেস বারে ক্লিক করে dal recipe লিখে Enter (Mac-এ Return) চাপুন।',
      hintBn: 'ওপরের লম্বা বক্সে ক্লিক করে dal recipe লিখুন, তারপর Enter।',
      simplerBn: 'সাদা লম্বা বক্সে d-a-l, ফাঁকা, r-e-c-i-p-e লিখে বড় Enter চাপুন।',
    },
    {
      id: 'result', osVariant: 'both', titleBn: 'আসল ফলাফলে ক্লিক করুন', target: 'search-result-1', expectedAction: { type: 'click', target: 'search-result-1' },
      explanationBn: 'বিজ্ঞাপন (Ad) এড়িয়ে প্রথম সাধারণ ফলাফলটি খুলুন।',
      hintBn: '“মসুর ডালের সহজ রেসিপি” লেখা নীল শিরোনাম। “Ad” লেখা বাক্স নয়।',
    },

    // ---------- 4. screenshot ----------
    {
      id: 'w-shot', osVariant: 'windows', titleBn: 'স্ক্রিনশট নিন', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'win+prtscn' },
      explanationBn: 'পুরো পর্দার স্ক্রিনশট নিতে Win + PrtScn চাপুন। কিবোর্ডে না হলে নিচের শর্টকাট প্যাড ব্যবহার করুন। ছবিটি Pictures › Screenshots-এ জমা হবে।',
      hintBn: 'প্যাডে আগে Win বেছে নিন, তারপর PrtScn-এ ক্লিক করুন।',
    },
    {
      id: 'm-shot', osVariant: 'mac', titleBn: 'স্ক্রিনশট নিন', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'shift+cmd+3' },
      explanationBn: 'পুরো পর্দার স্ক্রিনশট নিতে Shift + Command + 3 চাপুন। কিবোর্ডে না হলে নিচের শর্টকাট প্যাড ব্যবহার করুন। ছবিটি ডেস্কটপে জমা হবে।',
      hintBn: 'প্যাডে আগে Shift ও Command বেছে নিন, তারপর 3-এ ক্লিক করুন।',
    },

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
      explanationBn: 'নতুন চিঠি লিখতে Compose চাপুন।',
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
      explanationBn: 'তালিকায় নিজের ফোল্ডারে ঢুকে note.txt বেছে নিন, তারপর Attach চাপুন।',
      hintBn: 'আপনার ফোল্ডারের নামে ক্লিক করুন, তারপর note.txt-তে, তারপর নীল Attach।',
      simplerBn: 'ধাপগুলো: ১) নিজের ফোল্ডারে ক্লিক। ২) note.txt-তে ক্লিক। ৩) নীল Attach।',
    },
    {
      id: 'send', osVariant: 'both', titleBn: 'পাঠিয়ে দিন', target: 'mail-send', expectedAction: { type: 'custom', event: 'mail-sent' },
      explanationBn: 'ফাইলের ট্যাগ দেখা যাচ্ছে তো? এবার Send চাপুন।',
      hintBn: 'চিঠির নিচের বাঁ দিকের নীল Send।',
      successMessageBn: 'চমৎকার! পুরো প্রকল্পটি আপনি নিজে করে ফেললেন।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'নিজের মতো আরেকটি ফাইল বানান: নতুন একটি লেখা লিখে নিজের ফোল্ডারে সেভ করুন, তারপর সেটি ইমেইলে পাঠান।',
    checklistBn: [
      'আরেকটি লেখা নিজের ফোল্ডারে সেভ করেছি',
      'স্ক্রিনশটটিও ইমেইলে জুড়ে পাঠিয়েছি',
    ],
  },

  quiz: [
    {
      id: 'q-save-order', type: 'ordering', questionBn: 'নতুন লেখা ফাইল হিসেবে সেভ করার ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'Notepad বা TextEdit খুলি' },
        { id: '2', textBn: 'লেখাটি লিখি' },
        { id: '3', textBn: 'Save As বেছে নিই' },
        { id: '4', textBn: 'নিজের ফোল্ডার বেছে নাম লিখে Save চাপি' },
      ],
      hintBn: 'আগে প্রোগ্রাম, তারপর লেখা, শেষে সেভ।',
      explanationBn: 'ঠিক! এই ক্রমটি যেকোনো প্রোগ্রামে কাজ করে।',
    },
    {
      id: 'q-shortcuts', type: 'dragMatch', questionBn: 'শর্টকাটের সাথে তার কাজ মেলান। (Windows-এ Ctrl, Mac-এ Command)',
      pairs: [
        { id: 'c', leftBn: 'Ctrl/Command + C', rightBn: 'কপি' },
        { id: 'v', leftBn: 'Ctrl/Command + V', rightBn: 'পেস্ট' },
        { id: 'z', leftBn: 'Ctrl/Command + Z', rightBn: 'ভুল ফিরিয়ে নেওয়া' },
        { id: 's', leftBn: 'Ctrl/Command + S', rightBn: 'সেভ' },
      ],
      hintBn: 'C = কপি (Copy), V = বসানো (Paste), Z = ফিরে যাওয়া (Undo), S = সেভ (Save)।',
      explanationBn: 'ঠিক! শর্টকাট মুখস্থ নয়, অভ্যাস করলেই হাতে বসে যায়।',
    },
    {
      id: 'q-extension', type: 'clickTarget', questionBn: 'Documents/MyWork/note.txt — এই পথে ফাইলের ধরন বোঝায় কোন অংশ?',
      items: [
        { id: 'folder', labelBn: 'MyWork', icon: '📁' },
        { id: 'name', labelBn: 'note', icon: '📝' },
        { id: 'ext', labelBn: '.txt', icon: '🏷️' },
      ],
      correct: 'ext',
      hintBn: 'ফাইলের নামের শেষে ডটের পরের অংশ।',
      explanationBn: 'ঠিক! .txt মানে সাধারণ লেখার ফাইল। একে এক্সটেনশন (Extension) বলে।',
    },
    {
      id: 'q-scam', type: 'multipleChoice', questionBn: 'ফোনে মেসেজ এল: “আপনার মোবাইল অ্যাকাউন্ট এখনই বন্ধ হয়ে যাবে! এই লিংকে ক্লিক করে ওটিপি (OTP) পাঠান।” আপনি কী করবেন?',
      options: [
        { id: 'a', textBn: 'তাড়াতাড়ি লিংকে ক্লিক করে ওটিপি পাঠিয়ে দেব' },
        { id: 'b', textBn: 'ক্লিক করব না, ওটিপি কাউকে দেব না; দরকার হলে নিজে আসল অ্যাপ বা অফিসিয়াল নম্বরে যোগাযোগ করব' },
        { id: 'c', textBn: 'মেসেজটি বন্ধুদের ফরোয়ার্ড করব' },
      ],
      correct: ['b'],
      hintBn: 'তাড়া দেওয়া আর ওটিপি চাওয়া — দুটোই প্রতারণার লক্ষণ।',
      explanationBn: 'ঠিক! এভাবে ওটিপি বা পাসওয়ার্ড চাওয়া প্রতারণার লক্ষণ। নিজে থেকে আসল অ্যাপ বা অফিসিয়াল নম্বরে যোগাযোগ করুন।',
    },
    {
      id: 'q-freeze', type: 'multipleChoice', questionBn: 'একটি প্রোগ্রাম আটকে গেছে, কিছুতেই সাড়া দিচ্ছে না। প্রথমে কী করা ভালো?',
      options: [
        { id: 'a', textBn: 'কিছুক্ষণ অপেক্ষা করব; তাতেও না হলে Task Manager (Mac-এ Force Quit) দিয়ে শুধু ওই প্রোগ্রামটি বন্ধ করব' },
        { id: 'b', textBn: 'সরাসরি বিদ্যুতের তার খুলে দেব' },
        { id: 'c', textBn: 'কিবোর্ডের সব বোতাম জোরে জোরে চাপব' },
      ],
      correct: ['a'],
      hintBn: 'আগে ধৈর্য, তারপর কেবল আটকে যাওয়া প্রোগ্রামটি বন্ধ।',
      explanationBn: 'ঠিক! এতে অন্য কাজ ও ফাইল নিরাপদ থাকে। সেভ না করা লেখা হারাতে পারে, তাই কাজের মাঝে মাঝে সেভ করে রাখবেন।',
    },
  ],

  summaryCard: {
    titleBn: 'এ পর্যন্ত যা শিখেছেন',
    pointsBn: [
      'কম্পিউটারের ডেস্কটপ, মাউস, কিবোর্ড আর উইন্ডো চালানো।',
      'ফাইল ও ফোল্ডার বানানো, গোছানো, নাম বদলানো, কপি-সরানো আর পথ (Path) পড়া।',
      'কিবোর্ড শর্টকাট, লেখা, সেভ এবং প্রোগ্রাম চালানো।',
      'ইন্টারনেটে খোঁজা, ইমেইল পাঠানো-পড়া, ছবি, স্ক্রিনশট, পেনড্রাইভ ও প্রিন্ট।',
      'ভুয়া মেসেজ ও সাইট চেনা, নিরাপদ থাকা আর ছোটখাটো সমস্যা নিজে সামলানো।',
    ],
    extraBn: 'আপনি অনেকটা পথ এসেছেন, এটা সহজ কাজ নয়। পর্ব ২-এ আমরা প্রোগ্রামিং শুরু করব: কম্পিউটার কীভাবে ভাবে, আর কীভাবে তাকে নিজের কথা বোঝানো যায়। ধাপে ধাপে, নিজের গতিতে — কোনো তাড়া নেই।',
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'আসল কম্পিউটারে একই প্রকল্প করুন: Documents-এ নিজের ফোল্ডার বানিয়ে একটি লেখা .txt ফাইল হিসেবে সেভ করুন।',
      'একটি স্ক্রিনশট নিয়ে সেটি কোথায় জমা হলো খুঁজে বের করুন।',
      'নিজের ঠিকানায় বা চেনা কাউকে লেখা ফাইলসহ একটি ইমেইল পাঠান।',
    ],
  },

  teacherTipBn:
    'এই পাঠে বেশি বোঝাবেন না, আগে নিজে চেষ্টা করতে দিন। কোথায় আটকাচ্ছেন লক্ষ করুন: ফোল্ডার খুঁজে পাওয়া, Save As ডায়ালগে সঠিক ফোল্ডারে যাওয়া, নাকি ইমেইলে ফাইল জোড়া। কুইজে বেশি ভুল হওয়া প্রশ্নগুলো (শিক্ষক-পাতায় “দুর্বল বিষয়” দেখুন) থেকে বুঝে নিন কোন পাঠ আবার অনুশীলন করাবেন: ফাইল ও পথ হলে মডিউল ৪, শর্টকাট হলে মডিউল ৫, প্রতারণা হলে মডিউল ৭ ও ৯, ইমেইল হলে মডিউল ৮, সমস্যা সমাধান হলে মডিউল ১২। আসল কম্পিউটারে একই প্রকল্প করালে আত্মবিশ্বাস সবচেয়ে বাড়ে।',
}

export default lesson
