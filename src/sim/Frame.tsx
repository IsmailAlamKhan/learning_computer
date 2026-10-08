import { useEffect, useLayoutEffect, useRef, type ComponentType } from 'react'
import { useDesktop } from './DesktopContext'
import { comboFromEvent } from './shortcuts'
import { ContextMenuHost } from './ui/ContextMenu'
import { AppSwitcher, LockScreen, ToastHost } from './ui/Overlays'

/**
 * The positioned box that contains a simulated desktop. It:
 *  - measures itself and tells the window manager,
 *  - turns real DOM clicks / double clicks / right clicks / typing on `[data-coach]` elements into SimEvents,
 *  - turns real key presses into key combos.
 */
export function Frame({ Shell, insetTop, insetBottom }: { Shell: ComponentType; insetTop: number; insetBottom: number }) {
  const d = useDesktop()
  const ref = d.rootRef as React.RefObject<HTMLDivElement | null>
  const dRef = useRef(d)
  dRef.current = d

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () => d.setBounds({ w: el.clientWidth, h: el.clientHeight, top: insetTop, bottom: insetBottom })
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insetTop, insetBottom])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const coach = (e: Event) => (e.target as HTMLElement | null)?.closest?.('[data-coach]')?.getAttribute('data-coach') ?? null
    const on = (type: 'click' | 'dblclick' | 'contextmenu') => (e: Event) => {
      const t = coach(e)
      if (t) dRef.current.emit({ type: type === 'click' ? 'click' : type === 'dblclick' ? 'doubleClick' : 'rightClick', target: t })
    }
    const c = on('click')
    const dc = on('dblclick')
    const cm = on('contextmenu')
    const inp = (e: Event) => {
      const t = coach(e)
      const v = (e.target as HTMLInputElement).value
      if (t && typeof v === 'string') dRef.current.emit({ type: 'type', target: t, value: v })
    }
    el.addEventListener('click', c, true)
    el.addEventListener('dblclick', dc, true)
    el.addEventListener('contextmenu', cm, true)
    el.addEventListener('input', inp, true)
    return () => {
      el.removeEventListener('click', c, true)
      el.removeEventListener('dblclick', dc, true)
      el.removeEventListener('contextmenu', cm, true)
      el.removeEventListener('input', inp, true)
    }
  }, [ref])

  return (
    <div
      ref={ref}
      tabIndex={0}
      data-sim-root="true"
      aria-label={d.os === 'mac' ? 'অনুশীলনের Mac কম্পিউটার' : 'অনুশীলনের Windows কম্পিউটার'}
      className="relative h-[min(72vh,640px)] min-h-[420px] w-full overflow-hidden rounded-xl border-2 text-[14px] leading-normal outline-offset-2 select-none"
      style={{ borderColor: 'var(--c-line)', fontFamily: 'var(--font-sans)', filter: `brightness(${0.5 + d.sim.brightness / 200})` }}
      onMouseDown={(e) => {
        if (!(e.target as HTMLElement).closest('input,textarea,[contenteditable]')) ref.current?.focus({ preventScroll: true })
      }}
      onKeyDown={(e) => {
        const combo = comboFromEvent(e.nativeEvent)
        if (!combo) return
        const t = e.target as HTMLElement
        const typing = t.matches('input,textarea,[contenteditable="true"]')
        const hasMod = /^(ctrl|alt|cmd)\+/.test(combo) || combo.includes('+')
        const special = ['esc', 'tab', 'f2', 'f4', 'delete', 'enter'].includes(combo)
        if (!hasMod && !special && combo.length === 1) return
        if (typing && !hasMod && combo !== 'esc') return
        if (d.dispatchCombo(combo)) e.preventDefault()
      }}
    >
      <Shell />
      <ContextMenuHost />
      <AppSwitcher />
      <ToastHost />
      <LockScreen />
    </div>
  )
}
