/**
 * Gentle, local password practice checker. Pure logic (no network, nothing stored).
 * It does NOT claim how long a password takes to crack — only rough categories.
 */
export type StrengthLevel = 'empty' | 'veryWeak' | 'weak' | 'okay' | 'good' | 'strong'

export interface Tip {
  kind: 'good' | 'tip'
  textBn: string
}

export interface StrengthResult {
  level: StrengthLevel
  /** 0..4 for meters */
  score: number
  labelBn: string
  tips: Tip[]
}

const COMMON = [
  'password', 'passw0rd', 'pass', 'admin', 'login', 'welcome', 'qwerty', 'asdf', 'zxcv', 'letmein', 'iloveyou', 'abc123', 'abcd',
  'bangladesh', 'dhaka', 'bangla', 'amar', 'sonar', 'ami', 'bkash', 'nagad', 'rocket', 'computer', 'monkey', 'dragon', 'football', 'cricket',
]

const SEQUENCES = ['0123456789', '9876543210', 'abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm']

export function containsCommonWord(pw: string): boolean {
  const p = pw.toLowerCase().replace(/[^a-z0-9]/g, '')
  return COMMON.some((w) => p.includes(w))
}

/** 4+ characters in a row that follow the keyboard / alphabet / number order, e.g. 1234, abcd, qwer. */
export function hasSequence(pw: string): boolean {
  const p = pw.toLowerCase()
  for (let i = 0; i + 4 <= p.length; i++) {
    const chunk = p.slice(i, i + 4)
    if (SEQUENCES.some((s) => s.includes(chunk))) return true
  }
  return false
}

/** Same character 3+ times in a row, or the whole thing is one short pattern repeated (abab…). */
export function hasRepeats(pw: string): boolean {
  if (/(.)\1\1/.test(pw)) return true
  for (let n = 1; n <= Math.floor(pw.length / 2); n++) {
    if (pw.length >= 6 && pw.length % n === 0 && pw.slice(0, n).repeat(pw.length / n) === pw) return true
  }
  return false
}

/** Looks like 3+ separate words (letters) divided by spaces, dashes, dots or underscores. */
export function looksLikePassphrase(pw: string): boolean {
  const words = pw.split(/[\s\-_.]+/).filter((w) => /^[\p{L}]{3,}$/u.test(w))
  return words.length >= 3 && words.length * 3 <= pw.length
}

const hasYear = (pw: string) => /(19|20)\d{2}/.test(pw)

export function classCount(pw: string): number {
  return [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) => r.test(pw)).length
}

export function scorePassword(pw: string): StrengthResult {
  if (!pw) return { level: 'empty', score: 0, labelBn: 'এখনও কিছু লেখা হয়নি', tips: [{ kind: 'tip', textBn: 'নিচের ঘরে একটি অনুশীলনের পাসওয়ার্ড লিখে দেখুন (আসল পাসওয়ার্ড নয়)।' }] }

  const len = [...pw].length
  const tips: Tip[] = []
  const common = containsCommonWord(pw)
  const seq = hasSequence(pw)
  const rep = hasRepeats(pw)
  const onlyDigits = /^\d+$/.test(pw)
  const passphrase = looksLikePassphrase(pw)
  const classes = classCount(pw)

  // base points mostly from length
  let pts = len >= 20 ? 5 : len >= 16 ? 4 : len >= 12 ? 3 : len >= 8 ? 2 : len >= 6 ? 1 : 0
  if (classes >= 3 && len >= 8) pts += 0.5
  if (passphrase && len >= 14) pts += 1
  if (common) pts -= 2
  if (seq) pts -= 1.5
  if (rep) pts -= 1.5
  if (onlyDigits) pts -= 1

  if (len < 12) tips.push({ kind: 'tip', textBn: len < 8 ? 'আরও লম্বা করুন — অন্তত ১২টি অক্ষর হলে ভালো।' : 'আরও কয়েকটি অক্ষর যোগ করলে ভালো হয় — ১২ বা তার বেশি অক্ষর লক্ষ্য রাখুন।' })
  else tips.push({ kind: 'good', textBn: 'দৈর্ঘ্য ভালো — লম্বা পাসওয়ার্ডই সবচেয়ে কাজের।' })
  if (common) tips.push({ kind: 'tip', textBn: 'সবার চেনা শব্দ (যেমন password, bangladesh) এড়িয়ে চলুন — এগুলো সহজে অনুমান করা যায়।' })
  if (seq) tips.push({ kind: 'tip', textBn: '1234 বা abcd বা qwer-এর মতো পরপর সাজানো অক্ষর এড়িয়ে চলুন।' })
  if (rep) tips.push({ kind: 'tip', textBn: 'একই অক্ষর বা একই অংশ বারবার না দিয়ে আলাদা আলাদা শব্দ ব্যবহার করুন।' })
  if (onlyDigits) tips.push({ kind: 'tip', textBn: 'শুধু সংখ্যা না দিয়ে অক্ষরও মেশান, বা চার-পাঁচটি শব্দ জুড়ে দিন।' })
  if (hasYear(pw)) tips.push({ kind: 'tip', textBn: 'জন্মসাল বা চেনা সাল সহজে অনুমান করা যায় — সম্ভব হলে এড়িয়ে চলুন।' })
  if (passphrase) tips.push({ kind: 'good', textBn: 'চমৎকার! কয়েকটি শব্দ জুড়ে বানানো পাসফ্রেজ (Passphrase) মনে রাখা সহজ, আবার অনুমান করা কঠিন।' })
  else if (len >= 8 && !common && !seq && !rep) tips.push({ kind: 'tip', textBn: 'চারটি এলোমেলো শব্দ জুড়ে একটি পাসফ্রেজ বানানোর চেষ্টা করুন।' })
  if (classes >= 3 && len >= 12 && !common) tips.push({ kind: 'good', textBn: 'অক্ষর, সংখ্যা ও চিহ্নের মিশ্রণ ভালো — তবে দৈর্ঘ্যই আসল শক্তি।' })

  const level: StrengthLevel = pts < 1 ? 'veryWeak' : pts < 2.5 ? 'weak' : pts < 3.5 ? 'okay' : pts < 4.5 ? 'good' : 'strong'
  const meta: Record<Exclude<StrengthLevel, 'empty'>, { score: number; labelBn: string }> = {
    veryWeak: { score: 1, labelBn: 'সহজে অনুমান করা যায়' },
    weak: { score: 1, labelBn: 'আরেকটু শক্ত করা যায়' },
    okay: { score: 2, labelBn: 'মোটামুটি — আরও লম্বা করলে ভালো' },
    good: { score: 3, labelBn: 'ভালো' },
    strong: { score: 4, labelBn: 'খুব ভালো' },
  }
  return { level, ...meta[level], tips }
}
