import { describe, expect, it } from 'vitest'
import { VirtualFileSystem, VfsError, extensionOf } from './vfs'
import type { SimEvent } from './bus'

const win = () => new VirtualFileSystem('windows', 'Anika')
const mac = () => new VirtualFileSystem('mac', 'Anika')
const docs = (v: VirtualFileSystem) => v.resolve('~/Documents')!

describe('VirtualFileSystem paths', () => {
  it('builds Windows and Mac display paths', () => {
    const w = win()
    const m = mac()
    expect(w.displayPath(docs(w))).toBe('C:\\Users\\Anika\\Documents')
    expect(m.displayPath(docs(m))).toBe('/Users/anika/Documents')
    expect(w.canonPath(docs(w))).toBe('~/Documents')
    expect(m.displayPath(m.root)).toBe('/')
    expect(w.displayPath(w.root)).toBe('C:\\')
  })

  it('resolves absolute, relative, tilde and dotdot paths', () => {
    const w = win()
    const m = mac()
    expect(w.resolve('C:\\Users\\Anika\\Documents')).toBe(docs(w))
    expect(w.resolve('c:/users/anika/documents')).toBe(docs(w))
    expect(m.resolve('/Users/anika/Documents')).toBe(docs(m))
    expect(m.resolve('~/Documents/Family/..')).toBe(docs(m))
    expect(w.resolve('Documents', w.home)).toBe(docs(w))
    expect(m.resolve('../Pictures', docs(m))).toBe(m.resolve('~/Pictures'))
    expect(w.resolve('~/Nope')).toBeNull()
    expect(w.resolve('/C:/Windows')?.name).toBe('Windows')
  })

  it('computes home-relative paths', () => {
    const w = win()
    expect(w.relativeToHome(w.resolve('~/Documents/Family')!)).toBe('Documents\\Family')
    expect(w.relativeToHome(w.resolve('C:\\Windows')!)).toBeNull()
  })
})

