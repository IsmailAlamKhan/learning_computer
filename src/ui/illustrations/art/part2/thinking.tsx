import type { ArtName } from '../../names'
import type { ArtComponent } from '../../types'
import { C, make, Thick, Rd, Union, Gear, Sparkle, polar } from './kit'

const CodeBrackets = make('কোড', () => (
  <g>
    <rect x="16" y="42" width="168" height="116" rx="28" fill={C.violetPale} />
    <Thick d="M76 72 L44 100 L76 128" color={C.teal} w={12} />
    <Thick d="M124 72 L156 100 L124 128" color={C.teal} w={12} />
    <Thick d="M110 66 L90 134" color={C.coral} w={12} />
  </g>
))

const Terminal = make('টার্মিনাল', () => (
  <g>
    <rect x="18" y="34" width="164" height="132" rx="18" fill={C.ink} />
    <path d="M18 62 V52 a18 18 0 0 1 18-18 H164 a18 18 0 0 1 18 18 V62Z" fill={C.violet} />
    <circle cx="36" cy="48" r="5" fill={C.coral} stroke="none" />
    <circle cx="52" cy="48" r="5" fill={C.sun} stroke="none" />
    <circle cx="68" cy="48" r="5" fill={C.tealSoft} stroke="none" />
    <path d="M38 84 L56 98 L38 112" stroke={C.tealSoft} strokeWidth="8" />
    <rect x="68" y="108" width="22" height="9" rx="3" fill={C.sun} stroke="none" />
    <path d="M70 90 H130 M38 132 H110" stroke={C.violetSoft} strokeWidth="5" opacity="0.7" />
  </g>
))

const Brain = make('মস্তিষ্ক', () => (
  <g>
    <Union fill={C.coralSoft}>
      <circle cx="66" cy="100" r="28" />
      <circle cx="94" cy="68" r="28" />
      <circle cx="132" cy="84" r="28" />
      <circle cx="74" cy="132" r="24" />
      <circle cx="122" cy="130" r="26" />
      <circle cx="100" cy="106" r="32" />
    </Union>
    <path d="M100 50 q-10 18 0 36 M60 86 q16 -4 24 8 M140 100 q-14 -2 -22 10 M72 134 q14 -8 26 0 M118 70 q8 10 4 22" stroke={C.coral} strokeWidth="3" />
    <path d="M62 78 q4 -10 14 -14" stroke={C.white} strokeWidth="5" />
    <circle cx="86" cy="104" r="4" fill={C.ink} stroke="none" />
    <circle cx="114" cy="104" r="4" fill={C.ink} stroke="none" />
    <path d="M90 116 Q100 126 110 116" />
    <Gear x={160} y={46} r={14} />
    <Sparkle x={36} y={44} r={12} fill={C.sun} />
  </g>
))

const Binary = make('বাইনারি', () => {
  const bits = [1, 0, 1, 1]
  return (
    <g>
      {bits.map((b, i) => {
        const x = 22 + i * 42
        return (
          <g key={i}>
            <text x={x + 17} y="66" textAnchor="middle" fontSize="28" fontWeight="800" fill={b ? C.teal : C.grey} stroke="none" fontFamily="system-ui, sans-serif">{b}</text>
            <rect x={x} y="78" width="34" height="76" rx="17" fill={b ? C.tealSoft : C.greyPale} />
            <circle cx={x + 17} cy={b ? 98 : 134} r="12" fill={b ? C.teal : C.white} />
          </g>
        )
      })}
      <path d="M22 172 H178" stroke={C.violetSoft} strokeWidth="5" />
    </g>
  )
})

