import type { FC, ReactNode } from 'react'
import { ART as C } from '../../palette'
import type { ArtComponent } from '../../types'

export { C }

/** Builds an art component: 200×200 viewBox, ink outline defaults inherited by every child. */
export const make =
  (label: string, Draw: FC): ArtComponent =>
  ({ size = 160, className, title }) => (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title ?? label}
      fill="none"
      stroke={C.ink}
      strokeWidth={3}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <Draw />
    </svg>
  )

/** A stroked path with an ink outline (thick line look). */
export const Thick = ({ d, color, w = 10 }: { d: string; color: string; w?: number }) => (
  <g>
    <path d={d} stroke={C.ink} strokeWidth={w + 6} />
    <path d={d} stroke={color} strokeWidth={w} />
  </g>
)

/** A filled shape with rounded corners (fat stroke in the fill colour) and a 3px ink outline. */
export const Rd = ({ d, fill, w = 12 }: { d: string; fill: string; w?: number }) => (
  <g>
    <path d={d} fill={C.ink} stroke={C.ink} strokeWidth={w + 6} />
    <path d={d} fill={fill} stroke={fill} strokeWidth={w} />
  </g>
)

/** Union of simple shapes drawn as one outlined blob. */
export const Union = ({ fill, children }: { fill: string; children: ReactNode }) => (
  <g>
    <g stroke={C.ink} strokeWidth={6} fill={fill}>{children}</g>
    <g stroke="none" fill={fill}>{children}</g>
  </g>
)

export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos((deg * Math.PI) / 180),
  cy + r * Math.sin((deg * Math.PI) / 180),
]

/** A 4-point sparkle. */
export const sparklePath = (cx: number, cy: number, r: number) => {
  const k = r * 0.2
  return `M${cx} ${cy - r} Q${cx + k} ${cy - k} ${cx + r} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + r} Q${cx - k} ${cy + k} ${cx - r} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`
}
export const Sparkle = ({ x, y, r, fill = C.sun, sw = 2.5 }: { x: number; y: number; r: number; fill?: string; sw?: number }) => (
  <path d={sparklePath(x, y, r)} fill={fill} strokeWidth={sw} />
)

export const Gear = ({ x, y, r, fill = C.sun }: { x: number; y: number; r: number; fill?: string }) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={x - r * 0.2} y={y - r * 1.3} width={r * 0.4} height={r * 0.7} rx={r * 0.1} fill={fill} transform={`rotate(${i * 45} ${x} ${y})`} />
    ))}
    <circle cx={x} cy={y} r={r} fill={fill} />
    <circle cx={x} cy={y} r={r * 0.4} fill={C.paper} />
  </g>
)

/** Polygon points for an n-point star. */
export const starPath = (cx: number, cy: number, R: number, r: number, n = 5) => {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const [x, y] = polar(cx, cy, i % 2 ? r : R, -90 + (i * 180) / n)
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return `M${pts.join(' L')}Z`
}
