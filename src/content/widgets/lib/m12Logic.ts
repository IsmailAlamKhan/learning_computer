/** Pure logic for the Module 12 widgets (error-copy-search, troubleshoot-flow). */

export const ERROR_MESSAGE = 'Photo Album could not open "holiday.album". Error code PA-1042: the file is damaged or in a newer format.'

/** Collapse whitespace/newlines and curly quotes so a pasted message compares equal to the original. */
export function normalizeMessage(s: string): string {
  return s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Did she select the WHOLE message (not a piece)? Used for the copy step. */
export const isFullMessage = (selected: string) => normalizeMessage(selected) === normalizeMessage(ERROR_MESSAGE)

/** Is what she pasted/typed the exact message, or at least the important part (the error code + program name)? */
export function searchQuality(q: string): 'exact' | 'partial' | 'weak' {
  const n = normalizeMessage(q).toLowerCase()
  if (n === normalizeMessage(ERROR_MESSAGE).toLowerCase()) return 'exact'
  if (n.includes('pa-1042') && n.includes('photo album')) return 'partial'
  return 'weak'
}

export interface SearchResult {
  id: string
  site: string
  titleBn: string
  title: string
  snippet: string
  /** shown as a small badge row */
  date: string
  accepted: boolean
  official: boolean
  /** why it is (not) trustworthy — shown after she chooses */
  whyBn: string
  trustworthy: boolean
}

export const RESULTS: SearchResult[] = [
  {
    id: 'official',
    site: 'help.photoalbum.example (Official help page)',
    titleBn: 'প্রোগ্রামের নিজস্ব সাহায্যের পাতা',
    title: 'Error PA-1042: “could not open” – Photo Album Help',
    snippet: 'Why this happens and how to fix it. Update Photo Album to the latest version, then try opening the file again.',
    date: '3 weeks ago',
    accepted: false,
    official: true,
    whyBn: 'এটি প্রোগ্রামটির নিজের সাহায্যের পাতা (অফিসিয়াল ডকুমেন্টেশন), তারিখও নতুন। সবচেয়ে ভরসাযোগ্য উৎস।',
    trustworthy: true,
  },
  {
    id: 'accepted',
    site: 'answers.example (Q&A forum)',
    titleBn: 'ফোরামের “Accepted answer” চিহ্নিত উত্তর',
    title: '[Solved] Photo Album error PA-1042 on opening a file',
    snippet: '✔ Accepted answer · 214 helpful votes · “Update the program first. If that does not help, restart the computer and copy the file again.”',
    date: '1 month ago',
    accepted: true,
    official: false,
    whyBn: 'প্রশ্নকারী নিজে উত্তরটি “Accepted” করেছেন, অনেকে সাহায্যকারী বলেছেন, তারিখও নতুন। ফোরামের এমন উত্তর সাধারণত কাজের।',
    trustworthy: true,
  },
  {
    id: 'old',
    site: 'old-tips.example (blog)',
    titleBn: 'অনেক পুরোনো ব্লগ — যেকোনো এরর ঠিক করার “জাদু” কমান্ড',
    title: 'ONE trick fixes EVERY Photo Album error!!!',
    snippet: 'Open the terminal and paste this command: del /f /s /q C:\\*.* … (posted 2013, no replies)',
    date: '13 years ago',
    accepted: false,
    official: false,
    whyBn: 'অনেক পুরোনো, কোনো উত্তর বা ভোট নেই, আর এমন একটি কমান্ড চালাতে বলছে যার মানে আপনি জানেন না। এই কমান্ড আপনার সব ফাইল মুছে দিতে পারে। এমন কিছু কখনো চালাবেন না।',
    trustworthy: false,
  },
]

// ------------------------------------------------------------------ decision tree (troubleshoot-flow)

export interface FlowOption {
  labelBn: string
  next: string
}
export type FlowNode =
  | { id: string; kind: 'question'; textBn: string; options: FlowOption[] }
  | { id: string; kind: 'answer'; titleBn: string; stepsBn: string[] }

export const FLOW_START = 'start'

export const FLOW: FlowNode[] = [
  {
    id: 'start',
    kind: 'question',
    textBn: 'কী সমস্যা হচ্ছে?',
    options: [
      { labelBn: 'একটি প্রোগ্রাম সাড়া দিচ্ছে না', next: 'frozen' },
      { labelBn: 'পুরো কম্পিউটারই আটকে আছে', next: 'all' },
      { labelBn: 'ইন্টারনেট নেই', next: 'net' },
      { labelBn: 'আওয়াজ আসছে না', next: 'sound' },
      { labelBn: 'ফাইল হারিয়ে গেছে', next: 'file' },
      { labelBn: 'একটা এরর মেসেজ এসেছে', next: 'a-error' },
    ],
  },
  {
    id: 'frozen',
    kind: 'question',
    textBn: 'আধ মিনিট অপেক্ষা করার পরেও কি প্রোগ্রামটি আটকে আছে?',
    options: [
      { labelBn: 'না, একটু পরে চলতে শুরু করেছে', next: 'a-wait' },
      { labelBn: 'হ্যাঁ, এখনও আটকে', next: 'a-forcequit' },
    ],
  },
  {
    id: 'all',
    kind: 'question',
    textBn: 'মাউসের তীর (পয়েন্টার) কি নড়ছে?',
    options: [
      { labelBn: 'হ্যাঁ, নড়ছে', next: 'frozen' },
      { labelBn: 'না, কিছুই নড়ছে না', next: 'a-power' },
    ],
  },
  {
    id: 'net',
    kind: 'question',
    textBn: 'Wi-Fi আইকনটি কি বন্ধ (Off) দেখাচ্ছে?',
    options: [
      { labelBn: 'হ্যাঁ, বন্ধ', next: 'a-wifi' },
      { labelBn: 'না, চালু আছে', next: 'net2' },
    ],
  },
  {
    id: 'net2',
    kind: 'question',
    textBn: 'আপনার ফোনে কি একই Wi-Fi-তে ইন্টারনেট চলছে?',
    options: [
      { labelBn: 'হ্যাঁ, ফোনে চলছে', next: 'a-restart' },
      { labelBn: 'না, ফোনেও চলছে না', next: 'a-router' },
    ],
  },
  {
    id: 'sound',
    kind: 'question',
    textBn: 'কম্পিউটারের আওয়াজ কি মিউট (Mute) করা বা একদম কম?',
    options: [
      { labelBn: 'হ্যাঁ, মিউট বা কম', next: 'a-unmute' },
      { labelBn: 'না, ঠিকই আছে', next: 'a-speaker' },
    ],
  },
  {
    id: 'file',
    kind: 'question',
    textBn: 'ফাইলটি কি আপনি মুছে ফেলেছিলেন বলে মনে হয়?',
    options: [
      { labelBn: 'হ্যাঁ, হয়তো ভুল করে মুছেছি', next: 'a-restore' },
      { labelBn: 'না, জানি না কোথায় রেখেছিলাম', next: 'a-findfile' },
    ],
  },
  {
    id: 'a-wait',
    kind: 'answer',
    titleBn: 'ধৈর্য ধরাই সমাধান',
    stepsBn: ['প্রোগ্রাম অনেক সময় ভারী কাজ করে বলে কিছুক্ষণ আটকে থাকে। আরেকটু অপেক্ষা করুন।', 'বারবার ক্লিক করবেন না — তাতে আরও দেরি হয়।'],
  },
  {
    id: 'a-forcequit',
    kind: 'answer',
    titleBn: 'প্রোগ্রামটি জোর করে বন্ধ করুন',
    stepsBn: ['Windows: Ctrl + Shift + Esc চেপে Task Manager খুলুন, প্রোগ্রামটি বেছে End task চাপুন।', 'Mac: Option + Command + Esc চেপে Force Quit-এর জানালা খুলুন, প্রোগ্রামটি বেছে Force Quit চাপুন।', 'মনে রাখবেন: সেভ না করা লেখা হারিয়ে যেতে পারে। তারপর প্রোগ্রামটি আবার খুলুন।'],
  },
  {
    id: 'a-power',
    kind: 'answer',
    titleBn: 'শেষ উপায়: জোর করে বন্ধ করে আবার চালু',
    stepsBn: ['এক-দুই মিনিট অপেক্ষা করুন।', 'পাওয়ার বোতামটি কয়েক সেকেন্ড চেপে ধরে রাখুন, কম্পিউটার বন্ধ হলে ছেড়ে দিন।', 'একটু পরে আবার চালু করুন। সেভ না করা কাজ হারিয়ে যেতে পারে।'],
  },
  {
    id: 'a-wifi',
    kind: 'answer',
    titleBn: 'Wi-Fi চালু করুন',
    stepsBn: ['Windows: নিচের ডান কোণের আইকনগুলোতে ক্লিক করে Wi-Fi বোতাম চালু করুন।', 'Mac: ওপরের মেনু বারের Control Center থেকে Wi-Fi চালু করুন।', 'তারপর ব্রাউজারে পাতাটি আবার লোড (Reload) করুন।'],
  },
  {
    id: 'a-restart',
    kind: 'answer',
    titleBn: 'কম্পিউটারটি রিস্টার্ট করুন',
    stepsBn: ['আগে খোলা কাজ সেভ করুন, তারপর Restart বেছে নিন।', 'ফিরে এসে আবার চেষ্টা করুন। অনেক ছোটখাটো সমস্যা রিস্টার্টেই ঠিক হয়ে যায়।'],
  },
  {
    id: 'a-router',
    kind: 'answer',
    titleBn: 'সমস্যা সম্ভবত রাউটার বা সংযোগে',
    stepsBn: ['রাউটারের বাতিগুলো দেখুন। বন্ধ করে ৩০ সেকেন্ড পরে আবার চালু করুন।', 'তাতেও না হলে ইন্টারনেট সংযোগদাতার (ISP) সাহায্য নিন — এটি কম্পিউটারের দোষ নয়।'],
  },
  {
    id: 'a-unmute',
    kind: 'answer',
    titleBn: 'মিউট খুলুন, আওয়াজ বাড়ান',
    stepsBn: ['Windows: নিচের ডান কোণের আইকনে ক্লিক করে Mute বন্ধ করুন বা Volume স্লাইডার ডানে সরান।', 'Mac: ওপরের মেনু বারের Control Center খুলে Sound স্লাইডার ডানে সরান।'],
  },
  {
    id: 'a-speaker',
    kind: 'answer',
    titleBn: 'স্পিকার বা হেডফোন দেখুন',
    stepsBn: ['স্পিকার/হেডফোনের তার ঠিকমতো লাগানো কি না এবং স্পিকার চালু কি না দেখুন।', 'অন্য কোনো ভিডিও বা গানে আওয়াজ আছে কি না পরীক্ষা করুন। না হলে রিস্টার্ট করুন।'],
  },
  {
    id: 'a-restore',
    kind: 'answer',
    titleBn: 'রিসাইকেল বিন / ট্র্যাশ থেকে ফিরিয়ে আনুন',
    stepsBn: ['Windows: Recycle Bin খুলুন, ফাইলটি বেছে Restore চাপুন।', 'Mac: Trash খুলুন, ফাইলটি বেছে Put Back চাপুন।', 'ফাইলটি আগের জায়গাতেই ফিরে আসবে। বিন খালি করে ফেললে আর ফেরানো যায় না — তাই খালি করার আগে ভাবুন।'],
  },
  {
    id: 'a-findfile',
    kind: 'answer',
    titleBn: 'নাম দিয়ে খুঁজুন',
    stepsBn: ['ফাইল ম্যানেজারের সার্চ বক্সে ফাইলের নামের একটু অংশ লিখুন।', 'নাম মনে না থাকলে সম্প্রতি খোলা ফাইলের তালিকা দেখুন।'],
  },
  {
    id: 'a-error',
    kind: 'answer',
    titleBn: 'এরর মেসেজ কপি করে খুঁজুন',
    stepsBn: ['মেসেজটি যেমন আছে হুবহু কপি করুন (Ctrl/Cmd + C)।', 'সার্চ ইঞ্জিনে পেস্ট করে (Ctrl/Cmd + V) খুঁজুন।', 'নতুন তারিখের, অফিসিয়াল বা “Accepted” চিহ্নিত উত্তর পড়ুন। না বুঝে কোনো কমান্ড চালাবেন না।'],
  },
]

const byId = new Map(FLOW.map((n) => [n.id, n]))
export const flowNode = (id: string): FlowNode | undefined => byId.get(id)

/** Every `next` points at a real node and every node is reachable from the start. Returns a list of problems (empty = fine). */
export function validateFlow(nodes: FlowNode[] = FLOW): string[] {
  const ids = new Set(nodes.map((n) => n.id))
  const problems: string[] = []
  const reach = new Set<string>([FLOW_START])
  const queue = [FLOW_START]
  while (queue.length) {
    const cur = queue.pop()
    const n = nodes.find((x) => x.id === cur)
    if (n?.kind !== 'question') continue
    for (const o of n.options) {
      if (!ids.has(o.next)) problems.push(`${n.id} → ${o.next} missing`)
      else if (!reach.has(o.next)) {
        reach.add(o.next)
        queue.push(o.next)
      }
    }
  }
  for (const id of ids) if (!reach.has(id)) problems.push(`${id} unreachable`)
  return problems
}

/** The steps of the standard "something is wrong" order, for the quiz and the widget summary. */
export const HELPER_CHECKLIST_BN = ['আমি কী করছিলাম (কোন প্রোগ্রাম, কোন ধাপে)', 'আমি কী আশা করেছিলাম', 'আসলে কী ঘটল', 'এরর মেসেজটি হুবহু (কপি করে বা স্ক্রিনশট তুলে)']
