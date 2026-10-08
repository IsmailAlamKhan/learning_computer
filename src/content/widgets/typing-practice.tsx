import { useEffect, useRef, useState } from 'react'
import { LEVELS, accuracy, applyInput, diffChars, encouragementBn, liveWpm, newSession, type CharState, type Session } from '../../lib/typing'
import { useFmt } from '../../ui/useFmt'

const STYLE: Record<CharState, React.CSSProperties> = {
  correct: { background: 'var(--c-ok-soft)', color: 'var(--c-ok)' },
  // gentle amber + underline, never a harsh red
  wrong: { background: 'var(--c-accent-soft)', color: 'var(--c-ink)', textDecoration: 'underline', textDecorationColor: 'var(--c-accent)', textDecorationThickness: '3px', textUnderlineOffset: '4px' },
  current: { background: 'var(--c-brand-soft)', color: 'var(--c-ink)', boxShadow: 'inset 0 -4px 0 var(--c-brand)' },
  pending: { color: 'var(--c-muted)' },
}

/** Typing practice with live, gentle feedback: levels from home-row letters to code-like snippets. */
export default function TypingPractice() {
  const { n } = useFmt()
  const [levelIdx, setLevelIdx] = useState(0)
  const [textIdx, setTextIdx] = useState(0)
  const [session, setSession] = useState<Session>(newSession)
  const [now, setNow] = useState(() => Date.now())
  const [caps, setCaps] = useState(false)
  const [nonLatin, setNonLatin] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const level = LEVELS[levelIdx]
  const target = level.texts[textIdx % level.texts.length]
  const chars = diffChars(target, session.typed)
  const acc = accuracy(session)
  const wpm = liveWpm(session, target, now)
  const done = session.finishedAt !== null

  useEffect(() => {
    if (session.startedAt === null || done) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [session.startedAt, done])

  const reset = (li = levelIdx, ti = textIdx) => {
    setLevelIdx(li)
    setTextIdx(ti)
    setSession(newSession())
    setNonLatin(false)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <section className="card space-y-3" aria-label="টাইপিং অনুশীলন">
      <h3 className="m-0 text-lg font-bold">টাইপিং অনুশীলন</h3>
      <div role="tablist" aria-label="স্তর" className="flex flex-wrap gap-2">
        {LEVELS.map((l, i) => (
          <button key={l.id} role="tab" type="button" aria-selected={i === levelIdx} data-level={l.id} onClick={() => reset(i, 0)} className={`btn ${i === levelIdx ? '' : 'btn-outline'}`}>
            {l.titleBn}
          </button>
        ))}
      </div>
      <p className="m-0 text-sm text-muted">{level.introBn}</p>

      <p data-testid="typing-target" aria-label={`লিখতে হবে: ${target}`} className="m-0 rounded-xl p-3 font-mono text-2xl leading-[2.4rem] tracking-wide" style={{ background: 'var(--c-sunken)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {chars.map((c, i) => (
          <span key={i} data-state={c.state} style={{ ...STYLE[c.state], borderRadius: 4, padding: '0 1px' }}>
            {c.char === ' ' ? ' ' : c.char}
          </span>
        ))}
      </p>

      <input
        ref={inputRef}
        data-testid="typing-input"
        aria-label="এখানে ওপরের লেখাটি টাইপ করুন"
        className="field font-mono text-xl"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={session.typed}
        disabled={done}
        placeholder="এখানে ক্লিক করে লেখা শুরু করুন"
        onKeyDown={(e) => {
          setCaps(e.getModifierState?.('CapsLock') ?? false)
          if (e.key.length === 1 && e.key.charCodeAt(0) > 0x24f) setNonLatin(true)
          else if (e.key.length === 1) setNonLatin(false)
        }}
        onChange={(e) => setSession((s) => applyInput(s, target, e.target.value, Date.now()))}
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1" aria-live="polite">
        <span data-testid="typing-accuracy">সঠিক বসেছে: <strong>{n(acc)}%</strong></span>
        {wpm !== null && <span className="text-sm text-muted" data-testid="typing-wpm">গতি: প্রায় {n(wpm)} শব্দ/মিনিট (WPM)</span>}
      </div>
      <p className="m-0 rounded-xl p-3" role="status" data-testid="typing-message" style={{ background: 'var(--c-brand-soft)' }}>
        {encouragementBn(session, target, textIdx + levelIdx)}
      </p>
      {caps && <p className="m-0 text-sm" role="note" style={{ color: 'var(--c-accent)' }}>Caps Lock চালু আছে মনে হচ্ছে — সব অক্ষর বড় হাতের হবে। একবার Caps Lock চাপলে বন্ধ হবে।</p>}
      {nonLatin && <p className="m-0 text-sm" role="note" style={{ color: 'var(--c-accent)' }}>বাংলা অক্ষর বসছে — মনে হয় কিবোর্ড এখন বাংলায় আছে। কোড লিখতে ইংরেজি (ENG) কিবোর্ডে ফিরে আসুন।</p>}

      <div className="flex flex-wrap gap-2">
        {done && (
          <button type="button" className="btn" onClick={() => reset(levelIdx, (textIdx + 1) % level.texts.length)}>
            পরের অনুশীলন →
          </button>
        )}
        <button type="button" className="btn btn-outline" onClick={() => reset()}>
          ↺ আবার শুরু
        </button>
      </div>
    </section>
  )
}
