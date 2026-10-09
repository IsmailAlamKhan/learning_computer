import type { OsFlavor } from '../../../engine/types'
import { Chrome, FolderIcon, G, MONO, Rc, T, defineMock } from './kit'

const wall = (os: OsFlavor) => <rect width={480} height={300} fill={os === 'mac' ? 'url(#mk-wall-m)' : 'url(#mk-wall-w)'} />

/* ---------------------------------------------------------------- terminals ---------------------------------------------------------------- */
type TLine = { t: string; k: 'p' | 'o' | 'c' | 'i'; cmd?: string }
function Term({ lines, bg, prompt, y0, x0 = 22 }: { lines: TLine[]; bg: string; prompt: string; y0: number; x0?: number }) {
  return (
    <g>
      <rect x={6} y={34} width={468} height={260} fill={bg} />
      {lines.map((l, i) => {
        const y = y0 + i * 17
        if (l.k === 'p')
          return (
            <text key={i} x={x0} y={y} fontSize={11.5} fontFamily={MONO} xmlSpace="preserve">
              <tspan fill={prompt}>{l.t}</tspan>
              <tspan fill="#f9fafb"> {l.cmd}</tspan>
            </text>
          )
        return <T key={i} x={x0} y={y} s={11.5} mono c={l.k === 'i' ? '#9ca3af' : '#e5e7eb'}>{l.t}</T>
      })}
    </g>
  )
}
const WIN_LINES: TLine[] = [
  { t: 'Microsoft Windows [Version 10.0.22631]', k: 'i' },
  { t: '', k: 'i' },
  { t: 'C:\\Users\\Anika>', k: 'p', cmd: 'cd Documents' },
  { t: 'C:\\Users\\Anika\\Documents>', k: 'p', cmd: 'dir' },
  { t: '10/09/2026  10:30    <DIR>     Class', k: 'o' },
  { t: '10/09/2026  10:31          128 notes.txt', k: 'o' },
  { t: '10/09/2026  10:32        2,048 Resume.docx', k: 'o' },
  { t: '', k: 'i' },
  { t: 'C:\\Users\\Anika\\Documents>', k: 'p', cmd: '_' },
]
export const terminalWin = defineMock('terminal-win', {
  titleBn: 'উইন্ডোজ টার্মিনাল: কালো পর্দায় প্রম্পট ও কমান্ডের আউটপুট',
  fixedOs: 'windows',
  regions: () => ({
    prompt: { x: 14, y: 36 + 17 * 8 + 4, w: 452, h: 20, r: 4, bn: 'প্রম্পট (যেখানে কমান্ড লেখা হয়)' },
    output: { x: 14, y: 36 + 17 * 4 + 4, w: 452, h: 17 * 3 + 6, r: 4, bn: 'কমান্ডের আউটপুট' },
  }),
  draw: () => (
    <Chrome x={6} y={6} w={468} h={288} os="windows" dark tabs={['Terminal']}>
      <Term lines={WIN_LINES} bg="#0c0c0c" prompt="#86efac" y0={56} />
    </Chrome>
  ),
})

const MAC_LINES: TLine[] = [
  { t: 'Last login: Fri Oct  9 10:30:12 on ttys000', k: 'i' },
  { t: '', k: 'i' },
  { t: 'anika@MacBook ~ %', k: 'p', cmd: 'cd Documents' },
  { t: 'anika@MacBook Documents %', k: 'p', cmd: 'ls' },
  { t: 'Class       notes.txt    Resume.docx', k: 'o' },
  { t: 'Form.pdf    Photos       Songs', k: 'o' },
  { t: '', k: 'i' },
  { t: '', k: 'i' },
  { t: 'anika@MacBook Documents %', k: 'p', cmd: '_' },
]
export const terminalMac = defineMock('terminal-mac', {
  titleBn: 'ম্যাক টার্মিনাল: অন্ধকার পর্দায় প্রম্পট ও কমান্ডের আউটপুট',
  fixedOs: 'mac',
  regions: () => ({
    prompt: { x: 14, y: 36 + 17 * 8 + 4, w: 452, h: 20, r: 4, bn: 'প্রম্পট (যেখানে কমান্ড লেখা হয়)' },
    output: { x: 14, y: 36 + 17 * 4 + 4, w: 452, h: 17 * 2 + 6, r: 4, bn: 'কমান্ডের আউটপুট' },
  }),
  draw: () => (
    <Chrome x={6} y={6} w={468} h={288} os="mac" dark title="anika — zsh — 80×24">
      <Term lines={MAC_LINES} bg="#1e2024" prompt="#a5b4fc" y0={56} />
    </Chrome>
  ),
})

