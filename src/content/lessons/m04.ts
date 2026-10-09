import type { LegacyLesson as Lesson, Step } from '../../engine/types'

const lesson: Lesson = {
  module: 4,
  part: 1,
  id: 'm04',
  titleBn: 'ফাইল, ফোল্ডার, এক্সটেনশন ও পথ',
  oneLineBn: 'ফাইল ও ফোল্ডার বানানো, সরানো, কপি, মোছা ও ফেরানো; এক্সটেনশন চেনা; আর কম্পিউটারে ফাইলের ঠিকানা (পথ) পড়তে শেখা।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: [
    'file', 'extension', 'path', 'absolute-path', 'relative-path', 'drive', 'root', 'home-folder', 'parent-folder',
    'documents-folder', 'downloads-folder', 'pictures-folder', 'desktop-folder', 'copy', 'paste', 'cut', 'move', 'rename',
    'delete', 'restore', 'recycle-bin', 'search', 'hidden', 'explorer', 'finder', 'backslash', 'slash',
  ],

  setup: {
    openApps: ['files'],
    vfs: (vfs, os) => {
      // A deliberately messy Downloads folder for free practice.
      const dl = vfs.child(vfs.home, 'Downloads')
      if (dl) {
        vfs.createFile(dl, 'photo1.jpg', '')
        vfs.createFile(dl, 'IMG_0042.jpg', '')
        vfs.createFile(dl, 'notes.txt', 'Things to remember.')
        vfs.createFile(dl, 'holiday-photos.zip', '')
        vfs.createFile(dl, 'old-letter.txt', 'Dear friend, ...')
      }
      // On Mac a plain text file is made from an app (TextEdit, module 6), so give the Mac practice computer one to rename.
      if (os === 'mac') {
        const docs = vfs.child(vfs.home, 'Documents')
        if (docs) vfs.createFile(docs, 'notes.txt', 'My first note.')
      }
    },
  },

  explanation: [
    { kind: 'p', textBn: 'আপনার কম্পিউটারে যা কিছু জমানো আছে — চিঠি, ছবি, গান, পরে আপনার লেখা প্রোগ্রাম — সবই এক একটি ফাইল (File)। আর ফাইল সাজিয়ে রাখার জায়গার নাম ফোল্ডার (Folder)।' },
    { kind: 'analogy', textBn: 'ভাবুন একটি আলমারির কথা। আলমারির তাকে কাগজ রাখার কভার সাজানো থাকে — সেই কভারগুলো হলো ফোল্ডার, আর ভেতরের কাগজগুলো হলো ফাইল। ফোল্ডারের ভেতরে ফোল্ডারও রাখা যায় — ঠিক যেমন বড় কভারের ভেতরে ছোট কভার।' },
    {
      kind: 'p',
      textBn: 'ফাইল ও ফোল্ডার দেখার, সাজানোর প্রোগ্রামের নাম Windows-এ ফাইল এক্সপ্লোরার (File Explorer), Mac-এ ফাইন্ডার (Finder)। দুটির কাজ প্রায় একই। এখানে ছয়টি দরকারি কাজ শিখবেন:',
    },
    {
      kind: 'list',
      itemsBn: [
        'বানানো: নতুন ফোল্ডার (New Folder) বা নতুন ফাইল।',
        'নাম বদলানো (Rename): ফাইল বা ফোল্ডারের নাম পাল্টানো।',
        'সরানো (Move): ধরে টেনে (ড্র্যাগ করে) অন্য ফোল্ডারে রাখা।',
        'কপি (Copy) ও পেস্ট (Paste): একটি নকল তৈরি করে অন্য জায়গায় বসানো। শর্টকাট: Ctrl+C আর Ctrl+V (Mac-এ Cmd+C আর Cmd+V)।',
        'মুছে ফেলা (Delete) ও ফিরিয়ে আনা (Restore): মুছলে ফাইল প্রথমে রিসাইকেল বিনে (Mac-এ ট্র্যাশে) যায়, সেখান থেকে ফেরানো যায়।',
        'খোঁজা (Search): নামের একটি অংশ লিখে ফাইল বের করা।',
      ],
    },
    { kind: 'note', textBn: 'নিশ্চিন্ত থাকুন — রিসাইকেল বিন বা ট্র্যাশ খালি (Empty) না করা পর্যন্ত মোছা ফাইল ফিরিয়ে আনা যায়। আর এই সিমুলেশনে কিছু ভুল করলেও আসল কম্পিউটারের কিছুই হবে না।' },

    { kind: 'p', textBn: 'এবার একটি জরুরি বিষয়, যা প্রোগ্রামিংয়ের জন্য খুব দরকার হবে — এক্সটেনশন (Extension)। ফাইলের নামের শেষে একটি ডট (.) আর তার পরে কয়েকটি অক্ষর থাকে। যেমন Recipe.txt-এর .txt।' },
    { kind: 'analogy', textBn: 'এক্সটেনশন হলো মশলার কৌটোর গায়ের লেবেলের মতো। লেবেল দেখে যেমন বোঝা যায় ভেতরে হলুদ না জিরা, তেমনি এক্সটেনশন দেখে কম্পিউটার বোঝে ফাইলটি কোন ধরনের, আর কোন প্রোগ্রাম দিয়ে খুলতে হবে।' },
    {
      kind: 'list',
      itemsBn: [
        '.txt — সাধারণ লেখা (নোটপ্যাড বা টেক্সট এডিটরে খোলে)।',
        '.jpg, .png — ছবি (ছবি দেখার প্রোগ্রামে খোলে)।',
        '.pdf — পড়ার ডকুমেন্ট, যেমন বিল বা ফর্ম (PDF রিডারে খোলে)।',
        '.html — ওয়েবপেজ (ব্রাউজারে খোলে)। ওয়েবসাইট বানানোর প্রথম ফাইল।',
        '.py — পাইথন (Python) প্রোগ্রামের ফাইল।',
        '.js — জাভাস্ক্রিপ্ট (JavaScript) প্রোগ্রামের ফাইল।',
        '.zip — অনেকগুলো ফাইল একসাথে চেপে রাখা একটি প্যাকেট।',
      ],
    },
    { kind: 'p', textBn: 'এক্সটেনশন কেন এত গুরুত্বপূর্ণ? কারণ ভুল এক্সটেনশন দিলে ফাইল ঠিকমতো খোলে না। ছবি photo.jpg-কে নাম বদলে photo.txt করলে সেটি আর ছবি হিসেবে খুলবে না। আর প্রোগ্রাম লিখলে ফাইলের নাম হতে হবে একদম ঠিক — যেমন hello.py, index.html। hello.py.txt হয়ে গেলে প্রোগ্রাম চলবে না।' },
    {
      kind: 'p',
      textBn: 'সমস্যা হলো, Windows-এ অনেক সময় এক্সটেনশন প্রথমে লুকানো থাকে — আপনি শুধু “Recipe” দেখেন, “.txt” দেখেন না। তাই এক্সটেনশন দেখার ব্যবস্থা চালু করে নেওয়া ভালো:',
    },
    {
      kind: 'list',
      itemsBn: [
        'Windows 11 ফাইল এক্সপ্লোরারে: ওপরের View → Show → File name extensions-এ টিক দিন।',
        'Mac-এ: মেনু বারে Finder → Settings (পুরোনো macOS-এ Preferences) → Advanced → “Show all filename extensions” চালু করুন।',
        'এই সিমুলেশনে Mac-এর জন্য একটি শর্টকাট আছে — Finder উইন্ডোর ওপরে ⚙ (View options) বোতামের মেনু থেকে “Show All Filename Extensions” বেছে নিলেই হয়। আসল Mac-এ ওপরের পথটি ধরবেন।',
      ],
    },
    { kind: 'note', textBn: 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — পুরোনো Windows বা macOS-এ মেনুর নাম বা জায়গা ভিন্ন হতে পারে।' },

    { kind: 'p', textBn: 'এবার ফাইলের ঠিকানা — পথ (Path)। একটি ফাইল কম্পিউটারের ঠিক কোথায় আছে, সেটি ফোল্ডারের নামগুলো পরপর লিখে বলা হয়।' },
    { kind: 'analogy', textBn: 'আমরা যেমন ঠিকানা লিখি: বাংলাদেশ → জেলা → থানা → গ্রাম → বাড়ি, পথও তেমনই: বড় ফোল্ডার → তার ভেতরের ফোল্ডার → তার ভেতরের ফোল্ডার → ফাইল। সবচেয়ে ওপর থেকে শুরু করে একদম ফাইল পর্যন্ত।' },
    {
      kind: 'list',
      itemsBn: [
        'Windows: C:\\Users\\Anika\\Documents\\Recipe.txt। নামগুলোর মাঝে ব্যাকস্ল্যাশ ( \\ ) বসে। শুরুর C: হলো ড্রাইভ (Drive) — সংরক্ষণের বড় বিভাগ, সাধারণত C:।',
        'Mac: /Users/anika/Documents/Recipe.txt। নামগুলোর মাঝে স্ল্যাশ ( / ) বসে। একদম শুরুর / হলো সবার ওপরের ফোল্ডার, যার নাম রুট (Root)। Mac-এ ড্রাইভ অক্ষর (C:) নেই।',
        'শেষ অংশটি ফাইলের নাম (Recipe.txt), তার আগের সব অংশ ফোল্ডার।',
        'হোম ফোল্ডার (Home): আপনার নিজের জিনিসের বাড়ি — Windows-এ C:\\Users\\আপনার-নাম, Mac-এ /Users/আপনার-নাম। টার্মিনালে (পরে শিখবেন) একে সংক্ষেপে ~ লেখা হয়। যেমন ~/Documents।',
        'দুটি দরকারি চিহ্ন: ডট ( . ) মানে “এই ফোল্ডার”, আর দুই ডট ( .. ) মানে “এক ধাপ ওপরের ফোল্ডার” (প্যারেন্ট ফোল্ডার)।',
      ],
    },
    {
      kind: 'p',
      textBn: 'পথ দুই রকম। সম্পূর্ণ পথ (Absolute Path) শুরু থেকে লেখা — যেমন C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt — সেটি কম্পিউটারের যেখান থেকেই দেখুন একই থাকে। আপেক্ষিক পথ (Relative Path) “এখন যে ফোল্ডারে আছি” সেখান থেকে লেখা — যেমন Documents-এ থাকলে Family\\Birthdays.txt। ঠিক যেন কাউকে বলা: “আমার বাড়ি থেকে তিন বাড়ি পরে”।',
    },
    { kind: 'note', textBn: 'ফাইল বা ফোল্ডারের নামে ফাঁকা জায়গা (স্পেস) থাকতে পারে, যেমন “Shopping List.txt”। আপাতত সমস্যা নেই। তবে প্রোগ্রামিংয়ের সময় ফাঁকা জায়গা ঝামেলা করে — তাই নিজের কাজের ফাইল-ফোল্ডারের নাম ইংরেজিতে, ফাঁকা জায়গা ছাড়া রাখবেন, যেমন MyWork বা my_work।' },
    { kind: 'widget', widget: 'path-explorer' },

    { kind: 'p', textBn: 'আপনার নিজের জিনিস সাধারণত চারটি জায়গায় থাকে (সবই হোম ফোল্ডারের ভেতরে):' },
    {
      kind: 'list',
      itemsBn: [
        'ডেস্কটপ (Desktop): ডেস্কটপে যা দেখা যায়, আসলে তা এই ফোল্ডারের ভেতরের ফাইল।',
        'ডকুমেন্টস (Documents): নিজের লেখালেখি ও কাজের ফাইল। এই কোর্সে আপনার প্রোগ্রামের ফোল্ডারও এখানেই রাখবেন।',
        'ডাউনলোডস (Downloads): ইন্টারনেট থেকে নামানো ফাইল। প্রায়ই এলোমেলো হয়ে যায় — মাঝেমধ্যে গুছিয়ে নেবেন।',
        'পিকচার্স (Pictures): ছবি।',
      ],
    },
    {
      kind: 'p',
      textBn: 'ফাইল এক্সপ্লোরার আর ফাইন্ডারের পার্থক্য: Windows-এ ওপরে ঠিকানার বার (Address Bar) থাকে — সেখানে পথ দেখা যায়, আবার পথ লিখে সরাসরি সেখানে যাওয়াও যায়। Mac-এ নিচে “Path Bar” চালু করলে (View → Show Path Bar) একই জিনিস দেখা যায়, আর Cmd+Shift+G চেপে “Go to Folder” থেকে পথ লিখে যাওয়া যায়। মোছা ফাইলের ঝুড়ির নাম Windows-এ রিসাইকেল বিন, Mac-এ ট্র্যাশ (Trash)।',
    },
  ],

  steps: [
    // ============ Windows ============
    {
      id: 'w-docs', osVariant: 'windows', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
      explanationBn: 'এটি ফাইল এক্সপ্লোরার। বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
      hintBn: 'বাঁ পাশের লম্বা তালিকায় Desktop, Downloads-এর পাশেই Documents লেখা আছে।',
      simplerBn: 'বাঁ দিকের তালিকা থেকে “Documents” লেখা জায়গাটিতে একবার ক্লিক করুন।',
    },
    {
      id: 'w-read-path', osVariant: 'windows', titleBn: 'এখন কোথায় আছেন — ঠিকানার বার', target: 'fm-address', expectedAction: { type: 'continue' },
      explanationBn: 'ওপরের এই লম্বা বারটি ঠিকানার বার (Address Bar)। এখানে আপনার বর্তমান জায়গার পথ লেখা — C: › Users › Anika › Documents। একে বলে পথ (Path)। বড় থেকে ছোট ফোল্ডার, ধাপে ধাপে।',
      hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'w-ext-view', osVariant: 'windows', titleBn: 'এক্সটেনশন দেখার ব্যবস্থা: View মেনু', target: 'fm-view', expectedAction: { type: 'click', target: 'fm-view' },
      explanationBn: 'আগে এক্সটেনশন দেখা চালু করে নিই, যাতে ফাইলের পুরো নাম দেখা যায়। ওপরের “View” বোতামে ক্লিক করুন।',
      hintBn: 'ওপরের সারিতে New, Cut, Copy, Paste-এর ডান দিকে “View ▾” আছে।',
    },
    {
      id: 'w-ext-show', osVariant: 'windows', titleBn: 'Show', target: 'ctx-show', expectedAction: { type: 'click', target: 'ctx-show' },
      explanationBn: 'মেনুতে “Show” লেখায় ক্লিক করুন।',
      hintBn: 'মেনুর নিচের দিকে “Show ›” দেখুন।',
    },
    {
      id: 'w-ext-on', osVariant: 'windows', titleBn: 'File name extensions', target: 'ctx-show-ext', expectedAction: { type: 'custom', event: 'extensions-shown' },
      explanationBn: '“File name extensions”-এ ক্লিক করে টিক চালু করুন। এবার ফাইলের নামের শেষে .txt-এর মতো অংশ দেখা যাবে।',
      hintBn: 'পাশে খোলা ছোট তালিকায় “File name extensions” আর “Hidden items” আছে — প্রথমটি চান।',
      successMessageBn: 'চমৎকার! এখন থেকে প্রতিটি ফাইলের পুরো নাম দেখতে পাবেন।',
    },
    {
      id: 'w-new', osVariant: 'windows', titleBn: 'নতুন ফোল্ডার: New', target: 'fm-new', expectedAction: { type: 'click', target: 'fm-new' },
      explanationBn: 'এবার Documents-এর ভেতরে নিজের কাজের জন্য একটি ফোল্ডার বানাব। ওপরের “New” বোতামে ক্লিক করুন।',
      hintBn: 'ওপরের বাঁ দিকে “+ New ▾” বোতামটি দেখুন।',
    },
    {
      id: 'w-new-folder', osVariant: 'windows', titleBn: 'Folder বেছে নিন', target: 'ctx-new-folder', expectedAction: { type: 'createFolder' },
      explanationBn: 'তালিকা থেকে “Folder” বেছে নিন।',
      hintBn: '“Folder” আর “Text Document” — দুটির মধ্যে প্রথমটি।',
    },
    {
      id: 'w-name-folder', osVariant: 'windows', titleBn: 'ফোল্ডারের নাম দিন: MyWork', target: 'rename-input', expectedAction: { type: 'rename', to: 'MyWork' },
      explanationBn: 'ফোল্ডারের নামের ঘরটি নীল হয়ে আছে। কিবোর্ডে MyWork লিখে Enter চাপুন। (একসাথে লেখা, ফাঁকা জায়গা ছাড়া, ইংরেজি অক্ষরে।)',
      hintBn: 'M-y-W-o-r-k লিখুন — M আর W বড় হাতের। তারপর Enter চাপুন।',
      simplerBn: 'পুরোনো নাম “New folder” মুছে যাবে, আপনার লেখাটিই নতুন নাম হবে। লেখা হলে Enter চাপুন।',
    },
    {
      id: 'w-new2', osVariant: 'windows', titleBn: 'নতুন লেখার ফাইল: New', target: 'fm-new', expectedAction: { type: 'click', target: 'fm-new' },
      explanationBn: 'এবার একটি লেখার ফাইল বানাই। আবার “New” বোতামে ক্লিক করুন।',
      hintBn: 'আগের মতোই ওপরের বাঁ দিকের “New ▾”।',
    },
    {
      id: 'w-new-text', osVariant: 'windows', titleBn: 'Text Document', target: 'ctx-new-text', expectedAction: { type: 'createFile' },
      explanationBn: '“Text Document” বেছে নিন।',
      hintBn: 'তালিকার দ্বিতীয় লাইন।',
    },
    {
      id: 'w-name-file', osVariant: 'windows', titleBn: 'ফাইলের নাম দিন: notes.txt', target: 'rename-input', expectedAction: { type: 'rename', to: 'notes.txt' },
      explanationBn: 'নামের ঘরে লিখুন notes.txt — শেষের .txt সহ। তারপর Enter চাপুন। (নামের শুধু প্রথম অংশ নীল থাকে, তাই .txt আগে থেকেই থাকতে পারে — তখন শুধু notes লিখলেই চলবে।)',
      hintBn: 'n-o-t-e-s ডট t-x-t। .txt অংশটি যেন থাকে। তারপর Enter।',
      simplerBn: 'যদি নামের ঘরে “New Text Document.txt” দেখেন, শুধু নীল অংশটি মুছে notes লিখুন, তারপর Enter।',
    },
    {
      id: 'w-f2', osVariant: 'windows', titleBn: 'নাম বদলানো: F2', target: 'fm-item-notes.txt', expectedAction: { type: 'keyCombo', keys: 'f2' },
      explanationBn: 'নাম বদলাতে হলে ফাইলটি বেছে F2 চাপতে হয়। notes.txt বাছা আছে — কিবোর্ডে F2 চাপুন। (কিবোর্ডে না পেলে “শর্টকাট প্যাড” ব্যবহার করুন।)',
      hintBn: 'কিবোর্ডের ওপরের সারির F2 চাপুন। না হলে আগে ফাইলটিতে একবার ক্লিক করে নিন।',
      simplerBn: 'ফাইলটিতে একবার ক্লিক করুন, তারপর কিবোর্ডের F2 বোতাম চাপুন।',
      teacherTipBn: 'ল্যাপটপে অনেক সময় F2 চাপতে Fn বোতামও ধরে রাখতে হয়।',
    },
    {
      id: 'w-rename', osVariant: 'windows', titleBn: 'নতুন নাম: ideas.txt', target: 'rename-input', expectedAction: { type: 'rename', from: 'notes.txt', to: 'ideas.txt' },
      explanationBn: 'নামটি বদলে ideas.txt লিখে Enter চাপুন। খেয়াল করুন, .txt যেন থেকে যায়।',
      hintBn: 'ফাইলের ধরন একই রাখতে .txt অংশটি রাখতে হবে।',
    },
    {
      id: 'w-drag', osVariant: 'windows', titleBn: 'ধরে টেনে সরান: ফাইল → ফোল্ডার', target: 'fm-item-ideas.txt', expectedAction: { type: 'drag', target: 'fm-item-ideas.txt', dropTarget: 'fm-item-MyWork' },
      explanationBn: 'ideas.txt-কে মাউস চেপে ধরে টেনে MyWork ফোল্ডারের ওপর নিয়ে গিয়ে ছেড়ে দিন। ফাইলটি ফোল্ডারের ভেতরে চলে যাবে।',
      hintBn: 'বাঁ বোতাম চেপে ধরে রেখেই মাউস সরান। ফোল্ডারের ওপর পৌঁছে বোতাম ছাড়ুন।',
      simplerBn: 'ফাইলের ওপর বাঁ বোতাম চেপে ধরে রাখুন। তারপর ধীরে ধীরে মাউস MyWork-এর ওপর নিন। রং বদলালে বোতাম ছেড়ে দিন।',
    },
    {
      id: 'w-select-recipe', osVariant: 'windows', titleBn: 'কপির জন্য ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
      explanationBn: 'এবার কপি শিখি। “Recipe.txt” ফাইলটিতে একবার ক্লিক করে বেছে নিন।',
      hintBn: 'ফাইলের তালিকায় Recipe.txt খুঁজুন; একবার ক্লিক।',
    },
    {
      id: 'w-copy', osVariant: 'windows', titleBn: 'কপি: Ctrl+C', target: 'fm-item-Recipe.txt', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
      explanationBn: 'কিবোর্ডে Ctrl চেপে ধরে C চাপুন (Ctrl+C)। কিছু নড়বে না — কম্পিউটার চুপচাপ মনে রাখবে।',
      hintBn: 'Ctrl বোতাম চেপে ধরে রেখে একবার C চাপুন, তারপর দুটিই ছাড়ুন।',
      simplerBn: 'না পারলে “শর্টকাট প্যাড” খুলে সেখান থেকে Ctrl+C বেছে নিন।',
    },
    {
      id: 'w-open-mywork', osVariant: 'windows', titleBn: 'MyWork ফোল্ডারে ঢুকুন', target: 'fm-item-MyWork', expectedAction: { type: 'doubleClick', target: 'fm-item-MyWork' },
      explanationBn: 'MyWork ফোল্ডারে ডাবল ক্লিক করে ভেতরে ঢুকুন।',
      hintBn: 'পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
    },
    {
      id: 'w-paste-menu-rc', osVariant: 'windows', titleBn: 'ফাঁকা জায়গায় রাইট ক্লিক', target: 'fm-content', expectedAction: { type: 'rightClick', target: 'fm-content' },
      explanationBn: 'পেস্ট করার আরেকটি উপায় মেনু দিয়ে। ফোল্ডারের ভেতরের ফাঁকা জায়গায় রাইট ক্লিক করুন।',
      hintBn: 'ideas.txt আইকন থেকে একটু দূরে, সাদা ফাঁকা জায়গায় রাইট ক্লিক।',
    },
    {
      id: 'w-paste', osVariant: 'windows', titleBn: 'Paste', target: 'ctx-paste', expectedAction: { type: 'copy', name: 'Recipe.txt', toPath: '~/Documents/MyWork' },
      explanationBn: 'মেনু থেকে “Paste” বেছে নিন। Recipe.txt-এর একটি নকল এখানে বসে যাবে। (কিবোর্ডে Ctrl+V চাপলেও একই কাজ হয় — পরে চেষ্টা করবেন।)',
      hintBn: 'মেনুতে “Paste” লেখাটি খুঁজুন।',
      successMessageBn: 'নকল তৈরি! আসল Recipe.txt আগের জায়গাতেই আছে।',
    },
    {
      id: 'w-delete', osVariant: 'windows', titleBn: 'মুছে ফেলা: Delete', target: 'fm-delete', expectedAction: { type: 'delete', name: 'Recipe.txt' },
      explanationBn: 'নকল করা Recipe.txt বাছা আছে। ওপরের “Delete” বোতামে ক্লিক করুন। ফাইলটি রিসাইকেল বিনে চলে যাবে, চিরতরে যাবে না।',
      hintBn: 'ওপরের সারিতে Rename-এর পাশে “Delete” বোতাম।',
      simplerBn: 'যদি আর বাছা না থাকে, আগে Recipe.txt-এ একবার ক্লিক করুন, তারপর Delete।',
    },
    {
      id: 'w-open-bin', osVariant: 'windows', titleBn: 'রিসাইকেল বিন খুলুন', target: 'fm-sidebar-Recycle Bin', expectedAction: { type: 'openApp', app: 'bin' },
      explanationBn: 'বাঁ দিকের তালিকার একদম নিচে “Recycle Bin”-এ ক্লিক করে মুছে ফেলা ফাইলগুলো দেখুন।',
      hintBn: 'বাঁ পাশের তালিকার শেষ লাইন।',
    },
    {
      id: 'w-bin-select', osVariant: 'windows', titleBn: 'ফেরানোর ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
      explanationBn: 'রিসাইকেল বিনের ভেতরে Recipe.txt-এ একবার ক্লিক করে বেছে নিন।',
      hintBn: 'নতুন খোলা উইন্ডোতে ফাইলটি দেখা যাচ্ছে।',
    },
    {
      id: 'w-restore', osVariant: 'windows', titleBn: 'ফিরিয়ে আনুন: Restore', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Recipe.txt' },
      explanationBn: 'ওপরের “Restore the selected items” বোতামে ক্লিক করুন। ফাইলটি আগের জায়গায় ফিরে যাবে।',
      hintBn: 'ওপরের সারিতে “Restore the selected items” লেখা বোতামটি।',
      successMessageBn: 'দেখলেন তো, মুছলেও ফিরিয়ে আনা যায়!',
    },
    {
      id: 'w-close-bin', osVariant: 'windows', titleBn: 'রিসাইকেল বিন বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
      explanationBn: 'রিসাইকেল বিনের উইন্ডোর ডান ওপরের ✕ বোতামে ক্লিক করে বন্ধ করুন।',
      hintBn: 'রিসাইকেল বিন উইন্ডোর ডান ওপরের কোণে ✕।',
    },
    {
      id: 'w-ctrl-l', osVariant: 'windows', titleBn: 'পথ লিখে যাওয়া: Ctrl+L', target: 'fm-address', expectedAction: { type: 'keyCombo', keys: 'mod+l' },
      explanationBn: 'ঠিকানার বারে পথ লিখেও সরাসরি যাওয়া যায়। কিবোর্ডে Ctrl+L চাপুন (বা বারের ফাঁকা অংশে ক্লিক করুন) — বারটি লেখার ঘর হয়ে যাবে।',
      hintBn: 'Ctrl চেপে ধরে L চাপুন। না হলে “শর্টকাট প্যাড” ব্যবহার করুন।',
    },
    {
      id: 'w-type-path', osVariant: 'windows', titleBn: 'পথ লিখুন: Documents-এ ফিরুন', target: 'fm-address-input', expectedAction: { type: 'navigate', path: '~/Documents' },
      explanationBn: 'বারে এখন C:\\Users\\Anika\\Documents\\MyWork লেখা। শেষের \\MyWork অংশটি মুছে দিয়ে C:\\Users\\Anika\\Documents রাখুন, তারপর Enter চাপুন।',
      hintBn: 'ব্যাকস্ল্যাশ ( \\ ) কিবোর্ডের Enter বোতামের ওপরের দিকে থাকে। শুধু শেষের অংশটুকু মুছলেই হবে।',
      simplerBn: 'পুরো লেখাটি মুছে লিখুন: C:\\Users\\Anika\\Documents — তারপর Enter।',
    },
    {
      id: 'w-search', osVariant: 'windows', titleBn: 'ফাইল খুঁজুন', target: 'fm-search', expectedAction: { type: 'type', target: 'fm-search', text: 'Birthdays', ignoreCase: true },
      explanationBn: 'ওপরের ডান দিকের সার্চ বক্সে Birthdays লিখুন। Family ফোল্ডারের ভেতরের ফাইলটিও খুঁজে বের হবে — সাথে দেখা যাবে সেটি কোথায় আছে।',
      hintBn: 'ওপরের ডানের “Search Documents” লেখা বক্সে ক্লিক করে লিখুন।',
      successMessageBn: 'চমৎকার! ফাইলটি যত গভীরেই থাকুক, সার্চে পেয়ে গেলেন।',
    },

    // ============ Mac ============
    {
      id: 'm-docs', osVariant: 'mac', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
      explanationBn: 'এটি ফাইন্ডার (Finder)। বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
      hintBn: 'বাঁ পাশের “Favorites” তালিকায় Desktop-এর নিচেই Documents।',
      simplerBn: 'বাঁ দিকের তালিকা থেকে “Documents” লেখা জায়গাটিতে একবার ক্লিক করুন।',
    },
    {
      id: 'm-read-path', osVariant: 'mac', titleBn: 'এখন কোথায় আছেন — পথ বার', target: 'fm-address', expectedAction: { type: 'continue' },
      explanationBn: 'উইন্ডোর নিচের এই সারিটি পথ বার (Path Bar): Macintosh HD › Users › anika › Documents। এটিই আপনার বর্তমান জায়গার পথ। বড় থেকে ছোট ফোল্ডার, ধাপে ধাপে। (আসল Mac-এ না দেখালে মেনু বারে View → Show Path Bar দিন।)',
      hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'm-ext-opts', osVariant: 'mac', titleBn: 'এক্সটেনশন দেখার ব্যবস্থা: ⚙ মেনু', target: 'fm-view-options', expectedAction: { type: 'click', target: 'fm-view-options' },
      explanationBn: 'আগে এক্সটেনশন দেখা চালু করে নিই। আসল Mac-এ এটি Finder → Settings → Advanced-এ আছে। এই অনুশীলনের কম্পিউটারে সুবিধার জন্য উইন্ডোর ওপরের ⚙ বোতামে ক্লিক করুন।',
      hintBn: 'ওপরের সারিতে “⚙ ▾” বোতামটি খুঁজুন।',
    },
    {
      id: 'm-ext-on', osVariant: 'mac', titleBn: 'Show All Filename Extensions', target: 'ctx-show-ext', expectedAction: { type: 'custom', event: 'extensions-shown' },
      explanationBn: '“Show All Filename Extensions”-এ ক্লিক করুন। এবার ফাইলের নামের শেষে .txt-এর মতো অংশ দেখা যাবে।',
      hintBn: 'মেনুর প্রথম লাইন।',
      successMessageBn: 'চমৎকার! এখন থেকে প্রতিটি ফাইলের পুরো নাম দেখতে পাবেন।',
    },
    {
      id: 'm-new-folder', osVariant: 'mac', titleBn: 'নতুন ফোল্ডার: New Folder', target: 'fm-new-folder', expectedAction: { type: 'createFolder' },
      explanationBn: 'এবার Documents-এর ভেতরে নিজের কাজের জন্য একটি ফোল্ডার বানাব। ওপরের “New Folder” বোতামে ক্লিক করুন। (কিবোর্ড শর্টকাট: Shift+Cmd+N।)',
      hintBn: 'ওপরের সারিতে “+ New Folder” বোতাম।',
    },
    {
      id: 'm-name-folder', osVariant: 'mac', titleBn: 'ফোল্ডারের নাম দিন: MyWork', target: 'rename-input', expectedAction: { type: 'rename', to: 'MyWork' },
      explanationBn: 'ফোল্ডারের নামের ঘরটি লেখার জন্য তৈরি। কিবোর্ডে MyWork লিখে Return চাপুন। (একসাথে লেখা, ফাঁকা জায়গা ছাড়া, ইংরেজি অক্ষরে।)',
      hintBn: 'M-y-W-o-r-k লিখুন — M আর W বড় হাতের। তারপর Return।',
      simplerBn: 'পুরোনো নাম “untitled folder” মুছে যাবে, আপনার লেখাটিই নতুন নাম হবে। লেখা হলে Return চাপুন।',
    },
    {
      id: 'm-select-notes', osVariant: 'mac', titleBn: 'নাম বদলের জন্য ফাইল বাছুন', target: 'fm-item-notes.txt', expectedAction: { type: 'click', target: 'fm-item-notes.txt' },
      explanationBn: 'এখানে একটি লেখার ফাইল notes.txt আছে। (Mac-এ লেখার ফাইল সাধারণত TextEdit-এর মতো প্রোগ্রাম থেকে বানাতে হয় — সেটি পরের পাঠে।) ফাইলটিতে একবার ক্লিক করুন।',
      hintBn: 'ফাইলের তালিকায় notes.txt খুঁজুন।',
    },
    {
      id: 'm-return', osVariant: 'mac', titleBn: 'নাম বদলানো: Return', target: 'fm-item-notes.txt', expectedAction: { type: 'keyCombo', keys: 'enter' },
      explanationBn: 'Mac-এ নাম বদলাতে ফাইল বেছে Return (Enter) চাপতে হয়। কিবোর্ডে Return চাপুন।',
      hintBn: 'কিবোর্ডের বড় Return বোতাম। না হলে আগে ফাইলটিতে একবার ক্লিক করুন।',
      simplerBn: 'ফাইলটিতে একবার ক্লিক করুন, তারপর কিবোর্ডের Return চাপুন। না পারলে “শর্টকাট প্যাড” ব্যবহার করুন।',
    },
    {
      id: 'm-rename', osVariant: 'mac', titleBn: 'নতুন নাম: ideas.txt', target: 'rename-input', expectedAction: { type: 'rename', from: 'notes.txt', to: 'ideas.txt' },
      explanationBn: 'নামটি বদলে ideas.txt লিখে Return চাপুন। খেয়াল করুন, .txt যেন থেকে যায়।',
      hintBn: 'ফাইলের ধরন একই রাখতে .txt অংশটি রাখতে হবে।',
    },
    {
      id: 'm-drag', osVariant: 'mac', titleBn: 'ধরে টেনে সরান: ফাইল → ফোল্ডার', target: 'fm-item-ideas.txt', expectedAction: { type: 'drag', target: 'fm-item-ideas.txt', dropTarget: 'fm-item-MyWork' },
      explanationBn: 'ideas.txt-কে ক্লিক করে চেপে ধরে টেনে MyWork ফোল্ডারের ওপর নিয়ে ছেড়ে দিন। ফাইলটি ফোল্ডারের ভেতরে চলে যাবে।',
      hintBn: 'বোতাম চেপে ধরে রেখেই মাউস সরান। ফোল্ডারের ওপর পৌঁছে ছাড়ুন।',
      simplerBn: 'ফাইলের ওপর বোতাম চেপে ধরে রাখুন। তারপর ধীরে ধীরে মাউস MyWork-এর ওপর নিন। রং বদলালে ছেড়ে দিন।',
    },
    {
      id: 'm-select-recipe', osVariant: 'mac', titleBn: 'কপির জন্য ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
      explanationBn: 'এবার কপি শিখি। “Recipe.txt” ফাইলটিতে একবার ক্লিক করে বেছে নিন।',
      hintBn: 'ফাইলের তালিকায় Recipe.txt খুঁজুন; একবার ক্লিক।',
    },
    {
      id: 'm-copy', osVariant: 'mac', titleBn: 'কপি: Cmd+C', target: 'fm-item-Recipe.txt', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
      explanationBn: 'কিবোর্ডে Command (⌘) চেপে ধরে C চাপুন (Cmd+C)। কিছু নড়বে না — কম্পিউটার চুপচাপ মনে রাখবে।',
      hintBn: 'Command চেপে ধরে রেখে একবার C চাপুন, তারপর দুটিই ছাড়ুন।',
      simplerBn: 'না পারলে “শর্টকাট প্যাড” খুলে সেখান থেকে Cmd+C বেছে নিন।',
    },
    {
      id: 'm-open-mywork', osVariant: 'mac', titleBn: 'MyWork ফোল্ডারে ঢুকুন', target: 'fm-item-MyWork', expectedAction: { type: 'doubleClick', target: 'fm-item-MyWork' },
      explanationBn: 'MyWork ফোল্ডারে ডাবল ক্লিক করে ভেতরে ঢুকুন।',
      hintBn: 'পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
    },
    {
      id: 'm-paste-menu-rc', osVariant: 'mac', titleBn: 'ফাঁকা জায়গায় রাইট ক্লিক', target: 'fm-content', expectedAction: { type: 'rightClick', target: 'fm-content' },
      explanationBn: 'পেস্ট করার আরেকটি উপায় মেনু দিয়ে। ফোল্ডারের ভেতরের ফাঁকা জায়গায় রাইট ক্লিক (বা দুই আঙুলে ট্যাপ) করুন।',
      hintBn: 'ideas.txt আইকন থেকে একটু দূরে, সাদা ফাঁকা জায়গায় রাইট ক্লিক।',
    },
    {
      id: 'm-paste', osVariant: 'mac', titleBn: 'Paste Item', target: 'ctx-paste', expectedAction: { type: 'copy', name: 'Recipe.txt', toPath: '~/Documents/MyWork' },
      explanationBn: 'মেনু থেকে “Paste Item” বেছে নিন। Recipe.txt-এর একটি নকল এখানে বসে যাবে। (কিবোর্ডে Cmd+V চাপলেও একই কাজ হয় — পরে চেষ্টা করবেন।)',
      hintBn: 'মেনুতে “Paste Item” লেখাটি খুঁজুন।',
      successMessageBn: 'নকল তৈরি! আসল Recipe.txt আগের জায়গাতেই আছে।',
    },
    {
      id: 'm-delete', osVariant: 'mac', titleBn: 'ট্র্যাশে পাঠান', target: 'fm-delete', expectedAction: { type: 'delete', name: 'Recipe.txt' },
      explanationBn: 'নকল করা Recipe.txt বাছা আছে। ওপরের ডান দিকের ট্র্যাশ (🗑) বোতামে ক্লিক করুন। ফাইলটি ট্র্যাশে যাবে, চিরতরে যাবে না। (কিবোর্ডে: Cmd+Delete।)',
      hintBn: 'ওপরের সারিতে একটি ছোট ডাস্টবিনের মতো চিহ্ন।',
      simplerBn: 'যদি আর বাছা না থাকে, আগে Recipe.txt-এ একবার ক্লিক করুন, তারপর ডাস্টবিনের চিহ্নে।',
    },
    {
      id: 'm-open-trash', osVariant: 'mac', titleBn: 'ট্র্যাশ খুলুন', target: 'fm-sidebar-Trash', expectedAction: { type: 'openApp', app: 'bin' },
      explanationBn: 'বাঁ দিকের তালিকার একদম নিচে “Trash”-এ ক্লিক করে মুছে ফেলা ফাইলগুলো দেখুন।',
      hintBn: 'বাঁ পাশের তালিকার শেষ লাইন।',
    },
    {
      id: 'm-trash-select', osVariant: 'mac', titleBn: 'ফেরানোর ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
      explanationBn: 'ট্র্যাশের ভেতরে Recipe.txt-এ একবার ক্লিক করে বেছে নিন।',
      hintBn: 'নতুন খোলা উইন্ডোতে ফাইলটি দেখা যাচ্ছে।',
    },
    {
      id: 'm-restore', osVariant: 'mac', titleBn: 'ফিরিয়ে আনুন: Put Back', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Recipe.txt' },
      explanationBn: 'ওপরের “Put Back” বোতামে ক্লিক করুন। ফাইলটি আগের জায়গায় ফিরে যাবে।',
      hintBn: 'ওপরের সারিতে “Put Back” লেখা বোতামটি।',
      successMessageBn: 'দেখলেন তো, মুছলেও ফিরিয়ে আনা যায়!',
    },
    {
      id: 'm-close-trash', osVariant: 'mac', titleBn: 'ট্র্যাশ বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
      explanationBn: 'ট্র্যাশ উইন্ডোর বাঁ ওপরের লাল বোতামে ক্লিক করে বন্ধ করুন।',
      hintBn: 'ট্র্যাশ উইন্ডোর বাঁ ওপরের কোণে লাল গোল বোতাম।',
    },
    {
      id: 'm-goto', osVariant: 'mac', titleBn: 'পথ লিখে যাওয়া: Go to Folder', target: 'fm-address', expectedAction: { type: 'keyCombo', keys: 'mod+shift+g' },
      explanationBn: 'পথ লিখে সরাসরি কোনো ফোল্ডারে যাওয়ার শর্টকাট: Shift+Cmd+G (মেনু বারে Go → Go to Folder)। কিবোর্ডে Shift, Command আর G একসাথে চাপুন।',
      hintBn: 'Shift আর Command চেপে ধরে রেখে G চাপুন। না হলে “শর্টকাট প্যাড” ব্যবহার করুন।',
    },
    {
      id: 'm-type-path', osVariant: 'mac', titleBn: 'পথ লিখুন: Documents-এ ফিরুন', target: 'goto-input', expectedAction: { type: 'navigate', path: '~/Documents' },
      explanationBn: 'ঘরে এখন /Users/anika/Documents/MyWork লেখা। শেষের /MyWork অংশটি মুছে /Users/anika/Documents রাখুন, তারপর “Go” বোতামে ক্লিক করুন।',
      hintBn: 'স্ল্যাশ ( / ) কিবোর্ডে ? বোতামের সাথে থাকে। শুধু শেষের অংশটুকু মুছলেই হবে।',
      simplerBn: 'পুরো লেখাটি মুছে লিখুন: /Users/anika/Documents — তারপর “Go” বোতামে ক্লিক করুন।',
    },
    {
      id: 'm-search', osVariant: 'mac', titleBn: 'ফাইল খুঁজুন', target: 'fm-search', expectedAction: { type: 'type', target: 'fm-search', text: 'Birthdays', ignoreCase: true },
      explanationBn: 'ওপরের ডান দিকের সার্চ বক্সে Birthdays লিখুন। Family ফোল্ডারের ভেতরের ফাইলটিও খুঁজে বের হবে — সাথে দেখা যাবে সেটি কোথায় আছে।',
      hintBn: 'ওপরের ডানের “Search” লেখা বক্সে ক্লিক করে লিখুন।',
      successMessageBn: 'চমৎকার! ফাইলটি যত গভীরেই থাকুক, সার্চে পেয়ে গেলেন।',
    },
  ] satisfies Step[],

  freePractice: {
    titleBn: 'নিজে নিজে চেষ্টা করুন',
    instructionBn:
      'এখন পুরো ফাইল ম্যানেজার আপনার। Downloads ফোল্ডারে গিয়ে দেখুন, সেখানে এলোমেলো কিছু ফাইল রাখা আছে (photo1.jpg, notes.txt, holiday-photos.zip…)। এগুলো গুছিয়ে ফেলুন। ইচ্ছেমতো ফোল্ডার বানান, ফাইল সরান, কপি করুন। কিছু ভুল হলে মুছে ফেলুন, তারপর বিন বা ট্র্যাশ থেকে ফিরিয়েও আনুন — কোনো ক্ষতি নেই।',
    checklistBn: [
      'Downloads-এ “Photos” নামে একটি ফোল্ডার বানালাম আর ছবির ফাইলগুলো (.jpg) তাতে সরালাম।',
      'কিবোর্ডের শর্টকাট (Ctrl+C আর Ctrl+V, Mac-এ Cmd+C আর Cmd+V) দিয়ে একটি ফাইল কপি করলাম।',
      'ঠিকানার বার (Windows) বা Go to Folder (Mac) দিয়ে Pictures ফোল্ডারে গেলাম।',
      'একটি ফাইলের পুরো পথ নিজে বলতে পারলাম: কোন ফোল্ডারের ভেতর কোনটি।',
      'সার্চ দিয়ে “photo” লিখে ফাইল খুঁজলাম।',
    ],
  },

  quiz: [
    {
      id: 'q-abs-rel', type: 'multipleChoice', questionBn: 'নিচের কোনটি সম্পূর্ণ পথ (Absolute Path)?',
      options: [
        { id: 'a', textBn: 'C:\\Users\\Anika\\Documents\\Recipe.txt' },
        { id: 'b', textBn: 'Documents\\Family\\Birthdays.txt' },
        { id: 'c', textBn: '..\\Pictures\\Flower.png' },
        { id: 'd', textBn: 'Recipe.txt' },
      ],
      correct: ['a'],
      hintBn: 'সম্পূর্ণ পথ একদম শুরু থেকে লেখা হয় — Windows-এ ড্রাইভের নাম (C:) দিয়ে, Mac-এ একটি স্ল্যাশ ( / ) দিয়ে।',
      explanationBn: 'ঠিক! C: দিয়ে শুরু মানে সবার ওপর থেকে লেখা। বাকিগুলো “এখন যেখানে আছি সেখান থেকে” লেখা, তাই সেগুলো আপেক্ষিক পথ। ( .. মানে এক ধাপ ওপরের ফোল্ডার।)',
    },
    {
      id: 'q-ext-match', type: 'dragMatch', questionBn: 'এক্সটেনশনের সাথে ফাইলের ধরন মিলিয়ে দিন।',
      pairs: [
        { id: 'txt', leftBn: '.txt', rightBn: 'সাধারণ লেখার ফাইল' },
        { id: 'jpg', leftBn: '.jpg', rightBn: 'ছবি' },
        { id: 'pdf', leftBn: '.pdf', rightBn: 'পড়ার মতো ডকুমেন্ট' },
        { id: 'html', leftBn: '.html', rightBn: 'ওয়েবপেজ' },
        { id: 'py', leftBn: '.py', rightBn: 'পাইথন প্রোগ্রাম' },
      ],
      hintBn: 'jpg হলো ছবির ফাইল। html দিয়ে ওয়েবপেজ বানানো হয়। py মানে পাইথন প্রোগ্রাম।',
      explanationBn: 'চমৎকার মিলিয়েছেন! এক্সটেনশন দেখেই কম্পিউটার ঠিক করে ফাইলটি কোন প্রোগ্রামে খুলবে।',
    },
    {
      id: 'q-filename', type: 'clickTarget', questionBn: 'পথটি হলো C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt — এর কোন অংশটি ফাইলের নাম?',
      items: [
        { id: 'drive', labelBn: 'C:', icon: '💽' },
        { id: 'users', labelBn: 'Users', icon: '📁' },
        { id: 'family', labelBn: 'Family', icon: '📁' },
        { id: 'file', labelBn: 'Birthdays.txt', icon: '📄' },
      ],
      correct: 'file',
      hintBn: 'পথের একদম শেষ অংশটি দেখুন। তার আগের সবগুলো ফোল্ডার, আর যার শেষে ডট-এক্সটেনশন আছে সেটিই ফাইল।',
      explanationBn: 'ঠিক! শেষ অংশ Birthdays.txt হলো ফাইল। C: হলো ড্রাইভ, আর Users, Anika, Documents, Family — সবই ফোল্ডার।',
    },
    {
      id: 'q-restore-order', type: 'ordering', questionBn: 'ভুল করে মুছে ফেলা ফাইল ফেরানোর ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'ফাইলটি বেছে মুছে ফেলি (রিসাইকেল বিন বা ট্র্যাশে যায়)' },
        { id: '2', textBn: 'রিসাইকেল বিন (Mac-এ ট্র্যাশ) খুলি' },
        { id: '3', textBn: 'মোছা ফাইলটি বেছে নিই' },
        { id: '4', textBn: 'Restore (Mac-এ Put Back) বোতামে ক্লিক করি' },
      ],
      hintBn: 'আগে মুছতে হবে, তারপর ঝুড়ি খুলে ফাইল বেছে, সবশেষে ফিরিয়ে আনার বোতাম।',
      explanationBn: 'চমৎকার! মোছা → বিন খোলা → ফাইল বাছা → ফেরানো। বিন খালি না করা পর্যন্ত এই উপায়ে ফাইল ফেরানো যায়।',
    },
    {
      id: 'q-ext-rename', type: 'multipleChoice', questionBn: 'photo.jpg ছবিটির নাম বদলে ভুল করে photo.txt করে দিলে কী হবে?',
      options: [
        { id: 'a', textBn: 'কিছুই বদলাবে না, ছবি আগের মতোই খুলবে' },
        { id: 'b', textBn: 'কম্পিউটার ফাইলটিকে লেখার ফাইল ভাববে, ছবি হিসেবে আর ঠিকমতো খুলবে না' },
        { id: 'c', textBn: 'ছবিটি নিজে নিজে সুন্দর হয়ে যাবে' },
      ],
      correct: ['b'],
      hintBn: 'এক্সটেনশন কম্পিউটারকে বলে ফাইলটি কোন ধরনের — মশলার কৌটোর লেবেলের কথা ভাবুন।',
      explanationBn: 'ঠিক! এক্সটেনশন বদলালে কম্পিউটার ভুল প্রোগ্রামে খুলতে চায়। ভুল হলে নাম আবার জেপিজি (.jpg) করে দিলেই ঠিক হয়ে যায়। প্রোগ্রামিংয়েও ফাইলের এক্সটেনশন একদম ঠিক রাখতে হবে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'ফাইল = আলমারির কাগজ, ফোল্ডার = কাগজ রাখার কভার (বা তাক)। ফোল্ডারের ভেতরে ফোল্ডার রাখা যায়।',
      'কপি-পেস্ট: Ctrl+C, Ctrl+V (Mac-এ Cmd+C, Cmd+V)। নাম বদল: Windows-এ F2, Mac-এ Return। সরানো: ধরে টেনে ফোল্ডারে ছেড়ে দেওয়া।',
      'মুছলে ফাইল রিসাইকেল বিন (Mac-এ ট্র্যাশ)-এ যায় — সেখান থেকে Restore (Mac-এ Put Back) করা যায়।',
      'এক্সটেনশন (.txt, .jpg, .pdf, .html, .py, .js) বলে দেয় ফাইলটি কোন ধরনের। ভুল এক্সটেনশনে ফাইল ঠিকমতো খোলে না, আর প্রোগ্রামের ফাইলের এক্সটেনশন একদম ঠিক হতে হয়।',
      'এক্সটেনশন দেখতে: Windows-এ View → Show → File name extensions; Mac-এ Finder → Settings → Advanced → Show all filename extensions।',
      'পথ হলো ফাইলের ঠিকানা। Windows: C:\\Users\\Anika\\Documents (ব্যাকস্ল্যাশ)। Mac: /Users/anika/Documents (স্ল্যাশ)। .. মানে এক ধাপ ওপরের ফোল্ডার।',
      'সম্পূর্ণ পথ শুরু (C: বা /) থেকে লেখা; আপেক্ষিক পথ “এখন যে ফোল্ডারে আছি” সেখান থেকে।',
      'নিজের কাজের ফোল্ডার ও ফাইলের নাম ইংরেজিতে, ফাঁকা জায়গা ছাড়া রাখুন — প্রোগ্রামিংয়ে সুবিধা।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'ফাইল এক্সপ্লোরার (Windows) বা ফাইন্ডার (Mac) খুলুন। Documents, Downloads, Pictures আর Desktop ফোল্ডারে একবার করে ঢুকে দেখুন, ভেতরে কী কী আছে। কিছু মুছবেন বা সরাবেন না — শুধু দেখুন।',
      'Documents-এর ভেতরে MyWork নামে একটি নতুন ফোল্ডার বানান। তার ভেতরে একটি লেখার ফাইল বানান বা সেভ করুন (Windows-এ New → Text Document)। তারপর ফাইলটির নাম বদলে ideas.txt করুন।',
      'আপনার কম্পিউটারে যেকোনো একটি ফাইল খুলে তার পুরো পথ (ঠিকানা) পড়ে খাতায় লিখুন — প্রথমে ড্রাইভ বা রুট, তারপর ফোল্ডারগুলো, সবশেষে ফাইলের নাম।',
    ],
    windowsTasksBn: ['আপনার Windows কম্পিউটারে ফাইল এক্সপ্লোরারের ওপরে View → Show → File name extensions-এ টিক দিন। তারপর কয়েকটি ফাইলের নামের শেষে এক্সটেনশন দেখুন। (শুধু দেখুন, এখনই কোনো এক্সটেনশন বদলাবেন না।)'],
    macTasksBn: ['আপনার Mac-এ মেনু বারে Finder → Settings (পুরোনো macOS-এ Preferences) → Advanced খুলে “Show all filename extensions” চালু করুন। তারপর কয়েকটি ফাইলের নামের শেষে এক্সটেনশন দেখুন। (এখনই কোনো এক্সটেনশন বদলাবেন না।)'],
  },

  teacherTipBn:
    'পথ (path) বোঝা প্রোগ্রামিংয়ের জন্য খুবই গুরুত্বপূর্ণ — পরে টার্মিনাল আর কোড এডিটরে বারবার লাগবে। ঠিকানার উপমা (দেশ → জেলা → থানা → গ্রাম → বাড়ি) ধরে কয়েকবার বলুন। শুরুতেই আসল কম্পিউটারে এক্সটেনশন দেখা চালু করিয়ে দিন, আর বোঝান যে নাম বদলানোর সময় .txt, .py, .html যেন অক্ষত থাকে। অনুশীলনে আসল গুরুত্বপূর্ণ ফাইল কপি করে তার ওপর হাত পাকাতে বলুন, মূল ফাইলে নয়। নিজের কাজের ফোল্ডারের নাম ইংরেজিতে ও ফাঁকা জায়গা ছাড়া রাখার অভ্যাস এখনই করান। প্রসঙ্গত, এই পাঠে ধাপ বেশি — দরকার হলে দুই বসায় ভাগ করে নিন; অগ্রগতি ধাপ ধরে ধরে জমা থাকে।',
}

export default lesson
