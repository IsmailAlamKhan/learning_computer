/**
 * Progress store: pure data + safe persistence. No React in here (see store.ts for the hook).
 * Everything touching localStorage is wrapped in try/catch with an in-memory fallback.
 */
import type { InputKind, OsFlavor, } from '../engine/types'
import { advanceStreak, dayKey, rollDaily, XP, type DailyProgress, type Streak } from './gamification'

export const STORAGE_KEY = 'computer-shikhi:v1'
export const SCHEMA_VERSION = 1

export type ThemeSetting = 'light' | 'dark'
export type TextSize = 'normal' | 'large' | 'xlarge' | 'xxlarge'
export type NumeralStyle = 'bengali' | 'western'

export interface Profile {
  name: string
  os: OsFlavor
  motivation: string
  /** pointing device: detected automatically, can be changed in Settings */
  input: InputKind
  /** true when `os`/`input` were detected by the browser (shown as "detected" in Settings) */
  autoDetected: boolean
  onboarded: boolean
  createdAt: string
}

export interface Settings {
  theme: ThemeSetting
  textSize: TextSize
  numerals: NumeralStyle
  /** Teacher option: show every module as unlocked. */
  unlockAll: boolean
  /** daily goal: number of mini-lessons per day */
  dailyGoal: number
}

export interface QuizAttempt {
  /** question id -> number of wrong attempts before correct (0 = first try) */
  wrongByQuestion: Record<string, number>
  score: number
  total: number
  at: string
}

export interface ModuleProgress {
  /** step ids completed, per OS flavor, so Windows and Mac progress are tracked separately */
  stepsDone: Record<OsFlavor, string[]>
  /** legacy (pre-cards) flag: no longer set, kept so old backups import and count as activity */
  explanationRead: boolean
  /** ids of finished units (mini-lessons) of this module */
  unitsDone: string[]
  /** quiz result per unit id */
  unitQuiz: Record<string, QuizAttempt>
  freePracticeDone: boolean
  quiz?: QuizAttempt
  bestQuizScore?: number
  completed: boolean
  completedAt?: string
  lastVisitedAt?: string
  realWorldChecked: number[]
}

export interface NotebookNote {
  id: string
  title: string
  body: string
  updatedAt: string
}

export interface ProgressData {
  version: number
  profile: Profile
  settings: Settings
  modules: Record<number, ModuleProgress>
  notebook: NotebookNote[]
  certificates: { part: 1 | 2; issuedAt: string; name: string }[]
  xp: number
  streak: Streak
  badges: string[]
  daily: DailyProgress
  /** Free-form per-module data lessons may stash (capstone checklists, vfs snapshots...). */
  extras: Record<string, unknown>
}

export const defaultProfile = (): Profile => ({
  name: '',
  os: 'windows',
  motivation: '',
  input: 'mouse',
  autoDetected: false,
  onboarded: false,
  createdAt: new Date().toISOString(),
})

export const defaultSettings = (): Settings => ({
  theme: 'light',
  textSize: 'normal',
  numerals: 'bengali',
  unlockAll: false,
  dailyGoal: 1,
})

export const emptyModuleProgress = (): ModuleProgress => ({
  stepsDone: { windows: [], mac: [] },
  explanationRead: false,
  unitsDone: [],
  unitQuiz: {},
  freePracticeDone: false,
  completed: false,
  realWorldChecked: [],
})

export const defaultData = (): ProgressData => ({
  version: SCHEMA_VERSION,
  profile: defaultProfile(),
  settings: defaultSettings(),
  modules: {},
  notebook: [],
  certificates: [],
  xp: 0,
  streak: { count: 0, best: 0, lastDay: '' },
  badges: [],
  daily: { day: '', lessons: 0, xp: 0 },
  extras: {},
})

// ---------- storage (try/catch + in-memory fallback) ----------

export interface StorageLike {
  getItem(k: string): string | null
  setItem(k: string, v: string): void
  removeItem(k: string): void
}

class MemoryStorage implements StorageLike {
  private m = new Map<string, string>()
  getItem(k: string) {
    return this.m.has(k) ? (this.m.get(k) as string) : null
  }
  setItem(k: string, v: string) {
    this.m.set(k, v)
  }
  removeItem(k: string) {
    this.m.delete(k)
  }
}

