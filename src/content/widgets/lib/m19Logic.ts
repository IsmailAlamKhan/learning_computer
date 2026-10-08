/** Module 19 pure logic: tech English words, the error reader, the question builder. No React here. */

// ---------------------------------------------------------------------------------------------------------------------
// Tech words
// ---------------------------------------------------------------------------------------------------------------------
export type WordCategory = 'errors' | 'actions' | 'files' | 'web' | 'coding'

export const WORD_CATEGORIES: { id: WordCategory; labelBn: string }[] = [
  { id: 'errors', labelBn: 'এরর ও বার্তা' },
  { id: 'actions', labelBn: 'কাজ ও বোতাম' },
  { id: 'files', labelBn: 'ফাইল ও ফোল্ডার' },
  { id: 'web', labelBn: 'ওয়েব ও ইন্টারনেট' },
  { id: 'coding', labelBn: 'কোডের শব্দ' },
]

export interface TechWord {
  id: string
  en: string
  bn: string
  cat: WordCategory
  /** how it appears on a screen */
  example: string
  /** a short Bengali hint about the example */
  exampleBn: string
}

export const TECH_WORDS: TechWord[] = [
  // errors & messages
  { id: 'error', en: 'error', bn: 'ভুল / সমস্যা', cat: 'errors', example: 'Error: something went wrong', exampleBn: 'কিছু একটা ঠিকমতো হয়নি' },
  { id: 'warning', en: 'warning', bn: 'সতর্কবার্তা', cat: 'errors', example: 'Warning: unsaved changes', exampleBn: 'সাবধান — এখনই কাজ থামেনি, কিন্তু খেয়াল রাখুন' },
  { id: 'failed', en: 'failed', bn: 'ব্যর্থ হয়েছে', cat: 'errors', example: 'Upload failed', exampleBn: 'আপলোডের কাজটি হয়নি' },
  { id: 'invalid', en: 'invalid', bn: 'ঠিক নয় (নিয়ম মেলেনি)', cat: 'errors', example: 'Invalid password', exampleBn: 'পাসওয়ার্ডটি মেলেনি বা নিয়ম মানেনি' },
  { id: 'missing', en: 'missing', bn: 'নেই / হারিয়ে গেছে', cat: 'errors', example: 'Missing file: logo.png', exampleBn: 'logo.png ফাইলটি খুঁজে পাওয়া যাচ্ছে না' },
  { id: 'not-found', en: 'not found', bn: 'খুঁজে পাওয়া যায়নি', cat: 'errors', example: 'File not found', exampleBn: 'ফাইলটি খুঁজে পাওয়া যায়নি' },
  { id: 'permission-denied', en: 'permission denied', bn: 'অনুমতি নেই', cat: 'errors', example: 'Permission denied', exampleBn: 'এই কাজের অনুমতি আপনার নেই' },
  { id: 'timeout', en: 'timeout', bn: 'সময় শেষ', cat: 'errors', example: 'Connection timed out', exampleBn: 'অনেকক্ষণ অপেক্ষা করেও সাড়া মেলেনি' },
  { id: 'unexpected', en: 'unexpected', bn: 'অপ্রত্যাশিত', cat: 'errors', example: 'Unexpected error occurred', exampleBn: 'যা আশা করা হয়নি এমন কিছু ঘটেছে' },
  { id: 'deprecated', en: 'deprecated', bn: 'পুরোনো (ভবিষ্যতে বাদ যাবে)', cat: 'errors', example: 'This function is deprecated', exampleBn: 'এখনো চলে, কিন্তু নতুন কাজে আর ব্যবহার করার কথা নয়' },
  // actions & buttons
  { id: 'install', en: 'install', bn: 'ইনস্টল করা', cat: 'actions', example: 'Install', exampleBn: 'প্রোগ্রামটি কম্পিউটারে বসানোর বোতাম' },
  { id: 'update', en: 'update', bn: 'আপডেট করা (নতুন করা)', cat: 'actions', example: 'Update available', exampleBn: 'নতুন সংস্করণ পাওয়া যাচ্ছে' },
  { id: 'submit', en: 'submit', bn: 'জমা দেওয়া', cat: 'actions', example: 'Submit', exampleBn: 'ফর্ম ভরে জমা দেওয়ার বোতাম' },
  { id: 'cancel', en: 'cancel', bn: 'বাতিল করা', cat: 'actions', example: 'Cancel', exampleBn: 'কাজটা না করে ফিরে যাওয়ার বোতাম' },
  { id: 'confirm', en: 'confirm', bn: 'নিশ্চিত করা', cat: 'actions', example: 'Confirm', exampleBn: '“হ্যাঁ, করুন” বলার বোতাম' },
  { id: 'settings', en: 'settings', bn: 'সেটিংস', cat: 'actions', example: 'Settings', exampleBn: 'পছন্দমতো ঠিক করার জায়গা' },
  { id: 'login', en: 'login / sign in', bn: 'লগইন (ঢোকা)', cat: 'actions', example: 'Sign in', exampleBn: 'নাম-পাসওয়ার্ড দিয়ে ভেতরে ঢোকা' },
  { id: 'logout', en: 'logout / sign out', bn: 'লগআউট (বেরোনো)', cat: 'actions', example: 'Sign out', exampleBn: 'অ্যাকাউন্ট থেকে বেরিয়ে আসা' },
  { id: 'retry', en: 'retry', bn: 'আবার চেষ্টা', cat: 'actions', example: 'Retry', exampleBn: 'একই কাজ আরেকবার চেষ্টা করার বোতাম' },
  { id: 'next', en: 'next', bn: 'পরবর্তী', cat: 'actions', example: 'Next', exampleBn: 'পরের ধাপে যাওয়ার বোতাম' },
  // files & folders
  { id: 'file', en: 'file', bn: 'ফাইল', cat: 'files', example: 'notes.txt', exampleBn: 'লেখা, ছবি বা গান রাখা একটি জিনিস' },
  { id: 'folder', en: 'folder / directory', bn: 'ফোল্ডার', cat: 'files', example: 'No such file or directory', exampleBn: 'ফাইল বা ফোল্ডারের এমন নাম নেই' },
  { id: 'path', en: 'path', bn: 'পথ (ঠিকানা)', cat: 'files', example: 'C:\\Users\\Ruma\\notes.txt', exampleBn: 'ফাইলটি কোথায় আছে তার ঠিকানা' },
  { id: 'extension', en: 'extension', bn: 'এক্সটেনশন', cat: 'files', example: '.txt  .py  .png', exampleBn: 'নামের শেষে ফাইলের ধরন বোঝায়' },
  { id: 'save', en: 'save', bn: 'সেভ করা', cat: 'files', example: 'Save changes?', exampleBn: 'বদলগুলো রেখে দিতে চান?' },
  { id: 'read-only', en: 'read-only', bn: 'শুধু পড়া যায়', cat: 'files', example: 'This file is read-only', exampleBn: 'ফাইলটি দেখা যায়, বদলানো যায় না' },
  // web & internet
  { id: 'connection', en: 'connection', bn: 'সংযোগ', cat: 'web', example: 'No connection', exampleBn: 'ইন্টারনেটের সাথে যোগ নেই' },
  { id: 'server', en: 'server', bn: 'সার্ভার', cat: 'web', example: 'Server not responding', exampleBn: 'যে কম্পিউটার ওয়েবসাইট চালায় সে সাড়া দিচ্ছে না' },
  { id: 'request', en: 'request', bn: 'অনুরোধ', cat: 'web', example: 'Request failed', exampleBn: 'কিছু চেয়ে পাঠানো কাজটি হয়নি' },
  { id: 'response', en: 'response', bn: 'উত্তর', cat: 'web', example: 'Empty response', exampleBn: 'সার্ভারের পাঠানো জবাব' },
  { id: 'offline', en: 'offline', bn: 'অফলাইন (ইন্টারনেট ছাড়া)', cat: 'web', example: 'You are offline', exampleBn: 'এখন ইন্টারনেট নেই' },
  { id: 'download', en: 'download', bn: 'ডাউনলোড', cat: 'web', example: 'Download complete', exampleBn: 'ইন্টারনেট থেকে নামানো শেষ' },
  { id: 'upload', en: 'upload', bn: 'আপলোড', cat: 'web', example: 'Uploading…', exampleBn: 'আপনার ফাইল ইন্টারনেটে পাঠানো হচ্ছে' },
  { id: 'password', en: 'password', bn: 'পাসওয়ার্ড', cat: 'web', example: 'Enter your password', exampleBn: 'গোপন শব্দ লিখুন' },
  // coding words
  { id: 'syntax', en: 'syntax', bn: 'লেখার নিয়ম (ব্যাকরণ)', cat: 'coding', example: 'SyntaxError: invalid syntax', exampleBn: 'কোড লেখার নিয়মে ভুল আছে' },
  { id: 'undefined', en: 'undefined', bn: 'তৈরি করা হয়নি (undefined)', cat: 'coding', example: 'name \'x\' is not defined', exampleBn: 'x নামটি আগে তৈরি করা হয়নি' },
  { id: 'expected', en: 'expected', bn: 'আশা করা হয়েছিল', cat: 'coding', example: "SyntaxError: expected ':'", exampleBn: 'এখানে একটি “:” থাকার কথা ছিল' },
  { id: 'line', en: 'line', bn: 'লাইন (সারি)', cat: 'coding', example: 'File "app.py", line 3', exampleBn: 'app.py ফাইলের ৩ নম্বর লাইন' },
  { id: 'variable', en: 'variable', bn: 'ভেরিয়েবল', cat: 'coding', example: 'name = "Ruma"', exampleBn: 'মান রাখার নামওয়ালা বাক্স' },
  { id: 'function', en: 'function', bn: 'ফাংশন', cat: 'coding', example: 'print("hi")', exampleBn: 'নির্দিষ্ট একটি কাজ করে এমন কোডের অংশ' },
  { id: 'string', en: 'string', bn: 'স্ট্রিং (লেখা)', cat: 'coding', example: '"hello"', exampleBn: 'উদ্ধৃতি চিহ্নের ভেতরের লেখা' },
  { id: 'console', en: 'console', bn: 'কনসোল', cat: 'coding', example: 'Console', exampleBn: 'প্রোগ্রামের বার্তা দেখার জায়গা' },
]

