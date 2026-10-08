import { useState } from 'react'
import { splitUrl } from './lib/urlParts'

const SAMPLE = 'https://www.example.com/page'

const INFO = {
  scheme: { t: 'https:// — সংযোগের ধরন', d: 'https মানে আপনার আর সাইটের মাঝের তথ্য সুরক্ষিত করে (এনক্রিপ্ট করে) পাঠানো হচ্ছে। তবে এটি সাইটটি সৎ কি না সেটা বলে না।' },
  host: { t: 'www.example.com — ঠিকানার নাম (ডোমেইন)', d: 'এটাই সাইটের আসল নাম, যেন দোকানের সাইনবোর্ড। ঠকবাজেরা এখানে বানান সামান্য বদলে দেয় — যেমন l-এর জায়গায় 1।' },
  path: { t: '/page — সাইটের ভেতরের পাতা', d: 'দোকানের ভেতরের কোন তাকে যাবেন, সেটা। সাইটের নাম ঠিক থাকলে তবেই এই অংশ দেখার মানে আছে।' },
} as const

export default function UrlAnatomy() {
  const [sel, setSel] = useState<keyof typeof INFO>('host')
  const p = splitUrl(SAMPLE)!
  const parts: { id: keyof typeof INFO; text: string }[] = [
    { id: 'scheme', text: p.scheme },
    { id: 'host', text: p.host },
    { id: 'path', text: p.path },
  ]
  return (
    <div className="card space-y-3 p-4" data-testid="url-anatomy">
      <p className="font-semibold">একটি ওয়েব ঠিকানার (URL) অংশগুলো — প্রতিটিতে ক্লিক করে দেখুন</p>
      <div className="flex flex-wrap items-center gap-1 rounded-xl p-3 font-mono text-lg" style={{ background: 'var(--c-sunken)' }}>
        {parts.map((x) => (
          <button key={x.id} type="button" aria-pressed={sel === x.id} onClick={() => setSel(x.id)} className="btn btn-outline" style={sel === x.id ? { borderWidth: 3 } : undefined}>
            {x.text}
          </button>
        ))}
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-live="polite" data-testid="url-info">
        <p className="font-semibold">{INFO[sel].t}</p>
        <p className="mt-1 text-sm">{INFO[sel].d}</p>
      </div>
    </div>
  )
}
