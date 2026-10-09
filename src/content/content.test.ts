import { describe, expect, it } from 'vitest'
import { isCardsLesson, type Card, type GlossaryEntry, type LegacyLesson, type Lesson, type QuizQuestion, type Visual } from '../engine/types'
import { MODULES } from './modules'
import { lessonSteps } from '../engine/lessonSteps'
import { buildSlides, splitIfLong } from '../engine/deck'
import { ART_NAMES, MOCK_REGIONS, MOCK_NAMES } from '../ui/illustrations/names'
import { WIDGETS } from './widgets'

/**
 * Content integrity for BOTH lesson formats during the migration:
 *  - legacy (`LegacyLesson`: explanation / steps / quiz / summaryCard) until a module is migrated,
 *  - cards (`Lesson`: units of hook + cards + steps + exactly 3 quiz questions).
 * The text-budget numbers themselves are enforced by scripts/audit-core.ts (npm run audit:content); here we check structure.
 */
const lessonFiles = import.meta.glob<{ default: Lesson | LegacyLesson }>('./lessons/m*.ts', { eager: true })
const glossaryFiles = import.meta.glob<{ default: GlossaryEntry[] }>('./glossary/m*.ts', { eager: true })
const lessons = Object.values(lessonFiles).map((f) => f.default).sort((a, b) => a.module - b.module)
const glossary = Object.values(glossaryFiles).flatMap((f) => f.default)
const FORBIDDEN = /নমস্কার|আদাব|সালাম|প্রণাম|ইনশাআল্লাহ|মাশাআল্লাহ|আলহামদুলিল্লাহ/
const words = (t: string) => t.replace(/\*\*/g, '').trim().split(/\s+/).filter(Boolean).length
const dups = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i)

const quizOf = (l: Lesson | LegacyLesson): QuizQuestion[] => (isCardsLesson(l) ? l.units.flatMap((u) => u.quiz) : l.quiz)

function visualProblems(v: Visual | undefined, where: string): string[] {
  if (!v) return [`${where}: no visual`]
  const out: string[] = []
  const art = (name: string) => {
    if (!(ART_NAMES as readonly string[]).includes(name)) out.push(`${where}: unknown art "${name}"`)
  }
  const mock = (name: string, highlight?: string) => {
    if (!MOCK_NAMES.includes(name as never)) return out.push(`${where}: unknown mock "${name}"`)
    if (highlight && !(MOCK_REGIONS[name as keyof typeof MOCK_REGIONS] as readonly string[]).includes(highlight)) out.push(`${where}: mock "${name}" has no region "${highlight}"`)
  }
  switch (v.kind) {
    case 'art':
      art(v.name)
      break
    case 'flow':
      if (v.items.length < 2 || v.items.length > 4) out.push(`${where}: flow needs 2–4 items`)
      v.items.forEach((i) => art(i.art))
      break
    case 'compare':
      for (const side of [v.left, v.right]) {
        if (side.visual.kind === 'art') art(side.visual.name)
        if (side.visual.kind === 'mock') mock(side.visual.name, side.visual.highlight)
      }
      break
    case 'mock':
      mock(v.name, v.highlight)
      break
    case 'demo':
      if (v.mock) mock(v.mock)
      break
    case 'widget':
      if (!WIDGETS[v.widget]) out.push(`${where}: unknown widget "${v.widget}"`)
      break
  }
  return out
}

