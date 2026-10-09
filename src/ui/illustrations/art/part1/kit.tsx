import type { ReactNode, SVGProps } from 'react'
import { ART } from '../../palette'
import type { ArtComponent } from '../../types'

export const C = ART
/** shared ink-outline attributes */
export const o = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

export const Rc = (p: SVGProps<SVGRectElement>) => <rect {...o} {...p} />
export const Pa = (p: SVGProps<SVGPathElement>) => <path {...o} {...p} />
export const Ci = (p: SVGProps<SVGCircleElement>) => <circle {...o} {...p} />
export const El = (p: SVGProps<SVGEllipseElement>) => <ellipse {...o} {...p} />
export const Ln = (p: SVGProps<SVGLineElement>) => <line {...o} {...p} />
export const Pg = (p: SVGProps<SVGPolygonElement>) => <polygon {...o} {...p} />

/** thick stroke path with an ink outline around it */
export const Ol = ({ d, color, w = 10, cap = 'round' }: { d: string; color: string; w?: number; cap?: 'round' | 'butt' }) => (
  <g fill="none" strokeLinejoin="round" strokeLinecap={cap}>
    <path d={d} stroke={C.ink} strokeWidth={w + 6} />
    <path d={d} stroke={color} strokeWidth={w} />
  </g>
)

/** small white highlight stroke */
export const Hl = ({ d, w = 4 }: { d: string; w?: number }) => (
  <path d={d} fill="none" stroke="#fff" strokeOpacity={0.75} strokeWidth={w} strokeLinecap="round" />
)

export const rad = (d: number) => (d * Math.PI) / 180
export const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))]
export const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = pt(cx, cy, r, a0)
  const [x1, y1] = pt(cx, cy, r, a1)
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

/** speech bubble outline path with a tail on the bottom-left or bottom-right */
export const bubble = (x: number, y: number, w: number, h: number, r: number, tail: 'l' | 'r') => {
  const t =
    tail === 'l'
      ? `H${x + 46} L${x + 16} ${y + h + 24} L${x + 22} ${y + h} H${x + r}`
      : `H${x + w - 22} L${x + w - 16} ${y + h + 24} L${x + w - 46} ${y + h} H${x + r}`
  return `M${x + r} ${y} H${x + w - r} a${r} ${r} 0 0 1 ${r} ${r} V${y + h - r} a${r} ${r} 0 0 1 -${r} ${r} ${t} a${r} ${r} 0 0 1 -${r} -${r} V${y + r} a${r} ${r} 0 0 1 ${r} -${r} Z`
}

export const mk =
  (label: string, body: ReactNode): ArtComponent =>
  ({ size = 160, className, title }) => (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label={title ?? label}>
      {body}
    </svg>
  )
