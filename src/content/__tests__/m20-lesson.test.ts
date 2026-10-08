import { describe, expect, it } from 'vitest'
import lesson, { CSS1, CSS2, CSS_INDEX1, CSS_INDEX2, HTML1, HTML2, HTML3, PROJECT_CSS, PROJECT_HTML, PY_PROJECT } from '../lessons/m20'
import { VirtualFileSystem } from '../../sim/vfs'
import { buildPreviewDocument } from '../../sim/editor/logic'
import type { Chapter, ExpectedAction } from '../../engine/types'

const chapters = lesson.chapters!
const byId = (id: string) => chapters.find((c) => c.id === id)!

/** Which files a chapter seeds into ~/coding. */
function seeded(ch: Chapter): Record<string, string> {
  const vfs = new VirtualFileSystem('windows')
  ch.setup!.vfs!(vfs, 'windows')
  const folder = vfs.resolve('~/coding')!
  const out: Record<string, string> = {}
  for (const n of folder.children) if (n.kind === 'file') out[n.name] = n.content
  return out
}

const stateText = (a: ExpectedAction): string | undefined => (a.type === 'fileContains' || a.type === 'previewContains' ? a.text : undefined)

describe('module 20 structure', () => {
  it('is the Part 2 finale with a certificate and eleven chapters', () => {
    expect(lesson.module).toBe(20)
    expect(lesson.part).toBe(2)
    expect(lesson.certificatePart).toBe(2)
    expect(lesson.steps).toEqual([])
    expect(chapters.map((c) => c.id)).toEqual(['html-1', 'html-2', 'html-3', 'css-1', 'css-2', 'py-1', 'py-2', 'py-3', 'py-4', 'proj-web', 'proj-py'])
  })
  it('every chapter opens the code editor, has a checklist and a sensible length', () => {
    for (const c of chapters) {
      expect(c.setup?.openApps, c.id).toEqual(['code'])
      expect(c.steps.length, c.id).toBeGreaterThanOrEqual(5)
      expect(c.steps.length, c.id).toBeLessThanOrEqual(12)
      expect(c.checklist?.length, c.id).toBeGreaterThan(0)
      const ids = new Set(c.steps.map((s) => s.id))
      for (const item of c.checklist!) for (const sid of item.stepIds) expect(ids.has(sid), `${c.id}:${sid}`).toBe(true)
    }
  })
  it('step ids are unique across the module', () => {
    const ids = chapters.flatMap((c) => c.steps.map((s) => s.id))
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })
  it('explorer targets point at files that the chapter seeds', () => {
    for (const c of chapters) {
      const files = Object.keys(seeded(c))
      for (const s of c.steps) {
        const m = /^code-explorer-(.+)$/.exec(s.target ?? '')
        if (m) expect(files, `${c.id}:${s.id}`).toContain(m[1])
      }
    }
  })
  it('has every Python chapter predict-then-run and the projects have checklists tied to real steps', () => {
    for (const id of ['py-1', 'py-2', 'py-3', 'py-4']) {
      const types = byId(id).steps.map((s) => s.expectedAction.type)
      expect(types).toContain('predictOutput')
      expect(types).toContain('codeOutputEquals')
    }
    expect(byId('proj-web').checklist!.length).toBeGreaterThanOrEqual(6)
    expect(byId('proj-py').checklist!.length).toBeGreaterThanOrEqual(4)
  })
  it('quiz uses several question types and glossary ids are prefixed', () => {
    expect(lesson.quiz).toHaveLength(5)
    expect(new Set(lesson.quiz.map((q) => q.type)).size).toBe(5)
    expect(lesson.glossaryIds.every((g) => g.startsWith('code-'))).toBe(true)
  })
})

