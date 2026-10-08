export interface ShotRow {
  id: string
  keys: string[]
  whatBn: string
  whereBn: string
}

/** Real screenshot shortcuts (Windows 11 / recent macOS). */
export const SHOT_ROWS: Record<'windows' | 'mac', ShotRow[]> = {
  windows: [
    { id: 'prtscn', keys: ['PrtScn'], whatBn: 'পুরো পর্দার ছবি তোলে', whereBn: 'ছবিটি শুধু ক্লিপবোর্ডে (কপি করা অবস্থায়) থাকে — কোথাও পেস্ট করলে দেখা যায়' },
    { id: 'win-prtscn', keys: ['Win', 'PrtScn'], whatBn: 'পুরো পর্দার ছবি তোলে', whereBn: 'ফাইল হিসেবে Pictures › Screenshots ফোল্ডারে জমা হয়' },
    { id: 'win-shift-s', keys: ['Win', 'Shift', 'S'], whatBn: 'পর্দার একটি অংশ বেছে ছবি তোলে', whereBn: 'ছবিটি ক্লিপবোর্ডে যায়; নিচের ডান কোণের নোটিফিকেশনে ক্লিক করে সেভ করা যায়' },
  ],
  mac: [
    { id: 'cmd-shift-3', keys: ['Shift', 'Command', '3'], whatBn: 'পুরো পর্দার ছবি তোলে', whereBn: 'ডেস্কটপে “Screenshot ….png” নামে ফাইল হয়ে যায়' },
    { id: 'cmd-shift-4', keys: ['Shift', 'Command', '4'], whatBn: 'ক্রসচিহ্ন দিয়ে টেনে একটি অংশ বেছে ছবি তোলে', whereBn: 'ডেস্কটপে “Screenshot ….png” নামে ফাইল হয়ে যায়' },
    { id: 'cmd-shift-5', keys: ['Shift', 'Command', '5'], whatBn: 'স্ক্রিনশটের টুলবার খোলে (পুরো পর্দা / একটি অংশ বেছে নেওয়া যায়)', whereBn: 'বেছে নেওয়ার পর Capture চাপলে ছবি জমা হয়' },
  ],
}
