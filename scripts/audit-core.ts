/**
 * Content audit core (pure functions; used by scripts/audit-content.ts and src/content/audit.test.ts).
 * Enforces the UX text budget of PROJECT_BRIEF.md ("UX RULES") on the cards-format lessons.
 *
 * Thresholds: `target` is the authoring goal (reported as "tight" when exceeded), `max` is the hard limit that FAILS the audit.
 */
import { splitWarnings } from '../src/engine/deck'

export const LIMITS = {
  cardText: { target: 25, max: 35 },
  cardSentences: { max: 2 },
  bold: { max: 2 },
  chips: { maxCount: 3, maxWords: 4 },
  recap: { maxCount: 3, maxWords: 9 },
  instruction: { target: 12, max: 14 },
  hint: { target: 15, max: 18 },
  success: { target: 6, max: 8 },
  question: { target: 20, max: 24 },
  option: { target: 8, max: 10 },
  quizExplain: { target: 15, max: 18 },
  glossary: { target: 18, max: 22 },
  cardsPerUnit: { min: 3, max: 6 },
  quizPerUnit: 3,
  stepsPerUnit: { warn: 15, max: 22 },
  task: { max: 18 },
} as const

export const words = (t: string | undefined): number => (t ?? '').replace(/\*\*/g, '').trim().split(/\s+/).filter(Boolean).length
export const sentences = (t: string | undefined): number => ((t ?? '').match(/[^।?!.]+(?:[।?!.]+|$)/g) ?? []).filter((s) => s.trim().length > 1).length
export const boldCount = (t: string | undefined): number => Math.floor(((t ?? '').match(/\*\*/g) ?? []).length / 2)

export interface Violation {
  module: number
  where: string
  rule: string
  detail: string
}
export interface Item {
  module: number
  where: string
  kind: string
  words: number
  hasVisual?: boolean
}

