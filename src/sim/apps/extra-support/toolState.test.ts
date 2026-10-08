import { describe, expect, it } from 'vitest'
import { VirtualFileSystem } from '../../vfs'
import { beginToolPractice, getExtensions, installExtension, installTool, isGated, isToolInstalled } from './toolState'
import { INSTALLER_FILES, needsPath, nextPage, pagesFor, passwordOk, toolForFile } from './setupModel'
import { installerFor, registerInstallerHandler } from '../../installerRegistry'

describe('tool state store', () => {
  it('is not gated by default: every tool counts as installed', () => {
    const v = new VirtualFileSystem('windows', 'Anika')
    expect(isGated(v)).toBe(false)
    expect(isToolInstalled(v, 'python')).toBe(true)
    installTool(v, 'python') // no-op without practice
    expect(isGated(v)).toBe(false)
  })
  it('begins with nothing installed and installs per computer', () => {
    const a = new VirtualFileSystem('windows', 'Anika')
    const b = new VirtualFileSystem('mac', 'Anika')
    beginToolPractice(a)
    expect(isToolInstalled(a, 'python')).toBe(false)
    expect(isToolInstalled(b, 'python')).toBe(true) // other computers unaffected
    installTool(a, 'node')
    expect(isToolInstalled(a, 'node')).toBe(true)
    expect(isToolInstalled(a, 'python')).toBe(false)
    beginToolPractice(a, { python: true })
    expect(isToolInstalled(a, 'python')).toBe(true)
    expect(isToolInstalled(a, 'node')).toBe(false) // reset
  })
  it('Python without the PATH box is installed but not found', () => {
    const a = new VirtualFileSystem('windows', 'Anika')
    beginToolPractice(a)
    installTool(a, 'python', { path: false })
    expect(isToolInstalled(a, 'python')).toBe(false)
    installTool(a, 'python', { path: true })
    expect(isToolInstalled(a, 'python')).toBe(true)
  })
  it('extensions are tracked and de-duplicated', () => {
    const a = new VirtualFileSystem('mac', 'Anika')
    installExtension(a, 'python-support')
    installExtension(a, 'python-support')
    expect(getExtensions(a)).toEqual(['python-support'])
  })
})

describe('setup model', () => {
  it('has the right pages per OS and tool', () => {
    expect(pagesFor('windows', 'python')).toEqual(['options', 'installing', 'done'])
    expect(pagesFor('windows', 'node')).toContain('uac')
    expect(pagesFor('mac', 'python')).toContain('password')
    expect(pagesFor('mac', 'vscode')).toEqual(['dmg', 'installing', 'done'])
    expect(nextPage('mac', 'node', 'type')).toBe('password')
    expect(nextPage('windows', 'python', 'done')).toBe('done')
  })
  it('recognises installer file names', () => {
    for (const os of ['windows', 'mac'] as const) for (const t of ['python', 'node', 'vscode'] as const) expect(toolForFile(INSTALLER_FILES[os][t])).toBe(t)
    expect(toolForFile('notes.txt')).toBeNull()
    expect(toolForFile('random-setup.exe')).toBeNull()
  })
  it('only Windows Python needs the PATH box; the practice password is exact', () => {
    expect(needsPath('windows', 'python')).toBe(true)
    expect(needsPath('windows', 'node')).toBe(false)
    expect(needsPath('mac', 'python')).toBe(false)
    expect(passwordOk('practice123')).toBe(true)
    expect(passwordOk('Practice123')).toBe(false)
  })
  it('installer registry routes files to the registered app', () => {
    registerInstallerHandler(/^zz-test-.*\.exe$/i, 'zzapp')
    expect(installerFor('zz-test-1.exe')).toEqual({ appId: 'zzapp', props: { fileName: 'zz-test-1.exe' } })
    expect(installerFor('nothing.exe')).toBeNull()
  })
})
