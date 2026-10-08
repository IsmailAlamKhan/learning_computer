/** Shortcut tables shared by the shortcut-table widget and the printable cheat sheet. */
export type Token = string

export interface ShortcutRow {
  id: string
  labelBn: string
  /** Windows alternatives, each a list of key tokens */
  win: Token[][]
  /** Mac alternatives */
  mac: Token[][]
  noteBn?: string
}

/** Token → label. Tokens: ctrl shift alt win cmd opt control, or any single key. */
export function keyLabel(token: Token, os: 'windows' | 'mac'): string {
  const map: Record<string, string> =
    os === 'mac'
      ? { cmd: '⌘ Command', shift: '⇧ Shift', opt: '⌥ Option', control: '⌃ Control' }
      : { ctrl: 'Ctrl', shift: 'Shift', alt: 'Alt', win: 'Win' }
  return map[token] ?? token
}

export const EDIT_ROWS: ShortcutRow[] = [
  { id: 'copy', labelBn: 'কপি (Copy) — নকল করা', win: [['ctrl', 'C']], mac: [['cmd', 'C']] },
  { id: 'paste', labelBn: 'পেস্ট (Paste) — বসানো', win: [['ctrl', 'V']], mac: [['cmd', 'V']] },
  { id: 'cut', labelBn: 'কাট (Cut) — কেটে নেওয়া', win: [['ctrl', 'X']], mac: [['cmd', 'X']] },
  { id: 'undo', labelBn: 'আনডু (Undo) — আগের অবস্থায় ফেরা', win: [['ctrl', 'Z']], mac: [['cmd', 'Z']] },
  { id: 'redo', labelBn: 'রিডু (Redo) — আনডু ফিরিয়ে নেওয়া', win: [['ctrl', 'Y'], ['ctrl', 'shift', 'Z']], mac: [['cmd', 'shift', 'Z']], noteBn: 'Windows-এ প্রোগ্রাম ভেদে দুইরকম হতে পারে।' },
  { id: 'select-all', labelBn: 'সিলেক্ট অল (Select All) — সব বেছে নেওয়া', win: [['ctrl', 'A']], mac: [['cmd', 'A']] },
  { id: 'save', labelBn: 'সেভ (Save) — জমিয়ে রাখা', win: [['ctrl', 'S']], mac: [['cmd', 'S']] },
  { id: 'find', labelBn: 'ফাইন্ড (Find) — লেখার ভেতরে খোঁজা', win: [['ctrl', 'F']], mac: [['cmd', 'F']] },
  { id: 'open', labelBn: 'ওপেন (Open) — ফাইল খোলা', win: [['ctrl', 'O']], mac: [['cmd', 'O']] },
  { id: 'new', labelBn: 'নিউ (New) — নতুন ফাইল', win: [['ctrl', 'N']], mac: [['cmd', 'N']] },
  { id: 'print', labelBn: 'প্রিন্ট (Print) — ছাপা', win: [['ctrl', 'P']], mac: [['cmd', 'P']] },
]

export const SYSTEM_ROWS: ShortcutRow[] = [
  { id: 'switch', labelBn: 'চালু প্রোগ্রামের মধ্যে বদলানো', win: [['alt', 'Tab']], mac: [['cmd', 'Tab']] },
  { id: 'lock', labelBn: 'কম্পিউটার লক করা', win: [['win', 'L']], mac: [['control', 'cmd', 'Q']] },
  { id: 'shot-area', labelBn: 'পর্দার একটি অংশের ছবি (স্ক্রিনশট)', win: [['win', 'shift', 'S']], mac: [['cmd', 'shift', '4']] },
  { id: 'shot-all', labelBn: 'পুরো পর্দার ছবি (স্ক্রিনশট)', win: [['PrtScn']], mac: [['cmd', 'shift', '3']] },
]

export const ALL_ROWS = [...EDIT_ROWS, ...SYSTEM_ROWS]

export const formatCombo = (keys: Token[], os: 'windows' | 'mac') => keys.map((t) => keyLabel(t, os)).join(' + ')
export const formatAlternatives = (alts: Token[][], os: 'windows' | 'mac') => alts.map((a) => formatCombo(a, os)).join('  অথবা  ')
