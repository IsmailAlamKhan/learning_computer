import { C, Rc, Pa, Ci, El, Ln, Pg, Ol, Hl, mk, arcPath, pt, bubble } from './kit'
import { powerSym } from './hardware'

const arrowHead = (cx: number, cy: number, r: number, deg: number, size: number, fill: string) => {
  const [px, py] = pt(cx, cy, r, deg)
  const t = [-Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]
  const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const tip = [px + t[0] * size, py + t[1] * size]
  const b1 = [px + n[0] * size * 0.9, py + n[1] * size * 0.9]
  const b2 = [px - n[0] * size * 0.9, py - n[1] * size * 0.9]
  return <Pg points={`${tip[0].toFixed(1)},${tip[1].toFixed(1)} ${b1[0].toFixed(1)},${b1[1].toFixed(1)} ${b2[0].toFixed(1)},${b2[1].toFixed(1)}`} fill={fill} />
}

export const bug = mk('বাগ', <>
  {[-1, 1].map((s) => (
    <g key={s}>
      <Ln x1={100 + s * 40} y1={96} x2={100 + s * 74} y2={78} />
      <Ln x1={100 + s * 46} y1={118} x2={100 + s * 82} y2={118} />
      <Ln x1={100 + s * 40} y1={140} x2={100 + s * 74} y2={160} />
      <Ln x1={100 + s * 12} y1={42} x2={100 + s * 28} y2={20} />
      <Ci cx={100 + s * 30} cy={18} r={5} fill={C.sun} strokeWidth={2.5} />
    </g>
  ))}
  <El cx={100} cy={116} rx={50} ry={58} fill={C.coral} />
  <Ln x1={100} y1={62} x2={100} y2={174} />
  <Ci cx={76} cy={102} r={8} fill={C.ink} strokeWidth={0} />
  <Ci cx={124} cy={102} r={8} fill={C.ink} strokeWidth={0} />
  <Ci cx={78} cy={140} r={7} fill={C.ink} strokeWidth={0} />
  <Ci cx={122} cy={140} r={7} fill={C.ink} strokeWidth={0} />
  <Pa d="M60 90 Q58 76 66 70" fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={4} />
  <Pa d="M72 60 a28 24 0 0 1 56 0 Z" fill={C.hair} />
  <Ci cx={88} cy={52} r={5} fill="#fff" strokeWidth={0} />
  <Ci cx={112} cy={52} r={5} fill="#fff" strokeWidth={0} />
  <Ci cx={89} cy={53} r={2} fill={C.ink} strokeWidth={0} />
  <Ci cx={113} cy={53} r={2} fill={C.ink} strokeWidth={0} />
</>)

export const wrench = mk('রেঞ্চ', <g transform="rotate(40 100 100)">
  <Rc x={86} y={84} width={28} height={92} rx={14} fill={C.grey} />
  <Ci cx={100} cy={158} r={5} fill={C.greyPale} strokeWidth={2.5} />
  <Pa d="M89 21.7 V52 H111 V21.7 A36 36 0 1 1 89 21.7 Z" fill={C.violetSoft} />
  <Hl d="M70 66 V78" w={5} />
</g>)

export const refresh = mk('রিফ্রেশ', <>
  <Ol d={arcPath(100, 100, 56, 200, 310)} color={C.teal} w={16} />
  <Ol d={arcPath(100, 100, 56, 20, 130)} color={C.coral} w={16} />
  {arrowHead(100, 100, 56, 310, 22, C.teal)}
  {arrowHead(100, 100, 56, 130, 22, C.coral)}
</>)

export const power = mk('পাওয়ার', <>
  <Ci cx={100} cy={100} r={74} fill={C.coral} />
  {powerSym(100, 106, 34, '#fff', 13)}
  <Hl d={arcPath(100, 100, 62, 200, 250)} w={5} />
</>)

