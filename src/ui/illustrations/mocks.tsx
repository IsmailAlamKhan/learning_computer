import type { FC } from 'react'
import { MOCK_NAMES, MOCK_REGIONS, type MockName } from './names'
import type { OsFlavor } from '../../engine/types'
import { defaultOs, MockSvg, type Box, type MockDef, type MockProps } from './mocks/kit'
import { macDesktop, macDockMock, macLaunchpad, macMenubar, macTitlebar, winDesktop, winStartMenu, winTaskbar, winTitlebar } from './mocks/desktops'
import { browser, contextMenu, fileExplorer, finder, mail, notepad, saveDialog } from './mocks/apps'
import { codeEditor, forceQuit, settingsMac, settingsWin, taskManager, terminalMac, terminalWin } from './mocks/tools'
import { keyboardKeys, pathBarMac, pathBarWin, urlBar } from './mocks/inputs'

export type { MockProps, Box }

/** One definition per MockName (drawing + highlightable regions). */
const DEFS: Record<MockName, MockDef> = {
  'win-desktop': winDesktop, 'mac-desktop': macDesktop, 'win-taskbar': winTaskbar, 'mac-dock': macDockMock, 'mac-menubar': macMenubar,
  'win-titlebar': winTitlebar, 'mac-titlebar': macTitlebar, 'win-start-menu': winStartMenu, 'mac-launchpad': macLaunchpad,
  'file-explorer': fileExplorer, finder, 'context-menu': contextMenu, 'save-dialog': saveDialog, notepad, browser, mail,
  'terminal-win': terminalWin, 'terminal-mac': terminalMac, 'code-editor': codeEditor, 'settings-win': settingsWin, 'settings-mac': settingsMac,
  'task-manager': taskManager, 'force-quit': forceQuit, 'keyboard-keys': keyboardKeys, 'url-bar': urlBar, 'path-bar-win': pathBarWin, 'path-bar-mac': pathBarMac,
}

const resolveOs = (name: MockName, os?: OsFlavor): OsFlavor => DEFS[name].fixedOs ?? (name.startsWith('win-') || name.endsWith('-win') ? 'windows' : name.startsWith('mac-') || name.endsWith('-mac') ? 'mac' : (os ?? defaultOs(name)))

/** Annotated mini-screenshots of the simulated OS: one component per MockName. `highlight` = one of MOCK_REGIONS[name]. */
export const MOCKS: Record<MockName, FC<MockProps>> = Object.fromEntries(
  MOCK_NAMES.map((n) => [n, (p: MockProps) => <MockSvg def={DEFS[n]} os={resolveOs(n, p.os)} highlight={p.highlight} className={p.className} />]),
) as Record<MockName, FC<MockProps>>

export const regionsOf = (name: MockName): readonly string[] => MOCK_REGIONS[name]

/** Bounding boxes (in the 480×300 drawing) of every region of a mock — used by the gesture demos to aim the cursor. */
export const regionBoxes = (name: MockName, os?: OsFlavor): Record<string, Box> => DEFS[name].regions(resolveOs(name, os))
export const mockTitleBn = (name: MockName): string => DEFS[name].titleBn
