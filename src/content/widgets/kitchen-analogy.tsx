import { useState } from 'react'
import { ROLES } from './lib/ioFlow'

export default function KitchenAnalogy() {
  const [id, setId] = useState<string | null>(null)
  const role = ROLES.find((r) => r.id === id)
  return (
    <div className="card space-y-3 p-4" data-testid="kitchen-analogy">
      <p className="font-semibold">কম্পিউটারের অংশ ক্লিক করে দেখুন — রান্নাঘরে ও লাইব্রেরিতে এটি কে?</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Computer parts">
        {ROLES.map((r) => (
          <button key={r.id} type="button" className={`btn ${r.id === id ? '' : 'btn-outline'}`} aria-pressed={r.id === id} data-testid={`kitchen-${r.id}`} onClick={() => setId(r.id)}>
            <span aria-hidden="true">{r.icon} </span>
            {r.partBn} ({r.partEn})
          </button>
        ))}
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-live="polite" data-testid="kitchen-detail">
        {role ? (
          <div className="space-y-1">
            <p><strong>🍳 রান্নাঘরে:</strong> {role.kitchenBn}</p>
            <p><strong>📚 লাইব্রেরিতে:</strong> {role.libraryBn}</p>
          </div>
        ) : (
          <p style={{ color: 'var(--c-muted)' }}>ওপরের যেকোনো একটি বোতামে ক্লিক করুন।</p>
        )}
      </div>
    </div>
  )
}
