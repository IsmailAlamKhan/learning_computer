import type { Lesson, Step } from '../../engine/types'

const MAIL_NOTE = 'Mail প্রোগ্রামটি Windows আর Mac দুই কম্পিউটারেই একই রকম। আসল ইমেইল সেবায় (যেমন ব্রাউজারে ইমেইল খুললে) বোতামের জায়গা একটু আলাদা দেখাতে পারে।'

/** Opening Mail is the only part that differs between the two systems. */
const open: Step[] = [
  {
    id: 'w-start', osVariant: 'windows', titleBn: 'স্টার্ট মেনু খুলুন', target: 'start-button', expectedAction: { type: 'click', target: 'start-button' },
    explanationBn: 'আজ আমরা ইমেইলের প্রোগ্রাম খুলব। আগে নিচের স্টার্ট বোতামে ক্লিক করুন।',
    hintBn: 'টাস্কবারের চারকোনা আইকনটি স্টার্ট বোতাম।',
  },
  {
    id: 'w-open-mail', osVariant: 'windows', titleBn: 'Mail খুলুন', target: 'start-app-mail', expectedAction: { type: 'openApp', app: 'mail' },
    explanationBn: 'মেনুতে খামের ছবির পাশে “Mail” লেখা প্রোগ্রামটিতে ক্লিক করুন। নাম মনে থাকলে ওপরের সার্চ বক্সে “Mail” লিখেও খুঁজতে পারেন।',
    hintBn: '“Pinned” অংশে একটি খামের ছবি আর তার নিচে Mail লেখা আছে।',
    simplerBn: 'স্টার্ট মেনুতে সাদা খামের মতো আইকন খুঁজুন, ওপর দিকে সবুজ-নীল ভাঁজের দাগ আছে। সেটির ওপর একবার ক্লিক করুন।',
  },
  {
    id: 'm-open-mail', osVariant: 'mac', titleBn: 'Mail খুলুন', target: 'dock-mail', expectedAction: { type: 'openApp', app: 'mail' },
    explanationBn: 'নিচের ডকে খামের ছবির “Mail” আইকনটিতে ক্লিক করুন। (স্পটলাইটে “Mail” লিখেও খোলা যায়।)',
    hintBn: 'ডকের ডান দিকে একটি সাদা খামের আইকন আছে।',
    simplerBn: 'পর্দার নিচের আইকনের সারিটির ডান দিকে খামের মতো আইকনটি খুঁজে একবার ক্লিক করুন।',
  },
]

