import type { ArtName } from '../../names'
import type { ArtComponent } from '../../types'
import { C, make, Thick, Rd, Sparkle, starPath } from './kit'

const Trophy = make('ট্রফি', () => (
  <g>
    <Thick d="M62 52 H44 q-4 36 28 48 M138 52 H156 q4 36 -28 48" color={C.sun} w={9} />
    <rect x="86" y="118" width="28" height="30" fill={C.sunPale} />
    <path d="M58 30 H142 V72 a42 42 0 0 1 -84 0Z" fill={C.sun} />
    <path d="M70 40 V70 q2 14 12 22" stroke={C.sunPale} strokeWidth="6" />
    <path d={starPath(100, 66, 15, 7)} fill={C.white} strokeWidth="2.5" />
    <rect x="62" y="146" width="76" height="26" rx="8" fill={C.violet} />
    <rect x="76" y="156" width="48" height="6" rx="3" fill={C.violetSoft} stroke="none" />
  </g>
))

const Star = make('তারা', () => (
  <g>
    <Rd d={starPath(100, 108, 76, 36)} fill={C.sun} w={12} />
    <path d="M100 58 L110 90" stroke={C.sunPale} strokeWidth="5" />
    <Sparkle x={32} y={44} r={11} fill={C.violetSoft} />
    <Sparkle x={170} y={40} r={8} fill={C.coralSoft} />
  </g>
))

const Medal = make('পদক', () => (
  <g>
    <path d="M142 14 H106 L74 90 H110Z" fill={C.coral} />
    <path d="M58 14 H94 L126 90 H90Z" fill={C.violet} />
    <circle cx="100" cy="126" r="46" fill={C.sun} />
    <circle cx="100" cy="126" r="34" fill={C.sunPale} />
    <path d={starPath(100, 126, 22, 10)} fill={C.sun} strokeWidth="2.5" />
    <path d="M70 108 q6 -12 20 -16" stroke={C.white} strokeWidth="5" />
  </g>
))

const Confetti = make('উদযাপন', () => (
  <g>
    <path d="M110 92 Q120 52 168 56 M104 98 Q142 80 176 100 M96 106 Q92 66 62 40" stroke={C.violetSoft} strokeWidth="3.5" />
    <rect x="132" y="26" width="12" height="7" rx="2" fill={C.coral} transform="rotate(30 138 30)" />
    <rect x="164" y="38" width="12" height="7" rx="2" fill={C.teal} transform="rotate(-20 170 42)" />
    <rect x="76" y="22" width="12" height="7" rx="2" fill={C.sun} transform="rotate(-30 82 26)" />
    <rect x="164" y="76" width="12" height="7" rx="2" fill={C.violet} transform="rotate(40 170 80)" />
    <circle cx="112" cy="40" r="5" fill={C.violetSoft} />
    <circle cx="150" cy="104" r="5" fill={C.coral} />
    <circle cx="50" cy="52" r="5" fill={C.teal} />
    <Sparkle x={40} y={90} r={10} fill={C.sun} />
    <Sparkle x={176} y={140} r={9} fill={C.violetSoft} />
    <path d="M26 176 L116 116 L84 84Z" fill={C.coral} />
    <path d="M50 133 L62 150 M66 121 L84 139" stroke={C.sun} strokeWidth="5" />
    <ellipse cx="100" cy="100" rx="24" ry="8" fill={C.sunPale} transform="rotate(45 100 100)" />
    <ellipse cx="100" cy="100" rx="14" ry="3.5" fill={C.violet} transform="rotate(45 100 100)" stroke="none" />
  </g>
))

const Flame = make('স্ট্রিক', () => (
  <g>
    <path d="M100 18 C108 54 152 70 152 120 C152 152 130 178 100 178 C70 178 48 152 48 120 C48 94 64 82 72 62 C80 80 86 84 92 82 C86 62 92 40 100 18Z" fill={C.coral} />
    <path d="M100 72 C106 98 132 106 132 136 C132 158 118 170 100 170 C82 170 68 158 68 136 C68 110 92 100 100 72Z" fill={C.sun} />
    <path d="M100 118 C104 134 116 138 116 150 C116 160 108 166 100 166 C92 166 84 160 84 150 C84 138 96 134 100 118Z" fill={C.sunPale} />
    <path d="M70 96 q-6 14 -2 26" stroke={C.coralSoft} strokeWidth="5" />
  </g>
))

