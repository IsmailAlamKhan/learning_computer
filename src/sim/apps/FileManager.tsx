/**
 * File Explorer (Windows) / Finder (Mac) and the Recycle Bin / Trash window (same component, `bin` flag).
 */
import { useEffect, useRef, useState, type MouseEvent as RMouseEvent, type ReactNode } from 'react'
import { useDesktop, useWindowCombos, type MenuItem } from '../DesktopContext'
import { dropZoneProps, useDrag } from '../dnd'
import { errorMessageEn, extensionOf, type VNode } from '../vfs'
import type { WinState } from '../windowManager'
import { SimDialog } from '../ui/SimDialog'
import { BackGlyph, ForwardGlyph, FolderIcon, NodeIcon, PlusGlyph, RecycleBinIcon, RefreshGlyph, SearchGlyph, UpGlyph, UsbIcon } from '../ui/icons'
import { getDevices } from '../devices/store'
import { attached, nodeBytes, findNode, fmtDate, fmtSize, isTypingTarget, kindLabel, splitExt } from './util'
import { useFmPrefs } from './fmPrefs'

type View = 'grid' | 'list'
type SortKey = 'name' | 'modified' | 'type' | 'size'

interface Entry {
  key: string
  node: VNode
  binId?: string
  location?: string
  deletedAt?: number
}

interface Renaming {
  key: string
  draft: string
  suffix: string
}

type Dlg =
  | { kind: 'error'; title: string; msg: string; after?: () => void }
  | { kind: 'props'; node: VNode }
  | { kind: 'empty' }
  | { kind: 'goto'; text: string; err?: string }

interface DragPayload {
  kind: 'node'
  id: string
  ids: string[]
}

const payloadIds = (p: unknown): string[] => {
  const o = p as { kind?: string; id?: string; ids?: string[] } | null
  if (!o || o.kind !== 'node') return []
  return o.ids ?? (o.id ? [o.id] : [])
}

const nodeSize = (n: VNode) => (n.kind === 'file' ? nodeBytes(n) : 0)

function sortEntries(list: Entry[], key: SortKey, asc: boolean): Entry[] {
  const nm = (a: VNode, b: VNode) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  const cmp = (x: Entry, y: Entry) => {
    const a = x.node
    const b = y.node
    if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
    let r = 0
    if (key === 'modified') r = (x.deletedAt ?? a.modifiedAt) - (y.deletedAt ?? b.modifiedAt)
    else if (key === 'size') r = nodeSize(a) - nodeSize(b)
    else if (key === 'type') r = extensionOf(a.name).localeCompare(extensionOf(b.name))
    if (r === 0) return nm(a, b)
    return asc ? r : -r
  }
  const out = list.slice().sort((x, y) => {
    if (key === 'name') {
      const a = x.node
      const b = y.node
      if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
      return asc ? nm(a, b) : nm(b, a)
    }
    return cmp(x, y)
  })
  return out
}

