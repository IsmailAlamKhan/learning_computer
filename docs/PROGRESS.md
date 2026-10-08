# PROGRESS

| Stage | Title | Status |
|---|---|---|
| 1 | Scaffold, brief, schema, app shell, progress store | DONE |
| 2 | Simulation engine + Module 2 benchmark | DONE |
| 3 | Modules 1, 3, 4, 5, 6 | DONE |
| 4 | Modules 7–13 | DONE |
| 5 | Terminal, editor, runners | DONE |
| 6 | Part 2 (Modules 14–20) | DONE |
| 7 | Hardening, PWA, QA, docs | DONE |

## Stage details

### Stage 1 — DONE (2026-10-08)
- Scaffolded Vite+React+TS+Tailwind; `PROJECT_BRIEF.md`, `docs/LESSON_SCHEMA.md`.
- App shell: onboarding (name, OS, text size, motivation), roadmap home with locked/unlocked/completed/soon states and "আজকের পাঠ", settings (text size, theme, numerals, teacher unlock-all, backup export/import/reset), searchable glossary, persistent সাহায্য dialog, basic teacher page.
- Progress store (`src/state/progress.ts`) with try/catch storage fallback, sanitizing import, per-OS step tracking.
- Folders: `src/engine`, `src/sim`, `src/content/{lessons,glossary}`, `src/ui`, `src/state`, `src/pages`, `src/lib`, `tests`.
- Tests: 19 passing (progress store, numerals, roadmap). Type-check, lint, build clean; dev server loads with no console errors and Bengali conjuncts render correctly (checked by screenshot).
- Commit policy: the user's global CLAUDE.md forbids Co-Authored-By/"Generated with" trailers, so commits carry none.

### Stage 2 — DONE (2026-10-08)
- Sim core (`src/sim`): `SimBus` events, `VirtualFileSystem` (Windows `C:\Users\Anika\…` and Mac `/Users/anika/…` trees, bin/restore, copy/move/rename, search, serialize), pure window manager (drag/resize/min/max/z-order/MRU Alt+Tab), OS-aware shortcuts, pointer-based drag & drop (`dnd.tsx`, also used by quiz drag-match), `DesktopContext`, generic SVG icons, Window/ContextMenu/Dialog/Tooltip/DesktopSurface/overlays, on-screen shortcut pad (for combos browsers swallow).
- Windows 11-style shell (taskbar, Start + search, tray + quick settings, Recycle Bin) and macOS-style shell (menu bar, Dock, Launchpad, Spotlight, Control Center, Trash); apps: File Explorer/Finder (+bin), Notepad/TextEdit (Save/Save As dialogs, close guard), simulated browser (site registry), Settings, Photos.
- Coach: `useGuidedRun` (advances only on the right action; 10 s hint, 20 s "দেখিয়ে দিন"; quick learners credited during the praise pause), `CoachOverlay` (ring, animated cursor, bubble, demo animation, "আমি আটকে গেছি"), `matchAction`, quiz grading for 5 types, `QuizRunner`.
- Lesson page with 7 sections, OS toggle, free-practice sandbox + reset, progress saving, completion rule (all steps for the OS + quiz taken).
- Module 2 written in Bengali (17 Windows / 16 Mac guided steps, free practice, 5-question quiz incl. click-the-right-thing and drag-to-match, summary, real tasks, teacher tip) + 14 glossary entries.
- Tests: 116 unit/component tests (VFS, window manager, shortcuts, actions, runner, guided-run timers with fake clock, quiz grading, shells, apps) + 6 Playwright e2e (full Module 2 on both OS, hint/demo flow, quiz, completion). Uses installed Chrome (`PW_CHANNEL`), no browser download.
- Simplifications: Mac green button = zoom/maximize (not macOS full-screen); guided practice always restarts from step 1 on reset/reload (sim state is not persisted); Windows Start/Mac menus are display-only for items not needed by lessons.

