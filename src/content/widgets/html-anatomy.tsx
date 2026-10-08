import { useState } from 'react'
import { CSS_PARTS, HTML_PARTS } from './lib/m20Logic'

/** Click the pieces of a line of HTML (or of a CSS rule) to see what each part is called. */
export default function HtmlAnatomy({ mode = 'html' }: { mode?: 'html' | 'css' }) {
  const parts = mode === 'css' ? CSS_PARTS : HTML_PARTS
  const [sel, setSel] = useState(parts[0].id)
  const cur = parts.find((p) => p.id === sel) ?? parts[0]
  return (
    <div className="card space-y-3 p-4" data-testid="html-anatomy" data-mode={mode}>
      <p className="font-semibold">{mode === 'css' ? 'একটি CSS নিয়মের অংশগুলো' : 'একটি লিংকের অংশগুলো'}: প্রতিটি অংশে ক্লিক করে দেখুন</p>
      <div className="flex flex-wrap items-center gap-1 rounded-xl p-3 font-mono text-lg" style={{ background: 'var(--c-sunken)' }}>
        {parts.map((p) => (
          <button key={p.id} type="button" aria-pressed={sel === p.id} data-part={p.id} onClick={() => setSel(p.id)} className="btn btn-outline whitespace-pre font-mono" style={sel === p.id ? { borderWidth: 3 } : undefined}>
            {p.text}
          </button>
        ))}
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-live="polite" data-testid="html-anatomy-info">
        <p className="font-semibold">{cur.titleBn}</p>
        <p className="mt-1 text-sm">{cur.detailBn}</p>
      </div>
    </div>
  )
}
