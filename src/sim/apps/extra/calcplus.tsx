/** The pretend app that the simulated installer "installs": a tiny four-function calculator. */
import { useState } from 'react'

export const CalcPlusIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect x="8" y="4" width="32" height="40" rx="6" fill="#0f766e" />
    <rect x="13" y="9" width="22" height="9" rx="2" fill="#ccfbf1" />
    <g fill="#99f6e4">
      <circle cx="16" cy="25" r="2.6" />
      <circle cx="24" cy="25" r="2.6" />
      <circle cx="32" cy="25" r="2.6" />
      <circle cx="16" cy="33" r="2.6" />
      <circle cx="24" cy="33" r="2.6" />
      <circle cx="32" cy="33" r="2.6" />
    </g>
    <circle cx="16" cy="40" r="2" fill="#fcd34d" />
  </svg>
)

type Op = '+' | '-' | '×' | '÷'

export function compute(a: number, op: Op, b: number): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      return b === 0 ? NaN : a / b
  }
}

export function CalcPlus() {
  const [shown, setShown] = useState('0')
  const [acc, setAcc] = useState<number | null>(null)
  const [op, setOp] = useState<Op | null>(null)
  const [fresh, setFresh] = useState(true)

  const digit = (d: string) => {
    setShown((s) => (fresh || s === '0' ? d : s + d))
    setFresh(false)
  }
  const apply = () => {
    if (acc === null || !op) return Number(shown)
    return compute(acc, op, Number(shown))
  }
  const fmt = (n: number) => (Number.isNaN(n) ? 'Error' : String(Math.round(n * 1e9) / 1e9))
  const pickOp = (o: Op) => {
    const r = apply()
    setAcc(Number.isNaN(r) ? null : r)
    setShown(fmt(r))
    setOp(o)
    setFresh(true)
  }
  const equals = () => {
    const r = apply()
    setShown(fmt(r))
    setAcc(null)
    setOp(null)
    setFresh(true)
  }
  const clear = () => {
    setShown('0')
    setAcc(null)
    setOp(null)
    setFresh(true)
  }
  const btn = 'min-h-11 rounded bg-gray-100 text-lg hover:bg-gray-200'
  return (
    <div className="flex h-full flex-col gap-2 bg-white p-3 text-gray-900">
      <div data-coach="calcplus-display" aria-live="polite" className="min-h-14 rounded bg-gray-900 px-3 text-right text-3xl leading-14 text-white">
        {shown}
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', 'C', '=', '+'].map((k) => (
          <button
            key={k}
            type="button"
            data-coach={`calcplus-key-${k}`}
            className={btn}
            onClick={() => (k === 'C' ? clear() : k === '=' ? equals() : /\d/.test(k) ? digit(k) : pickOp(k as Op))}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
