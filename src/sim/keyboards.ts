/** Input languages/keyboards of the simulated computer (only English and Bangla are simulated). */
export interface KeyboardInfo {
  id: 'en' | 'bn'
  /** short indicator on the Windows taskbar */
  winCode: string
  winName: string
  winSub: string
  /** menu bar label and menu names on Mac */
  macCode: string
  macName: string
}

export const KEYBOARDS: Record<string, KeyboardInfo> = {
  en: { id: 'en', winCode: 'ENG', winName: 'English (United States)', winSub: 'US keyboard', macCode: 'ABC', macName: 'ABC' },
  bn: { id: 'bn', winCode: 'BEN', winName: 'Bangla (Bangladesh)', winSub: 'Bangla keyboard', macCode: 'বা', macName: 'Bangla' },
}

export const hasBangla = (keyboards: string[] | undefined) => !!keyboards?.includes('bn')

/** The other keyboard in the list (used by Win+Space / Control+Space). */
export function nextKeyboard(keyboards: string[] | undefined, active: string | undefined): string {
  const list = keyboards && keyboards.length ? keyboards : ['en']
  const i = Math.max(0, list.indexOf(active ?? 'en'))
  return list[(i + 1) % list.length]
}
