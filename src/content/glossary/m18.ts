import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'tool-code-editor', termBn: 'কোড এডিটর', termEn: 'Code Editor', meaningBn: 'কোড লেখার বিশেষ প্রোগ্রাম। নোটপ্যাডের মতো লেখা যায়, তবে রং দিয়ে কোড আলাদা করে দেখায়, লাইনের ফাঁক ঠিক রাখে আর পাশে ফাইল-ফোল্ডারের তালিকা দেখায়।', module: 18 },
  { id: 'tool-vscode', termBn: 'ভিএস কোড', termEn: 'VS Code (Visual Studio Code)', meaningBn: 'বিনামূল্যের একটি জনপ্রিয় কোড এডিটর। আরও অনেক এডিটর আছে; আমরা এটিকেই উদাহরণ হিসেবে নিচ্ছি।', module: 18 },
  { id: 'tool-installer', termBn: 'ইনস্টলার', termEn: 'Installer', meaningBn: 'ডাউনলোড করা ছোট একটি ফাইল (যেমন .exe, .msi, .pkg, .dmg), যেটি খুললে একটি প্রোগ্রাম আপনার কম্পিউটারে বসে যায়।', module: 18 },
  { id: 'tool-official-website', termBn: 'অফিসিয়াল ওয়েবসাইট', termEn: 'Official Website', meaningBn: 'যারা প্রোগ্রামটি বানিয়েছে তাদের নিজেদের ওয়েবসাইট। ডাউনলোডের আগে ঠিকানাটি অক্ষর ধরে ধরে মিলিয়ে নিতে হয়, কারণ নকল সাইটের ঠিকানা প্রায় একই রকম দেখায়।', module: 18 },
  { id: 'tool-download', termBn: 'ডাউনলোড (প্রোগ্রাম নামানো)', termEn: 'Download', meaningBn: 'ইন্টারনেট থেকে কোনো ফাইল নিজের কম্পিউটারে নামিয়ে আনা। সাধারণত তা Downloads ফোল্ডারে জমা হয়।', module: 18 },
  { id: 'tool-path', termBn: 'পাথ', termEn: 'PATH', meaningBn: 'কম্পিউটারের একটি তালিকা, যাতে লেখা থাকে টার্মিনালে কোনো কমান্ড লিখলে প্রোগ্রামটি কোথায় খুঁজতে হবে। (এটি ফাইলের “পথ” নয়, আলাদা জিনিস।) Python-এর ইনস্টলারে “Add python.exe to PATH” টিক দিলে টার্মিনাল python কমান্ডটি চিনতে পারে।', module: 18 },
  { id: 'tool-version', termBn: 'সংস্করণ', termEn: 'Version', meaningBn: 'প্রোগ্রামের কোন সংখ্যার রূপ বসানো আছে, যেমন 3.12.4। টার্মিনালে --version লিখলে এটি দেখা যায়, আর দেখা গেলেই বোঝা যায় ইনস্টল ঠিক হয়েছে।', module: 18 },
  { id: 'tool-python', termBn: 'পাইথন', termEn: 'Python', meaningBn: 'শেখার জন্য সহজ একটি প্রোগ্রামিং ভাষা, যা দিয়ে হিসাব, গেম, ডেটার কাজ — অনেক কিছু করা যায়। কম্পিউটারে চালাতে Python ইনস্টল করা লাগে।', module: 18 },
  { id: 'tool-nodejs', termBn: 'নোড.জেএস', termEn: 'Node.js', meaningBn: 'ব্রাউজারের বাইরে কম্পিউটারেই জাভাস্ক্রিপ্ট চালানোর প্রোগ্রাম। ইনস্টল করলে টার্মিনালে node কমান্ড কাজ করে।', module: 18 },
  { id: 'tool-lts', termBn: 'এলটিএস (দীর্ঘমেয়াদি সমর্থিত সংস্করণ)', termEn: 'LTS (Long Term Support)', meaningBn: 'যে সংস্করণ অনেক বছর ধরে ভুল সারানো আর নিরাপত্তার সাহায্য পায়। শিক্ষার্থীর জন্য সবচেয়ে স্থিতিশীল, তাই Node.js-এ LTS নেওয়াই ভালো।', module: 18 },
  { id: 'tool-extension', termBn: 'এক্সটেনশন', termEn: 'Extension', meaningBn: 'এডিটরে যোগ করা যায় এমন অতিরিক্ত সুবিধা, যেমন Python-এর সাহায্য বা ওয়েবপেজের প্রিভিউ। শুধু অফিসিয়াল মার্কেটপ্লেস থেকে, বেশি ইনস্টল-সংখ্যা আর ঠিক প্রকাশক দেখে ইনস্টল করুন।', module: 18 },
  { id: 'tool-git', termBn: 'গিট', termEn: 'Git', meaningBn: 'কাজের “সেভ পয়েন্ট” জমিয়ে রাখার প্রোগ্রাম। ভুল হলে আগের কোনো অবস্থায় ফিরে যাওয়া যায়। এখনই ইনস্টল করা জরুরি নয়, পরে লাগবে।', module: 18 },
  { id: 'tool-github', termBn: 'গিটহাব', termEn: 'GitHub', meaningBn: 'ইন্টারনেটে কোড জমা রাখার আর অন্যের সাথে ভাগ করার ওয়েবসাইট। বিনামূল্যের অ্যাকাউন্টের জন্য ইমেইল লাগে (মডিউল ৮-এর মতো)। Git আর GitHub আলাদা জিনিস।', module: 18 },
  { id: 'tool-repository', termBn: 'রিপোজিটরি', termEn: 'Repository', meaningBn: 'একটি প্রজেক্টের সব ফাইল আর তার সেভ পয়েন্টের ইতিহাস রাখার ফোল্ডার। সংক্ষেপে “রেপো”।', module: 18 },
  { id: 'tool-admin-password', termBn: 'অ্যাডমিন পাসওয়ার্ড', termEn: 'Administrator Password', meaningBn: 'প্রোগ্রাম ইনস্টলের মতো বড় কাজের অনুমতি দিতে কম্পিউটার যে পাসওয়ার্ড (বা Windows-এ “Yes” অনুমতি) চায়। নিজে ইনস্টল শুরু করলেই এটি আসার কথা; হঠাৎ নিজে থেকে এলে সাবধান।', module: 18 },
  { id: 'tool-coding-folder', termBn: 'কোডিং ফোল্ডার', termEn: 'Coding Folder', meaningBn: 'নিজের কোডের ফাইল গুছিয়ে রাখার একটি ফোল্ডার, যেমন Documents/coding, তার ভেতরে html-css, python, javascript, projects।', module: 18 },
]

export default entries
