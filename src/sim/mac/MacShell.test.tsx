import { useEffect } from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { SimBus } from '../bus'
import { DesktopProvider, useDesktop, type DesktopApi } from '../DesktopContext'
import { Frame } from '../Frame'
import { registerApp } from '../apps/registry'
import { FinderAppIcon, TextEditIcon } from '../ui/icons'
import MacShell, { MAC_INSET } from './MacShell'

const holder: { api?: DesktopApi } = {}
function Probe() {
  const d = useDesktop()
  useEffect(() => {
    holder.api = d
  })
  return null
}
const api = new Proxy({} as DesktopApi, { get: (_, k) => holder.api![k as keyof DesktopApi] })

function setup() {
  const bus = new SimBus()
  render(
    <DesktopProvider os="mac" bus={bus} insets={MAC_INSET}>
      <Probe />
      <Frame Shell={MacShell} insetTop={28} insetBottom={80} />
    </DesktopProvider>,
  )
  return bus
}

const q = (coach: string) => document.querySelector(`[data-coach="${coach}"]`) as HTMLElement | null

describe('MacShell', () => {
  beforeAll(() => {
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    registerApp({ id: 'files', title: () => 'Finder', icon: FinderAppIcon, component: () => <div>files</div>, defaultSize: { w: 500, h: 360 } })
    registerApp({ id: 'editor', title: () => 'TextEdit', icon: TextEditIcon, component: () => <div>editor</div>, defaultSize: { w: 500, h: 360 } })
    registerApp({ id: 'bin', title: () => 'Trash', icon: FinderAppIcon, component: () => <div>bin</div>, defaultSize: { w: 500, h: 360 } })
  })

  it('renders menu bar, dock and clock', () => {
    setup()
    expect(q('menubar')).toBeTruthy()
    expect(q('menu-system')).toBeTruthy()
    expect(q('menu-app')?.textContent).toBe('Finder')
    expect(q('dock')).toBeTruthy()
    expect(q('dock-files')).toBeTruthy()
    expect(q('menubar-clock')?.textContent).toMatch(/\d/)
  })

  it('opens menus and switches on hover', () => {
    setup()
    fireEvent.click(q('menu-file')!)
    expect(q('menu-item-new-folder')).toBeTruthy()
    fireEvent.mouseEnter(q('menu-edit')!)
    expect(q('menu-item-copy')).toBeTruthy()
    expect(q('menu-item-new-folder')).toBeNull()
  })

  it('opens and closes Launchpad', () => {
    setup()
    fireEvent.click(q('dock-launchpad')!)
    expect(q('launchpad')).toBeTruthy()
    expect(q('launchpad-app-files')).toBeTruthy()
    fireEvent.keyDown(q('launchpad')!, { key: 'Escape' })
    expect(q('launchpad')).toBeNull()
    fireEvent.click(q('dock-launchpad')!)
    fireEvent.click(q('launchpad')!)
    expect(q('launchpad')).toBeNull()
  })

  it('opens an app from the dock and shows a running dot', () => {
    setup()
    fireEvent.click(q('dock-editor')!)
    expect(api.wm.windows.some((w) => w.app === 'editor')).toBe(true)
    expect(q('dock-editor')!.parentElement!.parentElement!.querySelector('[data-running="true"]')).toBeTruthy()
  })

  it('Spotlight finds files', () => {
    setup()
    fireEvent.click(q('menubar-search')!)
    expect(api.ui.spotlightOpen).toBe(true)
    fireEvent.change(q('spotlight-input')!, { target: { value: 'Welcome' } })
    expect(q('spotlight-result-0')?.textContent).toContain('Welcome.txt')
    fireEvent.keyDown(q('spotlight-input')!, { key: 'Escape' })
    expect(api.ui.spotlightOpen).toBe(false)
  })

  it('Trash click opens the bin app', () => {
    setup()
    fireEvent.click(q('dock-trash')!)
    expect(api.wm.windows.some((w) => w.app === 'bin')).toBe(true)
  })

  it('Shut Down shows power-on button', () => {
    setup()
    fireEvent.click(q('menu-system')!)
    fireEvent.click(q('menu-item-shutdown')!)
    expect(q('power-on-button')).toBeTruthy()
    act(() => fireEvent.click(q('power-on-button')!))
    expect(q('power-on-button')).toBeNull()
  })

  it('Sleep and Restart emit events and show overlays', () => {
    const bus = setup()
    const ev = () => bus.log.filter((e) => e.type === 'custom').map((e) => (e as { event: string }).event)
    fireEvent.click(q('menu-system')!)
    fireEvent.click(q('menu-item-sleep')!)
    expect(q('wake-button')).toBeTruthy()
    act(() => fireEvent.click(q('wake-button')!))
    fireEvent.click(q('menu-system')!)
    fireEvent.click(q('menu-item-restart')!)
    expect(q('power-restarting')).toBeTruthy()
    expect(ev()).toEqual(expect.arrayContaining(['power-sleep', 'power-wake', 'power-restart']))
  })
})
