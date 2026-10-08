# PROGRESS

| Stage | Title | Status |
|---|---|---|
| 1 | Scaffold, brief, schema, app shell, progress store | IN PROGRESS |
| 2 | Simulation engine + Module 2 benchmark | NOT STARTED |
| 3 | Modules 1, 3, 4, 5, 6 | NOT STARTED |
| 4 | Modules 7–13 | NOT STARTED |
| 5 | Terminal, editor, runners | NOT STARTED |
| 6 | Part 2 (Modules 14–20) | NOT STARTED |
| 7 | Hardening, PWA, QA, docs | NOT STARTED |

## Stage details

_(filled in as stages complete)_

## Decisions and assumptions

- npm (not pnpm); Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 (`@tailwindcss/vite`), Vitest 5, oxlint (from the Vite template).
- `HashRouter` so the static build works on any host (GitHub Pages, Netlify, file hosting) without rewrite rules.
- Bengali font: Noto Sans Bengali, bundled via `@fontsource` (no network at runtime). Monospace stack falls back to Noto Sans Bengali for Bengali glyphs.
- Roadmap unlock rule: a module unlocks when the previous one is completed; a teacher toggle in Settings ("সব পাঠ খুলে দিন") opens all.
- Lessons, glossary entries are auto-discovered via `import.meta.glob` (one file per module) so content edits never touch engine code.
- Text sizes: 18 / 20 / 23 / 26 px root; all UI is rem-based.
- Progress is saved per OS flavor for steps so switching OS never loses the other flavor's progress.

## Open issues / follow-ups

- (none yet)
