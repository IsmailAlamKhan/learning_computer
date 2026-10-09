import { C, Rc, Pa, Ci, Ln, Pg, Ol, Hl, mk, arcPath } from './kit'

const keyRow = (y: number, n: number, x0: number, w: number, gap: number) =>
  Array.from({ length: n }, (_, i) => <Rc key={`${y}-${i}`} x={x0 + i * (w + gap)} y={y} width={w} height={14} rx={4} fill="#fff" strokeWidth={2.5} />)

export const laptop = mk('ল্যাপটপ', <>
  <Rc x={36} y={34} width={128} height={98} rx={12} fill={C.violet} />
  <Rc x={45} y={43} width={110} height={80} rx={5} fill={C.tealPale} strokeWidth={2.5} />
  <Ci cx={78} cy={70} r={9} fill={C.sun} strokeWidth={2.5} />
  <Pa d="M45 123 L82 88 L104 108 L120 94 L155 123 Z" fill={C.teal} strokeWidth={2.5} />
  <Hl d="M52 52 L66 52" />
  <Rc x={16} y={132} width={168} height={24} rx={12} fill={C.greyPale} />
  <Rc x={78} y={132} width={44} height={8} rx={4} fill={C.grey} strokeWidth={2.5} />
</>)

export const desktopPc = mk('ডেস্কটপ কম্পিউটার', <>
  <Rc x={16} y={40} width={112} height={82} rx={10} fill={C.violet} />
  <Rc x={24} y={48} width={96} height={64} rx={4} fill={C.tealPale} strokeWidth={2.5} />
  <Pa d="M24 112 L56 80 L74 98 L88 86 L120 112 Z" fill={C.teal} strokeWidth={2.5} />
  <Rc x={62} y={122} width={20} height={16} fill={C.grey} />
  <Rc x={40} y={138} width={64} height={12} rx={6} fill={C.greyPale} />
  <Rc x={140} y={40} width={44} height={116} rx={10} fill={C.violetSoft} />
  <Rc x={148} y={52} width={28} height={7} rx={3} fill={C.violetPale} strokeWidth={2.5} />
  <Rc x={148} y={66} width={28} height={7} rx={3} fill={C.violetPale} strokeWidth={2.5} />
  <Ci cx={162} cy={132} r={8} fill={C.sun} strokeWidth={2.5} />
  <Hl d="M148 84 V104" />
</>)

export const monitor = mk('মনিটর', <>
  <Rc x={86} y={128} width={28} height={26} fill={C.grey} />
  <Rc x={58} y={150} width={84} height={14} rx={7} fill={C.greyPale} />
  <Rc x={20} y={26} width={160} height={108} rx={12} fill={C.violet} />
  <Rc x={30} y={36} width={140} height={86} rx={5} fill={C.tealSoft} strokeWidth={2.5} />
  <Ci cx={134} cy={62} r={10} fill={C.sunPale} strokeWidth={2.5} />
  <Pa d="M30 122 L68 80 L96 108 L116 90 L170 122 Z" fill={C.teal} strokeWidth={2.5} />
  <Hl d="M40 46 L58 46" />
  <Ci cx={100} cy={129} r={2.5} fill={C.sun} strokeWidth={1} />
</>)

export const keyboard = mk('কিবোর্ড', <>
  <Rc x={14} y={56} width={172} height={88} rx={16} fill={C.violetPale} />
  {keyRow(68, 7, 26, 18, 4)}
  {keyRow(88, 6, 34, 18, 6)}
  <Rc x={34} y={108} width={22} height={14} rx={4} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={60} y={108} width={80} height={14} rx={4} fill="#fff" strokeWidth={2.5} />
  <Rc x={144} y={108} width={22} height={14} rx={4} fill={C.coralSoft} strokeWidth={2.5} />
</>)

export const mouse = mk('মাউস', <>
  <Rc x={58} y={30} width={84} height={140} rx={42} fill={C.violetPale} />
  <Pa d="M100 30 H100 A42 42 0 0 0 58 72 V92 H100 Z" fill={C.violetSoft} />
  <Ln x1={58} y1={92} x2={142} y2={92} />
  <Rc x={92} y={50} width={16} height={30} rx={8} fill={C.coral} />
  <Hl d="M70 112 V138" w={5} />
</>)

export const touchpad = mk('টাচপ্যাড', <>
  <Rc x={16} y={44} width={168} height={112} rx={18} fill={C.greyPale} />
  <Rc x={50} y={72} width={100} height={64} rx={12} fill="#fff" />
  <Ln x1={50} y1={120} x2={150} y2={120} strokeWidth={2} />
  <Ci cx={100} cy={96} r={11} fill={C.coral} />
  <Ci cx={100} cy={96} r={20} fill="none" stroke={C.coral} strokeWidth={2.5} strokeDasharray="4 6" />
  <Hl d="M60 82 L74 82" />
</>)

