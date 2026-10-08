import type { OsFlavor, OsVariant } from './types'

export function matchesOs(variant: OsVariant | undefined, os: OsFlavor): boolean {
  return !variant || variant === 'both' || variant === os
}

export function filterByOs<T extends { osVariant?: OsVariant }>(items: T[], os: OsFlavor): T[] {
  return items.filter((i) => matchesOs(i.osVariant, os))
}
