/** Pure helpers for the "fake link" lesson. Uses a made-up brand (TakaPay) so no real company is named. */

export interface Finding {
  id: string
  severity: 'danger' | 'warn' | 'info' | 'ok'
  textBn: string
}

export interface LinkResult {
  valid: boolean
  host: string
  /** e.g. "takapay.example" — the part that really tells who owns the address */
  domain: string
  findings: Finding[]
  verdict: 'looksOk' | 'suspicious' | 'invalid'
}

export const OFFICIAL_DOMAINS = ['takapay.example', 'namunabank.example']

const SECOND_LEVEL = new Set(['com', 'org', 'net', 'edu', 'gov', 'co', 'ac'])
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'cutt.ly', 'is.gd', 'rb.gy']
const BAIT_WORDS = ['login', 'verify', 'secure', 'update', 'account', 'confirm', 'bonus', 'prize', 'gift', 'free']

export function extractHost(url: string): string | null {
  const raw = url.trim()
  if (!raw) return null
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const u = new URL(withScheme)
    return u.hostname.toLowerCase().replace(/\.$/, '') || null
  } catch {
    return null
  }
}

/** Simple registrable-domain guess: last two labels, or three for names like example.com.bd / example.co.uk. */
export function registrableDomain(host: string): string {
  const labels = host.split('.').filter(Boolean)
  if (labels.length <= 2) return labels.join('.')
  const last = labels[labels.length - 1]
  const prev = labels[labels.length - 2]
  if (last.length === 2 && SECOND_LEVEL.has(prev)) return labels.slice(-3).join('.')
  return labels.slice(-2).join('.')
}

/** Undo common look-alike tricks: 0→o, 1→l, 3→e, 5→s, rn→m, vv→w, and drop hyphens. */
export function normalizeLookalike(s: string): string {
  return s
    .toLowerCase()
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/0/g, 'o')
    .replace(/[1|]/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/4/g, 'a')
    .replace(/-/g, '')
}

const brandOf = (domain: string) => domain.split('.')[0]

/** Is `domain` a trick imitation of one of the official domains (but not the official one itself)? */
export function isLookalike(domain: string, official: string[] = OFFICIAL_DOMAINS): string | null {
  if (official.includes(domain)) return null
  const mine = normalizeLookalike(domain.split('.')[0])
  for (const o of official) {
    const brand = brandOf(o)
    if (mine === brand || (mine.includes(brand) && mine !== brand) || levenshtein(mine, brand) === 1) return o
  }
  return null
}

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}

const looksLikeDomain = (s: string) => /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(s.trim())

/** The link text she sees looks like an address but points somewhere else. */
export function displayMismatch(shownText: string, realUrl: string): boolean {
  if (!looksLikeDomain(shownText)) return false
  const a = extractHost(shownText)
  const b = extractHost(realUrl)
  if (!a || !b) return false
  return registrableDomain(a) !== registrableDomain(b)
}

export function checkLink(url: string, official: string[] = OFFICIAL_DOMAINS): LinkResult {
  const host = extractHost(url)
  if (!host || !host.includes('.')) return { valid: false, host: host ?? '', domain: '', findings: [], verdict: 'invalid' }
  const domain = registrableDomain(host)
  const findings: Finding[] = []
  const raw = url.trim()

  if (official.includes(domain)) {
    findings.push({ id: 'official', severity: 'ok', textBn: `আসল ঠিকানাটি (ডোমেইন) ${domain} — এটি পরিচিত ঠিকানার সাথে মেলে।` })
  }
  const look = isLookalike(domain, official)
  if (look) findings.push({ id: 'lookalike', severity: 'danger', textBn: `ডোমেইন ${domain} দেখতে ${look}-এর মতো, কিন্তু আসলে আলাদা — এটি নকল ঠিকানার চেনা কৌশল।` })
  if (!look && !official.includes(domain) && official.some((o) => host.includes(brandOf(o)))) {
    findings.push({ id: 'brand-elsewhere', severity: 'danger', textBn: `নামটি ঠিকানার শুরুতে বসানো আছে, কিন্তু আসল মালিক ${domain}। ঠিকানার শেষ দিকের অংশই আসল মালিক বোঝায়।` })
  }
  if (/^[a-z][a-z0-9+.-]*:\/\/[^/]*@/i.test(raw)) findings.push({ id: 'at-sign', severity: 'danger', textBn: 'ঠিকানার মাঝে “@” চিহ্ন আছে — এর আগের অংশটি ফাঁকি, আসল ঠিকানা “@”-এর পরে।' })
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) findings.push({ id: 'ip', severity: 'danger', textBn: 'নামের বদলে শুধু সংখ্যার ঠিকানা (IP) — সাধারণ প্রতিষ্ঠান এমন লিংক দেয় না।' })
  if (host.split('.').some((l) => l.startsWith('xn--'))) findings.push({ id: 'punycode', severity: 'warn', textBn: 'ঠিকানায় অদ্ভুত বিদেশি অক্ষরের কোড (xn--) আছে — অক্ষর নকল করার কৌশল হতে পারে।' })
  if (SHORTENERS.includes(domain)) findings.push({ id: 'shortener', severity: 'warn', textBn: 'এটি ছোট করা লিংক — আসল গন্তব্য লুকানো থাকে। অচেনা মানুষের এমন লিংকে ক্লিক করবেন না।' })
  if (/^http:\/\//i.test(raw)) findings.push({ id: 'no-https', severity: 'warn', textBn: 'ঠিকানা “http://” দিয়ে শুরু — তালা-চিহ্নওয়ালা “https://” নয়। (https থাকলেই নিরাপদ, তা নয়; তবে না থাকাটা ভালো লক্ষণ নয়।)' })
  const bait = BAIT_WORDS.filter((w) => host.includes(w))
  if (bait.length && !official.includes(domain)) findings.push({ id: 'bait', severity: 'warn', textBn: `ঠিকানায় “${bait[0]}”-এর মতো ভরসা-জাগানো শব্দ আছে — প্রতারকেরা এমন শব্দ ঢোকায়।` })
  if (host.split('.').length - registrableDomain(host).split('.').length >= 2) findings.push({ id: 'many-sub', severity: 'info', textBn: 'ঠিকানায় অনেকগুলো অংশ আছে — শুধু শেষ দিকের অংশটি দেখুন।' })

  const bad = findings.some((f) => f.severity === 'danger' || f.severity === 'warn')
  const verdict = bad ? 'suspicious' : 'looksOk'
  if (!bad && !official.includes(domain)) findings.push({ id: 'unknown', severity: 'info', textBn: `ডোমেইন ${domain} আমাদের পরিচিত তালিকায় নেই। সন্দেহজনক কিছু পাইনি, তবে ঠিকানা না চিনলে লিংকে না গিয়ে নিজে অ্যাপ বা ওয়েবসাইট খুলুন।` })
  return { valid: true, host, domain, findings, verdict }
}
