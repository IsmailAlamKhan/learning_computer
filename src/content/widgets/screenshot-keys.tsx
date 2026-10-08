import { useProgress } from '../../state/store'
import { Keycap } from './parts/KeyboardSvg'
import { SHOT_ROWS } from './lib/screenshotKeys'

/** Screenshot shortcuts for Windows and Mac as keycaps; the learner's own OS is shown first. */
export default function ScreenshotKeys() {
  const { profile } = useProgress()
  const mine = profile.os === 'mac' ? 'mac' : 'windows'
  const order: ('windows' | 'mac')[] = mine === 'mac' ? ['mac', 'windows'] : ['windows', 'mac']
  return (
    <section className="card space-y-4" aria-label="স্ক্রিনশটের শর্টকাট" data-widget="screenshot-keys">
      <p className="m-0">স্ক্রিনশট (Screenshot) মানে পর্দায় এখন যা দেখা যাচ্ছে তার ছবি তুলে রাখা। কোন কী একসাথে চাপতে হবে দেখুন:</p>
      {order.map((os) => (
        <div key={os} data-os={os} className="space-y-2">
          <h4 className="m-0 font-semibold">
            {os === 'windows' ? 'Windows' : 'Mac'} {os === mine && <span className="chip" style={{ background: 'var(--c-brand)', color: 'var(--c-brand-ink)' }}>আপনার</span>}
          </h4>
          <ul className="m-0 list-none space-y-2 p-0">
            {SHOT_ROWS[os].map((r) => (
              <li key={r.id} data-row={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex flex-wrap items-center gap-1">
                  {r.keys.map((k, i) => (
                    <span key={i} className="inline-flex items-center gap-1">
                      {i > 0 && <span aria-hidden="true">+</span>}
                      <Keycap active={os === mine}>{k}</Keycap>
                    </span>
                  ))}
                </span>
                <span>
                  <strong>{r.whatBn}।</strong> <span className="text-muted">{r.whereBn}।</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
