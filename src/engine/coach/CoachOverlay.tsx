import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as RMouseEvent, type RefObject } from 'react'
import type { OsFlavor } from '../types'
import { coachTarget } from '../actions'
import { demoPlan, type DemoPlan } from '../runner'
import { comboLabel, normalizeCombo } from '../../sim/shortcuts'
import type { GuidedRun } from './useGuidedRun'
import { targetId } from '../actions'
import { ArtView } from '../../ui/illustrations/ArtView'
import { useFmt } from '../../ui/useFmt'

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Placement {
  left: number
  top: number
  /** slim full-width bar docked to an edge (narrow wrappers) */
  bar?: boolean
}

const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
const grow = (r: Rect, m: number): Rect => ({ x: r.x - m, y: r.y - m, w: r.w + 2 * m, h: r.h + 2 * m })
const union = (a: Rect, b: Rect): Rect => {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }
}

/**
 * Pick where the bubble goes so it never covers the highlighted target (+12 px margin) and stays inside the wrapper.
 * Order: below, above, right, left, then the corners; a huge target (> 45 % of the wrapper) docks to the emptiest corner;
 * a narrow wrapper (< 520 px) docks a slim bar to the bottom (or the top when the target is down there).
 */
export function placeBubble(target: Rect | null, W: number, H: number, bw: number, bh: number, inset: { top: number; bottom: number } = { top: 0, bottom: 0 }): Placement {
  const M = 8
  const clampX = (x: number) => Math.max(M, Math.min(x, W - bw - M))
  const clampY = (y: number) => Math.max(M, Math.min(y, H - bh - M))
  if (!target) return { left: clampX((W - bw) / 2), top: M }
  const t = grow(target, 12)
  const fits = (l: number, tp: number) => l >= M - 0.5 && tp >= M - 0.5 && l + bw <= W - M + 0.5 && tp + bh <= H - M + 0.5
  const hits = (l: number, tp: number) => overlap({ x: l, y: tp, w: bw, h: bh }, t) > 0
  if (W < 520) {
    const barW = W - 2 * M
    // the bar floats over the desktop, never over the taskbar / Dock / menu bar (inset)
    const cand = [H - bh - M - inset.bottom, M + inset.top]
    const best = cand.map((y) => ({ y, o: overlap({ x: M, y, w: barW, h: bh }, t) })).sort((a, b) => a.o - b.o)[0]
    return { left: M, top: Math.max(M + inset.top, best.y), bar: true }
  }
  const corners: [number, number][] = [
    [W - bw - M, H - bh - M],
    [M, H - bh - M],
    [W - bw - M, M],
    [M, M],
  ]
  if (target.w * target.h > 0.45 * W * H) {
    const best = corners.map(([l, tp]) => ({ l, tp, o: overlap({ x: l, y: tp, w: bw, h: bh }, target) })).sort((a, b) => a.o - b.o)[0]
    return { left: best.l, top: best.tp }
  }
  const cx = target.x + target.w / 2 - bw / 2
  const cy = target.y + target.h / 2 - bh / 2
  const candidates: [number, number][] = [
    [clampX(cx), target.y + target.h + 12 + 4],
    [clampX(cx), target.y - bh - 16],
    [target.x + target.w + 16, clampY(cy)],
    [target.x - bw - 16, clampY(cy)],
    ...corners,
  ]
  for (const [l, tp] of candidates) if (fits(l, tp) && !hits(l, tp)) return { left: l, top: tp }
  // nothing fits cleanly: least overlap
  const best = [...candidates, ...corners].map(([l, tp]) => ({ l: clampX(l), tp: clampY(tp) })).map((c) => ({ ...c, o: overlap({ x: c.l, y: c.tp, w: bw, h: bh }, target) })).sort((a, b) => a.o - b.o)[0]
  return { left: best.l, top: best.tp }
}

/** Heights taken by the simulated shell's bars (menu bar on top, taskbar / Dock at the bottom) inside the wrapper. */
function shellInsets(w: HTMLElement): { top: number; bottom: number } {
  const wr = w.getBoundingClientRect()
  const sim = w.querySelector<HTMLElement>('[data-sim-root]')?.getBoundingClientRect()
  const menu = w.querySelector<HTMLElement>('[data-coach="menubar"]')?.getBoundingClientRect()
  const bar = w.querySelector<HTMLElement>('[data-coach="taskbar"],[data-coach="dock"]')?.getBoundingClientRect()
  // the wrapper also holds the simulator's toolbar above the frame: the bar must stay inside the frame, below the menu bar and above the taskbar / Dock
  const top = Math.max(sim ? sim.top : wr.top, menu ? menu.bottom : wr.top) - wr.top
  const bottom = wr.bottom - Math.min(sim ? sim.bottom : wr.bottom, bar ? bar.top : wr.bottom)
  return { top: Math.max(0, Math.round(top)), bottom: Math.max(0, Math.round(bottom)) }
}

