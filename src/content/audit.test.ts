import { describe, expect, it } from 'vitest'
import { auditLessons } from '../../scripts/audit-core'
import { ART_NAMES, MOCK_REGIONS } from '../ui/illustrations/names'
import { WIDGETS } from './widgets'
import type { GlossaryEntry, Lesson } from '../engine/types'

const lessonFiles = import.meta.glob<{ default: Lesson }>('./lessons/m*.ts', { eager: true })
const glossaryFiles = import.meta.glob<{ default: GlossaryEntry[] }>('./glossary/m*.ts', { eager: true })
const lessons = Object.entries(lessonFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, f]) => f.default)
const glossary = Object.values(glossaryFiles).flatMap((f) => f.default)

const run = (ls: unknown[], g = glossary) => auditLessons(ls, { widgetIds: new Set(Object.keys(WIDGETS)), artNames: new Set(ART_NAMES), mockRegions: MOCK_REGIONS as never, glossary: g })

describe('content audit (UX text budget, PROJECT_BRIEF "UX RULES")', () => {
  const res = run(lessons)
  it('loads all 20 lessons in the cards format', () => {
    expect(res.lessons).toBe(20)
    expect(res.legacy).toEqual([])
  })
  it('has no hard violations', () => {
    expect(res.violations.map((v) => `m${v.module} ${v.where}: ${v.rule} (${v.detail})`)).toEqual([])
  })
  it('catches the structural rules it promises to', () => {
    const base = lessons[1]
    const u = base.units[0]
    const mouseOnly = { ...base, units: [{ ...u, steps: u.steps.map((s) => ({ ...s, inputVariant: 'mouse' as const })) }] }
    expect(run([mouseOnly], []).violations.some((v) => /mouse-only/.test(v.rule))).toBe(true)
    const fat = { ...base, units: [{ ...u, cards: [...u.cards, ...u.cards, ...u.cards].slice(0, 6).map((c, i) => ({ ...c, id: `x${i}` })), quiz: [...u.quiz, ...u.quiz, ...u.quiz, ...u.quiz] }] }
    expect(run([fat], []).violations.some((v) => /deck > 12/.test(v.rule))).toBe(true)
    expect(run([], [{ id: 'g', termBn: 'a', termEn: 'a', meaningBn: 'এক', module: 1 }]).violations.some((v) => /icon or art/.test(v.rule))).toBe(true)
  })
})
