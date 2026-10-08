import { useMemo, useState } from 'react'
import { useDesktop } from '../DesktopContext'
import { appsFor } from '../apps/registry'
import { NodeIcon, SearchGlyph } from '../ui/icons'

export function Launchpad() {
  const d = useDesktop()
  const [q, setQ] = useState('')
  const apps = appsFor('mac').filter((a) => a.title('mac').toLowerCase().includes(q.trim().toLowerCase()))
  const close = () => d.setUi({ launchpadOpen: false })
  return (
    <div
      data-coach="launchpad"
      role="dialog"
      aria-label="Launchpad"
      className="absolute inset-0 z-[9000] flex flex-col items-center gap-6 bg-black/35 px-6 pt-10 backdrop-blur-2xl"
      onClick={close}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          close()
        }
      }}
    >
      <div className="flex h-9 w-64 items-center gap-2 rounded-lg bg-white/25 px-3 text-white" onClick={(e) => e.stopPropagation()}>
        <SearchGlyph size={16} />
        <input
          autoFocus
          data-coach="launchpad-search"
          aria-label="Search apps"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/70"
        />
      </div>
      <div className="grid w-full max-w-3xl grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-4 gap-y-6">
        {apps.map((a) => (
          <button
            key={a.id}
            type="button"
            data-coach={`launchpad-app-${a.id}`}
            className="flex min-h-24 flex-col items-center gap-1.5 rounded-xl p-2 text-[13px] text-white hover:bg-white/15"
            onClick={(e) => {
              e.stopPropagation()
              d.openApp(a.id)
            }}
          >
            {a.icon({ size: 56 })}
            <span>{a.title('mac')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

type Result = { key: string; label: string; sub: string; icon: React.ReactNode; open: () => void }

export function Spotlight() {
  const d = useDesktop()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const results = useMemo<Result[]>(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const apps: Result[] = appsFor('mac')
      .filter((a) => a.title('mac').toLowerCase().includes(t))
      .map((a) => ({ key: `app-${a.id}`, label: a.title('mac'), sub: 'Application', icon: a.icon({ size: 28 }), open: () => d.openApp(a.id) }))
    const files: Result[] = d.vfs.search(q).slice(0, 8).map((n) => ({
      key: `node-${n.id}`,
      label: n.name,
      sub: d.vfs.displayPath(n),
      icon: <NodeIcon node={n} size={28} />,
      open: () => d.openFile(n),
    }))
    return [...apps, ...files].slice(0, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, d.vfsVersion, d.vfs])
  const close = () => d.setUi({ spotlightOpen: false })
  const run = (r?: Result) => {
    if (!r) return
    r.open()
    close()
  }
  return (
    <div data-coach="spotlight" role="dialog" aria-label="Spotlight Search" className="absolute inset-0 z-[9000] flex justify-center bg-black/10 pt-[14%]" onClick={close}>
      <div className="h-fit w-[min(520px,92%)] overflow-hidden rounded-2xl border border-white/50 bg-white/85 shadow-2xl backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4">
          <SearchGlyph size={20} className="text-gray-500" />
          <input
            autoFocus
            data-coach="spotlight-input"
            aria-label="Spotlight Search"
            placeholder="Spotlight Search"
            value={q}
            onChange={(e) => (setQ(e.target.value), setSel(0))}
            className="h-12 w-full bg-transparent text-lg text-gray-900 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation()
                close()
              } else if (e.key === 'Enter') {
                e.preventDefault()
                run(results[sel])
              } else if (e.key === 'ArrowDown' && results.length) {
                e.preventDefault()
                setSel((s) => (s + 1) % results.length)
              } else if (e.key === 'ArrowUp' && results.length) {
                e.preventDefault()
                setSel((s) => (s - 1 + results.length) % results.length)
              }
            }}
          />
        </div>
        {q.trim() !== '' && (
          <ul className="max-h-72 overflow-auto border-t border-black/10 p-1.5">
            {results.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No results</li>}
            {results.map((r, i) => (
              <li key={r.key}>
                <button
                  type="button"
                  data-coach={`spotlight-result-${i}`}
                  className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm ${i === sel ? 'bg-sky-500 text-white' : 'text-gray-900 hover:bg-black/5'}`}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => run(r)}
                >
                  {r.icon}
                  <span className="min-w-0 flex-1 truncate">{r.label}</span>
                  <span className={`truncate text-xs ${i === sel ? 'text-white/80' : 'text-gray-500'}`}>{r.sub}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
