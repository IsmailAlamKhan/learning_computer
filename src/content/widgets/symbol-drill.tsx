import { useRef, useState } from 'react'
import { SYMBOLS, howToType, judgeKey, whereBn } from '../../lib/symbols'
import { KeyboardSvg, Keycap } from './parts/KeyboardSvg'
import { useProgress } from '../../state/store'
import { useFmt } from '../../ui/useFmt'

type Feedback = { tone: 'ok' | 'soft'; text: string } | null

const keyId = (base: string) => base

/** Learn programming symbols: big symbol + name + where the key is + how to type + typed practice (detects KeyboardEvent.key). */
export default function SymbolDrill() {
  const { profile } = useProgress()
  const { n } = useFmt()
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState<string[]>([])
  const [fb, setFb] = useState<Feedback>(null)
  const ref = useRef<HTMLInputElement>(null)
  const sym = SYMBOLS[idx]
  const how = howToType(sym.char)!
  const highlight = how.needsShift ? ['shift-l', 'shift-r', keyId(how.baseChar)] : [keyId(how.baseChar)]

  const go = (i: number) => {
    setIdx((i + SYMBOLS.length) % SYMBOLS.length)
    setFb(null)
    window.setTimeout(() => ref.current?.focus(), 0)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const j = judgeKey(sym.char, e.key)
    if (j.kind === 'ignore') return
    e.preventDefault()
    switch (j.kind) {
      case 'correct':
        setDone((d) => (d.includes(sym.char) ? d : [...d, sym.char]))
        setFb({ tone: 'ok', text: `ঠিক হয়েছে! “${sym.char}” লিখে ফেলেছেন।` })
        break
      case 'needs-shift':
        setFb({ tone: 'soft', text: `প্রায় হয়েছে! কী-টি ঠিকই, এবার Shift চেপে ধরে রেখে ওই কী চাপুন। (আপনি পেয়েছেন “${e.key}”)` })
        break
      case 'too-much-shift':
        setFb({ tone: 'soft', text: `এই চিহ্নের জন্য Shift লাগে না। Shift ছেড়ে শুধু কী-টি চাপুন। (আপনি পেয়েছেন “${e.key}”)` })
        break
      case 'non-latin':
        setFb({ tone: 'soft', text: 'বাংলা অক্ষর এসেছে — কিবোর্ড এখন বাংলায় আছে। ইংরেজি (ENG) কিবোর্ডে বদলে নিয়ে আবার চেষ্টা করুন।' })
        break
      default:
        setFb({ tone: 'soft', text: `এটি অন্য একটি চিহ্ন (“${e.key}”)। কোনো সমস্যা নেই — নিচের ছবিতে কমলা ঘেরা কী-টি দেখে আবার চেষ্টা করুন।` })
    }
  }

  return (
    <section className="card space-y-4" aria-label="প্রোগ্রামিংয়ের চিহ্ন শেখা">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-lg font-bold">প্রোগ্রামিংয়ের চিহ্ন চিনি</h3>
        <span className="text-sm text-muted" data-testid="symbol-progress">শেখা হয়েছে: {n(done.length)} / {n(SYMBOLS.length)}</span>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="চিহ্ন বেছে নিন">
        {SYMBOLS.map((s, i) => (
          <button
            key={s.char}
            type="button"
            aria-label={`চিহ্ন ${s.char} — ${s.nameEn}`}
            aria-pressed={i === idx}
            data-symbol={s.char}
            onClick={() => go(i)}
            className="min-h-12 min-w-12 rounded-lg border-2 font-mono text-xl font-bold"
            style={{ borderColor: i === idx ? 'var(--c-brand)' : 'var(--c-line)', background: done.includes(s.char) ? 'var(--c-ok-soft)' : 'var(--c-surface)', color: 'var(--c-ink)' }}
          >
            {s.char}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-2xl font-mono text-7xl font-bold" data-testid="symbol-big" style={{ background: 'var(--c-brand-soft)', color: 'var(--c-ink)' }} aria-label={`চিহ্ন: ${sym.char}`}>
          {sym.char}
        </div>
        <div className="space-y-1">
          <div className="text-xl font-bold" data-testid="symbol-name">{sym.nameBn}</div>
          <div className="text-muted">{sym.nameEn}</div>
          <div>কোথায় লাগে: {sym.useBn}{sym.example && <> — <code className="rounded px-1" style={{ background: 'var(--c-sunken)' }}>{sym.example}</code></>}</div>
        </div>
      </div>

      <div className="space-y-2 rounded-xl p-3" style={{ background: 'var(--c-sunken)' }}>
        <div className="font-medium">কিবোর্ডের কোথায়? <span className="font-normal text-muted">{whereBn(sym.char)}</span></div>
        <KeyboardSvg os={profile.os} highlight={highlight} title={`কিবোর্ডের ছবি — “${sym.char}” কী কমলা রঙে ঘেরা`} />
        <div className="flex flex-wrap items-center gap-2" data-testid="symbol-how">
          <span className="font-medium">কীভাবে লিখবেন:</span>
          {how.keys.map((k, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">+</span>}
              <Keycap>{k}</Keycap>
            </span>
          ))}
          <span className="text-sm text-muted">{how.needsShift ? '(Shift চেপে ধরে রেখে ওই কী চাপুন)' : '(Shift ছাড়াই, শুধু এই কী)'}</span>
        </div>
        <p className="m-0 text-sm text-muted">
          Mac-এও একই — এই চিহ্নগুলোর জন্য Option কী লাগে না। আপনার কিবোর্ডে কী-এর জায়গা একটু আলাদা হতে পারে (বিশেষ করে \ | “ ” # @), তখন কী-এর গায়ে ছাপা চিহ্নটি দেখে নিন।
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="symbol-input" className="font-medium">
          এবার নিজে চেপে দেখুন: নিচের ঘরে ক্লিক করে <code>{sym.char}</code> লিখুন
        </label>
        <input id="symbol-input" ref={ref} data-testid="symbol-input" className="field font-mono text-xl" autoComplete="off" spellCheck={false} readOnly value="" placeholder="এখানে ক্লিক করে কী চাপুন" onKeyDown={onKey} />
        <p className="m-0 min-h-12 rounded-xl p-3" role="status" aria-live="polite" data-testid="symbol-feedback" data-tone={fb?.tone} style={{ background: fb?.tone === 'ok' ? 'var(--c-ok-soft)' : 'var(--c-accent-soft)' }}>
          {fb ? fb.text : 'কী চাপলে এখানে বলে দেব ঠিক হলো কিনা।'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline" onClick={() => go(idx - 1)}>← আগের চিহ্ন</button>
        <button type="button" className="btn" onClick={() => go(idx + 1)} data-testid="symbol-next">পরের চিহ্ন →</button>
      </div>
    </section>
  )
}
