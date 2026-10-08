/**
 * The pretend search engine's index. Fake sites register what they are about with `registerSearchEntry`
 * and `searchIndex(query)` ranks them by keyword (English and Bengali). No network, no randomness.
 */
export interface SearchEntry {
  url: string
  title: string
  snippet: string
  /** lowercase words (English or Bengali) this page is about */
  keywords: string[]
  /** shown with an "Ad" label, listed above the real results */
  ad?: boolean
  /** tie-breaker, higher first */
  rank?: number
}

const entries: SearchEntry[] = []

export function registerSearchEntry(e: SearchEntry) {
  const i = entries.findIndex((x) => x.url === e.url)
  if (i >= 0) entries.splice(i, 1)
  entries.push(e)
}

export const allSearchEntries = () => [...entries]

const STOP = new Set(['how', 'to', 'the', 'a', 'an', 'of', 'in', 'on', 'for', 'and', 'is', 'my', 'me', 'what', 'where', 'near', 'কিভাবে', 'কীভাবে', 'কি', 'কী'])

const norm = (s: string) => s.normalize('NFC').toLowerCase()

export function parseQuery(q: string): { tokens: string[]; phrases: string[] } {
  const text = norm(q)
  const phrases: string[] = []
  const rest = text.replace(/["“”]([^"“”]+)["“”]/g, (_, p: string) => {
    if (p.trim()) phrases.push(p.trim())
    return ' '
  })
  const tokens = rest
    .split(/[\s,.;:!?()]+/)
    .filter((t) => t && !STOP.has(t))
  return { tokens, phrases }
}

export function scoreEntry(e: SearchEntry, tokens: string[], phrases: string[]): number {
  const title = norm(e.title)
  const snippet = norm(e.snippet)
  const kws = e.keywords.map(norm)
  const hay = `${title} ${snippet} ${kws.join(' ')}`
  if (!phrases.every((p) => hay.includes(p))) return 0
  let score = phrases.length * 4
  for (const t of tokens) {
    if (kws.includes(t)) score += 3
    else if (t.length >= 3 && kws.some((k) => k.startsWith(t) || (k.length >= 3 && t.startsWith(k)))) score += 2
    if (title.includes(t)) score += 2
    else if (snippet.includes(t)) score += 1
  }
  return score
}

export interface SearchOutcome {
  ads: SearchEntry[]
  results: SearchEntry[]
}

/** Rank the registered pages for a query. Ads are returned separately (max 1) and never count as results. */
export function searchIndex(query: string): SearchOutcome {
  const { tokens, phrases } = parseQuery(query)
  if (tokens.length === 0 && phrases.length === 0) return { ads: [], results: [] }
  const scored = entries
    .map((e, i) => ({ e, i, s: scoreEntry(e, tokens, phrases) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (b.e.rank ?? 0) - (a.e.rank ?? 0) || a.i - b.i)
  return {
    ads: scored.filter((x) => x.e.ad).slice(0, 1).map((x) => x.e),
    results: scored.filter((x) => !x.e.ad).map((x) => x.e),
  }
}
