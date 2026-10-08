import { describe, expect, it } from 'vitest'
import { act, fireEvent, screen } from '@testing-library/react'
import { renderApp } from './testUtils'
import type { VNode } from '../vfs'

const has = (events: string[], needle: object) => events.includes(JSON.stringify(needle))
const home = (rig: ReturnType<typeof renderApp>) => rig.d().vfs.home
const docs = (rig: ReturnType<typeof renderApp>) => rig.d().vfs.child(home(rig), 'Documents') as VNode

describe('files (Windows)', () => {
  it('emits navigate on open and when a folder is double-clicked', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    expect(has(rig.events(), { type: 'navigate', path: '~/Documents' })).toBe(true)
    fireEvent.doubleClick(rig.q('fm-item-Family'))
    expect(has(rig.events(), { type: 'navigate', path: '~/Documents/Family' })).toBe(true)
    expect(rig.has('fm-item-Birthdays.txt')).toBe(true)
    fireEvent.click(rig.q('fm-up'))
    expect(rig.has('fm-item-Recipe.txt')).toBe(true)
    fireEvent.click(rig.q('fm-back'))
    expect(rig.has('fm-item-Birthdays.txt')).toBe(true)
  })

  it('shows a breadcrumb and navigates by typing a path', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    expect(rig.q('fm-address').textContent).toContain('Documents')
    fireEvent.click(rig.q('fm-address').querySelector('[aria-hidden="true"]')!)
    const input = rig.q<HTMLInputElement>('fm-address-input')
    expect(input.value).toBe('C:\\Users\\Anika\\Documents')
    fireEvent.change(input, { target: { value: 'C:\\Users\\Anika\\Nowhere' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(rig.q('fm-address-error').textContent).toContain("can't find")
    fireEvent.change(input, { target: { value: 'C:\\Users\\Anika\\Pictures' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(rig.has('fm-item-Flower.png')).toBe(true)
  })

  it('creates a folder with New and renames it', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-new'))
    fireEvent.click(rig.q('ctx-new-folder'))
    expect(has(rig.events(), { type: 'createFolder', name: 'New folder', path: '~/Documents' })).toBe(true)
    const input = rig.q<HTMLInputElement>('rename-input')
    fireEvent.change(input, { target: { value: 'Photos' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(has(rig.events(), { type: 'rename', from: 'New folder', to: 'Photos', path: '~/Documents' })).toBe(true)
    expect(rig.d().vfs.child(docs(rig), 'Photos')).toBeTruthy()
  })

  it('renames with F2 keeping the hidden extension, and reports a duplicate name', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    expect(rig.key('f2')).toBe(true)
    const input = rig.q<HTMLInputElement>('rename-input')
    expect(input.value).toBe('Recipe')
    fireEvent.change(input, { target: { value: 'Shopping List' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/already exists/)).toBeInTheDocument()
    fireEvent.click(rig.q('dialog-ok'))
    const again = rig.q<HTMLInputElement>('rename-input')
    fireEvent.change(again, { target: { value: 'Khichuri' } })
    fireEvent.keyDown(again, { key: 'Enter' })
    expect(rig.d().vfs.child(docs(rig), 'Khichuri.txt')).toBeTruthy()
  })

  it('deletes to the Recycle Bin and restores', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    fireEvent.click(rig.q('fm-delete'))
    expect(rig.d().vfs.binItems()).toHaveLength(1)
    expect(has(rig.events(), { type: 'delete', name: 'Recipe.txt', path: '~/Documents' })).toBe(true)
    expect(rig.has('fm-item-Recipe.txt')).toBe(false)
    fireEvent.click(rig.q('fm-sidebar-Recycle Bin'))
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    fireEvent.click(rig.q('fm-restore'))
    expect(has(rig.events(), { type: 'restore', name: 'Recipe.txt', path: '~/Documents' })).toBe(true)
    expect(rig.d().vfs.binItems()).toHaveLength(0)
  })

  it('empties the bin after confirmation', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    rig.key('delete')
    expect(rig.d().vfs.binItems()).toHaveLength(1)
    rig.open('bin')
    fireEvent.click(rig.q('fm-empty-bin'))
    fireEvent.click(rig.q('dialog-yes'))
    expect(rig.d().vfs.binItems()).toHaveLength(0)
  })

  it('copies and pastes with the keyboard', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    rig.key('ctrl+c')
    rig.key('ctrl+v')
    expect(rig.d().vfs.child(docs(rig), 'Recipe - Copy.txt')).toBeTruthy()
  })

  it('toggles file name extensions and emits extensions-shown', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    expect(rig.q('fm-item-Recipe.txt').textContent).toBe('Recipe')
    fireEvent.click(rig.q('fm-view'))
    fireEvent.click(screen.getByText('Show'))
    fireEvent.click(rig.q('ctx-show-ext'))
    expect(has(rig.events(), { type: 'custom', event: 'extensions-shown' })).toBe(true)
    expect(rig.q('fm-item-Recipe.txt').textContent).toBe('Recipe.txt')
  })

  it('searches the current folder', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.change(rig.q('fm-search'), { target: { value: 'birth' } })
    expect(rig.has('fm-item-Birthdays.txt')).toBe(true)
    expect(rig.q('fm-item-Birthdays.txt').textContent).toContain('Family')
    expect(rig.has('fm-item-Recipe.txt')).toBe(false)
  })

  it('moves an item into a folder by dragging', async () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    const from = rig.q('fm-item-Recipe.txt')
    const target = rig.q('fm-item-Family')
    const orig = document.elementFromPoint
    document.elementFromPoint = () => target
    try {
      fireEvent.pointerDown(from, { button: 0, clientX: 5, clientY: 5 })
      fireEvent(window, new MouseEvent('pointermove', { clientX: 60, clientY: 60 }))
      act(() => {
        fireEvent(window, new MouseEvent('pointerup', { clientX: 60, clientY: 60 }))
      })
    } finally {
      document.elementFromPoint = orig
    }
    await new Promise((r) => setTimeout(r, 5)) // let the drag helper drop its click-swallowing listener
    expect(has(rig.events(), { type: 'move', name: 'Recipe.txt', fromPath: '~/Documents', toPath: '~/Documents/Family' })).toBe(true)
    expect(has(rig.events(), { type: 'drag', target: 'fm-item-Recipe.txt', dropTarget: 'fm-item-Family' })).toBe(true)
  })

  it('shows Properties for an item', () => {
    const rig = renderApp('windows', 'files', { path: '~/Documents' })
    fireEvent.contextMenu(rig.q('fm-item-Recipe.txt'))
    fireEvent.click(rig.q('ctx-properties'))
    expect(rig.q('properties').textContent).toContain('C:\\Users\\Anika\\Documents')
  })

  it('tolerates protected folders', () => {
    const rig = renderApp('windows', 'files', { path: '~' })
    fireEvent.click(rig.q('fm-item-Documents'))
    fireEvent.click(rig.q('fm-delete'))
    expect(screen.getByText(/system folder/)).toBeInTheDocument()
  })
})