/* ---------------------------------------------------------------- code editor ---------------------------------------------------------------- */
const CODE: [number, string, string][][] = [
  [[0, '<!DOCTYPE html>', '#94a3b8']],
  [[0, '<html>', '#fda4af']],
  [[2, '<body>', '#fda4af']],
  [[4, '<h1>', '#fda4af'], [8, 'Hello!', '#e5e7eb'], [14, '</h1>', '#fda4af']],
  [[4, '<p>', '#fda4af'], [7, 'Hi there', '#e5e7eb'], [15, '</p>', '#fda4af']],
  [[2, '</body>', '#fda4af']],
]
export const codeEditor = defineMock('code-editor', {
  titleBn: 'কোড এডিটর: বাঁয়ে ফাইলের তালিকা, মাঝে কোড, ডানে প্রিভিউ, নিচে আউটপুট, উপরে রান বোতাম',
  regions: () => ({
    explorer: { x: 6, y: 58, w: 92, h: 236, r: 0, bn: 'বাঁয়ের ফাইল এক্সপ্লোরার' },
    editor: { x: 100, y: 58, w: 182, h: 156, r: 0, bn: 'কোড লেখার এডিটর' },
    run: { x: 394, y: 36, w: 70, h: 20, r: 10, bn: 'রান (Run) বোতাম' },
    preview: { x: 284, y: 58, w: 190, h: 156, r: 0, bn: 'ডানের প্রিভিউ (ফলাফল)' },
    output: { x: 100, y: 216, w: 374, h: 78, r: 0, bn: 'নিচের আউটপুট প্যানেল' },
  }),
  draw: (os) => (
    <Chrome x={6} y={6} w={468} h={288} os={os} dark title="index.html — My Site">
      <rect x={6} y={34} width={468} height={24} fill="#252530" />
      <Rc x={394} y={36} w={70} h={20} r={10} f="#16a34a" />
      <T x={429} y={50} s={10.5} w={700} c="#fff" a="middle">▶ Run</T>
      <T x={16} y={50} s={9.5} c="#9ca3af">My Site</T>
      <rect x={6} y={58} width={92} height={236} fill="#181820" />
      <T x={14} y={72} s={8.5} c="#9ca3af" w={700}>EXPLORER</T>
      {['index.html', 'style.css', 'app.py'].map((n, i) => (
        <g key={n}>
          {i === 0 && <rect x={6} y={78} width={92} height={18} fill="#2f3040" />}
          <rect x={14} y={83 + i * 18} width={9} height={9} rx={2} fill={['#f97316', '#38bdf8', '#facc15'][i]} />
          <T x={29} y={91 + i * 18} s={10} c="#e5e7eb">{n}</T>
        </g>
      ))}
      <FolderIcon x={14} y={138} s={0.3} c="#94a3b8" /><T x={29} y={146} s={10} c="#9ca3af">images</T>
      <rect x={98} y={58} width={186} height={156} fill="#1e1e24" />
      {CODE.map((segs, i) => (
        <g key={i}>
          <T x={118} y={76 + i * 18} s={10} mono c="#6b7280" a="end">{i + 1}</T>
          <text x={126} y={76 + i * 18} fontSize={10.5} fontFamily={MONO} xmlSpace="preserve">
            {segs.map(([ind, s, c], j) => <tspan key={j} fill={c}>{(j === 0 ? ' '.repeat(ind) : '') + s}</tspan>)}
          </text>
        </g>
      ))}
      <rect x={284} y={58} width={190} height={156} fill="#fff" />
      <rect x={284} y={58} width={1} height={156} fill="#000" opacity={0.4} />
      <Rc x={292} y={64} w={174} h={16} r={8} f="#eef0f6" /><T x={300} y={75.500} s={9} c={G.muted}>preview</T>
      <T x={298} y={112} s={24} w={700}>Hello!</T>
      <T x={298} y={134} s={11}>Hi there</T>
      <rect x={100} y={214} width={374} height={80} fill="#15151b" />
      <rect x={100} y={214} width={374} height={1} fill="#000" opacity={0.5} />
      <T x={110} y={229} s={8.5} c="#9ca3af" w={700}>OUTPUT</T>
      <T x={110} y={248} s={10.5} mono c="#86efac">Page is ready ✓</T>
      <T x={110} y={266} s={10.5} mono c="#9ca3af">Running index.html …</T>
    </Chrome>
  ),
})

