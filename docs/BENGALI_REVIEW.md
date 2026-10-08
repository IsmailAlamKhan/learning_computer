
## Modules 1–6

Scope reviewed: lessons m01–m06, glossary m01–m06, widgets (+ lib), cheat sheet, coach overlay, runner PRAISE, quiz UI, pages, sim tooltips/descriptions, `modules.ts`. The existing text was already in good spoken চলিত with "আপনি"; changes are mostly small. `npx tsc -b` and `npx vitest run` pass (209 tests); no test strings needed changing.

### Changes by category

1. Spelling / consistency (about 40 edits)
   - `কীবোর্ড` → `কিবোর্ড` everywhere (the glossary spelling) — 20 places, all in m04.
   - `পাথ` → `পথ` (m04 "পথ বার", `modules.ts` titles/one-liners).
   - `পুরনো` → `পুরোনো`, `লুকোনো` → `লুকানো`, `সঙ্গে` → `সাথে`, `উপরের` → `ওপরের`, `যে-কোনো` → `যেকোনো`, `দুইরকম` → `দুই রকম`.
   - Suffix spacing: `“Documents” এ ক্লিক` → `“Documents”-এ ক্লিক` (about 15 places in m06 and m04); `(.txt) তে` → `(.txt)-এ`; `.html এর` → `.html-এর`.
2. Natural phrasing (about 15 edits)
   - "চাবি" → "কী" (m01, glossary `keyboard`, computer-parts) to match the glossary term `কী (বোতাম)`.
   - "ছোট জানালা" → "ছোট বাক্স / ছোট উইন্ডো … ডায়ালগ (Dialog)" so "জানালা" stays only in the window analogy.
   - "সাবধানবাণী" → "সতর্কবার্তা", "সংরক্ষিত" → "জমা", "প্রয়োজনে" → "দরকার হলে", "সম্পন্ন করে সনদপত্র" → "শেষ করে সনদ", "বাছলেই" → "বেছে নিলেই", "ছাপার উপযোগী চিট শিট" → "চিট শিট পাতা … ছাপিয়ে".
   - Fragment fixed in m02: "…দেখতে লঞ্চপ্যাড (Launchpad)।" → "…দেখতে চাইলে লঞ্চপ্যাড (Launchpad) খুলুন।"
   - Teacher tips: "সে ভয় না পায়" → "তিনি ভয় না পান", "তার আসল কিবোর্ড" → "ওঁর আসল কিবোর্ড".
3. Terminology / pairing format (about 8 edits)
   - m04 list item now "মুছে ফেলা (Delete)" like the glossary; the Mac Terminal Dock tooltip now matches the Windows one.
   - m04 file/folder analogy was self-contradictory (files holding folders); rewritten as "কভার = ফোল্ডার, কাগজ = ফাইল".
4. Religion-specific wording: none found (grepped নমস্কার, সালাম, আদাব, প্রণাম, ঈদ, পূজা, রমজান, etc.). Nothing removed.
5. Technical accuracy (certain fixes only)
   - m05: "V কী C-এর কয়েকটি কী ডানে" → "ঠিক ডান পাশে" (Z X C V; V is directly right of C) in both Windows and Mac steps.
   - m06: Launchpad hint said "রকেটের মতো আইকন" but the sim icon is a grid of coloured squares and m02 said so; fixed.
   - Wrong-answer wording: `pathExplorer` hint "এই পথটি ঠিক পথে নেই" → "এই পথটি এখনও মেলেনি". Other hints were already gentle.
   - Verified OK: Win+Space, Ctrl+Space (Mac, Control+Space), Cmd+Shift+G, View → Show → File name extensions, Finder → Settings → Advanced, Cmd+Space, Shift+Cmd+T (Make Plain Text), Settings → Apps → Installed apps → ⋯ → Uninstall, Win11 Settings → Time & language → Language & region, Mac System Settings → Keyboard → Text Input → Input Sources → Edit…, Win+L, Control+Cmd+Q, screenshot shortcuts.
