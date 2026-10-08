/** Settings (Windows) / System Settings (Mac): simple, functional controls bound to the desktop's sim settings. */
import { useState, type ReactNode } from 'react'
import { useDesktop, type SimSettings } from '../DesktopContext'
import type { WinState } from '../windowManager'
import { WALLPAPERS } from '../wallpapers'
import { InstalledApps } from './extra/installedApps'
import { LanguageRegion, MacKeyboard, TimeTabs } from './extra/keyboardSettings'
import { BluetoothPane, PrintersPane, Toggle, WifiPane } from './extra/devicePanes'

const NAV: { id: string; win: string; mac: string; macOnly?: boolean; winOnly?: boolean }[] = [
  { id: 'display', win: 'Display', mac: 'Displays' },
  { id: 'sound', win: 'Sound', mac: 'Sound' },
  { id: 'network', win: 'Network & internet', mac: 'Wi-Fi' },
  { id: 'bluetooth', win: 'Bluetooth & devices', mac: 'Bluetooth' },
  { id: 'printers', win: 'Printers & scanners', mac: 'Printers & Scanners', macOnly: true },
  { id: 'personalization', win: 'Personalization', mac: 'Wallpaper' },
  { id: 'appearance', win: 'Appearance', mac: 'Appearance', macOnly: true },
  { id: 'accessibility', win: 'Accessibility', mac: 'Accessibility' },
  { id: 'apps', win: 'Apps', mac: 'Apps', winOnly: true },
  { id: 'keyboard', win: 'Keyboard', mac: 'Keyboard', macOnly: true },
  { id: 'time', win: 'Time & language', mac: 'Date & Time' },
  { id: 'about', win: 'About', mac: 'About' },
]

/** Pages that are reached from another page (not in the left list); `parent` is the left-list item that stays highlighted. */
const SUB: Record<string, { parent: string; win: string; mac?: string }> = {
  printers: { parent: 'bluetooth', win: 'Printers & scanners' },
  background: { parent: 'personalization', win: 'Background' },
  colors: { parent: 'personalization', win: 'Colors' },
}