export const speaker = mk('স্পিকার', <>
  <Rc x={50} y={20} width={100} height={160} rx={22} fill={C.violet} />
  <Ci cx={100} cy={60} r={14} fill={C.tealSoft} />
  <Ci cx={100} cy={122} r={36} fill={C.violetPale} />
  <Ci cx={100} cy={122} r={14} fill={C.violetSoft} />
  <Hl d="M70 104 A34 34 0 0 1 90 90" />
  <Hl d="M64 36 V50" />
</>)

export const webcam = mk('ওয়েবক্যাম', <>
  <Rc x={86} y={126} width={28} height={24} fill={C.grey} />
  <Rc x={58} y={146} width={84} height={18} rx={9} fill={C.greyPale} />
  <Ci cx={100} cy={80} r={56} fill={C.violet} />
  <Ci cx={100} cy={80} r={38} fill={C.ink} />
  <Ci cx={100} cy={80} r={26} fill={C.teal} strokeWidth={2.5} />
  <Ci cx={100} cy={80} r={11} fill={C.tealSoft} strokeWidth={2.5} />
  <Hl d="M84 66 A20 20 0 0 1 96 62" />
  <Ci cx={100} cy={32} r={4} fill={C.sun} strokeWidth={2} />
</>)

export const battery = mk('ব্যাটারি', <>
  <Rc x={22} y={60} width={134} height={80} rx={16} fill="#fff" />
  <Rc x={156} y={85} width={20} height={30} rx={7} fill={C.grey} />
  <Rc x={34} y={72} width={30} height={56} rx={7} fill={C.teal} strokeWidth={2.5} />
  <Rc x={70} y={72} width={30} height={56} rx={7} fill={C.teal} strokeWidth={2.5} />
  <Rc x={106} y={72} width={30} height={56} rx={7} fill={C.tealSoft} strokeWidth={2.5} />
  <Hl d="M40 80 V92" />
</>)

export const charger = mk('চার্জার', <>
  <Ol d="M100 130 C100 178 168 150 168 176" color={C.grey} w={8} />
  <Rc x={76} y={20} width={12} height={28} rx={4} fill={C.grey} />
  <Rc x={112} y={20} width={12} height={28} rx={4} fill={C.grey} />
  <Rc x={52} y={44} width={96} height={88} rx={20} fill={C.violet} />
  <Pg points="106,56 84,94 98,94 92,120 118,80 102,80" fill={C.sun} strokeWidth={2.5} />
  <Hl d="M62 58 V74" />
</>)

export const usbStick = mk('পেনড্রাইভ', <>
  <Rc x={82} y={20} width={36} height={50} rx={5} fill={C.greyPale} />
  <Rc x={90} y={30} width={7} height={10} rx={2} fill={C.ink} strokeWidth={1} />
  <Rc x={103} y={30} width={7} height={10} rx={2} fill={C.ink} strokeWidth={1} />
  <Rc x={64} y={66} width={72} height={112} rx={16} fill={C.coral} />
  <Rc x={76} y={100} width={48} height={32} rx={6} fill="#fff" strokeWidth={2.5} />
  <Ci cx={100} cy={152} r={7} fill={C.coralPale} strokeWidth={2.5} />
  <Hl d="M74 80 V96" />
</>)

export const powerSym = (cx: number, cy: number, r: number, color: string, w: number) => (
  <g fill="none" stroke={color} strokeWidth={w} strokeLinecap="round">
    <path d={arcPath(cx, cy, r, -50, 230)} />
    <path d={`M${cx} ${cy - r - 4} V${cy - 2}`} />
  </g>
)

export const powerButton = mk('পাওয়ার বাটন', <>
  <Rc x={30} y={42} width={140} height={140} rx={34} fill={C.grey} />
  <Rc x={30} y={30} width={140} height={140} rx={34} fill="#fff" />
  <Hl d="M46 56 A22 22 0 0 1 60 46" w={5} />
  {powerSym(100, 104, 32, C.violet, 11)}
</>)

export const plug = mk('প্লাগ', <>
  <Ol d="M100 130 C100 170 60 160 60 184" color={C.grey} w={8} />
  <Rc x={74} y={22} width={12} height={40} rx={4} fill={C.grey} />
  <Rc x={114} y={22} width={12} height={40} rx={4} fill={C.grey} />
  <Rc x={58} y={58} width={84} height={76} rx={22} fill={C.sun} />
  <Hl d="M70 72 V90" />
  <Ci cx={88} cy={98} r={4} fill={C.ink} strokeWidth={1} />
  <Ci cx={112} cy={98} r={4} fill={C.ink} strokeWidth={1} />
</>)

