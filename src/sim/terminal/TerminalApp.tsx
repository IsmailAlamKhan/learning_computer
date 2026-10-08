/** The practice terminal window: scrollback + one input line, on top of the pure engine in ./engine.ts. */
import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useDesktop } from '../DesktopContext'
import type { WinState } from '../windowManager'
import { createSession, type LineKind, type Session } from './engine'
import { isToolInstalled } from '../apps/extra-support/toolState'
import { freshCursor, stepHistory, type HistoryCursor } from './history'

interface Entry {
  id: number
  /** a typed command (with the prompt shown when it was typed) or an output line */
  prompt?: string
  text: string
  kind?: LineKind
}

const COLORS: Record<LineKind, string> = {
  out: '#e5e7eb',
  err: '#fbbf24', // calm amber
  hint: '#7dd3c8',
  info: '#9ca3af',
}

export function TerminalApp({ win }: { win: WinState }) {
  const d = useDesktop()
  const dRef = useRef(d)
  dRef.current = d
  const mac = d.os === 'mac'
  const idRef = useRef(0)
  const nextId = () => ++idRef.current

  const [session] = useState<Session>(() => {
    const cwdProp = typeof win.props?.cwd === 'string' ? win.props.cwd : undefined
    const start = cwdProp ? d.vfs.resolve(cwdProp) : null
    return createSession(d.vfs, d.os, undefined, (e) => dRef.current.emit(e), start && start.kind === 'folder' ? start : undefined, {
      // Module 18: tools only count as installed once the learner has installed them (never gated elsewhere)
      isInstalled: (tool) => isToolInstalled(dRef.current.vfs, tool === 'code' ? 'vscode' : tool),
      openEditor: (node) => {
        const v = dRef.current.vfs
        const folder = node.kind === 'folder' ? node : (node.parent ?? v.home)
        dRef.current.openApp('code', { props: { folder: v.canonPath(folder), ...(node.kind === 'file' ? { file: v.canonPath(node) } : {}) }, newWindow: true })
      },
    })
  })
  const [entries, setEntries] = useState<Entry[]>(() => session.banner().map((l) => ({ id: nextId(), text: l.text, kind: l.kind })))
  const [value, setValue] = useState('')
  const [inputPrompt, setInputPrompt] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const histCur = useRef<HistoryCursor>(freshCursor(session.history))
  const nextCursor = useRef<number | null>(null)
  const lastTab = useRef<string | null>(null)

  const setLine = useCallback((text: string, cursor?: number) => {
    nextCursor.current = cursor ?? text.length
    setValue(text)
  }, [])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries, value, busy])

  useLayoutEffect(() => {
    const el = inputRef.current
    if (el && nextCursor.current !== null) {
      el.setSelectionRange(nextCursor.current, nextCursor.current)
      nextCursor.current = null
    }
  }, [value])

  useLayoutEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const prompt = inputPrompt ?? session.promptString()
  const push = (items: Omit<Entry, 'id'>[], replace = false) =>
    setEntries((prev) => [...(replace ? [] : prev), ...items.map((i) => ({ ...i, id: nextId() }))].slice(-600))

  const submit = async () => {
    if (busy) return
    const line = value
    const shownPrompt = prompt
    const answering = session.awaitingInput
    setLine('')
    histCur.current = freshCursor(session.history)
    lastTab.current = null
    setBusy(true)
    push([{ prompt: shownPrompt, text: line }])
    try {
      const res = await session.exec(line)
      if (res.clear) push(res.lines.map((l) => ({ text: l.text, kind: l.kind })), true)
      else push(res.lines.map((l) => ({ text: l.text, kind: l.kind })))
      setInputPrompt(res.prompt ? res.prompt.text : null)
      if (!answering) histCur.current = freshCursor(session.history)
    } finally {
      setBusy(false)
      window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)
    }
  }

  const doTab = () => {
    const el = inputRef.current
    const cursor = el?.selectionStart ?? value.length
    const res = session.complete(value, cursor)
    if (res.completed !== value) {
      setLine(res.completed, res.cursor)
      lastTab.current = null
      return
    }
    if (res.candidates.length > 1) {
      push([{ prompt, text: value }, { text: res.candidates.join('   '), kind: 'out' }])
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const k = e.key
    const ctrl = e.ctrlKey
    const meta = e.metaKey
    if ((ctrl || meta) && ['c', 'v', 'x', 'a', 'l', 'u', 'z', 'k', 'w', 'e'].includes(k.toLowerCase())) e.stopPropagation()
    if (k === 'Enter') {
      e.preventDefault()
      void submit()
      return
    }
    if (k === 'Tab' && !ctrl && !meta && !e.altKey) {
      e.preventDefault()
      if (!session.awaitingInput) doTab()
      return
    }
    if (k === 'ArrowUp' || k === 'ArrowDown') {
      e.preventDefault()
      if (session.awaitingInput) return
      const r = stepHistory(session.history, histCur.current, k === 'ArrowUp' ? 'up' : 'down', value)
      histCur.current = r.cursor
      setLine(r.text)
      return
    }
    if (ctrl && k.toLowerCase() === 'c') {
      const el = e.currentTarget
      const hasSel = (el.selectionStart ?? 0) !== (el.selectionEnd ?? 0) || (window.getSelection()?.toString() ?? '') !== ''
      if (hasSel && !mac) return // Windows: Ctrl+C copies when something is selected
      e.preventDefault()
      session.cancelInput()
      setInputPrompt(null)
      push([{ prompt, text: `${value}^C` }])
      setLine('')
      histCur.current = freshCursor(session.history)
      return
    }
    if (ctrl && k.toLowerCase() === 'l') {
      e.preventDefault()
      push([], true)
      return
    }
  }

  const bg = mac ? '#1e2024' : '#0c0c0c'
  const promptColor = mac ? '#a5b4fc' : '#86efac'

  return (
    <div
      className="flex h-full min-h-0 flex-col select-text"
      style={{ background: bg, color: COLORS.out, fontFamily: 'var(--font-mono)', fontSize: `${(15 * (d.sim.zoom || 100)) / 100}px`, lineHeight: 1.45, userSelect: 'text' }}
      onClick={() => {
        if (!(window.getSelection()?.toString() ?? '')) inputRef.current?.focus({ preventScroll: true })
      }}
    >
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-2" data-win={win.id}>
        <div data-coach="terminal-output" aria-live="polite" aria-label="Terminal output" role="log">
          {entries.map((en) =>
            en.prompt !== undefined ? (
              <div key={en.id} className="whitespace-pre-wrap break-words">
                <span style={{ color: promptColor }}>{en.prompt}</span>
                <span>{en.text}</span>
              </div>
            ) : (
              <div key={en.id} className="min-h-[1.45em] whitespace-pre-wrap break-words" style={{ color: COLORS[en.kind ?? 'out'] }}>
                {en.text}
              </div>
            ),
          )}
        </div>
        <label className="flex items-baseline">
          <span className="whitespace-pre" style={{ color: promptColor }}>
            {prompt}
          </span>
          <input
            ref={inputRef}
            data-coach="terminal-input"
            aria-label="Terminal input"
            value={value}
            readOnly={busy}
            onChange={(e) => {
              setValue(e.target.value)
              lastTab.current = null
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 outline-none"
            style={{ color: '#f9fafb', font: 'inherit', caretColor: '#f9fafb' }}
          />
        </label>
      </div>
    </div>
  )
}
