import { useEffect } from 'react'
import { act, render } from '@testing-library/react'
import { DesktopProvider, useDesktop, type DesktopApi } from '../DesktopContext'
import { SimBus } from '../bus'
import type { OsFlavor } from '../../engine/types'
import { WindowLayer } from '../ui/WindowLayer'
import { ContextMenuHost } from '../ui/ContextMenu'
import { registerBuiltinApps } from './index'

export interface Rig {
  bus: SimBus
  /** latest desktop api */
  d: () => DesktopApi
  key: (combo: string) => boolean
  open: (app: string, props?: Record<string, unknown>, newWindow?: boolean) => void
  q: <T extends HTMLElement = HTMLElement>(coach: string) => T
  has: (coach: string) => boolean
  events: () => string[]
}

export function renderApp(os: OsFlavor, app?: string, props?: Record<string, unknown>): Rig {
  registerBuiltinApps()
  const bus = new SimBus()
  let api!: DesktopApi
  function Probe() {
    api = useDesktop()
    useEffect(() => {
      if (app) api.openApp(app, { props })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
      <>
        <WindowLayer />
        <ContextMenuHost />
      </>
    )
  }
  const r = render(
    <DesktopProvider os={os} bus={bus} insets={{ top: 0, bottom: 0 }}>
      <Probe />
    </DesktopProvider>,
  )
  const q = <T extends HTMLElement = HTMLElement>(coach: string) => {
    const el = r.container.ownerDocument.querySelector<T>(`[data-coach="${CSS.escape(coach)}"]`)
    if (!el) throw new Error(`no element with data-coach="${coach}"`)
    return el
  }
  return {
    bus,
    d: () => api,
    key: (c) => {
      let handled = false
      act(() => {
        handled = api.dispatchCombo(c)
      })
      return handled
    },
    open: (a, p, nw) => act(() => api.openApp(a, { props: p, newWindow: nw })),
    q,
    has: (coach) => !!r.container.ownerDocument.querySelector(`[data-coach="${CSS.escape(coach)}"]`),
    events: () => bus.log.map((e) => JSON.stringify(e)),
  }
}
