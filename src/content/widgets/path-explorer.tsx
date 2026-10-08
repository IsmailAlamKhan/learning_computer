import { useState, type ReactNode } from 'react'
import {
  absolutePath,
  buildTree,
  challengeHintBn,
  challengeSolved,
  convertChain,
  describeParts,
  homeChain,
  homePath,
  nodeAt,
  relativePath,
  type PathStyle,
  type TNode,
} from './lib/pathExplorer'

const key = (chain: string[]) => chain.join('\u0001')
const roleStyle = (role: 'drive' | 'folder' | 'file') =>
  role === 'file' ? { background: 'var(--c-accent-soft)', color: 'var(--c-accent)' } : role === 'drive' ? { background: 'var(--c-ok-soft)', color: 'var(--c-ok)' } : { background: 'var(--c-brand-soft)', color: 'var(--c-ink)' }

function defaultOpen(style: PathStyle, selected: string[]): Set<string> {
  const open = new Set<string>()
  const home = homeChain(style)
  for (let i = style === 'windows' ? 1 : 0; i <= home.length; i++) open.add(key(home.slice(0, i)))
  for (let i = 1; i <= selected.length; i++) open.add(key(selected.slice(0, i)))
  open.add(key([]))
  return open
}

export default function PathExplorer() {
  const [style, setStyle] = useState<PathStyle>('windows')
  const [selected, setSelected] = useState<string[]>(() => [...homeChain('windows'), 'Documents'])
  const [current, setCurrent] = useState<string[]>(() => [...homeChain('windows'), 'Documents'])
  const [open, setOpen] = useState<Set<string>>(() => defaultOpen('windows', [...homeChain('windows'), 'Documents']))
  const [copied, setCopied] = useState(false)

  const top = buildTree(style)
  // On Windows the chain begins with the drive (the top node); on Mac the top node is the invisible root "/".
  const topChain = (): string[] => (style === 'windows' ? [top.name] : [])
  const abs = absolutePath(style, selected)
  const rel = relativePath(style, current, selected)
  const tilde = homePath(style, selected)
  const solved = challengeSolved(style, selected)
  const sel = nodeAt(style, selected)

  const switchStyle = (next: PathStyle) => {
    if (next === style) return
    const s = convertChain(selected, style, next)
    setStyle(next)
    setSelected(s)
    setCurrent(convertChain(current, style, next))
    setOpen(defaultOpen(next, s))
    setCopied(false)
  }

  const pick = (chain: string[], node: TNode) => {
    setSelected(chain)
    setCopied(false)
    if (node.kind === 'folder') {
      setOpen((o) => {
        const n = new Set(o)
        const k = key(chain)
        if (n.has(k) && key(selected) === k) n.delete(k)
        else n.add(k)
        return n
      })
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(abs)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const row = (node: TNode, chain: string[], depth: number): ReactNode => {
    const k = key(chain)
    const isOpen = node.kind === 'folder' && open.has(k)
    const isSel = k === key(selected)
    const isCur = k === key(current)
    const label = node.name === '' ? '/ (root)' : node.name
    return (
      <li key={k || 'root'} role="none">
        <button
          type="button"
          role="treeitem"
          aria-selected={isSel}
          aria-expanded={node.kind === 'folder' ? isOpen : undefined}
          data-node={node.name || '/'}
          onClick={() => pick(chain, node)}
          className="flex min-h-12 w-full items-center gap-2 rounded-lg px-2 text-left text-base"
          style={{ paddingLeft: 8 + depth * 22, background: isSel ? 'var(--c-brand-soft)' : 'transparent', color: 'var(--c-ink)', outline: isSel ? '2px solid var(--c-brand)' : undefined }}
        >
          <span aria-hidden="true">{node.kind === 'file' ? '📄' : isOpen ? '📂' : '📁'}</span>
          <span>{label}</span>
          {isCur && node.kind === 'folder' && (
            <span className="chip" style={{ background: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}>
              বর্তমান ফোল্ডার
            </span>
          )}
        </button>
        {isOpen && node.children && node.children.length > 0 && (
          <ul role="group" className="m-0 list-none p-0">
            {node.children.map((c) => row(c, [...chain, c.name], depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  const parts = describeParts(style, selected)
  const sepChar = style === 'windows' ? '\\' : '/'

  return (
    <div className="card space-y-4" data-widget="path-explorer">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 font-medium">ফোল্ডারে ক্লিক করে পথ (Path) তৈরি করুন</p>
        <div role="group" aria-label="Windows বা Mac স্টাইল" className="flex gap-2">
          {(['windows', 'mac'] as const).map((s) => (
            <button key={s} type="button" aria-pressed={style === s} data-style={s} onClick={() => switchStyle(s)} className={`btn ${style === s ? '' : 'btn-outline'}`}>
              {s === 'windows' ? 'Windows স্টাইল' : 'Mac স্টাইল'}
            </button>
          ))}
        </div>
      </div>

      <ul role="tree" aria-label="ফোল্ডারের গাছ" className="m-0 max-h-96 list-none overflow-auto rounded-xl p-2" style={{ background: 'var(--c-sunken)' }}>
        {row(top, topChain(), 0)}
      </ul>

      <div className="space-y-2" aria-live="polite">
        <div>
          <div className="text-sm" style={{ color: 'var(--c-muted)' }}>
            সম্পূর্ণ পথ (Absolute Path)
          </div>
          <div className="flex flex-wrap items-center gap-1 font-mono text-lg break-all" data-testid="abs-path">
            {style === 'mac' && <span>/</span>}
            {parts.map((p, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="rounded px-1.5" style={roleStyle(p.role)} title={p.role === 'file' ? 'ফাইলের নাম' : p.role === 'drive' ? 'ড্রাইভ' : 'ফোল্ডার'}>
                  {p.text}
                </span>
                {i < parts.length - 1 && <span>{sepChar}</span>}
              </span>
            ))}
            {style === 'windows' && parts.length === 1 && <span>{sepChar}</span>}
          </div>
          <div className="sr-only" data-testid="abs-text">
            {abs}
          </div>
        </div>
        <div>
          <div className="text-sm" style={{ color: 'var(--c-muted)' }}>
            বর্তমান ফোল্ডার থেকে আপেক্ষিক পথ (Relative Path)
          </div>
          <div className="font-mono text-lg break-all" data-testid="rel-path">
            {rel}
          </div>
        </div>
        <div>
          <div className="text-sm" style={{ color: 'var(--c-muted)' }}>
            হোম ফোল্ডারের সংক্ষেপ (~)
          </div>
          <div className="font-mono text-lg break-all" data-testid="home-path">
            {tilde ?? '— (এটি হোম ফোল্ডারের বাইরে)'}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline" disabled={sel?.kind !== 'folder'} onClick={() => setCurrent(selected)} data-action="set-current">
          এই ফোল্ডারটিকে “বর্তমান ফোল্ডার” করুন
        </button>
        <button type="button" className="btn btn-outline" onClick={copy} data-action="copy">
          {copied ? '✓ কপি হয়েছে' : 'পথটি কপি করুন'}
        </button>
      </div>
      <p className="m-0 text-sm" style={{ color: 'var(--c-muted)' }}>
        <code>..</code> মানে “এক ধাপ ওপরের ফোল্ডার”, <code>.</code> মানে “এই ফোল্ডার”। বর্তমান ফোল্ডার বদলালে আপেক্ষিক পথও বদলে যায়।
      </p>

      <div className="rounded-xl p-3" style={{ background: 'var(--c-sunken)' }} data-testid="challenge">
        <p className="m-0 font-medium">ছোট্ট চ্যালেঞ্জ</p>
        <p className="m-0">
          ট্রি থেকে ক্লিক করে <code>Documents</code> ফোল্ডারের ভেতরের <code>Family/Birthdays.txt</code> ফাইলটির পথ তৈরি করুন।
        </p>
        <p className="m-0 mt-1" role="status" style={{ color: solved ? 'var(--c-ok)' : 'var(--c-muted)' }}>
          {solved ? '🎉 চমৎকার! এটাই Birthdays.txt ফাইলের সম্পূর্ণ পথ। শেষ অংশটি ফাইলের নাম, আর তার আগের সবগুলো ফোল্ডার।' : challengeHintBn(style, selected)}
        </p>
      </div>
    </div>
  )
}
