/** Language & keyboard panes of the simulated Settings app (Windows: Time & language → Language & region; Mac: Keyboard → Text Input). */
import { useState, type ReactNode } from 'react'
import { useDesktop } from '../../DesktopContext'
import { KEYBOARDS, hasBangla } from '../../keyboards'

const LANG_CHOICES = [
  { id: 'bn', name: 'Bangla (Bangladesh)', native: 'বাংলা (বাংলাদেশ)', ok: true },
  { id: 'bn-in', name: 'Bangla (India)', native: 'বাংলা (ভারত)', ok: false },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी', ok: false },
  { id: 'ur', name: 'Urdu', native: 'اردو', ok: false },
]

const btn = 'min-h-9 rounded border border-gray-400 bg-white px-4 hover:bg-gray-50'
const btnPrimary = 'min-h-9 rounded bg-blue-600 px-4 text-white hover:bg-blue-700'

/** Simple in-window modal used by the language/keyboard flows. */
function Sheet({ title, coach, children, footer, mac }: { title: string; coach: string; children: ReactNode; footer: ReactNode; mac: boolean }) {
  return (
    <div className="absolute inset-0 z-[400] flex items-center justify-center bg-black/30 p-3">
      <div role="dialog" aria-modal="true" aria-label={title} data-coach={coach} className={`relative flex max-h-full w-full max-w-md flex-col bg-white text-sm text-gray-900 shadow-2xl ${mac ? 'rounded-xl' : 'rounded-lg border border-gray-300'}`}>
        <div className={`px-4 py-3 text-base font-semibold ${mac ? 'text-center' : ''}`}>{title}</div>
        <div className="min-h-0 flex-1 overflow-auto px-4 pb-2">{children}</div>
        <div className="flex justify-end gap-2 px-4 py-3">{footer}</div>
      </div>
    </div>
  )
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

export function TimeTabs({ tab, setTab }: { tab: 'date' | 'language'; setTab: (t: 'date' | 'language') => void }) {
  return (
    <div role="tablist" aria-label="Time & language" className="mb-3 flex gap-1 border-b border-gray-200">
      {([['date', 'Date & time'], ['language', 'Language & region']] as const).map(([id, label]) => (
        <button key={id} type="button" role="tab" aria-selected={tab === id} data-coach={`settings-time-tab-${id}`} onClick={() => setTab(id)} className={`min-h-10 border-b-2 px-4 ${tab === id ? 'border-blue-600 font-medium' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
          {label}
        </button>
      ))}
    </div>
  )
}

/** Windows 11: Time & language → Language & region → Add a language. */
export function LanguageRegion() {
  const d = useDesktop()
  const { sim, setSim } = d
  const [step, setStep] = useState<null | 'pick' | 'features'>(null)
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [asDisplay, setAsDisplay] = useState(false)
  const list = sim.keyboards ?? ['en']
  const q = query.trim().toLowerCase()
  const shown = LANG_CHOICES.filter((l) => !q || l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q))
  const close = () => {
    setStep(null)
    setPicked(null)
    setQuery('')
    setNote('')
  }
  const install = () => {
    setSim({ keyboards: [...new Set([...list, 'bn'])] })
    d.emit({ type: 'custom', event: 'keyboard-added' })
    d.toast('Bangla (Bangladesh) language added')
    close()
  }
  return (
    <>
      <Row label="Windows display language" hint="Windows features like Settings and File Explorer will appear in this language.">
        <span>English (United States)</span>
      </Row>
      <div className="mt-4 flex items-center justify-between">
        <div className="font-medium">Preferred languages</div>
        <button type="button" data-coach="settings-add-language" onClick={() => setStep('pick')} className={btn}>
          Add a language
        </button>
      </div>
      <ul data-coach="settings-language-list" className="mt-2 divide-y divide-gray-100 rounded border border-gray-200">
        <li className="flex min-h-14 items-center justify-between px-3" data-coach="settings-lang-en">
          <div>
            <div>English (United States)</div>
            <div className="text-xs text-gray-500">Keyboard: US</div>
          </div>
        </li>
        {hasBangla(list) && (
          <li className="flex min-h-14 items-center justify-between px-3" data-coach="settings-lang-bn">
            <div>
              <div>Bangla (Bangladesh)</div>
              <div className="text-xs text-gray-500">Keyboard: Bangla</div>
            </div>
            <button type="button" data-coach="settings-lang-remove" aria-label="Remove Bangla (Bangladesh)" onClick={() => setSim({ keyboards: ['en'], activeKeyboard: 'en' })} className="min-h-9 rounded px-3 hover:bg-gray-100">
              Remove
            </button>
          </li>
        )}
      </ul>
      {step === 'pick' && (
        <Sheet
          mac={false}
          title="Choose a language to install"
          coach="settings-lang-dialog"
          footer={
            <>
              <button type="button" className={btn} onClick={close}>Cancel</button>
              <button type="button" data-coach="settings-lang-next" className={btnPrimary} disabled={!picked} style={{ opacity: picked ? 1 : 0.5 }} onClick={() => picked && setStep('features')}>
                Next
              </button>
            </>
          }
        >
          <input data-coach="settings-lang-search" aria-label="Search for a language" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} className="mb-2 min-h-9 w-full rounded border border-gray-300 px-2" />
          <div role="listbox" aria-label="Languages" className="max-h-52 overflow-auto rounded border border-gray-200">
            {shown.map((l) => (
              <button
                key={l.id}
                type="button"
                role="option"
                aria-selected={picked === l.id}
                data-coach={`settings-lang-choice-${l.id}`}
                onClick={() => (l.ok ? (setPicked(l.id), setNote('')) : (setPicked(null), setNote('This language is not part of the practice computer. Please choose Bangla (Bangladesh).')))}
                className={`flex min-h-11 w-full items-center justify-between px-3 text-left hover:bg-gray-100 ${picked === l.id ? 'bg-sky-100' : ''}`}
              >
                <span>{l.name}</span>
                <span className="text-xs text-gray-500">{l.native}</span>
              </button>
            ))}
            {shown.length === 0 && <div className="p-3 text-gray-500">No results.</div>}
          </div>
          {note && <p className="mt-2 text-xs text-gray-600">{note}</p>}
        </Sheet>
      )}
      {step === 'features' && (
        <Sheet
          mac={false}
          title="Install language features"
          coach="settings-lang-features"
          footer={
            <>
              <button type="button" className={btn} onClick={() => setStep('pick')}>Back</button>
              <button type="button" data-coach="settings-lang-install" className={btnPrimary} onClick={install}>Install</button>
            </>
          }
        >
          <p className="mb-2 font-medium">Bangla (Bangladesh)</p>
          <label className="flex min-h-9 items-center gap-2"><input type="checkbox" checked readOnly disabled /> Language pack</label>
          <label className="flex min-h-9 items-center gap-2">
            <input type="checkbox" data-coach="settings-lang-display" checked={asDisplay} onChange={(e) => setAsDisplay(e.target.checked)} /> Set as my Windows display language
          </label>
          <p className="mt-2 text-xs text-gray-600">Tip: leave “Set as my Windows display language” unticked — you only want to type in Bangla, not change Windows itself.</p>
        </Sheet>
      )}
    </>
  )
}

/** macOS: System Settings → Keyboard → Text Input → Input Sources → Edit… → + */
export function MacKeyboard() {
  const d = useDesktop()
  const { sim, setSim } = d
  const [sheet, setSheet] = useState(false)
  const [adding, setAdding] = useState(false)
  const [pickedLang, setPickedLang] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const list = sim.keyboards ?? ['en']
  const add = () => {
    if (pickedLang !== 'bn') return
    setSim({ keyboards: [...new Set([...list, 'bn'])] })
    d.emit({ type: 'custom', event: 'keyboard-added' })
    setAdding(false)
    setPickedLang(null)
  }
  const remove = () => {
    if (selected === 'bn') {
      setSim({ keyboards: ['en'], activeKeyboard: 'en' })
      setSelected(null)
    }
  }
  const sources = list.map((id) => KEYBOARDS[id]).filter(Boolean)
  return (
    <>
      <div className="mb-1 text-xs font-semibold text-gray-500">Text Input</div>
      <Row label="Input Sources" hint={sources.map((s) => s.macName).join(', ')}>
        <button type="button" data-coach="settings-input-edit" onClick={() => setSheet(true)} className={btn}>
          Edit…
        </button>
      </Row>
      <p className="mt-3 text-xs text-gray-500">Switch input sources with Control + Space, or from the input menu in the menu bar.</p>
      {sheet && (
        <Sheet
          mac
          title="Input Sources"
          coach="settings-input-sheet"
          footer={
            <button type="button" data-coach="settings-input-done" className={btnPrimary} onClick={() => (setSheet(false), setAdding(false))}>
              Done
            </button>
          }
        >
          <div role="listbox" aria-label="Input sources" className="h-32 overflow-auto rounded border border-gray-200">
            {sources.map((s) => (
              <button key={s.id} type="button" role="option" aria-selected={selected === s.id} data-coach={`settings-input-source-${s.id}`} onClick={() => setSelected(s.id)} className={`flex min-h-9 w-full items-center px-3 text-left ${selected === s.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                {s.macName}
              </button>
            ))}
          </div>
          <div className="mt-1 flex gap-1">
            <button type="button" data-coach="settings-input-add" aria-label="Add input source" onClick={() => setAdding(true)} className="min-h-9 min-w-9 rounded border border-gray-300 text-lg">+</button>
            <button type="button" data-coach="settings-input-remove" aria-label="Remove input source" disabled={selected !== 'bn'} onClick={remove} className="min-h-9 min-w-9 rounded border border-gray-300 text-lg disabled:text-gray-300">−</button>
          </div>
          {adding && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/20 p-3">
              <div role="dialog" aria-label="Add input source" data-coach="settings-input-add-dialog" className="w-full max-w-sm rounded-xl bg-white p-4 shadow-2xl">
                <div className="mb-2 text-center font-semibold">Add an input source</div>
                <div className="grid grid-cols-2 gap-2">
                  <div role="listbox" aria-label="Languages" className="h-36 overflow-auto rounded border border-gray-200">
                    {[{ id: 'en', n: 'English' }, { id: 'bn', n: 'Bangla' }, { id: 'hi', n: 'Hindi' }].map((l) => (
                      <button key={l.id} type="button" role="option" aria-selected={pickedLang === l.id} data-coach={`settings-input-lang-${l.id}`} onClick={() => setPickedLang(l.id)} className={`flex min-h-9 w-full items-center px-3 text-left ${pickedLang === l.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                        {l.n}
                      </button>
                    ))}
                  </div>
                  <div className="h-36 overflow-auto rounded border border-gray-200 p-2 text-gray-700">
                    {pickedLang === 'bn' ? <div className="rounded bg-blue-100 px-2 py-1.5" data-coach="settings-input-choice-bn">Bangla</div> : <span className="text-xs text-gray-500">{pickedLang ? 'Not part of this practice. Choose Bangla.' : 'Choose a language.'}</span>}
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" className={btn} onClick={() => setAdding(false)}>Cancel</button>
                  <button type="button" data-coach="settings-input-add-confirm" className={btnPrimary} disabled={pickedLang !== 'bn'} style={{ opacity: pickedLang === 'bn' ? 1 : 0.5 }} onClick={add}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </Sheet>
      )}
    </>
  )
}
