import { useSyncExternalStore } from 'react'

export interface FmPrefs {
  /** "File name extensions" (Windows View ▸ Show) / "Show all filename extensions" (Finder Settings ▸ Advanced) */
  showExt: boolean
  /** "Hidden items" / "Show Hidden Files" */
  showHidden: boolean
}

interface Store {
  v: FmPrefs
  subs: Set<() => void>
}

// One preferences object per simulated desktop (keyed by its VirtualFileSystem), shared by all file windows.
const stores = new WeakMap<object, Store>()

function storeFor(key: object): Store {
  let s = stores.get(key)
  if (!s) {
    s = { v: { showExt: false, showHidden: false }, subs: new Set() }
    stores.set(key, s)
  }
  return s
}

export function useFmPrefs(key: object): [FmPrefs, (patch: Partial<FmPrefs>) => void] {
  const s = storeFor(key)
  const v = useSyncExternalStore(
    (fn) => {
      s.subs.add(fn)
      return () => {
        s.subs.delete(fn)
      }
    },
    () => s.v,
  )
  return [v, (patch) => updatePrefs(key, patch)]
}

function updatePrefs(key: object, patch: Partial<FmPrefs>) {
  const s = storeFor(key)
  s.v = { ...s.v, ...patch }
  s.subs.forEach((f) => f())
}