/* ---------------------------------------------------------------- settings ---------------------------------------------------------------- */
export const settingsWin = defineMock('settings-win', {
  titleBn: 'উইন্ডোজ সেটিংস: বাঁয়ে তালিকা, ডানে ওয়াই-ফাই, ডিসপ্লে ও সময়ের কার্ড',
  fixedOs: 'windows',
  regions: () => ({
    sidebar: { x: 6, y: 34, w: 140, h: 260, r: 0, bn: 'বাঁয়ের সেটিংস তালিকা' },
    wifi: { x: 158, y: 76, w: 150, h: 70, r: 10, bn: 'ওয়াই-ফাই (Wi-Fi) কার্ড' },
    display: { x: 316, y: 76, w: 150, h: 70, r: 10, bn: 'ডিসপ্লে (Display) কার্ড' },
    time: { x: 158, y: 154, w: 150, h: 70, r: 10, bn: 'সময় ও ভাষা (Time & language) কার্ড' },
  }),
  draw: () => (
    <Chrome x={6} y={6} w={468} h={288} os="windows" title="Settings">
      <rect x={6} y={34} width={468} height={260} fill="#f3f4f8" />
      <circle cx={28} cy={54} r={12} fill={G.sky} /><T x={28} y={58.500} s={11} c="#fff" a="middle" w={600}>A</T>
      <T x={46} y={52} s={11} w={600}>Anika</T><T x={46} y={63} s={8.5} c={G.muted}>Local account</T>
      <Rc x={14} y={74} w={124} h={20} r={10} f="#fff" s="#d5d9e3" /><T x={24} y={88} s={9.5} c={G.muted}>Find a setting</T>
      {['System', 'Bluetooth & devices', 'Network & internet', 'Personalization', 'Apps', 'Accounts', 'Time & language'].map((n, i) => (
        <g key={n}>
          {i === 0 && <Rc x={10} y={102} w={132} h={24} r={6} f="#e3e6ee" />}
          <rect x={18} y={108 + i * 26} width={11} height={11} rx={3} fill={['#38bdf8', '#6366f1', '#0ea5e9', '#f59e0b', '#22c55e', '#64748b', '#14b8a6'][i]} />
          <T x={36} y={117 + i * 26} s={10} w={i === 0 ? 600 : 400}>{n}</T>
        </g>
      ))}
      <T x={160} y={64} s={17} w={700}>Settings</T>
      {[
        [158, 76, 'Wi-Fi', 'Home-Net · Connected', '#0ea5e9'],
        [316, 76, 'Display', 'Brightness, night light', '#38bdf8'],
        [158, 154, 'Time & language', '10:30 AM · English', '#14b8a6'],
        [316, 154, 'Bluetooth', 'Off', '#6366f1'],
      ].map(([x, y, a, b, c]) => (
        <g key={a as string}>
          <Rc x={x as number} y={y as number} w={150} h={70} r={10} f="#fff" s="#e1e4ec" />
          <rect x={(x as number) + 12} y={(y as number) + 12} width={22} height={22} rx={6} fill={c as string} />
          <T x={(x as number) + 12} y={(y as number) + 52} s={11} w={600}>{a as string}</T>
          <T x={(x as number) + 12} y={(y as number) + 64} s={8.5} c={G.muted}>{b as string}</T>
        </g>
      ))}
    </Chrome>
  ),
})

