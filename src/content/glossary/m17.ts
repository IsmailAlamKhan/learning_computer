import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'term-terminal', termBn: 'টার্মিনাল', termEn: 'Terminal', icon: '⌨️', art: 'terminal', meaningBn: 'কম্পিউটারকে লিখে নির্দেশ দেওয়ার উইন্ডো। ক্লিকের বদলে কমান্ড টাইপ করে কাজ হয়।', module: 17 },
  { id: 'term-command-line', termBn: 'কমান্ড লাইন', termEn: 'Command Line', icon: '📝', meaningBn: 'যে লাইনে কমান্ড লেখেন আর কম্পিউটার পড়ে কাজ করে। টার্মিনালে কাজ মানেই কমান্ড লাইনে কাজ।', module: 17 },
  { id: 'term-shell', termBn: 'শেল', termEn: 'Shell', icon: '🐚', meaningBn: 'টার্মিনালের ভেতরের প্রোগ্রাম, যা আপনার কমান্ড বুঝে কাজ করায়। যেমন PowerShell, zsh।', module: 17 },
  { id: 'term-powershell', termBn: 'পাওয়ারশেল', termEn: 'PowerShell', icon: '🪟', meaningBn: 'Windows-এর টার্মিনালের শেল। প্রম্পটের শুরুতে PS লেখা থাকে।', module: 17 },
  { id: 'term-zsh', termBn: 'জেডশেল ও Mac টার্মিনাল', termEn: 'zsh / Terminal app', icon: '🍎', meaningBn: 'Mac-এর Terminal অ্যাপের শেল। প্রম্পটের শেষে % চিহ্ন থাকে।', module: 17 },
  { id: 'term-command', termBn: 'কমান্ড', termEn: 'Command', icon: '💬', meaningBn: 'কম্পিউটারকে দেওয়া ছোট লেখা-নির্দেশ, যেমন ls বা mkdir। Enter চাপলে কাজ হয়।', module: 17 },
  { id: 'term-argument', termBn: 'আর্গুমেন্ট', termEn: 'Argument', icon: '🏷️', meaningBn: 'কমান্ডের পরের নাম বা তথ্য। cd Documents-এ Documents হলো আর্গুমেন্ট, মানে কোথায় যাবে।', module: 17 },
  { id: 'term-prompt', termBn: 'প্রম্পট', termEn: 'Prompt', icon: '▶️', art: 'terminal', meaningBn: 'প্রতি লাইনের শুরুর অংশ। এখনকার ফোল্ডার দেখায়; শেষের চিহ্নের (> বা %) পরে কমান্ড লিখতে হয়।', module: 17 },
  { id: 'term-current-directory', termBn: 'বর্তমান ফোল্ডার', termEn: 'Current Directory (Working Folder)', icon: '📍', art: 'folder-open', meaningBn: 'টার্মিনাল এখন যে ফোল্ডারে দাঁড়িয়ে আছে। ফাইলের নাম সাধারণত এখানেই খোঁজা হয়।', module: 17 },
  { id: 'term-pwd', termBn: 'pwd কমান্ড', termEn: 'pwd', icon: '🧭', meaningBn: 'এখন কোন ফোল্ডারে আছেন, তার পুরো পথ দেখায়। (print working directory)', module: 17 },
  { id: 'term-ls', termBn: 'ls / dir কমান্ড', termEn: 'ls / dir', icon: '📃', meaningBn: 'এই ফোল্ডারে কী কী আছে দেখায়। Windows-এ dir, Mac-এ ls; PowerShell-এ দুটোই চলে।', module: 17 },
  { id: 'term-cd', termBn: 'cd কমান্ড', termEn: 'cd', icon: '🚪', meaningBn: 'অন্য ফোল্ডারে যায়। cd .. এক ধাপ ওপরে, cd ~ হোম ফোল্ডারে।', module: 17 },
  { id: 'term-mkdir', termBn: 'mkdir কমান্ড', termEn: 'mkdir', icon: '📁', meaningBn: 'নতুন ফোল্ডার বানায় (make directory)। যেমন mkdir coding।', module: 17 },
  { id: 'term-touch', termBn: 'touch / ni কমান্ড', termEn: 'touch / ni', icon: '📄', meaningBn: 'নতুন খালি ফাইল বানায়। Mac-এ touch, Windows PowerShell-এ ni।', module: 17 },
  { id: 'term-cat', termBn: 'cat / type কমান্ড', termEn: 'cat / type', icon: '👀', meaningBn: 'ফাইলের ভেতরের লেখা পর্দায় দেখায়। Mac-এ cat, Windows-এ type।', module: 17 },
  { id: 'term-echo', termBn: 'echo কমান্ড', termEn: 'echo', icon: '📢', meaningBn: 'যা লেখেন তা পর্দায় দেখায়। শেষে > ফাইল দিলে লেখা ফাইলে যায়।', module: 17 },
  { id: 'term-clear', termBn: 'clear / cls কমান্ড', termEn: 'clear / cls', icon: '🧹', meaningBn: 'টার্মিনালের পর্দা পরিষ্কার করে। Mac-এ clear, Windows-এ cls। কিছু মোছে না।', module: 17 },
  { id: 'term-tab-completion', termBn: 'ট্যাব দিয়ে নাম সম্পূর্ণ করা', termEn: 'Tab Completion', icon: '⇥', meaningBn: 'নামের প্রথম কটা অক্ষর লিখে Tab চাপলে বাকিটা টার্মিনাল নিজে লিখে দেয়।', module: 17 },
  { id: 'term-history', termBn: 'কমান্ডের ইতিহাস', termEn: 'Command History', icon: '🕘', meaningBn: 'আগে লেখা কমান্ডের তালিকা। ↑ চাপলে আগের কমান্ড ফিরে আসে।', module: 17 },
  { id: 'term-redirect', termBn: 'রিডাইরেক্ট (>)', termEn: 'Redirect', icon: '➡️', meaningBn: '> চিহ্ন দিয়ে ফলাফল পর্দার বদলে ফাইলে পাঠানো। যেমন echo hello > hello.txt।', module: 17 },
  { id: 'term-dangerous-command', termBn: 'বিপজ্জনক কমান্ড', termEn: 'Dangerous Command', icon: '⚠️', art: 'warning', meaningBn: 'যে কমান্ড ফাইল চিরতরে মোছে বা গুরুত্বপূর্ণ জিনিস বদলায় (rm, del, format, sudo)। ফেরানো কঠিন।', module: 17 },
]

export default entries
