# Manual QA checklist

A practical list for the teacher or any tester. Print it or copy it, and tick `[x]` as you go. Write the date, the
browser and the computer at the top of each run. Report anything odd as: **where** (module/step), **what you did**,
**what you expected**, **what happened** (a screenshot helps).

Run date: ____________  Tester: ____________  Computer: ____________  Browser + version: ____________

Tip: use a **fresh browser profile or a private window** for the first-run sections so old data does not hide problems.
Automated tests cover a lot (`npm test`, `npm run e2e`) but cannot judge Bengali wording, readability, touch feel or
printing; those need your eyes.

---

## 1. Install and first run

- [ ] Open the site (or run `npm run dev` and open the address). The page loads with no blank screen.
- [ ] The page title and the header show "কম্পিউটার শিখি".
- [ ] A new visitor lands on the welcome screen automatically.
- [ ] No error appears in the page; (optional) the browser console shows no red errors.
- [ ] After a hard refresh the app still opens and the address looks like `.../#/welcome` or `.../#/` (hash routing).
- [ ] The site works from the final hosting address (Netlify/Vercel/GitHub Pages), not only on your computer.

## 2. Onboarding

- [ ] Step 1: welcome text is readable; "পরের ধাপ" stays disabled until a name is typed.
- [ ] Step 2: Windows / Mac choice; each option explains how to recognise it.
- [ ] Step 3: choosing a bigger text size changes the whole page immediately; the sample line is comfortable to read.
- [ ] Step 4: the goal note is optional; "শুরু করি" finishes.
- [ ] Home greets "স্বাগতম, <name>!" and shows the goal as a quote.
- [ ] Reload: the greeting, name, text size and goal are still there (no onboarding again).
- [ ] Settings: change the name, theme, text size, numerals, then reload; all changes stayed.
- [ ] "আজকের পাঠ" opens Module 1 (or the next unfinished one).

## 3. The 20 modules on both computers

For **each module and each OS** (switch with the "Windows / Mac" buttons at the top of the lesson), check the common
items below, then the module's own focus. Mark `[x]` in the table when everything passes, and note problems underneath.

### Common items for every module

- [ ] **Explanation** is clear, in natural spoken Bengali with "আপনি"; English terms appear next to Bengali ones.
- [ ] **Guided practice** starts; the coach bubble points at the right thing (ring + moving cursor).
- [ ] **Coach pointing:** the ring is on the correct button/icon, not slightly off, and the bubble never hides the target.
- [ ] **Hint after about 10 seconds** of doing nothing (gentle text, not an error).
- [ ] **"দেখিয়ে দিন" after about 20 seconds**; pressing it shows the correct action animated.
- [ ] **"আমি আটকে গেছি"** shows a simpler explanation.
- [ ] A wrong click does not break anything and does not scold; the coach stays calm.
- [ ] The step advances **only** when the right thing is done; a short varied praise appears.
- [ ] The progress bar (n / total) moves; finishing shows "সব ধাপ শেষ".
- [ ] **Free practice**: the sandbox works; the tick list can be ticked; the reset button restores the computer.
- [ ] **Quiz**: 3-5 questions; a wrong answer shows a gentle hint and allows another try; a right answer shows the
      explanation; the final score is shown (e.g. 4/5).
- [ ] **Summary card** ("মনে রাখুন") and the "add to notebook" button work.
- [ ] **Real-world tasks** can be ticked and stay ticked after a reload.
- [ ] **Teacher tip** ("শিক্ষকের জন্য") opens and is useful.
- [ ] "পাঠ সম্পন্ন করি" is disabled until all guided steps and the quiz are done, then completes the module and the
      next module unlocks on Home.
- [ ] Nothing in the lesson text is religion-specific, harsh or childish; no real brand/phone number appears in scam examples.

### Per-module table

