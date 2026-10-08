import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useDesktop } from '../DesktopContext'

export type PowerMode = 'on' | 'off' | 'sleep' | 'restarting'

const RESTART_MS = 1800

const PowerIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3v9M6.5 7a8 8 0 1 0 11 0" />
  </svg>
)

/**
 * Power state shared by both shells. Emits `{type:'custom', event}` with
 * power-shutdown | power-sleep | power-restart | power-on (turn on after shutdown) | power-wake.
 */
export function usePower() {
  const d = useDesktop()
  const emit = d.emit
  const [mode, setMode] = useState<PowerMode>('on')

  const shutdown = useCallback(() => {
    setMode('off')
    emit({ type: 'custom', event: 'power-shutdown' })
  }, [emit])
  const sleep = useCallback(() => {
    setMode('sleep')
    emit({ type: 'custom', event: 'power-sleep' })
  }, [emit])
  const restart = useCallback(() => {
    setMode('restarting')
    emit({ type: 'custom', event: 'power-restart' })
  }, [emit])
  const turnOn = useCallback(() => {
    setMode('on')
    emit({ type: 'custom', event: 'power-on' })
  }, [emit])
  const wake = useCallback(() => {
    setMode('on')
    emit({ type: 'custom', event: 'power-wake' })
  }, [emit])

  useEffect(() => {
    if (mode !== 'restarting') return
    const t = window.setTimeout(() => setMode('on'), RESTART_MS)
    return () => window.clearTimeout(t)
  }, [mode])

  useEffect(() => {
    if (mode !== 'sleep') return
    const onKey = () => wake()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, wake])

  return { mode, shutdown, sleep, restart, turnOn, wake }
}

/** Full-screen overlay for off / sleep / restarting. Renders nothing when the computer is on. */
export function PowerScreen({ mode, onTurnOn, onWake, children }: { mode: PowerMode; onTurnOn: () => void; onWake: () => void; children?: ReactNode }) {
  if (mode === 'on') return null
  return (
    <div data-coach="power-overlay" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black" style={{ zIndex: 25000 }}>
      {mode === 'off' && (
        <>
          <p className="text-sm text-white/50">The computer is turned off.</p>
          <button type="button" data-coach="power-on-button" aria-label="Power on" autoFocus onClick={onTurnOn} className="flex h-12 items-center gap-2 rounded-full border border-white/30 px-6 text-white hover:bg-white/10">
            <PowerIcon size={20} /> Press to turn on
          </button>
        </>
      )}
      {mode === 'sleep' && (
        <>
          <p className="text-sm text-white/40">The screen is asleep.</p>
          <button type="button" data-coach="wake-button" aria-label="Wake" autoFocus onClick={onWake} className="flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-white/80 hover:bg-white/10">
            Press any key / click to wake
          </button>
        </>
      )}
      {mode === 'restarting' && (
        <p data-coach="power-restarting" role="status" className="text-sm text-white/60">
          Restarting…
        </p>
      )}
      {children}
    </div>
  )
}
