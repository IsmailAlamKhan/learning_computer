import { C, Rc, Pa, Ci, El, Ln, Pg, Ol, Hl, mk, arcPath } from './kit'

const page = 'M54 18 H118 L158 58 V170 a12 12 0 0 1 -12 12 H54 a12 12 0 0 1 -12 -12 V30 a12 12 0 0 1 12 -12 Z'
const fold = 'M118 18 V46 a12 12 0 0 0 12 12 H158'

export const desktop = mk('ডেস্কটপ', <>
  <Rc x={90} y={146} width={20} height={14} fill={C.grey} />
  <Rc x={62} y={158} width={76} height={12} rx={6} fill={C.greyPale} />
  <Rc x={16} y={24} width={168} height={126} rx={12} fill={C.violet} />
  <Rc x={24} y={32} width={152} height={110} rx={5} fill={C.tealSoft} strokeWidth={2.5} />
  <Pa d="M32 44 h14 l4 4 h10 v14 h-28 z" fill={C.sun} strokeWidth={2.5} />
  <Pa d="M36 74 h18 l6 6 v18 h-24 z" fill="#fff" strokeWidth={2.5} />
  <Pa d="M36 112 h22 l-2 14 h-18 z" fill={C.greyPale} strokeWidth={2.5} />
  <Rc x={106} y={50} width={56} height={44} rx={5} fill="#fff" strokeWidth={2.5} />
  <Ln x1={106} y1={60} x2={162} y2={60} strokeWidth={2.5} />
  <Rc x={24} y={126} width={152} height={16} rx={4} fill={C.violetPale} strokeWidth={2.5} />
  <Ci cx={36} cy={134} r={4} fill={C.violet} strokeWidth={0} />
  <Rc x={52} y={130} width={12} height={8} rx={2} fill={C.coral} strokeWidth={0} />
  <Rc x={70} y={130} width={12} height={8} rx={2} fill={C.sun} strokeWidth={0} />
</>)

export const windowArt = mk('উইন্ডো', <>
  <Rc x={18} y={30} width={164} height={140} rx={14} fill="#fff" />
  <Pa d="M18 62 V44 a14 14 0 0 1 14 -14 H168 a14 14 0 0 1 14 14 V62 Z" fill={C.violetSoft} />
  <Ci cx={36} cy={46} r={5} fill={C.coral} strokeWidth={2} />
  <Ci cx={52} cy={46} r={5} fill={C.sun} strokeWidth={2} />
  <Ci cx={68} cy={46} r={5} fill={C.teal} strokeWidth={2} />
  <Rc x={32} y={78} width={52} height={40} rx={6} fill={C.tealPale} strokeWidth={2.5} />
  <Ci cx={46} cy={91} r={5} fill={C.sun} strokeWidth={0} />
  <Pa d="M32 118 L52 98 L66 110 L76 102 L84 110 V112 a6 6 0 0 1 -6 6 H32 Z" fill={C.teal} strokeWidth={0} />
  <Rc x={96} y={80} width={70} height={9} rx={4.5} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={96} y={98} width={54} height={9} rx={4.5} fill={C.greyPale} strokeWidth={2.5} />
  <Rc x={32} y={132} width={134} height={9} rx={4.5} fill={C.greyPale} strokeWidth={2.5} />
  <Rc x={32} y={148} width={96} height={9} rx={4.5} fill={C.greyPale} strokeWidth={2.5} />
</>)

const folderBack = 'M22 52 a10 10 0 0 1 10 -10 H76 l14 16 H168 a10 10 0 0 1 10 10 V150 a10 10 0 0 1 -10 10 H32 a10 10 0 0 1 -10 -10 Z'
export const folder = mk('ফোল্ডার', <>
  <Pa d={folderBack} fill={C.sun} />
  <Rc x={38} y={66} width={124} height={30} rx={4} fill="#fff" strokeWidth={2.5} />
  <Rc x={20} y={80} width={160} height={82} rx={14} fill={C.sunPale} />
  <Hl d="M34 94 H70" w={5} />
</>)

