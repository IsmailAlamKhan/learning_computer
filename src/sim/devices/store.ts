/**
 * Pretend hardware + system services for one simulated desktop: USB stick, phone, printer queue, screenshots/clipboard image.
 * One store per VirtualFileSystem (= per desktop), created lazily with `getDevices(desktopApi)`.
 * UI reads it with `useDevices(d)`; apps and system shortcuts call its methods.
 */
import { useSyncExternalStore } from 'react'
import type { DesktopApi } from '../DesktopContext'
import type { VirtualFileSystem, VNode, SeedFolder, SeedFile } from '../vfs'
import { encodeShot, rectFromDrag, screenshotName, type ShotData, type ShotKind, type ShotRect } from './screenshots'

export const DEFAULT_PRINTER = 'Practice Printer'

export type PrintStatus = 'queued' | 'printing' | 'done' | 'cancelled'
export interface PrintJob {
  id: number
  doc: string
  printer: string
  copies: number
  pages: number
  status: PrintStatus
  /** 0..100 */
  progress: number
  /** timestamp when the job ended (done/cancelled), used to drop it from the list a moment later */
  endedAt?: number
}

export type ShotMode = null | 'snip' | 'crosshair' | 'toolbar'
export type UsbState = 'out' | 'in'
export type PhoneState = 'out' | 'prompt' | 'in'
export type HwNotice = null | 'usb-in' | 'usb-ejected' | 'usb-pulled-safe' | 'usb-pulled-unsafe' | 'phone-prompt' | 'phone-in' | 'phone-out'

export interface DevicesState {
  usb: UsbState
  usbMounted: boolean
  phone: PhoneState
  jobs: PrintJob[]
  shotMode: ShotMode
  /** the image currently "on the clipboard" (PrtScn / Win+Shift+S) */
  clip: ShotData | null
  /** the little "Snip saved to clipboard" notification is showing */
  snipNotice: boolean
  notice: HwNotice
}

/** seconds one printed sheet takes — slow on purpose so a learner has time to open the queue and cancel */
export const SECONDS_PER_SHEET = 20
export const MIN_JOB_SECONDS = 30
const TICK_MS = 500
const GONE_AFTER_MS = 3000

type Ctx = Pick<DesktopApi, 'os' | 'vfs' | 'emit' | 'toast' | 'sim' | 'wm'>

const USB_SEED: { folders: SeedFolder[]; files: SeedFile[] } = {
  folders: [{ name: 'Photos', files: [{ name: 'Family Trip.jpg', media: 'image' }, { name: 'Garden.png', media: 'image' }] }],
  files: [
    { name: 'Project Notes.txt', content: 'Notes for my project.\nThis file lives on the USB drive.' },
    { name: 'Report.pdf', media: 'pdf' },
  ],
}
const PHONE_SEED: { folders: SeedFolder[] } = {
  folders: [
    {
      name: 'Internal storage',
      folders: [
        { name: 'DCIM', folders: [{ name: 'Camera', files: ['IMG_0001.jpg', 'IMG_0002.jpg', 'IMG_0003.jpg'].map((name) => ({ name, media: 'image' as const })) }] },
        { name: 'Download', files: [{ name: 'Receipt.pdf', media: 'pdf' }] },
      ],
    },
  ],
}

export class DevicesStore {
  state: DevicesState = { usb: 'out', usbMounted: false, phone: 'out', jobs: [], shotMode: null, clip: null, snipNotice: false, notice: null }
  private ctx: Ctx
  private listeners = new Set<() => void>()
  private version = 0
  private usbNode: VNode | null = null
  private phoneNode: VNode | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private nextJob = 1

