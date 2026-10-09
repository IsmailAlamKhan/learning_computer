import type { Chapter, LegacyLesson as Lesson, SimSetup, Step } from '../../engine/types'
import { beginToolPractice } from '../../sim/apps/extra-support/toolState'
import { INSTALLER_FILES } from '../../sim/apps/extra-support/setupModel'

const DIFF = 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে'
const PRACTICE_NOTE = 'এটি অনুশীলনের নকল পাতা; আসল সাইটের ঠিকানা ওপরের হলুদ লেখায় দেওয়া আছে।'

// ---------------------------------------------------------------------------------------------
// Chapter 1 — download safely
// ---------------------------------------------------------------------------------------------
const dlWin: Step[] = [
  {
    id: 'm18-w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'প্রথমে ব্রাউজার খুলব। নিচের স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের চারকোনা আইকনটি স্টার্ট বোতাম।',
  },
  {
    id: 'm18-w-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: '“Web Browser” নামের প্রোগ্রামে ক্লিক করুন।',
    hintBn: 'মেনুতে Web Browser লেখা আইকনটি খুঁজুন।',
  },
]
const dlMac: Step[] = [
  {
    id: 'm18-m-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'নিচের ডকে ব্রাউজারের আইকনে ক্লিক করুন।',
    hintBn: 'ডকের আইকনগুলোর মধ্যে ব্রাউজারের (গোল দিকচিহ্ন) আইকনটি খুঁজুন।',
  },
]
const dlBoth: Step[] = [
  {
    id: 'm18-search', osVariant: 'both', titleBn: 'কোড এডিটর খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search:code editor download' },
    explanationBn: 'ওপরের ঠিকানার ঘরে ক্লিক করে লিখুন: code editor download — তারপর Enter চাপুন।',
    hintBn: 'ঠিকানার ঘরে ইংরেজিতে লিখুন: code editor download, তারপর Enter।',
    simplerBn: 'ওপরের লম্বা ঘরটিতে ক্লিক করুন, কিবোর্ডে c-o-d-e, ফাঁকা, e-d-i-t-o-r, ফাঁকা, d-o-w-n-l-o-a-d টাইপ করে Enter চাপুন।',
  },
  {
    id: 'm18-see-ad', osVariant: 'both', titleBn: '“Ad” লেবেলটি চিনুন', target: 'search-ad-1', expectedAction: { type: 'continue' },
    explanationBn: 'সবার ওপরের ফলাফলে ছোট্ট “Ad” (বিজ্ঞাপন) লেখা আছে। বিজ্ঞাপন টাকা দিয়ে ওপরে বসানো হয়, আসল প্রস্তুতকারক না-ও হতে পারে। এটিতে ক্লিক করবেন না।',
    hintBn: 'হলুদ-আভার ঘরটির ডান পাশে “Ad · বিজ্ঞাপন” লেখাটি দেখুন, তারপর “বুঝেছি, পরের ধাপ”।',
  },
  {
    id: 'm18-pick-official', osVariant: 'both', titleBn: 'অফিসিয়াল ফলাফলে ক্লিক করুন', target: 'search-result-1', expectedAction: { type: 'click', target: 'search-result-1' },
    explanationBn: 'এবার “Ad” লেখাহীন প্রথম ফলাফলে ক্লিক করুন — যার নাম Practice Editor – Download। ' + PRACTICE_NOTE,
    hintBn: 'Ad-এর নিচের প্রথম নীল শিরোনামটি।',
  },
  {
    id: 'm18-read-address', osVariant: 'both', titleBn: 'ঠিকানাটি অক্ষর ধরে পড়ুন', target: 'm18-banner', expectedAction: { type: 'continue' },
    explanationBn: 'আসল জীবনে এখানে থামবেন: ওপরের ঠিকানার ঘরে ঠিকানাটি কি আপনি যা জানেন তা-ই? (VS Code-এর ঠিকানা code.visualstudio.com, Python-এর www.python.org, Node.js-এর nodejs.org।) এই অনুশীলনের পাতায় নকল ঠিকানা, তাই হলুদ লেখায় আসলটি দেওয়া আছে।',
    hintBn: 'ঠিকানার ঘরটি আর হলুদ লেখাটি পড়ে “বুঝেছি, পরের ধাপ” চাপুন।',
  },
  {
    id: 'm18-see-ad-box', osVariant: 'both', titleBn: 'পাতার ভেতরের বিজ্ঞাপন চিনুন', target: 'm18-ad-box', expectedAction: { type: 'continue' },
    explanationBn: 'পাতার নিচে সবুজ রঙের বড় “DOWNLOAD NOW” বোতামটি বিজ্ঞাপন (Ad)। আসল ডাউনলোড বোতামটি ওপরে, আপনার কম্পিউটারের ধরন (Windows বা macOS) লেখা। বিজ্ঞাপনের বোতামে ক্লিক করবেন না।',
    hintBn: 'ডাউনলোডের বড় রঙিন বোতাম সব সময় আসল নয়। “AD” লেখাটি খুঁজুন।',
  },
  {
    id: 'm18-dl-editor', osVariant: 'both', titleBn: 'আসল Download বোতাম চাপুন', target: 'm18-download-editor', expectedAction: { type: 'click', target: 'm18-download-editor' },
    explanationBn: 'ওপরের নীল বোতামটি, যাতে আপনার কম্পিউটারের ধরন লেখা, সেটিতে ক্লিক করুন।',
    hintBn: 'পাতার ওপরের দিকের বড় নীল বোতাম (Download for Windows / macOS)।',
  },
  {
    id: 'm18-dl-editor-done', osVariant: 'both', titleBn: 'নামা শেষ হওয়া পর্যন্ত অপেক্ষা', target: 'browser-downloads-panel', expectedAction: { type: 'custom', event: 'browser-download-done' },
    explanationBn: 'ডাউনলোড-তালিকায় ফাইলের নাম আর নামার বার দেখা যাচ্ছে। ফাইলের নাম দেখে নিন — নামে editor আছে, শেষে ' + 'Windows-এ .exe, Mac-এ .dmg। নামা শেষ হলে নিজে এগিয়ে যাবে।',
    hintBn: 'একটু অপেক্ষা করুন, কয়েক সেকেন্ডে শেষ হবে।',
  },
  {
    id: 'm18-go-python', osVariant: 'both', titleBn: 'Python-এর সাইটে যান', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://python-official.example/downloads' },
    explanationBn: 'এবার ঠিকানার ঘরে নিজে টাইপ করে যাই (সার্চ ফলাফলে নয়): python-official.example/downloads — তারপর Enter। আসল জীবনে লিখবেন www.python.org।',
    hintBn: 'ঠিকানার ঘরের পুরোনো লেখা মুছে লিখুন: python-official.example/downloads',
    simplerBn: 'ঠিকানার ঘরে ক্লিক করুন, সব লেখা মুছুন, তারপর হুবহু লিখুন: python-official.example/downloads এবং Enter চাপুন।',
  },
  {
    id: 'm18-dl-python', osVariant: 'both', titleBn: 'Python নামান', target: 'm18-download-python', expectedAction: { type: 'click', target: 'm18-download-python' },
    explanationBn: 'হলুদ “Download Python 3.12.4” বোতামে ক্লিক করুন। পাতাটি নিজেই আপনার কম্পিউটারের জন্য সঠিক ফাইল বেছে দিয়েছে। (আসল সাইটে সংস্করণের সংখ্যা আরও নতুন হতে পারে।)',
    hintBn: 'পাতার মাঝের হলুদ বোতাম।',
  },
  {
    id: 'm18-dl-python-done', osVariant: 'both', titleBn: 'নামা শেষ হোক', target: 'browser-downloads-panel', expectedAction: { type: 'custom', event: 'browser-download-done' },
    explanationBn: 'অপেক্ষা করুন — ফাইল Downloads ফোল্ডারে জমা হচ্ছে।',
    hintBn: 'কয়েক সেকেন্ড অপেক্ষা করুন।',
  },
  {
    id: 'm18-go-node', osVariant: 'both', titleBn: 'Node.js-এর সাইটে যান', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://node-official.example/' },
    explanationBn: 'ঠিকানার ঘরে লিখুন: node-official.example — তারপর Enter। (আসল ঠিকানা nodejs.org।)',
    hintBn: 'ঠিকানার ঘরে লিখুন: node-official.example',
  },
  {
    id: 'm18-node-current', osVariant: 'both', titleBn: 'Current বোতাম চিনে নিন', target: 'm18-download-node-current', expectedAction: { type: 'click', target: 'm18-download-node-current' },
    explanationBn: 'দুটি বোতাম আছে। ডান পাশের Current-এ একবার ক্লিক করে দেখুন কী বলে (এটি কিছু নামাবে না)।',
    hintBn: 'ডান পাশের ধূসর বোতামটি।',
  },
  {
    id: 'm18-dl-node', osVariant: 'both', titleBn: 'LTS নামান', target: 'm18-download-node-lts', expectedAction: { type: 'click', target: 'm18-download-node-lts' },
    explanationBn: 'বাঁ পাশের সবুজ “LTS · RECOMMENDED” বোতামে ক্লিক করুন। LTS মানে দীর্ঘমেয়াদি সমর্থিত, স্থিতিশীল সংস্করণ।',
    hintBn: 'বাঁ পাশের সবুজ বোতামটি।',
  },
  {
    id: 'm18-dl-node-done', osVariant: 'both', titleBn: 'নামা শেষ হোক', target: 'browser-downloads-panel', expectedAction: { type: 'custom', event: 'browser-download-done' },
    explanationBn: 'শেষ হলে তিনটি ইনস্টলারই আপনার Downloads ফোল্ডারে আছে। পরের অধ্যায়ে সেগুলো ইনস্টল করব।',
    hintBn: 'কয়েক সেকেন্ড অপেক্ষা করুন।',
  },
]

