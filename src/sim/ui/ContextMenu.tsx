import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDesktop, type MenuItem } from '../DesktopContext'

function MenuList({ items, x, y, depth = 0, onDone }: { items: MenuItem[]; x: number; y: number; depth?: number; onDone: () => void }) {
  const { os, rootRef } = useDesktop()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })
  const [sub, setSub] = useState<number | null>(null)
  const mac = os === 'mac'

  useLayoutEffect(() => {
    const el = ref.current
    const root = rootRef.current
    if (!el || !root) return
    const r = root.getBoundingClientRect()
    let nx = x
    let ny = y
    if (nx + el.offsetWidth > r.width) nx = Math.max(0, depth ? x - el.offsetWidth - 180 : r.width - el.offsetWidth - 4)
    if (ny + el.offsetHeight > r.height) ny = Math.max(0, r.height - el.offsetHeight - 4)
    setPos({ x: nx, y: ny })
  }, [x, y, depth, rootRef])

  const move = (dir: 1 | -1) => {
    const btns = [...(ref.current?.querySelectorAll<HTMLButtonElement>(':scope > button:not([disabled])') ?? [])]
    const i = btns.indexOf(document.activeElement as HTMLButtonElement)
    btns[(i + dir + btns.length) % btns.length]?.focus()
  }

  return (
    <div
      ref={ref}
      role="menu"
      data-coach={depth === 0 ? 'ctx-menu' : undefined}
      className={`absolute min-w-52 py-1.5 text-sm text-gray-900 shadow-xl ${mac ? 'rounded-lg border border-black/10 bg-white/90 backdrop-blur' : 'rounded-lg border border-gray-300 bg-white'}`}
      style={{ left: pos.x, top: pos.y, zIndex: 20000 + depth }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') (e.preventDefault(), move(1))
        else if (e.key === 'ArrowUp') (e.preventDefault(), move(-1))
        else if (e.key === 'Escape') (e.stopPropagation(), onDone())
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it, i) =>
        it.separator ? (
          <div key={i} role="separator" className="my-1 h-px bg-gray-200" />
        ) : (
          <div key={i} className="relative" onMouseEnter={() => setSub(it.submenu ? i : null)}>
            <button
              role="menuitem"
              disabled={it.disabled}
              data-coach={it.id ? `ctx-${it.id}` : undefined}
              className={`flex min-h-9 w-full items-center gap-3 px-3 text-left disabled:text-gray-400 ${mac ? 'mx-0 hover:bg-blue-500 hover:text-white' : 'hover:bg-gray-100'}`}
              onClick={(e) => {
                e.stopPropagation()
                if (it.submenu) return setSub(i)
                onDone()
                it.onSelect?.()
              }}
            >
              <span className="w-4 text-xs">{it.checked ? '✓' : ''}</span>
              <span className="flex-1">{it.label}</span>
              {it.shortcut && <span className="text-xs text-gray-500">{it.shortcut}</span>}
              {it.submenu && <span aria-hidden="true">›</span>}
            </button>
            {it.submenu && sub === i && <MenuList items={it.submenu} x={(ref.current?.offsetWidth ?? 200) - 4 + pos.x} y={pos.y + i * 36} depth={depth + 1} onDone={onDone} />}
          </div>
        ),
      )}
    </div>
  )
}

/** Renders the open context menu (if any) and closes it on outside click / Esc. */
export function ContextMenuHost() {
  const { menu, closeMenu } = useDesktop()
  useEffect(() => {
    if (!menu) return
    const down = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[role="menu"]')) closeMenu()
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu()
    window.addEventListener('pointerdown', down, true)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('pointerdown', down, true)
      window.removeEventListener('keydown', key)
    }
  }, [menu, closeMenu])
  if (!menu) return null
  return <MenuList key={`${menu.x},${menu.y}`} items={menu.items} x={menu.x} y={menu.y} onDone={closeMenu} />
}
