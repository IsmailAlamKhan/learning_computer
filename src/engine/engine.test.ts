import { describe, expect, it } from 'vitest'
import { coachTarget, matchAction, targetId } from './actions'
import { advance, demoPlan, feed, initialRunner, pickPraise, PRAISE, stepsFor } from './runner'
import { gradeDragMatch, gradeMultipleChoice, gradeOrdering, gradePredictOutput, scoreQuiz, seededShuffle } from './quiz'
import type { QuizQuestion, Step } from './types'

const step = (id: string, expectedAction: Step['expectedAction'], osVariant: Step['osVariant'] = 'both'): Step => ({
  id, titleBn: id, explanationBn: '', expectedAction, hintBn: '', osVariant,
})

describe('matchAction', () => {
  it('matches click/double/right on the exact target only', () => {
    expect(matchAction({ type: 'click', target: 'start-button' }, { type: 'click', target: 'start-button' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'click', target: 'start-button' }, { type: 'doubleClick', target: 'start-button' }, 'windows')).toBe(false)
    expect(matchAction({ type: 'click', target: 'a' }, { type: 'click', target: 'b' }, 'windows')).toBe(false)
    expect(matchAction({ type: 'rightClick', target: '[data-coach="desktop"]' }, { type: 'rightClick', target: 'desktop' }, 'mac')).toBe(true)
  })
  it('matches drags with both ends', () => {
    const exp = { type: 'drag', target: 'icon-a', dropTarget: 'icon-Recycle Bin' } as const
    expect(matchAction(exp, { type: 'drag', target: 'icon-a', dropTarget: 'icon-Recycle Bin' }, 'windows')).toBe(true)
    expect(matchAction(exp, { type: 'drag', target: 'icon-a', dropTarget: 'desktop' }, 'windows')).toBe(false)
  })
  it('maps mod to Ctrl or Cmd by OS', () => {
    const exp = { type: 'keyCombo', keys: 'mod+c' } as const
    expect(matchAction(exp, { type: 'keyCombo', keys: 'ctrl+c' }, 'windows')).toBe(true)
    expect(matchAction(exp, { type: 'keyCombo', keys: 'ctrl+c' }, 'mac')).toBe(false)
    expect(matchAction(exp, { type: 'keyCombo', keys: 'cmd+c' }, 'mac')).toBe(true)
    expect(matchAction({ type: 'keyCombo', keys: 'Alt+Tab' }, { type: 'keyCombo', keys: 'alt+tab' }, 'windows')).toBe(true)
  })
  it('matches file events with optional name/path and Bengali names', () => {
    expect(matchAction({ type: 'createFolder' }, { type: 'createFolder', name: 'x', path: '~' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'createFolder', name: 'আমার-কাজ' }, { type: 'createFolder', name: 'আমার-কাজ', path: '~' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'createFolder', name: 'a', inPath: '~/Documents' }, { type: 'createFolder', name: 'a', path: '~/Desktop' }, 'windows')).toBe(false)
    expect(matchAction({ type: 'move', name: 'a.txt', toPath: '~\\Documents\\' }, { type: 'move', name: 'A.txt', fromPath: '~', toPath: '~/Documents' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'rename', to: 'b' }, { type: 'rename', from: 'a', to: 'b', path: '~' }, 'mac')).toBe(true)
    expect(matchAction({ type: 'delete', name: 'a' }, { type: 'delete', name: 'b', path: '~' }, 'mac')).toBe(false)
  })
  it('matches typing, apps, options, custom', () => {
    expect(matchAction({ type: 'type', target: 'f', text: 'Hello', ignoreCase: true }, { type: 'type', target: 'f', value: ' hello ' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'type', target: 'f', text: 'Hello' }, { type: 'type', target: 'f', value: 'hello' }, 'windows')).toBe(false)
    expect(matchAction({ type: 'openApp', app: 'files' }, { type: 'openApp', app: 'files' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'closeApp', app: 'files' }, { type: 'openApp', app: 'files' }, 'windows')).toBe(false)
    expect(matchAction({ type: 'selectOption', target: 'setting-darkMode', value: 'true' }, { type: 'selectOption', target: 'setting-darkMode', value: 'true' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'custom', event: 'x' }, { type: 'custom', event: 'x' }, 'windows')).toBe(true)
    expect(matchAction({ type: 'continue' }, { type: 'custom', event: 'x' }, 'windows')).toBe(false)
  })
  it('target helpers', () => {
    expect(targetId('[data-coach="a b"]')).toBe('a b')
    expect(coachTarget({ expectedAction: { type: 'click', target: 'x' } })).toBe('x')
    expect(coachTarget({ target: 'y', expectedAction: { type: 'click', target: 'x' } })).toBe('y')
    expect(coachTarget({ expectedAction: { type: 'keyCombo', keys: 'mod+c' } })).toBeUndefined()
  })
})