// ---------------------------------------------------------------------------------------------
// Chapter 2 — install Python and Node.js
// ---------------------------------------------------------------------------------------------
const fW = INSTALLER_FILES.windows
const fM = INSTALLER_FILES.mac

const inWin: Step[] = [
  {
    id: 'm18-w-downloads', osVariant: 'windows', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'navigate', path: '~/Downloads' },
    explanationBn: 'ডাউনলোড করা ফাইল সাধারণত Downloads ফোল্ডারে থাকে। বাঁ দিকের তালিকায় “Downloads”-এ ক্লিক করুন।',
    hintBn: 'বাঁ পাশের তালিকায় Downloads লেখাটি।',
  },
  {
    id: 'm18-w-py-open', osVariant: 'windows', titleBn: 'Python-এর ইনস্টলার খুলুন', target: `fm-item-${fW.python}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fW.python}` },
    explanationBn: `ফাইলটির নামে python আছে, শেষে .exe। এতে ডাবল ক্লিক করুন। (আসল কম্পিউটারে নিরাপত্তা-সতর্কবার্তা এলে “Publisher” (প্রকাশক) দেখে নিন।)`,
    hintBn: 'practice-python দিয়ে শুরু হওয়া ফাইলটিতে পরপর দুবার ক্লিক।',
  },
  {
    id: 'm18-w-py-path', osVariant: 'windows', titleBn: '“Add python.exe to PATH” টিক দিন', target: 'setup-path', expectedAction: { type: 'click', target: 'setup-path' },
    explanationBn: 'সবচেয়ে জরুরি ধাপ! নিচের “Add python.exe to PATH” ঘরটিতে টিক দিন। এটি না দিলে টার্মিনাল পরে python কমান্ডটি চিনবে না। (PATH মানে: কম্পিউটারের একটি তালিকা — কোন কমান্ড কোথায় খুঁজবে।)',
    hintBn: 'জানালার মাঝের নিচের দিকের ছোট চৌকো ঘরটি।',
    simplerBn: '“Add python.exe to PATH” লেখার বাঁ পাশের ছোট চৌকো ঘরে একবার ক্লিক করুন, যেন টিক-চিহ্ন আসে।',
  },
  {
    id: 'm18-w-py-install', osVariant: 'windows', titleBn: 'Install Now চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: 'এবার “Install Now” চাপুন।',
    hintBn: 'জানালার নিচের ডান কোণের নীল বোতাম।',
  },
  {
    id: 'm18-w-py-close', osVariant: 'windows', titleBn: 'Close চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: 'একটু সময় লাগবে। “Setup was successful” দেখালে “Close” চাপুন।',
    hintBn: 'বার পূর্ণ হলে নিচের ডানে Close বোতাম আসবে।',
  },
  {
    id: 'm18-w-node-open', osVariant: 'windows', titleBn: 'Node.js-এর ইনস্টলার খুলুন', target: `fm-item-${fW.node}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fW.node}` },
    explanationBn: 'এবার Node.js-এর ফাইলটি (শেষে .msi — Windows-এর আরেক রকম ইনস্টলার) ডাবল ক্লিক করে খুলুন।',
    hintBn: 'practice-node দিয়ে শুরু হওয়া ফাইল।',
  },
  {
    id: 'm18-w-node-next1', osVariant: 'windows', titleBn: 'Next চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'স্বাগতম-পাতায় “Next >” চাপুন।',
    hintBn: 'নিচের ডানের Next বোতাম।',
  },
  {
    id: 'm18-w-node-accept', osVariant: 'windows', titleBn: 'শর্তে সম্মতি দিন', target: 'setup-accept', expectedAction: { type: 'click', target: 'setup-accept' },
    explanationBn: 'এটি লাইসেন্সের শর্ত। আসল জীবনে একবার চোখ বুলিয়ে নিন। এগোতে হলে “I accept the terms…” ঘরে টিক দিতে হবে।',
    hintBn: 'লেখার নিচের ছোট চৌকো ঘর।',
  },
  {
    id: 'm18-w-node-next2', osVariant: 'windows', titleBn: 'Next চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'এবার “Next >” চাপুন।',
    hintBn: 'টিক দেওয়ার পর Next বোতামটি নীল হয়ে যায়।',
  },
  {
    id: 'm18-w-node-next3', osVariant: 'windows', titleBn: 'ফোল্ডার ঠিক রেখে Next', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'ইনস্টলের জায়গা (Destination Folder) যেমন আছে তেমনই থাক। “Next >” চাপুন।',
    hintBn: 'Next বোতাম।',
  },
  {
    id: 'm18-w-node-next4', osVariant: 'windows', titleBn: 'স্বাভাবিক পছন্দেই Next', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'এখানে “Add to PATH” আগে থেকেই টিক দেওয়া — Node.js-এ এটি নিজে নিজেই ঠিক থাকে। “Next >” চাপুন।',
    hintBn: 'Next বোতাম।',
  },
  {
    id: 'm18-w-node-install', osVariant: 'windows', titleBn: 'Install চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নিচের ডানের নীল Install।',
  },
  {
    id: 'm18-w-node-uac', osVariant: 'windows', titleBn: 'অনুমতি দিন (Yes)', target: 'setup-uac-yes', expectedAction: { type: 'click', target: 'setup-uac-yes' },
    explanationBn: 'এই ছোট বাক্সটি ইউজার অ্যাকাউন্ট কন্ট্রোল (User Account Control)। আপনি নিজে ইনস্টল শুরু করেছেন বলে এটি আসা স্বাভাবিক। প্রকাশকের নাম দেখে “Yes” চাপুন। হঠাৎ নিজে থেকে এলে “No” বলবেন। ' + DIFF + '।',
    hintBn: '“Yes” বোতামটি নীল।',
  },
  {
    id: 'm18-w-node-finish', osVariant: 'windows', titleBn: 'Finish চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: 'শেষ হলে “Finish” চাপুন। Python আর Node.js — দুটোই ইনস্টল হলো!',
    hintBn: 'বার পূর্ণ হলে Finish আসবে।',
  },
]

