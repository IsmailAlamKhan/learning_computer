import { Link, useParams } from 'react-router-dom'
import { CHEATSHEETS, getCheatSheet } from '../content/cheatsheets'

export function CheatSheetList() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ছাপার উপযোগী চিট শিট</h1>
      <p className="text-muted">যেকোনোটি খুলে “ছাপুন” বোতামে চাপুন। A4 কাগজে সুন্দর করে ছাপা হবে।</p>
      {CHEATSHEETS.length === 0 && <p className="card">এখনো কোনো চিট শিট নেই।</p>}
      <ul className="space-y-2">
        {CHEATSHEETS.map((c) => (
          <li key={c.id}>
            <Link className="card block hover:border-brand" to={`/cheatsheet/${c.id}`}>
              {c.titleBn}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CheatSheetPage() {
  const { id } = useParams()
  const sheet = id ? getCheatSheet(id) : undefined
  if (!sheet) return <p className="card">এই চিট শিটটি পাওয়া যায়নি। <Link className="underline" to="/cheatsheets">সব চিট শিট দেখুন</Link></p>
  const C = sheet.Component
  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-3">
        <Link to="/cheatsheets" className="btn btn-outline">← সব চিট শিট</Link>
        <button className="btn" onClick={() => window.print()}>🖨️ ছাপুন</button>
      </div>
      <article className="cheatsheet">
        <h1 className="mb-3 text-2xl font-bold">{sheet.titleBn}</h1>
        <C />
      </article>
    </div>
  )
}
