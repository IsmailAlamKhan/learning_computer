/**
 * Module 18: clearly fictional stand-ins for the official download pages of a code editor, Python and Node.js.
 * Addresses end in `.example` (never a real site); a banner tells the learner the real address. No brand logos.
 * Each page hands out a practice installer (see extra-support/setupModel.ts) and carries an "Ad" decoy button.
 */
import { useState, type ReactNode } from 'react'
import { useDesktop } from '../../../DesktopContext'
import { registerSite, type SiteProps } from '../sites'
import { registerSearchEntry } from '../searchIndex'
import { INSTALLER_FILES } from '../../extra-support/setupModel'

export const EDITOR_URL = 'https://editor-official.example/download'
export const PYTHON_URL = 'https://python-official.example/downloads'
export const NODE_URL = 'https://node-official.example/'
export const DECOY_URL = 'https://editor-d0wnload-free.example/'

const same = (a: string) => (url: string) => url.replace(/\/$/, '') === a.replace(/\/$/, '')

function PracticeBanner({ real }: { real: string }) {
  return (
    <div data-coach="m18-banner" className="border-b border-amber-400 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      এটি অনুশীলনের নকল পাতা — আসলটির ঠিকানা: <strong className="font-mono">{real}</strong>
    </div>
  )
}

function AdBox({ go, emit }: Pick<SiteProps, 'go' | 'emit'>) {
  return (
    <aside className="mt-8 rounded border border-dashed border-gray-400 p-3 text-center" data-coach="m18-ad-box">
      <div className="text-[10px] font-bold tracking-wide text-gray-500">AD · বিজ্ঞাপন</div>
      <button
        type="button"
        data-coach="m18-ad-trap"
        onClick={() => {
          emit?.('browser-ad-trap')
          go(DECOY_URL)
        }}
        className="mt-1 min-h-12 w-full rounded bg-lime-400 text-xl font-black text-black"
      >
        ▶ DOWNLOAD NOW — 100% FREE FAST!!!
      </button>
    </aside>
  )
}

function Shell({ real, title, children, go, emit }: { real: string; title: string; children: ReactNode } & Pick<SiteProps, 'go' | 'emit'>) {
  return (
    <div className="min-h-full bg-white text-gray-900" lang="en">
      <PracticeBanner real={real} />
      <header className="bg-slate-800 px-5 py-3 text-lg font-semibold text-white">{title}</header>
      <main className="mx-auto max-w-2xl px-5 py-5">
        {children}
        <AdBox go={go} emit={emit} />
      </main>
    </div>
  )
}

function EditorSite({ go, emit, download }: SiteProps) {
  const d = useDesktop()
  const win = d.os === 'windows'
  const file = INSTALLER_FILES[d.os].vscode
  return (
    <Shell real="code.visualstudio.com" title="Practice Editor" go={go} emit={emit}>
      <h1 className="text-2xl font-bold">Download Practice Editor</h1>
      <p className="mt-2 text-gray-700">Free code editor for {win ? 'Windows, Mac and Linux' : 'Mac, Windows and Linux'}. Your computer was detected automatically.</p>
      <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4">
        <button type="button" data-coach="m18-download-editor" onClick={() => download?.(file)} className="min-h-12 rounded bg-blue-700 px-6 text-lg font-semibold text-white">
          Download for {win ? 'Windows' : 'macOS'}
        </button>
        <p className="mt-2 text-sm text-gray-600">{win ? 'User Installer · x64 · Stable' : 'Universal · Stable'}</p>
        <p className="mt-1 font-mono text-xs text-gray-500">{file}</p>
      </div>
      <p className="mt-3 text-sm text-gray-600">Other downloads: {win ? 'macOS, Linux' : 'Windows, Linux'} (not needed for practice).</p>
    </Shell>
  )
}

function PythonSite({ go, emit, download }: SiteProps) {
  const d = useDesktop()
  const win = d.os === 'windows'
  const file = INSTALLER_FILES[d.os].python
  return (
    <Shell real="www.python.org" title="Practice Python" go={go} emit={emit}>
      <h1 className="text-2xl font-bold">Download the latest version for {win ? 'Windows' : 'macOS'}</h1>
      <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4">
        <button type="button" data-coach="m18-download-python" onClick={() => download?.(file)} className="min-h-12 rounded bg-yellow-400 px-6 text-lg font-semibold text-black">
          Download Python 3.12.4
        </button>
        <p className="mt-1 font-mono text-xs text-gray-500">{file}</p>
      </div>
      <p className="mt-3 text-sm text-gray-600">Looking for Python with a different OS? {win ? 'macOS' : 'Windows'}, Linux — not needed for practice.</p>
    </Shell>
  )
}

