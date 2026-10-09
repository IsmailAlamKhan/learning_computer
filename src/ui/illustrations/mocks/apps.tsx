import type { OsFlavor } from '../../../engine/types'
import { Chrome, Cursor, DocIcon, FolderIcon, G, Magnifier, Rc, T, defineMock } from './kit'

const FILES: [string, 'f' | 'd' | 'p'][] = [['Class notes', 'f'], ['Photos', 'f'], ['Resume.docx', 'd'], ['notes.txt', 'd'], ['Form.pdf', 'p'], ['Songs', 'f']]
function FileGrid({ x, y, cols = 3, cw = 108, ch = 84, sel = 3, os }: { x: number; y: number; cols?: number; cw?: number; ch?: number; sel?: number; os?: OsFlavor }) {
  return (
    <g>
      {FILES.map(([n, k], i) => {
        const cx = x + (i % cols) * cw
        const cy = y + Math.floor(i / cols) * ch
        return (
          <g key={n}>
            {i === sel && <Rc x={cx + 6} y={cy + 2} w={cw - 12} h={ch - 6} r={6} f={os === 'mac' ? '#d7e6ff' : '#dbeafe'} />}
            {k === 'f' && <FolderIcon x={cx + cw / 2 - 20} y={cy + 6} s={1.1} />}
            {k === 'd' && <DocIcon x={cx + cw / 2 - 14} y={cy + 5} s={1.3} />}
            {k === 'p' && <DocIcon x={cx + cw / 2 - 14} y={cy + 5} s={1.3} accent={G.red} />}
            <T x={cx + cw / 2} y={cy + 62} s={10} a="middle">{n}</T>
          </g>
        )
      })}
    </g>
  )
}
const SideItem = ({ x, y, w, label, on, mac, ico }: { x: number; y: number; w: number; label: string; on?: boolean; mac?: boolean; ico?: string }) => (
  <g>
    {on && <Rc x={x} y={y - 3} w={w} h={20} r={5} f={mac ? '#cfe0fb' : '#e0e7f3'} />}
    <rect x={x + 8} y={y + 1} width={10} height={10} rx={3} fill={ico ?? G.sky} opacity={on ? 1 : 0.7} />
    <T x={x + 25} y={y + 10} s={10} w={on ? 600 : 400}>{label}</T>
  </g>
)

/* ---------------------------------------------------------------- File Explorer ---------------------------------------------------------------- */
export const fileExplorer = defineMock('file-explorer', {
  titleBn: 'উইন্ডোজ ফাইল এক্সপ্লোরার: বাঁয়ে সাইডবার, উপরে অ্যাড্রেস বার, ডানে ফাইল ও ফোল্ডার',
  fixedOs: 'windows',
  regions: () => ({
    sidebar: { x: 6, y: 94, w: 114, h: 200, r: 0, bn: 'বাঁয়ের সাইডবার' },
    'address-bar': { x: 70, y: 66, w: 268, h: 22, r: 5, bn: 'অ্যাড্রেস বার' },
    files: { x: 126, y: 96, w: 346, h: 196, r: 4, bn: 'ফাইল ও ফোল্ডারের তালিকা' },
    'new-button': { x: 12, y: 35, w: 62, h: 24, r: 6, bn: 'নতুন (New) বোতাম' },
    'view-menu': { x: 152, y: 35, w: 62, h: 24, r: 6, bn: 'ভিউ (View) মেনু' },
  }),
  draw: () => (
    <Chrome x={6} y={6} w={468} h={288} os="windows" tabs={['Documents']}>
      <rect x={6} y={34} width={468} height={30} fill="#fff" />
      <Rc x={12} y={37} w={62} h={24} r={6} f={G.skySoft} />
      <T x={20} y={53} s={10.5} w={600} c={G.skyDark}>+ New ▾</T>
      {[84, 98].map((x) => <rect key={x} x={x} y={43} width={11} height={11} rx={3} fill="#c3c8d6" />)}
      <T x={120} y={53} s={10.5}>Sort ▾</T>
      <T x={158} y={53} s={10.5}>☰ View ▾</T>
      <rect x={6} y={64} width={468} height={30} fill="#fff" />
      {['←', '→', '↑'].map((c, i) => <T key={c} x={14 + i * 19} y={83} s={14} c={i === 1 ? '#b6bccb' : G.muted}>{c}</T>)}
      <Rc x={70} y={66} w={268} h={22} r={5} f="#f3f4f8" s="#d5d9e3" />
      <FolderIcon x={76} y={70} s={0.36} />
      <T x={92} y={81} s={10}>This PC  ›  Documents  ›</T>
      <Rc x={344} y={66} w={124} h={22} r={11} f="#f3f4f8" s="#d5d9e3" />
      <Magnifier x={352} y={72} s={0.8} />
      <T x={368} y={81} s={9.5} c={G.muted}>Search Documents</T>
      <rect x={6} y={94} width={114} height={200} fill="#f7f8fb" />
      {['Home', 'Desktop', 'Downloads', 'Documents', 'Pictures', 'This PC'].map((n, i) => <SideItem key={n} x={10} y={106 + i * 24} w={106} label={n} on={i === 3} ico={['#f59e0b', '#38bdf8', '#22c55e', '#38bdf8', '#a78bfa', '#64748b'][i]} />)}
      <FileGrid x={130} y={100} cw={113} sel={3} />
    </Chrome>
  ),
})