export const headphones = mk('হেডফোন', <>
  <Ol d="M46 112 A54 54 0 0 1 154 112" color={C.violet} w={12} />
  <Rc x={26} y={96} width={40} height={72} rx={18} fill={C.coral} />
  <Rc x={134} y={96} width={40} height={72} rx={18} fill={C.coral} />
  <Rc x={38} y={108} width={14} height={48} rx={7} fill={C.coralPale} strokeWidth={2.5} />
  <Rc x={148} y={108} width={14} height={48} rx={7} fill={C.coralPale} strokeWidth={2.5} />
  <Hl d="M32 110 V122" />
</>)

export const printer = mk('প্রিন্টার', <>
  <Rc x={56} y={26} width={88} height={56} rx={5} fill="#fff" />
  <Rc x={22} y={74} width={156} height={70} rx={16} fill={C.violetSoft} />
  <Rc x={62} y={118} width={76} height={58} rx={5} fill="#fff" />
  <Ln x1={74} y1={134} x2={126} y2={134} stroke={C.grey} />
  <Ln x1={74} y1={148} x2={116} y2={148} stroke={C.grey} />
  <Ln x1={74} y1={162} x2={120} y2={162} stroke={C.grey} />
  <Ln x1={68} y1={44} x2={120} y2={44} stroke={C.grey} />
  <Ln x1={68} y1={58} x2={108} y2={58} stroke={C.grey} />
  <Ci cx={152} cy={94} r={5} fill={C.teal} strokeWidth={2} />
  <Rc x={36} y={88} width={32} height={8} rx={4} fill={C.violetPale} strokeWidth={2.5} />
</>)

export const phone = mk('ফোন', <>
  <Rc x={58} y={16} width={84} height={168} rx={20} fill={C.violet} />
  <Rc x={66} y={30} width={68} height={136} rx={8} fill={C.tealPale} strokeWidth={2.5} />
  <Rc x={86} y={21} width={28} height={5} rx={2.5} fill={C.ink} strokeWidth={0} />
  <Rc x={74} y={40} width={22} height={22} rx={7} fill={C.coral} strokeWidth={2.5} />
  <Rc x={104} y={40} width={22} height={22} rx={7} fill={C.sun} strokeWidth={2.5} />
  <Rc x={74} y={70} width={22} height={22} rx={7} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={104} y={70} width={22} height={22} rx={7} fill={C.teal} strokeWidth={2.5} />
  <Rc x={88} y={172} width={24} height={4} rx={2} fill={C.violetSoft} strokeWidth={0} />
</>)

export const tablet = mk('ট্যাবলেট', <>
  <Rc x={18} y={38} width={164} height={124} rx={20} fill={C.teal} />
  <Rc x={30} y={48} width={140} height={104} rx={6} fill={C.sunPale} strokeWidth={2.5} />
  <Ci cx={64} cy={80} r={14} fill={C.coral} strokeWidth={2.5} />
  <Rc x={92} y={70} width={66} height={8} rx={4} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={92} y={86} width={50} height={8} rx={4} fill={C.violetSoft} strokeWidth={2.5} />
  <Rc x={42} y={112} width={104} height={8} rx={4} fill={C.tealSoft} strokeWidth={2.5} />
  <Ci cx={24} cy={100} r={2.5} fill={C.ink} strokeWidth={1} />
</>)

export const camera = mk('ক্যামেরা', <>
  <Rc x={66} y={38} width={54} height={26} rx={8} fill={C.coral} />
  <Rc x={140} y={42} width={26} height={14} rx={5} fill={C.sun} />
  <Rc x={16} y={54} width={168} height={106} rx={22} fill={C.coral} />
  <Ci cx={100} cy={108} r={40} fill="#fff" />
  <Ci cx={100} cy={108} r={29} fill={C.violet} />
  <Ci cx={100} cy={108} r={12} fill={C.ink} />
  <Ci cx={92} cy={98} r={5} fill="#fff" strokeWidth={0} />
  <Ci cx={36} cy={76} r={5} fill={C.sunPale} strokeWidth={2} />
  <Hl d="M30 96 V130" w={5} />
</>)

export const microphone = mk('মাইক্রোফোন', <>
  <Ol d="M54 92 A46 46 0 0 0 146 92" color={C.grey} w={8} />
  <Rc x={94} y={136} width={12} height={24} fill={C.grey} />
  <Rc x={66} y={158} width={68} height={16} rx={8} fill={C.violet} />
  <Rc x={72} y={18} width={56} height={100} rx={28} fill={C.violetSoft} />
  <Ln x1={74} y1={44} x2={126} y2={44} strokeWidth={2.5} />
  <Ln x1={74} y1={62} x2={126} y2={62} strokeWidth={2.5} />
  <Ln x1={74} y1={80} x2={126} y2={80} strokeWidth={2.5} />
  <Hl d="M82 30 V38" />
</>)