const Heart = make('হৃদয়', () => (
  <g>
    <path d="M100 168 C40 124 24 90 42 62 C58 38 90 42 100 68 C110 42 142 38 158 62 C176 90 160 124 100 168Z" fill={C.coral} />
    <path d="M50 76 q4 -14 20 -16" stroke={C.coralPale} strokeWidth="6" />
    <Sparkle x={166} y={32} r={11} fill={C.sun} />
    <Sparkle x={32} y={150} r={8} fill={C.violetSoft} />
  </g>
))

const ThumbsUp = make('ভালো', () => (
  <g>
    <rect x="18" y="92" width="38" height="78" rx="10" fill={C.violet} />
    <path d="M62 98 L88 52 q6 -14 20 -8 q14 6 8 22 L112 88 H154 q18 0 16 18 L162 150 q-3 20 -22 20 H62Z" fill={C.sun} />
    <path d="M118 112 H152 M114 132 H146 M110 150 H138" stroke={C.skinDark} strokeWidth="3" />
    <path d="M78 76 L92 58" stroke={C.sunPale} strokeWidth="5" />
    <circle cx="37" cy="152" r="5" fill={C.violetSoft} stroke="none" />
  </g>
))

const Sparkles = make('ঝলমল', () => (
  <g>
    <Sparkle x={104} y={102} r={62} fill={C.sun} sw={3} />
    <Sparkle x={42} y={48} r={26} fill={C.violetSoft} />
    <Sparkle x={160} y={160} r={22} fill={C.tealSoft} />
    <circle cx="160" cy="44" r="7" fill={C.coral} />
    <circle cx="38" cy="150" r="5" fill={C.coralSoft} />
  </g>
))

const Target = make('লক্ষ্য', () => (
  <g>
    <circle cx="92" cy="108" r="68" fill={C.coral} />
    <circle cx="92" cy="108" r="48" fill={C.white} />
    <circle cx="92" cy="108" r="30" fill={C.coral} />
    <circle cx="92" cy="108" r="12" fill={C.sun} />
    <Thick d="M92 108 L164 36" color={C.greyPale} w={6} />
    <path d="M146 54 L154 26 L172 44Z" fill={C.teal} />
    <path d="M146 54 L178 52 L172 44Z" fill={C.tealSoft} />
  </g>
))

const Crown = make('মুকুট', () => (
  <g>
    <Rd d="M38 138 L30 68 L70 98 L100 54 L130 98 L170 68 L162 138Z" fill={C.sun} w={8} />
    <path d="M46 112 L42 84" stroke={C.sunPale} strokeWidth="5" />
    <circle cx="30" cy="60" r="8" fill={C.coral} />
    <circle cx="100" cy="46" r="8" fill={C.coral} />
    <circle cx="170" cy="60" r="8" fill={C.coral} />
    <rect x="34" y="138" width="132" height="28" rx="10" fill={C.violet} />
    <circle cx="64" cy="152" r="6" fill={C.sunPale} />
    <circle cx="100" cy="152" r="6" fill={C.tealSoft} />
    <circle cx="136" cy="152" r="6" fill={C.coralSoft} />
  </g>
))

const Gift = make('উপহার', () => (
  <g>
    <path d="M100 66 C70 70 52 40 72 32 C92 26 100 52 100 66Z" fill={C.coral} />
    <path d="M100 66 C130 70 148 40 128 32 C108 26 100 52 100 66Z" fill={C.coral} />
    <rect x="32" y="92" width="136" height="80" rx="12" fill={C.violet} />
    <rect x="24" y="68" width="152" height="30" rx="10" fill={C.violetSoft} />
    <rect x="86" y="68" width="28" height="104" fill={C.coral} />
    <circle cx="100" cy="66" r="9" fill={C.coralSoft} />
    <path d="M44 112 V150" stroke={C.violetSoft} strokeWidth="5" />
  </g>
))

const Flag = make('পতাকা', () => (
  <g>
    <ellipse cx="62" cy="172" rx="44" ry="10" fill={C.tealSoft} />
    <path d="M62 30 V172" strokeWidth="5" />
    <circle cx="62" cy="26" r="7" fill={C.sun} />
    <path d="M66 38 C90 26 112 52 150 38 C158 36 168 40 168 40 L148 66 L168 94 C132 108 96 82 66 98Z" fill={C.coral} />
    <path d="M78 52 q16 -4 28 4" stroke={C.coralPale} strokeWidth="5" />
  </g>
))

export const REWARDS_ART: Partial<Record<ArtName, ArtComponent>> = {
  trophy: Trophy, star: Star, medal: Medal, confetti: Confetti, flame: Flame, heart: Heart, 'thumbs-up': ThumbsUp,
  sparkles: Sparkles, target: Target, crown: Crown, gift: Gift, flag: Flag,
}