/* ---------------------------------------------------------------- Finder ---------------------------------------------------------------- */
export const finder = defineMock('finder', {
  titleBn: 'ম্যাকের ফাইন্ডার: বাঁয়ে সাইডবার, উপরে টুলবার, ডানে ফাইল, নিচে পাথ বার',
  fixedOs: 'mac',
  regions: () => ({
    sidebar: { x: 6, y: 62, w: 110, h: 202, r: 0, bn: 'বাঁয়ের সাইডবার' },
    'path-bar': { x: 6, y: 266, w: 468, h: 28, r: 0, bn: 'নিচের পাথ বার' },
    files: { x: 120, y: 64, w: 352, h: 198, r: 4, bn: 'ফাইল ও ফোল্ডারের তালিকা' },
    toolbar: { x: 6, y: 34, w: 468, h: 28, r: 0, bn: 'উপরের টুলবার' },
  }),
  draw: () => (
    <Chrome x={6} y={6} w={468} h={288} os="mac" title="Documents">
      <rect x={6} y={34} width={468} height={28} fill="#f1f1f5" />
      <g fill="none" stroke={G.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M24 42l-5 6 5 6M42 42l5 6-5 6" /></g>
      <Rc x={150} y={39} w={80} h={18} r={5} f="#dfe0e8" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={158 + i * 18} y={44} width={9} height={8} rx={2} fill={i === 0 ? G.muted : '#a8adbd'} />)}
      <Rc x={376} y={38} w={90} h={20} r={7} f="#fff" s="#d5d9e3" />
      <Magnifier x={384} y={43} s={0.8} />
      <T x={402} y={52} s={9.5} c={G.muted}>Search</T>
      <rect x={6} y={62} width={110} height={204} fill="#eceef6" />
      <T x={14} y={78} s={8.5} c={G.muted} w={700}>Favorites</T>
      {['Recents', 'Applications', 'Desktop', 'Documents', 'Downloads'].map((n, i) => <SideItem key={n} x={10} y={84 + i * 24} w={102} label={n} on={i === 3} mac ico="#3b82f6" />)}
      <T x={14} y={216} s={8.5} c={G.muted} w={700}>Locations</T>
      <SideItem x={10} y={222} w={102} label="Macintosh HD" mac ico="#94a3b8" />
      <FileGrid x={122} y={66} cw={116} ch={92} sel={3} os="mac" />
      <rect x={6} y={266} width={468} height={28} fill="#f1f1f5" />
      <rect x={6} y={266} width={468} height={1} fill="#d5d9e3" />
      {['Macintosh HD', 'Users', 'anika', 'Documents'].map((n, i) => {
        const x = [14, 112, 168, 224][i]
        return (
          <g key={n}>
            {i > 0 && <T x={x - 12} y={284} s={10} c={G.muted}>›</T>}
            {i === 0 ? <rect x={x} y={274} width={12} height={9} rx={2} fill="#94a3b8" /> : <FolderIcon x={x} y={274} s={0.3} c="#60a5fa" />}
            <T x={x + 16} y={284} s={9.5}>{n}</T>
          </g>
        )
      })}
    </Chrome>
  ),
})

