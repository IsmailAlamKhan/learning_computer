/**
 * "Setup" wizard (Module 18): the simulated installer that opens when she double-clicks a downloaded practice installer
 * (.exe/.msi on Windows, .pkg/.dmg on Mac). Nothing real is installed — it flips flags in the tool state
 * (`extra-support/toolState.ts`) which the practice terminal reads.
 */
import { useEffect, useState } from 'react'
import { registerApp } from '../registry'
import { useDesktop } from '../../DesktopContext'
import type { WinState } from '../../windowManager'
import { AppFileIcon } from '../../ui/icons'
import { SimDialog } from '../../ui/SimDialog'
import { DropZone, useDrag } from '../../dnd'
import { registerInstallerHandler } from '../../installerRegistry'
import { installTool } from '../extra-support/toolState'
import { needsPath, nextPage, passwordOk, PRACTICE_PASSWORD, TOOL_NAME, toolForFile, type PageId, type SetupTool } from '../extra-support/setupModel'
import { CodeIcon } from '../../editor/CodeIcon'

const APP_FILE = 'Practice Editor.app'
const SPEED = 1200

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

/** A checkbox drawn as a button (role="checkbox"): a native controlled <input> loses its state when a guided step advances during the same click. */
function Check({ coach, checked, onChange, children, bold }: { coach: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; bold?: boolean }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} data-coach={coach} onClick={() => onChange(!checked)} className={`flex min-h-9 items-center gap-2 text-left text-sm ${bold ? 'font-medium' : ''}`}>
      <span aria-hidden="true" className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-gray-600 bg-white text-[11px] leading-none">
        {checked ? '✓' : ''}
      </span>
      <span>{children}</span>
    </button>
  )
}

const LICENSE = 'This is a practice license text. In a real installer you are asked to read and accept the licence before going on. Nothing you click here installs anything real.'

function DmgDrag({ onDropped }: { onDropped: () => void }) {
  const drag = useDrag({ payload: 'editor-app', ghost: null })
  return (
    <div className="flex items-center justify-around gap-6 py-6">
      <div {...drag} data-coach="setup-dmg-app" className="flex w-32 cursor-grab flex-col items-center gap-1 rounded p-2 text-center text-sm select-none">
        <CodeIcon size={64} />
        <span>Practice Editor</span>
      </div>
      <span aria-hidden="true" className="text-3xl text-gray-500">
        →
      </span>
      <DropZone id="setup-dmg-apps" onDrop={onDropped} className="flex w-32 flex-col items-center gap-1 rounded border-2 border-dashed border-gray-400 p-3 text-center text-sm data-[drop-over=true]:border-blue-600 data-[drop-over=true]:bg-blue-50">
        <span className="text-4xl" aria-hidden="true">
          📁
        </span>
        <span>Applications</span>
      </DropZone>
    </div>
  )
}

