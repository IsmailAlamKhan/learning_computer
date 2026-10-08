import { describe, expect, it, vi } from 'vitest'
import { VirtualFileSystem } from '../vfs'
import type { SimEvent } from '../bus'
import { createSession, levenshtein, nearest, type ExecResult, type Runner, type Session } from './engine'
import { parseLine } from './parse'
import { freshCursor, pushHistory, stepHistory } from './history'
import type { RunResult } from '../runner'

function rig(os: 'windows' | 'mac', runner?: Runner) {
  const vfs = new VirtualFileSystem(os, 'Anika')
  const events: SimEvent[] = []
  vfs.onEvent((e) => events.push(e))
  const s = createSession(vfs, os, runner, (e) => events.push(e))
  const run = async (line: string) => s.exec(line)
  return { vfs, s, events, run }
}
const text = (r: ExecResult) => r.lines.map((l) => l.text).join('\n')
const kinds = (r: ExecResult) => r.lines.map((l) => l.kind)

describe('parser', () => {
  it('splits words, quotes and redirects', () => {
    const p = parseLine(`echo "hello world" 'a b' c>out.txt`, 'mac')
    expect(p.ok && p.segments[0].words).toEqual(['echo', 'hello world', 'a b', 'c'])
    expect(p.ok && p.segments[0].redirect).toEqual({ mode: '>', target: 'out.txt' })
  })
  it('handles >> , ; and &&, keeping Bengali text', () => {
    const p = parseLine('echo আমার নাম >> n.txt; cd .. && pwd', 'windows')
    expect(p.ok && p.segments.map((s) => [s.join, s.raw])).toEqual([
      [null, 'echo আমার নাম >> n.txt'],
      [';', 'cd ..'],
      ['&&', 'pwd'],
    ])
  })
  it('backslash is a path char on Windows, an escape on Mac', () => {
    const w = parseLine('cd C:\\Users\\Anika', 'windows')
    expect(w.ok && w.segments[0].words[1]).toBe('C:\\Users\\Anika')
    const m = parseLine('cd My\\ Folder', 'mac')
    expect(m.ok && m.segments[0].words[1]).toBe('My Folder')
  })
  it('reports unterminated quotes and missing redirect targets', () => {
    expect(parseLine('echo "oops', 'mac')).toEqual({ ok: false, error: 'unterminatedQuote' })
    expect(parseLine('echo hi >', 'mac')).toEqual({ ok: false, error: 'missingRedirectTarget' })
  })
})

describe('history helper', () => {
  it('walks up and down and restores the draft', () => {
    const h = ['a', 'b', 'c']
    let c = freshCursor(h)
    let r = stepHistory(h, c, 'up', 'dr')
    expect(r.text).toBe('c')
    r = stepHistory(h, r.cursor, 'up', 'c')
    r = stepHistory(h, r.cursor, 'up', 'b')
    expect(r.text).toBe('a')
    r = stepHistory(h, r.cursor, 'up', 'a')
    expect(r.text).toBe('a')
    r = stepHistory(h, r.cursor, 'down', 'a')
    expect(r.text).toBe('b')
    r = stepHistory(h, r.cursor, 'down', 'b')
    r = stepHistory(h, r.cursor, 'down', 'c')
    expect(r.text).toBe('dr')
    c = r.cursor
    expect(stepHistory([], freshCursor([]), 'up', 'x').text).toBe('x')
  })
  it('does not store blanks or repeats', () => {
    const h: string[] = []
    ;['ls', 'ls', '  ', 'pwd'].forEach((l) => pushHistory(h, l))
    expect(h).toEqual(['ls', 'pwd'])
  })
})

