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
- Every module is a few short **units**, each a one-card-at-a-time deck: a relatable hook -> 3-6 picture cards ->
  guided practice in the simulator -> a 3-question quiz -> a celebration with "মনে রাখুন" recap chips; real-world
  tasks and an optional teacher tip close the module.
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
│   ├── LESSON_SCHEMA.md      Lesson data format (units, cards, visuals, steps, quiz, action types)
│   ├── UX_CONTRACT.md        UX rules, text budget, design tokens, deck engine and authoring checklist
│   ├── UX_AUTHORING.md       How to write or rewrite a module in the cards format
│   ├── AUTHORING_BRIEF.md    Bengali style, accuracy, step design, shared infrastructure
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
│   ├── engine/               Deck builder (deck.ts), step matching, guided run + coach, quiz grading, roadmap
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
│   ├── ui/                   Layout, dialogs, cards/ (deck slides), quiz/ (question views), illustrations/ (art, mocks, demos), shared components
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
[docs/UX_AUTHORING.md](docs/UX_AUTHORING.md) and [docs/AUTHORING_BRIEF.md](docs/AUTHORING_BRIEF.md): spoken Bengali, "আপনি", religion-neutral wording (never
নমস্কার/সালাম etc.; use "স্বাগতম"), gentle hints, and **every shortcut/menu/command must be real**.

### A. Edit an existing lesson

1. Open `src/content/lessons/mNN.ts` (for example `m02.ts` is the reference module).
2. Change text, edit a card, add a step. Save. The dev server reloads. Look at the card in the browser: nothing may need scrolling.
3. Keep the rules that `npm test` and `npm run audit:content` enforce (see `src/content/content.test.ts` and
   the "UX rules" section below): unique ids, a visual on every card, short text, a `hintBn` and `explanationBn` on every
   step, steps for both Windows and Mac, exactly 3 quiz questions per unit, glossary ids that exist, no religion-specific words.
4. **Step ids are how progress is saved.** If you rename or delete a step id, her saved progress for that step is
   ignored (the Teacher page only counts ids that still exist). Rename ids only when you must.

### B. Add a new lesson (a complete minimal example)

The curriculum has 20 modules; to add module 21, create the file, add a line to `src/content/modules.ts` (section D)
and a glossary file (section C). A lesson is a list of **units**; each unit is one short deck:
hook -> 3-6 cards -> guided steps -> exactly 3 quiz questions -> recap. The example below is one complete minimal unit that shows
**every** feature once: a hook, a card of each visual kind (`art`, `flow`, `compare`, `mock`, `demo`, `code`, `widget`, `big`),
OS and input variants, a GUI step, a terminal step (`typeCommand`), a code step (`codeOutputEquals`), `setup`, `checklist`,
three quiz questions, the recap, real-world tasks and a teacher tip. Field reference: [docs/LESSON_SCHEMA.md](docs/LESSON_SCHEMA.md).
(Real units have 3-6 cards; this one has 8 only to show all visual kinds, so it would be split in a real lesson.)

`src/content/lessons/m21.ts`:

