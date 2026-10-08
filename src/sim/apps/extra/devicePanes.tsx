/** Settings panes for Wi-Fi (password prompt), Bluetooth (pairing), Printers and Accessibility text size. Used by ../Settings.tsx. */
import { useState } from 'react'
import { useDesktop } from '../../DesktopContext'
import { PrinterIcon } from '../../ui/icons'
import { BluetoothGlyph, WifiGlyph } from '../../ui/icons'
import { Row, Sheet, btn, btnPrimary } from './keyboardSettings'

/** The fictional practice password for every secured network in the practice computer (shown on screen on purpose). */
export const PRACTICE_PASSWORD = 'practice123'

export const NETWORKS = [
  { name: 'HomeWiFi', secure: true, signal: 4 },
  { name: 'PracticeNet', secure: true, signal: 4 },
  { name: 'Neighbour_5G', secure: true, signal: 2 },
  { name: 'CafeGuest', secure: false, signal: 3 },
  { name: 'Office-Net', secure: true, signal: 1 },
]

export const BT_DEVICES = ['Practice Speaker', 'Practice Keyboard']
export const PRINTER_CHOICES = [
  { name: 'Practice Inkjet', note: 'Wi-Fi printer · ready' },
  { name: 'Office Laser', note: 'Network printer · ready' },
]

