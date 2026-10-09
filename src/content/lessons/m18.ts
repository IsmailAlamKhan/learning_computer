import type { Lesson, SimSetup, Step } from '../../engine/types'
import { beginToolPractice } from '../../sim/apps/extra-support/toolState'
import { INSTALLER_FILES } from '../../sim/apps/extra-support/setupModel'

const DIFF = 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে'
const fW = INSTALLER_FILES.windows
const fM = INSTALLER_FILES.mac

/**
 * Module 18 — programming tools setup, cards format. Five units:
 * (1) download safely, (2) install Python, (3) install Node.js, (4) check versions in the terminal,
 * (5) coding folder, editor, extension (+ Git / GitHub overview).
 * Step targets and expectedAction semantics are the same as in the old chapters; only the words changed.
 * Merged: the "see the Ad label" tour step (its card + the pick-official step cover it).
 */

// ---------------------------------------------------------------------------------------------
// simulated starting states (each unit starts a fresh simulated computer)
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

// ---------------------------------------------------------------------------------------------
// Unit 1 — download safely
// ---------------------------------------------------------------------------------------------
const dlSteps: Step[] = [
  {
    id: 'm18-w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'আগে ব্রাউজার খুলি। স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের চারকোনা আইকন।',
  },
  {
    id: 'm18-w-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: '“Web Browser”-এ ক্লিক করুন।',
    hintBn: 'মেনুতে Web Browser লেখা আইকন।',
  },
  {
    id: 'm18-m-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'ডকের ব্রাউজার আইকনে ক্লিক করুন।',
    hintBn: 'ডকে কম্পাসের মতো গোল আইকন।',
  },
  {
    id: 'm18-search', osVariant: 'both', titleBn: 'কোড এডিটর খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search:code editor download' },
    explanationBn: 'ঠিকানার ঘরে লিখুন: code editor download, তারপর Enter।',
    hintBn: 'ঘরে ক্লিক করে ইংরেজিতে লিখুন, তারপর Enter।',
    simplerBn: 'ওপরের লম্বা ঘরে ক্লিক করুন। c-o-d-e, ফাঁকা, e-d-i-t-o-r, ফাঁকা, d-o-w-n-l-o-a-d টাইপ করে Enter চাপুন।',
  },
  {
    id: 'm18-pick-official', osVariant: 'both', titleBn: 'অফিসিয়াল ফলাফল বেছে নিন', target: 'search-result-1', expectedAction: { type: 'click', target: 'search-result-1' },
    explanationBn: 'বিজ্ঞাপনের (Ad) নিচের প্রথম ফলাফলে ক্লিক করুন।',
    hintBn: '“Ad” লেখা নেই এমন প্রথম নীল শিরোনাম: Practice Editor – Download।',
    simplerBn: 'ওপরের হলুদ-আভার ঘরে “Ad” লেখা, ওটি এড়ান। তার নিচের নীল শিরোনামে ক্লিক করুন।',
  },
  {
    id: 'm18-read-address', osVariant: 'both', titleBn: 'ঠিকানাটি অক্ষর ধরে পড়ুন', target: 'm18-banner', expectedAction: { type: 'continue' },
    explanationBn: 'ঠিকানার ঘর আর হলুদ লেখা পড়ে নিন। আসলটি সেখানে দেওয়া আছে।',
    hintBn: 'এটি অনুশীলনের নকল পাতা; আসল ঠিকানা হলুদ লেখায়। পড়ে “বুঝেছি” চাপুন।',
  },
  {
    id: 'm18-see-ad-box', osVariant: 'both', titleBn: 'পাতার ভেতরের বিজ্ঞাপন চিনুন', target: 'm18-ad-box', expectedAction: { type: 'continue' },
    explanationBn: 'নিচের সবুজ “DOWNLOAD NOW” বিজ্ঞাপন। ওতে ক্লিক করবেন না।',
    hintBn: 'বড় রঙিন বোতাম সব সময় আসল নয়। “AD” লেখাটি খুঁজুন।',
  },
  {
    id: 'm18-dl-editor', osVariant: 'both', titleBn: 'আসল Download বোতাম', target: 'm18-download-editor', expectedAction: { type: 'click', target: 'm18-download-editor' },
    explanationBn: 'ওপরের নীল Download বোতামে ক্লিক করুন।',
    hintBn: 'পাতার ওপরের বড় নীল বোতাম, যাতে আপনার কম্পিউটারের ধরন লেখা।',
    successMessageBn: 'ডাউনলোড শুরু!',
  },
  {
    id: 'm18-dl-editor-done', osVariant: 'both', titleBn: 'ডাউনলোড শেষ হওয়া পর্যন্ত অপেক্ষা', target: 'browser-downloads-panel', expectedAction: { type: 'custom', event: 'browser-download-done' },
    explanationBn: 'ফাইলের নাম দেখুন। শেষ হলে নিজে এগোবে।',
    hintBn: 'কয়েক সেকেন্ড অপেক্ষা করুন।',
  },
  {
    id: 'm18-go-python', osVariant: 'both', titleBn: 'Python-এর সাইটে যান', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://python-official.example/downloads' },
    explanationBn: 'ঠিকানার ঘরে নিজে লিখুন: python-official.example/downloads',
    hintBn: 'পুরোনো লেখা মুছে লিখুন। আসল ঠিকানা: www.python.org',
    simplerBn: 'ঠিকানার ঘরে ক্লিক করুন, সব লেখা মুছুন। হুবহু লিখুন: python-official.example/downloads, তারপর Enter।',
  },
  {
    id: 'm18-dl-python', osVariant: 'both', titleBn: 'Python ডাউনলোড করুন', target: 'm18-download-python', expectedAction: { type: 'click', target: 'm18-download-python' },
    explanationBn: 'হলুদ “Download Python” বোতামে ক্লিক করুন।',
    hintBn: 'পাতার মাঝের হলুদ বোতাম। সংস্করণ-সংখ্যা আসল সাইটে নতুন হতে পারে।',
  },
  {
    id: 'm18-dl-python-done', osVariant: 'both', titleBn: 'ডাউনলোড শেষ হোক', target: 'browser-downloads-panel', expectedAction: { type: 'custom', event: 'browser-download-done' },
    explanationBn: 'ফাইল Downloads ফোল্ডারে জমছে। অপেক্ষা করুন।',
    hintBn: 'কয়েক সেকেন্ড অপেক্ষা করুন।',
  },
  {
    id: 'm18-go-node', osVariant: 'both', titleBn: 'Node.js-এর সাইটে যান', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://node-official.example/' },
    explanationBn: 'ঠিকানার ঘরে লিখুন: node-official.example',
    hintBn: 'আসল ঠিকানা nodejs.org; অনুশীলনে ওপরের নকলটি লিখুন।',
  },
  {
    id: 'm18-node-current', osVariant: 'both', titleBn: 'Current বোতাম চিনে নিন', target: 'm18-download-node-current', expectedAction: { type: 'click', target: 'm18-download-node-current' },
    explanationBn: 'ডান পাশের ধূসর Current বোতামে ক্লিক করুন।',
    hintBn: 'এটি কিছু ডাউনলোড করবে না, শুধু একটি নোট দেখাবে।',
  },
  {
    id: 'm18-dl-node', osVariant: 'both', titleBn: 'LTS ডাউনলোড করুন', target: 'm18-download-node-lts', expectedAction: { type: 'click', target: 'm18-download-node-lts' },
    explanationBn: 'বাঁ পাশের সবুজ LTS বোতামে ক্লিক করুন।',
    hintBn: '“LTS · RECOMMENDED” লেখা সবুজ বোতাম।',
  },
  {
    id: 'm18-dl-node-done', osVariant: 'both', titleBn: 'ডাউনলোড শেষ হোক', target: 'browser-downloads-panel', expectedAction: { type: 'custom', event: 'browser-download-done' },
    explanationBn: 'তিনটি ইনস্টলারই এখন Downloads ফোল্ডারে।',
    hintBn: 'কয়েক সেকেন্ড অপেক্ষা করুন।',
  },
]

