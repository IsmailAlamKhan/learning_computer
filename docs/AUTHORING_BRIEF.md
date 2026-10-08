# Authoring brief for lesson modules

Read first: `PROJECT_BRIEF.md` (non-negotiable rules), `docs/LESSON_SCHEMA.md`, `docs/SIM_CONTRACT.md`,
and study `src/content/lessons/m02.ts` + `src/content/glossary/m02.ts` — **match that structure and quality exactly**.

## What you deliver per module
1. `src/content/lessons/mNN.ts` (default export `Lesson`) — explanation blocks, steps for BOTH Windows (`osVariant:'windows'`) and Mac (`'mac'`) (use `'both'` only when truly identical), free practice, quiz of 4–5 questions (use several types; at least one OS-specific question only if needed), summary card, real-world tasks (2–3, safe), teacher tip, `glossaryIds`, optional `setup` (open windows, extra files, settings).
2. `src/content/glossary/mNN.ts` — every new term: `termBn` (Bengali), `termEn`, `meaningBn` (1–2 simple sentences). Glossary is the source of truth: use the same Bengali term everywhere.
3. New widgets in `src/content/widgets/<widget-id>.tsx` (default export a React component; auto-registered; reference from lessons with `{kind:'widget', widget:'<widget-id>'}`), new printable cheat sheets in `src/content/cheatsheets/<id>.tsx` (default export `{id,titleBn,Component}`), new simulated apps in `src/sim/apps/extra/<name>.tsx` (export `register()`; auto-registered), as the module needs.
4. Tests: vitest unit tests for any new pure logic/widgets (`*.test.ts(x)` next to the code) and a Playwright e2e walkthrough `e2e/mNN.spec.ts` that completes EVERY guided step on BOTH OSes (see `e2e/module2.spec.ts` and `e2e/helpers.ts`), plus the quiz if it has new interaction types. Run e2e with your own port/build folder so parallel runs don't collide:
   `PW_PORT=<yourport> PW_OUTDIR=/tmp/dist-mNN PW_CHANNEL=chrome npx playwright test e2e/mNN.spec.ts` (ports: M1 4201, M3 4203, M4 4204, M5 4205, M6 4206).
5. Do NOT edit `src/content/modules.ts` (the lead flips status), `docs/PROGRESS.md`, other modules' files, or git. Don't run `git`. Keep changes to shared sim/engine code minimal and backward compatible; if you must touch it (e.g. emit an extra event, add a data-coach id, add an optional prop), run the whole unit suite (`npx vitest run`) and `npx tsc -b` before finishing and list the edit in your report.

## Bengali & tone rules (critical)
- Natural spoken Bengali (চলিত), "আপনি" form; warm, respectful, never childish; wrong answers get a gentle hint, never harsh. Praise varies.
- Technical terms: Bengali explanation + English as seen on screen, e.g. `ফোল্ডার (Folder)`. Increase English vocabulary only gradually.
- **Religion-neutral wording only.** Never use নমস্কার, আদাব, সালাম, প্রণাম, or religion/festival-specific examples. Greeting if needed: "স্বাগতম".
- Examples from everyday Bangladeshi life (rice, tea, bKash-style phone use, rickshaw, school, family) are welcome; keep them neutral and respectful. No real people/phone numbers/brands in scam examples (use clearly fictional ones).
- Check typos and যুক্তাক্ষর; reuse glossary terms consistently.
- UI of the simulated OS is English as a real English-language OS; the coach and lesson text is Bengali. Where UI varies by version add: "আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে".

## Accuracy rules
Target Windows 11 and recent macOS. Every shortcut, menu name, path convention, command must be real; if unsure, leave it out. Never invent features.