export const norm = (s: string) => s.normalize('NFC').trim().toLowerCase()

export function filterWords(words: TechWord[], query: string, cat: WordCategory | 'all'): TechWord[] {
  const q = norm(query)
  return words.filter((w) => {
    if (cat !== 'all' && w.cat !== cat) return false
    if (!q) return true
    return [w.en, w.bn, w.example, w.exampleBn].some((f) => norm(f).includes(q))
  })
}

export interface MatchQuestion {
  word: TechWord
  /** shuffled Bengali options, one of them correct */
  options: string[]
  answer: string
}

/** Deterministic pseudo random (mulberry32) so the drill is testable. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Build one "match the word" question: the correct meaning plus (count-1) distractors from other words. */
export function makeMatchQuestion(word: TechWord, pool: TechWord[], rand: () => number, count = 4): MatchQuestion {
  const others = shuffle(pool.filter((w) => w.id !== word.id && w.bn !== word.bn), rand).slice(0, count - 1)
  const options = shuffle([word.bn, ...others.map((o) => o.bn)], rand)
  return { word, options, answer: word.bn }
}

export function makeDrill(pool: TechWord[], rounds: number, seed: number): MatchQuestion[] {
  const rand = rng(seed)
  return shuffle(pool, rand).slice(0, Math.min(rounds, pool.length)).map((w) => makeMatchQuestion(w, pool, rand))
}

