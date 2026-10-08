/** The simulated Mail app (same on Windows and Mac): folders, reading, composing, attachments, reply/forward, spam and trash. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useDesktop } from '../../DesktopContext'
import { registerApp } from '../registry'
import type { WinState } from '../../windowManager'
import { MailIcon } from '../../ui/icons'
import { errorMessageEn } from '../../vfs'
import { AttachPicker } from './mailPicker'
import { FOLDERS, FOLDER_LABEL, attachmentSize, fmtBytes, getMailStore, type Attachment, type Draft, type Folder, type Mail } from './mailStore'

const EMPTY: Draft = { to: '', subject: '', body: '', attachments: [] }
const sameDraft = (a: Draft, b: Draft) => a.to === b.to && a.subject === b.subject && a.body === b.body && a.attachments.length === b.attachments.length
const hasContent = (d: Draft) => !!(d.to.trim() || d.subject.trim() || d.body.trim() || d.attachments.length)

function fmtWhen(ms: number): string {
  return new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
}

type Compose = { draft: Draft; initial: Draft; draftId?: string; error?: string; bodyTyped?: boolean }

export function MailApp({ win }: { win: WinState }) {
  const d = useDesktop()
  const { vfs } = d
  const store = getMailStore(vfs, (event) => d.emit({ type: 'custom', event }))
  useSyncExternalStore(store.subscribe, store.getVersion)
  const [folder, setFolder] = useState<Folder>('inbox')
  const [selId, setSelId] = useState<string | null>(null)
  const [compose, setCompose] = useState<Compose | null>(null)
  const [picker, setPicker] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const prevCount = useRef(store.count('inbox'))
  void win

  useEffect(() => {
    d.wmDispatch({ type: 'setTitle', id: win.id, title: 'Mail' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.id])

  // a small toast when something new arrives while Mail is open
  const inboxCount = store.count('inbox')
  useEffect(() => {
    if (inboxCount > prevCount.current) d.toast('New message in your Inbox')
    prevCount.current = inboxCount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inboxCount])

  const emit = (event: string) => d.emit({ type: 'custom', event })
  const list = store.list(folder)
  const sel = selId ? store.get(selId) : undefined
  const shown = sel && sel.folder === folder ? sel : undefined

  /** leave the compose pane; a changed, non-empty draft is kept in Drafts (like real mail) */
  const leaveCompose = () => {
    if (compose && !sameDraft(compose.draft, compose.initial) && hasContent(compose.draft)) store.saveDraft(compose.draft, compose.draftId)
    setCompose(null)
  }
  const goFolder = (f: Folder) => {
    leaveCompose()
    setFolder(f)
    setSelId(null)
    setNote(null)
  }
  const openMsg = (m: Mail) => {
    if (m.folder === 'drafts') {
      leaveCompose()
      const dr = { to: m.to, subject: m.subject, body: m.body, attachments: m.attachments }
      setCompose({ draft: dr, initial: dr, draftId: m.id })
      setSelId(m.id)
      return
    }
    leaveCompose()
    setSelId(m.id)
    store.markRead(m.id)
    setNote(null)
  }
  const startCompose = (dr?: Draft) => {
    leaveCompose()
    const x = dr ?? EMPTY
    setCompose({ draft: x, initial: x })
    setNote(null)
    if (!dr) emit('mail-compose')
  }
  const patch = (p: Partial<Draft>) => setCompose((c) => (c ? { ...c, draft: { ...c.draft, ...p }, error: undefined } : c))

  const send = () => {
    if (!compose) return
    const r = store.send(compose.draft, compose.draftId)
    if (!r.ok) return setCompose({ ...compose, error: r.message })
    setCompose(null)
    setSelId(null)
    setNote('Message sent. You can find it in the Sent folder.')
    d.toast('Message sent')
  }

  const attach = (n: import('../../vfs').VNode) => {
    setPicker(false)
    if (!compose) return
    if (compose.draft.attachments.some((a) => a.name === n.name)) return
    const a: Attachment = { name: n.name, content: n.content, size: attachmentSize(n.content, n.media) }
    patch({ attachments: [...compose.draft.attachments, a] })
    emit(`mail-attach:${n.name}`)
  }

  const saveAttachment = (a: Attachment) => {
    const dl = vfs.child(vfs.home, 'Downloads') ?? vfs.home
    try {
      const dot = a.name.lastIndexOf('.')
      const name = vfs.uniqueName(dl, dot > 0 ? a.name.slice(0, dot) : a.name, dot > 0 ? a.name.slice(dot) : '')
      vfs.createFile(dl, name, a.content)
      setNote(`Saved “${name}” to your Downloads folder.`)
      d.toast(`Saved to Downloads: ${name}`)
      emit('mail-save-attachment')
    } catch (e) {
      setNote(errorMessageEn(e, d.os))
    }
  }

  const btn = 'min-h-9 rounded border border-gray-300 bg-white px-3 hover:bg-gray-100 disabled:text-gray-400'
  const startFolder = vfs.child(vfs.home, 'Documents') ?? vfs.home

  const reading = shown && (
    <div className="flex min-h-0 flex-1 flex-col" data-coach="mail-reading">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 p-2">
        {shown.folder !== 'sent' && shown.folder !== 'trash' && (
          <button type="button" data-coach="mail-reply" className={btn} onClick={() => { const r = store.reply(shown.id); if (r) startCompose(r) }}>
            Reply
          </button>
        )}
        <button type="button" data-coach="mail-forward" className={btn} onClick={() => { const r = store.forward(shown.id); if (r) startCompose(r) }}>
          Forward
        </button>
        {shown.folder === 'spam' ? (
          <button type="button" data-coach="mail-notspam" className={btn} onClick={() => { store.notSpam(shown.id); setSelId(null) }}>
            Not spam
          </button>
        ) : (
          shown.folder === 'inbox' && (
            <button type="button" data-coach="mail-spam" className={btn} onClick={() => { store.markSpam(shown.id); setSelId(null) }}>
              Spam
            </button>
          )
        )}
        {shown.folder === 'trash' ? (
          <>
            <button type="button" data-coach="mail-restore" className={btn} onClick={() => { store.restore(shown.id); setSelId(null) }}>
              Restore
            </button>
            <button type="button" data-coach="mail-delete-forever" className={btn} onClick={() => { store.deleteForever(shown.id); setSelId(null) }}>
              Delete forever
            </button>
          </>
        ) : (
          <button type="button" data-coach="mail-delete" className={btn} onClick={() => { store.trash(shown.id); setSelId(null) }}>
            Delete
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 select-text">
        <h2 className="text-lg font-semibold">{shown.subject}</h2>
        <div className="mt-1 text-xs text-gray-600">
          <div>From: {shown.from}</div>
          <div>To: {shown.to}</div>
          <div>{fmtWhen(shown.date)}</div>
        </div>
        {shown.folder === 'spam' && <div className="mt-2 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900">This message is in Spam. Do not click links or give any details.</div>}
        <pre className="mt-3 font-[inherit] text-sm whitespace-pre-wrap">{shown.body}</pre>
        {shown.attachments.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-3" data-coach="mail-attachments">
            <div className="mb-1 text-xs font-semibold text-gray-600">Attachments ({shown.attachments.length})</div>
            <div className="flex flex-wrap gap-2">
              {shown.attachments.map((a) => (
                <div key={a.name} data-coach={`mail-attachment-${a.name}`} className="flex items-center gap-2 rounded border border-gray-300 bg-gray-50 px-2 py-1">
                  <span aria-hidden>📎</span>
                  <span>
                    {a.name} <span className="text-xs text-gray-500">({fmtBytes(a.size)})</span>
                  </span>
                  <button type="button" data-coach={`mail-save-attachment-${a.name}`} className="min-h-9 rounded bg-blue-600 px-2 text-white" onClick={() => saveAttachment(a)}>
                    Save attachment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const composer = compose && (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-3" data-coach="mail-composer">
      <div className="font-semibold">{compose.draftId ? 'Draft' : 'New message'}</div>
      <label className="flex items-center gap-2">
        <span className="w-16 shrink-0 text-gray-600">To</span>
        <input data-coach="mail-to" aria-label="To" value={compose.draft.to} onChange={(e) => patch({ to: e.target.value })} onKeyDown={(e) => e.stopPropagation()} placeholder="name@mail.example" autoComplete="off" className="min-h-9 min-w-0 flex-1 rounded border border-gray-300 px-2" />
      </label>
      <label className="flex items-center gap-2">
        <span className="w-16 shrink-0 text-gray-600">Subject</span>
        <input data-coach="mail-subject" aria-label="Subject" value={compose.draft.subject} onChange={(e) => patch({ subject: e.target.value })} onKeyDown={(e) => e.stopPropagation()} autoComplete="off" className="min-h-9 min-w-0 flex-1 rounded border border-gray-300 px-2" />
      </label>
      <textarea
        data-coach="mail-body"
        aria-label="Message body"
        value={compose.draft.body}
        onChange={(e) => {
          const v = e.target.value
          if (v && !compose.bodyTyped) emit('mail-body-typed')
          setCompose({ ...compose, draft: { ...compose.draft, body: v }, error: undefined, bodyTyped: compose.bodyTyped || !!v })
        }}
        onKeyDown={(e) => e.stopPropagation()}
        spellCheck={false}
        className="min-h-24 flex-1 resize-none rounded border border-gray-300 p-2 select-text"
        style={{ fontFamily: 'ui-sans-serif, system-ui, "Noto Sans Bengali", sans-serif' }}
      />
      <div className="flex flex-wrap items-center gap-2" data-coach="mail-chips">
        {compose.draft.attachments.map((a) => (
          <span key={a.name} data-coach={`mail-chip-${a.name}`} className="flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 py-0.5 pr-1 pl-3">
            📎 {a.name} <span className="text-xs text-gray-500">({fmtBytes(a.size)})</span>
            <button type="button" aria-label={`Remove ${a.name}`} className="min-h-9 min-w-9 rounded-full hover:bg-gray-200" onClick={() => patch({ attachments: compose.draft.attachments.filter((x) => x.name !== a.name) })}>
              ✕
            </button>
          </span>
        ))}
      </div>
      {compose.error && (
        <div role="alert" data-coach="mail-error" className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
          {compose.error}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" data-coach="mail-send" className="min-h-9 rounded bg-blue-600 px-5 text-white hover:bg-blue-700" onClick={send}>
          Send
        </button>
        <button type="button" data-coach="mail-attach" className={btn} onClick={() => setPicker(true)}>
          📎 Attach file
        </button>
        <button type="button" data-coach="mail-save-draft" className={btn} onClick={() => { if (hasContent(compose.draft)) { const id = store.saveDraft(compose.draft, compose.draftId); setCompose({ ...compose, draftId: id, initial: compose.draft }); setNote('Draft saved.') } }}>
          Save draft
        </button>
        <button type="button" data-coach="mail-discard" className={`${btn} ml-auto`} onClick={() => { store.discardDraft(compose.draftId); setCompose(null); setSelId(null) }}>
          Discard
        </button>
      </div>
    </div>
  )

  return (
    <div className="relative flex h-full text-sm text-gray-900" data-coach="mail-app">
      <aside className="flex w-40 shrink-0 flex-col gap-1 border-r border-gray-200 bg-[#f3f4f6] p-2" aria-label="Mail folders">
        <button type="button" data-coach="mail-compose" className="mb-1 min-h-10 rounded bg-blue-600 px-3 font-medium text-white hover:bg-blue-700" onClick={() => startCompose()}>
          ✎ Compose
        </button>
        {FOLDERS.map((f) => (
          <button key={f} type="button" data-coach={`mail-folder-${FOLDER_LABEL[f]}`} aria-current={folder === f} onClick={() => goFolder(f)} className={`flex min-h-9 items-center justify-between rounded px-2 text-left hover:bg-gray-200 ${folder === f ? 'bg-sky-100 font-semibold' : ''}`}>
            <span>{FOLDER_LABEL[f]}</span>
            {store.count(f) > 0 && (
              <span data-coach={`mail-count-${FOLDER_LABEL[f]}`} className={`rounded-full px-2 text-xs ${f === 'inbox' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {store.count(f)}
              </span>
            )}
          </button>
        ))}
        <div className="mt-auto break-all px-1 text-xs text-gray-500" data-coach="mail-address">
          {store.address}
        </div>
      </aside>
      <section className="flex w-64 shrink-0 flex-col border-r border-gray-200" aria-label={`${FOLDER_LABEL[folder]} messages`} data-coach="mail-list">
        <div className="border-b border-gray-200 px-3 py-2 font-semibold">{FOLDER_LABEL[folder]}</div>
        <div className="min-h-0 flex-1 overflow-auto">
          {list.length === 0 && <div className="p-3 text-gray-500">No messages here.</div>}
          {list.map((m) => (
            <button key={m.id} type="button" data-coach={`mail-msg-${m.subject}`} aria-current={selId === m.id} onClick={() => openMsg(m)} className={`block min-h-14 w-full border-b border-gray-100 px-3 py-2 text-left hover:bg-gray-50 ${selId === m.id ? 'bg-sky-50' : ''}`}>
              <div className={`truncate ${m.read ? '' : 'font-bold'}`}>{m.folder === 'sent' || m.folder === 'drafts' ? `To: ${m.to || '(no address)'}` : m.from.replace(/\s*<.*>/, '')}</div>
              <div className={`truncate ${m.read ? 'text-gray-600' : 'font-semibold'}`}>
                {m.attachments.length > 0 && '📎 '}
                {m.subject || '(no subject)'}
              </div>
            </button>
          ))}
        </div>
      </section>
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        {note && !compose && (
          <div data-coach="mail-note" role="status" className="border-b border-green-200 bg-green-50 px-3 py-2 text-green-900">
            {note}
          </div>
        )}
        {composer || reading || <div className="flex flex-1 items-center justify-center p-6 text-center text-gray-500">Select a message to read it, or press Compose to write a new one.</div>}
      </main>
      {picker && <AttachPicker startFolder={startFolder} onCancel={() => setPicker(false)} onChoose={attach} />}
    </div>
  )
}

export function register() {
  registerApp({
    id: 'mail',
    title: () => 'Mail',
    descriptionBn: 'ইমেইল পড়া, লেখা আর পাঠানোর প্রোগ্রাম (শুধু প্র্যাকটিসের জন্য)',
    icon: ({ size }) => <MailIcon size={size} />,
    component: MailApp,
    defaultSize: { w: 900, h: 540 },
  })
}