// ---------------------------------------------------------------------------------------------
// Unit 2 — install Python
// ---------------------------------------------------------------------------------------------
const pyWin: Step[] = [
  {
    id: 'm18-w-downloads', osVariant: 'windows', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'navigate', path: '~/Downloads' },
    explanationBn: 'বাঁ তালিকার “Downloads”-এ ক্লিক করুন।',
    hintBn: 'বাঁ পাশের তালিকায় Downloads লেখাটি।',
  },
  {
    id: 'm18-w-py-open', osVariant: 'windows', titleBn: 'Python-এর ইনস্টলার খুলুন', target: `fm-item-${fW.python}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fW.python}` },
    explanationBn: 'python-এর .exe ফাইলে ডাবল ক্লিক করুন।',
    hintBn: 'practice-python দিয়ে শুরু হওয়া ফাইলে পরপর দুবার ক্লিক।',
  },
  {
    id: 'm18-w-py-path', osVariant: 'windows', titleBn: '“Add python.exe to PATH” টিক দিন', target: 'setup-path', expectedAction: { type: 'click', target: 'setup-path' },
    explanationBn: '“Add python.exe to PATH” ঘরে টিক দিন।',
    hintBn: 'নিচের দিকের ছোট চৌকো ঘর। না দিলে python কমান্ড চলবে না।',
    simplerBn: '“Add python.exe to PATH” লেখার বাঁ পাশের চৌকো ঘরে একবার ক্লিক করুন, যেন টিক-চিহ্ন আসে।',
    successMessageBn: 'সবচেয়ে জরুরি ধাপ শেষ!',
  },
  {
    id: 'm18-w-py-install', osVariant: 'windows', titleBn: 'Install Now চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Install Now” চাপুন।',
    hintBn: 'নিচের ডান কোণের নীল বোতাম।',
  },
  {
    id: 'm18-w-py-close', osVariant: 'windows', titleBn: 'Close চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: '“Close” চাপুন।',
    hintBn: 'বার পূর্ণ হলে নিচের ডানে Close আসবে।',
    successMessageBn: 'Python বসে গেছে!',
  },
]
const pyMac: Step[] = [
  {
    id: 'm18-m-downloads', osVariant: 'mac', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'navigate', path: '~/Downloads' },
    explanationBn: 'বাঁ তালিকার “Downloads”-এ ক্লিক করুন।',
    hintBn: 'বাঁ পাশের তালিকায় Downloads।',
  },
  {
    id: 'm18-m-py-open', osVariant: 'mac', titleBn: 'Python-এর ইনস্টলার খুলুন', target: `fm-item-${fM.python}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fM.python}` },
    explanationBn: 'python-এর .pkg ফাইলে ডাবল ক্লিক করুন।',
    hintBn: 'practice-python দিয়ে শুরু হওয়া ফাইল।',
  },
  {
    id: 'm18-m-py-c1', osVariant: 'mac', titleBn: 'Continue চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: '“Continue” চাপুন।',
    hintBn: 'নিচের ডান পাশের Continue।',
  },
  {
    id: 'm18-m-py-c2', osVariant: 'mac', titleBn: 'আবার Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'Read Me পাতায় আবার “Continue” চাপুন।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-py-c3', osVariant: 'mac', titleBn: 'লাইসেন্সে Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'লাইসেন্সের পাতায় “Continue” চাপুন।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-py-agree', osVariant: 'mac', titleBn: 'Agree চাপুন', target: 'setup-agree', expectedAction: { type: 'click', target: 'setup-agree' },
    explanationBn: '“Agree” চাপুন।',
    hintBn: 'ছোট বাক্সের নীল Agree। এটি ছাড়া এগোনো যায় না।',
  },
  {
    id: 'm18-m-py-install', osVariant: 'mac', titleBn: 'Install চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নিচের ডানের নীল Install।',
  },
  {
    id: 'm18-m-py-pw', osVariant: 'mac', titleBn: 'পাসওয়ার্ড লিখুন', target: 'setup-password', expectedAction: { type: 'type', target: 'setup-password', text: 'practice123' },
    explanationBn: 'অনুশীলনের নকল পাসওয়ার্ড লিখুন: practice123',
    hintBn: 'ছোট হাতের অক্ষর, শেষে ১২৩। আসল Mac-এ নিজের পাসওয়ার্ড দেবেন।',
  },
  {
    id: 'm18-m-py-ok', osVariant: 'mac', titleBn: 'Install Software চাপুন', target: 'setup-password-ok', expectedAction: { type: 'click', target: 'setup-password-ok' },
    explanationBn: '“Install Software” চাপুন।',
    hintBn: 'ছোট বাক্সের নীল বোতাম।',
  },
  {
    id: 'm18-m-py-close', osVariant: 'mac', titleBn: 'Close চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: '“Close” চাপুন।',
    hintBn: 'বার পূর্ণ হলে Close আসবে। Trash-এ পাঠানোর প্রশ্ন এলে যা ইচ্ছা বেছে নিন।',
    successMessageBn: 'Python বসে গেছে!',
  },
]

