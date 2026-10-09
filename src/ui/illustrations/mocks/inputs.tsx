import type { OsFlavor } from '../../../engine/types'
import { DocIcon, FolderIcon, G, MONO, Rc, T, defineMock, type Box } from './kit'

/* ---------------------------------------------------------------- keyboard ---------------------------------------------------------------- */
interface Key { id?: string; label: string; x: number; y: number; w: number; h: number }
const KH = 30
function layout(os: OsFlavor): Key[] {
  const mac = os === 'mac'
  const keys: Key[] = []
  const row = (y: number, defs: [string, number, string?][]) => {
    let x = 10
    for (const [label, w, id] of defs) {
      keys.push({ id, label, x, y, w, h: KH })
      x += w + 4
    }
  }
  const letters = (s: string): [string, number][] => [...s].map((c) => [c, 30])
  const y0 = 52
  row(y0, [[ 'Esc', 42, 'esc'], ...letters('1234567890'), [mac ? 'delete' : 'Backspace', 70, 'backspace']])
  row(y0 + 34, [['Tab', 52, 'tab'], ...letters('QWERTYUIOP'), ['\\', 60]])
  row(y0 + 68, [['Caps', 62], ...letters('ASDFGHJKL'), [mac ? 'return' : 'Enter', 84, 'enter']])
  row(y0 + 102, [[mac ? '⇧ shift' : 'Shift', 80, 'shift'], ...letters('ZXCVBNM'), [',', 30], ['.', 30], [mac ? '⇧ shift' : 'Shift', 62]])
  const r5 = y0 + 136
  const bottom: [string, number, string?][] = mac
    ? [['control', 46, 'ctrl'], ['⌥ option', 46, 'alt'], ['⌘ cmd', 46, 'cmd'], ['', 108], ['⌘ cmd', 38], ['⌥', 38]]
    : [['Ctrl', 46, 'ctrl'], ['⊞ Win', 46, 'cmd'], ['Alt', 46, 'alt'], ['', 108], ['Alt', 38], ['Ctrl', 38]]
  row(r5, bottom)
  // arrow cluster
  const ax = 10 + bottom.reduce((s, [, w]) => s + w + 4, 0) + 6
  keys.push({ id: 'arrows-l', label: '◀', x: ax, y: r5, w: 28, h: KH })
  keys.push({ id: 'arrows-u', label: '▲', x: ax + 32, y: r5, w: 28, h: 13 })
  keys.push({ id: 'arrows-d', label: '▼', x: ax + 32, y: r5 + 17, w: 28, h: 13 })
  keys.push({ id: 'arrows-r', label: '▶', x: ax + 64, y: r5, w: 28, h: KH })
  return keys
}
export const keyboardKeys = defineMock('keyboard-keys', {
  titleBn: 'কিবোর্ডের গুরুত্বপূর্ণ কি: Ctrl, Cmd, Alt, Shift, Tab, Enter, Esc, Backspace ও তীর চিহ্ন',
  regions: (os) => {
    const ks = layout(os)
    const one = (id: string, bn: string): Box => {
      const k = ks.find((q) => q.id === id)!
      return { x: k.x, y: k.y, w: k.w, h: k.h, r: 6, bn }
    }
    const l = ks.find((q) => q.id === 'arrows-l')!
    return {
      ctrl: one('ctrl', os === 'mac' ? 'Control কি' : 'Ctrl কি'),
      cmd: one('cmd', os === 'mac' ? 'Command (⌘) কি' : 'Windows কি'),
      alt: one('alt', os === 'mac' ? 'Option (⌥) কি' : 'Alt কি'),
      shift: one('shift', 'Shift কি'),
      tab: one('tab', 'Tab কি'),
      enter: one('enter', os === 'mac' ? 'Return (Enter) কি' : 'Enter কি'),
      esc: one('esc', 'Esc কি'),
      backspace: one('backspace', os === 'mac' ? 'Delete (মোছার) কি' : 'Backspace কি'),
      arrows: { x: l.x, y: l.y, w: 92, h: KH, r: 6, bn: 'চার তীর চিহ্নের কি' },
    }
  },
  draw: (os) => (
    <g>
      <rect width={480} height={300} fill="#ece9f7" />
      <Rc x={4} y={42} w={472} h={186} r={14} f="#d9d4ee" />
      {layout(os).map((k, i) => (
        <g key={i}>
          <Rc x={k.x} y={k.y + 1.5} w={k.w} h={k.h} r={5} f="#b9b3d6" />
          <Rc x={k.x} y={k.y} w={k.w} h={k.h} r={5} f="#fff" s="#c4bfe0" />
          <T x={k.x + k.w / 2} y={k.y + k.h / 2 + 3.5} s={k.label.length > 5 ? 8.5 : k.label.length > 1 ? 9.5 : 11} a="middle" w={600} c={k.label === '' ? '#fff' : '#1e1b3a'}>{k.label}</T>
        </g>
      ))}
      <T x={240} y={262} s={11} a="middle" c={G.muted}>{os === 'mac' ? 'Mac keyboard — bottom-left corner' : 'Windows keyboard — bottom-left corner'}</T>
    </g>
  ),
})

