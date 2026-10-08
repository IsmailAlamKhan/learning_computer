/** Code Editor window app: project explorer + tabs + CodeMirror 6 + Run output + sandboxed HTML live preview. */
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { useDesktop, useWindowCombos } from '../DesktopContext'
import { errorMessageEn, type VNode } from '../vfs'
import type { WinState } from '../windowManager'
import { attached, findNode } from '../apps/util'
import { FolderIcon, NodeIcon } from '../ui/icons'
import type { FriendlyError, RunResult } from '../runner/types'
import { coreExtensions, languageExtension, setErrorLine, themeExtension } from './cm'
import { activateTab, buildPreviewDocument, closeTab, describeError, emptyTabs, extractVisibleText, fileKindOf, isDirty, openTab, runnableLanguage, runWithReplay, type TabsState } from './logic'

const DEFAULT_FOLDER = '~/coding'
let pythonWarmed = false

/** Resolve a `~/a/b` style folder, creating the missing folders. */
function ensureFolder(vfs: import('../vfs').VirtualFileSystem, path: string): VNode {
  const hit = vfs.resolve(path)
  if (hit && hit.kind === 'folder') return hit
  let cur = vfs.home
  const parts = path.replace(/^~[\\/]?/, '').split(/[\\/]+/).filter(Boolean)
  for (const p of parts) cur = vfs.child(cur, p)?.kind === 'folder' ? vfs.child(cur, p)! : vfs.mkdir(cur, p)
  return cur
}

/** All text files below `folder` as {relative/path: content}, using unsaved drafts where present. */
function collectFiles(folder: VNode, drafts: Record<string, string>, prefix = '', out: Record<string, string> = {}): Record<string, string> {
  for (const c of folder.children) {
    if (c.kind === 'folder') collectFiles(c, drafts, `${prefix}${c.name}/`, out)
    else if (!c.media) out[`${prefix}${c.name}`] = drafts[c.id] ?? c.content
  }
  return out
}

interface PendingInput {
  prompt: string
  resolve: (v: string) => void
  reject: (e: Error) => void
}
type RunUi =
  | { status: 'idle' }
  | { status: 'running'; language: 'python' | 'javascript'; slowStart: boolean }
  | { status: 'done'; result: RunResult; friendly?: FriendlyError; language: 'python' | 'javascript'; fileName: string }
  | { status: 'stopped' }