/* ---------------------------------------------------------------- context menu ---------------------------------------------------------------- */
const CM_WIN = [['New', '›'], ['Open', 'Enter'], ['Copy', 'Ctrl+C'], ['Paste', 'Ctrl+V'], ['Rename', 'F2'], ['Delete', 'Del']]
const CM_MAC = [['New Folder', '⇧⌘N'], ['Open', '⌘O'], ['Copy', '⌘C'], ['Paste Item', '⌘V'], ['Rename', '↩'], ['Move to Trash', '⌘⌫']]
const CM_X = 176, CM_Y = 66, CM_W = 190, CM_ROW = 26
const cmBox = (i: number, bn: string) => ({ x: CM_X + 4, y: CM_Y + 6 + i * CM_ROW, w: CM_W - 8, h: CM_ROW, r: 5, bn })
export const contextMenu = defineMock('context-menu', {
  titleBn: 'ডান-ক্লিক মেনু: নতুন, খোলা, কপি, পেস্ট, রিনেম ও ডিলিট',
  regions: () => ({
    new: cmBox(0, 'নতুন (New) অপশন'),
    copy: cmBox(2, 'কপি (Copy) অপশন'),
    paste: cmBox(3, 'পেস্ট (Paste) অপশন'),
    rename: cmBox(4, 'রিনেম (Rename) অপশন'),
    delete: cmBox(5, 'ডিলিট (Delete) অপশন'),
  }),
  draw: (os) => {
    const rows = os === 'mac' ? CM_MAC : CM_WIN
    return (
      <g>
        <Chrome x={6} y={6} w={468} h={288} os={os} title="Documents" />
        <FileGrid x={14} y={40} cw={150} ch={120} sel={-1} os={os} />
        <Rc x={CM_X} y={CM_Y} w={CM_W} h={CM_ROW * 6 + 12} r={os === 'mac' ? 10 : 8} f="#fff" s="#cfd3dc" filter />
        {rows.map(([n, k], i) => (
          <g key={n}>
            <rect x={CM_X + 14} y={CM_Y + 6 + i * CM_ROW + 7} width={10} height={10} rx={3} fill={i === 5 ? G.red : G.sky} opacity={0.75} />
            <T x={CM_X + 32} y={CM_Y + 6 + i * CM_ROW + 17} s={11}>{n}</T>
            <T x={CM_X + CM_W - 14} y={CM_Y + 6 + i * CM_ROW + 17} s={9.5} c={G.muted} a="end">{k}</T>
          </g>
        ))}
        <Cursor x={CM_X - 6} y={CM_Y - 10} />
      </g>
    )
  },
})

