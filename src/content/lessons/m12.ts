import type { Lesson, Step } from '../../engine/types'

const DIFF = 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে'

/** The three mini-problems share the Documents-folder file that was “deleted by mistake”. */
const win: Step[] = [
  // ---- 1. frozen program ----
  {
    id: 'w-album-click', osVariant: 'windows', titleBn: 'প্রোগ্রামটি ব্যবহার করে দেখুন', target: 'stuckapp-album', expectedAction: { type: 'click', target: 'stuckapp-album' },
    explanationBn: 'পর্দায় “Photo Album” নামের একটি কাল্পনিক প্রোগ্রাম খোলা আছে। ভেতরের বেগুনি বোতাম “Open the holiday album”-এ একবার ক্লিক করুন।',
    hintBn: 'Photo Album উইন্ডোর ভেতরে বেগুনি রঙের বোতামটি।',
  },
  {
    id: 'w-ignored', osVariant: 'windows', titleBn: 'আবার ক্লিক করে দেখুন', target: 'stuckapp-content', expectedAction: { type: 'custom', event: 'stuckapp-ignored' },
    explanationBn: 'উইন্ডোর নামের পাশে “(Not Responding)” লেখা এসেছে, মানে প্রোগ্রামটি আটকে গেছে (ফ্রিজ, Freeze)। উইন্ডোর ভেতরে যেকোনো জায়গায় আরেকবার ক্লিক করে দেখুন, কিছু হয় কি না।',
    hintBn: 'উইন্ডোর সাদা অংশে ক্লিক করুন। কিছুই হবে না — ঠিক এটাই আমরা দেখতে চাই।',
    successMessageBn: 'দেখলেন? ক্লিকে কোনো সাড়া নেই। এখন বারবার ক্লিক করে লাভ নেই; অপেক্ষা করার পরেও আটকে থাকলে প্রোগ্রামটি জোর করে বন্ধ করতে হয়।',
  },
  {
    id: 'w-taskmgr', osVariant: 'windows', titleBn: 'Task Manager খুলুন: Ctrl+Shift+Esc', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'ctrl+shift+esc' },
    explanationBn: 'আটকে যাওয়া প্রোগ্রাম বন্ধ করার জায়গা Task Manager। শর্টকাট Ctrl + Shift + Esc। নিচের শর্টকাট প্যাডে একে একে “Ctrl”, “Shift” বেছে নিন, তারপর “Esc”-এ ক্লিক করুন। (আসল কম্পিউটারে তিনটি কী একসাথে চাপতে হয়।)',
    hintBn: 'প্যাডের ওপরের সারিতে “Ctrl” আর “Shift” বোতাম রঙিন করে নিন, তারপর নিচের সারি থেকে “Esc” চাপুন।',
    simplerBn: 'প্রথমে “Ctrl” বোতামে ক্লিক, তারপর “Shift” বোতামে ক্লিক, শেষে “Esc” বোতামে ক্লিক।',
    teacherTipBn: 'আসল কম্পিউটারে এটি সবচেয়ে ভরসার শর্টকাট, কারণ প্রোগ্রাম আটকালেও Task Manager খোলা যায়। কয়েকবার বাঁ হাতে অভ্যাস করান।',
  },
  {
    id: 'w-tm-select', osVariant: 'windows', titleBn: 'আটকে যাওয়া প্রোগ্রামটি বাছুন', target: 'taskmgr-row-stuckapp', expectedAction: { type: 'click', target: 'taskmgr-row-stuckapp' },
    explanationBn: 'তালিকায় চলমান প্রোগ্রামগুলো দেখা যাচ্ছে, পাশে কে কতটা CPU আর মেমোরি নিচ্ছে (এখানের সংখ্যাগুলো নকল)। “Photo Album” লাইনের পাশে লাল অক্ষরে “Not responding” লেখা আছে। সেই লাইনে একবার ক্লিক করে বেছে নিন।',
    hintBn: 'Apps অংশের নিচে “Photo Album” লেখা লাইনটিতে ক্লিক করুন।',
  },
  {
    id: 'w-tm-end', osVariant: 'windows', titleBn: 'End task চাপুন', target: 'taskmgr-end-task', expectedAction: { type: 'closeApp', app: 'stuckapp' },
    explanationBn: 'ওপরের ডান দিকের “End task” বোতামে ক্লিক করুন। প্রোগ্রামটি সঙ্গে সঙ্গে বন্ধ হয়ে যাবে। (মনে রাখবেন: সেভ না করা কাজ হারিয়ে যেতে পারে। তাই আগে অপেক্ষা করা জরুরি।)',
    hintBn: 'Task Manager-এর ডান ওপরের নীল বোতাম।',
    successMessageBn: 'প্রোগ্রাম বন্ধ হয়েছে। চাইলে এখন আবার খুলে নিতে পারেন — সাধারণত আর আটকাবে না।',
  },
  {
    id: 'w-tm-close', osVariant: 'windows', titleBn: 'Task Manager বন্ধ করুন', target: 'win-taskmgr-close', expectedAction: { type: 'closeApp', app: 'taskmgr' },
    explanationBn: 'কাজ শেষ, ডান ওপরের ✕ চেপে Task Manager বন্ধ করুন।',
    hintBn: 'Task Manager উইন্ডোর ডান ওপরের ✕।',
  },
  // ---- 2. deleted by mistake ----
  {
    id: 'w-open-bin', osVariant: 'windows', titleBn: 'পরের সমস্যা: ভুল করে মুছে ফেলা ফাইল', target: 'icon-Recycle Bin', expectedAction: { type: 'openApp', app: 'bin' },
    explanationBn: 'ধরুন, আপনি ভুল করে Important.txt নামের ফাইলটি মুছে ফেলেছেন। প্রথমে ঘাবড়াবেন না — মোছা ফাইল রিসাইকেল বিনে (Recycle Bin) থাকে। ডেস্কটপের Recycle Bin আইকনে ডাবল ক্লিক করে খুলুন।',
    hintBn: 'ডেস্কটপের বাঁ দিকে ঝুড়ির মতো আইকনটি। পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
    simplerBn: 'আইকনে একবার ক্লিক করে বেছে নিন, তারপর আবার তাড়াতাড়ি দুবার ক্লিক করুন। না হলে Start-এ নাম লিখেও খোঁজা যায়।',
  },
  {
    id: 'w-bin-select', osVariant: 'windows', titleBn: 'ফাইলটি বাছুন', target: 'fm-item-Important.txt', expectedAction: { type: 'click', target: 'fm-item-Important.txt' },
    explanationBn: 'রিসাইকেল বিনে Important.txt দেখা যাচ্ছে। সেটিতে একবার ক্লিক করে বেছে নিন।',
    hintBn: 'নতুন খোলা উইন্ডোর তালিকায় Important লেখা ফাইলটি।',
  },
  {
    id: 'w-restore', osVariant: 'windows', titleBn: 'Restore: ফিরিয়ে আনুন', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Important.txt' },
    explanationBn: 'ওপরের “Restore the selected items” বোতামে ক্লিক করুন। ফাইলটি আগের জায়গায় (Documents ফোল্ডারে) ফিরে যাবে।',
    hintBn: 'ওপরের সারিতে “Restore the selected items” বোতাম।',
    successMessageBn: 'ফাইল ফিরে এসেছে! (লেখা ভুল করে মুছলে অবশ্য Ctrl + Z দিয়েও আনডু করা যায়।)',
  },
  {
    id: 'w-bin-close', osVariant: 'windows', titleBn: 'রিসাইকেল বিন বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
    explanationBn: 'ডান ওপরের ✕ চেপে রিসাইকেল বিন বন্ধ করুন।',
    hintBn: 'রিসাইকেল বিন উইন্ডোর ডান ওপরের ✕।',
  },
  // ---- 3. no internet ----
  {
    id: 'w-open-browser', osVariant: 'windows', titleBn: 'পরের সমস্যা: ইন্টারনেট নেই', target: 'taskbar-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'এবার একটি ওয়েবসাইট দেখার চেষ্টা করি। নিচের টাস্কবারের ব্রাউজার (Web Browser) আইকনে ক্লিক করুন।',
    hintBn: 'টাস্কবারে গোল পৃথিবীর মতো আইকনটি।',
  },
  {
    id: 'w-type-address', osVariant: 'windows', titleBn: 'ঠিকানা লিখুন', target: 'browser-address', expectedAction: { type: 'type', target: 'browser-address', text: 'search.example', ignoreCase: true },
    explanationBn: 'ওপরের ঠিকানার ঘরে লিখুন: search.example (এখনও Enter চাপবেন না)।',
    hintBn: 'ব্রাউজারের ওপরের লম্বা ঘরটিতে ক্লিক করে টাইপ করুন: search.example',
  },
  {
    id: 'w-go', osVariant: 'windows', titleBn: 'Enter চাপুন', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://search.example/' },
    explanationBn: 'কিবোর্ডে Enter চাপুন। দেখুন, পাতা খুলল না — “No internet” লেখা এসেছে। এই বার্তাটি পড়ুন: এতে বলা আছে Wi-Fi চালু করতে হবে।',
    hintBn: 'ঘরটিতে লেখা থাকা অবস্থায় কিবোর্ডের Enter চাপুন।',
  },
  {
    id: 'w-open-qs', osVariant: 'windows', titleBn: 'দ্রুত সেটিংস (Quick settings) খুলুন', target: 'tray-wifi', expectedAction: { type: 'click', target: 'tray-wifi' },
    explanationBn: 'নিচের ডান কোণে ঘড়ির পাশের Wi-Fi আর আওয়াজের আইকনগুলোর ওপর ক্লিক করুন। Wi-Fi আইকনে ক্রস চিহ্ন দেখা যাচ্ছে — এটি বন্ধ।',
    hintBn: 'ঘড়ির বাঁ পাশের ছোট আইকনগুলোর সারি।',
    simplerBn: 'টাস্কবারের একদম ডান দিকে ঘড়ি; তার ঠিক বাঁ পাশে Wi-Fi, আওয়াজ আর ব্যাটারির আইকন। সেখানে ক্লিক করুন।',
  },
  {
    id: 'w-wifi-on', osVariant: 'windows', titleBn: 'Wi-Fi চালু করুন', target: 'qs-wifi', expectedAction: { type: 'selectOption', target: 'setting-wifiOn', value: 'true' },
    explanationBn: 'যে প্যানেলটি খুলল তাতে “Wi-Fi: Off” লেখা বোতামে ক্লিক করুন। বোতামটি নীল হয়ে “On” হবে।',
    hintBn: 'প্যানেলের ওপরের সারির প্রথম বোতাম, যাতে Wi-Fi: Off লেখা।',
  },
  {
    id: 'w-reload', osVariant: 'windows', titleBn: 'পাতাটি আবার লোড করুন', target: 'browser-reload', expectedAction: { type: 'click', target: 'browser-reload' },
    explanationBn: 'এবার ব্রাউজারের ঘূর্ণি-তীর (Reload) বোতামে ক্লিক করুন। এবার সার্চ পাতাটি খুলে যাবে।',
    hintBn: 'ঠিকানার ঘরের বাঁ পাশে গোল তীরের বোতামটি।',
    successMessageBn: 'পাতা খুলেছে — ইন্টারনেট ফিরে এসেছে!',
  },
  // ---- 4. no sound ----
  {
    id: 'w-open-qs2', osVariant: 'windows', titleBn: 'শেষ সমস্যা: আওয়াজ নেই', target: 'tray-volume', expectedAction: { type: 'click', target: 'tray-volume' },
    explanationBn: 'কম্পিউটারে কোনো আওয়াজ আসছে না — আওয়াজের আইকনে ক্রস চিহ্ন, মানে মিউট (Mute) করা। আবার ঘড়ির পাশের আইকনগুলোতে ক্লিক করুন।',
    hintBn: 'ঘড়ির বাঁ পাশের আইকনের সারি।',
  },
  {
    id: 'w-unmute', osVariant: 'windows', titleBn: 'মিউট বন্ধ করুন', target: 'qs-mute', expectedAction: { type: 'selectOption', target: 'setting-muted', value: 'false' },
    explanationBn: 'এবার “Mute: On” লেখা বোতামে ক্লিক করে মিউট বন্ধ করুন।',
    hintBn: 'প্যানেলের ওপরের সারির শেষ বোতাম, যাতে Mute: On লেখা।',
    successMessageBn: 'তিনটি সমস্যাই আপনি নিজে ঠিক করলেন! আটকে যাওয়া প্রোগ্রাম, মোছা ফাইল, ইন্টারনেট — সব। দারুণ।',
  },
]