### Stage 3 — DONE (2026-10-09)
- Playable now: Modules 1–6 (Windows + Mac each). Infra added: auto-registered widgets (`src/content/widgets/*.tsx`), cheat sheets (`/cheatsheets`), extra sim apps (`src/sim/apps/extra`), `Lesson.setup` (open windows / extra files / settings), parallel-safe Playwright config (`PW_PORT`, `PW_OUTDIR`).
- M1: `computer-parts` widget (13 clickable parts + challenge), `touchpad-practice` widget, shared power screen (sleep/wake/restart/shutdown events). M3: window moves/resize/maximize/switch with on-screen shortcut pad for Alt+Tab/Cmd+Tab. M4: file ops, extensions, `path-explorer` widget, Recycle Bin/Trash restore, address-bar/Go-to-Folder. M5: `typing-practice`, `symbol-drill`, `shortcut-table`, keyboard-layout widgets, simulated Bangla keyboard add/switch flow with tray/menu-bar indicator, printable shortcuts cheat sheet. M6: Notepad/TextEdit save/Save As/reopen, plain-vs-rich and save-vs-saveas widgets, simulated App Installer + uninstall.
- Engine fix found by M6: `type` events are emitted asynchronously so controlled inputs don't lose the last character; Frame refocuses the sim root when a focused control disappears.
- Tests: 209 unit/component tests; 27 Playwright e2e (every guided step on both OSes, widgets, quizzes) all green; tsc/lint(build) clean.
- Bengali review by a separate reviewer pass: ~70 fixes (see docs/BENGALI_REVIEW.md). Duplicate glossary id `restore` fixed (`restore-window`).
- Known: lessons 4 (27/23 steps) and 6 (38/32 steps) exceed the 3–7 minute guideline; kept as complete walk-throughs with the teacher tip suggesting two sittings (candidate for splitting in final QA).

### Stage 4 — DONE (2026-10-09)
- Playable: all of Part 1 (Modules 1–13) on Windows and Mac. Part 2 shows "শীঘ্রই আসছে".
- M7: simulated mini-internet (search engine with keyword ranking + ads, Rannaghor recipes, Khobor news, fake prize/wallet scam pages with look-alike URL, official download page with ad trap), browser padlock/Downloads panel. M8: Mail app (folders, compose, attachments from VFS, reply/forward/spam, save attachment) + signup widget. M9: password-strength, spot-the-scam (9 fictional cards), phishing-link-check widgets, safety cheat sheet, lock/unlock steps. M10: full Settings flows (wallpaper, zoom, dark mode, Wi-Fi with practice password, Bluetooth pairing, printer, timezone). M11: Media Player, screenshots (PrtScn/Win+Shift+S/Win+PrtScn, Cmd+Shift+3/4/5), USB drive mount/eject, phone copy, print dialog + queue with cancel. M12: Task Manager / Force Quit, frozen app scenario, error search forum, decision-tree widget. M13: capstone with progress checklist + printable Bengali certificate page (`/certificate/1`).
- Infra: system-shortcut registry, auto-registered browser sites/extra apps/widgets, `Lesson.checklist`, `Lesson.certificatePart`, content-integrity tests (`src/content/content.test.ts`).
- Tests: 371 unit/component tests, ~51 Playwright walkthroughs (all pass; Module 8/12 Mac occasionally flake under CPU load → config uses 2 workers + 1 retry).
- Bengali reviewed by a separate pass for 7–13 (docs/BENGALI_REVIEW.md).
- Guided step counts exceed the 3–7 minute guideline in M4 (27/23), M6 (38/32), M10 (31/26), M11 (26/26): kept complete; teacher tips suggest two sittings. Candidate to split in final QA if time permits.
- Main JS bundle > 500 kB: code-splitting of sim apps/widgets is a stage 7 task.

