import type { Lesson, Unit } from '../../engine/types'
import { buildSlides, type Slide } from '../../engine/deck'
import type { InputKind, OsFlavor } from '../../engine/types'
import type { ModuleProgress } from '../../state/progress'
import { useFmt } from '../useFmt'

interface Props {
  lesson: Lesson
  progress?: ModuleProgress
  os: OsFlavor
  input: InputKind
  /** unit ids with a saved mid-unit position */
  inProgress: Set<string>
  onOpen: (index: number) => void
  onClose: () => void
}

const stats = (u: Unit, os: OsFlavor, input: InputKind) => {
  const slides = buildSlides(u, { os, input })
  const practice = slides.find((x): x is Extract<Slide, { kind: 'practice' }> => x.kind === 'practice')
  return { cards: slides.filter((x) => x.kind === 'card' || x.kind === 'hook').length, steps: practice?.steps.length ?? 0 }
}

/** Shown for modules with 2+ units: a short, picture-free list with ✓ / ▶ states. */
export function UnitsOverview({ lesson, progress, os, input, inProgress, onOpen, onClose }: Props) {
  const { n } = useFmt()
  const done = progress?.unitsDone ?? []
  const current = lesson.units.findIndex((u) => !done.includes(u.id))
  return (
    <div className="deck-root" data-testid="units-overview">
      <header className="deck-header">
        <button type="button" className="deck-iconbtn" aria-label="বন্ধ করুন" data-testid="deck-close" onClick={onClose}>
          ✕
        </button>
        <span className="flex-1" />
      </header>
      <div className="deck-stage" style={{ overflowY: 'auto' }}>
        <div className="deck-slide" style={{ gap: 16, paddingTop: 0 }}>
          <div>
            <p className="m-0 text-muted">
              পাঠ {n(lesson.module)} · প্রায় {n(lesson.minutes)} মিনিট
            </p>
            <h1 className="m-0 text-[length:var(--fs-title)] font-bold leading-tight" tabIndex={-1}>
              {lesson.titleBn}
            </h1>
            <p className="m-0 mt-1 text-muted">{lesson.oneLineBn}</p>
          </div>
          <ol className="m-0 grid list-none gap-3 p-0">
            {lesson.units.map((u, i) => {
              const isDone = done.includes(u.id)
              const st = stats(u, os, input)
              const isCurrent = i === current
              return (
                <li key={u.id}>
                  <button type="button" className="deck-unit" data-testid={`unit-card-${i}`} data-state={isDone ? 'done' : 'todo'} data-current={isCurrent} onClick={() => onOpen(i)}>
                    <span className="deck-unit-mark" aria-hidden="true">
                      {isDone ? '✓' : isCurrent ? '▶' : n(i + 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold leading-snug">{u.titleBn}</span>
                      <span className="block text-sm text-muted">
                        {n(st.cards)}টি কার্ড{st.steps > 0 ? ` · ${n(st.steps)}টি ধাপ` : ''} · কুইজ
                      </span>
                    </span>
                    <span className={`btn deck-unit-go ${isCurrent ? '' : 'btn-outline'}`} aria-hidden="true">
                      <span className="deck-unit-go-text">{isDone ? 'আবার করি' : inProgress.has(u.id) ? 'চালিয়ে যান' : 'শুরু করি'}</span>
                      <span className="deck-unit-go-arrow">→</span>
                    </span>
                    <span className="sr-only">
                      {isDone ? '(শেষ হয়েছে)' : isCurrent ? '(এখন এটি করুন)' : ''}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
