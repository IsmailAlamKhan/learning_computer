import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SimBus } from '../../sim/bus'
import type { Step } from '../types'
import { useGuidedRun } from './useGuidedRun'

const mk = (id: string, target: string): Step => ({ id, titleBn: id, explanationBn: 'x', hintBn: 'h', expectedAction: { type: 'click', target }, osVariant: 'both' })
const steps = [mk('a', 'x'), mk('b', 'y')]

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useGuidedRun', () => {
  it('advances only after the correct action and shows success first', () => {
    const bus = new SimBus()
    const done: string[] = []
    const { result } = renderHook(() => useGuidedRun({ steps, bus, os: 'windows', onStepDone: (s) => done.push(s.id) }))
    act(() => bus.emit({ type: 'click', target: 'wrong' }))
    expect(result.current.index).toBe(0)
    act(() => bus.emit({ type: 'click', target: 'x' }))
    expect(result.current.phase).toBe('success')
    expect(result.current.index).toBe(0)
    act(() => void vi.advanceTimersByTime(1500))
    expect(result.current.index).toBe(1)
    expect(result.current.phase).toBe('waiting')
    expect(done).toEqual(['a'])
  })

  it('credits a quick learner who does the next step during the success pause', () => {
    const bus = new SimBus()
    const { result } = renderHook(() => useGuidedRun({ steps, bus, os: 'windows' }))
    act(() => bus.emit({ type: 'click', target: 'x' }))
    expect(result.current.phase).toBe('success')
    act(() => bus.emit({ type: 'click', target: 'y' }))
    act(() => void vi.advanceTimersByTime(1500))
    expect(result.current.state.finished).toBe(true)
  })

  it('finishes after the last step', () => {
    const bus = new SimBus()
    const onFinished = vi.fn()
    const { result } = renderHook(() => useGuidedRun({ steps, bus, os: 'mac', onFinished }))
    act(() => bus.emit({ type: 'click', target: 'x' }))
    act(() => void vi.advanceTimersByTime(1500))
    act(() => bus.emit({ type: 'click', target: 'y' }))
    act(() => void vi.advanceTimersByTime(1500))
    expect(result.current.state.finished).toBe(true)
    expect(onFinished).toHaveBeenCalledOnce()
  })

  it('shows a hint after ~10s and the demo offer after ~20s of inactivity; activity resets', () => {
    const bus = new SimBus()
    const { result } = renderHook(() => useGuidedRun({ steps, bus, os: 'windows' }))
    expect(result.current.level).toBe(0)
    act(() => void vi.advanceTimersByTime(10_100))
    expect(result.current.level).toBe(1)
    act(() => void vi.advanceTimersByTime(10_000))
    expect(result.current.level).toBe(2)
    act(() => bus.emit({ type: 'click', target: 'nope' }))
    expect(result.current.level).toBe(0)
    act(() => void vi.advanceTimersByTime(9_000))
    expect(result.current.level).toBe(0)
  })

  it('complete() finishes continue-style steps and reset() restarts', () => {
    const bus = new SimBus()
    const { result } = renderHook(() => useGuidedRun({ steps, bus, os: 'windows' }))
    act(() => result.current.complete())
    act(() => void vi.advanceTimersByTime(1500))
    expect(result.current.index).toBe(1)
    act(() => result.current.reset())
    expect(result.current.index).toBe(0)
  })

  it('demo and simpler toggles', () => {
    const bus = new SimBus()
    const { result } = renderHook(() => useGuidedRun({ steps, bus, os: 'windows' }))
    act(() => result.current.showDemo())
    expect(result.current.demoKey).toBe(1)
    act(() => result.current.toggleSimpler())
    expect(result.current.simplerOpen).toBe(true)
  })
})
