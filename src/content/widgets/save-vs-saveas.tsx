import { useState } from 'react'

export type SaveKind = 'save' | 'saveAs'
export interface SaveScene {
  /** files shown in the Documents folder at this step */
  files: { name: string; text: string }[]
  captionBn: string
}

/** The state of the little Documents folder at each step (0..2) of the Save / Save As story. Pure → unit-tested. */
export function saveScene(kind: SaveKind, step: number): SaveScene {
  const s = Math.max(0, Math.min(2, step))
  if (s === 0) return { files: [{ name: 'hello.txt', text: 'Hello' }], captionBn: 'শুরুতে Documents ফোল্ডারে একটি ফাইল: hello.txt, ভেতরে “Hello”।' }
  if (s === 1) return { files: [{ name: 'hello.txt', text: 'Hello' }], captionBn: 'আপনি ফাইলটি খুলে লেখার শেষে “ Ruma” যোগ করলেন। এখনও সেভ করেননি — ফাইলে আগের লেখাই আছে।' }
  if (kind === 'save')
    return { files: [{ name: 'hello.txt', text: 'Hello Ruma' }], captionBn: 'Save: একই ফাইলটিই নতুন লেখায় বদলে গেল। এখনও একটাই ফাইল — পুরনো লেখা আর নেই।' }
  return {
    files: [
      { name: 'hello.txt', text: 'Hello' },
      { name: 'hello-copy.txt', text: 'Hello Ruma' },
    ],
    captionBn: 'Save As: নতুন নামে আরেকটি ফাইল তৈরি হলো। পুরনো hello.txt আগের মতোই আছে — এখন দুটি ফাইল।',
  }
}

const LABEL: Record<SaveKind, string> = { save: 'Save (একই ফাইল আপডেট)', saveAs: 'Save As (নতুন নামে/জায়গায় কপি)' }

export default function SaveVsSaveAs() {
  const [kind, setKind] = useState<SaveKind>('save')
  const [step, setStep] = useState(0)
  const scene = saveScene(kind, step)
  return (
    <div className="card space-y-3 p-4" data-testid="save-vs-saveas">
      <p className="font-semibold">Save আর Save As — ধাপে ধাপে দেখুন</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose Save or Save As">
        {(Object.keys(LABEL) as SaveKind[]).map((k) => (
          <button key={k} type="button" className={`btn ${kind === k ? '' : 'btn-outline'}`} aria-pressed={kind === k} onClick={() => (setKind(k), setStep(0))}>
            {LABEL[k]}
          </button>
        ))}
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-label="Documents folder">
        <div className="mb-2 text-sm font-semibold">📁 Documents</div>
        <ul className="space-y-2">
          {scene.files.map((f) => (
            <li key={f.name} className="flex items-center gap-3 rounded-lg p-2" style={{ background: 'var(--c-sunken)' }}>
              <span aria-hidden="true">📄</span>
              <span className="font-mono">{f.name}</span>
              <span className="ml-auto font-mono text-sm" style={{ color: 'var(--c-muted)' }}>“{f.text}”</span>
            </li>
          ))}
        </ul>
      </div>
      <p aria-live="polite" data-testid="save-caption">
        <strong>ধাপ {step + 1}/3: </strong>
        {scene.captionBn}
      </p>
      <div className="flex gap-2">
        <button type="button" className="btn btn-outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          ← আগের ধাপ
        </button>
        <button type="button" className="btn" disabled={step === 2} onClick={() => setStep((s) => s + 1)}>
          পরের ধাপ →
        </button>
      </div>
    </div>
  )
}
