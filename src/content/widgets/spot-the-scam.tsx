import { useState } from 'react'
import { CARDS, evaluateCard, finalMessageBn, type ScamCard, type Part } from './lib/scamCards'

type Phase = 'play' | 'result'

function PartBtn({ part, on, locked, reveal, onTap }: { part: Part; on: boolean; locked: boolean; reveal: boolean; onTap: () => void }) {
  const showHot = reveal && part.hot
  const style: React.CSSProperties = showHot
    ? { background: 'var(--c-accent-soft)', outline: '2px solid var(--c-accent)', borderRadius: 6 }
    : on
      ? { background: 'var(--c-brand-soft)', outline: '2px solid var(--c-brand)', borderRadius: 6 }
      : {}
  return (
    <button type="button" data-part={part.id} data-hot={part.hot ? 'yes' : 'no'} aria-pressed={on} disabled={locked} onClick={onTap} className="inline cursor-pointer border-0 bg-transparent p-0.5 text-left text-inherit underline decoration-dotted underline-offset-4" style={style}>
      {part.text}
    </button>
  )
}

function Mock({ card, tapped, locked, reveal, tap }: { card: ScamCard; tapped: string[]; locked: boolean; reveal: boolean; tap: (id: string) => void }) {
  const mk = (p: Part) => <PartBtn key={p.id} part={p} on={tapped.includes(p.id)} locked={locked} reveal={reveal} onTap={() => tap(p.id)} />
  const of = (a: Part['area']) => card.parts.filter((p) => p.area === a)
  const from = of('from')
  const subject = of('subject')
  const body = of('body')
  const link = of('link')
  const shell = { border: '2px solid var(--c-line)', background: 'var(--c-surface)' }

  if (card.kind === 'sms' || card.kind === 'dm')
    return (
      <div className="mx-auto max-w-sm rounded-[28px] p-3" style={shell} aria-label={card.captionBn}>
        <div className="mb-2 flex items-center gap-2 border-b pb-2 text-sm font-semibold" style={{ borderColor: 'var(--c-line)' }}>
          <span aria-hidden="true">{card.kind === 'sms' ? '💬' : '👤'}</span>
          {from.map(mk)}
        </div>
        <div className="rounded-2xl rounded-tl-sm p-3 leading-relaxed" style={{ background: 'var(--c-sunken)' }}>
          {body.map(mk)}
          {link.length > 0 && <span> {link.map(mk)}</span>}
        </div>
      </div>
    )
  if (card.kind === 'email')
    return (
      <div className="rounded-xl p-3" style={shell} aria-label={card.captionBn}>
        <div className="space-y-1 border-b pb-2 text-sm" style={{ borderColor: 'var(--c-line)' }}>
          <div><span style={{ color: 'var(--c-muted)' }}>প্রেরক: </span>{from.map(mk)}</div>
          <div><span style={{ color: 'var(--c-muted)' }}>বিষয়: </span><strong>{subject.map(mk)}</strong></div>
          <div style={{ color: 'var(--c-muted)' }}>প্রাপক: আপনি</div>
        </div>
        <div className="space-y-2 pt-2 leading-relaxed">
          <p className="m-0">{body.map(mk)}</p>
          {link.length > 0 && <p className="m-0"><span className="btn btn-outline inline-block">{link.map(mk)}</span></p>}
        </div>
      </div>
    )
  if (card.kind === 'call')
    return (
      <div className="mx-auto max-w-sm rounded-[28px] p-4" style={shell} aria-label={card.captionBn}>
        <div className="mb-3 text-center">
          <div className="text-4xl" aria-hidden="true">📞</div>
          <div className="mt-1 font-semibold">{from.map(mk)}</div>
          <div className="text-sm" style={{ color: 'var(--c-muted)' }}>কল চলছে…</div>
        </div>
        <div className="rounded-2xl p-3 leading-relaxed" style={{ background: 'var(--c-sunken)' }}>
          <div className="mb-1 text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>অপর প্রান্ত থেকে যা বলছে (লেখা রূপ)</div>
          {body.map(mk)}
        </div>
      </div>
    )
  // popup
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-lg" style={shell} aria-label={card.captionBn}>
      <div className="flex items-center justify-between px-3 py-1.5 text-sm font-semibold" style={{ background: 'var(--c-accent-soft)' }}>
        <span>{from.map(mk)}</span>
        <span aria-hidden="true">✕</span>
      </div>
      <div className="space-y-3 p-4 text-center leading-relaxed">
        <div className="text-4xl" aria-hidden="true">⚠️</div>
        <p className="m-0">{body.map(mk)}</p>
        {link.length > 0 && <div><span className="btn inline-block">{link.map(mk)}</span></div>}
      </div>
    </div>
  )
}

