import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import type { OsFlavor, Visual } from '../../engine/types'
import type { MockName } from './names'
import { MOCKS, regionBoxes } from './mocks'
import { Cursor, DocIcon, FolderIcon, G, Rc, T } from './mocks/kit'
import { useReducedMotion } from './useReducedMotion'

export type DemoVisual = Extract<Visual, { kind: 'demo' }>
type Gesture = DemoVisual['gesture']

const GESTURE_BN: Record<Gesture, string> = {
  click: 'ক্লিক', 'double-click': 'ডাবল-ক্লিক', 'right-click': 'ডান-ক্লিক', drag: 'ড্র্যাগ (টেনে নিয়ে যাওয়া)', scroll: 'স্ক্রল',
  type: 'কিবোর্ডে টাইপ করা', keys: 'কিবোর্ডের কি চাপা', 'two-finger-tap': 'টাচপ্যাডে দুই আঙুলে ট্যাপ', 'two-finger-scroll': 'টাচপ্যাডে দুই আঙুলে স্ক্রল',
}
const DUR = 3.6

/* ---------------------------------------------------------------- keyframe helper ---------------------------------------------------------------- */
type KF = [number, string][]
const camel = (k: string) => k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
function parseStyle(s: string): CSSProperties {
  const o: Record<string, string> = {}
  for (const part of s.split(';')) {
    const i = part.indexOf(':')
    if (i > 0) o[camel(part.slice(0, i).trim())] = part.slice(i + 1).trim()
  }
  return o as CSSProperties
}
/** Builds scoped @keyframes; `sty(name)` is the animation style, or — when motion is reduced — the final (100 %) frame as a plain static style. */
function useTimeline(kfs: Record<string, KF>, reduced: boolean, paused: boolean, dur = DUR) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = `dm${raw}`
  const css = useMemo(() => Object.entries(kfs).map(([n, k]) => `@keyframes ${id}${n}{${k.map(([p, s]) => `${p}%{${s}}`).join('')}}`).join(''), [kfs, id])
  const sty = (name: string, extra: CSSProperties = {}): CSSProperties => {
    const k = kfs[name]
    if (reduced) return { ...extra, ...parseStyle(k[k.length - 1][1]) }
    return { ...extra, animation: `${id}${name} ${dur}s ease-in-out infinite both`, animationPlayState: paused ? 'paused' : 'running' }
  }
  return { css, sty }
}
const T0 = (x: number, y: number) => `transform:translate(${x}px,${y}px)`
const FB = { transformBox: 'fill-box', transformOrigin: 'center' } as CSSProperties

/* ---------------------------------------------------------------- targets on the mocks ---------------------------------------------------------------- */
type Pt = [number, number]
interface Targets { a: Pt; b: Pt; start: Pt }
function targetsFor(mock: MockName, os: OsFlavor): Targets {
  if (mock === 'file-explorer') return { a: [186, 210], b: [299, 124], start: [330, 270] }
  if (mock === 'finder') return { a: [180, 186], b: [296, 98], start: [330, 270] }
  const r = Object.values(regionBoxes(mock, os))
  const c = (b: { x: number; y: number; w: number; h: number }): Pt => [b.x + b.w / 2, b.y + b.h / 2]
  const a = c(r[0]), b = c(r[r.length - 1])
  return { a, b: b[0] === a[0] && b[1] === a[1] ? [a[0] + 80, a[1] + 40] : b, start: [Math.min(440, a[0] + 120), Math.min(280, a[1] + 90)] }
}
const defaultMock = (os: OsFlavor): MockName => (os === 'mac' ? 'finder' : 'file-explorer')

