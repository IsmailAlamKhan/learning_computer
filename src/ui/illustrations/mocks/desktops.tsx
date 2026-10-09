import { AppTile, Battery, Bin, DocIcon, FolderIcon, G, H, Magnifier, Pc, Rc, Speaker, T, W, Wifi, defineMock, type Box } from './kit'

/* ---------------------------------------------------------------- shared pieces ---------------------------------------------------------------- */
const Blooms = ({ mac }: { mac?: boolean }) => (
  <g opacity={mac ? 0.25 : 0.3}>
    <ellipse cx="260" cy="120" rx="90" ry="46" fill="#fff" transform="rotate(-25 260 120)" />
    <ellipse cx="300" cy="150" rx="80" ry="38" fill="#bae6fd" transform="rotate(35 300 150)" />
    <ellipse cx="230" cy="160" rx="70" ry="34" fill="#fff" opacity=".7" transform="rotate(80 230 160)" />
  </g>
)
const Wall = ({ mac, h = H }: { mac?: boolean; h?: number }) => (
  <g>
    <rect width={W} height={h} fill={mac ? 'url(#mk-wall-m)' : 'url(#mk-wall-w)'} />
    <Blooms mac={mac} />
  </g>
)

type DKind = 'bin' | 'pc' | 'folder' | 'doc' | 'disk'
function DeskIcon({ x, y, kind, label }: { x: number; y: number; kind: DKind; label: string }) {
  return (
    <g>
      {kind === 'bin' && <Bin x={x - 15} y={y} s={1.05} />}
      {kind === 'pc' && <Pc x={x - 17} y={y + 2} s={1.05} />}
      {kind === 'folder' && <FolderIcon x={x - 18} y={y + 3} s={1} />}
      {kind === 'doc' && <DocIcon x={x - 12} y={y} s={1.1} />}
      {kind === 'disk' && (
        <g>
          <rect x={x - 19} y={y + 6} width={38} height={22} rx={5} fill="#d1d5db" stroke="#6b7280" strokeWidth="1.3" />
          <circle cx={x + 12} cy={y + 20} r={2} fill="#22c55e" />
        </g>
      )}
      <T x={x} y={y + 46} s={9.5} c="#fff" a="middle" w={500}>{label}</T>
    </g>
  )
}

