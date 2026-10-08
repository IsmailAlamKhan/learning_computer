/** Data + pure scoring for the "Spot the scam" exercise. All names, numbers and links are made up. */
export type CardKind = 'sms' | 'email' | 'call' | 'dm' | 'popup'
export type Area = 'from' | 'subject' | 'body' | 'link'

export interface Part {
  id: string
  area: Area
  text: string
  /** hotspot id this part belongs to (suspicious); absent for ordinary parts */
  hot?: string
}

export interface Hotspot {
  id: string
  labelBn: string
  whyBn: string
}

export interface ScamCard {
  id: string
  kind: CardKind
  isScam: boolean
  /** short caption above the mock, e.g. "এসএমএস" */
  captionBn: string
  parts: Part[]
  hotspots: Hotspot[]
  explanationBn: string
  /** what to do next, 1 line */
  doBn: string
}

export const CARDS: ScamCard[] = [
  {
    id: 'sms-pin',
    kind: 'sms',
    isScam: true,
    captionBn: 'এসএমএস (SMS)',
    parts: [
      { id: 'f', area: 'from', text: '01XXXXXXXXX', hot: 'number' },
      { id: 'b1', area: 'body', text: 'আপনার টাকাপে অ্যাকাউন্ট আজই বন্ধ হয়ে যাবে!', hot: 'urgent' },
      { id: 'b2', area: 'body', text: ' বন্ধ ঠেকাতে এখনই' },
      { id: 'l', area: 'link', text: 'http://takapay-verify.example/login', hot: 'link' },
      { id: 'b3', area: 'body', text: ' এ গিয়ে আপনার PIN দিন।', hot: 'pin' },
    ],
    hotspots: [
      { id: 'number', labelBn: 'সাধারণ মোবাইল নম্বর থেকে এসেছে', whyBn: 'সত্যিকারের প্রতিষ্ঠান সাধারণত নিজের নামে বার্তা পাঠায়। সাধারণ নম্বর থেকে এলে সাবধান।' },
      { id: 'urgent', labelBn: 'তাড়া দেওয়া হচ্ছে', whyBn: '“আজই বন্ধ হয়ে যাবে” — তাড়া দিয়ে ভাবার সময় কেড়ে নেওয়া প্রতারকদের পুরোনো কৌশল।' },
      { id: 'link', labelBn: 'অদ্ভুত লিংক', whyBn: 'ঠিকানাটি takapay.example নয়, takapay-verify.example — দেখতে কাছাকাছি, কিন্তু আলাদা ঠিকানা।' },
      { id: 'pin', labelBn: 'PIN চাওয়া হচ্ছে', whyBn: 'PIN কখনোই কোনো লিংকে বা ফোনে দেওয়ার জিনিস নয়। আসল অ্যাপ কখনও এভাবে PIN চায় না।' },
    ],
    explanationBn: 'এটি প্রতারণার বার্তা। তাড়া, অচেনা লিংক আর PIN চাওয়া — তিনটি একসাথে থাকলে প্রায় নিশ্চিত প্রতারণা।',
    doBn: 'লিংকে যাবেন না, উত্তর দেবেন না। চাইলে নিজে অফিসিয়াল অ্যাপ খুলে দেখুন সব ঠিক আছে কিনা।',
  },
  {
    id: 'sms-received',
    kind: 'sms',
    isScam: false,
    captionBn: 'এসএমএস (SMS)',
    parts: [
      { id: 'f', area: 'from', text: 'TakaPay' },
      { id: 'b1', area: 'body', text: 'আপনি 500.00 টাকা পেয়েছেন।' },
      { id: 'b2', area: 'body', text: ' ট্রান্সফার আইডি: 9XXXXXXXXX।' },
      { id: 'b3', area: 'body', text: ' ব্যালেন্স দেখতে অ্যাপ খুলুন।' },
    ],
    hotspots: [],
    explanationBn: 'এটি সাধারণ লেনদেনের খবর। কোনো লিংক নেই, কোনো কোড বা PIN চাইছে না, তাড়াও দিচ্ছে না — শুধু জানাচ্ছে।',
    doBn: 'সন্দেহ হলে নিজে অ্যাপ খুলে লেনদেনের তালিকা মিলিয়ে নিন। সবকিছুতে ভয় পাওয়ার দরকার নেই।',
  },
  {
    id: 'sms-otp',
    kind: 'sms',
    isScam: false,
    captionBn: 'এসএমএস (SMS)',
    parts: [
      { id: 'f', area: 'from', text: 'NamunaBank' },
      { id: 'b1', area: 'body', text: 'আপনার ওয়ান-টাইম কোড (OTP): 4XXXXX।' },
      { id: 'b2', area: 'body', text: ' এটি কাউকে বলবেন না। মেয়াদ ৩ মিনিট।' },
    ],
    hotspots: [],
    explanationBn: 'এটি সত্যিকারের OTP-র বার্তা হতে পারে — যদি এই মুহূর্তে আপনি নিজে লগইন বা লেনদেন করছিলেন। বার্তাটি নিজেই “কাউকে বলবেন না” বলছে। বিপদ তখনই, যখন কেউ ফোনে এই কোডটি চায়।',
    doBn: 'আপনি কিছু না করলে হঠাৎ এমন কোড এলে কাউকে না জানিয়ে বার্তাটি উপেক্ষা করুন, আর অ্যাকাউন্টের পাসওয়ার্ড বদলে নিন।',
  },
  {
    id: 'email-lock',
    kind: 'email',
    isScam: true,
    captionBn: 'ইমেইল (Email)',
    parts: [
      { id: 'f', area: 'from', text: 'TakaPay Support <help@takapay-secure.example>', hot: 'sender' },
      { id: 's', area: 'subject', text: 'জরুরি: আপনার অ্যাকাউন্ট লক করা হয়েছে', hot: 'urgent' },
      { id: 'b1', area: 'body', text: 'প্রিয় গ্রাহক,', hot: 'generic' },
      { id: 'b2', area: 'body', text: ' আপনার অ্যাকাউন্টে অস্বাভাবিক কাজ ধরা পড়েছে। ২৪ ঘণ্টার মধ্যে তথ্য যাচাই না করলে অ্যাকাউন্ট বন্ধ হবে।' },
      { id: 'l', area: 'link', text: 'www.takapay.example/verify', hot: 'link' },
    ],
    hotspots: [
      { id: 'sender', labelBn: 'প্রেরকের ঠিকানা মেলে না', whyBn: 'প্রেরকের ডোমেইন takapay-secure.example — আসল takapay.example নয়।' },
      { id: 'urgent', labelBn: 'জরুরি তাড়া', whyBn: 'জরুরি, লক, ২৪ ঘণ্টা — ভয় ধরিয়ে তাড়াহুড়ো করানো হচ্ছে।' },
      { id: 'generic', labelBn: 'নাম নেই, “প্রিয় গ্রাহক”', whyBn: 'আসল প্রতিষ্ঠান অনেক সময় আপনার নাম জানে। সবাইকে এক ভাষায় লেখা চিঠি সন্দেহের লক্ষণ।' },
      { id: 'link', labelBn: 'লিংকের লেখা আর আসল ঠিকানা আলাদা', whyBn: 'লেখা আছে takapay.example, কিন্তু মাউস রাখলে আসল গন্তব্য দেখা যায় অন্য ঠিকানা। (হোভার করলে নিচে আসল ঠিকানা ভেসে ওঠে।)' },
    ],
    explanationBn: 'এটি ফিশিং (Phishing) ইমেইল — আসলের মতো সাজানো, কিন্তু ভেতরে ফাঁদ। প্রেরকের ঠিকানা আর লিংক দুটোই মেলে না।',
    doBn: 'লিংকে ক্লিক করবেন না। ইমেইলটি “Spam/Junk” হিসেবে জানিয়ে মুছে ফেলুন। দরকার হলে নিজে অফিসিয়াল ওয়েবসাইট বা অ্যাপ খুলুন।',
  },
  {
    id: 'email-statement',
    kind: 'email',
    isScam: false,
    captionBn: 'ইমেইল (Email)',
    parts: [
      { id: 'f', area: 'from', text: 'Namuna Bank <no-reply@namunabank.example>' },
      { id: 's', area: 'subject', text: 'আপনার মাসিক স্টেটমেন্ট প্রস্তুত' },
      { id: 'b1', area: 'body', text: 'প্রিয় রুমা,' },
      { id: 'b2', area: 'body', text: ' আপনার সেপ্টেম্বর মাসের স্টেটমেন্ট তৈরি হয়েছে। দেখতে নিজের ব্যাংকিং অ্যাপে লগইন করুন। এই ইমেইলে আমরা কখনও পাসওয়ার্ড বা OTP চাই না।' },
    ],
    hotspots: [],
    explanationBn: 'এটি স্বাভাবিক। প্রেরকের ঠিকানা মিলছে, আপনার নাম আছে, কোনো সন্দেহজনক লিংক নেই, তাড়াও নেই — আর নিজের অ্যাপ খুলে দেখতে বলছে।',
    doBn: 'নিজের অ্যাপ বা ব্রাউজারে ঠিকানা লিখে ঢুকে দেখে নিন।',
  },
  {
    id: 'call-otp',
    kind: 'call',
    isScam: true,
    captionBn: 'ফোন কল (Call)',
    parts: [
      { id: 'f', area: 'from', text: 'অচেনা নম্বর: 01XXXXXXXXX', hot: 'unknown' },
      { id: 'b1', area: 'body', text: '“হ্যালো ম্যাডাম, আমি নমুনা ব্যাংকের কাস্টমার কেয়ার থেকে বলছি।' },
      { id: 'b2', area: 'body', text: ' আপনার কার্ডে সন্দেহজনক লেনদেন হচ্ছে, এখনই ব্লক হয়ে যাবে।', hot: 'urgent' },
      { id: 'b3', area: 'body', text: ' বাঁচাতে আপনার ফোনে যে ৬ সংখ্যার কোডটি গেল, সেটি আমাকে বলুন।', hot: 'otp' },
      { id: 'b4', area: 'body', text: ' আর এ কথা কাউকে বলবেন না।”', hot: 'secret' },
    ],
    hotspots: [
      { id: 'unknown', labelBn: 'ওরা আপনাকে ফোন করেছে', whyBn: 'ব্যাংক বা মোবাইল ব্যাংকিং প্রতিষ্ঠান ফোনে আপনার গোপন তথ্য যাচাই করে না।' },
      { id: 'urgent', labelBn: 'ভয় ও তাড়া', whyBn: '“এখনই ব্লক হয়ে যাবে” — এই ভয়টাই প্রতারকের হাতিয়ার।' },
      { id: 'otp', labelBn: 'OTP চাইছে', whyBn: 'OTP বলা মানে আপনার অ্যাকাউন্টের চাবি তুলে দেওয়া। কোনো কর্মীর এটি জানার দরকার নেই।' },
      { id: 'secret', labelBn: '“কাউকে বলবেন না”', whyBn: 'আসল প্রতিষ্ঠান কখনও গোপন রাখতে বলে না। এটি আপনাকে একা করে দেওয়ার চেষ্টা।' },
    ],
    explanationBn: 'এটি প্রতারণার কল। সোনালি নিয়ম: OTP আর PIN কাউকে বলা যাবে না — যে-ই হোক, যত আসল শোনাক।',
    doBn: 'কল কেটে দিন। তারপর অ্যাপ বা কার্ডের পেছনে দেওয়া অফিসিয়াল নম্বরে নিজে ফোন করে জানুন।',
  },
  {
    id: 'dm-friend',
    kind: 'dm',
    isScam: true,
    captionBn: 'সোশ্যাল মিডিয়া মেসেজ (DM)',
    parts: [
      { id: 'f', area: 'from', text: 'রিমি (বান্ধবী)' },
      { id: 'b1', area: 'body', text: 'রুমা, খুব বিপদে পড়েছি!', hot: 'urgent' },
      { id: 'b2', area: 'body', text: ' আমার ফোনটা ঠিক নেই, ফোন করা যাচ্ছে না।', hot: 'nocall' },
      { id: 'b3', area: 'body', text: ' এখনই ৫,০০০ টাকা এই নম্বরে বিকাশ করো: 01XXXXXXXXX। কাল ফেরত দেব।', hot: 'money' },
    ],
    hotspots: [
      { id: 'urgent', labelBn: 'হঠাৎ বিপদের গল্প', whyBn: 'বন্ধুর অ্যাকাউন্ট হ্যাক হলে প্রতারক বন্ধু সেজে এমন গল্প বলে।' },
      { id: 'nocall', labelBn: 'ফোনে কথা বলতে চায় না', whyBn: 'কণ্ঠ শুনলে ধরা পড়ে যাবে, তাই ফোন করা এড়াতে চায়।' },
      { id: 'money', labelBn: 'অচেনা নম্বরে টাকা চাওয়া', whyBn: 'নম্বরটি বন্ধুর নিজের নয়। টাকা পাঠালে ফেরত পাওয়া খুব কঠিন।' },
    ],
    explanationBn: 'বন্ধুর নামে আসা এই বার্তাটি সম্ভবত হ্যাক হওয়া অ্যাকাউন্ট থেকে এসেছে। টাকা চাওয়ার বার্তা পেলে আগে অন্য উপায়ে নিশ্চিত হওয়া দরকার।',
    doBn: 'টাকা পাঠাবেন না। বন্ধুকে তার পরিচিত নম্বরে ফোন করে জিজ্ঞেস করুন, আর অ্যাকাউন্টটি Report করুন।',
  },
  {
    id: 'sms-lottery',
    kind: 'sms',
    isScam: true,
    captionBn: 'এসএমএস (SMS)',
    parts: [
      { id: 'f', area: 'from', text: 'LuckyDraw' },
      { id: 'b1', area: 'body', text: 'অভিনন্দন! আপনি “মেগা লাকি ড্র”-এ 5,00,000 টাকা জিতেছেন!', hot: 'prize' },
      { id: 'b2', area: 'body', text: ' পুরস্কার পেতে প্রথমে প্রসেসিং ফি 2,000 টাকা পাঠান 01XXXXXXXXX নম্বরে।', hot: 'fee' },
      { id: 'b3', area: 'body', text: ' আজই না পাঠালে পুরস্কার বাতিল।', hot: 'urgent' },
    ],
    hotspots: [
      { id: 'prize', labelBn: 'না-খেলা লটারিতে জেতা', whyBn: 'আপনি কোনো লটারিতে অংশ না নিলে জেতার প্রশ্নই আসে না।' },
      { id: 'fee', labelBn: 'আগে টাকা পাঠাতে বলছে', whyBn: 'আসল পুরস্কার পেতে আগে টাকা দিতে হয় না। এটাই সবচেয়ে বড় লক্ষণ।' },
      { id: 'urgent', labelBn: 'সময়ের চাপ', whyBn: '“আজই” বলে ভাবার সুযোগ কমিয়ে দিচ্ছে।' },
    ],
    explanationBn: 'এটি ভুয়া পুরস্কারের বার্তা। “জিতেছেন, কিন্তু আগে টাকা দিন” — এই ছাঁচ দেখলেই বুঝবেন প্রতারণা।',
    doBn: 'উত্তর দেবেন না, টাকা পাঠাবেন না। বার্তাটি মুছে নম্বরটি ব্লক করে দিন।',
  },
  {
    id: 'popup-virus',
    kind: 'popup',
    isScam: true,
    captionBn: 'ওয়েবসাইটের পপ-আপ (Pop-up)',
    parts: [
      { id: 'f', area: 'from', text: 'সতর্কতা — আপনার কম্পিউটার', hot: 'official-look' },
      { id: 'b1', area: 'body', text: '৫টি ভাইরাস পাওয়া গেছে! আপনার সব ফাইল ও ব্যাংকের তথ্য এখন বিপদে।', hot: 'scare' },
      { id: 'b2', area: 'body', text: ' এখনই কল করুন: 01XXXXXXXXX অথবা নিচের বোতামে চাপুন।', hot: 'call' },
      { id: 'l', area: 'link', text: '[ এখনই ঠিক করুন ]', hot: 'button' },
    ],
    hotspots: [
      { id: 'official-look', labelBn: 'সিস্টেমের সতর্কতার ভান', whyBn: 'ওয়েবসাইট আপনার কম্পিউটারের ভাইরাস দেখতে পারে না; এটি শুধু ওয়েবসাইটের ছবি।' },
      { id: 'scare', labelBn: 'ভয় দেখানো', whyBn: 'বড় বড় ভয়ের কথা — ভাবার আগেই ক্লিক করাতে চায়।' },
      { id: 'call', labelBn: 'ফোন নম্বরে কল করতে বলছে', whyBn: 'সাধারণ ওয়েবসাইট আপনাকে ফোন করে সাহায্য নিতে বলে না।' },
      { id: 'button', labelBn: 'বোতামে চাপ দিতে বলছে', whyBn: 'এই বোতাম আসলে অচেনা কিছু নামিয়ে দিতে পারে।' },
    ],
    explanationBn: 'এটি ভুয়া সতর্কবার্তা। ওয়েবসাইট আপনার কম্পিউটারে ভাইরাস খুঁজে পায় না।',
    doBn: 'কিছুতে ক্লিক না করে ট্যাব বা ব্রাউজারটি বন্ধ করে দিন (✕ বা Alt+F4 / Cmd+Q)।',
  },
]

