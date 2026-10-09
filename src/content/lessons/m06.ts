import type { LegacyLesson as Lesson, Step } from '../../engine/types'
import { resetInstalls } from '../../sim/apps/extra/installState'

const DIFF = 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে'

/** Steps that are word-for-word the same idea on both systems except for target ids. */
const win: Step[] = [
  // ---- Notepad: write and save ----
  {
    id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'প্রোগ্রাম খোলার সবচেয়ে চেনা জায়গা স্টার্ট মেনু। নিচের স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের মাঝখানের (বা বাঁ দিকের) চারকোনা আইকনটি স্টার্ট বোতাম।',
  },
  {
    id: 'w-open-notepad', osVariant: 'windows', titleBn: 'নোটপ্যাড (Notepad) খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
    explanationBn: 'মেনুতে “Notepad” নামের প্রোগ্রামটিতে ক্লিক করুন। এটি সাধারণ লেখার প্রোগ্রাম।',
    hintBn: 'মেনুর “Pinned” অংশে Notepad লেখা আইকনটি খুঁজুন। নাম মনে থাকলে ওপরের সার্চ বক্সে “Notepad” টাইপ করলেও পাবেন।',
    simplerBn: 'স্টার্ট মেনুতে হলুদ-সাদা একটি খাতার ছবি আছে, তার নিচে Notepad লেখা। সেটির ওপর একবার ক্লিক করুন।',
  },
  {
    id: 'w-write', osVariant: 'windows', titleBn: 'একটি বাক্য লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
    explanationBn: 'সাদা জায়গায় ক্লিক করে ইংরেজিতে যেকোনো একটি বাক্য লিখুন, যেমন: Hello, this is my first file. বাংলা লেখা জানলে বাংলাতেও লিখতে পারেন, তবে জরুরি নয়।',
    hintBn: 'সাদা জায়গাটির ভেতরে একবার ক্লিক করুন, তারপর কিবোর্ডে টাইপ করুন।',
    successMessageBn: 'লেখা হয়ে গেছে। লক্ষ করুন, ওপরের নামের আগে একটি তারা (*) এসেছে — মানে “এখনও সেভ হয়নি”।',
  },
  {
    id: 'w-file-menu', osVariant: 'windows', titleBn: 'File মেনু খুলুন', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
    explanationBn: 'ওপরে বাঁ দিকের “File” লেখায় ক্লিক করুন।',
    hintBn: 'Notepad উইন্ডোর ওপরের সারিতে সবচেয়ে বাঁ দিকের শব্দটি File।',
  },
  {
    id: 'w-save', osVariant: 'windows', titleBn: 'Save বেছে নিন', target: 'editor-save', expectedAction: { type: 'click', target: 'editor-save' },
    explanationBn: 'মেনু থেকে “Save” বেছে নিন। ফাইলটির এখনও কোনো নাম নেই, তাই কম্পিউটার জিজ্ঞেস করবে — কী নামে, কোথায় রাখবেন।',
    hintBn: 'মেনুতে Save আর Save As দুটি আলাদা আছে। এখন শুধু “Save” (Save As নয়) বেছে নিন।',
    simplerBn: 'মেনুর তালিকায় New, Open এর নিচে Save লেখা আছে। সেটির ওপর ক্লিক করুন।',
  },
  {
    id: 'w-name', osVariant: 'windows', titleBn: 'ফাইলের নাম লিখুন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello.txt', ignoreCase: true },
    explanationBn: 'এই ছোট বাক্সটির নাম Save As ডায়ালগ (Dialog)। ওপরে দেখুন ফাইলটি Documents ফোল্ডারে যাচ্ছে। “File name” ঘরে পুরোনো নাম মুছে লিখুন: hello.txt',
    hintBn: 'ঘরের লেখাটি মুছে আবার লিখুন: hello.txt (ছোট হাতের অক্ষর, মাঝে একটি ডট)।',
    simplerBn: 'ঘরের ভেতরে ক্লিক করে সব লেখা মুছে ফেলুন, তারপর টাইপ করুন h-e-l-l-o, একটি ডট (.), তারপর t-x-t।',
  },
  {
    id: 'w-save-btn', osVariant: 'windows', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
    explanationBn: 'নিচের ডান দিকের নীল “Save” বোতামে চাপুন। ফাইল তৈরি হয়ে গেল!',
    hintBn: 'ডায়ালগের একদম নিচে ডান পাশে নীল রঙের Save বোতাম।',
  },
  {
    id: 'w-close-notepad', osVariant: 'windows', titleBn: 'নোটপ্যাড বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
    explanationBn: 'এখন উইন্ডোর ডান ওপরের ✕ বোতামে ক্লিক করে বন্ধ করুন। সেভ করা আছে বলে কোনো প্রশ্ন আসবে না।',
    hintBn: 'উইন্ডোর একদম ডান ওপরের কোণে ✕ চিহ্ন।',
  },
  // ---- reopen from Files ----
  {
    id: 'w-open-files', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
    explanationBn: 'সেভ করা ফাইল আবার খুলতে নিচের টাস্কবারে ফোল্ডারের আইকন (File Explorer)-এ ক্লিক করুন।',
    hintBn: 'টাস্কবারের হলুদ ফোল্ডারের মতো আইকনটি।',
  },
  {
    id: 'w-go-documents', osVariant: 'windows', titleBn: 'Documents ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
    explanationBn: 'বাঁ দিকের তালিকা থেকে “Documents”-এ ক্লিক করুন। আপনার hello ফাইলটি এখানেই আছে।',
    hintBn: 'বাঁ পাশের তালিকায় Documents লেখাটি খুঁজুন।',
  },
  {
    id: 'w-reopen', osVariant: 'windows', titleBn: 'hello.txt আবার খুলুন', target: 'fm-item-hello.txt', expectedAction: { type: 'doubleClick', target: 'fm-item-hello.txt' },
    explanationBn: 'hello ফাইলটিতে ডাবল ক্লিক করুন। (ফাইল ম্যানেজার অনেক সময় নামের শেষের .txt অংশটি লুকিয়ে রাখে, তাই শুধু “hello” দেখাতে পারে।) সেটি আবার Notepad-এ খুলবে, আপনার লেখা সহ।',
    hintBn: 'পরপর দুবার তাড়াতাড়ি ক্লিক করুন, ফাইলের নামের ওপরে।',
    simplerBn: 'ডাবল ক্লিক কঠিন লাগলে একবার ক্লিক করে ফাইলটি বেছে নিন, তারপর আবার তাড়াতাড়ি দুবার ক্লিক করুন।',
  },
  // ---- edit + unsaved prompt + Save ----
  {
    id: 'w-edit', osVariant: 'windows', titleBn: 'আরও কিছু লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
    explanationBn: 'লেখার শেষে ক্লিক করে আরও একটি বাক্য যোগ করুন। এখনও সেভ করবেন না।',
    hintBn: 'সাদা জায়গায় লেখার শেষে ক্লিক করে টাইপ করুন।',
  },
  {
    id: 'w-try-close', osVariant: 'windows', titleBn: 'সেভ না করে বন্ধ করে দেখুন', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
    explanationBn: 'এবার ✕ চাপুন। দেখুন, কম্পিউটার আপনাকে সাবধান করছে — নতুন লেখা সেভ করা হয়নি!',
    hintBn: 'ডান ওপরের ✕ বোতাম।',
  },
  {
    id: 'w-cancel', osVariant: 'windows', titleBn: 'Cancel: ফিরে যান', target: 'dialog-cancel', expectedAction: { type: 'click', target: 'dialog-cancel' },
    explanationBn: 'প্রশ্নটির তিনটি উত্তর: Save (সেভ করে বন্ধ), Don’t save (লেখা ফেলে দিয়ে বন্ধ), Cancel (বন্ধ না করে ফিরে যাওয়া)। এখন “Cancel” চাপুন।',
    hintBn: 'তিনটি বোতামের একদম ডান পাশেরটি Cancel।',
    teacherTipBn: 'এখানে Don’t save চাপলে নতুন লেখাটি হারিয়ে যেত। এটি একটি ভালো আলোচনার সুযোগ।',
  },
  {
    id: 'w-file-menu2', osVariant: 'windows', titleBn: 'File মেনু খুলুন', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
    explanationBn: 'এবার “File” মেনু খুলুন।',
    hintBn: 'ওপরের সারিতে বাঁ দিকের File।',
  },
  {
    id: 'w-save-again', osVariant: 'windows', titleBn: 'Save: একই ফাইল আপডেট', target: 'editor-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
    explanationBn: 'এবার “Save” বেছে নিন। এবার কোনো নাম জিজ্ঞেস করবে না — কারণ ফাইলের নাম আগে থেকেই আছে। একই hello.txt নতুন লেখায় বদলে গেল।',
    hintBn: 'মেনুর “Save” (Save As নয়)।',
  },
  // ---- Save As ----
  {
    id: 'w-file-menu3', osVariant: 'windows', titleBn: 'আবার File মেনু', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
    explanationBn: 'এখন একই লেখা আরেকটি নামে রাখব। আবার “File” মেনু খুলুন।',
    hintBn: 'ওপরের সারিতে File।',
  },
  {
    id: 'w-save-as', osVariant: 'windows', titleBn: 'Save As বেছে নিন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
    explanationBn: 'এবার “Save as” বেছে নিন।',
    hintBn: 'মেনুতে Save-এর ঠিক নিচের লাইনটি, যেখানে Save As লেখা।',
  },
  {
    id: 'w-name2', osVariant: 'windows', titleBn: 'নতুন নাম দিন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello-copy.txt', ignoreCase: true },
    explanationBn: 'নামের ঘরে নতুন একটি নাম লিখুন: hello-copy.txt',
    hintBn: 'আগের নাম মুছে লিখুন: hello-copy.txt',
  },
  {
    id: 'w-save-btn2', osVariant: 'windows', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello-copy.txt' },
    explanationBn: 'নীল “Save” বোতামে চাপুন।',
    hintBn: 'নিচের ডান দিকের নীল বোতাম।',
  },
  {
    id: 'w-close-notepad2', osVariant: 'windows', titleBn: 'নোটপ্যাড বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
    explanationBn: 'এখন ✕ চেপে Notepad বন্ধ করুন। সব সেভ করা, তাই কোনো প্রশ্ন আসবে না।',
    hintBn: 'ডান ওপরের ✕ বোতাম।',
  },
  {
    id: 'w-two-files', osVariant: 'windows', titleBn: 'দুটি ফাইল দেখুন', target: 'fm-content', expectedAction: { type: 'continue' },
    explanationBn: 'Documents ফোল্ডারে এখন দুটি ফাইল: hello.txt আর hello-copy.txt। Save আগের ফাইলটিই বদলায়, Save As নতুন আরেকটি ফাইল বানায়।',
    hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
  },
  // ---- install ----
  {
    id: 'w-start2', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'এবার নতুন প্রোগ্রাম ইনস্টল করা শিখব। আগে একটি “ইনস্টলার” প্রোগ্রাম খুঁজি। স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের চারকোনা স্টার্ট বোতাম।',
  },
  {
    id: 'w-search-installer', osVariant: 'windows', titleBn: 'স্টার্ট সার্চে খুঁজুন', target: 'start-search', expectedAction: { type: 'type', target: 'start-search', text: 'installer', ignoreCase: true },
    explanationBn: 'এই প্রোগ্রামটি মেনুতে সাজানো নেই। তাই ওপরের সার্চ বক্সে নাম লিখে খুঁজুন: installer',
    hintBn: 'মেনুর ওপরের সার্চ বক্সে লিখুন: installer',
  },
  {
    id: 'w-open-installer', osVariant: 'windows', titleBn: 'App Installer খুলুন', target: 'start-app-installer', expectedAction: { type: 'openApp', app: 'installer' },
    explanationBn: 'ফলাফলে “App Installer”-এ ক্লিক করুন।',
    hintBn: 'তালিকার প্রথম ফলাফলটি App Installer।',
  },
  {
    id: 'w-download', osVariant: 'windows', titleBn: 'Download চাপুন', target: 'installer-download', expectedAction: { type: 'click', target: 'installer-download' },
    explanationBn: 'এটি আসল ইনস্টল নয় — শুধু অনুশীলনের জন্য নকল। নিচের হলুদ সতর্কবার্তাটি পড়ুন, তারপর “Calculator Plus”-এর পাশের “Download” চাপুন।',
    hintBn: 'ডান পাশের নীল Download বোতাম।',
  },
  {
    id: 'w-next', osVariant: 'windows', titleBn: 'Next চাপুন', target: 'installer-next', expectedAction: { type: 'click', target: 'installer-next' },
    explanationBn: 'নামানো শেষ হলে সেটআপ উইজার্ড এসে যাবে। “Next >” চাপুন।',
    hintBn: 'নামানোর বার পূর্ণ হতে একটু অপেক্ষা করুন, তারপর নিচের ডান দিকের Next।',
  },
  {
    id: 'w-install', osVariant: 'windows', titleBn: 'Install চাপুন', target: 'installer-install', expectedAction: { type: 'click', target: 'installer-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নিচের ডান দিকের নীল Install।',
  },
  {
    id: 'w-finish', osVariant: 'windows', titleBn: 'Finish চাপুন', target: 'installer-finish', expectedAction: { type: 'click', target: 'installer-finish' },
    explanationBn: 'ইনস্টল হতে একটু সময় লাগে। শেষ হলে “Finish” চাপুন।',
    hintBn: 'বার পূর্ণ হলে নিচে ডান দিকে Finish বোতাম আসবে।',
  },
  {
    id: 'w-start3', osVariant: 'windows', titleBn: 'নতুন অ্যাপ খুঁজুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'এবার দেখি নতুন প্রোগ্রামটি কম্পিউটার চিনতে পারছে কি না। স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের স্টার্ট বোতাম।',
  },
  {
    id: 'w-search-calc', osVariant: 'windows', titleBn: 'Calculator লিখুন', target: 'start-search', expectedAction: { type: 'type', target: 'start-search', text: 'calculator', ignoreCase: true },
    explanationBn: 'সার্চ বক্সে লিখুন: calculator',
    hintBn: 'সার্চ বক্সে ইংরেজিতে calculator লিখুন।',
  },
  {
    id: 'w-open-calc', osVariant: 'windows', titleBn: 'Calculator Plus খুলুন', target: 'start-app-calcplus', expectedAction: { type: 'openApp', app: 'calcplus' },
    explanationBn: '“Calculator Plus”-এ ক্লিক করুন। ইনস্টলের পর নতুন প্রোগ্রাম এভাবেই খুঁজে পাওয়া যায়।',
    hintBn: 'ফলাফলের তালিকায় Calculator Plus।',
  },
  {
    id: 'w-close-calc', osVariant: 'windows', titleBn: 'ক্যালকুলেটর বন্ধ করুন', target: 'win-calcplus-close', expectedAction: { type: 'closeApp', app: 'calcplus' },
    explanationBn: 'চাইলে দু-একটি সংখ্যা চেপে দেখতে পারেন। তারপর ✕ চেপে বন্ধ করুন।',
    hintBn: 'ডান ওপরের ✕।',
  },
  // ---- uninstall ----
  {
    id: 'w-open-settings', osVariant: 'windows', titleBn: 'Settings খুলুন', target: 'taskbar-app-settings', expectedAction: { type: 'openApp', app: 'settings' },
    explanationBn: 'প্রোগ্রাম সরাতে চাইলে Settings-এ যেতে হয়। টাস্কবারের গিয়ারের মতো আইকন (Settings)-এ ক্লিক করুন।',
    hintBn: 'টাস্কবারের গিয়ারের (দাঁতওয়ালা চাকা) মতো আইকন।',
  },
  {
    id: 'w-nav-apps', osVariant: 'windows', titleBn: 'Apps বিভাগ', target: 'settings-nav-apps', expectedAction: { type: 'click', target: 'settings-nav-apps' },
    explanationBn: 'বাঁ দিকের তালিকা থেকে “Apps”-এ ক্লিক করুন। এখানে ইনস্টল করা সব প্রোগ্রামের তালিকা থাকে (Installed apps)।',
    hintBn: 'বাঁ পাশের তালিকায় “Apps” লেখাটি।',
  },
  {
    id: 'w-app-menu', osVariant: 'windows', titleBn: 'তিন বিন্দু (⋯) চাপুন', target: 'settings-app-menu-Calculator Plus', expectedAction: { type: 'click', target: 'settings-app-menu-Calculator Plus' },
    explanationBn: 'Calculator Plus-এর ডান পাশের তিনটি বিন্দু (⋯) চাপুন।',
    hintBn: 'প্রোগ্রামের নামের সারির একদম ডান দিকে ⋯ চিহ্ন।',
  },
  {
    id: 'w-uninstall', osVariant: 'windows', titleBn: 'Uninstall বেছে নিন', target: 'settings-app-uninstall-Calculator Plus', expectedAction: { type: 'click', target: 'settings-app-uninstall-Calculator Plus' },
    explanationBn: 'ছোট মেনু থেকে “Uninstall” বেছে নিন।',
    hintBn: 'মেনুর একমাত্র লেখাটি — Uninstall।',
  },
  {
    id: 'w-uninstall-confirm', osVariant: 'windows', titleBn: 'নিশ্চিত করুন', target: 'settings-uninstall-confirm', expectedAction: { type: 'custom', event: 'app-uninstalled' },
    explanationBn: 'কম্পিউটার আবার জিজ্ঞেস করবে। “Uninstall” চাপলে প্রোগ্রামটি সরে যাবে। (আসল কম্পিউটারে নিজের দরকারি প্রোগ্রাম কখনো ভুল করে সরাবেন না।)',
    hintBn: 'ছোট বাক্সের ডান নিচের নীল Uninstall বোতাম।',
  },
]