/* ---------------------------------------------------------------- Windows taskbar ---------------------------------------------------------------- */
interface TbLayout { start: Box; search: Box; apps: Box; tray: Box; clock: Box; bar: Box }
function winTaskbarLayout(y: number, h: number, k: number, x0: number): TbLayout {
  const iy = y + (h - 28 * k) / 2
  return {
    bar: { x: 0, y, w: W, h, r: 0, bn: 'টাস্কবার' },
    start: { x: x0, y: iy, w: 28 * k, h: 28 * k, r: 6, bn: 'টাস্কবারের স্টার্ট বোতাম' },
    search: { x: x0 + 32 * k, y: iy, w: 96 * k, h: 28 * k, r: 14 * k, bn: 'টাস্কবারের সার্চ বক্স' },
    apps: { x: x0 + 134 * k, y: iy, w: 120 * k, h: 28 * k, r: 6, bn: 'টাস্কবারে খোলা ও পিন করা অ্যাপ' },
    tray: { x: W - 106 * k, y: iy, w: 56 * k, h: 28 * k, r: 6, bn: 'সিস্টেম ট্রে (ওয়াই-ফাই, সাউন্ড, ব্যাটারি)' },
    clock: { x: W - 48 * k, y: iy, w: 44 * k, h: 28 * k, r: 6, bn: 'ঘড়ি ও তারিখ' },
  }
}
function WinTaskbar({ l, k, startActive }: { l: TbLayout; k: number; startActive?: boolean }) {
  const { bar, start, search, apps, tray, clock } = l
  const cy = start.y + 14 * k
  return (
    <g>
      <rect x={0} y={bar.y} width={W} height={bar.h} fill="#f1f2f6" opacity=".96" />
      <rect x={0} y={bar.y} width={W} height={1} fill="#c9ceda" />
      <rect x={start.x - 2} y={start.y - 2} width={start.w + 4} height={start.h + 4} rx={6} fill={startActive ? '#fff' : 'none'} />
      <g transform={`translate(${start.x + 5 * k} ${start.y + 5 * k}) scale(${k})`} fill={G.sky}>
        <rect width="8" height="8" rx="1" /><rect x="10" width="8" height="8" rx="1" /><rect y="10" width="8" height="8" rx="1" /><rect x="10" y="10" width="8" height="8" rx="1" />
      </g>
      <Rc x={search.x} y={search.y} w={search.w} h={search.h} r={search.h / 2} f="#fff" s="#d5d9e3" />
      <Magnifier x={search.x + 10 * k} y={cy - 6 * k} s={k * 0.95} />
      <T x={search.x + 28 * k} y={cy + 3.6 * k} s={9.5 * k} c={G.muted}>Search</T>
      {[0, 1, 2, 3].map((i) => {
        const ax = apps.x + i * 30 * k
        return (
          <g key={i}>
            {i === 0 && <FolderIcon x={ax + 2 * k} y={cy - 9 * k} s={0.62 * k} />}
            {i === 1 && <circle cx={ax + 14 * k} cy={cy} r={9 * k} fill="#3b82f6" />}
            {i === 2 && <rect x={ax + 4 * k} y={cy - 9 * k} width={20 * k} height={18 * k} rx={3 * k} fill="#fbbf24" />}
            {i === 3 && <rect x={ax + 3 * k} y={cy - 8 * k} width={22 * k} height={16 * k} rx={3 * k} fill="#6366f1" />}
            {i === 0 && <rect x={ax + 5 * k} y={start.y + 25 * k} width={18 * k} height={2.5 * k} rx={1.2} fill={G.sky} />}
          </g>
        )
      })}
      <Wifi x={tray.x + 2 * k} y={cy - 5 * k} s={k * 0.9} />
      <Speaker x={tray.x + 22 * k} y={cy - 5 * k} s={k * 0.9} />
      <Battery x={tray.x + 38 * k} y={cy - 4 * k} s={k * 0.7} />
      <T x={clock.x + clock.w - 2 * k} y={cy - 1 * k} s={8.8 * k} a="end">10:30 AM</T>
      <T x={clock.x + clock.w - 2 * k} y={cy + 9 * k} s={8.2 * k} a="end" c={G.muted}>9/10/2026</T>
    </g>
  )
}

