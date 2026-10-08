import { useMemo, useRef, useState } from 'react'
import type { QuizQuestion } from '../../engine/types'
import { gradeClickTarget, gradeDragMatch, gradeMultipleChoice, gradeOrdering, gradePredictOutput, seededShuffle } from '../../engine/quiz'
import { DropZone, useDrag } from '../../sim/dnd'

type Q<T extends QuizQuestion['type']> = Extract<QuizQuestion, { type: T }>

export interface ViewProps<T extends QuizQuestion> {
  q: T
  /** called with correctness each time she submits an answer */
  onAnswer: (correct: boolean) => void
  locked: boolean
}

const optCls = 'flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left has-[:checked]:border-brand has-[:checked]:bg-brand-soft'

export function MultipleChoiceView({ q, onAnswer, locked }: ViewProps<Q<'multipleChoice'>>) {
  const [sel, setSel] = useState<string[]>([])
  const multi = q.multi ?? q.correct.length > 1
  return (
    <fieldset disabled={locked} className="min-w-0 space-y-2">
      <legend className="sr-only">{q.questionBn}</legend>
      {multi && <p className="text-sm text-muted">একাধিক উত্তর ঠিক হতে পারে।</p>}
      {q.options.map((o) => (
        <label key={o.id} className={optCls} style={{ borderColor: 'var(--c-line)' }}>
          <input
            type={multi ? 'checkbox' : 'radio'}
            name={q.id}
            className="h-5 w-5 accent-[var(--c-brand)]"
            checked={sel.includes(o.id)}
            onChange={() => setSel((s) => (multi ? (s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id]) : [o.id]))}
          />
          <span className="min-w-0">{o.textBn}</span>
        </label>
      ))}
      <button className="btn" disabled={sel.length === 0 || locked} onClick={() => onAnswer(gradeMultipleChoice(q, sel))}>
        উত্তর দিন
      </button>
    </fieldset>
  )
}

export function ClickTargetView({ q, onAnswer, locked }: ViewProps<Q<'clickTarget'>>) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label={q.questionBn}>
      {q.items.map((it) => (
        <button
          key={it.id}
          disabled={locked}
          aria-pressed={picked === it.id}
          className="flex min-h-24 min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-center hover:bg-sunken aria-pressed:border-brand aria-pressed:bg-brand-soft"
          style={{ borderColor: 'var(--c-line)' }}
          onClick={() => {
            setPicked(it.id)
            onAnswer(gradeClickTarget(q, it.id))
          }}
        >
          {it.icon && <span className="text-3xl" aria-hidden="true">{it.icon}</span>}
          <span className="max-w-full [overflow-wrap:anywhere]">{it.labelBn}</span>
        </button>
      ))}
    </div>
  )
}

function Chip({ id, text, disabled, selected, onPick }: { id: string; text: string; disabled?: boolean; selected?: boolean; onPick: () => void }) {
  const drag = useDrag({ payload: id, disabled })
  return (
    <button
      {...drag}
      type="button"
      data-chip=""
      aria-pressed={selected}
      disabled={disabled}
      onClick={onPick}
      className="min-h-12 cursor-grab rounded-xl border-2 px-4 py-2 select-none aria-pressed:border-brand aria-pressed:bg-brand-soft"
      style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)', touchAction: 'none' }}
    >
      {text}
    </button>
  )
}

