import { useState } from 'react'
import { LANGUAGE_CARDS } from './lib/languageCards'

/** Four expandable cards: what each language looks like and what it is good for. */
export default function LanguageCards() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="card space-y-3 p-4" data-testid="language-cards">
      <p className="font-semibold">চারটি নাম, চারটি কাজ — কার্ডে চাপ দিয়ে খুলুন</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {LANGUAGE_CARDS.map((c) => {
          const isOpen = open === c.id
          return (
            <div key={c.id} className="rounded-xl border p-3" style={{ borderColor: isOpen ? 'var(--c-brand)' : 'var(--c-border, #cbd5e1)' }} data-testid={`lang-${c.id}`}>
              <button type="button" className="w-full text-left" aria-expanded={isOpen} aria-controls={`lang-panel-${c.id}`} data-testid={`lang-toggle-${c.id}`} onClick={() => setOpen(isOpen ? null : c.id)}>
                <span className="block text-lg font-bold">{c.nameBn} {isOpen ? '▾' : '▸'}</span>
                <span className="block text-sm" style={{ color: 'var(--c-muted)' }}>{c.taglineBn}</span>
              </button>
              {isOpen && (
                <div id={`lang-panel-${c.id}`} className="mt-2 space-y-2">
                  <pre className="overflow-x-auto rounded-lg p-3 text-sm" style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }} data-testid={`lang-code-${c.id}`}>
                    <code>{c.code}</code>
                  </pre>
                  <p className="text-sm">{c.codeExplainBn}</p>
                  <p className="font-semibold">ভালো কাজে লাগে</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {c.goodForBn.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
