/** Pure engine of the practice terminal (no React): works on the shared VirtualFileSystem and reports `command` SimEvents. */
import type { OsFlavor } from '../../engine/types'
import type { SimEvent } from '../bus'
import { errorMessageEn, VfsError, type VirtualFileSystem, type VNode } from '../vfs'
import type { CodeLanguage, FriendlyError, RunError, RunRequest, RunResult } from '../runner'

/** the real runner is loaded on first use, so the terminal does not pull the (large) runner into the main chunk */
const lazyRunner: Runner = {
  runCode: async (req) => (await import('../runner')).runCode(req),
  translateError: async (language, err) => {
    const m = (await import('../runner')) as unknown as { translateError?: Runner['translateError'] }
    return (m.translateError ?? (await import('../runner/errors')).translateError)(language, err)
  },
}
import { parseLine, tokenize, type Segment } from './parse'
import { pushHistory } from './history'
import { bannerLines, DANGEROUS, dangerousLines, helpLines, VERSIONS } from './messages'

export type LineKind = 'out' | 'err' | 'hint' | 'info'
export interface TermLine {
  text: string
  kind: LineKind
}
export interface Runner {
  runCode: (req: RunRequest) => Promise<RunResult>
  translateError: (language: CodeLanguage, err: RunError) => FriendlyError | Promise<FriendlyError>
}
export interface ExecResult {
  lines: TermLine[]
  clear?: boolean
  cwd: VNode
  ok: boolean
  /** the program asked for input(): show this text as the prompt and send the answer to `exec` */
  prompt?: { text: string }
}
export interface CompleteResult {
  completed: string
  cursor: number
  candidates: string[]
}
export interface Session {
  readonly vfs: VirtualFileSystem
  readonly flavor: OsFlavor
  readonly cwd: VNode
  readonly history: string[]
  /** true while a program waits for an `input()` answer */
  readonly awaitingInput: boolean
  promptString(): string
  banner(): TermLine[]
  exec(line: string): Promise<ExecResult>
  cancelInput(): void
  complete(line: string, cursor: number): CompleteResult
  commandNames(): string[]
}

// ---------- helpers ----------
export function levenshtein(a: string, b: string): number {
  // optimal string alignment distance (adjacent swap counts 1)
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 0; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  return d[a.length][b.length]
}

/** closest candidate within a small distance, else undefined */
export function nearest(word: string, options: readonly string[]): string | undefined {
  const w = word.toLowerCase()
  let best: string | undefined
  let bd = Infinity
  for (const o of options) {
    const dist = levenshtein(w, o.toLowerCase())
    if (dist < bd) {
      bd = dist
      best = o
    }
  }
  const limit = w.length <= 3 ? 1 : 2
  return bd <= limit && best !== undefined && best.toLowerCase() !== w ? best : undefined
}

const WIN_ALIAS: Record<string, string> = {
  pwd: 'pwd', gl: 'pwd', 'get-location': 'pwd',
  ls: 'ls', dir: 'ls', gci: 'ls', 'get-childitem': 'ls',
  cd: 'cd', chdir: 'cd', sl: 'cd', 'set-location': 'cd',
  mkdir: 'mkdir', md: 'mkdir',
  ni: 'newitem', 'new-item': 'newitem',
  cat: 'cat', type: 'cat', gc: 'cat', 'get-content': 'cat',
  echo: 'echo', 'write-output': 'echo', 'write-host': 'echo',
  clear: 'clear', cls: 'clear', 'clear-host': 'clear',
  mv: 'mv', move: 'mv', mi: 'mv', 'move-item': 'mv',
  cp: 'cp', copy: 'cp', cpi: 'cp', 'copy-item': 'cp',
  python: 'python', python3: 'python', py: 'python',
  node: 'node', git: 'git', help: 'help', '?': 'help', exit: 'exit',
}
const MAC_ALIAS: Record<string, string> = {
  pwd: 'pwd', ls: 'ls', cd: 'cd', mkdir: 'mkdir', touch: 'touch', cat: 'cat', echo: 'echo', clear: 'clear', mv: 'mv', cp: 'cp',
  python: 'python', python3: 'python', node: 'node', git: 'git', help: 'help', '?': 'help', exit: 'exit',
}
/** commands of the other OS and what to type here instead */
const CROSS_WIN: Record<string, string> = { touch: 'ni', open: 'ii', python3: 'python', which: 'Get-Command' }
const CROSS_MAC: Record<string, string> = { dir: 'ls', cls: 'clear', type: 'cat', md: 'mkdir', ni: 'touch', copy: 'cp', move: 'mv', py: 'python3', gci: 'ls', 'get-childitem': 'ls', 'get-location': 'pwd' }

const CMDLET: Record<string, string> = { cd: 'Set-Location', ls: 'Get-ChildItem', cat: 'Get-Content', mkdir: 'New-Item', newitem: 'New-Item', cp: 'Copy-Item', mv: 'Move-Item', touch: 'New-Item' }

