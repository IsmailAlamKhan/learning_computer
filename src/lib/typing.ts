/** Pure scoring logic for the typing practice widget. No React here, so it is easy to unit-test. */

export type CharState = 'correct' | 'wrong' | 'current' | 'pending'
export interface CharView {
  char: string
  state: CharState
}

/** Per-character comparison of the target text with what has been typed so far. */
export function diffChars(target: string, typed: string): CharView[] {
  const t = Array.from(target)
  const y = Array.from(typed)
  return t.map((char, i) => {
    if (i < y.length) return { char, state: y[i] === char ? 'correct' : 'wrong' }
    return { char, state: i === y.length ? 'current' : 'pending' }
  })
}

export const countCorrect = (target: string, typed: string) => diffChars(target, typed).filter((c) => c.state === 'correct').length

export interface Session {
  typed: string
  /** characters added (deleting does not count) */
  keystrokes: number
  /** added characters that were wrong when typed */
  mistakes: number
  startedAt: number | null
  finishedAt: number | null
}

export const newSession = (): Session => ({ typed: '', keystrokes: 0, mistakes: 0, startedAt: null, finishedAt: null })

/** Apply a new value of the input box. Typing beyond the target is ignored; finishing happens when the text matches exactly. */
export function applyInput(s: Session, target: string, value: string, now: number): Session {
  if (s.finishedAt !== null) return s
  const t = Array.from(target)
  const v = Array.from(value).slice(0, t.length)
  const prev = Array.from(s.typed)
  let { keystrokes, mistakes } = s
  for (let i = prev.length; i < v.length; i++) {
    keystrokes++
    if (v[i] !== t[i]) mistakes++
  }
  const typed = v.join('')
  const startedAt = s.startedAt ?? (typed.length > 0 ? now : null)
  const finishedAt = typed === target ? now : null
  return { typed, keystrokes, mistakes, startedAt, finishedAt }
}

/** Accuracy in whole percent. Nothing typed yet counts as 100 so nobody sees a scary 0%. */
export function accuracy(s: Pick<Session, 'keystrokes' | 'mistakes'>): number {
  if (s.keystrokes <= 0) return 100
  return Math.round(((s.keystrokes - s.mistakes) / s.keystrokes) * 100)
}

/** Words per minute using the standard "5 characters = 1 word" rule. */
export function wpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || correctChars <= 0) return 0
  return Math.round(correctChars / 5 / (elapsedMs / 60000))
}

/** Gentle live speed: null until there is enough typing to say anything (3 seconds and 3 correct characters). */
export function liveWpm(s: Session, target: string, now: number): number | null {
  if (s.startedAt === null) return null
  const end = s.finishedAt ?? now
  const elapsed = end - s.startedAt
  const good = countCorrect(target, s.typed)
  if (elapsed < 3000 || good < 3) return null
  return wpm(good, elapsed)
}

const ENCOURAGE_START = ['শুরু করুন — কোনো তাড়া নেই।', 'ধীরে ধীরে লিখুন, গতি পরে আপনিই বাড়বে।', 'প্রথম অক্ষরটি লিখে ফেলুন, তাহলেই শুরু।']
const ENCOURAGE_GOING = ['বেশ চলছে!', 'ঠিক পথেই আছেন।', 'চমৎকার, থামবেন না।', 'এভাবেই চালিয়ে যান।']
const ENCOURAGE_SLIP = ['একটু ভুল হলে ক্ষতি নেই — Backspace দিয়ে মুছে আবার লিখুন।', 'ভুল হওয়া খুবই স্বাভাবিক। Backspace চেপে ঠিক করে নিন।']
const ENCOURAGE_DONE_HIGH = ['দারুণ! প্রায় নিখুঁত হয়েছে।', 'অসাধারণ লিখেছেন!', 'খুব সুন্দর হয়েছে — সত্যিই ভালো।']
const ENCOURAGE_DONE_OK = ['ভালো হয়েছে! যত চর্চা করবেন, তত সহজ হবে।', 'বেশ ভালো! আরেকবার চেষ্টা করলে আরও ভালো লাগবে।']
const ENCOURAGE_DONE_LOW = ['শেষ করেছেন — এটাই আসল কথা! আবার চেষ্টা করলে নিশ্চয়ই আরও ভালো হবে।', 'পুরোটা লিখে ফেলেছেন, এটা কম কথা নয়। ধীরে লিখলে ভুলও কমে যায়।']

const pick = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length]

/** Friendly Bengali message. `seed` (e.g. exercise number) makes the wording vary without randomness. */
export function encouragementBn(s: Session, target: string, seed = 0): string {
  const done = s.finishedAt !== null
  const acc = accuracy(s)
  if (done) return acc >= 95 ? pick(ENCOURAGE_DONE_HIGH, seed) : acc >= 80 ? pick(ENCOURAGE_DONE_OK, seed) : pick(ENCOURAGE_DONE_LOW, seed)
  if (s.keystrokes === 0) return pick(ENCOURAGE_START, seed)
  // the newest character is wrong, or something earlier is still wrong
  const hasWrongNow = diffChars(target, s.typed).some((c) => c.state === 'wrong')
  if (hasWrongNow) return pick(ENCOURAGE_SLIP, seed)
  return pick(ENCOURAGE_GOING, seed + s.keystrokes)
}

export interface Level {
  id: string
  titleBn: string
  introBn: string
  texts: string[]
}

export const LEVELS: Level[] = [
  {
    id: 'home',
    titleBn: 'হোম রো অক্ষর',
    introBn: 'আঙুল রাখার সারি: a s d f g h j k l। F আর J কী-তে ছোট একটি উঁচু দাগ থাকে — ওটা হাতড়ে দুই তর্জনী রাখুন।',
    texts: ['asdf jkl', 'sad dad', 'ask a lad', 'glass flask', 'a hall shall fall', 'half a salad'],
  },
  {
    id: 'words',
    titleBn: 'ইংরেজি শব্দ',
    introBn: 'এবার সব অক্ষর দিয়ে চেনা শব্দ।',
    texts: ['rice tea water', 'book pen paper', 'school home family', 'rickshaw bus train', 'mango banana fish'],
  },
  {
    id: 'sentences',
    titleBn: 'বাক্য',
    introBn: 'বড় হাতের অক্ষরের জন্য Shift চেপে ধরে অক্ষর চাপুন, শেষে দাঁড়ি দিন।',
    texts: ['I drink tea every morning.', 'The rice is ready.', 'My name is Rumi.', 'I like to learn new things.', 'Today is a good day.'],
  },
  {
    id: 'code',
    titleBn: 'কোডের মতো লেখা',
    introBn: 'প্রোগ্রামের কোডে চিহ্ন অনেক। ধীরে ধীরে, চিহ্ন ধরে ধরে লিখুন। ইংরেজি কিবোর্ড চালু আছে কিনা দেখে নিন।',
    texts: ['print("Hello")', '<h1>Hi</h1>', '{ "name": "Rumi" }', 'x = [1, 2, 3]', "name = 'Rumi'", 'cd ~/Documents'],
  },
]
