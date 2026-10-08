/** Programming symbols for the symbol-drill widget and the cheat sheet. Pure data + pure logic (unit-tested). */
import { locateChar, MAIN_ROW_NAMES_BN, type KeyLocation } from './keyboardLayout'

export interface SymbolInfo {
  char: string
  /** Bengali (+ English) name, e.g. 'কার্লি ব্র্যাকেট (Curly brace)' */
  nameBn: string
  nameEn: string
  /** where programmers meet it, in simple Bengali */
  useBn: string
  /** example snippet using it */
  example?: string
}

export const SYMBOLS: SymbolInfo[] = [
  { char: '{', nameBn: 'কার্লি ব্র্যাকেট (খোলা)', nameEn: 'Curly brace (open)', useBn: 'কোডের একটি অংশ বা JSON-এর তথ্য ঘিরে রাখে', example: '{ "name": "Rumi" }' },
  { char: '}', nameBn: 'কার্লি ব্র্যাকেট (বন্ধ)', nameEn: 'Curly brace (close)', useBn: '{ যেখানে খুলেছে, সেটি এখানে বন্ধ হয়', example: '{ "name": "Rumi" }' },
  { char: '[', nameBn: 'স্কোয়ার ব্র্যাকেট (খোলা)', nameEn: 'Square bracket (open)', useBn: 'তালিকা (list) লেখায় ব্যবহার হয়', example: '[1, 2, 3]' },
  { char: ']', nameBn: 'স্কোয়ার ব্র্যাকেট (বন্ধ)', nameEn: 'Square bracket (close)', useBn: '[ যেখানে খুলেছে, সেটি এখানে বন্ধ হয়', example: '[1, 2, 3]' },
  { char: '(', nameBn: 'প্যারেনথেসিস / গোল ব্র্যাকেট (খোলা)', nameEn: 'Parenthesis (open)', useBn: 'কোনো কাজ চালানোর সময় তার তথ্য ঘিরে রাখে', example: 'print("Hello")' },
  { char: ')', nameBn: 'প্যারেনথেসিস / গোল ব্র্যাকেট (বন্ধ)', nameEn: 'Parenthesis (close)', useBn: '( যেখানে খুলেছে, সেটি এখানে বন্ধ হয়', example: 'print("Hello")' },
  { char: '<', nameBn: 'অ্যাংগেল ব্র্যাকেট (খোলা) / ছোট-চিহ্ন', nameEn: 'Less-than / angle bracket', useBn: 'ওয়েবপেজের ট্যাগ (HTML) শুরু করে', example: '<h1>Hi</h1>' },
  { char: '>', nameBn: 'অ্যাংগেল ব্র্যাকেট (বন্ধ) / বড়-চিহ্ন', nameEn: 'Greater-than / angle bracket', useBn: 'ওয়েবপেজের ট্যাগ (HTML) শেষ করে', example: '<h1>Hi</h1>' },
  { char: '/', nameBn: 'ফরোয়ার্ড স্ল্যাশ', nameEn: 'Forward slash', useBn: 'পথ (path) আর ওয়েব ঠিকানায় ফোল্ডারের মাঝে বসে, ট্যাগ বন্ধ করতেও লাগে', example: '~/Documents' },
  { char: '\\', nameBn: 'ব্যাকস্ল্যাশ', nameEn: 'Backslash', useBn: 'Windows-এর পথে ফোল্ডারের মাঝে বসে', example: 'C:\\Users' },
  { char: '|', nameBn: 'পাইপ (খাড়া দাগ)', nameEn: 'Pipe', useBn: 'এক কাজের ফলাফল আরেক কাজে পাঠানো (টার্মিনালে)', example: 'ls | sort' },
  { char: '_', nameBn: 'আন্ডারস্কোর (নিচের দাগ)', nameEn: 'Underscore', useBn: 'নামের শব্দগুলো জোড়া লাগাতে, কারণ নামে ফাঁকা জায়গা দেওয়া যায় না', example: 'my_name' },
  { char: '-', nameBn: 'হাইফেন / মাইনাস', nameEn: 'Hyphen / minus', useBn: 'বিয়োগ, আর ফাইলের নামে শব্দ জোড়া লাগাতে', example: '10 - 3' },
  { char: '=', nameBn: 'ইকুয়াল (সমান চিহ্ন)', nameEn: 'Equals', useBn: 'কোনো নামে মান রাখতে (গণিতের “সমান”-এর মতো নয়)', example: 'x = 5' },
  { char: '+', nameBn: 'প্লাস', nameEn: 'Plus', useBn: 'যোগ করতে, বা দুটি লেখা জোড়া লাগাতে', example: '2 + 3' },
  { char: '"', nameBn: 'ডবল কোট', nameEn: 'Double quote', useBn: 'লেখাকে (টেক্সট) ঘিরে রাখে', example: '"Hello"' },
  { char: "'", nameBn: 'সিঙ্গেল কোট', nameEn: 'Single quote', useBn: 'লেখাকে (টেক্সট) ঘিরে রাখে — ডবল কোটের মতোই', example: "'Hello'" },
  { char: '`', nameBn: 'ব্যাকটিক', nameEn: 'Backtick', useBn: 'কোড ঘিরে রাখতে (নোটে) আর জাভাস্ক্রিপ্টের বিশেষ লেখায়', example: '`Hello`' },
  { char: ';', nameBn: 'সেমিকোলন', nameEn: 'Semicolon', useBn: 'অনেক ভাষায় একটি নির্দেশ শেষ করে (যেমন জাভাস্ক্রিপ্ট)', example: 'let x = 5;' },
  { char: ':', nameBn: 'কোলন', nameEn: 'Colon', useBn: 'পাইথনে শর্তের শেষে বসে, JSON-এ নাম আর মানের মাঝে বসে', example: '"name": "Rumi"' },
  { char: '#', nameBn: 'হ্যাশ', nameEn: 'Hash', useBn: 'পাইথনে মন্তব্য (comment) শুরু করে', example: '# this is a note' },
  { char: '@', nameBn: 'অ্যাট চিহ্ন', nameEn: 'At sign', useBn: 'ইমেইল ঠিকানায় বসে, কিছু কোডেও লাগে', example: 'name@example.com' },
  { char: '$', nameBn: 'ডলার চিহ্ন', nameEn: 'Dollar sign', useBn: 'টার্মিনালে নির্দেশ লেখার জায়গা চেনায়', example: '$ ls' },
  { char: '%', nameBn: 'পার্সেন্ট', nameEn: 'Percent', useBn: 'শতকরা, আর ভাগশেষ বের করতে', example: '10 % 3' },
  { char: '^', nameBn: 'ক্যারেট', nameEn: 'Caret', useBn: 'কিছু ভাষায় বিশেষ হিসাবে লাগে, আর পরে নানা জায়গায় দেখবেন', example: 'a ^ b' },
  { char: '&', nameBn: 'অ্যাম্পারস্যান্ড (“এবং” চিহ্ন)', nameEn: 'Ampersand', useBn: '“এবং” বোঝাতে, ওয়েব ঠিকানায় অংশ জোড়া লাগাতে', example: 'a && b' },
  { char: '*', nameBn: 'স্টার (গুণ চিহ্ন)', nameEn: 'Asterisk', useBn: 'গুণ করতে, আর “সব” বোঝাতে (যেমন *.txt)', example: '3 * 4' },
  { char: '~', nameBn: 'টিল্ড', nameEn: 'Tilde', useBn: 'টার্মিনাল ও পথে নিজের হোম ফোল্ডার বোঝায়', example: '~/Documents' },
]

