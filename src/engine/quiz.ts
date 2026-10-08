import type { QuizQuestion } from './types'

type Q<T extends QuizQuestion['type']> = Extract<QuizQuestion, { type: T }>

export function gradeMultipleChoice(q: Q<'multipleChoice'>, selected: string[]): boolean {
  const a = [...new Set(selected)].sort()
  const b = [...q.correct].sort()
  return a.length === b.length && a.every((x, i) => x === b[i])
}

export const gradeClickTarget = (q: Q<'clickTarget'>, picked: string) => picked === q.correct

/** mapping: left pair id -> id of the right-hand item placed on it */
export function gradeDragMatch(q: Q<'dragMatch'>, mapping: Record<string, string | undefined>): boolean {
  return q.pairs.every((p) => mapping[p.id] === p.id)
}

export function gradeOrdering(q: Q<'ordering'>, order: string[]): boolean {
  return order.length === q.items.length && q.items.every((it, i) => order[i] === it.id)
}

export function gradePredictOutput(q: Q<'predictOutput'>, answer: string): boolean {
  const norm = (s: string) => s.normalize('NFC').replace(/\r\n/g, '\n').trim()
  const a = norm(answer)
  return q.acceptedAnswers.some((x) => (q.ignoreCase ? norm(x).toLowerCase() === a.toLowerCase() : norm(x) === a))
}

/** Deterministic shuffle (so a question looks the same on re-render) that is never the identity for n>1. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const rnd = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
  const a = [...items]
  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    if (a.length < 2 || a.some((x, i) => x !== items[i])) return a
  }
  return [...items].reverse()
}

export interface QuizScore {
  score: number
  total: number
  wrongByQuestion: Record<string, number>
}

/** Score = questions answered correctly on the first try. */
export function scoreQuiz(ids: string[], wrongByQuestion: Record<string, number>): QuizScore {
  const score = ids.filter((id) => (wrongByQuestion[id] ?? 0) === 0).length
  return { score, total: ids.length, wrongByQuestion }
}
