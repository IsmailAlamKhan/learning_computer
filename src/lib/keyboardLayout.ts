/**
 * Pure data describing a US (QWERTY) keyboard: used by the keyboard-layout and symbol-drill widgets.
 * Widths are in "key units" (a normal key = 1). The layout on the learner's own keyboard may differ slightly.
 */
export type KeyGroup = 'letters' | 'numbers' | 'symbols' | 'function' | 'modifier' | 'arrows' | 'special'
export type KeyboardOs = 'windows' | 'mac'

export interface KeyDef {
  /** unique id: the base character for printable keys ('a', '1', '['), or a name ('shift-l', 'enter') */
  id: string
  /** text printed on the key (lower case / base) */
  label: string
  /** what Shift gives (printable keys only) */
  shifted?: string
  w: number
  group: KeyGroup
}

export interface Spacer {
  gap: number
}
export type RowItem = KeyDef | Spacer
export const isSpacer = (i: RowItem): i is Spacer => 'gap' in i

const k = (id: string, label: string, group: KeyGroup, w = 1, shifted?: string): KeyDef => ({ id, label, group, w, shifted })
const ch = (c: string, shifted: string, group: KeyGroup): KeyDef => k(c, c, group, 1, shifted)

const NUM_ROW: [string, string][] = [['1', '!'], ['2', '@'], ['3', '#'], ['4', '$'], ['5', '%'], ['6', '^'], ['7', '&'], ['8', '*'], ['9', '('], ['0', ')']]
const letters = (s: string) => [...s].map((c) => ch(c, c.toUpperCase(), 'letters'))

export function keyboardRows(os: KeyboardOs): RowItem[][] {
  const mac = os === 'mac'
  const fn: RowItem[] = [k('esc', 'Esc', 'special'), { gap: 0.5 }, ...Array.from({ length: 12 }, (_, i) => k(`f${i + 1}`, `F${i + 1}`, 'function'))]
  const row1: RowItem[] = [ch('`', '~', 'symbols'), ...NUM_ROW.map(([a, b]) => ch(a, b, 'numbers')), ch('-', '_', 'symbols'), ch('=', '+', 'symbols'), k('backspace', mac ? 'delete' : 'Backspace', 'special', 2)]
  const row2: RowItem[] = [k('tab', 'Tab', 'special', 1.5), ...letters('qwertyuiop'), ch('[', '{', 'symbols'), ch(']', '}', 'symbols'), { ...ch('\\', '|', 'symbols'), w: 1.5 }]
  const row3: RowItem[] = [k('caps', 'Caps Lock', 'special', 1.75), ...letters('asdfghjkl'), ch(';', ':', 'symbols'), ch("'", '"', 'symbols'), k('enter', mac ? 'return' : 'Enter', 'special', 2.25)]
  const row4: RowItem[] = [k('shift-l', 'Shift', 'modifier', 2.25), ...letters('zxcvbnm'), ch(',', '<', 'symbols'), ch('.', '>', 'symbols'), ch('/', '?', 'symbols'), k('shift-r', 'Shift', 'modifier', 2.75)]
  const row5: RowItem[] = mac
    ? [k('ctrl-l', 'control', 'modifier', 1.25), k('alt-l', 'option', 'modifier', 1.25), k('cmd-l', 'command', 'modifier', 1.5), k('space', 'Space', 'special', 6), k('cmd-r', 'command', 'modifier', 1.5), k('alt-r', 'option', 'modifier', 1.25), { gap: 2.25 }]
    : [k('ctrl-l', 'Ctrl', 'modifier', 1.5), k('win-l', 'Win', 'modifier', 1.25), k('alt-l', 'Alt', 'modifier', 1.25), k('space', 'Space', 'special', 6.5), k('alt-r', 'Alt', 'modifier', 1.25), k('win-r', 'Win', 'modifier', 1.25), k('ctrl-r', 'Ctrl', 'modifier', 2)]
  return [fn, row1, row2, row3, row4, row5]
}

/** Row indexes inside keyboardRows() (0 = function row). */
export const MAIN_ROW_NAMES_BN = ['ফাংশন কী-র সারি (একদম ওপরে)', 'সংখ্যার সারি', 'অক্ষরের ওপরের সারি (Tab-এর পাশে)', 'হোম রো (Caps Lock-এর পাশের সারি)', 'অক্ষরের নিচের সারি (Shift-এর পাশে)', 'স্পেসবারের সারি (একদম নিচে)']

/** Arrow cluster (drawn to the right, bottom). */
export const ARROW_KEYS: { id: string; label: string; col: number; row: number }[] = [
  { id: 'up', label: '↑', col: 1, row: 0 },
  { id: 'left', label: '←', col: 0, row: 1 },
  { id: 'down', label: '↓', col: 1, row: 1 },
  { id: 'right', label: '→', col: 2, row: 1 },
]

export interface KeyLocation {
  keyId: string
  /** true when the character needs Shift held down */
  shift: boolean
  /** index inside keyboardRows() */
  row: number
  base: string
}

/** Find the physical key that types `char` on a US keyboard. */
export function locateChar(char: string): KeyLocation | null {
  const rows = keyboardRows('windows')
  for (let r = 0; r < rows.length; r++) {
    for (const item of rows[r]) {
      if (isSpacer(item) || !item.shifted) continue
      if (item.id === char) return { keyId: item.id, shift: false, row: r, base: item.id }
      if (item.shifted === char) return { keyId: item.id, shift: true, row: r, base: item.id }
    }
  }
  return null
}

