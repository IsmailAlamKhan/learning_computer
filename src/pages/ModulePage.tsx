import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getModule } from '../content/modules'
import { hasLesson, loadLesson } from '../content/lessons'
import { moduleState } from '../engine/roadmap'
import type { Lesson } from '../engine/types'
import { store, useProgress } from '../state/store'
import { useFmt } from '../ui/useFmt'
import DeckPage from './DeckPage'

function Soon({ n }: { n: number }) {
  const m = getModule(n)!
  const { n: f } = useFmt()
  const data = useProgress()
  const locked = moduleState(m, data) === 'locked'
  return (
    <div className="card space-y-4">
      <p className="text-muted">পাঠ {f(m.module)}</p>
      <h1 className="text-2xl font-bold">
        {m.icon} {m.titleBn}
      </h1>
      <p>{m.oneLineBn}</p>
      <p className="rounded-xl p-4" style={{ background: 'var(--c-accent-soft)' }}>
        {locked ? 'আগের পাঠটি শেষ করলে এটি খুলবে।' : 'এই পাঠটি শীঘ্রই আসছে।'}
      </p>
      <Link to="/" className="btn btn-outline">
        ← হোমে ফিরুন
      </Link>
    </div>
  )
}

export default function ModulePage() {
  const { id } = useParams()
  const n = Number(id)
  const m = getModule(n)
  const data = useProgress()
  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined)

  useEffect(() => {
    setLesson(undefined)
    if (!m || !hasLesson(n)) return setLesson(null)
    let alive = true
    loadLesson(n).then((l) => alive && setLesson(l))
    return () => {
      alive = false
    }
  }, [n, m])

  useEffect(() => {
    if (m && hasLesson(n)) store.visitModule(n)
  }, [n, m])

  if (!m) {
    return (
      <div className="card space-y-3">
        <h1 className="text-xl font-bold">এই পাঠটি খুঁজে পাওয়া যায়নি</h1>
        <Link to="/" className="btn">
          ← হোমে ফিরুন
        </Link>
      </div>
    )
  }
  const state = moduleState(m, data)
  if (lesson === undefined) return <p>পাঠ লোড হচ্ছে…</p>
  if (lesson === null || state === 'locked' || state === 'soon') return <Soon n={n} />
  return <DeckPage key={n} lesson={lesson} />
}
