/**
 * Logic for the simulated Mail app (Module 8). Pure TypeScript, no React: folders, messages, validation,
 * sending (with a delayed auto-reply / self-delivery) and spam handling. One store per virtual file system,
 * so "Reset" on the practice computer also resets the mailbox. Nothing ever leaves the browser.
 */
import type { VirtualFileSystem } from '../../vfs'

export type Folder = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash'
export const FOLDERS: Folder[] = ['inbox', 'sent', 'drafts', 'spam', 'trash']
export const FOLDER_LABEL: Record<Folder, string> = { inbox: 'Inbox', sent: 'Sent', drafts: 'Drafts', spam: 'Spam', trash: 'Trash' }

export interface Attachment {
  name: string
  /** size in bytes (pretend sizes for picture/pdf files, which hold no text in the practice computer) */
  size: number
  content: string
}

export interface Mail {
  id: string
  folder: Folder
  /** where a trashed / spam-marked message came from, so "Restore" / "Not spam" can send it back */
  prev?: Folder
  from: string
  to: string
  subject: string
  body: string
  date: number
  read: boolean
  attachments: Attachment[]
}

export interface Draft {
  to: string
  subject: string
  body: string
  attachments: Attachment[]
}

export type SendResult = { ok: true; id: string } | { ok: false; error: 'empty' | 'invalid'; message: string }

export type MailEmit = (event: string) => void

/** max size of all attachments together — real mail services allow roughly 20–25 MB */
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024

const ADDRESS_RE = /^[^\s@<>,;]+@[^\s@<>.,;]+(\.[^\s@<>.,;]+)+$/

/** "Rina <rina@mail.example>" -> "rina@mail.example"; plain text is returned trimmed. */
export function extractAddress(raw: string): string {
  const m = /<([^>]+)>/.exec(raw)
  return (m ? m[1] : raw).trim()
}

export function isValidAddress(raw: string): boolean {
  return ADDRESS_RE.test(extractAddress(raw))
}

