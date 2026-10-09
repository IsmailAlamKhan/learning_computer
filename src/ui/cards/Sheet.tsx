import { useEffect, useId, useRef, type ReactNode } from 'react'

/** A panel that slides over the bottom of the card ("আরও জানুন", real-world tasks, teacher tip). Its content may scroll inside it. Esc closes it. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div ref={ref} tabIndex={-1} role="region" aria-labelledby={id} data-deck-sheet="" className="deck-sheet">
      <div className="flex items-center justify-between gap-2 px-5 pt-3">
        <h3 id={id} className="m-0 text-lg font-bold">
          {title}
        </h3>
        <button type="button" className="deck-iconbtn" aria-label="বন্ধ করুন" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="deck-sheet-body">{children}</div>
    </div>
  )
}
