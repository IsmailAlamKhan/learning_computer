import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'set-settings', module: 10, termBn: 'সেটিংস', termEn: 'Settings', meaningBn: 'কম্পিউটারের “নিয়ন্ত্রণ ঘর”। আওয়াজ, আলো, ওয়াই-ফাই, ছবি, সময় — সবকিছু নিজের মতো ঠিক করার জায়গা। Mac-এ নাম System Settings।' },
  { id: 'set-wallpaper', module: 10, termBn: 'ওয়ালপেপার', termEn: 'Wallpaper / Background', meaningBn: 'ডেস্কটপের পেছনে থাকা ছবি। ঘরের দেয়ালে পছন্দের ছবি টাঙানোর মতো, বদলালে কম্পিউটারের কাজে কোনো ক্ষতি হয় না। Windows-এ নাম Background, Mac-এ Wallpaper।' },
  { id: 'set-brightness', module: 10, termBn: 'উজ্জ্বলতা', termEn: 'Brightness', meaningBn: 'পর্দার আলো কতটা জোরালো হবে। চোখে চাপ লাগলে বা রোদে দেখতে না পেলে এটি কমান বা বাড়ান।' },
  { id: 'set-volume', module: 10, termBn: 'আওয়াজ', termEn: 'Volume', meaningBn: 'স্পিকার বা হেডফোনের শব্দ কতটা জোরে হবে। স্লাইডার ডানে টানলে বাড়ে, বাঁয়ে টানলে কমে।' },
  { id: 'set-mute', module: 10, termBn: 'মিউট (আওয়াজ বন্ধ)', termEn: 'Mute', meaningBn: 'আওয়াজ একদম বন্ধ করে দেওয়া। আবার চালু করলে আগের আওয়াজেই ফিরে আসে।' },
  { id: 'set-wifi', module: 10, termBn: 'ওয়াই-ফাই', termEn: 'Wi‑Fi', meaningBn: 'তার ছাড়া ইন্টারনেটে যুক্ত হওয়ার ব্যবস্থা। বাসার রাউটার থেকে সংকেত ধরে কম্পিউটার নেটওয়ার্কে ঢোকে।' },
  { id: 'set-network', module: 10, termBn: 'নেটওয়ার্ক', termEn: 'Network', meaningBn: 'কয়েকটি যন্ত্র একসাথে যুক্ত থাকার জাল, যেমন বাসার ওয়াই-ফাই। প্রতিটি ওয়াই-ফাই নেটওয়ার্কের একটি নাম থাকে (যেমন HomeWiFi)।' },
  { id: 'set-wifi-password', module: 10, termBn: 'ওয়াই-ফাই পাসওয়ার্ড', termEn: 'Wi‑Fi password (network security key)', meaningBn: 'ওয়াই-ফাইয়ের দরজার চাবি। তালা দেওয়া (Secured) নেটওয়ার্কে ঢুকতে লাগে। বড় হাতের আর ছোট হাতের অক্ষর আলাদা ধরা হয়।' },
  { id: 'set-bluetooth', module: 10, termBn: 'ব্লুটুথ', termEn: 'Bluetooth', meaningBn: 'কাছাকাছি যন্ত্র (স্পিকার, হেডফোন, কিবোর্ড) তার ছাড়া জুড়ে নেওয়ার ব্যবস্থা। ওয়াই-ফাইয়ের চেয়ে কম দূরত্বে কাজ করে।' },
  { id: 'set-pairing', module: 10, termBn: 'পেয়ার করা (জোড়া লাগানো)', termEn: 'Pairing', meaningBn: 'দুটি ব্লুটুথ যন্ত্রের প্রথমবার পরিচয় করানো। একবার পেয়ার হলে পরের বার কাছে এলেই নিজে থেকে যুক্ত হয়।' },
  { id: 'set-printer', module: 10, termBn: 'প্রিন্টার', termEn: 'Printer', meaningBn: 'কম্পিউটারের লেখা বা ছবি কাগজে ছেপে দেওয়ার যন্ত্র। ব্যবহারের আগে কম্পিউটারে একবার “যোগ” (Add) করে নিতে হয়।' },
  { id: 'set-timezone', module: 10, termBn: 'টাইমজোন', termEn: 'Time zone', meaningBn: 'কোন দেশ বা অঞ্চলের সময় ঘড়িতে দেখাবে তার সেটিং। বাংলাদেশের জন্য Dhaka (UTC+6)। ভুল হলে ঘড়ি ঘণ্টা-ঘণ্টা আগে বা পরে দেখায়।' },
  { id: 'set-display', module: 10, termBn: 'ডিসপ্লে (পর্দা)', termEn: 'Display', meaningBn: 'কম্পিউটারের পর্দা। এর সেটিংসে আলো, লেখা-আইকনের আকার ইত্যাদি ঠিক করা যায়। Mac-এ নাম Displays।' },
  { id: 'set-zoom', module: 10, termBn: 'জুম / স্কেল', termEn: 'Zoom / Scale', meaningBn: 'পর্দার সবকিছু (লেখা, আইকন, বোতাম) একসাথে বড় বা ছোট করা। শতকরায় লেখা হয়: ১০০% স্বাভাবিক, ১৫০% দেড় গুণ বড়। Windows-এ নাম Scale।' },
  { id: 'set-text-size', module: 10, termBn: 'লেখার আকার', termEn: 'Text size', meaningBn: 'শুধু লেখাগুলো বড় বা ছোট করা। চোখে কম দেখলে বা পর্দা ছোট লাগলে এটি সাহায্য করে। Accessibility বিভাগে থাকে।' },
  { id: 'set-dark-mode', module: 10, termBn: 'ডার্ক মোড', termEn: 'Dark mode', meaningBn: 'সাদা জায়গা কালচে করে দেওয়া সাজ। রাতে বা অন্ধকার ঘরে চোখে আরাম লাগে। চাইলে আবার Light মোডে ফেরা যায়।' },
  { id: 'set-language', module: 10, termBn: 'ভাষা', termEn: 'Language', meaningBn: 'কম্পিউটারের মেনু ও বার্তা কোন ভাষায় দেখাবে, আর কোন ভাষায় টাইপ করা যাবে। কিবোর্ডের ভাষা যোগ করার পদ্ধতি ৫ নম্বর পাঠে শিখেছেন।' },
  { id: 'set-accessibility', module: 10, termBn: 'অ্যাক্সেসিবিলিটি (সহজে ব্যবহারের সুবিধা)', termEn: 'Accessibility', meaningBn: 'যাঁদের চোখে, কানে বা হাতে অসুবিধা আছে — তাঁদের জন্য, আর যে কেউ আরাম চাইলে: বড় লেখা, বেশি কনট্রাস্ট, কথা শুনে লেখা ইত্যাদির সেটিংস।' },
]

export default entries
