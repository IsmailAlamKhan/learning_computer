import type { Lesson, SimSetup } from '../../engine/types'

/**
 * Module 4 — files, folders, extensions and paths, in the cards format. Four units:
 *  (1) files & folders (almirah analogy): create folder/file, rename, drag to move;
 *  (2) copy, delete, restore (Recycle Bin / Trash);
 *  (3) extensions (show them on each OS);
 *  (4) paths (path-explorer widget, path bars, Ctrl+L / Shift+Cmd+G, search).
 * Step ids, targets and expectedActions are the same as in the old guided practice; only the words changed.
 */

/** A deliberately messy Downloads folder for free practice (+ a Mac notes.txt, since Mac makes text files from an app, module 6). */
const baseVfs: NonNullable<SimSetup['vfs']> = (vfs, os) => {
  const dl = vfs.child(vfs.home, 'Downloads')
  if (dl) {
    vfs.createFile(dl, 'photo1.jpg', '')
    vfs.createFile(dl, 'IMG_0042.jpg', '')
    vfs.createFile(dl, 'notes.txt', 'Things to remember.')
    vfs.createFile(dl, 'holiday-photos.zip', '')
    vfs.createFile(dl, 'old-letter.txt', 'Dear friend, ...')
  }
  if (os === 'mac') {
    const docs = vfs.child(vfs.home, 'Documents')
    if (docs) vfs.createFile(docs, 'notes.txt', 'My first note.')
  }
}

const filesSetup: SimSetup = { openApps: ['files'], vfs: baseVfs }

/** Unit 2 starts with the MyWork folder that unit 1 builds. */
const copySetup: SimSetup = {
  openApps: ['files'],
  vfs: (vfs, os) => {
    baseVfs(vfs, os)
    const docs = vfs.child(vfs.home, 'Documents')
    if (docs && !vfs.child(docs, 'MyWork')) vfs.mkdir(docs, 'MyWork')
  },
}

