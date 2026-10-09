import { ART } from './art'
import type { ArtName } from '../../engine/types'

/** An illustration on a soft pastel "sticker" tile (readable in light and dark themes). */
export function ArtView({ name, size = 180, caption, tile = true }: { name: ArtName; size?: number; caption?: string; tile?: boolean }) {
  const Art = ART[name]
  const drawing = <Art size={size} title={caption ?? name} />
  return (
    <figure className="flex flex-col items-center gap-2">
      {tile ? (
        <div className="flex items-center justify-center rounded-[28px] p-4" style={{ background: 'linear-gradient(145deg,#f5f0ff,#e9f7f4)' }}>
          {drawing}
        </div>
      ) : (
        drawing
      )}
      {caption && <figcaption className="text-center text-base text-muted">{caption}</figcaption>}
    </figure>
  )
}
