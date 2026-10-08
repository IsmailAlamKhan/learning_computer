/** Screenshot shortcuts (Windows: PrtScn, Win+PrtScn, Win+Shift+S; Mac: Cmd+Shift+3/4/5) and the small "Snipping Tool" result viewer. */
import { useState } from 'react'
import { registerApp } from '../registry'
import { registerSystemShortcut } from '../../systemActions'
import { useDesktop } from '../../DesktopContext'
import { getDevices, useDevices } from '../../devices/store'
import { ShotPreview } from '../../devices/ShotPreview'

export const SnipIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect x="5" y="9" width="38" height="30" rx="4" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
    <path d="M14 16h8M14 16v8M34 32h-8M34 32v-8" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export function SnipViewer() {
  const d = useDesktop()
  const { store, state } = useDevices(d)
  const [saved, setSaved] = useState<string | null>(null)
  const clip = state.clip
  return (
    <div className="flex h-full flex-col bg-gray-100 text-sm text-gray-900" data-coach="snip-viewer">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-300 bg-white px-3 py-2">
        <button
          type="button"
          data-coach="snip-save"
          disabled={!clip}
          className="min-h-9 rounded bg-blue-600 px-4 text-white disabled:opacity-40"
          onClick={() => {
            if (clip) setSaved(store.saveShot('win-snip', clip).name)
          }}
        >
          Save
        </button>
        <span className="text-xs text-gray-600" aria-live="polite">
          {saved ? `Saved as ${saved} in Pictures` : clip ? 'This picture is on the clipboard. Press Save to keep it as a file.' : ''}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        {clip ? <ShotPreview shot={clip} className="max-h-full max-w-full rounded border border-gray-300 bg-white shadow" /> : <p className="text-gray-500">Nothing captured yet. Press {d.os === 'windows' ? 'Windows key + Shift + S' : 'Command + Shift + 4'} to take a screenshot.</p>}
      </div>
    </div>
  )
}

export function register() {
  registerApp({
    id: 'snip',
    title: (os) => (os === 'windows' ? 'Snipping Tool' : 'Screenshot'),
    descriptionBn: 'স্ক্রিনের ছবি (স্ক্রিনশট) দেখা ও সেভ করার প্রোগ্রাম',
    icon: ({ size }) => <SnipIcon size={size} />,
    component: SnipViewer,
    defaultSize: { w: 560, h: 400 },
  })
  // Windows
  registerSystemShortcut('windows', 'printscreen', (d) => (getDevices(d).copyToClipboard(), d.toast('Whole screen copied to the clipboard')))
  registerSystemShortcut('windows', 'prtscn', (d) => (getDevices(d).copyToClipboard(), d.toast('Whole screen copied to the clipboard')))
  registerSystemShortcut('windows', 'cmd+printscreen', (d) => void getDevices(d).saveShot('win-prtscn-file'))
  registerSystemShortcut('windows', 'cmd+prtscn', (d) => void getDevices(d).saveShot('win-prtscn-file'))
  registerSystemShortcut('windows', 'shift+cmd+s', (d) => getDevices(d).setShotMode('snip'))
  // Mac (the '#', '$', '%' forms are what a real keyboard reports while Shift is held)
  for (const k of ['3', '#']) registerSystemShortcut('mac', `shift+cmd+${k}`, (d) => getDevices(d).captureMac())
  for (const k of ['4', '$']) registerSystemShortcut('mac', `shift+cmd+${k}`, (d) => getDevices(d).setShotMode('crosshair'))
  for (const k of ['5', '%']) registerSystemShortcut('mac', `shift+cmd+${k}`, (d) => getDevices(d).setShotMode('toolbar'))
}
