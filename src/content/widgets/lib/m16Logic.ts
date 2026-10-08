/** Pure logic for the `if-else-explorer` and `loop-counter` widgets (module 16). */

// ------------------------------------------------------------ if / else

export interface Toggle {
  id: string
  questionBn: string
  yesBn: string
  noBn: string
  /** initial value */
  initial: boolean
}
export interface Rule {
  /** all of these must hold for the rule to fire */
  when: { toggle: string; is: boolean }[]
  /** the sentence shown, e.g. “যদি বৃষ্টি হয় → ছাতা নিন” (built from `when` if omitted) */
  ifBn: string
  thenBn: string
}
export interface IfScenario {
  id: string
  titleBn: string
  icon: string
  introBn: string
  toggles: Toggle[]
  /** checked in order; the first that holds wins (if / else if / else) */
  rules: Rule[]
  elseBn: string
}

export const IF_SCENARIOS: IfScenario[] = [
  {
    id: 'rain',
    titleBn: 'ছাতা নেব কি?',
    icon: '☔',
    introBn: 'বাড়ি থেকে বেরোনোর আগে একটি সিদ্ধান্ত: যদি বৃষ্টি হয় তবে ছাতা নিন, নইলে না।',
    toggles: [{ id: 'rain', questionBn: 'বৃষ্টি হচ্ছে?', yesBn: 'হ্যাঁ, হচ্ছে', noBn: 'না, হচ্ছে না', initial: false }],
    rules: [{ when: [{ toggle: 'rain', is: true }], ifBn: 'যদি বৃষ্টি হয়', thenBn: 'ছাতা নিন ☔' }],
    elseBn: 'ছাতা লাগবে না, সোজা বেরিয়ে পড়ুন 🙂',
  },
  {
    id: 'rickshaw',
    titleBn: 'রিকশা না হেঁটে?',
    icon: '🚲',
    introBn: 'একাধিক শর্ত: কোনটি আগে মিলছে, সেটিই কাজ করে (যদি… নইলে যদি… নইলে…)।',
    toggles: [
      { id: 'far', questionBn: 'গন্তব্য কি অনেক দূরে?', yesBn: 'হ্যাঁ, দূরে', noBn: 'না, কাছেই', initial: false },
      { id: 'bag', questionBn: 'সাথে কি ভারী ব্যাগ আছে?', yesBn: 'হ্যাঁ, আছে', noBn: 'না, নেই', initial: false },
    ],
    rules: [
      { when: [{ toggle: 'far', is: true }], ifBn: 'যদি অনেক দূরে হয়', thenBn: 'রিকশা নিন 🚲' },
      { when: [{ toggle: 'bag', is: true }], ifBn: 'নইলে যদি ভারী ব্যাগ থাকে', thenBn: 'রিকশা নিন 🚲' },
    ],
    elseBn: 'নইলে হেঁটেই যান 🚶',
  },
  {
    id: 'atm',
    titleBn: 'এটিএম: টাকা মিলবে?',
    icon: '🏧',
    introBn: 'কয়েকটি শর্ত পরপর পার হতে হয়। যেকোনো একটিতে আটকে গেলে মেশিন সেখানেই থামে। (এখানে সবই কাল্পনিক।)',
    toggles: [
      { id: 'card', questionBn: 'কার্ড ঠিকমতো ঢোকানো হয়েছে?', yesBn: 'হ্যাঁ', noBn: 'না', initial: true },
      { id: 'pin', questionBn: 'পিন (PIN) ঠিক?', yesBn: 'হ্যাঁ, ঠিক', noBn: 'না, ভুল', initial: true },
      { id: 'enough', questionBn: 'অ্যাকাউন্টে যথেষ্ট টাকা আছে?', yesBn: 'হ্যাঁ, আছে', noBn: 'না, কম', initial: true },
    ],
    rules: [
      { when: [{ toggle: 'card', is: false }], ifBn: 'যদি কার্ড ঠিকমতো না ঢোকে', thenBn: 'বার্তা: “কার্ডটি আবার ঢোকান”' },
      { when: [{ toggle: 'pin', is: false }], ifBn: 'নইলে যদি পিন ভুল হয়', thenBn: 'বার্তা: “পিন ভুল, আবার চেষ্টা করুন”' },
      { when: [{ toggle: 'enough', is: false }], ifBn: 'নইলে যদি টাকা কম থাকে', thenBn: 'বার্তা: “ব্যালেন্স যথেষ্ট নয়”' },
    ],
    elseBn: 'নইলে টাকা বেরিয়ে আসবে 💵',
  },
]

export interface IfResult {
  /** index of the rule that fired, or -1 for the “else” part */
  matched: number
  outcomeBn: string
  /** per rule: did it fire, fail to match, or never get looked at (an earlier rule already fired) */
  lines: ('fired' | 'failed' | 'skipped')[]
  elseState: 'fired' | 'skipped'
}

export function evaluateScenario(s: IfScenario, values: Record<string, boolean>): IfResult {
  let matched = -1
  const lines: IfResult['lines'] = []
  for (let i = 0; i < s.rules.length; i++) {
    if (matched !== -1) {
      lines.push('skipped')
      continue
    }
    const holds = s.rules[i].when.every((w) => (values[w.toggle] ?? false) === w.is)
    if (holds) {
      matched = i
      lines.push('fired')
    } else lines.push('failed')
  }
  return {
    matched,
    outcomeBn: matched === -1 ? s.elseBn : s.rules[matched].thenBn,
    lines,
    elseState: matched === -1 ? 'fired' : 'skipped',
  }
}

export const initialValues = (s: IfScenario): Record<string, boolean> => Object.fromEntries(s.toggles.map((t) => [t.id, t.initial]))

// ------------------------------------------------------------ loops

/** the numbers 1..n: what “repeat n times” does, one round at a time */
export function repeatRounds(n: number): number[] {
  const k = Math.max(0, Math.floor(n))
  return Array.from({ length: k }, (_, i) => i + 1)
}

/** nested repetition: for each cup, add `spoonsEach` spoons */
export function totalSpoons(cups: number, spoonsEach: number): number {
  return Math.max(0, Math.floor(cups)) * Math.max(0, Math.floor(spoonsEach))
}

/** “repeat while not sweet enough”: how many spoons until sweetness reaches the target (each spoon adds `perSpoon`), with a safety cap */
export function spoonsUntilSweet(target: number, perSpoon: number, cap = 50): number {
  if (perSpoon <= 0) return cap
  let sweet = 0
  let spoons = 0
  while (sweet < target && spoons < cap) {
    sweet += perSpoon
    spoons++
  }
  return spoons
}

export interface LoopState {
  total: number
  done: number
  finished: boolean
}
export const loopStart = (total: number): LoopState => ({ total: Math.max(1, Math.floor(total)), done: 0, finished: false })
export function loopStep(s: LoopState): LoopState {
  if (s.finished) return s
  const done = s.done + 1
  return { ...s, done, finished: done >= s.total }
}
