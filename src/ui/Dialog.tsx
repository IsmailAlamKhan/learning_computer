import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  titleBn: string
  children: ReactNode
  closeLabel?: string
}

/** Accessible modal built on the native <dialog> (focus trap + Esc for free). */
export function Dialog({ open, onClose, titleBn, children, closeLabel = 'বন্ধ করুন' }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-label={titleBn}
      className="m-auto w-[min(92vw,40rem)] max-h-[90vh] overflow-auto rounded-2xl border p-0 backdrop:bg-black/50"
      style={{ background: 'var(--c-surface)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
    >
      {open && (
        <div className="p-6">
          <div className="mb-3 flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">{titleBn}</h2>
            <button className="btn btn-outline" onClick={onClose} aria-label={closeLabel}>
              ✕ <span>{closeLabel}</span>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