/** Drag each item on the right to its match — or tap an item, then tap the slot (keyboard/touch friendly). */
export function DragMatchView({ q, onAnswer, locked }: ViewProps<Q<'dragMatch'>>) {
  const [map, setMap] = useState<Record<string, string | undefined>>({})
  const [held, setHeld] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const focusSoon = (sel: string) => window.setTimeout(() => box.current?.querySelector<HTMLElement>(sel)?.focus(), 0)
  const chips = useMemo(() => seededShuffle(q.pairs, q.id), [q])
  const place = (slot: string, chip: string) => {
    setMap((m) => {
      const next: Record<string, string | undefined> = {}
      for (const [k, v] of Object.entries(m)) if (v !== chip) next[k] = v
      next[slot] = chip
      return next
    })
    setHeld(null)
    // keyboard flow: after placing, jump back to the next loose item
    focusSoon('[data-chip]:not(:disabled)')
  }
  const placed = new Set(Object.values(map))
  const full = q.pairs.every((p) => map[p.id])
  return (
    <div ref={box} className="space-y-4">
      <p className="text-sm text-muted">ডান দিকের জিনিসটি টেনে এনে বাঁ দিকের সঠিক ঘরে ছাড়ুন। অথবা জিনিসটিতে ক্লিক করে তারপর ঘরটিতে ক্লিক করুন।</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          {q.pairs.map((p) => (
            <DropZone key={p.id} onDrop={(pl) => !locked && place(p.id, String(pl))} className="flex min-h-14 items-center justify-between gap-2 rounded-xl border-2 border-dashed p-2 data-[drop-over=true]:bg-brand-soft" style={{ borderColor: 'var(--c-line)' }}>
              <button type="button" data-slot={map[p.id] ? undefined : ''} className="min-h-12 flex-1 text-left" disabled={locked || !held} onClick={() => held && place(p.id, held)} aria-label={`${p.leftBn}${map[p.id] ? ` (এখন: ${q.pairs.find((x) => x.id === map[p.id])?.rightBn})` : ''} — এখানে বসান`}>
                {p.leftBn}
              </button>
              <span className="min-w-24 rounded-lg px-2 py-1 text-center" style={{ background: 'var(--c-sunken)' }}>
                {map[p.id] ? q.pairs.find((x) => x.id === map[p.id])?.rightBn : '…'}
              </span>
            </DropZone>
          ))}
        </div>
        <div className="flex flex-wrap content-start gap-2" aria-label="টেনে আনার জিনিস">
          {chips.filter((c) => !placed.has(c.id)).map((c) => (
            <Chip key={c.id} id={c.id} text={c.rightBn} disabled={locked} selected={held === c.id} onPick={() => {
              setHeld((h) => (h === c.id ? null : c.id))
              if (held !== c.id) focusSoon('[data-slot]:not(:disabled)')
            }} />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn" disabled={!full || locked} onClick={() => onAnswer(gradeDragMatch(q, map))}>
          যাচাই করুন
        </button>
        <button className="btn btn-outline" disabled={locked} onClick={() => setMap({})}>
          আবার সাজাই
        </button>
      </div>
    </div>
  )
}

export function OrderingView({ q, onAnswer, locked }: ViewProps<Q<'ordering'>>) {
  const [order, setOrder] = useState(() => seededShuffle(q.items, q.id).map((i) => i.id))
  const text = (id: string) => q.items.find((i) => i.id === id)?.textBn
  const move = (i: number, d: -1 | 1) =>
    setOrder((o) => {
      const j = i + d
      if (j < 0 || j >= o.length) return o
      const n = [...o]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">তীর বোতাম দিয়ে ঠিক ক্রমে সাজান — সবচেয়ে আগে যা করতে হয় তা ওপরে।</p>
      <ol className="space-y-2">
        {order.map((id, i) => (
          <li key={id} className="flex items-center gap-2 rounded-xl border-2 p-2" style={{ borderColor: 'var(--c-line)' }}>
            <span className="w-6 text-center font-bold">{i + 1}</span>
            <span className="min-w-0 flex-1">{text(id)}</span>
            <button className="btn btn-outline" aria-label="ওপরে সরান" disabled={locked || i === 0} onClick={() => move(i, -1)}>↑</button>
            <button className="btn btn-outline" aria-label="নিচে সরান" disabled={locked || i === order.length - 1} onClick={() => move(i, 1)}>↓</button>
          </li>
        ))}
      </ol>
      <button className="btn" disabled={locked} onClick={() => onAnswer(gradeOrdering(q, order))}>
        যাচাই করুন
      </button>
    </div>
  )
}

export function PredictOutputView({ q, onAnswer, locked }: ViewProps<Q<'predictOutput'>>) {
  const [ans, setAns] = useState('')
  return (
    <div className="space-y-3">
      <pre className="overflow-auto rounded-xl p-4 text-base" style={{ background: 'var(--c-sunken)' }}>
        <code>{q.code}</code>
      </pre>
      <label className="block space-y-1">
        <span className="font-medium">আপনার মনে হয় কী ছাপা হবে?</span>
        <input className="field font-mono" value={ans} disabled={locked} onChange={(e) => setAns(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ans.trim() && onAnswer(gradePredictOutput(q, ans))} />
      </label>
      <button className="btn" disabled={!ans.trim() || locked} onClick={() => onAnswer(gradePredictOutput(q, ans))}>
        উত্তর দিন
      </button>
    </div>
  )
}