const inMac: Step[] = [
  {
    id: 'm18-m-downloads', osVariant: 'mac', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'navigate', path: '~/Downloads' },
    explanationBn: 'বাঁ দিকের তালিকা থেকে “Downloads”-এ ক্লিক করুন।',
    hintBn: 'বাঁ পাশের তালিকায় Downloads।',
  },
  {
    id: 'm18-m-py-open', osVariant: 'mac', titleBn: 'Python-এর ইনস্টলার খুলুন', target: `fm-item-${fM.python}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fM.python}` },
    explanationBn: 'python দিয়ে শুরু, শেষে .pkg (Mac-এর ইনস্টলার প্যাকেজ)। ডাবল ক্লিক করুন।',
    hintBn: 'practice-python দিয়ে শুরু হওয়া ফাইল।',
  },
  {
    id: 'm18-m-py-c1', osVariant: 'mac', titleBn: 'Continue চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'প্রথম পাতার নাম Introduction। “Continue” চাপুন।',
    hintBn: 'নিচের ডান পাশের Continue বোতাম।',
  },
  {
    id: 'm18-m-py-c2', osVariant: 'mac', titleBn: 'Continue চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'এটি Read Me পাতা — কী ইনস্টল হচ্ছে তার তথ্য। আবার “Continue”।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-py-c3', osVariant: 'mac', titleBn: 'লাইসেন্সে Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'এটি লাইসেন্সের শর্ত। “Continue” চাপুন।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-py-agree', osVariant: 'mac', titleBn: 'Agree চাপুন', target: 'setup-agree', expectedAction: { type: 'click', target: 'setup-agree' },
    explanationBn: 'শর্তে রাজি হলে “Agree” চাপতে হয়। এগোতে হলে এটি লাগবে।',
    hintBn: 'ছোট বাক্সের নীল Agree বোতাম।',
  },
  {
    id: 'm18-m-py-install', osVariant: 'mac', titleBn: 'Install চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Standard Install” মানে সাধারণ ইনস্টল। “Install” চাপুন।',
    hintBn: 'নিচের ডানের নীল Install।',
  },
  {
    id: 'm18-m-py-pw', osVariant: 'mac', titleBn: 'পাসওয়ার্ড লিখুন', target: 'setup-password', expectedAction: { type: 'type', target: 'setup-password', text: 'practice123' },
    explanationBn: 'কম্পিউটার অ্যাডমিন পাসওয়ার্ড চাইছে, কারণ ইনস্টল একটি বড় কাজ। আসল Mac-এ লিখবেন নিজের পাসওয়ার্ড। এখানে অনুশীলনের নকল পাসওয়ার্ড: practice123',
    hintBn: 'পাসওয়ার্ডের ঘরে লিখুন: practice123 (ছোট হাতের অক্ষর, শেষে ১২৩)।',
  },
  {
    id: 'm18-m-py-ok', osVariant: 'mac', titleBn: 'Install Software চাপুন', target: 'setup-password-ok', expectedAction: { type: 'click', target: 'setup-password-ok' },
    explanationBn: '“Install Software” চাপুন।',
    hintBn: 'ছোট বাক্সের নীল বোতাম।',
  },
  {
    id: 'm18-m-py-close', osVariant: 'mac', titleBn: 'Close চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: 'ইনস্টল শেষে “The installation was successful” দেখাবে। “Close” চাপুন। (আসল Mac-এ ইনস্টলার ফাইলটি Trash-এ পাঠাতে চাইলে জিজ্ঞেস করতে পারে — চাইলে পাঠাতে পারেন।)',
    hintBn: 'বার পূর্ণ হলে Close বোতাম আসবে।',
  },
  {
    id: 'm18-m-node-open', osVariant: 'mac', titleBn: 'Node.js-এর ইনস্টলার খুলুন', target: `fm-item-${fM.node}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fM.node}` },
    explanationBn: 'এবার Node.js-এর .pkg ফাইলটি ডাবল ক্লিক করে খুলুন। ধাপগুলো প্রায় একই।',
    hintBn: 'practice-node দিয়ে শুরু হওয়া ফাইল।',
  },
  {
    id: 'm18-m-node-c1', osVariant: 'mac', titleBn: 'Continue চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: '“Continue” চাপুন।',
    hintBn: 'নিচের ডানের Continue।',
  },
  {
    id: 'm18-m-node-c2', osVariant: 'mac', titleBn: 'লাইসেন্সে Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'লাইসেন্সের পাতা। “Continue” চাপুন।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-node-agree', osVariant: 'mac', titleBn: 'Agree চাপুন', target: 'setup-agree', expectedAction: { type: 'click', target: 'setup-agree' },
    explanationBn: '“Agree” চাপুন।',
    hintBn: 'নীল Agree বোতাম।',
  },
  {
    id: 'm18-m-node-c3', osVariant: 'mac', titleBn: 'জায়গা ঠিক রেখে Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'এখানে ইনস্টলের জায়গা দেখাচ্ছে (Destination Select)। যেমন আছে তেমনই থাক। “Continue”।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-node-install', osVariant: 'mac', titleBn: 'Install চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নীল Install বোতাম।',
  },
  {
    id: 'm18-m-node-pw', osVariant: 'mac', titleBn: 'পাসওয়ার্ড লিখুন', target: 'setup-password', expectedAction: { type: 'type', target: 'setup-password', text: 'practice123' },
    explanationBn: 'আবার পাসওয়ার্ড চাইছে। অনুশীলনের নকল পাসওয়ার্ড: practice123',
    hintBn: 'ঘরে লিখুন: practice123',
  },
  {
    id: 'm18-m-node-ok', osVariant: 'mac', titleBn: 'Install Software চাপুন', target: 'setup-password-ok', expectedAction: { type: 'click', target: 'setup-password-ok' },
    explanationBn: '“Install Software” চাপুন।',
    hintBn: 'ছোট বাক্সের নীল বোতাম।',
  },
  {
    id: 'm18-m-node-close', osVariant: 'mac', titleBn: 'Close চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: 'শেষ হলে “Close” চাপুন। Python আর Node.js — দুটোই ইনস্টল হলো!',
    hintBn: 'বার পূর্ণ হলে Close আসবে।',
  },
]

