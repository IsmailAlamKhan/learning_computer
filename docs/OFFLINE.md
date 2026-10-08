# Offline use (PWA)

After **one online visit** the whole app works with no internet: lessons, the simulator, quizzes, glossary, notebook, the code
editor, and running JavaScript and Python. It can also be installed like an app (Chrome/Edge: install icon in the address bar;
Safari: Share → Add to Dock / Home Screen). Progress is in `localStorage` and never needs a network.

## What is cached

| What | How | Size |
|---|---|---|
| App shell: `index.html`, every JS/CSS chunk (all lessons, widgets, simulator apps, CodeMirror, runner glue, `assets/pythonWorker-*.js`), the Noto Sans Bengali `.woff2` fonts, icons, manifest | Workbox **precache** (installed with the service worker, ~116 files) | ≈ 2.9 MB |
| Python runtime `pyodide/*` (6 files: wasm, asm.mjs, stdlib zip, lock json, pyodide.mjs, package.json) | **Not precached.** Downloaded in the background ~3 s after the first load finishes (when the browser is idle) into the cache `pyodide-<version>`; plus a runtime **CacheFirst** route for `/pyodide/` so a first Python run also fills the cache | ≈ 13.4 MB |

A small chip in the page footer shows the state: `⏳ অফলাইনের জন্য প্রস্তুত করা হচ্ছে…` → `✓ অফলাইনে ব্যবহার করা যাবে`
(on failure: a message with an `আবার চেষ্টা করুন` button; it also retries by itself when the connection returns). Nothing blocks
while it downloads. Until Python has been cached, only Python runs need the network; everything else is already offline.

Old `.woff` fallbacks are not precached (every browser that can install a PWA uses `.woff2`).

## Files

* `vite.config.ts` – `vite-plugin-pwa` (generateSW, `registerType: 'prompt'`, `injectRegister: false`, no dev SW), manifest, precache globs
  (`globIgnores: ['pyodide/**']`), the `/pyodide/` route. The plugin is skipped under Vitest.
* `src/pwa/offline.ts` – registers `sw.js` via `workbox-window` (production builds only), background Python download, update state.
* `src/ui/PwaStatus.tsx` – the footer chip and the update toast (mounted in `Layout.tsx`).
* `public/icons/*` – 192/512 PNG, maskable 512, apple-touch-icon; regenerate with `npm run icons` (renders `public/favicon.svg` through Chrome).
* Manifest: name `কম্পিউটার শিখি`, `start_url`/`scope` `./`, `display: standalone`, theme `#0f766e`, background `#fbf8f3`, `lang: bn`.

Works under any base path (`base: './'`, HashRouter): GitHub Pages sub-paths (`/repo/`), Netlify, Vercel, or a plain folder on a
server. The SW is registered as `<base>/sw.js` with scope `<base>/`. It needs a secure context: `https://` or `localhost`
(opening `index.html` from `file://` cannot use a service worker; the app still works online there).

## First-load requirement

The very first visit must be online and must stay open long enough for the install (a few seconds for the app files; about
10–60 s more on slow connections for the 13 MB Python download). Close the tab only after the chip shows `✓`.

## Updates

A new deployment is downloaded by the browser in the background; the old version keeps running (so a lesson in progress is never
reloaded). When the new version is waiting, a toast appears: `নতুন সংস্করণ এসেছে — পাতাটি নতুন করে খুলুন` with buttons
`এখনই নতুন করে খুলুন` (activates it and reloads) and `পরে`. Otherwise it takes over the next time all tabs/windows of the app
are closed and reopened. Old precaches are removed automatically; an old `pyodide-<version>` cache is deleted when the pinned
Pyodide version changes.

## How to verify

* Automated: `npx playwright test e2e/offline.spec.ts` (builds, loads, waits for `✓`, calls `context.setOffline(true)`, reloads, runs a
  guided step, runs JavaScript and Python in the editor, asserts no failed requests / console errors).
* By hand: `npm run build && npm run preview`, open the page once, wait for `✓`, then DevTools → Network → Offline (or stop the
  server) and reload. DevTools → Application → Service Workers / Cache Storage shows `workbox-precache-…` and `pyodide-…`.

## Clearing the cache / starting over

DevTools → Application → Storage → "Clear site data" (this also deletes saved progress – export a backup from Settings first).
Cache only: Application → Cache Storage → delete entries, and Service Workers → Unregister. For the learner: browser settings →
site data for this address. Uninstalling the installed app does not remove progress unless site data is cleared.