const Robot = make('রোবট', () => (
  <g>
    <path d="M100 38 V22" />
    <circle cx="100" cy="18" r="8" fill={C.sun} />
    <rect x="62" y="142" width="76" height="34" rx="14" fill={C.violet} />
    <circle cx="100" cy="159" r="7" fill={C.sun} />
    <rect x="30" y="76" width="16" height="30" rx="8" fill={C.teal} />
    <rect x="154" y="76" width="16" height="30" rx="8" fill={C.teal} />
    <rect x="44" y="38" width="112" height="100" rx="30" fill={C.violetSoft} />
    <rect x="58" y="56" width="84" height="56" rx="22" fill={C.ink} />
    <circle cx="82" cy="82" r="11" fill={C.tealSoft} stroke="none" />
    <circle cx="118" cy="82" r="11" fill={C.tealSoft} stroke="none" />
    <circle cx="85" cy="79" r="3.5" fill={C.white} stroke="none" />
    <circle cx="121" cy="79" r="3.5" fill={C.white} stroke="none" />
    <path d="M88 100 Q100 110 112 100" stroke={C.tealSoft} />
    <circle cx="56" cy="122" r="7" fill={C.coralSoft} stroke="none" />
    <circle cx="144" cy="122" r="7" fill={C.coralSoft} stroke="none" />
    <path d="M60 50 q8-6 20-6" stroke={C.violetPale} strokeWidth="5" />
  </g>
))

const TeaCup = make('চা', () => (
  <g>
    <path d="M84 78 q-10 -12 0 -22 q10 -10 0 -22 M110 80 q-10 -12 0 -22 q10 -10 0 -22" stroke={C.grey} strokeWidth="5" />
    <Thick d="M150 102 h8 a16 16 0 0 1 0 34 h-14" color={C.white} w={8} />
    <path d="M50 96 V120 Q50 164 100 164 Q150 164 150 120 V96 Z" fill={C.white} />
    <path d="M52 124 Q60 150 100 150 Q140 150 148 124 Z" fill={C.coralPale} stroke="none" />
    <ellipse cx="100" cy="96" rx="50" ry="12" fill={C.skinDark} />
    <ellipse cx="100" cy="96" rx="40" ry="7" fill={C.sun} stroke="none" opacity="0.6" />
    <path d="M68 122 q-2 14 8 22" stroke={C.coral} strokeWidth="5" />
    <ellipse cx="100" cy="172" rx="66" ry="10" fill={C.tealSoft} />
  </g>
))

const CookingPot = make('রান্না', () => (
  <g>
    <path d="M82 52 q-8 -10 0 -18 q8 -8 0 -16 M110 52 q-8 -10 0 -18 q8 -8 0 -16" stroke={C.grey} strokeWidth="5" />
    <path d="M52 108 Q54 66 100 64 Q146 66 148 108Z" fill={C.white} />
    <path d="M78 84 l6 -2 M104 76 l7 2 M122 92 l6 -3 M92 96 l6 2 M66 100 l6 -1" stroke={C.grey} strokeWidth="3" />
    <rect x="22" y="112" width="26" height="12" rx="6" fill={C.teal} />
    <rect x="152" y="112" width="26" height="12" rx="6" fill={C.teal} />
    <rect x="38" y="104" width="124" height="52" rx="16" fill={C.teal} />
    <path d="M52 118 q2 -4 10 -4" stroke={C.tealSoft} strokeWidth="5" />
    <rect x="22" y="160" width="156" height="16" rx="8" fill={C.greyPale} />
    <path d="M70 160 q-8 -8 0 -16 q4 -6 8 0 q4 8 0 16Z" fill={C.sun} transform="translate(8 -2)" strokeWidth="2.5" />
    <path d="M118 160 q-8 -8 0 -16 q4 -6 8 0 q4 8 0 16Z" fill={C.coral} transform="translate(-2 -2)" strokeWidth="2.5" />
  </g>
))

const Book = make('বই', () => (
  <g>
    <path d="M100 66 Q66 46 20 56 V158 Q66 148 100 168 Q134 148 180 158 V56 Q134 46 100 66Z" fill={C.violet} />
    <path d="M100 58 Q68 40 28 50 V148 Q68 140 100 158Z" fill={C.white} />
    <path d="M100 58 Q132 40 172 50 V148 Q132 140 100 158Z" fill={C.violetPale} />
    <path d="M44 70 Q62 64 84 74 M44 88 Q62 82 84 92 M44 106 Q62 100 84 110" stroke={C.grey} strokeWidth="4" />
    <path d="M116 74 Q138 64 156 70 M116 92 Q138 82 156 88" stroke={C.violetSoft} strokeWidth="4" />
    <path d="M136 108 Q146 100 156 106 V128 Q146 122 136 128Z" fill={C.tealSoft} strokeWidth="2.5" />
    <path d="M86 58 V16 L100 28 L114 16 V58" fill={C.coral} transform="translate(0 6) scale(1 0.85) translate(0 6)" />
  </g>
))

