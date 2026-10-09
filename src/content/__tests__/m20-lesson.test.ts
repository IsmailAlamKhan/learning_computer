import { describe, expect, it } from 'vitest'
import lesson, { CSS_ALL, CSS_INDEX1, HTML1, HTML3, PROJECT_CSS, PROJECT_HTML, PY_PROJECT_MODEL } from '../lessons/m20'
import glossary from '../glossary/m20'
import { VirtualFileSystem } from '../../sim/vfs'
import { buildPreviewDocument } from '../../sim/editor/logic'
import type { ExpectedAction, Unit } from '../../engine/types'

const units = lesson.units
const byId = (id: string) => units.find((u) => u.id === id)!

/** Which files a unit seeds into ~/coding. */
function seeded(u: Unit): Record<string, string> {
  const vfs = new VirtualFileSystem('windows')
  u.setup!.vfs!(vfs, 'windows')
  const folder = vfs.resolve('~/coding')!
  const out: Record<string, string> = {}
  for (const n of folder.children) if (n.kind === 'file') out[n.name] = n.content
  return out
}

const stateText = (a: ExpectedAction): string | undefined => (a.type === 'fileContains' || a.type === 'previewContains' ? a.text : undefined)

describe('module 20 structure', () => {
  it('is the Part 2 finale with a certificate and eight units', () => {
    expect(lesson.module).toBe(20)
    expect(lesson.part).toBe(2)
    expect(lesson.certificatePart).toBe(2)
    expect(units.map((u) => u.id)).toEqual(['html-basics', 'html-extras', 'css', 'py-print', 'py-input', 'py-logic', 'proj-web', 'proj-py'])
  })
  it('every unit opens the code editor, has a checklist, three quiz questions and a sensible length', () => {
    for (const u of units) {
      expect(u.setup?.openApps, u.id).toEqual(['code'])
      expect(u.steps.length, u.id).toBeGreaterThanOrEqual(5)
      expect(u.steps.length, u.id).toBeLessThanOrEqual(12)
      expect(u.steps.every((s) => s.osVariant === 'both'), u.id).toBe(true)
      expect(u.checklist?.length, u.id).toBeGreaterThan(0)
      expect(u.quiz, u.id).toHaveLength(3)
      expect(u.cards.length, u.id).toBeGreaterThanOrEqual(3)
      expect(u.cards.length, u.id).toBeLessThanOrEqual(6)
      const ids = new Set(u.steps.map((s) => s.id))
      for (const item of u.checklist!) for (const sid of item.stepIds) expect(ids.has(sid), `${u.id}:${sid}`).toBe(true)
    }
  })
  it('step ids are unique across the module', () => {
    const ids = units.flatMap((u) => u.steps.map((s) => s.id))
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })
  it('explorer targets point at files that the unit seeds', () => {
    for (const u of units) {
      const files = Object.keys(seeded(u))
      for (const s of u.steps) {
        const m = /^code-explorer-(.+)$/.exec(s.target ?? '')
        if (m) expect(files, `${u.id}:${s.id}`).toContain(m[1])
      }
    }
  })
  it('every Python lesson unit is predict-then-run, the projects have checklists tied to real steps', () => {
    for (const id of ['py-print', 'py-input', 'py-logic']) {
      const types = byId(id).steps.map((s) => s.expectedAction.type)
      expect(types, id).toContain('predictOutput')
      expect(types, id).toContain('codeOutputEquals')
    }
    expect(byId('py-print').steps.some((s) => s.expectedAction.type === 'custom' && s.expectedAction.event === 'code-run-error')).toBe(true)
    expect(byId('proj-py').steps.some((s) => s.expectedAction.type === 'custom' && s.expectedAction.event === 'code-run-ok')).toBe(true)
    expect(byId('proj-web').checklist!.length).toBeGreaterThanOrEqual(5)
    expect(byId('proj-py').checklist!.length).toBeGreaterThanOrEqual(4)
  })
  it('uses code visuals as the main explanation, mixes quiz types, and the glossary ids exist', () => {
    const cards = units.flatMap((u) => u.cards)
    expect(cards.filter((c) => c.visual.kind === 'code').length).toBeGreaterThanOrEqual(20)
    const types = new Set(units.flatMap((u) => u.quiz.map((q) => q.type)))
    for (const t of ['clickTarget', 'dragMatch', 'predictOutput', 'ordering', 'multipleChoice']) expect(types.has(t as never), t).toBe(true)
    const have = new Set(glossary.map((g) => g.id))
    expect(glossary).toHaveLength(28)
    for (const id of lesson.glossaryIds) expect(have.has(id), id).toBe(true)
  })
  it('code visuals stay short (at most 6 lines) and the HTML/CSS ones show a preview', () => {
    for (const c of units.flatMap((u) => u.cards)) {
      if (c.visual.kind !== 'code') continue
      expect(c.visual.lines.length, c.id).toBeLessThanOrEqual(6)
    }
  })
})

