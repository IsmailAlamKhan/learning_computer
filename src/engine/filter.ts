import type { InputKind, InputVariant, OsFlavor, OsVariant } from './types'

export function matchesOs(variant: OsVariant | undefined, os: OsFlavor): boolean {
  return !variant || variant === 'both' || variant === os
}

export function filterByOs<T extends { osVariant?: OsVariant }>(items: T[], os: OsFlavor): T[] {
  return items.filter((i) => matchesOs(i.osVariant, os))
}

/** A touchscreen counts as a touchpad (two-finger gestures, no right button). */
export const normalizeInput = (input: InputKind | 'touch' | undefined): InputKind => (input === 'touchpad' || input === 'touch' ? 'touchpad' : 'mouse')

/** `input` undefined = do not filter by pointing device. */
export function matchesInput(variant: InputVariant | undefined, input: InputKind | 'touch' | undefined): boolean {
  if (!variant || variant === 'both' || input === undefined) return true
  return variant === normalizeInput(input)
}

export function filterByInput<T extends { inputVariant?: InputVariant }>(items: T[], input: InputKind | 'touch' | undefined): T[] {
  return items.filter((i) => matchesInput(i.inputVariant, input))
}
