import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'passphrase', termBn: 'পাসফ্রেজ', termEn: 'Passphrase', meaningBn: 'চার-পাঁচটি এলোমেলো শব্দ জুড়ে বানানো লম্বা পাসওয়ার্ড। মনে রাখা সহজ, অনুমান করা কঠিন।', module: 9 },
  { id: 'password-manager', termBn: 'পাসওয়ার্ড ম্যানেজার', termEn: 'Password Manager', meaningBn: 'অনেক পাসওয়ার্ড নিরাপদে জমিয়ে রাখার প্রোগ্রাম। শুধু একটি মূল পাসওয়ার্ড (মাস্টার পাসওয়ার্ড) মনে রাখলেই চলে।', module: 9 },
  { id: 'two-factor-auth', termBn: 'দুই ধাপের যাচাই', termEn: 'Two-factor authentication (2FA)', meaningBn: 'পাসওয়ার্ডের পরে আরেকটি প্রমাণ চাওয়া, যেমন ফোনের অ্যাপের কোড। কারও হাতে পাসওয়ার্ড পড়লেও অ্যাকাউন্ট সহজে খোলে না।', module: 9 },
  { id: 'pin', termBn: 'পিন', termEn: 'PIN', meaningBn: 'কয়েক সংখ্যার গোপন সংখ্যা, যেমন মোবাইল ব্যাংকিং বা কার্ডের। কোনো ফোন, বার্তা বা লিংকে এটি দিতে নেই।', module: 9 },
  { id: 'phishing', termBn: 'ফিশিং', termEn: 'Phishing', meaningBn: 'আসল প্রতিষ্ঠানের মতো সাজানো ভুয়া ইমেইল, বার্তা বা ওয়েবসাইট, যা আপনার পাসওয়ার্ড বা কোড হাতিয়ে নিতে চায়।', module: 9 },
  { id: 'scam', termBn: 'প্রতারণা', termEn: 'Scam', meaningBn: 'মিথ্যা কথা বা ভুয়া প্রস্তাব দিয়ে টাকা বা তথ্য হাতিয়ে নেওয়ার ফাঁদ।', module: 9 },
  { id: 'fraud', termBn: 'জালিয়াতি', termEn: 'Fraud', meaningBn: 'অন্যের টাকা বা পরিচয় অবৈধভাবে ব্যবহার করা। প্রতারণার ফল হিসেবেও জালিয়াতি ঘটতে পারে।', module: 9 },
  { id: 'malware', termBn: 'ম্যালওয়্যার', termEn: 'Malware', meaningBn: 'ক্ষতি করার জন্য বানানো প্রোগ্রাম। ভাইরাস এর একটি ধরন। অচেনা ফাইল বা অ্যাপ নামালে ঢুকে পড়তে পারে।', module: 9 },
  { id: 'virus', termBn: 'ভাইরাস', termEn: 'Virus', meaningBn: 'নিজে নিজে ছড়িয়ে পড়া ক্ষতিকর প্রোগ্রাম। ম্যালওয়্যারের একটি পরিচিত ধরন।', module: 9 },
  { id: 'antivirus', termBn: 'অ্যান্টিভাইরাস', termEn: 'Antivirus', meaningBn: 'ক্ষতিকর প্রোগ্রাম খুঁজে বের করে আটকানোর প্রোগ্রাম। Windows-এ Windows Security আর Mac-এ বিল্ট-ইন সুরক্ষা সাধারণ কাজের জন্য থাকে।', module: 9 },
  { id: 'public-wifi', termBn: 'পাবলিক ওয়াই-ফাই', termEn: 'Public Wi‑Fi', meaningBn: 'ক্যাফে, স্টেশন বা দোকানের মতো সবার জন্য খোলা ওয়াই-ফাই। এতে ব্যাংকিং বা গোপন কাজ না করাই ভালো।', module: 9 },
  { id: 'lock-screen', termBn: 'স্ক্রিন লক', termEn: 'Lock Screen', meaningBn: 'কম্পিউটারের পর্দা সাময়িক তালা দেওয়া, যাতে আপনি সরে গেলে অন্য কেউ ব্যবহার করতে না পারে। Windows-এ Win+L, Mac-এ Control+Command+Q।', module: 9 },
  { id: 'privacy', termBn: 'গোপনীয়তা', termEn: 'Privacy', meaningBn: 'নিজের ব্যক্তিগত তথ্য কে কতটা দেখবে তা নিজে ঠিক করার অধিকার ও অভ্যাস।', module: 9 },
  { id: 'permission', termBn: 'অনুমতি', termEn: 'Permission', meaningBn: 'কোনো অ্যাপ বা ওয়েবসাইট আপনার ক্যামেরা, লোকেশন, ছবি ইত্যাদি ব্যবহার করতে চাইলে যে অনুমতি চায়। দরকার না হলে “না” বলা যায়।', module: 9 },
  { id: 'fake-link', termBn: 'ভুয়া লিংক', termEn: 'Fake link', meaningBn: 'যে লিংকের লেখা এক রকম, কিন্তু আসলে অন্য ওয়েবসাইটে নিয়ে যায়। ক্লিকের আগে আসল ঠিকানা দেখে নিতে হয়।', module: 9 },
]

export default entries
