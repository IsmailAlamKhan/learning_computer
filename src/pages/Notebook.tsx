import { useEffect, useMemo, useRef, useState } from 'react'
import { useFmt } from '../ui/useFmt'
import { useProgress, store } from '../state/store'
import { downloadText } from '../lib/download'
import { NOTE_TEMPLATES, displayTitle, exportNotes, formatNoteDate, newNoteId, searchNotes, sortNewest } from '../lib/notebook'
import type { NotebookNote } from '../state/progress'

type Draft = { id: string; title: string; body: string }

function Editor({ draft, onClose }: { draft: Draft; onClose: () => void }) {
  const [title, setTitle] = useState(draft.title)
  const [body, setBody] = useState(draft.body)
  const [mono, setMono] = useState(false)
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle')
  const last = useRef({ title: draft.title, body: draft.body })
  const latest = useRef({ title, body })
  latest.current = { title, body }

  const flush = () => {
    const { title: t, body: b } = latest.current
    if (t === last.current.title && b === last.current.body) return
    if (!t.trim() && !b.trim()) return
    store.upsertNote({ id: draft.id, title: t, body: b })
    last.current = { title: t, body: b }
    setSaved('saved')
  }

  useEffect(() => {
    if (title === last.current.title && body === last.current.body) return
    setSaved('saving')
    const h = window.setTimeout(flush, 400)
    return () => window.clearTimeout(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body])

  useEffect(() => () => flush(), []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="card space-y-3" aria-label="নোট সম্পাদনা" data-testid="note-editor">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">নোট লিখুন</h2>
        <span role="status" className="text-sm text-muted" data-testid="note-save-status">
          {saved === 'saving' ? 'সেভ হচ্ছে…' : saved === 'saved' ? '✓ নিজে নিজে সেভ হয়েছে' : 'লিখলেই নিজে নিজে সেভ হবে'}
        </span>
      </div>
      <label className="block">
        <span className="font-semibold">শিরোনাম</span>
        <input className="mt-1 min-h-12 w-full rounded-xl border-2 px-3" style={{ borderColor: 'var(--c-line)' }} value={title} onChange={(e) => setTitle(e.target.value)} data-testid="note-title" />
      </label>
      <label className="block">
        <span className="font-semibold">লেখা</span>
        <textarea
          className="mt-1 min-h-64 w-full rounded-xl border-2 p-3"
          style={{ borderColor: 'var(--c-line)', fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' : undefined }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          data-testid="note-body"
        />
      </label>
      <label className="flex min-h-12 items-center gap-3">
        <input type="checkbox" className="h-6 w-6 accent-[var(--c-brand)]" checked={mono} onChange={(e) => setMono(e.target.checked)} data-testid="note-mono" />
        <span>কোডের মতো সমান-প্রস্থের (monospace) অক্ষরে দেখান</span>
      </label>
      <button
        type="button"
        className="btn"
        onClick={() => {
          flush()
          onClose()
        }}
        data-testid="note-done"
      >
        ✓ হয়েছে, তালিকায় ফিরুন
      </button>
    </section>
  )
}

export default function Notebook() {
  const { notebook } = useProgress()
  const f = useFmt()
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const shown = useMemo(() => sortNewest(searchNotes(notebook, query)), [notebook, query])

  const openNote = (n: NotebookNote) => setDraft({ id: n.id, title: n.title, body: n.body })
  const create = (title = '', body = '') => setDraft({ id: newNoteId(), title, body })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">📓 আমার প্রোগ্রামিং নোটবুক</h1>
        <p className="text-muted">শেখা শব্দ, পাওয়া এরর আর তার সমাধান নিজের ভাষায় লিখে রাখুন। নোটগুলো শুধু এই কম্পিউটারের ব্রাউজারে থাকে।</p>
      </div>

      {draft ? (
        <Editor key={draft.id} draft={draft} onClose={() => setDraft(null)} />
      ) : (
        <>
          <section className="card space-y-3" aria-label="নতুন নোট">
            <h2 className="text-lg font-bold">নতুন নোট</h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn" onClick={() => create()} data-testid="note-new">
                ＋ খালি নোট
              </button>
              {NOTE_TEMPLATES.map((t) => (
                <button key={t.id} type="button" className="btn btn-outline" onClick={() => create(t.titleBn, t.body)} data-testid={`note-template-${t.id}`}>
                  {t.titleBn}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3" aria-label="নোটের তালিকা">
            <div className="flex flex-wrap items-center gap-3">
              <label className="min-w-0 flex-1">
                <span className="sr-only">নোট খুঁজুন</span>
                <input type="search" placeholder="নোট খুঁজুন…" className="min-h-12 w-full rounded-xl border-2 px-3" style={{ borderColor: 'var(--c-line)' }} value={query} onChange={(e) => setQuery(e.target.value)} data-testid="note-search" />
              </label>
              <button type="button" className="btn btn-outline" disabled={notebook.length === 0} onClick={() => downloadText('my-programming-notebook.md', exportNotes(notebook, 'md'), 'text/markdown')} data-testid="note-export-md">
                ⬇ .md এক্সপোর্ট
              </button>
              <button type="button" className="btn btn-outline" disabled={notebook.length === 0} onClick={() => downloadText('my-programming-notebook.txt', exportNotes(notebook, 'txt'), 'text/plain')} data-testid="note-export-txt">
                ⬇ .txt এক্সপোর্ট
              </button>
            </div>
            <p className="text-sm text-muted" aria-live="polite">
              সবচেয়ে নতুন নোট আগে · {f.n(shown.length)}টি নোট
            </p>
            {notebook.length === 0 && <p className="card" data-testid="note-empty">এখনো কোনো নোট নেই। ওপরে “নতুন নোট” থেকে শুরু করুন — যেমন “নতুন শব্দ শিখলাম”।</p>}
            {notebook.length > 0 && shown.length === 0 && <p className="card">এই শব্দে কোনো নোট পাওয়া যায়নি।</p>}
            <ul className="space-y-3">
              {shown.map((n) => (
                <li key={n.id} className="card space-y-2" data-testid="note-item">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold">{displayTitle(n)}</h3>
                    <span className="text-sm text-muted">{formatNoteDate(n.updatedAt)}</span>
                  </div>
                  <p className="line-clamp-2 whitespace-pre-line text-muted">{n.body.trim().slice(0, 160)}</p>
                  {confirmId === n.id ? (
                    <div className="flex flex-wrap items-center gap-2" role="alert">
                      <span>নোটটি সত্যিই মুছে ফেলবেন? এটি আর ফেরানো যাবে না।</span>
                      <button type="button" className="btn" onClick={() => (store.deleteNote(n.id), setConfirmId(null))} data-testid="note-delete-yes">
                        হ্যাঁ, মুছুন
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setConfirmId(null)}>
                        না, থাক
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn btn-outline" onClick={() => openNote(n)} data-testid="note-open">
                        ✏️ খুলুন / বদলান
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setConfirmId(n.id)} data-testid="note-delete">
                        🗑 মুছুন
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
