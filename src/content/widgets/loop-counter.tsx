import { useEffect, useState } from 'react'
import { loopStart, loopStep, repeatRounds, totalSpoons, type LoopState } from './lib/m16Logic'

/** “৫ বার করুন: এক চামচ চিনি দিন” — step or play through a loop, then answer a counting question. */
export default function LoopCounter() {
  const [total, setTotal] = useState(5)
  const [state, setState] = useState<LoopState>(() => loopStart(5))
  const [playing, setPlaying] = useState(false)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState<'none' | 'right' | 'wrong'>('none')

  // the question: 3 cups, 2 spoons each
  const cups = 3
  const each = 2

  useEffect(() => {
    if (!playing) return
    if (state.finished) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setState((s) => loopStep(s)), 700)
    return () => clearTimeout(t)
  }, [playing, state])

  const pick = (n: number) => {
    setTotal(n)
    setState(loopStart(n))
    setPlaying(false)
  }
  const rounds = repeatRounds(total)

  const check = () => {
    setVerdict(Number(answer.trim()) === totalSpoons(cups, each) ? 'right' : 'wrong')
  }

  return (
    <div className="card space-y-3 p-4" data-testid="loop-counter">
      <p className="font-semibold">লুপ (Loop) — একই কাজ বারবার</p>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="কতবার করবেন">
        <span>কতবার করবেন:</span>
        {[3, 5, 7].map((n) => (
          <button key={n} type="button" aria-pressed={total === n} data-testid={`lc-times-${n}`} className="btn btn-outline aria-pressed:border-brand aria-pressed:bg-brand-soft" onClick={() => pick(n)}>
            {n} বার
          </button>
        ))}
      </div>
      <p className="rounded-xl p-3 font-medium" style={{ background: 'var(--c-sunken)' }}>
        {total} বার করুন: <span className="underline">এক চামচ চিনি দিন</span>
      </p>

      <div className="flex flex-wrap items-center gap-2" aria-label="চিনির চামচ">
        <span className="text-4xl" aria-hidden="true">☕</span>
        {rounds.map((r) => (
          <span
            key={r}
            data-testid={`lc-spoon-${r}`}
            data-done={r <= state.done}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg"
            style={{ borderColor: r <= state.done ? 'var(--c-ok)' : 'var(--c-line)', background: r <= state.done ? 'var(--c-ok-soft)' : 'transparent' }}
          >
            {r <= state.done ? '🥄' : r}
          </span>
        ))}
      </div>

      <p role="status" data-testid="lc-status" className="text-lg font-semibold">
        {state.finished ? `✅ সব ${state.total} বার হয়ে গেছে — লুপ শেষ। মোট ${state.done} চামচ।` : state.done === 0 ? 'এখনও শুরু হয়নি।' : `${state.done} নম্বর বার হলো। আরও ${state.total - state.done} বার বাকি।`}
      </p>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" data-testid="lc-step" disabled={state.finished} onClick={() => setState((s) => loopStep(s))}>
          এক ধাপ ▶
        </button>
        <button type="button" className="btn btn-outline" data-testid="lc-play" disabled={state.finished} onClick={() => setPlaying((p) => !p)}>
          {playing ? '⏸ থামান' : '⏵ নিজে নিজে চলুক'}
        </button>
        <button type="button" className="btn btn-outline" data-testid="lc-reset" onClick={() => { setState(loopStart(total)); setPlaying(false) }}>
          ↺ আবার প্রথম থেকে
        </button>
      </div>

      <div className="space-y-2 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }}>
        <p className="font-medium">ভাবুন তো: প্রতিটি কাপের জন্য {each} চামচ চিনি দিতে হবে। কাপ আছে {cups}টি। মোট কত চামচ চিনি লাগবে?</p>
        <label className="flex flex-wrap items-center gap-2">
          <span className="sr-only">মোট চামচের সংখ্যা</span>
          <input className="field max-w-32" inputMode="numeric" data-testid="lc-answer" value={answer} onChange={(e) => { setAnswer(e.target.value); setVerdict('none') }} onKeyDown={(e) => e.key === 'Enter' && answer.trim() && check()} />
          <button type="button" className="btn" data-testid="lc-check" disabled={!answer.trim()} onClick={check}>দেখি</button>
        </label>
        {verdict === 'right' && <p role="status" data-testid="lc-right" style={{ color: 'var(--c-ok)' }}>ঠিক! {cups} কাপ × {each} চামচ = {totalSpoons(cups, each)} চামচ। এটাই লুপের ভেতরে লুপ — প্রতিটি কাপের জন্য {each} বার চামচ দেওয়া।</p>}
        {verdict === 'wrong' && <p role="status" data-testid="lc-wrong">একটু ভেবে দেখুন: প্রতিটি কাপে {each} চামচ, আর কাপ {cups}টি — প্রতিটি কাপের জন্য কাজটি একবার করে হবে।</p>}
      </div>
    </div>
  )
}
