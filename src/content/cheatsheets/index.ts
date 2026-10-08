import type { ComponentType } from 'react'

export interface CheatSheet {
  id: string
  titleBn: string
  Component: ComponentType
}

/** Printable cheat sheets: a file `src/content/cheatsheets/<id>.tsx` default-exporting a CheatSheet is auto-registered. */
const files = import.meta.glob<{ default: CheatSheet }>('./*.tsx', { eager: true })

export const CHEATSHEETS: CheatSheet[] = Object.values(files).map((f) => f.default)
export const getCheatSheet = (id: string) => CHEATSHEETS.find((c) => c.id === id)
