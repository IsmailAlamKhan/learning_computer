import { useState } from 'react'
import { BIT_WEIGHTS, CHALLENGES, UNICODE_SAMPLES, bitsToString, bitsToValue, charFor, checkChallenge, toggleBit } from './lib/bits'

export default function ToggleBits() {
  const [bits, setBits] = useState<boolean[]>(Array(8).fill(false))
  const [target, setTarget] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const value = bitsToValue(bits)
  const ch = charFor(value)

  const flip = (i: number) => {
    const next = toggleBit(bits, i)
    setBits(next)
    if (target !== null) {
      const r = checkChallenge(target, next)
      setMsg({ ok: r.ok, text: r.messageBn })
    }
  }
  const startChallenge = (t: number) => {
    setTarget(t)
    setBits(Array(8).fill(false))
    setMsg({ ok: false, text: `লক্ষ্য: সুইচ চালু-বন্ধ করে সংখ্যাটি ${t} বানান।` })
  }

  return (
    <div className="card space-y-4 p-4" data-testid="toggle-bits">
      <p className="font-semibold">৮টি সুইচ (বিট) — চালু করে দেখুন কী সংখ্যা হয়</p>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Eight bit switches">
        {bits.map((on, i) => (
          <button
            key={i}
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={`Bit worth ${BIT_WEIGHTS[i]}`}
            data-testid={`bit-${i}`}
            onClick={() => flip(i)}
            className="flex min-h-14 min-w-12 flex-col items-center justify-center rounded-xl border-2 px-2 py-1"
            style={{ borderColor: on ? 'var(--c-brand)' : 'var(--c-line)', background: on ? 'var(--c-brand-soft)' : 'var(--c-sunken)' }}
          >
            <span className="text-xl font-bold">{on ? 1 : 0}</span>
            <span className="text-xs" style={{ color: 'var(--c-muted)' }}>{BIT_WEIGHTS[i]}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-2 text-center sm:grid-cols-3">
        <div className="rounded-lg p-2" style={{ background: 'var(--c-sunken)' }}>
          <div className="text-xs" style={{ color: 'var(--c-muted)' }}>বিট</div>
          <div className="font-mono text-lg" data-testid="bits-string">{bitsToString(bits)}</div>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'var(--c-sunken)' }}>
          <div className="text-xs" style={{ color: 'var(--c-muted)' }}>সংখ্যা</div>
          <div className="text-lg font-bold" data-testid="bits-value">{value}</div>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'var(--c-sunken)' }}>
          <div className="text-xs" style={{ color: 'var(--c-muted)' }}>এই সংখ্যার অক্ষর</div>
          <div className="text-lg font-bold" data-testid="bits-char">{ch.char ?? '—'}</div>
        </div>
      </div>
      <p className="text-sm" data-testid="bits-note" style={{ color: 'var(--c-muted)' }}>{ch.noteBn}</p>

      <div className="space-y-2">
        <p className="font-semibold">ছোট চ্যালেঞ্জ</p>
        <div className="flex flex-wrap gap-2">
          {CHALLENGES.map((t) => (
            <button key={t} type="button" className={`btn ${target === t ? '' : 'btn-outline'}`} data-testid={`challenge-${t}`} onClick={() => startChallenge(t)}>
              সংখ্যা {t} বানান
            </button>
          ))}
        </div>
        {msg && (
          <p aria-live="polite" data-testid="challenge-feedback" data-ok={msg.ok ? 'yes' : 'no'}>
            {msg.ok ? '✅ ' : ''}
            {msg.text}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="font-semibold">ইউনিকোড (Unicode): প্রত্যেক অক্ষরের একটি সংখ্যা</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {UNICODE_SAMPLES.map((u) => (
            <li key={u.char} className="flex items-center gap-3 rounded-lg p-2" style={{ background: 'var(--c-sunken)' }} data-testid={`unicode-${u.code}`}>
              <span className="text-2xl" aria-hidden="true">{u.char}</span>
              <span>
                {u.nameBn}: <strong>{u.code}</strong> <span className="font-mono text-xs" style={{ color: 'var(--c-muted)' }}>(U+{u.hex})</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>বাংলা অক্ষর বা ইমোজির সংখ্যা ২৫৫-এর চেয়ে বড়, তাই সেগুলো ৮টির বেশি সুইচ (একাধিক বাইট) দিয়ে লেখা হয়। মুখস্থ করার দরকার নেই — শুধু বুঝে রাখুন, কম্পিউটার সবকিছু সংখ্যা দিয়ে মনে রাখে।</p>
      </div>
    </div>
  )
}