export function CodeEditor({ win }: { win: WinState }) {
  const d = useDesktop()
  const dRef = useRef(d)
  dRef.current = d
  const { vfs, os } = d
  const simDark = d.sim.darkMode
  // The simulated window already renders every app through `filter: invert(0.92) hue-rotate(180deg)` in dark mode
  // (ui/Window.tsx). Drawing our own dark palette on top would be inverted back to light, so in sim dark mode we keep
  // the light palette and let that filter produce the dark look. Set to `simDark` if the window filter is ever removed.
  const dark = false
  const folderProp = typeof win.props?.folder === 'string' ? win.props.folder : DEFAULT_FOLDER
  const fileProp = typeof win.props?.file === 'string' ? win.props.file : undefined
  const propN = win.props?._n

  const root = useMemo(() => ensureFolder(vfs, folderProp), [vfs, folderProp])

  const [tabsState, setTabsState] = useState<TabsState>(emptyTabs)
  const [texts, setTexts] = useState<Record<string, string>>({})
  const textsRef = useRef(texts)
  textsRef.current = texts
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [targetFolder, setTargetFolder] = useState<VNode | null>(null)
  const [creating, setCreating] = useState<null | { kind: 'file' | 'folder'; name: string; error?: string }>(null)
  const [dlg, setDlg] = useState<null | { kind: 'tab'; id: string } | { kind: 'window' }>(null)
  const [previewOn, setPreviewOn] = useState(true)
  const [srcDoc, setSrcDoc] = useState<string | null>(null)
  const [runUi, setRunUi] = useState<RunUi>({ status: 'idle' })
  const [pending, setPending] = useState<PendingInput | null>(null)
  const [answer, setAnswer] = useState('')
  const [wide, setWide] = useState(true)

  const hostRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const statesRef = useRef(new Map<string, EditorState>())
  const currentRef = useRef<string | null>(null)
  const lastSavedRef = useRef(new Map<string, string>())
  const themeComp = useRef(new Compartment()).current
  const silent = useRef(false)
  const editTimer = useRef<number | undefined>(undefined)
  const runSeq = useRef(0)
  const pendingRef = useRef<PendingInput | null>(null)
  pendingRef.current = pending

  const nodeOf = useCallback((id: string): VNode | null => {
    const n = findNode(vfs.root, id)
    return n && n.kind === 'file' && attached(n, vfs.root) ? n : null
  }, [vfs])

  // ---- derived tab info (tabs whose file disappeared are dropped)
  const liveTabs = tabsState.tabs.filter((id) => nodeOf(id))
  const activeId = tabsState.active && liveTabs.includes(tabsState.active) ? tabsState.active : liveTabs[liveTabs.length - 1] ?? null
  const activeNode = activeId ? nodeOf(activeId) : null
  const dirtyOf = (id: string) => {
    const n = nodeOf(id)
    return !!n && isDirty(texts[id], n.content)
  }
  const anyDirty = liveTabs.some(dirtyOf)

  useEffect(() => {
    if (liveTabs.length !== tabsState.tabs.length) setTabsState((s) => ({ tabs: s.tabs.filter((id) => nodeOf(id)), active: activeId }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vfs, d.vfsVersion])

  const title = `${activeNode ? `${dirtyOf(activeId!) ? '● ' : ''}${activeNode.name} - ` : ''}Code Editor`
  useEffect(() => {
    d.wmDispatch({ type: 'setTitle', id: win.id, title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, win.id])

  // ---- debounced "typed" events for lessons
  const scheduleEditEvents = useCallback((text: string) => {
    window.clearTimeout(editTimer.current)
    editTimer.current = window.setTimeout(() => {
      dRef.current.emit({ type: 'type', target: 'code-editor', value: text })
      dRef.current.emit({ type: 'custom', event: 'code-edited' })
    }, 300)
  }, [])
  useEffect(() => () => window.clearTimeout(editTimer.current), [])

  // ---- CodeMirror view (one view; one EditorState per tab so undo history and cursor survive tab switches)
  const buildState = useCallback(
    (id: string): EditorState => {
      const node = nodeOf(id)!
      const doc = textsRef.current[id] ?? node.content
      return EditorState.create({
        doc,
        extensions: [
          coreExtensions(),
          languageExtension(node.name),
          themeComp.of(themeExtension(dark)),
          EditorView.updateListener.of((u) => {
            if (!u.docChanged || silent.current) return
            const text = u.state.doc.toString()
            setTexts((t) => ({ ...t, [id]: text }))
            textsRef.current = { ...textsRef.current, [id]: text }
            scheduleEditEvents(text)
          }),
        ],
      })
    },
    [nodeOf, themeComp, scheduleEditEvents],
  )

  useEffect(() => {
    const view = new EditorView({ parent: hostRef.current! })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
      currentRef.current = null
    }
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    if (currentRef.current && currentRef.current !== activeId) statesRef.current.set(currentRef.current, view.state)
    if (!activeId) {
      currentRef.current = null
      return
    }
    if (currentRef.current === activeId) return
    let st = statesRef.current.get(activeId)
    if (!st) {
      if (!lastSavedRef.current.has(activeId)) lastSavedRef.current.set(activeId, nodeOf(activeId)!.content)
      st = buildState(activeId)
    }
    view.setState(st)
    currentRef.current = activeId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  // dark mode switch: reconfigure the current view and every parked state
  useEffect(() => {
    const view = viewRef.current
    const eff = themeComp.reconfigure(themeExtension(dark))
    view?.dispatch({ effects: eff })
    for (const [id, st] of statesRef.current) statesRef.current.set(id, st.update({ effects: eff }).state)
  }, [dark, themeComp])

  // files changed on disk (e.g. by the terminal) while the tab has no unsaved edits: refresh it
  useEffect(() => {
    for (const id of liveTabs) {
      const n = nodeOf(id)!
      const prev = lastSavedRef.current.get(id)
      if (prev === undefined || prev === n.content) continue
      const docNow = textsRef.current[id] ?? prev
      lastSavedRef.current.set(id, n.content)
      if (docNow !== prev) continue // has unsaved edits: keep them
      if (id === currentRef.current && viewRef.current) {
        const v = viewRef.current
        if (v.state.doc.toString() !== n.content) {
          silent.current = true
          v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: n.content } })
          silent.current = false
        }
      } else statesRef.current.delete(id)
      setTexts((t) => {
        const { [id]: _drop, ...rest } = t
        void _drop
        return rest
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.vfsVersion])

  // ---- opening files
  const openNode = useCallback((n: VNode) => {
    if (n.kind !== 'file') return
    if (!lastSavedRef.current.has(n.id)) lastSavedRef.current.set(n.id, n.content)
    setTabsState((s) => openTab(s, n.id))
  }, [])

  useEffect(() => {
    if (!fileProp) return
    const n = vfs.resolve(fileProp)
    if (n && n.kind === 'file') {
      openNode(n)
      // reveal in explorer
      setExpanded((e) => {
        const next = new Set(e)
        for (let p = n.parent; p; p = p.parent) next.add(p.id)
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileProp, propN, vfs])

  // ---- save
  const emitCustom = (event: string) => d.emit({ type: 'custom', event })
  const currentText = (id: string): string => (id === currentRef.current && viewRef.current ? viewRef.current.state.doc.toString() : textsRef.current[id] ?? nodeOf(id)?.content ?? '')

  const saveTab = (id: string): boolean => {
    const n = nodeOf(id)
    if (!n) return false
    const text = currentText(id)
    try {
      lastSavedRef.current.set(id, text)
      vfs.writeFile(n, text)
      setTexts((t) => ({ ...t, [id]: text }))
      textsRef.current = { ...textsRef.current, [id]: text }
      emitCustom('code-saved')
      renderPreview()
      return true
    } catch (e) {
      toastError(errorMessageEn(e, os))
      return false
    }
  }
  const toastError = (msg: string) => d.toast(msg)

  useWindowCombos(win.id, (c) => {
    if (dlg) return false
    if (c === (os === 'mac' ? 'cmd+s' : 'ctrl+s')) {
      if (activeId) saveTab(activeId)
      return true
    }
    return false
  })

  // ---- closing tabs / window
  const requestCloseTab = (id: string) => {
    if (dirtyOf(id)) return setDlg({ kind: 'tab', id })
    forceCloseTab(id)
  }
  const forceCloseTab = (id: string) => {
    statesRef.current.delete(id)
    if (currentRef.current === id) currentRef.current = null
    setTexts((t) => {
      const { [id]: _drop, ...rest } = t
      void _drop
      return rest
    })
    delete textsRef.current[id]
    setTabsState((s) => closeTab(s, id))
    setDlg(null)
  }
  const closeRef = useRef<() => boolean>(() => false)
  closeRef.current = () => {
    if (!anyDirty) return false
    setDlg({ kind: 'window' })
    return true
  }
  useEffect(() => {
    const guards = d.closeGuards.current
    guards.set(win.id, () => closeRef.current())
    return () => {
      guards.delete(win.id)
    }
  }, [d.closeGuards, win.id])

  // ---- explorer: new file / folder
  const createItem = () => {
    if (!creating) return
    const name = creating.name.normalize('NFC').trim()
    if (!name) return setCreating(null)
    const parent = targetFolder && attached(targetFolder, vfs.root) ? targetFolder : root
    try {
      if (creating.kind === 'file') {
        const n = vfs.createFile(parent, name)
        setExpanded((e) => new Set(e).add(parent.id))
        openNode(n)
      } else {
        vfs.mkdir(parent, name)
        setExpanded((e) => new Set(e).add(parent.id))
      }
      setCreating(null)
    } catch (e) {
      setCreating({ ...creating, error: errorMessageEn(e, os) })
    }
  }

  // ---- preview
  const previewEntry = useMemo((): VNode | null => {
    if (!activeNode) return null
    const k = fileKindOf(activeNode.name)
    if (k === 'html') return activeNode
    if (k === 'css' || k === 'javascript') {
      const idx = activeNode.parent && vfs.child(activeNode.parent, 'index.html')
      if (!idx || idx.kind !== 'file') return null
      // a .js file only matters to the preview when the page uses it
      return k === 'css' || (textsRef.current[idx.id] ?? idx.content).includes(activeNode.name) ? idx : null
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNode, vfs, d.vfsVersion])
  const previewRef = useRef({ entry: previewEntry, on: previewOn })
  previewRef.current = { entry: previewEntry, on: previewOn }

  function renderPreview() {
    const { entry, on } = previewRef.current
    if (!on || !entry || !entry.parent || !attached(entry, vfs.root)) return
    const drafts = { ...textsRef.current }
    const cur = currentRef.current
    if (cur && viewRef.current) drafts[cur] = viewRef.current.state.doc.toString()
    const files = collectFiles(entry.parent, drafts)
    const doc = buildPreviewDocument(files, entry.name)
    setSrcDoc(doc)
    dRef.current.emit({ type: 'preview', html: doc, text: extractVisibleText(doc) })
  }
  useEffect(() => {
    renderPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewEntry?.id, previewOn])
  useEffect(() => {
    if (!previewEntry || !previewOn) return
    const t = window.setTimeout(renderPreview, 350)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts])

  // layout: preview beside the editor when there is room
  useEffect(() => {
    const el = mainRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setWide(el.clientWidth >= 640 || el.clientWidth === 0))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ---- run
  useEffect(() => () => void runSeq.current++, [])
  const stopRun = () => {
    runSeq.current++
    pendingRef.current?.reject(new Error('stopped'))
    setPending(null)
    setRunUi({ status: 'stopped' })
  }
  const askInput = (prompt: string) =>
    new Promise<string>((resolve, reject) => {
      setAnswer('')
      setPending({ prompt, resolve, reject })
    })
  const submitAnswer = () => {
    const p = pendingRef.current
    if (!p) return
    setPending(null)
    p.resolve(answer)
  }

  const run = async () => {
    if (!activeNode || !activeId) return
    const language = runnableLanguage(activeNode.name)
    if (!language) return
    const id = activeId
    const fileName = activeNode.name
    if (dirtyOf(id) || currentText(id) !== activeNode.content) saveTab(id)
    const code = currentText(id)
    const seq = ++runSeq.current
    pendingRef.current?.reject(new Error('stopped'))
    setPending(null)
    setRunUi({ status: 'running', language, slowStart: language === 'python' && !pythonWarmed })
    try {
      const [mod, errs] = await Promise.all([import('../runner'), import('../runner/errors')])
      const { result } = await runWithReplay(mod.runCode, { language, code }, askInput)
      if (seq !== runSeq.current) return
      if (language === 'python') pythonWarmed = true
      const friendly = result.error ? errs.translateError(language, result.error) : undefined
      setRunUi({ status: 'done', result, friendly, language, fileName })
      dRef.current.emit({ type: 'codeRun', language, output: result.output, ok: result.ok, ...(result.error ? { error: describeError(result.error) } : {}) })
      // generic "she ran it" signals for lessons whose output depends on what she typed (any answer is fine)
      emitCustom(result.ok ? 'code-run-ok' : 'code-run-error')
      const view = viewRef.current
      if (result.error?.line && view && currentRef.current === id) view.dispatch({ effects: setErrorLine.of(result.error.line) })
    } catch (e) {
      if (seq !== runSeq.current) return
      const msg = e instanceof Error ? e.message : String(e)
      setRunUi({ status: 'done', language, fileName, result: { ok: false, output: '', error: { name: 'Error', message: msg, raw: msg }, durationMs: 0 } })
      dRef.current.emit({ type: 'codeRun', language, output: '', ok: false, error: msg })
    }
  }

  // ---------- render ----------
  const c = dark
    ? { bg: '#1c1e26', panel: '#171921', line: '#2e3140', fg: '#e8eaed', mute: '#a6b0bd', tabOn: '#1c1e26', tabOff: '#22242e', hover: '#2a2d3a', btn: '#2f3345', sel: '#33405f' }
    : { bg: '#ffffff', panel: '#f3f4f6', line: '#d8dce2', fg: '#1b1f24', mute: '#566370', tabOn: '#ffffff', tabOff: '#e8eaee', hover: '#e5e9f0', btn: '#e6e9ef', sel: '#cfe0fb' }
  const lang = activeNode ? runnableLanguage(activeNode.name) : null
  const running = runUi.status === 'running'
  const btn = 'inline-flex min-h-9 items-center gap-1 rounded px-3 text-sm font-medium disabled:opacity-40'

  const renderTree = (folder: VNode, depth: number) =>
    vfs.list(folder).map((n) => (
      <Fragment key={n.id}>
        <button
          type="button"
          data-coach={`code-explorer-${n.name}`}
          onClick={() => {
            if (n.kind === 'folder') {
              setTargetFolder(n)
              setExpanded((e) => {
                const next = new Set(e)
                if (!next.delete(n.id)) next.add(n.id)
                return next
              })
            } else {
              setTargetFolder(n.parent)
              openNode(n)
            }
          }}
          className="flex min-h-9 w-full items-center gap-2 pr-2 text-left text-sm"
          style={{ paddingLeft: 8 + depth * 14, background: n.id === activeId ? c.sel : undefined, color: c.fg }}
          aria-current={n.id === activeId}
        >
          {n.kind === 'folder' ? <span aria-hidden="true" style={{ width: 10 }}>{expanded.has(n.id) ? '▾' : '▸'}</span> : <span style={{ width: 10 }} />}
          {n.kind === 'folder' ? <FolderIcon size={18} /> : <NodeIcon node={n} size={18} />}
          <span className="truncate">{n.name}</span>
        </button>
        {n.kind === 'folder' && expanded.has(n.id) && renderTree(n, depth + 1)}
      </Fragment>
    ))

  const showPreview = previewOn && !!previewEntry
  // Mount the iframe only once there is a real document: changing `srcdoc` of a freshly inserted frame can be ignored.
  useEffect(() => {
    if (!showPreview) setSrcDoc(null)
  }, [showPreview])
  return (
    <div className="relative flex h-full min-h-0 flex-col text-sm" style={{ background: c.bg, color: c.fg }} data-coach="code-content">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-2 py-1" style={{ background: c.panel, borderBottom: `1px solid ${c.line}` }}>
        <button type="button" data-coach="code-save" className={btn} style={{ background: c.btn, color: c.fg }} disabled={!activeId} onClick={() => activeId && saveTab(activeId)}>
          💾 Save{activeId && dirtyOf(activeId) ? ' *' : ''}
        </button>
        <button type="button" data-coach="code-run" className={btn} style={{ background: '#15803d', color: '#fff' }} disabled={!lang || running} title={lang ? 'Run this file' : 'Only .py and .js files can be run'} onClick={run}>
          ▶ Run
        </button>
        {running && (
          <button type="button" data-coach="code-stop" className={btn} style={{ background: '#b91c1c', color: '#fff' }} onClick={stopRun}>
            ■ Stop
          </button>
        )}
        <button type="button" data-coach="code-preview-toggle" aria-pressed={previewOn} className={btn} style={{ background: previewOn ? c.sel : c.btn, color: c.fg }} onClick={() => setPreviewOn((v) => !v)}>
          প্রিভিউ
        </button>
        <span className="ml-auto text-xs" style={{ color: c.mute }}>
          Tab = indent · Esc, then Tab = leave the editor
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* explorer */}
        <div className="flex w-48 shrink-0 flex-col" style={{ background: c.panel, borderRight: `1px solid ${c.line}` }} data-coach="code-explorer">
          <div className="flex items-center gap-1 px-2 py-1">
            <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wide" style={{ color: c.mute }} title={vfs.displayPath(root)}>
              {root.name}
            </span>
            <button type="button" data-coach="code-new-file" aria-label="New file" title="New file" className="min-h-9 min-w-9 rounded" style={{ color: c.fg }} onClick={() => setCreating({ kind: 'file', name: '' })}>
              📄＋
            </button>
            <button type="button" data-coach="code-new-folder" aria-label="New folder" title="New folder" className="min-h-9 min-w-9 rounded" style={{ color: c.fg }} onClick={() => setCreating({ kind: 'folder', name: '' })}>
              📁＋
            </button>
          </div>
          {creating && (
            <div className="px-2 pb-2">
              <input
                data-coach="code-new-name"
                aria-label={creating.kind === 'file' ? 'New file name' : 'New folder name'}
                placeholder={creating.kind === 'file' ? 'new-file.py' : 'new-folder'}
                autoFocus
                value={creating.name}
                onChange={(e) => setCreating({ ...creating, name: e.target.value, error: undefined })}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') createItem()
                  if (e.key === 'Escape') setCreating(null)
                }}
                className="min-h-9 w-full rounded border px-2"
                style={{ background: c.bg, color: c.fg, borderColor: c.line }}
              />
              {creating.error && <div className="mt-1 text-xs" style={{ color: '#dc2626' }}>{creating.error}</div>}
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-auto" role="tree" aria-label="Project files">
            {vfs.list(root).length === 0 && <div className="px-3 py-2 text-xs" style={{ color: c.mute }}>This folder is empty.</div>}
            {renderTree(root, 0)}
          </div>
        </div>

        {/* main */}
        <div ref={mainRef} className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div role="tablist" aria-label="Open files" className="flex shrink-0 overflow-x-auto" style={{ background: c.panel, borderBottom: `1px solid ${c.line}` }}>
            {liveTabs.map((id) => {
              const n = nodeOf(id)!
              const dirty = dirtyOf(id)
              return (
                <div
                  key={id}
                  role="tab"
                  aria-selected={id === activeId}
                  className="flex min-h-9 shrink-0 items-center gap-1 border-r pl-3"
                  style={{ borderColor: c.line, background: id === activeId ? c.tabOn : c.tabOff, borderTop: id === activeId ? '2px solid #2563eb' : '2px solid transparent' }}
                  onAuxClick={(e) => e.button === 1 && (e.preventDefault(), requestCloseTab(id))}
                  onMouseDown={(e) => e.button === 1 && e.preventDefault()}
                >
                  <button type="button" data-coach={`code-tab-${n.name}`} className="min-h-9" onClick={() => setTabsState((s) => activateTab(s, id))}>
                    {n.name}
                  </button>
                  <button type="button" data-coach={`code-tab-close-${n.name}`} aria-label={`Close ${n.name}${dirty ? ' (unsaved changes)' : ''}`} className="flex min-h-9 min-w-9 items-center justify-center" onClick={() => requestCloseTab(id)}>
                    {dirty ? <span aria-hidden="true" data-coach={`code-dirty-${n.name}`} className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.fg }} /> : <span aria-hidden="true">✕</span>}
                  </button>
                </div>
              )
            })}
          </div>

          <div className={`flex min-h-0 flex-1 ${wide ? 'flex-row' : 'flex-col'}`}>
            <div className="relative min-h-0 min-w-0 flex-1" data-coach="code-editor">
              <div ref={hostRef} className="absolute inset-0" style={{ display: activeId ? 'block' : 'none' }} />
              {!activeId && (
                <div className="flex h-full items-center justify-center p-4 text-center" style={{ color: c.mute }}>
                  Choose a file in the explorer on the left to start editing.
                </div>
              )}
            </div>
            {showPreview && srcDoc !== null && (
              <div className="flex min-h-0 min-w-0 flex-col" style={{ flex: wide ? '0 0 42%' : '0 0 40%', borderLeft: wide ? `1px solid ${c.line}` : undefined, borderTop: wide ? undefined : `1px solid ${c.line}` }}>
                <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: c.panel, color: c.mute }}>
                  Preview
                </div>
                <iframe data-coach="code-preview" title="Live preview" sandbox="allow-scripts" srcDoc={srcDoc} className="min-h-0 w-full flex-1" style={{ background: '#fff', border: 0, ...(simDark ? { filter: 'invert(1) hue-rotate(180deg)' } : null) }} />
              </div>
            )}
          </div>

          {runUi.status !== 'idle' && (
            <div className="flex max-h-[45%] min-h-[96px] shrink-0 flex-col" style={{ borderTop: `1px solid ${c.line}`, background: c.bg }}>
              <div className="flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: c.panel, color: c.mute }}>
                Output
                <button type="button" aria-label="Close output" data-coach="code-output-close" className="ml-auto min-h-7 min-w-7" onClick={() => (stopRun(), setRunUi({ status: 'idle' }))}>
                  ✕
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-3" data-coach="code-output" aria-live="polite">
                <OutputBody runUi={runUi} pending={pending} answer={answer} setAnswer={setAnswer} submit={submitAnswer} dark={dark} />
              </div>
            </div>
          )}
        </div>
      </div>

      {dlg && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30 p-3" role="presentation">
          <div role="dialog" aria-modal="true" aria-label="Unsaved changes" data-coach="dialog" className="w-full max-w-sm space-y-3 rounded-lg p-4 shadow-2xl" style={{ background: c.bg, color: c.fg, border: `1px solid ${c.line}` }}>
            <p>{dlg.kind === 'tab' ? `Do you want to save changes to ${nodeOf(dlg.id)?.name ?? 'this file'}?` : 'Some files have unsaved changes. Save them before closing?'}</p>
            <div className="flex justify-end gap-2">
              <button type="button" data-coach="dialog-cancel" className={btn} style={{ background: c.btn, color: c.fg }} onClick={() => setDlg(null)}>
                Cancel
              </button>
              <button
                type="button"
                data-coach="dialog-dont-save"
                className={btn}
                style={{ background: c.btn, color: c.fg }}
                onClick={() => {
                  if (dlg.kind === 'tab') forceCloseTab(dlg.id)
                  else {
                    d.closeGuards.current.delete(win.id)
                    d.closeWindow(win.id)
                  }
                }}
              >
                Don’t save
              </button>
              <button
                type="button"
                data-coach="dialog-yes"
                className={btn}
                style={{ background: '#2563eb', color: '#fff' }}
                onClick={() => {
                  if (dlg.kind === 'tab') {
                    saveTab(dlg.id)
                    forceCloseTab(dlg.id)
                  } else {
                    liveTabs.filter(dirtyOf).forEach(saveTab)
                    d.closeGuards.current.delete(win.id)
                    d.closeWindow(win.id)
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OutputBody({ runUi, pending, answer, setAnswer, submit, dark }: { runUi: RunUi; pending: PendingInput | null; answer: string; setAnswer: (s: string) => void; submit: () => void; dark: boolean }) {
  const mute = dark ? '#a6b0bd' : '#566370'
  const mono = { fontFamily: 'var(--font-mono)' } as const
  if (runUi.status === 'stopped') return <p>থামানো হয়েছে।</p>
  if (runUi.status === 'running') {
    return (
      <div className="space-y-3">
        <p>চলছে…</p>
        {runUi.slowStart && !pending && <p style={{ color: mute }}>পাইথন প্রথমবার চালু হতে একটু সময় নেয়। একটু অপেক্ষা করুন, ঘাবড়াবেন না।</p>}
        {pending && (
          <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: dark ? '#3b5a9a' : '#93c5fd', background: dark ? '#202942' : '#eff6ff' }} data-coach="code-input-box">
            <label className="block" htmlFor="code-input-field">
              প্রোগ্রাম আপনার কাছে কিছু জানতে চাইছে: <span style={mono}>{pending.prompt}</span>
            </label>
            <div className="flex gap-2">
              <input
                id="code-input-field"
                data-coach="code-input"
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') submit()
                }}
                className="min-h-9 min-w-0 flex-1 rounded border px-2"
                style={{ ...mono, background: dark ? '#1c1e26' : '#fff', color: dark ? '#e8eaed' : '#1b1f24', borderColor: dark ? '#4b5675' : '#9ca3af' }}
              />
              <button type="button" data-coach="code-input-send" className="min-h-9 rounded px-4 text-white" style={{ background: '#2563eb' }} onClick={submit}>
                পাঠান
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
  if (runUi.status !== 'done') return null
  const { result, friendly } = runUi
  return (
    <div className="space-y-3">
      {result.timedOut ? (
        <p className="rounded-lg p-3" style={{ background: dark ? '#4a3a1c' : '#fff4d6' }}>
          প্রোগ্রামটি অনেকক্ষণ ধরে চলছিল (হয়তো একটি লুপ কখনও শেষ হচ্ছে না), তাই থামিয়ে দেওয়া হয়েছে। এতে কিছু নষ্ট হয়নি — কোডটি একটু দেখে আবার চালিয়ে দেখুন।
        </p>
      ) : null}
      {(result.output || (result.ok && !result.timedOut)) && (
        <pre data-coach="code-output-text" className="m-0 whitespace-pre-wrap break-words" style={mono}>
          {result.output || '(কোনো আউটপুট নেই)'}
        </pre>
      )}
      {result.error && !result.timedOut && (
        <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: dark ? '#7c5a2a' : '#f0c27a', background: dark ? '#2b2418' : '#fff8ec' }} data-coach="code-error">
          {friendly && (
            <>
              <h3 className="m-0 text-base font-semibold">{friendly.titleBn}</h3>
              <p className="m-0">{friendly.explanationBn}</p>
              <p className="m-0">
                <strong>কী করে দেখবেন:</strong> {friendly.tryBn}
              </p>
            </>
          )}
          <div>
            <div className="mb-1 text-xs font-semibold" style={{ color: mute }}>
              ইংরেজি বার্তা (Original){result.error.line ? ` · line ${result.error.line}` : ''}
            </div>
            <pre className="m-0 whitespace-pre-wrap break-words rounded p-2 text-xs" style={{ ...mono, background: dark ? '#14161c' : '#f3f4f6' }} data-coach="code-error-original">
              {`${result.error.name}: ${result.error.message}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