type Pending = { prompt: string; resume: (answer: string) => Promise<Pending | void> }
interface Run {
  lines: TermLine[]
  shown: number
  ok: boolean
  clear: boolean
  progShown: number
}

const pad2 = (n: number) => String(n).padStart(2, '0')
function winDate(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours()
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}  ${String(h % 12 === 0 ? 12 : h % 12).padStart(2, ' ')}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const bytes = (s: string) => new TextEncoder().encode(s).length
const contentLines = (c: string) => (c === '' ? [] : c.replace(/\r?\n$/, '').split(/\r?\n/))

export function createSession(vfs: VirtualFileSystem, flavor: OsFlavor, runner?: Runner, emit?: (e: SimEvent) => void, startCwd?: VNode): Session {
  const win = flavor === 'windows'
  const run: Runner = runner ?? lazyRunner
  const alias = win ? WIN_ALIAS : MAC_ALIAS
  const history: string[] = []
  let cwd: VNode = startCwd && startCwd.kind === 'folder' ? startCwd : vfs.home
  let pending: { p: Pending; segs: Segment[]; i: number; r: Run } | null = null
  const sepChar = win ? '\\' : '/'
  const isSep = (c: string) => (win ? c === '\\' || c === '/' : c === '/')

  const res = (p: string) => vfs.resolve(p, cwd)
  const full = (arg: string) => (/^([a-zA-Z]:|[\\/]|~)/.test(arg) ? arg : `${vfs.displayPath(cwd).replace(/[\\/]$/, '')}${sepChar}${arg}`)

  function splitParent(p: string): { parent: VNode | null; name: string } {
    const t = p.length > 1 ? p.replace(win ? /[\\/]+$/ : /\/+$/, '') : p
    let idx = -1
    for (let i = t.length - 1; i >= 0; i--)
      if (isSep(t[i])) {
        idx = i
        break
      }
    if (idx < 0) return { parent: cwd, name: t }
    const parent = res(t.slice(0, idx + 1))
    return { parent: parent && parent.kind === 'folder' ? parent : null, name: t.slice(idx + 1) }
  }

  // ----- output helpers -----
  const out = (r: Run, t: string) => r.lines.push({ text: t, kind: 'out' })
  const err = (r: Run, t: string) => {
    r.lines.push({ text: t, kind: 'err' })
    r.ok = false
  }
  const hint = (r: Run, t: string) => r.lines.push({ text: t, kind: 'hint' })
  const info = (r: Run, t: string) => r.lines.push({ text: t, kind: 'info' })

  function notFound(r: Run, cmd: string, arg: string, what: 'folder' | 'file' | 'any' = 'any') {
    if (win) err(r, `${CMDLET[cmd] ?? cmd} : Cannot find path '${full(arg)}' because it does not exist.`)
    else if (cmd === 'cd') err(r, `cd: no such file or directory: ${arg}`)
    else err(r, `${cmd}: ${arg}: No such file or directory`)
    const label = what === 'folder' ? 'ফোল্ডার' : what === 'file' ? 'ফাইল' : 'ফাইল বা ফোল্ডার'
    hint(r, `“${arg}” নামে কোনো ${label} এখানে পাওয়া গেল না। ${win ? 'dir' : 'ls'} লিখে দেখে নিন কী কী আছে, আর বানানটা মিলিয়ে নিন।`)
    const near = !/[\\/]/.test(arg) ? nearest(arg, cwd.children.filter((c) => !c.hidden).map((c) => c.name)) : undefined
    if (near) hint(r, `আপনি কি “${near}” বোঝাতে চেয়েছেন?`)
  }
  function vfsFail(r: Run, cmd: string, arg: string, e: unknown) {
    if (!(e instanceof VfsError)) {
      err(r, `${cmd}: something went wrong`)
      return
    }
    if (e.code === 'exists') {
      err(r, win ? `${CMDLET[cmd] ?? cmd} : An item with the specified name ${full(arg)} already exists.` : `${cmd}: ${arg}: File exists`)
      hint(r, `“${arg}” নামে এখানে আগেই কিছু আছে। অন্য একটা নাম বেছে নিন।`)
    } else if (e.code === 'invalidName') {
      err(r, `${cmd}: ${errorMessageEn(e, flavor)}`)
      hint(r, win ? 'নামে \\ / : * ? " < > | চিহ্নগুলো চলে না। নামটা একটু বদলে আবার চেষ্টা করুন।' : 'নামে “/” আর “:” চলে না, নাম খালিও রাখা যায় না।')
    } else if (e.code === 'protected') {
      err(r, `${cmd}: ${errorMessageEn(e, flavor)}`)
      hint(r, `“${arg}” কম্পিউটারের নিজস্ব জরুরি জিনিস, তাই এটা বদলানো যায় না।`)
    } else if (e.code === 'intoSelf') {
      err(r, `${cmd}: ${errorMessageEn(e, flavor)}`)
      hint(r, 'একটা ফোল্ডারকে তার নিজের ভেতরে রাখা যায় না।')
    } else if (e.code === 'notFolder') {
      err(r, `${cmd}: ${arg}: Not a directory`)
      hint(r, `“${arg}” একটি ফাইল, ফোল্ডার নয়।`)
    } else err(r, `${cmd}: ${errorMessageEn(e, flavor)}`)
  }
  function missing(r: Run, cmd: string, example: string) {
    err(r, win ? `${cmd} : Missing an argument.` : `${cmd}: missing operand`)
    hint(r, `কমান্ডের পরে একটা নাম দিতে হয়, যেমন: ${example}`)
  }

  const isFlag = (a: string) => /^-[A-Za-z]/.test(a)

  // ----- listing -----
  function winRow(n: VNode) {
    const dt = winDate(n.modifiedAt)
    const mode = (n.kind === 'folder' ? 'd' : '-') + (n.kind === 'file' ? 'a' : '-') + '-' + (n.hidden ? 'h' : '-') + '--'
    const len = n.kind === 'file' ? String(bytes(n.content)) : ''
    return mode.padEnd(34 - dt.length) + dt + len.padStart(15) + ' ' + n.name
  }
  function winTable(r: Run, dir: VNode, items: VNode[]) {
    if (!items.length) return
    out(r, '')
    out(r, `    Directory: ${vfs.displayPath(dir)}`)
    out(r, '')
    out(r, 'Mode                 LastWriteTime         Length Name')
    out(r, '----                 -------------         ------ ----')
    items.forEach((n) => out(r, winRow(n)))
    out(r, '')
  }
  function macColumns(names: string[]): string[] {
    if (names.length === 0) return []
    const w = Math.max(...names.map((n) => n.length)) + 2
    const cols = Math.max(1, Math.floor(80 / w))
    const rows = Math.ceil(names.length / cols)
    const res: string[] = []
    for (let r = 0; r < rows; r++) {
      let line = ''
      for (let c = 0; c < cols; c++) {
        const n = names[c * rows + r]
        if (n === undefined) continue
        line += c * rows + r + rows < names.length ? n.padEnd(w) : n
      }
      res.push(line.trimEnd())
    }
    return res
  }
  function macLong(n: VNode): string {
    const d = new Date(n.modifiedAt)
    const size = n.kind === 'folder' ? 96 : bytes(n.content)
    return `${n.kind === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${n.kind === 'folder' ? String(2 + n.children.filter((c) => c.kind === 'folder').length).padStart(2) : ' 1'} ${vfs.userName.toLowerCase()}  staff  ${String(size).padStart(6)} ${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2)} ${pad2(d.getHours())}:${pad2(d.getMinutes())} ${n.name}`
  }

  function cmdLs(args: string[], r: Run) {
    const flags = args.filter(isFlag)
    const targets = args.filter((a) => !isFlag(a))
    let showHidden = false
    let long = false
    if (win) {
      for (const f of flags) {
        if (/^-(force|hidden)$/i.test(f)) showHidden = true
        else {
          err(r, `Get-ChildItem : A parameter cannot be found that matches parameter name '${f.slice(1)}'.`)
          hint(r, 'Windows PowerShell-এ ls বা dir-এর সঙ্গে -l, -a লাগে না। শুধু ls লিখুন। লুকানো ফাইলও দেখতে চাইলে ls -Force লিখুন।')
          return
        }
      }
    } else {
      for (const f of flags) {
        for (const ch of f.slice(1)) {
          if (ch === 'a' || ch === 'A') showHidden = true
          else if (ch === 'l') long = true
          else if (!'hF1GRt'.includes(ch)) {
            err(r, `ls: illegal option -- ${ch}`)
            hint(r, 'ls-এর পরে সাধারণত -l (বিস্তারিত) বা -a (লুকানোসহ) দেওয়া হয়, যেমন: ls -la')
            return
          }
        }
      }
    }
    const paths = targets.length ? targets : ['.']
    paths.forEach((p, idx) => {
      const node = res(p)
      if (!node) return notFound(r, 'ls', p)
      let items: VNode[]
      let dir: VNode
      if (node.kind === 'file') {
        items = [node]
        dir = node.parent ?? cwd
      } else {
        items = vfs.list(node, { showHidden })
        dir = node
      }
      if (win) return winTable(r, dir, items)
      if (paths.length > 1 && node.kind === 'folder') {
        if (idx > 0) out(r, '')
        out(r, `${p}:`)
      }
      if (long) {
        if (node.kind === 'folder') out(r, `total ${items.length * 8}`)
        const list = showHidden && node.kind === 'folder' ? [{ ...node, name: '.' } as VNode, { ...(node.parent ?? node), name: '..' } as VNode, ...items] : items
        list.forEach((n) => out(r, macLong(n)))
      } else {
        const names = (showHidden && node.kind === 'folder' ? ['.', '..'] : []).concat(items.map((n) => n.name))
        macColumns(names).forEach((l) => out(r, l))
      }
    })
  }

  function cmdCd(args: string[], r: Run) {
    let a = args.slice()
    if (win && a[0]?.toLowerCase() === '/d') a.shift()
    a = a.filter((x) => !(win && /^-path$/i.test(x)))
    if (a.length === 0) {
      cwd = vfs.home
      return
    }
    if (a.length > 1) {
      err(r, win ? `Set-Location : A positional parameter cannot be found that accepts argument '${a[1]}'.` : `cd: string not in pwd: ${a[0]}`)
      hint(r, `নামে ফাঁকা (স্পেস) থাকলে পুরো নামটা উদ্ধৃতি চিহ্নের ভেতরে লিখুন, যেমন: cd "${a.join(' ')}"`)
      return
    }
    const t = res(a[0])
    if (!t) return notFound(r, 'cd', a[0], 'folder')
    if (t.kind !== 'folder') {
      err(r, win ? `Set-Location : Cannot set location because path '${full(a[0])}' is not a directory.` : `cd: not a directory: ${a[0]}`)
      hint(r, `“${a[0]}” একটি ফাইল, ফোল্ডার নয়। cd দিয়ে শুধু ফোল্ডারে ঢোকা যায়।`)
      return
    }
    cwd = t
  }

  function cmdMkdir(args: string[], r: Run) {
    const names = args.filter((a) => !isFlag(a))
    const parents = win || args.some((a) => /^-[a-z]*p/i.test(a) && !win)
    if (!names.length) return missing(r, 'mkdir', 'mkdir নতুন-ফোল্ডার')
    for (const p of names) {
      try {
        if (parents && /[\\/]/.test(p.replace(win ? /[\\/]+$/ : /\/+$/, ''))) {
          const parts = p.split(win ? /[\\/]/ : /\//)
          let acc = ''
          let created: VNode | null = null
          for (let i = 0; i < parts.length; i++) {
            if (parts[i] === '') {
              if (i === 0) acc = '/'
              continue
            }
            const prev = acc
            acc = acc === '' ? parts[i] : acc.endsWith('/') ? acc + parts[i] : `${acc}/${parts[i]}`
            if (!res(acc)) created = vfs.mkdir(res(prev === '' ? '.' : prev)!, parts[i])
          }
          if (created && win) winTable(r, created.parent!, [created])
          else if (!created && !win) continue
          else if (!created) throw new VfsError('exists', p)
          continue
        }
        const { parent, name } = splitParent(p)
        if (!parent) {
          err(r, `mkdir: ${p}: No such file or directory`)
          hint(r, 'ভেতরের ফোল্ডারটা আগে নেই। আগে বাইরের ফোল্ডার বানান, অথবা mkdir -p লিখুন (ভেতরে ভেতরে সব বানিয়ে দেয়)।')
          r.ok = false
          continue
        }
        if (parents && !win && res(p)?.kind === 'folder') continue
        const n = vfs.mkdir(parent, name)
        if (win) winTable(r, parent, [n])
      } catch (e) {
        vfsFail(r, 'mkdir', p, e)
      }
    }
  }

  function cmdNewItem(args: string[], r: Run) {
    let type = 'file'
    let name: string | undefined
    let path: string | undefined
    let value: string | undefined
    const pos: string[] = []
    for (let i = 0; i < args.length; i++) {
      const a = args[i]
      const l = a.toLowerCase()
      if (l === '-itemtype' || l === '-type') type = (args[++i] ?? 'file').toLowerCase()
      else if (l === '-name') name = args[++i]
      else if (l === '-path') path = args[++i]
      else if (l === '-value') value = args[++i]
      else if (l === '-force') continue
      else if (isFlag(a)) {
        err(r, `New-Item : A parameter cannot be found that matches parameter name '${a.slice(1)}'.`)
        hint(r, 'ni-এর সঙ্গে ফাইলের নাম দিন, যেমন: ni notes.txt। ফোল্ডার বানাতে: ni নাম -ItemType Directory')
        return
      } else pos.push(a)
    }
    if (!path && pos.length) path = pos[0]
    if (!name && !path) return missing(r, 'New-Item', 'ni notes.txt')
    let parent: VNode | null
    let finalName: string
    if (name) {
      parent = path ? res(path) : cwd
      finalName = name
    } else {
      const sp = splitParent(path!)
      parent = sp.parent
      finalName = sp.name
    }
    if (!parent || parent.kind !== 'folder') return notFound(r, 'ni', path ?? '.', 'folder')
    try {
      const isDir = /^(d|dir|directory|folder)$/.test(type)
      const n = isDir ? vfs.mkdir(parent, finalName) : vfs.createFile(parent, finalName, value ?? '')
      winTable(r, parent, [n])
    } catch (e) {
      vfsFail(r, 'New-Item', finalName, e)
    }
  }

  function cmdTouch(args: string[], r: Run) {
    const names = args.filter((a) => !isFlag(a))
    if (!names.length) return missing(r, 'touch', 'touch notes.txt')
    for (const p of names) {
      const ex = res(p)
      if (ex) {
        ex.modifiedAt = Date.now()
        continue
      }
      const { parent, name } = splitParent(p)
      if (!parent) {
        err(r, `touch: ${p}: No such file or directory`)
        hint(r, 'ভেতরের ফোল্ডারটা এখানে নেই। নামটা আবার দেখে নিন।')
        continue
      }
      try {
        vfs.createFile(parent, name)
      } catch (e) {
        vfsFail(r, 'touch', p, e)
      }
    }
  }

  function cmdCat(args: string[], r: Run) {
    const names = args.filter((a) => !(isFlag(a) && !win) && !(win && /^-path$/i.test(a)))
    if (!names.length) return missing(r, win ? 'Get-Content' : 'cat', win ? 'type notes.txt' : 'cat notes.txt')
    for (const p of names) {
      const n = res(p)
      if (!n) {
        notFound(r, 'cat', p, 'file')
        continue
      }
      if (n.kind === 'folder') {
        err(r, win ? `Get-Content : Access to the path '${full(p)}' is denied.` : `cat: ${p}: Is a directory`)
        hint(r, `“${p}” একটি ফোল্ডার। ভেতরে কী আছে দেখতে ${win ? 'dir' : 'ls'} ব্যবহার করুন; ফাইলের লেখা দেখতে ফাইলের নাম দিন।`)
        continue
      }
      contentLines(n.content).forEach((l) => out(r, l))
    }
  }

  function cmdMvCp(kind: 'mv' | 'cp', args: string[], r: Run) {
    const rec = args.some((a) => /^-(r|recurse)$/i.test(a))
    const names = args.filter((a) => !isFlag(a))
    if (names.length < 2) {
      err(r, win ? `${CMDLET[kind]} : Missing an argument.` : `usage: ${kind} source target`)
      hint(r, `দুটো নাম লাগে — কোনটা, আর কোথায়। যেমন: ${kind} notes.txt Documents`)
      return
    }
    const destArg = names[names.length - 1]
    const srcs = names.slice(0, -1)
    const destNode = res(destArg)
    for (const s of srcs) {
      const node = res(s)
      if (!node) {
        notFound(r, kind, s)
        continue
      }
      if (kind === 'cp' && node.kind === 'folder' && !win && !rec) {
        err(r, `cp: ${s} is a directory (not copied).`)
        hint(r, 'ফোল্ডার কপি করতে cp -r লিখতে হয়, যেমন: cp -r ফোল্ডার নতুন-নাম')
        continue
      }
      try {
        if (destNode && destNode.kind === 'folder') {
          if (kind === 'mv') vfs.move(node, destNode)
          else vfs.copy(node, destNode)
        } else if (destNode) {
          err(r, win ? `${CMDLET[kind]} : Cannot overwrite the item ${full(destArg)} with itself or an existing file.` : `${kind}: ${destArg}: File exists`)
          hint(r, `“${destArg}” নামে একটা ফাইল আগেই আছে। অন্য নাম বা ফোল্ডার দিন।`)
        } else {
          if (srcs.length > 1) {
            notFound(r, kind, destArg, 'folder')
            break
          }
          const { parent, name } = splitParent(destArg)
          if (!parent) {
            notFound(r, kind, destArg, 'folder')
            continue
          }
          if (kind === 'mv') {
            const moved = node.parent === parent ? node : vfs.move(node, parent)
            if (moved.name !== name) vfs.rename(moved, name)
          } else {
            const clone = vfs.copy(node, parent)
            if (clone.name !== name) vfs.rename(clone, name)
          }
        }
      } catch (e) {
        vfsFail(r, kind, s, e)
      }
    }
  }

  async function runProgram(lang: CodeLanguage, code: string, inputs: string[], r: Run): Promise<Pending | void> {
    const res0 = await run.runCode({ language: lang, code, inputs })
    const outLines = res0.output === '' ? [] : res0.output.replace(/\n$/, '').split('\n')
    outLines.slice(r.progShown).forEach((l) => out(r, l))
    r.progShown = outLines.length
    if (res0.needInput) {
      return { prompt: res0.needInput.prompt, resume: (ans) => runProgram(lang, code, [...inputs, ans], r) }
    }
    const e = res0.error
    if (!res0.ok && e) {
      ;(e.raw || `${e.name}: ${e.message}`).split('\n').forEach((l) => err(r, l))
      try {
        const f = await run.translateError(lang, e)
        hint(r, f.titleBn)
        hint(r, f.explanationBn)
        hint(r, f.tryBn)
      } catch {
        /* no translation available */
      }
    } else if (!res0.ok) {
      r.ok = false
      if (res0.timedOut) hint(r, 'প্রোগ্রামটি অনেকক্ষণ ধরে চলছে, তাই থামিয়ে দেওয়া হয়েছে। হয়তো কোথাও একই কাজ বারবার চলছে (লুপ)।')
    }
    emit?.({ type: 'codeRun', language: lang, output: res0.output, ok: res0.ok, error: e?.message })
    return
  }

  async function cmdProgram(lang: CodeLanguage, cmdName: string, args: string[], r: Run): Promise<Pending | void> {
    const l = cmdName.toLowerCase()
    if (args[0] === '--version' || args[0] === '-V' || args[0] === '-v' || args[0] === '-version') {
      out(r, lang === 'python' ? VERSIONS.python : VERSIONS.node)
      return
    }
    const inlineFlag = lang === 'python' ? '-c' : '-e'
    if (args[0] === inlineFlag && args[1] !== undefined) return runProgram(lang, args[1], [], r)
    const file = args.find((a) => !isFlag(a))
    if (!file) {
      err(r, lang === 'python' ? 'Python needs a file to run.' : 'Node needs a file to run.')
      hint(r, `এই অনুশীলন-টার্মিনালে ফাইলের নামসহ লিখতে হয়, যেমন: ${l} hello.${lang === 'python' ? 'py' : 'js'}`)
      return
    }
    const n = res(file)
    if (!n || n.kind !== 'file') {
      if (lang === 'python') err(r, `${l}: can't open file '${full(file)}': [Errno 2] No such file or directory`)
      else err(r, `Error: Cannot find module '${full(file)}'`)
      hint(r, `“${file}” নামে কোনো ফাইল এখানে নেই। ${win ? 'dir' : 'ls'} লিখে ফাইলের নাম আর বানান দেখে নিন, আর ঠিক ফোল্ডারে আছেন কিনা দেখুন (pwd)।`)
      const ext = lang === 'python' ? '.py' : '.js'
      if (!n && res(file + ext)) hint(r, `“${file}${ext}” নামে একটা ফাইল আছে — ফাইলের নামের শেষে ${ext} যোগ করুন।`)
      const near = !/[\\/]/.test(file) ? nearest(file, cwd.children.filter((c) => c.kind === 'file').map((c) => c.name)) : undefined
      if (near) hint(r, `আপনি কি “${near}” বোঝাতে চেয়েছেন?`)
      return
    }
    return runProgram(lang, n.content, [], r)
  }

  function cmdGit(args: string[], r: Run) {
    if (args[0] === '--version' || args[0] === '-v') out(r, win ? VERSIONS.gitWindows : VERSIONS.gitMac)
    else {
      err(r, 'git: this practice terminal only supports: git --version')
      hint(r, 'এই অনুশীলন-টার্মিনালে git-এর শুধু সংস্করণ দেখা যায়: git --version')
    }
  }

  const enabledNames = () => Object.keys(alias).filter((k) => k !== '?')

  function unknown(r: Run, name: string) {
    if (win) err(r, `${name} : The term '${name}' is not recognized as the name of a cmdlet, function, script file, or operable program.`)
    else err(r, `zsh: command not found: ${name}`)
    const l = name.toLowerCase()
    if (/^cd\.\.+$/.test(l)) {
      hint(r, 'cd আর .. এর মাঝে একটা ফাঁকা (স্পেস) দিতে হয়। এভাবে লিখুন: cd ..')
      return
    }
    const cross = (win ? CROSS_WIN : CROSS_MAC)[l]
    if (cross) {
      hint(r, `${win ? 'Windows' : 'Mac'}-এ এই কমান্ডের বদলে ${cross} লিখুন। আপনি কি ${cross} বোঝাতে চেয়েছেন?`)
      return
    }
    const best = nearest(l, [...enabledNames(), ...DANGEROUS].filter((x) => !DANGEROUS.has(x)))
    if (best) hint(r, `আপনি কি ${best} বোঝাতে চেয়েছেন?`)
    else hint(r, 'এই নামে কোনো কমান্ড চেনা যাচ্ছে না। কোন কোন কমান্ড চলে দেখতে help লিখুন।')
  }

  async function runSegment(seg: Segment, r: Run): Promise<Pending | void> {
    const [rawName, ...args] = seg.words
    if (!rawName) {
      // only a redirect like `> file`
      return
    }
    const lname = rawName.toLowerCase()
    if (DANGEROUS.has(lname)) {
      dangerousLines(rawName).forEach((t) => hint(r, t))
      r.ok = false
      return
    }
    const id = win ? alias[lname] : alias[rawName]
    if (!id) return unknown(r, rawName)
    switch (id) {
      case 'pwd':
        if (win) ['', 'Path', '----', vfs.displayPath(cwd), ''].forEach((t) => out(r, t))
        else out(r, vfs.displayPath(cwd))
        return
      case 'ls': return cmdLs(args, r)
      case 'cd': return cmdCd(args, r)
      case 'mkdir': return cmdMkdir(args, r)
      case 'newitem': return cmdNewItem(args, r)
      case 'touch': return cmdTouch(args, r)
      case 'cat': return cmdCat(args, r)
      case 'echo': out(r, args.join(' ')); return
      case 'clear': r.clear = true; return
      case 'mv': return cmdMvCp('mv', args, r)
      case 'cp': return cmdMvCp('cp', args, r)
      case 'python': return cmdProgram('python', rawName, args, r)
      case 'node': return cmdProgram('javascript', rawName, args, r)
      case 'git': return cmdGit(args, r)
      case 'help': helpLines(flavor).forEach((t) => info(r, t)); return
      case 'exit':
        hint(r, 'এই অনুশীলন-টার্মিনাল বন্ধ করতে জানালার উপরের ✕ বোতামে চাপ দিন।')
        return
    }
  }

  function applyRedirect(seg: Segment, r: Run) {
    const rd = seg.redirect
    if (!rd) return
    const text = r.lines.filter((l) => l.kind === 'out').map((l) => l.text)
    r.lines = r.lines.filter((l) => l.kind !== 'out')
    r.shown = Math.min(r.shown, r.lines.length)
    const { parent, name } = splitParent(rd.target)
    if (!parent) {
      err(r, win ? `Out-File : Could not find a part of the path '${full(rd.target)}'.` : `zsh: no such file or directory: ${rd.target}`)
      hint(r, 'যে ফোল্ডারে ফাইল বানাতে চাইছেন সেটা এখানে নেই। আগে mkdir দিয়ে বানিয়ে নিন।')
      return
    }
    try {
      const existing = vfs.child(parent, name)
      const add = text.length ? text.join('\n') + '\n' : '\n'
      if (existing && existing.kind === 'folder') throw new VfsError('exists', name)
      if (rd.mode === '>>' && existing) vfs.writeFile(existing, existing.content + (existing.content && !existing.content.endsWith('\n') ? '\n' : '') + add)
      else vfs.saveAs(parent, name, text.length ? add : '')
    } catch (e) {
      vfsFail(r, 'redirect', rd.target, e)
    }
  }

  async function finishSegment(seg: Segment, r: Run) {
    applyRedirect(seg, r)
    emit?.({
      type: 'command',
      command: seg.raw,
      cwd: vfs.canonPath(cwd),
      ok: r.ok,
      output: r.lines.filter((l) => l.kind !== 'hint' && l.kind !== 'info').map((l) => l.text).join('\n'),
    })
  }

  /** run segments from index `i`; `first` continues an interrupted segment */
  async function drive(segs: Segment[], i: number, display: TermLine[], first?: { r: Run; p: Promise<Pending | void> }): Promise<ExecResult> {
    let overallOk = true
    let clear = false
    let lastOk = true
    for (; i < segs.length; i++) {
      const seg = segs[i]
      let r: Run
      let p: Promise<Pending | void>
      if (first) {
        r = first.r
        p = first.p
        first = undefined
      } else {
        if (seg.join === '&&' && !lastOk) continue
        r = { lines: [], shown: 0, ok: true, clear: false, progShown: 0 }
        p = runSegment(seg, r)
      }
      let pend: Pending | void = undefined
      try {
        pend = await p
      } catch (e) {
        err(r, `Internal error: ${(e as Error).message}`)
      }
      if (pend) {
        display.push(...r.lines.slice(r.shown))
        r.shown = r.lines.length
        pending = { p: pend, segs, i, r }
        return { lines: display, clear, cwd, ok: true, prompt: { text: pend.prompt } }
      }
      await finishSegment(seg, r)
      if (r.clear) {
        clear = true
        display.length = 0
      }
      display.push(...r.lines.slice(r.shown))
      lastOk = r.ok
      overallOk = overallOk && r.ok
    }
    return { lines: display, clear: clear || undefined, cwd, ok: overallOk }
  }

  async function exec(line: string): Promise<ExecResult> {
    if (pending) {
      const pd = pending
      pending = null
      const display: TermLine[] = []
      const p = pd.p.resume(line)
      return drive(pd.segs, pd.i, display, { r: pd.r, p })
    }
    if (line.trim() === '') return { lines: [], cwd, ok: true }
    pushHistory(history, line)
    const parsed = parseLine(line, flavor)
    if (!parsed.ok) {
      const msg =
        parsed.error === 'unterminatedQuote'
          ? 'উদ্ধৃতি চিহ্ন (" বা \') খুলে বন্ধ করা হয়নি। শুরু আর শেষে একই চিহ্ন দিন, যেমন: echo "নমুনা লেখা"'
          : parsed.error === 'missingRedirectTarget'
            ? '> চিহ্নের পরে ফাইলের নাম দিতে হয়, যেমন: echo hello > notes.txt'
            : '&& চিহ্নের আগে একটা কমান্ড লাগে।'
      return { lines: [{ text: msg, kind: 'hint' }], cwd, ok: false }
    }
    return drive(parsed.segments, 0, [])
  }

  // ---------- tab completion ----------
  function scan(before: string) {
    let quote: string | null = null
    let wordStart = -1
    let first = true // no word yet in this command
    let wordIdx = 0
    let cmdWord = ''
    let afterRedirect = false
    for (let i = 0; i < before.length; i++) {
      const c = before[i]
      if (quote) {
        if (c === quote) quote = null
        continue
      }
      if (!win && c === '\\' && i + 1 < before.length) {
        if (wordStart < 0) wordStart = i
        i++
        continue
      }
      if (c === '"' || c === "'") {
        if (wordStart < 0) wordStart = i
        quote = c
        continue
      }
      if (/\s/.test(c)) {
        if (wordStart >= 0) {
          if (wordIdx === 0 && !afterRedirect) cmdWord = before.slice(wordStart, i)
          wordIdx++
          wordStart = -1
          afterRedirect = false
        }
        continue
      }
      if (c === ';' || (c === '&' && before[i + 1] === '&')) {
        if (c === '&') i++
        wordStart = -1
        wordIdx = 0
        cmdWord = ''
        first = true
        afterRedirect = false
        continue
      }
      if (c === '>') {
        if (before[i + 1] === '>') i++
        wordStart = -1
        afterRedirect = true
        continue
      }
      if (wordStart < 0) wordStart = i
    }
    void first
    return { wordStart: wordStart < 0 ? before.length : wordStart, quote, cmdPos: wordIdx === 0 && !afterRedirect, cmdWord: cmdWord.toLowerCase() }
  }

  const needsQuote = (s: string) => (win ? /[\s;&'"`$()@{}#,]/.test(s) : /[\s;&'"`$()<>|*?#\\[\]{}!~]/.test(s))
  function formatWord(text: string, quote: string | null, close: boolean): string {
    if (quote) return quote + text + (close ? quote : '')
    if (!needsQuote(text)) return text
    if (win) return `"${text}${close ? '"' : ''}`
    return text.replace(/([\s;&'"`$()<>|*?#\\[\]{}!~])/g, '\\$1')
  }
  const lcp = (xs: string[]) => {
    let p = xs[0]
    for (const x of xs) while (!x.toLowerCase().startsWith(p.toLowerCase())) p = p.slice(0, -1)
    return p
  }

  function complete(line: string, cursor: number): CompleteResult {
    const before = line.slice(0, cursor)
    const after = line.slice(cursor)
    const { wordStart, quote, cmdPos, cmdWord } = scan(before)
    const rawWord = before.slice(wordStart)
    let partial: string
    if (quote) partial = rawWord.replace(new RegExp(`^[^${quote}]*${quote}`), '')
    else partial = tokenize(rawWord, flavor)?.[0]?.text ?? rawWord
    const unchanged: CompleteResult = { completed: line, cursor, candidates: [] }
    const rebuild = (word: string): CompleteResult['completed'] => before.slice(0, wordStart) + word + after
    if (cmdPos && !quote) {
      const names = enabledNames().filter((n) => n.toLowerCase().startsWith(partial.toLowerCase()) && partial !== '').sort()
      if (!names.length) return unchanged
      const word = names.length === 1 ? names[0] + ' ' : lcp(names)
      return { completed: rebuild(word), cursor: wordStart + word.length, candidates: names.length > 1 ? names : [] }
    }
    // path completion
    let dirPart = ''
    let namePart = partial
    for (let i = partial.length - 1; i >= 0; i--)
      if (isSep(partial[i])) {
        dirPart = partial.slice(0, i + 1)
        namePart = partial.slice(i + 1)
        break
      }
    if (partial === '~') return unchanged
    const dirNode = dirPart ? res(dirPart) : cwd
    if (!dirNode || dirNode.kind !== 'folder') return unchanged
    const dirsOnly = ['cd', 'chdir', 'sl', 'set-location'].includes(cmdWord)
    const matches = dirNode.children
      .filter((c) => (!c.hidden || namePart.startsWith('.')) && c.name.toLowerCase().startsWith(namePart.toLowerCase()) && (!dirsOnly || c.kind === 'folder'))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
    if (!matches.length) return unchanged
    if (matches.length === 1) {
      const m = matches[0]
      const isFile = m.kind === 'file'
      const text = dirPart + m.name + (isFile ? '' : sepChar)
      let word = formatWord(text, quote, isFile)
      if (isFile) word += ' '
      return { completed: rebuild(word), cursor: wordStart + word.length, candidates: [] }
    }
    const common = lcp(matches.map((m) => m.name))
    const text = dirPart + (common.length >= namePart.length ? common : namePart)
    const word = formatWord(text, quote, false)
    return { completed: rebuild(word), cursor: wordStart + word.length, candidates: matches.map((m) => m.name) }
  }

  const homeUser = vfs.userName.toLowerCase()
  return {
    vfs,
    flavor,
    get cwd() {
      return cwd
    },
    history,
    get awaitingInput() {
      return pending !== null
    },
    promptString() {
      if (win) return `PS ${vfs.displayPath(cwd)}> `
      const label = cwd === vfs.home ? '~' : cwd.parent ? cwd.name : '/'
      return `${homeUser}@Mac ${label} % `
    },
    banner: () => bannerLines(flavor).map((text, i) => ({ text, kind: i === 3 ? 'hint' : 'info' }) as TermLine),
    exec,
    cancelInput() {
      pending = null
    },
    complete,
    commandNames: enabledNames,
  }
}
