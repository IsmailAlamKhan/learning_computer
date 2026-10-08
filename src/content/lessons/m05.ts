import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 5,
  part: 1,
  id: 'm05',
  titleBn: 'কিবোর্ড ও টাইপিং',
  oneLineBn: 'কী-এর গ্রুপ, Ctrl/Cmd শর্টকাট, প্রোগ্রামিংয়ের চিহ্ন, আর বাংলা কিবোর্ড চালু করা শিখি।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: [
    'key', 'cursor', 'modifier-key', 'function-keys', 'enter-key', 'space-bar', 'backspace-key', 'delete-key', 'shift-key', 'caps-lock', 'tab-key', 'arrow-keys', 'esc-key',
    'ctrl-key', 'command-key', 'shortcut', 'kb-copy', 'kb-paste', 'kb-cut', 'kb-undo', 'kb-redo', 'kb-select-all', 'kb-find', 'home-row', 'wpm',
    'sym-curly', 'sym-square', 'sym-paren', 'sym-angle', 'sym-slash', 'sym-backslash', 'sym-pipe', 'sym-underscore', 'sym-hyphen', 'sym-equals', 'sym-plus', 'sym-quotes', 'sym-backtick',
    'sym-semicolon', 'sym-colon', 'sym-hash', 'sym-at', 'sym-dollar', 'sym-percent', 'sym-caret', 'sym-ampersand', 'sym-asterisk', 'sym-tilde',
    'keyboard-layout', 'input-indicator', 'input-source',
  ],
  setup: { openApps: ['editor'] },

  explanation: [
    { kind: 'p', textBn: 'কিবোর্ড (Keyboard) হলো কম্পিউটারকে কিছু বলার সবচেয়ে বড় উপায়। আপনি হয়তো আগেও কিছু টাইপ করেছেন। আজ আমরা দেখব — কোন কী-এর কী কাজ, কিছু কাজ কীভাবে চট করে সেরে ফেলা যায় (শর্টকাট), প্রোগ্রামিংয়ের বিশেষ চিহ্নগুলো কোথায় থাকে, আর কিবোর্ডে বাংলা কীভাবে চালু করতে হয়।' },
    { kind: 'analogy', textBn: 'রান্নাঘরে যেমন হাতা-খুন্তি এক জায়গায়, মশলার কৌটো আরেক জায়গায় সাজানো থাকে, কিবোর্ডও তেমনি কয়েকটি গ্রুপে সাজানো। কোন গ্রুপে কী আছে জানা থাকলে যা দরকার চট করে খুঁজে পাওয়া যায়।' },
    { kind: 'widget', widget: 'keyboard-layout' },
    { kind: 'p', textBn: 'কিছু বিশেষ কী-এর কাজ মনে রাখুন:' },
    {
      kind: 'list',
      itemsBn: [
        'Enter (Mac-এ Return): নতুন লাইনে যায়, বা কোনো ঘরে লেখা শেষ হলে “ঠিক আছে” বলে।',
        'Space (স্পেসবার): দুই শব্দের মাঝে ফাঁকা জায়গা দেয়।',
        'Backspace (Mac-এর কী-তে “delete” লেখা থাকে): কার্সারের বাঁ দিকের অক্ষর মুছে ফেলে। ভুল হলে এটাই আপনার বন্ধু। Windows-এর আলাদা Delete কী ডান দিকের অক্ষর মুছে ফেলে।',
        'Shift: চেপে ধরে অন্য কী চাপলে বড় হাতের অক্ষর বা কী-এর ওপরের চিহ্ন (যেমন @ বা {) আসে।',
        'Caps Lock: একবার চাপলে সব অক্ষর বড় হাতের হতে থাকে। আবার চাপলে বন্ধ হয়। হঠাৎ সব বড় হাতের হয়ে গেলে এটি চেক করুন।',
        'Tab: বড় ফাঁক দেয়, আর ফর্মে এক ঘর থেকে পরের ঘরে যায়।',
        'তীর (←↑↓→): লেখার মধ্যে কার্সার (লেখার জায়গা চেনানো দাগ) সরায়।',
        'Esc: কোনো মেনু বা ছোট বাক্স বন্ধ করে — “থাক, লাগবে না” বলার মতো।',
      ],
    },
    { kind: 'p', textBn: 'এবার শর্টকাট (Shortcut)। কয়েকটি কী একসাথে চেপে মেনু ছাড়াই দ্রুত কাজ করা যায়। মূল নিয়ম একটাই: Windows-এ Ctrl, আর Mac-এ Command (⌘) — বাকি অক্ষর একই।' },
    { kind: 'analogy', textBn: 'কপি আর পেস্ট হলো খাতার একটি লেখার ফটোকপি করে অন্য পাতায় আঠা দিয়ে লাগানোর মতো। মূল লেখাটি যেমন ছিল তেমনই থাকে। আর কাট (Cut) হলো কাঁচি দিয়ে কেটে নিয়ে অন্য জায়গায় লাগানো।' },
    { kind: 'widget', widget: 'shortcut-table' },
    { kind: 'note', textBn: 'কী-গুলো একসাথে চাপার সময় প্রথমে Ctrl (বা Command) চেপে ধরে রাখুন, তারপর অক্ষরটি একবার চাপুন, তারপর দুটোই ছাড়ুন। বোতাম চেপে ধরে রাখলে একই কাজ বারবার হতে পারে।' },
    { kind: 'p', textBn: 'প্রোগ্রামিংয়ে অক্ষরের চেয়ে চিহ্নের ব্যবহার বেশি: { } [ ] ( ) < > / \\ | _ - = + " \' ` ; : # @ $ % ^ & * ~। এগুলো কোথায় থাকে আর কীভাবে লিখতে হয়, নিচে একটি একটি করে চিনে নিন। কোডের একটি নমুনা:' },
    { kind: 'code', code: 'print("Hello")', language: 'python' },
    { kind: 'widget', widget: 'symbol-drill' },
    { kind: 'note', textBn: 'আপনার কিবোর্ডে একটু আলাদা হতে পারে — বিশেষ করে \\ | " # @ এই কয়েকটি চিহ্নের জায়গা কিবোর্ডভেদে বদলায়। তখন কী-এর গায়ে ছাপা চিহ্নটি দেখে খুঁজে নেবেন। Mac-এ এই চিহ্নগুলোর জন্য Option কী লাগে না।' },
    { kind: 'p', textBn: 'টাইপিংয়ের কিছু অভ্যাস: পিঠ সোজা করে বসুন, কবজি ঝুলিয়ে না রেখে হালকা ভাসিয়ে রাখুন। বাঁ হাতের তর্জনী F-এর ওপর আর ডান হাতের তর্জনী J-এর ওপর রাখুন — এই দুটি কী-তে ছোট একটি উঁচু দাগ থাকে, তাই না দেখেই খুঁজে পাবেন। গতির চেয়ে নির্ভুল লেখা আগে, গতি আপনা থেকেই বাড়বে।' },
    { kind: 'widget', widget: 'typing-practice' },
    { kind: 'p', textBn: 'এবার বাংলা কিবোর্ড। কম্পিউটারে আলাদা আলাদা কিবোর্ড ভাষা (লেআউট) যোগ করে রাখা যায়, আর দরকারমতো এক ভাষা থেকে আরেকটিতে বদলানো যায়। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে, তবে মোটামুটি এভাবে হয়:' },
    {
      kind: 'list',
      itemsBn: [
        'Windows 11: Settings → Time & language → Language & region → Add a language → Bangla (Bangladesh) বেছে Next → Install। (বাংলা আগে থেকে থাকলে ওই ভাষার পাশের তিন বিন্দুতে Language options → Add a keyboard-ও আছে।) তারপর টাস্কবারের ডান কোণে ENG / BEN লেখা একটি বোতাম আসে। বদলাতে ওই বোতামে ক্লিক করুন, বা Windows কী চেপে ধরে Space চাপুন (কোথাও Alt + Shift-ও চলে)।',
        'Mac: System Settings → Keyboard → Text Input → Input Sources-এর পাশের Edit… → নিচের + চিহ্ন → Bangla বেছে Add। তারপর মেনু বারের ডান দিকে ইনপুট মেনু আসে। বদলাতে ওই মেনুতে ক্লিক করুন, বা Control + Space চাপুন। (কিছু কিবোর্ডে 🌐 / Fn কী চাপলেও বদলায় — এটি সেটিংসের ওপর নির্ভর করে।)',
      ],
    },
    { kind: 'note', textBn: 'খুব জরুরি: কোড লেখার সময় সবসময় ইংরেজি কিবোর্ড (Windows-এ ENG, Mac-এ ABC বা U.S.) চালু রাখুন। বাংলা কিবোর্ড চালু থাকলে অক্ষরের জায়গায় বাংলা অক্ষর বসবে, আর প্রোগ্রাম সেটি বুঝবে না। এই অনুশীলনে আমরা শুধু যোগ করা আর বদলানো শিখব; সিমুলেশনে বাংলা অক্ষর বসে না।' },
  ],

  steps: [
    // ---------- Windows ----------
    {
      id: 'w-type', osVariant: 'windows', titleBn: 'Shift দিয়ে বড় হাতের অক্ষর', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'Hello World' },
      explanationBn: 'Notepad-এর সাদা ঘরে ক্লিক করে ইংরেজিতে Hello World লিখুন। H আর W বড় হাতের — তাই Shift চেপে ধরে রেখে H চাপুন, তারপর Shift ছেড়ে বাকিটা লিখুন। মাঝে একবার Space চাপুন।',
      hintBn: 'প্রথম অক্ষর H আর শব্দের মাঝের পরের অক্ষর W বড় হাতের হবে। Shift চেপে ধরে রেখে অক্ষরটি চাপুন।',
      simplerBn: 'আগে বাঁ হাতের কড়ে আঙুলে Shift চেপে ধরুন। ধরা অবস্থায় ডান হাতে H চাপুন। তারপর দুটোই ছাড়ুন। ভুল হলে Backspace দিয়ে মুছে আবার লিখুন।',
    },
    {
      id: 'w-select-all', osVariant: 'windows', titleBn: 'সব বেছে নিন: Ctrl + A', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+a' },
      explanationBn: 'কিবোর্ডে Ctrl চেপে ধরে রেখে A চাপুন (Ctrl + A)। এটি “সিলেক্ট অল (Select All)” — সব লেখা বেছে নেয়, লেখাটি রঙিন হয়ে যাবে।',
      hintBn: 'বাঁ নিচের কোণে Ctrl লেখা কী। ওটা চেপে ধরে A চাপুন।',
      simplerBn: 'এক আঙুলে Ctrl চেপে রাখুন, অন্য আঙুলে একবার A চাপুন। কিবোর্ডে না হলে “শর্টকাট প্যাড” থেকেও Ctrl বেছে A চাপতে পারেন।',
    },
    {
      id: 'w-copy', osVariant: 'windows', titleBn: 'কপি করুন: Ctrl + C', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
      explanationBn: 'লেখা বাছাই থাকা অবস্থায় Ctrl চেপে ধরে C চাপুন (Ctrl + C)। লেখার একটি নকল তোলা থাকল (কপি)। পর্দায় কিছু বদলাবে না — এটাই স্বাভাবিক।',
      hintBn: 'Ctrl চেপে ধরে C চাপুন। C-এর কথা মনে রাখতে: C for Copy।',
    },
    {
      id: 'w-click-end', osVariant: 'windows', titleBn: 'কার্সার লেখার শেষে নিন', target: 'editor-text', expectedAction: { type: 'click', target: 'editor-text' },
      explanationBn: 'এবার সাদা ঘরের ফাঁকা অংশে একবার ক্লিক করুন। বাছাই উঠে যাবে আর কার্সার লেখার শেষে চলে যাবে।',
      hintBn: 'লেখার নিচের ফাঁকা সাদা জায়গায় মাউস নিয়ে একবার ক্লিক করুন।',
    },
    {
      id: 'w-paste', osVariant: 'windows', titleBn: 'পেস্ট করুন: Ctrl + V', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+v' },
      explanationBn: 'Ctrl চেপে ধরে V চাপুন (Ctrl + V)। কপি করা লেখা কার্সারের জায়গায় বসে যাবে — এটি পেস্ট (Paste)।',
      hintBn: 'Ctrl চেপে ধরে V চাপুন। V কী C-এর ঠিক ডান পাশে।',
    },
    {
      id: 'w-undo', osVariant: 'windows', titleBn: 'ভুল হলে ফিরে যান: Ctrl + Z', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+z' },
      explanationBn: 'এবার Ctrl চেপে ধরে Z চাপুন (Ctrl + Z)। এটি “আনডু (Undo)” — শেষ কাজটি ফিরিয়ে নেয়। কিছু ভুল করলে এটি আপনাকে বাঁচাবে।',
      hintBn: 'Ctrl চেপে ধরে Z চাপুন। Z কিবোর্ডের নিচের সারির একদম বাঁ দিকে।',
    },
    {
      id: 'w-open-settings', osVariant: 'windows', titleBn: 'এবার বাংলা কিবোর্ড যোগ করি', target: 'taskbar-app-settings', expectedAction: { type: 'openApp', app: 'settings' },
      explanationBn: 'টাস্কবারে “Settings” আইকনে ক্লিক করুন। আমরা কম্পিউটারে বাংলা কিবোর্ড যোগ করব। (আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।)',
      hintBn: 'টাস্কবারের আইকনগুলোর মধ্যে “Settings” নামের আইকনটি খুঁজুন। না পেলে স্টার্ট বোতাম থেকেও খোলা যায়।',
    },
    {
      id: 'w-nav-time', osVariant: 'windows', titleBn: '“Time & language” বেছে নিন', target: 'settings-nav-time', expectedAction: { type: 'click', target: 'settings-nav-time' },
      explanationBn: 'বাঁ দিকের তালিকা থেকে “Time & language” লেখাটিতে ক্লিক করুন।',
      hintBn: 'বাঁ দিকের তালিকায় নিচের দিকে “Time & language” আছে।',
    },
    {
      id: 'w-tab-language', osVariant: 'windows', titleBn: '“Language & region”', target: 'settings-time-tab-language', expectedAction: { type: 'click', target: 'settings-time-tab-language' },
      explanationBn: 'ডান পাশে ওপরে “Language & region” লেখায় ক্লিক করুন। এখানেই ভাষা আর কিবোর্ডের সেটিং থাকে।',
      hintBn: 'ওপরের দুটি লেখার মধ্যে “Language & region”।',
    },
    {
      id: 'w-add-language', osVariant: 'windows', titleBn: '“Add a language”', target: 'settings-add-language', expectedAction: { type: 'click', target: 'settings-add-language' },
      explanationBn: '“Preferred languages”-এর পাশের “Add a language” বোতামে ক্লিক করুন।',
      hintBn: 'ডান দিকের বোতামটি, যার ওপর “Add a language” লেখা।',
    },
    {
      id: 'w-pick-bn', osVariant: 'windows', titleBn: '“Bangla (Bangladesh)” বেছে নিন', target: 'settings-lang-choice-bn', expectedAction: { type: 'click', target: 'settings-lang-choice-bn' },
      explanationBn: 'তালিকা থেকে “Bangla (Bangladesh)” লেখাটিতে ক্লিক করুন। (খুঁজে না পেলে ওপরের ঘরে Bangla লিখে খুঁজুন।)',
      hintBn: 'তালিকার প্রথম লাইনে Bangla (Bangladesh) আছে, পাশে বাংলা অক্ষরে নামও লেখা।',
    },
    {
      id: 'w-next', osVariant: 'windows', titleBn: '“Next”', target: 'settings-lang-next', expectedAction: { type: 'click', target: 'settings-lang-next' },
      explanationBn: 'এবার নিচের ডান কোণের “Next” বোতামে ক্লিক করুন।',
      hintBn: 'নিচের ডান দিকে নীল রঙের “Next” বোতাম।',
    },
    {
      id: 'w-install', osVariant: 'windows', titleBn: '“Install”', target: 'settings-lang-install', expectedAction: { type: 'custom', event: 'keyboard-added' },
      explanationBn: '“Install” বোতামে ক্লিক করুন। “Set as my Windows display language” ঘরে টিক দেবেন না — আমরা শুধু বাংলা লিখতে চাই, Windows-এর ভাষা বদলাতে চাই না। (আসল কম্পিউটারে নামাতে কিছুক্ষণ সময় লাগতে পারে।)',
      hintBn: 'নিচের ডান কোণের নীল “Install” বোতাম। টিক দেওয়ার ঘরটি ফাঁকাই থাকুক।',
    },
    {
      id: 'w-tray-open', osVariant: 'windows', titleBn: 'টাস্কবারের ENG বোতাম', target: 'tray-input', expectedAction: { type: 'click', target: 'tray-input' },
      explanationBn: 'দেখুন, টাস্কবারের ডান কোণে ENG লেখা একটি নতুন বোতাম এসেছে। ENG মানে এখন ইংরেজি কিবোর্ড চালু। ওতে ক্লিক করুন।',
      hintBn: 'ঘড়ির বাঁ দিকে, ওয়াই-ফাই চিহ্নের আগে ENG লেখা বোতামটি।',
    },
    {
      id: 'w-tray-bn', osVariant: 'windows', titleBn: 'বাংলায় বদলান', target: 'tray-input-bn', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'bn' },
      explanationBn: 'তালিকা থেকে “Bangla (Bangladesh)” বেছে নিন। বোতামের লেখা বদলে BEN হয়ে যাবে — এখন বাংলা কিবোর্ড চালু। (কিবোর্ডে Windows কী চেপে ধরে Space চাপলেও এভাবেই বদলায়।)',
      hintBn: 'ছোট তালিকায় দ্বিতীয় লাইন, যার পাশে BEN লেখা।',
    },
    {
      id: 'w-tray-open2', osVariant: 'windows', titleBn: 'আবার ইংরেজিতে ফেরা', target: 'tray-input', expectedAction: { type: 'click', target: 'tray-input' },
      explanationBn: 'কোড বা ইংরেজি লিখতে হলে আবার ইংরেজিতে ফিরতে হবে। BEN লেখা বোতামে আবার ক্লিক করুন।',
      hintBn: 'ঘড়ির বাঁ দিকের BEN লেখা বোতামটি।',
    },
    {
      id: 'w-tray-en', osVariant: 'windows', titleBn: 'ENG বেছে নিন', target: 'tray-input-en', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'en' },
      explanationBn: 'তালিকা থেকে “English (United States)” বেছে নিন। বোতামে আবার ENG দেখাবে। চমৎকার — আপনি দুই কিবোর্ডের মধ্যে বদলাতে পারেন!',
      hintBn: 'তালিকার প্রথম লাইন, যার পাশে ENG লেখা।',
    },

    // ---------- Mac ----------
    {
      id: 'm-type', osVariant: 'mac', titleBn: 'Shift দিয়ে বড় হাতের অক্ষর', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'Hello World' },
      explanationBn: 'TextEdit-এর সাদা ঘরে ক্লিক করে ইংরেজিতে Hello World লিখুন। H আর W বড় হাতের — তাই ⇧ Shift চেপে ধরে রেখে H চাপুন, তারপর Shift ছেড়ে বাকিটা লিখুন। মাঝে একবার Space চাপুন।',
      hintBn: 'প্রথম অক্ষর H আর শব্দের মাঝের পরের অক্ষর W বড় হাতের হবে। Shift চেপে ধরে রেখে অক্ষরটি চাপুন।',
      simplerBn: 'আগে বাঁ হাতের কড়ে আঙুলে ⇧ Shift চেপে ধরুন। ধরা অবস্থায় ডান হাতে H চাপুন। তারপর দুটোই ছাড়ুন। ভুল হলে delete কী (Backspace-এর কাজ করে) দিয়ে মুছে আবার লিখুন।',
    },
    {
      id: 'm-select-all', osVariant: 'mac', titleBn: 'সব বেছে নিন: ⌘ + A', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+a' },
      explanationBn: 'কিবোর্ডে ⌘ Command চেপে ধরে রেখে A চাপুন (⌘ + A)। এটি “সিলেক্ট অল (Select All)” — সব লেখা বেছে নেয়, লেখাটি রঙিন হয়ে যাবে।',
      hintBn: 'স্পেসবারের ঠিক পাশে ⌘ বা command লেখা কী। ওটা চেপে ধরে A চাপুন।',
      simplerBn: 'এক আঙুলে ⌘ চেপে রাখুন, অন্য আঙুলে একবার A চাপুন। কিবোর্ডে না হলে “শর্টকাট প্যাড” থেকেও Cmd বেছে A চাপতে পারেন।',
    },
    {
      id: 'm-copy', osVariant: 'mac', titleBn: 'কপি করুন: ⌘ + C', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
      explanationBn: 'লেখা বাছাই থাকা অবস্থায় ⌘ চেপে ধরে C চাপুন (⌘ + C)। লেখার একটি নকল তোলা থাকল (কপি)। পর্দায় কিছু বদলাবে না — এটাই স্বাভাবিক।',
      hintBn: '⌘ চেপে ধরে C চাপুন। C-এর কথা মনে রাখতে: C for Copy।',
    },
    {
      id: 'm-click-end', osVariant: 'mac', titleBn: 'কার্সার লেখার শেষে নিন', target: 'editor-text', expectedAction: { type: 'click', target: 'editor-text' },
      explanationBn: 'এবার সাদা ঘরের ফাঁকা অংশে একবার ক্লিক করুন। বাছাই উঠে যাবে আর কার্সার লেখার শেষে চলে যাবে।',
      hintBn: 'লেখার নিচের ফাঁকা সাদা জায়গায় একবার ক্লিক করুন।',
    },
    {
      id: 'm-paste', osVariant: 'mac', titleBn: 'পেস্ট করুন: ⌘ + V', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+v' },
      explanationBn: '⌘ চেপে ধরে V চাপুন (⌘ + V)। কপি করা লেখা কার্সারের জায়গায় বসে যাবে — এটি পেস্ট (Paste)।',
      hintBn: '⌘ চেপে ধরে V চাপুন। V কী C-এর ঠিক ডান পাশে।',
    },
    {
      id: 'm-undo', osVariant: 'mac', titleBn: 'ভুল হলে ফিরে যান: ⌘ + Z', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+z' },
      explanationBn: 'এবার ⌘ চেপে ধরে Z চাপুন (⌘ + Z)। এটি “আনডু (Undo)” — শেষ কাজটি ফিরিয়ে নেয়। কিছু ভুল করলে এটি আপনাকে বাঁচাবে।',
      hintBn: '⌘ চেপে ধরে Z চাপুন। Z কিবোর্ডের নিচের সারির একদম বাঁ দিকে।',
    },
    {
      id: 'm-open-settings', osVariant: 'mac', titleBn: 'এবার বাংলা কিবোর্ড যোগ করি', target: 'dock-settings', expectedAction: { type: 'openApp', app: 'settings' },
      explanationBn: 'ডকে “System Settings” আইকনে ক্লিক করুন। আমরা কম্পিউটারে বাংলা কিবোর্ড যোগ করব। (আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।)',
      hintBn: 'নিচের ডকে গিয়ারের মতো আইকনটি দেখুন।',
    },
    {
      id: 'm-nav-keyboard', osVariant: 'mac', titleBn: '“Keyboard” বেছে নিন', target: 'settings-nav-keyboard', expectedAction: { type: 'click', target: 'settings-nav-keyboard' },
      explanationBn: 'বাঁ দিকের তালিকা থেকে “Keyboard” লেখাটিতে ক্লিক করুন।',
      hintBn: 'বাঁ দিকের তালিকার মাঝের দিকে “Keyboard” আছে।',
    },
    {
      id: 'm-edit', osVariant: 'mac', titleBn: '“Input Sources” — Edit…', target: 'settings-input-edit', expectedAction: { type: 'click', target: 'settings-input-edit' },
      explanationBn: '“Text Input” অংশে “Input Sources”-এর পাশের “Edit…” বোতামে ক্লিক করুন।',
      hintBn: 'ডান দিকে “Input Sources” লেখা সারির শেষের বোতাম।',
    },
    {
      id: 'm-add', osVariant: 'mac', titleBn: '+ চিহ্নে ক্লিক', target: 'settings-input-add', expectedAction: { type: 'click', target: 'settings-input-add' },
      explanationBn: 'যে ছোট বাক্স খুলেছে, তার তালিকার নিচের বাঁ দিকে + চিহ্ন আছে। সেখানে ক্লিক করুন।',
      hintBn: 'তালিকার ঠিক নিচে ছোট দুটি বোতামের প্রথমটি, যাতে + লেখা।',
    },
    {
      id: 'm-lang-bn', osVariant: 'mac', titleBn: '“Bangla” বেছে নিন', target: 'settings-input-lang-bn', expectedAction: { type: 'click', target: 'settings-input-lang-bn' },
      explanationBn: 'বাঁ পাশের ভাষার তালিকা থেকে “Bangla” ক্লিক করুন। ডান পাশে কিবোর্ডের নাম দেখা যাবে। (আসল কম্পিউটারে একাধিক ধরন থাকতে পারে — যেকোনো একটি বেছে নিলেই চলে।)',
      hintBn: 'বাঁ পাশের ছোট তালিকার দ্বিতীয় লাইন।',
    },
    {
      id: 'm-add-confirm', osVariant: 'mac', titleBn: '“Add”', target: 'settings-input-add-confirm', expectedAction: { type: 'custom', event: 'keyboard-added' },
      explanationBn: 'এবার নিচের ডান কোণের “Add” বোতামে ক্লিক করুন।',
      hintBn: 'নীল রঙের “Add” বোতাম।',
    },
    {
      id: 'm-done', osVariant: 'mac', titleBn: '“Done”', target: 'settings-input-done', expectedAction: { type: 'click', target: 'settings-input-done' },
      explanationBn: 'তালিকায় Bangla যোগ হয়েছে। “Done” বোতামে ক্লিক করে শেষ করুন।',
      hintBn: 'বাক্সের নিচের ডান কোণের “Done”।',
    },
    {
      id: 'm-menu-open', osVariant: 'mac', titleBn: 'মেনু বারের ইনপুট মেনু', target: 'menubar-input', expectedAction: { type: 'click', target: 'menubar-input' },
      explanationBn: 'দেখুন, ওপরের মেনু বারের ডান দিকে একটি ছোট ইনপুট মেনু এসেছে (এখন ABC লেখা)। ওতে ক্লিক করুন।',
      hintBn: 'মেনু বারের একদম ডান দিকে, ব্যাটারি চিহ্নের বাঁ পাশে।',
    },
    {
      id: 'm-menu-bn', osVariant: 'mac', titleBn: 'বাংলায় বদলান', target: 'menubar-input-bn', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'bn' },
      explanationBn: 'তালিকা থেকে “Bangla” বেছে নিন। মেনু বারের চিহ্ন বদলে যাবে — এখন বাংলা কিবোর্ড চালু। (কিবোর্ডে Control চেপে ধরে Space চাপলেও এভাবেই বদলায়।)',
      hintBn: 'ছোট তালিকায় দ্বিতীয় লাইন “Bangla”।',
    },
    {
      id: 'm-menu-open2', osVariant: 'mac', titleBn: 'আবার ইংরেজিতে ফেরা', target: 'menubar-input', expectedAction: { type: 'click', target: 'menubar-input' },
      explanationBn: 'কোড বা ইংরেজি লিখতে হলে আবার ইংরেজিতে ফিরতে হবে। মেনু বারের ইনপুট মেনুতে আবার ক্লিক করুন।',
      hintBn: 'মেনু বারের ডান দিকে, ব্যাটারির বাঁ পাশের ছোট চিহ্ন।',
    },
    {
      id: 'm-menu-en', osVariant: 'mac', titleBn: 'ABC বেছে নিন', target: 'menubar-input-en', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'en' },
      explanationBn: 'তালিকা থেকে “ABC” বেছে নিন। আবার ইংরেজি কিবোর্ড চালু। চমৎকার — আপনি দুই কিবোর্ডের মধ্যে বদলাতে পারেন!',
      hintBn: 'তালিকার প্রথম লাইন “ABC”।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'এখানে কেউ বলে দেবে না — নোটপ্যাড/টেক্সটএডিটে (Notepad / TextEdit) যা খুশি লিখুন আর শর্টকাটগুলো চালিয়ে দেখুন। ভুল হলেও ক্ষতি নেই, “রিসেট” চাপলেই সব আগের মতো হয়ে যাবে। চাইলে ওপরের টাইপিং অনুশীলন আর চিহ্ন শেখার অংশে ফিরে গিয়েও চর্চা করতে পারেন।',
    checklistBn: [
      'Shift দিয়ে একটি বড় হাতের অক্ষর লিখেছি',
      'একটি শব্দ বেছে (সিলেক্ট করে) কপি আর পেস্ট করেছি',
      'ভুল হওয়ায় আনডু (Undo) করেছি',
      'টাইপিং অনুশীলনে অন্তত একটি বাক্য শেষ করেছি',
      'প্রোগ্রামিংয়ের ৫টি চিহ্ন কিবোর্ডে খুঁজে লিখেছি',
    ],
  },

  quiz: [
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'শর্টকাটের সাথে তার কাজ মিলিয়ে দিন। (Windows-এ Ctrl, Mac-এ ⌘ — অক্ষর একই।)',
      pairs: [
        { id: 'c', leftBn: 'Ctrl / ⌘ + C', rightBn: 'কপি (নকল করা)' },
        { id: 'v', leftBn: 'Ctrl / ⌘ + V', rightBn: 'পেস্ট (বসানো)' },
        { id: 'z', leftBn: 'Ctrl / ⌘ + Z', rightBn: 'আনডু (ফিরে যাওয়া)' },
        { id: 'a', leftBn: 'Ctrl / ⌘ + A', rightBn: 'সব বেছে নেওয়া' },
        { id: 's', leftBn: 'Ctrl / ⌘ + S', rightBn: 'সেভ (জমিয়ে রাখা)' },
      ],
      hintBn: 'C for Copy, A for All, S for Save — এগুলো সহজ। বাকি দুটি মনে রাখুন: V হলো পেস্ট, Z হলো আনডু।',
      explanationBn: 'চমৎকার! শর্টকাটগুলো মুখস্থ করতে হবে না — হাত নিজেই শিখে যাবে। শুধু মনে রাখুন, Windows-এ Ctrl আর Mac-এ ⌘।',
    },
    {
      id: 'q-backspace', type: 'clickTarget', questionBn: 'কিবোর্ডের কোন কী কার্সারের বাঁ দিকের অক্ষর মুছে ফেলে? (Mac-এ এই কী-তে “delete” লেখা থাকে।)',
      items: [
        { id: 'enter', labelBn: 'Enter / Return', icon: '↵' },
        { id: 'backspace', labelBn: 'Backspace / delete', icon: '⌫' },
        { id: 'tab', labelBn: 'Tab', icon: '⇥' },
        { id: 'esc', labelBn: 'Esc', icon: '⎋' },
      ],
      correct: 'backspace',
      hintBn: 'ছবিতে বাঁ দিকে মুছে ফেলার মতো তীর (⌫) আঁকা কী-টি খুঁজুন। ভুল লিখলে আমরা এটাই চাপি।',
      explanationBn: 'ঠিক! Backspace (Mac-এ delete) লেখার ভুল সারাতে সবচেয়ে বেশি কাজে লাগে। Enter নতুন লাইনে নেয়, Tab ফাঁক দেয়, আর Esc ছোট বাক্স বন্ধ করে।',
    },
    {
      id: 'q-curly', type: 'multipleChoice', questionBn: 'কিবোর্ডে { (কার্লি ব্র্যাকেট) কীভাবে লিখবেন? (US কিবোর্ড)',
      options: [
        { id: 'a', textBn: 'Shift চেপে ধরে [ কী চাপব' },
        { id: 'b', textBn: 'শুধু [ কী চাপব' },
        { id: 'c', textBn: 'Ctrl চেপে ধরে [ কী চাপব' },
        { id: 'd', textBn: 'Caps Lock চালু করে [ চাপব' },
      ],
      correct: ['a'],
      hintBn: '{ আসলে [ কী-এরই ওপরের চিহ্ন। ওপরের চিহ্ন পেতে কোন কী লাগে ভাবুন।',
      explanationBn: 'ঠিক! { আর } যথাক্রমে [ ও ] কী-এর ওপরের চিহ্ন, তাই Shift লাগে। শুধু [ ] চাপলে স্কোয়ার ব্র্যাকেট আসে।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'একটি লেখা কপি করে অন্য জায়গায় বসানোর ধাপগুলো সঠিক ক্রমে সাজান।',
      items: [
        { id: 'select', textBn: 'যে লেখা নেবেন সেটি বেছে নিন (সিলেক্ট)' },
        { id: 'copy', textBn: 'Ctrl + C (Mac-এ ⌘ + C) চাপুন' },
        { id: 'click', textBn: 'যেখানে বসাবেন, সেখানে ক্লিক করুন' },
        { id: 'paste', textBn: 'Ctrl + V (Mac-এ ⌘ + V) চাপুন' },
      ],
      hintBn: 'আগে নিতে হবে কী, তারপর তুলে রাখা, তারপর জায়গা ঠিক করা, সবশেষে বসানো।',
      explanationBn: 'সুন্দর! বাছাই → কপি → জায়গা ঠিক → পেস্ট। এই চার ধাপ প্রতিদিন কাজে লাগবে।',
    },
    {
      id: 'q-bangla-code', type: 'multipleChoice', questionBn: 'প্রোগ্রামের কোড লেখার সময় কোন কিবোর্ড চালু রাখা উচিত?',
      options: [
        { id: 'en', textBn: 'ইংরেজি কিবোর্ড (Windows-এ ENG, Mac-এ ABC)' },
        { id: 'bn', textBn: 'বাংলা কিবোর্ড (BEN)' },
        { id: 'any', textBn: 'যেকোনোটি, কোনো পার্থক্য নেই' },
      ],
      correct: ['en'],
      hintBn: 'প্রোগ্রামের নির্দেশ ইংরেজি অক্ষরে লেখা হয়, যেমন print। বাংলা কিবোর্ডে অক্ষরের জায়গায় কী বসে ভাবুন।',
      explanationBn: 'ঠিক! কোডের নির্দেশ ও চিহ্ন ইংরেজি কিবোর্ডে লিখতে হয়। বাংলা লিখতে চাইলে তখন বাংলা কিবোর্ডে বদলে নিন, লেখা শেষে আবার ইংরেজিতে ফিরুন।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'Shift = বড় হাতের অক্ষর বা কী-এর ওপরের চিহ্ন। Backspace (Mac-এ delete) = ভুল মুছে ফেলা।',
      'Windows-এ Ctrl, Mac-এ ⌘ + অক্ষর: C কপি, V পেস্ট, X কাট, Z আনডু, A সব বাছা, S সেভ, F খোঁজা।',
      'প্রোগ্রামিংয়ের বেশিরভাগ চিহ্ন Shift + একটি কী: { } = Shift + [ ]; ( ) = Shift + 9 0; " = Shift + \'।',
      'কিবোর্ডের ভাষা বদলানো: Windows-এ টাস্কবারের ENG/BEN বা Win + Space; Mac-এ ইনপুট মেনু বা Control + Space।',
      'কোড লেখার সময় সবসময় ইংরেজি কিবোর্ড চালু রাখুন।',
    ],
    extraBn: 'টাইপিংয়ে গতি আসে নির্ভুলতা থেকে। প্রতিদিন পাঁচ মিনিট অনুশীলনই যথেষ্ট।',
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন',
    tasksBn: [
      'নোটপ্যাড (Notepad) বা টেক্সটএডিট (TextEdit) খুলে নিজের নাম আর একটি বাক্য ইংরেজিতে লিখুন। লেখাটি সিলেক্ট করে কপি করে পেস্ট করুন, তারপর আনডু করুন।',
      'এই অ্যাপের চিট শিট পাতা (কিবোর্ড শর্টকাট) ছাপিয়ে কম্পিউটারের পাশে রাখুন। প্রতিদিন একটি নতুন শর্টকাট ব্যবহার করে দেখুন।',
      'প্রোগ্রামিংয়ের ৫টি চিহ্ন (যেমন { } ( ) " ) আসল কিবোর্ডে খুঁজে বের করে লিখুন। কোনটি আপনার কিবোর্ডে অন্য জায়গায় আছে, সেটি লিখে রাখুন।',
    ],
    windowsTasksBn: ['Settings → Time & language → Language & region খুলে দেখুন বাংলা যোগ করা আছে কিনা। না থাকলে যোগ করুন, তারপর টাস্কবারের ENG/BEN বোতামে ক্লিক করে বদলে দেখুন। (বাংলা প্যাক নামাতে ইন্টারনেট লাগতে পারে।)'],
    macTasksBn: ['System Settings → Keyboard → Text Input → Input Sources → Edit… খুলে দেখুন বাংলা যোগ করা আছে কিনা। না থাকলে + চিহ্নে ক্লিক করে যোগ করুন, তারপর মেনু বারের ইনপুট মেনু বা Control + Space দিয়ে বদলে দেখুন।'],
  },

  teacherTipBn: 'কিবোর্ডে আঙুলের ঠিক জায়গা (F ও J-এর উঁচু দাগে তর্জনী) একবার পাশে বসে দেখিয়ে দিন, তারপর তাড়া দেবেন না — গতির চেয়ে নির্ভুলতা জরুরি। শর্টকাট মুখস্থ করাবেন না; আসল কাজের মধ্যে একটি-দুটি করে ব্যবহার করালেই হাত শিখে যাবে। ওঁর আসল কিবোর্ডে \\ | # @ " ইত্যাদির জায়গা আলাদা কিনা একসাথে মিলিয়ে নিন। বাংলা লেখার জন্য আলাদা ফোনেটিক (উচ্চারণ-ভিত্তিক) কিবোর্ড লাগতে পারে — সেটি পরে আলাদাভাবে দেখলেই চলবে; এই পাঠের উদ্দেশ্য শুধু কিবোর্ড যোগ করা ও ENG/BEN বদলানো শেখা।',
}

export default lesson
