export type StageId = 'input' | 'processing' | 'memory' | 'storage' | 'output'
export const STAGES: { id: StageId; bn: string; en: string; icon: string }[] = [
  { id: 'input', bn: 'ইনপুট', en: 'Input', icon: '⌨️' },
  { id: 'processing', bn: 'প্রসেসিং', en: 'Processing', icon: '🧮' },
  { id: 'memory', bn: 'মেমোরি', en: 'Memory (RAM)', icon: '📋' },
  { id: 'storage', bn: 'স্টোরেজ', en: 'Storage', icon: '🗄️' },
  { id: 'output', bn: 'আউটপুট', en: 'Output', icon: '🖥️' },
]

export interface Scenario {
  id: string
  titleBn: string
  icon: string
  /** text per stage; `null` = this stage is not really needed here */
  stages: Record<StageId, string | null>
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'calculator',
    titleBn: 'ক্যালকুলেটর',
    icon: '🧮',
    stages: {
      input: 'আপনি বোতাম টিপে 7 × 8 দিলেন।',
      processing: 'ছোট প্রসেসর (CPU) গুণ করে 56 বের করল।',
      memory: 'হিসাবের সময় সংখ্যা দুটি সাময়িকভাবে মনে রাখা হলো।',
      storage: null,
      output: 'পর্দায় 56 দেখা গেল।',
    },
  },
  {
    id: 'atm',
    titleBn: 'এটিএম (ATM)',
    icon: '🏧',
    stages: {
      input: 'আপনি কার্ড ঢোকালেন, পিন আর টাকার অঙ্ক দিলেন।',
      processing: 'পিন ঠিক কি না আর ব্যালান্স আছে কি না যাচাই হলো।',
      memory: 'লেনদেন চলাকালীন তথ্যগুলো সাময়িকভাবে মনে রাখা হলো।',
      storage: 'লেনদেনের হিসাব ব্যাংকের কম্পিউটারে জমা থাকল।',
      output: 'মেশিন টাকা আর রসিদ বের করে দিল।',
    },
  },
  {
    id: 'wallet',
    titleBn: 'মোবাইলে টাকা পাঠানো',
    icon: '📱',
    stages: {
      input: 'আপনি ফোনের পর্দায় অঙ্ক লিখে গোপন পিন দিলেন।',
      processing: 'ফোন ও দূরের কম্পিউটার (সার্ভার) মিলে হিসাব যাচাই করল।',
      memory: 'পিন আর অঙ্ক চলতি সময়ে সাময়িকভাবে মনে রাখা হলো।',
      storage: 'লেনদেনের ইতিহাস জমা থাকল, যাতে পরে দেখা যায়।',
      output: 'পর্দায় “পাঠানো হয়েছে” বার্তা এলো।',
    },
  },
  {
    id: 'photo',
    titleBn: 'ছবি তোলা',
    icon: '📷',
    stages: {
      input: 'ক্যামেরা সামনের আলো ধরল।',
      processing: 'প্রসেসর আলোকে ছবিতে রূপ দিল।',
      memory: 'ছবিটি সাময়িকভাবে মনে রেখে পর্দায় দেখানোর জন্য তৈরি রাখা হলো।',
      storage: 'ছবিটি ফাইল হয়ে গ্যালারিতে জমা থাকল।',
      output: 'পর্দায় ছবিটি দেখা গেল।',
    },
  },
]

export const usedStages = (s: Scenario): StageId[] => STAGES.filter((st) => s.stages[st.id] !== null).map((st) => st.id)

export interface Role {
  id: string
  partBn: string
  partEn: string
  icon: string
  kitchenBn: string
  libraryBn: string
}

export const ROLES: Role[] = [
  { id: 'input', partBn: 'ইনপুট', partEn: 'Input', icon: '⌨️', kitchenBn: 'রান্নার উপকরণ: চাল, ডাল, সবজি। বাইরে থেকে কিছু ঢোকে।', libraryBn: 'পাঠকের অনুরোধ: “আমি এই বইটা চাই।”' },
  { id: 'cpu', partBn: 'প্রসেসর', partEn: 'CPU', icon: '🧑‍🍳', kitchenBn: 'রাঁধুনি: হাতে-কলমে আসল কাজটা করেন।', libraryBn: 'পাঠক: যিনি বইয়ের তথ্য নিয়ে ভাবেন।' },
  { id: 'ram', partBn: 'মেমোরি', partEn: 'RAM', icon: '🍽️', kitchenBn: 'রান্নার কাউন্টার: এখন যা লাগছে তা হাতের কাছে থাকে। কাজ শেষে সাফ হয়।', libraryBn: 'পড়ার টেবিল: এখন যে বই পড়ছেন তা এখানে খোলা।' },
  { id: 'storage', partBn: 'স্টোরেজ', partEn: 'Storage', icon: '🧊', kitchenBn: 'ফ্রিজ বা ভাঁড়ার: অনেক জিনিস অনেকদিন রাখা যায়।', libraryBn: 'বইয়ের তাক: সব বই সেখানে জমা থাকে।' },
  { id: 'output', partBn: 'আউটপুট', partEn: 'Output', icon: '🍛', kitchenBn: 'পরিবেশন করা খাবার: কাজের ফল, যা আপনি পান।', libraryBn: 'আপনার হাতে পাওয়া বই বা তথ্য।' },
  { id: 'os', partBn: 'অপারেটিং সিস্টেম', partEn: 'Operating System', icon: '🏠', kitchenBn: 'বাড়ির ব্যবস্থাপক: কে কখন কী পাবে ঠিক করেন, সবাইকে মিলিয়ে চালান।', libraryBn: 'লাইব্রেরিয়ান: কোন বই কোথায়, কে কখন নেবে — সব দেখেন।' },
]
