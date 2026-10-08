/** "Extensions Marketplace" (Module 18): a light, simulated list of editor extensions with publisher / install counts and a verification checklist. */
import { useState } from 'react'
import { registerApp } from '../registry'
import { useDesktop } from '../../DesktopContext'
import { installExtension, useExtensions } from '../extra-support/toolState'

export interface Ext {
  id: string
  name: string
  publisher: string
  verified: boolean
  installs: string
  rating: string
  about: string
  /** a look-alike / suspicious listing: installing is blocked in the practice */
  trap?: boolean
}

export const EXTENSIONS: Ext[] = [
  { id: 'python-support', name: 'Python Support', publisher: 'Practice Foundation', verified: true, installs: '41.2M', rating: '4.6', about: 'Colours, hints and a Run button for Python files.' },
  { id: 'python-support-pro', name: 'Python Support PRO (FREE!!)', publisher: 'quick-fix-4u', verified: false, installs: '312', rating: '2.1', about: 'Best python tool!!! Install now for free boost!!!', trap: true },
  { id: 'live-preview', name: 'Live Preview Server', publisher: 'Practice Web Tools', verified: true, installs: '28.4M', rating: '4.7', about: 'Shows your HTML page in the browser and refreshes it when you save.' },
  { id: 'bangla-pack', name: 'Bangla Language Pack', publisher: 'Practice Foundation', verified: true, installs: '3.1M', rating: '4.4', about: 'Shows the editor menus in Bangla (optional).' },
]

/** Is this listing safe to install? (verified publisher + a large number of installs). Pure, unit-tested. */
export function looksTrustworthy(e: Ext): boolean {
  const n = parseFloat(e.installs)
  const mult = /M$/i.test(e.installs) ? 1e6 : /K$/i.test(e.installs) ? 1e3 : 1
  return e.verified && n * mult >= 1e6 && !e.trap
}

export function ExtensionsApp() {
  const d = useDesktop()
  const installed = useExtensions(d.vfs)
  const [warn, setWarn] = useState<string | null>(null)
  const emit = (event: string) => d.emit({ type: 'custom', event })
  return (
    <div className="h-full overflow-auto bg-white p-4 text-sm text-gray-900" data-coach="ext-window">
      <h1 className="text-lg font-semibold">Extensions Marketplace</h1>
      <p className="mt-1 text-gray-600">In the real editor this is the Extensions panel (the blocks icon on the left side).</p>
      <div className="mt-3 rounded border border-sky-300 bg-sky-50 p-3" data-coach="ext-checklist">
        <p className="font-semibold">Before you install, check:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Publisher is the expected, trusted one (look for the verified tick)</li>
          <li>Install count is large (millions, not hundreds)</li>
          <li>Rating is good and the name matches exactly what you need</li>
        </ul>
      </div>
      <ul className="mt-3 space-y-2">
        {EXTENSIONS.map((e) => {
          const has = installed.includes(e.id)
          return (
            <li key={e.id} data-coach={`ext-item-${e.id}`} className="flex items-start gap-3 rounded border border-gray-200 p-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{e.name}</div>
                <div className="text-xs text-gray-600">
                  <span data-coach={`ext-publisher-${e.id}`}>{e.publisher}</span> {e.verified ? <span className="text-blue-700">✔ verified</span> : <span className="text-red-700">not verified</span>}
                  {' · '}
                  {e.installs} installs · ★ {e.rating}
                </div>
                <div className="mt-1 text-gray-700">{e.about}</div>
              </div>
              {has ? (
                <span data-coach={`ext-installed-${e.id}`} className="rounded bg-green-100 px-3 py-2 text-green-800">
                  Installed ✓
                </span>
              ) : (
                <button
                  type="button"
                  data-coach={`ext-install-${e.id}`}
                  className="min-h-9 rounded bg-blue-600 px-4 text-white hover:bg-blue-700"
                  onClick={() => {
                    if (e.trap) {
                      setWarn(e.id)
                      emit('extension-trap')
                      return
                    }
                    installExtension(d.vfs, e.id)
                    emit(`extension-installed:${e.id}`)
                  }}
                >
                  Install
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {warn && (
        <div role="alert" data-coach="ext-trap-note" className="mt-3 rounded border-2 border-green-700 bg-green-50 p-3 text-green-900">
          <p className="font-semibold">অনুশীলনে এটি ইনস্টল হলো না — আপনি ঠিক জায়গায় থেমেছেন।</p>
          <p>
            প্রকাশক অচেনা (verified নয়), ইনস্টল মাত্র কয়েকশো, রেটিং কম, আর নামটি আসল এক্সটেনশনের নকল। আসল জীবনে এমন এক্সটেনশন বাদ দিন।
          </p>
          <button type="button" className="mt-2 min-h-9 rounded bg-green-700 px-3 text-white" onClick={() => setWarn(null)}>
            বুঝেছি
          </button>
        </div>
      )}
    </div>
  )
}

export function register() {
  registerApp({
    id: 'extensions',
    title: () => 'Extensions Marketplace',
    descriptionBn: 'কোড এডিটরের জন্য অতিরিক্ত সুবিধা (এক্সটেনশন) খুঁজে ইনস্টল করার অনুশীলন-জানালা',
    icon: ({ size }) => (
      <svg width={size ?? 40} height={size ?? 40} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <rect x="6" y="6" width="36" height="36" rx="6" fill="#4f46e5" />
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#c7d2fe" />
        <rect x="26" y="12" width="10" height="10" rx="2" fill="#c7d2fe" />
        <rect x="12" y="26" width="10" height="10" rx="2" fill="#c7d2fe" />
        <rect x="28" y="24" width="10" height="10" rx="2" fill="#fcd34d" transform="rotate(12 33 29)" />
      </svg>
    ),
    component: ExtensionsApp,
    defaultSize: { w: 560, h: 460 },
  })
}
