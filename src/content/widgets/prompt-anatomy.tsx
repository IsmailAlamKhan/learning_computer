import { useState } from 'react'
import { useProgress } from '../../state/store'
import { PROMPT_FOLDERS, promptParts, type PromptFolder, type PromptOs, type PromptPartId } from './lib/promptAnatomy'

export default function PromptAnatomy() {
  const { profile } = useProgress()
  const [os, setOs] = useState<PromptOs>(profile.os === 'mac' ? 'mac' : 'windows')
  const [folder, setFolder] = useState<PromptFolder>('Documents')
  const [sel, setSel] = useState<PromptPartId>('folder')
  const parts = promptParts(os, folder)
  const info = parts.find((p) => p.id === sel) ?? parts[0]
  return (
    <div className="card space-y-3 p-4" data-testid="prompt-anatomy">
      <p className="font-semibold">টার্মিনালের প্রম্পট (Prompt) — প্রতিটি অংশে ক্লিক করে দেখুন</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="কোন কম্পিউটার">
        {(['windows', 'mac'] as const).map((o) => (
          <button key={o} type="button" className="btn btn-outline" aria-pressed={os === o} data-os={o} onClick={() => setOs(o)} style={os === o ? { borderWidth: 3 } : undefined}>
            {o === 'windows' ? 'Windows PowerShell' : 'Mac Terminal'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="এখনকার ফোল্ডার বদলান">
        <span className="text-sm">cd করে এই ফোল্ডারে গেলে:</span>
        {PROMPT_FOLDERS.map((f) => (
          <button key={f} type="button" className="btn btn-outline" aria-pressed={folder === f} data-folder={f} onClick={() => setFolder(f)} style={folder === f ? { borderWidth: 3 } : undefined}>
            {f === 'home' ? 'হোম' : f}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1 rounded-xl p-3 font-mono text-lg" style={{ background: '#111827', color: '#e5e7eb' }} data-testid="prompt-line">
        {parts.map((p) => (
          <button key={p.id} type="button" data-part={p.id} aria-pressed={sel === p.id} onClick={() => setSel(p.id)} className="rounded-lg px-2 py-1 font-mono" style={{ color: '#e5e7eb', outline: sel === p.id ? '3px solid #7dd3c8' : '1px dashed #6b7280' }}>
            {p.text}
          </button>
        ))}
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }} aria-live="polite" data-testid="prompt-info">
        <p className="font-semibold">{info.titleBn}</p>
        <p className="mt-1 text-sm">{info.descBn}</p>
      </div>
    </div>
  )
}