const Flowchart = make('ফ্লোচার্ট', () => (
  <g>
    <rect x="62" y="16" width="76" height="28" rx="14" fill={C.teal} />
    <path d="M100 44 V58" />
    <path d="M94 55 L100 63 L106 55Z" fill={C.ink} />
    <path d="M100 64 L148 92 L100 120 L52 92Z" fill={C.sun} />
    <path d="M52 92 H34 V132" />
    <path d="M28 128 L34 138 L40 128Z" fill={C.ink} />
    <path d="M148 92 H166 V132" />
    <path d="M160 128 L166 138 L172 128Z" fill={C.ink} />
    <rect x="12" y="142" width="46" height="34" rx="10" fill={C.violetSoft} />
    <rect x="142" y="142" width="46" height="34" rx="10" fill={C.coralSoft} />
    <path d="M24 159 H46 M154 159 H176" strokeWidth="4" />
    <path d="M90 92 H110" strokeWidth="4" />
  </g>
))

const arrowHead = (cx: number, cy: number, r: number, deg: number, color: string) => {
  const [x, y] = polar(cx, cy, r, deg)
  const t = [-Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]
  const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const tip = [x + t[0] * 18, y + t[1] * 18]
  const a = [x + n[0] * 17, y + n[1] * 17]
  const b = [x - n[0] * 17, y - n[1] * 17]
  return <path d={`M${a[0]} ${a[1]} L${tip[0]} ${tip[1]} L${b[0]} ${b[1]}Z`} fill={color} />
}
const Loop = make('লুপ', () => {
  const arc = (a0: number, a1: number, color: string) => {
    const [x0, y0] = polar(100, 100, 56, a0)
    const [x1, y1] = polar(100, 100, 56, a1)
    return (
      <g>
        <Thick d={`M${x0} ${y0} A56 56 0 0 1 ${x1} ${y1}`} color={color} w={14} />
        {arrowHead(100, 100, 56, a1, color)}
      </g>
    )
  }
  return (
    <g>
      {arc(195, 305, C.teal)}
      {arc(15, 125, C.coral)}
      <rect x="72" y="80" width="56" height="40" rx="14" fill={C.white} />
      <text x="100" y="109" textAnchor="middle" fontSize="26" fontWeight="800" fill={C.violet} stroke="none" fontFamily="system-ui, sans-serif">×3</text>
    </g>
  )
})

const Branch = make('সিদ্ধান্ত', () => (
  <g>
    <Thick d="M100 176 V122 M100 122 Q100 96 70 78 L52 62 M100 122 Q100 96 130 78 L148 62" color={C.greyPale} w={20} />
    <path d="M100 168 V140" stroke={C.grey} strokeWidth="3" strokeDasharray="6 8" />
    <circle cx="48" cy="46" r="22" fill={C.teal} />
    <path d="M38 46 l7 8 l14 -16" stroke={C.white} strokeWidth="6" />
    <circle cx="152" cy="46" r="22" fill={C.coral} />
    <path d="M143 37 l18 18 M161 37 l-18 18" stroke={C.white} strokeWidth="6" />
    <circle cx="100" cy="122" r="9" fill={C.sun} />
  </g>
))

const HtmlTag = make('এইচটিএমএল', () => (
  <g>
    <rect x="22" y="26" width="132" height="120" rx="16" fill={C.white} />
    <rect x="38" y="44" width="76" height="18" rx="9" fill={C.violet} stroke="none" />
    <path d="M38 80 H130 M38 96 H118 M38 112 H100" strokeWidth="5" stroke={C.grey} />
    <rect x="100" y="108" width="80" height="62" rx="18" fill={C.coral} />
    <path d="M124 126 L112 139 L124 152 M156 126 L168 139 L156 152" stroke={C.white} strokeWidth="6" />
    <path d="M146 124 L134 154" stroke={C.white} strokeWidth="5" />
  </g>
))

