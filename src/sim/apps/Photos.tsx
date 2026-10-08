/** Photos: shows image files as generated, deterministic SVG scenes (sky, hills, flower). No real pictures are used. */
import { useState } from 'react'
import { useDesktop, useWindowCombos } from '../DesktopContext'
import type { VNode } from '../vfs'
import type { WinState } from '../windowManager'
import { attached, findNode } from './util'

function hash(s: string): number {
  let h = 2166136261
  for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619) >>> 0
  return h >>> 0
}

export function PhotoScene({ seed, className }: { seed: string; className?: string }) {
  const h = hash(seed.normalize('NFC'))
  const skyHue = h % 360
  const hillHue = (skyHue + 90 + ((h >> 8) % 60)) % 360
  const petal = (skyHue + 180 + ((h >> 12) % 120)) % 360
  const sunX = 60 + ((h >> 4) % 280)
  const flowers = 1 + ((h >> 16) % 3)
  const id = `p${h.toString(36)}`
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={`Picture ${seed}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${skyHue} 70% 62%)`} />
          <stop offset="1" stopColor={`hsl(${skyHue} 80% 88%)`} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}s)`} />
      <circle cx={sunX} cy="70" r="26" fill="hsl(48 95% 62%)" />
      <path d={`M0 200 Q 90 ${140 + (h % 30)} 200 190 T 400 175 L400 300 L0 300 Z`} fill={`hsl(${hillHue} 40% 52%)`} />
      <path d={`M0 240 Q 120 ${190 + ((h >> 3) % 25)} 240 235 T 400 220 L400 300 L0 300 Z`} fill={`hsl(${hillHue} 45% 38%)`} />
      {Array.from({ length: flowers }, (_, i) => {
        const x = 90 + i * 100 + ((h >> (i * 3)) % 40)
        const y = 215 + ((h >> (i * 5)) % 25)
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0 0 L0 60" stroke="hsl(120 50% 25%)" strokeWidth="4" />
            <path d="M0 40 q-18 -6 -22 -20 q18 0 22 20" fill="hsl(120 50% 35%)" />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-14" rx="9" ry="15" fill={`hsl(${petal} 80% 65%)`} transform={`rotate(${a})`} />
            ))}
            <circle r="8" fill="hsl(45 95% 55%)" />
          </g>
        )
      })}
    </svg>
  )
}

export function Photos({ win }: { win: WinState }) {
  const d = useDesktop()
  const { vfs } = d
  const nodeIdProp = typeof win.props?.nodeId === 'string' ? win.props.nodeId : undefined
  const propN = win.props?._n
  const propKey = `${nodeIdProp ?? ''}|${propN ?? 0}`
  // the learner's own navigation inside the window; reset whenever the window is re-opened with new props
  const [nav, setNav] = useState<{ key: string; id: string | undefined; zoom: number } | null>(null)
  const own = nav && nav.key === propKey ? nav : null
  const currentId = own ? own.id : nodeIdProp
  const zoom = own ? own.zoom : 100
  const setCurrentId = (id: string | undefined) => setNav({ key: propKey, id, zoom: 100 })
  const setZoom = (fn: (z: number) => number) => setNav({ key: propKey, id: currentId, zoom: fn(zoom) })

  const found = currentId ? findNode(vfs.root, currentId) : null
  const current = found && found.kind === 'file' && attached(found, vfs.root) ? found : null
  const folder: VNode | null = current?.parent ?? (vfs.child(vfs.home, 'Pictures') ?? null)
  const images = folder ? vfs.list(folder).filter((n) => n.kind === 'file' && n.media === 'image') : []
  const idx = current ? images.indexOf(current) : -1
  const show = (n: VNode | undefined) => {
    if (!n) return
    setCurrentId(n.id)
    d.emit({ type: 'custom', event: 'photo-viewed' })
  }
  const prev = () => show(images[(idx - 1 + images.length) % images.length])
  const next = () => show(images[(idx + 1) % images.length])

  useWindowCombos(win.id, (c) => {
    if (!current) return false
    if (c === 'left') return (prev(), true)
    if (c === 'right') return (next(), true)
    if (c === '+' || c === 'ctrl+=' || c === 'cmd+=' || c === 'ctrl++') return (setZoom((z) => Math.min(300, z + 25)), true)
    if (c === '-' || c === 'ctrl+-' || c === 'cmd+-') return (setZoom((z) => Math.max(25, z - 25)), true)
    return false
  })

  const btn = 'flex min-h-9 min-w-9 items-center justify-center rounded px-2 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent'

  if (!current) {
    return (
      <div className="flex h-full flex-col text-sm text-gray-900" data-coach="photos-gallery">
        <div className="shrink-0 border-b border-gray-200 bg-[#f3f3f3] px-3 py-2 font-medium">{folder ? folder.name : 'Pictures'}</div>
        {images.length === 0 ? (
          <div className="p-6 text-center text-gray-500">There are no pictures here yet.</div>
        ) : (
          <div className="flex flex-1 flex-wrap content-start gap-3 overflow-auto p-3">
            {images.map((n) => (
              <button key={n.id} type="button" data-coach={`photos-thumb-${n.name}`} onClick={() => show(n)} className="flex w-36 flex-col gap-1 rounded p-1 text-left hover:bg-sky-50">
                <PhotoScene seed={n.name} className="h-24 w-full rounded" />
                <span className="truncate text-xs">{n.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-neutral-900 text-sm text-white">
      <div className="flex shrink-0 items-center gap-1 bg-neutral-800 px-2 py-1">
        <button type="button" data-coach="photos-gallery-back" aria-label="Back to all photos" onClick={() => setCurrentId(undefined)} className={btn}>
          All photos
        </button>
        <div className="min-w-0 flex-1 truncate px-2 text-center" data-coach="photos-name">
          {current.name}
        </div>
        <button type="button" aria-label="Zoom out" data-coach="photos-zoom-out" disabled={zoom <= 25} onClick={() => setZoom((z) => Math.max(25, z - 25))} className={btn}>
          −
        </button>
        <span className="w-12 text-center text-xs" data-coach="photos-zoom">
          {zoom}%
        </span>
        <button type="button" aria-label="Zoom in" data-coach="photos-zoom-in" disabled={zoom >= 300} onClick={() => setZoom((z) => Math.min(300, z + 25))} className={btn}>
          +
        </button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-auto" data-coach="photos-view">
        <div className="flex min-h-full min-w-full items-center justify-center p-3">
          <div style={{ width: `${zoom}%`, maxWidth: zoom <= 100 ? 560 : undefined }} className="shrink-0">
            <PhotoScene seed={current.name} className="block h-auto w-full rounded shadow-lg" />
          </div>
        </div>
        <button type="button" aria-label="Previous picture" data-coach="photos-prev" disabled={images.length < 2} onClick={prev} className="absolute top-1/2 left-2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl hover:bg-black/70 disabled:opacity-30">
          ‹
        </button>
        <button type="button" aria-label="Next picture" data-coach="photos-next" disabled={images.length < 2} onClick={next} className="absolute top-1/2 right-2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl hover:bg-black/70 disabled:opacity-30">
          ›
        </button>
      </div>
      <div className="shrink-0 bg-neutral-800 px-3 py-1 text-xs text-gray-300">
        {idx + 1} of {images.length}
      </div>
    </div>
  )
}
