# Lesson schema (cards format)

Lessons are plain TypeScript data files in `src/content/lessons/mNN.ts` (m01 … m20), each with
`const lesson: Lesson = {…}; export default lesson`. The authoritative types are in
[`src/engine/types.ts`](../src/engine/types.ts). **No engine code is needed to add or edit a lesson.**
Reference lesson: `src/content/lessons/m02.ts`. Writing rules and the text budget: [UX_CONTRACT.md](UX_CONTRACT.md) and
[UX_AUTHORING.md](UX_AUTHORING.md); the budget is enforced by `npm run audit:content` and `src/content/content.test.ts`.

Glossary entries live in `src/content/glossary/mNN.ts` (`export default GlossaryEntry[]`); both folders are auto-discovered with
`import.meta.glob`. A module appears as playable on the roadmap once its `status` in `src/content/modules.ts` is `'playable'`.

All learner-facing text fields end in `Bn` and must be natural spoken Bengali (চলিত), "আপনি" form, religion-neutral.
Technical terms: Bengali + English as seen on screen, e.g. `ফোল্ডার (Folder)`.

## Shape

```
Lesson
 ├─ module, part, id, titleBn, oneLineBn, minutes, glossaryIds, certificatePart?, teacherTipBn?
 ├─ realWorld            ("এবার আসল কম্পিউটারে": shown on the module's last celebration screen)
 └─ units: Unit[]        (one swipeable deck each; most modules have 2–4)
     └─ Unit
         ├─ hook: Card                 one relatable line + a visual
         ├─ cards: Card[]              3–6 micro cards, one idea each
         ├─ steps: Step[]              guided practice in the simulated computer
         ├─ setup?, checklist?         starting state of the sim / progress ticks
         ├─ quiz: QuizQuestion[]       exactly 3
         ├─ recapBn: string[]          "মনে রাখুন", ≤ 3 short items
         └─ freeTryBn?                 optional one-line "পারেন?" challenge
```

A learner walks one unit as slides: `hook → card × n → practice → quiz × 3 → celebrate` (see ARCHITECTURE.md, "Deck engine").
A long module is split into **units** (these replace the old "chapters"): each unit starts a fresh simulated computer from its own
`setup`, so steps never depend on a previous unit's state. Step ids must still be unique across the whole module.

## Lesson

| field | type | notes |
|---|---|---|
| `module` | 1..20 | module number |
| `part` | 1 \| 2 | |
| `id` | string | `m02` style |
| `titleBn`, `oneLineBn` | string | |
| `minutes` | number | for the whole module |
| `units` | `Unit[]` | at least one; unit ids unique and different from card ids |
| `realWorld` | `RealWorldTasks` | `{ titleBn, tasksBn (2–3 safe tasks, ≤ 18 words each), windowsTasksBn?, macTasksBn? }`; the learner can tick them |
| `teacherTipBn` | string? | hidden behind a "শিক্ষকের জন্য" toggle |
| `glossaryIds` | string[] | glossary ids introduced in this module (all must exist) |
| `certificatePart` | 1 \| 2 ? | completing the module issues that part's certificate (modules 13 and 20) |

## Unit

| field | type | notes |
|---|---|---|
| `id` | string | stable and unique in the module (saved position and quiz results use it) |
| `titleBn` | string | short |
| `hook` | `Card` (`type: 'hook'`) | ≤ 15 words, a phone / Facebook / bKash style analogy; has a visual too |
| `cards` | `Card[]` | 3–6 authored cards, none of type `hook`. Per learner (after OS/input filtering) at least 3 must remain |
| `steps` | `Step[]` | guided practice; ≤ ~15 per OS (hard max 22). The practice slide is skipped when none apply to the learner |
| `setup` | `SimSetup`? | see below |
| `checklist` | `{ id, textBn, stepIds[] }[]`? | a tick appears when all its steps are done; every `stepIds` entry must exist |
| `quiz` | `QuizQuestion[]` | **exactly 3**, valid for both OSes and both devices |
| `recapBn` | string[] | 1–3 items, ≤ 8 words each |
| `freeTryBn` | string? | optional one-line challenge after the quiz |

A unit with more than 12 deck items must be split (`splitIfLong(unit)` in `src/engine/deck.ts`; a content test enforces it).

### `SimSetup`

```ts
setup: {
  openApps: ['terminal'],                  // app ids opened (no events fired) when the practice starts: 'files', 'terminal', 'code', …
  vfs: (vfs, os) => { /* seed extra files/folders */ },
  settings: { /* initial computer settings: wallpaper, wifi, volume … */ },
  hardware: true,                          // show the USB / phone panel under the screen
}
```

Paths in lesson data are canonical: `~/Documents` (home-relative), so one lesson works on Windows and Mac. A fresh virtual file system is
created every time a practice starts.

## Card