// ---------------------------------------------------------------------------------------------
// Chapter 3 — check in the terminal
// ---------------------------------------------------------------------------------------------
const checkSteps: Step[] = [
  {
    id: 'm18-py-version-w', osVariant: 'windows', titleBn: 'Python-এর সংস্করণ দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['python --version', 'python -V'] },
    explanationBn: 'এটি টার্মিনাল (Terminal)। নিচের লাইনে লিখুন: python --version — তারপর Enter। সংস্করণ-সংখ্যা ছাপা হলে বুঝবেন ইনস্টল ঠিক হয়েছে।',
    hintBn: 'python, একটি ফাঁকা, তারপর দুটি ড্যাশ আর version: python --version',
    simplerBn: 'টার্মিনালের কালো জায়গায় ক্লিক করে p-y-t-h-o-n, ফাঁকা, দুটি মাইনাস (--), v-e-r-s-i-o-n টাইপ করে Enter চাপুন।',
  },
  {
    id: 'm18-py-version-m', osVariant: 'mac', titleBn: 'Python-এর সংস্করণ দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['python3 --version', 'python3 -V'] },
    explanationBn: 'এটি টার্মিনাল (Terminal)। Mac-এ Python-এর কমান্ডের নাম python3। লিখুন: python3 --version — তারপর Enter। (নতুন macOS-এ এটি আগে থেকেও থাকতে পারে বা ইনস্টলের একটি পপ-আপ আনতে পারে; ' + DIFF + '।)',
    hintBn: 'python3, একটি ফাঁকা, তারপর দুটি ড্যাশ আর version: python3 --version',
    simplerBn: 'টার্মিনালের কালো জায়গায় ক্লিক করে p-y-t-h-o-n-3, ফাঁকা, দুটি মাইনাস (--), v-e-r-s-i-o-n টাইপ করে Enter চাপুন।',
  },
  {
    id: 'm18-node-version', osVariant: 'both', titleBn: 'Node.js-এর সংস্করণ দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['node --version', 'node -v'] },
    explanationBn: 'এবার লিখুন: node --version — Enter। v দিয়ে শুরু একটি সংখ্যা আসবে।',
    hintBn: 'node, ফাঁকা, তারপর --version',
  },
  {
    id: 'm18-git-version', osVariant: 'both', titleBn: 'Git চেষ্টা করে দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['git --version', 'git -v'] },
    explanationBn: 'এবার লিখুন: git --version। Git আমরা এখনও ইনস্টল করিনি — তাই ভুল-বার্তা আসবে। তাতে ঘাবড়াবেন না: এর মানে শুধু “এটি এখনও বসানো নেই”।',
    hintBn: 'git, ফাঁকা, তারপর --version',
  },
  {
    id: 'm18-read-error', osVariant: 'both', titleBn: 'ভুল-বার্তাটি পড়ুন', target: 'terminal-output', expectedAction: { type: 'continue' },
    explanationBn: 'Windows-এ “not recognized”, Mac-এ “command not found” (বা ডেভেলপার টুলসের বার্তা) মানে কম্পিউটার কমান্ডটি খুঁজে পায়নি। Python-এ এমন হলে প্রথমে ভাবুন PATH-এ টিক দেওয়া ছিল কি না। ইনস্টল ঠিক থাকলে টার্মিনাল বন্ধ করে নতুন করে খুলেও দেখতে পারেন।',
    hintBn: '“বুঝেছি, পরের ধাপ” চাপুন।',
  },
]

