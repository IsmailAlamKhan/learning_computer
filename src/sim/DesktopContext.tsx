/**
 * DesktopContext: all state of one simulated desktop (windows, file system, overlays, settings, clipboard).
 * Shells (WindowsShell / MacShell), windows and apps read it with `useDesktop()`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react'
import type { OsFlavor } from '../engine/types'
import { SimBus, type SimEvent } from './bus'
import { VirtualFileSystem, type VNode } from './vfs'
import { activeWindow, initialWm, wmReducer, type Bounds, type WinState, type WmAction, type WmState } from './windowManager'
import { getApp } from './apps/registry'
import { normalizeCombo, systemAction, type ShortcutAction } from './shortcuts'

export interface SimSettings {
  wallpaper: number
  brightness: number
  volume: number
  muted: boolean
  wifiOn: boolean
  wifiNetwork: string
  bluetoothOn: boolean
  darkMode: boolean
  /** display zoom / text size, 100 = normal */
  zoom: number
  timezone: string
  clock24: boolean
  language: 'English' | 'বাংলা'
}

export const defaultSimSettings: SimSettings = {
  wallpaper: 0,
  brightness: 100,
  volume: 50,
  muted: false,
  wifiOn: true,
  wifiNetwork: 'HomeWiFi',
  bluetoothOn: false,
  darkMode: false,
  zoom: 100,
  timezone: 'Asia/Dhaka',
  clock24: false,
  language: 'English',
}

export interface UiState {
  startOpen: boolean
  launchpadOpen: boolean
  spotlightOpen: boolean
  /** shown for ~1s after Alt+Tab / Cmd+Tab */
  switcherVisible: boolean
  locked: boolean
  /** which app's menu is open in the Mac menu bar, etc. Free-form for shells. */
  openMenu: string | null
}

export interface MenuItem {
  /** short id used for the coach target: data-coach="ctx-<id>" */
  id?: string
  label?: string
  shortcut?: string
  disabled?: boolean
  separator?: boolean
  checked?: boolean
  submenu?: MenuItem[]
  onSelect?: () => void
}
export interface MenuState {
  x: number
  y: number
  items: MenuItem[]
}

export interface Clipboard {
  mode: 'copy' | 'cut'
  nodes: VNode[]
}

export interface Toast {
  id: number
  text: string
}

type ComboHandler = (combo: string) => boolean | void

export interface DesktopApi {
  os: OsFlavor
  userName: string
  vfs: VirtualFileSystem
  /** re-renders when the file system changes */
  vfsVersion: number
  bus: SimBus
  emit: (e: SimEvent) => void
  rootRef: RefObject<HTMLDivElement | null>

  wm: WmState
  wmDispatch: (a: WmAction) => void
  active: WinState | undefined
  openApp: (appId: string, opts?: { props?: Record<string, unknown>; newWindow?: boolean }) => void
  closeWindow: (id: string) => void
  /** Apps may register a guard for their window id; if it returns true the close is vetoed (the app then closes itself later). */
  closeGuards: RefObject<Map<string, () => boolean>>
  closeApp: (appId: string) => void
  openFolder: (path: string) => void
  openFile: (node: VNode) => void
  setBounds: (b: Bounds) => void

  sim: SimSettings
  setSim: (patch: Partial<SimSettings>) => void
  ui: UiState
  setUi: (patch: Partial<UiState>) => void

  menu: MenuState | null
  openMenu: (e: { clientX: number; clientY: number }, items: MenuItem[]) => void
  closeMenu: () => void

  clipboard: Clipboard | null
  setClipboard: (c: Clipboard | null) => void
  toasts: Toast[]
  toast: (text: string) => void

  /** feed a key combination (real keyboard or the on-screen shortcut pad) */
  dispatchCombo: (combo: string) => boolean
  registerComboHandler: (h: ComboHandler) => () => void
  runSystemAction: (a: ShortcutAction) => void
  /** desktop icon positions (grid cell index per node id / special id) */
  iconPos: Record<string, { col: number; row: number }>
  setIconPos: (id: string, pos: { col: number; row: number }) => void
  selection: string | null
  setSelection: (id: string | null) => void
}

const Ctx = createContext<DesktopApi | null>(null)

export function useDesktop(): DesktopApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('useDesktop must be used inside <DesktopProvider>')
  return v
}

