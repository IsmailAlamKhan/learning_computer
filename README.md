# কম্পিউটার শিখি — Learn the Computer (Bengali)

An interactive, offline-capable web course that teaches **one adult Bengali-speaking beginner** how to use a computer
(both **Windows 11** and **macOS**) and then prepares her to start programming. Everything is practised inside a safe,
**simulated** desktop in the browser, so nothing she does can break a real computer. Her husband sits beside her as the
teacher and maintains the app (adds or edits lessons, checks progress on the Teacher page).

- **For whom:** a complete beginner who can use a mouse and type a little. All learner-facing text is natural spoken
  Bengali, addressed as "আপনি". Technical terms appear as Bengali + English (e.g. "ফোল্ডার (Folder)").
- **Two parts, 20 modules:** Part 1 (modules 1-13) is computer basics; Part 2 (modules 14-20) is how computers work,
  what programming is, the terminal, tooling, reading tech English, and writing a first HTML/CSS/Python program.
- **Front-end only.** No backend, no login, no analytics, no network requests during use. Progress is stored in the
  browser's `localStorage`, with JSON export/import.

---

## Features

- Simulated Windows 11-style and macOS-style desktops: taskbar/Start, menu bar/Dock/Launchpad/Spotlight, windows you can
  drag, resize and minimise, a File Explorer/Finder, Notepad/TextEdit, Settings, a browser with a simulated mini-internet
  (search, news, recipes, scam pages), a Mail app, Photos, media player, Task Manager/Force Quit, USB drive and printer
  simulation, a practice **terminal** (PowerShell-style and zsh-style) and a **code editor** (CodeMirror) that really
  runs JavaScript and Python (Pyodide) in a sandbox.
- A **coach** that points at the exact thing to click, gives a hint after ~10 s of inactivity and offers "দেখিয়ে দিন"
  (show me) after ~20 s. Steps advance only when the right action actually happens.
- Every module follows the same pattern: explanation -> guided practice -> free practice -> quiz (4-5 questions) ->
  "মনে রাখুন" summary -> real-world tasks -> optional teacher tip.
- Windows and Mac progress are tracked separately; she can switch any time.
- Searchable Bengali glossary (শব্দকোষ), personal **notebook**, printable **cheat sheets**, printable
  **certificates** (end of Part 1 and Part 2), a "what next" roadmap and a printable 30-minute daily habit sheet.
- **Teacher dashboard** (`#/teacher`): overall and per-part progress, per-module status, dates, guided steps done for
  Windows and Mac, quiz scores and retries, weak topics, recent activity, certificates; printable (A4) and downloadable
  as an HTML report or JSON backup.
- Calm, high-contrast design; Noto Sans Bengali; four text sizes; light and dark themes; Bengali or Western numerals;
  keyboard accessible; respects `prefers-reduced-motion`.
- Works offline once loaded (installable PWA).

## Tech stack

React 19 + TypeScript 6 + Vite 8 + Tailwind CSS v4, React Router (`HashRouter`, `base: './'`), CodeMirror 6, Pyodide
(self-hosted, lazy-loaded), `vite-plugin-pwa` (service worker), Vitest + Testing Library (unit/component),
Playwright (end-to-end, using the Chrome installed on your machine), oxlint.

