import { useEffect, useState } from 'react'

const KEY = 'small-screen-note-dismissed'
const QUERY = '(max-width: 767px)'

function readDismissed() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * A friendly, dismissible hint on narrow screens (< 768 px): typing, dragging and the simulated computer
 * are easier on a laptop. Not blocking; dismissal lasts for the browser session.
 */
export function SmallScreenNote({ compact = false }: { compact?: boolean }) {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(QUERY).matches)
  const [dismissed, setDismissed] = useState(readDismissed)
  useEffect(() => {
    const mq = window.matchMedia?.(QUERY)
    if (!mq) return
    const on = () => setSmall(mq.matches)
    on()
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  if (!small || dismissed) return null
  return (
    <div role="note" data-testid="small-screen-note" className="no-print flex items-start gap-3 rounded-xl border-2 p-3 text-base" style={{ background: 'var(--c-accent-soft)', borderColor: 'var(--c-accent)' }}>
      <span aria-hidden="true" className="text-2xl">💻</span>
      <p className="flex-1">{compact ? 'ল্যাপটপে করলে সবচেয়ে ভালো লাগে' : 'এই অংশটি ল্যাপটপে করলে সবচেয়ে ভালো লাগে — ছোট পর্দায় দেখা যাবে, তবে টাইপ ও টানাটানির কাজ ল্যাপটপে সহজ'}</p>
      <button
        className="btn btn-outline shrink-0"
        onClick={() => {
          try {
            sessionStorage.setItem(KEY, '1')
          } catch {
            /* ignore */
          }
          setDismissed(true)
        }}
        aria-label="এই বার্তাটি বন্ধ করুন"
      >
        ✕
      </button>
    </div>
  )
}
