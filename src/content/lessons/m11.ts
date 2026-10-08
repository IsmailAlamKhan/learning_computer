import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 11,
  part: 1,
  id: 'm11',
  titleBn: 'ছবি, গান, স্ক্রিনশট, পেনড্রাইভ ও প্রিন্ট',
  oneLineBn: 'ছবি দেখা, গান-ভিডিও চালানো, স্ক্রিনশট তোলা, পেনড্রাইভ ও ফোন থেকে ফাইল নেওয়া আর প্রিন্ট বাতিল করা শিখি।',
  minutes: 7,
  simulation: 'desktop',
  glossaryIds: ['photo', 'image-file', 'video', 'audio', 'media-player', 'screenshot', 'snip', 'usb-drive', 'eject', 'safely-remove', 'printer', 'print-queue', 'cancel-print', 'phone-transfer', 'storage'],

  explanation: [
    { kind: 'p', textBn: 'কম্পিউটারে শুধু লেখাই নয়, ছবি, গান আর ভিডিও-ও থাকে। এগুলোও একেকটি ফাইল। ছবির ফাইলে সাধারণত .jpg বা .png, গানের ফাইলে .mp3, আর ভিডিওর ফাইলে .mp4 লেখা থাকে।' },
    { kind: 'analogy', textBn: 'ছবির ফাইল হলো অ্যালবামের ছবির মতো, গানের ফাইল হলো ক্যাসেটের মতো। অ্যালবাম দেখতে যেমন পাতা ওল্টাতে হয়, ক্যাসেট শুনতে যেমন প্লেয়ারে দিতে হয়, কম্পিউটারেও তেমনি ছবি দেখার জন্য আলাদা প্রোগ্রাম (Photos) আর গান-ভিডিও চালানোর জন্য আলাদা প্রোগ্রাম (Media Player) থাকে। ডাবল ক্লিক করলে ঠিক প্রোগ্রামটি নিজেই খুলে যায়।' },
    { kind: 'p', textBn: 'আজ আমরা ছয়টি কাজ শিখব:' },
    {
      kind: 'list',
      itemsBn: [
        'ছবি দেখা, পরের ছবিতে যাওয়া আর বড় (জুম) করা।',
        'গান বা ভিডিও চালানো, থামানো আর আওয়াজ কমানো-বাড়ানো।',
        'স্ক্রিনশট (Screenshot) তোলা — পর্দায় যা দেখা যাচ্ছে তার ছবি।',
        'পেনড্রাইভ (USB Drive) লাগানো, ফাইল কপি করা আর নিরাপদে খুলে নেওয়া (Eject)।',
        'ফোন থেকে ছবি কম্পিউটারে নেওয়া।',
        'কিছু প্রিন্ট করা, আর ভুল হলে প্রিন্ট বাতিল (Cancel) করা।',
      ],
    },
    { kind: 'widget', widget: 'screenshot-keys' },
    { kind: 'note', textBn: 'নিয়ম মনে রাখুন: পেনড্রাইভ কখনো সরাসরি টেনে খুলবেন না। আগে Eject (Windows-এ “Safely Remove”) করুন, তারপর খুলুন — না হলে ভেতরের ফাইল নষ্ট হয়ে যেতে পারে।' },
    { kind: 'note', textBn: 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — কোনো কোনো ল্যাপটপে PrtScn কী-এর সাথে Fn চাপতে হয়। আর Mac-এ iPhone থেকে ছবি আনতে সাধারণত Photos বা Image Capture প্রোগ্রাম লাগে; Android ফোনের জন্য আলাদা একটি ট্রান্সফার টুল দরকার হয়। এই অনুশীলনে সহজ করে ফোনটিকে একটি ড্রাইভের মতো দেখানো হয়েছে।' },
  ],

  setup: {
    hardware: true,
    vfs: (vfs, os) => {
      const desktop = vfs.child(vfs.home, 'Desktop')
      const flower = vfs.resolve('~/Pictures/Flower.png')
      const song = vfs.resolve('~/Music/Song.mp3')
      const river = vfs.resolve('~/Pictures/River.jpg')
      if (desktop && flower) vfs.copy(flower, desktop)
      if (desktop && river) vfs.copy(river, desktop)
      if (desktop && song) vfs.copy(song, desktop)
      const videos = vfs.child(vfs.home, os === 'windows' ? 'Videos' : 'Movies')
      if (videos && !vfs.child(videos, 'Holiday.mp4')) vfs.createFile(videos, 'Holiday.mp4')
    },
  },

  steps: [
    // ---------- Windows ----------
    {
      id: 'w-photo-open', osVariant: 'windows', titleBn: 'ছবি খুলুন', target: 'icon-Flower.png', expectedAction: { type: 'doubleClick', target: 'icon-Flower.png' },
      explanationBn: 'ডেস্কটপে “Flower.png” নামে একটি ছবি আছে। এতে ডাবল ক্লিক করুন। ছবি দেখার প্রোগ্রাম (Photos) নিজেই খুলে যাবে।',
      hintBn: 'বাঁ দিকের ছবির আইকনটিতে পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
      simplerBn: 'মাউসের তীর ফুলের ছবির ওপর রাখুন, তারপর বাঁ বোতাম “টুক-টুক” করে দুবার চাপুন।',
    },
    {
      id: 'w-photo-next', osVariant: 'windows', titleBn: 'পরের ছবিতে যান', target: 'photos-next', expectedAction: { type: 'click', target: 'photos-next' },
      explanationBn: 'ডান পাশের › তীরে ক্লিক করুন, তাহলে পরের ছবিটি আসবে। কিবোর্ডের ডান তীর (→) চাপলেও একই কাজ হয়। ছবি বড় করে দেখতে ওপরের + বোতামও আছে — চাইলে চেপে দেখতে পারেন।',
      hintBn: 'ছবির ডান দিকের গোল › বোতামটি খুঁজুন।',
    },
    {
      id: 'w-photo-close', osVariant: 'windows', titleBn: 'ছবির উইন্ডো বন্ধ করুন', target: 'win-photos-close', expectedAction: { type: 'click', target: 'win-photos-close' },
      explanationBn: 'দেখা শেষ, তাই উইন্ডোর ডান ওপরের ✕ বোতামে ক্লিক করুন।',
      hintBn: 'উইন্ডোর একদম ডান ওপরের কোণ।',
    },
    {
      id: 'w-song-open', osVariant: 'windows', titleBn: 'গান খুলুন', target: 'icon-Song.mp3', expectedAction: { type: 'doubleClick', target: 'icon-Song.mp3' },
      explanationBn: 'ডেস্কটপের “Song.mp3” হলো একটি গানের ফাইল। এতে ডাবল ক্লিক করুন — Media Player খুলবে। (এই অনুশীলনে আসল আওয়াজ হবে না, শুধু নকল গান চলবে।)',
      hintBn: 'গানের আইকনটিতে পরপর দুবার ক্লিক করুন।',
    },
    {
      id: 'w-play', osVariant: 'windows', titleBn: 'গান চালু করুন', target: 'media-play', expectedAction: { type: 'click', target: 'media-play' },
      explanationBn: 'নিচের বাঁ দিকের ▶ Play বোতামে ক্লিক করুন। ওপরের রঙিন দণ্ডগুলো নড়তে শুরু করলে বুঝবেন গান চলছে। আবার চাপলে থেমে যাবে (Pause)।',
      hintBn: 'নিচের বারের একদম বাঁ দিকের বোতামটি।',
    },
    {
      id: 'w-mute', osVariant: 'windows', titleBn: 'আওয়াজ বন্ধ করুন', target: 'media-mute', expectedAction: { type: 'click', target: 'media-mute' },
      explanationBn: 'নিচের ডান দিকের স্পিকার 🔊 চিহ্নে ক্লিক করলে আওয়াজ একেবারে বন্ধ (Mute) হয়ে যায়। তার পাশের স্লাইডার টেনে আওয়াজ ধীরে ধীরে কমানো-বাড়ানো যায়।',
      hintBn: 'ডান দিকের ছোট স্পিকারের চিহ্নটি।',
    },
    {
      id: 'w-media-close', osVariant: 'windows', titleBn: 'প্লেয়ার বন্ধ করুন', target: 'win-media-close', expectedAction: { type: 'click', target: 'win-media-close' },
      explanationBn: 'এবার ✕ বোতামে ক্লিক করে প্লেয়ার বন্ধ করুন।',
      hintBn: 'উইন্ডোর ডান ওপরের কোণ।',
    },
    {
      id: 'w-snip-key', osVariant: 'windows', titleBn: 'স্ক্রিনশটের শর্টকাট', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'win+shift+s' },
      explanationBn: 'এবার পর্দার একটি অংশের ছবি তুলব। একসাথে Win + Shift + S চাপুন (Win হলো স্টার্টের চিহ্নওয়ালা কী)। কিবোর্ডে না হলে নিচের শর্টকাট প্যাড ব্যবহার করুন।',
      hintBn: 'Win, Shift আর S — তিনটি কী একসাথে। প্যাডে আগে Win ও Shift বেছে নিন, তারপর S-এ ক্লিক করুন।',
      simplerBn: 'শর্টকাট প্যাডে Win বোতামে ক্লিক করুন, তারপর Shift-এ, সবশেষে S-এ।',
    },
    {
      id: 'w-snip-drag', osVariant: 'windows', titleBn: 'টেনে অংশ বেছে নিন', target: 'snip-overlay', expectedAction: { type: 'custom', event: 'screenshot-taken' },
      explanationBn: 'পর্দা একটু অন্ধকার হয়েছে। এবার মাউসের বাঁ বোতাম চেপে ধরে একটি অংশের ওপর দিয়ে টেনে নিয়ে বোতাম ছেড়ে দিন। যেটুকু আয়তক্ষেত্র বেছে নেবেন, শুধু সেটুকুর ছবি উঠবে।',
      hintBn: 'বাঁ বোতাম চেপে ধরে ওপর থেকে নিচে কোনাকুনি টানুন, তারপর ছেড়ে দিন।',
      simplerBn: 'পর্দার একটি জায়গায় মাউস রেখে বোতাম চেপে ধরুন, অন্য একটি জায়গায় টেনে নিয়ে গিয়ে ছেড়ে দিন।',
    },
    {
      id: 'w-snip-open', osVariant: 'windows', titleBn: 'নোটিফিকেশনে ক্লিক করুন', target: 'snip-notification', expectedAction: { type: 'click', target: 'snip-notification' },
      explanationBn: 'ছবিটি এখন ক্লিপবোর্ডে (কপি করা অবস্থায়) আছে, কিন্তু ফাইল হয়নি। নিচের ডান কোণে “Snip saved to clipboard” লেখা বাক্সে ক্লিক করুন — ছবিটি খুলবে।',
      hintBn: 'ডান নিচের কোণে ছোট সাদা বাক্স।',
    },
    {
      id: 'w-snip-save', osVariant: 'windows', titleBn: 'ছবিটি সেভ করুন', target: 'snip-save', expectedAction: { type: 'custom', event: 'screenshot-saved' },
      explanationBn: 'ওপরের Save বোতামে ক্লিক করুন। ছবিটি Pictures ফোল্ডারে ফাইল হয়ে জমা হবে, নাম হবে “Screenshot” আর আজকের তারিখ-সময়।',
      hintBn: 'ওপরের বাঁ দিকের নীল Save বোতাম।',
    },
    {
      id: 'w-usb-insert', osVariant: 'windows', titleBn: 'পেনড্রাইভ লাগান', target: 'hw-usb-insert', expectedAction: { type: 'click', target: 'hw-usb-insert' },
      explanationBn: 'স্ক্রিনের নিচের “হার্ডওয়্যার প্যানেল” আসল কম্পিউটারের ইউএসবি পোর্টের কাজ করছে। “পেনড্রাইভ লাগান” বোতামে ক্লিক করুন।',
      hintBn: 'ছবির নিচে বাক্সের ভেতরের 💾 বোতাম।',
    },
    {
      id: 'w-usb-files', osVariant: 'windows', titleBn: 'ফাইল এক্সপ্লোরার খুলুন', target: 'taskbar-app-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'টাস্কবারের ফোল্ডারের আইকনে (File Explorer) ক্লিক করুন। এখান থেকে পেনড্রাইভ দেখা যাবে।',
      hintBn: 'টাস্কবারের নিচের সারিতে হলুদ ফোল্ডারের মতো আইকন।',
    },
    {
      id: 'w-usb-drive', osVariant: 'windows', titleBn: 'পেনড্রাইভটি খুলুন', target: 'fm-sidebar-USB DRIVE (D:)', expectedAction: { type: 'click', target: 'fm-sidebar-USB DRIVE (D:)' },
      explanationBn: 'বাঁ দিকের তালিকার নিচের দিকে “USB DRIVE (D:)” নামে নতুন একটি জায়গা এসেছে। এতে ক্লিক করে ভেতরের ফাইল দেখুন।',
      hintBn: 'বাঁ তালিকায় This PC-র নিচে ইউএসবি আইকনওয়ালা নামটি।',
    },
    {
      id: 'w-usb-copy', osVariant: 'windows', titleBn: 'পেনড্রাইভ থেকে ফাইল কপি করুন', target: 'fm-item-Project Notes.txt', expectedAction: { type: 'drag', target: 'fm-item-Project Notes.txt', dropTarget: 'fm-sidebar-Documents' },
      explanationBn: '“Project Notes.txt” ফাইলটি ধরে টেনে বাঁ তালিকার “Documents”-এর ওপর ছেড়ে দিন। এক ড্রাইভ থেকে অন্য ড্রাইভে টানলে ফাইলটি সরে না, কপি হয়ে যায়। (কপি-পেস্ট করেও একই কাজ হয়।)',
      hintBn: 'ফাইলের নামের ওপর বাঁ বোতাম চেপে ধরে বাঁ তালিকার Documents পর্যন্ত টানুন, তারপর ছেড়ে দিন।',
      simplerBn: 'ফাইলটি একবার ক্লিক করে বেছে নিন। বোতাম চেপে রেখে মাউস সরিয়ে বাঁ দিকের “Documents”-এর ওপর আনুন, তারপর ছেড়ে দিন।',
    },
    {
      id: 'w-usb-tray', osVariant: 'windows', titleBn: 'নিরাপদে খোলার আইকন', target: 'tray-usb', expectedAction: { type: 'click', target: 'tray-usb' },
      explanationBn: 'এবার পেনড্রাইভ খুলতে হবে — কিন্তু সরাসরি টেনে নয়! টাস্কবারের ডান দিকে একটি ছোট ইউএসবি আইকন এসেছে। সেটিতে ক্লিক করুন।',
      hintBn: 'টাস্কবারের ডান দিকে ঘড়ির একটু বাঁয়ে ছোট নীল ইউএসবি চিহ্ন।',
    },
    {
      id: 'w-usb-eject', osVariant: 'windows', titleBn: 'Eject করুন', target: 'tray-eject', expectedAction: { type: 'click', target: 'tray-eject' },
      explanationBn: '“Eject USB DRIVE (D:)” লেখায় ক্লিক করুন। “Safe to Remove Hardware” বার্তা এলে বুঝবেন এখন খোলা নিরাপদ।',
      hintBn: 'ছোট মেনুতে একটিই লেখা আছে — Eject দিয়ে শুরু।',
    },
    {
      id: 'w-usb-pull', osVariant: 'windows', titleBn: 'এবার পেনড্রাইভ খুলে নিন', target: 'hw-usb-pull', expectedAction: { type: 'click', target: 'hw-usb-pull' },
      explanationBn: 'এখন হার্ডওয়্যার প্যানেলের “পেনড্রাইভ খুলে নিন” বোতামে ক্লিক করুন, যেন পোর্ট থেকে টেনে বের করছেন।',
      hintBn: 'হার্ডওয়্যার প্যানেলের একই জায়গার বোতামটি এখন বদলে গেছে।',
    },
    {
      id: 'w-phone-connect', osVariant: 'windows', titleBn: 'ফোন লাগান', target: 'hw-phone-connect', expectedAction: { type: 'click', target: 'hw-phone-connect' },
      explanationBn: 'এবার ফোন লাগাই। “ফোন কেবল দিয়ে যুক্ত করুন” বোতামে ক্লিক করুন — যেন ইউএসবি কেবল দিয়ে ফোনটি কম্পিউটারে লাগালেন।',
      hintBn: 'হার্ডওয়্যার প্যানেলে 📱 চিহ্নের বোতাম।',
    },
    {
      id: 'w-phone-allow', osVariant: 'windows', titleBn: 'ফোনের পর্দায় অনুমতি দিন', target: 'hw-phone-allow', expectedAction: { type: 'click', target: 'hw-phone-allow' },
      explanationBn: 'ফোনের পর্দায় জানতে চাইছে ইউএসবি দিয়ে কী করবেন। ফাইল নেওয়ার জন্য “File transfer”-এ ক্লিক করুন। আসল ফোনেও এই অনুমতি না দিলে কম্পিউটার ফোনের ছবি দেখতে পায় না।',
      hintBn: 'ছোট কালো ফোনের পর্দায় নীল বোতাম।',
    },
    {
      id: 'w-phone-open', osVariant: 'windows', titleBn: 'ফোনের ভেতরে দেখুন', target: 'fm-sidebar-Phone', expectedAction: { type: 'click', target: 'fm-sidebar-Phone' },
      explanationBn: 'ফাইল এক্সপ্লোরারের বাঁ তালিকায় “Phone” এসেছে। এতে ক্লিক করুন। ভেতরে Internal storage › DCIM › Camera ফোল্ডারে ফোনে তোলা ছবি থাকে। সেখান থেকে ছবি টেনে Pictures-এ এনে কপি করা যায় — এটি একটু পরে নিজে চেষ্টা করবেন।',
      hintBn: 'বাঁ তালিকার নিচের দিকে Phone নামটি।',
    },
    {
      id: 'w-print-notepad', osVariant: 'windows', titleBn: 'নোটপ্যাড খুলুন', target: 'taskbar-app-editor', expectedAction: { type: 'openApp', app: 'editor' },
      explanationBn: 'এবার প্রিন্টের কাজ। টাস্কবারে Notepad আইকনে ক্লিক করুন। একটি খালি পাতা খুলবে — প্রিন্টের জন্য তাতে কিছু না লিখলেও চলবে।',
      hintBn: 'টাস্কবারের নিচের সারিতে ছোট নোটখাতার আইকন।',
    },
    {
      id: 'w-print-key', osVariant: 'windows', titleBn: 'প্রিন্টের শর্টকাট', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+p' },
      explanationBn: 'একসাথে Ctrl + P চাপুন (P মানে Print)। প্রিন্টের জানালা খুলবে। (File মেনু থেকে Print… বেছে নিলেও একই হয়।)',
      hintBn: 'Ctrl চেপে ধরে P চাপুন। কিবোর্ডে না হলে শর্টকাট প্যাড ব্যবহার করুন।',
    },
    {
      id: 'w-print-go', osVariant: 'windows', titleBn: 'প্রিন্ট দিন', target: 'print-go', expectedAction: { type: 'click', target: 'print-go' },
      explanationBn: 'জানালায় প্রিন্টারের নাম (Practice Printer), কপির সংখ্যা (Copies) আর কোন পাতা (Pages) ছাপবেন তা ঠিক করা যায়। আপাতত যেমন আছে তেমনই রেখে Print বোতামে ক্লিক করুন।',
      hintBn: 'জানালার নিচের ডান দিকের নীল Print বোতাম।',
    },
    {
      id: 'w-print-queue', osVariant: 'windows', titleBn: 'প্রিন্ট কিউ খুলুন', target: 'tray-printer', expectedAction: { type: 'click', target: 'tray-printer' },
      explanationBn: 'ধরুন প্রিন্টটি ভুল করে দিয়ে ফেলেছেন। টাস্কবারের ডান দিকে একটি ছোট প্রিন্টারের আইকন এসেছে। সেটিতে ক্লিক করলে প্রিন্ট কিউ (ছাপার লাইন) দেখা যায়।',
      hintBn: 'টাস্কবারের ডান দিকে ঘড়ির কাছে ছোট প্রিন্টার।',
    },
    {
      id: 'w-print-cancel', osVariant: 'windows', titleBn: 'প্রিন্ট বাতিল করুন', target: 'pq-cancel-Untitled', expectedAction: { type: 'custom', event: 'print-cancelled' },
      explanationBn: 'তালিকায় ডকুমেন্টটির পাশে Cancel বোতামে ক্লিক করুন। প্রিন্ট বন্ধ হয়ে যাবে, কাগজ নষ্ট হবে না।',
      hintBn: 'ডকুমেন্টের নামের ডান পাশের Cancel বোতাম।',
    },

    // ---------- Mac ----------
    {
      id: 'm-photo-open', osVariant: 'mac', titleBn: 'ছবি খুলুন', target: 'icon-Flower.png', expectedAction: { type: 'doubleClick', target: 'icon-Flower.png' },
      explanationBn: 'ডেস্কটপে “Flower.png” নামে একটি ছবি আছে। এতে ডাবল ক্লিক করুন। ছবি দেখার প্রোগ্রাম (Photos) নিজেই খুলে যাবে।',
      hintBn: 'ডান দিকের ছবির আইকনটিতে পরপর দুবার তাড়াতাড়ি ক্লিক করুন।',
      simplerBn: 'ট্র্যাকপ্যাডের তীর ফুলের ছবির ওপর রাখুন, তারপর “টুক-টুক” করে দুবার চাপুন।',
    },
    {
      id: 'm-photo-next', osVariant: 'mac', titleBn: 'পরের ছবিতে যান', target: 'photos-next', expectedAction: { type: 'click', target: 'photos-next' },
      explanationBn: 'ডান পাশের › তীরে ক্লিক করুন, তাহলে পরের ছবিটি আসবে। কিবোর্ডের ডান তীর (→) চাপলেও একই কাজ হয়। ছবি বড় করতে ওপরের + বোতামও আছে।',
      hintBn: 'ছবির ডান দিকের গোল › বোতামটি খুঁজুন।',
    },
    {
      id: 'm-photo-close', osVariant: 'mac', titleBn: 'ছবির উইন্ডো বন্ধ করুন', target: 'win-photos-close', expectedAction: { type: 'click', target: 'win-photos-close' },
      explanationBn: 'দেখা শেষ, তাই উইন্ডোর বাঁ ওপরের লাল বিন্দুতে ক্লিক করুন।',
      hintBn: 'উইন্ডোর একদম বাঁ ওপরের কোণের লাল বিন্দু।',
    },
    {
      id: 'm-song-open', osVariant: 'mac', titleBn: 'গান খুলুন', target: 'icon-Song.mp3', expectedAction: { type: 'doubleClick', target: 'icon-Song.mp3' },
      explanationBn: 'ডেস্কটপের “Song.mp3” হলো একটি গানের ফাইল। এতে ডাবল ক্লিক করুন — Media Player খুলবে। (এই অনুশীলনে আসল আওয়াজ হবে না, শুধু নকল গান চলবে।)',
      hintBn: 'গানের আইকনটিতে পরপর দুবার ক্লিক করুন।',
    },
    {
      id: 'm-play', osVariant: 'mac', titleBn: 'গান চালু করুন', target: 'media-play', expectedAction: { type: 'click', target: 'media-play' },
      explanationBn: 'নিচের বাঁ দিকের ▶ Play বোতামে ক্লিক করুন। ওপরের রঙিন দণ্ডগুলো নড়তে শুরু করলে বুঝবেন গান চলছে। আবার চাপলে থেমে যাবে (Pause)।',
      hintBn: 'নিচের বারের একদম বাঁ দিকের বোতামটি।',
    },
    {
      id: 'm-mute', osVariant: 'mac', titleBn: 'আওয়াজ বন্ধ করুন', target: 'media-mute', expectedAction: { type: 'click', target: 'media-mute' },
      explanationBn: 'নিচের ডান দিকের স্পিকার 🔊 চিহ্নে ক্লিক করলে আওয়াজ একেবারে বন্ধ (Mute) হয়ে যায়। তার পাশের স্লাইডার টেনে আওয়াজ ধীরে ধীরে কমানো-বাড়ানো যায়।',
      hintBn: 'ডান দিকের ছোট স্পিকারের চিহ্নটি।',
    },
    {
      id: 'm-media-close', osVariant: 'mac', titleBn: 'প্লেয়ার বন্ধ করুন', target: 'win-media-close', expectedAction: { type: 'click', target: 'win-media-close' },
      explanationBn: 'এবার লাল বিন্দুতে ক্লিক করে প্লেয়ার বন্ধ করুন।',
      hintBn: 'উইন্ডোর বাঁ ওপরের লাল বিন্দু।',
    },
    {
      id: 'm-shot-full', osVariant: 'mac', titleBn: 'পুরো পর্দার স্ক্রিনশট', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'shift+cmd+3' },
      explanationBn: 'পুরো পর্দার ছবি তুলতে একসাথে Shift + Command + 3 চাপুন। ছবিটি নিজে নিজেই ডেস্কটপে ফাইল হয়ে যাবে, নাম হবে “Screenshot” আর তারিখ-সময়। কিবোর্ডে না হলে শর্টকাট প্যাড ব্যবহার করুন।',
      hintBn: 'Shift, Command আর 3 — তিনটি কী একসাথে। প্যাডে আগে Shift ও Command বেছে নিয়ে তারপর 3-এ ক্লিক করুন।',
      simplerBn: 'শর্টকাট প্যাডে Shift বোতামে ক্লিক করুন, তারপর Command-এ, সবশেষে 3-এ।',
    },
    {
      id: 'm-shot-area-key', osVariant: 'mac', titleBn: 'একটি অংশের স্ক্রিনশট', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'shift+cmd+4' },
      explanationBn: 'এবার শুধু একটি অংশের ছবি তুলব। একসাথে Shift + Command + 4 চাপুন। মাউসের তীর ক্রসচিহ্ন (+) হয়ে যাবে।',
      hintBn: 'আগের মতোই, শুধু শেষে 3-এর বদলে 4।',
    },
    {
      id: 'm-shot-area-drag', osVariant: 'mac', titleBn: 'টেনে অংশ বেছে নিন', target: 'snip-overlay', expectedAction: { type: 'custom', event: 'screenshot-saved' },
      explanationBn: 'এবার মাউসের বোতাম চেপে ধরে একটি অংশের ওপর দিয়ে টেনে ছেড়ে দিন। যেটুকু বেছে নেবেন, শুধু সেটুকুর ছবি ডেস্কটপে ফাইল হয়ে যাবে।',
      hintBn: 'ক্রসচিহ্ন নিয়ে এক কোণ থেকে উল্টো কোণে টেনে নিয়ে ছেড়ে দিন।',
      simplerBn: 'পর্দার একটি জায়গায় বোতাম চেপে ধরুন, অন্য জায়গায় টেনে নিয়ে গিয়ে ছেড়ে দিন।',
    },
    {
      id: 'm-shot-toolbar-key', osVariant: 'mac', titleBn: 'স্ক্রিনশটের টুলবার', target: 'pad-toggle', expectedAction: { type: 'keyCombo', keys: 'shift+cmd+5' },
      explanationBn: 'একসাথে Shift + Command + 5 চাপুন। নিচে একটি টুলবার আসবে, যেখান থেকে পুরো পর্দা বা একটি অংশ বেছে নেওয়া যায়।',
      hintBn: 'Shift, Command আর 5।',
    },
    {
      id: 'm-shot-toolbar-close', osVariant: 'mac', titleBn: 'টুলবার বন্ধ করুন', target: 'shot-close', expectedAction: { type: 'click', target: 'shot-close' },
      explanationBn: 'টুলবারের বাঁ দিকের ✕ বোতামে ক্লিক করে আপাতত বন্ধ করে দিন। (কিবোর্ডের Esc চাপলেও বন্ধ হয়।)',
      hintBn: 'টুলবারের একদম বাঁ দিকের ✕।',
    },
    {
      id: 'm-usb-insert', osVariant: 'mac', titleBn: 'পেনড্রাইভ লাগান', target: 'hw-usb-insert', expectedAction: { type: 'click', target: 'hw-usb-insert' },
      explanationBn: 'স্ক্রিনের নিচের “হার্ডওয়্যার প্যানেল” আসল কম্পিউটারের ইউএসবি পোর্টের কাজ করছে। “পেনড্রাইভ লাগান” বোতামে ক্লিক করুন। ডেস্কটপে “USB DRIVE” নামে একটি আইকন আসবে।',
      hintBn: 'ছবির নিচে বাক্সের ভেতরের 💾 বোতাম।',
    },
    {
      id: 'm-usb-files', osVariant: 'mac', titleBn: 'ফাইন্ডার খুলুন', target: 'dock-files', expectedAction: { type: 'openApp', app: 'files' },
      explanationBn: 'ডকের একদম বাঁ দিকের ফাইন্ডার (Finder) আইকনে ক্লিক করুন।',
      hintBn: 'ডকের প্রথম আইকন।',
    },
    {
      id: 'm-usb-drive', osVariant: 'mac', titleBn: 'পেনড্রাইভটি খুলুন', target: 'fm-sidebar-USB DRIVE', expectedAction: { type: 'click', target: 'fm-sidebar-USB DRIVE' },
      explanationBn: 'বাঁ তালিকার নিচে “Locations”-এর নিচে “USB DRIVE” এসেছে। এতে ক্লিক করে ভেতরের ফাইল দেখুন।',
      hintBn: 'বাঁ তালিকায় ইউএসবি আইকনওয়ালা নামটি।',
    },
    {
      id: 'm-usb-copy', osVariant: 'mac', titleBn: 'পেনড্রাইভ থেকে ফাইল কপি করুন', target: 'fm-item-Project Notes.txt', expectedAction: { type: 'drag', target: 'fm-item-Project Notes.txt', dropTarget: 'fm-sidebar-Documents' },
      explanationBn: '“Project Notes.txt” ফাইলটি ধরে টেনে বাঁ তালিকার “Documents”-এর ওপর ছেড়ে দিন। এক ড্রাইভ থেকে অন্য ড্রাইভে টানলে ফাইলটি সরে না, কপি হয়ে যায়। (Command + C, Command + V করেও একই কাজ হয়।)',
      hintBn: 'ফাইলের নামের ওপর বোতাম চেপে ধরে বাঁ তালিকার Documents পর্যন্ত টানুন, তারপর ছেড়ে দিন।',
      simplerBn: 'ফাইলটি একবার ক্লিক করে বেছে নিন। বোতাম চেপে রেখে তীর সরিয়ে বাঁ দিকের “Documents”-এর ওপর আনুন, তারপর ছেড়ে দিন।',
    },
    {
      id: 'm-usb-eject', osVariant: 'mac', titleBn: 'Eject করুন', target: 'fm-eject-USB DRIVE', expectedAction: { type: 'click', target: 'fm-eject-USB DRIVE' },
      explanationBn: 'পেনড্রাইভ খুলতে হবে — কিন্তু সরাসরি টেনে নয়! বাঁ তালিকায় “USB DRIVE”-এর ডান পাশে ছোট ⏏ (Eject) চিহ্ন আছে। সেটিতে ক্লিক করুন।',
      hintBn: 'বাঁ তালিকায় ইউএসবির নামের একদম ডানে ⏏ চিহ্ন।',
    },
    {
      id: 'm-usb-pull', osVariant: 'mac', titleBn: 'এবার পেনড্রাইভ খুলে নিন', target: 'hw-usb-pull', expectedAction: { type: 'click', target: 'hw-usb-pull' },
      explanationBn: 'এখন হার্ডওয়্যার প্যানেলের “পেনড্রাইভ খুলে নিন” বোতামে ক্লিক করুন, যেন পোর্ট থেকে টেনে বের করছেন।',
      hintBn: 'হার্ডওয়্যার প্যানেলের একই জায়গার বোতামটি এখন বদলে গেছে।',
    },
    {
      id: 'm-phone-connect', osVariant: 'mac', titleBn: 'ফোন লাগান', target: 'hw-phone-connect', expectedAction: { type: 'click', target: 'hw-phone-connect' },
      explanationBn: 'এবার ফোন লাগাই। “ফোন কেবল দিয়ে যুক্ত করুন” বোতামে ক্লিক করুন। আসল Mac-এ iPhone-এর ছবি আনতে Photos বা Image Capture প্রোগ্রাম লাগে, Android-এর জন্য আলাদা ট্রান্সফার টুল লাগে। এখানে সহজ করে ফোনটিকে একটি ড্রাইভের মতো দেখানো হচ্ছে।',
      hintBn: 'হার্ডওয়্যার প্যানেলে 📱 চিহ্নের বোতাম।',
    },
    {
      id: 'm-phone-allow', osVariant: 'mac', titleBn: 'ফোনের পর্দায় অনুমতি দিন', target: 'hw-phone-allow', expectedAction: { type: 'click', target: 'hw-phone-allow' },
      explanationBn: 'ফোনের পর্দায় জানতে চাইছে ইউএসবি দিয়ে কী করবেন। ফাইল নেওয়ার জন্য “File transfer”-এ ক্লিক করুন। আসল ফোনেও এই অনুমতি না দিলে কম্পিউটার ফোনের ছবি দেখতে পায় না।',
      hintBn: 'ছোট কালো ফোনের পর্দায় নীল বোতাম।',
    },
    {
      id: 'm-phone-open', osVariant: 'mac', titleBn: 'ফোনের ভেতরে দেখুন', target: 'fm-sidebar-Phone', expectedAction: { type: 'click', target: 'fm-sidebar-Phone' },
      explanationBn: 'ফাইন্ডারের বাঁ তালিকায় “Phone” এসেছে। এতে ক্লিক করুন। ভেতরে Internal storage › DCIM › Camera ফোল্ডারে ফোনে তোলা ছবি থাকে। সেখান থেকে ছবি টেনে Pictures-এ এনে কপি করা যায় — এটি একটু পরে নিজে চেষ্টা করবেন।',
      hintBn: 'বাঁ তালিকার “Locations” অংশে Phone নামটি।',
    },
    {
      id: 'm-print-notepad', osVariant: 'mac', titleBn: 'টেক্সটএডিট খুলুন', target: 'dock-editor', expectedAction: { type: 'openApp', app: 'editor' },
      explanationBn: 'এবার প্রিন্টের কাজ। ডকে TextEdit আইকনে ক্লিক করুন। একটি খালি পাতা খুলবে — প্রিন্টের জন্য তাতে কিছু না লিখলেও চলবে।',
      hintBn: 'ডকের মাঝের দিকে ছোট নোটখাতার আইকন।',
    },
    {
      id: 'm-print-key', osVariant: 'mac', titleBn: 'প্রিন্টের শর্টকাট', target: 'editor-text', expectedAction: { type: 'keyCombo', keys: 'mod+p' },
      explanationBn: 'একসাথে Command + P চাপুন (P মানে Print)। প্রিন্টের জানালা খুলবে। (ওপরের Print… বোতামেও একই হয়।)',
      hintBn: 'Command চেপে ধরে P চাপুন। কিবোর্ডে না হলে শর্টকাট প্যাড ব্যবহার করুন।',
    },
    {
      id: 'm-print-go', osVariant: 'mac', titleBn: 'প্রিন্ট দিন', target: 'print-go', expectedAction: { type: 'click', target: 'print-go' },
      explanationBn: 'জানালায় প্রিন্টারের নাম (Practice Printer), কপির সংখ্যা (Copies) আর কোন পাতা (Pages) ছাপবেন তা ঠিক করা যায়। আপাতত যেমন আছে তেমনই রেখে Print বোতামে ক্লিক করুন।',
      hintBn: 'জানালার নিচের ডান দিকের নীল Print বোতাম।',
    },
    {
      id: 'm-print-queue', osVariant: 'mac', titleBn: 'প্রিন্ট কিউ খুলুন', target: 'dock-printer', expectedAction: { type: 'click', target: 'dock-printer' },
      explanationBn: 'ধরুন প্রিন্টটি ভুল করে দিয়ে ফেলেছেন। প্রিন্ট চলার সময় ডকের ডান দিকে একটি প্রিন্টারের আইকন আসে। সেটিতে ক্লিক করলে প্রিন্ট কিউ (ছাপার লাইন) দেখা যায়।',
      hintBn: 'পর্দার নিচের ডান কোণে প্রিন্টারের আইকন।',
    },
    {
      id: 'm-print-cancel', osVariant: 'mac', titleBn: 'প্রিন্ট বাতিল করুন', target: 'pq-cancel-Untitled', expectedAction: { type: 'custom', event: 'print-cancelled' },
      explanationBn: 'তালিকায় ডকুমেন্টটির পাশে Cancel বোতামে ক্লিক করুন। প্রিন্ট বন্ধ হয়ে যাবে, কাগজ নষ্ট হবে না।',
      hintBn: 'ডকুমেন্টের নামের ডান পাশের Cancel বোতাম।',
    },
  ],

  freePractice: {
    titleBn: 'এবার নিজে নিজে চেষ্টা করুন',
    instructionBn: 'নিচের হার্ডওয়্যার প্যানেলে আবার পেনড্রাইভ বা ফোন লাগিয়ে নিজের মতো করে চেষ্টা করুন। ভুল হলে “রিসেট” চাপলেই সব আবার আগের মতো হয়ে যাবে।',
    checklistBn: [
      'Pictures ফোল্ডারের একটি ছবি খুলে পরের-আগের ছবিতে গিয়েছি আর বড় (জুম) করেছি',
      'Music বা Videos (Mac-এ Movies) ফোল্ডার থেকে একটি গান বা ভিডিও চালিয়েছি, থামিয়েছি আর সামনে-পিছনে সরিয়েছি',
      'একটি স্ক্রিনশট নিয়েছি এবং ফাইলটি খুঁজে পেয়েছি (Windows: Win + PrtScn চেপে Pictures › Screenshots দেখুন; Mac: ডেস্কটপ দেখুন)',
      'পেনড্রাইভে একটি ফাইল কপি করেছি (কপি-পেস্ট দিয়ে) এবং Eject করে তারপর খুলেছি',
      'ফোনের Internal storage › DCIM › Camera থেকে একটি ছবি Pictures-এ কপি করেছি',
      'একটি প্রিন্টে কপির সংখ্যা ২ করেছি এবং প্রিন্ট কিউ থেকে বাতিল করেছি',
    ],
  },

  quiz: [
    {
      id: 'q-key-win', osVariant: 'windows', type: 'clickTarget', questionBn: 'Windows-এ পর্দার শুধু একটি অংশ বেছে স্ক্রিনশট তুলতে কোন কী-গুলো একসাথে চাপতে হয়?',
      items: [
        { id: 'snip', labelBn: 'Win + Shift + S', icon: '⌨️' },
        { id: 'print', labelBn: 'Ctrl + P', icon: '⌨️' },
        { id: 'close', labelBn: 'Alt + F4', icon: '⌨️' },
        { id: 'save', labelBn: 'Ctrl + S', icon: '⌨️' },
      ],
      correct: 'snip',
      hintBn: 'এতে স্ক্রিনশটের “S” আছে, আর স্টার্টের চিহ্নওয়ালা Win কী-ও লাগে।',
      explanationBn: 'ঠিক! Win + Shift + S চাপলে পর্দা অন্ধকার হয়ে যায়, তখন টেনে একটি অংশ বেছে নিতে হয়। আর শুধু PrtScn চাপলে পুরো পর্দার ছবি ক্লিপবোর্ডে যায়।',
    },
    {
      id: 'q-key-mac', osVariant: 'mac', type: 'clickTarget', questionBn: 'Mac-এ পর্দার শুধু একটি অংশ বেছে স্ক্রিনশট তুলতে কোন কী-গুলো একসাথে চাপতে হয়?',
      items: [
        { id: 'area', labelBn: 'Shift + Command + 4', icon: '⌨️' },
        { id: 'print', labelBn: 'Command + P', icon: '⌨️' },
        { id: 'quit', labelBn: 'Command + Q', icon: '⌨️' },
        { id: 'save', labelBn: 'Command + S', icon: '⌨️' },
      ],
      correct: 'area',
      hintBn: 'এতে Shift, Command আর একটি সংখ্যা থাকে — পুরো পর্দার জন্য 3, একটি অংশের জন্য তার পরের সংখ্যা।',
      explanationBn: 'ঠিক! Shift + Command + 4 চাপলে মাউসের তীর ক্রসচিহ্ন হয়, টেনে অংশ বেছে নিলে ছবিটি ডেস্কটপে ফাইল হয়ে যায়। পুরো পর্দার জন্য Shift + Command + 3।',
    },
    {
      id: 'q-eject-order', type: 'ordering', questionBn: 'পেনড্রাইভ নিরাপদে খোলার ধাপগুলো ঠিক ক্রমে সাজান।',
      items: [
        { id: '1', textBn: 'ফাইল কপি করা শেষ হয়ে গেছে দেখে নিই' },
        { id: '2', textBn: 'Eject করি (Windows-এ টাস্কবারের ইউএসবি চিহ্ন, Mac-এ ⏏)' },
        { id: '3', textBn: 'কম্পিউটার জানায় যে এখন নিরাপদে খোলা যাবে' },
        { id: '4', textBn: 'পেনড্রাইভ টেনে বের করে নিই' },
      ],
      hintBn: 'আগে কাজ শেষ, তারপর কম্পিউটারকে জানানো, তারপর অনুমতি পেলে তবেই টেনে খোলা।',
      explanationBn: 'চমৎকার! কপি শেষ → Eject → নিরাপদ বার্তা → তারপর খোলা। এই ক্রম মানলে ফাইল নষ্ট হয় না।',
    },
    {
      id: 'q-match', type: 'dragMatch', questionBn: 'কোন জিনিসের ফাইলের নামের শেষে কী লেখা থাকে, মিলিয়ে দিন।',
      pairs: [
        { id: 'photo', leftBn: 'ছবি', rightBn: '.jpg' },
        { id: 'song', leftBn: 'গান', rightBn: '.mp3' },
        { id: 'video', leftBn: 'ভিডিও', rightBn: '.mp4' },
        { id: 'shot', leftBn: 'স্ক্রিনশট', rightBn: '.png' },
      ],
      hintBn: 'গান মানে অডিও, ভিডিও মানে চলমান ছবি। স্ক্রিনশট ও ছবির ফাইলের নামের শেষে সাধারণত ছবির ধরনের এক্সটেনশনই থাকে।',
      explanationBn: 'সব মিলে গেছে! নামের শেষের অংশ দেখেই বোঝা যায় ফাইলটি ছবি, গান না ভিডিও। (ছবি .png বা .jpg দুটোই হতে পারে।)',
    },
    {
      id: 'q-print-cancel', type: 'multipleChoice', questionBn: 'ভুল ডকুমেন্ট প্রিন্টে দিয়ে ফেলেছেন। কাগজ নষ্ট হওয়ার আগে কী করবেন?',
      options: [
        { id: 'a', textBn: 'প্রিন্ট কিউ খুলে ডকুমেন্টের পাশের Cancel বোতামে চাপব' },
        { id: 'b', textBn: 'কম্পিউটারের প্লাগ টেনে খুলে ফেলব' },
        { id: 'c', textBn: 'আবার একই প্রিন্ট দেব' },
        { id: 'd', textBn: 'কিছু না করে চুপ করে বসে থাকব' },
      ],
      correct: ['a'],
      hintBn: 'ছাপার অপেক্ষায় থাকা সব ডকুমেন্টের তালিকা কোথায় দেখা যায়, মনে করুন। সেখানেই বাতিলের বোতাম আছে।',
      explanationBn: 'ঠিক! প্রিন্ট কিউ (Windows-এ টাস্কবারের প্রিন্টার আইকন, Mac-এ ডকের প্রিন্টার আইকন) খুলে Cancel চাপলে প্রিন্ট বন্ধ হয়ে যায়।',
    },
    {
      id: 'q-phone', type: 'multipleChoice', questionBn: 'ইউএসবি কেবল দিয়ে ফোন কম্পিউটারে লাগানোর পর ফোনের ছবি দেখতে না পেলে সবচেয়ে আগে কী দেখবেন?',
      options: [
        { id: 'a', textBn: 'ফোনের পর্দায় ফাইল আদান-প্রদানের অনুমতি (File transfer) দেওয়া হয়েছে কিনা' },
        { id: 'b', textBn: 'কম্পিউটার বন্ধ করে আবার চালু করব' },
        { id: 'c', textBn: 'ফোনের কভার খুলে ফেলব' },
        { id: 'd', textBn: 'ছবির ফাইলের নাম বদলাব' },
      ],
      correct: ['a'],
      hintBn: 'নিরাপত্তার জন্য ফোন নিজে থেকে ছবি দেখতে দেয় না — প্রথমে ফোনের পর্দা থেকে অনুমতি লাগে।',
      explanationBn: 'ঠিক! ফোনের পর্দায় “File transfer” বেছে অনুমতি না দিলে কম্পিউটার ফোনের ছবি দেখতে পায় না।',
    },
  ],

  summaryCard: {
    titleBn: 'মনে রাখুন',
    pointsBn: [
      'ছবি, গান আর ভিডিও সবই ফাইল। ডাবল ক্লিক করলে ঠিক প্রোগ্রামে (Photos বা Media Player) খোলে।',
      'Windows স্ক্রিনশট: PrtScn = পুরো পর্দা ক্লিপবোর্ডে; Win + PrtScn = পুরো পর্দা ফাইল হয়ে Pictures › Screenshots-এ; Win + Shift + S = একটি অংশ বেছে নেওয়া।',
      'Mac স্ক্রিনশট: Shift + Command + 3 = পুরো পর্দা; + 4 = একটি অংশ; + 5 = টুলবার। ছবি ডেস্কটপে ফাইল হয়ে যায়।',
      'পেনড্রাইভ সবসময় Eject করে (Windows-এ Safely Remove) তারপর খুলবেন — সরাসরি টেনে খুললে ফাইল নষ্ট হতে পারে।',
      'ফোন কম্পিউটারে লাগিয়ে ফোনের পর্দায় “File transfer”-এর অনুমতি দিতে হয়। ছবি থাকে Internal storage › DCIM › Camera-য়।',
      'প্রিন্ট: Ctrl/Command + P। ভুল হলে প্রিন্ট কিউ খুলে Cancel।',
    ],
  },

  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: [
      'Pictures ফোল্ডার খুলে একটি ছবি ডাবল ক্লিক করে দেখুন, তারপর তীর-কী দিয়ে পরের ছবিতে যান।',
      'একটি গান বা ভিডিও ডাবল ক্লিক করে চালান, থামান আর আওয়াজ কমান-বাড়ান।',
      'পুরো পর্দার একটি স্ক্রিনশট তুলুন এবং সেটি কোথায় জমা হলো খুঁজে বের করুন।',
    ],
    windowsTasksBn: ['পেনড্রাইভ থাকলে লাগিয়ে তার ভেতরের ফাইলের নাম দেখুন (কিছু মুছবেন না)। দেখা শেষ হলে টাস্কবারের ইউএসবি চিহ্ন থেকে Eject করে তারপর খুলুন।'],
    macTasksBn: ['পেনড্রাইভ থাকলে লাগিয়ে ফাইন্ডারে তার ভেতরের ফাইলের নাম দেখুন (কিছু মুছবেন না)। দেখা শেষ হলে নামের পাশের ⏏ চিহ্নে চেপে তারপর খুলুন।'],
  },

  teacherTipBn:
    'এই মডিউলে সবচেয়ে গুরুত্বপূর্ণ অভ্যাস হলো পেনড্রাইভ Eject করে খোলা — এটি বারবার অনুশীলন করান। আসল কম্পিউটারে আগে পেনড্রাইভে অপ্রয়োজনীয় ফাইল রেখে অভ্যাস করতে দিন, দরকারি ফাইলে নয়। প্রিন্ট বাতিলের অনুশীলন আসল প্রিন্টারে না করে এখানকার সিমুলেশনেই করতে দিন, যাতে কাগজ নষ্ট না হয়। শর্টকাটে সমস্যা হলে ল্যাপটপের Fn কী লাগছে কিনা দেখবেন। ফোনের ক্ষেত্রে iPhone আর Android-এর নিয়ম আলাদা — আসল ফোনে একবার দেখিয়ে দিন।',
}

export default lesson