## Quick start

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Open the URL, go through the welcome screens (name, computer type, text size, goal), and start Module 1.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | `tsc -b` (type-check) then `vite build` -> static site in `dist/` (includes the service worker and the 13 MB self-hosted Pyodide) |
| `npm run preview` | Serve `dist/` locally (`npx vite preview --port 4173`) to try the production build |
| `npm test` | Vitest, run once (unit + component tests, including real Pyodide checks) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run e2e` | Playwright end-to-end tests (builds and previews the app itself) |
| `npm run lint` | oxlint |
| `npm run typecheck` | `tsc -b` only |
| `npm run check:privacy` | Scans `src/` and `index.html` for anything that could use the network or a third party (see [docs/PRIVACY.md](docs/PRIVACY.md)) |

## Project structure

```
.
├── PROJECT_BRIEF.md          Non-negotiable rules: language, tone, safety, design, tech, accuracy
├── README.md                 This file
├── docs/
│   ├── LESSON_SCHEMA.md      Lesson data format and every step/quiz action type
│   ├── AUTHORING_BRIEF.md    Rules for writing a module (Bengali style, accuracy, step design)
│   ├── SIM_CONTRACT.md       The simulator contract and the list of data-coach ids
│   ├── RUNNER.md             The sandboxed JS/Python runner
│   ├── ARCHITECTURE.md       How the pieces fit together (read this second)
│   ├── QA_CHECKLIST.md       Manual test checklist for the teacher/tester
│   ├── OFFLINE.md            Installing as an app and offline behaviour
│   ├── PRIVACY.md            What is (not) stored or sent
│   ├── BENGALI_REVIEW.md     Language review notes
│   └── PROGRESS.md           Stage-by-stage build log and decisions
├── e2e/                      Playwright specs (one walkthrough per module + onboarding/progress), helpers.ts
├── public/                   Static files (favicon, PWA icons)
├── src/
│   ├── main.tsx, App.tsx     Entry point and routes
│   ├── index.css             Theme tokens, print rules, coach animations
│   ├── content/              ALL course content (edit here, no engine code)
│   │   ├── modules.ts        The 20-module list (title, part, icon, playable/soon)
│   │   ├── lessons/mNN.ts    One lesson per module (lazy-loaded)
│   │   ├── glossary/mNN.ts   Glossary entries per module (auto-discovered)
│   │   ├── widgets/*.tsx     Interactive explanation widgets (auto-registered)
│   │   └── cheatsheets/*.tsx Printable cheat sheets (auto-registered)
│   ├── engine/               Lesson engine: step matching, guided run + coach, quiz grading, roadmap
│   ├── sim/                  The simulated computer
│   │   ├── bus.ts, vfs.ts, windowManager.ts, DesktopContext.tsx, Frame.tsx, SimStage.tsx
│   │   ├── windows/, mac/    The two desktop shells
│   │   ├── apps/             File manager, text editor, browser (+ sites/), settings, photos, extra/*.tsx (auto-registered)
│   │   ├── terminal/         Practice terminal (PowerShell-style and zsh-style)
│   │   ├── editor/           Code editor with preview
│   │   ├── runner/           Sandboxed JavaScript and Python (Pyodide) execution
│   │   └── devices/          USB, phone, printer, screenshots
│   ├── pages/                Home, Module page, Settings, Teacher, Glossary, Notebook, Certificate, Cheat sheets, Next steps
│   ├── state/                Progress store (localStorage + in-memory fallback) and the React hook
│   ├── lib/                  Pure helpers (numerals, download, notebook, teacher summaries, typing, symbols...)
│   ├── ui/                   Layout, dialogs, quiz runner, help button, shared components
│   └── pwa/                  Service-worker registration and the offline-cache helper
├── scripts/                  check-privacy.mjs, gen-icons.mjs
├── tests/                    Cross-cutting unit tests (privacy guard)
└── vite.config.ts            Vite + Tailwind + PWA + Pyodide copy + Vitest config
```

---

## How to add or edit a lesson

**You never need to touch engine code.** A lesson is one TypeScript data file in `src/content/lessons/`. Authoritative
types are in [`src/engine/types.ts`](src/engine/types.ts); the field reference is
[docs/LESSON_SCHEMA.md](docs/LESSON_SCHEMA.md). Before writing Bengali, read [PROJECT_BRIEF.md](PROJECT_BRIEF.md) and
[docs/AUTHORING_BRIEF.md](docs/AUTHORING_BRIEF.md): spoken Bengali, "আপনি", religion-neutral wording (never
নমস্কার/সালাম etc.; use "স্বাগতম"), gentle hints, and **every shortcut/menu/command must be real**.

### A. Edit an existing lesson

1. Open `src/content/lessons/mNN.ts` (for example `m02.ts` is the reference module).
2. Change text, add a step, add a quiz question. Save. The dev server reloads.
3. Keep the rules that `npm test` enforces (see `src/content/content.test.ts`): unique step and quiz ids, a `hintBn`
   and `explanationBn` on every step, steps for both Windows and Mac, glossary ids that exist, no religion-specific words.
4. **Step ids are how progress is saved.** If you rename or delete a step id, her saved progress for that step is
   ignored (the Teacher page only counts ids that still exist). Rename ids only when you must.

### B. Add a new lesson (a complete minimal example)

The curriculum has 20 modules; to add module 21, create the file, add a line to `src/content/modules.ts` (section D)
and a glossary file (section C). The example below shows **every** feature once: explanation blocks, a GUI step,
a terminal step (`typeCommand`), code steps (`codeOutputEquals`, `fileContains`, `previewContains`, `predictOutput`),
all five quiz question types, summary, real-world tasks, teacher tip, chapters, `setup.openApps` and `setup.vfs`.

`src/content/lessons/m21.ts`:

```ts
import type { Lesson, SimSetup } from '../../engine/types'

/** Put files into ~/coding (the Code Editor's default folder). Never overwrite existing ones. */
const seed =
  (files: Record<string, string>): NonNullable<SimSetup['vfs']> =>
  (vfs) => {
    const folder = vfs.child(vfs.home, 'coding') ?? vfs.mkdir(vfs.home, 'coding')
    for (const [name, content] of Object.entries(files)) if (!vfs.child(folder, name)) vfs.createFile(folder, name, content)
  }

