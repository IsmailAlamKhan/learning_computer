import { useState } from 'react'
import { EDIT_ROWS, SYSTEM_ROWS, keyLabel, type ShortcutRow } from '../../lib/shortcutData'
import { useProgress } from '../../state/store'
import { Keycap } from './parts/KeyboardSvg'

function Combos({ alts, os, mine }: { alts: string[][]; os: 'windows' | 'mac'; mine: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      {alts.map((keys, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1">
          {i > 0 && <span className="text-xs text-muted">অথবা</span>}
          {keys.map((t, j) => (
            <span key={j} className="inline-flex items-center gap-1">
              {j > 0 && <span aria-hidden="true">+</span>}
              <Keycap active={mine}>{keyLabel(t, os)}</Keycap>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function Table({ rows, mineOs, title }: { rows: ShortcutRow[]; mineOs: 'windows' | 'mac'; title: string }) {
  const hi = (os: 'windows' | 'mac') => (os === mineOs ? { background: 'var(--c-brand-soft)' } : undefined)
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" data-testid="shortcut-table">
        <caption className="pb-2 text-left font-semibold">{title}</caption>
        <thead>
          <tr>
            <th scope="col" className="border p-2" style={{ borderColor: 'var(--c-line)' }}>কাজ</th>
            <th scope="col" className="border p-2" style={{ borderColor: 'var(--c-line)', ...hi('windows') }}>Windows (Ctrl) {mineOs === 'windows' && <span className="chip" style={{ background: 'var(--c-brand)', color: 'var(--c-brand-ink)' }}>আপনার</span>}</th>
            <th scope="col" className="border p-2" style={{ borderColor: 'var(--c-line)', ...hi('mac') }}>Mac (Command) {mineOs === 'mac' && <span className="chip" style={{ background: 'var(--c-brand)', color: 'var(--c-brand-ink)' }}>আপনার</span>}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-row={r.id}>
              <th scope="row" className="border p-2 font-medium" style={{ borderColor: 'var(--c-line)' }}>
                {r.labelBn}
                {r.noteBn && <div className="text-xs font-normal text-muted">{r.noteBn}</div>}
              </th>
              <td className="border p-2" style={{ borderColor: 'var(--c-line)', ...hi('windows') }} data-os="windows"><Combos alts={r.win} os="windows" mine={mineOs === 'windows'} /></td>
              <td className="border p-2" style={{ borderColor: 'var(--c-line)', ...hi('mac') }} data-os="mac"><Combos alts={r.mac} os="mac" mine={mineOs === 'mac'} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Windows and Mac shortcuts side by side; the learner's own OS column is highlighted. */
export default function ShortcutTable() {
  const { profile } = useProgress()
  const [more, setMore] = useState(false)
  return (
    <section className="card space-y-3" aria-label="শর্টকাট তালিকা">
      <p className="m-0">
        মনে রাখার সহজ নিয়ম: <strong>Windows-এ Ctrl, Mac-এ Command (⌘)</strong> — বাকি অক্ষরগুলো একই। আপনার কম্পিউটারের কলামটি রঙিন করা আছে।
      </p>
      <Table rows={EDIT_ROWS} mineOs={profile.os} title="লেখা ও ফাইলের কাজের শর্টকাট" />
      <button type="button" className="btn btn-outline" aria-expanded={more} onClick={() => setMore((m) => !m)}>
        {more ? 'কম দেখান' : 'আরও কিছু কাজের শর্টকাট (লক, স্ক্রিনশট)'}
      </button>
      {more && <Table rows={SYSTEM_ROWS} mineOs={profile.os} title="কম্পিউটার চালানোর কিছু শর্টকাট" />}
      <p className="m-0 text-sm text-muted">আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে — যেমন কিছু ল্যাপটপে Print Screen চাপতে Fn কী-ও লাগে।</p>
    </section>
  )
}