```ts
import type { Lesson } from '../../engine/types'

const lesson: Lesson = {
  module: 21,
  part: 2,
  id: 'm21',
  titleBn: 'নমুনা পাঠ',
  oneLineBn: 'একটি ছোট নমুনা পাঠ, যেখানে সব ধরনের কার্ড আছে।',
  minutes: 6,
  glossaryIds: ['sample-term'],

  units: [
    {
      id: 'sample-unit', // unique in the module; the saved position and quiz result use it
      titleBn: 'ফোল্ডার ও কমান্ড',

      // (1) HOOK: one relatable line (max ~15 words), spoken by the mentor "didi". It needs a visual too.
      hook: {
        id: 'h-folder',
        type: 'hook',
        textBn: 'ফোনের গ্যালারির মতোই কম্পিউটারে ছবি রাখার **ফোল্ডার** আছে!',
        visual: {
          kind: 'compare',
          left: { visual: { kind: 'art', name: 'phone' }, labelBn: 'ফোন', captionBn: 'গ্যালারি' },
          right: { visual: { kind: 'art', name: 'desktop' }, labelBn: 'কম্পিউটার', captionBn: 'ফোল্ডার' },
          vs: 'আর',
        },
      },

      // (2) CARDS: 3-6 per unit, ONE idea each. textBn max ~25 words (hard 35), max 2 **bold** words, max 3 chips.
      // Every card has a visual. Names for art/mock come ONLY from src/ui/illustrations/names.ts (see /#/demo/art).
      cards: [
        {
          id: 'c-art',
          type: 'visual',
          textBn: 'ফোল্ডার হলো আলমারির **তাক** — একই ধরনের ফাইল এক জায়গায়।',
          visual: { kind: 'art', name: 'folder', captionBn: 'ফোল্ডার' },
          chipsBn: ['ফোল্ডার = তাক', 'ফাইল = জিনিস'], // up to 3 chips of 2-3 words
          learnMoreBn: 'যত খুশি লম্বা লেখা চলে — এটি "আরও জানুন" বোতামের পেছনে একটি শিটে খোলে।',
        },
        {
          id: 'c-flow',
          type: 'visual',
          textBn: 'আপনি কিছু **দিলে** কম্পিউটার সেটি ভেবে **ফল** দেখায়।',
          // flow: 2-4 items joined by arrows
          visual: { kind: 'flow', items: [{ art: 'keyboard', labelBn: 'ইনপুট' }, { art: 'chip', labelBn: 'ভাবনা' }, { art: 'monitor', labelBn: 'আউটপুট' }] },
        },
        {
          id: 'c-compare',
          type: 'compare',
          textBn: 'Windows-এ নাম File Explorer, Mac-এ **Finder**।',
          visual: {
            kind: 'compare',
            left: { visual: { kind: 'mock', name: 'file-explorer', os: 'windows' }, labelBn: 'Windows' },
            right: { visual: { kind: 'mock', name: 'finder', os: 'mac' }, labelBn: 'Mac' },
          },
        },
        {
          // OS variant: only Windows learners see this card (write a Mac twin when the UI differs)
          id: 'c-mock-win',
          type: 'visual',
          osVariant: 'windows',
          textBn: 'নিচের বাঁ দিকের **স্টার্ট** বোতামে সব প্রোগ্রাম থাকে।',
          // mock: an annotated mini-screenshot; `highlight` must be a region listed for that mock in names.ts
          visual: { kind: 'mock', name: 'win-desktop', os: 'windows', highlight: 'taskbar' },
        },
        {
          // Input variant: only learners with a mouse (a touchpad twin shows two-finger-tap). The device is auto-detected.
          id: 'c-demo-mouse',
          type: 'visual',
          inputVariant: 'mouse',
          textBn: 'মাউসের **ডান বোতামে** একবার চাপলে মেনু আসে।',
          // demo: a looping 3-4 s animated cursor
          visual: { kind: 'demo', gesture: 'right-click', captionBn: 'ডান বোতামে একবার' },
        },
        {
          id: 'c-code',
          type: 'code',
          textBn: 'এই এক লাইনই কম্পিউটারকে **কথা** বলায়।',
          // code: max 6 lines, a short note per line, optional output lines and browserPreview (for html/css)
          visual: { kind: 'code', lang: 'python', lines: [{ code: 'print("Hello")', noteBn: 'print = পর্দায় দেখাও' }], output: ['Hello'] },
        },
        {
          // widget: an interactive "পারেন?" moment; the id is the file name in src/content/widgets/
          id: 'c-widget',
          type: 'visual',
          textBn: 'এবার নিজে চেষ্টা করুন — পারেন?',
          visual: { kind: 'widget', widget: 'path-explorer', captionBn: 'ফোল্ডার খুঁজুন' },
        },
        { id: 'c-big', type: 'visual', textBn: 'অনেক হলো — এবার হাতে-কলমে!', visual: { kind: 'big', emoji: '🚀' } }, // fallback, use sparingly
      ],

      // (3) STEPS: guided practice. ONE action per step: instruction max ~12 words starting with a verb, hint max ~15, success max ~6.
      setup: { openApps: ['terminal'] }, // starting state of the practice: open apps, extra files via `vfs`, `settings`
      steps: [
        {
          id: 'gui-click', // unique across the whole module; progress is saved by this id
          osVariant: 'windows', // required: 'windows' | 'mac' | 'both'
          titleBn: 'স্টার্টে ক্লিক',
          explanationBn: 'নিচের বাঁ দিকের স্টার্ট বোতামে ক্লিক করুন।', // the coach line
          target: 'start-button', // the data-coach id the coach points at
          expectedAction: { type: 'click', target: 'start-button' },
          hintBn: 'টাস্কবারের একদম বাঁ দিকের আইকনটি দেখুন।', // after ~10 s without a correct action
          simplerBn: 'তীরটি ওই আইকনের ওপর রেখে একবার চাপুন।', // "আমি আটকে গেছি"
          successMessageBn: 'চমৎকার!',
        },
        {
          id: 'gui-click-mac',
          osVariant: 'mac',
          titleBn: 'ডকে Finder-এ ক্লিক',
          explanationBn: 'নিচের ডকের প্রথম আইকনে (Finder) ক্লিক করুন।',
          target: 'dock-files',
          expectedAction: { type: 'click', target: 'dock-files' },
          hintBn: 'ডকের একদম বাঁ দিকের আইকনটি দেখুন।',
        },
        {
          id: 'term-pwd',
          osVariant: 'both',
          titleBn: 'কমান্ড চালান',
          explanationBn: 'টার্মিনালে pwd লিখে Enter চাপুন।',
          target: 'terminal-input',
          // terminal step: accepted spellings; match: 'exact' (default) | 'prefix' | 'contains'
          expectedAction: { type: 'typeCommand', command: ['pwd'] },
          hintBn: 'ছোট হাতের তিনটি অক্ষর p, w, d লিখুন।',
          successMessageBn: 'কমান্ড চলেছে!',
        },
        {
          id: 'code-hello',
          osVariant: 'both',
          titleBn: 'কোড চালান',
          explanationBn: 'Run বোতামে চেপে কোডটি চালান।',
          target: 'code-run',
          // code step: the last successful run must have printed exactly this
          expectedAction: { type: 'codeOutputEquals', output: 'Hello', language: 'python' },
          hintBn: 'কোডের ওপরের সবুজ Run বোতামটি দেখুন।',
        },
        // Other stage-5 actions: fileExists, fileContains, previewContains, predictOutput. All types: docs/LESSON_SCHEMA.md
        // (a unit that opens the code editor would use setup: { openApps: ['code'], vfs: … } instead of the terminal)
      ],
      // optional: ticks appear when ALL listed steps are done (use ids that exist for the learner's OS)
      checklist: [{ id: 'k-term', textBn: 'কমান্ড চালালাম', stepIds: ['term-pwd'] }],

      // (4) QUIZ: EXACTLY 3 questions, valid for both OSes (no OS-only wording). hintBn after a wrong answer, explanationBn after the right one.
      // Types: multipleChoice, clickTarget, dragMatch, ordering, predictOutput. Keep ids stable (the teacher dashboard uses them).
      quiz: [
        {
          id: 'q21-choice',
          type: 'multipleChoice',
          questionBn: 'ফোল্ডারে কী রাখা হয়?',
          options: [
            { id: 'a', textBn: 'ফাইল' },
            { id: 'b', textBn: 'বিদ্যুৎ' },
          ],
          correct: ['a'],
          hintBn: 'আলমারির তাকে কী রাখেন, ভাবুন।',
          explanationBn: 'ফোল্ডারে ফাইল সাজানো থাকে।',
        },
        {
          id: 'q21-click',
          type: 'clickTarget',
          questionBn: 'কোনটি ফোল্ডারের আইকন?',
          items: [
            { id: 'folder', labelBn: 'ফোল্ডার', icon: '📁' },
            { id: 'photo', labelBn: 'ছবি', icon: '🖼️' },
          ],
          correct: 'folder',
          hintBn: 'হলুদ তাকের মতো আইকন খুঁজুন।',
          explanationBn: 'ফোল্ডার-আইকন দেখতে তাকের মতো।',
        },
        {
          id: 'q21-predict',
          type: 'predictOutput',
          questionBn: 'কোডটি পর্দায় কী দেখাবে?',
          code: 'print("Hello")',
          language: 'python',
          acceptedAnswers: ['Hello'],
          hintBn: 'print-এর ভেতরের লেখাটি দেখুন।',
          explanationBn: 'print ভেতরের লেখাটিই দেখায়।',
        },
      ],

      // (5) RECAP "মনে রাখুন": max 3 chips, each max ~8 words
      recapBn: ['ফোল্ডার = ফাইলের তাক', 'pwd = আমি কোথায়', 'print = পর্দায় দেখাও'],
      freeTryBn: 'নিজে একটি নতুন ফোল্ডার বানিয়ে দেখুন।', // optional "পারেন?" challenge
    },
  ],

  // Shown on the module's last celebration screen ("এবার আসল কম্পিউটারে"); learner can tick them. 2-3 safe tasks, max ~18 words.
  realWorld: {
    titleBn: 'এবার আসল কম্পিউটারে চেষ্টা করুন। সবগুলো সম্পূর্ণ নিরাপদ।',
    tasksBn: ['ডেস্কটপে একটি নতুন ফোল্ডার বানান।', 'ফোল্ডারের নাম বদলে নিজের নাম দিন।'],
    windowsTasksBn: ['স্টার্ট বোতাম চেপে File Explorer খুলুন।'],
    macTasksBn: ['ডকের Finder খুলুন।'],
  },

  teacherTipBn: 'এই পাঠ দুই দফায় করতে পারেন। তাড়া দেবেন না।', // hidden behind "শিক্ষকের জন্য"
}

export default lesson
```