describe('prompt and cd', () => {
  it('Windows prompt shows the real display path', async () => {
    const { s, run } = rig('windows')
    expect(s.promptString()).toBe('PS C:\\Users\\Anika> ')
    await run('cd Documents')
    expect(s.promptString()).toBe('PS C:\\Users\\Anika\\Documents> ')
    await run('cd ..')
    await run('cd \\')
    expect(s.promptString()).toBe('PS C:\\> ')
    await run('cd ~')
    expect(s.promptString()).toBe('PS C:\\Users\\Anika> ')
    await run('cd c:/users/anika/DOCUMENTS/family')
    expect(s.cwd.name).toBe('Family')
  })
  it('Mac prompt shows ~ or the folder name', async () => {
    const { s, run } = rig('mac')
    expect(s.promptString()).toBe('anika@Mac ~ % ')
    await run('cd Documents')
    expect(s.promptString()).toBe('anika@Mac Documents % ')
    await run('cd /')
    expect(s.promptString()).toBe('anika@Mac / % ')
    await run('cd ~/Documents/Family')
    await run('cd ../..')
    expect(s.promptString()).toBe('anika@Mac ~ % ')
  })
  it('handles quoted names with spaces and explains missing quotes', async () => {
    const { vfs, s, run } = rig('mac')
    vfs.mkdir(vfs.home, 'My Stuff')
    const bad = await run('cd My Stuff')
    expect(bad.ok).toBe(false)
    expect(text(bad)).toContain('cd "My Stuff"')
    expect((await run('cd "My Stuff"')).ok).toBe(true)
    expect(s.cwd.name).toBe('My Stuff')
    await run('cd ..')
    await run('cd My\\ Stuff')
    expect(s.cwd.name).toBe('My Stuff')
  })
  it('errors: not found (with a suggestion), not a directory, cd..', async () => {
    const { run } = rig('windows')
    const nf = await run('cd Documnets')
    expect(nf.ok).toBe(false)
    expect(kinds(nf)).toContain('err')
    expect(text(nf)).toContain('Documents')
    const nd = await run('cd Desktop\\Welcome.txt')
    expect(text(nd)).toContain('not a directory')
    const dd = await run('cd..')
    expect(text(dd)).toContain('cd ..')
    expect(dd.ok).toBe(false)
  })
})

describe('listing', () => {
  it('Windows ls/dir print the Directory/Mode/Name table', async () => {
    const { run } = rig('windows')
    const r = await run('dir Documents')
    const t = text(r)
    expect(t).toContain('    Directory: C:\\Users\\Anika\\Documents')
    expect(t).toContain('Mode                 LastWriteTime         Length Name')
    expect(r.lines.some((l) => /^d-----.*Family$/.test(l.text))).toBe(true)
    expect(r.lines.some((l) => /^-a----.* Recipe\.txt$/.test(l.text))).toBe(true)
    expect(text(await run('ls Documents'))).toBe(t)
  })
  it('Windows rejects -la with a hint', async () => {
    const { run } = rig('windows')
    const r = await run('ls -la')
    expect(r.ok).toBe(false)
    expect(text(r)).toContain('-Force')
  })
  it('Mac ls lists names, -l is long, -a shows hidden', async () => {
    const { vfs, run } = rig('mac')
    expect(text(await run('ls Documents'))).toContain('Family')
    const l = await run('ls -l Documents')
    expect(l.lines[0].text).toMatch(/^total /)
    expect(l.lines.some((x) => /^drwxr-xr-x .*Family$/.test(x.text))).toBe(true)
    expect(l.lines.some((x) => /^-rw-r--r-- .*Recipe\.txt$/.test(x.text))).toBe(true)
    const h = vfs.createFile(vfs.home, '.secret')
    h.hidden = true
    expect(text(await run('ls'))).not.toContain('.secret')
    expect(text(await run('ls -a'))).toContain('.secret')
    expect(text(await run('ls -la'))).toContain('.secret')
    expect((await run('ls -z')).ok).toBe(false)
  })
  it('pwd', async () => {
    const w = rig('windows')
    expect(text(await w.run('pwd'))).toContain('C:\\Users\\Anika')
    expect(text(await w.run('Get-Location'))).toContain('Path')
    const m = rig('mac')
    expect(text(await m.run('pwd'))).toBe('/Users/anika')
  })
})

