/** Pure data for the Module 20 widgets (html-anatomy, code-trace). */

export interface AnatomyPart {
  id: string
  /** the piece of code shown on the button */
  text: string
  titleBn: string
  detailBn: string
}

export const HTML_PARTS: AnatomyPart[] = [
  { id: 'open', text: '<a', titleBn: 'খোলার ট্যাগ (শুরু)', detailBn: 'ট্যাগ < দিয়ে শুরু হয়। a হলো ট্যাগের নাম: a মানে anchor, অর্থাৎ লিংক।' },
  { id: 'attr', text: ' href=', titleBn: 'অ্যাট্রিবিউটের নাম', detailBn: 'href হলো অ্যাট্রিবিউট (Attribute): ট্যাগের অতিরিক্ত তথ্য। এখানে লিংকটি কোথায় যাবে তা বলে।' },
  { id: 'value', text: '"https://example.com"', titleBn: 'অ্যাট্রিবিউটের মান', detailBn: 'মানটি কোটেশন চিহ্নের ভেতরে লেখা হয়। এখানে যাওয়ার ঠিকানা।' },
  { id: 'close-bracket', text: '>', titleBn: 'খোলার ট্যাগ শেষ', detailBn: '> চিহ্ন খোলার ট্যাগ শেষ করে। এর পর থেকে লেখাটি শুরু।' },
  { id: 'content', text: 'Click me', titleBn: 'ভেতরের লেখা (Content)', detailBn: 'পাতায় এই লেখাটিই দেখা যায় আর এতেই ক্লিক করা যায়।' },
  { id: 'end', text: '</a>', titleBn: 'বন্ধের ট্যাগ', detailBn: 'যা খুলেছি তা বন্ধ করি। বন্ধের ট্যাগে নামের আগে একটি / থাকে। পুরোটা মিলিয়ে একটি এলিমেন্ট (Element)।' },
]

export const CSS_PARTS: AnatomyPart[] = [
  { id: 'selector', text: 'h1', titleBn: 'সিলেক্টর (Selector)', detailBn: 'কাকে সাজাব? h1 মানে পাতার সব বড় শিরোনাম।' },
  { id: 'brace-open', text: ' { ', titleBn: 'নিয়মের শুরু', detailBn: '{ আর } বন্ধনীর ভেতরে নিয়মগুলো থাকে।' },
  { id: 'property', text: 'color', titleBn: 'প্রপার্টি (Property)', detailBn: 'কী বদলাব? color মানে লেখার রং। আরও আছে font-size, text-align, margin, padding।' },
  { id: 'colon', text: ': ', titleBn: 'কোলন', detailBn: 'প্রপার্টি আর ভ্যালুর মাঝে একটি কোলন (:) বসে।' },
  { id: 'value', text: 'teal', titleBn: 'ভ্যালু (Value)', detailBn: 'কীভাবে বদলাব? teal একটি রঙের নাম। red, blue, tomato — আরও অনেক নাম চলে।' },
  { id: 'semi', text: ';', titleBn: 'সেমিকোলন', detailBn: 'প্রতিটি নিয়মের শেষে ; দিতে হয়। ভুলে গেলে পরের নিয়মটি কাজ নাও করতে পারে।' },
  { id: 'brace-close', text: ' }', titleBn: 'নিয়মের শেষ', detailBn: '} চিহ্ন নিয়মের ঘর বন্ধ করে।' },
]

export interface TraceFrame {
  /** 1-based line of the program that just ran (0 = not started) */
  line: number
  vars: Record<string, string>
  output: string[]
  noteBn: string
}

export const TRACE_PROGRAM = ['name = "Rumi"', 'age = 20', 'print(name)', 'if age >= 18:', '    print("adult")', 'else:', '    print("not yet")']

export const TRACE_FRAMES: TraceFrame[] = [
  { line: 0, vars: {}, output: [], noteBn: 'প্রোগ্রাম এখনো শুরু হয়নি। পাইথন ওপর থেকে নিচে, এক লাইন এক লাইন করে পড়ে। “পরের লাইন” চাপুন।' },
  { line: 1, vars: { name: '"Rumi"' }, output: [], noteBn: 'name নামের বাক্স তৈরি হলো, ভেতরে রাখা হলো Rumi।' },
  { line: 2, vars: { name: '"Rumi"', age: '20' }, output: [], noteBn: 'age নামের আরেকটি বাক্সে রাখা হলো সংখ্যা ২০।' },
  { line: 3, vars: { name: '"Rumi"', age: '20' }, output: ['Rumi'], noteBn: 'print(name): name বাক্সের ভেতরের জিনিস পর্দায় ছাপা হলো।' },
  { line: 4, vars: { name: '"Rumi"', age: '20' }, output: ['Rumi'], noteBn: 'শর্ত দেখা হচ্ছে: age >= 18, অর্থাৎ ২০ কি ১৮-র সমান বা বেশি? হ্যাঁ, সত্য! তাই if-এর ভেতরের লাইন চলবে।' },
  { line: 5, vars: { name: '"Rumi"', age: '20' }, output: ['Rumi', 'adult'], noteBn: 'ভেতরে সরানো লাইনটি চলল: adult ছাপা হলো। শর্ত সত্য ছিল, তাই else-এর অংশ বাদ — পাইথন ওটি পড়ে না।' },
]

/** Frame after pressing “next” (stays on the last frame). */
export const nextFrame = (i: number) => Math.min(TRACE_FRAMES.length - 1, i + 1)
export const prevFrame = (i: number) => Math.max(0, i - 1)