export function pickStorage(): { storage: StorageLike; persistent: boolean } {
  try {
    const ls = globalThis.localStorage
    if (!ls) throw new Error('no localStorage')
    const probe = '__probe__'
    ls.setItem(probe, '1')
    ls.removeItem(probe)
    return { storage: ls, persistent: true }
  } catch {
    return { storage: new MemoryStorage(), persistent: false }
  }
}

// ---------- validation / migration ----------

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const asStr = (v: unknown, d = '') => (typeof v === 'string' ? v : d)
const asBool = (v: unknown, d = false) => (typeof v === 'boolean' ? v : d)
const asNum = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
const asStrArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], d: T): T =>
  typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : d

function sanitizeModule(v: unknown): ModuleProgress {
  const d = emptyModuleProgress()
  if (!isObj(v)) return d
  const sd = isObj(v.stepsDone) ? v.stepsDone : {}
  const quiz = isObj(v.quiz)
    ? {
        wrongByQuestion: isObj(v.quiz.wrongByQuestion)
          ? Object.fromEntries(
              Object.entries(v.quiz.wrongByQuestion).filter(([, n]) => typeof n === 'number'),
            ) as Record<string, number>
          : {},
        score: asNum(v.quiz.score),
        total: asNum(v.quiz.total),
        at: asStr(v.quiz.at),
      }
    : undefined
  const unitQuiz: Record<string, QuizAttempt> = {}
  if (isObj(v.unitQuiz)) {
    for (const [k, q] of Object.entries(v.unitQuiz)) {
      if (!isObj(q)) continue
      unitQuiz[k] = {
        wrongByQuestion: isObj(q.wrongByQuestion)
          ? (Object.fromEntries(Object.entries(q.wrongByQuestion).filter(([, n]) => typeof n === 'number')) as Record<string, number>)
          : {},
        score: asNum(q.score),
        total: asNum(q.total),
        at: asStr(q.at),
      }
    }
  }
  return {
    stepsDone: { windows: asStrArr(sd.windows), mac: asStrArr(sd.mac) },
    explanationRead: asBool(v.explanationRead),
    unitsDone: asStrArr(v.unitsDone),
    unitQuiz,
    freePracticeDone: asBool(v.freePracticeDone),
    quiz,
    bestQuizScore: typeof v.bestQuizScore === 'number' ? v.bestQuizScore : undefined,
    completed: asBool(v.completed),
    completedAt: typeof v.completedAt === 'string' ? v.completedAt : undefined,
    lastVisitedAt: typeof v.lastVisitedAt === 'string' ? v.lastVisitedAt : undefined,
    realWorldChecked: Array.isArray(v.realWorldChecked)
      ? v.realWorldChecked.filter((x): x is number => typeof x === 'number')
      : [],
  }
}

