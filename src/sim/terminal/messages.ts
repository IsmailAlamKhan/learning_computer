/** Learner-facing Bengali texts of the practice terminal (kept apart from the engine logic). */
import type { OsFlavor } from '../../engine/types'

export const VERSIONS = {
  python: 'Python 3.12.4',
  node: 'v22.12.0',
  gitWindows: 'git version 2.46.0.windows.1',
  gitMac: 'git version 2.39.5 (Apple Git-154)',
}

export const HINT_HELP = 'help লিখে Enter চাপুন'

export function bannerLines(flavor: OsFlavor, now = new Date()): string[] {
  const practice = 'Practice terminal — আসল কম্পিউটারের কিছুই বদলাবে না'
  if (flavor === 'windows') return ['Windows PowerShell', practice, '', `সাহায্য: ${HINT_HELP}`, '']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const p = (n: number) => String(n).padStart(2, '0')
  const stamp = `${days[now.getDay()]} ${months[now.getMonth()]} ${String(now.getDate()).padStart(2, ' ')} ${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`
  return [`Last login: ${stamp} on ttys001`, practice, '', `সাহায্য: ${HINT_HELP}`, '']
}

export const DANGEROUS = new Set([
  'rm', 'rmdir', 'del', 'erase', 'rd', 'remove-item', 'ri', 'format', 'shutdown', 'sudo', 'chmod', 'chown', 'stop-computer', 'restart-computer', 'diskpart', 'mkfs', 'dd',
])

export function dangerousLines(cmd: string): string[] {
  const c = cmd.toLowerCase()
  const head = `এই অনুশীলন-টার্মিনালে এই কমান্ডটি (${cmd}) বন্ধ করা আছে। চিন্তার কিছু নেই, আপনি কিছু ভুল করেননি — এটা শুধু আপনাকে নিরাপদ রাখার জন্য।`
  const tail = 'তাই আসল কম্পিউটারে এ ধরনের কমান্ড লেখার আগে প্রতিটি অক্ষর দু’বার দেখে নিন, আর নিশ্চিত না হলে কাউকে জিজ্ঞেস করুন।'
  if (c === 'sudo' || c === 'chmod' || c === 'chown') {
    return [
      head,
      'আসল কম্পিউটারে কেন সাবধান থাকতে হয়:',
      '  • sudo মানে “অ্যাডমিনের পূর্ণ ক্ষমতায় চালাও”। তখন কম্পিউটারের জরুরি ফাইলও বদলে বা মুছে ফেলা যায়।',
      '  • এই ক্ষমতা পেলে ছোট একটা টাইপের ভুলও বড় ক্ষতি করতে পারে।',
      tail,
    ]
  }
  if (c === 'shutdown' || c === 'stop-computer' || c === 'restart-computer') {
    return [
      head,
      'আসল কম্পিউটারে কেন সাবধান থাকতে হয়:',
      '  • এই কমান্ড দিলে কম্পিউটার সঙ্গে সঙ্গে বন্ধ বা রিস্টার্ট হয়ে যেতে পারে, আর সেভ না করা কাজ হারিয়ে যায়।',
      '  • বন্ধ করতে চাইলে Start / Apple মেনু থেকে স্বাভাবিক নিয়মে বন্ধ করাই নিরাপদ।',
      tail,
    ]
  }
  if (c === 'format' || c === 'diskpart' || c === 'mkfs' || c === 'dd') {
    return [
      head,
      'আসল কম্পিউটারে কেন সাবধান থাকতে হয়:',
      '  • এই ধরনের কমান্ড পুরো ড্রাইভের সব ফাইল মুছে খালি করে দিতে পারে।',
      '  • মুছে যাওয়া জিনিস ফিরিয়ে আনা প্রায় অসম্ভব।',
      tail,
    ]
  }
  return [
    head,
    'আসল কম্পিউটারে কেন সাবধান থাকতে হয়:',
    '  • টার্মিনাল থেকে মুছলে ফাইল Recycle Bin / Trash-এ যায় না। তাই আর ফিরিয়ে আনা যায় না।',
    '  • rm -rf বা del /s লিখলে একটা পুরো ফোল্ডার, তার ভেতরের সবকিছুসহ, এক মুহূর্তে মুছে যায়।',
    '  • ফাইল মুছতে চাইলে File Explorer / Finder ব্যবহার করুন, সেখানে ভুল হলেও ফিরিয়ে আনার সুযোগ থাকে।',
    tail,
  ]
}

