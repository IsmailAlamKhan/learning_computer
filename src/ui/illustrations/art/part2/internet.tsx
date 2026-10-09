import { useId } from 'react'
import type { ArtName } from '../../names'
import type { ArtComponent } from '../../types'
import { C, make, Thick, Rd, Union, polar } from './kit'

const Globe = make('পৃথিবী', () => (
  <g>
    <circle cx="100" cy="100" r="72" fill={C.tealPale} stroke="none" />
    <path d="M50 76 q12-24 40-20 q10 10 0 20 q-8 14 -22 10 q-8 10 -18 -10z" fill={C.tealSoft} />
    <path d="M108 118 q22-8 36 8 q-4 24 -24 32 q-16 -12 -12 -40z" fill={C.tealSoft} />
    <path d="M116 46 q18-6 30 8 q-12 10 -30 -8z" fill={C.tealSoft} />
    <ellipse cx="100" cy="100" rx="32" ry="72" strokeWidth="2" opacity="0.4" />
    <path d="M28 100 H172" strokeWidth="2" opacity="0.4" />
    <circle cx="100" cy="100" r="72" />
    <path d="M62 52 q10-12 26-16" stroke={C.white} strokeWidth="5" opacity="0.8" />
  </g>
))

const Wifi = make('ওয়াইফাই', () => {
  const arc = (r: number, c: string) => {
    const dx = r * Math.SQRT1_2
    const y = 156 - dx
    return <Thick key={r} d={`M${100 - dx} ${y} A${r} ${r} 0 0 1 ${100 + dx} ${y}`} color={c} w={14} />
  }
  return (
    <g>
      {arc(86, C.violetSoft)}
      {arc(58, C.violet)}
      {arc(30, C.teal)}
      <circle cx="100" cy="156" r="12" fill={C.coral} />
    </g>
  )
})

const Cloud = make('ক্লাউড', () => (
  <g>
    <Union fill={C.violetPale}>
      <circle cx="62" cy="116" r="26" />
      <circle cx="104" cy="90" r="38" />
      <circle cx="144" cy="114" r="28" />
      <rect x="62" y="110" width="84" height="32" />
    </Union>
    <path d="M44 138 q20 10 60 8 q40 2 62-12" stroke={C.violetSoft} strokeWidth="6" />
    <path d="M78 76 q10-14 26-14" stroke={C.white} strokeWidth="6" />
  </g>
))

const Server = make('সার্ভার', () => (
  <g>
    {[0, 1, 2].map((i) => {
      const y = 28 + i * 46
      return (
        <g key={i}>
          <rect x="30" y={y} width="140" height="38" rx="12" fill={i === 1 ? C.violetSoft : C.violetPale} />
          <path d={`M46 ${y + 19} H98`} strokeWidth="5" stroke={C.violet} opacity="0.5" />
          <circle cx="132" cy={y + 19} r="5" fill={C.teal} />
          <circle cx="152" cy={y + 19} r="5" fill={i === 2 ? C.coral : C.sun} />
        </g>
      )
    })}
  </g>
))

const Link = make('লিংক', () => {
  const arcTop = 'M88 78 A22 22 0 0 1 110 100'
  const arcBot = 'M90 100 A22 22 0 0 0 112 122'
  return (
    <g transform="rotate(-30 100 100)">
      <Thick d="M34 100 A22 22 0 0 1 56 78 H88 A22 22 0 0 1 110 100 A22 22 0 0 1 88 122 H56 A22 22 0 0 1 34 100Z" color={C.violet} w={14} />
      <Thick d="M90 100 A22 22 0 0 1 112 78 H144 A22 22 0 0 1 166 100 A22 22 0 0 1 144 122 H112 A22 22 0 0 1 90 100Z" color={C.teal} w={14} />
      <Thick d={arcTop} color={C.violet} w={14} />
      <Thick d={arcBot} color={C.teal} w={14} />
    </g>
  )
})