const common: Step[] = [
  {
    id: 'read-attachment-msg', osVariant: 'both', titleBn: 'একটি ইমেইল পড়ুন', target: 'mail-msg-Class notes for Saturday', expectedAction: { type: 'click', target: 'mail-msg-Class notes for Saturday' },
    explanationBn: 'বাঁ দিকে ফোল্ডারের তালিকা — Inbox, Sent, Drafts, Spam, Trash। Inbox-এ আসা চিঠিগুলো মোটা অক্ষরে থাকলে সেগুলো এখনও পড়া হয়নি। “Class notes for Saturday” লেখা চিঠিটিতে ক্লিক করে পড়ুন। পাশে ক্লিপ (📎) চিহ্ন মানে এর সাথে ফাইল জোড়া আছে। ' + MAIL_NOTE,
    hintBn: 'মাঝের তালিকায় Tanvir Bhai-এর পাঠানো চিঠিটি খুঁজুন, নামের পাশে ক্লিপ আছে।',
    simplerBn: 'মাঝের তালিকার প্রতিটি সারি একটি চিঠি। যে সারিতে “Class notes for Saturday” লেখা, সেটির ওপর একবার ক্লিক করুন।',
  },
  {
    id: 'save-attachment', osVariant: 'both', titleBn: 'জোড়া ফাইলটি সেভ করুন', target: 'mail-save-attachment-Class-Notes.txt', expectedAction: { type: 'custom', event: 'mail-save-attachment' },
    explanationBn: 'চিঠির নিচে অ্যাটাচমেন্ট (Attachment) হিসেবে Class-Notes.txt আছে। “Save attachment” বোতামে ক্লিক করুন — ফাইলটি আপনার Downloads ফোল্ডারে জমা হবে।',
    hintBn: 'চিঠির লেখার একদম নিচে ক্লিপ চিহ্নের পাশে নীল “Save attachment” বোতাম।',
    successMessageBn: 'ফাইলটি Downloads ফোল্ডারে সেভ হয়েছে। অচেনা কারও পাঠানো অ্যাটাচমেন্ট কিন্তু না খুলে আগে ভাববেন!',
  },
  {
    id: 'compose', osVariant: 'both', titleBn: 'নতুন ইমেইল লিখতে শুরু করুন', target: 'mail-compose', expectedAction: { type: 'click', target: 'mail-compose' },
    explanationBn: 'এবার আপনি নিজে একটি ইমেইল পাঠাবেন। বাঁ ওপরের নীল “Compose” বোতামে ক্লিক করুন।',
    hintBn: 'ফোল্ডারের তালিকার ঠিক ওপরে নীল রঙের বোতাম।',
  },
  {
    id: 'to', osVariant: 'both', titleBn: 'কাকে পাঠাবেন: To', target: 'mail-to', expectedAction: { type: 'type', target: 'mail-to', text: 'friend@mail.example', ignoreCase: true },
    explanationBn: '“To” ঘরে প্রাপকের ইমেইল ঠিকানা লিখতে হয়। অভ্যাসের জন্য এই নকল ঠিকানাটি টাইপ করুন: friend@mail.example (নাম, তারপর @, তারপর ডোমেইন)।',
    hintBn: 'ঘরে ক্লিক করে টাইপ করুন: friend@mail.example — সব ছোট হাতের অক্ষর, মাঝে @ চিহ্ন।',
    simplerBn: 'f-r-i-e-n-d লিখুন, তারপর Shift চেপে 2 চাপলে @ আসে (কিবোর্ড ভেদে আলাদা হতে পারে), তারপর m-a-i-l, ডট, e-x-a-m-p-l-e।',
  },
  {
    id: 'subject', osVariant: 'both', titleBn: 'বিষয় লিখুন: Subject', target: 'mail-subject', expectedAction: { type: 'type', target: 'mail-subject', text: 'Hello', ignoreCase: true },
    explanationBn: '“Subject” হলো চিঠির শিরোনাম — এক লাইনে চিঠিটি কীসের। ঘরে লিখুন: Hello',
    hintBn: 'To ঘরের ঠিক নিচের “Subject” ঘরে ক্লিক করে Hello টাইপ করুন।',
  },
  {
    id: 'body', osVariant: 'both', titleBn: 'চিঠির লেখা লিখুন', target: 'mail-body', expectedAction: { type: 'custom', event: 'mail-body-typed' },
    explanationBn: 'নিচের বড় সাদা জায়গাটিই চিঠির মূল অংশ (Body)। যা খুশি লিখুন, যেমন: Hello! How are you? বাংলা লেখা জানলে বাংলাতেও লিখতে পারেন।',
    hintBn: 'বড় সাদা ঘরটিতে ক্লিক করে কয়েকটি শব্দ টাইপ করুন।',
  },
  {
    id: 'attach-btn', osVariant: 'both', titleBn: 'ফাইল জুড়তে চান: Attach', target: 'mail-attach', expectedAction: { type: 'click', target: 'mail-attach' },
    explanationBn: 'এবার চিঠির সাথে একটি ফাইল জুড়ে দেব। নিচের “Attach file” বোতামে ক্লিক করুন।',
    hintBn: 'Send বোতামের পাশেই ক্লিপ চিহ্নের বোতাম।',
  },
  {
    id: 'attach-file', osVariant: 'both', titleBn: 'Documents থেকে ফাইল বাছুন', target: 'mail-picker-file-Recipe.txt', expectedAction: { type: 'custom', event: 'mail-attach:Recipe.txt' },
    explanationBn: 'একটি বাক্স খুলেছে — ফাইল সেভ করার বাক্সের মতোই। এখন আপনি Documents ফোল্ডারে আছেন। “Recipe.txt” ফাইলে ক্লিক করুন, তারপর নীল “Attach” বোতামে চাপুন (ফাইলে ডাবল ক্লিকেও হয়)।',
    hintBn: 'তালিকা থেকে Recipe.txt বেছে নিন; নীল রং হলে ঠিক বাছা হয়েছে। তারপর নিচের Attach বোতাম।',
    simplerBn: 'প্রথমে Recipe.txt লেখার ওপর একবার ক্লিক করুন। তারপর নিচের ডান দিকের “Attach” চাপুন।',
    successMessageBn: 'ফাইলটি চিঠির নিচে ক্লিপ-চিহ্নসহ একটি ছোট ট্যাগ (chip) হয়ে বসেছে। ভুল হলে ✕ দিয়ে সরানো যায়।',
  },
  {
    id: 'send', osVariant: 'both', titleBn: 'পাঠিয়ে দিন: Send', target: 'mail-send', expectedAction: { type: 'custom', event: 'mail-sent' },
    explanationBn: 'পাঠানোর আগে একবার দেখে নিন — ঠিকানা, বিষয় আর ফাইল ঠিক আছে তো? এবার নীল “Send” বোতামে চাপুন।',
    hintBn: 'চিঠির নিচের বাঁ দিকের নীল “Send” বোতাম।',
    successMessageBn: 'চিঠি চলে গেছে! এই অনুশীলনের বাক্সে একটু পরেই এর একটি স্বয়ংক্রিয় উত্তর আসবে।',
  },
  {
    id: 'wait-reply', osVariant: 'both', titleBn: 'উত্তরের জন্য একটু অপেক্ষা করুন', target: 'mail-folder-Inbox', expectedAction: { type: 'custom', event: 'mail-received' },
    explanationBn: 'আসল জীবনে উত্তর আসতে সময় লাগে। এখানে এক-দুই সেকেন্ড অপেক্ষা করুন — Inbox-এর গায়ে নতুন চিঠির সংখ্যা বাড়বে।',
    hintBn: 'কিছু করতে হবে না, শুধু অপেক্ষা করুন। এক-দুই সেকেন্ডেই নতুন চিঠি আসবে।',
  },
  {
    id: 'open-reply', osVariant: 'both', titleBn: 'এসে যাওয়া উত্তরটি খুলুন', target: 'mail-msg-Re: Hello', expectedAction: { type: 'click', target: 'mail-msg-Re: Hello' },
    explanationBn: 'তালিকার ওপরে নতুন চিঠিটি এসেছে। বিষয়ের আগে “Re:” দেখছেন? Re মানে Reply, অর্থাৎ উত্তর। চিঠিটিতে ক্লিক করুন।',
    hintBn: 'তালিকার একদম ওপরে, মোটা অক্ষরে “Re: Hello” লেখা চিঠি।',
  },
  {
    id: 'reply', osVariant: 'both', titleBn: 'উত্তরের উত্তর দিন: Reply', target: 'mail-reply', expectedAction: { type: 'custom', event: 'mail-reply' },
    explanationBn: 'ওপরের “Reply” বোতামে ক্লিক করুন। দেখুন, প্রাপকের ঠিকানা আর বিষয় নিজে থেকেই বসে গেছে। “Forward” দিয়ে একই চিঠি অন্য কাউকে পাঠানো যায়।',
    hintBn: 'চিঠির ওপরের সারিতে Reply, Forward, Spam, Delete বোতাম আছে — Reply-তে চাপুন।',
  },
  {
    id: 'pick-spam-msg', osVariant: 'both', titleBn: 'সন্দেহজনক চিঠিটি খুলুন', target: 'mail-msg-Claim your free gift now', expectedAction: { type: 'click', target: 'mail-msg-Claim your free gift now' },
    explanationBn: 'এবার বাজে ইমেইল চিনব। তালিকায় “Claim your free gift now” চিঠিটিতে ক্লিক করুন। (আগের ধাপের উত্তরের খসড়া নিয়ে চিন্তা নেই, ওটি নিজে থেকেই পড়ে থাকবে।)',
    hintBn: 'তালিকা নিচের দিকে স্ক্রল করলে “Claim your free gift now” পাবেন, পাঠকের নাম Lucky Winner।',
  },
  {
    id: 'mark-spam', osVariant: 'both', titleBn: 'Spam হিসেবে চিহ্নিত করুন', target: 'mail-spam', expectedAction: { type: 'custom', event: 'mail-spam' },
    explanationBn: 'চিঠিটি লোভ দেখিয়ে ব্যাংকের তথ্য চাইছে — এটি স্পষ্ট প্রতারণা। ওপরের “Spam” বোতামে চাপুন। চিঠিটি Spam ফোল্ডারে চলে যাবে, আর ইমেইল সেবা ভবিষ্যতে এমন চিঠি চিনতে শিখবে।',
    hintBn: 'চিঠির ওপরের সারিতে Spam লেখা বোতামটি।',
  },
  {
    id: 'open-spam-folder', osVariant: 'both', titleBn: 'Spam ফোল্ডার খুলুন', target: 'mail-folder-Spam', expectedAction: { type: 'click', target: 'mail-folder-Spam' },
    explanationBn: 'বাঁ দিকের তালিকা থেকে “Spam” ফোল্ডারে ক্লিক করুন। মাঝে মাঝে ভালো চিঠিও ভুল করে এখানে চলে আসে, তাই কখনো-সখনো এ ফোল্ডারটি দেখে নেওয়া ভালো।',
    hintBn: 'বাঁ দিকের ফোল্ডারের তালিকায় Inbox, Sent, Drafts-এর পর Spam।',
  },
  {
    id: 'open-verify-msg', osVariant: 'both', titleBn: 'ভুল করে Spam-এ আসা চিঠি খুলুন', target: 'mail-msg-Please verify your LearnCode email', expectedAction: { type: 'click', target: 'mail-msg-Please verify your LearnCode email' },
    explanationBn: 'এখানে একটি ভালো চিঠিও ঢুকে গেছে: LearnCode সাইটের যাচাইয়ের ইমেইল (Verification email), যেটি সাইন আপের পর আসে। “Please verify your LearnCode email” চিঠিটিতে ক্লিক করুন।',
    hintBn: 'Spam ফোল্ডারে দুটি চিঠি আছে — যেটির নাম LearnCode, সেটি।',
  },
  {
    id: 'not-spam', osVariant: 'both', titleBn: 'Not spam বেছে নিন', target: 'mail-notspam', expectedAction: { type: 'custom', event: 'mail-notspam' },
    explanationBn: 'চিঠিটি ভালো, তাই ওপরের “Not spam” বোতামে চাপুন। চিঠিটি Inbox-এ ফিরে যাবে।',
    hintBn: 'চিঠির ওপরের সারিতে “Not spam” বোতাম।',
  },
  {
    id: 'check-sent', osVariant: 'both', titleBn: 'Sent ফোল্ডারে পাঠানো চিঠি দেখুন', target: 'mail-folder-Sent', expectedAction: { type: 'click', target: 'mail-folder-Sent' },
    explanationBn: 'শেষে “Sent” ফোল্ডারে ক্লিক করুন। আপনি যা যা পাঠিয়েছেন — “Hello” সহ — সব এখানে জমা থাকে। পাঠানো হয়েছে কি না সন্দেহ হলে এখানে দেখবেন।',
    hintBn: 'বাঁ দিকের তালিকায় Inbox-এর নিচে Sent।',
    successMessageBn: 'চমৎকার! ইমেইল পাঠানো, পড়া, উত্তর দেওয়া আর বাজে ইমেইল সামলানো — সবই শিখে ফেললেন।',
  },
]

