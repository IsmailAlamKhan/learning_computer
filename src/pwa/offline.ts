/**
 * Offline support (see docs/OFFLINE.md). Registers the service worker (production builds only) and, once the app is idle,
 * downloads the ~13 MB self-hosted Python runtime into the cache the service worker serves `/pyodide/` from.
 * Nothing here blocks the UI: every step is best-effort and the status is only shown as a small chip (PwaStatus).
 */
import { useSyncExternalStore } from 'react'
import { PYODIDE_FILES } from './assets'

export type PrefetchState = 'idle' | 'working' | 'done' | 'error'
export interface PwaState {
  /** service workers + Cache API are available (secure context) and we are not in dev */
  supported: boolean
  /** a newer version has been downloaded and is waiting for the app to be reopened */
  needRefresh: boolean
  /** progress of the background Python download */
  prefetch: PrefetchState
}

let state: PwaState = { supported: false, needRefresh: false, prefetch: 'idle' }
const listeners = new Set<() => void>()
const set = (patch: Partial<PwaState>) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => void listeners.delete(l)
}
export const usePwaState = () => useSyncExternalStore(subscribe, () => state)

const PYODIDE_CACHE = `pyodide-${__PYODIDE_VERSION__}`
const pyodideUrls = () => PYODIDE_FILES.map((f) => new URL(`${import.meta.env.BASE_URL}pyodide/${f}`, location.href).href)

async function allCached() {
  const cache = await caches.open(PYODIDE_CACHE)
  for (const u of pyodideUrls()) if (!(await cache.match(u))) return false
  return true
}

let running = false
/** Fetch the Python runtime into the cache (skips files already there). Safe to call repeatedly. */
export async function prefetchPyodide() {
  if (!state.supported || running) return
  running = true
  set({ prefetch: 'working' })
  try {
    for (const k of await caches.keys()) if (k.startsWith('pyodide-') && k !== PYODIDE_CACHE) await caches.delete(k)
    const cache = await caches.open(PYODIDE_CACHE)
    for (const u of pyodideUrls()) {
      if (await cache.match(u)) continue
      const res = await fetch(u)
      if (!res.ok) throw new Error(`${res.status} ${u}`)
      await cache.put(u, res)
    }
    set({ prefetch: 'done' })
  } catch {
    set({ prefetch: 'error' })
  } finally {
    running = false
  }
}

function whenIdle(fn: () => void) {
  const run = () => ('requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 10_000 }) : setTimeout(fn, 4000))
  if (document.readyState === 'complete') setTimeout(run, 3000)
  else addEventListener('load', () => setTimeout(run, 3000), { once: true })
}

let applyUpdate: () => void = () => {}
/** Activate the waiting version and reload (only called when the learner presses the button). */
export const updateNow = () => applyUpdate()

export function startPwa() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || typeof caches === 'undefined') return
  set({ supported: true })
  addEventListener('online', () => {
    if (state.prefetch === 'error' || state.prefetch === 'idle') void prefetchPyodide()
  })
  void import('workbox-window').then(async ({ Workbox }) => {
    const wb = new Workbox(new URL(`${import.meta.env.BASE_URL}sw.js`, location.href).href)
    let reloading = false
    wb.addEventListener('waiting', () => set({ needRefresh: true }))
    wb.addEventListener('controlling', () => {
      if (reloading) location.reload()
    })
    applyUpdate = () => {
      reloading = true
      wb.messageSkipWaiting()
    }
    try {
      await wb.register()
      await navigator.serviceWorker.ready
      if (await allCached()) return set({ prefetch: 'done' })
      whenIdle(() => {
        if (navigator.onLine) void prefetchPyodide()
      })
    } catch {
      /* no service worker (private window, blocked, …): the app still works online */
    }
  })
}
