import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'tool-code-editor', termBn: 'কোড এডিটর', termEn: 'Code Editor', meaningBn: 'কোড লেখার বিশেষ প্রোগ্রাম। রং দিয়ে কোড চেনায়, আর পাশে ফোল্ডার-তালিকা দেখায়।', icon: '📝', module: 18 },
  { id: 'tool-vscode', termBn: 'ভিএস কোড', termEn: 'VS Code (Visual Studio Code)', meaningBn: 'বিনামূল্যের জনপ্রিয় একটি কোড এডিটর। আমরা এটিকেই উদাহরণ নিচ্ছি।', icon: '💻', module: 18 },
  { id: 'tool-installer', termBn: 'ইনস্টলার', termEn: 'Installer', meaningBn: 'ছোট একটি ফাইল (.exe, .msi, .pkg, .dmg), যেটি খুললে প্রোগ্রাম কম্পিউটারে বসে।', icon: '📦', module: 18 },
  { id: 'tool-official-website', termBn: 'অফিসিয়াল ওয়েবসাইট', termEn: 'Official Website', meaningBn: 'যারা প্রোগ্রামটি বানিয়েছে তাদের নিজের সাইট। ঠিকানা অক্ষর ধরে মিলিয়ে নিন।', icon: '🌐', module: 18 },
  { id: 'tool-download', termBn: 'ডাউনলোড (প্রোগ্রাম নামানো)', termEn: 'Download', meaningBn: 'ইন্টারনেট থেকে ফাইল কম্পিউটারে নামানো। সাধারণত Downloads ফোল্ডারে জমা হয়।', icon: '⬇️', module: 18 },
  { id: 'tool-path', termBn: 'পাথ', termEn: 'PATH', meaningBn: 'কমান্ড কোথায় খুঁজতে হবে, কম্পিউটারের সেই তালিকা। (ফাইলের “পথ” নয়, আলাদা জিনিস।)', icon: '🧭', module: 18 },
  { id: 'tool-version', termBn: 'সংস্করণ', termEn: 'Version', meaningBn: 'প্রোগ্রামের কোন সংখ্যার রূপ বসানো, যেমন 3.12.4। --version লিখে দেখা যায়।', icon: '🔢', module: 18 },
  { id: 'tool-python', termBn: 'পাইথন', termEn: 'Python', meaningBn: 'শেখার জন্য সহজ প্রোগ্রামিং ভাষা। চালাতে Python ইনস্টল করা লাগে।', icon: '🐍', module: 18 },
  { id: 'tool-nodejs', termBn: 'নোড.জেএস', termEn: 'Node.js', meaningBn: 'ব্রাউজারের বাইরে কম্পিউটারেই জাভাস্ক্রিপ্ট চালানোর প্রোগ্রাম।', icon: '🟢', module: 18 },
  { id: 'tool-lts', termBn: 'এলটিএস (দীর্ঘমেয়াদি সমর্থিত সংস্করণ)', termEn: 'LTS (Long Term Support)', meaningBn: 'অনেক বছর ভুল সারানো আর নিরাপত্তার সাহায্য পায় যে স্থিতিশীল সংস্করণ। Node.js-এ এটি নিন।', icon: '🛡️', module: 18 },
  { id: 'tool-extension', termBn: 'এক্সটেনশন', termEn: 'Extension', meaningBn: 'এডিটরে যোগ করা বাড়তি সুবিধা। শুধু অফিসিয়াল মার্কেটপ্লেস থেকে, প্রকাশক দেখে নিন।', icon: '🧩', module: 18 },
  { id: 'tool-git', termBn: 'গিট', termEn: 'Git', meaningBn: 'কাজের “সেভ পয়েন্ট” রাখার প্রোগ্রাম। ভুল হলে আগের অবস্থায় ফেরা যায়।', icon: '🌿', module: 18 },
  { id: 'tool-github', termBn: 'গিটহাব', termEn: 'GitHub', meaningBn: 'ইন্টারনেটে কোড রাখা আর ভাগ করার সাইট। Git থেকে আলাদা জিনিস।', icon: '☁️', module: 18 },
  { id: 'tool-repository', termBn: 'রিপোজিটরি', termEn: 'Repository', meaningBn: 'একটি প্রজেক্টের সব ফাইল আর ইতিহাস রাখার ফোল্ডার। সংক্ষেপে “রেপো”।', icon: '🗂️', module: 18 },
  { id: 'tool-admin-password', termBn: 'অ্যাডমিন পাসওয়ার্ড', termEn: 'Administrator Password', meaningBn: 'ইনস্টলের মতো বড় কাজে কম্পিউটারের চাওয়া পাসওয়ার্ড বা “Yes”। নিজে শুরু করলে তবেই দিন।', icon: '🔑', module: 18 },
  { id: 'tool-coding-folder', termBn: 'কোডিং ফোল্ডার', termEn: 'Coding Folder', meaningBn: 'কোডের ফাইল গোছানোর ফোল্ডার, যেমন Documents/coding, তার ভেতরে html-css, python, javascript, projects।', icon: '📁', module: 18 },
]

export default entries