describe('VirtualFileSystem operations', () => {
  it('creates folders with OS-specific default names', () => {
    const w = win()
    const m = mac()
    expect(w.mkdir(w.home).name).toBe('New folder')
    expect(w.mkdir(w.home).name).toBe('New folder (2)')
    expect(m.mkdir(m.home).name).toBe('untitled folder')
    expect(m.mkdir(m.home).name).toBe('untitled folder 2')
  })

  it('rejects duplicate and invalid names, but allows Bengali', () => {
    const w = win()
    w.mkdir(w.home, 'আমার-কাজ')
    expect(() => w.mkdir(w.home, 'আমার-কাজ')).toThrow(VfsError)
    expect(() => w.mkdir(w.home, 'a?b')).toThrow(/invalidName/)
    expect(() => w.mkdir(w.home, '  ')).toThrow(/invalidName/)
    expect(() => mac().mkdir(mac().home, 'a/b')).toThrow(/invalidName/)
    expect(() => mac().mkdir(mac().home, 'a?b')).not.toThrow()
  })

  it('treats names case-insensitively', () => {
    const w = win()
    expect(() => w.mkdir(w.home, 'documents')).toThrow(/exists/)
  })

  it('renames, moves and copies', () => {
    const w = win()
    const f = w.createFile(docs(w), 'a.txt', 'hi')
    w.rename(f, 'b.txt')
    expect(f.name).toBe('b.txt')
    w.move(f, w.resolve('~/Desktop')!)
    expect(w.canonPath(f)).toBe('~/Desktop/b.txt')
    const c = w.copy(f, w.resolve('~/Desktop')!)
    expect(c.name).toBe('b - Copy.txt')
    expect(c.content).toBe('hi')
    const m = mac()
    const mf = m.createFile(docs(m), 'a.txt')
    expect(m.copy(mf, docs(m)).name).toBe('a copy.txt')
  })

  it('copies folders deeply and independently', () => {
    const w = win()
    const fam = w.resolve('~/Documents/Family')!
    const copy = w.copy(fam, w.resolve('~/Desktop')!)
    expect(copy.children.map((c) => c.name)).toEqual(['Birthdays.txt'])
    copy.children[0].content = 'changed'
    expect(fam.children[0].content).not.toBe('changed')
  })

  it('refuses moving a folder into itself and protected changes', () => {
    const w = win()
    const fam = w.resolve('~/Documents/Family')!
    const sub = w.mkdir(fam, 'sub')
    expect(() => w.move(fam, sub)).toThrow(/intoSelf/)
    expect(() => w.delete(docs(w))).toThrow(/protected/)
    expect(() => w.rename(docs(w), 'X')).toThrow(/protected/)
  })

  it('deletes to the bin and restores to the original place', () => {
    const w = win()
    const f = w.createFile(docs(w), 'x.txt')
    const item = w.delete(f)
    expect(w.child(docs(w), 'x.txt')).toBeUndefined()
    expect(w.binItems()).toHaveLength(1)
    w.restore(item.binId)
    expect(w.child(docs(w), 'x.txt')).toBeDefined()
    expect(w.binItems()).toHaveLength(0)
  })

  it('restores to Desktop when the original folder is gone, and renames on conflict', () => {
    const w = win()
    const d = w.mkdir(w.home, 'tmp')
    const f = w.createFile(d, 'x.txt')
    const fi = w.delete(f)
    w.delete(d)
    w.createFile(w.resolve('~/Desktop')!, 'x.txt')
    const back = w.restore(fi.binId)
    expect(w.canonPath(back.parent!)).toBe('~/Desktop')
    expect(back.name).toBe('x - Copy.txt')
  })

  it('searches by name recursively', () => {
    const w = win()
    expect(w.search('birth').map((n) => n.name)).toEqual(['Birthdays.txt'])
    expect(w.search('')).toEqual([])
  })

  it('saveAs creates or overwrites and emits events', () => {
    const w = win()
    const events: SimEvent[] = []
    w.onEvent((e) => events.push(e))
    w.saveAs(docs(w), 'note.txt', 'one')
    const again = w.saveAs(docs(w), 'note.txt', 'two')
    expect(again.content).toBe('two')
    expect(events.map((e) => e.type)).toEqual(['createFile', 'saveFile', 'saveFile'])
  })

  it('emits typed events with canonical paths', () => {
    const w = win()
    const events: SimEvent[] = []
    w.onEvent((e) => events.push(e))
    const d = w.mkdir(w.home, 'আমার-কাজ')
    w.rename(d, 'কাজ')
    w.move(d, docs(w))
    expect(events).toEqual([
      { type: 'createFolder', name: 'আমার-কাজ', path: '~' },
      { type: 'rename', from: 'আমার-কাজ', to: 'কাজ', path: '~' },
      { type: 'move', name: 'কাজ', fromPath: '~', toPath: '~/Documents' },
    ])
  })

  it('serializes and restores a tree', () => {
    const w = win()
    w.createFile(docs(w), 'z.txt', 'বাংলা')
    const w2 = VirtualFileSystem.deserialize(w.serialize())
    expect(w2.resolve('~/Documents/z.txt')?.content).toBe('বাংলা')
    expect(w2.displayPath(w2.home)).toBe('C:\\Users\\Anika')
  })

  it('bumps version and notifies on change', () => {
    const w = win()
    let n = 0
    w.subscribe(() => n++)
    const v = w.getVersion()
    w.mkdir(w.home, 'q')
    expect(w.getVersion()).toBe(v + 1)
    expect(n).toBe(1)
  })

  it('extensionOf handles edge cases', () => {
    expect(extensionOf('a.TXT')).toBe('txt')
    expect(extensionOf('.gitignore')).toBe('')
    expect(extensionOf('noext')).toBe('')
    expect(extensionOf('archive.tar.gz')).toBe('gz')
  })
})
