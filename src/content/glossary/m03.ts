import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'window', termBn: 'উইন্ডো', termEn: 'Window', icon: '🪟', art: 'window', meaningBn: 'পর্দায় প্রোগ্রামের চৌকো জানালা। Windows বা Mac — দুই কম্পিউটারেই প্রোগ্রাম নিজের উইন্ডোতে চলে।', module: 3 },
  { id: 'title-bar', termBn: 'টাইটেল বার', termEn: 'Title Bar', icon: '➖', meaningBn: 'উইন্ডোর ওপরের লম্বা পট্টি, নাম লেখা থাকে। এটি ধরে টেনে উইন্ডো সরানো যায়।', module: 3 },
  { id: 'minimize', termBn: 'মিনিমাইজ (নামিয়ে রাখা)', termEn: 'Minimize', icon: '🔽', meaningBn: 'উইন্ডো নিচে নামিয়ে রাখা। প্রোগ্রাম বন্ধ হয় না; টাস্কবার বা ডক থেকে ফেরানো যায়।', module: 3 },
  { id: 'maximize', termBn: 'ম্যাক্সিমাইজ (বড় করা)', termEn: 'Maximize', icon: '🔼', meaningBn: 'উইন্ডো পুরো পর্দা জুড়ে বড় করা। Mac-এ সবুজ বোতাম (Zoom) প্রায় এই কাজ করে।', module: 3 },
  { id: 'restore-window', termBn: 'রিস্টোর (আগের মাপে ফেরানো)', termEn: 'Restore', icon: '↩️', meaningBn: 'বড় করা উইন্ডো আবার আগের মাপে ফেরানো।', module: 3 },
  { id: 'close', termBn: 'ক্লোজ (বন্ধ করা)', termEn: 'Close', icon: '✖️', meaningBn: 'উইন্ডো পুরোপুরি বন্ধ করা। সেভ না করা থাকলে কম্পিউটার জিজ্ঞেস করে।', module: 3 },
  { id: 'resize', termBn: 'রিসাইজ (মাপ বদলানো)', termEn: 'Resize', icon: '↔️', meaningBn: 'কোণা বা কিনারা ধরে টেনে উইন্ডো ছোট বা বড় করা।', module: 3 },
  { id: 'switch', termBn: 'সুইচ (এক উইন্ডো থেকে অন্যটিতে যাওয়া)', termEn: 'Switch', icon: '🔁', meaningBn: 'চালু থাকা এক উইন্ডো ছেড়ে অন্যটিতে কাজ করতে যাওয়া।', module: 3 },
  { id: 'active-window', termBn: 'সক্রিয় উইন্ডো', termEn: 'Active Window', icon: '⭐', meaningBn: 'যে উইন্ডোতে এখন কাজ করছেন। সবার সামনে থাকে; কিবোর্ডের লেখা এখানেই যায়।', module: 3 },
  { id: 'taskbar-button', termBn: 'টাস্কবার বোতাম', termEn: 'Taskbar Button', icon: '📌', art: 'taskbar', meaningBn: 'টাস্কবারে চালু প্রোগ্রামের আইকন। ক্লিকে উইন্ডো ফেরে। Mac-এ কাজ করে ডকের আইকন।', module: 3 },
  { id: 'alt-tab', termBn: 'অল্ট-ট্যাব', termEn: 'Alt+Tab', icon: '⌨️', art: 'keyboard', meaningBn: 'Windows-এর শর্টকাট: Alt ধরে Tab চাপলে আগের উইন্ডোতে যাওয়া যায়।', module: 3 },
  { id: 'cmd-tab', termBn: 'কমান্ড-ট্যাব', termEn: 'Cmd+Tab', icon: '⌨️', art: 'keyboard', meaningBn: 'Mac-এর শর্টকাট: ⌘ Command ধরে Tab চাপলে আগের প্রোগ্রামে যাওয়া যায়।', module: 3 },
  { id: 'shortcut-pad', termBn: 'শর্টকাট প্যাড', termEn: 'Shortcut Pad', icon: '🎹', art: 'keyboard', meaningBn: 'এই অ্যাপের পর্দায় আঁকা কিবোর্ড-বোতাম। ব্রাউজার যে শর্টকাট আটকায়, এখানে ক্লিক করে অনুশীলন করুন।', module: 3 },
]

export default entries
