import { describe, expect, it } from 'vitest'
import { MODULES } from '../content/modules'
import { defaultData, emptyModuleProgress, type ModuleProgress, type ProgressData } from '../state/progress'
import {
  LOW_SCORE_RATIO,
  STALL_DAYS,
  buildReportHtml,
  daysBetween,
  lessonMetaOf,
  relativeDayBn,
  reportFilename,
  summarize,
  summarizeModule,
  weakModules,
  weakQuestions,
  type Fmt,
  type LessonMeta,
} from './teacher'
import type { Lesson } from '../engine/types'
import m02 from '../content/lessons/m02'
import m17 from '../content/lessons/m17'
import m20 from '../content/lessons/m20'

const NOW = new Date('2026-10-20T10:00:00.000Z')
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86400000).toISOString()
const f: Fmt = { n: (v) => String(v), date: (d) => String(d).slice(0, 10) }

const meta = (module: number, w = 10, m = 8, quizIds = ['q1', 'q2', 'q3']): LessonMeta => ({
  module,
  steps: { windows: w, mac: m },
  stepIds: {
    windows: Array.from({ length: w }, (_, i) => `w${i + 1}`),
    mac: Array.from({ length: m }, (_, i) => `m${i + 1}`),
  },
  quiz: quizIds.map((id) => ({ id, questionBn: `প্রশ্ন ${id}`, hintBn: `ইঙ্গিত ${id}` })),
  realWorld: { windows: 3, mac: 3 },
})

const mp = (over: Partial<ModuleProgress> = {}): ModuleProgress => ({ ...emptyModuleProgress(), ...over })
const mod = (n: number) => MODULES.find((x) => x.module === n)!

describe('lessonMetaOf', () => {
  it('counts steps per OS (both counts for each) and keeps ids', () => {
    const lm = lessonMetaOf(m02 as Lesson)
    expect(lm.module).toBe(2)
    expect(lm.steps.windows).toBe(m02.steps.filter((s) => s.osVariant !== 'mac').length)
    expect(lm.steps.mac).toBe(m02.steps.filter((s) => s.osVariant !== 'windows').length)
    expect(lm.stepIds.windows).toHaveLength(lm.steps.windows)
    expect(lm.quiz.length).toBe(m02.quiz.length)
    expect(lm.quiz[0]).toEqual({ id: m02.quiz[0].id, questionBn: m02.quiz[0].questionBn, hintBn: m02.quiz[0].hintBn })
    expect(lm.realWorld.windows).toBeGreaterThanOrEqual(m02.realWorld.tasksBn.length)
  })
  it('uses chapter steps for chaptered lessons (module 20)', () => {
    const lm = lessonMetaOf(m20 as Lesson)
    const total = m20.chapters!.flatMap((c) => c.steps).filter((s) => s.osVariant !== 'mac').length
    expect(lm.steps.windows).toBe(total)
    expect(total).toBeGreaterThan(0)
  })
  it('works for a terminal lesson', () => {
    const lm = lessonMetaOf(m17 as Lesson)
    expect(lm.steps.windows).toBeGreaterThan(5)
    expect(new Set(lm.stepIds.windows).size).toBe(lm.stepIds.windows.length)
  })
})

describe('daysBetween / relativeDayBn', () => {
  it('whole days, clamped at 0, undefined for bad input', () => {
    expect(daysBetween(daysAgo(3), NOW)).toBe(3)
    expect(daysBetween(NOW.toISOString(), NOW)).toBe(0)
    expect(daysBetween(new Date(NOW.getTime() + 5e6).toISOString(), NOW)).toBe(0)
    expect(daysBetween(undefined, NOW)).toBeUndefined()
    expect(daysBetween('garbage', NOW)).toBeUndefined()
  })
  it('labels in Bengali', () => {
    expect(relativeDayBn(daysAgo(0), NOW, f)).toBe('আজ')
    expect(relativeDayBn(daysAgo(1), NOW, f)).toBe('গতকাল')
    expect(relativeDayBn(daysAgo(4), NOW, f)).toBe('4 দিন আগে')
    expect(relativeDayBn(undefined, NOW, f)).toBe('')
  })
})

