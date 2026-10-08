export interface Part {
  id: string
  en: string
  bn: string
  descBn: string
}

export const PARTS: Part[] = [
  { id: 'monitor', en: 'Monitor / Screen', bn: 'মনিটর (পর্দা)', descBn: 'কম্পিউটার যা কিছু দেখাচ্ছে — লেখা, ছবি, ভিডিও — সব এই পর্দায় দেখা যায়। ল্যাপটপে পর্দা ডালার মতো ওপরে ওঠে-নামে।' },
  { id: 'keyboard', en: 'Keyboard', bn: 'কিবোর্ড', descBn: 'অক্ষর, সংখ্যা আর চিহ্ন লেখার কী-এর সারি। কম্পিউটারকে কিছু লিখে জানাতে হলে কিবোর্ড লাগে।' },
  { id: 'mouse', en: 'Mouse', bn: 'মাউস', descBn: 'হাতে ধরে নাড়ালে পর্দার তীর চিহ্নটিও নড়ে। বাঁ বোতামে ক্লিক করে কিছু বেছে নেওয়া বা খোলা যায়। ল্যাপটপের সাথে আলাদা করে লাগানো যায়।' },
  { id: 'touchpad', en: 'Touchpad', bn: 'টাচপ্যাড', descBn: 'ল্যাপটপে মাউসের কাজ করে এই মসৃণ জায়গাটি। এর ওপর আঙুল বুলালে তীর চিহ্ন নড়ে, আঙুলে টোকা দিলে ক্লিক হয়।' },
  { id: 'cpu', en: 'CPU / System unit', bn: 'সিপিইউ (সিস্টেম ইউনিট)', descBn: 'কম্পিউটারের মস্তিষ্ক। সব হিসাব-নিকাশ আর কাজের নির্দেশ এখানেই চলে। ল্যাপটপে এটি কিবোর্ডের নিচে, ভেতরে লুকানো থাকে; ডেস্কটপ কম্পিউটারে এটি আলাদা একটি বাক্স।' },
  { id: 'speakers', en: 'Speakers', bn: 'স্পিকার', descBn: 'গান, ভিডিও আর ভিডিও কলের আওয়াজ এখান থেকে শোনা যায়। ল্যাপটপে সাধারণত কিবোর্ডের দুই পাশে বা নিচে থাকে।' },
  { id: 'webcam', en: 'Webcam', bn: 'ওয়েবক্যাম', descBn: 'পর্দার ওপরের ছোট ক্যামেরা। ভিডিও কলে এটি দিয়ে অন্যরা আপনাকে দেখতে পায়। ব্যবহার না করলে অনেকে এটি ঢেকে রাখেন।' },
  { id: 'charging-port', en: 'Charging port', bn: 'চার্জিং পোর্ট', descBn: 'ল্যাপটপের পাশের যে ছোট গর্তে চার্জারের তার লাগানো হয়। এর আকার ল্যাপটপ ভেদে আলাদা হয়।' },
  { id: 'charger', en: 'Charger', bn: 'চার্জার', descBn: 'দেয়ালের সকেট থেকে বিদ্যুৎ এনে ল্যাপটপের ব্যাটারি ভরে। ল্যাপটপের সাথে আসা নিজের চার্জারটিই ব্যবহার করা ভালো।' },
  { id: 'power-button', en: 'Power button', bn: 'পাওয়ার বাটন', descBn: 'কম্পিউটার চালু করার বোতাম। চালু করতে একবার চাপুন। বন্ধ করার সময় এটি চেপে ধরে নয়, বরং মেনু থেকে “Shut down” বেছে নিন।' },
  { id: 'usb-port', en: 'USB port', bn: 'ইউএসবি পোর্ট', descBn: 'পেনড্রাইভ, মাউস, ফোনের তার বা প্রিন্টার লাগানোর ছোট আয়তাকার গর্ত। একটি ল্যাপটপে সাধারণত একাধিক থাকে।' },
  { id: 'wifi', en: 'Wi‑Fi', bn: 'ওয়াই-ফাই', descBn: 'তার ছাড়াই ইন্টারনেটে যুক্ত হওয়ার ব্যবস্থা। ল্যাপটপের ভেতরেই এর একটি ছোট অংশ থাকে, যা বাসার রাউটার থেকে সংকেত ধরে। পর্দার কোণে বাঁকা দাগের চিহ্ন দেখে বোঝা যায় ওয়াই-ফাই যুক্ত আছে কি না।' },
  { id: 'battery', en: 'Battery', bn: 'ব্যাটারি', descBn: 'ল্যাপটপের ভেতরে থাকে। চার্জারের তার খুলে নিলেও ব্যাটারির জোরে ল্যাপটপ কিছুক্ষণ চলে — মোবাইল ফোনের মতোই।' },
]

export const PARTS_BY_ID: Record<string, Part> = Object.fromEntries(PARTS.map((p) => [p.id, p]))

/** Ids used for the little "check yourself" challenge, asked in this order. */
export const CHALLENGE_IDS = ['keyboard', 'mouse', 'power-button', 'charger']

export function markSeen(seen: readonly string[], id: string): string[] {
  if (!PARTS_BY_ID[id] || seen.includes(id)) return [...seen]
  return [...seen, id]
}

export function seenLabel(seen: readonly string[]): string {
  return `${seen.filter((s) => PARTS_BY_ID[s]).length}/${PARTS.length}`
}

export function allSeen(seen: readonly string[]): boolean {
  return PARTS.every((p) => seen.includes(p.id))
}

export function challengeQuestion(index: number): string | null {
  const id = CHALLENGE_IDS[index]
  return id ? `কোনটি ${PARTS_BY_ID[id].bn}?` : null
}

export function checkChallenge(index: number, clickedId: string): boolean {
  return CHALLENGE_IDS[index] === clickedId
}