export type ShiftNeed = 'none' | 'shift'

export interface HowToType {
  loc: KeyLocation
  /** the unshifted character printed on the key */
  baseChar: string
  needsShift: boolean
  /** plain text steps, e.g. ['Shift', '['] */
  keys: string[]
}

export function howToType(char: string): HowToType | null {
  const loc = locateChar(char)
  if (!loc) return null
  return { loc, baseChar: loc.base, needsShift: loc.shift, keys: loc.shift ? ['Shift', loc.base] : [loc.base] }
}

/** Where on the keyboard, in Bengali (row + key). */
export function whereBn(char: string): string {
  const loc = locateChar(char)
  if (!loc) return ''
  return `${MAIN_ROW_NAMES_BN[loc.row]} — যে কী-তে “${loc.base}” লেখা আছে`
}

export type KeyJudgement =
  | { kind: 'correct' }
  | { kind: 'ignore' }
  /** pressed the key but without Shift */
  | { kind: 'needs-shift' }
  /** pressed with Shift but this symbol does not need it */
  | { kind: 'too-much-shift' }
  /** the keyboard produced a non-English letter — probably Bangla keyboard is on */
  | { kind: 'non-latin' }
  | { kind: 'wrong' }

const NON_CHARACTER_KEYS = /^(Shift|Control|Alt|AltGraph|Meta|CapsLock|Tab|Escape|Enter|Backspace|Delete|Dead|Process|Unidentified|F\d+|Arrow\w+|Home|End|Page\w+|Insert|ContextMenu|NumLock|ScrollLock|Pause|PrintScreen|Fn|FnLock|OS)$/

/**
 * Compare what the learner pressed (KeyboardEvent.key) with the target symbol.
 * Detection is by `key`, i.e. by the character actually produced — so it also works on keyboards with a slightly different layout.
 */
export function judgeKey(target: string, pressedKey: string): KeyJudgement {
  if (NON_CHARACTER_KEYS.test(pressedKey) || pressedKey === '') return { kind: 'ignore' }
  if (pressedKey === target) return { kind: 'correct' }
  if ([...pressedKey].length === 1 && /[^\u0000-\u024F]/.test(pressedKey)) return { kind: 'non-latin' }
  const loc = locateChar(target)
  const pressed = locateChar(pressedKey)
  if (loc && pressed && loc.keyId === pressed.keyId) return loc.shift ? { kind: 'needs-shift' } : { kind: 'too-much-shift' }
  return { kind: 'wrong' }
}
