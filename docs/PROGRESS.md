# PROGRESS

| Stage | Title | Status |
|---|---|---|
| 1 | Scaffold, brief, schema, app shell, progress store | DONE |
| 2 | Simulation engine + Module 2 benchmark | DONE |
| 3 | Modules 1, 3, 4, 5, 6 | NOT STARTED |
| 4 | Modules 7–13 | NOT STARTED |
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
