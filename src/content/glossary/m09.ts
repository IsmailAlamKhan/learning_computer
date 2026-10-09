import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'passphrase', termBn: 'পাসফ্রেজ', termEn: 'Passphrase', meaningBn: 'চার-পাঁচটি এলোমেলো শব্দ জুড়ে বানানো লম্বা পাসওয়ার্ড। মনে রাখা সহজ।', art: 'key', module: 9 },
  { id: 'password-manager', termBn: 'পাসওয়ার্ড ম্যানেজার', termEn: 'Password Manager', meaningBn: 'সব পাসওয়ার্ড তালাবন্ধ রাখার প্রোগ্রাম। মনে রাখতে হয় শুধু একটি মূল পাসওয়ার্ড।', art: 'almirah', module: 9 },
  { id: 'two-factor-auth', termBn: 'দুই ধাপের যাচাই', termEn: 'Two-factor authentication (2FA)', meaningBn: 'পাসওয়ার্ডের পরে আরেকটি প্রমাণ, যেমন ফোনের কোড। দ্বিতীয় তালার মতো।', art: 'shield', module: 9 },
  { id: 'pin', termBn: 'পিন (PIN)', termEn: 'PIN', meaningBn: 'কয়েক সংখ্যার গোপন কোড। ফোন, বার্তা বা লিংকে কাউকে দিতে নেই।', art: 'otp-code', module: 9 },
  { id: 'phishing', termBn: 'ফিশিং', termEn: 'Phishing', meaningBn: 'আসলের মতো সাজানো ভুয়া বার্তা বা সাইট, যা পাসওয়ার্ড বা কোড হাতাতে চায়।', art: 'fishing-hook', module: 9 },
  { id: 'scam', termBn: 'প্রতারণা', termEn: 'Scam', meaningBn: 'মিথ্যা কথা বা ভুয়া প্রস্তাব দিয়ে টাকা বা তথ্য হাতানোর ফাঁদ।', art: 'warning', module: 9 },
  { id: 'fraud', termBn: 'জালিয়াতি', termEn: 'Fraud', meaningBn: 'অন্যের টাকা বা পরিচয় অবৈধভাবে ব্যবহার করা। প্রতারণার ফলেও ঘটে।', art: 'warning', module: 9 },
  { id: 'malware', termBn: 'ম্যালওয়্যার', termEn: 'Malware', meaningBn: 'ক্ষতি করার জন্য বানানো প্রোগ্রাম। ভাইরাস এর একটি ধরন।', art: 'bug', module: 9 },
  { id: 'virus', termBn: 'ভাইরাস', termEn: 'Virus', meaningBn: 'নিজে ছড়িয়ে পড়া ক্ষতিকর প্রোগ্রাম। ম্যালওয়্যারের পরিচিত ধরন।', art: 'bug', module: 9 },
  { id: 'antivirus', termBn: 'অ্যান্টিভাইরাস', termEn: 'Antivirus', meaningBn: 'ক্ষতিকর প্রোগ্রাম খুঁজে আটকানোর প্রোগ্রাম। Windows Security বা Mac-এর বিল্ট-ইন সুরক্ষা।', art: 'shield', module: 9 },
  { id: 'public-wifi', termBn: 'পাবলিক ওয়াই-ফাই', termEn: 'Public Wi‑Fi', meaningBn: 'ক্যাফে বা স্টেশনের মতো সবার জন্য খোলা ওয়াই-ফাই। ব্যাংকিং নয়।', art: 'wifi', module: 9 },
  { id: 'lock-screen', termBn: 'স্ক্রিন লক', termEn: 'Lock Screen', meaningBn: 'পর্দায় সাময়িক তালা। Windows-এ Win+L, Mac-এ Control+Command+Q।', art: 'lock', module: 9 },
  { id: 'privacy', termBn: 'গোপনীয়তা', termEn: 'Privacy', meaningBn: 'নিজের তথ্য কে কতটা দেখবে, তা নিজে ঠিক করার অভ্যাস।', art: 'id-card', module: 9 },
  { id: 'permission', termBn: 'অনুমতি', termEn: 'Permission', meaningBn: 'অ্যাপ ক্যামেরা, লোকেশন ইত্যাদি ব্যবহারের যে অনুমতি চায়। দরকার না হলে “না”।', art: 'user', module: 9 },
  { id: 'fake-link', termBn: 'ভুয়া লিংক', termEn: 'Fake link', meaningBn: 'লেখা এক রকম, কিন্তু অন্য সাইটে নিয়ে যায়। ক্লিকের আগে আসল ঠিকানা দেখুন।', art: 'link', module: 9 },
]

export default entries
