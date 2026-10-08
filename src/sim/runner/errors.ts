import type { FriendlyError, RunError } from './types'

type Lang = 'python' | 'javascript'

const BN_DIGITS = '০১২৩৪৫৬৭৮৯'
/** 3 -> '৩' */
export function toBengaliDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])
}

interface Ctx {
  /** regex match groups of the message */
  m: RegExpExecArray
  /** 'লাইন ৩-এ ' or '' */
  at: string
  err: RunError
}
type Make = (c: Ctx) => FriendlyError
interface Rule {
  /** error name(s) this rule applies to; omitted = any */
  name?: string[]
  msg?: RegExp
  make: Make
}

const q = (s: string | undefined) => (s ? `'${s}'` : '')
const COMMON = 'এটা খুব সাধারণ একটি সমস্যা, প্রোগ্রামিংয়ে সবারই হয়। '

// ---------------------------------------------------------------------------------------------------------------------
// Rules shared by both languages (runner-level)
// ---------------------------------------------------------------------------------------------------------------------
const SHARED: Rule[] = [
  {
    name: ['TimeoutError'],
    make: () => ({
      titleBn: 'প্রোগ্রামটি অনেকক্ষণ ধরে চলছে…',
      explanationBn:
        'প্রোগ্রামটি অনেকক্ষণ ধরে চলছিল, তাই আমরা থামিয়ে দিয়েছি। সাধারণত এমন হয় যখন কোনো লুপ (loop) কখনো শেষ হয় না — যেমন যে শর্তে লুপ থামার কথা, তা কখনো মিথ্যা হয় না।',
      tryBn: 'লুপের শর্তটা দেখুন: লুপের ভেতরে কি এমন কিছু বদলাচ্ছে, যাতে একসময় শর্তটা শেষ হয়ে যাবে? যেমন একটি গণনার সংখ্যা (counter) বাড়ানো।',
    }),
  },
  {
    name: ['OutputLimitExceeded'],
    make: () => ({
      titleBn: 'প্রোগ্রামটি অনেক বেশি লেখা ছাপাচ্ছে',
      explanationBn: 'প্রোগ্রামটি এত বেশি লেখা ছাপাচ্ছিল যে আমরা থামিয়ে দিয়েছি। এমন হলে সাধারণত একটি লুপ (loop) বারবার চলতেই থাকে।',
      tryBn: 'যে লুপের ভেতরে ছাপানো হচ্ছে, সেটি কখন থামবে তা একবার দেখে নিন।',
    }),
  },
  {
    name: ['RunnerUnavailable'],
    make: () => ({
      titleBn: 'কোড চালানোর অংশটি এখন চালু করা যাচ্ছে না',
      explanationBn: 'পাইথন চালানোর জন্য দরকারি ফাইলগুলো এখন লোড করা যায়নি। আপনার কোডে কোনো সমস্যা নেই — এটা শুধু একটি সাময়িক সমস্যা।',
      tryBn: 'পাতাটি একবার রিফ্রেশ (Refresh) করে আবার চেষ্টা করুন। ইন্টারনেট সংযোগও একবার দেখে নিতে পারেন।',
    }),
  },
]