/* ---------------------------------------------------------------- macOS dock / menubar ---------------------------------------------------------------- */
interface DockLayout { items: Box[]; trash: Box; bar: Box; div: number }
const DOCK_APPS = [
  { c: '#3b82f6', g: 'face' }, { c: '#6b7280', g: 'grid' }, { c: '#0ea5e9', g: 'compass' }, { c: '#6366f1', g: 'envelope' }, { c: '#f59e0b', g: 'lines' }, { c: '#ec4899', g: 'petals' },
] as const
function macDockLayout(y: number, s: number, gap: number): DockLayout {
  const inner = 7 * s + 7 * gap + 1
  const pad = 10
  const x0 = (W - inner - pad * 2) / 2 + pad
  const names = ['Finder', 'Launchpad', 'ব্রাউজার', 'মেইল', 'নোটস', 'ছবি']
  const items = DOCK_APPS.map((_, i) => ({ x: x0 + i * (s + gap), y, w: s, h: s, r: s * 0.24, bn: i === 0 ? 'ডকের ফাইন্ডার আইকন' : i === 1 ? 'ডকের লঞ্চপ্যাড আইকন' : `ডকের ${names[i]} অ্যাপ` }))
  const divX = x0 + 6 * s + 5 * gap + gap
  return { items, div: divX, trash: { x: divX + 1 + gap, y, w: s, h: s, r: s * 0.24, bn: 'ডকের ট্র্যাশ' }, bar: { x: x0 - pad, y: y - 7, w: inner + pad * 2, h: s + 14, r: 16, bn: 'ডক' } }
}
function MacDock({ l, s }: { l: DockLayout; s: number }) {
  const { items, trash, bar, div } = l
  return (
    <g>
      <Rc x={bar.x} y={bar.y} w={bar.w} h={bar.h} r={16} f="#fff" op={0.38} s="#fff" />
      {items.map((b, i) => <AppTile key={i} x={b.x} y={b.y} s={s} c={DOCK_APPS[i].c} glyph={DOCK_APPS[i].g} />)}
      <rect x={div} y={bar.y + 6} width={1} height={bar.h - 12} fill="#fff" opacity=".6" />
      <g transform={`translate(${trash.x} ${trash.y})`}>
        <rect width={s} height={s} rx={s * 0.24} fill="#e5e7eb" opacity=".85" />
        <Bin x={s * 0.2} y={s * 0.14} s={(s / 40) * 0.95} />
      </g>
      <circle cx={items[0].x + s / 2} cy={bar.y + bar.h - 3} r={1.6} fill="#fff" />
    </g>
  )
}
function Apple({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#111827">
      <path d="M5.4 3.1c1.7 0 2 .8 3.5 .8s1.9-.8 3.6-.8c1.3 0 2.5.6 3.3 1.7-2.8 1.5-2.4 5.4.5 6.5-.6 1.7-2.6 5.2-4.4 5.2-1.1 0-1.6-.7-3-.7s-1.9.7-3 .7C3.700 16.500.8 12.200.8 8.600c0-3 2-5.500 4.600-5.500z" transform="translate(0 1.800) scale(.95)" />
      <path d="M10.200 1.800C10.200.8 11 .1 12 0c.1 1-.7 2-1.800 1.800z" />
    </g>
  )
}
function MacMenubar({ y, h, k }: { y: number; h: number; k: number }) {
  const cy = y + h / 2
  return (
    <g>
      <rect x={0} y={y} width={W} height={h} fill="#fff" opacity=".78" />
      <Apple x={12 * k} y={cy - 8 * k} s={k * 0.95} />
      <T x={36 * k} y={cy + 3.8 * k} s={10.5 * k} w={700}>Finder</T>
      {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map((m, i) => (
        <T key={m} x={(76 + [0, 24, 50, 78, 100, 146][i]) * k} y={cy + 3.8 * k} s={10.5 * k}>{m}</T>
      ))}
      <Magnifier x={W - 128 * k} y={cy - 5 * k} s={k * 0.9} c="#111827" />
      <Wifi x={W - 108 * k} y={cy - 5 * k} s={k * 0.9} />
      <Battery x={W - 88 * k} y={cy - 4 * k} s={k * 0.75} />
      <T x={W - 8 * k} y={cy + 3.8 * k} s={10 * k} a="end">Fri 10:30 AM</T>
    </g>
  )
}

/* ---------------------------------------------------------------- mocks ---------------------------------------------------------------- */
const winTb = winTaskbarLayout(264, 36, 1, 112)
export const winDesktop = defineMock('win-desktop', {
  titleBn: 'উইন্ডোজ ডেস্কটপ: আইকন, নিচে টাস্কবার, স্টার্ট বোতাম ও ঘড়ি',
  regions: () => ({
    icons: { x: 6, y: 8, w: 76, h: 190, r: 8, bn: 'ডেস্কটপের আইকনগুলো' },
    taskbar: { ...winTb.bar, bn: 'টাস্কবার' },
    start: winTb.start,
    tray: { ...winTb.tray, w: winTb.clock.x + winTb.clock.w - winTb.tray.x, bn: 'সিস্টেম ট্রে ও ঘড়ি' },
    'recycle-bin': { x: 8, y: 8, w: 72, h: 62, r: 8, bn: 'রিসাইকেল বিন' },
  }),
  draw: () => (
    <g>
      <Wall />
      <DeskIcon x={44} y={14} kind="bin" label="Recycle Bin" />
      <DeskIcon x={44} y={78} kind="folder" label="Documents" />
      <DeskIcon x={44} y={142} kind="doc" label="notes.txt" />
      <WinTaskbar l={winTb} k={1} />
    </g>
  ),
})

const mTb = winTaskbarLayout(236, 64, 1.22, 14)
export const winTaskbar = defineMock('win-taskbar', {
  titleBn: 'উইন্ডোজ টাস্কবার: স্টার্ট, সার্চ, অ্যাপ, ট্রে ও ঘড়ি',
  regions: () => ({ start: mTb.start, search: mTb.search, apps: mTb.apps, tray: mTb.tray, clock: mTb.clock }),
  draw: () => (
    <g>
      <Wall />
      <Rc x={60} y={50} w={250} h={130} r={8} f="#fff" />
      <Rc x={60} y={50} w={250} h={22} r={8} f="#f1f2f6" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={76} y={92 + i * 18} width={[180, 150, 200, 110][i]} height={7} rx={3.5} fill="#dfe3ee" />)}
      <WinTaskbar l={mTb} k={1.22} />
    </g>
  ),
})

