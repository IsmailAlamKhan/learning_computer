/**
 * Teacher dashboard logic: pure functions that turn ProgressData + lesson metadata into summaries.
 * No React, no storage access, no network. Used by src/pages/Teacher.tsx and unit tested.
 */
import { lessonSteps } from '../engine/lessonSteps'
import { MODULES } from '../content/modules'
import { isCardsLesson, type InputKind, type LegacyLesson, type Lesson, type ModuleMeta, type OsFlavor, type QuizQuestion } from '../engine/types'
import { matchesInput } from '../engine/filter'
import type { ModuleProgress, ProgressData } from '../state/progress'

/** Quiz score below this share counts as "needs another look". */
export const LOW_SCORE_RATIO = 0.6
/** Started but not touched for this many days (with steps left over) counts as "stalled". */
export const STALL_DAYS = 7
export const RECENT_LIMIT = 5

const DAY_MS = 24 * 60 * 60 * 1000

// ---------- lesson metadata (the bits of a Lesson the dashboard needs) ----------

export interface QuestionMeta {
  id: string
  questionBn: string
  hintBn: string
}

export interface LessonMeta {
  module: number
  steps: Record<OsFlavor, number>
  /** ids of the guided steps per OS (so ids of steps deleted from an edited lesson are not counted) */
  stepIds: Record<OsFlavor, string[]>
  /** every question of the module (cards format: all units merged) */
  quiz: QuestionMeta[]
  /** cards format: ids of the units (mini-lessons); empty for legacy lessons */
  unitIds: string[]
  /** number of real-world tasks (common + per OS) */
  realWorld: Record<OsFlavor, number>
}

const forOs = (v: { osVariant?: string }, os: OsFlavor) => !v.osVariant || v.osVariant === 'both' || v.osVariant === os

/**
 * Reduce a full lesson (cards format or legacy) to the small numbers/texts the dashboard needs (so lessons need not stay in memory).
 * `input`: the learner's pointing device; steps meant for the other device are not counted (they can never be done by her).
 */
export function lessonMetaOf(lesson: Lesson | LegacyLesson, input?: InputKind): LessonMeta {
  const steps = lessonSteps(lesson).filter((s) => matchesInput(s.inputVariant, input))
  const r = lesson.realWorld
  const questions: QuizQuestion[] = isCardsLesson(lesson) ? lesson.units.flatMap((u) => u.quiz) : lesson.quiz
  return {
    module: lesson.module,
    steps: {
      windows: steps.filter((s) => forOs(s, 'windows')).length,
      mac: steps.filter((s) => forOs(s, 'mac')).length,
    },
    stepIds: {
      windows: steps.filter((s) => forOs(s, 'windows')).map((s) => s.id),
      mac: steps.filter((s) => forOs(s, 'mac')).map((s) => s.id),
    },
    quiz: questions.map((q) => ({ id: q.id, questionBn: q.questionBn, hintBn: q.hintBn })),
    unitIds: isCardsLesson(lesson) ? lesson.units.map((u) => u.id) : [],
    realWorld: {
      windows: r.tasksBn.length + (r.windowsTasksBn?.length ?? 0),
      mac: r.tasksBn.length + (r.macTasksBn?.length ?? 0),
    },
  }
}

// ---------- per-module summary ----------

export type ModuleStatusKind = 'notStarted' | 'inProgress' | 'completed'

/** A quiz result in the shape the dashboard needs, whichever format produced it. */
export interface QuizSummary {
  last: number
  best: number
  total: number
  lastAt: string
  retries: number
  ratio: number
}

/**
 * Quiz stats of a module. Cards format: one attempt per unit (`unitQuiz`), merged across units (scores and totals added up,
 * retries = sum of all wrong attempts). Legacy lessons: the single `quiz` attempt.
 */
