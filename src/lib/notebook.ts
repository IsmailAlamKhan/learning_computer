import type { NotebookNote } from '../state/progress'

export interface NoteTemplate {
  id: string
  titleBn: string
  body: string
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
  { id: 'new-word', titleBn: 'নতুন শব্দ শিখলাম', body: 'শব্দ (English):\nবাংলা অর্থ:\nকোথায় দেখলাম:\nআমার নিজের একটি উদাহরণ:\n' },
  { id: 'error-fix', titleBn: 'এরর যা পেলাম আর সমাধান', body: 'এরর মেসেজ (হুবহু):\n\nকোথায় হয়েছিল (ফাইল / লাইন):\n\nকারণ কী ছিল:\n\nকীভাবে ঠিক করলাম:\n' },
  { id: 'question', titleBn: 'প্রশ্ন যা করতে চাই', body: 'আমি কী করতে চাই:\n\nআমি কী করেছি:\n\nকী ঘটল:\n\nহুবহু এরর:\n\nকী কী চেষ্টা করেছি:\n' },
  { id: 'cheat', titleBn: 'কমান্ড চিট-নোট', body: 'কমান্ড | কী করে\n--- | ---\nls (Mac) / dir (Windows) | ফোল্ডারের ভেতরের ফাইল দেখায়\ncd ফোল্ডার | ফোল্ডারে ঢোকে\n' },
]

export const emptyTitle = 'নামহীন নোট'
export const displayTitle = (n: Pick<NotebookNote, 'title' | 'body'>) => n.title.trim() || n.body.trim().split('\n')[0]?.slice(0, 60) || emptyTitle

export function newNoteId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `n-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const norm = (s: string) => s.normalize('NFC').toLowerCase()

export function searchNotes(notes: NotebookNote[], query: string): NotebookNote[] {
  const q = norm(query.trim())
  if (!q) return notes
  return notes.filter((n) => norm(n.title).includes(q) || norm(n.body).includes(q))
}

/** Newest first (by updatedAt; stable for ties). */
export function sortNewest(notes: NotebookNote[]): NotebookNote[] {
  return notes.map((n, i) => ({ n, i })).sort((a, b) => (a.n.updatedAt < b.n.updatedAt ? 1 : a.n.updatedAt > b.n.updatedAt ? -1 : b.i - a.i)).map((x) => x.n)
}

export type ExportFormat = 'md' | 'txt'

/** All notes as one Markdown (or plain) text file. */
export function exportNotes(notes: NotebookNote[], format: ExportFormat = 'md', now = new Date()): string {
  const sorted = sortNewest(notes)
  const head = format === 'md' ? `# আমার প্রোগ্রামিং নোটবুক\n\nএক্সপোর্ট: ${now.toISOString().slice(0, 10)} · ${sorted.length}টি নোট\n` : `আমার প্রোগ্রামিং নোটবুক\nএক্সপোর্ট: ${now.toISOString().slice(0, 10)} - ${sorted.length}টি নোট\n`
  const parts = sorted.map((n) => {
    const date = n.updatedAt ? n.updatedAt.slice(0, 10) : ''
    return format === 'md' ? `## ${displayTitle(n)}\n\n_${date}_\n\n${n.body.trim()}\n` : `==== ${displayTitle(n)} (${date}) ====\n${n.body.trim()}\n`
  })
  return [head, ...parts].join(format === 'md' ? '\n---\n\n' : '\n')
}

export function formatNoteDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  try {
    return d.toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso.slice(0, 16).replace('T', ' ')
  }
}
