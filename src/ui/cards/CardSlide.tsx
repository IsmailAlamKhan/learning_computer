import { useState } from 'react'
import type { Card } from '../../engine/types'
import { ArtView } from '../illustrations/ArtView'
import { CardVisual } from './CardVisual'
import { Markup } from './markup'
import { Sheet } from './Sheet'

function Text({ card }: { card: Card }) {
  return (
    <p className="deck-text-main" data-deck-focus="" tabIndex={-1} data-testid="deck-text">
      <Markup text={card.textBn} />
    </p>
  )
}

/** The hook: the mentor "didi" says one relatable line in a speech bubble, then a picture. */
export function HookSlide({ card }: { card: Card }) {
  return (
    <div className="deck-body" data-testid="deck-hook">
      <div className="deck-hook">
        <div className="deck-hook-art">
          <ArtView name="didi-wave" size={120} tile={false} caption={undefined} />
        </div>
        <div className="deck-bubble">
          <Text card={card} />
        </div>
      </div>
      <CardVisual visual={card.visual} />
    </div>
  )
}

/** One idea: a big picture, one short line (max 2 highlighted words), up to 3 chips, and "আরও জানুন". */
export function ExplainSlide({ card }: { card: Card }) {
  const [more, setMore] = useState(false)
  return (
    <>
      <div className="deck-body">
        <CardVisual visual={card.visual} />
        <div className="deck-text">
          <Text card={card} />
          {card.chipsBn && card.chipsBn.length > 0 && (
            <ul className="deck-chips m-0 list-none p-0" aria-label="মূল কথা">
              {card.chipsBn.slice(0, 3).map((c) => (
                <li key={c} className="deck-chip">
                  {c}
                </li>
              ))}
            </ul>
          )}
          {card.learnMoreBn && (
            <button type="button" className="deck-more" aria-expanded={more} onClick={() => setMore((m) => !m)}>
              আরও জানুন {more ? '▾' : '▸'}
            </button>
          )}
        </div>
      </div>
      {more && card.learnMoreBn && (
        <Sheet title="আরও জানুন" onClose={() => setMore(false)}>
          <p className="m-0">
            <Markup text={card.learnMoreBn} />
          </p>
        </Sheet>
      )}
    </>
  )
}
