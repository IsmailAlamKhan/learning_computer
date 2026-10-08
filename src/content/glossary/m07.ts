import type { GlossaryEntry } from '../../engine/types'

// Note: 'wifi' (ওয়াই-ফাই) was introduced in Module 1; Module 7 reuses it.
const entries: GlossaryEntry[] = [
  { id: 'internet', termBn: 'ইন্টারনেট', termEn: 'Internet', meaningBn: 'সারা পৃথিবীর কম্পিউটার আর ফোনকে জুড়ে রাখা বিশাল জাল। রাস্তা আর ডাকঘরের মতো এর মধ্য দিয়ে তথ্য এক জায়গা থেকে আরেক জায়গায় যায়।', module: 7 },
  { id: 'mobile-data', termBn: 'মোবাইল ডেটা', termEn: 'Mobile data', meaningBn: 'ফোনের সিমের প্যাকেজ দিয়ে ইন্টারনেট ব্যবহার করা। ওয়াই-ফাই না থাকলেও চলে, তবে প্যাকেজের মেগাবাইট খরচ হয়।', module: 7 },
  { id: 'browser', termBn: 'ব্রাউজার', termEn: 'Browser', meaningBn: 'ওয়েবসাইট দেখার প্রোগ্রাম। যেমন Chrome, Edge, Safari, Firefox।', module: 7 },
  { id: 'website', termBn: 'ওয়েবসাইট', termEn: 'Website', meaningBn: 'ইন্টারনেটে থাকা এক বা একাধিক পাতার সংগ্রহ, যেমন একটি রেসিপির সাইট বা খবরের সাইট। ব্রাউজার দিয়ে দেখতে হয়।', module: 7 },
  { id: 'url', termBn: 'ওয়েব ঠিকানা', termEn: 'Web address (URL)', meaningBn: 'কোনো ওয়েবসাইট বা পাতার ঠিকানা, যেমন https://www.example.com/page। বাড়ির ঠিকানার মতো এটি বলে দেয় পাতাটি কোথায় আছে।', module: 7 },
  { id: 'address-bar', termBn: 'অ্যাড্রেস বার', termEn: 'Address bar', meaningBn: 'ব্রাউজারের ওপরের লম্বা বক্স। এখানে ওয়েব ঠিকানা লিখলে সেই সাইটে যায়, আর সাধারণ শব্দ লিখলে সার্চ হয়।', module: 7 },
  { id: 'search-engine', termBn: 'সার্চ ইঞ্জিন', termEn: 'Search engine', meaningBn: 'শব্দ লিখে ইন্টারনেটে কিছু খোঁজার ওয়েবসাইট। এটি মিলে যাওয়া পাতাগুলোর তালিকা দেখায়।', module: 7 },
  { id: 'tab', termBn: 'ট্যাব', termEn: 'Tab', meaningBn: 'ব্রাউজারের ওপরের ছোট ঘর। একসাথে কয়েকটি পাতা খুলে রাখতে প্রতিটির জন্য আলাদা ট্যাব ব্যবহার হয়।', module: 7 },
  { id: 'bookmark', termBn: 'বুকমার্ক', termEn: 'Bookmark', meaningBn: 'পছন্দের পাতাটি তারা (★) দিয়ে চিহ্ন দিয়ে রাখা, যাতে পরে সহজে খুলে পাওয়া যায়। বইয়ের ভাঁজ করা পাতার মতো।', module: 7 },
  { id: 'back-forward-refresh', termBn: 'পিছনে / সামনে / রিফ্রেশ', termEn: 'Back / Forward / Refresh', meaningBn: 'পিছনের বোতাম আগের পাতায় ফেরায়, সামনের বোতাম আবার এগিয়ে যায়, আর রিফ্রেশ (Reload) এখনকার পাতাটি নতুন করে লোড করে।', module: 7 },
  { id: 'link', termBn: 'লিংক', termEn: 'Link', meaningBn: 'ওয়েবপাতার লেখা বা ছবি, যেখানে ক্লিক করলে অন্য পাতায় যাওয়া যায়। অনেক সময় নীল রঙের নিচে দাগ থাকে।', module: 7 },
  { id: 'download', termBn: 'ডাউনলোড', termEn: 'Download', meaningBn: 'ইন্টারনেট থেকে কোনো ফাইল নিজের কম্পিউটারে নামানো। সাধারণত ফাইলটি Downloads ফোল্ডারে জমা হয়।', module: 7 },
  { id: 'https', termBn: 'এইচটিটিপিএস', termEn: 'https', meaningBn: 'ঠিকানার শুরুতে থাকা অংশ, যার মানে সাইট আর আপনার মাঝের তথ্য মুড়ে পাঠানো হয়। তবে সাইটটি সৎ কি না সেটা এ থেকে বোঝা যায় না।', module: 7 },
  { id: 'padlock', termBn: 'তালার চিহ্ন', termEn: 'Padlock', meaningBn: 'অ্যাড্রেস বারের ছোট তালার ছবি, যা https সংযোগ বোঝায়। তালা থাকলেও ঠকবাজ সাইট হতে পারে।', module: 7 },
  { id: 'domain', termBn: 'ডোমেইন', termEn: 'Domain', meaningBn: 'ওয়েব ঠিকানার (বা ইমেইল ঠিকানার @ চিহ্নের পরের) আসল নাম, যেমন example.com। ঠকবাজেরা অনেক সময় বানান সামান্য বদলে ভুয়া নাম বানায়, তাই এটি খুঁটিয়ে দেখুন।', module: 7 },
  { id: 'pop-up', termBn: 'পপ-আপ', termEn: 'Pop-up', meaningBn: 'ওয়েবপাতার ওপর হঠাৎ লাফিয়ে ওঠা ছোট উইন্ডো। ভয় বা লোভ দেখানো পপ-আপে ক্লিক না করে ✕ দিয়ে বন্ধ করুন।', module: 7 },
  { id: 'advertisement', termBn: 'বিজ্ঞাপন', termEn: 'Advertisement (Ad)', meaningBn: 'টাকা দিয়ে দেখানো প্রচার। সার্চের ফলাফলে “Ad” লেখা থাকে। এটি সবসময় সেরা উত্তর নয়।', module: 7 },
]

export default entries
