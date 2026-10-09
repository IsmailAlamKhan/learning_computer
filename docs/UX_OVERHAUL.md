# UX overhaul: fixing the "wall of text"

Branch `ux/readability-overhaul` (developed in the git worktree `../learning_computer_ux`, because the original folder had unrelated uncommitted work from another session that must not be disturbed). Numbers: [UX_AUDIT_BEFORE.md](UX_AUDIT_BEFORE.md) → [UX_AUDIT_AFTER.md](UX_AUDIT_AFTER.md). Screenshots: `docs/screenshots/before`, `after-pilot`, `after-overhaul` (same screens as "before", 1440 and 390 px) and `after/` (≈ 600 per-module shots taken by the authors).

## What changed
| Area | Before | After |
|---|---|---|
| Lesson shape | one long page per module: explanation paragraphs + tabs (জানুন/হাতে-কলমে/…) | 75 short decks (units); one card per screen: hook → 3–6 cards → guided practice → 3-question quiz → celebration |
| Explanation text | 274 blocks, avg 41.6 words, max 200, 50 of 324 had a visual | 437 cards, avg 11.8 words, max 19, **every card has a visual** |
| Guided step line | avg 17.7, max 61 words | avg 6.7, max 14 |
| Over-budget items | 802 | **0** (enforced in `npm run build`) |
| Visuals | none | ≈ 135 original flat illustrations (+ the mentor "didi", 5 poses), 26 annotated mini-screenshots of the simulated OS with spotlight regions, 9 animated gesture demos, animated annotated code with line-by-line runs |
| Home | text roadmap | "continue" card, daily-goal ring, streak 🔥 / XP ⭐ header, winding illustrated path |
| Coach | long bubble, 3 buttons | compact bubble with the didi avatar, one ≤ 12-word line, হিন্ট / দেখিয়ে দিন, placed so it never covers the target |
| Glossary | list of paragraphs | tap-to-flip cards with icon/art + flashcard mode, one-line meanings |
| Device | asked/assumed | OS and pointing device (mouse vs touchpad) are detected automatically; touchpad-only content is never shown to a mouse user |

## Decisions (and why)
- **Register: friendly-respectful "আপনি" everywhere** (never "তুমি"): the project brief requires respect; the "didi" warmth comes from word choice, humour and rhythm ("চলুন", "দেখুন তো").
- **Text budget thresholds**: two levels per item — *target* (the numbers in the brief: card ~25, instruction ~12, hint ~15, success ~6, question ~20, option ~8, explanation ~15) is reported as "tight"; the *hard* cap (card 35, instruction 14, hint 18, success 8, question 24, option 10, explanation 18) fails the build. Reason: Bengali with English technical words rarely fits a razor-sharp cap, but nothing may drift back to paragraphs. Also enforced: ≤ 2 sentences, ≤ 2 bold words, ≤ 3 chips, 3–6 cards, exactly 3 quiz questions per unit, ≤ 3 recap items, ≤ 22 guided steps per OS per unit, deck ≤ 12 items, glossary one line, valid art/mock/region/widget names, mouse/touchpad alternatives.
- **Data model**: `Lesson → Unit[] → Card` (see [LESSON_SCHEMA.md](LESSON_SCHEMA.md)); the old explanation/summary/free-practice shapes and all code only they used were deleted (the progress store stays backward compatible so old backups still import).
- **Units, not a 12-card cap on whole modules**: long modules were split into units (e.g. Module 4 → 4 units, Module 6 → 4, Module 18 → 5, Module 20 → 8) — every unit is a complete mini-lesson with its own hook, practice, quiz and celebration. Each unit starts a fresh simulated computer, so units define their own `setup`.
- **Quizzes are OS- and device-neutral** (exactly 3 per unit), while steps/cards may differ by OS and pointing device.
- **Widgets stay** as "পারেন?" challenge moments inside cards; they are the one visual allowed to scroll inside its own panel.
- **Auto-detection** (`src/lib/device.ts`): OS from `userAgentData`/`platform`/UA; pointing device defaults to *mouse* (the harmless default) unless the device is touch-only or real wheel/pointer events look like a touchpad (smooth fractional deltas, horizontal deltas, pinch) — score threshold 6; a manual choice in Settings (`আমার কম্পিউটার`) is never overridden. She is never asked about touchpad vs mouse.
- **Deck is a full-screen overlay** so a card can never scroll; header/help of the app shell are `inert` while it is open, so the deck header has its own ❓ help button.
- **Gamification** is small and tasteful: XP (steps, quiz first-tries, unit, module), streak with a daily goal (1–3 mini-lessons), 6 badges; confetti stops within 2.4 s and is off under `prefers-reduced-motion`.
- **Teacher tips** are hidden behind a small toggle on the celebration card; text-to-speech ("শুনুন") is a small icon (hidden when the browser has no Bengali voice).

## Guardrails (so the wall of text cannot come back)
`npm run audit:content` (part of `npm run build` and of `npm test` via `src/content/audit.test.ts`) · `e2e/guardrails.spec.ts` (390/768/1440 px: no horizontal scroll, no vertical scroll in the card area, exactly one primary button, font sizes, coach bubble never overlapping the target, taskbar/Dock fully visible) · deck engine unit tests (next/back/swipe/keyboard/resume/gating).

## Known limitations / for a native speaker or the husband
- Bengali was rewritten by AI authors and edited by two further reviewer passes; native-speaker tables are appended to [BENGALI_REVIEW.md](BENGALI_REVIEW.md) (e.g. the jokes/analogies in hooks, "সম্পন্ন", "নামান"/"ডাউনলোড", badge names).
- The widgets' internal copy is still longer than a card (they are interactive panels); trimming them is a possible follow-up.
- On 390 px phones the simulated computer is intentionally compact (taskbar/Dock shrink); the Mac menu bar clips its right side. A laptop is recommended (a one-line note says so).
- Mouse-wheel detection on some Mac Chrome setups can look like a touchpad; the Settings override handles it.
- Some mini-screenshots (mocks) show sample names (notes.txt) that differ slightly from the simulation's seed files.
