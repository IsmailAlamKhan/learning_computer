/**
 * Question views for the deck quiz slides: big tappable answer cards (min 64 px), one question per screen.
 * Single-answer multiple choice and click-target answer instantly when tapped; the other types use the deck's
 * primary button ("যাচাই করুন"), which these views render into the footer slot.
 * Every question type has a keyboard path (Tab + Enter/Space; ordering has ↑/↓ buttons; drag-match also works as tap-then-tap).
 */
import { useMemo, useRef, useState } from 'react'
import type { QuizQuestion } from '../../engine/types'
import { gradeClickTarget, gradeDragMatch, gradeMultipleChoice, gradeOrdering, gradePredictOutput, seededShuffle } from '../../engine/quiz'
import { DropZone, useDrag } from '../../sim/dnd'
import { InFooter, PrimaryButton } from '../cards/DeckFooter'
import { useFmt } from '../useFmt'

type Q<T extends QuizQuestion['type']> = Extract<QuizQuestion, { type: T }>

export interface DeckViewProps<T extends QuizQuestion> {
  q: T
  /** she answered correctly: the view is finished */
  locked: boolean
  /** called with correctness each time she gives an answer */
  onAnswer: (correct: boolean) => void
}

/** Shown in the footer while an instant-answer question waits for a tap. */
const WaitingButton = () => (
  <InFooter>
    <PrimaryButton label="উত্তর বেছে নিন" disabled />
  </InFooter>
)

const CheckButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
  <InFooter>
    <PrimaryButton label="যাচাই করুন" disabled={disabled} onClick={onClick} />
  </InFooter>
)

export function MultipleChoiceView({ q, locked, onAnswer }: DeckViewProps<Q<'multipleChoice'>>) {
  const [sel, setSel] = useState<string[]>([])
  const [tried, setTried] = useState<string[]>([])
  const multi = q.multi ?? q.correct.length > 1
  const pick = (id: string) => {
    if (locked) return
    if (multi) return setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
    setSel([id])
    const ok = gradeMultipleChoice(q, [id])
    if (!ok) setTried((t) => (t.includes(id) ? t : [...t, id]))
    onAnswer(ok)
  }
  const submit = () => {
    const ok = gradeMultipleChoice(q, sel)
    if (!ok) setTried(sel)
    onAnswer(ok)
  }
  return (
    <>
      {multi && !locked && <p className="m-0 text-sm text-muted">একাধিক উত্তর ঠিক হতে পারে।</p>}
      <div role="group" aria-label={q.questionBn} className="deck-options">
        {q.options.map((o) => {
          const on = sel.includes(o.id)
          const state = locked && q.correct.includes(o.id) ? 'right' : !locked && tried.includes(o.id) && !(multi && on) ? 'tried' : undefined
          return (
            <button key={o.id} type="button" data-testid="quiz-option" className="deck-option" data-multi={multi} data-state={state} aria-pressed={on} disabled={locked} onClick={() => pick(o.id)}>
              <span className="deck-option-mark" aria-hidden="true">
                {state === 'right' || (on && multi) ? '✓' : ''}
              </span>
              <span className="min-w-0 flex-1">{o.textBn}</span>
            </button>
          )
        })}
      </div>
      {!locked && (multi ? <CheckButton disabled={sel.length === 0} onClick={submit} /> : <WaitingButton />)}
    </>
  )
}

export function ClickTargetView({ q, locked, onAnswer }: DeckViewProps<Q<'clickTarget'>>) {
  const [tried, setTried] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <>
      <div role="group" aria-label={q.questionBn} className="deck-options" data-cols="2">
        {q.items.map((it) => {
          const state = locked && it.id === q.correct ? 'right' : !locked && tried.includes(it.id) ? 'tried' : undefined
          return (
            <button
              key={it.id}
              type="button"
              data-testid="quiz-option"
              className="deck-option"
              data-icon={!!it.icon}
              data-state={state}
              aria-pressed={picked === it.id && state !== 'tried'}
              disabled={locked}
              onClick={() => {
                setPicked(it.id)
                const ok = gradeClickTarget(q, it.id)
                if (!ok) setTried((t) => (t.includes(it.id) ? t : [...t, it.id]))
                onAnswer(ok)
              }}
            >
              {it.icon && (
                <span className="text-4xl" aria-hidden="true">
                  {it.icon}
                </span>
              )}
              <span className="max-w-full [overflow-wrap:anywhere]">{it.labelBn}</span>
            </button>
          )
        })}
      </div>
      {!locked && <WaitingButton />}
    </>
  )
}

