/**
 * In-memory virtual file system shared by the file apps, the editor and the terminal.
 * One canonical tree per OS flavor (Windows: C:\Users\Name\..., Mac: /Users/name/...).
 */
import type { OsFlavor } from '../engine/types'
import type { SimEvent } from './bus'

export type VfsErrorCode = 'exists' | 'invalidName' | 'protected' | 'notFound' | 'notFolder' | 'intoSelf' | 'notInBin'

export class VfsError extends Error {
  code: VfsErrorCode
  detail?: string
  constructor(code: VfsErrorCode, detail?: string) {
    super(`${code}${detail ? `: ${detail}` : ''}`)
    this.code = code
    this.detail = detail
  }
}

export type NodeKind = 'folder' | 'file'

export interface VNode {
  id: string
  name: string
  kind: NodeKind
  parent: VNode | null
  children: VNode[]
  content: string
  /** Display flavor for non-text files (image/pdf/audio/video/exe…) — pure decoration. */
  media?: 'image' | 'pdf' | 'audio' | 'video' | 'app' | 'zip'
  createdAt: number
  modifiedAt: number
  protected?: boolean
  hidden?: boolean
}

export interface BinItem {
  binId: string
  node: VNode
  originalParentId: string
  deletedAt: number
}

export interface SeedFile {
  name: string
  content?: string
  media?: VNode['media']
  hidden?: boolean
}
export interface SeedFolder {
  name: string
  folders?: SeedFolder[]
  files?: SeedFile[]
  protected?: boolean
}

const WIN_BAD = /[\\/:*?"<>|]/
const MAC_BAD = /[/:]/

export const normalizeName = (s: string) => s.normalize('NFC')
const same = (a: string, b: string) => normalizeName(a).toLowerCase() === normalizeName(b).toLowerCase()

export function extensionOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i > 0 && i < name.length - 1 ? name.slice(i + 1).toLowerCase() : ''
}

export function mediaForExtension(ext: string): VNode['media'] | undefined {
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  if (['mp3', 'wav', 'm4a'].includes(ext)) return 'audio'
  if (['mp4', 'mov', 'mkv'].includes(ext)) return 'video'
  if (['exe', 'msi', 'dmg', 'app', 'pkg'].includes(ext)) return 'app'
  if (ext === 'zip') return 'zip'
  return undefined
}

export class VirtualFileSystem {
  readonly flavor: OsFlavor
  readonly userName: string
  readonly sep: '\\' | '/'
  root!: VNode
  home!: VNode
  private nextId = 1
  private bin: BinItem[] = []
  private listeners = new Set<() => void>()
  private eventListeners = new Set<(e: SimEvent) => void>()
  /** Bumps on every change — use with useSyncExternalStore. */
  version = 0
  /** true when drive letters are used in display paths. */
  readonly driveName: string | null

  constructor(flavor: OsFlavor, userName = 'Anika', seed: 'default' | 'empty' = 'default') {
    this.flavor = flavor
    this.userName = userName
    this.sep = flavor === 'windows' ? '\\' : '/'
    this.driveName = flavor === 'windows' ? 'C:' : null
    this.buildTree(seed)
  }

