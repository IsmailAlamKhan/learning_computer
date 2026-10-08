import { afterEach, describe, expect, it } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { renderApp } from './testUtils'
import { beginToolPractice, getExtensions, isToolInstalled } from './extra-support/toolState'
import { EXTENSIONS, looksTrustworthy } from './extra/m18-extensions'
import { INSTALLER_FILES } from './extra-support/setupModel'

const wait = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)))
const has = (events: string[], e: object) => events.includes(JSON.stringify(e))
afterEach(() => undefined)

describe('M18 setup wizard', () => {
  it('Windows Python: without the PATH box the terminal still cannot find it; with it, it can', async () => {
    const rig = renderApp('windows')
    const v = rig.d().vfs
    beginToolPractice(v)
    const dl = v.child(v.home, 'Downloads')!
    const f = v.createFile(dl, INSTALLER_FILES.windows.python)
    act(() => rig.d().openFile(f))
    fireEvent.click(rig.q('setup-install'))
    await wait(1500)
    expect(rig.q('setup-nopath-note')).toBeTruthy()
    expect(isToolInstalled(v, 'python')).toBe(false)
    fireEvent.click(rig.q('setup-finish'))
    // run it again, this time tick the box
    act(() => rig.d().openFile(f))
    fireEvent.click(rig.q('setup-path'))
    expect(rig.q('setup-path').getAttribute('aria-checked')).toBe('true')
    fireEvent.click(rig.q('setup-install'))
    await wait(1500)
    expect(isToolInstalled(v, 'python')).toBe(true)
    expect(has(rig.events(), { type: 'custom', event: 'tool-installed:python' })).toBe(true)
  })

  it('Mac Node .pkg: Continue → Agree → Install → wrong then right practice password', async () => {
    const rig = renderApp('mac')
    const v = rig.d().vfs
    beginToolPractice(v)
    const f = v.createFile(v.child(v.home, 'Downloads')!, INSTALLER_FILES.mac.node)
    act(() => rig.d().openFile(f))
    fireEvent.click(rig.q('setup-next')) // intro
    fireEvent.click(rig.q('setup-next')) // license → sheet
    fireEvent.click(rig.q('setup-agree'))
    fireEvent.click(rig.q('setup-next')) // destination
    fireEvent.click(rig.q('setup-install')) // type
    fireEvent.change(rig.q('setup-password'), { target: { value: 'nope' } })
    fireEvent.click(rig.q('setup-password-ok'))
    expect(rig.q('setup-password-wrong')).toBeTruthy()
    fireEvent.change(rig.q('setup-password'), { target: { value: 'practice123' } })
    fireEvent.click(rig.q('setup-password-ok'))
    await wait(1500)
    expect(isToolInstalled(v, 'node')).toBe(true)
  })

  it('other apps files still just toast', () => {
    const rig = renderApp('windows')
    const v = rig.d().vfs
    const f = v.createFile(v.child(v.home, 'Downloads')!, 'random-setup.exe')
    act(() => rig.d().openFile(f))
    expect(rig.has('setup-window')).toBe(false)
  })
})

describe('M18 extensions', () => {
  it('installs the right one, blocks the look-alike', () => {
    const rig = renderApp('windows', 'extensions')
    fireEvent.click(rig.q('ext-install-python-support-pro'))
    expect(rig.q('ext-trap-note')).toBeTruthy()
    expect(getExtensions(rig.d().vfs)).toEqual([])
    fireEvent.click(rig.q('ext-install-python-support'))
    expect(getExtensions(rig.d().vfs)).toEqual(['python-support'])
    expect(rig.q('ext-installed-python-support')).toBeTruthy()
  })
  it('judges listings by publisher + installs', () => {
    expect(EXTENSIONS.filter(looksTrustworthy).map((e) => e.id)).toEqual(['python-support', 'live-preview', 'bangla-pack'])
  })
})
