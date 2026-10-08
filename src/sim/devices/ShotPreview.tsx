import type { ShotData } from './screenshots'

/** A simple drawing of what a simulated screenshot "captured": the wallpaper, the open windows and the taskbar / menu bar. Not real pixels. */
export function ShotPreview({ shot, className }: { shot: ShotData; className?: string }) {
  const a = shot.area ?? { x: 0, y: 0, w: shot.w, h: shot.h }
  const mac = shot.os === 'mac'
  const barH = mac ? 28 : 48
  return (
    <svg viewBox={`${a.x} ${a.y} ${a.w} ${a.h}`} className={className} role="img" aria-label={shot.area ? 'Screenshot of part of the screen' : 'Screenshot of the whole screen'} preserveAspectRatio="xMidYMid meet" data-testid="shot-preview">
      <defs>
        <linearGradient id="shotbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8fd6" />
          <stop offset="1" stopColor="#7cc4a4" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={shot.w} height={shot.h} fill="url(#shotbg)" />
      {mac ? <rect x="0" y="0" width={shot.w} height={barH} fill="#ffffffaa" /> : <rect x="0" y={shot.h - barH} width={shot.w} height={barH} fill="#1f2937dd" />}
      {shot.wins.map((w, i) => (
        <g key={i}>
          <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="6" fill="#ffffff" stroke="#00000033" />
          <rect x={w.x} y={w.y} width={w.w} height="26" rx="6" fill="#e5e7eb" />
          <text x={w.x + 10} y={w.y + 18} fontSize="13" fill="#111827">
            {w.title.slice(0, 40)}
          </text>
          <rect x={w.x + 12} y={w.y + 42} width={w.w * 0.5} height="8" rx="4" fill="#d1d5db" />
          <rect x={w.x + 12} y={w.y + 60} width={w.w * 0.7} height="8" rx="4" fill="#e5e7eb" />
          <rect x={w.x + 12} y={w.y + 78} width={w.w * 0.4} height="8" rx="4" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}
