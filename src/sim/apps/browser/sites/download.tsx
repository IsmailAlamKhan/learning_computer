/** Simulated official software download page: https://download.official-editor.example/ (fictional). */
import { useDesktop } from '../../../DesktopContext'
import { registerSite, type SiteProps } from '../sites'
import { registerSearchEntry } from '../searchIndex'

export const OFFICIAL_URL = 'https://download.official-editor.example/'
export const OFFICIAL_FILE = { windows: 'OfficialEditor-setup.exe', mac: 'OfficialEditor.dmg' } as const

function OfficialDownload({ go, download, emit }: SiteProps) {
  const d = useDesktop()
  const file = OFFICIAL_FILE[d.os]
  return (
    <div className="min-h-full bg-white text-gray-900" lang="en">
      <header className="border-b border-gray-200 bg-slate-800 px-5 py-3 text-lg font-semibold text-white">OfficialEditor</header>
      <main className="mx-auto max-w-2xl px-5 py-5">
        <h1 className="text-2xl font-bold">Get OfficialEditor — a simple text editor</h1>
        <p className="mt-2 text-gray-700">Free to use. Download the installer for your computer, then open it from your Downloads folder.</p>
        <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Your computer: <strong>{d.os === 'windows' ? 'Windows' : 'Mac'}</strong> · Version 1.0 · 4 MB
          </p>
          <button type="button" data-coach="download-official" onClick={() => download?.(file)} className="mt-2 min-h-11 rounded bg-blue-700 px-5 font-semibold text-white">
            Download {file}
          </button>
        </div>
        <aside className="mt-6 rounded border border-dashed border-gray-400 p-3 text-center" data-coach="download-ad-box">
          <div className="text-[10px] font-bold tracking-wide text-gray-500">AD · বিজ্ঞাপন</div>
          <button
            type="button"
            data-coach="download-ad-trap"
            onClick={() => {
              emit?.('browser-ad-trap')
              go('https://get-editor-fast.example/')
            }}
            className="mt-1 min-h-12 w-full rounded bg-lime-400 text-xl font-black text-black"
          >
            ▶ Download Now — FAST!!!
          </button>
        </aside>
      </main>
    </div>
  )
}

registerSite(OFFICIAL_URL, OfficialDownload, 'OfficialEditor – Download')
registerSearchEntry({
  url: OFFICIAL_URL,
  title: 'OfficialEditor – Download the free text editor',
  snippet: 'The official download page of OfficialEditor, a simple text editor. Download for Windows or Mac.',
  keywords: ['editor', 'download', 'officialeditor', 'official', 'text', 'ডাউনলোড', 'এডিটর', 'software', 'setup'],
  rank: 2,
})
