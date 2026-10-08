import { describe, expect, it } from 'vitest'
import { ProgressStore, STORAGE_KEY, sanitize, defaultData, type StorageLike } from './progress'

function mem(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>()
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  }
}

describe('ProgressStore', () => {
  it('starts with defaults and persists changes', () => {
    const m = mem()
    const s = new ProgressStore(m)
    expect(s.getSnapshot().profile.onboarded).toBe(false)
    s.setProfile({ name: 'বর্ষা', os: 'mac', onboarded: true })
    const saved = JSON.parse(m.map.get(STORAGE_KEY)!)
    expect(saved.profile.name).toBe('বর্ষা')
    const s2 = new ProgressStore(m)
    expect(s2.getSnapshot().profile.os).toBe('mac')
  })

  it('tracks steps per OS separately and without duplicates', () => {
    const s = new ProgressStore(mem())
    s.markStepDone(2, 'windows', 'a')
    s.markStepDone(2, 'windows', 'a')
    s.markStepDone(2, 'mac', 'b')
    const m = s.getSnapshot().modules[2]
    expect(m.stepsDone.windows).toEqual(['a'])
    expect(m.stepsDone.mac).toEqual(['b'])
  })

  it('keeps best quiz score and completes modules', () => {
    const s = new ProgressStore(mem())
    s.recordQuiz(2, { score: 3, total: 5, wrongByQuestion: { q1: 1 } })
    s.recordQuiz(2, { score: 2, total: 5, wrongByQuestion: {} })
    expect(s.getSnapshot().modules[2].bestQuizScore).toBe(3)
    s.completeModule(2)
    expect(s.getSnapshot().modules[2].completed).toBe(true)
  })

  it('notifies subscribers', () => {
    const s = new ProgressStore(mem())
    let n = 0
    const off = s.subscribe(() => n++)
    s.setSettings({ theme: 'dark' })
    off()
    s.setSettings({ theme: 'light' })
    expect(n).toBe(1)
  })

  it('survives corrupted storage', () => {
    const m = mem()
    m.setItem(STORAGE_KEY, '{not json')
    const s = new ProgressStore(m)
    expect(s.loadFailed).toBe(true)
    expect(s.getSnapshot().profile.name).toBe('')
  })

  it('survives a storage that throws', () => {
    const bad: StorageLike = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {},
    }
    const s = new ProgressStore(bad)
    expect(() => s.setProfile({ name: 'x' })).not.toThrow()
    expect(s.getSnapshot().profile.name).toBe('x')
  })

  it('exports and imports JSON round-trip', () => {
    const a = new ProgressStore(mem())
    a.setProfile({ name: 'রুমা', motivation: 'নিজের ওয়েবসাইট বানাতে চাই', onboarded: true })
    a.markStepDone(3, 'mac', 's1')
    a.completeModule(3)
    const text = a.exportJson()
    const b = new ProgressStore(mem())
    expect(b.importJson(text)).toBe(true)
    expect(b.getSnapshot().profile.name).toBe('রুমা')
    expect(b.getSnapshot().modules[3].completed).toBe(true)
    expect(b.getSnapshot().modules[3].stepsDone.mac).toEqual(['s1'])
  })

  it('rejects bad imports and leaves data untouched', () => {
    const s = new ProgressStore(mem())
    s.setProfile({ name: 'আগের' })
    expect(s.importJson('hello')).toBe(false)
    expect(s.importJson('{"foo":1}')).toBe(false)
    expect(s.importJson('{"version":999}')).toBe(false)
    expect(s.getSnapshot().profile.name).toBe('আগের')
  })

  it('sanitize coerces junk values to safe defaults', () => {
    const d = sanitize({ version: 1, profile: { os: 'linux', name: 5 }, settings: { theme: 'neon' }, modules: { '2': 'x', abc: {} } })
    expect(d.profile.os).toBe('windows')
    expect(d.profile.name).toBe('')
    expect(d.settings.theme).toBe('light')
    expect(d.modules[2].completed).toBe(false)
    expect(Object.keys(d.modules)).toEqual(['2'])
    expect(defaultData().version).toBe(1)
  })

  it('resetProgress keeps profile', () => {
    const s = new ProgressStore(mem())
    s.setProfile({ name: 'ক' })
    s.completeModule(1)
    s.resetProgress()
    expect(s.getSnapshot().modules).toEqual({})
    expect(s.getSnapshot().profile.name).toBe('ক')
  })
})
