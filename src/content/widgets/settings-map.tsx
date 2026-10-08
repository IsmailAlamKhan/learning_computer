import { useState } from 'react'
import { useProgress } from '../../state/store'
import { SETTING_ROWS, rowById } from './lib/settingsMap'

/** "কোন সেটিং কোথায়?" — pick a task, see where to find it on Windows and on Mac (the learner's own OS is highlighted). */
export default function SettingsMap() {
  const { profile } = useProgress()
  const [id, setId] = useState(SETTING_ROWS[0].id)
  const row = rowById(id) ?? SETTING_ROWS[0]
  const mine = profile.os === 'mac' ? 'mac' : 'windows'
  return (
    <section className="card space-y-3" aria-label="কোন সেটিং কোথায়">
      <p className="m-0 font-semibold">কোন কাজ করতে চান? একটি বেছে নিন:</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="কাজের তালিকা">
        {SETTING_ROWS.map((r) => (
          <button key={r.id} type="button" className={`btn ${r.id === id ? 'btn-primary' : 'btn-outline'}`} aria-pressed={r.id === id} data-setting={r.id} onClick={() => setId(r.id)}>
            {r.labelBn}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2" data-testid="settings-map-result">
        {(['windows', 'mac'] as const).map((os) => (
          <div key={os} className="rounded-lg border p-3" data-os={os} style={{ borderColor: 'var(--c-line)', background: os === mine ? 'var(--c-brand-soft)' : undefined }}>
            <div className="text-sm font-semibold">
              {os === 'windows' ? 'Windows 11' : 'Mac (macOS)'} {os === mine && <span className="chip">আপনার</span>}
            </div>
            <p className="m-0 mt-1" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{os === 'windows' ? row.win : row.mac}</p>
          </div>
        ))}
      </div>
      <p className="m-0 text-sm text-muted">{row.noteBn ?? 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — সেটিংসের ওপরে খোঁজার ঘরে (Search) নাম লিখেও খুঁজে পাবেন।'}</p>
    </section>
  )
}