const lesson: Lesson = {
  module: 21,
  part: 2,
  id: 'm21',
  titleBn: 'নমুনা পাঠ',
  oneLineBn: 'একটি ছোট নমুনা পাঠ, যেখানে সব ধরনের ধাপ আছে।',
  minutes: 6,
  simulation: 'desktop',
  glossaryIds: ['sample-term'],

  // (1) Explanation: p, analogy, list, note, widget, code
  explanation: [
    { kind: 'p', textBn: 'ফোল্ডার (Folder) হলো ফাইল রাখার একটি জায়গা।' },
    { kind: 'analogy', textBn: 'ফোল্ডার হলো আলমারির তাকের মতো — প্রতিটি তাকে একই ধরনের জিনিস সাজানো থাকে।' },
    { kind: 'list', itemsBn: ['প্রথম কথা', 'দ্বিতীয় কথা'] },
    { kind: 'note', textBn: 'আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে।' },
    // a widget from src/content/widgets/<id>.tsx (file name = widget id)
    { kind: 'widget', widget: 'path-explorer' },
    { kind: 'code', code: 'print("Hello")', language: 'python' },
  ],

  steps: [], // empty because this lesson uses chapters (below)

  // (2) Guided practice, split into independent micro-lessons. Each chapter starts a FRESH simulated computer.
  chapters: [
    {
      id: 'gui',
      titleBn: 'ক: ক্লিক করা',
      introBn: 'ডেস্কটপের একটি আইকনে ক্লিক করব।',
      steps: [
        {
          id: 'gui-click', // unique in the whole module; progress is saved by this id
          osVariant: 'windows', // 'windows' | 'mac' | 'both'
          titleBn: 'স্টার্ট বোতামে ক্লিক',
          explanationBn: 'নিচের বাঁ দিকের স্টার্ট (Start) বোতামে একবার ক্লিক করুন।',
          target: 'start-button', // the data-coach id the coach points at
          expectedAction: { type: 'click', target: 'start-button' },
          hintBn: 'টাস্কবারের একদম বাঁ দিকের আইকনটি দেখুন।', // shown after ~10 s without a correct action
          simplerBn: 'মাউসের তীরটি ওই আইকনের ওপর রেখে বাঁ বোতামে একবার চাপুন।', // "আমি আটকে গেছি"
          teacherTipBn: 'হাত কাঁপলে একটু সময় দিন।', // optional
        },
        {
          id: 'gui-click-mac',
          osVariant: 'mac',
          titleBn: 'ডকে Finder-এ ক্লিক',
          explanationBn: 'নিচের ডকে প্রথম আইকনটিতে (Finder) একবার ক্লিক করুন।',
          target: 'dock-files',
          expectedAction: { type: 'click', target: 'dock-files' },
          hintBn: 'পর্দার নিচের আইকনের সারিটি দেখুন।',
        },
      ],
    },
    {
      id: 'terminal',
      titleBn: 'খ: টার্মিনালে কমান্ড',
      steps: [
        {
          id: 'term-pwd',
          osVariant: 'both',
          titleBn: 'আমি এখন কোথায়? — pwd',
          explanationBn: 'টার্মিনালে pwd লিখে Enter চাপুন।',
          target: 'terminal-input',
          // accepted forms; whitespace-normalised and case-sensitive. match: 'exact' (default) | 'prefix' | 'contains'
          expectedAction: { type: 'typeCommand', command: ['pwd', 'Get-Location'] },
          hintBn: 'ছোট হাতের অক্ষরে p, w, d লিখুন।',
        },
      ],
      setup: { openApps: ['terminal'] }, // open this app when the chapter starts
    },
    {
      id: 'code',
      titleBn: 'গ: কোড লেখা ও চালানো',
      steps: [
        {
          id: 'code-run',
          osVariant: 'both',
          titleBn: 'প্রোগ্রামটি চালান',
          explanationBn: 'Run বোতাম চাপুন। hello.py-র ফল নিচে দেখা যাবে।',
          target: 'code-run',
          // exact (trimmed) output of the last successful run; use an array for several accepted outputs
          expectedAction: { type: 'codeOutputEquals', output: 'Hello, Rumi', language: 'python' },
          hintBn: 'Run বোতামটি কোড-এডিটরের ওপরে আছে।',
        },
        {
          id: 'code-predict',
          osVariant: 'both',
          titleBn: 'আগে অনুমান করুন',
          explanationBn: 'print("a" + "b") চালালে কী ছাপা হবে? কোচের বাক্সে লিখুন।',
          target: 'code-editor',
          expectedAction: { type: 'predictOutput', acceptedAnswers: ['ab'], ignoreCase: false },
          hintBn: 'দুটি লেখা জোড়া লাগে।',
        },
        {
          id: 'code-save',
          osVariant: 'both',
          titleBn: 'সেভ করুন',
          explanationBn: 'Windows-এ Ctrl+S, Mac-এ Cmd+S চাপুন।',
          target: 'code-save',
          // checked after every event: the virtual file must contain the text (canonical path, ~ = home)
          expectedAction: { type: 'fileContains', path: '~/coding/hello.py', text: 'Hello' },
          hintBn: 'Save বোতামেও চাপতে পারেন।',
        },
        {
          id: 'code-preview',
          osVariant: 'both',
          titleBn: 'ওয়েবপেজের প্রিভিউ',
          explanationBn: 'index.html খুলে <h1>Hello</h1> লিখুন; প্রিভিউয়ে শিরোনাম দেখা যাবে।',
          target: 'code-editor',
          expectedAction: { type: 'previewContains', text: '<h1>Hello</h1>' },
          hintBn: 'ট্যাগ খোলা আর বন্ধ করতে ভুলবেন না।',
        },
        // other useful actions: { type: 'fileExists', path: '~/coding/notes.txt', kind: 'file' }, { type: 'continue' } (reading step)
      ],
      // open the editor and seed a file
      setup: { openApps: ['code'], vfs: seed({ 'hello.py': 'print("Hello, Rumi")\n', 'index.html': '<html>\n<body>\n\n</body>\n</html>\n' }) },
      // optional checklist shown above the simulator; an item ticks when all its stepIds are done
      checklist: [{ id: 'c1', textBn: 'প্রোগ্রাম চালানো ও সেভ করা', stepIds: ['code-run', 'code-save'] }],
    },
  ],

  // (3) Free practice (self-ticked checklist is optional)
  freePractice: {
    titleBn: 'নিজে করুন',
    instructionBn: 'নিজের মতো করে একটি ফোল্ডার বানিয়ে দেখুন। কোনো তাড়া নেই।',
    checklistBn: ['একটি ফোল্ডার বানালাম', 'ফোল্ডারের নাম বদলালাম'],
  },

  // (4) Quiz: 3-5 questions, several types. hintBn is shown after a wrong answer, explanationBn after the right one.
  quiz: [
    {
      id: 'q-mc', type: 'multipleChoice', multi: false,
      questionBn: 'ফোল্ডার কীসের জন্য?',
      options: [{ id: 'a', textBn: 'ফাইল সাজিয়ে রাখার জন্য' }, { id: 'b', textBn: 'গান শোনার জন্য' }],
      correct: ['a'],
      hintBn: 'আলমারির তাকের কথা ভাবুন।',
      explanationBn: 'ঠিক! ফোল্ডারে ফাইল সাজিয়ে রাখা হয়।',
    },
    {
      id: 'q-click', type: 'clickTarget',
      questionBn: 'কোনটি স্টার্ট বোতাম?',
      items: [{ id: 'start', labelBn: 'Start', icon: '🪟' }, { id: 'clock', labelBn: 'ঘড়ি', icon: '🕒' }],
      correct: 'start',
      hintBn: 'টাস্কবারের বাঁ দিকে দেখুন।',
      explanationBn: 'স্টার্ট বোতাম থেকে প্রোগ্রাম খোলা যায়।',
    },
    {
      id: 'q-match', type: 'dragMatch',
      questionBn: 'মিলিয়ে দিন।',
      pairs: [{ id: 'p1', leftBn: 'pwd', rightBn: 'এখন কোথায় আছি' }, { id: 'p2', leftBn: 'ls', rightBn: 'কী কী আছে' }],
      hintBn: 'প্রতিটি কমান্ডের কাজ মনে করুন।',
      explanationBn: 'pwd জায়গা দেখায়, ls তালিকা দেখায়।',
    },
    {
      id: 'q-order', type: 'ordering', // items listed in the CORRECT order; the UI shuffles them
      questionBn: 'সঠিক ক্রমে সাজান।',
      items: [{ id: 'o1', textBn: 'ফোল্ডার বানান' }, { id: 'o2', textBn: 'ফাইল বানান' }, { id: 'o3', textBn: 'সেভ করুন' }],
      hintBn: 'আগে জায়গা, তারপর জিনিস।',
      explanationBn: 'আগে ফোল্ডার, তারপর তার ভেতরে ফাইল।',
    },
    {
      id: 'q-predict', type: 'predictOutput',
      questionBn: 'এই কোড চালালে কী ছাপা হবে?',
      code: 'print(2 + 3)', language: 'python',
      acceptedAnswers: ['5'],
      hintBn: 'যোগ করে দেখুন।',
      explanationBn: '২ আর ৩ যোগ করলে ৫ হয়।',
      osVariant: 'both', // optional: restrict a question to one OS with 'windows' | 'mac'
    },
  ],

  // (5) "মনে রাখুন"
  summaryCard: { titleBn: 'মনে রাখুন', pointsBn: ['ফোল্ডারে ফাইল সাজানো থাকে।', 'ভুল হলে আবার চেষ্টা করা যায়।'], extraBn: 'আস্তে আস্তে হলেই চলবে।' },

  // (6) "এবার আসল কম্পিউটারে চেষ্টা করুন": 2-3 SAFE tasks, plus optional per-OS lists
  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন',
    tasksBn: ['ডেস্কটপে একটি নতুন ফোল্ডার বানান।', 'ফোল্ডারের নাম বদলে নিজের নাম দিন।'],
    windowsTasksBn: ['স্টার্ট বোতাম চেপে File Explorer খুলুন।'],
    macTasksBn: ['ডকের Finder খুলুন।'],
  },

  // (7) "শিক্ষকের জন্য"
  teacherTipBn: 'এই পাঠ দুই দফায় করতে পারেন। তাড়া দেবেন না।',
}

