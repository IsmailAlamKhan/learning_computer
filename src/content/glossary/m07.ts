import type { GlossaryEntry } from '../../engine/types'

// Note: 'wifi' (ওয়াই-ফাই) was introduced in Module 1; Module 7 reuses it.
const entries: GlossaryEntry[] = [
  { id: 'internet', termBn: 'ইন্টারনেট', termEn: 'Internet', icon: '🌐', art: 'globe', meaningBn: 'সারা পৃথিবীর কম্পিউটার আর ফোনকে জুড়ে রাখা বিশাল রাস্তার জাল, যে পথে তথ্য আসে-যায়।', module: 7 },
  { id: 'mobile-data', termBn: 'মোবাইল ডেটা', termEn: 'Mobile data', icon: '📶', art: 'phone', meaningBn: 'ফোনের সিমের প্যাকেজ দিয়ে ইন্টারনেট চালানো। ওয়াই-ফাই ছাড়াই চলে, তবে প্যাকেজ খরচ হয়।', module: 7 },
  { id: 'browser', termBn: 'ব্রাউজার', termEn: 'Browser', icon: '🧭', art: 'browser', meaningBn: 'ওয়েবসাইট দেখার প্রোগ্রাম। যেমন Chrome, Edge, Safari, Firefox।', module: 7 },
  { id: 'website', termBn: 'ওয়েবসাইট', termEn: 'Website', icon: '🏪', meaningBn: 'ইন্টারনেটে থাকা পাতার সংগ্রহ, যেমন রেসিপির সাইট বা খবরের সাইট। ইন্টারনেটের দোকান।', module: 7 },
  { id: 'url', termBn: 'ওয়েব ঠিকানা', termEn: 'Web address (URL)', icon: '🔗', art: 'link', meaningBn: 'কোনো পাতার ঠিকানা, যেমন https://www.example.com/page। বাড়ির ঠিকানার মতো।', module: 7 },
  { id: 'address-bar', termBn: 'অ্যাড্রেস বার', termEn: 'Address bar', icon: '⌨️', art: 'browser', meaningBn: 'ব্রাউজারের ওপরের লম্বা বক্স। ঠিকানা লিখলে সাইটে যায়, সাধারণ শব্দ লিখলে সার্চ করে।', module: 7 },
  { id: 'search-engine', termBn: 'সার্চ ইঞ্জিন', termEn: 'Search engine', icon: '🔎', art: 'magnifier', meaningBn: 'শব্দ লিখে ইন্টারনেটে কিছু খোঁজার সাইট। মিলে যাওয়া পাতার তালিকা দেখায়।', module: 7 },
  { id: 'tab', termBn: 'ট্যাব', termEn: 'Tab', icon: '🗂️', art: 'tab', meaningBn: 'ব্রাউজারের ওপরের ছোট ঘর। এক ব্রাউজারে কয়েকটি পাতা আলাদা ঘরে খুলে রাখা যায়।', module: 7 },
  { id: 'bookmark', termBn: 'বুকমার্ক', termEn: 'Bookmark', icon: '⭐', art: 'bookmark', meaningBn: 'পছন্দের পাতায় তারা (★) দিয়ে চিহ্ন দেওয়া, যাতে পরে সহজে খুলতে পারেন।', module: 7 },
  { id: 'back-forward-refresh', termBn: 'পেছনে / সামনে / রিফ্রেশ', termEn: 'Back / Forward / Refresh', icon: '↩️', art: 'refresh', meaningBn: 'পেছনে আগের পাতায় ফেরায়, সামনে এগিয়ে দেয়, রিফ্রেশ এখনকার পাতা নতুন করে আনে।', module: 7 },
  { id: 'link', termBn: 'লিংক', termEn: 'Link', icon: '👆', art: 'link', meaningBn: 'ওয়েবপাতার লেখা বা ছবি, যাতে ক্লিক করলে অন্য পাতা খোলে। প্রায়ই নীল রঙের।', module: 7 },
  { id: 'download', termBn: 'ডাউনলোড', termEn: 'Download', icon: '⬇️', art: 'download', meaningBn: 'ইন্টারনেট থেকে ফাইল কম্পিউটারে নামানো। সাধারণত Downloads ফোল্ডারে জমা হয়।', module: 7 },
  { id: 'https', termBn: 'এইচটিটিপিএস', termEn: 'https', icon: '🔐', art: 'lock', meaningBn: 'ঠিকানার শুরুর অংশ। এর মানে সাইট আর আপনার মাঝের তথ্য সুরক্ষিত পথে যায়, তবে সাইট সৎ কি না বলে না।', module: 7 },
  { id: 'padlock', termBn: 'তালার চিহ্ন', termEn: 'Padlock', icon: '🔒', art: 'lock', meaningBn: 'ঠিকানার পাশের ছোট তালা, https সংযোগ বোঝায়। তালা থাকলেও ঠকবাজ সাইট হতে পারে।', module: 7 },
  { id: 'domain', termBn: 'ডোমেইন', termEn: 'Domain', icon: '🏷️', meaningBn: 'ওয়েব ঠিকানার আসল নাম, যেমন example.com। ঠকবাজেরা বানান একটু বদলায়, তাই খুঁটিয়ে দেখুন।', module: 7 },
  { id: 'pop-up', termBn: 'পপ-আপ', termEn: 'Pop-up', icon: '💥', art: 'warning', meaningBn: 'ওয়েবপাতায় হঠাৎ লাফিয়ে ওঠা ছোট উইন্ডো। ভয় দেখালে ক্লিক না করে ✕ দিয়ে বন্ধ করুন।', module: 7 },
  { id: 'advertisement', termBn: 'বিজ্ঞাপন', termEn: 'Advertisement (Ad)', icon: '📢', meaningBn: 'টাকা দিয়ে দেখানো প্রচার, ফলাফলে “Ad” লেখা থাকে। এটি সবসময় সেরা উত্তর নয়।', module: 7 },
]

export default entries