export const freeze = mk('আটকে যাওয়া', <>
  <Rc x={16} y={36} width={122} height={104} rx={14} fill={C.greyPale} />
  <Pa d="M16 66 V50 a14 14 0 0 1 14 -14 H124 a14 14 0 0 1 14 14 V66 Z" fill={C.violetSoft} />
  <Ci cx={32} cy={51} r={4.5} fill={C.coral} strokeWidth={2} />
  <Ci cx={46} cy={51} r={4.5} fill={C.sun} strokeWidth={2} />
  <Ci cx={60} cy={51} r={4.5} fill={C.teal} strokeWidth={2} />
  <Rc x={30} y={82} width={60} height={9} rx={4.5} fill="#fff" strokeWidth={2.5} />
  <Rc x={30} y={100} width={44} height={9} rx={4.5} fill="#fff" strokeWidth={2.5} />
  <Ci cx={134} cy={126} r={52} fill={C.tealPale} />
  {[0, 60, 120].map((a) => {
    const [x1, y1] = pt(134, 126, 40, a)
    const [x2, y2] = pt(134, 126, 40, a + 180)
    return <Ol key={a} d={`M${x1} ${y1} L${x2} ${y2}`} color={C.teal} w={6} />
  })}
  <Ci cx={134} cy={126} r={7} fill="#fff" strokeWidth={2.5} />
</>)

export const lightbulb = mk('আইডিয়া', <>
  {[-168, -138, -42, -12].map((a) => {
    const [x1, y1] = pt(100, 82, 62, a)
    const [x2, y2] = pt(100, 82, 76, a)
    return <Ln key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.sun} strokeWidth={5} />
  })}
  <Pa d="M74 136 C62 120 50 104 50 82 A50 50 0 0 1 150 82 C150 104 138 120 126 136 Z" fill={C.sun} />
  <Pa d="M88 122 V104 Q88 94 100 94 Q112 94 112 104 V122 M100 94 V122" fill="none" stroke="#fff" strokeWidth={4} />
  <Hl d="M64 62 A38 38 0 0 1 84 42" w={6} />
  <Rc x={76} y={136} width={48} height={14} rx={5} fill={C.grey} />
  <Rc x={80} y={152} width={40} height={14} rx={6} fill={C.grey} />
  <Pa d="M90 168 H110 L104 178 H96 Z" fill={C.ink} strokeWidth={2} />
</>)

export const question = mk('প্রশ্ন', <>
  <Pa d={bubble(22, 22, 156, 124, 38, 'l')} fill={C.violet} />
  <Pa d="M78 74 A24 24 0 1 1 106 98 C98 104 98 108 98 116" fill="none" stroke="#fff" strokeWidth={14} />
  <Ci cx={98} cy={132} r={8} fill="#fff" strokeWidth={0} />
</>)

export const check = mk('ঠিক আছে', <>
  <Ci cx={100} cy={100} r={74} fill={C.teal} />
  <Pa d="M62 102 L88 128 L140 72" fill="none" stroke="#fff" strokeWidth={18} />
  <Hl d={arcPath(100, 100, 62, 200, 250)} w={5} />
</>)

export const cross = mk('ভুল', <>
  <Ci cx={100} cy={100} r={74} fill={C.coral} />
  <Pa d="M70 70 L130 130 M130 70 L70 130" fill="none" stroke="#fff" strokeWidth={18} />
  <Hl d={arcPath(100, 100, 62, 200, 250)} w={5} />
</>)

export const sos = mk('সাহায্য', <>
  <Ci cx={100} cy={100} r={74} fill="#fff" />
  {[45, 135, 225, 315].map((a) => <path key={a} d={arcPath(100, 100, 56, a - 24, a + 24)} fill="none" stroke={C.coral} strokeWidth={36} />)}
  <Ci cx={100} cy={100} r={74} fill="none" />
  <Ci cx={100} cy={100} r={38} fill="none" />
  {[0, 90, 180, 270].map((a) => {
    const [x, y] = pt(100, 100, 56, a)
    return <Rc key={a} x={x - 6} y={y - 6} width={12} height={12} rx={3} fill={C.grey} strokeWidth={2} transform={`rotate(${a} ${x} ${y})`} />
  })}
</>)

export const TROUBLE = { bug, wrench, refresh, power, freeze, lightbulb, question, check, cross, sos }
