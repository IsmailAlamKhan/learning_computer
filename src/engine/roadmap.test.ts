import { describe, expect, it } from 'vitest'
import { moduleState, todaysModule } from './roadmap'
import { defaultData, emptyModuleProgress } from '../state/progress'
import { MODULES } from '../content/modules'

const withPlayable = (n: number) => ({ ...MODULES[n - 1], status: 'playable' as const })

describe('roadmap', () => {
  it('unlocks module 1 and locks later ones while the previous playable module is incomplete', () => {
    const d = defaultData()
    const m1 = MODULES[0]
    const old = m1.status
    m1.status = 'playable'
    try {
      expect(moduleState(withPlayable(1), d)).toBe('unlocked')
      expect(moduleState(withPlayable(2), d)).toBe('locked')
    } finally {
      m1.status = old
    }
  })
  it('skips modules that are still coming soon when unlocking', () => {
    const d = defaultData()
    const m1 = MODULES[0]
    const old = m1.status
    m1.status = 'soon'
    try {
      expect(moduleState(withPlayable(2), d)).toBe('unlocked')
    } finally {
      m1.status = old
    }
  })
  it('unlocks the next after completion', () => {
    const d = defaultData()
    d.modules[1] = { ...emptyModuleProgress(), completed: true }
    expect(moduleState(withPlayable(1), d)).toBe('completed')
    expect(moduleState(withPlayable(2), d)).toBe('unlocked')
  })
  it('unlockAll opens everything playable', () => {
    const d = defaultData()
    d.settings.unlockAll = true
    expect(moduleState(withPlayable(7), d)).toBe('unlocked')
  })
  it('shows soon for unfinished modules', () => {
    expect(moduleState({ ...MODULES[19], status: 'soon' }, defaultData())).toBe('soon')
  })
  it('has 20 modules in order', () => {
    expect(MODULES.map((m) => m.module)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    expect(typeof todaysModule(defaultData())).not.toBe('number')
  })
})
