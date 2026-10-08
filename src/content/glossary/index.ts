import type { GlossaryEntry } from '../../engine/types'

/**
 * Glossary ("শব্দকোষ") is assembled from one file per module: glossary/m01.ts ... m20.ts,
 * each `export default GlossaryEntry[]`. Adding a file registers it automatically.
 */
const files = import.meta.glob<{ default: GlossaryEntry[] }>('./m*.ts', { eager: true })

const all: GlossaryEntry[] = Object.values(files).flatMap((f) => f.default)

export const GLOSSARY: GlossaryEntry[] = [...all].sort((a, b) => a.termBn.localeCompare(b.termBn, 'bn'))

const byId = new Map(GLOSSARY.map((g) => [g.id, g]))
export const getGlossaryEntry = (id: string) => byId.get(id)