/* ---------------------------------------------------------------- url bar ---------------------------------------------------------------- */
const CW = 9.4
const UGAP = 10
const U0 = (480 - (28 * CW + 2 * UGAP)) / 2
const UP = 8 * CW, UD = 15 * CW, UH = 5 * CW
export const urlBar = defineMock('url-bar', {
  titleBn: 'ওয়েব ঠিকানা: https:// (প্রটোকল), www.example.com (ডোমেইন), /page (পাথ)',
  regions: () => ({
    protocol: { x: U0 - 6, y: 104, w: UP + 12, h: 92, r: 8, bn: 'প্রটোকল (https://)' },
    domain: { x: U0 + UP + UGAP - 6, y: 104, w: UD + 12, h: 92, r: 8, bn: 'ডোমেইন (ওয়েবসাইটের নাম)' },
    path: { x: U0 + UP + UD + 2 * UGAP - 6, y: 104, w: UH + 12, h: 92, r: 8, bn: 'পাথ (কোন পেজ)' },
  }),
  draw: () => {
    const parts = [
      { t: 'https://', w: UP, c: G.teal, bg: '#d6f3ee', lab: 'protocol', sub: 'how to connect' },
      { t: 'www.example.com', w: UD, c: G.violet, bg: '#ede9fe', lab: 'domain', sub: 'the website' },
      { t: '/page', w: UH, c: '#b45309', bg: '#fff1c2', lab: 'path', sub: 'which page' },
    ]
    let x = U0
    return (
      <g>
        <rect width={480} height={300} fill="#eef0f7" />
        <path d="M0 0H480V34H0Z" fill="#e3e5ee" />
        <path d="M14 8h120a8 8 0 0 1 8 8v18H6V16a8 8 0 0 1 8-8z" fill="#fff" transform="translate(6 0)" />
        <T x={28} y={26} s={10.5} w={600}>Example</T>
        <Rc x={0} y={34} w={480} h={46} r={0} f="#fff" />
        <Rc x={14} y={42} w={452} h={30} r={15} f="#eef0f6" />
        <g transform="translate(24 50)"><rect y="6" width="12" height="9" rx="2.2" fill={G.ok} /><path d="M2.5 6V4.5a3.5 3.5 0 0 1 7 0V6" fill="none" stroke={G.ok} strokeWidth="1.8" /></g>
        <T x={46} y={62} s={12} c={G.muted}>https://www.example.com/page</T>
        <T x={240} y={96} s={9.5} a="middle" c={G.muted}>The address bar, zoomed in ↓</T>
        {parts.map((p) => {
          const bx = x
          x += p.w + UGAP
          return (
            <g key={p.lab}>
              <Rc x={bx - 4} y={108} w={p.w + 8} h={36} r={8} f={p.bg} s={p.c} sw={1.4} />
              <text x={bx} y={132} fontSize={15.5} fontFamily={MONO} fill={p.c} fontWeight={700} textLength={p.w} lengthAdjust="spacingAndGlyphs">{p.t}</text>
              <path d={`M${bx - 2} 154v6h${p.w + 4}v-6`} fill="none" stroke={p.c} strokeWidth={1.8} strokeLinecap="round" />
              <T x={bx + p.w / 2} y={178} s={12.5} w={700} c={p.c} a="middle">{p.lab}</T>
              <T x={bx + p.w / 2} y={192} s={9.5} c={G.muted} a="middle">{p.sub}</T>
            </g>
          )
        })}
        <Rc x={62} y={226} w={356} h={52} r={8} f="#fff" s="#dfe2ea" />
        <rect x={76} y={238} width={110} height={10} rx={5} fill="#c7d2fe" />
        <rect x={76} y={256} width={220} height={7} rx={3.5} fill="#e5e7ef" />
        <rect x={320} y={238} width={84} height={30} rx={6} fill="#fde68a" />
      </g>
    )
  },
})

