import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'desktop', termBn: 'ডেস্কটপ', termEn: 'Desktop', icon: '🖥️', art: 'desktop', meaningBn: 'কম্পিউটার চালু করলে প্রথমে যে পর্দা দেখা যায় — আপনার পড়ার টেবিলের মতো।', module: 2 },
  { id: 'icon', termBn: 'আইকন', termEn: 'Icon', icon: '🖼️', meaningBn: 'ফাইল, ফোল্ডার বা প্রোগ্রামের ছোট ছবি। ক্লিক করে বাছা বা খোলা যায়।', module: 2 },
  { id: 'click', termBn: 'ক্লিক', termEn: 'Click', icon: '👆', art: 'hand-click', meaningBn: 'মাউসের বাঁ বোতাম (বা টাচপ্যাডে এক টোকা) একবার চাপা। কিছু বেছে নেওয়ার জন্য।', module: 2 },
  { id: 'double-click', termBn: 'ডাবল ক্লিক', termEn: 'Double Click', icon: '✌️', meaningBn: 'পরপর দুবার চটপট ক্লিক। কিছু খোলার জন্য।', module: 2 },
  { id: 'right-click', termBn: 'রাইট ক্লিক', termEn: 'Right Click', icon: '📋', meaningBn: 'মাউসের ডান বোতাম (টাচপ্যাডে দুই আঙুলে ট্যাপ) চাপা। একটা মেনু আসে।', module: 2 },
  { id: 'drag-drop', termBn: 'ড্র্যাগ অ্যান্ড ড্রপ', termEn: 'Drag and Drop', icon: '✋', meaningBn: 'কিছু ধরে টেনে নিয়ে অন্য জায়গায় ছেড়ে দেওয়া।', module: 2 },
  { id: 'taskbar', termBn: 'টাস্কবার', termEn: 'Taskbar', icon: '▬', art: 'taskbar', meaningBn: 'Windows-এ পর্দার নিচের লম্বা বার — স্টার্ট বোতাম, চালু প্রোগ্রাম আর ঘড়ি এখানে।', module: 2 },
  { id: 'start-menu', termBn: 'স্টার্ট মেনু', termEn: 'Start Menu', icon: '🪟', art: 'start-button', meaningBn: 'Windows-এ স্টার্ট বোতাম চাপলে খোলা তালিকা, যেখান থেকে প্রোগ্রাম চালু করা যায়।', module: 2 },
  { id: 'dock', termBn: 'ডক', termEn: 'Dock', icon: '🧲', art: 'dock', meaningBn: 'Mac-এ পর্দার নিচের আইকনের সারি — প্রিয় আর চালু প্রোগ্রাম এখানে থাকে।', module: 2 },
  { id: 'launchpad', termBn: 'লঞ্চপ্যাড', termEn: 'Launchpad', icon: '🚀', meaningBn: 'Mac-এ সব প্রোগ্রামের আইকন একসাথে দেখার পর্দা।', module: 2 },
  { id: 'menu-bar', termBn: 'মেনু বার', termEn: 'Menu Bar', icon: '📑', meaningBn: 'Mac-এ পর্দার একদম ওপরের বার — মেনু, ঘড়ি আর ওয়াই-ফাই এখানে।', module: 2 },
  { id: 'context-menu', termBn: 'মেনু (রাইট ক্লিক মেনু)', termEn: 'Context Menu', icon: '📜', meaningBn: 'রাইট ক্লিক করলে আসা ছোট তালিকা, যেখানে সেই জিনিসের কাজগুলো লেখা থাকে।', module: 2 },
  { id: 'folder', termBn: 'ফোল্ডার', termEn: 'Folder', icon: '📁', art: 'folder', meaningBn: 'ফাইল সাজিয়ে রাখার জায়গা, আলমারির তাকের মতো।', module: 2 },
  { id: 'system-tray', termBn: 'সিস্টেম ট্রে (ডান কোণের চিহ্ন)', termEn: 'System Tray', icon: '📶', meaningBn: 'টাস্কবারের ডান কোণের ছোট চিহ্ন — ওয়াই-ফাই, আওয়াজ, ব্যাটারি আর ঘড়ি।', module: 2 },
]

export default entries
