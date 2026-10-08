import { useState } from 'react'
import { GROUP_INFO, KEY_INFO_BN, type KeyGroup } from '../../lib/keyboardLayout'
import { useProgress } from '../../state/store'
import { KeyboardSvg } from './parts/KeyboardSvg'

const GROUPS: KeyGroup[] = ['letters', 'numbers', 'symbols', 'function', 'modifier', 'arrows', 'special']

/** "কিবোর্ডের গ্রুপ": coloured key groups, click a group (or a key) to learn what it does. */
export default function KeyboardLayoutWidget() {
  const { profile } = useProgress()
  const [os, setOs] = useState<'windows' | 'mac'>(profile.os)
  const [group, setGroup] = useState<KeyGroup | null>(null)
  const [key, setKey] = useState<string | null>(null)
  return (
    <section className="card space-y-3" aria-label="কিবোর্ডের গ্রুপ">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-lg font-bold">কিবোর্ডের কী-গুলো গ্রুপ করে দেখি</h3>
        <div role="group" aria-label="কিবোর্ডের ধরন" className="flex gap-2">
          {(['windows', 'mac'] as const).map((o) => (
            <button key={o} type="button" aria-pressed={os === o} onClick={() => setOs(o)} className={`btn ${os === o ? '' : 'btn-outline'}`}>
              {o === 'windows' ? 'Windows' : 'Mac'}
            </button>
          ))}
        </div>
      </div>
      <p className="m-0 text-sm text-muted">নিচের রঙিন বোতাম বা কিবোর্ডের যেকোনো কী-তে ক্লিক করুন। আপনার কিবোর্ডে কী-এর জায়গা একটু আলাদা হতে পারে।</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="কী-এর গ্রুপ">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={group === g}
            onClick={() => (setGroup(group === g ? null : g), setKey(null))}
            className="min-h-12 rounded-xl border-2 px-3 text-sm font-medium"
            style={{ background: GROUP_INFO[g].fill, color: '#111827', borderColor: group === g ? '#0f766e' : 'transparent', outline: group === g ? '2px solid #0f766e' : undefined }}
          >
            {GROUP_INFO[g].nameBn}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl p-2" style={{ background: 'var(--c-sunken)' }}>
        <KeyboardSvg os={os} colorGroups activeGroup={group} selected={key} onKey={(id) => setKey(id)} title={`${os === 'mac' ? 'Mac' : 'Windows'} কিবোর্ডের ছবি`} />
      </div>
      <p className="m-0 min-h-14 rounded-xl p-3" aria-live="polite" style={{ background: 'var(--c-brand-soft)' }}>
        {key ? (KEY_INFO_BN[key] ?? (group ? GROUP_INFO[group].descBn : 'এই কী-টি চাপলে এই অক্ষর বা চিহ্ন লেখা হয়। Shift-এর সাথে চাপলে ওপরের লেখাটি আসে।')) : group ? GROUP_INFO[group].descBn : 'একটি গ্রুপ বা কী বেছে নিন — এখানে তার কাজ লেখা আসবে।'}
      </p>
    </section>
  )
}