export default lesson
```

Notes on the example:

- `target` can be a `data-coach` id or any CSS selector. The ids that exist are listed in
  [docs/SIM_CONTRACT.md](docs/SIM_CONTRACT.md) (see "data-coach ids" below).
- Paths in lessons are canonical and OS-neutral: `~/Documents` (home-relative). The same step works for Windows and Mac.
- Shortcuts are written `mod+c` in `keyCombo` actions (`mod` = Ctrl on Windows, Cmd on Mac): `{ type: 'keyCombo', keys: 'mod+c' }`.
- A lesson with plain `steps` (no chapters) is also fine: put the steps in `steps`, use `setup` at the top level, and
  omit `chapters`. Aim for 3-7 minutes (about 10-18 steps per OS); longer content belongs in chapters or the free-practice list.
- Do not require typing Bengali in the simulation (her keyboard may not have Bengali yet); ASCII text is fine.
- Optional lesson fields: `checklist` (top-level, like the chapter one), `certificatePart: 1 | 2` (completing the lesson issues that part's certificate).
- Full list of GUI/terminal/code actions: [docs/LESSON_SCHEMA.md](docs/LESSON_SCHEMA.md).

### C. Glossary entries

`src/content/glossary/m21.ts` (one file per module; any file named `m*.ts` is auto-discovered):

```ts
import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  {
    id: 'sample-term', // referenced from the lesson's glossaryIds; must be unique across ALL modules
    termBn: 'নমুনা শব্দ',
    termEn: 'Sample Term',
    meaningBn: 'এক-দুই বাক্যে সহজ ভাষায় অর্থ।',
    module: 21, // module that introduces it
  },
]