### Stage 5 — DONE (2026-10-09)
- Simulated terminal (`src/sim/terminal`, app `terminal`): PowerShell-style (dir/cd/mkdir/type/cls/ls/pwd/cat/echo/ni/…) and zsh-style (ls/cd/pwd/mkdir/touch/cat/echo/clear/…) on the shared VFS; `>`/`>>`, tab-completion, history, Ctrl+C/L; `python`/`python3`/`py`/`node` run files via the runner; version checks; dangerous commands (rm/del/sudo/format…) blocked with a Bengali explanation; unknown commands get nearest-command Bengali hints.
- Code editor (`src/sim/editor`, app `code`): CodeMirror 6 (chosen: small, offline, handles Bengali strings), explorer, tabs, highlighting for HTML/CSS/JS/Python, auto-indent, bracket matching, Ctrl/Cmd+S into the VFS, Run button with friendly input prompt box, sandboxed live preview iframe (`sandbox="allow-scripts"`, CSP, no network).
- Runner (`src/sim/runner`): JavaScript in a Blob Web Worker (network/escape globals removed, timeout → terminate); Python via **self-hosted Pyodide 314.0.7** (npm + static copy to `<base>/pyodide/`, ~13 MB, lazily loaded in a worker; ~1.2 s first run) — chosen over a CDN for privacy/offline/pinning; `input()` through a replay strategy (no SharedArrayBuffer needed); output caps; Bengali friendly error translation (original English error always shown too). See docs/RUNNER.md.
- Engine: new actions `typeCommand`, `fileExists`, `fileContains`, `codeOutputEquals`, `previewContains`, `predictOutput` (coach bubble input) + schema docs.
- Demo page `/#/demo/tools` (linked from the teacher page) shows terminal + editor on both flavors.
- Tests: 552 unit/component tests (incl. real Pyodide under Node), new Playwright specs for terminal and editor. Python run verified in real Chrome against the production build.
- For stage 7: service worker must precache `pyodide/*` (6 files) and `assets/pythonWorker-*.js` (see docs/RUNNER.md).

### Stage 6 — DONE (2026-10-09)
- All 20 modules are playable. New in Part 2: M14 (toggle-bits, input-process-output, kitchen-analogy widgets; file sizes via `sizeBytes`), M15 (exact-instructions robot, language-cards, path-chooser), M16 (order-puzzle, flowchart-builder with graph validation, if-else-explorer, loop-counter), M17 (terminal lesson with typeCommand/fileExists/fileContains steps, prompt-anatomy widget, terminal cheat sheet), M18 (fictional official download sites with ad traps, simulated installers incl. PATH checkbox, Extensions marketplace, terminal gating of python/node/git until installed, `code .`), M19 (tech-words, error-reader, question-builder widgets; fake Q&A sites; **notebook** page `/notebook` with autosave/search/export and an "add to notebook" button on every summary card), M20 (11 chapters: HTML ×3, CSS ×2, Python ×4, 2 mini-projects; Part 2 certificate; `/next-steps` roadmap + printable 30-minute habit sheet; HTML and Python cheat sheets).
- Engine: `Lesson.chapters` micro-lessons; state-based steps re-checked when they become current; editor emits `code-run-ok/error`.
- Cheat sheets: shortcuts, safety, terminal commands, setup checklist, HTML basics, Python basics.
- Tests: 738 unit/component tests (incl. real Pyodide checks of every Python output in M20); Playwright walkthroughs for every module.
- Bengali review for 14–20 + tools appended to docs/BENGALI_REVIEW.md (e.g. VS Code Mac download is normally a .zip).

### Stage 7A — Offline, performance, privacy (2026-10-09)
- PWA: `vite-plugin-pwa` service worker (precache ≈ 2.9 MB; Pyodide fetched in the background + CacheFirst route), Bengali manifest + icons (`npm run icons`), footer chip + update toast (`src/ui/PwaStatus.tsx`, `src/pwa/`). See docs/OFFLINE.md; e2e `offline.spec.ts`.
- Performance: pages, SimStage (lazy in `Practice.tsx`) and the heavy simulated apps (code editor/CodeMirror, terminal, browser + sites, sim Settings; helper `src/sim/apps/lazyApp.tsx`, tests preload via `testUtils`) are code-split. Home-route JS+CSS: 457 kB gzip → 109 kB gzip.
- Privacy: CSP meta in `index.html`, `npm run check:privacy`, `tests/privacy.test.ts`, e2e `privacy.spec.ts`. See docs/PRIVACY.md.