describe('creating things', () => {
  it('mkdir, touch/ni, mkdir -p emit vfs events', async () => {
    const m = rig('mac')
    await m.run('mkdir coding')
    await m.run('cd coding')
    await m.run('touch hello.py')
    await m.run('mkdir -p a/b/c')
    expect(m.vfs.resolve('~/coding/hello.py')?.kind).toBe('file')
    expect(m.vfs.resolve('~/coding/a/b/c')?.kind).toBe('folder')
    expect(m.events).toContainEqual({ type: 'createFolder', name: 'coding', path: '~' })
    expect(m.events).toContainEqual({ type: 'createFile', name: 'hello.py', path: '~/coding' })
    const w = rig('windows')
    await w.run('mkdir coding')
    await w.run('md coding2')
    await w.run('cd coding')
    const r = await w.run('ni hello.py')
    expect(text(r)).toContain('hello.py')
    await w.run('New-Item -ItemType Directory -Name sub')
    await w.run('New-Item notes.txt -ItemType File')
    expect(w.vfs.resolve('~/coding/sub')?.kind).toBe('folder')
    expect(w.vfs.resolve('~/coding/notes.txt')?.kind).toBe('file')
    expect(w.vfs.resolve('~/coding2')).not.toBeNull()
  })
  it('reports exists / missing argument / missing parent', async () => {
    const m = rig('mac')
    await m.run('mkdir x')
    const e = await m.run('mkdir x')
    expect(e.ok).toBe(false)
    expect(text(e)).toContain('File exists')
    expect(text(await m.run('mkdir'))).toContain('mkdir নতুন-ফোল্ডার')
    expect((await m.run('mkdir p/q')).ok).toBe(false)
    expect((await m.run('mkdir "a:b"')).ok).toBe(false)
    const w = rig('windows')
    await w.run('mkdir x')
    expect(text(await w.run('mkdir x'))).toContain('already exists')
    expect((await w.run('ni')).ok).toBe(false)
  })
})

describe('echo, redirection, cat', () => {
  it('echo prints, quotes and Bengali work', async () => {
    const { run } = rig('windows')
    expect(text(await run('echo "হ্যালো   বিশ্ব"'))).toBe('হ্যালো   বিশ্ব')
    expect(text(await run('echo a b  c'))).toBe('a b c')
  })
  it('> creates/overwrites and >> appends', async () => {
    const { vfs, run, events } = rig('mac')
    const r = await run('echo "আমি শিখছি" > note.txt')
    expect(r.lines).toHaveLength(0)
    expect(vfs.resolve('note.txt')?.content).toBe('আমি শিখছি\n')
    expect(events).toContainEqual({ type: 'createFile', name: 'note.txt', path: '~' })
    expect(events).toContainEqual({ type: 'saveFile', name: 'note.txt', path: '~' })
    await run('echo second >> note.txt')
    expect(vfs.resolve('note.txt')?.content).toBe('আমি শিখছি\nsecond\n')
    await run('echo fresh > note.txt')
    expect(vfs.resolve('note.txt')?.content).toBe('fresh\n')
    await run('echo hello >> brandnew.txt')
    expect(vfs.resolve('brandnew.txt')?.content).toBe('hello\n')
    expect(text(await run('cat note.txt'))).toBe('fresh')
    await run('ls > list.txt')
    expect(vfs.resolve('list.txt')?.content).toContain('note.txt')
  })
  it('type/cat errors: missing, directory', async () => {
    const { run } = rig('windows')
    expect(text(await run('type Documents\\Recipe.txt'))).toContain('Khichuri')
    expect((await run('type nope.txt')).ok).toBe(false)
    expect(text(await run('type nope.txt'))).toContain('Cannot find path')
    expect((await run('type Documents')).ok).toBe(false)
    expect((await run('cat')).ok).toBe(false)
  })
  it('redirect into a missing folder is explained', async () => {
    const { run } = rig('mac')
    const r = await run('echo hi > nofolder/x.txt')
    expect(r.ok).toBe(false)
  })
})

