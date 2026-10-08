/** Pure logic for the `order-puzzle` widget (module 16): everyday step-ordering puzzles. */

export interface PuzzleStep {
  id: string
  textBn: string
}

export interface OrderPuzzle {
  id: string
  titleBn: string
  icon: string
  introBn: string
  /** Steps in the CORRECT order. */
  steps: PuzzleStep[]
  /** Shown when the order is wrong, in addition to the per-step ticks. */
  hintBn: string
}

export const PUZZLES: OrderPuzzle[] = [
  {
    id: 'tea',
    titleBn: 'চা বানানো',
    icon: '🍵',
    introBn: 'এক কাপ চা বানানোর ধাপগুলো ঠিক ক্রমে সাজান।',
    hintBn: 'আগে পানি গরম হতে হবে, তারপর চা পাতা। পরিবেশনের কাজগুলো একদম শেষে।',
    steps: [
      { id: 'tea1', textBn: 'কেটলিতে পানি নিয়ে চুলায় বসাই' },
      { id: 'tea2', textBn: 'পানি ফুটে উঠলে চা পাতা দিই' },
      { id: 'tea3', textBn: 'তিন মিনিট ফুটতে দিই' },
      { id: 'tea4', textBn: 'চুলা বন্ধ করে ছাঁকনি দিয়ে কাপে ঢালি' },
      { id: 'tea5', textBn: 'চিনি আর দুধ মিশিয়ে চুমুক দিই' },
    ],
  },
  {
    id: 'rice',
    titleBn: 'ভাত রান্না',
    icon: '🍚',
    introBn: 'ভাত রান্নার ধাপগুলো সাজান।',
    hintBn: 'চাল ধোয়ার আগে মেপে নিতে হয়, আর পরিবেশন সবার শেষে।',
    steps: [
      { id: 'rice1', textBn: 'চাল মেপে নিই' },
      { id: 'rice2', textBn: 'চাল ধুয়ে নিই' },
      { id: 'rice3', textBn: 'হাঁড়িতে পানি আর চাল দিয়ে চুলায় বসাই' },
      { id: 'rice4', textBn: 'ফুটে উঠলে আঁচ কমিয়ে ঢেকে দিই' },
      { id: 'rice5', textBn: 'নরম হলে নামিয়ে পরিবেশন করি' },
    ],
  },
  {
    id: 'teeth',
    titleBn: 'দাঁত মাজা',
    icon: '🪥',
    introBn: 'সকালে দাঁত মাজার ক্রমটি ঠিক করুন।',
    hintBn: 'ব্রাশে পেস্ট না নিলে মাজা যায় না — আর কুলকুচি করা হয় মাজার পরে।',
    steps: [
      { id: 'teeth1', textBn: 'ব্রাশে একটু পেস্ট নিই' },
      { id: 'teeth2', textBn: 'দুই মিনিট ধরে দাঁত মাজি' },
      { id: 'teeth3', textBn: 'ভালো করে কুলকুচি করি' },
      { id: 'teeth4', textBn: 'ব্রাশ ধুয়ে জায়গামতো রাখি' },
    ],
  },
  {
    id: 'email',
    titleBn: 'ইমেইল পাঠানো',
    icon: '✉️',
    introBn: 'একটি ইমেইল পাঠানোর ধাপগুলো সাজান।',
    hintBn: 'আগে নতুন চিঠি খুলতে হয়, কাকে পাঠাবেন তা ঠিক করতে হয় — পাঠানো সবার শেষে।',
    steps: [
      { id: 'mail1', textBn: 'Compose চাপি' },
      { id: 'mail2', textBn: 'To ঘরে প্রাপকের ঠিকানা লিখি' },
      { id: 'mail3', textBn: 'Subject লিখি' },
      { id: 'mail4', textBn: 'চিঠির মূল লেখা লিখি' },
      { id: 'mail5', textBn: 'একবার দেখে নিয়ে Send চাপি' },
    ],
  },
  {
    id: 'bag',
    titleBn: 'স্কুলের ব্যাগ গোছানো',
    icon: '🎒',
    introBn: 'স্কুলের ব্যাগ গোছানোর ক্রম ঠিক করুন।',
    hintBn: 'কী কী লাগবে আগে জানতে হয়; ব্যাগ বন্ধ করা একদম শেষ কাজ।',
    steps: [
      { id: 'bag1', textBn: 'আজকের রুটিন দেখি' },
      { id: 'bag2', textBn: 'রুটিন অনুযায়ী বই-খাতা বেছে নিই' },
      { id: 'bag3', textBn: 'বই-খাতা ব্যাগে ভরি' },
      { id: 'bag4', textBn: 'টিফিন আর পানির বোতল নিই' },
      { id: 'bag5', textBn: 'ব্যাগের চেইন লাগাই' },
    ],
  },
  {
    id: 'atm',
    titleBn: 'এটিএম থেকে টাকা তোলা',
    icon: '🏧',
    introBn: 'এটিএম বুথে টাকা তোলার ধাপগুলো সাজান। (এটি শুধু অনুশীলন — কোনো আসল তথ্য লাগবে না।)',
    hintBn: 'কার্ড না ঢোকালে মেশিন চিনবে না; টাকা পাওয়ার পরেই কার্ড ফেরত নিন।',
    steps: [
      { id: 'atm1', textBn: 'কার্ড মেশিনে ঢোকাই' },
      { id: 'atm2', textBn: 'গোপন পিন (PIN) দিই' },
      { id: 'atm3', textBn: 'কত টাকা তুলব তা লিখি' },
      { id: 'atm4', textBn: 'মেশিন থেকে টাকা নিই' },
      { id: 'atm5', textBn: 'কার্ড ফেরত নিই' },
    ],
  },
]

