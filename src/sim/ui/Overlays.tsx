import { useDesktop } from '../DesktopContext'
import { getApp } from '../apps/registry'

/** Alt+Tab / Cmd+Tab switcher flash. */
export function AppSwitcher() {
  const d = useDesktop()
  if (!d.ui.switcherVisible) return null
  const wins = d.wm.order.map((id) => d.wm.windows.find((w) => w.id === id)).filter(Boolean)
  const mac = d.os === 'mac'
  return (
    <div className="pointer-events-none absolute inset-0 z-[15000] flex items-center justify-center" data-coach="app-switcher" aria-live="polite">
      <div className={`flex gap-3 p-4 ${mac ? 'rounded-2xl bg-white/70 backdrop-blur' : 'rounded-xl bg-gray-900/85 text-white'}`}>
        {wins.map((w, i) => {
          const Icon = getApp(w!.app)?.icon
          return (
            <div key={w!.id} className={`flex w-28 flex-col items-center gap-1 rounded-lg p-2 text-center text-xs ${i === 0 ? (mac ? 'bg-black/15' : 'bg-white/25 ring-2 ring-sky-300') : ''}`}>
              {Icon && <Icon size={44} />}
              <span className="line-clamp-2">{w!.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ToastHost() {
  const { toasts, os } = useDesktop()
  return (
    <div className={`pointer-events-none absolute right-3 z-[16000] flex flex-col gap-2 ${os === 'mac' ? 'top-9' : 'bottom-14'}`} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="max-w-xs rounded-lg bg-gray-900/90 px-4 py-2.5 text-sm text-white shadow-lg">
          {t.text}
        </div>
      ))}
    </div>
  )
}

export function LockScreen() {
  const d = useDesktop()
  if (!d.ui.locked) return null
  const now = new Date()
  return (
    <div className="absolute inset-0 z-[30000] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-800 to-indigo-900 text-white" data-coach="lock-screen">
      <div className="text-6xl font-light">{now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
      <div>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">👤</div>
        <div className="font-medium">{d.userName}</div>
        <button data-coach="unlock-button" className="min-h-10 rounded-md bg-white/90 px-6 text-sm font-medium text-gray-900" onClick={() => (d.setUi({ locked: false }), d.emit({ type: 'custom', event: 'unlocked' }))}>
          {d.os === 'mac' ? 'Touch ID or Enter Password' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}
