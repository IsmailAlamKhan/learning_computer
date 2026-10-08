import { useState } from 'react'
import { checkLink, displayMismatch } from './lib/linkCheck'

interface Sample {
  id: string
  shown: string
  real: string
  contextBn: string
}

const SAMPLES: Sample[] = [
  { id: 'a', shown: 'takapay.example/offers', real: 'https://takapay.example/offers', contextBn: 'অ্যাপের নিজস্ব অফারের খবরে থাকা লিংক' },
  { id: 'b', shown: 'takapay.example/verify', real: 'http://takapay-verify.example/login', contextBn: '“অ্যাকাউন্ট যাচাই করুন” লেখা একটি ইমেইলের লিংক' },
  { id: 'c', shown: 'এখানে ক্লিক করে পুরস্কার নিন', real: 'https://takapay.example.prize-claim.example.net/win', contextBn: 'একটি অচেনা বার্তায় থাকা লিংক' },
  { id: 'd', shown: 'namunabank.example/statement', real: 'https://namunabank.example/statement', contextBn: 'ব্যাংকের স্টেটমেন্ট ইমেইলের লিংক' },
  { id: 'e', shown: 'takapay.example', real: 'https://takap4y.example/', contextBn: 'সামাজিক মাধ্যমের একটি পোস্টের লিংক' },
]

export default function PhishingLinkCheck() {
  const [hover, setHover] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [typed, setTyped] = useState('')
  const typedResult = typed.trim() ? checkLink(typed) : null
  const sevIcon = { danger: '🚩', warn: '⚠️', info: 'ℹ️', ok: '✅' } as const

  return (
    <div className="card space-y-3 p-4" data-testid="phishing-link-check">
      <p className="m-0 font-semibold">লিংকের লেখা বনাম আসল ঠিকানা</p>
      <p className="m-0 text-sm">নিচের প্রতিটি লিংকের ওপর মাউসের তীর রাখুন (ফোনে আঙুল চেপে ধরে রাখুন, বা কিবোর্ডে Tab চেপে যান)। তখন পর্দার নিচে আসল ঠিকানা ভেসে ওঠে। এটি অনুশীলন — আসলে কোথাও যাচ্ছে না।</p>
      <ul className="m-0 list-none space-y-2 p-0">
        {SAMPLES.map((s) => {
          const r = checkLink(s.real)
          const mism = displayMismatch(s.shown, s.real)
          const bad = r.verdict === 'suspicious' || mism
          return (
            <li key={s.id} className="rounded-lg p-3" style={{ background: 'var(--c-sunken)' }} data-sample={s.id}>
              <div className="text-xs" style={{ color: 'var(--c-muted)' }}>{s.contextBn}</div>
              <a
                href="#phishing-demo"
                data-testid={`link-${s.id}`}
                className="font-medium underline"
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(s.id)}
                onBlur={() => setHover(null)}
              >
                {s.shown}
              </a>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" className="btn btn-outline" data-testid={`reveal-${s.id}`} onClick={() => setRevealed((x) => ({ ...x, [s.id]: true }))}>
                  আসল ঠিকানা কী দেখি
                </button>
              </div>
              {revealed[s.id] && (
                <div className="mt-2 space-y-1 text-sm" data-testid={`result-${s.id}`} data-bad={bad ? 'yes' : 'no'}>
                  <p className="m-0">
                    <strong>{bad ? '🚩 সন্দেহজনক' : '✅ ঠিক মনে হচ্ছে'}</strong> — আসল ঠিকানা: <code>{s.real}</code>
                  </p>
                  {mism && <p className="m-0">লেখা এক ঠিকানা, কিন্তু আসলে যাচ্ছে অন্য ঠিকানায়।</p>}
                  {r.findings.map((f) => (
                    <p key={f.id} className="m-0">{sevIcon[f.severity]} {f.textBn}</p>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <div className="rounded-lg border-2 px-3 py-2 font-mono text-sm" style={{ borderColor: 'var(--c-line)', minHeight: '2.5rem' }} data-testid="status-bar" aria-live="polite">
        {hover ? <>🔗 {SAMPLES.find((x) => x.id === hover)!.real}</> : <span style={{ color: 'var(--c-muted)' }}>(এখানে আসল ঠিকানা দেখা যাবে)</span>}
      </div>
      <div className="space-y-2">
        <label className="font-semibold" htmlFor="link-try">নিজে একটি লিংক লিখে দেখুন (ইচ্ছে হলে)</label>
        <input id="link-try" className="w-full rounded-lg border-2 px-3 py-2" style={{ borderColor: 'var(--c-line)' }} placeholder="যেমন: http://takapay-login.example/verify" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
        {typedResult && (
          <div className="space-y-1 text-sm" data-testid="typed-result">
            {typedResult.verdict === 'invalid' ? (
              <p className="m-0">এটি ঠিকানার মতো দেখাচ্ছে না। একটি ওয়েব ঠিকানা লিখুন।</p>
            ) : (
              <>
                <p className="m-0"><strong>{typedResult.verdict === 'suspicious' ? '🚩 সন্দেহজনক' : '✅ বড় কোনো সন্দেহ পাইনি'}</strong> — আসল মালিকের নাম (ডোমেইন): <code>{typedResult.domain}</code></p>
                {typedResult.findings.map((f) => <p key={f.id} className="m-0">{sevIcon[f.severity]} {f.textBn}</p>)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