// ---------------------------------------------------------------------------------------------------------------------
// Python
// ---------------------------------------------------------------------------------------------------------------------
const PYTHON: Rule[] = [
  // --- IndentationError (must come before generic SyntaxError; name check keeps them apart)
  {
    name: ['IndentationError', 'TabError'],
    msg: /expected an indented block/,
    make: ({ at }) => ({
      titleBn: 'লাইনের শুরুতে একটু ফাঁকা জায়গা (indentation) দরকার',
      explanationBn: `${at}আগের লাইনটি শেষ হয়েছে ':' দিয়ে, তাই তার পরের লাইনটি একটু ভেতরে সরিয়ে লিখতে হয়। ${COMMON}`,
      tryBn: 'পরের লাইনের শুরুতে চারটি স্পেস (বা একবার Tab) দিয়ে দেখুন।',
    }),
  },
  {
    name: ['IndentationError', 'TabError'],
    msg: /unexpected indent/,
    make: ({ at }) => ({
      titleBn: 'লাইনটি অকারণে ভেতরে সরে গেছে',
      explanationBn: `${at}লাইনটির শুরুতে প্রয়োজনের চেয়ে বেশি ফাঁকা জায়গা (indentation) আছে। পাইথনে লাইনের শুরুর ফাঁকা জায়গাও অর্থ বহন করে। ${COMMON}`,
      tryBn: 'লাইনের শুরুর বাড়তি স্পেসগুলো মুছে ফেলুন, যাতে লাইনটি ওপরের লাইনের সাথে সোজা থাকে।',
    }),
  },
  {
    name: ['IndentationError', 'TabError'],
    msg: /unindent|inconsistent use of tabs/,
    make: ({ at }) => ({
      titleBn: 'লাইনের শুরুর ফাঁকা জায়গা মিলছে না',
      explanationBn: `${at}লাইনটির শুরুর ফাঁকা জায়গা (indentation) ওপরের কোনো লাইনের সাথে মিলছে না। একই ব্লকের সব লাইন ঠিক সমান জায়গা ভেতরে থাকতে হয়।`,
      tryBn: 'ওপরের লাইনগুলোর সাথে মিলিয়ে স্পেসের সংখ্যা সমান করে দিন। সব জায়গায় চারটি স্পেস ব্যবহার করলে সহজ হয়।',
    }),
  },
  {
    name: ['IndentationError', 'TabError'],
    make: ({ at }) => ({
      titleBn: 'লাইনের শুরুর ফাঁকা জায়গা (indentation) একটু ঠিক করতে হবে',
      explanationBn: `${at}লাইনের শুরুর ফাঁকা জায়গা ঠিক নেই। ${COMMON}`,
      tryBn: 'পাশের লাইনগুলোর সাথে মিলিয়ে স্পেস ঠিক করে দেখুন।',
    }),
  },
  // --- SyntaxError
  {
    name: ['SyntaxError'],
    msg: /unterminated (?:triple-quoted )?string literal|EOL while scanning string|EOF while scanning triple-quoted/,
    make: ({ at }) => ({
      titleBn: 'লেখার শুরু বা শেষের উদ্ধৃতি চিহ্ন (quote) বাদ পড়েছে',
      explanationBn: `${at}কোনো লেখা (string) শুরু হয়েছে উদ্ধৃতি চিহ্ন দিয়ে, কিন্তু শেষে সেটি বন্ধ করা হয়নি। ${COMMON}`,
      tryBn: 'লেখাটির শেষে একই ধরনের উদ্ধৃতি চিহ্ন (" বা \') বসিয়ে দেখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /'(.)' was never closed/,
    make: ({ m, at }) => ({
      titleBn: 'একটি বন্ধনী (bracket) বন্ধ করা হয়নি',
      explanationBn: `${at}${q(m[1])} চিহ্নটি খোলা হয়েছে, কিন্তু তার জোড়া বন্ধনী খুঁজে পাওয়া যাচ্ছে না। ${COMMON}`,
      tryBn: 'লাইনের শেষে ঠিক জোড়াটি (যেমন ")" বা "]" বা "}") আছে কি না মিলিয়ে দেখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /unmatched '(.)'|closing parenthesis '(.)' does not match opening parenthesis/,
    make: ({ m, at }) => ({
      titleBn: 'একটি বাড়তি বা ভুল জোড়ার বন্ধনী (bracket) আছে',
      explanationBn: `${at}${q(m[1] ?? m[2])} চিহ্নটির সাথে মেলে এমন কোনো খোলা বন্ধনী নেই, অথবা জোড়াটি অন্য ধরনের। ${COMMON}`,
      tryBn: 'বন্ধনীগুলো এক এক করে গুনে দেখুন — যতগুলো খোলা, ততগুলো বন্ধ হওয়া চাই।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /expected ':'/,
    make: ({ at }) => ({
      titleBn: 'লাইনের শেষে কোলন (:) দরকার',
      explanationBn: `${at}if, for, while, def-এর মতো লাইনের শেষে একটি কোলন ( : ) বসাতে হয়। সেটি বাদ পড়ে গেছে। ${COMMON}`,
      tryBn: 'লাইনটির একদম শেষে ":" বসিয়ে আবার চালান।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /invalid decimal literal|invalid (?:hexadecimal|octal|binary) literal|leading zeros in decimal/,
    make: ({ at }) => ({
      titleBn: 'সংখ্যার পরে অক্ষর লেগে আছে',
      explanationBn: `${at}কোনো সংখ্যার ঠিক পরেই অক্ষর বসে গেছে। ভেরিয়েবলের (variable) নাম সংখ্যা দিয়ে শুরু করা যায় না। ${COMMON}`,
      tryBn: 'নামটি অক্ষর দিয়ে শুরু করুন (যেমন num1)। আর সংখ্যা ও অক্ষরের মাঝে কোনো চিহ্ন বা স্পেস লাগবে কি না দেখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /invalid syntax\. Perhaps you forgot a comma/,
    make: ({ at }) => ({
      titleBn: 'দুটি জিনিসের মাঝে কমা (,) লাগতে পারে',
      explanationBn: `${at}বন্ধনীর ভেতরে দুটি জিনিসের মাঝে একটি কমা ( , ) বাদ পড়ে থাকতে পারে। ${COMMON}`,
      tryBn: 'লাইনটি ধীরে পড়ে, যেখানে দুটি মান আলাদা করার কথা সেখানে কমা বসিয়ে দেখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /cannot assign to|invalid syntax\. Maybe you meant '==' or ':='/,
    make: ({ at }) => ({
      titleBn: 'সমান চিহ্ন (=) ঠিক জায়গায় বসেনি',
      explanationBn: `${at}একটি '=' মান রাখার জন্য, আর দুটি '==' তুলনা করার জন্য। এখানে ভুল জায়গায় একটি ব্যবহার করা হয়েছে মনে হচ্ছে। ${COMMON}`,
      tryBn: 'if-এর ভেতরে তুলনা করতে চাইলে "==" লিখুন; ভেরিয়েবলে (variable) মান রাখতে চাইলে বাঁ দিকে শুধু একটি নাম রাখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    make: ({ at }) => ({
      titleBn: 'লেখার নিয়মে (syntax) একটু গোলমাল আছে',
      explanationBn: `${at}কোডের লেখার নিয়মে কোথাও একটু গোলমাল আছে, তাই পাইথন লাইনটি বুঝতে পারছে না। ${COMMON}`,
      tryBn: 'ওই লাইনটি এবং তার ঠিক আগের লাইনটি ধীরে পড়ুন। কোলন, বন্ধনী বা উদ্ধৃতি চিহ্ন বাদ পড়েছে কি না দেখুন।',
    }),
  },
  // --- NameError
  {
    name: ['NameError', 'UnboundLocalError'],
    msg: /name '(.+?)' is not defined|cannot access local variable '(.+?)'|local variable '(.+?)'/,
    make: ({ m, at }) => {
      const n = m[1] ?? m[2] ?? m[3]
      return {
        titleBn: `${q(n)} নামটি খুঁজে পাওয়া যাচ্ছে না`,
        explanationBn: `${at}${q(n)} নামে কোনো ভেরিয়েবল (variable) আগে তৈরি করা হয়নি। হয়তো নামের বানানে একটু হেরফের হয়েছে, কিংবা ভেরিয়েবলটি তৈরির আগেই ব্যবহার করা হয়েছে। আর যদি এটি সাধারণ লেখা হয়ে থাকে, তাহলে আশেপাশে উদ্ধৃতি চিহ্ন (" ") বাদ পড়েছে কি না দেখুন। ${COMMON}`,
        tryBn: `${q(n)} নামটি কোথায় তৈরি করেছেন তা খুঁজে বানানটি মিলিয়ে দেখুন। লেখা ছাপাতে চাইলে এভাবে লিখুন: print("লেখা")।`,
      }
    },
  },
  // --- TypeError
  {
    name: ['TypeError'],
    msg: /can only concatenate str \(not "(\w+)"\) to str|can only concatenate str|must be str, not|unsupported operand type\(s\) for \+: '(?:int|float)' and 'str'/,
    make: ({ at }) => ({
      titleBn: 'লেখা আর সংখ্যা একসাথে যোগ করা যায় না',
      explanationBn: `${at}'+' দিয়ে লেখা (string) আর সংখ্যা (number) সরাসরি জোড়া লাগানো যায় না। ${COMMON}`,
      tryBn: 'সংখ্যাটিকে লেখায় রূপ দিন: "আমার বয়স " + str(বয়স)। অথবা print-এ কমা দিয়ে আলাদা করুন: print("বয়স", বয়স)।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /unsupported operand type\(s\) for (.+?): '(\w+)' and '(\w+)'/,
    make: ({ m, at }) => ({
      titleBn: 'দুটি ভিন্ন ধরনের জিনিসের মধ্যে হিসাব করা যাচ্ছে না',
      explanationBn: `${at}'${m[2]}' আর '${m[3]}' ধরনের দুটি জিনিস নিয়ে ${m[1]} করা যায় না। উদাহরণ: লেখা (string) আর সংখ্যা (number) মিশিয়ে হিসাব। ${COMMON}`,
      tryBn: 'input() থেকে পাওয়া মান আসলে লেখা — হিসাবের আগে int() বা float() দিয়ে সংখ্যায় রূপ দিয়ে দেখুন।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /'(\w+)' object is not callable/,
    make: ({ m, at }) => ({
      titleBn: 'একটি জিনিসকে ফাংশনের মতো ডাকা হয়েছে',
      explanationBn: `${at}'${m[1]}' ধরনের একটি মানের পরে বন্ধনী ( ) দেওয়া হয়েছে, যেন সেটি ফাংশন (function)। কিন্তু সেটি ফাংশন নয়। হয়তো একটি ভেরিয়েবলের (variable) নাম ফাংশনের নামের মতোই রেখে ফেলা হয়েছে। ${COMMON}`,
      tryBn: 'নামের পরে বন্ধনী দেওয়া জায়গাটি দেখুন; আর ভেরিয়েবলের নাম print, input, str-এর মতো নামে রাখবেন না।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /missing (\d+) required (?:positional|keyword-only) arguments?|takes (?:\d+|from \d+ to \d+) positional arguments? but (\d+) (?:was|were) given|got an unexpected keyword argument/,
    make: ({ at }) => ({
      titleBn: 'ফাংশনে দেওয়া মানের সংখ্যা মিলছে না',
      explanationBn: `${at}ফাংশন (function) যতগুলো মান চায়, ডাকার সময় তার চেয়ে কম বা বেশি মান দেওয়া হয়েছে। ${COMMON}`,
      tryBn: 'ফাংশনটি তৈরির লাইনে (def) বন্ধনীর ভেতরে কয়টি নাম আছে গুনুন, তারপর ডাকার জায়গায় ঠিক ততগুলো মান দিন।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /object is not subscriptable|object does not support item assignment|not iterable|can't multiply sequence|must be/,
    make: ({ at }) => ({
      titleBn: 'মানের ধরন (type) কাজের সাথে মিলছে না',
      explanationBn: `${at}এখানে যে ধরনের মান আছে, তা দিয়ে এই কাজটি করা যায় না — যেমন সংখ্যার ভেতর থেকে অংশ নেওয়ার চেষ্টা, বা লেখাকে সংখ্যা দিয়ে গুণ করা। ${COMMON}`,
      tryBn: 'ভেরিয়েবলে (variable) কী ধরনের মান আছে তা print(type(নাম)) দিয়ে দেখে নিতে পারেন।',
    }),
  },
  {
    name: ['TypeError'],
    make: ({ at }) => ({
      titleBn: 'মানের ধরন (type) মিলছে না',
      explanationBn: `${at}কোনো কাজে এমন ধরনের মান দেওয়া হয়েছে, যা দিয়ে কাজটি করা যায় না। ${COMMON}`,
      tryBn: 'লাইনটিতে কোন কোন মান আছে দেখুন; লেখা (string) আর সংখ্যা (number) গুলিয়ে ফেলা হয়েছে কি না মিলিয়ে নিন।',
    }),
  },
  // --- other runtime errors
  {
    name: ['ZeroDivisionError'],
    make: ({ at }) => ({
      titleBn: 'শূন্য দিয়ে ভাগ করা যায় না',
      explanationBn: `${at}কোনো সংখ্যাকে ০ দিয়ে ভাগ করার চেষ্টা হয়েছে। গণিতেই এটি সম্ভব নয়, তাই কম্পিউটারও পারে না। ${COMMON}`,
      tryBn: 'ভাগ করার আগে ভাজক (যে সংখ্যা দিয়ে ভাগ করছেন) ০ কি না if দিয়ে দেখে নিতে পারেন।',
    }),
  },
  {
    name: ['ValueError'],
    msg: /invalid literal for int\(\)|could not convert string to float|invalid literal for float/,
    make: ({ at }) => ({
      titleBn: 'লেখাটিকে সংখ্যায় রূপ দেওয়া যাচ্ছে না',
      explanationBn: `${at}int() বা float() এমন কোনো লেখাকে সংখ্যা বানাতে চেয়েছে, যেটি আসলে সংখ্যা নয় (যেমন অক্ষর, ফাঁকা লেখা বা দশমিকসহ সংখ্যা)। ${COMMON}`,
      tryBn: 'ব্যবহারকারী কী লিখেছেন তা আগে print করে দেখুন। শুধু অঙ্ক (যেমন 25) থাকলে int() কাজ করবে; দশমিক থাকলে float() ব্যবহার করুন।',
    }),
  },
  {
    name: ['ValueError'],
    make: ({ at }) => ({
      titleBn: 'মানটি এই কাজের জন্য উপযুক্ত নয়',
      explanationBn: `${at}মানের ধরন ঠিক আছে, কিন্তু মানটি এই কাজের জন্য উপযুক্ত নয়। ${COMMON}`,
      tryBn: 'কোন মানটি দেওয়া হয়েছে তা print করে দেখে নিন।',
    }),
  },
  {
    name: ['IndexError'],
    make: ({ at }) => ({
      titleBn: 'তালিকায় এই ক্রমের কোনো জিনিস নেই',
      explanationBn: `${at}তালিকার (list) বা লেখার যতগুলো জিনিস আছে, তার বাইরের কোনো ক্রম নম্বর (index) ধরা হয়েছে। মনে রাখবেন, গণনা শুরু হয় ০ থেকে — তাই ৩টি জিনিস থাকলে ক্রম হয় ০, ১, ২।`,
      tryBn: 'len(তালিকা) দিয়ে জিনিসের সংখ্যা দেখুন, আর ক্রম নম্বর তার চেয়ে অন্তত ১ কম রাখুন।',
    }),
  },
  {
    name: ['KeyError'],
    make: ({ at, err }) => ({
      titleBn: 'এই নামের কোনো চাবি (key) পাওয়া যায়নি',
      explanationBn: `${at}ডিকশনারিতে (dictionary) ${err.message || 'এই'} নামে কোনো চাবি (key) নেই। বানান বা বড়-ছোট হাতের অক্ষর একটু আলাদা হলেও এমন হয়।`,
      tryBn: 'ডিকশনারিতে কী কী চাবি আছে print(ডিকশনারি) দিয়ে দেখে নিন, তারপর বানান মিলিয়ে নিন।',
    }),
  },
  {
    name: ['AttributeError'],
    make: ({ at, err }) => ({
      titleBn: 'এই জিনিসের এমন কোনো গুণ বা কাজ নেই',
      explanationBn: `${at}এখানে এমন একটি নাম ধরে ডাকা হয়েছে, যা ওই জিনিসের নেই। বানান ভুল, কিংবা অন্য ধরনের মানের (যেমন লেখার জন্য সংখ্যার কাজ) ক্ষেত্রে এমন হয়। ${COMMON}\n(${err.message})`,
      tryBn: 'ডটের (.) পরের নামটির বানান মিলিয়ে নিন, আর ভেরিয়েবলে (variable) কী ধরনের মান আছে তা দেখুন।',
    }),
  },
  {
    name: ['ModuleNotFoundError', 'ImportError'],
    make: ({ at, err }) => ({
      titleBn: 'এই মডিউলটি (module) খুঁজে পাওয়া যাচ্ছে না',
      explanationBn: `${at}যে মডিউলটি (module) আনতে চাওয়া হয়েছে, সেটি এই অনুশীলনের জায়গায় নেই — বানান ভুল হতে পারে, অথবা এটি এখানে সমর্থিত নয়। (${err.message})`,
      tryBn: 'import-এর পরের নামটির বানান দেখে নিন। এই অনুশীলনে পাইথনের নিজস্ব মডিউল (যেমন math, random) ব্যবহার করা যায়।',
    }),
  },
  {
    name: ['FileNotFoundError'],
    make: ({ at }) => ({
      titleBn: 'ফাইলটি খুঁজে পাওয়া যাচ্ছে না',
      explanationBn: `${at}যে নামের ফাইল খুলতে চাওয়া হয়েছে, সেটি এখানে নেই। এই অনুশীলনের জায়গায় আপনার কম্পিউটারের ফাইল খোলা যায় না। ${COMMON}`,
      tryBn: 'ফাইল না খুলে সরাসরি print() ও ভেরিয়েবল (variable) নিয়ে অনুশীলন করুন।',
    }),
  },
  {
    name: ['EOFError'],
    make: ({ at }) => ({
      titleBn: 'input()-এর জন্য কোনো উত্তর পাওয়া যায়নি',
      explanationBn: `${at}প্রোগ্রাম আপনার কাছে একটি উত্তর চেয়েছিল, কিন্তু কিছু পায়নি।`,
      tryBn: 'উত্তরের ঘরে কিছু লিখে আবার চালান।',
    }),
  },
  {
    name: ['RecursionError'],
    make: ({ at }) => ({
      titleBn: 'ফাংশন নিজেকে বারবার ডেকেই চলেছে',
      explanationBn: `${at}একটি ফাংশন (function) নিজেকেই বারবার ডাকছে, কখনো থামছে না, তাই পাইথন থামিয়ে দিয়েছে। ${COMMON}`,
      tryBn: 'ফাংশনে এমন একটি শর্ত রাখুন, যেখানে সে আর নিজেকে না ডেকে ফল ফেরত দেবে।',
    }),
  },
]

// ---------------------------------------------------------------------------------------------------------------------
// JavaScript
// ---------------------------------------------------------------------------------------------------------------------
const JAVASCRIPT: Rule[] = [
  {
    name: ['SyntaxError'],
    msg: /Unexpected end of input/,
    make: ({ at }) => ({
      titleBn: 'কোড হঠাৎ করে শেষ হয়ে গেছে, কিছু বন্ধ করা হয়নি',
      explanationBn: `${at}কোনো বন্ধনী ( ), { }, [ ] বা উদ্ধৃতি চিহ্ন খোলা হয়েছিল, কিন্তু বন্ধ করা হয়নি, তাই কোড শেষ হওয়ার আগেই জাভাস্ক্রিপ্ট আটকে গেছে। ${COMMON}`,
      tryBn: 'খোলা বন্ধনীগুলো গুনে দেখুন — প্রতিটি খোলা বন্ধনীর একটি করে বন্ধ বন্ধনী থাকা চাই।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /Invalid or unexpected token|Unterminated string|Unterminated template/,
    make: ({ at }) => ({
      titleBn: 'এমন একটি চিহ্ন আছে যা জাভাস্ক্রিপ্ট বুঝতে পারছে না',
      explanationBn: `${at}সম্ভবত কোনো লেখার (string) উদ্ধৃতি চিহ্ন (" বা ') বন্ধ করা হয়নি, অথবা এমন কোনো অদ্ভুত চিহ্ন ঢুকে গেছে। ${COMMON}`,
      tryBn: 'লেখাগুলোর শুরু ও শেষে একই ধরনের উদ্ধৃতি চিহ্ন আছে কি না দেখুন। অন্য জায়গা থেকে কপি করলে বাঁকা উদ্ধৃতি চিহ্ন (“ ”) এসে যেতে পারে — সেগুলো সোজা (") দিয়ে বদলে নিন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /missing \) after argument list/,
    make: ({ at }) => ({
      titleBn: 'ফাংশনের বন্ধনী বন্ধ করা হয়নি, বা কমা বাদ পড়েছে',
      explanationBn: `${at}console.log(...)-এর মতো ডাকের শেষে ")" বাদ পড়েছে, অথবা ভেতরের দুটি জিনিসের মাঝে কমা (,) বাদ পড়েছে। ${COMMON}`,
      tryBn: 'লাইনটির শেষে ")" আছে কি না, আর ভেতরের জিনিসগুলোর মাঝে কমা আছে কি না দেখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /Unexpected identifier|Unexpected string|Unexpected number/,
    make: ({ at }) => ({
      titleBn: 'একটি শব্দ এমন জায়গায় এসেছে যেখানে আশা করা হয়নি',
      explanationBn: `${at}কোনো একটি নাম বা লেখা এমন জায়গায় বসেছে যেখানে জাভাস্ক্রিপ্ট তা আশা করেনি। সাধারণত তার আগে কমা (,), সেমিকোলন (;) বা কোনো চিহ্ন বাদ পড়েছে। ${COMMON}`,
      tryBn: 'ওই লাইন এবং তার আগের লাইনটি পড়ুন। দুটি জিনিসের মাঝে কমা বা "+" লাগবে কি না ভেবে দেখুন।',
    }),
  },
  {
    name: ['SyntaxError'],
    msg: /Unexpected token/,
    make: ({ at }) => ({
      titleBn: 'একটি চিহ্ন এমন জায়গায় এসেছে যেখানে আশা করা হয়নি',
      explanationBn: `${at}কোনো একটি চিহ্ন (যেমন বন্ধনী, কমা বা সমান চিহ্ন) ভুল জায়গায় বসেছে, অথবা তার আগের কিছু বাদ পড়ে গেছে। ${COMMON}`,
      tryBn: 'চিহ্নটির আগের অংশটি ধীরে পড়ুন; কোনো মান বা বন্ধনী বাদ পড়ে থাকতে পারে।',
    }),
  },
  {
    name: ['SyntaxError'],
    make: ({ at }) => ({
      titleBn: 'লেখার নিয়মে (syntax) একটু গোলমাল আছে',
      explanationBn: `${at}কোডের লেখার নিয়মে কোথাও গোলমাল আছে, তাই জাভাস্ক্রিপ্ট বুঝতে পারছে না। ${COMMON}`,
      tryBn: 'ওই লাইন এবং তার আগের লাইনটি ধীরে পড়ে বন্ধনী, কমা ও উদ্ধৃতি চিহ্ন মিলিয়ে দেখুন।',
    }),
  },
  {
    name: ['ReferenceError'],
    msg: /(.+?) is not defined|Cannot access '(.+?)' before initialization/,
    make: ({ m, at }) => {
      const n = m[1] ?? m[2]
      return {
        titleBn: `${q(n)} নামটি খুঁজে পাওয়া যাচ্ছে না`,
        explanationBn: `${at}${q(n)} নামে কোনো ভেরিয়েবল (variable) আগে তৈরি করা হয়নি — বানানে হেরফের হতে পারে, কিংবা তৈরির আগেই ব্যবহার করা হয়েছে। সাধারণ লেখা হলে উদ্ধৃতি চিহ্ন (" ") বাদ পড়েছে কি না দেখুন। ${COMMON}`,
        tryBn: `${q(n)} কোথায় তৈরি করেছেন (let বা const দিয়ে) খুঁজে বানান মিলিয়ে নিন। লেখা হলে এভাবে লিখুন: "লেখা"।`,
      }
    },
  },
  {
    name: ['TypeError'],
    msg: /Cannot read propert(?:y|ies) of (undefined|null) \(reading '(.+?)'\)/,
    make: ({ m, at }) => ({
      titleBn: `${m[1]}-এর ভেতর থেকে '${m[2]}' পড়া যায় না`,
      explanationBn: `${at}যে ভেরিয়েবলের (variable) ভেতর থেকে '${m[2]}' নিতে চাওয়া হয়েছে, তাতে আসলে কোনো মান নেই (${m[1]})। ${COMMON}`,
      tryBn: 'ডটের (.) আগের নামটি কোথায় মান পায় তা দেখুন; console.log দিয়ে সেটির মান ছাপিয়ে নিতে পারেন।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /Cannot set propert(?:y|ies) of (undefined|null)/,
    make: ({ m, at }) => ({
      titleBn: 'মান নেই এমন জিনিসে কিছু বসানো যায় না',
      explanationBn: `${at}যেখানে মান বসাতে চাওয়া হয়েছে, সেই ভেরিয়েবলে (variable) আসলে কোনো মান নেই (${m[1]})। ${COMMON}`,
      tryBn: 'ডটের (.) আগের নামটি ঠিকমতো তৈরি করা হয়েছে কি না দেখুন।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /(.+?) is not a function/,
    make: ({ m, at }) => ({
      titleBn: `${q(m[1])} একটি ফাংশন নয়`,
      explanationBn: `${at}${q(m[1])} নামটিকে ফাংশনের (function) মতো ডাকা হয়েছে, কিন্তু সেটি ফাংশন নয়। বানান ভুল হতে পারে (বড়-ছোট হাতের অক্ষর খেয়াল করুন), কিংবা অন্য ধরনের মানের কাজ ডাকা হয়েছে। ${COMMON}`,
      tryBn: 'নামটির বানান মিলিয়ে দেখুন। যেমন console.log-এর "l" ছোট হাতের।',
    }),
  },
  {
    name: ['TypeError'],
    msg: /Assignment to constant variable/,
    make: ({ at }) => ({
      titleBn: 'const দিয়ে বানানো মান বদলানো যায় না',
      explanationBn: `${at}const দিয়ে তৈরি করা ভেরিয়েবলের (variable) মান একবার দেওয়ার পর আর বদলানো যায় না। ${COMMON}`,
      tryBn: 'মান বদলাতে চাইলে ভেরিয়েবলটি const-এর বদলে let দিয়ে তৈরি করুন।',
    }),
  },
  {
    name: ['TypeError'],
    make: ({ at }) => ({
      titleBn: 'মানের ধরন (type) কাজের সাথে মিলছে না',
      explanationBn: `${at}কোনো কাজে এমন মান ব্যবহার হয়েছে, যা দিয়ে কাজটি করা যায় না। ${COMMON}`,
      tryBn: 'লাইনটিতে কোন কোন মান আছে console.log দিয়ে ছাপিয়ে দেখুন।',
    }),
  },
  {
    name: ['RangeError'],
    msg: /Maximum call stack size exceeded/,
    make: ({ at }) => ({
      titleBn: 'ফাংশন নিজেকে বারবার ডেকেই চলেছে',
      explanationBn: `${at}একটি ফাংশন (function) নিজেকেই বারবার ডাকছে, কখনো থামছে না, তাই জাভাস্ক্রিপ্ট থামিয়ে দিয়েছে। ${COMMON}`,
      tryBn: 'ফাংশনে এমন একটি শর্ত রাখুন, যেখানে সে আর নিজেকে না ডেকে ফল ফেরত দেবে।',
    }),
  },
  {
    name: ['RangeError'],
    make: ({ at }) => ({
      titleBn: 'একটি মান সীমার বাইরে চলে গেছে',
      explanationBn: `${at}এমন একটি মান দেওয়া হয়েছে, যা এই কাজের জন্য অনেক বড়, ছোট বা অবৈধ। ${COMMON}`,
      tryBn: 'সংখ্যাগুলো ঠিক আছে কি না একবার ছাপিয়ে দেখুন।',
    }),
  },
]

function generic(language: Lang, err: RunError, at: string): FriendlyError {
  return {
    titleBn: 'একটি সমস্যা হয়েছে',
    explanationBn: `${at}প্রোগ্রামটি চলার সময় একটি সমস্যায় থেমে গেছে। ${COMMON}নিচে ইংরেজিতে আসল বার্তাটি (${err.name}) দেখানো আছে, সমস্যাটি কোথায়, তা সেখান থেকে বোঝা যেতে পারে।`,
    tryBn: `${language === 'python' ? 'পাইথন' : 'জাভাস্ক্রিপ্ট'} কোডটি আবার ধীরে পড়ে দেখুন। লাইনটি এবং তার আগের লাইনটি মিলিয়ে নিন।`,
  }
}

/**
 * Bengali, blame-free explanation for common beginner errors. The caller keeps showing the original English message
 * (`err.message` / `err.raw`) next to it. Always returns something (generic fallback for unknown errors).
 */
export function translateError(language: Lang, err: RunError): FriendlyError {
  const at = err.line ? `লাইন ${toBengaliDigits(err.line)}-এ ` : ''
  const rules = [...SHARED, ...(language === 'python' ? PYTHON : JAVASCRIPT)]
  for (const rule of rules) {
    if (rule.name && !rule.name.includes(err.name)) continue
    let m: RegExpExecArray | null
    if (rule.msg) {
      m = rule.msg.exec(err.message)
      if (!m) continue
    } else {
      m = /(?:)/.exec('') as RegExpExecArray
    }
    return rule.make({ m, at, err })
  }
  return generic(language, err, at)
}
