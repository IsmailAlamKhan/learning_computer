
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

## Modules 7–13

Scope reviewed: lessons m07–m13, glossary m07–m13 (plus a cross-check of all 239 glossary entries for duplicate ids, terms and English names), widgets and lib data for modules 7–13 (`wifi-vs-mobile`, `url-anatomy`, `email-parts`, `signup-form`, `password-strength`, `phishing-link-check`, `spot-the-scam`, `settings-map`, `screenshot-keys`, `troubleshoot-flow`, `error-copy-search`, and `lib/scamCards.ts`, `linkCheck.ts`, `m12Logic.ts`, `passwordStrength.ts`, `signupLogic.ts`, `settingsMap.ts`, `screenshotKeys.ts`), both cheat sheets, `pages/Certificate.tsx` (plus the "সনদপত্র" wording in `ModulePage.tsx` and `Onboarding.tsx`), `modules.ts` (m13 entry), and Bengali strings in `sim/apps/extra/*`, `sim/apps/browser/sites/*`, `sim/devices/*`, `Settings.tsx` and the `ShortcutPad` aria-label. `Settings.tsx` itself has no Bengali except the "বাংলা" language option. The text was already in good spoken চলিত with "আপনি" and a calm, protective tone in the safety module. Changes are small direct edits; no ids, `data-coach` targets, `expectedAction`s or logic were touched. `npx tsc -b` and `npx vitest run` pass (41 files, 371 tests); no test strings needed changing (tests that assert Bengali, such as "শেখা", "কখনো চালাবেন না", "গুরুত্বপূর্ণ অংশ", "আসল পাসওয়ার্ড লিখবেন না", "ঠিক গড়নের", were checked and still match).

### Changes by category

1. Spelling / consistency (about 25 edits)
   - `মোবাইল ডাটা` → `মোবাইল ডেটা` (m09 lesson, safety cheat sheet) to match m07 and the glossary.
   - `কখনও` → `কখনো` (m09, m12, scamCards, safety cheat sheet) — dominant spelling in the project; `লক্ষ টাকা` → `লাখ টাকা` (m08); `বেশির ভাগ` → `বেশিরভাগ` (m12); `সঙ্গে সঙ্গে` → `সাথে সাথে` (m12 lesson and glossary); `আধা টি` → `আধখানা` (recipe site); `এখানের` → `এখানকার`; `না-সেভ করা` → `সেভ না করা` (m13).
   - `প্র্যাকটিসের` → `অনুশীলনের` in sim app descriptions (installer, mail, stuckapp, installState) and m06 (two lines), to match the rest of the app.
   - "জানালা" for a dialog or window → "ডায়ালগ (ছোট উইন্ডো)" / "উইন্ডো" (m11 print steps, m12 Force Quit steps and widget data, Force Quit app description), so "জানালা" stays only in the window analogy.
   - `সনদপত্র` → `সনদ` in UI sentences (Certificate "not yet" message, ModulePage button, Onboarding note, `modules.ts`), matching the earlier review. The printed heading and aria-label on the certificate itself stay "সনদপত্র" (formal document title).
   - m13 title/`modules.ts`: `চূড়ান্ত প্রজেক্ট` → `সমাপনী প্রকল্প`, matching the glossary term and the lesson body.
