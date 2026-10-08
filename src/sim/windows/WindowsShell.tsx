/**
 * Generic Windows-11-like shell: wallpaper, desktop icons, windows, centered taskbar, Start menu,
 * system tray with Quick Settings, and a power overlay. No logos, no exact artwork.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useDesktop, type DesktopApi } from '../DesktopContext'
import { getApp, appsFor } from '../apps/registry'
import { DesktopSurface, type SpecialIcon } from '../ui/DesktopSurface'
import { WindowLayer } from '../ui/WindowLayer'
import { Tooltip } from '../ui/Tooltip'
import { errorMessageEn, type VNode } from '../vfs'
import { PowerScreen, usePower } from '../ui/PowerScreen'
import { BatteryGlyph, BluetoothGlyph, BrowserIcon, NodeIcon, PowerGlyph, RecycleBinIcon, SearchGlyph, StartMark, VolumeGlyph, WifiGlyph } from '../ui/icons'

export const WINDOWS_INSET = { top: 0, bottom: 48 }

import { wallpaperCss } from '../wallpapers'
import { InputIndicator } from '../ui/InputIndicator'

/** CSS backgrounds for the 4 selectable wallpapers (Settings previews use these too). */
export const WINDOWS_WALLPAPERS: string[] = [
  'radial-gradient(circle at 25% 30%, #5ec8ff 0%, transparent 45%), radial-gradient(circle at 75% 70%, #6b5bff 0%, transparent 50%), linear-gradient(135deg, #1e3a8a, #38bdf8)',
  'radial-gradient(ellipse at 50% 120%, #fbbf24 0%, #f97316 30%, transparent 60%), linear-gradient(180deg, #312e81 0%, #be185d 55%, #fb923c 100%)',
  'radial-gradient(ellipse at 20% 100%, #166534 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, #15803d 0%, transparent 50%), linear-gradient(180deg, #7dd3fc 0%, #bae6fd 60%, #86efac 100%)',
  'radial-gradient(circle at 70% 25%, #a78bfa 0%, transparent 40%), radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 45%), linear-gradient(160deg, #0f172a, #1e1b4b 60%, #3b0764)',
]

const PINNED_IDS = ['files', 'browser', 'editor', 'settings', 'terminal', 'mail']

const BN: Record<string, string> = {
  files: 'ফাইল-ফোল্ডার দেখার প্রোগ্রাম',
  browser: 'ইন্টারনেট ঘোরার প্রোগ্রাম',
  editor: 'লেখালেখির সহজ প্রোগ্রাম',
  settings: 'কম্পিউটারের সেটিংস বদলানোর জায়গা',
  terminal: 'কমান্ড লিখে কম্পিউটারকে নির্দেশ দেওয়ার জায়গা',
  mail: 'ইমেইল পড়া ও পাঠানোর প্রোগ্রাম',
  photos: 'ছবি দেখার প্রোগ্রাম',
  bin: 'মুছে ফেলা ফাইল জমা থাকার জায়গা',
}

function useTheme() {
  const dark = useDesktop().sim.darkMode
  return {
    dark,
    bar: dark ? 'bg-[rgba(32,32,36,0.88)] text-white border-white/10' : 'bg-[rgba(243,243,246,0.88)] text-gray-900 border-black/10',
    panel: dark ? 'bg-[rgba(36,36,42,0.96)] text-white border-white/10' : 'bg-[rgba(248,248,251,0.97)] text-gray-900 border-black/10',
    hover: dark ? 'hover:bg-white/10' : 'hover:bg-black/[0.06]',
    active: dark ? 'bg-white/15' : 'bg-white/80 shadow-sm',
    sub: dark ? 'bg-white/[0.06]' : 'bg-white/70',
    muted: dark ? 'text-white/60' : 'text-gray-500',
  }
}

