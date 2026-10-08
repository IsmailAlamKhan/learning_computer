import { ARROW_KEYS, GROUP_INFO, isSpacer, keyboardRows, type KeyDef, type KeyboardOs } from '../../../lib/keyboardLayout'

const U = 44 // pixels per key unit
const GAP = 4

interface Props {
  os: KeyboardOs
  /** keys to emphasise with an orange ring (key ids) */
  highlight?: string[]
  /** key ids to dim */
  dim?: boolean
  /** colour keys by group */
  colorGroups?: boolean
  /** only show these groups in colour, grey the rest */
  activeGroup?: string | null
  selected?: string | null
  onKey?: (id: string) => void
  /** show Shift-layer characters on keys */
  showShift?: boolean
  title: string
}

/** A simple generic keyboard drawing (no brand artwork). US layout. */
export function KeyboardSvg({ os, highlight = [], colorGroups, activeGroup, selected, onKey, showShift = true, title }: Props) {
  const rows = keyboardRows(os)
  const cell = (key: KeyDef, x: number, y: number) => {
    const hi = highlight.includes(key.id)
    const sel = selected === key.id
    const inGroup = activeGroup ? key.group === activeGroup : true
    const fill = hi ? '#fde8d7' : colorGroups && inGroup ? GROUP_INFO[key.group].fill : '#f3f4f6'
    const w = key.w * U - GAP
    const two = key.shifted && key.shifted !== key.label.toUpperCase()
    const isLetter = key.group === 'letters'
    return (
      <g
        key={key.id}
        data-key={key.id}
        data-highlight={hi ? 'yes' : undefined}
        transform={`translate(${x},${y})`}
        onClick={onKey ? () => onKey(key.id) : undefined}
        onKeyDown={onKey ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onKey(key.id)) : undefined}
        role={onKey ? 'button' : undefined}
        tabIndex={onKey ? 0 : undefined}
        aria-label={onKey ? `কী: ${key.label}` : undefined}
        style={{ cursor: onKey ? 'pointer' : undefined }}
      >
        <rect width={w} height={U - GAP} rx={7} fill={fill} stroke={hi ? '#ea580c' : sel ? '#0f766e' : '#6b7280'} strokeWidth={hi ? 4 : sel ? 3.5 : 1.5} />
        {two && showShift && !isLetter ? (
          <>
            <text x={w / 2} y={15} textAnchor="middle" fontSize={12} fill="#374151">{key.shifted}</text>
            <text x={w / 2} y={31} textAnchor="middle" fontSize={13} fontWeight={600} fill="#111827">{key.label}</text>
          </>
        ) : (
          <text x={w / 2} y={(U - GAP) / 2 + 5} textAnchor="middle" fontSize={key.label.length > 3 ? 11 : 15} fontWeight={600} fill="#111827">
            {isLetter ? key.label.toUpperCase() : key.label}
          </text>
        )}
      </g>
    )
  }

  const nodes: React.ReactNode[] = []
  let y = 4
  rows.forEach((row, ri) => {
    let x = 4
    row.forEach((item) => {
      if (isSpacer(item)) {
        x += item.gap * U
        return
      }
      nodes.push(cell(item, x, y))
      x += item.w * U
    })
    y += U + (ri === 0 ? 8 : 0)
  })
  // arrows: right of the bottom two rows
  const ax = 4 + 15 * U + 10
  const ay = 4 + (U + 8) + 4 * U
  for (const a of ARROW_KEYS) {
    const key: KeyDef = { id: a.id, label: a.label, group: 'arrows', w: 1 }
    nodes.push(cell(key, ax + a.col * U, ay + a.row * U))
  }
  const width = ax + 3 * U + 4
  const height = y + 4
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role={onKey ? 'group' : 'img'} aria-label={title} className="h-auto w-full max-w-full" style={{ maxWidth: width }}>
      <title>{title}</title>
      {nodes}
    </svg>
  )
}

export function Keycap({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <kbd className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md border-2 px-2 text-sm font-semibold" style={{ borderColor: active ? 'var(--c-brand)' : 'var(--c-line)', background: 'var(--c-surface)', boxShadow: '0 2px 0 var(--c-line)' }}>
      {children}
    </kbd>
  )
}