// ---------------------------------------------------------------------------------------------
// Unit 3 — install Node.js
// ---------------------------------------------------------------------------------------------
const nodeWin: Step[] = [
  {
    id: 'm18-w-downloads-node', osVariant: 'windows', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'navigate', path: '~/Downloads' },
    explanationBn: 'বাঁ তালিকার “Downloads”-এ ক্লিক করুন।',
    hintBn: 'বাঁ পাশের তালিকায় Downloads লেখাটি।',
  },
  {
    id: 'm18-w-node-open', osVariant: 'windows', titleBn: 'Node.js-এর ইনস্টলার খুলুন', target: `fm-item-${fW.node}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fW.node}` },
    explanationBn: 'Node.js-এর .msi ফাইলে ডাবল ক্লিক করুন।',
    hintBn: 'practice-node দিয়ে শুরু হওয়া ফাইল।',
  },
  {
    id: 'm18-w-node-next1', osVariant: 'windows', titleBn: 'Next চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: '“Next >” চাপুন।',
    hintBn: 'নিচের ডানের Next বোতাম।',
  },
  {
    id: 'm18-w-node-accept', osVariant: 'windows', titleBn: 'শর্তে সম্মতি দিন', target: 'setup-accept', expectedAction: { type: 'click', target: 'setup-accept' },
    explanationBn: '“I accept the terms” ঘরে টিক দিন।',
    hintBn: 'লেখার নিচের ছোট চৌকো ঘর। এগোতে এটি লাগবে।',
  },
  {
    id: 'm18-w-node-next2', osVariant: 'windows', titleBn: 'Next চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: '“Next >” চাপুন।',
    hintBn: 'টিক দেওয়ার পর Next নীল হয়।',
  },
  {
    id: 'm18-w-node-next3', osVariant: 'windows', titleBn: 'ফোল্ডার ঠিক রেখে Next', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'জায়গা যেমন আছে থাক। “Next >” চাপুন।',
    hintBn: 'Next বোতাম।',
  },
  {
    id: 'm18-w-node-next4', osVariant: 'windows', titleBn: 'স্বাভাবিক পছন্দেই Next', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'পছন্দ যেমন আছে থাক। “Next >” চাপুন।',
    hintBn: '“Add to PATH” আগে থেকেই টিক দেওয়া।',
  },
  {
    id: 'm18-w-node-install', osVariant: 'windows', titleBn: 'Install চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নিচের ডানের নীল Install।',
  },
  {
    id: 'm18-w-node-uac', osVariant: 'windows', titleBn: 'অনুমতি দিন (Yes)', target: 'setup-uac-yes', expectedAction: { type: 'click', target: 'setup-uac-yes' },
    explanationBn: 'প্রকাশকের নাম দেখে “Yes” চাপুন।',
    hintBn: 'নিজে ইনস্টল শুরু করলে এটি আসা স্বাভাবিক। হঠাৎ এলে “No”।',
  },
  {
    id: 'm18-w-node-finish', osVariant: 'windows', titleBn: 'Finish চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: '“Finish” চাপুন।',
    hintBn: 'বার পূর্ণ হলে Finish আসবে।',
    successMessageBn: 'Node.js বসে গেছে!',
  },
]
const nodeMac: Step[] = [
  {
    id: 'm18-m-downloads-node', osVariant: 'mac', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'navigate', path: '~/Downloads' },
    explanationBn: 'বাঁ তালিকার “Downloads”-এ ক্লিক করুন।',
    hintBn: 'বাঁ পাশের তালিকায় Downloads।',
  },
  {
    id: 'm18-m-node-open', osVariant: 'mac', titleBn: 'Node.js-এর ইনস্টলার খুলুন', target: `fm-item-${fM.node}`, expectedAction: { type: 'doubleClick', target: `fm-item-${fM.node}` },
    explanationBn: 'Node.js-এর .pkg ফাইলে ডাবল ক্লিক করুন।',
    hintBn: 'practice-node দিয়ে শুরু হওয়া ফাইল।',
  },
  {
    id: 'm18-m-node-c1', osVariant: 'mac', titleBn: 'Continue চাপুন', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: '“Continue” চাপুন।',
    hintBn: 'নিচের ডানের Continue।',
  },
  {
    id: 'm18-m-node-c2', osVariant: 'mac', titleBn: 'লাইসেন্সে Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'লাইসেন্সের পাতায় “Continue” চাপুন।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-node-agree', osVariant: 'mac', titleBn: 'Agree চাপুন', target: 'setup-agree', expectedAction: { type: 'click', target: 'setup-agree' },
    explanationBn: '“Agree” চাপুন।',
    hintBn: 'নীল Agree বোতাম।',
  },
  {
    id: 'm18-m-node-c3', osVariant: 'mac', titleBn: 'জায়গা ঠিক রেখে Continue', target: 'setup-next', expectedAction: { type: 'click', target: 'setup-next' },
    explanationBn: 'জায়গা যেমন আছে থাক। “Continue” চাপুন।',
    hintBn: 'Continue বোতাম।',
  },
  {
    id: 'm18-m-node-install', osVariant: 'mac', titleBn: 'Install চাপুন', target: 'setup-install', expectedAction: { type: 'click', target: 'setup-install' },
    explanationBn: '“Install” চাপুন।',
    hintBn: 'নীল Install বোতাম।',
  },
  {
    id: 'm18-m-node-pw', osVariant: 'mac', titleBn: 'পাসওয়ার্ড লিখুন', target: 'setup-password', expectedAction: { type: 'type', target: 'setup-password', text: 'practice123' },
    explanationBn: 'নকল পাসওয়ার্ড লিখুন: practice123',
    hintBn: 'ঘরে লিখুন: practice123',
  },
  {
    id: 'm18-m-node-ok', osVariant: 'mac', titleBn: 'Install Software চাপুন', target: 'setup-password-ok', expectedAction: { type: 'click', target: 'setup-password-ok' },
    explanationBn: '“Install Software” চাপুন।',
    hintBn: 'ছোট বাক্সের নীল বোতাম।',
  },
  {
    id: 'm18-m-node-close', osVariant: 'mac', titleBn: 'Close চাপুন', target: 'setup-finish', expectedAction: { type: 'click', target: 'setup-finish' },
    explanationBn: '“Close” চাপুন।',
    hintBn: 'বার পূর্ণ হলে Close আসবে।',
    successMessageBn: 'Node.js বসে গেছে!',
  },
]

// ---------------------------------------------------------------------------------------------
// Unit 4 — check in the terminal
// ---------------------------------------------------------------------------------------------
const checkSteps: Step[] = [
  {
    id: 'm18-py-version-w', osVariant: 'windows', titleBn: 'Python-এর সংস্করণ দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['python --version', 'python -V'] },
    explanationBn: 'লিখুন: python --version, তারপর Enter।',
    hintBn: 'python, একটি ফাঁকা, তারপর দুটি ড্যাশ আর version।',
    simplerBn: 'কালো জায়গায় ক্লিক করে p-y-t-h-o-n, ফাঁকা, দুটি মাইনাস (--), v-e-r-s-i-o-n টাইপ করে Enter চাপুন।',
    successMessageBn: 'সংখ্যা এসেছে, ইনস্টল ঠিক!',
  },
  {
    id: 'm18-py-version-m', osVariant: 'mac', titleBn: 'Python-এর সংস্করণ দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['python3 --version', 'python3 -V'] },
    explanationBn: 'Mac-এ নাম python3। লিখুন: python3 --version, তারপর Enter।',
    hintBn: 'python3, একটি ফাঁকা, তারপর দুটি ড্যাশ আর version।',
    simplerBn: 'কালো জায়গায় ক্লিক করে p-y-t-h-o-n-3, ফাঁকা, দুটি মাইনাস (--), v-e-r-s-i-o-n টাইপ করে Enter চাপুন।',
    successMessageBn: 'সংখ্যা এসেছে, ইনস্টল ঠিক!',
  },
  {
    id: 'm18-node-version', osVariant: 'both', titleBn: 'Node.js-এর সংস্করণ দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['node --version', 'node -v'] },
    explanationBn: 'লিখুন: node --version, তারপর Enter।',
    hintBn: 'node, ফাঁকা, তারপর --version। উত্তরে v দিয়ে সংখ্যা আসবে।',
  },
  {
    id: 'm18-git-version', osVariant: 'both', titleBn: 'Git চেষ্টা করে দেখুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['git --version', 'git -v'] },
    explanationBn: 'লিখুন: git --version। ভুলের বার্তা এলে ঘাবড়াবেন না।',
    hintBn: 'Git এখনও বসাইনি, তাই বার্তা আসবে: “এখনও বসানো নেই”।',
  },
  {
    id: 'm18-read-error', osVariant: 'both', titleBn: 'ভুলের বার্তাটি পড়ুন', target: 'terminal-output', expectedAction: { type: 'continue' },
    explanationBn: 'বার্তাটি পড়ুন: কমান্ডটি খুঁজে পায়নি।',
    hintBn: 'পড়া শেষ হলে “বুঝেছি” চাপুন।',
  },
]

