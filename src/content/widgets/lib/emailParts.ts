/** Split an email address into its parts, for the "email-parts" widget. Pure → unit-tested. */
export interface AddressParts {
  name: string
  domain: string
  valid: boolean
}

export function addressParts(raw: string): AddressParts {
  const s = raw.trim()
  const at = s.indexOf('@')
  if (at < 0) return { name: s, domain: '', valid: false }
  const name = s.slice(0, at)
  const domain = s.slice(at + 1)
  return { name, domain, valid: /^[^\s@]+$/.test(name) && /^[^\s@.]+(\.[^\s@.]+)+$/.test(domain) }
}