describe('summarizeModule status', () => {
  it('not started with no progress or empty progress', () => {
    expect(summarizeModule(mod(1), undefined, meta(1), NOW).status).toBe('notStarted')
    expect(summarizeModule(mod(1), mp(), meta(1), NOW).status).toBe('notStarted')
    // only visiting the page does not count as "in progress"
    expect(summarizeModule(mod(1), mp({ lastVisitedAt: daysAgo(1) }), meta(1), NOW).status).toBe('notStarted')
  })
  it('in progress for any activity', () => {
    for (const p of [
      mp({ explanationRead: true }),
      mp({ freePracticeDone: true }),
      mp({ stepsDone: { windows: ['w1'], mac: [] } }),
      mp({ stepsDone: { windows: [], mac: ['m1'] } }),
      mp({ realWorldChecked: [0] }),
      mp({ quiz: { score: 2, total: 3, wrongByQuestion: {}, at: daysAgo(1) } }),
    ]) {
      expect(summarizeModule(mod(1), p, meta(1), NOW).status).toBe('inProgress')
    }
  })
  it('completed wins, with its date', () => {
    const s = summarizeModule(mod(1), mp({ completed: true, completedAt: daysAgo(2) }), meta(1), NOW)
    expect(s.status).toBe('completed')
    expect(s.completedAt).toBe(daysAgo(2))
  })
  it('flags non-playable modules', () => {
    expect(summarizeModule({ ...mod(1), status: 'soon' }, undefined, undefined, NOW).playable).toBe(false)
    expect(summarizeModule(mod(1), undefined, undefined, NOW).playable).toBe(true)
  })
})

describe('summarizeModule steps', () => {
  it('counts done/total per OS independently', () => {
    const s = summarizeModule(mod(2), mp({ stepsDone: { windows: ['w1', 'w2', 'w3'], mac: ['m1'] } }), meta(2, 10, 8), NOW)
    expect(s.steps.windows).toEqual({ done: 3, total: 10 })
    expect(s.steps.mac).toEqual({ done: 1, total: 8 })
  })
  it('ignores step ids that no longer exist and never exceeds total', () => {
    const s = summarizeModule(mod(2), mp({ stepsDone: { windows: ['w1', 'old-1', 'old-2'], mac: [] } }), meta(2, 2, 2), NOW)
    expect(s.steps.windows).toEqual({ done: 1, total: 2 })
  })
  it('without lesson metadata shows raw counts and total 0', () => {
    const s = summarizeModule(mod(2), mp({ stepsDone: { windows: ['a', 'b'], mac: [] } }), undefined, NOW)
    expect(s.steps.windows).toEqual({ done: 2, total: 0 })
  })
})