describe('no step is already satisfied by the seeded files (state-based checks must start false)', () => {
  for (const u of units) {
    it(u.id, () => {
      const files = seeded(u)
      const vfs = new VirtualFileSystem('windows')
      u.setup!.vfs!(vfs, 'windows')
      for (const s of u.steps) {
        const a = s.expectedAction
        const text = stateText(a)
        if (!text) continue
        if (a.type === 'fileContains') {
          const node = vfs.resolve(a.path)
          expect(node && node.kind === 'file' && node.content.includes(a.text), `${u.id}:${s.id} (fileContains)`).toBeFalsy()
        } else {
          const entry = 'index.html' in files ? 'index.html' : null
          const doc = entry ? buildPreviewDocument(files, entry) : ''
          expect(doc.includes(text), `${u.id}:${s.id} (previewContains "${text}")`).toBe(false)
        }
      }
    })
  }
})

/** The files a learner ends up with after following the unit. All state checks of the unit must hold on them. */
const FINAL: Record<string, Record<string, string>> = {
  'html-basics': {
    'index.html': HTML1.replace(
      '  \n</body>',
      '  <h1>Hello, world</h1>\n  <p>I am learning to code.</p>\n  <h2>About me</h2>\n  <ul>\n    <li>Rice</li>\n    <li>Dal</li>\n  </ul>\n  <a href="https://example.com">My link</a>\n</body>',
    ),
  },
  'html-extras': {
    'index.html': HTML3.replace('<title>My page</title>\n  \n', '<title>My page</title>\n  <meta charset="utf-8">\n').replace('  \n</body>', '  <img src="photo.jpg" alt="My photo">\n  <!-- my first image -->\n</body>'),
  },
  css: {
    'index.html': CSS_INDEX1.replace('</title>\n  \n', '</title>\n  <link rel="stylesheet" href="style.css">\n'),
    'style.css': CSS_ALL.replace('h1 {\n  \n}', 'h1 {\n  color: teal;\n  font-size: 48px;\n  text-align: center;\n}')
      .replace('body {\n  \n}', 'body {\n  background-color: lightyellow;\n  margin: 40px;\n}')
      .replace('p {\n  \n}', 'p {\n  background-color: white;\n  padding: 16px;\n}'),
  },
  'proj-web': {
    'index.html': PROJECT_HTML.replace('  \n</body>', '  <h1>Rumi</h1>\n  <p>I like tea.</p>\n  <ul><li>a</li><li>b</li><li>c</li></ul>\n  <a href="https://example.com">site</a>\n</body>'),
    'style.css': PROJECT_CSS + 'h1 {\n  color: teal;\n  font-size: 44px;\n  text-align: center;\n}\np {\n  padding: 16px;\n}\n',
  },
  'proj-py': { 'greeting.py': PY_PROJECT_MODEL },
}

describe('a model solution satisfies every state-based check of its unit', () => {
  for (const [id, files] of Object.entries(FINAL)) {
    it(id, () => {
      const u = byId(id)
      const all = { ...seeded(u), ...files }
      const doc = 'index.html' in all ? buildPreviewDocument(all, 'index.html') : ''
      for (const s of u.steps) {
        const a = s.expectedAction
        if (a.type === 'previewContains') expect(doc.includes(a.text), `${id}:${s.id} previewContains "${a.text}"`).toBe(true)
        if (a.type === 'fileContains') {
          const name = a.path.split('/').pop()!
          expect(all[name].includes(a.text), `${id}:${s.id} fileContains "${a.text}"`).toBe(true)
        }
      }
    })
  }
})
