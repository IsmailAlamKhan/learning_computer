import { describe, expect, it } from 'vitest'
import { NOTE_TEMPLATES, displayTitle, exportNotes, newNoteId, searchNotes, sortNewest, summaryToNote } from './notebook'
import type { NotebookNote } from '../state/progress'

const n = (id: string, title: string, body: string, updatedAt: string): NotebookNote => ({ id, title, body, updatedAt })
const notes = [n('1', 'পুরনো', 'NameError notes', '2026-01-01T00:00:00Z'), n('2', 'নতুন', 'timeout কী', '2026-03-01T00:00:00Z'), n('3', '', 'শুধু বডি', '2026-02-01T00:00:00Z')]

describe('notebook helpers', () => {
  it('has the four templates', () => {
    expect(NOTE_TEMPLATES.map((t) => t.titleBn)).toEqual(['নতুন শব্দ শিখলাম', 'এরর যা পেলাম আর সমাধান', 'প্রশ্ন যা করতে চাই', 'কমান্ড চিট-নোট'])
  })
  it('sorts newest first without mutating', () => {
    expect(sortNewest(notes).map((x) => x.id)).toEqual(['2', '3', '1'])
    expect(notes[0].id).toBe('1')
  })
  it('searches title and body, case-insensitively', () => {
    expect(searchNotes(notes, 'nameerror').map((x) => x.id)).toEqual(['1'])
    expect(searchNotes(notes, 'নতুন').map((x) => x.id)).toEqual(['2'])
    expect(searchNotes(notes, '  ')).toHaveLength(3)
  })
  it('falls back to the first body line as title', () => {
    expect(displayTitle(notes[2])).toBe('শুধু বডি')
    expect(displayTitle(n('x', '', '', ''))).toBe('নামহীন নোট')
  })
  it('exports markdown and txt', () => {
    const md = exportNotes(notes, 'md', new Date('2026-04-01T00:00:00Z'))
    expect(md).toContain('# আমার প্রোগ্রামিং নোটবুক')
    expect(md.indexOf('## নতুন')).toBeLessThan(md.indexOf('## পুরনো'))
    const txt = exportNotes(notes, 'txt', new Date('2026-04-01T00:00:00Z'))
    expect(txt).toContain('==== নতুন (2026-03-01) ====')
    expect(txt).not.toContain('##')
    expect(exportNotes([], 'md')).toContain('0টি নোট')
  })
  it('converts a summary card to a note and makes unique ids', () => {
    expect(summaryToNote('সারকথা', ['এক', 'দুই'], 'শেষ')).toEqual({ title: 'সারকথা', body: '- এক\n- দুই\n\nশেষ' })
    expect(newNoteId()).not.toBe(newNoteId())
  })
})