export default function SpotTheScam({ cards = CARDS }: { cards?: ScamCard[] }) {
  const [idx, setIdx] = useState(0)
  const [tapped, setTapped] = useState<string[]>([])
  const [answer, setAnswer] = useState<null | boolean>(null) // her verdict: true = scam
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('play')
  const card = cards[idx]
  const answered = answer !== null
  const ev = answered ? evaluateCard(card, tapped, answer) : null

  const tap = (id: string) => setTapped((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))
  const decide = (scam: boolean) => {
    setAnswer(scam)
    if (scam === card.isScam) setScore((s) => s + 1)
  }
  const next = () => {
    if (idx + 1 >= cards.length) return setPhase('result')
    setIdx(idx + 1)
    setTapped([])
    setAnswer(null)
  }
  const restart = () => {
    setIdx(0)
    setTapped([])
    setAnswer(null)
    setScore(0)
    setPhase('play')
  }

  if (phase === 'result')
    return (
      <div className="card space-y-3 p-4" data-testid="scam-result">
        <p className="m-0 text-lg font-semibold">আপনার স্কোর: {score} / {cards.length}</p>
        <p className="m-0">{finalMessageBn(score, cards.length)}</p>
        <button type="button" className="btn" onClick={restart}>আবার খেলি</button>
      </div>
    )

  return (
    <div className="card space-y-3 p-4" data-testid="spot-the-scam">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 font-semibold">সন্দেহজনক নাকি নিরাপদ? ({idx + 1}/{cards.length})</p>
        <span className="chip">{card.captionBn}</span>
      </div>
      <p className="m-0 text-sm" style={{ color: 'var(--c-muted)' }}>
        নিচের কার্ডটি একটি কল্পিত নমুনা — নাম, নম্বর ও লিংক সবই বানানো। যে অংশগুলো সন্দেহজনক মনে হয় সেগুলোতে ট্যাপ করুন, তারপর নিচে আপনার সিদ্ধান্ত জানান। কিছু বার্তা কিন্তু একদম ঠিকও থাকতে পারে।
      </p>
      <Mock card={card} tapped={tapped} locked={answered} reveal={answered} tap={tap} />
      {!answered ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn" data-testid="verdict-safe" onClick={() => decide(false)}>✅ নিরাপদ মনে হচ্ছে</button>
          <button type="button" className="btn btn-outline" data-testid="verdict-scam" onClick={() => decide(true)}>🚩 প্রতারণা মনে হচ্ছে</button>
        </div>
      ) : (
        <div className="space-y-2 rounded-xl p-3" style={{ background: ev!.correct ? 'var(--c-ok-soft)' : 'var(--c-accent-soft)' }} aria-live="polite" data-testid="scam-feedback" data-correct={ev!.correct ? 'yes' : 'no'}>
          <p className="m-0 font-semibold">{ev!.correct ? (card.isScam ? 'ঠিক ধরেছেন!' : 'ঠিক! এটি সত্যিই নিরাপদ।') : card.isScam ? 'এবার ফসকে গেছে, তবে এতে ক্ষতি নেই — এখানেই শেখা।' : 'একটু বেশি সাবধান হয়ে গেছেন — এটি আসলে ঠিক ছিল। সাবধান থাকা ভালো, তবে সবকিছুকে ভয় পাওয়ার দরকার নেই।'}</p>
          <p className="m-0">{card.explanationBn}</p>
          {card.hotspots.length > 0 && (
            <ul className="m-0 list-disc space-y-1 pl-5 text-sm">
              {card.hotspots.map((h) => (
                <li key={h.id}>
                  <strong>{h.labelBn}</strong>
                  {ev!.foundHotspots.includes(h.id) ? ' ✓ আপনি ধরেছেন' : ' — এটি চোখ এড়িয়ে গিয়েছিল'}: {h.whyBn}
                </li>
              ))}
            </ul>
          )}
          {!card.isScam && ev!.extraTaps.length > 0 && <p className="m-0 text-sm">আপনি যে অংশগুলো চিহ্নিত করেছিলেন সেগুলোতে আসলে সমস্যা নেই — তবে সন্দেহ জাগলে যাচাই করাই ভালো।</p>}
          <p className="m-0"><strong>কী করবেন:</strong> {card.doBn}</p>
          <button type="button" className="btn" data-testid="scam-next" onClick={next}>{idx + 1 >= cards.length ? 'ফলাফল দেখি' : 'পরের কার্ড →'}</button>
        </div>
      )}
    </div>
  )
}
