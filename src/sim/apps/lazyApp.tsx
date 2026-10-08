import { Suspense, type ComponentType } from 'react'
import type { WinState } from '../windowManager'

type AppComponent = ComponentType<{ win: WinState }>

const preloaders: Array<() => Promise<unknown>> = []

/**
 * Code-split a simulated app: its component (and heavy dependencies such as CodeMirror) is fetched the first time a
 * window of it opens. After loading it renders synchronously, so the Suspense fallback only ever shows once.
 */
export function lazyApp(load: () => Promise<AppComponent>): AppComponent {
  let loaded: AppComponent | null = null
  let promise: Promise<unknown> | null = null
  const start = () => (promise ??= load().then((c) => void (loaded = c)))
  preloaders.push(start)
  function Loaded(p: { win: WinState }) {
    if (!loaded) throw start()
    const C = loaded
    return <C {...p} />
  }
  // Always the same element shape (Suspense > Loaded): switching shape after loading would remount the app and lose its state.
  return function LazyApp(p) {
    return (
      <Suspense fallback={<p role="status" className="p-4 text-sm opacity-70">Loading…</p>}>
        <Loaded {...p} />
      </Suspense>
    )
  }
}

/** Load every lazy app now (used by tests so apps render synchronously). */
export const preloadApps = () => Promise.all(preloaders.map((p) => p()))