export default entries
```

The glossary is the source of truth for Bengali terms: use the same Bengali word everywhere.

### D. Make the module playable (and its position in the roadmap)

Open `src/content/modules.ts`. For an existing module change `status: 'soon'` to `status: 'playable'`. For a new one add
a line:

```ts
{ module: 21, part: 2, icon: '🧪', titleBn: 'নমুনা পাঠ', oneLineBn: 'একটি ছোট নমুনা পাঠ।', status: 'playable' },
```

Rules: a `playable` module must have a lesson file (and vice versa; `content.test.ts` checks this). A module unlocks when
the previous playable module is completed; the teacher can open all in **Settings -> সব পাঠ খুলে দিন**. Modules still
marked `'soon'` show "শীঘ্রই আসছে" and are skipped by the unlock rule. Note: the UI text in "Part 1: 13 modules,
Part 2: 7 modules" and the certificate pages (`src/pages/Certificate.tsx`, which are tied to modules 13 and 20) assume the
current 20-module layout.

### E. Widgets (interactive explanation pieces)

Create `src/content/widgets/<widget-id>.tsx` with a default-exported React component. It is registered automatically (and
code-split); reference it from a lesson with `{ kind: 'widget', widget: '<widget-id>', props: { ... } }`.

```tsx
// src/content/widgets/click-counter.tsx
import { useState } from 'react'

