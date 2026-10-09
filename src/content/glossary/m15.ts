import type { GlossaryEntry } from '../../engine/types'

/** Note: “program”, “app” and “website” already exist in the glossary (modules 6–7); this file adds programming-specific terms. */
const entries: GlossaryEntry[] = [
  { id: 'prog-programming', termBn: 'প্রোগ্রামিং', termEn: 'Programming', meaningBn: 'কম্পিউটারকে পরিষ্কার, ধাপে ধাপে নির্দেশ লিখে দেওয়া। সে ঠিক যা বলা হয় তাই করে।', icon: '🧑‍💻', module: 15 },
  { id: 'prog-code', termBn: 'কোড', termEn: 'Code', meaningBn: 'প্রোগ্রামিং ভাষায় লেখা নির্দেশ। দেখতে লেখার মতো, কিন্তু কম্পিউটার পড়ে কাজ করে।', art: 'code-brackets', module: 15 },
  { id: 'prog-instruction', termBn: 'নির্দেশ', termEn: 'Instruction', meaningBn: 'কম্পিউটারকে দেওয়া একটি ছোট আদেশ, যেমন “পর্দায় এই লেখা দেখাও”।', icon: '📝', module: 15 },
  { id: 'prog-programmer', termBn: 'প্রোগ্রামার', termEn: 'Programmer', meaningBn: 'যিনি কোড লিখে কম্পিউটারকে কাজ শেখান। পড়েন, ভাবেন, পরীক্ষা করেন — টাইপ কম।', art: 'brain', module: 15 },
  { id: 'prog-algorithm', termBn: 'অ্যালগরিদম', termEn: 'Algorithm', meaningBn: 'কাজ করার ধাপে ধাপে পদ্ধতি, যেমন চা বানানোর রেসিপি।', art: 'recipe-card', module: 15 },
  { id: 'prog-html', termBn: 'এইচটিএমএল', termEn: 'HTML', meaningBn: 'ওয়েবপেজের কাঠামোর ভাষা — কোথায় শিরোনাম, লেখা, ছবি বা লিংক।', art: 'html-tag', module: 15 },
  { id: 'prog-css', termBn: 'সিএসএস', termEn: 'CSS', meaningBn: 'ওয়েবপেজের সাজের ভাষা — রং, অক্ষরের আকার, ফাঁকা জায়গা।', art: 'css-brush', module: 15 },
  { id: 'prog-javascript', termBn: 'জাভাস্ক্রিপ্ট', termEn: 'JavaScript', meaningBn: 'ওয়েবপেজে আচরণ আনার ভাষা — বোতাম চাপলে কিছু ঘটা, হিসাব হওয়া।', art: 'braces', module: 15 },
  { id: 'prog-python', termBn: 'পাইথন', termEn: 'Python', meaningBn: 'পড়তে সহজ সাধারণ-কাজের ভাষা — হিসাব, ডেটা, অটোমেশন আর AI।', art: 'python-snake', module: 15 },
  { id: 'prog-webpage', termBn: 'ওয়েবপেজ', termEn: 'Web page', meaningBn: 'ব্রাউজারে দেখা একটি পাতা। অনেক ওয়েবপেজ মিলে ওয়েবসাইট হয়।', art: 'browser', module: 15 },
  { id: 'prog-bug', termBn: 'বাগ', termEn: 'Bug', meaningBn: 'কোডের ভুল, যার জন্য প্রোগ্রাম ঠিকমতো চলে না। অভিজ্ঞরাও রোজ পান।', art: 'bug', module: 15 },
  { id: 'prog-debug', termBn: 'ডিবাগ', termEn: 'Debug', meaningBn: 'বাগ খুঁজে বের করে ঠিক করার কাজ। প্রোগ্রামারের অনেক সময় এতে যায়।', art: 'wrench', module: 15 },
  { id: 'prog-language', termBn: 'প্রোগ্রামিং ভাষা', termEn: 'Programming language', meaningBn: 'কম্পিউটারকে নির্দেশ দেওয়ার নিয়মের ভাষা, যেমন HTML, CSS, JavaScript, Python।', art: 'language', module: 15 },
  { id: 'prog-syntax', termBn: 'সিনট্যাক্স', termEn: 'Syntax', meaningBn: 'কোড লেখার ব্যাকরণ — কোন চিহ্ন কোথায় বসবে। ভুল হলে কম্পিউটার ভুলের বার্তা দেখায়।', art: 'puzzle', module: 15 },
  { id: 'prog-open-source', termBn: 'ওপেন সোর্স', termEn: 'Open source', meaningBn: 'যে প্রোগ্রামের কোড সবাই দেখতে ও কাজে লাগাতে পারে। Python এভাবেই তৈরি।', art: 'gift', module: 15 },
]

export default entries
