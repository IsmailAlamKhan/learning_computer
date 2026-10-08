/** Validation rules for the pretend "LearnCode" sign-up page (Module 8). Pure → unit-tested. */
import { isValidAddress } from '../../../sim/apps/extra/mailStore'

export interface SignupValues {
  name: string
  email: string
  username: string
  password: string
}

export interface PasswordRule {
  id: string
  textBn: string
  ok: boolean
}

export function passwordRules(password: string, username = ''): PasswordRule[] {
  const u = username.trim().toLowerCase()
  return [
    { id: 'len', textBn: 'কমপক্ষে ৮টি অক্ষর', ok: password.length >= 8 },
    { id: 'letter', textBn: 'অন্তত একটি ইংরেজি অক্ষর (a–z)', ok: /[a-z]/i.test(password) },
    { id: 'digit', textBn: 'অন্তত একটি সংখ্যা (0–9)', ok: /\d/.test(password) },
    { id: 'name', textBn: 'ইউজারনেম বা “password” শব্দটি পাসওয়ার্ডে নেই', ok: !/password/i.test(password) && (!u || u.length < 3 || !password.toLowerCase().includes(u)) },
  ]
}

export function usernameProblem(username: string): string | null {
  if (!username) return 'ইউজারনেম লিখুন।'
  if (!/^[a-z0-9_.]+$/.test(username)) return 'ইউজারনেমে শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা, ডট (.) বা আন্ডারস্কোর (_) চলবে — ফাঁকা জায়গা নয়।'
  if (username.length < 3) return 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।'
  return null
}

/** Returns the first friendly problem per field (Bengali), or an empty object when the form is fine. */
export function signupProblems(v: SignupValues): Partial<Record<keyof SignupValues, string>> {
  const p: Partial<Record<keyof SignupValues, string>> = {}
  if (!v.name.trim()) p.name = 'আপনার নাম লিখুন।'
  if (!v.email.trim()) p.email = 'ইমেইল ঠিকানা লিখুন — এখানেই যাচাইয়ের চিঠি যাবে।'
  else if (!isValidAddress(v.email)) p.email = 'ঠিকানাটি পুরো হয়নি। নিয়ম: নাম, তারপর @, তারপর ডোমেইন — যেমন anika@mail.example।'
  const up = usernameProblem(v.username)
  if (up) p.username = up
  if (!passwordRules(v.password, v.username).every((r) => r.ok)) p.password = 'পাসওয়ার্ডের সবগুলো নিয়ম এখনও মেলেনি — নিচের তালিকা দেখুন।'
  return p
}