/* ---------------------------------------------------------------- path bars ---------------------------------------------------------------- */
function PathBar({ os }: { os: OsFlavor }) {
  const mac = os === 'mac'
  const parts = mac ? ['Macintosh HD', 'Users', 'anika', 'Documents', 'notes.txt'] : ['C:', 'Users', 'Anika', 'Documents', 'notes.txt']
  const widths = parts.map((p, i) => p.length * 6.4 + (i === 0 || i === 4 ? 30 : 18))
  let x = 24
  const pos = parts.map((_, i) => { const px = x; x += widths[i] + 12; return px })
  const colors = [G.teal, G.violet, G.violet, G.violet, '#b45309']
  const bgs = ['#d6f3ee', '#ede9fe', '#ede9fe', '#ede9fe', '#fff1c2']
  const sep = mac ? '/' : '\\'
  const mono = mac ? ['/', 'Users', '/', 'anika', '/', 'Documents', '/', 'notes.txt'] : ['C:', '\\', 'Users', '\\', 'Anika', '\\', 'Documents', '\\', 'notes.txt']
  const monoColor = (t: string, i: number) => (t === sep ? '#9ca3af' : mac ? (i === 0 ? G.teal : t === 'notes.txt' ? '#b45309' : G.violet) : t === 'C:' ? G.teal : t === 'notes.txt' ? '#b45309' : G.violet)
  const last = parts.length - 1
  const folderEnd = pos[3] + widths[3]
  return (
    <g>
      <rect width={480} height={300} fill="#eef0f7" />
      <Rc x={0} y={0} w={480} h={34} r={0} f={mac ? '#e9e9ee' : G.bar} />
      <T x={240} y={22} s={11} a="middle" w={600}>{mac ? 'Documents' : 'Documents — File Explorer'}</T>
      <Rc x={10} y={62} w={460} h={42} r={mac ? 8 : 6} f="#fff" s="#cfd3dc" />
      {parts.map((p, i) => (
        <g key={p}>
          <Rc x={pos[i]} y={70} w={widths[i]} h={26} r={6} f={bgs[i]} />
          {i === 0 && (mac ? <rect x={pos[i] + 8} y={78} width={13} height={9} rx={2} fill="#94a3b8" /> : <rect x={pos[i] + 7} y={79} width={13} height={8} rx={2} fill="#64748b" />)}
          {i === 0 && !mac && null}
          {i > 0 && i < last && <FolderIcon x={pos[i] + 7} y={77.500} s={0.3} c={colors[i]} />}
          {i === last && <DocIcon x={pos[i] + 8} y={74} s={0.5} accent="#b45309" />}
          <T x={pos[i] + (i === 0 ? (mac ? 26 : 25) : i === last ? 24 : 21)} y={87} s={11.5} w={600} c={colors[i]}>{p}</T>
          {i < last && <T x={pos[i] + widths[i] + 4} y={88} s={13} c={G.muted}>›</T>}
        </g>
      ))}
      <T x={240} y={136} s={9.5} a="middle" c={G.muted}>The same place, written as text ↓</T>
      <Rc x={14} y={146} w={452} h={34} r={8} f="#1e1e24" />
      <text x={28} y={168} fontSize={14} fontFamily={MONO} xmlSpace="preserve">
        {mono.map((t, i) => <tspan key={i} fill={monoColor(t, i)} fontWeight={t === sep ? 400 : 700}>{t}</tspan>)}
      </text>
      <g fontSize={11} fontWeight={700} fontFamily="inherit">
        <T x={pos[0] + widths[0] / 2} y={214} s={12} w={700} c={colors[0]} a="middle">{mac ? 'root' : 'drive'}</T>
        <T x={(pos[1] + folderEnd) / 2} y={214} s={12} w={700} c={colors[1]} a="middle">folders</T>
        <T x={pos[last] + widths[last] / 2} y={214} s={12} w={700} c={colors[4]} a="middle">file</T>
      </g>
      <T x={pos[0] + widths[0] / 2} y={228} s={9.5} c={G.muted} a="middle">{mac ? 'the whole Mac' : 'the big cupboard'}</T>
      <T x={(pos[1] + folderEnd) / 2} y={228} s={9.5} c={G.muted} a="middle">folder inside folder</T>
      <T x={pos[last] + widths[last] / 2} y={228} s={9.5} c={G.muted} a="middle">the thing itself</T>
    </g>
  )
}
function pathRegions(os: OsFlavor) {
  const mac = os === 'mac'
  const parts = mac ? ['Macintosh HD', 'Users', 'anika', 'Documents', 'notes.txt'] : ['C:', 'Users', 'Anika', 'Documents', 'notes.txt']
  const widths = parts.map((p, i) => p.length * 6.4 + (i === 0 || i === 4 ? 30 : 18))
  let x = 24
  const pos = parts.map((_, i) => { const px = x; x += widths[i] + 12; return px })
  return {
    first: { x: pos[0] - 2, y: 66, w: widths[0] + 4, h: 34, r: 8 },
    folders: { x: pos[1] - 2, y: 66, w: pos[3] + widths[3] - pos[1] + 4, h: 34, r: 8 },
    file: { x: pos[4] - 2, y: 66, w: widths[4] + 4, h: 34, r: 8 },
  }
}
export const pathBarWin = defineMock('path-bar-win', {
  titleBn: 'উইন্ডোজের ফাইল পাথ: C: › Users › Anika › Documents › notes.txt',
  fixedOs: 'windows',
  regions: () => {
    const r = pathRegions('windows')
    return { drive: { ...r.first, bn: 'ড্রাইভ (C:)' }, folders: { ...r.folders, bn: 'ফোল্ডারগুলো (Users › Anika › Documents)' }, file: { ...r.file, bn: 'ফাইল (notes.txt)' } }
  },
  draw: () => <PathBar os="windows" />,
})
export const pathBarMac = defineMock('path-bar-mac', {
  titleBn: 'ম্যাকের ফাইল পাথ: Macintosh HD › Users › anika › Documents › notes.txt',
  fixedOs: 'mac',
  regions: () => {
    const r = pathRegions('mac')
    return { root: { ...r.first, bn: 'মূল ড্রাইভ (Macintosh HD)' }, folders: { ...r.folders, bn: 'ফোল্ডারগুলো (Users › anika › Documents)' }, file: { ...r.file, bn: 'ফাইল (notes.txt)' } }
  },
  draw: () => <PathBar os="mac" />,
})
