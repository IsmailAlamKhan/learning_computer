/** Pure helpers for simulated screenshots: file names and the tiny "snapshot" format stored inside the PNG-flavoured file. */
import type { OsFlavor } from '../../engine/types'

export type ShotKind = 'win-prtscn-file' | 'win-snip' | 'mac'

const p2 = (n: number) => String(n).padStart(2, '0')

/** macOS: `Screenshot 2026-10-09 at 3.45.12 PM.png` */
export function macShotName(date: Date): string {
  const h = date.getHours()
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `Screenshot ${date.getFullYear()}-${p2(date.getMonth() + 1)}-${p2(date.getDate())} at ${h12}.${p2(date.getMinutes())}.${p2(date.getSeconds())} ${h < 12 ? 'AM' : 'PM'}.png`
}

/** Windows Snipping Tool save name: `Screenshot 2026-10-09 154512.png` */
export function winSnipName(date: Date): string {
  return `Screenshot ${date.getFullYear()}-${p2(date.getMonth() + 1)}-${p2(date.getDate())} ${p2(date.getHours())}${p2(date.getMinutes())}${p2(date.getSeconds())}.png`
}

/**
 * The file name a screenshot gets. `existing` = names already in the target folder.
 * Win+PrtScn → `Screenshot (1).png`, `Screenshot (2).png`, …; the others are time stamped (a " (2)" is added on a clash).
 */
export function screenshotName(os: OsFlavor, kind: ShotKind, date: Date, existing: string[] = []): string {
  const taken = new Set(existing.map((n) => n.toLowerCase()))
  if (os === 'windows' && kind === 'win-prtscn-file') {
    let i = 1
    while (taken.has(`screenshot (${i}).png`)) i++
    return `Screenshot (${i}).png`
  }
  const base = os === 'mac' ? macShotName(date) : winSnipName(date)
  if (!taken.has(base.toLowerCase())) return base
  const stem = base.slice(0, -4)
  let i = 2
  while (taken.has(`${stem} (${i}).png`.toLowerCase())) i++
  return `${stem} (${i}).png`
}

export interface ShotRect {
  x: number
  y: number
  w: number
  h: number
}

export interface ShotData {
  os: OsFlavor
  /** size of the whole simulated screen */
  w: number
  h: number
  /** the selected area (absent = whole screen) */
  area?: ShotRect
  at: number
  wins: { title: string; x: number; y: number; w: number; h: number }[]
}

const PREFIX = 'shot:'

export const encodeShot = (s: ShotData): string => PREFIX + JSON.stringify(s)

export function decodeShot(content: string): ShotData | null {
  if (!content.startsWith(PREFIX)) return null
  try {
    const o = JSON.parse(content.slice(PREFIX.length)) as ShotData
    return typeof o.w === 'number' && typeof o.h === 'number' && Array.isArray(o.wins) ? o : null
  } catch {
    return null
  }
}

/** Normalise a drag from (x1,y1) to (x2,y2) into a positive rectangle clamped to the screen; null if it is too small to be a selection. */
export function rectFromDrag(x1: number, y1: number, x2: number, y2: number, bounds: { w: number; h: number }, min = 8): ShotRect | null {
  const x = Math.max(0, Math.min(x1, x2))
  const y = Math.max(0, Math.min(y1, y2))
  const w = Math.min(bounds.w, Math.max(x1, x2)) - x
  const h = Math.min(bounds.h, Math.max(y1, y2)) - y
  return w >= min && h >= min ? { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) } : null
}
