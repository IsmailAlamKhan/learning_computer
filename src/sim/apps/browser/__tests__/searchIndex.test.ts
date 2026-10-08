import { describe, expect, it } from 'vitest'
import '../sites/rannaghor'
import '../sites/khobor'
import '../sites/scam'
import '../sites/download'
import { parseQuery, searchIndex } from '../searchIndex'

const first = (q: string) => searchIndex(q).results[0]?.url

describe('mini-internet search', () => {
  it('ranks recipes by keyword in English and Bengali', () => {
    expect(first('khichuri recipe')).toBe('https://rannaghor.example/recipe/khichuri')
    expect(first('dal recipe')).toBe('https://rannaghor.example/recipe/dal')
    expect(first('ডাল রেসিপি')).toBe('https://rannaghor.example/recipe/dal')
    expect(first('খিচুড়ি')).toBe('https://rannaghor.example/recipe/khichuri')
  })
  it('finds weather and news', () => {
    expect(first('weather Dhaka')).toBe('https://khobor.example/weather')
    expect(first('আবহাওয়া ঢাকা')).toBe('https://khobor.example/weather')
    expect(first('news')).toBe('https://khobor.example/')
  })
  it('supports exact phrases in quotes', () => {
    expect(first('"easy dal" recipe')).toBe('https://rannaghor.example/recipe/dal')
    expect(searchIndex('"zzz nothing"').results).toHaveLength(0)
    expect(parseQuery('how to "dal recipe"').phrases).toEqual(['dal recipe'])
  })
  it('puts the official download first and shows the look-alike only as an ad', () => {
    const r = searchIndex('download editor')
    expect(r.results[0].url).toBe('https://download.official-editor.example/')
    expect(r.ads[0].url).toBe('https://get-editor-fast.example/')
    expect(r.results.some((x) => x.ad)).toBe(false)
  })
  it('returns nothing for empty or unknown queries', () => {
    expect(searchIndex('   ')).toEqual({ ads: [], results: [] })
    expect(searchIndex('qqqqxz').results).toHaveLength(0)
  })
})
