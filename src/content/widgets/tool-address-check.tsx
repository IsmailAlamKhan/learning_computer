import { useState } from 'react'
import { diffPositions, OFFICIAL, PYTHON_CASES } from './lib/m18Logic'

export default function ToolAddressCheck() {
  const [picked, setPicked] = useState<string | null>(null)
  const official = OFFICIAL[1]
  return (
    <div className="card space-y-3 p-4" data-testid="tool-address-check">
      <p className="font-semibold">কোনটি Python-এর আসল ঠিকানা? একটিতে ক্লিক করুন, তারপর অক্ষর ধরে ধরে মিলিয়ে দেখুন।</p>
      <p className="text-sm">
        আসল ঠিকানাগুলো: <span className="font-mono">{OFFICIAL.join(' · ')}</span>
      </p>
      <ul className="m-0 list-none space-y-2 p-0">
        {PYTHON_CASES.map((c) => {
          const diff = new Set(diffPositions(official, c.address))
          const shown = picked !== null
          return (
            <li key={c.id}>
              <button type="button" className="btn btn-outline w-full text-left" data-testid={`addr-${c.id}`} aria-pressed={picked === c.id} onClick={() => setPicked(c.id)}>
                <span className="font-mono text-lg">
                  {[...c.address].map((ch, i) => (
                    <span key={i} style={shown && diff.has(i) ? { background: 'var(--c-warn-bg, #fde68a)', fontWeight: 700 } : undefined}>
                      {ch}
                    </span>
                  ))}
                </span>
              </button>
              {shown && (picked === c.id || c.official) && (
                <p className="m-0 mt-1 text-sm" data-testid={`addr-note-${c.id}`}>
                  {c.official ? '✔ ' : '✘ '}
                  {c.noteBn}
                </p>
              )}
            </li>
          )
        })}
      </ul>
      {picked !== null && (
        <p className="m-0 text-sm font-semibold" data-testid="addr-result">
          {PYTHON_CASES.find((c) => c.id === picked)?.official ? 'ঠিক ধরেছেন!' : 'এটি আসল ঠিকানা নয়। হলুদ দাগ-দেওয়া অক্ষরগুলো দেখুন — আসলটির সাথে মেলে না।'}
        </p>
      )}
    </div>
  )
}
