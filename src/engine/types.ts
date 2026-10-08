/**
 * Lesson data contract. Lesson authors only touch files in src/content/lessons.
 * Documented in docs/LESSON_SCHEMA.md — keep both in sync.
 */

export type OsFlavor = 'windows' | 'mac'
export type OsVariant = OsFlavor | 'both'

/** The thing the learner must do to finish a step. */
export type ExpectedAction =
  | { type: 'click'; target: string }
  | { type: 'doubleClick'; target: string }
  | { type: 'rightClick'; target: string }
  | { type: 'drag'; target: string; dropTarget: string }
  | { type: 'type'; target: string; text: string; ignoreCase?: boolean }
  | { type: 'keyCombo'; keys: string }
  | { type: 'openApp'; app: string }
  | { type: 'closeApp'; app: string }
  | { type: 'createFolder'; name?: string; inPath?: string }
  | { type: 'createFile'; name?: string; inPath?: string }
  | { type: 'rename'; from?: string; to?: string }
  | { type: 'move'; name: string; toPath: string }
  | { type: 'copy'; name: string; toPath?: string }
  | { type: 'delete'; name: string }
  | { type: 'restore'; name: string }
  | { type: 'saveFile'; name?: string }
  | { type: 'navigate'; path: string }
  | { type: 'selectOption'; target: string; value: string }
  | { type: 'custom'; event: string }
  | { type: 'continue' }

export type ExpectedActionType = ExpectedAction['type']

export interface Step {
  id: string
  titleBn: string
  /** What to do, in Bengali — shown in the coach bubble. */
  explanationBn: string
  /** Selector or component id the coach points at: `[data-coach="start-button"]` or just `start-button`. */
  target?: string
  expectedAction: ExpectedAction
  /** Gentle hint shown after ~10s of inactivity. */
  hintBn: string
  /** Simpler re-explanation shown by "আমি আটকে গেছি". */
  simplerBn?: string
  successMessageBn?: string
  teacherTipBn?: string
  osVariant: OsVariant
}

interface QuizBase {
  id: string
  questionBn: string
  hintBn: string
  explanationBn: string
  osVariant?: OsVariant
}

export type QuizQuestion =
  | (QuizBase & {
      type: 'multipleChoice'
      options: { id: string; textBn: string }[]
      correct: string[]
      multi?: boolean
    })
  | (QuizBase & {
      type: 'clickTarget'
      /** Items shown as clickable regions (id + label + optional emoji/icon). */
      items: { id: string; labelBn: string; icon?: string }[]
      correct: string
    })
  | (QuizBase & {
      type: 'dragMatch'
      pairs: { id: string; leftBn: string; rightBn: string }[]
    })
  | (QuizBase & {
      type: 'ordering'
      /** Items in the CORRECT order; the UI shuffles them. */
      items: { id: string; textBn: string }[]
    })
  | (QuizBase & {
      type: 'predictOutput'
      code: string
      language: 'python' | 'javascript' | 'html' | 'shell'
      /** Accepted answers (compared trimmed; case-sensitive unless ignoreCase). */
      acceptedAnswers: string[]
      ignoreCase?: boolean
    })

export type QuizQuestionType = QuizQuestion['type']

export interface FreePractice {
  titleBn: string
  instructionBn: string
  /** Optional small checklist of things she can try (self-ticked). */
  checklistBn?: string[]
}

export interface SummaryCard {
  titleBn: string
  pointsBn: string[]
  extraBn?: string
}

export interface RealWorldTasks {
  titleBn: string
  tasksBn: string[]
  windowsTasksBn?: string[]
  macTasksBn?: string[]
}

/** Blocks used by the "explanation" section. */
export type ExplanationBlock =
  | { kind: 'p'; textBn: string }
  | { kind: 'analogy'; textBn: string }
  | { kind: 'list'; itemsBn: string[] }
  | { kind: 'note'; textBn: string }
  | { kind: 'widget'; widget: string; props?: Record<string, unknown> }
  | { kind: 'code'; code: string; language?: string }

export interface Lesson {
  /** Module number 1..20. */
  module: number
  part: 1 | 2
  id: string
  titleBn: string
  oneLineBn: string
  minutes: number
  explanation: ExplanationBlock[]
  /** Steps run in the simulator; osVariant filters which are shown. */
  steps: Step[]
  freePractice?: FreePractice
  quiz: QuizQuestion[]
  summaryCard: SummaryCard
  realWorld: RealWorldTasks
  teacherTipBn?: string
  /** Glossary term ids introduced here (see src/content/glossary.ts). */
  glossaryIds: string[]
  /** Which simulation hosts the steps. Default 'desktop'. */
  simulation?: 'desktop' | 'terminal' | 'editor' | 'none' | 'custom'
}

export type ModuleStatus = 'playable' | 'soon'

export interface ModuleMeta {
  module: number
  part: 1 | 2
  titleBn: string
  oneLineBn: string
  icon: string
  status: ModuleStatus
}

export interface GlossaryEntry {
  id: string
  termBn: string
  termEn: string
  meaningBn: string
  /** Introduced in module N. */
  module: number
}
