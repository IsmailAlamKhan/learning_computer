import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MailStore, extractAddress, isValidAddress, toFieldProblem, userAddress, withPrefix } from './extra/mailStore'

describe('address helpers', () => {
  it('validates addresses', () => {
    expect(isValidAddress('anika@mail.example')).toBe(true)
    expect(isValidAddress('Rina <rina@mail.example>')).toBe(true)
    for (const bad of ['', 'anika', 'anika@', '@mail.example', 'anika@mail', 'a b@mail.example', 'a@@mail.example']) expect(isValidAddress(bad)).toBe(false)
    expect(extractAddress('Rina <rina@mail.example>')).toBe('rina@mail.example')
  })
  it('gives gentle messages', () => {
    expect(toFieldProblem('')?.error).toBe('empty')
    expect(toFieldProblem('  ')?.error).toBe('empty')
    expect(toFieldProblem('rina')?.message).toMatch(/@ sign/)
    expect(toFieldProblem('a@b.example, c@d.example')).toBeNull()
  })
  it('derives the user address and prefixes', () => {
    expect(userAddress('Anika')).toBe('anika@mail.example')
    expect(withPrefix('Hello', 'Re')).toBe('Re: Hello')
    expect(withPrefix('re: Hello', 'Re')).toBe('re: Hello')
  })
})

describe('MailStore', () => {
  let s: MailStore
  let events: string[]
  beforeEach(() => {
    vi.useFakeTimers()
    s = new MailStore('anika@mail.example', { delayMs: 1000 })
    events = []
    s.emit = (e) => events.push(e)
  })
  afterEach(() => {
    s.dispose()
    vi.useRealTimers()
  })

  it('is seeded with folders and counts', () => {
    expect(s.list('inbox').length).toBe(5)
    expect(s.count('inbox')).toBe(5)
    expect(s.list('spam').length).toBe(2)
    expect(s.list('inbox').some((m) => m.attachments.length > 0)).toBe(true)
    expect(s.list('sent').length).toBe(1)
    expect(s.count('drafts')).toBe(0)
  })

  it('rejects empty and invalid recipients without sending', () => {
    const r = s.send({ to: '', subject: 'x', body: '', attachments: [] })
    expect(r.ok).toBe(false)
    expect(s.send({ to: 'nope', subject: 'x', body: '', attachments: [] }).ok).toBe(false)
    expect(events).toEqual([])
    expect(s.list('sent').length).toBe(1)
  })

  it('sends to Sent and an auto-reply arrives after the delay', () => {
    const r = s.send({ to: 'friend@mail.example', subject: 'Hello', body: 'হ্যালো', attachments: [{ name: 'a.txt', size: 3, content: 'abc' }] })
    expect(r.ok).toBe(true)
    expect(s.list('sent')[0].subject).toBe('Hello')
    expect(events).toEqual(['mail-sent'])
    const before = s.list('inbox').length
    vi.advanceTimersByTime(1000)
    expect(events).toEqual(['mail-sent', 'mail-received'])
    const inbox = s.list('inbox')
    expect(inbox.length).toBe(before + 1)
    const reply = inbox.find((m) => m.subject === 'Re: Hello')!
    expect(reply.from).toBe('friend@mail.example')
    expect(reply.read).toBe(false)
    expect(reply.body).toContain('a.txt')
  })

  it('mail to yourself lands in your Inbox', () => {
    s.send({ to: 'anika@mail.example', subject: 'Note to self', body: 'buy rice', attachments: [] })
    vi.advanceTimersByTime(1000)
    const m = s.list('inbox').find((x) => x.subject === 'Note to self')
    expect(m?.body).toBe('buy rice')
    expect(events).toContain('mail-received')
  })

  it('spam, not spam, trash and restore', () => {
    const m = s.list('inbox').find((x) => x.subject === 'Claim your free gift now')!
    s.markSpam(m.id)
    expect(m.folder).toBe('spam')
    expect(events).toContain('mail-spam')
    s.notSpam(m.id)
    expect(m.folder).toBe('inbox')
    s.trash(m.id)
    expect(m.folder).toBe('trash')
    s.restore(m.id)
    expect(m.folder).toBe('inbox')
    s.trash(m.id)
    s.deleteForever(m.id)
    expect(s.get(m.id)).toBeUndefined()
  })

  it('reply and forward prepare drafts', () => {
    const m = s.list('inbox').find((x) => x.attachments.length)!
    const r = s.reply(m.id)!
    expect(r.to).toBe('tanvir.bhai@mail.example')
    expect(r.subject).toBe('Re: Class notes for Saturday')
    expect(r.body).toContain('> ')
    const f = s.forward(m.id)!
    expect(f.to).toBe('')
    expect(f.subject).toBe('Fwd: Class notes for Saturday')
    expect(f.attachments.length).toBe(1)
    expect(events).toEqual(['mail-reply', 'mail-forward'])
  })

  it('drafts are saved, updated and removed on send', () => {
    const id = s.saveDraft({ to: 'a@b.example', subject: 'D', body: '', attachments: [] })
    expect(s.count('drafts')).toBe(1)
    s.saveDraft({ to: 'a@b.example', subject: 'D2', body: '', attachments: [] }, id)
    expect(s.list('drafts')[0].subject).toBe('D2')
    s.send({ to: 'a@b.example', subject: 'D2', body: '', attachments: [] }, id)
    expect(s.count('drafts')).toBe(0)
  })

  it('refuses attachments that are too big', () => {
    const r = s.send({ to: 'a@b.example', subject: 'big', body: '', attachments: [{ name: 'x', size: 30 * 1024 * 1024, content: '' }] })
    expect(r.ok).toBe(false)
  })
})