### Stage 7 — DONE (2026-10-09)
- PWA/offline (service worker precache of 117 files ≈2.9 MB; Pyodide ≈13 MB fetched in the background after first idle load + CacheFirst), manifest + icons, update toast, offline status chip; initial Home JS+CSS 457 → 109 kB gzip via lazy routes/sim/apps; CSP + privacy checks (`npm run check:privacy`, e2e request recording: only same-origin requests).
- Accessibility audit (axe light/dark/xxlarge, keyboard-only flows, focus management, ~22 fixes), responsive checks at 1280/1024/768/390 px (+ small-screen note), A4 print fixes (certificate = exactly 1 landscape page; cheat sheets ≤ 2 pages).
- Teacher dashboard (`/teacher`: progress, per-OS steps, quiz scores, weak topics, activity, certificates, JSON backup + HTML report export), README, QA checklist, architecture, offline and privacy docs.
- Final pass: clean `npm ci`, `tsc -b` clean, lint (warnings only), 790 unit/component tests, production build, **171 Playwright tests pass** (all 20 modules, both OS, onboarding, export/import, offline, privacy, a11y, responsive, print).

## Decisions and assumptions

- npm (not pnpm); Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 (`@tailwindcss/vite`), Vitest 5, oxlint (from the Vite template).
- `HashRouter` so the static build works on any host (GitHub Pages, Netlify, file hosting) without rewrite rules.
- Bengali font: Noto Sans Bengali, bundled via `@fontsource` (no network at runtime). Monospace stack falls back to Noto Sans Bengali for Bengali glyphs.
- Roadmap unlock rule: a module unlocks when the previous one is completed; a teacher toggle in Settings ("সব পাঠ খুলে দিন") opens all.
- Lessons, glossary entries are auto-discovered via `import.meta.glob` (one file per module) so content edits never touch engine code.
- Text sizes: 18 / 20 / 23 / 26 px root; all UI is rem-based.
- Progress is saved per OS flavor for steps so switching OS never loses the other flavor's progress.

- Greetings and cultural references must be religion-neutral: use "স্বাগতম" only. Never নমস্কার/প্রণাম/আদাব/সালাম or festival/religion-specific examples (user feedback, 2026-10-08). Applies to all Bengali content and sub-agent briefs.

- Sim UI text is English like a real English-language OS; Bengali explanations live in the coach, tooltips and lessons.
- Windows desktop username `Anika` / Mac `anika` (generic sample name; paths shown in lessons use it).
- Roadmap unlock skips modules still marked `soon`.
- Playwright uses the machine's Chrome (`channel: 'chrome'`).

## Open issues / follow-ups

- **Native-speaker Bengali review** still recommended: see the "Phrases a native speaker should double-check" tables in docs/BENGALI_REVIEW.md (e.g. কন্ট্রোল সেন্টার, সিস্টেম ট্রে, সনদ vs সনদপত্র, ঠকবাজ vs প্রতারক, পিছনে/পেছনে, the Mac "Save As… with Option" wording, VS Code Mac download "সাধারণত .zip").
- **Long lessons**: M4 (27/23 steps), M6 (38/32), M10 (31/26), M11 (26/26), M18 (4 chapters, 48/51 steps) exceed the 3–7 minute guideline; they run as complete walkthroughs and teacher tips suggest two sittings. Splitting them into `chapters` is a straightforward follow-up.
- **Accuracy items to verify on real machines**: whether plain PrtScn opens the Snipping Tool by default on current Windows 11; Mac green window button (zoom vs full screen) and Launchpad's name on the newest macOS; Mac TextEdit "Don't Save" wording; Windows 24-hour clock menu labels; real Node.js/VS Code installer page order.
- Glossary has a few same-term/different-id duplicates (`wifi`/`set-wifi`, `copy`/`kb-copy` …) with consistent meanings (ids must stay stable).
- The notebook has no dedicated print view (prints cleanly as a page); axe covers each lesson section's initial state only, not every state of every widget.
- E2E: Module 8 (Mac) can flake under heavy CPU load (Playwright config uses 2 workers + 1 retry). The coach credits an action done during the 1.4 s "well done" pause only for the immediately next step.
- oxlint reports only `only-export-components`/`refs` warnings in src/sim (accepted).
- On phone widths the simulator is cramped by design; a friendly note recommends a laptop.
