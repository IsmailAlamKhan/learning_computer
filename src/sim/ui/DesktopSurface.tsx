/**
 * The desktop background layer: wallpaper hit-area + draggable icons for the Desktop folder
 * (+ OS "special" icons like the Recycle Bin). Shared by both shells.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useDesktop, type MenuItem } from '../DesktopContext'
import { NodeIcon } from './icons'
import { dropZoneProps, useDrag, type DropInfo } from '../dnd'
import { errorMessageEn, type VNode } from '../vfs'

export const CELL_W = 92
export const CELL_H = 100

export interface SpecialIcon {
  /** coach target becomes `icon-<id>` */
  id: string
  label: string
  icon: ReactNode
  onOpen: () => void
  /** if set, dropping a file/folder icon on it calls this (Recycle Bin) */
  onDropNode?: (n: VNode) => void
}

interface Item {
  id: string
  label: string
  node?: VNode
  special?: SpecialIcon
}

interface Props {
  specials: SpecialIcon[]
  /** icons flow down the left edge (Windows) or from the top-right edge (Mac) */
  fromRight?: boolean
  inset?: { top?: number; bottom?: number }
  /** called for background clicks (e.g. to close the Start menu) */
  onBackgroundPointerDown?: () => void
}

type Payload = { kind: 'node'; id: string } | { kind: 'special'; id: string }

function DesktopItem({ item, x, y, selected, renaming, onStartRename, onFinishRename }: { item: Item; x: number; y: number; selected: boolean; renaming: boolean; onStartRename: () => void; onFinishRename: (name: string | null) => void }) {
  const d = useDesktop()
  const { setSelection, openFile } = d
  const mac = d.os === 'mac'
  const [draft, setDraft] = useState(item.label)
  const inputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => {
    if (renaming) {
      setDraft(item.label)
      const el = inputRef.current
      el?.focus()
      const dot = item.node?.kind === 'file' ? item.label.lastIndexOf('.') : -1
      el?.setSelectionRange(0, dot > 0 ? dot : item.label.length)
    }
  }, [renaming, item.label, item.node?.kind])

  const drag = useDrag({
    payload: { kind: item.node ? 'node' : 'special', id: item.id } satisfies Payload,
    ghost: null,
    disabled: renaming || !!item.special,
    onDragEvent: (i) => d.emit({ type: 'drag', ...i }),
    onStart: () => setSelection(item.id),
  })

  const dropProps = item.node?.kind === 'folder'
    ? dropZoneProps((p) => {
        const pl = p as Payload
        if (pl.kind !== 'node') return
        const src = findNode(d.vfs.root, pl.id)
        if (src && src !== item.node) {
          try {
            d.vfs.move(src, item.node!)
          } catch (e) {
            d.toast(errorMessageEn(e, d.os))
          }
        }
      }, (p) => (p as Payload).kind === 'node' && (p as Payload).id !== item.id)
    : item.special?.onDropNode
      ? dropZoneProps((p) => {
          const pl = p as Payload
          const src = pl.kind === 'node' ? findNode(d.vfs.root, pl.id) : null
          if (src) item.special!.onDropNode!(src)
        })
      : {}

  const commit = () => {
    const v = draft.trim()
    onFinishRename(v && v !== item.label ? v : null)
  }

  return (
    <div
      {...dropProps}
      {...drag}
      data-coach={`icon-${item.label}`}
      role="button"
      tabIndex={0}
      aria-label={item.label}
      aria-pressed={selected}
      className={`absolute flex flex-col items-center gap-1 rounded-md p-1 text-center outline-none ${selected ? (mac ? 'bg-white/30' : 'bg-white/25 ring-1 ring-white/60') : 'hover:bg-white/15'} data-[drop-over=true]:bg-sky-300/50`}
      style={{ left: x, top: y, width: CELL_W - 8, height: CELL_H - 4, touchAction: 'none' }}
      onPointerDown={(e) => {
        e.stopPropagation()
        d.wmDispatch({ type: 'focusDesktop' })
        d.closeMenu()
        d.setUi({ startOpen: false, openMenu: null })
        setSelection(item.id)
        drag.onPointerDown?.(e)
      }}
      onDoubleClick={() => (item.special ? item.special.onOpen() : item.node && openFile(item.node))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !renaming) {
          if (mac) onStartRename()
          else item.special ? item.special.onOpen() : item.node && openFile(item.node)
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setSelection(item.id)
        d.wmDispatch({ type: 'focusDesktop' })
        const menu: MenuItem[] = item.special
          ? [{ id: 'open', label: 'Open', onSelect: item.special.onOpen }]
          : [
              { id: 'open', label: 'Open', onSelect: () => item.node && openFile(item.node) },
              { separator: true },
              { id: 'copy', label: 'Copy', shortcut: mac ? '⌘C' : 'Ctrl+C', onSelect: () => item.node && d.setClipboard({ mode: 'copy', nodes: [item.node] }) },
              { id: 'cut', label: mac ? 'Cut' : 'Cut', shortcut: mac ? '' : 'Ctrl+X', disabled: mac, onSelect: () => item.node && d.setClipboard({ mode: 'cut', nodes: [item.node] }) },
              { separator: true },
              { id: 'rename', label: 'Rename', shortcut: mac ? '' : 'F2', onSelect: onStartRename },
              { id: 'delete', label: mac ? 'Move to Trash' : 'Delete', onSelect: () => item.node && tryDelete(d, item.node) },
            ]
        d.openMenu(e, menu)
      }}
    >
      <span className="pointer-events-none drop-shadow">{item.special ? item.special.icon : item.node && <NodeIcon node={item.node} size={44} />}</span>
      {renaming ? (
        <input
          ref={inputRef}
          data-coach="rename-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') onFinishRename(null)
          }}
          className="w-full rounded border border-blue-500 bg-white px-1 text-center text-xs text-gray-900"
        />
      ) : (
        <span className={`pointer-events-none line-clamp-2 w-full text-xs leading-tight break-words text-white [text-shadow:0_1px_3px_rgba(0,0,0,.9)] ${selected && mac ? 'rounded bg-blue-500 px-1' : ''}`}>{item.label}</span>
      )}
    </div>
  )
}