export function quizSummary(p: ModuleProgress | undefined, lm: LessonMeta | undefined): QuizSummary | undefined {
  if (!p) return undefined
  const attempts = Object.values(p.unitQuiz ?? {})
  if (attempts.length > 0) {
    const score = attempts.reduce((a, q) => a + q.score, 0)
    const total = attempts.reduce((a, q) => a + q.total, 0)
    const retries = attempts.reduce((a, q) => a + Object.values(q.wrongByQuestion).reduce((x, y) => x + y, 0), 0)
    const lastAt = attempts.map((q) => q.at).sort().at(-1) ?? ''
    return { last: score, best: score, total, lastAt, retries, ratio: total > 0 ? score / total : 1 }
  }
  if (!p.quiz) return undefined
  const total = p.quiz.total || lm?.quiz.length || 0
  const best = Math.max(p.bestQuizScore ?? 0, p.quiz.score)
  return {
    last: p.quiz.score,
    best,
    total,
    lastAt: p.quiz.at,
    retries: Object.values(p.quiz.wrongByQuestion).reduce((a, b) => a + b, 0),
    ratio: total > 0 ? p.quiz.score / total : 1,
  }
}

export interface StepCount {
  done: number
  /** 0 when the lesson metadata is not available */
  total: number
}

export interface ModuleSummary {
  module: number
  part: 1 | 2
  titleBn: string
  icon: string
  /** false while the module is still marked 'soon' in modules.ts */
  playable: boolean
  status: ModuleStatusKind
  completedAt?: string
  lastVisitedAt?: string
  steps: Record<OsFlavor, StepCount>
  quiz?: QuizSummary
  /** cards format only: finished units / all units */
  units?: { done: number; total: number }
  freePracticeDone: boolean
  realWorld: { ticked: number; total: number }
  lowScore: boolean
  stalled: boolean
}

const hasAnyActivity = (p: ModuleProgress): boolean =>
  p.completed ||
  p.explanationRead ||
  p.freePracticeDone ||
  !!p.quiz ||
  (p.unitsDone?.length ?? 0) > 0 ||
  Object.keys(p.unitQuiz ?? {}).length > 0 ||
  p.stepsDone.windows.length > 0 ||
  p.stepsDone.mac.length > 0 ||
  p.realWorldChecked.length > 0

/** Count only step ids that still exist in the lesson (an edited lesson must never show 12/10). */
function stepCount(p: ModuleProgress | undefined, os: OsFlavor, total: number, known?: Set<string>): StepCount {
  const ids = p?.stepsDone[os] ?? []
  const done = known ? ids.filter((id) => known.has(id)).length : ids.length
  return { done: total > 0 ? Math.min(done, total) : done, total }
}

export function daysBetween(fromIso: string | undefined, now: Date): number | undefined {
  if (!fromIso) return undefined
  const t = new Date(fromIso).getTime()
  if (Number.isNaN(t)) return undefined
  return Math.max(0, Math.floor((now.getTime() - t) / DAY_MS))
}

export function summarizeModule(
  meta: ModuleMeta,
  p: ModuleProgress | undefined,
  lm: LessonMeta | undefined,
  now: Date,
): ModuleSummary {
  const status: ModuleStatusKind = p?.completed ? 'completed' : p && hasAnyActivity(p) ? 'inProgress' : 'notStarted'
  const wTotal = lm?.steps.windows ?? 0
  const mTotal = lm?.steps.mac ?? 0
  const steps = {
    windows: stepCount(p, 'windows', wTotal, lm ? new Set(lm.stepIds.windows) : undefined),
    mac: stepCount(p, 'mac', mTotal, lm ? new Set(lm.stepIds.mac) : undefined),
  }

  const quiz = quizSummary(p, lm)
  // "low score" is judged on the best result: she has already recovered if a retake went well.
  const lowScore = !!quiz && quiz.total > 0 && quiz.best / quiz.total < LOW_SCORE_RATIO

  // stalled: began the guided practice, has not finished it on any flavor, and has been away for STALL_DAYS+
  const partial = (['windows', 'mac'] as const).some((os) => {
    const c = steps[os]
    return c.done > 0 && (c.total === 0 || c.done < c.total)
  })
  const finishedSomewhere = (['windows', 'mac'] as const).some((os) => steps[os].total > 0 && steps[os].done >= steps[os].total)
  const away = daysBetween(p?.lastVisitedAt, now)
  const stalled = status === 'inProgress' && partial && !finishedSomewhere && (away === undefined || away >= STALL_DAYS)

  return {
    module: meta.module,
    part: meta.part,
    titleBn: meta.titleBn,
    icon: meta.icon,
    playable: meta.status === 'playable',
    status,
    completedAt: p?.completedAt,
    lastVisitedAt: p?.lastVisitedAt,
    steps,
    quiz,
    units: lm && lm.unitIds.length > 0 ? { done: lm.unitIds.filter((id) => p?.unitsDone.includes(id)).length, total: lm.unitIds.length } : undefined,
    freePracticeDone: !!p?.freePracticeDone,
    realWorld: {
      ticked: p?.realWorldChecked.length ?? 0,
      total: lm ? Math.max(lm.realWorld.windows, lm.realWorld.mac) : 0,
    },
    lowScore,
    stalled,
  }
}

