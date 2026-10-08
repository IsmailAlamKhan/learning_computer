import { useState } from 'react'
import { useDesktop } from '../DesktopContext'
import { comboLabel } from '../shortcuts'

const KEYS = ['Tab', 'Esc', 'Space', 'Enter', 'Delete', 'Left', 'Right', 'Up', 'Down', 'F2', 'C', 'V', 'X', 'Z', 'A', 'S', 'F', 'N', 'W', 'Q', 'D', 'L', 'M', 'P', 'PrtScn', '3', '4', '5']

/**
 * On-screen shortcut pad. Browsers swallow some real key combinations (Alt+Tab, Cmd+Tab, Win key…),
 * so the learner can also "press" them here. Real keys and this pad share `dispatchCombo`.
 */
export function ShortcutPad() {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const [mods, setMods] = useState<string[]>([])
  const toggle = (m: string) => setMods((x) => (x.includes(m) ? x.filter((y) => y !== m) : [...x, m]))
  const mk = [
    { id: 'ctrl', label: mac ? '⌃ Control' : 'Ctrl' },
    { id: 'alt', label: mac ? '⌥ Option' : 'Alt' },
    { id: 'shift', label: '⇧ Shift' },
    { id: 'cmd', label: mac ? '⌘ Command' : 'Win' },
  ]
  const press = (k: string) => {
    d.dispatchCombo([...mods, k.toLowerCase()].join('+'))
    setMods([])
  }
  return (
    <div className="space-y-2 rounded-xl border p-3" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }} data-testid="shortcut-pad" data-coach="shortcut-pad">
      <div className="text-sm">
        <strong>কিবোর্ড শর্টকাট প্যাড:</strong> আগে নিচের Ctrl/Alt/Cmd-এর মতো বোতাম বেছে নিন, তারপর একটি অক্ষর বা কী-তে ক্লিক করুন।
        <span className="ml-1 text-muted">{mods.length ? `বাছাই: ${comboLabel(mods.join('+'), d.os)} + …` : ''}</span>
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ctrl, Alt, Cmd-এর মতো কী">
        {mk.map((m) => (
          <button key={m.id} aria-pressed={mods.includes(m.id)} data-coach={`pad-${m.id}`} onClick={() => toggle(m.id)} className="min-h-11 min-w-14 rounded-lg border-2 px-3 text-sm font-medium aria-pressed:border-brand aria-pressed:bg-brand-soft" style={{ borderColor: 'var(--c-line)' }}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="কী">
        {KEYS.filter((k) => !(mac && k === 'PrtScn')).map((k) => (
          <button key={k} data-coach={`pad-key-${k.toLowerCase()}`} onClick={() => press(k)} className="min-h-11 min-w-11 rounded-lg border-2 px-2.5 text-sm font-medium hover:bg-sunken" style={{ borderColor: 'var(--c-line)' }}>
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
