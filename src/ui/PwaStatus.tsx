import { useState } from 'react'
import { prefetchPyodide, updateNow, usePwaState } from '../pwa/offline'

/** Small footer chip about offline readiness + a toast when a newer version is waiting. Renders nothing where there is no service worker. */
export function PwaStatus() {
  const s = usePwaState()
  const [dismissed, setDismissed] = useState(false)
  if (!s.supported) return null
  return (
    <>
      {s.prefetch !== 'idle' && (
        <footer className="no-print mx-auto max-w-6xl px-4 pb-6 text-sm text-muted" role="status" aria-live="polite">
          {s.prefetch === 'working' && <span data-testid="offline-chip">⏳ অফলাইনের জন্য প্রস্তুত করা হচ্ছে…</span>}
          {s.prefetch === 'done' && <span data-testid="offline-chip">✓ অফলাইনে ব্যবহার করা যাবে</span>}
          {s.prefetch === 'error' && (
            <span data-testid="offline-chip">
              অফলাইনের প্রস্তুতি শেষ হয়নি (ইন্টারনেট লাগবে){' '}
              <button type="button" className="btn btn-outline" onClick={() => void prefetchPyodide()}>
                আবার চেষ্টা করুন
              </button>
            </span>
          )}
        </footer>
      )}
      {s.needRefresh && !dismissed && (
        <div role="status" className="card no-print fixed bottom-4 max-sm:bottom-20 left-4 z-50 max-w-sm space-y-2 shadow-lg">
          <p>নতুন সংস্করণ এসেছে — পাতাটি নতুন করে খুলুন</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn" onClick={updateNow}>
              এখনই নতুন করে খুলুন
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setDismissed(true)}>
              পরে
            </button>
          </div>
        </div>
      )}
    </>
  )
}
