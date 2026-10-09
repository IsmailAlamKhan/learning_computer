import type { Lesson } from '../../engine/types'
import { resetInstalls } from '../../sim/apps/extra/installState'

const DIFF = 'আপনার ম্যাকে একটু আলাদা দেখাতে পারে'

/**
 * Module 6 — programs and apps, in the cards format. Four units:
 *  (1) open an app and type, (2) the first save + reopen, (3) Save vs Save As + unsaved prompt + plain text,
 *  (4) install and uninstall a pretend app. Step targets and expected actions are the same as in the old guided practice.
 * Every unit runs on a fresh practice computer, so units 2–4 start from a prepared state (see each `setup`).
 */
const lesson: Lesson = {
  module: 6,
  part: 1,
  id: 'm06',
  titleBn: 'প্রোগ্রাম ও অ্যাপ',
  oneLineBn: 'অ্যাপ খুলি, লেখা সেভ করি, Save আর Save As চিনি, অ্যাপ বসাই ও সরাই।',
  minutes: 8,
  glossaryIds: ['program', 'app', 'application', 'install', 'uninstall', 'plain-text', 'rich-text', 'notepad', 'textedit', 'save', 'save-as', 'open-file', 'start-search', 'spotlight', 'official-source', 'update'],

  units: [
    // =====================================================================================================
    // Unit 1 — open an app and type
    // =====================================================================================================
    {
      id: 'open-write',
      titleBn: 'অ্যাপ খোলা ও লেখা',
      hook: {
        id: 'h-pen',
        type: 'hook',
        textBn: 'চিঠি লিখতে আগে কলম লাগে। কম্পিউটারে সেই কলমের নাম **অ্যাপ**।',
        visual: { kind: 'art', name: 'pencil', captionBn: 'কলম = অ্যাপ' },
      },
      cards: [
        {
          id: 'c-app-file',
          type: 'compare',
          textBn: 'অ্যাপ দিয়ে বানানো জিনিসই **ফাইল**। ওয়েবসাইট থাকে ইন্টারনেটে, ব্রাউজারে দেখি।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'pencil' }, labelBn: 'অ্যাপ', captionBn: 'কলম' },
            right: { visual: { kind: 'art', name: 'document' }, labelBn: 'ফাইল', captionBn: 'কলমে লেখা চিঠি' },
            vs: 'দিয়ে বানাই',
          },
          chipsBn: ['অ্যাপ = হাতিয়ার', 'ফাইল = বানানো জিনিস'],
          learnMoreBn: 'অ্যাপ, প্রোগ্রাম আর অ্যাপ্লিকেশন — তিনটি নামই একই জিনিস। ওয়েবসাইট আপনার কম্পিউটারে বসানো থাকে না; ব্রাউজার নামের অ্যাপ দিয়ে ইন্টারনেটে গিয়ে দেখতে হয়।',
        },
        {
          id: 'c-find-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'অ্যাপের নাম মনে থাকলে **স্টার্ট** চেপে নামটি লিখুন। কম্পিউটার নিজেই খুঁজে দেবে।',
          visual: { kind: 'mock', name: 'win-start-menu', os: 'windows', highlight: 'search' },
          chipsBn: ['স্টার্ট চাপি', 'নাম লিখি'],
          learnMoreBn: 'স্টার্ট চেপে সাথে সাথে টাইপ করলেই খোঁজা শুরু হয়। টাস্কবারের সার্চ বক্সও একই কাজ করে। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।',
        },
        {
          id: 'c-find-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'অ্যাপের নাম মনে থাকলে ওপরের **স্পটলাইট** (🔍) খুলে নামটি লিখুন।',
          visual: { kind: 'mock', name: 'mac-menubar', os: 'mac', highlight: 'status' },
          chipsBn: ['🔍 চাপি', 'নাম লিখি'],
          learnMoreBn: 'কিবোর্ডে Cmd + Space চাপলেও স্পটলাইট খোলে। সব অ্যাপ একসাথে দেখতে চাইলে ডকের লঞ্চপ্যাড। ' + DIFF + '।',
        },
        {
          id: 'c-plain-editor',
          type: 'visual',
          textBn: 'নোটপ্যাড বা টেক্সটএডিটে শুধু **সাধারণ লেখা** হয় — মোটা, রঙিন কিছু নয়। শুরুর জন্য সহজ।',
          visual: { kind: 'demo', gesture: 'type', mock: 'notepad', textBn: 'Hello, this is my first file.', captionBn: 'লিখলেই লেখা আসে' },
          chipsBn: ['Notepad (Windows)', 'TextEdit (Mac)'],
          learnMoreBn: 'Windows-এ Notepad আর Mac-এ TextEdit — দুটোই লেখার সবচেয়ে সোজা অ্যাপ। ফাইলের নামের শেষে সাধারণত .txt থাকে।',
        },
      ],
      steps: [
        // ---- Windows
        {
          id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'নিচের স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চার-খোপের আইকনটিই স্টার্ট বোতাম।',
        },
        {
          id: 'w-open-notepad', osVariant: 'windows', titleBn: 'নোটপ্যাড খুলুন', target: 'start-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'মেনু থেকে “Notepad” অ্যাপে ক্লিক করুন।',
          hintBn: 'Pinned অংশে Notepad খুঁজুন। না পেলে সার্চ বক্সে Notepad লিখুন।',
          simplerBn: 'হলুদ-সাদা খাতার ছবির নিচে Notepad লেখা আছে। সেটিতে একবার ক্লিক করুন।',
          successMessageBn: 'Notepad খুলেছে!',
        },
        {
          id: 'w-write', osVariant: 'windows', titleBn: 'একটি বাক্য লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'সাদা জায়গায় ক্লিক করে একটি বাক্য লিখুন।',
          hintBn: 'সাদা অংশের ভেতরে ক্লিক করুন, তারপর টাইপ করুন, যেমন: Hello।',
          successMessageBn: 'নামের আগে * — মানে সেভ হয়নি।',
        },
        // ---- Mac
        {
          id: 'm-spotlight', osVariant: 'mac', titleBn: 'স্পটলাইট খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
          explanationBn: 'ওপরের ডান দিকের 🔍 চিহ্নে ক্লিক করুন।',
          hintBn: 'পর্দার একদম ওপরের সারির ডান দিকে ছোট 🔍 চিহ্ন।',
        },
        {
          id: 'm-search-textedit', osVariant: 'mac', titleBn: 'নাম লিখুন', target: 'spotlight-input', expectedAction: { type: 'type', target: 'spotlight-input', text: 'TextEdit', ignoreCase: true },
          explanationBn: 'সার্চ বক্সে লিখুন: TextEdit',
          hintBn: 'ইংরেজিতে TextEdit লিখুন।',
        },
        {
          id: 'm-open-textedit', osVariant: 'mac', titleBn: 'টেক্সটএডিট খুলুন', target: 'spotlight-result-0', expectedAction: { type: 'openApp', app: 'editor' },
          explanationBn: 'প্রথম ফলাফল TextEdit-এ ক্লিক করুন।',
          hintBn: 'নিচের তালিকার একদম ওপরের লাইনে ক্লিক করুন।',
          successMessageBn: 'TextEdit খুলেছে!',
        },
        {
          id: 'm-write', osVariant: 'mac', titleBn: 'একটি বাক্য লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'সাদা জায়গায় ক্লিক করে একটি বাক্য লিখুন।',
          hintBn: 'সাদা অংশের ভেতরে ক্লিক করুন, তারপর টাইপ করুন, যেমন: Hello।',
          successMessageBn: 'নামের পাশে Edited — মানে সেভ হয়নি।',
        },
      ],
      quiz: [
        {
          id: 'q-whatapp', type: 'clickTarget', questionBn: 'নিচের কোনটি একটি অ্যাপ (প্রোগ্রাম)?',
          items: [
            { id: 'photo', labelBn: 'photo.jpg', icon: '🖼️' },
            { id: 'calc', labelBn: 'Calculator', icon: '🧮' },
            { id: 'note', labelBn: 'note.txt', icon: '📄' },
            { id: 'song', labelBn: 'song.mp3', icon: '🎵' },
          ],
          correct: 'calc',
          hintBn: 'যার নামের শেষে .jpg বা .txt নেই, সেটি কাজ করার হাতিয়ার।',
          explanationBn: 'Calculator কাজের হাতিয়ার — অ্যাপ। বাকিগুলো ফাইল।',
        },
        {
          id: 'q-find', type: 'multipleChoice', questionBn: 'অ্যাপের নাম মনে আছে। খুঁজে পাওয়ার সহজ উপায় কী?',
          options: [
            { id: 'a', textBn: 'স্টার্ট বা স্পটলাইটে নামটি লিখি' },
            { id: 'b', textBn: 'কম্পিউটার রিস্টার্ট করি' },
            { id: 'c', textBn: 'প্রতিটি ফোল্ডার খুলে দেখি' },
          ],
          correct: ['a'],
          hintBn: 'নাম লিখলে কম্পিউটার নিজেই খুঁজে দেয়।',
          explanationBn: 'নাম লিখলেই অ্যাপ সামনে চলে আসে।',
        },
        {
          id: 'q-appfile', type: 'dragMatch', questionBn: 'শব্দের সাথে মানে মিলিয়ে দিন।',
          pairs: [
            { id: 'app', leftBn: 'অ্যাপ', rightBn: 'কাজের হাতিয়ার' },
            { id: 'file', leftBn: 'ফাইল', rightBn: 'অ্যাপে বানানো জিনিস' },
            { id: 'web', leftBn: 'ওয়েবসাইট', rightBn: 'ইন্টারনেটে থাকে' },
          ],
          hintBn: 'কলম = অ্যাপ। কলমে লেখা চিঠি = ফাইল।',
          explanationBn: 'তিনটিই মিলেছে!',
        },
      ],
      recapBn: ['অ্যাপ = কাজের হাতিয়ার', 'নাম লিখে অ্যাপ খুঁজি', 'ফাইল = অ্যাপে বানানো জিনিস'],
      freeTryBn: 'অন্য একটি অ্যাপও নাম লিখে খুঁজে খুলুন।',
    },

    // =====================================================================================================
    // Unit 2 — the first save, then reopen
    // =====================================================================================================
    {
      id: 'save-first',
      titleBn: 'সেভ করা',
      hook: {
        id: 'h-lost',
        type: 'hook',
        textBn: 'হঠাৎ কারেন্ট গেলে, না-সেভ লেখা **হারিয়ে** যায়। 😬',
        visual: { kind: 'art', name: 'power', captionBn: 'সেভ না করলে গায়েব' },
      },
      setup: { openApps: ['editor'] },
      cards: [
        {
          id: 'c-save-why',
          type: 'visual',
          textBn: '**সেভ** মানে লেখাটি ফাইলে জমিয়ে রাখা। তখন কম্পিউটার বন্ধ হলেও লেখা থাকে।',
          visual: { kind: 'art', name: 'save-disk', captionBn: 'জমা রাখা' },
          chipsBn: ['সেভ = জমানো'],
          learnMoreBn: 'লেখার সময় লেখাটি শুধু কম্পিউটারের মেমোরিতে থাকে। সেভ করলে তা স্থায়ীভাবে একটি ফাইলে জমা হয়। নামের আগে * (Windows) বা Edited (Mac) দেখলে বুঝবেন, এখনও জমা হয়নি।',
        },
        {
          id: 'c-first-save',
          type: 'visual',
          textBn: 'প্রথমবার কম্পিউটার জিজ্ঞেস করে: ফাইলের **নাম** কী? এই ছোট বাক্সকে বলে ডায়ালগ।',
          visual: { kind: 'mock', name: 'save-dialog', highlight: 'file-name', captionBn: 'এখানে নাম লিখি' },
          chipsBn: ['নাম দিন', 'শেষে .txt'],
          learnMoreBn: 'ডায়ালগ মানে এমন একটি ছোট বাক্স, যা আপনার কাছে কিছু জানতে চায়। নামের শেষে .txt থাকলে বোঝা যায় এটি সাধারণ লেখার ফাইল।',
        },
        {
          id: 'c-where',
          type: 'visual',
          textBn: 'ফাইল কোথায় যাবে, সেটিও দেখে নিন। আমরা রাখব **Documents** ফোল্ডারে।',
          visual: { kind: 'mock', name: 'save-dialog', highlight: 'folder', captionBn: 'এই ফোল্ডারে যাচ্ছে' },
          chipsBn: ['Documents = কাগজের আলমারি'],
          learnMoreBn: 'নিজের লেখা চিঠি বা নোট সাধারণত Documents ফোল্ডারেই রাখা হয়। পরে খুঁজে পাওয়া সহজ হয়।',
        },
        {
          id: 'c-vs-widget',
          type: 'visual',
          textBn: '**Save** আর **Save As**-এর তফাত নিজে ধরে দেখুন।',
          visual: { kind: 'widget', widget: 'save-vs-saveas' },
        },
        {
          id: 'c-reopen-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'সেভ করা ফাইল আবার খুলতে File Explorer-এ ফাইলটিতে **ডাবল ক্লিক** করুন।',
          visual: { kind: 'mock', name: 'file-explorer', os: 'windows', highlight: 'files' },
          chipsBn: ['Documents-এ যাই', 'ডাবল ক্লিক'],
          learnMoreBn: 'ফাইল ম্যানেজার অনেক সময় নামের শেষের .txt লুকিয়ে রাখে, তাই শুধু “hello” দেখাতে পারে। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।',
        },
        {
          id: 'c-reopen-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'সেভ করা ফাইল আবার খুলতে Finder-এ ফাইলটিতে **ডাবল ক্লিক** করুন।',
          visual: { kind: 'mock', name: 'finder', os: 'mac', highlight: 'files' },
          chipsBn: ['Documents-এ যাই', 'ডাবল ক্লিক'],
          learnMoreBn: 'Finder অনেক সময় নামের শেষের .txt লুকিয়ে রাখে, তাই শুধু “hello” দেখাতে পারে। ' + DIFF + '।',
        },
      ],
      steps: [
        // ---- Windows
        {
          id: 'w-write-2', osVariant: 'windows', titleBn: 'একটি বাক্য লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'সাদা জায়গায় ক্লিক করে একটি বাক্য লিখুন।',
          hintBn: 'সাদা অংশের ভেতরে ক্লিক করুন, তারপর টাইপ করুন, যেমন: Hello।',
        },
        {
          id: 'w-file-menu', osVariant: 'windows', titleBn: 'File মেনু খুলুন', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
          explanationBn: 'ওপরে বাঁ দিকের “File”-এ ক্লিক করুন।',
          hintBn: 'Notepad উইন্ডোর ওপরের সারিতে সবচেয়ে বাঁ দিকের শব্দটি File।',
        },
        {
          id: 'w-save', osVariant: 'windows', titleBn: 'Save বেছে নিন', target: 'editor-save', expectedAction: { type: 'click', target: 'editor-save' },
          explanationBn: '“Save” বেছে নিন (Save As নয়)।',
          hintBn: 'মেনুতে Save আর Save As আলাদা আছে। এখন শুধু Save।',
          simplerBn: 'তালিকায় New, Open-এর নিচে Save লেখা আছে। সেটিতে ক্লিক করুন।',
        },
        {
          id: 'w-name', osVariant: 'windows', titleBn: 'ফাইলের নাম লিখুন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello.txt', ignoreCase: true },
          explanationBn: '“File name” ঘরে লিখুন: hello.txt',
          hintBn: 'আগের নাম মুছে লিখুন: hello.txt — ছোট হাতের, মাঝে একটি ডট।',
          simplerBn: 'ঘরে ক্লিক করে সব মুছুন। তারপর টাইপ করুন h-e-l-l-o, একটি ডট, তারপর t-x-t।',
        },
        {
          id: 'w-save-btn', osVariant: 'windows', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
          explanationBn: 'নিচের ডানের নীল “Save” বোতামে চাপুন।',
          hintBn: 'ডায়ালগের একদম নিচে ডান পাশে নীল Save বোতাম।',
          successMessageBn: 'ফাইল তৈরি!',
        },
        {
          id: 'w-close-notepad', osVariant: 'windows', titleBn: 'নোটপ্যাড বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
          explanationBn: 'ডান ওপরের ✕ চেপে Notepad বন্ধ করুন।',
          hintBn: 'উইন্ডোর একদম ডান ওপরের কোণে ✕ চিহ্ন।',
          successMessageBn: 'কোনো প্রশ্ন এল না — সেভ করা আছে।',
        },
        {
          id: 'w-open-files', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'টাস্কবারের ফোল্ডার-আইকনে ক্লিক করুন।',
          hintBn: 'টাস্কবারের হলুদ ফোল্ডারের মতো আইকনটি।',
        },
        {
          id: 'w-go-documents', osVariant: 'windows', titleBn: 'Documents ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বাঁ দিকের “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় Documents লেখাটি খুঁজুন।',
        },
        {
          id: 'w-reopen', osVariant: 'windows', titleBn: 'hello.txt আবার খুলুন', target: 'fm-item-hello.txt', expectedAction: { type: 'doubleClick', target: 'fm-item-hello.txt' },
          explanationBn: 'hello ফাইলে ডাবল ক্লিক করুন।',
          hintBn: 'নামের ওপর দুবার চটপট ক্লিক করুন। .txt লুকানো থাকলে শুধু “hello” দেখাবে।',
          simplerBn: 'একবার ক্লিক করে ফাইলটি বেছে নিন। তারপর আবার তাড়াতাড়ি দুবার ক্লিক করুন।',
          successMessageBn: 'লেখাসহ আবার খুলল!',
        },
        // ---- Mac
        {
          id: 'm-write-2', osVariant: 'mac', titleBn: 'একটি বাক্য লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'সাদা জায়গায় ক্লিক করে একটি বাক্য লিখুন।',
          hintBn: 'সাদা অংশের ভেতরে ক্লিক করুন, তারপর টাইপ করুন, যেমন: Hello।',
        },
        {
          id: 'm-save', osVariant: 'mac', titleBn: 'Save চাপুন', target: 'editor-save', expectedAction: { type: 'click', target: 'editor-save' },
          explanationBn: 'ওপরের “Save” বোতামে ক্লিক করুন।',
          hintBn: 'টুলবারের তৃতীয় বোতাম — Save (Save As… নয়)।',
        },
        {
          id: 'm-name', osVariant: 'mac', titleBn: 'ফাইলের নাম লিখুন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello.txt', ignoreCase: true },
          explanationBn: '“Save As” ঘরে লিখুন: hello.txt',
          hintBn: 'আগের নাম মুছে লিখুন: hello.txt — ছোট হাতের, মাঝে একটি ডট।',
          simplerBn: 'ঘরে ক্লিক করে সব মুছুন। তারপর টাইপ করুন h-e-l-l-o, একটি ডট, তারপর t-x-t।',
        },
        {
          id: 'm-save-btn', osVariant: 'mac', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
          explanationBn: 'নিচের ডানের নীল “Save” বোতামে চাপুন।',
          hintBn: 'ডায়ালগের একদম নিচে ডান পাশে নীল Save বোতাম।',
          successMessageBn: 'ফাইল তৈরি!',
        },
        {
          id: 'm-close-textedit', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
          explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করুন।',
          hintBn: 'উইন্ডোর বাঁ ওপরে তিনটি রঙিন বোতামের প্রথমটি — লাল।',
          successMessageBn: 'কোনো প্রশ্ন এল না — সেভ করা আছে।',
        },
        {
          id: 'm-open-finder', osVariant: 'mac', titleBn: 'ফাইন্ডার খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'ডকের প্রথম আইকন Finder-এ ক্লিক করুন।',
          hintBn: 'ডকের বাঁ দিকের হাসিমুখের মতো আইকনটি।',
        },
        {
          id: 'm-go-documents', osVariant: 'mac', titleBn: 'Documents ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বাঁ দিকের “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় Documents লেখাটি খুঁজুন।',
        },
        {
          id: 'm-reopen', osVariant: 'mac', titleBn: 'hello.txt আবার খুলুন', target: 'fm-item-hello.txt', expectedAction: { type: 'doubleClick', target: 'fm-item-hello.txt' },
          explanationBn: 'hello ফাইলে ডাবল ক্লিক করুন।',
          hintBn: 'নামের ওপর দুবার চটপট ক্লিক করুন। .txt লুকানো থাকলে শুধু “hello” দেখাবে।',
          simplerBn: 'একবার ক্লিক করে ফাইলটি বেছে নিন। তারপর আবার তাড়াতাড়ি দুবার ক্লিক করুন।',
          successMessageBn: 'লেখাসহ আবার খুলল!',
        },
      ],
      quiz: [
        {
          id: 'q-order', type: 'ordering', questionBn: 'নতুন লেখা প্রথমবার সেভ করার ধাপগুলো সাজান।',
          items: [
            { id: '1', textBn: 'লেখাটি লিখি' },
            { id: '2', textBn: 'Save বেছে নিই' },
            { id: '3', textBn: 'ফাইলের নাম লিখি' },
            { id: '4', textBn: 'ডায়ালগের Save-এ চাপি' },
          ],
          hintBn: 'আগে লেখা, তারপর Save, তারপর নাম, শেষে বোতাম।',
          explanationBn: 'ঠিক! লেখা → Save → নাম → Save বোতাম।',
        },
        {
          id: 'q-where', type: 'multipleChoice', questionBn: 'প্রথমবার সেভ করলে কম্পিউটার কী জানতে চায়?',
          options: [
            { id: 'a', textBn: 'ফাইলের নাম আর কোথায় রাখব' },
            { id: 'b', textBn: 'আপনার পাসওয়ার্ড' },
            { id: 'c', textBn: 'কিছুই না' },
          ],
          correct: ['a'],
          hintBn: 'ডায়ালগে একটি ঘরে নাম লেখা হয়েছিল।',
          explanationBn: 'নাম আর জায়গা — দুটোই ঠিক করতে হয়।',
        },
        {
          id: 'q-reopen', type: 'multipleChoice', questionBn: 'সেভ করা ফাইল আবার খুলতে কী করবেন?',
          options: [
            { id: 'a', textBn: 'Documents-এ গিয়ে ফাইলে ডাবল ক্লিক' },
            { id: 'b', textBn: 'সবকিছু নতুন করে লিখি' },
            { id: 'c', textBn: 'কম্পিউটার রিস্টার্ট করি' },
          ],
          correct: ['a'],
          hintBn: 'ফাইল তো Documents ফোল্ডারেই জমা আছে।',
          explanationBn: 'ডাবল ক্লিকে ফাইল লেখাসহ খুলে যায়।',
        },
      ],
      recapBn: ['সেভ না করলে লেখা হারায়', 'প্রথমবার নাম আর জায়গা দিই', 'ফাইলে ডাবল ক্লিক = আবার খোলা'],
      freeTryBn: 'অন্য নামে আরেকটি ফাইল সেভ করে দেখুন।',
    },

    // =====================================================================================================
    // Unit 3 — Save vs Save As, the unsaved prompt, plain vs rich text
    // =====================================================================================================
    {
      id: 'save-vs-saveas',
      titleBn: 'সেভ vs সেভ অ্যাজ',
      hook: {
        id: 'h-warn',
        type: 'hook',
        textBn: 'সেভ না করে বন্ধ করতে গেলে কম্পিউটার **সাবধান** করে। দেখে ভয় পাবেন না!',
        visual: { kind: 'art', name: 'warning', captionBn: 'সাবধান!' },
      },
      setup: {
        openApps: ['files'],
        vfs: (vfs) => {
          const docs = vfs.child(vfs.home, 'Documents')
          if (docs && !vfs.child(docs, 'hello.txt')) vfs.createFile(docs, 'hello.txt', 'Hello, this is my first file.')
        },
      },
      cards: [
        {
          id: 'c-prompt',
          type: 'visual',
          textBn: 'প্রশ্নটির তিন উত্তর: **Save** রাখে, **Don’t save** ফেলে দেয়, Cancel ফিরে যায়।',
          visual: { kind: 'big', emoji: '💾  🗑️  ↩️', captionBn: 'Save · Don’t save · Cancel' },
          chipsBn: ['না বুঝলে Cancel'],
          learnMoreBn: 'Don’t save চাপলে নতুন লেখা চিরতরে হারায়। কী করবেন বুঝতে না পারলে Cancel চেপে ফিরে যান, আর শান্তভাবে ভাবুন।',
        },
        {
          id: 'c-save-inplace',
          type: 'compare',
          textBn: '**Save** চাপলে একই ফাইল নতুন লেখায় বদলে যায়। নাম আর জিজ্ঞেস করে না।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'document' }, labelBn: 'আগে', captionBn: 'hello.txt (পুরোনো)' },
            right: { visual: { kind: 'art', name: 'document' }, labelBn: 'পরে', captionBn: 'hello.txt (নতুন লেখা)' },
            vs: '→',
          },
          chipsBn: ['একই ফাইল বদলায়'],
          learnMoreBn: 'ফাইলের নাম আগে থেকেই আছে বলে কম্পিউটারকে আর কিছু জিজ্ঞেস করতে হয় না। তাই Save সবচেয়ে দ্রুত।',
        },
        {
          id: 'c-saveas',
          type: 'visual',
          textBn: '**Save As** দিলে নতুন নামে আরেকটি ফাইল হয়। আগেরটি যেমন ছিল, তেমনই থাকে।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'document', labelBn: 'hello.txt' },
              { art: 'copy', labelBn: 'Save As' },
              { art: 'document', labelBn: 'hello-copy.txt' },
            ],
          },
          chipsBn: ['নতুন নামে নতুন ফাইল'],
          learnMoreBn: 'পুরোনো লেখাও রাখতে চাইলে Save As। Mac-এ অনেক ভার্সনে Save As… মেনুতে লুকানো থাকে — Option কী চেপে ধরে File মেনু খুললে দেখা যায়। ' + DIFF + '।',
        },
        {
          id: 'c-plain-widget',
          type: 'visual',
          textBn: 'কোনটি **সাধারণ** লেখা আর কোনটি সাজানো? ধরুন তো।',
          visual: { kind: 'widget', widget: 'plain-vs-rich' },
        },
        {
          id: 'c-plain-why',
          type: 'compare',
          textBn: 'সাধারণ লেখার ফাইলে শুধু **অক্ষর** থাকে। Word ফাইলে সাজসজ্জার লুকানো নির্দেশও থাকে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'document' }, labelBn: '.txt', captionBn: 'শুধু লেখা' },
            right: { visual: { kind: 'art', name: 'book' }, labelBn: '.docx', captionBn: 'সাজসজ্জাসহ' },
            vs: 'বনাম',
          },
          chipsBn: ['প্রোগ্রামাররা .txt চান'],
          learnMoreBn: 'প্রোগ্রামাররা .txt, .py, .html-এর মতো সাধারণ লেখার ফাইলে কাজ করেন, কারণ যা লেখা হয় ঠিক তা-ই থাকে। Mac-এ TextEdit অনেক সময় সাজানো লেখায় খোলে; তখন মেনু বারে Format → Make Plain Text (Shift + Cmd + T)। ' + DIFF + '।',
        },
      ],
      steps: [
        // ---- Windows
        {
          id: 'w-go-documents-2', osVariant: 'windows', titleBn: 'Documents ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বাঁ দিকের “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় Documents লেখাটি খুঁজুন।',
        },
        {
          id: 'w-reopen-2', osVariant: 'windows', titleBn: 'hello.txt খুলুন', target: 'fm-item-hello.txt', expectedAction: { type: 'doubleClick', target: 'fm-item-hello.txt' },
          explanationBn: 'hello ফাইলে ডাবল ক্লিক করুন।',
          hintBn: 'নামের ওপর দুবার চটপট ক্লিক করুন।',
        },
        {
          id: 'w-edit', osVariant: 'windows', titleBn: 'আরও কিছু লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'লেখার শেষে আরেকটি বাক্য যোগ করুন। সেভ করবেন না।',
          hintBn: 'সাদা জায়গায় লেখার শেষে ক্লিক করে টাইপ করুন।',
        },
        {
          id: 'w-try-close', osVariant: 'windows', titleBn: 'সেভ না করে বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
          explanationBn: '✕ চাপুন — দেখুন কম্পিউটার কী বলে।',
          hintBn: 'ডান ওপরের ✕ বোতাম।',
        },
        {
          id: 'w-cancel', osVariant: 'windows', titleBn: 'Cancel: ফিরে যান', target: 'dialog-cancel', expectedAction: { type: 'click', target: 'dialog-cancel' },
          explanationBn: 'প্রশ্নটিতে “Cancel” চাপুন।',
          hintBn: 'তিনটি বোতামের একদম ডান পাশেরটি Cancel।',
          teacherTipBn: 'এখানে Don’t save চাপলে নতুন লেখাটি হারিয়ে যেত। এটি একটি ভালো আলোচনার সুযোগ।',
        },
        {
          id: 'w-file-menu2', osVariant: 'windows', titleBn: 'File মেনু খুলুন', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
          explanationBn: '“File” মেনু খুলুন।',
          hintBn: 'ওপরের সারিতে বাঁ দিকের File।',
        },
        {
          id: 'w-save-again', osVariant: 'windows', titleBn: 'Save: একই ফাইল বদলান', target: 'editor-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
          explanationBn: '“Save” বেছে নিন। দেখুন, নাম জিজ্ঞেস করবে না।',
          hintBn: 'মেনুর “Save” (Save As নয়)।',
          successMessageBn: 'একই hello.txt বদলে গেল!',
        },
        {
          id: 'w-file-menu3', osVariant: 'windows', titleBn: 'আবার File মেনু', target: 'editor-menu-file', expectedAction: { type: 'click', target: 'editor-menu-file' },
          explanationBn: 'এবার একই লেখা অন্য নামে রাখব। File মেনু খুলুন।',
          hintBn: 'ওপরের সারিতে File।',
        },
        {
          id: 'w-save-as', osVariant: 'windows', titleBn: 'Save As বেছে নিন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
          explanationBn: '“Save as” বেছে নিন।',
          hintBn: 'মেনুতে Save-এর ঠিক নিচের লাইন, যেখানে Save As লেখা।',
        },
        {
          id: 'w-name2', osVariant: 'windows', titleBn: 'নতুন নাম দিন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello-copy.txt', ignoreCase: true },
          explanationBn: 'নামের ঘরে লিখুন: hello-copy.txt',
          hintBn: 'আগের নাম মুছে লিখুন: hello-copy.txt',
        },
        {
          id: 'w-save-btn2', osVariant: 'windows', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello-copy.txt' },
          explanationBn: 'নীল “Save” বোতামে চাপুন।',
          hintBn: 'নিচের ডান দিকের নীল বোতাম।',
          successMessageBn: 'নতুন ফাইল তৈরি!',
        },
        {
          id: 'w-close-notepad2', osVariant: 'windows', titleBn: 'নোটপ্যাড বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
          explanationBn: '✕ চেপে Notepad বন্ধ করুন।',
          hintBn: 'ডান ওপরের ✕ বোতাম।',
          successMessageBn: 'Documents-এ এখন দুটি ফাইল!',
        },
        // ---- Mac
        {
          id: 'm-go-documents-2', osVariant: 'mac', titleBn: 'Documents ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বাঁ দিকের “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় Documents লেখাটি খুঁজুন।',
        },
        {
          id: 'm-reopen-2', osVariant: 'mac', titleBn: 'hello.txt খুলুন', target: 'fm-item-hello.txt', expectedAction: { type: 'doubleClick', target: 'fm-item-hello.txt' },
          explanationBn: 'hello ফাইলে ডাবল ক্লিক করুন।',
          hintBn: 'নামের ওপর দুবার চটপট ক্লিক করুন।',
        },
        {
          id: 'm-edit', osVariant: 'mac', titleBn: 'আরও কিছু লিখুন', target: 'editor-text', expectedAction: { type: 'custom', event: 'editor-dirty' },
          explanationBn: 'লেখার শেষে আরেকটি বাক্য যোগ করুন। সেভ করবেন না।',
          hintBn: 'সাদা জায়গায় লেখার শেষে ক্লিক করে টাইপ করুন।',
        },
        {
          id: 'm-try-close', osVariant: 'mac', titleBn: 'সেভ না করে বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
          explanationBn: 'লাল বোতাম চাপুন — দেখুন কম্পিউটার কী বলে।',
          hintBn: 'বাঁ ওপরের লাল বোতাম।',
        },
        {
          id: 'm-cancel', osVariant: 'mac', titleBn: 'Cancel: ফিরে যান', target: 'dialog-cancel', expectedAction: { type: 'click', target: 'dialog-cancel' },
          explanationBn: 'প্রশ্নটিতে “Cancel” চাপুন।',
          hintBn: 'বোতামগুলোর মধ্যে Cancel লেখাটি খুঁজুন।',
          teacherTipBn: 'এখানে Don’t Save চাপলে নতুন লেখাটি হারিয়ে যেত। এটি একটি ভালো আলোচনার সুযোগ।',
        },
        {
          id: 'm-save-again', osVariant: 'mac', titleBn: 'Save: একই ফাইল বদলান', target: 'editor-save', expectedAction: { type: 'saveFile', name: 'hello.txt' },
          explanationBn: 'ওপরের “Save” চাপুন। দেখুন, নাম জিজ্ঞেস করবে না।',
          hintBn: 'টুলবারের Save (Save As… নয়)।',
          successMessageBn: 'একই hello.txt বদলে গেল!',
        },
        {
          id: 'm-save-as', osVariant: 'mac', titleBn: 'Save As… বেছে নিন', target: 'editor-save-as', expectedAction: { type: 'click', target: 'editor-save-as' },
          explanationBn: 'এবার একই লেখা অন্য নামে রাখব। “Save As…” চাপুন।',
          hintBn: 'টুলবারে Save-এর পরের বোতাম, যেখানে Save As… লেখা।',
        },
        {
          id: 'm-name2', osVariant: 'mac', titleBn: 'নতুন নাম দিন', target: 'save-dialog-name', expectedAction: { type: 'type', target: 'save-dialog-name', text: 'hello-copy.txt', ignoreCase: true },
          explanationBn: 'নামের ঘরে লিখুন: hello-copy.txt',
          hintBn: 'আগের নাম মুছে লিখুন: hello-copy.txt',
        },
        {
          id: 'm-save-btn2', osVariant: 'mac', titleBn: 'Save বোতামে চাপুন', target: 'save-dialog-save', expectedAction: { type: 'saveFile', name: 'hello-copy.txt' },
          explanationBn: 'নীল “Save” বোতামে চাপুন।',
          hintBn: 'নিচের ডান দিকের নীল বোতাম।',
          successMessageBn: 'নতুন ফাইল তৈরি!',
        },
        {
          id: 'm-close-textedit2', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করুন', target: 'win-editor-close', expectedAction: { type: 'closeApp', app: 'editor' },
          explanationBn: 'লাল বোতামে ক্লিক করে TextEdit বন্ধ করুন।',
          hintBn: 'বাঁ ওপরের লাল বোতাম।',
          successMessageBn: 'Documents-এ এখন দুটি ফাইল!',
        },
      ],
      quiz: [
        {
          id: 'q-saveas', type: 'multipleChoice', questionBn: 'hello.txt বদলেছেন, কিন্তু আগের লেখাও রাখতে চান। কী করবেন?',
          options: [
            { id: 'a', textBn: 'Save — তাতে দুটো লেখাই থাকবে' },
            { id: 'b', textBn: 'Save As — নতুন নামে' },
            { id: 'c', textBn: 'ফাইলটি বন্ধ করে দিই' },
          ],
          correct: ['b'],
          hintBn: 'Save পুরোনো লেখার ওপরেই নতুন লেখা বসায়।',
          explanationBn: 'Save As নতুন ফাইল বানায়; পুরোনোটি অক্ষত থাকে।',
        },
        {
          id: 'q-match', type: 'dragMatch', questionBn: 'কাজের সাথে মানে মিলিয়ে দিন।',
          pairs: [
            { id: 'save', leftBn: 'Save', rightBn: 'একই ফাইল বদলায়' },
            { id: 'saveas', leftBn: 'Save As', rightBn: 'নতুন নামে আরেকটি ফাইল' },
            { id: 'dont', leftBn: 'Don’t save', rightBn: 'নতুন লেখা ফেলে দেয়' },
            { id: 'cancel', leftBn: 'Cancel', rightBn: 'বন্ধ না করে ফিরে যাওয়া' },
          ],
          hintBn: 'Save আগের ফাইলটিই বদলায়। Save As নতুন ফাইল বানায়।',
          explanationBn: 'চারটিই মিলেছে!',
        },
        {
          id: 'q-txt', type: 'clickTarget', questionBn: 'কোন ফাইলটি সাধারণ লেখার (plain text)?',
          items: [
            { id: 'jpg', labelBn: 'photo.jpg', icon: '🖼️' },
            { id: 'txt', labelBn: 'note.txt', icon: '📄' },
            { id: 'mp3', labelBn: 'song.mp3', icon: '🎵' },
            { id: 'docx', labelBn: 'letter.docx', icon: '📘' },
          ],
          correct: 'txt',
          hintBn: 'নামের শেষে .txt খুঁজুন।',
          explanationBn: '.txt সাধারণ লেখা। .docx-এ সাজসজ্জার নির্দেশও থাকে।',
        },
      ],
      recapBn: ['Save = একই ফাইল বদলায়', 'Save As = নতুন নামে নতুন ফাইল', 'না বুঝলে Cancel চাপি'],
      freeTryBn: 'তৃতীয় আরেকটি কপি Save As দিয়ে বানান।',
    },

    // =====================================================================================================
    // Unit 4 — install and uninstall a pretend app
    // =====================================================================================================
    {
      id: 'install',
      titleBn: 'অ্যাপ ইনস্টল ও আনইনস্টল',
      hook: {
        id: 'h-store',
        type: 'hook',
        textBn: 'ফোনে প্লে স্টোর থেকে অ্যাপ নামান, তাই না? কম্পিউটারেও **ইনস্টল** প্রায় সেরকম।',
        visual: { kind: 'art', name: 'download', captionBn: 'নামাই → বসাই' },
      },
      // the practice computer starts without the pretend app installed
      setup: { vfs: () => resetInstalls() },
      cards: [
        {
          id: 'c-official',
          type: 'visual',
          textBn: 'অ্যাপ নামান শুধু **অফিসিয়াল** জায়গা থেকে: প্রস্তুতকারকের নিজের সাইট বা অ্যাপ স্টোর।',
          visual: { kind: 'art', name: 'shield', captionBn: 'শুধু ভরসার জায়গা' },
          chipsBn: ['অফিসিয়াল সাইট', 'অ্যাপ স্টোর'],
          learnMoreBn: 'অ্যাপের নতুন সংস্করণকে আপডেট বলে। আপডেটেও ভুল ঠিক হয়, নিরাপত্তা বাড়ে — সেটিও অফিসিয়াল জায়গা থেকেই করবেন।',
        },
        {
          id: 'c-scam',
          type: 'visual',
          textBn: 'পপ-আপে “কম্পিউটার বিপদে, এখনই ইনস্টল করুন” দেখলে **ক্লিক করবেন না**। এটি প্রতারণা হতে পারে।',
          visual: { kind: 'art', name: 'warning', captionBn: 'অচেনা লিংক = বিপদ' },
          chipsBn: ['পপ-আপ নয়', 'অচেনা লিংক নয়'],
          learnMoreBn: 'অচেনা কারও পাঠানো লিংক থেকেও কিছু নামাবেন না। এ বিষয়ে পরের দিকের একটি পাঠে আরও শিখব। আজকের ইনস্টলার শুধু অনুশীলনের নকল।',
        },
        {
          id: 'c-install-flow',
          type: 'visual',
          textBn: 'ইনস্টলের ধাপ প্রায় সবসময় একই: **Download → Next → Install → Finish**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'download', labelBn: 'Download' },
              { art: 'stairs', labelBn: 'Next' },
              { art: 'package-box', labelBn: 'Install' },
              { art: 'flag', labelBn: 'Finish' },
            ],
          },
          chipsBn: ['ধাপ একই থাকে'],
          learnMoreBn: 'ইনস্টল মানে অ্যাপটি কম্পিউটারে বসিয়ে নেওয়া, যাতে পরে নাম লিখে খুলতে পারেন। Mac-এ অনেক অ্যাপ অ্যাপ স্টোর থেকে নামে; কিছু নামানো ফাইল খুলে Applications ফোল্ডারে টেনে রাখতে হয়। ' + DIFF + '।',
        },
        {
          id: 'c-uninstall-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'সরাতে **Settings → Apps** খুলুন। অ্যাপের পাশের ⋯ চেপে Uninstall বেছে নিন।',
          visual: { kind: 'mock', name: 'settings-win', os: 'windows', highlight: 'sidebar' },
          chipsBn: ['শুধু আইকন মোছা নয়'],
          learnMoreBn: 'ডেস্কটপের আইকন মুছলে অ্যাপ পুরোপুরি সরে না, জায়গাও নিয়ে থাকে। আসল কম্পিউটারে নিজের দরকারি অ্যাপ ভুল করে সরাবেন না।',
        },
        {
          id: 'c-uninstall-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'সরাতে Applications ফোল্ডার থেকে অ্যাপটি টেনে **ট্র্যাশে** ফেলুন।',
          visual: { kind: 'mock', name: 'mac-dock', os: 'mac', highlight: 'trash' },
          chipsBn: ['টেনে ট্র্যাশে'],
          learnMoreBn: 'অ্যাপ স্টোর থেকে নামানো অ্যাপ লঞ্চপ্যাডে Option কী চেপে ধরে ✕ চেপেও সরানো যায়। ' + DIFF + '। আসল কম্পিউটারে নিজের দরকারি অ্যাপ ভুল করে সরাবেন না।',
        },
      ],
      steps: [
        // ---- Windows
        {
          id: 'w-start2', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'আগে “ইনস্টলার” অ্যাপ খুঁজি। স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চার-খোপের স্টার্ট বোতাম।',
        },
        {
          id: 'w-search-installer', osVariant: 'windows', titleBn: 'স্টার্ট সার্চে খুঁজুন', target: 'start-search', expectedAction: { type: 'type', target: 'start-search', text: 'installer', ignoreCase: true },
          explanationBn: 'ওপরের সার্চ বক্সে লিখুন: installer',
          hintBn: 'মেনুর ওপরের সার্চ বক্সে ইংরেজিতে installer লিখুন।',
        },
        {
          id: 'w-open-installer', osVariant: 'windows', titleBn: 'App Installer খুলুন', target: 'start-app-installer', expectedAction: { type: 'openApp', app: 'installer' },
          explanationBn: 'ফলাফলে “App Installer”-এ ক্লিক করুন।',
          hintBn: 'তালিকার প্রথম ফলাফলটি App Installer।',
        },
        {
          id: 'w-download', osVariant: 'windows', titleBn: 'Download চাপুন', target: 'installer-download', expectedAction: { type: 'click', target: 'installer-download' },
          explanationBn: 'এটি নকল, শুধু অনুশীলনের। “Calculator Plus”-এর “Download” চাপুন।',
          hintBn: 'ডান পাশের নীল Download বোতাম। নিচের হলুদ সতর্কবার্তাটিও পড়ে নিন।',
        },
        {
          id: 'w-next', osVariant: 'windows', titleBn: 'Next চাপুন', target: 'installer-next', expectedAction: { type: 'click', target: 'installer-next' },
          explanationBn: 'নামানো শেষে “Next >” চাপুন।',
          hintBn: 'বার ভরতে একটু অপেক্ষা করুন, তারপর নিচের ডান দিকের Next।',
        },
        {
          id: 'w-install', osVariant: 'windows', titleBn: 'Install চাপুন', target: 'installer-install', expectedAction: { type: 'click', target: 'installer-install' },
          explanationBn: '“Install” চাপুন।',
          hintBn: 'নিচের ডান দিকের নীল Install।',
        },
        {
          id: 'w-finish', osVariant: 'windows', titleBn: 'Finish চাপুন', target: 'installer-finish', expectedAction: { type: 'click', target: 'installer-finish' },
          explanationBn: 'শেষ হলে “Finish” চাপুন।',
          hintBn: 'বার ভরে গেলে নিচে ডান দিকে Finish বোতাম আসবে।',
          successMessageBn: 'ইনস্টল হয়ে গেছে!',
        },
        {
          id: 'w-start3', osVariant: 'windows', titleBn: 'নতুন অ্যাপ খুঁজুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'দেখি নতুন অ্যাপ পাওয়া যায় কি না। স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের স্টার্ট বোতাম।',
        },
        {
          id: 'w-search-calc', osVariant: 'windows', titleBn: 'Calculator লিখুন', target: 'start-search', expectedAction: { type: 'type', target: 'start-search', text: 'calculator', ignoreCase: true },
          explanationBn: 'সার্চ বক্সে লিখুন: calculator',
          hintBn: 'সার্চ বক্সে ইংরেজিতে calculator লিখুন।',
        },
        {
          id: 'w-open-calc', osVariant: 'windows', titleBn: 'Calculator Plus খুলুন', target: 'start-app-calcplus', expectedAction: { type: 'openApp', app: 'calcplus' },
          explanationBn: '“Calculator Plus”-এ ক্লিক করুন।',
          hintBn: 'ফলাফলের তালিকায় Calculator Plus।',
          successMessageBn: 'নতুন অ্যাপ চলছে!',
        },
        {
          id: 'w-close-calc', osVariant: 'windows', titleBn: 'ক্যালকুলেটর বন্ধ করুন', target: 'win-calcplus-close', expectedAction: { type: 'closeApp', app: 'calcplus' },
          explanationBn: 'চাইলে কয়েকটি সংখ্যা চেপে দেখুন। তারপর ✕ চাপুন।',
          hintBn: 'ডান ওপরের ✕।',
        },
        {
          id: 'w-open-settings', osVariant: 'windows', titleBn: 'Settings খুলুন', target: 'taskbar-app-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'সরাতে টাস্কবারের গিয়ার-আইকন (Settings) চাপুন।',
          hintBn: 'টাস্কবারের গিয়ারের (দাঁতওয়ালা চাকা) মতো আইকন।',
        },
        {
          id: 'w-nav-apps', osVariant: 'windows', titleBn: 'Apps বিভাগ', target: 'settings-nav-apps', expectedAction: { type: 'click', target: 'settings-nav-apps' },
          explanationBn: 'বাঁ দিকের তালিকা থেকে “Apps”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় “Apps” লেখাটি।',
        },
        {
          id: 'w-app-menu', osVariant: 'windows', titleBn: 'তিন বিন্দু (⋯) চাপুন', target: 'settings-app-menu-Calculator Plus', expectedAction: { type: 'click', target: 'settings-app-menu-Calculator Plus' },
          explanationBn: 'Calculator Plus-এর ডান পাশের ⋯ চাপুন।',
          hintBn: 'অ্যাপের নামের সারির একদম ডান দিকে ⋯ চিহ্ন।',
        },
        {
          id: 'w-uninstall', osVariant: 'windows', titleBn: 'Uninstall বেছে নিন', target: 'settings-app-uninstall-Calculator Plus', expectedAction: { type: 'click', target: 'settings-app-uninstall-Calculator Plus' },
          explanationBn: 'ছোট মেনু থেকে “Uninstall” বেছে নিন।',
          hintBn: 'মেনুর একমাত্র লেখাটি — Uninstall।',
        },
        {
          id: 'w-uninstall-confirm', osVariant: 'windows', titleBn: 'নিশ্চিত করুন', target: 'settings-uninstall-confirm', expectedAction: { type: 'custom', event: 'app-uninstalled' },
          explanationBn: 'আবার জিজ্ঞেস করলে “Uninstall” চাপুন।',
          hintBn: 'ছোট বাক্সের ডান নিচের নীল Uninstall বোতাম।',
          successMessageBn: 'অ্যাপ সরে গেছে!',
        },
        // ---- Mac
        {
          id: 'm-spotlight2', osVariant: 'mac', titleBn: 'স্পটলাইট খুলুন', target: 'menubar-search', expectedAction: { type: 'click', target: 'menubar-search' },
          explanationBn: 'আগে “ইনস্টলার” অ্যাপ খুঁজি। ওপরের 🔍 চিহ্নে ক্লিক করুন।',
          hintBn: 'ওপরের সারির ডান দিকের 🔍 চিহ্ন।',
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
          explanationBn: 'এটি নকল, শুধু অনুশীলনের। “Calculator Plus”-এর “Download” চাপুন।',
          hintBn: 'ডান পাশের নীল Download বোতাম। নিচের হলুদ সতর্কবার্তাটিও পড়ে নিন।',
        },
        {
          id: 'm-next', osVariant: 'mac', titleBn: 'Next চাপুন', target: 'installer-next', expectedAction: { type: 'click', target: 'installer-next' },
          explanationBn: 'নামানো শেষে “Next >” চাপুন।',
          hintBn: 'বার ভরতে একটু অপেক্ষা করুন, তারপর নিচের ডান দিকের Next।',
        },
        {
          id: 'm-install', osVariant: 'mac', titleBn: 'Install চাপুন', target: 'installer-install', expectedAction: { type: 'click', target: 'installer-install' },
          explanationBn: '“Install” চাপুন।',
          hintBn: 'নিচের ডান দিকের নীল Install।',
        },
        {
          id: 'm-finish', osVariant: 'mac', titleBn: 'Finish চাপুন', target: 'installer-finish', expectedAction: { type: 'click', target: 'installer-finish' },
          explanationBn: 'শেষ হলে “Finish” চাপুন।',
          hintBn: 'বার ভরে গেলে নিচে ডান দিকে Finish বোতাম আসবে।',
          successMessageBn: 'ইনস্টল হয়ে গেছে!',
        },
        {
          id: 'm-launchpad', osVariant: 'mac', titleBn: 'লঞ্চপ্যাড খুলুন', target: 'dock-launchpad', expectedAction: { type: 'click', target: 'dock-launchpad' },
          explanationBn: 'নতুন অ্যাপ দেখতে ডকের লঞ্চপ্যাডে ক্লিক করুন।',
          hintBn: 'ডকের ছোট রঙিন বর্গ দিয়ে সাজানো আইকনটি।',
        },
        {
          id: 'm-open-calc', osVariant: 'mac', titleBn: 'Calculator Plus খুলুন', target: 'launchpad-app-calcplus', expectedAction: { type: 'openApp', app: 'calcplus' },
          explanationBn: 'নতুন “Calculator Plus”-এ ক্লিক করুন।',
          hintBn: 'আইকনগুলোর মধ্যে সবুজ ক্যালকুলেটরের ছবি।',
          successMessageBn: 'নতুন অ্যাপ চলছে!',
        },
        {
          id: 'm-close-calc', osVariant: 'mac', titleBn: 'ক্যালকুলেটর বন্ধ করুন', target: 'win-calcplus-close', expectedAction: { type: 'closeApp', app: 'calcplus' },
          explanationBn: 'চাইলে কয়েকটি সংখ্যা চেপে দেখুন। তারপর লাল বোতাম চাপুন।',
          hintBn: 'বাঁ ওপরের লাল বোতাম।',
        },
        {
          id: 'm-open-finder-2', osVariant: 'mac', titleBn: 'ফাইন্ডার খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'সরাতে ডকের প্রথম আইকন Finder-এ ক্লিক করুন।',
          hintBn: 'ডকের বাঁ দিকের হাসিমুখের মতো আইকনটি।',
        },
        {
          id: 'm-applications', osVariant: 'mac', titleBn: 'Applications ফোল্ডারে যান', target: 'fm-sidebar-Applications', expectedAction: { type: 'click', target: 'fm-sidebar-Applications' },
          explanationBn: 'বাঁ দিকের “Applications”-এ ক্লিক করুন।',
          hintBn: 'Finder উইন্ডোর বাঁ পাশে Applications লেখাটি।',
        },
        {
          id: 'm-drag-trash', osVariant: 'mac', titleBn: 'ট্র্যাশে টেনে ফেলুন', target: 'fm-item-Calculator Plus.app', expectedAction: { type: 'drag', target: 'fm-item-Calculator Plus.app', dropTarget: 'dock-trash' },
          explanationBn: 'Calculator Plus.app টেনে ডকের ট্র্যাশে ছেড়ে দিন।',
          hintBn: 'আইকন ধরে চেপে রেখে ট্র্যাশের ওপর নিয়ে গিয়ে ছেড়ে দিন।',
          simplerBn: 'ফাইলে বোতাম চেপে ধরুন। চেপে রেখেই মাউস ডকের শেষের ট্র্যাশের ওপর নিয়ে যান। তারপর ছাড়ুন।',
          successMessageBn: 'অ্যাপ সরে গেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-source', type: 'multipleChoice', questionBn: 'নতুন অ্যাপ ইনস্টলের সবচেয়ে নিরাপদ উপায় কোনটি?',
          options: [
            { id: 'a', textBn: 'পপ-আপে “এখনই ইনস্টল করুন” দেখলে সেখান থেকে' },
            { id: 'b', textBn: 'অচেনা কারও পাঠানো লিংক থেকে' },
            { id: 'c', textBn: 'প্রস্তুতকারকের সাইট বা অফিসিয়াল অ্যাপ স্টোর থেকে' },
          ],
          correct: ['c'],
          hintBn: 'যারা অ্যাপটি বানিয়েছে, বা কম্পিউটারের নিজস্ব স্টোর।',
          explanationBn: 'অফিসিয়াল উৎস নিরাপদ। পপ-আপ বা অচেনা লিংক ঝুঁকির।',
        },
        {
          id: 'q-order-install', type: 'ordering', questionBn: 'ইনস্টলের ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'অফিসিয়াল জায়গা থেকে Download' },
            { id: '2', textBn: 'সেটআপে Next চাপি' },
            { id: '3', textBn: 'Install চাপি' },
            { id: '4', textBn: 'Finish চাপি' },
          ],
          hintBn: 'আগে নামানো, শেষে Finish।',
          explanationBn: 'Download → Next → Install → Finish।',
        },
        {
          id: 'q-uninstall', type: 'multipleChoice', questionBn: 'কম্পিউটার থেকে অ্যাপ ঠিকমতো সরাবেন কীভাবে?',
          options: [
            { id: 'a', textBn: 'Windows-এ Settings → Apps, Mac-এ ট্র্যাশে ফেলে' },
            { id: 'b', textBn: 'শুধু ডেস্কটপের আইকন মুছে' },
            { id: 'c', textBn: 'কম্পিউটার বন্ধ করে' },
          ],
          correct: ['a'],
          hintBn: 'শুধু আইকন মুছলে অ্যাপ পুরোপুরি সরে না।',
          explanationBn: 'Uninstall বা ট্র্যাশ — এই দুই পথই ঠিক।',
        },
      ],
      recapBn: ['শুধু অফিসিয়াল উৎস থেকে নামাই', 'Download → Next → Install → Finish', 'সরাতে Uninstall বা ট্র্যাশ'],
      freeTryBn: 'আবার ইনস্টল করে আনইনস্টল করে দেখুন।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'নাম লিখে নোটপ্যাড বা টেক্সটএডিট খুলে দুই লাইন লিখুন। Documents-এ hello.txt নামে সেভ করুন।',
      'ফাইলটি ডাবল ক্লিকে আবার খুলুন। এক লাইন যোগ করে Save করুন, তারপর Save As দিয়ে একটি কপি বানান।',
    ],
    windowsTasksBn: ['Settings → Apps → Installed apps খুলে শুধু দেখুন কী কী অ্যাপ আছে। কিছু সরাবেন না।'],
    macTasksBn: ['Finder-এ Applications ফোল্ডারটি খুলে শুধু দেখুন কী কী অ্যাপ আছে। কিছু সরাবেন না।'],
  },

  teacherTipBn:
    'Save আর Save As-এর তফাত অনেকেই প্রথমে বুঝতে পারেন না। আসল কম্পিউটারে একটি ছোট ফাইলে দুজনে মিলে পরীক্ষা করুন: Save করে ফাইল খুলে দেখুন, তারপর Save As করে ফোল্ডারে দুটি ফাইল দেখান। আজকের ইনস্টল-আনইনস্টল সিমুলেশনে নকল অ্যাপ ছিল — আসল কম্পিউটারে কোনো অ্যাপ সরানোর আগে অবশ্যই আপনি দেখে নেবেন। নতুন Notepad ও TextEdit-এ অটো-সেভের মতো সুবিধা থাকতে পারে, তাই আসল কম্পিউটারে একটু আলাদা আচরণ দেখলে অবাক হবেন না।',
}

export default lesson
