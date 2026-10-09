import { useEffect, useMemo, useRef, useState } from 'react'
import { ArtView } from './illustrations/ArtView'
import { BADGES, badgeById } from '../state/gamification'
import { useFmt } from './useFmt'
import type { ArtName } from '../engine/types'

export const CHEERS = ['শাবাশ!', 'দারুণ হয়েছে!', 'এভাবেই চলুক!', 'চমৎকার!', 'একদম ঠিক পথে!']

export function prefersReducedMotion(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/** Counts from 0 up to `to` over `ms`; shows the final value at once when motion is reduced. */
export function useCountUp(to: number, ms = 900, reduced = prefersReducedMotion()): number {
  const [v, setV] = useState(reduced ? to : 0)
  useEffect(() => {
    if (reduced || to <= 0) {
      setV(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, ms, reduced])
  return v
}

const COLORS = ['#6d28d9', '#0f766e', '#c8324b', '#f59e0b', '#2563eb', '#ec4899']

/** A short (≤ 2.4 s) confetti burst on a canvas. Draws nothing when motion is reduced. */
function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext?.('2d')
    if (!c || !ctx) return
    const w = (c.width = c.clientWidth || 300)
    const h = (c.height = c.clientHeight || 300)
    const parts = Array.from({ length: 70 }, (_, i) => ({
      x: w / 2,
      y: h * 0.32,
      vx: (Math.random() - 0.5) * 11,
      vy: -Math.random() * 11 - 3,
      r: 3 + Math.random() * 4,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      c: COLORS[i % COLORS.length],
    }))
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = now - t0
      ctx.clearRect(0, 0, w, h)
      if (t > 2400) return
      const fade = t > 1800 ? 1 - (t - 1800) / 600 : 1
      ctx.globalAlpha = fade
      for (const p of parts) {
        p.vy += 0.28
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.c
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        ctx.restore()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" data-testid="confetti" />
}

const SPARKS = [
  { l: '8%', t: '14%', s: 22, d: 0 },
  { l: '88%', t: '10%', s: 26, d: 0.4 },
  { l: '14%', t: '58%', s: 18, d: 0.8 },
  { l: '84%', t: '52%', s: 20, d: 0.2 },
  { l: '50%', t: '3%', s: 16, d: 1 },
]

/** A big, calm celebration card: didi cheers, XP counts up, streak flame, new badges pop in. */
export function Celebration({ title, xp, streak, badges, sub }: { title?: string; xp?: number; streak?: number; badges?: string[]; sub?: string }) {
  const { n } = useFmt()
  const reduced = prefersReducedMotion()
  const cheer = useMemo(() => title ?? CHEERS[Math.floor(Math.random() * CHEERS.length)], [title])
  const shown = useCountUp(xp ?? 0, 900, reduced)
  const medals = (badges ?? []).map((id) => badgeById(id)).filter((b): b is (typeof BADGES)[number] => !!b)
  return (
    <div role="status" className="card relative overflow-hidden text-center" style={{ background: 'linear-gradient(160deg, var(--c-brand-soft), var(--c-surface) 70%)' }} data-testid="celebration" data-reduced={reduced}>
      {!reduced && <Confetti />}
      {SPARKS.map((s, i) => (
        <span key={i} aria-hidden="true" className="spark" style={{ left: s.l, top: s.t, fontSize: s.s, animationDelay: `${s.d}s` }} data-testid="sparkle">✨</span>
      ))}
      <div className="relative flex flex-col items-center gap-4">
        <div className={reduced ? '' : 'pop-in'}><ArtView name="didi-cheer" size={150} tile={false} /></div>
        <h2 className="t-title">{cheer}</h2>
        {sub && <p className="text-lg text-muted">{sub}</p>}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {xp !== undefined && xp > 0 && (
            <span className="stat-pill text-xl" data-testid="celebration-xp" style={{ background: 'var(--c-warn-soft)', color: 'var(--c-warn)' }}>
              <span aria-hidden="true">⭐</span> +{n(shown)} XP
            </span>
          )}
          {streak !== undefined && streak > 0 && (
            <span role="img" className="stat-pill text-xl" data-testid="celebration-streak" style={{ background: 'var(--c-accent-soft)' }} aria-label={`টানা ${n(streak)} দিন`}>
              <span aria-hidden="true" className="flame" data-alive="true">🔥</span> <span aria-hidden="true">{n(streak)} দিন</span>
            </span>
          )}
        </div>
        {medals.length > 0 && (
          <ul className="flex flex-wrap items-start justify-center gap-4" aria-label="নতুন পদক">
            {medals.map((b, i) => (
              <li key={b.id} className={reduced ? '' : 'pop-in'} style={{ animationDelay: reduced ? undefined : `${0.5 + i * 0.25}s` }} data-testid="badge">
                <ArtView name={b.art as ArtName} size={72} caption={b.titleBn} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** Tiny "+N XP" pill that floats in (for headers / toasts). */
export function XpPop({ xp }: { xp: number }) {
  const { n } = useFmt()
  if (xp <= 0) return null
  return <span className="stat-pill float-up" style={{ background: 'var(--c-warn-soft)', color: 'var(--c-warn)' }}>⭐ +{n(xp)}</span>
}
