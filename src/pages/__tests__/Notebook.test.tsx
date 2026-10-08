import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Notebook from '../Notebook'
import { AddToNotebook } from '../../ui/AddToNotebook'
import { store } from '../../state/store'

const clear = () => store.getSnapshot().notebook.slice().forEach((n) => store.deleteNote(n.id))
const ui = () => (
  <MemoryRouter>
    <Notebook />
  </MemoryRouter>
)

beforeEach(() => {
  vi.useFakeTimers()
  clear()
})
afterEach(() => {
  clear()
  vi.useRealTimers()
})

describe('Notebook page', () => {
  it('creates from a template, autosaves, lists, searches, and deletes with confirm', () => {
    render(ui())
    expect(screen.getByTestId('note-empty')).toBeTruthy()
    fireEvent.click(screen.getByTestId('note-template-error-fix'))
    expect((screen.getByTestId('note-title') as HTMLInputElement).value).toBe('এরর যা পেলাম আর সমাধান')
    fireEvent.change(screen.getByTestId('note-body'), { target: { value: 'NameError: mesage' } })
    act(() => void vi.advanceTimersByTime(500))
    expect(store.getSnapshot().notebook).toHaveLength(1)
    expect(store.getSnapshot().notebook[0].body).toBe('NameError: mesage')
    fireEvent.click(screen.getByTestId('note-done'))
    expect(screen.getAllByTestId('note-item')).toHaveLength(1)

    fireEvent.change(screen.getByTestId('note-search'), { target: { value: 'zzz' } })
    expect(screen.queryAllByTestId('note-item')).toHaveLength(0)
    fireEvent.change(screen.getByTestId('note-search'), { target: { value: 'nameerror' } })
    expect(screen.getAllByTestId('note-item')).toHaveLength(1)

    fireEvent.click(screen.getByTestId('note-delete'))
    expect(store.getSnapshot().notebook).toHaveLength(1)
    fireEvent.click(screen.getByTestId('note-delete-yes'))
    expect(store.getSnapshot().notebook).toHaveLength(0)
  })

  it('editing an existing note updates it instead of duplicating', () => {
    store.upsertNote({ id: 'a', title: 'T', body: 'old' })
    render(ui())
    fireEvent.click(screen.getByTestId('note-open'))
    fireEvent.change(screen.getByTestId('note-body'), { target: { value: 'new' } })
    act(() => void vi.advanceTimersByTime(500))
    expect(store.getSnapshot().notebook).toHaveLength(1)
    expect(store.getSnapshot().notebook[0].body).toBe('new')
  })

  it('an untouched empty new note is not saved', () => {
    render(ui())
    fireEvent.click(screen.getByTestId('note-new'))
    fireEvent.click(screen.getByTestId('note-done'))
    expect(store.getSnapshot().notebook).toHaveLength(0)
  })

  it('exports as a download', () => {
    store.upsertNote({ id: 'a', title: 'T', body: 'b' })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    ;(URL as unknown as { createObjectURL: () => string }).createObjectURL = () => 'blob:x'
    ;(URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL = () => {}
    render(ui())
    fireEvent.click(screen.getByTestId('note-export-md'))
    expect(click).toHaveBeenCalled()
    click.mockRestore()
  })
})

describe('AddToNotebook', () => {
  it('adds one note and updates the same note on repeat clicks', () => {
    render(
      <MemoryRouter>
        <AddToNotebook title="সারকথা" body="- এক" />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByTestId('add-to-notebook'))
    fireEvent.click(screen.getByTestId('add-to-notebook'))
    expect(store.getSnapshot().notebook).toHaveLength(1)
    expect(screen.getByTestId('add-to-notebook-done')).toBeTruthy()
  })
})
