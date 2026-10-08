import { describe, expect, it } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { renderApp } from './testUtils'
import { DesktopProvider, useDesktop, type DesktopApi } from '../DesktopContext'
import { SimBus } from '../bus'
import { InputIndicator } from '../ui/InputIndicator'
import { nextKeyboard } from '../keyboards'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))

describe('adding a Bangla keyboard (Windows)', () => {
  it('Time & language → Language & region → Add a language → Install', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.click(rig.q('settings-nav-time'))
    // existing Date & time controls still there
    expect(rig.has('settings-timezone')).toBe(true)
    fireEvent.click(rig.q('settings-time-tab-language'))
    expect(rig.d().sim.keyboards).toEqual(['en'])
    fireEvent.click(rig.q('settings-add-language'))
    fireEvent.click(rig.q('settings-lang-choice-bn'))
    fireEvent.click(rig.q('settings-lang-next'))
    fireEvent.click(rig.q('settings-lang-install'))
    expect(rig.d().sim.keyboards).toEqual(['en', 'bn'])
    expect(rig.has('settings-lang-bn')).toBe(true)
    expect(has(rig.events(), { type: 'custom', event: 'keyboard-added' })).toBe(true)
  })
  it('Next stays unavailable until Bangla (Bangladesh) is chosen', () => {
    const rig = renderApp('windows', 'settings')
    fireEvent.click(rig.q('settings-nav-time'))
    fireEvent.click(rig.q('settings-time-tab-language'))
    fireEvent.click(rig.q('settings-add-language'))
    fireEvent.click(rig.q('settings-lang-next'))
    expect(rig.has('settings-lang-features')).toBe(false)
    fireEvent.change(rig.q('settings-lang-search'), { target: { value: 'bangla' } })
    expect(rig.has('settings-lang-choice-hi')).toBe(false)
  })
})

describe('adding a Bangla keyboard (Mac)', () => {
  it('Keyboard → Text Input → Edit… → + → Bangla → Add', () => {
    const rig = renderApp('mac', 'settings')
    fireEvent.click(rig.q('settings-nav-keyboard'))
    fireEvent.click(rig.q('settings-input-edit'))
    fireEvent.click(rig.q('settings-input-add'))
    fireEvent.click(rig.q('settings-input-add-confirm')) // disabled until a language is chosen
    expect(rig.d().sim.keyboards).toEqual(['en'])
    fireEvent.click(rig.q('settings-input-lang-bn'))
    fireEvent.click(rig.q('settings-input-add-confirm'))
    expect(rig.d().sim.keyboards).toEqual(['en', 'bn'])
    expect(has(rig.events(), { type: 'custom', event: 'keyboard-added' })).toBe(true)
    fireEvent.click(rig.q('settings-input-done'))
    expect(rig.has('settings-input-sheet')).toBe(false)
  })
})

describe('input indicator', () => {
  function setup(os: 'windows' | 'mac', keyboards: string[]) {
    let api!: DesktopApi
    function Probe() {
      api = useDesktop()
      useEffect(() => api.setSim({ keyboards }), [])
      return <InputIndicator mac={os === 'mac'} />
    }
    render(
      <DesktopProvider os={os} bus={new SimBus()} insets={{ top: 0, bottom: 0 }}>
        <Probe />
      </DesktopProvider>,
    )
    return () => api
  }
  it('is hidden with only one keyboard', () => {
    const one = setup('windows', ['en'])
    expect(document.querySelector('[data-coach="tray-input"]')).toBeNull()
    expect(one().sim.activeKeyboard).toBe('en')
  })
  it('Windows: ENG → BEN through the flyout and with Win+Space', () => {
    const api = setup('windows', ['en', 'bn'])
    const btn = document.querySelector<HTMLElement>('[data-coach="tray-input"]')!
    expect(btn.textContent).toBe('ENG')
    fireEvent.click(btn)
    fireEvent.click(document.querySelector('[data-coach="tray-input-bn"]')!)
    expect(api().sim.activeKeyboard).toBe('bn')
    expect(document.querySelector('[data-coach="tray-input"]')!.textContent).toBe('BEN')
    act(() => void api().dispatchCombo('win+space'))
    expect(api().sim.activeKeyboard).toBe('en')
  })
  it('Mac: input menu and Control+Space', () => {
    const api = setup('mac', ['en', 'bn'])
    fireEvent.click(document.querySelector('[data-coach="menubar-input"]')!)
    fireEvent.click(document.querySelector('[data-coach="menubar-input-bn"]')!)
    expect(api().sim.activeKeyboard).toBe('bn')
    act(() => void api().dispatchCombo('ctrl+space'))
    expect(api().sim.activeKeyboard).toBe('en')
    expect(screen.getByRole('button', { name: /Input menu/ })).toBeTruthy()
  })
  it('nextKeyboard cycles', () => {
    expect(nextKeyboard(['en', 'bn'], 'en')).toBe('bn')
    expect(nextKeyboard(['en', 'bn'], 'bn')).toBe('en')
    expect(nextKeyboard(undefined, undefined)).toBe('en')
  })
})