/* ---------------------------------------------------------------- Save dialog ---------------------------------------------------------------- */
export const saveDialog = defineMock('save-dialog', {
  titleBn: '“Save As” ডায়ালগ: কোন ফোল্ডারে, কী নামে, তারপর Save বোতাম',
  regions: () => ({
    folder: { x: 50, y: 40, w: 380, h: 28, r: 6, bn: 'ফোল্ডার বাছাইয়ের জায়গা' },
    'file-name': { x: 50, y: 188, w: 380, h: 28, r: 6, bn: 'ফাইলের নাম লেখার ঘর' },
    'save-button': { x: 350, y: 246, w: 76, h: 26, r: 7, bn: 'সেভ (Save) বোতাম' },
  }),
  draw: (os) => (
    <g>
      <rect width={480} height={300} fill={os === 'mac' ? 'url(#mk-wall-m)' : 'url(#mk-wall-w)'} />
      <Chrome x={40} y={14} w={400} h={266} os={os} title="Save As" />
      <T x={54} y={58} s={10.5} c={G.muted}>{os === 'mac' ? 'Where:' : 'Save in:'}</T>
      <Rc x={128} y={43} w={292} h={22} r={5} f="#fff" s="#c8ccd8" />
      <FolderIcon x={134} y={47} s={0.4} />
      <T x={154} y={58} s={10.5}>Documents</T>
      <T x={406} y={58} s={10} c={G.muted}>▾</T>
      <Rc x={54} y={74} w={372} h={104} r={5} f="#fff" s="#dfe2ea" />
      {[['Class notes', 'f'], ['Photos', 'f'], ['Resume.docx', 'd'], ['Form.pdf', 'p']].map(([n, k], i) => (
        <g key={n}>
          {k === 'f' ? <FolderIcon x={64} y={80 + i * 22} s={0.42} /> : <DocIcon x={66} y={79 + i * 22} s={0.55} accent={k === 'p' ? G.red : G.sky} />}
          <T x={86} y={92 + i * 22} s={10}>{n}</T>
        </g>
      ))}
      <T x={54} y={206} s={10.5} c={G.muted}>{os === 'mac' ? 'Save As:' : 'File name:'}</T>
      <Rc x={128} y={191} w={292} h={22} r={5} f="#fff" s={G.sky} sw={1.6} />
      <T x={136} y={206} s={11}>notes.txt</T>
      <rect x={186} y={195} width={1.4} height={14} fill={G.ink} />
      <T x={54} y={235} s={10.5} c={G.muted}>{os === 'mac' ? 'Format:' : 'Save as type:'}</T>
      <Rc x={128} y={220} w={292} h={20} r={5} f="#f3f4f8" s="#c8ccd8" />
      <T x={136} y={234} s={10}>Text Documents (*.txt)</T>
      <Rc x={270} y={246} w={72} h={26} r={7} f="#f3f4f8" s="#c8ccd8" />
      <T x={306} y={263} s={11} a="middle">Cancel</T>
      <Rc x={350} y={246} w={76} h={26} r={7} f={G.sky} />
      <T x={388} y={263} s={11} a="middle" c="#fff" w={600}>Save</T>
    </g>
  ),
})

/* ---------------------------------------------------------------- Notepad / TextEdit ---------------------------------------------------------------- */
export const notepad = defineMock('notepad', {
  titleBn: 'নোটপ্যাড: উপরে টাইটেল ও ফাইল মেনু, নিচে লেখার জায়গা',
  regions: (os) => ({
    text: { x: 26, y: 66, w: 428, h: 190, r: 4, bn: 'লেখার জায়গা' },
    'file-menu': { x: 26, y: 41, w: 40, h: 22, r: 5, bn: 'ফাইল (File) মেনু' },
    title: os === 'mac' ? { x: 130, y: 16, w: 220, h: 24, r: 5, bn: 'টাইটেল বার (ফাইলের নাম)' } : { x: 30, y: 16, w: 200, h: 24, r: 5, bn: 'টাইটেল বার (ফাইলের নাম)' },
  }),
  draw: (os) => (
    <g>
      <rect width={480} height={300} fill={os === 'mac' ? 'url(#mk-wall-m)' : 'url(#mk-wall-w)'} />
      <Chrome x={20} y={14} w={440} h={272} os={os} title={os === 'mac' ? 'notes.txt — Edited' : 'notes.txt - Notepad'} />
      <rect x={20} y={42} width={440} height={22} fill="#fff" />
      {['File', 'Edit', 'View'].map((m, i) => <T key={m} x={32 + i * 40} y={57} s={10.5}>{m}</T>)}
      <rect x={20} y={64} width={440} height={1} fill="#e5e7ef" />
      {['Shopping list', '- rice', '- eggs', '- tea'].map((l, i) => <T key={l} x={32} y={86 + i * 20} s={12.5} mono>{l}</T>)}
      <rect x={76} y={131} width={1.4} height={15} fill={G.ink} />
      <rect x={20} y={264} width={440} height={22} fill="#f3f4f8" />
      <T x={32} y={279} s={9} c={G.muted}>Ln 4, Col 6      100%      UTF-8</T>
    </g>
  ),
})