const mac: Step[] = [
  {
    id: 'm-spotlight', osVariant: 'mac', titleBn: 'স্পটলাইট (Spotlight) খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
    explanationBn: 'Mac-এ প্রোগ্রাম খোঁজার সহজ উপায় স্পটলাইট। ওপরের মেনু বারের ডান দিকের ম্যাগনিফাইং গ্লাসে (🔍) ক্লিক করুন। (কিবোর্ডে Cmd + Space-ও একই কাজ করে।)',
    hintBn: 'পর্দার একদম ওপরের সারির ডান দিকে ছোট ম্যাগনিফাইং গ্লাস।',
  },
  {
    id: 'm-search-textedit', osVariant: 'mac', titleBn: 'নাম লিখুন', target: 'spotlight-input', expectedAction: { type: 'type', target: 'spotlight-input', text: 'TextEdit', ignoreCase: true },
    explanationBn: 'সার্চ বক্সে লিখুন: TextEdit',
    hintBn: 'ইংরেজিতে TextEdit লিখুন।',
  },
  {
    id: 'm-open-textedit', osVariant: 'mac', titleBn: 'টেক্সটএডিট (TextEdit) খুলুন', target: 'spotlight-result-0', expectedAction: { type: 'openApp', app: 'editor' },
    explanationBn: 'ফলাফলের তালিকার প্রথম লাইন TextEdit — তাতে ক্লিক করুন।',
    hintBn: 'নিচের তালিকার একদম ওপরের লাইনে ক্লিক করুন।',
  },
  {
    id: 'm-write', osVariant: 'mac', titleBn: 'একটি বাক্য লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
    explanationBn: 'সাদা জায়গায় ক্লিক করে ইংরেজিতে একটি বাক্য লিখুন, যেমন: Hello, this is my first file. বাংলা লেখা জানলে বাংলাতেও লিখতে পারেন, তবে জরুরি নয়। (এখানে TextEdit “Plain Text” অবস্থায় আছে — ওপরের ডান কোণে দেখুন।)',
    hintBn: 'সাদা জায়গাটির ভেতরে একবার ক্লিক করে টাইপ করুন।',
    successMessageBn: 'লেখা হয়ে গেছে। এখন নামের পাশে “Edited” দেখাচ্ছে — মানে “এখনও সেভ হয়নি”।',
  },
  {
    id: 'm-save', osVariant: 'mac', titleBn: 'Save চাপুন', target: 'editor-save', expectedAction: { type: 'click', target: 'editor-save' },
    explanationBn: 'ওপরের “Save” বোতামে ক্লিক করুন। ফাইলের এখনও নাম নেই, তাই কম্পিউটার জিজ্ঞেস করবে — কী নামে, কোথায় রাখবেন। (আসল Mac-এ File মেনুতে বা Cmd + S চেপেও এটি হয়; ' + DIFF + '।)',
    hintBn: 'টুলবারের তৃতীয় বোতাম — Save (Save As… নয়)।',
  },
  {
    id: 'm-name', osVariant: 'mac', titleBn: 'ফাইলের নাম লিখুন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello.txt', ignoreCase: true },
    explanationBn: 'এই ছোট বাক্সটি ফাইল সেভ করার ডায়ালগ (Dialog)। “Where” লেখা অংশে দেখুন ফাইলটি Documents ফোল্ডারে যাচ্ছে। “Save As” ঘরে পুরোনো নাম মুছে লিখুন: hello.txt',
    hintBn: 'ঘরের লেখাটি মুছে আবার লিখুন: hello.txt (ছোট হাতের অক্ষর, মাঝে একটি ডট)।',
    simplerBn: 'ঘরের ভেতরে ক্লিক করে সব লেখা মুছে ফেলুন, তারপর টাইপ করুন h-e-l-l-o, একটি ডট (.), তারপর t-x-t।',
  },
  {
    id: 'm-save-btn', osVariant: 'mac', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
    explanationBn: 'নিচের ডান দিকের নীল “Save” বোতামে চাপুন। ফাইল তৈরি হয়ে গেল!',
    hintBn: 'ডায়ালগের একদম নিচে ডান পাশে নীল Save বোতাম।',
  },
  {
    id: 'm-close-textedit', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
    explanationBn: 'এখন উইন্ডোর বাঁ ওপরের লাল বোতামে ক্লিক করে বন্ধ করুন। সেভ করা আছে বলে কোনো প্রশ্ন আসবে না।',
    hintBn: 'উইন্ডোর বাঁ ওপরের কোণে তিনটি রঙিন বোতামের প্রথমটি — লাল।',
  },
  {
    id: 'm-open-finder', osVariant: 'mac', titleBn: 'ফাইন্ডার (Finder) খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
    explanationBn: 'সেভ করা ফাইল আবার খুলতে নিচের ডকের প্রথম আইকন Finder-এ ক্লিক করুন।',
    hintBn: 'ডকের বাঁ দিকের হাসিমুখের মতো আইকনটি।',
  },
  {
    id: 'm-go-documents', osVariant: 'mac', titleBn: 'Documents ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
    explanationBn: 'বাঁ দিকের তালিকা থেকে “Documents”-এ ক্লিক করুন। আপনার hello ফাইলটি এখানেই আছে।',
    hintBn: 'বাঁ পাশের তালিকায় Documents লেখাটি খুঁজুন।',
  },
  {
    id: 'm-reopen', osVariant: 'mac', titleBn: 'hello.txt আবার খুলুন', target: 'fm-item-hello.txt', expectedAction: { type: 'doubleClick', target: 'fm-item-hello.txt' },
    explanationBn: 'hello ফাইলটিতে ডাবল ক্লিক করুন। (ফাইল ম্যানেজার অনেক সময় নামের শেষের .txt অংশটি লুকিয়ে রাখে, তাই শুধু “hello” দেখাতে পারে।) সেটি আবার TextEdit-এ খুলবে, আপনার লেখা সহ।',
    hintBn: 'পরপর দুবার তাড়াতাড়ি ক্লিক করুন, ফাইলের নামের ওপরে।',
    simplerBn: 'ডাবল ক্লিক কঠিন লাগলে একবার ক্লিক করে ফাইলটি বেছে নিন, তারপর আবার তাড়াতাড়ি দুবার ক্লিক করুন।',
  },
  {
    id: 'm-edit', osVariant: 'mac', titleBn: 'আরও কিছু লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
    explanationBn: 'লেখার শেষে ক্লিক করে আরও একটি বাক্য যোগ করুন। এখনও সেভ করবেন না।',
    hintBn: 'সাদা জায়গায় লেখার শেষে ক্লিক করে টাইপ করুন।',
  },
  {
    id: 'm-try-close', osVariant: 'mac', titleBn: 'সেভ না করে বন্ধ করে দেখুন', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
    explanationBn: 'এবার লাল বোতাম চাপুন। দেখুন, কম্পিউটার আপনাকে সাবধান করছে — নতুন লেখা সেভ করা হয়নি!',
    hintBn: 'বাঁ ওপরের লাল বোতাম।',
  },
  {
    id: 'm-cancel', osVariant: 'mac', titleBn: 'Cancel: ফিরে যান', target: 'dialog-cancel', expectedAction: { type: 'click', target: 'dialog-cancel' },
    explanationBn: 'প্রশ্নটির তিনটি উত্তর: Save (সেভ করে বন্ধ), Don’t Save (লেখা ফেলে দিয়ে বন্ধ), Cancel (বন্ধ না করে ফিরে যাওয়া)। এখন “Cancel” চাপুন।',
    hintBn: 'বোতামগুলোর মধ্যে Cancel লেখাটি খুঁজুন।',
    teacherTipBn: 'এখানে Don’t Save চাপলে নতুন লেখাটি হারিয়ে যেত। এটি একটি ভালো আলোচনার সুযোগ।',
  },
  {
    id: 'm-save-again', osVariant: 'mac', titleBn: 'Save: একই ফাইল আপডেট', target: 'editor-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
    explanationBn: 'এবার ওপরের “Save” চাপুন। এবার কোনো নাম জিজ্ঞেস করবে না — কারণ ফাইলের নাম আগে থেকেই আছে। একই hello.txt নতুন লেখায় বদলে গেল।',
    hintBn: 'টুলবারের Save (Save As… নয়)।',
  },
  {
    id: 'm-save-as', osVariant: 'mac', titleBn: 'Save As… বেছে নিন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
    explanationBn: 'এখন একই লেখা আরেকটি নামে রাখব। “Save As…” চাপুন। (আসল Mac-এ অনেক ভার্সনে Save As… লুকানো থাকে — Option কী চেপে ধরে File মেনু খুললে দেখা যায়; ' + DIFF + '।)',
    hintBn: 'টুলবারে Save-এর পরের বোতাম, যেখানে Save As… লেখা।',
  },
  {
    id: 'm-name2', osVariant: 'mac', titleBn: 'নতুন নাম দিন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello-copy.txt', ignoreCase: true },
    explanationBn: 'নামের ঘরে নতুন একটি নাম লিখুন: hello-copy.txt',
    hintBn: 'আগের নাম মুছে লিখুন: hello-copy.txt',
  },
  {
    id: 'm-save-btn2', osVariant: 'mac', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello-copy.txt' },
    explanationBn: 'নীল “Save” বোতামে চাপুন।',
    hintBn: 'নিচের ডান দিকের নীল বোতাম।',
  },
  {
    id: 'm-close-textedit2', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
    explanationBn: 'এখন লাল বোতামে ক্লিক করে বন্ধ করুন। সব সেভ করা, তাই কোনো প্রশ্ন আসবে না।',
    hintBn: 'বাঁ ওপরের লাল বোতাম।',
  },
  {
    id: 'm-two-files', osVariant: 'mac', titleBn: 'দুটি ফাইল দেখুন', target: 'fm-content', expectedAction: { type: 'continue' },
    explanationBn: 'Documents ফোল্ডারে এখন দুটি ফাইল: hello.txt আর hello-copy.txt। Save আগের ফাইলটিই বদলায়, Save As নতুন আরেকটি ফাইল বানায়।',
    hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
  },
  // ---- install ----
  {
    id: 'm-spotlight2', osVariant: 'mac', titleBn: 'স্পটলাইট খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
    explanationBn: 'এবার নতুন প্রোগ্রাম ইনস্টল করা শিখব। আগে একটি “ইনস্টলার” প্রোগ্রাম খুঁজি। আবার ওপরের ম্যাগনিফাইং গ্লাসে ক্লিক করুন।',
    hintBn: 'ওপরের সারির ডান দিকের ম্যাগনিফাইং গ্লাস।',
  },
  {
    id: 'm-search-installer', osVariant: 'mac', titleBn: 'নাম লিখুন', target: 'spotlight-input', expectedAction: { type: 'type', target: 'spotlight-input', text: 'installer', ignoreCase: true },
    explanationBn: 'সার্চ বক্সে লিখুন: installer',
    hintBn: 'ইংরেজিতে installer লিখুন।',
  },
  {
    id: 'm-open-installer', osVariant: 'mac', titleBn: 'App Installer খুলুন', target: 'spotlight-result-0', expectedAction: { type: 'openApp', app: 'installer' },
    explanationBn: 'প্রথম ফলাফল “App Installer”-এ ক্লিক করুন।',
    hintBn: 'তালিকার একদম ওপরের লাইন।',
  },
  {
    id: 'm-download', osVariant: 'mac', titleBn: 'Download চাপুন', target: 'installer-download', expectedAction: { type: 'click', target: 'installer-download' },
    explanationBn: 'এটি আসল ইনস্টল নয় — শুধু অনুশীলনের জন্য নকল। (আসল Mac-এ অনেক প্রোগ্রাম অ্যাপ স্টোর (App Store) থেকে নামে, কিছু আবার নামানো ফাইল খুলে Applications ফোল্ডারে টেনে রাখতে হয়।) নিচের হলুদ সতর্কবার্তাটি পড়ুন, তারপর “Calculator Plus”-এর পাশের “Download” চাপুন।',
    hintBn: 'ডান পাশের নীল Download বোতাম।',
  },
  {
    id: 'm-next', osVariant: 'mac', titleBn: 'Next চাপুন', target: 'installer-next', expectedAction: { type: 'click', target: 'installer-next' },
    explanationBn: 'নামানো শেষ হলে সেটআপ এসে যাবে। “Next >” চাপুন।',
    hintBn: 'নামানোর বার পূর্ণ হতে একটু অপেক্ষা করুন, তারপর নিচের ডান দিকের Next।',
  },
  {
    id: 'm-install', osVariant: 'mac', titleBn: 'Install চাপুন', target: 'installer-install', expectedAction: { type: 'click', target: 'installer-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নিচের ডান দিকের নীল Install।',
  },
  {
    id: 'm-finish', osVariant: 'mac', titleBn: 'Finish চাপুন', target: 'installer-finish', expectedAction: { type: 'click', target: 'installer-finish' },
    explanationBn: 'ইনস্টল হতে একটু সময় লাগে। শেষ হলে “Finish” চাপুন।',
    hintBn: 'বার পূর্ণ হলে নিচে ডান দিকে Finish বোতাম আসবে।',
  },
  {
    id: 'm-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড (Launchpad) খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
    explanationBn: 'এবার দেখি নতুন প্রোগ্রামটি কম্পিউটার চিনতে পারছে কি না। ডকের লঞ্চপ্যাডে ক্লিক করুন — সেখানে সব প্রোগ্রাম থাকে।',
    hintBn: 'ডকের ছোট ছোট রঙিন বর্গ দিয়ে সাজানো আইকনটি।',
  },
  {
    id: 'm-open-calc', osVariant: 'mac', titleBn: 'Calculator Plus খুলুন', target: 'launchpad-app-calcplus', expectedAction: { type: 'openApp', app: 'calcplus' },
    explanationBn: 'তালিকায় নতুন “Calculator Plus” এসে গেছে। তাতে ক্লিক করুন।',
    hintBn: 'আইকনগুলোর মধ্যে সবুজাভ ক্যালকুলেটরের ছবি।',
  },
  {
    id: 'm-close-calc', osVariant: 'mac', titleBn: 'ক্যালকুলেটর বন্ধ করুন', target: 'win-calcplus-close', expectedAction: { type: 'closeApp', app: 'calcplus' },
    explanationBn: 'চাইলে দু-একটি সংখ্যা চেপে দেখতে পারেন। তারপর বাঁ ওপরের লাল বোতামে বন্ধ করুন।',
    hintBn: 'বাঁ ওপরের লাল বোতাম।',
  },
  // ---- uninstall ----
  {
    id: 'm-applications', osVariant: 'mac', titleBn: 'Applications ফোল্ডারে যান', target: 'fm-sidebar-Applications', expectedAction: { type: 'click', target: 'fm-sidebar-Applications' },
    explanationBn: 'Mac-এ প্রোগ্রাম সরাতে হলে Finder-এর “Applications” ফোল্ডারে যেতে হয়। বাঁ দিকের তালিকা থেকে Applications-এ ক্লিক করুন।',
    hintBn: 'Finder উইন্ডোর বাঁ পাশে Applications লেখাটি। উইন্ডোটি অন্য উইন্ডোর পেছনে থাকলে ডকের Finder-এ ক্লিক করুন।',
  },
  {
    id: 'm-drag-trash', osVariant: 'mac', titleBn: 'ট্র্যাশে টেনে ফেলুন', target: 'fm-item-Calculator Plus.app', expectedAction: { type: 'drag', target: 'fm-item-Calculator Plus.app', dropTarget: 'dock-trash' },
    explanationBn: 'Calculator Plus.app ধরে টেনে নিচে ডকের ট্র্যাশ (Trash) আইকনে ছেড়ে দিন। এটাই Mac-এ আনইনস্টল করার প্রধান উপায়। (অ্যাপ স্টোর থেকে নামানো অ্যাপ লঞ্চপ্যাডে Option কী চেপে ধরে ✕ চেপেও সরানো যায়।)',
    hintBn: 'আইকনের ওপর মাউসের বাঁ বোতাম চেপে ধরে রেখে টেনে ট্র্যাশের ওপর নিয়ে গিয়ে ছেড়ে দিন।',
    simplerBn: 'ফাইলের ওপর বোতাম চেপে ধরুন, চেপে রেখেই মাউস নিচে ডকের শেষের ট্র্যাশের ছবির ওপর নিয়ে যান, তারপর বোতাম ছেড়ে দিন।',
  },
]