/** Turn any unknown JSON into valid ProgressData, or throw if it clearly isn't ours. */
export function sanitize(raw: unknown): ProgressData {
  if (!isObj(raw)) throw new Error('not an object')
  if (typeof raw.version !== 'number') throw new Error('missing version')
  if (raw.version > SCHEMA_VERSION) throw new Error('newer version')
  const d = defaultData()
  const p = isObj(raw.profile) ? raw.profile : {}
  const s = isObj(raw.settings) ? raw.settings : {}
  const mods: Record<number, ModuleProgress> = {}
  if (isObj(raw.modules)) {
    for (const [k, v] of Object.entries(raw.modules)) {
      const n = Number(k)
      if (Number.isInteger(n) && n >= 1 && n <= 99) mods[n] = sanitizeModule(v)
    }
  }
  return {
    version: SCHEMA_VERSION,
    profile: {
      name: asStr(p.name).slice(0, 80),
      os: oneOf(p.os, ['windows', 'mac'] as const, 'windows'),
      motivation: asStr(p.motivation).slice(0, 1000),
      input: oneOf(p.input, ['mouse', 'touchpad'] as const, 'mouse'),
      autoDetected: asBool(p.autoDetected),
      onboarded: asBool(p.onboarded),
      createdAt: asStr(p.createdAt, d.profile.createdAt),
    },
    settings: {
      theme: oneOf(s.theme, ['light', 'dark'] as const, 'light'),
      textSize: oneOf(s.textSize, ['normal', 'large', 'xlarge', 'xxlarge'] as const, 'normal'),
      numerals: oneOf(s.numerals, ['bengali', 'western'] as const, 'bengali'),
      unlockAll: asBool(s.unlockAll),
      dailyGoal: Math.min(5, Math.max(1, Math.round(asNum(s.dailyGoal, 1)))),
    },
    modules: mods,
    notebook: Array.isArray(raw.notebook)
      ? raw.notebook.filter(isObj).map((n) => ({
          id: asStr(n.id, crypto.randomUUID()),
          title: asStr(n.title).slice(0, 200),
          body: asStr(n.body).slice(0, 20000),
          updatedAt: asStr(n.updatedAt),
        }))
      : [],
    certificates: Array.isArray(raw.certificates)
      ? raw.certificates
          .filter(isObj)
          .filter((c) => c.part === 1 || c.part === 2)
          .map((c) => ({ part: c.part as 1 | 2, issuedAt: asStr(c.issuedAt), name: asStr(c.name) }))
      : [],
    xp: Math.max(0, Math.round(asNum(raw.xp))),
    streak: isObj(raw.streak)
      ? { count: Math.max(0, asNum(raw.streak.count)), best: Math.max(0, asNum(raw.streak.best)), lastDay: asStr(raw.streak.lastDay) }
      : d.streak,
    badges: asStrArr(raw.badges),
    daily: isObj(raw.daily) ? { day: asStr(raw.daily.day), lessons: Math.max(0, asNum(raw.daily.lessons)), xp: Math.max(0, asNum(raw.daily.xp)) } : d.daily,
    extras: isObj(raw.extras) ? raw.extras : {},
  }
}

// ---------- the store ----------

export class ProgressStore {
  private data: ProgressData
  private listeners = new Set<() => void>()
  readonly persistent: boolean
  private storage: StorageLike
  /** true when stored data existed but was unreadable (so the UI can mention it). */
  loadFailed = false

  constructor(storage?: StorageLike) {
    if (storage) {
      this.storage = storage
      this.persistent = true
    } else {
      const p = pickStorage()
      this.storage = p.storage
      this.persistent = p.persistent
    }
    this.data = this.load()
  }

  private load(): ProgressData {
    try {
      const txt = this.storage.getItem(STORAGE_KEY)
      if (!txt) return defaultData()
      return sanitize(JSON.parse(txt))
    } catch {
      this.loadFailed = true
      return defaultData()
    }
  }

  private save() {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }

  getSnapshot = (): ProgressData => this.data

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  /** Replace data with an immutable update and persist. */
  update(fn: (d: ProgressData) => ProgressData) {
    this.data = fn(this.data)
    this.save()
    this.listeners.forEach((l) => l())
  }

  setProfile(p: Partial<Profile>) {
    this.update((d) => ({ ...d, profile: { ...d.profile, ...p } }))
  }

  setSettings(s: Partial<Settings>) {
    this.update((d) => ({ ...d, settings: { ...d.settings, ...s } }))
  }

  private patchModule(n: number, fn: (m: ModuleProgress) => ModuleProgress) {
    this.update((d) => {
      const cur = d.modules[n] ?? emptyModuleProgress()
      return { ...d, modules: { ...d.modules, [n]: fn(cur) } }
    })
  }

  visitModule(n: number) {
    this.patchModule(n, (m) => ({ ...m, lastVisitedAt: new Date().toISOString() }))
  }

  markStepDone(n: number, os: OsFlavor, stepId: string) {
    this.patchModule(n, (m) =>
      m.stepsDone[os].includes(stepId)
        ? m
        : { ...m, stepsDone: { ...m.stepsDone, [os]: [...m.stepsDone[os], stepId] } },
    )
  }

  resetSteps(n: number, os: OsFlavor) {
    this.patchModule(n, (m) => ({ ...m, stepsDone: { ...m.stepsDone, [os]: [] } }))
  }

  markFreePracticeDone(n: number) {
    this.patchModule(n, (m) => ({ ...m, freePracticeDone: true }))
  }

  setRealWorldChecked(n: number, idx: number, checked: boolean) {
    this.patchModule(n, (m) => {
      const s = new Set(m.realWorldChecked)
      if (checked) s.add(idx)
      else s.delete(idx)
      return { ...m, realWorldChecked: [...s].sort((a, b) => a - b) }
    })
  }