export function Toggle({ coach, checked, onChange, label, mac }: { coach: string; checked: boolean; onChange: (v: boolean) => void; label: string; mac: boolean }) {
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

// ------------------------------------------------------------------ Wi-Fi

export function WifiPane() {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const { sim, setSim } = d
  const [pick, setPick] = useState<string | null>(null)
  const [asking, setAsking] = useState(false)
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const net = NETWORKS.find((n) => n.name === pick)

  const reset = () => {
    setPick(null)
    setAsking(false)
    setPw('')
    setShow(false)
    setError('')
  }
  const finish = (name: string) => {
    setSim({ wifiNetwork: name })
    d.emit({ type: 'custom', event: 'wifi-connected' })
    d.toast(`Connected to ${name}`)
    reset()
  }
  const choose = (name: string) => {
    if (name === sim.wifiNetwork) return
    const n = NETWORKS.find((x) => x.name === name)
    setPick(name)
    setPw('')
    setError('')
    setAsking(mac && !!n?.secure) // Mac opens the password box straight away; Windows first shows a Connect button
  }
  const submit = () => {
    if (!net) return
    if (!net.secure) return finish(net.name)
    if (pw === PRACTICE_PASSWORD) return finish(net.name)
    setError(pw ? 'That password isn’t right. Please check it and try again.' : 'Please type the password first.')
    d.emit({ type: 'custom', event: 'wifi-wrong-password' })
  }
  const pwInput = (
    <>
      <input
        data-coach="settings-wifi-password"
        aria-label={mac ? 'Password' : 'Network security key'}
        type={show ? 'text' : 'password'}
        autoComplete="off"
        value={pw}
        onChange={(e) => {
          setPw(e.target.value)
          setError('')
        }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className="min-h-9 w-full rounded border border-gray-400 px-2"
      />
      <label className="mt-1 flex min-h-9 items-center gap-2 text-xs">
        <input type="checkbox" data-coach="settings-wifi-show" checked={show} onChange={(e) => setShow(e.target.checked)} /> {mac ? 'Show Password' : 'Show characters'}
      </label>
      <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900">Practice password for this practice computer: <b data-coach="settings-wifi-practice">{PRACTICE_PASSWORD}</b></p>
      {error && (
        <p role="alert" data-coach="settings-wifi-error" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </>
  )

  return (
    <>
      <Row label="Wi-Fi" hint={sim.wifiOn ? `Connected to ${sim.wifiNetwork}` : 'Off'}>
        <Toggle mac={mac} coach="settings-wifiOn" label="Wi-Fi" checked={sim.wifiOn} onChange={(v) => (reset(), setSim({ wifiOn: v }))} />
      </Row>
      {sim.wifiOn && (
        <div className="mt-3" data-coach="settings-networks">
          <div className="mb-1 text-xs font-semibold text-gray-500">{mac ? 'Other Networks' : 'Available networks'}</div>
          {NETWORKS.map((n) => {
            const current = sim.wifiNetwork === n.name
            const open = !mac && pick === n.name
            return (
              <div key={n.name} className={`rounded ${open ? 'bg-sky-50' : ''}`}>
                <button type="button" data-coach={`settings-network-${n.name}`} onClick={() => choose(n.name)} className={`flex min-h-11 w-full items-center gap-3 rounded px-3 text-left hover:bg-gray-100 ${current ? 'bg-sky-50' : ''}`}>
                  <WifiGlyph size={18} />
                  <span className="flex-1">
                    {n.name}
                    {current && <span className="block text-xs text-green-700">{n.secure ? 'Connected, secured' : 'Connected'}</span>}
                  </span>
                  {n.secure && !current && <span className="text-xs text-gray-500">Secured</span>}
                  {current && <span className="text-xs font-medium text-green-700">Connected</span>}
                </button>
                {open && !asking && (
                  <div className="px-3 pb-3">
                    <button type="button" data-coach="settings-wifi-connect" onClick={() => (n.secure ? setAsking(true) : submit())} className={btnPrimary}>
                      Connect
                    </button>
                  </div>
                )}
                {open && asking && (
                  <div className="px-3 pb-3" data-coach="settings-wifi-key-box">
                    <div className="mb-1 text-xs text-gray-700">Enter the network security key</div>
                    {pwInput}
                    <div className="mt-2 flex gap-2">
                      <button type="button" data-coach="settings-wifi-next" onClick={submit} className={btnPrimary}>
                        Next
                      </button>
                      <button type="button" onClick={reset} className={btn}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {mac && asking && net && (
        <Sheet
          mac
          title={`Enter the password for the Wi-Fi network “${net.name}”`}
          coach="settings-wifi-dialog"
          footer={
            <>
              <button type="button" className={btn} onClick={reset}>
                Cancel
              </button>
              <button type="button" data-coach="settings-wifi-join" className={btnPrimary} onClick={submit}>
                Join
              </button>
            </>
          }
        >
          {pwInput}
        </Sheet>
      )}
    </>
  )
}

// ------------------------------------------------------------------ Bluetooth

export function BluetoothPane({ goto }: { goto: (section: string) => void }) {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const { sim, setSim } = d
  const paired = sim.pairedDevices ?? []
  const [dlg, setDlg] = useState<null | 'kind' | 'scan' | 'done'>(null)
  const [last, setLast] = useState('')
  const pair = (name: string) => {
    setSim({ pairedDevices: [...new Set([...paired, name])] })
    d.emit({ type: 'custom', event: 'bluetooth-paired' })
    if (!mac) {
      setLast(name)
      setDlg('done')
    }
  }
  const unpair = (name: string) => setSim({ pairedDevices: paired.filter((x) => x !== name) })
  return (
    <>
      <Row label="Bluetooth" hint={sim.bluetoothOn ? 'Discoverable as “Practice computer”' : 'Off'}>
        <Toggle mac={mac} coach="settings-bluetoothOn" label="Bluetooth" checked={sim.bluetoothOn} onChange={(v) => setSim({ bluetoothOn: v })} />
      </Row>
      {mac ? (
        <div className="mt-3" data-coach="settings-bt-list">
          <div className="mb-1 text-xs font-semibold text-gray-500">{sim.bluetoothOn ? 'Nearby Devices' : 'Turn Bluetooth on to see nearby devices'}</div>
          {sim.bluetoothOn &&
            BT_DEVICES.map((n) => (
              <div key={n} className="flex min-h-12 items-center gap-3 border-b border-gray-100 px-1">
                <BluetoothGlyph size={18} />
                <span className="flex-1">
                  {n}
                  <span className="block text-xs text-gray-500">{paired.includes(n) ? 'Connected' : 'Not Connected'}</span>
                </span>
                {paired.includes(n) ? (
                  <button type="button" className={btn} data-coach={`settings-bt-disconnect-${n}`} onClick={() => unpair(n)}>
                    Disconnect
                  </button>
                ) : (
                  <button type="button" className={btnPrimary} data-coach={`settings-bt-connect-${n}`} onClick={() => pair(n)}>
                    Connect
                  </button>
                )}
              </div>
            ))}
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-medium">Devices</div>
            <button type="button" data-coach="settings-bt-add" className={btn} disabled={!sim.bluetoothOn} style={{ opacity: sim.bluetoothOn ? 1 : 0.5 }} onClick={() => setDlg('kind')}>
              Add device
            </button>
          </div>
          {!sim.bluetoothOn && <p className="mt-1 text-xs text-gray-500">Turn Bluetooth on first, then choose Add device.</p>}
          <ul data-coach="settings-bt-list" className="mt-2 divide-y divide-gray-100 rounded border border-gray-200">
            {paired.length === 0 && <li className="px-3 py-3 text-gray-500">No Bluetooth devices added yet.</li>}
            {paired.map((n) => (
              <li key={n} className="flex min-h-12 items-center gap-3 px-3" data-coach={`settings-bt-paired-${n}`}>
                <BluetoothGlyph size={18} />
                <span className="flex-1">
                  {n}
                  <span className="block text-xs text-green-700">Connected</span>
                </span>
                <button type="button" className="min-h-9 rounded px-3 hover:bg-gray-100" onClick={() => unpair(n)} aria-label={`Remove ${n}`}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button type="button" data-coach="settings-link-printers" onClick={() => goto('printers')} className="mt-4 flex min-h-12 w-full items-center gap-3 rounded border border-gray-200 px-3 text-left hover:bg-gray-50">
            <PrinterIcon size={24} />
            <span className="flex-1">
              Printers &amp; scanners
              <span className="block text-xs text-gray-500">Preferences, troubleshoot</span>
            </span>
            <span aria-hidden>›</span>
          </button>
        </>
      )}
      {!mac && dlg === 'kind' && (
        <Sheet mac={false} title="Add a device" coach="settings-bt-dialog" footer={<button type="button" className={btn} onClick={() => setDlg(null)}>Cancel</button>}>
          <p className="mb-2 text-xs text-gray-600">Choose the kind of device you want to add.</p>
          <button type="button" data-coach="settings-bt-kind" onClick={() => setDlg('scan')} className="flex min-h-14 w-full items-center gap-3 rounded border border-gray-200 px-3 text-left hover:bg-gray-50">
            <BluetoothGlyph size={22} />
            <span>
              Bluetooth
              <span className="block text-xs text-gray-500">Mice, keyboards, pens, audio devices, controllers and more</span>
            </span>
          </button>
        </Sheet>
      )}
      {!mac && dlg === 'scan' && (
        <Sheet mac={false} title="Add a device" coach="settings-bt-scan" footer={<button type="button" className={btn} onClick={() => setDlg(null)}>Cancel</button>}>
          <p className="mb-2 text-xs text-gray-600">Make sure your device is turned on and discoverable. Select a device below to connect.</p>
          {BT_DEVICES.map((n) => (
            <button key={n} type="button" data-coach={`settings-bt-device-${n}`} onClick={() => pair(n)} className="flex min-h-12 w-full items-center gap-3 rounded px-3 text-left hover:bg-gray-100">
              <BluetoothGlyph size={18} />
              {n}
            </button>
          ))}
        </Sheet>
      )}
      {!mac && dlg === 'done' && (
        <Sheet mac={false} title="Your device is ready to go!" coach="settings-bt-ready" footer={<button type="button" data-coach="settings-bt-done" className={btnPrimary} onClick={() => setDlg(null)}>Done</button>}>
          <p className="flex items-center gap-2">
            <BluetoothGlyph size={20} /> {last}
          </p>
        </Sheet>
      )}
    </>
  )
}

// ------------------------------------------------------------------ Printers

export function PrintersPane() {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const { sim, setSim } = d
  const printers = sim.printers ?? []
  const [searching, setSearching] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const add = (name: string) => {
    setSim({ printers: [...new Set([...printers, name])] })
    d.emit({ type: 'custom', event: 'printer-added' })
    d.toast(`${name} added`)
    setSearching(false)
    setSheet(false)
    setPicked(null)
  }
  const remove = (n: string) => setSim({ printers: printers.filter((x) => x !== n) })
  const left = PRINTER_CHOICES.filter((p) => !printers.includes(p.name))
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="font-medium">{mac ? 'Printers' : 'Printers & scanners'}</div>
        <button type="button" data-coach="settings-printer-add" className={btn} onClick={() => (mac ? setSheet(true) : setSearching(true))}>
          {mac ? 'Add Printer, Scanner, or Fax…' : 'Add device'}
        </button>
      </div>
      <ul data-coach="settings-printer-list" className="mt-2 divide-y divide-gray-100 rounded border border-gray-200">
        {printers.length === 0 && <li className="px-3 py-3 text-gray-500">{mac ? 'No printers' : 'No printers or scanners added yet.'}</li>}
        {printers.map((n) => (
          <li key={n} data-coach={`settings-printer-${n}`} className="flex min-h-14 items-center gap-3 px-3">
            <PrinterIcon size={28} />
            <span className="flex-1">
              {n}
              <span className="block text-xs text-gray-500">{mac ? 'Idle' : 'Ready'}</span>
            </span>
            <button type="button" className="min-h-9 rounded px-3 hover:bg-gray-100" aria-label={`Remove ${n}`} onClick={() => remove(n)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {!mac && searching && (
        <div data-coach="settings-printer-found-box" className="mt-3 rounded border border-gray-200 p-3">
          <div className="mb-1 text-xs text-gray-600">{left.length ? 'Found printers and scanners:' : 'No more printers found.'}</div>
          {left.map((p) => (
            <div key={p.name} className="flex min-h-12 items-center gap-3">
              <PrinterIcon size={24} />
              <span className="flex-1">
                {p.name}
                <span className="block text-xs text-gray-500">{p.note}</span>
              </span>
              <button type="button" data-coach={`settings-printer-found-${p.name}`} className={btnPrimary} onClick={() => add(p.name)}>
                Add device
              </button>
            </div>
          ))}
          <button type="button" className={`${btn} mt-2`} onClick={() => setSearching(false)}>
            Close
          </button>
        </div>
      )}
      {mac && sheet && (
        <Sheet
          mac
          title="Add Printer"
          coach="settings-printer-dialog"
          footer={
            <>
              <button type="button" className={btn} onClick={() => (setSheet(false), setPicked(null))}>
                Cancel
              </button>
              <button type="button" data-coach="settings-printer-confirm" className={btnPrimary} disabled={!picked} style={{ opacity: picked ? 1 : 0.5 }} onClick={() => picked && add(picked)}>
                Add
              </button>
            </>
          }
        >
          <div role="listbox" aria-label="Printers" className="h-36 overflow-auto rounded border border-gray-200">
            {left.length === 0 && <div className="p-3 text-gray-500">No more printers found.</div>}
            {left.map((p) => (
              <button key={p.name} type="button" role="option" aria-selected={picked === p.name} data-coach={`settings-printer-pick-${p.name}`} onClick={() => setPicked(p.name)} className={`flex min-h-10 w-full items-center justify-between px-3 text-left ${picked === p.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                <span>{p.name}</span>
                <span className="text-xs opacity-80">{p.note}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </>
  )
}