const bigDock = macDockLayout(212, 46, 9)
export const macDockMock = defineMock('mac-dock', {
  titleBn: 'ম্যাকের ডক: ফাইন্ডার, লঞ্চপ্যাড, অ্যাপ ও ট্র্যাশ',
  regions: () => ({
    finder: bigDock.items[0],
    launchpad: bigDock.items[1],
    apps: { x: bigDock.items[2].x, y: 212, w: bigDock.items[5].x + 46 - bigDock.items[2].x, h: 46, r: 12, bn: 'ডকের অ্যাপগুলো' },
    trash: bigDock.trash,
  }),
  draw: () => (
    <g>
      <Wall mac />
      <MacMenubar y={0} h={22} k={0.8} />
      <MacDock l={bigDock} s={46} />
    </g>
  ),
})

const dTb = macDockLayout(256, 32, 6)
export const macDesktop = defineMock('mac-desktop', {
  titleBn: 'ম্যাক ডেস্কটপ: উপরে মেনুবার, নিচে ডক ও ট্র্যাশ',
  regions: () => ({
    icons: { x: 396, y: 30, w: 78, h: 140, r: 8, bn: 'ডেস্কটপের আইকনগুলো' },
    menubar: { x: 0, y: 0, w: W, h: 22, r: 0, bn: 'উপরের মেনুবার' },
    dock: dTb.bar,
    trash: dTb.trash,
  }),
  draw: () => (
    <g>
      <Wall mac />
      <MacMenubar y={0} h={22} k={0.8} />
      <DeskIcon x={436} y={34} kind="disk" label="Macintosh HD" />
      <DeskIcon x={436} y={98} kind="folder" label="Documents" />
      <MacDock l={dTb} s={32} />
    </g>
  ),
})

const MENU = ['About This Mac', 'System Settings…', 'App Store…', '-', 'Recent Items', '-', 'Force Quit…', '-', 'Sleep', 'Restart…', 'Shut Down…']
export const macMenubar = defineMock('mac-menubar', {
  titleBn: 'ম্যাকের মেনুবার: অ্যাপল মেনু, অ্যাপের মেনু, স্ট্যাটাস আইকন ও ঘড়ি',
  regions: () => ({
    'system-menu': { x: 4, y: 3, w: 176, h: 222, r: 10, bn: 'অ্যাপল মেনু' },
    'app-menu': { x: 46, y: 3, w: 260, h: 34, r: 6, bn: 'অ্যাপের মেনু (File, Edit, View…)' },
    status: { x: 308, y: 3, w: 90, h: 34, r: 6, bn: 'স্ট্যাটাস আইকন (ওয়াই-ফাই, ব্যাটারি)' },
    clock: { x: 396, y: 3, w: 82, h: 34, r: 6, bn: 'ঘড়ি' },
  }),
  draw: () => {
    let y = 46
    return (
      <g>
        <Wall mac />
        <MacMenubar y={0} h={38} k={1.3} />
        <Rc x={6} y={40} w={168} h={182} r={10} f="#fff" op={0.94} filter />
        {MENU.map((m, i) => {
          if (m === '-') { y += 7; return <rect key={i} x={14} y={y - 3} width={152} height={1} fill="#d1d5db" /> }
          const ty = y + 9
          y += 18
          return <T key={i} x={16} y={ty} s={10.5} w={m === 'Force Quit…' ? 600 : 400}>{m}</T>
        })}
      </g>
    )
  },
})

