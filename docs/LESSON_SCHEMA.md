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
