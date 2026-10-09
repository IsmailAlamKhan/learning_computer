import type { Lesson } from '../../engine/types'

const DIFF = 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে'

/**
 * Module 9 — safety and scams, cards format. Four units:
 * (1) passwords, (2) OTP / PIN / 2-step, (3) phishing and fake calls, (4) everyday safe habits (lock screen, public Wi-Fi).
 * All names, numbers and links in the examples are fictional (TakaPay, Namuna Bank, 01XXXXXXXXX).
 * Practice step targets / expectedActions are the same as in the old guided practice; units 1–3 only add one safe "open an app" click.
 */
const lesson: Lesson = {
  module: 9,
  part: 1,
  id: 'm09',
  titleBn: 'নিরাপত্তা ও প্রতারণা থেকে সাবধান',
  oneLineBn: 'পাসওয়ার্ড, OTP, ফিশিং ও ভুয়া বিকাশ/নগদ-জাতীয় কল চিনে নিজেকে সুরক্ষিত রাখি।',
  minutes: 8,
  glossaryIds: ['password', 'passphrase', 'password-manager', 'two-factor-auth', 'otp', 'pin', 'phishing', 'scam', 'fraud', 'malware', 'virus', 'antivirus', 'update', 'public-wifi', 'lock-screen', 'privacy', 'permission', 'fake-link'],

  units: [
    // =====================================================================================================
    {
      id: 'passwords',
      titleBn: 'পাসওয়ার্ড',
      hook: {
        id: 'h-pw',
        type: 'hook',
        textBn: 'বাসায় তালা লাগান তো? **অ্যাকাউন্টেরও** চাবি লাগে — তার নাম পাসওয়ার্ড।',
        visual: { kind: 'art', name: 'lock' },
      },
      cards: [
        {
          id: 'c-long',
          type: 'compare',
          textBn: 'জটিল চিহ্ন নয়, **লম্বা** হওয়াই আসল শক্তি। চারটি এলোমেলো শব্দ জুড়ে বানান **পাসফ্রেজ**।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'lock' }, labelBn: 'P@ss1', captionBn: 'ছোট, দুর্বল' },
            right: { visual: { kind: 'art', name: 'shield' }, labelBn: 'নদী-চা-জানালা-মেঘ', captionBn: 'লম্বা, শক্ত' },
            vs: 'বনাম',
          },
          chipsBn: ['লম্বা = শক্ত', 'মনে রাখা সহজ'],
          learnMoreBn: 'নিজের নাম, জন্মসাল, ফোন নম্বর বা “123456” ব্যবহার করবেন না — এগুলো সবার আগে অনুমান করা হয়। চারটি এলোমেলো শব্দের পাসফ্রেজ লম্বা, মনে রাখা সহজ, আবার অনুমান করা কঠিন।',
        },
        {
          id: 'c-pw-widget',
          type: 'visual',
          textBn: 'পারেন? নিচে একটা **পাসফ্রেজ** বানিয়ে দেখুন — আসল পাসওয়ার্ড নয়।',
          visual: { kind: 'widget', widget: 'password-strength' },
        },
        {
          id: 'c-unique',
          type: 'visual',
          textBn: 'এক পাসওয়ার্ড সব জায়গায় নয়। একটা ফাঁস হলে বাকি সব অ্যাকাউন্টও বিপদে পড়ে।',
          visual: { kind: 'art', name: 'key', captionBn: 'এক চাবি, এক তালা' },
          chipsBn: ['প্রতিটিতে আলাদা', 'নিজের নাম নয়'],
          learnMoreBn: 'পাসওয়ার্ড কাগজে লিখে নিরাপদ জায়গায় রাখলেও সমস্যা নেই — তবে ছবি তুলে ফোনে রাখবেন না।',
        },
        {
          id: 'c-manager',
          type: 'visual',
          textBn: '**পাসওয়ার্ড ম্যানেজার** সব পাসওয়ার্ড তালাবন্ধ আলমারিতে রাখে। আপনার মনে রাখতে হয় শুধু একটি।',
          visual: { kind: 'art', name: 'almirah', captionBn: 'একটি মূল পাসওয়ার্ড' },
          chipsBn: ['ব্রাউজারের বিল্ট-ইন', 'ফোন-কোম্পানির নিজস্ব'],
          learnMoreBn: 'ব্রাউজার, Apple, Google বা Microsoft-এর বিল্ট-ইন ম্যানেজারও চলে — নিজের পছন্দের একটি বেছে নিন। মূল পাসওয়ার্ডটি হবে আপনার সবচেয়ে শক্ত পাসফ্রেজ।',
        },
      ],
      steps: [
        {
          id: 'w-pw-start', osVariant: 'windows', titleBn: 'স্টার্ট খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'অ্যাকাউন্টের পাসওয়ার্ড ওয়েবসাইটে লাগে। আগে স্টার্ট বোতামে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চার-খোপের Windows আইকনটি।',
          successMessageBn: 'স্টার্ট খুলেছে!',
        },
        {
          id: 'w-pw-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'তালিকা থেকে “Web Browser”-এ ক্লিক করুন।',
          hintBn: 'গোলকের মতো আইকনের পাশে Web Browser লেখা।',
          successMessageBn: 'ব্রাউজার খুলেছে!',
        },
        {
          id: 'm-pw-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'ডকে গোলকের মতো আইকনটিতে (ব্রাউজার) ক্লিক করুন।',
          hintBn: 'ডকের বাঁ দিক থেকে তৃতীয় আইকনটি।',
          successMessageBn: 'ব্রাউজার খুলেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-strongest', type: 'clickTarget', questionBn: 'কোনটি সবচেয়ে শক্ত পাসওয়ার্ড?',
          items: [
            { id: 'num', labelBn: 'password123', icon: '🔢' },
            { id: 'name', labelBn: 'Rina2005 (নাম + জন্মসাল)', icon: '🎂' },
            { id: 'phrase', labelBn: 'নদী-চা-জানালা-মেঘ', icon: '🌧️' },
          ],
          correct: 'phrase',
          hintBn: 'লম্বা আর অনুমান করা কঠিন — কোনটি?',
          explanationBn: 'ঠিক! চারটি এলোমেলো শব্দের পাসফ্রেজ লম্বা ও শক্ত।',
        },
        {
          id: 'q-same-pw', type: 'multipleChoice', questionBn: 'সব অ্যাকাউন্টে এক পাসওয়ার্ড দিলে কী বিপদ?',
          options: [
            { id: 'a', textBn: 'কোনো বিপদ নেই' },
            { id: 'b', textBn: 'একটি ফাঁস হলে সব অ্যাকাউন্ট বিপদে' },
            { id: 'c', textBn: 'কম্পিউটার ধীর হয়ে যায়' },
          ],
          correct: ['b'],
          hintBn: 'একটা চাবি হারালে কটা তালা খোলা যায়, ভাবুন।',
          explanationBn: 'এক চাবিতে সব তালা — তাই প্রতিটিতে আলাদা পাসওয়ার্ড।',
        },
        {
          id: 'q-manager', type: 'multipleChoice', questionBn: 'পাসওয়ার্ড ম্যানেজার ব্যবহারে আপনাকে কী মনে রাখতে হয়?',
          options: [
            { id: 'a', textBn: 'শুধু একটি মূল পাসওয়ার্ড' },
            { id: 'b', textBn: 'সব পাসওয়ার্ড আলাদা করে' },
            { id: 'c', textBn: 'কিছুই না, কখনো না' },
          ],
          correct: ['a'],
          hintBn: 'আলমারির একটাই চাবি।',
          explanationBn: 'ঠিক! বাকিগুলো ম্যানেজার মনে রাখে।',
        },
      ],
      recapBn: ['লম্বা পাসফ্রেজ বানান', 'প্রতিটিতে আলাদা পাসওয়ার্ড', 'ম্যানেজারে রাখুন'],
      freeTryBn: 'আরেকটি পাসফ্রেজ বানিয়ে “খুব ভালো” ফল পান।',
    },

    // =====================================================================================================
    {
      id: 'otp-2fa',
      titleBn: 'OTP, PIN ও ২-ধাপ যাচাই',
      hook: {
        id: 'h-otp',
        type: 'hook',
        textBn: 'বাসার চাবি কি অচেনা কাউকে দেন? **OTP-ও** তেমনই গোপন।',
        visual: { kind: 'art', name: 'otp-code' },
      },
      cards: [
        {
          id: 'c-otp-pin',
          type: 'visual',
          textBn: '**OTP** একবার ব্যবহারের কোড, ফোনে আসে। **PIN** আপনার গোপন সংখ্যা।',
          visual: { kind: 'art', name: 'otp-code', captionBn: 'যেমন: 4 8 2 9 1 7' },
          chipsBn: ['OTP = এক-বারের কোড', 'PIN = গোপন সংখ্যা'],
        },
        {
          id: 'c-never-share',
          type: 'visual',
          textBn: 'OTP আর PIN **কাউকে বলবেন না** — ব্যাংক, পুলিশ বা সাপোর্টের লোক সেজে চাইলেও।',
          visual: { kind: 'art', name: 'warning', captionBn: 'আসল প্রতিষ্ঠান কখনো চায় না' },
          chipsBn: ['কাউকে নয়', 'কখনো নয়'],
          learnMoreBn: 'আসল কর্মীরও আপনার কোড জানার দরকার নেই। নিজে না চাইতেই হঠাৎ OTP এলে কাউকে বলবেন না, আর পাসওয়ার্ড বদলে নিন।',
        },
        {
          id: 'c-2fa',
          type: 'visual',
          textBn: '**২-ধাপ যাচাই**: পাসওয়ার্ডের পরে ফোনের কোড। যেন দরজার পরে আলমারির আলাদা তালা।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'key', labelBn: 'পাসওয়ার্ড' },
              { art: 'phone', labelBn: 'ফোনের কোড' },
              { art: 'check', labelBn: 'ঢুকলেন' },
            ],
          },
          chipsBn: ['অ্যাপের কোড ভালো', 'ব্যাকআপ কোড রাখুন'],
          learnMoreBn: 'অ্যাপ-ভিত্তিক কোড (authenticator অ্যাপ) সাধারণত বেশি নিরাপদ; এসএমএসের কোডও কিছু না থাকার চেয়ে ভালো। অনেক সেবা ব্যাকআপ কোড দেয় — ফোন হারালে এটি দিয়ে ঢোকা যায়। সেগুলো নিরাপদ জায়গায় লিখে রাখুন।',
        },
        {
          id: 'c-2fa-where',
          type: 'visual',
          textBn: 'ইমেইল, ফেসবুক, ব্যাংকের অ্যাপ — সব জায়গার **সেটিংসেই** ২-ধাপ যাচাই চালু করা যায়।',
          visual: { kind: 'art', name: 'shield', captionBn: 'সেটিংসে খুঁজুন' },
        },
      ],
      steps: [
        {
          id: 'w-2fa-settings', osVariant: 'windows', titleBn: 'Settings খুলুন', target: 'taskbar-app-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'নিরাপত্তার সেটিংস থাকে Settings-এ। টাস্কবারের গিয়ার আইকনে ক্লিক করুন।',
          hintBn: 'টাস্কবারে ছোট গিয়ার (⚙) আইকনটি।',
          successMessageBn: 'Settings খুলেছে!',
        },
        {
          id: 'm-2fa-settings', osVariant: 'mac', titleBn: 'Settings খুলুন', target: 'dock-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'নিরাপত্তার সেটিংস থাকে Settings-এ। ডকের গিয়ার আইকনে ক্লিক করুন।',
          hintBn: 'ডকে ছোট গিয়ার (⚙) আইকনটি।',
          successMessageBn: 'Settings খুলেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-click-suspicious', type: 'clickTarget', questionBn: 'এসএমএস: “অ্যাকাউন্ট আজই বন্ধ হবে! লিংকে গিয়ে PIN দিন।” সবচেয়ে বিপজ্জনক অংশ কোনটি?',
          items: [
            { id: 'greeting', labelBn: 'বার্তাটি এসেছে', icon: '💬' },
            { id: 'pin', labelBn: '“লিংকে গিয়ে PIN দিন”', icon: '🔑' },
            { id: 'time', labelBn: 'বার্তার সময়', icon: '🕒' },
          ],
          correct: 'pin',
          hintBn: 'কোনটি কাউকে, কোথাও দিতে নেই?',
          explanationBn: 'ঠিক! PIN বা OTP কোনো লিংক বা ফোনে দিতে নেই।',
        },
        {
          id: 'q-2fa', type: 'multipleChoice', questionBn: '২-ধাপ যাচাই চালু থাকলে কী সুবিধা?',
          options: [
            { id: 'a', textBn: 'পাসওয়ার্ড ফাঁস হলেও দ্বিতীয় প্রমাণ ছাড়া ঢোকা কঠিন' },
            { id: 'b', textBn: 'আর কখনো পাসওয়ার্ড লাগে না' },
            { id: 'c', textBn: 'OTP কাউকে বললেও ক্ষতি হয় না' },
          ],
          correct: ['a'],
          hintBn: 'এটি পাসওয়ার্ডের পাশে আরেকটি পাহারা।',
          explanationBn: 'ঠিক! তবে সেই কোডও কাউকে বলা যায় না।',
        },
        {
          id: 'q-match-otp', type: 'dragMatch', questionBn: 'পরিস্থিতির সাথে সঠিক কাজ মিলিয়ে দিন।',
          pairs: [
            { id: 'ask', leftBn: 'কেউ ফোনে OTP চাইল', rightBn: 'কাউকে বলব না' },
            { id: 'lost', leftBn: 'ফোন হারিয়ে গেল', rightBn: 'ব্যাকআপ কোড ব্যবহার' },
            { id: 'sudden', leftBn: 'নিজে না চাইতেই OTP এল', rightBn: 'পাসওয়ার্ড বদলে নিই' },
            { id: 'twofa', leftBn: '২-ধাপ যাচাই', rightBn: 'দ্বিতীয় তালা' },
          ],
          hintBn: 'প্রতিটি পরিস্থিতিতে সবচেয়ে নিরাপদ কাজটি কী?',
          explanationBn: 'চমৎকার! সব মিলেছে।',
        },
      ],
      recapBn: ['OTP, PIN কাউকে নয়', 'আসল প্রতিষ্ঠান চায় না', '২-ধাপ = দ্বিতীয় তালা'],
      freeTryBn: 'নিয়মটি নিজের ভাষায় একবার বলুন: “OTP কাউকে নয়।”',
    },

    // =====================================================================================================
    {
      id: 'phishing',
      titleBn: 'ফিশিং ও ভুয়া কল/মেসেজ',
      hook: {
        id: 'h-fish',
        type: 'hook',
        textBn: '“আপনি পুরস্কার জিতেছেন!” শুনলে আগে **থামুন**, তারপর ভাবুন।',
        visual: { kind: 'art', name: 'fishing-hook' },
      },
      cards: [
        {
          id: 'c-phish',
          type: 'visual',
          textBn: '**ফিশিং** মানে টোপ। আসলের মতো সাজানো ভুয়া মেসেজ বা সাইট, যা পাসওয়ার্ড বা কোড চায়।',
          visual: { kind: 'art', name: 'fishing-hook', captionBn: 'টোপে ঠোকর নয়' },
          chipsBn: ['ভয়', 'লোভ', 'তাড়া'],
          learnMoreBn: 'ফিশিং হতে পারে ইমেইল, এসএমএস, ফোন কল, সামাজিক মাধ্যমের মেসেজ বা পপ-আপ। তাড়া, ভয়, লোভ, অদ্ভুত বানান আর “প্রিয় গ্রাহক” — এগুলো সন্দেহের লক্ষণ।',
        },
        {
          id: 'c-sms',
          type: 'visual',
          textBn: '“টাকাপে অ্যাকাউন্ট বন্ধ হবে! এখনই লিংকে PIN দিন” — **ভয় আর তাড়া**, দুটোই ফাঁদের লক্ষণ।',
          visual: { kind: 'art', name: 'sms', captionBn: 'কাল্পনিক নাম: টাকাপে' },
          chipsBn: ['ভয় দেখায়', 'তাড়া দেয়'],
        },
        {
          id: 'c-link-widget',
          type: 'visual',
          textBn: 'পারেন? লিংকের ওপর মাউস রেখে (ফোনে চেপে ধরে) **আসল ঠিকানা** দেখুন।',
          visual: { kind: 'widget', widget: 'phishing-link-check' },
        },
        {
          id: 'c-call',
          type: 'visual',
          textBn: 'ভয় বা লোভ দেখিয়ে কল এলে — **কেটে দিন**, তারপর অফিসিয়াল নম্বরে নিজে ফোন করুন।',
          visual: {
            kind: 'flow',
            items: [
              { art: 'phone', labelBn: 'অচেনা কল' },
              { art: 'cross', labelBn: 'কেটে দিন' },
              { art: 'id-card', labelBn: 'অফিসিয়াল নম্বর' },
            ],
          },
          chipsBn: ['অ্যাপ বা কার্ডের নম্বর', 'কলের নম্বরে নয়'],
        },
        {
          id: 'c-scam-widget',
          type: 'visual',
          textBn: 'পারেন? কোনটি নিরাপদ আর কোনটি ফাঁদ — কিছু বার্তা **ঠিকও** আছে!',
          visual: { kind: 'widget', widget: 'spot-the-scam' },
        },
      ],
      steps: [
        {
          id: 'w-ph-start', osVariant: 'windows', titleBn: 'স্টার্ট খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
          explanationBn: 'সন্দেহের লিংক সবসময় ব্রাউজারে নিজে খুলুন। আগে স্টার্টে ক্লিক করুন।',
          hintBn: 'টাস্কবারের চার-খোপের Windows আইকনটি।',
          successMessageBn: 'স্টার্ট খুলেছে!',
        },
        {
          id: 'w-ph-browser', osVariant: 'windows', titleBn: 'ব্রাউজার খুলুন', target: 'start-app-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'তালিকা থেকে “Web Browser”-এ ক্লিক করুন।',
          hintBn: 'গোলকের মতো আইকনের পাশে Web Browser লেখা।',
          successMessageBn: 'নিজে খুলেছেন, বেশ!',
        },
        {
          id: 'm-ph-browser', osVariant: 'mac', titleBn: 'ব্রাউজার খুলুন', target: 'dock-browser', expectedAction: { type: 'openApp', app: 'browser' },
          explanationBn: 'সন্দেহের লিংক নিজে ব্রাউজারে খুলুন। ডকের গোলক-আইকনে ক্লিক করুন।',
          hintBn: 'ডকের বাঁ দিক থেকে তৃতীয় আইকনটি।',
          successMessageBn: 'নিজে খুলেছেন, বেশ!',
        },
      ],
      quiz: [
        {
          id: 'q-friend-dm', type: 'multipleChoice', questionBn: 'বান্ধবীর নামে মেসেজ: “বিপদে আছি, এখনই ৫,০০০ টাকা পাঠাও।” কী করবেন?',
          options: [
            { id: 'a', textBn: 'সাথে সাথে টাকা পাঠাব' },
            { id: 'b', textBn: 'তার পরিচিত নম্বরে ফোন করে জানব' },
            { id: 'c', textBn: 'মেসেজের নম্বরে ফোন করব' },
          ],
          correct: ['b'],
          hintBn: 'অ্যাকাউন্ট হ্যাক হলে প্রতারকও বন্ধু সাজে। যাচাইয়ের নম্বর কার কাছ থেকে নেবেন?',
          explanationBn: 'ঠিক! মেসেজের নম্বরে ফোন করলে প্রতারকের কাছেই পৌঁছাবেন।',
        },
        {
          id: 'q-order-call', type: 'ordering', questionBn: 'কেউ ফোনে ব্যাংকের লোক সেজে OTP চাইল। ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'কোড বা PIN বলবেন না' },
            { id: '2', textBn: 'কল কেটে দিন' },
            { id: '3', textBn: 'অফিসিয়াল নম্বরে নিজে ফোন করুন' },
            { id: '4', textBn: 'ঘটনাটি পরিবারকে জানান' },
          ],
          hintBn: 'আগে নিজেকে বাঁচান, তারপর কল শেষ, তারপর যাচাই।',
          explanationBn: 'চমৎকার! এই ক্রম মনে রাখলে ঘাবড়াতে হবে না।',
        },
        {
          id: 'q-suspicious-link', type: 'multipleChoice', questionBn: 'এসএমএসে সন্দেহের লিংক এল। কোনটি নিরাপদ?',
          options: [
            { id: 'a', textBn: 'লিংকে ক্লিক করে দেখব' },
            { id: 'b', textBn: 'নিজে অ্যাপ বা ওয়েবসাইট খুলে যাচাই করব' },
            { id: 'c', textBn: 'PIN দিয়ে পরীক্ষা করব' },
          ],
          correct: ['b'],
          hintBn: 'লিংক নয়, নিজের খোলা পথ।',
          explanationBn: 'ঠিক! নিজে খুলে যাচাইই নিরাপদ।',
        },
      ],
      recapBn: ['ভয়, লোভ, তাড়া = সন্দেহ', 'কল কেটে নিজে ফোন করুন', 'লিংকের আসল ঠিকানা দেখুন'],
      freeTryBn: 'একটি লিংকের ওপর মাউস রেখে আসল ঠিকানা দেখুন।',
    },

    // =====================================================================================================
    {
      id: 'safe-habits',
      titleBn: 'নিরাপদ থাকার অভ্যাস',
      hook: {
        id: 'h-habits',
        type: 'hook',
        textBn: 'ক্যাফেতে বসে ব্যাংকিং? একটু **থামুন** — তার আগে কয়েকটা সহজ অভ্যাস।',
        visual: { kind: 'art', name: 'wifi' },
      },
      cards: [
        {
          id: 'c-wifi',
          type: 'visual',
          textBn: '**পাবলিক ওয়াই-ফাই** সবার জন্য খোলা। ব্যাংকিং বা গোপন কাজ নয় — দরকারে মোবাইল ডেটা।',
          visual: { kind: 'art', name: 'wifi', captionBn: 'খোলা = সবার' },
          chipsBn: ['ব্যাংকিং নয়', 'কাজ শেষে Forget'],
          learnMoreBn: 'ঠিকানার শুরুতে “https” আর তালা-চিহ্ন একটি ভালো লক্ষণ, তবে একমাত্র নিশ্চয়তা নয়। কাজ শেষে নেটওয়ার্কটি ভুলে যান (Forget), যাতে নিজে নিজে আর যুক্ত না হয়।',
        },
        {
          id: 'c-update',
          type: 'visual',
          textBn: '**আপডেট** নিরাপত্তার ফাঁক বন্ধ করে। তাই আপডেট আর বিল্ট-ইন সুরক্ষা চালু রাখুন।',
          visual: { kind: 'art', name: 'refresh', captionBn: 'আপডেট = মেরামত' },
          chipsBn: ['বিল্ট-ইন সুরক্ষা চালু রাখুন'],
          learnMoreBn: 'Windows-এ Windows Security নামে বিল্ট-ইন সুরক্ষা থাকে, Mac-এও থাকে (যেমন XProtect)। বেশিরভাগ ক্ষেত্রে এটুকুই যথেষ্ট। প্রোগ্রাম নামান শুধু অফিসিয়াল জায়গা থেকে। “আপনার কম্পিউটারে ভাইরাস!” লেখা পপ-আপে ক্লিক বা কল করবেন না।',
        },
        {
          id: 'c-lock-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'উঠে যাওয়ার আগে কম্পিউটারে **তালা** দিন। কিবোর্ডে একসাথে Win আর L।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'win+l', os: 'windows', captionBn: 'স্ক্রিন লক' },
          chipsBn: ['Win + L'],
        },
        {
          id: 'c-lock-mac',
          type: 'visual',
          osVariant: 'mac',
          textBn: 'উঠে যাওয়ার আগে কম্পিউটারে **তালা** দিন। কিবোর্ডে একসাথে Control, Command আর Q।',
          visual: { kind: 'demo', gesture: 'keys', keys: 'ctrl+cmd+q', os: 'mac', captionBn: 'স্ক্রিন লক' },
          chipsBn: ['Control+Command+Q'],
        },
        {
          id: 'c-privacy',
          type: 'visual',
          textBn: '**গোপনীয়তা**: বাসার ঠিকানা, NID বা “ছুটিতে বাইরে” — অনলাইনে দেবেন না। অ্যাপ অনুমতি চাইলে দরকার না হলে “না” বলুন।',
          visual: { kind: 'art', name: 'id-card', captionBn: 'যা গোপন, তা গোপন' },
          chipsBn: ['শেষে Log out', 'Incognito আড়াল নয়'],
          learnMoreBn: 'ছবিতে লোকেশন যুক্ত থাকতে পারে। অন্যের বা সবার কম্পিউটারে কাজ করলে শেষে Log out করুন আর পাসওয়ার্ড সেভের প্রস্তাবে “না” বলুন। Private/Incognito শুধু এই কম্পিউটারে ইতিহাস জমা রাখে না — ওয়েবসাইট বা ইন্টারনেট কোম্পানি তবুও দেখতে পারে। আর ভুল করে ফেললে ঘাবড়াবেন না: অফিসিয়াল নম্বরে এখনই জানান, পাসওয়ার্ড বদলান, পরিবারের কাউকে বলুন।',
        },
      ],
      steps: [
        {
          id: 'w-lock', osVariant: 'windows', titleBn: 'Win + L চাপুন', expectedAction: { type: 'keyCombo', keys: 'win+l' },
          explanationBn: 'শর্টকাট প্যাডে আগে “Win”, তারপর “L”-এ ক্লিক করুন।',
          hintBn: 'প্যাডে আগে “Win” বোতামে ক্লিক করুন, তারপর অক্ষর “L”-এ।',
          simplerBn: 'দুটি আলাদা ক্লিক: প্রথমে Win, তারপর L। একসাথে নয়, পরপর।',
          successMessageBn: 'স্ক্রিন লক!',
        },
        {
          id: 'w-unlock', osVariant: 'windows', titleBn: 'আবার খুলুন', target: 'unlock-button', expectedAction: { type: 'custom', event: 'unlocked' },
          explanationBn: 'আসল কম্পিউটারে এখানে PIN লাগত। এখন শুধু “Sign in”-এ ক্লিক করুন।',
          hintBn: 'পর্দার মাঝখানের “Sign in” বোতামটি।',
          successMessageBn: 'খুলে গেছে!',
        },
        {
          id: 'w-open-settings', osVariant: 'windows', titleBn: 'Settings খুলুন', target: 'taskbar-app-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'এবার ওয়াই-ফাই দেখি। টাস্কবারের গিয়ার আইকনে ক্লিক করুন।',
          hintBn: 'টাস্কবারে ছোট গিয়ার (⚙) আইকনটি।',
        },
        {
          id: 'w-nav-network', osVariant: 'windows', titleBn: '“Network & internet”', target: 'settings-nav-network', expectedAction: { type: 'click', target: 'settings-nav-network' },
          explanationBn: 'বাঁ তালিকা থেকে “Network & internet” বেছে নিন।',
          hintBn: 'বাঁ দিকের তালিকার ওয়াই-ফাই-সংক্রান্ত নামটি।',
        },
        {
          id: 'w-open-network', osVariant: 'windows', titleBn: 'খোলা নেটওয়ার্ক চিনুন', target: 'settings-network-CafeGuest', expectedAction: { type: 'click', target: 'settings-network-CafeGuest' },
          explanationBn: '“Secured” লেখা নেই, তাই “CafeGuest” খোলা। এতে ক্লিক করুন — আসলে ব্যাংকিং নয়!',
          hintBn: '“Secured” লেখা নেই এমন নামটি — CafeGuest।',
          simplerBn: 'তালিকার তৃতীয় নামটি “CafeGuest”। তার ওপর একবার ক্লিক করুন।',
        },
        {
          id: 'w-back-home', osVariant: 'windows', titleBn: 'নিজের নেটওয়ার্কে ফিরুন', target: 'settings-network-HomeWiFi', expectedAction: { type: 'click', target: 'settings-network-HomeWiFi' },
          explanationBn: 'এবার নিজের “HomeWiFi”-তে ক্লিক করে ফিরে আসুন।',
          hintBn: 'তালিকার প্রথম নাম — HomeWiFi।',
        },
        {
          id: 'w-close-settings', osVariant: 'windows', titleBn: 'Settings বন্ধ করুন', target: 'win-settings-close', expectedAction: { type: 'click', target: 'win-settings-close' },
          explanationBn: `ডান ওপরের ✕ বোতামে ক্লিক করুন। (${DIFF}।)`,
          hintBn: 'উইন্ডোর ডান ওপরের কোণের ✕।',
        },

        {
          id: 'm-lock', osVariant: 'mac', titleBn: 'Control + Command + Q চাপুন', expectedAction: { type: 'keyCombo', keys: 'ctrl+cmd+q' },
          explanationBn: 'প্যাডে আগে “⌃ Control” ও “⌘ Command”, তারপর “Q”-তে ক্লিক করুন।',
          hintBn: 'প্যাডে প্রথমে দুটি বোতাম বেছে নিন — ⌃ Control আর ⌘ Command। তারপর Q।',
          simplerBn: 'তিনটি পরপর ক্লিক: ⌃ Control, ⌘ Command, তারপর Q। (মেনু থেকে Lock Screen বেছে নিলেও একই কাজ হয়।)',
          successMessageBn: 'স্ক্রিন লক!',
        },
        {
          id: 'm-unlock', osVariant: 'mac', titleBn: 'আবার খুলুন', target: 'unlock-button', expectedAction: { type: 'custom', event: 'unlocked' },
          explanationBn: 'আসল Mac-এ এখানে পাসওয়ার্ড বা Touch ID লাগত। এখন শুধু বোতামে ক্লিক করুন।',
          hintBn: 'পর্দার মাঝখানের সাদা বোতামটি।',
          successMessageBn: 'খুলে গেছে!',
        },
        {
          id: 'm-open-settings', osVariant: 'mac', titleBn: 'System Settings খুলুন', target: 'dock-settings', expectedAction: { type: 'openApp', app: 'settings' },
          explanationBn: 'এবার ওয়াই-ফাই দেখি। ডকের গিয়ার আইকনে ক্লিক করুন।',
          hintBn: 'ডকে ছোট গিয়ার (⚙) আইকনটি।',
        },
        {
          id: 'm-nav-network', osVariant: 'mac', titleBn: '“Wi-Fi”', target: 'settings-nav-network', expectedAction: { type: 'click', target: 'settings-nav-network' },
          explanationBn: 'বাঁ তালিকা থেকে “Wi-Fi” বেছে নিন।',
          hintBn: 'বাঁ দিকের তালিকায় “Wi-Fi” লেখা নামটি।',
        },
        {
          id: 'm-open-network', osVariant: 'mac', titleBn: 'খোলা নেটওয়ার্ক চিনুন', target: 'settings-network-CafeGuest', expectedAction: { type: 'click', target: 'settings-network-CafeGuest' },
          explanationBn: '“Secured” লেখা নেই, তাই “CafeGuest” খোলা। এতে ক্লিক করুন — আসলে ব্যাংকিং নয়!',
          hintBn: '“Secured” লেখা নেই এমন নামটি — CafeGuest।',
          simplerBn: 'তালিকার তৃতীয় নামটি “CafeGuest”। তার ওপর একবার ক্লিক করুন।',
        },
        {
          id: 'm-back-home', osVariant: 'mac', titleBn: 'নিজের নেটওয়ার্কে ফিরুন', target: 'settings-network-HomeWiFi', expectedAction: { type: 'click', target: 'settings-network-HomeWiFi' },
          explanationBn: 'এবার নিজের “HomeWiFi”-তে ক্লিক করে ফিরে আসুন।',
          hintBn: 'তালিকার প্রথম নাম — HomeWiFi।',
        },
        {
          id: 'm-close-settings', osVariant: 'mac', titleBn: 'Settings বন্ধ করুন', target: 'win-settings-close', expectedAction: { type: 'click', target: 'win-settings-close' },
          explanationBn: `বাঁ ওপরের লাল বিন্দুতে ক্লিক করুন। (${DIFF}।)`,
          hintBn: 'বাঁ ওপরের কোণের লাল বিন্দু।',
        },
      ],
      quiz: [
        {
          id: 'q-match', type: 'dragMatch', questionBn: 'অভ্যাসের সাথে কারণ মিলিয়ে দিন।',
          pairs: [
            { id: 'wifi', leftBn: 'ক্যাফের খোলা ওয়াই-ফাই', rightBn: 'ব্যাংকিং এড়িয়ে চলুন' },
            { id: 'update', leftBn: 'আপডেট', rightBn: 'নিরাপত্তার ফাঁক বন্ধ' },
            { id: 'lock', leftBn: 'উঠে যাওয়ার আগে', rightBn: 'স্ক্রিন লক করুন' },
            { id: 'nid', leftBn: 'NID-এর ছবি', rightBn: 'অনলাইনে দেবেন না' },
          ],
          hintBn: 'প্রতিটি অভ্যাসের সাথে তার সুরক্ষা-কারণ মনে করুন।',
          explanationBn: 'চমৎকার! চারটিই মিলেছে।',
        },
        {
          id: 'q-virus-popup', type: 'multipleChoice', questionBn: 'পপ-আপ: “কম্পিউটারে ভাইরাস! এখনই কল করুন।” কী করবেন?',
          options: [
            { id: 'a', textBn: 'দেওয়া নম্বরে কল করব' },
            { id: 'b', textBn: 'ক্লিক বা কল না করে বন্ধ করব' },
            { id: 'c', textBn: 'পাসওয়ার্ড দিয়ে দেখব' },
          ],
          correct: ['b'],
          hintBn: 'ভয় দেখানো পপ-আপ প্রায়ই ফাঁদ।',
          explanationBn: 'ঠিক! বন্ধ করুন, বিল্ট-ইন সুরক্ষা চালু রাখুন।',
        },
        {
          id: 'q-post', type: 'clickTarget', questionBn: 'সামাজিক মাধ্যমে কোনটি দেওয়া সবচেয়ে নিরাপদ?',
          items: [
            { id: 'address', labelBn: 'বাসার ঠিকানা', icon: '🏠' },
            { id: 'nid', labelBn: 'NID-এর ছবি', icon: '🪪' },
            { id: 'cat', labelBn: 'বিড়ালের মজার ছবি', icon: '🐱' },
          ],
          correct: 'cat',
          hintBn: 'যেটা থেকে আপনার পরিচয় বা ঠিকানা জানা যায় না।',
          explanationBn: 'ঠিক! ব্যক্তিগত পরিচয় গোপন রাখুন।',
        },
      ],
      recapBn: ['পাবলিক ওয়াই-ফাইয়ে ব্যাংকিং নয়', 'উঠলে স্ক্রিন লক করুন', 'আপডেট রাখুন'],
      freeTryBn: 'শর্টকাট প্যাডে আরেকবার স্ক্রিন লক করে খুলুন।',
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'ইমেইলের সেটিংসে গিয়ে ২-ধাপ যাচাই চালু করা যায় কি না দেখুন; ব্যাকআপ কোড নিরাপদে রাখুন।',
      'নিয়ম বানান: কেউ ফোনে OTP বা PIN চাইলে কল কেটে দেব। পরিবারকে একবার বলুন।',
      'একটি লিংকের ওপর (ক্লিক না করে) মাউস রেখে নিচের কোণে আসল ঠিকানা দেখুন।',
    ],
    windowsTasksBn: ['উঠে যাওয়ার আগে Win + L চেপে স্ক্রিন লক করুন। Settings → Windows Update-এ বাকি আপডেট দেখুন।'],
    macTasksBn: ['উঠে যাওয়ার আগে Control + Command + Q চেপে স্ক্রিন লক করুন। System Settings-এ বাকি আপডেট দেখুন।'],
  },

  teacherTipBn:
    'এই পাঠে ভয় নয়, আত্মবিশ্বাস তৈরিই লক্ষ্য। “সবকিছুই ফাঁদ” — এমন ধারণা যেন না জন্মায়, তাই খেলায় ইচ্ছে করে কয়েকটি ঠিক বার্তাও রাখা হয়েছে। এই পাঠের সব নাম, নম্বর ও লিংক কাল্পনিক (যেমন টাকাপে, নমুনা ব্যাংক, 01XXXXXXXXX)। আসল পাসওয়ার্ড, PIN বা OTP কোনো অনুশীলনে লিখতে দেবেন না; পাসওয়ার্ড পরীক্ষকটি শুধু এই পাতার ভেতরে কাজ করে, কিছু জমা রাখে না। সবচেয়ে জরুরি নিয়ম একটাই: OTP আর PIN কাউকে বলা যাবে না। নিয়মটি মুখে মুখে বারবার বলিয়ে নিন, আর পরিবারের অন্য সদস্যদেরও জানিয়ে দিতে বলুন। সুযোগ হলে সম্প্রতি শোনা কোনো প্রতারণার কাহিনি নিয়ে আলোচনা করুন।',
}

export default lesson