export const folderOpen = mk('খোলা ফোল্ডার', <>
  <Pa d={folderBack} fill={C.sun} />
  <Rc x={42} y={50} width={100} height={64} rx={5} fill="#fff" strokeWidth={2.5} />
  <Ln x1={54} y1={66} x2={118} y2={66} stroke={C.grey} strokeWidth={2.5} />
  <Ln x1={54} y1={80} x2={104} y2={80} stroke={C.grey} strokeWidth={2.5} />
  <Pa d="M44 92 H188 Q192 92 190 98 L174 160 Q172 164 166 164 H30 Q22 164 24 156 L38 100 Q40 92 44 92 Z" fill={C.sunPale} />
  <Hl d="M50 106 H84" w={5} />
</>)

export const file = mk('ফাইল', <>
  <Pa d={page} fill="#fff" />
  <Pa d={fold} fill={C.violetSoft} />
  <Ci cx={84} cy={112} r={15} fill={C.coral} strokeWidth={2.5} />
  <Pg points="100,150 120,114 140,150" fill={C.teal} strokeWidth={2.5} />
  <Ln x1={62} y1={84} x2={100} y2={84} stroke={C.grey} />
</>)

export const document = mk('ডকুমেন্ট', <>
  <Pa d={page} fill="#fff" />
  <Pa d={fold} fill={C.violetSoft} />
  <Rc x={58} y={74} width={50} height={10} rx={5} fill={C.coral} strokeWidth={2.5} />
  <Ln x1={58} y1={100} x2={126} y2={100} stroke={C.grey} />
  <Ln x1={58} y1={116} x2={142} y2={116} stroke={C.grey} />
  <Ln x1={58} y1={132} x2={142} y2={132} stroke={C.grey} />
  <Ln x1={58} y1={148} x2={100} y2={148} stroke={C.grey} />
  <Ln x1={58} y1={36} x2={96} y2={36} stroke={C.grey} />
</>)

export const image = mk('ছবি', <>
  <Rc x={20} y={36} width={160} height={128} rx={16} fill="#fff" />
  <Rc x={30} y={46} width={140} height={108} rx={8} fill={C.tealPale} strokeWidth={2.5} />
  <Ci cx={134} cy={76} r={13} fill={C.sun} strokeWidth={2.5} />
  <Pa d="M32 150 L32 134 L78 90 L110 124 L130 108 L168 138 V148 a4 4 0 0 1 -4 4 H34 Z" fill={C.teal} strokeWidth={2.5} />
  <Pa d="M78 90 L90 102 L82 108 L70 98 Z" fill="#fff" strokeWidth={0} />
</>)

export const music = mk('গান', <>
  <Rc x={26} y={26} width={148} height={148} rx={36} fill={C.violet} />
  <Pa d="M86 62 L138 50 V120 M86 62 V132" fill="none" stroke="#fff" strokeWidth={9} />
  <Pa d="M86 62 L138 50 V70 L86 82 Z" fill="#fff" strokeWidth={0} />
  <El cx={74} cy={134} rx={16} ry={12} fill="#fff" strokeWidth={0} />
  <El cx={126} cy={122} rx={16} ry={12} fill="#fff" strokeWidth={0} />
  <Hl d="M42 50 A20 20 0 0 1 58 38" w={5} />
</>)

export const video = mk('ভিডিও', <>
  <Rc x={18} y={44} width={164} height={112} rx={20} fill={C.coral} />
  {[0, 1, 2, 3].map((i) => <Rc key={i} x={26} y={56 + i * 24} width={10} height={14} rx={3} fill={C.coralPale} strokeWidth={2} />)}
  {[0, 1, 2, 3].map((i) => <Rc key={i} x={164} y={56 + i * 24} width={10} height={14} rx={3} fill={C.coralPale} strokeWidth={2} />)}
  <Pa d="M84 74 L124 100 L84 126 Z" fill="#fff" />
</>)

