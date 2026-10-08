/** Pure window-manager reducer: position, size, z-order, minimize/maximize, focus history. */

export interface WinState {
  id: string
  app: string
  title: string
  x: number
  y: number
  w: number
  h: number
  minimized: boolean
  maximized: boolean
  z: number
  restoreRect?: { x: number; y: number; w: number; h: number }
  props?: Record<string, unknown>
}

export interface Bounds {
  w: number
  h: number
  /** space reserved at top (Mac menu bar) and bottom (taskbar / dock) that maximized windows avoid */
  top: number
  bottom: number
}

export interface WmState {
  windows: WinState[]
  zCounter: number
  /** window ids, most recently focused first */
  order: string[]
  bounds: Bounds
  /** true after clicking the empty desktop: no window is the active one */
  desktopFocused: boolean
}

export type WmAction =
  | { type: 'open'; id: string; app: string; title: string; w?: number; h?: number; x?: number; y?: number; props?: Record<string, unknown> }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'toggleMaximize'; id: string }
  | { type: 'move'; id: string; x: number; y: number }
  | { type: 'resize'; id: string; x: number; y: number; w: number; h: number }
  | { type: 'setTitle'; id: string; title: string }
  | { type: 'setProps'; id: string; props: Record<string, unknown> }
  | { type: 'setBounds'; bounds: Bounds }
  | { type: 'cycle' }
  | { type: 'focusDesktop' }
  | { type: 'minimizeAll' }
  | { type: 'restoreAll' }
  | { type: 'closeAll' }

export const MIN_W = 300
export const MIN_H = 200

export const initialWm = (bounds: Bounds): WmState => ({ windows: [], zCounter: 1, order: [], bounds, desktopFocused: false })

export const activeWindow = (s: WmState): WinState | undefined =>
  s.desktopFocused
    ? undefined
    : s.order.map((id) => s.windows.find((w) => w.id === id)).find((w) => w && !w.minimized)

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function maxRect(b: Bounds) {
  return { x: 0, y: b.top, w: b.w, h: Math.max(MIN_H, b.h - b.top - b.bottom) }
}

function bringToFront(s: WmState, id: string): WmState {
  const z = s.zCounter + 1
  return {
    ...s,
    zCounter: z,
    desktopFocused: false,
    order: [id, ...s.order.filter((o) => o !== id)],
    windows: s.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)),
  }
}

export function wmReducer(s: WmState, a: WmAction): WmState {
  switch (a.type) {
    case 'open': {
      if (s.windows.some((w) => w.id === a.id)) return bringToFront(s, a.id)
      const b = s.bounds
      const w = Math.min(a.w ?? 640, b.w)
      const h = Math.min(a.h ?? 420, Math.max(MIN_H, b.h - b.top - b.bottom))
      const cascade = (s.windows.length % 6) * 28
      const x = clamp(a.x ?? 70 + cascade, 0, Math.max(0, b.w - w))
      const y = clamp(a.y ?? b.top + 24 + cascade, b.top, Math.max(b.top, b.h - b.bottom - h))
      const win: WinState = { id: a.id, app: a.app, title: a.title, x, y, w, h, minimized: false, maximized: false, z: s.zCounter + 1, props: a.props }
      return { ...s, zCounter: s.zCounter + 1, desktopFocused: false, windows: [...s.windows, win], order: [a.id, ...s.order] }
    }
    case 'close':
      return { ...s, desktopFocused: false, windows: s.windows.filter((w) => w.id !== a.id), order: s.order.filter((o) => o !== a.id) }
    case 'focus':
      return s.windows.some((w) => w.id === a.id) ? bringToFront(s, a.id) : s
    case 'focusDesktop':
      return s.desktopFocused ? s : { ...s, desktopFocused: true }
    case 'minimize':
      return { ...s, desktopFocused: false, windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w)) }
    case 'toggleMaximize': {
      const next = s.windows.map((w) => {
        if (w.id !== a.id) return w
        if (w.maximized) {
          const r = w.restoreRect ?? { x: 80, y: 60, w: 640, h: 420 }
          return { ...w, maximized: false, ...r, restoreRect: undefined }
        }
        const r = maxRect(s.bounds)
        return { ...w, maximized: true, restoreRect: { x: w.x, y: w.y, w: w.w, h: w.h }, ...r }
      })
      return bringToFront({ ...s, windows: next }, a.id)
    }
    case 'move': {
      const b = s.bounds
      return {
        ...s,
        windows: s.windows.map((w) =>
          w.id === a.id && !w.maximized
            ? { ...w, x: clamp(a.x, 80 - w.w, b.w - 80), y: clamp(a.y, b.top, Math.max(b.top, b.h - 40)) }
            : w,
        ),
      }
    }
    case 'resize':
      return {
        ...s,
        windows: s.windows.map((w) =>
          w.id === a.id && !w.maximized ? { ...w, x: a.x, y: a.y, w: Math.max(MIN_W, a.w), h: Math.max(MIN_H, a.h) } : w,
        ),
      }
    case 'setTitle':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, title: a.title } : w)) }
    case 'setProps':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, props: { ...w.props, ...a.props, _n: ((w.props?._n as number) ?? 0) + 1 } } : w)) }
    case 'setBounds': {
      const b = a.bounds
      return {
        ...s,
        bounds: b,
        windows: s.windows.map((w) => {
          if (w.maximized) return { ...w, ...maxRect(b) }
          const ww = Math.min(w.w, b.w)
          return { ...w, w: ww, x: clamp(w.x, 0, Math.max(0, b.w - ww)), y: clamp(w.y, b.top, Math.max(b.top, b.h - 40)) }
        }),
      }
    }
    case 'cycle': {
      // Alt+Tab / Cmd+Tab: jump to the previously used window.
      const ids = s.order.filter((id) => s.windows.some((w) => w.id === id))
      if (ids.length < 2) return s
      return bringToFront(s, ids[1])
    }
    case 'minimizeAll':
      return { ...s, windows: s.windows.map((w) => ({ ...w, minimized: true })) }
    case 'restoreAll':
      return { ...s, windows: s.windows.map((w) => ({ ...w, minimized: false })) }
    case 'closeAll':
      return { ...s, windows: [], order: [] }
  }
}
