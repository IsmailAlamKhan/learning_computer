import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import type { OsFlavor } from '../types'
import { coachTarget } from '../actions'
import { demoPlan, type DemoPlan } from '../runner'
import { comboLabel, normalizeCombo } from '../../sim/shortcuts'
import type { GuidedRun } from './useGuidedRun'
import { targetId } from '../actions'

interface Rect {
  x: number
  y: number
  w: number
  h: number
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
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [bubblePos, setBubblePos] = useState<{ left: number; top: number }>({ left: 12, top: 12 })
  const [cursor, setCursor] = useState<{ x: number; y: number; ripple: number; visible: boolean }>({ x: 0, y: 0, ripple: 0, visible: false })
  const [demoText, setDemoText] = useState('')
  const plan: DemoPlan = step ? demoPlan(step.expectedAction) : { kind: 'none' }

  // place the bubble near the target without covering it
  useLayoutEffect(() => {
    const w = wrapperRef.current
    const b = bubbleRef.current
    if (!w || !b) return
    const W = w.clientWidth
    const H = w.clientHeight
    const bw = b.offsetWidth
    const bh = b.offsetHeight
    if (!rect) return setBubblePos({ left: Math.max(8, (W - bw) / 2), top: 10 })
    // a huge target (the whole desktop): float the bubble in the middle so icons stay visible
    if (rect.w * rect.h > 0.45 * W * H) {
      const l = Math.max(8, (W - bw) / 2)
      const t = Math.max(8, (H - bh) / 2)
      return setBubblePos((p) => (p.left === l && p.top === t ? p : { left: l, top: t }))
    }
    let left = rect.x + rect.w / 2 - bw / 2
    left = Math.max(8, Math.min(left, W - bw - 8))
    const below = rect.y + rect.h + 16
    const above = rect.y - bh - 16
    let top = below + bh <= H - 8 ? below : above >= 8 ? above : Math.max(8, Math.min(H - bh - 8, rect.y + rect.h / 2 - bh / 2))
    // if neither fits, sit beside the target
    if (below + bh > H - 8 && above < 8) {
      const right = rect.x + rect.w + 16
      left = right + bw <= W - 8 ? right : Math.max(8, rect.x - bw - 16)
      top = Math.max(8, Math.min(H - bh - 8, rect.y))
    }
    setBubblePos((p) => (p.left === left && p.top === top ? p : { left, top }))
  }, [rect, wrapperRef, step?.id, run.level, run.simplerOpen, run.phase])

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
    if (plan.kind === 'keys' || plan.kind === 'none' || !t) {
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
        className="pointer-events-auto absolute w-[min(340px,calc(100%-16px))] rounded-2xl border-2 p-4 shadow-2xl"
        style={{ left: bubblePos.left, top: bubblePos.top, background: 'var(--c-surface)', borderColor: 'var(--c-brand)', color: 'var(--c-ink)', fontSize: '1rem', lineHeight: 1.6 }}
      >
        {waiting ? (
          <>
            <div className="mb-1 flex items-center justify-between text-sm" style={{ color: 'var(--c-muted)' }}>
              <span>
                ধাপ {run.index + 1} / {run.steps.length}
              </span>
            </div>
            <p className="font-bold">{step.titleBn}</p>
            <p className="mt-1">{text}</p>
            {plan.kind === 'keys' && (
              <p className="mt-2">
                <Keycaps keys={plan.keys} os={os} />
              </p>
            )}
            {demoText && (
              <p className="mt-2 rounded-lg px-3 py-1" style={{ background: 'var(--c-sunken)' }} aria-hidden="true">
                লিখুন: <code className="font-bold">{demoText}</code>
              </p>
            )}
            {run.level >= 1 && (
              <p className="mt-2 rounded-lg px-3 py-2" style={{ background: 'var(--c-accent-soft)' }}>
                💡 {step.hintBn}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {isContinue && (
                <button className="btn" onClick={run.complete}>
                  বুঝেছি, পরের ধাপ →
                </button>
              )}
              {run.level >= 2 && !isContinue && (
                <button className="btn" onClick={run.showDemo}>
                  👀 দেখিয়ে দিন
                </button>
              )}
              {!isContinue && (
                <button className="btn btn-outline" onClick={run.toggleSimpler} aria-pressed={run.simplerOpen}>
                  🤔 আমি আটকে গেছি
                </button>
              )}
            </div>
            {run.simplerOpen && !step.simplerBn && <p className="mt-2 text-sm">কোনো তাড়া নেই। ওপরের লেখাটি আরেকবার ধীরে পড়ুন, তারপর যেখানে চিহ্ন দেওয়া আছে সেখানে চেষ্টা করুন। দরকার হলে “দেখিয়ে দিন” চাপুন।</p>}
          </>
        ) : (
          <p className="font-bold" style={{ color: 'var(--c-ok)' }}>
            ✓ {run.praise}
          </p>
        )}
      </div>
    </div>
  )
}
