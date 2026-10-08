import { useSyncExternalStore } from 'react'
import { ProgressStore, type ProgressData } from './progress'

export const store = new ProgressStore()

export function useProgress(): ProgressData {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}
