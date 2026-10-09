import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Lesson, OsFlavor, Unit } from '../engine/types'
import {
  buildSlides,
  canGoBack,
  canGoNext,
  deckReducer,
  initDeckState,
  isDone,
  isGated,
  keyIntent,
  readSavedIndex,
  readSavedWrong,
  resumeIndex,
  saveIndex,
  swipeIntent,
  type DeckAction,
  type DeckState,
  type FocusKind,
  type Slide,
} from '../engine/deck'
import { scoreQuiz } from '../engine/quiz'
import { hasLesson } from '../content/lessons'
import { getModule } from '../content/modules'
import { XP } from '../state/gamification'
import { store, useProgress } from '../state/store'
import { ArtView } from '../ui/illustrations/ArtView'
import { SpeakButton } from '../ui/SpeakButton'
import { CelebrateSlide, type Outcome } from '../ui/cards/CelebrateSlide'
import { ExplainSlide, HookSlide } from '../ui/cards/CardSlide'
import { FooterSlotContext, PrimaryButton } from '../ui/cards/DeckFooter'
import { plain } from '../ui/cards/markup'
import { PracticeSlide } from '../ui/cards/PracticeSlide'
import { QuizSlide } from '../ui/cards/QuizSlide'
import { UnitsOverview } from '../ui/cards/UnitsOverview'
import { useFmt } from '../ui/useFmt'
import '../ui/cards/deck.css'

/** Which kind of control owns the keyboard right now (see keyIntent in engine/deck.ts). */
function focusKindOf(t: EventTarget | null): FocusKind {
  const el = t instanceof HTMLElement ? t : null
  if (!el) return 'none'
  if (el.closest('[data-sim-root]')) return 'sim'
  if (el.closest('input,textarea,select,[contenteditable="true"]')) return 'text'
  if (el.closest('button,a,summary,[role="button"],[role="checkbox"],[role="radio"]')) return 'control'
  return 'none'
}

/** Lesson in the cards format: an optional units overview, then one unit at a time as a one-card-at-a-time deck. */
export default function DeckPage({ lesson }: { lesson: Lesson }) {
  const data = useProgress()
  const navigate = useNavigate()
  const [unitIndex, setUnitIndex] = useState<number | null>(lesson.units.length === 1 ? 0 : null)
  const home = useCallback(() => navigate('/'), [navigate])
  const prog = data.modules[lesson.module]

  // the deck covers the whole screen: the page header, skip link, help button etc. behind it must not take focus
  useEffect(() => {
    const root = document.getElementById('main')?.parentElement
    const others = root ? [...root.children].filter((c) => c.id !== 'main') : []
    others.forEach((el) => el.setAttribute('inert', ''))
    return () => others.forEach((el) => el.removeAttribute('inert'))
  }, [])

  if (unitIndex === null) {
    const inProgress = new Set(lesson.units.filter((u) => (readSavedIndex(data.extras, lesson.module, u.id) ?? 0) > 0 && !prog?.unitsDone.includes(u.id)).map((u) => u.id))
    return <UnitsOverview lesson={lesson} progress={prog} os={data.profile.os} input={data.profile.input} inProgress={inProgress} onOpen={setUnitIndex} onClose={home} />
  }
  const unit = lesson.units[unitIndex]
  const multi = lesson.units.length > 1
  return (
    <UnitDeck
      key={unit.id}
      lesson={lesson}
      unit={unit}
      unitIndex={unitIndex}
      onClose={multi ? () => setUnitIndex(null) : home}
      onNextUnit={() => setUnitIndex(unitIndex + 1)}
    />
  )
}

interface UnitDeckProps {
  lesson: Lesson
  unit: Unit
  unitIndex: number
  onClose: () => void
  onNextUnit: () => void
}