/* ---------------------------------------------------------------- Browser ---------------------------------------------------------------- */
export const browser = defineMock('browser', {
  titleBn: 'ওয়েব ব্রাউজার: উপরে ট্যাব, ব্যাক বোতাম ও অ্যাড্রেস বার, নিচে ওয়েবপেজ',
  regions: () => ({
    'address-bar': { x: 88, y: 38, w: 316, h: 24, r: 12, bn: 'অ্যাড্রেস বার' },
    tabs: { x: 12, y: 8, w: 222, h: 26, r: 6, bn: 'ট্যাব' },
    back: { x: 12, y: 38, w: 24, h: 24, r: 12, bn: 'ব্যাক (পেছনে যাওয়ার) বোতাম' },
    'search-box': { x: 96, y: 132, w: 288, h: 36, r: 18, bn: 'ওয়েবপেজের সার্চ বক্স' },
    padlock: { x: 94, y: 41, w: 18, h: 18, r: 9, bn: 'তালা (নিরাপদ সংযোগ) আইকন' },
  }),
  draw: (os) => (
    <Chrome x={6} y={6} w={468} h={288} os={os} tabs={['Home', 'Mail']}>
      <rect x={6} y={34} width={468} height={32} fill="#fff" />
      <g fill="none" stroke={G.ink} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 50h-12M23 44l-6 6 6 6" /><path d="M44 50h12M51 44l6 6-6 6" opacity={0.4} /><path d="M80 44.500a6 6 0 1 0 1.500 6M81 41v4h-4" transform="translate(0 0)" />
      </g>
      <Rc x={88} y={38} w={316} h={24} r={12} f="#eef0f6" />
      <g transform="translate(98 44)"><rect y="5" width="10" height="8" rx="2" fill={G.ok} /><path d="M2 5V3.500a3 3 0 0 1 6 0V5" fill="none" stroke={G.ok} strokeWidth="1.600" /></g>
      <T x={118} y={54} s={11}>www.example.com</T>
      <g fill="none" stroke={G.muted} strokeWidth={1.6} strokeLinecap="round"><path d="M425 44h14M425 50h14M425 56h14" /></g>
      <rect x={6} y={66} width={468} height={228} fill="#fff" />
      <rect x={6} y={66} width={468} height={1} fill="#e5e7ef" />
      <T x={240} y={118} s={26} a="middle" w={700} c={G.violet}>Find<tspan fill={G.coral}>It</tspan></T>
      <Rc x={96} y={132} w={288} h={36} r={18} f="#fff" s="#c8ccd8" sw={1.4} />
      <Magnifier x={112} y={144} s={0.95} />
      <T x={134} y={155} s={11.5} c={G.muted}>Search the web</T>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={120 + i * 62} y={196} width={44} height={44} rx={12} fill={['#e0f2fe', '#fce7f3', '#fef3c7', '#dcfce7'][i]} />
          <rect x={129 + i * 62} y={205} width={26} height={26} rx={7} fill={['#38bdf8', '#f472b6', '#f59e0b', '#4ade80'][i]} />
        </g>
      ))}
    </Chrome>
  ),
})

