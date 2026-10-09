import { C, Rc, Pa, Ci, Ln, Ol, Hl, mk, arcPath, pt, bubble } from './kit'

const gearPath = (cx: number, cy: number, rOut: number, rIn: number, n: number) => {
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n
    const s = 360 / n
    for (const [r, d] of [[rIn, -s * 0.5], [rIn, -s * 0.2], [rOut, -s * 0.14], [rOut, s * 0.14], [rIn, s * 0.2]] as const) {
      const [x, y] = pt(cx, cy, r, a + d)
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
    }
  }
  return `M${pts.join(' L')} Z`
}

export const gear = mk('সেটিংস', <>
  <Pa d={gearPath(100, 100, 78, 58, 8)} fill={C.violet} />
  <Ci cx={100} cy={100} r={26} fill={C.violetPale} />
  <Ci cx={100} cy={100} r={9} fill={C.violetSoft} strokeWidth={2.5} />
  <Hl d={arcPath(100, 100, 44, 200, 250)} w={5} />
</>)

export const sun = mk('উজ্জ্বলতা', <>
  {Array.from({ length: 8 }, (_, i) => {
    const [x1, y1] = pt(100, 100, 58, i * 45)
    const [x2, y2] = pt(100, 100, 76, i * 45)
    return <Ol key={i} d={`M${x1} ${y1} L${x2} ${y2}`} color={C.sun} w={8} />
  })}
  <Ci cx={100} cy={100} r={42} fill={C.sun} />
  <Hl d={arcPath(100, 100, 30, 200, 260)} w={6} />
</>)

const sparkle = (x: number, y: number, r: number, k: string) => (
  <Pa key={k} d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`} fill={C.sun} strokeWidth={2.5} />
)

export const moon = mk('রাত', <>
  <Pa d="M120 24 A78 78 0 1 0 176 124 A62 62 0 0 1 120 24 Z" fill={C.violetSoft} />
  <Ci cx={70} cy={112} r={9} fill={C.violet} strokeWidth={2.5} />
  <Ci cx={96} cy={146} r={6} fill={C.violet} strokeWidth={2.5} />
  <Hl d="M52 80 A56 56 0 0 1 82 50" w={5} />
  {sparkle(150, 64, 14, 'a')}
  {sparkle(168, 98, 8, 'b')}
</>)

export const volume = mk('ভলিউম', <>
  <Pa d="M26 84 H58 L98 50 V150 L58 116 H26 Z" fill={C.violet} />
  <Hl d="M36 94 H54" />
  <Ol d="M122 78 A34 34 0 0 1 122 122" color={C.teal} w={9} />
  <Ol d="M138 56 A62 62 0 0 1 138 144" color={C.coral} w={9} />
</>)

export const bluetooth = mk('ব্লুটুথ', <>
  <Ol d={arcPath(36, 100, 38, -30, 30)} color={C.violetSoft} w={6} />
  <Ol d={arcPath(36, 100, 52, -30, 30)} color={C.violetSoft} w={6} />
  <Ol d={arcPath(164, 100, 38, 150, 210)} color={C.tealSoft} w={6} />
  <Ol d={arcPath(164, 100, 52, 150, 210)} color={C.tealSoft} w={6} />
  <Ci cx={36} cy={100} r={20} fill={C.violet} />
  <Ci cx={164} cy={100} r={20} fill={C.teal} />
  <Ci cx={36} cy={100} r={7} fill="#fff" strokeWidth={2.5} />
  <Ci cx={164} cy={100} r={7} fill="#fff" strokeWidth={2.5} />
  <Ci cx={100} cy={100} r={8} fill={C.sun} strokeWidth={2.5} />
</>)

export const clock = mk('ঘড়ি', <>
  <Ci cx={50} cy={40} r={20} fill={C.coral} />
  <Ci cx={150} cy={40} r={20} fill={C.coral} />
  <Ln x1={58} y1={168} x2={46} y2={184} />
  <Ln x1={142} y1={168} x2={154} y2={184} />
  <Ci cx={100} cy={106} r={70} fill={C.violet} />
  <Ci cx={100} cy={106} r={56} fill="#fff" />
  {Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = pt(100, 106, 46, i * 30)
    const [x2, y2] = pt(100, 106, 52, i * 30)
    return <Ln key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 4 : 2.5} />
  })}
  <Ln x1={100} y1={106} x2={100} y2={68} strokeWidth={5} />
  <Ln x1={100} y1={106} x2={128} y2={90} strokeWidth={5} stroke={C.coral} />
  <Ci cx={100} cy={106} r={6} fill={C.sun} strokeWidth={2.5} />
</>)

export const calendar = mk('ক্যালেন্ডার', <>
  <Rc x={22} y={34} width={156} height={142} rx={18} fill="#fff" />
  <Pa d="M22 84 V52 a18 18 0 0 1 18 -18 H160 a18 18 0 0 1 18 18 V84 Z" fill={C.coral} />
  <Rc x={58} y={22} width={12} height={26} rx={6} fill={C.greyPale} />
  <Rc x={130} y={22} width={12} height={26} rx={6} fill={C.greyPale} />
  {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => {
    const hi = r === 1 && c === 2
    return <Rc key={`${r}${c}`} x={38 + c * 32} y={98 + r * 24} width={22} height={16} rx={5} fill={hi ? C.violet : C.violetPale} strokeWidth={2.5} />
  }))}
</>)

export const language = mk('ভাষা', <>
  <Pa d={bubble(16, 26, 104, 82, 24, 'l')} fill={C.violet} />
  <text x={68} y={88} textAnchor="middle" fontSize={56} fontWeight={700} fill="#fff" fontFamily="'Noto Sans Bengali','Hind Siliguri',sans-serif">অ</text>
  <Pa d={bubble(82, 88, 102, 76, 24, 'r')} fill={C.teal} />
  <text x={133} y={148} textAnchor="middle" fontSize={52} fontWeight={700} fill="#fff" fontFamily="'Nunito','Inter',Arial,sans-serif">A</text>
</>)

export const paintPalette = mk('রঙের প্যালেট', <>
  <Pa d="M100 22 C42 22 18 68 26 108 C34 154 78 178 112 174 C136 171 130 150 146 144 C164 138 182 146 184 112 C186 62 150 22 100 22 Z" fill={C.sunPale} />
  <Ci cx={64} cy={84} r={13} fill={C.coral} strokeWidth={2.5} />
  <Ci cx={104} cy={56} r={13} fill={C.violet} strokeWidth={2.5} />
  <Ci cx={146} cy={78} r={13} fill={C.teal} strokeWidth={2.5} />
  <Ci cx={52} cy={126} r={12} fill={C.sun} strokeWidth={2.5} />
  <Ci cx={98} cy={138} r={11} fill={C.paper} strokeWidth={2.5} />
</>)

export const textSize = mk('লেখার আকার', <>
  <Ol d="M26 160 L72 42 L118 160" color={C.violet} w={16} />
  <Ol d="M44 120 H100" color={C.violet} w={14} />
  <Ol d="M150 112 A18 18 0 1 0 150 148 A18 18 0 1 0 150 112" color={C.coral} w={9} />
  <Ol d="M168 106 V160" color={C.coral} w={9} />
</>)

export const SETTINGS = { gear, sun, moon, volume, bluetooth, clock, calendar, language, 'paint-palette': paintPalette, 'text-size': textSize }
