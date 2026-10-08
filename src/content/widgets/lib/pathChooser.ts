/** Pure logic of the “কোন পথে আগে?” widget. The main roadmap is always the same; answers only pick the 2nd stop and the wording. */

export type Track = 'web' | 'js' | 'python'

export interface Option {
  id: string
  textBn: string
  /** votes added to tracks */
  votes: Partial<Record<Track, number>>
}
export interface Question {
  id: string
  textBn: string
  options: Option[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'make',
    textBn: 'কী বানাতে পারলে সবচেয়ে ভালো লাগবে?',
    options: [
      { id: 'page', textBn: 'নিজের সুন্দর একটি ওয়েবপেজ বা ছোট ওয়েবসাইট', votes: { web: 2, js: 1 } },
      { id: 'tool', textBn: 'হিসাব বা বারবার করা কাজ নিজে নিজে করে দেওয়া ছোট প্রোগ্রাম', votes: { python: 2 } },
      { id: 'play', textBn: 'বোতাম চাপলে নড়ে বা বদলে যায় এমন কিছু (ছোট খেলা, ক্যালকুলেটর)', votes: { js: 2, web: 1 } },
      { id: 'unsure', textBn: 'এখনো জানি না — আগে একটু দেখি', votes: { web: 1 } },
    ],
  },
  {
    id: 'curious',
    textBn: 'কোন বিষয়টি নিয়ে আপনার বেশি কৌতূহল?',
    options: [
      { id: 'design', textBn: 'রং, ছবি আর সাজানো', votes: { web: 2 } },
      { id: 'data', textBn: 'সংখ্যা, হিসাব, তথ্য, কৃত্রিম বুদ্ধিমত্তা (AI)', votes: { python: 2 } },
      { id: 'apps', textBn: 'ফোন-অ্যাপ বা ওয়েবসাইট কীভাবে কাজ করে', votes: { js: 2 } },
      { id: 'all', textBn: 'একটু একটু সবই', votes: {} },
    ],
  },
  {
    id: 'style',
    textBn: 'শিখতে কেমন লাগে?',
    options: [
      { id: 'see', textBn: 'চট করে চোখে দেখা ফল পেলে উৎসাহ বাড়ে', votes: { web: 2, js: 1 } },
      { id: 'logic', textBn: 'ধাপে ধাপে যুক্তি সাজাতে ভালো লাগে', votes: { python: 1, js: 1 } },
      { id: 'read', textBn: 'সহজ, প্রায় ইংরেজি বাক্যের মতো পড়া যায় এমন কিছু চাই', votes: { python: 2 } },
    ],
  },
  {
    id: 'goal',
    textBn: 'কেন শিখতে চান?',
    options: [
      { id: 'hobby', textBn: 'শখ ও নিজের আনন্দের জন্য', votes: { web: 1 } },
      { id: 'business', textBn: 'নিজের বা পরিবারের ব্যবসার জন্য ওয়েবসাইট', votes: { web: 1, js: 2 } },
      { id: 'career', textBn: 'ভবিষ্যতে কাজ বা চাকরির জন্য', votes: { python: 1, js: 1 } },
      { id: 'understand', textBn: 'কম্পিউটার কীভাবে ভাবে তা বুঝতে চাই', votes: { python: 1 } },
    ],
  },
]

export type Answers = Record<string, string>

export function tally(answers: Answers): Record<Track, number> {
  const t: Record<Track, number> = { web: 0, js: 0, python: 0 }
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.id === answers[q.id])
    if (!opt) continue
    for (const [k, v] of Object.entries(opt.votes)) t[k as Track] += v ?? 0
  }
  return t
}

export const answeredCount = (answers: Answers) => QUESTIONS.filter((q) => q.options.some((o) => o.id === answers[q.id])).length
export const isComplete = (answers: Answers) => answeredCount(answers) === QUESTIONS.length

export interface Roadmap {
  /** always HTML/CSS first */
  first: 'html-css'
  second: 'python' | 'javascript'
  third: 'python' | 'javascript'
}

export interface Recommendation {
  roadmap: Roadmap
  headlineBn: string
  whyBn: string[]
}

const NAME: Record<string, string> = { 'html-css': 'HTML ও CSS', python: 'Python', javascript: 'JavaScript' }
export const nameBn = (id: string) => NAME[id] ?? id

/** The main roadmap is HTML/CSS → (Python or JavaScript) → the other. Ties go to Python (easy to read). */
export function recommend(answers: Answers): Recommendation {
  const t = tally(answers)
  const second = t.js > t.python ? 'javascript' : 'python'
  const third = second === 'python' ? 'javascript' : 'python'
  const whyBn = ['HTML ও CSS দিয়ে শুরু, কারণ প্রতিটি লাইনের ফল সাথে সাথে পর্দায় দেখা যায় — আত্মবিশ্বাস দ্রুত বাড়ে।']
  if (second === 'python') {
    whyBn.push('তারপর Python — আপনার উত্তরগুলো হিসাব, ডেটা বা সহজ-পড়া ভাষার দিকে ইঙ্গিত করছে। Python-এর লেখা প্রায় ইংরেজি বাক্যের মতো, তাই যুক্তি শেখার জন্য ভালো।')
    whyBn.push('JavaScript তার পরে, যখন ওয়েবপেজে নড়াচড়া আনতে চাইবেন।')
  } else {
    whyBn.push('তারপর JavaScript — আপনার উত্তরগুলো ওয়েবপেজ বা বোতাম-নড়াচড়ার দিকে ইঙ্গিত করছে। HTML/CSS জানা থাকলে JavaScript-এ সেই পাতাকেই “জীবন্ত” করা যায়।')
    whyBn.push('Python তার পরে, হিসাব, ডেটা বা অটোমেশনের কাজের জন্য।')
  }
  whyBn.push('এটি শুধু একটি পরামর্শ। মনে হলে ক্রম বদলাতে পারেন — কোনো পথই ভুল নয়, কারণ প্রথম ভাষা শিখলে পরের ভাষা অনেক সহজ লাগে।')
  return {
    roadmap: { first: 'html-css', second, third },
    headlineBn: second === 'python' ? 'আপনার জন্য প্রস্তাব: HTML/CSS দিয়ে শুরু, তারপর Python' : 'আপনার জন্য প্রস্তাব: HTML/CSS দিয়ে শুরু, তারপর JavaScript',
    whyBn,
  }
}

/** The default roadmap shown before any answer. */
export const DEFAULT_ROADMAP: Roadmap = { first: 'html-css', second: 'python', third: 'javascript' }
