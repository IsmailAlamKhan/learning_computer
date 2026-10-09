import type { FC } from 'react'

export interface ArtProps {
  /** pixel size of the square drawing (viewBox is always 0 0 200 200) */
  size?: number
  className?: string
  title?: string
}
export type ArtComponent = FC<ArtProps>
