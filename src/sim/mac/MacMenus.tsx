import type { ReactNode } from 'react'
import { useDesktop, type MenuItem } from '../DesktopContext'

/** Menu bar button + dropdown. Open state lives in d.ui.openMenu so hovering switches menus. */
export function BarMenu({ id, label, bold, items, children, wide }: { id: string; label?: ReactNode; bold?: boolean; items?: MenuItem[]; children?: ReactNode; wide?: boolean }) {
  const d = useDesktop()
  const open = d.ui.openMenu === id
  return (
    <div className="relative h-full">
      <button
        type="button"
        data-coach={id}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex h-full min-w-[28px] items-center gap-1 rounded px-2.5 text-[13px] ${bold ? 'font-bold' : ''} ${open ? 'bg-black/20 dark:bg-white/30' : 'hover:bg-black/10'}`}
        onClick={() => d.setUi({ openMenu: open ? null : id })}
        onMouseEnter={() => {
          if (d.ui.openMenu && d.ui.openMenu !== id) d.setUi({ openMenu: id })
        }}
      >
        {label}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full left-0 z-[1001] mt-0.5 rounded-lg border border-black/10 bg-white/90 py-1.5 text-[13px] text-gray-900 shadow-xl backdrop-blur-xl ${wide ? 'min-w-72' : 'min-w-56'}`}
        >
          {children}
          {items?.map((it, i) =>
            it.separator ? (
              <div key={`s${i}`} role="separator" className="my-1 h-px bg-black/10" />
            ) : (
              <button
                key={it.id ?? i}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                data-coach={`menu-item-${it.id}`}
                className="mx-1 flex min-h-8 w-[calc(100%-8px)] items-center justify-between gap-6 rounded px-3 text-left hover:bg-sky-500 hover:text-white disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                onClick={() => {
                  d.setUi({ openMenu: null })
                  it.onSelect?.()
                }}
              >
                <span>
                  {it.checked ? '✓ ' : ''}
                  {it.label}
                </span>
                {it.shortcut && <span className="text-xs opacity-60">{it.shortcut}</span>}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