```ts
{
  id: 'c-click',                 // unique across the module
  type: 'visual',                // 'hook' | 'visual' | 'compare' | 'code'
  textBn: 'একবার **ক্লিক** মানে বেছে নেওয়া।',   // ≤ 25 words (hard 35), ≤ 2 sentences, ≤ 2 **bold** words
  visual: { kind: 'demo', gesture: 'click' },  // REQUIRED
  chipsBn: ['ক্লিক = বাছাই'],     // ≤ 3 chips, each ≤ 4 words
  learnMoreBn: '…',              // any length; opens in a sheet ("আরও জানুন")
  osVariant: 'windows',          // 'windows' | 'mac' | 'both' (default both)
  inputVariant: 'mouse',         // 'mouse' | 'touchpad' | 'both' (default both)
}
```

### `Visual` (every card has exactly one)

| `kind` | fields | use for |
|---|---|---|
| `art` | `name: ArtName`, `captionBn?` | one big illustration (an analogy / object) |
| `flow` | `items: { art, labelBn }[]` (2–4) | input → processing → output |
| `compare` | `left`, `right: { visual: MiniVisual, labelBn, captionBn? }`, `vs?` | Windows vs Mac, before/after, right/wrong |
| `mock` | `name: MockName`, `os?`, `highlight?` (a region of that mock), `captionBn?` | "where is it on the screen" |
| `demo` | `gesture`, `mock?`, `os?`, `keys?`, `textBn?`, `captionBn?` | looping animation of click, double-click, right-click, drag, scroll, type, keys, two-finger-tap, two-finger-scroll |
| `code` | `lang`, `lines: { code, noteBn? }[]` (≤ 6), `output?: string[]`, `browserPreview?` | annotated code with an animated "run" |
| `widget` | `widget: id`, `props?`, `captionBn?` | an interactive "পারেন?" moment (file name in `src/content/widgets/`) |
| `big` | `emoji`, `captionBn?` | fallback; use sparingly |

`ArtName` / `MockName` / mock region names come only from `src/ui/illustrations/names.ts` (the content test fails on unknown
names or regions; browse them at `/#/demo/art`). `MiniVisual` (inside `compare`) is `art`, `mock` or `big`.

### OS and input variants

- `osVariant` on cards, steps and quiz questions filters per learner OS (default OS = `profile.os`, switchable in the deck header).
  Write one Windows and one Mac variant when the UI differs; `'both'` when identical.
- `inputVariant` (`'mouse' | 'touchpad' | 'both'`) is only for gestures that differ by pointing device (right-click, scroll, zoom,
  drag). The device is **detected automatically** (`profile.input`; a touchscreen counts as touchpad), never asked. Steps for the
  other device are neither shown nor counted in progress.
- Quiz questions have no input variants; keep them OS-neutral ("স্টার্ট (Windows) বা লঞ্চপ্যাড (Mac)").

## Step

```ts
{
  id: 'open-start',               // unique within the module (progress is saved by id)
  titleBn: 'স্টার্ট মেনু খুলুন',      // ≤ 7 words
  explanationBn: 'নিচের বাঁ দিকের স্টার্ট বোতামে ক্লিক করুন।',   // the coach line: ≤ 12 words, one action, starts with a verb
  target: 'start-button',          // coach pointer: a data-coach id, or any CSS selector
  expectedAction: { type: 'click', target: 'start-button' },
  hintBn: 'টাস্কবারের একদম বাঁ পাশের আইকনটি দেখুন।',   // after ~10 s idle, ≤ 15 words
  simplerBn: '…',                  // shown by "আমি আটকে গেছি"
  successMessageBn: 'চমৎকার!',     // ≤ 6 words; otherwise a varied praise is picked
  teacherTipBn: '…',               // optional
  osVariant: 'windows',            // 'windows' | 'mac' | 'both'  (required)
  inputVariant: 'mouse',           // optional
}
```

After ~20 s of inactivity the coach offers **"দেখিয়ে দিন"**, which animates the correct action (derived from `expectedAction` + `target`).
A step only advances when the engine observes the matching action. `continue` steps show a "বুঝেছি" button; use them sparingly
(cards replace tours). The first practice step should be a trivial click (the "quick win"; a `demo` card before it counts too).
Don't require typing Bengali in the simulation (her keyboard may not have Bengali yet); ASCII is fine.

### `expectedAction`, GUI actions

| type | fields | completes when |
|---|---|---|
| `click` / `doubleClick` / `rightClick` | `target` | the element with that `data-coach` id receives that gesture |
| `drag` | `target`, `dropTarget` | the target is dropped on the drop target |
| `type` | `target`, `text`, `ignoreCase?` | the field's value equals `text` |
| `keyCombo` | `keys` | e.g. `'mod+c'` (`mod` = Ctrl on Windows, Cmd on Mac), `'alt+tab'`, `'ctrl+shift+esc'` |
| `openApp` / `closeApp` | `app` | app id opened/closed (`explorer`, `finder`, `notepad`, `textedit`, `browser`, `settings`, …) |
| `createFolder` / `createFile` | `name?`, `inPath?` | the virtual file system now has it |
| `rename` | `from?`, `to?` | |
| `move` / `copy` | `name`, `toPath` | |
| `delete` / `restore` | `name` | moved to bin / restored |
| `saveFile` | `name?` | a file was saved |
| `navigate` | `path` | a file manager (or browser) is showing that path/URL |
| `selectOption` | `target`, `value` | a settings/select control got that value |
| `custom` | `event` | a sim/widget emits `engine.emit(event)` |
| `continue` | – | learner presses the "বুঝেছি" button (reading-only steps) |

