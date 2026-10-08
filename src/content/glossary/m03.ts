import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'window', termBn: 'উইন্ডো', termEn: 'Window', meaningBn: 'পর্দার ওপর একটি প্রোগ্রামের চৌকো জায়গা। প্রতিটি চালু প্রোগ্রাম নিজের উইন্ডোতে দেখা যায়। এটি কম্পিউটারের অপারেটিং সিস্টেমের নাম নয়, প্রোগ্রামের “জানালা”।', module: 3 },
  { id: 'title-bar', termBn: 'টাইটেল বার', termEn: 'Title Bar', meaningBn: 'উইন্ডোর একদম ওপরের লম্বা পট্টি, যেখানে প্রোগ্রাম বা ফাইলের নাম লেখা থাকে। এটি ধরে টেনে উইন্ডো সরানো যায়।', module: 3 },
  { id: 'minimize', termBn: 'মিনিমাইজ (নামিয়ে রাখা)', termEn: 'Minimize', meaningBn: 'উইন্ডো সাময়িকভাবে নিচে নামিয়ে রাখা। প্রোগ্রাম বন্ধ হয় না, আর টাস্কবার বা ডক থেকে আবার ফিরিয়ে আনা যায়।', module: 3 },
  { id: 'maximize', termBn: 'ম্যাক্সিমাইজ (বড় করা)', termEn: 'Maximize', meaningBn: 'উইন্ডোকে পুরো পর্দা জুড়ে বড় করা। Mac-এ সবুজ বোতামটি প্রায় এই কাজ করে (Zoom)।', module: 3 },
  { id: 'restore', termBn: 'রিস্টোর (আগের মাপে ফেরানো)', termEn: 'Restore', meaningBn: 'বড় করা উইন্ডোকে আবার আগের ছোট মাপে ফিরিয়ে আনা।', module: 3 },
  { id: 'close', termBn: 'ক্লোজ (বন্ধ করা)', termEn: 'Close', meaningBn: 'উইন্ডো পুরোপুরি বন্ধ করা। কাজ সেভ না করা থাকলে কম্পিউটার জিজ্ঞেস করে সেভ করবেন কিনা।', module: 3 },
  { id: 'resize', termBn: 'রিসাইজ (মাপ বদলানো)', termEn: 'Resize', meaningBn: 'উইন্ডোর কিনারা বা কোণা ধরে টেনে সেটিকে ছোট বা বড় করা।', module: 3 },
  { id: 'switch', termBn: 'সুইচ (এক উইন্ডো থেকে অন্যটিতে যাওয়া)', termEn: 'Switch', meaningBn: 'একসাথে চালু থাকা একাধিক উইন্ডোর মধ্যে একটি ছেড়ে অন্যটিতে কাজ করতে যাওয়া।', module: 3 },
  { id: 'active-window', termBn: 'সক্রিয় উইন্ডো', termEn: 'Active Window', meaningBn: 'যে উইন্ডোতে এখন আপনি কাজ করছেন। এটি সবার সামনে থাকে আর কিবোর্ডে যা লিখবেন তা এখানেই যায়।', module: 3 },
  { id: 'taskbar-button', termBn: 'টাস্কবার বোতাম', termEn: 'Taskbar Button', meaningBn: 'Windows-এ টাস্কবারে চালু প্রোগ্রামের আইকন। এতে ক্লিক করে উইন্ডো সামনে আনা বা নামিয়ে রাখা যায়। Mac-এ এর কাজ করে ডকের আইকন।', module: 3 },
  { id: 'alt-tab', termBn: 'অল্ট-ট্যাব', termEn: 'Alt+Tab', meaningBn: 'Windows-এর শর্টকাট: Alt চেপে ধরে Tab চাপলে আগে ব্যবহার করা উইন্ডোতে চলে যাওয়া যায়।', module: 3 },
  { id: 'cmd-tab', termBn: 'কমান্ড-ট্যাব', termEn: 'Cmd+Tab', meaningBn: 'Mac-এর শর্টকাট: Command (⌘) চেপে ধরে Tab চাপলে আগে ব্যবহার করা প্রোগ্রামে চলে যাওয়া যায়।', module: 3 },
  { id: 'shortcut-pad', termBn: 'শর্টকাট প্যাড', termEn: 'Shortcut Pad', meaningBn: 'এই অ্যাপের পর্দায় আঁকা কিবোর্ড-বোতাম। ব্রাউজার যেসব শর্টকাট (যেমন Alt+Tab) আটকে দেয়, সেগুলো এখানে ক্লিক করে অনুশীলন করা যায়।', module: 3 },
]

export default entries