export const zip = mk('জিপ ফাইল', <>
  <Pa d={page} fill={C.teal} />
  <Pa d={fold} fill={C.tealSoft} />
  {[0, 1, 2, 3, 4, 5].map((i) => <Rc key={i} x={i % 2 ? 100 : 86} y={58 + i * 12} width={14} height={9} rx={2} fill="#fff" strokeWidth={2} />)}
  <Rc x={86} y={132} width={28} height={30} rx={8} fill={C.sun} />
  <Rc x={95} y={142} width={10} height={12} rx={4} fill={C.sunPale} strokeWidth={2} />
</>)

export const trash = mk('ডাস্টবিন', <>
  <Rc x={78} y={20} width={44} height={20} rx={8} fill={C.grey} />
  <Pa d="M52 64 H148 L140 160 a14 14 0 0 1 -14 14 H74 a14 14 0 0 1 -14 -14 Z" fill={C.tealSoft} />
  <Rc x={36} y={42} width={128} height={24} rx={12} fill={C.teal} />
  <Ln x1={80} y1={84} x2={82} y2={152} stroke={C.teal} strokeWidth={4} />
  <Ln x1={100} y1={84} x2={100} y2={152} stroke={C.teal} strokeWidth={4} />
  <Ln x1={120} y1={84} x2={118} y2={152} stroke={C.teal} strokeWidth={4} />
  <Hl d="M52 52 H78" w={4} />
</>)

export const almirah = mk('আলমারি', <>
  <Rc x={50} y={176} width={14} height={10} rx={3} fill={C.grey} />
  <Rc x={136} y={176} width={14} height={10} rx={3} fill={C.grey} />
  <Rc x={34} y={16} width={132} height={162} rx={10} fill={C.teal} />
  <Rc x={44} y={26} width={112} height={66} rx={5} fill={C.tealPale} strokeWidth={2.5} />
  <Rc x={52} y={46} width={16} height={46} rx={3} fill={C.coral} strokeWidth={2.5} />
  <Rc x={70} y={38} width={16} height={54} rx={3} fill={C.sun} strokeWidth={2.5} />
  <Rc x={88} y={50} width={16} height={42} rx={3} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={106} y={42} width={16} height={50} rx={3} fill="#fff" strokeWidth={2.5} />
  <Rc x={124} y={52} width={24} height={40} rx={3} fill={C.coralSoft} strokeWidth={2.5} />
  <Rc x={44} y={100} width={54} height={68} rx={5} fill={C.tealSoft} strokeWidth={2.5} />
  <Rc x={102} y={100} width={54} height={68} rx={5} fill={C.tealSoft} strokeWidth={2.5} />
  <Rc x={52} y={110} width={38} height={48} rx={3} fill="none" stroke={C.teal} strokeWidth={2} />
  <Rc x={110} y={110} width={38} height={48} rx={3} fill="none" stroke={C.teal} strokeWidth={2} />
  <Ci cx={91} cy={134} r={4.5} fill={C.sun} strokeWidth={2} />
  <Ci cx={109} cy={134} r={4.5} fill={C.sun} strokeWidth={2} />
</>)

export const pathMap = mk('পাথ ম্যাপ', <>
  <Pa d="M16 52 L66 40 L134 54 L184 42 V150 L134 162 L66 148 L16 160 Z" fill={C.sunPale} />
  <Ln x1={66} y1={40} x2={66} y2={148} stroke={C.sun} strokeWidth={2.5} />
  <Ln x1={134} y1={54} x2={134} y2={162} stroke={C.sun} strokeWidth={2.5} />
  <Pa d="M38 130 C60 130 60 100 86 104 C112 108 108 138 130 126" fill="none" stroke={C.violet} strokeWidth={4} strokeDasharray="2 9" />
  <Rc x={26} y={120} width={22} height={20} rx={5} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={74} y={90} width={24} height={20} rx={5} fill={C.tealSoft} strokeWidth={2.5} />
  <Pa d="M150 38 a22 22 0 0 1 22 22 c0 18 -22 40 -22 40 s-22 -22 -22 -40 a22 22 0 0 1 22 -22 Z" fill={C.coral} transform="translate(-8 -6) scale(1)" />
  <Ci cx={142} cy={52} r={8} fill="#fff" strokeWidth={2.5} />
</>)