  completeModule(n: number) {
    this.patchModule(n, (m) =>
      m.completed ? m : { ...m, completed: true, completedAt: new Date().toISOString() },
    )
  }

  addCertificate(part: 1 | 2) {
    this.update((d) => ({
      ...d,
      certificates: [
        ...d.certificates.filter((c) => c.part !== part),
        { part, issuedAt: new Date().toISOString(), name: d.profile.name },
      ],
    }))
  }

  // ---------- gamification ----------
  /** Add XP (also counts for today) and keep today's streak alive. */
  addXp(amount: number, today = dayKey()) {
    if (amount <= 0) return
    this.update((d) => {
      const daily = rollDaily(d.daily, today)
      return { ...d, xp: d.xp + amount, streak: advanceStreak(d.streak, today), daily: { ...daily, xp: daily.xp + amount } }
    })
  }

  awardBadge(id: string) {
    this.update((d) => (d.badges.includes(id) ? d : { ...d, badges: [...d.badges, id] }))
  }

  /** Mark a unit (mini-lesson) finished. Returns badges newly earned. */
  completeUnit(n: number, unitId: string, today = dayKey()): string[] {
    const before = this.data.badges
    this.patchModule(n, (m) => (m.unitsDone.includes(unitId) ? m : { ...m, unitsDone: [...m.unitsDone, unitId] }))
    const first = !this.data.daily || this.data.daily.day !== today || true
    void first
    this.update((d) => {
      const daily = rollDaily(d.daily, today)
      const already = d.modules[n]?.unitsDone.filter((u) => u === unitId).length ?? 0
      void already
      return { ...d, daily: { ...daily, lessons: daily.lessons + 1 } }
    })
    this.addXp(XP.unitDone, today)
    const s = this.data.streak
    this.awardBadge('first-lesson')
    if (s.count >= 3) this.awardBadge('streak-3')
    if (s.count >= 7) this.awardBadge('streak-7')
    return this.data.badges.filter((b) => !before.includes(b))
  }

  recordUnitQuiz(n: number, unitId: string, attempt: Omit<QuizAttempt, 'at'>) {
    const at = new Date().toISOString()
    this.patchModule(n, (m) => ({
      ...m,
      unitQuiz: { ...m.unitQuiz, [unitId]: { ...attempt, at } },
      quiz: { ...attempt, at },
      bestQuizScore: Math.max(m.bestQuizScore ?? 0, attempt.score),
    }))
    this.addXp(attempt.score * XP.quizQuestionFirstTry + (attempt.score === attempt.total && attempt.total > 0 ? XP.quizPerfectBonus : 0))
    if (attempt.score === attempt.total && attempt.total > 0) this.awardBadge('perfect-quiz')
  }

  setExtra(key: string, value: unknown) {
    this.update((d) => ({ ...d, extras: { ...d.extras, [key]: value } }))
  }

  upsertNote(note: Omit<NotebookNote, 'updatedAt'>) {
    const updatedAt = new Date().toISOString()
    this.update((d) => {
      const exists = d.notebook.some((n) => n.id === note.id)
      const notebook = exists
        ? d.notebook.map((n) => (n.id === note.id ? { ...note, updatedAt } : n))
        : [...d.notebook, { ...note, updatedAt }]
      return { ...d, notebook }
    })
  }

  deleteNote(id: string) {
    this.update((d) => ({ ...d, notebook: d.notebook.filter((n) => n.id !== id) }))
  }

  /** Reset only learning progress, keep profile and settings. */
  resetProgress() {
    this.update((d) => ({ ...d, modules: {}, certificates: [], extras: {}, xp: 0, streak: { count: 0, best: 0, lastDay: '' }, badges: [], daily: { day: '', lessons: 0, xp: 0 } }))
  }

  resetAll() {
    this.update(() => defaultData())
  }

  exportJson(): string {
    return JSON.stringify({ app: 'computer-shikhi', exportedAt: new Date().toISOString(), ...this.data }, null, 2)
  }

  /** Returns true on success. Invalid input leaves current data untouched. */
  importJson(text: string): boolean {
    try {
      const next = sanitize(JSON.parse(text))
      this.update(() => next)
      return true
    } catch {
      return false
    }
  }
}
