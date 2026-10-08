import type { ExpectedAction, MatchContext, OsFlavor } from './types'
import type { SimEvent } from '../sim/bus'
import { normalizeCombo } from '../sim/shortcuts'

/** `[data-coach="x"]` → `x`; plain ids pass through. */
export function targetId(target: string | undefined): string | undefined {
  if (!target) return undefined
  const m = /^\[data-coach=["']?(.+?)["']?\]$/.exec(target.trim())
  return m ? m[1] : target
}

const norm = (s: string) => s.normalize('NFC').trim()
const eqName = (a: string | undefined, b: string) => a === undefined || norm(a).toLowerCase() === norm(b).toLowerCase()
const normPath = (p: string) => norm(p).replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase() || '/'
const eqPath = (a: string | undefined, b: string) => a === undefined || normPath(a) === normPath(b)

const normCmd = (s: string) => s.normalize('NFC').trim().replace(/\s+/g, ' ')

/** Does this simulator event satisfy the step's expected action? Pure and OS-aware (state-based actions read `ctx`). */
export function matchAction(expected: ExpectedAction, ev: SimEvent, os: OsFlavor, ctx: MatchContext = {}): boolean {
  switch (expected.type) {
    case 'click':
    case 'doubleClick':
    case 'rightClick':
      return ev.type === expected.type && ev.target === targetId(expected.target)
    case 'drag':
      return ev.type === 'drag' && ev.target === targetId(expected.target) && ev.dropTarget === targetId(expected.dropTarget)
    case 'type': {
      if (ev.type !== 'type' || ev.target !== targetId(expected.target)) return false
      const a = norm(ev.value)
      const b = norm(expected.text)
      return expected.ignoreCase ? a.toLowerCase() === b.toLowerCase() : a === b
    }
    case 'keyCombo':
      return ev.type === 'keyCombo' && ev.keys === normalizeCombo(expected.keys, os)
    case 'openApp':
      return ev.type === 'openApp' && ev.app === expected.app
    case 'closeApp':
      return ev.type === 'closeApp' && ev.app === expected.app
    case 'createFolder':
    case 'createFile':
      return ev.type === expected.type && eqName(expected.name, ev.name) && eqPath(expected.inPath, ev.path)
    case 'rename':
      return ev.type === 'rename' && eqName(expected.from, ev.from) && eqName(expected.to, ev.to)
    case 'move':
      return ev.type === 'move' && eqName(expected.name, ev.name) && eqPath(expected.toPath, ev.toPath)
    case 'copy':
      return ev.type === 'copy' && eqName(expected.name, ev.name) && eqPath(expected.toPath, ev.toPath)
    case 'delete':
    case 'restore':
      return ev.type === expected.type && eqName(expected.name, ev.name)
    case 'saveFile':
      return ev.type === 'saveFile' && eqName(expected.name, ev.name)
    case 'navigate':
      return ev.type === 'navigate' && eqPath(expected.path, ev.path)
    case 'selectOption':
      return ev.type === 'selectOption' && ev.target === targetId(expected.target) && ev.value === expected.value
    case 'custom':
      return ev.type === 'custom' && ev.event === expected.event
    case 'continue':
      return false
    case 'typeCommand': {
      if (ev.type !== 'command') return false
      const got = normCmd(ev.command)
      const want = (Array.isArray(expected.command) ? expected.command : [expected.command]).map(normCmd)
      const mode = expected.match ?? 'exact'
      return want.some((w) => (mode === 'exact' ? got === w : mode === 'prefix' ? got.startsWith(w) : got.includes(w)))
    }
    case 'fileExists': {
      const n = ctx.vfs?.resolve(expected.path)
      return !!n && (!expected.kind || n.kind === expected.kind)
    }
    case 'fileContains': {
      const n = ctx.vfs?.resolve(expected.path)
      return !!n && n.kind === 'file' && n.content.normalize('NFC').includes(expected.text.normalize('NFC'))
    }
    case 'codeOutputEquals': {
      if (ev.type !== 'codeRun' || !ev.ok) return false
      if (expected.language && ev.language !== expected.language) return false
      const got = ev.output.replace(/\r\n/g, '\n').trim()
      return (Array.isArray(expected.output) ? expected.output : [expected.output]).some((o) => o.replace(/\r\n/g, '\n').trim() === got)
    }
    case 'previewContains':
      return ev.type === 'preview' && (ev.html.includes(expected.text) || ev.text.includes(expected.text))
    case 'predictOutput': {
      if (ev.type !== 'predict') return false
      const a = ev.answer.normalize('NFC').replace(/\r\n/g, '\n').trim()
      return expected.acceptedAnswers.some((x) => (expected.ignoreCase ? x.trim().toLowerCase() === a.toLowerCase() : x.normalize('NFC').trim() === a))
    }
  }
}

/** The data-coach id the coach should point at for a step (target, falling back to the action's own target). */
export function coachTarget(step: { target?: string; expectedAction: ExpectedAction }): string | undefined {
  if (step.target) return targetId(step.target)
  const a = step.expectedAction
  if ('target' in a) return targetId(a.target)
  return undefined
}