function ToolBtn({ label, coach, onClick, disabled, children, active, wide }: { label: string; coach?: string; onClick: (e: RMouseEvent<HTMLButtonElement>) => void; disabled?: boolean; children?: ReactNode; active?: boolean; wide?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-coach={coach}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-9 items-center justify-center gap-1.5 rounded px-2.5 text-sm text-gray-800 hover:bg-black/8 disabled:text-gray-400 disabled:hover:bg-transparent ${active ? 'bg-black/10' : ''} ${wide ? 'min-w-9' : ''}`}
    >
      {children}
    </button>
  )
}

interface ItemProps {
  entry: Entry
  view: View
  cols: string[]
  mac: boolean
  os: 'windows' | 'mac'
  showExt: boolean
  selected: boolean
  renaming: Renaming | null
  setRenaming: (r: Renaming | null) => void
  commitRename: (apply: boolean) => void
  dragIds: () => string[]
  bin: boolean
  onSelect: (e: RMouseEvent, entry: Entry) => void
  onOpen: (entry: Entry) => void
  onContext: (e: RMouseEvent, entry: Entry) => void
  onDropInto: (dest: VNode, payload: unknown) => void
  emitDrag: (i: { target: string; dropTarget: string }) => void
  onDragStartSelect: (entry: Entry) => void
}

function FmItem({ entry, view, cols, mac, os, showExt, selected, renaming, setRenaming, commitRename, dragIds, bin, onSelect, onOpen, onContext, onDropInto, emitDrag, onDragStartSelect }: ItemProps) {
  const node = entry.node
  const isRen = renaming?.key === entry.key
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isRen && inputRef.current) {
      const el = inputRef.current
      el.focus()
      const dot = el.value.lastIndexOf('.')
      el.setSelectionRange(0, showExt && node.kind === 'file' && dot > 0 ? dot : el.value.length)
    }
    // select once when the editor opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRen])

  const drag = useDrag({
    payload: { kind: 'node', id: node.id, ids: dragIds() } satisfies DragPayload,
    disabled: isRen || bin,
    onDragEvent: emitDrag,
    onStart: () => onDragStartSelect(entry),
  })
  const dropProps =
    node.kind === 'folder' && !bin
      ? dropZoneProps(
          (p) => onDropInto(node, p),
          (p) => !payloadIds(p).includes(node.id),
        )
      : {}

  const shown = node.kind === 'file' && !showExt ? splitExt(node.name)[0] : node.name
  const nameEl = isRen ? (
    <input
      ref={inputRef}
      data-coach="rename-input"
      aria-label="Rename"
      value={renaming!.draft}
      onChange={(e) => setRenaming({ ...renaming!, draft: e.target.value })}
      onBlur={() => commitRename(true)}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Enter') commitRename(true)
        else if (e.key === 'Escape') commitRename(false)
      }}
      className={`min-h-7 rounded border border-blue-500 bg-white px-1 text-sm text-gray-900 outline-none ${view === 'grid' ? 'w-full text-center text-xs' : 'w-64 max-w-full'}`}
    />
  ) : (
    <span className={view === 'grid' ? 'line-clamp-2 w-full text-center text-xs leading-tight break-words' : 'truncate'}>{shown}</span>
  )

  const base = `${node.hidden ? 'opacity-60' : ''} ${selected ? (mac ? 'bg-blue-500/20 ring-1 ring-blue-500/40' : 'bg-sky-100 ring-1 ring-sky-300') : 'hover:bg-black/5'} data-[drop-over=true]:bg-sky-200`
  const common = {
    ...dropProps,
    ...drag,
    'data-coach': `fm-item-${node.name}`,
    'data-fm-item': entry.key,
    role: 'option' as const,
    'aria-selected': selected,
    'aria-label': node.name,
    onClick: (e: RMouseEvent) => {
      e.stopPropagation()
      onSelect(e, entry)
    },
    onDoubleClick: (e: RMouseEvent) => {
      e.stopPropagation()
      onOpen(entry)
    },
    onContextMenu: (e: RMouseEvent) => onContext(e, entry),
  }

  if (view === 'grid') {
    return (
      <div {...common} className={`flex w-24 flex-col items-center gap-1 rounded p-1.5 select-none ${base}`}>
        <span className="pointer-events-none">
          <NodeIcon node={node} size={44} />
        </span>
        {nameEl}
      </div>
    )
  }
  const cells: ReactNode[] = cols.map((c) => {
    switch (c) {
      case 'modified':
        return fmtDate(entry.deletedAt ?? node.modifiedAt, os)
      case 'type':
        return kindLabel(node, os)
      case 'size':
        return node.kind === 'file' ? fmtSize(nodeBytes(node), os) : ''
      case 'location':
        return entry.location ?? ''
      default:
        return ''
    }
  })
  return (
    <div {...common} className={`grid min-h-9 items-center gap-2 rounded px-2 text-sm select-none ${base}`} style={{ ...drag.style, gridTemplateColumns: `minmax(0,2.2fr) ${cols.map(() => 'minmax(0,1fr)').join(' ')}` }}>
      <span className="flex min-w-0 items-center gap-2">
        <span className="pointer-events-none shrink-0">
          <NodeIcon node={node} size={22} />
        </span>
        {nameEl}
      </span>
      {cells.map((c, i) => (
        <span key={i} className="truncate text-xs text-gray-600">
          {c}
        </span>
      ))}
    </div>
  )
}

export function FileManager({ win, bin = false }: { win: WinState; bin?: boolean }) {
  const d = useDesktop()
  const { vfs, os } = d
  const mac = os === 'mac'
  const binName = mac ? 'Trash' : 'Recycle Bin'
  const [prefs, setPrefs] = useFmPrefs(vfs)

  const pathProp = typeof win.props?.path === 'string' ? win.props.path : undefined
  const startNode = () => {
    const n = pathProp ? vfs.resolve(pathProp) : null
    return n && n.kind === 'folder' ? n : vfs.home
  }
  const [stack, setStack] = useState<{ items: VNode[]; i: number }>(() => ({ items: [startNode()], i: 0 }))
  const [view, setView] = useState<View>(mac ? 'grid' : 'grid')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [sel, setSel] = useState<string[]>([])
  const anchor = useRef<string | null>(null)
  const [query, setQuery] = useState('')
  const [renaming, setRenamingState] = useState<Renaming | null>(null)
  const renRef = useRef<Renaming | null>(null)
  const [dlg, setDlg] = useState<Dlg | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [addrErr, setAddrErr] = useState('')
  const [, setTick] = useState(0)

  const rawCwd = stack.items[stack.i]
  const cwd = attached(rawCwd, vfs.root) ? rawCwd : vfs.home

  const setRenaming = (r: Renaming | null) => {
    renRef.current = r
    setRenamingState(r)
  }

  // ---------- navigation ----------
  const go = (node: VNode, push = true) => {
    if (node.kind !== 'folder') return
    if (bin) {
      d.openFolder(vfs.canonPath(node))
      return
    }
    if (push && node !== cwd) setStack((s) => ({ items: [...s.items.slice(0, s.i + 1), node], i: s.i + 1 }))
    setSel([])
    setQuery('')
    setRenaming(null)
    setEditing(null)
    setAddrErr('')
    d.emit({ type: 'navigate', path: vfs.canonPath(node) })
  }
  const back = () => {
    if (stack.i <= 0) return
    const n = stack.items[stack.i - 1]
    setStack({ ...stack, i: stack.i - 1 })
    setSel([])
    setQuery('')
    if (attached(n, vfs.root)) d.emit({ type: 'navigate', path: vfs.canonPath(n) })
  }
  const forward = () => {
    if (stack.i >= stack.items.length - 1) return
    const n = stack.items[stack.i + 1]
    setStack({ ...stack, i: stack.i + 1 })
    setSel([])
    setQuery('')
    if (attached(n, vfs.root)) d.emit({ type: 'navigate', path: vfs.canonPath(n) })
  }
  const up = () => {
    if (cwd.parent) go(cwd.parent)
  }

  const firstRun = useRef(true)
  const propN = win.props?._n
  useEffect(() => {
    if (bin) return
    if (firstRun.current) {
      firstRun.current = false
      d.emit({ type: 'navigate', path: vfs.canonPath(cwd) })
      return
    }
    if (pathProp) {
      const n = vfs.resolve(pathProp)
      if (n && n.kind === 'folder') go(n)
    }
    // re-navigate only when the window's props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathProp, propN])

  const title = bin ? binName : cwd === vfs.root ? (vfs.driveName ? `Local Disk (${vfs.driveName})` : 'Macintosh HD') : cwd.name
  useEffect(() => {
    d.wmDispatch({ type: 'setTitle', id: win.id, title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, win.id])

  // ---------- entries ----------
  const searching = !bin && query.trim() !== ''
  let entries: Entry[]
  if (bin) {
    entries = vfs.binItems().map((b) => ({ key: b.binId, binId: b.binId, node: b.node, location: b.node.parent ? vfs.displayPath(b.node.parent) : '', deletedAt: b.deletedAt }))
  } else if (searching) {
    entries = vfs.search(query, cwd).map((n) => ({ key: n.id, node: n, location: n.parent ? vfs.displayPath(n.parent) : '' }))
  } else {
    entries = vfs.list(cwd, { showHidden: prefs.showHidden }).map((n) => ({ key: n.id, node: n }))
  }
  entries = sortEntries(entries, sortKey, sortAsc)
  const entryKeys = entries.map((e) => e.key)
  const selEntries = entries.filter((e) => sel.includes(e.key))
  const selNodes = selEntries.map((e) => e.node)
  const effView: View = bin || searching ? 'list' : view
  const cols = bin ? ['location', 'modified'] : searching ? ['location', 'modified', 'size'] : ['modified', 'type', 'size']
  const colLabel: Record<string, string> = { location: bin ? 'Original location' : 'Location', modified: bin ? 'Date deleted' : os === 'windows' ? 'Date modified' : 'Date Modified', type: os === 'windows' ? 'Type' : 'Kind', size: 'Size' }
  const colSort: Record<string, SortKey | undefined> = { modified: 'modified', type: 'type', size: 'size' }

  // ---------- helpers ----------
  const fail = (e: unknown, after?: () => void, title?: string) => setDlg({ kind: 'error', title: title ?? (mac ? 'Finder' : 'File Explorer'), msg: errorMessageEn(e, os), after })

  const select = (e: RMouseEvent, entry: Entry) => {
    if (e.shiftKey && anchor.current && entryKeys.includes(anchor.current)) {
      const a = entryKeys.indexOf(anchor.current)
      const b = entryKeys.indexOf(entry.key)
      setSel(entryKeys.slice(Math.min(a, b), Math.max(a, b) + 1))
    } else if (e.ctrlKey || e.metaKey) {
      setSel((s) => (s.includes(entry.key) ? s.filter((k) => k !== entry.key) : [...s, entry.key]))
      anchor.current = entry.key
    } else {
      setSel([entry.key])
      anchor.current = entry.key
    }
  }

  const openEntry = (entry: Entry) => {
    if (bin) return
    if (entry.node.kind === 'folder') go(entry.node)
    else d.openFile(entry.node)
  }
  const openSelected = () => {
    selEntries.forEach(openEntry)
  }

  const initialRename = (n: VNode): Renaming => {
    const [base, ext] = splitExt(n.name)
    return n.kind === 'file' && !prefs.showExt && ext ? { key: n.id, draft: base, suffix: ext } : { key: n.id, draft: n.name, suffix: '' }
  }
  const startRename = (nodes: VNode[] = selNodes) => {
    if (bin || nodes.length !== 1) return
    setRenaming(initialRename(nodes[0]))
  }
  const commitRename = (apply: boolean) => {
    const r = renRef.current
    if (!r) return
    setRenaming(null)
    if (!apply) return
    const entry = entries.find((e) => e.key === r.key)
    if (!entry) return
    const next = r.draft.trim() === '' ? '' : r.draft + r.suffix
    if (next === entry.node.name) return
    try {
      vfs.rename(entry.node, next)
    } catch (e) {
      fail(e, () => setRenaming(r))
    }
  }

  const deleteNodes = (nodes: VNode[]) => {
    if (bin) return
    for (const n of nodes) {
      try {
        vfs.delete(n)
      } catch (e) {
        fail(e)
        break
      }
    }
    setSel([])
  }
  const copyNodes = (nodes: VNode[]) => nodes.length && d.setClipboard({ mode: 'copy', nodes })
  const cutNodes = (nodes: VNode[]) => nodes.length && d.setClipboard({ mode: 'cut', nodes })
  const paste = (forceMove = false) => {
    const cb = d.clipboard
    if (!cb || bin) return
    const moving = cb.mode === 'cut' || forceMove
    const made: string[] = []
    for (const n of cb.nodes) {
      try {
        made.push((moving ? vfs.move(n, cwd) : vfs.copy(n, cwd)).id)
      } catch (e) {
        fail(e)
        break
      }
    }
    if (moving) d.setClipboard(null)
    if (made.length) setSel(made)
  }
  const newItem = (kind: 'folder' | 'text') => {
    if (bin) return
    try {
      setQuery('')
      const n = kind === 'folder' ? vfs.mkdir(cwd) : vfs.createFile(cwd)
      setSel([n.id])
      anchor.current = n.id
      setRenaming(initialRename(n))
    } catch (e) {
      fail(e)
    }
  }
  const restoreNodes = (list: Entry[]) => {
    for (const en of list) {
      try {
        if (en.binId) vfs.restore(en.binId)
      } catch (e) {
        fail(e)
        break
      }
    }
    setSel([])
  }
  const emptyBin = () => {
    vfs.emptyBin()
    d.emit({ type: 'custom', event: 'bin-emptied' })
    setSel([])
    setDlg(null)
  }
  const dropInto = (dest: VNode, payload: unknown) => {
    const nodes = payloadIds(payload)
      .map((id) => findNode(vfs.root, id))
      .filter((n): n is VNode => !!n)
    for (const n of nodes) {
      try {
        // moving between two different drives (this PC <-> USB stick / phone) copies, like a real computer
        if (vfs.mountOf(n) !== vfs.mountOf(dest)) vfs.copy(n, dest)
        else vfs.move(n, dest)
      } catch (e) {
        fail(e)
        break
      }
    }
  }
  const dropIntoBin = (payload: unknown) => {
    const nodes = payloadIds(payload)
      .map((id) => findNode(vfs.root, id))
      .filter((n): n is VNode => !!n)
    deleteNodes(nodes)
  }
  const setExt = (on: boolean) => {
    setPrefs({ showExt: on })
    if (on) d.emit({ type: 'custom', event: 'extensions-shown' })
  }
  const setHidden = (on: boolean) => {
    setPrefs({ showHidden: on })
    if (on) d.emit({ type: 'custom', event: 'hidden-shown' })
  }
  const sortBy = (k: SortKey) => {
    if (k === sortKey) setSortAsc((a) => !a)
    else {
      setSortKey(k)
      setSortAsc(true)
    }
  }

  // ---------- menus ----------
  const sortItems = (): MenuItem[] => [
    { id: 'sort-name', label: 'Name', checked: sortKey === 'name', onSelect: () => (setSortKey('name'), setSortAsc(true)) },
    { id: 'sort-modified', label: os === 'windows' ? 'Date modified' : 'Date Modified', checked: sortKey === 'modified', onSelect: () => (setSortKey('modified'), setSortAsc(true)) },
    { id: 'sort-type', label: os === 'windows' ? 'Type' : 'Kind', checked: sortKey === 'type', onSelect: () => (setSortKey('type'), setSortAsc(true)) },
    { id: 'sort-size', label: 'Size', checked: sortKey === 'size', onSelect: () => (setSortKey('size'), setSortAsc(true)) },
    { separator: true },
    { id: 'sort-asc', label: 'Ascending', checked: sortAsc, onSelect: () => setSortAsc(true) },
    { id: 'sort-desc', label: 'Descending', checked: !sortAsc, onSelect: () => setSortAsc(false) },
  ]
  const viewItems = (): MenuItem[] =>
    mac
      ? [
          { id: 'view-icons', label: 'as Icons', checked: view === 'grid', onSelect: () => setView('grid') },
          { id: 'view-list', label: 'as List', checked: view === 'list', onSelect: () => setView('list') },
        ]
      : [
          { id: 'view-large', label: 'Large icons', checked: view === 'grid', onSelect: () => setView('grid') },
          { id: 'view-details', label: 'Details', checked: view === 'list', onSelect: () => setView('list') },
          { separator: true },
          {
            id: 'show',
            label: 'Show',
            submenu: [
              { id: 'show-ext', label: 'File name extensions', checked: prefs.showExt, onSelect: () => setExt(!prefs.showExt) },
              { id: 'show-hidden', label: 'Hidden items', checked: prefs.showHidden, onSelect: () => setHidden(!prefs.showHidden) },
            ],
          },
        ]
  const newItems = (): MenuItem[] => [
    { id: 'new-folder', label: 'Folder', onSelect: () => newItem('folder') },
    { id: 'new-text', label: 'Text Document', onSelect: () => newItem('text') },
  ]
  const optionItems = (): MenuItem[] => [
    { id: 'show-ext', label: 'Show All Filename Extensions', checked: prefs.showExt, onSelect: () => setExt(!prefs.showExt) },
    { id: 'show-hidden', label: 'Show Hidden Files', checked: prefs.showHidden, onSelect: () => setHidden(!prefs.showHidden) },
  ]
  const openBelow = (e: RMouseEvent<HTMLElement>, items: MenuItem[]) => {
    const r = e.currentTarget.getBoundingClientRect()
    d.openMenu({ clientX: r.left, clientY: r.bottom }, items)
  }

  const itemMenu = (e: RMouseEvent, entry: Entry) => {
    e.preventDefault()
    e.stopPropagation()
    const nodes = sel.includes(entry.key) ? selNodes : [entry.node]
    const ents = sel.includes(entry.key) ? selEntries : [entry]
    if (!sel.includes(entry.key)) setSel([entry.key])
    let items: MenuItem[]
    if (bin) {
      items = [
        { id: 'restore', label: mac ? 'Put Back' : 'Restore', onSelect: () => restoreNodes(ents) },
        { separator: true },
        { id: 'properties', label: mac ? 'Get Info' : 'Properties', onSelect: () => setDlg({ kind: 'props', node: entry.node }) },
      ]
    } else if (mac) {
      items = [
        { id: 'open', label: 'Open', shortcut: '⌘O', onSelect: () => ents.forEach(openEntry) },
        { separator: true },
        { id: 'delete', label: 'Move to Trash', shortcut: '⌘⌫', onSelect: () => deleteNodes(nodes) },
        { separator: true },
        { id: 'properties', label: 'Get Info', shortcut: '⌘I', onSelect: () => setDlg({ kind: 'props', node: entry.node }) },
        { id: 'rename', label: 'Rename', disabled: nodes.length !== 1, onSelect: () => startRename(nodes) },
        { separator: true },
        { id: 'copy', label: nodes.length > 1 ? `Copy ${nodes.length} Items` : `Copy “${entry.node.name}”`, shortcut: '⌘C', onSelect: () => copyNodes(nodes) },
      ]
    } else {
      items = [
        { id: 'open', label: 'Open', shortcut: 'Enter', onSelect: () => ents.forEach(openEntry) },
        { separator: true },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', onSelect: () => cutNodes(nodes) },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onSelect: () => copyNodes(nodes) },
        { separator: true },
        { id: 'rename', label: 'Rename', shortcut: 'F2', disabled: nodes.length !== 1, onSelect: () => startRename(nodes) },
        { id: 'delete', label: 'Delete', shortcut: 'Del', onSelect: () => deleteNodes(nodes) },
        { separator: true },
        { id: 'properties', label: 'Properties', shortcut: 'Alt+Enter', onSelect: () => setDlg({ kind: 'props', node: entry.node }) },
      ]
    }
    d.openMenu(e, items)
  }

  const bgMenu = (e: RMouseEvent) => {
    e.preventDefault()
    setSel([])
    let items: MenuItem[]
    if (bin) {
      items = [
        { id: 'empty-bin', label: mac ? 'Empty Trash' : 'Empty Recycle Bin', disabled: vfs.binItems().length === 0, onSelect: () => setDlg({ kind: 'empty' }) },
        { id: 'refresh', label: 'Refresh', onSelect: () => setTick((t) => t + 1) },
      ]
    } else if (mac) {
      items = [
        { id: 'new-folder', label: 'New Folder', shortcut: '⇧⌘N', onSelect: () => newItem('folder') },
        { separator: true },
        { id: 'properties', label: 'Get Info', onSelect: () => setDlg({ kind: 'props', node: cwd }) },
        { id: 'view', label: 'View', submenu: viewItems() },
        { id: 'sort', label: 'Sort By', submenu: sortItems() },
        { separator: true },
        { id: 'paste', label: 'Paste Item', shortcut: '⌘V', disabled: !d.clipboard, onSelect: () => paste() },
      ]
    } else {
      items = [
        { id: 'view', label: 'View', submenu: viewItems() },
        { id: 'sort', label: 'Sort by', submenu: sortItems() },
        { id: 'refresh', label: 'Refresh', onSelect: () => setTick((t) => t + 1) },
        { separator: true },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', disabled: !d.clipboard, onSelect: () => paste() },
        { separator: true },
        { id: 'new', label: 'New', submenu: newItems() },
        { separator: true },
        { id: 'properties', label: 'Properties', onSelect: () => setDlg({ kind: 'props', node: cwd }) },
      ]
    }
    d.openMenu(e, items)
  }

  // ---------- keyboard ----------
  useWindowCombos(win.id, (c) => {
    if (dlg || isTypingTarget(document.activeElement)) return false
    const ctrl = mac ? 'cmd' : 'ctrl'
    const moveSel = (dir: 1 | -1) => {
      if (!entryKeys.length) return true
      const last = sel.length ? entryKeys.indexOf(sel[sel.length - 1]) : dir === 1 ? -1 : entryKeys.length
      const next = entryKeys[Math.max(0, Math.min(entryKeys.length - 1, last + dir))]
      setSel([next])
      anchor.current = next
      return true
    }
    switch (c) {
      case `${ctrl}+a`:
        setSel(entryKeys)
        return true
      case `${ctrl}+c`:
        return copyNodes(selNodes), true
      case 'ctrl+x':
        if (mac) return false
        return cutNodes(selNodes), true
      case `${ctrl}+v`:
        return paste(), true
      case 'alt+cmd+v':
        if (!mac) return false
        return paste(true), true
      case 'delete':
        if (mac) return false
        return deleteNodes(selNodes), true
      case 'cmd+backspace':
        if (!mac) return false
        return deleteNodes(selNodes), true
      case 'f2':
        if (mac) return false
        return startRename(), true
      case 'enter':
        if (mac) return startRename(), true
        return openSelected(), true
      case 'cmd+o':
      case 'cmd+down':
        if (!mac) return false
        return openSelected(), true
      case 'alt+up':
        if (mac || bin) return false
        return up(), true
      case 'cmd+up':
        if (!mac || bin) return false
        return up(), true
      case 'backspace':
        if (mac) return false
        return back(), true
      case 'alt+left':
      case 'cmd+[':
        return back(), true
      case 'alt+right':
      case 'cmd+]':
        return forward(), true
      case 'ctrl+l':
        if (mac || bin) return false
        return setEditing(vfs.displayPath(cwd)), true
      case 'shift+cmd+g':
        if (!mac || bin) return false
        return setDlg({ kind: 'goto', text: vfs.displayPath(cwd) }), true
      case 'f5':
        return setTick((t) => t + 1), true
      case 'alt+enter':
      case 'cmd+i':
        if (selNodes.length === 1) return setDlg({ kind: 'props', node: selNodes[0] }), true
        return false
      case 'up':
      case 'left':
        return moveSel(-1)
      case 'down':
      case 'right':
        return moveSel(1)
      case 'esc':
        if (query) return setQuery(''), true
        if (sel.length) return setSel([]), true
        return false
      default:
        return false
    }
  })

  // ---------- address bar ----------
  const submitAddress = (text: string) => {
    const t = text.trim()
    const n = t ? vfs.resolve(t) : null
    if (n && n.kind === 'folder') {
      go(n)
      return true
    }
    setAddrErr(mac ? `The folder “${t}” can’t be found.` : `Windows can't find '${t}'. Check the spelling and try again.`)
    return false
  }

  const chain: VNode[] = []
  for (let n: VNode | null = cwd; n; n = n.parent) chain.unshift(n)
  const crumbName = (n: VNode) => (n === vfs.root && mac ? 'Macintosh HD' : n.name)

  const address = mac ? null : (
    <div data-coach="fm-address" className="flex min-h-9 min-w-0 flex-1 items-center rounded border border-gray-300 bg-white px-1 text-sm">
      {editing !== null ? (
        <input
          autoFocus
          aria-label="Address"
          data-coach="fm-address-input"
          value={editing}
          onChange={(e) => (setEditing(e.target.value), setAddrErr(''))}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={() => setEditing(null)}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === 'Enter') submitAddress(editing)
            else if (e.key === 'Escape') {
              setEditing(null)
              setAddrErr('')
            }
          }}
          className="min-h-8 w-full bg-transparent px-1 outline-none"
        />
      ) : bin ? (
        <span className="px-2">{binName}</span>
      ) : (
        <>
          <div className="flex min-w-0 items-center overflow-hidden">
            {chain.map((n, i) => (
              <span key={n.id} className="flex shrink-0 items-center">
                {i > 0 && <span className="px-0.5 text-gray-400">›</span>}
                <button type="button" data-coach={`fm-crumb-${crumbName(n)}`} onClick={() => go(n)} className="min-h-8 rounded px-1.5 hover:bg-black/8">
                  {crumbName(n)}
                </button>
              </span>
            ))}
          </div>
          <div className="min-h-8 flex-1 cursor-text" aria-hidden="true" onClick={() => setEditing(vfs.displayPath(cwd))} />
        </>
      )}
    </div>
  )

  // ---------- sidebar ----------
  const home = vfs.home
  const placeDefs: { name: string; node: VNode | undefined }[] = mac
    ? [
        { name: 'Applications', node: vfs.child(vfs.root, 'Applications') },
        ...['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Movies'].map((n) => ({ name: n, node: vfs.child(home, n) })),
      ]
    : [
        { name: 'Home', node: home },
        ...['Desktop', 'Downloads', 'Documents', 'Pictures', 'Music', 'Videos'].map((n) => ({ name: n, node: vfs.child(home, n) })),
        { name: 'This PC', node: vfs.root },
      ]
  const sideBtn = (name: string, active: boolean, onClick: () => void, icon: ReactNode, dropProps?: object) => (
    <button
      key={name}
      type="button"
      data-coach={`fm-sidebar-${name}`}
      {...dropProps}
      onClick={onClick}
      className={`flex min-h-9 w-full items-center gap-2 rounded px-2 text-left text-sm ${active ? (mac ? 'bg-black/10 font-medium' : 'bg-sky-100') : 'hover:bg-black/5'} data-[drop-over=true]:bg-sky-200`}
    >
      {icon}
      <span className="truncate">{name}</span>
    </button>
  )
  const driveBtns = vfs.mounts.map((m) => {
    const canEject = m.mount?.kind === 'usb'
    const eject = () => getDevices(d).ejectUsb()
    const btn = sideBtn(
      m.name,
      !bin && (cwd === m || vfs.isDescendant(cwd, m)),
      () => go(m),
      m.mount?.kind === 'phone' ? <FolderIcon size={18} /> : <UsbIcon size={18} />,
      {
        ...dropZoneProps(
          (pl) => dropInto(m, pl),
          (pl) => payloadIds(pl).length > 0,
        ),
        onContextMenu: (e: RMouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          d.openMenu(e, [
            { id: 'open', label: 'Open', onSelect: () => go(m) },
            ...(canEject ? [{ id: 'eject', label: mac ? `Eject “${m.name}”` : 'Eject', onSelect: eject }] : []),
          ])
        },
      },
    )
    return mac && canEject ? (
      <div key={m.id} className="flex items-center">
        <div className="min-w-0 flex-1">{btn}</div>
        <button type="button" data-coach={`fm-eject-${m.name}`} aria-label={`Eject ${m.name}`} title="Eject" className="flex min-h-9 min-w-9 items-center justify-center rounded hover:bg-black/10" onClick={eject}>
          ⏏
        </button>
      </div>
    ) : (
      btn
    )
  })
  const sidebar = (
    <nav aria-label="Navigation" className={`w-44 shrink-0 overflow-y-auto border-r border-gray-200 p-2 ${mac ? 'bg-[#f1f1f1]' : 'bg-[#f9f9f9]'}`}>
      {mac && <div className="px-2 pt-1 pb-1 text-xs font-semibold text-gray-500">Favorites</div>}
      {placeDefs
        .filter((p) => p.node)
        .map((p) =>
          sideBtn(
            p.name,
            !bin && cwd === p.node,
            () => go(p.node!),
            <FolderIcon size={18} />,
            dropZoneProps(
              (pl) => dropInto(p.node!, pl),
              (pl) => payloadIds(pl).length > 0 && !payloadIds(pl).includes(p.node!.id),
            ),
          ),
        )}
      {driveBtns.length > 0 && mac && <div className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-500">Locations</div>}
      {driveBtns}
      {sideBtn(
        binName,
        bin,
        () => d.openApp('bin'),
        <RecycleBinIcon size={18} full={vfs.binItems().length > 0} />,
        dropZoneProps(dropIntoBin, (pl) => payloadIds(pl).length > 0),
      )}
    </nav>
  )

  // ---------- toolbars ----------
  const canPaste = !!d.clipboard && !bin
  const hasSel = selNodes.length > 0
  const navBtns = (
    <>
      <ToolBtn label="Back" coach="fm-back" onClick={back} disabled={stack.i <= 0 || bin} wide>
        <BackGlyph size={16} />
      </ToolBtn>
      <ToolBtn label="Forward" coach="fm-forward" onClick={forward} disabled={stack.i >= stack.items.length - 1 || bin} wide>
        <ForwardGlyph size={16} />
      </ToolBtn>
      <ToolBtn label="Up" coach="fm-up" onClick={up} disabled={!cwd.parent || bin} wide>
        <UpGlyph size={16} />
      </ToolBtn>
    </>
  )
  const searchBox = (
    <label className={`flex min-h-9 items-center gap-1.5 rounded border border-gray-300 bg-white px-2 text-sm ${mac ? 'w-44' : 'w-52'}`}>
      <SearchGlyph size={14} />
      <input
        data-coach="fm-search"
        aria-label="Search"
        placeholder={mac ? 'Search' : `Search ${title}`}
        value={query}
        disabled={bin}
        onChange={(e) => (setQuery(e.target.value), setSel([]))}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === 'Escape') setQuery('')
        }}
        className="min-h-8 w-full min-w-0 bg-transparent outline-none"
      />
    </label>
  )

  const topWin = (
    <div className="shrink-0 border-b border-gray-200 bg-[#f3f3f3]">
      <div className="flex items-center gap-1 px-2 pt-1.5">
        {navBtns}
        <ToolBtn label="Refresh" coach="fm-refresh" onClick={() => setTick((t) => t + 1)} wide>
          <RefreshGlyph size={16} />
        </ToolBtn>
        {address}
        {searchBox}
      </div>
      {addrErr && (
        <div role="alert" data-coach="fm-address-error" className="px-3 pt-1 text-xs text-red-600">
          {addrErr}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1">
        {bin ? (
          <>
            <ToolBtn label="Empty Recycle Bin" coach="fm-empty-bin" disabled={vfs.binItems().length === 0} onClick={() => setDlg({ kind: 'empty' })}>
              Empty Recycle Bin
            </ToolBtn>
            <ToolBtn label="Restore the selected items" coach="fm-restore" disabled={!hasSel} onClick={() => restoreNodes(selEntries)}>
              Restore the selected items
            </ToolBtn>
          </>
        ) : (
          <>
            <ToolBtn label="New" coach="fm-new" onClick={(e) => openBelow(e, newItems())}>
              <PlusGlyph size={14} /> New ▾
            </ToolBtn>
            <span className="mx-1 h-5 w-px bg-gray-300" />
            <ToolBtn label="Cut" coach="fm-cut" disabled={!hasSel} onClick={() => cutNodes(selNodes)}>
              Cut
            </ToolBtn>
            <ToolBtn label="Copy" coach="fm-copy" disabled={!hasSel} onClick={() => copyNodes(selNodes)}>
              Copy
            </ToolBtn>
            <ToolBtn label="Paste" coach="fm-paste" disabled={!canPaste} onClick={() => paste()}>
              Paste
            </ToolBtn>
            <ToolBtn label="Rename" coach="fm-rename" disabled={selNodes.length !== 1} onClick={() => startRename()}>
              Rename
            </ToolBtn>
            <ToolBtn label="Delete" coach="fm-delete" disabled={!hasSel} onClick={() => deleteNodes(selNodes)}>
              Delete
            </ToolBtn>
            <span className="mx-1 h-5 w-px bg-gray-300" />
            <ToolBtn label="Sort" coach="fm-sort" onClick={(e) => openBelow(e, sortItems())}>
              Sort ▾
            </ToolBtn>
            <ToolBtn label="View" coach="fm-view" onClick={(e) => openBelow(e, viewItems())}>
              View ▾
            </ToolBtn>
          </>
        )}
      </div>
    </div>
  )

  const topMac = (
    <div className="flex shrink-0 items-center gap-1 border-b border-gray-200 bg-[#ececec] px-2 py-1">
      {navBtns}
      <div className="min-w-0 flex-1 truncate px-2 text-sm font-semibold" data-coach="fm-title">
        {title}
      </div>
      {bin ? (
        <>
          <ToolBtn label="Put Back" coach="fm-restore" disabled={!hasSel} onClick={() => restoreNodes(selEntries)}>
            Put Back
          </ToolBtn>
          <ToolBtn label="Empty Trash" coach="fm-empty-bin" disabled={vfs.binItems().length === 0} onClick={() => setDlg({ kind: 'empty' })}>
            Empty
          </ToolBtn>
        </>
      ) : (
        <>
          <ToolBtn label={view === 'grid' ? 'Switch to list view' : 'Switch to icon view'} coach="fm-view" onClick={() => setView(view === 'grid' ? 'list' : 'grid')} wide>
            {view === 'grid' ? '▦' : '☰'}
          </ToolBtn>
          <ToolBtn label="View options" coach="fm-view-options" onClick={(e) => openBelow(e, optionItems())} wide>
            ⚙ ▾
          </ToolBtn>
          <ToolBtn label="New Folder" coach="fm-new-folder" onClick={() => newItem('folder')}>
            <PlusGlyph size={14} /> New Folder
          </ToolBtn>
          <ToolBtn label="Move to Trash" coach="fm-delete" disabled={!hasSel} onClick={() => deleteNodes(selNodes)} wide>
            🗑
          </ToolBtn>
          <ToolBtn
            label="Action"
            coach="fm-action"
            onClick={(e) =>
              openBelow(e, [
                { id: 'properties', label: 'Get Info', disabled: selNodes.length !== 1, onSelect: () => setDlg({ kind: 'props', node: selNodes[0] }) },
                { id: 'rename', label: 'Rename', disabled: selNodes.length !== 1, onSelect: () => startRename() },
                { id: 'copy', label: 'Copy', disabled: !hasSel, onSelect: () => copyNodes(selNodes) },
                { id: 'paste', label: 'Paste Item', disabled: !canPaste, onSelect: () => paste() },
              ])
            }
            wide
          >
            ⋯
          </ToolBtn>
          {searchBox}
        </>
      )}
    </div>
  )

  // ---------- content ----------
  const emptyText = bin ? `${binName} is empty` : searching ? 'No items match your search.' : mac ? '' : 'This folder is empty.'
  const content = (
    <div
      data-coach="fm-content"
      role="listbox"
      aria-multiselectable="true"
      aria-label="Files"
      className="min-h-0 flex-1 overflow-auto bg-white p-1"
      onPointerDown={(e) => {
        if (!(e.target as HTMLElement).closest('[data-fm-item],input,button')) {
          setSel([])
          commitRename(true)
        }
      }}
      onContextMenu={bgMenu}
    >
      {effView === 'list' && entries.length > 0 && (
        <div className="grid items-center gap-2 border-b border-gray-200 px-2 pb-1 text-xs text-gray-500" style={{ gridTemplateColumns: `minmax(0,2.2fr) ${cols.map(() => 'minmax(0,1fr)').join(' ')}`, paddingLeft: 40 }}>
          <button type="button" className="min-h-7 text-left hover:text-gray-900" onClick={() => sortBy('name')}>
            Name {sortKey === 'name' ? (sortAsc ? '▴' : '▾') : ''}
          </button>
          {cols.map((c) => (
            <button key={c} type="button" className="min-h-7 text-left hover:text-gray-900" onClick={() => colSort[c] && sortBy(colSort[c]!)}>
              {colLabel[c]} {colSort[c] && sortKey === colSort[c] ? (sortAsc ? '▴' : '▾') : ''}
            </button>
          ))}
        </div>
      )}
      <div className={effView === 'grid' ? 'flex flex-wrap content-start gap-1 p-1' : 'flex flex-col gap-0.5 pt-1'}>
        {entries.map((en) => (
          <FmItem
            key={en.key}
            entry={en}
            view={effView}
            cols={cols}
            mac={mac}
            os={os}
            showExt={prefs.showExt}
            selected={sel.includes(en.key)}
            renaming={renaming}
            setRenaming={setRenaming}
            commitRename={commitRename}
            dragIds={() => {
              const ids = sel.includes(en.key) ? selNodes.map((n) => n.id) : [en.node.id]
              return ids
            }}
            bin={bin}
            onSelect={select}
            onOpen={openEntry}
            onContext={itemMenu}
            onDropInto={dropInto}
            emitDrag={(i) => d.emit({ type: 'drag', ...i })}
            onDragStartSelect={(entry) => !sel.includes(entry.key) && setSel([entry.key])}
          />
        ))}
      </div>
      {entries.length === 0 && emptyText && <div className="p-6 text-center text-sm text-gray-500">{emptyText}</div>}
    </div>
  )

  const status = (
    <div data-coach="fm-status" className="flex min-h-7 shrink-0 items-center gap-4 border-t border-gray-200 bg-[#f9f9f9] px-3 text-xs text-gray-600">
      <span>
        {entries.length} item{entries.length === 1 ? '' : 's'}
      </span>
      {selNodes.length > 0 && (
        <span>
          {selNodes.length} item{selNodes.length === 1 ? '' : 's'} selected
          {selNodes.length === 1 && selNodes[0].kind === 'file' ? `  ${fmtSize(nodeBytes(selNodes[0]), os)}` : ''}
        </span>
      )}
    </div>
  )

  const pathBar = mac && !bin && (
    <div data-coach="fm-address" className="flex min-h-8 shrink-0 items-center gap-0.5 overflow-x-auto border-t border-gray-200 bg-[#f6f6f6] px-2 text-xs">
      {chain.map((n, i) => (
        <span key={n.id} className="flex shrink-0 items-center">
          {i > 0 && <span className="px-1 text-gray-400">›</span>}
          <button type="button" data-coach={`fm-crumb-${crumbName(n)}`} onClick={() => go(n)} className="flex min-h-7 items-center gap-1 rounded px-1 hover:bg-black/8">
            <FolderIcon size={14} />
            {crumbName(n)}
          </button>
        </span>
      ))}
    </div>
  )

  // ---------- dialogs ----------
  const props = dlg?.kind === 'props' ? dlg.node : null
  const dialog = !dlg ? null : dlg.kind === 'error' ? (
    <SimDialog
      title={dlg.title}
      onClose={() => (setDlg(null), dlg.after?.())}
      buttons={[{ label: 'OK', primary: true, id: 'dialog-ok', onClick: () => (setDlg(null), dlg.after?.()) }]}
    >
      <p data-coach="dialog-message">{dlg.msg}</p>
    </SimDialog>
  ) : dlg.kind === 'empty' ? (
    <SimDialog
      title={mac ? 'Empty Trash' : 'Delete Multiple Items'}
      onClose={() => setDlg(null)}
      buttons={[
        { label: mac ? 'Cancel' : 'No', id: 'dialog-no', onClick: () => setDlg(null) },
        { label: mac ? 'Empty Trash' : 'Yes', id: 'dialog-yes', primary: true, onClick: emptyBin },
      ]}
    >
      {mac
        ? 'Are you sure you want to permanently erase the items in the Trash? You can’t undo this action.'
        : `Are you sure you want to permanently delete ${vfs.binItems().length === 1 ? 'this item' : `these ${vfs.binItems().length} items`}?`}
    </SimDialog>
  ) : dlg.kind === 'goto' ? (
    <SimDialog
      title="Go to Folder"
      onClose={() => setDlg(null)}
      buttons={[
        { label: 'Cancel', id: 'dialog-cancel', onClick: () => setDlg(null) },
        {
          label: 'Go',
          id: 'dialog-go',
          primary: true,
          onClick: () => {
            const n = vfs.resolve(dlg.text)
            if (n && n.kind === 'folder') {
              setDlg(null)
              go(n)
            } else setDlg({ ...dlg, err: 'The folder can’t be found.' })
          },
        },
      ]}
    >
      <input
        aria-label="Go to the folder"
        data-coach="goto-input"
        value={dlg.text}
        onChange={(e) => setDlg({ ...dlg, text: e.target.value, err: undefined })}
        onKeyDown={(e) => e.stopPropagation()}
        className="min-h-9 w-full rounded border border-gray-300 px-2"
      />
      {dlg.err && <p className="mt-1 text-xs text-red-600">{dlg.err}</p>}
    </SimDialog>
  ) : props ? (
    <SimDialog title={mac ? `${props.name} Info` : `${props.name || vfs.driveName} Properties`} onClose={() => setDlg(null)} buttons={[{ label: mac ? 'Close' : 'OK', primary: true, id: 'dialog-ok', onClick: () => setDlg(null) }]}>
      <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1.5 text-left text-sm" data-coach="properties">
        <dt className="text-gray-500">Name</dt>
        <dd className="break-words">{props.name || 'Macintosh HD'}</dd>
        <dt className="text-gray-500">{mac ? 'Kind' : 'Type'}</dt>
        <dd>{kindLabel(props, os)}</dd>
        <dt className="text-gray-500">{mac ? 'Where' : 'Location'}</dt>
        <dd className="break-all">{props.parent ? vfs.displayPath(props.parent) : vfs.displayPath(props)}</dd>
        <dt className="text-gray-500">Size</dt>
        <dd>{props.kind === 'file' ? `${fmtSize(nodeBytes(props), os)} (${nodeBytes(props)} bytes)` : `${props.children.length} item${props.children.length === 1 ? '' : 's'}`}</dd>
        <dt className="text-gray-500">{mac ? 'Created' : 'Created'}</dt>
        <dd>{fmtDate(props.createdAt, os)}</dd>
        <dt className="text-gray-500">Modified</dt>
        <dd>{fmtDate(props.modifiedAt, os)}</dd>
      </dl>
    </SimDialog>
  ) : null

  return (
    <div className="relative flex h-full flex-col text-sm text-gray-900">
      {mac ? topMac : topWin}
      <div className="flex min-h-0 flex-1">
        {sidebar}
        {content}
      </div>
      {pathBar}
      {status}
      {dialog}
    </div>
  )
}

export const FilesApp = ({ win }: { win: WinState }) => <FileManager win={win} />
export const BinApp = ({ win }: { win: WinState }) => <FileManager win={win} bin />
