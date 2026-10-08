import { useMemo, useState } from 'react'
import { GLOSSARY } from '../content/glossary'
import { useFmt } from '../ui/useFmt'

export default function Glossary() {
  const [q, setQ] = useState('')
  const { n } = useFmt()
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return GLOSSARY
    return GLOSSARY.filter((g) => [g.termBn, g.termEn, g.meaningBn].some((s) => s.toLowerCase().includes(t)))
  }, [q])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">শব্দকোষ</h1>
      <p className="text-muted">নতুন শব্দের মানে এখানে খুঁজুন — বাংলায় বা ইংরেজিতে লিখতে পারেন।</p>
      <label className="block">
        <span className="sr-only">শব্দ খুঁজুন</span>
        <input className="field" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="শব্দ খুঁজুন… (যেমন: ফোল্ডার / Folder)" />
      </label>
      <p aria-live="polite" className="text-sm text-muted">{n(list.length)}টি শব্দ</p>
      {list.length === 0 ? (
        <p className="card">এই নামে কোনো শব্দ পাওয়া যায়নি। অন্য কোনোভাবে লিখে দেখুন।</p>
      ) : (
        <dl className="space-y-3">
          {list.map((g) => (
            <div key={g.id} className="card">
              <dt className="text-lg font-bold">
                {g.termBn} <span className="font-normal text-muted">({g.termEn})</span>
              </dt>
              <dd className="mt-1">{g.meaningBn}</dd>
              <dd className="mt-1 text-sm text-muted">পাঠ {n(g.module)}-এ শেখানো হয়েছে</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
