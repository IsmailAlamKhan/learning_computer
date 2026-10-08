/**
 * Tiny site registry for the simulated browser. Pages are React components keyed by URL.
 *
 *   registerSite('https://recipes.example/', RecipeHome, 'Recipes')
 *   registerSite((url) => url.startsWith('https://recipes.example/r/'), RecipePage, (url) => '…')
 *
 * Later registrations win over earlier ones. No network is ever used.
 */
import { useState, type ComponentType } from 'react'
import { searchIndex, type SearchEntry } from './searchIndex'

export interface SiteProps {
  /** the full normalised URL being shown */
  url: string
  /** navigate the current tab to another URL */
  go: (url: string) => void
  /** run a search on the simulated search engine */
  search: (query: string) => void
  /** emit a custom lesson event (`{type:'custom', event}`) */
  emit?: (event: string) => void
  /** start a (simulated) download of a file into the Downloads folder */
  download?: (fileName: string) => void
}

export type SiteMatcher = string | ((url: string) => boolean)
export type SiteTitle = string | ((url: string) => string)

interface Site {
  match: SiteMatcher
  Component: ComponentType<SiteProps>
  title?: SiteTitle
}

const sites: Site[] = []

export const SEARCH_HOME = 'https://search.example/'
export const NEW_TAB = 'about:newtab'

export function registerSite(match: SiteMatcher, Component: ComponentType<SiteProps>, title?: SiteTitle) {
  sites.push({ match, Component, title })
}

/** Turn what the learner typed into a URL: web addresses stay, plain words become a search. */
export function normalizeInput(raw: string): { url: string; query?: string } {
  const t = raw.normalize('NFC').trim()
  if (t === '' || t === 'about:blank') return { url: NEW_TAB }
  if (/^about:/i.test(t)) return { url: t.toLowerCase() }
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(t)
  if (hasScheme || (/^[^\s]+\.[^\s]{2,}(\/[^\s]*)?$/.test(t) && !t.includes(' '))) {
    const full = hasScheme ? t : `https://${t}`
    try {
      return { url: new URL(full).href }
    } catch {
      /* fall through to search */
    }
  }
  return { url: searchUrl(t), query: t }
}

export const searchUrl = (q: string) => `${SEARCH_HOME}search?q=${encodeURIComponent(q)}`

export function queryOf(url: string): string | null {
  if (!url.startsWith(`${SEARCH_HOME}search`)) return null
  try {
    return new URL(url).searchParams.get('q') ?? ''
  } catch {
    return ''
  }
}

const matches = (s: Site, url: string) => (typeof s.match === 'string' ? s.match === url : s.match(url))

export function resolveSite(url: string): Site | undefined {
  for (let i = sites.length - 1; i >= 0; i--) if (matches(sites[i], url)) return sites[i]
  return undefined
}

export function siteTitle(url: string): string {
  const s = resolveSite(url)
  if (!s) return url === NEW_TAB ? 'New Tab' : 'Can’t reach this page'
  if (typeof s.title === 'function') return s.title(url)
  return s.title ?? url
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

// ---------------------------------------------------------------- built-in pages

function SearchBox({ initial, search, big }: { initial: string; search: (q: string) => void; big?: boolean }) {
  const [q, setQ] = useState(initial)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (q.trim()) search(q.trim())
      }}
      className={`flex w-full gap-2 ${big ? 'max-w-xl' : 'max-w-lg'}`}
    >
      <input data-coach="search-input" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the web" className="min-h-11 min-w-0 flex-1 rounded-full border border-gray-300 px-4 text-base outline-none focus:border-blue-500" />
      <button type="submit" data-coach="search-button" className="min-h-11 rounded-full bg-blue-600 px-5 text-white">
        Search
      </button>
    </form>
  )
}

