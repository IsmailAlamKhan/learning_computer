import { useState } from 'react'
import { canBrowse, type NetState } from './lib/urlParts'

const WIFI: { id: NetState['wifi']; label: string }[] = [
  { id: 'on-with-internet', label: 'Wi‑Fi চালু, রাউটারে ইন্টারনেট আছে' },
  { id: 'on-no-internet', label: 'Wi‑Fi চালু, কিন্তু রাউটারে ইন্টারনেট নেই' },
  { id: 'off', label: 'Wi‑Fi বন্ধ' },
]

export default function WifiVsMobile() {
  const [wifi, setWifi] = useState<NetState['wifi']>('on-with-internet')
  const [mobileData, setMobileData] = useState(false)
  const ok = canBrowse({ wifi, mobileData })
  return (
    <div className="card space-y-3 p-4" data-testid="wifi-vs-mobile">
      <p className="font-semibold">ফোনে ওয়েবসাইট খুলবে কি না — নিজে বদলে দেখুন</p>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">ওয়াই-ফাই (Wi‑Fi)</legend>
        {WIFI.map((w) => (
          <label key={w.id} className="flex min-h-11 items-center gap-2">
            <input type="radio" name="wifi-state" checked={wifi === w.id} onChange={() => setWifi(w.id)} />
            {w.label}
          </label>
        ))}
      </fieldset>
      <label className="flex min-h-11 items-center gap-2">
        <input type="checkbox" checked={mobileData} onChange={(e) => setMobileData(e.target.checked)} />
        মোবাইল ডেটা (Mobile data) চালু
      </label>
      <div className="rounded-xl border-2 p-3" role="status" style={{ borderColor: ok ? 'var(--c-success, #15803d)' : 'var(--c-line)' }} data-testid="wifi-result">
        <p className="font-semibold">{ok ? 'ওয়েবসাইট খুলবে ✓' : 'ওয়েবসাইট খুলবে না ✗'}</p>
        <p className="mt-1 text-sm">
          {wifi === 'on-no-internet' && !mobileData && 'ওয়াই-ফাইয়ের চিহ্ন দেখাচ্ছে, তবু ইন্টারনেট নেই। এ যেন সুন্দর রাস্তা আছে, কিন্তু রাস্তাটি শহরে গিয়ে মেশেনি। রাউটার ঠিক করুন, নয়তো মোবাইল ডেটা চালান।'}
          {wifi === 'on-no-internet' && mobileData && 'ওয়াই-ফাইয়ে ইন্টারনেট নেই, তাই ফোন মোবাইল ডেটা ব্যবহার করে পেজ খুলছে। মনে রাখবেন, মোবাইল ডেটায় প্যাকেজের মেগাবাইট খরচ হয়।'}
          {wifi === 'on-with-internet' && 'বাসার রাউটারের সংযোগ দিয়ে পেজ খুলছে। মোবাইল ডেটার প্যাকেজ খরচ হচ্ছে না।'}
          {wifi === 'off' && mobileData && 'মোবাইল ডেটা দিয়ে মোবাইল নেটওয়ার্কের মাধ্যমে ইন্টারনেট পাচ্ছে।'}
          {wifi === 'off' && !mobileData && 'ওয়াই-ফাই আর মোবাইল ডেটা — দুটোই বন্ধ, তাই ইন্টারনেটে যাওয়ার কোনো পথ নেই।'}
        </p>
      </div>
    </div>
  )
}
