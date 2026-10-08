import { useState } from 'react'
import { TOOL_CARDS } from './lib/m18Logic'

export default function ToolMap() {
  const [sel, setSel] = useState('editor')
  const card = TOOL_CARDS.find((c) => c.id === sel)!
  return (
    <div className="card space-y-3 p-4" data-testid="tool-map">
      <p className="font-semibold">পাঁচটি নাম — প্রতিটিতে ক্লিক করে দেখুন কোনটি কী কাজ করে</p>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TOOL_CARDS.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={sel === c.id} data-testid={`tool-${c.id}`} onClick={() => setSel(c.id)} className="btn btn-outline" style={sel === c.id ? { borderWidth: 3 } : undefined}>
            {c.name}
          </button>
        ))}
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-live="polite" data-testid="tool-info">
        <p className="m-0 font-semibold">{card.roleBn}</p>
        <p className="m-0 mt-1 text-sm">{card.analogyBn}</p>
        <p className="m-0 mt-2 text-sm font-semibold" data-testid="tool-now">
          {card.needNow ? 'এখন ইনস্টল করব।' : 'এখন ইনস্টল না করলেও চলবে — পরে লাগবে।'}
        </p>
      </div>
    </div>
  )
}
