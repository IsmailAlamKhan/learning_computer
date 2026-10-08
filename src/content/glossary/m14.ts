import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'hw-input', termBn: 'ইনপুট', termEn: 'Input', meaningBn: 'কম্পিউটারের ভেতরে যা দেওয়া হয়: কিবোর্ডে টাইপ, মাউসের ক্লিক, ক্যামেরার ছবি। রান্নার উপকরণের মতো।', module: 14 },
  { id: 'hw-processing', termBn: 'প্রসেসিং', termEn: 'Processing', meaningBn: 'পাওয়া তথ্য নিয়ে হিসাব-নিকাশ বা কাজ করা। রাঁধুনির রান্না করার মতো।', module: 14 },
  { id: 'hw-output', termBn: 'আউটপুট', termEn: 'Output', meaningBn: 'কম্পিউটার কাজ করে যা ফেরত দেয়: পর্দার লেখা বা ছবি, স্পিকারের আওয়াজ, প্রিন্টের কাগজ। পরিবেশন করা খাবারের মতো।', module: 14 },
  { id: 'hw-cpu', termBn: 'প্রসেসর', termEn: 'CPU (Processor)', meaningBn: 'কম্পিউটারের “মস্তিষ্ক”। এটিই হিসাব-নিকাশ করে আর সব নির্দেশ চালায়। রান্নাঘরের রাঁধুনির মতো।', module: 14 },
  { id: 'hw-memory', termBn: 'মেমোরি', termEn: 'Memory (RAM)', meaningBn: 'কাজ চলাকালীন তথ্য সাময়িকভাবে হাতের কাছে রাখার জায়গা। খুব দ্রুত, কিন্তু বিদ্যুৎ গেলে বা কম্পিউটার বন্ধ হলে মুছে যায়। রান্নার কাউন্টারের মতো।', module: 14 },
  { id: 'hw-storage', termBn: 'স্টোরেজ', termEn: 'Storage (SSD/HDD)', meaningBn: 'ফাইল, ছবি, প্রোগ্রাম দীর্ঘদিন জমিয়ে রাখার জায়গা। বন্ধ করলেও থাকে। ফ্রিজ বা ভাঁড়ারের মতো। এর দুই রকম: SSD ও HDD।', module: 14 },
  { id: 'hw-os', termBn: 'অপারেটিং সিস্টেম', termEn: 'Operating System', meaningBn: 'কম্পিউটারের সব অংশ ও প্রোগ্রামকে মিলিয়ে চালায় যে প্রধান সফটওয়্যার, যেমন Windows, macOS, Linux। বাড়ির ব্যবস্থাপকের মতো।', module: 14 },
  { id: 'hw-program', termBn: 'প্রোগ্রাম / অ্যাপ', termEn: 'Program / Application', meaningBn: 'কোনো নির্দিষ্ট কাজ করার জন্য বানানো সফটওয়্যার, যেমন লেখার প্রোগ্রাম বা ক্যালকুলেটর। মোবাইলে একে অ্যাপ বলা হয়।', module: 14 },
  { id: 'hw-hardware', termBn: 'হার্ডওয়্যার', termEn: 'Hardware', meaningBn: 'কম্পিউটারের যে অংশ হাত দিয়ে ছোঁয়া যায়: পর্দা, কিবোর্ড, প্রসেসর, স্টোরেজ।', module: 14 },
  { id: 'hw-software', termBn: 'সফটওয়্যার', termEn: 'Software', meaningBn: 'কম্পিউটারকে কী করতে হবে তা বলে দেওয়া নির্দেশের সমষ্টি। ছোঁয়া যায় না, শুধু পর্দায় দেখা যায় ও কাজ করে।', module: 14 },
  { id: 'hw-bit', termBn: 'বিট', termEn: 'Bit', meaningBn: 'তথ্যের সবচেয়ে ছোট একক। একটি সুইচের মতো: চালু (1) অথবা বন্ধ (0)।', module: 14 },
  { id: 'hw-byte', termBn: 'বাইট', termEn: 'Byte', meaningBn: '৮টি বিট একসাথে হলো ১ বাইট। এ দিয়ে ০ থেকে ২৫৫ পর্যন্ত একটি সংখ্যা বা একটি ইংরেজি অক্ষর লেখা যায়।', module: 14 },
  { id: 'hw-binary', termBn: 'বাইনারি', termEn: 'Binary', meaningBn: 'শুধু 0 আর 1 দিয়ে সংখ্যা লেখার নিয়ম। কম্পিউটার সবকিছু এভাবেই মনে রাখে।', module: 14 },
  { id: 'hw-units', termBn: 'কেবি, এমবি, জিবি', termEn: 'KB, MB, GB', meaningBn: 'ফাইলের আকার মাপার একক। মোটামুটি ১ কেবি (KB) = প্রায় এক হাজার বাইট, ১ এমবি (MB) = প্রায় এক হাজার কেবি, ১ জিবি (GB) = প্রায় এক হাজার এমবি।', module: 14 },
  { id: 'hw-unicode', termBn: 'ইউনিকোড', termEn: 'Unicode', meaningBn: 'পৃথিবীর প্রায় সব ভাষার অক্ষর, চিহ্ন ও ইমোজির প্রত্যেকটিকে একটি করে নম্বর দেওয়ার নিয়ম। তাই কম্পিউটারে বাংলা, ইংরেজি সবই লেখা যায়।', module: 14 },
  { id: 'hw-server', termBn: 'সার্ভার', termEn: 'Server', meaningBn: 'দূরের একটি শক্তিশালী কম্পিউটার, যে আপনার চাওয়া ওয়েবসাইট বা তথ্য ইন্টারনেটে পাঠিয়ে দেয়।', module: 14 },
  { id: 'hw-client', termBn: 'ক্লায়েন্ট', termEn: 'Client', meaningBn: 'যে কম্পিউটার বা ফোন সার্ভারের কাছে কিছু চায়। আপনার ফোন বা ব্রাউজার একটি ক্লায়েন্ট।', module: 14 },
  { id: 'hw-website-vs-app', termBn: 'ওয়েবসাইট ও অ্যাপ', termEn: 'Website vs App', meaningBn: 'ওয়েবসাইট ব্রাউজারে খুলে দেখা হয়; অ্যাপ ফোন বা কম্পিউটারে ইনস্টল করে চালাতে হয়। দুটিই দরকার মতো সার্ভারের সাথে কথা বলে।', module: 14 },
]

export default entries
