import type { Settings } from '../state/progress'

/** Reflect settings on <html> so CSS can react (theme, text size). */
export function applySettings(s: Settings) {
  const el = document.documentElement
  el.dataset.theme = s.theme
  el.dataset.text = s.textSize
}