/** Split a To field on commas / semicolons / spaces. */
export function parseAddresses(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Returns a gentle English message when the To field is not usable, otherwise null. */
export function toFieldProblem(raw: string): { error: 'empty' | 'invalid'; message: string } | null {
  const list = parseAddresses(raw)
  if (list.length === 0) return { error: 'empty', message: 'Please type who this email is for in the To box, for example name@mail.example.' }
  const bad = list.find((a) => !isValidAddress(a))
  if (bad) return { error: 'invalid', message: `“${bad}” does not look like an email address yet. An address has a name, an @ sign, and a domain, like name@mail.example.` }
  return null
}

export const userAddress = (userName: string) => `${userName.toLowerCase().replace(/\s+/g, '.')}@mail.example`

export const withPrefix = (subject: string, prefix: 'Re' | 'Fwd') => (new RegExp(`^${prefix}:`, 'i').test(subject.trim()) ? subject.trim() : `${prefix}: ${subject.trim()}`)

const quote = (m: Mail) => `\n\n— ${m.from} wrote:\n${m.body
  .split('\n')
  .map((l) => `> ${l}`)
  .join('\n')}`

export const attachmentSize = (content: string, media?: string): number => {
  const bytes = new TextEncoder().encode(content).length
  return media ? Math.max(bytes, 240 * 1024) : Math.max(bytes, 1)
}

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

const HOUR = 3_600_000

export class MailStore {
  readonly address: string
  /** delay before a reply / self-delivered message arrives */
  delayMs: number
  emit: MailEmit = () => {}
  messages: Mail[] = []
  version = 0
  private nextId = 1
  private listeners = new Set<() => void>()
  private timers = new Set<ReturnType<typeof setTimeout>>()

  constructor(address: string, opts: { delayMs?: number; seed?: boolean; now?: number } = {}) {
    this.address = address
    this.delayMs = opts.delayMs ?? 1500
    if (opts.seed !== false) this.seed(opts.now ?? Date.now())
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }
  getVersion = () => this.version
  private changed() {
    this.version++
    this.listeners.forEach((l) => l())
  }
  dispose() {
    this.timers.forEach(clearTimeout)
    this.timers.clear()
  }

  private add(m: Omit<Mail, 'id'>): Mail {
    const mail: Mail = { ...m, id: `m${this.nextId++}` }
    this.messages.push(mail)
    return mail
  }

  private seed(now: number) {
    const me = this.address
    const base = { to: me, read: false, attachments: [] as Attachment[] }
    this.add({
      ...base,
      folder: 'inbox',
      from: 'Mail Team <team@mail.example>',
      subject: 'Welcome to Mail',
      date: now - 30 * HOUR,
      body: 'Hello and welcome!\n\nThis is your practice mailbox. You can read messages, write new ones, reply, and keep your mailbox tidy.\nআপনাকে স্বাগতম! এটি অনুশীলনের ইমেইল বাক্স — ভুল করলেও কোনো ক্ষতি নেই।\n\nHappy learning,\nThe Mail Team',
    })
    this.add({
      ...base,
      folder: 'inbox',
      from: 'Rina Apu <rina.apu@mail.example>',
      subject: 'Tea at our place next week',
      date: now - 20 * HOUR,
      body: 'ভালো আছেন তো? আগামী সপ্তাহে একদিন চা খেতে আসুন, অনেক দিন দেখা হয়নি।\nHope you are well. Come over for tea one afternoon next week!\n\n— Rina',
    })
    this.add({
      ...base,
      folder: 'inbox',
      from: 'Daily Reader <news@dailyreader.example>',
      subject: 'This week: five easy tips to type faster',
      date: now - 12 * HOUR,
      body: 'Newsletter\n\n1. Sit straight and relax your shoulders.\n2. Keep your fingers on the home row.\n3. Look at the screen, not the keys.\n4. Practise ten minutes a day.\n5. Do not rush — accuracy first.\n\nআপনি এই চিঠিটি পাচ্ছেন কারণ আপনি আমাদের নিউজলেটারে নাম লিখিয়েছিলেন।',
    })
    this.add({
      ...base,
      folder: 'inbox',
      from: 'Tanvir Bhai <tanvir.bhai@mail.example>',
      subject: 'Class notes for Saturday',
      date: now - 6 * HOUR,
      body: 'Hi,\n\nThe notes from last class are attached. Please save them in your Documents or Downloads folder.\nক্লাসের নোটটি সাথে দিলাম, দেখে নিন।\n\nRegards,\nTanvir',
      attachments: [{ name: 'Class-Notes.txt', size: 1024, content: 'Class notes\n1. An email address looks like name@domain.\n2. Always check the sender before opening an attachment.\n3. Keep one email address for a long time.' }],
    })
    this.add({
      ...base,
      folder: 'inbox',
      from: 'Lucky Winner <claim@free-gift-now.example>',
      subject: 'Claim your free gift now',
      date: now - 3 * HOUR,
      body: 'CONGRATULATIONS!!! You are our lucky winner of a FREE phone!!!\nClick the link below and send your bank details TODAY or you lose the prize.\nhttp://free-gift-now.example/claim-now',
    })
    this.add({
      ...base,
      folder: 'spam',
      from: 'Big Prize <prize@win-lakhs.example>',
      subject: 'You won 5 lakh taka!!!',
      date: now - 40 * HOUR,
      body: 'DEAR FRIEND, you have been selected to receive 5,00,000 taka.\nSend your password and your OTP to claim it immediately.',
    })
    this.add({
      ...base,
      folder: 'spam',
      from: 'LearnCode <no-reply@learncode.example>',
      subject: 'Please verify your LearnCode email',
      date: now - 2 * HOUR,
      body: 'Hello,\n\nPlease confirm that this email address is yours by opening the link:\nhttps://learncode.example/verify/ab12cd\n\nIf you did not create an account, you can ignore this message.',
    })
    // a message Anika has already sent, so the Sent folder is not empty at the start
    this.add({
      ...base,
      folder: 'sent',
      from: me,
      to: 'rina.apu@mail.example',
      read: true,
      subject: 'Thank you for the sweets',
      date: now - 50 * HOUR,
      body: 'Dear Rina Apu,\n\nThank you for the sweets. They were lovely!\n\nBest wishes',
    })
  }

  // ---------- reading ----------
  list(folder: Folder): Mail[] {
    return this.messages.filter((m) => m.folder === folder).sort((a, b) => b.date - a.date)
  }
  get(id: string): Mail | undefined {
    return this.messages.find((m) => m.id === id)
  }
  /** Inbox shows unread messages; Drafts, Spam and Trash show how many are inside; Sent shows none (like real mail). */
  count(folder: Folder): number {
    const l = this.list(folder)
    if (folder === 'sent') return 0
    return folder === 'inbox' ? l.filter((m) => !m.read).length : l.length
  }
  markRead(id: string) {
    const m = this.get(id)
    if (m && !m.read) {
      m.read = true
      this.changed()
    }
  }

  // ---------- moving ----------
  private move(id: string, folder: Folder, remember = false) {
    const m = this.get(id)
    if (!m || m.folder === folder) return
    if (remember) m.prev = m.folder
    m.folder = folder
    this.changed()
  }
  markSpam(id: string) {
    const m = this.get(id)
    if (!m || m.folder === 'spam') return
    this.move(id, 'spam', true)
    this.emit('mail-spam')
  }
  notSpam(id: string) {
    const m = this.get(id)
    if (!m || m.folder !== 'spam') return
    this.move(id, 'inbox')
    m.prev = undefined
    this.emit('mail-notspam')
  }
  trash(id: string) {
    const m = this.get(id)
    if (!m || m.folder === 'trash') return
    this.move(id, 'trash', true)
    this.emit('mail-delete')
  }
  restore(id: string) {
    const m = this.get(id)
    if (!m || m.folder !== 'trash') return
    this.move(id, m.prev && m.prev !== 'trash' ? m.prev : 'inbox')
    this.emit('mail-restore')
  }
  deleteForever(id: string) {
    const i = this.messages.findIndex((m) => m.id === id && m.folder === 'trash')
    if (i >= 0) {
      this.messages.splice(i, 1)
      this.changed()
    }
  }

  // ---------- writing ----------
  reply(id: string): Draft | null {
    const m = this.get(id)
    if (!m) return null
    this.emit('mail-reply')
    return { to: extractAddress(m.from), subject: withPrefix(m.subject, 'Re'), body: quote(m), attachments: [] }
  }
  forward(id: string): Draft | null {
    const m = this.get(id)
    if (!m) return null
    this.emit('mail-forward')
    return { to: '', subject: withPrefix(m.subject, 'Fwd'), body: `\n\n— Forwarded message from ${m.from}:\n${m.body}`, attachments: m.attachments.map((a) => ({ ...a })) }
  }

  /** Keep a draft in Drafts (creating or updating `draftId`). Returns the draft message id. */
  saveDraft(d: Draft, draftId?: string): string {
    const existing = draftId ? this.get(draftId) : undefined
    if (existing && existing.folder === 'drafts') {
      Object.assign(existing, { to: d.to, subject: d.subject, body: d.body, attachments: d.attachments, date: Date.now() })
      this.changed()
      return existing.id
    }
    const m = this.add({ folder: 'drafts', from: this.address, to: d.to, subject: d.subject, body: d.body, date: Date.now(), read: true, attachments: d.attachments })
    this.changed()
    this.emit('mail-draft')
    return m.id
  }
  discardDraft(draftId?: string) {
    if (!draftId) return
    const i = this.messages.findIndex((m) => m.id === draftId && m.folder === 'drafts')
    if (i >= 0) {
      this.messages.splice(i, 1)
      this.changed()
    }
  }

  /** Validate and "send": the message goes to Sent, and shortly after a reply (or the message itself, when sent to yourself) arrives in Inbox. */
  send(d: Draft, draftId?: string): SendResult {
    const problem = toFieldProblem(d.to)
    if (problem) return { ok: false, error: problem.error, message: problem.message }
    const total = d.attachments.reduce((s, a) => s + a.size, 0)
    if (total > MAX_ATTACHMENT_BYTES) return { ok: false, error: 'invalid', message: 'The attachments are too big to send (the limit is about 25 MB). Try a smaller file.' }
    this.discardDraft(draftId)
    const recipients = parseAddresses(d.to).map(extractAddress)
    const subject = d.subject.trim() || '(no subject)'
    const sent = this.add({ folder: 'sent', from: this.address, to: recipients.join(', '), subject, body: d.body, date: Date.now(), read: true, attachments: d.attachments.map((a) => ({ ...a })) })
    this.changed()
    this.emit('mail-sent')
    const me = this.address.toLowerCase()
    if (recipients.some((r) => r.toLowerCase() === me)) {
      this.later(() => this.deliver({ from: this.address, to: this.address, subject, body: d.body, attachments: d.attachments.map((a) => ({ ...a })) }))
    }
    const other = recipients.find((r) => r.toLowerCase() !== me && !/^no-?reply@/i.test(r))
    if (other) {
      const names = d.attachments.map((a) => a.name)
      this.later(() =>
        this.deliver({
          from: other,
          to: this.address,
          subject: withPrefix(subject, 'Re'),
          body: `Hello! Thank you for your email — I have received it${names.length ? ` and the attachment (${names.join(', ')})` : ''}.\nআপনার ইমেইল পেয়েছি, ধন্যবাদ। পরে বিস্তারিত লিখব।\n\n(This is an automatic reply from the practice mailbox.)${quote(sent)}`,
          attachments: [],
        }),
      )
    }
    return { ok: true, id: sent.id }
  }

  private later(fn: () => void) {
    const t = setTimeout(() => {
      this.timers.delete(t)
      fn()
    }, this.delayMs)
    this.timers.add(t)
  }

  private deliver(m: { from: string; to: string; subject: string; body: string; attachments: Attachment[] }) {
    this.add({ folder: 'inbox', date: Date.now(), read: false, ...m })
    this.changed()
    this.emit('mail-received')
  }
}

const stores = new WeakMap<VirtualFileSystem, MailStore>()

/** The mailbox that belongs to this practice computer (created on first use). */
export function getMailStore(vfs: VirtualFileSystem, emit?: MailEmit): MailStore {
  let s = stores.get(vfs)
  if (!s) {
    s = new MailStore(userAddress(vfs.userName))
    stores.set(vfs, s)
  }
  if (emit) s.emit = emit
  return s
}
