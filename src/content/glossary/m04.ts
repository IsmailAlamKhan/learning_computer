import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'file', termBn: 'ফাইল', termEn: 'File', meaningBn: 'কম্পিউটারে জমানো একটি আলাদা জিনিস — যেমন একটি চিঠি, ছবি বা গান। কাগজের একটি ফাইলের মতো, যার একটি নাম থাকে।', module: 4 },
  { id: 'extension', termBn: 'এক্সটেনশন (ফাইলের নামের শেষ অংশ)', termEn: 'File Extension', meaningBn: 'ফাইলের নামের শেষে ডটের (.) পরের ছোট অংশ, যেমন .txt বা .jpg। এটি কম্পিউটারকে বলে দেয় ফাইলটি কোন প্রোগ্রামে খুলবে।', module: 4 },
  { id: 'path', termBn: 'পথ', termEn: 'Path', meaningBn: 'কোনো ফাইল বা ফোল্ডার কম্পিউটারের ঠিক কোথায় আছে তার ঠিকানা। যেমন বাড়ির ঠিকানা পাড়া-রাস্তা-বাড়ি ধরে ধরে লেখা হয়, তেমনি ফোল্ডারের নামগুলো পরপর লেখা হয়।', module: 4 },
  { id: 'absolute-path', termBn: 'সম্পূর্ণ পথ', termEn: 'Absolute Path', meaningBn: 'একদম শুরু (Windows-এ C: ড্রাইভ, Mac-এ /) থেকে লেখা পুরো ঠিকানা। এটি কম্পিউটারের যেখান থেকেই দেখুন, একই থাকে।', module: 4 },
  { id: 'relative-path', termBn: 'আপেক্ষিক পথ', termEn: 'Relative Path', meaningBn: 'এখন যে ফোল্ডারে আছেন সেখান থেকে লেখা ঠিকানা। যেমন “আমার বাড়ি থেকে তিন বাড়ি পরে”। বর্তমান ফোল্ডার বদলালে পথও বদলে যায়।', module: 4 },
  { id: 'drive', termBn: 'ড্রাইভ', termEn: 'Drive', meaningBn: 'Windows-এ সংরক্ষণের একটি বড় বিভাগ, যার নাম একটি অক্ষর ও কোলন দিয়ে লেখা হয়, যেমন C:। সাধারণত C: ড্রাইভেই সব ফাইল থাকে।', module: 4 },
  { id: 'root', termBn: 'রুট (সবার ওপরের ফোল্ডার)', termEn: 'Root', meaningBn: 'ডিস্কের সবচেয়ে ওপরের ফোল্ডার, যার ভেতরেই বাকি সব আছে। Windows-এ এটি C:\\ আর Mac-এ একটি স্ল্যাশ ( / )।', module: 4 },
  { id: 'home-folder', termBn: 'হোম ফোল্ডার', termEn: 'Home Folder', meaningBn: 'আপনার নিজের সব ফাইলের বাড়ি। Windows-এ C:\\Users\\আপনার-নাম, Mac-এ /Users/আপনার-নাম। Mac-এর টার্মিনালে এটিকে ~ চিহ্ন দিয়েও লেখা যায়।', module: 4 },
  { id: 'parent-folder', termBn: 'ওপরের ফোল্ডার (প্যারেন্ট)', termEn: 'Parent Folder', meaningBn: 'যে ফোল্ডারের ভেতরে আপনার ফোল্ডারটি আছে। পথে এক ধাপ ওপরে যাওয়ার চিহ্ন হলো দুটি ডট ( .. )।', module: 4 },
  { id: 'documents-folder', termBn: 'ডকুমেন্টস ফোল্ডার', termEn: 'Documents', meaningBn: 'লেখালেখি, চিঠি, তালিকা — নিজের কাজের ফাইল রাখার সাধারণ জায়গা।', module: 4 },
  { id: 'downloads-folder', termBn: 'ডাউনলোডস ফোল্ডার', termEn: 'Downloads', meaningBn: 'ইন্টারনেট থেকে নামানো (ডাউনলোড করা) ফাইল সাধারণত এখানে জমা হয়। তাই এটি প্রায়ই এলোমেলো হয়ে যায়।', module: 4 },
  { id: 'pictures-folder', termBn: 'পিকচার্স ফোল্ডার', termEn: 'Pictures', meaningBn: 'ছবি রাখার সাধারণ জায়গা।', module: 4 },
  { id: 'desktop-folder', termBn: 'ডেস্কটপ ফোল্ডার', termEn: 'Desktop', meaningBn: 'ডেস্কটপে যা যা দেখা যায়, আসলে সেগুলো এই ফোল্ডারের ভেতরের ফাইল ও ফোল্ডার।', module: 4 },
  { id: 'copy', termBn: 'কপি', termEn: 'Copy', meaningBn: 'কোনো ফাইলের হুবহু একটি নকল তৈরির প্রস্তুতি। আসল ফাইলটি জায়গাতেই থাকে। শর্টকাট: Ctrl+C (Mac-এ Cmd+C)।', module: 4 },
  { id: 'paste', termBn: 'পেস্ট', termEn: 'Paste', meaningBn: 'কপি বা কাট করা জিনিসটি নতুন জায়গায় বসানো। শর্টকাট: Ctrl+V (Mac-এ Cmd+V)।', module: 4 },
  { id: 'cut', termBn: 'কাট', termEn: 'Cut', meaningBn: 'ফাইলটি তুলে নেওয়ার প্রস্তুতি, যাতে অন্য জায়গায় পেস্ট করলে সেটি সেখানে সরে যায়। শর্টকাট: Ctrl+X (Windows)। Mac-এ Finder-এ ফাইল সরাতে Cmd+C করে Option+Cmd+V চাপতে হয়।', module: 4 },
  { id: 'move', termBn: 'সরানো (মুভ)', termEn: 'Move', meaningBn: 'ফাইল বা ফোল্ডারকে এক জায়গা থেকে তুলে অন্য ফোল্ডারে রাখা। ধরে টেনে (ড্র্যাগ করে) ফোল্ডারের ওপর ছেড়ে দিলেও হয়।', module: 4 },
  { id: 'rename', termBn: 'নাম বদলানো', termEn: 'Rename', meaningBn: 'ফাইল বা ফোল্ডারের নাম পাল্টানো। Windows-এ F2 চাপলে, Mac-এ Return চাপলে নাম বদলানো যায়।', module: 4 },
  { id: 'delete', termBn: 'মুছে ফেলা (ডিলিট)', termEn: 'Delete', meaningBn: 'ফাইলকে রিসাইকেল বিন বা ট্র্যাশে পাঠানো। এটি তখনই চিরতরে মোছা হয় না — তাই ফিরিয়ে আনা যায়।', module: 4 },
  { id: 'restore', termBn: 'ফিরিয়ে আনা (রিস্টোর)', termEn: 'Restore', meaningBn: 'রিসাইকেল বিন বা ট্র্যাশ থেকে মুছে ফেলা ফাইল আগের জায়গায় ফেরত আনা। Windows-এ Restore, Mac-এ Put Back।', module: 4 },
  { id: 'recycle-bin', termBn: 'রিসাইকেল বিন / ট্র্যাশ', termEn: 'Recycle Bin / Trash', meaningBn: 'মুছে ফেলা ফাইলের অস্থায়ী ঝুড়ি। Windows-এ নাম Recycle Bin, Mac-এ Trash। খালি (Empty) করলে তবেই ফাইল চিরতরে যায়।', module: 4 },
  { id: 'search', termBn: 'খোঁজা (সার্চ)', termEn: 'Search', meaningBn: 'ফাইলের নামের একটি অংশ লিখে সেটি খুঁজে বের করা। ফাইল এক্সপ্লোরার বা ফাইন্ডারের ওপরের সার্চ বক্স এর জন্য।', module: 4 },
  { id: 'hidden', termBn: 'লুকানো', termEn: 'Hidden', meaningBn: 'যে ফাইল বা ফোল্ডার ইচ্ছে করে পর্দায় দেখানো হয় না। সেটিংস বদলালে দেখা যায়। ফাইলের এক্সটেনশনও প্রথমে লুকানো থাকতে পারে।', module: 4 },
  { id: 'explorer', termBn: 'ফাইল এক্সপ্লোরার', termEn: 'File Explorer', meaningBn: 'Windows-এর ফাইল ও ফোল্ডার দেখার, সাজানোর প্রোগ্রাম।', module: 4 },
  { id: 'finder', termBn: 'ফাইন্ডার', termEn: 'Finder', meaningBn: 'Mac-এর ফাইল ও ফোল্ডার দেখার, সাজানোর প্রোগ্রাম।', module: 4 },
  { id: 'backslash', termBn: 'ব্যাকস্ল্যাশ ( \\ )', termEn: 'Backslash', meaningBn: 'বাঁ দিকে হেলানো দাগ। Windows-এর পথে ফোল্ডারের নামের মাঝখানে এটি বসে, যেমন C:\\Users\\Anika।', module: 4 },
  { id: 'slash', termBn: 'স্ল্যাশ ( / )', termEn: 'Slash', meaningBn: 'ডান দিকে হেলানো দাগ। Mac-এর পথে (এবং ওয়েবসাইটের ঠিকানায়) ফোল্ডারের নামের মাঝখানে বসে, যেমন /Users/anika।', module: 4 },
]

export default entries
