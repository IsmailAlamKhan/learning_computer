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
  // ----- stage 5: terminal / editor / code -----
  /** She runs a command in the practice terminal. `command` = accepted forms (whitespace-normalised, case-sensitive). */
  | { type: 'typeCommand'; command: string | string[]; match?: 'exact' | 'prefix' | 'contains' }
  /** A file/folder exists in the virtual file system (canonical path like `~/coding/hello.py`). Checked after every event. */
  | { type: 'fileExists'; path: string; kind?: 'file' | 'folder' }
  /** A file's content contains `text` (checked after every event, e.g. after saving in the editor). */
  | { type: 'fileContains'; path: string; text: string }
  /** The last code run printed exactly this output (trimmed). */
  | { type: 'codeOutputEquals'; output: string | string[]; language?: 'python' | 'javascript' }
  /** The live preview of HTML/CSS currently contains this text (or CSS declaration like `color: red`). */
  | { type: 'previewContains'; text: string }
  /** She predicts what some code prints: she types an answer in the coach bubble. */
  | { type: 'predictOutput'; acceptedAnswers: string[]; ignoreCase?: boolean }

export type ExpectedActionType = ExpectedAction['type']

/** Simulator state the engine may need to evaluate state-based expectations. */
export interface MatchContext {
  vfs?: import('../sim/vfs').VirtualFileSystem
}

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

/** Initial state of the simulated computer for this lesson's practice. */
export interface SimSetup {
  /** app ids opened (without firing events) when the simulation starts, e.g. ['files', 'editor'] */
  openApps?: string[]
  /** add extra files/folders to the virtual file system */
  vfs?: (vfs: import('../sim/vfs').VirtualFileSystem, os: OsFlavor) => void
  /** initial computer settings (wallpaper, wifi, volume ...) */
  settings?: Partial<import('../sim/DesktopContext').SimSettings>
  /** show the hardware panel (insert a USB drive, connect a phone) below the simulated screen */
  hardware?: boolean
}

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
  /** starting state of the simulated desktop (open windows, extra files, settings) */
  setup?: SimSetup
  /** Optional progress checklist shown above the guided practice; an item ticks when all its steps are done. */
  checklist?: { id: string; textBn: string; stepIds: string[] }[]
  /** If set, completing this lesson issues the certificate (সনদপত্র) of that part. */
  certificatePart?: 1 | 2
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
