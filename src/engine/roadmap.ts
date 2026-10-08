import { MODULES } from '../content/modules'
import type { ModuleMeta } from './types'
import type { ProgressData } from '../state/progress'

export type ModuleState = 'completed' | 'unlocked' | 'locked' | 'soon'

export function moduleState(m: ModuleMeta, data: ProgressData): ModuleState {
  if (data.modules[m.module]?.completed) return 'completed'
  if (m.status === 'soon') return 'soon'
  if (data.settings.unlockAll || m.module === 1) return 'unlocked'
  return data.modules[m.module - 1]?.completed ? 'unlocked' : 'locked'
}

/** The module "আজকের পাঠ" should open: first playable, not completed, unlocked. */
export function todaysModule(data: ProgressData): ModuleMeta | undefined {
  return MODULES.find((m) => moduleState(m, data) === 'unlocked')
}

export function completedCount(data: ProgressData): number {
  return MODULES.filter((m) => data.modules[m.module]?.completed).length
}
