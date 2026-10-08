import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { CHALLENGE_IDS, PARTS, PARTS_BY_ID, allSeen, challengeQuestion, checkChallenge, markSeen, seenLabel } from './lib/computerParts'

const INK = 'var(--c-ink)'
const FILL = 'var(--c-sunken)'
const SURF = 'var(--c-surface)'
const BRAND = 'var(--c-brand)'
const SOFT = 'var(--c-brand-soft)'

/** One clickable region of the picture. `hit` is an invisible bigger target for tiny parts. */
function Hot({ id, active, seen, onPick, hit, children }: { id: string; active: boolean; seen: boolean; onPick: (id: string) => void; hit?: { x: number; y: number; w: number; h: number }; children: ReactNode }) {
  const p = PARTS_BY_ID[id]
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPick(id)
    }
  }
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${p.en}`}
      data-part={id}
      data-seen={seen ? 'yes' : 'no'}
      onClick={() => onPick(id)}
      onKeyDown={onKey}
      style={{ cursor: 'pointer', color: active ? BRAND : INK }}
      className="parts-hot"
    >
      {hit && <rect x={hit.x} y={hit.y} width={hit.w} height={hit.h} fill="transparent" />}
      <g strokeWidth={active ? 4 : 2}>{children}</g>
    </g>
  )
}

export default function ComputerParts() {
  const [seen, setSeen] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<{ index: number; msg: string; done: boolean } | null>(null)

  const pick = (id: string) => {
    if (quiz && !quiz.done) {
      if (checkChallenge(quiz.index, id)) {
        const next = quiz.index + 1
        setQuiz(next >= CHALLENGE_IDS.length ? { index: next, done: true, msg: 'চমৎকার! সবগুলো ঠিক চিনেছেন।' } : { index: next, done: false, msg: 'ঠিক! এবার পরেরটি।' })
      } else {
        setQuiz({ ...quiz, msg: `এটি ${PARTS_BY_ID[id].bn}। আবার চেষ্টা করুন — ভুল হলে কোনো ক্ষতি নেই।` })
      }
      return
    }
    setSelected(id)
    setSeen((s) => markSeen(s, id))
  }

  const active = (id: string) => (quiz && !quiz.done ? false : selected === id)
  const sn = (id: string) => seen.includes(id)
  const common = (id: string) => ({ id, active: !!active(id), seen: sn(id), onPick: pick })
  const fillFor = (id: string, dflt = FILL) => (active(id) ? SOFT : sn(id) && !quiz ? SURF : dflt)
  const part = selected ? PARTS_BY_ID[selected] : null
  const inQuiz = !!quiz && !quiz.done

  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }} data-widget="computer-parts">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold">ল্যাপটপের বিভিন্ন অংশ — ছবির যেকোনো অংশে ক্লিক করুন</p>
        <span data-testid="parts-progress" className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: 'var(--c-brand-soft)', color: 'var(--c-ink)' }}>
          {seenLabel(seen)} অংশ দেখা হয়েছে
        </span>
      </div>

      <style>{`.parts-hot:focus-visible{outline:3px solid var(--c-focus);outline-offset:2px}`}</style>
      <svg viewBox="0 0 660 390" role="group" aria-label="ল্যাপটপের ছবি" className="mx-auto block w-full max-w-2xl" fill="none" stroke="currentColor" style={{ color: INK }}>
        {/* base / system unit */}
        <Hot {...common('cpu')}>
          <path d="M110 245 H550 L590 355 H70 Z" fill={fillFor('cpu')} stroke="currentColor" strokeLinejoin="round" />
          <text x="330" y="372" textAnchor="middle" fontSize="11" fill="currentColor" stroke="none">ভেতরে সিপিইউ</text>
        </Hot>
        {/* screen */}
        <Hot {...common('monitor')}>
          <rect x="140" y="20" width="380" height="225" rx="14" fill={fillFor('monitor', SURF)} stroke="currentColor" />
          <rect x="158" y="48" width="344" height="180" rx="4" fill={active('monitor') ? SOFT : 'var(--c-canvas)'} stroke="currentColor" strokeWidth="1.5" />
        </Hot>
        <Hot {...common('webcam')} hit={{ x: 300, y: 18, w: 60, h: 28 }}>
          <circle cx="330" cy="34" r="6" fill={fillFor('webcam', INK)} />
        </Hot>
        <Hot {...common('wifi')} hit={{ x: 440, y: 54, w: 56, h: 40 }}>
          <path d="M452 74 q18 -16 36 0 M459 82 q11 -10 22 0" strokeLinecap="round" />
          <circle cx="470" cy="89" r="2.5" fill="currentColor" />
        </Hot>
        {/* battery (inside) */}
        <Hot {...common('battery')} hit={{ x: 150, y: 312, w: 100, h: 34 }}>
          <rect x="160" y="320" width="76" height="22" rx="4" strokeDasharray="5 3" fill={fillFor('battery')} />
          <rect x="236" y="327" width="5" height="8" fill="currentColor" />
          <path d="M190 331 h18" strokeLinecap="round" />
        </Hot>
        {/* speakers */}
        <Hot {...common('speakers')} hit={{ x: 112, y: 250, w: 36, h: 56 }}>
          {[258, 268, 278, 288, 298].map((y) => (
            <path key={y} d={`M120 ${y} h22`} strokeLinecap="round" />
          ))}
        </Hot>
        <Hot {...common('speakers')} hit={{ x: 512, y: 250, w: 36, h: 56 }}>
          {[258, 268, 278, 288, 298].map((y) => (
            <path key={y} d={`M518 ${y} h22`} strokeLinecap="round" />
          ))}
        </Hot>
        {/* keyboard */}
        <Hot {...common('keyboard')}>
          <rect x="160" y="254" width="340" height="52" rx="5" fill={fillFor('keyboard', SURF)} />
          {[0, 1, 2].map((r) =>
            Array.from({ length: 14 }, (_, c) => <rect key={`${r}-${c}`} x={166 + c * 24} y={259 + r * 15} width="19" height="11" rx="2" strokeWidth="1" />),
          )}
        </Hot>
        {/* touchpad */}
        <Hot {...common('touchpad')}>
          <rect x="280" y="314" width="100" height="32" rx="6" fill={fillFor('touchpad', SURF)} />
        </Hot>
        {/* power button */}
        <Hot {...common('power-button')} hit={{ x: 504, y: 226, w: 40, h: 28 }}>
          <circle cx="524" cy="244" r="7" fill={fillFor('power-button', SURF)} />
          <path d="M524 240 v5" strokeLinecap="round" />
        </Hot>
        {/* ports on the side edges */}
        <Hot {...common('charging-port')} hit={{ x: 76, y: 300, w: 44, h: 36 }}>
          <rect x="92" y="316" width="18" height="8" rx="2" fill={fillFor('charging-port', INK)} />
        </Hot>
        <Hot {...common('usb-port')} hit={{ x: 540, y: 300, w: 44, h: 36 }}>
          <rect x="550" y="316" width="22" height="9" rx="2" fill={fillFor('usb-port', INK)} />
        </Hot>
        {/* charger: cable + adapter */}
        <Hot {...common('charger')} hit={{ x: 4, y: 290, w: 82, h: 50 }}>
          <path d="M92 320 H60" strokeLinecap="round" />
          <rect x="12" y="304" width="48" height="32" rx="5" fill={fillFor('charger')} />
          <path d="M30 304 v-8 M42 304 v-8" strokeLinecap="round" />
        </Hot>
        {/* external mouse */}
        <Hot {...common('mouse')} hit={{ x: 592, y: 250, w: 60, h: 80 }}>
          <rect x="604" y="262" width="36" height="56" rx="18" fill={fillFor('mouse', SURF)} />
          <path d="M622 262 v20 M604 282 h36" strokeWidth="1.5" />
        </Hot>
      </svg>

      <p className="sr-only" aria-live="polite">{seenLabel(seen)}</p>

      {inQuiz ? (
        <div role="status" data-testid="parts-quiz" className="mt-3 rounded-xl p-3" style={{ background: 'var(--c-accent-soft)' }}>
          <p className="font-semibold">নিজেকে যাচাই করুন ({quiz.index + 1}/{CHALLENGE_IDS.length}): {challengeQuestion(quiz.index)}</p>
          <p className="text-sm">ছবিতে সঠিক অংশটিতে ক্লিক করুন। {quiz.msg}</p>
        </div>
      ) : quiz?.done ? (
        <div role="status" data-testid="parts-quiz-done" className="mt-3 rounded-xl p-3" style={{ background: 'var(--c-ok-soft)' }}>
          <p className="font-semibold">{quiz.msg}</p>
        </div>
      ) : part ? (
        <div role="status" data-testid="parts-detail" className="mt-3 rounded-xl p-3" style={{ background: 'var(--c-brand-soft)' }}>
          <p className="font-semibold">{part.bn} <span className="font-normal">({part.en})</span></p>
          <p>{part.descBn}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm" style={{ color: 'var(--c-muted)' }}>যেকোনো অংশে ক্লিক করুন, বা কিবোর্ডের Tab চেপে এগিয়ে Enter চাপুন।</p>
      )}

      {!inQuiz && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="অংশের তালিকা">
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-chip={p.id}
              onClick={() => pick(p.id)}
              aria-pressed={selected === p.id}
              className="min-h-12 rounded-full border px-4 text-sm"
              style={{ borderColor: 'var(--c-line)', background: selected === p.id ? 'var(--c-brand-soft)' : sn(p.id) ? 'var(--c-ok-soft)' : 'var(--c-surface)', color: 'var(--c-ink)' }}
            >
              {sn(p.id) ? '✓ ' : ''}
              {p.bn}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-testid="parts-start-quiz"
          onClick={() => {
            setQuiz({ index: 0, done: false, msg: '' })
            setSelected(null)
          }}
          className="min-h-12 rounded-xl px-5 font-semibold"
          style={{ background: 'var(--c-brand)', color: 'var(--c-brand-ink)' }}
        >
          {quiz ? 'আবার যাচাই করি' : 'নিজেকে যাচাই করুন'}
        </button>
        {quiz && !quiz.done && (
          <button type="button" onClick={() => setQuiz(null)} className="min-h-12 rounded-xl border px-5" style={{ borderColor: 'var(--c-line)' }}>
            যাচাই বন্ধ করি
          </button>
        )}
        {allSeen(seen) && <span className="text-sm font-semibold" style={{ color: 'var(--c-ok)' }}>সবগুলো অংশ দেখা হয়ে গেছে!</span>}
      </div>
      <p className="mt-2 text-xs" style={{ color: 'var(--c-muted)' }}>ছবিটি শুধু বোঝার জন্য আঁকা। আপনার কম্পিউটারে অংশগুলো একটু আলাদা জায়গায় থাকতে পারে।</p>
    </div>
  )
}
