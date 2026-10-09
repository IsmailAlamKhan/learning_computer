/**
 * Lesson data contract. Lesson authors only touch files in src/content/lessons.
 * Documented in docs/LESSON_SCHEMA.md — keep both in sync.
 */

export type OsFlavor = 'windows' | 'mac'
export type OsVariant = OsFlavor | 'both'
/** What the learner points with. Detected automatically; 'touch' (touchscreen) is treated like 'touchpad'. */
export type InputKind = 'mouse' | 'touchpad'
export type InputVariant = InputKind | 'both'

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
  /** only for learners using this pointing device (auto-detected; see src/lib/device.ts). Default: both. */
  inputVariant?: InputVariant
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

export interface RealWorldTasks {
  /** short heading, e.g. "এবার আসল কম্পিউটারে" */
  titleBn: string
  /** 2–3 safe tasks, each max ~14 words */
  tasksBn: string[]
  windowsTasksBn?: string[]
  macTasksBn?: string[]
}

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

// ---------------------------------------------------------------------------------------------
// Cards flow (readability overhaul). A Lesson is a list of Units; each Unit is one swipeable deck:
//   hook → 3–6 micro cards → guided practice (steps) → 3-question quiz → celebration.
// The deck builder (src/engine/deck.ts) turns a Unit into slides; authors only write the data below.
// ---------------------------------------------------------------------------------------------
import type { ArtName, MockName } from '../ui/illustrations/names'
export type { ArtName, MockName }

/** A small picture used inside compare cards. */
export type MiniVisual =
  | { kind: 'art'; name: ArtName }
  | { kind: 'mock'; name: MockName; os?: OsFlavor; highlight?: string }
  | { kind: 'big'; emoji: string }

export interface CompareSide {
  visual: MiniVisual
  /** 1–3 words, e.g. "Windows" */
  labelBn: string
  /** optional one short line under the label (max ~8 words) */
  captionBn?: string
}

/** The visual of a card. Every explanation card MUST have one. */
export type Visual =
  /** one big original illustration */
  | { kind: 'art'; name: ArtName; captionBn?: string }
  /** 2–4 items in a row joined by arrows (input → processing → output) */
  | { kind: 'flow'; items: { art: ArtName; labelBn: string }[] }
  /** side-by-side (before/after, Windows vs Mac, right vs wrong) */
  | { kind: 'compare'; left: CompareSide; right: CompareSide; vs?: string }
  /** annotated mini-screenshot of the simulated OS with one region highlighted */
  | { kind: 'mock'; name: MockName; os?: OsFlavor; highlight?: string; captionBn?: string }
  /** looping 3–4 s animation of a gesture (animated cursor) on a mock */
  | { kind: 'demo'; gesture: 'click' | 'double-click' | 'right-click' | 'drag' | 'scroll' | 'type' | 'keys' | 'two-finger-tap' | 'two-finger-scroll'; mock?: MockName; os?: OsFlavor; keys?: string; textBn?: string; captionBn?: string }
  /** annotated code with an animated line-by-line "run" and the output appearing */
  | { kind: 'code'; lang: 'python' | 'html' | 'css' | 'javascript' | 'shell'; lines: { code: string; noteBn?: string }[]; output?: string[]; browserPreview?: boolean }
  /** an interactive widget from src/content/widgets (a "পারেন?" challenge moment) */
  | { kind: 'widget'; widget: string; props?: Record<string, unknown>; captionBn?: string }
  /** fallback: one huge emoji (use sparingly) */
  | { kind: 'big'; emoji: string; captionBn?: string }

/**
 * One screen. ONE idea. `textBn` max ~25 words (hard cap 35), at most 2 short sentences.
 * Bold key words with **double asterisks** (max 2 per card).
 */
export interface Card {
  id: string
  /** 'hook' = the relatable 1-line why; 'visual' = one idea + picture; 'compare' = two pictures side by side; 'code' = annotated code */
  type: 'hook' | 'visual' | 'compare' | 'code'
  textBn: string
  visual: Visual
  /** up to 3 chips (2–3 words each) summarising the idea */
  chipsBn?: string[]
  /** extra detail hidden behind "আরও জানুন" (any length, but keep it useful) */
  learnMoreBn?: string
  /** only show on this OS (Windows/Mac-specific cards) */
  osVariant?: OsVariant
  /** only show for this pointing device (mouse / touchpad) — auto-detected */
  inputVariant?: InputVariant
}

/** A sub-lesson: one complete deck. Most modules have one unit; long modules have two or more. */
export interface Unit {
  id: string
  titleBn: string
  hook: Card
  /** 3–6 micro cards */
  cards: Card[]
  /** guided practice: one action per step; filtered by osVariant and inputVariant */
  steps: Step[]
  /** starting state of the simulated computer for this unit's practice */
  setup?: SimSetup
  /** optional progress checklist shown during practice; ticks when all its steps are done */
  checklist?: { id: string; textBn: string; stepIds: string[] }[]
  /** exactly 3 questions */
  quiz: QuizQuestion[]
  /** "মনে রাখুন": max 3 very short items (max ~8 words each) */
  recapBn: string[]
  /** optional one-line challenge after the quiz ("পারেন?") */
  freeTryBn?: string
}

export interface Lesson {
  /** Module number 1..20. */
  module: number
  part: 1 | 2
  id: string
  titleBn: string
  oneLineBn: string
  /** minutes for the whole module */
  minutes: number
  units: Unit[]
  /** shown on the last celebration card of the module ("এবার আসল কম্পিউটারে") */
  realWorld: RealWorldTasks
  /** hidden behind a small toggle ("শিক্ষকের জন্য") */
  teacherTipBn?: string
  /** Glossary term ids introduced here (see src/content/glossary/*.ts). */
  glossaryIds: string[]
  /** If set, completing the module issues the certificate (সনদপত্র) of that part. */
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
  /** ONE short line (max ~18 words) */
  meaningBn: string
  /** a single emoji shown on the flip card */
  icon?: string
  /** optional illustration name from the art library (preferred over `icon`) */
  art?: ArtName
  /** Introduced in module N. */
  module: number
}
