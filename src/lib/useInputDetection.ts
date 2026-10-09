import { useEffect } from 'react'
import { store } from '../state/store'
import { detectInputCapabilities, initialInput, InputDetector } from './device'

/** Learner's manual choice in Settings: automatic detection must stop touching `profile.input`. */
export const INPUT_MANUAL_KEY = 'inputManual'

/**
 * Mount once (Layout). Sets a conservative starting guess, then refines mouse vs touchpad from real wheel / touch events.
 * Never asks the learner anything and never overrides a manual choice.
 */
export function useInputDetection() {
  useEffect(() => {
    const manual = () => store.getSnapshot().extras[INPUT_MANUAL_KEY] === true
    const apply = (kind: 'mouse' | 'touchpad') => {
      const d = store.getSnapshot()
      if (manual() || d.profile.input === kind) return
      store.setProfile({ input: kind })
    }
    const caps = detectInputCapabilities()
    // starting guess only before the learner has been "detected" once (onboarding stores autoDetected: true)
    if (!store.getSnapshot().profile.autoDetected) apply(initialInput(caps))

    const det = new InputDetector()
    const handle = (e: Event) => {
      if (manual()) return
      const t = e.timeStamp
      let v
      if (e.type === 'wheel') {
        const w = e as WheelEvent
        v = det.feed({ type: 'wheel', deltaX: w.deltaX, deltaY: w.deltaY, deltaMode: w.deltaMode, ctrlKey: w.ctrlKey, t })
      } else {
        v = det.feed({ type: 'pointer', pointerType: (e as PointerEvent).pointerType, t })
      }
      if (v.kind) {
        apply(v.kind)
        det.reset()
      }
    }
    const opts = { passive: true } as const
    window.addEventListener('wheel', handle, opts)
    window.addEventListener('pointerdown', handle, opts)
    return () => {
      window.removeEventListener('wheel', handle)
      window.removeEventListener('pointerdown', handle)
    }
  }, [])
}
