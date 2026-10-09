import type { Lesson } from '../../engine/types'

/**
 * Module 7 — ইন্টারনেট ও ব্রাউজার (cards format). Four units:
 * (1) internet, Wi‑Fi vs mobile data, the browser; (2) address bar, URL, search, tabs, back/forward, bookmark;
 * (3) good vs suspicious sites (calm, protective); (4) safe downloads.
 * Step targets and expectedAction semantics are the same as in the old guided practice; only the words changed.
 * Each unit's simulated computer starts fresh, so units 2-4 start with the browser already open.
 */
const browserOpen = { openApps: ['browser'] }

const lesson: Lesson = {
  module: 7,
  part: 1,
  id: 'm07',
  titleBn: 'ইন্টারনেট ও ব্রাউজার',
  oneLineBn: 'ওয়েবসাইট খুলি, খুঁজি, ঠকবাজ সাইট চিনি আর নিরাপদে ফাইল নামাই।',
  minutes: 8,
  glossaryIds: ['internet', 'wifi', 'mobile-data', 'browser', 'website', 'url', 'address-bar', 'search-engine', 'tab', 'bookmark', 'back-forward-refresh', 'link', 'download', 'https', 'padlock', 'domain', 'pop-up', 'advertisement'],

  units: [
    // =====================================================================================================
    {
      id: 'net-browser',
      titleBn: 'ইন্টারনেট ও ব্রাউজার',
      hook: {
        id: 'h-net',
        type: 'hook',
        textBn: 'ফোনে ফেসবুক বা ইউটিউব খোলে যে জিনিসে — কম্পিউটারেও সেটাই চলে: **ইন্টারনেট**।',
        visual: { kind: 'flow', items: [{ art: 'phone', labelBn: 'ফোন' }, { art: 'router', labelBn: 'রাউটার' }, { art: 'cloud', labelBn: 'ইন্টারনেট' }, { art: 'server', labelBn: 'ওয়েবসাইট' }] },
      },
      cards: [
        {
          id: 'c-flow',
          type: 'visual',
          textBn: 'আপনার ফোন বা কম্পিউটার **রাউটার** হয়ে ইন্টারনেটে ঢোকে, আর ওয়েবসাইটের কম্পিউটার থেকে পাতা নিয়ে আসে।',
          visual: { kind: 'flow', items: [{ art: 'laptop', labelBn: 'আপনার ডিভাইস' }, { art: 'router', labelBn: 'রাউটার' }, { art: 'cloud', labelBn: 'ইন্টারনেট' }, { art: 'server', labelBn: 'সার্ভার' }] },
          chipsBn: ['ডিভাইস', 'রাউটার', 'সার্ভার'],
          learnMoreBn: 'ওয়েবসাইট আসলে অন্য কোথাও থাকা একটি বড় কম্পিউটারে (সার্ভার) রাখা থাকে। আপনি ঠিকানা চাইলে সেই কম্পিউটার পাতাটি পাঠিয়ে দেয়।',
        },
        {
          id: 'c-widget',
          type: 'visual',
          textBn: 'পারেন? ওয়াই-ফাই আর মোবাইল ডেটার সুইচ বদলে দেখুন, কখন পেজ খোলে।',
          visual: { kind: 'widget', widget: 'wifi-vs-mobile' },
        },
        {
          id: 'c-router',
          type: 'visual',
          textBn: '“Wi‑Fi যুক্ত” মানেই ইন্টারনেট নয়। রাউটারের নিজের লাইন বন্ধ থাকলে পেজ খোলে না।',
          visual: { kind: 'art', name: 'router', captionBn: 'রাউটার চালু, লাইন বন্ধ' },
          learnMoreBn: 'এমন হলে রাউটারটি একবার বন্ধ করে আবার চালান। তাতেও না হলে ফোনের মোবাইল ডেটা চালিয়ে দেখুন।',
        },
        {
          id: 'c-rickshaw',
          type: 'visual',
          textBn: 'ইন্টারনেট রাস্তা, ওয়েবসাইট দোকান, আর **ব্রাউজার** হলো রিকশা — যেটায় চড়ে দোকানে যান।',
          visual: { kind: 'flow', items: [{ art: 'browser', labelBn: 'ব্রাউজার = রিকশা' }, { art: 'globe', labelBn: 'ইন্টারনেট = রাস্তা' }, { art: 'server', labelBn: 'ওয়েবসাইট = দোকান' }] },
          chipsBn: ['Chrome', 'Edge', 'Safari'],
          learnMoreBn: 'Chrome, Edge, Safari, Firefox — সবগুলোই ব্রাউজার, দেখতে একটু আলাদা কিন্তু কাজ একই। আপনার কম্পিউটারে একটু অন্যরকম দেখাতে পারে।',
        },
      ],
      steps: [
        {
          id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট বোতামে ক্লিক করুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'নিচের টাস্কবারের স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চারকোনা Windows আইকনটি দেখুন।',
          simplerBn: 'পর্দার একদম নিচের বারে চারটি ছোট চৌকো ঘরের বোতামটিতে একবার ক্লিক করুন।',
        },
        {
          id: 'w-open-browser', osVariant: 'windows', titleBn: 'Web Browser খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'তালিকা থেকে “Web Browser”-এ ক্লিক করুন।',
          hintBn: 'গোলকের মতো আইকনের পাশে Web Browser লেখা আছে।',
          successMessageBn: 'ব্রাউজার খুলেছে!',
        },
        {
          id: 'm-open-browser', osVariant: 'mac', titleBn: 'ডক থেকে ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'ডকের গোলকের মতো আইকন, ব্রাউজারে ক্লিক করুন।',
          hintBn: 'ডকের বাঁ দিক থেকে তৃতীয় আইকনটি দেখুন।',
          simplerBn: 'পর্দার নিচের আইকনের সারিটির নাম ডক। তাতে “Web Browser” লেখা আইকনে ক্লিক করুন।',
          successMessageBn: 'ব্রাউজার খুলেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-wifi', type: 'multipleChoice', questionBn: 'ফোনে “Wi‑Fi যুক্ত” দেখাচ্ছে, কিন্তু সাইট খুলছে না। সম্ভাব্য কারণ কী?',
          options: [
            { id: 'a', textBn: 'ফোন নষ্ট, ফেলে দিতে হবে' },
            { id: 'b', textBn: 'রাউটারের নিজের ইন্টারনেট লাইন নেই' },
            { id: 'c', textBn: 'ব্রাউজার পেজ খোলা ভুলে গেছে' },
          ],
          correct: ['b'],
          hintBn: 'ওয়াই-ফাই শুধু রাউটার পর্যন্ত যায়। ওপারের রাস্তা চালু আছে কি?',
          explanationBn: 'রাউটারের লাইন বন্ধ থাকলে পেজ খোলে না।',
        },
        {
          id: 'q-browser', type: 'clickTarget', questionBn: 'নিচের কোনটি ব্রাউজার?',
          items: [
            { id: 'chrome', labelBn: 'Chrome', icon: '🧭' },
            { id: 'paint', labelBn: 'Paint', icon: '🎨' },
            { id: 'calc', labelBn: 'Calculator', icon: '🧮' },
            { id: 'notepad', labelBn: 'Notepad', icon: '📝' },
          ],
          correct: 'chrome',
          hintBn: 'যেটা দিয়ে ওয়েবসাইট দেখা যায়।',
          explanationBn: 'Chrome ওয়েবসাইট দেখার ব্রাউজার।',
        },
        {
          id: 'q-analogy', type: 'dragMatch', questionBn: 'জিনিসের সাথে তার কাজ মিলিয়ে দিন।',
          pairs: [
            { id: 'net', leftBn: 'ইন্টারনেট', rightBn: 'রাস্তার জাল' },
            { id: 'site', leftBn: 'ওয়েবসাইট', rightBn: 'দোকান' },
            { id: 'browser', leftBn: 'ব্রাউজার', rightBn: 'রিকশা' },
            { id: 'router', leftBn: 'রাউটার', rightBn: 'বাড়ির প্রবেশপথ' },
          ],
          hintBn: 'ব্রাউজারে চড়েই দোকানে যান।',
          explanationBn: 'চারটিই মিলেছে!',
        },
      ],
      recapBn: ['রাউটার → ইন্টারনেট → ওয়েবসাইট', 'Wi‑Fi যুক্ত ≠ ইন্টারনেট চালু', 'ব্রাউজার = ওয়েবসাইট দেখার প্রোগ্রাম'],
      freeTryBn: 'নিজের ফোনের Wi‑Fi বন্ধ করে মোবাইল ডেটায় একটি সাইট খুলুন।',
    },

    // =====================================================================================================
    {
      id: 'address-search',
      titleBn: 'ঠিকানা ও সার্চ',
      hook: {
        id: 'h-addr',
        type: 'hook',
        textBn: 'খুঁজতেও একটাই বক্স, যেতেও একটাই — ব্রাউজারের **অ্যাড্রেস বার**।',
        visual: { kind: 'mock', name: 'browser', highlight: 'address-bar' },
      },
      setup: browserOpen,
      cards: [
        {
          id: 'c-addr',
          type: 'visual',
          textBn: 'ঠিকানা লিখলে সেই সাইটে যায়, সাধারণ শব্দ লিখলে সার্চ করে। দুটোই এই এক বক্সে।',
          visual: { kind: 'mock', name: 'browser', highlight: 'address-bar' },
          chipsBn: ['ঠিকানা = সাইটে যাওয়া', 'শব্দ = খোঁজা'],
        },
        {
          id: 'c-domain',
          type: 'visual',
          textBn: 'ঠিকানার ভেতরের আসল নামটা হলো **ডোমেইন**। সাইনবোর্ডের নামের মতো।',
          visual: { kind: 'mock', name: 'url-bar', highlight: 'domain' },
          learnMoreBn: 'ঠিকানার শুরুতে https:// (নিরাপদ পথ), তারপর ডোমেইন (সাইটের নাম), শেষে /page (সাইটের ভেতরের কোন পাতা)। ঠিকানা এই তিন ভাগে সাজানো।',
        },
        {
          id: 'c-url-widget',
          type: 'visual',
          textBn: 'পারেন? ঠিকানার অংশগুলো ছুঁয়ে দেখুন — কোনটা কী।',
          visual: { kind: 'widget', widget: 'url-anatomy' },
        },
        {
          id: 'c-search',
          type: 'visual',
          textBn: 'সার্চে পুরো বাক্য নয়, দরকারি **শব্দ** লিখুন। বাংলা বা ইংরেজি — দুটোই চলে।',
          visual: { kind: 'mock', name: 'browser', highlight: 'search-box', captionBn: 'dal recipe লিখে Enter' },
          chipsBn: ['ডাল রেসিপি', 'weather Dhaka'],
          learnMoreBn: 'কিবোর্ডে বাংলা না থাকলে ইংরেজি অক্ষরেই লিখুন, যেমন “khichuri recipe”। নির্দিষ্ট কিছু খুঁজতে শব্দগুলো উদ্ধৃতি চিহ্নে (“easy dal”) লিখুন। সাথে রেসিপি, খবর বা আবহাওয়ার মতো একটি শব্দ জুড়লে ফল আরও পরিষ্কার হয়।',
        },
        {
          id: 'c-ad',
          type: 'visual',
          textBn: 'ফলাফলে “Ad” লেখা বক্স টাকা দিয়ে ওপরে বসানো। সেটা সবসময় সেরা উত্তর নয়।',
          visual: { kind: 'art', name: 'magnifier', captionBn: 'শিরোনাম · ঠিকানা · বিবরণ' },
          chipsBn: ['Ad = বিজ্ঞাপন', 'শিরোনাম দেখুন', 'ঠিকানা দেখুন'],
          learnMoreBn: 'প্রতিটি ফলাফলে তিনটি জিনিস দেখুন: শিরোনাম (Title), ঠিকানা বা ডোমেইন (URL), আর ছোট বিবরণ (Snippet)। তারপর ঠিক করুন কোনটিতে যাবেন।',
        },
        {
          id: 'c-tabs',
          type: 'visual',
          textBn: '**ট্যাব** মানে আলাদা ঘর — এক ব্রাউজারে কয়েকটি পাতা পাশাপাশি খোলা থাকে। পিছনের তীর আগের পাতায় ফেরায়।',
          visual: { kind: 'mock', name: 'browser', highlight: 'tabs' },
          chipsBn: ['ট্যাব = আলাদা ঘর', '← পিছনে', '★ বুকমার্ক'],
          learnMoreBn: 'সামনের তীর (→) আবার এগিয়ে নিয়ে যায়, রিফ্রেশ পাতাটি নতুন করে আনে। আর তারা (★) চিহ্নে বুকমার্ক করলে পছন্দের পাতা পরে সহজে খুলে পাওয়া যায়।',
        },
      ],
      steps: [
        {
          id: 'search-words', osVariant: 'both', titleBn: 'অ্যাড্রেস বারে খুঁজুন', target: 'browser-address', expectedAction: { type: 'custom', event: 'browser-search' },
          explanationBn: 'বক্সে ক্লিক করে dal recipe লিখুন, Enter (Mac-এ Return) চাপুন।',
          hintBn: 'বক্সে ক্লিক করে dal recipe টাইপ করুন, তারপর Enter চাপুন।',
          simplerBn: 'ওপরের লম্বা সাদা বক্সে ক্লিক করুন। d-a-l, ফাঁকা, r-e-c-i-p-e লিখে Enter চাপুন।',
          teacherTipBn: 'পুরো বাক্য নয়, শুধু দরকারি শব্দ লিখলেই সার্চ ভালো কাজ করে — এই কথাটি এখানে বলে নিন।',
        },
        {
          id: 'open-result', osVariant: 'both', titleBn: 'প্রথম ফলাফলটি খুলুন', target: 'search-result-1', expectedAction: { type: 'click', target: 'search-result-1' },
          explanationBn: '“Ad” বক্স ছেড়ে নিচের প্রথম নীল শিরোনামে ক্লিক করুন।',
          hintBn: '“মসুর ডালের সহজ রেসিপি” লেখা নীল শিরোনামে ক্লিক করুন।',
          simplerBn: 'নীল রঙের লেখাটিই লিংক। তার ওপর একবার ক্লিক করুন।',
        },
        {
          id: 'go-back', osVariant: 'both', titleBn: 'পিছনের তীরে ক্লিক করুন', target: 'browser-back', expectedAction: { type: 'click', target: 'browser-back' },
          explanationBn: 'পিছনের তীর (←) চেপে সার্চের তালিকায় ফিরুন।',
          hintBn: 'অ্যাড্রেস বারের বাঁ পাশের দুটি তীরের বাঁ দিকেরটি।',
          successMessageBn: 'ফিরে এসেছেন!',
        },
        {
          id: 'go-forward', osVariant: 'both', titleBn: 'সামনের তীরে ক্লিক করুন', target: 'browser-forward', expectedAction: { type: 'click', target: 'browser-forward' },
          explanationBn: 'সামনের তীর (→) চেপে আবার রেসিপিতে যান।',
          hintBn: 'পিছনের তীরের ঠিক পাশের তীরটি।',
        },
        {
          id: 'new-tab', osVariant: 'both', titleBn: 'নতুন ট্যাব খুলুন', target: 'browser-new-tab', expectedAction: { type: 'click', target: 'browser-new-tab' },
          explanationBn: 'ট্যাবের সারির শেষে + চিহ্নে ক্লিক করুন।',
          hintBn: 'ট্যাবের নামের ডান পাশের + চিহ্নটি।',
          simplerBn: 'পাতার নাম লেখা ঘরের ঠিক পাশে ছোট একটি + আছে। ওটিতে ক্লিক করুন।',
          successMessageBn: 'নতুন ট্যাব!',
        },
        {
          id: 'type-address', osVariant: 'both', titleBn: 'ওয়েব ঠিকানা লিখুন', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://khobor.example/' },
          explanationBn: 'এবার শব্দ নয়, ঠিকানা: khobor.example লিখে Enter (Mac-এ Return) চাপুন।',
          hintBn: 'বক্সে khobor.example লিখে Enter চাপুন। মাঝে একটি ডট (.) আছে।',
          simplerBn: 'বক্সে ক্লিক করুন। k-h-o-b-o-r, ডট, e-x-a-m-p-l-e লিখে Enter চাপুন।',
        },
        {
          id: 'switch-tab', osVariant: 'both', titleBn: 'আগের ট্যাবে ফিরে যান', target: 'browser-tab-1', expectedAction: { type: 'click', target: 'browser-tab-1' },
          explanationBn: 'প্রথম ট্যাবে ক্লিক করুন। রেসিপি যেমন ছিল তেমনই আছে।',
          hintBn: 'ট্যাবের সারিতে বাঁ দিকের প্রথম ট্যাবটি।',
        },
        {
          id: 'bookmark', osVariant: 'both', titleBn: 'পাতাটি বুকমার্ক করুন', target: 'browser-bookmark', expectedAction: { type: 'click', target: 'browser-bookmark' },
          explanationBn: 'ঠিকানার বক্সের ডান প্রান্তের তারায় ক্লিক করুন।',
          hintBn: 'ঠিকানা লেখার বক্সের একদম ডান দিকের ছোট তারা।',
          simplerBn: 'ঠিকানার বক্সের ভেতরেই ডান কোণে ফাঁকা একটি তারা আছে। সেটিতে ক্লিক করুন।',
          successMessageBn: 'বুকমার্ক হয়েছে!',
        },
      ],
      quiz: [
        {
          id: 'q-domain', type: 'clickTarget', questionBn: 'https://www.example.com/page — এর কোন অংশটি ডোমেইন, সাইটের নাম?',
          items: [
            { id: 'scheme', labelBn: 'https://' },
            { id: 'domain', labelBn: 'www.example.com' },
            { id: 'path', labelBn: '/page' },
          ],
          correct: 'domain',
          hintBn: 'দোকানের সাইনবোর্ডে যে নাম লেখা থাকে, সেটি।',
          explanationBn: 'www.example.com সাইটের নাম, মানে ডোমেইন।',
        },
        {
          id: 'q-search', type: 'multipleChoice', questionBn: 'ভালো ফল পেতে সার্চ বক্সে কোনটি লিখবেন?',
          options: [
            { id: 'a', textBn: 'ডাল রেসিপি' },
            { id: 'b', textBn: 'আমি আজ রাতে কীভাবে ডাল রান্না করব সেটা বলে দাও' },
            { id: 'c', textBn: 'শুধু একটি ফাঁকা বক্স' },
          ],
          correct: ['a'],
          hintBn: 'ছোট, দরকারি শব্দই ভালো।',
          explanationBn: 'দরকারি শব্দ লিখলেই সার্চ ভালো কাজ করে।',
        },
        {
          id: 'q-match', type: 'dragMatch', questionBn: 'ব্রাউজারের জিনিসের সাথে তার কাজ মিলিয়ে দিন।',
          pairs: [
            { id: 'addr', leftBn: 'অ্যাড্রেস বার', rightBn: 'ঠিকানা লেখা বা খোঁজা' },
            { id: 'back', leftBn: 'পিছনের তীর', rightBn: 'আগের পাতায় ফেরা' },
            { id: 'tab', leftBn: 'ট্যাব', rightBn: 'আলাদা ঘরে পাতা খোলা' },
            { id: 'star', leftBn: 'তারা চিহ্ন', rightBn: 'পাতা বুকমার্ক করা' },
          ],
          hintBn: '“পিছনে” মানে ফেরা, “ট্যাব” মানে আলাদা ঘর।',
          explanationBn: 'এই চারটি দিয়েই ব্রাউজারের বেশিরভাগ কাজ হয়।',
        },
      ],
      recapBn: ['অ্যাড্রেস বার = ঠিকানা + সার্চ', 'ডোমেইন = সাইটের আসল নাম', '“Ad” মানে বিজ্ঞাপন'],
      freeTryBn: 'নিজের ব্রাউজারে “আজকের আবহাওয়া” সার্চ করে দেখুন।',
    },

    // =====================================================================================================
    {
      id: 'safe-sites',
      titleBn: 'ভালো সাইট বনাম সন্দেহজনক',
      hook: {
        id: 'h-safe',
        type: 'hook',
        textBn: 'কয়েকটা লক্ষণ চিনলে ঠকবাজ সাইটে আপনি **নিশ্চিন্তে** থাকতে পারবেন।',
        visual: { kind: 'art', name: 'shield' },
      },
      setup: browserOpen,
      cards: [
        {
          id: 'c-padlock',
          type: 'visual',
          textBn: 'ঠিকানার পাশের ছোট **তালা** বলে, আপনার আর সাইটের মাঝের তথ্য সুরক্ষিত পথে যাচ্ছে।',
          visual: { kind: 'mock', name: 'browser', highlight: 'padlock' },
          chipsBn: ['https = সুরক্ষিত পথ'],
          learnMoreBn: 'তালা মানে তথ্য পথে সুরক্ষিত, সাইটটি সৎ কি না সেটা নয়। তাই তালা দেখে থেমে না গিয়ে ডোমেইনের বানানও দেখুন।',
        },
        {
          id: 'c-lookalike',
          type: 'compare',
          textBn: 'তালা থাকলেও ঠকবাজ সাইট হতে পারে। তাই **ডোমেইনের বানান** খুঁটিয়ে দেখুন।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'আসল', captionBn: 'paypocket.example' },
            right: { visual: { kind: 'art', name: 'warning' }, labelBn: 'নকল', captionBn: 'paypocket-secure1ogin.example' },
            vs: 'বনাম',
          },
          learnMoreBn: 'নকল ঠিকানায় ইংরেজি l-এর জায়গায় সংখ্যা 1 বসানো। এমন ছোট বদলই ঠকবাজদের পুরোনো কৌশল।',
        },
        {
          id: 'c-signs',
          type: 'visual',
          textBn: 'তাড়া, লোভ বা ভয় দেখালে একটু **থামুন**। আসল সাইট কখনো এমন ভাবনার সময় কেড়ে নেয় না।',
          visual: { kind: 'art', name: 'didi-think', captionBn: 'তাড়া · লোভ · ভয়' },
          chipsBn: ['“১০ মিনিটে বন্ধ”', 'ফ্রি পুরস্কার', 'একের পর এক পপ-আপ'],
          learnMoreBn: 'আরও কিছু লক্ষণ: বানান ভুল, এলোমেলো সাজানো পাতা, বিনা কারণে ফ্রি ফোন বা টাকা জেতার খবর।',
        },
        {
          id: 'c-otp',
          type: 'visual',
          textBn: '**OTP**, PIN বা পাসওয়ার্ড কোনো পাতায় লিখবেন না, কাউকে বলবেনও না। আসল প্রতিষ্ঠান এভাবে চায় না।',
          visual: { kind: 'art', name: 'otp-code', captionBn: 'এটা শুধু আপনার' },
        },
        {
          id: 'c-leave',
          type: 'visual',
          textBn: 'সন্দেহ হলে কিছু না লিখে পাতাটি **বন্ধ** করে দিন। সরে আসাটাই সবচেয়ে নিরাপদ।',
          visual: { kind: 'art', name: 'shield', captionBn: 'সরে এলেই নিরাপদ' },
          chipsBn: ['পিছনে যান', 'পাতা বন্ধ করুন'],
        },
      ],
      steps: [
        {
          id: 'visit-scam', osVariant: 'both', titleBn: 'শেখার জন্য একটি নমুনা সাইট', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://free-prize-claim.example/' },
          explanationBn: 'এটি শেখার নমুনা, বিপদ নেই। বক্সে free-prize-claim.example লিখে Enter চাপুন।',
          hintBn: 'মাঝের দাগগুলো (হাইফেন -) ভুলবেন না।',
          simplerBn: 'বক্সে ক্লিক করে f-r-e-e, দাগ, p-r-i-z-e, দাগ, c-l-a-i-m, ডট, e-x-a-m-p-l-e লিখে Enter চাপুন।',
        },
        {
          id: 'close-popup', osVariant: 'both', titleBn: 'পপ-আপ বন্ধ করুন', target: 'scam-popup-close', expectedAction: { type: 'click', target: 'scam-popup-close' },
          explanationBn: 'পপ-আপে OK নয়, ডান কোণের ✕ চিহ্নে ক্লিক করুন।',
          hintBn: 'পপ-আপের ডান ওপরের ছোট ✕ চিহ্নটি।',
          successMessageBn: 'বন্ধ করে দিয়েছেন!',
        },
        {
          id: 'spot-urgent', osVariant: 'both', titleBn: 'তাড়া দেওয়া লেখাটি চিনুন', target: 'scam-urgent', expectedAction: { type: 'click', target: 'scam-urgent' },
          explanationBn: 'তাড়া দেওয়া লাল লেখাটিতে ক্লিক করে চিনিয়ে দিন।',
          hintBn: '“URGENT!!!” দিয়ে শুরু হওয়া লাল লেখাটি।',
          successMessageBn: 'ঠিক চিনেছেন!',
        },
        {
          id: 'spot-otp', osVariant: 'both', titleBn: 'যে ঘর দেখে সতর্ক হবেন', target: 'scam-otp', expectedAction: { type: 'click', target: 'scam-otp' },
          explanationBn: 'OTP চাওয়া ঘরটিতে ক্লিক করুন, কিন্তু কিছু লিখবেন না।',
          hintBn: 'বক্সের ভেতর “OTP / PIN” লেখা ঘরটি।',
          successMessageBn: 'চমৎকার সতর্কতা!',
          teacherTipBn: 'এখানে জোর দিয়ে বলুন: আসল জীবনে OTP/PIN কাউকে বলা বা কোনো পাতায় লেখা চলবে না, এমনকি পরিচিত নাম শুনলেও না।',
        },
        {
          id: 'leave-scam', osVariant: 'both', titleBn: 'পিছনে ফিরে যান', target: 'browser-back', expectedAction: { type: 'click', target: 'browser-back' },
          explanationBn: 'পিছনের তীরে ক্লিক করে সরে আসুন।',
          hintBn: 'বাঁ দিকের পিছনের তীরটি (←)।',
          successMessageBn: 'নিরাপদে সরে এলেন!',
        },
      ],
      quiz: [
        {
          id: 'q-suspicious', type: 'clickTarget', questionBn: 'কোন ঠিকানাটির বানান ঠকবাজের মতো বদলানো?',
          items: [
            { id: 'a', labelBn: 'https://rannaghor.example/' },
            { id: 'b', labelBn: 'https://paypocket-secure1ogin.example/' },
            { id: 'c', labelBn: 'https://khobor.example/' },
            { id: 'd', labelBn: 'https://download.official-editor.example/' },
          ],
          correct: 'b',
          hintBn: 'আসল নামটি হওয়ার কথা “login”। l-এর জায়গায় অন্য কিছু আছে কি?',
          explanationBn: '“secure1ogin”-এ l-এর জায়গায় সংখ্যা 1 বসানো।',
        },
        {
          id: 'q-padlock', type: 'multipleChoice', questionBn: 'ঠিকানার পাশে তালা থাকলে কী বোঝায়?',
          options: [
            { id: 'a', textBn: 'সাইটটি অবশ্যই ভালো' },
            { id: 'b', textBn: 'তথ্য সুরক্ষিত পথে যায়, তবু সাইটটি ঠকবাজ হতে পারে' },
            { id: 'c', textBn: 'সাইটে ভাইরাস থাকতেই পারে না' },
          ],
          correct: ['b'],
          hintBn: 'তালা শুধু পথের কথা বলে, সাইটের সততার নয়।',
          explanationBn: 'তালা থাকলেও ডোমেইনের বানান দেখতে হবে।',
        },
        {
          id: 'q-otp', type: 'multipleChoice', questionBn: 'পুরস্কারের পাতা OTP বা PIN চাইলে কী করবেন?',
          options: [
            { id: 'a', textBn: 'তাড়াতাড়ি লিখে দেব' },
            { id: 'b', textBn: 'কিছু না লিখে পাতাটি বন্ধ করব' },
            { id: 'c', textBn: 'বন্ধুকে OTP পাঠিয়ে দেব' },
          ],
          correct: ['b'],
          hintBn: 'OTP আর PIN শুধু আপনার জন্য।',
          explanationBn: 'OTP কাউকে দেবেন না, পাতা বন্ধ করুন।',
        },
      ],
      recapBn: ['তালা মানেই ভালো সাইট নয়', 'তাড়া বা লোভ দেখলে থামুন', 'OTP/PIN কখনো লিখবেন না'],
      freeTryBn: 'কোনো সাইটের ঠিকানার বানান ধীরে পড়ে দেখুন।',
    },

    // =====================================================================================================
    {
      id: 'safe-download',
      titleBn: 'নিরাপদে ডাউনলোড',
      hook: {
        id: 'h-dl',
        type: 'hook',
        textBn: 'ফাইল নামানোর আগে একটাই প্রশ্ন: এটা কি **আসল** সাইট?',
        visual: { kind: 'art', name: 'download' },
      },
      setup: browserOpen,
      cards: [
        {
          id: 'c-what',
          type: 'visual',
          textBn: '**ডাউনলোড** মানে ইন্টারনেট থেকে ফাইল আপনার কম্পিউটারে নামানো।',
          visual: { kind: 'art', name: 'download', captionBn: 'ইন্টারনেট → কম্পিউটার' },
        },
        {
          id: 'c-official',
          type: 'compare',
          textBn: 'প্রোগ্রাম নামান শুধু তার **আসল সাইট** থেকে। বিজ্ঞাপনের “Download Now” বোতাম ফাঁদ।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'check' }, labelBn: 'আসল সাইট', captionBn: 'নিজের বোতাম' },
            right: { visual: { kind: 'art', name: 'warning' }, labelBn: 'বিজ্ঞাপন', captionBn: '“Download Now” ফাঁদ' },
            vs: 'বনাম',
          },
          learnMoreBn: 'বিজ্ঞাপনের বোতাম প্রায়ই আসল বোতামের চেয়ে বড় আর উজ্জ্বল হয়, যাতে আপনি ভুলে ক্লিক করেন। আসল বোতামে সাধারণত প্রোগ্রামের পুরো নাম লেখা থাকে।',
        },
        {
          id: 'c-folder',
          type: 'visual',
          textBn: 'নামানো ফাইল সাধারণত **Downloads** ফোল্ডারে জমা হয়। ওখানেই খুঁজবেন।',
          visual: { kind: 'art', name: 'folder', captionBn: 'Downloads' },
        },
        {
          id: 'c-exe',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'Windows-এ ইনস্টল করার ফাইলের নামের শেষে থাকে **exe**। অচেনা সাইটের এমন ফাইল খুলবেন না।',
          visual: { kind: 'art', name: 'package-box', captionBn: 'OfficialEditor-setup.exe' },
          learnMoreBn: 'অচেনা সাইট থেকে আসা .exe, .msi, .zip ফাইলে ভাইরাস থাকতে পারে। তাই শুধু আসল সাইটের ফাইলই নামান।',
        },
        {
          id: 'c-dmg',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'Mac-এ ইনস্টল করার ফাইলের নামের শেষে থাকে **dmg**। অচেনা সাইটের এমন ফাইল খুলবেন না।',
          visual: { kind: 'art', name: 'package-box', captionBn: 'OfficialEditor.dmg' },
          learnMoreBn: 'অচেনা সাইট থেকে আসা .dmg, .pkg, .zip ফাইলে ভাইরাস থাকতে পারে। তাই শুধু আসল সাইটের ফাইলই নামান।',
        },
      ],
      steps: [
        {
          id: 'go-official', osVariant: 'both', titleBn: 'আসল ডাউনলোড পাতায় যান', target: 'browser-address', expectedAction: { type: 'navigate', path: 'https://download.official-editor.example/' },
          explanationBn: 'বক্সে download.official-editor.example লিখে Enter চাপুন।',
          hintBn: 'মাঝের দাগ (-) ভুলবেন না। এটি OfficialEditor-এর আসল সাইট।',
          simplerBn: 'বক্সে ক্লিক করে লিখুন: download ডট official-editor ডট example। তারপর Enter।',
        },
        {
          id: 'download-real', osVariant: 'both', titleBn: 'আসল বোতাম থেকে নামান', target: 'download-official', expectedAction: { type: 'custom', event: 'browser-download-done' },
          explanationBn: 'ওপরের নীল বোতামে ক্লিক করুন। “AD” বক্সের বোতামটি ফাঁদ, ওটা ছাড়ুন।',
          hintBn: 'যে বোতামে OfficialEditor… লেখা, সেই নীল বোতামে ক্লিক করে অপেক্ষা করুন।',
          simplerBn: 'পাতার ওপরের নীল বোতামটিতে ক্লিক করে অপেক্ষা করুন। নিচের উজ্জ্বল বোতামটি ছোঁবেন না।',
          successMessageBn: 'ফাইলটি নেমে গেছে!',
        },
        {
          id: 'w-open-explorer', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'টাস্কবারের ফোল্ডার আইকনে (File Explorer) ক্লিক করুন।',
          hintBn: 'টাস্কবারে হলুদ ফোল্ডারের আইকনটি।',
        },
        {
          id: 'w-downloads', osVariant: 'windows', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'click', target: 'fm-sidebar-Downloads' },
          explanationBn: 'বাঁ দিকের তালিকায় “Downloads”-এ ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকায় Downloads লেখাটি।',
        },
        {
          id: 'w-see-file', osVariant: 'windows', titleBn: 'নামানো ফাইলটি খুঁজে নিন', target: 'fm-item-OfficialEditor-setup.exe', expectedAction: { type: 'click', target: 'fm-item-OfficialEditor-setup.exe' },
          explanationBn: 'OfficialEditor-setup.exe ফাইলটিতে একবার ক্লিক করুন, খুলবেন না।',
          hintBn: 'ফোল্ডারের ভেতরে OfficialEditor-setup.exe নামের ফাইলটি।',
          successMessageBn: 'এই তো আপনার ফাইল!',
        },
        {
          id: 'm-open-finder', osVariant: 'mac', titleBn: 'ফাইন্ডার (Finder) খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
          explanationBn: 'ডকের একদম বাঁ দিকের আইকনে (Finder) ক্লিক করুন।',
          hintBn: 'ডকের প্রথম আইকন, হাসিমুখের মতো দেখতে।',
        },
        {
          id: 'm-downloads', osVariant: 'mac', titleBn: 'Downloads ফোল্ডারে যান', target: 'fm-sidebar-Downloads', expectedAction: { type: 'click', target: 'fm-sidebar-Downloads' },
          explanationBn: 'বাঁ দিকের তালিকায় “Downloads”-এ ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকায় Downloads লেখাটি।',
        },
        {
          id: 'm-see-file', osVariant: 'mac', titleBn: 'নামানো ফাইলটি খুঁজে নিন', target: 'fm-item-OfficialEditor.dmg', expectedAction: { type: 'click', target: 'fm-item-OfficialEditor.dmg' },
          explanationBn: 'OfficialEditor.dmg ফাইলটিতে একবার ক্লিক করুন, খুলবেন না।',
          hintBn: 'ফোল্ডারের ভেতরে OfficialEditor.dmg নামের ফাইলটি।',
          successMessageBn: 'এই তো আপনার ফাইল!',
        },
      ],
      quiz: [
        {
          id: 'q-order', type: 'ordering', questionBn: 'নিরাপদে প্রোগ্রাম নামানোর ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'প্রোগ্রামটির আসল সাইটে যাই' },
            { id: '2', textBn: '“Ad” নয়, আসল ডাউনলোড বোতামে ক্লিক করি' },
            { id: '3', textBn: 'নামার লাইন ভরা পর্যন্ত অপেক্ষা করি' },
            { id: '4', textBn: 'Downloads ফোল্ডারে ফাইলটি খুঁজি' },
          ],
          hintBn: 'আগে ঠিক জায়গায় যান, ফাইল খোঁজা সবার শেষে।',
          explanationBn: 'আসল সাইট, আসল বোতাম, অপেক্ষা, Downloads।',
        },
        {
          id: 'q-ad', type: 'multipleChoice', questionBn: 'পাতায় “Ad” লেখা বক্সে বড় “Download Now” বোতাম দেখলে কী করবেন?',
          options: [
            { id: 'a', textBn: 'দ্রুত ক্লিক করে ফেলব' },
            { id: 'b', textBn: 'ওটা ছেড়ে সাইটের আসল বোতাম খুঁজব' },
            { id: 'c', textBn: 'নামানো ফাইল সঙ্গে সঙ্গে খুলে ফেলব' },
          ],
          correct: ['b'],
          hintBn: 'বিজ্ঞাপনের বোতাম প্রায়ই ফাঁদ।',
          explanationBn: 'আসল বোতামটি খুঁজে নিন, বিজ্ঞাপন ছাড়ুন।',
        },
        {
          id: 'q-folder', type: 'multipleChoice', questionBn: 'ইন্টারনেট থেকে নামানো ফাইল সাধারণত কোথায় পাবেন?',
          options: [
            { id: 'a', textBn: 'Downloads ফোল্ডারে' },
            { id: 'b', textBn: 'ব্রাউজারের ট্যাবে' },
            { id: 'c', textBn: 'রাউটারের ভেতরে' },
          ],
          correct: ['a'],
          hintBn: 'নামে “ডাউনলোড” আছে।',
          explanationBn: 'নামানো ফাইল Downloads ফোল্ডারে জমা হয়।',
        },
      ],
      recapBn: ['আসল সাইট থেকেই নামান', '“Ad” বোতাম ফাঁদ', 'ফাইল থাকে Downloads-এ'],
      freeTryBn: 'নিজের Downloads ফোল্ডার খুলে শুধু দেখুন, কিছু খুলবেন না।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'ব্রাউজারে একটি পরিচিত সাইট খুলে ঠিকানার পাশে তালার চিহ্ন দেখুন।',
      '“আজকের আবহাওয়া” সার্চ করে কোন ফলাফলে “Ad” লেখা আছে আঙুল দিয়ে দেখান।',
      'একটি পছন্দের পাতা তারা (★) দিয়ে বুকমার্ক করুন।',
    ],
    windowsTasksBn: ['ফাইল এক্সপ্লোরারে Downloads ফোল্ডারটি শুধু দেখুন, কিছু খুলবেন না।'],
    macTasksBn: ['ফাইন্ডারে Downloads ফোল্ডারটি শুধু দেখুন, কিছু খুলবেন না।'],
  },

  teacherTipBn:
    'এই পাঠের সবচেয়ে জরুরি অংশ হলো সন্দেহজনক সাইট চেনা আর OTP/PIN না বলা। তাড়াহুড়ো আর লোভ দেখানো — এই দুটি লক্ষণ বারবার বলুন। আসল জীবনের কোনো ঘটনার উদাহরণ থাকলে (নাম না করে) গল্পের মতো শোনান। ভয় দেখাবেন না — বলুন, সরে আসাই সবচেয়ে ভালো উপায়। ওয়াই-ফাই আর মোবাইল ডেটার তফাত কেউ গুলিয়ে ফেললে প্রথম ইউনিটের সুইচগুলো দিয়ে বুঝিয়ে দিন।',
}

export default lesson
