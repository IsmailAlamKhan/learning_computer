import type { ReactNode } from 'react'

interface Option<T extends string> {
  value: T
  label: ReactNode
  sub?: ReactNode
}

/** Big, accessible radio-style choice buttons. */
export function Choice<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: T
  options: Option<T>[]
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-bold">{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-12 min-w-40 flex-1 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:outline-3"
            style={{ borderColor: 'var(--c-line)' }}
          >
            <input
              type="radio"
              className="mt-2 h-5 w-5 accent-[var(--c-brand)]"
              name={legend}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span>
              <span className="block font-medium">{o.label}</span>
              {o.sub && <span className="block text-sm text-muted">{o.sub}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
