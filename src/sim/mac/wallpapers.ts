/** Generic gradient "scenes" (no artwork). Index = SimSettings.wallpaper. */
export const MAC_WALLPAPERS: string[] = [
  'radial-gradient(ellipse at 20% 15%, #fbcfe8 0%, transparent 45%), radial-gradient(ellipse at 85% 90%, #7dd3fc 0%, transparent 50%), linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f9a8d4 100%)',
  'radial-gradient(ellipse at 75% 20%, #fde68a 0%, transparent 40%), linear-gradient(180deg, #38bdf8 0%, #0ea5e9 45%, #1e3a8a 100%)',
  'radial-gradient(ellipse at 30% 80%, #bbf7d0 0%, transparent 45%), linear-gradient(160deg, #0f766e 0%, #059669 50%, #a3e635 100%)',
  'radial-gradient(ellipse at 70% 25%, #fb923c 0%, transparent 45%), linear-gradient(170deg, #1e1b4b 0%, #581c87 50%, #be185d 100%)',
]

export const wallpaperFor = (i: number) => MAC_WALLPAPERS[((i % MAC_WALLPAPERS.length) + MAC_WALLPAPERS.length) % MAC_WALLPAPERS.length]
