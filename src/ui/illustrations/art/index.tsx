import { ART_NAMES, type ArtName } from '../names'
import { ART_PART1 } from './part1'
import { ART_PART2 } from './part2'
import type { ArtComponent } from '../types'
import { ART as C } from '../palette'

const Placeholder: ArtComponent = ({ size = 160, className, title }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label={title ?? 'ছবি'}>
    <rect x="30" y="30" width="140" height="140" rx="32" fill={C.violetPale} stroke={C.violet} strokeWidth="4" strokeDasharray="10 8" />
    <circle cx="100" cy="100" r="22" fill={C.violetSoft} />
  </svg>
)

/** Every ArtName resolves to a component (a dashed placeholder until its artwork exists). */
export const ART: Record<ArtName, ArtComponent> = Object.fromEntries(
  ART_NAMES.map((n) => [n, ART_PART1[n] ?? ART_PART2[n] ?? Placeholder]),
) as Record<ArtName, ArtComponent>

/** Names that still render the placeholder (used by a unit test to keep the library complete). */
export const missingArt = (): ArtName[] => ART_NAMES.filter((n) => !ART_PART1[n] && !ART_PART2[n])
