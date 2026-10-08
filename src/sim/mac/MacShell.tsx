/** Simulated macOS-style desktop: wallpaper, menu bar, Dock, Launchpad, Spotlight. Generic look-alike, no logos. */
import { InputIndicator } from '../ui/InputIndicator'
import { useEffect, useState } from 'react'
import { PowerScreen, usePower } from '../ui/PowerScreen'
import { useDesktop, type MenuItem } from '../DesktopContext'
import { getApp } from '../apps/registry'
import { DesktopSurface } from '../ui/DesktopSurface'
import { WindowLayer } from '../ui/WindowLayer'
import { BatteryGlyph, SearchGlyph, SystemMark, VolumeGlyph, WifiGlyph } from '../ui/icons'
import { BarMenu } from './MacMenus'
import { MacDock } from './MacDock'
import { Launchpad, Spotlight } from './MacOverlays'
import { MAC_WALLPAPERS } from './wallpapers'
import { wallpaperCss } from '../wallpapers'

export const MAC_INSET = { top: 28, bottom: 80 }
export { MAC_WALLPAPERS }

function formatClock(now: Date, tz: string, clock24: boolean) {
  const mk = (timeZone?: string) => {
    const date = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', month: 'short', day: 'numeric' }).format(now)
    const time = new Intl.DateTimeFormat('en-US', { timeZone, hour: clock24 ? '2-digit' : 'numeric', minute: '2-digit', hour12: !clock24 }).format(now)
    return `${date}  ${time}`
  }
  try {
    return mk(tz)
  } catch {
    return mk()
  }
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

function Slider({ coach, label, value, onChange }: { coach: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-xs text-gray-600">
      {label}
      <input data-coach={coach} type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 block h-6 w-full" />
    </label>
  )
}

function Toggle({ coach, label, on, onClick }: { coach: string; label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" data-coach={coach} aria-pressed={on} className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm ${on ? 'bg-sky-500 text-white' : 'bg-black/10 text-gray-800'}`} onClick={onClick}>
      {label}
    </button>
  )
}

function ControlCenter() {
  const d = useDesktop()
  const open = d.ui.openMenu === 'control-center'
  return (
    <div className="relative h-full">
      <button
        type="button"
        data-coach="control-center"
        aria-label="Control Center"
        aria-expanded={open}
        className={`flex h-full items-center rounded px-2 ${open ? 'bg-black/20' : 'hover:bg-black/10'}`}
        onClick={() => d.setUi({ openMenu: open ? null : 'control-center' })}
        onMouseEnter={() => {
          if (d.ui.openMenu && d.ui.openMenu !== 'control-center') d.setUi({ openMenu: 'control-center' })
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="8" cy="16" r="2" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 z-[1001] mt-1 w-72 space-y-3 rounded-2xl border border-black/10 bg-white/90 p-3 text-gray-900 shadow-xl backdrop-blur-xl">
          <div className="flex gap-2">
            <Toggle coach="cc-wifi" label={d.sim.wifiOn ? `Wi-Fi: ${d.sim.wifiNetwork}` : 'Wi-Fi: Off'} on={d.sim.wifiOn} onClick={() => d.setSim({ wifiOn: !d.sim.wifiOn })} />
            <Toggle coach="cc-bluetooth" label={d.sim.bluetoothOn ? 'Bluetooth: On' : 'Bluetooth: Off'} on={d.sim.bluetoothOn} onClick={() => d.setSim({ bluetoothOn: !d.sim.bluetoothOn })} />
          </div>
          <Slider coach="cc-brightness" label="Display" value={d.sim.brightness} onChange={(v) => d.setSim({ brightness: v })} />
          <Slider coach="cc-volume" label="Sound" value={d.sim.muted ? 0 : d.sim.volume} onChange={(v) => d.setSim({ volume: v, muted: v === 0 })} />
        </div>
      )}
    </div>
  )
}

export default function MacShell() {
  const d = useDesktop()
  const now = useNow()
  const power = usePower()
  const { setUi } = d
  const menuOpen = d.ui.openMenu !== null
  // clicking anywhere outside the menu bar closes an open menu (no backdrop, so the click still reaches what is underneath)
  useEffect(() => {
    if (!menuOpen) return
    const down = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-coach="menubar"]')) setUi({ openMenu: null })
    }
    window.addEventListener('pointerdown', down, true)
    return () => window.removeEventListener('pointerdown', down, true)
  }, [menuOpen, setUi])
  const activeApp = d.active && !d.active.minimized ? getApp(d.active.app) : undefined
  const appName = activeApp ? activeApp.title('mac') : 'Finder'
  const isFinder = !d.active || d.active.app === 'files'
  const dark = d.sim.darkMode
  const key = (combo: string) => () => void d.dispatchCombo(combo)
  const soon = (t: string) => () => d.toast(t)

  const systemItems: MenuItem[] = [
    { id: 'about-mac', label: 'About This Mac', onSelect: soon('This is a practice computer. Nothing here can harm your real one.') },
    { separator: true },
    { id: 'system-settings', label: 'System Settings…', onSelect: () => d.openApp('settings') },
    { separator: true },
    { id: 'sleep', label: 'Sleep', onSelect: power.sleep },
    { id: 'restart', label: 'Restart…', onSelect: power.restart },
    { id: 'shutdown', label: 'Shut Down…', onSelect: power.shutdown },
    { separator: true },
    { id: 'lock-screen', label: 'Lock Screen', shortcut: '⌃⌘Q', onSelect: () => d.setUi({ locked: true }) },
    { id: 'log-out', label: `Log Out ${d.userName}…`, onSelect: soon('You would be logged out now.') },
  ]
  const appItems: MenuItem[] = [
    { id: 'about-app', label: `About ${appName}`, onSelect: soon(`${appName} — part of your practice computer.`) },
    { separator: true },
    { id: 'quit', label: `Quit ${appName}`, shortcut: '⌘Q', disabled: !d.active, onSelect: () => d.active && d.closeApp(d.active.app) },
  ]
  const fileItems: MenuItem[] = [
    { id: 'new-folder', label: 'New Folder', shortcut: '⇧⌘N', disabled: !isFinder, onSelect: () => d.runSystemAction('newFolder') },
    { id: 'new-window', label: 'New Finder Window', shortcut: '⌘N', disabled: !isFinder, onSelect: () => d.openApp('files', { newWindow: true }) },
    { separator: true },
    { id: 'close-window', label: 'Close Window', shortcut: '⌘W', disabled: !d.active, onSelect: () => d.active && d.closeWindow(d.active.id) },
  ]
  const editItems: MenuItem[] = [
    { id: 'undo', label: 'Undo', shortcut: '⌘Z', onSelect: key('cmd+z') },
    { separator: true },
    { id: 'cut', label: 'Cut', shortcut: '⌘X', onSelect: key('cmd+x') },
    { id: 'copy', label: 'Copy', shortcut: '⌘C', onSelect: key('cmd+c') },
    { id: 'paste', label: 'Paste', shortcut: '⌘V', onSelect: key('cmd+v') },
    { id: 'select-all', label: 'Select All', shortcut: '⌘A', onSelect: key('cmd+a') },
  ]
  const viewItems: MenuItem[] = [
    { id: 'view-launchpad', label: 'Show Launchpad', shortcut: 'F4', onSelect: () => d.setUi({ launchpadOpen: true }) },
    { id: 'view-spotlight', label: 'Spotlight Search', shortcut: '⌘Space', onSelect: () => d.setUi({ spotlightOpen: true }) },
    { separator: true },
    { id: 'view-fullscreen', label: 'Enter Full Screen', onSelect: soon('Use the green button on a window to make it bigger.') },
  ]
  const windowItems: MenuItem[] = [
    { id: 'minimize', label: 'Minimize', shortcut: '⌘M', disabled: !d.active, onSelect: () => d.active && d.wmDispatch({ type: 'minimize', id: d.active.id }) },
    { id: 'zoom', label: 'Zoom', disabled: !d.active, onSelect: () => d.active && d.wmDispatch({ type: 'toggleMaximize', id: d.active.id }) },
    ...(d.wm.windows.length ? [{ separator: true } as MenuItem] : []),
    ...d.wm.windows.map<MenuItem>((w) => ({ id: `window-${w.id}`, label: w.title, checked: d.active?.id === w.id, onSelect: () => d.wmDispatch({ type: 'focus', id: w.id }) })),
  ]
  const helpItems: MenuItem[] = [
    { id: 'help-search', label: 'Search', onSelect: () => d.setUi({ spotlightOpen: true }) },
    { id: 'help-mac', label: 'macOS Help', onSelect: soon('This practice computer has no help pages — ask your lesson!') },
  ]

  return (
    <>
      <div className="absolute inset-0" style={{ background: wallpaperCss(d.sim.wallpaper) }} data-wallpaper={d.sim.wallpaper} />
      <DesktopSurface fromRight inset={{ top: 28, bottom: 80 }} specials={[]} onBackgroundPointerDown={() => d.setUi({ openMenu: null })} />
      <WindowLayer />

      <div
        data-coach="menubar"
        role="menubar"
        className={`absolute top-0 right-0 left-0 z-[1000] flex h-7 items-center justify-between px-2 backdrop-blur-xl ${dark ? 'bg-gray-900/55 text-white' : 'bg-white/55 text-gray-900'}`}
      >
        <div className="flex h-full items-center">
          <BarMenu id="menu-system" label={<SystemMark size={16} />} items={systemItems} />
          <BarMenu id="menu-app" label={appName} bold items={appItems} />
          <BarMenu id="menu-file" label="File" items={fileItems} />
          <BarMenu id="menu-edit" label="Edit" items={editItems} />
          <BarMenu id="menu-view" label="View" items={viewItems} />
          <BarMenu id="menu-window" label="Window" items={windowItems} />
          <BarMenu id="menu-help" label="Help" items={helpItems} />
        </div>
        <div className="flex h-full items-center gap-0.5 text-[13px]">
          <InputIndicator mac />
          <button type="button" data-coach="menubar-battery" aria-label="Battery 100%" className="flex h-full items-center px-1.5" onClick={() => d.setUi({ openMenu: null })}>
            <BatteryGlyph size={18} />
          </button>
          <button type="button" data-coach="menubar-wifi" aria-label="Wi-Fi" className="flex h-full items-center px-1.5" onClick={() => d.setUi({ openMenu: 'control-center' })}>
            <WifiGlyph size={16} off={!d.sim.wifiOn} />
          </button>
          <button type="button" data-coach="menubar-volume" aria-label="Sound" className="flex h-full items-center px-1.5" onClick={() => d.setUi({ openMenu: 'control-center' })}>
            <VolumeGlyph size={16} muted={d.sim.muted || d.sim.volume === 0} />
          </button>
          <button type="button" data-coach="menubar-search" aria-label="Spotlight Search" aria-pressed={d.ui.spotlightOpen} className="flex h-full items-center px-1.5" onClick={() => d.setUi({ spotlightOpen: !d.ui.spotlightOpen, openMenu: null })}>
            <SearchGlyph size={16} />
          </button>
          <ControlCenter />
          <span data-coach="menubar-clock" className="px-2 whitespace-pre">
            {formatClock(now, d.sim.timezone, d.sim.clock24)}
          </span>
        </div>
      </div>

      <MacDock />
      {d.ui.launchpadOpen && <Launchpad />}
      {d.ui.spotlightOpen && <Spotlight />}

      <PowerScreen mode={power.mode} onTurnOn={power.turnOn} onWake={power.wake} />
    </>
  )
}
