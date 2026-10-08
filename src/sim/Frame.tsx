import { useEffect, useId, useLayoutEffect, useRef, type ComponentType } from 'react'
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
  const helpId = useId()
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
      // Emit after the event has finished dispatching: advancing a guided step synchronously re-renders the sim
      // and made controlled inputs (Start search, Save As name…) drop the last typed character.
      if (t && typeof v === 'string') window.setTimeout(() => dRef.current.emit({ type: 'type', target: t, value: v }), 0)
    }
    el.addEventListener('click', c, true)
    el.addEventListener('dblclick', dc, true)
    el.addEventListener('contextmenu', cm, true)
    el.addEventListener('input', inp, true)
    // When a focused control disappears (a closed window's ✕ button, a rename box after Enter) the browser drops focus to
    // <body>, and later key shortcuts (F2, Ctrl+L…) would never reach the sim. Hand focus back to the sim root.
    let inside = false
    const markInside = () => {
      inside = true
    }
    const onDocFocusIn = (e: Event) => {
      if (!el.contains(e.target as Node)) inside = false
    }
    const lost = () => !document.activeElement || document.activeElement === document.body
    const refocus = () => window.setTimeout(() => inside && lost() && el.focus({ preventScroll: true }), 0)
    // The focused control can be removed a while after the event (animations, re-renders), so also watch for DOM changes.
    const mo = new MutationObserver(() => inside && lost() && el.focus({ preventScroll: true }))
    mo.observe(el, { childList: true, subtree: true })
    el.addEventListener('pointerdown', markInside, true)
    el.addEventListener('keydown', markInside, true)
    el.addEventListener('click', refocus, true)
    el.addEventListener('keydown', refocus, true)
    document.addEventListener('focusin', onDocFocusIn)
    document.addEventListener('pointerdown', onDocFocusIn)
    return () => {
      mo.disconnect()
      document.removeEventListener('focusin', onDocFocusIn)
      document.removeEventListener('pointerdown', onDocFocusIn)
      el.removeEventListener('pointerdown', markInside, true)
      el.removeEventListener('keydown', markInside, true)
      el.removeEventListener('click', refocus, true)
      el.removeEventListener('keydown', refocus, true)
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
      role="group"
      aria-describedby={helpId}
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
      <span id={helpId} className="sr-only">
        এটি একটি নকল কম্পিউটার। কিবোর্ডে Tab চেপে এক জিনিস থেকে আরেক জিনিসে যান, Enter চেপে খুলুন, Esc চেপে বন্ধ করুন। টার্মিনাল বা কোড এডিটরে আটকে গেলে Esc চেপে তারপর Tab চাপুন।
      </span>
      <div lang="en" className="contents">
        <Shell />
        <ContextMenuHost />
        <AppSwitcher />
        <ToastHost />
        <LockScreen />
      </div>
    </div>
  )
}
