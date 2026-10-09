import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'program', termBn: 'প্রোগ্রাম', termEn: 'Program', meaningBn: 'কম্পিউটারকে দিয়ে কাজ করানোর সফটওয়্যার, যেন কাজের হাতিয়ার — কলমের মতো।', art: 'pencil', module: 6 },
  { id: 'app', termBn: 'অ্যাপ', termEn: 'App', meaningBn: 'প্রোগ্রামের ছোট চলতি নাম। ফোন আর কম্পিউটার, দুটোতেই শোনা যায়।', icon: '📱', module: 6 },
  { id: 'application', termBn: 'অ্যাপ্লিকেশন', termEn: 'Application', meaningBn: 'অ্যাপ বা প্রোগ্রামের পুরো নাম। Mac-এর Applications ফোল্ডারে সব অ্যাপ থাকে।', icon: '🗂️', module: 6 },
  { id: 'install', termBn: 'ইনস্টল', termEn: 'Install', meaningBn: 'নতুন অ্যাপ কম্পিউটারে বসিয়ে নেওয়া, যাতে পরে ব্যবহার করা যায়।', art: 'package-box', module: 6 },
  { id: 'uninstall', termBn: 'আনইনস্টল', termEn: 'Uninstall', meaningBn: 'কম্পিউটার থেকে অ্যাপ পুরোপুরি সরানো। শুধু আইকন মুছলে অনেক সময় সরে না।', art: 'trash', module: 6 },
  { id: 'plain-text', termBn: 'প্লেইন টেক্সট', termEn: 'Plain text', meaningBn: 'শুধু অক্ষর, সাজসজ্জা নেই। ফাইলের নাম সাধারণত .txt দিয়ে শেষ হয়।', art: 'document', module: 6 },
  { id: 'rich-text', termBn: 'সাজানো লেখা', termEn: 'Rich text', meaningBn: 'মোটা অক্ষর, রং, বড় হরফওয়ালা লেখা, যেমন Word ফাইল।', icon: '🎨', module: 6 },
  { id: 'notepad', termBn: 'নোটপ্যাড', termEn: 'Notepad', meaningBn: 'Windows-এর সাধারণ লেখার অ্যাপ। এতে .txt ফাইল বানানো যায়।', art: 'notebook', module: 6 },
  { id: 'textedit', termBn: 'টেক্সটএডিট', termEn: 'TextEdit', meaningBn: 'Mac-এর লেখার অ্যাপ। Format মেনুতে Make Plain Text দিয়ে সাধারণ লেখায় আনা যায়।', art: 'notebook', module: 6 },
  { id: 'save', termBn: 'সেভ', termEn: 'Save', meaningBn: 'লেখা ফাইলে জমিয়ে রাখা। নাম থাকলে Save একই ফাইল নতুন লেখায় বদলায়।', art: 'save-disk', module: 6 },
  { id: 'save-as', termBn: 'সেভ অ্যাজ', termEn: 'Save As', meaningBn: 'একই লেখা নতুন নামে আরেকটি ফাইলে রাখা। আগেরটি অক্ষত থাকে।', art: 'copy', module: 6 },
  { id: 'open-file', termBn: 'ওপেন', termEn: 'Open', meaningBn: 'সেভ করা ফাইল আবার খোলা — ফাইল ম্যানেজারে ডাবল ক্লিক করে।', art: 'folder-open', module: 6 },
  { id: 'start-search', termBn: 'স্টার্ট সার্চ', termEn: 'Start search', meaningBn: 'Windows-এ স্টার্ট চেপে নাম লিখে অ্যাপ বা ফাইল খোঁজা।', art: 'magnifier', module: 6 },
  { id: 'spotlight', termBn: 'স্পটলাইট', termEn: 'Spotlight', meaningBn: 'Mac-এর খোঁজার জায়গা। ওপরের 🔍 বা Cmd + Space চেপে নাম লিখুন।', art: 'magnifier', module: 6 },
  { id: 'official-source', termBn: 'অফিসিয়াল উৎস', termEn: 'Official source', meaningBn: 'প্রস্তুতকারকের নিজের সাইট বা অ্যাপ স্টোর। অ্যাপ নামানো শুধু এখান থেকেই নিরাপদ।', art: 'shield', module: 6 },
  { id: 'update', termBn: 'আপডেট', termEn: 'Update', meaningBn: 'অ্যাপের নতুন সংস্করণ — ভুল ঠিক হয়, নিরাপত্তা বাড়ে। অফিসিয়াল জায়গা থেকেই করুন।', art: 'refresh', module: 6 },
]

export default entries
