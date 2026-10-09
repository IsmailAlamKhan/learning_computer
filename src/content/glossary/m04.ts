import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'file', termBn: 'ফাইল', termEn: 'File', icon: '📄', art: 'document', meaningBn: 'কম্পিউটারে জমানো একটি আলাদা জিনিস — চিঠি, ছবি বা গান। আলমারির কাগজের মতো।', module: 4 },
  { id: 'extension', termBn: 'এক্সটেনশন (ফাইলের নামের শেষ অংশ)', termEn: 'File Extension', icon: '🏷️', meaningBn: 'নামের শেষে ডটের (.) পরের অংশ, যেমন .txt, .jpg। বলে দেয় ফাইলটি কোন ধরনের।', module: 4 },
  { id: 'path', termBn: 'পথ', termEn: 'Path', icon: '🧭', art: 'path-map', meaningBn: 'ফাইল বা ফোল্ডার কম্পিউটারের ঠিক কোথায় আছে তার ঠিকানা — ফোল্ডারের নামগুলো পরপর লেখা।', module: 4 },
  { id: 'absolute-path', termBn: 'সম্পূর্ণ পথ', termEn: 'Absolute Path', icon: '🗺️', meaningBn: 'একদম শুরু (Windows-এ C:, Mac-এ /) থেকে লেখা পুরো ঠিকানা। যেখান থেকেই দেখুন, একই।', module: 4 },
  { id: 'relative-path', termBn: 'আপেক্ষিক পথ', termEn: 'Relative Path', icon: '📍', meaningBn: 'এখন যে ফোল্ডারে আছেন সেখান থেকে লেখা ঠিকানা — “আমার বাড়ি থেকে তিন বাড়ি পরে”-র মতো।', module: 4 },
  { id: 'drive', termBn: 'ড্রাইভ', termEn: 'Drive', icon: '💽', art: 'hard-drive', meaningBn: 'Windows-এ ফাইল জমানোর বড় ভাগ, নাম অক্ষর আর কোলন, যেমন C:। সাধারণত সব ফাইল C:-তে।', module: 4 },
  { id: 'root', termBn: 'রুট (সবার ওপরের ফোল্ডার)', termEn: 'Root', icon: '🌳', meaningBn: 'ডিস্কের সবচেয়ে ওপরের ফোল্ডার, যার ভেতরে বাকি সব। Windows-এ C:\\, Mac-এ একটি স্ল্যাশ ( / )।', module: 4 },
  { id: 'home-folder', termBn: 'হোম ফোল্ডার', termEn: 'Home Folder', icon: '🏠', meaningBn: 'আপনার নিজের সব ফাইলের বাড়ি: Windows-এ C:\\Users\\নাম, Mac-এ /Users/নাম। টার্মিনালে ~ লেখা হয়।', module: 4 },
  { id: 'parent-folder', termBn: 'ওপরের ফোল্ডার (প্যারেন্ট)', termEn: 'Parent Folder', icon: '⬆️', meaningBn: 'যে ফোল্ডারের ভেতরে আপনার ফোল্ডারটি আছে। পথে এক ধাপ ওপরের চিহ্ন দুই ডট ( .. )।', module: 4 },
  { id: 'documents-folder', termBn: 'ডকুমেন্টস ফোল্ডার', termEn: 'Documents', icon: '📁', meaningBn: 'লেখালেখি আর কাজের ফাইল রাখার সাধারণ জায়গা। এই কোর্সের প্রোগ্রামও এখানে রাখবেন।', module: 4 },
  { id: 'downloads-folder', termBn: 'ডাউনলোডস ফোল্ডার', termEn: 'Downloads', icon: '⬇️', art: 'download', meaningBn: 'ইন্টারনেট থেকে নামানো ফাইল এখানে জমা হয়। তাই প্রায়ই এলোমেলো হয়ে যায়।', module: 4 },
  { id: 'pictures-folder', termBn: 'পিকচার্স ফোল্ডার', termEn: 'Pictures', icon: '🖼️', art: 'image', meaningBn: 'ছবি রাখার সাধারণ জায়গা।', module: 4 },
  { id: 'desktop-folder', termBn: 'ডেস্কটপ ফোল্ডার', termEn: 'Desktop', icon: '🖥️', art: 'desktop', meaningBn: 'ডেস্কটপে যা যা দেখা যায়, আসলে সেগুলো এই ফোল্ডারের ভেতরের ফাইল ও ফোল্ডার।', module: 4 },
  { id: 'copy', termBn: 'কপি', termEn: 'Copy', icon: '📋', art: 'copy', meaningBn: 'ফাইলের হুবহু নকল বানানোর প্রস্তুতি; আসল থাকে। শর্টকাট: Ctrl+C (Mac-এ Cmd+C)।', module: 4 },
  { id: 'paste', termBn: 'পেস্ট', termEn: 'Paste', icon: '📥', art: 'paste', meaningBn: 'কপি বা কাট করা জিনিস নতুন জায়গায় বসানো। শর্টকাট: Ctrl+V (Mac-এ Cmd+V)।', module: 4 },
  { id: 'cut', termBn: 'কাট', termEn: 'Cut', icon: '✂️', art: 'scissors', meaningBn: 'ফাইল তুলে নেওয়া, পেস্ট করলে সরে যায়। Windows-এ Ctrl+X; Mac-এ Cmd+C, তারপর Option+Cmd+V।', module: 4 },
  { id: 'move', termBn: 'সরানো (মুভ)', termEn: 'Move', icon: '🚚', meaningBn: 'ফাইল এক ফোল্ডার থেকে তুলে অন্য ফোল্ডারে রাখা। ধরে টেনে ফোল্ডারের ওপর ছাড়লেও হয়।', module: 4 },
  { id: 'rename', termBn: 'নাম বদলানো', termEn: 'Rename', icon: '✏️', art: 'pencil', meaningBn: 'ফাইল বা ফোল্ডারের নাম পাল্টানো। Windows-এ F2, Mac-এ Return চাপুন।', module: 4 },
  { id: 'delete', termBn: 'মুছে ফেলা (ডিলিট)', termEn: 'Delete', icon: '🗑️', art: 'trash', meaningBn: 'ফাইলকে রিসাইকেল বিন বা ট্র্যাশে পাঠানো। তখনই চিরতরে যায় না, তাই ফেরানো যায়।', module: 4 },
  { id: 'restore', termBn: 'ফিরিয়ে আনা (রিস্টোর)', termEn: 'Restore', icon: '↩️', art: 'undo', meaningBn: 'বিন বা ট্র্যাশ থেকে মোছা ফাইল আগের জায়গায় ফেরানো। Windows-এ Restore, Mac-এ Put Back।', module: 4 },
  { id: 'recycle-bin', termBn: 'রিসাইকেল বিন / ট্র্যাশ', termEn: 'Recycle Bin / Trash', icon: '♻️', art: 'trash', meaningBn: 'মোছা ফাইলের অস্থায়ী ঝুড়ি (Mac-এ Trash)। খালি (Empty) করলে তবেই ফাইল চিরতরে যায়।', module: 4 },
  { id: 'search', termBn: 'খোঁজা (সার্চ)', termEn: 'Search', icon: '🔍', art: 'magnifier', meaningBn: 'নামের একটি অংশ লিখে ফাইল বের করা। ফাইল এক্সপ্লোরার বা ফাইন্ডারের ওপরের সার্চ বক্সে।', module: 4 },
  { id: 'hidden', termBn: 'লুকানো', termEn: 'Hidden', icon: '🙈', meaningBn: 'যা ইচ্ছে করে পর্দায় দেখানো হয় না। সেটিংস বদলালে দেখা যায়; এক্সটেনশনও লুকানো থাকতে পারে।', module: 4 },
  { id: 'explorer', termBn: 'ফাইল এক্সপ্লোরার', termEn: 'File Explorer', icon: '🗂️', meaningBn: 'Windows-এর ফাইল ও ফোল্ডার দেখার, সাজানোর প্রোগ্রাম।', module: 4 },
  { id: 'finder', termBn: 'ফাইন্ডার', termEn: 'Finder', icon: '🔎', meaningBn: 'Mac-এর ফাইল ও ফোল্ডার দেখার, সাজানোর প্রোগ্রাম।', module: 4 },
  { id: 'backslash', termBn: 'ব্যাকস্ল্যাশ ( \\ )', termEn: 'Backslash', icon: '\\', meaningBn: 'বাঁ দিকে হেলানো দাগ। Windows-এর পথে নামের মাঝে বসে, যেমন C:\\Users\\Anika।', module: 4 },
  { id: 'slash', termBn: 'স্ল্যাশ ( / )', termEn: 'Slash', icon: '/', meaningBn: 'ডান দিকে হেলানো দাগ। Mac-এর পথে ও ওয়েবসাইটের ঠিকানায় নামের মাঝে বসে, যেমন /Users/anika।', module: 4 },
]

export default entries
