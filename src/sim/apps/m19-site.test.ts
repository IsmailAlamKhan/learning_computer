import { describe, expect, it } from 'vitest'
import './browser/sites/m19-nameerror'
import { searchIndex } from './browser/searchIndex'

describe('m19 fake NameError pages', () => {
  it('are found by the exact error text, Q&A first', () => {
    const r = searchIndex("NameError: name is not defined python").results
    expect(r[0].url).toBe('https://pyanswers.example/q/nameerror-name-is-not-defined')
    expect(r.some((x) => x.url.startsWith('https://docs.pyhelp.example'))).toBe(true)
  })
})
