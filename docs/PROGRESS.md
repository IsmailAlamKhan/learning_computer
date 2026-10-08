# PROGRESS

| Stage | Title | Status |
|---|---|---|
| 1 | Scaffold, brief, schema, app shell, progress store | DONE |
| 2 | Simulation engine + Module 2 benchmark | DONE |
| 3 | Modules 1, 3, 4, 5, 6 | DONE |
| 4 | Modules 7–13 | DONE |
| 5 | Terminal, editor, runners | NOT STARTED |
| 6 | Part 2 (Modules 14–20) | NOT STARTED |
| 7 | Hardening, PWA, QA, docs | NOT STARTED |

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

- Stage 3 must update `roadmap.test.ts` ("skips soon modules" test assumes module 1 is still `soon`).
- oxlint shows only `only-export-components`/`refs` warnings in src/sim (accepted).
- Display zoom in sim Settings stores a value but shells don't apply it yet (Module 10).
- Module 2 Bengali: native-speaker double-check suggested for the "কন্ট্রোল সেন্টার" and "সিস্টেম ট্রে" wording.

- Module 6 has ~38 Windows / 32 Mac guided steps (exceeds the 10–18 guideline): consider splitting into two sub-lessons (6a write/save, 6b install/uninstall) in the final QA. Mac 'Save As… hidden until Option held' claim needs native/Mac verification.