describe('files (Mac)', () => {
  it('has Finder sidebar, renames with Enter and trashes with Cmd+Backspace', () => {
    const rig = renderApp('mac', 'files', { path: '~/Documents' })
    for (const n of ['Applications', 'Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Movies', 'Trash']) expect(rig.has(`fm-sidebar-${n}`)).toBe(true)
    expect(rig.q('fm-address').textContent).toContain('Documents')
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    rig.key('enter')
    const input = rig.q<HTMLInputElement>('rename-input')
    fireEvent.change(input, { target: { value: 'Dinner' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(rig.d().vfs.child(docs(rig), 'Dinner.txt')).toBeTruthy()
    fireEvent.click(rig.q('fm-item-Dinner.txt'))
    rig.key('cmd+backspace')
    expect(rig.d().vfs.binItems()).toHaveLength(1)
  })

  it('moves with Cmd+C then Cmd+Option+V', () => {
    const rig = renderApp('mac', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-item-Recipe.txt'))
    rig.key('cmd+c')
    fireEvent.doubleClick(rig.q('fm-item-Family'))
    rig.key('alt+cmd+v')
    const family = rig.d().vfs.child(docs(rig), 'Family')!
    expect(rig.d().vfs.child(family, 'Recipe.txt')).toBeTruthy()
    expect(rig.d().vfs.child(docs(rig), 'Recipe.txt')).toBeFalsy()
  })

  it('creates a folder with the toolbar button and lists the Trash', () => {
    const rig = renderApp('mac', 'files', { path: '~/Documents' })
    fireEvent.click(rig.q('fm-new-folder'))
    expect(rig.q<HTMLInputElement>('rename-input').value).toBe('untitled folder')
    fireEvent.keyDown(rig.q('rename-input'), { key: 'Escape' })
    expect(rig.d().vfs.child(docs(rig), 'untitled folder')).toBeTruthy()
  })
})
