import { useEffect, useRef, type ReactNode } from 'react'
import { useDesktop } from '../DesktopContext'

export interface DialogButton {
  label: string
  onClick: () => void
  primary?: boolean
  /** data-coach id */
  id?: string
}

/** A modal dialog drawn inside the nearest positioned ancestor (a window or the desktop). */
export function SimDialog({ title, children, buttons, onClose, id = 'dialog' }: { title: string; children: ReactNode; buttons: DialogButton[]; onClose?: () => void; id?: string }) {
  const { os } = useDesktop()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('input,button')?.focus()
  }, [])
  const mac = os === 'mac'
  return (
    <div
      className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30 p-3"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose?.()
        }
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-coach={id}
        className={`w-full max-w-sm bg-white text-gray-900 shadow-2xl ${mac ? 'rounded-xl p-5 text-center' : 'rounded-lg border border-gray-300'}`}
      >
        <div className={mac ? 'mb-3' : 'border-b border-gray-200 px-4 py-2.5 text-sm font-semibold'}>{mac ? <div className="text-base font-semibold">{title}</div> : title}</div>
        <div className={mac ? 'text-sm' : 'px-4 py-4 text-sm'}>{children}</div>
        <div className={`flex gap-2 ${mac ? 'mt-4 justify-center' : 'justify-end bg-gray-100 px-4 py-3'}`}>
          {buttons.map((b) => (
            <button
              key={b.label}
              data-coach={b.id}
              onClick={b.onClick}
              className={`min-h-9 rounded px-4 text-sm ${b.primary ? (mac ? 'rounded-md bg-blue-500 text-white' : 'bg-blue-600 text-white') : mac ? 'rounded-md border border-gray-300 bg-white' : 'border border-gray-400 bg-white'}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