  // ---------- subscription ----------
  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }
  getVersion = () => this.version
  onEvent(fn: (e: SimEvent) => void) {
    this.eventListeners.add(fn)
    return () => {
      this.eventListeners.delete(fn)
    }
  }
  private changed() {
    this.version++
    this.listeners.forEach((l) => l())
  }
  private emit(e: SimEvent) {
    this.eventListeners.forEach((l) => l(e))
  }

  // ---------- construction ----------
  private mk(name: string, kind: NodeKind, parent: VNode | null, extra: Partial<VNode> = {}): VNode {
    const now = Date.now()
    const n: VNode = {
      id: `n${this.nextId++}`,
      name,
      kind,
      parent,
      children: [],
      content: '',
      createdAt: now,
      modifiedAt: now,
      ...extra,
    }
    if (parent) parent.children.push(n)
    return n
  }

  private seedFolder(parent: VNode, f: SeedFolder) {
    const d = this.mk(f.name, 'folder', parent, { protected: f.protected })
    f.folders?.forEach((s) => this.seedFolder(d, s))
    f.files?.forEach((s) => this.mk(s.name, 'file', d, { content: s.content ?? '', media: s.media ?? mediaForExtension(extensionOf(s.name)), hidden: s.hidden }))
  }

  private buildTree(seed: 'default' | 'empty') {
    const u = this.userName
    const userFolders: SeedFolder[] =
      seed === 'empty'
        ? ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music'].map((name) => ({ name, protected: true }))
        : [
            {
              name: 'Desktop',
              protected: true,
              files: [{ name: 'Welcome.txt', content: 'Hello! Welcome to your practice computer.\nআপনাকে স্বাগতম!' }],
              folders: [{ name: 'Practice' }],
            },
            {
              name: 'Documents',
              protected: true,
              files: [
                { name: 'Shopping List.txt', content: 'rice\nlentils\nfish\nonions\nmustard oil' },
                { name: 'Recipe.txt', content: 'Khichuri\n1. Wash the rice and lentils.\n2. Boil with turmeric and salt.' },
              ],
              folders: [{ name: 'Family', files: [{ name: 'Birthdays.txt', content: 'Mom: 12 March\nBrother: 4 June' }] }],
            },
            { name: 'Downloads', protected: true, files: [{ name: 'Invoice.pdf', media: 'pdf' }] },
            {
              name: 'Pictures',
              protected: true,
              files: [
                { name: 'Flower.png', media: 'image' },
                { name: 'River.jpg', media: 'image' },
              ],
            },
            { name: 'Music', protected: true, files: [{ name: 'Song.mp3', media: 'audio' }] },
          ]
    if (this.flavor === 'windows') {
      const c = this.mk('C:', 'folder', null, { protected: true })
      this.root = c
      const users = this.mk('Users', 'folder', c, { protected: true })
      this.seedFolder(c, { name: 'Program Files', protected: true, folders: [{ name: 'Common Files', protected: true }] })
      this.seedFolder(c, { name: 'Windows', protected: true })
      const home = this.mk(u, 'folder', users, { protected: true })
      this.home = home
      userFolders.concat(seed === 'empty' ? [] : [{ name: 'Videos', protected: true }]).forEach((f) => this.seedFolder(home, f))
    } else {
      const r = this.mk('', 'folder', null, { protected: true })
      this.root = r
      const users = this.mk('Users', 'folder', r, { protected: true })
      this.seedFolder(r, { name: 'Applications', protected: true })
      this.seedFolder(r, { name: 'Library', protected: true })
      this.seedFolder(r, { name: 'System', protected: true })
      const home = this.mk(u.toLowerCase(), 'folder', users, { protected: true })
      this.home = home
      userFolders
        .map((f) => (f.name === 'Videos' ? { ...f, name: 'Movies' } : f))
        .concat(seed === 'empty' ? [] : [{ name: 'Movies', protected: true }])
        .forEach((f) => this.seedFolder(home, f))
    }
  }

  // ---------- naming ----------
  validateName(name: string): string {
    const n = normalizeName(name).trim()
    const bad = this.flavor === 'windows' ? WIN_BAD : MAC_BAD
    if (!n || n === '.' || n === '..' || bad.test(n) || /[. ]$/.test(n) && this.flavor === 'windows') throw new VfsError('invalidName', name)
    if (n.length > 120) throw new VfsError('invalidName', name)
    return n
  }

  nameTaken(parent: VNode, name: string, except?: VNode): boolean {
    return parent.children.some((c) => c !== except && same(c.name, name))
  }

  /** "New folder", "New folder (2)" (Windows) / "untitled folder", "untitled folder 2" (Mac). */
  uniqueName(parent: VNode, base: string, ext = ''): string {
    const make = (i: number) => {
      if (i === 1) return base + ext
      return this.flavor === 'windows' ? `${base} (${i})${ext}` : `${base} ${i}${ext}`
    }
    let i = 1
    while (this.nameTaken(parent, make(i))) i++
    return make(i)
  }

  defaultFolderName() {
    return this.flavor === 'windows' ? 'New folder' : 'untitled folder'
  }

  private copyName(parent: VNode, name: string): string {
    const ext = extensionOf(name)
    const base = ext ? name.slice(0, -(ext.length + 1)) : name
    const dot = ext ? `.${ext}` : ''
    const mk = (i: number) =>
      this.flavor === 'windows' ? `${base} - Copy${i > 1 ? ` (${i})` : ''}${dot}` : `${base} copy${i > 1 ? ` ${i}` : ''}${dot}`
    let i = 1
    while (this.nameTaken(parent, mk(i))) i++
    return mk(i)
  }

  // ---------- paths ----------
  /** Canonical path used in events and lesson data: `~/Documents` or `/C:/Windows`. */
  canonPath(node: VNode): string {
    const chain: string[] = []
    let n: VNode | null = node
    while (n) {
      if (n === this.home) return ['~', ...chain.reverse()].join('/')
      if (n.parent) chain.push(n.name)
      else if (n.name) chain.push(n.name)
      n = n.parent
    }
    return '/' + chain.reverse().join('/')
  }

  /** The path as the real OS would show it: `C:\Users\Anika\Documents` or `/Users/anika/Documents`. */
  displayPath(node: VNode): string {
    const names: string[] = []
    let n: VNode | null = node
    while (n) {
      names.push(n.name)
      n = n.parent
    }
    names.reverse()
    if (this.flavor === 'windows') return names.length === 1 ? names[0] + '\\' : names.join('\\')
    const rest = names.slice(1)
    return '/' + rest.join('/')
  }

  /** Path from the home folder, like `Documents\Family` — empty for home itself. */
  relativeToHome(node: VNode): string | null {
    const canon = this.canonPath(node)
    if (canon === '~') return ''
    if (canon.startsWith('~/')) return canon.slice(2).split('/').join(this.sep)
    return null
  }

  /**
   * Resolve a path. Accepts: `~`, `~/Documents`, `C:\Users\Anika`, `/Users/anika`, `/C:/Windows`,
   * relative names (resolved from `from`, default home), `.` and `..`.
   */
  resolve(path: string, from: VNode = this.home): VNode | null {
    let p = normalizeName(path.trim())
    if (p === '') return from
    let cur: VNode
    let parts: string[]
    if (p === '~' || p.startsWith('~/') || p.startsWith('~\\')) {
      cur = this.home
      parts = p.slice(1).split(/[\\/]+/).filter(Boolean)
    } else if (this.flavor === 'windows' && /^\/?[a-zA-Z]:/.test(p)) {
      p = p.replace(/^\//, '')
      if (!same(p.slice(0, 2), 'C:')) return null
      cur = this.root
      parts = p.slice(2).split(/[\\/]+/).filter(Boolean)
    } else if (p.startsWith('/') || (this.flavor === 'windows' && p.startsWith('\\'))) {
      cur = this.root
      parts = p.split(/[\\/]+/).filter(Boolean)
      if (this.flavor === 'windows' && parts[0] && same(parts[0], 'C:')) parts.shift()
    } else {
      cur = from
      parts = p.split(this.flavor === 'windows' ? /[\\/]+/ : /\/+/).filter(Boolean)
    }
    for (const part of parts) {
      if (part === '.') continue
      if (part === '..') {
        cur = cur.parent ?? cur
        continue
      }
      if (cur.kind !== 'folder') return null
      const next = cur.children.find((c) => same(c.name, part))
      if (!next) return null
      cur = next
    }
    return cur
  }

  exists(path: string, from?: VNode) {
    return this.resolve(path, from) !== null
  }

  isDescendant(node: VNode, ancestor: VNode): boolean {
    for (let n: VNode | null = node; n; n = n.parent) if (n === ancestor) return true
    return false
  }

  // ---------- queries ----------
  list(folder: VNode, opts: { showHidden?: boolean } = {}): VNode[] {
    return folder.children
      .filter((c) => opts.showHidden || !c.hidden)
      .slice()
      .sort((a, b) =>
        a.kind !== b.kind ? (a.kind === 'folder' ? -1 : 1) : a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
      )
  }

  child(folder: VNode, name: string): VNode | undefined {
    return folder.children.find((c) => same(c.name, name))
  }

  search(query: string, within: VNode = this.home): VNode[] {
    const q = normalizeName(query).trim().toLowerCase()
    if (!q) return []
    const out: VNode[] = []
    const walk = (n: VNode) => {
      for (const c of n.children) {
        if (c.hidden) continue
        if (c.name.toLowerCase().includes(q)) out.push(c)
        if (c.kind === 'folder') walk(c)
      }
    }
    walk(within)
    return out
  }

  readFile(node: VNode): string {
    if (node.kind !== 'file') throw new VfsError('notFolder', node.name)
    return node.content
  }

  // ---------- mutations ----------
  private guard(node: VNode) {
    if (node.protected || !node.parent) throw new VfsError('protected', node.name)
  }

  mkdir(parent: VNode, name?: string): VNode {
    if (parent.kind !== 'folder') throw new VfsError('notFolder', parent.name)
    const n = name === undefined ? this.uniqueName(parent, this.defaultFolderName()) : this.validateName(name)
    if (this.nameTaken(parent, n)) throw new VfsError('exists', n)
    const node = this.mk(n, 'folder', parent)
    parent.modifiedAt = Date.now()
    this.changed()
    this.emit({ type: 'createFolder', name: n, path: this.canonPath(parent) })
    return node
  }

  createFile(parent: VNode, name?: string, content = ''): VNode {
    if (parent.kind !== 'folder') throw new VfsError('notFolder', parent.name)
    const n = name === undefined ? this.uniqueName(parent, this.flavor === 'windows' ? 'New Text Document' : 'untitled', '.txt') : this.validateName(name)
    if (this.nameTaken(parent, n)) throw new VfsError('exists', n)
    const node = this.mk(n, 'file', parent, { content, media: mediaForExtension(extensionOf(n)) })
    parent.modifiedAt = Date.now()
    this.changed()
    this.emit({ type: 'createFile', name: n, path: this.canonPath(parent) })
    return node
  }

  /** Write (save) a file's content; emits `saveFile`. */
  writeFile(node: VNode, content: string) {
    if (node.kind !== 'file') throw new VfsError('notFolder', node.name)
    node.content = content
    node.modifiedAt = Date.now()
    this.changed()
    this.emit({ type: 'saveFile', name: node.name, path: this.canonPath(node.parent ?? this.root) })
  }

  /** Create-or-overwrite by path, used by "Save As" and by the terminal's `echo > file`. */
  saveAs(parent: VNode, name: string, content: string): VNode {
    const n = this.validateName(name)
    const existing = this.child(parent, n)
    if (existing) {
      if (existing.kind === 'folder') throw new VfsError('exists', n)
      this.writeFile(existing, content)
      return existing
    }
    const node = this.mk(n, 'file', parent, { content, media: mediaForExtension(extensionOf(n)) })
    parent.modifiedAt = Date.now()
    this.changed()
    this.emit({ type: 'createFile', name: n, path: this.canonPath(parent) })
    this.emit({ type: 'saveFile', name: n, path: this.canonPath(parent) })
    return node
  }

  rename(node: VNode, newName: string): VNode {
    this.guard(node)
    const n = this.validateName(newName)
    if (same(n, node.name) && n === node.name) return node
    if (this.nameTaken(node.parent!, n, node)) throw new VfsError('exists', n)
    const from = node.name
    node.name = n
    node.modifiedAt = Date.now()
    if (node.kind === 'file') node.media = mediaForExtension(extensionOf(n)) ?? node.media
    this.changed()
    this.emit({ type: 'rename', from, to: n, path: this.canonPath(node.parent!) })
    return node
  }

  move(node: VNode, dest: VNode): VNode {
    this.guard(node)
    if (dest.kind !== 'folder') throw new VfsError('notFolder', dest.name)
    if (this.isDescendant(dest, node)) throw new VfsError('intoSelf', node.name)
    if (node.parent === dest) return node
    if (this.nameTaken(dest, node.name)) throw new VfsError('exists', node.name)
    const fromPath = this.canonPath(node.parent!)
    node.parent!.children = node.parent!.children.filter((c) => c !== node)
    node.parent = dest
    dest.children.push(node)
    node.modifiedAt = Date.now()
    this.changed()
    this.emit({ type: 'move', name: node.name, fromPath, toPath: this.canonPath(dest) })
    return node
  }

  copy(node: VNode, dest: VNode): VNode {
    if (dest.kind !== 'folder') throw new VfsError('notFolder', dest.name)
    if (node.kind === 'folder' && this.isDescendant(dest, node)) throw new VfsError('intoSelf', node.name)
    const name = this.nameTaken(dest, node.name) ? this.copyName(dest, node.name) : node.name
    const clone = (src: VNode, parent: VNode, nm: string): VNode => {
      const c = this.mk(nm, src.kind, parent, { content: src.content, media: src.media, hidden: src.hidden })
      src.children.forEach((k) => clone(k, c, k.name))
      return c
    }
    const out = clone(node, dest, name)
    this.changed()
    this.emit({ type: 'copy', name, fromPath: node.parent ? this.canonPath(node.parent) : '/', toPath: this.canonPath(dest) })
    return out
  }

  /** Move to the Recycle Bin / Trash (not permanent). */
  delete(node: VNode): BinItem {
    this.guard(node)
    const parent = node.parent!
    const path = this.canonPath(parent)
    parent.children = parent.children.filter((c) => c !== node)
    const item: BinItem = { binId: `b${this.nextId++}`, node, originalParentId: parent.id, deletedAt: Date.now() }
    this.bin.push(item)
    this.changed()
    this.emit({ type: 'delete', name: node.name, path })
    return item
  }

  binItems(): BinItem[] {
    return [...this.bin]
  }

  /** Put a deleted item back where it was (or on the Desktop if its folder is gone). */
  restore(binId: string): VNode {
    const idx = this.bin.findIndex((b) => b.binId === binId)
    if (idx < 0) throw new VfsError('notInBin', binId)
    const item = this.bin[idx]
    const findById = (n: VNode, id: string): VNode | null => (n.id === id ? n : n.children.map((c) => findById(c, id)).find(Boolean) ?? null)
    const origin = findById(this.root, item.originalParentId)
    const desktop = this.child(this.home, 'Desktop')!
    const dest = origin ?? desktop
    let name = item.node.name
    if (this.nameTaken(dest, name)) name = this.copyName(dest, name)
    item.node.name = name
    item.node.parent = dest
    dest.children.push(item.node)
    this.bin.splice(idx, 1)
    this.changed()
    this.emit({ type: 'restore', name, path: this.canonPath(dest) })
    return item.node
  }

  emptyBin() {
    this.bin = []
    this.changed()
  }

  // ---------- persistence ----------
  serialize(): string {
    const ser = (n: VNode): unknown => ({
      name: n.name,
      kind: n.kind,
      content: n.content || undefined,
      media: n.media,
      protected: n.protected || undefined,
      hidden: n.hidden || undefined,
      children: n.children.map(ser),
    })
    return JSON.stringify({ flavor: this.flavor, userName: this.userName, tree: ser(this.root) })
  }

  static deserialize(text: string): VirtualFileSystem {
    const data = JSON.parse(text) as { flavor: OsFlavor; userName: string; tree: Record<string, unknown> }
    const v = new VirtualFileSystem(data.flavor, data.userName, 'empty')
    v.nextId = 1
    const build = (o: Record<string, unknown>, parent: VNode | null): VNode => {
      const n = v.mk(String(o.name), o.kind === 'folder' ? 'folder' : 'file', parent, {
        content: typeof o.content === 'string' ? o.content : '',
        media: o.media as VNode['media'],
        protected: o.protected === true,
        hidden: o.hidden === true,
      })
      ;(Array.isArray(o.children) ? o.children : []).forEach((c) => build(c as Record<string, unknown>, n))
      return n
    }
    v.root = build(data.tree, null)
    const find = (p: string) => v.resolve(p, v.root)
    v.home = (data.flavor === 'windows' ? find(`C:/Users/${data.userName}`) : find(`/Users/${data.userName.toLowerCase()}`)) ?? v.root
    return v
  }
}

export function errorMessageEn(e: unknown, os: OsFlavor): string {
  if (!(e instanceof VfsError)) return 'Something went wrong.'
  switch (e.code) {
    case 'exists':
      return os === 'windows'
        ? `A file or folder with the name "${e.detail}" already exists.`
        : `An item named "${e.detail}" already exists in this location.`
    case 'invalidName':
      return os === 'windows'
        ? 'A file name can’t contain any of these characters: \\ / : * ? " < > |'
        : 'This name can’t be used. Names can’t be empty or contain “/” or “:”.'
    case 'protected':
      return os === 'windows' ? `"${e.detail}" is a system folder and can’t be changed here.` : `“${e.detail}” is protected and can’t be changed here.`
    case 'intoSelf':
      return 'You can’t put a folder inside itself.'
    default:
      return 'That didn’t work.'
  }
}
