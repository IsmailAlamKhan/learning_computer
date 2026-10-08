/**
 * Rendered once per simulated desktop (SimStage): the "hardware panel" below the screen (insert a USB stick, plug in a phone)
 * and, drawn on top of the simulated screen through a portal: tray / Dock icons, the screenshot overlays and notifications.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDesktop, type DesktopApi } from '../DesktopContext'
import { dropZoneProps } from '../dnd'
import { PrinterIcon, UsbIcon } from '../ui/icons'
import { findNode } from '../apps/util'
import { errorMessageEn } from '../vfs'
import { useDevices, type HwNotice } from './store'

const NOTICE_BN: Record<Exclude<HwNotice, null>, string> = {
  'usb-in': 'পেনড্রাইভ লাগানো হয়েছে। কম্পিউটারের ফাইল ম্যানেজারে এখন এটি দেখা যাবে।',
  'usb-ejected': 'চমৎকার! Eject করা হয়েছে, এখন পেনড্রাইভটি নিরাপদে খুলে নেওয়া যায়।',
  'usb-pulled-safe': 'পেনড্রাইভ নিরাপদে খুলে নেওয়া হয়েছে। আপনার ফাইল ঠিক আছে।',
  'usb-pulled-unsafe': 'একটু সাবধান — Eject না করেই খুলে নিলে ফাইল নষ্ট হয়ে যেতে পারে। এবার আসল কম্পিউটারে আগে Eject করে তারপর খুলবেন।',
  'phone-prompt': 'ফোনের পর্দায় একটি প্রশ্ন এসেছে। ফাইল আদান-প্রদানের অনুমতি দিতে নিচের ফোনের পর্দায় বোতামে ক্লিক করুন।',
  'phone-in': 'ফোন যুক্ত হয়েছে। ফাইল ম্যানেজারে "Phone" নামে দেখুন।',
  'phone-out': 'ফোনের কেবল খুলে নেওয়া হয়েছে।',
}

function HardwarePanel() {
  const d = useDesktop()
  const { store, state } = useDevices(d)
  const mac = d.os === 'mac'
  const btn = 'min-h-11 rounded-lg border-2 px-3 text-sm font-medium hover:bg-sunken'
  return (
    <div className="no-print space-y-3 rounded-xl border p-3" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }} data-testid="hardware-panel" data-coach="hardware-panel" onClickCapture={(e) => {
        // the panel sits outside the simulated screen, so the screen's own click capture never sees it
        const id = (e.target as HTMLElement).closest('[data-coach]')?.getAttribute('data-coach')
        if (id && id !== 'hardware-panel') d.emit({ type: 'click', target: id })
      }}>
      <div className="text-sm">
        <strong>হার্ডওয়্যার প্যানেল:</strong> এখানকার বোতাম দিয়ে নকল পেনড্রাইভ আর ফোন কম্পিউটারে লাগাতে বা খুলতে পারবেন — কিছুই নষ্ট হবে না।
      </div>
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex flex-col gap-1.5">
          {state.usb === 'out' ? (
            <button type="button" data-coach="hw-usb-insert" className={btn} style={{ borderColor: 'var(--c-line)' }} onClick={() => store.insertUsb()}>
              💾 পেনড্রাইভ লাগান
            </button>
          ) : (
            <button type="button" data-coach="hw-usb-pull" className={btn} style={{ borderColor: 'var(--c-line)' }} onClick={() => store.pullUsb()}>
              {state.usbMounted ? '⚠ Eject না করেই টেনে খুলে নিন' : '✔ পেনড্রাইভ খুলে নিন (এখন নিরাপদ)'}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {state.phone === 'out' ? (
            <button type="button" data-coach="hw-phone-connect" className={btn} style={{ borderColor: 'var(--c-line)' }} onClick={() => store.connectPhone()}>
              📱 ফোন কেবল দিয়ে যুক্ত করুন
            </button>
          ) : (
            <button type="button" data-coach="hw-phone-disconnect" className={btn} style={{ borderColor: 'var(--c-line)' }} onClick={() => store.disconnectPhone()}>
              ফোনের কেবল খুলে নিন
            </button>
          )}
        </div>
        {state.phone === 'prompt' && (
          <div className="w-52 rounded-2xl border-4 border-gray-700 bg-gray-900 p-3 text-center text-white" data-testid="phone-screen" aria-label="Phone screen">
            <div className="mb-2 text-xs">Use USB for</div>
            <button type="button" data-coach="hw-phone-allow" className="min-h-11 w-full rounded-lg bg-sky-500 px-3 text-sm font-medium text-white" onClick={() => store.allowPhone()}>
              File transfer
            </button>
            <div className="mt-1 text-[11px] text-gray-300">Charging only</div>
          </div>
        )}
      </div>
      {state.notice && (
        <p className="text-sm" role="status" data-testid="hw-notice">
          {NOTICE_BN[state.notice]}
        </p>
      )}
      {mac && state.phone !== 'out' && (
        <p className="text-sm text-muted">
          মনে রাখুন: আসল Mac-এ iPhone-এর ছবি আনতে Photos বা Image Capture প্রোগ্রাম লাগে; Android ফোনের জন্য একটি আলাদা ট্রান্সফার টুল (যেমন Android File Transfer) লাগে। এই অনুশীলনে সহজ করে ফোনটি একটি ড্রাইভের মতো দেখানো হচ্ছে।
        </p>
      )}
    </div>
  )
}

function TrayIcons({ d }: { d: DesktopApi }) {
  const { store, state } = useDevices(d)
  const [popup, setPopup] = useState(false)
  useEffect(() => {
    if (!state.usbMounted) setPopup(false)
  }, [state.usbMounted])
  const showPrinter = state.jobs.length > 0
  return (
    <div className="absolute bottom-0 z-[1001] flex h-12 items-center gap-1" style={{ right: 200 }}>
      {showPrinter && (
        <button type="button" data-coach="tray-printer" aria-label="Printer — print jobs in queue" title="Printer" className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/10" onClick={() => d.openApp('printqueue')}>
          <PrinterIcon size={22} />
        </button>
      )}
      {state.usbMounted && (
        <div className="relative">
          <button type="button" data-coach="tray-usb" aria-label="Safely Remove Hardware and Eject Media" aria-expanded={popup} title="Safely Remove Hardware and Eject Media" className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/10" onClick={() => setPopup((p) => !p)}>
            <UsbIcon size={22} />
          </button>
          {popup && (
            <div role="menu" className="absolute right-0 bottom-11 w-64 rounded-lg border border-gray-300 bg-white p-1 text-sm text-gray-900 shadow-xl">
              <button
                type="button"
                role="menuitem"
                data-coach="tray-eject"
                className="min-h-10 w-full rounded px-3 text-left hover:bg-gray-100"
                onClick={() => {
                  setPopup(false)
                  store.ejectUsb()
                }}
              >
                Eject {store.usbName()}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** Mac: the plugged-in drives sit on the desktop like in Finder's default setup. */