export interface CardEvaluation {
  /** her Safe/Scam choice matched */
  correct: boolean
  foundHotspots: string[]
  missedHotspots: string[]
  /** parts she tapped that are not suspicious */
  extraTaps: string[]
}

/** Scoring: the verdict decides "correct". Hotspot taps only drive the explanation, so a good eye is never punished. */
export function evaluateCard(card: ScamCard, tapped: string[], verdictScam: boolean): CardEvaluation {
  const tappedSet = new Set(tapped)
  const hotIds = [...new Set(card.parts.filter((p) => p.hot).map((p) => p.hot!))]
  const found = hotIds.filter((h) => card.parts.some((p) => p.hot === h && tappedSet.has(p.id)))
  return {
    correct: verdictScam === card.isScam,
    foundHotspots: found,
    missedHotspots: hotIds.filter((h) => !found.includes(h)),
    extraTaps: card.parts.filter((p) => !p.hot && tappedSet.has(p.id)).map((p) => p.id),
  }
}

export function finalMessageBn(score: number, total: number): string {
  const r = total === 0 ? 0 : score / total
  if (r === 1) return 'দারুণ! আপনার চোখ বেশ ধারালো। মনে রাখুন: সন্দেহ হলে থামুন, নিজে যাচাই করুন।'
  if (r >= 0.7) return 'খুব ভালো করেছেন! যেগুলো ভুল হয়েছে সেগুলোর ব্যাখ্যা আবার পড়ে নিলে আরও পাকা হবেন।'
  return 'শুরুর জন্য ঠিকই আছে। প্রতারকেরা পাকা হয়, তাই অভ্যাসই আসল। আরেকবার খেলে দেখুন।'
}
