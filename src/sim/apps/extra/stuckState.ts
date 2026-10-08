/**
 * Which simulated windows are "Not Responding" (Module 12). Only the pretend Photo Album can freeze.
 * The set is tied to window ids: the app clears its own entry when it mounts and when it closes.
 */
import { useSyncExternalStore } from 'react'

const frozen = new Set<string>()
let snapshot = ''
const listeners = new Set<() => void>()
const notify = () => {
  snapshot = [...frozen].sort().join('|')
  listeners.forEach((l) => l())
}

export const isFrozen = (winId: string) => frozen.has(winId)
export function setFrozen(winId: string, on: boolean) {
  if (on === frozen.has(winId)) return
  if (on) frozen.add(winId)
  else frozen.delete(winId)
  notify()
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
/** Re-renders when any window freezes or unfreezes; returns the ids of the frozen windows. */
export function useFrozenIds(): ReadonlySet<string> {
  useSyncExternalStore(subscribe, () => snapshot)
  return frozen
}
