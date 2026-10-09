import { Fragment } from 'react'

/** Card text markup: `**word**` becomes a highlighted <strong> (rendered as React nodes, never as raw HTML). */
export function Markup({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') && p.length > 4 ? (
          <strong key={i} className="deck-em">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

/** Text without the bold markers (for speech and aria labels). */
export const plain = (t: string) => t.replace(/\*\*/g, '')