function WindowBodyStub({ y, os }: { y: number; os: 'win' | 'mac' }) {
  return (
    <g>
      <rect x={0} y={y} width={W} height={H - y} fill="#fff" />
      <T x={14} y={y + 20} s={11} c={G.muted}>{os === 'win' ? 'File   Edit   View' : 'File   Edit   Format   View'}</T>
      {[0, 1, 2].map((i) => <rect key={i} x={14} y={y + 38 + i * 18} width={[300, 240, 170][i]} height={7} rx={3.5} fill="#e5e7ef" />)}
    </g>
  )
}
export const winTitlebar = defineMock('win-titlebar', {
  titleBn: 'উইন্ডোর টাইটেল বার: নাম, মিনিমাইজ, ম্যাক্সিমাইজ ও ক্লোজ বোতাম',
  regions: () => ({
    title: { x: 0, y: 60, w: 288, h: 52, r: 0, bn: 'টাইটেল বার (উইন্ডোর নাম)' },
    minimize: { x: 288, y: 60, w: 64, h: 52, r: 0, bn: 'মিনিমাইজ বোতাম' },
    maximize: { x: 352, y: 60, w: 64, h: 52, r: 0, bn: 'ম্যাক্সিমাইজ বোতাম' },
    close: { x: 416, y: 60, w: 64, h: 52, r: 0, bn: 'ক্লোজ বোতাম' },
  }),
  draw: () => (
    <g>
      <Wall />
      <rect x={0} y={60} width={W} height={52} fill={G.bar} />
      <rect x={14} y={76} width={22} height={22} rx={5} fill={G.sky} />
      <T x={46} y={92} s={16}>notes.txt - Notepad</T>
      <g stroke={G.ink} strokeWidth={2} fill="none" strokeLinecap="round">
        <path d="M308 86h24" /><rect x={371} y={75} width={22} height={22} rx={3} /><path d="M437 75l22 22M459 75l-22 22" />
      </g>
      <WindowBodyStub y={112} os="win" />
    </g>
  ),
})
export const macTitlebar = defineMock('mac-titlebar', {
  titleBn: 'ম্যাক উইন্ডোর টাইটেল বার: লাল, হলুদ, সবুজ বোতাম ও নাম',
  regions: () => ({
    close: { x: 14, y: 70, w: 34, h: 32, r: 16, bn: 'লাল ক্লোজ বোতাম' },
    minimize: { x: 52, y: 70, w: 34, h: 32, r: 16, bn: 'হলুদ মিনিমাইজ বোতাম' },
    zoom: { x: 90, y: 70, w: 34, h: 32, r: 16, bn: 'সবুজ জুম বোতাম' },
    title: { x: 150, y: 66, w: 200, h: 40, r: 8, bn: 'উইন্ডোর নাম' },
  }),
  draw: () => (
    <g>
      <Wall mac />
      <rect x={0} y={60} width={W} height={52} fill="#e9e9ee" />
      {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <circle key={c} cx={31 + i * 38} cy={86} r={12} fill={c} />)}
      <g stroke="#7a2a1f" strokeWidth="2" strokeLinecap="round" opacity=".8">
        <path d="M26 81l10 10M36 81l-10 10" />
        <path d="M64 86h12" stroke="#7a5200" />
        <path d="M95 86h12M101 80v12" stroke="#0b5a1c" />
      </g>
      <T x={240} y={91} s={15} w={600} a="middle">Untitled — Edited</T>
      <WindowBodyStub y={112} os="mac" />
    </g>
  ),
})

const PINNED: [string, string, Parameters<typeof AppTile>[0]['glyph']][] = [
  ['Browser', '#0ea5e9', 'compass'], ['Mail', '#6366f1', 'envelope'], ['Photos', '#ec4899', 'petals'], ['Notepad', '#f59e0b', 'lines'], ['Settings', '#64748b', 'gear'], ['Files', '#eab308', 'grid'],
  ['Calendar', '#ef4444', 'cal'], ['Clock', '#14b8a6', 'circle'], ['Music', '#f43f5e', 'play'], ['Store', '#3b82f6', 'star'], ['Paint', '#8b5cf6', 'petals'], ['Camera', '#475569', 'circle'],
]
const startTb = winTaskbarLayout(264, 36, 1, 112)
export const winStartMenu = defineMock('win-start-menu', {
  titleBn: 'উইন্ডোজ স্টার্ট মেনু: উপরে সার্চ, মাঝে পিন করা অ্যাপ, নিচে পাওয়ার বোতাম',
  regions: () => ({
    search: { x: 112, y: 24, w: 256, h: 26, r: 13, bn: 'স্টার্ট মেনুর সার্চ বক্স' },
    pinned: { x: 108, y: 58, w: 264, h: 122, r: 8, bn: 'পিন করা অ্যাপগুলো' },
    power: { x: 336, y: 226, w: 34, h: 26, r: 8, bn: 'পাওয়ার বোতাম' },
  }),
  draw: () => (
    <g>
      <Wall />
      <Rc x={100} y={12} w={280} h={244} r={12} f="#f8f8fb" s="#d5d9e3" filter />
      <Rc x={112} y={24} w={256} h={26} r={13} f="#fff" s="#d5d9e3" />
      <Magnifier x={124} y={31} />
      <T x={144} y={41} s={9.5} c={G.muted}>Search for apps, settings, and documents</T>
      <T x={116} y={70} s={10} w={700}>Pinned</T>
      <T x={364} y={70} s={9} a="end" c={G.muted}>All apps ›</T>
      {PINNED.map(([n, c, g], i) => {
        const cx = 116 + (i % 6) * 42
        const cy = 78 + Math.floor(i / 6) * 52
        return (
          <g key={n}>
            <AppTile x={cx + 5} y={cy} s={26} c={c} glyph={g} r={7} />
            <T x={cx + 18} y={cy + 38} s={8} a="middle">{n}</T>
          </g>
        )
      })}
      <T x={116} y={196} s={10} w={700}>Recommended</T>
      <DocIcon x={118} y={202} s={0.6} /><T x={140} y={216} s={8.5}>notes.txt</T>
      <DocIcon x={206} y={202} s={0.6} /><T x={228} y={216} s={8.5}>Resume.docx</T>
      <rect x={100} y={224} width={280} height={32} rx={0} fill="#eceef4" />
      <circle cx={124} cy={240} r={9} fill={G.sky} /><T x={124} y={243.5} s={10} c="#fff" a="middle" w={600}>A</T>
      <T x={140} y={244} s={10}>Anika</T>
      <g stroke={G.ink} strokeWidth={1.8} fill="none" strokeLinecap="round"><path d="M353 233a7 7 0 1 0 5 0" transform="translate(0 0)" /><path d="M353 231v6" /></g>
      <WinTaskbar l={startTb} k={1} startActive />
    </g>
  ),
})

