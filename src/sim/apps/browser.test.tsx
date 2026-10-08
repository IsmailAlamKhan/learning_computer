import { describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen } from '@testing-library/react'
import { renderApp } from './testUtils'
import { normalizeInput, registerSite } from './browser/sites'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))

describe('browser', () => {
  it('normalises input', () => {
    expect(normalizeInput('example.com').url).toBe('https://example.com/')
    expect(normalizeInput('cats and dogs').query).toBe('cats and dogs')
    expect(normalizeInput('').url).toBe('about:newtab')
  })

  it('searches from the address bar and navigates back', () => {
    const rig = renderApp('windows', 'browser')
    const addr = rig.q<HTMLInputElement>('browser-address')
    fireEvent.change(addr, { target: { value: 'khichuri recipe' } })
    fireEvent.submit(addr.closest('form')!)
    const url = 'https://search.example/search?q=khichuri%20recipe'
    expect(has(rig.events(), { type: 'navigate', path: url })).toBe(true)
    expect(has(rig.events(), { type: 'custom', event: 'browser-search' })).toBe(true)
    expect(rig.has('search-result-1')).toBe(true)
    fireEvent.click(rig.q('search-result-1'))
    expect(rig.has('recipe-page')).toBe(true)
    fireEvent.click(rig.q('browser-back'))
    expect(rig.has('search-result-1')).toBe(true)
    fireEvent.click(rig.q('browser-forward'))
    expect(rig.has('recipe-ingredients')).toBe(true)
  })

  it('supports tabs, bookmarks, registered sites and offline mode', () => {
    registerSite('https://hello.example/', () => <p>Hello site</p>, 'Hello')
    const rig = renderApp('mac', 'browser')
    fireEvent.click(rig.q('browser-new-tab'))
    expect(rig.has('browser-tab-2')).toBe(true)
    const addr = rig.q<HTMLInputElement>('browser-address')
    fireEvent.change(addr, { target: { value: 'hello.example' } })
    fireEvent.submit(addr.closest('form')!)
    expect(screen.getByText('Hello site')).toBeInTheDocument()
    fireEvent.click(rig.q('browser-bookmark'))
    expect(rig.has('browser-bookmark-1')).toBe(true)
    fireEvent.click(rig.q('browser-tab-1'))
    expect(screen.queryByText('Hello site')).toBeNull()
    fireEvent.click(rig.q('browser-tab-close-2'))
    expect(rig.has('browser-tab-2')).toBe(false)
    fireEvent.click(rig.q('browser-bookmark-1'))
    expect(screen.getByText('Hello site')).toBeInTheDocument()
    rig.d().setSim({ wifiOn: false })
    fireEvent.click(rig.q('browser-reload'))
    expect(screen.getByText('No internet')).toBeInTheDocument()
  })

  it('shows a padlock for https pages only and explains its limits', () => {
    const rig = renderApp('windows', 'browser', { url: 'https://free-prize-claim.example/' })
    fireEvent.click(rig.q('browser-padlock'))
    expect(screen.getByText(/does not mean the site is honest/)).toBeInTheDocument()
    expect(has(rig.events(), { type: 'custom', event: 'browser-padlock-click' })).toBe(true)
  })

  it('downloads a file into the Downloads folder with progress and events', async () => {
    vi.useFakeTimers()
    try {
      const rig = renderApp('windows', 'browser', { url: 'https://download.official-editor.example/' })
      fireEvent.click(rig.q('download-official'))
      expect(has(rig.events(), { type: 'custom', event: 'browser-download-started' })).toBe(true)
      expect(rig.has('browser-download-progress')).toBe(true)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000)
      })
      expect(has(rig.events(), { type: 'custom', event: 'browser-download-done' })).toBe(true)
      const dl = rig.d().vfs.child(rig.d().vfs.home, 'Downloads')!
      expect(rig.d().vfs.child(dl, 'OfficialEditor-setup.exe')).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it('the ad button does not download anything', () => {
    const rig = renderApp('mac', 'browser', { url: 'https://download.official-editor.example/' })
    fireEvent.click(rig.q('download-ad-trap'))
    expect(has(rig.events(), { type: 'custom', event: 'browser-ad-trap' })).toBe(true)
    expect(has(rig.events(), { type: 'custom', event: 'browser-download-started' })).toBe(false)
  })
})
