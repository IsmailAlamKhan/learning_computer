import { useEffect, useState, type ReactNode } from 'react'
import { useDesktop } from '../DesktopContext'
import { getApp } from '../apps/registry'
import { dropZoneProps } from '../dnd'
import { errorMessageEn, type VNode } from '../vfs'
import { RecycleBinIcon, LaunchpadIcon } from '../ui/icons'
import { Tooltip } from '../ui/Tooltip'

const PINNED = ['files', 'launchpad', 'browser', 'editor', 'settings', 'terminal', 'mail']

const BN: Record<string, string> = {
  files: 'ফাইল-ফোল্ডার দেখার প্রোগ্রাম',
  launchpad: 'সব অ্যাপ এক জায়গায়',
  browser: 'ইন্টারনেট ঘোরার প্রোগ্রাম',
  editor: 'লেখালেখির সহজ প্রোগ্রাম',
  settings: 'কম্পিউটারের সেটিংস বদলানোর জায়গা',
  terminal: 'কমান্ড লিখে কম্পিউটারকে নির্দেশ দেওয়ার জায়গা',
  mail: 'ইমেইল পড়া ও পাঠানোর প্রোগ্রাম',
  photos: 'ছবি দেখার প্রোগ্রাম',
  trash: 'ফেলে দেওয়া ফাইল এখানে জমা থাকে',
}

function findNode(n: VNode, id: string): VNode | null {
  if (n.id === id) return n
  for (const c of n.children) {
    const r = findNode(c, id)
    if (r) return r
  }
  return null
}

const reducedMotion = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Entry {
  key: string
  appId: string
  label: string
  bn?: string
  icon: ReactNode
  running: boolean
  onClick: () => void
}

export function MacDock() {
  const d = useDesktop()
  const [hover, setHover] = useState<number | null>(null)
  const [reduced, setReduced] = useState(reducedMotion)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setReduced(mq.matches)
    mq.addEventListener?.('change', f)
    return () => mq.removeEventListener?.('change', f)
  }, [])

  const running = (appId: string) => d.wm.windows.some((w) => w.app === appId)
  const activate = (appId: string) => {
    d.setUi({ openMenu: null, launchpadOpen: false, spotlightOpen: false })
    const wins = d.wm.windows.filter((w) => w.app === appId)
    if (!wins.length) return d.openApp(appId)
    const target = d.wm.order.map((id) => wins.find((w) => w.id === id)).find(Boolean) ?? wins[0]
    d.wmDispatch({ type: 'focus', id: target.id })
  }

  const entries: Entry[] = []
  for (const id of PINNED) {
    if (id === 'launchpad') {
      entries.push({ key: id, appId: id, label: 'Launchpad', bn: BN.launchpad, icon: <LaunchpadIcon size={48} />, running: false, onClick: () => d.setUi({ launchpadOpen: !d.ui.launchpadOpen, spotlightOpen: false, openMenu: null }) })
      continue
    }
    const app = getApp(id)
    if (!app) continue
    entries.push({ key: id, appId: id, label: app.title('mac'), bn: BN[id] ?? app.descriptionBn, icon: app.icon({ size: 48 }), running: running(id), onClick: () => activate(id) })
  }
  const extra = [...new Set(d.wm.windows.map((w) => w.app))].filter((a) => !PINNED.includes(a) && a !== 'bin')
  for (const id of extra) {
    const app = getApp(id)
    if (app) entries.push({ key: id, appId: id, label: app.title('mac'), bn: BN[id] ?? app.descriptionBn, icon: app.icon({ size: 48 }), running: true, onClick: () => activate(id) })
  }

  const binFull = d.vfs.binItems().length > 0
  const trashIndex = entries.length
  const scaleFor = (i: number) => {
    if (hover === null || reduced) return 1
    const dist = Math.abs(i - hover)
    return dist === 0 ? 1.5 : dist === 1 ? 1.25 : dist === 2 ? 1.08 : 1
  }
  const itemStyle = (i: number) => ({ transform: `scale(${scaleFor(i)})`, transformOrigin: 'bottom center', transition: reduced ? 'none' : 'transform 120ms ease-out' })
  const btn = 'sim-dock-btn flex h-14 w-14 items-center justify-center rounded-xl focus-visible:outline-2'

  const trashDrop = dropZoneProps(
    (p) => {
      const pl = p as { kind: string; id: string }
      const src = pl.kind === 'node' ? findNode(d.vfs.root, pl.id) : null
      if (!src) return
      try {
        d.vfs.delete(src)
      } catch (e) {
        d.toast(errorMessageEn(e, d.os))
      }
    },
    (p) => (p as { kind?: string })?.kind === 'node',
  )

  return (
    <div className="pointer-events-none absolute right-0 bottom-2 left-0 z-[1000] flex justify-center">
      <div
        data-coach="dock"
        role="toolbar"
        aria-label="Dock"
        className="sim-dock pointer-events-auto flex items-end gap-1.5 rounded-2xl border border-white/40 bg-white/35 px-2.5 pt-2 pb-1.5 shadow-xl backdrop-blur-xl"
        onMouseLeave={() => setHover(null)}
      >
        {entries.map((e, i) => (
          <div key={e.key} className="relative flex flex-col items-center" onMouseEnter={() => setHover(i)} style={itemStyle(i)}>
            <Tooltip text={e.label} bn={e.bn}>
              <button type="button" data-coach={`dock-${e.appId}`} aria-label={e.label} className={btn} onClick={e.onClick}>
                {e.icon}
              </button>
            </Tooltip>
            <span className={`mt-0.5 h-1 w-1 rounded-full ${e.running ? 'bg-gray-800' : 'bg-transparent'}`} data-running={e.running ? 'true' : 'false'} />
          </div>
        ))}
        <div className="sim-dock-sep mx-1 h-12 w-px self-center bg-black/25" role="separator" />
        <div className="relative flex flex-col items-center" onMouseEnter={() => setHover(trashIndex)} style={itemStyle(trashIndex)}>
          <Tooltip text="Trash" bn={BN.trash}>
            <button type="button" aria-label="Trash" data-coach="dock-trash" data-full={binFull ? 'true' : 'false'} className={btn} onClick={() => d.openApp('bin')} {...trashDrop}>
              <RecycleBinIcon size={48} full={binFull} />
            </button>
          </Tooltip>
          <span className={`mt-0.5 h-1 w-1 rounded-full ${running('bin') ? 'bg-gray-800' : 'bg-transparent'}`} />
        </div>
      </div>
    </div>
  )
}
