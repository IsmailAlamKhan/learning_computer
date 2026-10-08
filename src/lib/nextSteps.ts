/** Pure content/logic for the “এরপর কোথায় যাব” (next steps) page. */

export interface RoadStage {
  id: string
  titleBn: string
  whyBn: string
  itemsBn: string[]
}

export const ROADMAP: RoadStage[] = [
  {
    id: 'basics',
    titleBn: '১. আরও মজবুত ভিত',
    whyBn: 'আজ যা শিখলেন তার গভীরে যান। ছোট ছোট জিনিস বারবার করলেই হাত বসে যায়।',
    itemsBn: [
      'HTML ও CSS: নিজের পাতায় আরও ট্যাগ (টেবিল, ফর্ম), আলাদা রং-সাজ, পাতার বিন্যাস (Layout)।',
      'পাইথনের মূল বিষয়: ফাংশন (Function, বারবার ব্যবহারের কাজ), তালিকা (List), ডিকশনারি (Dictionary), ফাইল পড়া ও লেখা।',
      'ছোট একটি জিনিস বারবার নিজে নিজে লিখে দেখুন, মুখস্থ নয়।',
    ],
  },
  {
    id: 'projects',
    titleBn: '২. ছোট ছোট প্রকল্প',
    whyBn: 'নিজের হাতে একটা কিছু বানালেই শেখা পাকা হয়। প্রতিটি প্রকল্প ছোট রাখুন, এক-দুই সপ্তাহে শেষ হয় এমন।',
    itemsBn: ['ক্যালকুলেটর (পাইথনে)', 'করণীয়-তালিকা (To-do list)', 'নিজের পরিচিতির পাতা (HTML ও CSS)', 'প্রশ্ন-উত্তরের কুইজ খেলা'],
  },
  {
    id: 'git',
    titleBn: '৩. Git ও GitHub-এর প্রাথমিক ধারণা',
    whyBn: 'Git হলো কোডের “সেভ পয়েন্ট” জমিয়ে রাখার ব্যবস্থা: ভুল হলে আগের অবস্থায় ফেরা যায়। GitHub-এ নিজের কোড জমা রাখা ও অন্যকে দেখানো যায়।',
    itemsBn: ['প্রথমে শুধু বুঝুন: রিপোজিটরি, কমিট, পুশ কী।', 'নিজের একটি ছোট প্রকল্প জমা রেখে দেখুন। ব্যক্তিগত তথ্য বা পাসওয়ার্ড কখনো কোডে রাখবেন না।'],
  },
  {
    id: 'portfolio',
    titleBn: '৪. প্রথম পোর্টফোলিও প্রকল্প অনলাইনে',
    whyBn: 'নিজের সেরা ছোট প্রকল্পটি ইন্টারনেটে প্রকাশ করুন, যাতে পরিবার-বন্ধুদের দেখাতে পারেন।',
    itemsBn: ['একটি পরিচিতির পাতা বা ছোট প্রকল্প বেছে নিন।', 'বিনামূল্যে পাতা প্রকাশের সুবিধা খুঁজে দেখুন (শর্ত ভালো করে পড়ে)।', 'প্রকাশের আগে পাতায় ব্যক্তিগত তথ্য (ফোন, বাসার ঠিকানা) আছে কি না দেখে নিন।'],
  },
]

export interface ResourceType {
  id: string
  titleBn: string
  textBn: string
}

/** Types of FREE resources — deliberately no commercial site names; only official documentation is named. */
export const RESOURCES: ResourceType[] = [
  { id: 'docs', titleBn: 'অফিসিয়াল ডকুমেন্টেশন', textBn: 'যেমন MDN Web Docs (HTML, CSS ও জাভাস্ক্রিপ্ট) এবং python.org-এর পাইথন ডকুমেন্টেশন। প্রথমে কঠিন লাগবে; মডিউল ১৯-এর মতো ধীরে পড়ুন, উদাহরণ থেকে শুরু করুন।' },
  { id: 'interactive', titleBn: 'বিনামূল্যের ইন্টারঅ্যাকটিভ কোর্স', textBn: 'ব্রাউজারেই কোড লিখে সাথে সাথে ফল দেখা যায়, এমন কোর্স খুঁজুন। “বিনামূল্যে”, “নতুনদের জন্য” আর শেষ আপডেটের তারিখ দেখে বেছে নিন।' },
  { id: 'video', titleBn: 'বাংলা ও ইংরেজি ভিডিও', textBn: 'ধীরে বলা, পর্দায় কোড দেখানো ভিডিও বেছে নিন। ভিডিও দেখার সাথে সাথে নিজেও কোড লিখুন, শুধু দেখে গেলে শেখা হয় না।' },
  { id: 'forum', titleBn: 'কমিউনিটি ফোরাম', textBn: 'আগে খুঁজে দেখুন, কেউ কি আপনার প্রশ্নের উত্তর দিয়েছেন। না পেলে ভালো করে প্রশ্ন লিখুন: কী করতে চেয়েছিলাম, কী করলাম, কী এরর এল। ব্যক্তিগত তথ্য বা পাসওয়ার্ড কখনো দেবেন না।' },
  { id: 'books', titleBn: 'বই ও লাইব্রেরি', textBn: 'স্থানীয় বা ডিজিটাল লাইব্রেরিতে বিনামূল্যের বই, আর মুক্ত-লাইসেন্সের অনলাইন বই। বই ধীরে শেখায় আর বিস্তারিত বোঝায়।' },
]