export interface AuditResult {
  violations: Violation[]
  tight: Violation[]
  items: Item[]
  legacy: number[]
  lessons: number
  units: number
  cards: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

export interface AuditOptions {
  widgetIds: Set<string>
  /** { artNames, mockRegions } to validate visuals; omitted → skip */
  artNames?: Set<string>
  mockRegions?: Record<string, readonly string[]>
  glossary?: { id: string; meaningBn: string; module: number; icon?: string; art?: string }[]
  /** skip the deck-size and input-variant structure checks (unit-test fixtures only) */
  skipStructure?: boolean
}

export function auditLessons(lessons: Any[], opt: AuditOptions): AuditResult {
  const violations: Violation[] = []
  const tight: Violation[] = []
  const items: Item[] = []
  const legacy: number[] = []
  let units = 0
  let cards = 0

  const check = (m: number, where: string, kind: string, text: string | undefined, lim: { target?: number; max: number }) => {
    const w = words(text)
    items.push({ module: m, where, kind, words: w })
    if (w > lim.max) violations.push({ module: m, where, rule: `${kind} > ${lim.max} words`, detail: `${w} words: ${(text ?? '').slice(0, 60)}…` })
    else if (lim.target && w > lim.target) tight.push({ module: m, where, rule: `${kind} > ${lim.target} (target)`, detail: `${w} words` })
  }

  const checkVisual = (m: number, where: string, v: Any) => {
    if (!v || typeof v.kind !== 'string') {
      violations.push({ module: m, where, rule: 'card has no visual', detail: 'every explanation card needs a visual' })
      return
    }
    if (v.kind === 'widget' && !opt.widgetIds.has(v.widget)) violations.push({ module: m, where, rule: 'unknown widget', detail: String(v.widget) })
    if (v.kind === 'art' && opt.artNames && !opt.artNames.has(v.name)) violations.push({ module: m, where, rule: 'unknown art', detail: String(v.name) })
    if (v.kind === 'flow' && opt.artNames) for (const it of v.items) if (!opt.artNames.has(it.art)) violations.push({ module: m, where, rule: 'unknown art', detail: String(it.art) })
    if (v.kind === 'mock' && opt.mockRegions) {
      const r = opt.mockRegions[v.name]
      if (!r) violations.push({ module: m, where, rule: 'unknown mock', detail: String(v.name) })
      else if (v.highlight && !r.includes(v.highlight)) violations.push({ module: m, where, rule: 'unknown mock region', detail: `${v.name}.${v.highlight}` })
    }
    if (v.kind === 'compare') for (const s of [v.left, v.right]) check(m, where + ' compare-label', 'chip', s?.labelBn, { max: LIMITS.chips.maxWords })
  }

  const checkCard = (m: number, uid: string, c: Any, idx: string) => {
    cards++
    const where = `${uid} ${idx}`
    check(m, where, 'card', c.textBn, LIMITS.cardText)
    const cardItem = items[items.length - 1]
    if (sentences(c.textBn) > LIMITS.cardSentences.max) violations.push({ module: m, where, rule: '> 2 sentences', detail: `${sentences(c.textBn)} sentences` })
    if (boldCount(c.textBn) > LIMITS.bold.max) violations.push({ module: m, where, rule: '> 2 bold words', detail: String(boldCount(c.textBn)) })
    if ((c.chipsBn?.length ?? 0) > LIMITS.chips.maxCount) violations.push({ module: m, where, rule: '> 3 chips', detail: String(c.chipsBn.length) })
    for (const ch of c.chipsBn ?? []) if (words(ch) > LIMITS.chips.maxWords) violations.push({ module: m, where, rule: 'chip too long', detail: ch })
    checkVisual(m, where, c.visual)
    cardItem.hasVisual = !!c.visual?.kind
  }

  for (const l of lessons) {
    if (!l.units) {
      legacy.push(l.module)
      continue
    }
    const m = l.module
    for (const u of l.units as Any[]) {
      units++
      const uid = `${l.id}/${u.id}`
      if (!u.hook) violations.push({ module: m, where: uid, rule: 'missing hook', detail: '' })
      else {
        if (u.hook.type !== 'hook') violations.push({ module: m, where: uid, rule: 'hook card must have type "hook"', detail: String(u.hook.type) })
        checkCard(m, uid, u.hook, 'hook')
      }
      const cs: Any[] = u.cards ?? []
      if (cs.length < LIMITS.cardsPerUnit.min || cs.length > LIMITS.cardsPerUnit.max)
        violations.push({ module: m, where: uid, rule: 'cards per unit must be 3–6 (split longer lessons)', detail: String(cs.length) })
      cs.forEach((c, i) => checkCard(m, uid, c, `card#${i + 1}`))
      // deck size: hook + cards + practice + quiz + celebration must stay <= 12 items for every OS / device
      if (!opt.skipStructure) for (const w of splitWarnings({ units: [u] } as Any)) violations.push({ module: m, where: uid, rule: 'unit deck > 12 items (split the unit)', detail: w })
      // pointing-device sanity: a mouse-only item needs a touchpad/both alternative in the same unit, and vice versa
      if (!opt.skipStructure)
        for (const [label, list] of [['step', u.steps ?? []], ['card', cs]] as [string, Any[]][]) {
          const kinds = new Set(list.map((x) => x.inputVariant ?? 'both'))
          const hasTouch = kinds.has('touchpad') || kinds.has('both')
          const hasMouse = kinds.has('mouse') || kinds.has('both')
          if (kinds.has('mouse') && !hasTouch) violations.push({ module: m, where: uid, rule: `${label}s are mouse-only: no touchpad/both alternative`, detail: '' })
          if (kinds.has('touchpad') && !hasMouse) violations.push({ module: m, where: uid, rule: `${label}s are touchpad-only: no mouse/both alternative`, detail: '' })
        }
      // steps
      const perOs = (os: string) => (u.steps as Any[]).filter((s) => s.osVariant === 'both' || s.osVariant === os)
      for (const os of ['windows', 'mac']) {
        const n = perOs(os).length
        if (n > LIMITS.stepsPerUnit.max) violations.push({ module: m, where: uid, rule: `> ${LIMITS.stepsPerUnit.max} steps for ${os} (split the unit)`, detail: String(n) })
        else if (n > LIMITS.stepsPerUnit.warn) tight.push({ module: m, where: uid, rule: `> ${LIMITS.stepsPerUnit.warn} steps for ${os}`, detail: String(n) })
        if (n === 0) violations.push({ module: m, where: uid, rule: `no guided steps for ${os}`, detail: '' })
      }
      for (const s of u.steps as Any[]) {
        const where = `${uid} step ${s.id}`
        check(m, where, 'instruction', s.explanationBn, LIMITS.instruction)
        check(m, where, 'hint', s.hintBn, LIMITS.hint)
        if (s.successMessageBn) check(m, where, 'success', s.successMessageBn, LIMITS.success)
        if (s.simplerBn) check(m, where, 'hint', s.simplerBn, LIMITS.hint)
        if (s.titleBn && words(s.titleBn) > 7) violations.push({ module: m, where, rule: 'step title > 7 words', detail: s.titleBn })
      }
      const quiz: Any[] = u.quiz ?? []
      if (quiz.length !== LIMITS.quizPerUnit) violations.push({ module: m, where: uid, rule: 'quiz must have exactly 3 questions', detail: String(quiz.length) })
      for (const q of quiz) {
        const where = `${uid} quiz ${q.id}`
        check(m, where, 'question', q.questionBn, LIMITS.question)
        check(m, where, 'quiz-explain', q.explanationBn, LIMITS.quizExplain)
        if (q.hintBn) check(m, where, 'hint', q.hintBn, LIMITS.hint)
        for (const o of q.options ?? []) check(m, where, 'option', o.textBn, LIMITS.option)
        for (const o of q.items ?? []) check(m, where, 'option', o.textBn ?? o.labelBn, LIMITS.option)
        for (const p of q.pairs ?? []) {
          check(m, where, 'option', p.leftBn, LIMITS.option)
          check(m, where, 'option', p.rightBn, LIMITS.option)
        }
      }
      const recap: string[] = u.recapBn ?? []
      if (recap.length === 0 || recap.length > LIMITS.recap.maxCount) violations.push({ module: m, where: uid, rule: 'recap must have 1–3 items', detail: String(recap.length) })
      for (const r of recap) check(m, uid + ' recap', 'recap', r, { max: LIMITS.recap.maxWords })
      if (u.freeTryBn) check(m, uid, 'task', u.freeTryBn, LIMITS.task)
    }
    for (const t of l.realWorld?.tasksBn ?? []) check(m, `${l.id} real-world`, 'task', t, LIMITS.task)
    for (const t of [...(l.realWorld?.windowsTasksBn ?? []), ...(l.realWorld?.macTasksBn ?? [])]) check(m, `${l.id} real-world`, 'task', t, LIMITS.task)
    const firstCards = [l.units[0]?.hook, ...(l.units[0]?.cards ?? []).slice(0, 2)].filter(Boolean) as Any[]
    if (!firstCards.some((c) => c.visual && ['widget', 'demo'].includes(c.visual.kind)) && !(l.units[0]?.steps?.[0]?.expectedAction?.type === 'click'))
      tight.push({ module: m, where: `${l.id}`, rule: 'no quick win', detail: 'first 3 cards have no widget/demo and the first step is not a click' })
  }

  for (const g of opt.glossary ?? []) {
    const w = words(g.meaningBn)
    if (!g.icon && !g.art) violations.push({ module: g.module, where: `glossary ${g.id}`, rule: 'glossary entry has no icon or art', detail: '' })
    items.push({ module: g.module, where: `glossary ${g.id}`, kind: 'glossary', words: w })
    if (w > LIMITS.glossary.max) violations.push({ module: g.module, where: `glossary ${g.id}`, rule: `glossary meaning > ${LIMITS.glossary.max} words`, detail: `${w} words` })
    else if (w > LIMITS.glossary.target) tight.push({ module: g.module, where: `glossary ${g.id}`, rule: 'glossary > target', detail: `${w} words` })
  }

  return { violations, tight, items, legacy, lessons: lessons.length, units, cards }
}

export function summarize(items: Item[]) {
  const by = new Map<string, Item[]>()
  for (const it of items) if (it.words > 0) by.set(it.kind, [...(by.get(it.kind) ?? []), it])
  const rows = [...by.entries()].sort().map(([kind, a]) => ({ kind, n: a.length, avg: +(a.reduce((s, r) => s + r.words, 0) / a.length).toFixed(1), max: Math.max(...a.map((r) => r.words)) }))
  const cards = items.filter((i) => i.kind === 'card')
  return {
    rows,
    cardAvg: cards.length ? +(cards.reduce((s, r) => s + r.words, 0) / cards.length).toFixed(1) : 0,
    cardMax: cards.length ? Math.max(...cards.map((c) => c.words)) : 0,
    cardsWithVisual: cards.filter((c) => c.hasVisual).length,
    cards: cards.length,
  }
}