  constructor(ctx: Ctx) {
    this.ctx = ctx
  }
  bind(ctx: Ctx) {
    this.ctx = ctx
  }
  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => void this.listeners.delete(fn)
  }
  getVersion = () => this.version
  private set(patch: Partial<DevicesState>) {
    this.state = { ...this.state, ...patch }
    this.version++
    this.listeners.forEach((l) => l())
  }
  private custom(event: string) {
    this.ctx.emit({ type: 'custom', event })
  }
  private get vfs(): VirtualFileSystem {
    return this.ctx.vfs
  }

  // ---------- USB stick ----------
  usbName() {
    return this.ctx.os === 'windows' ? 'USB DRIVE (D:)' : 'USB DRIVE'
  }
  insertUsb() {
    if (this.state.usb === 'in') return
    this.usbNode = this.usbNode ? this.vfs.remount(this.usbNode) : this.vfs.mount(this.usbName(), USB_SEED, { kind: 'usb', letter: 'D' })
    this.set({ usb: 'in', usbMounted: true, notice: 'usb-in' })
    this.custom('usb-inserted')
  }
  /** "Safely Remove Hardware" (Windows) / Eject (Mac): the drive disappears from the file manager but the stick is still plugged in. */
  ejectUsb() {
    if (!this.usbNode || !this.state.usbMounted) return
    this.vfs.unmount(this.usbNode)
    this.set({ usbMounted: false, notice: 'usb-ejected' })
    if (this.ctx.os === 'windows') this.ctx.toast('Safe to Remove Hardware — you can now remove USB DRIVE (D:)')
    this.custom('usb-ejected')
  }
  /** physically pull the stick out */
  pullUsb() {
    if (this.state.usb !== 'in') return
    const unsafe = this.state.usbMounted
    if (unsafe && this.usbNode) this.vfs.unmount(this.usbNode)
    this.set({ usb: 'out', usbMounted: false, notice: unsafe ? 'usb-pulled-unsafe' : 'usb-pulled-safe' })
    this.custom(unsafe ? 'usb-removed-unsafe' : 'usb-removed')
  }

  // ---------- phone ----------
  connectPhone() {
    if (this.state.phone !== 'out') return
    this.set({ phone: 'prompt', notice: 'phone-prompt' })
    this.custom('phone-connected')
  }
  /** the learner taps "Allow / File transfer" on the phone's screen */
  allowPhone() {
    if (this.state.phone !== 'prompt') return
    this.phoneNode = this.phoneNode ? this.vfs.remount(this.phoneNode) : this.vfs.mount('Phone', PHONE_SEED, { kind: 'phone', letter: 'E' })
    this.set({ phone: 'in', notice: 'phone-in' })
    this.custom('phone-allowed')
  }
  disconnectPhone() {
    if (this.state.phone === 'out') return
    if (this.phoneNode) this.vfs.unmount(this.phoneNode)
    this.set({ phone: 'out', notice: 'phone-out' })
  }

  // ---------- printing ----------
  printers(): string[] {
    const list = (this.ctx.sim as { printers?: string[] }).printers
    return list && list.length ? list : [DEFAULT_PRINTER]
  }
  addJob(doc: string, printer: string, copies: number, pages: number): PrintJob {
    const job: PrintJob = { id: this.nextJob++, doc, printer, copies: Math.max(1, copies), pages: Math.max(1, pages), status: 'queued', progress: 0 }
    const jobs = [...this.state.jobs, job]
    this.set({ jobs: this.promote(jobs) })
    this.custom('print-started')
    this.ensureTimer()
    return job
  }
  cancelJob(id: number) {
    const j = this.state.jobs.find((x) => x.id === id)
    if (!j || j.status === 'done' || j.status === 'cancelled') return
    const jobs = this.state.jobs.map((x) => (x.id === id ? { ...x, status: 'cancelled' as const, endedAt: Date.now() } : x))
    this.set({ jobs: this.promote(jobs) })
    this.custom('print-cancelled')
    this.ensureTimer()
  }
  activeJobs() {
    return this.state.jobs.filter((j) => j.status === 'queued' || j.status === 'printing')
  }
  /** the first waiting job starts printing when nothing else is */
  private promote(jobs: PrintJob[]): PrintJob[] {
    if (jobs.some((j) => j.status === 'printing')) return jobs
    const i = jobs.findIndex((j) => j.status === 'queued')
    return i < 0 ? jobs : jobs.map((j, k) => (k === i ? { ...j, status: 'printing' as const } : j))
  }
  private ensureTimer() {
    if (this.timer) return
    this.timer = setInterval(() => this.tick(), TICK_MS)
  }
  tick(now = Date.now()) {
    let jobs = this.state.jobs
    let finished = 0
    jobs = jobs.map((j) => {
      if (j.status !== 'printing') return j
      const secs = Math.max(MIN_JOB_SECONDS, j.pages * j.copies * SECONDS_PER_SHEET)
      const progress = Math.min(100, j.progress + (100 * TICK_MS) / 1000 / secs)
      if (progress >= 100) {
        finished++
        return { ...j, progress: 100, status: 'done' as const, endedAt: now }
      }
      return { ...j, progress }
    })
    jobs = jobs.filter((j) => !(j.endedAt && now - j.endedAt > GONE_AFTER_MS))
    jobs = this.promote(jobs)
    this.set({ jobs })
    for (let i = 0; i < finished; i++) this.custom('print-done')
    if (!jobs.length && this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  dispose() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }

  // ---------- screenshots ----------
  setShotMode(m: ShotMode) {
    this.set({ shotMode: m })
  }
  private snapshot(area?: ShotRect): ShotData {
    const { wm, os } = this.ctx
    return {
      os,
      w: wm.bounds.w,
      h: wm.bounds.h,
      area,
      at: Date.now(),
      wins: wm.windows.filter((w) => !w.minimized).map((w) => ({ title: w.title, x: w.x, y: w.y, w: w.w, h: w.h })),
    }
  }
  /** Windows: PrtScn / Win+Shift+S → the picture goes to the clipboard only. */
  copyToClipboard(area?: ShotRect) {
    this.set({ clip: this.snapshot(area), shotMode: null, snipNotice: !!area })
    this.custom('screenshot-taken')
  }
  /** Where a screenshot file is saved: Pictures\Screenshots (Win+PrtScn), Pictures (Snipping Tool save) or Desktop (Mac). */
  private shotFolder(kind: ShotKind): VNode {
    const { vfs, os } = this.ctx
    if (os === 'mac') return vfs.child(vfs.home, 'Desktop') ?? vfs.home
    const pics = vfs.child(vfs.home, 'Pictures') ?? vfs.home
    if (kind === 'win-prtscn-file') return vfs.child(pics, 'Screenshots') ?? vfs.mkdir(pics, 'Screenshots')
    return pics
  }
  /** Save a screenshot file. `data` = what was captured (whole screen when it has no area). */
  saveShot(kind: ShotKind, data: ShotData = this.snapshot()): VNode {
    const folder = this.shotFolder(kind)
    const name = screenshotName(this.ctx.os, kind, new Date(), folder.children.map((c) => c.name))
    const node = this.vfs.saveAs(folder, name, encodeShot(data))
    this.set({ shotMode: null })
    this.custom('screenshot-taken')
    this.custom('screenshot-saved')
    this.ctx.toast(this.ctx.os === 'mac' ? `Screenshot saved to Desktop: ${name}` : kind === 'win-prtscn-file' ? `Screenshot saved in Pictures\\Screenshots: ${name}` : `Saved ${name} in Pictures`)
    return node
  }
  /** Mac: whole screen / dragged area straight to a file on the Desktop. */
  captureMac(area?: ShotRect) {
    this.saveShot('mac', this.snapshot(area))
  }
  /** a rectangle was dragged on the overlay */
  finishDrag(x1: number, y1: number, x2: number, y2: number): boolean {
    const r = rectFromDrag(x1, y1, x2, y2, this.ctx.wm.bounds)
    if (!r) return false
    if (this.ctx.os === 'mac') this.captureMac(r)
    else {
      this.copyToClipboard(r)
      this.ctx.toast('Snip saved to clipboard')
    }
    return true
  }
  dismissSnipNotice() {
    this.set({ snipNotice: false })
  }
}

const stores = new WeakMap<VirtualFileSystem, DevicesStore>()

export function getDevices(d: Ctx): DevicesStore {
  let s = stores.get(d.vfs)
  if (!s) {
    s = new DevicesStore(d)
    stores.set(d.vfs, s)
  } else s.bind(d)
  return s
}

/** Subscribe a component to the devices store of this desktop. */
export function useDevices(d: Ctx): { store: DevicesStore; state: DevicesState } {
  const store = getDevices(d)
  useSyncExternalStore(store.subscribe, store.getVersion)
  return { store, state: store.state }
}
