/**
 * Simulated install / uninstall state for the pretend "Calculator Plus" app (Module 6).
 * Nothing real is installed: "installing" registers a small simulated app in the app registry,
 * "uninstalling" removes it again. On the Mac flavour a `Calculator Plus.app` file also appears in
 * /Applications, and moving that file to the Trash uninstalls the app (like the real thing).
 */
import { useSyncExternalStore } from 'react'
import type { OsFlavor } from '../../../engine/types'
import type { VirtualFileSystem } from '../../vfs'
import { registerApp, unregisterApp } from '../registry'
import { CalcPlus, CalcPlusIcon } from './calcplus'

export const CALC_ID = 'calcplus'
export const CALC_NAME = 'Calculator Plus'
export const CALC_FILE = 'Calculator Plus.app'

let installed = false
let unsub: (() => void) | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

export const isInstalled = () => installed
export const subscribeInstalled = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
export const useInstalled = () => useSyncExternalStore(subscribeInstalled, isInstalled)

/** "Install" Calculator Plus: it appears in Start search / Launchpad / Spotlight from now on. */
export function installCalc(vfs: VirtualFileSystem, os: OsFlavor) {
  if (installed) return
  installed = true
  registerApp({
    id: CALC_ID,
    title: () => CALC_NAME,
    descriptionBn: 'ছোট একটি ক্যালকুলেটর প্রোগ্রাম (অনুশীলনের জন্য নকল)',
    icon: CalcPlusIcon,
    component: CalcPlus,
    defaultSize: { w: 300, h: 380 },
  })
  if (os === 'mac') {
    const apps = vfs.child(vfs.root, 'Applications')
    if (apps && !vfs.child(apps, CALC_FILE)) vfs.createFile(apps, CALC_FILE)
    unsub?.()
    unsub = vfs.onEvent((e) => {
      if (e.type === 'delete' && e.name === CALC_FILE) uninstallCalc()
    })
  }
  notify()
}

/** "Uninstall" Calculator Plus (the app disappears from the app lists). */
export function uninstallCalc() {
  if (!installed) return
  installed = false
  unregisterApp(CALC_ID)
  unsub?.()
  unsub = null
  notify()
}

/** Back to the starting state (used when a lesson's practice computer is reset). */
export const resetInstalls = uninstallCalc