const MAC_SIDE: [string, string][] = [['Wi-Fi', '#3b82f6'], ['Bluetooth', '#3b82f6'], ['Network', '#3b82f6'], ['Battery', '#22c55e'], ['Displays', '#0ea5e9'], ['Sound', '#f43f5e'], ['Keyboard', '#94a3b8'], ['Trackpad', '#94a3b8']]
export const settingsMac = defineMock('settings-mac', {
  titleBn: 'ম্যাকের সিস্টেম সেটিংস: বাঁয়ে তালিকা (Wi-Fi, Displays, Keyboard), ডানে বিস্তারিত',
  fixedOs: 'mac',
  regions: () => ({
    sidebar: { x: 6, y: 34, w: 140, h: 260, r: 0, bn: 'বাঁয়ের সেটিংস তালিকা' },
    wifi: { x: 12, y: 74, w: 128, h: 22, r: 6, bn: 'ওয়াই-ফাই (Wi-Fi) অপশন' },
    display: { x: 12, y: 170, w: 128, h: 22, r: 6, bn: 'ডিসপ্লে (Displays) অপশন' },
    keyboard: { x: 12, y: 218, w: 128, h: 22, r: 6, bn: 'কিবোর্ড (Keyboard) অপশন' },
  }),
  draw: () => (
    <Chrome x={6} y={6} w={468} h={288} os="mac" title="Wi-Fi">
      <rect x={6} y={34} width={140} height={260} fill="#eceef6" />
      <Rc x={14} y={40} w={124} h={20} r={7} f="#fff" s="#d5d9e3" /><T x={26} y={54} s={9.5} c={G.muted}>Search</T>
      {MAC_SIDE.map(([n, c], i) => (
        <g key={n}>
          {i === 0 && <Rc x={12} y={74} w={128} h={22} r={6} f="#3b82f6" />}
          <rect x={18} y={78 + i * 24} width={14} height={14} rx={4} fill={i === 0 ? '#fff' : c} opacity={i === 0 ? 0.9 : 1} />
          <T x={38} y={90 + i * 24} s={10.5} c={i === 0 ? '#fff' : G.ink}>{n}</T>
        </g>
      ))}
      <rect x={146} y={34} width={328} height={260} fill="#fff" />
      <T x={166} y={64} s={17} w={700}>Wi-Fi</T>
      <Rc x={424} y={48} w={36} h={20} r={10} f="#22c55e" /><circle cx={450} cy={58} r={8} fill="#fff" />
      <Rc x={160} y={84} w={300} h={110} r={10} f="#f3f4f8" s="#e1e4ec" />
      {[['Home-Net', 'Connected'], ['Neighbour-5G', ''], ['Cafe-Guest', '']].map(([n, c], i) => (
        <g key={n}>
          <T x={176} y={112 + i * 34} s={11} w={i === 0 ? 600 : 400}>{n}</T>
          {c && <T x={176} y={124 + i * 34} s={8.5} c={G.muted}>{c}</T>}
          {i === 0 && <T x={440} y={116} s={12} c="#3b82f6" a="end">✓</T>}
          <g fill="none" stroke={G.muted} strokeWidth={1.5} strokeLinecap="round"><path d={`M436 ${112 + i * 34}a8 8 0 0 1 12 0M439 ${116 + i * 34}a4 4 0 0 1 6 0`} /></g>
        </g>
      ))}
    </Chrome>
  ),
})

