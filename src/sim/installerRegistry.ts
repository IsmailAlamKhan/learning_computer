/**
 * Registry of simulated installer files: double-clicking a downloaded `.exe/.msi/.pkg/.dmg` whose name matches a
 * registered pattern opens the registered app (a Setup wizard) instead of the generic "can't be opened" toast.
 *
 *   registerInstallerHandler(/^practice-python-.*\.exe$/i, 'm18setup', (fileName) => ({ fileName }))
 */
export interface InstallerHandler {
  match: RegExp
  appId: string
  props?: (fileName: string) => Record<string, unknown>
}

const handlers: InstallerHandler[] = []

export function registerInstallerHandler(match: RegExp, appId: string, props?: InstallerHandler['props']) {
  const i = handlers.findIndex((h) => h.match.source === match.source && h.match.flags === match.flags)
  const h = { match, appId, props }
  if (i >= 0) handlers[i] = h
  else handlers.push(h)
}

/** The app (and window props) that should open this file, if it is a registered installer. */
export function installerFor(fileName: string): { appId: string; props: Record<string, unknown> } | null {
  for (let i = handlers.length - 1; i >= 0; i--) {
    const h = handlers[i]
    if (h.match.test(fileName)) return { appId: h.appId, props: { fileName, ...(h.props?.(fileName) ?? {}) } }
  }
  return null
}