const Browser = make('ব্রাউজার', () => (
  <g>
    <rect x="18" y="34" width="164" height="136" rx="16" fill={C.white} />
    <path d="M18 62 V50 a16 16 0 0 1 16-16 H166 a16 16 0 0 1 16 16 V62 Z" fill={C.violetSoft} />
    <path d="M30 62 V50 a8 8 0 0 1 8-8 H78 a8 8 0 0 1 8 8 V62 Z" fill={C.white} />
    <path d="M92 62 V52 a6 6 0 0 1 6-6 H128 a6 6 0 0 1 6 6 V62 Z" fill={C.violetPale} />
    <path d="M18 62 H182" />
    <rect x="30" y="70" width="140" height="20" rx="10" fill={C.violetPale} />
    <circle cx="44" cy="80" r="4" fill={C.teal} stroke="none" />
    <path d="M56 80 H110" strokeWidth="4" stroke={C.grey} />
    <rect x="30" y="100" width="62" height="54" rx="10" fill={C.tealSoft} />
    <circle cx="48" cy="116" r="6" fill={C.sun} />
    <path d="M30 148 l22-20 l16 14 l12-10 l12 14" stroke={C.teal} strokeWidth="3" />
    <path d="M104 106 H168 M104 122 H156 M104 138 H164" strokeWidth="5" stroke={C.grey} />
  </g>
))

const Tab = make('ট্যাব', () => (
  <g>
    <path d="M48 66 V56 a10 10 0 0 1 10-10 H100 a10 10 0 0 1 10 10 V66Z" fill={C.violetSoft} />
    <rect x="48" y="66" width="126" height="86" rx="12" fill={C.violetPale} />
    <path d="M22 74 V60 a12 12 0 0 1 12-12 H84 a12 12 0 0 1 12 12 V74Z" fill={C.coralPale} />
    <rect x="22" y="74" width="126" height="96" rx="14" fill={C.white} />
    <path d="M22 74 H96" stroke="none" />
    <circle cx="38" cy="62" r="6" fill={C.coral} />
    <path d="M70 56 l8 8 M78 56 l-8 8" strokeWidth="3" />
    <rect x="36" y="94" width="98" height="14" rx="7" fill={C.tealSoft} />
    <path d="M36 128 H120 M36 146 H96" strokeWidth="5" stroke={C.grey} />
    <path d="M148 62 H170" stroke="none" />
  </g>
))

const Tray = ({ color }: { color: string }) => (
  <path d="M28 126 H62 L70 138 H130 L138 126 H172 V156 a14 14 0 0 1 -14 14 H42 a14 14 0 0 1 -14 -14 Z" fill={color} />
)
const Download = make('ডাউনলোড', () => (
  <g>
    <path d="M86 24 h28 v48 h22 L100 118 L64 72 h22 z" fill={C.teal} />
    <path d="M92 30 v38" stroke={C.tealSoft} strokeWidth="4" />
    <Tray color={C.violetSoft} />
  </g>
))
const Upload = make('আপলোড', () => (
  <g>
    <path d="M86 118 h28 v-46 h22 L100 26 L64 72 h22 z" fill={C.coral} />
    <path d="M92 112 v-38" stroke={C.coralSoft} strokeWidth="4" />
    <Tray color={C.tealSoft} />
  </g>
))

const Envelope = make('ইমেইল', () => (
  <g>
    <rect x="22" y="48" width="156" height="108" rx="16" fill={C.white} />
    <path d="M26 148 L84 98 M174 148 L116 98" stroke={C.grey} strokeWidth="3" />
    <path d="M24 64 q0-16 16-16 H160 q16 0 16 16 L100 112 Z" fill={C.violetSoft} />
    <circle cx="100" cy="108" r="10" fill={C.coral} />
  </g>
))

