import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'photo', termBn: 'ছবি', termEn: 'Photo', meaningBn: 'ক্যামেরা বা ফোনে তোলা ছবি। কম্পিউটারে এটি একটি ফাইল; ডাবল ক্লিকে Photos-এ খোলে।', module: 11, art: 'image' },
  { id: 'image-file', termBn: 'ছবির ফাইল', termEn: 'Image File', meaningBn: 'যে ফাইলে ছবি থাকে। নামের শেষে .jpg, .jpeg বা .png দেখে চেনা যায়।', module: 11, icon: '🖼️' },
  { id: 'video', termBn: 'ভিডিও', termEn: 'Video', meaningBn: 'নড়াচড়া করা ছবি আর আওয়াজ একসাথে। নামের শেষে সাধারণত .mp4 থাকে।', module: 11, art: 'video-play' },
  { id: 'audio', termBn: 'অডিও', termEn: 'Audio', meaningBn: 'শুধু আওয়াজের ফাইল, যেমন গান বা রেকর্ড করা কথা। নামের শেষে সাধারণত .mp3 থাকে।', module: 11, art: 'music' },
  { id: 'media-player', termBn: 'মিডিয়া প্লেয়ার', termEn: 'Media Player', meaningBn: 'গান আর ভিডিও চালানোর প্রোগ্রাম। প্লে, পজ আর আওয়াজ কমানো-বাড়ানোর বোতাম থাকে।', module: 11, icon: '▶️' },
  { id: 'screenshot', termBn: 'স্ক্রিনশট', termEn: 'Screenshot', meaningBn: 'পর্দায় এই মুহূর্তে যা দেখা যাচ্ছে তার ছবি। কিছু দেখাতে বা সাহায্য চাইতে কাজে লাগে।', module: 11, art: 'camera' },
  { id: 'snip', termBn: 'স্নিপ (পর্দার একটি অংশের ছবি)', termEn: 'Snip', meaningBn: 'পুরো পর্দা নয়, টেনে বেছে নেওয়া একটি অংশের ছবি। Windows-এ Win + Shift + S চাপুন।', module: 11, icon: '✂️' },
  { id: 'usb-drive', termBn: 'পেনড্রাইভ', termEn: 'USB Drive', meaningBn: 'ইউএসবি পোর্টে লাগানো ছোট যন্ত্র, যাতে ফাইল এক কম্পিউটার থেকে অন্যটিতে নেওয়া যায়।', module: 11, art: 'usb-stick' },
  { id: 'eject', termBn: 'ইজেক্ট', termEn: 'Eject', meaningBn: 'পেনড্রাইভ খোলার আগে কম্পিউটারকে জানানো। Mac-এ ফাইন্ডারে ড্রাইভের নামের পাশের ⏏ চাপুন।', module: 11, icon: '⏏️' },
  { id: 'safely-remove', termBn: 'নিরাপদে খুলে নেওয়া', termEn: 'Safely Remove Hardware', meaningBn: 'Windows-এ খোলার আগে টাস্কবারের ইউএসবি চিহ্ন থেকে Eject করা। এতে ফাইল নষ্ট হয় না।', module: 11, art: 'shield' },
  { id: 'printer', termBn: 'প্রিন্টার', termEn: 'Printer', meaningBn: 'যে যন্ত্র কম্পিউটারের লেখা বা ছবি কাগজে ছাপে।', module: 11, art: 'printer' },
  { id: 'print-queue', termBn: 'প্রিন্ট কিউ', termEn: 'Print Queue', meaningBn: 'ছাপার অপেক্ষায় থাকা ডকুমেন্টের লাইন। কোনটা ছাপা হচ্ছে, এখানে দেখা যায়।', module: 11, icon: '🧾' },
  { id: 'cancel-print', termBn: 'প্রিন্ট বাতিল করা', termEn: 'Cancel Print', meaningBn: 'ভুল প্রিন্ট দিলে প্রিন্ট কিউ খুলে ডকুমেন্টের পাশের Cancel চাপা। কাগজ নষ্ট হয় না।', module: 11, icon: '🚫' },
  { id: 'phone-transfer', termBn: 'ফোন থেকে ফাইল নেওয়া', termEn: 'Phone Transfer', meaningBn: 'কেবল দিয়ে ফোন লাগিয়ে ছবি কম্পিউটারে কপি করা। আগে ফোনে File transfer-এর অনুমতি দিতে হয়।', module: 11, art: 'phone' },
  { id: 'storage', termBn: 'স্টোরেজ', termEn: 'Storage', meaningBn: 'ফাইল জমা রাখার জায়গা — ডিস্ক, পেনড্রাইভ বা ফোনের মেমরি। ভরে গেলে নতুন ফাইল রাখা যায় না।', module: 11, art: 'hard-drive' },
]

export default entries
