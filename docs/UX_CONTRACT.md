# UX overhaul contract (read with PROJECT_BRIEF.md "UX RULES")

Work happens in the git worktree `../learning_computer_ux` on branch `ux/readability-overhaul` (the original folder has someone else's uncommitted work — never touch it). Dev/test commands run inside this worktree. Don't run git; the lead commits.

## Data model (src/engine/types.ts)
`Lesson { units: Unit[] }`; `Unit { hook: Card, cards: Card[] (3–6), steps: Step[], setup?, checklist?, quiz (exactly 3), recapBn (≤3), freeTryBn? }`; `Card { type: hook|visual|compare|code, textBn, visual: Visual, chipsBn?, learnMoreBn?, osVariant?, inputVariant? }`.
`Visual` kinds: art, flow, compare, mock, demo, code, widget, big (see types.ts). Names for art/mocks: src/ui/illustrations/names.ts. Old lessons keep the legacy type `LegacyLesson` (imported as `Lesson` in old m*.ts files) until each module is migrated; both formats work side by side during the migration (`isCardsLesson(l)`).
Input devices: steps/cards may be `inputVariant: 'mouse' | 'touchpad' | 'both'`; the learner's device is auto-detected (profile.input) so touchpad-only content is never shown to a mouse user and vice versa.

## Text budget (enforced by `npm run audit:content`)
Card text ≤25 words (hard 35), ≤2 sentences, ≤2 bold words (`**word**`), ≤3 chips, ≤3 recap items (≤8 words each). Step instruction ≤12 words, one action, starts with a verb; hint ≤15; success ≤6. Quiz question ≤20 words, option ≤8, explanation ≤15. Longer detail → `learnMoreBn`. Glossary meaning ≤18 words (one line).

## Voice ("didi")
Friendly older-sister mentor, "আপনি" consistently (warmth through word choice: "চলুন", "দেখুন তো", "একদম সোজা!", a tiny joke at times), concrete and Bangladesh-flavoured (Facebook, Messenger, YouTube, bKash, online class, university/job form). Never stiff, never baby-talk. Religion-neutral (never নমস্কার/সালাম/আদাব/প্রণাম). Technical accuracy must be preserved exactly (shortcuts, menus, commands, paths).

## Design tokens (src/index.css `:root`) — use only these, via Tailwind names or `var(--…)`
Colours: `--c-canvas --c-surface --c-sunken --c-ink --c-muted --c-brand(violet) --c-brand-ink --c-brand-soft --c-teal --c-teal-soft --c-accent(coral) --c-accent-soft --c-line --c-ok --c-ok-soft --c-warn --c-warn-soft --c-focus` (Tailwind: `bg-brand text-ink bg-teal-soft border-line` …). Shape: `--r-sm 12 --r-md 16 --r-card 24 --r-pill`. Space: ≥ `--space-block` (24px) between blocks. Depth: `--shadow-card --shadow-press`. Type: `--fs-title (≈34px) --fs-heading --fs-body (≈20px) --fs-small`, `--lh-bn` 1.75. ONE primary button per screen (`.btn`); secondary `.btn-outline`. Motion < 300 ms (celebrations excepted), always respect `prefers-reduced-motion`.

## Illustration style
Original flat art, soft rounded shapes, ink outline 3 px at 200×200, palette in src/ui/illustrations/palette.ts (3–5 colours each), friendly, modern, gender-neutral-to-feminine but never all-pink; the mentor "didi" is an original illustrated young woman in a Bengali-flavoured style (no copyrighted characters, no real brands/logos). Every art component: `({size=160, className, title}) => <svg viewBox="0 0 200 200" role="img" aria-label={title}>…</svg>`.

## Ownership (parallel tasks)
- ART-1: src/ui/illustrations/art/part1.tsx (+ files it imports under art/part1/). ART-2: art/part2.tsx (+ art/part2/). MOCKS: mocks.tsx, demos.tsx, codeVisual.tsx (+ mocks/ folder). DESIGN: src/index.css tokens/buttons, src/ui/Layout.tsx, header, src/pages/Home.tsx, Onboarding, Settings, Glossary, src/engine/coach/CoachOverlay.tsx (+ coach CSS), src/ui/Celebration.tsx, src/ui/SpeakButton.tsx, src/lib/device.ts. DECK: src/engine/deck.ts, src/pages/DeckPage.tsx + src/ui/cards/*, quiz slides (src/ui/quiz/*), src/pages/ModulePage.tsx routing, src/lib/teacher.ts, e2e/helpers.ts, content tests. Stay inside your files; tiny edits elsewhere only when unavoidable, re-reading the file first.