describe('summarizeModule quiz', () => {
  const quiz = (score: number, total: number, wrong: Record<string, number> = {}) => ({ score, total, wrongByQuestion: wrong, at: daysAgo(1) })
  it('reports last, best, total and retries (sum of wrong attempts)', () => {
    const s = summarizeModule(mod(2), mp({ quiz: quiz(4, 5, { q1: 2, q2: 1 }), bestQuizScore: 4 }), meta(2), NOW)
    expect(s.quiz).toMatchObject({ last: 4, best: 4, total: 5, retries: 3 })
    expect(s.quiz?.ratio).toBeCloseTo(0.8)
  })
  it('best is the maximum of bestQuizScore and last', () => {
    expect(summarizeModule(mod(2), mp({ quiz: quiz(2, 5), bestQuizScore: 5 }), meta(2), NOW).quiz?.best).toBe(5)
    expect(summarizeModule(mod(2), mp({ quiz: quiz(3, 5) }), meta(2), NOW).quiz?.best).toBe(3)
  })
  it('falls back to lesson question count when total is 0', () => {
    expect(summarizeModule(mod(2), mp({ quiz: quiz(1, 0) }), meta(2, 1, 1, ['a', 'b']), NOW).quiz?.total).toBe(2)
  })
  it('no quiz -> undefined', () => {
    expect(summarizeModule(mod(2), mp(), meta(2), NOW).quiz).toBeUndefined()
  })
  it('lowScore uses the 60% threshold on the best result', () => {
    expect(LOW_SCORE_RATIO).toBe(0.6)
    expect(summarizeModule(mod(2), mp({ quiz: quiz(2, 5), bestQuizScore: 2 }), meta(2), NOW).lowScore).toBe(true) // 40%
    expect(summarizeModule(mod(2), mp({ quiz: quiz(3, 5), bestQuizScore: 3 }), meta(2), NOW).lowScore).toBe(false) // exactly 60%
    expect(summarizeModule(mod(2), mp({ quiz: quiz(1, 5), bestQuizScore: 4 }), meta(2), NOW).lowScore).toBe(false) // recovered
    expect(summarizeModule(mod(2), mp({ quiz: quiz(0, 0) }), undefined, NOW).lowScore).toBe(false)
  })
})

describe('summarizeModule stalled', () => {
  const partial = { windows: ['w1', 'w2'], mac: [] }
  it('partial steps and away for a week -> stalled', () => {
    expect(summarizeModule(mod(2), mp({ stepsDone: partial, lastVisitedAt: daysAgo(STALL_DAYS) }), meta(2), NOW).stalled).toBe(true)
    expect(summarizeModule(mod(2), mp({ stepsDone: partial, lastVisitedAt: daysAgo(30) }), meta(2), NOW).stalled).toBe(true)
  })
  it('recent visit -> not stalled', () => {
    expect(summarizeModule(mod(2), mp({ stepsDone: partial, lastVisitedAt: daysAgo(STALL_DAYS - 1) }), meta(2), NOW).stalled).toBe(false)
  })
  it('no visit date counts as long ago', () => {
    expect(summarizeModule(mod(2), mp({ stepsDone: partial }), meta(2), NOW).stalled).toBe(true)
  })
  it('finished on one OS is not stalled; completed is not stalled; no steps is not stalled', () => {
    const all = Array.from({ length: 10 }, (_, i) => `w${i + 1}`)
    expect(summarizeModule(mod(2), mp({ stepsDone: { windows: all, mac: ['m1'] }, lastVisitedAt: daysAgo(40) }), meta(2), NOW).stalled).toBe(false)
    expect(summarizeModule(mod(2), mp({ completed: true, stepsDone: partial, lastVisitedAt: daysAgo(40) }), meta(2), NOW).stalled).toBe(false)
    expect(summarizeModule(mod(2), mp({ explanationRead: true, lastVisitedAt: daysAgo(40) }), meta(2), NOW).stalled).toBe(false)
  })
})

describe('summarizeModule misc', () => {
  it('free practice and real-world ticks', () => {
    const s = summarizeModule(mod(2), mp({ freePracticeDone: true, realWorldChecked: [0, 2] }), meta(2), NOW)
    expect(s.freePracticeDone).toBe(true)
    expect(s.realWorld).toEqual({ ticked: 2, total: 3 })
  })
})