2. Natural phrasing (about 25 edits)
   - "তথ্য মুড়ে পাঠানো" (odd) → "সুরক্ষিত করে (এনক্রিপ্ট করে) পাঠানো" (m07 lesson, glossary `https`, `url-anatomy`).
   - m09 steps "এই অনুশীলন কম্পিউটারে আসল কোনো পাসওয়ার্ড লাগবে না…" (garbled) → "এই অনুশীলনে আসল কোনো পাসওয়ার্ড লাগবে না… কম্পিউটারে তালা দেওয়ার শর্টকাট"; "ধারণা নিই" → "একটু দেখি"; "সোনালি নিয়ম" (calque of "golden rule") → "সবচেয়ে জরুরি নিয়ম" / "জরুরি নিয়ম" (m09, scamCards, safety cheat sheet).
   - m10: confusing radio-knob and glasses analogies simplified; Wi-Fi analogy "প্রতিবেশীর বাড়ির সদর দরজা" → "ইন্টারনেটে ঢোকার দরজা"; "ঘণ্টা-ঘণ্টা আগে বা পরে" → "কয়েক ঘণ্টা আগে বা পরে"; "ইন্টারনেট দাতা" → "ইন্টারনেট কোম্পানি" (also m09 "ইন্টারনেট প্রদানকারী", m12 "সংযোগদাতা").
   - m08: unclear "উত্তরের খসড়া নিয়ে চিন্তা নেই, কিছু না বদলালে সেটি জমা হয় না" → clearer wording.
   - m12 glossary `task-manager`: "কে কতটা শক্তি (CPU)" → "কে কতটা প্রসেসর (CPU) ও মেমোরি ব্যবহার করছে"; teacher tip "বাঁ হাতে অভ্যাস করান" removed (not needed).
   - m09/cheat sheet: "ID-কার্ড" → "জাতীয় পরিচয়পত্র (NID) বা অন্য পরিচয়পত্র"; "অচেনা করে না" → "আড়াল করে না" (private browsing); "অপ্রয়োজনে" → "দরকার না হলে"; "আইনি সহায়তার সংস্থা" (vague, bookish) → ব্যাংক/মোবাইল-ওয়ালেট সেবাকে জানানো, দরকারে স্থানীয় থানা বা সরকারি সাইবার-নিরাপত্তা সংস্থা, with the advice to look up their contact details on the official website (no number given).
   - Certificate: "এই মর্মে প্রত্যয়ন করা যাচ্ছে যে" → "আনন্দের সাথে জানানো হচ্ছে যে"; "সম্পন্ন করেছেন" → "শেষ করেছেন".
   - Cheat sheet: jargon "মডিফায়ার" → "আগে Ctrl বা Command চেপে ধরুন…"; ShortcutPad aria-label "মডিফায়ার কী" → "Ctrl, Alt, Cmd-এর মতো কী".
   - Teacher tips/UI: "নিশ্চিত হোন" → "নিশ্চিত হয়ে নিন"; "হোভার করলে" → "মাউস ওপরে রাখলে"; "ওপর মাউস নিন" → "মাউসের তীর রাখুন"; "ট্যাপ" → "ক্লিক (বা ট্যাপ)".
3. Terminology / glossary (see also the duplicates list below)
   - m13 glossary and lesson now use one pairing: সমাপনী প্রকল্প (Capstone Project).
   - Prose "Wi-Fi" → "ওয়াই-ফাই" in m12 explanation/summary/match item (UI labels that copy on-screen English, such as "Wi-Fi: Off", kept as is).
   - m13 quiz hint now pairs each key with its Bengali term: কপি (Copy), বসানো (Paste), ফিরে যাওয়া (Undo), সেভ (Save).
4. Religion-specific wording: none found in these files (grepped নমস্কার, সালাম, আদাব, প্রণাম, ঈদ, পূজা, রমজান, আল্লাহ, ঈশ্বর, ধর্ম, etc.). Examples (মসুর ডাল, খিচুড়ি, আলু ভর্তা, "প্রিয় রিনা আপু") are neutral. The content test `FORBIDDEN` still passes.
5. Technical accuracy (certain fixes only)
   - Domain reading rule was wrong or misleading in four places ("ঠিকানার শেষ দিকের অংশটিই আসল মালিক বোঝায়"): the owner is the name just before the first single "/" (e.g. `example.com` in `example.com.evil.net/x` is the last part before the slash, not the end of the whole URL). Reworded in m09, the safety cheat sheet, and `linkCheck.ts` (two findings).
   - m11: "প্রিন্টের জানালা" → "প্রিন্টের ডায়ালগ"; Mac print step now says "File মেনু থেকে Print…" (there is no top "Print…" button in TextEdit); Finder step says the sidebar "Locations" section instead of a clumsy double "নিচে"; glossary `eject` now says the ⏏ is next to the drive name in the Finder sidebar.
   - m11 note: added that on some PCs PrtScn opens the Snipping Tool directly (settings-dependent in Windows 11).
   - m10: Mac menu is now described as the "আপেল-চিহ্নের মেনু" (the top-left Apple menu) for System Settings…; m12 does the same for Force Quit… and Restart… (with "সিস্টেম মেনু" kept in brackets once, because the simulation calls it that); m10 24-hour-clock checklist for Windows corrected to Time & language → Language & region → Regional format → Change formats (the old "Time format" label is not a Windows 11 menu name), Mac: General → Date & Time → 24-hour time.
   - m07: added a Chrome/Edge caveat that the padlock may appear as another small icon ("তালার জায়গায় অন্য ছোট চিহ্ন").
   - Verified OK: Win+Shift+S (clipboard + "Snip saved to clipboard" toast), PrtScn, Win+PrtScn → Pictures\Screenshots, Cmd+Shift+3/4/5 (saved to Desktop; Cmd+Shift+5 toolbar; Esc closes), Ctrl+Shift+Esc → Task Manager → End task, Cmd+Option+Esc → Force Quit, Win+L, Ctrl+Cmd+Q, Start → Power → Restart, Apple menu → Restart…, Settings → Network & internet → Wi‑Fi, Bluetooth & devices → Add device, Bluetooth & devices → Printers & scanners → Add device, Time & language → Date & time → Time zone, System Settings → Wi‑Fi / Bluetooth / Printers & Scanners / General → Date & Time, "Safe to Remove Hardware" message, Mac Finder eject ⏏, Android Internal storage › DCIM › Camera, "Where:" and "Save As:" fields in the Mac save dialog.
