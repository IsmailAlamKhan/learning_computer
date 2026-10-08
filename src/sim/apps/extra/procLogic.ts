/** Pure helpers behind Task Manager (Windows) and Force Quit Applications (Mac). Fake numbers, real idea. */
export interface ProcWindow {
  id: string
  app: string
  title: string
}
export interface ProcRow {
  /** coach id suffix: the app id (first window), or `app#n` style window id for extra windows */
  key: string
  winId: string
  app: string
  name: string
  notResponding: boolean
  cpu: string
  memory: string
}

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

/** Deterministic fake CPU/memory so the table looks alive but never changes between renders. */
export function fakeUsage(key: string, notResponding: boolean): { cpu: string; memory: string } {
  const h = hash(key)
  const cpu = notResponding ? 24.8 : ((h % 30) + 1) / 10
  const mem = 40 + (h % 260) + (notResponding ? 180 : 0)
  return { cpu: `${cpu.toFixed(1)}%`, memory: `${mem.toFixed(1)} MB` }
}

/** One row per open window. Windows of the same app after the first use the window id as the key. */
export function buildRows(windows: ProcWindow[], frozenIds: ReadonlySet<string>, nameOf: (app: string) => string): ProcRow[] {
  const seen = new Set<string>()
  return windows.map((w) => {
    const key = seen.has(w.app) ? w.id : w.app
    seen.add(w.app)
    const notResponding = frozenIds.has(w.id)
    return { key, winId: w.id, app: w.app, name: nameOf(w.app), notResponding, ...fakeUsage(w.id, notResponding) }
  })
}

export const BACKGROUND_PROCESSES = [
  { name: 'System', cpu: '0.3%', memory: '0.1 MB' },
  { name: 'Windows Audio Service', cpu: '0.0%', memory: '8.4 MB' },
  { name: 'Antimalware Service', cpu: '0.6%', memory: '96.2 MB' },
  { name: 'Print Spooler', cpu: '0.0%', memory: '5.7 MB' },
]
