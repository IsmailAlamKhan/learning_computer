/** Settings (Windows) / System Settings (Mac): simple, functional controls bound to the desktop's sim settings. */
import { useState, type ReactNode } from 'react'
import { useDesktop, type SimSettings } from '../DesktopContext'
import type { WinState } from '../windowManager'
import { WifiGlyph } from '../ui/icons'
import { WALLPAPERS } from '../wallpapers'
import { InstalledApps } from './extra/installedApps'
import { LanguageRegion, MacKeyboard, TimeTabs } from './extra/keyboardSettings'

const NAV: { id: string; win: string; mac: string; macOnly?: boolean; winOnly?: boolean }[] = [
  { id: 'display', win: 'Display', mac: 'Displays' },
  { id: 'sound', win: 'Sound', mac: 'Sound' },
  { id: 'network', win: 'Network & internet', mac: 'Wi-Fi' },
  { id: 'bluetooth', win: 'Bluetooth & devices', mac: 'Bluetooth' },
  { id: 'personalization', win: 'Personalization', mac: 'Wallpaper' },
  { id: 'appearance', win: 'Appearance', mac: 'Appearance', macOnly: true },
  { id: 'apps', win: 'Apps', mac: 'Apps', winOnly: true },
  { id: 'keyboard', win: 'Keyboard', mac: 'Keyboard', macOnly: true },
  { id: 'time', win: 'Time & language', mac: 'Date & Time' },
  { id: 'about', win: 'About', mac: 'About' },
]

const NETWORKS = [
  { name: 'HomeWiFi', secure: true, signal: 4 },
  { name: 'Neighbour_5G', secure: true, signal: 2 },
  { name: 'CafeGuest', secure: false, signal: 3 },
  { name: 'Office-Net', secure: true, signal: 1 },
]

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

function Toggle({ coach, checked, onChange, label, mac }: { coach: string; checked: boolean; onChange: (v: boolean) => void; label: string; mac: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {!mac && <span className="w-7 text-right text-xs text-gray-600">{checked ? 'On' : 'Off'}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        data-coach={coach}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full border transition-colors ${checked ? (mac ? 'border-green-600 bg-green-500' : 'border-blue-600 bg-blue-600') : 'border-gray-400 bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-all ${checked ? 'left-5.5' : 'left-0.5 border border-gray-400'}`} />
      </button>
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
  const sel = 'min-h-9 rounded border border-gray-300 bg-white px-2'

  const body = (() => {
    switch (section) {
      case 'display':
        return (
          <>
            <Row label="Brightness" hint={`${sim.brightness}%`}>
              <input type="range" min={0} max={100} value={sim.brightness} data-coach="settings-brightness" aria-label="Brightness" onChange={(e) => set({ brightness: Number(e.target.value) })} className="h-9 w-48" />
            </Row>
            <Row label={mac ? 'Text size' : 'Scale'} hint="Make everything bigger or smaller">
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
              <input type="range" min={0} max={100} value={sim.volume} data-coach="settings-volume" aria-label="Volume" onChange={(e) => set({ volume: Number(e.target.value) })} className="h-9 w-48" />
            </Row>
            <Row label={mac ? 'Mute' : 'Mute'} hint="Turn all sound off">
              <Toggle mac={mac} coach="settings-muted" label="Mute" checked={sim.muted} onChange={(v) => set({ muted: v })} />
            </Row>
          </>
        )
      case 'network':
        return (
          <>
            <Row label="Wi-Fi" hint={sim.wifiOn ? `Connected to ${sim.wifiNetwork}` : 'Off'}>
              <Toggle mac={mac} coach="settings-wifiOn" label="Wi-Fi" checked={sim.wifiOn} onChange={(v) => set({ wifiOn: v })} />
            </Row>
            {sim.wifiOn && (
              <div className="mt-3" data-coach="settings-networks">
                <div className="mb-1 text-xs font-semibold text-gray-500">{mac ? 'Known and nearby networks' : 'Available networks'}</div>
                {NETWORKS.map((n) => (
                  <button key={n.name} type="button" data-coach={`settings-network-${n.name}`} onClick={() => set({ wifiNetwork: n.name })} className={`flex min-h-11 w-full items-center gap-3 rounded px-3 text-left hover:bg-gray-100 ${sim.wifiNetwork === n.name ? 'bg-sky-50' : ''}`}>
                    <WifiGlyph size={18} />
                    <span className="flex-1">{n.name}</span>
                    {n.secure && <span className="text-xs text-gray-500">Secured</span>}
                    {sim.wifiNetwork === n.name && <span className="text-xs font-medium text-green-700">Connected</span>}
                  </button>
                ))}
              </div>
            )}
          </>
        )
      case 'bluetooth':
        return (
          <Row label="Bluetooth" hint={sim.bluetoothOn ? 'Discoverable as “Practice computer”' : 'Off'}>
            <Toggle mac={mac} coach="settings-bluetoothOn" label="Bluetooth" checked={sim.bluetoothOn} onChange={(v) => set({ bluetoothOn: v })} />
          </Row>
        )
      case 'personalization':
        return (
          <>
            <div className="mb-2 font-medium">{mac ? 'Desktop picture' : 'Background'}</div>
            <div data-coach="settings-wallpaper" className="grid grid-cols-3 gap-3">
              {WALLPAPERS.map((bg, i) => (
                <button key={i} type="button" aria-label={`Wallpaper ${i + 1}`} aria-pressed={sim.wallpaper === i} data-coach={`settings-wallpaper-${i}`} onClick={() => set({ wallpaper: i })} className={`h-20 rounded-lg border-2 ${sim.wallpaper === i ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent'}`} style={{ background: bg }} />
              ))}
            </div>
            {!mac && (
              <Row label="Choose your mode" hint="Dark mode makes windows dark">
                <Toggle mac={mac} coach="settings-darkMode" label="Dark mode" checked={sim.darkMode} onChange={(v) => set({ darkMode: v })} />
              </Row>
            )}
          </>
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
            <Row label="24-hour time" hint="Show 13:00 instead of 1:00 PM">
              <Toggle mac={mac} coach="settings-clock24" label="24-hour time" checked={sim.clock24} onChange={(v) => set({ clock24: v })} />
            </Row>
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

  const current = nav.find((n) => n.id === section) ?? nav[0]
  return (
    <div className="flex h-full text-sm text-gray-900">
      <nav aria-label="Settings sections" className={`w-52 shrink-0 overflow-y-auto border-r border-gray-200 p-2 ${mac ? 'bg-[#f1f1f1]' : 'bg-[#f3f3f3]'}`}>
        {nav.map((n) => (
          <button key={n.id} type="button" data-coach={`settings-nav-${n.id}`} aria-current={section === n.id} onClick={() => setSection(n.id)} className={`flex min-h-10 w-full items-center rounded px-3 text-left ${section === n.id ? (mac ? 'bg-blue-500 text-white' : 'bg-white font-medium shadow-sm') : 'hover:bg-black/5'}`}>
            {mac ? n.mac : n.win}
          </button>
        ))}
      </nav>
      <main className="min-w-0 flex-1 overflow-auto p-5">
        <h1 className="mb-3 text-xl font-semibold">{mac ? current.mac : current.win}</h1>
        {body}
      </main>
    </div>
  )
}
