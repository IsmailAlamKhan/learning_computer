import { describe, expect, it } from 'vitest'
import { VirtualFileSystem, VfsError } from './vfs'
import { findNode } from './apps/util'

const seed = { folders: [{ name: 'Photos', files: [{ name: 'A.jpg' }] }], files: [{ name: 'Notes.txt', content: 'hi' }] }

describe('VFS mounted drives', () => {
  it('mounts and unmounts a Windows drive', () => {
    const v = new VirtualFileSystem('windows')
    const usb = v.mount('USB DRIVE (D:)', seed, { kind: 'usb', letter: 'D' })
    expect(v.mounts).toEqual([usb])
    expect(v.resolve('D:\\Photos\\A.jpg')?.name).toBe('A.jpg')
    expect(v.resolve('/D:/Notes.txt')?.name).toBe('Notes.txt')
    expect(v.canonPath(v.resolve('D:\\Photos')!)).toBe('/D:/Photos')
    expect(v.displayPath(v.resolve('D:\\Photos')!)).toBe('D:\\Photos')
    expect(v.displayPath(usb)).toBe('D:\\')
    expect(v.mountOf(v.resolve('D:\\Photos')!)).toBe(usb)
    expect(v.mountOf(v.home)).toBeNull()
    expect(v.unmount(usb)).toBe(true)
    expect(v.mounts).toEqual([])
    expect(v.resolve('D:\\Photos')).toBeNull()
    expect(v.unmount(usb)).toBe(false)
  })

  it('Mac drives live under /Volumes', () => {
    const v = new VirtualFileSystem('mac')
    const usb = v.mount('USB DRIVE', seed)
    expect(v.resolve('/Volumes/USB DRIVE/Photos')?.name).toBe('Photos')
    expect(v.canonPath(v.resolve('/Volumes/USB DRIVE/Photos')!)).toBe('/Volumes/USB DRIVE/Photos')
    expect(v.displayPath(usb)).toBe('/Volumes/USB DRIVE')
  })

  it('refuses a second drive with the same name', () => {
    const v = new VirtualFileSystem('windows')
    v.mount('USB DRIVE (D:)', seed)
    expect(() => v.mount('USB DRIVE (D:)', seed)).toThrow(VfsError)
  })

  it('copying between the PC and a drive keeps the originals; files on the stick survive eject + remount', () => {
    const v = new VirtualFileSystem('windows')
    const usb = v.mount('USB DRIVE (D:)', seed, { letter: 'D' })
    const pic = v.resolve('~/Pictures/Flower.png')!
    v.copy(pic, usb)
    expect(v.child(usb, 'Flower.png')).toBeTruthy()
    expect(v.child(v.resolve('~/Pictures')!, 'Flower.png')).toBeTruthy()
    const notes = v.child(usb, 'Notes.txt')!
    v.copy(notes, v.resolve('~/Documents')!)
    expect(v.child(v.resolve('~/Documents')!, 'Notes.txt')?.content).toBe('hi')
    v.unmount(usb)
    expect(usb.mount?.plugged).toBe(false)
    v.remount(usb)
    expect(v.child(usb, 'Flower.png')).toBeTruthy()
    expect(usb.mount?.plugged).toBe(true)
  })

  it('findNode locates files on a mounted drive', () => {
    const v = new VirtualFileSystem('mac')
    const usb = v.mount('USB DRIVE', seed)
    const a = v.resolve('/Volumes/USB DRIVE/Photos/A.jpg')!
    expect(findNode(v.root, a.id)).toBe(a)
    v.unmount(usb)
    expect(findNode(v.root, a.id)).toBeNull()
  })
})
