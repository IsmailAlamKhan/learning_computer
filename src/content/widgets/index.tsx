import { lazy, type ComponentType } from 'react'

/**
 * Interactive explanation widgets referenced by lessons: `{ kind: 'widget', widget: 'computer-parts', props }`.
 * Drop a file `src/content/widgets/<widget-id>.tsx` with a default-exported component — it is registered automatically
 * (and code-split). The widget id is the file name.
 */
const files = import.meta.glob<{ default: ComponentType<Record<string, unknown>> }>('./*.tsx')

export const WIDGETS: Record<string, ComponentType<Record<string, unknown>>> = {}
for (const [path, loader] of Object.entries(files)) {
  const id = path.replace('./', '').replace('.tsx', '')
  if (id === 'index') continue
  WIDGETS[id] = lazy(loader)
}