describe('content integrity', () => {
  it('glossary ids are unique and complete', () => {
    expect(dups(glossary.map((g) => g.id))).toEqual([])
    for (const g of glossary) {
      expect(g.termBn, g.id).toBeTruthy()
      expect(g.termEn, g.id).toBeTruthy()
      expect(g.meaningBn, g.id).toBeTruthy()
      expect(typeof g.module, g.id).toBe('number')
      if (g.art) expect(ART_NAMES as readonly string[], g.id).toContain(g.art)
    }
  })

  it('every playable module has a lesson and vice versa', () => {
    const playable = MODULES.filter((m) => m.status === 'playable').map((m) => m.module)
    expect(lessons.map((l) => l.module)).toEqual(playable)
  })

  it('glossary meanings of migrated modules are one short line (≤ 22 words) and have an icon or art', () => {
    const migrated = new Set(lessons.filter(isCardsLesson).map((l) => l.module))
    for (const g of glossary.filter((x) => migrated.has(x.module))) {
      expect(words(g.meaningBn), g.id).toBeLessThanOrEqual(22)
      expect(!!(g.icon || g.art), `${g.id} needs icon or art`).toBe(true)
    }
  })

  for (const l of lessons) {
    describe(`module ${l.module} (${isCardsLesson(l) ? 'cards' : 'legacy'})`, () => {
      it('is listed with the right part and has real-world tasks', () => {
        expect(MODULES.find((m) => m.module === l.module)?.part).toBe(l.part)
        expect(l.realWorld.tasksBn.length).toBeGreaterThanOrEqual(2)
        expect(lessonSteps(l).length).toBeGreaterThan(0)
      })
      it('has unique step ids and hints on every step, for both OS flavors', () => {
        const all = lessonSteps(l)
        expect(dups(all.map((s) => s.id))).toEqual([])
        for (const s of all) {
          expect(s.hintBn, s.id).toBeTruthy()
          expect(s.explanationBn, s.id).toBeTruthy()
        }
        expect(all.some((s) => s.osVariant !== 'mac')).toBe(true)
        expect(all.some((s) => s.osVariant !== 'windows')).toBe(true)
        expect(dups(quizOf(l).map((x) => x.id))).toEqual([])
      })
      it('references only known glossary ids', () => {
        const known = new Set(glossary.map((g) => g.id))
        expect(l.glossaryIds.filter((id) => !known.has(id))).toEqual([])
      })
      it('is religion-neutral', () => {
        expect(JSON.stringify(l)).not.toMatch(FORBIDDEN)
      })

      if (!isCardsLesson(l)) {
        it('legacy: has the required lesson parts', () => {
          expect(l.explanation.length).toBeGreaterThan(0)
          expect(l.quiz.length).toBeGreaterThanOrEqual(3)
          expect(l.summaryCard.pointsBn.length).toBeGreaterThan(0)
        })
        return
      }

      it('cards: one or more units with unique ids, and no unit is too long', () => {
        expect(l.units.length).toBeGreaterThan(0)
        expect(dups(l.units.map((u) => u.id))).toEqual([])
        expect(l.units.map((u) => splitIfLong(u)).filter(Boolean)).toEqual([])
      })
      it('cards: every unit has a hook, 3–6 cards, steps with hints, exactly 3 quiz questions and ≤ 3 recap items', () => {
        for (const u of l.units) {
          expect(u.hook.type, `${u.id} hook`).toBe('hook')
          expect(u.cards.length, `${u.id} cards`).toBeGreaterThanOrEqual(3)
          expect(u.cards.length, `${u.id} cards`).toBeLessThanOrEqual(6)
          for (const c of u.cards) expect(c.type, `${u.id}/${c.id}`).not.toBe('hook')
          expect(u.steps.length, `${u.id} steps`).toBeGreaterThan(0)
          for (const s of u.steps) {
            expect(s.hintBn, s.id).toBeTruthy()
            expect(s.explanationBn, s.id).toBeTruthy()
            expect(['windows', 'mac', 'both'], s.id).toContain(s.osVariant)
          }
          expect(u.quiz.length, `${u.id} quiz`).toBe(3)
          for (const q of u.quiz) {
            expect(q.hintBn, q.id).toBeTruthy()
            expect(q.explanationBn, q.id).toBeTruthy()
          }
          expect(u.recapBn.length, `${u.id} recap`).toBeGreaterThanOrEqual(1)
          expect(u.recapBn.length, `${u.id} recap`).toBeLessThanOrEqual(3)
          for (const t of u.checklist ?? []) for (const id of t.stepIds) expect(u.steps.some((s) => s.id === id), `${u.id} checklist ${id}`).toBe(true)
        }
      })
      it('cards: ids are unique across the module, and every card has a valid visual and short text', () => {
        const cards: Card[] = l.units.flatMap((u) => [u.hook, ...u.cards])
        expect(dups(cards.map((c) => c.id))).toEqual([])
        expect(dups(l.units.map((u) => u.id).concat(cards.map((c) => c.id)))).toEqual([])
        for (const c of cards) {
          expect(visualProblems(c.visual, `${l.id}/${c.id}`)).toEqual([])
          expect(words(c.textBn), `${c.id} words`).toBeLessThanOrEqual(35)
          expect((c.textBn.match(/\*\*/g) ?? []).length / 2, `${c.id} bold`).toBeLessThanOrEqual(2)
          expect((c.chipsBn ?? []).length, `${c.id} chips`).toBeLessThanOrEqual(3)
        }
      })
      it('cards: Windows and Mac learners (mouse or touchpad) each get at least 3 cards, a practice and 3 quiz questions in every unit', () => {
        for (const u of l.units)
          for (const os of ['windows', 'mac'] as const)
            for (const input of ['mouse', 'touchpad'] as const) {
              const kinds = buildSlides(u, { os, input }).map((s) => s.kind)
              expect(kinds.filter((k) => k === 'card').length, `${u.id} ${os}/${input} cards`).toBeGreaterThanOrEqual(3)
              expect(kinds.filter((k) => k === 'quiz').length, `${u.id} ${os}/${input} quiz`).toBe(3)
              expect(kinds, `${u.id} ${os}/${input} practice`).toContain('practice')
            }
      })
    })
  }

  it('glossary is religion-neutral', () => {
    expect(JSON.stringify(glossary)).not.toMatch(FORBIDDEN)
  })
})