// ---------- weak topics ----------

export interface WeakQuestion {
  module: number
  moduleTitleBn: string
  questionId: string
  /** null when the question no longer exists in the lesson file */
  questionBn: string | null
  hintBn: string | null
  /** how many wrong attempts in the last quiz run */
  misses: number
}

export type WeakReason = 'lowScore' | 'stalled'

export interface WeakModule {
  module: number
  titleBn: string
  reasons: WeakReason[]
  ratio?: number
}

export function weakQuestions(
  data: ProgressData,
  metas: Record<number, LessonMeta | undefined>,
  modules: ModuleMeta[] = MODULES,
): WeakQuestion[] {
  const out: WeakQuestion[] = []
  for (const m of modules) {
    const p = data.modules[m.module]
    if (!p) continue
    // cards format: every unit's last attempt; legacy: the single quiz attempt
    const attempts = Object.keys(p.unitQuiz ?? {}).length > 0 ? Object.values(p.unitQuiz) : p.quiz ? [p.quiz] : []
    const misses: Record<string, number> = {}
    for (const a of attempts) for (const [id, n] of Object.entries(a.wrongByQuestion)) misses[id] = (misses[id] ?? 0) + n
    for (const [id, n] of Object.entries(misses)) {
      if (!(n > 0)) continue
      const qm = metas[m.module]?.quiz.find((x) => x.id === id)
      out.push({
        module: m.module,
        moduleTitleBn: m.titleBn,
        questionId: id,
        questionBn: qm?.questionBn ?? null,
        hintBn: qm?.hintBn ?? null,
        misses: n,
      })
    }
  }
  // most missed first; stable on module order, then question id
  return out.sort((a, b) => b.misses - a.misses || a.module - b.module || a.questionId.localeCompare(b.questionId))
}

export function weakModules(summaries: ModuleSummary[]): WeakModule[] {
  return summaries
    .filter((s) => s.lowScore || s.stalled)
    .map((s) => ({
      module: s.module,
      titleBn: s.titleBn,
      reasons: [...(s.lowScore ? (['lowScore'] as const) : []), ...(s.stalled ? (['stalled'] as const) : [])],
      ratio: s.quiz && s.quiz.total > 0 ? s.quiz.best / s.quiz.total : undefined,
    }))
}

// ---------- the whole dashboard ----------

export interface PartSummary {
  part: 1 | 2
  done: number
  total: number
  pct: number
}

export interface TeacherSummary {
  learnerName: string
  os: OsFlavor
  motivation: string
  generatedAt: string
  overall: { done: number; total: number; pct: number }
  parts: PartSummary[]
  modules: ModuleSummary[]
  weakQuestions: WeakQuestion[]
  weakModules: WeakModule[]
  /** most recently visited modules first */
  recent: ModuleSummary[]
  certificates: { part: 1 | 2; issuedAt: string; name: string }[]
  noteCount: number
  notStartedCount: number
  inProgressCount: number
}

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)

export function summarize(
  data: ProgressData,
  metas: Record<number, LessonMeta | undefined> = {},
  now: Date = new Date(),
  modules: ModuleMeta[] = MODULES,
): TeacherSummary {
  const mods = modules.map((m) => summarizeModule(m, data.modules[m.module], metas[m.module], now))
  const done = mods.filter((m) => m.status === 'completed').length
  const part = (p: 1 | 2): PartSummary => {
    const list = mods.filter((m) => m.part === p)
    const d = list.filter((m) => m.status === 'completed').length
    return { part: p, done: d, total: list.length, pct: pct(d, list.length) }
  }
  return {
    learnerName: data.profile.name,
    os: data.profile.os,
    motivation: data.profile.motivation,
    generatedAt: now.toISOString(),
    overall: { done, total: mods.length, pct: pct(done, mods.length) },
    parts: [part(1), part(2)],
    modules: mods,
    weakQuestions: weakQuestions(data, metas, modules),
    weakModules: weakModules(mods),
    recent: mods
      .filter((m) => !!m.lastVisitedAt && !Number.isNaN(new Date(m.lastVisitedAt).getTime()))
      .sort((a, b) => new Date(b.lastVisitedAt as string).getTime() - new Date(a.lastVisitedAt as string).getTime())
      .slice(0, RECENT_LIMIT),
    certificates: [...data.certificates].sort((a, b) => a.part - b.part),
    noteCount: data.notebook.length,
    notStartedCount: mods.filter((m) => m.status === 'notStarted' && m.playable).length,
    inProgressCount: mods.filter((m) => m.status === 'inProgress').length,
  }
}