/* ---------------------------------------------------------------- shared SVG bits ---------------------------------------------------------------- */
function Ripple({ at, style, r = 16 }: { at: Pt; style: CSSProperties; r?: number }) {
  return <circle cx={at[0]} cy={at[1]} r={r} fill="#e8505b" fillOpacity={0.35} stroke="#e8505b" strokeWidth={2.5} style={{ ...FB, ...style }} />
}
function ArrowTo({ from, to, dashed = true }: { from: Pt; to: Pt; dashed?: boolean }) {
  const dx = to[0] - from[0], dy = to[1] - from[1]
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len, uy = dy / len
  const ex = to[0] - ux * 16, ey = to[1] - uy * 16
  return (
    <g data-static-arrow stroke="#e8505b" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M${from[0]} ${from[1]}L${ex} ${ey}`} strokeDasharray={dashed ? '2 8' : undefined} />
      <path d={`M${ex - uy * 7 - ux * 7} ${ey + ux * 7 - uy * 7}L${ex} ${ey}L${ex + uy * 7 - ux * 7} ${ey - ux * 7 - uy * 7}`} />
    </g>
  )
}
function MiniMenu({ at, os, style }: { at: Pt; os: OsFlavor; style: CSSProperties }) {
  const rows = os === 'mac' ? ['Open', 'Copy', 'Rename', 'Move to Trash'] : ['Open', 'Copy', 'Rename', 'Delete']
  return (
    <g style={{ ...FB, transformOrigin: `${at[0]}px ${at[1]}px`, ...style }}>
      <Rc x={at[0]} y={at[1]} w={124} h={rows.length * 22 + 10} r={os === 'mac' ? 9 : 7} f="#fff" s="#cfd3dc" filter />
      {rows.map((r, i) => (
        <g key={r}>
          {i === 0 && <Rc x={at[0] + 5} y={at[1] + 5} w={114} h={22} r={5} f={G.skySoft} />}
          <T x={at[0] + 14} y={at[1] + 20 + i * 22} s={11}>{r}</T>
        </g>
      ))}
    </g>
  )
}
function Item({ at, kind = 'd', style }: { at: Pt; kind?: 'd' | 'f'; style?: CSSProperties }) {
  return (
    <g style={style}>
      {kind === 'd' ? <DocIcon x={at[0] - 16} y={at[1] - 22} s={1.4} /> : <FolderIcon x={at[0] - 22} y={at[1] - 18} s={1.2} />}
    </g>
  )
}

/* ---------------------------------------------------------------- pointer gestures on a mock ---------------------------------------------------------------- */
function PointerScene({ gesture, mock, os, reduced, paused }: { gesture: 'click' | 'double-click' | 'right-click' | 'drag'; mock: MockName; os: OsFlavor; reduced: boolean; paused: boolean }) {
  const tg = targetsFor(mock, os)
  const [ax, ay] = gesture === 'right-click' ? tg.b : tg.a
  const [bx, by] = tg.b
  const [sx, sy] = tg.start
  const kfs = useMemo<Record<string, KF>>(() => {
    const rip = (at: number): KF => [[0, 'opacity:0;transform:scale(.3)'], [at, 'opacity:0;transform:scale(.3)'], [at + 1, 'opacity:.9;transform:scale(.4)'], [at + 8, 'opacity:0;transform:scale(1.7)'], [100, 'opacity:0;transform:scale(1.7)']]
    if (gesture === 'drag') {
      return {
        cur: [[0, `opacity:0;${T0(sx, sy)}`], [4, `opacity:1;${T0(sx, sy)}`], [12, `opacity:1;${T0(ax, ay)}`], [20, `opacity:1;${T0(ax, ay)}`], [28, `opacity:1;${T0(bx, by)}`], [100, `opacity:1;${T0(bx, by)}`]],
        press: [[0, 'transform:scale(1)'], [14, 'transform:scale(1)'], [16, 'transform:scale(.85)'], [30, 'transform:scale(.85)'], [32, 'transform:scale(1)'], [100, 'transform:scale(1)']],
        ghost: [[0, `opacity:0;${T0(0, 0)}`], [13, `opacity:0;${T0(0, 0)}`], [14, `opacity:.9;${T0(0, 0)}`], [20, `opacity:.9;${T0(0, 0)}`], [28, `opacity:.9;${T0(bx - ax, by - ay)}`], [34, `opacity:.9;${T0(bx - ax, by - ay)}`], [40, `opacity:0;${T0(bx - ax, by - ay)}`], [100, `opacity:0;${T0(bx - ax, by - ay)}`]],
        dest: [[0, 'opacity:0'], [24, 'opacity:0'], [28, 'opacity:1'], [100, 'opacity:1']],
        rip: rip(30),
      } as Record<string, KF>
    }
    const sel: KF = [[0, 'opacity:0'], [19, 'opacity:0'], [21, 'opacity:1'], [100, 'opacity:1']]
    return {
      cur: [[0, `opacity:0;${T0(sx, sy)}`], [4, `opacity:1;${T0(sx, sy)}`], [12, `opacity:1;${T0(ax, ay)}`], [100, `opacity:1;${T0(ax, ay)}`]],
      press: [[0, 'transform:scale(1)'], [18, 'transform:scale(1)'], [20, 'transform:scale(.85)'], [24, 'transform:scale(1)'], [100, 'transform:scale(1)']],
      press2: [[0, 'transform:scale(1)'], [32, 'transform:scale(1)'], [34, 'transform:scale(.85)'], [38, 'transform:scale(1)'], [100, 'transform:scale(1)']],
      rip: rip(19), rip2: rip(33), sel,
      menu: [[0, 'opacity:0;transform:scale(.9)'], [22, 'opacity:0;transform:scale(.9)'], [26, 'opacity:1;transform:scale(1)'], [100, 'opacity:1;transform:scale(1)']],
      open: [[0, 'opacity:0;transform:scale(.88)'], [38, 'opacity:0;transform:scale(.88)'], [43, 'opacity:1;transform:scale(1)'], [100, 'opacity:1;transform:scale(1)']],
    } as Record<string, KF>
  }, [gesture, ax, ay, bx, by, sx, sy])
  const { css, sty } = useTimeline(kfs, reduced, paused)
  const dbl = gesture === 'double-click'
  return (
    <svg viewBox="0 0 480 300" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <style>{css}</style>
      {gesture === 'drag' ? (
        <g>
          <g style={sty('dest')}><rect x={bx - 52} y={by - 42} width={104} height={82} rx={10} fill="#e8505b" fillOpacity={0.12} stroke="#e8505b" strokeWidth={3} strokeDasharray="6 4" /></g>
          <g style={sty('ghost')}><Item at={[ax, ay]} /></g>
          <Ripple at={[bx, by]} style={sty('rip')} r={18} />
        </g>
      ) : (
        <g>
          <g style={sty('sel')}><rect x={ax - 50} y={ay - 40} width={100} height={78} rx={8} fill="#0ea5e9" fillOpacity={0.14} stroke="#0ea5e9" strokeWidth={2} /></g>
          <Ripple at={[ax, ay]} style={sty('rip')} />
          {dbl && <Ripple at={[ax, ay]} style={sty('rip2')} />}
          {gesture === 'right-click' && <MiniMenu at={[ax + 8, ay + 8]} os={os} style={sty('menu')} />}
          {dbl && (
            <g style={sty('open', { transformOrigin: '240px 150px' })}>
              <Rc x={150} y={70} w={180} h={130} r={10} f="#fff" s="#cfd3dc" filter />
              <path d="M150 80a10 10 0 0 1 10-10h160a10 10 0 0 1 10 10v14H150z" fill="#f3f3f6" />
              <T x={164} y={87} s={10} w={600}>notes.txt</T>
              {[0, 1, 2].map((i) => <rect key={i} x={164} y={110 + i * 20} width={[130, 100, 70][i]} height={7} rx={3.5} fill="#dfe3ee" />)}
            </g>
          )}
        </g>
      )}
      {reduced && <ArrowTo from={gesture === 'drag' ? [ax, ay] : [sx, sy]} to={gesture === 'drag' ? [bx, by] : [ax, ay]} />}
      <g style={sty('cur')}>
        <g style={{ ...FB, transformOrigin: '0px 0px', ...sty('press') }}><Cursor x={0} y={0} s={1.5} /></g>
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- scroll ---------------------------------------------------------------- */
const LIST = ['Class notes', 'Photos', 'Resume.docx', 'notes.txt', 'Form.pdf', 'Songs', 'Videos', 'Budget.xlsx', 'Trip plan', 'Selfie.jpg', 'Poem.txt', 'Thesis.docx']
function ScrollList({ x, y, w, h, offset, style, rowH = 30, fs = 12 }: { x: number; y: number; w: number; h: number; offset: string; style: CSSProperties; rowH?: number; fs?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <g>
      <clipPath id={`sc${id}`}><rect x={x} y={y} width={w} height={h} rx={8} /></clipPath>
      <Rc x={x} y={y} w={w} h={h} r={8} f="#fff" s="#cfd3dc" />
      <g clipPath={`url(#sc${id})`}>
        <g style={{ ...style }} data-offset={offset}>
          {LIST.map((n, i) => (
            <g key={n}>
              <rect x={x + 12} y={y + 6 + i * rowH + 4} width={16} height={16} rx={4} fill={i % 3 === 0 ? '#f5b82e' : G.sky} opacity={0.85} />
              <T x={x + 38} y={y + 6 + i * rowH + 17} s={fs}>{n}</T>
              <rect x={x + 8} y={y + 6 + i * rowH + rowH - 1} width={w - 24} height={1} fill="#eef0f5" />
            </g>
          ))}
        </g>
      </g>
    </g>
  )
}
const scrollKf = (step: number, max: number): Record<string, KF> => ({
  list: [[0, T0(0, 0)], [18, T0(0, 0)], [26, T0(0, -step)], [40, T0(0, -step)], [48, T0(0, -2 * step)], [62, T0(0, -2 * step)], [70, T0(0, -max)], [100, T0(0, -max)]],
  thumb: [[0, T0(0, 0)], [18, T0(0, 0)], [26, T0(0, step / 3.6)], [40, T0(0, step / 3.6)], [48, T0(0, (2 * step) / 3.6)], [62, T0(0, (2 * step) / 3.6)], [70, T0(0, max / 3.6)], [100, T0(0, max / 3.6)]],
  cur: [[0, 'opacity:0'], [4, 'opacity:1'], [100, 'opacity:1']],
  chev: [[0, 'opacity:0'], [16, 'opacity:0'], [20, 'opacity:1'], [28, 'opacity:0'], [38, 'opacity:0'], [42, 'opacity:1'], [50, 'opacity:0'], [60, 'opacity:0'], [64, 'opacity:1'], [72, 'opacity:0'], [100, 'opacity:0']],
})
function ScrollScene({ reduced, paused }: { reduced: boolean; paused: boolean }) {
  const kfs = useMemo(() => scrollKf(60, 150), [])
  const { css, sty } = useTimeline(kfs, reduced, paused)
  return (
    <svg viewBox="0 0 480 300" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, background: '#eef0f7' }}>
      <style>{css}</style>
      <Rc x={40} y={18} w={400} h={264} r={12} f="#f3f3f6" s="#cfd3dc" filter />
      <T x={58} y={42} s={13} w={700}>Documents</T>
      <ScrollList x={56} y={54} w={352} h={212} offset="0" style={sty('list')} />
      <rect x={414} y={58} width={8} height={204} rx={4} fill="#dfe3ee" />
      <rect x={414} y={58} width={8} height={70} rx={4} fill="#9ca3c0" style={sty('thumb')} />
      <g style={sty('cur')}>
        <Cursor x={300} y={170} s={1.5} />
      </g>
      <g style={sty('chev')} fill="none" stroke="#e8505b" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M455 150v-24M447 134l8-8 8 8" />
      </g>
      {reduced && <g data-static-arrow fill="none" stroke="#e8505b" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M455 190v-70M447 128l8-8 8 8" /></g>}
    </svg>
  )
}