export const magnifier = mk('ম্যাগনিফায়ার', <>
  <Ol d="M122 122 L166 166" color={C.coral} w={16} />
  <Ci cx={84} cy={84} r={56} fill={C.violet} />
  <Ci cx={84} cy={84} r={42} fill={C.tealPale} />
  <Hl d={arcPath(84, 84, 30, 200, 260)} w={6} />
</>)

export const bookmark = mk('বুকমার্ক', <>
  <Pa d="M58 20 H142 a6 6 0 0 1 6 6 V178 L100 142 L52 178 V26 a6 6 0 0 1 6 -6 Z" fill={C.coral} />
  <Pa d="M100 52 L108 70 L128 72 L113 85 L118 104 L100 94 L82 104 L87 85 L72 72 L92 70 Z" fill={C.sunPale} strokeWidth={2.5} />
  <Hl d="M64 34 V120" w={4} />
</>)

export const clipboard = mk('ক্লিপবোর্ড', <>
  <Rc x={32} y={30} width={136} height={150} rx={16} fill={C.sun} />
  <Rc x={46} y={50} width={108} height={118} rx={6} fill="#fff" strokeWidth={2.5} />
  <Rc x={70} y={18} width={60} height={30} rx={9} fill={C.grey} />
  <Ci cx={100} cy={30} r={5} fill={C.greyPale} strokeWidth={2} />
  {[0, 1, 2].map((i) => (
    <g key={i}>
      <Rc x={58} y={68 + i * 30} width={16} height={16} rx={4} fill={i < 2 ? C.teal : '#fff'} strokeWidth={2.5} />
      {i < 2 && <Pa d={`M62 ${76 + i * 30} l4 4 l6 -8`} fill="none" stroke="#fff" strokeWidth={3} />}
      <Ln x1={86} y1={76 + i * 30} x2={140} y2={76 + i * 30} stroke={C.grey} />
    </g>
  ))}
</>)

export const copy = mk('কপি', <>
  <Rc x={26} y={20} width={96} height={124} rx={12} fill={C.violetPale} />
  <Ln x1={42} y1={46} x2={96} y2={46} stroke={C.violetSoft} />
  <Ln x1={42} y1={62} x2={82} y2={62} stroke={C.violetSoft} />
  <Rc x={74} y={54} width={100} height={128} rx={12} fill="#fff" />
  <Rc x={90} y={72} width={44} height={9} rx={4.5} fill={C.violet} strokeWidth={2.5} />
  <Ln x1={90} y1={102} x2={158} y2={102} stroke={C.grey} />
  <Ln x1={90} y1={118} x2={158} y2={118} stroke={C.grey} />
  <Ln x1={90} y1={134} x2={134} y2={134} stroke={C.grey} />
</>)

export const scissors = mk('কাঁচি', <>
  <Ol d="M72 120 L128 30" color={C.greyPale} w={14} />
  <Ol d="M128 120 L72 30" color={C.greyPale} w={14} />
  <Ci cx={64} cy={146} r={24} fill={C.coral} />
  <Ci cx={136} cy={146} r={24} fill={C.coral} />
  <Ci cx={64} cy={146} r={11} fill={C.paper} strokeWidth={2.5} />
  <Ci cx={136} cy={146} r={11} fill={C.paper} strokeWidth={2.5} />
  <Ci cx={100} cy={75} r={7} fill={C.sun} strokeWidth={2.5} />
</>)