describe('mv and cp', () => {
  it('moves into folders, renames, copies with the vfs collision rules', async () => {
    const { vfs, run, events } = rig('mac')
    await run('echo hi > a.txt')
    await run('mkdir box')
    await run('cp a.txt box')
    expect(vfs.resolve('box/a.txt')).not.toBeNull()
    expect(events.some((e) => e.type === 'copy' && e.name === 'a.txt')).toBe(true)
    await run('cp a.txt b.txt')
    expect(vfs.resolve('b.txt')?.content).toBe('hi\n')
    await run('cp a.txt box')
    expect(vfs.resolve('box/a copy.txt')).not.toBeNull()
    await run('mv b.txt c.txt')
    expect(vfs.resolve('b.txt')).toBeNull()
    expect(vfs.resolve('c.txt')).not.toBeNull()
    await run('mv c.txt box')
    expect(vfs.resolve('box/c.txt')).not.toBeNull()
    expect(events.some((e) => e.type === 'move' && e.name === 'c.txt')).toBe(true)
    expect((await run('cp box box2')).ok).toBe(false)
    expect((await run('cp -r box box2')).ok).toBe(true)
    expect(vfs.resolve('box2/c.txt')).not.toBeNull()
    expect((await run('mv nope box')).ok).toBe(false)
    expect((await run('mv a.txt')).ok).toBe(false)
  })
  it('Windows copy/move aliases work', async () => {
    const { vfs, run } = rig('windows')
    await run('copy Documents\\Recipe.txt Desktop')
    expect(vfs.resolve('~/Desktop/Recipe.txt')).not.toBeNull()
    await run('move Desktop\\Recipe.txt Desktop\\R2.txt')
    expect(vfs.resolve('~/Desktop/R2.txt')).not.toBeNull()
    expect(vfs.resolve('~/Desktop/Recipe.txt')).toBeNull()
  })
})

describe('dangerous commands', () => {
  it.each(['rm file', 'rm -rf Documents', 'del x.txt', 'del /s *.*', 'Remove-Item x', 'rmdir x', 'rd x', 'format c:', 'shutdown now', 'sudo ls', 'erase x', 'chmod 777 x'])('%s is blocked kindly', async (line) => {
    for (const os of ['windows', 'mac'] as const) {
      const { vfs, run } = rig(os)
      const before = vfs.list(vfs.home).length
      const r = await run(line)
      expect(r.ok).toBe(false)
      expect(text(r)).toContain('এই অনুশীলন-টার্মিনালে এই কমান্ডটি')
      expect(kinds(r).every((k) => k === 'hint')).toBe(true)
      expect(vfs.list(vfs.home).length).toBe(before)
    }
  })
  it('explains why it is dangerous', async () => {
    const { run } = rig('mac')
    expect(text(await run('rm -rf x'))).toMatch(/Trash/)
    expect(text(await run('sudo x'))).toMatch(/sudo/)
  })
})

describe('unknown commands and suggestions', () => {
  it('suggests the nearest command', async () => {
    const m = rig('mac')
    const r = await m.run('sl')
    expect(r.ok).toBe(false)
    expect(text(r)).toContain('zsh: command not found: sl')
    expect(text(r)).toContain('আপনি কি ls বোঝাতে চেয়েছেন?')
    expect(text(await m.run('mkdr x'))).toContain('mkdir')
    expect(text(await m.run('claer'))).toContain('clear')
    expect(text(await m.run('pyton3 x'))).toContain('python3')
    expect(text(await m.run('dir'))).toContain('ls')
    expect(text(await m.run('cls'))).toContain('clear')
    expect(text(await m.run('qqqqqq'))).toContain('help')
    const w = rig('windows')
    expect(text(await w.run('touch x'))).toContain('ni')
    expect(text(await w.run('lss'))).toContain('ls')
    expect(text(await w.run('Get-Foo'))).toContain('is not recognized')
  })
  it('levenshtein/nearest basics', () => {
    expect(levenshtein('sl', 'ls')).toBe(1)
    expect(levenshtein('kitten', 'sitting')).toBe(3)
    expect(nearest('xyzxyz', ['ls', 'cd'])).toBeUndefined()
  })
  it('Windows sl is Set-Location (like real PowerShell)', async () => {
    const w = rig('windows')
    await w.run('sl Documents')
    expect(w.s.cwd.name).toBe('Documents')
  })
})