// ---------------------------------------------------------------------------------------------
// Chapter 4 — folders, editor, extension
// ---------------------------------------------------------------------------------------------
const folderSteps: Step[] = [
  {
    id: 'm18-cd-docs', osVariant: 'both', titleBn: 'Documents ফোল্ডারে যান', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['cd Documents', 'cd ~/Documents', 'cd ./Documents'] },
    explanationBn: 'কোডের জন্য আলাদা একটি ফোল্ডার বানাব, Documents-এর ভেতরে। আগে সেখানে যাই: cd Documents',
    hintBn: 'cd, ফাঁকা, তারপর Documents (প্রথম অক্ষর D বড় হাতের)।',
  },
  {
    id: 'm18-mk-coding', osVariant: 'both', titleBn: 'coding ফোল্ডার বানান', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding', kind: 'folder' },
    explanationBn: 'এবার ফোল্ডার বানান: mkdir coding',
    hintBn: 'mkdir, ফাঁকা, তারপর coding',
  },
  {
    id: 'm18-cd-coding', osVariant: 'both', titleBn: 'coding-এর ভেতরে যান', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['cd coding', 'cd ./coding'] },
    explanationBn: 'ভেতরে ঢুকি: cd coding',
    hintBn: 'cd, ফাঁকা, তারপর coding',
  },
  {
    id: 'm18-mk-html', osVariant: 'both', titleBn: 'html-css ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/html-css', kind: 'folder' },
    explanationBn: 'ওয়েবপেজের জন্য: mkdir html-css',
    hintBn: 'mkdir html-css (মাঝে একটি মাইনাস চিহ্ন)।',
  },
  {
    id: 'm18-mk-python', osVariant: 'both', titleBn: 'python ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/python', kind: 'folder' },
    explanationBn: 'Python-এর জন্য: mkdir python',
    hintBn: 'mkdir python',
  },
  {
    id: 'm18-mk-js', osVariant: 'both', titleBn: 'javascript ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/javascript', kind: 'folder' },
    explanationBn: 'জাভাস্ক্রিপ্টের জন্য: mkdir javascript',
    hintBn: 'mkdir javascript',
  },
  {
    id: 'm18-mk-projects', osVariant: 'both', titleBn: 'projects ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/projects', kind: 'folder' },
    explanationBn: 'বড় কাজের জন্য: mkdir projects',
    hintBn: 'mkdir projects',
  },
  {
    id: 'm18-code-dot', osVariant: 'both', titleBn: 'কোড এডিটরে ফোল্ডারটি খুলুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['code .', 'code ./'] },
    explanationBn: 'এখন এডিটরে এই ফোল্ডারটি খুলব। লিখুন: code . — (code, ফাঁকা, তারপর একটি ডট। ডট মানে “এই ফোল্ডার”।) আসল VS Code-এও এটি কাজ করে; ' + DIFF + '। Mac-এ প্রথমবার কিছু সেটআপ লাগতে পারে — অনুশীলনে আপনি ঝামেলা ছাড়াই পাবেন।',
    hintBn: 'code, একটি ফাঁকা, তারপর শুধু একটি ডট (.)',
    simplerBn: 'c-o-d-e টাইপ করুন, স্পেস চাপুন, তারপর একটি ফুলস্টপ (.) দিয়ে Enter চাপুন।',
  },
  {
    id: 'm18-see-editor', osVariant: 'both', titleBn: 'এডিটরের ফোল্ডার-তালিকা দেখুন', target: 'code-explorer', expectedAction: { type: 'continue' },
    explanationBn: 'এডিটরের বাঁ পাশের তালিকায় আপনার বানানো চারটি ফোল্ডার দেখা যাচ্ছে। এটিই এডিটরের সুবিধা: ফাইল-ফোল্ডার সবসময় চোখের সামনে।',
    hintBn: 'বাঁ পাশের তালিকাটি দেখে “বুঝেছি, পরের ধাপ” চাপুন।',
  },
]
const extWin: Step[] = [
  {
    id: 'm18-w-ext-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'আসল VS Code-এ এক্সটেনশন বাঁ পাশের চারকোনা-ব্লকের আইকনে থাকে (শর্টকাট Ctrl + Shift + X)। এখানে একটি আলাদা জানালায় দেখাচ্ছি। স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের স্টার্ট বোতাম।',
  },
  {
    id: 'm18-w-ext-search', osVariant: 'windows', titleBn: 'সার্চে লিখুন', target: 'start-search', expectedAction: { type: 'type', target: 'start-search', text: 'extensions', ignoreCase: true },
    explanationBn: 'ওপরের সার্চ ঘরে লিখুন: extensions',
    hintBn: 'সার্চ ঘরে লিখুন: extensions',
  },
  {
    id: 'm18-w-ext-open', osVariant: 'windows', titleBn: 'Extensions Marketplace খুলুন', target: 'start-app-extensions', expectedAction: { type: 'openApp', app: 'extensions' },
    explanationBn: 'ফলাফলে “Extensions Marketplace”-এ ক্লিক করুন।',
    hintBn: 'তালিকার প্রথম ফলাফল।',
  },
]
const extMac: Step[] = [
  {
    id: 'm18-m-ext-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
    explanationBn: 'আসল VS Code-এ এক্সটেনশন বাঁ পাশের চারকোনা-ব্লকের আইকনে থাকে (শর্টকাট Cmd + Shift + X)। এখানে একটি আলাদা জানালায় দেখাচ্ছি। ডকের লঞ্চপ্যাডে ক্লিক করুন।',
    hintBn: 'ডকের গ্রিড-আইকনটি।',
  },
  {
    id: 'm18-m-ext-open', osVariant: 'mac', titleBn: 'Extensions Marketplace খুলুন', target: 'launchpad-app-extensions', expectedAction: { type: 'openApp', app: 'extensions' },
    explanationBn: '“Extensions Marketplace”-এ ক্লিক করুন।',
    hintBn: 'বেগুনি ব্লকের আইকনটি।',
  },
]
const extBoth: Step[] = [
  {
    id: 'm18-ext-checklist', osVariant: 'both', titleBn: 'আগে যাচাই করুন', target: 'ext-checklist', expectedAction: { type: 'continue' },
    explanationBn: 'ইনস্টলের আগে তিনটি জিনিস দেখুন: প্রকাশক কে (verified টিক আছে কি), ইনস্টল-সংখ্যা কত (লক্ষ-কোটি, নাকি কয়েকশো), রেটিং কেমন। তালিকায় দুটি “Python Support” আছে — ভালো করে তুলনা করুন।',
    hintBn: 'ওপরের নীল বাক্সটি পড়ে “বুঝেছি, পরের ধাপ” চাপুন।',
  },
  {
    id: 'm18-ext-install', osVariant: 'both', titleBn: 'ঠিকটি ইনস্টল করুন', target: 'ext-install-python-support', expectedAction: { type: 'custom', event: 'extension-installed:python-support' },
    explanationBn: 'যেটির প্রকাশক Practice Foundation (verified), ইনস্টল 41.2M — সেই “Python Support”-এর Install বোতামে ক্লিক করুন। “PRO (FREE!!)” লেখাটিতে নয়।',
    hintBn: 'প্রথম “Python Support”-এর ডান পাশের নীল Install বোতাম — যেটির নামে PRO নেই।',
    simplerBn: 'দুটির মধ্যে যেটির নিচে “verified” লেখা আর সংখ্যা 41.2M, সেটির Install চাপুন।',
  },
]

// ---------------------------------------------------------------------------------------------
// Chapters
// ---------------------------------------------------------------------------------------------
const setupDownload: SimSetup = { vfs: (v) => beginToolPractice(v) }
const setupInstall: SimSetup = {
  openApps: ['files'],
  vfs: (v, os) => {
    beginToolPractice(v)
    const dl = v.child(v.home, 'Downloads') ?? v.mkdir(v.home, 'Downloads')
    const f = INSTALLER_FILES[os]
    for (const n of [f.vscode, f.python, f.node]) if (!v.child(dl, n)) v.createFile(dl, n, 'Simulated download — nothing real is installed.')
  },
}
const setupCheck: SimSetup = { openApps: ['terminal'], vfs: (v) => beginToolPractice(v, { python: true, node: true }) }
const setupFolders: SimSetup = { openApps: ['terminal'], vfs: (v) => beginToolPractice(v, { python: true, node: true, vscode: true }) }

const chapters: Chapter[] = [
  {
    id: 'download', titleBn: '১. নিরাপদে ডাউনলোড', introBn: 'কোড এডিটর, Python আর Node.js অফিসিয়াল সাইট থেকে নামাই — বিজ্ঞাপন আর নকল বোতাম চিনে।',
    setup: setupDownload, steps: [...dlWin, ...dlMac, ...dlBoth],
  },
  {
    id: 'install', titleBn: '২. Python ও Node.js ইনস্টল', introBn: 'Downloads ফোল্ডার থেকে ইনস্টলার খুলে ধাপে ধাপে ইনস্টল করি (Windows: Setup উইজার্ড, Mac: Installer)।',
    setup: setupInstall, steps: [...inWin, ...inMac],
  },
  {
    id: 'check', titleBn: '৩. টার্মিনালে যাচাই', introBn: 'কমান্ড লিখে দেখি ইনস্টল ঠিক হয়েছে কি না, আর না-থাকলে কেমন বার্তা আসে।',
    setup: setupCheck, steps: checkSteps,
  },
  {
    id: 'folders', titleBn: '৪. কোডিং ফোল্ডার, এডিটর ও এক্সটেনশন', introBn: 'কোডের ফোল্ডার সাজিয়ে এডিটরে খুলি আর নিরাপদে একটি এক্সটেনশন ইনস্টল করি।',
    setup: setupFolders, steps: [...folderSteps, ...extWin, ...extMac, ...extBoth],
  },
]

