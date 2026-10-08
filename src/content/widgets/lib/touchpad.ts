export type Gesture = 'tap' | 'doubleTap' | 'rightTap' | 'scroll' | 'zoom' | 'drag'

export const GESTURES: Gesture[] = ['tap', 'doubleTap', 'rightTap', 'scroll', 'zoom', 'drag']

export const ZOOM_MIN = 1
export const ZOOM_MAX = 3
export const ZOOM_DONE_AT = 1.5
export const SCROLL_DONE_AT = 80

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Add a completed gesture (no duplicates, original order of GESTURES). */
export function tick(done: readonly Gesture[], g: Gesture): Gesture[] {
  return GESTURES.filter((x) => x === g || done.includes(x))
}

export const allDone = (done: readonly Gesture[]) => GESTURES.every((g) => done.includes(g))

/** Pinch / ctrl+wheel: negative deltaY (fingers apart) zooms in. */
export function wheelToZoom(zoom: number, deltaY: number): number {
  return clamp(Math.round((zoom - deltaY * 0.01) * 100) / 100, ZOOM_MIN, ZOOM_MAX)
}

export function buttonZoom(zoom: number, dir: 1 | -1): number {
  return clamp(Math.round((zoom + dir * 0.25) * 100) / 100, ZOOM_MIN, ZOOM_MAX)
}

/** Safari gesturechange gives an absolute scale relative to the gesture start. */
export function gestureToZoom(startZoom: number, scale: number): number {
  return clamp(Math.round(startZoom * scale * 100) / 100, ZOOM_MIN, ZOOM_MAX)
}

export const zoomReached = (zoom: number) => zoom >= ZOOM_DONE_AT
export const scrollReached = (scrollTop: number) => scrollTop >= SCROLL_DONE_AT

export function isInside(x: number, y: number, r: { left: number; top: number; right: number; bottom: number }): boolean {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
}
