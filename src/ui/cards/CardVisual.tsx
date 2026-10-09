import type { Visual } from '../../engine/types'
import { VisualView } from '../illustrations/VisualView'
import { CompareVisual } from './CompareVisual'
import { FitBox } from './FitBox'

/** Renders a card's visual so that it always fits the space it is given (see FitBox). Widgets are interactive and may scroll inside their own area. */
export function CardVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case 'widget':
      return (
        <div className="deck-visual" data-scroll="true" data-testid="deck-widget">
          <div className="flex w-full flex-col gap-3 pb-2">
            <span className="deck-hint-pill">পারেন? 🙌 নিজে করে দেখুন</span>
            <VisualView visual={visual} />
          </div>
        </div>
      )
    case 'compare':
      return (
        <FitBox width="fill" maxWidth={760} maxScale={1.15}>
          <CompareVisual visual={visual} />
        </FitBox>
      )
    case 'mock':
    case 'demo':
      return (
        <FitBox width="fill" maxWidth={720} maxScale={1.15}>
          <VisualView visual={visual} />
        </FitBox>
      )
    case 'flow':
      // wraps onto several rows instead of shrinking the labels below a readable size
      return (
        <FitBox width="fill" maxWidth={760} maxScale={1.3}>
          <VisualView visual={visual} />
        </FitBox>
      )
    case 'code':
      return (
        <FitBox width="fill" maxWidth={680} maxScale={1.3}>
          <VisualView visual={visual} />
        </FitBox>
      )
    default:
      return (
        <FitBox width="natural" maxScale={1.6}>
          <VisualView visual={visual} />
        </FitBox>
      )
  }
}
