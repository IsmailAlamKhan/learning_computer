import type { OsFlavor } from '../engine/types'
import type { DesktopApi } from './DesktopContext'

type Handler = (d: DesktopApi) => void
const registry: Record<OsFlavor, Map<string, Handler>> = { windows: new Map(), mac: new Map() }

/**
 * Register an OS-level keyboard shortcut handled by the simulated desktop itself (e.g. Task Manager, screenshots).
 * Call from a module in src/sim/apps/extra/*.tsx (auto-loaded). `combo` uses the canonical form (see shortcuts.ts),
 * e.g. 'ctrl+shift+esc', 'alt+cmd+esc', 'shift+cmd+4'. Real keys and the on-screen shortcut pad both reach it.
 */
export function registerSystemShortcut(os: OsFlavor, combo: string, handler: Handler) {
  registry[os].set(combo, handler)
}

export const getSystemShortcut = (os: OsFlavor, combo: string): Handler | undefined => registry[os].get(combo)