const mac: Step[] = [
  {
    id: 'm-album-click', osVariant: 'mac', titleBn: 'প্রোগ্রামটি ব্যবহার করে দেখুন', target: 'stuckapp-album', expectedAction: { type: 'click', target: 'stuckapp-album' },
    explanationBn: 'পর্দায় “Photo Album” নামের একটি কাল্পনিক প্রোগ্রাম খোলা আছে। ভেতরের বেগুনি বোতাম “Open the holiday album”-এ একবার ক্লিক করুন।',
    hintBn: 'Photo Album উইন্ডোর ভেতরে বেগুনি রঙের বোতামটি।',
  },
  {
    id: 'm-ignored', osVariant: 'mac', titleBn: 'আবার ক্লিক করে দেখুন', target: 'stuckapp-content', expectedAction: { type: 'custom', event: 'stuckapp-ignored' },
    explanationBn: 'উইন্ডোর মাঝখানে একটি রঙিন চাকা ঘুরছে (Mac-এ একে ঘুরন্ত চাকা বা spinning wheel বলে), মানে প্রোগ্রামটি আটকে গেছে (ফ্রিজ, Freeze)। উইন্ডোর ভেতরে যেকোনো জায়গায় আরেকবার ক্লিক করে দেখুন, কিছু হয় কি না।',
    hintBn: 'উইন্ডোর সাদা অংশে ক্লিক করুন। কিছুই হবে না — ঠিক এটাই আমরা দেখতে চাই।',
    successMessageBn: 'দেখলেন? ক্লিকে কোনো সাড়া নেই। এখন বারবার ক্লিক করে লাভ নেই; অপেক্ষা করার পরেও আটকে থাকলে প্রোগ্রামটি জোর করে বন্ধ করতে হয়।',
  },
  {
    id: 'm-forcequit', osVariant: 'mac', titleBn: 'Force Quit খুলুন: Option+Command+Esc', target: 'shortcut-pad', expectedAction: { type: 'keyCombo', keys: 'alt+cmd+esc' },
    explanationBn: 'আটকে যাওয়া প্রোগ্রাম বন্ধ করার জানালা Force Quit Applications। শর্টকাট Option + Command + Esc। নিচের শর্টকাট প্যাডে একে একে “⌥ Option”, “⌘ Command” বেছে নিন, তারপর “Esc”-এ ক্লিক করুন। (আসল Mac-এ ওপরের বাঁ কোণের সিস্টেম মেনু থেকে “Force Quit…” বেছেও এটি খোলা যায়।)',
    hintBn: 'প্যাডের ওপরের সারিতে “Option” আর “Command” বোতাম রঙিন করে নিন, তারপর নিচের সারি থেকে “Esc” চাপুন।',
    simplerBn: 'প্রথমে “⌥ Option” বোতামে ক্লিক, তারপর “⌘ Command” বোতামে ক্লিক, শেষে “Esc” বোতামে ক্লিক।',
    teacherTipBn: 'সিমুলেশনের সিস্টেম মেনুতেও (বাঁ ওপরের গোল চিহ্ন) “Force Quit…” আছে — সেটিও একবার দেখিয়ে দিতে পারেন।',
  },
  {
    id: 'm-fq-select', osVariant: 'mac', titleBn: 'আটকে যাওয়া প্রোগ্রামটি বাছুন', target: 'forcequit-row-stuckapp', expectedAction: { type: 'click', target: 'forcequit-row-stuckapp' },
    explanationBn: 'জানালায় চলমান প্রোগ্রামের তালিকা। “Photo Album”-এর পাশে লাল অক্ষরে “(not responding)” লেখা আছে। সেই লাইনে একবার ক্লিক করে বেছে নিন।',
    hintBn: 'তালিকার “Photo Album” লেখা লাইনটি।',
  },
  {
    id: 'm-fq-button', osVariant: 'mac', titleBn: 'Force Quit বোতাম চাপুন', target: 'forcequit-button', expectedAction: { type: 'click', target: 'forcequit-button' },
    explanationBn: 'নিচের ডান দিকের নীল “Force Quit” বোতামে ক্লিক করুন।',
    hintBn: 'জানালার নিচের ডান কোণে নীল বোতাম।',
  },
  {
    id: 'm-fq-confirm', osVariant: 'mac', titleBn: 'নিশ্চিত করুন', target: 'forcequit-confirm', expectedAction: { type: 'closeApp', app: 'stuckapp' },
    explanationBn: 'কম্পিউটার জিজ্ঞেস করছে: জোর করে বন্ধ করবেন কি না, আর সেভ না করা কাজ হারাতে পারে। এখানে সমস্যা নেই, তাই “Force Quit” চাপুন। (আসল কাজে আগে নিশ্চিত হয়ে নিন — তাই এই জিজ্ঞাসা।)',
    hintBn: 'ছোট প্রশ্নের বাক্সের নীল বোতাম “Force Quit”।',
    successMessageBn: 'প্রোগ্রাম বন্ধ হয়েছে। চাইলে এখন আবার খুলে নিতে পারেন — সাধারণত আর আটকাবে না।',
  },
  {
    id: 'm-fq-close', osVariant: 'mac', titleBn: 'Force Quit জানালা বন্ধ করুন', target: 'win-forcequit-close', expectedAction: { type: 'closeApp', app: 'forcequit' },
    explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করে জানালাটি বন্ধ করুন।',
    hintBn: 'জানালার বাঁ ওপরের কোণে লাল গোল বোতাম।',
  },
  {
    id: 'm-open-trash', osVariant: 'mac', titleBn: 'পরের সমস্যা: ভুল করে মুছে ফেলা ফাইল', target: 'dock-trash', expectedAction: { type: 'openApp', app: 'bin' },
    explanationBn: 'ধরুন, আপনি ভুল করে Important.txt নামের ফাইলটি মুছে ফেলেছেন। ঘাবড়াবেন না — মোছা ফাইল ট্র্যাশে (Trash) থাকে। নিচের ডকের একদম ডান দিকের Trash আইকনে ক্লিক করে খুলুন।',
    hintBn: 'ডকের একদম ডান পাশে ঝুড়ির মতো আইকনটি।',
  },
  {
    id: 'm-trash-select', osVariant: 'mac', titleBn: 'ফাইলটি বাছুন', target: 'fm-item-Important.txt', expectedAction: { type: 'click', target: 'fm-item-Important.txt' },
    explanationBn: 'ট্র্যাশে Important.txt দেখা যাচ্ছে। সেটিতে একবার ক্লিক করে বেছে নিন।',
    hintBn: 'নতুন খোলা উইন্ডোর তালিকায় Important লেখা ফাইলটি।',
  },
  {
    id: 'm-restore', osVariant: 'mac', titleBn: 'Put Back: ফিরিয়ে আনুন', target: 'fm-restore', expectedAction: { type: 'restore', name: 'Important.txt' },
    explanationBn: 'ওপরের “Put Back” বোতামে ক্লিক করুন। ফাইলটি আগের জায়গায় (Documents ফোল্ডারে) ফিরে যাবে।',
    hintBn: 'ওপরের সারিতে “Put Back” লেখা বোতাম।',
    successMessageBn: 'ফাইল ফিরে এসেছে! (লেখা ভুল করে মুছলে অবশ্য Command + Z দিয়েও আনডু করা যায়।)',
  },
  {
    id: 'm-trash-close', osVariant: 'mac', titleBn: 'ট্র্যাশ বন্ধ করুন', target: 'win-bin-close', expectedAction: { type: 'closeApp', app: 'bin' },
    explanationBn: 'বাঁ ওপরের লাল বোতামে ক্লিক করে ট্র্যাশ বন্ধ করুন।',
    hintBn: 'ট্র্যাশ উইন্ডোর বাঁ ওপরের কোণে লাল বোতাম।',
  },
  {
    id: 'm-open-browser', osVariant: 'mac', titleBn: 'পরের সমস্যা: ইন্টারনেট নেই', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
    explanationBn: 'এবার একটি ওয়েবসাইট দেখার চেষ্টা করি। নিচের ডকের ব্রাউজার (Web Browser) আইকনে ক্লিক করুন।',
    hintBn: 'ডকে গোল পৃথিবীর মতো আইকনটি।',
  },
  {
    id: 'm-type-address', osVariant: 'mac', titleBn: 'ঠিকানা লিখুন', target: 'browser-address', expectedAction: { type: 'type', target: 'browser-address', text: 'search.example', ignoreCase: true },
    explanationBn: 'ওপরের ঠিকানার ঘরে লিখুন: search.example (এখনও Return চাপবেন না)।',
    hintBn: 'ব্রাউজারের ওপরের লম্বা ঘরটিতে ক্লিক করে টাইপ করুন: search.example',
  },
  {
    id: 'm-go', osVariant: 'mac', titleBn: 'Return চাপুন', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://search.example/' },
    explanationBn: 'কিবোর্ডে Return (Enter) চাপুন। দেখুন, পাতা খুলল না — “No internet” লেখা এসেছে। বার্তাটি পড়ুন: এতে বলা আছে Wi-Fi চালু করতে হবে।',
    hintBn: 'ঘরটিতে লেখা থাকা অবস্থায় কিবোর্ডের Return চাপুন।',
  },
  {
    id: 'm-open-cc', osVariant: 'mac', titleBn: 'কন্ট্রোল সেন্টার (Control Center) খুলুন', target: 'control-center', expectedAction: { type: 'click', target: 'control-center' },
    explanationBn: 'ওপরের মেনু বারের ডান দিকে ঘড়ির পাশে দুটি স্লাইডারের মতো আইকন — একে কন্ট্রোল সেন্টার বলে। এখানে ক্লিক করুন। Wi-Fi আইকনে কাটা চিহ্ন, মানে এটি বন্ধ।',
    hintBn: 'মেনু বারের ডান দিকে ঘড়ির একটু বাঁ পাশে।',
    simplerBn: 'পর্দার সবচেয়ে ওপরের সারিতে ডান দিকে ঘড়ি; তার বাঁ পাশে দুটি লাইন আর দুটি বিন্দুওয়ালা আইকন। সেখানে ক্লিক করুন।',
  },
  {
    id: 'm-wifi-on', osVariant: 'mac', titleBn: 'Wi-Fi চালু করুন', target: 'cc-wifi', expectedAction: { type: 'selectOption', target: 'setting-wifiOn', value: 'true' },
    explanationBn: 'যে প্যানেলটি খুলল তাতে “Wi-Fi: Off” লেখা বোতামে ক্লিক করুন। বোতামটি নীল হয়ে যাবে। ' + DIFF + '।',
    hintBn: 'প্যানেলের ওপরের সারির প্রথম বোতাম, যাতে Wi-Fi: Off লেখা।',
  },
  {
    id: 'm-reload', osVariant: 'mac', titleBn: 'পাতাটি আবার লোড করুন', target: 'browser-reload', expectedAction: { type: 'click', target: 'browser-reload' },
    explanationBn: 'এবার ব্রাউজারের ঘূর্ণি-তীর (Reload) বোতামে ক্লিক করুন। এবার সার্চ পাতাটি খুলে যাবে।',
    hintBn: 'ঠিকানার ঘরের বাঁ পাশে গোল তীরের বোতামটি।',
    successMessageBn: 'পাতা খুলেছে — ইন্টারনেট ফিরে এসেছে!',
  },
  {
    id: 'm-open-cc2', osVariant: 'mac', titleBn: 'শেষ সমস্যা: আওয়াজ নেই', target: 'menubar-volume', expectedAction: { type: 'click', target: 'menubar-volume' },
    explanationBn: 'কম্পিউটারে কোনো আওয়াজ আসছে না — মেনু বারের আওয়াজের আইকনে কাটা চিহ্ন, মানে আওয়াজ বন্ধ। সেই আইকনে ক্লিক করুন।',
    hintBn: 'মেনু বারের ডান দিকে স্পিকারের মতো আইকন।',
  },
  {
    id: 'm-unmute', osVariant: 'mac', titleBn: 'আওয়াজ বাড়ান', target: 'cc-volume', expectedAction: { type: 'selectOption', target: 'setting-muted', value: 'false' },
    explanationBn: 'প্যানেলে “Sound” স্লাইডারটি একদম বাঁ দিকে (০) আছে। গোল হাতলটি ধরে ডান দিকে খানিকটা টেনে আওয়াজ বাড়ান।',
    hintBn: 'স্লাইডারের গোল অংশে মাউস চেপে ধরে ডান দিকে সরান।',
    simplerBn: 'স্লাইডারের মাঝামাঝি কোথাও একবার ক্লিক করলেও চলবে।',
    successMessageBn: 'তিনটি সমস্যাই আপনি নিজে ঠিক করলেন! আটকে যাওয়া প্রোগ্রাম, মোছা ফাইল, ইন্টারনেট, আওয়াজ — সব। দারুণ।',
  },
]