| # | Module | Windows | Mac | Key things to check |
|---|---|:-:|:-:|---|
| 1 | কম্পিউটারের সাথে পরিচয় | [ ] | [ ] | Computer-parts widget (13 parts clickable + challenge); touchpad practice; power screen (sleep/wake/restart/shutdown) |
| 2 | ডেস্কটপ ও স্ক্রিন | [ ] | [ ] | Click, double click, right click, drag; Start/Taskbar vs Menu bar/Dock/Launchpad; drag-to-match quiz question |
| 3 | উইন্ডো | [ ] | [ ] | Move, resize, minimise, maximise, close; Alt+Tab / Cmd+Tab via the on-screen shortcut pad |
| 4 | ফাইল, ফোল্ডার ও পথ | [ ] | [ ] | Create/rename/move/copy/delete/restore; file extensions; path-explorer widget; address bar / Go to Folder; long lesson (two sittings) |
| 5 | কিবোর্ড ও টাইপিং | [ ] | [ ] | Typing practice, symbol drill, shortcut table, keyboard-layout widget; adding and switching the Bangla keyboard; printable shortcuts sheet |
| 6 | প্রোগ্রাম ও অ্যাপ | [ ] | [ ] | Notepad/TextEdit write and save; Save vs Save As; install and uninstall the pretend app; long lesson |
| 7 | ইন্টারনেট ও ব্রাউজার | [ ] | [ ] | Search results and ads; recipe/news sites; scam prize page with look-alike address; padlock; download page ad trap |
| 8 | ইমেইল ও অনলাইন অ্যাকাউন্ট | [ ] | [ ] | Compose, attach a file, reply/forward, spam folder, save attachment; sign-up form widget; password habits |
| 9 | নিরাপত্তা ও প্রতারণা থেকে সাবধান | [ ] | [ ] | Password-strength widget, spot-the-scam cards (fictional), phishing-link check, lock/unlock steps, safety cheat sheet |
| 10 | সেটিংস ও নিজের মতো সাজানো | [ ] | [ ] | Wallpaper, volume, dark mode, Wi-Fi with the practice password, Bluetooth pairing, printer, time zone, language; long lesson |
| 11 | ছবি, মিডিয়া, স্ক্রিনশট ও ডিভাইস | [ ] | [ ] | Photo viewer, media player; screenshots (PrtScn/Win+Shift+S vs Cmd+Shift+3/4/5); USB insert/eject; phone copy; print dialog and queue |
| 12 | সমস্যায় পড়লে কী করবেন | [ ] | [ ] | Frozen app + Task Manager / Force Quit; restore a deleted file; error search forum; troubleshooting decision tree |
| 13 | পর্ব ১-এর সমাপনী প্রকল্প | [ ] | [ ] | Capstone checklist ticks as steps complete; Part 1 certificate appears; certificate prints on A4 landscape |
| 14 | কম্পিউটার আসলে কীভাবে কাজ করে | [ ] | [ ] | Toggle-bits, input-process-output and kitchen-analogy widgets; file sizes shown; analogies understandable |
| 15 | প্রোগ্রামিং কী ও কেন | [ ] | [ ] | Exact-instructions robot, language cards, path chooser; encouraging tone about starting |
| 16 | কম্পিউটারের মতো ভাবা (কোড ছাড়া) | [ ] | [ ] | Order puzzle, flowchart builder (validation), if-else explorer, loop counter; no code needed |
| 17 | টার্মিনালের প্রথম পাঠ | [ ] | [ ] | Type pwd/dir or ls/cd/mkdir/echo; Tab completion; history (up arrow); blocked `rm`/`del` explained; prompt-anatomy widget; terminal cheat sheet |
| 18 | প্রোগ্রামিংয়ের টুল সাজানো | [ ] | [ ] | Fictional official download sites with ad traps; simulated installers incl. PATH checkbox; extensions; `python`/`node` only work after install; setup checklist sheet |
| 19 | টেক ইংরেজি পড়া ও আটকে গেলে করণীয় | [ ] | [ ] | Tech-words, error-reader, question-builder widgets; fake Q&A sites; notebook button on summary; AI-helper advice sensible |
| 20 | প্রথম কোড | [ ] | [ ] | 11 chapters: HTML x3, CSS x2, Python x4, 2 mini-projects; preview updates live; Python runs (first run 1-2 s) and friendly Bengali error; Part 2 certificate; next-steps page; HTML and Python cheat sheets |

