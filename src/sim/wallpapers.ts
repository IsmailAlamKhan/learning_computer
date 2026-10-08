/** Desktop wallpapers shared by Settings and the shells. `sim.wallpaper` is an index into this list. Pure CSS, no images. */
export const WALLPAPERS: string[] = [
  'linear-gradient(135deg, #0f4c81 0%, #2a7fc9 45%, #8fd0f5 100%)',
  'linear-gradient(135deg, #1b5e20 0%, #43a047 50%, #c5e1a5 100%)',
  'linear-gradient(135deg, #5b2a86 0%, #c0467f 55%, #ffb26b 100%)',
  'linear-gradient(160deg, #1e293b 0%, #334155 50%, #64748b 100%)',
  'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fde68a 100%)',
  'radial-gradient(circle at 30% 30%, #7dd3fc 0%, #2563eb 50%, #1e1b4b 100%)',
]

export const wallpaperCss = (i: number): string => WALLPAPERS[((i % WALLPAPERS.length) + WALLPAPERS.length) % WALLPAPERS.length]