export const router = mk('রাউটার', <>
  <Rc x={36} y={46} width={12} height={70} rx={6} fill={C.grey} />
  <Rc x={152} y={46} width={12} height={70} rx={6} fill={C.grey} />
  <Rc x={16} y={106} width={168} height={50} rx={16} fill={C.violet} />
  <Ci cx={50} cy={131} r={5} fill={C.tealSoft} strokeWidth={2} />
  <Ci cx={68} cy={131} r={5} fill={C.sun} strokeWidth={2} />
  <Ci cx={86} cy={131} r={5} fill={C.coralSoft} strokeWidth={2} />
  <Rc x={124} y={125} width={40} height={12} rx={6} fill={C.violetSoft} strokeWidth={2.5} />
  <path d={arcPath(100, 92, 16, 200, 340)} fill="none" stroke={C.teal} strokeWidth={6} strokeLinecap="round" />
  <path d={arcPath(100, 92, 32, 215, 325)} fill="none" stroke={C.teal} strokeWidth={6} strokeLinecap="round" />
  <path d={arcPath(100, 92, 48, 225, 315)} fill="none" stroke={C.teal} strokeWidth={6} strokeLinecap="round" />
  <Ci cx={100} cy={94} r={5} fill={C.coral} strokeWidth={2.5} />
</>)

export const hardDrive = mk('হার্ড ড্রাইভ', <>
  <Rc x={16} y={50} width={168} height={100} rx={18} fill={C.greyPale} />
  <Ci cx={72} cy={100} r={36} fill={C.violetPale} />
  <Ci cx={72} cy={100} r={22} fill="none" stroke={C.violetSoft} strokeWidth={2.5} />
  <Ci cx={72} cy={100} r={8} fill={C.grey} strokeWidth={2.5} />
  <Pa d="M132 66 L86 98" stroke={C.ink} strokeWidth={10} fill="none" />
  <Pa d="M132 66 L86 98" stroke={C.coral} strokeWidth={5} fill="none" />
  <Ci cx={132} cy={66} r={6} fill={C.grey} strokeWidth={2.5} />
  <Ci cx={160} cy={128} r={5} fill={C.tealSoft} strokeWidth={2} />
  <Ln x1={118} y1={128} x2={146} y2={128} strokeWidth={2.5} stroke={C.grey} />
</>)

export const chip = mk('চিপ', <>
  {[0, 1, 2, 3].map((i) => (
    <g key={i}>
      <Rc x={66 + i * 22} y={32} width={10} height={26} rx={3} fill={C.sun} strokeWidth={2.5} />
      <Rc x={66 + i * 22} y={142} width={10} height={26} rx={3} fill={C.sun} strokeWidth={2.5} />
      <Rc x={32} y={66 + i * 22} width={26} height={10} rx={3} fill={C.sun} strokeWidth={2.5} />
      <Rc x={142} y={66 + i * 22} width={26} height={10} rx={3} fill={C.sun} strokeWidth={2.5} />
    </g>
  ))}
  <Rc x={50} y={50} width={100} height={100} rx={16} fill={C.violet} />
  <Rc x={74} y={74} width={52} height={52} rx={9} fill={C.violetSoft} />
  <Ci cx={62} cy={62} r={3.5} fill={C.violetPale} strokeWidth={0} />
  <Hl d="M84 90 V104" />
</>)

export const ramStick = mk('র‍্যাম', <>
  {Array.from({ length: 11 }, (_, i) => <Rc key={i} x={24 + i * 14 + (i > 5 ? 8 : 0)} y={134} width={9} height={16} rx={2} fill={C.sun} strokeWidth={2} />)}
  <Rc x={16} y={60} width={168} height={78} rx={8} fill={C.teal} />
  {[0, 1, 2, 3].map((i) => <Rc key={i} x={28 + i * 38} y={76} width={28} height={36} rx={5} fill={C.ink} strokeWidth={2} />)}
  {[0, 1, 2, 3].map((i) => <Hl key={i} d={`M${34 + i * 38} 84 H${44 + i * 38}`} w={3} />)}
  <Ci cx={166} cy={72} r={3} fill={C.tealSoft} strokeWidth={0} />
</>)

export const HARDWARE = { laptop, 'desktop-pc': desktopPc, monitor, keyboard, mouse, touchpad, speaker, webcam, battery, charger, 'usb-stick': usbStick, 'power-button': powerButton, plug, headphones, printer, phone, tablet, camera, microphone, router, 'hard-drive': hardDrive, chip, 'ram-stick': ramStick }