/* ---------------------------------------------------------------- keys ---------------------------------------------------------------- */
const ARROW: Record<string, string> = { up: '▲', down: '▼', left: '◀', right: '▶' }
export function keyLabels(keys: string, os: OsFlavor): string[] {
  return keys
    .split('+')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)
    .map((k) => {
      if (k === 'mod') return os === 'mac' ? '⌘ Cmd' : 'Ctrl'
      if (k === 'ctrl' || k === 'control') return os === 'mac' ? 'Control' : 'Ctrl'
      if (k === 'cmd' || k === 'meta' || k === 'command') return '⌘ Cmd'
      if (k === 'win' || k === 'windows') return '⊞ Win'
      if (k === 'alt' || k === 'option') return os === 'mac' ? '⌥ Option' : 'Alt'
      if (k === 'shift') return 'Shift'
      if (k === 'enter' || k === 'return') return 'Enter'
      if (k === 'esc' || k === 'escape') return 'Esc'
      if (k === 'tab') return 'Tab'
      if (k === 'space') return 'Space'
      if (k === 'backspace') return 'Backspace'
      if (k === 'del' || k === 'delete') return 'Delete'
      if (k in ARROW) return ARROW[k]
      return k.length === 1 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1)
    })
}
function KeysScene({ keys, os, reduced, paused }: { keys: string; os: OsFlavor; reduced: boolean; paused: boolean }) {
  const labels = keyLabels(keys, os)
  const kfs = useMemo<Record<string, KF>>(() => {
    const out: Record<string, KF> = {}
    labels.forEach((_, i) => {
      const a = 14 + i * 14
      out[`k${i}`] = [[0, 'transform:translateY(0);background:#fff;color:#1e1b3a;box-shadow:0 5px 0 #b9b3d6'], [a, 'transform:translateY(0);background:#fff;color:#1e1b3a;box-shadow:0 5px 0 #b9b3d6'], [a + 3, 'transform:translateY(4px);background:#e8505b;color:#fff;box-shadow:0 1px 0 #b3303b'], [100, 'transform:translateY(4px);background:#e8505b;color:#fff;box-shadow:0 1px 0 #b3303b']]
    })
    const t = 14 + labels.length * 14
    out.ok = [[0, 'opacity:0;transform:scale(.6)'], [t, 'opacity:0;transform:scale(.6)'], [t + 4, 'opacity:1;transform:scale(1)'], [100, 'opacity:1;transform:scale(1)']]
    return out
  }, [labels.length])
  const { css, sty } = useTimeline(kfs, reduced, paused)
  return (
    <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#f5f0ff,#e9f7f4)', padding: '28px 12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <style>{css}</style>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10 }} data-keys={labels.join('+')}>
        {labels.map((l, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <span aria-hidden="true" style={{ fontSize: 24, fontWeight: 700, color: '#6b7280' }}>+</span>}
            <span
              data-keycap={l}
              style={{ display: 'inline-flex', minWidth: 64, height: 58, alignItems: 'center', justifyContent: 'center', padding: '0 16px', borderRadius: 12, border: '2px solid #c4bfe0', fontWeight: 700, fontSize: l.length > 3 ? 18 : 24, fontFamily: 'inherit', ...sty(`k${i}`) }}
            >
              {l}
            </span>
          </span>
        ))}
      </div>
      <span aria-hidden="true" style={{ fontSize: 28, color: G.ok, fontWeight: 800, ...sty('ok') }}>✓</span>
    </div>
  )
}

