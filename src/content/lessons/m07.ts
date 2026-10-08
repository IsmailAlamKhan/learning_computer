import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 7,
  part: 1,
  id: 'm07',
  titleBn: 'ইন্টারনেট ও ব্রাউজার',
  oneLineBn: 'ওয়েবসাইট খুলি, খুঁজি, ঠকবাজ সাইট চিনি আর নিরাপদে ফাইল নামাই।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['internet', 'wifi', 'mobile-data', 'browser', 'website', 'url', 'address-bar', 'search-engine', 'tab', 'bookmark', 'back-forward-refresh', 'link', 'download', 'https', 'padlock', 'domain', 'pop-up', 'advertisement'],

  explanation: [
    { kind: 'p', textBn: 'ইন্টারনেট (Internet) কী? ভাবুন, সারা পৃথিবী জুড়ে অসংখ্য রাস্তা আর ডাকঘর আছে, যেগুলো সব কম্পিউটার আর ফোনকে একে অপরের সাথে জুড়ে রেখেছে। আপনি কোনো চিঠি (তথ্য) চাইলে সেই রাস্তা ধরে সেটি আপনার কাছে চলে আসে।' },
    { kind: 'analogy', textBn: 'ইন্টারনেট হলো এক বিশাল শহরের রাস্তার জাল। প্রতিটি ওয়েবসাইট সেই শহরের একটি দোকান। আপনার কম্পিউটার বা ফোন হলো আপনার বাড়ি, আর ব্রাউজার (Browser) হলো রিকশা — যেটায় চড়ে আপনি দোকানে যান।' },
    { kind: 'p', textBn: 'আপনার ফোন বা কম্পিউটার সাধারণত দুইভাবে এই রাস্তায় ওঠে: ওয়াই-ফাই (Wi‑Fi) দিয়ে, অথবা ফোনের মোবাইল ডেটা (Mobile data) দিয়ে। নিচের সুইচগুলো বদলে দেখুন, কখন পেজ খুলবে আর কখন খুলবে না।' },
    { kind: 'widget', widget: 'wifi-vs-mobile' },
    { kind: 'note', textBn: 'মনে রাখবেন: “ওয়াই-ফাইয়ে যুক্ত” দেখালেই ইন্টারনেট থাকবে, এমন নয়। রাউটার চালু থাকলেও যদি তার নিজের ইন্টারনেট লাইন বন্ধ থাকে, পেজ খুলবে না।' },
    { kind: 'p', textBn: 'ব্রাউজার হলো ওয়েবসাইট দেখার প্রোগ্রাম। আপনার কম্পিউটারে Chrome, Edge, Safari বা Firefox-এর মধ্যে এক বা একাধিক থাকতে পারে। সবগুলোর কাজ একই — দেখতে একটু আলাদা। আমাদের সিমুলেশনে “Web Browser” নামে একটি সাধারণ ব্রাউজার আছে।' },
    { kind: 'p', textBn: 'ব্রাউজারের ওপরের লম্বা বক্সটির নাম অ্যাড্রেস বার (Address bar)। আজকের ব্রাউজারে এই একটি বক্সই দুই কাজ করে: ওয়েব ঠিকানা লিখলে সেই সাইটে যায়, আর সাধারণ শব্দ লিখলে সার্চ করে। একটি ওয়েব ঠিকানা (URL) এমন দেখতে হয়:' },
    { kind: 'widget', widget: 'url-anatomy' },
    {
      kind: 'list',
      itemsBn: [
        'ঠিকানার শুরুতে https:// থাকলে অ্যাড্রেস বারের পাশে ছোট তালার চিহ্ন (Padlock) দেখা যায়। এর মানে আপনার আর সাইটের মাঝের তথ্য সুরক্ষিত করে (এনক্রিপ্ট করে) পাঠানো হচ্ছে।',
        'কিন্তু তালা মানেই ভালো সাইট নয়! ঠকবাজেরাও তালা-ওয়ালা সাইট বানাতে পারে। সাইট বিশ্বাস করার আগে ডোমেইনের বানান আর সাইটের ভাব দেখুন।',
      ],
    },
    {
      kind: 'p',
      textBn: 'ব্রাউজারের কয়েকটি দরকারি জিনিস: ট্যাব (Tab) — এক ব্রাউজারে কয়েকটি পাতা আলাদা ঘরে খুলে রাখা। পিছনের (Back) আর সামনের (Forward) তীর — আগের বা পরের পাতায় যাওয়া। রিফ্রেশ (Refresh/Reload) — পাতাটি নতুন করে লোড করা। আর তারা (★) চিহ্ন দিয়ে বুকমার্ক (Bookmark) করলে পছন্দের পাতা পরে সহজে খুলে পাওয়া যায়।',
    },
    { kind: 'p', textBn: 'কিছু খুঁজতে চাইলে সার্চ ইঞ্জিন (Search engine) ব্যবহার করুন। ভালো সার্চের কয়েকটি কৌশল:' },
    {
      kind: 'list',
      itemsBn: [
        'পুরো বাক্য নয়, দরকারি শব্দ (কিওয়ার্ড) লিখুন। যেমন “ডাল রেসিপি”, “weather Dhaka”, “khichuri recipe”।',
        'নির্দিষ্ট কিছু খুঁজতে শব্দগুলো উদ্ধৃতি চিহ্নের (“ ”) ভেতরে লিখুন। যেমন “easy dal”।',
        'আরও পরিষ্কার ফল পেতে সাথে রেসিপি, tutorial, খবর, আবহাওয়া — এমন একটি শব্দ জুড়ে দিন।',
        'বাংলা আর ইংরেজি দুটোই চলে। আপনার কিবোর্ডে বাংলা না থাকলে ইংরেজি অক্ষরেও খুঁজতে পারেন।',
      ],
    },
    { kind: 'p', textBn: 'সার্চের ফলাফলের প্রতিটি আইটেমে তিনটি জিনিস দেখুন: শিরোনাম (Title), ঠিকানা বা ডোমেইন (URL), আর ছোট বিবরণ (Snippet)। কোনো ফলাফলের ওপরে “Ad” বা “বিজ্ঞাপন” লেখা থাকলে বুঝবেন সেটি টাকা দিয়ে ওপরে বসানো। বিজ্ঞাপন (Advertisement) সবসময় সেরা উত্তর নয়।' },
    { kind: 'p', textBn: 'ঠকবাজ বা সন্দেহজনক সাইট চেনার সহজ কিছু লক্ষণ:' },
    {
      kind: 'list',
      itemsBn: [
        'ডোমেইনের বানান একটু বদলানো (যেমন l-এর জায়গায় সংখ্যা 1)।',
        'তাড়াহুড়োর ভয় দেখানো লাল লেখা: “১০ মিনিটে অ্যাকাউন্ট বন্ধ হয়ে যাবে!”।',
        'বিনা কারণে পুরস্কার, ফ্রি ফোন বা টাকা জেতার খবর।',
        'OTP, পাসওয়ার্ড বা মোবাইল-ওয়ালেটের PIN চাওয়া। আসল প্রতিষ্ঠান এগুলো কখনো এভাবে চায় না।',
        'বানান ভুল, ঠিকমতো না সাজানো পাতা, আর একের পর এক পপ-আপ (Pop-up)।',
      ],
    },
    { kind: 'note', textBn: 'নিয়ম: OTP, PIN আর পাসওয়ার্ড কাউকে বলবেন না, কোনো সন্দেহজনক পাতায় লিখবেন না। সন্দেহ হলে পাতাটি বন্ধ করে দিন।' },
    {
      kind: 'list',
      itemsBn: [
        'ডাউনলোড (Download) মানে ইন্টারনেট থেকে ফাইল কম্পিউটারে নামানো। নামানো ফাইল সাধারণত Downloads ফোল্ডারে পাওয়া যায়।',
        'প্রোগ্রাম বা অন্য ফাইল শুধু সেটির নিজের আসল (অফিসিয়াল) সাইট থেকে নামান। বিজ্ঞাপনের “Download Now” বোতামে ক্লিক করবেন না।',
        'অচেনা সাইট থেকে আসা .exe, .msi, .dmg, .zip ফাইল খুব সাবধানে সামলান — এগুলোতে ভাইরাস থাকতে পারে।',
      ],
    },
    { kind: 'note', textBn: 'আপনার কম্পিউটারে ব্রাউজারটি একটু আলাদা দেখাতে পারে (বোতামের জায়গা, রং, বা তালার জায়গায় অন্য ছোট চিহ্ন), তবে কাজ একই।' },
  ],

  steps: [
    // ---------- open the browser (OS-specific) ----------
    {
      id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট বোতামে ক্লিক করুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
      explanationBn: 'ব্রাউজার খুলতে প্রথমে নিচের বাঁ দিকের (বা মাঝের) স্টার্ট বোতামে একবার ক্লিক করুন।',
      hintBn: 'টাস্কবারের চারকোনা Windows আইকনটি দেখুন।',
      simplerBn: 'পর্দার একদম নিচের বারে চারটি ছোট চৌকো ঘর আঁকা বোতাম আছে। সেটিতে একবার ক্লিক করুন।',
    },
    {
      id: 'w-open-browser', osVariant: 'windows', titleBn: 'Web Browser খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
      explanationBn: 'তালিকা থেকে “Web Browser” বেছে নিন। ব্রাউজার খুলবে।',
      hintBn: 'তালিকায় একটি গোলকের মতো আইকনের পাশে Web Browser লেখা আছে।',
    },
    {
      id: 'm-open-browser', osVariant: 'mac', titleBn: 'ডক থেকে ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
      explanationBn: 'নিচের ডকে গোলকের মতো আইকনটি হলো ব্রাউজার। সেটিতে একবার ক্লিক করুন।',
      hintBn: 'ডকের বাঁ দিক থেকে তৃতীয় আইকনটি দেখুন।',
      simplerBn: 'পর্দার নিচের আইকনের সারিটির নাম ডক। তাতে “Web Browser” লেখা আইকনটিতে ক্লিক করুন।',
    },
    // ---------- both ----------
    {
      id: 'search-words', osVariant: 'both', titleBn: 'অ্যাড্রেস বারে খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search' },
      explanationBn: 'ওপরের লম্বা বক্সটি অ্যাড্রেস বার। এতে ক্লিক করে ইংরেজিতে dal recipe লিখে Enter (Mac-এ Return) চাপুন। আপনার কিবোর্ডে বাংলা থাকলে “ডাল রেসিপি”-ও লিখতে পারেন।',
      hintBn: 'বক্সে ক্লিক করে dal recipe টাইপ করুন, তারপর Enter চাপুন।',
      simplerBn: 'ওপরের লম্বা সাদা বক্সে একবার ক্লিক করুন। তারপর কিবোর্ডে d-a-l, ফাঁকা, r-e-c-i-p-e লিখে বড় Enter চাপুন।',
      teacherTipBn: 'পুরো বাক্য নয়, শুধু দরকারি শব্দ লিখলেই সার্চ ভালো কাজ করে — এই কথাটি এখানে বলে নিন।',
    },
    {
      id: 'open-result', osVariant: 'both', titleBn: 'প্রথম ফলাফলটি খুলুন', target: 'search-result-1', expectedAction: { type: 'click', target: 'search-result-1' },
      explanationBn: 'ফলাফলের তালিকায় সবার ওপরে “Ad · বিজ্ঞাপন” লেখা একটি বক্স থাকতে পারে — সেটি বিজ্ঞাপন, ওটাতে যাবেন না। এর নিচে প্রথম সাধারণ ফলাফলের নীল শিরোনামে ক্লিক করুন।',
      hintBn: '“মসুর ডালের সহজ রেসিপি” লেখা নীল শিরোনামে ক্লিক করুন।',
      simplerBn: 'নীল রঙের লেখাটিই লিংক (Link)। তার ওপর মাউসের তীর নিয়ে একবার ক্লিক করুন।',
    },
    {
      id: 'go-back', osVariant: 'both', titleBn: 'পিছনের তীরে ক্লিক করুন', target: 'browser-back', expectedAction: { type: 'click', target: 'browser-back' },
      explanationBn: 'বাঁ দিকের পিছনের তীর (←) আগের পাতায় ফেরায়। এখন সেটিতে ক্লিক করে সার্চের তালিকায় ফিরে যান।',
      hintBn: 'অ্যাড্রেস বারের বাঁ পাশে দুটি তীর আছে। বাঁ দিকেরটি পিছনের।',
    },
    {
      id: 'go-forward', osVariant: 'both', titleBn: 'সামনের তীরে ক্লিক করুন', target: 'browser-forward', expectedAction: { type: 'click', target: 'browser-forward' },
      explanationBn: 'এবার ডান দিকের তীর (→) দিয়ে আবার রেসিপির পাতায় এগিয়ে যান।',
      hintBn: 'পিছনের তীরের ঠিক পাশের তীরটি।',
    },
    {
      id: 'new-tab', osVariant: 'both', titleBn: 'নতুন ট্যাব খুলুন', target: 'browser-new-tab', expectedAction: { type: 'click', target: 'browser-new-tab' },
      explanationBn: 'ওপরের ট্যাবের সারির শেষে + চিহ্নে ক্লিক করুন। এতে আরেকটি ট্যাব খুলবে, আর আগের পাতা সেখানেই থাকবে।',
      hintBn: 'ট্যাবের নামের ডান পাশের + চিহ্নটি।',
      simplerBn: 'যেখানে পাতার নাম লেখা, তার ঠিক পাশে ছোট একটি + আছে। ওটিতে ক্লিক করুন।',
    },
    {
      id: 'type-address', osVariant: 'both', titleBn: 'ওয়েব ঠিকানা লিখুন', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://khobor.example/' },
      explanationBn: 'অ্যাড্রেস বারে খোঁজার শব্দ নয়, একটি ওয়েব ঠিকানা লিখুন: khobor.example — তারপর Enter (Mac-এ Return) চাপুন। এটি একটি খবরের সাইট।',
      hintBn: 'বক্সে khobor.example লিখে Enter চাপুন। মাঝে একটি ডট (.) আছে।',
      simplerBn: 'বক্সে ক্লিক করুন। k-h-o-b-o-r, তারপর ডট, তারপর e-x-a-m-p-l-e লিখে Enter চাপুন।',
    },
    {
      id: 'switch-tab', osVariant: 'both', titleBn: 'আগের ট্যাবে ফিরে যান', target: 'browser-tab-1', expectedAction: { type: 'click', target: 'browser-tab-1' },
      explanationBn: 'ওপরের প্রথম ট্যাবে ক্লিক করুন। রেসিপির পাতাটি যেমন রেখে এসেছিলেন তেমনই পাবেন।',
      hintBn: 'ট্যাবের সারিতে বাঁ দিকের প্রথম ট্যাবটি।',
    },
    {
      id: 'bookmark', osVariant: 'both', titleBn: 'পাতাটি বুকমার্ক করুন', target: 'browser-bookmark', expectedAction: { type: 'click', target: 'browser-bookmark' },
      explanationBn: 'অ্যাড্রেস বারের ডান প্রান্তে তারা (☆) চিহ্নে ক্লিক করুন। রেসিপির পাতাটি বুকমার্ক হবে, আর নিচে একটি বুকমার্কের সারি দেখা যাবে।',
      hintBn: 'ঠিকানা লেখার বক্সের একদম ডান দিকের ছোট তারা।',
      simplerBn: 'ঠিকানার বক্সের ভেতরেই ডান কোণে ফাঁকা একটি তারা আছে। সেটিতে ক্লিক করুন।',
    },
    {
      id: 'visit-scam', osVariant: 'both', titleBn: 'এবার একটি ভুয়া সাইট দেখি', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://free-prize-claim.example/' },
      explanationBn: 'এটি শেখার জন্য বানানো একটি ঠকবাজ সাইটের নমুনা — বিপদের কিছু নেই। অ্যাড্রেস বারে free-prize-claim.example লিখে Enter চাপুন, আর খেয়াল করুন সাইটটি আপনাকে কী কী বলছে।',
      hintBn: 'বক্সে free-prize-claim.example লিখুন। মাঝের দাগগুলো (হাইফেন -) ভুলবেন না।',
      simplerBn: 'ওপরের বক্সে ক্লিক করে f-r-e-e, দাগ, p-r-i-z-e, দাগ, c-l-a-i-m, ডট, e-x-a-m-p-l-e লিখে Enter চাপুন।',
    },
    {
      id: 'close-popup', osVariant: 'both', titleBn: 'ভয় দেখানো পপ-আপ বন্ধ করুন', target: 'scam-popup-close', expectedAction: { type: 'click', target: 'scam-popup-close' },
      explanationBn: 'হঠাৎ একটি পপ-আপ লাফিয়ে উঠেছে — “ভাইরাস ধরা পড়েছে” বলে ভয় দেখাচ্ছে। এটিতে OK চাপবেন না। বক্সের ডান কোণের ✕ চিহ্নে ক্লিক করে বন্ধ করুন।',
      hintBn: 'পপ-আপের ডান ওপরের ছোট ✕ চিহ্নটি।',
    },
    {
      id: 'spot-urgent', osVariant: 'both', titleBn: 'ভয় দেখানো লাল লেখাটি খুঁজুন', target: 'scam-urgent', expectedAction: { type: 'click', target: 'scam-urgent' },
      explanationBn: 'পাতায় বড় বড় লাল অক্ষরে তাড়া দেওয়া একটি লেখা আছে — “১০ মিনিটের মধ্যে...”। ঠকবাজেরা তাড়া দিয়ে ভাবার সময় কেড়ে নেয়। লেখাটিতে ক্লিক করে চিনিয়ে দিন।',
      hintBn: '“URGENT!!!” দিয়ে শুরু হওয়া লাল লেখাটি।',
    },
    {
      id: 'spot-otp', osVariant: 'both', titleBn: 'যে ঘরটি দেখে সতর্ক হবেন', target: 'scam-otp', expectedAction: { type: 'click', target: 'scam-otp' },
      explanationBn: 'এই ঘরে “OTP বা PIN লিখুন” বলা হচ্ছে। কোনো পুরস্কারের জন্য OTP বা PIN কেউ চায় না — আসল জায়গাও কখনো এভাবে চায় না। ঘরটিতে ক্লিক করে চিনিয়ে দিন, কিন্তু কিছু লিখবেন না।',
      hintBn: 'বক্সের ভেতর “OTP / PIN” লেখা ঘরটি।',
      teacherTipBn: 'এখানে জোর দিয়ে বলুন: আসল জীবনে OTP/PIN কাউকে বলা বা কোনো পাতায় লেখা চলবে না, এমনকি পরিচিত নাম শুনলেও না।',
    },
    {
      id: 'leave-scam', osVariant: 'both', titleBn: 'পিছনে ফিরে যান', target: 'browser-back', expectedAction: { type: 'click', target: 'browser-back' },
      explanationBn: 'সন্দেহজনক সাইট থেকে বেরিয়ে আসার সবচেয়ে সহজ উপায় — পিছনের তীরে ক্লিক করা, বা পাতাটি বন্ধ করে দেওয়া।',
      hintBn: 'বাঁ দিকের পিছনের তীরটি (←)।',
    },
    {
      id: 'go-official', osVariant: 'both', titleBn: 'আসল ডাউনলোড পাতায় যান', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://download.official-editor.example/' },
      explanationBn: 'এবার একটি নিরাপদ ডাউনলোড শিখি। অ্যাড্রেস বারে download.official-editor.example লিখে Enter চাপুন। এটি OfficialEditor নামের কাল্পনিক একটি প্রোগ্রামের আসল (অফিসিয়াল) সাইট।',
      hintBn: 'বক্সে download.official-editor.example লিখুন। মাঝের দাগ (-) ভুলবেন না।',
      simplerBn: 'বক্সে ক্লিক করে লিখুন: download ডট official-editor ডট example। তারপর Enter।',
    },
    {
      id: 'download-real', osVariant: 'both', titleBn: 'আসল বোতাম থেকে ডাউনলোড করুন', target: 'download-official', expectedAction: { type: 'custom', event: 'browser-download-done' },
      explanationBn: 'পাতায় দুটি বোতাম আছে। নিচের হলুদ-সবুজ বোতামটি “AD · বিজ্ঞাপন” লেখা বক্সের ভেতরে — ওটি ফাঁদ, ছুঁবেন না। ওপরের নীল বোতামটিতে ক্লিক করুন, আর নামার লাইনটি ভরে ওঠা পর্যন্ত একটু অপেক্ষা করুন।',
      hintBn: 'যে বোতামে ফাইলের নাম (OfficialEditor…) লেখা, সেই নীল বোতামে ক্লিক করুন।',
      simplerBn: 'পাতার ওপরের দিকে নীল রঙের বোতামটি দেখুন। ওটাতে ক্লিক করে অপেক্ষা করুন। নিচের উজ্জ্বল বোতামটি ছোঁবেন না।',
      successMessageBn: 'চমৎকার! ফাইলটি নেমে গেছে।',
    },
    // ---------- find the file (OS-specific) ----------
    {
      id: 'w-open-explorer', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'নামানো ফাইলটি এখন কোথায়, দেখি। টাস্কবারের ফোল্ডারের আইকনে (File Explorer) ক্লিক করুন।',
      hintBn: 'টাস্কবারে হলুদ ফোল্ডারের আইকনটি।',
    },
    {
      id: 'w-downloads', osVariant: 'windows', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'click', target: 'fm-sidebar-Downloads' },
      explanationBn: 'বাঁ দিকের তালিকা থেকে “Downloads” ফোল্ডারটি বেছে নিন। ইন্টারনেট থেকে নামানো ফাইল সাধারণত এখানেই জমা হয়।',
      hintBn: 'বাঁ দিকের তালিকায় Downloads লেখাটি।',
    },
    {
      id: 'w-see-file', osVariant: 'windows', titleBn: 'নামানো ফাইলটি খুঁজে নিন', target: 'fm-item-OfficialEditor-setup.exe', expectedAction: { type: 'click', target: 'fm-item-OfficialEditor-setup.exe' },
      explanationBn: 'এই তো আপনার নামানো ফাইল — OfficialEditor-setup.exe। এর শেষে .exe মানে এটি একটি ইনস্টল করার প্রোগ্রাম। ফাইলটিতে একবার ক্লিক করে বেছে নিন। (এটি অভ্যাসের জন্য, এখানে খোলা হবে না।)',
      hintBn: 'ফোল্ডারের ভেতরে OfficialEditor-setup.exe নামের ফাইলটি।',
    },
    {
      id: 'm-open-finder', osVariant: 'mac', titleBn: 'ফাইন্ডার (Finder) খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'নামানো ফাইলটি এখন কোথায়, দেখি। ডকের একদম বাঁ দিকের আইকনে (Finder) ক্লিক করুন।',
      hintBn: 'ডকের প্রথম আইকন, হাসিমুখের মতো দেখতে।',
    },
    {
      id: 'm-downloads', osVariant: 'mac', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'click', target: 'fm-sidebar-Downloads' },
      explanationBn: 'বাঁ দিকের তালিকা থেকে “Downloads” বেছে নিন। ইন্টারনেট থেকে নামানো ফাইল সাধারণত এখানেই জমা হয়।',
      hintBn: 'বাঁ দিকের তালিকায় Downloads লেখাটি।',
    },
    {
      id: 'm-see-file', osVariant: 'mac', titleBn: 'নামানো ফাইলটি খুঁজে নিন', target: 'fm-item-OfficialEditor.dmg', expectedAction: { type: 'click', target: 'fm-item-OfficialEditor.dmg' },
      explanationBn: 'এই তো আপনার নামানো ফাইল — OfficialEditor.dmg। এর শেষে .dmg মানে এটি Mac-এর ইনস্টল করার ফাইল। ফাইলটিতে একবার ক্লিক করে বেছে নিন। (এটি অভ্যাসের জন্য, এখানে খোলা হবে না।)',
      hintBn: 'ফোল্ডারের ভেতরে OfficialEditor.dmg নামের ফাইলটি।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে ঘুরে দেখুন',
    instructionBn: 'ব্রাউজার খুলে যা খুশি করে দেখুন। সব সাইট শেখার জন্য বানানো, কোনো ক্ষতি হবে না। ভুল হলে “রিসেট” চাপুন।',
    checklistBn: [
      'ইংরেজি শব্দ দিয়ে সার্চ করেছি: khichuri recipe, weather Dhaka, news',
      'উদ্ধৃতি চিহ্নে একটি শব্দগুচ্ছ খুঁজেছি: “easy dal”',
      'সার্চের ফলাফলে “Ad · বিজ্ঞাপন” লেখা অংশটি চিনেছি',
      'অ্যাড্রেস বারের তালার চিহ্নে ক্লিক করে পড়েছি এর মানে কী',
      'paypocket-secure1ogin.example সাইটে গিয়ে ডোমেইনের কোন বানানটি ভুল তা খুঁজেছি (কিছু লিখিনি)',
      'রিফ্রেশ বোতামে ক্লিক করেছি আর একটি ট্যাব বন্ধ করেছি',
      'ওপরের ডাউনলোড (↓) বোতামে ক্লিক করে নামানো ফাইলের তালিকা দেখেছি',
      'Settings থেকে Wi‑Fi বন্ধ করে ব্রাউজারে কী দেখায় লক্ষ করেছি, তারপর আবার চালু করেছি',
    ],
  },

  quiz: [
    {
      id: 'q-domain', type: 'clickTarget', questionBn: 'https://www.example.com/page — এই ঠিকানার কোন অংশটি সাইটের আসল নাম (ডোমেইন)?',
      items: [
        { id: 'scheme', labelBn: 'https://' },
        { id: 'domain', labelBn: 'www.example.com' },
        { id: 'path', labelBn: '/page' },
      ],
      correct: 'domain',
      hintBn: 'দোকানের সাইনবোর্ডে যে নাম লেখা থাকে, সেটি। ভেতরের কোন তাকে যাবেন সেটি নয়।',
      explanationBn: 'ঠিক! www.example.com হলো ডোমেইন — সাইটের নাম। https:// হলো সংযোগের ধরন, আর /page হলো সাইটের ভেতরের পাতা।',
    },
    {
      id: 'q-suspicious', type: 'clickTarget', questionBn: 'নিচের ঠিকানাগুলোর মধ্যে কোনটি সন্দেহজনক, যার ডোমেইনের বানান ঠকবাজের মতো বদলানো?',
      items: [
        { id: 'a', labelBn: 'https://rannaghor.example/' },
        { id: 'b', labelBn: 'https://paypocket-secure1ogin.example/' },
        { id: 'c', labelBn: 'https://khobor.example/' },
        { id: 'd', labelBn: 'https://download.official-editor.example/' },
      ],
      correct: 'b',
      hintBn: 'আসল নামটি হওয়ার কথা “login”। ভালো করে দেখুন — l-এর জায়গায় অন্য কিছু আছে কি?',
      explanationBn: 'ঠিক ধরেছেন! “secure1ogin”-এ ইংরেজি l-এর জায়গায় সংখ্যা 1 বসানো হয়েছে। এমন ছোট বানান-বদলই ঠকবাজদের পুরোনো কৌশল।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'নিরাপদে প্রোগ্রাম ডাউনলোড করার ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'প্রোগ্রামটির আসল (অফিসিয়াল) সাইটে যাই' },
        { id: '2', textBn: '“Ad” নয়, সাইটের আসল ডাউনলোড বোতামে ক্লিক করি' },
        { id: '3', textBn: 'নামার লাইন ভরে ওঠা পর্যন্ত অপেক্ষা করি' },
        { id: '4', textBn: 'Downloads ফোল্ডারে গিয়ে ফাইলটি খুঁজে নিই' },
      ],
      hintBn: 'আগে ঠিক জায়গায় যেতে হবে, তারপর বোতামে ক্লিক। ফাইল খোঁজা সবার শেষে।',
      explanationBn: 'চমৎকার! আসল সাইট → আসল বোতাম → অপেক্ষা → Downloads ফোল্ডার। এই ক্রম মনে রাখলে ডাউনলোড নিরাপদ থাকে।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'ব্রাউজারের জিনিসের সাথে তার কাজ মিলিয়ে দিন।',
      pairs: [
        { id: 'addr', leftBn: 'অ্যাড্রেস বার', rightBn: 'ঠিকানা লিখে সাইটে যাওয়া বা শব্দ লিখে খোঁজা' },
        { id: 'back', leftBn: 'পিছনের তীর (←)', rightBn: 'আগের পাতায় ফেরা' },
        { id: 'tab', leftBn: 'ট্যাব', rightBn: 'এক ব্রাউজারে আলাদা আলাদা পাতা খুলে রাখা' },
        { id: 'star', leftBn: 'তারা (★)', rightBn: 'পছন্দের পাতা পরে খুলতে বুকমার্ক করা' },
      ],
      hintBn: 'প্রতিটির নামের দিকে তাকান। যেমন “পিছনে” মানে ফেরা, “ট্যাব” মানে আলাদা ঘর।',
      explanationBn: 'চারটিই মিলেছে! এই চারটি দিয়েই ব্রাউজারের বেশিরভাগ কাজ হয়ে যায়।',
    },
    {
      id: 'q-wifi', type: 'multipleChoice', questionBn: 'আপনার ফোনে “Wi‑Fi যুক্ত” দেখাচ্ছে, কিন্তু কোনো ওয়েবসাইট খুলছে না। সবচেয়ে সম্ভাব্য কারণ কোনটি?',
      options: [
        { id: 'a', textBn: 'ফোন বিগড়ে গেছে, এখনই ফেলে দিতে হবে' },
        { id: 'b', textBn: 'ফোন রাউটারের সাথে যুক্ত, কিন্তু রাউটারের নিজের ইন্টারনেট লাইন নেই' },
        { id: 'c', textBn: 'ব্রাউজার ভুলে গেছে কীভাবে পেজ খোলে' },
        { id: 'd', textBn: 'ফোনের পর্দা নোংরা হয়ে গেছে' },
      ],
      correct: ['b'],
      hintBn: 'ওয়াই-ফাই শুধু রাউটার পর্যন্ত পৌঁছায়। রাউটারের ওপারের রাস্তাটি চালু আছে কি না, সেটা আলাদা কথা।',
      explanationBn: 'ঠিক! ওয়াই-ফাইয়ে যুক্ত মানে রাউটার পর্যন্ত যাওয়া। রাউটারের ইন্টারনেট লাইন বন্ধ থাকলে পেজ খুলবে না। তখন রাউটার বন্ধ করে আবার চালান, অথবা মোবাইল ডেটা ব্যবহার করুন।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'ইন্টারনেট হলো সারা পৃথিবীর কম্পিউটারের রাস্তার জাল। ব্রাউজার হলো ওয়েবসাইটে যাওয়ার প্রোগ্রাম।',
      'ওয়াই-ফাই “যুক্ত” মানেই ইন্টারনেট চালু নয়। সন্দেহ হলে রাউটার দেখুন বা মোবাইল ডেটা চালান।',
      'অ্যাড্রেস বার একসাথে ঠিকানার ঘর আর সার্চের ঘর। সার্চে পুরো বাক্য নয়, দরকারি শব্দ লিখুন।',
      'ওয়েব ঠিকানার আসল নাম হলো ডোমেইন — তার বানান খুঁটিয়ে দেখুন। তালার চিহ্ন মানেই ভালো সাইট নয়।',
      '“Ad / বিজ্ঞাপন” লেখা ফলাফল সেরা উত্তর নয়।',
      'OTP, PIN, পাসওয়ার্ড কাউকে বলবেন না, সন্দেহজনক পাতায় লিখবেন না। তাড়া দেওয়া ভয়, পুরস্কারের লোভ, বানান ভুল — এসব দেখলে সরে আসুন।',
      'প্রোগ্রাম শুধু আসল সাইট থেকে নামান। নামা ফাইল Downloads ফোল্ডারে থাকে।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'নিজের ব্রাউজারটি খুলুন। অ্যাড্রেস বারে একটি পরিচিত ওয়েবসাইটের নাম লিখুন, আর ঠিকানার পাশে তালার চিহ্ন আছে কি না দেখুন।',
      'অ্যাড্রেস বারে “আজকের আবহাওয়া” লিখে সার্চ করুন। ফলাফলের তালিকায় কোনটির পাশে “Ad” বা “বিজ্ঞাপন” লেখা আছে, আঙুল দিয়ে দেখান — কিছুতে ক্লিক করার দরকার নেই।',
      'একটি পছন্দের পাতা তারা (★) চিহ্ন দিয়ে বুকমার্ক করুন, তারপর ট্যাব বন্ধ করে বুকমার্ক থেকে আবার খুলুন।',
    ],
    windowsTasksBn: ['ফাইল এক্সপ্লোরার খুলে বাঁ দিকের Downloads ফোল্ডারটি দেখুন — কোন কোন ফাইল জমে আছে শুধু দেখুন, কিছু খুলবেন না।'],
    macTasksBn: ['ফাইন্ডার খুলে বাঁ দিকের Downloads ফোল্ডারটি দেখুন — কোন কোন ফাইল জমে আছে শুধু দেখুন, কিছু খুলবেন না।'],
  },

  teacherTipBn:
    'এই পাঠের সবচেয়ে জরুরি অংশ হলো সন্দেহজনক সাইট চেনা আর OTP/PIN না বলা। তাড়াহুড়ো আর লোভ দেখানো — এই দুটি লক্ষণ বারবার বলুন। আসল জীবনের কোনো ঘটনার উদাহরণ থাকলে (নাম না করে) গল্পের মতো শোনান। ওয়াই-ফাই আর মোবাইল ডেটার তফাত কেউ গুলিয়ে ফেললে ওপরের সুইচগুলো দিয়ে বুঝিয়ে দিন।',
}

export default lesson
