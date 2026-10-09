import type { FC } from 'react'
import { MOCK_NAMES, MOCK_REGIONS, type MockName } from './names'
import type { OsFlavor } from '../../engine/types'

export interface MockProps {
  os?: OsFlavor
  /** one of MOCK_REGIONS[name] — drawn with a pulsing ring + arrow */
  highlight?: string
  className?: string
}

const Placeholder: FC<MockProps & { name: MockName }> = ({ name, highlight, className }) => (
  <div className={className} role="img" aria-label={`${name} ${highlight ?? ''}`} style={{ padding: 16, border: '2px dashed currentColor', borderRadius: 16 }}>
    {name} {highlight ? `· ${highlight}` : ''}
  </div>
)

/** Annotated mini-screenshots of the simulated OS (implemented by the MOCKS task; one component per MockName). */
export const MOCKS: Record<MockName, FC<MockProps>> = Object.fromEntries(
  MOCK_NAMES.map((n) => [n, (p: MockProps) => <Placeholder name={n} {...p} />]),
) as Record<MockName, FC<MockProps>>

export const regionsOf = (name: MockName): readonly string[] => MOCK_REGIONS[name]