describe('events', () => {
  it('emits a command event per command with the canonical cwd AFTER it ran', async () => {
    const { run, events } = rig('mac')
    await run('mkdir proj')
    await run('cd proj')
    await run('nonsense')
    await run('pwd')
    const cmds = events.filter((e): e is Extract<SimEvent, { type: 'command' }> => e.type === 'command')
    expect(cmds.map((c) => [c.command, c.cwd, c.ok])).toEqual([
      ['mkdir proj', '~', true],
      ['cd proj', '~/proj', true],
      ['nonsense', '~/proj', false],
      ['pwd', '~/proj', true],
    ])
    expect(cmds[3].output).toBe('/Users/anika/proj')
  })
  it('emits per segment for ; and && and skips after a failure', async () => {
    const { run, events, s } = rig('mac')
    await run('mkdir a && cd a && mkdir b')
    expect(s.cwd.name).toBe('a')
    await run('cd zzz && mkdir never')
    expect(s.vfs.resolve('~/a/never')).toBeNull()
    await run('cd zzz; pwd')
    const cmds = events.filter((e) => e.type === 'command').map((e) => (e as { command: string }).command)
    expect(cmds).toEqual(['mkdir a', 'cd a', 'mkdir b', 'cd zzz', 'cd zzz', 'pwd'])
  })
  it('clear sets the clear flag; blank lines do nothing; help is Bengali', async () => {
    const { run, events } = rig('windows')
    expect((await run('cls')).clear).toBe(true)
    expect((await run('clear')).clear).toBe(true)
    expect(await run('   ')).toMatchObject({ lines: [], ok: true })
    expect(events.filter((e) => e.type === 'command')).toHaveLength(2)
    expect(text(await run('help'))).toContain('কমান্ড')
    expect(text(await run('?'))).toContain('Tab')
  })
  it('keeps history', async () => {
    const { run, s } = rig('mac')
    await run('pwd')
    await run('ls')
    expect(s.history).toEqual(['pwd', 'ls'])
  })
})

describe('version checks', () => {
  it('prints fixed plausible versions', async () => {
    const { run } = rig('mac')
    expect(text(await run('python --version'))).toBe('Python 3.12.4')
    expect(text(await run('python3 --version'))).toBe('Python 3.12.4')
    expect(text(await run('node --version'))).toBe('v22.12.0')
    expect(text(await run('node -v'))).toBe('v22.12.0')
    expect(text(await run('git --version'))).toMatch(/^git version 2\.\d+/)
    const w = rig('windows')
    expect(text(await w.run('py --version'))).toBe('Python 3.12.4')
    expect(text(await w.run('git --version'))).toMatch(/^git version 2\.\d+/)
    expect((await w.run('git status')).ok).toBe(false)
  })
})