### Stage-5 actions (terminal / editor / code)

| type | fields | completes when |
|---|---|---|
| `typeCommand` | `command: string \| string[]`, `match?: 'exact' \| 'prefix' \| 'contains'` | she runs that command in the practice terminal (whitespace-normalised, case-sensitive); list several accepted forms |
| `fileExists` | `path`, `kind?: 'file' \| 'folder'` | the path exists in the virtual file system (checked after every event) |
| `fileContains` | `path`, `text` | the file contains the text (e.g. after saving in the editor) |
| `codeOutputEquals` | `output: string \| string[]`, `language?` | the last successful code run printed exactly this (trimmed) |
| `previewContains` | `text` | the live HTML/CSS preview contains this text or markup |
| `predictOutput` | `acceptedAnswers: string[]`, `ignoreCase?` | she typed an accepted answer in the coach bubble (a small input; wrong answers get a gentle nudge) |

State-based actions (`fileExists`, `fileContains`, `previewContains`) are evaluated on every simulator event and re-checked once when
they become the current step, so typing ahead never stalls the coach. Open the tools with `setup.openApps` (`['terminal']`, `['code']`)
and seed files with `setup.vfs`. Point the coach with `target`: terminal ids `terminal-input`, `terminal-output`; editor ids
`code-editor`, `code-run`, `code-save`, `code-tab-<name>`, `code-explorer-<name>`, `code-output`, `code-preview`. The editor also emits
`custom` events `code-saved`, `code-edited`, `code-run-ok`, `code-run-error`. All `data-coach` ids: [SIM_CONTRACT.md](SIM_CONTRACT.md).

## Quiz questions

Exactly 3 per unit. All have `id` (stable!), `questionBn` (≤ 20 words, makes sense without the options), `hintBn` (gentle, shown after a
wrong answer), `explanationBn` (≤ 15 words, shown after the right one), optional `osVariant` (avoid: the question must work for both OSes).
Mix types over a module (at least one `clickTarget` and one `dragMatch`).

| `type` | extra fields |
|---|---|
| `multipleChoice` | `options: {id,textBn}[]`, `correct: string[]`, `multi?` |
| `clickTarget` | `items: {id,labelBn,icon?}[]`, `correct: id` ("click the right thing") |
| `dragMatch` | `pairs: {id,leftBn,rightBn}[]` (drag each right-hand item onto its match) |
| `ordering` | `items` listed in correct order; the UI shuffles |
| `predictOutput` | `code`, `language`, `acceptedAnswers: string[]`, `ignoreCase?` |

One question per screen; a wrong answer never shows a harsh error, it shows the hint and lets her retry. Wrong attempts are recorded
(`wrongByQuestion`); the score of a unit is the number of questions answered right the first time. These feed the teacher dashboard's
"weak topics".

## Progress

`localStorage` key `computer-shikhi:v1` (see `src/state/progress.ts`). Steps are tracked per OS flavor (Windows and Mac independent);
units have `unitsDone` and a quiz result in `unitQuiz[unitId]`; the deck position of a half-finished unit is in
`extras['deck:<module>:<unitId>']`. `explanationRead`, the single `quiz` attempt and `bestQuizScore` are older/derived fields that are
still read and imported so old backups keep working. Export/import is plain JSON from the Settings page.

## What the teacher dashboard reads from a lesson

`src/lib/teacher.ts` (`lessonMetaOf`) reduces each lesson to: the guided step **ids per OS** (for the learner's pointing device), the unit ids,
the quiz questions (`id`, `questionBn`, `hintBn`, all units merged) and the number of real-world tasks. Consequences for authors:

- Keep quiz question ids **stable**; a renamed id shows as "a question that is no longer in the lesson" for old attempts.
- Step ids that no longer exist are ignored in the counts, so renaming a step id resets that step for the learner.
- Write `questionBn` so it makes sense on its own (the teacher sees it without the answer options).

## Rules enforced by tests

`src/content/content.test.ts` (structure) and `scripts/audit-core.ts` / `npm run audit:content` (text budget): unique ids; a `hintBn` and
`explanationBn` on every step; steps for both Windows and Mac; hook + 3–6 cards; exactly 3 quiz questions with hint and explanation; ≤ 3 recap
items; every card has a valid visual (known art/mock names and regions, known widget id); no card over 35 words, more than 2 bold words
or more than 3 chips; every OS × input combination shows ≥ 3 cards, a practice and 3 questions; glossary ids exist; religion-neutral wording.
