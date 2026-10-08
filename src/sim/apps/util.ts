import type { OsFlavor } from '../../engine/types'
import { extensionOf, type VNode } from '../vfs'

export function findNode(root: VNode, id: string): VNode | null {
  if (root.id === id) return root
  for (const c of root.children) {
    const f = findNode(c, id)
    if (f) return f
  }
  return null
}

/** true while the node is still part of the tree (not deleted / moved out of reach). */
export function attached(node: VNode, root: VNode): boolean {
  for (let n: VNode = node; ; ) {
    if (n === root) return true
    const p = n.parent
    if (!p || !p.children.includes(n)) return false
    n = p
  }
}

export const byteLength = (s: string): number => new TextEncoder().encode(s).length

export function fmtSize(bytes: number, os: OsFlavor): string {
  if (os === 'mac') {
    if (bytes < 1000) return `${bytes} byte${bytes === 1 ? '' : 's'}`
    if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`
    return `${(bytes / 1_000_000).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.ceil(bytes / 1024)).toLocaleString('en-US')} KB`
}

export function fmtDate(ms: number, os: OsFlavor): string {
  const d = new Date(ms)
  return os === 'windows'
    ? d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function kindLabel(node: VNode, os: OsFlavor): string {
  if (node.kind === 'folder') return os === 'windows' ? 'File folder' : 'Folder'
  const ext = extensionOf(node.name)
  const up = ext.toUpperCase()
  if (os === 'windows') {
    if (ext === 'txt') return 'Text Document'
    if (node.media === 'pdf') return 'PDF File'
    if (node.media === 'image') return `${up} File`
    if (node.media === 'audio') return `${up} Audio File`
    if (node.media === 'video') return `${up} Video File`
    if (node.media === 'zip') return 'Compressed (zipped) Folder'
    if (node.media === 'app') return 'Application'
    return ext ? `${up} File` : 'File'
  }
  if (ext === 'txt') return 'Plain Text Document'
  if (node.media === 'pdf') return 'PDF Document'
  if (node.media === 'image') return `${up} image`
  if (node.media === 'audio') return `${up} audio`
  if (node.media === 'video') return 'Movie'
  if (node.media === 'zip') return 'ZIP archive'
  if (node.media === 'app') return 'Application'
  return ext ? `${up} document` : 'Document'
}

/** Split off a known file extension: "Report.txt" -> ["Report", ".txt"]. */
export function splitExt(name: string): [string, string] {
  const e = extensionOf(name)
  return e ? [name.slice(0, -(e.length + 1)), name.slice(-(e.length + 1))] : [name, '']
}

export const isTypingTarget = (el: Element | null): boolean => !!el && el.matches('input,textarea,select,[contenteditable="true"]')
