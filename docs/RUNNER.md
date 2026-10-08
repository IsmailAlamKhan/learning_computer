# Code runner (`src/sim/runner`)

Sandboxed execution of learner code for the practice editor/terminal. Contract: `src/sim/runner/types.ts`.

```ts
import { runCode, warmUp, translateError } from '@/sim/runner' // relative path in this repo
const r = await runCode({ language: 'python', code, inputs: ['রিনা'], timeoutMs: 5000 })
// r.ok / r.output / r.error {name,message,line?,raw} / r.needInput {prompt} / r.timedOut / r.durationMs
if (r.error) translateError('python', r.error) // {titleBn, explanationBn, tryBn}; show r.error.message (English) beside it
```

`runCode` never throws. Importing `src/sim/runner` pulls in only small glue code (~10 kB, plus ~33 kB for the Bengali error table); Pyodide is never part of the app
bundle, it is fetched at run time when the first Python run (or `warmUp('python')`) happens.

## Input: the REPLAY strategy
`input()` / `prompt()` consume `req.inputs` in order. When the program asks for one more answer than given, the run is
aborted and `{ok:false, output:'', needInput:{prompt}}` is returned (output printed so far is discarded). The UI shows its
prompt box, appends the answer to `inputs` and calls `runCode` again with the same code. The prompt text is **not** echoed
into the output (neither language); `alert(msg)` prints `msg`. No SharedArrayBuffer is needed, so any static host works.

## JavaScript
* One fresh Web Worker per run, created from a Blob URL (`jsWorkerSource.ts`, no external files), terminated afterwards.
* Learner code runs as `(async () => {<code>\n})()` through indirect `eval` with `//# sourceURL=learner.js` — the wrapper sits
  on the first code line so stack frames `learner.js:LINE` equal the learner's line; top-level `await` works.
* `console.log/info/warn/error` (strings raw, other values node-inspect-like), `prompt`, `alert`, `confirm` (always true).
* Sandbox: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `importScripts`, `indexedDB`, `caches`, `BroadcastChannel`,
  `Worker`, `SharedWorker`, `navigator.sendBeacon` and `postMessage` (also on the prototypes) are removed before user code.
* SyntaxError line: Chrome gives no line for eval'd syntax errors, so it is found by compiling growing prefixes (best effort;
  "unfinished" code reports the last line, an unclosed `console.log(` reports the line it opened).
* Output cap 100 000 chars (the run is aborted with `OutputLimitExceeded`).

## Python
**Decision: Pyodide, self-hosted via the npm package + `vite-plugin-static-copy` — not a CDN.**
Why not CDN: privacy (no third-party requests from a child-friendly course), offline use (PWA/service worker can precache
same-origin files), pinned and reproducible (version = `pyodide` in package.json, currently 314.0.7).

* `vite.config.ts` copies `pyodide.asm.wasm`, `pyodide.asm.mjs`, `python_stdlib.zip`, `pyodide-lock.json`, `pyodide.mjs`,
  `package.json` from `node_modules/pyodide` to `<base>/pyodide/` (works for `npm run dev` and `npm run build`; skipped under Vitest).
  Size ≈ 13.4 MB (wasm 9.6 MB, stdlib 2.5 MB, asm 1.25 MB); loaded lazily, only when a Python run / `warmUp('python')` happens.
* The main thread computes the absolute `indexURL` (`new URL('pyodide/', document.baseURI)`) and sends it to
  `pythonWorker.ts` (a Vite-bundled module worker, ~5 kB), which does `import(indexURL + 'pyodide.mjs')`.
* **Service worker (stage 7):** precache `pyodide/*` (the six files above) plus the hashed `assets/pythonWorker-*.js`.
  Everything is same-origin, so nothing else is needed for offline Python.
* One long-lived worker/interpreter; runs are serialised. Each run uses a fresh globals dict (no state leaks), restores
  stdout/stderr/stdin, and `input` is replaced only inside the learner's builtins copy.
* Errors: tracebacks are formatted from the learner's `<exec>` frames only (internal frames removed), then parsed
  (`parsePythonTraceback`) into `{name, message, line}`. `exit()`/`sys.exit()` ends the run quietly.
* Network: `js`, `pyodide_js`, `pyodide` (incl. `pyodide.http`), `micropip`, `pyodide_http` cannot be imported by learner code
  (import hook active only during the run), and after Pyodide has loaded, `fetch`, `XMLHttpRequest`, `WebSocket`, … are shadowed
  with `undefined` inside the worker.
* Timeout (default 5000 ms, counted from when Pyodide is ready, so first-run load time is not charged): the worker is
  `terminate()`d and the next run creates a fresh worker + Pyodide lazily (~1 s locally from cache).
* **Fallback:** if Pyodide fails to load (404, offline without cache, 120 s load timeout) the run returns
  `{ok:false, error:{name:'RunnerUnavailable', ...}}` (friendly Bengali via `translateError`); the next run retries.
* Output cap 100 000 chars (`OutputLimitExceeded`).

## Friendly errors (`errors.ts`)
`translateError(language, err)` → `{titleBn, explanationBn, tryBn}`: rule table (error name + message regex) for the common
beginner errors of both languages, blame-free, with the line as `লাইন ৩-এ` when known and a generic fallback. The UI should
always also show the original English `err.message` (and `err.raw` under "details").

## Testing
`registerWorkerFactory(language, factory | null)` injects a fake `WorkerLike` (see `__tests__/host.test.ts`; resets a live
Python worker). `__tests__/python.test.ts` runs the real Pyodide in Node (shares one instance, ~1 s load);
`__tests__/jsWorker.test.ts` evaluates the real JS worker script in a `vm` context.