// ---------------------------------------------------------------------------------------------
// Unit 5 — coding folder, editor, extension
// ---------------------------------------------------------------------------------------------
const folderSteps: Step[] = [
  {
    id: 'm18-cd-docs', osVariant: 'both', titleBn: 'Documents ফোল্ডারে যান', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['cd Documents', 'cd ~/Documents', 'cd ./Documents'] },
    explanationBn: 'লিখুন: cd Documents',
    hintBn: 'cd, ফাঁকা, তারপর Documents (D বড় হাতের)।',
  },
  {
    id: 'm18-mk-coding', osVariant: 'both', titleBn: 'coding ফোল্ডার বানান', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding', kind: 'folder' },
    explanationBn: 'লিখুন: mkdir coding',
    hintBn: 'mkdir, ফাঁকা, তারপর coding।',
  },
  {
    id: 'm18-cd-coding', osVariant: 'both', titleBn: 'coding-এর ভেতরে যান', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['cd coding', 'cd ./coding'] },
    explanationBn: 'লিখুন: cd coding',
    hintBn: 'cd, ফাঁকা, তারপর coding।',
  },
  {
    id: 'm18-mk-html', osVariant: 'both', titleBn: 'html-css ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/html-css', kind: 'folder' },
    explanationBn: 'ওয়েবপেজের জন্য লিখুন: mkdir html-css',
    hintBn: 'মাঝে একটি মাইনাস (-) চিহ্ন।',
  },
  {
    id: 'm18-mk-python', osVariant: 'both', titleBn: 'python ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/python', kind: 'folder' },
    explanationBn: 'লিখুন: mkdir python',
    hintBn: 'mkdir, ফাঁকা, তারপর python।',
  },
  {
    id: 'm18-mk-js', osVariant: 'both', titleBn: 'javascript ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/javascript', kind: 'folder' },
    explanationBn: 'লিখুন: mkdir javascript',
    hintBn: 'mkdir, ফাঁকা, তারপর javascript।',
  },
  {
    id: 'm18-mk-projects', osVariant: 'both', titleBn: 'projects ফোল্ডার', target: 'terminal-input', expectedAction: { type: 'fileExists', path: '~/Documents/coding/projects', kind: 'folder' },
    explanationBn: 'বড় কাজের জন্য লিখুন: mkdir projects',
    hintBn: 'mkdir, ফাঁকা, তারপর projects।',
  },
  {
    id: 'm18-code-dot', osVariant: 'both', titleBn: 'এডিটরে ফোল্ডারটি খুলুন', target: 'terminal-input', expectedAction: { type: 'typeCommand', command: ['code .', 'code ./'] },
    explanationBn: 'লিখুন: code . (code, ফাঁকা, একটি ডট)',
    hintBn: 'ডট মানে “এই ফোল্ডার”। শুধু একটি ডট দিন।',
    simplerBn: 'c-o-d-e টাইপ করুন, স্পেস চাপুন, তারপর একটি ফুলস্টপ (.) দিয়ে Enter চাপুন।',
  },
  {
    id: 'm18-see-editor', osVariant: 'both', titleBn: 'এডিটরের ফোল্ডার-তালিকা', target: 'code-explorer', expectedAction: { type: 'continue' },
    explanationBn: 'বাঁ তালিকায় আপনার চারটি ফোল্ডার দেখুন।',
    hintBn: 'দেখা শেষ হলে “বুঝেছি” চাপুন।',
  },
  {
    id: 'm18-w-ext-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'আসল VS Code-এ শর্টকাট Ctrl + Shift + X। এখানে আলাদা উইন্ডোতে দেখাচ্ছি।',
  },
  {
    id: 'm18-w-ext-search', osVariant: 'windows', titleBn: 'সার্চে লিখুন', target: 'start-search', expectedAction: { type: 'type', target: 'start-search', text: 'extensions', ignoreCase: true },
    explanationBn: 'সার্চ ঘরে লিখুন: extensions',
    hintBn: 'সার্চ ঘরে লিখুন: extensions',
  },
  {
    id: 'm18-w-ext-open', osVariant: 'windows', titleBn: 'Extensions Marketplace খুলুন', target: 'start-app-extensions', expectedAction: { type: 'openApp', app: 'extensions' },
    explanationBn: '“Extensions Marketplace”-এ ক্লিক করুন।',
    hintBn: 'তালিকার প্রথম ফলাফল।',
  },
  {
    id: 'm18-m-ext-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
    explanationBn: 'ডকের লঞ্চপ্যাডে ক্লিক করুন।',
    hintBn: 'আসল VS Code-এ শর্টকাট Cmd + Shift + X। এখানে আলাদা উইন্ডোতে দেখাচ্ছি।',
  },
  {
    id: 'm18-m-ext-open', osVariant: 'mac', titleBn: 'Extensions Marketplace খুলুন', target: 'launchpad-app-extensions', expectedAction: { type: 'openApp', app: 'extensions' },
    explanationBn: '“Extensions Marketplace”-এ ক্লিক করুন।',
    hintBn: 'বেগুনি ব্লকের আইকন।',
  },
  {
    id: 'm18-ext-checklist', osVariant: 'both', titleBn: 'আগে যাচাই করুন', target: 'ext-checklist', expectedAction: { type: 'continue' },
    explanationBn: 'প্রকাশক, ইনস্টল-সংখ্যা, রেটিং — এই তিনটি দেখুন।',
    hintBn: 'দুটি “Python Support” আছে। নীল বাক্স পড়ে “বুঝেছি” চাপুন।',
  },
  {
    id: 'm18-ext-install', osVariant: 'both', titleBn: 'ঠিকটি ইনস্টল করুন', target: 'ext-install-python-support', expectedAction: { type: 'custom', event: 'extension-installed:python-support' },
    explanationBn: 'প্রকাশক verified, ইনস্টল 41.2M — সেটির Install চাপুন।',
    hintBn: 'যেটির নামে PRO বা FREE!! নেই, তার নীল Install বোতাম।',
    simplerBn: 'দুটির মধ্যে যেটির নিচে “verified” আর সংখ্যা 41.2M, সেটির Install চাপুন।',
    successMessageBn: 'ঠিকটিই বেছেছেন!',
  },
]

