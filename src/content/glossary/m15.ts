import type { GlossaryEntry } from '../../engine/types'

/** Note: “program”, “app” and “website” already exist in the glossary (modules 6–7); this file adds programming-specific terms. */
const entries: GlossaryEntry[] = [
  { id: 'prog-programming', termBn: 'প্রোগ্রামিং', termEn: 'Programming', meaningBn: 'কম্পিউটারকে পরিষ্কার ও ধাপে ধাপে নির্দেশ লিখে দেওয়া, যাতে সে একটি কাজ ঠিকঠাক করে। কম্পিউটার ঠিক যা বলা হয় তাই করে, তার বেশি কিছু নয়।', module: 15 },
  { id: 'prog-code', termBn: 'কোড', termEn: 'Code', meaningBn: 'প্রোগ্রামিং ভাষায় লেখা নির্দেশ। কোড দেখতে লেখার মতো, কিন্তু কম্পিউটার সেটি পড়ে কাজ করে।', module: 15 },
  { id: 'prog-instruction', termBn: 'নির্দেশ', termEn: 'Instruction', meaningBn: 'কম্পিউটারকে দেওয়া একটি ছোট আদেশ, যেমন “পর্দায় এই লেখা দেখাও”। অনেক নির্দেশ পরপর সাজালে প্রোগ্রাম হয়।', module: 15 },
  { id: 'prog-programmer', termBn: 'প্রোগ্রামার', termEn: 'Programmer', meaningBn: 'যিনি কোড লিখে কম্পিউটারকে কাজ শেখান। তিনি বেশি সময় পড়েন, ভাবেন আর পরীক্ষা করেন — টাইপ করেন তুলনায় কম।', module: 15 },
  { id: 'prog-algorithm', termBn: 'অ্যালগরিদম', termEn: 'Algorithm', meaningBn: 'কোনো কাজ করার ধাপে ধাপে পরিষ্কার পদ্ধতি, যেমন চা বানানোর রেসিপি। কোড লেখার আগে মনে মনে এটি ভেবে নেওয়া হয়।', module: 15 },
  { id: 'prog-html', termBn: 'এইচটিএমএল', termEn: 'HTML', meaningBn: 'ওয়েবপেজের কাঠামো লেখার ভাষা — কোথায় শিরোনাম, লেখা, ছবি বা লিংক থাকবে। তাই ওয়েবপেজ শেখার প্রথম ধাপ।', module: 15 },
  { id: 'prog-css', termBn: 'সিএসএস', termEn: 'CSS', meaningBn: 'ওয়েবপেজের সাজ ঠিক করার ভাষা — রং, অক্ষরের আকার, ফাঁকা জায়গা। HTML-এর সাথে একসাথে ব্যবহার হয়।', module: 15 },
  { id: 'prog-javascript', termBn: 'জাভাস্ক্রিপ্ট', termEn: 'JavaScript', meaningBn: 'ওয়েবপেজে আচরণ আনার ভাষা — বোতাম চাপলে কিছু ঘটা, হিসাব হওয়া, নড়াচড়া। প্রায় প্রতিটি ওয়েবসাইটে ব্যবহৃত হয়।', module: 15 },
  { id: 'prog-python', termBn: 'পাইথন', termEn: 'Python', meaningBn: 'পড়তে সহজ একটি সাধারণ-কাজের প্রোগ্রামিং ভাষা। হিসাব, ডেটা, অটোমেশন আর কৃত্রিম বুদ্ধিমত্তার (AI) কাজে বহুল ব্যবহৃত।', module: 15 },
  { id: 'prog-webpage', termBn: 'ওয়েবপেজ', termEn: 'Web page', meaningBn: 'ব্রাউজারে দেখা একটি একক পাতা। অনেক ওয়েবপেজ মিলে একটি ওয়েবসাইট হয়।', module: 15 },
  { id: 'prog-bug', termBn: 'বাগ', termEn: 'Bug', meaningBn: 'কোডের ভুল, যার ফলে প্রোগ্রাম ঠিকমতো চলে না। অভিজ্ঞ প্রোগ্রামাররাও রোজ বাগ পান — এটি স্বাভাবিক।', module: 15 },
  { id: 'prog-debug', termBn: 'ডিবাগ', termEn: 'Debug', meaningBn: 'বাগ খুঁজে বের করে ঠিক করার কাজ। প্রোগ্রামারের সময়ের একটি বড় অংশ এতে যায়।', module: 15 },
  { id: 'prog-language', termBn: 'প্রোগ্রামিং ভাষা', termEn: 'Programming language', meaningBn: 'কম্পিউটারকে নির্দেশ দেওয়ার নির্দিষ্ট নিয়মের ভাষা, যেমন HTML, CSS, JavaScript, Python। প্রতিটির কাজ আলাদা।', module: 15 },
  { id: 'prog-syntax', termBn: 'সিনট্যাক্স', termEn: 'Syntax', meaningBn: 'কোড লেখার ব্যাকরণ — কোন চিহ্ন কোথায় বসবে। একটি চিহ্ন ভুল হলে কম্পিউটার বুঝতে পারে না, তখন সে ভুলের বার্তা দেখায়।', module: 15 },
  { id: 'prog-open-source', termBn: 'ওপেন সোর্স', termEn: 'Open source', meaningBn: 'যে প্রোগ্রামের কোড সবাই দেখতে ও কাজে লাগাতে পারে। Python-সহ অনেক ভাষা ও টুল এভাবেই তৈরি।', module: 15 },
]

export default entries