const CssBrush = make('সিএসএস', () => (
  <g>
    <g transform="rotate(-6 70 100)">
      <rect x="22" y="40" width="112" height="132" rx="14" fill={C.white} />
      <path d="M36 62 q16 -12 32 0 t32 0" stroke={C.violetSoft} strokeWidth="14" />
      <path d="M36 92 q16 -12 32 0 t32 0" stroke={C.tealSoft} strokeWidth="14" />
      <path d="M36 122 q16 -12 32 0" stroke={C.coralSoft} strokeWidth="14" />
    </g>
    <g transform="rotate(40 140 80)">
      <rect x="120" y="14" width="20" height="62" rx="10" fill={C.sun} />
      <rect x="116" y="70" width="28" height="22" rx="6" fill={C.grey} />
      <path d="M118 80 H142" stroke={C.greyPale} strokeWidth="3" />
      <path d="M116 92 H144 Q146 118 130 130 Q114 118 116 92Z" fill={C.coral} />
    </g>
  </g>
))

const PythonSnake = make('সাপ', () => (
  <g>
    <Thick d="M30 156 C30 184 152 184 152 146 C152 106 54 122 54 86 C54 60 100 54 130 62" color={C.teal} w={26} />
    <Thick d="M46 156 C60 164 118 166 134 150" color={C.tealSoft} w={6} />
    <circle cx="70" cy="170" r="5" fill={C.sun} stroke="none" />
    <circle cx="116" cy="172" r="5" fill={C.sun} stroke="none" />
    <circle cx="148" cy="130" r="5" fill={C.sun} stroke="none" />
    <circle cx="96" cy="110" r="5" fill={C.sun} stroke="none" />
    <circle cx="56" cy="84" r="5" fill={C.sun} stroke="none" />
    <path d="M168 66 L184 62 M184 62 L190 54 M184 62 L190 70" stroke={C.coral} strokeWidth="3.5" />
    <ellipse cx="146" cy="62" rx="26" ry="19" fill={C.teal} />
    <circle cx="142" cy="54" r="7" fill={C.white} />
    <circle cx="160" cy="54" r="7" fill={C.white} />
    <circle cx="144" cy="55" r="3" fill={C.ink} stroke="none" />
    <circle cx="162" cy="55" r="3" fill={C.ink} stroke="none" />
    <path d="M146 72 Q156 78 166 70" strokeWidth="2.5" />
  </g>
))

const Braces = make('ব্রেস', () => (
  <g>
    <rect x="16" y="34" width="168" height="132" rx="28" fill={C.violetPale} />
    <Thick d="M84 58 q-20 0 -20 20 v10 q0 12 -14 12 q14 0 14 12 v10 q0 20 20 20" color={C.violet} w={11} />
    <Thick d="M116 58 q20 0 20 20 v10 q0 12 14 12 q-14 0 -14 12 v10 q0 20 -20 20" color={C.violet} w={11} />
    <circle cx="86" cy="100" r="5" fill={C.coral} stroke="none" />
    <circle cx="100" cy="100" r="5" fill={C.sun} stroke="none" />
    <circle cx="114" cy="100" r="5" fill={C.teal} stroke="none" />
  </g>
))

const PackageBox = make('প্যাকেজ', () => (
  <g>
    <path d="M100 34 L168 68 V138 L100 172 L32 138 V68Z" fill={C.sun} />
    <path d="M100 102 L168 68 V138 L100 172Z" fill={C.skinDark} />
    <path d="M100 34 L168 68 L100 102 L32 68Z" fill={C.sunPale} />
    <path d="M100 102 V172" />
    <path d="M127 46 L141 54 L73 88 L59 80Z" fill={C.coral} />
    <path d="M59 80 L73 88 V124 L59 116Z" fill={C.coral} />
    <path d="M118 128 L148 113 M118 140 L136 131" stroke={C.sunPale} strokeWidth="4" />
  </g>
))

