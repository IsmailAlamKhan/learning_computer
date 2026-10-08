import type { ModuleMeta } from '../engine/types'

/**
 * The 20-module curriculum. `status: 'playable'` means a lesson file exists in
 * src/content/lessons (m01.ts ... m20.ts). Flip it when a module is ready.
 */
export const MODULES: ModuleMeta[] = [
  { module: 1, part: 1, icon: '💻', titleBn: 'কম্পিউটারের সাথে পরিচয়', oneLineBn: 'কম্পিউটারের অংশগুলো চিনি, নিরাপদে চালু-বন্ধ করি, টাচপ্যাড ব্যবহার শিখি।', status: 'soon' },
  { module: 2, part: 1, icon: '🖥️', titleBn: 'ডেস্কটপ ও স্ক্রিন', oneLineBn: 'পর্দায় যা দেখা যায় তা চিনি — আইকন, টাস্কবার/ডক, ক্লিক, ডাবল ক্লিক, ড্র্যাগ।', status: 'soon' },
  { module: 3, part: 1, icon: '🪟', titleBn: 'উইন্ডো', oneLineBn: 'উইন্ডো খুলি, বন্ধ করি, ছোট-বড় করি, সরাই এবং এক প্রোগ্রাম থেকে আরেকটিতে যাই।', status: 'soon' },
  { module: 4, part: 1, icon: '🗂️', titleBn: 'ফাইল, ফোল্ডার ও পাথ', oneLineBn: 'আলমারির ফাইলের মতো করে ফাইল-ফোল্ডার সাজাই এবং পাথ পড়া শিখি।', status: 'soon' },
  { module: 5, part: 1, icon: '⌨️', titleBn: 'কিবোর্ড ও টাইপিং', oneLineBn: 'কিবোর্ডের অক্ষর, শর্টকাট ও প্রোগ্রামিংয়ের চিহ্ন চিনি; বাংলা-ইংরেজি কিবোর্ড বদলাই।', status: 'soon' },
  { module: 6, part: 1, icon: '📝', titleBn: 'প্রোগ্রাম ও অ্যাপ', oneLineBn: 'অ্যাপ খুলি, লেখা লিখে সেভ করি, সেভ আর সেভ অ্যাজের পার্থক্য বুঝি।', status: 'soon' },
  { module: 7, part: 1, icon: '🌐', titleBn: 'ইন্টারনেট ও ব্রাউজার', oneLineBn: 'ব্রাউজার চালাই, খুঁজে দেখি, ভালো আর সন্দেহজনক সাইট আলাদা করি।', status: 'soon' },
  { module: 8, part: 1, icon: '✉️', titleBn: 'ইমেইল ও অনলাইন অ্যাকাউন্ট', oneLineBn: 'ইমেইল পাঠাই, ফাইল জুড়ে দিই এবং অ্যাকাউন্টের ভালো অভ্যাস গড়ি।', status: 'soon' },
  { module: 9, part: 1, icon: '🛡️', titleBn: 'নিরাপত্তা ও প্রতারণা থেকে সাবধান', oneLineBn: 'পাসওয়ার্ড, OTP, ফিশিং ও ভুয়া বিকাশ/নগদ কল চিনে নিজেকে সুরক্ষিত রাখি।', status: 'soon' },
  { module: 10, part: 1, icon: '⚙️', titleBn: 'সেটিংস ও নিজের মতো সাজানো', oneLineBn: 'ওয়ালপেপার, আওয়াজ, ওয়াই-ফাই, সময় ও ভাষা নিজের মতো ঠিক করি।', status: 'soon' },
  { module: 11, part: 1, icon: '📷', titleBn: 'ছবি, মিডিয়া, স্ক্রিনশট ও ডিভাইস', oneLineBn: 'ছবি দেখি, গান-ভিডিও চালাই, স্ক্রিনশট নিই, পেনড্রাইভ ও প্রিন্টার ব্যবহার করি।', status: 'soon' },
  { module: 12, part: 1, icon: '🔧', titleBn: 'সমস্যায় পড়লে কী করবেন', oneLineBn: 'আটকে যাওয়া প্রোগ্রাম, ভুলে মুছে ফেলা ফাইল — শান্তভাবে সমাধান ও খুঁজে দেখার কৌশল।', status: 'soon' },
  { module: 13, part: 1, icon: '🏆', titleBn: 'পর্ব ১-এর চূড়ান্ত প্রজেক্ট', oneLineBn: 'এ পর্যন্ত যা শিখেছেন তা দিয়ে একটি বাস্তব কাজ সম্পন্ন করে সনদপত্র নিন।', status: 'soon' },
  { module: 14, part: 2, icon: '🧠', titleBn: 'কম্পিউটার আসলে কীভাবে কাজ করে', oneLineBn: 'ইনপুট, প্রসেসিং, মেমোরি, স্টোরেজ এবং বিট-বাইটের ধারণা — রান্নাঘরের উদাহরণে।', status: 'soon' },
  { module: 15, part: 2, icon: '🧭', titleBn: 'প্রোগ্রামিং কী ও কেন', oneLineBn: 'প্রোগ্রামিং কী, প্রোগ্রামাররা কী করেন, কোন পথে শুরু করবেন।', status: 'soon' },
  { module: 16, part: 2, icon: '🧩', titleBn: 'কম্পিউটেশনাল চিন্তা', oneLineBn: 'কোড ছাড়াই ধাপে ধাপে ভাবা — ক্রম, শর্ত ও পুনরাবৃত্তি।', status: 'soon' },
  { module: 17, part: 2, icon: '⬛', titleBn: 'টার্মিনালের প্রথম পাঠ', oneLineBn: 'টার্মিনালে কমান্ড লিখে ফোল্ডার ঘুরি, ফাইল বানাই ও পড়ি।', status: 'soon' },
  { module: 18, part: 2, icon: '🛠️', titleBn: 'প্রোগ্রামিং টুলস সেটআপ', oneLineBn: 'কোড এডিটর, Python/Node.js — নিরাপদে ইনস্টলের পুরো ধাপ।', status: 'soon' },
  { module: 19, part: 2, icon: '📖', titleBn: 'টেক ইংরেজি পড়া ও আটকে গেলে করণীয়', oneLineBn: 'এরর মেসেজ পড়া, ডকুমেন্টেশন ও এআই সহায়ক ব্যবহার এবং নিজের নোটবুক।', status: 'soon' },
  { module: 20, part: 2, icon: '🚀', titleBn: 'প্রথম কোড', oneLineBn: 'HTML, CSS ও প্রথম প্রোগ্রাম লিখে ফল দেখি — এবং পর্ব ২-এর সনদপত্র।', status: 'soon' },
]

export const PARTS = {
  1: { titleBn: 'পর্ব ১: কম্পিউটারের ভিত্তি', subtitleBn: 'কম্পিউটার চালানোর আত্মবিশ্বাস', modules: MODULES.filter((m) => m.part === 1) },
  2: { titleBn: 'পর্ব ২: প্রোগ্রামিংয়ের প্রস্তুতি', subtitleBn: 'কোড লেখার জন্য তৈরি হওয়া', modules: MODULES.filter((m) => m.part === 2) },
} as const

export const getModule = (n: number) => MODULES.find((m) => m.module === n)
