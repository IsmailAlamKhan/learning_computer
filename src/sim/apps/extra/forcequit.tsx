/** "Force Quit Applications" (Mac, Option+Command+Esc or the system menu → Force Quit…) (Module 12). */
import { useState } from 'react'
import { registerApp, getApp } from '../registry'
import { registerSystemShortcut } from '../../systemActions'
import { useDesktop } from '../../DesktopContext'
import type { WinState } from '../../windowManager'
import { SimDialog } from '../../ui/SimDialog'
import { TaskManagerIcon } from '../../ui/icons'
import { useFrozenIds } from './stuckState'

export function ForceQuit({ win }: { win: WinState }) {
  const d = useDesktop()
  const frozen = useFrozenIds()
  const [sel, setSel] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)
  // one entry per running app (not per window); this window itself is not listed
  const apps = [...new Set(d.wm.windows.filter((w) => w.id !== win.id).map((w) => w.app))].map((app) => ({
    app,
    name: getApp(app)?.title('mac') ?? app,
    notResponding: d.wm.windows.some((w) => w.app === app && frozen.has(w.id)),
  }))
  const chosen = apps.find((a) => a.app === sel)
  const doQuit = () => {
    if (!chosen) return
    d.wm.windows.filter((w) => w.app === chosen.app).forEach((w) => d.wmDispatch({ type: 'close', id: w.id }))
    d.emit({ type: 'closeApp', app: chosen.app })
    d.emit({ type: 'custom', event: 'forcequit-done' })
    setConfirm(false)
    setSel(null)
  }
  return (
    <div className="relative flex h-full flex-col gap-3 bg-gray-50 p-4 text-sm text-gray-900" data-coach="forcequit-content">
      <p className="text-gray-700">If an app doesn’t respond, select its name and click Force Quit.</p>
      <ul role="listbox" aria-label="Applications" className="min-h-0 flex-1 overflow-auto rounded-lg border border-gray-300 bg-white">
        {apps.length === 0 && <li className="p-3 text-gray-500">No apps are open.</li>}
        {apps.map((a) => (
          <li key={a.app}>
            <button
              type="button"
              role="option"
              aria-selected={sel === a.app}
              data-coach={`forcequit-row-${a.app}`}
              onClick={() => setSel(a.app)}
              className={`flex min-h-10 w-full items-center gap-2 px-3 text-left ${sel === a.app ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              <span>{a.name}</span>
              {a.notResponding && <span className={sel === a.app ? 'text-white' : 'text-red-600'}>(not responding)</span>}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button type="button" data-coach="forcequit-button" disabled={!chosen} onClick={() => setConfirm(true)} className="min-h-9 rounded-md bg-blue-500 px-4 text-white disabled:bg-gray-300 disabled:text-gray-500">
          Force Quit
        </button>
      </div>
      {confirm && chosen && (
        <SimDialog
          title={`Do you want to force ${chosen.name} to quit?`}
          onClose={() => setConfirm(false)}
          buttons={[
            { label: 'Cancel', id: 'forcequit-cancel', onClick: () => setConfirm(false) },
            { label: 'Force Quit', id: 'forcequit-confirm', primary: true, onClick: doQuit },
          ]}
        >
          You will lose any unsaved changes.
        </SimDialog>
      )}
    </div>
  )
}

export function register() {
  registerApp({
    id: 'forcequit',
    title: () => 'Force Quit Applications',
    descriptionBn: 'আটকে যাওয়া প্রোগ্রাম জোর করে বন্ধ করার জানালা',
    icon: ({ size }) => <TaskManagerIcon size={size} />,
    component: ForceQuit,
    defaultSize: { w: 420, h: 340 },
    os: 'mac',
  })
  registerSystemShortcut('mac', 'alt+cmd+esc', (d) => d.openApp('forcequit'))
}