function MacDriveIcons({ d }: { d: DesktopApi }) {
  const { store } = useDevices(d)
  const mounts = d.vfs.mounts
  return (
    <>
      {mounts.map((m, i) => (
        <div
          key={m.id}
          {...dropZoneProps(
            (p) => {
              const pl = p as { kind?: string; id?: string; ids?: string[] }
              if (pl.kind !== 'node') return
              for (const id of pl.ids ?? (pl.id ? [pl.id] : [])) {
                const n = findNode(d.vfs.root, id)
                if (!n) continue
                try {
                  d.vfs.copy(n, m)
                } catch (e) {
                  d.toast(errorMessageEn(e, d.os))
                }
              }
            },
            (p) => (p as { kind?: string })?.kind === 'node',
          )}
          data-coach={`icon-${m.name}`}
          role="button"
          tabIndex={0}
          aria-label={m.name}
          className="absolute z-[2] flex w-[84px] flex-col items-center gap-1 rounded-md p-1 text-center outline-none hover:bg-white/15 data-[drop-over=true]:bg-sky-300/50"
          style={{ top: 36 + i * 100, right: 100 }}
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={() => d.openFolder(d.vfs.canonPath(m))}
          onKeyDown={(e) => e.key === 'Enter' && d.openFolder(d.vfs.canonPath(m))}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            d.openMenu(e, [
              { id: 'open', label: 'Open', onSelect: () => d.openFolder(d.vfs.canonPath(m)) },
              ...(m.mount?.kind === 'usb' ? [{ id: 'eject', label: `Eject “${m.name}”`, onSelect: () => store.ejectUsb() }] : []),
            ])
          }}
        >
          <span className="pointer-events-none drop-shadow">{m.mount?.kind === 'usb' ? <UsbIcon size={44} /> : <UsbIcon size={44} />}</span>
          <span className="pointer-events-none line-clamp-2 w-full text-xs leading-tight break-words text-white [text-shadow:0_1px_3px_rgba(0,0,0,.9)]">{m.name}</span>
        </div>
      ))}
    </>
  )
}

