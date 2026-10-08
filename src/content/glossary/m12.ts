import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'freeze', termBn: 'আটকে যাওয়া (ফ্রিজ)', termEn: 'Freeze / Not Responding', meaningBn: 'প্রোগ্রাম ক্লিক বা কী-তে আর সাড়া দেয় না। Windows-এ উইন্ডোর নামের পাশে “(Not Responding)” লেখা আসে, Mac-এ ঘুরতে থাকা রঙিন চাকা দেখা যায়। আগে আধ মিনিট অপেক্ষা করে দেখতে হয়।', module: 12 },
  { id: 'task-manager', termBn: 'টাস্ক ম্যানেজার', termEn: 'Task Manager', meaningBn: 'Windows-এর যে উইন্ডোতে দেখা যায় কোন প্রোগ্রাম চলছে এবং কে কতটা প্রসেসর (CPU) ও মেমোরি ব্যবহার করছে। আটকে যাওয়া প্রোগ্রাম এখান থেকে বন্ধ করা যায়। শর্টকাট: Ctrl + Shift + Esc।', module: 12 },
  { id: 'force-quit', termBn: 'ফোর্স কুইট', termEn: 'Force Quit', meaningBn: 'Mac-এ আটকে যাওয়া প্রোগ্রাম জোর করে বন্ধ করা। শর্টকাট Option + Command + Esc, অথবা ওপরের বাঁ কোণের আপেল-চিহ্নের মেনু (সিস্টেম মেনু) থেকে Force Quit…। সেভ না করা কাজ হারিয়ে যেতে পারে।', module: 12 },
  { id: 'end-task', termBn: 'এন্ড টাস্ক', termEn: 'End task', meaningBn: 'Task Manager-এর বোতাম, যা বাছা প্রোগ্রামটিকে সাথে সাথে বন্ধ করে দেয়। Mac-এর Force Quit-এর মতোই; সেভ না করা লেখা হারাতে পারে।', module: 12 },
  { id: 'process', termBn: 'প্রসেস', termEn: 'Process', meaningBn: 'কম্পিউটারের ভেতরে চলতে থাকা একেকটি কাজ। খোলা প্রতিটি প্রোগ্রাম একটি প্রসেস; এছাড়া অনেক ছোট প্রসেস নিজে নিজেই পেছনে চলে। অচেনা প্রসেস না বুঝে বন্ধ করবেন না।', module: 12 },
  { id: 'undo-mistake', termBn: 'আনডু (ভুল ফেরানো)', termEn: 'Undo', meaningBn: 'সদ্য করা কাজটি ফিরিয়ে নেওয়া, যেমন ভুলে মুছে ফেলা লেখা। Windows-এ Ctrl + Z, Mac-এ Command + Z। কয়েকবার চাপলে আরও আগের অবস্থায় যাওয়া যায়।', module: 12 },
  { id: 'restore-deleted', termBn: 'মোছা ফাইল ফেরানো', termEn: 'Restore from Recycle Bin / Trash', meaningBn: 'ভুলে মুছে ফেলা ফাইল রিসাইকেল বিন (Windows) বা ট্র্যাশ (Mac) থেকে আগের জায়গায় ফিরিয়ে আনা। বিন খালি করে ফেললে আর ফেরানো যায় না।', module: 12 },
  { id: 'error-message', termBn: 'এরর মেসেজ', termEn: 'Error message', meaningBn: 'কিছু ভুল হলে কম্পিউটার যে বার্তা দেখায়। এতে অনেক সময় সমস্যার নাম বা একটি কোড থাকে। না পড়ে OK চেপে দেবেন না — হুবহু কপি করে রাখলে খুঁজে সমাধান পাওয়া সহজ হয়।', module: 12 },
  { id: 'search-error', termBn: 'এরর খুঁজে দেখা', termEn: 'Search the error', meaningBn: 'এরর মেসেজটি হুবহু কপি করে সার্চ ইঞ্জিনে পেস্ট করা। আপনার আগে আরও অনেকেই একই সমস্যায় পড়েছেন, তাই সাধারণত উত্তর পাওয়া যায়। ফল পড়ার সময় তারিখ আর উৎস দেখে নিন।', module: 12 },
  { id: 'forum', termBn: 'ফোরাম', termEn: 'Forum / Q&A site', meaningBn: 'যে ওয়েবসাইটে মানুষ প্রশ্ন করে আর অন্যরা উত্তর দেয়। “Accepted answer” (প্রশ্নকারী যে উত্তর মেনে নিয়েছেন), নতুন তারিখ আর অনেক ভোট থাকা উত্তর বেশি ভরসাযোগ্য।', module: 12 },
  { id: 'official-docs', termBn: 'অফিসিয়াল ডকুমেন্টেশন', termEn: 'Official documentation', meaningBn: 'যারা প্রোগ্রাম বা যন্ত্রটি বানিয়েছে তাদের নিজেদের লেখা সাহায্যের পাতা। এটি সবচেয়ে ভরসাযোগ্য উৎস। ঠিকানাটি সত্যিই প্রস্তুতকারকের কি না দেখে নিন।', module: 12 },
  { id: 'screenshot-help', termBn: 'স্ক্রিনশট', termEn: 'Screenshot', meaningBn: 'পর্দায় যা দেখা যাচ্ছে তার ছবি তুলে রাখা। সাহায্য চাইতে গেলে এরর মেসেজের স্ক্রিনশট পাঠালে অন্যজন সমস্যাটা সহজে বুঝতে পারেন। (Windows: Win + Shift + S; Mac: Shift + Command + 4।)', module: 12 },
]

export default entries
