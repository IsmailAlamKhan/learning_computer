/**
 * Pointer-based drag and drop (works with mouse, touch and pen — unlike HTML5 DnD).
 * Used by the simulated desktops AND by quiz "drag to match" questions.
 *
 *   const drag = useDrag({ payload, ghost: <Icon/>, onDropOutside: (x, y) => ... })
 *   <div {...drag} data-coach="icon-x">…</div>
 *   <DropZone id="icon-recycle-bin" onDrop={(payload) => ...}>…</DropZone>
 */
import { useRef, type PointerEvent as RPointerEvent, type ReactNode, type HTMLAttributes } from 'react'

export interface DropInfo {
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
}
type DropHandler = (payload: unknown, source: HTMLElement | null, info: DropInfo) => void
const dropHandlers = new WeakMap<HTMLElement, { onDrop: DropHandler; accepts?: (payload: unknown) => boolean }>()

export interface DragOptions {
  payload: unknown
  ghost?: ReactNode
  /** px the pointer must travel before a drag starts (so plain clicks still work). */
  threshold?: number
  onStart?: () => void
  /** Called when dropped on empty space: viewport coordinates + pointer offset inside the source. */
  onDropOutside?: (info: { clientX: number; clientY: number; offsetX: number; offsetY: number; moved: number }) => void
  /** Called after any drag ends (dropped or not). */
  onEnd?: () => void
  /** Emit-style callback with data-coach ids when a drag ends over a drop zone. */
  onDragEvent?: (info: { target: string; dropTarget: string }) => void
  disabled?: boolean
}

const GHOST_ID = 'sim-drag-ghost'

export function useDrag(opts: DragOptions): Pick<HTMLAttributes<HTMLElement>, 'onPointerDown'> & { style: React.CSSProperties } {
  const optsRef = useRef(opts)
  optsRef.current = opts

  const onPointerDown = (e: RPointerEvent<HTMLElement>) => {
    const o = optsRef.current
    if (o.disabled || e.button !== 0) return
    const source = e.currentTarget
    const rect = source.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const offsetX = startX - rect.left
    const offsetY = startY - rect.top
    const threshold = o.threshold ?? 5
    let dragging = false
    let ghost: HTMLDivElement | null = null
    let over: HTMLElement | null = null

    const findZone = (x: number, y: number): HTMLElement | null => {
      if (ghost) ghost.style.display = 'none'
      const el = document.elementFromPoint(x, y)
      if (ghost) ghost.style.display = ''
      let z = el?.closest<HTMLElement>('[data-drop]') ?? null
      while (z) {
        const h = dropHandlers.get(z)
        if (h && (!h.accepts || h.accepts(o.payload)) && z !== source && !source.contains(z)) return z
        z = z.parentElement?.closest<HTMLElement>('[data-drop]') ?? null
      }
      return null
    }

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!dragging && Math.hypot(dx, dy) < threshold) return
      if (!dragging) {
        dragging = true
        o.onStart?.()
        ghost = document.createElement('div')
        ghost.id = GHOST_ID
        ghost.setAttribute('aria-hidden', 'true')
        ghost.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;opacity:.85;left:0;top:0;'
        const clone = source.cloneNode(true) as HTMLElement
        clone.removeAttribute('data-coach')
        clone.style.width = `${rect.width}px`
        clone.style.pointerEvents = 'none'
        ghost.appendChild(clone)
        document.body.appendChild(ghost)
      }
      ev.preventDefault()
      if (ghost) ghost.style.transform = `translate(${ev.clientX - offsetX}px, ${ev.clientY - offsetY}px)`
      const z = findZone(ev.clientX, ev.clientY)
      if (z !== over) {
        over?.removeAttribute('data-drop-over')
        z?.setAttribute('data-drop-over', 'true')
        over = z
      }
    }

    const finish = (ev: PointerEvent, cancelled: boolean) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
      if (!dragging) return
      // swallow the click that follows a drag
      const swallow = (c: MouseEvent) => {
        c.stopPropagation()
        c.preventDefault()
      }
      window.addEventListener('click', swallow, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
      ghost?.remove()
      over?.removeAttribute('data-drop-over')
      const z = cancelled ? null : findZone(ev.clientX, ev.clientY)
      const cur = optsRef.current
      if (z) {
        dropHandlers.get(z)?.onDrop(cur.payload, source, { clientX: ev.clientX, clientY: ev.clientY, offsetX, offsetY })
        const t = source.getAttribute('data-coach')
        const d = z.getAttribute('data-coach')
        if (t && d) cur.onDragEvent?.({ target: t, dropTarget: d })
      } else if (!cancelled) {
        cur.onDropOutside?.({ clientX: ev.clientX, clientY: ev.clientY, offsetX, offsetY, moved: Math.hypot(ev.clientX - startX, ev.clientY - startY) })
      }
      cur.onEnd?.()
    }
    const up = (ev: PointerEvent) => finish(ev, false)
    const cancel = (ev: PointerEvent) => finish(ev, true)
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
  }

  return { onPointerDown, style: { touchAction: 'none' } }
}

interface DropZoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  /** Also used as the data-coach id so lessons can target it. */
  id?: string
  onDrop: DropHandler
  accepts?: (payload: unknown) => boolean
  children?: ReactNode
}

/** A region that accepts drops. While a draggable hovers it, it gets `data-drop-over="true"` for styling. */
export function DropZone({ id, onDrop, accepts, children, ...rest }: DropZoneProps) {
  return (
    <div
      {...rest}
      data-drop="true"
      data-coach={id}
      ref={(el) => {
        if (el) dropHandlers.set(el, { onDrop, accepts })
      }}
    >
      {children}
    </div>
  )
}

/** Register an existing element as a drop zone (for desktop icons etc.). */
export function dropZoneProps(onDrop: DropHandler, accepts?: (p: unknown) => boolean) {
  return {
    'data-drop': 'true' as const,
    ref: (el: HTMLElement | null) => {
      if (el) dropHandlers.set(el, { onDrop, accepts })
    },
  }
}
