/**
 * Everything the learner does in a simulation is reported as a SimEvent on a SimBus.
 * The lesson engine listens to the bus and compares events with each step's `expectedAction`.
 * Paths in events are CANONICAL: `~/Documents/x` (home-relative) or `/C:/Windows/...` (elsewhere).
 */
export type SimEvent =
  | { type: 'click' | 'doubleClick' | 'rightClick'; target: string }
  | { type: 'drag'; target: string; dropTarget: string }
  | { type: 'type'; target: string; value: string }
  | { type: 'keyCombo'; keys: string }
  | { type: 'openApp' | 'closeApp'; app: string }
  | { type: 'createFolder' | 'createFile' | 'delete' | 'restore' | 'saveFile'; name: string; path: string }
  | { type: 'rename'; from: string; to: string; path: string }
  | { type: 'move'; name: string; fromPath: string; toPath: string }
  | { type: 'copy'; name: string; fromPath: string; toPath: string }
  | { type: 'navigate'; path: string }
  | { type: 'selectOption'; target: string; value: string }
  | { type: 'custom'; event: string }

export type SimEventType = SimEvent['type']
export type SimListener = (e: SimEvent) => void

export class SimBus {
  private listeners = new Set<SimListener>()
  /** Last N events, handy for tests and the teacher/debug views. */
  readonly log: SimEvent[] = []

  emit = (e: SimEvent) => {
    this.log.push(e)
    if (this.log.length > 200) this.log.shift()
    this.listeners.forEach((l) => l(e))
  }

  subscribe = (l: SimListener) => {
    this.listeners.add(l)
    return () => {
      this.listeners.delete(l)
    }
  }
}