export const getPuzzle = (id: string) => PUZZLES.find((p) => p.id === id)

/** Is the given order of step ids exactly the puzzle's solution? */
export function isCorrectOrder(puzzle: OrderPuzzle, order: string[]): boolean {
  return order.length === puzzle.steps.length && puzzle.steps.every((s, i) => order[i] === s.id)
}

/** For each position: is the step at that position the right one? */
export function correctPositions(puzzle: OrderPuzzle, order: string[]): boolean[] {
  return order.map((id, i) => puzzle.steps[i]?.id === id)
}

/** Move the item at `from` to index `to` (the others shift). Out-of-range moves are ignored. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list
  const next = [...list]
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x)
  return next
}

/** Swap with the neighbour (-1 = up, +1 = down). */
export function nudge<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const j = index + dir
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[index], next[j]] = [next[j], next[index]]
  return next
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** A deterministic shuffle that is never already solved (and, for 3+ steps, never the reverse-trivially-close identity). */
export function shuffledOrder(puzzle: OrderPuzzle, seed = 1): string[] {
  const ids = puzzle.steps.map((s) => s.id)
  if (ids.length < 2) return ids
  const r = rng(seed * 7919 + ids.length)
  for (let attempt = 0; attempt < 20; attempt++) {
    const a = [...ids]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    if (!isCorrectOrder(puzzle, a)) return a
  }
  // fall back: rotate by one
  return [...ids.slice(1), ids[0]]
}

export interface OrderFeedback {
  solved: boolean
  rightCount: number
  messageBn: string
}

/** Gentle feedback for a check. */
export function orderFeedback(puzzle: OrderPuzzle, order: string[]): OrderFeedback {
  if (isCorrectOrder(puzzle, order)) return { solved: true, rightCount: puzzle.steps.length, messageBn: 'ঠিক ক্রম! প্রতিটি ধাপ তার জায়গায় বসেছে।' }
  const rightCount = correctPositions(puzzle, order).filter(Boolean).length
  const total = puzzle.steps.length
  const messageBn =
    rightCount === 0
      ? `এখনও কোনোটি জায়গামতো বসেনি — সমস্যা নেই। ${puzzle.hintBn}`
      : `${rightCount}টি ধাপ ঠিক জায়গায় আছে (সবুজ টিক)। বাকি ${total - rightCount}টি একটু সরিয়ে দেখুন। ${puzzle.hintBn}`
  return { solved: false, rightCount, messageBn }
}