const lesson: Lesson = {
  module: 4,
  part: 1,
  id: 'm04',
  titleBn: 'ফাইল, ফোল্ডার, এক্সটেনশন ও পথ',
  oneLineBn: 'ফাইল-ফোল্ডার সাজানো, এক্সটেনশন চেনা আর ফাইলের ঠিকানা (পথ) পড়া।',
  minutes: 8,
  glossaryIds: [
    'file', 'extension', 'path', 'absolute-path', 'relative-path', 'drive', 'root', 'home-folder', 'parent-folder',
    'documents-folder', 'downloads-folder', 'pictures-folder', 'desktop-folder', 'copy', 'paste', 'cut', 'move', 'rename',
    'delete', 'restore', 'recycle-bin', 'search', 'hidden', 'explorer', 'finder', 'backslash', 'slash',
  ],

  units: [
    // =====================================================================================================
    {
      id: 'files-folders',
      titleBn: 'ফাইল ও ফোল্ডার',
      setup: filesSetup,
      hook: {
        id: 'h-almirah',
        type: 'hook',
        textBn: 'আপনার কম্পিউটার আসলে একটা **আলমারি** — তাকে তাকে সাজানো!',
        visual: { kind: 'art', name: 'almirah' },
      },
      cards: [
        {
          id: 'c-file',
          type: 'visual',
          textBn: 'চিঠি, ছবি, গান — যা জমানো আছে সবই একেকটা **ফাইল**। আলমারির কাগজের মতো।',
          visual: { kind: 'art', name: 'document' },
          chipsBn: ['ফাইল = কাগজ', 'প্রতিটার একটা নাম'],
        },
        {
          id: 'c-folder',
          type: 'visual',
          textBn: 'কাগজ রাখার কভারের নাম **ফোল্ডার**। কভারের ভেতরে ছোট কভারও রাখা যায়।',
          visual: { kind: 'art', name: 'folder-open' },
          chipsBn: ['ফোল্ডার = কভার'],
          learnMoreBn: 'নিজের কাজের ফোল্ডার আর ফাইলের নাম ইংরেজিতে, ফাঁকা জায়গা ছাড়া রাখবেন — যেমন MyWork বা my_work। প্রোগ্রামিংয়ের সময় ফাঁকা জায়গা ঝামেলা করে। “Shopping List.txt”-এর মতো নাম এখন চলে, কিন্তু অভ্যাসটা এখনই করে নেওয়া ভালো।',
        },
        {
          id: 'c-explorer',
          type: 'compare',
          textBn: 'ফাইল দেখার প্রোগ্রামের নাম Windows-এ **ফাইল এক্সপ্লোরার**, Mac-এ **ফাইন্ডার**। কাজ প্রায় এক।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'file-explorer', os: 'windows', highlight: 'files' }, labelBn: 'Windows', captionBn: 'ফাইল এক্সপ্লোরার' },
            right: { visual: { kind: 'mock', name: 'finder', os: 'mac', highlight: 'files' }, labelBn: 'Mac', captionBn: 'ফাইন্ডার' },
            vs: 'বা',
          },
          learnMoreBn: 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — পুরোনো Windows বা macOS-এ মেনুর নাম বা জায়গা ভিন্ন হতে পারে।',
        },
        {
          id: 'c-rename',
          type: 'compare',
          textBn: 'নাম বদলাতে ফাইল বেছে Windows-এ **F2**, Mac-এ **Return** চাপুন।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'keyboard' }, labelBn: 'Windows', captionBn: 'F2' },
            right: { visual: { kind: 'art', name: 'keyboard' }, labelBn: 'Mac', captionBn: 'Return' },
            vs: 'বা',
          },
          learnMoreBn: 'ল্যাপটপে অনেক সময় F2 চাপতে Fn বোতামও ধরে রাখতে হয়। এক্সটেনশন লুকানো থাকলে শুধু নামের অংশ নীল হয় — সেটুকুই বদলান, .txt নিজেই থেকে যায়। এক্সটেনশন দেখা চালু থাকলেও নীল অংশেই লিখবেন।',
        },
        {
          id: 'c-drag-move',
          type: 'visual',
          textBn: 'ফাইল সরাতে **ধরে টেনে** ফোল্ডারের ওপর ছেড়ে দিন — ফাইল ভেতরে ঢুকে যাবে।',
          visual: { kind: 'demo', gesture: 'drag', mock: 'file-explorer', captionBn: 'ধরুন, টানুন, ছাড়ুন' },
          learnMoreBn: 'বাঁ বোতাম চেপে ধরে রেখে মাউস সরান; ফোল্ডারের রং বদলালে ছেড়ে দিন। এই অনুশীলনে ভুল করলেও আসল কম্পিউটারের কিছুই হবে না।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-docs', osVariant: 'windows', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের লম্বা তালিকায় Desktop, Downloads-এর পাশেই Documents লেখা আছে।',
          simplerBn: 'বাঁ দিকের তালিকা থেকে “Documents” লেখা জায়গাটিতে একবার ক্লিক করুন।',
        },
        {
          id: 'w-new', osVariant: 'windows', titleBn: 'নতুন ফোল্ডার: New', target: 'fm-new', expectedAction: { type: 'click', target: 'fm-new' },
          explanationBn: 'ওপরের “New” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের বাঁ দিকে “+ New ▾” বোতামটি দেখুন।',
        },
        {
          id: 'w-new-folder', osVariant: 'windows', titleBn: 'Folder বেছে নিন', target: 'ctx-new-folder', expectedAction: { type: 'createFolder' },
          explanationBn: 'তালিকা থেকে “Folder” বেছে নিন।',
          hintBn: '“Folder” আর “Text Document” — দুটির মধ্যে প্রথমটি।',
        },
        {
          id: 'w-name-folder', osVariant: 'windows', titleBn: 'ফোল্ডারের নাম দিন: MyWork', target: 'rename-input', expectedAction: { type: 'rename', to: 'MyWork' },
          explanationBn: 'MyWork লিখে Enter চাপুন — একসাথে, ফাঁকা জায়গা ছাড়া।',
          hintBn: 'M-y-W-o-r-k লিখুন — M আর W বড় হাতের। তারপর Enter চাপুন।',
          simplerBn: 'পুরোনো নাম “New folder” মুছে যাবে, আপনার লেখাটিই নতুন নাম হবে। লেখা হলে Enter চাপুন।',
          successMessageBn: 'ফোল্ডার তৈরি!',
        },
        {
          id: 'w-new2', osVariant: 'windows', titleBn: 'নতুন লেখার ফাইল: New', target: 'fm-new', expectedAction: { type: 'click', target: 'fm-new' },
          explanationBn: 'আবার “New” বোতামে ক্লিক করুন।',
          hintBn: 'আগের মতোই ওপরের বাঁ দিকের “New ▾”।',
        },
        {
          id: 'w-new-text', osVariant: 'windows', titleBn: 'Text Document', target: 'ctx-new-text', expectedAction: { type: 'createFile' },
          explanationBn: '“Text Document” বেছে নিন।',
          hintBn: 'তালিকার দ্বিতীয় লাইন।',
        },
        {
          id: 'w-name-file', osVariant: 'windows', titleBn: 'ফাইলের নাম দিন: notes.txt', target: 'rename-input', expectedAction: { type: 'rename', to: 'notes.txt' },
          explanationBn: 'শুধু notes লিখে Enter চাপুন — .txt নিজেই জুড়ে যাবে।',
          hintBn: 'নীল অংশে n-o-t-e-s লিখুন, .txt লিখবেন না। তারপর Enter।',
          simplerBn: 'নামের ঘরে “New Text Document” নীল হয়ে আছে। সেটি মুছে notes লিখে Enter চাপুন।',
        },
        {
          id: 'w-f2', osVariant: 'windows', titleBn: 'নাম বদলানো: F2', target: 'fm-item-notes.txt', expectedAction: { type: 'keyCombo', keys: 'f2' },
          explanationBn: 'notes.txt বাছা আছে — কিবোর্ডে F2 চাপুন।',
          hintBn: 'কিবোর্ডের ওপরের সারির F2 চাপুন। না হলে আগে ফাইলটিতে একবার ক্লিক করুন।',
          simplerBn: 'ফাইলটিতে একবার ক্লিক করুন, তারপর কিবোর্ডের F2 বোতাম চাপুন। না পারলে “শর্টকাট প্যাড” ব্যবহার করুন।',
          teacherTipBn: 'ল্যাপটপে অনেক সময় F2 চাপতে Fn বোতামও ধরে রাখতে হয়।',
        },
        {
          id: 'w-rename', osVariant: 'windows', titleBn: 'নতুন নাম: ideas.txt', target: 'rename-input', expectedAction: { type: 'rename', from: 'notes.txt', to: 'ideas.txt' },
          explanationBn: 'শুধু ideas লিখে Enter চাপুন — .txt নিজেই থাকবে।',
          hintBn: 'নীল অংশ মুছে ideas লিখুন। .txt আবার লিখবেন না, নইলে দু-বার হবে।',
        },
        {
          id: 'w-drag', osVariant: 'windows', titleBn: 'ধরে টেনে সরান: ফাইল → ফোল্ডার', target: 'fm-item-ideas.txt', expectedAction: { type: 'drag', target: 'fm-item-ideas.txt', dropTarget: 'fm-item-MyWork' },
          explanationBn: 'ideas.txt ধরে টেনে MyWork ফোল্ডারের ওপর ছেড়ে দিন।',
          hintBn: 'বাঁ বোতাম চেপে ধরে রেখেই মাউস সরান। ফোল্ডারের ওপর পৌঁছে বোতাম ছাড়ুন।',
          simplerBn: 'ফাইলে বাঁ বোতাম চেপে ধরে ধীরে MyWork-এর ওপর নিন। রং বদলালে ছেড়ে দিন।',
          successMessageBn: 'ফাইল ফোল্ডারে ঢুকে গেছে!',
        },
        // ---------- Mac ----------
        {
          id: 'm-docs', osVariant: 'mac', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের “Favorites” তালিকায় Desktop-এর নিচেই Documents।',
          simplerBn: 'বাঁ দিকের তালিকা থেকে “Documents” লেখা জায়গাটিতে একবার ক্লিক করুন।',
        },
        {
          id: 'm-new-folder', osVariant: 'mac', titleBn: 'নতুন ফোল্ডার: New Folder', target: 'fm-new-folder', expectedAction: { type: 'createFolder' },
          explanationBn: 'ওপরের “New Folder” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে “+ New Folder” বোতাম। (কিবোর্ডে: Shift+Cmd+N।)',
        },
        {
          id: 'm-name-folder', osVariant: 'mac', titleBn: 'ফোল্ডারের নাম দিন: MyWork', target: 'rename-input', expectedAction: { type: 'rename', to: 'MyWork' },
          explanationBn: 'MyWork লিখে Return চাপুন — একসাথে, ফাঁকা জায়গা ছাড়া।',
          hintBn: 'M-y-W-o-r-k লিখুন — M আর W বড় হাতের। তারপর Return।',
          simplerBn: 'পুরোনো নাম “untitled folder” মুছে যাবে, আপনার লেখাটিই নতুন নাম হবে। লেখা হলে Return চাপুন।',
          successMessageBn: 'ফোল্ডার তৈরি!',
        },
        {
          id: 'm-select-notes', osVariant: 'mac', titleBn: 'নাম বদলের ফাইল বাছুন', target: 'fm-item-notes.txt', expectedAction: { type: 'click', target: 'fm-item-notes.txt' },
          explanationBn: 'notes.txt ফাইলটিতে একবার ক্লিক করুন।',
          hintBn: 'ফাইলের তালিকায় notes.txt খুঁজুন। (আসল Mac-এ এমন ফাইল TextEdit থেকে বানাতে হয়।)',
        },
        {
          id: 'm-return', osVariant: 'mac', titleBn: 'নাম বদলানো: Return', target: 'fm-item-notes.txt', expectedAction: { type: 'keyCombo', keys: 'enter' },
          explanationBn: 'কিবোর্ডে Return চাপুন।',
          hintBn: 'কিবোর্ডের বড় Return বোতাম। না হলে আগে ফাইলটিতে একবার ক্লিক করুন।',
          simplerBn: 'ফাইলটিতে একবার ক্লিক করুন, তারপর কিবোর্ডের Return চাপুন। না পারলে “শর্টকাট প্যাড” ব্যবহার করুন।',
        },
        {
          id: 'm-rename', osVariant: 'mac', titleBn: 'নতুন নাম: ideas.txt', target: 'rename-input', expectedAction: { type: 'rename', from: 'notes.txt', to: 'ideas.txt' },
          explanationBn: 'শুধু ideas লিখে Return চাপুন — .txt নিজেই থাকবে।',
          hintBn: 'নীল অংশ মুছে ideas লিখুন। .txt আবার লিখবেন না, নইলে দু-বার হবে।',
        },
        {
          id: 'm-drag', osVariant: 'mac', titleBn: 'ধরে টেনে সরান: ফাইল → ফোল্ডার', target: 'fm-item-ideas.txt', expectedAction: { type: 'drag', target: 'fm-item-ideas.txt', dropTarget: 'fm-item-MyWork' },
          explanationBn: 'ideas.txt ধরে টেনে MyWork ফোল্ডারের ওপর ছেড়ে দিন।',
          hintBn: 'বোতাম চেপে ধরে রেখেই মাউস সরান। ফোল্ডারের ওপর পৌঁছে ছাড়ুন।',
          simplerBn: 'ফাইলে বোতাম চেপে ধরে ধীরে MyWork-এর ওপর নিন। রং বদলালে ছেড়ে দিন।',
          successMessageBn: 'ফাইল ফোল্ডারে ঢুকে গেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-almirah',
          type: 'multipleChoice',
          questionBn: 'আলমারির উপমায় ফোল্ডার হলো কোনটি?',
          options: [
            { id: 'a', textBn: 'ভেতরের কাগজ' },
            { id: 'b', textBn: 'কাগজ রাখার কভার' },
            { id: 'c', textBn: 'আলমারির চাবি' },
          ],
          correct: ['b'],
          hintBn: 'ফোল্ডারের ভেতরে ফাইল রাখা হয় — কাগজের কভারের মতো।',
          explanationBn: 'ঠিক! ফাইল = কাগজ, ফোল্ডার = কভার।',
        },
        {
          id: 'q-move',
          type: 'multipleChoice',
          questionBn: 'একটি ফাইলকে অন্য ফোল্ডারে সরাতে কী করবেন?',
          options: [
            { id: 'a', textBn: 'ফাইলটি ধরে টেনে ফোল্ডারের ওপর ছাড়ব' },
            { id: 'b', textBn: 'ফাইলের নাম মুছে দেব' },
            { id: 'c', textBn: 'কম্পিউটার বন্ধ করব' },
          ],
          correct: ['a'],
          hintBn: 'ধরুন, টানুন, ছাড়ুন।',
          explanationBn: 'ধরে টেনে ফোল্ডারে ছাড়লেই ফাইল সরে যায়।',
        },
        {
          id: 'q-make-order',
          type: 'ordering',
          questionBn: 'ফাইল বানিয়ে ফোল্ডারে রাখার ধাপগুলো সাজান।',
          items: [
            { id: '1', textBn: 'ফাইল বানাই' },
            { id: '2', textBn: 'নাম দিয়ে Enter (Mac-এ Return) চাপি' },
            { id: '3', textBn: 'ধরে টেনে ফোল্ডারের ওপর ছাড়ি' },
          ],
          hintBn: 'আগে ফাইল, তারপর নাম, শেষে সরানো।',
          explanationBn: 'বানানো, নাম, সরানো — এই ক্রমে।',
        },
      ],
      recapBn: ['ফাইল = কাগজ, ফোল্ডার = কভার', 'নাম বদল: F2 / Return', 'ধরে টেনে সরানো'],
      freeTryBn: 'Documents-এ নিজের আরেকটা ফোল্ডার বানিয়ে নাম দিন।',
    },

    // =====================================================================================================
    {
      id: 'copy-delete',
      titleBn: 'কপি, মোছা ও ফেরানো',
      setup: copySetup,
      hook: {
        id: 'h-trash',
        type: 'hook',
        textBn: 'ভুল করে মুছে ফেললেন? **ঘাবড়াবেন না** — ফিরিয়ে আনা যায়!',
        visual: { kind: 'art', name: 'trash' },
      },
      cards: [
        {
          id: 'c-copy',
          type: 'visual',
          textBn: '**কপি** মানে নকল বানানো। আসল ফাইল আগের জায়গাতেই থাকে।',
          visual: { kind: 'flow', items: [{ art: 'file', labelBn: 'ফাইল' }, { art: 'copy', labelBn: 'কপি' }, { art: 'paste', labelBn: 'পেস্ট' }] },
          chipsBn: ['কপি = নকল', 'আসল থাকে'],
        },
        {
          id: 'c-copy-keys',
          type: 'compare',
          textBn: 'কপি-পেস্টের শর্টকাট: Windows-এ **Ctrl+C**, **Ctrl+V**। Mac-এ Ctrl-এর বদলে Cmd।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'keyboard-keys', os: 'windows', highlight: 'ctrl' }, labelBn: 'Windows', captionBn: 'Ctrl+C, Ctrl+V' },
            right: { visual: { kind: 'mock', name: 'keyboard-keys', os: 'mac', highlight: 'cmd' }, labelBn: 'Mac', captionBn: 'Cmd+C, Cmd+V' },
            vs: 'বা',
          },
          learnMoreBn: 'ফাইল সরাতে চাইলে কপির বদলে কাট ব্যবহার করুন: Windows-এ Ctrl+X, তারপর Ctrl+V। Mac-এর Finder-এ Cmd+C করে Option+Cmd+V চাপলে ফাইল সরে যায়। সোজা উপায় হলো ধরে টেনে সরানো।',
        },
        {
          id: 'c-bin',
          type: 'compare',
          textBn: 'মুছলে ফাইল যায় **রিসাইকেল বিনে** (Mac-এ **ট্র্যাশে**) — চিরতরে নয়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'win-desktop', os: 'windows', highlight: 'recycle-bin' }, labelBn: 'Windows', captionBn: 'রিসাইকেল বিন' },
            right: { visual: { kind: 'mock', name: 'mac-desktop', os: 'mac', highlight: 'trash' }, labelBn: 'Mac', captionBn: 'ট্র্যাশ' },
            vs: 'বা',
          },
          learnMoreBn: 'রিসাইকেল বিন বা ট্র্যাশ খালি (Empty) না করা পর্যন্ত মোছা ফাইল ফেরানো যায়। খালি করলে ফাইল সত্যিই চলে যায়, তাই খালি করার আগে একবার দেখে নিন।',
        },
        {
          id: 'c-restore',
          type: 'visual',
          textBn: 'বিন খুলে ফাইল বেছে **Restore** (Mac-এ **Put Back**) চাপলেই ফাইল ফিরে আসে।',
          visual: { kind: 'art', name: 'undo' },
          chipsBn: ['Restore / Put Back', 'আগের জায়গায় ফেরে'],
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-docs2', osVariant: 'windows', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় Desktop, Downloads-এর পাশেই Documents।',
        },
        {
          id: 'w-select-recipe', osVariant: 'windows', titleBn: 'কপির জন্য ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
          explanationBn: '“Recipe.txt” ফাইলটিতে একবার ক্লিক করুন।',
          hintBn: 'ফাইলের তালিকায় Recipe.txt খুঁজুন; একবার ক্লিক।',
        },
        {
          id: 'w-copy', osVariant: 'windows', titleBn: 'কপি: Ctrl+C', target: 'fm-item-Recipe.txt', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
          explanationBn: 'Ctrl চেপে ধরে C চাপুন। কিছু নড়বে না — কম্পিউটার মনে রাখবে।',
          hintBn: 'Ctrl বোতাম চেপে ধরে রেখে একবার C চাপুন, তারপর দুটিই ছাড়ুন।',
          simplerBn: 'না পারলে “শর্টকাট প্যাড” খুলে সেখান থেকে Ctrl+C বেছে নিন।',
        },
        {
          id: 'w-open-mywork', osVariant: 'windows', titleBn: 'MyWork ফোল্ডারে ঢুকুন', target: 'fm-item-MyWork', expectedAction: { type: 'doubleClick', target: 'fm-item-MyWork' },
          explanationBn: 'MyWork-এ ডাবল ক্লিক করে ভেতরে ঢুকুন।',
          hintBn: 'পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
        },
        {
          id: 'w-paste-menu-rc', osVariant: 'windows', titleBn: 'ফাঁকা জায়গায় রাইট ক্লিক', target: 'fm-content', expectedAction: { type: 'rightClick', target: 'fm-content' },
          explanationBn: 'ফোল্ডারের ভেতরের ফাঁকা জায়গায় রাইট ক্লিক করুন।',
          hintBn: 'আইকন থেকে একটু দূরে, সাদা ফাঁকা জায়গায় রাইট ক্লিক।',
        },
        {
          id: 'w-paste', osVariant: 'windows', titleBn: 'Paste', target: 'ctx-paste', expectedAction: { type: 'copy', name: 'Recipe.txt', toPath: '~/Documents/MyWork' },
          explanationBn: 'মেনু থেকে “Paste” বেছে নিন। (Ctrl+V-ও একই কাজ করে।)',
          hintBn: 'মেনুতে “Paste” লেখাটি খুঁজুন।',
          successMessageBn: 'নকল তৈরি! আসল ফাইল আগের জায়গাতেই আছে।',
        },
        {
          id: 'w-delete', osVariant: 'windows', titleBn: 'মুছে ফেলা: Delete', target: 'fm-delete', expectedAction: { type: 'delete', name: 'Recipe.txt' },
          explanationBn: 'নকল Recipe.txt বাছা আছে। ওপরের “Delete” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে Rename-এর পাশে “Delete” বোতাম।',
          simplerBn: 'যদি আর বাছা না থাকে, আগে Recipe.txt-এ একবার ক্লিক করুন, তারপর Delete।',
          successMessageBn: 'বিনে গেছে, চিরতরে নয়!',
        },
        {
          id: 'w-open-bin', osVariant: 'windows', titleBn: 'রিসাইকেল বিন খুলুন', target: 'fm-sidebar-Recycle Bin', expectedAction: { type: 'openApp', app: 'bin' },
          explanationBn: 'বাঁ তালিকার একদম নিচে “Recycle Bin”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকার শেষ লাইন।',
        },
        {
          id: 'w-bin-select', osVariant: 'windows', titleBn: 'ফেরানোর ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
          explanationBn: 'বিনের ভেতরে Recipe.txt-এ একবার ক্লিক করুন।',
          hintBn: 'নতুন খোলা উইন্ডোতে ফাইলটি দেখা যাচ্ছে।',
        },
        {
          id: 'w-restore', osVariant: 'windows', titleBn: 'ফিরিয়ে আনুন: Restore', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Recipe.txt' },
          explanationBn: 'ওপরের “Restore the selected items” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে “Restore the selected items” লেখা বোতামটি।',
          successMessageBn: 'দেখলেন তো, মুছলেও ফেরে!',
        },
        {
          id: 'w-close-bin', osVariant: 'windows', titleBn: 'রিসাইকেল বিন বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
          explanationBn: 'বিন উইন্ডোর ডান ওপরের ✕ বোতামে ক্লিক করুন।',
          hintBn: 'রিসাইকেল বিন উইন্ডোর ডান ওপরের কোণে ✕।',
        },
        // ---------- Mac ----------
        {
          id: 'm-docs2', osVariant: 'mac', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের “Favorites” তালিকায় Desktop-এর নিচেই Documents।',
        },
        {
          id: 'm-select-recipe', osVariant: 'mac', titleBn: 'কপির জন্য ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
          explanationBn: '“Recipe.txt” ফাইলটিতে একবার ক্লিক করুন।',
          hintBn: 'ফাইলের তালিকায় Recipe.txt খুঁজুন; একবার ক্লিক।',
        },
        {
          id: 'm-copy', osVariant: 'mac', titleBn: 'কপি: Cmd+C', target: 'fm-item-Recipe.txt', expectedAction: { type: 'keyCombo', keys: 'mod+c' },
          explanationBn: 'Command (⌘) চেপে ধরে C চাপুন। কিছু নড়বে না — কম্পিউটার মনে রাখবে।',
          hintBn: 'Command চেপে ধরে রেখে একবার C চাপুন, তারপর দুটিই ছাড়ুন।',
          simplerBn: 'না পারলে “শর্টকাট প্যাড” খুলে সেখান থেকে Cmd+C বেছে নিন।',
        },
        {
          id: 'm-open-mywork', osVariant: 'mac', titleBn: 'MyWork ফোল্ডারে ঢুকুন', target: 'fm-item-MyWork', expectedAction: { type: 'doubleClick', target: 'fm-item-MyWork' },
          explanationBn: 'MyWork-এ ডাবল ক্লিক করে ভেতরে ঢুকুন।',
          hintBn: 'পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
        },
        {
          id: 'm-paste-menu-rc', osVariant: 'mac', titleBn: 'ফাঁকা জায়গায় রাইট ক্লিক', target: 'fm-content', expectedAction: { type: 'rightClick', target: 'fm-content' },
          explanationBn: 'ফোল্ডারের ভেতরের ফাঁকা জায়গায় রাইট ক্লিক (বা দুই আঙুলে ট্যাপ) করুন।',
          hintBn: 'আইকন থেকে একটু দূরে, সাদা ফাঁকা জায়গায় রাইট ক্লিক।',
        },
        {
          id: 'm-paste', osVariant: 'mac', titleBn: 'Paste Item', target: 'ctx-paste', expectedAction: { type: 'copy', name: 'Recipe.txt', toPath: '~/Documents/MyWork' },
          explanationBn: 'মেনু থেকে “Paste Item” বেছে নিন। (Cmd+V-ও একই কাজ করে।)',
          hintBn: 'মেনুতে “Paste Item” লেখাটি খুঁজুন।',
          successMessageBn: 'নকল তৈরি! আসল ফাইল আগের জায়গাতেই আছে।',
        },
        {
          id: 'm-delete', osVariant: 'mac', titleBn: 'ট্র্যাশে পাঠান', target: 'fm-delete', expectedAction: { type: 'delete', name: 'Recipe.txt' },
          explanationBn: 'নকল Recipe.txt বাছা আছে। ওপরের ডান দিকের ট্র্যাশ (🗑) বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে একটি ছোট ডাস্টবিনের মতো চিহ্ন। (কিবোর্ডে: Cmd+Delete।)',
          simplerBn: 'যদি আর বাছা না থাকে, আগে Recipe.txt-এ একবার ক্লিক করুন, তারপর ডাস্টবিনের চিহ্নে।',
          successMessageBn: 'ট্র্যাশে গেছে, চিরতরে নয়!',
        },
        {
          id: 'm-open-trash', osVariant: 'mac', titleBn: 'ট্র্যাশ খুলুন', target: 'fm-sidebar-Trash', expectedAction: { type: 'openApp', app: 'bin' },
          explanationBn: 'বাঁ তালিকার একদম নিচে “Trash”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকার শেষ লাইন।',
        },
        {
          id: 'm-trash-select', osVariant: 'mac', titleBn: 'ফেরানোর ফাইল বাছুন', target: 'fm-item-Recipe.txt', expectedAction: { type: 'click', target: 'fm-item-Recipe.txt' },
          explanationBn: 'ট্র্যাশের ভেতরে Recipe.txt-এ একবার ক্লিক করুন।',
          hintBn: 'নতুন খোলা উইন্ডোতে ফাইলটি দেখা যাচ্ছে।',
        },
        {
          id: 'm-restore', osVariant: 'mac', titleBn: 'ফিরিয়ে আনুন: Put Back', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Recipe.txt' },
          explanationBn: 'ওপরের “Put Back” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে “Put Back” লেখা বোতামটি।',
          successMessageBn: 'দেখলেন তো, মুছলেও ফেরে!',
        },
        {
          id: 'm-close-trash', osVariant: 'mac', titleBn: 'ট্র্যাশ বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
          explanationBn: 'ট্র্যাশ উইন্ডোর বাঁ ওপরের লাল বোতামে ক্লিক করুন।',
          hintBn: 'ট্র্যাশ উইন্ডোর বাঁ ওপরের কোণে লাল গোল বোতাম।',
        },
      ],
      quiz: [
        {
          id: 'q-copy-original',
          type: 'multipleChoice',
          questionBn: 'কপি করে অন্য ফোল্ডারে পেস্ট করলে আসল ফাইলের কী হয়?',
          options: [
            { id: 'a', textBn: 'আসল ফাইল মুছে যায়' },
            { id: 'b', textBn: 'আসল ফাইল আগের জায়গাতেই থাকে' },
            { id: 'c', textBn: 'দুটো ফাইল জুড়ে এক হয়ে যায়' },
          ],
          correct: ['b'],
          hintBn: 'কপি মানে নকল বানানো — ফটোকপির মতো।',
          explanationBn: 'ঠিক! নকল হয়, আসল থাকে।',
        },
        {
          id: 'q-bin',
          type: 'multipleChoice',
          questionBn: 'ফাইল মুছলে প্রথমে সেটি কোথায় যায়?',
          options: [
            { id: 'a', textBn: 'চিরতরে হারিয়ে যায়' },
            { id: 'b', textBn: 'রিসাইকেল বিন বা ট্র্যাশে' },
            { id: 'c', textBn: 'ডেস্কটপের ছবিতে' },
          ],
          correct: ['b'],
          hintBn: 'বিন খালি না করা পর্যন্ত ফাইল ফেরানো যায়।',
          explanationBn: 'বিন বা ট্র্যাশে যায়, তাই ফেরানো যায়।',
        },
        {
          id: 'q-restore-order',
          type: 'ordering',
          questionBn: 'ভুল করে মোছা ফাইল ফেরানোর ধাপগুলো সাজান।',
          items: [
            { id: '1', textBn: 'ফাইলটি বেছে মুছে ফেলি' },
            { id: '2', textBn: 'রিসাইকেল বিন (Mac-এ ট্র্যাশ) খুলি' },
            { id: '3', textBn: 'মোছা ফাইলটি বেছে নিই' },
            { id: '4', textBn: 'Restore (Mac-এ Put Back) চাপি' },
          ],
          hintBn: 'আগে মোছা, তারপর বিন খুলে বাছা, শেষে ফেরানো।',
          explanationBn: 'মোছা, বিন খোলা, বাছা, ফেরানো — এই ক্রমে।',
        },
      ],
      recapBn: ['কপি = নকল, আসল থাকে', 'মুছলে যায় বিন বা ট্র্যাশে', 'Restore / Put Back = ফেরানো'],
      freeTryBn: 'Downloads-এ একটা ফাইল কপি করে Documents-এ পেস্ট করুন।',
    },

    // =====================================================================================================
    {
      id: 'extensions',
      titleBn: 'এক্সটেনশন',
      setup: filesSetup,
      hook: {
        id: 'h-ext',
        type: 'hook',
        textBn: 'ফাইলের নামের শেষ অংশটাই ফাইলের **পরিচয়পত্র**!',
        visual: { kind: 'art', name: 'id-card' },
      },
      cards: [
        {
          id: 'c-ext-label',
          type: 'compare',
          textBn: '**এক্সটেনশন** মশলার কৌটোর লেবেলের মতো — ভেতরে কী আছে, বলে দেয়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'big', emoji: '📄' }, labelBn: 'Recipe.txt', captionBn: 'লেখার ফাইল' },
            right: { visual: { kind: 'big', emoji: '🖼️' }, labelBn: 'photo.jpg', captionBn: 'ছবি' },
            vs: 'বনাম',
          },
          learnMoreBn: 'এক্সটেনশন দেখেই কম্পিউটার ঠিক করে ফাইলটি কোন প্রোগ্রামে খুলবে। নামের শেষে ডট (.) আর তার পরের ছোট অংশটাই এক্সটেনশন।',
        },
        {
          id: 'c-ext-list',
          type: 'visual',
          textBn: 'চারটা চিনে রাখুন: লেখা, ছবি, ওয়েবপেজ আর **পাইথন** প্রোগ্রাম।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'document', labelBn: '.txt' },
              { art: 'image', labelBn: '.jpg' },
              { art: 'html-tag', labelBn: '.html' },
              { art: 'python-snake', labelBn: '.py' },
            ],
          },
          learnMoreBn: 'আরও কিছু: .png — ছবি। .pdf — পড়ার ডকুমেন্ট, যেমন বিল বা ফর্ম। .js — জাভাস্ক্রিপ্ট (JavaScript) প্রোগ্রাম। .zip — অনেক ফাইল একসাথে চেপে রাখা প্যাকেট।',
        },
        {
          id: 'c-ext-wrong',
          type: 'visual',
          textBn: 'ভুল এক্সটেনশন দিলে ফাইল **ঠিকমতো খোলে না** — প্রোগ্রামের ফাইল তো একদমই চলে না।',
          visual: { kind: 'art', name: 'warning', captionBn: 'photo.jpg → photo.txt' },
          learnMoreBn: 'hello.py ভুল করে hello.py.txt হয়ে গেলে প্রোগ্রাম চলবে না। ছবি photo.jpg-এর নাম বদলে photo.txt করলে সেটি আর ছবি হিসেবে খুলবে না। প্রোগ্রাম লিখলে ফাইলের নাম হতে হবে একদম ঠিক — যেমন hello.py, index.html। ভুল হলে নাম আবার ঠিক করে দিলেই চলে।',
        },
        {
          id: 'c-ext-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'Windows-এ এক্সটেনশন লুকানো থাকতে পারে। **View → Show → File name extensions** দিয়ে দেখুন।',
          visual: { kind: 'mock', name: 'file-explorer', os: 'windows', highlight: 'view-menu' },
          learnMoreBn: 'Windows 11 ফাইল এক্সপ্লোরারে ওপরের View → Show → File name extensions-এ টিক দিন। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — পুরোনো Windows-এ মেনুর জায়গা ভিন্ন হতে পারে।',
        },
        {
          id: 'c-ext-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'Mac-এ **Finder → Settings → Advanced**-এ গিয়ে “Show all filename extensions” চালু করুন।',
          visual: { kind: 'mock', name: 'finder', os: 'mac', highlight: 'toolbar' },
          learnMoreBn: 'মেনু বারে Finder → Settings (পুরোনো macOS-এ Preferences) → Advanced। এই অনুশীলনে সুবিধার জন্য Finder উইন্ডোর ওপরের ⚙ বোতামের মেনুতেই “Show All Filename Extensions” আছে; আসল Mac-এ ওপরের পথটি ধরবেন।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-dl', osVariant: 'windows', titleBn: 'ডাউনলোডস ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'click', target: 'fm-sidebar-Downloads' },
          explanationBn: 'বাঁ দিকের তালিকায় “Downloads”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের তালিকায় Documents-এর কাছেই Downloads।',
        },
        {
          id: 'w-ext-view', osVariant: 'windows', titleBn: 'View মেনু', target: 'fm-view', expectedAction: { type: 'click', target: 'fm-view' },
          explanationBn: 'ওপরের “View” বোতামে ক্লিক করুন।',
          hintBn: 'ওপরের সারিতে New, Cut, Copy, Paste-এর ডান দিকে “View ▾” আছে।',
        },
        {
          id: 'w-ext-show', osVariant: 'windows', titleBn: 'Show', target: 'ctx-show', expectedAction: { type: 'click', target: 'ctx-show' },
          explanationBn: 'মেনুতে “Show” লেখায় ক্লিক করুন।',
          hintBn: 'মেনুর নিচের দিকে “Show ›” দেখুন।',
        },
        {
          id: 'w-ext-on', osVariant: 'windows', titleBn: 'File name extensions', target: 'ctx-show-ext', expectedAction: { type: 'custom', event: 'extensions-shown' },
          explanationBn: '“File name extensions”-এ ক্লিক করে টিক চালু করুন।',
          hintBn: 'পাশের ছোট তালিকায় “File name extensions” আর “Hidden items” আছে — প্রথমটি চান।',
          successMessageBn: 'চমৎকার! এখন পুরো নাম দেখা যাবে।',
        },
        // ---------- Mac ----------
        {
          id: 'm-dl', osVariant: 'mac', titleBn: 'ডাউনলোডস ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'click', target: 'fm-sidebar-Downloads' },
          explanationBn: 'বাঁ দিকের তালিকায় “Downloads”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের “Favorites” তালিকায় Documents-এর নিচেই Downloads।',
        },
        {
          id: 'm-ext-opts', osVariant: 'mac', titleBn: '⚙ মেনু', target: 'fm-view-options', expectedAction: { type: 'click', target: 'fm-view-options' },
          explanationBn: 'উইন্ডোর ওপরের ⚙ বোতামে ক্লিক করুন। (আসল Mac-এ এটি Finder → Settings → Advanced।)',
          hintBn: 'ওপরের সারিতে “⚙ ▾” বোতামটি খুঁজুন।',
        },
        {
          id: 'm-ext-on', osVariant: 'mac', titleBn: 'Show All Filename Extensions', target: 'ctx-show-ext', expectedAction: { type: 'custom', event: 'extensions-shown' },
          explanationBn: '“Show All Filename Extensions”-এ ক্লিক করুন।',
          hintBn: 'মেনুর প্রথম লাইন।',
          successMessageBn: 'চমৎকার! এখন পুরো নাম দেখা যাবে।',
        },
      ],
      quiz: [
        {
          id: 'q-ext-match',
          type: 'dragMatch',
          questionBn: 'এক্সটেনশনের সাথে ফাইলের ধরন মেলান।',
          pairs: [
            { id: 'txt', leftBn: '.txt', rightBn: 'সাধারণ লেখা' },
            { id: 'jpg', leftBn: '.jpg', rightBn: 'ছবি' },
            { id: 'html', leftBn: '.html', rightBn: 'ওয়েবপেজ' },
            { id: 'py', leftBn: '.py', rightBn: 'পাইথন প্রোগ্রাম' },
          ],
          hintBn: 'jpg হলো ছবি। html দিয়ে ওয়েবপেজ বানানো হয়। py মানে পাইথন।',
          explanationBn: 'এক্সটেনশন দেখেই কম্পিউটার ফাইলের ধরন বোঝে।',
        },
        {
          id: 'q-ext-rename',
          type: 'multipleChoice',
          questionBn: 'photo.jpg-এর নাম ভুল করে photo.txt করলে কী হবে?',
          options: [
            { id: 'a', textBn: 'ছবি আগের মতোই খুলবে' },
            { id: 'b', textBn: 'ছবি হিসেবে আর ঠিকমতো খুলবে না' },
            { id: 'c', textBn: 'ছবি নিজে নিজে সুন্দর হবে' },
          ],
          correct: ['b'],
          hintBn: 'কৌটোর লেবেল বদলালে ভেতরের মশলা চেনা যায় না।',
          explanationBn: 'এক্সটেনশন বদলালে কম্পিউটার ভুল প্রোগ্রামে খুলতে চায়।',
        },
        {
          id: 'q-ext-py',
          type: 'multipleChoice',
          questionBn: 'পাইথন প্রোগ্রামের ফাইলের নাম কোনটি হওয়া উচিত?',
          options: [
            { id: 'a', textBn: 'hello.py' },
            { id: 'b', textBn: 'hello.py.txt' },
            { id: 'c', textBn: 'hello' },
          ],
          correct: ['a'],
          hintBn: 'শেষে ঠিক .py থাকতে হবে, আর কিছু নয়।',
          explanationBn: 'প্রোগ্রামের ফাইলের এক্সটেনশন একদম ঠিক রাখতে হয়।',
        },
      ],
      recapBn: ['এক্সটেনশন = ফাইলের লেবেল', '.txt, .jpg, .html, .py', 'নাম বদলে এটি অক্ষত রাখুন'],
      freeTryBn: 'Downloads-এর ফাইলগুলোর এক্সটেনশন পড়ে বলুন কোনটা কী।',
    },

    // =====================================================================================================
    {
      id: 'paths',
      titleBn: 'পথ (ফাইলের ঠিকানা)',
      setup: filesSetup,
      hook: {
        id: 'h-path',
        type: 'hook',
        textBn: 'ফাইলের **ঠিকানা** জানলে কম্পিউটারের যেকোনো কোণে পৌঁছানো যায়!',
        visual: { kind: 'art', name: 'path-map' },
      },
      cards: [
        {
          id: 'c-path-addr',
          type: 'visual',
          textBn: '**পথ** হলো ফাইলের ঠিকানা — বড় ফোল্ডার থেকে ভেতরের ফোল্ডার, শেষে ফাইল। যেন জেলা → থানা → বাড়ি।',
          visual: {
            kind: 'flow',
            items: [{ art: 'folder', labelBn: 'বড় ফোল্ডার' }, { art: 'folder-open', labelBn: 'ভেতরের ফোল্ডার' }, { art: 'file', labelBn: 'ফাইল' }],
          },
          learnMoreBn: 'আমরা যেমন ঠিকানা লিখি: বাংলাদেশ → জেলা → থানা → গ্রাম → বাড়ি, পথও তেমনই। শেষ অংশটি ফাইলের নাম, তার আগের সবগুলো ফোল্ডার।',
        },
        {
          id: 'c-path-widget',
          type: 'visual',
          textBn: 'ফোল্ডারে ক্লিক করে **Birthdays.txt**-এর পথ বানাতে পারেন?',
          visual: { kind: 'widget', widget: 'path-explorer' },
        },
        {
          id: 'c-path-bars',
          type: 'compare',
          textBn: 'Windows-এর পথে নামের মাঝে ব্যাকস্ল্যাশ **\\**, Mac-এ স্ল্যাশ **/** বসে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'path-bar-win', os: 'windows', highlight: 'folders' }, labelBn: 'Windows', captionBn: 'C:\\Users\\Anika\\Documents' },
            right: { visual: { kind: 'mock', name: 'path-bar-mac', os: 'mac', highlight: 'folders' }, labelBn: 'Mac', captionBn: '/Users/anika/Documents' },
            vs: 'বনাম',
          },
          learnMoreBn: 'শুরুতে Windows-এ C: হলো ড্রাইভ (Drive) — ফাইল জমানোর বড় একটি ভাগ। Mac-এ ড্রাইভ অক্ষর নেই; একদম শুরুর / হলো সবার ওপরের ফোল্ডার, যার নাম রুট (Root)। Mac-এর পথ বার না দেখালে মেনু বারে View → Show Path Bar দিন। টার্মিনালে (পরে শিখবেন) হোম ফোল্ডারকে ~ লেখা হয়, যেমন ~/Documents।',
        },
        {
          id: 'c-abs-rel',
          type: 'compare',
          textBn: '**সম্পূর্ণ পথ** শুরু থেকে লেখা। **আপেক্ষিক পথ** এখন যেখানে আছেন সেখান থেকে।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'big', emoji: '🗺️' }, labelBn: 'সম্পূর্ণ', captionBn: 'একদম শুরু থেকে' },
            right: { visual: { kind: 'big', emoji: '📍' }, labelBn: 'আপেক্ষিক', captionBn: 'এখান থেকে' },
            vs: 'বনাম',
          },
          learnMoreBn: 'সম্পূর্ণ পথ, যেমন C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt, যেখান থেকেই দেখুন একই থাকে। আপেক্ষিক পথ, যেমন Documents-এ থাকলে Family\\Birthdays.txt, ঠিক যেন “আমার বাড়ি থেকে তিন বাড়ি পরে”। দুটি ডট ( .. ) মানে এক ধাপ ওপরের ফোল্ডার (প্যারেন্ট), আর একটি ডট ( . ) মানে এই ফোল্ডার।',
        },
        {
          id: 'c-places',
          type: 'visual',
          textBn: 'নিজের জিনিস থাকে হোম ফোল্ডারের **চার ঘরে**: ডেস্কটপ, ডকুমেন্টস, ডাউনলোডস, পিকচার্স।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'desktop', labelBn: 'ডেস্কটপ' },
              { art: 'document', labelBn: 'ডকুমেন্টস' },
              { art: 'download', labelBn: 'ডাউনলোডস' },
              { art: 'image', labelBn: 'পিকচার্স' },
            ],
          },
          learnMoreBn: 'ডেস্কটপে যা দেখা যায় আসলে তা Desktop ফোল্ডারের ফাইল। এই কোর্সে প্রোগ্রামের ফোল্ডার Documents-এ রাখবেন। Downloads প্রায়ই এলোমেলো হয়ে যায় — মাঝেমধ্যে গুছিয়ে নেবেন।',
        },
        {
          id: 'c-search',
          type: 'visual',
          textBn: 'খুঁজে না পেলে নামের **একটু অংশ** লিখে সার্চ করুন — গভীরে থাকলেও পাবেন।',
          visual: { kind: 'art', name: 'magnifier' },
          learnMoreBn: 'সার্চ ফলাফলে ফাইলটি কোন ফোল্ডারে আছে তাও দেখা যায়।',
        },
      ],
      steps: [
        // ---------- Windows ----------
        {
          id: 'w-docs-path', osVariant: 'windows', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের লম্বা তালিকায় Desktop, Downloads-এর পাশেই Documents।',
        },
        {
          id: 'w-read-path', osVariant: 'windows', titleBn: 'ঠিকানার বার', target: 'fm-address', expectedAction: { type: 'continue' },
          explanationBn: 'ওপরের ঠিকানার বারটি দেখুন: C: › Users › Anika › Documents। এটিই পথ।',
          hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন।',
        },
        {
          id: 'w-ctrl-l', osVariant: 'windows', titleBn: 'পথ লিখে যাওয়া: Ctrl+L', target: 'fm-address', expectedAction: { type: 'keyCombo', keys: 'mod+l' },
          explanationBn: 'কিবোর্ডে Ctrl+L চাপুন — বারটি লেখার ঘর হয়ে যাবে।',
          hintBn: 'Ctrl চেপে ধরে L চাপুন। না হলে বারের ফাঁকা অংশে ক্লিক করুন বা “শর্টকাট প্যাড” ব্যবহার করুন।',
        },
        {
          id: 'w-type-path', osVariant: 'windows', titleBn: 'পথ লিখুন', target: 'fm-address-input', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'বারে C:\\Users\\Anika\\Documents লিখে Enter চাপুন।',
          hintBn: 'ব্যাকস্ল্যাশ ( \\ ) কিবোর্ডের Enter বোতামের ওপরের দিকে থাকে।',
          simplerBn: 'পুরো লেখাটি মুছে লিখুন: C:\\Users\\Anika\\Documents — তারপর Enter।',
          successMessageBn: 'পথ লিখে পৌঁছে গেলেন!',
        },
        {
          id: 'w-search', osVariant: 'windows', titleBn: 'ফাইল খুঁজুন', target: 'fm-search', expectedAction: { type: 'type', target: 'fm-search', text: 'Birthdays', ignoreCase: true },
          explanationBn: 'ওপরের ডানের সার্চ বক্সে Birthdays লিখুন।',
          hintBn: 'ওপরের ডানের “Search Documents” লেখা বক্সে ক্লিক করে লিখুন।',
          successMessageBn: 'গভীরে থাকলেও পেয়ে গেলেন!',
        },
        // ---------- Mac ----------
        {
          id: 'm-docs-path', osVariant: 'mac', titleBn: 'ডকুমেন্টস ফোল্ডারে যান', target: 'fm-sidebar-Documents', expectedAction: { type: 'click', target: 'fm-sidebar-Documents' },
          explanationBn: 'বাঁ দিকের তালিকায় “Documents”-এ ক্লিক করুন।',
          hintBn: 'বাঁ পাশের “Favorites” তালিকায় Desktop-এর নিচেই Documents।',
        },
        {
          id: 'm-read-path', osVariant: 'mac', titleBn: 'পথ বার', target: 'fm-address', expectedAction: { type: 'continue' },
          explanationBn: 'নিচের পথ বারটি দেখুন: Macintosh HD › Users › anika › Documents। এটিই পথ।',
          hintBn: '“বুঝেছি, পরের ধাপ” বোতামে চাপুন। (আসল Mac-এ না দেখালে View → Show Path Bar।)',
        },
        {
          id: 'm-goto', osVariant: 'mac', titleBn: 'পথ লিখে যাওয়া: Go to Folder', target: 'fm-address', expectedAction: { type: 'keyCombo', keys: 'mod+shift+g' },
          explanationBn: 'Shift, Command আর G একসাথে চাপুন (Shift+Cmd+G)।',
          hintBn: 'Shift আর Command চেপে ধরে রেখে G চাপুন। না হলে “শর্টকাট প্যাড” ব্যবহার করুন।',
        },
        {
          id: 'm-type-path', osVariant: 'mac', titleBn: 'পথ লিখুন', target: 'goto-input', expectedAction: { type: 'navigate', path: '~/Documents' },
          explanationBn: 'ঘরে /Users/anika/Documents লিখে “Go” বোতামে ক্লিক করুন।',
          hintBn: 'স্ল্যাশ ( / ) কিবোর্ডে ? বোতামের সাথে থাকে।',
          simplerBn: 'পুরো লেখাটি মুছে লিখুন: /Users/anika/Documents — তারপর “Go” বোতামে ক্লিক করুন।',
          successMessageBn: 'পথ লিখে পৌঁছে গেলেন!',
        },
        {
          id: 'm-search', osVariant: 'mac', titleBn: 'ফাইল খুঁজুন', target: 'fm-search', expectedAction: { type: 'type', target: 'fm-search', text: 'Birthdays', ignoreCase: true },
          explanationBn: 'ওপরের ডানের সার্চ বক্সে Birthdays লিখুন।',
          hintBn: 'ওপরের ডানের “Search” লেখা বক্সে ক্লিক করে লিখুন।',
          successMessageBn: 'গভীরে থাকলেও পেয়ে গেলেন!',
        },
      ],
      quiz: [
        {
          id: 'q-abs-rel',
          type: 'multipleChoice',
          questionBn: 'কোনটি সম্পূর্ণ পথ (Absolute Path)?',
          options: [
            { id: 'a', textBn: 'C:\\Users\\Anika\\Documents\\Recipe.txt' },
            { id: 'b', textBn: 'Documents\\Family\\Birthdays.txt' },
            { id: 'c', textBn: '..\\Pictures\\Flower.png' },
            { id: 'd', textBn: 'Recipe.txt' },
          ],
          correct: ['a'],
          hintBn: 'সম্পূর্ণ পথ একদম শুরু থেকে লেখা — Windows-এ C: দিয়ে, Mac-এ / দিয়ে।',
          explanationBn: 'C: দিয়ে শুরু মানে সবার ওপর থেকে লেখা।',
        },
        {
          id: 'q-filename',
          type: 'clickTarget',
          questionBn: 'C:\\Users\\Anika\\Documents\\Family\\Birthdays.txt — এর কোন অংশটি ফাইলের নাম?',
          items: [
            { id: 'drive', labelBn: 'C:', icon: '💽' },
            { id: 'users', labelBn: 'Users', icon: '📁' },
            { id: 'family', labelBn: 'Family', icon: '📁' },
            { id: 'file', labelBn: 'Birthdays.txt', icon: '📄' },
          ],
          correct: 'file',
          hintBn: 'পথের একদম শেষ অংশ দেখুন — যার শেষে এক্সটেনশন আছে।',
          explanationBn: 'শেষ অংশ ফাইল, বাকি সব ফোল্ডার আর ড্রাইভ।',
        },
        {
          id: 'q-parent',
          type: 'multipleChoice',
          questionBn: 'পথে এক ধাপ ওপরের ফোল্ডার বোঝাতে কোন চিহ্ন বসে?',
          options: [
            { id: 'a', textBn: 'এক ডট ( . )' },
            { id: 'b', textBn: 'দুই ডট ( .. )' },
            { id: 'c', textBn: 'দুটি দাঁড়ি ( || )' },
          ],
          correct: ['b'],
          hintBn: 'দুটি ডট পাশাপাশি।',
          explanationBn: 'দুই ডট ( .. ) মানে এক ধাপ ওপরের ফোল্ডার।',
        },
      ],
      recapBn: ['পথ = ফাইলের ঠিকানা', 'Windows \\ আর Mac /', 'সম্পূর্ণ পথ শুরু থেকে'],
      freeTryBn: 'নিজের একটা ফাইলের পুরো পথ খাতায় লিখুন।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন — সবই নিরাপদ।',
    tasksBn: [
      'Documents, Downloads, Pictures আর Desktop-এ একবার করে ঢুকে দেখুন। শুধু দেখুন, কিছু সরাবেন না।',
      'Documents-এ MyWork নামে একটা ফোল্ডার বানান। ভেতরে একটা লেখার ফাইল রেখে নাম বদলে ideas.txt করুন।',
      'যেকোনো একটা ফাইলের পুরো পথ পড়ে খাতায় লিখুন: ড্রাইভ বা রুট, ফোল্ডার, ফাইল।',
    ],
    windowsTasksBn: ['ফাইল এক্সপ্লোরারে View → Show → File name extensions-এ টিক দিন। শুধু দেখুন, এক্সটেনশন বদলাবেন না।'],
    macTasksBn: ['Finder → Settings → Advanced-এ “Show all filename extensions” চালু করুন। শুধু দেখুন, এক্সটেনশন বদলাবেন না।'],
  },

  teacherTipBn:
    'পথ (path) বোঝা প্রোগ্রামিংয়ের জন্য খুবই গুরুত্বপূর্ণ — পরে টার্মিনাল আর কোড এডিটরে বারবার লাগবে। ঠিকানার উপমা (দেশ → জেলা → থানা → গ্রাম → বাড়ি) ধরে কয়েকবার বলুন। শুরুতেই আসল কম্পিউটারে এক্সটেনশন দেখা চালু করিয়ে দিন, আর বোঝান যে নাম বদলানোর সময় .txt, .py, .html যেন অক্ষত থাকে। অনুশীলনে আসল গুরুত্বপূর্ণ ফাইল কপি করে তার ওপর হাত পাকাতে বলুন, মূল ফাইলে নয়। নিজের কাজের ফোল্ডারের নাম ইংরেজিতে ও ফাঁকা জায়গা ছাড়া রাখার অভ্যাস এখনই করান। পাঠটি চারটি ছোট অংশে ভাগ করা — দরকার হলে একেক বসায় একটি অংশ করুন।',
}

export default lesson
