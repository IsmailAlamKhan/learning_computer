import { ART } from '../../ui/illustrations/art'
import { MOCKS } from '../../ui/illustrations/mocks'
import { ART_NAMES, MOCK_REGIONS, type MockName } from '../../ui/illustrations/names'
import { DemoView } from '../../ui/illustrations/demos'
import { CodeVisualView } from '../../ui/illustrations/codeVisual'
import type { Visual } from '../../engine/types'

type CodeV = Extract<Visual, { kind: 'code' }>
const CODE_SAMPLES: CodeV[] = [
  { kind: 'code', lang: 'python', lines: [{ code: 'name = "Anika"', noteBn: 'একটি নাম মনে রাখলাম' }, { code: 'age = 18', noteBn: 'সংখ্যা রাখলাম' }, { code: '# এখন দেখাই', noteBn: undefined }, { code: 'print("Hello", name)', noteBn: 'পর্দায় দেখাল' }], output: ['Hello Anika'] },
  { kind: 'code', lang: 'html', browserPreview: true, lines: [{ code: '<h1 style="color:teal">স্বাগতম</h1>', noteBn: 'বড় শিরোনাম' }, { code: '<p>আমার প্রথম পেজ</p>', noteBn: 'একটি অনুচ্ছেদ' }, { code: '<button>ক্লিক</button>', noteBn: 'একটি বোতাম' }] },
  { kind: 'code', lang: 'css', browserPreview: true, lines: [{ code: 'h1 {', noteBn: 'সব শিরোনামের জন্য' }, { code: '  color: #e8505b;', noteBn: 'রং কোরাল' }, { code: '  font-size: 32px;', noteBn: 'বড় অক্ষর' }, { code: '}' }] },
  { kind: 'code', lang: 'shell', lines: [{ code: 'cd Documents', noteBn: 'ফোল্ডারে ঢুকলাম' }, { code: 'ls -l  # তালিকা', noteBn: 'ফাইলের তালিকা' }], output: ['notes.txt', 'Resume.docx'] },
  { kind: 'code', lang: 'javascript', lines: [{ code: 'const total = 5 * 3;', noteBn: 'গুণ করলাম' }, { code: 'console.log(`মোট: ${total}`);', noteBn: 'ফলাফল দেখাল' }], output: ['মোট: 15'] },
]

/** Developer gallery: every illustration, every mini-screenshot with each highlight, every gesture demo. Route: /#/demo/art */
export default function ArtGallery() {
  const mocks = Object.keys(MOCK_REGIONS) as MockName[]
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Art gallery ({ART_NAMES.length} illustrations)</h1>
      <section aria-label="illustrations" className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6" data-testid="art-grid">
        {ART_NAMES.map((n) => {
          const A = ART[n]
          return (
            <figure key={n} className="flex flex-col items-center gap-1 rounded-2xl p-3" style={{ background: 'linear-gradient(145deg,#f5f0ff,#e9f7f4)' }}>
              <A size={120} title={n} />
              <figcaption className="text-xs" style={{ color: '#1e1b3a' }}>{n}</figcaption>
            </figure>
          )
        })}
      </section>
      <h2 className="text-xl font-bold">Mini-screenshots (mocks)</h2>
      {mocks.map((m) => {
        const M = MOCKS[m]
        return (
          <section key={m} className="space-y-3" data-testid={`mock-${m}`}>
            <h3 className="font-bold">{m}</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <M os={m.startsWith('mac') ? 'mac' : 'windows'} />
              {MOCK_REGIONS[m].map((r) => (
                <div key={r} className="min-w-0">
                  <p className="text-xs">{r}</p>
                  <M os={m.startsWith('mac') ? 'mac' : 'windows'} highlight={r} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
      <h2 className="text-xl font-bold">Gesture demos</h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" data-testid="demo-grid">
        {(['click', 'double-click', 'right-click', 'drag', 'scroll', 'type', 'keys', 'two-finger-tap', 'two-finger-scroll'] as const).map((g) => (
          <div key={g} className="min-w-0">
            <p className="text-xs">{g}</p>
            <DemoView visual={{ kind: 'demo', gesture: g, os: 'windows', keys: 'mod+c', textBn: 'আমার প্রথম লেখা, কিবোর্ডে টাইপ করছি।', captionBn: 'ক্যাপশনের নমুনা' }} />
          </div>
        ))}
        <div><p className="text-xs">keys mac (mod+shift+4)</p><DemoView visual={{ kind: 'demo', gesture: 'keys', os: 'mac', keys: 'mod+shift+4' }} /></div>
        <div><p className="text-xs">right-click mac, mac-dock</p><DemoView visual={{ kind: 'demo', gesture: 'right-click', os: 'mac' }} /></div>
        <div><p className="text-xs">drag on win-desktop</p><DemoView visual={{ kind: 'demo', gesture: 'drag', os: 'windows', mock: 'win-desktop' }} /></div>
      </div>
      <h2 className="text-xl font-bold">Code visuals</h2>
      <div className="grid gap-6 lg:grid-cols-2" data-testid="code-grid">
        {CODE_SAMPLES.map((v, i) => (
          <div key={i} className="min-w-0"><p className="text-xs">{v.lang}</p><CodeVisualView visual={v} /></div>
        ))}
      </div>
    </div>
  )
}