describe('running code', () => {
  const ok = (output: string): RunResult => ({ ok: true, output, durationMs: 1 })
  function mockRunner(fn: (req: Parameters<Runner['runCode']>[0]) => RunResult): Runner & { runCode: ReturnType<typeof vi.fn> } {
    return {
      runCode: vi.fn(async (req) => fn(req)),
      translateError: vi.fn(() => ({ titleBn: 'শিরোনাম', explanationBn: 'ব্যাখ্যা', tryBn: 'চেষ্টা' })),
    }
  }
  it('python runs a file from the vfs and emits codeRun', async () => {
    const runner = mockRunner(() => ok('Hello\nWorld\n'))
    const { vfs, run, events } = rig('mac', runner)
    vfs.createFile(vfs.home, 'hello.py', 'print("Hello")')
    const r = await run('python3 hello.py')
    expect(r.ok).toBe(true)
    expect(text(r)).toBe('Hello\nWorld')
    expect(runner.runCode).toHaveBeenCalledWith({ language: 'python', code: 'print("Hello")', inputs: [] })
    expect(events).toContainEqual({ type: 'codeRun', language: 'python', output: 'Hello\nWorld\n', ok: true, error: undefined })
    expect(events.filter((e) => e.type === 'command').pop()).toMatchObject({ command: 'python3 hello.py', ok: true, output: 'Hello\nWorld' })
  })
  it('node uses javascript; -c / -e inline code', async () => {
    const runner = mockRunner((req) => ok(req.language))
    const { vfs, run } = rig('windows', runner)
    vfs.createFile(vfs.home, 'a.js', 'console.log(1)')
    expect(text(await run('node a.js'))).toBe('javascript')
    expect(text(await run('python -c "print(1)"'))).toBe('python')
    expect(runner.runCode).toHaveBeenLastCalledWith({ language: 'python', code: 'print(1)', inputs: [] })
  })
  it('shows the English error then the friendly Bengali translation', async () => {
    const runner = mockRunner(() => ({
      ok: false,
      output: 'before',
      error: { name: 'NameError', message: "name 'x' is not defined", line: 1, raw: "NameError: name 'x' is not defined" },
      durationMs: 1,
    }))
    const { vfs, run, events } = rig('mac', runner)
    vfs.createFile(vfs.home, 'bad.py', 'print(x)')
    const r = await run('python bad.py')
    expect(r.ok).toBe(false)
    expect(r.lines.map((l) => [l.kind, l.text])).toEqual([
      ['out', 'before'],
      ['err', "NameError: name 'x' is not defined"],
      ['hint', 'শিরোনাম'],
      ['hint', 'ব্যাখ্যা'],
      ['hint', 'চেষ্টা'],
    ])
    expect(runner.translateError).toHaveBeenCalledWith('python', expect.objectContaining({ name: 'NameError' }))
    expect(events).toContainEqual(expect.objectContaining({ type: 'codeRun', ok: false, error: "name 'x' is not defined" }))
  })
  it('missing file / missing .py extension', async () => {
    const runner = mockRunner(() => ok(''))
    const { vfs, run } = rig('mac', runner)
    vfs.createFile(vfs.home, 'hello.py', 'x')
    const r = await run('python3 hello')
    expect(r.ok).toBe(false)
    expect(text(r)).toContain('hello.py')
    expect(runner.runCode).not.toHaveBeenCalled()
    expect((await run('python3 nofile.py')).ok).toBe(false)
    expect((await run('python3')).ok).toBe(false)
  })
  it('needInput: asks, replays with the answers and prints each line once', async () => {
    const runner = mockRunner((req) => {
      const inputs = req.inputs ?? []
      if (inputs.length === 0) return { ok: true, output: 'Start', needInput: { prompt: 'নাম? ' }, durationMs: 1 }
      if (inputs.length === 1) return { ok: true, output: `Start\nHi ${inputs[0]}`, needInput: { prompt: 'বয়স? ' }, durationMs: 1 }
      return ok(`Start\nHi ${inputs[0]}\nAge ${inputs[1]}\n`)
    })
    const { vfs, run, s, events } = rig('mac', runner)
    vfs.createFile(vfs.home, 'ask.py', 'code')
    const r1 = await run('python3 ask.py')
    expect(r1.prompt).toEqual({ text: 'নাম? ' })
    expect(text(r1)).toBe('Start')
    expect(s.awaitingInput).toBe(true)
    expect(events.filter((e) => e.type === 'command')).toHaveLength(0)
    const r2 = await run('Anika')
    expect(r2.prompt).toEqual({ text: 'বয়স? ' })
    expect(text(r2)).toBe('Hi Anika')
    const r3 = await run('30')
    expect(r3.prompt).toBeUndefined()
    expect(text(r3)).toBe('Age 30')
    expect(s.awaitingInput).toBe(false)
    expect(runner.runCode).toHaveBeenLastCalledWith({ language: 'python', code: 'code', inputs: ['Anika', '30'] })
    expect(s.history).toEqual(['python3 ask.py'])
    const cmd = events.filter((e) => e.type === 'command')
    expect(cmd).toHaveLength(1)
    expect(cmd[0]).toMatchObject({ command: 'python3 ask.py', ok: true, output: 'Start\nHi Anika\nAge 30' })
  })
  it('cancelInput abandons the run; chains continue after input', async () => {
    const runner = mockRunner((req) => ((req.inputs ?? []).length ? ok('done\n') : { ok: true, output: '', needInput: { prompt: '? ' }, durationMs: 1 }))
    const { vfs, run, s } = rig('mac', runner)
    vfs.createFile(vfs.home, 'a.py', 'c')
    await run('python a.py')
    s.cancelInput()
    expect(s.awaitingInput).toBe(false)
    await run('python a.py && echo after')
    const r = await run('x')
    expect(text(r)).toBe('done\nafter')
  })
  it('redirects program output to a file', async () => {
    const runner = mockRunner(() => ok('42\n'))
    const { vfs, run } = rig('mac', runner)
    vfs.createFile(vfs.home, 'a.py', 'c')
    await run('python a.py > out.txt')
    expect(vfs.resolve('out.txt')?.content).toBe('42\n')
  })
})

