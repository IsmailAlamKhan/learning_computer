/** Windows Settings → Apps → Installed apps (simulated): lists installed extra apps with a ⋯ menu → Uninstall. */
import { useState } from 'react'
import { useDesktop } from '../../DesktopContext'
import { CALC_ID, CALC_NAME, uninstallCalc, useInstalled } from './installState'
import { CalcPlusIcon } from './calcplus'
import { SimDialog } from '../../ui/SimDialog'

export function InstalledApps() {
  const d = useDesktop()
  const installed = useInstalled()
  const [menu, setMenu] = useState(false)
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="relative min-h-72">
      <h2 className="mb-2 font-medium">Installed apps</h2>
      {!installed ? (
        <p data-coach="settings-apps-empty" className="rounded border border-dashed border-gray-300 p-4 text-gray-600">
          No extra apps are installed. Apps you install will be listed here.
        </p>
      ) : (
        <div className="flex min-h-14 items-center gap-3 rounded border border-gray-200 px-3" data-coach={`settings-app-${CALC_NAME}`}>
          <CalcPlusIcon size={32} />
          <div className="min-w-0 flex-1">
            <div className="font-medium">{CALC_NAME}</div>
            <div className="text-xs text-gray-500">Practice Software · 1.0</div>
          </div>
          <div className="relative">
            <button type="button" aria-label={`More options for ${CALC_NAME}`} aria-haspopup="menu" aria-expanded={menu} data-coach={`settings-app-menu-${CALC_NAME}`} onClick={() => setMenu((m) => !m)} className="min-h-9 min-w-9 rounded px-2 text-xl hover:bg-gray-100">
              ⋯
            </button>
            {menu && (
              <div role="menu" className="absolute top-full right-0 z-20 min-w-40 rounded-md border border-gray-300 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  role="menuitem"
                  data-coach={`settings-app-uninstall-${CALC_NAME}`}
                  className="flex min-h-9 w-full items-center px-3 text-left hover:bg-gray-100"
                  onClick={() => {
                    setMenu(false)
                    setConfirm(true)
                  }}
                >
                  Uninstall
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {confirm && (
        <SimDialog
          title="Uninstall"
          onClose={() => setConfirm(false)}
          buttons={[
            { label: 'Cancel', id: 'settings-uninstall-cancel', onClick: () => setConfirm(false) },
            {
              label: 'Uninstall',
              id: 'settings-uninstall-confirm',
              primary: true,
              onClick: () => {
                setConfirm(false)
                d.closeApp(CALC_ID)
                uninstallCalc()
                d.emit({ type: 'custom', event: 'app-uninstalled' })
              },
            },
          ]}
        >
          This app and its related info will be uninstalled.
        </SimDialog>
      )}
    </div>
  )
}
