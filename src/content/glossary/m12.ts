import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'freeze', termBn: 'আটকে যাওয়া (ফ্রিজ)', termEn: 'Freeze / Not Responding', icon: '🧊', art: 'freeze', meaningBn: 'প্রোগ্রাম ক্লিক বা কী-তে আর সাড়া দেয় না। আগে আধ মিনিট অপেক্ষা করুন।', module: 12 },
  { id: 'task-manager', termBn: 'টাস্ক ম্যানেজার', termEn: 'Task Manager', icon: '📊', meaningBn: 'Windows-এর যে উইন্ডোতে চলমান প্রোগ্রাম দেখা ও বন্ধ করা যায়। শর্টকাট Ctrl + Shift + Esc।', module: 12 },
  { id: 'force-quit', termBn: 'ফোর্স কুইট', termEn: 'Force Quit', icon: '🛑', meaningBn: 'Mac-এ আটকে যাওয়া প্রোগ্রাম জোর করে বন্ধ করা। শর্টকাট Option + Command + Esc।', module: 12 },
  { id: 'end-task', termBn: 'এন্ড টাস্ক', termEn: 'End task', icon: '⏹️', meaningBn: 'Task Manager-এর বোতাম, যা বাছা প্রোগ্রামটি সাথে সাথে বন্ধ করে দেয়।', module: 12 },
  { id: 'process', termBn: 'প্রসেস', termEn: 'Process', icon: '⚙️', art: 'gear', meaningBn: 'কম্পিউটারের ভেতরে চলতে থাকা একেকটি কাজ। অচেনা প্রসেস না বুঝে বন্ধ করবেন না।', module: 12 },
  { id: 'undo-mistake', termBn: 'আনডু (ভুল ফেরানো)', termEn: 'Undo', icon: '↩️', art: 'undo', meaningBn: 'সদ্য করা কাজ ফিরিয়ে নেওয়া। Windows-এ Ctrl + Z, Mac-এ Command + Z।', module: 12 },
  { id: 'restore-deleted', termBn: 'মোছা ফাইল ফেরানো', termEn: 'Restore / Put Back', icon: '♻️', art: 'trash', meaningBn: 'রিসাইকেল বিন বা ট্র্যাশ থেকে ফাইল আগের জায়গায় ফেরানো। খালি করলে আর ফেরে না।', module: 12 },
  { id: 'error-message', termBn: 'এরর মেসেজ', termEn: 'Error message', icon: '⚠️', art: 'warning', meaningBn: 'কিছু ভুল হলে কম্পিউটারের দেখানো বার্তা। না পড়ে OK চাপবেন না; হুবহু কপি করে রাখুন।', module: 12 },
  { id: 'search-error', termBn: 'এরর খুঁজে দেখা', termEn: 'Search the error', icon: '🔍', art: 'magnifier', meaningBn: 'এরর মেসেজ হুবহু কপি করে সার্চ ইঞ্জিনে পেস্ট করা। ফলের তারিখ আর উৎস দেখে নিন।', module: 12 },
  { id: 'forum', termBn: 'ফোরাম', termEn: 'Forum / Q&A site', icon: '💬', art: 'chat-bubble', meaningBn: 'যে সাইটে মানুষ প্রশ্ন করে আর অন্যরা উত্তর দেয়। “Accepted answer” আর বেশি ভোট ভালো লক্ষণ।', module: 12 },
  { id: 'official-docs', termBn: 'অফিসিয়াল ডকুমেন্টেশন', termEn: 'Official documentation', icon: '📘', art: 'book', meaningBn: 'প্রস্তুতকারকের নিজের লেখা সাহায্যের পাতা। সবচেয়ে ভরসাযোগ্য উৎস।', module: 12 },
  { id: 'screenshot-help', termBn: 'স্ক্রিনশট', termEn: 'Screenshot', icon: '📸', art: 'camera', meaningBn: 'পর্দার ছবি। Windows: Win + Shift + S; Mac: Shift + Command + 4। সাহায্য চাইতে কাজে লাগে।', module: 12 },
]

export default entries
