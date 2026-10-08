/** Task Manager (Windows, Ctrl+Shift+Esc): the open apps with fake CPU / Memory numbers, and "End task" (Module 12). */
import { useState } from 'react'
import { registerApp, getApp } from '../registry'
import { registerSystemShortcut } from '../../systemActions'
import { useDesktop } from '../../DesktopContext'
import type { WinState } from '../../windowManager'
import { TaskManagerIcon } from '../../ui/icons'
import { useFrozenIds } from './stuckState'
import { BACKGROUND_PROCESSES, buildRows } from './procLogic'

export function TaskManager({ win }: { win: WinState }) {
  const d = useDesktop()
  const frozen = useFrozenIds()
  const [sel, setSel] = useState<string | null>(null)
  const rows = buildRows(
    d.wm.windows.map((w) => ({ id: w.id, app: w.app, title: w.title })),
    frozen,
    (app) => getApp(app)?.title('windows') ?? app,
  )
  const selected = rows.find((r) => r.winId === sel)
  const endTask = () => {
    if (!selected) return
    // End task really stops the program at once: no "save your work?" question (unsaved work is lost).
    d.wmDispatch({ type: 'close', id: selected.winId })
    d.emit({ type: 'closeApp', app: selected.app })
    d.emit({ type: 'custom', event: 'taskmgr-ended' })
    setSel(null)
  }
  const th = 'px-3 text-left font-normal text-gray-600'
  return (
    <div className="flex h-full flex-col bg-white text-sm text-gray-900" data-coach="taskmgr-content">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2">
        <span className="font-semibold">Processes</span>
        <span className="ml-auto" />
        <button type="button" data-coach="taskmgr-end-task" disabled={!selected} onClick={endTask} className="min-h-9 rounded bg-blue-600 px-4 text-white disabled:bg-gray-300 disabled:text-gray-500">
          End task
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-collapse" aria-label="Processes">
          <thead>
            <tr className="h-9 border-b border-gray-200">
              <th className={th}>Name</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>CPU</th>
              <th className={`${th} text-right`}>Memory</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="bg-gray-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Apps ({rows.length})
              </td>
            </tr>
            {rows.map((r) => (
              <tr
                key={r.winId}
                data-coach={`taskmgr-row-${r.key}`}
                aria-selected={sel === r.winId}
                tabIndex={0}
                onClick={() => setSel(r.winId)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(r.winId)}
                className={`h-10 cursor-default border-b border-gray-100 ${sel === r.winId ? 'bg-sky-100' : 'hover:bg-gray-50'}`}
              >
                <td className="px-3">{r.name}</td>
                <td className={`px-3 ${r.notResponding ? 'font-semibold text-red-600' : 'text-gray-500'}`}>{r.notResponding ? 'Not responding' : ''}</td>
                <td className="px-3 text-right tabular-nums">{r.cpu}</td>
                <td className="px-3 text-right tabular-nums">{r.memory}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="bg-gray-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Background processes ({BACKGROUND_PROCESSES.length})
              </td>
            </tr>
            {BACKGROUND_PROCESSES.map((p) => (
              <tr key={p.name} className="h-9 border-b border-gray-100 text-gray-500">
                <td className="px-3">{p.name}</td>
                <td className="px-3" />
                <td className="px-3 text-right tabular-nums">{p.cpu}</td>
                <td className="px-3 text-right tabular-nums">{p.memory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500" data-win={win.id}>
        Select a program and choose “End task” to close it.
      </div>
    </div>
  )
}

export function register() {
  registerApp({
    id: 'taskmgr',
    title: () => 'Task Manager',
    descriptionBn: 'কোন প্রোগ্রাম চলছে দেখা আর আটকে যাওয়া প্রোগ্রাম জোর করে বন্ধ করার জায়গা',
    icon: ({ size }) => <TaskManagerIcon size={size} />,
    component: TaskManager,
    defaultSize: { w: 600, h: 400 },
    os: 'windows',
  })
  registerSystemShortcut('windows', 'ctrl+shift+esc', (d) => d.openApp('taskmgr'))
}
