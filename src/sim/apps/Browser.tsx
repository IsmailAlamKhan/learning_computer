/** A generic simulated web browser: tabs, address bar that also searches, padlock, history, bookmarks, downloads. */
import { useEffect, useRef, useState } from 'react'
import { useDesktop, useWindowCombos } from '../DesktopContext'
import type { WinState } from '../windowManager'
import { BackGlyph, ForwardGlyph, PlusGlyph, RefreshGlyph, CloseGlyph } from '../ui/icons'
import { NEW_TAB, OfflinePage, UnreachablePage, normalizeInput, resolveSite, searchUrl, siteTitle, type SiteProps } from './browser/sites'

interface Tab {
  id: number
  history: string[]
  idx: number
  /** bumps on reload */
  reload: number
}

interface Download {
  id: number
  name: string
  pct: number
  done: boolean
  /** final file name in Downloads (may differ if the name was taken) */
  savedAs?: string
}

const urlOf = (t: Tab) => t.history[t.idx] ?? NEW_TAB

export function Browser({ win }: { win: WinState }) {
  const d = useDesktop()
  const startUrl = typeof win.props?.url === 'string' ? normalizeInput(win.props.url).url : NEW_TAB
  const nextId = useRef(2)
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, history: [startUrl], idx: 0, reload: 0 }])
  const [activeId, setActiveId] = useState(1)
  const [addr, setAddr] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const addrRef = useRef<HTMLInputElement>(null)
  const [downloads, setDownloads] = useState<Download[]>([])
  const [dlOpen, setDlOpen] = useState(false)
  const [lockOpen, setLockOpen] = useState(false)
  const finished = useRef(new Set<number>())
  const dlId = useRef(1)

  const tab = tabs.find((t) => t.id === activeId) ?? tabs[0]
  const url = urlOf(tab)
  const shownAddr = addr ?? (url === NEW_TAB ? '' : url)

  useEffect(() => {
    d.emit({ type: 'navigate', path: startUrl })
    // initial page only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    d.wmDispatch({ type: 'setTitle', id: win.id, title: 'Web Browser' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.id])

  // simulated download progress: tick until 100 %, then drop the file into the Downloads folder
  const running = downloads.some((x) => !x.done)
  useEffect(() => {
    if (!running) return
    const t = window.setInterval(() => setDownloads((ds) => ds.map((x) => (x.done ? x : { ...x, pct: Math.min(100, x.pct + 20) }))), 200)
    return () => window.clearInterval(t)
  }, [running])
  useEffect(() => {
    const fin = downloads.filter((x) => x.pct >= 100 && !x.done && !finished.current.has(x.id))
    if (fin.length === 0) return
    const saved: Record<number, string> = {}
    for (const f of fin) {
      finished.current.add(f.id)
      const folder = d.vfs.child(d.vfs.home, 'Downloads') ?? d.vfs.mkdir(d.vfs.home, 'Downloads')
      const dot = f.name.lastIndexOf('.')
      const [base, ext] = dot > 0 ? [f.name.slice(0, dot), f.name.slice(dot)] : [f.name, '']
      const finalName = d.vfs.uniqueName(folder, base, ext)
      d.vfs.createFile(folder, finalName, 'Simulated download — nothing real was installed.')
      saved[f.id] = finalName
    }
    setDownloads((ds) => ds.map((x) => (saved[x.id] ? { ...x, done: true, savedAs: saved[x.id] } : x)))
    d.emit({ type: 'custom', event: 'browser-download-done' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloads])
  const startDownload = (name: string) => {
    setDownloads((ds) => [...ds, { id: dlId.current++, name, pct: 0, done: false }])
    setDlOpen(true)
    d.emit({ type: 'custom', event: 'browser-download-started' })
  }
  const emitCustom = (event: string) => d.emit({ type: 'custom', event })

  const patchTab = (id: number, fn: (t: Tab) => Tab) => setTabs((ts) => ts.map((t) => (t.id === id ? fn(t) : t)))

  const navigate = (to: string) => {
    patchTab(tab.id, (t) => {
      if (urlOf(t) === to) return { ...t, reload: t.reload + 1 }
      return { ...t, history: [...t.history.slice(0, t.idx + 1), to], idx: t.idx + 1 }
    })
    setAddr(null)
    d.emit({ type: 'navigate', path: to })
  }
  const search = (q: string) => {
    d.emit({ type: 'custom', event: 'browser-search' })
    d.emit({ type: 'custom', event: `browser-search:${q}` })
    navigate(searchUrl(q))
  }
  const submit = (text: string) => {
    const n = normalizeInput(text)
    if (n.query !== undefined) {
      d.emit({ type: 'custom', event: 'browser-search' })
      d.emit({ type: 'custom', event: `browser-search:${n.query}` })
    }
    navigate(n.url)
  }
  const goBack = () => {
    if (tab.idx <= 0) return
    patchTab(tab.id, (t) => ({ ...t, idx: t.idx - 1 }))
    setAddr(null)
    d.emit({ type: 'navigate', path: tab.history[tab.idx - 1] })
  }
  const goForward = () => {
    if (tab.idx >= tab.history.length - 1) return
    patchTab(tab.id, (t) => ({ ...t, idx: t.idx + 1 }))
    setAddr(null)
    d.emit({ type: 'navigate', path: tab.history[tab.idx + 1] })
  }
  const reload = () => patchTab(tab.id, (t) => ({ ...t, reload: t.reload + 1 }))
  const newTab = () => {
    const id = nextId.current++
    setTabs((ts) => [...ts, { id, history: [NEW_TAB], idx: 0, reload: 0 }])
    setActiveId(id)
    setAddr(null)
    d.emit({ type: 'custom', event: 'browser-new-tab' })
    setTimeout(() => addrRef.current?.focus(), 0)
  }
  const closeTab = (id: number) => {
    if (tabs.length <= 1) return
    const i = tabs.findIndex((t) => t.id === id)
    const rest = tabs.filter((t) => t.id !== id)
    setTabs(rest)
    if (id === activeId) setActiveId(rest[Math.min(i, rest.length - 1)].id)
    d.emit({ type: 'custom', event: 'browser-close-tab' })
  }
  const bookmarked = bookmarks.includes(url)
  const toggleBookmark = () => {
    if (url === NEW_TAB) return
    setBookmarks((b) => (b.includes(url) ? b.filter((x) => x !== url) : [...b, url]))
    if (!bookmarked) d.emit({ type: 'custom', event: 'browser-bookmark-added' })
  }

  useWindowCombos(win.id, (c) => {
    const m = d.os === 'mac' ? 'cmd' : 'ctrl'
    if (c === `${m}+t`) return (newTab(), true)
    if (c === `${m}+l`) return (addrRef.current?.focus(), addrRef.current?.select(), true)
    if (c === `${m}+r` || c === 'f5') return (reload(), true)
    if (c === (d.os === 'mac' ? 'cmd+[' : 'alt+left')) return (goBack(), true)
    if (c === (d.os === 'mac' ? 'cmd+]' : 'alt+right')) return (goForward(), true)
    if (c === `${m}+d`) return (toggleBookmark(), true)
    if (c === `${m}+w` && d.os !== 'mac') return (closeTab(tab.id), true)
    return false
  })

  const mac = d.os === 'mac'
  const site = resolveSite(url)
  const offline = !d.sim.wifiOn && url !== NEW_TAB && !url.startsWith('about:')
  const siteProps: SiteProps = { url, go: navigate, search, emit: emitCustom, download: startDownload }
  const secure = url.startsWith('https://')
  const insecure = url.startsWith('http://')
  let page
  if (offline) page = <OfflinePage />
  else if (site) page = <site.Component {...siteProps} />
  else page = <UnreachablePage {...siteProps} />

  const btn = 'flex min-h-9 min-w-9 items-center justify-center rounded text-gray-700 hover:bg-black/8 disabled:text-gray-300 disabled:hover:bg-transparent'

  return (
    <div className="relative flex h-full flex-col text-sm text-gray-900">
      <div className={`flex shrink-0 items-end gap-0.5 px-2 pt-1.5 ${mac ? 'bg-[#e4e4e4]' : 'bg-[#dfe6f0]'}`} role="tablist" data-coach="browser-tabs">
        {tabs.map((t, i) => (
          <div key={t.id} className={`group flex min-h-9 max-w-48 min-w-0 flex-1 items-center rounded-t-lg ${t.id === tab.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
            <button type="button" role="tab" aria-selected={t.id === tab.id} data-coach={`browser-tab-${i + 1}`} onClick={() => (setActiveId(t.id), setAddr(null))} className="min-h-9 min-w-0 flex-1 truncate pl-3 text-left text-xs">
              {siteTitle(urlOf(t))}
            </button>
            {tabs.length > 1 && (
              <button type="button" aria-label="Close tab" data-coach={`browser-tab-close-${i + 1}`} onClick={() => closeTab(t.id)} className="mr-1 flex min-h-7 min-w-7 items-center justify-center rounded hover:bg-black/10">
                <CloseGlyph size={12} />
              </button>
            )}
          </div>
        ))}
        <button type="button" aria-label="New tab" data-coach="browser-new-tab" onClick={newTab} className="mb-0.5 flex min-h-9 min-w-9 items-center justify-center rounded hover:bg-black/10">
          <PlusGlyph size={14} />
        </button>
      </div>
      <div className="flex shrink-0 items-center gap-1 border-b border-gray-200 bg-white px-2 py-1">
        <button type="button" aria-label="Back" data-coach="browser-back" disabled={tab.idx <= 0} onClick={goBack} className={btn}>
          <BackGlyph size={16} />
        </button>
        <button type="button" aria-label="Forward" data-coach="browser-forward" disabled={tab.idx >= tab.history.length - 1} onClick={goForward} className={btn}>
          <ForwardGlyph size={16} />
        </button>
        <button type="button" aria-label="Reload" data-coach="browser-reload" onClick={reload} className={btn}>
          <RefreshGlyph size={16} />
        </button>
        <form
          className="flex min-h-9 min-w-0 flex-1 items-center rounded-full border border-gray-300 bg-gray-50 pr-1 pl-3 focus-within:border-blue-500 focus-within:bg-white"
          onSubmit={(e) => {
            e.preventDefault()
            submit(shownAddr)
          }}
        >
          {(secure || insecure) && (
            <button
              type="button"
              data-coach="browser-padlock"
              aria-label={secure ? 'Connection is secure (padlock)' : 'Not secure'}
              aria-expanded={lockOpen}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setLockOpen((o) => !o)
                emitCustom('browser-padlock-click')
              }}
              className={`mr-1 flex min-h-8 items-center gap-1 rounded-full px-1.5 text-xs hover:bg-black/8 ${secure ? 'text-gray-700' : 'text-red-700'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                {secure ? <path d="M8 11V8a4 4 0 0 1 8 0v3" /> : <path d="M8 11V8a4 4 0 0 1 7-2.6" />}
              </svg>
              {insecure && <span>Not secure</span>}
            </button>
          )}
          <input
            ref={addrRef}
            data-coach="browser-address"
            aria-label="Address and search bar"
            placeholder="Search or enter web address"
            value={shownAddr}
            onChange={(e) => setAddr(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => setAddr(null)}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Escape') setAddr(null)
            }}
            className="min-h-8 min-w-0 flex-1 bg-transparent outline-none"
          />
          <button type="button" aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this page'} aria-pressed={bookmarked} data-coach="browser-bookmark" disabled={url === NEW_TAB} onClick={toggleBookmark} className={`${btn} text-lg ${bookmarked ? 'text-amber-500' : ''}`} onMouseDown={(e) => e.preventDefault()}>
            {bookmarked ? '★' : '☆'}
          </button>
        </form>
        <button type="button" aria-label="Downloads" data-coach="browser-downloads" aria-expanded={dlOpen} onClick={() => setDlOpen((o) => !o)} className={`${btn} relative`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
          </svg>
          {downloads.length > 0 && <span className={`absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full ${running ? 'animate-pulse bg-blue-600' : 'bg-green-600'}`} data-coach="browser-downloads-dot" />}
        </button>
      </div>
      {lockOpen && (secure || insecure) && (
        <div role="dialog" aria-label="Site information" data-coach="browser-padlock-popup" className="absolute top-24 left-14 z-20 w-72 rounded-lg border border-gray-300 bg-white p-3 text-xs shadow-lg">
          <p className="font-semibold">{secure ? 'Connection is secure' : 'Connection is not secure'}</p>
          <p className="mt-1 text-gray-700">
            {secure
              ? 'Information you send is scrambled on the way. This does not mean the site is honest or safe.'
              : 'Anything you type here could be read by others on the way. Do not enter passwords.'}
          </p>
          <button type="button" className="mt-2 min-h-8 rounded border border-gray-300 px-3" onClick={() => setLockOpen(false)}>
            Close
          </button>
        </div>
      )}
      {dlOpen && (
        <div role="dialog" aria-label="Downloads" data-coach="browser-downloads-panel" className="absolute top-24 right-2 z-20 w-80 rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">Downloads</span>
            <button type="button" aria-label="Close downloads" className="min-h-8 min-w-8 rounded hover:bg-black/8" onClick={() => setDlOpen(false)}>
              <CloseGlyph size={12} />
            </button>
          </div>
          {downloads.length === 0 && <p className="text-xs text-gray-500">No files downloaded yet.</p>}
          <ul className="flex flex-col gap-2">
            {downloads.map((x) => (
              <li key={x.id} data-coach={`browser-download-${x.savedAs ?? x.name}`}>
                <div className="truncate text-xs font-medium">{x.savedAs ?? x.name}</div>
                {x.done ? (
                  <div className="flex items-center justify-between text-xs text-green-700">
                    <span>Done — saved in Downloads</span>
                    <button type="button" data-coach="browser-download-show" className="min-h-8 rounded px-2 text-blue-700 hover:bg-black/8" onClick={() => d.openFolder(d.vfs.canonPath(d.vfs.child(d.vfs.home, 'Downloads') ?? d.vfs.home))}>
                      Show in folder
                    </button>
                  </div>
                ) : (
                  <div className="h-2 overflow-hidden rounded bg-gray-200" role="progressbar" aria-valuenow={x.pct} aria-valuemin={0} aria-valuemax={100} data-coach="browser-download-progress">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${x.pct}%` }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {bookmarks.length > 0 && (
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-gray-200 bg-gray-50 px-2 py-0.5" data-coach="browser-bookmarks">
          {bookmarks.map((b, i) => (
            <button key={b} type="button" data-coach={`browser-bookmark-${i + 1}`} onClick={() => navigate(b)} className="min-h-8 shrink-0 truncate rounded px-2 text-xs hover:bg-black/8">
              ★ {siteTitle(b)}
            </button>
          ))}
        </div>
      )}
      <div data-coach="browser-content" className="min-h-0 flex-1 overflow-auto bg-white" key={`${tab.id}:${tab.reload}`}>
        {page}
      </div>
    </div>
  )
}
