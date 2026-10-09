/**
 * Automatic detection of the learner's computer (OS) and pointing device (mouse vs touchpad), so the app never has to ask.
 * Everything here is pure / injectable so it can be unit-tested with synthetic events.
 */
import type { InputKind, OsFlavor } from '../engine/types'

interface NavLike {
  userAgentData?: { platform?: string; mobile?: boolean }
  platform?: string
  userAgent?: string
  maxTouchPoints?: number
}

/** Which of the two simulated desktops matches the real computer. `null` = unknown (phone, Linux, ChromeOS ...): ask. */
export function detectOs(nav: NavLike = typeof navigator === 'undefined' ? {} : (navigator as NavLike)): OsFlavor | null {
  const ua = nav.userAgent ?? ''
  const mobile = nav.userAgentData?.mobile === true || /Android|iPhone|iPod|Mobile/i.test(ua)
  const sources = [nav.userAgentData?.platform, nav.platform, ua].filter((s): s is string => !!s)
  for (const s of sources) {
    if (/^win/i.test(s) || /Windows/i.test(s)) return mobile ? null : 'windows'
    if (/CrOS|Android|Linux|X11/i.test(s) && !/Mac|Win/i.test(s)) return null
    if (/^mac/i.test(s) || /Macintosh|Mac OS X/i.test(s)) {
      // iPadOS reports "MacIntel" with touch points; a real Mac has none
      if (/iPad|iPhone/i.test(ua) || (/^MacIntel$/.test(nav.platform ?? '') && (nav.maxTouchPoints ?? 0) > 1) || mobile) return null
      return 'mac'
    }
    if (/iPhone|iPad|iPod|Android/i.test(s)) return null
  }
  return null
}

export const OS_LABEL: Record<OsFlavor, string> = { windows: 'Windows', mac: 'Mac' }

export interface InputCapabilities {
  finePointer: boolean
  hover: boolean
  coarsePointer: boolean
  maxTouchPoints: number
  /** no mouse-like pointer at all */
  touchOnly: boolean
}

type MatchMedia = (q: string) => { matches: boolean }

export function detectInputCapabilities(
  mm: MatchMedia | undefined = typeof window !== 'undefined' ? window.matchMedia?.bind(window) : undefined,
  maxTouchPoints: number = typeof navigator !== 'undefined' ? navigator.maxTouchPoints ?? 0 : 0,
): InputCapabilities {
  const q = (s: string) => {
    try {
      return !!mm?.(s).matches
    } catch {
      return false
    }
  }
  const finePointer = q('(pointer: fine)') || q('(any-pointer: fine)')
  const hover = q('(hover: hover)') || q('(any-hover: hover)')
  const coarsePointer = q('(any-pointer: coarse)')
  // with no media-query support at all assume a desktop mouse (the conservative default)
  const known = !!mm
  const touchOnly = known && !finePointer && !hover && (coarsePointer || maxTouchPoints > 0)
  return { finePointer, hover, coarsePointer, maxTouchPoints, touchOnly }
}

/** Starting guess before any real event: touch-only devices behave like a touchpad; otherwise a mouse (wrongly showing touchpad steps to a mouse user is the worse mistake). */
export function initialInput(caps: InputCapabilities): InputKind {
  return caps.touchOnly ? 'touchpad' : 'mouse'
}

// ------------------------------------------------------------------------------------------------
// Mouse vs touchpad from real events
// ------------------------------------------------------------------------------------------------

export type DetectEvent =
  | { type: 'wheel'; deltaX: number; deltaY: number; deltaMode: number; ctrlKey: boolean; t: number }
  | { type: 'pointer'; pointerType: string; t: number }

export interface Verdict {
  kind: InputKind | null
  /** touchpad evidence minus mouse evidence (positive favours touchpad) */
  net: number
}

/** A physical wheel notch: whole-number delta that is a multiple of a typical step (100, 120, 150, 53 ...). */
export function isNotch(d: number): boolean {
  const a = Math.abs(d)
  if (!Number.isInteger(a) || a < 40) return false
  return a % 100 === 0 || a % 120 === 0 || a % 53 === 0 || a % 150 === 0 || a % 40 === 0
}

export const DEFAULT_THRESHOLD = 6

/**
 * Keeps a running score. A physical mouse wheel produces sparse, identical, notch-sized steps (or line/page delta modes);
 * a touchpad produces dense bursts of small, varying, often fractional deltas, horizontal components and pinch (ctrl+wheel).
 * A touch screen (pointerType 'touch') counts as "no mouse".
 */
export class InputDetector {
  private touchpad = 0
  private mouse = 0
  private lastWheelT = -Infinity
  private burst: number[] = []
  private burstCounted = false

  private threshold: number
  constructor(threshold = DEFAULT_THRESHOLD) {
    this.threshold = threshold
  }

  feed(e: DetectEvent): Verdict {
    if (e.type === 'pointer') {
      if (e.pointerType === 'touch') this.touchpad += 5
      return this.verdict()
    }
    if (e.ctrlKey) {
      // pinch-to-zoom on a touchpad arrives as small fractional ctrl+wheel; a mouse + Ctrl is a whole notch
      if (!isNotch(e.deltaY)) this.touchpad += 4
      return this.verdict()
    }
    const dy = e.deltaY
    const dx = e.deltaX
    if (e.deltaMode >= 1) {
      this.mouse += 2
      this.resetBurst()
      this.lastWheelT = e.t
      return this.verdict()
    }
    // new burst after a pause
    if (e.t - this.lastWheelT > 80) this.resetBurst()
    this.lastWheelT = e.t
    this.burst.push(Math.abs(dy) + Math.abs(dx))

    if (!Number.isInteger(dy) || !Number.isInteger(dx)) this.touchpad += 2
    else if (Math.abs(dx) >= 1 && !isNotch(dx)) this.touchpad += 2
    else if (isNotch(dy) && dx === 0) this.mouse += 1.5

    // dense burst of varying magnitudes = finger scrolling (with inertia tail)
    if (!this.burstCounted && this.burst.length >= 6 && new Set(this.burst).size >= 3) {
      this.touchpad += 6
      this.burstCounted = true
    }
    return this.verdict()
  }

  private resetBurst() {
    this.burst = []
    this.burstCounted = false
  }

  verdict(): Verdict {
    const net = this.touchpad - this.mouse
    return { kind: net >= this.threshold ? 'touchpad' : -net >= this.threshold ? 'mouse' : null, net }
  }

  /** Forget old evidence once a verdict was acted on, so a later change of device can flip it again. */
  reset() {
    this.touchpad = 0
    this.mouse = 0
    this.resetBurst()
    this.lastWheelT = -Infinity
  }
}

/** Classify a finished sequence of events (handy for tests and one-off use). */
export function classifyEvents(events: DetectEvent[], threshold = DEFAULT_THRESHOLD): Verdict {
  const d = new InputDetector(threshold)
  let v: Verdict = { kind: null, net: 0 }
  for (const e of events) v = d.feed(e)
  return v
}
