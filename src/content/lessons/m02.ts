import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 2,
  part: 1,
  id: 'm02',
  titleBn: 'ডেস্কটপ ও স্ক্রিন',
  oneLineBn: 'পর্দায় যা দেখা যায় তা চিনি — আইকন, টাস্কবার/ডক, ক্লিক, ডাবল ক্লিক, ড্র্যাগ।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['desktop', 'icon', 'click', 'double-click', 'right-click', 'drag-drop', 'taskbar', 'start-menu', 'dock', 'launchpad', 'menu-bar', 'context-menu', 'folder', 'system-tray'],

  explanation: [
    { kind: 'p', textBn: 'কম্পিউটার চালু করলে প্রথমে যে পর্দাটি দেখা যায়, তার নাম ডেস্কটপ (Desktop)। এখান থেকেই আপনি সব কাজ শুরু করবেন।' },
    { kind: 'analogy', textBn: 'ডেস্কটপ হলো আপনার পড়ার টেবিলের মতো। টেবিলের ওপর যেমন খাতা, কলম আর দরকারি জিনিস সাজানো থাকে, ডেস্কটপেও তেমনি ছোট ছোট ছবি সাজানো থাকে। এই ছবিগুলোকে বলে আইকন (Icon)।' },
    { kind: 'p', textBn: 'পর্দার একপাশে একটি লম্বা বার থাকে, যেখান থেকে সব প্রোগ্রাম খুঁজে পাওয়া যায় আর যেটা বলে দেয় এখন কোন কোন প্রোগ্রাম চালু আছে।' },
    {
      kind: 'list',
      itemsBn: [
        'Windows কম্পিউটারে: নিচে থাকে টাস্কবার (Taskbar)। তার মাঝখানে বা বাঁ দিকে থাকে স্টার্ট (Start) বোতাম, ডান দিকে থাকে ঘড়ি, ওয়াই-ফাই আর আওয়াজের চিহ্ন।',
        'Mac কম্পিউটারে: ওপরে থাকে মেনু বার (Menu Bar), যেখানে ডান দিকে ঘড়ি আর ওয়াই-ফাই দেখা যায়। নিচে থাকে ডক (Dock) — প্রোগ্রামের আইকনের সারি। সব প্রোগ্রাম একসাথে দেখতে লঞ্চপ্যাড (Launchpad)।',
      ],
    },
    { kind: 'p', textBn: 'মাউস বা টাচপ্যাড দিয়ে আপনি চারটি কাজ করবেন। এগুলোই কম্পিউটার চালানোর আসল ভিত্তি:' },
    {
      kind: 'list',
      itemsBn: [
        'ক্লিক (Click): একবার চাপা — কোনো কিছু বেছে নেওয়ার জন্য।',
        'ডাবল ক্লিক (Double Click): পরপর দুবার তাড়াতাড়ি চাপা — কোনো কিছু খোলার জন্য।',
        'রাইট ক্লিক (Right Click): ডান দিকের বোতামে চাপা — সেখানে কী কী করা যায় তার তালিকা (মেনু) দেখার জন্য। ল্যাপটপে টাচপ্যাডে দুই আঙুল দিয়ে একবার ট্যাপ করলেও হয়।',
        'ড্র্যাগ অ্যান্ড ড্রপ (Drag and Drop): কিছু একটা ধরে টেনে নিয়ে অন্য জায়গায় ছেড়ে দেওয়া — জিনিস সরানোর জন্য।',
      ],
    },
    { kind: 'note', textBn: 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — রং, আইকনের আকার বা জায়গা অন্যরকম হতে পারে। চিন্তা নেই, কাজ একই থাকে।' },
  ],

  steps: [
    // ---------- Windows ----------
    {
      id: 'w-tour-desktop', osVariant: 'windows', titleBn: 'এটাই ডেস্কটপ', target: 'desktop', expectedAction: { type: 'continue' },
      explanationBn: 'এই পুরো পর্দাটিই ডেস্কটপ। বাঁ দিকে আইকনগুলো দেখুন — রিসাইকেল বিন (Recycle Bin) আর কয়েকটি ফাইল-ফোল্ডার। কোনো তাড়া নেই, ভালো করে দেখে নিন।',
      hintBn: 'নিচের “বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'w-tour-taskbar', osVariant: 'windows', titleBn: 'নিচের লম্বা বার — টাস্কবার', target: 'taskbar', expectedAction: { type: 'continue' },
      explanationBn: 'পর্দার একদম নিচের এই লম্বা বারটির নাম টাস্কবার (Taskbar)। এখানে প্রোগ্রামের আইকন, স্টার্ট বোতাম আর ডান দিকে ঘড়ি দেখা যায়।',
      hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'w-select', osVariant: 'windows', titleBn: 'একবার ক্লিক: বেছে নেওয়া', target: 'icon-Welcome.txt', expectedAction: { type: 'click', target: 'icon-Welcome.txt' },
      explanationBn: 'চিহ্ন দেওয়া “Welcome.txt” আইকনটির ওপর মাউসের তীর নিয়ে গিয়ে বাঁ বোতামে একবার ক্লিক করুন। আইকনটি হালকা রঙে ঘেরা হলে বুঝবেন বাছাই হয়েছে।',
      hintBn: 'বাঁ দিকের বোতামে শুধু একবার চাপুন। দুবার নয়।',
      simplerBn: 'মাউসের তীরটি আইকনের ওপর রাখুন। তারপর বাঁ দিকের বোতামটি একবার “টুক” করে চাপুন।',
    },
    {
      id: 'w-open', osVariant: 'windows', titleBn: 'ডাবল ক্লিক: খোলা', target: 'icon-Welcome.txt', expectedAction: { type: 'doubleClick', target: 'icon-Welcome.txt' },
      explanationBn: 'এবার একই আইকনে পরপর দুবার তাড়াতাড়ি ক্লিক করুন — “টুক-টুক”। তাহলে ফাইলটি খুলে যাবে।',
      hintBn: 'দুবার চাপার মাঝে বেশি সময় নেবেন না। না হলে কম্পিউটার ভাববে দুটি আলাদা ক্লিক।',
      simplerBn: 'মাউসের বাঁ বোতাম আঙুল দিয়ে দুবার চটপট চাপুন। প্রথমবারে না হলে আবার চেষ্টা করুন — সবারই প্রথমে একটু সময় লাগে।',
    },
    {
      id: 'w-close', osVariant: 'windows', titleBn: 'উইন্ডো বন্ধ করা', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
      explanationBn: 'ফাইলটি Notepad নামের একটি প্রোগ্রামে খুলেছে। Windows-এ উইন্ডোর ডান ওপরের কোণে ✕ বোতাম থাকে। সেটি চাপলে উইন্ডো বন্ধ হয়।',
      hintBn: 'উইন্ডোর একদম ডান ওপরের কোণের ✕ চিহ্নটি খুঁজুন।',
    },
    {
      id: 'w-rightclick', osVariant: 'windows', titleBn: 'রাইট ক্লিক: মেনু দেখা', target: 'desktop', expectedAction: { type: 'rightClick', target: 'desktop' },
      explanationBn: 'ডেস্কটপের যেকোনো ফাঁকা জায়গায় মাউসের ডান বোতামে একবার ক্লিক করুন। একটি তালিকা (মেনু) আসবে।',
      hintBn: 'আইকনগুলো থেকে দূরে, ফাঁকা জায়গায় ডান বোতাম চাপুন। ল্যাপটপে দুই আঙুলে একবার ট্যাপ করুন।',
    },
    {
      id: 'w-new', osVariant: 'windows', titleBn: 'মেনু থেকে “New” বেছে নিন', target: 'ctx-new', expectedAction: { type: 'click', target: 'ctx-new' },
      explanationBn: 'মেনুতে “New” লেখাটির ওপর ক্লিক করুন। “New” মানে নতুন কিছু বানানো।',
      hintBn: 'মেনুর মাঝের দিকে “New” লেখাটি খুঁজুন।',
    },
    {
      id: 'w-folder', osVariant: 'windows', titleBn: 'নতুন ফোল্ডার বানান', target: 'ctx-folder', expectedAction: { type: 'click', target: 'ctx-folder' },
      explanationBn: 'এবার “Folder” লেখাটিতে ক্লিক করুন। ফোল্ডার (Folder) হলো ফাইল সাজিয়ে রাখার একটি জায়গা, আলমারির তাকের মতো।',
      hintBn: 'ডান পাশে নতুন একটি ছোট তালিকা এসেছে, তার প্রথম লাইন “Folder”।',
    },
    {
      id: 'w-name', osVariant: 'windows', titleBn: 'ফোল্ডারের নাম দিন', target: 'rename-input', expectedAction: { type: 'rename' },
      explanationBn: 'নতুন ফোল্ডারটির নাম লেখার ঘর খোলা আছে। কিবোর্ডে একটি নাম লিখুন (যেমন: Photos) এবং Enter চাপুন।',
      hintBn: 'আগের নামটি মুছে নতুন নাম লিখতে হবে। নাম লেখা হলে কিবোর্ডের Enter বোতাম চাপুন।',
      simplerBn: 'নীল রঙে ঘেরা ঘরে সরাসরি লিখতে শুরু করুন — পুরোনো নাম নিজেই মুছে যাবে। শেষে Enter চাপুন।',
    },
    {
      id: 'w-drag', osVariant: 'windows', titleBn: 'ড্র্যাগ অ্যান্ড ড্রপ', target: 'icon-Welcome.txt', expectedAction: { type: 'drag', target: 'icon-Welcome.txt', dropTarget: 'icon-Practice' },
      explanationBn: '“Welcome.txt” আইকনের ওপর বাঁ বোতাম চেপে ধরে রাখুন, ধরা অবস্থায় টেনে “Practice” ফোল্ডারের ওপর নিয়ে যান, তারপর বোতাম ছেড়ে দিন। ফাইলটি ফোল্ডারের ভেতরে চলে যাবে।',
      hintBn: 'বোতাম ছাড়বেন না — যতক্ষণ না “Practice” ফোল্ডারের ওপরে পৌঁছান। তারপর ছাড়ুন।',
      simplerBn: 'বাঁ বোতাম চেপে ধরে রেখে মাউস সরান, যেন ফাইলটি আপনার সাথে সাথে চলছে। ফোল্ডারের ওপর পৌঁছে বোতাম ছেড়ে দিন।',
    },
    {
      id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট বোতাম', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'এবার টাস্কবারের স্টার্ট (Start) বোতামে ক্লিক করুন। এটি সব প্রোগ্রামের সূচিপত্রের মতো।',
      hintBn: 'টাস্কবারের মাঝখানে (বা একদম বাঁ দিকে) চারটি ছোট গোল বিন্দু দিয়ে আঁকা বোতামটি।',
    },
    {
      id: 'w-start-app', osVariant: 'windows', titleBn: 'প্রোগ্রাম চালু করা', target: 'start-app-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'তালিকা থেকে “File Explorer” খুঁজে তাতে ক্লিক করুন। এটি এমন একটি প্রোগ্রাম, যা দিয়ে কম্পিউটারের সব ফাইল-ফোল্ডার দেখা যায়।',
      hintBn: 'হলুদ ফোল্ডারের মতো আইকন আর নিচে “File Explorer” লেখা।',
    },
    {
      id: 'w-minimize', osVariant: 'windows', titleBn: 'উইন্ডো ছোট করে নামিয়ে রাখা', target: 'win-files-minimize', expectedAction: { type: 'click', target: 'win-files-minimize' },
      explanationBn: 'উইন্ডোর ডান ওপরের কোণে ✕ বোতামের পাশে “—” চিহ্নের বোতামটি চাপুন। উইন্ডো বন্ধ হবে না, শুধু নিচে নেমে যাবে।',
      hintBn: 'ডান ওপরের তিনটি বোতামের একদম বাঁ দিকেরটি, যার ওপর একটি ছোট দাগ।',
    },
    {
      id: 'w-taskbar-back', osVariant: 'windows', titleBn: 'টাস্কবার থেকে ফিরিয়ে আনা', target: 'taskbar-app-files', expectedAction: { type: 'click', target: 'taskbar-app-files' },
      explanationBn: 'চালু প্রোগ্রামের আইকন টাস্কবারে থেকে যায়। সেই File Explorer আইকনে ক্লিক করলে উইন্ডোটি আবার ফিরে আসবে।',
      hintBn: 'টাস্কবারে ফোল্ডারের মতো আইকনটির নিচে একটি ছোট দাগ আছে — সেটিতে ক্লিক করুন।',
    },
    {
      id: 'w-close-files', osVariant: 'windows', titleBn: 'আবার বন্ধ করুন', target: 'win-files-close', expectedAction: { type: 'click', target: 'win-files-close' },
      explanationBn: 'কাজ শেষ, তাই উইন্ডোর ✕ বোতামে ক্লিক করে বন্ধ করে দিন।',
      hintBn: 'উইন্ডোর ডান ওপরের কোণের ✕ চিহ্ন।',
    },
    {
      id: 'w-tray', osVariant: 'windows', titleBn: 'ডান কোণের ছোট চিহ্নগুলো', target: 'tray-wifi', expectedAction: { type: 'click', target: 'tray-wifi' },
      explanationBn: 'টাস্কবারের ডান কোণে ওয়াই-ফাই, আওয়াজ, ব্যাটারির চিহ্ন আর ঘড়ি আছে। ওয়াই-ফাই চিহ্নে ক্লিক করে দেখুন — দ্রুত বদলানোর কিছু বোতাম আসবে।',
      hintBn: 'ডান কোণে তিনটি ছোট চিহ্নের একদম বাঁ দিকেরটি, যেটি দেখতে তরঙ্গের মতো।',
    },
    {
      id: 'w-tray-close', osVariant: 'windows', titleBn: 'ফাঁকা জায়গায় ক্লিক করে বন্ধ করুন', target: 'desktop', expectedAction: { type: 'click', target: 'desktop' },
      explanationBn: 'কোনো ছোট বাক্স খুলে গেলে ডেস্কটপের ফাঁকা জায়গায় একবার ক্লিক করলেই সেটি বন্ধ হয়ে যায়। চেষ্টা করুন।',
      hintBn: 'আইকন বা উইন্ডো নেই এমন যেকোনো ফাঁকা জায়গায় একবার ক্লিক করুন।',
    },

    // ---------- Mac ----------
    {
      id: 'm-tour-desktop', osVariant: 'mac', titleBn: 'এটাই ডেস্কটপ', target: 'desktop', expectedAction: { type: 'continue' },
      explanationBn: 'এই পুরো পর্দাটিই ডেস্কটপ। ডান দিকে ওপরে আইকনগুলো দেখুন — কয়েকটি ফাইল-ফোল্ডার। কোনো তাড়া নেই, ভালো করে দেখে নিন।',
      hintBn: 'নিচের “বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'm-tour-dock', osVariant: 'mac', titleBn: 'নিচের আইকনের সারি — ডক', target: 'dock', expectedAction: { type: 'continue' },
      explanationBn: 'পর্দার নিচের এই আইকনের সারিটির নাম ডক (Dock)। এখানে প্রিয় প্রোগ্রামগুলো সাজানো থাকে। পর্দার একদম ওপরের বারটির নাম মেনু বার (Menu Bar)।',
      hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'm-select', osVariant: 'mac', titleBn: 'একবার ক্লিক: বেছে নেওয়া', target: 'icon-Welcome.txt', expectedAction: { type: 'click', target: 'icon-Welcome.txt' },
      explanationBn: 'চিহ্ন দেওয়া “Welcome.txt” আইকনটির ওপর তীর নিয়ে গিয়ে একবার ক্লিক করুন। বাছাই হলে নামটি নীল রঙে ঘেরা দেখাবে।',
      hintBn: 'টাচপ্যাডে একবার চাপুন (বা মাউসের বোতামে একবার)। দুবার নয়।',
      simplerBn: 'তীরটি আইকনের ওপর রাখুন। তারপর টাচপ্যাডে আঙুল দিয়ে একবার “টুক” করে চাপুন।',
    },
    {
      id: 'm-open', osVariant: 'mac', titleBn: 'ডাবল ক্লিক: খোলা', target: 'icon-Welcome.txt', expectedAction: { type: 'doubleClick', target: 'icon-Welcome.txt' },
      explanationBn: 'এবার একই আইকনে পরপর দুবার তাড়াতাড়ি ক্লিক করুন — “টুক-টুক”। তাহলে ফাইলটি খুলে যাবে।',
      hintBn: 'দুবার চাপার মাঝে বেশি সময় নেবেন না।',
      simplerBn: 'আঙুল দিয়ে টাচপ্যাডে দুবার চটপট চাপুন। প্রথমবারে না হলে আবার চেষ্টা করুন — সবারই প্রথমে একটু সময় লাগে।',
    },
    {
      id: 'm-close', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করা', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
      explanationBn: 'ফাইলটি TextEdit নামের একটি প্রোগ্রামে খুলেছে। Mac-এ উইন্ডোর বাঁ ওপরের কোণে তিনটি গোল বোতাম থাকে। লাল বোতামটি উইন্ডো বন্ধ করে।',
      hintBn: 'উইন্ডোর বাঁ ওপরের কোণে তিনটি রঙিন বিন্দুর মধ্যে লালটি।',
    },
    {
      id: 'm-rightclick', osVariant: 'mac', titleBn: 'রাইট ক্লিক: মেনু দেখা', target: 'desktop', expectedAction: { type: 'rightClick', target: 'desktop' },
      explanationBn: 'ডেস্কটপের যেকোনো ফাঁকা জায়গায় দুই আঙুল দিয়ে টাচপ্যাডে একবার ট্যাপ করুন (বা মাউসের ডান বোতাম চাপুন)। একটি তালিকা (মেনু) আসবে।',
      hintBn: 'আইকনগুলো থেকে দূরে, ফাঁকা জায়গায় দুই আঙুলে একবার ট্যাপ করুন।',
    },
    {
      id: 'm-folder', osVariant: 'mac', titleBn: 'নতুন ফোল্ডার বানান', target: 'ctx-new-folder', expectedAction: { type: 'click', target: 'ctx-new-folder' },
      explanationBn: 'মেনুর প্রথম লাইন “New Folder”-এ ক্লিক করুন। ফোল্ডার (Folder) হলো ফাইল সাজিয়ে রাখার একটি জায়গা, আলমারির তাকের মতো।',
      hintBn: 'মেনুর একদম ওপরের লাইন।',
    },
    {
      id: 'm-name', osVariant: 'mac', titleBn: 'ফোল্ডারের নাম দিন', target: 'rename-input', expectedAction: { type: 'rename' },
      explanationBn: 'নতুন ফোল্ডারটির নাম লেখার ঘর খোলা আছে। কিবোর্ডে একটি নাম লিখুন (যেমন: Photos) এবং Return চাপুন।',
      hintBn: 'আগের নামটি মুছে নতুন নাম লিখতে হবে। শেষে কিবোর্ডের Return বোতাম চাপুন।',
      simplerBn: 'নীল রঙে ঘেরা ঘরে সরাসরি লিখতে শুরু করুন — পুরোনো নাম নিজেই মুছে যাবে। শেষে Return চাপুন।',
    },
    {
      id: 'm-drag', osVariant: 'mac', titleBn: 'ড্র্যাগ অ্যান্ড ড্রপ', target: 'icon-Welcome.txt', expectedAction: { type: 'drag', target: 'icon-Welcome.txt', dropTarget: 'icon-Practice' },
      explanationBn: '“Welcome.txt” আইকনটি আঙুল দিয়ে চেপে ধরে (টাচপ্যাডে চেপে ধরে অন্য আঙুল দিয়ে সরান, বা মাউসের বোতাম চেপে ধরে) টেনে “Practice” ফোল্ডারের ওপর নিয়ে যান, তারপর ছেড়ে দিন।',
      hintBn: 'ছাড়বেন না — যতক্ষণ না “Practice” ফোল্ডারের ওপরে পৌঁছান। তারপর ছাড়ুন।',
      simplerBn: 'চেপে ধরে রেখে সরান, যেন ফাইলটি আপনার সাথে সাথে চলছে। ফোল্ডারের ওপর পৌঁছে ছেড়ে দিন।',
    },
    {
      id: 'm-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
      explanationBn: 'ডকের রঙিন বর্গের মতো আইকনটি হলো লঞ্চপ্যাড (Launchpad) — সব প্রোগ্রামের সূচিপত্র। সেটিতে ক্লিক করুন।',
      hintBn: 'ডকের মধ্যে ছোট ছোট রঙিন বর্গ দিয়ে সাজানো আইকনটি।',
    },
    {
      id: 'm-launchpad-app', osVariant: 'mac', titleBn: 'প্রোগ্রাম চালু করা', target: 'launchpad-app-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'তালিকা থেকে “Finder” খুঁজে তাতে ক্লিক করুন। এটি এমন একটি প্রোগ্রাম, যা দিয়ে কম্পিউটারের সব ফাইল-ফোল্ডার দেখা যায়।',
      hintBn: 'নীল-সাদা মুখের মতো আইকন আর নিচে “Finder” লেখা।',
    },
    {
      id: 'm-minimize', osVariant: 'mac', titleBn: 'উইন্ডো নামিয়ে রাখা', target: 'win-files-minimize', expectedAction: { type: 'click', target: 'win-files-minimize' },
      explanationBn: 'উইন্ডোর বাঁ ওপরের কোণের হলুদ বোতামটি চাপুন। উইন্ডো বন্ধ হবে না, শুধু ডকে নেমে যাবে।',
      hintBn: 'তিনটি বিন্দুর মাঝেরটি — হলুদ।',
    },
    {
      id: 'm-dock-back', osVariant: 'mac', titleBn: 'ডক থেকে ফিরিয়ে আনা', target: 'dock-files', expectedAction: { type: 'click', target: 'dock-files' },
      explanationBn: 'চালু প্রোগ্রামের আইকনের নিচে ছোট একটি বিন্দু থাকে। ডকের সেই Finder আইকনে ক্লিক করলে উইন্ডোটি আবার ফিরে আসবে।',
      hintBn: 'ডকের একদম বাঁ দিকের নীল-সাদা মুখের মতো আইকনটি।',
    },
    {
      id: 'm-close-files', osVariant: 'mac', titleBn: 'আবার বন্ধ করুন', target: 'win-files-close', expectedAction: { type: 'click', target: 'win-files-close' },
      explanationBn: 'কাজ শেষ, তাই লাল বোতামে ক্লিক করে উইন্ডো বন্ধ করে দিন।',
      hintBn: 'বাঁ ওপরের কোণের লাল বিন্দু।',
    },
    {
      id: 'm-control', osVariant: 'mac', titleBn: 'ওপরের ডান কোণের ছোট চিহ্নগুলো', target: 'control-center', expectedAction: { type: 'click', target: 'control-center' },
      explanationBn: 'মেনু বারের ডান দিকে ওয়াই-ফাই, ব্যাটারি আর ঘড়ি থাকে। দুটি ছোট সুইচের মতো চিহ্নটিতে (কন্ট্রোল সেন্টার) ক্লিক করে দেখুন — আওয়াজ, উজ্জ্বলতা দ্রুত বদলানো যায়।',
      hintBn: 'মেনু বারের ডান দিকে ঘড়ির একটু আগে দুটি ছোট সুইচের মতো চিহ্ন।',
    },
    {
      id: 'm-control-close', osVariant: 'mac', titleBn: 'ফাঁকা জায়গায় ক্লিক করে বন্ধ করুন', target: 'desktop', expectedAction: { type: 'click', target: 'desktop' },
      explanationBn: 'কোনো ছোট বাক্স খুলে গেলে ডেস্কটপের ফাঁকা জায়গায় একবার ক্লিক করলেই সেটি বন্ধ হয়ে যায়। চেষ্টা করুন।',
      hintBn: 'আইকন বা উইন্ডো নেই এমন যেকোনো ফাঁকা জায়গায় একবার ক্লিক করুন।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'এখানে কেউ বলে দেবে না — আপনি যা খুশি করে দেখুন। ভুল হলেও কোনো ক্ষতি নেই, “রিসেট” চাপলেই সব আবার প্রথমের মতো হয়ে যাবে।',
    checklistBn: [
      'একটি আইকনে ডাবল ক্লিক করে প্রোগ্রাম খুলেছি',
      'ডেস্কটপে রাইট ক্লিক করে নতুন ফোল্ডার বানিয়েছি',
      'একটি আইকন টেনে ফোল্ডারে ঢুকিয়েছি',
      'একটি উইন্ডো ছোট (নামিয়ে) করে আবার ফিরিয়ে এনেছি',
    ],
  },

  quiz: [
    {
      id: 'q-folder', type: 'clickTarget', questionBn: 'নিচের কোনটি ফোল্ডারের আইকন?',
      items: [
        { id: 'file', labelBn: 'লেখার ফাইল', icon: '📄' },
        { id: 'folder', labelBn: 'ফোল্ডার', icon: '📁' },
        { id: 'photo', labelBn: 'ছবি', icon: '🖼️' },
        { id: 'music', labelBn: 'গান', icon: '🎵' },
      ],
      correct: 'folder',
      hintBn: 'ফাইল সাজিয়ে রাখার জায়গাটি দেখতে অনেকটা আলমারির তাক বা হলুদ ফোল্ডারের মতো।',
      explanationBn: 'ঠিক! ফোল্ডার হলো ফাইল রাখার জায়গা। ভেতরে আরও ফোল্ডার বা ফাইল রাখা যায়।',
    },
    {
      id: 'q-double', type: 'multipleChoice', questionBn: 'ডেস্কটপের কোনো আইকন খুলতে (চালু করতে) কী করতে হয়?',
      options: [
        { id: 'a', textBn: 'একবার ক্লিক' },
        { id: 'b', textBn: 'ডাবল ক্লিক (পরপর দুবার তাড়াতাড়ি ক্লিক)' },
        { id: 'c', textBn: 'শুধু রাইট ক্লিক' },
        { id: 'd', textBn: 'পর্দা ধরে ঝাঁকানো' },
      ],
      correct: ['b'],
      hintBn: 'একবার ক্লিক শুধু বেছে নেয়। খুলতে হলে আরেকটু বেশি কিছু লাগে।',
      explanationBn: 'ডাবল ক্লিক করলে আইকনটি খোলে। একবার ক্লিকে শুধু বাছাই হয়।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'কাজের সাথে তার মানে মিলিয়ে দিন।',
      pairs: [
        { id: 'click', leftBn: 'একবার ক্লিক', rightBn: 'বেছে নেওয়া' },
        { id: 'dbl', leftBn: 'ডাবল ক্লিক', rightBn: 'খোলা' },
        { id: 'right', leftBn: 'রাইট ক্লিক', rightBn: 'অপশনের মেনু দেখা' },
        { id: 'drag', leftBn: 'ড্র্যাগ অ্যান্ড ড্রপ', rightBn: 'ধরে টেনে সরানো' },
      ],
      hintBn: 'প্রতিটির নামের মধ্যেই ইঙ্গিত আছে। যেমন “ড্র্যাগ” মানে টানা।',
      explanationBn: 'চারটি কাজই মিলে গেছে! এই চারটি দিয়েই কম্পিউটারের বেশিরভাগ কাজ হয়।',
    },
    {
      id: 'q-win-taskbar', osVariant: 'windows', type: 'multipleChoice', questionBn: 'Windows কম্পিউটারে এখন কোন কোন প্রোগ্রাম চালু আছে তা কোথায় দেখা যায়?',
      options: [
        { id: 'a', textBn: 'নিচের লম্বা বার — টাস্কবারে' },
        { id: 'b', textBn: 'ডেস্কটপের ঠিক মাঝখানে' },
        { id: 'c', textBn: 'মাউসের ওপরে' },
      ],
      correct: ['a'],
      hintBn: 'পর্দার নিচের দিকে একটি লম্বা বার থাকে, যেখানে ঘড়িও দেখা যায়।',
      explanationBn: 'টাস্কবারে চালু প্রোগ্রামের আইকন থাকে। আইকনে ক্লিক করে উইন্ডো ফিরিয়ে আনা যায়।',
    },
    {
      id: 'q-mac-dock', osVariant: 'mac', type: 'multipleChoice', questionBn: 'Mac কম্পিউটারে পর্দার নিচের আইকনের সারিটির নাম কী?',
      options: [
        { id: 'a', textBn: 'টাস্কবার' },
        { id: 'b', textBn: 'ডক (Dock)' },
        { id: 'c', textBn: 'রিসাইকেল বিন' },
      ],
      correct: ['b'],
      hintBn: 'জাহাজ যেখানে নোঙর করে, সেই জায়গার নামে এর নাম।',
      explanationBn: 'ঠিক! ডকে প্রিয় প্রোগ্রামের আইকন থাকে, আর চালু প্রোগ্রামের নিচে ছোট বিন্দু থাকে।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'ডেস্কটপে নতুন ফোল্ডার বানানোর ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'ডেস্কটপের ফাঁকা জায়গায় রাইট ক্লিক করি' },
        { id: '2', textBn: 'মেনু থেকে নতুন ফোল্ডার (New Folder) বেছে নিই' },
        { id: '3', textBn: 'ফোল্ডারের নাম লিখি' },
        { id: '4', textBn: 'Enter চাপি' },
      ],
      hintBn: 'আগে মেনু আনতে হবে, তারপর মেনু থেকে বেছে নিতে হবে, নাম দিতে হবে একদম শেষে।',
      explanationBn: 'চমৎকার! মেনু আনা → বেছে নেওয়া → নাম লেখা → Enter। এই ক্রম পরে আরও অনেক কাজে কাজে লাগবে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'ডেস্কটপ হলো কম্পিউটারের টেবিল; তার ওপরের ছোট ছবিগুলোর নাম আইকন।',
      'একবার ক্লিক = বেছে নেওয়া। ডাবল ক্লিক = খোলা। রাইট ক্লিক = মেনু। ড্র্যাগ = ধরে টেনে সরানো।',
      'Windows: নিচে টাস্কবার, স্টার্ট বোতাম। উইন্ডো বন্ধ করার বোতাম ডান ওপরে।',
      'Mac: ওপরে মেনু বার, নিচে ডক, প্রোগ্রাম খুঁজতে লঞ্চপ্যাড। উইন্ডো বন্ধ করার বোতাম বাঁ ওপরে।',
      'উইন্ডো ছোট করলে (নামিয়ে রাখলে) সেটি বন্ধ হয় না — টাস্কবার/ডক থেকে ফিরিয়ে আনা যায়।',
      'ভুল হলে ভয় নেই — প্রায় সব কাজই ফিরিয়ে নেওয়া যায়।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'নিজের কম্পিউটারের ডেস্কটপ দেখে বলুন — কয়টি আইকন আছে, আর সেগুলোর নাম কী।',
      'একটি আইকনে একবার ক্লিক করুন (শুধু বাছাই), তারপর ডাবল ক্লিক করে খুলুন। তারপর উইন্ডো বন্ধ করে দিন।',
      'ডেস্কটপের ফাঁকা জায়গায় রাইট ক্লিক করে মেনুটি দেখুন। কিছু বেছে না নিয়ে অন্য কোথাও ক্লিক করে মেনু বন্ধ করুন।',
    ],
    windowsTasksBn: ['স্টার্ট বোতামে ক্লিক করে মেনুটি দেখুন, তারপর আবার ক্লিক করে বন্ধ করুন।'],
    macTasksBn: ['ডকের লঞ্চপ্যাডে ক্লিক করে সব প্রোগ্রাম দেখুন, তারপর ফাঁকা জায়গায় ক্লিক করে বন্ধ করুন।'],
  },

  teacherTipBn:
    'ডাবল ক্লিকে অনেকেরই প্রথমে সমস্যা হয় — দুই ক্লিকের মাঝে বেশি সময় নিলে সেটি দুটি আলাদা ক্লিক হয়ে যায়। ধৈর্য ধরে বারবার অভ্যাস করতে দিন, আর নিজে মাউস ধরে দেখাবেন না — ওঁকে নিজের হাতে করতে দিন। টাচপ্যাডে দুই আঙুলের ট্যাপ (রাইট ক্লিক) আলাদা করে অভ্যাস করানো দরকার। কম্পিউটারের গতি কম মনে হলে সেটিংসে মাউসের ডাবল-ক্লিকের গতি কমিয়ে দেওয়া যায়।',
}

export default lesson
