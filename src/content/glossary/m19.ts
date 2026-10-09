import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'tech-error', termBn: 'এরর (ভুল)', termEn: 'Error', art: 'bug', meaningBn: 'কিছু ঠিকমতো হয়নি — কম্পিউটারের দেওয়া সূত্র। আপনার ব্যর্থতা নয়।', module: 19 },
  { id: 'tech-warning', termBn: 'সতর্কবার্তা', termEn: 'Warning', art: 'warning', meaningBn: 'কাজ থামেনি, কিন্তু খেয়াল রাখতে বলা হচ্ছে। যেমন “Unsaved changes”।', module: 19 },
  { id: 'tech-failed', termBn: 'ব্যর্থ হওয়া', termEn: 'Failed', art: 'cross', meaningBn: 'কাজটি শেষ করা যায়নি। কারণ সাধারণত পরের লাইনে লেখা থাকে।', module: 19 },
  { id: 'tech-invalid', termBn: 'ঠিক নয় (নিয়ম মেলেনি)', termEn: 'Invalid', art: 'id-card', meaningBn: 'আপনার দেওয়া জিনিস নিয়ম মেলেনি। যেমন “Invalid password”।', module: 19 },
  { id: 'tech-missing', termBn: 'নেই / হারানো', termEn: 'Missing', art: 'question', meaningBn: 'যা থাকার কথা ছিল, তা পাওয়া যাচ্ছে না। যেমন “Missing file”।', module: 19 },
  { id: 'tech-not-found', termBn: 'খুঁজে পাওয়া যায়নি', termEn: 'Not found', art: 'magnifier', meaningBn: 'ফাইল বা ওয়েব পাতা ওই ঠিকানায় নেই। বানান আর জায়গা দেখুন।', module: 19 },
  { id: 'tech-permission-denied', termBn: 'অনুমতি নেই', termEn: 'Permission denied', art: 'lock', meaningBn: 'এই কাজের অনুমতি নেই। না বুঝে অনুমতি জোর করে বদলাবেন না।', module: 19 },
  { id: 'tech-timeout', termBn: 'সময় শেষ', termEn: 'Timeout', art: 'clock', meaningBn: 'অনেকক্ষণ অপেক্ষার পরও সাড়া মেলেনি, তাই কাজ থেমেছে। নেট ধীর হলে হয়।', module: 19 },
  { id: 'tech-deprecated', termBn: 'পুরোনো (বাদ যাওয়ার পথে)', termEn: 'Deprecated', art: 'calendar', meaningBn: 'এখনো চলে, কিন্তু ভবিষ্যতে বাদ যাবে। সাধারণত সতর্কবার্তা, জরুরি ভুল নয়।', module: 19 },
  { id: 'tech-syntax', termBn: 'সিনট্যাক্স (লেখার নিয়ম)', termEn: 'Syntax', art: 'braces', meaningBn: 'কোড লেখার ব্যাকরণ। কোলন বা বন্ধনী ভুল হলে SyntaxError আসে।', module: 19 },
  { id: 'tech-undefined', termBn: 'তৈরি করা হয়নি', termEn: 'Undefined / not defined', art: 'code-brackets', meaningBn: 'এমন নাম ব্যবহার, যা আগে তৈরি করা হয়নি। বানান ভুলে প্রায়ই হয়।', module: 19 },
  { id: 'tech-expected', termBn: 'আশা করা হয়েছিল', termEn: 'Expected', art: 'lightbulb', meaningBn: 'এরর বলছে এখানে কী থাকার কথা ছিল। যেমন expected ‘:’।', module: 19 },
  { id: 'tech-unexpected', termBn: 'অপ্রত্যাশিত', termEn: 'Unexpected', art: 'question', meaningBn: 'এমন কিছু পাওয়া গেছে, যা ওখানে আশা করা হয়নি।', module: 19 },
  { id: 'tech-line', termBn: 'লাইন (সারি)', termEn: 'Line', art: 'stairs', meaningBn: 'কোডের একটি সারি। “line 7” মানে ৭ নম্বর সারি, সেখানে দেখুন।', module: 19 },
  { id: 'tech-traceback', termBn: 'ট্রেসব্যাক', termEn: 'Traceback', art: 'python-snake', meaningBn: 'পাইথনের এরর বার্তা। সবচেয়ে জরুরি তথ্য থাকে শেষ লাইনে।', module: 19 },
  { id: 'tech-console', termBn: 'কনসোল', termEn: 'Console', art: 'terminal', meaningBn: 'প্রোগ্রামের বার্তা আর এরর দেখার জায়গা। ব্রাউজারেও Console থাকে।', module: 19 },
  { id: 'tech-install', termBn: 'ইনস্টল করা', termEn: 'Install', art: 'package-box', meaningBn: 'কোনো প্রোগ্রাম কম্পিউটারে বসিয়ে ব্যবহারের উপযোগী করা।', module: 19 },
  { id: 'tech-update', termBn: 'আপডেট (নতুন করা)', termEn: 'Update', art: 'refresh', meaningBn: 'পুরোনো সংস্করণ বদলে নতুনটি আনা — ভুল সারে, নতুন সুবিধা আসে।', module: 19 },
  { id: 'tech-submit', termBn: 'জমা দেওয়া', termEn: 'Submit', art: 'upload', meaningBn: 'ফর্মের তথ্য পাঠিয়ে দেওয়ার বোতাম। চাপার আগে তথ্য দেখে নিন।', module: 19 },
  { id: 'tech-cancel', termBn: 'বাতিল করা', termEn: 'Cancel', art: 'undo', meaningBn: 'কাজটি না করে ফিরে যাওয়ার বোতাম। নিশ্চিত না হলে নিরাপদ।', module: 19 },
  { id: 'tech-settings', termBn: 'সেটিংস', termEn: 'Settings', art: 'gear', meaningBn: 'প্রোগ্রাম বা কম্পিউটারকে নিজের পছন্দমতো সাজানোর জায়গা।', module: 19 },
  { id: 'tech-login', termBn: 'লগইন / লগআউট', termEn: 'Login / Logout', art: 'key', meaningBn: 'লগইন: নাম-পাসওয়ার্ডে ঢোকা। লগআউট: বেরিয়ে আসা। কাজ শেষে লগআউট করুন।', module: 19 },
  { id: 'tech-server', termBn: 'সার্ভার', termEn: 'Server', art: 'server', meaningBn: 'যে কম্পিউটার ওয়েবসাইট চালায় এবং আপনার অনুরোধের উত্তর দেয়।', module: 19 },
  { id: 'tech-request', termBn: 'অনুরোধ (রিকোয়েস্ট)', termEn: 'Request', art: 'envelope', meaningBn: 'ব্রাউজার সার্ভারের কাছে কিছু চাইলে রিকোয়েস্ট; ফেরত এলে রেসপন্স।', module: 19 },
  { id: 'tech-connection', termBn: 'সংযোগ (কানেকশন)', termEn: 'Connection', art: 'wifi', meaningBn: 'দুটি যন্ত্রের যোগাযোগের পথ। “No connection” মানে সংযোগ নেই।', module: 19 },
  { id: 'tech-accepted-answer', termBn: 'মেনে নেওয়া উত্তর', termEn: 'Accepted answer', art: 'check', meaningBn: 'প্রশ্নকারী যে উত্তরকে কাজের বলে মেনেছেন, সবুজ টিক দিয়ে দেখানো।', module: 19 },
  { id: 'tech-ai-assistant', termBn: 'এআই সহকারী', termEn: 'AI assistant', art: 'robot', meaningBn: 'কথা বলার মতো প্রশ্ন করা যায় যে প্রোগ্রামে। ভুলও বলে, যাচাই করুন।', module: 19 },
  { id: 'tech-notebook', termBn: 'প্রোগ্রামিং নোটবুক', termEn: 'Notebook', art: 'notebook', meaningBn: 'অ্যাপের ভেতরে নিজের নোটের জায়গা: নতুন শব্দ, এরর আর সমাধান।', module: 19 },
]

export default entries
