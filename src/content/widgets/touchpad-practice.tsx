import { useEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { allDone, buttonZoom, gestureToZoom, isInside, scrollReached, tick, wheelToZoom, zoomReached, type Gesture } from './lib/touchpad'

const LABELS: Record<Gesture, string> = {
  tap: 'ট্যাপ (একবার ক্লিক)',
  doubleTap: 'ডাবল ট্যাপ (দুবার ক্লিক)',
  rightTap: 'দুই আঙুলে ট্যাপ (রাইট ক্লিক)',
  scroll: 'দুই আঙুলে ওপর-নিচ (স্ক্রল)',
  zoom: 'দুই আঙুল ফাঁক/কাছে (পিঞ্চ, জুম)',
  drag: 'ড্র্যাগ (ধরে টানা)',
}

function Card({ title, children, note }: { title: string; children: ReactNode; note: string }) {
  return (
    <section className="rounded-xl border p-3" style={{ borderColor: 'var(--c-line)', background: 'var(--c-canvas)' }}>
      <h4 className="mb-1 font-semibold">{title}</h4>
      <div>{children}</div>
      <p className="mt-2 text-sm" style={{ color: 'var(--c-muted)' }}>{note}</p>
    </section>
  )
}

export default function TouchpadPractice() {
  const [done, setDone] = useState<Gesture[]>([])
  const mark = (g: Gesture) => setDone((d) => tick(d, g))

  // --- right click
  const [menu, setMenu] = useState(false)
  // --- zoom
  const [zoom, setZoom] = useState(1)
  const zoomRef = useRef(1)
  const photoRef = useRef<HTMLDivElement>(null)
  const applyZoom = (z: number) => {
    zoomRef.current = z
    setZoom(z)
    if (zoomReached(z)) mark('zoom')
  }
  useEffect(() => {
    const el = photoRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return // plain two-finger scroll is not a pinch
      e.preventDefault()
      applyZoom(wheelToZoom(zoomRef.current, e.deltaY))
    }
    let start = 1
    const onStart = (e: Event) => {
      e.preventDefault()
      start = zoomRef.current
    }
    const onChange = (e: Event) => {
      e.preventDefault()
      applyZoom(gestureToZoom(start, (e as unknown as { scale: number }).scale))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('gesturestart', onStart)
    el.addEventListener('gesturechange', onChange)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('gesturestart', onStart)
      el.removeEventListener('gesturechange', onChange)
    }
  }, [])
  // --- drag
  const boxRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ x: number; y: number; active: boolean; dropped: boolean; sx: number; sy: number }>({ x: 0, y: 0, active: false, dropped: false, sx: 0, sy: 0 })
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag((d) => ({ ...d, active: true, dropped: false, sx: e.clientX - d.x, sy: e.clientY - d.y }))
  }
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!drag.active) return
    setDrag((d) => ({ ...d, x: e.clientX - d.sx, y: e.clientY - d.sy }))
  }
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    if (!drag.active) return
    const r = boxRef.current?.getBoundingClientRect()
    const inside = !!r && isInside(e.clientX, e.clientY, r)
    if (inside) mark('drag')
    setDrag((d) => (inside ? { ...d, active: false, dropped: true } : { x: 0, y: 0, active: false, dropped: false, sx: 0, sy: 0 }))
  }

  return (
    <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }} data-widget="touchpad-practice" onClick={() => menu && setMenu(false)}>
      <p className="font-semibold">টাচপ্যাড অনুশীলন — প্রতিটি কাজ করলেই তালিকায় টিক পড়বে</p>
      <p className="text-sm" style={{ color: 'var(--c-muted)' }}>মাউস থাকলেও সমস্যা নেই — ক্লিক, ডান ক্লিক আর চাকা ঘোরানো দিয়েও এগুলো করা যায়।</p>

      <ul data-testid="tp-checklist" className="grid gap-1 sm:grid-cols-2">
        {(Object.keys(LABELS) as Gesture[]).map((g) => (
          <li key={g} data-gesture={g} data-done={done.includes(g) ? 'yes' : 'no'} className="flex min-h-10 items-center gap-2 rounded-lg px-3" style={{ background: done.includes(g) ? 'var(--c-ok-soft)' : 'var(--c-sunken)' }}>
            <span aria-hidden>{done.includes(g) ? '✅' : '⬜'}</span>
            <span>{LABELS[g]}</span>
          </li>
        ))}
      </ul>
      {allDone(done) && (
        <p role="status" data-testid="tp-all-done" className="rounded-xl p-3 font-semibold" style={{ background: 'var(--c-ok-soft)' }}>
          অসাধারণ! টাচপ্যাডের সবগুলো কাজ করে ফেলেছেন।
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="১. ট্যাপ ও ডাবল ট্যাপ" note="টাচপ্যাডে এক আঙুলে হালকা টোকা = ক্লিক। পরপর দুবার = ডাবল ক্লিক। Windows: Settings → Bluetooth & devices → Touchpad। Mac: System Settings → Trackpad → “Tap to click” চালু না থাকলে চালু করুন; না হলে টাচপ্যাড চেপে ক্লিক করুন।">
          <button
            type="button"
            data-testid="tp-tap-box"
            onClick={() => mark('tap')}
            onDoubleClick={() => mark('doubleTap')}
            className="min-h-16 w-full rounded-xl border-2 px-4 font-semibold select-none"
            style={{ borderColor: 'var(--c-brand)', background: 'var(--c-brand-soft)' }}
          >
            এখানে একবার, তারপর দুবার ট্যাপ করুন
          </button>
        </Card>

        <Card title="২. দুই আঙুলে ট্যাপ = রাইট ক্লিক" note="টাচপ্যাডে একসাথে দুই আঙুলে একবার ট্যাপ করুন। মাউসে ডান বোতাম চাপুন। Mac-এ এটি কাজ না করলে System Settings → Trackpad → Secondary click দেখুন।">
          <div className="relative">
            <div
              data-testid="tp-right-box"
              onContextMenu={(e) => {
                e.preventDefault()
                setMenu(true)
                mark('rightTap')
              }}
              className="flex min-h-16 items-center justify-center rounded-xl border-2 border-dashed px-4 text-center select-none"
              style={{ borderColor: 'var(--c-accent)', background: 'var(--c-accent-soft)' }}
            >
              এই বাক্সের ওপর রাইট ক্লিক করুন
            </div>
            {menu && (
              <ul role="menu" className="absolute left-4 top-12 z-10 w-40 rounded-lg border p-1 shadow-lg" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
                {['Open', 'Rename', 'Delete'].map((t) => (
                  <li key={t} role="menuitem" className="rounded px-3 py-1">{t}</li>
                ))}
                <li className="px-3 py-1 text-xs" style={{ color: 'var(--c-muted)' }}>(অনুশীলনের মেনু)</li>
              </ul>
            )}
          </div>
        </Card>

        <Card title="৩. দুই আঙুলে স্ক্রল" note="টাচপ্যাডে দুই আঙুল একসাথে ওপর-নিচ টানুন। মাউসে চাকা ঘোরান। Mac-এ ডিফল্টে আঙুল যেদিকে সরে, পাতা সেদিকে যায়; Windows-এ সাধারণত উল্টো। দুটোই বদলানো যায়।">
          <div
            data-testid="tp-scroll-list"
            tabIndex={0}
            aria-label="লম্বা তালিকা"
            onScroll={(e) => scrollReached(e.currentTarget.scrollTop) && mark('scroll')}
            className="h-36 overflow-y-auto rounded-xl border"
            style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="border-b px-3 py-2" style={{ borderColor: 'var(--c-line)' }}>
                বাজারের তালিকা — {i + 1}
              </div>
            ))}
          </div>
        </Card>

        <Card title="৪. পিঞ্চ করে জুম" note="টাচপ্যাডে দুই আঙুল ফাঁক করলে জুম ইন, কাছে আনলে জুম আউট। মাউসে Ctrl চেপে চাকা ঘোরালেও হয় (Mac-এ Cmd)। নিচের + আর − বোতামেও একই কাজ হয়।">
          <div ref={photoRef} data-testid="tp-photo" className="h-36 touch-none overflow-hidden rounded-xl border" style={{ borderColor: 'var(--c-line)', background: '#bfe3f5' }}>
            <svg viewBox="0 0 200 140" className="h-full w-full" style={{ transform: `scale(${zoom})`, transition: 'transform 120ms' }} role="img" aria-label="অনুশীলনের ছবি: পাহাড় আর সূর্য">
              <rect width="200" height="140" fill="#bfe3f5" />
              <circle cx="150" cy="35" r="16" fill="#f6c453" />
              <path d="M0 120 L50 60 L90 105 L130 55 L200 120 Z" fill="#5b8a5a" />
              <rect y="115" width="200" height="25" fill="#3f6f4a" />
            </svg>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button type="button" data-testid="tp-zoom-out" aria-label="জুম আউট" onClick={() => applyZoom(buttonZoom(zoom, -1))} className="min-h-12 min-w-12 rounded-xl border text-xl" style={{ borderColor: 'var(--c-line)' }}>−</button>
            <span data-testid="tp-zoom-value" className="w-16 text-center">{Math.round(zoom * 100)}%</span>
            <button type="button" data-testid="tp-zoom-in" aria-label="জুম ইন" onClick={() => applyZoom(buttonZoom(zoom, 1))} className="min-h-12 min-w-12 rounded-xl border text-xl" style={{ borderColor: 'var(--c-line)' }}>+</button>
          </div>
        </Card>

        <Card title="৫. ড্র্যাগ (ধরে টানা)" note="টাচপ্যাডে এক আঙুলে চেপে ধরে (বা বোতাম চেপে রেখে) অন্য আঙুল দিয়ে সরান, তারপর ছেড়ে দিন। মাউসে বাঁ বোতাম চেপে ধরে নাড়ান।">
          <div className="flex items-center justify-between gap-3">
            <div
              data-testid="tp-drag-token"
              role="img"
              aria-label="টেনে নেওয়ার চাকতি"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              className="flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full text-2xl select-none"
              style={{ background: 'var(--c-brand)', color: 'var(--c-brand-ink)', transform: `translate(${drag.x}px, ${drag.y}px)`, position: 'relative', zIndex: 5 }}
            >
              ✋
            </div>
            <div ref={boxRef} data-testid="tp-drag-box" className="flex h-20 w-32 items-center justify-center rounded-xl border-2 border-dashed text-center text-sm" style={{ borderColor: drag.dropped ? 'var(--c-ok)' : 'var(--c-accent)', background: drag.dropped ? 'var(--c-ok-soft)' : 'var(--c-accent-soft)' }}>
              {drag.dropped ? 'ঠিক জায়গায়!' : 'এখানে ছাড়ুন'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