6. Harsh wording: no blaming text found beyond item 5; quiz and typing feedback are already soft.

### Glossary issues (not changed, because ids must stay)

- **Duplicate id `restore`**: defined in `glossary/m03.ts` (Restore a window to its old size) and `m04.ts` (restore from Recycle Bin). `getGlossaryEntry` keeps the last one, so the m03 lesson's "রিস্টোর" card may show the Recycle Bin meaning. Suggest renaming the m03 id to `restore-window` and updating `glossaryIds` in m03.
- Same Bengali term defined twice with different ids: `copy`/`kb-copy` (কপি), `paste`/`kb-paste` (পেস্ট), `cut`/`kb-cut` (কাট). Also `backslash`/`sym-backslash` and `slash`/`sym-slash` (English pairs differ slightly). Consider merging.
- `restore` is "রিস্টোর (আগের মাপে ফেরানো)" in m03 but "ফিরিয়ে আনা (রিস্টোর)" in m04 — two different Bengali terms for one English word.

### Phrases a native speaker should double-check

| File | Phrase | Why |
|---|---|---|
| `lessons/m03.ts` (glossary `maximize`, steps `m-maximize`) | "সবুজ বোতাম … প্রায় এই কাজ করে (Zoom)" / "বড় করা" | Recent macOS (Sequoia/Tahoe) green button defaults to full screen/tiling; the Bengali is hedged but the technical claim should be checked on a real Mac. |
| `lessons/m03.ts` Mac "Don’t Save" dialog | Mac TextEdit with an untitled doc may show "Delete / Cancel / Save" | Not certain; left as is. |
| `lessons/m02.ts`, `m06.ts` | Launchpad | macOS 26 (Tahoe) replaces Launchpad with "Apps"; unsure, not changed. |
| `lessons/m06.ts` `m-write` | "TextEdit “Plain Text” অবস্থায় আছে — ওপরের ডান কোণে দেখুন" | Real TextEdit does not show such a label there; this describes the simulation only. |
| `lessons/m01.ts` | "ভাতের হাঁড়ি নামানোর আগে যেমন চুলা নিভিয়ে নিতে হয়" | Analogy order (stove off, then pot down) may read oddly. |
| `lessons/m02.ts` step `w-start` hint | "চারটি ছোট গোল বিন্দু" vs m01/m06 "চারকোনা আইকন" | Must match the sim's Start icon; not checked. |
| `lessons/m04.ts` | "পথ" for Path vs "ঠিকানা" in analogy; "ফাইল-কভার" | Check that "কভার" feels natural for a folder. |
| `lessons/m05.ts` `m-menu-open` | "ইনপুট মেনু … (এখন ABC লেখা)" | On real Macs the label is "ABC" or a flag/icon depending on version. |
| `lessons/m05.ts` | "কড়ে আঙুলে Shift" | Fine, but check if "ছোট আঙুল" is more natural. |
| `pages/Home.tsx`, `Teacher.tsx` | "✓ সম্পন্ন", "শীঘ্রই আসছে", "তালা দেওয়া" | Slightly formal UI wording; "শেষ হয়েছে" / "শিগগিরই" may sound warmer. Not changed. |
| `pages/Onboarding.tsx`, `modules.ts` | "সনদ" vs "সনদপত্র" | Now "সনদ" in the two places I touched; later modules may still use "সনদপত্র". |
| `widgets/touchpad-practice.tsx` | "Windows-এ সাধারণত উল্টো" (scroll direction) | Correct for default settings, but the explanation is short; confirm it is clear. |
| `content/widgets/typing-practice.tsx`, `lib/typing.ts` | "ছুঁয়ে দেখলেই টের পাবেন — ওই দুটিতে দুই তর্জনী রাখুন" | New wording for F/J bumps; read aloud once. |
