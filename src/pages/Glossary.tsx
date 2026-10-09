import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { GLOSSARY } from '../content/glossary'
import { useFmt } from '../ui/useFmt'
import { ArtView } from '../ui/illustrations/ArtView'
import { SpeakButton } from '../ui/SpeakButton'
import { store, useProgress } from '../state/store'
import { FLASH_KEY, flip, markAgain, markKnown, move, readKnown, startDeck } from '../lib/flashcards'
import type { GlossaryEntry } from '../engine/types'

/** A category emoji from the module the word is taught in (hardware / files / internet / settings / thinking / code). */
export function defaultIcon(module: number): string {
  if (module <= 3) return '🖥️'
  if (module === 4 || module === 6) return '📁'
  if (module === 5) return '⌨️'
  if (module === 9) return '🛡️'
  if (module <= 8 || module === 11) return '🌐'
  if (module <= 13) return '⚙️'
  if (module <= 16) return '🧠'
  return '💻'
}

function Pic({ g, size }: { g: GlossaryEntry; size: number }) {
  return g.art ? (
    <ArtView name={g.art} size={size} tile={false} />
  ) : (
    <span aria-hidden="true" style={{ fontSize: size * 0.7, lineHeight: 1 }}>{g.icon ?? defaultIcon(g.module)}</span>
  )
}

