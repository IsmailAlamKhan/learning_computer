import type { Block, Chart, Goal } from './flowchart'
import { seqValue } from './flowchart'

const B = (id: string, kind: Block['kind'], label: string, x: number, y: number, extra: Partial<Block> = {}): Block => ({ id, kind, label, x, y, ...extra })

const umbrella: Goal = {
  id: 'umbrella',
  level: 1,
  titleBn: 'সহজ: ছাতা নেওয়ার সিদ্ধান্ত',
  taskBn: 'বাড়ি থেকে বেরোনোর আগে: বৃষ্টি হচ্ছে কি না দেখুন। হলে ছাতা নিন, তারপর (সব ক্ষেত্রেই) বেরিয়ে পড়ুন।',
  tipBn: 'একটি সিদ্ধান্ত (হীরা) লাগবে। “হ্যাঁ” আর “না” — দুই দিক থেকেই শেষে “বেরিয়ে পড়ুন” কাজে পৌঁছাতে হবে।',
  conditions: [{ id: 'rain', labelBn: 'বৃষ্টি হচ্ছে?', test: (i) => i.rain === true }],
  actions: [
    { id: 'umbrella', labelBn: 'ছাতা নিন' },
    { id: 'go', labelBn: 'বেরিয়ে পড়ুন' },
    { id: 'stay', labelBn: 'বাড়িতে থাকুন' },
  ],
  tests: [
    { inputs: { rain: true }, descBn: 'বৃষ্টি হচ্ছে', expected: ['umbrella', 'go'] },
    { inputs: { rain: false }, descBn: 'বৃষ্টি হচ্ছে না', expected: ['go'] },
  ],
  solution: {
    blocks: [
      B('b1', 'start', 'শুরু', 120, 50, { next: 'b2' }),
      B('b2', 'decision', 'বৃষ্টি হচ্ছে?', 120, 160, { ref: 'rain', yes: 'b3', no: 'b4' }),
      B('b3', 'action', 'ছাতা নিন', 330, 260, { ref: 'umbrella', next: 'b4' }),
      B('b4', 'action', 'বেরিয়ে পড়ুন', 120, 360, { ref: 'go', next: 'b5' }),
      B('b5', 'end', 'শেষ', 120, 450),
    ],
  } satisfies Chart,
}

const marks: Goal = {
  id: 'marks',
  level: 2,
  titleBn: 'মাঝারি: পাস না ফেল?',
  taskBn: 'নম্বর (ইনপুট) দেখে নিন। নম্বর ৩৩ বা তার বেশি হলে “পাস লিখুন”, নইলে “ফেল লিখুন”।',
  tipBn: 'প্রথমে একটি কাজ: “নম্বর দেখুন”। তারপর সিদ্ধান্ত: “নম্বর ৩৩ বা তার বেশি?” (৮০-এর শর্তটি এখানে লাগবে না — ওটি ভুলিয়ে দেওয়ার জন্য)।',
  conditions: [
    { id: 'm33', labelBn: 'নম্বর ৩৩ বা তার বেশি?', test: (i) => Number(i.marks) >= 33 },
    { id: 'm80', labelBn: 'নম্বর ৮০ বা তার বেশি?', test: (i) => Number(i.marks) >= 80 },
  ],
  actions: [
    { id: 'read', labelBn: 'নম্বর দেখুন' },
    { id: 'pass', labelBn: 'পাস লিখুন' },
    { id: 'fail', labelBn: 'ফেল লিখুন' },
  ],
  tests: [
    { inputs: { marks: 75 }, descBn: 'নম্বর ৭৫', expected: ['read', 'pass'] },
    { inputs: { marks: 33 }, descBn: 'নম্বর ঠিক ৩৩', expected: ['read', 'pass'] },
    { inputs: { marks: 32 }, descBn: 'নম্বর ৩২', expected: ['read', 'fail'] },
    { inputs: { marks: 0 }, descBn: 'নম্বর ০', expected: ['read', 'fail'] },
  ],
  solution: {
    blocks: [
      B('b1', 'start', 'শুরু', 120, 50, { next: 'b2' }),
      B('b2', 'action', 'নম্বর দেখুন', 120, 150, { ref: 'read', next: 'b3' }),
      B('b3', 'decision', 'নম্বর ৩৩ বা তার বেশি?', 120, 270, { ref: 'm33', yes: 'b4', no: 'b5' }),
      B('b4', 'action', 'পাস লিখুন', 330, 370, { ref: 'pass', next: 'b6' }),
      B('b5', 'action', 'ফেল লিখুন', 120, 370, { ref: 'fail', next: 'b6' }),
      B('b6', 'end', 'শেষ', 120, 470),
    ],
  } satisfies Chart,
}

const teaLoop: Goal = {
  id: 'tea-loop',
  level: 3,
  titleBn: 'কঠিন: চায়ের লুপ',
  taskBn: 'কাপে চা ঢালুন। চা ঠান্ডা হয়ে থাকলে আবার গরম করুন, আর প্রতিবার গরম করার পর আবার দেখুন ঠান্ডা কি না। ঠান্ডা না হলে চা পান করুন।',
  tipBn: '“আবার গরম করুন” কাজের তীরটি সিদ্ধান্তে ফিরে আসবে — এটাই লুপ। “না” দিকটি হবে বেরোনোর পথ।',
  conditions: [{ id: 'cold', labelBn: 'চা ঠান্ডা হয়ে গেছে?', test: (i, n) => seqValue(i.cold, n) }],
  actions: [
    { id: 'pour', labelBn: 'কাপে চা ঢালুন' },
    { id: 'reheat', labelBn: 'চা আবার গরম করুন' },
    { id: 'drink', labelBn: 'চা পান করুন' },
  ],
  tests: [
    { inputs: { cold: [false] }, descBn: 'চা গরমই আছে', expected: ['pour', 'drink'] },
    { inputs: { cold: [true, false] }, descBn: 'একবার গরম করতে হয়', expected: ['pour', 'reheat', 'drink'] },
    { inputs: { cold: [true, true, true, false] }, descBn: 'তিনবার গরম করতে হয়', expected: ['pour', 'reheat', 'reheat', 'reheat', 'drink'] },
  ],
  solution: {
    blocks: [
      B('b1', 'start', 'শুরু', 120, 50, { next: 'b2' }),
      B('b2', 'action', 'কাপে চা ঢালুন', 120, 150, { ref: 'pour', next: 'b3' }),
      B('b3', 'decision', 'চা ঠান্ডা হয়ে গেছে?', 120, 270, { ref: 'cold', yes: 'b4', no: 'b5' }),
      B('b4', 'action', 'চা আবার গরম করুন', 360, 270, { ref: 'reheat', next: 'b3' }),
      B('b5', 'action', 'চা পান করুন', 120, 390, { ref: 'drink', next: 'b6' }),
      B('b6', 'end', 'শেষ', 120, 480),
    ],
  } satisfies Chart,
}

export const GOALS: Goal[] = [umbrella, marks, teaLoop]
export const getGoal = (id: string) => GOALS.find((g) => g.id === id)
