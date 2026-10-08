import { useState } from 'react'
import { DropZone, useDrag } from '../../sim/dnd'
import { PUZZLES, correctPositions, getPuzzle, moveItem, nudge, orderFeedback, shuffledOrder, type OrderFeedback, type OrderPuzzle } from './lib/orderPuzzles'

function Row({
  puzzle, id, index, count, order, showTicks, solved, onMove, onNudge,
}: {
  puzzle: OrderPuzzle
  id: string
  index: number
  count: number
  order: string[]
  showTicks: boolean
  solved: boolean
  onMove: (from: number, to: number) => void
  onNudge: (index: number, dir: -1 | 1) => void
}) {
  const drag = useDrag({ payload: id, disabled: solved })
  const step = puzzle.steps.find((s) => s.id === id)!
  const ok = showTicks ? correctPositions(puzzle, order)[index] : null
  return (
    <DropZone
      onDrop={(payload) => {
        const from = order.indexOf(String(payload))
        if (from >= 0) onMove(from, index)
      }}
      className="flex items-center gap-2 rounded-xl border-2 p-2 data-[drop-over=true]:bg-brand-soft"
      style={{ borderColor: ok === true ? 'var(--c-ok)' : 'var(--c-line)', background: ok === true ? 'var(--c-ok-soft)' : undefined }}
      data-testid={`op-row-${index}`}
      role="listitem"
    >
      <span className="w-7 text-center font-bold" aria-hidden="true">{index + 1}</span>
      <div
        {...drag}
        className={`flex flex-1 items-center gap-2 rounded-lg px-2 py-2 select-none ${solved ? '' : 'cursor-grab'}`}
        style={{ ...drag.style, background: 'var(--c-surface)' }}
        data-testid={`op-item-${id}`}
        data-step={id}
      >
        <span aria-hidden="true" className="text-lg" style={{ color: 'var(--c-muted)' }}>⠿</span>
        <span>{step.textBn}</span>
        {ok === true && <span aria-label="ঠিক জায়গায়" className="ml-auto" style={{ color: 'var(--c-ok)' }}>✓</span>}
      </div>
      <button type="button" className="btn btn-outline" aria-label={`“${step.textBn}” ওপরে সরান`} disabled={solved || index === 0} onClick={() => onNudge(index, -1)} data-testid={`op-up-${id}`}>↑</button>
      <button type="button" className="btn btn-outline" aria-label={`“${step.textBn}” নিচে সরান`} disabled={solved || index === count - 1} onClick={() => onNudge(index, 1)} data-testid={`op-down-${id}`}>↓</button>
    </DropZone>
  )
}

/** Drag-and-drop ordering puzzles (with up/down buttons for keyboard and touch). */
export default function OrderPuzzleWidget() {
  const [puzzleId, setPuzzleId] = useState(PUZZLES[0].id)
  const puzzle = getPuzzle(puzzleId)!
  const [order, setOrder] = useState<string[]>(() => shuffledOrder(PUZZLES[0], 1))
  const [seed, setSeed] = useState(1)
  const [feedback, setFeedback] = useState<OrderFeedback | null>(null)

  const choose = (id: string) => {
    setPuzzleId(id)
    setSeed(1)
    setOrder(shuffledOrder(getPuzzle(id)!, 1))
    setFeedback(null)
  }
  const reshuffle = () => {
    setSeed(seed + 1)
    setOrder(shuffledOrder(puzzle, seed + 1))
    setFeedback(null)
  }
  const solved = feedback?.solved === true
  const update = (next: string[]) => {
    setOrder(next)
    setFeedback(null)
  }

  return (
    <div className="card space-y-3 p-4" data-testid="order-puzzle">
      <p className="font-semibold">ধাপগুলো ঠিক ক্রমে সাজান</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="কোন কাজটি সাজাবেন">
        {PUZZLES.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === puzzleId}
            data-testid={`op-picker-${p.id}`}
            className="btn btn-outline aria-pressed:border-brand aria-pressed:bg-brand-soft"
            onClick={() => choose(p.id)}
          >
            <span aria-hidden="true">{p.icon}</span> {p.titleBn}
          </button>
        ))}
      </div>
      <p>{puzzle.introBn}</p>
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
        ধাপটি ধরে টেনে অন্য জায়গায় ছাড়ুন — অথবা পাশের ↑ ↓ বোতাম চাপুন। সবচেয়ে আগে যা করতে হয় তা ওপরে।
      </p>
      <div role="list" aria-label={puzzle.titleBn} className="space-y-2">
        {order.map((id, i) => (
          <Row
            key={id}
            puzzle={puzzle}
            id={id}
            index={i}
            count={order.length}
            order={order}
            showTicks={feedback !== null && !solved}
            solved={solved}
            onMove={(from, to) => update(moveItem(order, from, to))}
            onNudge={(idx, dir) => update(nudge(order, idx, dir))}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn" data-testid="op-check" disabled={solved} onClick={() => setFeedback(orderFeedback(puzzle, order))}>
          যাচাই করুন
        </button>
        <button type="button" className="btn btn-outline" data-testid="op-shuffle" onClick={reshuffle}>
          ↺ আবার এলোমেলো করুন
        </button>
      </div>
      {feedback && (
        <div
          role="status"
          data-testid={solved ? 'op-success' : 'op-feedback'}
          className="rounded-xl border-2 p-3"
          style={{ borderColor: solved ? 'var(--c-ok)' : 'var(--c-line)', background: solved ? 'var(--c-ok-soft)' : 'var(--c-sunken)' }}
        >
          {solved && <p className="font-bold">✅ ঠিক ক্রম</p>}
          <p>{feedback.messageBn}</p>
        </div>
      )}
    </div>
  )
}