export default function ClickCounter(props: Record<string, unknown>) {
  const [n, setN] = useState(0)
  const label = typeof props.label === 'string' ? props.label : 'ক্লিক করুন'
  return (
    <div className="card space-y-2">
      <button className="btn" onClick={() => setN(n + 1)}>{label}</button>
      <p aria-live="polite">এ পর্যন্ত {n} বার ক্লিক করেছেন।</p>
    </div>
  )
}
```

Use `className="btn"`/`"card"` and the CSS variables from `src/index.css` so it matches the theme (light/dark). Keep
touch targets >= 48 px. **Never put `*.test.tsx` files in the root of an auto-globbed folder** (`widgets/`, `cheatsheets/`,
`sim/apps/extra/`, `sim/apps/browser/sites/`); put tests in a `__tests__/` subfolder.

### F. Cheat sheets (printable, A4)

Create `src/content/cheatsheets/<id>.tsx` that default-exports `{ id, titleBn, Component }`; it appears in
**চিট শিট** and prints cleanly (tables get borders in print):

```tsx
import type { CheatSheet } from './index'

function Component() {
  return (
    <table>
      <tbody>
        <tr><th scope="row">pwd</th><td>এখন কোন ফোল্ডারে আছি দেখায়</td></tr>
      </tbody>
    </table>
  )
}

