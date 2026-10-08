/** Pure helpers for the print dialog. */

const LINES_PER_PAGE = 45

/** How many sheets a plain-text document needs (at least 1). */
export function countPages(text: string): number {
  const lines = text.split('\n').reduce((n, l) => n + Math.max(1, Math.ceil(l.length / 80)), 0)
  return Math.max(1, Math.ceil(lines / LINES_PER_PAGE))
}

/** "3", "1-2", "1,3" → number of pages to print; null if it is not valid for a document of `total` pages. */
export function parsePageRange(input: string, total: number): number | null {
  const set = new Set<number>()
  for (const part of input.split(',')) {
    const m = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part)
    if (!m) return null
    const a = Number(m[1])
    const b = m[2] !== undefined ? Number(m[2]) : a
    if (a < 1 || b < a || b > total) return null
    for (let i = a; i <= b; i++) set.add(i)
  }
  return set.size || null
}
