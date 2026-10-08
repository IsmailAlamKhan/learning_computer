import { describe, expect, it } from 'vitest'
import { act, fireEvent, screen } from '@testing-library/react'
import { renderApp } from './testUtils'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))

describe('editor', () => {
  it('types, Save As creates a file, and the title/dirty state follow', () => {
    const rig = renderApp('windows', 'editor')
    const ta = rig.q<HTMLTextAreaElement>('editor-text')
    expect(rig.d().wm.windows[0].title).toBe('Untitled - Notepad')
    fireEvent.change(ta, { target: { value: 'আমার প্রথম লেখা' } })
    expect(has(rig.events(), { type: 'custom', event: 'editor-dirty' })).toBe(true)
    expect(rig.d().wm.windows[0].title).toBe('*Untitled - Notepad')
    fireEvent.click(rig.q('editor-menu-file'))
    fireEvent.click(rig.q('editor-save'))
    // no file yet -> Save As dialog, Documents by default
    const name = rig.q<HTMLInputElement>('save-dialog-name')
    expect(name.value).toBe('Untitled.txt')
    fireEvent.click(rig.q('save-dialog-folder-Family'))
    fireEvent.click(rig.q('save-dialog-up'))
    fireEvent.change(name, { target: { value: 'Note' } })
    fireEvent.click(rig.q('save-dialog-save'))
    const vfs = rig.d().vfs
    const file = vfs.resolve('~/Documents/Note.txt')
    expect(file?.content).toBe('আমার প্রথম লেখা')
    expect(has(rig.events(), { type: 'createFile', name: 'Note.txt', path: '~/Documents' })).toBe(true)
    expect(has(rig.events(), { type: 'saveFile', name: 'Note.txt', path: '~/Documents' })).toBe(true)
    expect(has(rig.events(), { type: 'custom', event: 'editor-saved' })).toBe(true)
    expect(rig.d().wm.windows[0].title).toBe('Note.txt - Notepad')
  })

  it('Ctrl+S saves an opened file in place; Save As asks before replacing', () => {
    const rig = renderApp('windows')
    const f = rig.d().vfs.resolve('~/Documents/Recipe.txt')!
    rig.open('editor', { nodeId: f.id })
    const ta = rig.q<HTMLTextAreaElement>('editor-text')
    expect(ta.value).toContain('Khichuri')
    fireEvent.change(ta, { target: { value: 'changed' } })
    expect(rig.key('ctrl+s')).toBe(true)
    expect(f.content).toBe('changed')
    expect(rig.has('save-dialog')).toBe(false)
    rig.key('ctrl+shift+s')
    fireEvent.change(rig.q('save-dialog-name'), { target: { value: 'Shopping List.txt' } })
    fireEvent.click(rig.q('save-dialog-save'))
    expect(screen.getByText(/Do you want to replace it/)).toBeInTheDocument()
    fireEvent.click(rig.q('dialog-yes'))
    expect(rig.d().vfs.resolve('~/Documents/Shopping List.txt')?.content).toBe('changed')
  })

  it('asks to save before closing a dirty window', () => {
    const rig = renderApp('windows', 'editor')
    fireEvent.change(rig.q('editor-text'), { target: { value: 'x' } })
    act(() => rig.d().closeWindow('editor'))
    expect(rig.d().wm.windows).toHaveLength(1)
    fireEvent.click(rig.q('dialog-cancel'))
    expect(rig.d().wm.windows).toHaveLength(1)
    act(() => rig.d().closeWindow('editor'))
    fireEvent.click(rig.q('dialog-dont-save'))
    expect(rig.d().wm.windows).toHaveLength(0)
  })

  it('Mac: Plain Text, Save with Cmd+S defaults to .txt', () => {
    const rig = renderApp('mac', 'editor')
    expect(rig.d().wm.windows[0].title).toBe('Untitled')
    fireEvent.change(rig.q('editor-text'), { target: { value: 'hi' } })
    expect(rig.d().wm.windows[0].title).toBe('Untitled — Edited')
    rig.key('cmd+s')
    expect(rig.q<HTMLInputElement>('save-dialog-name').value).toBe('Untitled')
    fireEvent.click(rig.q('save-dialog-save'))
    expect(rig.d().vfs.resolve('~/Documents/Untitled.txt')?.content).toBe('hi')
    expect(rig.d().wm.windows[0].title).toBe('Untitled.txt')
  })

  it('shows an error for invalid names', () => {
    const rig = renderApp('windows', 'editor')
    fireEvent.change(rig.q('editor-text'), { target: { value: 'x' } })
    rig.key('ctrl+s')
    fireEvent.change(rig.q('save-dialog-name'), { target: { value: 'a:b.txt' } })
    fireEvent.click(rig.q('save-dialog-save'))
    expect(screen.getByText(/can’t contain/)).toBeInTheDocument()
  })
})
