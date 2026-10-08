# Privacy

The course is a front-end-only app: no backend, no login, no analytics, no cookies, nothing leaves the computer. Progress,
name and notebook live in `localStorage` (export/import JSON from Settings).

## What the network is used for

Only to load the app itself from the address it is hosted at: HTML, JS/CSS, fonts (`@fontsource`, bundled – no Google Fonts),
icons, and the self-hosted Python runtime under `/pyodide/` (no CDN). After the first visit the service worker serves all of it
from the cache (docs/OFFLINE.md). The simulated browser, mail and "internet" are fake pages inside the app; their addresses use
the reserved `.example` domains and make no requests.

## How it is enforced

1. **Content-Security-Policy** (`<meta>` in `index.html`; removed only in `vite dev`, where HMR needs a websocket):
   `default-src 'self'`, `connect-src 'self'`, `font-src 'self' data:`, `img-src 'self' data: blob:`, `frame-src 'self' blob: about: data:`,
   `worker-src 'self' blob:`, `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `manifest-src 'self'`. So even a
   bug or learner code cannot contact another host, load a foreign image/font/frame, or submit a form.
   `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:` is looser on purpose, because the *features need it*:
   * `'wasm-unsafe-eval'` – Pyodide (WebAssembly).
   * `'unsafe-eval'` – the JavaScript runner worker (a Blob worker inherits the page policy) runs learner code with `eval`; code runs in
     the editor failed in a test when it was removed.
   * `'unsafe-inline'` – the sandboxed live-preview iframe (`srcdoc`) inherits the page policy and must run the learner's inline
     `<script>`s. The iframe is `sandbox="allow-scripts"` (opaque origin, no storage, no top navigation) and has its own stricter
     CSP; the page policy still blocks every network connection from it.
   Nothing here weakens privacy because no remote script can be loaded (`'self'` only; no `https:`/hosts in any directive).
2. **Runner sandbox** (docs/RUNNER.md): `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `importScripts`,
   `indexedDB`, `caches`, … are removed from the JS worker; Python cannot import `js`/`pyodide`/`micropip` and the worker's network
   globals are shadowed.
3. **Source guard** – `npm run check:privacy` (`scripts/check-privacy.mjs`, also run by Vitest in `tests/privacy.test.ts`) fails if `src/`
   or `index.html` contain `fetch(` (except the same-origin offline downloader `src/pwa/offline.ts`), `XMLHttpRequest`, `WebSocket`,
   `EventSource`, `sendBeacon`, `importScripts` (except the sandbox files that *remove* them), analytics/tracker names, external
   `<script>/<link>/<img>` tags, CSS `@import` of URLs, or any `http(s)://` host that is not fictional (any `example` label:
   `*.example`, `example.com`, `www.example.com`).
4. **Playwright** (`e2e/privacy.spec.ts`): records every request of the page, workers and service worker while visiting
   onboarding, home, a lesson with the simulator, the browser module, JavaScript + Python runs and the settings export; asserts
   every URL is same-origin (or `data:`/`blob:`), that there are no console errors or CSP violations, and that a `fetch`/`Image` to
   `https://example.org` is really blocked by the CSP.

## Third-party names that appear (text only)

`https://example.com` / `*.example` in sample HTML and fake sites; `python.org`, `code.visualstudio.com`, `nodejs.org` (lesson 18
text and the fictional lookalike-address exercises), "MDN Web Docs" and "python.org documentation" in cheat sheets/next steps.
All are plain text for the learner to type herself; none is a link or a request.
