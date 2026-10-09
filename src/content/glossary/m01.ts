import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'computer', termBn: 'কম্পিউটার', termEn: 'Computer', icon: '💻', art: 'laptop', meaningBn: 'নির্দেশ মেনে লেখা, হিসাব, ছবি, গান-ভিডিওর কাজ করে দেওয়া যন্ত্র।', module: 1 },
  { id: 'hardware', termBn: 'হার্ডওয়্যার', termEn: 'Hardware', icon: '🔧', meaningBn: 'কম্পিউটারের হাতে ছোঁয়া যায় এমন অংশ — পর্দা, কিবোর্ড, মাউস, চার্জার।', module: 1 },
  { id: 'monitor', termBn: 'মনিটর (পর্দা)', termEn: 'Monitor / Screen', icon: '🖥️', art: 'monitor', meaningBn: 'যে পর্দায় কম্পিউটারের সবকিছু দেখা যায়। ল্যাপটপে এটি শরীরেই লাগানো।', module: 1 },
  { id: 'keyboard', termBn: 'কিবোর্ড', termEn: 'Keyboard', icon: '⌨️', art: 'keyboard', meaningBn: 'অক্ষর, সংখ্যা ও চিহ্ন লেখার কী-এর সারি।', module: 1 },
  { id: 'mouse', termBn: 'মাউস', termEn: 'Mouse', icon: '🖱️', art: 'mouse', meaningBn: 'হাতে ধরে নাড়ানোর যন্ত্র। নাড়ালে পর্দার তীর নড়ে।', module: 1 },
  { id: 'touchpad', termBn: 'টাচপ্যাড', termEn: 'Touchpad', icon: '👆', art: 'touchpad', meaningBn: 'ল্যাপটপের মসৃণ জায়গা। আঙুল বুলিয়ে তীর নাড়ানো আর টোকা দিয়ে ক্লিক করা যায়।', module: 1 },
  { id: 'cpu', termBn: 'সিপিইউ (কম্পিউটারের মস্তিষ্ক)', termEn: 'CPU', icon: '🧠', art: 'chip', meaningBn: 'ভেতরের যে অংশ সব হিসাব আর নির্দেশের কাজ করে।', module: 1 },
  { id: 'ram', termBn: 'র‍্যাম (অল্পক্ষণের স্মৃতি)', termEn: 'RAM', icon: '⚡', art: 'ram-stick', meaningBn: 'এখন চলতে থাকা কাজ অল্প সময় মনে রাখার জায়গা। বন্ধ করলে মুছে যায়।', module: 1 },
  { id: 'battery', termBn: 'ব্যাটারি', termEn: 'Battery', icon: '🔋', art: 'battery', meaningBn: 'ল্যাপটপের ভেতরে বিদ্যুৎ জমানোর অংশ। চার্জার ছাড়াও কিছুক্ষণ চালায়।', module: 1 },
  { id: 'charger', termBn: 'চার্জার', termEn: 'Charger', icon: '🔌', art: 'charger', meaningBn: 'সকেট থেকে বিদ্যুৎ এনে ল্যাপটপ চালায় আর ব্যাটারি ভরে।', module: 1 },
  { id: 'usb-port', termBn: 'ইউএসবি পোর্ট', termEn: 'USB Port', icon: '🔗', art: 'usb-stick', meaningBn: 'পেনড্রাইভ, মাউস বা ফোনের তার লাগানোর ছোট আয়তাকার গর্ত।', module: 1 },
  { id: 'wifi', termBn: 'ওয়াই-ফাই', termEn: 'Wi‑Fi', icon: '📶', art: 'wifi', meaningBn: 'তার ছাড়া ইন্টারনেটে যুক্ত হওয়ার ব্যবস্থা। রাউটার থেকে সংকেত আসে।', module: 1 },
  { id: 'shut-down', termBn: 'শাট ডাউন (বন্ধ করা)', termEn: 'Shut down', icon: '⏻', art: 'power', meaningBn: 'কম্পিউটার নিরাপদে পুরো বন্ধ করা। কাজ বা ফাইলের ক্ষতি হয় না।', module: 1 },
  { id: 'restart', termBn: 'রিস্টার্ট (আবার চালু)', termEn: 'Restart', icon: '🔄', art: 'refresh', meaningBn: 'কম্পিউটার বন্ধ করে সাথে সাথে আবার চালু করা। আটকে গেলে কাজে লাগে।', module: 1 },
  { id: 'sleep', termBn: 'স্লিপ (ঘুম)', termEn: 'Sleep', icon: '😴', art: 'moon', meaningBn: 'কাজ খোলা রেখে কম্পিউটারের অল্প বিশ্রাম। কী চাপলেই জেগে ওঠে।', module: 1 },
  { id: 'power-button', termBn: 'পাওয়ার বাটন', termEn: 'Power button', icon: '⏻', art: 'power-button', meaningBn: 'কম্পিউটার চালু করার বোতাম। বন্ধ করতে মেনু থেকে Shut down বাছুন।', module: 1 },
  { id: 'scroll', termBn: 'স্ক্রল', termEn: 'Scroll', icon: '↕️', meaningBn: 'লম্বা পাতা ওপর-নিচ সরানো। টাচপ্যাডে দুই আঙুলে, মাউসে চাকায়।', module: 1 },
  { id: 'pinch', termBn: 'পিঞ্চ (দুই আঙুলে জুম)', termEn: 'Pinch', icon: '🔍', art: 'magnifier', meaningBn: 'টাচপ্যাডে দুই আঙুল ফাঁক করলে বড়, কাছে আনলে ছোট হয়।', module: 1 },
  { id: 'gesture', termBn: 'জেসচার (আঙুলের ভঙ্গি)', termEn: 'Gesture', icon: '🤌', art: 'hand-click', meaningBn: 'টাচপ্যাডে বিশেষ কাজের আঙুলের ধরন — ট্যাপ, দুই আঙুলে স্ক্রল, পিঞ্চ।', module: 1 },
]

export default entries