Notes on the example:

- A real lesson has 2-4 units like this one (split anything over ~15 steps per OS or 12 deck items; `splitIfLong` and the content test
  complain). Each unit starts a **fresh** simulated computer from its own `setup`; step ids must be unique across the whole module.
- `target` can be a `data-coach` id or any CSS selector. The ids that exist are listed in
  [docs/SIM_CONTRACT.md](docs/SIM_CONTRACT.md) (see "data-coach ids" below).
- Paths in lessons are canonical and OS-neutral: `~/Documents` (home-relative). The same step works for Windows and Mac.
- Shortcuts are written `mod+c` in `keyCombo` actions (`mod` = Ctrl on Windows, Cmd on Mac): `{ type: 'keyCombo', keys: 'mod+c' }`.
- `osVariant` filters cards, steps and questions by the learner's OS; `inputVariant: 'mouse' | 'touchpad'` is only for gestures that
  differ by pointing device (right-click, scroll, zoom, drag) and is matched against the **auto-detected** device, so you never ask her.
- Do not require typing Bengali in the simulation (her keyboard may not have Bengali yet); ASCII text is fine.
- Optional lesson field: `certificatePart: 1 | 2` (completing the module issues that part's certificate).
- Full list of GUI/terminal/code actions and every field: [docs/LESSON_SCHEMA.md](docs/LESSON_SCHEMA.md).

### UX rules and the content audit (`npm run audit:content`)

The learner is a young Bengali woman who will **not** read paragraphs, so the course is built on hard rules
(full text: [PROJECT_BRIEF.md](PROJECT_BRIEF.md) "UX RULES" and [docs/UX_CONTRACT.md](docs/UX_CONTRACT.md)):

- One idea and one visual per card; text <= 25 words (hard cap 35), <= 2 sentences, <= 2 `**bold**` words, <= 3 chips;
  longer detail goes into `learnMoreBn`.
- Steps: one action, <= 12 words, starting with a verb; hint <= 15; success <= 6. Quiz: question <= 20 words, option <= 8,
  explanation <= 15. Recap: <= 3 items of <= 8 words. Glossary meaning <= 18 words, one line.
- Exactly 3 quiz questions per unit, one per screen; a wrong answer shows a gentle hint, never a harsh error.
- A card never needs vertical scrolling (the visual is scaled to fit); one primary button per screen.

`npm run audit:content` measures every card, step, question and recap against these numbers, writes `docs/UX_AUDIT_AFTER.md` and
`docs/ux-audit-after.json`, and **fails (exit 1) on any hard violation**; "tight" items (over the target but under the hard cap) are
listed so you can shorten them. `npm run build` runs it first, so a violating lesson cannot ship. Run it after every content edit,
together with `npx vitest run src/content` (structure: ids, visuals, 3 questions, glossary ids, religion-neutral wording).

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

Each module has `e2e/mNN.spec.ts` that completes **every** guided step of every unit on both Windows and Mac; copy `e2e/module2.spec.ts`
(GUI), `e2e/m17.spec.ts` (terminal) or `e2e/m20.spec.ts` (code editor) and adapt it. The helpers in `e2e/helpers.ts` (documented at the top
of the file): `seedProfile(page, 'windows' | 'mac', { input, modules, extras })` (skips onboarding, unlocks all modules, pins the pointing
device), `openModule(page, n)`, `startUnit(page, i)`, `nextCard(page)`, `skipToPractice(page)`, `coach(page, id)` (an element inside the
simulated computer), `expectPracticeDone(page)` and the quiz helpers (`answerChoice`, `matchPairs`, `orderItems`, `predict`, `checkAnswer`).

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
