import { MODULES } from '../content/modules'
import type { ModuleMeta } from './types'
import type { ProgressData } from '../state/progress'

export type ModuleState = 'completed' | 'unlocked' | 'locked' | 'soon'

export function moduleState(m: ModuleMeta, data: ProgressData): ModuleState {
  if (data.modules[m.module]?.completed) return 'completed'
  if (m.status === 'soon') return 'soon'
  if (data.settings.unlockAll || m.module === 1) return 'unlocked'
  // unlocked once the previous *playable* module is completed (modules still marked 'soon' are skipped)
  const prev = [...MODULES].reverse().find((x) => x.module < m.module && x.status === 'playable')
  return !prev || data.modules[prev.module]?.completed ? 'unlocked' : 'locked'
}

/** The module "আজকের পাঠ" should open: first playable, not completed, unlocked. */
export function todaysModule(data: ProgressData): ModuleMeta | undefined {
  return MODULES.find((m) => moduleState(m, data) === 'unlocked')
}

export function completedCount(data: ProgressData): number {
  return MODULES.filter((m) => data.modules[m.module]?.completed).length
}