/* ---------------------------------------------------------------- task manager / force quit ---------------------------------------------------------------- */
export const taskManager = defineMock('task-manager', {
  titleBn: 'টাস্ক ম্যানেজার: চলমান অ্যাপের তালিকা ও “End task” বোতাম',
  regions: (os) => ({
    processes: { x: 12, y: 68, w: 456, h: 210, r: 6, bn: os === 'mac' ? 'চলমান প্রসেসের তালিকা' : 'চলমান প্রসেসের তালিকা' },
    'end-task': { x: 364, y: 36, w: 104, h: 24, r: 6, bn: os === 'mac' ? 'প্রসেস বন্ধ করার (Stop) বোতাম' : 'এন্ড টাস্ক (End task) বোতাম' },
  }),
  draw: (os) => (
    <Chrome x={6} y={6} w={468} h={288} os={os} title={os === 'mac' ? 'Activity Monitor' : 'Task Manager'}>
      <T x={18} y={54} s={14} w={700}>Processes</T>
      <Rc x={364} y={36} w={104} h={24} r={6} f="#fff" s="#cfd3dc" />
      <T x={416} y={52} s={10.5} a="middle" w={600} c={G.red}>{os === 'mac' ? '✕ Stop' : '✕ End task'}</T>
      <Rc x={12} y={68} w={456} h={210} r={6} f="#fff" s="#e1e4ec" />
      <rect x={13} y={69} width={454} height={20} fill="#f6f7fb" />
      {[['Name', 24], ['Status', 220], ['CPU', 330], ['Memory', 400]].map(([n, x]) => <T key={n as string} x={x as number} y={83} s={9.5} c={G.muted} w={600}>{n as string}</T>)}
      <T x={24} y={104} s={9.5} w={700} c={G.skyDark}>Apps (3)</T>
      {[
        ['Browser', '', '12%', '480 MB', false],
        ['Notepad', '', '0%', '12 MB', false],
        ['Photos', 'Not responding', '98%', '1.2 GB', true],
      ].map(([n, st, cpu, mem, bad], i) => {
        const y = 110 + i * 26
        return (
          <g key={n as string}>
            {bad && <rect x={13} y={y} width={454} height={25} fill="#dbeafe" />}
            <rect x={24} y={y + 6} width={13} height={13} rx={3} fill={['#0ea5e9', '#f59e0b', '#ec4899'][i]} />
            <T x={44} y={y + 16} s={10.5}>{n as string}</T>
            <T x={220} y={y + 16} s={10} c={G.red}>{st as string}</T>
            <rect x={322} y={y + 1} width={50} height={23} fill={bad ? '#fecaca' : '#fef3c7'} opacity={bad ? 1 : 0.6} />
            <T x={330} y={y + 16} s={10}>{cpu as string}</T>
            <T x={400} y={y + 16} s={10}>{mem as string}</T>
          </g>
        )
      })}
      <T x={24} y={206} s={9.5} w={700} c={G.skyDark}>Background processes (42)</T>
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={24} y={214 + i * 24} width={13} height={13} rx={3} fill="#94a3b8" />
          <T x={44} y={225 + i * 24} s={10.5} c={G.muted}>{['System', 'Audio Service'][i]}</T>
        </g>
      ))}
    </Chrome>
  ),
})

const FQ_APPS: [string, boolean][] = [['Browser', false], ['Mail', false], ['Photos — Not Responding', true], ['Notes', false]]
export const forceQuit = defineMock('force-quit', {
  titleBn: '“Force Quit” ডায়ালগ: আটকে যাওয়া অ্যাপের তালিকা ও Force Quit বোতাম',
  regions: () => ({
    'app-list': { x: 124, y: 100, w: 232, h: 104, r: 6, bn: 'অ্যাপের তালিকা' },
    'force-quit-button': { x: 252, y: 218, w: 104, h: 26, r: 7, bn: 'ফোর্স কুইট (Force Quit) বোতাম' },
  }),
  draw: (os) => (
    <g>
      {wall(os)}
      <Chrome x={110} y={34} w={260} h={222} os={os} title="Force Quit" />
      <T x={124} y={84} s={9.5} c={G.muted}>If an app doesn’t respond, select it</T>
      <T x={124} y={95} s={9.5} c={G.muted}>and click Force Quit.</T>
      <Rc x={124} y={100} w={232} h={104} r={6} f="#fff" s="#cfd3dc" />
      {FQ_APPS.map(([n, bad], i) => (
        <g key={n}>
          {bad && <Rc x={125} y={101 + i * 25} w={230} h={25} r={0} f="#3b82f6" />}
          <rect x={134} y={107 + i * 25} width={13} height={13} rx={3.5} fill={['#0ea5e9', '#6366f1', '#ec4899', '#f59e0b'][i]} />
          <T x={154} y={118 + i * 25} s={10.5} c={bad ? '#fff' : G.ink} w={bad ? 600 : 400}>{n}</T>
        </g>
      ))}
      <Rc x={252} y={218} w={104} h={26} r={7} f={G.red} />
      <T x={304} y={235} s={11} a="middle" w={600} c="#fff">Force Quit</T>
    </g>
  ),
})
