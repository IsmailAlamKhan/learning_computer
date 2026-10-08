/**
 * Pure path-building logic for the `path-explorer` widget (no React, no DOM).
 * A "chain" is the list of names from the top of the disk down to a folder or file,
 * e.g. Windows ['C:', 'Users', 'Anika', 'Documents'], Mac ['Users', 'anika', 'Documents'] (the root `/` is implicit).
 */

export type PathStyle = 'windows' | 'mac'

export interface TNode {
  name: string
  kind: 'folder' | 'file'
  children?: TNode[]
}

const f = (name: string, children: TNode[]): TNode => ({ name, kind: 'folder', children })
const file = (name: string): TNode => ({ name, kind: 'file' })

const userFolders = (): TNode[] => [
  f('Desktop', [file('Welcome.txt')]),
  f('Documents', [f('Family', [file('Birthdays.txt')]), file('Recipe.txt'), file('Shopping List.txt')]),
  f('Downloads', [file('Invoice.pdf')]),
  f('Pictures', [file('Flower.png'), file('River.jpg')]),
]

/** The practice disk. Windows: C: drive → Users → Anika. Mac: (root) → Users → anika. Returns the top node (drive or root). */
export function buildTree(style: PathStyle): TNode {
  if (style === 'windows') return f('C:', [f('Users', [f('Anika', userFolders())]), f('Windows', []), f('Program Files', [])])
  return f('', [f('Applications', []), f('Users', [f('anika', userFolders())]), f('Library', [])])
}

/** Chain of the home folder (what `~` means). */
export const homeChain = (style: PathStyle): string[] => (style === 'windows' ? ['C:', 'Users', 'Anika'] : ['Users', 'anika'])

export const separator = (style: PathStyle): string => (style === 'windows' ? '\\' : '/')

/** Absolute path text: `C:\Users\Anika\Documents` or `/Users/anika/Documents`. */
export function absolutePath(style: PathStyle, chain: string[]): string {
  if (style === 'windows') {
    if (chain.length === 0) return ''
    return chain.length === 1 ? `${chain[0]}\\` : chain.join('\\')
  }
  return '/' + chain.join('/')
}

const startsWith = (chain: string[], prefix: string[]) => prefix.length <= chain.length && prefix.every((p, i) => chain[i] === p)

/** Home-based shortcut: `~/Documents` (Mac Terminal, and PowerShell on Windows); null when outside the home folder. */
export function homePath(style: PathStyle, chain: string[]): string | null {
  const h = homeChain(style)
  if (!startsWith(chain, h)) return null
  const rest = chain.slice(h.length)
  return rest.length ? `~${style === 'windows' ? '\\' : '/'}${rest.join(separator(style))}` : '~'
}

/** Relative path from the folder `from` to `to` using `..` for "one folder up". Same place → `.` */
export function relativePath(style: PathStyle, from: string[], to: string[]): string {
  let common = 0
  while (common < from.length && common < to.length && from[common] === to[common]) common++
  const ups = from.length - common
  const parts = [...Array<string>(ups).fill('..'), ...to.slice(common)]
  return parts.length ? parts.join(separator(style)) : '.'
}

/** Walk a chain down from the top node; undefined when it doesn't exist. */
export function nodeAt(style: PathStyle, chain: string[]): TNode | undefined {
  let cur: TNode | undefined = buildTree(style)
  let rest = chain
  if (style === 'windows') {
    if (chain[0] !== 'C:') return undefined
    rest = chain.slice(1)
  }
  for (const name of rest) {
    cur = cur?.children?.find((c) => c.name === name)
    if (!cur) return undefined
  }
  return cur
}

export const isFolder = (style: PathStyle, chain: string[]) => nodeAt(style, chain)?.kind === 'folder'

export type PartRole = 'drive' | 'folder' | 'file'
export interface PathPart {
  text: string
  role: PartRole
}

/** The chain split into labelled parts, so the UI can highlight the drive, folders and the file name. */
export function describeParts(style: PathStyle, chain: string[]): PathPart[] {
  return chain.map((text, i) => {
    if (style === 'windows' && i === 0) return { text, role: 'drive' as const }
    const isLast = i === chain.length - 1
    const kind = isLast ? nodeAt(style, chain)?.kind : 'folder'
    return { text, role: kind === 'file' ? ('file' as const) : ('folder' as const) }
  })
}

/** Convert a chain between styles when the learner flips the Windows/Mac toggle (home folder name differs). */
export function convertChain(chain: string[], from: PathStyle, to: PathStyle): string[] {
  if (from === to) return chain
  const fh = homeChain(from)
  const th = homeChain(to)
  const mapped = startsWith(chain, fh) ? [...th, ...chain.slice(fh.length)] : to === 'windows' ? ['C:', ...chain] : chain.filter((n) => n !== 'C:')
  return nodeAt(to, mapped) ? mapped : th
}

/** Challenge: "Build the path to Family/Birthdays.txt". */
export const CHALLENGE_TARGET = ['Documents', 'Family', 'Birthdays.txt']
export const challengeChain = (style: PathStyle): string[] => [...homeChain(style), ...CHALLENGE_TARGET]
export const challengeSolved = (style: PathStyle, chain: string[]): boolean => {
  const want = challengeChain(style)
  return chain.length === want.length && want.every((w, i) => w === chain[i])
}

/** A gentle hint for the challenge based on where she currently is. */
export function challengeHintBn(style: PathStyle, chain: string[]): string {
  const want = challengeChain(style)
  if (challengeSolved(style, chain)) return 'একদম ঠিক!'
  if (chain.length === 0) return 'ডিস্কের ওপরের ফোল্ডার থেকে শুরু করুন — Users ফোল্ডারে ক্লিক করুন।'
  let ok = 0
  while (ok < chain.length && ok < want.length && chain[ok] === want[ok]) ok++
  if (ok < chain.length) return `এই পথটি ঠিক পথে নেই। “${want[Math.max(0, ok - 1)]}” পর্যন্ত ঠিক ছিল — সেখান থেকে আবার চেষ্টা করুন।`
  if (ok >= want.length) return 'ঠিক জায়গায় পৌঁছে গেছেন!'
  return `ঠিক পথে আছেন! এবার “${want[ok]}” খুঁজুন।`
}