export function M18Setup({ win }: { win: WinState }) {
  const d = useDesktop()
  const mac = d.os === 'mac'
  const fileName = typeof win.props?.fileName === 'string' ? win.props.fileName : ''
  const tool = toolForFile(fileName)
  const [page, setPage] = useState<PageId | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [pathTick, setPathTick] = useState(false)
  const [adminTick, setAdminTick] = useState(true)
  const [agreeSheet, setAgreeSheet] = useState(false)
  const [pw, setPw] = useState('')
  const [pwWrong, setPwWrong] = useState(false)
  const [foundOnPath, setFoundOnPath] = useState(true)
  const emit = (event: string) => d.emit({ type: 'custom', event })

  if (!tool) {
    return <div className="p-5 text-sm text-gray-800">“{fileName}” can’t be opened in this practice computer.</div>
  }
  const t: SetupTool = tool
  const name = TOOL_NAME[t]
  const first: PageId = mac ? (t === 'vscode' ? 'dmg' : 'intro') : t === 'python' ? 'options' : t === 'node' ? 'welcome' : 'license'
  const cur: PageId = page ?? first
  const go = () => setPage(nextPage(d.os, t, cur))
  const close = () => d.closeWindow(win.id)

  const finishInstall = () => {
    const ok = !needsPath(d.os, t) || pathTick
    installTool(d.vfs, t, { path: ok })
    setFoundOnPath(ok)
    if (mac && t === 'vscode') {
      const apps = d.vfs.child(d.vfs.root, 'Applications')
      if (apps && !d.vfs.child(apps, APP_FILE)) d.vfs.createFile(apps, APP_FILE)
    }
    emit(`setup-installed:${t}`)
    if (ok) emit(`tool-installed:${t}`)
    go()
  }

  const primary = 'min-h-10 rounded bg-blue-600 px-5 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500'
  const secondary = 'min-h-10 rounded border border-gray-400 bg-white px-5 hover:bg-gray-50 disabled:text-gray-400'
  const installing = cur === 'installing'

  // ---------- page bodies (English, like a real installer) ----------
  let body: React.ReactNode = null
  let buttons: React.ReactNode = null
  const nextBtn = (label = mac ? 'Continue' : 'Next >', disabled = false, onClick: () => void = go) => (
    <button type="button" className={primary} data-coach="setup-next" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
  const cancelBtn = (
    <button type="button" className={secondary} data-coach="setup-cancel" disabled={installing} onClick={close}>
      Cancel
    </button>
  )

  switch (cur) {
    case 'options':
      body = (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Install {name} {t === 'python' ? '3.12.4 (64-bit)' : ''}</h2>
          <div className="rounded border border-gray-300 p-3 text-sm">
            <p className="font-semibold">Install Now</p>
            <p className="text-gray-600">Installs {name} for the current user, with IDLE, pip and documentation.</p>
          </div>
          <Check coach="setup-admin" checked={adminTick} onChange={setAdminTick}>
            Use admin privileges when installing py.exe
          </Check>
          <Check
            coach="setup-path"
            bold
            checked={pathTick}
            onChange={(v) => {
              setPathTick(v)
              emit(v ? 'setup-path-ticked' : 'setup-path-unticked')
            }}
          >
            Add python.exe to PATH
          </Check>
          <p className="text-xs text-gray-500">Customize installation → (not available in this practice)</p>
        </div>
      )
      buttons = (
        <>
          {cancelBtn}
          <button type="button" className={primary} data-coach="setup-install" onClick={go}>
            Install Now
          </button>
        </>
      )
      break
    case 'welcome':
      body = <p className="text-sm">Welcome to the {name} Setup Wizard. The Setup Wizard will install {name} on your computer. Click Next to continue.</p>
      buttons = (
        <>
          {cancelBtn}
          {nextBtn()}
        </>
      )
      break
    case 'license':
      if (mac) {
        body = (
          <div className="space-y-2 text-sm">
            <h2 className="font-semibold">Software License Agreement</h2>
            <div className="h-28 overflow-auto rounded border border-gray-300 bg-white p-2 text-xs">{LICENSE}</div>
          </div>
        )
        buttons = (
          <>
            <button type="button" className={secondary} onClick={() => setPage(t === 'python' ? 'readme' : 'intro')}>
              Go Back
            </button>
            {nextBtn('Continue', false, () => setAgreeSheet(true))}
          </>
        )
      } else {
        body = (
          <div className="space-y-2 text-sm">
            <h2 className="font-semibold">License Agreement</h2>
            <div className="h-24 overflow-auto rounded border border-gray-300 bg-white p-2 text-xs">{LICENSE}</div>
            <Check coach="setup-accept" checked={accepted} onChange={setAccepted}>
              I accept the terms in the License Agreement
            </Check>
          </div>
        )
        buttons = (
          <>
            {cancelBtn}
            {nextBtn('Next >', !accepted)}
          </>
        )
      }
      break
    case 'destination':
      body = (
        <div className="space-y-2 text-sm">
          <h2 className="font-semibold">{mac ? 'Destination Select' : 'Destination Folder'}</h2>
          <p>{mac ? 'Install for all users of this computer (the standard choice).' : `${name} will be installed in:`}</p>
          <p className="rounded border border-gray-300 bg-white p-2 font-mono text-xs">{mac ? 'Macintosh HD' : `C:\\Program Files\\${name}\\`}</p>
        </div>
      )
      buttons = (
        <>
          {mac ? <button type="button" className={secondary} onClick={() => setPage(t === 'node' ? 'license' : 'intro')}>Go Back</button> : cancelBtn}
          {nextBtn()}
        </>
      )
      break
    case 'custom':
      body = (
        <div className="space-y-2 text-sm">
          <h2 className="font-semibold">{t === 'node' ? 'Custom Setup' : 'Select Additional Tasks'}</h2>
          <ul className="space-y-1">
            {(t === 'node' ? ['Node.js runtime', 'npm package manager', 'Add to PATH'] : ['Add to PATH (requires shell restart)', 'Add “Open with” action to the file context menu', 'Create a desktop icon']).map((x) => (
              <li key={x}>☑ {x}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-500">The standard choices are fine. Do not tick extra toolbars or “offers” — there are none in the real installer either.</p>
        </div>
      )
      buttons = (
        <>
          {cancelBtn}
          {nextBtn()}
        </>
      )
      break
    case 'ready':
      body = <p className="text-sm">Ready to install {name}. Click Install to begin the installation, or Back to review your choices.</p>
      buttons = (
        <>
          {cancelBtn}
          <button type="button" className={primary} data-coach="setup-install" onClick={go}>
            Install
          </button>
        </>
      )
      break
    case 'uac':
      body = <p className="text-sm text-gray-500">Waiting for permission…</p>
      buttons = null
      break
    case 'intro':
      body = (
        <div className="space-y-2 text-sm">
          <h2 className="font-semibold">Welcome to the {name} Installer</h2>
          <p>You will be guided through the steps necessary to install this software.</p>
        </div>
      )
      buttons = nextBtn()
      break
    case 'readme':
      body = (
        <div className="space-y-2 text-sm">
          <h2 className="font-semibold">Important Information</h2>
          <p>This is the “Read Me” page. It tells you what is being installed. (Practice text.)</p>
        </div>
      )
      buttons = (
        <>
          <button type="button" className={secondary} onClick={() => setPage('intro')}>
            Go Back
          </button>
          {nextBtn()}
        </>
      )
      break
    case 'type':
      body = (
        <div className="space-y-2 text-sm">
          <h2 className="font-semibold">Standard Install on “Macintosh HD”</h2>
          <p>This will take about 100 MB of space on your computer. Click Install to perform a standard installation.</p>
        </div>
      )
      buttons = (
        <>
          <button type="button" className={secondary} onClick={() => setPage(t === 'node' ? 'destination' : 'license')}>
            Go Back
          </button>
          <button type="button" className={primary} data-coach="setup-install" onClick={() => setPage('password')}>
            Install
          </button>
        </>
      )
      break
    case 'password':
      body = <p className="text-sm text-gray-500">Waiting for your password…</p>
      break
    case 'dmg':
      body = (
        <div className="text-sm">
          <h2 className="font-semibold">Practice Editor</h2>
          <p>Drag Practice Editor to the Applications folder to install it.</p>
          <DmgDrag onDropped={() => setPage('installing')} />
        </div>
      )
      buttons = cancelBtn
      break
    case 'installing':
      body = (
        <Progress
          coach="setup-progress"
          label={mac && t === 'vscode' ? 'Copying…' : mac ? 'Installing…' : `Installing ${name}…`}
          onDone={finishInstall}
        />
      )
      break
    case 'done':
      body = (
        <div className="space-y-2 text-sm" data-coach="setup-done-text">
          <h2 className="font-semibold">{mac ? (t === 'vscode' ? 'Copy finished' : 'The installation was successful') : t === 'python' ? 'Setup was successful' : `Completed the ${name} Setup Wizard`}</h2>
          <p>
            {mac && t === 'vscode'
              ? 'Practice Editor is now in your Applications folder.'
              : mac
                ? 'The software was installed. You can close the installer now.'
                : `${name} has been installed on your computer.`}
          </p>
          {!foundOnPath && (
            <p data-coach="setup-nopath-note" role="note" className="rounded border border-amber-400 bg-amber-50 p-2 text-amber-900">
              Setup finished, but “Add python.exe to PATH” was not ticked, so the terminal may not find Python. (Real installers do not warn you either — run the installer again to fix it.)
            </p>
          )}
        </div>
      )
      buttons = (
        <button type="button" className={primary} data-coach="setup-finish" onClick={() => (emit(`setup-finished:${t}`), close())}>
          {mac ? (t === 'vscode' ? 'Done' : 'Close') : t === 'python' ? 'Close' : 'Finish'}
        </button>
      )
      break
  }

  const sidebar = mac && t !== 'vscode' ? ['Introduction', ...(t === 'python' ? ['Read Me'] : []), 'License', ...(t === 'node' ? ['Destination Select'] : []), 'Installation Type', 'Installation', 'Summary'] : null
  const sideActive: Record<string, string> = { intro: 'Introduction', readme: 'Read Me', license: 'License', destination: 'Destination Select', type: 'Installation Type', password: 'Installation Type', installing: 'Installation', done: 'Summary' }

  return (
    <div className="relative flex h-full flex-col bg-white text-gray-900" data-coach="setup-window">
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-2">
        <AppFileIcon size={32} />
        <h1 className="text-base font-semibold">{mac ? `Install ${name}` : `${name} Setup`}</h1>
      </div>
      <div className="flex min-h-0 flex-1">
        {sidebar && (
          <ol className="w-40 shrink-0 space-y-1 border-r border-gray-200 bg-gray-50 p-3 text-xs">
            {sidebar.map((s) => (
              <li key={s} className={sideActive[cur] === s ? 'font-bold text-gray-900' : 'text-gray-500'}>
                {sideActive[cur] === s ? '● ' : '○ '}
                {s}
              </li>
            ))}
          </ol>
        )}
        <div className="min-w-0 flex-1 overflow-auto p-4">{body}</div>
      </div>
      <div className="flex justify-end gap-2 bg-gray-100 px-3 py-3">{buttons}</div>

      {agreeSheet && (
        <SimDialog
          title="Software License Agreement"
          id="setup-agree-sheet"
          onClose={() => setAgreeSheet(false)}
          buttons={[
            { label: 'Disagree', id: 'setup-disagree', onClick: () => setAgreeSheet(false) },
            {
              label: 'Agree',
              id: 'setup-agree',
              primary: true,
              onClick: () => {
                setAgreeSheet(false)
                go()
              },
            },
          ]}
        >
          To continue installing the software you must agree to the terms of the software license agreement. Click Agree to continue or click Disagree to cancel the installation.
        </SimDialog>
      )}

      {cur === 'uac' && (
        <SimDialog
          title="User Account Control"
          id="setup-uac"
          buttons={[
            { label: 'Yes', id: 'setup-uac-yes', primary: true, onClick: () => (emit('setup-uac-allowed'), go()) },
            { label: 'No', id: 'setup-uac-no', onClick: () => setPage('ready') },
          ]}
        >
          <p className="font-semibold">Do you want to allow this app to make changes to your device?</p>
          <p className="mt-1 text-xs text-gray-600">{name} installer · Verified publisher: Practice Software (made up for practice)</p>
        </SimDialog>
      )}

      {cur === 'password' && (
        <SimDialog
          title="Installer"
          id="setup-password-dialog"
          buttons={[
            { label: 'Cancel', id: 'setup-password-cancel', onClick: () => setPage('type') },
            {
              label: 'Install Software',
              id: 'setup-password-ok',
              primary: true,
              onClick: () => {
                if (passwordOk(pw)) {
                  setPwWrong(false)
                  emit('setup-password-ok')
                  go()
                } else setPwWrong(true)
              },
            },
          ]}
        >
          <p>Installer is trying to install new software. Enter your password to allow this.</p>
          <input type="text" readOnly value="anika" aria-label="User name" className="mt-2 min-h-9 w-full rounded border border-gray-300 bg-gray-100 px-2 text-sm" />
          <input
            type="password"
            data-coach="setup-password"
            aria-label="Password"
            placeholder="Password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value)
              setPwWrong(false)
            }}
            className="mt-2 min-h-9 w-full rounded border border-gray-300 px-2 text-sm"
          />
          <p className="mt-2 rounded border border-amber-300 bg-amber-50 p-2 text-left text-xs text-amber-900" data-coach="setup-practice-password">
            Practice only: type <strong>{PRACTICE_PASSWORD}</strong>. On a real Mac you type your own computer password, which only you know.
          </p>
          {pwWrong && (
            <p role="alert" data-coach="setup-password-wrong" className="mt-2 text-left text-xs text-red-700">
              That password is not correct. Try again (practice password: {PRACTICE_PASSWORD}).
            </p>
          )}
        </SimDialog>
      )}
    </div>
  )
}

export function register() {
  registerApp({
    id: 'm18setup',
    title: () => 'Setup',
    descriptionBn: 'ডাউনলোড করা ইনস্টলার খুললে যে ধাপে ধাপে সেটআপের জানালা আসে, তার অনুশীলন (নকল)',
    icon: ({ size }) => <AppFileIcon size={size} />,
    component: M18Setup,
    defaultSize: { w: 560, h: 420 },
  })
}

registerInstallerHandler(/^practice-(python|node|editor)-.*\.(exe|msi|pkg|dmg)$/i, 'm18setup')
