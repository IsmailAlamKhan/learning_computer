import type { ReactNode } from 'react'
import type { MockName, MOCK_REGIONS } from '../names'
import type { OsFlavor } from '../../../engine/types'

export interface MockProps {
  os?: OsFlavor
  /** one of MOCK_REGIONS[name] — drawn with a pulsing coral ring; everything else is dimmed */
  highlight?: string
  className?: string
}

/** A highlightable rectangle inside the 480×300 drawing, with its Bengali name (used in the aria-label). */
export interface Box { x: number; y: number; w: number; h: number; r?: number; bn: string }
type RegionsOf<N extends MockName> = Record<(typeof MOCK_REGIONS)[N][number], Box>

export interface MockDef {
  titleBn: string
  regions: (os: OsFlavor) => Record<string, Box>
  draw: (os: OsFlavor) => ReactNode
  /** window-style mock whose look does not depend on the OS flavour */
  fixedOs?: OsFlavor
}

/** Type-checked: `regions` must contain exactly the names listed for this mock in MOCK_REGIONS. */
export function defineMock<N extends MockName>(
  _name: N,
  d: { titleBn: string; regions: (os: OsFlavor) => RegionsOf<N>; draw: (os: OsFlavor) => ReactNode; fixedOs?: OsFlavor },
): MockDef {
  return d as MockDef
}

export const W = 480
export const H = 300
export const FONT = "'Segoe UI', system-ui, -apple-system, 'Noto Sans Bengali', sans-serif"
export const MONO = "Menlo, Consolas, 'Cascadia Mono', 'DejaVu Sans Mono', monospace"
/** the sim's greys */
export const G = {
  ink: '#111827', muted: '#6b7280', line: '#d1d5db', bar: '#f3f3f6', panel: '#f8f8fb', sunken: '#eef0f5', white: '#ffffff',
  sky: '#0ea5e9', skyDark: '#0284c7', skySoft: '#e0f2fe',
  yellow: '#f5b82e', ok: '#16a34a', red: '#ef4444',
  violet: '#6d28d9', teal: '#0f766e', coral: '#e8505b', darkBar: '#202020',
}

export function rrPath(x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2)
  return `M${x + k} ${y}H${x + w - k}A${k} ${k} 0 0 1 ${x + w} ${y + k}V${y + h - k}A${k} ${k} 0 0 1 ${x + w - k} ${y + h}H${x + k}A${k} ${k} 0 0 1 ${x} ${y + h - k}V${y + k}A${k} ${k} 0 0 1 ${x + k} ${y}Z`
}

const CSS = `.mk-glow{animation:mk-pulse 1.1s ease-in-out infinite}
@keyframes mk-pulse{0%,100%{opacity:.16}50%{opacity:.62}}
@media (prefers-reduced-motion:reduce){.mk-glow{animation:none;opacity:.4}}`

/** The ring drawn around a region: region + 4 px padding, pulled back inside the drawing so the thick glow stroke is never clipped at the edge. */
export const RING_PAD = 4
export const RING_STROKE = 9
export function ringBox(b: Box): { x: number; y: number; w: number; h: number; r: number } {
  const m = RING_STROKE / 2 + 0.5
  const x0 = Math.max(m, b.x - RING_PAD)
  const y0 = Math.max(m, b.y - RING_PAD)
  const x1 = Math.min(W - m, b.x + b.w + RING_PAD)
  const y1 = Math.min(H - m, b.y + b.h + RING_PAD)
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, r: (b.r ?? 6) + RING_PAD }
}

export function MockSvg({ def, os, highlight, className }: MockProps & { def: MockDef; os: OsFlavor }) {
  const regs = def.regions(os)
  const hl = highlight ? regs[highlight] : undefined
  const label = hl ? `${def.titleBn}। ${hl.bn} চিহ্নিত` : def.titleBn
  const ring = hl ? ringBox(hl) : undefined
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      data-highlight={hl ? highlight : undefined}
      className={className}
      style={{ display: 'block', width: '100%', maxWidth: 560, height: 'auto', borderRadius: 16, boxShadow: '0 8px 24px rgba(30,27,58,.22), 0 1px 3px rgba(30,27,58,.2)', background: '#fff', fontFamily: FONT }}
    >
      <style>{CSS}</style>
      <defs>
        <filter id="mk-sh" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity=".28" />
        </filter>
        <linearGradient id="mk-wall-w" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a8a" /><stop offset=".55" stopColor="#2563eb" /><stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="mk-wall-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4338ca" /><stop offset=".55" stopColor="#be185d" /><stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      {def.draw(os)}
      {hl && ring && (
        <g pointerEvents="none">
          <path d={`M0 0H${W}V${H}H0Z${rrPath(ring.x, ring.y, ring.w, ring.h, ring.r)}`} fillRule="evenodd" fill="#1e1b3a" opacity=".42" />
          <rect className="mk-glow" x={ring.x} y={ring.y} width={ring.w} height={ring.h} rx={ring.r} fill="none" stroke="#e8505b" strokeWidth={RING_STROKE} />
          <rect data-ring={highlight} x={ring.x} y={ring.y} width={ring.w} height={ring.h} rx={ring.r} fill="none" stroke="#e8505b" strokeWidth={3} />
        </g>
      )}
    </svg>
  )
}