/** **bold** markup → <strong>. */
function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))}
    </>
  )
}

function findEl(wrapper: HTMLElement, id: string | undefined): HTMLElement | null {
  if (!id) return null
  const all = wrapper.querySelectorAll<HTMLElement>(`[data-coach="${id.replace(/["\\]/g, '\\$&')}"]`)
  for (const el of all) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) return el
  }
  return null
}

function useTargetRect(wrapperRef: RefObject<HTMLElement | null>, id: string | undefined, active: boolean): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null)
  useEffect(() => {
    if (!active) return setRect(null)
    let raf = 0
    const tick = () => {
      const w = wrapperRef.current
      const el = w && findEl(w, id)
      if (w && el) {
        const wr = w.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        const next = { x: Math.round(r.left - wr.left), y: Math.round(r.top - wr.top), w: Math.round(r.width), h: Math.round(r.height) }
        setRect((p) => (p && p.x === next.x && p.y === next.y && p.w === next.w && p.h === next.h ? p : next))
      } else setRect((p) => (p ? null : p))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [wrapperRef, id, active])
  return rect
}

/**
 * Coach buttons must not steal keyboard focus from the simulated computer (shortcuts like Ctrl+L keep working after a click):
 * mouse presses don't move focus, and after a pointer click the focus is handed back to the sim. Keyboard use is unchanged.
 */
function keepSimFocus(action: () => void) {
  return {
    onMouseDown: (e: RMouseEvent) => e.preventDefault(),
    onClick: (e: RMouseEvent) => {
      const sim = (e.currentTarget as HTMLElement).closest('.deck-sim')?.querySelector<HTMLElement>('[data-sim-root]')
      action()
      if (e.detail > 0 && sim) window.setTimeout(() => sim.focus({ preventScroll: true }), 0)
    },
  }
}

function PredictBox({ run, step }: { run: GuidedRun; step: NonNullable<GuidedRun['step']> }) {
  const [ans, setAns] = useState('')
  const [tries, setTries] = useState(0)
  const exp = step.expectedAction
  if (exp.type !== 'predictOutput') return null
  const submit = () => {
    if (!ans.trim()) return
    const ok = exp.acceptedAnswers.some((x) => (exp.ignoreCase ? x.trim().toLowerCase() === ans.trim().toLowerCase() : x.trim() === ans.trim()))
    if (!ok) setTries((t) => t + 1)
    run.submitPrediction(ans)
  }
  return (
    <div className="mt-2 space-y-2">
      <label className="block">
        <span className="text-sm font-medium">আপনার মনে হয় কী ছাপা হবে?</span>
        <input className="field mt-1 font-mono !min-h-10 !text-base" value={ans} onChange={(e) => setAns(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </label>
      <button className="btn btn-sm" onClick={submit} disabled={!ans.trim()}>
        উত্তর দিন
      </button>
      {tries > 0 && <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--c-accent-soft)' }}>প্রায় হয়েছে! একটু আবার ভেবে দেখুন — কোড লাইন ধরে ধরে পড়ুন। আন্দাজ ভুল হলেও দোষ নেই, চালিয়ে দেখলেই শেখা হয়।</p>}
    </div>
  )
}

export function Keycaps({ keys, os }: { keys: string; os: OsFlavor }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-middle">
      {comboLabel(normalizeCombo(keys, os), os)
        .split(' + ')
        .map((k, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">+</span>}
            <kbd className="rounded-md border-2 border-b-4 px-2 py-0.5 text-sm font-bold" style={{ borderColor: 'var(--c-ink)', background: 'var(--c-surface)' }}>
              {k}
            </kbd>
          </span>
        ))}
    </span>
  )
}

const Cursor = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.5))' }}>
    <path d="M5 3l14 9-6 1.5L10 20z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

function center(wrapper: HTMLElement | null, id: string | undefined): { x: number; y: number } | null {
  if (!wrapper) return null
  const el = findEl(wrapper, id)
  if (!el) return null
  const wr = wrapper.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + Math.min(r.height / 2, 24) }
}

interface Props {
  run: GuidedRun
  os: OsFlavor
  wrapperRef: RefObject<HTMLDivElement | null>
  /** Called when the learner taps "আমি আটকে গেছি" on a step with nothing simpler. */
  onStuck?: () => void
}