/** Run `fn` for combos while this window is the active one. Return true if handled. */
export function useWindowCombos(winId: string, fn: ComboHandler) {
  const d = useDesktop()
  const ref = useRef(fn)
  ref.current = fn
  const activeId = d.active?.id
  useEffect(() => {
    return d.registerComboHandler((c) => (activeId === winId ? ref.current(c) : false))
  }, [d, winId, activeId])
}

interface ProviderProps {
  os: OsFlavor
  userName?: string
  bus: SimBus
  /** seed the file system differently (e.g. restore a snapshot) */
  vfsFactory?: () => VirtualFileSystem
  /** Space reserved for maximize: Windows taskbar at bottom, Mac menu bar at top. */
  insets: { top: number; bottom: number }
  initialSettings?: Partial<SimSettings>
  children: ReactNode
}

export function DesktopProvider({ os, userName = 'Anika', bus, vfsFactory, insets, initialSettings, children }: ProviderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [vfs] = useState(() => vfsFactory?.() ?? new VirtualFileSystem(os, userName))
  const vfsVersion = useSyncExternalStore(vfs.subscribe, vfs.getVersion)
  const [wm, wmDispatch] = useReducer(wmReducer, undefined, () => initialWm({ w: 1000, h: 620, top: insets.top, bottom: insets.bottom }))
  const [sim, setSimState] = useState<SimSettings>({ ...defaultSimSettings, ...initialSettings })
  const [ui, setUiState] = useState<UiState>({ startOpen: false, launchpadOpen: false, spotlightOpen: false, switcherVisible: false, locked: false, openMenu: null })
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [clipboard, setClipboard] = useState<Clipboard | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [iconPos, setIconPosState] = useState<Record<string, { col: number; row: number }>>({})
  const [selection, setSelection] = useState<string | null>(null)
  const handlers = useRef(new Set<ComboHandler>())
  const wmRef = useRef(wm)
  wmRef.current = wm
  const closeGuards = useRef(new Map<string, () => boolean>())
  const switcherTimer = useRef<number | undefined>(undefined)

  // forward file-system events to the bus
  useEffect(() => vfs.onEvent(bus.emit), [vfs, bus])

  const emit = bus.emit

  const setSim = useCallback(
    (patch: Partial<SimSettings>) => {
      setSimState((s) => ({ ...s, ...patch }))
      for (const [k, v] of Object.entries(patch)) emit({ type: 'selectOption', target: `setting-${k}`, value: String(v) })
    },
    [emit],
  )
  const setUi = useCallback((patch: Partial<UiState>) => setUiState((u) => ({ ...u, ...patch })), [])

  const setBounds = useCallback((b: Bounds) => wmDispatch({ type: 'setBounds', bounds: b }), [])

  const openApp = useCallback<DesktopApi['openApp']>(
    (appId, opts) => {
      const def = getApp(appId)
      if (!def) return
      let id = appId
      if (opts?.newWindow || def.singleInstance === false) {
        let n = 1
        while (wmRef.current.windows.some((w) => w.id === id)) id = `${appId}#${++n}`
      }
      const existing = wmRef.current.windows.find((w) => w.id === id)
      if (existing) wmDispatch({ type: 'focus', id })
      else wmDispatch({ type: 'open', id, app: appId, title: def.title(os), w: def.defaultSize.w, h: def.defaultSize.h, props: opts?.props })
      if (existing && opts?.props) wmDispatch({ type: 'setProps', id, props: opts.props })
      setUiState((u) => ({ ...u, startOpen: false, launchpadOpen: false, spotlightOpen: false, openMenu: null }))
      emit({ type: 'openApp', app: appId })
    },
    [os, emit],
  )

  const closeWindow = useCallback(
    (id: string) => {
      const w = wmRef.current.windows.find((x) => x.id === id)
      if (!w) return
      if (closeGuards.current.get(id)?.()) return
      wmDispatch({ type: 'close', id })
      emit({ type: 'closeApp', app: w.app })
    },
    [emit],
  )
  const closeApp = useCallback(
    (appId: string) => {
      wmRef.current.windows.filter((w) => w.app === appId).forEach((w) => closeWindow(w.id))
    },
    [closeWindow],
  )

  const openFolder = useCallback(
    (path: string) => {
      openApp('files', { props: { path } })
    },
    [openApp],
  )

  const openFile = useCallback(
    (node: VNode) => {
      if (node.kind === 'folder') return openApp('files', { props: { path: vfs.canonPath(node) } })
      if (node.media === 'image') return openApp('photos', { props: { nodeId: node.id }, newWindow: true })
      if (node.media === 'pdf' || node.media === 'app' || node.media === 'zip') {
        toastRef.current(`“${node.name}” can’t be opened in this practice computer.`)
        return
      }
      openApp('editor', { props: { nodeId: node.id }, newWindow: true })
    },
    [openApp, vfs],
  )

  const toastRef = useRef<(t: string) => void>(() => {})
  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])
  toastRef.current = toast

  const openMenu = useCallback<DesktopApi['openMenu']>((e, items) => {
    const r = rootRef.current?.getBoundingClientRect()
    setMenu({ x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0), items })
  }, [])
  const closeMenu = useCallback(() => setMenu(null), [])

  const flashSwitcher = useCallback(() => {
    setUiState((u) => ({ ...u, switcherVisible: true }))
    window.clearTimeout(switcherTimer.current)
    switcherTimer.current = window.setTimeout(() => setUiState((u) => ({ ...u, switcherVisible: false })), 900)
  }, [])

  const runSystemAction = useCallback(
    (a: ShortcutAction) => {
      const act = activeWindow(wmRef.current)
      switch (a) {
        case 'switchWindow':
          wmDispatch({ type: 'cycle' })
          flashSwitcher()
          break
        case 'closeWindow':
          if (act) closeWindow(act.id)
          break
        case 'quitApp':
          if (act) closeApp(act.app)
          break
        case 'minimizeWindow':
          if (act) wmDispatch({ type: 'minimize', id: act.id })
          break
        case 'maximizeWindow':
          if (act && !act.maximized) wmDispatch({ type: 'toggleMaximize', id: act.id })
          break
        case 'showDesktop':
          wmDispatch({ type: 'minimizeAll' })
          break
        case 'openStart':
          setUiState((u) => ({ ...u, startOpen: !u.startOpen }))
          break
        case 'openSpotlight':
          setUiState((u) => ({ ...u, spotlightOpen: !u.spotlightOpen }))
          break
        case 'openLaunchpad':
          setUiState((u) => ({ ...u, launchpadOpen: !u.launchpadOpen }))
          break
        case 'lockScreen':
          setUiState((u) => ({ ...u, locked: true }))
          break
        case 'newFolder': {
          const d = vfs.child(vfs.home, 'Desktop')
          if (d) vfs.mkdir(d)
          break
        }
        default:
          break
      }
    },
    [closeWindow, closeApp, flashSwitcher, vfs],
  )

  const registerComboHandler = useCallback((h: ComboHandler) => {
    handlers.current.add(h)
    return () => {
      handlers.current.delete(h)
    }
  }, [])

  const dispatchCombo = useCallback(
    (raw: string): boolean => {
      const combo = normalizeCombo(raw, os)
      emit({ type: 'keyCombo', keys: combo })
      const sys = systemAction(combo, os)
      if (sys) {
        runSystemAction(sys)
        return true
      }
      let handled = false
      handlers.current.forEach((h) => {
        if (h(combo)) handled = true
      })
      return handled
    },
    [os, emit, runSystemAction],
  )

  const setIconPos = useCallback((id: string, pos: { col: number; row: number }) => setIconPosState((p) => ({ ...p, [id]: pos })), [])

  const api = useMemo<DesktopApi>(
    () => ({
      os,
      userName,
      vfs,
      vfsVersion,
      bus,
      emit,
      rootRef,
      wm,
      wmDispatch,
      active: activeWindow(wm),
      openApp,
      closeWindow,
      closeGuards,
      closeApp,
      openFolder,
      openFile,
      setBounds,
      sim,
      setSim,
      ui,
      setUi,
      menu,
      openMenu,
      closeMenu,
      clipboard,
      setClipboard,
      toasts,
      toast,
      dispatchCombo,
      registerComboHandler,
      runSystemAction,
      iconPos,
      setIconPos,
      selection,
      setSelection,
    }),
    [os, userName, vfs, vfsVersion, bus, emit, wm, openApp, closeWindow, closeApp, openFolder, openFile, setBounds, sim, setSim, ui, setUi, menu, openMenu, closeMenu, clipboard, toasts, toast, dispatchCombo, registerComboHandler, runSystemAction, iconPos, setIconPos, selection],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