/* ---------------------------------------------------------------- Mail ---------------------------------------------------------------- */
export const mail = defineMock('mail', {
  titleBn: 'ইমেইল অ্যাপ: বাঁয়ে ফোল্ডার ও কম্পোজ বোতাম, ডানে নতুন মেইলের ফর্ম',
  regions: () => ({
    folders: { x: 6, y: 68, w: 106, h: 140, r: 0, bn: 'ইনবক্স, সেন্ট ইত্যাদি ফোল্ডার' },
    compose: { x: 14, y: 38, w: 92, h: 26, r: 13, bn: 'নতুন মেইল লেখার (Compose) বোতাম' },
    to: { x: 120, y: 40, w: 348, h: 26, r: 5, bn: 'প্রাপকের ঠিকানার (To) ঘর' },
    subject: { x: 120, y: 70, w: 348, h: 26, r: 5, bn: 'বিষয়ের (Subject) ঘর' },
    attach: { x: 176, y: 258, w: 70, h: 26, r: 13, bn: 'ফাইল জোড়ার (Attach) বোতাম' },
  }),
  draw: (os) => (
    <Chrome x={6} y={6} w={468} h={288} os={os} title="Mail">
      <rect x={6} y={34} width={106} height={260} fill="#f4f5fa" />
      <Rc x={14} y={38} w={92} h={26} r={13} f={G.sky} />
      <T x={60} y={55} s={11} w={600} c="#fff" a="middle">✎ Compose</T>
      {[['Inbox', '3'], ['Sent', ''], ['Drafts', '1'], ['Trash', '']].map(([n, c], i) => (
        <g key={n}>
          {i === 0 && <Rc x={10} y={72} w={98} h={22} r={5} f="#dbeafe" />}
          <rect x={18} y={78 + i * 24 - 0} width={10} height={9} rx={2} fill={i === 0 ? G.sky : G.muted} />
          <T x={34} y={87 + i * 24} s={10.5} w={i === 0 ? 600 : 400}>{n}</T>
          {c && <T x={102} y={87 + i * 24} s={9.5} a="end" c={G.muted}>{c}</T>}
        </g>
      ))}
      <T x={124} y={57} s={10} c={G.muted}>To</T>
      <Rc x={170} y={44} w={294} h={20} r={5} f="#fff" s="#d5d9e3" />
      <Rc x={176} y={47} w={118} h={14} r={7} f="#e0e7ff" />
      <T x={184} y={57.500} s={9}>anika@example.com</T>
      <T x={124} y={87} s={10} c={G.muted}>Subject</T>
      <Rc x={170} y={74} w={294} h={20} r={5} f="#fff" s="#d5d9e3" />
      <T x={178} y={88} s={10.5}>Class notes</T>
      <Rc x={120} y={102} w={348} h={142} r={6} f="#fff" s="#e5e7ef" />
      {['Hi Anika,', 'Here are the notes from class.', 'See you tomorrow!'].map((l, i) => <T key={l} x={130} y={122 + i * 18} s={10.5}>{l}</T>)}
      <Rc x={120} y={256} w={52} h={26} r={13} f={G.sky} />
      <T x={146} y={273} s={10.5} w={600} c="#fff" a="middle">Send</T>
      <Rc x={176} y={258} w={70} h={26} r={13} f="#f3f4f8" s="#d5d9e3" />
      <g transform="translate(184 264)" fill="none" stroke={G.ink} strokeWidth={1.5} strokeLinecap="round"><path d="M9 3.500l-6 6a3 3 0 0 0 4.300 4.200l7-7a2 2 0 0 0-2.800-2.800l-7 7" transform="scale(.8)" /></g>
      <T x={202} y={275} s={10}>Attach</T>
    </Chrome>
  ),
})

