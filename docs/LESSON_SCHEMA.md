# Lesson schema

Lessons are plain TypeScript data files in `src/content/lessons/mNN.ts` (m01 … m20), each with
`export default lesson satisfies Lesson`. The authoritative types are in
[`src/engine/types.ts`](../src/engine/types.ts). **No engine code is needed to add or edit a lesson.**

Glossary entries live in `src/content/glossary/mNN.ts` (`export default GlossaryEntry[]`); both folders are
auto-discovered with `import.meta.glob`. A module appears as playable on the roadmap once its
`status` in `src/content/modules.ts` is `'playable'`.

All learner-facing text fields end in `Bn` and must be natural spoken Bengali (চলিত), "আপনি" form.
Technical terms: Bengali + English as seen on screen, e.g. `ফোল্ডার (Folder)`.

## Lesson

| field | type | notes |
|---|---|---|
| `module` | 1..20 | module number |
| `part` | 1 \| 2 | |
| `id` | string | `m02` style |
| `titleBn`, `oneLineBn` | string | |
| `minutes` | number | 3–7 |
| `explanation` | `ExplanationBlock[]` | section (1): `p`, `analogy`, `list`, `note`, `widget`, `code` |
| `steps` | `Step[]` | section (2): guided practice. `osVariant` filters per OS |
| `freePractice` | `FreePractice` | section (3): sandbox with an instruction + optional self-tick checklist |
| `quiz` | `QuizQuestion[]` | section (4): 3–5 questions |
| `summaryCard` | `SummaryCard` | section (5): "মনে রাখুন" |
| `realWorld` | `RealWorldTasks` | section (6): "এবার আসল কম্পিউটারে চেষ্টা করুন" (2–3 tasks; optional per-OS lists) |
| `teacherTipBn` | string | section (7): "শিক্ষকের জন্য" |
| `glossaryIds` | string[] | glossary ids introduced in this lesson |
| `simulation` | `'desktop' \| 'terminal' \| 'editor' \| 'none' \| 'custom'` | which simulator hosts the steps |

## Step

```ts
{
  id: 'open-start',               // unique within the lesson (progress is saved by id)
  titleBn: 'স্টার্ট মেনু খুলুন',
  explanationBn: 'নিচের বাঁ দিকের স্টার্ট বোতামে একবার ক্লিক করুন।',
  target: 'start-button',          // coach pointer: a data-coach id, or any CSS selector
  expectedAction: { type: 'click', target: 'start-button' },
  hintBn: 'টাস্কবারের একদম বাঁ পাশের চারকোনা আইকনটি দেখুন।',   // after ~10s idle
  simplerBn: '…',                  // shown by "আমি আটকে গেছি"
  successMessageBn: 'চমৎকার!',     // optional; otherwise a varied praise is picked
  teacherTipBn: '…',               // optional
  osVariant: 'windows',            // 'windows' | 'mac' | 'both'
}
```

After ~20s of inactivity the coach offers **"দেখিয়ে দিন"**, which animates the correct action
(derived from `expectedAction` + `target`). A step only advances when the engine observes the matching action.

### `expectedAction`

Stage 1–4 actions (GUI):

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
| `continue` | – | learner presses "পরের ধাপ" (for reading-only steps) |

Stage 5+ actions (terminal/code) are appended to this table in the stage that adds them.

## Quiz questions

All have `id`, `questionBn`, `hintBn` (gentle, shown after a wrong answer), `explanationBn` (shown after answering),
optional `osVariant`.

| `type` | extra fields |
|---|---|
| `multipleChoice` | `options: {id,textBn}[]`, `correct: string[]`, `multi?` |
| `clickTarget` | `items: {id,labelBn,icon?}[]`, `correct: id` ("click the right thing") |
| `dragMatch` | `pairs: {id,leftBn,rightBn}[]` (drag each right-hand item onto its match) |
| `ordering` | `items` listed in correct order; the UI shuffles |
| `predictOutput` | `code`, `language`, `acceptedAnswers: string[]`, `ignoreCase?` |

A wrong answer never shows a harsh error: it shows the hint and lets her retry. Retries are recorded
(`wrongByQuestion`) for the teacher dashboard's "weak topics".

## Progress

`localStorage` key `computer-shikhi:v1` (see `src/state/progress.ts`). Steps are tracked per OS flavor,
so Windows and Mac progress are independent. Export/import is plain JSON from the Settings page.

## Coach behaviour (engine)

- A step shows a speech bubble pointing at `target` (highlight ring + animated cursor). The step advances **only** when
  the simulator reports the matching event (`src/engine/actions.ts` → `matchAction`).
- ~10 s without a learner action → `hintBn` appears. ~20 s → a **"দেখিয়ে দিন"** button animates the correct action
  (click / double click / right click / drag / typing / keycaps). "আমি আটকে গেছি" swaps in `simplerBn`.
- `continue` steps show a "বুঝেছি, পরের ধাপ" button and are used for tours.
- Steps with `osVariant` other than the learner's current OS are skipped. Write one Windows and one Mac variant of a
  step when the UI differs; use `both` when identical.
- All `data-coach` ids are listed in [SIM_CONTRACT.md](SIM_CONTRACT.md). Paths in lesson data are canonical:
  `~/Documents` (home-relative) so the same lesson works on Windows and Mac.
- Keyboard shortcuts: write `mod+c`; `mod` is Ctrl on Windows and Cmd on Mac. Real keys and the on-screen
  "শর্টকাট প্যাড" (for combos browsers swallow, like Alt+Tab) both count.
- Lesson text must be religion-neutral (no নমস্কার/সালাম etc.).

## Stage 5 action types (terminal / editor / code)

| type | fields | completes when |
|---|---|---|
| `typeCommand` | `command: string \| string[]`, `match?: 'exact' \| 'prefix' \| 'contains'` | she runs that command in the practice terminal (whitespace-normalised, case-sensitive); list several accepted forms |
| `fileExists` | `path`, `kind?: 'file' \| 'folder'` | the path exists in the virtual file system (checked after every event) |
| `fileContains` | `path`, `text` | the file contains the text (e.g. after saving in the editor) |
| `codeOutputEquals` | `output: string \| string[]`, `language?` | the last successful code run printed exactly this (trimmed) |
| `previewContains` | `text` | the live HTML/CSS preview contains this text or markup |
| `predictOutput` | `acceptedAnswers: string[]`, `ignoreCase?` | she typed an accepted answer in the coach bubble (shown as a small input; wrong answers get a gentle nudge, never a red error) |

State-based actions (`fileExists`, `fileContains`) are evaluated on every simulator event, so the step completes right after the
file is created/saved. Use `target` to point the coach at the terminal (`terminal-input`) or editor (`code-editor`, `code-run`, `code-save`).
Terminal ids: `terminal-input`, `terminal-output`; editor ids: `code-editor`, `code-run`, `code-save`, `code-tab-<name>`, `code-explorer-<name>`, `code-output`, `code-preview`.

## Chapters (micro-lessons)

A long module can be split into independent chapters: `chapters: [{ id, titleBn, introBn?, steps, setup?, checklist? }]` (leave `steps: []`).
The guided section then shows a list of chapters; each chapter starts a fresh simulated computer using its own `setup`, so
steps never depend on a previous chapter's state. The module counts as "hands-on done" when every chapter's steps (for the
learner's OS) are completed. Step ids must be unique across the whole module. Module 20 uses chapters.
