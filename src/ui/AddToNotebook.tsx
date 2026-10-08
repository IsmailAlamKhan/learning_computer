import { useState } from 'react'
import { Link } from 'react-router-dom'
import { store } from '../state/store'
import { newNoteId } from '../lib/notebook'

/** Small reusable button: saves `title` + `body` as a new note in the personal notebook (নোটবুক). */
export function AddToNotebook({ title, body, label = '📓 নোটবুকে যোগ করুন' }: { title: string; body: string; label?: string }) {
  const [id, setId] = useState<string | null>(null)
  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <button
        type="button"
        className="btn btn-outline"
        data-testid="add-to-notebook"
        onClick={() => {
          const nid = id ?? newNoteId()
          store.upsertNote({ id: nid, title, body })
          setId(nid)
        }}
      >
        {label}
      </button>
      {id && (
        <span role="status" data-testid="add-to-notebook-done">
          ✓ নোটবুকে রাখা হয়েছে। <Link to="/notebook" className="underline">নোটবুক খুলুন</Link>
        </span>
      )}
    </div>
  )
}
