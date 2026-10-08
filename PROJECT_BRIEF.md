# PROJECT BRIEF

Non-negotiable rules for every stage. Source of truth for language, tone, safety, design, tech, accuracy.

# PROJECT SUMMARY
An interactive web app that teaches ONE specific learner how to use a computer (both Windows and macOS) and then prepares her to start programming. The learner is an adult Bengali-speaking woman who is a complete beginner: she can use a mouse and type, and knows only very basic things. Her ultimate goal is to learn programming; learning to use the computer is step one. Her husband will sit beside her as teacher and will maintain the app.

# NON-NEGOTIABLE RULES (apply to every stage)
LANGUAGE
- All learner-facing text is in natural, simple, spoken-style Bengali (চলিত ভাষা), not bookish. Address her as "আপনি".
- Technical terms show a Bengali explanation plus the English term as it appears on screen, e.g. "ফোল্ডার (Folder)", "ডক (Dock)". Increase English tech vocabulary gradually in later modules.
- Maintain a searchable Bengali glossary ("শব্দকোষ").
TONE
- Warm, respectful, encouraging; never childish. Wrong answers get a gentle hint, never a harsh red error. Normalize mistakes.
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

