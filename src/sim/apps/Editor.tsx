/** Notepad (Windows) / TextEdit (Mac, Plain Text mode): a plain-text editor on top of the virtual file system. */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDesktop, useWindowCombos } from '../DesktopContext'
import { errorMessageEn, extensionOf, VfsError, type VNode } from '../vfs'
import type { WinState } from '../windowManager'
import { SimDialog } from '../ui/SimDialog'
import { FolderIcon, NodeIcon } from '../ui/icons'
import { attached, findNode } from './util'
import { PrintDialog } from '../devices/PrintDialog'

type Mode = 'save' | 'open'

/** A simple Save As / Open dialog: folder list with an Up button, file list, name field. */
function FilePicker({ mode, startFolder, defaultName, onCancel, onChoose }: { mode: Mode; startFolder: VNode; defaultName: string; onCancel: () => void; onChoose: (folder: VNode, name: string, node?: VNode) => void }) {
  const d = useDesktop()
  const { vfs, os } = d
  const mac = os === 'mac'
  const [folder, setFolder] = useState<VNode>(startFolder)
  const [name, setName] = useState(defaultName)
  const [picked, setPicked] = useState<VNode | null>(null)
  const items = vfs.list(folder)
  const confirm = () => {
    if (mode === 'open') {
      if (picked && picked.kind === 'file') onChoose(folder, picked.name, picked)
      return
    }
    onChoose(folder, name)
  }
  const crumb = vfs.displayPath(folder)
  return (
    <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/30 p-2" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), onCancel())}>
      <div role="dialog" aria-modal="true" aria-label={mode === 'save' ? 'Save As' : 'Open'} data-coach={mode === 'save' ? 'save-dialog' : 'open-dialog'} className={`flex max-h-full w-full max-w-xl flex-col bg-white text-sm text-gray-900 shadow-2xl ${mac ? 'rounded-xl' : 'rounded-lg border border-gray-300'}`}>
        <div className={`px-4 py-2.5 font-semibold ${mac ? 'text-center' : 'border-b border-gray-200'}`}>{mode === 'save' ? 'Save As' : 'Open'}</div>
        <div className="flex items-center gap-2 px-4 pt-3">
          <button type="button" data-coach="save-dialog-up" aria-label="Up one level" disabled={!folder.parent} onClick={() => folder.parent && (setFolder(folder.parent), setPicked(null))} className="min-h-9 min-w-9 rounded border border-gray-300 disabled:text-gray-400">
            ↑
          </button>
          <div data-coach="save-dialog-path" className="min-h-9 min-w-0 flex-1 truncate rounded border border-gray-300 bg-gray-50 px-2 leading-9">
            {mac ? `Where: ${crumb}` : crumb}
          </div>
        </div>
        <div role="listbox" aria-label="Folders and files" className="mx-4 my-3 h-48 overflow-auto rounded border border-gray-300">
          {items.length === 0 && <div className="p-3 text-gray-500">This folder is empty.</div>}
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              role="option"
              aria-selected={picked === n}
              data-coach={n.kind === 'folder' ? `save-dialog-folder-${n.name}` : `save-dialog-file-${n.name}`}
              onClick={() => {
                if (n.kind === 'folder') {
                  setFolder(n)
                  setPicked(null)
                } else {
                  setPicked(n)
                  if (mode === 'save') setName(n.name)
                }
              }}
              onDoubleClick={() => mode === 'open' && n.kind === 'file' && onChoose(folder, n.name, n)}
              className={`flex min-h-9 w-full items-center gap-2 px-2 text-left hover:bg-gray-100 ${picked === n ? 'bg-sky-100' : ''} ${n.kind === 'file' && mode === 'save' ? 'text-gray-500' : ''}`}
            >
              {n.kind === 'folder' ? <FolderIcon size={20} /> : <NodeIcon node={n} size={20} />}
              <span className="truncate">{n.name}</span>
            </button>
          ))}
        </div>
        {mode === 'save' ? (
          <div className="flex flex-col gap-2 px-4">
            <label className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-gray-600">{mac ? 'Save As:' : 'File name:'}</span>
              <input
                data-coach="save-dialog-name"
                aria-label="File name"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => {
                  const dot = e.currentTarget.value.lastIndexOf('.')
                  e.currentTarget.setSelectionRange(0, dot > 0 ? dot : e.currentTarget.value.length)
                }}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') confirm()
                }}
                className="min-h-9 min-w-0 flex-1 rounded border border-gray-300 px-2"
              />
            </label>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-24 shrink-0">{mac ? 'Format:' : 'Save as type:'}</span>
              <span data-coach="save-dialog-type">{mac ? 'Plain Text (.txt)' : 'Text Documents (*.txt)'}</span>
            </div>
          </div>
        ) : (
          <div className="px-4 text-gray-600">{picked ? `Selected: ${picked.name}` : 'Choose a file to open.'}</div>
        )}
        <div className={`mt-3 flex justify-end gap-2 px-4 py-3 ${mac ? '' : 'bg-gray-100'}`}>
          <button type="button" data-coach={mode === 'save' ? 'save-dialog-cancel' : 'open-dialog-cancel'} onClick={onCancel} className="min-h-9 rounded border border-gray-400 bg-white px-4">
            Cancel
          </button>
          <button type="button" data-coach={mode === 'save' ? 'save-dialog-save' : 'open-dialog-open'} disabled={mode === 'open' && !picked} onClick={confirm} className="min-h-9 rounded bg-blue-600 px-4 text-white disabled:opacity-50">
            {mode === 'save' ? 'Save' : 'Open'}
          </button>
        </div>
      </div>
    </div>
  )
}