describe('weakQuestions', () => {
  const data = (): ProgressData => {
    const d = defaultData()
    d.modules[2] = mp({ quiz: { score: 1, total: 3, at: '', wrongByQuestion: { q1: 1, q2: 0, q3: 3 } } })
    d.modules[4] = mp({ quiz: { score: 2, total: 3, at: '', wrongByQuestion: { q1: 3, gone: 1 } } })
    d.modules[5] = mp()
    return d
  }
  const metas = { 2: meta(2), 4: meta(4) }
  it('lists missed questions, most missed first, with text and hint', () => {
    const w = weakQuestions(data(), metas)
    expect(w.map((x) => `${x.module}/${x.questionId}/${x.misses}`)).toEqual(['2/q3/3', '4/q1/3', '2/q1/1', '4/gone/1'])
    expect(w[0]).toMatchObject({ questionBn: 'প্রশ্ন q3', hintBn: 'ইঙ্গিত q3', moduleTitleBn: mod(2).titleBn })
  })
  it('keeps questions that no longer exist, with null text', () => {
    const gone = weakQuestions(data(), metas).find((x) => x.questionId === 'gone')!
    expect(gone.questionBn).toBeNull()
    expect(gone.hintBn).toBeNull()
  })
  it('works without lesson metadata', () => {
    expect(weakQuestions(data(), {}).every((x) => x.questionBn === null)).toBe(true)
  })
  it('is empty for a fresh profile', () => {
    expect(weakQuestions(defaultData(), {})).toEqual([])
  })
})

describe('weakModules', () => {
  it('combines low-score and stalled reasons', () => {
    const lowQuiz = { score: 1, total: 5, wrongByQuestion: {}, at: daysAgo(1) }
    const sums = [
      summarizeModule(mod(2), mp({ quiz: lowQuiz, bestQuizScore: 1, stepsDone: { windows: ['w1'], mac: [] }, lastVisitedAt: daysAgo(20) }), meta(2), NOW),
      summarizeModule(mod(3), mp({ stepsDone: { windows: ['w1'], mac: [] }, lastVisitedAt: daysAgo(1) }), meta(3), NOW),
      summarizeModule(mod(4), mp({ stepsDone: { windows: ['w1'], mac: [] }, lastVisitedAt: daysAgo(20) }), meta(4), NOW),
    ]
    const w = weakModules(sums)
    expect(w.map((x) => [x.module, x.reasons])).toEqual([
      [2, ['lowScore', 'stalled']],
      [4, ['stalled']],
    ])
    expect(w[0].ratio).toBeCloseTo(0.2)
    expect(w[1].ratio).toBeUndefined()
  })
})

describe('summarize (whole dashboard)', () => {
  const build = () => {
    const d = defaultData()
    d.profile = { ...d.profile, name: 'রুমা', os: 'mac', motivation: 'ওয়েবসাইট বানাতে চাই' }
    for (const n of [1, 2, 3]) d.modules[n] = mp({ completed: true, completedAt: daysAgo(10 - n), lastVisitedAt: daysAgo(10 - n) })
    d.modules[14] = mp({ completed: true, completedAt: daysAgo(1), lastVisitedAt: daysAgo(1) })
    d.modules[4] = mp({ stepsDone: { windows: ['w1'], mac: [] }, lastVisitedAt: daysAgo(0) })
    d.certificates = [
      { part: 2, issuedAt: daysAgo(1), name: 'রুমা' },
      { part: 1, issuedAt: daysAgo(5), name: 'রুমা' },
    ]
    d.notebook = [
      { id: 'a', title: 'x', body: 'y', updatedAt: '' },
      { id: 'b', title: 'x', body: 'y', updatedAt: '' },
    ]
    return d
  }
  it('overall and per-part progress (13 + 7 modules)', () => {
    const s = summarize(build(), {}, NOW)
    expect(s.overall).toEqual({ done: 4, total: 20, pct: 20 })
    expect(s.parts[0]).toEqual({ part: 1, done: 3, total: 13, pct: 23 })
    expect(s.parts[1]).toEqual({ part: 2, done: 1, total: 7, pct: 14 })
  })
  it('profile, notes, certificates sorted by part', () => {
    const s = summarize(build(), {}, NOW)
    expect(s.learnerName).toBe('রুমা')
    expect(s.os).toBe('mac')
    expect(s.noteCount).toBe(2)
    expect(s.certificates.map((c) => c.part)).toEqual([1, 2])
  })
  it('recent activity is newest first and limited to 5', () => {
    const d = build()
    for (const n of [5, 6, 7, 8]) d.modules[n] = mp({ explanationRead: true, lastVisitedAt: daysAgo(20 + n) })
    const s = summarize(d, {}, NOW)
    expect(s.recent).toHaveLength(5)
    expect(s.recent[0].module).toBe(4) // today
    expect(s.recent[1].module).toBe(14) // yesterday
    expect(s.recent.map((m) => m.module)).toEqual([4, 14, 3, 2, 1]) // the 20+ day old ones fall off
  })
  it('counts in-progress and not-started', () => {
    const s = summarize(build(), {}, NOW)
    expect(s.inProgressCount).toBe(1)
    expect(s.notStartedCount).toBe(15)
  })
  it('a fresh profile gives zeros, no crashes', () => {
    const s = summarize(defaultData(), {}, NOW)
    expect(s.overall).toEqual({ done: 0, total: 20, pct: 0 })
    expect(s.recent).toEqual([])
    expect(s.weakQuestions).toEqual([])
    expect(s.weakModules).toEqual([])
    expect(s.certificates).toEqual([])
    expect(s.modules).toHaveLength(20)
  })
  it('uses metas for step totals', () => {
    const d = build()
    const s = summarize(d, { 4: meta(4, 12, 9) }, NOW)
    expect(s.modules.find((m) => m.module === 4)?.steps.windows).toEqual({ done: 1, total: 12 })
  })
  it('handles an empty module list', () => {
    expect(summarize(defaultData(), {}, NOW, []).overall).toEqual({ done: 0, total: 0, pct: 0 })
  })
})

