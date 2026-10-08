import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'
import { fakeDuration, fmtTime } from './extra/media'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('media player', () => {
  it('double-click routing: audio opens the media player', () => {
    const rig = renderApp('windows')
    const song = rig.d().vfs.resolve('~/Music/Song.mp3')!
    act(() => rig.d().openFile(song))
    expect(rig.has('media-play')).toBe(true)
    expect(rig.q('media-title').textContent).toBe('Song.mp3')
  })

  it('plays, pauses, stops and follows the volume settings', () => {
    const rig = renderApp('mac')
    const song = rig.d().vfs.resolve('~/Music/Song.mp3')!
    rig.open('media', { nodeId: song.id }, true)
    expect(rig.q('media-screen').querySelector('[data-playing="false"]')).toBeTruthy()
    fireEvent.click(rig.q('media-play'))
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(rig.q('media-screen').querySelector('[data-playing="true"]')).toBeTruthy()
    expect(rig.q('media-time').textContent).toMatch(/^0:0[23]$/)
    fireEvent.click(rig.q('media-play'))
    fireEvent.change(rig.q('media-volume'), { target: { value: '80' } })
    expect(rig.d().sim.volume).toBe(80)
    fireEvent.click(rig.q('media-mute'))
    expect(rig.d().sim.muted).toBe(true)
    fireEvent.click(rig.q('media-stop'))
    expect(rig.q('media-time').textContent).toBe('0:00')
    const ev = rig.events().join(' ')
    for (const e of ['media-play', 'media-pause', 'media-stop']) expect(ev).toContain(e)
  })

  it('plays video files too', () => {
    const rig = renderApp('windows')
    const v = rig.d().vfs.createFile(rig.d().vfs.resolve('~/Videos')!, 'Holiday.mp4')
    act(() => rig.d().openFile(v))
    expect(rig.q('media-title').textContent).toBe('Holiday.mp4')
  })

  it('has stable fake lengths', () => {
    expect(fakeDuration('Song.mp3')).toBe(fakeDuration('Song.mp3'))
    expect(fakeDuration('Song.mp3')).toBeGreaterThanOrEqual(60)
    expect(fmtTime(75)).toBe('1:15')
  })
})