// ---------------------------------------------------------------------------------------------------------------------
// Error reader: realistic error texts with per-line explanations
// ---------------------------------------------------------------------------------------------------------------------
export type LineRole = 'header' | 'where' | 'code' | 'key' | 'info'

export interface ErrorLine {
  id: string
  text: string
  role: LineRole
  /** Bengali explanation shown when she clicks the line */
  noteBn: string
}

export interface ErrorSample {
  id: 'python' | 'javascript'
  titleBn: string
  lines: ErrorLine[]
}

export const PYTHON_TRACEBACK: ErrorSample = {
  id: 'python',
  titleBn: 'পাইথন (Python) — Traceback',
  lines: [
    { id: 'p1', text: 'Traceback (most recent call last):', role: 'header', noteBn: 'এটি শিরোনাম: “এরপর থেকে ধাপে ধাপে দেখাচ্ছি কীভাবে এই ভুলে পৌঁছালাম”। এখানে ভয় পাওয়ার কিছু নেই।' },
    { id: 'p2', text: '  File "shop.py", line 7, in <module>', role: 'where', noteBn: 'কোথায় হয়েছে: shop.py ফাইলের ৭ নম্বর লাইনে (line 7)। কোডে ওই লাইনে গিয়ে দেখুন।' },
    { id: 'p3', text: '    print(total_price)', role: 'code', noteBn: 'ওই লাইনে আপনার লেখা কোডটাই এখানে দেখাচ্ছে। সমস্যাটা এই লাইনে বা এর ঠিক আগে থাকে।' },
    { id: 'p4', text: "NameError: name 'total_price' is not defined", role: 'key', noteBn: 'এটিই আসল লাইন (সাধারণত শেষ লাইন)। ধরনটা NameError, আর কারণ: total_price নামটি আগে কখনো তৈরি করা হয়নি (বানানে ভুল, বা আগে মান দেওয়া হয়নি)।' },
  ],
}

