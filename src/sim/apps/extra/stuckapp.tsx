/**
 * "Photo Album" — a fictional program that freezes after one click (Module 12).
 * Windows: the title becomes "Photo Album (Not Responding)" and clicks are ignored.
 * Mac: a spinning rainbow-like wheel appears (a generic spinner, not the real artwork) and clicks are ignored.
 */
import { useEffect } from 'react'
import { registerApp } from '../registry'
import { useDesktop } from '../../DesktopContext'
import type { WinState } from '../../windowManager'
import { setFrozen, useFrozenIds } from './stuckState'

export const STUCK_ID = 'stuckapp'
export const STUCK_TITLE = 'Photo Album'

export const StuckIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect x="5" y="9" width="38" height="30" rx="5" fill="#7c3aed" />
    <rect x="9" y="13" width="30" height="22" rx="2" fill="#ede9fe" />
    <circle cx="19" cy="21" r="3.5" fill="#fbbf24" />
    <path d="M9 35l10-9 7 6 5-4 8 7z" fill="#34d399" />
  </svg>
)

export function StuckApp({ win }: { win: WinState }) {
  const d = useDesktop()
  const frozen = useFrozenIds().has(win.id)
  const mac = d.os === 'mac'

  useEffect(() => {
    setFrozen(win.id, false)
    return () => setFrozen(win.id, false)
  }, [win.id])
  useEffect(() => {
    if (!mac) d.wmDispatch({ type: 'setTitle', id: win.id, title: frozen ? `${STUCK_TITLE} (Not Responding)` : STUCK_TITLE })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen, mac, win.id])

  return (
    <div
      data-coach="stuckapp-content"
      aria-busy={frozen}
      className={`relative flex h-full flex-col gap-3 bg-white p-4 text-gray-900 ${frozen ? 'opacity-70' : ''}`}
      style={frozen ? { cursor: mac ? 'progress' : 'wait' } : undefined}
      onClick={() => {
        if (frozen) d.emit({ type: 'custom', event: 'stuckapp-ignored' })
      }}
    >
      <h2 className="text-lg font-semibold">My Family Album</h2>
      <div className="grid grid-cols-4 gap-2" aria-hidden="true">
        {['#fca5a5', '#fcd34d', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4', '#fdba74', '#a5f3fc'].map((c) => (
          <div key={c} className="h-14 rounded" style={{ background: c }} />
        ))}
      </div>
      <button
        type="button"
        data-coach="stuckapp-album"
        className="min-h-11 self-start rounded bg-violet-600 px-4 text-white"
        onClick={() => {
          if (frozen) return
          setFrozen(win.id, true)
          d.emit({ type: 'custom', event: 'stuckapp-frozen' })
        }}
      >
        Open the holiday album
      </button>
      {frozen && mac && (
        <div data-coach="stuckapp-spinner" role="status" aria-label="Not responding" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full" style={{ background: 'conic-gradient(#ef4444,#f59e0b,#eab308,#22c55e,#06b6d4,#6366f1,#d946ef,#ef4444)', mask: 'radial-gradient(circle, transparent 38%, #000 40%)', WebkitMask: 'radial-gradient(circle, transparent 38%, #000 40%)' }} />
        </div>
      )}
      {frozen && !mac && (
        <div data-coach="stuckapp-wait" className="pointer-events-none absolute right-3 bottom-3 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Working…
        </div>
      )}
    </div>
  )
}

export function register() {
  registerApp({
    id: STUCK_ID,
    title: () => STUCK_TITLE,
    descriptionBn: 'একটি কাল্পনিক ছবির অ্যালবাম প্রোগ্রাম — এক ক্লিকেই আটকে যায় (শুধু অনুশীলনের জন্য)',
    icon: StuckIcon,
    component: StuckApp,
    defaultSize: { w: 520, h: 340 },
  })
}