const sheet: CheatSheet = { id: 'my-sheet', titleBn: 'আমার চিট শিট', Component }
export default sheet
```

### G. Simulated apps and websites

- **A new app window:** create `src/sim/apps/extra/<name>.tsx` exporting `register()`; it is called automatically.
  Use `registerApp({ id, title: (os) => '...', descriptionBn, icon, component, defaultSize })`
  (see `calcplus.tsx` or `codeeditor.tsx`). Open it in a lesson via `setup.openApps: ['<id>']` or an `openApp` step.
- **A simulated website for the browser:** drop `src/sim/apps/browser/sites/<name>.tsx` that calls `registerSite(...)`
  at import time (see `rannaghor.tsx`). Use fictional `.example` addresses only. Real network requests are never allowed.
- **A system keyboard shortcut** (Task Manager, screenshots...): call `registerSystemShortcut(os, combo, handler)` from a module
  inside `src/sim/apps/extra/`.
- Rules for anything in the simulator: UI text in English exactly as a real English OS shows it; Bengali only in coach
  text/tooltips; no logos or trademarked artwork (use `src/sim/ui/icons.tsx`); every clickable thing a lesson might point
  at needs a `data-coach` id; file operations go through the `VirtualFileSystem` so they reach the event bus. Details:
  [docs/SIM_CONTRACT.md](docs/SIM_CONTRACT.md).

### H. `data-coach` ids

The coach finds elements by their `data-coach` attribute. Examples: `start-button`, `taskbar-app-files`, `dock`,
`dock-files`, `icon-<visible name>`, `fm-item-<name>`, `win-<app>-close`, `terminal-input`, `code-editor`, `code-run`,
`code-explorer-<file>`. The full list is in [docs/SIM_CONTRACT.md](docs/SIM_CONTRACT.md) (GUI) and
[docs/LESSON_SCHEMA.md](docs/LESSON_SCHEMA.md) (terminal/editor). To make a new element targetable, add
`data-coach="my-id"` to it; clicks, double clicks, right clicks and typing on `[data-coach]` elements are captured
automatically by the simulator frame. If a step cannot find its target, the coach simply shows the bubble without a ring,
so always check each step with the walkthrough below.

### I. Walk the lesson in a real browser (Playwright)

Each module has `e2e/mNN.spec.ts` that completes **every** guided step on both Windows and Mac; copy `e2e/module2.spec.ts`
(GUI) or `e2e/m17.spec.ts` (terminal) or `e2e/m20.spec.ts` (code editor) and adapt it. Helpers in `e2e/helpers.ts`:
`seedProfile(page, 'windows' | 'mac')` (skips onboarding and unlocks all modules), `startGuided(page, n)`, `coach(page, id)`,
`cont(page)` (the "বুঝেছি, পরের ধাপ" button).

```bash
PW_PORT=4301 PW_OUTDIR=/tmp/dist-m21 npx playwright test e2e/m21.spec.ts
```

---

## Testing

```bash
npm test                       # all unit/component tests (about a minute; includes real Pyodide)
npx vitest run src/lib         # a folder or a single file
npm run typecheck              # tsc -b
npm run lint
npm run e2e                    # all Playwright specs (many minutes)
```

- **Playwright uses the Chrome installed on your computer** (`channel: 'chrome'`), so no browser download is needed.
  To use Playwright's bundled Chromium instead, run `npx playwright install chromium` and set `PW_CHANNEL=` (empty).
- **Parallel runs:** the config reads two environment variables so several people/agents can run at the same time
  without clashing: `PW_PORT` (preview-server port, default 4173) and `PW_OUTDIR` (build folder, default `dist`;
  results go to `<outdir>-results`). Always set both when something else may be running, for example
  `PW_PORT=4233 PW_OUTDIR=/tmp/dist-mine npx playwright test e2e/onboarding.spec.ts`.
- The Playwright web server builds the app (`vite build`) before serving it, so e2e always tests the production build.
- A few Part 1 specs (modules 8 and 12 on Mac) are occasionally slow under CPU load; the config uses 2 workers and 1 retry.
- Content integrity (`src/content/content.test.ts`) fails if a lesson breaks the rules in section B.

## Build and deploy for free

`npm run build` produces a fully static site in `dist/`. Because the app uses **`HashRouter`** (URLs look like
`https://host/#/module/2`) and Vite is configured with **`base: './'`** (relative asset paths), there are **no rewrite
or redirect rules to configure**, and the site works from any sub-path (for example `https://user.github.io/learning_computer/`)
or even from a folder of files. HTTPS is needed for the service worker/installable app (all the hosts below provide it;
`localhost` also counts).

### Netlify

- **Drag and drop:** run `npm run build`, open <https://app.netlify.com/drop> and drop the `dist` folder.
- **From Git:** "Add new site" -> "Import an existing project", pick the repository, set **Build command** `npm run build`
  and **Publish directory** `dist`. (Netlify reads Node from `.nvmrc`/`NODE_VERSION`; use Node 20.19+ or 22.12+.)

### Vercel

"Add New -> Project", import the repository. Vercel detects **Vite**: Framework Preset `Vite`, Build Command
`npm run build`, Output Directory `dist`. Deploy.

### GitHub Pages

1. Push the repository to GitHub. In **Settings -> Pages**, set **Source** to **GitHub Actions**.
2. Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The app is then at `https://<user>.github.io/<repository>/`. Nothing else is needed (no `404.html` trick, no `base`
change) because of `HashRouter` + `base: './'`. Any other static host (Cloudflare Pages, an S3 bucket, a school web
server, a USB stick opened through a tiny local server) works the same way: publish the contents of `dist/`.

### After deploying

Open the site, finish onboarding, and let it sit for a minute: the app stores its own files, and the 13 MB Python engine
is fetched in the background after the first load (running one Python example in Module 20 also stores it). Then switch
the network off and reload to confirm the offline mode (next section).

## Installing as an offline app

