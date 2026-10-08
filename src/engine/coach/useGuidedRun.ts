import { useCallback, useEffect, useRef, useState } from 'react'
import type { OsFlavor, Step } from '../types'
import type { SimBus } from '../../sim/bus'
import { advance, feed, initialRunner, pickPraise, type RunnerState } from '../runner'

export const HINT_MS = 10_000
export const DEMO_MS = 20_000
export const SUCCESS_MS = 1400

export interface GuidedRun {
  steps: Step[]
  step: Step | undefined
  index: number
  state: RunnerState
  phase: 'waiting' | 'success'
  praise: string
  /** 0 = nothing extra, 1 = gentle hint, 2 = "দেখিয়ে দিন" offered */
  level: 0 | 1 | 2
  simplerOpen: boolean
  toggleSimpler: () => void
  demoKey: number
  showDemo: () => void
  /** for `continue` steps */
  complete: () => void
  reset: () => void
}

interface Opts {
  steps: Step[]
  bus: SimBus
  os: OsFlavor
  enabled?: boolean
  onStepDone?: (step: Step) => void
  onFinished?: () => void
  hintMs?: number
  demoMs?: number
  successMs?: number
}

/** Drives a guided practice: listens to the simulator bus, advances only on the right action, runs the hint timers. */
export function useGuidedRun({ steps, bus, os, enabled = true, onStepDone, onFinished, hintMs = HINT_MS, demoMs = DEMO_MS, successMs = SUCCESS_MS }: Opts): GuidedRun {
  const [state, setState] = useState<RunnerState>(initialRunner)
  const [phase, setPhase] = useState<'waiting' | 'success'>('waiting')
  const [praise, setPraise] = useState('')
  const [level, setLevel] = useState<0 | 1 | 2>(0)
  const [simplerOpen, setSimplerOpen] = useState(false)
  const [demoKey, setDemoKey] = useState(0)
  const [activity, setActivity] = useState(0)
  const stateRef = useRef(state)
  stateRef.current = state
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const cb = useRef({ onStepDone, onFinished })
  cb.current = { onStepDone, onFinished }
  const lastPraise = useRef<string | undefined>(undefined)
  const counter = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const succeed = useCallback(
    (step: Step) => {
      setPhase('success')
      const p = pickPraise(counter.current++ * 7 + step.id.length, lastPraise.current)
      lastPraise.current = p
      setPraise(step.successMessageBn ?? p)
      cb.current.onStepDone?.(step)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        const next = advance(stateRef.current, steps)
        setState(next)
        setPhase('waiting')
        setLevel(0)
        setSimplerOpen(false)
        if (next.finished) cb.current.onFinished?.()
      }, successMs)
    },
    [steps, successMs],
  )

  useEffect(() => {
    if (!enabled) return
    return bus.subscribe((ev) => {
      const st = stateRef.current
      if (phaseRef.current !== 'waiting') {
        // she was quick: the "well done" pause is still showing, but she already did the NEXT step
        const nextState = advance(st, steps)
        if (!nextState.finished && feed(nextState, steps, ev, os).matched) {
          window.clearTimeout(timer.current)
          stateRef.current = nextState
          setState(nextState)
          phaseRef.current = 'waiting'
          succeed(steps[nextState.index])
        }
        return
      }
      setActivity((a) => a + 1)
      if (feed(st, steps, ev, os).matched) succeed(steps[st.index])
    })
  }, [bus, steps, os, enabled, succeed])

  // inactivity timers: reset on every step change and every learner action
  useEffect(() => {
    if (!enabled || state.finished || phase !== 'waiting') return
    setLevel(0)
    const t1 = window.setTimeout(() => setLevel(1), hintMs)
    const t2 = window.setTimeout(() => setLevel(2), demoMs)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [state.index, state.finished, phase, activity, enabled, hintMs, demoMs])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const complete = useCallback(() => {
    const st = stateRef.current
    if (phaseRef.current === 'waiting' && steps[st.index]) succeed(steps[st.index])
  }, [steps, succeed])

  const reset = useCallback(() => {
    window.clearTimeout(timer.current)
    setState(initialRunner())
    setPhase('waiting')
    setLevel(0)
    setSimplerOpen(false)
    setActivity(0)
  }, [])

  return {
    steps,
    step: steps[state.index],
    index: state.index,
    state,
    phase,
    praise,
    level,
    simplerOpen,
    toggleSimpler: () => setSimplerOpen((s) => !s),
    demoKey,
    showDemo: () => setDemoKey((k) => k + 1),
    complete,
    reset,
  }
}
