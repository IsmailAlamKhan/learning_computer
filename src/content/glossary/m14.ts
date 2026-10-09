import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'hw-input', termBn: 'ইনপুট', termEn: 'Input', icon: '⌨️', meaningBn: 'কম্পিউটারে যা ঢোকে: টাইপ, ক্লিক, ক্যামেরার ছবি। রান্নার উপকরণের মতো।', module: 14 },
  { id: 'hw-processing', termBn: 'প্রসেসিং', termEn: 'Processing', icon: '⚙️', art: 'chip', meaningBn: 'পাওয়া তথ্য নিয়ে কাজ বা হিসাব করা। রাঁধুনির রান্নার মতো।', module: 14 },
  { id: 'hw-output', termBn: 'আউটপুট', termEn: 'Output', icon: '🖥️', art: 'monitor', meaningBn: 'কম্পিউটার যা ফেরত দেয়: পর্দার ছবি, আওয়াজ, প্রিন্ট। পরিবেশন করা খাবারের মতো।', module: 14 },
  { id: 'hw-cpu', termBn: 'প্রসেসর', termEn: 'CPU (Processor)', icon: '🧠', art: 'chip', meaningBn: 'কম্পিউটারের “মস্তিষ্ক”; হিসাব করে আর নির্দেশ চালায়। রাঁধুনির মতো।', module: 14 },
  { id: 'hw-memory', termBn: 'মেমোরি', termEn: 'Memory (RAM)', icon: '🧮', art: 'ram-stick', meaningBn: 'কাজের সময় তথ্য হাতের কাছে রাখার দ্রুত জায়গা; কারেন্ট গেলে সাফ। কাউন্টারের মতো।', module: 14 },
  { id: 'hw-storage', termBn: 'স্টোরেজ', termEn: 'Storage (SSD/HDD)', icon: '🗄️', art: 'hard-drive', meaningBn: 'ফাইল-ছবি দীর্ঘদিন জমানোর জায়গা; বন্ধ করলেও থাকে। ফ্রিজের মতো (SSD/HDD)।', module: 14 },
  { id: 'hw-os', termBn: 'অপারেটিং সিস্টেম', termEn: 'Operating System', icon: '🏠', meaningBn: 'সব অংশ আর প্রোগ্রামকে চালায় যে প্রধান সফটওয়্যার, যেমন Windows, macOS। ব্যবস্থাপকের মতো।', module: 14 },
  { id: 'hw-program', termBn: 'প্রোগ্রাম / অ্যাপ', termEn: 'Program / Application', icon: '📱', meaningBn: 'নির্দিষ্ট কাজের সফটওয়্যার, যেমন ক্যালকুলেটর। মোবাইলে একে অ্যাপ বলে।', module: 14 },
  { id: 'hw-hardware', termBn: 'হার্ডওয়্যার', termEn: 'Hardware', icon: '🔧', meaningBn: 'কম্পিউটারের যা ছোঁয়া যায়: পর্দা, কিবোর্ড, প্রসেসর, স্টোরেজ।', module: 14 },
  { id: 'hw-software', termBn: 'সফটওয়্যার', termEn: 'Software', icon: '💿', meaningBn: 'কম্পিউটারকে কী করতে হবে তার নির্দেশ। ছোঁয়া যায় না, পর্দায় দেখা যায়।', module: 14 },
  { id: 'hw-bit', termBn: 'বিট', termEn: 'Bit', icon: '💡', art: 'binary', meaningBn: 'তথ্যের সবচেয়ে ছোট একক: সুইচের মতো চালু (1) বা বন্ধ (0)।', module: 14 },
  { id: 'hw-byte', termBn: 'বাইট', termEn: 'Byte', icon: '🔢', meaningBn: '৮ বিটে ১ বাইট; এতে একটি ইংরেজি অক্ষর বা ০–২৫৫ সংখ্যা রাখা যায়।', module: 14 },
  { id: 'hw-binary', termBn: 'বাইনারি', termEn: 'Binary', icon: '01', art: 'binary', meaningBn: 'শুধু 0 আর 1 দিয়ে সংখ্যা লেখার নিয়ম। কম্পিউটার সবকিছু এভাবে মনে রাখে।', module: 14 },
  { id: 'hw-units', termBn: 'কেবি, এমবি, জিবি', termEn: 'KB, MB, GB', icon: '📏', meaningBn: 'ফাইলের মাপ: ১ KB ≈ হাজার বাইট, ১ MB ≈ হাজার KB, ১ GB ≈ হাজার MB।', module: 14 },
  { id: 'hw-unicode', termBn: 'ইউনিকোড', termEn: 'Unicode', icon: '🔤', meaningBn: 'সব ভাষার অক্ষর ও ইমোজিকে একটি করে নম্বর দেওয়ার নিয়ম। তাই বাংলা-ইংরেজি দুটোই চলে।', module: 14 },
  { id: 'hw-server', termBn: 'সার্ভার', termEn: 'Server', icon: '🗄️', art: 'server', meaningBn: 'দূরের শক্তিশালী কম্পিউটার, যে ওয়েবসাইট বা তথ্য ইন্টারনেটে পাঠায়।', module: 14 },
  { id: 'hw-client', termBn: 'ক্লায়েন্ট', termEn: 'Client', icon: '📲', meaningBn: 'যে ফোন বা কম্পিউটার সার্ভারের কাছে কিছু চায়। আপনার ব্রাউজার একটি ক্লায়েন্ট।', module: 14 },
  { id: 'hw-website-vs-app', termBn: 'ওয়েবসাইট ও অ্যাপ', termEn: 'Website vs App', icon: '🌐', art: 'browser', meaningBn: 'ওয়েবসাইট ব্রাউজারে খোলে; অ্যাপ ইনস্টল করে চালাতে হয়। দুটিই সার্ভারের সাথে কথা বলে।', module: 14 },
]

export default entries