const Inbox = make('ইনবক্স', () => (
  <g>
    <g transform="rotate(-10 70 90)">
      <rect x="40" y="38" width="64" height="48" rx="8" fill={C.white} />
      <path d="M42 44 L72 66 L102 44" stroke={C.violet} />
    </g>
    <g transform="rotate(8 130 86)">
      <rect x="96" y="30" width="64" height="48" rx="8" fill={C.coralPale} />
      <path d="M98 36 L128 58 L158 36" stroke={C.coral} />
    </g>
    <path d="M26 98 H62 L70 112 H130 L138 98 H174 V152 a16 16 0 0 1 -16 16 H42 a16 16 0 0 1 -16 -16 Z" fill={C.tealSoft} />
    <path d="M26 98 L40 74 H160 L174 98" stroke="none" />
    <circle cx="168" cy="38" r="14" fill={C.coral} />
    <path d="M168 31 v8" strokeWidth="3.5" stroke={C.white} />
    <circle cx="168" cy="45" r="1.5" fill={C.white} stroke={C.white} />
  </g>
))

const Paperclip = make('পেপারক্লিপ', () => (
  <g>
    <g transform="rotate(12 100 100)">
      <rect x="44" y="26" width="104" height="140" rx="12" fill={C.white} />
      <path d="M60 52 H132 M60 70 H132 M60 88 H112" strokeWidth="4" stroke={C.grey} />
    </g>
    <g transform="rotate(24 100 100)">
      <Thick d="M70 70 V136 a32 32 0 0 0 64 0 V58 a21 21 0 0 0 -42 0 V126 a10 10 0 0 0 20 0 V70" color={C.violet} w={9} />
    </g>
  </g>
))

const User = make('ব্যবহারকারী', () => {
  const id = useId()
  return (
    <g>
      <clipPath id={id}>
        <circle cx="100" cy="100" r="72" />
      </clipPath>
      <circle cx="100" cy="100" r="72" fill={C.tealPale} stroke="none" />
      <g clipPath={`url(#${id})`}>
        <path d="M34 176 C34 134 66 124 100 124 C134 124 166 134 166 176 Z" fill={C.violet} />
        <path d="M86 126 L100 144 L114 126" fill={C.violetPale} />
        <rect x="90" y="104" width="20" height="26" rx="8" fill={C.skinDark} />
        <circle cx="100" cy="84" r="30" fill={C.skin} />
        <path d="M70 84 C66 54 88 48 102 50 C124 50 134 66 130 86 C120 80 112 72 108 66 C100 76 84 82 70 84Z" fill={C.hair} />
        <path d="M91 94 h0.1 M109 94 h0.1" strokeWidth="6" />
        <path d="M92 104 Q100 111 108 104" strokeWidth="3" />
      </g>
      <circle cx="100" cy="100" r="72" />
    </g>
  )
})

const IdCard = make('পরিচয়পত্র', () => (
  <g>
    <rect x="20" y="46" width="160" height="108" rx="16" fill={C.white} />
    <path d="M20 62 a16 16 0 0 1 16-16 H164 a16 16 0 0 1 16 16 V72 H20Z" fill={C.violet} />
    <circle cx="36" cy="59" r="4" fill={C.sun} stroke="none" />
    <rect x="34" y="86" width="48" height="54" rx="10" fill={C.tealPale} />
    <circle cx="58" cy="106" r="10" fill={C.skin} />
    <path d="M40 140 q0-18 18-18 q18 0 18 18" fill={C.violetSoft} />
    <path d="M96 94 H164 M96 110 H150 M96 126 H138" strokeWidth="5" stroke={C.grey} />
    <circle cx="160" cy="132" r="8" fill={C.coral} />
  </g>
))