type TProps = { x: number; y: number; s?: number; c?: string; w?: number; a?: 'start' | 'middle' | 'end'; mono?: boolean; op?: number; children: ReactNode; len?: number; i?: boolean }
export function T({ x, y, s = 10, c = G.ink, w = 400, a = 'start', mono, op, len, i, children }: TProps) {
  return (
    <text x={x} y={y} fontSize={s} fill={c} fontWeight={w} textAnchor={a} fontFamily={mono ? MONO : FONT} opacity={op} fontStyle={i ? 'italic' : undefined} xmlSpace="preserve" textLength={len} lengthAdjust={len ? 'spacingAndGlyphs' : undefined}>
      {children}
    </text>
  )
}

type RProps = { x: number; y: number; w: number; h: number; r?: number; f?: string; s?: string; sw?: number; op?: number; filter?: boolean }
export function Rc({ x, y, w, h, r = 4, f = '#fff', s, sw = 1, op, filter }: RProps) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={f} stroke={s} strokeWidth={s ? sw : undefined} opacity={op} filter={filter ? 'url(#mk-sh)' : undefined} />
}

export const TB = 28

/** Window frame (Windows 11 or macOS look). Body starts at y + TB. */
export function Chrome({ x, y, w, h, os, title, dark, tabs, children }: { x: number; y: number; w: number; h: number; os: OsFlavor; title?: string; dark?: boolean; tabs?: string[]; children?: ReactNode }) {
  const bar = dark ? (os === 'mac' ? '#2b2d33' : G.darkBar) : os === 'mac' ? '#e9e9ee' : G.bar
  const fg = dark ? '#e5e7eb' : G.ink
  return (
    <g>
      <Rc x={x} y={y} w={w} h={h} r={os === 'mac' ? 10 : 8} f={dark ? '#1e1e24' : '#fff'} s={dark ? '#000' : '#cfd3dc'} filter />
      <path d={`M${x} ${y + TB}V${y + 9}a9 9 0 0 1 9 -9H${x + w - 9}a9 9 0 0 1 9 9V${y + TB}Z`} fill={bar} transform={`translate(0 0)`} />
      {os === 'mac' ? (
        <g>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <circle key={c} cx={x + 16 + i * 18} cy={y + TB / 2} r={5.5} fill={c} />)}
          {!tabs && title && <T x={x + w / 2} y={y + 18} s={11} w={600} a="middle" c={fg}>{title}</T>}
        </g>
      ) : (
        <g stroke={fg} strokeWidth={1.2} fill="none" strokeLinecap="round">
          <path d={`M${x + w - 106} ${y + 14}h9`} />
          <rect x={x + w - 70} y={y + 9} width={9} height={9} rx={1.5} />
          <path d={`M${x + w - 33} ${y + 9}l9 9M${x + w - 24} ${y + 9}l-9 9`} />
          {!tabs && title && (
            <g stroke="none">
              <rect x={x + 10} y={y + 8} width={12} height={12} rx={3} fill={G.sky} />
              <T x={x + 28} y={y + 18} s={11} c={fg}>{title}</T>
            </g>
          )}
        </g>
      )}
      {tabs && tabs.map((t, i) => {
        const tx = x + (os === 'mac' ? 76 : 10) + i * 112
        return (
          <g key={t}>
            <path d={rrPath(tx, y + 4, 106, TB - 4, 6)} fill={i === 0 ? (dark ? '#1e1e24' : '#fff') : 'none'} />
            <T x={tx + 12} y={y + 19} s={10.5} c={fg} w={i === 0 ? 600 : 400}>{t}</T>
            <T x={tx + 94} y={y + 19} s={10} c={G.muted}>×</T>
          </g>
        )
      })}
      {children}
    </g>
  )
}

