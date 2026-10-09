import type { Lesson, Step } from '../../engine/types'

/**
 * Module 8 — email and online accounts, in the cards format. Three units:
 * (1) accounts and the email address (widgets email-parts + signup-form, open Mail, read + save an attachment);
 * (2) sending an email (compose, To, Subject, Body, attach, send, wait for the auto-reply, reply);
 * (3) spam, Not spam, folders and good account habits.
 * Step targets / events are the same as the old guided practice (the Mail app replies ~1.5 s after Send).
 */

const open: Step[] = [
  {
    id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'নিচের স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের চার-খোপের আইকনটি স্টার্ট বোতাম।',
  },
  {
    id: 'w-open-mail', osVariant: 'windows', titleBn: 'Mail খুলুন', target: 'start-app-mail', expectedAction: { type: 'openApp', app: 'mail' },
    explanationBn: 'খামের ছবির “Mail” প্রোগ্রামে ক্লিক করুন।',
    hintBn: '“Pinned” অংশে খামের ছবি আর নিচে Mail লেখা আছে।',
    simplerBn: 'স্টার্ট মেনুতে সাদা খামের মতো আইকনটি খুঁজে একবার ক্লিক করুন।',
  },
  {
    id: 'm-open-mail', osVariant: 'mac', titleBn: 'Mail খুলুন', target: 'dock-mail', expectedAction: { type: 'openApp', app: 'mail' },
    explanationBn: 'নিচের ডকে খামের “Mail” আইকনে ক্লিক করুন।',
    hintBn: 'ডকের ডান দিকে সাদা খামের আইকন আছে।',
    simplerBn: 'পর্দার নিচের আইকন-সারির ডান দিকে খামটি খুঁজে একবার ক্লিক করুন।',
  },
]

