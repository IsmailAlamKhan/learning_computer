import type { ArtName } from '../ui/illustrations/names'

/** The picture shown for each module on the Home path and the "continue" card. */
export const MODULE_ART: Record<number, ArtName> = {
  1: 'laptop',
  2: 'desktop-pc',
  3: 'window',
  4: 'almirah',
  5: 'keyboard',
  6: 'pencil',
  7: 'globe',
  8: 'envelope',
  9: 'shield',
  10: 'gear',
  11: 'camera',
  12: 'wrench',
  13: 'trophy',
  14: 'brain',
  15: 'rocket',
  16: 'flowchart',
  17: 'terminal',
  18: 'package-box',
  19: 'book',
  20: 'code-brackets',
}

export const moduleArt = (n: number): ArtName => MODULE_ART[n] ?? 'star'
