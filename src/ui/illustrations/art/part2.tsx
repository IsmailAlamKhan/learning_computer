import type { ArtName } from '../names'
import type { ArtComponent } from '../types'
import { INTERNET_ART } from './part2/internet'
import { THINKING_ART } from './part2/thinking'
import { REWARDS_ART } from './part2/rewards'
import { DIDI_ART } from './part2/didi'

/** Internet/safety, programming/thinking, rewards, mentor illustrations (ART-2). */
export const ART_PART2: Partial<Record<ArtName, ArtComponent>> = { ...INTERNET_ART, ...THINKING_ART, ...REWARDS_ART, ...DIDI_ART }