const LP: [string, string, Parameters<typeof AppTile>[0]['glyph']][] = [
  ['Browser', '#0ea5e9', 'compass'], ['Mail', '#6366f1', 'envelope'], ['Maps', '#22c55e', 'compass'], ['Photos', '#ec4899', 'petals'], ['Notes', '#f59e0b', 'lines'], ['Calendar', '#ef4444', 'cal'], ['Music', '#f43f5e', 'play'],
  ['Settings', '#64748b', 'gear'], ['Files', '#3b82f6', 'face'], ['Messages', '#22c55e', 'circle'], ['Clock', '#111827', 'circle'], ['Books', '#f97316', 'star'], ['Podcasts', '#a855f7', 'circle'], ['Reminders', '#ef4444', 'lines'],
  ['Calculator', '#475569', 'grid'], ['Preview', '#0ea5e9', 'petals'], ['TextEdit', '#e5e7eb', 'lines'], ['Terminal', '#111827', 'lines'], ['Stocks', '#111827', 'star'], ['Weather', '#38bdf8', 'circle'], ['Contacts', '#d97706', 'face'],
]
export const macLaunchpad = defineMock('mac-launchpad', {
  titleBn: 'ম্যাক লঞ্চপ্যাড: উপরে সার্চ, নিচে অ্যাপের আইকনের গ্রিড',
  regions: () => ({
    search: { x: 180, y: 14, w: 120, h: 22, r: 11, bn: 'লঞ্চপ্যাডের সার্চ বক্স' },
    apps: { x: 24, y: 52, w: 432, h: 216, r: 10, bn: 'অ্যাপের আইকনগুলো' },
  }),
  draw: () => (
    <g>
      <Wall mac />
      <rect width={W} height={H} fill="#0f0a2a" opacity=".55" />
      <Rc x={180} y={14} w={120} h={22} r={11} f="#fff" op={0.22} s="#fff" />
      <Magnifier x={192} y={19.5} c="#fff" />
      <T x={212} y={29} s={10} c="#fff" op={0.85}>Search</T>
      {LP.map(([n, c, g], i) => {
        const cx = 34 + (i % 7) * 62
        const cy = 58 + Math.floor(i / 7) * 70
        return (
          <g key={n}>
            <AppTile x={cx + 4} y={cy} s={42} c={c} glyph={g} r={10} />
            <T x={cx + 25} y={cy + 56} s={9} c="#fff" a="middle">{n}</T>
          </g>
        )
      })}
      {[0, 1].map((i) => <circle key={i} cx={232 + i * 16} cy={284} r={3} fill="#fff" opacity={i === 0 ? 1 : 0.4} />)}
    </g>
  ),
})
