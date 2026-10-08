import { useState, type ComponentType } from 'react'
import type { OsFlavor } from '../engine/types'
import { SimBus } from './bus'
import { DesktopProvider, type SimSettings } from './DesktopContext'
import { Frame } from './Frame'
import { ShortcutPad } from './ui/ShortcutPad'
import { VirtualFileSystem } from './vfs'
import { registerBuiltinApps } from './apps'
import WindowsShell, { WINDOWS_INSET } from './windows/WindowsShell'
import MacShell, { MAC_INSET } from './mac/MacShell'

registerBuiltinApps()

interface Props {
  os: OsFlavor
  bus: SimBus
  userName?: string
  /** Called after the learner presses "রিসেট" (so a lesson can restart its guided steps). */
  onReset?: () => void
  showPad?: boolean
  initialSettings?: Partial<SimSettings>
  vfsFactory?: () => VirtualFileSystem
  /** Extra controls shown in the toolbar above the desktop. */
  toolbarExtra?: React.ReactNode
}

const SHELLS: Record<OsFlavor, { Shell: ComponentType; top: number; bottom: number }> = {
  windows: { Shell: WindowsShell, ...WINDOWS_INSET },
  mac: { Shell: MacShell, ...MAC_INSET },
}

/** A complete simulated computer with its own bus, reset button and shortcut pad. */
export function SimStage({ os, bus, userName = 'Anika', onReset, showPad = true, initialSettings, vfsFactory, toolbarExtra }: Props) {
  const [resetKey, setResetKey] = useState(0)
  const [pad, setPad] = useState(false)
  const { Shell, top, bottom } = SHELLS[os]
  return (
    <div className="space-y-3">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          এটি একটি নিরাপদ নকল {os === 'mac' ? 'Mac' : 'Windows'} কম্পিউটার — এখানে কিছু ভুল হলে আসল কম্পিউটারের কিছুই হবে না।
        </p>
        <div className="flex flex-wrap gap-2">
          {toolbarExtra}
          {showPad && (
            <button className="btn btn-outline" aria-expanded={pad} onClick={() => setPad((p) => !p)}>
              ⌨ শর্টকাট প্যাড
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={() => {
              setResetKey((k) => k + 1)
              onReset?.()
            }}
          >
            ↺ রিসেট
          </button>
        </div>
      </div>
      <DesktopProvider key={resetKey} os={os} userName={userName} bus={bus} insets={{ top, bottom }} initialSettings={initialSettings} vfsFactory={vfsFactory}>
        <Frame Shell={Shell} insetTop={top} insetBottom={bottom} />
        {pad && <ShortcutPad />}
      </DesktopProvider>
    </div>
  )
}
