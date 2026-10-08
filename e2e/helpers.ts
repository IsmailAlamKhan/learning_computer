import type { Page } from '@playwright/test'

export async function seedProfile(page: Page, os: 'windows' | 'mac', extra: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([o, ex]) => {
      if (localStorage.getItem('computer-shikhi:v1')) return
      localStorage.setItem(
        'computer-shikhi:v1',
        JSON.stringify({ version: 1, profile: { name: 'রুমা', os: o, motivation: 'ওয়েবসাইট বানাতে চাই', onboarded: true }, settings: { numerals: 'western', unlockAll: true }, modules: {}, ...(ex as object) }),
      )
    },
    [os, extra] as const,
  )
}

export const coach = (page: Page, id: string) => page.locator(`[data-sim-root] [data-coach="${id}"]`).first()

export async function startGuided(page: Page, module: number) {
  await page.goto(`/#/module/${module}`)
  await page.getByRole('button', { name: /হাতে-কলমে/ }).click()
  await page.getByRole('button', { name: /শুরু করি/ }).click()
}

export async function cont(page: Page) {
  await page.getByRole('button', { name: /বুঝেছি, পরের ধাপ/ }).click()
}