The site is a PWA: after the **first visit with internet** (the files are cached then), it works with no connection and
can be installed so it opens like a normal app in its own window.

- **Chrome or Edge (Windows, Mac, Android):** open the site, click the **install icon** at the right end of the address
  bar (a small monitor/plus icon), then **Install**. Or menu -> "Install ..." / "Apps -> Install this site as an app".
- **Safari on Mac (Sonoma or newer):** open the site, then **File -> Add to Dock**.
- **Safari on iPhone/iPad:** Share -> **Add to Home Screen**.
- **Firefox (desktop)** does not install web apps but still works offline from its cache while the tab is used normally.

**How to confirm it works offline:** (1) open the site once while online and wait until the page has loaded fully (for
Python lessons, wait a minute or run one Python example so the Python engine is stored too); (2) turn off Wi-Fi (or Chrome DevTools ->
Network -> "Offline"); (3) reload the page or open the installed app. The home page and lessons should still open and
all practice should work. Progress is saved either way.

**First load needs internet once.** Details and troubleshooting: [docs/OFFLINE.md](docs/OFFLINE.md). What is stored and
what is never sent: [docs/PRIVACY.md](docs/PRIVACY.md).

## Backing up her progress

Progress lives only in this browser's `localStorage` (key `computer-shikhi:v1`). Clearing browser data, using a
private window, or opening the app on another computer starts fresh. So:

- **Settings -> "⬇ ব্যাকআপ নামান"** downloads `computer-shikhi-backup-YYYY-MM-DD.json`; **"⬆ ব্যাকআপ ফিরিয়ে আনুন"**
  restores one. A file that is not a valid backup is rejected with a gentle message and nothing changes.
- The **Teacher page** (`#/teacher`) has the same JSON backup button plus a readable HTML report to keep or print.
- Back up regularly (for example every Friday) and keep the file on a pen drive or in your email.
- If the browser blocks storage entirely, the app still works in memory and says so on the Settings page.

## Accessibility

Designed toward WCAG AA: high-contrast light and dark themes, four text sizes (18/20/23/26 px root), Noto Sans Bengali
with correct যুক্তাক্ষর rendering, controls at least 48 px (36 px inside the simulated OS), visible focus outlines,
full keyboard operation (with an on-screen shortcut pad for combos the browser swallows such as Alt+Tab), no
colour-only status (symbols and words accompany colour), tables with captions and header scopes, `aria-live` for
feedback, `prefers-reduced-motion` respected, wrong answers answered with gentle hints. Screen-reader use has had
light testing only; see [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) for what to verify by hand.

## Privacy

No account, no tracking, no analytics, no third-party requests. The page's Content-Security-Policy allows only its own
origin. The only data (name, computer type, goal, progress, notes) stays in this browser. Code typed in the practice
editor runs in a sandbox with network APIs removed. The only network traffic is the browser downloading the site's own
files the first time. See [docs/PRIVACY.md](docs/PRIVACY.md).

## Known limitations and ideas

- The simulator is a teaching model, not a real OS: menus not needed by a lesson are display-only; the Mac green button
  zooms rather than entering full-screen; guided practice always restarts from step 1 on reload (the *progress* is
  remembered, the simulated computer's state is not).
- Some Part 1 lessons are longer than the 3-7 minute target (modules 4, 6, 10, 11); their teacher tips suggest two sittings.
  Candidates for splitting.
- Python runs in the browser (Pyodide ~13 MB, downloaded once); the first run takes about 1-2 seconds. Only the standard
  library is available.
- UI of real operating systems changes between versions; lessons say "আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে".
  Re-verify shortcuts and menu names when new Windows/macOS versions arrive.
- A native-speaker proofreading pass is still advisable (see `docs/BENGALI_REVIEW.md`, e.g. the Module 2 wording of
  "কন্ট্রোল সেন্টার" and "সিস্টেম ট্রে").
- Ideas for future modules: spreadsheets and documents (Word-processor basics), video calls, online forms and government
  services, photo editing, Git and GitHub basics, a Python mini-project series, JavaScript in the browser, databases
  basics, a "build your own web page and publish it" capstone, and a teacher-authored "my own checklist" feature.

## License

License: _to be decided by the maintainer_ (placeholder). Until a license file is added, all rights are reserved by the
author. Fonts come from `@fontsource` (SIL Open Font License); Pyodide is MPL-2.0; CodeMirror is MIT.
