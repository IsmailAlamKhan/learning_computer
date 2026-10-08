import { useState } from 'react'
import { ERROR_SAMPLES, type ErrorLine } from './lib/m19Logic'

const ROLE_BN: Record<ErrorLine['role'], string> = { header: 'শিরোনাম', where: 'কোথায়', code: 'আপনার কোড', key: 'আসল বার্তা', info: 'পথের তথ্য' }

/** A realistic Python traceback and a JavaScript console error; click any line to read what it means. */
export default function ErrorReader() {
  const [sampleId, setSampleId] = useState<'python' | 'javascript'>('python')
  const [sel, setSel] = useState<string | null>(null)
  const sample = ERROR_SAMPLES.find((s) => s.id === sampleId)!
  const line = sample.lines.find((l) => l.id === sel)
  return (
    <div className="card space-y-3 p-4" data-testid="error-reader">
      <p className="font-semibold">শান্ত মনে এরর পড়ি — যেকোনো লাইনে ক্লিক করুন</p>
      <div className="flex flex-wrap gap-2" role="tablist">
        {ERROR_SAMPLES.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={sampleId === s.id} className={sampleId === s.id ? 'btn' : 'btn btn-outline'} onClick={() => (setSampleId(s.id), setSel(null))} data-testid={`er-tab-${s.id}`}>
            {s.titleBn}
          </button>
        ))}
      </div>
      <div className="overflow-auto rounded-xl p-2 font-mono text-sm" style={{ background: '#1e1e2e', color: '#e6e6f0' }}>
        {sample.lines.map((l) => (
          <button key={l.id} type="button" className="block w-full whitespace-pre rounded px-2 py-2 text-left" style={{ background: sel === l.id ? '#3b3b5c' : 'transparent', color: l.role === 'key' ? '#ffb4b4' : 'inherit', minHeight: 44 }} onClick={() => setSel(l.id)} data-testid={`er-line-${l.id}`} aria-pressed={sel === l.id}>
            {l.text}
          </button>
        ))}
      </div>
      {line ? (
        <div className="space-y-1 rounded-xl p-3" style={{ background: 'var(--c-brand-soft)' }} role="status" data-testid="er-note">
          <p className="text-sm font-bold">{ROLE_BN[line.role]}</p>
          <p>{line.noteBn}</p>
        </div>
      ) : (
        <p className="text-muted" data-testid="er-hint">ক্রম: কী ঘটেছে → কোথায় (ফাইল/লাইন) → কী আশা করা হয়েছিল বা পাওয়া গেছে।</p>
      )}
    </div>
  )
}
