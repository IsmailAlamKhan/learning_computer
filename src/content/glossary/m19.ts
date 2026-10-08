import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'tech-error', termBn: 'এরর (ভুল)', termEn: 'Error', meaningBn: 'কিছু ঠিকমতো হয়নি — এটা জানানোর বার্তা বা ধরন। এরর মানে আপনার ব্যর্থতা নয়; এটা কম্পিউটারের দেওয়া সূত্র, যা পড়ে ভুলটা খুঁজে পাওয়া যায়।', module: 19 },
  { id: 'tech-warning', termBn: 'সতর্কবার্তা', termEn: 'Warning', meaningBn: 'কাজ থামেনি, কিন্তু কিছু একটা খেয়াল রাখার আছে — এমন বার্তা। যেমন “Unsaved changes”।', module: 19 },
  { id: 'tech-failed', termBn: 'ব্যর্থ হওয়া', termEn: 'Failed', meaningBn: 'কোনো কাজ শেষ করা যায়নি। যেমন “Upload failed” মানে আপলোডটি হয়নি। কেন হয়নি, সেটি সাধারণত পরের লাইনে লেখা থাকে।', module: 19 },
  { id: 'tech-invalid', termBn: 'ঠিক নয় (নিয়ম মেলেনি)', termEn: 'Invalid', meaningBn: 'আপনি যা দিয়েছেন তা নিয়মমতো নয়। যেমন “Invalid password” — পাসওয়ার্ড মেলেনি, অথবা নিয়ম মানেনি।', module: 19 },
  { id: 'tech-missing', termBn: 'নেই / হারানো', termEn: 'Missing', meaningBn: 'যা থাকার কথা ছিল তা পাওয়া যাচ্ছে না। যেমন “Missing file”।', module: 19 },
  { id: 'tech-not-found', termBn: 'খুঁজে পাওয়া যায়নি', termEn: 'Not found', meaningBn: 'ফাইল, ফোল্ডার বা ওয়েব পাতা ওই ঠিকানায় নেই। নাম বা ঠিকানার বানান আর জায়গা আবার দেখুন।', module: 19 },
  { id: 'tech-permission-denied', termBn: 'অনুমতি নেই', termEn: 'Permission denied', meaningBn: 'এই কাজটি করার অনুমতি আপনার নেই (বা প্রোগ্রামের নেই)। কেন নেই না বুঝে অনুমতি জোর করে বদলাবেন না।', module: 19 },
  { id: 'tech-timeout', termBn: 'সময় শেষ', termEn: 'Timeout', meaningBn: 'অনেকক্ষণ অপেক্ষার পরও সাড়া না পাওয়ায় কাজটি থামিয়ে দেওয়া। সাধারণত ইন্টারনেট ধীর হলে বা সার্ভার ব্যস্ত থাকলে হয়।', module: 19 },
  { id: 'tech-deprecated', termBn: 'পুরোনো (বাদ যাওয়ার পথে)', termEn: 'Deprecated', meaningBn: 'কোনো সুবিধা এখনো চলে, কিন্তু ভবিষ্যতে বাদ যাবে — তাই নতুন কাজে আরেকটি পদ্ধতি ব্যবহার করতে বলা হয়। এটি সাধারণত সতর্কবার্তা, জরুরি ভুল নয়।', module: 19 },
  { id: 'tech-syntax', termBn: 'সিনট্যাক্স (লেখার নিয়ম)', termEn: 'Syntax', meaningBn: 'কোড লেখার ব্যাকরণ। যেমন বন্ধনী বা কোলন (:) ভুল জায়গায় থাকলে “SyntaxError” আসে।', module: 19 },
  { id: 'tech-undefined', termBn: 'তৈরি করা হয়নি', termEn: 'Undefined / not defined', meaningBn: 'কোডে এমন একটি নাম ব্যবহার করা হয়েছে যা আগে কখনো তৈরি করা হয়নি। বানান ভুল হলে প্রায়ই এটা হয়।', module: 19 },
  { id: 'tech-expected', termBn: 'আশা করা হয়েছিল', termEn: 'Expected', meaningBn: 'এরর বার্তায় বলা হয় এখানে কী থাকার কথা ছিল। যেমন “expected ‘:’” — একটি কোলন চিহ্ন থাকার কথা ছিল।', module: 19 },
  { id: 'tech-unexpected', termBn: 'অপ্রত্যাশিত', termEn: 'Unexpected', meaningBn: 'এমন কিছু পাওয়া গেছে যা ওখানে আশা করা হয়নি। যেমন “unexpected token” — ওই জায়গায় একটি অচেনা চিহ্ন বা শব্দ এসেছে।', module: 19 },
  { id: 'tech-line', termBn: 'লাইন (সারি)', termEn: 'Line', meaningBn: 'কোডের একটি সারি। এরর বার্তায় “line 7” মানে ৭ নম্বর সারি, যেখানে গিয়ে দেখতে হবে।', module: 19 },
  { id: 'tech-traceback', termBn: 'ট্রেসব্যাক', termEn: 'Traceback', meaningBn: 'পাইথনের এরর বার্তা, যা ধাপে ধাপে দেখায় প্রোগ্রাম কোন পথে ভুলের জায়গায় পৌঁছাল। সবচেয়ে জরুরি তথ্য থাকে শেষ লাইনে।', module: 19 },
  { id: 'tech-console', termBn: 'কনসোল', termEn: 'Console', meaningBn: 'প্রোগ্রামের বার্তা আর এরর দেখার জায়গা। ব্রাউজারেও জাভাস্ক্রিপ্টের Console থাকে।', module: 19 },
  { id: 'tech-install', termBn: 'ইনস্টল করা', termEn: 'Install', meaningBn: 'কোনো প্রোগ্রাম কম্পিউটারে বসিয়ে ব্যবহারের উপযোগী করা।', module: 19 },
  { id: 'tech-update', termBn: 'আপডেট (নতুন করা)', termEn: 'Update', meaningBn: 'প্রোগ্রামের পুরোনো সংস্করণ বদলে নতুনটি আনা, যাতে ভুল সারে ও নতুন সুবিধা আসে।', module: 19 },
  { id: 'tech-submit', termBn: 'জমা দেওয়া', termEn: 'Submit', meaningBn: 'ফর্মের তথ্য ভরে পাঠিয়ে দেওয়ার বোতাম। চাপার আগে তথ্য ঠিক আছে কি না দেখে নিন।', module: 19 },
  { id: 'tech-cancel', termBn: 'বাতিল করা', termEn: 'Cancel', meaningBn: 'কাজটি না করেই ফিরে যাওয়ার বোতাম। নিশ্চিত না হলে Cancel চাপা নিরাপদ।', module: 19 },
  { id: 'tech-settings', termBn: 'সেটিংস', termEn: 'Settings', meaningBn: 'প্রোগ্রাম বা কম্পিউটারকে নিজের পছন্দমতো সাজানোর জায়গা।', module: 19 },
  { id: 'tech-login', termBn: 'লগইন / লগআউট', termEn: 'Login / Logout', meaningBn: 'লগইন (Sign in) মানে নাম ও পাসওয়ার্ড দিয়ে অ্যাকাউন্টে ঢোকা; লগআউট (Sign out) মানে বেরিয়ে আসা। অন্যের কম্পিউটারে কাজ শেষে লগআউট করতে ভুলবেন না।', module: 19 },
  { id: 'tech-server', termBn: 'সার্ভার', termEn: 'Server', meaningBn: 'যে কম্পিউটার ওয়েবসাইট বা সেবা চালায় এবং আপনার অনুরোধের উত্তর দেয়।', module: 19 },
  { id: 'tech-request', termBn: 'অনুরোধ (রিকোয়েস্ট)', termEn: 'Request', meaningBn: 'আপনার ব্রাউজার বা প্রোগ্রাম সার্ভারের কাছে কিছু চেয়ে পাঠালে সেটি রিকোয়েস্ট। সার্ভার যা ফেরত পাঠায় তা রেসপন্স (Response)।', module: 19 },
  { id: 'tech-connection', termBn: 'সংযোগ (কানেকশন)', termEn: 'Connection', meaningBn: 'দুটি যন্ত্রের মধ্যে যোগাযোগের পথ, যেমন আপনার ফোন ও ইন্টারনেটের মধ্যে। “No connection” মানে সংযোগ নেই।', module: 19 },
  { id: 'tech-accepted-answer', termBn: 'মেনে নেওয়া উত্তর', termEn: 'Accepted answer', meaningBn: 'প্রশ্নের নিচে প্রশ্নকারী যে উত্তরটি কাজের বলে মেনে নিয়েছেন, সাধারণত সবুজ টিক চিহ্ন দিয়ে দেখানো থাকে। তারিখ ও ভার্সন মিলিয়ে দেখে নেবেন।', module: 19 },
  { id: 'tech-ai-assistant', termBn: 'এআই সহকারী', termEn: 'AI assistant', meaningBn: 'যে প্রোগ্রামের সাথে কথা বলার মতো করে প্রশ্ন করা যায়। এটি শেখার সহায়ক হতে পারে, কিন্তু আত্মবিশ্বাসের সাথে ভুলও বলতে পারে — তাই যাচাই করে নিতে হয়।', module: 19 },
  { id: 'tech-notebook', termBn: 'প্রোগ্রামিং নোটবুক', termEn: 'Notebook', meaningBn: 'এই অ্যাপের ভেতরে আপনার নিজের নোট রাখার জায়গা: নতুন শব্দ, পাওয়া এরর আর তার সমাধান। নোটগুলো এই ব্রাউজারেই থাকে।', module: 19 },
]

export default entries