export const JS_CONSOLE_ERROR: ErrorSample = {
  id: 'javascript',
  titleBn: 'জাভাস্ক্রিপ্ট (JavaScript) — ব্রাউজারের Console',
  lines: [
    { id: 'j1', text: 'Uncaught ReferenceError: total is not defined', role: 'key', noteBn: 'এটিই আসল বার্তা। ReferenceError মানে একটি নাম খুঁজে পাওয়া যায়নি; total আগে তৈরি করা হয়নি। “Uncaught” মানে কেউ এই সমস্যা সামলায়নি — ঘাবড়ানোর কিছু নেই।' },
    { id: 'j2', text: '    at calculate (app.js:12:5)', role: 'where', noteBn: 'কোথায়: calculate নামের ফাংশনের ভেতরে, app.js ফাইলের ১২ নম্বর লাইনের ৫ নম্বর অক্ষর (12:5)।' },
    { id: 'j3', text: '    at button.onclick (app.js:20:3)', role: 'info', noteBn: 'কোন পথে এখানে এসেছি: বোতামে ক্লিক → calculate চলল। ওপরের লাইনগুলো সবচেয়ে কাছের কারণ, নিচেরগুলো আগের ধাপ।' },
  ],
}

export const ERROR_SAMPLES = [PYTHON_TRACEBACK, JS_CONSOLE_ERROR]

export const keyLine = (s: ErrorSample): ErrorLine => s.lines.find((l) => l.role === 'key')!

/** Python traceback: the key line is the last line that is not indented. */
export function pythonKeyLine(lines: string[]): string | undefined {
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i]
    if (l.trim() && !/^\s/.test(l)) return l
  }
  return undefined
}

/** Extract {file, line} from 'File "shop.py", line 7' or 'at f (app.js:12:5)'. */
export function parseLocation(text: string): { file: string; line: number } | null {
  const py = /File "([^"]+)", line (\d+)/.exec(text)
  if (py) return { file: py[1], line: Number(py[2]) }
  const js = /\(?([\w./-]+\.\w+):(\d+)(?::\d+)?\)?/.exec(text)
  if (js) return { file: js[1], line: Number(js[2]) }
  return null
}

/**
 * Prepare an error for searching: drop the learner's own names/paths, keep the error type and generic wording.
 * "NameError: name 'mesage' is not defined" → "NameError: name is not defined" (+ language).
 */
export function cleanErrorForSearch(message: string, language?: string): string {
  const stripped = message
    .replace(/(?:[A-Za-z]:)?[\\/][\w .\\/-]+\.\w+(:\d+)*/g, '')
    .replace(/File "[^"]*", line \d+,?/g, '')
    .replace(/'[^']*'|"[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return language ? `${stripped} ${language}`.trim() : stripped
}