// ---------------------------------------------------------------------------------------------
const lesson: Lesson = {
  module: 18,
  part: 2,
  id: 'm18',
  titleBn: 'প্রোগ্রামিং টুলস সেটআপ',
  oneLineBn: 'কোড এডিটর, Python আর Node.js নিরাপদে ডাউনলোড করে ইনস্টল করি, টার্মিনালে যাচাই করি আর কোডিংয়ের ফোল্ডার সাজাই।',
  minutes: 12,
  glossaryIds: ['tool-code-editor', 'tool-vscode', 'tool-installer', 'tool-official-website', 'tool-download', 'tool-path', 'tool-version', 'tool-python', 'tool-nodejs', 'tool-lts', 'tool-extension', 'tool-git', 'tool-github', 'tool-repository', 'tool-admin-password', 'tool-coding-folder'],

  units: [
    // =====================================================================================================
    {
      id: 'download',
      titleBn: 'নিরাপদে ডাউনলোড',
      hook: {
        id: 'h-dl',
        type: 'hook',
        textBn: 'ডাউনলোডের বোতামে ক্লিকের আগে **১০ সেকেন্ড** থামুন। মডিউল ৭ আর ৯-এর কথা মনে আছে তো?',
        visual: { kind: 'art', name: 'shield', captionBn: 'আগে ঠিকানা, তারপর ক্লিক' },
      },
      cards: [
        {
          id: 'c-editor',
          type: 'compare',
          textBn: '**কোড এডিটর** হলো কোড লেখার রঙিন খাতা। নোটপ্যাডের সাদা কাগজে ভুল চোখে পড়ে না।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'notebook' }, labelBn: 'নোটপ্যাড', captionBn: 'সাদা কাগজ' },
            right: { visual: { kind: 'mock', name: 'code-editor', highlight: 'editor' }, labelBn: 'কোড এডিটর', captionBn: 'রং আর ফোল্ডার-তালিকা' },
            vs: 'বনাম',
          },
          chipsBn: ['VS Code বিনামূল্যের', 'রং দিয়ে কোড চেনায়'],
          learnMoreBn: 'কোড এডিটর কোডের অংশগুলো রং দিয়ে আলাদা করে, লাইনের ফাঁক (ইন্ডেন্টেশন) ঠিক রাখে আর পাশে ফাইল-ফোল্ডারের তালিকা দেখায়। VS Code (Visual Studio Code) একটি জনপ্রিয় বিনামূল্যের এডিটর; আমরা সেটিই উদাহরণ নিচ্ছি। অন্য এডিটরও আছে।',
        },
        {
          id: 'c-map',
          type: 'visual',
          textBn: 'পারেন? পাঁচটি টুলের নামে ক্লিক করে কাজ দেখুন।',
          visual: { kind: 'widget', widget: 'tool-map' },
        },
        {
          id: 'c-official',
          type: 'visual',
          textBn: 'শুধু **অফিসিয়াল সাইট** থেকে ডাউনলোড করবেন। ঠিকানা অক্ষর ধরে মেলান।',
          visual: { kind: 'mock', name: 'browser', highlight: 'address-bar', captionBn: 'আগে ঠিকানার ঘরটি দেখুন' },
          chipsBn: ['code.visualstudio.com', 'www.python.org', 'nodejs.org'],
          learnMoreBn: 'নকল সাইটের ঠিকানা প্রায় একই দেখায়, যেমন o-এর জায়গায় 0। সার্চে সবার ওপরের “Ad” প্রায়ই টাকা দিয়ে বসানো, তাই ঠিকানা নিজে টাইপ করুন বা বুকমার্ক থেকে যান। অনুশীলনের সাইটের ঠিকানা .example দিয়ে শেষ, কারণ ওগুলো নকল; আসল ঠিকানা পাতার হলুদ লেখায় দেওয়া আছে।',
        },
        {
          id: 'c-check',
          type: 'visual',
          textBn: 'পারেন? কোন ঠিকানাটি আসল আর কোনটি নকল, খুঁজে বের করুন।',
          visual: { kind: 'widget', widget: 'tool-address-check' },
        },
        {
          id: 'c-ad',
          type: 'compare',
          textBn: 'পাতার ভেতরের বড় সবুজ “DOWNLOAD NOW” প্রায়ই **বিজ্ঞাপন**। আসল বোতামে আপনার কম্পিউটারের ধরন লেখা থাকে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'আসল', captionBn: 'Windows / macOS লেখা' },
            right: { visual: { kind: 'art', name: 'warning' }, labelBn: 'ফাঁদ', captionBn: 'বড় সবুজ, “AD”' },
            vs: 'বনাম',
          },
          chipsBn: ['“Ad” এড়ান', 'ধরন লেখা বোতাম আসল'],
        },
        {
          id: 'c-file',
          type: 'visual',
          textBn: 'ডাউনলোডের পর **ফাইলের নাম** আর শেষ অংশ দেখুন। অদ্ভুত কিছু দেখলে থামুন।',
          visual: { kind: 'art', name: 'download', captionBn: 'যেমন exe, msi, pkg' },
          chipsBn: ['Windows: exe, msi', 'Mac: pkg', 'VS Code Mac: zip'],
          learnMoreBn: 'অদ্ভুত শেষ-অংশ (যেমন .zip.exe) দেখলে থামুন। Mac-এ VS Code-এর ফাইলটি সাধারণত .zip (কখনো .dmg); খুলে অ্যাপটি Applications ফোল্ডারে টেনে আনতে হয়। ইনস্টলার কোনো টুলবার, এক্সটেনশন বা “অফার” ইনস্টল করতে চাইলে “না” বলুন। এই তিনটি আসল প্রোগ্রামে সাধারণত এসব থাকে না; থাকলে থেমে কাউকে জিজ্ঞেস করুন। ' + DIFF + '।',
        },
      ],
      steps: dlSteps,
      setup: setupDownload,
      quiz: [
        {
          id: 'q-address', type: 'clickTarget', questionBn: 'Node.js-এর আসল ওয়েবসাইট কোনটি?',
          items: [
            { id: 'a', labelBn: 'n0dejs.org' },
            { id: 'b', labelBn: 'nodejs.org' },
            { id: 'c', labelBn: 'nodejs-free-download.net' },
            { id: 'd', labelBn: 'nodejs.org.fast-setup.example' },
          ],
          correct: 'b',
          hintBn: 'শূন্য (0) আর বাড়তি শব্দ খুঁজুন।',
          explanationBn: 'nodejs.org। বাকিগুলোতে 0 বা বাড়তি শব্দ আছে।',
        },
        {
          id: 'q-ad', type: 'multipleChoice', questionBn: 'পাতায় বড় সবুজ “DOWNLOAD NOW” দেখলে কী করবেন?',
          options: [
            { id: 'a', textBn: 'ক্লিক করব, বড় বোতামই আসল' },
            { id: 'b', textBn: 'এড়িয়ে নিজের কম্পিউটারের ধরন লেখা বোতাম খুঁজব' },
            { id: 'c', textBn: 'পাসওয়ার্ড দিয়ে দেব' },
          ],
          correct: ['b'],
          hintBn: 'বড় রঙিন বোতাম প্রায়ই বিজ্ঞাপন।',
          explanationBn: 'ঠিক। আসল বোতামে Windows বা macOS লেখা থাকে।',
        },
        {
          id: 'q-popup', type: 'multipleChoice', questionBn: 'হঠাৎ পপ-আপ: “আপনার Python পুরোনো! এখনই আপডেট করুন।” কী করবেন?',
          options: [
            { id: 'a', textBn: 'সবুজ বোতামে ক্লিক করব' },
            { id: 'b', textBn: 'বন্ধ করব; দরকারে নিজে www.python.org টাইপ করব' },
            { id: 'c', textBn: 'পপ-আপ যা চায়, সেই পাসওয়ার্ড দেব' },
          ],
          correct: ['b'],
          hintBn: 'আপনি যা চাননি, হঠাৎ আসা সেই পপ-আপে ভরসা নয়।',
          explanationBn: 'ঠিক। নিজে ঠিকানা টাইপ করে অফিসিয়াল সাইটে যান।',
        },
      ],
      recapBn: ['শুধু অফিসিয়াল ঠিকানা', 'বড় সবুজ “Ad” বোতাম এড়ান', 'ফাইলের নাম দেখে নিন'],
      freeTryBn: 'ঠিকানা না দেখে কোনো ডাউনলোড বোতাম চাপবেন না।',
    },

    // =====================================================================================================
    {
      id: 'python',
      titleBn: 'Python ইনস্টল',
      hook: {
        id: 'h-py',
        type: 'hook',
        textBn: 'ইনস্টল মানে একটি ছোট ফাইল খুলে প্রোগ্রামটিকে কম্পিউটারে **বসানো**।',
        visual: { kind: 'art', name: 'python-snake', captionBn: 'Python' },
      },
      cards: [
        {
          id: 'c-dbl',
          type: 'visual',
          textBn: 'Downloads ফোল্ডারে ইনস্টলার ফাইলে **ডাবল ক্লিক** করলেই ইনস্টল শুরু হয়।',
          visual: { kind: 'demo', gesture: 'double-click', captionBn: 'টুক-টুক!' },
          chipsBn: ['Windows: .exe', 'Mac: .pkg'],
          learnMoreBn: 'ইনস্টলার হলো একটি ছোট ফাইল (.exe, .msi, .pkg, .dmg), যেটি খুললে প্রোগ্রাম আপনার কম্পিউটারে বসে যায়। আসল কম্পিউটারে নিরাপত্তা-সতর্কবার্তা এলে “Publisher” (প্রকাশক) দেখে নিন।',
        },
        {
          id: 'c-path',
          type: 'compare',
          osVariant: 'windows',
          textBn: 'Windows-এ সবচেয়ে জরুরি: ইনস্টলারের **PATH** ঘরে টিক দিন। নইলে টার্মিনাল python চিনবে না।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'টিক দিলে', captionBn: 'python কমান্ড চলে' },
            right: { visual: { kind: 'art', name: 'cross' }, labelBn: 'টিক না দিলে', captionBn: '“not recognized”' },
            vs: 'বনাম',
          },
          learnMoreBn: 'PATH হলো কম্পিউটারের একটি তালিকা, যাতে লেখা থাকে টার্মিনালে কমান্ড লিখলে সেটি কোথায় খুঁজতে হবে। এটি ফাইলের “পথ” নয়, আলাদা জিনিস। টিক ভুলে গেলে ইনস্টলার আবার চালিয়ে টিক দিন।',
        },
        {
          id: 'c-mac-flow',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'Mac-এর ইনস্টলার একই ধাঁচে চলে: Continue, Agree, Install, তারপর **পাসওয়ার্ড**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'hand-click', labelBn: 'Continue' },
              { art: 'check', labelBn: 'Agree' },
              { art: 'package-box', labelBn: 'Install' },
              { art: 'key', labelBn: 'পাসওয়ার্ড' },
            ],
          },
          learnMoreBn: 'নতুন macOS-এ python3 আগে থেকেও থাকতে পারে, বা প্রথমবার লিখলে ডেভেলপার টুলস ইনস্টলের পপ-আপ আসতে পারে। ' + DIFF + '। ইনস্টল শেষে ইনস্টলার ফাইলটি Trash-এ পাঠাতে চাইলে জিজ্ঞেস করতে পারে।',
        },
        {
          id: 'c-admin',
          type: 'visual',
          textBn: 'ইনস্টল একটি বড় কাজ, তাই কম্পিউটার **অ্যাডমিন পাসওয়ার্ড** (বা Windows-এ “Yes”) চায়। নিজে শুরু করলে তবেই দিন।',
          visual: { kind: 'art', name: 'key', captionBn: 'হঠাৎ এলে দেবেন না' },
          chipsBn: ['নিজে শুরু করলে দিন', 'হঠাৎ এলে “না”'],
          learnMoreBn: 'বিজ্ঞাপন চাপার পরে এলে বা নিজে থেকে এলে কখনো পাসওয়ার্ড দেবেন না। ইনস্টলের জন্য কম্পিউটারে খালি জায়গা লাগে, আর Windows Update / Software Update মাঝে মাঝে করে নেওয়া ভালো।',
        },
        {
          id: 'c-done',
          type: 'visual',
          textBn: 'শেষে “successful” লেখা এলে **Close** চাপুন। Python কম্পিউটারে বসে গেল!',
          visual: { kind: 'art', name: 'package-box', captionBn: 'বসে গেছে' },
        },
      ],
      steps: [...pyWin, ...pyMac],
      setup: setupInstall,
      quiz: [
        {
          id: 'q-path', type: 'multipleChoice', questionBn: 'Windows-এ Python ইনস্টলে PATH-এ টিক না দিলে কী হয়?',
          options: [
            { id: 'a', textBn: 'কিছুই হয় না' },
            { id: 'b', textBn: 'টার্মিনাল python কমান্ড চিনতে পারে না' },
            { id: 'c', textBn: 'কম্পিউটার বন্ধ হয়ে যায়' },
          ],
          correct: ['b'],
          hintBn: 'PATH হলো কমান্ড কোথায় খুঁজবে তার তালিকা।',
          explanationBn: 'ঠিক। তালিকায় না থাকলে “not recognized” আসে।',
        },
        {
          id: 'q-admin', type: 'multipleChoice', questionBn: 'ইনস্টলের সময় পাসওয়ার্ড বা “Yes” চাইলে কখন দেওয়া ঠিক?',
          options: [
            { id: 'a', textBn: 'নিজে ইনস্টল শুরু করলে' },
            { id: 'b', textBn: 'যেকোনো পপ-আপ এলে' },
            { id: 'c', textBn: 'বিজ্ঞাপন চাপার পর' },
          ],
          correct: ['a'],
          hintBn: 'কাজটা আপনি নিজে শুরু করেছেন কি না, সেটাই প্রশ্ন।',
          explanationBn: 'ঠিক। হঠাৎ আসা চাওয়ায় সাড়া দেবেন না।',
        },
        {
          id: 'q-order', type: 'ordering', questionBn: 'Python ইনস্টলের ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'Downloads-এ ইনস্টলার খুলি' },
            { id: '2', textBn: 'PATH বা শর্তে সম্মতি দিই' },
            { id: '3', textBn: 'Install চাপি' },
            { id: '4', textBn: 'শেষে Close চাপি' },
          ],
          hintBn: 'আগে ফাইল খুলুন, সবার শেষে Close।',
          explanationBn: 'খোলা, সম্মতি, Install, Close।',
        },
      ],
      recapBn: ['ইনস্টলার = ডাবল ক্লিক করে খোলা ফাইল', 'Windows: PATH-এ টিক দিন', 'পাসওয়ার্ড শুধু নিজে শুরু করলে'],
    },

    // =====================================================================================================
    {
      id: 'node',
      titleBn: 'Node.js ইনস্টল',
      hook: {
        id: 'h-node',
        type: 'hook',
        textBn: 'এবার দ্বিতীয় টুল **Node.js** — এটি জাভাস্ক্রিপ্টকে ব্রাউজারের বাইরেও চালায়।',
        visual: { kind: 'art', name: 'braces', captionBn: 'Node.js' },
      },
      cards: [
        {
          id: 'c-lts',
          type: 'compare',
          textBn: 'দুটি বোতাম: **LTS** স্থিতিশীল আর অনেক বছর সাহায্য পায়। Current-এ নতুন, পরীক্ষামূলক ফিচার থাকে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'shield' }, labelBn: 'LTS', captionBn: 'স্থিতিশীল, শিক্ষার্থীর জন্য' },
            right: { visual: { kind: 'art', name: 'sparkles' }, labelBn: 'Current', captionBn: 'নতুন, পরীক্ষামূলক' },
            vs: 'বনাম',
          },
          learnMoreBn: 'LTS-এর পুরো নাম Long Term Support (দীর্ঘমেয়াদি সমর্থন)। ভুল সারানো আর নিরাপত্তার আপডেট অনেক বছর পাওয়া যায়। দাম দুটোরই একই: বিনামূল্যে।',
        },
        {
          id: 'c-win-wizard',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'Windows-এ Node-এর ইনস্টলার **msi**। কয়েকবার Next চাপতে হয়, আর PATH আগে থেকেই টিক দেওয়া।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'hand-click', labelBn: 'Next' },
              { art: 'check', labelBn: 'শর্তে টিক' },
              { art: 'package-box', labelBn: 'Install' },
              { art: 'key', labelBn: 'Yes' },
            ],
          },
          learnMoreBn: 'ধাপগুলো: Next, শর্তে টিক, Next, Next (জায়গা), Next (পছন্দ), Install, Yes (অনুমতি), Finish। লাইসেন্সের শর্তে আসল জীবনে একবার চোখ বুলিয়ে নিন। অনুমতির বাক্সটি ইউজার অ্যাকাউন্ট কন্ট্রোল। ' + DIFF + '।',
        },
        {
          id: 'c-mac-wizard',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'Mac-এ Node-এর ইনস্টলার **pkg**। ধাপ প্রায় Python-এর মতোই।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'hand-click', labelBn: 'Continue' },
              { art: 'check', labelBn: 'Agree' },
              { art: 'package-box', labelBn: 'Install' },
              { art: 'key', labelBn: 'পাসওয়ার্ড' },
            ],
          },
          learnMoreBn: 'ধাপগুলো: Continue, Continue (লাইসেন্স), Agree, Continue (ইনস্টলের জায়গা, যেমন আছে তেমনই), Install, পাসওয়ার্ড, Install Software, Close। ' + DIFF + '।',
        },
        {
          id: 'c-node-admin',
          type: 'visual',
          textBn: 'আবার পাসওয়ার্ড বা “Yes” চাইবে। আপনি নিজে শুরু করেছেন, তাই এটি **স্বাভাবিক**।',
          visual: { kind: 'art', name: 'key', captionBn: 'নিজে শুরু = দেওয়া যায়' },
        },
      ],
      steps: [...nodeWin, ...nodeMac],
      setup: setupInstall,
      quiz: [
        {
          id: 'q-lts', type: 'multipleChoice', questionBn: 'Node.js-এ LTS নেওয়া ভালো কেন?',
          options: [
            { id: 'a', textBn: 'স্থিতিশীল আর অনেক দিন সাহায্য পায়' },
            { id: 'b', textBn: 'দাম কম' },
            { id: 'c', textBn: 'Current সংস্করণ চলে না' },
          ],
          correct: ['a'],
          hintBn: 'LTS = Long Term Support, দীর্ঘমেয়াদি সমর্থন।',
          explanationBn: 'ঠিক। দাম দুটোরই একই: বিনামূল্যে।',
        },
        {
          id: 'q-match', type: 'dragMatch', questionBn: 'প্রতিটি টুলের সাথে তার কাজ মিলিয়ে দিন।',
          pairs: [
            { id: 'editor', leftBn: 'কোড এডিটর', rightBn: 'কোড লেখার গোছানো খাতা' },
            { id: 'python', leftBn: 'Python', rightBn: 'পাইথন কোড চালায়' },
            { id: 'node', leftBn: 'Node.js', rightBn: 'কম্পিউটারে জাভাস্ক্রিপ্ট চালায়' },
          ],
          hintBn: 'এডিটর লেখার জন্য, বাকি দুটি চালানোর জন্য।',
          explanationBn: 'সব মিলেছে! এডিটর লেখে, Python আর Node.js চালায়।',
        },
        {
          id: 'q-ext', type: 'multipleChoice', questionBn: 'Node.js ইনস্টলার ফাইলের শেষ অংশ সাধারণত কী?',
          options: [
            { id: 'a', textBn: 'Windows-এ .msi, Mac-এ .pkg' },
            { id: 'b', textBn: 'সব জায়গায় .jpg' },
            { id: 'c', textBn: 'সব জায়গায় .mp3' },
          ],
          correct: ['a'],
          hintBn: 'ইনস্টলার ফাইলের শেষ অংশ কম্পিউটারের ধরনে আলাদা।',
          explanationBn: 'ঠিক। ছবি বা গানের ফাইল ইনস্টলার নয়।',
        },
      ],
      recapBn: ['Node.js-এ সবসময় LTS', 'Windows: .msi, Mac: .pkg', 'Next বা Continue একে একে চাপুন'],
    },

    // =====================================================================================================
    {
      id: 'check',
      titleBn: 'টার্মিনালে যাচাই',
      hook: {
        id: 'h-check',
        type: 'hook',
        textBn: 'ইনস্টল ঠিক হলো কি না, টার্মিনাল **এক লাইনেই** বলে দেয়।',
        visual: { kind: 'art', name: 'terminal', captionBn: '--version' },
      },
      cards: [
        {
          id: 'c-term-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'টার্মিনালে প্রম্পটের পরে কমান্ড লিখে **Enter** চাপলে সে উত্তর দেয়।',
          visual: { kind: 'mock', name: 'terminal-win', os: 'windows', highlight: 'prompt', captionBn: 'এখানে লিখবেন' },
          chipsBn: ['লিখুন', 'Enter চাপুন'],
        },
        {
          id: 'c-term-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'টার্মিনালে প্রম্পটের পরে কমান্ড লিখে **Return** চাপলে সে উত্তর দেয়।',
          visual: { kind: 'mock', name: 'terminal-mac', os: 'mac', highlight: 'prompt', captionBn: 'এখানে লিখবেন' },
          chipsBn: ['লিখুন', 'Return চাপুন'],
        },
        {
          id: 'c-code-win',
          type: 'code',
          osVariant: 'windows',
          textBn: '**--version** যোগ করলে সংস্করণের সংখ্যা ছাপা হয়। সংখ্যা এলেই ইনস্টল ঠিক।',
          visual: {
            kind: 'code',
            lang: 'shell',
            lines: [
              { code: 'python --version', noteBn: 'Python-এর সংস্করণ' },
              { code: 'node --version', noteBn: 'Node.js-এর সংস্করণ' },
            ],
            output: ['Python 3.12.4', 'v22.12.0'],
          },
        },
        {
          id: 'c-code-mac',
          type: 'code',
          osVariant: 'mac',
          textBn: '**--version** যোগ করলে সংস্করণের সংখ্যা ছাপা হয়। Mac-এ Python-এর কমান্ড **python3**।',
          visual: {
            kind: 'code',
            lang: 'shell',
            lines: [
              { code: 'python3 --version', noteBn: 'Python-এর সংস্করণ' },
              { code: 'node --version', noteBn: 'Node.js-এর সংস্করণ' },
            ],
            output: ['Python 3.12.4', 'v22.12.0'],
          },
          learnMoreBn: 'নতুন macOS-এ python3 আগে থেকেও থাকতে পারে বা ইনস্টলের একটি পপ-আপ আনতে পারে। ' + DIFF + '।',
        },
        {
          id: 'c-notfound',
          type: 'compare',
          textBn: '“not recognized” বা “command not found” মানে কম্পিউটার কমান্ডটি **খুঁজে পায়নি**। ভয়ের কিছু নয়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'সংখ্যা এলে', captionBn: 'ইনস্টল ঠিক' },
            right: { visual: { kind: 'art', name: 'question' }, labelBn: 'ভুলের বার্তা এলে', captionBn: 'বসেনি বা খুঁজে পায়নি' },
            vs: 'বা',
          },
          learnMoreBn: 'Python-এ এমন হলে Windows-এ আগে ভাবুন PATH-এ টিক ছিল কি না। ইনস্টল ঠিক থাকলে টার্মিনাল বন্ধ করে নতুন করে খুলে আবার চেষ্টা করুন। Windows-এ আসল কম্পিউটারে python লিখলে কখনো Microsoft Store খুলে যেতে পারে; ' + DIFF + '। Git আমরা এখনও বসাইনি, তাই git লিখলে এই বার্তাই আসবে।',
        },
      ],
      steps: checkSteps,
      setup: setupCheck,
      quiz: [
        {
          id: 'q-notfound', type: 'multipleChoice', questionBn: 'টার্মিনালে “command not found” এলে কী বোঝায়?',
          options: [
            { id: 'a', textBn: 'কম্পিউটার কমান্ডটি খুঁজে পায়নি' },
            { id: 'b', textBn: 'কম্পিউটার নষ্ট হয়েছে' },
            { id: 'c', textBn: 'ভাইরাস ঢুকেছে' },
          ],
          correct: ['a'],
          hintBn: 'প্রোগ্রাম বসেনি, বা কমান্ডের নাম ঠিক নেই।',
          explanationBn: 'ঠিক। এটি শুধু “খুঁজে পাইনি” বার্তা।',
        },
        {
          id: 'q-version', type: 'clickTarget', questionBn: 'Mac-এ Python-এর সংস্করণ দেখার কমান্ড কোনটি?',
          items: [
            { id: 'a', labelBn: 'python3 --version' },
            { id: 'b', labelBn: 'python3 version' },
            { id: 'c', labelBn: 'version --python3' },
            { id: 'd', labelBn: 'show python3' },
          ],
          correct: 'a',
          hintBn: 'কমান্ডের নাম, ফাঁকা, তারপর দুটি ড্যাশ আর version।',
          explanationBn: 'python3 --version। Windows-এ python --version।',
        },
        {
          id: 'q-reopen', type: 'multipleChoice', questionBn: 'ইনস্টলের পর টার্মিনাল কমান্ড চিনছে না। প্রথমে কী করবেন?',
          options: [
            { id: 'a', textBn: 'টার্মিনাল বন্ধ করে নতুন করে খুলব' },
            { id: 'b', textBn: 'কম্পিউটার বদলাব' },
            { id: 'c', textBn: 'অচেনা সাইট থেকে আবার ডাউনলোড করব' },
          ],
          correct: ['a'],
          hintBn: 'নতুন টার্মিনাল ইনস্টলের খবর পায়।',
          explanationBn: 'ঠিক। না হলে ইনস্টল ঠিক ছিল কি না দেখুন।',
        },
      ],
      recapBn: ['--version দিয়ে যাচাই', 'Mac-এ python3, Windows-এ python', 'ভুলের বার্তা মানে “খুঁজে পাইনি”'],
    },

    // =====================================================================================================
    {
      id: 'folders',
      titleBn: 'ফোল্ডার, এডিটর ও এক্সটেনশন',
      hook: {
        id: 'h-folders',
        type: 'hook',
        textBn: 'কোডের ফাইল ছড়িয়ে-ছিটিয়ে নয়। একটি **গোছানো ঘর** বানাই।',
        visual: { kind: 'art', name: 'folder-open', captionBn: 'Documents / coding' },
      },
      cards: [
        {
          id: 'c-tree',
          type: 'visual',
          textBn: 'Documents-এর ভেতরে **coding** ফোল্ডার। তার ভেতরে ভাগ ভাগ করে চারটি ফোল্ডার।',
          visual: { kind: 'art', name: 'folder', captionBn: 'Documents/coding' },
          chipsBn: ['html-css', 'python, javascript', 'projects'],
          learnMoreBn: 'গড়ন: Documents → coding → html-css, python, javascript, projects। ফোল্ডারের নামে স্পেস না দেওয়াই ভালো।',
        },
        {
          id: 'c-mkdir',
          type: 'code',
          textBn: 'টার্মিনালে **mkdir** মানে “ফোল্ডার বানাও”, আর **cd** মানে “ভেতরে ঢোকো”।',
          visual: {
            kind: 'code',
            lang: 'shell',
            lines: [
              { code: 'cd Documents', noteBn: 'Documents-এ ঢুকি' },
              { code: 'mkdir coding', noteBn: 'নতুন ফোল্ডার' },
              { code: 'cd coding', noteBn: 'তার ভেতরে যাই' },
              { code: 'mkdir python', noteBn: 'আরেকটি ফোল্ডার' },
            ],
          },
        },
        {
          id: 'c-editor-open',
          type: 'visual',
          textBn: 'টার্মিনালে **code** আর একটি ডট লিখলে এডিটরে এই ফোল্ডারটি খোলে। বাঁ পাশে তালিকা দেখা যায়।',
          visual: { kind: 'mock', name: 'code-editor', highlight: 'explorer', captionBn: 'এডিটরের বাঁ পাশ' },
          learnMoreBn: 'ডট (.) মানে “এই ফোল্ডার”। আসল VS Code-এও এটি কাজ করে; Mac-এ প্রথমবার কিছু সেটআপ লাগতে পারে। ' + DIFF + '।',
        },
        {
          id: 'c-ext',
          type: 'visual',
          textBn: '**এক্সটেনশন** এডিটরে বাড়তি সুবিধা যোগ করে। শুধু অফিসিয়াল মার্কেটপ্লেস থেকে নিন।',
          visual: { kind: 'art', name: 'puzzle', captionBn: 'আগে যাচাই, তারপর Install' },
          chipsBn: ['প্রকাশক verified', 'বেশি ইনস্টল-সংখ্যা', 'ভালো রেটিং'],
          learnMoreBn: 'কাজের কয়েকটি: Python এক্সটেনশন, Live Server (HTML পেজের প্রিভিউ), বাংলা ভাষার প্যাক (ঐচ্ছিক), Prettier (কোড সাজানো, পরে)। নামটি হুবহু যা চান, সেটি কি না মিলিয়ে নিন; “PRO (FREE!!)” জাতীয় নাম ফাঁদ হতে পারে।',
        },
        {
          id: 'c-git',
          type: 'compare',
          textBn: '**Git** কাজের সেভ পয়েন্ট রাখে, **GitHub** রাখে অনলাইন কপি। এখনই ইনস্টল জরুরি নয়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'branch' }, labelBn: 'Git', captionBn: 'সেভ পয়েন্ট' },
            right: { visual: { kind: 'art', name: 'cloud' }, labelBn: 'GitHub', captionBn: 'অনলাইনে কপি' },
            vs: 'আর',
          },
          learnMoreBn: 'Git ভুল হলে আগের কোনো অবস্থায় ফেরার সুযোগ দেয়। GitHub-এ বিনামূল্যের অ্যাকাউন্টের জন্য ইমেইল লাগে (মডিউল ৮-এর মতো)। একটি প্রকল্পের সব ফাইল আর ইতিহাস রাখার ফোল্ডারকে বলে রিপোজিটরি (রেপো)।',
        },
      ],
      steps: folderSteps,
      setup: setupFolders,
      quiz: [
        {
          id: 'q-folder-path', type: 'clickTarget', questionBn: 'Python-এর ফাইলের জন্য গোছানো ফোল্ডার কোনটি?',
          items: [
            { id: 'a', labelBn: 'Documents/coding/python' },
            { id: 'b', labelBn: 'Downloads/অচেনা-ফাইল' },
            { id: 'c', labelBn: 'Desktop-এ ছড়ানো' },
          ],
          correct: 'a',
          hintBn: 'coding-এর ভেতরে python ফোল্ডার।',
          explanationBn: 'Documents/coding/python। ফাইল খুঁজে পাওয়া সহজ।',
        },
        {
          id: 'q-ext-check', type: 'multipleChoice', questionBn: 'এক্সটেনশন ইনস্টলের আগে কী দেখবেন?',
          options: [
            { id: 'a', textBn: 'প্রকাশক verified কি না, আর ইনস্টল-সংখ্যা' },
            { id: 'b', textBn: 'নামে PRO বা FREE!! লেখা আছে কি না' },
            { id: 'c', textBn: 'আইকনের রং' },
          ],
          correct: ['a'],
          hintBn: 'কে বানিয়েছে, আর কতজন ব্যবহার করে।',
          explanationBn: 'ঠিক। verified প্রকাশক আর অনেক ইনস্টল ভালো লক্ষণ।',
        },
        {
          id: 'q-git', type: 'multipleChoice', questionBn: 'Git আর GitHub-এর পরিচয় কোনটি?',
          options: [
            { id: 'a', textBn: 'Git = সেভ পয়েন্ট, GitHub = অনলাইনে কপি' },
            { id: 'b', textBn: 'দুটোই একই জিনিস' },
            { id: 'c', textBn: 'Git = ব্রাউজার, GitHub = এডিটর' },
          ],
          correct: ['a'],
          hintBn: 'একটি কম্পিউটারে, অন্যটি ইন্টারনেটে।',
          explanationBn: 'ঠিক। Git আর GitHub আলাদা জিনিস।',
        },
      ],
      recapBn: ['Documents/coding গোছানো রাখুন', 'code . দিয়ে এডিটরে খুলুন', 'এক্সটেনশনে প্রকাশক আর সংখ্যা দেখুন'],
      freeTryBn: 'coding/python-এ নিজের নামে একটি নতুন ফোল্ডার বানান।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে — পরিচিত কারও সাথে বসে, ধীরে ধীরে',
    tasksBn: [
      'চিট শিটের “সেটআপ চেকলিস্ট” খুলুন। ঠিকানা মিলিয়ে code.visualstudio.com, www.python.org, nodejs.org থেকে ডাউনলোড করুন।',
      'ইনস্টল শেষে টার্মিনালে python (Mac-এ python3) আর node দিয়ে --version দেখুন।',
      'Documents/coding বানিয়ে VS Code-এ খুলুন। যাচাই করে Python এক্সটেনশন ইনস্টল করুন।',
    ],
    windowsTasksBn: ['Python-এ “Add python.exe to PATH” টিক দিন। ইনস্টলের পর টার্মিনাল বন্ধ করে নতুন করে খুলে যাচাই করুন।'],
    macTasksBn: ['পাসওয়ার্ড চাইলে নিজের কম্পিউটারের পাসওয়ার্ড দিন। VS Code-এর .zip খুলে অ্যাপটি Applications-এ টেনে আনুন।'],
  },

  teacherTipBn:
    'আসল ইনস্টলেশন দুজনে একসাথে করুন। অ্যাডমিন পাসওয়ার্ডের পপ-আপ আসবে, তাই আগে থেকে বলে রাখুন যে এটি স্বাভাবিক। তাড়া করবেন না; প্রতিটি পাতা পড়ে এগোন। কোনো ভুল-বার্তা এলে স্ক্রিনের ছবি (screenshot) তুলে রাখুন; সমস্যা খোঁজার সবচেয়ে বড় সূত্র সেটাই। ডাউনলোডের আগে ঠিকানাটি প্রতি অক্ষর একসাথে জোরে পড়ে মেলান; এই অভ্যাসই সবচেয়ে বড় নিরাপত্তা। সম্ভব হলে ইনস্টলের আগে অফিসিয়াল সাইটের ঠিকানা বুকমার্ক করে নিন।',
}

export default lesson
