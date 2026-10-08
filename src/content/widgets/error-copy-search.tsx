import { useEffect, useRef, useState } from 'react'
import { ERROR_MESSAGE, RESULTS, isFullMessage, searchQuality, type SearchResult } from './lib/m12Logic'

type Stage = 'copy' | 'paste' | 'results' | 'done'

/** Copy the exact error message → paste it into a search box → pick the trustworthy result. Self-contained practice. */
export default function ErrorCopySearch() {
  const [stage, setStage] = useState<Stage>('copy')
  const [copyNote, setCopyNote] = useState('')
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<SearchResult | null>(null)
  const msgRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (stage !== 'copy') return
    const onCopy = () => {
      const sel = window.getSelection()?.toString() ?? ''
      if (!sel.trim()) return
      if (isFullMessage(sel)) {
        setCopyNote('')
        setStage('paste')
      } else setCopyNote('শুধু একটু অংশ কপি হয়েছে। চেষ্টা করুন পুরো মেসেজটি বেছে নিতে — প্রথম অক্ষর থেকে শেষ চিহ্ন পর্যন্ত।')
    }
    document.addEventListener('copy', onCopy)
    return () => document.removeEventListener('copy', onCopy)
  }, [stage])

  const selectAll = () => {
    const el = msgRef.current
    if (!el) return
    const r = document.createRange()
    r.selectNodeContents(el)
    const s = window.getSelection()
    s?.removeAllRanges()
    s?.addRange(r)
  }
  const quality = searchQuality(q)

  return (
    <div className="card space-y-4 p-4" data-testid="error-copy-search">
      <p className="font-semibold">এরর মেসেজ কপি করে খুঁজুন — নিজে করে দেখুন</p>

      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} role="alertdialog" aria-label="Error dialog">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden="true">⚠️</span> Photo Album
        </div>
        <p ref={msgRef} data-testid="ecs-message" className="select-text rounded-lg p-2 font-mono text-sm" style={{ background: 'var(--c-sunken)' }}>
          {ERROR_MESSAGE}
        </p>
        <div className="mt-2 text-right">
          <span className="rounded border px-4 py-1 text-sm" style={{ borderColor: 'var(--c-line)' }}>
            OK
          </span>
        </div>
      </div>

      {stage === 'copy' && (
        <div className="space-y-2">
          <p>
            <strong>ধাপ ১:</strong> ওপরের এরর মেসেজটির লেখার ওপর মাউস টেনে (বা তিনবার ক্লিক করে) পুরোটা বেছে নিন, তারপর <kbd>Ctrl</kbd> + <kbd>C</kbd> (Mac-এ <kbd>Cmd</kbd> + <kbd>C</kbd>) চাপুন।
          </p>
          <button type="button" className="btn btn-outline" onClick={selectAll}>
            মাউসে কষ্ট হলে: পুরো মেসেজটি বেছে দিন
          </button>
          {copyNote && (
            <p role="status" data-testid="ecs-copy-note">
              {copyNote}
            </p>
          )}
        </div>
      )}

      {stage !== 'copy' && (
        <div className="space-y-2">
          <p>
            <strong>ধাপ ২:</strong> {stage === 'paste' ? 'কপি হয়ে গেছে! এবার নিচের সার্চ বক্সে ক্লিক করে পেস্ট করুন: Ctrl + V (Mac-এ Cmd + V)।' : 'সার্চ বক্সে আপনার পেস্ট করা মেসেজ:'}
          </p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (q.trim() && stage === 'paste') setStage('results')
            }}
          >
            <input aria-label="Search the web" data-testid="ecs-input" value={q} onChange={(e) => setQ(e.target.value)} readOnly={stage !== 'paste'} placeholder="Search the web" className="min-h-12 min-w-0 flex-1 rounded-full border px-4" style={{ borderColor: 'var(--c-line)' }} />
            {stage === 'paste' && (
              <button type="submit" className="btn" disabled={!q.trim()} data-testid="ecs-search">
                Search
              </button>
            )}
          </form>
          {stage === 'paste' && q.trim() && quality === 'weak' && <p role="status">এই লেখায় মেসেজের গুরুত্বপূর্ণ অংশ (প্রোগ্রামের নাম আর এরর কোড) নেই। হুবহু পেস্ট করলে ভালো উত্তর মেলে।</p>}
          {stage === 'paste' && q.trim() && quality === 'partial' && <p role="status">প্রায় ঠিক আছে — এরর কোডটি আছে। পুরোটা পেস্ট করলে আরও ভালো ফল পাবেন।</p>}
        </div>
      )}

      {(stage === 'results' || stage === 'done') && (
        <div className="space-y-2">
          <p>
            <strong>ধাপ ৩:</strong> ফলাফলগুলো পড়ুন। কোনটি সবচেয়ে ভরসাযোগ্য? (তারিখ, “Accepted”, অফিসিয়াল পাতা দেখুন) সেটিতে ক্লিক করুন।
          </p>
          <ul className="space-y-2">
            {RESULTS.map((r) => (
              <li key={r.id}>
                <button type="button" data-testid={`ecs-result-${r.id}`} className="w-full rounded-xl border-2 p-3 text-left" style={{ borderColor: picked?.id === r.id ? 'var(--c-brand)' : 'var(--c-line)' }} onClick={() => (setPicked(r), r.trustworthy && setStage('done'))}>
                  <div className="text-xs" style={{ color: 'var(--c-muted)' }}>
                    {r.site} · {r.date}
                  </div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm">{r.snippet}</div>
                </button>
              </li>
            ))}
          </ul>
          {picked && (
            <p role="status" data-testid="ecs-why">
              {picked.trustworthy ? '👍 ' : '⚠️ '}
              {picked.whyBn}
            </p>
          )}
          {stage === 'done' && <p className="font-semibold">দারুণ! এভাবেই এরর খুঁজে সমাধান পাওয়া যায়।</p>}
        </div>
      )}

      <button
        type="button"
        className="btn btn-outline"
        onClick={() => {
          setStage('copy')
          setQ('')
          setPicked(null)
          setCopyNote('')
          window.getSelection()?.removeAllRanges()
        }}
      >
        ↺ আবার করি
      </button>
    </div>
  )
}
