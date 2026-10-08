import { useRef, useState } from 'react'
import { store, useProgress } from '../state/store'
import { Choice } from '../ui/Choice'
import { Dialog } from '../ui/Dialog'
import { downloadText } from '../lib/download'
import type { OsFlavor } from '../engine/types'
import type { NumeralStyle, TextSize, ThemeSetting } from '../state/progress'

export default function Settings() {
  const { profile, settings } = useProgress()
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState<null | 'progress' | 'all'>(null)
  const file = useRef<HTMLInputElement>(null)

  const doExport = () => {
    const date = new Date().toISOString().slice(0, 10)
    downloadText(`computer-shikhi-backup-${date}.json`, store.exportJson())
    setMsg('✓ ব্যাকআপ ফাইলটি আপনার কম্পিউটারে সেভ হয়েছে। ফাইলটি যত্ন করে রেখে দিন।')
  }

  const doImport = async (f: File | undefined) => {
    if (!f) return
    const text = await f.text()
    setMsg(store.importJson(text) ? '✓ আগের অগ্রগতি ফিরে এসেছে।' : 'ফাইলটি পড়া গেল না। এটি কি এই অ্যাপের ব্যাকআপ ফাইল? অন্য ফাইল বেছে দেখুন।')
    if (file.current) file.current.value = ''
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">সেটিংস</h1>

      <section className="card space-y-4" aria-labelledby="s-me">
        <h2 id="s-me" className="text-xl font-bold">আমার তথ্য</h2>
        <label className="block space-y-1">
          <span className="font-bold">নাম</span>
          <input className="field" value={profile.name} maxLength={60} onChange={(e) => store.setProfile({ name: e.target.value })} />
        </label>
        <Choice<OsFlavor>
          legend="আমার কম্পিউটার"
          value={profile.os}
          onChange={(v) => store.setProfile({ os: v })}
          options={[
            { value: 'windows', label: 'Windows' },
            { value: 'mac', label: 'Mac (macOS)' },
          ]}
        />
        <label className="block space-y-1">
          <span className="font-bold">আমার লক্ষ্য</span>
          <textarea className="field min-h-24" value={profile.motivation} maxLength={500} onChange={(e) => store.setProfile({ motivation: e.target.value })} />
        </label>
      </section>

      <section className="card space-y-4" aria-labelledby="s-look">
        <h2 id="s-look" className="text-xl font-bold">দেখতে কেমন হবে</h2>
        <Choice<TextSize>
          legend="লেখার আকার"
          value={settings.textSize}
          onChange={(v) => store.setSettings({ textSize: v })}
          options={[
            { value: 'normal', label: 'সাধারণ' },
            { value: 'large', label: 'বড়' },
            { value: 'xlarge', label: 'আরও বড়' },
            { value: 'xxlarge', label: 'সবচেয়ে বড়' },
          ]}
        />
        <Choice<ThemeSetting>
          legend="রং"
          value={settings.theme}
          onChange={(v) => store.setSettings({ theme: v })}
          options={[
            { value: 'light', label: '☀️ হালকা', sub: 'দিনের আলোয় ভালো' },
            { value: 'dark', label: '🌙 গাঢ়', sub: 'রাতে চোখের আরাম' },
          ]}
        />
        <Choice<NumeralStyle>
          legend="সংখ্যা লেখার ধরন"
          value={settings.numerals}
          onChange={(v) => store.setSettings({ numerals: v })}
          options={[
            { value: 'bengali', label: '১২৩ বাংলা সংখ্যা' },
            { value: 'western', label: '123 ইংরেজি সংখ্যা' },
          ]}
        />
      </section>

      <section className="card space-y-4" aria-labelledby="s-teacher">
        <h2 id="s-teacher" className="text-xl font-bold">শিক্ষকের জন্য</h2>
        <label className="flex min-h-12 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-6 w-6 accent-[var(--c-brand)]"
            checked={settings.unlockAll}
            onChange={(e) => store.setSettings({ unlockAll: e.target.checked })}
          />
          <span>সব পাঠ খুলে দিন (পরপর শেষ করার শর্ত তুলে দিন)</span>
        </label>
      </section>

      <section className="card space-y-4" aria-labelledby="s-data">
        <h2 id="s-data" className="text-xl font-bold">অগ্রগতির ব্যাকআপ</h2>
        <p>
          আপনার অগ্রগতি শুধু এই কম্পিউটারের ব্রাউজারে জমা থাকে। ব্রাউজারের তথ্য মুছে ফেললে বা অন্য কম্পিউটারে গেলে হারিয়ে যেতে পারে — তাই মাঝে মাঝে ব্যাকআপ নিয়ে রাখুন।
        </p>
        {!store.persistent && (
          <p className="rounded-xl bg-accent-soft p-3">এই ব্রাউজারে অগ্রগতি সেভ করা যাচ্ছে না, তাই পাতা বন্ধ করলে তা হারিয়ে যাবে। ব্যাকআপ ফাইল নামিয়ে রাখুন।</p>
        )}
        <div className="flex flex-wrap gap-3">
          <button className="btn" onClick={doExport}>⬇ ব্যাকআপ নামান</button>
          <button className="btn btn-outline" onClick={() => file.current?.click()}>⬆ ব্যাকআপ ফিরিয়ে আনুন</button>
          <input ref={file} type="file" accept="application/json,.json" className="sr-only" aria-label="ব্যাকআপ ফাইল বেছে নিন" onChange={(e) => doImport(e.target.files?.[0])} tabIndex={-1} />
        </div>
        {msg && <p role="status" className="rounded-xl bg-brand-soft p-3">{msg}</p>}
        <hr style={{ borderColor: 'var(--c-line)' }} />
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-outline" onClick={() => setConfirm('progress')}>অগ্রগতি মুছে নতুন করে শুরু</button>
          <button className="btn btn-outline" onClick={() => setConfirm('all')}>সবকিছু মুছে ফেলুন</button>
        </div>
      </section>

      <Dialog open={confirm !== null} onClose={() => setConfirm(null)} titleBn="আপনি কি নিশ্চিত?" closeLabel="না, থাক">
        <p className="mb-4">
          {confirm === 'all'
            ? 'আপনার নাম, সেটিংস, অগ্রগতি, নোট — সবকিছু মুছে যাবে। আগে ব্যাকআপ নিয়ে রাখলে ভালো।'
            : 'সব পাঠের অগ্রগতি মুছে যাবে, তবে আপনার নাম ও সেটিংস থাকবে।'}
        </p>
        <button
          className="btn"
          onClick={() => {
            if (confirm === 'all') store.resetAll()
            else store.resetProgress()
            setConfirm(null)
          }}
        >
          হ্যাঁ, মুছে ফেলুন
        </button>
      </Dialog>
    </div>
  )
}