describe('runner', () => {
  const steps = [step('a', { type: 'click', target: 'x' }), step('b', { type: 'click', target: 'y' })]
  it('advances only on the correct action', () => {
    let s = initialRunner()
    expect(feed(s, steps, { type: 'click', target: 'y' }, 'windows').matched).toBe(false)
    expect(feed(s, steps, { type: 'click', target: 'x' }, 'windows').matched).toBe(true)
    s = advance(s, steps)
    expect(s).toMatchObject({ index: 1, done: ['a'], finished: false })
    s = advance(s, steps)
    expect(s.finished).toBe(true)
    expect(feed(s, steps, { type: 'click', target: 'x' }, 'windows').matched).toBe(false)
    expect(advance(s, steps)).toBe(s)
  })
  it('filters steps by OS', () => {
    const all = [step('w', { type: 'continue' }, 'windows'), step('m', { type: 'continue' }, 'mac'), step('b', { type: 'continue' })]
    expect(stepsFor(all, 'mac').map((s) => s.id)).toEqual(['m', 'b'])
  })
  it('builds demo plans', () => {
    expect(demoPlan({ type: 'doubleClick', target: 't' })).toEqual({ kind: 'doubleClick', target: 't' })
    expect(demoPlan({ type: 'keyCombo', keys: 'mod+c' })).toEqual({ kind: 'keys', keys: 'mod+c' })
    expect(demoPlan({ type: 'continue' })).toEqual({ kind: 'none' })
  })
  it('praise varies', () => {
    const a = pickPraise(3)
    expect(pickPraise(3, a)).not.toBe(a)
    expect(PRAISE.length).toBeGreaterThanOrEqual(8)
  })
})

describe('quiz grading', () => {
  const mc = { id: 'q', type: 'multipleChoice', questionBn: '', options: [], correct: ['a', 'c'], multi: true, hintBn: '', explanationBn: '' } as QuizQuestion & { type: 'multipleChoice' }
  it('multiple choice needs the exact set', () => {
    expect(gradeMultipleChoice(mc, ['c', 'a'])).toBe(true)
    expect(gradeMultipleChoice(mc, ['a'])).toBe(false)
    expect(gradeMultipleChoice(mc, ['a', 'b', 'c'])).toBe(false)
  })
  it('drag match and ordering', () => {
    const dm = { id: 'q', type: 'dragMatch', questionBn: '', pairs: [{ id: '1', leftBn: '', rightBn: '' }, { id: '2', leftBn: '', rightBn: '' }], hintBn: '', explanationBn: '' } as QuizQuestion & { type: 'dragMatch' }
    expect(gradeDragMatch(dm, { 1: '1', 2: '2' })).toBe(true)
    expect(gradeDragMatch(dm, { 1: '2', 2: '1' })).toBe(false)
    expect(gradeDragMatch(dm, { 1: '1' })).toBe(false)
    const od = { id: 'q', type: 'ordering', questionBn: '', items: [{ id: 'a', textBn: '' }, { id: 'b', textBn: '' }], hintBn: '', explanationBn: '' } as QuizQuestion & { type: 'ordering' }
    expect(gradeOrdering(od, ['a', 'b'])).toBe(true)
    expect(gradeOrdering(od, ['b', 'a'])).toBe(false)
  })
  it('predict output trims and respects case', () => {
    const p = { id: 'q', type: 'predictOutput', questionBn: '', code: '', language: 'python', acceptedAnswers: ['Hello', 'হ্যালো'], hintBn: '', explanationBn: '' } as QuizQuestion & { type: 'predictOutput' }
    expect(gradePredictOutput(p, ' Hello\n')).toBe(true)
    expect(gradePredictOutput(p, 'hello')).toBe(false)
    expect(gradePredictOutput({ ...p, ignoreCase: true }, 'hello')).toBe(true)
    expect(gradePredictOutput(p, 'হ্যালো')).toBe(true)
  })
  it('shuffle is deterministic and never the identity', () => {
    const items = ['a', 'b', 'c', 'd']
    expect(seededShuffle(items, 'x')).toEqual(seededShuffle(items, 'x'))
    expect(seededShuffle(items, 'x')).not.toEqual(items)
    expect(seededShuffle(['a', 'b'], 'y')).toEqual(['b', 'a'])
    expect(seededShuffle([], 'z')).toEqual([])
  })
  it('scores first-try correct answers', () => {
    expect(scoreQuiz(['a', 'b', 'c'], { a: 0, b: 2 })).toEqual({ score: 2, total: 3, wrongByQuestion: { a: 0, b: 2 } })
  })
})