describe('no step is already satisfied by the seeded files (state-based checks must start false)', () => {
  for (const c of chapters) {
    it(c.id, () => {
      const files = seeded(c)
      const vfs = new VirtualFileSystem('windows')
      c.setup!.vfs!(vfs, 'windows')
      for (const s of c.steps) {
        const a = s.expectedAction
        const text = stateText(a)
        if (!text) continue
        if (a.type === 'fileContains') {
          const node = vfs.resolve(a.path)
          expect(node && node.kind === 'file' && node.content.includes(a.text), `${c.id}:${s.id} (fileContains)`).toBeFalsy()
        } else {
          const entry = 'index.html' in files ? 'index.html' : null
          const doc = entry ? buildPreviewDocument(files, entry) : ''
          expect(doc.includes(text), `${c.id}:${s.id} (previewContains "${text}")`).toBe(false)
        }
      }
    })
  }
})

/** The page a learner ends up with after following the chapter. All checks of the chapter must hold on it. */
const FINAL: Record<string, Record<string, string>> = {
  'html-1': { 'index.html': HTML1.replace('  \n</body>', '  <h1>Hello, world</h1>\n  <p>I am learning to code.</p>\n  <h2>About me</h2>\n</body>') },
  'html-2': { 'index.html': HTML2.replace('  \n</body>', '  <ul>\n    <li>Rice</li>\n    <li>Dal</li>\n  </ul>\n  <a href="https://example.com">My link</a>\n</body>') },
  'html-3': {
    'index.html': HTML3.replace('<title>My page</title>\n  \n', '<title>My page</title>\n  <meta charset="utf-8">\n').replace('  \n</body>', '  <img src="photo.jpg" alt="My photo">\n  <!-- my first image -->\n</body>'),
  },
  'css-1': {
    'index.html': CSS_INDEX1.replace('</title>\n  \n', '</title>\n  <link rel="stylesheet" href="style.css">\n'),
    'style.css': CSS1.replace('  \n}', '  color: teal;\n  font-size: 48px;\n  text-align: center;\n}'),
  },
  'css-2': {
    'index.html': CSS_INDEX2,
    'style.css': CSS2.replace('body {\n  \n}', 'body {\n  background-color: lightyellow;\n  margin: 40px;\n}').replace('p {\n  \n}', 'p {\n  background-color: white;\n  padding: 16px;\n}'),
  },
  'proj-web': {
    'index.html': PROJECT_HTML.replace('  \n</body>', '  <h1>Rumi</h1>\n  <p>I like tea.</p>\n  <ul><li>a</li><li>b</li><li>c</li></ul>\n  <a href="https://example.com">site</a>\n</body>'),
    'style.css': PROJECT_CSS + 'h1 {\n  color: teal;\n  font-size: 44px;\n  text-align: center;\n}\np {\n  padding: 16px;\n}\n',
  },
}

describe('model solutions satisfy every state-based check of their chapter', () => {
  for (const [id, files] of Object.entries(FINAL)) {
    it(id, () => {
      const c = byId(id)
      const entry = buildPreviewDocument({ ...seeded(c), ...files }, 'index.html')
      for (const s of c.steps) {
        const a = s.expectedAction
        if (a.type === 'previewContains') expect(entry.includes(a.text), `${id}:${s.id} previewContains "${a.text}"`).toBe(true)
        if (a.type === 'fileContains') {
          const name = a.path.split('/').pop()!
          expect((files[name] ?? seeded(c)[name]).includes(a.text), `${id}:${s.id} fileContains "${a.text}"`).toBe(true)
        }
      }
    })
  }
  it('proj-py: the model program contains every required fragment', () => {
    const program = `${PY_PROJECT}name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint("Hello, " + name)\nprint("Next year you will be", age + 1)\nif age >= 18:\n    print("You are an adult.")\nelse:\n    print("You are not an adult yet.")\n`
    for (const s of byId('proj-py').steps) {
      const a = s.expectedAction
      if (a.type === 'fileContains') expect(program.includes(a.text), `${s.id} "${a.text}"`).toBe(true)
    }
  })
})