const Lock = make('তালা', () => (
  <g>
    <Thick d="M70 96 V70 a30 30 0 0 1 60 0 V96" color={C.greyPale} w={14} />
    <rect x="44" y="92" width="112" height="80" rx="20" fill={C.sun} />
    <path d="M56 106 q4-6 14-6" stroke={C.sunPale} strokeWidth="5" />
    <circle cx="100" cy="124" r="11" fill={C.ink} />
    <path d="M100 128 v20" strokeWidth="9" />
  </g>
))

const Key = make('চাবি', () => (
  <g transform="rotate(-38 100 100)">
    <rect x="86" y="92" width="86" height="16" rx="8" fill={C.sun} />
    <rect x="144" y="106" width="12" height="20" rx="4" fill={C.sun} />
    <rect x="160" y="106" width="12" height="28" rx="4" fill={C.sun} />
    <circle cx="62" cy="100" r="34" fill={C.sun} />
    <circle cx="56" cy="100" r="12" fill={C.paper} />
    <path d="M44 78 q10-10 24-8" stroke={C.sunPale} strokeWidth="5" />
  </g>
))

const Shield = make('সুরক্ষা', () => (
  <g>
    <Rd d="M100 36 L158 54 V98 C158 132 132 150 100 164 C68 150 42 132 42 98 V54 Z" fill={C.teal} w={14} />
    <path d="M56 66 V94" stroke={C.tealSoft} strokeWidth="5" />
    <Thick d="M70 100 l22 22 l40-44" color={C.white} w={12} />
  </g>
))

const Warning = make('সতর্কতা', () => (
  <g>
    <Rd d="M100 44 L164 152 H36 Z" fill={C.sun} w={16} />
    <rect x="93" y="80" width="14" height="40" rx="7" fill={C.ink} />
    <circle cx="100" cy="136" r="8" fill={C.ink} />
  </g>
))

const FishingHook = make('ফিশিং', () => (
  <g>
    <path d="M14 172 q20-8 40 0 t40 0 t40 0 t40 0" stroke={C.tealSoft} strokeWidth="5" />
    <path d="M158 14 V112" />
    <path d="M38 124 L16 102 V146 Z" fill={C.coral} />
    <rect x="34" y="96" width="74" height="52" rx="12" fill={C.white} />
    <path d="M36 102 L71 126 L106 102" fill={C.violetSoft} />
    <circle cx="96" cy="136" r="4.5" fill={C.ink} stroke="none" />
    <Thick d="M158 108 V114 a32 32 0 0 1 -64 0 l4 -16" color={C.grey} w={7} />
  </g>
))

const Sms = make('এসএমএস', () => (
  <g>
    <rect x="46" y="16" width="86" height="168" rx="18" fill={C.violetPale} />
    <rect x="54" y="30" width="70" height="136" rx="8" fill={C.white} />
    <path d="M80 23 H100" strokeWidth="4" />
    <rect x="60" y="48" width="44" height="26" rx="10" fill={C.greyPale} />
    <path d="M68 58 H94 M68 66 H86" strokeWidth="3" stroke={C.grey} />
    <path d="M92 118 h24 a8 8 0 0 0 8-8 v-12 a8 8 0 0 0 -8-8 h-24 a8 8 0 0 0 -8 8 v12 a8 8 0 0 0 8 8Z" stroke="none" />
    <rect x="76" y="86" width="48" height="30" rx="12" fill={C.teal} />
    <circle cx="88" cy="101" r="3" fill={C.white} stroke="none" />
    <circle cx="100" cy="101" r="3" fill={C.white} stroke="none" />
    <circle cx="112" cy="101" r="3" fill={C.white} stroke="none" />
    <circle cx="150" cy="44" r="22" fill={C.coral} />
    <rect x="138" y="36" width="24" height="16" rx="4" fill={C.white} stroke="none" />
    <path d="M138 38 L150 48 L162 38" stroke={C.coral} strokeWidth="2.5" />
  </g>
))

