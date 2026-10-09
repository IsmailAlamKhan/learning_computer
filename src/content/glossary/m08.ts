import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'email', termBn: 'ইমেইল', termEn: 'Email', icon: '✉️', art: 'envelope', meaningBn: 'ইন্টারনেটে পাঠানো চিঠি। মুহূর্তে পৌঁছায়, ছবি বা ফাইলও জুড়ে দেওয়া যায়।', module: 8 },
  { id: 'email-address', termBn: 'ইমেইল ঠিকানা', termEn: 'Email address', icon: '📮', meaningBn: 'ইমেইলের ডাকঠিকানা, যেমন anika@mail.example। নাম, @ চিহ্ন, তারপর ডোমেইন।', module: 8 },
  { id: 'inbox', termBn: 'ইনবক্স (আসা চিঠির বাক্স)', termEn: 'Inbox', icon: '📥', art: 'inbox', meaningBn: 'আপনার কাছে আসা ইমেইল যেখানে জমা হয়। না-পড়া চিঠি মোটা অক্ষরে থাকে।', module: 8 },
  { id: 'sent', termBn: 'সেন্ট (পাঠানো চিঠি)', termEn: 'Sent', icon: '📤', meaningBn: 'আপনার পাঠানো ইমেইলের কপি যে ফোল্ডারে থাকে। পাঠানো হয়েছে কি না এখানে দেখুন।', module: 8 },
  { id: 'draft', termBn: 'ড্রাফট (খসড়া)', termEn: 'Draft', icon: '📝', meaningBn: 'লেখা শুরু করেও এখনও না-পাঠানো ইমেইল। পরে শেষ করে পাঠানো যায়।', module: 8 },
  { id: 'spam', termBn: 'স্প্যাম (বাজে ইমেইল)', termEn: 'Spam', icon: '🚫', art: 'warning', meaningBn: 'অচেনা কারও পাঠানো বিজ্ঞাপন বা প্রতারণার ইমেইল। আলাদা Spam ফোল্ডারে সরে যায়।', module: 8 },
  { id: 'compose', termBn: 'নতুন চিঠি লেখা', termEn: 'Compose', icon: '✍️', meaningBn: 'নতুন ইমেইল শুরু করার বোতাম। চাপলে To, Subject আর লেখার ঘর আসে।', module: 8 },
  { id: 'subject', termBn: 'সাবজেক্ট (বিষয়)', termEn: 'Subject', icon: '🏷️', meaningBn: 'ইমেইলের এক লাইনের শিরোনাম। ছোট ও পরিষ্কার লিখুন, প্রাপক এখান থেকেই বোঝেন।', module: 8 },
  { id: 'attachment', termBn: 'অ্যাটাচমেন্ট (জুড়ে দেওয়া ফাইল)', termEn: 'Attachment', icon: '📎', art: 'paperclip', meaningBn: 'ইমেইলের সাথে জুড়ে দেওয়া ফাইল, ক্লিপ চিহ্নে দেখা যায়। খুব বড় হলে পাঠানো যায় না।', module: 8 },
  { id: 'reply', termBn: 'রিপ্লাই (উত্তর দেওয়া)', termEn: 'Reply', icon: '↩️', meaningBn: 'আসা ইমেইলের উত্তর পাঠানো। ঠিকানা আর বিষয় (Re:) নিজে থেকেই বসে।', module: 8 },
  { id: 'forward', termBn: 'ফরোয়ার্ড (এগিয়ে দেওয়া)', termEn: 'Forward', icon: '➡️', meaningBn: 'পাওয়া ইমেইল অন্য কাউকে পাঠানো। বিষয়ের আগে Fwd: বসে।', module: 8 },
  { id: 'account', termBn: 'অ্যাকাউন্ট', termEn: 'Account', icon: '👤', art: 'user', meaningBn: 'কোনো সাইটে আপনার নিজের জায়গা। আপনার তথ্য আর কাজ সেখানে জমা থাকে।', module: 8 },
  { id: 'username', termBn: 'ইউজারনেম', termEn: 'Username', icon: '🪪', meaningBn: 'অ্যাকাউন্টে আপনার নাম বা পরিচয়। লকারের নম্বরের মতো, গোপন নয়।', module: 8 },
  { id: 'password', termBn: 'পাসওয়ার্ড', termEn: 'Password', icon: '🔑', art: 'key', meaningBn: 'অ্যাকাউন্ট খোলার গোপন চাবি। কাউকে বলবেন না।', module: 8 },
  { id: 'sign-up', termBn: 'সাইন আপ (নতুন অ্যাকাউন্ট খোলা)', termEn: 'Sign up', icon: '🆕', meaningBn: 'কোনো সাইটে প্রথমবার নতুন অ্যাকাউন্ট খোলা। সাধারণত ইমেইল ঠিকানা লাগে।', module: 8 },
  { id: 'log-in', termBn: 'লগ ইন (ঢোকা)', termEn: 'Log in', icon: '🔓', meaningBn: 'ইউজারনেম আর পাসওয়ার্ড দিয়ে নিজের অ্যাকাউন্টে ঢোকা।', module: 8 },
  { id: 'log-out', termBn: 'লগ আউট (বের হওয়া)', termEn: 'Log out', icon: '🚪', meaningBn: 'নিজের অ্যাকাউন্ট থেকে বেরিয়ে আসা। শেয়ার করা কম্পিউটারে কাজ শেষে অবশ্যই করবেন।', module: 8 },
  { id: 'verification-email', termBn: 'যাচাইয়ের ইমেইল', termEn: 'Verification email', icon: '✅', meaningBn: 'সাইন আপের পর সাইটের পাঠানো ইমেইল, যা নিশ্চিত করে ঠিকানাটি সত্যিই আপনার।', module: 8 },
  { id: 'recovery', termBn: 'উদ্ধারের ব্যবস্থা (রিকভারি)', termEn: 'Recovery', icon: '🛟', meaningBn: 'পাসওয়ার্ড ভুললে অ্যাকাউন্ট ফিরে পাওয়ার উপায়, যেমন ইমেইলে আসা লিংক বা ফোন নম্বর।', module: 8 },
  { id: 'otp', termBn: 'ওটিপি (এককালীন কোড)', termEn: 'OTP', icon: '🔢', art: 'otp-code', meaningBn: 'ফোনে বা ইমেইলে আসা একবারের কোড। কাউকে কখনো বলবেন না।', module: 8 },
]

export default entries
