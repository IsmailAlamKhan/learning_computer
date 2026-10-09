import { ART } from '../../ui/illustrations/art'
import { MOCKS } from '../../ui/illustrations/mocks'
import { ART_NAMES, MOCK_REGIONS, type MockName } from '../../ui/illustrations/names'
import { DemoView } from '../../ui/illustrations/demos'

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
            <div className="flex flex-wrap gap-4">
              <M os={m.startsWith('mac') ? 'mac' : 'windows'} />
              {MOCK_REGIONS[m].map((r) => (
                <div key={r}>
                  <p className="text-xs">{r}</p>
                  <M os={m.startsWith('mac') ? 'mac' : 'windows'} highlight={r} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
      <h2 className="text-xl font-bold">Gesture demos</h2>
      <div className="flex flex-wrap gap-6">
        {(['click', 'double-click', 'right-click', 'drag', 'scroll', 'type', 'keys', 'two-finger-tap', 'two-finger-scroll'] as const).map((g) => (
          <div key={g} className="w-72">
            <p className="text-xs">{g}</p>
            <DemoView visual={{ kind: 'demo', gesture: g, mock: 'file-explorer', os: 'windows', keys: 'mod+c', textBn: 'নমুনা' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