// ---------- labels (Bengali, teacher-facing) ----------

export const STATUS_LABEL: Record<ModuleStatusKind, string> = {
  notStarted: 'শুরু হয়নি',
  inProgress: 'চলছে',
  completed: 'সম্পন্ন',
}
/** A symbol in front of the label so status never relies on colour alone. */
export const STATUS_MARK: Record<ModuleStatusKind, string> = { notStarted: '○', inProgress: '◐', completed: '✓' }

export const REASON_LABEL: Record<WeakReason, string> = {
  lowScore: 'কুইজে ৬০%-এর কম',
  stalled: 'হাতে-কলমে অংশ মাঝপথে থেমে আছে',
}

export const SUGGESTION_BN = 'এই পাঠটি আবার দেখুন'

export interface Fmt {
  n: (v: number | string) => string
  date: (d: Date | string) => string
}

/** "আজ", "গতকাল", "৩ দিন আগে" */
export function relativeDayBn(iso: string | undefined, now: Date, f: Pick<Fmt, 'n'>): string {
  const d = daysBetween(iso, now)
  if (d === undefined) return ''
  if (d === 0) return 'আজ'
  if (d === 1) return 'গতকাল'
  return `${f.n(d)} দিন আগে`
}

// ---------- the downloadable report ----------

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const stepText = (c: StepCount, f: Fmt) => (c.total > 0 ? `${f.n(c.done)}/${f.n(c.total)}` : c.done > 0 ? f.n(c.done) : '—')

