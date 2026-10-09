# PROJECT BRIEF

Non-negotiable rules for every stage. Source of truth for language, tone, safety, design, tech, accuracy.

# PROJECT SUMMARY
An interactive web app that teaches ONE specific learner how to use a computer (both Windows and macOS) and then prepares her to start programming. The learner is an 18-year-old Bengali-speaking girl, a complete beginner with Gen-Z digital habits (Instagram, TikTok, YouTube Shorts, Duolingo-style apps): short attention for text, loves visuals, video-like pacing and quick wins. She can use a phone well, but knows only very basic things on a computer. Her ultimate goal is to learn programming; learning to use the computer is step one. Her husband will sit beside her as teacher and will maintain the app.

# NON-NEGOTIABLE RULES (apply to every stage)
LANGUAGE
- All learner-facing text is in natural, simple, spoken-style Bengali (চলিত ভাষা), not bookish. Address her as "আপনি" (register chosen for the whole course: friendly-respectful "আপনি", consistently; the "didi" warmth comes from word choice, not from switching to "তুমি").
- Technical terms show a Bengali explanation plus the English term as it appears on screen, e.g. "ফোল্ডার (Folder)", "ডক (Dock)". Increase English tech vocabulary gradually in later modules.
- Maintain a searchable Bengali glossary ("শব্দকোষ").
TONE
- Warm, respectful, encouraging; a friendly older-sister/mentor voice (a smart "didi"), light and sometimes a tiny bit funny; never a stiff textbook voice, never baby-talk, never childish. Wrong answers get a gentle hint, never a harsh red error. Normalize mistakes.
- Praise messages should vary.
SAFETY
- Core concept: a safe SIMULATED Windows desktop and macOS desktop inside the browser, so she can never break a real computer. No real web requests; use simulated websites and email.
- Use generic look-alike SVG icons. No Microsoft or Apple logos or exact copyrighted artwork.
DESIGN
- Calm, welcoming, high-contrast. Bengali font: Noto Sans Bengali or Hind Siliguri (base 18–20px, generous line height). Verify যুক্তাক্ষর render correctly. Monospace font for code that renders Bengali text correctly.
- Large click targets (min 48px), keyboard accessible, prefers-reduced-motion respected, WCAG AA. Light and dark themes (default light). Laptop-first, responsive down to mobile.
TECH
- Front-end only. React + Vite + TypeScript + Tailwind CSS. No backend, no login, no analytics. Works offline (PWA). Progress in localStorage wrapped in try/catch, with JSON export/import.
- Lesson content lives in separate data files so the husband can edit lessons without touching engine code.
ACCURACY
- Target current Windows 11 and recent macOS. Verify every shortcut, menu name, path, and command; do not invent features. Where UI varies by version, add: "আপনার কম্পিউটারে একটু আলাদা দেখাতে পারে".

# LESSON PATTERN (every module)
(1) short Bengali explanation with an analogy or illustration, (2) guided step-by-step practice in the simulation, (3) free-practice task, (4) 3–5 question quiz, (5) "মনে রাখুন" summary card, (6) "এবার আসল কম্পিউটারে চেষ্টা করুন" with 2–3 safe real-world tasks, (7) optional "শিক্ষকের জন্য" teacher tip. Each lesson is 3–7 minutes.

# CURRICULUM OVERVIEW (20 modules)
PART 1 (Computer Foundations): 1 Meet the computer; 2 Desktop and screen; 3 Windows (open/close/resize/switch); 4 Files, folders, extensions, and PATHS; 5 Keyboard and typing (incl. programming symbols, Ctrl vs Cmd, Bengali keyboard); 6 Programs/apps, plain text, Save vs Save As; 7 Internet and browser; 8 Email and online accounts; 9 Safety and scams (Bangladesh context: bKash/Nagad/OTP fraud); 10 Settings and personalization; 11 Photos, media, screenshots, USB, printing; 12 Troubleshooting and searching for answers; 13 Part 1 capstone and certificate.
PART 2 (Programmer Readiness): 14 How computers work (input/processing/memory/storage, binary feel); 15 What programming is and which path to choose; 16 Computational thinking (sequence, decisions, loops; no code); 17 Terminal basics; 18 Programming tools setup (VS Code, Python/Node); 19 Reading tech English, reading errors, using docs/Google/AI as a learning aid; 20 First code (HTML, CSS, first Python or JavaScript program, mini-projects, next-steps roadmap, certificate).



# UX RULES (mandatory)
These rules were added in the readability overhaul and are enforced by `npm run audit:content`.
CONTENT / TEXT BUDGET
- ONE idea per card/screen. Never two concepts on one screen.
- Explanation card: max ~25 Bengali words (hard cap 35), at most 2 short sentences, simple spoken Bengali.
- Guided step instruction (coach bubble): max ~12 words, one action, starts with a verb ("এখানে ক্লিক করুন"). Hint: max ~15 words. Success message: max ~6 words.
- Quiz question: max ~20 words; each option max ~8 words; the explanation after answering max ~15 words.
- Anything longer goes behind a "আরও জানুন" expandable or a tooltip, never shown by default.
- Replace paragraphs with: one big visual + one short line, a 3-item chips list, a before/after comparison, or a tiny animation. Lists: max 3 items per screen. Highlight at most 2 key words per card (bold/chip).
- Analogies are a single punchy line plus an illustration.
VISUAL-FIRST
- Every explanation card has a visual (original flat SVG illustration, annotated mini-screenshot of the simulation, animated cursor demo, annotated animated code, or an interactive widget). Show-don't-tell: loop a 3–4 s mini-animation instead of describing an action.
FLOW AND PACING
- Lessons are a swipeable/tappable one-card-at-a-time flow (big "পরের ধাপ →" button, thin segmented progress bar, Space/→ keys, swipe, back button). Structure: hook card → 3–6 micro cards → guided practice (one action per step) → 3-question quiz → celebration card. A lesson over ~12 cards is split into two sub-lessons. Every module starts with a "quick win" within 10 seconds.
- Quizzes: one question per screen, big answer cards, instant gentle feedback.
- Celebrations are tasteful (sparkle/confetti, XP, streak flame, badges), respect prefers-reduced-motion. Daily goal card on Home.
VISUAL DESIGN
- Design tokens (colors, radius, spacing, shadows, type scale) live in one place (src/index.css). Violet/teal primary, warm coral accent, soft off-white background, deep ink text. Big rounded cards, ≥24px between blocks, heading 28–36px, body 20px, Bengali line-height ≥ 1.7, ONE primary button per screen. Micro-interactions < 300 ms (celebrations excepted). AA contrast, focus states and reduced motion stay mandatory.
- Teacher tips ("শিক্ষকের জন্য") are hidden behind a small toggle. Text-to-speech ("শুনুন") is a small icon button per card.