const OtpCode = make('ওটিপি', () => {
  const oct = Array.from({ length: 8 }, (_, i) => polar(142, 140, 36, 22.5 + i * 45).map((n) => n.toFixed(1)).join(' ')).join(' L')
  return (
    <g>
      <rect x="28" y="16" width="84" height="168" rx="18" fill={C.violetPale} />
      <rect x="36" y="30" width="68" height="136" rx="8" fill={C.white} />
      <path d="M60 23 H80" strokeWidth="4" />
      <rect x="42" y="56" width="56" height="12" rx="6" fill={C.greyPale} stroke="none" />
      <rect x="40" y="82" width="60" height="26" rx="10" fill={C.violetPale} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={48 + i * 9} cy="95" r="3.2" fill={C.violet} stroke="none" />
      ))}
      <Rd d={`M${oct}Z`} fill={C.coral} w={6} />
      <g fill={C.white} stroke="none">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={129 + i * 6.2} y={124 - (i === 1 || i === 2 ? 4 : 0)} width="5" height="20" rx="2.5" />
        ))}
        <rect x="129" y="138" width="24.6" height="16" rx="8" />
        <rect x="120" y="140" width="14" height="6" rx="3" transform="rotate(35 126 143)" />
      </g>
    </g>
  )
})

const Wallet = make('ওয়ালেট', () => (
  <g>
    <circle cx="70" cy="52" r="24" fill={C.sun} />
    <path d="M60 46 q4-6 12-6" stroke={C.sunPale} strokeWidth="4" />
    <rect x="22" y="58" width="156" height="112" rx="22" fill={C.violet} />
    <path d="M22 84 H178" stroke={C.violetSoft} strokeWidth="4" />
    <rect x="124" y="98" width="62" height="44" rx="16" fill={C.violetPale} />
    <circle cx="146" cy="120" r="13" fill={C.white} />
    <text x="146" y="127" textAnchor="middle" fontSize="19" fontWeight="700" fill={C.violet} stroke="none" fontFamily="'Noto Sans Bengali', system-ui, sans-serif">৳</text>
  </g>
))

const Bank = make('ব্যাংক', () => (
  <g>
    <path d="M100 22 L172 66 H28 Z" fill={C.violet} />
    <circle cx="100" cy="50" r="9" fill={C.sun} />
    <rect x="30" y="66" width="140" height="12" rx="3" fill={C.violetSoft} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={40 + i * 34} y="82" width="20" height="62" rx="5" fill={C.violetPale} />
    ))}
    <rect x="26" y="144" width="148" height="12" rx="4" fill={C.violetSoft} />
    <rect x="16" y="156" width="168" height="16" rx="5" fill={C.violet} />
  </g>
))

const GRID = ['FFF.#.FFF', 'FFF#..FFF', 'FFF.##FFF', '#.##.#.##', '.#..#.#..', '##.#.##.#', 'FFF..#.#.', 'FFF#.##.#', 'FFF.#..##']
const QrCode = make('কিউআর কোড', () => {
  const s = 11
  const o = 50
  const finder = (x: number, y: number) => (
    <g key={`${x}${y}`}>
      <rect x={x} y={y} width={s * 3} height={s * 3} rx="6" fill={C.violet} />
      <rect x={x + 6} y={y + 6} width={s * 3 - 12} height={s * 3 - 12} rx="3" fill={C.white} stroke="none" />
      <rect x={x + 11} y={y + 11} width={s} height={s} rx="2" fill={C.coral} stroke="none" />
    </g>
  )
  return (
    <g>
      <rect x="22" y="22" width="156" height="156" rx="24" fill={C.white} />
      {finder(o, o)}
      {finder(o + s * 6, o)}
      {finder(o, o + s * 6)}
      {GRID.flatMap((row, r) =>
        [...row].map((ch, c) =>
          ch === '#' ? <rect key={`${r}-${c}`} x={o + c * s + 1} y={o + r * s + 1} width={s - 2} height={s - 2} rx="2" fill={C.ink} stroke="none" /> : null,
        ),
      )}
    </g>
  )
})

