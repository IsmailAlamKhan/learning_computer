import { describe, expect, it, vi } from 'vitest'
import { VirtualFileSystem } from '../vfs'
import { createSession, type SessionTool } from './engine'

function rig(os: 'windows' | 'mac', have: Partial<Record<SessionTool, boolean>> | 'all') {
  const vfs = new VirtualFileSystem(os, 'Anika')
  const openEditor = vi.fn()
  const s = createSession(vfs, os, undefined, undefined, undefined, { isInstalled: (t) => (have === 'all' ? true : !!have[t]), openEditor })
  const run = async (l: string) => (await s.exec(l)).lines.map((x) => x.text).join('\n')
  return { vfs, s, run, openEditor }
}

describe('terminal install gating', () => {
  it('Windows: not installed → PowerShell-style "not recognized", for versions and for running files', async () => {
    const { run, vfs } = rig('windows', {})
    expect(await run('python --version')).toMatch(/^python : The term 'python' is not recognized/)
    expect(await run('py --version')).toMatch(/^py : The term 'py' is not recognized/)
    expect(await run('node --version')).toMatch(/node : The term 'node' is not recognized/)
    expect(await run('git --version')).toMatch(/git : The term 'git' is not recognized/)
    vfs.createFile(vfs.home, 'hello.py', 'print(1)')
    expect(await run('python hello.py')).toMatch(/not recognized/)
    expect(await run('python --version')).toContain('PATH')
  })
  it('Mac: command not found, git asks for developer tools', async () => {
    const { run } = rig('mac', {})
    expect(await run('python3 --version')).toMatch(/^zsh: command not found: python3/)
    expect(await run('node --version')).toMatch(/^zsh: command not found: node/)
    expect(await run('git --version')).toMatch(/^xcode-select: note/)
  })
  it('installed tools print their versions', async () => {
    const w = rig('windows', 'all')
    expect(await w.run('python --version')).toBe('Python 3.12.4')
    expect(await w.run('node --version')).toBe('v22.12.0')
    expect(await w.run('git --version')).toMatch(/^git version/)
    const m = rig('mac', { python: true })
    expect(await m.run('python3 --version')).toBe('Python 3.12.4')
    expect(await m.run('node --version')).toMatch(/command not found/)
  })
  it('without hooks everything is installed and `code` stays unknown (backward compatible)', async () => {
    const vfs = new VirtualFileSystem('mac', 'Anika')
    const s = createSession(vfs, 'mac')
    expect((await s.exec('python3 --version')).lines[0].text).toBe('Python 3.12.4')
    expect((await s.exec('code .')).lines[0].text).toMatch(/command not found: code/)
    expect(s.commandNames()).not.toContain('code')
  })
  it('`code .` opens the editor on the folder once the editor is installed', async () => {
    const r = rig('windows', 'all')
    await r.run('code .')
    expect(r.openEditor).toHaveBeenCalledTimes(1)
    expect((await r.run('code nothing'))).toMatch(/does not exist/)
    const n = rig('windows', { python: true })
    expect(await n.run('code .')).toMatch(/not recognized/)
    expect(n.openEditor).not.toHaveBeenCalled()
  })
})