export const RESOURCE_WARNING = '“টাকা দিলেই নিশ্চিত চাকরি” বা “এক সপ্তাহে প্রোগ্রামার” ধরনের বিজ্ঞাপন থেকে সাবধান। ভালো শেখা ধীরে ও বিনামূল্যেই শুরু করা যায়।'

export const STUCK_STEPS: string[] = [
  'থামুন, একটু শ্বাস নিন। আটকে যাওয়া স্বাভাবিক, সবাই আটকায়।',
  'এরর বার্তাটি শান্তভাবে পড়ুন, বিশেষ করে লাইন নম্বর আর শেষ লাইন (মডিউল ১৯)।',
  'নিজের কোড আর ঠিকঠাক চলা উদাহরণ পাশাপাশি রেখে মিলিয়ে দেখুন: কোটেশন, বন্ধনী, কোলন (:)।',
  'ইংরেজি এরর বার্তাটি সার্চ করুন বা ডকুমেন্টেশন দেখুন।',
  'এআই সহকারী ব্যবহার করলে: কোড ও এরর দিয়ে প্রশ্ন করুন, উত্তর বুঝে তারপর নিজে লিখুন। ব্যক্তিগত তথ্য কখনো দেবেন না।',
  '১৫ মিনিট চেষ্টা করেও না হলে বিরতি নিন বা কাউকে জিজ্ঞেস করুন। কী শিখলেন নিজের নোটবুকে লিখে রাখুন।',
]

export interface DailyBlock {
  id: string
  minutes: number
  titleBn: string
  textBn: string
}

export const DAILY_PLAN: DailyBlock[] = [
  { id: 'review', minutes: 5, titleBn: 'ঝালিয়ে নেওয়া (Review)', textBn: 'গতবারের কোড বা নোট একবার চোখ বুলিয়ে নিন।' },
  { id: 'practice', minutes: 20, titleBn: 'হাতে-কলমে অনুশীলন (Practice)', textBn: 'নিজে কোড লিখুন: ছোট একটি জিনিস বানান বা বদলান। আগে আন্দাজ, তারপর চালান।' },
  { id: 'notes', minutes: 5, titleBn: 'নোট (Notes)', textBn: 'আজ কী শিখলাম? কোথায় আটকালাম? কাল কী করব?' },
]

export const dailyTotal = (plan: DailyBlock[] = DAILY_PLAN) => plan.reduce((s, b) => s + b.minutes, 0)

export const WEEK_DAYS = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র']

/** The weekly checkbox grid: `weeks` rows, each with 7 days. */
export function weekGrid(weeks = 4): { week: number; days: string[] }[] {
  return Array.from({ length: Math.max(1, weeks) }, (_, i) => ({ week: i + 1, days: WEEK_DAYS }))
}

export interface Encouragement {
  titleBn: string
  linesBn: string[]
}

/** The personal closing message: uses her name and her original motivation (profile.motivation) when known. */
export function encouragement(name?: string, motivation?: string): Encouragement {
  const n = (name ?? '').trim()
  const m = (motivation ?? '').trim()
  const lines: string[] = []
  if (m) lines.push(`শুরুতে আপনি বলেছিলেন: “${m}”। সেই পথেই আপনি আজ নিজের হাতে ওয়েবপেজ আর প্রোগ্রাম লিখেছেন।`)
  else lines.push('আজ আপনি নিজের হাতে ওয়েবপেজ আর প্রোগ্রাম লিখেছেন।')
  lines.push('কম্পিউটারের সামনে প্রথমবার বসা থেকে নিজের কোড চালানো পর্যন্ত আপনি অনেকটা পথ এসেছেন। এটি সহজ ছিল না, আপনি পেরেছেন।')
  lines.push('এখন তাড়া নেই। রোজ অল্প অল্প করে, ভুল করতে করতে, নিজের গতিতে এগোন।')
  return { titleBn: n ? `অভিনন্দন, ${n}!` : 'অভিনন্দন!', linesBn: lines }
}
