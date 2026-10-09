import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'ct-algorithm', termBn: 'অ্যালগরিদম', termEn: 'Algorithm', art: 'recipe-card', meaningBn: 'কাজ শেষ করার ধাপে ধাপে স্পষ্ট নির্দেশ, যেমন রান্নার রেসিপি।', module: 16 },
  { id: 'ct-sequence', termBn: 'ক্রম', termEn: 'Sequence', art: 'stairs', meaningBn: 'ধাপগুলো একটির পর একটি, নির্দিষ্ট ক্রমে করা। ক্রম বদলালে ফল বদলায়।', module: 16 },
  { id: 'ct-decision', termBn: 'সিদ্ধান্ত', termEn: 'Decision (if / else)', art: 'branch', meaningBn: 'হ্যাঁ বা না দেখে দুই পথের একটি বাছা: “যদি… তবে… নইলে…”।', module: 16 },
  { id: 'ct-condition', termBn: 'শর্ত', termEn: 'Condition', icon: '❓', meaningBn: 'সিদ্ধান্তের প্রশ্ন, যার উত্তর শুধু হ্যাঁ বা না — যেমন “বৃষ্টি হচ্ছে?”।', module: 16 },
  { id: 'ct-loop', termBn: 'লুপ', termEn: 'Loop (repetition)', art: 'loop', meaningBn: 'একই কাজ বারবার করা: নির্দিষ্ট কয়েকবার, অথবা “যতক্ষণ না…” শর্ত মেলে।', module: 16 },
  { id: 'ct-flowchart', termBn: 'ফ্লোচার্ট', termEn: 'Flowchart', art: 'flowchart', meaningBn: 'ধাপগুলো ছবির মতো আঁকা: কাজ বাক্সে, সিদ্ধান্ত হীরায়, তীরে পরের ধাপ।', module: 16 },
  { id: 'ct-step', termBn: 'ধাপ', termEn: 'Step', icon: '👣', meaningBn: 'অ্যালগরিদমের একটি ছোট, পরিষ্কার কাজ — যেমন “পানি ফুটতে দিন”।', module: 16 },
  { id: 'ct-input-output', termBn: 'ইনপুট ও আউটপুট', termEn: 'Input / Output', icon: '🔄', meaningBn: 'যা দিই তা ইনপুট (কার্ড, পিন), যা পাই তা আউটপুট (টাকা)।', module: 16 },
  { id: 'ct-decomposition', termBn: 'বড় কাজ ভাগ করা', termEn: 'Decomposition', art: 'puzzle', meaningBn: 'কঠিন কাজকে ছোট ছোট সহজ টুকরোয় ভেঙে নেওয়া।', module: 16 },
  { id: 'ct-pattern', termBn: 'প্যাটার্ন', termEn: 'Pattern', icon: '🔁', meaningBn: 'একাধিক কাজের মধ্যে মিল খুঁজে পাওয়া, যাতে একই সমাধান বারবার চলে।', module: 16 },
  { id: 'ct-bug', termBn: 'বাগ ও ডিবাগ', termEn: 'Bug / Debugging', art: 'bug', meaningBn: 'ধাপের লুকোনো ভুল হলো বাগ; ভুল খুঁজে সারানো হলো ডিবাগ করা।', module: 16 },
  { id: 'ct-true-false', termBn: 'সত্য ও মিথ্যা', termEn: 'True / False', icon: '✅', meaningBn: 'শর্তের দুই উত্তর: মিললে সত্য (True, হ্যাঁ), না মিললে মিথ্যা (False, না)।', module: 16 },
]

export default entries