## Steps design rules
- Each step = one clear action with `target` (a `data-coach` id that exists at that moment) and `expectedAction`. Each step must be completable from the state left by previous steps (and `setup`). Don't require typing Bengali characters in the simulation (her keyboard may not have Bengali yet) — English/ASCII text is fine; accept any name when possible.
- Provide `hintBn` for each step and `simplerBn` for harder steps. Lessons are 3–7 minutes: ~10–18 steps max per OS.
- Use `continue` steps sparingly for tours.
- Verify steps by really running the e2e walkthrough on both OSes. If a needed `data-coach` id or event doesn't exist, add it in the sim (minimal edit) and note it.

## Additional infrastructure (added in stage 4)
- **Never put `*.test.tsx` files in an auto-globbed folder root** (`src/content/widgets/`, `src/content/cheatsheets/`, `src/sim/apps/extra/`, `src/sim/apps/browser/sites/`): put tests in `__tests__/` or next to the lib code outside those folders.
- **System keyboard shortcuts** (Task Manager, screenshots, …): `registerSystemShortcut(os, combo, handler)` from `src/sim/systemActions.ts`, called from a module inside `src/sim/apps/extra/*.tsx` (auto-loaded via its `register()` export). Don't edit `shortcuts.ts`/`DesktopContext.tsx` for this.
- **Browser sites**: drop a file in `src/sim/apps/browser/sites/*.tsx` that calls `registerSite(...)` at import time (auto-loaded).
- **Certificates**: `/certificate/1` and `/certificate/2` pages exist (`src/pages/Certificate.tsx`); completing the last module of a part (13 / 20) shows it. Link to it from your lesson if you own that module.
- **Concurrent edits**: several agents work at once. Re-read a shared file immediately before editing it; keep shared-file edits tiny (one import / one line), and never overwrite a whole shared file.
- Ports for your Playwright run: M7 4207, M8 4208, M9 4209, M10 4210, M11 4211, M12 4212, M13 4213; outdir `/tmp/dist-mNN`. Seed `unlockAll` is already the default in `e2e/helpers.ts`.
- Lessons 3–7 minutes is the target; if a guided flow needs more than ~20 steps per OS, split the content: keep the most important ~15–18 steps guided and move the rest to the free-practice checklist.

## Part 2 additions (stage 6)
- Tools available: the practice terminal (app `terminal`; read `src/sim/terminal/` and its report in docs/PROGRESS.md for output formats), the code editor (app `code`, props `{folder, file}`, events `saveFile`, `codeRun`, `preview`, `type` on `code-editor`), the sandboxed runner (`src/sim/runner`; Python via self-hosted Pyodide, JavaScript in a worker), and the new action types `typeCommand`, `fileExists`, `fileContains`, `codeOutputEquals`, `previewContains`, `predictOutput` (see LESSON_SCHEMA.md "Stage 5"). Start those apps with `setup.openApps` (e.g. `['terminal']`, `['code']`) and seed files with `setup.vfs`. Seed work folders with Bengali-free ASCII names unless the lesson is about Bengali text.
- **Chapters**: for long modules use `chapters` (micro-lessons; see LESSON_SCHEMA.md "Chapters"). Step ids must be unique across the module.
- **English proportion grows gradually**: Module 14–16 mostly Bengali with the English term in brackets; Module 17–20 may use more English words (command names, file names, error words) always with a Bengali explanation next to the first use.
- Part 2 e2e: the terminal input is `[data-coach="terminal-input"]` (use `.fill()` + Enter; the terminal window may be overlapped by other windows — `focus()` the input instead of clicking), the editor is CodeMirror (`.cm-content`; type with `page.keyboard`), Python's first run takes ~1–2 s (use generous expect timeouts).
- Ports for this stage: M14 4217, M15 4218, M16 4219, M17 4220, M18 4221, M19 4222, M20 4223 (outdir `/tmp/dist-mNN`).
- Don't edit `src/content/modules.ts`. The Pyodide Python version is 3.13-ish (Pyodide 314); don't claim exact versions in lessons other than what the practice terminal prints.
