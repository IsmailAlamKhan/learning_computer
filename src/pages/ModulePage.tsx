import { Link, useParams } from 'react-router-dom'
import { getModule } from '../content/modules'
import { moduleState } from '../engine/roadmap'
import { useProgress } from '../state/store'

export default function ModulePage() {
  const { id } = useParams()
  const data = useProgress()
  const m = getModule(Number(id))
  if (!m) {
    return (
      <div className="card space-y-3">
        <h1 className="text-xl font-bold">এই পাঠটি খুঁজে পাওয়া যায়নি</h1>
        <Link to="/" className="btn">← হোমে ফিরুন</Link>
      </div>
    )
  }
  const state = moduleState(m, data)
  return (
    <div className="card space-y-4">
      <p className="text-muted">পাঠ {m.module}</p>
      <h1 className="text-2xl font-bold">{m.icon} {m.titleBn}</h1>
      <p>{m.oneLineBn}</p>
      <p className="rounded-xl bg-accent-soft p-4">
        {state === 'locked' ? 'আগের পাঠটি শেষ করলে এটি খুলবে।' : 'এই পাঠটি শীঘ্রই আসছে।'}
      </p>
      <Link to="/" className="btn btn-outline">← হোমে ফিরুন</Link>
    </div>
  )
}
