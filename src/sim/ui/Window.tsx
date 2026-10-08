import { useRef, type PointerEvent as RPointerEvent } from 'react'
import { useDesktop } from '../DesktopContext'
import { getApp } from '../apps/registry'
import type { WinState } from '../windowManager'
import { MIN_H, MIN_W } from '../windowManager'

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const EDGES: Edge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const CURSOR: Record<Edge, string> = { n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize', ne: 'nesw-resize', sw: 'nesw-resize', nw: 'nwse-resize', se: 'nwse-resize' }

function edgeStyle(e: Edge): React.CSSProperties {
  const t = 6
  const c = 14
  const s: React.CSSProperties = { position: 'absolute', cursor: CURSOR[e], touchAction: 'none', zIndex: 5 }
  if (e.includes('n')) Object.assign(s, { top: -t / 2, height: e.length === 2 ? c : t })
  if (e.includes('s')) Object.assign(s, { bottom: -t / 2, height: e.length === 2 ? c : t })
  if (e.includes('w')) Object.assign(s, { left: -t / 2, width: e.length === 2 ? c : t })
  if (e.includes('e')) Object.assign(s, { right: -t / 2, width: e.length === 2 ? c : t })
  if (e === 'n' || e === 's') Object.assign(s, { left: c, right: c })
  if (e === 'e' || e === 'w') Object.assign(s, { top: c, bottom: c })
  return s
}

export function Window({ win }: { win: WinState }) {
  const d = useDesktop()
  const def = getApp(win.app)
  const active = d.active?.id === win.id
  const mac = d.os === 'mac'
  const drag = useRef<{ x: number; y: number; wx: number; wy: number; moved: number } | null>(null)
  if (!def) return null
  const Content = def.component
  const cid = `win-${win.app}`

  const onTitleDown = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    if (e.button !== 0) return
    d.wmDispatch({ type: 'focus', id: win.id })
    if (win.maximized) return
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y, moved: 0 }
  }
  const onTitleMove = (e: RPointerEvent<HTMLDivElement>) => {
    const s = drag.current
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    s.moved = Math.max(s.moved, Math.hypot(dx, dy))
    d.wmDispatch({ type: 'move', id: win.id, x: s.wx + dx, y: s.wy + dy })
  }
  const onTitleUp = () => {
    const s = drag.current
    drag.current = null
    if (s && s.moved >= 20) d.emit({ type: 'drag', target: `${cid}-titlebar`, dropTarget: 'desktop' })
  }

  const startResize = (edge: Edge) => (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    d.wmDispatch({ type: 'focus', id: win.id })
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    const s = { x: e.clientX, y: e.clientY, r: { x: win.x, y: win.y, w: win.w, h: win.h }, moved: 0 }
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - s.x
      const dy = ev.clientY - s.y
      s.moved = Math.max(s.moved, Math.hypot(dx, dy))
      let { x, y, w, h } = s.r
      if (edge.includes('e')) w = s.r.w + dx
      if (edge.includes('s')) h = s.r.h + dy
      if (edge.includes('w')) {
        w = s.r.w - dx
        x = s.r.x + dx
      }
      if (edge.includes('n')) {
        h = s.r.h - dy
        y = Math.max(d.wm.bounds.top, s.r.y + dy)
      }
      if (w < MIN_W) {
        if (edge.includes('w')) x -= MIN_W - w
        w = MIN_W
      }
      if (h < MIN_H) {
        if (edge.includes('n')) y -= MIN_H - h
        h = MIN_H
      }
      d.wmDispatch({ type: 'resize', id: win.id, x, y, w, h })
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      if (s.moved >= 12) d.emit({ type: 'drag', target: `${cid}-resize-${edge}`, dropTarget: 'desktop' })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
  }

  const btnCls = 'flex items-center justify-center'
  const AppIcon = def.icon

  const winButtons = (
    <div className="flex h-full">
      <button aria-label="Minimize" data-coach={`${cid}-minimize`} className={`${btnCls} w-12 hover:bg-black/10`} onClick={() => d.wmDispatch({ type: 'minimize', id: win.id })}>
        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 6h10" stroke="currentColor" strokeWidth="1.2" /></svg>
      </button>
      <button aria-label={win.maximized ? 'Restore' : 'Maximize'} data-coach={`${cid}-maximize`} className={`${btnCls} w-12 hover:bg-black/10`} onClick={() => d.wmDispatch({ type: 'toggleMaximize', id: win.id })}>
        {win.maximized ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1.5" y="3.5" width="7" height="7" /><path d="M3.5 3.5v-2h7v7h-2" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1.5" y="1.5" width="9" height="9" /></svg>
        )}
      </button>
      <button aria-label="Close" data-coach={`${cid}-close`} className={`${btnCls} w-12 hover:bg-red-600 hover:text-white`} onClick={() => d.closeWindow(win.id)}>
        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.2" /></svg>
      </button>
    </div>
  )

  const trafficLights = (
    <div className="flex items-center gap-2 pl-3.5">
      {[
        { k: 'close', c: '#ff5f57', glyph: '✕', on: () => d.closeWindow(win.id), label: 'Close' },
        { k: 'minimize', c: '#febc2e', glyph: '–', on: () => d.wmDispatch({ type: 'minimize', id: win.id }), label: 'Minimize' },
        { k: 'maximize', c: '#28c840', glyph: '+', on: () => d.wmDispatch({ type: 'toggleMaximize', id: win.id }), label: 'Zoom' },
      ].map((b) => (
        <button
          key={b.k}
          aria-label={b.label}
          data-coach={`${cid}-${b.k}`}
          onClick={b.on}
          className="group flex h-4 w-4 items-center justify-center rounded-full border border-black/10 text-[9px] leading-none font-bold text-black/60"
          style={{ background: active ? b.c : '#cfcfcf' }}
        >
          <span className="opacity-0 group-hover:opacity-100">{b.glyph}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div
      data-coach={cid}
      role="dialog"
      aria-label={win.title}
      className={`absolute flex flex-col overflow-visible ${mac ? 'rounded-xl' : 'rounded-lg'} ${active ? 'shadow-[0_12px_40px_rgba(0,0,0,.35)]' : 'shadow-[0_4px_16px_rgba(0,0,0,.22)]'} border ${active ? 'border-black/30' : 'border-black/15'} bg-white text-gray-900`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z, display: win.minimized ? 'none' : 'flex', borderRadius: win.maximized ? 0 : undefined }}
      onPointerDownCapture={() => {
        if (!active) d.wmDispatch({ type: 'focus', id: win.id })
      }}
    >
      <div
        data-coach={`${cid}-titlebar`}
        className={`flex shrink-0 cursor-default items-center select-none ${mac ? `h-10 rounded-t-xl ${active ? 'bg-[#ececec]' : 'bg-[#f6f6f6] text-gray-500'} border-b border-black/10` : `h-10 rounded-t-lg ${active ? 'bg-[#e8eef7]' : 'bg-[#f3f3f3] text-gray-500'}`}`}
        style={{ touchAction: 'none', borderRadius: win.maximized ? 0 : undefined }}
        onPointerDown={onTitleDown}
        onPointerMove={onTitleMove}
        onPointerUp={onTitleUp}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) d.wmDispatch({ type: 'toggleMaximize', id: win.id })
        }}
      >
        {mac ? (
          <>
            {trafficLights}
            <div className="pointer-events-none flex-1 truncate px-3 text-center text-sm font-medium">{win.title}</div>
            <div className="w-16" />
          </>
        ) : (
          <>
            <div className="pointer-events-none flex flex-1 items-center gap-2 truncate pl-3 text-sm">
              <AppIcon size={18} />
              <span className="truncate">{win.title}</span>
            </div>
            {winButtons}
          </>
        )}
      </div>
      <div
        data-coach={`${cid}-content`}
        data-zoom={d.sim.zoom !== 100 ? d.sim.zoom : undefined}
        data-dark={d.sim.darkMode ? 'true' : undefined}
        className="relative min-h-0 flex-1 overflow-hidden bg-white"
        style={{
          borderRadius: win.maximized ? 0 : mac ? '0 0 12px 12px' : '0 0 8px 8px',
          // Settings → display scale / text size: enlarges the content of every window (text, icons, buttons). 100 = untouched.
          ...(d.sim.zoom !== 100 ? { zoom: d.sim.zoom / 100 } : null),
          // Settings → dark mode: a simple inverted look for window contents (windows themselves stay a light "paper").
          ...(d.sim.darkMode ? { filter: 'invert(0.92) hue-rotate(180deg)' } : null),
        }}
      >
        <Content win={win} />
      </div>
      {!win.maximized && EDGES.map((e) => <div key={e} data-coach={`${cid}-resize-${e}`} style={edgeStyle(e)} onPointerDown={startResize(e)} />)}
    </div>
  )
}