export const paste = mk('পেস্ট', <>
  <Rc x={28} y={28} width={118} height={140} rx={16} fill={C.teal} />
  <Rc x={42} y={48} width={90} height={108} rx={6} fill="#fff" strokeWidth={2.5} />
  <Rc x={58} y={18} width={58} height={28} rx={9} fill={C.grey} />
  <Ln x1={54} y1={80} x2={118} y2={80} stroke={C.grey} />
  <Ln x1={54} y1={98} x2={104} y2={98} stroke={C.grey} />
  <Ln x1={54} y1={116} x2={112} y2={116} stroke={C.grey} />
  <Ci cx={140} cy={138} r={34} fill={C.coral} />
  <Pa d="M140 118 V152 M126 140 L140 154 L154 140" fill="none" stroke="#fff" strokeWidth={8} />
</>)

export const undo = mk('আনডু', <>
  <Ci cx={100} cy={100} r={78} fill={C.violetPale} />
  <Ol d="M138 138 C148 96 108 70 76 88" color={C.coral} w={16} />
  <Pg points="44,86 82,56 90,112" fill={C.coral} />
  <Hl d="M48 62 A66 66 0 0 1 70 44" w={5} />
</>)

export const saveDisk = mk('সেভ', <>
  <Pa d="M38 26 H146 L174 54 V160 a14 14 0 0 1 -14 14 H38 a14 14 0 0 1 -14 -14 V40 a14 14 0 0 1 14 -14 Z" fill={C.violet} />
  <Rc x={60} y={26} width={74} height={46} rx={6} fill={C.greyPale} />
  <Rc x={106} y={36} width={14} height={26} rx={3} fill={C.grey} strokeWidth={2.5} />
  <Rc x={48} y={96} width={104} height={78} rx={8} fill="#fff" strokeWidth={2.5} />
  <Ln x1={62} y1={118} x2={138} y2={118} stroke={C.grey} />
  <Ln x1={62} y1={136} x2={138} y2={136} stroke={C.grey} />
  <Ln x1={62} y1={154} x2={112} y2={154} stroke={C.grey} />
</>)

export const pencil = mk('পেন্সিল', <g transform="rotate(45 100 100)">
  <Rc x={82} y={20} width={36} height={22} rx={8} fill={C.coral} />
  <Rc x={82} y={42} width={36} height={12} fill={C.grey} />
  <Rc x={82} y={54} width={36} height={84} fill={C.sun} />
  <Pa d="M82 138 H118 L100 176 Z" fill={C.skin} />
  <Pa d="M92 158 H108 L100 176 Z" fill={C.ink} strokeWidth={2} />
  <Ln x1={100} y1={56} x2={100} y2={136} stroke={C.sunPale} strokeWidth={4} />
</g>)

export const notebook = mk('নোটবই', <>
  <Rc x={46} y={20} width={112} height={160} rx={12} fill={C.violet} />
  <Rc x={64} y={46} width={76} height={50} rx={8} fill={C.violetPale} strokeWidth={2.5} />
  <Ln x1={74} y1={64} x2={128} y2={64} stroke={C.violetSoft} strokeWidth={3} />
  <Ln x1={74} y1={78} x2={112} y2={78} stroke={C.violetSoft} strokeWidth={3} />
  <Rc x={64} y={116} width={76} height={10} rx={5} fill={C.violetSoft} strokeWidth={2.5} />
  {[0, 1, 2, 3, 4, 5].map((i) => <Rc key={i} x={34} y={34 + i * 24} width={30} height={10} rx={5} fill={C.greyPale} strokeWidth={2.5} />)}
</>)

