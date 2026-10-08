import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderApp } from '../apps/testUtils'
import { getDevices } from './store'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('USB stick', () => {
  it('insert -> eject -> pull is safe; pulling while mounted warns', () => {
    const rig = renderApp('windows')
    const s = getDevices(rig.d())
    act(() => s.insertUsb())
    expect(rig.d().vfs.mounts.map((m) => m.name)).toEqual(['USB DRIVE (D:)'])
    act(() => s.ejectUsb())
    expect(rig.d().vfs.mounts).toEqual([])
    expect(s.state.usb).toBe('in')
    act(() => s.pullUsb())
    expect(s.state.notice).toBe('usb-pulled-safe')
    act(() => s.insertUsb())
    act(() => s.pullUsb())
    expect(s.state.notice).toBe('usb-pulled-unsafe')
    expect(rig.events().some((e) => e.includes('usb-removed-unsafe'))).toBe(true)
  })

  it('the Mac drive is called USB DRIVE', () => {
    const rig = renderApp('mac')
    act(() => getDevices(rig.d()).insertUsb())
    expect(rig.d().vfs.mounts[0].name).toBe('USB DRIVE')
  })

  it('a phone needs the permission step before it shows up', () => {
    const rig = renderApp('windows')
    const s = getDevices(rig.d())
    act(() => s.connectPhone())
    expect(rig.d().vfs.mounts).toEqual([])
    act(() => s.allowPhone())
    expect(rig.d().vfs.resolve('E:\\Internal storage\\DCIM\\Camera\\IMG_0001.jpg')).toBeTruthy()
  })
})

describe('print queue', () => {
  it('prints to the default printer and finishes', () => {
    const rig = renderApp('windows')
    const s = getDevices(rig.d())
    expect(s.printers()).toEqual(['Practice Printer'])
    act(() => void s.addJob('a.txt', 'Practice Printer', 1, 1))
    expect(s.state.jobs[0].status).toBe('printing')
    act(() => {
      vi.advanceTimersByTime(35_000)
    })
    expect(rig.events().some((e) => e.includes('print-done'))).toBe(true)
  })

  it('can cancel a job and starts the next one', () => {
    const rig = renderApp('mac')
    const s = getDevices(rig.d())
    let id = 0
    act(() => {
      id = s.addJob('a.txt', 'Practice Printer', 1, 1).id
      s.addJob('b.txt', 'Practice Printer', 1, 1)
    })
    act(() => s.cancelJob(id))
    expect(s.state.jobs.find((j) => j.doc === 'a.txt')?.status).toBe('cancelled')
    expect(s.state.jobs.find((j) => j.doc === 'b.txt')?.status).toBe('printing')
    expect(rig.events().some((e) => e.includes('print-cancelled'))).toBe(true)
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(s.state.jobs.find((j) => j.doc === 'a.txt')).toBeUndefined()
  })

  it('print dialog -> queue -> cancel (Notepad)', () => {
    const rig = renderApp('windows', 'editor')
    fireEvent.change(rig.q('editor-text'), { target: { value: 'hello world' } })
    rig.key('ctrl+p')
    expect(rig.has('print-dialog')).toBe(true)
    expect((rig.q('print-printer') as HTMLSelectElement).value).toBe('Practice Printer')
    fireEvent.change(rig.q('print-copies'), { target: { value: '2' } })
    fireEvent.click(rig.q('print-go'))
    expect(rig.has('print-dialog')).toBe(false)
    expect(rig.events().some((e) => e.includes('print-started'))).toBe(true)
    rig.open('printqueue')
    fireEvent.click(rig.q('pq-cancel-Untitled'))
    expect(rig.events().some((e) => e.includes('print-cancelled'))).toBe(true)
  })
})

describe('screenshots', () => {
  it('Mac Cmd+Shift+3 saves a file on the Desktop', () => {
    const rig = renderApp('mac')
    rig.key('shift+cmd+3')
    const desk = rig.d().vfs.resolve('~/Desktop')!
    const shot = desk.children.find((c) => c.name.startsWith('Screenshot '))
    expect(shot?.media).toBe('image')
    expect(rig.events().some((e) => e.includes('screenshot-saved'))).toBe(true)
  })

  it('Windows Win+PrtScn saves to Pictures\\Screenshots, PrtScn only copies', () => {
    const rig = renderApp('windows')
    rig.key('prtscn')
    expect(getDevices(rig.d()).state.clip).toBeTruthy()
    expect(rig.d().vfs.resolve('~/Pictures/Screenshots')).toBeNull()
    rig.key('cmd+prtscn')
    expect(rig.d().vfs.resolve('~/Pictures/Screenshots/Screenshot (1).png')).toBeTruthy()
  })

  it('Win+Shift+S opens the overlay mode', () => {
    const rig = renderApp('windows')
    rig.key('shift+cmd+s')
    expect(getDevices(rig.d()).state.shotMode).toBe('snip')
    act(() => void getDevices(rig.d()).finishDrag(10, 10, 120, 90))
    expect(getDevices(rig.d()).state.clip?.area).toEqual({ x: 10, y: 10, w: 110, h: 80 })
    expect(getDevices(rig.d()).state.snipNotice).toBe(true)
  })
})