const lesson = {
  module: 12,
  part: 1,
  id: 'm12',
  titleBn: 'সমস্যা হলে কী করবেন, উত্তর কোথায় খুঁজবেন',
  oneLineBn: 'প্রোগ্রাম আটকে গেলে, ইন্টারনেট বা আওয়াজ না থাকলে, বা ভুল করে ফাইল মুছলে — শান্তভাবে সমাধান করা আর এরর মেসেজ খুঁজে উত্তর পাওয়া।',
  minutes: 7,
  simulation: 'desktop',

  explanation: [
    { kind: 'p', textBn: 'কম্পিউটার ব্যবহার করতে গেলে মাঝে মাঝে সমস্যা হবেই — প্রোগ্রাম আটকে যায়, ইন্টারনেট চলে যায়, আওয়াজ আসে না। এটা সবার সাথেই হয়, এমনকি যারা অনেক বছর ধরে ব্যবহার করছেন তাদেরও। ভালো খবর: বেশির ভাগ সমস্যার সমাধান কয়েকটি ছোট ধাপেই হয়ে যায়, আর আপনার কোনো ক্ষতি হয় না।' },
    { kind: 'analogy', textBn: 'রিকশার চাকা আটকে গেলে আমরা প্রথমে চুপচাপ দেখি কী হয়েছে, তারপর সহজ উপায়টি (চাকা ঘুরিয়ে দেখা) চেষ্টা করি, তারপর দরকার হলে মিস্ত্রিকে ডাকি। কম্পিউটারের সমস্যাও একই ভাবে: আগে শান্ত থেকে দেখুন, তারপর সহজ উপায়, শেষে সাহায্য।' },
    { kind: 'widget', widget: 'troubleshoot-flow' },
    { kind: 'p', textBn: 'সাধারণ ক্রমটি মনে রাখলে বেশির ভাগ সময় কাজ হয়:' },
    {
      kind: 'list',
      itemsBn: [
        '১. শান্ত থাকুন আর আধ মিনিট অপেক্ষা করুন। অনেক সময় প্রোগ্রাম শুধু ধীর, আটকায়নি।',
        '২. অন্য খোলা প্রোগ্রামে কোনো কাজ থাকলে সেভ (Save) করে নিন।',
        '৩. আটকে যাওয়া প্রোগ্রামটি বন্ধ করুন — Windows-এ Task Manager (End task), Mac-এ Force Quit।',
        '৪. তাতেও না হলে কম্পিউটার রিস্টার্ট (Restart) করুন। অনেক ছোটখাটো সমস্যা এতেই চলে যায়।',
        '৫. তাও না হলে এরর মেসেজ খুঁজুন বা কারও সাহায্য নিন।',
      ],
    },
    { kind: 'p', textBn: 'আটকে যাওয়া (ফ্রিজ, Freeze) চিনবেন কীভাবে? Windows-এ উইন্ডোর নামের পাশে “(Not Responding)” লেখা আসে; Mac-এ ঘুরতে থাকা রঙিন চাকা দেখা যায়। ক্লিক করলে কিছুই হয় না। এই অবস্থায় বারবার ক্লিক করবেন না, আগে আধ মিনিট অপেক্ষা করুন।' },
    { kind: 'p', textBn: 'অপেক্ষার পরেও আটকে থাকলে প্রোগ্রামটিকে জোর করে বন্ধ করতে হয়। Windows-এ Ctrl + Shift + Esc চাপলে Task Manager খোলে — সেখানে চলমান প্রোগ্রামগুলোর তালিকা (প্রতিটি একটি প্রসেস, Process), তাদের CPU আর মেমোরির ব্যবহার দেখা যায়। আটকে যাওয়া প্রোগ্রামটি বেছে End task চাপুন। Mac-এ Option + Command + Esc চাপলে বা ওপরের বাঁ কোণের সিস্টেম মেনু থেকে Force Quit… বেছে নিলে Force Quit Applications জানালা খোলে; প্রোগ্রামটি বেছে Force Quit চাপুন।' },
    { kind: 'note', textBn: 'জোর করে বন্ধ করলে সেভ না করা কাজ হারিয়ে যেতে পারে। তাই আগে অপেক্ষা করুন, আর অভ্যাস করুন কাজের ফাঁকে ফাঁকে সেভ করার। আসল কম্পিউটারে ব্রাউজারের ভেতর থেকে এই শর্টকাট কখনো কখনো কাজ করে না; তখন সিমুলেশনের “শর্টকাট প্যাড” ব্যবহার করুন। ' + DIFF + '।' },
    { kind: 'p', textBn: 'রিস্টার্ট (Restart) মানে কম্পিউটার বন্ধ করে নিজে থেকে আবার চালু করা। মডিউল ১-এ পাওয়ার অপশন দেখেছিলেন: Windows-এ Start → Power → Restart, Mac-এ সিস্টেম মেনু → Restart…। রিস্টার্টের আগে খোলা কাজ সেভ করে নেবেন।' },
    { kind: 'p', textBn: 'ভুল করে কিছু করে ফেললে: লেখার ভুল হলে আনডু (Undo) — Windows-এ Ctrl + Z, Mac-এ Command + Z — সদ্য করা কাজ ফিরিয়ে দেয়। ভুল করে ফাইল মুছে ফেললে রিসাইকেল বিন (Windows) বা ট্র্যাশে (Mac) গিয়ে সেটি বেছে Restore / Put Back চাপুন। শুধু বিন খালি করে ফেললে আর ফেরত আসে না, তাই খালি করার আগে একটু ভাবুন।' },
    { kind: 'p', textBn: 'ইন্টারনেট না থাকলে ব্রাউজার “No internet” দেখায়। আগে দেখুন Wi-Fi চালু আছে কি না। আওয়াজ না এলে দেখুন মিউট (Mute) করা আছে কি না, বা স্পিকারের তার ঠিক আছে কি না। দুটোই সাধারণত নিচের ডান কোণ (Windows) বা ওপরের ডান কোণ (Mac)-এর আইকন থেকে এক ক্লিকে ঠিক করা যায়।' },
    { kind: 'p', textBn: 'আর যদি এরর মেসেজ আসে? তখন আসল কৌশল: মেসেজটি পড়ুন, কিন্তু OK চাপার আগে হুবহু কপি করে নিন (Ctrl/Cmd + C), তারপর সার্চ ইঞ্জিনে পেস্ট করে (Ctrl/Cmd + V) খুঁজুন। আপনার আগে হাজার মানুষ একই সমস্যায় পড়েছেন, আর অনেকেই উত্তর লিখে রেখেছেন। নিচে নিজে করে দেখুন:' },
    { kind: 'widget', widget: 'error-copy-search' },
    {
      kind: 'p',
      textBn: 'ফল পড়ার সময় সব উত্তর সমান ভরসাযোগ্য নয়। দেখুন:',
    },
    {
      kind: 'list',
      itemsBn: [
        'তারিখ: নতুন উত্তর ভালো। অনেক বছরের পুরোনো উত্তর এখনকার ক্ষেত্রে নাও খাটতে পারে।',
        'উৎস: অফিসিয়াল ডকুমেন্টেশন (প্রস্তুতকারকের নিজের সাহায্যের পাতা) সবচেয়ে ভরসাযোগ্য। ফোরামের (Forum) “Accepted answer” চিহ্নিত আর বেশি ভোট পাওয়া উত্তরও ভালো।',
        'সাবধানতা: যে উত্তর অচেনা কমান্ড চালাতে বা কোনো অজানা প্রোগ্রাম নামাতে বলে, যার মানে আপনি বোঝেন না — সেটি কখনো চালাবেন না। বিশ্বাসী কাউকে জিজ্ঞেস করুন।',
      ],
    },
    { kind: 'p', textBn: 'নিজে সমাধান না হলে অন্য কারও সাহায্য চাইতে হতে পারে। তখন চারটি কথা জানালে তিনি দ্রুত বুঝতে পারেন:' },
    {
      kind: 'list',
      itemsBn: [
        'আমি কী করছিলাম (কোন প্রোগ্রামে, কোন ধাপে)।',
        'আমি কী আশা করেছিলাম।',
        'আসলে কী ঘটল।',
        'এরর মেসেজটি হুবহু — কপি করে পাঠান, বা পর্দার ছবি তুলে (স্ক্রিনশট, Screenshot) পাঠান। Windows-এ Win + Shift + S, Mac-এ Shift + Command + 4 দিয়ে ছবি তোলা যায়।',
      ],
    },
    { kind: 'note', textBn: 'এখন সিমুলেশনে তিনটি ছোট সমস্যা একে একে সমাধান করবেন: আটকে যাওয়া প্রোগ্রাম, ইন্টারনেট না থাকা, আর আওয়াজ না থাকা। মাঝে ভুল করে মুছে ফেলা ফাইলও ফিরিয়ে আনবেন। এরর খুঁজে দেখার অনুশীলন (ব্রাউজারে) “নিজে নিজে চেষ্টা” অংশে পাবেন।' },
  ],

  steps: [...win, ...mac],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'রিসেট চেপে সিমুলেশন আবার শুরু করুন। এবার ব্রাউজারে (Wi-Fi চালু করে) সার্চ বক্সে এই লেখাটি পেস্ট করে খুঁজুন: Photo Album could not open "holiday.album". Error code PA-1042: the file is damaged or in a newer format. তারপর ফলাফলের চার নম্বরটি (ফোরামের পাতা) খুলে দেখুন কোন উত্তরটি নিরাপদ আর কোনটি নয়। চাইলে নোটপ্যাড/টেক্সটএডিটে কিছু লিখে আনডু (Ctrl/Cmd + Z) অভ্যাস করুন।',
    checklistBn: [
      'আটকে যাওয়া প্রোগ্রাম Task Manager (Windows) বা Force Quit (Mac) দিয়ে বন্ধ করেছি',
      'ভুল করে মুছে ফেলা ফাইল রিসাইকেল বিন বা ট্র্যাশ থেকে ফিরিয়ে এনেছি',
      'Wi-Fi বন্ধ থাকলে ব্রাউজারে কী দেখায় তা দেখেছি এবং চালু করেছি',
      'আওয়াজ আনমিউট করেছি',
      'এরর মেসেজ কপি করে সার্চ বক্সে পেস্ট করেছি',
      'ফোরামের পাতায় “Accepted answer” আর ঝুঁকিপূর্ণ কমান্ডওয়ালা উত্তর চিনতে পেরেছি',
      'সিস্টেম মেনু (Mac) বা Start-এর পাওয়ার বোতাম (Windows) থেকে Restart কোথায় আছে দেখেছি (সত্যি Restart করার দরকার নেই)',
    ],
  },

  quiz: [
    {
      id: 'q-order', type: 'ordering', questionBn: 'একটি প্রোগ্রাম আটকে গেলে (ফ্রিজ) কোন ক্রমে কী করা ভালো? ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'আধ মিনিট অপেক্ষা করি' },
        { id: '2', textBn: 'অন্য খোলা কাজ সেভ করি' },
        { id: '3', textBn: 'আটকে যাওয়া প্রোগ্রামটি বন্ধ করি (End task / Force Quit)' },
        { id: '4', textBn: 'দরকার হলে কম্পিউটার রিস্টার্ট করি' },
        { id: '5', textBn: 'তাও না হলে এরর খুঁজি বা সাহায্য চাই' },
      ],
      hintBn: 'আগে ধৈর্য, তারপর কাজ বাঁচানো, তারপর হালকা উপায় (প্রোগ্রাম বন্ধ), তারপর আরেকটু বড় উপায় (রিস্টার্ট), শেষে সাহায্য।',
      explanationBn: 'ঠিক! সবচেয়ে হালকা ও নিরাপদ উপায় আগে, বড় উপায় পরে। আর কাজ হারানোর আগে সেভ করা জরুরি।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'সমস্যার সাথে প্রথমে কী চেষ্টা করবেন তা মিলিয়ে দিন।',
      pairs: [
        { id: 'frozen', leftBn: 'প্রোগ্রাম আটকে গেছে', rightBn: 'Task Manager / Force Quit' },
        { id: 'net', leftBn: 'ইন্টারনেট নেই', rightBn: 'Wi-Fi চালু আছে কি না দেখা' },
        { id: 'sound', leftBn: 'আওয়াজ আসছে না', rightBn: 'মিউট বা ভলিউম দেখা' },
        { id: 'deleted', leftBn: 'ভুল করে ফাইল মুছেছি', rightBn: 'রিসাইকেল বিন / ট্র্যাশে দেখা' },
        { id: 'typo', leftBn: 'লেখার ভুল বদল করে ফেলেছি', rightBn: 'Ctrl/Cmd + Z (আনডু)' },
      ],
      hintBn: 'প্রতিটি সমস্যার সবচেয়ে সহজ ও সরাসরি সমাধান কোনটি, সেটি ভাবুন। যেমন, ফাইল মোছা মানে ঝুড়ি।',
      explanationBn: 'সবগুলো মিলেছে! সমস্যার ধরন দেখে আগে সবচেয়ে সহজ উপায়টি চেষ্টা করুন।',
    },
    {
      id: 'q-trust', type: 'clickTarget', questionBn: 'এরর খুঁজে কয়েকটি ফল পেয়েছেন। কোনটি সবচেয়ে ভরসাযোগ্য?',
      items: [
        { id: 'old', labelBn: '১৩ বছর আগের ব্লগ: “এই কমান্ড চালালেই সব ঠিক”', icon: '📜' },
        { id: 'official', labelBn: 'প্রোগ্রামটির নিজস্ব সাহায্যের পাতা, ৩ সপ্তাহ আগে আপডেট করা', icon: '✅' },
        { id: 'popup', labelBn: 'পপ-আপ: “এখনই ফিক্স-টুল নামান!”', icon: '⚠️' },
        { id: 'chain', labelBn: 'অচেনা কারও পাঠানো বার্তার লিংক', icon: '🔗' },
      ],
      correct: 'official',
      hintBn: 'যারা প্রোগ্রামটি বানিয়েছে তাদের নিজেদের লেখা আর নতুন তারিখের পাতা খুঁজুন।',
      explanationBn: 'অফিসিয়াল ডকুমেন্টেশন সবচেয়ে ভরসাযোগ্য। পুরোনো, না বোঝা কমান্ড, পপ-আপ বা অচেনা লিংক এড়িয়ে চলুন।',
    },
    {
      id: 'q-copy', type: 'multipleChoice', questionBn: 'পর্দায় একটি এরর মেসেজ এসেছে। কোনটি করা সবচেয়ে বুদ্ধিমানের কাজ?',
      options: [
        { id: 'a', textBn: 'না পড়েই OK চেপে দেব' },
        { id: 'b', textBn: 'মেসেজটি হুবহু কপি করে সার্চ ইঞ্জিনে পেস্ট করে খুঁজব' },
        { id: 'c', textBn: 'কম্পিউটারের সব ফাইল মুছে নতুন করে শুরু করব' },
      ],
      correct: ['b'],
      hintBn: 'মেসেজেই সমস্যার নাম বা কোড লুকিয়ে থাকে। সেটি হারাবেন না।',
      explanationBn: 'হুবহু কপি করে খুঁজলে প্রায়ই অন্যদের লেখা সমাধান পাওয়া যায়। না পড়ে OK চাপা বা সব মুছে ফেলা ঠিক নয়।',
    },
    {
      id: 'q-helper', type: 'multipleChoice', multi: true, questionBn: 'কারও কাছে সাহায্য চাইতে গিয়ে কোন কোন কথা জানালে তিনি সহজে বুঝবেন? (একাধিক বেছে নিন)',
      options: [
        { id: 'did', textBn: 'আমি কী করছিলাম' },
        { id: 'expect', textBn: 'আমি কী আশা করেছিলাম আর আসলে কী ঘটল' },
        { id: 'err', textBn: 'এরর মেসেজটি হুবহু, বা স্ক্রিনশট' },
        { id: 'vague', textBn: 'শুধু “কম্পিউটার খারাপ হয়ে গেছে”' },
      ],
      correct: ['did', 'expect', 'err'],
      hintBn: 'যত নির্দিষ্ট করে বলবেন, তত সহজে সাহায্য পাবেন। “খারাপ হয়ে গেছে” খুব অস্পষ্ট।',
      explanationBn: 'ঠিক! কী করছিলেন, কী আশা করেছিলেন, কী ঘটল, আর হুবহু এরর — এই চারটি জানালে সাহায্যকারী দ্রুত সমস্যা ধরতে পারেন।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'সমস্যায় ঘাবড়াবেন না। ক্রম: অপেক্ষা → সেভ → আটকে যাওয়া প্রোগ্রাম বন্ধ → রিস্টার্ট → খোঁজা বা সাহায্য চাওয়া।',
      'আটকে যাওয়া প্রোগ্রাম: Windows-এ Ctrl + Shift + Esc → Task Manager → প্রোগ্রাম বেছে End task। Mac-এ Option + Command + Esc (বা সিস্টেম মেনু → Force Quit…) → প্রোগ্রাম বেছে Force Quit।',
      'জোর করে বন্ধ করলে সেভ না করা কাজ হারাতে পারে, তাই আগে আধ মিনিট অপেক্ষা করুন।',
      'ভুল ফেরাতে: Ctrl/Cmd + Z (আনডু)। ভুল করে মোছা ফাইল রিসাইকেল বিন বা ট্র্যাশ থেকে ফেরানো যায়।',
      'ইন্টারনেট না থাকলে আগে Wi-Fi, আওয়াজ না এলে আগে মিউট দেখুন। দুটোই কয়েক ক্লিকে ঠিক হয়।',
      'এরর মেসেজ হুবহু কপি (Ctrl/Cmd + C) করে সার্চ ইঞ্জিনে পেস্ট (Ctrl/Cmd + V) করে খুঁজুন। নতুন তারিখ, অফিসিয়াল পাতা আর “Accepted answer” দেখুন।',
      'না বুঝে কোনো কমান্ড চালাবেন না, অচেনা কিছু নামাবেন না।',
      'সাহায্য চাইলে জানান: কী করছিলেন, কী আশা করেছিলেন, কী ঘটল, আর হুবহু এরর (বা স্ক্রিনশট)।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো নিরাপদ, কিছুই বন্ধ বা মোছা লাগবে না।',
    tasksBn: [
      'ব্রাউজার খুলে সার্চ বক্সে যেকোনো একটি ছোট প্রশ্ন (যেমন “how to take a screenshot on my computer”) লিখে খুঁজুন। ফলগুলোর তারিখ আর উৎস দেখে কোনটি ভরসাযোগ্য তা ঠিক করুন।',
      'নোটপ্যাড বা টেক্সটএডিটে কয়েকটি শব্দ লিখুন, তারপর Ctrl/Cmd + Z চেপে আনডু করে দেখুন। আবার লিখে নিন।',
      'ঘড়ির পাশের (Windows) বা মেনু বারের (Mac) Wi-Fi আর আওয়াজের আইকনে ক্লিক করে প্যানেলটি শুধু দেখুন; কোনো সেটিং বদলাবেন না।',
    ],
    windowsTasksBn: ['Ctrl + Shift + Esc চেপে Task Manager খুলে শুধু দেখুন কোন প্রোগ্রাম কতটা CPU আর মেমোরি নিচ্ছে। কিছু বন্ধ (End task) করবেন না, তারপর ✕ চেপে বন্ধ করে দিন।'],
    macTasksBn: ['Option + Command + Esc চেপে Force Quit জানালা খুলে শুধু দেখুন কী কী প্রোগ্রাম চলছে। কিছু বন্ধ (Force Quit) করবেন না, তারপর জানালাটি বন্ধ করে দিন।'],
  },

  teacherTipBn:
    'এই মডিউলে মনের ভয় কাটানোটাই আসল। শিক্ষার্থী যেন বোঝেন যে সমস্যা মানে তাঁর ভুল নয়, আর প্রায় সব সমস্যারই সহজ একটি প্রথম পদক্ষেপ আছে। সিমুলেশনে বারবার অনুশীলন করান। আসল কম্পিউটারে ইচ্ছে করে কিছু আটকানোর চেষ্টা করবেন না, তবে Task Manager বা Force Quit-এর জানালা একবার খুলে দেখান। “না বুঝে কমান্ড চালাবেন না” আর “সাহায্য চাইতে হলে হুবহু এরর জানান” — এই দুটি কথা বারবার মনে করিয়ে দিন।',

  glossaryIds: ['freeze', 'task-manager', 'force-quit', 'end-task', 'process', 'restart', 'undo-mistake', 'restore-deleted', 'recycle-bin', 'error-message', 'search-error', 'forum', 'official-docs', 'screenshot-help'],

  setup: {
    openApps: ['stuckapp'],
    settings: { wifiOn: false, muted: true },
    vfs: (vfs) => {
      // The “deleted by mistake” scenario: Important.txt is already in the Recycle Bin / Trash.
      const docs = vfs.child(vfs.home, 'Documents')
      if (!docs) return
      const f = vfs.createFile(docs, 'Important.txt', 'Remember to pay the electricity bill on Sunday.')
      vfs.delete(f)
    },
  },
} satisfies Lesson

export default lesson
