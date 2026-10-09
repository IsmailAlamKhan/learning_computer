import type { Lesson } from '../../engine/types'

/** Lessons are lazy-loaded (code-split) from mNN.ts files in this folder; each exports a cards-format `Lesson`. */
const loaders = import.meta.glob<{ default: Lesson }>('./m*.ts')

export async function loadLesson(module: number): Promise<Lesson | null> {
  const key = `./m${String(module).padStart(2, '0')}.ts`
  const l = loaders[key]
  if (!l) return null
  return (await l()).default
}

export const hasLesson = (module: number) => `./m${String(module).padStart(2, '0')}.ts` in loaders