const lesson: Lesson = {
  module: 8,
  part: 1,
  id: 'm08',
  titleBn: 'ইমেইল ও অনলাইন অ্যাকাউন্ট',
  oneLineBn: 'ইমেইল পাঠাই, ফাইল জুড়ে দিই এবং অ্যাকাউন্টের ভালো অভ্যাস গড়ি।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['account', 'username', 'password', 'sign-up', 'log-in', 'log-out', 'verification-email', 'recovery', 'otp', 'email', 'email-address', 'domain', 'inbox', 'sent', 'draft', 'spam', 'compose', 'subject', 'attachment', 'reply', 'forward'],

  explanation: [
    { kind: 'p', textBn: 'ইন্টারনেটে অনেক সেবা আছে — ইমেইল, ভিডিও, কোডের সাইট, অনলাইন কোর্স। এগুলো ব্যবহার করতে সাধারণত একটি অ্যাকাউন্ট (Account) খুলতে হয়। অ্যাকাউন্ট হলো সেই সাইটে আপনার নিজের জায়গা — আপনার তথ্য, আপনার কাজ সেখানে জমা থাকে।' },
    { kind: 'analogy', textBn: 'অ্যাকাউন্ট অনেকটা ব্যাংকের লকারের মতো। লকারটি আপনার, তার একটি নম্বর বা নাম আছে (এটিই ইউজারনেম, Username), আর খুলতে একটি গোপন চাবি লাগে (এটিই পাসওয়ার্ড, Password)। চাবি কাউকে দিলে যে কেউ লকার খুলে ফেলতে পারে।' },
    { kind: 'p', textBn: 'নতুন অ্যাকাউন্ট খোলাকে বলে সাইন আপ (Sign up)। পরে ঢোকাকে বলে লগ ইন (Log in) আর বেরিয়ে আসাকে লগ আউট (Log out)। প্রায় সব সাইট সাইন আপের সময় আপনার ইমেইল ঠিকানা চায়। কেন? কারণ ইমেইল ঠিকানাই অনলাইন দুনিয়ায় আপনার পরিচয়ের চাবি:' },
    {
      kind: 'list',
      itemsBn: [
        'সাইট আপনাকে একটি যাচাইয়ের ইমেইল (Verification email) পাঠিয়ে নিশ্চিত হয় ঠিকানাটি সত্যিই আপনার।',
        'পাসওয়ার্ড ভুলে গেলে উদ্ধারের লিংক (Recovery) ওই ইমেইলেই আসে।',
        'নিরাপত্তা বা নতুন নিয়মের খবর সাইট ওই ঠিকানাতেই জানায়।',
        'কোডিং শেখার সময় GitHub-এর মতো সাইটে অ্যাকাউন্ট খুলতেও একটি ইমেইল ঠিকানা লাগবে।',
      ],
    },
    { kind: 'note', textBn: 'ইমেইল ঠিকানা হারালে বা সেটির পাসওয়ার্ড অন্যের হাতে গেলে বাকি সব অ্যাকাউন্টও বিপদে পড়তে পারে। তাই ইমেইল অ্যাকাউন্টের যত্ন সবচেয়ে বেশি নিন।' },
    { kind: 'p', textBn: 'এবার ইমেইল ঠিকানার গড়ন বুঝি। সব ইমেইল ঠিকানা একই ছাঁচে লেখা: নাম @ ডোমেইন।' },
    { kind: 'widget', widget: 'email-parts' },
    { kind: 'p', textBn: 'একটি ইমেইল লিখতে হলে কয়েকটি ঘর পূরণ করতে হয়:' },
    {
      kind: 'list',
      itemsBn: [
        'To (প্রাপক): যাকে পাঠাচ্ছেন তার ঠিকানা। একাধিক জনকে পাঠাতে কমা (,) দিয়ে লিখতে পারেন। আসল ইমেইলে Cc নামে আরেকটি ঘর থাকে — যাদের শুধু জানিয়ে রাখতে চান, তাদের ঠিকানা সেখানে লেখা হয়।',
        'Subject (বিষয়): এক লাইনের শিরোনাম। পরিষ্কার বিষয় লিখলে প্রাপক চিঠিটি দ্রুত চিনতে পারেন।',
        'Body (মূল লেখা): আসল কথা। ভদ্র শুরু আর শেষ রাখুন — যেমন “প্রিয় রিনা আপু,” বা “Dear Rina Apu,” দিয়ে শুরু করে “ধন্যবাদ” দিয়ে শেষ করুন।',
        'অ্যাটাচমেন্ট (Attachment): চিঠির সাথে জুড়ে দেওয়া ফাইল, ছবি বা লেখা। সব ইমেইল সেবায় ফাইলের মোট আকারের একটি সীমা থাকে (সাধারণত ২০–২৫ MB-এর কাছাকাছি), তাই খুব বড় ফাইল পাঠানো যায় না।',
      ],
    },
    { kind: 'p', textBn: 'আসা চিঠির উত্তর দিতে রিপ্লাই (Reply) চাপুন — ঠিকানা আর বিষয় (Re:) নিজে থেকেই বসে যায়। অন্য কাউকে চিঠিটি পাঠাতে ফরোয়ার্ড (Forward) চাপুন — বিষয়ের আগে Fwd: বসে। ব্যক্তিগত কারও চিঠি ফরোয়ার্ড করার আগে একটু ভেবে নিন।' },
    { kind: 'p', textBn: 'ফোল্ডারগুলো চিনে রাখুন: Inbox (আসা চিঠি), Sent (পাঠানো চিঠি), Drafts (লেখা শুরু করেও না-পাঠানো), Spam (বাজে চিঠি), Trash (মুছে ফেলা চিঠি; এখান থেকে ফিরিয়ে আনা যায়)।' },
    { kind: 'p', textBn: 'স্প্যাম (Spam) হলো অচেনা কারও পাঠানো বিজ্ঞাপন বা প্রতারণার ইমেইল। ইমেইল সেবা কিছু লক্ষণ দেখে এগুলো নিজে থেকেই Spam ফোল্ডারে সরিয়ে দেয়: লোভ দেখানো (“আপনি লাখ টাকা জিতেছেন”), তাড়াহুড়ো করানো, অচেনা পাঠক, বানান ভুল, অদ্ভুত লিংক। মাঝে মাঝে ভালো চিঠিও ভুলে সেখানে যায়, আবার বাজে চিঠি Inbox-এও ঢুকে পড়ে — দুই ক্ষেত্রেই আপনি নিজে Not spam বা Spam চেপে শুধরে দিতে পারেন।' },
    { kind: 'note', textBn: 'ইমেইলে কেউ আপনার পাসওয়ার্ড, ওটিপি (OTP — ফোনে বা ইমেইলে আসা এককালীন কোড) বা ব্যাংকের তথ্য চাইলে তা কখনো দেবেন না। সত্যিকারের ব্যাংক বা সেবা কখনো ইমেইলে পাসওয়ার্ড বা ওটিপি চায় না। সন্দেহজনক লিংকে ক্লিক করবেন না, আর অচেনা কারও পাঠানো অ্যাটাচমেন্ট খুলবেন না।' },
    { kind: 'p', textBn: 'এবার সাইন আপ করে দেখি। নিচের নকল পাতায় ঘরগুলো ভরুন — এটি শুধু অনুশীলনের জন্য, কোথাও কিছু যায় না। পাসওয়ার্ডের নিয়মগুলো মেলাতে মেলাতে সবুজ টিক পড়বে। সাইন আপের পর একটি যাচাইয়ের ইমেইল আসবে।' },
    { kind: 'widget', widget: 'signup-form' },
    { kind: 'p', textBn: 'অ্যাকাউন্টের কিছু ভালো অভ্যাস:' },
    {
      kind: 'list',
      itemsBn: [
        'একটি মূল ইমেইল ঠিকানা বেছে নিন যেটি আপনি বছরের পর বছর ব্যবহার করবেন, আর পাসওয়ার্ড হারাবেন না।',
        'প্রতিটি সাইটের জন্য আলাদা, শক্ত পাসওয়ার্ড রাখুন। এ নিয়ে ৯ নম্বর পাঠে বিস্তারিত শিখব।',
        'ওটিপি বা পাসওয়ার্ড কাউকে বলবেন না।',
        'অন্যের বা সবার ব্যবহারের কম্পিউটারে (যেমন ক্যাফে বা অফিসের কম্পিউটার) কাজ শেষে অবশ্যই লগ আউট করুন।',
        'রিকভারি ইমেইল বা ফোন নম্বর আগে থেকেই যোগ করে রাখুন, যাতে পাসওয়ার্ড ভুলে গেলেও অ্যাকাউন্ট ফিরে পান।',
        'কোডিং, চাকরি বা পেশার অ্যাকাউন্টের জন্য ঠিকানাটি ভদ্র ও পেশাদার রাখুন — যেমন anika.rahman@… — মজার ডাকনাম (lovely_girl_99@…) নয়।',
      ],
    },
    { kind: 'note', textBn: MAIL_NOTE },
  ],

  steps: [...open, ...common],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'নিজের ঠিকানায় চিঠি পাঠিয়ে দেখুন — আপনার অনুশীলনের ঠিকানা anika@mail.example। পাঠালে একটু পরে সেটি Inbox-এ ফিরে আসবে। ভুল ঠিকানা লিখলে বা To ঘর ফাঁকা রাখলে কী বার্তা আসে তাও দেখুন। সব এলোমেলো হলে “রিসেট” চাপুন।',
    checklistBn: [
      'Compose চেপে নিজের ঠিকানায় (anika@mail.example) একটি চিঠি পাঠিয়েছি এবং সেটি Inbox-এ ফিরে এসেছে',
      'To ঘরে ভুল ঠিকানা (যেমন anika) লিখে Send চেপে বার্তাটি দেখেছি',
      'একটি চিঠিতে বাংলা লিখেছি',
      'Documents থেকে একটি ফাইল অ্যাটাচ করে পাঠিয়েছি, তারপর সেটি ✕ দিয়ে সরানোও দেখেছি',
      'Welcome চিঠিটিতে Forward চেপে দেখেছি',
      'একটি চিঠি Delete করে Trash ফোল্ডারে দেখেছি, তারপর Restore করেছি',
      'Drafts-এ একটি অসমাপ্ত চিঠি জমিয়েছি (Save draft)',
    ],
  },

  quiz: [
    {
      id: 'q-domain', type: 'clickTarget', questionBn: 'ইমেইল ঠিকানা anika@mail.example-এ ডোমেইন (Domain) কোনটি?',
      items: [
        { id: 'name', labelBn: 'anika', icon: '👤' },
        { id: 'at', labelBn: '@', icon: '🔤' },
        { id: 'domain', labelBn: 'mail.example', icon: '🌐' },
      ],
      correct: 'domain',
      hintBn: 'ডোমেইন থাকে @ চিহ্নের পরে — ইমেইল সেবার ডাকঘরের নামের মতো।',
      explanationBn: 'ঠিক! @ চিহ্নের পরের অংশ mail.example হলো ডোমেইন। আর @ চিহ্নের আগের anika হলো নাম বা ইউজারনেম।',
    },
    {
      id: 'q-order', type: 'ordering', questionBn: 'একটি ইমেইল পাঠানোর ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'Compose চাপি' },
        { id: '2', textBn: 'To ঘরে প্রাপকের ঠিকানা লিখি' },
        { id: '3', textBn: 'Subject আর মূল লেখা লিখি, দরকারে ফাইল জুড়ি' },
        { id: '4', textBn: 'Send চাপি' },
      ],
      hintBn: 'আগে নতুন চিঠি শুরু করতে হবে, তারপর কাকে পাঠাবেন, তারপর কী লিখবেন — আর সবার শেষে পাঠানো।',
      explanationBn: 'চমৎকার! Compose → To → Subject ও লেখা (ফাইল জুড়ে) → Send। পাঠানোর আগে ঠিকানাটি আরেকবার দেখে নেবেন।',
    },
    {
      id: 'q-folders', type: 'dragMatch', questionBn: 'ফোল্ডারের নামের সাথে তার কাজ মিলিয়ে দিন।',
      pairs: [
        { id: 'inbox', leftBn: 'Inbox', rightBn: 'আপনার কাছে আসা চিঠি' },
        { id: 'sent', leftBn: 'Sent', rightBn: 'আপনার পাঠানো চিঠির কপি' },
        { id: 'drafts', leftBn: 'Drafts', rightBn: 'লেখা শুরু করেও না-পাঠানো চিঠি' },
        { id: 'spam', leftBn: 'Spam', rightBn: 'সন্দেহজনক বা বিজ্ঞাপনের চিঠি' },
      ],
      hintBn: 'Sent মানে “পাঠানো হয়েছে”। Drafts মানে খসড়া, অর্থাৎ পাঠানো বাকি।',
      explanationBn: 'চারটিই মিলেছে! এই ফোল্ডারগুলো প্রায় সব ইমেইল সেবায় একই নামে পাবেন।',
    },
    {
      id: 'q-why-email', type: 'multipleChoice', questionBn: 'অনলাইন অ্যাকাউন্ট খোলার সময় সাইট কেন আপনার ইমেইল ঠিকানা চায়?',
      options: [
        { id: 'a', textBn: 'ঠিকানাটি যে আপনার তা যাচাই করতে, আর পাসওয়ার্ড ভুলে গেলে উদ্ধারের লিংক পাঠাতে' },
        { id: 'b', textBn: 'যাতে আপনার পাসওয়ার্ড সবাইকে জানিয়ে দেওয়া যায়' },
        { id: 'c', textBn: 'শুধু বিজ্ঞাপন দেখানোর জন্য, অন্য কোনো কারণ নেই' },
      ],
      correct: ['a'],
      hintBn: 'সাইন আপের পর যে “যাচাইয়ের ইমেইল” আসে আর পাসওয়ার্ড ভুলে গেলে যে লিংক আসে, তার কথা ভাবুন।',
      explanationBn: 'ঠিক। ইমেইল ঠিকানাই অ্যাকাউন্টের যাচাই আর উদ্ধারের চাবি। তাই এই ঠিকানা হারালে বা অন্যের হাতে গেলে অনেক ক্ষতি হতে পারে।',
    },
    {
      id: 'q-spam', type: 'multipleChoice', questionBn: 'একটি অচেনা ইমেইলে লেখা: “আপনি পুরস্কার জিতেছেন! এখনই আপনার ওটিপি আর ব্যাংকের তথ্য পাঠান।” আপনি কী করবেন?',
      options: [
        { id: 'a', textBn: 'তথ্য পাঠিয়ে দেব, পুরস্কারটা তো ভালো' },
        { id: 'b', textBn: 'উত্তর দেব না, লিংকে ক্লিক করব না, চিঠিটি Spam হিসেবে চিহ্নিত করব' },
        { id: 'c', textBn: 'বন্ধুদের ফরোয়ার্ড করে দেব' },
      ],
      correct: ['b'],
      hintBn: 'ওটিপি বা ব্যাংকের তথ্য কেউ ইমেইলে চাইলে সেটি প্রতারণা। উত্তর না দিয়ে চিঠিটিকে বাজে হিসেবে চিহ্নিত করুন।',
      explanationBn: 'একদম ঠিক। ওটিপি, পাসওয়ার্ড বা ব্যাংকের তথ্য কাউকে দেবেন না। চিঠিটি Spam করলে ইমেইল সেবা এ ধরনের চিঠি চিনতে শেখে।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'অ্যাকাউন্ট = ইউজারনেম + পাসওয়ার্ড। সাইন আপ করলে অ্যাকাউন্ট খোলে, লগ ইন করলে ঢোকা যায়, আর লগ আউট করে বেরোনো যায়।',
      'ইমেইল ঠিকানা অনলাইন অ্যাকাউন্টের চাবি: সাইন আপে যাচাইয়ের ইমেইল আসে, পাসওয়ার্ড ভুললে উদ্ধারের লিংকও ওখানেই আসে।',
      'ইমেইল ঠিকানার ছাঁচ: নাম @ ডোমেইন (যেমন anika@mail.example)।',
      'ইমেইল লিখতে: Compose → To → Subject → মূল লেখা → (দরকারে Attach) → Send। পাঠানো চিঠি Sent ফোল্ডারে থাকে।',
      'Reply (উত্তর), Forward (অন্যকে পাঠানো)। অ্যাটাচমেন্টের আকারের একটি সীমা আছে, আর অচেনা অ্যাটাচমেন্ট খুলবেন না।',
      'বাজে চিঠি Spam ফোল্ডারে যায়। ভালো চিঠি ভুলে Spam-এ গেলে Not spam চাপুন; সন্দেহজনক চিঠি Spam করুন। ওটিপি আর পাসওয়ার্ড কাউকে দেবেন না।',
      'ভালো অভ্যাস: একটি স্থায়ী ইমেইল, আলাদা শক্ত পাসওয়ার্ড, শেয়ার করা কম্পিউটারে লগ আউট, রিকভারি ইমেইল/ফোন যোগ করা, আর পেশার জন্য ভদ্র ঠিকানা (firstname.lastname)।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো নিরাপদ।',
    tasksBn: [
      'নিজের ইমেইল খুলে নিজের ঠিকানাতেই একটি ছোট চিঠি পাঠান — বিষয়: “Test”। কিছুক্ষণ পরে Inbox-এ এসেছে কি না দেখুন।',
      'নিজের ইমেইলের Spam ফোল্ডারটি একবার খুলে দেখুন কোনো ভালো চিঠি ভুলে ঢুকেছে কি না। কোনো লিংকে ক্লিক করবেন না।',
      'আপনার ইমেইল অ্যাকাউন্টের সেটিংসে রিকভারি ফোন নম্বর বা রিকভারি ইমেইল আছে কি না শুধু দেখে নিন। না থাকলে কারও সাহায্য নিয়ে যোগ করুন। (কোথাও পাসওয়ার্ড লিখে দেখানোর দরকার নেই।)',
    ],
  },

  teacherTipBn:
    'ইমেইলের সবচেয়ে বড় শিক্ষা “ইমেইল ঠিকানাই চাবি” — এই কথাটি আসল অ্যাকাউন্টে গিয়ে নিজে দেখিয়ে দিন: কোনো সাইটের “Forgot password” পাতায় গিয়ে দেখান, উদ্ধারের লিংক কোথায় যায়। সিমুলেশনে ওটিপি, পাসওয়ার্ড বা আসল ঠিকানা টাইপ করানোর দরকার নেই; অনুশীলনের ঠিকানাগুলো সব নকল (.example)। আসল ইমেইলে ফিরে গিয়ে পাসওয়ার্ড লেখার সময় তার পাশে না দাঁড়িয়ে আপনি একটু সরে বসবেন, আর ওটিপি/প্রতারণার সাবধানতার কথা বারবার মনে করিয়ে দিন। পাসওয়ার্ড ম্যানেজার ও শক্ত পাসওয়ার্ড নিয়ে বিস্তারিত ৯ নম্বর পাঠে।',
}

export default lesson
