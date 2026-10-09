import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Scales its content to fit the area it is given (never scrolls): shrinks big pictures, and enlarges small illustrations up to `maxScale`.
 * `width`: 'natural' = the content's own size (illustrations, flows); 'fill' = as wide as the area up to `maxWidth` px (screenshots, compare, code).
 */
export function FitBox({ children, maxScale = 1.5, width = 'natural', maxWidth = 760 }: { children: ReactNode; maxScale?: number; width?: 'natural' | 'fill'; maxWidth?: number }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const measure = () => {
      const o = outer.current
      const i = inner.current
      if (!o || !i) return
      const iw = i.offsetWidth
      const ih = i.offsetHeight
      if (!iw || !ih) return
      const cs = getComputedStyle(o)
      const cw = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const ch = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      const s = Math.min(maxScale, cw / iw, ch / ih)
      setScale((p) => (Math.abs(p - s) < 0.004 ? p : Math.max(0.2, s)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (outer.current) ro.observe(outer.current)
    if (inner.current) ro.observe(inner.current)
    return () => ro.disconnect()
  }, [maxScale, width, maxWidth])
  return (
    <div ref={outer} className="deck-visual">
      <div ref={inner} className="deck-fit" style={{ transform: `scale(${scale})`, width: width === 'fill' ? `min(100%, ${maxWidth}px)` : 'max-content' }}>
        {children}
      </div>
    </div>
  )
}