// ---------------------------------------------------------------------------------------------
const lesson: Lesson = {
  module: 18,
  part: 2,
  id: 'm18',
  titleBn: 'প্রোগ্রামিংয়ের টুল সাজানো',
  oneLineBn: 'কোড এডিটর, Python আর Node.js নিরাপদে নামিয়ে ইনস্টল করি, টার্মিনালে যাচাই করি আর কোডিংয়ের ফোল্ডার সাজাই।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['tool-code-editor', 'tool-vscode', 'tool-installer', 'tool-official-website', 'tool-download', 'tool-path', 'tool-version', 'tool-python', 'tool-nodejs', 'tool-lts', 'tool-extension', 'tool-git', 'tool-github', 'tool-repository', 'tool-admin-password', 'tool-coding-folder'],

  explanation: [
    { kind: 'p', textBn: 'কোড লেখা শুরুর আগে কয়েকটি টুল দরকার। আজ সেগুলো নিরাপদে নামিয়ে ইনস্টল করা আর ঠিকঠাক বসেছে কি না যাচাই করা শিখব। আগে সিমুলেশনে অনুশীলন, তারপর স্বামীর সাথে বসে আসল কম্পিউটারে।' },
    { kind: 'widget', widget: 'tool-map' },
    { kind: 'p', textBn: 'প্রথম টুল: কোড এডিটর (Code Editor)। নোটপ্যাডেও কোড লেখা যায়, কিন্তু কোড এডিটর বাড়তি সাহায্য করে: কোডের অংশগুলো রং দিয়ে আলাদা করে দেখায়, লাইনের ফাঁক (ইন্ডেন্টেশন, Indentation) ঠিক রাখে, আর পাশে ফাইল-ফোল্ডারের তালিকা (file tree) দেখায়। VS Code (Visual Studio Code) বিনামূল্যের একটি জনপ্রিয় এডিটর — আমরা সেটিই উদাহরণ নিচ্ছি। অন্য এডিটরও আছে; পরে চাইলে দেখতে পারেন।' },
    { kind: 'analogy', textBn: 'নোটপ্যাড হলো সাদা কাগজ। কোড এডিটর হলো দাগ-টানা, রং-করা খাতা, যেখানে ভুল চট করে চোখে পড়ে।' },
    { kind: 'p', textBn: 'দ্বিতীয় ধাপ: নিরাপদে ডাউনলোড। ইন্টারনেটে প্রোগ্রাম নামানোর সময় সবচেয়ে বেশি ঠকার ঝুঁকি থাকে। তাই এই নিয়মগুলো মেনে চলুন:' },
    {
      kind: 'list',
      itemsBn: [
        'শুধু অফিসিয়াল সাইট থেকে। ঠিকানাগুলো অক্ষর ধরে ধরে মিলিয়ে নিন: VS Code — code.visualstudio.com; Python — www.python.org; Node.js — nodejs.org।',
        'নকল সাইটের ঠিকানা প্রায় একই রকম দেখায় (যেমন o-এর জায়গায় 0)। সার্চ ফলাফলে সবার ওপরে “Ad” (বিজ্ঞাপন) লেখা ফলাফল প্রায়ই টাকা দিয়ে বসানো — সেটি এড়িয়ে ঠিকানা নিজে টাইপ করুন বা বুকমার্ক থেকে যান (মডিউল ৭ ও ৯-এর কথা মনে করুন)।',
        'পাতার ভেতরের বড় রঙিন “Download Now” বোতাম অনেক সময় বিজ্ঞাপন। আসল বোতামে আপনার কম্পিউটারের ধরন (Windows / macOS) আর সংস্করণ লেখা থাকে।',
        'নামার পর ফাইলের নাম আর প্রকাশক (publisher) দেখুন। অচেনা নাম বা অদ্ভুত শেষ-অংশ (যেমন .zip.exe) দেখলে থামুন।',
        'ইনস্টলার কোনো ব্রাউজার এক্সটেনশন, টুলবার বা “অফার” ইনস্টল করতে চাইলে “না” বলুন। এই তিনটি আসল প্রোগ্রামের ইনস্টলারে সাধারণত এসব থাকে না — থাকলে থেমে কাউকে জিজ্ঞেস করুন।',
      ],
    },
    { kind: 'widget', widget: 'tool-address-check' },
    { kind: 'note', textBn: 'অনুশীলনের সাইটগুলোর ঠিকানা কেন .example দিয়ে শেষ? কারণ ওগুলো আসল সাইট নয়, শেখার জন্য বানানো নকল। প্রতিটি পাতার ওপরে হলুদ লেখায় আসল ঠিকানা দেওয়া আছে।' },
    { kind: 'p', textBn: 'তৃতীয় ধাপ: ইনস্টল। Python আর Node.js ইনস্টলে একটু আলাদা ধাপ আছে:' },
    {
      kind: 'list',
      itemsBn: [
        'Windows-এ Python: python.org-এর ইনস্টলারের প্রথম পাতায় “Add python.exe to PATH” নামে একটি ঘর আছে — অবশ্যই টিক দিন, তারপর Install Now। PATH হলো কম্পিউটারের একটি তালিকা, যাতে লেখা থাকে টার্মিনালে কমান্ড লিখলে কোথায় খুঁজতে হবে। টিক না দিলে python কমান্ড চলে না।',
        'Mac-এ Python: python.org থেকে .pkg ইনস্টলার, ধাপ: Continue → Continue → Agree → Install → পাসওয়ার্ড। নতুন macOS-এ কিছু ক্ষেত্রে python3 কমান্ডটি আগে থেকেও থাকে বা প্রথমবার লিখলে ডেভেলপার টুলস ইনস্টলের পপ-আপ আসে; ' + DIFF + '।',
        'Node.js: LTS (Long Term Support, দীর্ঘমেয়াদি সমর্থিত) সংস্করণ নিন — এটি স্থিতিশীল আর বহু বছর ধরে নিরাপত্তা ও ভুল সারানোর আপডেট পায়। পাশের Current সংস্করণে নতুন নতুন পরীক্ষামূলক ফিচার থাকে। Windows-এ ইনস্টলার .msi, Mac-এ .pkg।',
        'VS Code: Windows-এ ইনস্টলার (.exe) চালান। Mac-এ ডাউনলোড করা ফাইলটি (সাধারণত .zip, কখনো .dmg) খুলে অ্যাপটিকে Applications ফোল্ডারে টেনে (drag) আনুন।',
      ],
    },
    { kind: 'p', textBn: 'ইনস্টলের সময় কম্পিউটার অ্যাডমিন পাসওয়ার্ড (Administrator Password) চাইতে পারে — Windows-এ সাধারণত “Yes”-এর অনুমতি। কারণ ইনস্টল একটি বড় কাজ। নিয়ম: আপনি নিজে ইনস্টল শুরু করলে তবেই এটি দিন; হঠাৎ নিজে থেকে এলে বা বিজ্ঞাপন চাপার পরে এলে দেবেন না। ইনস্টলের জন্য খালি জায়গা লাগে, আর কম্পিউটারের নিজের আপডেটও (Windows Update / Software Update) মাঝে মাঝে করে নেওয়া ভালো।' },
    { kind: 'p', textBn: 'চতুর্থ ধাপ: টার্মিনালে যাচাই। টার্মিনাল খুলে কমান্ডে সংস্করণ (version) দেখুন — সংখ্যা ছাপা হলে ইনস্টল ঠিক:' },
    { kind: 'code', language: 'shell', code: '# Windows\npython --version\nnode --version\ngit --version\n\n# Mac\npython3 --version\nnode --version\ngit --version' },
    { kind: 'note', textBn: 'Windows-এ “not recognized”, Mac-এ “command not found” মানে কম্পিউটার কমান্ডটি খুঁজে পাচ্ছে না — প্রোগ্রাম বসেনি, বা (Windows-এ Python-এ) PATH-এ টিক দেওয়া হয়নি। টার্মিনাল বন্ধ করে নতুন করে খুলে আবার চেষ্টা করুন। Windows-এ আসল কম্পিউটারে python লিখলে কখনও Microsoft Store খুলে যেতে পারে; ' + DIFF + '।' },
    { kind: 'p', textBn: 'পঞ্চম ধাপ: এক্সটেনশন (Extension) — এডিটরে যোগ করা অতিরিক্ত সুবিধা। শুধু এডিটরের নিজের অফিসিয়াল মার্কেটপ্লেস থেকে ইনস্টল করুন, আর দেখে নিন: ঠিক প্রকাশক (verified), অনেক বেশি ইনস্টল-সংখ্যা, ভালো রেটিং, নামটি হুবহু যা চান। কাজের কয়েকটি: Python এক্সটেনশন, Live Server (HTML পেজের প্রিভিউ), বাংলা ভাষার প্যাক (পাওয়া গেলে, ঐচ্ছিক), আর Prettier (কোড সাজানোর ফরম্যাটার — পরে)।' },
    { kind: 'p', textBn: 'ষষ্ঠ ধাপ: ফোল্ডার সাজানো। কোডের ফাইল ছড়িয়ে-ছিটিয়ে না রেখে একটি জায়গায় রাখুন:' },
    { kind: 'code', language: 'text', code: 'Documents/\n  coding/\n    html-css/\n    python/\n    javascript/\n    projects/' },
    { kind: 'p', textBn: 'শেষে Git আর GitHub-এর কথা, মোটামুটি ধারণা হিসেবে। Git হলো কাজের “সেভ পয়েন্ট” রাখার প্রোগ্রাম — ভুল হলে আগের কোনো অবস্থায় ফেরা যায়। GitHub হলো ইন্টারনেটে সেই কাজের অনলাইন কপি রাখা আর অন্যের সাথে ভাগ করার ওয়েবসাইট। বিনামূল্যের অ্যাকাউন্ট খুলতে ইমেইল লাগে (মডিউল ৮-এর মতো)। এগুলো পরে আসবে — এখনই ইনস্টল না করলেও চলবে।' },
    { kind: 'note', textBn: 'আসল কম্পিউটারে একা নয়, স্বামীর সাথে বসে করুন। সংখ্যা বা ঠিকানা মেলাতে দুজনের চোখ ভালো। কোনো ভুল-বার্তা এলে স্ক্রিনের ছবি (screenshot) তুলে রাখুন, তাড়াহুড়ো করবেন না। সব ধাপের চেকলিস্ট চিট শিটে আছে: “সেটআপ চেকলিস্ট”।' },
  ],

  steps: [],
  chapters,

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'অধ্যায়গুলো আবার খুলে নিজের মতো ঘুরে দেখুন। এখানে আসলে কিছুই ইনস্টল হয় না — সবই অনুশীলন। ভুল হলে “রিসেট” চাপলেই সব প্রথম অবস্থায় ফিরে আসে।',
    checklistBn: [
      'ঠিকানা অক্ষর ধরে মিলিয়ে অফিসিয়াল পাতায় গিয়েছি, “Ad” ফলাফল এড়িয়েছি',
      'পাতার ভেতরের বিজ্ঞাপন-বোতাম চিনেছি (চাপলে কী হয় দেখে নিয়েছি — অনুশীলনে ক্ষতি নেই)',
      'Python ইনস্টলে PATH-এ টিক ছাড়া চেষ্টা করে দেখেছি টার্মিনাল চিনতে পারে না (Windows)',
      'ভুল পাসওয়ার্ড দিলে কী বার্তা আসে দেখেছি (Mac)',
      'এডিটরের ইনস্টলারটিও (practice-editor…) নিজে ইনস্টল করেছি',
      'Extensions Marketplace-এ নকল এক্সটেনশনে Install চেপে দেখেছি যে এটি আটকায়',
    ],
  },

  quiz: [
    {
      id: 'q-order', type: 'ordering', questionBn: 'নিরাপদে একটি প্রোগ্রাম নামিয়ে ইনস্টলের ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'ঠিকানা অক্ষর ধরে মিলিয়ে অফিসিয়াল সাইটে যাই' },
        { id: '2', textBn: 'ঠিক ডাউনলোড বোতামে ক্লিক করি (বিজ্ঞাপনে নয়)' },
        { id: '3', textBn: 'Downloads ফোল্ডারে ফাইলের নাম দেখে ইনস্টলার খুলি' },
        { id: '4', textBn: 'ধাপগুলো পার করে Install চাপি (পাসওয়ার্ড চাইলে নিজেরটি দিই)' },
        { id: '5', textBn: 'টার্মিনালে --version লিখে যাচাই করি' },
      ],
      hintBn: 'আগে সাইট বেছে নিতে হয়, তারপর নামানো, তারপর ইনস্টল, শেষে যাচাই।',
      explanationBn: 'ঠিক! সাইট → বোতাম → ইনস্টলার → Install → যাচাই। সবচেয়ে বড় সতর্কতা প্রথম ধাপে।',
    },
    {
      id: 'q-address', type: 'clickTarget', questionBn: 'Node.js-এর অফিসিয়াল ওয়েবসাইটের ঠিকানা কোনটি?',
      items: [
        { id: 'a', labelBn: 'n0dejs.org', icon: '🌐' },
        { id: 'b', labelBn: 'nodejs.org', icon: '🌐' },
        { id: 'c', labelBn: 'nodejs-free-download.net', icon: '🌐' },
        { id: 'd', labelBn: 'nodejs.org.fast-setup.example', icon: '🌐' },
      ],
      correct: 'b',
      hintBn: 'প্রথমটিতে o-এর জায়গায় শূন্য (0) আছে। তৃতীয় আর চতুর্থটিতে বাড়তি শব্দ জোড়া। হুবহু ছোট ঠিকানাটি খুঁজুন।',
      explanationBn: 'ঠিক ধরেছেন: nodejs.org। বাকিগুলোতে হয় o-এর জায়গায় 0, নয়তো বাড়তি শব্দ আর অন্য মালিকের নাম।',
    },
    {
      id: 'q-path', type: 'multipleChoice', osVariant: 'windows', questionBn: 'Windows-এ Python ইনস্টলারে “Add python.exe to PATH” ঘরে টিক না দিলে কী হতে পারে?',
      options: [
        { id: 'a', textBn: 'কিছুই হবে না, সব ঠিক চলবে' },
        { id: 'b', textBn: 'টার্মিনালে python লিখলে কম্পিউটার কমান্ডটি চিনতে পারবে না' },
        { id: 'c', textBn: 'কম্পিউটার বন্ধ হয়ে যাবে' },
      ],
      correct: ['b'],
      hintBn: 'PATH হলো কমান্ড কোথায় খুঁজতে হবে তার তালিকা। তালিকায় না থাকলে খুঁজে পাবে না।',
      explanationBn: 'ঠিক। টিক না দিলে টার্মিনাল python চেনে না (“not recognized”)। সমাধান: ইনস্টলার আবার চালিয়ে টিক দেওয়া।',
    },
    {
      id: 'q-lts', type: 'multipleChoice', osVariant: 'mac', questionBn: 'Node.js নামানোর সময় LTS বেছে নেওয়া ভালো কেন?',
      options: [
        { id: 'a', textBn: 'LTS সংস্করণ দীর্ঘ সময় ভুল সারানো ও নিরাপত্তার সাহায্য পায়, আর স্থিতিশীল' },
        { id: 'b', textBn: 'LTS-এর দাম কম' },
        { id: 'c', textBn: 'Current সংস্করণ Mac-এ চলে না' },
      ],
      correct: ['a'],
      hintBn: 'LTS-এর পুরো নাম Long Term Support — “দীর্ঘমেয়াদি সমর্থন”।',
      explanationBn: 'ঠিক। LTS স্থিতিশীল আর অনেক দিন সাহায্য পায়, তাই শিক্ষার্থীর জন্য সবচেয়ে নিরাপদ বাছাই। দাম দুটোরই একই (বিনামূল্যে)।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'প্রতিটি টুলের সাথে তার কাজ মিলিয়ে দিন।',
      pairs: [
        { id: 'editor', leftBn: 'কোড এডিটর', rightBn: 'কোড লেখার রং-করা, গোছানো খাতা' },
        { id: 'python', leftBn: 'Python', rightBn: 'পাইথন ভাষার প্রোগ্রাম চালায়' },
        { id: 'node', leftBn: 'Node.js', rightBn: 'কম্পিউটারে জাভাস্ক্রিপ্ট চালায়' },
        { id: 'git', leftBn: 'Git', rightBn: 'কাজের সেভ পয়েন্ট জমায়' },
        { id: 'github', leftBn: 'GitHub', rightBn: 'ইন্টারনেটে কোডের কপি রাখে ও ভাগ করে' },
      ],
      hintBn: 'Git আর GitHub দুটি আলাদা জিনিস: একটি সেভ পয়েন্ট, অন্যটি অনলাইন জায়গা।',
      explanationBn: 'সবগুলো মিলেছে! এডিটর লেখার জন্য, Python আর Node.js চালানোর জন্য, Git সেভ পয়েন্টের জন্য, GitHub অনলাইনে রাখার জন্য।',
    },
    {
      id: 'q-popup', type: 'multipleChoice', questionBn: 'কাজ করতে করতে হঠাৎ একটি পপ-আপ এলো: “আপনার Python পুরোনো! এখনই আপডেট করুন”, সাথে একটি বড় সবুজ বোতাম। কী করবেন?',
      options: [
        { id: 'a', textBn: 'সবুজ বোতামে ক্লিক করে আপডেট করে নেব' },
        { id: 'b', textBn: 'পপ-আপ বন্ধ করব। দরকার হলে নিজে www.python.org ঠিকানা টাইপ করে সেখান থেকে দেখব' },
        { id: 'c', textBn: 'পপ-আপে যা চায় সেই পাসওয়ার্ড দিয়ে দেব' },
      ],
      correct: ['b'],
      hintBn: 'আপনি যে আপডেট চাননি, হঠাৎ আসা সেই পপ-আপে ভরসা না করাই ভালো। নিজে ঠিকানা টাইপ করে অফিসিয়াল সাইটে যেতে হয়।',
      explanationBn: 'ঠিক। হঠাৎ আসা পপ-আপ বা বিজ্ঞাপনের “আপডেট” প্রায়ই ফাঁদ। সবসময় নিজে অফিসিয়াল সাইটে (বা কম্পিউটারের নিজের আপডেটে) যান, আর পাসওয়ার্ড কখনো দেবেন না।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'কোড এডিটর (যেমন VS Code) নোটপ্যাডের চেয়ে বেশি সাহায্য করে: রং, ফাঁক ঠিক রাখা, ফাইল-ফোল্ডারের তালিকা।',
      'অফিসিয়াল ঠিকানা: code.visualstudio.com (VS Code), www.python.org (Python), nodejs.org (Node.js)। অক্ষর ধরে ধরে মেলান।',
      'সার্চের “Ad” ফলাফল আর পাতার ভেতরের বড় রঙিন ডাউনলোড বোতাম এড়ান। ফাইলের নাম আর প্রকাশক দেখুন। অতিরিক্ত টুলবার বা এক্সটেনশনে “না” বলুন।',
      'Windows-এ Python ইনস্টলে “Add python.exe to PATH” টিক দিন। Node.js-এ LTS নিন। Windows-এ .exe বা .msi, Mac-এ .pkg (VS Code-এর জন্য সাধারণত .zip বা .dmg)।',
      'ইনস্টলের সময় অ্যাডমিন পাসওয়ার্ড (বা Windows-এ Yes) চাইতে পারে — শুধু নিজে শুরু করলে তবেই দিন।',
      'যাচাই: Windows-এ python --version, Mac-এ python3 --version; দুই কম্পিউটারেই node --version, git --version। “not recognized” / “command not found” মানে বসেনি বা খুঁজে পাচ্ছে না।',
      'ফোল্ডার: Documents/coding → html-css, python, javascript, projects। এক্সটেনশন শুধু অফিসিয়াল মার্কেটপ্লেস থেকে, ঠিক প্রকাশক আর বেশি ইনস্টল-সংখ্যা দেখে।',
      'Git = সেভ পয়েন্ট, GitHub = অনলাইনে কপি ও ভাগাভাগি (ইমেইল লাগে)। এখনই ইনস্টল জরুরি নয়।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন — স্বামীর সাথে বসে। ধীরে ধীরে, তাড়াহুড়ো ছাড়া।',
    tasksBn: [
      'চিট শিট থেকে “সেটআপ চেকলিস্ট” খুলে (প্রিন্ট করতেও পারেন) দুজনে মিলে ঠিকানা অক্ষর ধরে মিলিয়ে নিন। তারপর code.visualstudio.com, www.python.org আর nodejs.org থেকে প্রোগ্রামগুলো নামিয়ে ইনস্টল করুন। Node.js-এ LTS নেবেন।',
      'ইনস্টল শেষে টার্মিনাল খুলে সংস্করণ দেখুন: python --version (Mac-এ python3 --version) এবং node --version। কোনো ভুল-বার্তা এলে স্ক্রিনের ছবি তুলে রাখুন।',
      'Documents-এর ভেতরে coding নামে ফোল্ডার বানিয়ে তাতে html-css, python, javascript, projects ফোল্ডার রাখুন। VS Code-এ ফোল্ডারটি খুলে Python এক্সটেনশন ইনস্টল করুন (প্রকাশক আর ইনস্টল-সংখ্যা দেখে)।',
    ],
    windowsTasksBn: ['Python ইনস্টলে “Add python.exe to PATH” টিক দিতে ভুলবেন না। ইনস্টল শেষে টার্মিনাল (PowerShell) বন্ধ করে নতুন করে খুলে তারপর যাচাই করুন।'],
    macTasksBn: ['অ্যাডমিন পাসওয়ার্ড চাইলে নিজের কম্পিউটারের পাসওয়ার্ড দিন। VS Code-এর ডাউনলোড করা ফাইলটি (.zip বা .dmg) খুলে অ্যাপটি Applications ফোল্ডারে টেনে আনুন। Git এখনই ইনস্টল না করলেও চলে।'],
  },

  teacherTipBn:
    'আসল ইনস্টলেশন দুজনে একসাথে করুন। অ্যাডমিন পাসওয়ার্ডের পপ-আপ আসবে, তাই আগে থেকে বলে রাখুন যে এটি স্বাভাবিক। তাড়া করবেন না; প্রতিটি পাতা পড়ে এগোন। কোনো ভুল-বার্তা এলে স্ক্রিনের ছবি তুলে রাখুন — সেটি সমস্যা খোঁজার সবচেয়ে বড় সূত্র। ডাউনলোডের আগে ঠিকানাটি প্রতি অক্ষর একসাথে জোরে পড়ে মেলান; এই অভ্যাসটাই সবচেয়ে বড় নিরাপত্তা। সম্ভব হলে ইনস্টলের আগে একবার অফিসিয়াল সাইটের ঠিকানা বুকমার্ক করে নিন।',
}

export default lesson
