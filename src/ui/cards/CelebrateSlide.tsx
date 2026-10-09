import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lesson, OsFlavor, Unit } from '../../engine/types'
import { store, useProgress } from '../../state/store'
import { AddToNotebook } from '../AddToNotebook'
import { Celebration } from '../Celebration'
import { InFooter, PrimaryButton } from './DeckFooter'
import { FitBox } from './FitBox'
import { Sheet } from './Sheet'

export interface Outcome {
  /** XP earned in this unit (steps + quiz + finishing) */
  xp: number
  streak: number
  /** badge ids newly earned */
  badges: string[]
  moduleDone: boolean
}

interface Props {
  lesson: Lesson
  unit: Unit
  os: OsFlavor
  isLastUnit: boolean
  outcome: Outcome | null
  /** label + action of the single primary button: next unit / next module / home */
  primary: { label: string; onClick: () => void }
  onHome: () => void
}

const TITLES = ['শাবাশ! এই অংশ শেষ', 'দারুণ হয়েছে!', 'এক ধাপ এগোলেন!', 'চমৎকার, শেষ করলেন!']

/** The celebration: sparkle + XP + streak + badges, then three recap chips, real-world tasks (last unit), a teacher toggle, and the next action. */
export function CelebrateSlide({ lesson, unit, os, isLastUnit, outcome, primary, onHome }: Props) {
  const [sheet, setSheet] = useState<'real' | 'teacher' | null>(null)
  const progress = useProgress().modules[lesson.module]
  const r = lesson.realWorld
  const tasks = [...r.tasksBn, ...((os === 'windows' ? r.windowsTasksBn : r.macTasksBn) ?? [])]
  const checked = progress?.realWorldChecked ?? []
  const title = outcome?.moduleDone ? '🎉 পুরো পাঠ সম্পন্ন!' : TITLES[unit.id.length % TITLES.length]
  return (
    <>
      <div className="deck-celebrate" data-testid="deck-celebrate">
        {/* the celebration shrinks to whatever height is left (phones) */}
        <div className="flex min-h-0 w-full flex-1 flex-col" data-deck-focus="" tabIndex={-1}>
          <FitBox width="fill" maxWidth={840} maxScale={1}>
            <Celebration title={title} xp={outcome?.xp} streak={outcome?.streak} badges={outcome?.badges} sub={outcome?.moduleDone ? lesson.titleBn : unit.titleBn} />
          </FitBox>
        </div>
        <ul className="deck-recap m-0 flex-none list-none p-0" aria-label="মনে রাখুন">
          {unit.recapBn.slice(0, 3).map((t) => (
            <li key={t} className="deck-chip">
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-none flex-wrap items-center justify-center gap-2">
          {isLastUnit && (
            <button type="button" className="btn btn-outline" data-testid="real-world-toggle" aria-expanded={sheet === 'real'} onClick={() => setSheet((s) => (s === 'real' ? null : 'real'))}>
              💻 এবার আসল কম্পিউটারে
            </button>
          )}
          {isLastUnit && lesson.certificatePart && (outcome?.moduleDone || progress?.completed) && (
            <Link to={`/certificate/${lesson.certificatePart}`} className="btn btn-outline">
              🏆 সনদ দেখুন
            </Link>
          )}
          {isLastUnit && lesson.certificatePart === 2 && (outcome?.moduleDone || progress?.completed) && (
            <Link to="/next-steps" className="btn btn-outline" data-testid="next-steps-link">
              🧭 পরের ধাপের পথ
            </Link>
          )}
          {isLastUnit && lesson.teacherTipBn && (
            <button type="button" className="deck-more" data-testid="teacher-toggle" aria-expanded={sheet === 'teacher'} onClick={() => setSheet((s) => (s === 'teacher' ? null : 'teacher'))}>
              👨‍🏫 শিক্ষকের জন্য
            </button>
          )}
          <AddToNotebook title={`${lesson.titleBn} — ${unit.titleBn}`} body={unit.recapBn.map((t) => `• ${t}`).join('\n')} label="📓 নোটবুকে যোগ করুন" />
          <button type="button" className="deck-more" onClick={onHome}>
            হোমে ফিরি
          </button>
        </div>
      </div>
      {sheet === 'real' && (
        <Sheet title="এবার আসল কম্পিউটারে" onClose={() => setSheet(null)}>
          <ul className="m-0 list-none space-y-2 p-0">
            {tasks.map((t, i) => (
              <li key={i}>
                <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 p-3" style={{ borderColor: 'var(--c-line)' }}>
                  <input type="checkbox" className="mt-1 h-6 w-6 accent-[var(--c-brand)]" checked={checked.includes(i)} onChange={(e) => store.setRealWorldChecked(lesson.module, i, e.target.checked)} />
                  <span>{t}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mb-0 mt-3 text-sm text-muted">কাজগুলো সম্পূর্ণ নিরাপদ। না করলেও পরের পাঠে যেতে পারবেন।</p>
        </Sheet>
      )}
      {sheet === 'teacher' && lesson.teacherTipBn && (
        <Sheet title="শিক্ষকের জন্য" onClose={() => setSheet(null)}>
          <p className="m-0">{lesson.teacherTipBn}</p>
        </Sheet>
      )}
      <InFooter>
        <PrimaryButton label={primary.label} onClick={primary.onClick} tone="ok" />
      </InFooter>
    </>
  )
}
