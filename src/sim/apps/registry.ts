import type { ComponentType, ReactNode } from 'react'
import type { OsFlavor } from '../../engine/types'
import type { WinState } from '../windowManager'

export interface AppDef {
  /** Stable id used in lessons: 'files', 'editor', 'browser', 'settings', 'bin', 'terminal', … */
  id: string
  /** Name as the real OS shows it (English): 'File Explorer' / 'Finder'. */
  title: (os: OsFlavor) => string
  /** Short Bengali explanation shown in tooltips/coach, e.g. 'ফাইল-ফোল্ডার দেখার প্রোগ্রাম'. */
  descriptionBn?: string
  icon: (p: { size?: number }) => ReactNode
  component: ComponentType<{ win: WinState }>
  defaultSize: { w: number; h: number }
  os?: OsFlavor | 'both'
  /** Opening again focuses the existing window (default true). */
  singleInstance?: boolean
}

const apps = new Map<string, AppDef>()

export function registerApp(def: AppDef) {
  apps.set(def.id, def)
}
export const getApp = (id: string) => apps.get(id)
export const appsFor = (os: OsFlavor) => [...apps.values()].filter((a) => !a.os || a.os === 'both' || a.os === os)
