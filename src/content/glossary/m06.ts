import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'program', termBn: 'প্রোগ্রাম', termEn: 'Program', meaningBn: 'কম্পিউটারকে দিয়ে কোনো নির্দিষ্ট কাজ করানোর সফটওয়্যার। যেমন লেখার প্রোগ্রাম, ছবি দেখার প্রোগ্রাম। কলম-খাতার মতো এটি একটি কাজের হাতিয়ার।', module: 6 },
  { id: 'app', termBn: 'অ্যাপ', termEn: 'App', meaningBn: 'প্রোগ্রামেরই ছোট ও চলতি নাম। ফোন আর কম্পিউটার দুটোতেই এই নামটি শোনা যায়।', module: 6 },
  { id: 'application', termBn: 'অ্যাপ্লিকেশন', termEn: 'Application', meaningBn: 'প্রোগ্রাম বা অ্যাপের পুরো নাম। কোনো একটি কাজের জন্য বানানো প্রোগ্রামকে অ্যাপ্লিকেশন বলে। Mac-এর Applications ফোল্ডারে সব অ্যাপ থাকে।', module: 6 },
  { id: 'install', termBn: 'ইনস্টল', termEn: 'Install', meaningBn: 'নতুন প্রোগ্রাম কম্পিউটারে বসিয়ে নেওয়া, যাতে সেটি ব্যবহার করা যায়। সাধারণত ডাউনলোড করে সেটআপের ধাপগুলো (Next, Install, Finish) শেষ করতে হয়।', module: 6 },
  { id: 'uninstall', termBn: 'আনইনস্টল', termEn: 'Uninstall', meaningBn: 'কম্পিউটার থেকে কোনো প্রোগ্রাম সরিয়ে ফেলা, যাতে সেটি আর জায়গা না নেয়। শুধু আইকন মুছে ফেললে অনেক সময় ঠিকমতো সরে না।', module: 6 },
  { id: 'plain-text', termBn: 'প্লেইন টেক্সট', termEn: 'Plain text', meaningBn: 'শুধু অক্ষর আর চিহ্ন দিয়ে লেখা, কোনো সাজসজ্জা (মোটা, রং, ফন্ট) ছাড়া। ফাইলের নাম সাধারণত .txt দিয়ে শেষ হয়। প্রোগ্রামাররা এভাবেই কোড লেখেন।', module: 6 },
  { id: 'rich-text', termBn: 'সাজানো লেখা', termEn: 'Formatted / Rich text', meaningBn: 'যে লেখায় মোটা অক্ষর, রং, বড় হরফ ইত্যাদি সাজসজ্জা আছে, যেমন Word ফাইল। ফাইলের ভেতরে সাজসজ্জার লুকানো নির্দেশও জমা থাকে।', module: 6 },
  { id: 'notepad', termBn: 'নোটপ্যাড', termEn: 'Notepad', meaningBn: 'Windows-এর সাধারণ লেখার প্রোগ্রাম। এতে সাজসজ্জা ছাড়া শুধু লেখা যায় এবং .txt ফাইল বানানো যায়।', module: 6 },
  { id: 'textedit', termBn: 'টেক্সটএডিট', termEn: 'TextEdit', meaningBn: 'Mac-এর লেখার প্রোগ্রাম। শুরুতে এটি সাজানো লেখার (rich text) অবস্থায় থাকতে পারে; Format মেনু থেকে Make Plain Text বেছে সাধারণ লেখায় আনা যায়।', module: 6 },
  { id: 'save', termBn: 'সেভ', termEn: 'Save', meaningBn: 'আপনার লেখা বা কাজ ফাইলে জমা করে রাখা। ফাইলটির আগে থেকে নাম থাকলে Save সেই একই ফাইলটি নতুন লেখায় বদলে দেয়। প্রথমবার সেভ করলে নাম আর জায়গা জিজ্ঞেস করে।', module: 6 },
  { id: 'save-as', termBn: 'সেভ অ্যাজ', termEn: 'Save As', meaningBn: 'একই লেখা নতুন নামে বা নতুন জায়গায় আরেকটি ফাইল হিসেবে রাখা। আগের ফাইলটি যেমন ছিল তেমনই থাকে।', module: 6 },
  { id: 'open-file', termBn: 'ওপেন', termEn: 'Open', meaningBn: 'আগে সেভ করা ফাইল আবার খোলা। ফাইল ম্যানেজারে ডাবল ক্লিক করেও খোলা যায়, আবার প্রোগ্রামের File → Open থেকেও খোলা যায়।', module: 6 },
  { id: 'start-search', termBn: 'স্টার্ট সার্চ', termEn: 'Start search', meaningBn: 'Windows-এ স্টার্ট মেনু খুলে সরাসরি টাইপ করলে প্রোগ্রাম, সেটিংস আর ফাইল খুঁজে দেয়। প্রোগ্রামের নাম মনে থাকলে এটাই সবচেয়ে সহজ পথ।', module: 6 },
  { id: 'spotlight', termBn: 'স্পটলাইট', termEn: 'Spotlight', meaningBn: 'Mac-এর খোঁজার জায়গা। ওপরের ডান দিকের ম্যাগনিফাইং গ্লাস চাপলে (বা Cmd + Space) খুলে নাম টাইপ করলেই প্রোগ্রাম আর ফাইল পাওয়া যায়।', module: 6 },
  { id: 'official-source', termBn: 'অফিসিয়াল উৎস', termEn: 'Official source', meaningBn: 'প্রোগ্রাম যে প্রস্তুতকারকের নিজের ওয়েবসাইট বা কম্পিউটারের নিজস্ব অ্যাপ স্টোর। শুধু এখান থেকেই প্রোগ্রাম নামানো নিরাপদ; পপ-আপ বা অচেনা লিংক থেকে নয়।', module: 6 },
  { id: 'update', termBn: 'আপডেট', termEn: 'Update', meaningBn: 'কোনো প্রোগ্রামের নতুন সংস্করণ, যাতে ভুল ঠিক করা আর নিরাপত্তা বাড়ানো থাকে। আপডেটও অফিসিয়াল জায়গা থেকেই করতে হয়।', module: 6 },
]

export default entries
