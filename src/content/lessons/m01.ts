import type { LegacyLesson as Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 1,
  part: 1,
  id: 'm01',
  titleBn: 'কম্পিউটারের সাথে পরিচয়',
  oneLineBn: 'কম্পিউটারের অংশগুলো চিনি, টাচপ্যাড চালানো শিখি, আর কম্পিউটার নিরাপদে চালু-বন্ধ করি।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['computer', 'hardware', 'monitor', 'keyboard', 'mouse', 'touchpad', 'cpu', 'ram', 'battery', 'charger', 'usb-port', 'wifi', 'shut-down', 'restart', 'sleep', 'power-button', 'scroll', 'pinch', 'gesture'],

  explanation: [
    { kind: 'p', textBn: 'স্বাগতম! কম্পিউটার শেখার প্রথম পাঠে আমরা কম্পিউটারের সাথে পরিচিত হব। এটি এমন একটি যন্ত্র, যা আমাদের নির্দেশ মেনে লেখা, হিসাব, ছবি, গান, ভিডিও, চিঠি পাঠানো — আরও অনেক কাজ করে দেয়।' },
    { kind: 'analogy', textBn: 'কম্পিউটারকে ভাবুন একজন খুব পরিশ্রমী কিন্তু সরল সহকারীর মতো। সে নিজে থেকে কিছু ভাবে না; আপনি যা বলবেন ঠিক তা-ই করবে। বলার উপায় হলো কিবোর্ড, মাউস বা টাচপ্যাড, আর উত্তর সে দেখায় পর্দায়।' },
    { kind: 'p', textBn: 'কম্পিউটারের যেসব অংশ হাতে ছোঁয়া যায়, সেগুলোকে বলে হার্ডওয়্যার (Hardware)। নিচের ল্যাপটপের ছবির যেকোনো অংশে ক্লিক করুন — সেটি কী কাজ করে তা পড়তে পারবেন। সবগুলো অংশ দেখে ফেললে নিচে ছোট একটি যাচাইও আছে।' },
    { kind: 'widget', widget: 'computer-parts' },
    { kind: 'note', textBn: 'ল্যাপটপে সব অংশ একটি শরীরেই থাকে। ডেস্কটপ কম্পিউটারে পর্দা, কিবোর্ড, মাউস আর সিপিইউ-র বাক্স আলাদা আলাদা থাকে। আপনার কম্পিউটারে অংশগুলো একটু আলাদা জায়গায় থাকতে পারে।' },
    { kind: 'p', textBn: 'আরেকটি কথা: ইন্টারনেট পেতে ওয়াই-ফাই (Wi‑Fi) লাগে। ওয়াই-ফাই মানে তার ছাড়া ইন্টারনেট। আর কম্পিউটারের ভেতরে র‍্যাম (RAM) নামে একটি অংশ আছে, যেটি এখন চলতে থাকা কাজ অল্প সময়ের জন্য মনে রাখে — এ নিয়ে পরে আরও জানব, এখন নামটি শুনে রাখলেই চলবে।' },
    { kind: 'p', textBn: 'মাউস আর টাচপ্যাড একই কাজ করে — পর্দার তীর (Pointer) সরায় আর ক্লিক করে। তফাতটা হলো:' },
    {
      kind: 'list',
      itemsBn: [
        'মাউস (Mouse): হাতে ধরে টেবিলের ওপর নাড়াতে হয়। বাঁ আর ডান আলাদা বোতাম আছে, মাঝখানে চাকা (Wheel) থাকে।',
        'টাচপ্যাড (Touchpad): ল্যাপটপের মসৃণ জায়গা। আঙুল বুলিয়ে তীর সরান। আলাদা বোতামের বদলে আঙুলের টোকা বা চাপ দিয়ে ক্লিক হয়।',
        'টাচপ্যাডে আঙুলের নানা ভঙ্গি (Gesture) আছে। সেগুলো নিচের অনুশীলনে হাতে-কলমে করে দেখুন। মাউস থাকলে মাউস দিয়েও করা যায়।',
      ],
    },
    { kind: 'widget', widget: 'touchpad-practice' },
    { kind: 'note', textBn: 'Mac-এ “Tap to click” (টোকা দিয়ে ক্লিক) প্রথমে বন্ধ থাকতে পারে। তখন টাচপ্যাড একটু জোরে চেপে ক্লিক করতে হয়। চালু করতে System Settings → Trackpad-এ যান। Windows-এ এটি পাবেন Settings → Bluetooth & devices → Touchpad-এ। আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।' },
    { kind: 'p', textBn: 'এবার সবচেয়ে জরুরি অভ্যাস: কম্পিউটার ঠিকভাবে চালু ও বন্ধ করা। চালু করতে পাওয়ার বাটন একবার চাপুন। বন্ধ করার সময় মেনুতে তিনটি বিকল্প পাবেন:' },
    {
      kind: 'list',
      itemsBn: [
        'শাট ডাউন (Shut down): কম্পিউটার পুরোপুরি বন্ধ। দিনের কাজ শেষ হলে এটি করুন।',
        'রিস্টার্ট (Restart): বন্ধ করে সাথে সাথে আবার চালু। কম্পিউটার আটকে গেলে বা ধীর হলে এটি কাজে লাগে।',
        'স্লিপ (Sleep): কাজ খোলা রেখে কিছুক্ষণের বিশ্রাম। চা খেতে উঠলে এটি ভালো। ফিরে কিবোর্ডে যেকোনো কী চাপলে বা ক্লিক করলে আগের মতো পাবেন।',
      ],
    },
    { kind: 'analogy', textBn: 'ভাতের হাঁড়ি নামানোর আগে যেমন চুলা নিভিয়ে নিতে হয়, কম্পিউটারও তেমনি বন্ধ করার আগে সবকিছু গুছিয়ে নিতে চায়। তাই আগে কাজ সেভ (Save) করুন, প্রোগ্রাম বন্ধ করুন, তারপর মেনু থেকে শাট ডাউন করুন।' },
    { kind: 'note', textBn: 'কখনোই সরাসরি প্লাগ খুলে বা পাওয়ার বাটন চেপে ধরে কম্পিউটার বন্ধ করবেন না। এতে সেভ না করা কাজ হারিয়ে যেতে পারে, এমনকি ফাইলও নষ্ট হতে পারে। শুধু কম্পিউটার একদমই সাড়া না দিলে, শেষ উপায় হিসেবে পাওয়ার বাটন কয়েক সেকেন্ড চেপে ধরা যায়।' },
  ],

  steps: [
    // ---------- Windows ----------
    {
      id: 'w-rightclick', osVariant: 'windows', titleBn: 'রাইট ক্লিক (দুই আঙুলে ট্যাপ)', target: 'desktop', expectedAction: { type: 'rightClick', target: 'desktop' },
      explanationBn: 'আগে টাচপ্যাডের একটি কাজ করি। ডেস্কটপের ফাঁকা জায়গায় রাইট ক্লিক করুন — টাচপ্যাডে একসাথে দুই আঙুলে একবার ট্যাপ করুন (মাউস হলে ডান বোতাম চাপুন)। একটি মেনু আসবে।',
      hintBn: 'আইকনগুলো থেকে দূরে, ফাঁকা জায়গায় দুই আঙুলে একবার টোকা দিন।',
      simplerBn: 'তর্জনী আর মধ্যমা — পাশাপাশি দুটি আঙুল একসাথে টাচপ্যাডে ছুঁয়েই তুলে নিন, যেন দুটি আঙুল দিয়ে টেবিলে টোকা দিচ্ছেন।',
    },
    {
      id: 'w-menu-close', osVariant: 'windows', titleBn: 'ফাঁকা জায়গায় ক্লিক করে মেনু বন্ধ', target: 'desktop', expectedAction: { type: 'click', target: 'desktop' },
      explanationBn: 'মেনুতে কিছু বেছে নেওয়ার দরকার নেই। ডেস্কটপের অন্য কোনো ফাঁকা জায়গায় একবার ক্লিক করলেই মেনু বন্ধ হয়ে যাবে।',
      hintBn: 'মেনু থেকে একটু দূরে ফাঁকা জায়গায় একবার ক্লিক করুন।',
    },
    {
      id: 'w-dblclick', osVariant: 'windows', titleBn: 'ডাবল ট্যাপ: খোলা', target: 'icon-Welcome.txt', expectedAction: { type: 'doubleClick', target: 'icon-Welcome.txt' },
      explanationBn: '“Welcome.txt” আইকনের ওপর ডাবল ক্লিক করুন — টাচপ্যাডে পরপর দুবার তাড়াতাড়ি ট্যাপ। ফাইলটি খুলে যাবে।',
      hintBn: 'দুবার ট্যাপের মাঝে বেশি সময় নেবেন না। চটপট “টুক-টুক”।',
      simplerBn: 'তীর আইকনের ওপর রাখুন, তারপর এক আঙুলে টাচপ্যাডে দুবার দ্রুত টোকা দিন। প্রথমবারে না হলে আবার চেষ্টা করুন।',
    },
    {
      id: 'w-close', osVariant: 'windows', titleBn: 'উইন্ডো বন্ধ করা', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
      explanationBn: 'ডান ওপরের কোণের ✕ বোতামে ক্লিক করে খোলা উইন্ডোটি বন্ধ করুন।',
      hintBn: 'উইন্ডোর একদম ডান ওপরের কোণের ✕ চিহ্ন।',
    },
    {
      id: 'w-start-1', osVariant: 'windows', titleBn: 'এবার স্লিপ: স্টার্ট বোতাম', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'কম্পিউটার বন্ধ বা স্লিপ করার মেনু পাবেন স্টার্ট (Start) মেনুতে। নিচের স্টার্ট বোতামে ক্লিক করুন।',
      hintBn: 'টাস্কবারের মাঝের দিকের চারকোনা আইকন।',
    },
    {
      id: 'w-power-1', osVariant: 'windows', titleBn: 'পাওয়ার বোতাম', target: 'start-power', expectedAction: { type: 'click', target: 'start-power' },
      explanationBn: 'স্টার্ট মেনুর নিচের ডান কোণে একটি গোল পাওয়ার চিহ্ন (⏻) আছে। সেটিতে ক্লিক করুন। তিনটি বিকল্প দেখবেন।',
      hintBn: 'স্টার্ট মেনুর একদম নিচে ডান দিকে, একটি গোল চিহ্ন যার ওপরে ছোট দাগ।',
    },
    {
      id: 'w-sleep', osVariant: 'windows', titleBn: 'Sleep বেছে নিন', target: 'power-sleep', expectedAction: { type: 'custom', event: 'power-sleep' },
      explanationBn: '“Sleep”-এ ক্লিক করুন। কম্পিউটার বিশ্রামে যাবে, পর্দা অন্ধকার হবে। কাজ কিন্তু হারাবে না।',
      hintBn: 'তালিকার “Sleep” লেখাটি।',
    },
    {
      id: 'w-wake', osVariant: 'windows', titleBn: 'কম্পিউটারকে জাগানো', target: 'wake-button', expectedAction: { type: 'custom', event: 'power-wake' },
      explanationBn: 'এখন পর্দা অন্ধকার। আসল কম্পিউটারে কিবোর্ডের যেকোনো কী চাপলে বা টাচপ্যাডে ক্লিক করলে সে জেগে ওঠে। এখানে “Press any key / click to wake” বোতামে ক্লিক করুন।',
      hintBn: 'অন্ধকার পর্দার মাঝখানের বোতামটি।',
    },
    {
      id: 'w-start-2', osVariant: 'windows', titleBn: 'এবার রিস্টার্ট: স্টার্ট বোতাম', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'আবার স্টার্ট বোতামে ক্লিক করুন। এবার রিস্টার্ট করা শিখব।',
      hintBn: 'টাস্কবারের স্টার্ট বোতাম।',
    },
    {
      id: 'w-power-2', osVariant: 'windows', titleBn: 'পাওয়ার বোতাম', target: 'start-power', expectedAction: { type: 'click', target: 'start-power' },
      explanationBn: 'স্টার্ট মেনুর নিচের ডানের পাওয়ার চিহ্নে ক্লিক করুন।',
      hintBn: 'স্টার্ট মেনুর নিচে ডান দিকে।',
    },
    {
      id: 'w-restart', osVariant: 'windows', titleBn: 'Restart বেছে নিন', target: 'power-restart', expectedAction: { type: 'custom', event: 'power-restart' },
      explanationBn: '“Restart”-এ ক্লিক করুন। পর্দা এক মুহূর্ত কালো হয়ে আবার ফিরে আসবে — একটু অপেক্ষা করুন।',
      hintBn: 'তালিকার “Restart” লেখাটি।',
    },
    {
      id: 'w-start-3', osVariant: 'windows', titleBn: 'এবার শাট ডাউন: স্টার্ট বোতাম', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'কম্পিউটার আবার চালু হয়েছে। এবার সবচেয়ে গুরুত্বপূর্ণটি — শাট ডাউন। আগে স্টার্ট বোতামে ক্লিক করুন। (আসল কম্পিউটারে এর আগে কাজ সেভ আর প্রোগ্রাম বন্ধ করতে ভুলবেন না।)',
      hintBn: 'টাস্কবারের স্টার্ট বোতাম। রিস্টার্ট শেষ হওয়া পর্যন্ত একটু অপেক্ষা করুন।',
    },
    {
      id: 'w-power-3', osVariant: 'windows', titleBn: 'পাওয়ার বোতাম', target: 'start-power', expectedAction: { type: 'click', target: 'start-power' },
      explanationBn: 'পাওয়ার চিহ্নে ক্লিক করুন।',
      hintBn: 'স্টার্ট মেনুর নিচে ডান দিকে।',
    },
    {
      id: 'w-shutdown', osVariant: 'windows', titleBn: 'Shut down বেছে নিন', target: 'power-shut-down', expectedAction: { type: 'custom', event: 'power-shutdown' },
      explanationBn: '“Shut down”-এ ক্লিক করুন। পর্দা পুরোপুরি কালো হয়ে গেলে বুঝবেন কম্পিউটার বন্ধ।',
      hintBn: 'তালিকার মাঝের লাইন — “Shut down”।',
    },
    {
      id: 'w-power-on', osVariant: 'windows', titleBn: 'আবার চালু করা', target: 'power-on-button', expectedAction: { type: 'custom', event: 'power-on' },
      explanationBn: 'আসল কম্পিউটারে এখন পাওয়ার বাটন একবার চাপলে সে চালু হয়। এখানে “Press to turn on” বোতামে ক্লিক করুন।',
      hintBn: 'কালো পর্দার মাঝখানের বোতামটি।',
    },

    // ---------- Mac ----------
    {
      id: 'm-rightclick', osVariant: 'mac', titleBn: 'রাইট ক্লিক (দুই আঙুলে ট্যাপ)', target: 'desktop', expectedAction: { type: 'rightClick', target: 'desktop' },
      explanationBn: 'আগে টাচপ্যাডের একটি কাজ করি। ডেস্কটপের ফাঁকা জায়গায় রাইট ক্লিক করুন — টাচপ্যাডে একসাথে দুই আঙুলে একবার ট্যাপ করুন (মাউস হলে ডান বোতাম চাপুন)। একটি মেনু আসবে।',
      hintBn: 'আইকনগুলো থেকে দূরে, ফাঁকা জায়গায় দুই আঙুলে একবার টোকা দিন।',
      simplerBn: 'তর্জনী আর মধ্যমা — পাশাপাশি দুটি আঙুল একসাথে টাচপ্যাডে ছুঁয়েই তুলে নিন। এটি কাজ না করলে System Settings → Trackpad-এ Secondary click দেখুন।',
    },
    {
      id: 'm-menu-close', osVariant: 'mac', titleBn: 'ফাঁকা জায়গায় ক্লিক করে মেনু বন্ধ', target: 'desktop', expectedAction: { type: 'click', target: 'desktop' },
      explanationBn: 'মেনুতে কিছু বেছে নেওয়ার দরকার নেই। ডেস্কটপের অন্য কোনো ফাঁকা জায়গায় একবার ক্লিক করলেই মেনু বন্ধ হয়ে যাবে।',
      hintBn: 'মেনু থেকে একটু দূরে ফাঁকা জায়গায় একবার ক্লিক করুন।',
    },
    {
      id: 'm-dblclick', osVariant: 'mac', titleBn: 'ডাবল ট্যাপ: খোলা', target: 'icon-Welcome.txt', expectedAction: { type: 'doubleClick', target: 'icon-Welcome.txt' },
      explanationBn: '“Welcome.txt” আইকনের ওপর ডাবল ক্লিক করুন — টাচপ্যাডে পরপর দুবার তাড়াতাড়ি ট্যাপ বা চাপ। ফাইলটি খুলে যাবে।',
      hintBn: 'দুবারের মাঝে বেশি সময় নেবেন না। চটপট “টুক-টুক”।',
      simplerBn: 'তীর আইকনের ওপর রাখুন, তারপর এক আঙুলে টাচপ্যাডে দুবার দ্রুত টোকা বা চাপ দিন। প্রথমবারে না হলে আবার চেষ্টা করুন।',
    },
    {
      id: 'm-close', osVariant: 'mac', titleBn: 'উইন্ডো বন্ধ করা', target: 'win-editor-close', expectedAction: { type: 'click', target: 'win-editor-close' },
      explanationBn: 'বাঁ ওপরের কোণের লাল বোতামে ক্লিক করে খোলা উইন্ডোটি বন্ধ করুন।',
      hintBn: 'উইন্ডোর বাঁ ওপরের তিনটি গোল বিন্দুর মধ্যে লালটি।',
    },
    {
      id: 'm-menu-1', osVariant: 'mac', titleBn: 'এবার স্লিপ: সিস্টেম মেনু', target: 'menu-system', expectedAction: { type: 'click', target: 'menu-system' },
      explanationBn: 'Mac-এ কম্পিউটার বন্ধ বা স্লিপ করার মেনু একদম ওপরের বাঁ কোণের প্রথম চিহ্নে থাকে। সেখানে ক্লিক করুন।',
      hintBn: 'পর্দার একদম ওপরের বাঁ কোণে, মেনু বারের প্রথম চিহ্নটি।',
    },
    {
      id: 'm-sleep', osVariant: 'mac', titleBn: 'Sleep বেছে নিন', target: 'menu-item-sleep', expectedAction: { type: 'custom', event: 'power-sleep' },
      explanationBn: '“Sleep”-এ ক্লিক করুন। কম্পিউটার বিশ্রামে যাবে, পর্দা অন্ধকার হবে। কাজ কিন্তু হারাবে না।',
      hintBn: 'মেনুর “Sleep” লেখাটি।',
    },
    {
      id: 'm-wake', osVariant: 'mac', titleBn: 'কম্পিউটারকে জাগানো', target: 'wake-button', expectedAction: { type: 'custom', event: 'power-wake' },
      explanationBn: 'এখন পর্দা অন্ধকার। আসল কম্পিউটারে কিবোর্ডের যেকোনো কী চাপলে বা টাচপ্যাডে ক্লিক করলে সে জেগে ওঠে। এখানে “Press any key / click to wake” বোতামে ক্লিক করুন।',
      hintBn: 'অন্ধকার পর্দার মাঝখানের বোতামটি।',
    },
    {
      id: 'm-menu-2', osVariant: 'mac', titleBn: 'এবার রিস্টার্ট: সিস্টেম মেনু', target: 'menu-system', expectedAction: { type: 'click', target: 'menu-system' },
      explanationBn: 'আবার ওপরের বাঁ কোণের প্রথম চিহ্নে ক্লিক করুন।',
      hintBn: 'মেনু বারের একদম বাঁ দিকের চিহ্ন।',
    },
    {
      id: 'm-restart', osVariant: 'mac', titleBn: 'Restart বেছে নিন', target: 'menu-item-restart', expectedAction: { type: 'custom', event: 'power-restart' },
      explanationBn: '“Restart…”-এ ক্লিক করুন। পর্দা এক মুহূর্ত কালো হয়ে আবার ফিরে আসবে — একটু অপেক্ষা করুন।',
      hintBn: 'মেনুর “Restart…” লেখাটি।',
    },
    {
      id: 'm-menu-3', osVariant: 'mac', titleBn: 'এবার শাট ডাউন: সিস্টেম মেনু', target: 'menu-system', expectedAction: { type: 'click', target: 'menu-system' },
      explanationBn: 'কম্পিউটার আবার চালু হয়েছে। এবার সবচেয়ে গুরুত্বপূর্ণটি — শাট ডাউন। ওপরের বাঁ কোণের চিহ্নে ক্লিক করুন। (আসল কম্পিউটারে এর আগে কাজ সেভ আর প্রোগ্রাম বন্ধ করতে ভুলবেন না।)',
      hintBn: 'মেনু বারের একদম বাঁ দিকের চিহ্ন। রিস্টার্ট শেষ হওয়া পর্যন্ত একটু অপেক্ষা করুন।',
    },
    {
      id: 'm-shutdown', osVariant: 'mac', titleBn: 'Shut Down বেছে নিন', target: 'menu-item-shutdown', expectedAction: { type: 'custom', event: 'power-shutdown' },
      explanationBn: '“Shut Down…”-এ ক্লিক করুন। পর্দা পুরোপুরি কালো হয়ে গেলে বুঝবেন কম্পিউটার বন্ধ। (আসল Mac-এ একটি নিশ্চিত করার বাক্স আসতে পারে।)',
      hintBn: 'মেনুর “Shut Down…” লেখাটি।',
    },
    {
      id: 'm-power-on', osVariant: 'mac', titleBn: 'আবার চালু করা', target: 'power-on-button', expectedAction: { type: 'custom', event: 'power-on' },
      explanationBn: 'আসল কম্পিউটারে এখন পাওয়ার বাটন একবার চাপলে সে চালু হয়। এখানে গোল পাওয়ার বোতামে ক্লিক করুন।',
      hintBn: 'কালো পর্দার মাঝখানের গোল বোতামটি।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'এখানে কেউ বলে দেবে না — যা খুশি করে দেখুন। ভুল হলেও কোনো ক্ষতি নেই। এটি অনুশীলনের কম্পিউটার, আসল কম্পিউটারের কিছুই নষ্ট হবে না। পাঠের ওপরের টাচপ্যাড অনুশীলন আর কম্পিউটারের অংশের ছবিও আবার দেখে নিতে পারেন।',
    checklistBn: [
      'ডেস্কটপে রাইট ক্লিক করে মেনু দেখেছি',
      'একটি আইকনে ডাবল ক্লিক করে খুলেছি আর বন্ধ করেছি',
      'কম্পিউটারকে Sleep-এ পাঠিয়ে আবার জাগিয়েছি',
      'Restart করে অপেক্ষা করেছি',
      'Shut down করে আবার চালু করেছি',
    ],
  },

  quiz: [
    {
      id: 'q-keyboard', type: 'clickTarget', questionBn: 'যে অংশ দিয়ে অক্ষর আর সংখ্যা লেখা হয়, সেটি কোনটি?',
      items: [
        { id: 'keyboard', labelBn: 'কিবোর্ড', icon: '⌨️' },
        { id: 'mouse', labelBn: 'মাউস', icon: '🖱️' },
        { id: 'monitor', labelBn: 'মনিটর', icon: '🖥️' },
        { id: 'charger', labelBn: 'চার্জার', icon: '🔌' },
      ],
      correct: 'keyboard',
      hintBn: 'অনেকগুলো ছোট কী দিয়ে সাজানো যে জিনিসটিতে আঙুল দিয়ে চাপ দেন।',
      explanationBn: 'ঠিক! কিবোর্ড দিয়ে আমরা কম্পিউটারকে লিখে জানাই।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'কম্পিউটার নিরাপদে বন্ধ করার ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'কাজ সেভ (Save) করি' },
        { id: '2', textBn: 'খোলা প্রোগ্রামগুলো বন্ধ করি' },
        { id: '3', textBn: 'স্টার্ট বা সিস্টেম মেনু খুলি' },
        { id: '4', textBn: 'Shut down বেছে নিই' },
        { id: '5', textBn: 'পর্দা পুরো কালো হওয়া পর্যন্ত অপেক্ষা করি' },
      ],
      hintBn: 'আগে নিজের কাজ নিরাপদ করুন, তারপর মেনুতে যান, আর শেষে অপেক্ষা করুন।',
      explanationBn: 'চমৎকার! আগে কাজ গুছিয়ে নেওয়া, তারপর মেনু থেকে শাট ডাউন, আর শেষে অপেক্ষা — এটাই নিরাপদ ক্রম।',
    },
    {
      id: 'q-plug', type: 'multipleChoice', questionBn: 'পাওয়ার বাটন চেপে ধরে বা প্লাগ খুলে কম্পিউটার বন্ধ না করাই ভালো কেন?',
      options: [
        { id: 'a', textBn: 'সেভ না করা কাজ হারিয়ে যেতে পারে, ফাইলও নষ্ট হতে পারে' },
        { id: 'b', textBn: 'এতে কম্পিউটারের পর্দা ছোট হয়ে যায়' },
        { id: 'c', textBn: 'এতে ইন্টারনেটের গতি বেড়ে যায়' },
        { id: 'd', textBn: 'কোনো কারণ নেই, করলে ক্ষতি নেই' },
      ],
      correct: ['a'],
      hintBn: 'ভাবুন, লিখতে লিখতে কেউ হঠাৎ আপনার হাত থেকে খাতাটি টেনে নিলে কী হতো?',
      explanationBn: 'ঠিক। হঠাৎ বন্ধ করলে কম্পিউটার কাজ গুছিয়ে নেওয়ার সুযোগ পায় না। তাই নিয়ম মেনে মেনু থেকে Shut down করুন। কেবল একদম সাড়া না দিলে শেষ উপায় হিসেবে পাওয়ার বাটন ধরে রাখা যায়।',
    },
    {
      id: 'q-gestures', type: 'dragMatch', questionBn: 'টাচপ্যাডের কাজের সাথে তার ফল মিলিয়ে দিন।',
      pairs: [
        { id: 'tap', leftBn: 'এক আঙুলে একবার ট্যাপ', rightBn: 'ক্লিক' },
        { id: 'two', leftBn: 'দুই আঙুলে একবার ট্যাপ', rightBn: 'রাইট ক্লিক (মেনু)' },
        { id: 'scroll', leftBn: 'দুই আঙুলে ওপর-নিচ টানা', rightBn: 'স্ক্রল (পাতা সরানো)' },
        { id: 'pinch', leftBn: 'দুই আঙুল ফাঁক করা', rightBn: 'জুম ইন (বড় করা)' },
      ],
      hintBn: 'প্রতিটির সাথে নামের মিল খুঁজুন: এক আঙুল = সাধারণ ক্লিক, দুই আঙুল = বিশেষ কিছু।',
      explanationBn: 'চারটিই মিলেছে! এই ভঙ্গিগুলো একটু অভ্যাস করলেই হাতে বসে যাবে।',
    },
    {
      id: 'q-sleep', type: 'multipleChoice', questionBn: 'চা খেতে ১০ মিনিটের জন্য উঠবেন, ফিরে এসে আগের কাজেই থাকতে চান। কী করবেন?',
      options: [
        { id: 'a', textBn: 'Sleep (স্লিপ) করব' },
        { id: 'b', textBn: 'প্লাগ খুলে দেব' },
        { id: 'c', textBn: 'পর্দা ভেঙে দেব' },
      ],
      correct: ['a'],
      hintBn: 'কাজ খোলা রেখে অল্প সময়ের বিশ্রামের নামটি মনে করুন।',
      explanationBn: 'ঠিক! স্লিপে কাজ যেমন ছিল তেমনই থাকে। ফিরে এসে যেকোনো কী চাপলে বা ক্লিক করলে কম্পিউটার জেগে ওঠে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'কম্পিউটারের হাতে ছোঁয়া অংশগুলোর নাম হার্ডওয়্যার — পর্দা, কিবোর্ড, মাউস/টাচপ্যাড, ব্যাটারি, চার্জার, ইউএসবি পোর্ট।',
      'ওয়াই-ফাই মানে তার ছাড়া ইন্টারনেট। ব্যাটারি ল্যাপটপকে চার্জার ছাড়াও কিছুক্ষণ চালায়।',
      'টাচপ্যাড: এক আঙুলে ট্যাপ = ক্লিক, দুই আঙুলে ট্যাপ = রাইট ক্লিক, দুই আঙুলে ওপর-নিচ = স্ক্রল, দুই আঙুল ফাঁক-কাছে = জুম।',
      'বন্ধ করার ক্রম: কাজ সেভ → প্রোগ্রাম বন্ধ → মেনু (Windows: Start, Mac: ওপরের বাঁ চিহ্ন) → Shut down → পর্দা কালো হওয়া পর্যন্ত অপেক্ষা।',
      'Sleep = কিছুক্ষণের বিশ্রাম। Restart = বন্ধ করে আবার চালু। Shut down = পুরো বন্ধ।',
      'প্লাগ খুলে বা পাওয়ার বাটন চেপে ধরে বন্ধ করা নয় — শুধু কম্পিউটার একদম সাড়া না দিলে শেষ উপায়।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'নিজের কম্পিউটারের কিবোর্ড, মাউস বা টাচপ্যাড, পাওয়ার বাটন, চার্জারের জায়গা আর ইউএসবি পোর্ট আঙুল দিয়ে ছুঁয়ে খুঁজে বের করুন।',
      'টাচপ্যাডে এক আঙুলে ট্যাপ, দুই আঙুলে ট্যাপ আর দুই আঙুলে স্ক্রল — একে একে চেষ্টা করুন। কাজ না করলে টাচপ্যাডের সেটিংস দেখুন।',
      'আপনার কাজ শেষ হলে সেভ করে, প্রোগ্রাম বন্ধ করে, মেনু থেকে Shut down করুন। পর্দা পুরো কালো হলে তবেই সরে যান।',
    ],
    windowsTasksBn: ['Settings → Bluetooth & devices → Touchpad-এ গিয়ে ট্যাপ আর স্ক্রলের সেটিং দেখুন (কিছু বদলানোর দরকার নেই)।'],
    macTasksBn: ['System Settings → Trackpad-এ গিয়ে “Tap to click” চালু আছে কি না দেখুন (ইচ্ছে হলে চালু করুন)।'],
  },

  teacherTipBn:
    'টাচপ্যাড অনেকের কাছে প্রথমে কঠিন লাগে — দুই আঙুলের ট্যাপ আর স্ক্রল আলাদা করে অভ্যাস করান। সম্ভব হলে সাথে একটি মাউস রাখুন; আরাম পেলে সেটিই ব্যবহার করতে দিন। Mac-এ “Tap to click” চালু করে দিলে ক্লিক সহজ হয়। কম্পিউটার বন্ধ করার সঠিক ক্রম বারবার অনুশীলন করান, বিশেষ করে “প্লাগ খুলে বন্ধ করা নয়” কথাটি। “Sleep”-এর ধারণাটি অনেকে বন্ধ করা ভেবে গুলিয়ে ফেলেন — ফিরে এসে কাজ ঠিক আগের মতো পেলে পার্থক্যটি সহজে বোঝেন।',
}

export default lesson