export function helpLines(flavor: OsFlavor): string[] {
  const win = flavor === 'windows'
  const rows: [string, string][] = win
    ? [
        ['pwd', 'এখন কোন ফোল্ডারে আছেন দেখায় (Get-Location)'],
        ['ls / dir', 'ফোল্ডারের ভেতরে কী কী আছে দেখায় (Get-ChildItem)'],
        ['cd নাম', 'অন্য ফোল্ডারে যায়। cd .. = এক ধাপ উপরে, cd ~ = হোম ফোল্ডার'],
        ['mkdir নাম', 'নতুন ফোল্ডার বানায় (md-ও চলে)'],
        ['ni নাম.txt', 'নতুন খালি ফাইল বানায় (New-Item)'],
        ['type / cat ফাইল', 'ফাইলের লেখা দেখায়'],
        ['echo লেখা', 'লেখাটা পর্দায় দেখায়। echo লেখা > ফাইল.txt দিলে ফাইলে লেখা হয়'],
        ['copy / cp, move / mv', 'ফাইল কপি করে বা সরায় (বা নাম বদলায়)'],
        ['cls / clear', 'পর্দা পরিষ্কার করে'],
        ['python ফাইল.py (বা py)', 'পাইথন প্রোগ্রাম চালায়'],
        ['node ফাইল.js', 'জাভাস্ক্রিপ্ট প্রোগ্রাম চালায়'],
        ['python --version, node --version, git --version', 'কোন সংস্করণ বসানো আছে দেখায়'],
        ['help', 'এই তালিকা'],
      ]
    : [
        ['pwd', 'এখন কোন ফোল্ডারে আছেন দেখায়'],
        ['ls', 'ফোল্ডারের ভেতরে কী কী আছে দেখায় (ls -l বিস্তারিত, ls -a লুকানোসহ)'],
        ['cd নাম', 'অন্য ফোল্ডারে যায়। cd .. = এক ধাপ উপরে, cd ~ = হোম ফোল্ডার'],
        ['mkdir নাম', 'নতুন ফোল্ডার বানায় (mkdir -p a/b ভেতরে ভেতরে বানায়)'],
        ['touch নাম.txt', 'নতুন খালি ফাইল বানায়'],
        ['cat ফাইল', 'ফাইলের লেখা দেখায়'],
        ['echo লেখা', 'লেখাটা পর্দায় দেখায়। echo লেখা > ফাইল.txt দিলে ফাইলে লেখা হয়'],
        ['cp, mv', 'ফাইল কপি করে, সরায় (বা নাম বদলায়)'],
        ['clear', 'পর্দা পরিষ্কার করে (Ctrl+L-ও চলে)'],
        ['python3 ফাইল.py', 'পাইথন প্রোগ্রাম চালায়'],
        ['node ফাইল.js', 'জাভাস্ক্রিপ্ট প্রোগ্রাম চালায়'],
        ['python3 --version, node --version, git --version', 'কোন সংস্করণ বসানো আছে দেখায়'],
        ['help', 'এই তালিকা'],
      ]
  return [
    'এই অনুশীলন-টার্মিনালে এই কমান্ডগুলো চলে:',
    '',
    ...rows.map(([a, b]) => `  ${a.padEnd(22)} ${b}`),
    '',
    'টিপস: Tab চাপলে নাম নিজে নিজে সম্পূর্ণ হয়। ↑ ↓ তীর দিয়ে আগের কমান্ড ফিরিয়ে আনা যায়। Ctrl+C চাপলে লাইনটা মুছে যায়।',
    'মোছার কমান্ড (rm, del…) এখানে বন্ধ আছে — আসল কম্পিউটারের নিরাপত্তার কথা ভেবে।',
  ]
}
