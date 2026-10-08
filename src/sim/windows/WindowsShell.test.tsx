import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react'
import { SimBus } from '../bus'
import { DesktopProvider } from '../DesktopContext'
import { Frame } from '../Frame'
import { registerApp } from '../apps/registry'
import WindowsShell, { WINDOWS_INSET } from './WindowsShell'

registerApp({ id: 'files', title: () => 'File Explorer', icon: () => <i />, component: () => <div>files</div>, defaultSize: { w: 500, h: 400 } })

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})
afterEach(cleanup)

function setup() {
  const bus = new SimBus()
  render(
    <DesktopProvider os="windows" bus={bus} insets={WINDOWS_INSET}>
      <Frame Shell={WindowsShell} insetTop={WINDOWS_INSET.top} insetBottom={WINDOWS_INSET.bottom} />
    </DesktopProvider>,
  )
  const q = (id: string) => document.querySelector(`[data-coach="${id}"]`) as HTMLElement | null
  return { bus, q }
}

describe('WindowsShell', () => {
  it('renders taskbar, clock and desktop specials', () => {
    const { q } = setup()
    expect(q('taskbar')).toBeTruthy()
    expect(q('tray-clock')?.textContent).toMatch(/\d{1,2}:\d{2}\s?[AP]M/)
    expect(q('icon-Recycle Bin')).toBeTruthy()
    expect(q('taskbar-app-files')).toBeTruthy()
  })

  it('opens Start, searches, and closes on Escape', () => {
    const { q } = setup()
    expect(q('start-menu')).toBeNull()
    fireEvent.click(q('start-button')!)
    expect(q('start-menu')).toBeTruthy()
    expect(q('start-app-files')).toBeTruthy()
    fireEvent.change(q('start-search')!, { target: { value: 'welcome' } })
    expect(q('start-file-Welcome.txt')).toBeTruthy()
    fireEvent.click(q('start-power')!)
    expect(q('power-menu')).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(q('start-menu')).toBeNull()
  })

  it('taskbar app toggles open / minimize / restore', () => {
    const { q } = setup()
    fireEvent.click(q('taskbar-app-files')!)
    expect(screen.getByText('files')).toBeInTheDocument()
    expect(q('taskbar-app-files')!.querySelector('span')).toBeTruthy() // running indicator
    fireEvent.click(q('taskbar-app-files')!) // active -> minimize
    fireEvent.click(q('taskbar-app-files')!) // restore
    fireEvent.click(q('show-desktop')!)
    fireEvent.click(q('taskbar-app-files')!)
    expect(screen.getByText('files')).toBeInTheDocument()
  })

  it('quick settings toggles wifi', () => {
    const { q } = setup()
    fireEvent.click(q('tray')!)
    expect(q('quick-settings')).toBeTruthy()
    fireEvent.click(q('qs-wifi')!)
    expect(q('qs-wifi')!.getAttribute('aria-checked')).toBe('false')
  })

  it('shuts down and powers back on', () => {
    const { q } = setup()
    fireEvent.click(q('start-button')!)
    fireEvent.click(q('start-power')!)
    fireEvent.click(q('power-shut-down')!)
    expect(q('power-on-button')).toBeTruthy()
    act(() => q('power-on-button')!.click())
    expect(q('power-on-button')).toBeNull()
  })

  it('double-clicking the Recycle Bin does not crash without a bin app', () => {
    const { q } = setup()
    fireEvent.doubleClick(q('icon-Recycle Bin')!)
    expect(q('taskbar')).toBeTruthy()
  })
})