function NodeSite({ go, emit, download }: SiteProps) {
  const d = useDesktop()
  const file = INSTALLER_FILES[d.os].node
  const [note, setNote] = useState(false)
  return (
    <Shell real="nodejs.org" title="Practice Node.js" go={go} emit={emit}>
      <h1 className="text-2xl font-bold">Download Node.js</h1>
      <p className="mt-2 text-gray-700">Run JavaScript outside the browser.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border-2 border-green-700 bg-green-50 p-4">
          <div className="text-xs font-bold text-green-800">LTS · RECOMMENDED FOR MOST USERS</div>
          <button type="button" data-coach="m18-download-node-lts" onClick={() => download?.(file)} className="mt-2 min-h-11 rounded bg-green-700 px-4 font-semibold text-white">
            Download v22.12.0 LTS
          </button>
          <p className="mt-1 font-mono text-xs text-gray-600">{file}</p>
        </div>
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          <div className="text-xs font-bold text-gray-600">CURRENT · LATEST FEATURES</div>
          <button type="button" data-coach="m18-download-node-current" onClick={() => setNote(true)} className="mt-2 min-h-11 rounded bg-gray-700 px-4 font-semibold text-white">
            Download v23.5.0
          </button>
          {note && (
            <p data-coach="m18-current-note" role="note" className="mt-2 text-xs text-amber-900">
              (অনুশীলন) Current মানে নতুন-নতুন ফিচারের পরীক্ষামূলক সংস্করণ। শেখার জন্য সবসময় LTS (Long Term Support — দীর্ঘ সময় সমর্থিত, স্থিতিশীল) নিন।
            </p>
          )}
        </div>
      </div>
    </Shell>
  )
}

function DecoySite({ go }: SiteProps) {
  const [gotcha, setGotcha] = useState(false)
  return (
    <div className="min-h-full bg-fuchsia-100 p-5 text-center" lang="en" data-coach="m18-decoy">
      <h1 className="text-3xl font-black text-fuchsia-700">GET EDITOR PRO FREE!!! FASTEST DOWNLOAD!!!</h1>
      <p className="mt-2 text-lg font-bold text-red-600">Your computer needs an UPDATE NOW!</p>
      <button type="button" data-coach="m18-decoy-download" onClick={() => setGotcha(true)} className="mt-4 min-h-14 rounded bg-green-500 px-8 text-2xl font-black text-white">
        DOWNLOAD
      </button>
      {gotcha && (
        <div role="alert" data-coach="m18-decoy-gotcha" className="mx-auto mt-4 max-w-md rounded-lg border-2 border-green-700 bg-green-50 p-3 text-left text-sm text-green-900">
          <p className="font-semibold">এটি শেখার জন্য বানানো ভুয়া পাতা — কিছুই নামেনি।</p>
          <p>ঠিকানাটি দেখুন: editor-d0wnload-free — এখানে o-এর জায়গায় শূন্য (0), আর নামটি আসল ঠিকানা নয়। বিজ্ঞাপনের বোতাম থেকে এমন পাতায় আসা যায়। আসল জীবনে এখান থেকে নামালে ক্ষতিকর প্রোগ্রাম ঢুকতে পারে।</p>
          <button type="button" data-coach="m18-decoy-back" className="mt-2 min-h-9 rounded bg-green-700 px-3 text-white" onClick={() => go(EDITOR_URL)}>
            অফিসিয়াল পাতায় ফিরে যাই
          </button>
        </div>
      )}
    </div>
  )
}

registerSite(same(EDITOR_URL), EditorSite, 'Practice Editor – Download')
registerSite(same(PYTHON_URL), PythonSite, 'Practice Python – Downloads')
registerSite(same(NODE_URL), NodeSite, 'Practice Node.js – Download')
registerSite(same(DECOY_URL), DecoySite, 'GET EDITOR PRO FREE')

registerSearchEntry({
  url: EDITOR_URL,
  title: 'Practice Editor – Download the free code editor',
  snippet: 'Official download page of Practice Editor, a free code editor for Windows and Mac.',
  keywords: ['code', 'editor', 'download', 'vscode', 'visual', 'studio', 'কোড', 'এডিটর', 'ডাউনলোড'],
  rank: 6,
})
registerSearchEntry({
  url: PYTHON_URL,
  title: 'Practice Python – Downloads',
  snippet: 'Official download page for Python. Download the latest version for your computer.',
  keywords: ['python', 'download', 'downloads', 'পাইথন', 'ডাউনলোড'],
  rank: 6,
})
registerSearchEntry({
  url: NODE_URL,
  title: 'Practice Node.js – Download Node.js',
  snippet: 'Official download page for Node.js. Choose the LTS version, recommended for most users.',
  keywords: ['node', 'nodejs', 'node.js', 'download', 'javascript', 'নোড', 'ডাউনলোড'],
  rank: 6,
})
registerSearchEntry({
  url: DECOY_URL,
  title: 'Download Editor Pro FREE – fastest!',
  snippet: 'Get the editor now. 100% free fast download. Update your computer today!',
  keywords: ['code', 'editor', 'download', 'free', 'fast'],
  ad: true,
  rank: 9,
})