function UnitDeck({ lesson, unit, unitIndex, onClose, onNextUnit }: UnitDeckProps) {
  const navigate = useNavigate()
  const { n } = useFmt()
  const data = useProgress()
  const module = lesson.module
  const input = data.profile.input
  const [os, setOs] = useState<OsFlavor>(data.profile.os)
  const slides = useMemo(() => buildSlides(unit, { os, input }), [unit, os, input])
  // ---- progress at entry (read once: our own saves while playing must not restart anything) ----
  const [entry] = useState(() => {
    const snap = store.getSnapshot()
    const unitDone = !!snap.modules[module]?.unitsDone.includes(unit.id)
    return {
      unitDone,
      resume: resumeIndex(slides, readSavedIndex(snap.extras, module, unit.id), unitDone),
      wrong: readSavedWrong(snap.extras, module, unit.id),
      xp: snap.xp,
      badges: snap.badges,
    }
  })
  const { unitDone } = entry
  const [phase, setPhase] = useState<'resume' | 'play'>(entry.resume !== undefined ? 'resume' : 'play')
  const [state, dispatch] = useReducer((s: DeckState, a: DeckAction) => deckReducer(s, a, slides), undefined, () => initDeckState(slides, 0, unitDone))
  const latest = useRef({ state, slides })
  useEffect(() => {
    latest.current = { state, slides }
  })
  const slide = slides[Math.min(state.index, slides.length - 1)]

  // quiz bookkeeping: wrong attempts per question (restored with "continue") and the questions answered right during this visit
  const [wrong, setWrong] = useState<Record<string, number>>(entry.wrong)
  const [answered, setAnswered] = useState<string[]>([])
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const finishedRef = useRef(false)
  const [footerEl, setFooterEl] = useState<HTMLDivElement | null>(null)
  const regionRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => dispatch({ type: 'next' }), [])
  const back = useCallback(() => dispatch({ type: 'back' }), [])

  // OS toggled: the slide list changed
  const firstOs = useRef(true)
  useEffect(() => {
    if (firstOs.current) {
      firstOs.current = false
      return
    }
    if (unitDone) dispatch({ type: 'set', state: { ...state, done: [...new Set([...state.done, ...slides.filter(isGated).map((s) => s.id)])] } })
    dispatch({ type: 'clamp' })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the OS (so the slide list) changes
  }, [os, slides, unitDone])

  // save "where I am" (continue where you left off)
  useEffect(() => {
    if (phase !== 'play' || unitDone || finishedRef.current) return
    if (state.index === 0 && entry.resume === undefined) return
    saveIndex(store, module, unit.id, state.index, wrong)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- save when the position changes (wrong tries are saved by onQuizWrong)
  }, [state.index, phase, module, unit.id, unitDone])

  // focus the new card's text (screen readers / keyboard users land on the new content)
  useEffect(() => {
    if (phase !== 'play') return
    const id = window.requestAnimationFrame(() => {
      const el = regionRef.current?.querySelector<HTMLElement>('[data-deck-focus]')
      el?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(id)
  }, [slide?.id, phase])

  // celebration: record the unit, module, certificate and badges exactly once
  useEffect(() => {
    if (slide?.kind !== 'celebrate' || finishedRef.current) return
    finishedRef.current = true
    const before = store.getSnapshot().modules[module]
    const wasDone = !!before?.unitsDone.includes(unit.id)
    let newlyCompleted = false
    if (!wasDone) {
      store.completeUnit(module, unit.id)
      const after = store.getSnapshot().modules[module]
      const allDone = lesson.units.every((u) => after?.unitsDone.includes(u.id))
      if (allDone && !after?.completed) {
        newlyCompleted = true
        store.completeModule(module)
        store.addXp(XP.moduleDone)
        if (lesson.certificatePart) store.addCertificate(lesson.certificatePart)
        if (module === 13) store.awardBadge('part1')
        if (module === 20) store.awardBadge('part2')
      }
    }
    saveIndex(store, module, unit.id, 0)
    const snap = store.getSnapshot()
    setOutcome({
      xp: Math.max(0, snap.xp - entry.xp),
      streak: snap.streak.count,
      badges: snap.badges.filter((b) => !entry.badges.includes(b)),
      moduleDone: newlyCompleted,
    })
  }, [slide?.kind, module, unit.id, lesson, entry])

  // ---- keyboard ----
  useEffect(() => {
    if (phase !== 'play') return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
      const sheetOpen = !!document.querySelector('[data-deck-sheet]')
      const intent = keyIntent(e.key, { focus: focusKindOf(e.target), slide: latest.current.slides[latest.current.state.index].kind, sheetOpen })
      if (!intent) return
      if (intent === 'close') {
        if (!sheetOpen) onClose()
        return
      }
      e.preventDefault()
      dispatch({ type: intent })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [phase, onClose])

  // ---- swipe (touch / pen only; not on the practice and quiz slides, where dragging means something else) ----
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const swipeable = slide?.kind === 'hook' || slide?.kind === 'card'
  const onPointerDown = (e: ReactPointerEvent) => {
    if (!swipeable || e.pointerType === 'mouse' || (e.target as HTMLElement).closest('[data-deck-sheet],[data-testid="deck-widget"],button,a,input')) return
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: ReactPointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s || document.querySelector('[data-deck-sheet]')) return
    const intent = swipeIntent(e.clientX - s.x, e.clientY - s.y)
    if (intent) dispatch({ type: intent })
  }

  // ---- quiz bookkeeping ----
  const quizSlides = slides.filter((s): s is Extract<Slide, { kind: 'quiz' }> => s.kind === 'quiz')
  const onQuizCorrect = (id: string, tries: number) => {
    const nextWrong = tries > 0 ? { ...wrong, [id]: tries } : wrong
    const nextAnswered = answered.includes(id) ? answered : [...answered, id]
    setWrong(nextWrong)
    setAnswered(nextAnswered)
    dispatch({ type: 'complete', id })
    if (quizSlides.every((q) => nextAnswered.includes(q.id))) {
      store.recordUnitQuiz(module, unit.id, scoreQuiz(quizSlides.map((q) => q.id), nextWrong))
    }
  }
  const onQuizWrong = (id: string, tries: number) => {
    const nextWrong = { ...wrong, [id]: tries }
    setWrong(nextWrong)
    saveIndex(store, module, unit.id, state.index, nextWrong)
  }

  // ---- what the primary button on the celebration does ----
  const isLastUnit = unitIndex === lesson.units.length - 1
  const nextMeta = getModule(module + 1)
  const nextModuleOpen = !!nextMeta && nextMeta.status === 'playable' && hasLesson(module + 1)
  const primary = !isLastUnit
    ? { label: 'পরের অংশে যান →', onClick: onNextUnit }
    : lesson.certificatePart === 2
      ? { label: '🚀 এরপর কোথায় যাব', onClick: () => navigate('/next-steps') }
      : nextModuleOpen
        ? { label: 'পরের পাঠে যাই →', onClick: () => navigate(`/module/${module + 1}`) }
        : { label: 'হোমে ফিরি', onClick: () => navigate('/') }

  const speakText = slide.kind === 'hook' || slide.kind === 'card' ? plain(slide.card.textBn) : slide.kind === 'quiz' ? slide.question.questionBn : unit.titleBn

  const header = (
    <header className="deck-header">
      <button type="button" className="deck-iconbtn" aria-label="পাঠ বন্ধ করুন" data-testid="deck-close" onClick={onClose}>
        ✕
      </button>
      <div
        className="deck-segments"
        role="progressbar"
        data-testid="deck-progress"
        aria-label="পাঠের অগ্রগতি"
        aria-valuemin={1}
        aria-valuemax={slides.length}
        aria-valuenow={state.index + 1}
        aria-valuetext={`${n(state.index + 1)} / ${n(slides.length)}`}
      >
        {slides.map((s, i) => (
          <span key={s.id} className="deck-seg" data-fill={i <= state.index && phase === 'play'}>
            <i />
          </span>
        ))}
      </div>
      <button type="button" className="deck-oschip" data-testid="deck-os" aria-label={`কম্পিউটার বদলান। এখন ${os === 'mac' ? 'Mac' : 'Windows'}`} onClick={() => setOs((o) => (o === 'mac' ? 'windows' : 'mac'))}>
        <span aria-hidden="true">💻</span>
        <span aria-hidden="true" className="deck-os-long">{os === 'mac' ? 'Mac' : 'Windows'}</span>
        <span aria-hidden="true" className="deck-os-short">{os === 'mac' ? 'Mac' : 'Win'}</span>
      </button>
      <SpeakButton text={speakText} />
    </header>
  )

  if (phase === 'resume') {
    const at = entry.resume ?? 0
    return (
      <div className="deck-root" data-testid="deck-resume">
        {header}
        <div className="deck-stage">
          <div className="deck-slide" data-kind="resume" style={{ justifyContent: 'center', alignItems: 'center', gap: 20, textAlign: 'center' }}>
            <ArtView name="didi-wave" size={140} tile={false} />
            <h1 className="m-0 text-[length:var(--fs-heading)] font-bold" tabIndex={-1} data-deck-focus="">
              আগের জায়গা থেকে চালিয়ে যাবেন?
            </h1>
            <p className="m-0 text-muted">
              {unit.titleBn} — {n(at + 1)} নম্বর ধাপে ছিলেন।
            </p>
          </div>
        </div>
        <div className="deck-footer" style={{ flexDirection: 'column' }}>
          <div className="deck-footer-slot" style={{ width: '100%' }}>
            <PrimaryButton
              label="চালিয়ে যাই →"
              onClick={() => {
                dispatch({ type: 'set', state: initDeckState(slides, at) })
                setAnswered(slides.slice(0, at).filter(isGated).map((x) => x.id))
                setPhase('play')
              }}
            />
          </div>
          <button type="button" className="deck-more" data-testid="deck-restart" onClick={() => setPhase('play')}>
            শুরু থেকে করি
          </button>
        </div>
      </div>
    )
  }

  const primaryForSlide = (() => {
    if (slide.kind === 'hook' || slide.kind === 'card') return <PrimaryButton label="পরের ধাপ →" onClick={next} />
    if (slide.kind === 'practice') return <PrimaryButton label="পরের ধাপ →" disabled={!canGoNext(slides, state)} onClick={next} />
    return null // quiz and celebrate put their own button in the footer slot
  })()

  return (
    <div className="deck-root" data-testid="deck-root" role="dialog" aria-modal="false" aria-label={`${lesson.titleBn} — ${unit.titleBn}`}>
      <h1 className="sr-only">
        {lesson.titleBn} — {unit.titleBn}
      </h1>
      {header}
      <FooterSlotContext.Provider value={footerEl}>
        <div className="deck-stage" ref={regionRef} aria-live="polite" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
          <div key={`${slide.id}`} className="deck-slide" data-kind={slide.kind} data-dir={state.dir} data-testid="deck-slide" data-slide-id={slide.id}>
            {slide.kind === 'hook' && <HookSlide card={slide.card} />}
            {slide.kind === 'card' && <ExplainSlide card={slide.card} />}
            {slide.kind === 'practice' && (
              <PracticeSlide
                key={slide.id}
                lesson={lesson}
                unit={unit}
                steps={slide.steps}
                os={os}
                input={input}
                alreadyDone={unitDone}
                onFinished={() => dispatch({ type: 'complete', id: slide.id })}
              />
            )}
            {slide.kind === 'quiz' && (
              <QuizSlide
                key={slide.id}
                question={slide.question}
                position={slide.position}
                total={slide.total}
                wrongBefore={wrong[slide.id] ?? 0}
                done={answered.includes(slide.id) && isDone(state, slide)}
                onCorrect={(w) => onQuizCorrect(slide.id, w)}
                onWrong={(w) => onQuizWrong(slide.id, w)}
                onNext={next}
              />
            )}
            {slide.kind === 'celebrate' && <CelebrateSlide lesson={lesson} unit={unit} os={os} isLastUnit={isLastUnit} outcome={outcome} primary={primary} onHome={() => navigate('/')} />}
          </div>
        </div>
      </FooterSlotContext.Provider>
      <div className="deck-footer">
        <button type="button" className="deck-iconbtn" data-testid="deck-back" aria-label="আগের ধাপ" disabled={!canGoBack(state)} onClick={back} style={{ border: '2px solid var(--c-line)' }}>
          ←
        </button>
        <div className="deck-footer-slot" ref={setFooterEl}>
          {primaryForSlide}
        </div>
        <span className="deck-spacer w-12 flex-none" aria-hidden="true" />
      </div>
    </div>
  )
}