describe('tab completion', () => {
  const sess = (os: 'windows' | 'mac'): { s: Session; vfs: VirtualFileSystem } => {
    const { s, vfs } = rig(os)
    return { s, vfs }
  }
  it('completes command names uniquely and lists candidates', () => {
    const { s } = sess('mac')
    expect(s.complete('mkd', 3)).toMatchObject({ completed: 'mkdir ', candidates: [] })
    const many = s.complete('c', 1)
    expect(many.candidates).toEqual(expect.arrayContaining(['cat', 'cd', 'clear', 'cp']))
    expect(many.completed).toBe('c')
    expect(s.complete('zzz', 3).completed).toBe('zzz')
  })
  it('completes folders (adds separator) and files (adds space)', () => {
    const { s } = sess('mac')
    expect(s.complete('cd Doc', 6).completed).toBe('cd Documents/')
    expect(s.complete('cd Documents/Fam', 16).completed).toBe('cd Documents/Family/')
    expect(s.complete('cat Documents/Rec', 17).completed).toBe('cat Documents/Recipe.txt ')
    const w = sess('windows')
    expect(w.s.complete('cd doc', 6).completed).toBe('cd Documents\\')
    expect(w.s.complete('type Documents\\sho', 18).completed).toBe('type "Documents\\Shopping List.txt" ')
  })
  it('lists candidates when ambiguous and extends the common prefix', () => {
    const { s, vfs } = sess('mac')
    vfs.mkdir(vfs.home, 'project-a')
    vfs.mkdir(vfs.home, 'project-b')
    const r = s.complete('cd pro', 6)
    expect(r.completed).toBe('cd project-')
    expect(r.candidates).toEqual(['project-a', 'project-b'])
    expect(s.complete('cd D', 4).candidates).toEqual(['Desktop', 'Documents', 'Downloads'])
    expect(s.complete('cd D', 4).completed).toBe('cd D')
  })
  it('handles spaces: escapes on Mac, quotes when already quoted; cd only offers folders', () => {
    const { s, vfs } = sess('mac')
    vfs.mkdir(vfs.home, 'My Stuff')
    vfs.createFile(vfs.home, 'My Notes.txt')
    expect(s.complete('cd My', 5).completed).toBe('cd My\\ Stuff/')
    expect(s.complete('cat "My N', 9).completed).toBe('cat "My Notes.txt" ')
    expect(s.complete('cat My\\ N', 9).completed).toBe('cat My\\ Notes.txt ')
  })
  it('completes after a redirect and in the middle of the line', () => {
    const { s } = sess('mac')
    expect(s.complete('echo hi > Doc', 13).completed).toBe('echo hi > Documents/')
    expect(s.complete('cd Doc xyz', 6).completed).toBe('cd Documents/ xyz')
    expect(s.complete('pwd; mkd', 8).completed).toBe('pwd; mkdir ')
  })
})
