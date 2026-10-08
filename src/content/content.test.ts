import { describe, expect, it } from 'vitest'
import type { GlossaryEntry, Lesson } from '../engine/types'
import { MODULES } from './modules'

const lessonFiles = import.meta.glob<{ default: Lesson }>('./lessons/m*.ts', { eager: true })
const glossaryFiles = import.meta.glob<{ default: GlossaryEntry[] }>('./glossary/m*.ts', { eager: true })
const lessons = Object.values(lessonFiles).map((f) => f.default).sort((a, b) => a.module - b.module)
const glossary = Object.values(glossaryFiles).flatMap((f) => f.default)
const FORBIDDEN = /নমস্কার|আদাব|সালাম|প্রণাম|ইনশাআল্লাহ|মাশাআল্লাহ|আলহামদুলিল্লাহ/

describe('content integrity', () => {
  it('glossary ids are unique and complete', () => {
    const ids = glossary.map((g) => g.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
    for (const g of glossary) {
      expect(g.termBn, g.id).toBeTruthy()
      expect(g.termEn, g.id).toBeTruthy()
      expect(g.meaningBn, g.id).toBeTruthy()
      expect(typeof g.module, g.id).toBe('number')
    }
  })

  it('every playable module has a lesson and vice versa', () => {
    const playable = MODULES.filter((m) => m.status === 'playable').map((m) => m.module)
    expect(lessons.map((l) => l.module)).toEqual(playable)
  })

  for (const l of lessons) {
    describe(`module ${l.module}`, () => {
      it('has the required lesson parts', () => {
        expect(l.explanation.length).toBeGreaterThan(0)
        expect(l.quiz.length).toBeGreaterThanOrEqual(3)
        expect(l.summaryCard.pointsBn.length).toBeGreaterThan(0)
        expect(l.realWorld.tasksBn.length).toBeGreaterThanOrEqual(2)
        expect(l.steps.length).toBeGreaterThan(0)
        expect(MODULES.find((m) => m.module === l.module)?.part).toBe(l.part)
      })
      it('has unique ids and hints on every step, for both OS flavors', () => {
        const ids = l.steps.map((s) => s.id)
        expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
        for (const s of l.steps) {
          expect(s.hintBn, s.id).toBeTruthy()
          expect(s.explanationBn, s.id).toBeTruthy()
        }
        expect(l.steps.some((s) => s.osVariant !== 'mac')).toBe(true)
        expect(l.steps.some((s) => s.osVariant !== 'windows')).toBe(true)
        const q = l.quiz.map((x) => x.id)
        expect(q.filter((id, i) => q.indexOf(id) !== i)).toEqual([])
      })
      it('references only known glossary ids', () => {
        const known = new Set(glossary.map((g) => g.id))
        expect(l.glossaryIds.filter((id) => !known.has(id))).toEqual([])
      })
      it('is religion-neutral', () => {
        expect(JSON.stringify(l)).not.toMatch(FORBIDDEN)
      })
    })
  }

  it('glossary is religion-neutral', () => {
    expect(JSON.stringify(glossary)).not.toMatch(FORBIDDEN)
  })
})