// ---------------------------------------------------------------------------------------------------------------------
// Question builder
// ---------------------------------------------------------------------------------------------------------------------
export interface QuestionParts {
  want: string
  did: string
  happened: string
  error: string
  tried: string
  /** operating system / language / program version, optional */
  env?: string
}

export const QUESTION_FIELDS: { id: keyof QuestionParts; labelBn: string; helpBn: string; required: boolean; multiline: boolean }[] = [
  { id: 'want', labelBn: '১. আমি কী করতে চাই?', helpBn: 'আপনার লক্ষ্য এক বাক্যে। যেমন: “দুটি সংখ্যা যোগ করে ফল ছাপাতে চাই।”', required: true, multiline: false },
  { id: 'did', labelBn: '২. আমি কী করেছি?', helpBn: 'কোন ধাপগুলো করেছেন, কোন প্রোগ্রাম/ভাষা ব্যবহার করছেন।', required: true, multiline: true },
  { id: 'happened', labelBn: '৩. কী ঘটল?', helpBn: 'যা আশা করেছিলেন আর যা সত্যিই হলো।', required: true, multiline: true },
  { id: 'error', labelBn: '৪. হুবহু এরর মেসেজ', helpBn: 'কপি করে পেস্ট করুন, নিজের ভাষায় বদলাবেন না।', required: false, multiline: true },
  { id: 'tried', labelBn: '৫. আমি কী কী চেষ্টা করেছি?', helpBn: 'যা যা চেষ্টা করেছেন, সংক্ষেপে।', required: false, multiline: true },
  { id: 'env', labelBn: '৬. কম্পিউটার/প্রোগ্রামের তথ্য (ঐচ্ছিক)', helpBn: 'যেমন: Windows 11, Python 3.13। পাসওয়ার্ড বা ব্যক্তিগত তথ্য দেবেন না।', required: false, multiline: false },
]

export const emptyParts = (): QuestionParts => ({ want: '', did: '', happened: '', error: '', tried: '', env: '' })

/** Which required parts are still empty (field ids). */
export function missingParts(p: QuestionParts): (keyof QuestionParts)[] {
  return QUESTION_FIELDS.filter((f) => f.required && !p[f.id]?.trim()).map((f) => f.id)
}

const PRIVATE = [
  { re: /[\w.+-]+@[\w-]+\.[\w.-]+/, labelBn: 'ইমেইল ঠিকানা' },
  { re: /\b(?:\+?88)?01[3-9]\d{8}\b/, labelBn: 'ফোন নম্বর' },
  { re: /password\s*[:=]\s*\S+/i, labelBn: 'পাসওয়ার্ড' },
  { re: /(?:[A-Za-z]:\\Users\\|\/Users\/|\/home\/)[^\\/\s]+/, labelBn: 'ব্যক্তিগত ফোল্ডারের নাম (ইউজারনেম)' },
]

/** Warn when the text seems to contain private data. Returns the Bengali labels found. */
export function findPrivateInfo(text: string): string[] {
  return PRIVATE.filter((p) => p.re.test(text)).map((p) => p.labelBn)
}

/** Build the help request (plain text, ready to copy). Empty optional parts are left out. */
export function buildQuestion(p: QuestionParts): string {
  const parts: string[] = []
  const t = (s?: string) => (s ?? '').trim()
  if (t(p.want)) parts.push(`What I want to do:\n${t(p.want)}`)
  if (t(p.did)) parts.push(`What I did:\n${t(p.did)}`)
  if (t(p.happened)) parts.push(`What happened:\n${t(p.happened)}`)
  if (t(p.error)) parts.push(`Exact error message:\n${t(p.error)}`)
  if (t(p.tried)) parts.push(`What I already tried:\n${t(p.tried)}`)
  if (t(p.env)) parts.push(`My setup:\n${t(p.env)}`)
  return parts.join('\n\n')
}

/** A short title line for the question, from the error (or the goal). */
export function questionTitle(p: QuestionParts): string {
  const e = t1(p.error)
  return e ? e.slice(0, 120) : t1(p.want).slice(0, 120)
}
const t1 = (s: string) => s.trim().split('\n').filter(Boolean).pop() ?? ''
