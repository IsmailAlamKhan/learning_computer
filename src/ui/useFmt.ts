import { useProgress } from '../state/store'
import { num, formatDateBn } from '../lib/numerals'

/** Number/date formatters that follow the learner's numeral setting. */
export function useFmt() {
  const { settings } = useProgress()
  return {
    n: (v: number | string) => num(v, settings.numerals),
    date: (d: Date | string) => formatDateBn(d, settings.numerals),
  }
}