describe('buildReportHtml', () => {
  const data = () => {
    const d = defaultData()
    d.profile.name = 'রুমা <script>'
    d.modules[2] = mp({
      stepsDone: { windows: ['w1', 'w2'], mac: [] },
      quiz: { score: 1, total: 3, at: daysAgo(1), wrongByQuestion: { q1: 2 } },
      bestQuizScore: 1,
      lastVisitedAt: daysAgo(10),
    })
    d.certificates = [{ part: 1, issuedAt: daysAgo(2), name: 'রুমা' }]
    return d
  }
  const html = () => buildReportHtml(summarize(data(), { 2: meta(2, 10, 8) }, NOW), f)
  it('is a standalone Bengali HTML page with a table caption and scoped headers', () => {
    const h = html()
    expect(h.startsWith('<!doctype html>')).toBe(true)
    expect(h).toContain('lang="bn"')
    expect(h).toContain('<caption>')
    expect(h).toContain('scope="col"')
    expect(h).toContain('scope="row"')
    expect(h).not.toMatch(/<script/i)
    expect(h).not.toMatch(/https?:\/\//)
  })
  it('escapes user text', () => {
    expect(html()).toContain('রুমা &lt;script&gt;')
  })
  it('contains the numbers: steps, quiz, weak questions, certificate', () => {
    const h = html()
    expect(h).toContain('2/10')
    expect(h).toContain('1/3')
    expect(h).toContain('প্রশ্ন q1')
    expect(h).toContain('এই পাঠটি আবার দেখুন')
    expect(h).toContain('পর্ব 1')
    expect(h).toContain('0/8')
  })
  it('works for an empty profile (no weak topics message)', () => {
    const h = buildReportHtml(summarize(defaultData(), {}, NOW), f)
    expect(h).toContain('শিক্ষার্থী')
    expect(h).toContain('এখনো কোনো প্রশ্নে বারবার ভুল হয়নি')
    expect(h).toContain('এখনো কোনো সনদ পাওয়া হয়নি')
  })
  it('file names carry the date', () => {
    const s = summarize(defaultData(), {}, NOW)
    expect(reportFilename(s, 'html')).toBe('computer-shikhi-report-2026-10-20.html')
    expect(reportFilename(s, 'json')).toBe('computer-shikhi-backup-2026-10-20.json')
  })
})
