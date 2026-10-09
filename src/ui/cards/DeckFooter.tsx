import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** The footer slot of the deck (next to the back button). Slides put their ONE primary button there via <InFooter>. */
export const FooterSlotContext = createContext<HTMLElement | null>(null)

export function InFooter({ children }: { children: ReactNode }) {
  const el = useContext(FooterSlotContext)
  return el ? createPortal(children, el) : null
}

export function PrimaryButton({ label, disabled, onClick, tone, autoFocus }: { label: string; disabled?: boolean; onClick?: () => void; tone?: 'ok'; autoFocus?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  // `autoFocus` only fires when the element mounts; the footer button can be re-used by React, so focus explicitly (and once more a frame later)
  useEffect(() => {
    if (!autoFocus || disabled) return
    ref.current?.focus()
    const id = requestAnimationFrame(() => ref.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [autoFocus, disabled])
  return (
    <button ref={ref} type="button" className="btn btn-lg deck-primary" data-testid="deck-primary" data-tone={tone} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}
