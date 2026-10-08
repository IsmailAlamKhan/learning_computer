import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 3,
  part: 1,
  id: 'm03',
  titleBn: 'উইন্ডো (Window)',
  oneLineBn: 'প্রোগ্রামের উইন্ডো খোলা, বন্ধ করা, ছোট-বড় করা, সরানো আর এক উইন্ডো থেকে অন্যটিতে যাওয়া।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['window', 'title-bar', 'minimize', 'maximize', 'restore-window', 'close', 'resize', 'switch', 'active-window', 'taskbar-button', 'alt-tab', 'cmd-tab', 'shortcut-pad'],
  setup: { openApps: ['files', 'editor'] },

  explanation: [
    { kind: 'p', textBn: 'কম্পিউটারে কোনো প্রোগ্রাম চালু করলে সেটি পর্দার ওপর একটি চৌকো জায়গায় খোলে। এই জায়গাটির নাম উইন্ডো (Window)। এখানে “Windows” কম্পিউটারের নামের কথা বলা হচ্ছে না — Windows বা Mac, দুই কম্পিউটারেই প্রোগ্রাম নিজের নিজের উইন্ডোতে চলে।' },
    { kind: 'analogy', textBn: 'উইন্ডো মানে ঠিক ঘরের জানালার মতো। জানালা দিয়ে যেমন বাইরের একটি দৃশ্য দেখা যায়, তেমনি উইন্ডো দিয়ে একটি প্রোগ্রামের ভেতরটা দেখা যায়। পড়ার টেবিলে যেমন একসাথে কয়েকটি খাতা খোলা রাখা যায়, তেমনি একসাথে কয়েকটি উইন্ডোও খোলা রাখা যায়। যে খাতাটিতে এখন লিখছেন সেটিই সবার ওপরে থাকে — তার নাম সক্রিয় উইন্ডো (Active Window)।' },
    { kind: 'p', textBn: 'প্রতিটি উইন্ডোর একদম ওপরের লম্বা পট্টির নাম টাইটেল বার (Title Bar)। সেখানে প্রোগ্রাম বা ফাইলের নাম লেখা থাকে। এই টাইটেল বার ধরে টেনে উইন্ডো এদিক-ওদিক সরানো যায়। টাইটেল বারে তিনটি ছোট বোতামও থাকে:' },
    {
      kind: 'list',
      itemsBn: [
        'Windows কম্পিউটারে: বোতামগুলো থাকে ডান ওপরের কোণে। “—” = নামিয়ে রাখা (Minimize), চৌকো ▢ = বড় করা (Maximize) — বড় করা থাকলে সেটি দুটি চৌকোর ছবি হয়ে যায়, তখন চাপলে আগের মাপে ফেরে (Restore) — আর ✕ = বন্ধ করা (Close)।',
        'Mac কম্পিউটারে: বোতামগুলো থাকে বাঁ ওপরের কোণে, তিনটি রঙিন গোল বিন্দু। লাল = বন্ধ করা (Close), হলুদ = নামিয়ে রাখা (Minimize), সবুজ = বড় করা (Zoom)। মাউস বিন্দুগুলোর ওপর নিলে ভেতরের চিহ্ন ফুটে ওঠে।',
      ],
    },
    { kind: 'note', textBn: 'সহজে মনে রাখার উপায়: Windows-এ বন্ধ করার বোতাম ডানদিকে (লাল হয়ে ওঠে), আর Mac-এ বাঁ দিকে (লাল বিন্দু)। আসল Mac-এ সবুজ বোতাম অনেক সময় উইন্ডোকে পুরো পর্দা (Full Screen) করে দেয় — আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে। আমাদের নকল কম্পিউটারে সবুজ বোতাম উইন্ডো বড়-ছোট করে।' },
    { kind: 'p', textBn: 'উইন্ডো নিয়ে আপনি এই কাজগুলো শিখবেন:' },
    {
      kind: 'list',
      itemsBn: [
        'সরানো: টাইটেল বার চেপে ধরে টেনে নিয়ে অন্য জায়গায় ছাড়া।',
        'মাপ বদলানো (Resize): উইন্ডোর কিনারা বা কোণা ধরে টানা।',
        'বড় করা ও আগের মাপে ফেরানো: বোতাম চেপে, অথবা টাইটেল বারে ডাবল ক্লিক করে।',
        'নামিয়ে রাখা (Minimize): উইন্ডো বন্ধ হয় না, শুধু নিচে নেমে যায়। টাস্কবার (Windows) বা ডক (Mac) থেকে আবার ফিরিয়ে আনা যায়। নামিয়ে রাখা আর বন্ধ করা এক জিনিস নয়!',
        'এক উইন্ডো থেকে অন্যটিতে যাওয়া: পেছনের উইন্ডোতে ক্লিক করে, বা টাস্কবার/ডকের আইকনে ক্লিক করে, অথবা কিবোর্ডে Windows-এ Alt+Tab আর Mac-এ Cmd+Tab চেপে।',
      ],
    },
    { kind: 'note', textBn: 'আসল কম্পিউটারে ব্রাউজারের ভেতর থেকে Alt+Tab বা Cmd+Tab চাপলে কম্পিউটার নিজেই সেটি ধরে নেয়, তাই এখানকার নকল কম্পিউটারে কাজ নাও করতে পারে। সে জন্য নিচের “⌨ শর্টকাট প্যাড” দেওয়া আছে — ওখানে ক্লিক করেই শর্টকাট চাপতে পারবেন।' },
    { kind: 'note', textBn: 'একটি দরকারি কথা: কোনো লেখা লিখে সেভ (Save) না করেই উইন্ডো বন্ধ করতে গেলে কম্পিউটার জিজ্ঞেস করে — “সেভ করবেন তো?” তখন ভয় পাবেন না, ধীরে পড়ে বেছে নিন। Save চাপলে লেখা থেকে যায়, Don’t Save চাপলে লেখাটি হারিয়ে যায়, আর Cancel চাপলে উইন্ডোটি খোলাই থাকে।' },
  ],

  steps: [
    // ---------- Windows ----------
    {
      id: 'w-tour', osVariant: 'windows', titleBn: 'উইন্ডোর অংশগুলো', target: 'win-files-titlebar', expectedAction: { type: 'continue' },
      explanationBn: 'পর্দায় দুটি উইন্ডো খোলা আছে — File Explorer আর Notepad। ওপরের লম্বা পট্টিটি টাইটেল বার (Title Bar)। ডান কোণে তিনটি বোতাম আছে: নামিয়ে রাখা (—), বড় করা (▢) আর বন্ধ করা (✕)।',
      hintBn: 'নিচের “বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'w-activate', osVariant: 'windows', titleBn: 'পেছনের উইন্ডো সামনে আনা', target: 'win-files-titlebar', expectedAction: { type: 'click', target: 'win-files-titlebar' },
      explanationBn: 'এখন Notepad সামনে আছে, আর File Explorer তার পেছনে। পেছনের File Explorer উইন্ডোর টাইটেল বারে একবার ক্লিক করুন। সেটি সামনে চলে আসবে — এখন সেটিই সক্রিয় উইন্ডো।',
      hintBn: 'পেছনের বড় উইন্ডোর একদম ওপরের পট্টিটির খালি জায়গায় ক্লিক করুন।',
      simplerBn: 'যে উইন্ডোর কিছুটা অংশ দেখা যাচ্ছে, তার ওপরের পট্টিতে মাউস রেখে একবার ক্লিক করুন।',
    },
    {
      id: 'w-move', osVariant: 'windows', titleBn: 'উইন্ডো সরানো', target: 'win-files-titlebar', expectedAction: { type: 'drag', target: 'win-files-titlebar', dropTarget: 'desktop' },
      explanationBn: 'টাইটেল বারের ওপর বাঁ বোতাম চেপে ধরুন, ধরে রেখে মাউস একটু সরান — উইন্ডোও সাথে সাথে সরবে। নতুন জায়গায় এসে বোতাম ছেড়ে দিন।',
      hintBn: 'বোতামটি ছাড়বেন না, যতক্ষণ না উইন্ডো মনমতো জায়গায় আসে। তারপর ছাড়ুন।',
      simplerBn: 'টাইটেল বারের মাঝখানে তীর রেখে বাঁ বোতাম চেপে ধরুন। ধরা অবস্থায় মাউস অল্প সরান — যেন উইন্ডোটি আপনার সাথে হেঁটে যাচ্ছে।',
    },
    {
      id: 'w-resize', osVariant: 'windows', titleBn: 'উইন্ডোর মাপ বদলানো', target: 'win-files-resize-se', expectedAction: { type: 'drag', target: 'win-files-resize-se', dropTarget: 'desktop' },
      explanationBn: 'উইন্ডোর নিচের ডান কোণায় তীর নিলে সেটি তির্যক দু-মুখো তীর হয়ে যায়। এবার বাঁ বোতাম চেপে ধরে কোণাটি টেনে উইন্ডো ছোট বা বড় করুন, তারপর ছেড়ে দিন। যেকোনো কিনারা বা কোণা ধরেই এভাবে মাপ বদলানো যায়।',
      hintBn: 'চিহ্ন দেওয়া ছোট জায়গাটি উইন্ডোর একদম নিচের ডান কোণায়। ওখানে ধরে একটু টানুন।',
      simplerBn: 'উইন্ডোর নিচের ডান কোণায় তীর রাখুন, বাঁ বোতাম চেপে ধরুন, তারপর মাউস সামান্য সরিয়ে ছেড়ে দিন।',
    },
    {
      id: 'w-maximize', osVariant: 'windows', titleBn: 'উইন্ডো বড় করা', target: 'win-files-maximize', expectedAction: { type: 'click', target: 'win-files-maximize' },
      explanationBn: 'ডান ওপরের কোণের মাঝের চৌকো (▢) বোতামে ক্লিক করুন। উইন্ডো পুরো পর্দা জুড়ে বড় হয়ে যাবে।',
      hintBn: 'তিনটি বোতামের মাঝেরটি — একটি ফাঁকা চৌকো।',
    },
    {
      id: 'w-restore', osVariant: 'windows', titleBn: 'আগের মাপে ফেরানো', target: 'win-files-maximize', expectedAction: { type: 'click', target: 'win-files-maximize' },
      explanationBn: 'বড় হওয়ার পর ওই বোতামটির ছবি বদলে দুটি চৌকো হয়ে গেছে। এবার আবার সেটিতে ক্লিক করলে উইন্ডো আগের মাপে ফিরে যাবে (Restore)।',
      hintBn: 'একই জায়গার সেই বোতাম, যেটি এখন দুটি চৌকোর মতো দেখাচ্ছে।',
    },
    {
      id: 'w-dbl-max', osVariant: 'windows', titleBn: 'টাইটেল বারে ডাবল ক্লিক', target: 'win-files-titlebar', expectedAction: { type: 'doubleClick', target: 'win-files-titlebar' },
      explanationBn: 'একটি সহজ উপায় আছে: টাইটেল বারের ফাঁকা জায়গায় পরপর দুবার তাড়াতাড়ি ক্লিক করুন। উইন্ডো বড় হয়ে যাবে।',
      hintBn: 'বোতামের ওপর নয় — টাইটেল বারের ফাঁকা জায়গায় দুবার চটপট ক্লিক করুন।',
      simplerBn: 'ওপরের পট্টির মাঝখানে বাঁ বোতাম দুবার “টুক-টুক” করে চাপুন।',
    },
    {
      id: 'w-dbl-restore', osVariant: 'windows', titleBn: 'আবার ডাবল ক্লিক', target: 'win-files-titlebar', expectedAction: { type: 'doubleClick', target: 'win-files-titlebar' },
      explanationBn: 'আবার একই জায়গায় ডাবল ক্লিক করুন — উইন্ডো আগের মাপে ফিরে আসবে।',
      hintBn: 'টাইটেল বারের ফাঁকা জায়গায় দুবার ক্লিক।',
    },
    {
      id: 'w-minimize', osVariant: 'windows', titleBn: 'উইন্ডো নামিয়ে রাখা', target: 'win-files-minimize', expectedAction: { type: 'click', target: 'win-files-minimize' },
      explanationBn: 'এবার ডান কোণের “—” চিহ্নের বোতামে ক্লিক করুন। উইন্ডোটি অদৃশ্য হয়ে নিচে নেমে যাবে, কিন্তু বন্ধ হবে না — প্রোগ্রাম চালুই থাকবে। নামিয়ে রাখা আর বন্ধ করা এক জিনিস নয়।',
      hintBn: 'তিনটি বোতামের একদম বাঁ দিকেরটি — একটি ছোট দাগ।',
    },
    {
      id: 'w-taskbar-back', osVariant: 'windows', titleBn: 'টাস্কবার থেকে ফিরিয়ে আনা', target: 'taskbar-app-files', expectedAction: { type: 'click', target: 'taskbar-app-files' },
      explanationBn: 'নামিয়ে রাখা উইন্ডো টাস্কবারে (Taskbar) আইকন হয়ে থেকে যায়। টাস্কবারের File Explorer আইকনে ক্লিক করুন — উইন্ডোটি ফিরে আসবে।',
      hintBn: 'পর্দার নিচের টাস্কবারে হলুদ ফোল্ডারের মতো আইকনটি, যার নিচে ছোট দাগ আছে।',
    },
    {
      id: 'w-alttab', osVariant: 'windows', titleBn: 'Alt+Tab: অন্য উইন্ডোতে যাওয়া', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'alt+tab' },
      explanationBn: 'এক উইন্ডো থেকে আগের ব্যবহার করা উইন্ডোতে যাওয়ার শর্টকাট Alt+Tab। নিচের শর্টকাট প্যাডে আগে “Alt” বোতামে ক্লিক করুন, তারপর “Tab” বোতামে ক্লিক করুন। (আসল কম্পিউটারে Alt চেপে ধরে Tab চাপতে হয়।)',
      hintBn: 'প্যাডের ওপরের সারিতে “Alt” বেছে নিন, তারপর নিচের সারি থেকে “Tab”-এ ক্লিক করুন।',
      simplerBn: 'প্রথমে একবার “Alt” লেখা বোতামে ক্লিক করুন — বোতামটি রঙিন হয়ে থাকবে। তারপর “Tab” লেখা বোতামে ক্লিক করুন।',
      teacherTipBn: 'আসল কম্পিউটারে এটি করাতে চাইলে বাঁ হাতের বুড়ো আঙুল দিয়ে Alt চেপে ধরে, তর্জনী দিয়ে Tab চাপতে দেখান।',
    },
    {
      id: 'w-alttab-back', osVariant: 'windows', titleBn: 'আবার Alt+Tab', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'alt+tab' },
      explanationBn: 'পর্দায় লক্ষ্য করুন, সামনের উইন্ডো বদলে গেছে। আবার Alt আর Tab চাপলে আগের উইন্ডোতে ফিরে যাবেন। দুটি উইন্ডোর মধ্যে এভাবে আসা-যাওয়া করা যায়।',
      hintBn: 'আবার প্রথমে “Alt”, তারপর “Tab”।',
    },
    {
      id: 'w-taskbar-switch', osVariant: 'windows', titleBn: 'টাস্কবার দিয়ে উইন্ডো বদল', target: 'taskbar-app-editor', expectedAction: { type: 'click', target: 'taskbar-app-editor' },
      explanationBn: 'টাস্কবারের আইকন দিয়েও উইন্ডো বদলানো যায়। এবার টাস্কবারে Notepad-এর আইকনে ক্লিক করে Notepad উইন্ডোটি সামনে আনুন।',
      hintBn: 'টাস্কবারে ছোট নোটখাতার মতো আইকনটি খুঁজুন।',
    },
    {
      id: 'w-type', osVariant: 'windows', titleBn: 'Notepad-এ কিছু লিখুন', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'hello', ignoreCase: true },
      explanationBn: 'Notepad উইন্ডোর সাদা ঘরে ক্লিক করে ইংরেজিতে hello লিখুন। আমরা এখন সেভ না করে উইন্ডো বন্ধ করলে কী হয় দেখব।',
      hintBn: 'সাদা জায়গায় ক্লিক করে কিবোর্ডে h-e-l-l-o লিখুন।',
    },
    {
      id: 'w-close-unsaved', osVariant: 'windows', titleBn: 'সেভ না করে বন্ধ করতে চাওয়া', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
      explanationBn: 'এবার Notepad-এর ডান ওপরের ✕ বোতামে ক্লিক করুন। উইন্ডো সাথে সাথে বন্ধ হবে না — কম্পিউটার জিজ্ঞেস করবে লেখাটি সেভ করবেন কিনা।',
      hintBn: 'Notepad উইন্ডোর ডান ওপরের কোণের ✕।',
    },
    {
      id: 'w-dont-save', osVariant: 'windows', titleBn: 'বাক্সটি পড়ে বেছে নিন', target: 'dialog-dont-save', expectedAction: { type: 'click', target: 'dialog-dont-save' },
      explanationBn: 'বাক্সে তিনটি বোতাম: Save (লেখা রেখে দেওয়া), Don’t save (লেখা ফেলে দেওয়া), Cancel (বন্ধ করা বাতিল)। আসল কাজে দরকারি লেখা হলে Save চাপবেন। এখন এটি শুধু অনুশীলন, তাই “Don’t save” চাপুন।',
      hintBn: 'মাঝের বোতামটি — “Don’t save”।',
    },
    {
      id: 'w-close-files', osVariant: 'windows', titleBn: 'শেষ উইন্ডোটিও বন্ধ করুন', target: 'win-files-close', expectedAction: { type: 'click', target: 'win-files-close' },
      explanationBn: 'কাজ শেষ। File Explorer উইন্ডোর ডান ওপরের ✕ বোতামে ক্লিক করে সেটিও বন্ধ করে দিন।',
      hintBn: 'ডান ওপরের কোণের ✕ চিহ্ন।',
    },

    // ---------- Mac ----------
    {
      id: 'm-tour', osVariant: 'mac', titleBn: 'উইন্ডোর অংশগুলো', target: 'win-files-titlebar', expectedAction: { type: 'continue' },
      explanationBn: 'পর্দায় দুটি উইন্ডো খোলা আছে — Finder আর TextEdit। ওপরের লম্বা পট্টিটি টাইটেল বার (Title Bar)। বাঁ কোণে তিনটি রঙিন বিন্দু: লাল = বন্ধ করা, হলুদ = নামিয়ে রাখা, সবুজ = বড় করা।',
      hintBn: 'নিচের “বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
    },
    {
      id: 'm-activate', osVariant: 'mac', titleBn: 'পেছনের উইন্ডো সামনে আনা', target: 'win-files-titlebar', expectedAction: { type: 'click', target: 'win-files-titlebar' },
      explanationBn: 'এখন TextEdit সামনে আছে, আর Finder তার পেছনে। পেছনের Finder উইন্ডোর টাইটেল বারে একবার ক্লিক করুন। সেটি সামনে চলে আসবে — এখন সেটিই সক্রিয় উইন্ডো।',
      hintBn: 'পেছনের বড় উইন্ডোর একদম ওপরের পট্টিটির খালি জায়গায় ক্লিক করুন।',
      simplerBn: 'যে উইন্ডোর কিছুটা অংশ দেখা যাচ্ছে, তার ওপরের পট্টিতে তীর রেখে একবার ক্লিক করুন।',
    },
    {
      id: 'm-move', osVariant: 'mac', titleBn: 'উইন্ডো সরানো', target: 'win-files-titlebar', expectedAction: { type: 'drag', target: 'win-files-titlebar', dropTarget: 'desktop' },
      explanationBn: 'টাইটেল বারের ওপর আঙুল চেপে ধরুন (মাউসে বোতাম চেপে ধরুন), ধরে রেখে একটু সরান — উইন্ডোও সাথে সাথে সরবে। নতুন জায়গায় এসে ছেড়ে দিন।',
      hintBn: 'ছাড়বেন না, যতক্ষণ না উইন্ডো মনমতো জায়গায় আসে। তারপর ছাড়ুন।',
      simplerBn: 'টাইটেল বারের মাঝখানে তীর রেখে চেপে ধরুন। ধরা অবস্থায় অল্প সরান — যেন উইন্ডোটি আপনার সাথে হেঁটে যাচ্ছে।',
    },
    {
      id: 'm-resize', osVariant: 'mac', titleBn: 'উইন্ডোর মাপ বদলানো', target: 'win-files-resize-se', expectedAction: { type: 'drag', target: 'win-files-resize-se', dropTarget: 'desktop' },
      explanationBn: 'উইন্ডোর নিচের ডান কোণায় তীর নিলে সেটি তির্যক দু-মুখো তীর হয়ে যায়। এবার সেখানে চেপে ধরে কোণাটি টেনে উইন্ডো ছোট বা বড় করুন, তারপর ছেড়ে দিন। যেকোনো কিনারা বা কোণা ধরেই এভাবে মাপ বদলানো যায়।',
      hintBn: 'চিহ্ন দেওয়া ছোট জায়গাটি উইন্ডোর একদম নিচের ডান কোণায়। ওখানে ধরে একটু টানুন।',
      simplerBn: 'উইন্ডোর নিচের ডান কোণায় তীর রাখুন, চেপে ধরুন, তারপর সামান্য সরিয়ে ছেড়ে দিন।',
    },
    {
      id: 'm-maximize', osVariant: 'mac', titleBn: 'উইন্ডো বড় করা', target: 'win-files-maximize', expectedAction: { type: 'click', target: 'win-files-maximize' },
      explanationBn: 'বাঁ ওপরের কোণের সবুজ বিন্দুতে ক্লিক করুন। উইন্ডো বড় হয়ে যাবে। (আসল Mac-এ সবুজ বোতাম অনেক সময় পুরো পর্দা করে দেয়; আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।)',
      hintBn: 'তিনটি বিন্দুর একদম ডান দিকেরটি — সবুজ।',
    },
    {
      id: 'm-restore', osVariant: 'mac', titleBn: 'আগের মাপে ফেরানো', target: 'win-files-maximize', expectedAction: { type: 'click', target: 'win-files-maximize' },
      explanationBn: 'আবার সবুজ বিন্দুতে ক্লিক করলে উইন্ডো আগের মাপে ফিরে যাবে।',
      hintBn: 'একই সবুজ বিন্দু।',
    },
    {
      id: 'm-dbl-max', osVariant: 'mac', titleBn: 'টাইটেল বারে ডাবল ক্লিক', target: 'win-files-titlebar', expectedAction: { type: 'doubleClick', target: 'win-files-titlebar' },
      explanationBn: 'আরেকটি উপায়: টাইটেল বারের ফাঁকা জায়গায় পরপর দুবার তাড়াতাড়ি ক্লিক করুন। উইন্ডো বড় হয়ে যাবে। (Mac-এর সেটিংসে এটি বদলানো যায়, তাই আপনার কম্পিউটারে একটু আলাদা হতে পারে।)',
      hintBn: 'বিন্দুগুলোর ওপর নয় — টাইটেল বারের ফাঁকা জায়গায় দুবার চটপট ক্লিক করুন।',
      simplerBn: 'ওপরের পট্টির মাঝখানে টাচপ্যাডে দুবার “টুক-টুক” করে চাপুন।',
    },
    {
      id: 'm-dbl-restore', osVariant: 'mac', titleBn: 'আবার ডাবল ক্লিক', target: 'win-files-titlebar', expectedAction: { type: 'doubleClick', target: 'win-files-titlebar' },
      explanationBn: 'আবার একই জায়গায় ডাবল ক্লিক করুন — উইন্ডো আগের মাপে ফিরে আসবে।',
      hintBn: 'টাইটেল বারের ফাঁকা জায়গায় দুবার ক্লিক।',
    },
    {
      id: 'm-minimize', osVariant: 'mac', titleBn: 'উইন্ডো নামিয়ে রাখা', target: 'win-files-minimize', expectedAction: { type: 'click', target: 'win-files-minimize' },
      explanationBn: 'এবার হলুদ বিন্দুতে ক্লিক করুন। উইন্ডোটি নিচে নেমে যাবে, কিন্তু বন্ধ হবে না — প্রোগ্রাম চালুই থাকবে। নামিয়ে রাখা আর বন্ধ করা এক জিনিস নয়।',
      hintBn: 'তিনটি বিন্দুর মাঝেরটি — হলুদ।',
    },
    {
      id: 'm-dock-back', osVariant: 'mac', titleBn: 'ডক থেকে ফিরিয়ে আনা', target: 'dock-files', expectedAction: { type: 'click', target: 'dock-files' },
      explanationBn: 'নামিয়ে রাখা উইন্ডো ডকের (Dock) প্রোগ্রাম-আইকনে ক্লিক করলে ফিরে আসে। ডকের Finder আইকনে ক্লিক করুন।',
      hintBn: 'ডকের নীল-সাদা মুখের মতো আইকনটি, যার নিচে ছোট বিন্দু আছে।',
    },
    {
      id: 'm-cmdtab', osVariant: 'mac', titleBn: 'Cmd+Tab: অন্য প্রোগ্রামে যাওয়া', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'cmd+tab' },
      explanationBn: 'আগে ব্যবহার করা প্রোগ্রামে যাওয়ার শর্টকাট Cmd+Tab (⌘ Command + Tab)। নিচের শর্টকাট প্যাডে আগে “⌘ Command” বোতামে ক্লিক করুন, তারপর “Tab” বোতামে ক্লিক করুন। (আসল কম্পিউটারে ⌘ চেপে ধরে Tab চাপতে হয়।)',
      hintBn: 'প্যাডের ওপরের সারিতে “⌘ Command” বেছে নিন, তারপর নিচের সারি থেকে “Tab”-এ ক্লিক করুন।',
      simplerBn: 'প্রথমে একবার “⌘ Command” লেখা বোতামে ক্লিক করুন — বোতামটি রঙিন হয়ে থাকবে। তারপর “Tab” লেখা বোতামে ক্লিক করুন।',
      teacherTipBn: 'আসল Mac-এ Cmd+Tab প্রোগ্রাম বদলায়, প্রতিটি উইন্ডো নয়। একই প্রোগ্রামের একাধিক উইন্ডোর মধ্যে ঘুরতে Cmd+` (Tab-এর ওপরের কী) চাপতে হয়। এখানে সরল রাখা হয়েছে।',
    },
    {
      id: 'm-cmdtab-back', osVariant: 'mac', titleBn: 'আবার Cmd+Tab', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'cmd+tab' },
      explanationBn: 'পর্দায় লক্ষ্য করুন, সামনের উইন্ডো বদলে গেছে। আবার ⌘ Command আর Tab চাপলে আগের উইন্ডোতে ফিরে যাবেন।',
      hintBn: 'আবার প্রথমে “⌘ Command”, তারপর “Tab”।',
    },
    {
      id: 'm-dock-switch', osVariant: 'mac', titleBn: 'ডক দিয়ে উইন্ডো বদল', target: 'dock-editor', expectedAction: { type: 'click', target: 'dock-editor' },
      explanationBn: 'ডকের আইকন দিয়েও প্রোগ্রাম বদলানো যায়। এবার ডকে TextEdit-এর আইকনে ক্লিক করে TextEdit উইন্ডোটি সামনে আনুন।',
      hintBn: 'ডকে ছোট নোটখাতার মতো আইকনটি খুঁজুন।',
    },
    {
      id: 'm-type', osVariant: 'mac', titleBn: 'TextEdit-এ কিছু লিখুন', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'hello', ignoreCase: true },
      explanationBn: 'TextEdit উইন্ডোর সাদা ঘরে ক্লিক করে ইংরেজিতে hello লিখুন। আমরা এখন সেভ না করে উইন্ডো বন্ধ করলে কী হয় দেখব।',
      hintBn: 'সাদা জায়গায় ক্লিক করে কিবোর্ডে h-e-l-l-o লিখুন।',
    },
    {
      id: 'm-close-unsaved', osVariant: 'mac', titleBn: 'সেভ না করে বন্ধ করতে চাওয়া', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
      explanationBn: 'এবার TextEdit-এর বাঁ ওপরের লাল বিন্দুতে ক্লিক করুন। উইন্ডো সাথে সাথে বন্ধ হবে না — কম্পিউটার জিজ্ঞেস করবে লেখাটি সেভ করবেন কিনা।',
      hintBn: 'TextEdit উইন্ডোর বাঁ ওপরের কোণের লাল বিন্দু।',
    },
    {
      id: 'm-dont-save', osVariant: 'mac', titleBn: 'বাক্সটি পড়ে বেছে নিন', target: 'dialog-dont-save', expectedAction: { type: 'click', target: 'dialog-dont-save' },
      explanationBn: 'বাক্সে তিনটি বোতাম: Save (লেখা রেখে দেওয়া), Don’t Save (লেখা ফেলে দেওয়া), Cancel (বন্ধ করা বাতিল)। আসল কাজে দরকারি লেখা হলে Save চাপবেন। এখন এটি শুধু অনুশীলন, তাই “Don’t Save” চাপুন।',
      hintBn: 'বাক্সের “Don’t Save” লেখা বোতামটি।',
    },
    {
      id: 'm-close-files', osVariant: 'mac', titleBn: 'শেষ উইন্ডোটিও বন্ধ করুন', target: 'win-files-close', expectedAction: { type: 'click', target: 'win-files-close' },
      explanationBn: 'কাজ শেষ। Finder উইন্ডোর বাঁ ওপরের লাল বিন্দুতে ক্লিক করে সেটিও বন্ধ করে দিন।',
      hintBn: 'বাঁ ওপরের কোণের লাল বিন্দু।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'এখানে কেউ বলে দেবে না। একাধিক উইন্ডো খুলুন (Windows-এ স্টার্ট মেনু, Mac-এ লঞ্চপ্যাড থেকে), তারপর সেগুলো সরিয়ে, ছোট-বড় করে পাশাপাশি সাজান। ভুল হলে ক্ষতি নেই, “রিসেট” চাপলেই সব আগের মতো হয়ে যাবে।',
    checklistBn: [
      'কমপক্ষে তিনটি উইন্ডো খুলেছি',
      'একটি উইন্ডো টেনে অন্য জায়গায় সরিয়েছি',
      'একটি উইন্ডোর মাপ কোণা ধরে টেনে বদলেছি',
      'দুটি উইন্ডো পাশাপাশি সাজিয়েছি',
      'একটি উইন্ডো নামিয়ে রেখে আবার ফিরিয়ে এনেছি',
      'শর্টকাট প্যাড দিয়ে Alt+Tab (Mac-এ Cmd+Tab) করে দেখেছি',
    ],
  },

  quiz: [
    {
      id: 'q-close-win', osVariant: 'windows', type: 'clickTarget', questionBn: 'Windows কম্পিউটারে উইন্ডো বন্ধ করার বোতাম কোনটি?',
      items: [
        { id: 'min', labelBn: 'দাগ (—)', icon: '—' },
        { id: 'max', labelBn: 'চৌকো', icon: '▢' },
        { id: 'close', labelBn: 'ক্রস চিহ্ন', icon: '✕' },
      ],
      correct: 'close',
      hintBn: 'বন্ধ করার বোতামটি ডান কোণের একদম শেষে থাকে, আর ওপর দিয়ে মাউস নিলে লাল হয়ে যায়।',
      explanationBn: 'ঠিক! ✕ বোতামটি উইন্ডো বন্ধ করে। “—” শুধু নামিয়ে রাখে, আর চৌকোটি বড়-ছোট করে।',
    },
    {
      id: 'q-close-mac', osVariant: 'mac', type: 'clickTarget', questionBn: 'Mac কম্পিউটারে উইন্ডো বন্ধ করার বোতাম কোনটি?',
      items: [
        { id: 'green', labelBn: 'সবুজ বিন্দু', icon: '🟢' },
        { id: 'yellow', labelBn: 'হলুদ বিন্দু', icon: '🟡' },
        { id: 'red', labelBn: 'লাল বিন্দু', icon: '🔴' },
      ],
      correct: 'red',
      hintBn: 'যে রঙ সাধারণত “থামো” বোঝায়, সেটি। বিন্দুগুলো বাঁ ওপরের কোণে থাকে।',
      explanationBn: 'ঠিক! লাল বিন্দু উইন্ডো বন্ধ করে। হলুদটি শুধু নামিয়ে রাখে, আর সবুজটি বড়-ছোট করে।',
    },
    {
      id: 'q-min', type: 'multipleChoice', questionBn: 'উইন্ডো নামিয়ে রাখলে (Minimize করলে) কী হয়?',
      options: [
        { id: 'a', textBn: 'প্রোগ্রাম বন্ধ হয়ে যায়, সব কাজ মুছে যায়' },
        { id: 'b', textBn: 'উইন্ডোটি নিচে নেমে যায়, প্রোগ্রাম চালুই থাকে; টাস্কবার/ডক থেকে ফিরিয়ে আনা যায়' },
        { id: 'c', textBn: 'কম্পিউটার বন্ধ হয়ে যায়' },
      ],
      correct: ['b'],
      hintBn: 'নামিয়ে রাখা মানে সরিয়ে রাখা, ফেলে দেওয়া নয়। টাস্কবার বা ডকে তার আইকন থেকে যায়।',
      explanationBn: 'ঠিক! নামিয়ে রাখা আর বন্ধ করা আলাদা। নামানো উইন্ডোর কাজ যেমন ছিল তেমনই থাকে।',
    },
    {
      id: 'q-switch-win', osVariant: 'windows', type: 'multipleChoice', questionBn: 'Windows কম্পিউটারে এক উইন্ডো থেকে আগের ব্যবহার করা উইন্ডোতে কিবোর্ড দিয়ে যেতে কোন শর্টকাট?',
      options: [
        { id: 'a', textBn: 'Alt + Tab' },
        { id: 'b', textBn: 'Alt + F' },
        { id: 'c', textBn: 'Ctrl + P' },
      ],
      correct: ['a'],
      hintBn: 'নামের মধ্যে একটি কী-এর নাম “Tab” (কিবোর্ডের বাঁ দিকের লম্বা কী), সাথে Alt।',
      explanationBn: 'ঠিক! Alt চেপে ধরে Tab চাপলে আগের উইন্ডোতে যাওয়া যায়।',
    },
    {
      id: 'q-switch-mac', osVariant: 'mac', type: 'multipleChoice', questionBn: 'Mac কম্পিউটারে এক প্রোগ্রাম থেকে আগের ব্যবহার করা প্রোগ্রামে কিবোর্ড দিয়ে যেতে কোন শর্টকাট?',
      options: [
        { id: 'a', textBn: 'Cmd + Tab' },
        { id: 'b', textBn: 'Cmd + F' },
        { id: 'c', textBn: 'Control + P' },
      ],
      correct: ['a'],
      hintBn: 'নামের মধ্যে একটি কী-এর নাম “Tab”, সাথে ⌘ Command।',
      explanationBn: 'ঠিক! ⌘ Command চেপে ধরে Tab চাপলে আগের প্রোগ্রামে যাওয়া যায়।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'বোতাম বা কাজের সাথে তার ফলাফল মিলিয়ে দিন।',
      pairs: [
        { id: 'move', leftBn: 'টাইটেল বার ধরে টানা', rightBn: 'উইন্ডো সরে যায়' },
        { id: 'resize', leftBn: 'কোণা ধরে টানা', rightBn: 'উইন্ডোর মাপ বদলায়' },
        { id: 'min', leftBn: 'নামিয়ে রাখা (Minimize)', rightBn: 'প্রোগ্রাম চালু থেকে যায়' },
        { id: 'close', leftBn: 'বন্ধ করা (Close)', rightBn: 'উইন্ডো বন্ধ হয়' },
      ],
      hintBn: 'টানলে কিছু একটা সরে বা বদলে যায়। আর নামিয়ে রাখলে প্রোগ্রাম কিন্তু চালুই থাকে।',
      explanationBn: 'চমৎকার! চারটিই ঠিক মিলেছে।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'উইন্ডো সরানোর ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'টাইটেল বারের ওপর তীর রাখি' },
        { id: '2', textBn: 'বাঁ বোতাম (বা আঙুল) চেপে ধরি' },
        { id: '3', textBn: 'চেপে ধরেই টেনে নতুন জায়গায় নিয়ে যাই' },
        { id: '4', textBn: 'নতুন জায়গায় এসে ছেড়ে দিই' },
      ],
      hintBn: 'আগে ধরার জায়গায় যেতে হয়, তারপর ধরতে হয়, তারপর টানতে হয় — ছাড়ি একদম শেষে।',
      explanationBn: 'ঠিক! রাখা, ধরা, টানা, ছাড়া — এই ক্রম অন্য অনেক কাজেও লাগবে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'উইন্ডো (Window) হলো প্রোগ্রামের চৌকো জানালা। যেটিতে এখন কাজ করছেন সেটি সামনে থাকে — সেটি সক্রিয় উইন্ডো।',
      'টাইটেল বার ধরে টানলে উইন্ডো সরে যায়। কিনারা বা কোণা ধরে টানলে মাপ বদলায়। টাইটেল বারে ডাবল ক্লিক করলে সাধারণত বড়-ছোট হয়।',
      'Windows: বোতাম ডান ওপরে — “—” নামানো, ▢ বড় করা, ✕ বন্ধ করা।',
      'Mac: বোতাম বাঁ ওপরে — লাল বন্ধ করা, হলুদ নামানো, সবুজ বড় করা।',
      'নামিয়ে রাখা (Minimize) মানে বন্ধ করা নয়। টাস্কবার (Windows) বা ডক (Mac) থেকে ফিরিয়ে আনা যায়।',
      'উইন্ডো বদলানো: পেছনের উইন্ডোতে ক্লিক, টাস্কবার/ডকের আইকন, অথবা Windows-এ Alt+Tab, Mac-এ Cmd+Tab।',
      'সেভ না করা লেখা নিয়ে উইন্ডো বন্ধ করতে গেলে কম্পিউটার জিজ্ঞেস করে — ধীরে পড়ে বেছে নিন। Save চাপলে লেখা থাকে।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'যেকোনো একটি প্রোগ্রাম খুলুন (যেমন ফাইল দেখার প্রোগ্রাম)। তার টাইটেল বার ধরে টেনে উইন্ডোটি পর্দার অন্য জায়গায় সরান।',
      'কোণা ধরে টেনে উইন্ডোটি ছোট করুন, তারপর বড় করুন। তারপর টাইটেল বারে ডাবল ক্লিক করে দেখুন কী হয়।',
      'উইন্ডো নামিয়ে রাখুন, তারপর টাস্কবার বা ডক থেকে ফিরিয়ে আনুন। শেষে ঠিক বোতামটি চিনে বন্ধ করুন।',
    ],
    windowsTasksBn: ['দুটি প্রোগ্রাম খুলে কিবোর্ডে Alt চেপে ধরে Tab চাপুন — উইন্ডো বদলাতে দেখুন।'],
    macTasksBn: ['দুটি প্রোগ্রাম খুলে কিবোর্ডে ⌘ Command চেপে ধরে Tab চাপুন — প্রোগ্রাম বদলাতে দেখুন।'],
  },

  teacherTipBn:
    'উইন্ডো সরানো ও মাপ বদলানোয় হাতের স্থিরতা লাগে — মাউস বা টাচপ্যাডে বোতাম চেপে ধরে টানা প্রথমে কঠিন মনে হতে পারে, বারবার অভ্যাস করতে দিন। আরেকটি সাধারণ বিভ্রান্তি: “নামিয়ে রাখা” আর “বন্ধ করা” গুলিয়ে ফেলা। বুঝিয়ে দিন, নামানো উইন্ডো টাস্কবার/ডকে থেকে যায়। Alt+Tab ও Cmd+Tab আসল কম্পিউটারে ধরে-রাখা-চাপার অভ্যাস দরকার; একসাথে দুই কী চাপা নতুনদের জন্য কঠিন, ধৈর্য ধরুন। সেভ-না-করা উইন্ডো বন্ধ করার বাক্সটি ইচ্ছে করেই দেখানো হয়েছে, যাতে ভবিষ্যতে এমন বাক্স দেখে তিনি ভয় না পান।',
}

export default lesson
