export interface LanguageCard {
  id: 'html' | 'css' | 'javascript' | 'python'
  nameBn: string
  nameEn: string
  taglineBn: string
  /** at most 3 lines */
  code: string
  codeExplainBn: string
  goodForBn: string[]
}

export const LANGUAGE_CARDS: LanguageCard[] = [
  {
    id: 'html',
    nameBn: 'HTML',
    nameEn: 'HTML',
    taglineBn: 'ওয়েবপেজের কাঠামো — কোথায় কী থাকবে',
    code: '<h1>স্বাগতম</h1>\n<p>আমি প্রোগ্রামিং শিখছি।</p>\n<a href="https://example.com">একটি লিংক</a>',
    codeExplainBn: 'বড় শিরোনাম, একটি অনুচ্ছেদ আর একটি লিংক। <h1>, <p> এগুলোকে ট্যাগ বলে।',
    goodForBn: ['নিজের পরিচয়ের পাতা বা রেসিপির ওয়েবপেজ বানাতে', 'লেখা, ছবি, লিংক আর তালিকা সাজাতে', 'প্রথম দিনেই চোখের সামনে ফল দেখতে'],
  },
  {
    id: 'css',
    nameBn: 'CSS',
    nameEn: 'CSS',
    taglineBn: 'ওয়েবপেজের সাজ — রং, আকার, জায়গা',
    code: 'h1 {\n  color: green;\n}',
    codeExplainBn: '“সব বড় শিরোনাম সবুজ হোক” — এই নির্দেশটিই CSS।',
    goodForBn: ['রং, ফন্ট আর ফাঁকা জায়গা ঠিক করতে', 'পাতাকে সুন্দর ও পড়তে আরামদায়ক করতে', 'ফোন আর কম্পিউটারে পাতা মানিয়ে দিতে'],
  },
  {
    id: 'javascript',
    nameBn: 'JavaScript',
    nameEn: 'JavaScript',
    taglineBn: 'ওয়েবপেজের আচরণ — চাপলে কী ঘটবে',
    code: 'let person = "রুমা"\nconsole.log("হ্যালো, " + person)\nconsole.log(10 * 3)',
    codeExplainBn: 'একটি নাম মনে রাখে, শুভেচ্ছা লেখে, তারপর ১০ × ৩ = ৩০ হিসাব করে দেখায়।',
    goodForBn: ['বোতাম চাপলে কিছু ঘটানো, ফর্ম যাচাই করা', 'ওয়েবপেজে নড়াচড়া, ছোট খেলা আর ক্যালকুলেটর', 'যেকোনো ব্রাউজারেই চলে — আলাদা কিছু নামাতে হয় না'],
  },
  {
    id: 'python',
    nameBn: 'Python',
    nameEn: 'Python',
    taglineBn: 'সব কাজের পড়তে-সহজ ভাষা',
    code: 'person = "রুমা"\nprint("হ্যালো, " + person)\nprint(2 + 3)',
    codeExplainBn: 'নাম রাখে, শুভেচ্ছা দেখায়, তারপর ২ + ৩ = ৫ হিসাব করে। print মানে পর্দায় দেখাও।',
    goodForBn: ['হিসাব, তালিকা আর ডেটা নিয়ে কাজ (যেমন খরচের হিসাব)', 'বারবার করা কাজ নিজে নিজে করানো (অটোমেশন, স্ক্রিপ্ট)', 'ডেটা বিশ্লেষণ আর এআই (AI)-এর কাজে খুব বেশি ব্যবহার হয়'],
  },
]
