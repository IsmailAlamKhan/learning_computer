import type { ReactNode } from 'react'
import type { ArtName } from '../../names'
import type { ArtComponent } from '../../types'
import { C, make, Thick, Sparkle } from './kit'

type Pose = 'neutral' | 'wave' | 'think' | 'cheer' | 'point'

/** Raised open hand (fingers up). */
const OpenHand = ({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    {[-9, -3, 3, 9].map((dx, i) => (
      <Thick key={i} d={`M${x + dx} ${y - 6} V${y - 19 - (i === 1 || i === 2 ? 3 : 0)}`} color={C.skin} w={5} />
    ))}
    <Thick d={`M${x - 11} ${y + 2} L${x - 20} ${y - 6}`} color={C.skin} w={5} />
    <circle cx={x} cy={y} r="13" fill={C.skin} />
  </g>
)
const Fist = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r="13" fill={C.skin} />
    <path d={`M${x - 8} ${y - 3} h16 M${x - 8} ${y + 4} h16`} strokeWidth="2" stroke={C.skinDark} />
  </g>
)

const Figure = ({ pose }: { pose: Pose }) => {
  const look = pose === 'point' ? 3 : 0
  const open = pose === 'cheer' || pose === 'wave'
  const tf =
    pose === 'neutral' ? undefined
    : pose === 'wave' ? 'translate(-20 12) scale(0.9)'
    : pose === 'think' ? 'translate(-14 10) scale(0.9)'
    : pose === 'cheer' ? 'translate(0 18) scale(0.8)'
    : 'translate(-22 10) scale(0.9)'

  let arms: ReactNode = null
  let hands: ReactNode = null
  if (pose === 'wave') {
    arms = <Thick d="M142 176 Q184 172 182 112" color={C.violet} w={22} />
    hands = <OpenHand x={182} y={92} rot={8} />
  } else if (pose === 'think') {
    arms = <Thick d="M152 190 Q170 130 122 130" color={C.violet} w={22} />
    hands = (
      <g>
        <circle cx="118" cy="128" r="12" fill={C.skin} />
        <Thick d="M112 118 L124 108" color={C.skin} w={5} />
      </g>
    )
  } else if (pose === 'cheer') {
    arms = (
      <g>
        <Thick d="M62 156 Q14 150 24 82" color={C.violet} w={22} />
        <Thick d="M138 156 Q186 150 176 82" color={C.violet} w={22} />
      </g>
    )
    hands = (
      <g>
        <Fist x={24} y={66} />
        <Fist x={176} y={66} />
      </g>
    )
  } else if (pose === 'point') {
    arms = <Thick d="M144 164 Q176 160 204 178" color={C.violet} w={22} />
    hands = (
      <g>
        <Thick d="M208 180 L228 192" color={C.skin} w={7} />
        <circle cx="206" cy="180" r="12" fill={C.skin} />
        <path d="M200 172 q6 -3 10 0" stroke={C.skinDark} strokeWidth="2" />
      </g>
    )
  }

  return (
    <g transform={tf}>
      {/* ponytail + back hair */}
      <path d="M128 52 C172 40 190 84 170 122 C166 132 162 142 156 152 C152 128 148 112 142 100 Z" fill={C.hair} />
      <path d="M62 96 C54 50 82 32 106 34 C140 34 152 66 144 100 L142 118 L62 118Z" fill={C.hair} />
      {/* body */}
      <path d="M36 190 C36 156 62 146 100 146 C138 146 164 156 164 190Z" fill={C.violet} />
      <path d="M62 160 q4 -8 14 -10" stroke={C.violetSoft} strokeWidth="4" />
      <rect x="90" y="124" width="20" height="28" rx="8" fill={C.skinDark} />
      <path d="M84 148 L100 166 L116 148" fill={C.violetPale} />
      {arms}
      {/* head */}
      <ellipse cx="100" cy="92" rx="40" ry="44" fill={C.skin} />
      <path d="M60 94 C54 52 80 40 104 40 C132 40 148 62 140 94 C128 86 120 74 114 64 C106 78 82 90 60 94Z" fill={C.hair} />
      <path d="M72 62 q10 -14 28 -16" stroke={C.violetSoft} strokeWidth="3" opacity="0.5" />
      <circle cx="132" cy="56" r="6" fill={C.coral} />
      <circle cx="58" cy="108" r="4" fill={C.sun} />
      {/* face */}
      <ellipse cx={84 + look} cy="100" rx="4.5" ry="5.5" fill={C.ink} stroke="none" />
      <ellipse cx={116 + look} cy="100" rx="4.5" ry="5.5" fill={C.ink} stroke="none" />
      <circle cx={85.5 + look} cy="98" r="1.6" fill={C.white} stroke="none" />
      <circle cx={117.5 + look} cy="98" r="1.6" fill={C.white} stroke="none" />
      <path d="M76 88 q8 -5 16 -1 M108 87 q8 -4 16 1" strokeWidth="2.5" />
      <circle cx="74" cy="114" r="6" fill={C.coralSoft} stroke="none" opacity="0.8" />
      <circle cx="126" cy="114" r="6" fill={C.coralSoft} stroke="none" opacity="0.8" />
      {open ? (
        <path d="M88 112 Q100 128 112 112 Z" fill={C.coral} strokeWidth="2.5" />
      ) : pose === 'think' ? (
        <path d="M92 118 Q100 121 106 116" strokeWidth="2.5" />
      ) : (
        <path d="M90 113 Q100 124 110 113" strokeWidth="2.5" />
      )}
      {hands}
    </g>
  )
}

const mk = (label: string, pose: Pose, extra?: ReactNode) => make(label, () => (
  <g>
    <Figure pose={pose} />
    {extra}
  </g>
))

const Didi = mk('দিদি', 'neutral')
const DidiWave = mk('দিদি হাত নাড়ছেন', 'wave', (
  <g>
    <path d="M168 40 q10 8 6 20 M178 34 q16 12 10 32" stroke={C.violetSoft} strokeWidth="3.5" />
  </g>
))
const DidiThink = mk('দিদি ভাবছেন', 'think', (
  <g>
    <circle cx="150" cy="58" r="3.5" fill={C.white} />
    <circle cx="158" cy="46" r="5" fill={C.white} />
    <ellipse cx="170" cy="28" rx="22" ry="17" fill={C.white} />
    <text x="170" y="36" textAnchor="middle" fontSize="24" fontWeight="800" fill={C.violet} stroke="none" fontFamily="system-ui, sans-serif">?</text>
  </g>
))
const DidiCheer = mk('দিদি উল্লাস করছেন', 'cheer', (
  <g>
    <Sparkle x={100} y={22} r={12} fill={C.sun} />
    <Sparkle x={62} y={34} r={8} fill={C.coralSoft} />
    <Sparkle x={140} y={36} r={8} fill={C.tealSoft} />
    <circle cx="14" cy="40" r="4" fill={C.violetSoft} stroke="none" />
    <circle cx="186" cy="40" r="4" fill={C.coral} stroke="none" />
  </g>
))
const DidiPoint = mk('দিদি দেখাচ্ছেন', 'point')

export const DIDI_ART: Partial<Record<ArtName, ArtComponent>> = {
  didi: Didi, 'didi-wave': DidiWave, 'didi-think': DidiThink, 'didi-cheer': DidiCheer, 'didi-point': DidiPoint,
}