/** A standalone, printable HTML page (no scripts, no external resources) summarising the dashboard. */
export function buildReportHtml(s: TeacherSummary, f: Fmt): string {
  const name = s.learnerName || 'শিক্ষার্থী'
  const row = (m: ModuleSummary) => {
    const quiz = m.quiz ? `${f.n(m.quiz.best)}/${f.n(m.quiz.total)} (শেষবার ${f.n(m.quiz.last)}/${f.n(m.quiz.total)}, ভুল চেষ্টা ${f.n(m.quiz.retries)})` : '—'
    return `<tr>
<th scope="row">${esc(f.n(m.module))}. ${esc(m.titleBn)}</th>
<td>${STATUS_MARK[m.status]} ${esc(STATUS_LABEL[m.status])}</td>
<td>${m.completedAt ? esc(f.date(m.completedAt)) : '—'}</td>
<td>${m.lastVisitedAt ? esc(f.date(m.lastVisitedAt)) : '—'}</td>
<td>${esc(stepText(m.steps.windows, f))}</td>
<td>${esc(stepText(m.steps.mac, f))}</td>
<td>${esc(quiz)}</td>
<td>${m.freePracticeDone ? 'হ্যাঁ' : 'না'}</td>
<td>${m.realWorld.total > 0 ? `${esc(f.n(m.realWorld.ticked))}/${esc(f.n(m.realWorld.total))}` : esc(f.n(m.realWorld.ticked))}</td>
</tr>`
  }
  const weakQ = s.weakQuestions.length
    ? `<ol>${s.weakQuestions
        .map(
          (q) =>
            `<li><strong>${esc(q.questionBn ?? 'একটি প্রশ্ন (এখন আর পাঠে নেই)')}</strong> — পাঠ ${esc(f.n(q.module))}: ${esc(q.moduleTitleBn)}; ভুল চেষ্টা ${esc(f.n(q.misses))} বার। ${esc(SUGGESTION_BN)}।</li>`,
        )
        .join('')}</ol>`
    : '<p>এখনো কোনো প্রশ্নে বারবার ভুল হয়নি।</p>'
  const weakM = s.weakModules.length
    ? `<ul>${s.weakModules
        .map((w) => `<li>পাঠ ${esc(f.n(w.module))}: ${esc(w.titleBn)} — ${w.reasons.map((r) => esc(REASON_LABEL[r])).join('; ')}</li>`)
        .join('')}</ul>`
    : '<p>কোনো পাঠ নিয়ে বিশেষ চিন্তার কারণ নেই।</p>'
  const certs = s.certificates.length
    ? `<ul>${s.certificates.map((c) => `<li>পর্ব ${esc(f.n(c.part))} — ${esc(c.name || name)}, ${esc(f.date(c.issuedAt))}</li>`).join('')}</ul>`
    : '<p>এখনো কোনো সনদ পাওয়া হয়নি।</p>'

  return `<!doctype html>
<html lang="bn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>শেখার অগ্রগতির রিপোর্ট — ${esc(name)}</title>
<style>
@page { size: A4 landscape; margin: 12mm; }
body { font-family: 'Noto Sans Bengali', 'Hind Siliguri', system-ui, sans-serif; color: #111; line-height: 1.6; max-width: 1100px; margin: 0 auto; padding: 16px; }
h1 { font-size: 1.6rem; margin: 0 0 4px; } h2 { font-size: 1.2rem; margin: 1.4em 0 .4em; }
table { border-collapse: collapse; width: 100%; font-size: .85rem; }
caption { text-align: left; font-weight: bold; padding: 4px 0; }
th, td { border: 1px solid #888; padding: 4px 6px; text-align: left; vertical-align: top; }
thead th { background: #eee; }
.meta { color: #333; }
tr { break-inside: avoid; }
</style>
</head>
<body>
<h1>শেখার অগ্রগতির রিপোর্ট</h1>
<p class="meta"><strong>${esc(name)}</strong> · কম্পিউটার: ${s.os === 'mac' ? 'Mac' : 'Windows'} · রিপোর্টের তারিখ: ${esc(f.date(s.generatedAt))}</p>
${s.motivation ? `<p class="meta">লক্ষ্য: “${esc(s.motivation)}”</p>` : ''}
<h2>সারসংক্ষেপ</h2>
<ul>
<li>মোট সম্পন্ন: ${esc(f.n(s.overall.done))}/${esc(f.n(s.overall.total))} পাঠ (${esc(f.n(s.overall.pct))}%)</li>
${s.parts.map((p) => `<li>পর্ব ${esc(f.n(p.part))}: ${esc(f.n(p.done))}/${esc(f.n(p.total))} পাঠ (${esc(f.n(p.pct))}%)</li>`).join('\n')}
<li>চলছে: ${esc(f.n(s.inProgressCount))}টি পাঠ · নোটবুকে নোট: ${esc(f.n(s.noteCount))}টি</li>
</ul>
<h2>পাঠ অনুযায়ী অগ্রগতি</h2>
<table>
<caption>প্রতিটি পাঠের অবস্থা, কুইজ ও হাতে-কলমে ধাপ</caption>
<thead><tr><th scope="col">পাঠ</th><th scope="col">অবস্থা</th><th scope="col">সম্পন্নের তারিখ</th><th scope="col">শেষ দেখা</th><th scope="col">Windows ধাপ</th><th scope="col">Mac ধাপ</th><th scope="col">কুইজ (সেরা)</th><th scope="col">নিজে করুন</th><th scope="col">আসল কাজ (টিক)</th></tr></thead>
<tbody>
${s.modules.map(row).join('\n')}
</tbody>
</table>
<h2>যেসব প্রশ্নে বেশি ভুল হয়েছে</h2>
${weakQ}
<h2>যেসব পাঠ আবার দেখা ভালো</h2>
${weakM}
<h2>সনদ</h2>
${certs}
<p class="meta">এই রিপোর্টের তথ্য শুধু শিক্ষার্থীর নিজের ব্রাউজারে জমা ছিল। কোথাও পাঠানো হয়নি।</p>
</body>
</html>
`
}

export function reportFilename(s: TeacherSummary, ext: 'html' | 'json'): string {
  const date = s.generatedAt.slice(0, 10)
  return ext === 'html' ? `computer-shikhi-report-${date}.html` : `computer-shikhi-backup-${date}.json`
}
