import { describe, expect, it } from 'vitest'
import { classCount, containsCommonWord, hasRepeats, hasSequence, looksLikePassphrase, scorePassword } from './passwordStrength'
import { checkLink, displayMismatch, extractHost, isLookalike, registrableDomain } from './linkCheck'
import { CARDS, evaluateCard, finalMessageBn } from './scamCards'

describe('password scoring', () => {
  it('handles empty', () => {
    expect(scorePassword('').level).toBe('empty')
  })
  it('flags classic bad passwords', () => {
    for (const p of ['123456', 'password', 'qwerty123', 'aaaaaaaa', 'bangladesh1']) expect(['veryWeak', 'weak']).toContain(scorePassword(p).level)
  })
  it('length beats complexity', () => {
    const short = scorePassword('Xk9$mQ2!')
    const long = scorePassword('blue tea river chair')
    expect(long.score).toBeGreaterThan(short.score)
    expect(long.level).toBe('strong')
  })
  it('a long passphrase is strong', () => {
    expect(scorePassword('কাঁঠাল-নদী-টেবিল-সূর্য').level).toBe('strong')
  })
  it('level does not drop when a good password gets longer', () => {
    const order = ['empty', 'veryWeak', 'weak', 'okay', 'good', 'strong']
    expect(order.indexOf(scorePassword('river-chair-tea-blue-sun').level)).toBeGreaterThanOrEqual(order.indexOf(scorePassword('river-chair-tea').level))
  })
  it('helpers', () => {
    expect(hasSequence('xx1234yy')).toBe(true)
    expect(hasSequence('x9k2m')).toBe(false)
    expect(hasRepeats('aaab')).toBe(true)
    expect(hasRepeats('abababab')).toBe(true)
    expect(hasRepeats('river')).toBe(false)
    expect(containsCommonWord('My-Password!')).toBe(true)
    expect(looksLikePassphrase('blue tea river chair')).toBe(true)
    expect(looksLikePassphrase('blue tea')).toBe(false)
    expect(classCount('aA1!')).toBe(4)
  })
  it('never promises crack times', () => {
    const all = ['', 'a', 'password', 'blue tea river chair'].map((p) => scorePassword(p))
    for (const r of all) expect(JSON.stringify(r)).not.toMatch(/বছর|সেকেন্ড|মিনিট ধরে/)
  })
  it('has gentle tips that never repeat the password', () => {
    const r = scorePassword('hunter2hunter2')
    expect(JSON.stringify(r)).not.toContain('hunter2')
  })
})

describe('link checks', () => {
  it('extracts hosts and registrable domains', () => {
    expect(extractHost('https://Login.TakaPay.example/a?b=1')).toBe('login.takapay.example')
    expect(extractHost('takapay.example')).toBe('takapay.example')
    expect(extractHost('')).toBeNull()
    expect(registrableDomain('a.b.takapay.example')).toBe('takapay.example')
    expect(registrableDomain('www.shop.com.bd')).toBe('shop.com.bd')
  })
  it('accepts the official domain and its subdomains', () => {
    expect(checkLink('https://takapay.example/offers').verdict).toBe('looksOk')
    expect(checkLink('https://help.takapay.example/').verdict).toBe('looksOk')
  })
  it('flags look-alikes and tricks', () => {
    expect(isLookalike('takap4y.example')).toBe('takapay.example')
    expect(isLookalike('takapay-verify.example')).toBe('takapay.example')
    expect(isLookalike('takapay.example')).toBeNull()
    expect(checkLink('http://takapay-verify.example/login').verdict).toBe('suspicious')
    expect(checkLink('https://takapay.example.prize-claim.net/win').verdict).toBe('suspicious')
    expect(checkLink('https://takapay.example@evil.net/').findings.some((f) => f.id === 'at-sign')).toBe(true)
    expect(checkLink('http://192.168.4.7/login').findings.some((f) => f.id === 'ip')).toBe(true)
    expect(checkLink('https://bit.ly/abc').findings.some((f) => f.id === 'shortener')).toBe(true)
  })
  it('unknown but clean domains are not called dangerous', () => {
    const r = checkLink('https://recipes.example/rice')
    expect(r.verdict).toBe('looksOk')
    expect(r.findings.some((f) => f.id === 'unknown')).toBe(true)
  })
  it('detects shown-text mismatch', () => {
    expect(displayMismatch('takapay.example/verify', 'http://takapay-verify.example/login')).toBe(true)
    expect(displayMismatch('takapay.example/offers', 'https://takapay.example/offers')).toBe(false)
    expect(displayMismatch('এখানে ক্লিক করুন', 'https://x.example')).toBe(false)
  })
  it('invalid input', () => {
    expect(checkLink('hello').verdict).toBe('invalid')
  })
})

describe('scam cards', () => {
  it('has a mix of scam and legit cards', () => {
    expect(CARDS.length).toBeGreaterThanOrEqual(8)
    expect(CARDS.filter((c) => !c.isScam).length).toBeGreaterThanOrEqual(2)
    expect(new Set(CARDS.map((c) => c.kind)).size).toBe(5)
    for (const c of CARDS) {
      expect(new Set(c.parts.map((p) => p.id)).size).toBe(c.parts.length)
      for (const p of c.parts) if (p.hot) expect(c.hotspots.some((h) => h.id === p.hot)).toBe(true)
      expect(c.isScam ? c.hotspots.length > 0 : c.hotspots.length === 0).toBe(true)
    }
  })
  it('no real-looking phone numbers', () => {
    for (const c of CARDS) expect(JSON.stringify(c)).not.toMatch(/01[3-9][\d-]{8,}/)
  })
  it('scores verdicts and hotspot taps', () => {
    const c = CARDS.find((x) => x.id === 'sms-pin')!
    const e = evaluateCard(c, ['l', 'b1', 'b2'], true)
    expect(e.correct).toBe(true)
    expect(e.foundHotspots.sort()).toEqual(['link', 'urgent'])
    expect(e.missedHotspots.sort()).toEqual(['number', 'pin'])
    expect(e.extraTaps).toEqual(['b2'])
    expect(evaluateCard(c, [], false).correct).toBe(false)
    const ok = CARDS.find((x) => !x.isScam)!
    expect(evaluateCard(ok, [], false).correct).toBe(true)
  })
  it('final message varies', () => {
    expect(finalMessageBn(9, 9)).not.toBe(finalMessageBn(2, 9))
  })
})
