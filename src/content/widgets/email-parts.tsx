import { useState } from 'react'
import { addressParts } from './lib/emailParts'

const EXAMPLES = ['anika.rahman@mail.example', 'tanvir@school.example', 'lovely_girl_99@mail.example']

/** Type or pick an email address and see its parts: name (username), @, domain. */
export default function EmailParts() {
  const [text, setText] = useState(EXAMPLES[0])
  const p = addressParts(text)
  return (
    <div className="card space-y-3 p-4" data-testid="email-parts">
      <p className="font-semibold">ইমেইল ঠিকানার অংশগুলো দেখুন</p>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button key={e} type="button" className="btn btn-outline" onClick={() => setText(e)}>
            {e}
          </button>
        ))}
      </div>
      <input aria-label="Email address" value={text} onChange={(e) => setText(e.target.value)} className="min-h-11 w-full rounded border border-gray-400 bg-white px-3 text-gray-900" />
      <div className="flex flex-wrap items-end gap-1 text-lg" data-testid="email-parts-view" aria-live="polite">
        <span className="rounded bg-sky-100 px-2 py-1 text-sky-900">{p.name || '…'}</span>
        <span className="px-1 font-bold">@</span>
        <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-900">{p.domain || '…'}</span>
      </div>
      <ul className="space-y-1 text-sm">
        <li><span className="text-sky-800">নীল অংশ</span> = নাম বা ইউজারনেম: ডাকবাক্সটি কার।</li>
        <li><b>@</b> (অ্যাট) = “-এ” বোঝায়: এই নামটি ওই জায়গায়।</li>
        <li><span className="text-emerald-800">সবুজ অংশ</span> = ডোমেইন: কোন ইমেইল সেবা বা প্রতিষ্ঠানের ডাকঘর।</li>
      </ul>
      <p className="text-sm" data-testid="email-parts-verdict">
        {p.valid ? '✓ এটি একটি ঠিক গড়নের ঠিকানা।' : 'এখনও ঠিক গড়ন হয়নি — নাম, @ আর ডোমেইন (মাঝে একটি ডট সহ) লাগবে।'}
      </p>
      {text.includes('_99') && <p className="text-sm text-gray-600">চাকরি বা কোডিংয়ের অ্যাকাউন্টের জন্য এমন মজার নাম না রেখে নিজের নামের মতো ঠিকানা (firstname.lastname) রাখাই ভালো।</p>}
    </div>
  )
}
