import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'photo', termBn: 'ছবি', termEn: 'Photo', meaningBn: 'ক্যামেরা বা ফোনে তোলা ছবি। কম্পিউটারে এটি একটি ফাইল হয়ে থাকে, আর ডাবল ক্লিক করলে ছবি দেখার প্রোগ্রামে (Photos) খোলে।', module: 11 },
  { id: 'image-file', termBn: 'ছবির ফাইল', termEn: 'Image File', meaningBn: 'যে ফাইলের ভেতরে ছবি থাকে। নামের শেষে .jpg, .jpeg বা .png-এর মতো এক্সটেনশন দেখে চেনা যায়।', module: 11 },
  { id: 'video', termBn: 'ভিডিও', termEn: 'Video', meaningBn: 'নড়াচড়া করা ছবি আর আওয়াজ একসাথে। ভিডিও ফাইলের নামের শেষে সাধারণত .mp4 লেখা থাকে।', module: 11 },
  { id: 'audio', termBn: 'অডিও', termEn: 'Audio', meaningBn: 'শুধু আওয়াজের ফাইল, যেমন গান বা রেকর্ড করা কথা। এর নামের শেষে সাধারণত .mp3 লেখা থাকে।', module: 11 },
  { id: 'media-player', termBn: 'মিডিয়া প্লেয়ার', termEn: 'Media Player', meaningBn: 'গান আর ভিডিও চালানোর প্রোগ্রাম। এতে প্লে (Play), পজ (Pause), স্টপ (Stop) আর আওয়াজ বাড়ানো-কমানোর বোতাম থাকে।', module: 11 },
  { id: 'screenshot', termBn: 'স্ক্রিনশট', termEn: 'Screenshot', meaningBn: 'কম্পিউটারের পর্দায় এই মুহূর্তে যা দেখা যাচ্ছে তার ছবি। কিছু দেখাতে বা সাহায্য চাইতে খুব কাজে লাগে।', module: 11 },
  { id: 'snip', termBn: 'স্নিপ (পর্দার একটি অংশের ছবি)', termEn: 'Snip', meaningBn: 'পুরো পর্দা নয়, শুধু একটি অংশ টেনে বেছে নিয়ে তার ছবি তোলা। Windows-এ Win + Shift + S চাপলে এই সুবিধা পাওয়া যায়।', module: 11 },
  { id: 'usb-drive', termBn: 'পেনড্রাইভ', termEn: 'USB Drive', meaningBn: 'ছোট একটি যন্ত্র, যেটি কম্পিউটারের ইউএসবি পোর্টে লাগিয়ে ফাইল এক জায়গা থেকে অন্য কম্পিউটারে নেওয়া যায়। ফাইল রাখার ছোট বাক্সের মতো।', module: 11 },
  { id: 'eject', termBn: 'ইজেক্ট', termEn: 'Eject', meaningBn: 'পেনড্রাইভ খুলে নেওয়ার আগে কম্পিউটারকে জানানো যে এটি আর ব্যবহার হচ্ছে না। Mac-এ ফাইন্ডারের পাশের ⏏ চিহ্নে চাপলে এটি হয়।', module: 11 },
  { id: 'safely-remove', termBn: 'নিরাপদে খুলে নেওয়া', termEn: 'Safely Remove Hardware', meaningBn: 'Windows-এ পেনড্রাইভ খোলার আগে টাস্কবারের ছোট ইউএসবি চিহ্নে চাপ দিয়ে Eject করা। এতে ফাইল নষ্ট হওয়ার ভয় থাকে না।', module: 11 },
  { id: 'printer', termBn: 'প্রিন্টার', termEn: 'Printer', meaningBn: 'যে যন্ত্র কম্পিউটারের লেখা বা ছবি কাগজে ছাপে।', module: 11 },
  { id: 'print-queue', termBn: 'প্রিন্ট কিউ', termEn: 'Print Queue', meaningBn: 'ছাপার অপেক্ষায় থাকা ডকুমেন্টের লাইন। কোনটা ছাপা হচ্ছে আর কোনটা অপেক্ষায় আছে, এখানে দেখা যায়।', module: 11 },
  { id: 'cancel-print', termBn: 'প্রিন্ট বাতিল করা', termEn: 'Cancel Print', meaningBn: 'ভুল করে প্রিন্ট দিয়ে ফেললে প্রিন্ট কিউ খুলে সেই ডকুমেন্টের পাশের Cancel বোতামে চাপা। তাহলে কাগজ নষ্ট হয় না।', module: 11 },
  { id: 'phone-transfer', termBn: 'ফোন থেকে ফাইল নেওয়া', termEn: 'Phone Transfer', meaningBn: 'ইউএসবি কেবল দিয়ে ফোন কম্পিউটারে লাগিয়ে ফোনের ছবি বা ফাইল কম্পিউটারে কপি করা। আগে ফোনের পর্দায় অনুমতি (File transfer) দিতে হয়।', module: 11 },
  { id: 'storage', termBn: 'স্টোরেজ', termEn: 'Storage', meaningBn: 'ফাইল জমা রাখার জায়গা — কম্পিউটারের ডিস্ক, পেনড্রাইভ বা ফোনের ভেতরের মেমরি। জায়গা ভরে গেলে আর নতুন ফাইল রাখা যায় না।', module: 11 },
]

export default entries