type Dlg = { kind: 'save' } | { kind: 'open' } | { kind: 'print' } | { kind: 'replace'; folder: VNode; name: string } | { kind: 'unsaved' } | { kind: 'error'; msg: string }

export function Editor({ win }: { win: WinState }) {
  const d = useDesktop()
  const { vfs, os } = d
  const mac = os === 'mac'
  const nodeIdProp = typeof win.props?.nodeId === 'string' ? win.props.nodeId : undefined
  const propN = win.props?._n

  const [node, setNode] = useState<VNode | null>(null)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState('')
  const [dlg, setDlg] = useState<Dlg | null>(null)
  const [menu, setMenu] = useState<string | null>(null)
  const [wrap, setWrap] = useState(true)
  const [statusBar, setStatusBar] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [cursor, setCursor] = useState({ ln: 1, col: 1 })
  const taRef = useRef<HTMLTextAreaElement>(null)
  const after = useRef<(() => void) | null>(null)
  const wasDirty = useRef(false)

  const loadNode = (n: VNode | null) => {
    setNode(n)
    const c = n && n.kind === 'file' ? n.content : ''
    setText(c)
    setSaved(c)
    wasDirty.current = false
    setCursor({ ln: 1, col: 1 })
  }

  // open the file given in props (and again whenever the props change)
  useEffect(() => {
    if (!nodeIdProp) return
    const n = findNode(vfs.root, nodeIdProp)
    if (n && n.kind === 'file') loadNode(n)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeIdProp, propN])

  const fileNode = node && attached(node, vfs.root) ? node : null
  const name = fileNode?.name ?? 'Untitled'
  const dirty = text !== saved
  const title = mac ? `${name}${dirty ? ' — Edited' : ''}` : `${dirty ? '*' : ''}${name} - Notepad`
  useEffect(() => {
    d.wmDispatch({ type: 'setTitle', id: win.id, title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, win.id])

  const emitCustom = (event: string) => d.emit({ type: 'custom', event })

  const onChange = (v: string) => {
    setText(v)
    if (!wasDirty.current && v !== saved) {
      wasDirty.current = true
      emitCustom('editor-dirty')
    }
  }
  const trackCursor = () => {
    const el = taRef.current
    if (!el) return
    const before = el.value.slice(0, el.selectionStart)
    const lines = before.split('\n')
    setCursor({ ln: lines.length, col: lines[lines.length - 1].length + 1 })
  }

  const finishAfter = () => {
    const f = after.current
    after.current = null
    f?.()
  }

  const doSave = (): boolean => {
    if (fileNode) {
      try {
        vfs.writeFile(fileNode, text)
        setSaved(text)
        wasDirty.current = false
        emitCustom('editor-saved')
        finishAfter()
        return true
      } catch (e) {
        setDlg({ kind: 'error', msg: errorMessageEn(e, os) })
        return false
      }
    }
    setDlg({ kind: 'save' })
    return false
  }
  const doSaveAs = () => setDlg({ kind: 'save' })
  const openPrint = () => setDlg({ kind: 'print' })

  const writeAs = (folder: VNode, fileName: string) => {
    try {
      const saved2 = vfs.saveAs(folder, fileName, text)
      setNode(saved2)
      setSaved(text)
      wasDirty.current = false
      setDlg(null)
      emitCustom('editor-saved')
      finishAfter()
    } catch (e) {
      setDlg({ kind: 'error', msg: errorMessageEn(e, os) })
    }
  }
  const choose = (folder: VNode, raw: string) => {
    let n = raw.normalize('NFC').trim()
    if (n && extensionOf(n) === '' && !n.endsWith('.')) n += '.txt'
    try {
      n = vfs.validateName(n)
    } catch (e) {
      setDlg({ kind: 'error', msg: errorMessageEn(e, os) })
      return
    }
    const ex = vfs.child(folder, n)
    if (ex && ex !== fileNode) {
      if (ex.kind === 'folder') return setDlg({ kind: 'error', msg: errorMessageEn(new VfsError('exists', n), os) })
      return setDlg({ kind: 'replace', folder, name: n })
    }
    writeAs(folder, n)
  }

  /** run `next` once there are no unsaved changes (asking the learner if needed) */
  const guard = (next: () => void) => {
    if (!dirty) return next()
    after.current = next
    setDlg({ kind: 'unsaved' })
  }
  const newDoc = () => guard(() => loadNode(null))
  const openDoc = () => guard(() => setDlg({ kind: 'open' }))

  // veto closing the window while there are unsaved changes
  const closeRef = useRef<() => boolean>(() => false)
  closeRef.current = () => {
    if (!dirty) return false
    after.current = () => {
      d.closeGuards.current.delete(win.id)
      d.closeWindow(win.id)
    }
    setDlg({ kind: 'unsaved' })
    return true
  }
  useEffect(() => {
    const guards = d.closeGuards.current
    guards.set(win.id, () => closeRef.current())
    return () => {
      guards.delete(win.id)
    }
  }, [d.closeGuards, win.id])

  useWindowCombos(win.id, (c) => {
    if (dlg) return false
    const m = mac ? 'cmd' : 'ctrl'
    if (c === `${m}+s`) return (doSave(), true)
    if (c === (mac ? 'shift+cmd+s' : 'ctrl+shift+s')) return (doSaveAs(), true)
    if (c === `${m}+n`) return (newDoc(), true)
    if (c === `${m}+o`) return (openDoc(), true)
    if (c === `${m}+p`) return (openPrint(), true)
    return false
  })

  const startFolder = (() => {
    if (fileNode?.parent && attached(fileNode.parent, vfs.root)) return fileNode.parent
    return vfs.child(vfs.home, 'Documents') ?? vfs.home
  })()

  const menuBtn = (id: string, coach: string, label: string, items: ReactNode) => (
    <div key={id} className="relative">
      <button type="button" data-coach={coach} aria-haspopup="menu" aria-expanded={menu === id} onClick={() => setMenu(menu === id ? null : id)} onMouseEnter={() => menu && setMenu(id)} className={`min-h-9 px-3 hover:bg-black/8 ${menu === id ? 'bg-black/10' : ''}`}>
        {label}
      </button>
      {menu === id && (
        <div role="menu" className="absolute top-full left-0 z-50 min-w-56 rounded-md border border-gray-300 bg-white py-1 shadow-lg">
          {items}
        </div>
      )}
    </div>
  )
  const mi = (coach: string, label: string, onClick: () => void, opts: { shortcut?: string; checked?: boolean; disabled?: boolean } = {}) => (
    <button
      key={coach}
      type="button"
      role="menuitem"
      data-coach={coach}
      disabled={opts.disabled}
      onClick={() => {
        setMenu(null)
        onClick()
      }}
      className="flex min-h-9 w-full items-center gap-2 px-3 text-left hover:bg-gray-100 disabled:text-gray-400"
    >
      <span className="w-4 text-xs">{opts.checked ? '✓' : ''}</span>
      <span className="flex-1">{label}</span>
      {opts.shortcut && <span className="text-xs text-gray-500">{opts.shortcut}</span>}
    </button>
  )
  const exec = (cmd: string) => {
    taRef.current?.focus()
    try {
      document.execCommand?.(cmd)
    } catch {
      /* not supported */
    }
  }

  const fileMenu = [
    mi('editor-new', 'New', newDoc, { shortcut: mac ? '⌘N' : 'Ctrl+N' }),
    mi('editor-open', 'Open…', openDoc, { shortcut: mac ? '⌘O' : 'Ctrl+O' }),
    mi('editor-save', 'Save', () => void doSave(), { shortcut: mac ? '⌘S' : 'Ctrl+S' }),
    mi('editor-save-as', 'Save As…', doSaveAs, { shortcut: mac ? '⇧⌘S' : 'Ctrl+Shift+S' }),
    mi('editor-print', 'Print…', openPrint, { shortcut: mac ? '⌘P' : 'Ctrl+P' }),
    mi('editor-exit', mac ? 'Close' : 'Exit', () => d.closeWindow(win.id)),
  ]

  const bar = mac ? (
    <div className="flex shrink-0 items-center gap-1 border-b border-gray-200 bg-[#ececec] px-2 py-1 text-sm" data-coach="editor-toolbar">
      <button type="button" data-coach="editor-new" className="min-h-9 rounded px-3 hover:bg-black/8" onClick={newDoc}>
        New
      </button>
      <button type="button" data-coach="editor-open" className="min-h-9 rounded px-3 hover:bg-black/8" onClick={openDoc}>
        Open…
      </button>
      <button type="button" data-coach="editor-save" className="min-h-9 rounded px-3 hover:bg-black/8" onClick={() => void doSave()}>
        Save
      </button>
      <button type="button" data-coach="editor-save-as" className="min-h-9 rounded px-3 hover:bg-black/8" onClick={doSaveAs}>
        Save As…
      </button>
      <button type="button" data-coach="editor-print" className="min-h-9 rounded px-3 hover:bg-black/8" onClick={openPrint}>
        Print…
      </button>
      <div className="relative">
        <button type="button" data-coach="editor-menu-format" aria-haspopup="menu" onClick={() => setMenu(menu === 'format' ? null : 'format')} className="min-h-9 rounded px-3 hover:bg-black/8">
          Format ▾
        </button>
        {menu === 'format' && (
          <div role="menu" className="absolute top-full left-0 z-50 min-w-56 rounded-md border border-gray-300 bg-white py-1 shadow-lg">
            {mi('editor-plain-text', 'Make Plain Text', () => {}, { checked: true, disabled: true })}
          </div>
        )}
      </div>
      <span className="ml-auto pr-2 text-xs text-gray-500" data-coach="editor-mode">
        Plain Text
      </span>
    </div>
  ) : (
    <div className="flex shrink-0 items-center border-b border-gray-200 bg-[#f3f3f3] text-sm" data-coach="editor-menubar">
      {menuBtn('file', 'editor-menu-file', 'File', fileMenu)}
      {menuBtn('edit', 'editor-menu-edit', 'Edit', [
        mi('editor-undo', 'Undo', () => exec('undo'), { shortcut: 'Ctrl+Z' }),
        mi('editor-cut', 'Cut', () => exec('cut'), { shortcut: 'Ctrl+X' }),
        mi('editor-copy', 'Copy', () => exec('copy'), { shortcut: 'Ctrl+C' }),
        mi('editor-paste', 'Paste', () => exec('paste'), { shortcut: 'Ctrl+V' }),
        mi('editor-select-all', 'Select all', () => (taRef.current?.focus(), taRef.current?.select()), { shortcut: 'Ctrl+A' }),
      ])}
      {menuBtn('view', 'editor-menu-view', 'View', [
        mi('editor-zoom-in', 'Zoom in', () => setZoom((z) => Math.min(300, z + 10))),
        mi('editor-zoom-out', 'Zoom out', () => setZoom((z) => Math.max(50, z - 10))),
        mi('editor-status-bar', 'Status bar', () => setStatusBar((s) => !s), { checked: statusBar }),
        mi('editor-word-wrap', 'Word wrap', () => setWrap((w) => !w), { checked: wrap }),
      ])}
    </div>
  )

  const chars = [...text].length

  const dialogs = !dlg ? null : dlg.kind === 'save' ? (
    <FilePicker
      mode="save"
      startFolder={startFolder}
      defaultName={fileNode ? fileNode.name : mac ? 'Untitled' : 'Untitled.txt'}
      onCancel={() => (after.current = null, setDlg(null))}
      onChoose={choose}
    />
  ) : dlg.kind === 'open' ? (
    <FilePicker
      mode="open"
      startFolder={startFolder}
      defaultName=""
      onCancel={() => setDlg(null)}
      onChoose={(_f, _n, picked) => {
        setDlg(null)
        if (picked) loadNode(picked)
      }}
    />
  ) : dlg.kind === 'print' ? (
    <PrintDialog docName={name} text={text} onClose={() => setDlg(null)} />
  ) : dlg.kind === 'replace' ? (
    <SimDialog
      title={mac ? `“${dlg.name}” already exists. Do you want to replace it?` : 'Confirm Save As'}
      onClose={() => setDlg({ kind: 'save' })}
      buttons={[
        { label: mac ? 'Cancel' : 'No', id: 'dialog-no', onClick: () => setDlg({ kind: 'save' }) },
        { label: mac ? 'Replace' : 'Yes', id: 'dialog-yes', primary: true, onClick: () => writeAs(dlg.folder, dlg.name) },
      ]}
    >
      {mac ? 'A file or folder with the same name already exists in this location. Replacing it will overwrite its current contents.' : `${dlg.name} already exists.\nDo you want to replace it?`}
    </SimDialog>
  ) : dlg.kind === 'unsaved' ? (
    <SimDialog
      title={mac ? `Do you want to save the changes made to the document “${name}”?` : 'Notepad'}
      onClose={() => (after.current = null, setDlg(null))}
      buttons={[
        {
          label: 'Save',
          id: 'dialog-save',
          primary: true,
          onClick: () => {
            setDlg(null)
            doSave()
          },
        },
        {
          label: mac ? 'Don’t Save' : 'Don’t save',
          id: 'dialog-dont-save',
          onClick: () => {
            setDlg(null)
            setSaved(text)
            wasDirty.current = false
            finishAfter()
          },
        },
        { label: 'Cancel', id: 'dialog-cancel', onClick: () => (after.current = null, setDlg(null)) },
      ]}
    >
      {mac ? 'Your changes will be lost if you don’t save them.' : `Do you want to save changes to ${name}?`}
    </SimDialog>
  ) : (
    <SimDialog title={mac ? 'TextEdit' : 'Notepad'} onClose={() => setDlg(null)} buttons={[{ label: 'OK', primary: true, id: 'dialog-ok', onClick: () => setDlg(null) }]}>
      <p data-coach="dialog-message">{dlg.msg}</p>
    </SimDialog>
  )

  return (
    <div className="relative flex h-full flex-col text-sm text-gray-900" onPointerDown={(e) => menu && !(e.target as HTMLElement).closest('[role="menu"],[aria-haspopup]') && setMenu(null)}>
      {bar}
      <textarea
        ref={taRef}
        data-coach="editor-text"
        aria-label="Text"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        value={text}
        onChange={(e) => (onChange(e.target.value), trackCursor())}
        onKeyUp={trackCursor}
        onClick={trackCursor}
        onSelect={trackCursor}
        wrap={wrap ? 'soft' : 'off'}
        className="min-h-0 flex-1 resize-none bg-white p-2 outline-none select-text"
        style={{ fontFamily: mac ? 'ui-sans-serif, system-ui, "Noto Sans Bengali", sans-serif' : 'Consolas, "Courier New", "Noto Sans Bengali", monospace', fontSize: `${(mac ? 14 : 15) * (zoom / 100)}px`, whiteSpace: wrap ? 'pre-wrap' : 'pre', overflow: 'auto' }}
      />
      {!mac && statusBar && (
        <div data-coach="editor-status" className="flex min-h-7 shrink-0 items-center gap-4 border-t border-gray-200 bg-[#f3f3f3] px-3 text-xs text-gray-600">
          <span>
            Ln {cursor.ln}, Col {cursor.col}
          </span>
          <span>{chars} characters</span>
          <span className="ml-auto">{zoom}%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      )}
      {dialogs}
    </div>
  )
}
