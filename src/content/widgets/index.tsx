import type { ComponentType } from 'react'

/**
 * Interactive explanation widgets referenced by lessons: `{ kind: 'widget', widget: 'computer-parts' }`.
 * Register new widgets here (lazy components are fine).
 */
export const WIDGETS: Record<string, ComponentType<Record<string, unknown>>> = {}
