#!/usr/bin/env node
// Fails (exit 1) when src/ contains anything that could talk to the network or a third party. See docs/PRIVACY.md.
//   npm run check:privacy
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')

/** Network-capable APIs. Allowed only where listed: the offline cache downloader (same-origin) and the runner sandbox, which merely names them to REMOVE them. */
const API_RULES = [
  { re: /\bfetch\s*\(/, allow: ['src/pwa/offline.ts'], why: 'fetch() — only the same-origin offline cache downloader may use it' },
  { re: /\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bsendBeacon\b|\bimportScripts\b/, allow: ['src/sim/runner/helpers.ts', 'src/sim/runner/jsWorkerSource.ts'], why: 'network API (allowed only in the runner sandbox that deletes them)' },
  { re: /google-analytics|googletagmanager|\bgtag\s*\(|mixpanel|segment\.(com|io)|sentry|hotjar|plausible\.io|posthog|amplitude|fullstory|clarity\.ms|datadog|newrelic|doubleclick\.net/i, allow: [], why: 'analytics / tracking' },
  { re: /<(script|link|img|iframe|source|video|audio)\b[^>]*\b(src|href)\s*=\s*["']?(https?:)?\/\//i, allow: [], why: 'external resource tag' },
  { re: /@import\s+(url\()?["']?https?:/i, allow: [], why: 'external CSS @import' },
  { re: /\bnavigator\.sendBeacon\b|\bnew\s+Image\s*\(\s*\)\.src\s*=\s*["']https?:/, allow: ['src/sim/runner/helpers.ts', 'src/sim/runner/jsWorkerSource.ts'], why: 'beacon / pixel' },
]

/** URLs are fine only when they are fictional (any `example` label: foo.example, example.com, www.example.com — reserved by IANA) or plain-text schemes without a host. */
const hostOk = (h) => h === '' || h === 'www.' || h === 'www.w3.org' || h.split('.').includes('example')

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === '__tests__' || name === 'node_modules') continue
      yield* walk(p)
    } else if (/\.(ts|tsx|css|html|js|mjs|json)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) yield p
  }
}

/** @returns {{file:string,line:number,text:string,why:string}[]} */
export function scanText(file, text) {
  const out = []
  text.split('\n').forEach((line, i) => {
    for (const r of API_RULES) if (r.re.test(line) && !r.allow.includes(file)) out.push({ file, line: i + 1, text: line.trim().slice(0, 140), why: r.why })
    for (const m of line.matchAll(/https?:\/\/([A-Za-z0-9.-]*)/g)) if (!hostOk(m[1].toLowerCase())) out.push({ file, line: i + 1, text: line.trim().slice(0, 140), why: `third-party URL host "${m[1]}"` })
  })
  return out
}

export function scanProject() {
  const files = [...walk(join(root, 'src')), join(root, 'index.html')]
  return files.flatMap((f) => scanText(relative(root, f).split(sep).join('/'), readFileSync(f, 'utf8')))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const bad = scanProject()
  if (bad.length) {
    console.error(`check:privacy — ${bad.length} problem(s):`)
    for (const b of bad) console.error(`  ${b.file}:${b.line}  ${b.why}\n    ${b.text}`)
    process.exit(1)
  }
  console.log('check:privacy — OK: no network APIs, trackers or third-party URLs in src/ and index.html')
}
