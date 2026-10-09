/** Pure helpers for XP, streaks, daily goal and badges (no storage here). */

export interface Streak {
  count: number
  best: number
  /** local calendar day of the last activity, 'YYYY-MM-DD' */
  lastDay: string
}

export interface DailyProgress {
  day: string
  /** units (mini-lessons) finished today */
  lessons: number
  xp: number
}

export const XP = {
  step: 2,
  unitDone: 20,
  quizPerfectBonus: 10,
  quizQuestionFirstTry: 3,
  moduleDone: 30,
} as const

export const dayKey = (d: Date = new Date()): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const dayDiff = (a: string, b: string): number => {
  const [ya, ma, da] = a.split('-').map(Number)
  const [yb, mb, db] = b.split('-').map(Number)
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86_400_000)
}

/** Record activity today: same day → unchanged, next day → +1, a gap → streak restarts at 1. */
export function advanceStreak(s: Streak, today: string): Streak {
  if (!s.lastDay) return { count: 1, best: Math.max(1, s.best), lastDay: today }
  const diff = dayDiff(s.lastDay, today)
  if (diff <= 0) return s
  const count = diff === 1 ? s.count + 1 : 1
  return { count, best: Math.max(s.best, count), lastDay: today }
}

/** Is the streak still alive today (she did something today or yesterday)? */
export function streakAlive(s: Streak, today: string): boolean {
  return !!s.lastDay && dayDiff(s.lastDay, today) <= 1
}

export function rollDaily(d: DailyProgress, today: string): DailyProgress {
  return d.day === today ? d : { day: today, lessons: 0, xp: 0 }
}

export interface BadgeDef {
  id: string
  titleBn: string
  /** art name for the badge picture */
  art: string
  descBn: string
}

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', titleBn: 'প্রথম পদক্ষেপ', art: 'star', descBn: 'প্রথম ছোট পাঠ শেষ' },
  { id: 'perfect-quiz', titleBn: 'কুইজ ওস্তাদ', art: 'medal', descBn: 'একটি কুইজে সবগুলো প্রথমবারে ঠিক' },
  { id: 'streak-3', titleBn: '৩ দিনের ধারা', art: 'flame', descBn: 'টানা ৩ দিন শিখেছেন' },
  { id: 'streak-7', titleBn: '৭ দিনের ধারা', art: 'flame', descBn: 'টানা ৭ দিন শিখেছেন' },
  { id: 'part1', titleBn: 'কম্পিউটারে দক্ষ', art: 'trophy', descBn: 'পর্ব ১ শেষ' },
  { id: 'part2', titleBn: 'কোডিংয়ের জন্য তৈরি', art: 'rocket', descBn: 'পর্ব ২ শেষ' },
]

export const badgeById = (id: string) => BADGES.find((b) => b.id === id)
