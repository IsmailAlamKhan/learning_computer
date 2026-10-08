/** Pure logic of the simulated Setup wizards (Module 18): which pages each installer has, and file-name → tool. */
import type { OsFlavor } from '../../../engine/types'
import type { ToolId } from './toolState'

export type SetupTool = 'python' | 'node' | 'vscode'

export type PageId =
  | 'options' // Windows Python: "Install Now" + PATH checkbox
  | 'welcome'
  | 'license'
  | 'destination'
  | 'custom' // Windows Node / editor: features / additional tasks
  | 'ready'
  | 'uac' // Windows: "Do you want to allow this app to make changes?"
  | 'intro' // Mac pkg
  | 'readme'
  | 'type' // Mac pkg: Standard Install
  | 'password' // Mac: admin password
  | 'dmg' // Mac dmg: drag to Applications
  | 'installing'
  | 'done'

export function pagesFor(os: OsFlavor, tool: SetupTool): PageId[] {
  if (os === 'windows') {
    if (tool === 'python') return ['options', 'installing', 'done']
    if (tool === 'node') return ['welcome', 'license', 'destination', 'custom', 'ready', 'uac', 'installing', 'done']
    return ['license', 'destination', 'custom', 'ready', 'installing', 'done']
  }
  if (tool === 'python') return ['intro', 'readme', 'license', 'type', 'password', 'installing', 'done']
  if (tool === 'node') return ['intro', 'license', 'destination', 'type', 'password', 'installing', 'done']
  return ['dmg', 'installing', 'done']
}

export function nextPage(os: OsFlavor, tool: SetupTool, page: PageId): PageId {
  const pages = pagesFor(os, tool)
  const i = pages.indexOf(page)
  return pages[Math.min(pages.length - 1, i + 1)]
}

export const PRACTICE_PASSWORD = 'practice123'
export const passwordOk = (s: string) => s === PRACTICE_PASSWORD

/** The installer files the simulated download pages hand out (clearly fictional product names). */
export const INSTALLER_FILES: Record<OsFlavor, Record<SetupTool, string>> = {
  windows: {
    vscode: 'practice-editor-setup-x64.exe',
    python: 'practice-python-3.12.4-amd64.exe',
    node: 'practice-node-v22.12.0-x64.msi',
  },
  mac: {
    vscode: 'practice-editor-universal.dmg',
    python: 'practice-python-3.12.4-macos.pkg',
    node: 'practice-node-v22.12.0.pkg',
  },
}

export function toolForFile(fileName: string): SetupTool | null {
  const n = fileName.toLowerCase()
  if (!/\.(exe|msi|pkg|dmg)$/.test(n)) return null
  if (n.startsWith('practice-python-')) return 'python'
  if (n.startsWith('practice-node-')) return 'node'
  if (n.startsWith('practice-editor-')) return 'vscode'
  return null
}

export const TOOL_NAME: Record<SetupTool, string> = { python: 'Practice Python', node: 'Practice Node.js', vscode: 'Practice Editor' }
export const TOOL_VERSION: Record<SetupTool, string> = { python: '3.12.4', node: '22.12.0', vscode: '1.0' }
export const asToolId = (t: SetupTool): ToolId => t

/** Does an installation of this tool count as "found by the terminal"? Windows Python needs the PATH box ticked. */
export const needsPath = (os: OsFlavor, tool: SetupTool) => os === 'windows' && tool === 'python'