const ZONES = ['Asia/Dhaka', 'Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'America/New_York', 'Australia/Sydney']
const ZONE_LABEL: Record<string, string> = {
  'Asia/Dhaka': '(UTC+06:00) Dhaka',
  'Asia/Kolkata': '(UTC+05:30) Kolkata',
  'Asia/Dubai': '(UTC+04:00) Dubai',
  'Europe/London': '(UTC+00:00) London',
  'America/New_York': '(UTC-05:00) New York',
  'Australia/Sydney': '(UTC+10:00) Sydney',
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 border-b border-gray-100 py-2">
      <div className="min-w-0">
        <div className="font-medium">{label}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function Settings({ win }: { win: WinState }) {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const { sim, setSim } = d
  const initial = typeof win.props?.section === 'string' ? win.props.section : 'display'
  const [section, setSection] = useState(initial)
  const [timeTab, setTimeTab] = useState<'date' | 'language'>('date')
  const nav = NAV.filter((n) => (!n.macOnly || mac) && (!n.winOnly || !mac))
  const set = (p: Partial<SimSettings>) => setSim(p)
  const setVol = (v: number) => {
    set({ volume: v, muted: v === 0 })
    if (v >= 80) d.emit({ type: 'custom', event: 'volume-high' })
  }
  const sel = 'min-h-9 rounded border border-gray-300 bg-white px-2'

  const wallpaperGrid = (
    <>
      <div className="mb-2 font-medium">{mac ? 'Desktop picture' : 'Choose a picture'}</div>
      <div data-coach="settings-wallpaper" className="grid grid-cols-3 gap-3">
        {WALLPAPERS.map((bg, i) => (
          <button key={i} type="button" aria-label={`Wallpaper ${i + 1}`} aria-pressed={sim.wallpaper === i} data-coach={`settings-wallpaper-${i}`} onClick={() => set({ wallpaper: i })} className={`h-20 rounded-lg border-2 ${sim.wallpaper === i ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent'}`} style={{ background: bg }} />
        ))}
      </div>
    </>
  )

  const body = (() => {
    switch (section) {
      case 'display':
        return (
          <>
            <Row label="Brightness" hint={`${sim.brightness}%`}>
              <input type="range" min={0} max={100} value={sim.brightness} data-coach="settings-brightness" aria-label="Brightness" onChange={(e) => set({ brightness: Number(e.target.value) })} className="h-9 w-40" />
            </Row>
            <Row label={mac ? 'Display size' : 'Scale'} hint={mac ? 'Larger text ↔ more space. Make everything bigger or smaller' : 'Make text, apps and icons bigger or smaller'}>
              <select data-coach="settings-zoom" aria-label="Zoom" value={sim.zoom} onChange={(e) => set({ zoom: Number(e.target.value) })} className={sel}>
                {[100, 125, 150, 175].map((z) => (
                  <option key={z} value={z}>
                    {z}%
                  </option>
                ))}
              </select>
            </Row>
          </>
        )
      case 'sound':
        return (
          <>
            <Row label="Volume" hint={sim.muted ? 'Muted' : `${sim.volume}%`}>
              <input type="range" min={0} max={100} value={sim.volume} data-coach="settings-volume" aria-label="Volume" onChange={(e) => setVol(Number(e.target.value))} className="h-9 w-40" />
            </Row>
            <Row label={mac ? 'Mute' : 'Mute'} hint="Turn all sound off">
              <Toggle mac={mac} coach="settings-muted" label="Mute" checked={sim.muted} onChange={(v) => set({ muted: v })} />
            </Row>
          </>
        )
      case 'network':
        return <WifiPane />
      case 'bluetooth':
        return <BluetoothPane goto={setSection} />
      case 'printers':
        return <PrintersPane />
      case 'accessibility':
        return (
          <Row label="Text size" hint={mac ? 'Accessibility → Display → Text size' : 'Make text on screen bigger (this practice computer enlarges everything)'}>
            <select data-coach="settings-textsize" aria-label="Text size" value={sim.zoom} onChange={(e) => set({ zoom: Number(e.target.value) })} className={sel}>
              {[100, 125, 150, 175].map((z) => (
                <option key={z} value={z}>
                  {z}%
                </option>
              ))}
            </select>
          </Row>
        )
      case 'personalization':
        if (!mac)
          return (
            <div className="space-y-2">
              {[['background', 'Background', 'Background image, color, slideshow'], ['colors', 'Colors', 'Accent color, transparency effects, dark mode']].map(([id, t, h]) => (
                <button key={id} type="button" data-coach={`settings-link-${id}`} onClick={() => setSection(id)} className="flex min-h-14 w-full items-center gap-3 rounded border border-gray-200 px-4 text-left hover:bg-gray-50">
                  <span className="flex-1">
                    <span className="block font-medium">{t}</span>
                    <span className="block text-xs text-gray-500">{h}</span>
                  </span>
                  <span aria-hidden>›</span>
                </button>
              ))}
            </div>
          )
        return wallpaperGrid
      case 'background':
        return wallpaperGrid
      case 'colors':
        return (
          <Row label="Choose your mode" hint="Light or dark for Windows and apps">
            <select data-coach="settings-mode" aria-label="Choose your mode" value={sim.darkMode ? 'Dark' : 'Light'} onChange={(e) => set({ darkMode: e.target.value === 'Dark' })} className={sel}>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </Row>
        )
      case 'appearance':
        return (
          <Row label="Dark appearance" hint="Use a dark look for windows and menus">
            <Toggle mac={mac} coach="settings-darkMode" label="Dark mode" checked={sim.darkMode} onChange={(v) => set({ darkMode: v })} />
          </Row>
        )
      case 'apps':
        return <InstalledApps />
      case 'keyboard':
        return <MacKeyboard />
      case 'time':
        if (!mac && timeTab === 'language') return <><TimeTabs tab={timeTab} setTab={setTimeTab} /><LanguageRegion /></>
        return (
          <>
            {!mac && <TimeTabs tab={timeTab} setTab={setTimeTab} />}
            <Row label="Time zone">
              <select data-coach="settings-timezone" aria-label="Time zone" value={sim.timezone} onChange={(e) => set({ timezone: e.target.value })} className={sel}>
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {ZONE_LABEL[z] ?? z}
                  </option>
                ))}
              </select>
            </Row>
            {mac && (
              <Row label="24-hour time" hint="Show 13:00 instead of 1:00 PM">
                <Toggle mac={mac} coach="settings-clock24" label="24-hour time" checked={sim.clock24} onChange={(v) => set({ clock24: v })} />
              </Row>
            )}
            <Row label="Language">
              <select data-coach="settings-language" aria-label="Language" value={sim.language} onChange={(e) => set({ language: e.target.value as SimSettings['language'] })} className={sel}>
                <option value="English">English</option>
                <option value="বাংলা">বাংলা</option>
              </select>
            </Row>
          </>
        )
      default:
        return (
          <dl data-coach="settings-about" className="grid grid-cols-[9rem_1fr] gap-y-3 text-sm">
            <dt className="text-gray-500">Device name</dt>
            <dd>{mac ? `${d.userName}’s Practice Mac` : `${d.userName.toUpperCase()}-PRACTICE-PC`}</dd>
            <dt className="text-gray-500">User name</dt>
            <dd>{d.userName}</dd>
            <dt className="text-gray-500">Device type</dt>
            <dd>Practice computer</dd>
            <dt className="text-gray-500">Wi-Fi network</dt>
            <dd>{sim.wifiOn ? sim.wifiNetwork : 'Not connected'}</dd>
          </dl>
        )
    }
  })()

  const sub = SUB[section]
  const parentId = sub && !(mac && section === 'printers') ? sub.parent : section
  const current = sub && !(mac && section === 'printers') ? { id: section, win: sub.win, mac: sub.mac ?? sub.win } : (nav.find((n) => n.id === section) ?? nav[0])
  const parent = nav.find((n) => n.id === parentId) ?? nav[0]
  return (
    <div className="flex h-full text-sm text-gray-900">
      <nav aria-label="Settings sections" className={`w-52 shrink-0 overflow-y-auto border-r border-gray-200 p-2 ${mac ? 'bg-[#f1f1f1]' : 'bg-[#f3f3f3]'}`}>
        {nav.map((n) => (
          <button key={n.id} type="button" data-coach={`settings-nav-${n.id}`} aria-current={parentId === n.id} onClick={() => setSection(n.id)} className={`flex min-h-10 w-full items-center rounded px-3 text-left ${parentId === n.id ? (mac ? 'bg-blue-500 text-white' : 'bg-white font-medium shadow-sm') : 'hover:bg-black/5'}`}>
            {mac ? n.mac : n.win}
          </button>
        ))}
      </nav>
      <main className="min-w-0 flex-1 overflow-auto p-5">
        <h1 className="mb-3 text-xl font-semibold">
          {parentId !== current.id && (
            <>
              <button type="button" data-coach="settings-crumb" onClick={() => setSection(parentId)} className="text-gray-500 hover:underline">
                {mac ? parent.mac : parent.win}
              </button>
              <span className="mx-2 text-gray-400" aria-hidden>
                ›
              </span>
            </>
          )}
          {mac ? current.mac : current.win}
        </h1>
        {body}
      </main>
    </div>
  )
}
