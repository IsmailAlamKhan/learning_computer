import { useMemo, useState } from 'react'
import { useFmt } from '../../ui/useFmt'
import { TECH_WORDS, WORD_CATEGORIES, filterWords, makeDrill, type WordCategory } from './lib/m19Logic'

const ROUNDS = 5

function Flashcards() {
  const f = useFmt()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<WordCategory | 'all'>('all')
  const [open, setOpen] = useState<string | null>(null)
  const list = useMemo(() => filterWords(TECH_WORDS, q, cat), [q, cat])
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input type="search" aria-label="শব্দ খুঁজুন" placeholder="শব্দ খুঁজুন (English বা বাংলা)…" className="min-h-12 min-w-0 flex-1 rounded-xl border-2 px-3" style={{ borderColor: 'var(--c-line)' }} value={q} onChange={(e) => setQ(e.target.value)} data-testid="tw-search" />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="ধরন">
        {[{ id: 'all' as const, labelBn: 'সব' }, ...WORD_CATEGORIES].map((c) => (
          <button key={c.id} type="button" aria-pressed={cat === c.id} className={cat === c.id ? 'btn' : 'btn btn-outline'} onClick={() => setCat(c.id)} data-testid={`tw-cat-${c.id}`}>
            {c.labelBn}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted" aria-live="polite">{f.n(list.length)}টি শব্দ — কার্ডে ক্লিক করলে বাংলা অর্থ দেখা যাবে।</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {list.map((w) => (
          <li key={w.id}>
            <button type="button" className="w-full rounded-xl border-2 p-3 text-left" style={{ borderColor: open === w.id ? 'var(--c-brand)' : 'var(--c-line)' }} aria-expanded={open === w.id} onClick={() => setOpen(open === w.id ? null : w.id)} data-testid={`tw-card-${w.id}`}>
              <div className="font-mono text-lg font-bold">{w.en}</div>
              {open === w.id && (
                <div className="mt-2 space-y-1">
                  <div className="font-semibold" data-testid="tw-bn">{w.bn}</div>
                  <div className="rounded-lg p-2 font-mono text-sm" style={{ background: 'var(--c-sunken)' }}>{w.example}</div>
                  <div className="text-sm">{w.exampleBn}</div>
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p>কোনো শব্দ পাওয়া যায়নি। অন্য কিছু লিখে দেখুন।</p>}
    </div>
  )
}

function Drill() {
  const f = useFmt()
  const [seed, setSeed] = useState(1)
  const drill = useMemo(() => makeDrill(TECH_WORDS, ROUNDS, seed * 7919), [seed])
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [wrongOnce, setWrongOnce] = useState(false)
  const q = drill[i]
  const finished = i >= drill.length
  const restart = () => (setSeed((s) => s + 1), setI(0), setScore(0), setPicked(null), setWrongOnce(false))

  if (finished)
    return (
      <div className="space-y-3" data-testid="tw-done">
        <p className="text-lg font-bold">
          আপনি {f.n(ROUNDS)}টির মধ্যে {f.n(score)}টি প্রথমবারেই ঠিক করেছেন। 👏
        </p>
        <button type="button" className="btn" onClick={restart}>↺ নতুন শব্দ নিয়ে আবার</button>
      </div>
    )
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">প্রশ্ন {f.n(i + 1)} / {f.n(ROUNDS)}</p>
      <p className="text-lg">
        <span className="font-mono text-xl font-bold" data-testid="tw-q">{q.word.en}</span> মানে কী?
      </p>
      <ul className="space-y-2">
        {q.options.map((o) => (
          <li key={o}>
            <button
              type="button"
              className="w-full rounded-xl border-2 p-3 text-left"
              style={{ borderColor: picked === o ? (o === q.answer ? 'var(--c-brand)' : 'var(--c-line)') : 'var(--c-line)' }}
              disabled={picked === q.answer}
              onClick={() => {
                setPicked(o)
                if (o === q.answer) {
                  if (!wrongOnce) setScore((s) => s + 1)
                } else setWrongOnce(true)
              }}
              data-testid={o === q.answer ? 'tw-opt-correct' : 'tw-opt'}
            >
              {o}
            </button>
          </li>
        ))}
      </ul>
      {picked && picked !== q.answer && <p role="status">আরেকবার ভেবে দেখুন, অন্য একটি বেছে নিন; ইঙ্গিত: <span className="font-mono">{q.word.example}</span></p>}
      {picked === q.answer && (
        <div className="space-y-2" role="status">
          <p>✓ ঠিক! উদাহরণ: <span className="font-mono">{q.word.example}</span> — {q.word.exampleBn}</p>
          <button type="button" className="btn" onClick={() => (setI(i + 1), setPicked(null), setWrongOnce(false))} data-testid="tw-next">পরের প্রশ্ন →</button>
        </div>
      )}
    </div>
  )
}

/** Searchable flashcards plus a "match the word" drill for common English words seen on screens. */
export default function TechWords() {
  const [mode, setMode] = useState<'cards' | 'drill'>('cards')
  return (
    <div className="card space-y-4 p-4" data-testid="tech-words">
      <p className="font-semibold">পর্দায় দেখা ইংরেজি শব্দ — কার্ড ও মিলিয়ে দেখা</p>
      <div className="flex gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'cards'} className={mode === 'cards' ? 'btn' : 'btn btn-outline'} onClick={() => setMode('cards')} data-testid="tw-mode-cards">কার্ড</button>
        <button type="button" role="tab" aria-selected={mode === 'drill'} className={mode === 'drill' ? 'btn' : 'btn btn-outline'} onClick={() => setMode('drill')} data-testid="tw-mode-drill">শব্দ মেলান</button>
      </div>
      {mode === 'cards' ? <Flashcards /> : <Drill />}
    </div>
  )
}
