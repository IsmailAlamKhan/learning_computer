import { describe, expect, it } from 'vitest'
import { canBrowse, splitUrl } from './urlParts'

describe('splitUrl', () => {
  it('splits scheme, host, path and domain', () => {
    expect(splitUrl('https://www.example.com/page')).toEqual({ scheme: 'https://', host: 'www.example.com', path: '/page', domain: 'example.com', secure: true })
    expect(splitUrl('http://khobor.example/')?.secure).toBe(false)
    expect(splitUrl('https://download.official-editor.example/')?.domain).toBe('official-editor.example')
  })
  it('rejects non-addresses', () => {
    expect(splitUrl('dal recipe')).toBeNull()
  })
})

describe('canBrowse', () => {
  it('needs real internet from Wi‑Fi or mobile data', () => {
    expect(canBrowse({ wifi: 'on-with-internet', mobileData: false })).toBe(true)
    expect(canBrowse({ wifi: 'on-no-internet', mobileData: false })).toBe(false)
    expect(canBrowse({ wifi: 'on-no-internet', mobileData: true })).toBe(true)
    expect(canBrowse({ wifi: 'off', mobileData: false })).toBe(false)
  })
})
