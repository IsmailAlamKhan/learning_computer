import type { LegacyLesson, Lesson } from '../../engine/types'

/** A lesson file exports either the new cards format (`Lesson`) or, until its module is migrated, a `LegacyLesson`. */
export type AnyLesson = Lesson | LegacyLesson

/** Lessons are lazy-loaded (code-split) from mNN.ts files in this folder. */
const loaders = import.meta.glob<{ default: AnyLesson }>('./m*.ts')

export async function loadLesson(module: number): Promise<AnyLesson | null> {
  const key = `./m${String(module).padStart(2, '0')}.ts`
  const l = loaders[key]
  if (!l) return null
  return (await l()).default
}

export const hasLesson = (module: number) => `./m${String(module).padStart(2, '0')}.ts` in loaders