export const taskbar = mk('টাস্কবার', <>
  <Rc x={14} y={70} width={172} height={60} rx={18} fill={C.greyPale} />
  <Ci cx={42} cy={100} r={15} fill={C.violet} />
  <Ci cx={37} cy={95} r={2.5} fill="#fff" strokeWidth={0} />
  <Ci cx={47} cy={95} r={2.5} fill="#fff" strokeWidth={0} />
  <Ci cx={37} cy={105} r={2.5} fill="#fff" strokeWidth={0} />
  <Ci cx={47} cy={105} r={2.5} fill="#fff" strokeWidth={0} />
  <Rc x={66} y={86} width={26} height={26} rx={7} fill={C.coral} strokeWidth={2.5} />
  <Rc x={98} y={86} width={26} height={26} rx={7} fill={C.sun} strokeWidth={2.5} />
  <Rc x={130} y={86} width={26} height={26} rx={7} fill={C.teal} strokeWidth={2.5} />
  <Ci cx={170} cy={92} r={3.5} fill={C.violet} strokeWidth={0} />
  <Rc x={160} y={104} width={20} height={5} rx={2.5} fill={C.grey} strokeWidth={0} />
</>)

export const dock = mk('ডক', <>
  <Rc x={14} y={84} width={172} height={78} rx={28} fill="#fff" fillOpacity={0.7} />
  <Hl d="M34 94 H100" w={4} />
  {[C.coral, C.sun, C.teal, C.violet, C.coralSoft].map((c, i) => <Rc key={i} x={26 + i * 32} y={100} width={28} height={28} rx={9} fill={c} strokeWidth={2.5} />)}
  <Ci cx={72} cy={146} r={3.5} fill={C.ink} strokeWidth={0} />
</>)

export const startButton = mk('স্টার্ট বাটন', <>
  <Ci cx={100} cy={100} r={78} fill={C.greyPale} />
  <Ci cx={100} cy={100} r={62} fill={C.violet} />
  {[[78, 78], [106, 78], [78, 106], [106, 106]].map(([x, y], i) => <Rc key={i} x={x} y={y} width={16} height={16} rx={5} fill={i === 1 ? C.sun : '#fff'} strokeWidth={2.5} />)}
  <Hl d={arcPath(100, 100, 52, 200, 250)} w={5} />
</>)

export const cursorArrow = mk('কার্সর', <>
  <Pa d="M66 36 V160 L92 134 L112 178 L136 168 L116 126 L152 126 Z" fill={C.violetSoft} transform="translate(8 8)" stroke="none" />
  <Pa d="M58 26 V150 L84 124 L104 168 L128 158 L108 116 L144 116 Z" fill="#fff" strokeWidth={4} />
  <Hl d="M70 56 V100" w={4} />
</>)

export const handClick = mk('ক্লিক', <>
  <Ln x1={81} y1={12} x2={81} y2={28} stroke={C.coral} strokeWidth={5} />
  <Ln x1={55} y1={20} x2={65} y2={34} stroke={C.coral} strokeWidth={5} />
  <Ln x1={107} y1={20} x2={97} y2={34} stroke={C.coral} strokeWidth={5} />
  <g transform="translate(0 14)">
    <Rc x={94} y={78} width={26} height={50} rx={13} fill={C.skin} />
    <Rc x={116} y={84} width={26} height={46} rx={13} fill={C.skin} />
    <Rc x={138} y={92} width={26} height={42} rx={13} fill={C.skin} />
    <Rc x={54} y={98} width={114} height={64} rx={28} fill={C.skin} />
    <Rc x={34} y={104} width={40} height={22} rx={11} fill={C.skin} transform="rotate(-24 54 115)" />
    <Rc x={66} y={30} width={30} height={96} rx={15} fill={C.skin} />
    <Ln x1={118} y1={112} x2={118} y2={124} stroke={C.skinDark} strokeWidth={2.5} />
    <Ln x1={140} y1={118} x2={140} y2={128} stroke={C.skinDark} strokeWidth={2.5} />
    <Pa d="M74 42 V58" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} />
  </g>
</>)

export const FILES = { desktop, window: windowArt, folder, 'folder-open': folderOpen, file, document, image, music, video, zip, trash, almirah, 'path-map': pathMap, magnifier, bookmark, clipboard, copy, scissors, paste, undo, 'save-disk': saveDisk, pencil, notebook, taskbar, dock, 'start-button': startButton, 'cursor-arrow': cursorArrow, 'hand-click': handClick }