import { VirtualFileSystem } from '../sim/vfs'

describe('stage 5 actions', () => {
  const cmd = (command: string) => ({ type: 'command' as const, command, cwd: '~', ok: true, output: '' })
  it('typeCommand normalises whitespace and supports alternatives and modes', () => {
    expect(matchAction({ type: 'typeCommand', command: 'ls' }, cmd('  ls  '), 'mac')).toBe(true)
    expect(matchAction({ type: 'typeCommand', command: ['ls', 'dir'] }, cmd('dir'), 'windows')).toBe(true)
    expect(matchAction({ type: 'typeCommand', command: 'cd Documents' }, cmd('cd   Documents'), 'mac')).toBe(true)
    expect(matchAction({ type: 'typeCommand', command: 'cd Documents' }, cmd('cd documents'), 'mac')).toBe(false)
    expect(matchAction({ type: 'typeCommand', command: 'mkdir', match: 'prefix' }, cmd('mkdir coding'), 'mac')).toBe(true)
    expect(matchAction({ type: 'typeCommand', command: 'python', match: 'contains' }, cmd('python3 hello.py'), 'mac')).toBe(true)
    expect(matchAction({ type: 'typeCommand', command: 'ls' }, { type: 'click', target: 'x' }, 'mac')).toBe(false)
  })
  it('fileExists / fileContains read the virtual file system', () => {
    const vfs = new VirtualFileSystem('mac', 'Anika')
    const ev = { type: 'custom' as const, event: 'x' }
    expect(matchAction({ type: 'fileExists', path: '~/coding' }, ev, 'mac', { vfs })).toBe(false)
    vfs.mkdir(vfs.home, 'coding')
    expect(matchAction({ type: 'fileExists', path: '~/coding', kind: 'folder' }, ev, 'mac', { vfs })).toBe(true)
    expect(matchAction({ type: 'fileExists', path: '~/coding', kind: 'file' }, ev, 'mac', { vfs })).toBe(false)
    vfs.saveAs(vfs.resolve('~/coding')!, 'hello.py', 'print("হ্যালো")')
    expect(matchAction({ type: 'fileContains', path: '~/coding/hello.py', text: 'print(' }, ev, 'mac', { vfs })).toBe(true)
    expect(matchAction({ type: 'fileContains', path: '~/coding/hello.py', text: 'nope' }, ev, 'mac', { vfs })).toBe(false)
    expect(matchAction({ type: 'fileExists', path: '~/x' }, ev, 'mac')).toBe(false)
  })
  it('codeOutputEquals, previewContains, predictOutput', () => {
    const run = (output: string, ok = true, language: 'python' | 'javascript' = 'python') => ({ type: 'codeRun' as const, language, output, ok })
    expect(matchAction({ type: 'codeOutputEquals', output: 'Hello' }, run('Hello\n'), 'windows')).toBe(true)
    expect(matchAction({ type: 'codeOutputEquals', output: ['a', 'b'] }, run('b'), 'windows')).toBe(true)
    expect(matchAction({ type: 'codeOutputEquals', output: 'Hello' }, run('Hello', false), 'windows')).toBe(false)
    expect(matchAction({ type: 'codeOutputEquals', output: 'Hello', language: 'javascript' }, run('Hello'), 'windows')).toBe(false)
    expect(matchAction({ type: 'previewContains', text: 'স্বাগতম' }, { type: 'preview', html: '<h1>স্বাগতম</h1>', text: 'স্বাগতম' }, 'mac')).toBe(true)
    expect(matchAction({ type: 'previewContains', text: 'color: red' }, { type: 'preview', html: '<p style="color: red">x</p>', text: 'x' }, 'mac')).toBe(true)
    expect(matchAction({ type: 'predictOutput', acceptedAnswers: ['8'] }, { type: 'predict', answer: ' 8 ' }, 'mac')).toBe(true)
    expect(matchAction({ type: 'predictOutput', acceptedAnswers: ['Hi'], ignoreCase: true }, { type: 'predict', answer: 'hi' }, 'mac')).toBe(true)
    expect(matchAction({ type: 'predictOutput', acceptedAnswers: ['8'] }, { type: 'predict', answer: '9' }, 'mac')).toBe(false)
  })
})
