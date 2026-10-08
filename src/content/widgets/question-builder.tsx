import { useState } from 'react'
import { QUESTION_FIELDS, buildQuestion, emptyParts, findPrivateInfo, missingParts, type QuestionParts } from './lib/m19Logic'

/** A guided form that builds a well-formed help request she can copy. */
export default function QuestionBuilder() {
  const [p, setP] = useState<QuestionParts>(emptyParts())
  const [copied, setCopied] = useState(false)
  const missing = missingParts(p)
  const text = buildQuestion(p)
  const priv = findPrivateInfo(text)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="card space-y-4 p-4" data-testid="question-builder">
      <p className="font-semibold">ভালো প্রশ্ন বানাই — ঘরগুলো ভরুন</p>
      {QUESTION_FIELDS.map((f) => (
        <label key={f.id} className="block">
          <span className="font-semibold">{f.labelBn}</span>
          <span className="block text-sm text-muted">{f.helpBn}</span>
          {f.multiline ? (
            <textarea className="mt-1 min-h-20 w-full rounded-xl border-2 p-3 font-mono text-sm" style={{ borderColor: 'var(--c-line)' }} value={p[f.id] ?? ''} onChange={(e) => (setCopied(false), setP({ ...p, [f.id]: e.target.value }))} data-testid={`qb-${f.id}`} />
          ) : (
            <input className="mt-1 min-h-12 w-full rounded-xl border-2 px-3" style={{ borderColor: 'var(--c-line)' }} value={p[f.id] ?? ''} onChange={(e) => (setCopied(false), setP({ ...p, [f.id]: e.target.value }))} data-testid={`qb-${f.id}`} />
          )}
        </label>
      ))}
      {priv.length > 0 && (
        <p role="alert" className="rounded-xl p-3" style={{ background: 'var(--c-accent-soft)' }} data-testid="qb-private">
          ⚠️ লেখায় ব্যক্তিগত তথ্য থাকতে পারে ({priv.join(', ')})। অন্যকে পাঠানোর আগে সেটি মুছে দিন বা বদলে দিন।
        </p>
      )}
      {missing.length > 0 ? (
        <p className="text-muted" data-testid="qb-missing">প্রথম তিনটি ঘর ভরলে আপনার প্রশ্ন তৈরি হয়ে যাবে।</p>
      ) : (
        <div className="space-y-2">
          <p className="font-semibold">আপনার প্রশ্ন (কপি করার জন্য তৈরি):</p>
          <pre className="overflow-auto whitespace-pre-wrap rounded-xl p-3 text-sm" style={{ background: 'var(--c-sunken)' }} data-testid="qb-output">{text}</pre>
          <button type="button" className="btn" onClick={copy} data-testid="qb-copy">📋 কপি করুন</button>
          {copied && <span role="status" className="ml-2">✓ কপি হয়েছে</span>}
        </div>
      )}
    </div>
  )
}
