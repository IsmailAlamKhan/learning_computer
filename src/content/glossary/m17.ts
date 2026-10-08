import type { GlossaryEntry } from '../../engine/types'

const entries: GlossaryEntry[] = [
  { id: 'term-terminal', termBn: 'টার্মিনাল', termEn: 'Terminal', meaningBn: 'কম্পিউটারকে লিখে নির্দেশ দেওয়ার একটি উইন্ডো। ক্লিক না করে কমান্ড টাইপ করে ফাইল-ফোল্ডারের কাজ করা যায়।', module: 17 },
  { id: 'term-command-line', termBn: 'কমান্ড লাইন', termEn: 'Command Line', meaningBn: 'যে লাইনে আপনি কমান্ড লেখেন, আর কম্পিউটার সেটা পড়ে কাজ করে। টার্মিনালে কাজ করাকেই কমান্ড লাইনে কাজ করা বলে।', module: 17 },
  { id: 'term-shell', termBn: 'শেল', termEn: 'Shell', meaningBn: 'টার্মিনালের ভেতরে যে প্রোগ্রামটি আপনার লেখা কমান্ড বুঝে কম্পিউটারকে দিয়ে কাজ করায়। যেমন PowerShell, zsh।', module: 17 },
  { id: 'term-powershell', termBn: 'পাওয়ারশেল', termEn: 'PowerShell', meaningBn: 'Windows-এর টার্মিনালের শেল। প্রম্পটের শুরুতে PS লেখা থাকে।', module: 17 },
  { id: 'term-zsh', termBn: 'জেডশেল ও Mac টার্মিনাল', termEn: 'zsh / Terminal app', meaningBn: 'Mac-এ Terminal নামের প্রোগ্রাম খুললে যে শেলটি চলে তার নাম zsh। প্রম্পটের শেষে % চিহ্ন থাকে।', module: 17 },
  { id: 'term-command', termBn: 'কমান্ড', termEn: 'Command', meaningBn: 'কম্পিউটারকে দেওয়া একটি ছোট লেখা-নির্দেশ, যেমন ls বা mkdir। Enter চাপলে কম্পিউটার সেটি করে।', module: 17 },
  { id: 'term-argument', termBn: 'আর্গুমেন্ট', termEn: 'Argument', meaningBn: 'কমান্ডের পরে যে নাম বা তথ্য দেওয়া হয়। যেমন cd Documents-এ Documents হলো আর্গুমেন্ট; অর্থাৎ কোথায় যাবে।', module: 17 },
  { id: 'term-prompt', termBn: 'প্রম্পট', termEn: 'Prompt', meaningBn: 'টার্মিনালে প্রতিটি লাইনের শুরুর অংশ। এতে এখনকার ফোল্ডার দেখা যায় আর শেষের চিহ্নের (> বা %) পরে কমান্ড লিখতে হয়।', module: 17 },
  { id: 'term-current-directory', termBn: 'বর্তমান ফোল্ডার', termEn: 'Current Directory (Working Folder)', meaningBn: 'টার্মিনাল এখন যে ফোল্ডারে দাঁড়িয়ে আছে। ফাইলের নাম লিখলে সাধারণত এই ফোল্ডারেই খোঁজা হয়।', module: 17 },
  { id: 'term-pwd', termBn: 'pwd কমান্ড', termEn: 'pwd', meaningBn: 'এখন কোন ফোল্ডারে আছেন তার পুরো পথ দেখায়। (print working directory)', module: 17 },
  { id: 'term-ls', termBn: 'ls / dir কমান্ড', termEn: 'ls / dir', meaningBn: 'বর্তমান ফোল্ডারে কী কী ফাইল-ফোল্ডার আছে তার তালিকা দেখায়। Windows-এ dir আর Mac-এ ls; PowerShell-এ দুটোই চলে।', module: 17 },
  { id: 'term-cd', termBn: 'cd কমান্ড', termEn: 'cd', meaningBn: 'অন্য ফোল্ডারে যায় (change directory)। cd .. দিলে এক ধাপ ওপরে, cd ~ দিলে হোম ফোল্ডারে যায়।', module: 17 },
  { id: 'term-mkdir', termBn: 'mkdir কমান্ড', termEn: 'mkdir', meaningBn: 'নতুন ফোল্ডার বানায় (make directory)। যেমন mkdir coding।', module: 17 },
  { id: 'term-touch', termBn: 'touch / ni কমান্ড', termEn: 'touch / ni', meaningBn: 'নতুন খালি ফাইল বানায়। Mac-এ touch, Windows PowerShell-এ ni (New-Item)।', module: 17 },
  { id: 'term-cat', termBn: 'cat / type কমান্ড', termEn: 'cat / type', meaningBn: 'ফাইলের ভেতরের লেখা পর্দায় দেখায়। Mac-এ cat, Windows-এ type; PowerShell-এ cat-ও চলে।', module: 17 },
  { id: 'term-echo', termBn: 'echo কমান্ড', termEn: 'echo', meaningBn: 'যা লেখেন তা পর্দায় ফেরত দেখায়। সাথে > ফাইলের-নাম দিলে লেখাটা পর্দার বদলে ফাইলে চলে যায়।', module: 17 },
  { id: 'term-clear', termBn: 'clear / cls কমান্ড', termEn: 'clear / cls', meaningBn: 'টার্মিনালের পর্দা পরিষ্কার করে। Mac-এ clear, Windows-এ cls। ফাইল বা কাজ মোছে না।', module: 17 },
  { id: 'term-tab-completion', termBn: 'ট্যাব দিয়ে নাম সম্পূর্ণ করা', termEn: 'Tab Completion', meaningBn: 'নামের প্রথম কয়েকটি অক্ষর লিখে Tab চাপলে টার্মিনাল বাকিটুকু নিজে লিখে দেয়। সময় বাঁচে, বানান ভুলও কমে।', module: 17 },
  { id: 'term-history', termBn: 'কমান্ডের ইতিহাস', termEn: 'Command History', meaningBn: 'আগে যেসব কমান্ড লিখেছেন তার তালিকা। ↑ (ওপরের তীর) চাপলে আগের কমান্ড ফিরে আসে।', module: 17 },
  { id: 'term-redirect', termBn: 'রিডাইরেক্ট (>)', termEn: 'Redirect', meaningBn: '> চিহ্ন দিয়ে কমান্ডের ফলাফল পর্দার বদলে ফাইলে পাঠানো। যেমন echo hello > hello.txt।', module: 17 },
  { id: 'term-dangerous-command', termBn: 'বিপজ্জনক কমান্ড', termEn: 'Dangerous Command', meaningBn: 'যে কমান্ড ফাইল মুছে ফেলে বা কম্পিউটারের গুরুত্বপূর্ণ জিনিস বদলে দেয় (rm, del, format, sudo)। এতে Recycle Bin বা Trash-এ যায় না, ফেরানো কঠিন।', module: 17 },
]

export default entries