6. Scam / safety content
   - All sample sites, senders, numbers and links are fictional (`takapay.example`, `namunabank.example`, `01XXXXXXXXX`, `.example` domains). Only recurring generic mentions of "বিকাশ/নগদ-জাতীয় সেবা" and "ফেসবুক সাপোর্ট" remain, as types of caller people may meet; no real logos, helpline numbers or real URLs appear. The m09 note now states this explicitly. In the scam cards the friend-DM scenario said "বিকাশ করো" (real brand as verb) → "টাকাপে করো".
   - Advice always points to the official app, the number on the back of the card, or the official website; no specific helpline number is given. The "if you were scammed" list is calm and non-blaming, and no longer cites a vague "আইনি সহায়তার সংস্থা".
   - m13 quiz: "কেউ চাইলে সে প্রতারক" (absolute) → "এভাবে ওটিপি বা পাসওয়ার্ড চাওয়া প্রতারণার লক্ষণ"; m09 note on "কর্মীও এই কোড জানতে চায় না" kept.
7. Wrong-answer hints: "এবার ফসকে গেছে, তবে এতে ক্ষতি নেই — এখানেই শেখা" → "এবার একটু ফসকে গেছে — ঠিক আছে, ভুল থেকেই তো শেখা" (spot-the-scam; test expects the word "শেখা", still present); "এটি চোখ এড়িয়ে গিয়েছিল" → "এটি এবার চোখ এড়িয়ে গেছে"; Device message "সাবধান!" → "একটু সাবধান —". All quiz hints in m07–m13 were already gentle (they point to a clue rather than say "wrong").

### Glossary issues across all files (ids not changed)

- Same Bengali term with two ids (meanings consistent, but duplicates show up in the search list): `wifi` (m01) / `set-wifi` (m10); `printer` (m11) / `set-printer` (m10); `screenshot` (m11) / `screenshot-help` (m12); `copy`/`kb-copy`, `paste`/`kb-paste`, `cut`/`kb-cut` (m04/m05); `undo` (`kb-undo`, m05) / `undo-mistake` (m12, "আনডু (ভুল ফেরানো)"). Suggest merging, or at least making the second entry point to the first.
- `tab` (m07, browser tab) and `tab-key` (m05, Tab key) are different things with the same English name; fine, but make sure the Bengali shows "ট্যাব" vs "ট্যাব কী" (it does).
- The earlier duplicate id `restore` was already renamed (`restore-window` in m03, `restore` in m04). One Bengali pair still differs: "রিস্টোর (আগের মাপে ফেরানো)" vs "ফিরিয়ে আনা (রিস্টোর)"; acceptable because the meanings differ (window vs Recycle Bin).
- `domain` is defined in m07 and also listed in m08 `glossaryIds`; fine.

### Phrases a native speaker should double-check