function FlipCard({ flipped, onToggle, front, back, label, className = '', style }: { flipped: boolean; onToggle: () => void; front: ReactNode; back: ReactNode; label: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flip ${className}`} data-flipped={flipped} style={style}>
      <div className="flip-inner">
        <div className="flip-face flip-front" aria-hidden={flipped}>{front}</div>
        <div className="flip-face flip-back" aria-hidden={!flipped}>{back}</div>
      </div>
      {/* the whole card is one big button; kept separate from the speaker so no button sits inside a button */}
      <button type="button" className="absolute inset-0 cursor-pointer rounded-[var(--r-card)] bg-transparent" style={{ zIndex: 2 }} onClick={onToggle} aria-pressed={flipped} aria-label={label} />
    </div>
  )
}

function Front({ g }: { g: GlossaryEntry }) {
  return (
    <>
      <Pic g={g} size={72} />
      <p className="text-xl font-bold leading-snug">{g.termBn}</p>
      <p lang="en" className="text-muted">{g.termEn}</p>
    </>
  )
}
function Back({ g }: { g: GlossaryEntry }) {
  const { n } = useFmt()
  return (
    <>
      <p className="text-lg font-medium leading-snug">{g.meaningBn}</p>
      <span className="chip chip-brand">পাঠ {n(g.module)}</span>
    </>
  )
}

function Cards({ list }: { list: GlossaryEntry[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({})
  if (list.length === 0) return <p className="card text-center">এই নামে কোনো শব্দ নেই। অন্যভাবে লিখে দেখুন 🙂</p>
  return (
    <ul className="grid list-none grid-cols-1 gap-4 p-0 min-[460px]:grid-cols-2 lg:grid-cols-3" data-testid="glossary-grid">
      {list.map((g) => (
        <li key={g.id} className="relative" data-testid="glossary-card">
          <FlipCard
            style={{ height: 210 }}
            flipped={!!open[g.id]}
            onToggle={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))}
            label={`${g.termBn} (${g.termEn}) — উল্টে দেখুন`}
            front={<Front g={g} />}
            back={<Back g={g} />}
          />
          <span className="absolute right-2 top-2" style={{ zIndex: 3 }}><SpeakButton text={`${g.termBn}। ${g.meaningBn}`} /></span>
        </li>
      ))}
    </ul>
  )
}

function Flashcards() {
  const { extras } = useProgress()
  const { n } = useFmt()
  const known = readKnown(extras)
  const [s, setS] = useState(() => startDeck(GLOSSARY.map((g) => g.id), known))
  const byId = useMemo(() => new Map(GLOSSARY.map((g) => [g.id, g])), [])
  const g = byId.get(s.order[s.index])

  const know = () => {
    if (!g) return
    store.setExtra(FLASH_KEY, [...new Set([...known, g.id])])
    setS(markKnown(s))
  }
  const again = () => setS(markAgain(s))
  const restart = () => {
    store.setExtra(FLASH_KEY, [])
    setS(startDeck(GLOSSARY.map((x) => x.id), []))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowRight') setS((x) => move(x, 1))
      else if (e.key === 'ArrowLeft') setS((x) => move(x, -1))
      else if (e.key === ' ' && (!t || !t.tagName || t.tagName === 'BODY')) {
        // on a focused button Space already clicks it natively
        e.preventDefault()
        setS((x) => flip(x))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // keep focus on the card so Space flips it
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => {
    wrap.current?.querySelector<HTMLButtonElement>('.flip > button')?.focus({ preventScroll: true })
  }, [s.order.length, s.index, s.order[s.index]])

  const total = GLOSSARY.length
  const knownCount = Math.min(total, known.length)
  if (!g)
    return (
      <div className="card flex flex-col items-center gap-4 text-center" data-testid="flash-done">
        <ArtView name="didi-cheer" size={130} />
        <h2 className="t-heading">সব শব্দ আপনার জানা! 🎉</h2>
        <button className="btn btn-lg" onClick={restart}>আবার শুরু করি ↺</button>
      </div>
    )
  return (
    <div ref={wrap} className="mx-auto max-w-md space-y-5" data-testid="flashcards">
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-medium text-muted">
          <span>{n(knownCount)} জানা</span>
          <span>বাকি {n(s.order.length)}</span>
        </div>
        <div role="progressbar" aria-label="শব্দ শেখার অগ্রগতি" aria-valuemin={0} aria-valuemax={total} aria-valuenow={knownCount} className="h-3 overflow-hidden rounded-full" style={{ background: 'var(--c-sunken)' }}>
          <div className="h-full rounded-full" style={{ width: `${(knownCount / total) * 100}%`, background: 'var(--c-teal)', transition: 'width 300ms ease' }} />
        </div>
      </div>
      <div className="relative">
        <FlipCard
          className="w-full"
          style={{ height: 300 }}
          flipped={s.flipped}
          onToggle={() => setS(flip)}
          label={`${g.termBn} — উল্টে দেখুন`}
          front={<Front g={g} />}
          back={<Back g={g} />}
        />
        <span className="absolute right-2 top-2" style={{ zIndex: 3 }}><SpeakButton text={`${g.termBn}। ${g.meaningBn}`} /></span>
      </div>
      <p className="text-center text-sm text-muted">কার্ডে ক্লিক বা ট্যাপ করে উল্টান · ← → চেপে এগোন</p>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn btn-outline whitespace-nowrap px-3 text-base" onClick={again}>আবার দেখব ↺</button>
        <button className="btn" onClick={know}>জানতাম ✓</button>
      </div>
    </div>
  )
}

export default function Glossary() {
  const [q, setQ] = useState('')
  const [mode, setMode] = useState<'cards' | 'flash'>('cards')
  const { n } = useFmt()
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return GLOSSARY
    return GLOSSARY.filter((g) => [g.termBn, g.termEn, g.meaningBn].some((s) => s.toLowerCase().includes(t)))
  }, [q])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="t-title">শব্দকোষ</h1>
        <div role="group" aria-label="দেখার ধরন" className="inline-flex rounded-full p-1" style={{ background: 'var(--c-sunken)' }}>
          {([['cards', 'কার্ড'], ['flash', 'শব্দ ফ্ল্যাশকার্ড']] as const).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className="min-h-11 rounded-full px-4 font-bold" style={mode === k ? { background: 'var(--c-brand)', color: 'var(--c-brand-ink)' } : undefined}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {mode === 'cards' ? (
        <>
          <label className="block">
            <span className="sr-only">শব্দ খুঁজুন</span>
            <input className="field" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 শব্দ খুঁজুন (বাংলা বা English)" />
          </label>
          <p aria-live="polite" className="text-sm text-muted">{n(list.length)}টি শব্দ · কার্ডে ট্যাপ করলে মানে দেখা যাবে</p>
          <Cards list={list} />
        </>
      ) : (
        <Flashcards />
      )}
    </div>
  )
}
