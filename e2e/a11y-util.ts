import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

export type Theme = 'light' | 'dark'
export type TextSize = 'normal' | 'large' | 'xlarge' | 'xxlarge'

/** Seed an onboarded learner with the given theme / text size (always, so every navigation keeps it). */
export async function seedA11y(page: Page, opts: { theme?: Theme; textSize?: TextSize; os?: 'windows' | 'mac'; onboarded?: boolean } = {}) {
  const { theme = 'light', textSize = 'normal', os = 'windows', onboarded = true } = opts
  await page.addInitScript(
    ([t, s, o, ob]) => {
      if (sessionStorage.getItem('seeded')) return
      sessionStorage.setItem('seeded', '1')
      if (!ob) return
      localStorage.setItem(
        'computer-shikhi:v1',
        JSON.stringify({
          version: 1,
          profile: { name: 'রুমা', os: o, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true },
          settings: { numerals: 'bengali', unlockAll: true, theme: t, textSize: s },
          modules: {},
        }),
      )
    },
    [theme, textSize, os, onboarded] as const,
  )
}

/** Run axe on the learner UI. The simulated OS chrome (a mock of real UIs) is excluded from the scan. */
export async function axeScan(page: Page) {
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('[data-sim-root]').analyze()
  return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
}

export function fmtViolations(vs: Awaited<ReturnType<typeof axeScan>>) {
  return vs.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 4).map((n) => n.target.join(' ') + ' :: ' + (n.any[0]?.message ?? n.all[0]?.message ?? '').slice(0, 140)).join(' | ')}`).join('\n')
}
