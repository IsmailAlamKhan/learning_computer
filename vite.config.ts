import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitest/config'
import { PYODIDE_FILES } from './src/pwa/assets.ts'

const pyodideVersion: string = JSON.parse(readFileSync('node_modules/pyodide/package.json', 'utf8')).version

export default defineConfig({
  base: './',
  define: { __PYODIDE_VERSION__: JSON.stringify(pyodideVersion) },
  build: {
    // CodeMirror + its language packs (~530 kB, ~190 kB gzip) form one lazy chunk that loads only when the code editor opens.
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    {
      // index.html carries a strict Content-Security-Policy meta; the dev server needs inline scripts + a websocket, so drop it there.
      name: 'dev-no-csp',
      apply: 'serve',
      transformIndexHtml: (html: string) => html.replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>/, ''),
    },
    react(),
    tailwindcss(),
    // Self-hosted Pyodide (Python in the browser), pinned to the npm version; served at <base>/pyodide/ in dev and build.
    // Only fetched when a Python lesson runs (see docs/RUNNER.md).
    ...(process.env.VITEST
      ? []
      : [
          viteStaticCopy({
            targets: [
              {
                src: PYODIDE_FILES.map((f) => `node_modules/pyodide/${f}`),
                dest: 'pyodide',
                rename: { stripBase: true },
              },
            ],
          }),
        ]),
    // Offline support (docs/OFFLINE.md). The service worker is generated at build time only; dev never registers one.
    // Pyodide (~13 MB) is deliberately NOT precached: src/pwa fetches it in the background after the first idle load, and a
    // CacheFirst route covers anything requested before that finished.
    ...(process.env.VITEST
      ? []
      : [
          VitePWA({
            registerType: 'prompt', // a new version waits until the app is reopened; never reloads a lesson under her
            injectRegister: false, // registered by src/pwa/register.ts (workbox-window)
            devOptions: { enabled: false },
            includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
            manifest: {
              id: './',
              name: 'কম্পিউটার শিখি',
              short_name: 'কম্পিউটার শিখি',
              description: 'কম্পিউটার শেখা ও প্রোগ্রামিংয়ের প্রস্তুতি — বাংলায় একটি নিরাপদ ইন্টারেক্টিভ কোর্স',
              lang: 'bn',
              dir: 'ltr',
              start_url: './',
              scope: './',
              display: 'standalone',
              orientation: 'any',
              theme_color: '#0f766e',
              background_color: '#fbf8f3',
              categories: ['education'],
              icons: [
                { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
            workbox: {
              // app shell + every lazy JS/CSS chunk (lessons, widgets, sim apps, CodeMirror, runner glue, python worker) + fonts + icons
              globPatterns: ['**/*.{html,js,css,woff2,svg,png,webmanifest,ico}'],
              globIgnores: ['pyodide/**'],
              navigateFallback: 'index.html',
              cleanupOutdatedCaches: true,
              clientsClaim: true,
              runtimeCaching: [
                {
                  urlPattern: ({ url }) => url.pathname.includes('/pyodide/'),
                  handler: 'CacheFirst',
                  options: {
                    cacheName: `pyodide-${pyodideVersion}`,
                    cacheableResponse: { statuses: [200] },
                    // module/worker requests carry an `Origin` header that some hosts answer with `Vary: Origin`; the files never differ by it
                    matchOptions: { ignoreVary: true },
                  },
                },
              ],
            },
          }),
        ]),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
})
