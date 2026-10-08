/**
 * Keyboard shortcut handling. Combos are normalised to a canonical string:
 * modifiers in the fixed order ctrl, alt, shift, cmd, then the key, joined by "+", all lower-case.
 * In lesson data, `mod` means Ctrl on Windows and Cmd on Mac, `opt` = alt, `win` = cmd (the Windows key).
 */
import type { OsFlavor } from '../engine/types'

const MOD_ORDER = ['ctrl', 'alt', 'shift', 'cmd'] as const

const ALIASES: Record<string, string> = {
  control: 'ctrl',
  option: 'alt',
  opt: 'alt',
  meta: 'cmd',
  command: 'cmd',
  win: 'cmd',
  windows: 'cmd',
  super: 'cmd',
  escape: 'esc',
  return: 'enter',
  del: 'delete',
  ' ': 'space',
  spacebar: 'space',
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
}

export function normalizeCombo(combo: string, os: OsFlavor): string {
  const parts = combo
    .split('+')
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
    .map((p) => (p === 'mod' ? (os === 'mac' ? 'cmd' : 'ctrl') : (ALIASES[p] ?? p)))
  const mods = MOD_ORDER.filter((m) => parts.includes(m))
  const key = parts.filter((p) => !(MOD_ORDER as readonly string[]).includes(p))
  return [...mods, ...key].join('+')
}

/** Canonical combo for a real DOM keyboard event (null for bare modifier presses). */
export function comboFromEvent(e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>): string | null {
  const k = e.key.toLowerCase()
  if (['control', 'alt', 'shift', 'meta', 'altgraph'].includes(k)) return null
  const key = ALIASES[k] ?? k
  const parts: string[] = []
  if (e.ctrlKey) parts.push('ctrl')
  if (e.altKey) parts.push('alt')
  if (e.shiftKey) parts.push('shift')
  if (e.metaKey) parts.push('cmd')
  parts.push(key)
  return parts.join('+')
}

/** Pretty keycap labels for the UI ("Ctrl + C", "⌘ C"). */
export function comboLabel(combo: string, os: OsFlavor): string {
  const c = normalizeCombo(combo, os)
  return c
    .split('+')
    .map((p) => {
      if (os === 'mac') return { ctrl: '⌃ Control', alt: '⌥ Option', shift: '⇧ Shift', cmd: '⌘ Command', esc: 'Esc', tab: 'Tab', enter: 'Return', delete: 'Delete', space: 'Space' }[p] ?? p.toUpperCase()
      return { ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift', cmd: 'Win', esc: 'Esc', tab: 'Tab', enter: 'Enter', delete: 'Delete', space: 'Space' }[p] ?? p.toUpperCase()
    })
    .join(' + ')
}

export type ShortcutAction =
  | 'switchWindow'
  | 'closeWindow'
  | 'minimizeWindow'
  | 'maximizeWindow'
  | 'showDesktop'
  | 'openStart'
  | 'openSpotlight'
  | 'openLaunchpad'
  | 'lockScreen'
  | 'newFolder'
  | 'copy'
  | 'cut'
  | 'paste'
  | 'selectAll'
  | 'undo'
  | 'save'
  | 'find'
  | 'quitApp'

/** OS-level shortcuts the desktop shell itself handles. App-level ones (copy/paste/save) are handled by apps. */
export const SYSTEM_SHORTCUTS: Record<OsFlavor, Record<string, ShortcutAction>> = {
  windows: {
    'alt+tab': 'switchWindow',
    'alt+f4': 'closeWindow',
    'cmd+d': 'showDesktop',
    'cmd+up': 'maximizeWindow',
    'cmd+down': 'minimizeWindow',
    cmd: 'openStart',
    'ctrl+esc': 'openStart',
    'cmd+l': 'lockScreen',
    'ctrl+shift+n': 'newFolder',
  },
  mac: {
    'cmd+tab': 'switchWindow',
    'cmd+w': 'closeWindow',
    'cmd+m': 'minimizeWindow',
    'cmd+q': 'quitApp',
    'cmd+space': 'openSpotlight',
    'ctrl+cmd+q': 'lockScreen',
    'shift+cmd+n': 'newFolder',
    'f4': 'openLaunchpad',
  },
}

export function systemAction(combo: string, os: OsFlavor): ShortcutAction | undefined {
  return SYSTEM_SHORTCUTS[os][combo]
}

/** Combos for common editing actions, per OS. Used by the cheat sheets and the shortcut pad. */
export const EDIT_SHORTCUTS: { action: string; labelBn: string; mod: string }[] = [
  { action: 'copy', labelBn: 'কপি (Copy)', mod: 'mod+c' },
  { action: 'paste', labelBn: 'পেস্ট (Paste)', mod: 'mod+v' },
  { action: 'cut', labelBn: 'কাট (Cut)', mod: 'mod+x' },
  { action: 'undo', labelBn: 'আনডু (Undo)', mod: 'mod+z' },
  { action: 'selectAll', labelBn: 'সব সিলেক্ট (Select All)', mod: 'mod+a' },
  { action: 'save', labelBn: 'সেভ (Save)', mod: 'mod+s' },
  { action: 'find', labelBn: 'খোঁজা (Find)', mod: 'mod+f' },
]
