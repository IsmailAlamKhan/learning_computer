import type { ArtName } from '../names'
import type { ArtComponent } from '../types'
import { HARDWARE } from './part1/hardware'
import { FILES } from './part1/files'
import { SETTINGS } from './part1/settings'
import { TROUBLE } from './part1/trouble'

/** Hardware, files & operating system, settings, troubleshooting illustrations (ART-1). */
export const ART_PART1: Partial<Record<ArtName, ArtComponent>> = { ...HARDWARE, ...FILES, ...SETTINGS, ...TROUBLE }
