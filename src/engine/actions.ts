import type { ExpectedAction, OsFlavor } from './types'
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

/** Does this simulator event satisfy the step's expected action? Pure and OS-aware. */
export function matchAction(expected: ExpectedAction, ev: SimEvent, os: OsFlavor): boolean {
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
  }
}

/** The data-coach id the coach should point at for a step (target, falling back to the action's own target). */
export function coachTarget(step: { target?: string; expectedAction: ExpectedAction }): string | undefined {
  if (step.target) return targetId(step.target)
  const a = step.expectedAction
  if ('target' in a) return targetId(a.target)
  return undefined
}
