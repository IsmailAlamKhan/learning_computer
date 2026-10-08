/**
 * Simulated "which programming tools are installed?" state (Module 18).
 *
 * The state belongs to one simulated computer (keyed by its virtual file system), so a lesson's practice computer
 * starts fresh on every reset and other lessons are never affected. A computer that never called
 * `beginToolPractice` is NOT gated: every tool counts as installed (so Part 2 lessons that run Python/Node keep working).
 */
import { useSyncExternalStore } from 'react'
import type { VirtualFileSystem } from '../../vfs'

export type ToolId = 'python' | 'node' | 'git' | 'vscode'
export const TOOLS: ToolId[] = ['python', 'node', 'git', 'vscode']

export interface ToolState {
  installed: Record<ToolId, boolean>
  /** Windows: Python was installed but "Add python.exe to PATH" was not ticked, so the terminal cannot find it. */
  pythonNoPath: boolean
}

const states = new WeakMap<VirtualFileSystem, ToolState>()
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

const NONE: ToolState = { installed: { python: true, node: true, git: true, vscode: true }, pythonNoPath: false }

/** Start the "nothing is installed yet" practice on this computer. `installed` lists tools that already are. */
export function beginToolPractice(vfs: VirtualFileSystem, installed: Partial<Record<ToolId, boolean>> = {}, extensions: string[] = []) {
  states.set(vfs, { installed: { python: false, node: false, git: false, vscode: false, ...installed }, pythonNoPath: false })
  exts.set(vfs, extensions)
  notify()
}

export const isGated = (vfs: VirtualFileSystem) => states.has(vfs)
export const getToolState = (vfs: VirtualFileSystem): ToolState => states.get(vfs) ?? NONE
export const isToolInstalled = (vfs: VirtualFileSystem, tool: ToolId) => getToolState(vfs).installed[tool]

/** Mark a tool installed. For Python on Windows pass `{ path: false }` when the PATH box was left unticked. */
export function installTool(vfs: VirtualFileSystem, tool: ToolId, opts: { path?: boolean } = {}) {
  const cur = states.get(vfs)
  if (!cur) return
  const path = opts.path ?? true
  if (tool === 'python' && !path) {
    states.set(vfs, { ...cur, pythonNoPath: true })
  } else {
    states.set(vfs, { ...cur, installed: { ...cur.installed, [tool]: true }, pythonNoPath: tool === 'python' ? false : cur.pythonNoPath })
  }
  notify()
}

const NO_EXT: string[] = []
const exts = new WeakMap<VirtualFileSystem, string[]>()
export const getExtensions = (vfs: VirtualFileSystem): string[] => exts.get(vfs) ?? NO_EXT
export const isExtensionInstalled = (vfs: VirtualFileSystem, id: string) => getExtensions(vfs).includes(id)

/** Install an editor extension (works on any computer; independent of the install gating). */
export function installExtension(vfs: VirtualFileSystem, id: string) {
  const cur = getExtensions(vfs)
  if (cur.includes(id)) return
  exts.set(vfs, [...cur, id])
  notify()
}

export function useExtensions(vfs: VirtualFileSystem): string[] {
  return useSyncExternalStore(subscribe, () => getExtensions(vfs))
}

/** React hook: re-renders when this computer's tool state changes. */
export function useToolState(vfs: VirtualFileSystem): ToolState {
  return useSyncExternalStore(subscribe, () => getToolState(vfs))
}