/* ---------------------------------------------------------------- type ---------------------------------------------------------------- */
function graphemes(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter
  return Seg ? Array.from(new Seg('bn', { granularity: 'grapheme' }).segment(s), (x) => x.segment) : Array.from(s)
}
function TypeScene({ text, reduced, paused, runKey }: { text: string; reduced: boolean; paused: boolean; runKey: number }) {
  const chars = useMemo(() => graphemes(text), [text])
  const [n, setN] = useState(reduced ? chars.length : 0)
  useEffect(() => {
    if (reduced) { setN(chars.length); return }
    setN(0)
  }, [reduced, chars.length, runKey])
  useEffect(() => {
    if (reduced || paused) return
    const t = setInterval(() => setN((c) => (c >= chars.length + 18 ? 0 : c + 1)), 90)
    return () => clearInterval(t)
  }, [reduced, paused, chars.length, runKey])
  const shown = chars.slice(0, Math.min(n, chars.length)).join('')
  return (
    <div style={{ borderRadius: 16, background: '#eef0f7', padding: 14 }}>
      <style>{'@keyframes dm-caret{0%,49%{opacity:1}50%,100%{opacity:0}}'}</style>
      <div style={{ borderRadius: 12, background: '#fff', border: '1px solid #cfd3dc', boxShadow: '0 6px 18px rgba(30,27,58,.15)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 12px', background: '#f3f3f6', fontSize: 12, color: G.muted }}>
          <span style={{ width: 10, height: 10, borderRadius: 6, background: G.sky }} /> notes.txt — Notepad
        </div>
        <div data-testid="typed" style={{ minHeight: 96, padding: '14px 16px', fontSize: 22, lineHeight: 1.6, color: G.ink, fontFamily: "'Noto Sans Bengali', 'Segoe UI', system-ui, sans-serif", wordBreak: 'break-word' }}>
          {shown}
          <span aria-hidden="true" style={{ display: 'inline-block', width: 2, height: '1.1em', marginLeft: 2, verticalAlign: 'text-bottom', background: G.coral, animation: reduced ? undefined : 'dm-caret 1s steps(1) infinite' }} />
        </div>
      </div>
      <p aria-hidden="true" style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 28 }}>⌨️</p>
    </div>
  )
}

