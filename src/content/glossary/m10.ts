import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'set-settings', module: 10, termBn: 'সেটিংস', termEn: 'Settings', icon: '⚙️', art: 'gear', meaningBn: 'কম্পিউটারের “কন্ট্রোল রুম” — আওয়াজ, আলো, ওয়াই-ফাই, ছবি সব এখানে বদলায়।' },
  { id: 'set-wallpaper', module: 10, termBn: 'ওয়ালপেপার', termEn: 'Wallpaper / Background', icon: '🖼️', art: 'image', meaningBn: 'ডেস্কটপের পেছনের ছবি। বদলালে শুধু ছবি বদলায়, ফাইল নয়।' },
  { id: 'set-brightness', module: 10, termBn: 'উজ্জ্বলতা', termEn: 'Brightness', icon: '🔆', art: 'sun', meaningBn: 'পর্দার আলো কতটা জোরালো হবে। অন্ধকার ঘরে কমালে চোখে আরাম।' },
  { id: 'set-volume', module: 10, termBn: 'আওয়াজ', termEn: 'Volume', icon: '🔊', art: 'volume', meaningBn: 'স্পিকার বা হেডফোনের শব্দ কতটা জোরে হবে। স্লাইডার ডানে টানলে বাড়ে।' },
  { id: 'set-mute', module: 10, termBn: 'মিউট (আওয়াজ বন্ধ)', termEn: 'Mute', icon: '🔇', meaningBn: 'আওয়াজ একদম বন্ধ করা। আবার চালালে আগের আওয়াজ ফিরে আসে।' },
  { id: 'set-wifi', module: 10, termBn: 'ওয়াই-ফাই', termEn: 'Wi‑Fi', icon: '📶', art: 'wifi', meaningBn: 'তার ছাড়া ইন্টারনেটে যুক্ত হওয়ার ব্যবস্থা। বাসার রাউটার থেকে আসে।' },
  { id: 'set-network', module: 10, termBn: 'নেটওয়ার্ক', termEn: 'Network', icon: '🌐', meaningBn: 'কয়েকটি যন্ত্র একসাথে যুক্ত থাকার জাল, যেমন বাসার ওয়াই-ফাই।' },
  { id: 'set-wifi-password', module: 10, termBn: 'ওয়াই-ফাই পাসওয়ার্ড', termEn: 'Wi‑Fi password (network security key)', icon: '🔑', art: 'key', meaningBn: 'ওয়াই-ফাইয়ের দরজার চাবি। শুধু পরিচিতদের সাথে ভাগ করুন।' },
  { id: 'set-bluetooth', module: 10, termBn: 'ব্লুটুথ', termEn: 'Bluetooth', icon: '🎧', art: 'bluetooth', meaningBn: 'কাছের স্পিকার, হেডফোন, কিবোর্ডকে তার ছাড়া কম্পিউটারের সাথে জোড়ার ব্যবস্থা।' },
  { id: 'set-pairing', module: 10, termBn: 'পেয়ার করা (জোড়া লাগানো)', termEn: 'Pairing', icon: '🤝', meaningBn: 'দুটি ব্লুটুথ যন্ত্রের প্রথমবার পরিচয় করানো। এরপর নিজেরাই যুক্ত হয়।' },
  { id: 'set-printer', module: 10, termBn: 'প্রিন্টার', termEn: 'Printer', icon: '🖨️', art: 'printer', meaningBn: 'লেখা বা ছবি কাগজে ছেপে দেওয়ার যন্ত্র। আগে সেটিংসে যোগ করতে হয়।' },
  { id: 'set-timezone', module: 10, termBn: 'টাইমজোন', termEn: 'Time zone', icon: '🕒', art: 'clock', meaningBn: 'ঘড়িতে কোন অঞ্চলের সময় দেখাবে। বাংলাদেশের জন্য Dhaka (UTC+6)।' },
  { id: 'set-display', module: 10, termBn: 'ডিসপ্লে (পর্দা)', termEn: 'Display', icon: '🖥️', art: 'monitor', meaningBn: 'কম্পিউটারের পর্দা। এর সেটিংসে আলো আর লেখা-আইকনের আকার বদলায়।' },
  { id: 'set-zoom', module: 10, termBn: 'জুম / স্কেল', termEn: 'Zoom / Scale', icon: '🔍', meaningBn: 'পর্দার লেখা, আইকন, বোতাম একসাথে বড় বা ছোট করা। ১০০% মানে স্বাভাবিক।' },
  { id: 'set-text-size', module: 10, termBn: 'লেখার আকার', termEn: 'Text size', icon: '🔠', art: 'text-size', meaningBn: 'শুধু লেখাগুলো বড় বা ছোট করা। ছোট লেখা পড়তে কষ্ট হলে কাজে লাগে।' },
  { id: 'set-dark-mode', module: 10, termBn: 'ডার্ক মোড', termEn: 'Dark mode', icon: '🌙', art: 'moon', meaningBn: 'সাদা জায়গা কালচে করা সাজ। রাতে আরাম লাগে; পছন্দ না হলে Light-এ ফিরুন।' },
  { id: 'set-language', module: 10, termBn: 'ভাষা', termEn: 'Language', icon: '🔤', art: 'language', meaningBn: 'মেনু ও বার্তা কোন ভাষায় দেখাবে, আর কোন ভাষায় লেখা যাবে — সেই সেটিং।' },
  { id: 'set-accessibility', module: 10, termBn: 'অ্যাক্সেসিবিলিটি (সহজে ব্যবহারের সুবিধা)', termEn: 'Accessibility', icon: '♿', meaningBn: 'চোখ, কান বা হাতের অসুবিধায় কম্পিউটার সহজ করার সেটিং।' },
]

export default entries