| File | Phrase | Why |
|---|---|---|
| `lessons/m07.ts` and all safety text | "ঠকবাজ" (m07) vs "প্রতারক/প্রতারণা" (m08–m13) | Both are used; "ঠকবাজ" is more colloquial and slightly harsher. Decide whether to use "প্রতারক" everywhere (glossary uses "প্রতারণা"). |
| `lessons/m07.ts` | "ডাকঘর" and "রিকশা" analogies for internet and browser | Intended to be warm, but check they do not feel dated or confusing. |
| `lessons/m07.ts` | "সুরক্ষিত করে (এনক্রিপ্ট করে) পাঠানো" | New wording for https; check it reads simply enough. |
| `lessons/m08.ts` | "প্রিয় রিনা আপু," / "Dear Rina Apu," as a letter greeting example | Natural and secular; confirm tone. |
| `lessons/m09.ts` | "আড়াল করে না" (private browsing) | New wording, replacing "অচেনা করে না". |
| `lessons/m09.ts` | "সবচেয়ে জরুরি নিয়ম" | Replaces "সোনালি নিয়ম"; the older phrase was a calque. |
| `lessons/m09.ts` step `w-open-network`, `m-open-network` | "তালিকার তৃতীয় নামটি “CafeGuest”" | Depends on the simulation's list order (not verified). |
| `lessons/m10.ts` | "ওয়াই-ফাই যেন ইন্টারনেটে ঢোকার দরজা" and the "নিয়ন্ত্রণ ঘর" for Settings | Check the analogies sound natural. |
| `lessons/m10.ts` step `w-mute` (and widget `qs-mute`) | "ওপরের সারির তিন বোতামের তৃতীয়টি — Mute" | Real Windows 11 Quick settings has a volume slider with a speaker icon, not a separate "Mute" button; this matches only the simulation. Left as is (the existing "একটু আলাদা দেখাতে পারে" note covers it). |
| `lessons/m10.ts` checklist | "Windows: … Regional format → Change formats" for a 24-hour clock | Win11 menu naming varies by version; I am fairly (not fully) sure. |
| `lessons/m10.ts` | Mac "Date & Time" shown as a top-level pane in the sim vs General → Date & Time on real Macs | The lesson text already says so; verify on a real Mac. |
| `lessons/m11.ts` | "PrtScn চাপলে সরাসরি Snipping Tool খুলে যায়" | Depends on the Windows 11 setting "Use the Print screen button to open screen capture"; the default differs across builds. Wording is hedged. |
| `lessons/m11.ts` | "পুরো পর্দার ছবি ক্লিপবোর্ডে যায়" for plain PrtScn | Correct when the setting above is off. |
| `lessons/m11.ts` | Windows "Safely Remove Hardware" tray icon | In Windows 11 the icon is often inside the ^ (hidden icons) tray, and many USB sticks do not strictly need it; lesson keeps the safe habit. |
| `lessons/m11.ts` | "পেনড্রাইভ" for USB drive vs "ইউএসবি" in step text | Both used; check they feel consistent to the learner. |
| `lessons/m12.ts` | "ঘুরন্ত চাকা" for the Mac spinning wheel | Check this is the common phrase. |
| `lessons/m12.ts` step `m-ignored` | Mac window "ঘুরছে রঙিন চাকা (spinning wheel)" | The sim draws it; the real Mac cursor is the rainbow beach ball. Fine, but check it matches the simulation's art. |
| `lessons/m12.ts`, glossary `force-quit` | "আপেল-চিহ্নের মেনু (সিস্টেম মেনু)" | Describes the Apple menu without showing a logo; check the phrase is clear. |
| `lessons/m12.ts` step `w-go` | "এই বার্তাটি পড়ুন: এতে বলা আছে Wi-Fi চালু করতে হবে।" | Sim-specific message; real browsers say "No internet" differently. |
| `widgets/lib/scamCards.ts` | "মেগা লাকি ড্র", "রিমি (বান্ধবী)", "রুমা", "টাকাপে করো" | Fictional names/ idioms; confirm they sound realistic but not mocking. |
| `widgets/lib/scamCards.ts` `call-otp` | "হ্যালো ম্যাডাম, আমি নমুনা ব্যাংকের কাস্টমার কেয়ার থেকে বলছি" | Realistic scammer script in spoken Bengali; check tone. |
| `cheatsheets/safety-checklist.tsx` | "স্থানীয় থানা বা সরকারি সাইবার-নিরাপত্তা সংস্থা" | Deliberately generic (no helpline number given). Teacher may want to add the local official contact on the printout. |
| `pages/Certificate.tsx` | "আনন্দের সাথে জানানো হচ্ছে যে" … "সনদপত্র" heading | Warmer than "প্রত্যয়ন", but check it still reads as a proper certificate. |
| `pages/Home.tsx`, `Teacher.tsx` (carried over from the first review) | "✓ সম্পন্ন", "শীঘ্রই আসছে", "তালা দেওয়া" | Still unchanged; "শেষ হয়েছে" / "শিগগিরই" may sound warmer. |
| `lessons/m09.ts` | "পিছনে" (m07) vs "পেছনে"/"পেছনের" (m09–m12) | Both spellings are in use across the app (24 vs 13 in my count); pick one (the glossary uses "পিছনে"). |