function MacDockPrinter({ d }: { d: DesktopApi }) {
  const { state } = useDevices(d)
  if (!state.jobs.length) return null
  return (
    <div className="absolute right-3 bottom-2 z-[1001]">
      <button type="button" data-coach="dock-printer" aria-label="Printer — print jobs in queue" title="Printer" className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/40 bg-white/35 shadow-xl backdrop-blur-xl" onClick={() => d.openApp('printqueue')}>
        <PrinterIcon size={44} />
      </button>
    </div>
  )
}

function ShotOverlay({ d }: { d: DesktopApi }) {
  const { store, state } = useDevices(d)
  const mac = d.os === 'mac'
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  const mode = state.shotMode
  useEffect(() => {
    if (mode) ref.current?.focus()
  }, [mode])
  const [toolMode, setToolMode] = useState<'entire' | 'selection'>('entire')
  if (!mode) return null

  if (mode === 'toolbar') {
    return (
      <div className="absolute inset-x-0 bottom-20 z-[20000] flex justify-center" data-coach="shot-toolbar">
        <div ref={ref} tabIndex={-1} onKeyDown={(e) => e.key === 'Escape' && store.setShotMode(null)} className="flex items-center gap-1 rounded-xl border border-white/30 bg-gray-800/90 p-1.5 text-sm text-white shadow-2xl backdrop-blur" role="toolbar" aria-label="Screenshot">
          <button type="button" data-coach="shot-close" aria-label="Close" className="min-h-10 min-w-10 rounded-lg hover:bg-white/15" onClick={() => store.setShotMode(null)}>
            ✕
          </button>
          <span className="mx-1 h-6 w-px bg-white/30" />
          <button type="button" data-coach="shot-entire" aria-pressed={toolMode === 'entire'} className={`min-h-10 rounded-lg px-3 ${toolMode === 'entire' ? 'bg-white/25' : 'hover:bg-white/15'}`} onClick={() => setToolMode('entire')}>
            Capture Entire Screen
          </button>
          <button type="button" data-coach="shot-selection" aria-pressed={toolMode === 'selection'} className={`min-h-10 rounded-lg px-3 ${toolMode === 'selection' ? 'bg-white/25' : 'hover:bg-white/15'}`} onClick={() => setToolMode('selection')}>
            Capture Selected Portion
          </button>
          <button
            type="button"
            data-coach="shot-capture"
            className="min-h-10 rounded-lg bg-blue-500 px-4 font-medium"
            onClick={() => {
              if (toolMode === 'entire') store.captureMac()
              else store.setShotMode('crosshair')
            }}
          >
            Capture
          </button>
        </div>
      </div>
    )
  }

  const rel = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const box = drag && { left: Math.min(drag.x1, drag.x2), top: Math.min(drag.y1, drag.y2), width: Math.abs(drag.x2 - drag.x1), height: Math.abs(drag.y2 - drag.y1) }
  return (
    <div
      ref={ref}
      tabIndex={-1}
      data-coach="snip-overlay"
      role="application"
      aria-label={mac ? 'Drag to select an area of the screen. Press Escape to cancel.' : 'Snipping: drag to select an area. Press Escape to cancel.'}
      className="absolute inset-0 z-[20000] touch-none outline-none"
      style={{ cursor: 'crosshair', background: mac ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.35)' }}
      onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), store.setShotMode(null))}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId)
        const p = rel(e)
        setDrag({ x1: p.x, y1: p.y, x2: p.x, y2: p.y })
      }}
      onPointerMove={(e) => {
        if (!drag) return
        const p = rel(e)
        setDrag({ ...drag, x2: p.x, y2: p.y })
      }}
      onPointerUp={(e) => {
        if (!drag) return
        const p = rel(e)
        const g = { ...drag, x2: p.x, y2: p.y }
        setDrag(null)
        store.finishDrag(g.x1, g.y1, g.x2, g.y2)
      }}
    >
      {box && <div className="pointer-events-none absolute border-2 border-white bg-white/10" style={{ ...box, boxShadow: '0 0 0 1px rgba(0,0,0,.4)' }} />}
      {!mac && (
        <div className="absolute inset-x-0 top-3 flex justify-center" onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1 rounded-xl bg-white p-1 text-sm text-gray-900 shadow-xl" role="toolbar" aria-label="Snipping toolbar">
            <span className="rounded-lg bg-sky-100 px-3 py-2">▭ Rectangular snip</span>
            <button type="button" data-coach="snip-fullscreen" className="min-h-10 rounded-lg px-3 hover:bg-gray-100" onClick={() => (store.copyToClipboard(), d.toast('Screen copied to clipboard'))}>
              Fullscreen snip
            </button>
            <button type="button" data-coach="snip-cancel" aria-label="Close snipping" className="min-h-10 min-w-10 rounded-lg hover:bg-gray-100" onClick={() => store.setShotMode(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 text-center text-sm text-white [text-shadow:0_1px_3px_rgba(0,0,0,.9)]">Drag to select an area · Esc to cancel</div>
    </div>
  )
}

function SnipNotice({ d }: { d: DesktopApi }) {
  const { store, state } = useDevices(d)
  if (!state.snipNotice || !state.clip || d.os !== 'windows') return null
  return (
    <button
      type="button"
      data-coach="snip-notification"
      className="absolute right-3 bottom-14 z-[16500] w-72 rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-900 shadow-2xl"
      onClick={() => {
        store.dismissSnipNotice()
        d.openApp('snip')
      }}
    >
      <div className="font-semibold">Snip saved to clipboard</div>
      <div className="text-xs text-gray-600">Select here to mark up and share.</div>
    </button>
  )
}

function Portal({ children }: { children: ReactNode }) {
  const d = useDesktop()
  const [el, setEl] = useState<HTMLElement | null>(null)
  useEffect(() => setEl(d.rootRef.current), [d.rootRef])
  return el ? createPortal(children, el) : null
}

export function DevicesLayer({ showPanel = false }: { showPanel?: boolean }) {
  const d = useDesktop()
  useDevices(d)
  return (
    <>
      <Portal>
        {d.os === 'windows' ? <TrayIcons d={d} /> : <MacDriveIcons d={d} />}
        {d.os === 'mac' && <MacDockPrinter d={d} />}
        <SnipNotice d={d} />
        <ShotOverlay d={d} />
      </Portal>
      {showPanel && <HardwarePanel />}
    </>
  )
}