Notes on failures:

```
Module __ / OS ____ / step ____ :

```

## 4. Language and display

- [ ] **যুক্তাক্ষর** render correctly everywhere (check: ক্ষ, ঙ্গ, ন্দ, স্ত, ক্ত, ঞ্জ, র‍্য, ত্র, শ্র, হ্ম, ষ্ণ): in headings, body text,
      buttons, the code editor and the terminal. No broken boxes, no detached vowel signs (ি ে ো).
- [ ] Bengali numerals (১২৩) and Western numerals (123) both work from Settings and are used consistently
      (progress counts, dates, step counters, Teacher page).
- [ ] The simulated OS text is English (like a real English-language Windows/Mac); the coach and tooltips are Bengali.
- [ ] **Text sizes:** all four sizes are usable; no text is cut off or overlaps; buttons stay at least about 48 px.
- [ ] **Light and dark themes:** every page is readable in both; contrast is comfortable; nothing is invisible
      (check the quiz, coach bubble, tables, Teacher page, certificates).
- [ ] Spelling and grammar look right (note any typos with the module and step).

## 5. Keyboard-only use

- [ ] Tab moves through the header links, lesson sections, buttons and form fields in a sensible order; a visible focus
      outline is always shown.
- [ ] "মূল অংশে যান" (skip link) appears on first Tab press and works.
- [ ] Dialogs (Help, reset confirmation) can be opened, used and closed with the keyboard (Esc closes).
- [ ] The quiz can be completed without a mouse (including ordering with the up/down buttons).
- [ ] Onboarding and Settings can be completed without a mouse.
- [ ] In the simulator, shortcut steps work with real keys and with the on-screen shortcut pad.

## 6. Small screens and layout

- [ ] Resize the browser narrow (about 360-420 px wide) or use a phone: no sideways page scrolling on Home, Settings,
      Glossary, Notebook; menus wrap.
- [ ] Lessons are usable on a tablet; the simulator scales or scrolls sensibly (full practice is intended for a laptop).
- [ ] Wide tables (Teacher page, cheat sheets) scroll inside their box instead of breaking the page.
- [ ] Zoom the browser to 200%: still usable.

## 7. Printing (use the browser's Print dialog; A4)

- [ ] **Cheat sheets** (shortcuts, safety, terminal, setup checklist, HTML, Python): fits A4, tables not split badly,
      Bengali text sharp, buttons/menus hidden.
- [ ] **Certificate, Part 1 and Part 2:** printed A4 **landscape** with "Background graphics" on; name, Bengali date and
      border look right; one page only.
- [ ] **Habit sheet** (30-minute daily plan on the "what next" page): one clean A4 page.
- [ ] **Teacher page:** printed summary is readable and fits A4 (landscape); the buttons are not printed.
- [ ] Print preview in dark theme still prints dark text on white paper.

## 8. Offline mode and installing

See [OFFLINE.md](OFFLINE.md).

- [ ] First visit online: page loads; wait about a minute (and run one Python example).
- [ ] Turn off the network (Wi-Fi off or DevTools -> Network -> Offline) and reload: the app still opens.
- [ ] Offline: open a lesson, do guided steps, take a quiz; open Module 20 and run Python (works if the engine was cached).
- [ ] Progress saved while offline is still there when back online.
- [ ] Install as an app (Chrome/Edge install icon, or Safari File -> Add to Dock); it opens in its own window; the icon
      and name look right.
- [ ] After the site is updated, the installed app picks up the new version after being closed and reopened, and she is
      never thrown out of a lesson in the middle.
- [ ] No request leaves the site: DevTools -> Network shows only same-origin files.

## 9. Export, import and reset