export function NewTabPage({ search, go }: SiteProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-50 to-white p-6 text-center">
      <div className="text-3xl font-light text-gray-700">New Tab</div>
      <SearchBox initial="" search={search} big />
      <p className="text-sm text-gray-500">Type a word to search, or a web address such as example.com in the address bar.</p>
      <div className="flex flex-wrap justify-center gap-3" aria-label="Shortcuts">
        {[
          ['https://rannaghor.example/', 'Rannaghor', 'recipes'],
          ['https://khobor.example/', 'Khobor', 'news'],
        ].map(([u, n, d]) => (
          <button key={u} type="button" data-coach={`newtab-${n.toLowerCase()}`} onClick={() => go(u)} className="min-h-12 w-32 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left shadow-sm hover:bg-sky-50">
            <div className="text-sm font-semibold text-gray-800">{n}</div>
            <div className="text-xs text-gray-500">{d}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function SearchHome({ search }: SiteProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-white p-6">
      <div className="text-5xl font-semibold tracking-tight text-blue-600">Search</div>
      <SearchBox initial="" search={search} big />
    </div>
  )
}

function slug(q: string) {
  const s = q
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'page'
}

/** Only used when nothing in the mini-internet matches: plausible-looking but unreachable pages. */
function fallbackResults(q: string): SearchEntry[] {
  const s = slug(q)
  return [
    { url: `https://www.${s}.example/`, title: `${q} – the basics`, snippet: `A friendly introduction to ${q}. Learn the main ideas step by step.`, keywords: [] },
    { url: `https://guide.example/${s}`, title: `How to: ${q}`, snippet: `A simple guide with pictures. Everything you need to know about ${q}.`, keywords: [] },
    { url: `https://news.example/${s}`, title: `${q} – latest news`, snippet: `Read recent stories and updates about ${q}.`, keywords: [] },
    { url: `https://answers.example/q/${s}`, title: `Questions and answers about ${q}`, snippet: `People ask and answer questions about ${q}.`, keywords: [] },
    { url: `https://encyclopedia.example/wiki/${s}`, title: `${q} – encyclopedia`, snippet: `Facts and background about ${q}.`, keywords: [] },
  ]
}

function SearchResults({ url, go, search }: SiteProps) {
  const q = queryOf(url) ?? ''
  const found = searchIndex(q)
  const results = found.results.length > 0 ? found.results : fallbackResults(q)
  const shownUrl = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <div className="h-full overflow-auto bg-white">
      <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-3">
        <button type="button" data-coach="search-logo" onClick={() => go(SEARCH_HOME)} className="text-2xl font-semibold text-blue-600">
          Search
        </button>
        <SearchBox key={q} initial={q} search={search} />
      </div>
      <div className="mx-auto max-w-2xl px-4 py-4">
        <p className="mb-4 text-xs text-gray-500">About {results.length * 1200} results (0.31 seconds)</p>
        <ul className="flex flex-col gap-5">
          {found.ads.map((r, i) => (
            <li key={`ad-${r.url}`} className="rounded bg-amber-50 p-2" data-coach={`search-ad-${i + 1}`}>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="rounded border border-gray-500 px-1 text-[10px] font-bold text-gray-800">Ad · বিজ্ঞাপন</span>
                {shownUrl(r.url)}
              </div>
              <a
                href={r.url}
                data-coach={`search-ad-link-${i + 1}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(r.url)
                }}
                className="text-lg text-blue-700 hover:underline"
              >
                {r.title}
              </a>
              <p className="text-sm text-gray-700">{r.snippet}</p>
            </li>
          ))}
          {results.map((r, i) => (
            <li key={r.url} data-coach={`search-result-box-${i + 1}`}>
              <div className="text-xs text-gray-600">{shownUrl(r.url)}</div>
              <a
                href={r.url}
                data-coach={`search-result-${i + 1}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(r.url)
                }}
                className="text-lg text-blue-700 hover:underline"
              >
                {r.title}
              </a>
              <p className="text-sm text-gray-700">{r.snippet}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function UnreachablePage({ url, go }: SiteProps) {
  return (
    <div data-coach="browser-error" className="flex h-full flex-col items-start justify-center gap-3 bg-[#f7f7f7] p-8 sm:px-16">
      <div className="text-5xl">:(</div>
      <h1 className="text-2xl font-semibold text-gray-800">This site can’t be reached</h1>
      <p className="text-gray-700">
        <strong>{hostOf(url)}</strong> might be temporarily down, or the address may be wrong.
      </p>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        <li>Check that the web address is spelled correctly</li>
        <li>Check your Wi-Fi connection</li>
      </ul>
      <button type="button" data-coach="browser-error-home" onClick={() => go(SEARCH_HOME)} className="mt-2 min-h-10 rounded bg-blue-600 px-4 text-white">
        Go to the search page
      </button>
    </div>
  )
}

export function OfflinePage() {
  return (
    <div data-coach="browser-offline" className="flex h-full flex-col items-start justify-center gap-3 bg-[#f7f7f7] p-8 sm:px-16">
      <div className="text-5xl">:(</div>
      <h1 className="text-2xl font-semibold text-gray-800">No internet</h1>
      <p className="text-gray-700">You’re not connected to the internet. Turn on Wi-Fi in Settings, then try again.</p>
    </div>
  )
}

registerSite(NEW_TAB, NewTabPage, 'New Tab')
registerSite(SEARCH_HOME, SearchHome, 'Search')
registerSite((u) => u.startsWith(`${SEARCH_HOME}search`), SearchResults, (u) => `${queryOf(u) ?? ''} – Search`)
