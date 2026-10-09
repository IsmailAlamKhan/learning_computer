import type { Lesson, SimSetup } from '../../engine/types'

/**
 * Module 12 — সমস্যায় পড়লে কী করবেন (cards format). Four units:
 * (1) frozen program → Task Manager / Force Quit, (2) deleted by mistake → Recycle Bin / Trash, undo,
 * (3) no internet / no sound, (4) describe a problem: copy the exact error, search it, read the results.
 * Every unit starts a fresh simulation, so each has its own `setup`.
 */

/** Important.txt is already in the Recycle Bin / Trash — the “deleted by mistake” scenario. */
const deletedFileSetup: SimSetup['vfs'] = (vfs) => {
  const docs = vfs.child(vfs.home, 'Documents')
  if (!docs) return
  const f = vfs.createFile(docs, 'Important.txt', 'Remember to pay the electricity bill on Sunday.')
  vfs.delete(f)
}

const lesson: Lesson = {
  module: 12,
  part: 1,
  id: 'm12',
  titleBn: 'সমস্যায় পড়লে কী করবেন',
  oneLineBn: 'প্রোগ্রাম আটকালে, ফাইল মুছলে, ইন্টারনেট বা আওয়াজ না থাকলে — শান্ত থেকে সমাধান আর এরর খুঁজে উত্তর পাওয়া।',
  minutes: 8,
  glossaryIds: ['freeze', 'task-manager', 'force-quit', 'end-task', 'process', 'restart', 'undo-mistake', 'restore-deleted', 'recycle-bin', 'error-message', 'search-error', 'forum', 'official-docs', 'screenshot-help'],

  units: [
    // =====================================================================================================
    // 1. frozen program
    // =====================================================================================================
    {
      id: 'frozen',
      titleBn: 'আটকে যাওয়া প্রোগ্রাম',
      setup: { openApps: ['stuckapp'] },
      hook: {
        id: 'h-frozen',
        type: 'hook',
        textBn: 'ফেসবুক খুলে আছেন, কিছুতেই সাড়া নেই? সবারই হয় — **ঘাবড়াবেন না**।',
        visual: { kind: 'art', name: 'freeze', captionBn: 'আটকে গেছে!' },
      },
      cards: [
        {
          id: 'c-freeze',
          type: 'visual',
          textBn: 'ক্লিক করলেও কিছু হয় না — একে বলে **ফ্রিজ**। আগে আধ মিনিট অপেক্ষা করুন; অনেক সময় শুধু ধীর।',
          visual: { kind: 'art', name: 'freeze', captionBn: 'ফ্রিজ' },
          chipsBn: ['আধ মিনিট অপেক্ষা', 'বারবার ক্লিক নয়'],
          learnMoreBn: 'Windows-এ উইন্ডোর নামের পাশে “(Not Responding)” লেখা আসে; Mac-এ ঘুরতে থাকা রঙিন চাকা দেখা যায়। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।',
        },
        {
          id: 'c-order',
          type: 'visual',
          textBn: 'ক্রম মনে রাখুন: আগে **হালকা** উপায়, না হলে একটু বড় উপায়।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'clock', labelBn: 'অপেক্ষা' },
              { art: 'save-disk', labelBn: 'সেভ' },
              { art: 'cross', labelBn: 'প্রোগ্রাম বন্ধ' },
              { art: 'refresh', labelBn: 'রিস্টার্ট' },
            ],
          },
          learnMoreBn: 'তাতেও না হলে এরর খুঁজুন বা কারও সাহায্য নিন। রিস্টার্ট মানে কম্পিউটার বন্ধ করে নিজে আবার চালু করা — Windows-এ Start → Power → Restart, Mac-এ আপেল মেনু → Restart…। আগে খোলা কাজ সেভ করে নিন।',
        },
        {
          id: 'c-tm',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'অপেক্ষার পরেও আটকে থাকলে **Ctrl + Shift + Esc** চাপুন। Task Manager খুলবে — সেখান থেকে End task।',
          visual: { kind: 'mock', name: 'task-manager', os: 'windows', highlight: 'end-task' },
          chipsBn: ['Ctrl+Shift+Esc'],
          learnMoreBn: 'Task Manager-এ চলমান প্রতিটি প্রোগ্রাম (প্রসেস) আর তার CPU ও মেমোরির ব্যবহার দেখা যায়। অচেনা প্রসেস না বুঝে বন্ধ করবেন না।',
        },
        {
          id: 'c-fq',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'অপেক্ষার পরেও আটকে থাকলে **Option + Command + Esc** চাপুন। Force Quit খুলবে — প্রোগ্রাম বেছে বন্ধ করুন।',
          visual: { kind: 'mock', name: 'force-quit', os: 'mac', highlight: 'force-quit-button' },
          chipsBn: ['Option+Command+Esc'],
          learnMoreBn: 'আপেল-চিহ্নের মেনু (ওপরের বাঁ কোণ) → Force Quit… বেছেও এই উইন্ডো খোলা যায়। চলমান প্রোগ্রামগুলোর তালিকা এখানে দেখা যায়।',
        },
        {
          id: 'c-warn',
          type: 'visual',
          textBn: 'জোর করে বন্ধ করলে **সেভ না করা** কাজ হারাতে পারে। তাই আগে অপেক্ষা, আর কাজের ফাঁকে সেভ।',
          visual: { kind: 'art', name: 'warning', captionBn: 'সেভ না করলে হারায়' },
          learnMoreBn: 'আসল কম্পিউটারে ব্রাউজারের ভেতর থেকে এই শর্টকাট কখনো কখনো কাজ করে না; তাই এখানে “শর্টকাট প্যাড” আছে — তাতে কী-গুলো একে একে ক্লিক করবেন।',
        },
      ],
      steps: [
        {
          id: 'w-album-click', osVariant: 'windows', titleBn: 'আটকানো প্রোগ্রাম চালান', target: 'stuckapp-album', expectedAction: { type: 'click', target: 'stuckapp-album' },
          explanationBn: 'Photo Album-এর বেগুনি বোতামে ক্লিক করুন।',
          hintBn: 'উইন্ডোর ভেতরের বেগুনি বোতাম।',
        },
        {
          id: 'w-ignored', osVariant: 'windows', titleBn: 'আবার ক্লিক করে দেখুন', target: 'stuckapp-content', expectedAction: { type: 'custom', event: 'stuckapp-ignored' },
          explanationBn: 'নামের পাশে “(Not Responding)” এসেছে। উইন্ডোর সাদা অংশে ক্লিক করুন।',
          hintBn: 'সাদা অংশে ক্লিক করুন। কিছুই হবে না — ঠিক এটাই দেখার।',
          successMessageBn: 'সাড়া নেই — এটাই ফ্রিজ!',
        },
        {
          id: 'w-taskmgr', osVariant: 'windows', titleBn: 'Task Manager খুলুন', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'ctrl+shift+esc' },
          explanationBn: 'শর্টকাট প্যাডে Ctrl, Shift, তারপর Esc ক্লিক করুন।',
          hintBn: 'প্যাডে আগে “Ctrl” আর “Shift”, তারপর নিচের “Esc”।',
          simplerBn: 'প্রথমে “Ctrl” বোতামে ক্লিক, তারপর “Shift”, শেষে “Esc”। আসল কম্পিউটারে তিনটি কী একসাথে চাপতে হয়।',
          teacherTipBn: 'আসল কম্পিউটারে এটি সবচেয়ে ভরসার শর্টকাট, কারণ প্রোগ্রাম আটকালেও Task Manager খোলা যায়। কয়েকবার অভ্যাস করান।',
        },
        {
          id: 'w-tm-select', osVariant: 'windows', titleBn: 'আটকানো প্রোগ্রাম বাছুন', target: 'taskmgr-row-stuckapp', expectedAction: { type: 'click', target: 'taskmgr-row-stuckapp' },
          explanationBn: 'লাল “Not responding” লেখা Photo Album লাইনে ক্লিক করুন।',
          hintBn: 'Apps অংশের নিচে “Photo Album” লাইন।',
        },
        {
          id: 'w-tm-end', osVariant: 'windows', titleBn: 'End task চাপুন', target: 'taskmgr-end-task', expectedAction: { type: 'closeApp', app: 'stuckapp' },
          explanationBn: 'ওপরের ডানের “End task” বোতামে ক্লিক করুন।',
          hintBn: 'Task Manager-এর ডান ওপরের নীল বোতাম।',
          successMessageBn: 'প্রোগ্রাম বন্ধ হয়েছে!',
        },
        {
          id: 'w-tm-close', osVariant: 'windows', titleBn: 'Task Manager বন্ধ করুন', target: 'win-taskmgr-close', expectedAction: { type: 'closeApp', app: 'taskmgr' },
          explanationBn: 'ডান ওপরের ✕ চেপে Task Manager বন্ধ করুন।',
          hintBn: 'Task Manager উইন্ডোর ডান ওপরের ✕।',
        },
        {
          id: 'm-album-click', osVariant: 'mac', titleBn: 'আটকানো প্রোগ্রাম চালান', target: 'stuckapp-album', expectedAction: { type: 'click', target: 'stuckapp-album' },
          explanationBn: 'Photo Album-এর বেগুনি বোতামে ক্লিক করুন।',
          hintBn: 'উইন্ডোর ভেতরের বেগুনি বোতাম।',
        },
        {
          id: 'm-ignored', osVariant: 'mac', titleBn: 'আবার ক্লিক করে দেখুন', target: 'stuckapp-content', expectedAction: { type: 'custom', event: 'stuckapp-ignored' },
          explanationBn: 'রঙিন চাকা ঘুরছে। উইন্ডোর সাদা অংশে ক্লিক করুন।',
          hintBn: 'সাদা অংশে ক্লিক করুন। কিছুই হবে না — ঠিক এটাই দেখার।',
          successMessageBn: 'সাড়া নেই — এটাই ফ্রিজ!',
        },
        {
          id: 'm-forcequit', osVariant: 'mac', titleBn: 'Force Quit খুলুন', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'alt+cmd+esc' },
          explanationBn: 'শর্টকাট প্যাডে Option, Command, তারপর Esc ক্লিক করুন।',
          hintBn: 'প্যাডে আগে “Option” আর “Command”, তারপর নিচের “Esc”।',
          simplerBn: 'প্রথমে “⌥ Option” বোতামে ক্লিক, তারপর “⌘ Command”, শেষে “Esc”। আসল Mac-এ আপেল মেনু → Force Quit…-ও আছে।',
          teacherTipBn: 'সিমুলেশনের সিস্টেম মেনুতেও (বাঁ ওপরের গোল চিহ্ন) “Force Quit…” আছে — সেটিও একবার দেখিয়ে দিতে পারেন।',
        },
        {
          id: 'm-fq-select', osVariant: 'mac', titleBn: 'আটকানো প্রোগ্রাম বাছুন', target: 'forcequit-row-stuckapp', expectedAction: { type: 'click', target: 'forcequit-row-stuckapp' },
          explanationBn: 'লাল “not responding” লেখা Photo Album লাইনে ক্লিক করুন।',
          hintBn: 'তালিকার “Photo Album” লাইন।',
        },
        {
          id: 'm-fq-button', osVariant: 'mac', titleBn: 'Force Quit বোতাম চাপুন', target: 'forcequit-button', expectedAction: { type: 'click', target: 'forcequit-button' },
          explanationBn: 'নিচের ডানের নীল “Force Quit” বোতামে ক্লিক করুন।',
          hintBn: 'উইন্ডোর নিচের ডান কোণের নীল বোতাম।',
        },
        {
          id: 'm-fq-confirm', osVariant: 'mac', titleBn: 'নিশ্চিত করুন', target: 'forcequit-confirm', expectedAction: { type: 'closeApp', app: 'stuckapp' },
          explanationBn: 'প্রশ্নের বাক্সে নীল “Force Quit” চাপুন।',
          hintBn: 'ছোট বাক্সের নীল “Force Quit” বোতাম।',
          successMessageBn: 'প্রোগ্রাম বন্ধ হয়েছে!',
        },
        {
          id: 'm-fq-close', osVariant: 'mac', titleBn: 'Force Quit উইন্ডো বন্ধ করুন', target: 'win-forcequit-close', expectedAction: { type: 'closeApp', app: 'forcequit' },
          explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করে উইন্ডোটি বন্ধ করুন।',
          hintBn: 'উইন্ডোর বাঁ ওপরের লাল গোল বোতাম।',
        },
      ],
      quiz: [
        {
          id: 'q-order', type: 'ordering', questionBn: 'প্রোগ্রাম আটকে গেলে কোন ক্রমে কী করবেন? সাজান।',
          items: [
            { id: '1', textBn: 'আধ মিনিট অপেক্ষা' },
            { id: '2', textBn: 'অন্য কাজ সেভ করা' },
            { id: '3', textBn: 'প্রোগ্রাম বন্ধ (End task / Force Quit)' },
            { id: '4', textBn: 'রিস্টার্ট' },
          ],
          hintBn: 'আগে ধৈর্য, তারপর কাজ বাঁচানো, তারপর হালকা উপায়, শেষে রিস্টার্ট।',
          explanationBn: 'ঠিক! হালকা উপায় আগে, বড় উপায় পরে।',
        },
        {
          id: 'q-first', type: 'multipleChoice', questionBn: 'প্রোগ্রাম ক্লিকে সাড়া দিচ্ছে না। সবার আগে কী করবেন?',
          options: [
            { id: 'a', textBn: 'আধ মিনিট অপেক্ষা করব' },
            { id: 'b', textBn: 'পাগলের মতো বারবার ক্লিক করব' },
            { id: 'c', textBn: 'কম্পিউটারের প্লাগ খুলে দেব' },
          ],
          correct: ['a'],
          hintBn: 'অনেক সময় প্রোগ্রাম আটকায়নি, শুধু ধীর।',
          explanationBn: 'অপেক্ষাই সবচেয়ে নিরাপদ প্রথম ধাপ।',
        },
        {
          id: 'q-risk', type: 'multipleChoice', questionBn: 'জোর করে বন্ধ করলে কোন ঝুঁকি আছে?',
          options: [
            { id: 'a', textBn: 'সেভ না করা কাজ হারাতে পারে' },
            { id: 'b', textBn: 'কম্পিউটার নষ্ট হয়ে যায়' },
            { id: 'c', textBn: 'কোনো ঝুঁকি নেই' },
          ],
          correct: ['a'],
          hintBn: 'প্রোগ্রাম হঠাৎ বন্ধ হলে খোলা লেখার কী হবে?',
          explanationBn: 'ঠিক! তাই আগে অপেক্ষা আর নিয়মিত সেভ করুন।',
        },
      ],
      recapBn: ['আগে আধ মিনিট অপেক্ষা', 'Windows: Task Manager, Mac: Force Quit', 'সেভ না করা কাজ হারাতে পারে'],
      freeTryBn: 'পারেন? আবার শুরু করে Task Manager বা Force Quit চালান।',
    },

    // =====================================================================================================
    // 2. deleted by mistake
    // =====================================================================================================
    {
      id: 'deleted',
      titleBn: 'ভুলে মুছে ফেলা',
      setup: { vfs: deletedFileSetup },
      hook: {
        id: 'h-deleted',
        type: 'hook',
        textBn: 'ভুল করে জরুরি ফাইল মুছে ফেললেন? শান্ত হোন — **ঝুড়িতে** আছে!',
        visual: { kind: 'art', name: 'trash', captionBn: 'এখনও হারায়নি' },
      },
      cards: [
        {
          id: 'c-bin-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'মোছা ফাইল সাথে সাথে হারায় না — **রিসাইকেল বিনে** জমা থাকে।',
          visual: { kind: 'mock', name: 'win-desktop', os: 'windows', highlight: 'recycle-bin' },
          chipsBn: ['ডেস্কটপের ঝুড়ি'],
        },
        {
          id: 'c-bin-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'মোছা ফাইল সাথে সাথে হারায় না — **ট্র্যাশে** জমা থাকে।',
          visual: { kind: 'mock', name: 'mac-desktop', os: 'mac', highlight: 'trash' },
          chipsBn: ['ডকের ঝুড়ি'],
        },
        {
          id: 'c-restore',
          type: 'visual',
          textBn: 'ফাইল বেছে **Restore** (Mac-এ Put Back) চাপুন। ফাইল আগের জায়গায় ফিরে যাবে।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'trash', labelBn: 'ঝুড়ি খুলুন' },
              { art: 'hand-click', labelBn: 'ফাইল বাছুন' },
              { art: 'folder', labelBn: 'আগের জায়গা' },
            ],
          },
        },
        {
          id: 'c-undo',
          type: 'visual',
          textBn: 'লেখায় ভুল হলে **আনডু** করুন: Ctrl + Z (Mac-এ Command + Z)। সদ্য করা কাজ ফিরে আসে।',
          visual: { kind: 'art', name: 'undo', captionBn: 'এক ধাপ পিছনে' },
          chipsBn: ['Ctrl/Cmd+Z'],
          learnMoreBn: 'কয়েকবার চাপলে আরও আগের অবস্থায় যাওয়া যায়।',
        },
        {
          id: 'c-empty',
          type: 'visual',
          textBn: 'বিন বা ট্র্যাশ **খালি** করলে ফাইল আর ফেরে না। খালি করার আগে একটু ভাবুন।',
          visual: { kind: 'art', name: 'warning', captionBn: 'খালি করলে শেষ' },
        },
      ],
      steps: [
        {
          id: 'w-open-bin', osVariant: 'windows', titleBn: 'রিসাইকেল বিন খুলুন', target: 'icon-Recycle Bin', expectedAction: { type: 'openApp', app: 'bin' },
          explanationBn: 'ডেস্কটপের Recycle Bin আইকনে ডাবল ক্লিক করুন।',
          hintBn: 'বাঁ দিকে ঝুড়ির মতো আইকন; পরপর দুবার তাড়াতাড়ি ক্লিক।',
          simplerBn: 'আইকনে একবার ক্লিক করে বেছে নিন, তারপর আবার তাড়াতাড়ি দুবার ক্লিক করুন।',
        },
        {
          id: 'w-bin-select', osVariant: 'windows', titleBn: 'ফাইলটি বাছুন', target: 'fm-item-Important.txt', expectedAction: { type: 'click', target: 'fm-item-Important.txt' },
          explanationBn: 'Important.txt ফাইলে একবার ক্লিক করুন।',
          hintBn: 'নতুন উইন্ডোর তালিকায় Important লেখা ফাইল।',
        },
        {
          id: 'w-restore', osVariant: 'windows', titleBn: 'Restore চাপুন', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Important.txt' },
          explanationBn: 'ওপরের “Restore the selected items” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারির “Restore the selected items” বোতাম।',
          successMessageBn: 'ফাইল ফিরে এসেছে!',
        },
        {
          id: 'w-bin-close', osVariant: 'windows', titleBn: 'রিসাইকেল বিন বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
          explanationBn: 'ডান ওপরের ✕ চেপে রিসাইকেল বিন বন্ধ করুন।',
          hintBn: 'উইন্ডোর ডান ওপরের ✕।',
        },
        {
          id: 'm-open-trash', osVariant: 'mac', titleBn: 'ট্র্যাশ খুলুন', target: 'dock-trash', expectedAction: { type: 'openApp', app: 'bin' },
          explanationBn: 'ডকের একদম ডানের Trash আইকনে ক্লিক করুন।',
          hintBn: 'ডকের ডান প্রান্তে ঝুড়ির মতো আইকন।',
        },
        {
          id: 'm-trash-select', osVariant: 'mac', titleBn: 'ফাইলটি বাছুন', target: 'fm-item-Important.txt', expectedAction: { type: 'click', target: 'fm-item-Important.txt' },
          explanationBn: 'Important.txt ফাইলে একবার ক্লিক করুন।',
          hintBn: 'নতুন উইন্ডোর তালিকায় Important লেখা ফাইল।',
        },
        {
          id: 'm-restore', osVariant: 'mac', titleBn: 'Put Back চাপুন', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Important.txt' },
          explanationBn: 'ওপরের “Put Back” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারির “Put Back” বোতাম।',
          successMessageBn: 'ফাইল ফিরে এসেছে!',
        },
        {
          id: 'm-trash-close', osVariant: 'mac', titleBn: 'ট্র্যাশ বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
          explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করে ট্র্যাশ বন্ধ করুন।',
          hintBn: 'উইন্ডোর বাঁ ওপরের লাল বোতাম।',
        },
      ],
      quiz: [
        {
          id: 'q-undo', type: 'multipleChoice', questionBn: 'লেখায় ভুল করে ফেলেছেন। সদ্য করা কাজ ফেরাতে কোনটি চাপবেন?',
          options: [
            { id: 'a', textBn: 'Ctrl + Z (Windows) বা Command + Z (Mac)' },
            { id: 'b', textBn: 'Ctrl + Shift + Esc' },
            { id: 'c', textBn: 'কম্পিউটার বন্ধ করে দেব' },
          ],
          correct: ['a'],
          hintBn: 'Z মনে রাখুন — Z মানে এক ধাপ পিছনে।',
          explanationBn: 'ঠিক! Z চাপলে সদ্য কাজ ফিরে আসে।',
        },
        {
          id: 'q-where', type: 'clickTarget', questionBn: 'ভুল করে ফাইল মুছেছেন। কোথায় আগে খুঁজবেন?',
          items: [
            { id: 'bin', labelBn: 'রিসাইকেল বিন / ট্র্যাশ', icon: '🗑️' },
            { id: 'wifi', labelBn: 'Wi-Fi সেটিংস', icon: '📶' },
            { id: 'sound', labelBn: 'আওয়াজের বোতাম', icon: '🔊' },
            { id: 'print', labelBn: 'প্রিন্টারের তালিকা', icon: '🖨️' },
          ],
          correct: 'bin',
          hintBn: 'মোছা ফাইল জমা থাকে ঝুড়িতে।',
          explanationBn: 'ঠিক! মোছা ফাইল প্রথমে ঝুড়িতেই যায়।',
        },
        {
          id: 'q-empty', type: 'multipleChoice', questionBn: 'রিসাইকেল বিন বা ট্র্যাশ খালি করলে ফাইলের কী হয়?',
          options: [
            { id: 'a', textBn: 'আর সহজে ফেরানো যায় না' },
            { id: 'b', textBn: 'ফাইল ডেস্কটপে ফিরে আসে' },
            { id: 'c', textBn: 'কিছুই বদলায় না' },
          ],
          correct: ['a'],
          hintBn: 'খালি করা মানে ঝুড়ি পরিষ্কার করে ফেলা।',
          explanationBn: 'ঠিক! তাই খালি করার আগে ভাবুন।',
        },
      ],
      recapBn: ['মোছা ফাইল ঝুড়িতে থাকে', 'Restore (Mac: Put Back) চাপুন', 'ভুল লেখা: Ctrl/Cmd + Z'],
    },

    // =====================================================================================================
    // 3. no internet / no sound
    // =====================================================================================================
    {
      id: 'net-sound',
      titleBn: 'ইন্টারনেট বা আওয়াজ নেই',
      setup: { settings: { wifiOn: false, muted: true } },
      hook: {
        id: 'h-net',
        type: 'hook',
        textBn: 'ইউটিউব খুললেন, ভিডিও চলে না আর আওয়াজও নেই — **আগে কী দেখবেন**?',
        visual: {
          kind: 'compare',
          left: { visual: { kind: 'art', name: 'wifi' }, labelBn: 'ইন্টারনেট', captionBn: 'Wi-Fi চালু তো?' },
          right: { visual: { kind: 'art', name: 'volume' }, labelBn: 'আওয়াজ', captionBn: 'মিউট নয় তো?' },
          vs: 'আর',
        },
      },
      cards: [
        {
          id: 'c-nonet',
          type: 'visual',
          textBn: 'ইন্টারনেট না থাকলে ব্রাউজার “No internet” দেখায়। আগে **Wi-Fi** চালু আছে কি না দেখুন।',
          visual: { kind: 'art', name: 'wifi', captionBn: 'Wi-Fi বন্ধ?' },
          chipsBn: ['আগে Wi-Fi দেখুন'],
        },
        {
          id: 'c-wifi-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'ঘড়ির পাশের আইকনে ক্লিক করলে Wi-Fi আর **আওয়াজের** বোতাম আসে।',
          visual: { kind: 'mock', name: 'win-taskbar', os: 'windows', highlight: 'tray' },
          learnMoreBn: 'Wi-Fi আইকনে ক্রস চিহ্ন থাকলে বুঝবেন সেটি বন্ধ। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।',
        },
        {
          id: 'c-wifi-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'ওপরের ডানে **কন্ট্রোল সেন্টারে** Wi-Fi-র বোতাম আছে। মেনু বারের স্পিকার আইকনে আওয়াজ।',
          visual: { kind: 'mock', name: 'mac-menubar', os: 'mac', highlight: 'status' },
          learnMoreBn: 'Wi-Fi আইকনে কাটা চিহ্ন থাকলে বুঝবেন সেটি বন্ধ। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।',
        },
        {
          id: 'c-sound',
          type: 'visual',
          textBn: 'আওয়াজ না এলে দেখুন **মিউট** করা আছে কি না, বা ভলিউম কম কি না।',
          visual: { kind: 'art', name: 'volume', captionBn: 'মিউট বা কম ভলিউম' },
          chipsBn: ['মিউট দেখুন', 'ভলিউম বাড়ান'],
          learnMoreBn: 'স্পিকারের তার বা হেডফোন ঠিকমতো লাগানো আছে কি না, তা-ও একবার দেখে নিন।',
        },
      ],
      steps: [
        {
          id: 'w-open-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'taskbar-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'টাস্কবারের ব্রাউজার আইকনে ক্লিক করুন।',
          hintBn: 'টাস্কবারে গোল পৃথিবীর মতো আইকন।',
        },
        {
          id: 'w-type-address', osVariant: 'windows', titleBn: 'ঠিকানা লিখুন', target: 'browser-address', expectedAction: { type: 'type', target: 'browser-address', text: 'search.example', ignoreCase: true },
          explanationBn: 'ঠিকানার ঘরে লিখুন: search.example',
          hintBn: 'ওপরের লম্বা ঘরে ক্লিক করে টাইপ করুন।',
        },
        {
          id: 'w-go', osVariant: 'windows', titleBn: 'Enter চাপুন', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://search.example/' },
          explanationBn: 'Enter চাপুন। “No internet” এলে বার্তাটি পড়ুন।',
          hintBn: 'ঘরে লেখা থাকা অবস্থায় Enter চাপুন।',
          successMessageBn: 'পাতা খুলল না — Wi-Fi বন্ধ!',
        },
        {
          id: 'w-open-qs', osVariant: 'windows', titleBn: 'দ্রুত সেটিংস খুলুন', target: 'tray-wifi', expectedAction: { type: 'click', target: 'tray-wifi' },
          explanationBn: 'ঘড়ির পাশের Wi-Fi আইকনে ক্লিক করুন।',
          hintBn: 'ঘড়ির বাঁ পাশের ছোট আইকনের সারি।',
          simplerBn: 'টাস্কবারের একদম ডানে ঘড়ি; তার ঠিক বাঁ পাশে Wi-Fi, আওয়াজ আর ব্যাটারির আইকন।',
        },
        {
          id: 'w-wifi-on', osVariant: 'windows', titleBn: 'Wi-Fi চালু করুন', target: 'qs-wifi', expectedAction: { type: 'selectOption', target: 'setting-wifiOn', value: 'true' },
          explanationBn: 'Wi-Fi বোতামে ক্লিক করে নীল করুন।',
          hintBn: 'প্যানেলের ওপরের সারির প্রথম বোতাম।',
        },
        {
          id: 'w-reload', osVariant: 'windows', titleBn: 'পাতাটি আবার লোড করুন', target: 'browser-reload', expectedAction: { type: 'click', target: 'browser-reload' },
          explanationBn: 'ব্রাউজারের ঘূর্ণি-তীর (Reload) বোতামে ক্লিক করুন।',
          hintBn: 'ঠিকানার ঘরের বাঁ পাশে গোল তীর।',
          successMessageBn: 'ইন্টারনেট ফিরেছে!',
        },
        {
          id: 'w-open-qs2', osVariant: 'windows', titleBn: 'আওয়াজের আইকন খুলুন', target: 'tray-volume', expectedAction: { type: 'click', target: 'tray-volume' },
          explanationBn: 'ঘড়ির পাশের স্পিকার আইকনে ক্লিক করুন।',
          hintBn: 'ক্রস চিহ্নওয়ালা স্পিকার আইকন।',
        },
        {
          id: 'w-unmute', osVariant: 'windows', titleBn: 'মিউট বন্ধ করুন', target: 'qs-mute', expectedAction: { type: 'selectOption', target: 'setting-muted', value: 'false' },
          explanationBn: 'মিউট বোতামে ক্লিক করে আওয়াজ চালু করুন।',
          hintBn: 'প্যানেলের স্পিকারের মতো বোতাম।',
          successMessageBn: 'আওয়াজ ফিরেছে!',
        },
        {
          id: 'm-open-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'ডকের ব্রাউজার আইকনে ক্লিক করুন।',
          hintBn: 'ডকে গোল পৃথিবীর মতো আইকন।',
        },
        {
          id: 'm-type-address', osVariant: 'mac', titleBn: 'ঠিকানা লিখুন', target: 'browser-address', expectedAction: { type: 'type', target: 'browser-address', text: 'search.example', ignoreCase: true },
          explanationBn: 'ঠিকানার ঘরে লিখুন: search.example',
          hintBn: 'ওপরের লম্বা ঘরে ক্লিক করে টাইপ করুন।',
        },
        {
          id: 'm-go', osVariant: 'mac', titleBn: 'Return চাপুন', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://search.example/' },
          explanationBn: 'Return চাপুন। “No internet” এলে বার্তাটি পড়ুন।',
          hintBn: 'ঘরে লেখা থাকা অবস্থায় Return চাপুন।',
          successMessageBn: 'পাতা খুলল না — Wi-Fi বন্ধ!',
        },
        {
          id: 'm-open-cc', osVariant: 'mac', titleBn: 'কন্ট্রোল সেন্টার খুলুন', target: 'control-center', expectedAction: { type: 'click', target: 'control-center' },
          explanationBn: 'মেনু বারের ডানে কন্ট্রোল সেন্টারে ক্লিক করুন।',
          hintBn: 'ঘড়ির একটু বাঁ পাশে দুটি স্লাইডারের মতো আইকন।',
          simplerBn: 'পর্দার সবচেয়ে ওপরের সারিতে ডানে ঘড়ি; তার বাঁ পাশে দুটি লাইন আর দুটি বিন্দুওয়ালা আইকন।',
        },
        {
          id: 'm-wifi-on', osVariant: 'mac', titleBn: 'Wi-Fi চালু করুন', target: 'cc-wifi', expectedAction: { type: 'selectOption', target: 'setting-wifiOn', value: 'true' },
          explanationBn: '“Wi-Fi: Off” বোতামে ক্লিক করে নীল করুন।',
          hintBn: 'প্যানেলের ওপরের সারির প্রথম বোতাম।',
        },
        {
          id: 'm-reload', osVariant: 'mac', titleBn: 'পাতাটি আবার লোড করুন', target: 'browser-reload', expectedAction: { type: 'click', target: 'browser-reload' },
          explanationBn: 'ব্রাউজারের ঘূর্ণি-তীর (Reload) বোতামে ক্লিক করুন।',
          hintBn: 'ঠিকানার ঘরের বাঁ পাশে গোল তীর।',
          successMessageBn: 'ইন্টারনেট ফিরেছে!',
        },
        {
          id: 'm-open-cc2', osVariant: 'mac', titleBn: 'আওয়াজের আইকন খুলুন', target: 'menubar-volume', expectedAction: { type: 'click', target: 'menubar-volume' },
          explanationBn: 'মেনু বারের স্পিকার আইকনে ক্লিক করুন।',
          hintBn: 'মেনু বারের ডানে কাটা চিহ্নওয়ালা স্পিকার।',
        },
        {
          id: 'm-unmute', osVariant: 'mac', titleBn: 'আওয়াজ বাড়ান', target: 'cc-volume', expectedAction: { type: 'selectOption', target: 'setting-muted', value: 'false' },
          explanationBn: 'Sound স্লাইডারের হাতল ডান দিকে টানুন।',
          hintBn: 'গোল হাতল ধরে ডানে সরান।',
          simplerBn: 'স্লাইডারের মাঝামাঝি কোথাও একবার ক্লিক করলেও চলবে।',
          successMessageBn: 'আওয়াজ ফিরেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-match', type: 'dragMatch', questionBn: 'সমস্যার সাথে প্রথমে কী চেষ্টা করবেন, মেলান।',
          pairs: [
            { id: 'frozen', leftBn: 'প্রোগ্রাম আটকে গেছে', rightBn: 'Task Manager / Force Quit' },
            { id: 'net', leftBn: 'ইন্টারনেট নেই', rightBn: 'Wi-Fi চালু আছে কি না' },
            { id: 'sound', leftBn: 'আওয়াজ আসছে না', rightBn: 'মিউট বা ভলিউম' },
            { id: 'deleted', leftBn: 'ফাইল মুছে গেছে', rightBn: 'রিসাইকেল বিন / ট্র্যাশ' },
          ],
          hintBn: 'প্রতিটি সমস্যার সবচেয়ে সহজ সমাধান ভাবুন।',
          explanationBn: 'সবগুলো মিলেছে! আগে সহজ উপায় চেষ্টা করুন।',
        },
        {
          id: 'q-net', type: 'multipleChoice', questionBn: 'ব্রাউজারে “No internet” এসেছে। প্রথমে কী দেখবেন?',
          options: [
            { id: 'a', textBn: 'Wi-Fi চালু আছে কি না' },
            { id: 'b', textBn: 'ডেস্কটপের ছবি' },
            { id: 'c', textBn: 'কিবোর্ডের আলো' },
          ],
          correct: ['a'],
          hintBn: 'ইন্টারনেট আসে Wi-Fi দিয়ে।',
          explanationBn: 'ঠিক! Wi-Fi বন্ধ থাকলেই সবচেয়ে বেশি এই সমস্যা হয়।',
        },
        {
          id: 'q-sound', type: 'multipleChoice', questionBn: 'ভিডিও চলছে কিন্তু আওয়াজ নেই। প্রথমে কী দেখবেন?',
          options: [
            { id: 'a', textBn: 'মিউট করা আছে কি না' },
            { id: 'b', textBn: 'ফাইল মুছে গেছে কি না' },
            { id: 'c', textBn: 'কম্পিউটার নতুন কি না' },
          ],
          correct: ['a'],
          hintBn: 'ক্রস চিহ্নওয়ালা স্পিকার আইকনটি মনে করুন।',
          explanationBn: 'ঠিক! মিউট আর কম ভলিউমই সাধারণ কারণ।',
        },
      ],
      recapBn: ['ইন্টারনেট নেই: আগে Wi-Fi দেখুন', 'আওয়াজ নেই: মিউট ও ভলিউম দেখুন'],
    },

    // =====================================================================================================
    // 4. describe the problem, search the error
    // =====================================================================================================
    {
      id: 'search-error',
      titleBn: 'এরর খুঁজে সমাধান',
      setup: { openApps: ['browser'], settings: { wifiOn: true, muted: false } },
      hook: {
        id: 'h-error',
        type: 'hook',
        textBn: 'ডাক্তারকে শুধু “শরীর খারাপ” বললে চলে? এররেও **হুবহু** বলতে হয়।',
        visual: { kind: 'art', name: 'bug', captionBn: 'এরর = সূত্র' },
      },
      cards: [
        {
          id: 'c-copy',
          type: 'visual',
          textBn: 'এরর এলে **OK** চাপার আগে মেসেজটি পড়ুন, আর হুবহু কপি করে রাখুন।',
          visual: { kind: 'art', name: 'copy', captionBn: 'হুবহু কপি' },
          chipsBn: ['Ctrl/Cmd+C'],
          learnMoreBn: 'মেসেজে অনেক সময় সমস্যার নাম বা একটি কোড থাকে (যেমন PA-1042)। সেটাই খোঁজার আসল সূত্র।',
        },
        {
          id: 'c-search',
          type: 'visual',
          textBn: 'কপি করুন, পেস্ট করুন, খুঁজুন। আপনার আগে অনেকেই একই সমস্যায় পড়েছেন।',
          visual: { kind: 'widget', widget: 'error-copy-search' },
        },
        {
          id: 'c-trust',
          type: 'compare',
          textBn: 'ফল পড়ার সময় **তারিখ** আর **উৎস** দেখুন। সব উত্তর ভরসাযোগ্য নয়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'ভরসাযোগ্য', captionBn: 'নতুন, অফিসিয়াল' },
            right: { visual: { kind: 'art', name: 'warning' }, labelBn: 'সাবধান', captionBn: 'পুরোনো, অচেনা কমান্ড' },
            vs: 'বনাম',
          },
          learnMoreBn: 'ফোরামের “Accepted answer” আর বেশি ভোট পাওয়া উত্তর ভালো। যে উত্তর অচেনা কমান্ড চালাতে বা অজানা কিছু নামাতে বলে, যার মানে আপনি বোঝেন না — সেটি কখনো চালাবেন না। বিশ্বাসী কাউকে জিজ্ঞেস করুন।',
        },
        {
          id: 'c-help',
          type: 'visual',
          textBn: 'কারও সাহায্য চাইলে জানান: কী করছিলেন, কী ঘটল, আর হুবহু এরর বা **স্ক্রিনশট**।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'pencil', labelBn: 'কী করছিলাম' },
              { art: 'question', labelBn: 'কী ঘটল' },
              { art: 'camera', labelBn: 'হুবহু এরর' },
            ],
          },
          learnMoreBn: 'স্ক্রিনশট তোলা যায় Windows-এ Win + Shift + S, Mac-এ Shift + Command + 4 দিয়ে। শুধু “কম্পিউটার খারাপ হয়ে গেছে” বললে কেউ বুঝবে না।',
        },
        {
          id: 'c-flow',
          type: 'visual',
          textBn: 'এবার সব মিলিয়ে দেখুন — প্রশ্নের উত্তর দিয়ে এগোন।',
          visual: { kind: 'widget', widget: 'troubleshoot-flow' },
        },
      ],
      steps: [
        {
          id: 'search-error', osVariant: 'both', titleBn: 'এরর লিখে খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search' },
          explanationBn: 'ঘরে লিখুন: Photo Album PA-1042 damaged, তারপর Enter।',
          hintBn: 'ঠিকানার ঘরে ক্লিক করে লিখুন, শেষে Enter বা Return।',
          simplerBn: 'এরর মেসেজের কোডটি (PA-1042) সহ দু-তিনটি শব্দ লিখে Enter চাপুন।',
        },
        {
          id: 'open-forum', osVariant: 'both', titleBn: 'ফোরামের ফলাফল খুলুন', target: 'search-result-4', expectedAction: { type: 'click', target: 'search-result-4' },
          explanationBn: 'চার নম্বর ফলাফল, অর্থাৎ ফোরামের পাতায়, ক্লিক করুন।',
          hintBn: 'answers.example লেখা চার নম্বর নীল শিরোনাম।',
        },
        {
          id: 'read-accepted', osVariant: 'both', titleBn: 'সবুজ উত্তরটি দেখুন', target: 'm12-forum-accepted', expectedAction: { type: 'click', target: 'm12-forum-accepted' },
          explanationBn: 'সবুজ ঘেরা “Accepted answer” বাক্সে ক্লিক করুন।',
          hintBn: 'সবুজ বর্ডারের বাক্স; নিচেরটি ঝুঁকিপূর্ণ।',
          successMessageBn: 'ভরসাযোগ্য উত্তর চিনলেন!',
        },
      ],
      quiz: [
        {
          id: 'q-copy', type: 'multipleChoice', questionBn: 'পর্দায় এরর মেসেজ এলো। সবচেয়ে বুদ্ধিমানের কাজ কোনটি?',
          options: [
            { id: 'a', textBn: 'না পড়েই OK চেপে দেব' },
            { id: 'b', textBn: 'হুবহু কপি করে সার্চ করব' },
            { id: 'c', textBn: 'সব ফাইল মুছে নতুন করে শুরু করব' },
          ],
          correct: ['b'],
          hintBn: 'মেসেজেই সমস্যার নাম বা কোড লুকিয়ে থাকে।',
          explanationBn: 'হুবহু কপি করে খুঁজলে প্রায়ই অন্যদের সমাধান মেলে।',
        },
        {
          id: 'q-trust', type: 'clickTarget', questionBn: 'কয়েকটি ফল পেয়েছেন। কোনটি সবচেয়ে ভরসাযোগ্য?',
          items: [
            { id: 'old', labelBn: '১৩ বছর আগের ব্লগ: “এই কমান্ড চালালেই সব ঠিক”', icon: '📜' },
            { id: 'official', labelBn: 'প্রোগ্রামটির নিজস্ব সাহায্যের পাতা, ৩ সপ্তাহ আগে আপডেট', icon: '✅' },
            { id: 'popup', labelBn: 'পপ-আপ: “এখনই ফিক্স-টুল নামান!”', icon: '⚠️' },
            { id: 'chain', labelBn: 'অচেনা কারও পাঠানো লিংক', icon: '🔗' },
          ],
          correct: 'official',
          hintBn: 'যারা প্রোগ্রামটি বানিয়েছে তাদের নিজেদের নতুন পাতা খুঁজুন।',
          explanationBn: 'অফিসিয়াল পাতা সবচেয়ে ভরসাযোগ্য। বাকিগুলো এড়িয়ে চলুন।',
        },
        {
          id: 'q-helper', type: 'multipleChoice', multi: true, questionBn: 'সাহায্য চাইতে কোন কথাগুলো জানালে সহজে বোঝা যায়? একাধিক বাছুন।',
          options: [
            { id: 'did', textBn: 'আমি কী করছিলাম' },
            { id: 'expect', textBn: 'কী আশা করেছিলাম, কী ঘটল' },
            { id: 'err', textBn: 'এরর হুবহু, বা স্ক্রিনশট' },
            { id: 'vague', textBn: 'শুধু “কম্পিউটার খারাপ”' },
          ],
          correct: ['did', 'expect', 'err'],
          hintBn: 'যত নির্দিষ্ট করে বলবেন, তত সহজে সাহায্য পাবেন।',
          explanationBn: 'ঠিক! “খারাপ হয়ে গেছে” খুবই অস্পষ্ট।',
        },
      ],
      recapBn: ['এরর হুবহু কপি করে খুঁজুন', 'নতুন তারিখ, অফিসিয়াল উৎস দেখুন', 'না বুঝে কমান্ড চালাবেন না'],
      freeTryBn: 'পারেন? একটি সত্যিকারের প্রশ্ন লিখে ব্রাউজারে খুঁজুন।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন',
    tasksBn: [
      'ব্রাউজারে একটি ছোট প্রশ্ন খুঁজুন; ফলের তারিখ আর উৎস দেখে ভরসাযোগ্যটি বেছে নিন।',
      'নোটপ্যাড বা টেক্সটএডিটে কিছু লিখে Ctrl/Cmd + Z দিয়ে আনডু করুন।',
    ],
    windowsTasksBn: ['Ctrl + Shift + Esc চেপে Task Manager শুধু দেখুন, কিছু বন্ধ না করে ✕ চাপুন।'],
    macTasksBn: ['Option + Command + Esc চেপে Force Quit উইন্ডো শুধু দেখুন, কিছু বন্ধ না করে বন্ধ করুন।'],
  },

  teacherTipBn:
    'এই মডিউলে মনের ভয় কাটানোটাই আসল। শিক্ষার্থী যেন বোঝেন যে সমস্যা মানে তাঁর ভুল নয়, আর প্রায় সব সমস্যারই সহজ একটি প্রথম পদক্ষেপ আছে। সিমুলেশনে বারবার অনুশীলন করান। আসল কম্পিউটারে ইচ্ছে করে কিছু আটকানোর চেষ্টা করবেন না, তবে Task Manager বা Force Quit-এর উইন্ডো একবার খুলে দেখান। “না বুঝে কমান্ড চালাবেন না” আর “সাহায্য চাইতে হলে হুবহু এরর জানান” — এই দুটি কথা বারবার মনে করিয়ে দিন।',
}

export default lesson
