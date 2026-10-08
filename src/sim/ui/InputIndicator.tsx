/** Input-language indicator: `ENG`/`BEN` in the Windows tray, a small input menu in the Mac menu bar. Shown only once Bangla was added in Settings. */
import { useEffect, useRef, useState } from 'react'
import { useDesktop } from '../DesktopContext'
import { KEYBOARDS, nextKeyboard } from '../keyboards'

function useKeyboardSwitch(mac: boolean) {
  const d = useDesktop()
  const ref = useRef(d)
  ref.current = d
  useEffect(
    () =>
      d.registerComboHandler((c) => {
        const cur = ref.current
        const list = cur.sim.keyboards ?? ['en']
        if (list.length < 2) return false
        if (c !== (mac ? 'ctrl+space' : 'cmd+space')) return false
        cur.setSim({ activeKeyboard: nextKeyboard(list, cur.sim.activeKeyboard) })
        return true
      }),
    [d, mac],
  )
}

export function InputIndicator({ mac }: { mac: boolean }) {
  const d = useDesktop()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useKeyboardSwitch(mac)
  useEffect(() => {
    if (!open) return
    const off = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('pointerdown', off)
    return () => document.removeEventListener('pointerdown', off)
  }, [open])

  const list = d.sim.keyboards ?? ['en']
  if (list.length < 2) return null
  const active = KEYBOARDS[d.sim.activeKeyboard ?? 'en'] ?? KEYBOARDS.en
  const choose = (id: string) => {
    d.setSim({ activeKeyboard: id })
    setOpen(false)
  }

  return (
    <div ref={box} className={`relative ${mac ? 'h-full' : ''}`}>
      <button
        type="button"
        data-coach={mac ? 'menubar-input' : 'tray-input'}
        aria-label={mac ? `Input menu: ${active.macName}` : `Input indicator: ${active.winCode}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          d.closeMenu()
          setOpen((o) => !o)
        }}
        className={mac ? 'flex h-full min-w-8 items-center justify-center px-1.5 text-[13px] font-medium' : 'flex h-10 min-w-11 items-center justify-center rounded-md px-2 text-[12px] font-medium hover:bg-black/10'}
      >
        {mac ? active.macCode : active.winCode}
      </button>
      {open && (
        <div
          role="menu"
          data-coach={mac ? 'menubar-input-menu' : 'tray-input-menu'}
          className={`absolute z-[1200] w-56 rounded-lg border border-gray-300 bg-white p-1 text-sm text-gray-900 shadow-2xl ${mac ? 'top-full right-0 mt-0.5' : 'right-0 bottom-full mb-2'}`}
        >
          {list.map((id) => {
            const k = KEYBOARDS[id]
            if (!k) return null
            const on = id === (d.sim.activeKeyboard ?? 'en')
            return (
              <button key={id} type="button" role="menuitemradio" aria-checked={on} data-coach={`${mac ? 'menubar' : 'tray'}-input-${id}`} onClick={() => choose(id)} className="flex min-h-11 w-full items-center gap-2 rounded px-3 text-left hover:bg-gray-100">
                <span className="w-4 text-xs">{on ? '✓' : ''}</span>
                <span className="flex-1">
                  {mac ? k.macName : k.winName}
                  {!mac && <span className="block text-xs text-gray-500">{k.winSub}</span>}
                </span>
                {!mac && <span className="text-xs font-semibold text-gray-600">{k.winCode}</span>}
              </button>
            )
          })}
          <div className="border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500">{mac ? 'Shortcut: Control + Space' : 'Shortcut: Windows + Space'}</div>
        </div>
      )}
    </div>
  )
}