/* ------------------------------------------------------------------ small icons ------------------------------------------------------------------ */
export function FolderIcon({ x, y, s = 1, c = G.yellow }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 5a3 3 0 0 1 3-3h9l4 4h17a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" fill={c} />
      <path d="M0 11a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" fill="#fff" opacity=".28" />
    </g>
  )
}
export function DocIcon({ x, y, s = 1, c = '#fff', accent = G.sky }: { x: number; y: number; s?: number; c?: string; accent?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 2a2 2 0 0 1 2-2h14l8 8v22a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" fill={c} stroke="#b6bccb" strokeWidth="1.2" />
      <path d="M16 0v6a2 2 0 0 0 2 2h6z" fill="#dfe3ee" stroke="#b6bccb" strokeWidth="1.2" />
      <path d="M5 14h14M5 19h14M5 24h9" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  )
}
export function Wifi({ x, y, c = G.ink, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <path d="M0 4.5a9 9 0 0 1 14 0M3 7.5a5 5 0 0 1 8 0" />
      <circle cx="7" cy="10.5" r="1" fill={c} stroke="none" />
    </g>
  )
}
export function Battery({ x, y, c = G.ink, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="0" width="16" height="8" rx="2" fill="none" stroke={c} strokeWidth="1.3" />
      <rect x="2" y="2" width="9" height="4" rx="1" fill={c} />
      <rect x="16.8" y="2.5" width="1.6" height="3" rx=".6" fill={c} />
    </g>
  )
}
export function Speaker({ x, y, c = G.ink, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 3h3l4-3v10l-4-3H0z" fill={c} />
      <path d="M9.5 2.5a4 4 0 0 1 0 5M11.5 .5a7 7 0 0 1 0 9" />
    </g>
  )
}
export function Magnifier({ x, y, c = G.muted, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="5" cy="5" r="4" /><path d="M8.2 8.2L12 12" />
    </g>
  )
}
export function Cursor({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0v15l4-3.6 3 6.6 2.4-1.1-3-6.4H13z" fill="#fff" stroke="#111827" strokeWidth="1.3" strokeLinejoin="round" />
    </g>
  )
}
/** coloured rounded-square app tile with a simple white glyph */
export function AppTile({ x, y, s, c, glyph, r }: { x: number; y: number; s: number; c: string; glyph: 'circle' | 'lines' | 'star' | 'grid' | 'envelope' | 'gear' | 'play' | 'cal' | 'face' | 'compass' | 'petals'; r?: number }) {
  const u = s / 40
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={s} height={s} rx={r ?? s * 0.24} fill={c} />
      <g transform={`scale(${u})`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {glyph === 'circle' && <circle cx="20" cy="20" r="9" />}
        {glyph === 'lines' && <path d="M10 12h20M10 20h20M10 28h12" />}
        {glyph === 'star' && <path d="M20 8l3.6 8 8.4 1-6.2 5.8 1.8 8.4L20 27l-7.6 4.2 1.8-8.4L8 17l8.4-1z" fill="#fff" stroke="none" />}
        {glyph === 'grid' && <g fill="#fff" stroke="none">{[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <circle key={`${i}${j}`} cx={11 + i * 9} cy={11 + j * 9} r="2.6" />))}</g>}
        {glyph === 'envelope' && <><rect x="8" y="12" width="24" height="17" rx="3" /><path d="M9 14l11 9 11-9" /></>}
        {glyph === 'gear' && <><circle cx="20" cy="20" r="5" /><path d="M20 7v4M20 29v4M7 20h4M29 20h4M11 11l3 3M26 26l3 3M29 11l-3 3M14 26l-3 3" /></>}
        {glyph === 'play' && <path d="M15 11l14 9-14 9z" fill="#fff" stroke="none" />}
        {glyph === 'cal' && <><rect x="9" y="11" width="22" height="20" rx="3" /><path d="M9 18h22M15 8v5M25 8v5" /></>}
        {glyph === 'face' && <><circle cx="14" cy="17" r="1.5" fill="#fff" /><circle cx="26" cy="17" r="1.5" fill="#fff" /><path d="M13 26q7 5 14 0" /></>}
        {glyph === 'compass' && <><circle cx="20" cy="20" r="12" /><path d="M25 15l-3.5 8-6.5 2 3.5-8z" fill="#fff" stroke="none" /></>}
        {glyph === 'petals' && <g stroke="none">{['#fda4af', '#fcd34d', '#86efac', '#93c5fd'].map((p, i) => <circle key={p} cx={20 + Math.cos((i * Math.PI) / 2) * 7} cy={20 + Math.sin((i * Math.PI) / 2) * 7} r="6" fill={p} opacity=".95" />)}</g>}
      </g>
    </g>
  )
}
export function Bin({ x, y, s = 1, c = '#cbd5e1' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M4 8h24l-2.4 22a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z" fill={c} stroke="#64748b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 8h28M12 8V4.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 20 4.5V8" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 14v13M16 14v13M20 14v13" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
    </g>
  )
}
export function Pc({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="2" y="2" width="30" height="20" rx="2.5" fill="#7dd3fc" stroke="#0369a1" strokeWidth="1.8" />
      <path d="M12 28h10M17 22v6" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}
export const defaultOs = (name: MockName): OsFlavor => (name.startsWith('mac') || name.endsWith('-mac') ? 'mac' : 'windows')