const ChatBubble = make('চ্যাট', () => (
  <g>
    <path d="M96 52 h66 a16 16 0 0 1 16 16 v30 a16 16 0 0 1 -16 16 h-6 v24 l-24 -24 h-36 a16 16 0 0 1 -16 -16 v-30 a16 16 0 0 1 16 -16Z" fill={C.tealSoft} />
    <path d="M52 30 h70 a22 22 0 0 1 22 22 v34 a22 22 0 0 1 -22 22 h-34 l-30 26 v-26 h-6 a22 22 0 0 1 -22 -22 v-34 a22 22 0 0 1 22 -22Z" fill={C.violet} transform="translate(-6 16)" />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={52 + i * 22} cy="88" r="6" fill={C.white} stroke="none" />
    ))}
  </g>
))

const SocialFeed = make('সোশ্যাল ফিড', () => (
  <g>
    <rect x="44" y="14" width="112" height="172" rx="20" fill={C.violetPale} />
    <rect x="52" y="28" width="96" height="144" rx="8" fill={C.white} />
    <circle cx="66" cy="44" r="8" fill={C.coralSoft} />
    <path d="M80 41 H122 M80 49 H108" strokeWidth="3" stroke={C.grey} />
    <rect x="56" y="58" width="88" height="62" rx="8" fill={C.tealSoft} />
    <circle cx="76" cy="76" r="8" fill={C.sun} />
    <path d="M56 114 l26 -24 l18 16 l14 -12 l30 26" stroke={C.teal} />
    <path d="M70 142 c-10 -7 -12 -15 -6 -19 c4 -2 6 0 6 3 c0 -3 2 -5 6 -3 c6 4 4 12 -6 19Z" fill={C.coral} />
    <path d="M96 128 h24 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-12 l-6 6 v-6 h-6 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4Z" fill={C.white} />
    <path d="M60 158 H130" strokeWidth="3" stroke={C.grey} />
    <path d="M168 76 c-12 -8 -14 -18 -7 -22 c5 -2 7 1 7 4 c0 -3 2 -6 7 -4 c7 4 5 14 -7 22Z" fill={C.coral} transform="translate(0 -20)" />
    <path d="M34 112 c-8 -5 -9 -12 -5 -15 c3 -1 5 1 5 3 c0 -2 2 -4 5 -3 c4 3 3 10 -5 15Z" fill={C.coralSoft} strokeWidth="2.5" />
  </g>
))

const VideoPlay = make('ভিডিও', () => (
  <g>
    <rect x="18" y="38" width="164" height="124" rx="20" fill={C.violet} />
    <path d="M30 54 q10-8 24-8" stroke={C.violetSoft} strokeWidth="5" />
    <circle cx="100" cy="92" r="30" fill={C.coral} />
    <path d="M91 76 L120 92 L91 108Z" fill={C.white} stroke={C.white} strokeWidth="6" />
    <path d="M36 140 H164" stroke={C.violetSoft} strokeWidth="6" />
    <path d="M36 140 H98" stroke={C.sun} strokeWidth="6" />
    <circle cx="98" cy="140" r="7" fill={C.white} />
  </g>
))

export const INTERNET_ART: Partial<Record<ArtName, ArtComponent>> = {
  globe: Globe, wifi: Wifi, cloud: Cloud, server: Server, link: Link, browser: Browser, tab: Tab, download: Download, upload: Upload,
  envelope: Envelope, inbox: Inbox, paperclip: Paperclip, user: User, 'id-card': IdCard, lock: Lock, key: Key, shield: Shield, warning: Warning,
  'fishing-hook': FishingHook, sms: Sms, 'otp-code': OtpCode, wallet: Wallet, bank: Bank, 'qr-code': QrCode, 'chat-bubble': ChatBubble,
  'social-feed': SocialFeed, 'video-play': VideoPlay,
}