const Rocket = make('রকেট', () => (
  <g>
    <Sparkle x={34} y={58} r={10} fill={C.violetSoft} />
    <Sparkle x={168} y={150} r={8} fill={C.tealSoft} />
    <circle cx="170" cy="104" r="3" fill={C.sun} stroke="none" />
    <g transform="rotate(40 100 100)">
      <path d="M84 146 Q100 196 116 146Z" fill={C.sun} />
      <path d="M92 146 Q100 174 108 146Z" fill={C.coral} stroke="none" />
      <path d="M76 100 L44 138 V158 L78 140Z" fill={C.coral} />
      <path d="M124 100 L156 138 V158 L122 140Z" fill={C.coral} />
      <path d="M100 18 C134 46 138 100 128 148 H72 C62 100 66 46 100 18Z" fill={C.white} />
      <path d="M100 18 C114 30 122 44 126 60 H74 C78 44 86 30 100 18Z" fill={C.violet} />
      <circle cx="100" cy="94" r="14" fill={C.tealSoft} />
      <path d="M92 90 q3 -5 8 -5" stroke={C.white} strokeWidth="3.5" />
    </g>
  </g>
))

const Puzzle = make('ধাঁধা', () => (
  <g>
    <g transform="rotate(-5 60 100)">
      <Union fill={C.teal}>
        <rect x="20" y="54" width="74" height="92" rx="12" />
        <circle cx="96" cy="100" r="15" />
      </Union>
      <path d="M32 70 q4 -8 14 -8" stroke={C.tealSoft} strokeWidth="5" />
    </g>
    <g transform="rotate(5 140 100)">
      <Rd d="M106 66 H160 Q172 66 172 78 V134 Q172 146 160 146 H106 V118 A17 17 0 0 1 106 82Z" fill={C.coral} w={4} />
      <path d="M120 80 H156" stroke={C.coralSoft} strokeWidth="5" />
    </g>
    <Sparkle x={150} y={36} r={11} />
  </g>
))

const Stairs = make('সিঁড়ি', () => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const x = 20 + i * 38
      const top = 146 - i * 30
      return (
        <g key={i}>
          <rect x={x} y={top} width="40" height={176 - top} rx="6" fill={i % 2 ? C.violet : C.violetSoft} />
          <path d={`M${x + 6} ${top + 10} H${x + 24}`} stroke={C.violetPale} strokeWidth="4" />
        </g>
      )
    })}
    <path d="M148 56 V14" strokeWidth="4" />
    <path d="M150 16 L184 28 L150 42Z" fill={C.coral} />
  </g>
))

const RecipeCard = make('রেসিপি', () => (
  <g>
    <rect x="28" y="20" width="144" height="160" rx="18" fill={C.white} />
    <path d="M28 42 a18 18 0 0 1 18-22 H154 a18 18 0 0 1 18 22 V54 H28Z" fill={C.sun} />
    <path d="M52 37 H112" stroke={C.white} strokeWidth="6" />
    <circle cx="146" cy="37" r="7" fill={C.coral} />
    {[0, 1, 2].map((i) => {
      const y = 82 + i * 34
      return (
        <g key={i}>
          <circle cx="54" cy={y} r="12" fill={i === 0 ? C.teal : i === 1 ? C.violetSoft : C.coralSoft} />
          <text x="54" y={y + 6} textAnchor="middle" fontSize="16" fontWeight="800" fill={i === 0 ? C.white : C.ink} stroke="none" fontFamily="system-ui, sans-serif">{i + 1}</text>
          <path d={`M76 ${y} H${148 - i * 14}`} strokeWidth="5" stroke={C.grey} />
        </g>
      )
    })}
  </g>
))

export const THINKING_ART: Partial<Record<ArtName, ArtComponent>> = {
  'code-brackets': CodeBrackets, terminal: Terminal, brain: Brain, binary: Binary, robot: Robot, 'tea-cup': TeaCup, 'cooking-pot': CookingPot,
  book: Book, flowchart: Flowchart, loop: Loop, branch: Branch, 'html-tag': HtmlTag, 'css-brush': CssBrush, 'python-snake': PythonSnake,
  braces: Braces, 'package-box': PackageBox, rocket: Rocket, puzzle: Puzzle, stairs: Stairs, 'recipe-card': RecipeCard,
}