const lesson: Lesson = {
  module: 6,
  part: 1,
  id: 'm06',
  titleBn: 'প্রোগ্রাম, ফাইল সেভ ও ইনস্টল',
  oneLineBn: 'প্রোগ্রাম খোলা-বন্ধ করা, লেখা সেভ করা (Save আর Save As), প্লেইন টেক্সট, আর প্রোগ্রাম ইনস্টল-আনইনস্টলের ধারণা।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['program', 'app', 'application', 'install', 'uninstall', 'plain-text', 'rich-text', 'notepad', 'textedit', 'save', 'save-as', 'open-file', 'start-search', 'spotlight', 'official-source', 'update'],
  // the practice computer starts without the pretend app installed
  setup: { vfs: () => resetInstalls() },

  explanation: [
    { kind: 'p', textBn: 'কম্পিউটারে আমরা তিনটি আলাদা জিনিস দেখি, যেগুলো অনেকে গুলিয়ে ফেলেন: প্রোগ্রাম, ফাইল আর ওয়েবসাইট। আজ প্রথমে এই তফাতটা পরিষ্কার করব।' },
    {
      kind: 'list',
      itemsBn: [
        'প্রোগ্রাম বা অ্যাপ (Program / App): কাজ করার হাতিয়ার। যেমন লেখার প্রোগ্রাম নোটপ্যাড, ছবি দেখার প্রোগ্রাম। এগুলো কম্পিউটারে ইনস্টল করা থাকে।',
        'ফাইল (File): সেই হাতিয়ার দিয়ে বানানো জিনিস। যেমন আপনার লেখা চিঠি, তোলা ছবি। ফাইল সেভ করে রাখা যায়।',
        'ওয়েবসাইট (Website): ইন্টারনেটে থাকে, ব্রাউজার (Browser) নামের প্রোগ্রাম দিয়ে দেখি। এটি আপনার কম্পিউটারে ইনস্টল করা নয়।',
      ],
    },
    { kind: 'analogy', textBn: 'প্রোগ্রাম হলো কলমের মতো, আর ফাইল হলো কলম দিয়ে লেখা চিঠি। কলম থাকে ডেস্কের ড্রয়ারে, চিঠি রাখা হয় ফাইলে বা আলমারিতে। আর ওয়েবসাইট হলো পাড়ার দোকানের মতো — আপনি ব্রাউজার নিয়ে সেখানে যান, কিন্তু দোকানটি আপনার ঘরে বসানো নেই।' },
    { kind: 'p', textBn: 'প্রোগ্রাম খুঁজে বের করার সহজ উপায় হলো নাম লিখে খোঁজা:' },
    {
      kind: 'list',
      itemsBn: [
        'Windows-এ: স্টার্ট (Start) বোতাম চেপে সাথে সাথে নাম টাইপ করুন, এটিই স্টার্ট সার্চ (Start search)। টাস্কবারের সার্চ বক্সও একই কাজ করে।',
        'Mac-এ: স্পটলাইট (Spotlight) — ওপরের ডান দিকের ম্যাগনিফাইং গ্লাস, বা কিবোর্ডে Cmd + Space। নাম লিখে Enter চাপুন। সব প্রোগ্রাম একসাথে দেখতে চাইলে ডকের লঞ্চপ্যাড (Launchpad)।',
        'বন্ধ করতে: Windows-এ উইন্ডোর ডান ওপরের ✕। Mac-এ বাঁ ওপরের লাল বোতাম — তবে Mac-এ উইন্ডো বন্ধ করলেও প্রোগ্রাম অনেক সময় চালু থাকে (ডকে আইকনের নিচে ছোট বিন্দু থাকে); পুরোপুরি বন্ধ করতে Cmd + Q।',
      ],
    },
    { kind: 'p', textBn: 'এবার লেখা নিয়ে কথা। কম্পিউটারে লিখে আপনি যদি সেভ (Save) না করেন, লেখা হারিয়ে যেতে পারে। সেভ করলে লেখা একটি ফাইলে জমা থাকে। প্রথমবার সেভ করার সময় কম্পিউটার জিজ্ঞেস করে — ফাইলের নাম কী হবে, আর কোথায় রাখব। এরপর আবার Save করলে সেই একই ফাইলটিই নতুন লেখায় বদলে যায়। আর Save As করলে একই লেখা নতুন নামে বা নতুন জায়গায় আরেকটি ফাইল হয়ে যায়।' },
    { kind: 'widget', widget: 'save-vs-saveas' },
    { kind: 'p', textBn: 'আজ আমরা যে প্রোগ্রামে লিখব — Windows-এ নোটপ্যাড (Notepad), Mac-এ টেক্সটএডিট (TextEdit) — তাতে শুধু সাধারণ লেখা (প্লেইন টেক্সট, Plain text) হয়। এর মানে লেখার সাজসজ্জা (মোটা, রঙিন, বড় হরফ) থাকে না। ফাইলের নামের শেষে সাধারণত .txt থাকে।' },
    { kind: 'widget', widget: 'plain-vs-rich' },
    { kind: 'p', textBn: 'Word-এর মতো প্রোগ্রামে লিখলে সাজানো লেখা (formatted text) হয়, আর ফাইলের ভেতরে সাজসজ্জার অনেক লুকানো নির্দেশ জমা হয়। প্রোগ্রামাররা তাই .txt, .py, .html-এর মতো প্লেইন টেক্সট ফাইলে কাজ করেন — যা লেখা হয়েছে ঠিক তা-ই থাকে, কম্পিউটারের বোঝার ভুল হয় না।' },
    { kind: 'note', textBn: 'Mac-এ TextEdit অনেক সময় প্রথমে সাজানো লেখার (rich text) অবস্থায় খোলে। প্লেইন টেক্সটে আনতে মেনু বারে Format → Make Plain Text বেছে নিন (শর্টকাট Shift + Cmd + T)। ' + DIFF + '। সিমুলেশনের TextEdit আগে থেকেই Plain Text অবস্থায় আছে।' },
    { kind: 'p', textBn: 'শেষে নতুন প্রোগ্রাম ইনস্টল (Install) করার ধারণা। ইনস্টল মানে প্রোগ্রামটি কম্পিউটারে বসিয়ে নেওয়া। সাধারণত প্রস্তুতকারকের নিজের ওয়েবসাইট বা কম্পিউটারের অফিসিয়াল অ্যাপ স্টোর থেকে সেটআপ ফাইল নামাতে হয়, তারপর Next → Install → Finish ধাপগুলো পার করতে হয়। সরাতে চাইলে আনইনস্টল (Uninstall) করতে হয়। Windows-এ Settings → Apps → Installed apps থেকে তিন বিন্দু (⋯) → Uninstall। Mac-এ Finder-এর Applications ফোল্ডার থেকে প্রোগ্রামটি ট্র্যাশে ফেলা হয়।' },
    { kind: 'note', textBn: 'সাবধান: শুধু অফিসিয়াল উৎস (official source) থেকে প্রোগ্রাম নামান। পপ-আপে “আপনার কম্পিউটার বিপদে, এখনই এটা ইনস্টল করুন” লেখা দেখলে, বা অচেনা লিংক বা মেসেজ থেকে নামাতে বললে কখনো করবেন না — এগুলো প্রতারণা হতে পারে। এ বিষয়ে পরের দিকের একটি পাঠে বিস্তারিত শিখব।' },
    { kind: 'p', textBn: 'আরও একটি কথা: প্রোগ্রামের নতুন সংস্করণ আসে, একে আপডেট (Update) বলে। আপডেটেও ভুল ঠিক হয় আর নিরাপত্তা বাড়ে — সেটিও অফিসিয়াল জায়গা থেকেই করবেন।' },
  ],

  steps: [...win, ...mac],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'নিজের মতো করে একটি নোট লিখুন, সেভ করুন, বন্ধ করুন আর আবার খুলুন। ভুল হলে “রিসেট” চাপলেই সব প্রথম অবস্থায় ফিরে আসবে।',
    checklistBn: [
      'নোটপ্যাড বা টেক্সটএডিটে নিজের নামসহ কয়েক লাইন লিখেছি',
      'Documents ফোল্ডারে একটি নাম দিয়ে সেভ করেছি',
      'ফাইলটি বন্ধ করে ফাইল ম্যানেজার থেকে আবার খুলেছি',
      'Save As দিয়ে একটি কপি বানিয়েছি আর দুটি ফাইলই দেখেছি',
      'App Installer দিয়ে Calculator Plus ইনস্টল করে আবার আনইনস্টল করেছি',
    ],
  },

  quiz: [
    {
      id: 'q-order', type: 'ordering', questionBn: 'নতুন একটি লেখা প্রথমবার সেভ করার ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'লেখাটি লিখি' },
        { id: '2', textBn: 'Save (বা Save As) বেছে নিই' },
        { id: '3', textBn: 'ফাইলের নাম লিখি, যেমন hello.txt' },
        { id: '4', textBn: 'ডায়ালগের Save বোতামে চাপি' },
      ],
      hintBn: 'আগে লেখা থাকতে হবে। তারপর সেভের কাজ শুরু, তারপর নাম, শেষে বোতাম।',
      explanationBn: 'ঠিক! লেখা → Save → নাম → Save বোতাম। প্রথমবার সবসময় নাম আর জায়গা জিজ্ঞেস করে।',
    },
    {
      id: 'q-txt', type: 'clickTarget', questionBn: 'নিচের কোন ফাইলটি সাধারণ লেখার (plain text) ফাইল?',
      items: [
        { id: 'jpg', labelBn: 'photo.jpg', icon: '🖼️' },
        { id: 'txt', labelBn: 'note.txt', icon: '📄' },
        { id: 'mp3', labelBn: 'song.mp3', icon: '🎵' },
        { id: 'docx', labelBn: 'letter.docx', icon: '📘' },
      ],
      correct: 'txt',
      hintBn: 'যে নামের শেষে .txt লেখা আছে, সেটি খুঁজুন।',
      explanationBn: '.txt হলো সাধারণ লেখার ফাইল। .docx Word ফাইল — তাতে সাজসজ্জার লুকানো নির্দেশও থাকে।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'কাজের সাথে তার মানে মিলিয়ে দিন।',
      pairs: [
        { id: 'save', leftBn: 'Save', rightBn: 'একই ফাইল নতুন লেখায় বদলানো' },
        { id: 'saveas', leftBn: 'Save As', rightBn: 'নতুন নামে আরেকটি ফাইল বানানো' },
        { id: 'install', leftBn: 'Install', rightBn: 'নতুন প্রোগ্রাম কম্পিউটারে বসানো' },
        { id: 'uninstall', leftBn: 'Uninstall', rightBn: 'প্রোগ্রাম কম্পিউটার থেকে সরানো' },
      ],
      hintBn: 'Install আর Uninstall একে অপরের উল্টো। Save আর Save As-এর তফাত — আগের ফাইলটি বদলায়, না নতুন ফাইল হয়।',
      explanationBn: 'চারটিই মিলেছে! এই চারটি শব্দ আপনি রোজ ব্যবহার করবেন।',
    },
    {
      id: 'q-saveas', type: 'multipleChoice', questionBn: 'আপনি hello.txt ফাইলে কিছু বদলেছেন, কিন্তু আগের লেখাটিও আলাদা করে রাখতে চান। কী করবেন?',
      options: [
        { id: 'a', textBn: 'Save — তাতে দুটো লেখাই থাকবে' },
        { id: 'b', textBn: 'Save As — নতুন একটি নাম দিয়ে' },
        { id: 'c', textBn: 'ফাইলটি বন্ধ করে দেব' },
      ],
      correct: ['b'],
      hintBn: 'Save আগের ফাইলটির ওপরেই নতুন লেখা বসিয়ে দেয়। আগের লেখা আলাদা থাকতে হলে নতুন একটি ফাইল দরকার।',
      explanationBn: 'Save As নতুন নামে আরেকটি ফাইল বানায়, পুরোনোটি যেমন ছিল তেমনই থাকে। শুধু Save করলে পুরোনো লেখা বদলে যেত।',
    },
    {
      id: 'q-source', type: 'multipleChoice', questionBn: 'নতুন একটি প্রোগ্রাম ইনস্টল করার সবচেয়ে নিরাপদ উপায় কোনটি?',
      options: [
        { id: 'a', textBn: 'পপ-আপে “এখনই ইনস্টল করুন” দেখলে সেখান থেকে' },
        { id: 'b', textBn: 'অচেনা কারও পাঠানো লিংক থেকে' },
        { id: 'c', textBn: 'প্রস্তুতকারকের নিজের ওয়েবসাইট বা কম্পিউটারের অফিসিয়াল অ্যাপ স্টোর থেকে' },
      ],
      correct: ['c'],
      hintBn: 'যারা প্রোগ্রামটি বানিয়েছে, বা কম্পিউটারের নিজস্ব স্টোর — এই দুটিকে বিশ্বাস করা যায়।',
      explanationBn: 'অফিসিয়াল উৎস নিরাপদ। পপ-আপ বা অচেনা লিংক থেকে নামালে ক্ষতিকর প্রোগ্রাম ঢুকে যেতে পারে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'প্রোগ্রাম (অ্যাপ) হলো কাজের হাতিয়ার; ফাইল হলো সেই হাতিয়ারে বানানো জিনিস; ওয়েবসাইট থাকে ইন্টারনেটে।',
      'প্রোগ্রাম খুঁজতে: Windows-এ স্টার্ট চেপে নাম লিখুন। Mac-এ স্পটলাইট (Cmd + Space) বা লঞ্চপ্যাড।',
      'প্রথমবার Save করলে নাম আর জায়গা ঠিক করতে হয়। এরপর Save করলে একই ফাইল বদলায়। Save As করলে নতুন নামে নতুন ফাইল হয়।',
      'সেভ করার আগে বন্ধ করতে গেলে কম্পিউটার জিজ্ঞেস করে: Save, Don’t save নাকি Cancel। সাবধানে বেছে নিন।',
      'সাধারণ লেখায় (.txt) কোনো লুকানো সাজসজ্জা থাকে না। তাই প্রোগ্রামাররা এ ধরনের ফাইলে কাজ করেন। Mac-এর TextEdit-এ Format → Make Plain Text (Shift + Cmd + T)।',
      'ইনস্টল: অফিসিয়াল উৎস থেকে নামান, Next → Install → Finish। আনইনস্টল: Windows-এ Settings → Apps → Installed apps → ⋯ → Uninstall; Mac-এ Applications থেকে ট্র্যাশে ফেলা।',
      'পপ-আপ বা অচেনা লিংক থেকে কখনো কিছু ইনস্টল করবেন না।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'নাম লিখে খুঁজে নোটপ্যাড বা টেক্সটএডিট খুলুন, দুটি লাইন লিখে Documents ফোল্ডারে hello.txt নামে সেভ করুন।',
      'ফাইলটি বন্ধ করে ফাইল ম্যানেজার থেকে ডাবল ক্লিক করে আবার খুলুন। আরও একটি লাইন যোগ করে Save করুন, তারপর Save As দিয়ে hello-copy.txt নামে আরেকটি কপি বানান।',
    ],
    windowsTasksBn: ['Settings → Apps → Installed apps খুলে শুধু দেখুন কী কী প্রোগ্রাম আছে। কিছু সরাবেন না।'],
    macTasksBn: ['Finder-এ Applications ফোল্ডারটি খুলে শুধু দেখুন কী কী প্রোগ্রাম আছে। কিছু সরাবেন না। TextEdit খুলে মেনু বারের Format মেনুটিও দেখে নিন।'],
  },

  teacherTipBn:
    'Save আর Save As-এর তফাত অনেকেই প্রথমে বুঝতে পারেন না। আসল কম্পিউটারে একটি ছোট ফাইলে দুজনে মিলে পরীক্ষা করুন: Save করে ফাইল খুলে দেখুন, তারপর Save As করে ফোল্ডারে দুটি ফাইল দেখান। আজকের আনইনস্টল-ইনস্টল সিমুলেশনে নকল প্রোগ্রাম ছিল — আসল কম্পিউটারে কোনো প্রোগ্রাম সরানোর আগে অবশ্যই আপনি দেখে নেবেন। নতুন Notepad ও TextEdit-এ অটো-সেভের মতো সুবিধা থাকতে পারে, তাই আসল কম্পিউটারে একটু আলাদা আচরণ দেখলে অবাক হবেন না।',
}

export default lesson