function Chip({ id, text, disabled, selected, onPick }: { id: string; text: string; disabled?: boolean; selected?: boolean; onPick: () => void }) {
  const drag = useDrag({ payload: id, disabled })
  return (
    <button {...drag} type="button" data-chip="" data-testid="match-chip" aria-pressed={selected} disabled={disabled} onClick={onPick} className="deck-tray-chip">
      {text}
    </button>
  )
}

/** Drag each item to its match — or tap an item, then tap the slot (keyboard / touch friendly). After a wrong try only the wrong ones go back. */
export function DragMatchView({ q, locked, onAnswer }: DeckViewProps<Q<'dragMatch'>>) {
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
    focusSoon('[data-chip]:not(:disabled)')
  }
  const text = (id?: string) => q.pairs.find((x) => x.id === id)?.rightBn
  const placed = new Set(Object.values(map))
  const full = q.pairs.every((p) => map[p.id])
  const check = () => {
    const ok = gradeDragMatch(q, map)
    if (!ok) setMap((m) => Object.fromEntries(Object.entries(m).filter(([slot, chip]) => slot === chip)))
    onAnswer(ok)
  }
  return (
    <div ref={box} className="flex flex-col gap-3">
      <p className="m-0 text-sm text-muted">নিচের জিনিসটি ধরে টেনে ঠিক ঘরে ছাড়ুন — অথবা জিনিসটিতে ট্যাপ করে তারপর ঘরটিতে ট্যাপ করুন।</p>
      <div className="grid gap-2">
        {q.pairs.map((p) => (
          <DropZone key={p.id} onDrop={(pl) => !locked && place(p.id, String(pl))} className="deck-row">
            <span className="min-w-0 font-medium">{p.leftBn}</span>
            <button
              type="button"
              data-testid="match-slot"
              data-slot={map[p.id] ? undefined : ''}
              className="deck-slot"
              disabled={locked || !held}
              onClick={() => held && place(p.id, held)}
              aria-label={`${p.leftBn}${map[p.id] ? ` (এখন: ${text(map[p.id])})` : ''} — এখানে বসান`}
            >
              {map[p.id] ? text(map[p.id]) : '…'}
            </button>
          </DropZone>
        ))}
      </div>
      <div className="flex flex-wrap content-start gap-2" aria-label="টেনে আনার জিনিস">
        {chips
          .filter((c) => !placed.has(c.id))
          .map((c) => (
            <Chip
              key={c.id}
              id={c.id}
              text={c.rightBn}
              disabled={locked}
              selected={held === c.id}
              onPick={() => {
                setHeld((h) => (h === c.id ? null : c.id))
                if (held !== c.id) focusSoon('[data-slot]:not(:disabled)')
              }}
            />
          ))}
      </div>
      {!locked && <CheckButton disabled={!full} onClick={check} />}
    </div>
  )
}

export function OrderingView({ q, locked, onAnswer }: DeckViewProps<Q<'ordering'>>) {
  const { n } = useFmt()
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
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-muted">তীর বোতাম দিয়ে ঠিক ক্রমে সাজান — সবচেয়ে আগে যা করতে হয় তা ওপরে।</p>
      <ol className="m-0 grid list-none gap-2 p-0">
        {order.map((id, i) => (
          <li key={id} data-testid="order-item" className="deck-row" style={{ borderStyle: 'solid' }}>
            <span className="w-6 flex-none text-center font-bold">{n(i + 1)}</span>
            <span className="min-w-0 flex-1">{text(id)}</span>
            <button type="button" className="deck-iconbtn" aria-label="ওপরে সরান" disabled={locked || i === 0} onClick={() => move(i, -1)}>
              ↑
            </button>
            <button type="button" className="deck-iconbtn" aria-label="নিচে সরান" disabled={locked || i === order.length - 1} onClick={() => move(i, 1)}>
              ↓
            </button>
          </li>
        ))}
      </ol>
      {!locked && <CheckButton disabled={false} onClick={() => onAnswer(gradeOrdering(q, order))} />}
    </div>
  )
}

export function PredictOutputView({ q, locked, onAnswer }: DeckViewProps<Q<'predictOutput'>>) {
  const [ans, setAns] = useState('')
  const submit = () => ans.trim() && onAnswer(gradePredictOutput(q, ans))
  return (
    <div className="flex flex-col gap-3">
      <pre className="m-0 overflow-auto rounded-xl p-4 text-base" style={{ background: 'var(--c-sunken)' }}>
        <code>{q.code}</code>
      </pre>
      <label className="block space-y-1">
        <span className="font-medium">আপনার মনে হয় কী ছাপা হবে?</span>
        <input className="field font-mono" data-testid="predict-input" value={ans} disabled={locked} onChange={(e) => setAns(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </label>
      {!locked && <CheckButton disabled={!ans.trim()} onClick={submit} />}
    </div>
  )
}
