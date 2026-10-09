import type { Lesson } from '../../engine/types'

/**
 * Module 5 — কিবোর্ড ও টাইপিং, cards format. Four units:
 * (1) the keys (+ Shift typing step), (2) shortcuts (copy/paste/undo practice), (3) typing practice and programming symbols (widgets + one typing step),
 * (4) adding and switching the Bangla keyboard (simulated Settings walkthrough; Windows and Mac routes).
 * Step targets and expectedAction semantics are the same as in the old guided practice (17 old steps per OS, +2 new typing steps); only the words changed.
 */
const lesson: Lesson = {
  module: 5,
  part: 1,
  id: 'm05',
  titleBn: 'কিবোর্ড ও টাইপিং',
  oneLineBn: 'কী চিনি, শর্টকাট শিখি, কোডের চিহ্ন লিখি, আর বাংলা কিবোর্ড চালু করি।',
  minutes: 8,
  glossaryIds: [
    'key', 'cursor', 'modifier-key', 'function-keys', 'enter-key', 'space-bar', 'backspace-key', 'delete-key', 'shift-key', 'caps-lock', 'tab-key', 'arrow-keys', 'esc-key',
    'ctrl-key', 'command-key', 'shortcut', 'kb-copy', 'kb-paste', 'kb-cut', 'kb-undo', 'kb-redo', 'kb-select-all', 'kb-find', 'home-row', 'wpm',
    'sym-curly', 'sym-square', 'sym-paren', 'sym-angle', 'sym-slash', 'sym-backslash', 'sym-pipe', 'sym-underscore', 'sym-hyphen', 'sym-equals', 'sym-plus', 'sym-quotes', 'sym-backtick',
    'sym-semicolon', 'sym-colon', 'sym-hash', 'sym-at', 'sym-dollar', 'sym-percent', 'sym-caret', 'sym-ampersand', 'sym-asterisk', 'sym-tilde',
    'keyboard-layout', 'input-indicator', 'input-source',
  ],

  units: [
    // =====================================================================================================
    {
      id: 'keys',
      titleBn: 'কিবোর্ডের কী-গুলো',
      setup: { openApps: ['editor'] },
      hook: {
        id: 'h-keys',
        type: 'hook',
        textBn: 'ফেসবুকে লেখা, ফর্ম ভরা, চাকরির আবেদন — সবকিছুর শুরু **কিবোর্ড** থেকে।',
        visual: { kind: 'art', name: 'keyboard' },
      },
      cards: [
        {
          id: 'c-groups',
          type: 'visual',
          textBn: 'রান্নাঘরে হাতা-খুন্তি আর মশলা আলাদা তাকে থাকে। কিবোর্ডও গ্রুপে সাজানো — একেকটা গ্রুপে চেপে দেখুন।',
          visual: { kind: 'widget', widget: 'keyboard-layout', captionBn: 'পারেন? একটা গ্রুপে চাপুন' },
          learnMoreBn: 'ওপরে F1–F12 (ফাংশন কী), মাঝে অক্ষর আর সংখ্যা, ডানে তীর কী আর নাম্বার প্যাড। প্রতি গ্রুপে কী আছে জানলে দরকারি কী চট করে পাবেন।',
        },
        {
          id: 'c-enter',
          type: 'visual',
          textBn: '**Enter** নতুন লাইনে নেয় বা “ঠিক আছে” বলে। দুই শব্দের মাঝে ফাঁক দেয় লম্বা **Space**।',
          visual: { kind: 'mock', name: 'keyboard-keys', highlight: 'enter' },
          chipsBn: ['Enter = ঠিক আছে', 'Space = ফাঁক'],
          learnMoreBn: 'Mac-এ Enter কী-এর নাম Return। ফর্মে লেখা শেষ করে Enter চাপলে সাধারণত “জমা দিন” বোতাম চাপার কাজ হয়।',
        },
        {
          id: 'c-backspace',
          type: 'visual',
          textBn: 'ভুল লিখে ফেলেছেন? **Backspace** কার্সারের বাঁ দিকের অক্ষর মুছে দেয় — ভুলের সেরা বন্ধু।',
          visual: { kind: 'mock', name: 'keyboard-keys', highlight: 'backspace' },
          chipsBn: ['বাঁ দিকের অক্ষর মোছে'],
          learnMoreBn: 'Mac-এর এই কী-তে “delete” লেখা থাকে, কাজ একই। Windows-এর আলাদা Delete কী ডান দিকের অক্ষর মুছে ফেলে।',
        },
        {
          id: 'c-shift',
          type: 'visual',
          textBn: '**Shift** চেপে ধরে অক্ষর চাপলে বড় হাতের অক্ষর আসে। সব বড় হয়ে গেলে **Caps Lock** দেখুন।',
          visual: { kind: 'mock', name: 'keyboard-keys', highlight: 'shift' },
          chipsBn: ['Shift = বড় অক্ষর', 'Caps = সব বড়'],
          learnMoreBn: 'Shift চেপে ধরে কী চাপলে কী-এর ওপরের চিহ্নও আসে, যেমন @ বা {। Caps Lock একবার চাপলে চালু হয়, আবার চাপলে বন্ধ।',
        },
        {
          id: 'c-tab',
          type: 'visual',
          textBn: 'ফর্মে এক ঘর থেকে পরের ঘরে যেতে **Tab** চাপুন — মাউস ছাড়াই!',
          visual: { kind: 'mock', name: 'keyboard-keys', highlight: 'tab' },
          chipsBn: ['Tab = পরের ঘর'],
          learnMoreBn: 'লেখার মধ্যে Tab বড় ফাঁক দেয়। কোডে ভেতরের লাইন সরাতেও Tab লাগে।',
        },
        {
          id: 'c-arrows',
          type: 'visual',
          textBn: '**তীর কী** কার্সার সরায়। আর **Esc** বলে “থাক, লাগবে না” — মেনু বা ছোট বাক্স বন্ধ করে।',
          visual: { kind: 'mock', name: 'keyboard-keys', highlight: 'arrows' },
          chipsBn: ['তীর = কার্সার সরানো', 'Esc = বন্ধ করা'],
          learnMoreBn: 'কার্সার হলো লেখার জায়গা চেনানো ছোট দাগ, যা জ্বলে-নেভে। Esc কী কিবোর্ডের একদম বাঁ ওপরের কোণে থাকে।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-type', osVariant: 'windows', titleBn: 'Shift দিয়ে বড় হাতের অক্ষর', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'Hello World' },
          explanationBn: 'Notepad-এ ক্লিক করে Hello World লিখুন (H আর W-এ Shift)।',
          hintBn: 'Shift চেপে ধরে H চাপুন, ছেড়ে বাকিটা লিখুন। মাঝে একবার Space।',
          simplerBn: 'বাঁ কড়ে আঙুলে Shift ধরুন, ডান হাতে H চাপুন, দুটোই ছাড়ুন। ভুল হলে Backspace দিন।',
          successMessageBn: 'চমৎকার লেখা!',
        },
        // ---------- Mac ----------
        {
          id: 'm-type', osVariant: 'mac', titleBn: 'Shift দিয়ে বড় হাতের অক্ষর', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'Hello World' },
          explanationBn: 'TextEdit-এ ক্লিক করে Hello World লিখুন (H আর W-এ ⇧ Shift)।',
          hintBn: 'Shift চেপে ধরে H চাপুন, ছেড়ে বাকিটা লিখুন। মাঝে একবার Space।',
          simplerBn: 'বাঁ কড়ে আঙুলে ⇧ Shift ধরুন, ডান হাতে H চাপুন, দুটোই ছাড়ুন। ভুল হলে delete কী দিন।',
          successMessageBn: 'চমৎকার লেখা!',
        },
      ],
      quiz: [
        {
          id: 'q-backspace',
          type: 'clickTarget',
          questionBn: 'কোন কী কার্সারের বাঁ দিকের অক্ষর মুছে ফেলে? (Mac-এ “delete” লেখা থাকে)',
          items: [
            { id: 'enter', labelBn: 'Enter / Return', icon: '↵' },
            { id: 'backspace', labelBn: 'Backspace / delete', icon: '⌫' },
            { id: 'tab', labelBn: 'Tab', icon: '⇥' },
            { id: 'esc', labelBn: 'Esc', icon: '⎋' },
          ],
          correct: 'backspace',
          hintBn: 'বাঁ দিকে মুছে ফেলার মতো তীর আঁকা কী-টি (⌫) খুঁজুন।',
          explanationBn: 'Backspace ভুল সারায়। Enter নতুন লাইনে নেয়, Tab ফাঁক দেয়, Esc বন্ধ করে।',
        },
        {
          id: 'q-tab',
          type: 'multipleChoice',
          questionBn: 'ফর্মে এক ঘর থেকে পরের ঘরে যেতে কোন কী চাপবেন?',
          options: [
            { id: 'a', textBn: 'Tab' },
            { id: 'b', textBn: 'Esc' },
            { id: 'c', textBn: 'Caps Lock' },
            { id: 'd', textBn: 'Backspace' },
          ],
          correct: ['a'],
          hintBn: 'কিবোর্ডের বাঁ দিকে, Caps Lock-এর ঠিক ওপরের কী — ঘর থেকে ঘরে লাফ দেয়।',
          explanationBn: 'Tab পরের ঘরে নিয়ে যায়।',
        },
        {
          id: 'q-esc',
          type: 'multipleChoice',
          questionBn: 'কোনো ছোট বাক্স খোলা। Esc চাপলে কী হবে?',
          options: [
            { id: 'a', textBn: 'বাক্সটি বন্ধ হবে' },
            { id: 'b', textBn: 'সব লেখা মুছে যাবে' },
            { id: 'c', textBn: 'কম্পিউটার বন্ধ হবে' },
            { id: 'd', textBn: 'নতুন লাইন আসবে' },
          ],
          correct: ['a'],
          hintBn: 'Esc মানে “থাক, লাগবে না”।',
          explanationBn: 'Esc মেনু বা ছোট বাক্স বন্ধ করে।',
        },
      ],
      recapBn: ['Enter ঠিক আছে, Space ফাঁক', 'Backspace ভুল মোছে', 'Shift বড় অক্ষর'],
      freeTryBn: 'যেকোনো লেখার ঘরে নিজের নাম লিখে Backspace দিয়ে মুছুন।',
    },

    // =====================================================================================================
    {
      id: 'shortcuts',
      titleBn: 'শর্টকাট: কপি, পেস্ট, আনডু',
      setup: { openApps: ['editor'] },
      hook: {
        id: 'h-shortcuts',
        type: 'hook',
        textBn: 'মেনু খুঁজে খুঁজে হাঁপিয়ে গেছেন? দুটো কী একসাথে চাপলেই কাজ শেষ — এর নাম **শর্টকাট**।',
        visual: { kind: 'art', name: 'clipboard' },
      },
      cards: [
        {
          id: 'c-modkey',
          type: 'compare',
          textBn: 'মূল নিয়ম একটাই: Windows-এ **Ctrl**, Mac-এ **⌘ Command**। বাকি অক্ষর একই।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'keyboard-keys', os: 'windows', highlight: 'ctrl' }, labelBn: 'Windows', captionBn: 'Ctrl' },
            right: { visual: { kind: 'mock', name: 'keyboard-keys', os: 'mac', highlight: 'cmd' }, labelBn: 'Mac', captionBn: '⌘ Command' },
            vs: 'বা',
          },
          learnMoreBn: 'কী একসাথে চাপার সময় আগে Ctrl (বা ⌘) চেপে ধরুন, তারপর অক্ষরটি একবার চাপুন, তারপর দুটোই ছাড়ুন। কী চেপে ধরে রাখলে একই কাজ বারবার হতে পারে।',
        },
        {
          id: 'c-copy',
          type: 'visual',
          textBn: '**কপি** মানে লেখার ফটোকপি; মূলটা যেমন ছিল তেমনই থাকে। অক্ষর **C** — Copy।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'mod+c', captionBn: 'কপি' },
          learnMoreBn: 'কপি করলে পর্দায় কিছু বদলায় না — নকলটি শুধু তুলে রাখা হয়। আর কাট (Ctrl/⌘ + X) হলো কাঁচি দিয়ে কেটে নেওয়া: মূল লেখাও সরে যায়।',
        },
        {
          id: 'c-paste',
          type: 'visual',
          textBn: '**পেস্ট**: তুলে রাখা নকল কার্সারের জায়গায় আঠা দিয়ে লাগানো। **V** কী C-এর পাশেই।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'mod+v', captionBn: 'পেস্ট' },
          learnMoreBn: 'একবার কপি করে বারবার পেস্ট করা যায়। কপি করা লেখা নতুন কিছু কপি না করা পর্যন্ত থাকে।',
        },
        {
          id: 'c-undo',
          type: 'visual',
          textBn: 'ভুল হয়েছে? **আনডু** শেষ কাজ ফিরিয়ে নেয়, অক্ষর **Z**।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'mod+z', captionBn: 'আনডু' },
          learnMoreBn: 'আনডু করা কাজ আবার ফিরিয়ে আনতে চাইলে রিডু: Windows-এ Ctrl + Y বা Ctrl + Shift + Z, Mac-এ ⌘ + Shift + Z।',
        },
        {
          id: 'c-table',
          type: 'visual',
          textBn: 'আরও শর্টকাট আছে — সব বাছা, সেভ, খোঁজা। নিজের কিবোর্ডে চেপে মিলিয়ে নিন।',
          visual: { kind: 'widget', widget: 'shortcut-table', captionBn: 'পারেন? তালিকাটি দেখুন' },
          learnMoreBn: 'Ctrl/⌘ + A সব বেছে নেয়, + S সেভ করে, + F লেখার মধ্যে শব্দ খোঁজে। মুখস্থ করতে হবে না — কাজের মধ্যে একটি-দুটি করে ব্যবহার করলেই হাত শিখে যাবে।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-type2', osVariant: 'windows', titleBn: 'আগে কিছু লিখে নিন', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'Hello' },
          explanationBn: 'Notepad-এ ক্লিক করে Hello লিখুন।',
          hintBn: 'সাদা ঘরে ক্লিক করে ইংরেজিতে Hello লিখুন।',
          successMessageBn: 'চমৎকার লেখা!',
        },
        {
          id: 'w-select-all', osVariant: 'windows', titleBn: 'সব বেছে নিন: Ctrl + A', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+a' },
          explanationBn: 'Ctrl চেপে ধরে A চাপুন — সব লেখা রঙিন হবে।',
          hintBn: 'বাঁ নিচের কোণের Ctrl চেপে ধরে A চাপুন।',
          simplerBn: 'এক আঙুলে Ctrl ধরে রাখুন, অন্য আঙুলে একবার A চাপুন। “শর্টকাট প্যাড” থেকেও পারেন।',
          successMessageBn: 'সব বাছা হয়েছে!',
        },
        {
          id: 'w-copy', osVariant: 'windows', titleBn: 'কপি করুন: Ctrl + C', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
          explanationBn: 'Ctrl চেপে ধরে C চাপুন। পর্দায় কিছু বদলাবে না — এটাই স্বাভাবিক।',
          hintBn: 'Ctrl চেপে ধরে C চাপুন। C মানে Copy।',
          successMessageBn: 'কপি হয়েছে!',
        },
        {
          id: 'w-click-end', osVariant: 'windows', titleBn: 'কার্সার লেখার শেষে নিন', target: 'editor-text', expectedAction: { type: 'click', target: 'editor-text' },
          explanationBn: 'সাদা ঘরের ফাঁকা অংশে একবার ক্লিক করুন।',
          hintBn: 'লেখার নিচের ফাঁকা সাদা জায়গায় একবার ক্লিক করুন।',
          successMessageBn: 'কার্সার ঠিক জায়গায়!',
        },
        {
          id: 'w-paste', osVariant: 'windows', titleBn: 'পেস্ট করুন: Ctrl + V', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+v' },
          explanationBn: 'Ctrl চেপে ধরে V চাপুন — কপি করা লেখা বসে যাবে।',
          hintBn: 'Ctrl চেপে ধরে V চাপুন। V কী C-এর ডান পাশে।',
          successMessageBn: 'পেস্ট হয়েছে!',
        },
        {
          id: 'w-undo', osVariant: 'windows', titleBn: 'ভুল হলে ফিরে যান: Ctrl + Z', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+z' },
          explanationBn: 'Ctrl চেপে ধরে Z চাপুন — শেষ কাজটা ফিরে যাবে।',
          hintBn: 'Ctrl চেপে ধরে Z চাপুন। Z নিচের সারির একদম বাঁয়ে।',
          successMessageBn: 'আনডু হয়েছে!',
        },
        // ---------- Mac ----------
        {
          id: 'm-type2', osVariant: 'mac', titleBn: 'আগে কিছু লিখে নিন', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'Hello' },
          explanationBn: 'TextEdit-এ ক্লিক করে Hello লিখুন।',
          hintBn: 'সাদা ঘরে ক্লিক করে ইংরেজিতে Hello লিখুন।',
          successMessageBn: 'চমৎকার লেখা!',
        },
        {
          id: 'm-select-all', osVariant: 'mac', titleBn: 'সব বেছে নিন: ⌘ + A', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+a' },
          explanationBn: '⌘ Command চেপে ধরে A চাপুন — সব লেখা রঙিন হবে।',
          hintBn: 'স্পেসবারের পাশের ⌘ চেপে ধরে A চাপুন।',
          simplerBn: 'এক আঙুলে ⌘ ধরে রাখুন, অন্য আঙুলে একবার A চাপুন। “শর্টকাট প্যাড” থেকেও পারেন।',
          successMessageBn: 'সব বাছা হয়েছে!',
        },
        {
          id: 'm-copy', osVariant: 'mac', titleBn: 'কপি করুন: ⌘ + C', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
          explanationBn: '⌘ চেপে ধরে C চাপুন। পর্দায় কিছু বদলাবে না — এটাই স্বাভাবিক।',
          hintBn: '⌘ চেপে ধরে C চাপুন। C মানে Copy।',
          successMessageBn: 'কপি হয়েছে!',
        },
        {
          id: 'm-click-end', osVariant: 'mac', titleBn: 'কার্সার লেখার শেষে নিন', target: 'editor-text', expectedAction: { type: 'click', target: 'editor-text' },
          explanationBn: 'সাদা ঘরের ফাঁকা অংশে একবার ক্লিক করুন।',
          hintBn: 'লেখার নিচের ফাঁকা সাদা জায়গায় একবার ক্লিক করুন।',
          successMessageBn: 'কার্সার ঠিক জায়গায়!',
        },
        {
          id: 'm-paste', osVariant: 'mac', titleBn: 'পেস্ট করুন: ⌘ + V', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+v' },
          explanationBn: '⌘ চেপে ধরে V চাপুন — কপি করা লেখা বসে যাবে।',
          hintBn: '⌘ চেপে ধরে V চাপুন। V কী C-এর ডান পাশে।',
          successMessageBn: 'পেস্ট হয়েছে!',
        },
        {
          id: 'm-undo', osVariant: 'mac', titleBn: 'ভুল হলে ফিরে যান: ⌘ + Z', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+z' },
          explanationBn: '⌘ চেপে ধরে Z চাপুন — শেষ কাজটা ফিরে যাবে।',
          hintBn: '⌘ চেপে ধরে Z চাপুন। Z নিচের সারির একদম বাঁয়ে।',
          successMessageBn: 'আনডু হয়েছে!',
        },
      ],
      quiz: [
        {
          id: 'q-match',
          type: 'dragMatch',
          questionBn: 'শর্টকাটের সাথে কাজ মেলান। (Windows-এ Ctrl, Mac-এ ⌘ — অক্ষর একই)',
          pairs: [
            { id: 'c', leftBn: 'Ctrl / ⌘ + C', rightBn: 'কপি (নকল করা)' },
            { id: 'v', leftBn: 'Ctrl / ⌘ + V', rightBn: 'পেস্ট (বসানো)' },
            { id: 'z', leftBn: 'Ctrl / ⌘ + Z', rightBn: 'আনডু (ফিরে যাওয়া)' },
            { id: 'a', leftBn: 'Ctrl / ⌘ + A', rightBn: 'সব বেছে নেওয়া' },
            { id: 's', leftBn: 'Ctrl / ⌘ + S', rightBn: 'সেভ (জমিয়ে রাখা)' },
          ],
          hintBn: 'C = Copy, A = All (সব), S = Save। বাকি: V পেস্ট, Z আনডু।',
          explanationBn: 'শর্টকাট মুখস্থ লাগে না — হাত নিজেই শিখে যায়।',
        },
        {
          id: 'q-order',
          type: 'ordering',
          questionBn: 'লেখা কপি করে অন্য জায়গায় বসানোর ধাপগুলো সাজান।',
          items: [
            { id: 'select', textBn: 'যে লেখা নেবেন সেটি বেছে নিন' },
            { id: 'copy', textBn: 'Ctrl + C (Mac-এ ⌘ + C) চাপুন' },
            { id: 'click', textBn: 'যেখানে বসাবেন সেখানে ক্লিক করুন' },
            { id: 'paste', textBn: 'Ctrl + V (Mac-এ ⌘ + V) চাপুন' },
          ],
          hintBn: 'আগে বাছাই, তারপর কপি, তারপর জায়গা ঠিক, শেষে পেস্ট।',
          explanationBn: 'বাছাই, কপি, জায়গা ঠিক, পেস্ট — প্রতিদিনের চার ধাপ।',
        },
        {
          id: 'q-mod',
          type: 'multipleChoice',
          questionBn: 'কপি করতে কোন কী চেপে ধরে C চাপবেন?',
          options: [
            { id: 'a', textBn: 'Windows-এ Ctrl, Mac-এ ⌘' },
            { id: 'b', textBn: 'দুটোতেই Esc' },
            { id: 'c', textBn: 'দুটোতেই Tab' },
            { id: 'd', textBn: 'দুটোতেই Caps Lock' },
          ],
          correct: ['a'],
          hintBn: 'Windows আর Mac-এর মূল কী আলাদা, অক্ষর একই।',
          explanationBn: 'Windows-এ Ctrl, Mac-এ ⌘ — বাকিটা এক।',
        },
      ],
      recapBn: ['Windows-এ Ctrl, Mac-এ ⌘', 'C কপি, V পেস্ট', 'Z আনডু'],
      freeTryBn: 'নিজের নামের একটা অক্ষর বেছে কপি-পেস্ট করে আনডু করুন।',
    },

    // =====================================================================================================
    {
      id: 'typing-symbols',
      titleBn: 'টাইপ প্র্যাকটিস ও কোডের চিহ্ন',
      setup: { openApps: ['editor'] },
      hook: {
        id: 'h-typing',
        type: 'hook',
        textBn: 'কোডে অক্ষরের মতোই **চিহ্ন**ও জরুরি। চলুন আঙুলকে চিনিয়ে নিই!',
        visual: { kind: 'art', name: 'code-brackets' },
      },
      cards: [
        {
          id: 'c-homerow',
          type: 'visual',
          textBn: 'বাঁ তর্জনী **F**-এ, ডান তর্জনী **J**-তে রাখুন। দুটোতেই ছোট উঁচু দাগ আছে — না দেখেই পাবেন।',
          visual: { kind: 'art', name: 'keyboard', captionBn: 'F আর J-তে উঁচু দাগ' },
          chipsBn: ['পিঠ সোজা', 'গতির আগে নির্ভুলতা'],
          learnMoreBn: 'কবজি ঝুলিয়ে না রেখে হালকা ভাসিয়ে রাখুন। গতির চেয়ে নির্ভুল লেখা আগে — গতি আপনা থেকেই বাড়বে। আঙুল রাখার সারিটির নাম হোম রো (a s d f g h j k l)।',
        },
        {
          id: 'c-typing',
          type: 'visual',
          textBn: 'এবার নিজে টাইপ করে দেখুন। ভুল হলে লাল দাগ আসবে — Backspace দিয়ে ঠিক করুন।',
          visual: { kind: 'widget', widget: 'typing-practice', captionBn: 'পারেন? বাক্যটা টাইপ করুন' },
          learnMoreBn: 'শুরুতে গতি কম হওয়াই স্বাভাবিক। প্রতিদিন পাঁচ মিনিট অনুশীলনই যথেষ্ট।',
        },
        {
          id: 'c-code',
          type: 'code',
          textBn: 'এই ছোট কোডে আছে **গোল ব্র্যাকেট**, **কোট** আর অক্ষর।',
          visual: {
            kind: 'code',
            lang: 'python',
            lines: [{ code: 'print("Hello")', noteBn: '( ) আর " " — সবই চিহ্ন!' }],
            output: ['Hello'],
          },
          learnMoreBn: 'প্রোগ্রামিংয়ে এই চিহ্নগুলো বারবার লাগে: { } [ ] ( ) < > / \\ | _ - = + " \' ` ; : # @ $ % ^ & * ~',
        },
        {
          id: 'c-shift-symbol',
          type: 'visual',
          textBn: 'বেশিরভাগ চিহ্ন **Shift + একটি কী**। যেমন { আসে Shift চেপে [ চাপলে।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'shift+[', captionBn: 'কার্লি ব্র্যাকেট {' },
          chipsBn: ['Shift = ওপরের চিহ্ন'],
          learnMoreBn: 'Shift + \' হলো ডবল কোট ("), Shift + 3 হলো #, Shift + 2 হলো @। কিছু কিবোর্ডে \\ | " # @-এর জায়গা আলাদা — তখন কী-এর গায়ে ছাপা চিহ্ন দেখে খুঁজে নিন। Mac-এ এগুলোর জন্য Option কী লাগে না।',
        },
        {
          id: 'c-symbols',
          type: 'visual',
          textBn: 'একটা চিহ্ন বেছে আসল কিবোর্ডে চেপে দেখুন — ঠিক হলে সবুজ হবে।',
          visual: { kind: 'widget', widget: 'symbol-drill', captionBn: 'পারেন? চিহ্নটা লিখুন' },
          learnMoreBn: 'ভুল কী চাপলে ছোট ইঙ্গিত আসবে, যেমন “Shift লাগবে”। কোনো চিহ্ন না পেলে কী-এর গায়ের ছাপা অক্ষর দেখুন।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-code', osVariant: 'windows', titleBn: 'কোডের চিহ্ন লিখুন', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'print("Hello")' },
          explanationBn: 'Notepad-এ print("Hello") লিখুন (Shift লাগবে)।',
          hintBn: '( ) আর " " — তিনটাতেই Shift: 9, 0 আর \' কী।',
          successMessageBn: 'চমৎকার লেখা!',
        },
        // ---------- Mac ----------
        {
          id: 'm-code', osVariant: 'mac', titleBn: 'কোডের চিহ্ন লিখুন', target: 'editor-text', expectedAction: { type: 'type', target: 'editor-text', text: 'print("Hello")' },
          explanationBn: 'TextEdit-এ print("Hello") লিখুন (Shift লাগবে)।',
          hintBn: '( ) আর " " — তিনটাতেই Shift: 9, 0 আর \' কী।',
          successMessageBn: 'চমৎকার লেখা!',
        },
      ],
      quiz: [
        {
          id: 'q-curly',
          type: 'multipleChoice',
          questionBn: 'কিবোর্ডে { কীভাবে লিখবেন? (US কিবোর্ড)',
          options: [
            { id: 'a', textBn: 'Shift চেপে ধরে [ চাপব' },
            { id: 'b', textBn: 'শুধু [ চাপব' },
            { id: 'c', textBn: 'Ctrl চেপে ধরে [ চাপব' },
            { id: 'd', textBn: 'Caps Lock চালু করে [ চাপব' },
          ],
          correct: ['a'],
          hintBn: '{ আসলে [ কী-এরই ওপরের চিহ্ন।',
          explanationBn: 'ওপরের চিহ্ন পেতে Shift লাগে। শুধু [ চাপলে স্কোয়ার ব্র্যাকেট আসে।',
        },
        {
          id: 'q-homerow',
          type: 'multipleChoice',
          questionBn: 'কোন দুই কী-তে ছোট উঁচু দাগ থাকে, যেখানে তর্জনী রাখেন?',
          options: [
            { id: 'a', textBn: 'F আর J' },
            { id: 'b', textBn: 'A আর L' },
            { id: 'c', textBn: 'Q আর P' },
            { id: 'd', textBn: 'Z আর M' },
          ],
          correct: ['a'],
          hintBn: 'বাঁ হাতের তর্জনী আর ডান হাতের তর্জনী — দুটো কী পাশাপাশি নয়।',
          explanationBn: 'F আর J-এর দাগ আঙুলকে ঠিক জায়গা চেনায়।',
        },
        {
          id: 'q-paren',
          type: 'multipleChoice',
          questionBn: 'Shift + 9 চাপলে কোন চিহ্ন আসে? (US কিবোর্ড)',
          options: [
            { id: 'a', textBn: '(' },
            { id: 'b', textBn: '[' },
            { id: 'c', textBn: '{' },
            { id: 'd', textBn: '"' },
          ],
          correct: ['a'],
          hintBn: '9 আর 0 কী-এর ওপরে গোল ব্র্যাকেট ছাপা।',
          explanationBn: 'Shift + 9 হলো (, আর Shift + 0 হলো )।',
        },
      ],
      recapBn: ['F আর J-তে তর্জনী', 'চিহ্ন মানে Shift + কী', 'গতির আগে নির্ভুলতা'],
      freeTryBn: 'আসল কিবোর্ডে { } ( ) " — পাঁচটাই খুঁজে লিখুন।',
    },

    // =====================================================================================================
    {
      id: 'bangla-keyboard',
      titleBn: 'বাংলা কিবোর্ড যোগ করা ও বদলানো',
      setup: { openApps: ['editor'] },
      hook: {
        id: 'h-bangla',
        type: 'hook',
        textBn: 'কিবোর্ডে বাংলাও লেখা যায়! শুধু একবার **যোগ** করে নিতে হয়।',
        visual: { kind: 'art', name: 'language' },
      },
      cards: [
        {
          id: 'c-where',
          type: 'compare',
          textBn: 'যোগ করার জায়গা আলাদা: Windows-এ **Time & language**, Mac-এ **Keyboard**।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'settings-win', os: 'windows', highlight: 'time' }, labelBn: 'Windows', captionBn: 'Time & language' },
            right: { visual: { kind: 'mock', name: 'settings-mac', os: 'mac', highlight: 'keyboard' }, labelBn: 'Mac', captionBn: 'Keyboard' },
            vs: 'বা',
          },
          learnMoreBn: 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে। Windows 11: Settings → Time & language → Language & region → Add a language। Mac: System Settings → Keyboard → Text Input → Input Sources → Edit…।',
        },
        {
          id: 'c-win-switch',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'যোগ হলে টাস্কবারের ডান কোণে **ENG** বোতাম আসে। ওতে ক্লিক করলে **BEN** বেছে নেওয়া যায়।',
          visual: { kind: 'mock', name: 'win-taskbar', os: 'windows', highlight: 'tray' },
          chipsBn: ['ENG = ইংরেজি', 'BEN = বাংলা'],
          learnMoreBn: 'বাংলা আগে থেকে থাকলে ওই ভাষার পাশের তিন বিন্দুতে Language options → Add a keyboard-ও আছে। কিছু কম্পিউটারে Alt + Shift দিয়েও ভাষা বদলায়।',
        },
        {
          id: 'c-mac-switch',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'যোগ হলে মেনু বারের ডান দিকে **ইনপুট মেনু** আসে। ওতে ক্লিক করে **Bangla** বেছে নিন।',
          visual: { kind: 'mock', name: 'mac-menubar', os: 'mac', highlight: 'status' },
          chipsBn: ['ABC = ইংরেজি', 'Bangla = বাংলা'],
          learnMoreBn: 'কিছু কিবোর্ডে 🌐 / Fn কী চাপলেও ভাষা বদলায় — এটি সেটিংসের ওপর নির্ভর করে।',
        },
        {
          id: 'c-win-keys',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'ক্লিকের চেয়ে দ্রুত: **Windows কী** চেপে ধরে **Space** চাপুন।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'win+space', os: 'windows', captionBn: 'ভাষা বদল' },
        },
        {
          id: 'c-mac-keys',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'ক্লিকের চেয়ে দ্রুত: **Control** চেপে ধরে **Space** চাপুন।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'ctrl+space', os: 'mac', captionBn: 'ভাষা বদল' },
        },
        {
          id: 'c-code-english',
          type: 'compare',
          textBn: 'কোড লিখবেন? **ইংরেজি কিবোর্ড** চালু রাখুন — বাংলা থাকলে প্রোগ্রাম বুঝবে না।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'big', emoji: '✅' }, labelBn: 'ইংরেজি', captionBn: 'কোডের জন্য ঠিক' },
            right: { visual: { kind: 'big', emoji: '❌' }, labelBn: 'বাংলা', captionBn: 'কোডে নয়' },
            vs: 'বনাম',
          },
          learnMoreBn: 'কোডের নির্দেশ আর চিহ্ন ইংরেজি কিবোর্ডে লিখতে হয় (Windows-এ ENG, Mac-এ ABC বা U.S.)। বাংলা লিখতে চাইলে বদলে নিন, শেষে আবার ইংরেজিতে ফিরুন। এখানকার নকল কম্পিউটারে বাংলা অক্ষর বসে না — আমরা শুধু যোগ করা আর বদলানো শিখছি।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-open-settings', osVariant: 'windows', titleBn: 'Settings খুলুন', target: 'taskbar-app-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'টাস্কবারের “Settings” আইকনে ক্লিক করুন।',
          hintBn: 'টাস্কবারে “Settings” আইকন খুঁজুন। না পেলে স্টার্ট বোতাম থেকেও খোলা যায়।',
          successMessageBn: 'Settings খুলেছে!',
        },
        {
          id: 'w-nav-time', osVariant: 'windows', titleBn: '“Time & language” বেছে নিন', target: 'settings-nav-time', expectedAction: { type: 'click', target: 'settings-nav-time' },
          explanationBn: 'বাঁ তালিকায় “Time & language”-এ ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকার নিচের দিকে “Time & language” আছে।',
        },
        {
          id: 'w-tab-language', osVariant: 'windows', titleBn: '“Language & region”', target: 'settings-time-tab-language', expectedAction: { type: 'click', target: 'settings-time-tab-language' },
          explanationBn: 'ওপরে “Language & region”-এ ক্লিক করুন।',
          hintBn: 'ওপরের দুটি লেখার মধ্যে “Language & region”।',
        },
        {
          id: 'w-add-language', osVariant: 'windows', titleBn: '“Add a language”', target: 'settings-add-language', expectedAction: { type: 'click', target: 'settings-add-language' },
          explanationBn: '“Add a language” বোতামে ক্লিক করুন।',
          hintBn: '“Preferred languages”-এর পাশের বোতামটি।',
        },
        {
          id: 'w-pick-bn', osVariant: 'windows', titleBn: '“Bangla (Bangladesh)” বেছে নিন', target: 'settings-lang-choice-bn', expectedAction: { type: 'click', target: 'settings-lang-choice-bn' },
          explanationBn: 'তালিকা থেকে “Bangla (Bangladesh)”-এ ক্লিক করুন।',
          hintBn: 'তালিকার প্রথম লাইন। না পেলে ওপরের ঘরে Bangla লিখে খুঁজুন।',
        },
        {
          id: 'w-next', osVariant: 'windows', titleBn: '“Next”', target: 'settings-lang-next', expectedAction: { type: 'click', target: 'settings-lang-next' },
          explanationBn: 'নিচের ডান কোণের “Next” বোতামে ক্লিক করুন।',
          hintBn: 'নিচের ডান দিকের নীল “Next” বোতাম।',
        },
        {
          id: 'w-install', osVariant: 'windows', titleBn: '“Install”', target: 'settings-lang-install', expectedAction: { type: 'custom', event: 'keyboard-added' },
          explanationBn: '“Install” বোতামে ক্লিক করুন। “display language” ঘরে টিক দেবেন না।',
          hintBn: 'নিচের ডান কোণের নীল “Install”। টিকের ঘরটি ফাঁকা থাকুক।',
          simplerBn: 'আমরা শুধু বাংলা লিখব, Windows-এর ভাষা বদলাব না — তাই টিক দেবেন না। ইনস্টল হতে একটু সময় লাগে।',
          successMessageBn: 'বাংলা যোগ হয়েছে!',
        },
        {
          id: 'w-tray-open', osVariant: 'windows', titleBn: 'টাস্কবারের ENG বোতাম', target: 'tray-input', expectedAction: { type: 'click', target: 'tray-input' },
          explanationBn: 'টাস্কবারের ডান কোণের নতুন ENG বোতামে ক্লিক করুন।',
          hintBn: 'ঘড়ির বাঁ দিকে, ওয়াই-ফাই চিহ্নের আগে ENG লেখা বোতাম।',
        },
        {
          id: 'w-tray-bn', osVariant: 'windows', titleBn: 'বাংলায় বদলান', target: 'tray-input-bn', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'bn' },
          explanationBn: '“Bangla (Bangladesh)” বেছে নিন — বোতাম BEN হবে।',
          hintBn: 'ছোট তালিকার দ্বিতীয় লাইন, পাশে BEN লেখা।',
          successMessageBn: 'এখন BEN চালু!',
        },
        {
          id: 'w-tray-open2', osVariant: 'windows', titleBn: 'আবার ইংরেজিতে ফেরা', target: 'tray-input', expectedAction: { type: 'click', target: 'tray-input' },
          explanationBn: 'কোডের জন্য ইংরেজিতে ফিরতে BEN বোতামে ক্লিক করুন।',
          hintBn: 'ঘড়ির বাঁ দিকের BEN লেখা বোতাম।',
        },
        {
          id: 'w-tray-en', osVariant: 'windows', titleBn: 'ENG বেছে নিন', target: 'tray-input-en', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'en' },
          explanationBn: '“English (United States)” বেছে নিন।',
          hintBn: 'তালিকার প্রথম লাইন, পাশে ENG লেখা।',
          successMessageBn: 'আবার ENG!',
        },
        // ---------- Mac ----------
        {
          id: 'm-open-settings', osVariant: 'mac', titleBn: 'System Settings খুলুন', target: 'dock-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'ডকের “System Settings” আইকনে ক্লিক করুন।',
          hintBn: 'নিচের ডকে গিয়ারের মতো আইকনটি দেখুন।',
          successMessageBn: 'Settings খুলেছে!',
        },
        {
          id: 'm-nav-keyboard', osVariant: 'mac', titleBn: '“Keyboard” বেছে নিন', target: 'settings-nav-keyboard', expectedAction: { type: 'click', target: 'settings-nav-keyboard' },
          explanationBn: 'বাঁ তালিকায় “Keyboard”-এ ক্লিক করুন।',
          hintBn: 'বাঁ তালিকার মাঝের দিকে “Keyboard” আছে।',
        },
        {
          id: 'm-edit', osVariant: 'mac', titleBn: '“Input Sources” — Edit…', target: 'settings-input-edit', expectedAction: { type: 'click', target: 'settings-input-edit' },
          explanationBn: '“Input Sources”-এর পাশের “Edit…” বোতামে ক্লিক করুন।',
          hintBn: 'ডান দিকে “Input Sources” সারির শেষের বোতাম।',
        },
        {
          id: 'm-add', osVariant: 'mac', titleBn: '+ চিহ্নে ক্লিক', target: 'settings-input-add', expectedAction: { type: 'click', target: 'settings-input-add' },
          explanationBn: 'তালিকার নিচের বাঁ দিকের + চিহ্নে ক্লিক করুন।',
          hintBn: 'তালিকার নিচে ছোট দুটি বোতামের প্রথমটি, যাতে + লেখা।',
        },
        {
          id: 'm-lang-bn', osVariant: 'mac', titleBn: '“Bangla” বেছে নিন', target: 'settings-input-lang-bn', expectedAction: { type: 'click', target: 'settings-input-lang-bn' },
          explanationBn: 'বাঁ তালিকা থেকে “Bangla”-তে ক্লিক করুন।',
          hintBn: 'বাঁ পাশের ছোট তালিকার দ্বিতীয় লাইন।',
          simplerBn: 'আসল কম্পিউটারে বাংলার একাধিক কিবোর্ড ধরন থাকতে পারে — যেকোনো একটি বেছে নিলেই চলে।',
        },
        {
          id: 'm-add-confirm', osVariant: 'mac', titleBn: '“Add”', target: 'settings-input-add-confirm', expectedAction: { type: 'custom', event: 'keyboard-added' },
          explanationBn: 'নিচের ডান কোণের “Add” বোতামে ক্লিক করুন।',
          hintBn: 'নীল রঙের “Add” বোতাম।',
          successMessageBn: 'বাংলা যোগ হয়েছে!',
        },
        {
          id: 'm-done', osVariant: 'mac', titleBn: '“Done”', target: 'settings-input-done', expectedAction: { type: 'click', target: 'settings-input-done' },
          explanationBn: '“Done” বোতামে ক্লিক করে শেষ করুন।',
          hintBn: 'বাক্সের নিচের ডান কোণে “Done”।',
        },
        {
          id: 'm-menu-open', osVariant: 'mac', titleBn: 'মেনু বারের ইনপুট মেনু', target: 'menubar-input', expectedAction: { type: 'click', target: 'menubar-input' },
          explanationBn: 'ওপরের মেনু বারের নতুন ABC মেনুতে ক্লিক করুন।',
          hintBn: 'মেনু বারের একদম ডানে, ব্যাটারি চিহ্নের বাঁ পাশে।',
        },
        {
          id: 'm-menu-bn', osVariant: 'mac', titleBn: 'বাংলায় বদলান', target: 'menubar-input-bn', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'bn' },
          explanationBn: 'তালিকা থেকে “Bangla” বেছে নিন।',
          hintBn: 'ছোট তালিকার দ্বিতীয় লাইন “Bangla”।',
          successMessageBn: 'এখন বাংলা চালু!',
        },
        {
          id: 'm-menu-open2', osVariant: 'mac', titleBn: 'আবার ইংরেজিতে ফেরা', target: 'menubar-input', expectedAction: { type: 'click', target: 'menubar-input' },
          explanationBn: 'কোডের জন্য ইংরেজিতে ফিরতে ইনপুট মেনুতে আবার ক্লিক করুন।',
          hintBn: 'মেনু বারের ডান দিকে, ব্যাটারির বাঁ পাশের ছোট চিহ্ন।',
        },
        {
          id: 'm-menu-en', osVariant: 'mac', titleBn: 'ABC বেছে নিন', target: 'menubar-input-en', expectedAction: { type: 'selectOption', target: 'setting-activeKeyboard', value: 'en' },
          explanationBn: 'তালিকা থেকে “ABC” বেছে নিন।',
          hintBn: 'তালিকার প্রথম লাইন “ABC”।',
          successMessageBn: 'আবার ABC!',
        },
      ],
      quiz: [
        {
          id: 'q-bangla-code',
          type: 'multipleChoice',
          questionBn: 'প্রোগ্রামের কোড লেখার সময় কোন কিবোর্ড চালু রাখবেন?',
          options: [
            { id: 'en', textBn: 'ইংরেজি (Windows-এ ENG, Mac-এ ABC)' },
            { id: 'bn', textBn: 'বাংলা (BEN)' },
            { id: 'any', textBn: 'যেকোনোটি, পার্থক্য নেই' },
          ],
          correct: ['en'],
          hintBn: 'প্রোগ্রামের নির্দেশ ইংরেজি অক্ষরে লেখা হয়, যেমন print।',
          explanationBn: 'কোড ইংরেজি কিবোর্ডে লিখতে হয়। বাংলা লেখা শেষে আবার ইংরেজিতে ফিরুন।',
        },
        {
          id: 'q-switch',
          type: 'multipleChoice',
          questionBn: 'কিবোর্ডের ভাষা দ্রুত বদলানোর শর্টকাট কোনটি?',
          options: [
            { id: 'a', textBn: 'Windows: Win + Space, Mac: Control + Space' },
            { id: 'b', textBn: 'Windows: Ctrl + C, Mac: ⌘ + C' },
            { id: 'c', textBn: 'দুটোতেই শুধু Esc' },
          ],
          correct: ['a'],
          hintBn: 'ভাষার শর্টকাটে Space কী লাগে।',
          explanationBn: 'Windows-এ Win + Space, Mac-এ Control + Space।',
        },
        {
          id: 'q-order-bn',
          type: 'ordering',
          questionBn: 'বাংলা কিবোর্ড যোগ করে ব্যবহারের ধাপগুলো সাজান।',
          items: [
            { id: '1', textBn: 'Settings খুলি' },
            { id: '2', textBn: 'ভাষা বা কিবোর্ডের অংশে যাই' },
            { id: '3', textBn: 'বাংলা বেছে যোগ করি' },
            { id: '4', textBn: 'বোতাম বা মেনু থেকে বাংলায় বদলাই' },
          ],
          hintBn: 'আগে যোগ করতে হবে, তারপর বদলানো।',
          explanationBn: 'Settings, ভাষার অংশ, যোগ করা, তারপর বদলানো।',
        },
      ],
      recapBn: ['Settings থেকে বাংলা যোগ', 'Win/Control + Space বদলায়', 'কোডে ইংরেজি কিবোর্ড'],
      freeTryBn: 'বাংলায় বদলে আবার ইংরেজিতে ফিরে আসুন।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন',
    tasksBn: [
      'Notepad বা TextEdit-এ নিজের নাম লিখুন, কপি-পেস্ট করুন, তারপর আনডু করুন।',
      'কিবোর্ড শর্টকাটের চিট শিট ছাপিয়ে পাশে রাখুন। রোজ একটা নতুন শর্টকাট চালান।',
      'আসল কিবোর্ডে { } ( ) " খুঁজে লিখুন। কোনটা অন্য জায়গায় থাকলে লিখে রাখুন।',
    ],
    windowsTasksBn: ['Settings → Time & language → Language & region খুলে বাংলা যোগ করুন, তারপর টাস্কবারের ENG/BEN-এ বদলান।'],
    macTasksBn: ['System Settings → Keyboard → Input Sources → Edit… থেকে বাংলা যোগ করুন, তারপর Control + Space-এ বদলান।'],
  },

  teacherTipBn:
    'কিবোর্ডে আঙুলের ঠিক জায়গা (F ও J-এর উঁচু দাগে তর্জনী) একবার পাশে বসে দেখিয়ে দিন, তারপর তাড়া দেবেন না — গতির চেয়ে নির্ভুলতা জরুরি। শর্টকাট মুখস্থ করাবেন না; আসল কাজের মধ্যে একটি-দুটি করে ব্যবহার করালেই হাত শিখে যাবে। ওঁর আসল কিবোর্ডে \\ | # @ " ইত্যাদির জায়গা আলাদা কিনা একসাথে মিলিয়ে নিন। বাংলা লেখার জন্য আলাদা ফোনেটিক (উচ্চারণ-ভিত্তিক) কিবোর্ড লাগতে পারে — সেটি পরে আলাদাভাবে দেখলেই চলবে; এই পাঠের উদ্দেশ্য শুধু কিবোর্ড যোগ করা ও ENG/BEN বদলানো শেখা।',
}

export default lesson
