// Renders public/favicon.svg into the PNG icons used by the PWA manifest (run: node scripts/gen-icons.mjs).
// Uses the installed Chrome via Playwright (no downloads).
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const svg = readFileSync('public/favicon.svg', 'utf8')
// inner glyph only (the white screen + bars) for full-bleed variants
const glyph = svg.replace(/^.*?<rect width="64" height="64" rx="14" fill="#0f766e"\/>/, '').replace('</svg>', '')
const plain = (size) => `<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`
// full-bleed teal square; glyph scaled into the central 60% (maskable safe zone is the inner 80% circle)
const bleed = (size, scale) =>
  `<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0f766e"/><g transform="translate(32 32) scale(${scale}) translate(-32 -32)">${glyph}</g></svg></body>`

const jobs = [
  ['public/icons/icon-192.png', 192, plain(192), true],
  ['public/icons/icon-512.png', 512, plain(512), true],
  ['public/icons/maskable-512.png', 512, bleed(512, 0.62), false],
  ['public/icons/apple-touch-icon.png', 180, bleed(180, 0.8), false],
]
const browser = await chromium.launch({ channel: 'chrome' })
for (const [file, size, html, transparent] of jobs) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(html)
  await page.screenshot({ path: file, omitBackground: transparent })
  await page.close()
  console.log('wrote', file)
}
await browser.close()