function fmtClock(now: Date, tz: string, h24: boolean) {
  const opts = (timeZone?: string): [Intl.DateTimeFormatOptions, Intl.DateTimeFormatOptions] => [
    { timeZone, hour: 'numeric', minute: '2-digit', hourCycle: h24 ? 'h23' : 'h12' },
    { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' },
  ]
  try {
    const [t, dt] = opts(tz)
    return { time: new Intl.DateTimeFormat('en-US', t).format(now), date: new Intl.DateTimeFormat('en-US', dt).format(now) }
  } catch {
    const [t, dt] = opts(undefined)
    return { time: new Intl.DateTimeFormat('en-US', t).format(now), date: new Intl.DateTimeFormat('en-US', dt).format(now) }
  }
}

function useOutside(active: boolean, refs: React.RefObject<HTMLElement | null>[], close: () => void) {
  const closeRef = useRef(close)
  closeRef.current = close
  useEffect(() => {
    if (!active) return
    const down = (e: PointerEvent) => {
      const t = e.target as Node
      if (refs.some((r) => r.current?.contains(t))) return
      closeRef.current()
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('pointerdown', down, true)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', down, true)
      document.removeEventListener('keydown', key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

function appIcon(id: string, size: number): ReactNode {
  const Icon = getApp(id)?.icon
  return Icon ? <Icon size={size} /> : null
}

// ---------------------------------------------------------------- taskbar

function TaskbarButton({ coach, label, bn, children, running, active, onClick, pressed }: { coach: string; label: string; bn?: string; children: ReactNode; running?: boolean; active?: boolean; onClick: () => void; pressed?: boolean }) {
  const th = useTheme()
  return (
    <Tooltip text={label} bn={bn}>
      <button
        type="button"
        data-coach={coach}
        aria-label={label}
        aria-pressed={pressed}
        onClick={onClick}
        className={`relative flex h-10 w-10 items-center justify-center rounded-md transition-colors ${active ? th.active : th.hover}`}
      >
        {children}
        {running && <span aria-hidden className={`absolute bottom-0.5 h-[3px] rounded-full ${active ? 'w-4 bg-sky-500' : 'w-1.5 bg-gray-400'}`} />}
      </button>
    </Tooltip>
  )
}

function Taskbar({ startRef, trayRef }: { startRef: React.RefObject<HTMLDivElement | null>; trayRef: React.RefObject<HTMLDivElement | null> }) {
  const d = useDesktop()
  const th = useTheme()
  const [qs, setQs] = useState(false)
  useOutside(qs, [trayRef], () => setQs(false))

  const pinned = PINNED_IDS.filter((id) => appsFor('windows').some((a) => a.id === id) && getApp(id))
  const runningApps = [...new Set(d.wm.windows.map((w) => w.app))]
  const ids = [...pinned, ...runningApps.filter((a) => !pinned.includes(a) && getApp(a))]

  const toggleApp = (appId: string) => {
    d.closeMenu()
    const wins = d.wm.windows.filter((w) => w.app === appId)
    if (!wins.length) return d.openApp(appId)
    d.setUi({ startOpen: false })
    const act = d.active
    if (act && act.app === appId) return d.wmDispatch({ type: 'minimize', id: act.id })
    const target = d.wm.order.map((id) => wins.find((w) => w.id === id)).find(Boolean) ?? wins[0]
    d.wmDispatch({ type: 'focus', id: target.id })
  }

  return (
    <div
      data-coach="taskbar"
      className={`absolute inset-x-0 bottom-0 flex h-12 items-center border-t backdrop-blur-xl ${th.bar}`}
      style={{ zIndex: 1000 }}
      onPointerDown={() => d.closeMenu()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex flex-1 items-center justify-center gap-1">
        <div ref={startRef} className="flex items-center gap-1">
          <TaskbarButton coach="start-button" label="Start" bn="শুরু করার মেনু" pressed={d.ui.startOpen} active={d.ui.startOpen} onClick={() => { d.closeMenu(); d.setUi({ startOpen: !d.ui.startOpen }) }}>
            <StartMark size={24} />
          </TaskbarButton>
          <TaskbarButton coach="taskbar-search" label="Search" bn="কম্পিউটারে খুঁজুন" onClick={() => { d.closeMenu(); d.setUi({ startOpen: true }) }}>
            <SearchGlyph size={20} />
          </TaskbarButton>
        </div>
        {ids.map((id) => {
          const app = getApp(id)!
          const wins = d.wm.windows.filter((w) => w.app === id)
          return (
            <TaskbarButton key={id} coach={`taskbar-app-${id}`} label={app.title('windows')} bn={app.descriptionBn ?? BN[id]} running={wins.length > 0} active={!!d.active && d.active.app === id} onClick={() => toggleApp(id)}>
              {appIcon(id, 26)}
            </TaskbarButton>
          )
        })}
      </div>

      <Tray qs={qs} setQs={setQs} trayRef={trayRef} />
      <button
        type="button"
        data-coach="show-desktop"
        aria-label="Show desktop"
        title="Show desktop"
        className={`h-full w-2.5 border-l ${th.dark ? 'border-white/20 hover:bg-white/20' : 'border-black/15 hover:bg-black/10'}`}
        onClick={() => { d.closeMenu(); d.setUi({ startOpen: false }); d.wmDispatch({ type: 'minimizeAll' }) }}
      />
    </div>
  )
}

function Tray({ qs, setQs, trayRef }: { qs: boolean; setQs: (v: boolean) => void; trayRef: React.RefObject<HTMLDivElement | null> }) {
  const d = useDesktop()
  const th = useTheme()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(t)
  }, [])
  const { time, date } = fmtClock(now, d.sim.timezone, d.sim.clock24)
  return (
    <div ref={trayRef} className="relative flex h-full items-center gap-0.5 pr-1">
      <InputIndicator mac={false} />
      <Tooltip text="Quick settings" bn="ওয়াই-ফাই, আওয়াজ ও আলো এখানে ঠিক করা যায়">
        <button
          type="button"
          data-coach="tray"
          aria-label="Quick settings"
          aria-expanded={qs}
          className={`flex h-10 items-center gap-2.5 rounded-md px-2.5 ${qs ? th.active : th.hover}`}
          onClick={() => { d.closeMenu(); d.setUi({ startOpen: false }); setQs(!qs) }}
        >
          <span data-coach="tray-wifi"><WifiGlyph size={17} off={!d.sim.wifiOn} /></span>
          <span data-coach="tray-volume"><VolumeGlyph size={17} muted={d.sim.muted || d.sim.volume === 0} /></span>
          <span data-coach="tray-battery"><BatteryGlyph size={19} /></span>
        </button>
      </Tooltip>
      <div data-coach="tray-clock" role="button" tabIndex={0} aria-label={`${time} ${date}`} className={`flex h-10 min-w-[72px] flex-col items-end justify-center rounded-md px-2 text-[12px] leading-tight ${th.hover}`} onClick={() => d.closeMenu()}>
        <span>{time}</span>
        <span>{date}</span>
      </div>
      {qs && <QuickSettings />}
    </div>
  )
}

function Toggle({ coach, label, on, icon, onClick }: { coach: string; label: string; on: boolean; icon: ReactNode; onClick: () => void }) {
  const th = useTheme()
  return (
    <button type="button" data-coach={coach} role="switch" aria-checked={on} onClick={onClick} className={`flex h-[60px] flex-col items-start justify-between rounded-lg border px-3 py-2 text-left text-xs ${on ? 'border-transparent bg-sky-500 text-white' : `${th.sub} ${th.hover} border-black/10`}`}>
      {icon}
      <span>{label}: {on ? 'On' : 'Off'}</span>
    </button>
  )
}

function Slider({ coach, label, icon, value, onChange }: { coach: string; label: string; icon: ReactNode; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-5 shrink-0">{icon}</span>
      <input data-coach={coach} type="range" min={0} max={100} value={value} aria-label={label} onChange={(e) => onChange(Number(e.target.value))} className="h-6 flex-1 accent-sky-500" />
      <span className="w-8 text-right text-xs tabular-nums">{value}</span>
    </label>
  )
}

function QuickSettings() {
  const d = useDesktop()
  const th = useTheme()
  const s = d.sim
  return (
    <div data-coach="quick-settings" role="dialog" aria-label="Quick settings" className={`absolute right-1 bottom-[54px] w-[340px] space-y-4 rounded-xl border p-4 shadow-2xl backdrop-blur-xl ${th.panel}`} style={{ zIndex: 1100 }}>
      <div className="grid grid-cols-3 gap-2">
        <Toggle coach="qs-wifi" label="Wi-Fi" on={s.wifiOn} icon={<WifiGlyph size={20} off={!s.wifiOn} />} onClick={() => d.setSim({ wifiOn: !s.wifiOn })} />
        <Toggle coach="qs-bluetooth" label="Bluetooth" on={s.bluetoothOn} icon={<BluetoothGlyph size={20} />} onClick={() => d.setSim({ bluetoothOn: !s.bluetoothOn })} />
        <Toggle coach="qs-mute" label="Mute" on={s.muted} icon={<VolumeGlyph size={20} muted />} onClick={() => d.setSim({ muted: !s.muted })} />
      </div>
      <Slider coach="qs-brightness" label="Brightness" icon={<span aria-hidden className="text-base leading-none">☼</span>} value={s.brightness} onChange={(v) => d.setSim({ brightness: v })} />
      <Slider coach="qs-volume" label="Volume" icon={<VolumeGlyph size={18} muted={s.muted} />} value={s.volume} onChange={(v) => d.setSim({ volume: v, muted: false })} />
      <div className={`flex items-center gap-2 text-xs ${th.muted}`}>
        <BatteryGlyph size={16} /> 87%{s.wifiOn ? ` · ${s.wifiNetwork}` : ' · Wi-Fi off'}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- start menu

function StartMenu({ onShutdown, onSleep, onRestart }: { onShutdown: () => void; onSleep: () => void; onRestart: () => void }) {
  const d = useDesktop()
  const th = useTheme()
  const [q, setQ] = useState('')
  const [powerOpen, setPowerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => inputRef.current?.focus(), [])

  const apps = appsFor('windows')
  const query = q.trim().toLowerCase()
  const pinned = apps.filter((a) => PINNED_IDS.includes(a.id) || ['photos', 'bin'].includes(a.id))
  const shownApps = query ? apps.filter((a) => a.title('windows').toLowerCase().includes(query)) : pinned
  const files = useMemo(() => (query ? d.vfs.search(query).filter((n) => n.kind === 'file').slice(0, 6) : []), [query, d.vfs, d.vfsVersion]) // eslint-disable-line react-hooks/exhaustive-deps
  const recent = useMemo(() => {
    const docs = d.vfs.child(d.vfs.home, 'Documents')
    return (docs?.children ?? []).filter((n) => n.kind === 'file' && !n.hidden).sort((a, b) => b.modifiedAt - a.modifiedAt).slice(0, 3)
  }, [d.vfs, d.vfsVersion]) // eslint-disable-line react-hooks/exhaustive-deps

  const openFile = (n: VNode) => {
    d.setUi({ startOpen: false })
    d.openFile(n)
  }

  const power = (kind: 'Sleep' | 'Shut down' | 'Restart') => {
    setPowerOpen(false)
    d.setUi({ startOpen: false })
    if (kind === 'Shut down') onShutdown()
    else if (kind === 'Sleep') onSleep()
    else onRestart()
  }

  return (
    <div data-coach="start-menu" role="dialog" aria-label="Start" className={`absolute bottom-14 left-1/2 flex h-[min(560px,calc(100%-64px))] w-[min(520px,calc(100%-16px))] -translate-x-1/2 flex-col rounded-xl border shadow-2xl backdrop-blur-xl ${th.panel}`} style={{ zIndex: 1050 }} onPointerDown={() => d.closeMenu()}>
      <div className="p-4 pb-2">
        <div className={`flex h-10 items-center gap-2 rounded-full border px-3 ${th.sub} ${th.dark ? 'border-white/15' : 'border-black/10'}`}>
          <SearchGlyph size={16} />
          <input ref={inputRef} data-coach="start-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for apps, settings, and documents" aria-label="Search" className="h-full flex-1 bg-transparent text-sm outline-none placeholder:opacity-60" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {query ? (
          <div>
            <h3 className="px-1 pb-2 text-xs font-semibold">Best match</h3>
            {shownApps.length === 0 && files.length === 0 && <p className={`px-1 text-sm ${th.muted}`}>No results for “{q.trim()}”.</p>}
            <ul className="space-y-1">
              {shownApps.map((a) => (
                <li key={a.id}>
                  <button type="button" data-coach={`start-app-${a.id}`} onClick={() => d.openApp(a.id)} className={`flex h-11 w-full items-center gap-3 rounded-md px-2 text-left ${th.hover}`}>
                    {a.icon({ size: 28 })}
                    <span className="text-sm">{a.title('windows')}</span>
                    <span className={`ml-auto text-xs ${th.muted}`}>App</span>
                  </button>
                </li>
              ))}
              {files.map((n) => (
                <li key={n.id}>
                  <button type="button" data-coach={`start-file-${n.name}`} onClick={() => openFile(n)} className={`flex h-11 w-full items-center gap-3 rounded-md px-2 text-left ${th.hover}`}>
                    <NodeIcon node={n} size={28} />
                    <span className="truncate text-sm">{n.name}</span>
                    <span className={`ml-auto text-xs ${th.muted}`}>File</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <h3 className="px-1 pb-2 text-xs font-semibold">Pinned</h3>
            <div className="grid grid-cols-6 gap-1">
              {shownApps.map((a) => (
                <button key={a.id} type="button" data-coach={`start-app-${a.id}`} onClick={() => d.openApp(a.id)} className={`flex h-[78px] flex-col items-center justify-center gap-1 rounded-md px-1 ${th.hover}`}>
                  {a.icon({ size: 32 })}
                  <span className="w-full truncate text-center text-[11px]">{a.title('windows')}</span>
                </button>
              ))}
            </div>
            <h3 className="px-1 pt-5 pb-2 text-xs font-semibold">Recommended</h3>
            {recent.length === 0 ? (
              <p className={`px-1 text-sm ${th.muted}`}>Files you open will show up here.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-1">
                {recent.map((n) => (
                  <li key={n.id}>
                    <button type="button" data-coach={`start-recent-${n.name}`} onClick={() => openFile(n)} className={`flex h-12 w-full items-center gap-2 rounded-md px-2 text-left ${th.hover}`}>
                      <NodeIcon node={n} size={26} />
                      <span className="truncate text-xs">{n.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className={`relative flex h-14 items-center justify-between rounded-b-xl border-t px-5 ${th.dark ? 'border-white/10 bg-black/20' : 'border-black/10 bg-black/[0.03]'}`}>
        <div className="flex items-center gap-2 text-sm">
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">{d.userName.slice(0, 1).toUpperCase()}</span>
          {d.userName}
        </div>
        <button type="button" data-coach="start-power" aria-label="Power" aria-expanded={powerOpen} onClick={() => setPowerOpen((p) => !p)} className={`flex h-10 w-10 items-center justify-center rounded-md ${th.hover}`}>
          <PowerGlyph size={18} />
        </button>
        {powerOpen && (
          <ul role="menu" data-coach="power-menu" className={`absolute right-3 bottom-14 w-36 rounded-lg border p-1 shadow-xl ${th.panel}`}>
            {(['Sleep', 'Shut down', 'Restart'] as const).map((k) => (
              <li key={k}>
                <button type="button" role="menuitem" data-coach={`power-${k.toLowerCase().replace(' ', '-')}`} onClick={() => power(k)} className={`h-9 w-full rounded-md px-3 text-left text-sm ${th.hover}`}>
                  {k}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- shell

function binDrop(d: DesktopApi) {
  return (n: VNode) => {
    try {
      d.vfs.delete(n)
    } catch (e) {
      d.toast(errorMessageEn(e, d.os))
    }
  }
}

export default function WindowsShell() {
  const d = useDesktop()
  const power = usePower()
  const startRef = useRef<HTMLDivElement>(null)
  const startMenuRef = useRef<HTMLDivElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)
  const wp = wallpaperCss(d.sim.wallpaper)

  useOutside(d.ui.startOpen, [startRef, startMenuRef], () => d.setUi({ startOpen: false }))

  const binFull = d.vfs.binItems().length > 0
  const specials: SpecialIcon[] = [
    { id: 'Recycle Bin', label: 'Recycle Bin', icon: <RecycleBinIcon size={44} full={binFull} />, onOpen: () => d.openApp('bin'), onDropNode: binDrop(d) },
    { id: 'Web Browser', label: 'Web Browser', icon: <BrowserIcon size={44} />, onOpen: () => d.openApp('browser') },
  ]

  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{ background: wp }} />
      <DesktopSurface specials={specials} inset={{ bottom: WINDOWS_INSET.bottom }} />
      <WindowLayer />
      {d.ui.startOpen && (
        <div ref={startMenuRef}>
          <StartMenu onShutdown={power.shutdown} onSleep={power.sleep} onRestart={power.restart} />
        </div>
      )}
      <Taskbar startRef={startRef} trayRef={trayRef} />
      <PowerScreen mode={power.mode} onTurnOn={power.turnOn} onWake={power.wake} />
    </>
  )
}
