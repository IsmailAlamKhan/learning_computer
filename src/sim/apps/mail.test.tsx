import { describe, expect, it } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'

const has = (events: string[], event: string) => events.includes(JSON.stringify({ type: 'custom', event }))

describe('mail app', () => {
  it('opens on both systems with an address and folders', () => {
    for (const os of ['windows', 'mac'] as const) {
      const rig = renderApp(os, 'mail')
      expect(rig.q('mail-address').textContent).toBe('anika@mail.example')
      for (const f of ['Inbox', 'Sent', 'Drafts', 'Spam', 'Trash']) expect(rig.has(`mail-folder-${f}`)).toBe(true)
    }
  })

  it('composes with an attachment, validates, sends and receives the reply', () => {
    const rig = renderApp('windows', 'mail')
    fireEvent.click(rig.q('mail-compose'))
    fireEvent.click(rig.q('mail-send'))
    expect(rig.q('mail-error').textContent).toMatch(/To box/)
    fireEvent.change(rig.q('mail-to'), { target: { value: 'oops' } })
    fireEvent.click(rig.q('mail-send'))
    expect(rig.q('mail-error').textContent).toMatch(/@/)
    fireEvent.change(rig.q('mail-to'), { target: { value: 'friend@mail.example' } })
    fireEvent.change(rig.q('mail-subject'), { target: { value: 'Hello' } })
    fireEvent.change(rig.q('mail-body'), { target: { value: 'আপনি কেমন আছেন?' } })
    expect(has(rig.events(), 'mail-body-typed')).toBe(true)
    fireEvent.click(rig.q('mail-attach'))
    fireEvent.click(rig.q('mail-picker-file-Recipe.txt'))
    fireEvent.click(rig.q('mail-picker-attach'))
    expect(has(rig.events(), 'mail-attach:Recipe.txt')).toBe(true)
    expect(rig.has('mail-chip-Recipe.txt')).toBe(true)
    fireEvent.click(rig.q('mail-send'))
    expect(has(rig.events(), 'mail-sent')).toBe(true)
    fireEvent.click(rig.q('mail-folder-Sent'))
    expect(rig.has('mail-msg-Hello')).toBe(true)
    expect(rig.has('mail-compose')).toBe(true)
  })

  it('saves an attachment to Downloads and moves spam', () => {
    const rig = renderApp('mac', 'mail')
    fireEvent.click(rig.q('mail-msg-Class notes for Saturday'))
    act(() => {
      fireEvent.click(rig.q('mail-save-attachment-Class-Notes.txt'))
    })
    expect(rig.d().vfs.resolve('~/Downloads/Class-Notes.txt')?.content).toContain('name@domain')
    expect(has(rig.events(), 'mail-save-attachment')).toBe(true)
    fireEvent.click(rig.q('mail-msg-Claim your free gift now'))
    fireEvent.click(rig.q('mail-spam'))
    expect(has(rig.events(), 'mail-spam')).toBe(true)
    fireEvent.click(rig.q('mail-folder-Spam'))
    fireEvent.click(rig.q('mail-msg-Claim your free gift now'))
    fireEvent.click(rig.q('mail-notspam'))
    expect(has(rig.events(), 'mail-notspam')).toBe(true)
  })
})
