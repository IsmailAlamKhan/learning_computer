/** Split a web address into the parts the learner should recognise. Pure; used by the url-anatomy widget. */
export interface UrlParts {
  scheme: string
  host: string
  path: string
  /** the main name + ending, e.g. example.com (what to check for look-alikes) */
  domain: string
  secure: boolean
}

export function splitUrl(raw: string): UrlParts | null {
  const m = /^(https?):\/\/([^/\s?#]+)(\/[^\s?#]*)?/i.exec(raw.trim())
  if (!m) return null
  const host = m[2].toLowerCase()
  const labels = host.split('.')
  const domain = labels.length <= 2 ? host : labels.slice(-2).join('.')
  return { scheme: `${m[1].toLowerCase()}://`, host, path: m[3] ?? '/', domain, secure: m[1].toLowerCase() === 'https' }
}

/** Four checks of whether the connection state in the Wi‑Fi/mobile data widget lets a page open. */
export interface NetState {
  wifi: 'off' | 'on-with-internet' | 'on-no-internet'
  mobileData: boolean
}
export const canBrowse = (s: NetState) => s.wifi === 'on-with-internet' || s.mobileData