export const GROUP_INFO: Record<KeyGroup, { nameBn: string; descBn: string; fill: string }> = {
  letters: { nameBn: 'অক্ষরের কী', descBn: 'A থেকে Z — ইংরেজি অক্ষর লেখার কী।', fill: '#dbeafe' },
  numbers: { nameBn: 'সংখ্যার কী', descBn: '0 থেকে 9 — সংখ্যা লেখার কী। Shift-এর সাথে চাপলে ওপরের চিহ্ন (! @ # …) আসে।', fill: '#fef3c7' },
  symbols: { nameBn: 'চিহ্নের কী', descBn: 'দাঁড়ি, কমা, ব্র্যাকেট, কোটেশন ইত্যাদি চিহ্ন। প্রোগ্রামিংয়ে এগুলো খুব কাজে লাগে।', fill: '#ffedd5' },
  function: { nameBn: 'ফাংশন কী (F1–F12)', descBn: 'সবচেয়ে ওপরের সারির F1 থেকে F12। এক-একটি প্রোগ্রামে এক-এক কাজ করে। এখন এগুলো নিয়ে চিন্তা করার দরকার নেই।', fill: '#ede9fe' },
  modifier: { nameBn: 'মডিফায়ার কী (Shift, Ctrl, Alt, Cmd)', descBn: 'এই কী একা কিছু করে না। অন্য কী-এর সাথে চেপে ধরলে অন্য কী-এর কাজ বদলে দেয়। শর্টকাট এভাবেই হয়।', fill: '#dcfce7' },
  arrows: { nameBn: 'তীর চিহ্নের কী', descBn: 'লেখার মধ্যে কার্সার (লেখার জায়গা চেনানো দাগ) ওপরে-নিচে, ডানে-বাঁয়ে সরায়।', fill: '#fce7f3' },
  special: { nameBn: 'বিশেষ কী', descBn: 'Enter, Space, Backspace, Tab, Esc, Caps Lock — প্রতিটির আলাদা বিশেষ কাজ আছে।', fill: '#fae8ff' },
}

export const KEY_INFO_BN: Record<string, string> = {
  enter: 'Enter (Mac-এ Return): নতুন লাইনে যায়, বা বোতামে “ঠিক আছে” বলে।',
  space: 'Space (স্পেসবার): দুই শব্দের মাঝে ফাঁকা জায়গা দেয়।',
  backspace: 'Backspace (Mac-এ “delete” লেখা): কার্সারের বাঁ দিকের একটি অক্ষর মুছে ফেলে।',
  tab: 'Tab: লেখার মধ্যে বড় ফাঁক দেয়, আর ফর্মে এক ঘর থেকে পরের ঘরে যায়।',
  caps: 'Caps Lock: চালু থাকলে সব অক্ষর বড় হাতের (A B C) হয়। আবার চাপলে বন্ধ।',
  esc: 'Esc: কোনো মেনু বা ছোট বাক্স বন্ধ করে, বা “থাক, লাগবে না” বলে।',
  'shift-l': 'Shift: চেপে ধরে অন্য কী চাপলে বড় হাতের অক্ষর বা ওপরের চিহ্ন আসে।',
  'shift-r': 'Shift: চেপে ধরে অন্য কী চাপলে বড় হাতের অক্ষর বা ওপরের চিহ্ন আসে।',
  'ctrl-l': 'Ctrl (Control): শর্টকাটের কী। Windows-এ কপি-পেস্ট এই কী দিয়ে হয়। Mac-এও আছে, তবে সেখানে কপি-পেস্ট হয় Command (⌘) দিয়ে।',
  'ctrl-r': 'Ctrl (Control): শর্টকাটের কী। Windows-এ কপি-পেস্ট এই কী দিয়ে হয়।',
  'alt-l': 'Alt (Mac-এ Option): বিশেষ শর্টকাটে অন্য কী-এর সাথে ব্যবহার হয়।',
  'alt-r': 'Alt (Mac-এ Option): বিশেষ শর্টকাটে অন্য কী-এর সাথে ব্যবহার হয়।',
  'win-l': 'Windows কী: চাপলে স্টার্ট মেনু খোলে। অন্য কী-এর সাথে নানা শর্টকাট হয়।',
  'win-r': 'Windows কী: চাপলে স্টার্ট মেনু খোলে।',
  'cmd-l': 'Command (⌘): Mac-এ কপি, পেস্ট, সেভ — সব শর্টকাট এই কী দিয়ে হয়। Windows-এর Ctrl-এর মতো।',
  'cmd-r': 'Command (⌘): Mac-এ কপি, পেস্ট, সেভ — সব শর্টকাট এই কী দিয়ে হয়।',
  up: 'ওপরের তীর: কার্সার এক লাইন ওপরে নেয়।',
  down: 'নিচের তীর: কার্সার এক লাইন নিচে নেয়।',
  left: 'বাঁ তীর: কার্সার এক অক্ষর বাঁয়ে নেয়।',
  right: 'ডান তীর: কার্সার এক অক্ষর ডানে নেয়।',
}