- [ ] Settings -> "⬇ ব্যাকআপ নামান" saves `computer-shikhi-backup-<date>.json`; the message confirms it.
- [ ] "অগ্রগতি মুছে নতুন করে শুরু" asks for confirmation first; "না, থাক" keeps everything; "হ্যাঁ" clears progress but
      keeps the name and settings.
- [ ] "⬆ ব্যাকআপ ফিরিয়ে আনুন" with the saved file brings the progress back (check Home and the Teacher page).
- [ ] Importing a wrong file (a photo renamed .json, a text file) shows a gentle message and changes nothing.
- [ ] "সবকিছু মুছে ফেলুন" asks first, then returns to the welcome screen.
- [ ] A backup from this computer can be restored on another computer/browser.
- [ ] In a private window or with storage blocked, the app still works and Settings says progress cannot be saved.

## 10. Notebook, glossary, cheat sheets

- [ ] **Notebook:** create a note from a template and from scratch; it autosaves; search finds it; delete asks first;
      notes survive reload and appear in the backup; the count shows on the Teacher page.
- [ ] "Add to notebook" on a summary card creates a note.
- [ ] **Glossary:** search works in Bengali and English; partial words match; terms from a lesson's "new words" are found;
      meanings are simple.
- [ ] Cheat-sheet list opens every sheet; "ছাপুন" works.

## 11. Teacher dashboard (`#/teacher`, also linked from Help and Settings)

- [ ] The explanation says that data lives only in this browser and how to back up.
- [ ] Overall "X/20 পাঠ সম্পন্ন" and the Part 1 / Part 2 bars match what Home shows.
- [ ] Each module row shows status as **words and a symbol** (not colour only): শুরু হয়নি / চলছে / সম্পন্ন.
- [ ] Completion date and last-visited date look right (and "আজ / গতকাল / n দিন আগে").
- [ ] Windows steps and Mac steps (n/total) match what you actually did on each OS.
- [ ] Quiz shows best and last score and wrong attempts; a score under 60% is flagged.
- [ ] Deliberately get a quiz question wrong several times: it appears under "যেখানে একটু সাহায্য দরকার" with the question
      text, the lesson link and "এই পাঠটি আবার দেখুন".
- [ ] Recent activity lists the last visited modules; certificates and notebook count are right.
- [ ] "ব্যাকআপ নামান (JSON)" and "রিপোর্ট নামান (HTML)" both download; the HTML report opens and reads well.
- [ ] "ছাপুন (A4)" gives a tidy printout.
- [ ] With a brand-new profile the page shows friendly empty states.

## 12. Browsers

Repeat the core flow (onboarding, one GUI module, one quiz, Module 17 terminal, Module 20 Python, export/import, print a
cheat sheet) in each browser and note the version:

| Browser | Version | Loads | Onboarding | GUI module | Terminal | Python run | Export/import | Offline | Print | Notes |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| Chrome | | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Edge | | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Safari (Mac) | | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Firefox | | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |

Known differences to expect: Firefox does not install web apps; Safari has a stricter storage policy (data may be
cleared after a week without a visit unless the app is added to the Dock/Home Screen, so back up regularly).

## 13. Accuracy spot-check on a real computer

For the "এবার আসল কম্পিউটারে চেষ্টা করুন" tasks and shortcuts, try each on the real Windows 11 and a recent macOS:

- [ ] Every shortcut mentioned in the lessons works (Win+D, Alt+Tab, Win+L, Ctrl+Shift+Esc, Cmd+Space, Cmd+Shift+4 ...).
- [ ] Every menu/setting name matches what the real computer shows (or the "একটু আলাদা দেখাতে পারে" note is present).
- [ ] Every terminal command and install step in modules 17 and 18 works as written on a real computer.
- [ ] Nothing in the real-world tasks could harm the computer or her data.

## Sign-off

- [ ] All sections above passed, or the failures are written down with module/step.
- [ ] A fresh backup of the progress file was saved after testing.
- [ ] Test data was cleared (Settings -> "সবকিছু মুছে ফেলুন") before handing the computer to the learner.