/** Speech bubble + highlight ring + animated cursor, pointing at the exact target of the current step. */
export function CoachOverlay({ run, os, wrapperRef }: Props) {
  const step = run.step
  const targetKey = step ? coachTarget(step) : undefined
  const active = !!step && !run.state.finished
  const rect = useTargetRect(wrapperRef, targetKey, active && run.phase === 'waiting')
  // a drag step also needs the drop target to stay visible and reachable: the bubble must not cover it either
  const dropKey = step?.expectedAction.type === 'drag' ? targetId(step.expectedAction.dropTarget) : undefined
  const dropRect = useTargetRect(wrapperRef, dropKey, active && run.phase === 'waiting' && !!dropKey)
  const avoid = useMemo(() => (rect && dropRect ? union(rect, dropRect) : rect), [rect, dropRect])
  const bubbleRef = useRef<HTMLDivElement>(null)
  const { n } = useFmt()
  const [pos, setPos] = useState<Placement>({ left: 12, top: 12 })
  const [hintOpen, setHintOpen] = useState(false)
  const [sizeTick, setSizeTick] = useState(0)
  const [cursor, setCursor] = useState<{ x: number; y: number; ripple: number; visible: boolean }>({ x: 0, y: 0, ripple: 0, visible: false })
  const [demoText, setDemoText] = useState('')
  const plan: DemoPlan = step ? demoPlan(step.expectedAction) : { kind: 'none' }

  // a new step closes the manual hint
  useEffect(() => setHintOpen(false), [step?.id])

  // re-place when the bubble's own size changes (hint opened, predict box, wrapped text)
  useEffect(() => {
    const b = bubbleRef.current
    if (!b || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setSizeTick((t) => t + 1))
    ro.observe(b)
    return () => ro.disconnect()
  })

  // place the bubble near the target without ever covering it
  useLayoutEffect(() => {
    const w = wrapperRef.current
    const b = bubbleRef.current
    if (!w || !b) return
    const W = w.clientWidth
    const H = w.clientHeight
    const bar = W < 520
    const bw = bar ? W - 16 : Math.min(300, W - 16)
    const next = placeBubble(avoid, W, H, bw, b.offsetHeight, bar ? shellInsets(w) : undefined)
    setPos((p) => (p.left === next.left && p.top === next.top && p.bar === next.bar ? p : next))
  }, [avoid, wrapperRef, step?.id, run.level, run.simplerOpen, run.phase, hintOpen, sizeTick, demoText])

  // "দেখিয়ে দিন": animate the correct action
  useEffect(() => {
    if (!run.demoKey || !step) return
    const w = wrapperRef.current
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const wr = w?.getBoundingClientRect()
    const startX = (wr?.width ?? 600) - 60
    const startY = 60
    const t = center(w, 'target' in plan ? targetId(plan.target) : undefined) ?? center(w, targetKey)
    setDemoText('')
    setCursor({ x: startX, y: startY, ripple: 0, visible: true })
    if (plan.kind === 'command') {
      let i = 0
      const text = plan.command
      const iv = window.setInterval(() => {
        i++
        setDemoText(text.slice(0, i))
        if (i >= text.length) window.clearInterval(iv)
      }, 120)
      timers.push(iv)
      setCursor((c) => ({ ...c, visible: false }))
    } else if (plan.kind === 'keys' || plan.kind === 'none' || !t) {
      at(2500, () => setCursor((c) => ({ ...c, visible: false })))
    } else if (plan.kind === 'type') {
      at(50, () => setCursor((c) => ({ ...c, x: t.x, y: t.y })))
      let i = 0
      const text = plan.text
      at(1000, () => {
        const iv = window.setInterval(() => {
          i++
          setDemoText(text.slice(0, i))
          if (i >= text.length) window.clearInterval(iv)
        }, 140)
        timers.push(iv)
      })
      at(1100 + text.length * 140 + 1200, () => setCursor((c) => ({ ...c, visible: false })))
    } else {
      at(50, () => setCursor((c) => ({ ...c, x: t.x, y: t.y })))
      const clicks = plan.kind === 'doubleClick' ? 2 : 1
      for (let i = 0; i < clicks; i++) at(1000 + i * 260, () => setCursor((c) => ({ ...c, ripple: c.ripple + 1 })))
      if (plan.kind === 'drag') {
        const to = center(w, targetId(plan.dropTarget))
        if (to) at(1500, () => setCursor((c) => ({ ...c, x: to.x, y: to.y })))
        at(3000, () => setCursor((c) => ({ ...c, visible: false })))
      } else at(2300, () => setCursor((c) => ({ ...c, visible: false })))
    }
    return () => {
      timers.forEach((id) => (window.clearTimeout(id), window.clearInterval(id)))
      setCursor((c) => ({ ...c, visible: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.demoKey])

  if (!step || run.state.finished) return null
  const waiting = run.phase === 'waiting'
  const isContinue = step.expectedAction.type === 'continue'
  const text = run.simplerOpen && step.simplerBn ? step.simplerBn : step.explanationBn
  const showHint = hintOpen || run.level >= 1

  return (
    <div className="pointer-events-none absolute inset-0 z-40" data-testid="coach-overlay">
      {waiting && rect && (
        <>
          <div
            className="coach-ring absolute rounded-lg"
            style={{ left: rect.x - 6, top: rect.y - 6, width: rect.w + 12, height: rect.h + 12 }}
            data-testid="coach-ring"
          />
          <div className="coach-bob absolute" style={{ left: rect.x + rect.w / 2 - 6, top: rect.y + Math.min(rect.h, 40) - 6 }} aria-hidden="true">
            <Cursor />
          </div>
        </>
      )}
      {cursor.visible && (
        <div className="absolute z-50 transition-transform duration-[900ms] ease-in-out" style={{ transform: `translate(${cursor.x - 4}px, ${cursor.y - 4}px)`, left: 0, top: 0 }} aria-hidden="true">
          <Cursor />
          {cursor.ripple > 0 && <span key={cursor.ripple} className="coach-ripple absolute left-0 top-0 h-10 w-10 -translate-x-1 -translate-y-1 rounded-full border-4" style={{ borderColor: 'var(--c-accent)' }} />}
        </div>
      )}
      <div
        ref={bubbleRef}
        role="status"
        aria-live="polite"
        className="coach-card pointer-events-auto absolute px-3 py-2.5"
        style={{ left: pos.left, top: pos.top, width: pos.bar ? 'calc(100% - 16px)' : 'min(300px, calc(100% - 16px))' }}
        data-testid="coach-bubble"
        data-bar={pos.bar ? 'true' : 'false'}
      >
        {waiting ? (
          <>
            <div className="flex items-start gap-2.5">
              <span className="flex-none" aria-hidden="true"><ArtView name="didi" size={44} tile={false} /></span>
              <p className="min-w-0 flex-1 font-medium"><Bold text={text} /></p>

            </div>
            {plan.kind === 'command' && (
              <p className="mt-1.5 rounded-lg px-2.5 py-1.5 text-sm" style={{ background: 'var(--c-sunken)' }}>
                লিখে Enter চাপুন: <code className="font-bold">{Array.isArray((step.expectedAction as { command: string | string[] }).command) ? (step.expectedAction as { command: string[] }).command[0] : (step.expectedAction as { command: string }).command}</code>
              </p>
            )}
            {step.expectedAction.type === 'predictOutput' && <PredictBox run={run} step={step} />}
            {plan.kind === 'keys' && (
              <p className="mt-1.5">
                <Keycaps keys={plan.keys} os={os} />
              </p>
            )}
            {demoText && (
              <p className="mt-1.5 rounded-lg px-2.5 py-1 text-sm" style={{ background: 'var(--c-sunken)' }} aria-hidden="true">
                লিখুন: <code className="font-bold">{demoText}</code>
              </p>
            )}
            {showHint && (
              <div className="mt-1.5 rounded-lg px-2.5 py-1.5 text-sm" style={{ background: 'var(--c-accent-soft)' }} data-testid="coach-hint">
                <p>💡 <Bold text={step.hintBn} /></p>
                {step.simplerBn && <p className="mt-0.5"><Bold text={step.simplerBn} /></p>}
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {isContinue && (
                <button className="coach-btn" data-primary="true" {...keepSimFocus(run.complete)}>
                  বুঝেছি →
                </button>
              )}
              <button className="coach-btn" {...keepSimFocus(() => setHintOpen(true))} aria-pressed={showHint}>
                <span aria-hidden="true">💡</span> হিন্ট
              </button>
              {!isContinue && (
                <button className={`coach-btn ${run.level >= 2 ? 'coach-nudge' : ''}`} {...keepSimFocus(run.showDemo)}>
                  <span aria-hidden="true">👀</span> দেখিয়ে দিন
                </button>
              )}
                            <span className="ml-auto flex-none rounded-full px-2 text-xs font-bold" style={{ background: 'var(--c-sunken)', color: 'var(--c-muted)' }} aria-label={`ধাপ ${n(run.index + 1)} এর মধ্যে ${n(run.steps.length)}`}>
                {n(run.index + 1)}/{n(run.steps.length)}
              </span>
            </div>
          </>
        ) : (
          <p className="flex items-center gap-2 font-bold" style={{ color: 'var(--c-ok)' }}>
            <span aria-hidden="true">✓</span> <span>{run.praise}</span> <span aria-hidden="true" className="spark" style={{ position: 'static' }}>✨</span>
          </p>
        )}
      </div>
    </div>
  )
}
