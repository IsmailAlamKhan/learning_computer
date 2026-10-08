import { useRef, useState, type ReactNode } from 'react'

/** Hover/focus tooltip. `text` is the English label; `bn` an optional Bengali explanation. */
export function Tooltip({ text, bn, children, side = 'top' }: { text: string; bn?: string; children: ReactNode; side?: 'top' | 'bottom' }) {
  const [show, setShow] = useState(false)
  const t = useRef<number | undefined>(undefined)
  const on = () => {
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setShow(true), 550)
  }
  const off = () => {
    window.clearTimeout(t.current)
    setShow(false)
  }
  return (
    <span className="relative inline-flex" onMouseEnter={on} onMouseLeave={off} onFocus={on} onBlur={off}>
      {children}
      {show && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 z-[20000] -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1 text-xs whitespace-nowrap text-white shadow-lg ${side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          {text}
          {bn && <span className="block text-[11px] opacity-80">{bn}</span>}
        </span>
      )}
    </span>
  )
}
