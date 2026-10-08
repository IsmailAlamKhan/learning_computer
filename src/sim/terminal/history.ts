/** Up/Down-arrow history navigation, as pure logic. */
export interface HistoryCursor {
  /** index into history; `history.length` means "the line being typed" */
  pos: number
  /** what the learner had typed before pressing Up */
  draft: string
}

export const freshCursor = (history: readonly string[]): HistoryCursor => ({ pos: history.length, draft: '' })

export function stepHistory(history: readonly string[], cur: HistoryCursor, dir: 'up' | 'down', current: string): { cursor: HistoryCursor; text: string } {
  let { pos, draft } = cur
  if (pos > history.length) pos = history.length
  if (dir === 'up') {
    if (history.length === 0) return { cursor: cur, text: current }
    if (pos === history.length) draft = current
    pos = Math.max(0, pos - 1)
    return { cursor: { pos, draft }, text: history[pos] }
  }
  if (pos >= history.length) return { cursor: { pos: history.length, draft }, text: current }
  pos++
  return { cursor: { pos, draft }, text: pos === history.length ? draft : history[pos] }
}

/** Adds a line to history (ignores empty lines and immediate repeats). */
export function pushHistory(history: string[], line: string) {
  const t = line.trim()
  if (!t) return
  if (history[history.length - 1] === t) return
  history.push(t)
  if (history.length > 200) history.shift()
}