/* ---------------------------------------------------------------- two-finger gestures ---------------------------------------------------------------- */
function TouchpadScene({ gesture, os, reduced, paused }: { gesture: 'two-finger-tap' | 'two-finger-scroll'; os: OsFlavor; reduced: boolean; paused: boolean }) {
  const kfs = useMemo<Record<string, KF>>(() => {
    const base = scrollKf(50, 100)
    return gesture === 'two-finger-scroll'
      ? {
          list: base.list, thumb: base.thumb,
          fingers: [[0, `opacity:0;${T0(0, 20)}`], [6, `opacity:1;${T0(0, 20)}`], [18, `opacity:1;${T0(0, 20)}`], [26, `opacity:1;${T0(0, -18)}`], [40, `opacity:1;${T0(0, -18)}`], [48, `opacity:1;${T0(0, -56)}`], [62, `opacity:1;${T0(0, -56)}`], [70, `opacity:1;${T0(0, -92)}`], [100, `opacity:1;${T0(0, -92)}`]],
        }
      : {
          fingers: [[0, 'opacity:0;transform:scale(.6)'], [8, 'opacity:1;transform:scale(1)'], [18, 'opacity:1;transform:scale(1)'], [21, 'opacity:1;transform:scale(.8)'], [26, 'opacity:1;transform:scale(1)'], [100, 'opacity:1;transform:scale(1)']],
          rip: [[0, 'opacity:0;transform:scale(.3)'], [20, 'opacity:0;transform:scale(.3)'], [21, 'opacity:.9;transform:scale(.4)'], [30, 'opacity:0;transform:scale(1.8)'], [100, 'opacity:0;transform:scale(1.8)']],
          menu: [[0, 'opacity:0;transform:scale(.9)'], [22, 'opacity:0;transform:scale(.9)'], [27, 'opacity:1;transform:scale(1)'], [100, 'opacity:1;transform:scale(1)']],
        } as Record<string, KF>
  }, [gesture])
  const { css, sty } = useTimeline(kfs, reduced, paused)
  const scroll = gesture === 'two-finger-scroll'
  const fy = 160
  return (
    <svg viewBox="0 0 480 300" aria-hidden="true" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 16, background: 'linear-gradient(145deg,#f5f0ff,#e9f7f4)' }}>
      <style>{css}</style>
      {/* touchpad */}
      <Rc x={18} y={86} w={186} h={138} r={16} f="#e6e3f3" s="#1e1b3a" sw={3} />
      <T x={111} y={248} s={11} a="middle" c={G.muted}>Touchpad</T>
      <g style={sty('fingers')}>
        {[0, 1].map((i) => (
          <g key={i}>
            <circle cx={84 + i * 54} cy={fy} r={15} fill="#f2c4a0" stroke="#d9a07a" strokeWidth={3} />
          </g>
        ))}
      </g>
      {!scroll && [0, 1].map((i) => <Ripple key={i} at={[84 + i * 54, fy]} r={16} style={sty('rip')} />)}
      <path d="M214 155h24M230 147l8 8-8 8" stroke="#6b7280" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* screen */}
      <Rc x={252} y={46} w={216} h={178} r={10} f="#1e1b3a" />
      <Rc x={258} y={52} w={204} h={166} r={6} f="#fff" />
      <rect x={236} y={228} width={248} height={8} rx={4} fill="#9ca3c0" />
      {scroll ? (
        <g>
          <ScrollList x={266} y={62} w={176} h={146} offset="0" style={sty('list')} rowH={26} fs={10.5} />
          <rect x={448} y={64} width={6} height={142} rx={3} fill="#dfe3ee" />
          <rect x={448} y={64} width={6} height={50} rx={3} fill="#9ca3c0" style={sty('thumb')} />
        </g>
      ) : (
        <g>
          <FolderIcon x={282} y={78} s={1.1} /><T x={300} y={132} s={10} a="middle">Photos</T>
          <DocIcon x={372} y={74} s={1.3} /><T x={388} y={132} s={10} a="middle">notes.txt</T>
          <MiniMenu at={[300, 90]} os={os} style={sty('menu')} />
        </g>
      )}
      {reduced && (scroll ? <g data-static-arrow fill="none" stroke="#e8505b" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"><path d="M111 130v-34M103 104l8-8 8 8" /></g> : <ArrowTo from={[200, 120]} to={[300, 100]} />)}
    </svg>
  )
}

