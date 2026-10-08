/**
 * "App Installer" — a simulated, generic download + Setup wizard (Module 6).
 * It can only "install" one pretend app, Calculator Plus. No network, nothing real is installed.
 */
import { useEffect, useState } from 'react'
import { registerApp } from '../registry'
import { useDesktop } from '../../DesktopContext'
import type { WinState } from '../../windowManager'
import { AppFileIcon } from '../../ui/icons'
import { CALC_ID, CALC_NAME, installCalc, useInstalled } from './installState'
import { CalcPlusIcon } from './calcplus'

export type InstallStage = 'store' | 'downloading' | 'welcome' | 'ready' | 'installing' | 'done'

/** Next stage after a button press / a finished progress bar. Pure, so it is unit-tested. */
export function nextStage(s: InstallStage): InstallStage {
  switch (s) {
    case 'store':
      return 'downloading'
    case 'downloading':
      return 'welcome'
    case 'welcome':
      return 'ready'
    case 'ready':
      return 'installing'
    case 'installing':
      return 'done'
    case 'done':
      return 'done'
  }
}

const SPEED = 1100

function Progress({ coach, label, onDone }: { coach: string; label: string; onDone: () => void }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t0 = Date.now()
    const id = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - t0) / SPEED) * 100)
      setPct(p)
      if (p >= 100) {
        window.clearInterval(id)
        onDone()
      }
    }, 80)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div data-coach={coach} role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} className="my-4">
      <div className="mb-1 text-sm text-gray-600">{label}</div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Installer({ win }: { win: WinState }) {
  const d = useDesktop()
  const installed = useInstalled()
  const [stage, setStage] = useState<InstallStage>('store')
  const emit = (event: string) => d.emit({ type: 'custom', event })
  const go = () => setStage((s) => nextStage(s))
  const primary = 'min-h-10 rounded bg-blue-600 px-5 text-white hover:bg-blue-700'
  const secondary = 'min-h-10 rounded border border-gray-400 bg-white px-5 hover:bg-gray-50'

  const warning = (
    <div data-coach="installer-warning" role="note" className="rounded border border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
      <strong>Install only from official sources:</strong> the maker’s own website or your computer’s official app store. Never install something because a pop-up, a message or a stranger told you to.
    </div>
  )

  let body
  if (stage === 'store') {
    body = (
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">Get apps</h1>
        <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
          <CalcPlusIcon size={56} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{CALC_NAME}</div>
            <div className="text-sm text-gray-600">A small calculator · Practice Software (made up for practice)</div>
            <div className="mt-1 inline-block rounded bg-green-100 px-2 text-xs text-green-800">Official source</div>
          </div>
          {installed ? (
            <button type="button" data-coach="installer-open" className={secondary} onClick={() => d.openApp(CALC_ID)}>
              Open
            </button>
          ) : (
            <button
              type="button"
              data-coach="installer-download"
              className={primary}
              onClick={() => {
                setStage('downloading')
              }}
            >
              Download
            </button>
          )}
        </div>
        {installed && <p className="text-sm text-green-700">Installed ✓</p>}
        {warning}
      </div>
    )
  } else if (stage === 'downloading') {
    body = (
      <div>
        <h1 className="text-lg font-semibold">Downloading {CALC_NAME}…</h1>
        <p className="text-sm text-gray-600">The setup file is being copied to this computer.</p>
        <Progress
          coach="installer-download-progress"
          label="Downloading"
          onDone={() => {
            emit('installer-downloaded')
            go()
          }}
        />
      </div>
    )
  } else {
    body = (
      <div className="flex min-h-80 flex-col" data-coach="installer-setup">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <AppFileIcon size={36} />
          <h1 className="text-lg font-semibold">{CALC_NAME} Setup</h1>
        </div>
        <div className="flex-1 py-4 text-sm">
          {stage === 'welcome' && <p>Welcome to the {CALC_NAME} Setup. This will put {CALC_NAME} on your computer. Click Next to continue.</p>}
          {stage === 'ready' && <p>Setup is ready to install {CALC_NAME}. Click Install to begin.</p>}
          {stage === 'installing' && (
            <Progress
              coach="installer-install-progress"
              label="Installing"
              onDone={() => {
                installCalc(d.vfs, d.os)
                emit('installer-installed')
                go()
              }}
            />
          )}
          {stage === 'done' && <p data-coach="installer-done-text">{CALC_NAME} has been installed. Click Finish to close Setup.</p>}
        </div>
        <div className="flex justify-end gap-2 bg-gray-100 px-3 py-3">
          {stage !== 'done' && (
            <button type="button" className={secondary} disabled={stage === 'installing'} onClick={() => setStage('store')} data-coach="installer-cancel">
              Cancel
            </button>
          )}
          {stage === 'welcome' && (
            <button type="button" className={primary} data-coach="installer-next" onClick={go}>
              Next &gt;
            </button>
          )}
          {stage === 'ready' && (
            <button type="button" className={primary} data-coach="installer-install" onClick={go}>
              Install
            </button>
          )}
          {stage === 'done' && (
            <button
              type="button"
              className={primary}
              data-coach="installer-finish"
              onClick={() => {
                emit('installer-finished')
                d.closeWindow(win.id)
              }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    )
  }
  return <div className="h-full overflow-auto bg-white p-5 text-gray-900">{body}</div>
}

export function register() {
  registerApp({
    id: 'installer',
    title: () => 'App Installer',
    descriptionBn: 'নতুন প্রোগ্রাম নামানো ও ইনস্টল করার নকল প্রোগ্রাম (শুধু অনুশীলনের জন্য)',
    icon: ({ size }) => <AppFileIcon size={size} />,
    component: Installer,
    defaultSize: { w: 560, h: 440 },
  })
}
