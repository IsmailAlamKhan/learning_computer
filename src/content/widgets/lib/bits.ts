/** Pure logic for the toggle-bits widget. Bit index 0 is the LEFTMOST switch (worth 128). */
export const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1] as const

export const bitsToValue = (bits: boolean[]): number => bits.reduce((sum, on, i) => sum + (on ? BIT_WEIGHTS[i] : 0), 0)

export function valueToBits(n: number): boolean[] {
  const v = Math.max(0, Math.min(255, Math.floor(n)))
  return BIT_WEIGHTS.map((w) => (v & w) !== 0)
}

export const toggleBit = (bits: boolean[], i: number): boolean[] => bits.map((b, j) => (j === i ? !b : b))

export const bitsToString = (bits: boolean[]): string => bits.map((b) => (b ? '1' : '0')).join('')

export type CharInfo = { char: string | null; noteBn: string }

/** The letter an 8-bit number stands for (only the plain English range is shown; nothing is invented elsewhere). */
export function charFor(n: number): CharInfo {
  if (n >= 65 && n <= 90) return { char: String.fromCharCode(n), noteBn: 'বড় হাতের ইংরেজি অক্ষর' }
  if (n >= 97 && n <= 122) return { char: String.fromCharCode(n), noteBn: 'ছোট হাতের ইংরেজি অক্ষর' }
  if (n >= 48 && n <= 57) return { char: String.fromCharCode(n), noteBn: 'একটি অঙ্কের চিহ্ন (লেখার চিহ্ন, হিসাবের সংখ্যা নয়)' }
  if (n === 32) return { char: '␣', noteBn: 'ফাঁকা জায়গা (স্পেস)' }
  if (n > 32 && n < 127) return { char: String.fromCharCode(n), noteBn: 'একটি চিহ্ন' }
  return { char: null, noteBn: 'এই সংখ্যার জন্য এখানে কোনো অক্ষর দেখানো হচ্ছে না' }
}

/** Unicode gives EVERY letter, in every language, its own number. */
export const UNICODE_SAMPLES = [
  { char: 'A', code: 65, hex: '0041', nameBn: 'ইংরেজি বড় A' },
  { char: 'a', code: 97, hex: '0061', nameBn: 'ইংরেজি ছোট a' },
  { char: 'অ', code: 2437, hex: '0985', nameBn: 'বাংলা অ' },
  { char: '😀', code: 128512, hex: '1F600', nameBn: 'হাসিমুখ ইমোজি' },
] as const

export const codeOf = (ch: string): number => ch.codePointAt(0) ?? 0

export const CHALLENGES = [5, 10, 65] as const

export type ChallengeResult = { ok: boolean; messageBn: string }

export function checkChallenge(target: number, bits: boolean[]): ChallengeResult {
  const v = bitsToValue(bits)
  if (v === target) return { ok: true, messageBn: `চমৎকার! ${bitsToString(bits)} মানে ঠিক ${target}।` }
  if (v < target) return { ok: false, messageBn: `এখন ${v} আছে, ${target} হতে আরও ${target - v} দরকার। আর একটি সুইচ চালু করে দেখুন।` }
  return { ok: false, messageBn: `এখন ${v} আছে, একটু বেশি হয়ে গেছে (লক্ষ্য ${target})। কোনো বড় সুইচ বন্ধ করে দেখুন।` }
}