function findNode(root: VNode, id: string): VNode | null {
  if (root.id === id) return root
  for (const c of root.children) {
    const f = findNode(c, id)
    if (f) return f
  }
  return null
}

function tryDelete(d: ReturnType<typeof useDesktop>, node: VNode) {
  try {
    d.vfs.delete(node)
  } catch (e) {
    d.toast(errorMessageEn(e, d.os))
  }
}

export function DesktopSurface({ specials, fromRight, inset, onBackgroundPointerDown }: Props) {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 900, h: 560 })
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const desktopFolder = d.vfs.child(d.vfs.home, 'Desktop')!

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  const items: Item[] = [
    ...specials.map((s) => ({ id: `special:${s.id}`, label: s.label, special: s })),
    ...d.vfs.list(desktopFolder).map((n) => ({ id: n.id, label: n.name, node: n })),
  ]

  const rows = Math.max(1, Math.floor((size.h - (inset?.top ?? 0) - (inset?.bottom ?? 0) - 8) / CELL_H))
  const originY = (inset?.top ?? 0) + 8

  // assign cells to items that have none yet (stable afterwards)
  useEffect(() => {
    const taken = new Set(items.map((i) => d.iconPos[i.id]).filter(Boolean).map((p) => `${p.col},${p.row}`))
    for (const it of items) {
      if (d.iconPos[it.id]) continue
      let c = 0
      let r = 0
      while (taken.has(`${c},${r}`)) {
        r++
        if (r >= rows) {
          r = 0
          c++
        }
      }
      taken.add(`${c},${r}`)
      d.setIconPos(it.id, { col: c, row: r })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join('|'), rows])

  // snap + resolve collisions for dragged icons (positions arrive unsnapped from DesktopItem as absolute col/row from the left)
  useEffect(() => {
    const occupied = new Map<string, string>()
    for (const it of items) {
      const p = d.iconPos[it.id]
      if (!p) continue
      const key = `${p.col},${p.row}`
      if (occupied.has(key)) {
        // collision: move this item to the nearest free cell
        let c = Math.max(0, p.col)
        let r = Math.max(0, p.row)
        while (occupied.has(`${c},${r}`)) {
          r++
          if (r >= rows) {
            r = 0
            c++
          }
        }
        occupied.set(`${c},${r}`, it.id)
        d.setIconPos(it.id, { col: c, row: r })
      } else occupied.set(key, it.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(d.iconPos)])

  const place = (id: string) => {
    const p = d.iconPos[id]
    if (!p) return null
    const col = Math.max(0, p.col)
    const row = Math.min(Math.max(0, p.row), rows - 1)
    // stored cols are counted from the left; mirror for Mac so icons hug the right edge by default
    const x = fromRight ? size.w - (col + 1) * CELL_W + 4 : col * CELL_W + 4
    return { x, y: originY + row * CELL_H }
  }

  const dropRef = dropZoneProps(() => {}).ref
  const reposition = (payload: unknown, _src: HTMLElement | null, info: DropInfo) => {
    const pl = payload as Payload
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || pl.kind !== 'node') return
    const x = info.clientX - rect.left - info.offsetX
    const y = info.clientY - rect.top - info.offsetY
    const col = fromRight ? Math.round((size.w - x + 4) / CELL_W) - 1 : Math.round((x - 4) / CELL_W)
    const row = Math.min(rows - 1, Math.max(0, Math.round((y - originY) / CELL_H)))
    d.setIconPos(pl.id, { col: Math.max(0, col), row })
  }

  const rename = (it: Item, name: string | null) => {
    setRenamingId(null)
    if (!name || !it.node) return
    try {
      d.vfs.rename(it.node, name)
    } catch (e) {
      d.toast(errorMessageEn(e, d.os))
    }
  }

  const bgMenu = (): MenuItem[] => {
    const newFolder = () => {
      try {
        const n = d.vfs.mkdir(desktopFolder)
        setRenamingId(n.id)
        d.setSelection(n.id)
      } catch (e) {
        d.toast(errorMessageEn(e, d.os))
      }
    }
    const newText = () => {
      try {
        const n = d.vfs.createFile(desktopFolder)
        setRenamingId(n.id)
        d.setSelection(n.id)
      } catch (e) {
        d.toast(errorMessageEn(e, d.os))
      }
    }
    const paste = () => {
      const cb = d.clipboard
      if (!cb) return
      for (const n of cb.nodes) {
        try {
          if (cb.mode === 'cut') d.vfs.move(n, desktopFolder)
          else d.vfs.copy(n, desktopFolder)
        } catch (e) {
          d.toast(errorMessageEn(e, d.os))
        }
      }
      if (cb.mode === 'cut') d.setClipboard(null)
    }
    return mac
      ? [
          { id: 'new-folder', label: 'New Folder', onSelect: newFolder },
          { separator: true },
          { id: 'get-info', label: 'Get Info', disabled: true },
          { id: 'change-wallpaper', label: 'Change Desktop Background…', onSelect: () => d.openApp('settings') },
          { separator: true },
          { id: 'paste', label: 'Paste Item', disabled: !d.clipboard, onSelect: paste },
          { id: 'sort', label: 'Sort By', submenu: [{ label: 'Name', checked: true }, { label: 'Kind' }, { label: 'Date Modified' }] },
        ]
      : [
          { id: 'view', label: 'View', submenu: [{ label: 'Large icons' }, { label: 'Medium icons', checked: true }, { label: 'Small icons' }] },
          { id: 'sort', label: 'Sort by', submenu: [{ label: 'Name', checked: true }, { label: 'Size' }, { label: 'Item type' }, { label: 'Date modified' }] },
          { id: 'refresh', label: 'Refresh', onSelect: () => d.toast('Refreshed.') },
          { separator: true },
          { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', disabled: !d.clipboard, onSelect: paste },
          { separator: true },
          { id: 'new', label: 'New', submenu: [{ id: 'folder', label: 'Folder', onSelect: newFolder }, { id: 'text', label: 'Text Document', onSelect: newText }] },
          { separator: true },
          { id: 'display', label: 'Display settings', onSelect: () => d.openApp('settings') },
          { id: 'personalize', label: 'Personalize', onSelect: () => d.openApp('settings') },
        ]
  }

  // keyboard shortcuts for the selected icon when the desktop (not a window) has focus
  useEffect(
    () =>
      d.registerComboHandler((combo) => {
        if (d.active) return false
        const sel = items.find((i) => i.id === d.selection)
        const node = sel?.node
        const cb = d.clipboard
        if (combo === 'delete' || combo === 'cmd+backspace') {
          if (node) return tryDelete(d, node), true
        }
        if (combo === 'f2' && sel && !mac) return setRenamingId(sel.id), true
        if (combo === 'mod+c'.replace('mod', mac ? 'cmd' : 'ctrl') && node) return d.setClipboard({ mode: 'copy', nodes: [node] }), true
        if (combo === (mac ? 'cmd+x' : 'ctrl+x') && node) return d.setClipboard({ mode: 'cut', nodes: [node] }), true
        if (combo === (mac ? 'cmd+v' : 'ctrl+v') && cb) {
          for (const n of cb.nodes) {
            try {
              if (cb.mode === 'cut') d.vfs.move(n, desktopFolder)
              else d.vfs.copy(n, desktopFolder)
            } catch (e) {
              d.toast(errorMessageEn(e, d.os))
            }
          }
          if (cb.mode === 'cut') d.setClipboard(null)
          return true
        }
        return false
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [d.registerComboHandler, d.active, d.selection, d.clipboard, d.vfsVersion],
  )

  return (
    <div
        {...dropZoneProps(reposition, (p) => (p as Payload).kind === 'node')}
        ref={(el) => {
          ref.current = el
          dropRef(el)
        }}
        data-coach="desktop"
        className="absolute inset-0"
        onPointerDown={() => {
          d.setSelection(null)
          d.closeMenu()
          d.wmDispatch({ type: 'focusDesktop' })
          d.setUi({ startOpen: false, openMenu: null, spotlightOpen: false })
          setRenamingId(null)
          onBackgroundPointerDown?.()
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          d.wmDispatch({ type: 'focusDesktop' })
          d.openMenu(e, bgMenu())
        }}
      >
        {items.map((it) => {
          const p = place(it.id)
          return p ? <DesktopItem key={it.id} item={it} x={p.x} y={p.y} selected={d.selection === it.id} renaming={renamingId === it.id} onStartRename={() => setRenamingId(it.id)} onFinishRename={(n) => rename(it, n)} /> : null
        })}
    </div>
  )
}
