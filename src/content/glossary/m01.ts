import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'computer', termBn: 'কম্পিউটার', termEn: 'Computer', meaningBn: 'যে যন্ত্র আমাদের দেওয়া নির্দেশ মেনে হিসাব, লেখা, ছবি, গান-ভিডিও এবং আরও অনেক কাজ করে দেয়।', module: 1 },
  { id: 'hardware', termBn: 'হার্ডওয়্যার', termEn: 'Hardware', meaningBn: 'কম্পিউটারের যেসব অংশ হাতে ধরা বা ছোঁয়া যায় — যেমন পর্দা, কিবোর্ড, মাউস, চার্জার।', module: 1 },
  { id: 'monitor', termBn: 'মনিটর (পর্দা)', termEn: 'Monitor / Screen', meaningBn: 'কম্পিউটার যা দেখাচ্ছে তা যে পর্দায় দেখা যায়। ল্যাপটপে পর্দা শরীরের সাথেই লাগানো থাকে।', module: 1 },
  { id: 'keyboard', termBn: 'কিবোর্ড', termEn: 'Keyboard', meaningBn: 'অক্ষর, সংখ্যা ও চিহ্ন লেখার কী-এর সারি।', module: 1 },
  { id: 'mouse', termBn: 'মাউস', termEn: 'Mouse', meaningBn: 'হাতে ধরে নাড়াচাড়া করার যন্ত্র। এটি নাড়ালে পর্দার তীর চিহ্নটিও নড়ে। ল্যাপটপে মাউসের কাজ করে টাচপ্যাড।', module: 1 },
  { id: 'touchpad', termBn: 'টাচপ্যাড', termEn: 'Touchpad', meaningBn: 'ল্যাপটপের কিবোর্ডের নিচের মসৃণ জায়গা। এর ওপর আঙুল বুলিয়ে তীর নাড়ানো যায় আর টোকা দিয়ে ক্লিক করা যায়।', module: 1 },
  { id: 'cpu', termBn: 'সিপিইউ (কম্পিউটারের মস্তিষ্ক)', termEn: 'CPU', meaningBn: 'কম্পিউটারের ভেতরের যে অংশ সব হিসাব আর নির্দেশের কাজ করে। একে কম্পিউটারের মস্তিষ্ক বলা যায়।', module: 1 },
  { id: 'ram', termBn: 'র‍্যাম (অল্পক্ষণের স্মৃতি)', termEn: 'RAM', meaningBn: 'এখন যে কাজ চলছে তা সাময়িকভাবে মনে রাখার জায়গা। কম্পিউটার বন্ধ করলে এর স্মৃতি মুছে যায়। পরে বিস্তারিত শিখবেন।', module: 1 },
  { id: 'battery', termBn: 'ব্যাটারি', termEn: 'Battery', meaningBn: 'ল্যাপটপের ভেতরের যে অংশে বিদ্যুৎ জমা থাকে। চার্জার না লাগিয়েও এর জোরে ল্যাপটপ কিছুক্ষণ চলে।', module: 1 },
  { id: 'charger', termBn: 'চার্জার', termEn: 'Charger', meaningBn: 'দেয়ালের সকেট থেকে বিদ্যুৎ এনে ল্যাপটপ চালায় আর ব্যাটারি ভরে।', module: 1 },
  { id: 'usb-port', termBn: 'ইউএসবি পোর্ট', termEn: 'USB Port', meaningBn: 'পেনড্রাইভ, মাউস বা ফোনের তার লাগানোর ছোট আয়তাকার গর্ত।', module: 1 },
  { id: 'wifi', termBn: 'ওয়াই-ফাই', termEn: 'Wi‑Fi', meaningBn: 'তার ছাড়া ইন্টারনেটে যুক্ত হওয়ার ব্যবস্থা। বাসার রাউটার থেকে সংকেত ধরে কম্পিউটার ইন্টারনেট পায়।', module: 1 },
  { id: 'shut-down', termBn: 'শাট ডাউন (বন্ধ করা)', termEn: 'Shut down', meaningBn: 'কম্পিউটার নিরাপদে পুরোপুরি বন্ধ করা। এতে সব চালু প্রোগ্রাম গুছিয়ে বন্ধ হয়, তাই কাজ বা ফাইলের ক্ষতি হয় না।', module: 1 },
  { id: 'restart', termBn: 'রিস্টার্ট (আবার চালু)', termEn: 'Restart', meaningBn: 'কম্পিউটার বন্ধ করে সাথে সাথে আবার চালু করা। কিছু আটকে গেলে বা নতুন কিছু বসানোর পরে এটি লাগে।', module: 1 },
  { id: 'sleep', termBn: 'স্লিপ (ঘুম)', termEn: 'Sleep', meaningBn: 'কাজ খোলা রেখেই কম্পিউটারকে অল্প বিদ্যুতে বিশ্রামে পাঠানো। কিছুক্ষণ পরে ফিরে এলে কিবোর্ডে চাপ দিলে বা ক্লিক করলে আগের মতোই পাওয়া যায়।', module: 1 },
  { id: 'power-button', termBn: 'পাওয়ার বাটন', termEn: 'Power button', meaningBn: 'কম্পিউটার চালু করার বোতাম। বন্ধ করার জন্য সাধারণ সময়ে এটি চেপে ধরতে হয় না — মেনু থেকে Shut down বেছে নিতে হয়।', module: 1 },
  { id: 'scroll', termBn: 'স্ক্রল', termEn: 'Scroll', meaningBn: 'লম্বা লেখা বা ছবির তালিকায় ওপর-নিচ সরে দেখা। টাচপ্যাডে দুই আঙুলে, মাউসে চাকা ঘুরিয়ে করা হয়।', module: 1 },
  { id: 'pinch', termBn: 'পিঞ্চ (দুই আঙুলে জুম)', termEn: 'Pinch', meaningBn: 'টাচপ্যাডে দুই আঙুল ফাঁক করলে ছবি বা লেখা বড় হয়, কাছে আনলে ছোট হয়।', module: 1 },
  { id: 'gesture', termBn: 'জেসচার (আঙুলের ভঙ্গি)', termEn: 'Gesture', meaningBn: 'টাচপ্যাডে বিশেষ কাজের জন্য আঙুল নাড়ানোর ধরন, যেমন ট্যাপ, দুই আঙুলে স্ক্রল, পিঞ্চ।', module: 1 },
]

export default entries