const lesson: Lesson = {
  module: 8,
  part: 1,
  id: 'm08',
  titleBn: 'ইমেইল ও অনলাইন অ্যাকাউন্ট',
  oneLineBn: 'অ্যাকাউন্ট খুলি, ইমেইল পাঠাই, বাজে চিঠি চিনি।',
  minutes: 8,
  glossaryIds: ['account', 'username', 'password', 'sign-up', 'log-in', 'log-out', 'verification-email', 'recovery', 'otp', 'email', 'email-address', 'domain', 'inbox', 'sent', 'draft', 'spam', 'compose', 'subject', 'attachment', 'reply', 'forward'],

  units: [
    // =====================================================================================================
    {
      id: 'account-address',
      titleBn: 'অ্যাকাউন্ট ও ইমেইল ঠিকানা',
      hook: {
        id: 'h-account',
        type: 'hook',
        textBn: 'ফেসবুক অ্যাকাউন্ট খুলতে কী লাগে? একটা **ইমেইল ঠিকানা**!',
        visual: { kind: 'art', name: 'envelope' },
      },
      cards: [
        {
          id: 'c-account',
          type: 'visual',
          textBn: '**অ্যাকাউন্ট** মানে সাইটে আপনার নিজের জায়গা। ঢুকতে লাগে নাম আর গোপন চাবি।',
          visual: { kind: 'art', name: 'user' },
          chipsBn: ['ইউজারনেম = নাম', 'পাসওয়ার্ড = চাবি'],
          learnMoreBn: 'নতুন অ্যাকাউন্ট খোলাকে বলে সাইন আপ (Sign up), ঢোকাকে লগ ইন (Log in), বেরোনোকে লগ আউট (Log out)। ব্যাংকের লকারের মতো — চাবি কাউকে দিলে যে কেউ লকার খুলতে পারে।',
        },
        {
          id: 'c-why-email',
          type: 'visual',
          textBn: 'প্রায় সব সাইট ইমেইল চায়, কারণ ইমেইলই অনলাইনে আপনার পরিচয়ের **চাবি**।',
          visual: { kind: 'art', name: 'key' },
          chipsBn: ['যাচাইয়ের ইমেইল', 'পাসওয়ার্ড ফেরত', 'GitHub-ও চায়'],
          learnMoreBn: 'সাইন আপের পর সাইট একটি যাচাইয়ের ইমেইল (Verification email) পাঠায়, তাই বোঝে ঠিকানাটি সত্যিই আপনার। পাসওয়ার্ড ভুললে উদ্ধারের লিংকও (Recovery) ওই ইমেইলেই আসে। কোডিং শেখার সময় GitHub-এর মতো সাইটেও অ্যাকাউন্ট খুলতে ইমেইল লাগবে। ইমেইল হারালে বাকি অ্যাকাউন্টও বিপদে পড়তে পারে, তাই এর যত্ন সবচেয়ে বেশি নিন।',
        },
        {
          id: 'c-parts',
          type: 'visual',
          textBn: 'ঠিকানার তিন অংশ: নাম, **@**, ডোমেইন। অংশগুলো ছুঁয়ে দেখুন — পারেন?',
          visual: { kind: 'widget', widget: 'email-parts' },
          learnMoreBn: 'সব ইমেইল ঠিকানা একই ছাঁচে লেখা: নাম @ ডোমেইন, যেমন anika@mail.example। @ চিহ্নের আগের অংশ নাম (ইউজারনেম), পরের অংশ ডোমেইন — ইমেইল সেবার ডাকঘরের নাম।',
        },
        {
          id: 'c-signup',
          type: 'visual',
          textBn: 'এবার নকল **সাইন আপ** ফর্মটি ভরুন। কোথাও কিছু যাবে না — পারেন?',
          visual: { kind: 'widget', widget: 'signup-form' },
          learnMoreBn: 'পাসওয়ার্ডের নিয়মগুলো মেলাতে মেলাতে সবুজ টিক পড়বে। সাইন আপের পর একটি যাচাইয়ের ইমেইল আসবে। শক্ত পাসওয়ার্ড নিয়ে ৯ নম্বর পাঠে বিস্তারিত শিখব।',
        },
        {
          id: 'c-mailapp',
          type: 'visual',
          textBn: 'চলুন **Mail** খুলি। বাঁ দিকে ফোল্ডার: Inbox হলো আসা চিঠির বাক্স।',
          visual: { kind: 'mock', name: 'mail', highlight: 'folders' },
          chipsBn: ['Inbox = আসা চিঠি', 'ক্লিপ = ফাইল জোড়া'],
          learnMoreBn: 'Mail প্রোগ্রামটি Windows আর Mac দুই কম্পিউটারেই একই রকম। আসল ইমেইল সেবায় (ব্রাউজারে) বোতামের জায়গা একটু আলাদা হতে পারে। অচেনা কারও পাঠানো অ্যাটাচমেন্ট না খুলে আগে ভাববেন!',
        },
      ],
      steps: [
        ...open,
        {
          id: 'read-attachment-msg', osVariant: 'both', titleBn: 'একটি ইমেইল পড়ুন', target: 'mail-msg-Class notes for Saturday', expectedAction: { type: 'click', target: 'mail-msg-Class notes for Saturday' },
          explanationBn: 'Tanvir Bhai-এর “Class notes for Saturday” চিঠিতে ক্লিক করুন।',
          hintBn: 'মাঝের তালিকায় নামের পাশে ক্লিপ (📎) থাকা চিঠিটি খুঁজুন।',
          simplerBn: 'মাঝের তালিকার প্রতিটি সারি একটি চিঠি। “Class notes for Saturday” সারিতে একবার ক্লিক করুন।',
          successMessageBn: 'চিঠি খুলেছে! ক্লিপ মানে ফাইল জোড়া।',
        },
        {
          id: 'save-attachment', osVariant: 'both', titleBn: 'জোড়া ফাইলটি সেভ করুন', target: 'mail-save-attachment-Class-Notes.txt', expectedAction: { type: 'custom', event: 'mail-save-attachment' },
          explanationBn: 'নিচের “Save attachment” বোতামে ক্লিক করুন।',
          hintBn: 'চিঠির লেখার একদম নিচে নীল “Save attachment” বোতাম।',
          successMessageBn: 'ফাইল Downloads-এ জমা হয়েছে!',
        },
      ],
      quiz: [
        {
          id: 'q-domain', type: 'clickTarget', questionBn: 'anika@mail.example-এ ডোমেইন (Domain) কোনটি?',
          items: [
            { id: 'name', labelBn: 'anika', icon: '👤' },
            { id: 'at', labelBn: '@', icon: '🔤' },
            { id: 'domain', labelBn: 'mail.example', icon: '🌐' },
          ],
          correct: 'domain',
          hintBn: 'ডোমেইন থাকে @ চিহ্নের পরে।',
          explanationBn: 'ঠিক! @ চিহ্নের পরের অংশ ডোমেইন, আগেরটি নাম।',
        },
        {
          id: 'q-why-email', type: 'multipleChoice', questionBn: 'সাইট অ্যাকাউন্ট খোলার সময় কেন ইমেইল ঠিকানা চায়?',
          options: [
            { id: 'a', textBn: 'যাচাই করতে আর পাসওয়ার্ড উদ্ধারের লিংক পাঠাতে' },
            { id: 'b', textBn: 'যাতে পাসওয়ার্ড সবাইকে জানানো যায়' },
            { id: 'c', textBn: 'শুধু বিজ্ঞাপন দেখানোর জন্য' },
          ],
          correct: ['a'],
          hintBn: 'সাইন আপের পর কী ইমেইল আসে, ভাবুন।',
          explanationBn: 'ঠিক। ইমেইল ঠিকানাই অ্যাকাউন্টের যাচাই আর উদ্ধারের চাবি।',
        },
        {
          id: 'q-recovery', type: 'multipleChoice', questionBn: 'পাসওয়ার্ড ভুলে গেলে উদ্ধারের লিংক সাধারণত কোথায় আসে?',
          options: [
            { id: 'a', textBn: 'অ্যাকাউন্টের ইমেইল ঠিকানায়' },
            { id: 'b', textBn: 'কোথাও আসে না' },
            { id: 'c', textBn: 'প্রতিবেশীর ফোনে' },
          ],
          correct: ['a'],
          hintBn: 'সাইন আপের সময় যে ঠিকানা দিয়েছিলেন।',
          explanationBn: 'ঠিক। তাই ইমেইলের পাসওয়ার্ড সবচেয়ে যত্নে রাখুন।',
        },
      ],
      recapBn: ['অ্যাকাউন্ট = নাম + গোপন চাবি', 'ইমেইল ঠিকানা = অ্যাকাউন্টের চাবি', 'ঠিকানা = নাম @ ডোমেইন'],
    },

    // =====================================================================================================
    {
      id: 'send-email',
      titleBn: 'ইমেইল পাঠানো',
      setup: { openApps: ['mail'] },
      hook: {
        id: 'h-send',
        type: 'hook',
        textBn: 'চিঠি পাঠানো সোজা — কাকে, কী বিষয়ে, কী লিখে? তিনটি ঘর ভরলেই হয়।',
        visual: { kind: 'mock', name: 'mail', highlight: 'compose' },
      },
      cards: [
        {
          id: 'c-compose',
          type: 'visual',
          textBn: '**Compose** চাপলেই নতুন চিঠির পাতা খোলে।',
          visual: { kind: 'mock', name: 'mail', highlight: 'compose' },
          learnMoreBn: 'লেখা শুরু করে না পাঠালে চিঠিটি Drafts (খসড়া) ফোল্ডারে জমে থাকে, পরে শেষ করা যায়।',
        },
        {
          id: 'c-to',
          type: 'visual',
          textBn: '**To** ঘরে যাকে পাঠাবেন, তার ঠিকানা লিখুন। ভুল হলে চিঠি পৌঁছাবে না।',
          visual: { kind: 'mock', name: 'mail', highlight: 'to' },
          chipsBn: ['অনেকজনকে কমা (,)', 'Cc = জানিয়ে রাখা'],
          learnMoreBn: 'একাধিক জনকে পাঠাতে ঠিকানাগুলো কমা (,) দিয়ে লিখতে পারেন। আসল ইমেইলে Cc নামে আরেকটি ঘর থাকে — যাদের শুধু জানিয়ে রাখতে চান, তাদের ঠিকানা সেখানে।',
        },
        {
          id: 'c-subject',
          type: 'visual',
          textBn: '**Subject** এক লাইনের শিরোনাম। নিচের বড় ঘরে লিখুন মূল কথা।',
          visual: { kind: 'mock', name: 'mail', highlight: 'subject' },
          chipsBn: ['পরিষ্কার বিষয়', 'ভদ্র শুরু, ভদ্র শেষ'],
          learnMoreBn: 'মূল লেখা (Body) ভদ্র শুরু আর শেষ দিয়ে লিখুন — যেমন “প্রিয় রিনা আপু,” দিয়ে শুরু করে “ধন্যবাদ” দিয়ে শেষ। বাংলা লেখা জানলে বাংলাতেও লিখতে পারেন।',
        },
        {
          id: 'c-attach',
          type: 'visual',
          textBn: '**Attach** দিয়ে ফাইল জুড়ুন। খুব বড় ফাইল পাঠানো যায় না।',
          visual: { kind: 'mock', name: 'mail', highlight: 'attach' },
          chipsBn: ['ক্লিপ = ফাইল', 'সীমা প্রায় ২০–২৫ MB'],
          learnMoreBn: 'সব ইমেইল সেবায় ফাইলের মোট আকারের একটি সীমা থাকে (সাধারণত ২০–২৫ MB-এর কাছাকাছি)। ভুল ফাইল জুড়লে ছোট ট্যাগের ✕ দিয়ে সরিয়ে দেওয়া যায়।',
        },
        {
          id: 'c-reply',
          type: 'compare',
          textBn: 'উত্তর দিতে **Reply**, অন্যকে পাঠাতে **Forward**। ঠিকানা নিজেই বসে যায়।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'chat-bubble' }, labelBn: 'Reply', captionBn: 'বিষয়ের আগে Re:' },
            right: { visual: { kind: 'art', name: 'upload' }, labelBn: 'Forward', captionBn: 'বিষয়ের আগে Fwd:' },
            vs: 'বা',
          },
          learnMoreBn: 'ব্যক্তিগত কারও চিঠি ফরোয়ার্ড করার আগে একটু ভেবে নিন।',
        },
      ],
      steps: [
        {
          id: 'compose', osVariant: 'both', titleBn: 'নতুন ইমেইল শুরু করুন', target: 'mail-compose', expectedAction: { type: 'click', target: 'mail-compose' },
          explanationBn: 'বাঁ ওপরের নীল “Compose” বোতামে ক্লিক করুন।',
          hintBn: 'ফোল্ডার তালিকার ঠিক ওপরে নীল রঙের বোতাম।',
        },
        {
          id: 'to', osVariant: 'both', titleBn: 'কাকে পাঠাবেন: To', target: 'mail-to', expectedAction: { type: 'type', target: 'mail-to', text: 'friend@mail.example', ignoreCase: true },
          explanationBn: 'To ঘরে টাইপ করুন: friend@mail.example',
          hintBn: 'সব ছোট হাতের অক্ষর, মাঝে @ চিহ্ন।',
          simplerBn: 'friend লিখুন, তারপর Shift চেপে 2 চাপলে @ আসে, তারপর mail.example।',
        },
        {
          id: 'subject', osVariant: 'both', titleBn: 'বিষয় লিখুন: Subject', target: 'mail-subject', expectedAction: { type: 'type', target: 'mail-subject', text: 'Hello', ignoreCase: true },
          explanationBn: 'Subject ঘরে টাইপ করুন: Hello',
          hintBn: 'To ঘরের নিচের “Subject” ঘরে ক্লিক করে লিখুন।',
        },
        {
          id: 'body', osVariant: 'both', titleBn: 'চিঠির লেখা লিখুন', target: 'mail-body', expectedAction: { type: 'custom', event: 'mail-body-typed' },
          explanationBn: 'বড় সাদা ঘরে কয়েকটি শব্দ লিখুন, যেমন: Hello!',
          hintBn: 'বড় ঘরটিতে ক্লিক করে যা খুশি টাইপ করুন।',
        },
        {
          id: 'attach-btn', osVariant: 'both', titleBn: 'ফাইল জুড়তে: Attach', target: 'mail-attach', expectedAction: { type: 'click', target: 'mail-attach' },
          explanationBn: 'নিচের “Attach file” বোতামে ক্লিক করুন।',
          hintBn: 'Send বোতামের পাশেই ক্লিপ চিহ্নের বোতাম।',
        },
        {
          id: 'attach-file', osVariant: 'both', titleBn: 'ফাইল বাছুন', target: 'mail-picker-file-Recipe.txt', expectedAction: { type: 'custom', event: 'mail-attach:Recipe.txt' },
          explanationBn: 'Recipe.txt বেছে নীল “Attach” বোতামে চাপুন।',
          hintBn: 'ফাইলটি নীল হলে ঠিক বাছা হয়েছে, তারপর নিচের Attach।',
          simplerBn: 'আগে Recipe.txt লেখায় একবার ক্লিক করুন। তারপর নিচের ডানের “Attach” চাপুন।',
          successMessageBn: 'ফাইলটি ট্যাগ হয়ে বসেছে!',
        },
        {
          id: 'send', osVariant: 'both', titleBn: 'পাঠিয়ে দিন: Send', target: 'mail-send', expectedAction: { type: 'custom', event: 'mail-sent' },
          explanationBn: 'ঠিকানা দেখে নিয়ে নীল “Send” বোতামে চাপুন।',
          hintBn: 'চিঠির নিচের বাঁ দিকের নীল “Send” বোতাম।',
          successMessageBn: 'চলে গেছে! একটু পরে উত্তর আসবে।',
        },
        {
          id: 'wait-reply', osVariant: 'both', titleBn: 'উত্তরের জন্য অপেক্ষা', target: 'mail-folder-Inbox', expectedAction: { type: 'custom', event: 'mail-received' },
          explanationBn: 'এক-দুই সেকেন্ড অপেক্ষা করুন।',
          hintBn: 'কিছু করতে হবে না। Inbox-এ নতুন চিঠির সংখ্যা বাড়বে।',
          successMessageBn: 'উত্তর এসেছে!',
        },
        {
          id: 'open-reply', osVariant: 'both', titleBn: 'উত্তরটি খুলুন', target: 'mail-msg-Re: Hello', expectedAction: { type: 'click', target: 'mail-msg-Re: Hello' },
          explanationBn: '“Re: Hello” চিঠিটিতে ক্লিক করুন।',
          hintBn: 'তালিকার একদম ওপরে মোটা অক্ষরের চিঠি। Re: মানে উত্তর।',
        },
        {
          id: 'reply', osVariant: 'both', titleBn: 'উত্তরের উত্তর: Reply', target: 'mail-reply', expectedAction: { type: 'custom', event: 'mail-reply' },
          explanationBn: 'ওপরের “Reply” বোতামে ক্লিক করুন।',
          hintBn: 'চিঠির ওপরের সারিতে Reply, Forward, Spam, Delete আছে।',
          successMessageBn: 'ঠিকানা আর বিষয় নিজেই বসেছে!',
        },
      ],
      quiz: [
        {
          id: 'q-order', type: 'ordering', questionBn: 'ইমেইল পাঠানোর ধাপগুলো ঠিক ক্রমে সাজান।',
          items: [
            { id: '1', textBn: 'Compose চাপি' },
            { id: '2', textBn: 'To ঘরে যাকে পাঠাব, তার ঠিকানা লিখি' },
            { id: '3', textBn: 'Subject আর মূল লেখা লিখি, ফাইল জুড়ি' },
            { id: '4', textBn: 'Send চাপি' },
          ],
          hintBn: 'আগে শুরু, তারপর কাকে, তারপর কী লিখবেন, শেষে পাঠানো।',
          explanationBn: 'ঠিক! পাঠানোর আগে ঠিকানাটি আরেকবার দেখে নেবেন।',
        },
        {
          id: 'q-to', type: 'multipleChoice', questionBn: 'To ঘরে কোনটি ঠিক ইমেইল ঠিকানা?',
          options: [
            { id: 'a', textBn: 'anika' },
            { id: 'b', textBn: 'anika@mail.example' },
            { id: 'c', textBn: 'mail.example' },
          ],
          correct: ['b'],
          hintBn: 'নাম, তারপর @, তারপর ডোমেইন।',
          explanationBn: 'ঠিক। @ না থাকলে ঠিকানা অসম্পূর্ণ, চিঠি যাবে না।',
        },
        {
          id: 'q-forward', type: 'multipleChoice', questionBn: 'পাওয়া চিঠিটি অন্য কাউকে পাঠাতে কোন বোতাম চাপবেন?',
          options: [
            { id: 'a', textBn: 'Reply' },
            { id: 'b', textBn: 'Forward' },
            { id: 'c', textBn: 'Spam' },
          ],
          correct: ['b'],
          hintBn: 'বিষয়ের আগে Fwd: বসে।',
          explanationBn: 'ঠিক। Reply শুধু প্রেরককে উত্তর পাঠায়।',
        },
      ],
      recapBn: ['Compose → To → Subject → Send', 'Attach = ফাইল জোড়া', 'Reply = উত্তর, Forward = অন্যকে'],
      freeTryBn: 'পারেন? নিজের ঠিকানা anika@mail.example-এ একটি চিঠি পাঠিয়ে দেখুন।',
    },

    // =====================================================================================================
    {
      id: 'spam-habits',
      titleBn: 'স্প্যাম ও ভালো অভ্যাস',
      setup: { openApps: ['mail'] },
      hook: {
        id: 'h-spam',
        type: 'hook',
        textBn: '“আপনি লাখ টাকা জিতেছেন!” — এমন চিঠি পেলে কী করবেন?',
        visual: { kind: 'art', name: 'warning' },
      },
      cards: [
        {
          id: 'c-spam',
          type: 'visual',
          textBn: '**স্প্যাম** হলো বাজে বা প্রতারণার চিঠি: লোভ দেখায়, তাড়া দেয়, প্রেরক অচেনা।',
          visual: { kind: 'art', name: 'fishing-hook' },
          chipsBn: ['লোভ দেখায়', 'তাড়া দেয়', 'অচেনা প্রেরক'],
          learnMoreBn: 'ইমেইল সেবা এসব লক্ষণ দেখে চিঠি নিজে থেকেই Spam ফোল্ডারে সরায়। বানান ভুল আর অদ্ভুত লিংকও বাজে চিঠির লক্ষণ। মাঝে মাঝে ভালো চিঠিও ভুলে সেখানে যায়, আবার বাজে চিঠি Inbox-এও ঢুকে পড়ে।',
        },
        {
          id: 'c-never',
          type: 'visual',
          textBn: 'ইমেইলে কেউ **OTP**, পাসওয়ার্ড বা ব্যাংকের তথ্য চাইলে কখনো দেবেন না।',
          visual: { kind: 'art', name: 'otp-code' },
          chipsBn: ['উত্তর নয়', 'লিংকে ক্লিক নয়'],
          learnMoreBn: 'সত্যিকারের ব্যাংক বা সেবা কখনো ইমেইলে পাসওয়ার্ড বা OTP চায় না। সন্দেহজনক লিংকে ক্লিক করবেন না, আর অচেনা কারও পাঠানো অ্যাটাচমেন্ট খুলবেন না।',
        },
        {
          id: 'c-notspam',
          type: 'compare',
          textBn: 'বাজে চিঠিতে চাপুন **Spam**। ভালো চিঠি ভুলে ঢুকলে **Not spam**।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'art', name: 'warning' }, labelBn: 'Spam', captionBn: 'বাজে চিঠি' },
            right: { visual: { kind: 'art', name: 'check' }, labelBn: 'Not spam', captionBn: 'ভালো চিঠি, Inbox-এ ফেরে' },
            vs: 'বা',
          },
        },
        {
          id: 'c-folders',
          type: 'visual',
          textBn: 'মুছে ফেলা চিঠি যায় **Trash**-এ — সেখান থেকে ফিরিয়েও আনা যায়।',
          visual: { kind: 'art', name: 'trash' },
          chipsBn: ['Sent = পাঠানো', 'Drafts = খসড়া', 'Trash = মোছা'],
          learnMoreBn: 'ফোল্ডারগুলো প্রায় সব ইমেইল সেবায় একই নামে পাবেন: Inbox (আসা চিঠি), Sent (পাঠানো চিঠির কপি), Drafts (লেখা শুরু করেও না-পাঠানো), Spam (বাজে চিঠি), Trash (মুছে ফেলা চিঠি)।',
        },
        {
          id: 'c-habit-pass',
          type: 'visual',
          textBn: 'প্রতিটি সাইটে আলাদা **শক্ত পাসওয়ার্ড**। পাসওয়ার্ড আর OTP কাউকে বলবেন না।',
          visual: { kind: 'art', name: 'lock' },
          chipsBn: ['আলাদা পাসওয়ার্ড', 'OTP গোপন'],
          learnMoreBn: 'শক্ত পাসওয়ার্ড আর পাসওয়ার্ড ম্যানেজার নিয়ে ৯ নম্বর পাঠে বিস্তারিত শিখব।',
        },
        {
          id: 'c-habit-safe',
          type: 'visual',
          textBn: 'শেয়ার করা কম্পিউটারে কাজ শেষে **লগ আউট** করুন। রিকভারি ফোন বা ইমেইল যোগ করে রাখুন।',
          visual: { kind: 'art', name: 'shield' },
          chipsBn: ['লগ আউট', 'রিকভারি যোগ', 'ভদ্র ঠিকানা'],
          learnMoreBn: 'একটি মূল ইমেইল ঠিকানা বেছে নিন যা বছরের পর বছর ব্যবহার করবেন। কোডিং বা চাকরির অ্যাকাউন্টের জন্য ঠিকানা ভদ্র রাখুন — যেমন anika.rahman@… — মজার ডাকনাম (lovely_girl_99@…) নয়।',
        },
      ],
      steps: [
        {
          id: 'pick-spam-msg', osVariant: 'both', titleBn: 'সন্দেহজনক চিঠি খুলুন', target: 'mail-msg-Claim your free gift now', expectedAction: { type: 'click', target: 'mail-msg-Claim your free gift now' },
          explanationBn: '“Claim your free gift now” চিঠিটিতে ক্লিক করুন।',
          hintBn: 'তালিকা একটু স্ক্রল করলে পাবেন, প্রেরকের নাম Lucky Winner।',
        },
        {
          id: 'mark-spam', osVariant: 'both', titleBn: 'Spam চিহ্নিত করুন', target: 'mail-spam', expectedAction: { type: 'custom', event: 'mail-spam' },
          explanationBn: 'চিঠির ওপরের “Spam” বোতামে ক্লিক করুন।',
          hintBn: 'চিঠির ওপরের সারিতে Spam লেখা বোতাম।',
          successMessageBn: 'চিঠি Spam-এ চলে গেছে!',
        },
        {
          id: 'open-spam-folder', osVariant: 'both', titleBn: 'Spam ফোল্ডার খুলুন', target: 'mail-folder-Spam', expectedAction: { type: 'click', target: 'mail-folder-Spam' },
          explanationBn: 'বাঁ দিকের “Spam” ফোল্ডারে ক্লিক করুন।',
          hintBn: 'বাঁ দিকে Inbox, Sent, Drafts-এর পরেই Spam।',
        },
        {
          id: 'open-verify-msg', osVariant: 'both', titleBn: 'ভুলে আসা ভালো চিঠি খুলুন', target: 'mail-msg-Please verify your LearnCode email', expectedAction: { type: 'click', target: 'mail-msg-Please verify your LearnCode email' },
          explanationBn: '“Please verify your LearnCode email” চিঠিটিতে ক্লিক করুন।',
          hintBn: 'Spam-এ দুটি চিঠি আছে — যেটির নাম LearnCode।',
        },
        {
          id: 'not-spam', osVariant: 'both', titleBn: 'Not spam বেছে নিন', target: 'mail-notspam', expectedAction: { type: 'custom', event: 'mail-notspam' },
          explanationBn: 'ওপরের “Not spam” বোতামে ক্লিক করুন।',
          hintBn: 'চিঠির ওপরের সারিতে “Not spam” বোতাম।',
          successMessageBn: 'চিঠি Inbox-এ ফিরেছে!',
        },
        {
          id: 'check-sent', osVariant: 'both', titleBn: 'Sent ফোল্ডার দেখুন', target: 'mail-folder-Sent', expectedAction: { type: 'click', target: 'mail-folder-Sent' },
          explanationBn: 'বাঁ দিকের “Sent” ফোল্ডারে ক্লিক করুন।',
          hintBn: 'বাঁ দিকের তালিকায় Inbox-এর নিচে Sent।',
          successMessageBn: 'চমৎকার! বাজে চিঠি সামলাতে শিখে গেলেন।',
        },
      ],
      quiz: [
        {
          id: 'q-folders', type: 'dragMatch', questionBn: 'ফোল্ডারের নামের সাথে তার কাজ মেলান।',
          pairs: [
            { id: 'inbox', leftBn: 'Inbox', rightBn: 'আসা চিঠি' },
            { id: 'sent', leftBn: 'Sent', rightBn: 'পাঠানো চিঠির কপি' },
            { id: 'drafts', leftBn: 'Drafts', rightBn: 'না-পাঠানো খসড়া' },
            { id: 'spam', leftBn: 'Spam', rightBn: 'সন্দেহজনক চিঠি' },
          ],
          hintBn: 'Sent মানে পাঠানো হয়েছে, Drafts মানে পাঠানো বাকি।',
          explanationBn: 'চারটিই মিলেছে! এই নামগুলো সব ইমেইল সেবায় প্রায় একই।',
        },
        {
          id: 'q-spam', type: 'multipleChoice', questionBn: 'অচেনা ইমেইল: “পুরস্কার জিতেছেন! এখনই OTP আর ব্যাংকের তথ্য পাঠান।” কী করবেন?',
          options: [
            { id: 'a', textBn: 'তথ্য পাঠিয়ে দেব' },
            { id: 'b', textBn: 'উত্তর দেব না, চিঠিটি Spam করব' },
            { id: 'c', textBn: 'বন্ধুদের ফরোয়ার্ড করব' },
          ],
          correct: ['b'],
          hintBn: 'OTP বা ব্যাংকের তথ্য চাওয়া মানেই প্রতারণা।',
          explanationBn: 'ঠিক। Spam করলে ইমেইল সেবাও এমন চিঠি চিনতে শেখে।',
        },
        {
          id: 'q-notspam', type: 'multipleChoice', questionBn: 'ভালো একটি চিঠি ভুলে Spam ফোল্ডারে ঢুকেছে। কী করবেন?',
          options: [
            { id: 'a', textBn: 'Not spam চাপব' },
            { id: 'b', textBn: 'ওখানেই ফেলে রাখব' },
            { id: 'c', textBn: 'অ্যাকাউন্ট বন্ধ করব' },
          ],
          correct: ['a'],
          hintBn: 'চিঠিটি Inbox-এ ফেরাতে হবে।',
          explanationBn: 'ঠিক। চিঠি Inbox-এ ফিরে যাবে।',
        },
      ],
      recapBn: ['OTP বা পাসওয়ার্ড কাউকে নয়', 'বাজে চিঠি Spam, ভালো চিঠি Not spam', 'শেয়ার করা পিসিতে লগ আউট'],
    },
  ],

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো নিরাপদ।',
    tasksBn: [
      'নিজের ইমেইল খুলে নিজের ঠিকানাতেই “Test” বিষয়ে একটি চিঠি পাঠান।',
      'Spam ফোল্ডারটি একবার দেখুন, ভালো চিঠি ভুলে ঢুকেছে কি না। লিংকে ক্লিক করবেন না।',
      'ইমেইলের সেটিংসে রিকভারি ফোন বা ইমেইল আছে কি না দেখে নিন।',
    ],
  },

  teacherTipBn:
    'ইমেইলের সবচেয়ে বড় শিক্ষা “ইমেইল ঠিকানাই চাবি” — এই কথাটি আসল অ্যাকাউন্টে গিয়ে নিজে দেখিয়ে দিন: কোনো সাইটের “Forgot password” পাতায় গিয়ে দেখান, উদ্ধারের লিংক কোথায় যায়। সিমুলেশনে OTP, পাসওয়ার্ড বা আসল ঠিকানা টাইপ করানোর দরকার নেই; অনুশীলনের ঠিকানাগুলো সব নকল (.example)। আসল ইমেইলে ফিরে গিয়ে পাসওয়ার্ড লেখার সময় তার পাশে না দাঁড়িয়ে আপনি একটু সরে বসবেন, আর OTP/প্রতারণার সাবধানতার কথা বারবার মনে করিয়ে দিন। পাসওয়ার্ড ম্যানেজার ও শক্ত পাসওয়ার্ড নিয়ে বিস্তারিত ৯ নম্বর পাঠে।',
}

export default lesson
