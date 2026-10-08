import type { NumeralStyle } from '../state/progress'

const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

/** Convert digits in a string/number to the chosen numeral style. */
export function num(value: number | string, style: NumeralStyle): string {
  const s = String(value)
  if (style === 'western') return s
  return s.replace(/[0-9]/g, (d) => BN[Number(d)])
}

/** Convert Bengali digits back to ASCII digits (for parsing user input). */
export function toAscii(s: string): string {
  return s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)))
}

const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']

export function formatDateBn(d: Date | string, style: NumeralStyle): string {
  const date = typeof d === 'string' ? new Date(d) : d
  if (Number.isNaN(date.getTime())) return ''
  return `${num(date.getDate(), style)} ${MONTHS[date.getMonth()]} ${num(date.getFullYear(), style)}`
}
