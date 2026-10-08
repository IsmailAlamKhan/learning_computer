import { useState } from 'react'
import { scorePassword } from './lib/passwordStrength'

const COLORS = ['var(--c-line)', 'var(--c-accent)', 'var(--c-accent)', 'var(--c-brand)', 'var(--c-ok)']

/** Practice-only password feedback. Everything happens in the browser; nothing is stored or sent. */
export default function PasswordStrength() {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const r = scorePassword(pw)
  return (
    <div className="card space-y-3 p-4" data-testid="password-strength">
      <p className="m-0 font-semibold">পাসওয়ার্ড অনুশীলন</p>
      <p className="m-0 rounded-lg p-2 font-semibold" style={{ background: 'var(--c-accent-soft)' }} role="note">
        এখানে আসল পাসওয়ার্ড লিখবেন না। শুধু বানানো একটি নমুনা লিখে দেখুন। যা লিখবেন তা এই পাতার বাইরে কোথাও যায় না, কোথাও জমাও থাকে না।
      </p>
      <label htmlFor="pw-practice" className="block font-semibold">একটি অনুশীলনের পাসওয়ার্ড লিখুন</label>
      <div className="flex gap-2">
        <input id="pw-practice" data-testid="pw-input" type={show ? 'text' : 'password'} autoComplete="off" spellCheck={false} className="w-full rounded-lg border-2 px-3 py-2" style={{ borderColor: 'var(--c-line)' }} value={pw} onChange={(e) => setPw(e.target.value)} />
        <button type="button" className="btn btn-outline" aria-pressed={show} onClick={() => setShow((s) => !s)}>{show ? 'লুকান' : 'দেখান'}</button>
      </div>
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 flex-1 rounded" style={{ background: r.score >= i ? COLORS[r.score] : 'var(--c-line)' }} />
        ))}
      </div>
      <p className="m-0 font-semibold" aria-live="polite" data-testid="pw-label" data-level={r.level}>{r.labelBn}</p>
      <ul className="m-0 list-none space-y-1 p-0 text-sm" data-testid="pw-tips">
        {r.tips.map((t, i) => (
          <li key={i}>{t.kind === 'good' ? '✅' : '💡'} {t.textBn}</li>
        ))}
      </ul>
      <p className="m-0 text-sm" style={{ color: 'var(--c-muted)' }}>
        মনে রাখবেন, এটি শুধু একটি মোটামুটি আন্দাজ। কোনো পাসওয়ার্ডই একা যথেষ্ট নয় — প্রতিটি অ্যাকাউন্টে আলাদা পাসওয়ার্ড আর সম্ভব হলে দ্বিতীয় ধাপ (2FA) চালু রাখুন।
      </p>
      <p className="m-0 text-sm"><strong>পাসফ্রেজের নমুনা:</strong> <code>কাঁঠাল-নদী-টেবিল-সূর্য</code> বা <code>blue-tea-river-chair</code> — চারটি এলোমেলো শব্দ, সহজে মনে থাকে।</p>
    </div>
  )
}