/* ---------------------------------------------------------------- DemoView ---------------------------------------------------------------- */
const btn = 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-xl text-ink'

/** Looping 3–4 s animated-cursor demos. Under prefers-reduced-motion: a static final frame with arrows (no controls). */
export function DemoView({ visual }: { visual: DemoVisual }) {
  const reduced = useReducedMotion()
  const [runKey, setRunKey] = useState(0)
  const [paused, setPaused] = useState(false)
  const os: OsFlavor = visual.os ?? 'windows'
  const g = visual.gesture
  const mock = visual.mock ?? defaultMock(os)
  let scene: ReactNode
  if (g === 'click' || g === 'double-click' || g === 'right-click' || g === 'drag') {
    const M = MOCKS[mock]
    scene = (
      <div style={{ position: 'relative' }}>
        <M os={os} />
        <PointerScene key={runKey} gesture={g} mock={mock} os={os} reduced={reduced} paused={paused} />
      </div>
    )
  } else if (g === 'scroll') scene = <ScrollScene key={runKey} reduced={reduced} paused={paused} />
  else if (g === 'keys') scene = <KeysScene key={runKey} keys={visual.keys ?? 'mod+c'} os={os} reduced={reduced} paused={paused} />
  else if (g === 'type') scene = <TypeScene text={visual.textBn ?? 'আমার প্রথম লেখা'} reduced={reduced} paused={paused} runKey={runKey} />
  else scene = <TouchpadScene key={runKey} gesture={g} os={os} reduced={reduced} paused={paused} />
  const label = `${GESTURE_BN[g]}: অ্যানিমেশনে দেখানো হচ্ছে${visual.keys && g === 'keys' ? ` (${keyLabels(visual.keys, os).join(' + ')})` : ''}`
  return (
    <figure className="mx-auto flex w-full max-w-[560px] flex-col gap-2" data-gesture={g} data-static={reduced ? 'true' : undefined}>
      <div role="img" aria-label={label}>{scene}</div>
      {!reduced && (
        <div className="flex items-center justify-center gap-3">
          <button type="button" className={btn} aria-label="আবার দেখুন" title="আবার দেখুন" onClick={() => { setRunKey((k) => k + 1); setPaused(false) }}>↻</button>
          <button type="button" className={btn} aria-label={paused ? 'চালান' : 'থামান'} title={paused ? 'চালান' : 'থামান'} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>{paused ? '▶' : '⏸'}</button>
        </div>
      )}
      {visual.captionBn && <figcaption className="text-center text-muted">{visual.captionBn}</figcaption>}
    </figure>
  )
}

